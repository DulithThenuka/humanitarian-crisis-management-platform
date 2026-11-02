import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ShieldAlert,
  TrendingUp,
  MapPin,
  Navigation,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Crosshair,
  Route,
  Zap,
  X,
  Target
} from 'lucide-react';
import './OperationalMapView.css';

// SVG DivIcons for Leaflet
const createCustomIcon = (bgColor, symbol, size = 28) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: radial-gradient(circle, ${bgColor} 0%, #081d26 100%);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 12px ${bgColor}, inset 0 0 4px rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 900;
        font-size: 11px;
        cursor: pointer;
      ">
        ${symbol || ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

// Pulsating "NEW GPS PIN DROP" Marker
const createDroppedPinIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="dropped-pin-container">
        <div class="dropped-pin-badge">
          <span class="dropped-pin-icon-wrap">📍</span>
          <span class="dropped-pin-label">NEW GPS PIN DROP</span>
        </div>
      </div>
    `,
    iconSize: [160, 40],
    iconAnchor: [20, 20]
  });
};

const ICONS = {
  service: createCustomIcon('#0ea5e9', '★', 28),
  resource: createCustomIcon('#f59e0b', '▲', 26),
  requestHigh: createCustomIcon('#0284c7', '!', 26),
  requestCritical: createCustomIcon('#ef4444', '!', 30),
  shelter: createCustomIcon('#10b981', 'S', 28),
  volunteer: createCustomIcon('#8b5cf6', 'V', 24),
  userPin: createDroppedPinIcon(),
  myLocPin: createCustomIcon('#38bdf8', '📍', 32)
};

const INITIAL_MAP_NODES = [
  {
    id: 'SRV-001',
    type: 'SERVICE',
    name: 'Western Province DMC Emergency Command Post',
    location: 'Colombo 07, Cinnamon Gardens',
    distance: '6.0 km',
    eta: '12 min ETA via Baseline Rd',
    lat: 6.9044,
    lng: 79.8732
  },
  {
    id: 'DEP-GAM-1',
    type: 'RESOURCE',
    name: 'Gampaha Strategic Logistics Hub',
    location: 'Gampaha Outer Junction',
    distance: '14.2 km',
    eta: '24 min ETA via Kandy Rd',
    stockStatus: 'High Stock (820 Packs)',
    lat: 7.0897,
    lng: 79.9925
  },
  {
    id: 'DEP-COL-1',
    type: 'RESOURCE',
    name: 'Colombo Central Depot Hub',
    location: 'Pettah Main Logistics Base',
    distance: '2.4 km',
    eta: '11 min ETA via Port Access',
    stockStatus: 'High Stock (450 Kits)',
    lat: 6.9382,
    lng: 79.8546
  },
  {
    id: 'REQ-01865',
    type: 'REQUEST',
    name: 'Peliyagoda Commercial Sector Flood Cluster',
    location: 'Peliyagoda West',
    priority: 'HIGH',
    distance: '3.1 km',
    eta: '9 min ETA via Katunayake Expy',
    lat: 6.9685,
    lng: 79.8821
  },
  {
    id: 'SHL-KEL',
    type: 'SHELTER',
    name: 'Kelaniya River Safe Camp',
    location: 'Kelaniya Raja Maha Vihara Grounds',
    occupancyPct: 88,
    availableBeds: 15,
    distance: '1.2 km',
    eta: '7 min ETA via B214',
    lat: 6.9535,
    lng: 79.9192
  },
  {
    id: 'REQ-01842',
    type: 'REQUEST',
    name: 'Kelani North Low-Lying Breach Point',
    location: 'Sedawatta Canal Basin, Kelaniya',
    priority: 'CRITICAL',
    distance: '1.8 km',
    eta: '6 min ETA via Baseline Rd',
    lat: 6.9450,
    lng: 79.8880
  },
  {
    id: 'VOL-ALPHA',
    type: 'VOLUNTEER',
    name: 'Rapid Response Team Alpha (8 Rescuers)',
    location: 'Sedawatta Riverbank Access',
    distance: '0.8 km',
    eta: '3 min on foot / boat',
    lat: 6.9410,
    lng: 79.8850
  },
  {
    id: 'SHL-COL-1',
    type: 'SHELTER',
    name: 'Colombo Central Relief Shelter',
    location: 'Vidyalaya Mawatha, Colombo 10',
    occupancyPct: 74,
    availableBeds: 66,
    distance: '4.8 km',
    eta: '12 min',
    routeNote: 'Route calculated via Baseline Rd with flood water slowdown at Orugodawatta.',
    lat: 6.9271,
    lng: 79.8612
  },
  {
    id: 'REQ-01899',
    type: 'REQUEST',
    name: 'Kalutara South Riverside Evacuation',
    location: 'Kalu Ganga Delta, Kalutara',
    priority: 'HIGH',
    distance: '28.4 km',
    eta: '38 min ETA via Southern Expy',
    lat: 6.5854,
    lng: 79.9607
  },
  {
    id: 'SHL-KAL',
    type: 'SHELTER',
    name: 'Kalutara Central Haven Camp',
    location: 'Kalutara Urban Council Hall',
    occupancyPct: 62,
    availableBeds: 76,
    distance: '29.1 km',
    eta: '40 min ETA',
    lat: 6.5800,
    lng: 79.9650
  }
];

const ROUTE_LINE = [
  [6.9382, 79.8546],
  [6.9450, 79.8650],
  [6.9535, 79.8780],
  [6.9450, 79.8880]
];

// Handles flying to coordinates
function MapViewController({ targetCenter }) {
  const map = useMap();

  useEffect(() => {
    if (targetCenter) {
      map.flyTo([targetCenter.lat, targetCenter.lng], 13.5, {
        animate: true,
        duration: 1.2
      });
    }
  }, [targetCenter, map]);

  return null;
}

// Click listener to drop pin on map
function MapInteractionListener({ isCapturing, onPinDrop }) {
  useMapEvents({
    click(e) {
      if (isCapturing) {
        onPinDrop(e.latlng);
      }
    }
  });
  return null;
}

export const OperationalMapView = () => {
  const [layers, setLayers] = useState({
    crisisZones: true,
    requests: true,
    shelters: true,
    resources: true,
    volunteers: true,
    serviceCentres: true
  });

  const [selectedNode, setSelectedNode] = useState(INITIAL_MAP_NODES[7]);
  const [targetCenter, setTargetCenter] = useState(null);
  const [myLocationNode, setMyLocationNode] = useState(null);

  // Capture mode & Location Capture Form state
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCaptureForm, setShowCaptureForm] = useState(false);
  const [capturedCoordinates, setCapturedCoordinates] = useState({
    lat: '7.0818° N',
    lng: '79.4648° E',
    rawLat: 7.0818,
    rawLng: 79.4648,
    sectorDesc: 'Captured Location @ Near Sector [X:236, Y:192]'
  });

  // Form Fields
  const [requesterName, setRequesterName] = useState('Kavindu Perera');
  const [assistanceCategory, setAssistanceCategory] = useState('Medical Assistance');
  const [severityLevel, setSeverityLevel] = useState('CRITICAL');
  const [incidentDetails, setIncidentDetails] = useState('Flash flooding stranded 3 adults on upper rooftop terrace.');
  const [capturedPins, setCapturedPins] = useState([]);

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle "Capture Incident GPS" Button
  const handleToggleCapture = () => {
    if (!isCapturing) {
      setIsCapturing(true);
      setShowCaptureForm(true);
      setCapturedCoordinates({
        lat: '7.0818° N',
        lng: '79.4648° E',
        rawLat: 7.0818,
        rawLng: 79.4648,
        sectorDesc: 'Captured Location @ Near Sector [X:236, Y:192]'
      });
    } else {
      setIsCapturing(false);
      setShowCaptureForm(false);
    }
  };

  // User clicks on map canvas while capturing
  const handlePinDrop = (latlng) => {
    const formattedLat = `${latlng.lat.toFixed(4)}° N`;
    const formattedLng = `${latlng.lng.toFixed(4)}° E`;

    const newPinObj = {
      id: `PIN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'REQUEST',
      name: `Citizen GPS Request #${requesterName}`,
      location: `Coordinates: ${formattedLat}, ${formattedLng}`,
      priority: severityLevel,
      distance: '2.1 km',
      eta: '7 min ETA to Nearest Hub',
      routeNote: `Citizen request logged at [${formattedLat}, ${formattedLng}]. Proximity dispatched to nearest unit.`,
      lat: latlng.lat,
      lng: latlng.lng
    };

    setCapturedCoordinates({
      lat: formattedLat,
      lng: formattedLng,
      rawLat: latlng.lat,
      rawLng: latlng.lng,
      sectorDesc: `Captured Location @ Selected Coordinates [${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}]`
    });

    setCapturedPins([newPinObj]);
    setSelectedNode(newPinObj);
    setShowCaptureForm(false); // Close form and show the detail card immediately
    setIsCapturing(false);
  };

  // Submit and register the incident
  const handleRegisterIncident = (e) => {
    e.preventDefault();
    const registeredNode = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'REQUEST',
      name: `Citizen Request: ${requesterName}`,
      location: `Coordinates: ${capturedCoordinates.lat}, ${capturedCoordinates.lng}`,
      priority: severityLevel,
      distance: '2.1 km',
      eta: '7 min ETA to Nearest Hub',
      routeNote: incidentDetails,
      lat: capturedCoordinates.rawLat,
      lng: capturedCoordinates.rawLng
    };

    setCapturedPins([registeredNode]);
    setSelectedNode(registeredNode);
    setIsCapturing(false);
    setShowCaptureForm(false);
  };

  // Automated Geolocation & Fly-to Navigation
  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const myLoc = {
            id: 'LOC-ME',
            type: 'SERVICE',
            name: 'Your Current Live Location',
            location: `Detected Coordinates: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
            distance: '0.0 km',
            eta: 'Current Terminal Position',
            lat: lat,
            lng: lng
          };

          setMyLocationNode(myLoc);
          setSelectedNode(myLoc);
          setShowCaptureForm(false);
          setTargetCenter({ lat, lng });
        },
        () => {
          const fallback = {
            id: 'LOC-HQ',
            type: 'SERVICE',
            name: 'Colombo Central Command Post (HQ)',
            location: 'Colombo 07 Emergency Control Center',
            distance: '0.0 km',
            eta: 'Active Operations Room',
            lat: 6.9044,
            lng: 79.8732
          };
          setMyLocationNode(fallback);
          setSelectedNode(fallback);
          setShowCaptureForm(false);
          setTargetCenter({ lat: 6.9044, lng: 79.8732 });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  return (
    <div className="command-map-fullscreen">
      {/* 1. TOP COMMAND BAR */}
      <header className="cmd-map-topbar">
        <div className="cmd-topbar-left">
          <span className="crumb-dim">Intelligence / Maps</span>
          <span className="crumb-slash">/</span>
          <h1 className="crumb-title">Operational Geospatial Command Center</h1>
          <span className="engine-badge">
            <span className="badge-pulse"></span>
            OSRM · GPS ENGINE ACTIVE
          </span>
        </div>

        <div className="cmd-topbar-actions">
          <button 
            className={`cmd-btn btn-capture ${isCapturing ? 'active-capture' : ''}`}
            onClick={handleToggleCapture}
          >
            {isCapturing ? <X size={14} /> : <Crosshair size={14} />}
            <span>{isCapturing ? 'Cancel Pin-Drop' : '+ Capture Incident GPS'}</span>
          </button>

          <button className="cmd-btn btn-locate" onClick={handleMyLocation}>
            <Navigation size={14} />
            <span>My Location</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="cmd-map-body-grid">
        {/* ---------------- LEFT CONTROLS DOCK ---------------- */}
        <aside className="cmd-left-dock">
          {/* Layer Visibility Box */}
          <div className="dock-card">
            <div className="dock-card-header">
              <span className="card-heading-upper">MAP LAYER VISIBILITY</span>
              <span className="layer-count-chip">6 Layers</span>
            </div>

            <div className="dock-layers-list">
              <label className="dock-layer-item">
                <div className="layer-item-left">
                  <span className="dock-dot dot-red"></span>
                  <span>Crisis Zones (Buffer)</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={layers.crisisZones} 
                  onChange={() => toggleLayer('crisisZones')} 
                />
              </label>

              <label className="dock-layer-item">
                <div className="layer-item-left">
                  <span className="dock-dot dot-cyan"></span>
                  <span>Assistance Requests</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={layers.requests} 
                  onChange={() => toggleLayer('requests')} 
                />
              </label>

              <label className="dock-layer-item">
                <div className="layer-item-left">
                  <span className="dock-dot dot-emerald"></span>
                  <span>Relief Shelters</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={layers.shelters} 
                  onChange={() => toggleLayer('shelters')} 
                />
              </label>

              <label className="dock-layer-item">
                <div className="layer-item-left">
                  <span className="dock-dot dot-amber"></span>
                  <span>Resource Depots</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={layers.resources} 
                  onChange={() => toggleLayer('resources')} 
                />
              </label>

              <label className="dock-layer-item">
                <div className="layer-item-left">
                  <span className="dock-dot dot-purple"></span>
                  <span>Volunteer Rescue Teams</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={layers.volunteers} 
                  onChange={() => toggleLayer('volunteers')} 
                />
              </label>

              <label className="dock-layer-item">
                <div className="layer-item-left">
                  <span className="dock-dot dot-teal"></span>
                  <span>Service Centres</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={layers.serviceCentres} 
                  onChange={() => toggleLayer('serviceCentres')} 
                />
              </label>
            </div>
          </div>

          {/* Active Regional Crisis Box */}
          <div className="dock-card crisis-dock-card">
            <div className="crisis-dock-top">
              <div className="crisis-title-wrap">
                <ShieldAlert size={14} className="text-red" />
                <span className="crisis-tag-label">ACTIVE REGIONAL CRISIS</span>
              </div>
              <span className="critical-badge">Critical</span>
            </div>
            <h3 className="crisis-title-text">Flood Response CR-001</h3>
            <p className="crisis-sub-loc">Western Province · Kelani River Basin</p>
            <div className="crisis-stat-row">
              <span className="stat-dim">Affected Citizens:</span>
              <strong className="stat-bold">12,430</strong>
            </div>
          </div>

          {/* Service Coverage Analysis Box */}
          <div className="dock-card">
            <div className="dock-card-header">
              <div className="coverage-title-wrap">
                <TrendingUp size={14} className="text-teal" />
                <span className="card-heading-upper">SERVICE COVERAGE ANALYSIS</span>
              </div>
              <span className="coverage-pct-badge">84%</span>
            </div>
            <p className="coverage-narrative">
              84% of high-priority requests reside within the 5.0 km rapid service radius of an active shelter.
            </p>

            <div className="coverage-gap-banner">
              <div className="gap-banner-head">
                <AlertTriangle size={13} className="text-amber" />
                <strong>Coverage Gap:</strong>
              </div>
              <p className="gap-banner-text">
                1 unserved evacuation request detected in Wadduwa perimeter exceeding 8km buffer.
              </p>
            </div>
          </div>

          {/* Bottom Legend */}
          <div className="dock-legend-bottom">
            <span className="legend-head">LEGEND</span>
            <div className="legend-item">
              <span className="dock-dot dot-red"></span>
              <span>Critical Crisis Zone (Polygon)</span>
            </div>
          </div>
        </aside>

        {/* ---------------- CENTER REAL MAP CANVAS ---------------- */}
        <section className={`cmd-map-canvas-area ${isCapturing ? 'canvas-crosshair' : ''}`}>
          {/* Top Pin-Drop Mode Notice */}
          {isCapturing && (
            <div className="pin-drop-alert-banner">
              <Target size={16} className="alert-target-icon" />
              <span>PIN-DROP MODE: Click on the terrain map to pinpoint citizen request</span>
            </div>
          )}

          <MapContainer
            center={[6.9271, 79.8812]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', background: '#061217' }}
          >
            {/* OpenStreetMap dark tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="dark-tile-layer"
            />

            <MapViewController targetCenter={targetCenter} />
            <MapInteractionListener isCapturing={isCapturing} onPinDrop={handlePinDrop} />

            {/* Crisis Buffer Isochrones */}
            {layers.crisisZones && (
              <>
                <Circle
                  center={[6.9450, 79.8880]}
                  radius={5000}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: 0.16,
                    weight: 1.5,
                    dashArray: '4, 4'
                  }}
                />
                <Circle
                  center={[6.5854, 79.9607]}
                  radius={4000}
                  pathOptions={{
                    color: '#f59e0b',
                    fillColor: '#f59e0b',
                    fillOpacity: 0.14,
                    weight: 1.5,
                    dashArray: '4, 4'
                  }}
                />
              </>
            )}

            {/* Road Routing Line */}
            <Polyline
              positions={ROUTE_LINE}
              pathOptions={{ color: '#0ea5e9', weight: 4, dashArray: '6, 6' }}
            />

            {/* Service Centres */}
            {layers.serviceCentres && (
              <Marker
                position={[INITIAL_MAP_NODES[0].lat, INITIAL_MAP_NODES[0].lng]}
                icon={ICONS.service}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    setSelectedNode(INITIAL_MAP_NODES[0]);
                    setShowCaptureForm(false);
                  }
                }}
              />
            )}

            {/* Resource Depots */}
            {layers.resources && (
              <>
                <Marker
                  position={[INITIAL_MAP_NODES[1].lat, INITIAL_MAP_NODES[1].lng]}
                  icon={ICONS.resource}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedNode(INITIAL_MAP_NODES[1]);
                      setShowCaptureForm(false);
                    }
                  }}
                />
                <Marker
                  position={[INITIAL_MAP_NODES[2].lat, INITIAL_MAP_NODES[2].lng]}
                  icon={ICONS.resource}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedNode(INITIAL_MAP_NODES[2]);
                      setShowCaptureForm(false);
                    }
                  }}
                />
              </>
            )}

            {/* Assistance Requests */}
            {layers.requests && (
              <>
                <Marker
                  position={[INITIAL_MAP_NODES[3].lat, INITIAL_MAP_NODES[3].lng]}
                  icon={ICONS.requestHigh}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedNode(INITIAL_MAP_NODES[3]);
                      setShowCaptureForm(false);
                    }
                  }}
                />
                <Marker
                  position={[INITIAL_MAP_NODES[5].lat, INITIAL_MAP_NODES[5].lng]}
                  icon={ICONS.requestCritical}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedNode(INITIAL_MAP_NODES[5]);
                      setShowCaptureForm(false);
                    }
                  }}
                />
                <Marker
                  position={[INITIAL_MAP_NODES[8].lat, INITIAL_MAP_NODES[8].lng]}
                  icon={ICONS.requestHigh}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedNode(INITIAL_MAP_NODES[8]);
                      setShowCaptureForm(false);
                    }
                  }}
                />
              </>
            )}

            {/* Shelters */}
            {layers.shelters && (
              <>
                <Marker
                  position={[INITIAL_MAP_NODES[4].lat, INITIAL_MAP_NODES[4].lng]}
                  icon={ICONS.shelter}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedNode(INITIAL_MAP_NODES[4]);
                      setShowCaptureForm(false);
                    }
                  }}
                />
                <Marker
                  position={[INITIAL_MAP_NODES[7].lat, INITIAL_MAP_NODES[7].lng]}
                  icon={ICONS.shelter}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedNode(INITIAL_MAP_NODES[7]);
                      setShowCaptureForm(false);
                    }
                  }}
                />
                <Marker
                  position={[INITIAL_MAP_NODES[9].lat, INITIAL_MAP_NODES[9].lng]}
                  icon={ICONS.shelter}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedNode(INITIAL_MAP_NODES[9]);
                      setShowCaptureForm(false);
                    }
                  }}
                />
              </>
            )}

            {/* Volunteers */}
            {layers.volunteers && (
              <Marker
                position={[INITIAL_MAP_NODES[6].lat, INITIAL_MAP_NODES[6].lng]}
                icon={ICONS.volunteer}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    setSelectedNode(INITIAL_MAP_NODES[6]);
                    setShowCaptureForm(false);
                  }
                }}
              />
            )}

            {/* My Location Live Marker */}
            {myLocationNode && (
              <Marker
                position={[myLocationNode.lat, myLocationNode.lng]}
                icon={ICONS.myLocPin}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    setSelectedNode(myLocationNode);
                    setShowCaptureForm(false);
                  }
                }}
              />
            )}

            {/* Dynamically Dropped GPS Pins */}
            {capturedPins.map(pin => (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={ICONS.userPin}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    setSelectedNode(pin);
                    setShowCaptureForm(false);
                  }
                }}
              />
            ))}
          </MapContainer>

          {/* Scale & Lat/Lng Badges */}
          <div className="canvas-floating-scale">
            <span className="scale-box">10 km scale</span>
          </div>

          <div className="canvas-floating-coords">
            <span>LAT: 6.9271° N · LNG: 79.8612° E · WESTERN BASIN</span>
          </div>

          {/* =========================================================
              FLOATING POPUP DETAIL CARD
              ========================================================= */}
          {selectedNode && (
            <div 
              className="map-figma-popup-card"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="figma-popup-top">
                <span className={`figma-popup-type-pill pill-${selectedNode.type.toLowerCase()}`}>
                  {selectedNode.type}
                </span>
                <button 
                  className="figma-popup-close-btn" 
                  onClick={() => setSelectedNode(null)}
                >
                  <X size={14} />
                </button>
              </div>

              <h2 className="figma-popup-title">{selectedNode.name}</h2>
              <p className="figma-popup-subtitle">{selectedNode.location}</p>

              {/* Occupancy stats */}
              {selectedNode.occupancyPct && (
                <div className="figma-popup-shelter-stats">
                  <div className="stat-unit">
                    <span className="stat-label">OCCUPANCY</span>
                    <strong className="text-orange">{selectedNode.occupancyPct}%</strong>
                  </div>
                  <div className="stat-unit">
                    <span className="stat-label">AVAILABLE</span>
                    <strong className="text-teal">{selectedNode.availableBeds} beds</strong>
                  </div>
                </div>
              )}

              {/* Distance and Routing Box */}
              <div className="figma-popup-route-box">
                <div className="route-box-header">
                  <div className="route-header-left">
                    <Route size={14} className="text-cyan" />
                    <strong>Distance & OSRM Routing</strong>
                  </div>
                  <span className="route-dist-tag">{selectedNode.distance} · {selectedNode.eta}</span>
                </div>
                <p className="route-note-p">
                  {selectedNode.routeNote || selectedNode.eta}
                </p>
              </div>

              {/* Facility Tags */}
              <div className="figma-popup-tags">
                <span>Medical</span>
                <span>Food</span>
                <span>Clean Water</span>
                <span>Accessibility</span>
              </div>

              <button 
                className="figma-btn-dispatch"
                onClick={() => alert(`Dispatch protocol engaged for: ${selectedNode.name}`)}
              >
                <span>Dispatch Support</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </section>

        {/* ---------------- RIGHT PANEL: FORM OR PROXIMITY ---------------- */}
        <aside className="cmd-right-dock">
          {showCaptureForm ? (
            /* =========================================================
               LOCATION CAPTURE FORM
               ========================================================= */
            <div className="location-capture-drawer">
              <div className="capture-drawer-header">
                <div className="drawer-title-left">
                  <Crosshair size={15} className="text-red" />
                  <h3>LOCATION CAPTURE FORM</h3>
                </div>
                <button 
                  className="drawer-close-x" 
                  onClick={() => { setShowCaptureForm(false); setIsCapturing(false); }}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="captured-coords-display-box">
                <div className="coords-code-line">
                  <span>LAT: {capturedCoordinates.lat}</span>
                  <span>LNG: {capturedCoordinates.lng}</span>
                </div>
                <p className="coords-sector-sub">{capturedCoordinates.sectorDesc}</p>
              </div>

              <form onSubmit={handleRegisterIncident} className="capture-input-form">
                <div className="form-group">
                  <label>Requester / Contact Person</label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Assistance Category</label>
                  <select 
                    value={assistanceCategory} 
                    onChange={(e) => setAssistanceCategory(e.target.value)}
                  >
                    <option value="Medical Assistance">Medical Assistance</option>
                    <option value="Evacuation Support">Evacuation Support</option>
                    <option value="Food & Drinking Water">Food & Drinking Water</option>
                    <option value="Emergency Shelter">Emergency Shelter</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Severity Level</label>
                  <div className="severity-toggle-row">
                    <button
                      type="button"
                      className={`sev-btn ${severityLevel === 'CRITICAL' ? 'sev-critical' : ''}`}
                      onClick={() => setSeverityLevel('CRITICAL')}
                    >
                      CRITICAL
                    </button>
                    <button
                      type="button"
                      className={`sev-btn ${severityLevel === 'HIGH' ? 'sev-high' : ''}`}
                      onClick={() => setSeverityLevel('HIGH')}
                    >
                      HIGH
                    </button>
                    <button
                      type="button"
                      className={`sev-btn ${severityLevel === 'MEDIUM' ? 'sev-medium' : ''}`}
                      onClick={() => setSeverityLevel('MEDIUM')}
                    >
                      MEDIUM
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Incident Details</label>
                  <textarea
                    rows={3}
                    value={incidentDetails}
                    onChange={(e) => setIncidentDetails(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="submit-register-btn">
                  <CheckCircle2 size={14} />
                  <span>Register & Auto-Match Depots</span>
                </button>
              </form>
            </div>
          ) : (
            /* DEFAULT PROXIMITY & GUIDANCE PANEL */
            <>
              {/* Proximity Resource Matching Box */}
              <div className="dock-card">
                <div className="dock-card-header">
                  <div className="card-heading-group">
                    <Zap size={14} className="text-amber" />
                    <span className="card-heading-upper">Proximity Resource Matching</span>
                  </div>
                  <span className="engine-sub-chip">Euclidean + OSRM</span>
                </div>

                <p className="dock-subnote">
                  Ranked closest facilities to target: <strong>Emergency Medical & Evacuation</strong>
                </p>

                <div 
                  className="match-card-item"
                  onClick={() => {
                    setSelectedNode(INITIAL_MAP_NODES[4]);
                    setTargetCenter({ lat: INITIAL_MAP_NODES[4].lat, lng: INITIAL_MAP_NODES[4].lng });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="m-card-head">
                    <div className="m-head-left">
                      <span className="rank-num">1</span>
                      <strong className="m-hub-title">Kelaniya River Safe Camp</strong>
                    </div>
                    <span className="m-dist-val">1.2 km</span>
                  </div>
                  <div className="m-card-meta">
                    <span>Est. Travel: 7 mins</span>
                    <span className="stat-near-cap">Near Capacity</span>
                  </div>
                  <button 
                    className="dispatch-1click-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Allocated 50 relief packages from Kelaniya River Safe Camp.');
                    }}
                  >
                    <CheckCircle2 size={12} />
                    <span>1-Click Dispatch Closest Stock</span>
                  </button>
                </div>

                <div 
                  className="match-card-item"
                  onClick={() => {
                    setSelectedNode(INITIAL_MAP_NODES[7]);
                    setTargetCenter({ lat: INITIAL_MAP_NODES[7].lat, lng: INITIAL_MAP_NODES[7].lng });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="m-card-head">
                    <div className="m-head-left">
                      <span className="rank-num">2</span>
                      <strong className="m-hub-title">Colombo Central Relief Shelter</strong>
                    </div>
                    <span className="m-dist-val">1.6 km</span>
                  </div>
                  <div className="m-card-meta">
                    <span>Est. Travel: 8 mins</span>
                    <span className="stat-operational">Operational</span>
                  </div>
                  <button 
                    className="dispatch-1click-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Allocated emergency ambulance from Colombo Central Relief Shelter.');
                    }}
                  >
                    <CheckCircle2 size={12} />
                    <span>1-Click Dispatch Closest Stock</span>
                  </button>
                </div>

                <div 
                  className="match-card-item"
                  onClick={() => {
                    setSelectedNode(INITIAL_MAP_NODES[2]);
                    setTargetCenter({ lat: INITIAL_MAP_NODES[2].lat, lng: INITIAL_MAP_NODES[2].lng });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="m-card-head">
                    <div className="m-head-left">
                      <span className="rank-num">3</span>
                      <strong className="m-hub-title">Colombo Central Logistics Depot</strong>
                    </div>
                    <span className="m-dist-val">2.4 km</span>
                  </div>
                  <div className="m-card-meta">
                    <span>Est. Travel: 11 mins</span>
                    <span className="stat-high-stock">High Stock</span>
                  </div>
                  <button 
                    className="dispatch-1click-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Dispatched 450 Medical Kits from Colombo Central Logistics Depot.');
                    }}
                  >
                    <CheckCircle2 size={12} />
                    <span>1-Click Dispatch Closest Stock</span>
                  </button>
                </div>
              </div>

              {/* Turn-by-Turn Guidance */}
              <div className="dock-card">
                <div className="dock-card-header">
                  <div className="card-heading-group">
                    <Route size={14} className="text-cyan" />
                    <span className="card-heading-upper">Turn-by-Turn Route Guidance</span>
                  </div>
                  <span className="step-count-chip">Step 1 of 3</span>
                </div>

                <div className="route-step-card">
                  <div className="step-top">
                    <span className="step-badge">1</span>
                    <strong className="step-title">Depart Depot via Port Access Highway toward Kelaniya</strong>
                  </div>
                  <span className="step-note">Distance: 1.8 km · Surface: clear</span>
                </div>

                <div className="route-step-card hazard-step">
                  <div className="step-top">
                    <span className="step-badge badge-warning">2</span>
                    <strong className="step-title text-amber">
                      Caution: Slow speed at Baseline Rd Bridge Underpass
                    </strong>
                  </div>
                  <div className="hazard-warning-pill">
                    <span>Flood surge hazard detected (water depth: 1.2ft)</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};
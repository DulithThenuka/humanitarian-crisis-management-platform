import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Plus,
  Minus,
  Navigation,
  Layers,
  MapPin,
  AlertTriangle,
  Home,
  Package,
  ExternalLink,
  Info,
  ShieldAlert
} from 'lucide-react';

// Fix Leaflet Default Icon issue in Vite / Webpack
delete L.Icon.Default.prototype._getIconUrl;

// Known verified coordinates for Sri Lankan operational warehouses / depots
const DEPOT_COORDINATES = {
  'Central Warehouse, Colombo': [6.9271, 79.8612],
  'Medical Supplies Depot, Kandy': [7.2906, 80.6337],
  'Logistics Hub, Galle': [6.0535, 80.2210],
  'Central Depot, Colombo': [6.9388, 79.8541],
  'Kalutara Coastal Storage Depot': [6.5854, 79.9607]
};

// Helper: Create custom HTML / CSS marker icons
const createLeafletIcon = ({ bg, border = '#ffffff', symbol, isSelected = false, isPulse = false }) => {
  const size = isSelected ? 34 : 28;
  const pulseHtml = isPulse ? `<div style="position: absolute; width: ${size + 14}px; height: ${size + 14}px; border-radius: 50%; background: ${bg}; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>` : '';
  const selectedRing = isSelected ? `box-shadow: 0 0 0 3px #10b981, 0 4px 12px rgba(0,0,0,0.45); transform: scale(1.1);` : `box-shadow: 0 3px 8px rgba(0,0,0,0.3);`;

  return L.divIcon({
    className: 'custom-coordinator-map-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px;">
        ${pulseHtml}
        <div style="
          background-color: ${bg};
          border: 2px solid ${border};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          z-index: 2;
          ${selectedRing}
          transition: transform 0.2s ease;
        ">
          ${symbol}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4]
  });
};

// Map Controller for smooth flyTo and programmatic view updates
const MapController = ({ targetCenter, targetZoom, bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (targetCenter && targetCenter.length === 2 && !isNaN(targetCenter[0]) && !isNaN(targetCenter[1])) {
      map.flyTo(targetCenter, targetZoom || map.getZoom(), { duration: 1.0 });
    }
  }, [targetCenter, targetZoom, map]);

  return null;
};

// Map Buttons Component (Integrated within Leaflet context)
const InternalMapControls = ({ onZoomIn, onZoomOut, onResetView }) => {
  const map = useMap();

  return (
    <div className="ec-map-controls-dock" style={{ zIndex: 1000 }}>
      <button
        type="button"
        className="ec-map-zoom-btn"
        onClick={() => map.zoomIn()}
        title="Zoom In"
      >
        <Plus size={14} />
      </button>
      <button
        type="button"
        className="ec-map-zoom-btn"
        onClick={() => map.zoomOut()}
        title="Zoom Out"
      >
        <Minus size={14} />
      </button>
      <button
        type="button"
        className="ec-map-zoom-btn"
        onClick={() => onResetView(map)}
        title="Center Western Province HQ"
      >
        <Navigation size={12} />
      </button>
    </div>
  );
};

export const CoordinatorInteractiveMap = ({
  height = '300px',
  cases = [],
  shelters = [],
  resources = [],
  crises = [],
  selectedIncidentId = null,
  onSelectIncident = null,
  onOpenCaseReview = null,
  onNavigateTab = null,
  showLegend = true,
  mode = 'overview', // 'overview' | 'incident'
  className = ''
}) => {
  // Default Center: Western Province (Colombo HQ)
  const defaultCenter = [6.9271, 79.8612];
  const [targetView, setTargetView] = useState({ center: defaultCenter, zoom: 10 });

  // Layer visibility toggles
  const [layers, setLayers] = useState({
    requests: true,
    shelters: true,
    depots: true,
    crises: true
  });

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // 1. Process valid Priority Cases / Incidents
  const { validCases, unmappedCases } = useMemo(() => {
    const valid = [];
    const unmapped = [];

    (cases || []).forEach(c => {
      const lat = typeof c.lat === 'number' ? c.lat : (typeof c.latitude === 'number' ? c.latitude : null);
      const lon = typeof c.lon === 'number' ? c.lon : (typeof c.longitude === 'number' ? c.longitude : null);

      if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
        valid.push({
          ...c,
          parsedLat: lat,
          parsedLon: lon,
          isCritical: (c.severity || '').toLowerCase() === 'critical' || c.priority === 3 || c.urgency === 3,
          isHigh: (c.severity || '').toLowerCase() === 'high' || c.priority === 2 || c.urgency === 2
        });
      } else {
        unmapped.push(c);
      }
    });

    return { validCases: valid, unmappedCases: unmapped };
  }, [cases]);

  // 2. Process valid Shelters
  const { validShelters, unmappedShelters } = useMemo(() => {
    const valid = [];
    const unmapped = [];

    (shelters || []).forEach(s => {
      const lat = typeof s.latitude === 'number' ? s.latitude : null;
      const lon = typeof s.longitude === 'number' ? s.longitude : null;

      if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
        valid.push({ ...s, parsedLat: lat, parsedLon: lon });
      } else {
        unmapped.push(s);
      }
    });

    return { validShelters: valid, unmappedShelters: unmapped };
  }, [shelters]);

  // 3. Process Resource Depots (Grouped from Resources table by warehouse location)
  const validDepots = useMemo(() => {
    const depotMap = new Map();

    (resources || []).forEach(r => {
      const loc = r.warehouseLocation || 'Central Warehouse, Colombo';
      if (!depotMap.has(loc)) {
        const coords = DEPOT_COORDINATES[loc] || DEPOT_COORDINATES['Central Warehouse, Colombo'];
        depotMap.set(loc, {
          locationName: loc,
          coords,
          items: [],
          totalQuantity: 0
        });
      }
      const entry = depotMap.get(loc);
      entry.items.push(r);
      entry.totalQuantity += (Number(r.totalQuantity) || 0);
    });

    return Array.from(depotMap.values());
  }, [resources]);

  // 4. Process valid Crisis Hazard Events
  const validCrises = useMemo(() => {
    return (crises || []).filter(ev => {
      const lat = typeof ev.latitude === 'number' ? ev.latitude : null;
      const lon = typeof ev.longitude === 'number' ? ev.longitude : null;
      return lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0;
    }).map(ev => ({
      ...ev,
      parsedLat: ev.latitude,
      parsedLon: ev.longitude
    }));
  }, [crises]);

  // Check if selected incident exists and whether it has coordinates
  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) return null;
    return (cases || []).find(c => c.id === selectedIncidentId) ||
           (validCases || []).find(c => c.id === selectedIncidentId) ||
           null;
  }, [selectedIncidentId, cases, validCases]);

  const selectedIncidentHasCoords = selectedIncident &&
    typeof (selectedIncident.lat ?? selectedIncident.latitude) === 'number' &&
    typeof (selectedIncident.lon ?? selectedIncident.longitude) === 'number';

  // Fly to selected incident if changed in incident mode
  useEffect(() => {
    if (mode === 'incident' && selectedIncidentHasCoords) {
      const lat = selectedIncident.lat ?? selectedIncident.latitude;
      const lon = selectedIncident.lon ?? selectedIncident.longitude;
      setTargetView({ center: [lat, lon], zoom: 12 });
    }
  }, [mode, selectedIncidentId, selectedIncidentHasCoords, selectedIncident]);

  const handleResetView = (mapInstance) => {
    setTargetView({ center: defaultCenter, zoom: 10 });
    if (mapInstance) {
      mapInstance.flyTo(defaultCenter, 10, { duration: 1.0 });
    }
  };

  return (
    <div
      className={`ec-map-viewport ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #c5ccbe',
        backgroundColor: '#f1f5f9'
      }}
    >
      {/* Notice banner if the selected incident has no geographic coordinates */}
      {mode === 'incident' && selectedIncident && !selectedIncidentHasCoords && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          right: 60,
          zIndex: 1000,
          backgroundColor: '#fef3c7',
          color: '#92400e',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '7px 12px',
          fontSize: '11.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <AlertTriangle size={15} color="#d97706" style={{ flexShrink: 0 }} />
          <span>
            <strong>Coordinates Unavailable:</strong> Record <strong>{selectedIncident.id}</strong> ({selectedIncident.area || selectedIncident.location || 'Area Unspecified'}) has no latitude/longitude stored in the database.
          </span>
        </div>
      )}

      {/* Real Interactive Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={10}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapController targetCenter={targetView.center} targetZoom={targetView.zoom} />

        {/* Real Geographic Tiles (OpenStreetMap) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        {/* Map Controls */}
        <InternalMapControls onResetView={handleResetView} />

        {/* 1. Active Crisis Hazard Zones (Polygons / Circles) */}
        {layers.crises && validCrises.map(cr => (
          <React.Fragment key={cr.id}>
            <Circle
              center={[cr.parsedLat, cr.parsedLon]}
              radius={7500}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.14,
                weight: 1.5,
                dashArray: '4 4'
              }}
            />
            <Marker
              position={[cr.parsedLat, cr.parsedLon]}
              icon={createLeafletIcon({ bg: '#b91c1c', symbol: '⚠️', isPulse: true })}
            >
              <Popup>
                <div style={{ padding: '4px', maxWidth: '240px', fontFamily: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>
                      CRISIS EVENT
                    </span>
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}>
                      Severity {cr.severity || 4}
                    </span>
                  </div>
                  <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                    {cr.title || cr.name}
                  </strong>
                  <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px' }}>
                    {cr.location || 'Western Province Sector'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11} />
                    <span>[{cr.parsedLat.toFixed(4)}, {cr.parsedLon.toFixed(4)}]</span>
                  </div>
                  {onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab('crisis')}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        padding: '5px 8px',
                        background: '#3d6b4f',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      View Incident Operations
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* 2. Priority Requests & Incidents Markers */}
        {layers.requests && validCases.map(c => {
          const isSelected = selectedIncidentId === c.id;
          const markerBg = c.isCritical ? '#dc2626' : c.isHigh ? '#ea580c' : '#2563eb';
          const markerSymbol = c.isCritical ? '▲' : c.isHigh ? '⚠️' : '●';

          return (
            <Marker
              key={c.id}
              position={[c.parsedLat, c.parsedLon]}
              icon={createLeafletIcon({
                bg: markerBg,
                symbol: markerSymbol,
                isSelected: isSelected,
                isPulse: c.isCritical
              })}
              eventHandlers={{
                click: () => {
                  if (onSelectIncident) onSelectIncident(c.id);
                }
              }}
            >
              <Popup>
                <div style={{ padding: '4px', maxWidth: '250px', fontFamily: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#3d6b4f' }}>{c.id}</span>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: c.isCritical ? '#fee2e2' : '#ffedd5',
                      color: c.isCritical ? '#b91c1c' : '#c2410c',
                      fontWeight: 700
                    }}>
                      ● {c.severity || 'Critical'}
                    </span>
                  </div>
                  <strong style={{ fontSize: '12.5px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                    {c.title}
                  </strong>
                  <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px' }}>
                    {c.category} · {c.affectedPeople || c.people || 1} people in need
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    <MapPin size={11} />
                    <span>[{c.parsedLat.toFixed(4)}, {c.parsedLon.toFixed(4)}]</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {onOpenCaseReview && (
                      <button
                        type="button"
                        onClick={() => onOpenCaseReview(c.id)}
                        style={{
                          flex: 1,
                          padding: '5px 8px',
                          background: '#3d6b4f',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Review Case
                      </button>
                    )}
                    {mode === 'incident' && onSelectIncident && (
                      <button
                        type="button"
                        onClick={() => onSelectIncident(c.id)}
                        style={{
                          padding: '5px 8px',
                          background: '#e2e8f0',
                          color: '#1e293b',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Focus
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 3. Verified Shelters Markers */}
        {layers.shelters && validShelters.map(s => (
          <Marker
            key={s.id || s.name}
            position={[s.parsedLat, s.parsedLon]}
            icon={createLeafletIcon({ bg: '#059669', symbol: '🏠' })}
          >
            <Popup>
              <div style={{ padding: '4px', maxWidth: '240px', fontFamily: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                    VERIFIED SHELTER
                  </span>
                </div>
                <strong style={{ fontSize: '12.5px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  {s.name}
                </strong>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '4px' }}>
                  Occupancy: <strong>{s.currentOccupancy || 0}</strong> / {s.totalCapacity || '—'} spaces ({s.totalCapacity > 0 ? Math.round((s.currentOccupancy / s.totalCapacity) * 100) : 0}% full)
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} />
                  <span>[{s.parsedLat.toFixed(4)}, {s.parsedLon.toFixed(4)}]</span>
                </div>
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('shelters')}
                    style={{
                      marginTop: '8px',
                      width: '100%',
                      padding: '5px 8px',
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    View Shelter Management
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 4. Resource Depots Markers */}
        {layers.depots && validDepots.map(depot => (
          <Marker
            key={depot.locationName}
            position={depot.coords}
            icon={createLeafletIcon({ bg: '#1e3a2b', symbol: '📦' })}
          >
            <Popup>
              <div style={{ padding: '4px', maxWidth: '240px', fontFamily: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#1e3a2b', textTransform: 'uppercase' }}>
                    SUPPLY CHAIN DEPOT
                  </span>
                </div>
                <strong style={{ fontSize: '12.5px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  {depot.locationName}
                </strong>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px' }}>
                  {depot.items.length} inventory categories · {depot.totalQuantity.toLocaleString()} total units
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} />
                  <span>[{depot.coords[0].toFixed(4)}, {depot.coords[1].toFixed(4)}]</span>
                </div>
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('resources')}
                    style={{
                      marginTop: '8px',
                      width: '100%',
                      padding: '5px 8px',
                      background: '#1e3a2b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Open Resource Logistics
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Layer Controls Dock (Bottom Left) */}
      {showLegend && (
        <div
          className="ec-map-layers-dock"
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            border: '1px solid #c5ccbe',
            borderRadius: '8px',
            padding: '6px 10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            fontSize: '11px'
          }}
        >
          <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            OPERATIONAL LAYERS
          </span>
          <div
            onClick={() => toggleLayer('requests')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: layers.requests ? 1 : 0.4 }}
          >
            <span style={{ color: '#dc2626', fontWeight: 'bold' }}>●</span>
            <span style={{ color: '#1e293b' }}>Priority Requests ({validCases.length})</span>
          </div>
          <div
            onClick={() => toggleLayer('shelters')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: layers.shelters ? 1 : 0.4 }}
          >
            <span style={{ color: '#059669', fontWeight: 'bold' }}>●</span>
            <span style={{ color: '#1e293b' }}>Verified Shelters ({validShelters.length})</span>
          </div>
          <div
            onClick={() => toggleLayer('depots')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: layers.depots ? 1 : 0.4 }}
          >
            <span style={{ color: '#1e3a2b', fontWeight: 'bold' }}>●</span>
            <span style={{ color: '#1e293b' }}>Resource Depots ({validDepots.length})</span>
          </div>
          <div
            onClick={() => toggleLayer('crises')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: layers.crises ? 1 : 0.4 }}
          >
            <span style={{ color: '#b91c1c', fontWeight: 'bold' }}>●</span>
            <span style={{ color: '#1e293b' }}>Crisis Zones ({validCrises.length})</span>
          </div>
        </div>
      )}

      {/* Unmapped Records Notice Pill (Bottom Right) */}
      {(unmappedCases.length > 0 || unmappedShelters.length > 0) && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '10.5px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title={`${unmappedCases.length} requests and ${unmappedShelters.length} shelters have no stored coordinates and are omitted from map plotting`}
        >
          <Info size={12} color="#64748b" />
          <span>{unmappedCases.length + unmappedShelters.length} unmapped in DB</span>
        </div>
      )}
    </div>
  );
};

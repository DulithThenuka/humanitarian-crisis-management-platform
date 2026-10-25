import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Minimize2, ChevronDown, Check } from 'lucide-react';
import './LiveSatelliteCrisisMap.css';

// SVG Icon templates for markers
const ICONS = {
  crisis: `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"></path>
    </svg>
  `,
  request: `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  `,
  shelter: `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  `,
  resource: `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.29 7 12 12.01 20.71 7"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,
  volunteer: `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,
  operation: `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="22" y1="12" x2="18" y2="12"></line>
      <line x1="6" y1="12" x2="2" y2="12"></line>
      <line x1="12" y1="6" x2="12" y2="2"></line>
      <line x1="12" y1="22" x2="12" y2="18"></line>
    </svg>
  `
};

// Helper function to create custom pins matching reference screenshot
const createCustomPin = (type, color, auraColor) => {
  return L.divIcon({
    className: 'custom-crisis-pin-container',
    html: `
      <div class="pin-halo-aura" style="background: ${auraColor};"></div>
      <div class="pin-center-circle" style="background: ${color};">
        ${ICONS[type]}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -18]
  });
};

// Province coordinates
const PROVINCES = {
  'Western Province': { center: [6.938, 79.885], zoom: 12 },
  'Central Province': { center: [7.2906, 80.6337], zoom: 12 },
  'Southern Province': { center: [6.0535, 80.2210], zoom: 12 }
};

export const LiveSatelliteCrisisMap = ({ onProvinceChange }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({});
  const polygonLayerRef = useRef(null);

  const [selectedProvince, setSelectedProvince] = useState('Western Province');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active layers state
  const [layers, setLayers] = useState({
    crisisZones: true,
    requests: true,
    shelters: true,
    resources: true,
    volunteers: true,
    operationalAreas: true,
  });

  const toggleLayer = (key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double initialization

    const config = PROVINCES[selectedProvince] || PROVINCES['Western Province'];

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: config.center,
      zoom: config.zoom,
      zoomControl: false, // Custom zoom buttons used
      attributionControl: false,
      scrollWheelZoom: false // Prevents accidental scroll zoom when scrolling dashboard
    });

    // Real High-Resolution Esri Satellite Imagery
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        subdomains: ['server', 'services'],
      }
    ).addTo(map);

    // Subtle reference boundary/places overlay for readability
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        opacity: 0.55
      }
    ).addTo(map);

    // Initialize Layer Groups
    const layerGroups = {
      crisisZones: L.layerGroup().addTo(map),
      requests: L.layerGroup().addTo(map),
      shelters: L.layerGroup().addTo(map),
      resources: L.layerGroup().addTo(map),
      volunteers: L.layerGroup().addTo(map),
      operationalAreas: L.layerGroup().addTo(map),
    };
    layerGroupsRef.current = layerGroups;

    // 1. Crisis Zones Polygon (Kelani River Basin flood path in Western Province)
    const floodPolygonCoords = [
      [6.974, 79.882],
      [6.969, 79.915],
      [6.962, 79.948],
      [6.948, 79.962],
      [6.932, 79.948],
      [6.924, 79.912],
      [6.928, 79.885],
      [6.942, 79.870],
      [6.958, 79.864]
    ];

    const floodPolygon = L.polygon(floodPolygonCoords, {
      color: '#ef4444',
      weight: 2,
      opacity: 0.85,
      fillColor: '#dc2626',
      fillOpacity: 0.32,
      dashArray: '4, 4'
    }).bindPopup(`
      <div class="custom-map-popup">
        <div class="popup-badge red">Level 4 Critical Alert</div>
        <h4>Kelani River Flood Zone</h4>
        <p>Severe inundation along river corridor. Evacuation orders active for lowlands.</p>
        <div class="popup-meta">Affected Area: 14.8 sq km | Risk: Extreme</div>
      </div>
    `);

    polygonLayerRef.current = floodPolygon;
    layerGroups.crisisZones.addLayer(floodPolygon);

    // Crisis Zone Center Pins
    const crisisPins = [
      { coords: [6.962, 79.898], title: "Peliyagoda Surge Point", risk: "Critical Water Surge" },
      { coords: [6.938, 79.892], title: "Wellampitiya Inundation", risk: "Embankment Breach" }
    ];
    crisisPins.forEach(item => {
      const marker = L.marker(item.coords, {
        icon: createCustomPin('crisis', '#ef4444', 'rgba(239, 68, 68, 0.45)')
      }).bindPopup(`
        <div class="custom-map-popup">
          <div class="popup-badge red">Crisis Zone</div>
          <h4>${item.title}</h4>
          <p>${item.risk}</p>
        </div>
      `);
      layerGroups.crisisZones.addLayer(marker);
    });

    // 2. Assistance Requests
    const requestPins = [
      { coords: [6.950, 79.918], id: "REQ-2026-01842", type: "Medical Assistance", prio: "Critical" },
      { coords: [6.929, 79.932], id: "REQ-2026-01835", type: "Emergency Food & Water", prio: "High" },
      { coords: [6.964, 79.886], id: "REQ-2026-01877", type: "Shelter Required (Family of 5)", prio: "High" },
      { coords: [6.916, 79.945], id: "REQ-2026-01628", type: "Transport / Evacuation", prio: "Medium" }
    ];
    requestPins.forEach(item => {
      const marker = L.marker(item.coords, {
        icon: createCustomPin('request', '#f97316', 'rgba(249, 115, 22, 0.45)')
      }).bindPopup(`
        <div class="custom-map-popup">
          <div class="popup-badge amber">${item.prio} Priority</div>
          <h4>${item.id}</h4>
          <p>${item.type}</p>
          <div class="popup-meta">Status: Under Review</div>
        </div>
      `);
      layerGroups.requests.addLayer(marker);
    });

    // 3. Shelters
    const shelterPins = [
      { coords: [6.945, 79.866], name: "Sugathadasa Indoor Stadium", cap: "420 / 500 (84%)" },
      { coords: [6.918, 79.898], name: "Dematagoda Relief Camp", cap: "210 / 300 (70%)" },
      { coords: [6.898, 79.924], name: "Battaramulla Central Evac Hub", cap: "350 / 400 (87%)" }
    ];
    shelterPins.forEach(item => {
      const marker = L.marker(item.coords, {
        icon: createCustomPin('shelter', '#10b981', 'rgba(16, 185, 129, 0.45)')
      }).bindPopup(`
        <div class="custom-map-popup">
          <div class="popup-badge green">Active Shelter</div>
          <h4>${item.name}</h4>
          <p>Occupancy: <strong>${item.cap}</strong></p>
          <div class="popup-meta">Medical Staff On-site: Yes</div>
        </div>
      `);
      layerGroups.shelters.addLayer(marker);
    });

    // 4. Resources
    const resourcePins = [
      { coords: [6.942, 79.852], name: "Colombo Port Logistics Hub", supplies: "Medical Supplies & Rations" },
      { coords: [6.966, 79.932], name: "Kelaniya Distribution Depot", supplies: "Rescue Boats & Life Jackets" }
    ];
    resourcePins.forEach(item => {
      const marker = L.marker(item.coords, {
        icon: createCustomPin('resource', '#3b82f6', 'rgba(59, 130, 246, 0.45)')
      }).bindPopup(`
        <div class="custom-map-popup">
          <div class="popup-badge blue">Resource Depot</div>
          <h4>${item.name}</h4>
          <p>${item.supplies}</p>
        </div>
      `);
      layerGroups.resources.addLayer(marker);
    });

    // 5. Volunteers
    const volunteerPins = [
      { coords: [6.908, 79.870], name: "Red Cross Rapid Deployment Unit", active: "34 Volunteers Active" },
      { coords: [6.932, 79.952], name: "Civil Defense Volunteer Team", active: "22 Volunteers Active" }
    ];
    volunteerPins.forEach(item => {
      const marker = L.marker(item.coords, {
        icon: createCustomPin('volunteer', '#8b5cf6', 'rgba(139, 92, 246, 0.45)')
      }).bindPopup(`
        <div class="custom-map-popup">
          <div class="popup-badge purple">Volunteer Squad</div>
          <h4>${item.name}</h4>
          <p>${item.active}</p>
        </div>
      `);
      layerGroups.volunteers.addLayer(marker);
    });

    // 6. Operational Areas
    const operationalPins = [
      { coords: [6.934, 79.845], name: "Western Province Command Center", role: "Central Coordination HQ" },
      { coords: [6.892, 79.905], name: "Kotte Emergency Response Base", role: "Forward Operations Point" }
    ];
    operationalPins.forEach(item => {
      const marker = L.marker(item.coords, {
        icon: createCustomPin('operation', '#14b8a6', 'rgba(20, 184, 166, 0.45)')
      }).bindPopup(`
        <div class="custom-map-popup">
          <div class="popup-badge teal">Operational Area</div>
          <h4>${item.name}</h4>
          <p>${item.role}</p>
        </div>
      `);
      layerGroups.operationalAreas.addLayer(marker);
    });

    mapInstanceRef.current = map;

    // Resize listener
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update layers visibility dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    const groups = layerGroupsRef.current;
    if (!map || !groups) return;

    Object.entries(layers).forEach(([layerKey, isVisible]) => {
      const group = groups[layerKey];
      if (!group) return;

      if (isVisible) {
        if (!map.hasLayer(group)) {
          map.addLayer(group);
        }
      } else {
        if (map.hasLayer(group)) {
          map.removeLayer(group);
        }
      }
    });
  }, [layers]);

  // Handle Province Switch
  const handleSelectProvince = (provName) => {
    setSelectedProvince(provName);
    setDropdownOpen(false);
    if (onProvinceChange) onProvinceChange(provName);

    const map = mapInstanceRef.current;
    const provConfig = PROVINCES[provName];
    if (map && provConfig) {
      map.flyTo(provConfig.center, provConfig.zoom, { duration: 1.2 });
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };
  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Toggle Fullscreen/Expand
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);
  };

  return (
    <div className={`live-crisis-map-wrapper ${isFullscreen ? 'map-fullscreen-mode' : ''}`}>
      {/* Real Interactive Map Canvas */}
      <div ref={mapContainerRef} className="leaflet-crisis-container" />

      {/* Top-Left Province Selector Dropdown */}
      <div className="map-top-left-dropdown-container">
        <button
          type="button"
          className="map-top-left-dropdown-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{selectedProvince}</span>
          <ChevronDown size={13} color="#64748b" className={dropdownOpen ? 'rotate-180' : ''} />
        </button>

        {dropdownOpen && (
          <div className="province-menu-popover">
            {Object.keys(PROVINCES).map((prov) => (
              <div
                key={prov}
                className={`province-menu-item ${selectedProvince === prov ? 'selected' : ''}`}
                onClick={() => handleSelectProvince(prov)}
              >
                <span>{prov}</span>
                {selectedProvince === prov && <Check size={12} color="#0f766e" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Map Layers Toggle Card */}
      <div className="map-layers-floating-panel">
        <div className="layers-title">Map Layers</div>

        <label className="layer-toggle-row">
          <input
            type="checkbox"
            checked={layers.crisisZones}
            onChange={() => toggleLayer('crisisZones')}
          />
          <span className="layer-dot-icon" style={{ backgroundColor: '#ef4444' }}>
            <span role="img" aria-label="crisis">🔥</span>
          </span>
          <span>Crisis Zones</span>
        </label>

        <label className="layer-toggle-row">
          <input
            type="checkbox"
            checked={layers.requests}
            onChange={() => toggleLayer('requests')}
          />
          <span className="layer-dot-icon" style={{ backgroundColor: '#f97316' }}>
            <span role="img" aria-label="alert">⚠️</span>
          </span>
          <span>Assistance Requests</span>
        </label>

        <label className="layer-toggle-row">
          <input
            type="checkbox"
            checked={layers.shelters}
            onChange={() => toggleLayer('shelters')}
          />
          <span className="layer-dot-icon" style={{ backgroundColor: '#10b981' }}>
            <span role="img" aria-label="shelter">🏠</span>
          </span>
          <span>Shelters</span>
        </label>

        <label className="layer-toggle-row">
          <input
            type="checkbox"
            checked={layers.resources}
            onChange={() => toggleLayer('resources')}
          />
          <span className="layer-dot-icon" style={{ backgroundColor: '#3b82f6' }}>
            <span role="img" aria-label="resources">📦</span>
          </span>
          <span>Resources</span>
        </label>

        <label className="layer-toggle-row">
          <input
            type="checkbox"
            checked={layers.volunteers}
            onChange={() => toggleLayer('volunteers')}
          />
          <span className="layer-dot-icon" style={{ backgroundColor: '#8b5cf6' }}>
            <span role="img" aria-label="volunteers">👥</span>
          </span>
          <span>Volunteers</span>
        </label>

        <label className="layer-toggle-row">
          <input
            type="checkbox"
            checked={layers.operationalAreas}
            onChange={() => toggleLayer('operationalAreas')}
          />
          <span className="layer-dot-icon" style={{ backgroundColor: '#14b8a6' }}>
            <span role="img" aria-label="operational">📍</span>
          </span>
          <span>Operational Areas</span>
        </label>
      </div>

      {/* Top Right Maximize Button */}
      <button
        className="map-top-right-btn"
        title={isFullscreen ? 'Exit Fullscreen' : 'Expand Satellite Map'}
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
      </button>

      {/* Right Zoom Controls */}
      <div className="map-zoom-controls">
        <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">+</button>
        <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">−</button>
      </div>

      {/* Bottom Right Satellite Badge */}
      <div className="map-satellite-badge">
        <span className="map-satellite-thumb-sq"></span>
        <span>Satellite</span>
      </div>
    </div>
  );
};

export default LiveSatelliteCrisisMap;

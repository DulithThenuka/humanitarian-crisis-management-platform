import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Users, 
  Truck, 
  Package, 
  Home, 
  Plus, 
  Search, 
  Bell, 
  ChevronRight, 
  ChevronDown, 
  MapPin, 
  Calendar, 
  MoreVertical, 
  Waves, 
  CloudRain, 
  Sun, 
  Mountain, 
  Check, 
  ExternalLink, 
  Layers, 
  Shield, 
  Activity, 
  Clock, 
  Droplets, 
  HeartPulse, 
  UtensilsCrossed,
  X
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import reqDrawerFlood from '../../assets/req-drawer-flood.jpg';
import sarahJohnson from '../../assets/sarah-johnson.jpg';
import './CrisisManagementDashboardView.css';

export const CrisisManagementDashboardView = ({ onOpenFullMap, onDeclareCrisis, onOpenRequestDetail }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({});

  // Active Map Layers
  const [activeLayers, setActiveLayers] = useState({
    activeCrises: true,
    affectedAreas: true,
    shelters: true,
    hospitals: true,
    roadConditions: true,
    weatherAlerts: true,
    responseTeams: true
  });

  const toggleLayer = (key) => {
    setActiveLayers(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (layerGroupsRef.current[key] && mapInstanceRef.current) {
        if (next[key]) {
          mapInstanceRef.current.addLayer(layerGroupsRef.current[key]);
        } else {
          mapInstanceRef.current.removeLayer(layerGroupsRef.current[key]);
        }
      }
      return next;
    });
  };

  // Selected Crisis
  const [selectedCrisisIndex, setSelectedCrisisIndex] = useState(0);

  // Modal States
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCrisisDetailModal, setShowCrisisDetailModal] = useState(false);
  const [assignedTeam, setAssignedTeam] = useState('Alpha Rescue Unit 4 (Colombo)');

  const crisesList = [
    {
      id: 'CRISIS-01',
      title: 'Flood - Kelani Area',
      location: 'Colombo, Western Province',
      affected: '3,200 affected',
      affectedCount: '3,200',
      severity: 'High',
      severityClass: 'badge-high',
      time: '2 hours ago',
      started: '14 Jun 2026, 6:00 AM',
      description: 'Heavy rainfall has caused severe flooding in the Kelani River basin affecting multiple residential areas. Immediate evacuation and assistance required.',
      icon: Waves,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      coords: [6.958, 79.898]
    },
    {
      id: 'CRISIS-02',
      title: 'Landslide Risk',
      location: 'Gampaha District',
      affected: '850 affected',
      affectedCount: '850',
      severity: 'Medium',
      severityClass: 'badge-medium',
      time: '5 hours ago',
      started: '14 Jun 2026, 3:00 AM',
      description: 'Soil instability detected on upper slope terraces following heavy downpours. 140 households ordered to evacuate to Bandaranaike College.',
      icon: Mountain,
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
      coords: [7.091, 79.998]
    },
    {
      id: 'CRISIS-03',
      title: 'Severe Weather',
      location: 'Kalutara District',
      affected: '2,100 affected',
      affectedCount: '2,100',
      severity: 'High',
      severityClass: 'badge-high',
      time: '8 hours ago',
      started: '13 Jun 2026, 11:30 PM',
      description: 'Gale-force coastal winds and squall lines damaging power grids and coastal fishing harbours in Beruwala and Kalutara South.',
      icon: CloudRain,
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
      coords: [6.585, 79.960]
    },
    {
      id: 'CRISIS-04',
      title: 'Coastal Erosion',
      location: 'Negombo Area',
      affected: '600 affected',
      affectedCount: '600',
      severity: 'Low',
      severityClass: 'badge-low',
      time: '12 hours ago',
      started: '13 Jun 2026, 7:00 PM',
      description: 'High storm surge causing localized shoreline sand spit breach near Negombo lagoon entrance. Temporary rock rip-rap deployed.',
      icon: Waves,
      iconBg: '#f0fdfa',
      iconColor: '#0d9488',
      coords: [7.208, 79.835]
    },
    {
      id: 'CRISIS-05',
      title: 'Drought Conditions',
      location: 'Hambantota District',
      affected: '1,800 affected',
      affectedCount: '1,800',
      severity: 'Medium',
      severityClass: 'badge-medium',
      time: '1 day ago',
      started: '12 Jun 2026, 9:00 AM',
      description: 'Agricultural water depletion in dry zone irrigation reservoirs. Tanker drinking water distribution activated across 6 villages.',
      icon: Sun,
      iconBg: '#fffbeb',
      iconColor: '#d97706',
      coords: [6.124, 81.118]
    }
  ];

  const currentCrisis = crisesList[selectedCrisisIndex];

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Western Province Map Center
    const map = L.map(mapContainerRef.current, {
      center: [6.938, 79.915],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false
    });

    // Real Satellite Tiles (Esri World Imagery)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      subdomains: ['server', 'services'],
    }).addTo(map);

    // Geographic boundary and road labels
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      opacity: 0.6
    }).addTo(map);

    // Layer Groups
    const groups = {
      activeCrises: L.layerGroup().addTo(map),
      affectedAreas: L.layerGroup().addTo(map),
      shelters: L.layerGroup().addTo(map),
      hospitals: L.layerGroup().addTo(map),
      roadConditions: L.layerGroup().addTo(map),
      weatherAlerts: L.layerGroup().addTo(map),
      responseTeams: L.layerGroup().addTo(map)
    };
    layerGroupsRef.current = groups;

    // 1. Red Flood Hazard Polygon
    const floodPolygon = L.polygon([
      [6.976, 79.882],
      [6.970, 79.925],
      [6.960, 79.955],
      [6.945, 79.965],
      [6.928, 79.948],
      [6.922, 79.912],
      [6.928, 79.885],
      [6.942, 79.870],
      [6.960, 79.864]
    ], {
      color: '#dc2626',
      weight: 2,
      opacity: 0.9,
      fillColor: '#ef4444',
      fillOpacity: 0.38,
      dashArray: '3, 3'
    });
    groups.affectedAreas.addLayer(floodPolygon);

    // Custom Icon Pin Generator
    const makePin = (svgInner, bg, border = 'rgba(255,255,255,0.9)') => {
      return L.divIcon({
        className: 'cz-custom-map-pin',
        html: `
          <div style="
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            background: ${bg}; 
            border: 2px solid ${border}; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.45);
          ">
            ${svgInner}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
    };

    // Active Crisis Pin (Kelani River with Tooltip Popup)
    const crisisMarker = L.marker([6.948, 79.920], {
      icon: makePin(`
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      `, '#dc2626')
    });

    crisisMarker.bindPopup(`
      <div class="cz-map-popup-card">
        <div class="cz-popup-top">
          <span class="cz-popup-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
          <strong>Flood - Kelani Area</strong>
        </div>
        <div class="cz-popup-info">Affected: <strong>3,200 people</strong></div>
        <div class="cz-popup-severity">Severity: <span style="color:#ef4444;font-weight:700;">High</span></div>
      </div>
    `, {
      autoClose: false,
      closeOnClick: false,
      offset: [0, -10]
    });
    groups.activeCrises.addLayer(crisisMarker);
    crisisMarker.openPopup();

    // Hospitals (Blue Cross)
    const hosp1 = L.marker([6.980, 79.890], {
      icon: makePin(`
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      `, '#0284c7')
    });
    const hosp2 = L.marker([6.910, 79.880], {
      icon: makePin(`
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      `, '#0284c7')
    });
    groups.hospitals.addLayer(hosp1);
    groups.hospitals.addLayer(hosp2);

    // Shelters (Green House)
    const shelter1 = L.marker([6.905, 79.865], {
      icon: makePin(`
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      `, '#16a34a')
    });
    const shelter2 = L.marker([7.195, 79.860], {
      icon: makePin(`
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      `, '#16a34a')
    });
    const shelter3 = L.marker([6.580, 79.965], {
      icon: makePin(`
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      `, '#16a34a')
    });
    groups.shelters.addLayer(shelter1);
    groups.shelters.addLayer(shelter2);
    groups.shelters.addLayer(shelter3);

    // Weather Alerts (Purple Storm)
    const weather1 = L.marker([7.060, 80.010], {
      icon: makePin(`
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
          <path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>
        </svg>
      `, '#7c3aed')
    });
    groups.weatherAlerts.addLayer(weather1);

    // Response Teams (Teal Users)
    const team1 = L.marker([6.935, 79.910], {
      icon: makePin(`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
      `, '#0e7490')
    });
    groups.responseTeams.addLayer(team1);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleZoom = (delta) => {
    if (mapInstanceRef.current) {
      if (delta > 0) mapInstanceRef.current.zoomIn();
      else mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="crisis-management-view">
      {/* =========================================================
         1. Top 4 KPI Metrics Row + Action Button
         ========================================================= */}
      <div className="cm-kpi-row">
        {/* KPI 1: Active Crises */}
        <div className="cm-kpi-card">
          <div className="cm-kpi-icon-box bg-red-soft">
            <AlertTriangle size={22} className="text-red" />
          </div>
          <div className="cm-kpi-content">
            <span className="cm-kpi-label">Active Crises</span>
            <div className="cm-kpi-val-row">
              <span className="cm-kpi-number">8</span>
            </div>
            <div className="cm-kpi-trend text-red">
              <span>↑ 33%</span>
            </div>
            <span className="cm-kpi-sub">Requiring immediate attention</span>
          </div>
        </div>

        {/* KPI 2: Affected People */}
        <div className="cm-kpi-card">
          <div className="cm-kpi-icon-box bg-orange-soft">
            <AlertCircle size={22} className="text-orange" />
          </div>
          <div className="cm-kpi-content">
            <span className="cm-kpi-label">Affected People</span>
            <div className="cm-kpi-val-row">
              <span className="cm-kpi-number">12,450</span>
            </div>
            <div className="cm-kpi-trend text-orange">
              <span>↑ 18%</span>
            </div>
            <span className="cm-kpi-sub">Across all crisis zones</span>
          </div>
        </div>

        {/* KPI 3: Response Teams */}
        <div className="cm-kpi-card">
          <div className="cm-kpi-icon-box bg-blue-soft">
            <Users size={22} className="text-blue" />
          </div>
          <div className="cm-kpi-content">
            <span className="cm-kpi-label">Response Teams</span>
            <div className="cm-kpi-val-row">
              <span className="cm-kpi-number">24</span>
            </div>
            <div className="cm-kpi-trend text-green">
              <span>↑ 9%</span>
            </div>
            <span className="cm-kpi-sub">Currently deployed</span>
          </div>
        </div>

        {/* KPI 4: Resources Allocated */}
        <div className="cm-kpi-card">
          <div className="cm-kpi-icon-box bg-green-soft">
            <Truck size={22} className="text-green" />
          </div>
          <div className="cm-kpi-content">
            <span className="cm-kpi-label">Resources Allocated</span>
            <div className="cm-kpi-val-row">
              <span className="cm-kpi-number">Rs. 8,750,000</span>
            </div>
            <div className="cm-kpi-trend text-green">
              <span>↑ 22%</span>
            </div>
            <span className="cm-kpi-sub">Total emergency resources</span>
          </div>
        </div>

        {/* Action Button: + Report New Crisis */}
        <div className="cm-kpi-action-col">
          <button 
            className="cm-btn-report-crisis"
            onClick={onDeclareCrisis}
          >
            <Plus size={16} />
            <span>Report New Crisis</span>
          </button>
        </div>
      </div>

      {/* =========================================================
         2. Middle Section: Crisis Zones Map + Active Crises + Details
         ========================================================= */}
      <div className="cm-middle-grid">
        {/* Left: Crisis Zones Map Card */}
        <div className="cm-card cm-map-card">
          <div className="cm-card-header">
            <h3 className="cm-card-title">Crisis Zones Map</h3>
          </div>

          <div className="cm-map-viewport-wrapper">
            {/* Real Leaflet Map Container */}
            <div ref={mapContainerRef} className="cm-leaflet-container" />

            {/* Floating Map Layers Control Panel */}
            <div className="cm-map-layers-floating-box">
              <h4 className="cm-layers-title">Map Layers</h4>
              <div className="cm-layers-list">
                <label className="cm-layer-checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.activeCrises} 
                    onChange={() => toggleLayer('activeCrises')} 
                  />
                  <span className="cm-custom-check">
                    {activeLayers.activeCrises && <Check size={11} color="#ffffff" />}
                  </span>
                  <span className="cm-layer-icon-badge bg-red-soft"><AlertTriangle size={12} className="text-red" /></span>
                  <span className="cm-layer-name">Active Crises</span>
                </label>

                <label className="cm-layer-checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.affectedAreas} 
                    onChange={() => toggleLayer('affectedAreas')} 
                  />
                  <span className="cm-custom-check">
                    {activeLayers.affectedAreas && <Check size={11} color="#ffffff" />}
                  </span>
                  <span className="cm-layer-icon-badge bg-orange-soft"><AlertCircle size={12} className="text-orange" /></span>
                  <span className="cm-layer-name">Affected Areas</span>
                </label>

                <label className="cm-layer-checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.shelters} 
                    onChange={() => toggleLayer('shelters')} 
                  />
                  <span className="cm-custom-check">
                    {activeLayers.shelters && <Check size={11} color="#ffffff" />}
                  </span>
                  <span className="cm-layer-icon-badge bg-green-soft"><Home size={12} className="text-green" /></span>
                  <span className="cm-layer-name">Shelters</span>
                </label>

                <label className="cm-layer-checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.hospitals} 
                    onChange={() => toggleLayer('hospitals')} 
                  />
                  <span className="cm-custom-check">
                    {activeLayers.hospitals && <Check size={11} color="#ffffff" />}
                  </span>
                  <span className="cm-layer-icon-badge bg-blue-soft"><Plus size={12} className="text-blue" /></span>
                  <span className="cm-layer-name">Hospitals</span>
                </label>

                <label className="cm-layer-checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.roadConditions} 
                    onChange={() => toggleLayer('roadConditions')} 
                  />
                  <span className="cm-custom-check">
                    {activeLayers.roadConditions && <Check size={11} color="#ffffff" />}
                  </span>
                  <span className="cm-layer-icon-badge bg-slate-soft"><Truck size={12} className="text-slate" /></span>
                  <span className="cm-layer-name">Road Conditions</span>
                </label>

                <label className="cm-layer-checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.weatherAlerts} 
                    onChange={() => toggleLayer('weatherAlerts')} 
                  />
                  <span className="cm-custom-check">
                    {activeLayers.weatherAlerts && <Check size={11} color="#ffffff" />}
                  </span>
                  <span className="cm-layer-icon-badge bg-purple-soft"><CloudRain size={12} className="text-purple" /></span>
                  <span className="cm-layer-name">Weather Alerts</span>
                </label>

                <label className="cm-layer-checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.responseTeams} 
                    onChange={() => toggleLayer('responseTeams')} 
                  />
                  <span className="cm-custom-check">
                    {activeLayers.responseTeams && <Check size={11} color="#ffffff" />}
                  </span>
                  <span className="cm-layer-icon-badge bg-cyan-soft"><Users size={12} className="text-cyan" /></span>
                  <span className="cm-layer-name">Response Teams</span>
                </label>
              </div>
            </div>

            {/* Zoom Controls on Top Right */}
            <div className="cm-map-zoom-controls">
              <button onClick={() => handleZoom(1)}>+</button>
              <button onClick={() => handleZoom(-1)}>−</button>
            </div>

            {/* Bottom Right Floating Full Map Button */}
            <button 
              className="cm-btn-view-full-map"
              onClick={onOpenFullMap}
            >
              <span>View Full Map</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Active Crises List + Crisis Details */}
        <div className="cm-right-column">
          {/* Active Crises List Card */}
          <div className="cm-card cm-active-crises-card">
            <div className="cm-card-header">
              <h3 className="cm-card-title">Active Crises</h3>
              <button className="cm-card-link-btn" onClick={onOpenFullMap}>
                <span>View All</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="cm-crises-list">
              {crisesList.map((item, idx) => {
                const IconComponent = item.icon;
                const isSelected = selectedCrisisIndex === idx;
                return (
                  <div 
                    key={item.id}
                    className={`cm-crisis-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCrisisIndex(idx);
                      if (mapInstanceRef.current && item.coords) {
                        mapInstanceRef.current.panTo(item.coords);
                      }
                    }}
                  >
                    <div className="cm-crisis-icon-box" style={{ backgroundColor: item.iconBg, color: item.iconColor }}>
                      <IconComponent size={18} />
                    </div>

                    <div className="cm-crisis-info">
                      <div className="cm-crisis-title-row">
                        <span className="cm-crisis-name">{item.title}</span>
                      </div>
                      <span className="cm-crisis-loc">{item.location}</span>
                    </div>

                    <div className="cm-crisis-meta-col">
                      <span className="cm-crisis-count">{item.affected}</span>
                      <span className="cm-crisis-time">{item.time}</span>
                    </div>

                    <span className={`cm-severity-pill ${item.severityClass}`}>
                      {item.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Crisis Details Card */}
          <div className="cm-card cm-crisis-details-card">
            <div className="cm-card-header">
              <h3 className="cm-card-title">Crisis Details</h3>
            </div>

            <div className="cm-details-banner">
              <img src={reqDrawerFlood} alt={currentCrisis.title} className="cm-details-img" />
            </div>

            <div className="cm-details-content">
              <div className="cm-details-title-row">
                <h4 className="cm-details-heading">{currentCrisis.title}</h4>
                <span className="cm-severity-pill badge-high">High Severity</span>
              </div>

              <div className="cm-details-meta-list">
                <div className="cm-meta-row">
                  <MapPin size={13} className="text-slate" />
                  <span>{currentCrisis.location}</span>
                </div>
                <div className="cm-meta-row">
                  <Calendar size={13} className="text-slate" />
                  <span>Started: {currentCrisis.started}</span>
                </div>
                <div className="cm-meta-row">
                  <Users size={13} className="text-slate" />
                  <span>Affected People: {currentCrisis.affectedCount}</span>
                </div>
              </div>

              <p className="cm-details-description">
                {currentCrisis.description}
              </p>

              <div className="cm-details-actions">
                <button 
                  className="cm-btn-view-details"
                  onClick={() => setShowCrisisDetailModal(true)}
                >
                  View Details
                </button>
                <button 
                  className="cm-btn-assign-team"
                  onClick={() => setShowAssignModal(true)}
                >
                  Assign Response Team
                </button>
                <button className="cm-btn-more-options" aria-label="More options">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
         3. Bottom Section: Resource Deployment + Affected Population
            + Immediate Needs + Response Timeline
         ========================================================= */}
      <div className="cm-bottom-grid">
        {/* Card 1: Resource Deployment (Table) */}
        <div className="cm-card cm-resource-card">
          <div className="cm-card-header">
            <h3 className="cm-card-title">Resource Deployment</h3>
            <button className="cm-card-link-btn">
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="cm-table-wrapper">
            <table className="cm-resource-table">
              <thead>
                <tr>
                  <th>Resource Type</th>
                  <th>Total Allocated</th>
                  <th>In Use</th>
                  <th>Available</th>
                  <th>Deployment Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="cm-res-type-cell">
                      <span className="cm-res-icon bg-amber-soft"><Package size={14} className="text-amber" /></span>
                      <span>Food Packs</span>
                    </div>
                  </td>
                  <td>5,000</td>
                  <td>3,200</td>
                  <td className="text-green font-semibold">1,800</td>
                  <td>
                    <div className="cm-progress-cell">
                      <div className="cm-progress-track">
                        <div className="cm-progress-bar bg-teal" style={{ width: '64%' }}></div>
                      </div>
                      <span className="cm-progress-pct">64%</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="cm-res-type-cell">
                      <span className="cm-res-icon bg-red-soft"><HeartPulse size={14} className="text-red" /></span>
                      <span>Medicine Kits</span>
                    </div>
                  </td>
                  <td>2,000</td>
                  <td>1,450</td>
                  <td className="text-red font-semibold">550</td>
                  <td>
                    <div className="cm-progress-cell">
                      <div className="cm-progress-track">
                        <div className="cm-progress-bar bg-orange" style={{ width: '73%' }}></div>
                      </div>
                      <span className="cm-progress-pct">73%</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="cm-res-type-cell">
                      <span className="cm-res-icon bg-green-soft"><Home size={14} className="text-green" /></span>
                      <span>Tents</span>
                    </div>
                  </td>
                  <td>500</td>
                  <td>320</td>
                  <td className="text-green font-semibold">180</td>
                  <td>
                    <div className="cm-progress-cell">
                      <div className="cm-progress-track">
                        <div className="cm-progress-bar bg-blue" style={{ width: '64%' }}></div>
                      </div>
                      <span className="cm-progress-pct">64%</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="cm-res-type-cell">
                      <span className="cm-res-icon bg-blue-soft"><Truck size={14} className="text-blue" /></span>
                      <span>Blankets</span>
                    </div>
                  </td>
                  <td>1,500</td>
                  <td>980</td>
                  <td className="text-green font-semibold">520</td>
                  <td>
                    <div className="cm-progress-cell">
                      <div className="cm-progress-track">
                        <div className="cm-progress-bar bg-purple" style={{ width: '65%' }}></div>
                      </div>
                      <span className="cm-progress-pct">65%</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="cm-res-type-cell">
                      <span className="cm-res-icon bg-cyan-soft"><Droplets size={14} className="text-cyan" /></span>
                      <span>Water Supplies</span>
                    </div>
                  </td>
                  <td>10,000</td>
                  <td>7,800</td>
                  <td className="text-green font-semibold">2,200</td>
                  <td>
                    <div className="cm-progress-cell">
                      <div className="cm-progress-track">
                        <div className="cm-progress-bar bg-cyan" style={{ width: '78%' }}></div>
                      </div>
                      <span className="cm-progress-pct">78%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Affected Population (Donut Chart) + Immediate Needs */}
        <div className="cm-card cm-population-needs-card">
          <div className="cm-card-header">
            <h3 className="cm-card-title">Affected Population</h3>
          </div>

          <div className="cm-population-donut-section">
            {/* Donut Chart SVG */}
            <div className="cm-donut-wrapper">
              <svg viewBox="0 0 160 160" className="cm-donut-svg">
                {/* Adults 50% (Green) */}
                <circle 
                  cx="80" cy="80" r="58"
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="20"
                  strokeDasharray="182.2 364.4"
                  strokeDashoffset="0"
                />
                {/* Children 35% (Blue) */}
                <circle 
                  cx="80" cy="80" r="58"
                  fill="none" 
                  stroke="#0ea5e9" 
                  strokeWidth="20"
                  strokeDasharray="127.5 364.4"
                  strokeDashoffset="-182.2"
                />
                {/* Elderly 12% (Orange) */}
                <circle 
                  cx="80" cy="80" r="58"
                  fill="none" 
                  stroke="#f97316" 
                  strokeWidth="20"
                  strokeDasharray="43.7 364.4"
                  strokeDashoffset="-309.7"
                />
                {/* Disabled 3% (Red) */}
                <circle 
                  cx="80" cy="80" r="58"
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="20"
                  strokeDasharray="11 364.4"
                  strokeDashoffset="-353.4"
                />
              </svg>
              <div className="cm-donut-center-label">
                <span className="cm-donut-big-num">12,450</span>
                <span className="cm-donut-sub-text">Affected People</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="cm-donut-legend">
              <div className="cm-legend-row">
                <span className="cm-dot" style={{ backgroundColor: '#0ea5e9' }}></span>
                <span className="cm-legend-text">Children (0-17)</span>
                <span className="cm-legend-pct">35%</span>
              </div>
              <div className="cm-legend-row">
                <span className="cm-dot" style={{ backgroundColor: '#10b981' }}></span>
                <span className="cm-legend-text">Adults (18-59)</span>
                <span className="cm-legend-pct">50%</span>
              </div>
              <div className="cm-legend-row">
                <span className="cm-dot" style={{ backgroundColor: '#f97316' }}></span>
                <span className="cm-legend-text">Elderly (60+)</span>
                <span className="cm-legend-pct">12%</span>
              </div>
              <div className="cm-legend-row">
                <span className="cm-dot" style={{ backgroundColor: '#ef4444' }}></span>
                <span className="cm-legend-text">Disabled</span>
                <span className="cm-legend-pct">3%</span>
              </div>
            </div>
          </div>

          {/* Immediate Needs Sub-section */}
          <div className="cm-immediate-needs-section">
            <div className="cm-sub-header">
              <span className="cm-sub-title">Immediate Needs</span>
              <button className="cm-card-link-btn">
                <span>View All</span>
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="cm-needs-grid">
              <div className="cm-need-box">
                <span className="cm-need-icon text-red">
                  <UtensilsCrossed size={16} />
                </span>
                <span className="cm-need-label">Food</span>
                <span className="cm-need-val text-red">2,800 units</span>
              </div>

              <div className="cm-need-box">
                <span className="cm-need-icon text-blue">
                  <Droplets size={16} />
                </span>
                <span className="cm-need-label">Clean Water</span>
                <span className="cm-need-val text-blue">5,000 units</span>
              </div>

              <div className="cm-need-box">
                <span className="cm-need-icon text-green">
                  <Plus size={16} />
                </span>
                <span className="cm-need-label">Medical Care</span>
                <span className="cm-need-val text-green">1,200 units</span>
              </div>

              <div className="cm-need-box">
                <span className="cm-need-icon text-orange">
                  <Home size={16} />
                </span>
                <span className="cm-need-label">Shelter</span>
                <span className="cm-need-val text-orange">800 units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Response Timeline */}
        <div className="cm-card cm-timeline-card">
          <div className="cm-card-header">
            <h3 className="cm-card-title">Response Timeline</h3>
            <button className="cm-card-link-btn">
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="cm-timeline-list">
            <div className="cm-timeline-item">
              <div className="cm-timeline-node bg-red"></div>
              <div className="cm-timeline-text-wrap">
                <span className="cm-timeline-time">14 Jun, 6:00 AM</span>
                <span className="cm-timeline-desc">Crisis reported by local authorities</span>
              </div>
            </div>

            <div className="cm-timeline-item">
              <div className="cm-timeline-node bg-blue"></div>
              <div className="cm-timeline-text-wrap">
                <span className="cm-timeline-time">14 Jun, 7:30 AM</span>
                <span className="cm-timeline-desc">Initial assessment completed</span>
              </div>
            </div>

            <div className="cm-timeline-item">
              <div className="cm-timeline-node bg-teal"></div>
              <div className="cm-timeline-text-wrap">
                <span className="cm-timeline-time">14 Jun, 9:15 AM</span>
                <span className="cm-timeline-desc">Response team deployed</span>
              </div>
            </div>

            <div className="cm-timeline-item">
              <div className="cm-timeline-node bg-green"></div>
              <div className="cm-timeline-text-wrap">
                <span className="cm-timeline-time">14 Jun, 11:00 AM</span>
                <span className="cm-timeline-desc">Temporary shelters activated</span>
              </div>
            </div>

            <div className="cm-timeline-item">
              <div className="cm-timeline-node bg-orange"></div>
              <div className="cm-timeline-text-wrap">
                <span className="cm-timeline-time">14 Jun, 1:30 PM</span>
                <span className="cm-timeline-desc">Medical assistance provided</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
         Assign Response Team Modal
         ========================================================= */}
      {showAssignModal && (
        <div className="cm-modal-backdrop" onClick={() => setShowAssignModal(false)}>
          <div className="cm-modal-card" onClick={e => e.stopPropagation()}>
            <div className="cm-modal-header">
              <div>
                <h3 className="cm-modal-title">Assign Emergency Response Team</h3>
                <p className="cm-modal-sub">Deploy dedicated response unit to {currentCrisis.title}</p>
              </div>
              <button className="cm-modal-close" onClick={() => setShowAssignModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="cm-modal-body">
              <div className="cm-modal-form-group">
                <label>Target Crisis Zone</label>
                <input type="text" value={`${currentCrisis.title} (${currentCrisis.location})`} readOnly />
              </div>

              <div className="cm-modal-form-group">
                <label>Select Deployment Unit</label>
                <select value={assignedTeam} onChange={e => setAssignedTeam(e.target.value)}>
                  <option value="Alpha Rescue Unit 4 (Colombo)">Alpha Rescue Unit 4 (Colombo) - 8 Specialists</option>
                  <option value="Bravo Medical Rapid Response (Kalutara)">Bravo Medical Rapid Response - 4 Paramedics, 2 Ambulances</option>
                  <option value="Sri Lanka Red Cross Disaster Team 2">Sri Lanka Red Cross Disaster Team 2 - 12 Volunteers</option>
                  <option value="Tri-Forces Amphibious Convoy 07">Tri-Forces Amphibious Convoy 07 - 3 Inflatable Boats</option>
                </select>
              </div>

              <div className="cm-modal-form-group">
                <label>Initial Instructions & Directives</label>
                <textarea rows="3" defaultValue="Conduct immediate evacuation of trapped residents on lower terraces. Stage high-ground assembly point at Royal College Sports Complex. Coordinate medical triage on site."></textarea>
              </div>
            </div>

            <div className="cm-modal-footer">
              <button className="cm-btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button className="cm-btn-primary" onClick={() => {
                alert(`Response team successfully assigned: ${assignedTeam}`);
                setShowAssignModal(false);
              }}>
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         Crisis Detail Modal
         ========================================================= */}
      {showCrisisDetailModal && (
        <div className="cm-modal-backdrop" onClick={() => setShowCrisisDetailModal(false)}>
          <div className="cm-modal-card" onClick={e => e.stopPropagation()}>
            <div className="cm-modal-header">
              <div>
                <h3 className="cm-modal-title">{currentCrisis.title} - Operational Dossier</h3>
                <p className="cm-modal-sub">Crisis ID: {currentCrisis.id} • {currentCrisis.location}</p>
              </div>
              <button className="cm-modal-close" onClick={() => setShowCrisisDetailModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="cm-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Total Estimated Impact</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{currentCrisis.affectedCount} Persons</span>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Declared Severity</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#ef4444' }}>{currentCrisis.severity} Priority</span>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                <p>{currentCrisis.description}</p>
                <p style={{ marginTop: '10px' }}>
                  <strong>Irrigation Department Telemetry:</strong> Water levels along the primary drainage corridors are currently exceeding minor flood stage by +0.35m. Emergency shelters within a 4km radius are 84% filled.
                </p>
              </div>
            </div>

            <div className="cm-modal-footer">
              <button className="cm-btn-secondary" onClick={() => setShowCrisisDetailModal(false)}>Close</button>
              <button 
                className="cm-btn-primary" 
                onClick={() => {
                  setShowCrisisDetailModal(false);
                  if (onOpenFullMap) onOpenFullMap();
                }}
              >
                Inspect on Satellite GIS Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


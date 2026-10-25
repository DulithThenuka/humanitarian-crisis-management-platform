import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  MapPin,
  Navigation,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  Crosshair,
  Route,
  Zap,
  ChevronRight
} from 'lucide-react';
import './OperationalMapView.css';

export const OperationalMapView = () => {
  // Map layer checkboxes
  const [layers, setLayers] = useState({
    crisisZones: true,
    requests: true,
    shelters: true,
    resources: true,
    volunteers: true,
    serviceCentres: true
  });

  const [activeIncidentId, setActiveIncidentId] = useState('REQ-01842');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMsg, setCaptureMsg] = useState('');

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCaptureClick = () => {
    setIsCapturing(!isCapturing);
    if (!isCapturing) {
      setCaptureMsg('Click on map or use My Location to record incident GPS');
    } else {
      setCaptureMsg('');
    }
  };

  const handleMyLocation = () => {
    setCaptureMsg('LAT: 6.9271° N  ·  LNG: 79.8612° E (Colombo Metro Hub)');
  };

  return (
    <div className="command-map-fullscreen">
      {/* =========================================================
          TOP COMMAND BAR (Matches Pic 1)
          ========================================================= */}
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
            onClick={handleCaptureClick}
          >
            <Crosshair size={14} />
            <span>{isCapturing ? 'Cancel Pin' : '+ Capture Incident GPS'}</span>
          </button>

          <button className="cmd-btn btn-locate" onClick={handleMyLocation}>
            <Navigation size={14} />
            <span>My Location</span>
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN 3-COLUMN WORKSPACE (Left Panel + Map Canvas + Right Panel)
          ========================================================= */}
      <div className="cmd-map-body-grid">
        {/* ---------------- 1. LEFT CONTROLS DOCK ---------------- */}
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

        {/* ---------------- 2. CENTER GIS MAP CANVAS ---------------- */}
        <section className="cmd-map-canvas-area">
          <svg className="cmd-map-svg" viewBox="0 0 1000 700" preserveAspectRatio="none">
            <defs>
              {/* Radial buffer gradients */}
              <radialGradient id="bufferColombo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="65%" stopColor="#ef4444" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="bufferKalutara" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.20" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ocean & Base dark background */}
            <rect width="1000" height="700" fill="#061217" />

            {/* Land Contours (Western Province coastal border) */}
            <path
              d="M 280,0 Q 340,180 430,320 T 480,520 T 560,700 L 1000,700 L 1000,0 Z"
              fill="#091d24"
            />

            {/* Concentric buffer rings for Colombo sector */}
            {layers.crisisZones && (
              <>
                <circle cx="610" cy="310" r="150" fill="url(#bufferColombo)" />
                <circle cx="610" cy="310" r="150" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="610" cy="310" r="85" fill="none" stroke="#ef4444" strokeWidth="1.2" opacity="0.8" />
                <circle cx="610" cy="310" r="28" fill="#ef4444" fillOpacity="0.18" />

                {/* Buffer label */}
                <text x="690" y="475" fill="#0e7490" fontSize="10.5" fontFamily="monospace">
                  5.0 km Shelter Buffer
                </text>

                {/* Kalutara buffer sector */}
                <circle cx="530" cy="500" r="80" fill="url(#bufferKalutara)" />
                <circle cx="530" cy="500" r="80" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              </>
            )}

            {/* Road Network & Polyline (OSRM Routing Line cutting through) */}
            <path
              d="M 480,360 L 585,320 L 760,290 L 880,265"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Secondary Transit lines */}
            <path
              d="M 610,310 L 660,215"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            <path
              d="M 610,310 L 530,500"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.5"
            />

            {/* Map Node Pins (Styled exactly as in Pic 1) */}
            {/* 1. Gampaha Hub (Top right) */}
            {layers.resources && (
              <g className="map-node-item" onClick={() => setActiveIncidentId('Gampaha Hub')}>
                <circle cx="660" cy="215" r="14" fill="#082128" stroke="#f59e0b" strokeWidth="2.5" />
                <polygon points="660,208 667,220 653,220" fill="#f59e0b" />
                <rect x="682" y="204" width="85" height="20" rx="10" fill="#071b22" stroke="#163845" />
                <text x="690" y="218" fill="#f8fafc" fontSize="10.5" fontWeight="700">Gampaha Hub</text>
              </g>
            )}

            {/* 2. Colombo Hub (Depot) */}
            {layers.resources && (
              <g className="map-node-item" onClick={() => setActiveIncidentId('Colombo')}>
                <circle cx="570" cy="305" r="12" fill="#082128" stroke="#f59e0b" strokeWidth="2.5" />
                <polygon points="570,300 576,310 564,310" fill="#f59e0b" />
                <rect x="586" y="295" width="60" height="18" rx="4" fill="#071b22" />
                <text x="590" y="308" fill="#e2e8f0" fontSize="10" fontWeight="700">Colombo</text>
              </g>
            )}

            {/* 3. REQ-01865 — HIGH (Assistance Request) */}
            {layers.requests && (
              <g className="map-node-item">
                <circle cx="618" cy="290" r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                <text x="614" y="294" fill="#ffffff" fontSize="9" fontWeight="800">!</text>
                <text x="635" y="294" fill="#38bdf8" fontSize="10.5" fontWeight="800">
                  REQ-01865 — HIGH
                </text>
              </g>
            )}

            {/* 4. Kelaniya (15 beds) Shelter */}
            {layers.shelters && (
              <g className="map-node-item">
                <circle cx="620" cy="315" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                <text x="636" y="318" fill="#6ee7b7" fontSize="10" fontWeight="700">
                  Kelaniya (15 beds)
                </text>
              </g>
            )}

            {/* 5. REQ-01842 — CRITICAL Incident */}
            {layers.requests && (
              <g className="map-node-item active-target-pulse">
                <circle cx="605" cy="340" r="22" fill="#ef4444" fillOpacity="0.25" />
                <circle cx="605" cy="340" r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                <path d="M 605,333 L 610,344 L 600,344 Z" fill="#ffffff" />
                <text x="626" y="344" fill="#fca5a5" fontSize="10.5" fontWeight="900">
                  REQ-01842 — CRITICAL
                </text>
              </g>
            )}

            {/* 6. Volunteer Unit */}
            {layers.volunteers && (
              <g className="map-node-item">
                <circle cx="612" cy="370" r="11" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="612" cy="370" r="5" fill="#ffffff" />
              </g>
            )}

            {/* 7. Colombo (66 beds) Shelter */}
            {layers.shelters && (
              <g className="map-node-item">
                <circle cx="595" cy="390" r="13" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <rect x="589" y="384" width="12" height="12" rx="2" fill="#ffffff" />
                <text x="615" y="394" fill="#a7f3d0" fontSize="10.5" fontWeight="700">
                  Colombo (66 beds)
                </text>
              </g>
            )}

            {/* 8. Southern Sector: REQ-01899 — HIGH */}
            {layers.requests && (
              <g className="map-node-item">
                <circle cx="515" cy="510" r="13" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                <text x="535" y="514" fill="#7dd3fc" fontSize="10.5" fontWeight="800">
                  REQ-01899 — HIGH
                </text>
              </g>
            )}

            {/* 9. Kalutara (76 beds) */}
            {layers.shelters && (
              <g className="map-node-item">
                <circle cx="525" cy="535" r="11" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                <text x="543" y="539" fill="#a7f3d0" fontSize="10.5" fontWeight="700">
                  Kalutara (76 beds)
                </text>
              </g>
            )}
          </svg>

          {/* Floating Scale & Status Badges */}
          <div className="canvas-floating-scale">
            <span className="scale-box">10 km scale</span>
          </div>

          <div className="canvas-floating-coords">
            <span>LAT: 6.9271° N · LNG: 79.8612° E · WESTERN BASIN</span>
          </div>

          {captureMsg && (
            <div className="canvas-floating-alert">
              <Crosshair size={13} className="text-cyan" />
              <span>{captureMsg}</span>
            </div>
          )}
        </section>

        {/* ---------------- 3. RIGHT LOGISTICS DOCK (Matches Pic 1) ---------------- */}
        <aside className="cmd-right-dock">
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

            {/* Matched Hub Item 1 */}
            <div className="match-card-item">
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
              <button className="dispatch-1click-btn">
                <CheckCircle2 size={12} />
                <span>1-Click Dispatch Closest Stock</span>
              </button>
            </div>

            {/* Matched Hub Item 2 */}
            <div className="match-card-item">
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
              <button className="dispatch-1click-btn">
                <CheckCircle2 size={12} />
                <span>1-Click Dispatch Closest Stock</span>
              </button>
            </div>

            {/* Matched Hub Item 3 */}
            <div className="match-card-item">
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
              <button className="dispatch-1click-btn">
                <CheckCircle2 size={12} />
                <span>1-Click Dispatch Closest Stock</span>
              </button>
            </div>
          </div>

          {/* Turn-by-Turn Route Guidance Box */}
          <div className="dock-card">
            <div className="dock-card-header">
              <div className="card-heading-group">
                <Route size={14} className="text-cyan" />
                <span className="card-heading-upper">Turn-by-Turn Route Guidance</span>
              </div>
              <span className="step-count-chip">Step 1 of 3</span>
            </div>

            {/* Route step 1 */}
            <div className="route-step-card">
              <div className="step-top">
                <span className="step-badge">1</span>
                <strong className="step-title">Depart Depot via Port Access Highway toward Kelaniya</strong>
              </div>
              <span className="step-note">Distance: 1.8 km · Surface: clear</span>
            </div>

            {/* Route step 2 with Flood Warning */}
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
        </aside>
      </div>
    </div>
  );
};
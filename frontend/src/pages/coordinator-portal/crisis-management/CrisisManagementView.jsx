import React from 'react';
import {
  Plus,
  Minus,
  Navigation,
  Search,
  MapPin,
  AlertTriangle
} from 'lucide-react';

export const CrisisManagementView = ({
  incidents,
  selectedIncidentId,
  setSelectedIncidentId,
  currentIncident,
  onOpenCreateIncidentModal,
  onNavigateTab,
  showToast
}) => {
  return (
    <div className="ec-portal-canvas">
      {/* Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">INCIDENT COMMAND</span>
          <h2 className="ec-review-main-title">Crisis &amp; Incident Management</h2>
          <p className="ec-review-sub-meta">
            Monitor active incidents, related requests, response teams and unresolved issues.
          </p>
        </div>
        <button
          className="ec-btn-hero-primary"
          onClick={onOpenCreateIncidentModal}
        >
          <Plus size={15} />
          <span>Create incident record</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="ec-req-toolbar-card" style={{ padding: '8px 14px' }}>
        <div className="ec-req-toolbar-row">
          <div className="ec-req-search-box" style={{ maxWidth: '360px' }}>
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search incidents or locations..."
              className="ec-search-input"
            />
          </div>
          <div className="ec-req-filter-group">
            <select className="ec-filter-dropdown-btn">
              <option>All severities</option>
              <option>High severity</option>
              <option>Medium severity</option>
            </select>
            <select className="ec-filter-dropdown-btn">
              <option>Active incidents</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upper Grid: Incidents List + Interactive Map */}
      <div className="ec-crisis-upper-grid">
        {/* Left Column: Incidents Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className={`ec-incident-card ${inc.id === selectedIncidentId ? 'active' : ''}`}
              onClick={() => setSelectedIncidentId(inc.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="ec-meta-label-tiny">{inc.id}</span>
                <span className={inc.severity === 'High' ? 'ec-badge-critical' : 'ec-badge-high'}>
                  ● {inc.severity}
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                {inc.title}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <MapPin size={12} color="#0284c7" />
                <span>{inc.area}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span className="ec-resource-tag-pill">{inc.stats}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Crisis Map Viewport */}
        <div className="ec-panel-card" style={{ padding: '12px' }}>
          <div className="ec-map-viewport" style={{ height: '340px' }}>
            <svg className="ec-map-svg-canvas" viewBox="0 0 600 340">
              <defs>
                <pattern id="crisisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5e3f0" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#crisisGrid)" />

              {/* Flood Channel */}
              <path
                d="M -20 200 Q 150 170 300 220 T 620 190"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="28"
                opacity="0.8"
              />

              {/* Crisis Hazard Zone */}
              <circle cx="210" cy="150" r="70" fill="#ef4444" fillOpacity="0.16" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="210" cy="150" r="42" fill="#ef4444" fillOpacity="0.25" />

              {/* Hazard Pill */}
              <g transform="translate(182, 138)">
                <rect width="64" height="20" rx="4" fill="#dc2626" />
                <text x="32" y="14" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  ▲ 17 critical
                </text>
              </g>

              {/* Resource Depot Marker */}
              <g transform="translate(370, 110)">
                <rect width="84" height="20" rx="4" fill="#0284c7" />
                <text x="42" y="14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  RES-021 · 240
                </text>
              </g>

              {/* Shelter Marker */}
              <g transform="translate(340, 240)">
                <rect width="96" height="20" rx="4" fill="#0a192f" />
                <text x="48" y="14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  SH-008 · 36 spaces
                </text>
              </g>
            </svg>

            {/* Controls */}
            <div className="ec-map-controls-dock">
              <button className="ec-map-zoom-btn" onClick={() => showToast('Zoomed in')}>
                <Plus size={14} />
              </button>
              <button className="ec-map-zoom-btn" onClick={() => showToast('Zoomed out')}>
                <Minus size={14} />
              </button>
              <button className="ec-map-zoom-btn" onClick={() => showToast('Centered on incident location')}>
                <Navigation size={12} />
              </button>
            </div>

            {/* Layers Dock */}
            <div className="ec-map-layers-dock">
              <span className="ec-meta-label-tiny" style={{ marginBottom: '2px' }}>Visible layers</span>
              <div className="ec-layer-item">
                <span style={{ color: '#ef4444' }}>●</span>
                <span>Critical requests</span>
              </div>
              <div className="ec-layer-item">
                <span style={{ color: '#10b981' }}>●</span>
                <span>Verified shelters</span>
              </div>
              <div className="ec-layer-item">
                <span style={{ color: '#0284c7' }}>●</span>
                <span>Resource depots</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section: Incident Detail Panel */}
      <div className="ec-incident-detail-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
              {currentIncident.title}
            </h3>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {currentIncident.id} · Lead team: {currentIncident.leadTeam}
            </div>
          </div>
          <span className="ec-badge-critical">● {currentIncident.severity} severity</span>
        </div>

        {/* 4-Item Metric Quad */}
        <div className="ec-incident-quad-metrics">
          <div className="ec-meta-quad-item">
            <span className="ec-meta-label-tiny">AFFECTED ESTIMATE</span>
            <span className="ec-meta-val-text">{currentIncident.affectedEstimate}</span>
          </div>
          <div className="ec-meta-quad-item">
            <span className="ec-meta-label-tiny">RELATED REQUESTS</span>
            <span
              className="ec-meta-val-text"
              style={{ color: '#0284c7', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => onNavigateTab('requests')}
            >
              {currentIncident.relatedRequests}
            </span>
          </div>
          <div className="ec-meta-quad-item">
            <span className="ec-meta-label-tiny">ASSIGNED COORDINATOR</span>
            <span className="ec-meta-val-text">{currentIncident.assignedCoordinator}</span>
          </div>
          <div className="ec-meta-quad-item">
            <span className="ec-meta-label-tiny">CURRENT STATUS</span>
            <span className="ec-meta-val-text" style={{ color: '#059669' }}>{currentIncident.currentStatus}</span>
          </div>
        </div>

        {/* Split Sub-rows: Unresolved Issues & Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Left: Unresolved Issues */}
          <div>
            <span className="ec-meta-label-tiny" style={{ display: 'block', marginBottom: '10px' }}>
              UNRESOLVED ISSUES
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentIncident.unresolvedIssues?.map((iss) => (
                <div key={iss.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={13} color={iss.severity === 'Critical' ? '#ef4444' : '#f59e0b'} />
                      <span>{iss.title}</span>
                    </span>
                    <span className={iss.severity === 'Critical' ? 'ec-badge-critical' : 'ec-badge-high'}>
                      {iss.severity}
                    </span>
                  </div>
                  <div className="ec-meter-track">
                    <div
                      className={iss.severity === 'Critical' ? 'ec-meter-fill-red' : 'ec-meter-fill-amber'}
                      style={{ width: `${iss.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Situation Timeline */}
          <div>
            <span className="ec-meta-label-tiny" style={{ display: 'block', marginBottom: '10px' }}>
              SITUATION TIMELINE
            </span>
            <div className="ec-history-stepper-list">
              {currentIncident.timeline?.map((step, idx) => (
                <div key={idx} className="ec-history-step-row">
                  <span className="ec-step-time-lbl">{step.time}</span>
                  <div className="ec-step-bullet-dot" />
                  <div>
                    <div className="ec-step-title">{step.event}</div>
                    <div className="ec-step-actor">{step.actor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          <button
            className="ec-btn-hero-outline"
            onClick={() => showToast('Update log form opened')}
          >
            Record update
          </button>
          <button
            className="ec-btn-hero-outline"
            onClick={() => onNavigateTab('requests')}
          >
            Link requests
          </button>
          <button
            className="ec-btn-hero-primary"
            onClick={() => showToast('Incident escalated to National Disaster Management Center (DMC)', 'warning')}
          >
            Escalate incident
          </button>
        </div>
      </div>
    </div>
  );
};

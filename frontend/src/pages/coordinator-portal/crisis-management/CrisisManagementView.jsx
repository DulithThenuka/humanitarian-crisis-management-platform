import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  MapPin,
  AlertTriangle,
  Layers,
  Filter
} from 'lucide-react';
import { CoordinatorInteractiveMap } from '../components/CoordinatorInteractiveMap';

export const CrisisManagementView = ({
  incidents = [],
  selectedIncidentId,
  setSelectedIncidentId,
  currentIncident,
  shelters = [],
  resources = [],
  onOpenCreateIncidentModal,
  onNavigateTab,
  showToast
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtered Incidents based on Search, Severity & Status
  const filteredIncidents = useMemo(() => {
    return (incidents || []).filter(inc => {
      // 1. Search Query
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (inc.title || '').toLowerCase().includes(q);
        const idMatch = (inc.id || '').toLowerCase().includes(q);
        const areaMatch = (inc.area || '').toLowerCase().includes(q);
        if (!titleMatch && !idMatch && !areaMatch) return false;
      }

      // 2. Severity Filter
      if (severityFilter !== 'all') {
        const sev = (inc.severity || '').toLowerCase();
        if (severityFilter === 'critical' && sev !== 'critical') return false;
        if (severityFilter === 'high' && sev !== 'high') return false;
        if (severityFilter === 'medium' && sev !== 'medium' && sev !== 'moderate') return false;
      }

      // 3. Status Filter
      if (statusFilter !== 'all') {
        const stat = (inc.currentStatus || inc.status || '').toLowerCase();
        const isResolved = stat.includes('resolved') || stat.includes('closed');
        if (statusFilter === 'active' && isResolved) return false;
        if (statusFilter === 'resolved' && !isResolved) return false;
      }

      return true;
    });
  }, [incidents, searchQuery, severityFilter, statusFilter]);

  // Active Incident Selection
  const activeIncident = useMemo(() => {
    if (selectedIncidentId) {
      const match = (incidents || []).find(i => i.id === selectedIncidentId);
      if (match) return match;
    }
    return currentIncident || (filteredIncidents.length > 0 ? filteredIncidents[0] : (incidents[0] || null));
  }, [selectedIncidentId, incidents, currentIncident, filteredIncidents]);

  return (
    <div className="ec-portal-canvas">
      {/* Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">INCIDENT COMMAND</span>
          <h2 className="ec-review-main-title">Crisis &amp; Incident Management</h2>
          <p className="ec-review-sub-meta">
            Live database incident command · Real geographic positioning &amp; operational resource synchronization.
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
            <Search size={14} color="#8a9480" />
            <input
              type="text"
              placeholder="Search incidents or locations..."
              className="ec-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ec-req-filter-group">
            <select
              className="ec-filter-dropdown-btn"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="all">All severities</option>
              <option value="critical">Critical severity</option>
              <option value="high">High severity</option>
              <option value="medium">Medium severity</option>
            </select>
            <select
              className="ec-filter-dropdown-btn"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All incident status</option>
              <option value="active">Active incidents</option>
              <option value="resolved">Resolved / Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upper Grid: Incidents List + Interactive Map */}
      <div className="ec-crisis-upper-grid">
        {/* Left Column: Incidents Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
          {filteredIncidents.length === 0 ? (
            <div style={{
              padding: '28px 16px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #dfe5d8',
              color: '#657367',
              fontSize: '13px'
            }}>
              No incidents match the active search or filter criteria.
            </div>
          ) : (
            filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                className={`ec-incident-card ${inc.id === activeIncident?.id ? 'active' : ''}`}
                onClick={() => setSelectedIncidentId && setSelectedIncidentId(inc.id)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="ec-meta-label-tiny">{inc.id}</span>
                  <span className={(inc.severity || '').toLowerCase() === 'critical' ? 'ec-badge-critical' : 'ec-badge-high'}>
                    ● {inc.severity || 'High'}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#14291e', marginBottom: '4px' }}>
                  {inc.title}
                </div>
                <div style={{ fontSize: '11.5px', color: '#657367', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <MapPin size={12} color="#3d6b4f" />
                  <span>{inc.area}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="ec-resource-tag-pill">{inc.stats}</span>
                  {inc.parsedLat || (typeof (inc.lat ?? inc.latitude) === 'number') ? (
                    <span style={{ fontSize: '10.5px', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                      ✓ Geocoded
                    </span>
                  ) : (
                    <span style={{ fontSize: '10.5px', color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                      ⚠ No coords
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Real Geographic Leaflet Map */}
        <div className="ec-panel-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#14291e' }}>
              INCIDENT GEOSPATIAL MAP
            </span>
            <span style={{ fontSize: '11px', color: '#657367' }}>
              {filteredIncidents.length} active in view · Synchronized with queue
            </span>
          </div>

          <CoordinatorInteractiveMap
            height="360px"
            mode="incident"
            cases={filteredIncidents}
            shelters={shelters}
            resources={resources}
            crises={incidents}
            selectedIncidentId={activeIncident?.id}
            onSelectIncident={setSelectedIncidentId}
            onNavigateTab={onNavigateTab}
          />
        </div>
      </div>

      {/* Lower Section: Incident Detail Panel */}
      {activeIncident && (
        <div className="ec-incident-detail-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#14291e', margin: '0 0 2px 0' }}>
                {activeIncident.title || 'Incident Event'}
              </h3>
              <div style={{ fontSize: '12px', color: '#657367' }}>
                {activeIncident.id} · Lead team: {activeIncident.leadTeam || 'National Relief Unit'}
              </div>
            </div>
            <span className={(activeIncident.severity || '').toLowerCase() === 'critical' ? 'ec-badge-critical' : 'ec-badge-high'}>
              ● {activeIncident.severity || 'High'} severity
            </span>
          </div>

          {/* 4-Item Metric Quad */}
          <div className="ec-incident-quad-metrics">
            <div className="ec-meta-quad-item">
              <span className="ec-meta-label-tiny">AFFECTED ESTIMATE</span>
              <span className="ec-meta-val-text">{activeIncident.affectedEstimate || 'Assessing'}</span>
            </div>
            <div className="ec-meta-quad-item">
              <span className="ec-meta-label-tiny">RELATED REQUESTS</span>
              <span
                className="ec-meta-val-text"
                style={{ color: '#3d6b4f', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => onNavigateTab && onNavigateTab('requests')}
              >
                {activeIncident.relatedRequests || 'Open'}
              </span>
            </div>
            <div className="ec-meta-quad-item">
              <span className="ec-meta-label-tiny">ASSIGNED COORDINATOR</span>
              <span className="ec-meta-val-text">{activeIncident.assignedCoordinator || 'Emergency Coordinator'}</span>
            </div>
            <div className="ec-meta-quad-item">
              <span className="ec-meta-label-tiny">CURRENT STATUS</span>
              <span className="ec-meta-val-text" style={{ color: '#059669' }}>{activeIncident.currentStatus || 'Active'}</span>
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
                {(activeIncident.unresolvedIssues && activeIncident.unresolvedIssues.length > 0) ? (
                  activeIncident.unresolvedIssues.map((iss) => (
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
                          style={{ width: `${iss.percentage || 60}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#657367', fontStyle: 'italic', padding: '8px 0' }}>
                    No critical unresolved issues currently flagged.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Situation Timeline */}
            <div>
              <span className="ec-meta-label-tiny" style={{ display: 'block', marginBottom: '10px' }}>
                SITUATION TIMELINE
              </span>
              <div className="ec-history-stepper-list">
                {((activeIncident.timeline && activeIncident.timeline.length > 0) ? activeIncident.timeline : [
                  {
                    time: '08:00 AM',
                    event: 'Emergency operations coordination active',
                    actor: 'Response Center'
                  }
                ]).map((step, idx) => (
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eef1ea' }}>
            <button
              className="ec-btn-hero-outline"
              onClick={() => showToast && showToast('Update log form opened')}
            >
              Record update
            </button>
            <button
              className="ec-btn-hero-outline"
              onClick={() => onNavigateTab && onNavigateTab('requests')}
            >
              Link requests
            </button>
            <button
              className="ec-btn-hero-primary"
              onClick={() => showToast && showToast('Incident escalated to National Disaster Management Center (DMC)', 'warning')}
            >
              Escalate incident
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

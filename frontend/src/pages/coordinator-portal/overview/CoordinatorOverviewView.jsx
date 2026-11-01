import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  AlertTriangle,
  HelpCircle,
  MapPin,
  Users,
  Megaphone,
  Plus,
  Minus,
  Navigation,
  ChevronRight,
  CheckCircle2,
  Package,
  Home
} from 'lucide-react';

import {
  RESPONSE_PERFORMANCE,
  EMERGENCY_ALERTS
} from '../data/coordinatorPortalData';
import './CoordinatorOverviewView.css';

export const CoordinatorOverviewView = ({
  metrics,
  cases,
  recentActivity,
  onOpenCaseReview,
  onNavigateTab,
  onOpenAlertModal,
  showToast
}) => {
  const navigate = useNavigate();
  const [mapZoom, setMapZoom] = useState(1);

  return (
    <div className="ec-portal-canvas">
      {/* Hero Welcome Card */}
      <div className="ec-hero-card">
        <div>
          <div className="ec-hero-date-badge">
            WEDNESDAY, 18 FEBRUARY 2026 · 10:15
          </div>
          <h2 className="ec-hero-main-title">
            Welcome back, Emergency Coordinator
          </h2>
          <p className="ec-hero-sub-meta">
            Western Province Flood Response · Current operational status: Active
          </p>
        </div>

        <div className="ec-hero-actions-dock">
          <button
            className="ec-btn-hero-outline"
            onClick={onOpenAlertModal}
          >
            <Megaphone size={14} />
            <span>Create alert</span>
          </button>
          <button
            className="ec-btn-hero-primary"
            onClick={() => onNavigateTab('requests')}
          >
            <FileText size={14} />
            <span>Review requests</span>
          </button>
        </div>
      </div>

      {/* Operational Status Sub-bar */}
      <div className="ec-status-sub-bar">
        <div className="ec-status-left">
          <div className="ec-status-dot-active" />
          <span>
            <strong className="ec-status-bold">Operations active</strong> All core coordination services available
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          Last operational update 2 minutes ago
        </span>
      </div>

      {/* 6 KPI Metric Stat Cards */}
      <div className="ec-kpi-cards-grid">
        <div
          className="ec-kpi-stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('requests')}
          title="View all incoming requests"
        >
          <div className="ec-kpi-card-head">
            <span className="ec-kpi-title-label">Incoming requests</span>
            <div className="ec-kpi-icon-pill" style={{ backgroundColor: '#eff6ff', color: '#0284c7' }}>
              <FileText size={14} />
            </div>
          </div>
          <div className="ec-kpi-big-num">
            <span>{metrics.incomingRequests}</span>
            <span className="ec-kpi-sub-trend">{metrics.incomingTrend}</span>
          </div>
        </div>

        <div
          className="ec-kpi-stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('requests')}
        >
          <div className="ec-kpi-card-head">
            <span className="ec-kpi-title-label">Pending reviews</span>
            <div className="ec-kpi-icon-pill" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
              <Clock size={14} />
            </div>
          </div>
          <div className="ec-kpi-big-num">
            <span>{metrics.pendingReviews}</span>
            <span className="ec-kpi-sub-trend" style={{ color: '#d97706' }}>{metrics.pendingTrend}</span>
          </div>
        </div>

        <div
          className="ec-kpi-stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('requests')}
        >
          <div className="ec-kpi-card-head">
            <span className="ec-kpi-title-label">Critical &amp; high priority</span>
            <div className="ec-kpi-icon-pill" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              <AlertTriangle size={14} />
            </div>
          </div>
          <div className="ec-kpi-big-num">
            <span>{metrics.criticalPriority}</span>
            <span className="ec-kpi-sub-trend" style={{ color: '#dc2626' }}>{metrics.criticalTrend}</span>
          </div>
        </div>

        <div
          className="ec-kpi-stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('requests')}
        >
          <div className="ec-kpi-card-head">
            <span className="ec-kpi-title-label">More information required</span>
            <div className="ec-kpi-icon-pill" style={{ backgroundColor: '#f0fdf4', color: '#059669' }}>
              <HelpCircle size={14} />
            </div>
          </div>
          <div className="ec-kpi-big-num">
            <span>{metrics.moreInfoRequired}</span>
            <span className="ec-kpi-sub-trend">{metrics.moreInfoTrend}</span>
          </div>
        </div>

        <div
          className="ec-kpi-stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('crisis')}
        >
          <div className="ec-kpi-card-head">
            <span className="ec-kpi-title-label">Active emergencies</span>
            <div className="ec-kpi-icon-pill" style={{ backgroundColor: '#ffe4e6', color: '#e11d48' }}>
              <MapPin size={14} />
            </div>
          </div>
          <div className="ec-kpi-big-num">
            <span>{metrics.activeEmergencies}</span>
            <span className="ec-kpi-sub-trend">{metrics.emergenciesTrend}</span>
          </div>
        </div>

        <div
          className="ec-kpi-stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/volunteers/roster')}
        >
          <div className="ec-kpi-card-head">
            <span className="ec-kpi-title-label">Volunteers assigned</span>
            <div className="ec-kpi-icon-pill" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <Users size={14} />
            </div>
          </div>
          <div className="ec-kpi-big-num">
            <span>{metrics.volunteersAssigned}</span>
            <span className="ec-kpi-sub-trend">{metrics.volunteersTrend}</span>
          </div>
        </div>
      </div>

      {/* Regional Crisis Map + Priority Cases Row */}
      <div className="ec-grid-map-and-cases">
        {/* Left: Map */}
        <div className="ec-panel-card">
          <div className="ec-panel-card-head">
            <div>
              <h3 className="ec-panel-title-text">Regional crisis overview</h3>
              <p className="ec-panel-subtitle-text">Illustrative incident markers - not live tracking</p>
            </div>
            <button className="ec-panel-link-btn" onClick={() => navigate('/map')}>
              Open crisis map
            </button>
          </div>

          <div className="ec-map-viewport">
            <svg className="ec-map-svg-canvas" viewBox="0 0 600 280">
              <defs>
                <pattern id="gridPatternOverview" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5e3f0" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPatternOverview)" />

              {/* River Corridor */}
              <path
                d="M -20 180 Q 150 160 300 200 T 620 170"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="24"
                opacity="0.8"
              />

              {/* Crisis Hazard Circle Overlay */}
              <circle cx="210" cy="140" r="65" fill="#ef4444" fillOpacity="0.16" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="210" cy="140" r="38" fill="#ef4444" fillOpacity="0.25" />

              {/* Hazard Badge Pill */}
              <g transform="translate(182, 128)">
                <rect width="64" height="20" rx="4" fill="#dc2626" />
                <text x="32" y="14" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  ▲ 17 critical
                </text>
              </g>

              {/* Resource Depot Marker */}
              <g transform="translate(350, 95)">
                <rect width="84" height="20" rx="4" fill="#0284c7" />
                <text x="42" y="14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  RES-021 · 240
                </text>
              </g>

              {/* Shelter Marker */}
              <g transform="translate(330, 215)">
                <rect width="96" height="20" rx="4" fill="#0a192f" />
                <text x="48" y="14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  SH-008 · 36 spaces
                </text>
              </g>
            </svg>

            {/* Map Controls */}
            <div className="ec-map-controls-dock">
              <button className="ec-map-zoom-btn" onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 2))}>
                <Plus size={14} />
              </button>
              <button className="ec-map-zoom-btn" onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}>
                <Minus size={14} />
              </button>
              <button className="ec-map-zoom-btn" onClick={() => showToast('Centered map on Western Province HQ')}>
                <Navigation size={12} />
              </button>
            </div>

            {/* Layers Pill */}
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

        {/* Right: Priority Cases List */}
        <div className="ec-panel-card">
          <div className="ec-panel-card-head">
            <div>
              <h3 className="ec-panel-title-text">Priority cases</h3>
              <p className="ec-panel-subtitle-text">Require coordinator attention</p>
            </div>
            <span className="ec-badge-critical">● 5 critical</span>
          </div>

          <div className="ec-priority-cases-stack">
            {cases.map((c) => (
              <div
                key={c.id}
                className="ec-priority-case-row"
                onClick={() => onOpenCaseReview(c.id)}
                title={`Review request ${c.id}`}
              >
                <div className="ec-case-row-left">
                  <div className="ec-case-index-pill">{c.index}</div>
                  <div>
                    <div className="ec-case-title-bold">{c.id} · {c.category}</div>
                    <div className="ec-case-meta-line">{c.location} · {c.timeAgo}</div>
                  </div>
                </div>

                <div className="ec-case-row-right">
                  <span className={c.severity === 'Critical' ? 'ec-badge-critical' : c.severity === 'High' ? 'ec-badge-high' : 'ec-badge-medium'}>
                    ● {c.severity}
                  </span>
                  <ChevronRight size={14} color="#94a3b8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 3 Cards: Performance, Alerts, Activity */}
      <div className="ec-bottom-tri-grid">
        {/* Response Performance Card */}
        <div className="ec-panel-card">
          <div className="ec-panel-card-head">
            <div>
              <h3 className="ec-panel-title-text">Response performance</h3>
              <p className="ec-panel-subtitle-text">Measured prototype values - last 7 days</p>
            </div>
            <button className="ec-panel-link-btn" onClick={() => navigate('/reports')}>
              Reports
            </button>
          </div>

          <div>
            {RESPONSE_PERFORMANCE.map((item, idx) => (
              <div key={idx} className="ec-perf-row">
                <div className="ec-perf-labels">
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 800 }}>{item.value}%</span>
                </div>
                <div className="ec-perf-bar-track">
                  <div
                    className="ec-perf-bar-fill"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Alerts Card */}
        <div className="ec-panel-card">
          <div className="ec-panel-card-head">
            <div>
              <h3 className="ec-panel-title-text">Emergency alerts</h3>
              <p className="ec-panel-subtitle-text">Published and awaiting action</p>
            </div>
            <button className="ec-panel-link-btn" onClick={onOpenAlertModal}>
              + New
            </button>
          </div>

          <div className="ec-alert-list-stack">
            {EMERGENCY_ALERTS.map((alt) => (
              <div key={alt.id} className="ec-alert-item-card">
                <div className="ec-alert-item-left">
                  <AlertTriangle
                    size={16}
                    color={alt.severity === 'Critical' ? '#dc2626' : '#d97706'}
                  />
                  <div>
                    <div className="ec-alert-title-bold">{alt.title}</div>
                    <div className="ec-alert-meta-line">{alt.meta}</div>
                  </div>
                </div>
                <span className={alt.severity === 'Critical' ? 'ec-badge-critical' : 'ec-badge-pending'}>
                  ● {alt.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="ec-panel-card">
          <div className="ec-panel-card-head">
            <div>
              <h3 className="ec-panel-title-text">Recent activity</h3>
              <p className="ec-panel-subtitle-text">Your operational actions</p>
            </div>
            <button className="ec-panel-link-btn" onClick={() => navigate('/audit')}>
              Audit
            </button>
          </div>

          <div className="ec-recent-activity-stack">
            {recentActivity.slice(0, 4).map((act) => (
              <div key={act.id} className="ec-activity-item-row">
                <span className="ec-time-stamp-col">{act.time}</span>
                <div className="ec-activity-body-col">
                  <div className="ec-activity-title-bold">
                    <CheckCircle2 size={12} color="#0284c7" />
                    <span>{act.title}</span>
                  </div>
                  <div className="ec-activity-sub-ref">{act.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="ec-quick-actions-bar">
        <span className="ec-qa-label">QUICK ACTIONS</span>
        <div className="ec-qa-btn-group">
          <button
            className="ec-qa-btn"
            onClick={() => onNavigateTab('requests')}
          >
            <FileText size={13} color="#0284c7" />
            <span>Review incoming requests</span>
          </button>

          <button
            className="ec-qa-btn"
            onClick={() => navigate('/logistics/inventory')}
          >
            <Package size={13} color="#0284c7" />
            <span>View resource availability</span>
          </button>

          <button
            className="ec-qa-btn"
            onClick={() => navigate('/shelters/directory')}
          >
            <Home size={13} color="#0284c7" />
            <span>Check shelters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

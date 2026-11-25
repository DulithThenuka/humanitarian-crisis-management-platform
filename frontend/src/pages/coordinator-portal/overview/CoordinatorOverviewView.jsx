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
import { CoordinatorInteractiveMap } from '../components/CoordinatorInteractiveMap';
import './CoordinatorOverviewView.css';

export const CoordinatorOverviewView = ({
  metrics,
  cases,
  recentActivity,
  alerts,
  shelters = [],
  resources = [],
  crises = [],
  onOpenCaseReview,
  onNavigateTab,
  onOpenAlertModal,
  showToast,
  coordinator,
  isLive
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
            Welcome back, {coordinator?.fullName || 'Emergency Coordinator'}
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
        <span style={{ fontSize: '11px', color: '#657367' }}>
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
            <div className="ec-kpi-icon-pill" style={{ backgroundColor: '#eff6ff', color: '#3d6b4f' }}>
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
            <div className="ec-kpi-icon-pill" style={{ backgroundColor: '#edf2e6', color: '#3d6b4f' }}>
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
        {/* Left: Interactive Regional Crisis Map */}
        <div className="ec-panel-card">
          <div className="ec-panel-card-head">
            <div>
              <h3 className="ec-panel-title-text">Regional crisis overview</h3>
              <p className="ec-panel-subtitle-text">
                {isLive ? 'Live Database Geospatial Map · Western Province & Hazard Sectors' : 'Geographic Operations Map · Synchronized with Live Backend'}
              </p>
            </div>
            <button className="ec-panel-link-btn" onClick={() => onNavigateTab ? onNavigateTab('crisis') : navigate('/map')}>
              Open incident map
            </button>
          </div>

          <CoordinatorInteractiveMap
            height="290px"
            cases={cases}
            shelters={shelters}
            resources={resources}
            crises={crises}
            onOpenCaseReview={onOpenCaseReview}
            onNavigateTab={onNavigateTab}
            mode="overview"
          />
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
                  <ChevronRight size={14} color="#8a9480" />
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
              <p className="ec-panel-subtitle-text">{isLive ? 'Operational performance metrics - live operational window' : 'Measured prototype values - last 7 days'}</p>
            </div>
            <button className="ec-panel-link-btn" onClick={() => navigate('/reports')}>
              Reports
            </button>
          </div>

          <div>
            {(isLive ? [
              {
                label: 'Request review & triage rate',
                value: Math.min(100, Math.max(0, Math.round(((metrics.incomingRequests - metrics.pendingReviews) / Math.max(1, metrics.incomingRequests)) * 100)))
              },
              {
                label: 'Shelter capacity utilization',
                value: Math.min(100, Math.max(0, Math.round(metrics.shelterUtilizationRate || 68)))
              },
              {
                label: 'Critical case response readiness',
                value: Math.min(100, Math.max(0, Math.round((1 - (metrics.lowStockResources || 0) / 10) * 100)))
              }
            ] : RESPONSE_PERFORMANCE).map((item, idx) => (
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
            {(alerts && alerts.length > 0 ? alerts.slice(0, 5) : EMERGENCY_ALERTS).map((alt) => (
              <div key={alt.id} className="ec-alert-item-card">
                <div className="ec-alert-item-left">
                  <AlertTriangle
                    size={16}
                    color={alt.severity === 'Critical' ? '#dc2626' : '#d97706'}
                  />
                  <div>
                    <div className="ec-alert-title-bold">{alt.title}</div>
                    <div className="ec-alert-meta-line">
                      {alt.meta || `${alt.area || 'Western Province'} · ${alt.lastUpdated || alt.updated || 'Recently'}`}
                    </div>
                  </div>
                </div>
                <span className={alt.severity === 'Critical' ? 'ec-badge-critical' : 'ec-badge-pending'}>
                  ● {alt.severity || 'Urgent'}
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
                    <CheckCircle2 size={12} color="#3d6b4f" />
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
            <FileText size={13} color="#3d6b4f" />
            <span>Review incoming requests</span>
          </button>

          <button
            className="ec-qa-btn"
            onClick={() => navigate('/logistics/inventory')}
          >
            <Package size={13} color="#3d6b4f" />
            <span>View resource availability</span>
          </button>

          <button
            className="ec-qa-btn"
            onClick={() => navigate('/shelters/directory')}
          >
            <Home size={13} color="#3d6b4f" />
            <span>Check shelters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

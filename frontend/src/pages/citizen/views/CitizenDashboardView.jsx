import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  HeartHandshake,
  CheckCircle,
  AlertTriangle,
  Home,
  Droplet,
  HeartPulse,
  Plus,
  ChevronRight,
  ShieldCheck,
  Compass,
  MessageSquare
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import {
  DASHBOARD_METRICS,
  RECENT_REQUESTS,
  ACTIVE_REQUEST_PROGRESS
} from '../data/citizenPortalData';

export const CitizenDashboardView = ({ onSelectTab, showToast }) => {
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    let isMounted = true;
    adminService.getActiveBroadcasts()
      .then(res => {
        if (!isMounted) return;
        const list = res?.succeeded && Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        if (list.length > 0) {
          setActiveAlert(list[0]);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="cp-view-container">
      {/* 1. Verified Flood Warning Red Alert Banner */}
      <div className="cp-warning-banner">
        <div className="cp-warning-left">
          <AlertTriangle size={18} className="cp-warning-icon" />
          <div>
            <span className="cp-warning-bold">
              {activeAlert ? `${activeAlert.title} · ${activeAlert.targetRegion || 'Western Province'}` : 'Verified flood warning · Kelani East'}
            </span>
            <span className="cp-warning-text">
              {activeAlert ? activeAlert.message : 'Avoid flooded roads and follow official evacuation guidance.'}
            </span>
          </div>
        </div>
        <div className="cp-warning-right">
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: (activeAlert?.severity || 'Critical').toLowerCase() === 'warning' ? '#fef3c7' : '#fee2e2',
              color: (activeAlert?.severity || 'Critical').toLowerCase() === 'warning' ? '#b45309' : '#dc2626'
            }}
          >
            ● {activeAlert?.severity || 'Critical'}
          </span>
          <button
            onClick={() => onSelectTab('alerts')}
            className="cp-btn-secondary"
            style={{ padding: '4px 10px', fontSize: '11.5px' }}
          >
            View alert
          </button>
        </div>
      </div>

      {/* 2. Welcome Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">WEDNESDAY, 18 FEBRUARY 2026</span>
          <h1 className="cp-view-title">Hello, Nimal</h1>
          <p className="cp-view-subtitle">We are here to help you and your family.</p>
        </div>
        <div>
          <button
            onClick={() => onSelectTab('submit')}
            className="cp-btn-primary"
          >
            <Plus size={16} />
            Submit Assistance Request
          </button>
        </div>
      </div>

      {/* 3. 4 Metrics Cards */}
      <div className="cp-metrics-grid">
        <div className="cp-metric-card">
          <div className="cp-metric-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <FileText size={18} />
          </div>
          <div>
            <div className="cp-metric-title">Active Requests</div>
            <div className="cp-metric-val">{DASHBOARD_METRICS.activeRequests}</div>
          </div>
        </div>

        <div className="cp-metric-card">
          <div className="cp-metric-icon-box" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Clock size={18} />
          </div>
          <div>
            <div className="cp-metric-title">Awaiting Review</div>
            <div className="cp-metric-val">{DASHBOARD_METRICS.awaitingReview}</div>
          </div>
        </div>

        <div className="cp-metric-card">
          <div className="cp-metric-icon-box" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <HeartHandshake size={18} />
          </div>
          <div>
            <div className="cp-metric-title">Assistance In Progress</div>
            <div className="cp-metric-val">{DASHBOARD_METRICS.assistanceInProgress}</div>
          </div>
        </div>

        <div className="cp-metric-card">
          <div className="cp-metric-icon-box" style={{ backgroundColor: '#ecfdf5', color: '#16a34a' }}>
            <CheckCircle size={18} />
          </div>
          <div>
            <div className="cp-metric-title">Completed Requests</div>
            <div className="cp-metric-val">{DASHBOARD_METRICS.completedRequests}</div>
          </div>
        </div>
      </div>

      {/* 4. Top Grid: Recent Requests & Request Progress */}
      <div className="cp-grid-split">
        {/* Left: My Recent Requests */}
        <div className="cp-card">
          <div className="cp-card-header-flex">
            <div>
              <h2 className="cp-card-title">My recent requests</h2>
              <p className="cp-card-subtitle">Only requests submitted from your account</p>
            </div>
            <button
              onClick={() => onSelectTab('requests')}
              style={{ background: 'none', border: 'none', color: '#1e3d2c', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              View all &gt;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {RECENT_REQUESTS.map((req) => (
              <div
                key={req.id}
                className="cp-request-row"
                onClick={() => onSelectTab('requests')}
              >
                <div className="cp-req-left">
                  <div className="cp-req-icon-box">
                    {req.iconType === 'home' && <Home size={16} />}
                    {req.iconType === 'droplet' && <Droplet size={16} />}
                    {req.iconType === 'medical' && <HeartPulse size={16} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                      {req.category}
                    </div>
                    <div style={{ fontSize: '11px', color: '#738075' }}>
                      {req.id} · {req.date}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: req.statusType === 'completed' ? '#ecfdf5' : '#fef3c7',
                      color: req.statusType === 'completed' ? '#047857' : '#92400e'
                    }}
                  >
                    ● {req.status}
                  </span>
                  <span style={{ fontSize: '11px', color: '#738075' }}>{req.updated}</span>
                  <ChevronRight size={15} color="#9fa89e" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Request Progress */}
        <div className="cp-card">
          <div className="cp-card-header-flex">
            <div>
              <h2 className="cp-card-title">Request progress</h2>
              <p className="cp-card-subtitle">{ACTIVE_REQUEST_PROGRESS.id} · {ACTIVE_REQUEST_PROGRESS.title}</p>
            </div>
          </div>

          {/* Vertical Stepper */}
          <div className="cp-stepper-list">
            {ACTIVE_REQUEST_PROGRESS.steps.map((st, idx) => (
              <div key={idx} className="cp-step-item">
                <div className={`cp-step-bullet ${st.status}`}>
                  {st.status === 'completed' ? '✓' : idx + 1}
                </div>
                <div className="cp-step-title">{st.label}</div>
                <div className="cp-step-sub">{st.time}</div>
              </div>
            ))}
          </div>

          {/* What happens next box */}
          <div className="cp-next-box">
            <Clock size={16} style={{ color: '#1e3d2c', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#162e20', marginBottom: '2px' }}>
                What happens next
              </div>
              <div style={{ fontSize: '11px', color: '#334135', lineHeight: 1.4 }}>
                {ACTIVE_REQUEST_PROGRESS.nextInfo}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('requests')}
            className="cp-btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Track request
          </button>
        </div>
      </div>

      {/* 5. Bottom Grid (Screenshot 2): Nearby Assistance & Quick Actions */}
      <div className="cp-grid-split">
        {/* Left: Nearby Assistance Map Preview */}
        <div className="cp-card" style={{ padding: '16px' }}>
          <div className="cp-card-header-flex" style={{ marginBottom: '12px' }}>
            <div>
              <h2 className="cp-card-title">Nearby assistance</h2>
              <p className="cp-card-subtitle">Prototype locations — verify before travel</p>
            </div>
            <button
              onClick={() => onSelectTab('shelters')}
              style={{ background: 'none', border: 'none', color: '#1e3d2c', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              See all
            </button>
          </div>

          {/* Map Graphic Box */}
          <div
            style={{
              position: 'relative',
              height: '190px',
              backgroundColor: '#e6ece3',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '12px'
            }}
          >
            {/* Background SVG roads & zones */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <polygon points="0,0 200,0 120,190 0,190" fill="#dce6d8" />
              <polygon points="200,0 450,0 520,190 120,190" fill="#d3e0cf" />
              <polygon points="450,0 800,0 800,190 520,190" fill="#dce6d8" />
              {/* Roads */}
              <line x1="0" y1="90" x2="800" y2="120" stroke="#ffffff" strokeWidth="4" />
              <line x1="300" y1="0" x2="250" y2="190" stroke="#ffffff" strokeWidth="3" />
              <line x1="150" y1="190" x2="600" y2="20" stroke="#ffffff" strokeWidth="2.5" />
              {/* Radius circles */}
              <circle cx="170" cy="115" r="55" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="1" />
              <circle cx="410" cy="120" r="50" fill="rgba(30, 61, 44, 0.12)" stroke="#1e3d2c" strokeWidth="1" />
            </svg>

            {/* Pins on top */}
            {/* Red Pin */}
            <div
              style={{
                position: 'absolute',
                left: '140px',
                top: '100px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              <AlertTriangle size={11} />
              11 spaces
            </div>

            {/* Blue Depot Pin */}
            <div
              style={{
                position: 'absolute',
                right: '180px',
                top: '40px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              RES-021 · 240
            </div>

            {/* Dark Green Shelter Pin */}
            <div
              style={{
                position: 'absolute',
                right: '120px',
                bottom: '40px',
                backgroundColor: '#14291e',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              <Home size={11} />
              SH-008 · 36 spaces
            </div>

            {/* Visible Layers Card (Floating Left) */}
            <div
              style={{
                position: 'absolute',
                left: '12px',
                bottom: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #d4ded3',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '9.5px',
                fontWeight: 600,
                color: '#405044',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ fontWeight: 700, color: '#162e20', marginBottom: '3px' }}>Visible layers</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#dc2626' }} />
                <span>Critical requests</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                <span>Verified shelters</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                <span>Resource depots</span>
              </div>
            </div>

            {/* Zoom Controls (Right) */}
            <div
              style={{
                position: 'absolute',
                right: '12px',
                top: '12px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                border: '1px solid #d4ded3',
                borderRadius: '6px',
                overflow: 'hidden'
              }}
            >
              <button style={{ border: 'none', background: 'transparent', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>+</button>
              <div style={{ height: '1px', backgroundColor: '#e2e8dd' }} />
              <button style={{ border: 'none', background: 'transparent', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>-</button>
            </div>
          </div>

          {/* Bottom Card for Shelter Summary */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              backgroundColor: '#f8faf7',
              borderRadius: '8px',
              border: '1px solid #edf1eb'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#edf4ec',
                  color: '#1e3d2c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Home size={15} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>
                  Kelani Community Help Centre
                </div>
                <div style={{ fontSize: '10.5px', color: '#738075' }}>
                  1.8 km · Accessible entrance · Medical support
                </div>
              </div>
            </div>

            <span
              style={{
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '10.5px',
                fontWeight: 600,
                backgroundColor: '#ecfdf5',
                color: '#047857'
              }}
            >
              ● Verified
            </span>
          </div>
        </div>

        {/* Right: Quick Actions (2x2 Grid) */}
        <div className="cp-card">
          <div className="cp-card-header-flex">
            <h2 className="cp-card-title">Quick actions</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              className="cp-cat-card"
              onClick={() => onSelectTab('submit')}
              style={{ minHeight: '65px', padding: '12px', alignItems: 'flex-start', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} color="#1e3d2c" />
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#162e20' }}>
                    Submit a new request
                  </span>
                </div>
                <ChevronRight size={15} color="#9fa89e" />
              </div>
            </div>

            <div
              className="cp-cat-card"
              onClick={() => onSelectTab('requests')}
              style={{ minHeight: '65px', padding: '12px', alignItems: 'flex-start', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="#1e3d2c" />
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#162e20' }}>
                    Track an existing request
                  </span>
                </div>
                <ChevronRight size={15} color="#9fa89e" />
              </div>
            </div>

            <div
              className="cp-cat-card"
              onClick={() => onSelectTab('shelters')}
              style={{ minHeight: '65px', padding: '12px', alignItems: 'flex-start', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Home size={16} color="#1e3d2c" />
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#162e20' }}>
                    Find nearby shelters
                  </span>
                </div>
                <ChevronRight size={15} color="#9fa89e" />
              </div>
            </div>

            <div
              className="cp-cat-card"
              onClick={() => onSelectTab('support')}
              style={{ minHeight: '65px', padding: '12px', alignItems: 'flex-start', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={16} color="#1e3d2c" />
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#162e20' }}>
                    Contact support
                  </span>
                </div>
                <ChevronRight size={15} color="#9fa89e" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboardView;

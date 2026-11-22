import React, { useState, useEffect, useCallback } from 'react';
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
  MessageSquare,
  Building2,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { requestService } from '../../../services/requestService';
import { shelterService } from '../../../services/shelterService';
import { useAuth } from '../../../context/AuthContext';
import { useRealtimeRefresh } from '../../../hooks/useRealtimeRefresh';

export const CitizenDashboardView = ({ onSelectTab, showToast }) => {
  const { user } = useAuth();
  const [activeAlert, setActiveAlert] = useState(null);
  const [requests, setRequests] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshDashboard = useCallback(async () => {
    try {
      // 1. Fetch active alerts
      try {
        const alertRes = await adminService.getActiveBroadcasts();
        const list = alertRes?.succeeded && Array.isArray(alertRes.data)
          ? alertRes.data
          : Array.isArray(alertRes)
          ? alertRes
          : [];
        if (list.length > 0) {
          setActiveAlert(list[0]);
        }
      } catch (e) {
        // non-fatal
      }

      // 2. Fetch citizen's requests
      try {
        const reqRes = await requestService.getAll();
        const reqList = reqRes?.data || (Array.isArray(reqRes) ? reqRes : []);
        if (Array.isArray(reqList)) {
          setRequests(reqList);
        }
      } catch (e) {
        // non-fatal
      }

      // 3. Fetch shelters
      try {
        const shRes = await shelterService.getAll();
        const shList = shRes?.data || (Array.isArray(shRes) ? shRes : []);
        if (Array.isArray(shList)) {
          setShelters(shList.slice(0, 3));
        }
      } catch (e) {
        // non-fatal
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  // Real-time synchronization
  useRealtimeRefresh(['assistancerequests', 'broadcasts', 'shelters'], refreshDashboard);

  // Compute metrics from actual citizen requests
  const activeRequests = requests.filter(
    (r) => r.status !== 3 && r.status !== 'Resolved' && r.status !== 'Closed'
  );
  const awaitingReview = requests.filter(
    (r) => r.status === 0 || r.status === 'Submitted'
  );
  const inProgress = requests.filter(
    (r) =>
      r.status === 1 ||
      r.status === 'Verified' ||
      r.status === 2 ||
      r.status === 'InProgress'
  );
  const completedRequests = requests.filter(
    (r) => r.status === 3 || r.status === 'Resolved' || r.status === 'Closed'
  );

  // Latest active request for the progression tracker
  const latestActive = activeRequests[0] || requests[0] || null;

  const getStatusStep = (req) => {
    if (!req) return 1;
    const s = req.status;
    if (s === 3 || s === 'Resolved' || s === 'Closed') return 4;
    if (s === 2 || s === 'InProgress') return 3;
    if (s === 1 || s === 'Verified') return 2;
    return 1;
  };

  const currentStepNum = getStatusStep(latestActive);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  const citizenName = user?.fullName || 'Citizen';

  return (
    <div className="cp-view-container">
      {/* 1. Verified Crisis Alert Banner */}
      {activeAlert && (
        <div className="cp-warning-banner">
          <div className="cp-warning-left">
            <AlertTriangle size={18} className="cp-warning-icon" />
            <div>
              <span className="cp-warning-bold">
                {activeAlert.title} · {activeAlert.targetRegion || 'Western Province'}
              </span>
              <span className="cp-warning-text">{activeAlert.message}</span>
            </div>
          </div>
          <div className="cp-warning-right">
            <span
              style={{
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor:
                  (activeAlert?.severity || 'Critical').toLowerCase() === 'warning'
                    ? '#fef3c7'
                    : '#fee2e2',
                color:
                  (activeAlert?.severity || 'Critical').toLowerCase() === 'warning'
                    ? '#b45309'
                    : '#dc2626'
              }}
            >
              ● {activeAlert.severity || 'Critical'}
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
      )}

      {/* 2. Welcome Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">{todayFormatted}</span>
          <h1 className="cp-view-title">Hello, {citizenName}</h1>
          <p className="cp-view-subtitle">We are here to help you and your family.</p>
        </div>
        <div>
          <button onClick={() => onSelectTab('submit')} className="cp-btn-primary">
            <Plus size={16} />
            Submit Assistance Request
          </button>
        </div>
      </div>

      {/* 3. 4 Metrics Cards (Calculated from real database requests) */}
      <div className="cp-metrics-grid">
        <div className="cp-metric-card">
          <div className="cp-metric-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <FileText size={18} />
          </div>
          <div>
            <div className="cp-metric-title">Active Requests</div>
            <div className="cp-metric-val">{activeRequests.length}</div>
          </div>
        </div>

        <div className="cp-metric-card">
          <div className="cp-metric-icon-box" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Clock size={18} />
          </div>
          <div>
            <div className="cp-metric-title">Awaiting Review</div>
            <div className="cp-metric-val">{awaitingReview.length}</div>
          </div>
        </div>

        <div className="cp-metric-card">
          <div className="cp-metric-icon-box" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <HeartHandshake size={18} />
          </div>
          <div>
            <div className="cp-metric-title">Assistance in Progress</div>
            <div className="cp-metric-val">{inProgress.length}</div>
          </div>
        </div>

        <div className="cp-metric-card">
          <div className="cp-metric-icon-box" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
            <CheckCircle size={18} />
          </div>
          <div>
            <div className="cp-metric-title">Completed Requests</div>
            <div className="cp-metric-val">{completedRequests.length}</div>
          </div>
        </div>
      </div>

      {/* 4. Active Request Progress Box */}
      <div className="cp-card cp-active-progress-card">
        <div className="cp-progress-header">
          <div>
            <span className="cp-progress-pretitle">YOUR ACTIVE REQUEST</span>
            <h2 className="cp-progress-title">
              {latestActive
                ? `${latestActive.category || 'Emergency Assistance'} · REQ-${latestActive.id.toString().substring(0, 8).toUpperCase()}`
                : 'No Active Requests at this time'}
            </h2>
          </div>
          <div>
            {latestActive ? (
              <button
                onClick={() => onSelectTab('requests')}
                className="cp-btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                View full request details
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('submit')}
                className="cp-btn-primary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                <Plus size={14} /> Submit New Request
              </button>
            )}
          </div>
        </div>

        {/* 4 Stepper Steps */}
        <div className="cp-stepper">
          <div className={`cp-step ${currentStepNum >= 1 ? 'completed' : ''}`}>
            <div className="cp-step-circle">
              {currentStepNum > 1 ? '✓' : '1'}
            </div>
            <div className="cp-step-label">Request submitted</div>
            <div className="cp-step-time">
              {latestActive?.createdAt ? new Date(latestActive.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Verified'}
            </div>
          </div>

          <div className={`cp-step-line ${currentStepNum >= 2 ? 'active' : ''}`} />

          <div className={`cp-step ${currentStepNum === 1 ? 'current' : currentStepNum >= 2 ? 'completed' : ''}`}>
            <div className="cp-step-circle">
              {currentStepNum > 2 ? '✓' : '2'}
            </div>
            <div className="cp-step-label">Under review</div>
            <div className="cp-step-time">{currentStepNum === 1 ? 'Current' : currentStepNum > 1 ? 'Completed' : 'Pending'}</div>
          </div>

          <div className={`cp-step-line ${currentStepNum >= 3 ? 'active' : ''}`} />

          <div className={`cp-step ${currentStepNum === 2 ? 'current' : currentStepNum >= 3 ? 'completed' : ''}`}>
            <div className="cp-step-circle">
              {currentStepNum > 3 ? '✓' : '3'}
            </div>
            <div className="cp-step-label">Verified & Approved</div>
            <div className="cp-step-time">{currentStepNum === 2 ? 'Current' : currentStepNum > 2 ? 'Completed' : 'Upcoming'}</div>
          </div>

          <div className={`cp-step-line ${currentStepNum >= 4 ? 'active' : ''}`} />

          <div className={`cp-step ${currentStepNum === 3 ? 'current' : currentStepNum >= 4 ? 'completed' : ''}`}>
            <div className="cp-step-circle">4</div>
            <div className="cp-step-label">Assistance fulfilled</div>
            <div className="cp-step-time">{currentStepNum >= 4 ? 'Fulfilled' : 'Upcoming'}</div>
          </div>
        </div>

        {/* Help notification beneath tracker */}
        <div className="cp-progress-alert">
          <Clock size={16} color="#1e3d2c" style={{ flexShrink: 0 }} />
          <span>
            {latestActive
              ? `Authorized coordinators are coordinating response for this request. Location: ${latestActive.address || 'Western Province'} · Affecting ${latestActive.numberOfPeople || 1} individuals.`
              : 'You do not have any pending relief requests. If you require emergency food, clean water, medical aid or shelter, click Submit Assistance Request.'}
          </span>
        </div>
      </div>

      {/* 5. 2-Column Split: Recent Requests (Left) & Verified Shelters / Quick Links (Right) */}
      <div className="cp-grid-split">
        {/* Left Column: Recent Requests */}
        <div className="cp-card">
          <div className="cp-card-header">
            <div>
              <span className="cp-card-pretitle">SUBMISSION HISTORY</span>
              <h3 className="cp-card-title">My recent requests</h3>
            </div>
            <button
              onClick={() => onSelectTab('requests')}
              className="cp-link-btn"
              style={{ fontSize: '12px' }}
            >
              View all ({requests.length}) &gt;
            </button>
          </div>

          {requests.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: '#738075' }}>
              <FileText size={28} style={{ margin: '0 auto 8px auto', color: '#9fa89e' }} />
              <div style={{ fontSize: '13px', fontWeight: 600 }}>No requests submitted yet</div>
              <div style={{ fontSize: '11px', marginTop: '2px' }}>
                Your submitted assistance requests will appear here.
              </div>
            </div>
          )}

          <div className="cp-requests-list">
            {requests.slice(0, 3).map((r) => {
              const isResolved = r.status === 3 || r.status === 'Resolved' || r.status === 'Closed';
              const isVerified = r.status === 1 || r.status === 'Verified';
              const isInProg = r.status === 2 || r.status === 'InProgress';

              const statusText = isResolved
                ? 'Completed'
                : isInProg
                ? 'In Progress'
                : isVerified
                ? 'Verified'
                : 'Under Review';

              const catLower = (r.category || '').toLowerCase();
              const icon = catLower.includes('water') ? (
                <Droplet size={18} />
              ) : catLower.includes('med') ? (
                <HeartPulse size={18} />
              ) : (
                <Home size={18} />
              );

              return (
                <div
                  key={r.id}
                  className="cp-request-row"
                  onClick={() => onSelectTab('requests')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="cp-request-left">
                    <div className="cp-request-icon-box">{icon}</div>
                    <div>
                      <div className="cp-request-title">
                        {r.category || 'Assistance Request'} · REQ-{r.id.toString().substring(0, 8).toUpperCase()}
                      </div>
                      <div className="cp-request-meta">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'} · {r.numberOfPeople || 1} people · {r.address || 'Western Province'}
                      </div>
                    </div>
                  </div>

                  <div className="cp-request-right">
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: isResolved ? '#ecfdf5' : isVerified ? '#eff6ff' : '#fef3c7',
                        color: isResolved ? '#047857' : isVerified ? '#1d4ed8' : '#92400e'
                      }}
                    >
                      ● {statusText}
                    </span>
                    <span className="cp-request-updated">
                      {isResolved ? 'Resolved' : 'Active'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Verified Shelters & Helpline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Shelters Mini Card */}
          <div className="cp-card">
            <div className="cp-card-header">
              <div>
                <span className="cp-card-pretitle">NEARBY SAFE LOCATIONS</span>
                <h3 className="cp-card-title">Verified relief shelters</h3>
              </div>
              <button
                onClick={() => onSelectTab('shelters')}
                className="cp-link-btn"
                style={{ fontSize: '12px' }}
              >
                Find shelters &gt;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {shelters.map((sh, idx) => (
                <div
                  key={sh.id || idx}
                  onClick={() => onSelectTab('shelters')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#f8faf7',
                    border: '1px solid #edf1eb',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        backgroundColor: '#edf4ec',
                        color: '#1e3d2c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Building2 size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#162e20' }}>
                        {sh.name || sh.facilityName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#738075' }}>
                        {sh.district || 'Western Province'} · {sh.availableCapacity ?? 50} beds remaining
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} color="#9fa89e" />
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Helpline Box */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#edf4ec',
              border: '1px solid #d4ded3',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#162e20' }}>
                Emergency Crisis Dispatch Hotline
              </div>
              <div style={{ fontSize: '11px', color: '#657367', marginTop: '2px' }}>
                Toll-free 24/7 National Emergency Call Centre
              </div>
            </div>
            <a
              href="tel:119"
              className="cp-btn-primary"
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                textDecoration: 'none'
              }}
            >
              Call 119
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboardView;

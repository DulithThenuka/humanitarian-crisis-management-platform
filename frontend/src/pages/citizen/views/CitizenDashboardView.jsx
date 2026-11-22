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
  RefreshCw,
  Info
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { requestService } from '../../../services/requestService';
import { shelterService } from '../../../services/shelterService';
import { useAuth } from '../../../context/AuthContext';
import { useRealtimeRefresh } from '../../../hooks/useRealtimeRefresh';
import {
  safeString,
  safeLower,
  safeUpper,
  normalizeUrgency,
  getUrgencyCssClass,
  normalizeRequestStatus,
  getRequestStatusDetails,
  formatRequestId
} from '../utils/citizenDataUtils';

export const CitizenDashboardView = ({ onSelectTab, showToast }) => {
  const { user } = useAuth();
  const [activeAlert, setActiveAlert] = useState(null);
  const [requests, setRequests] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
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
        console.error('Failed to load citizen assistance requests:', e);
        setLoadError('Unable to synchronize recent assistance requests from dispatch.');
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

  // Compute metrics with safe enum/status normalization
  const activeRequests = requests.filter((r) => {
    const s = normalizeRequestStatus(r?.status);
    return s !== 'Resolved' && s !== 'Closed';
  });
  const awaitingReview = requests.filter((r) => {
    const s = normalizeRequestStatus(r?.status);
    return s === 'Submitted';
  });
  const inProgress = requests.filter((r) => {
    const s = normalizeRequestStatus(r?.status);
    return s === 'Verified' || s === 'InProgress';
  });
  const completedRequests = requests.filter((r) => {
    const s = normalizeRequestStatus(r?.status);
    return s === 'Resolved' || s === 'Closed';
  });

  // Latest active request for the progression tracker
  const latestActive = activeRequests[0] || requests[0] || null;
  const latestActiveStatusDetails = latestActive ? getRequestStatusDetails(latestActive.status) : null;
  const currentStepNum = latestActiveStatusDetails ? latestActiveStatusDetails.step : 1;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  const citizenName = safeString(user?.fullName, 'Citizen');

  return (
    <div className="cp-view-container">
      {/* 1. Verified Crisis Alert Banner */}
      {activeAlert && (
        <div className="cp-warning-banner">
          <div className="cp-warning-left">
            <AlertTriangle size={18} className="cp-warning-icon" />
            <div>
              <span className="cp-warning-bold">
                {safeString(activeAlert.title, 'Emergency Advisory')} · {safeString(activeAlert.targetRegion, 'Western Province')}
              </span>
              <span className="cp-warning-text">{safeString(activeAlert.message)}</span>
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
                  safeLower(activeAlert?.severity, 'critical') === 'warning'
                    ? '#fef3c7'
                    : '#fee2e2',
                color:
                  safeLower(activeAlert?.severity, 'critical') === 'warning'
                    ? '#b45309'
                    : '#dc2626'
              }}
            >
              ● {safeString(activeAlert.severity, 'Critical')}
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

      {/* Network Alert (If request service failed) */}
      {loadError && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            fontSize: '12.5px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} />
            <span>{loadError}</span>
          </div>
          <button
            onClick={refreshDashboard}
            className="cp-btn-secondary"
            style={{ padding: '4px 10px', fontSize: '11px' }}
          >
            Retry Sync
          </button>
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
          <div className="cp-progress-header-info">
            <div className="cp-progress-meta-tag">
              <span className="cp-progress-pretitle">YOUR ACTIVE REQUEST</span>
              {latestActive && latestActiveStatusDetails && (
                <span
                  className={`cp-status-pill ${latestActiveStatusDetails.statusPillClass}`}
                >
                  ● {latestActiveStatusDetails.label}
                </span>
              )}
            </div>
            <h2 className="cp-progress-title">
              {latestActive
                ? `${safeString(latestActive.category, 'Emergency Assistance')} · ${formatRequestId(latestActive.id)}`
                : 'No Active Requests at this time'}
            </h2>
          </div>
          <div>
            {latestActive ? (
              <button
                onClick={() => onSelectTab('requests')}
                className="cp-btn-secondary"
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                View full request details
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('submit')}
                className="cp-btn-primary"
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                <Plus size={14} /> Submit New Request
              </button>
            )}
          </div>
        </div>

        {/* Request Hierarchy & Metadata Strip */}
        {latestActive && (
          <div className="cp-progress-detail-strip">
            <div className="cp-detail-chip">
              <span className="cp-detail-label">SUBMITTED</span>
              <span className="cp-detail-val">
                {latestActive.createdAt
                  ? new Date(latestActive.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Recently'}
              </span>
            </div>
            <div className="cp-detail-chip">
              <span className="cp-detail-label">URGENCY</span>
              <span
                className={`cp-urgency-val ${getUrgencyCssClass(latestActive.urgency ?? latestActive.priority)}`}
              >
                {normalizeUrgency(latestActive.urgency ?? latestActive.priority, 'Normal')}
              </span>
            </div>
            <div className="cp-detail-chip">
              <span className="cp-detail-label">AFFECTED</span>
              <span className="cp-detail-val">
                {latestActive.numberOfPeople || 1} individuals
              </span>
            </div>
            <div className="cp-detail-chip">
              <span className="cp-detail-label">LOCATION</span>
              <span className="cp-detail-val">
                {safeString(latestActive.address, 'Western Province')}
              </span>
            </div>
          </div>
        )}

        {/* 4 Stepper Steps */}
        <div className="cp-stepper">
          <div className={`cp-step ${currentStepNum >= 1 ? 'completed' : ''}`}>
            <div className="cp-step-circle">
              {currentStepNum > 1 ? <CheckCircle size={18} /> : '1'}
            </div>
            <div className="cp-step-content">
              <div className="cp-step-label">Request submitted</div>
              <div className="cp-step-time">
                {latestActive?.createdAt
                  ? new Date(latestActive.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Logged'}
              </div>
            </div>
          </div>

          <div className={`cp-step-line ${currentStepNum >= 2 ? 'active' : ''}`} />

          <div className={`cp-step ${currentStepNum === 1 ? 'current' : currentStepNum >= 2 ? 'completed' : ''}`}>
            <div className="cp-step-circle">
              {currentStepNum > 2 ? <CheckCircle size={18} /> : '2'}
            </div>
            <div className="cp-step-content">
              <div className="cp-step-label">Under review</div>
              <div className="cp-step-time">
                {currentStepNum === 1 ? 'In Progress' : currentStepNum > 1 ? 'Completed' : 'Pending'}
              </div>
            </div>
          </div>

          <div className={`cp-step-line ${currentStepNum >= 3 ? 'active' : ''}`} />

          <div className={`cp-step ${currentStepNum === 2 ? 'current' : currentStepNum >= 3 ? 'completed' : ''}`}>
            <div className="cp-step-circle">
              {currentStepNum > 3 ? <CheckCircle size={18} /> : '3'}
            </div>
            <div className="cp-step-content">
              <div className="cp-step-label">Verified & Approved</div>
              <div className="cp-step-time">
                {currentStepNum === 2 ? 'In Progress' : currentStepNum > 2 ? 'Completed' : 'Upcoming'}
              </div>
            </div>
          </div>

          <div className={`cp-step-line ${currentStepNum >= 4 ? 'active' : ''}`} />

          <div className={`cp-step ${currentStepNum === 3 ? 'current' : currentStepNum >= 4 ? 'completed' : ''}`}>
            <div className="cp-step-circle">
              {currentStepNum >= 4 ? <CheckCircle size={18} /> : '4'}
            </div>
            <div className="cp-step-content">
              <div className="cp-step-label">Assistance fulfilled</div>
              <div className="cp-step-time">
                {currentStepNum >= 4 ? 'Fulfilled' : 'Upcoming'}
              </div>
            </div>
          </div>
        </div>

        {/* Help notification beneath tracker */}
        <div className="cp-progress-alert">
          <Clock size={16} color="#1e3d2c" style={{ flexShrink: 0 }} />
          <span>
            {latestActive
              ? `Authorized crisis coordinators are actively coordinating response for this request. Location: ${safeString(latestActive.address, 'Western Province')} · Affecting ${latestActive.numberOfPeople || 1} individuals.`
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
              const statusDetails = getRequestStatusDetails(r?.status);
              const catLower = safeLower(r?.category);
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
                    <div className="cp-request-info">
                      <div className="cp-request-title">
                        {safeString(r.category, 'Assistance Request')} · {formatRequestId(r.id)}
                      </div>
                      <div className="cp-request-meta">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'} · {r.numberOfPeople || 1} people · {safeString(r.address, 'Western Province')}
                      </div>
                    </div>
                  </div>

                  <div className="cp-request-right">
                    <span
                      className="cp-request-status-badge"
                      style={{
                        backgroundColor: statusDetails.badgeBg,
                        color: statusDetails.badgeColor
                      }}
                    >
                      ● {statusDetails.label}
                    </span>
                    <span className="cp-request-updated">
                      {statusDetails.isCompleted ? 'Resolved' : 'Active'}
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
                  className="cp-shelter-mini-card"
                  onClick={() => onSelectTab('shelters')}
                >
                  <div className="cp-shelter-mini-left">
                    <div className="cp-shelter-mini-icon">
                      <Building2 size={16} />
                    </div>
                    <div className="cp-shelter-mini-info">
                      <div className="cp-shelter-mini-title">
                        {safeString(sh.name || sh.facilityName, 'Relief Shelter')}
                      </div>
                      <div className="cp-shelter-mini-meta">
                        {safeString(sh.district, 'Western Province')} · {sh.availableCapacity ?? 50} beds remaining
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

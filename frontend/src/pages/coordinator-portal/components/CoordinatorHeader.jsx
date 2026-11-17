import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Bell, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { COORDINATOR_USER } from '../data/coordinatorPortalData';
import './CoordinatorHeader.css';

export const CoordinatorHeader = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  showToast,
  isLive = false,
  apiError = null,
  onRetry = null,
  coordinator
}) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const activeUser = coordinator || authUser;
  const fullName = activeUser?.fullName || activeUser?.name || COORDINATOR_USER.fullName;
  const initials = activeUser?.initials || (fullName ? fullName.split(' ').filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase() : COORDINATOR_USER.initials);
  const role = activeUser?.role === 'Coordinator' ? 'Emergency Coordinator' : (activeUser?.role || COORDINATOR_USER.role);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'review':
        return 'Request Review & Verification';
      case 'requests':
        return 'Assistance Request Management';
      case 'ai-support':
        return 'AI Decision Support & Priority Assessment';
      case 'crisis':
        return 'Crisis & Incident Management';
      case 'resources':
        return 'Resource Allocation & Equipment Tracking';
      case 'shelters':
        return 'Shelter Capacity & Volunteer Mobilization';
      case 'alerts':
        return 'Emergency Broadcast Alerts';
      case 'reports':
        return 'Response Analytics & Situation Reports';
      case 'history':
        return 'Coordinator Decision Audit History';
      case 'notifications':
        return 'Notifications & Action Reminders';
      case 'settings':
        return 'Coordinator Profile & Operational Settings';
      default:
        return 'Emergency Coordinator Overview';
    }
  };

  return (
    <div className="ec-fixed-navbar-wrapper">
      <header className="ec-top-header">
        <div className="ec-header-titles-col">
          <div className="ec-breadcrumb-row">
            <span className="ec-breadcrumb-tiny">EMERGENCY COORDINATOR PORTAL</span>
            {isLive ? (
              <span className="ec-live-badge" title="Live connection to SQL Server HumanitarianCrisisDb">
                <span className="ec-live-dot"></span>LIVE DB CONNECTED
              </span>
            ) : apiError ? (
              <span className="ec-offline-badge" title={apiError}>DISCONNECTED</span>
            ) : null}
          </div>
          <h1 className="ec-header-page-title">{getPageTitle()}</h1>
        </div>

        <div className="ec-header-center-search">
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search requests, incidents, resources..."
            className="ec-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="ec-cmd-k-badge">⌘K</span>
        </div>

        <div className="ec-header-right-tools">
          <button
            type="button"
            className="ec-operation-selector-btn"
            onClick={() => navigate('/')}
            title="Return to Platform Home"
            style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.06)' }}
          >
            <span className="ec-op-label-tiny">Hub</span>
            <div className="ec-op-current-name">
              <span>Home →</span>
            </div>
          </button>

          <div className="ec-operation-selector-btn">
            <span className="ec-op-label-tiny">Active operation</span>
            <div className="ec-op-current-name">
              <span>Western Province Flood</span>
              <ChevronDown size={12} />
            </div>
          </div>

          <button
            className="ec-header-bell-btn"
            onClick={() => navigate('/notifications')}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="ec-bell-badge">7</span>
          </button>

          <div
            className="ec-header-user-profile"
            onClick={() => showToast(`Coordinator: ${fullName}`)}
          >
            <div className="ec-profile-avatar-circle">
              {initials}
            </div>
            <div className="ec-profile-text-col">
              <span className="ec-profile-name">{fullName}</span>
              <span className="ec-profile-role">{role} &gt;</span>
            </div>
          </div>
        </div>
      </header>

      {/* 1. Connection Error Banner: Displayed when API fails */}
      {apiError && !isLive && (
        <div className="ec-connection-error-ribbon" role="alert">
          <div className="ec-ribbon-msg">
            <AlertTriangle size={14} color="#dc2626" />
            <span>
              <strong>Backend Disconnected:</strong> Unable to connect to RELIEFCORE API ({apiError}). Showing disconnected state.
            </span>
          </div>
          {onRetry && (
            <button className="ec-ribbon-retry-btn" onClick={onRetry} title="Retry API connection">
              <RefreshCw size={12} /> Retry Connection
            </button>
          )}
        </div>
      )}

      {/* 2. Fallback Prototype Notice: Rendered ONLY when offline without explicit error */}
      {!isLive && !apiError && (
        <div className="ec-prototype-ribbon">
          <CheckCircle2 size={14} color="#0284c7" />
          <span>
            <strong>Coordinator prototype:</strong> All records are illustrative data. Actions are simulated locally and follow RELIEFCORE operational standards.
          </span>
        </div>
      )}
    </div>
  );
};

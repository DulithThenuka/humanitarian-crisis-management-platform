import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Bell, CheckCircle2 } from 'lucide-react';
import { COORDINATOR_USER } from '../data/coordinatorPortalData';
import './CoordinatorHeader.css';

export const CoordinatorHeader = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  showToast
}) => {
  const navigate = useNavigate();

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
          <span className="ec-breadcrumb-tiny">EMERGENCY COORDINATOR PORTAL</span>
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
            onClick={() => showToast(`Coordinator: ${COORDINATOR_USER.fullName}`)}
          >
            <div className="ec-profile-avatar-circle">
              {COORDINATOR_USER.initials}
            </div>
            <div className="ec-profile-text-col">
              <span className="ec-profile-name">{COORDINATOR_USER.fullName}</span>
              <span className="ec-profile-role">Emergency Coordinator &gt;</span>
            </div>
          </div>
        </div>
      </header>

      {/* Prototype Notice Warning Ribbon */}
      <div className="ec-prototype-ribbon">
        <CheckCircle2 size={14} color="#0284c7" />
        <span>
          <strong>Coordinator prototype:</strong> All records are illustrative data. Actions are simulated locally and follow RELIEFCORE operational standards.
        </span>
      </div>
    </div>
  );
};

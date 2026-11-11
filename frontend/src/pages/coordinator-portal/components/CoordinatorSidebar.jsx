import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  Home,
  FileText,
  CheckCircle2,
  Sparkles,
  Brain,
  AlertTriangle,
  Package,
  Users,
  Megaphone,
  BarChart2,
  GitBranch,
  Bell,
  Settings
} from 'lucide-react';
import { COORDINATOR_USER } from '../data/coordinatorPortalData';
import './CoordinatorSidebar.css';

export const CoordinatorSidebar = ({
  activeTab,
  setActiveTab,
  dutyActive,
  setDutyActive,
  onShowAlertModal,
  showToast
}) => {
  const navigate = useNavigate();

  return (
    <aside className="ec-sidebar">
      <div>
        {/* Brand Header */}
        <div className="ec-sidebar-brand">
          <div className="ec-brand-shield-icon">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="ec-brand-title">HumanAid</h2>
            <p className="ec-brand-subtitle">Response coordination</p>
          </div>
        </div>

        {/* User Status Card */}
        <div className="ec-user-status-card">
          <div className="ec-user-meta-left">
            <div className="ec-avatar-circle">
              {COORDINATOR_USER.initials}
            </div>
            <div>
              <span className="ec-user-tag-tiny">SIGNED IN AS</span>
              <div className="ec-user-name-bold">{COORDINATOR_USER.role}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{COORDINATOR_USER.fullName}</div>
            </div>
          </div>
          <div
            className={`ec-duty-toggle ${dutyActive ? '' : 'inactive'}`}
            onClick={() => {
              setDutyActive(!dutyActive);
              showToast(dutyActive ? 'Coordinator duty set to Standby' : 'Coordinator duty set to Active Duty');
            }}
            title="Toggle duty status"
          >
            <div className="ec-duty-toggle-knob" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="ec-sidebar-nav">
          <button
            className={`ec-nav-link-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <div className="ec-nav-item-left">
              <Home size={15} />
              <span>Overview</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <div className="ec-nav-item-left">
              <FileText size={15} />
              <span>Assistance Requests</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            <div className="ec-nav-item-left">
              <CheckCircle2 size={15} />
              <span>Request Review</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'ai-support' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-support')}
          >
            <div className="ec-nav-item-left">
              <Sparkles size={15} />
              <span>AI Decision Support</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'ai-ops' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('ai-ops');
              navigate('/ai-operations');
            }}
          >
            <div className="ec-nav-item-left">
              <Brain size={15} />
              <span>AI Operations</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'crisis' ? 'active' : ''}`}
            onClick={() => setActiveTab('crisis')}
          >
            <div className="ec-nav-item-left">
              <AlertTriangle size={15} />
              <span>Crisis Management</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <div className="ec-nav-item-left">
              <Package size={15} />
              <span>Resource Coordination</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'shelters' ? 'active' : ''}`}
            onClick={() => setActiveTab('shelters')}
          >
            <div className="ec-nav-item-left">
              <Users size={15} />
              <span>Shelters &amp; Volunteers</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <div className="ec-nav-item-left">
              <Megaphone size={15} />
              <span>Emergency Alerts</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <div className="ec-nav-item-left">
              <BarChart2 size={15} />
              <span>Reports &amp; Analytics</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <div className="ec-nav-item-left">
              <GitBranch size={15} />
              <span>Decision History</span>
            </div>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <div className="ec-nav-item-left">
              <Bell size={15} />
              <span>Notifications</span>
            </div>
            <span className="ec-badge-count-pill">7</span>
          </button>

          <button
            className={`ec-nav-link-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <div className="ec-nav-item-left">
              <Settings size={15} />
              <span>Profile &amp; Settings</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="ec-sidebar-bottom-block">
        <div className="ec-access-notice-box">
          <div className="ec-access-title">
            <ShieldCheck size={14} color="#38bdf8" />
            <span>Coordinator access</span>
          </div>
          <div>Operational actions only. System administration is restricted.</div>
        </div>

        <div
          className="ec-exit-portal-link"
          onClick={() => navigate('/')}
        >
          <span>&gt; Exit coordinator portal</span>
        </div>
      </div>
    </aside>
  );
};

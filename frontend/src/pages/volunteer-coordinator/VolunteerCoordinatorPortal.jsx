import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Users,
  CalendarCheck,
  Sparkles,
  Activity,
  BarChart3,
  Search,
  Bell,
  LogOut,
  MapPin,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

import './VolunteerCoordinatorPortal.css';

import {
  COORDINATOR_USER,
  INITIAL_METRICS,
  PRIORITY_ATTENTION_ITEMS,
  CONNECTED_ASSISTANCE_WORKFLOW,
  RECENT_COORDINATOR_ACTIVITY,
  INITIAL_VOLUNTEERS
} from './data/coordinatorData';

import { CoordinatorDashboardView } from './views/CoordinatorDashboardView';
import { VolunteerDirectoryView } from './views/VolunteerDirectoryView';
import { SchedulingAssignmentView } from './views/SchedulingAssignmentView';
import { AIVolunteerMatchingView } from './views/AIVolunteerMatchingView';
import { ActivitySafetyView } from './views/ActivitySafetyView';
import { VolunteerReportsView } from './views/VolunteerReportsView';

import { CreateVolunteerModal } from './components/CreateVolunteerModal';
import { ExportReportModal } from './components/ExportReportModal';
import { CompareRecordModal } from './components/CompareRecordModal';

export const VolunteerCoordinatorPortal = () => {
  const navigate = useNavigate();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Duty status toggle
  const [isOnDuty, setIsOnDuty] = useState(COORDINATOR_USER.dutyStatus);

  // Search input in top header
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Shared dynamic state
  const [volunteers, setVolunteers] = useState(INITIAL_VOLUNTEERS);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [notificationCount, setNotificationCount] = useState(COORDINATOR_USER.notificationCount);

  // Handlers for record updates
  const handleCreateVolunteer = (newRecord) => {
    setVolunteers([newRecord, ...volunteers]);
    setMetrics((prev) => ({
      ...prev,
      registeredVolunteers: prev.registeredVolunteers + 1,
      availableNow: prev.availableNow + 1
    }));
  };

  const handleAssignShift = (volunteerId, shiftTime, shiftTask, note) => {
    setVolunteers((prev) =>
      prev.map((v) => {
        if (v.id === volunteerId) {
          return {
            ...v,
            currentShift: shiftTask,
            availability: shiftTime,
            status: 'Assigned',
            statusType: 'assigned',
            notes: note ? `${v.notes} | Shift: ${shiftTime} ${shiftTask} (${note})` : v.notes
          };
        }
        return v;
      })
    );
    setMetrics((prev) => ({
      ...prev,
      activeAssignments: prev.activeAssignments + 1,
      availableNow: Math.max(0, prev.availableNow - 1)
    }));
  };

  const handleConfirmAssignment = (volunteerId, note) => {
    handleAssignShift(volunteerId, '08:00-14:00', 'Supply delivery', note);
  };

  const handleRequestClarification = (volunteerId, note) => {
    setVolunteers((prev) =>
      prev.map((v) => {
        if (v.id === volunteerId) {
          return {
            ...v,
            status: 'Review',
            statusType: 'review',
            notes: note ? `${v.notes} | Clarification requested: ${note}` : v.notes
          };
        }
        return v;
      })
    );
  };

  const handleEscalate = (volunteerId, note) => {
    alert(`Escalation raised for record ${volunteerId}: "${note}". Notification routed to Incident Commander.`);
  };

  const handleGlobalSearchSubmit = (e) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      setActiveTab('directory');
    }
  };

  const handleSignOut = () => {
    navigate('/dashboard');
  };

  // Nav menu items
  const navItems = [
    {
      id: 'dashboard',
      label: 'Coordinator Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'directory',
      label: 'Volunteer Directory',
      icon: Users,
      badge: metrics.unfilledTasks,
      badgeType: 'danger'
    },
    {
      id: 'scheduling',
      label: 'Scheduling & Assignment',
      icon: CalendarCheck,
      badge: null
    },
    {
      id: 'ai-matching',
      label: 'AI Volunteer Matching',
      icon: Sparkles,
      badge: null
    },
    {
      id: 'activity-safety',
      label: 'Activity & Safety',
      icon: Activity,
      badge: null
    },
    {
      id: 'reports',
      label: 'Volunteer Reports',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <div className="vc-portal-container">
      {/* 1. Left Sidebar (Project Signature Dark Blue) */}
      <aside className="vc-sidebar">
        <div>
          {/* Brand Header */}
          <div className="vc-brand-header">
            <div className="vc-brand-icon-box">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="vc-brand-title">HumanAid</h2>
              <p className="vc-brand-subtitle">Response coordination</p>
            </div>
          </div>

          {/* User Card with Duty Switcher */}
          <div className="vc-user-card">
            <div className="vc-user-card-info">
              <div className="vc-user-avatar">{COORDINATOR_USER.avatar}</div>
              <div style={{ minWidth: 0 }}>
                <div className="vc-user-role-label">Signed in as</div>
                <div className="vc-user-role-name">{COORDINATOR_USER.role}</div>
                <div className="vc-user-person-name">{COORDINATOR_USER.name}</div>
              </div>
            </div>
            <label className="vc-toggle-switch" title="Duty status toggle">
              <input
                type="checkbox"
                checked={isOnDuty}
                onChange={() => setIsOnDuty(!isOnDuty)}
              />
              <span className="vc-toggle-slider" />
            </label>
          </div>

          {/* Navigation Items */}
          <ul className="vc-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`vc-nav-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="vc-nav-btn-content">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span className={`vc-nav-badge ${item.badgeType || ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="vc-sidebar-footer">
          <div className="vc-boundary-box">
            <div className="vc-boundary-header">
              <ShieldAlert size={12} />
              <span>Role access boundary</span>
            </div>
            <p className="vc-boundary-text">
              {COORDINATOR_USER.accessBoundaryNotice}
            </p>
          </div>

          <button className="vc-signout-btn" onClick={handleSignOut}>
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <main className="vc-main-wrapper">
        {/* Top Header */}
        <header className="vc-top-header">
          <div className="vc-breadcrumb">
            <span>VOLUNTEER COORDINATOR PORTAL</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0f172a', fontWeight: 600 }}>
              {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Global Search */}
            <div className="vc-search-bar">
              <Search size={14} color="#64748b" />
              <input
                type="text"
                placeholder="Search authorised records..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={handleGlobalSearchSubmit}
              />
              <span className="vc-search-kbd">⌘K</span>
            </div>

            {/* Active Operation Badge */}
            <div className="vc-operation-badge">
              <div className="label">Active operation</div>
              <div className="value">
                <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {COORDINATOR_USER.operation}
              </div>
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                className="vc-btn-icon"
                onClick={() => setNotificationCount(0)}
                title="Notifications"
              >
                <Bell size={16} />
              </button>
              {notificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '15px',
                    height: '15px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {notificationCount}
                </span>
              )}
            </div>

            {/* Coordinator Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 6px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '20px'
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#0b1528',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {COORDINATOR_USER.avatar}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>
                  {COORDINATOR_USER.name}
                </div>
                <div style={{ fontSize: '9.5px', color: '#64748b' }}>
                  {COORDINATOR_USER.role}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Prototype Disclaimer Banner */}
        <div className="vc-prototype-banner">
          <div className="vc-prototype-banner-dot" />
          <span>
            <strong>Coursework prototype:</strong> All records, AI results and transactions are fictional demonstration data. Actions are local UI simulations.
          </span>
        </div>

        {/* Active View Container */}
        <div className="vc-content-canvas">
          {activeTab === 'dashboard' && (
            <CoordinatorDashboardView
              metrics={metrics}
              priorityItems={PRIORITY_ATTENTION_ITEMS}
              workflowSteps={CONNECTED_ASSISTANCE_WORKFLOW}
              recentActivity={RECENT_COORDINATOR_ACTIVITY}
              onOpenDirectory={() => setActiveTab('directory')}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'directory' && (
            <VolunteerDirectoryView
              volunteers={volunteers}
              onConfirmAssignment={handleConfirmAssignment}
              onRequestClarification={handleRequestClarification}
              onEscalate={handleEscalate}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {activeTab === 'scheduling' && (
            <SchedulingAssignmentView
              volunteers={volunteers}
              onAssignShift={handleAssignShift}
              onRequestClarification={handleRequestClarification}
              onEscalate={handleEscalate}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {activeTab === 'ai-matching' && (
            <AIVolunteerMatchingView
              onOpenCompareModal={() => setIsCompareModalOpen(true)}
              onRecordDecision={(decision) => {
                setMetrics((prev) => ({
                  ...prev,
                  unfilledTasks: Math.max(0, prev.unfilledTasks - 1)
                }));
              }}
            />
          )}

          {activeTab === 'activity-safety' && (
            <ActivitySafetyView
              onRecordUpdate={(update) => {
                setMetrics((prev) => ({
                  ...prev,
                  completedActivities: prev.completedActivities + 1
                }));
              }}
            />
          )}

          {activeTab === 'reports' && (
            <VolunteerReportsView
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateVolunteerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateVolunteer={handleCreateVolunteer}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <CompareRecordModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
    </div>
  );
};

export default VolunteerCoordinatorPortal;


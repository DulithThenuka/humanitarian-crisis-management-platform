import React, { useState, useEffect, useCallback } from 'react';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';
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
  ShieldAlert,
  Loader2,
  AlertCircle,
  RefreshCw,
  Database
} from 'lucide-react';

import './VolunteerCoordinatorPortal.css';
import { HumanAidLogo } from '../../components/common/HumanAidLogo';

import {
  COORDINATOR_USER
} from './data/coordinatorData';
import { volunteerService } from '../../services/volunteerService';

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
  const [compareDuplicateInfo, setCompareDuplicateInfo] = useState(null);

  // Live Database States
  const [dashboardData, setDashboardData] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Load live data from SQL Server via backend API
  const loadPortalData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const [dashRes, volRes] = await Promise.all([
        volunteerService.getDashboard(),
        volunteerService.getAllVolunteers()
      ]);

      const dash = dashRes.data || dashRes;
      const vols = volRes.data || volRes;

      setDashboardData(dash);
      if (Array.isArray(vols)) {
        setVolunteers(vols);
      } else {
        setVolunteers([]);
      }

      if (dash?.unfilledTasks) {
        setNotificationCount(dash.unfilledTasks);
      }
    } catch (err) {
      console.error('Failed to load volunteer coordinator live data:', err);
      setError(err.message || 'Failed to connect to backend volunteer coordination API.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPortalData();
  }, [loadPortalData]);

  useRealtimeRefresh(
    ['volunteers', 'crises', 'assistancerequests'],
    () => loadPortalData(true)
  );

  // Derived metrics from live dashboard data
  const m = dashboardData?.metrics || dashboardData;
  const metrics = {
    registeredVolunteers: m?.registeredVolunteers ?? volunteers.length,
    registeredSub: m?.registeredSub || 'Active field responders',
    verificationPending: m?.verificationPending ?? volunteers.filter((v) => v.verification === 'Pending').length,
    verificationSub: m?.verificationSub || 'Background check required',
    availableNow: m?.availableNow ?? volunteers.filter((v) => v.status === 'Eligible').length,
    availableSub: m?.availableSub || 'Ready for rapid dispatch',
    activeAssignments: m?.activeAssignments ?? volunteers.filter((v) => v.status === 'Assigned').length,
    activeSub: m?.activeSub || 'Deployed to emergency tasks',
    unfilledTasks: m?.unfilledTasks ?? 0,
    unfilledSub: m?.unfilledSub || 'Urgent responder needs',
    completedActivities: m?.completedActivities ?? 0,
    completedSub: m?.completedSub || 'Successfully fulfilled operations'
  };

  const priorityItems = dashboardData?.priorityItems ?? dashboardData?.priorityAttentionItems ?? [];
  const workflowSteps = dashboardData?.workflowSteps ?? dashboardData?.coordinationWorkflowSteps ?? [];
  const recentActivity = dashboardData?.recentActivity ?? [];

  // Handlers for real database transactions
  const handleCreateVolunteer = async (newRecord) => {
    const payload = {
      name: newRecord.name || newRecord.fullName,
      fullName: newRecord.name || newRecord.fullName,
      email: newRecord.email,
      phoneNumber: newRecord.phone || newRecord.phoneNumber,
      phone: newRecord.phone || newRecord.phoneNumber,
      skills: newRecord.skills,
      serviceArea: newRecord.serviceArea,
      availability: newRecord.availability,
      verification: newRecord.verification || newRecord.verificationStatus,
      verificationStatus: newRecord.verification || newRecord.verificationStatus,
      status: newRecord.status,
      notes: newRecord.notes
    };

    await volunteerService.createVolunteer(payload);
    await loadPortalData(true);
  };

  const handleUpdateVolunteer = async (volunteerId, updatedRecord) => {
    const payload = {
      name: updatedRecord.name || updatedRecord.fullName,
      fullName: updatedRecord.name || updatedRecord.fullName,
      email: updatedRecord.email,
      phoneNumber: updatedRecord.phone || updatedRecord.phoneNumber,
      phone: updatedRecord.phone || updatedRecord.phoneNumber,
      skills: updatedRecord.skills,
      serviceArea: updatedRecord.serviceArea,
      availability: updatedRecord.availability,
      verification: updatedRecord.verification,
      verificationStatus: updatedRecord.verification,
      status: updatedRecord.status,
      notes: updatedRecord.notes
    };

    await volunteerService.updateVolunteer(volunteerId, payload);
    await loadPortalData(true);
  };

  const handleDeleteVolunteer = async (volunteerId) => {
    await volunteerService.deleteVolunteer(volunteerId);
    await loadPortalData(true);
  };

  const handleAssignShift = async (volunteerId, shiftTime, shiftTask, note) => {
    const payload = {
      volunteerId,
      shiftTime,
      shiftTask,
      note
    };

    await volunteerService.assignShift(payload);
    await loadPortalData(true);
  };

  const handleConfirmAssignment = async (volunteerId, note) => {
    // Verifies and activates volunteer in SQL Server
    const payload = {
      action: 'Verify',
      reason: note || 'Verified and activated by Coordinator',
      note: note || 'Verified and activated by Coordinator',
      serviceArea: 'Kelani East'
    };

    await volunteerService.verifyVolunteer(volunteerId, payload);
    await loadPortalData(true);
  };

  const handleCompleteAssignment = async (assignmentIdOrVolunteerId, note) => {
    await volunteerService.completeAssignment(assignmentIdOrVolunteerId, {
      reason: note || 'Shift fulfilled',
      note: note || 'Shift fulfilled'
    });
    await loadPortalData(true);
  };

  const handleReleaseAssignment = async (assignmentIdOrVolunteerId, note) => {
    await volunteerService.releaseAssignment(assignmentIdOrVolunteerId, {
      reason: note || 'Assignment cancelled',
      note: note || 'Assignment cancelled'
    });
    await loadPortalData(true);
  };

  const handleRequestClarification = async (volunteerId, note) => {
    const payload = {
      action: 'Clarify',
      reason: note || 'Clarification requested by Coordinator',
      note: note || 'Clarification requested by Coordinator'
    };

    await volunteerService.requestClarification(volunteerId, payload);
    await loadPortalData(true);
  };

  const handleEscalate = async (volunteerId, note) => {
    const payload = {
      action: 'Escalate',
      reason: note || 'Escalation raised by Coordinator',
      note: note || 'Escalation raised by Coordinator'
    };

    await volunteerService.escalateVolunteer(volunteerId, payload);
    await loadPortalData(true);
  };

  const handleGlobalSearchSubmit = (e) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      setActiveTab('directory');
    }
  };

  const handleSignOut = () => {
    navigate('/login');
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
      badge: metrics.verificationPending > 0 ? metrics.verificationPending : null,
      badgeType: 'warning'
    },
    {
      id: 'scheduling',
      label: 'Scheduling & Assignment',
      icon: CalendarCheck,
      badge: metrics.unfilledTasks > 0 ? metrics.unfilledTasks : null,
      badgeType: 'danger'
    },
    {
      id: 'ai-matching',
      label: 'Task Matching & Decisions',
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
      {/* 1. Left Sidebar (Project Signature Dark Green / Deep Forest) */}
      <aside className="vc-sidebar">
        <div>
          {/* Brand Header */}
          <div className="vc-brand-header" style={{ marginBottom: '16px' }}>
            <HumanAidLogo variant="full" size="md" withContainer={true} />
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
            <span style={{ color: '#14291e', fontWeight: 600 }}>
              {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Sync Status Button */}
            <button
              onClick={() => loadPortalData(true)}
              className="vc-btn-icon"
              title="Refresh live data from database"
              style={{ cursor: 'pointer' }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'vc-spin' : ''} />
            </button>

            {/* Global Search */}
            <div className="vc-search-bar">
              <Search size={14} color="#657367" />
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
                background: '#f4f6f2',
                border: '1px solid #dfe5d8',
                borderRadius: '20px'
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#0c2340',
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
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#14291e' }}>
                  {COORDINATOR_USER.name}
                </div>
                <div style={{ fontSize: '9.5px', color: '#657367' }}>
                  {COORDINATOR_USER.role}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Operational Status Banner */}
        <div className="vc-prototype-banner" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div className="vc-prototype-banner-dot" style={{ backgroundColor: '#16a34a' }} />
          <span style={{ color: '#166534' }}>
            <strong>Operational Database Synchronized:</strong> Connected to SQL Server (HumanitarianCrisisDb). All volunteer registrations, assignments, shift completions, and audit logs persist to the backend and reflect across platform modules.
          </span>
        </div>

        {/* Loading and Error States */}
        {error && (
          <div
            style={{
              margin: '16px 24px 0 24px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadPortalData()}
              className="vc-btn-outline"
              style={{ padding: '4px 12px', fontSize: '12px', borderColor: '#fca5a5', color: '#b91c1c' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Active View Container */}
        <div className="vc-content-canvas">
          {loading && !dashboardData ? (
            <div style={{ padding: '80px', textAlign: 'center', color: '#657367' }}>
              <Loader2 size={28} className="vc-spin" style={{ margin: '0 auto 12px auto' }} />
              <div>Connecting to HumanitarianCrisisDb and loading volunteer coordinator workspace...</div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <CoordinatorDashboardView
                  metrics={metrics}
                  priorityItems={priorityItems}
                  workflowSteps={workflowSteps}
                  recentActivity={recentActivity}
                  onOpenDirectory={() => setActiveTab('directory')}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onSelectPriorityItem={(item) => setActiveTab('directory')}
                />
              )}

              {activeTab === 'directory' && (
                <VolunteerDirectoryView
                  volunteers={volunteers}
                  loading={isRefreshing}
                  onConfirmAssignment={handleConfirmAssignment}
                  onRequestClarification={handleRequestClarification}
                  onEscalate={handleEscalate}
                  onUpdateVolunteer={handleUpdateVolunteer}
                  onDeleteVolunteer={handleDeleteVolunteer}
                  onOpenCreateModal={() => setIsCreateModalOpen(true)}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                />
              )}

              {activeTab === 'scheduling' && (
                <SchedulingAssignmentView
                  volunteers={volunteers}
                  loading={isRefreshing}
                  onAssignShift={handleAssignShift}
                  onCompleteAssignment={handleCompleteAssignment}
                  onReleaseAssignment={handleReleaseAssignment}
                  onRequestClarification={handleRequestClarification}
                  onEscalate={handleEscalate}
                  onOpenCreateModal={() => setIsCreateModalOpen(true)}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                />
              )}

              {activeTab === 'ai-matching' && (
                <AIVolunteerMatchingView
                  onOpenCompareModal={() => setIsCompareModalOpen(true)}
                  onRecordDecision={async (decision) => {
                    await loadPortalData(true);
                  }}
                />
              )}

              {activeTab === 'activity-safety' && (
                <ActivitySafetyView
                  onRecordUpdate={async (update) => {
                    await loadPortalData(true);
                  }}
                />
              )}

              {activeTab === 'reports' && (
                <VolunteerReportsView
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                />
              )}
            </>
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
        duplicateInfo={compareDuplicateInfo}
      />
    </div>
  );
};

export default VolunteerCoordinatorPortal;

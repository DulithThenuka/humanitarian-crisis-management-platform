import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';
import { volunteerService } from '../../services/volunteerService';
import { HumanAidLogo } from '../../components/common/HumanAidLogo';
import {
  LayoutGrid,
  Search,
  FileText,
  CheckSquare,
  Calendar,
  Bell,
  User,
  LifeBuoy,
  Shield,
  ShieldCheck,
  MapPin,
  LogOut,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// Data
import {
  VOLUNTEER_USER,
  INITIAL_METRICS,
  MOST_UPCOMING_ASSIGNMENT,
  UPCOMING_ASSIGNMENTS,
  RECENT_NOTIFICATIONS,
  VOLUNTEER_ACTIVITY_SUMMARY,
  INITIAL_OPPORTUNITIES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SCHEDULE_DAYS,
  INITIAL_AVAILABILITY_DAYS,
  INITIAL_PREFERRED_CATEGORIES,
  SERVICE_AREAS
} from './data/volunteerData';

// Views
import { OverviewView } from './views/OverviewView';
import { AvailableOpportunitiesView } from './views/AvailableOpportunitiesView';
import { MyAssignmentsView } from './views/MyAssignmentsView';
import { TaskProgressView } from './views/TaskProgressView';
import { ScheduleAvailabilityView } from './views/ScheduleAvailabilityView';
import { NotificationsMessagesView } from './views/NotificationsMessagesView';
import { MyProfileView } from './views/MyProfileView';
import { HelpSupportView } from './views/HelpSupportView';

// Modals
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { AcceptTaskModal } from './components/AcceptTaskModal';
import { AssignmentActionModal } from './components/AssignmentActionModal';
import { UpdateAvailabilityModal } from './components/UpdateAvailabilityModal';

// Styles
import './VolunteerPortal.css';

export const VolunteerPortal = ({ initialTab = 'overview' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState(initialTab);

  // Reactively sync activeTab with URL route and props
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    const p = (location.pathname || '').toLowerCase();
    if (p.includes('/opportunities')) {
      setActiveTab('opportunities');
    } else if (p.includes('/assignments')) {
      setActiveTab('assignments');
    } else if (p.includes('/progress')) {
      setActiveTab('progress');
    } else if (p.includes('/schedule') || p.includes('/availability') || p.includes('/roster')) {
      setActiveTab('schedule');
    } else if (p.includes('/notifications')) {
      setActiveTab('notifications');
    } else if (p.includes('/profile')) {
      setActiveTab('profile');
    } else if (p.includes('/help')) {
      setActiveTab('help');
    } else if (p.includes('/overview') || p === '/volunteer' || p === '/volunteer/portal' || p === '/volunteer/dashboard' || p === '/volunteers') {
      setActiveTab('overview');
    }
  }, [initialTab, location.pathname]);

  // Core Data States
  const [user, setUser] = useState(VOLUNTEER_USER);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [upcomingAssignment, setUpcomingAssignment] = useState(MOST_UPCOMING_ASSIGNMENT);
  const [upcomingList, setUpcomingList] = useState(UPCOMING_ASSIGNMENTS);
  const [notifications, setNotifications] = useState(RECENT_NOTIFICATIONS);
  const [activitySummary, setActivitySummary] = useState(VOLUNTEER_ACTIVITY_SUMMARY);
  const [opportunities, setOpportunities] = useState(() => {
    try {
      const saved = localStorage.getItem('volunteer_accepted_opportunity_ids');
      if (saved) {
        const acceptedIds = new Set(JSON.parse(saved).map((x) => String(x).toLowerCase().trim()));
        return INITIAL_OPPORTUNITIES.filter(
          (o) => !acceptedIds.has(String(o.id).toLowerCase().trim()) && !acceptedIds.has(String(o.title).toLowerCase().trim())
        );
      }
    } catch (e) {
      console.warn('Error initializing opportunities from storage:', e);
    }
    return INITIAL_OPPORTUNITIES;
  });
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [scheduleDays, setScheduleDays] = useState(INITIAL_SCHEDULE_DAYS);
  const [availabilityDays, setAvailabilityDays] = useState(INITIAL_AVAILABILITY_DAYS);
  const [preferredCategories, setPreferredCategories] = useState(INITIAL_PREFERRED_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with logged in user profile
  useEffect(() => {
    if (authUser) {
      setUser((prev) => ({
        ...prev,
        name: authUser.fullName || authUser.name || prev.name,
        role: authUser.role === 'Volunteer' || authUser.role === 4 ? 'Humanitarian Volunteer' : (authUser.role || prev.role),
        email: authUser.email || prev.email,
        avatar: authUser.initials || (authUser.fullName ? authUser.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : prev.avatar),
        volunteerId: authUser.id ? `VOL-${authUser.id.substring(0, 4).toUpperCase()}` : prev.volunteerId,
        volunteerGuid: authUser.id
      }));
    }
  }, [authUser]);

  // Modals
  const [selectedOppForDetail, setSelectedOppForDetail] = useState(null);
  const [selectedOppForAccept, setSelectedOppForAccept] = useState(null);
  const [selectedAssignmentAction, setSelectedAssignmentAction] = useState(null);
  const [isUpdateAvailOpen, setIsUpdateAvailOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Tab Breadcrumbs
  const tabTitles = {
    overview: 'Volunteer Dashboard',
    opportunities: 'Available Opportunities',
    assignments: 'My Assignments',
    progress: 'Task Progress',
    schedule: 'Schedule & Availability',
    notifications: 'Notifications & Messages',
    profile: 'My Profile',
    help: 'Help & Support'
  };

  // Authoritative Database Synchronization
  const refreshVolunteerData = useCallback(async () => {
    try {
      // 1. Fetch authenticated volunteer profile from /volunteers/me
      let myProfile = null;
      try {
        const meRes = await volunteerService.getMyProfile();
        myProfile = meRes?.data || meRes;
        if (myProfile && (myProfile.id || myProfile.volunteerCode)) {
          setUser((prev) => ({
            ...prev,
            name: myProfile.fullName || prev.name,
            email: myProfile.email || prev.email,
            phone: myProfile.phoneNumber || prev.phone,
            serviceArea: myProfile.serviceArea || prev.serviceArea,
            volunteerId: myProfile.volunteerCode || prev.volunteerId,
            volunteerGuid: myProfile.id || prev.volunteerGuid,
            dutyStatus: typeof myProfile.isAvailable === 'boolean' ? myProfile.isAvailable : prev.dutyStatus,
            skills: myProfile.skills ? myProfile.skills.split(',').map((s) => s.trim()) : prev.skills
          }));
        }
      } catch (e) {
        console.warn('Could not retrieve current volunteer profile:', e);
      }

      // 2. Fetch live assignments from backend API
      const targetVolunteerId = myProfile?.id || user.volunteerGuid || authUser?.id;
      const assignRes = await volunteerService.getAssignments(targetVolunteerId ? { volunteerId: targetVolunteerId } : {});
      const rawAssignments = assignRes?.data || assignRes;
      if (Array.isArray(rawAssignments)) {
        const mapped = rawAssignments.map((a) => {
          const isOffered = a.assignmentStatus === 0;
          const isAccepted = a.assignmentStatus === 1;
          const isCompleted = a.assignmentStatus === 2;
          const isCancelled = a.assignmentStatus === 3;

          const status = isOffered
            ? 'Offered'
            : isAccepted
              ? 'Accepted'
              : isCompleted
                ? 'Completed'
                : 'Declined';

          const nextAction = isOffered
            ? 'Respond'
            : isAccepted
              ? 'Open task'
              : 'View history';

          const actionType = isOffered
            ? 'respond'
            : isAccepted
              ? 'open'
              : 'history';

          return {
            id: a.volunteerCode ? `${a.volunteerCode}-${a.id.substring(0, 4)}` : a.id,
            rawId: a.id,
            taskTitle: a.taskDescription || 'Humanitarian Field Shift',
            assigned: a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Today',
            deadline: a.shiftTime || '18:00',
            location: a.serviceArea || 'Kelani East',
            coordinator: a.volunteerName || 'Authorised Coordinator',
            priority: isOffered ? 'High' : 'Medium',
            status,
            nextAction,
            actionType,
            details: a.notes || a.taskDescription || 'Coordinate relief operation support with authorized on-site team.'
          };
        });
        setAssignments(mapped);

        // Derive authoritative metrics from real assignments
        const active = mapped.filter((m) => m.status === 'Accepted' || m.status === 'Offered');
        const pending = mapped.filter((m) => m.status === 'Offered');
        const inProg = mapped.filter((m) => m.status === 'Accepted');
        const comp = mapped.filter((m) => m.status === 'Completed');

        setMetrics({
          assignedTasks: active.length,
          assignedSub: `${active.length} active or scheduled`,
          pendingAcceptance: pending.length,
          pendingSub: `${pending.length} responding by 18:00`,
          inProgress: inProg.length,
          inProgressSub: `${inProg.length} in field`,
          completedTasks: comp.length,
          completedSub: `${comp.length * 3} volunteer hours`
        });

        // Update upcoming assignments
        const upcoming = active[0] || mapped[0];
        if (upcoming) {
          setUpcomingAssignment({
            id: upcoming.id,
            rawId: upcoming.rawId,
            title: upcoming.taskTitle,
            code: `${upcoming.id} - ${upcoming.location} - ${upcoming.deadline}`,
            day: '19',
            month: 'FEB',
            dateStr: upcoming.assigned,
            time: upcoming.deadline,
            reportingBy: 'Today - 18:00',
            location: upcoming.location,
            area: upcoming.location,
            tags: ['Logistics', 'Field Ops', 'Priority'],
            coordinator: upcoming.coordinator,
            coordinatorPhone: '+94 77 555 0192',
            description: upcoming.details,
            ppeRequired: 'Reflective vest, safety boots, work gloves',
            status: upcoming.status
          });

          setUpcomingList(
            active.map((act) => ({
              id: act.id,
              rawId: act.rawId,
              title: act.taskTitle,
              timeLoc: `${act.assigned} - ${act.deadline} - ${act.location}`,
              status: act.status,
              badgeType: act.status === 'Offered' ? 'warning' : 'info',
              iconType: 'truck'
            }))
          );
        } else {
          setUpcomingAssignment(null);
          setUpcomingList([]);
        }

        // 3. Synchronize available opportunities with backend & assignments
        try {
          const oppRes = await volunteerService.getOpportunities(targetVolunteerId ? { volunteerId: targetVolunteerId } : {});
          const backendOpps = oppRes?.data || oppRes;

          let acceptedSet = new Set();
          try {
            const saved = localStorage.getItem('volunteer_accepted_opportunity_ids');
            if (saved) {
              JSON.parse(saved).forEach((x) => acceptedSet.add(String(x).toLowerCase().trim()));
            }
          } catch { }

          if (Array.isArray(rawAssignments)) {
            rawAssignments.forEach((a) => {
              if (a.taskDescription) acceptedSet.add(a.taskDescription.toLowerCase().trim());
            });
          }

          const sourceList = Array.isArray(backendOpps) && backendOpps.length > 0 ? backendOpps : INITIAL_OPPORTUNITIES;
          const filteredList = sourceList.filter((opp) => {
            const id = String(opp.id || '').toLowerCase().trim();
            const title = String(opp.title || '').toLowerCase().trim();
            return !acceptedSet.has(id) && !acceptedSet.has(title);
          });

          setOpportunities(filteredList);
        } catch (oppErr) {
          let acceptedSet = new Set();
          try {
            const saved = localStorage.getItem('volunteer_accepted_opportunity_ids');
            if (saved) {
              JSON.parse(saved).forEach((x) => acceptedSet.add(String(x).toLowerCase().trim()));
            }
          } catch { }

          if (Array.isArray(rawAssignments)) {
            rawAssignments.forEach((a) => {
              if (a.taskDescription) acceptedSet.add(a.taskDescription.toLowerCase().trim());
            });
          }

          setOpportunities((prev) =>
            prev.filter((opp) => {
              const id = String(opp.id || '').toLowerCase().trim();
              const title = String(opp.title || '').toLowerCase().trim();
              return !acceptedSet.has(id) && !acceptedSet.has(title);
            })
          );
        }
      }

      // 4. Fetch live dashboard telemetry
      const dashRes = await volunteerService.getDashboard();
      const dash = dashRes?.data || dashRes;
      if (dash?.metrics) {
        setActivitySummary((prev) => ({
          ...prev,
          primaryServiceArea: dash.coordinatorUser?.operation || prev.primaryServiceArea
        }));
      }
    } catch (err) {
      console.error('Failed to synchronize volunteer portal data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user.volunteerGuid, authUser?.id]);

  // Initial load
  useEffect(() => {
    refreshVolunteerData();
  }, [refreshVolunteerData]);

  // Real-time synchronization
  useRealtimeRefresh(['volunteers', 'crises', 'assistancerequests'], refreshVolunteerData);

  // Handlers for Persisted Database Operations
  const handleAcceptTask = async (opp) => {
    // 1. Immediately record in persistent localStorage
    try {
      const saved = localStorage.getItem('volunteer_accepted_opportunity_ids');
      const list = saved ? JSON.parse(saved) : [];
      if (!list.includes(opp.id)) list.push(opp.id);
      if (!list.includes(opp.title)) list.push(opp.title);
      localStorage.setItem('volunteer_accepted_opportunity_ids', JSON.stringify(list));
    } catch (e) {
      console.warn('Could not persist accepted opportunity to localStorage:', e);
    }

    // 2. Remove immediately from React UI state
    setOpportunities((prev) => prev.filter((o) => o.id !== opp.id && o.title !== opp.title));

    // 3. Persist to backend database
    try {
      const targetVolunteerId = user.volunteerGuid || authUser?.id || user.id;
      await volunteerService.assignShift({
        volunteerId: targetVolunteerId,
        shiftTime: opp.date || '08:30-13:30',
        shiftTask: opp.title,
        note: `${opp.id} | ${opp.categoryCode || opp.category || ''} | ${opp.description || ''}`,
        status: 1
      });
      showToast(`Task accepted: ${opp.title}. Added to My Assignments.`);
    } catch (e) {
      console.warn('Backend shift assignment error:', e);
      showToast(`Task accepted: ${opp.title}. Added to My Assignments.`);
    }

    // 4. Refresh authoritative assignments from backend
    await refreshVolunteerData();
  };

  const handleAssignmentResponse = async (taskId, action) => {
    const target = assignments.find((a) => a.id === taskId || a.rawId === taskId);
    const idToUse = target?.rawId || taskId;

    try {
      if (action === 'Accept') {
        if (target?.rawId) {
          await volunteerService.acceptAssignment(idToUse);
        }
        showToast(`Assignment ${taskId} accepted.`);
      } else if (action === 'Decline') {
        if (target?.rawId) {
          await volunteerService.releaseAssignment(idToUse, { reason: 'Volunteer declined assignment' });
        }
        showToast(`Assignment ${taskId} declined.`);
      }
      await refreshVolunteerData();
    } catch (err) {
      showToast(`Action failed: ${err?.message || 'Operation failed'}`);
      await refreshVolunteerData();
    }
  };

  const handleCompleteTask = async (task, { loggedHours, shiftNotes } = {}) => {
    const idToUse = task.rawId || task.id;
    try {
      if (task.rawId) {
        await volunteerService.completeAssignment(idToUse, {
          reason: shiftNotes || `Logged ${loggedHours} hours`,
          hours: loggedHours
        });
      }
      showToast(`Task ${task.id} marked as completed! Shift hours logged.`);
      await refreshVolunteerData();
    } catch (err) {
      showToast(`Error completing task: ${err?.message || 'Failed'}`);
      await refreshVolunteerData();
    }
  };

  const handleSaveAvailabilitySettings = async (newSettings) => {
    setAvailabilityDays(newSettings.days);
    setPreferredCategories(newSettings.categories);
    setUser((prev) => ({
      ...prev,
      serviceArea: newSettings.serviceArea
    }));
    try {
      const idToUse = user.volunteerGuid || authUser?.id;
      if (idToUse) {
        await volunteerService.updateVolunteer(idToUse, {
          serviceArea: newSettings.serviceArea,
          skills: newSettings.categories ? newSettings.categories.join(', ') : undefined,
          availability: JSON.stringify(newSettings.days)
        });
      }
    } catch (err) {
      console.error('Failed to persist availability settings:', err);
    }
    showToast('Weekly availability settings saved successfully.');
  };

  const handleUpdateAvailabilityQuick = async (updated) => {
    setUser((prev) => ({
      ...prev,
      dutyStatus: updated.dutyStatus,
      dutyLoggedTime: updated.dutyLoggedTime,
      serviceArea: updated.serviceArea
    }));
    try {
      const idToUse = user.volunteerGuid || authUser?.id;
      if (idToUse) {
        await volunteerService.updateVolunteer(idToUse, {
          isAvailable: updated.dutyStatus,
          serviceArea: updated.serviceArea
        });
      }
    } catch (err) {
      console.error('Failed to persist quick availability:', err);
    }
    showToast('Volunteer availability preferences updated.');
  };

  const handleSaveProfile = async (profileData) => {
    const idToUse = user.volunteerGuid || authUser?.id;
    try {
      if (idToUse) {
        await volunteerService.updateVolunteer(idToUse, {
          fullName: profileData.displayName,
          email: profileData.email,
          serviceArea: profileData.serviceArea,
          skills: profileData.skills,
          availability: profileData.availability
        });
      }
      await refreshVolunteerData();
      showToast('Volunteer profile and service preferences saved.');
    } catch (err) {
      showToast(`Failed to save profile: ${err?.message || 'Error'}`);
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setUser((prev) => ({ ...prev, notificationCount: 0 }));
    showToast('All notifications marked as read.');
  };

  return (
    <div className="vol-portal-container">
      {/* 1. Left Dark Forest Green Sidebar matching Figma */}
      <aside className="vol-sidebar">
        <div>
          {/* Brand Header */}
          <div className="vol-brand-header" style={{ marginBottom: '16px' }}>
            <HumanAidLogo variant="full" size="md" withContainer={true} />
          </div>

          {/* User Profile Card with Duty Switcher */}
          <div className="vol-user-card">
            <div className="vol-user-card-info">
              <div className="vol-user-avatar">{user.avatar}</div>
              <div>
                <div className="vol-user-role-label">Signed in as</div>
                <div className="vol-user-role-name">{user.role}</div>
                <div className="vol-user-person-name">{user.name}</div>
              </div>
            </div>
            <label className="vol-toggle-switch" title="Toggle On-Duty Status">
              <input
                type="checkbox"
                checked={user.dutyStatus}
                onChange={async (e) => {
                  const newStatus = e.target.checked;
                  setUser((prev) => ({ ...prev, dutyStatus: newStatus }));
                  try {
                    const idToUse = user.volunteerGuid || authUser?.id;
                    if (idToUse) {
                      await volunteerService.updateVolunteer(idToUse, { isAvailable: newStatus });
                    }
                  } catch (err) {
                    console.error('Failed to persist duty status:', err);
                  }
                  showToast(
                    newStatus
                      ? 'Duty status active: Available for assignments.'
                      : 'Duty status paused: Unavailable for dispatch.'
                  );
                }}
              />
              <span className="vol-toggle-slider" />
            </label>
          </div>

          {/* Navigation Menu List */}
          <ul className="vol-nav-list">
            <li>
              <button
                className={`vol-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <div className="vol-nav-btn-content">
                  <LayoutGrid size={17} />
                  <span>Overview</span>
                </div>
              </button>
            </li>

            <li>
              <button
                className={`vol-nav-btn ${activeTab === 'opportunities' ? 'active' : ''}`}
                onClick={() => setActiveTab('opportunities')}
              >
                <div className="vol-nav-btn-content">
                  <Search size={17} />
                  <span>Available Opportunities</span>
                </div>
                <span className="vol-nav-badge">{opportunities.length}</span>
              </button>
            </li>

            <li>
              <button
                className={`vol-nav-btn ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => setActiveTab('assignments')}
              >
                <div className="vol-nav-btn-content">
                  <FileText size={17} />
                  <span>My Assignments</span>
                </div>
                <span className="vol-nav-badge">{assignments.length}</span>
              </button>
            </li>

            <li>
              <button
                className={`vol-nav-btn ${activeTab === 'progress' ? 'active' : ''}`}
                onClick={() => setActiveTab('progress')}
              >
                <div className="vol-nav-btn-content">
                  <CheckSquare size={17} />
                  <span>Task Progress</span>
                </div>
              </button>
            </li>

            <li>
              <button
                className={`vol-nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => setActiveTab('schedule')}
              >
                <div className="vol-nav-btn-content">
                  <Calendar size={17} />
                  <span>Schedule & Availability</span>
                </div>
              </button>
            </li>

            <li>
              <button
                className={`vol-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <div className="vol-nav-btn-content">
                  <Bell size={17} />
                  <span>Notifications & Messages</span>
                </div>
                {user.notificationCount > 0 && (
                  <span className="vol-nav-badge danger">{user.notificationCount}</span>
                )}
              </button>
            </li>

            <li>
              <button
                className={`vol-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <div className="vol-nav-btn-content">
                  <User size={17} />
                  <span>My Profile</span>
                </div>
              </button>
            </li>

            <li>
              <button
                className={`vol-nav-btn ${activeTab === 'help' ? 'active' : ''}`}
                onClick={() => setActiveTab('help')}
              >
                <div className="vol-nav-btn-content">
                  <LifeBuoy size={17} />
                  <span>Help & Support</span>
                </div>
              </button>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="vol-sidebar-footer">
          <div className="vol-boundary-box">
            <div className="vol-boundary-header">
              <ShieldCheck size={14} />
              <span>Volunteer prototype</span>
            </div>
            <p className="vol-boundary-text">
              Real-time sessions and eligible support items only. All actions and staff records are not billed.
            </p>
          </div>

          <button className="vol-signout-btn" onClick={() => navigate('/dashboard')}>
            <LogOut size={14} />
            <span>Exit volunteer portal</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <main className="vol-main-wrapper">
        {/* Top Header matching Figma */}
        <header className="vol-top-header">
          <div className="vol-breadcrumb">
            <span className="vol-breadcrumb-role">VOLUNTEER PORTAL</span>
            <span className="vol-breadcrumb-sep">/</span>
            <span className="vol-breadcrumb-page">{tabTitles[activeTab]}</span>
          </div>

          <div className="vol-top-actions">
            {/* Search */}
            <div className="vol-search-input-box">
              <Search size={14} className="vol-search-icon" />
              <input
                type="text"
                className="vol-search-input"
                placeholder="Search tasks, opportunities, messages..."
              />
              <span className="vol-search-kbd">⌘K</span>
            </div>

            {/* Location selector */}
            <div className="vol-location-pill">
              <MapPin size={13} />
              <select
                className="vol-location-select"
                value={user.serviceArea}
                onChange={(e) => {
                  setUser({ ...user, serviceArea: e.target.value });
                  showToast(`Active service scope updated to ${e.target.value}`);
                }}
              >
                {SERVICE_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell */}
            <button
              className="vol-icon-btn"
              onClick={() => setActiveTab('notifications')}
              title="Notifications"
            >
              <Bell size={17} />
              {user.notificationCount > 0 && <span className="vol-notification-dot" />}
            </button>

            {/* Profile Avatar Pill */}
            <div
              className="vol-top-profile-chip"
              onClick={() => setActiveTab('profile')}
              title="View Volunteer Profile"
            >
              <div className="vol-top-profile-avatar">{user.avatar}</div>
              <div>
                <div className="vol-top-profile-name">{user.name}</div>
                <div className="vol-top-profile-badge">{user.shortRole}</div>
              </div>
            </div>
          </div>
        </header>

        {/* View Content Body */}
        <div className="vol-content-container">
          {activeTab === 'overview' && (
            <OverviewView
              metrics={metrics}
              upcomingAssignment={upcomingAssignment}
              upcomingList={upcomingList}
              notifications={notifications}
              activitySummary={activitySummary}
              user={user}
              onNavigateTab={setActiveTab}
              onRefreshData={refreshVolunteerData}
              onViewAssignment={(item) => {
                const found =
                  assignments.find((a) => a.id === item.id || a.rawId === item.rawId) || {
                    id: item.id,
                    rawId: item.rawId,
                    taskTitle: item.title,
                    assigned: '18 Feb',
                    deadline: '19 Feb - 12:00',
                    location: item.area || 'Kelani East',
                    coordinator: item.coordinator || 'Maya Fernando',
                    priority: 'High',
                    status: item.status || 'Offered',
                    details: item.description || 'Support authorized humanitarian distribution team.'
                  };
                setSelectedAssignmentAction(found);
              }}
              onUpdateAvailability={() => setIsUpdateAvailOpen(true)}
              onChangeAvailabilityStatus={() => setIsUpdateAvailOpen(true)}
            />
          )}

          {activeTab === 'opportunities' && (
            <AvailableOpportunitiesView
              opportunities={opportunities}
              onViewDetails={(opp) => setSelectedOppForDetail(opp)}
              onAcceptTask={(opp) => setSelectedOppForAccept(opp)}
            />
          )}

          {activeTab === 'assignments' && (
            <MyAssignmentsView
              assignments={assignments}
              onActionClick={(item) => setSelectedAssignmentAction(item)}
              onRefreshData={refreshVolunteerData}
            />
          )}

          {activeTab === 'progress' && (
            <TaskProgressView
              assignments={assignments}
              onAcceptTask={async (taskId) => {
                await handleAssignmentResponse(taskId, 'Accept');
              }}
              onDeclineTask={async (taskId, reason) => {
                const target = assignments.find((a) => a.id === taskId || a.rawId === taskId);
                const idToUse = target?.rawId || taskId;
                await volunteerService.releaseAssignment(idToUse, { reason: reason || 'Volunteer declined assignment' });
                showToast(`Assignment declined.`);
                await refreshVolunteerData();
              }}
              onCompleteTask={handleCompleteTask}
              showToast={showToast}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleAvailabilityView
              scheduleDays={scheduleDays}
              availabilityDays={availabilityDays}
              preferredCategories={preferredCategories}
              onSaveAvailability={handleSaveAvailabilitySettings}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsMessagesView
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              showToast={showToast}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'profile' && (
            <MyProfileView
              user={user}
              activitySummary={activitySummary}
              onSaveProfile={handleSaveProfile}
              showToast={showToast}
            />
          )}

          {activeTab === 'help' && (
            <HelpSupportView
              showToast={showToast}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
        </div>
      </main>

      {/* 3. Interactive Modals */}
      {selectedOppForDetail && (
        <OpportunityDetailModal
          opportunity={selectedOppForDetail}
          onClose={() => setSelectedOppForDetail(null)}
          onAccept={(opp) => setSelectedOppForAccept(opp)}
        />
      )}

      {selectedOppForAccept && (
        <AcceptTaskModal
          opportunity={selectedOppForAccept}
          onClose={() => setSelectedOppForAccept(null)}
          onConfirm={(opp) => handleAcceptTask(opp)}
        />
      )}

      {selectedAssignmentAction && (
        <AssignmentActionModal
          assignment={selectedAssignmentAction}
          onClose={() => setSelectedAssignmentAction(null)}
          onRespondAction={handleAssignmentResponse}
          onOpenTaskProgress={(task) => {
            setActiveTab('progress');
          }}
        />
      )}

      {isUpdateAvailOpen && (
        <UpdateAvailabilityModal
          user={user}
          onClose={() => setIsUpdateAvailOpen(false)}
          onSave={handleUpdateAvailabilityQuick}
        />
      )}

      {/* 4. Toast Notification */}
      {toastMessage && (
        <div className="vol-toast">
          <CheckCircle2 size={18} style={{ color: '#4ade80' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default VolunteerPortal;


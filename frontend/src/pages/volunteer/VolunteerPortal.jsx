import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MapPin,
  LogOut,
  CheckCircle2,
  AlertCircle
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

  // Navigation State
  const [activeTab, setActiveTab] = useState(initialTab);

  // Core Data States
  const [user, setUser] = useState(VOLUNTEER_USER);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [upcomingAssignment, setUpcomingAssignment] = useState(MOST_UPCOMING_ASSIGNMENT);
  const [upcomingList, setUpcomingList] = useState(UPCOMING_ASSIGNMENTS);
  const [notifications, setNotifications] = useState(RECENT_NOTIFICATIONS);
  const [activitySummary, setActivitySummary] = useState(VOLUNTEER_ACTIVITY_SUMMARY);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [scheduleDays, setScheduleDays] = useState(INITIAL_SCHEDULE_DAYS);
  const [availabilityDays, setAvailabilityDays] = useState(INITIAL_AVAILABILITY_DAYS);
  const [preferredCategories, setPreferredCategories] = useState(INITIAL_PREFERRED_CATEGORIES);

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

  // Handlers
  const handleAcceptTask = (opp) => {
    // Add to assignments
    const newAssignment = {
      id: opp.id,
      taskTitle: opp.title,
      assigned: 'Today',
      deadline: opp.date,
      location: opp.location,
      coordinator: opp.coordinator,
      priority: opp.priority,
      status: 'Accepted',
      nextAction: 'Open task',
      actionType: 'open',
      details: opp.description
    };

    // Filter out from available
    setOpportunities((prev) => prev.filter((o) => o.id !== opp.id));
    setAssignments((prev) => [newAssignment, ...prev]);

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      assignedTasks: prev.assignedTasks + 1
    }));

    showToast(`Task accepted: ${opp.title}. Added to My Assignments.`);
  };

  const handleAssignmentResponse = (taskId, action) => {
    if (action === 'Accept') {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === taskId
            ? { ...a, status: 'Accepted', nextAction: 'Open task', actionType: 'open' }
            : a
        )
      );
      setMetrics((prev) => ({
        ...prev,
        pendingAcceptance: Math.max(0, prev.pendingAcceptance - 1)
      }));
      showToast(`Assignment ${taskId} accepted.`);
    } else if (action === 'Decline') {
      setAssignments((prev) => prev.filter((a) => a.id !== taskId));
      setMetrics((prev) => ({
        ...prev,
        assignedTasks: Math.max(0, prev.assignedTasks - 1),
        pendingAcceptance: Math.max(0, prev.pendingAcceptance - 1)
      }));
      showToast(`Assignment ${taskId} declined.`);
    }
  };

  const handleSaveAvailabilitySettings = (newSettings) => {
    setAvailabilityDays(newSettings.days);
    setPreferredCategories(newSettings.categories);
    setUser((prev) => ({
      ...prev,
      serviceArea: newSettings.serviceArea
    }));
    showToast('Weekly availability settings saved successfully.');
  };

  const handleUpdateAvailabilityQuick = (updated) => {
    setUser((prev) => ({
      ...prev,
      dutyStatus: updated.dutyStatus,
      dutyLoggedTime: updated.dutyLoggedTime,
      serviceArea: updated.serviceArea
    }));
    showToast('Volunteer availability preferences updated.');
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
          <div className="vol-brand-header">
            <div className="vol-brand-icon-box">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="vol-brand-title">HumanAid</h2>
              <p className="vol-brand-subtitle">Response coordination</p>
            </div>
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
                onChange={(e) => {
                  const newStatus = e.target.checked;
                  setUser({ ...user, dutyStatus: newStatus });
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
              <Shield size={13} />
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
              onViewAssignment={(item) => {
                const found =
                  assignments.find((a) => a.id === item.id) || {
                    id: item.id,
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
            />
          )}

          {activeTab === 'progress' && (
            <TaskProgressView
              assignments={assignments}
              onCompleteTask={(task) => {
                showToast(`Task ${task.id} marked as completed!`);
              }}
              showToast={showToast}
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
            />
          )}

          {activeTab === 'profile' && (
            <MyProfileView user={user} activitySummary={activitySummary} />
          )}

          {activeTab === 'help' && <HelpSupportView showToast={showToast} />}
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


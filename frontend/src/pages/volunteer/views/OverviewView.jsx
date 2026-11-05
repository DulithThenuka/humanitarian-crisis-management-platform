import React from 'react';
import {
  FileText,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Truck,
  Home,
  Bell,
  ShieldCheck,
  Search,
  CheckSquare,
  Calendar,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

export const OverviewView = ({
  metrics,
  upcomingAssignment,
  upcomingList,
  notifications,
  activitySummary,
  user,
  onNavigateTab,
  onViewAssignment,
  onUpdateAvailability,
  onChangeAvailabilityStatus
}) => {
  return (
    <div>
      {/* 1. Top System Notice Banner */}
      <div className="vol-notice-banner">
        <Info size={16} className="vol-notice-icon" />
        <span>
          <strong>Volunteer prototype:</strong> Field allocations assignments only. Actions and messages are stored locally and are sent/verified by your coordinator.
        </span>
      </div>

      {/* 2. Welcome Page Header */}
      <div className="vol-page-header">
        <div>
          <div className="vol-page-eyebrow">Wednesday, 19 February 2026 | 10:14</div>
          <h1 className="vol-page-title">Welcome to HumanAid Volunteer Portal</h1>
          <p className="vol-page-desc">
            Your availability is active for {user.serviceArea} and nearby service areas.
          </p>
        </div>
        <button
          className="vol-btn-outline"
          onClick={onUpdateAvailability}
        >
          <Calendar size={14} />
          <span>Update availability</span>
        </button>
      </div>

      {/* 3. Availability Status Ribbon */}
      <div className="vol-availability-ribbon">
        <div className="vol-ribbon-left">
          <span className="vol-status-dot-pulse" />
          <div>
            <span className="vol-ribbon-title">You are available for assignments. </span>
            <span className="vol-ribbon-sub">{user.dutyLoggedTime}</span>
          </div>
        </div>
        <button
          className="vol-ribbon-btn"
          onClick={onChangeAvailabilityStatus}
        >
          Change
        </button>
      </div>

      {/* 4. Stat Metric Cards */}
      <div className="vol-stats-grid">
        <div className="vol-stat-card" onClick={() => onNavigateTab('assignments')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="vol-stat-label">Assigned tasks</div>
            <div className="vol-stat-number">{metrics.assignedTasks}</div>
            <div className="vol-stat-subtext">{metrics.assignedSub}</div>
          </div>
          <div className="vol-stat-icon-box blue">
            <FileText size={20} />
          </div>
        </div>

        <div className="vol-stat-card" onClick={() => onNavigateTab('assignments')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="vol-stat-label">Pending acceptance</div>
            <div className="vol-stat-number">{metrics.pendingAcceptance}</div>
            <div className="vol-stat-subtext">{metrics.pendingSub}</div>
          </div>
          <div className="vol-stat-icon-box orange">
            <Clock size={20} />
          </div>
        </div>

        <div className="vol-stat-card" onClick={() => onNavigateTab('progress')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="vol-stat-label">In progress</div>
            <div className="vol-stat-number">{metrics.inProgress}</div>
            <div className="vol-stat-subtext">{metrics.inProgressSub}</div>
          </div>
          <div className="vol-stat-icon-box gray">
            <Send size={20} />
          </div>
        </div>

        <div className="vol-stat-card" onClick={() => onNavigateTab('assignments')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="vol-stat-label">Completed tasks</div>
            <div className="vol-stat-number">{metrics.completedTasks}</div>
            <div className="vol-stat-subtext">{metrics.completedSub}</div>
          </div>
          <div className="vol-stat-icon-box green">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* 5. Most Upcoming Assignment Feature Card */}
      {upcomingAssignment && (
        <div className="vol-feature-card">
          <div className="vol-feature-eyebrow">Most Upcoming Assignment</div>
          <div className="vol-feature-content-row">
            <div className="vol-feature-left">
              <div className="vol-date-box">
                <div className="vol-date-box-num">{upcomingAssignment.day}</div>
                <div className="vol-date-box-month">{upcomingAssignment.month}</div>
              </div>
              <div>
                <h3 className="vol-feature-title">{upcomingAssignment.title}</h3>
                <div className="vol-feature-details">{upcomingAssignment.code}</div>
                <div className="vol-pill-group">
                  <span className="vol-pill tag-neutral">{upcomingAssignment.tags[0]}</span>
                  <span className="vol-pill tag-neutral">{upcomingAssignment.tags[1]}</span>
                  <span className="vol-pill tag-orange">{upcomingAssignment.tags[2]}</span>
                </div>
              </div>
            </div>
            <div className="vol-feature-right">
              <div className="vol-reporting-by">
                Reporting by: <strong>{upcomingAssignment.reportingBy}</strong>
              </div>
              <button
                className="vol-btn-primary"
                onClick={() => onViewAssignment(upcomingAssignment)}
              >
                View assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Two-Column Grid: Upcoming Assignments & Recent Notifications */}
      <div className="vol-two-col-grid">
        {/* Left: Upcoming Assignments */}
        <div className="vol-card">
          <div className="vol-card-header">
            <h3 className="vol-card-title">Upcoming assignments</h3>
            <button
              className="vol-card-link"
              onClick={() => onNavigateTab('assignments')}
            >
              View all
            </button>
          </div>
          <div className="vol-list">
            {upcomingList.map((item) => (
              <div
                key={item.id}
                className="vol-list-item"
                onClick={() => onViewAssignment(item)}
              >
                <div className="vol-item-left">
                  <div className="vol-item-icon-box">
                    {item.iconType === 'truck' ? <Truck size={17} /> : <Home size={17} />}
                  </div>
                  <div>
                    <div className="vol-item-title">{item.title}</div>
                    <div className="vol-item-sub">{item.timeLoc}</div>
                  </div>
                </div>
                <div className="vol-item-right">
                  <span className={`vol-status-badge ${item.badgeType}`}>
                    {item.status}
                  </span>
                  <ChevronRight size={16} className="vol-item-arrow" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Notifications */}
        <div className="vol-card">
          <div className="vol-card-header">
            <h3 className="vol-card-title">Recent notifications</h3>
            <button
              className="vol-card-link"
              onClick={() => onNavigateTab('notifications')}
            >
              Open inbox
            </button>
          </div>
          <div className="vol-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="vol-list-item"
                onClick={() => onNavigateTab('notifications')}
              >
                <div className="vol-item-left">
                  <div className="vol-item-icon-box">
                    {notif.type === 'assignment' && <Bell size={17} style={{ color: '#ea580c' }} />}
                    {notif.type === 'safety' && <ShieldCheck size={17} style={{ color: '#0284c7' }} />}
                    {notif.type === 'approval' && <CheckCircle2 size={17} style={{ color: '#16a34a' }} />}
                  </div>
                  <div>
                    <div className="vol-item-title">{notif.title}</div>
                    <div className="vol-item-sub">{notif.subtitle}</div>
                  </div>
                </div>
                <div className="vol-item-right">
                  <ChevronRight size={16} className="vol-item-arrow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Two-Column Grid: Quick Actions & Volunteer Activity Summary */}
      <div className="vol-two-col-grid">
        {/* Left: Quick Actions */}
        <div className="vol-card">
          <div className="vol-card-header">
            <h3 className="vol-card-title">Quick actions</h3>
          </div>
          <div className="vol-quick-actions-list">
            <button
              className="vol-action-btn-row"
              onClick={() => onNavigateTab('opportunities')}
            >
              <div className="vol-action-btn-left">
                <Search size={16} />
                <span>Find opportunities</span>
              </div>
              <ChevronRight size={16} className="vol-item-arrow" />
            </button>

            <button
              className="vol-action-btn-row"
              onClick={() => onNavigateTab('progress')}
            >
              <div className="vol-action-btn-left">
                <CheckSquare size={16} />
                <span>Update task progress</span>
              </div>
              <ChevronRight size={16} className="vol-item-arrow" />
            </button>

            <button
              className="vol-action-btn-row"
              onClick={() => onNavigateTab('schedule')}
            >
              <div className="vol-action-btn-left">
                <Calendar size={16} />
                <span>Manage availability</span>
              </div>
              <ChevronRight size={16} className="vol-item-arrow" />
            </button>

            <button
              className="vol-action-btn-row"
              onClick={() => onNavigateTab('notifications')}
            >
              <div className="vol-action-btn-left">
                <MessageSquare size={16} />
                <span>Message coordinator</span>
              </div>
              <ChevronRight size={16} className="vol-item-arrow" />
            </button>
          </div>
        </div>

        {/* Right: Volunteer Activity Summary */}
        <div className="vol-card">
          <div className="vol-card-header">
            <h3 className="vol-card-title">Volunteer activity summary</h3>
          </div>
          <table className="vol-summary-table">
            <tbody>
              <tr className="vol-summary-row">
                <td className="vol-summary-label">Completed assignments</td>
                <td className="vol-summary-val">{activitySummary.completedAssignments}</td>
              </tr>
              <tr className="vol-summary-row">
                <td className="vol-summary-label">Volunteer hours</td>
                <td className="vol-summary-val">{activitySummary.volunteerHours}</td>
              </tr>
              <tr className="vol-summary-row">
                <td className="vol-summary-label">Primary service area</td>
                <td className="vol-summary-val">{activitySummary.primaryServiceArea}</td>
              </tr>
              <tr className="vol-summary-row">
                <td className="vol-summary-label">Coordinator verification status</td>
                <td className="vol-summary-val">
                  <span className="vol-badge-verified">
                    <CheckCircle2 size={13} />
                    {activitySummary.coordinatorVerificationStatus}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import {
  FolderArchive,
  UserCheck,
  CheckCircle2,
  CheckSquare,
  Send,
  BarChart3,
  ChevronRight,
  ShieldCheck,
  Info,
  Clock,
  AlertTriangle,
  Database
} from 'lucide-react';

export const CoordinatorDashboardView = ({
  metrics = {},
  priorityItems = [],
  workflowSteps = [],
  recentActivity = [],
  onOpenDirectory,
  onNavigateTab,
  onSelectPriorityItem
}) => {
  return (
    <div>
      {/* 1. Top Operational Status Banner */}
      <div className="vc-notice-banner" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
        <Database size={16} className="vc-notice-icon" style={{ color: '#15803d' }} />
        <span>
          <strong>Operational Live Data:</strong> Connected to SQL Server database (HumanitarianCrisisDb). Metrics, assignments, and audit trails synchronize in real-time across the platform.
        </span>
      </div>

      {/* 2. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">ReliefCore Field Operations Management</div>
          <h1 className="vc-page-title">Volunteer Coordinator Dashboard</h1>
          <p className="vc-page-desc">
            Operational dashboard tracking volunteer readiness, task assignments, crisis coordination handoffs, and verification workflows.
          </p>
        </div>
        <button className="vc-btn-primary" onClick={onOpenDirectory}>
          Open Volunteer Directory
        </button>
      </div>

      {/* 3. 6 Stat Metric Cards Row */}
      <div className="vc-stats-grid">
        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('directory')}
          style={{ cursor: 'pointer' }}
          title="Click to view Volunteer Directory"
        >
          <div>
            <div className="vc-stat-label">Registered volunteers</div>
            <div className="vc-stat-number">{metrics.registeredVolunteers ?? 0}</div>
            <div className="vc-stat-subtext">{metrics.registeredSub || 'Active field responders'}</div>
          </div>
          <div className="vc-stat-icon-box">
            <FolderArchive size={17} />
          </div>
        </div>

        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('directory')}
          style={{ cursor: 'pointer' }}
          title="Click to view Pending Verifications"
        >
          <div>
            <div className="vc-stat-label">Verification pending</div>
            <div className="vc-stat-number">{metrics.verificationPending ?? 0}</div>
            <div className="vc-stat-subtext">{metrics.verificationSub || 'Background check required'}</div>
          </div>
          <div className="vc-stat-icon-box">
            <UserCheck size={17} />
          </div>
        </div>

        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('directory')}
          style={{ cursor: 'pointer' }}
          title="Click to view Available Volunteers"
        >
          <div>
            <div className="vc-stat-label">Available now</div>
            <div className="vc-stat-number">{metrics.availableNow ?? 0}</div>
            <div className="vc-stat-subtext">{metrics.availableSub || 'Ready for rapid dispatch'}</div>
          </div>
          <div className="vc-stat-icon-box">
            <CheckCircle2 size={17} />
          </div>
        </div>

        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('scheduling')}
          style={{ cursor: 'pointer' }}
          title="Click to view Scheduling & Assignments"
        >
          <div>
            <div className="vc-stat-label">Active assignments</div>
            <div className="vc-stat-number">{metrics.activeAssignments ?? 0}</div>
            <div className="vc-stat-subtext">{metrics.activeSub || 'Deployed to emergency tasks'}</div>
          </div>
          <div className="vc-stat-icon-box">
            <CheckSquare size={17} />
          </div>
        </div>

        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('ai-matching')}
          style={{ cursor: 'pointer' }}
          title="Click to view Task Matching"
        >
          <div>
            <div className="vc-stat-label">Unfilled tasks</div>
            <div className="vc-stat-number">{metrics.unfilledTasks ?? 0}</div>
            <div className="vc-stat-subtext">{metrics.unfilledSub || 'Urgent responder needs'}</div>
          </div>
          <div className="vc-stat-icon-box">
            <Send size={17} />
          </div>
        </div>

        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('reports')}
          style={{ cursor: 'pointer' }}
          title="Click to view Volunteer Reports"
        >
          <div>
            <div className="vc-stat-label">Completed activities</div>
            <div className="vc-stat-number">{metrics.completedActivities ?? 0}</div>
            <div className="vc-stat-subtext">{metrics.completedSub || 'Successfully fulfilled operations'}</div>
          </div>
          <div className="vc-stat-icon-box">
            <BarChart3 size={17} />
          </div>
        </div>
      </div>

      {/* 4. Middle Section (2 Columns) */}
      <div className="vc-two-col-grid">
        {/* Left: Priority Attention */}
        <div className="vc-card">
          <div className="vc-card-header">
            <div>
              <h3 className="vc-card-title">Priority attention</h3>
              <div style={{ fontSize: '11.5px', color: '#657367' }}>
                High-impact operational records requiring coordinator action
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                background: '#fef3c7',
                color: '#b45309',
                borderRadius: '12px',
                border: '1px solid #fde68a'
              }}
            >
              {priorityItems.length} items
            </span>
          </div>

          <div className="vc-priority-list">
            {priorityItems.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#657367', fontSize: '13px' }}>
                No pending high-priority attention items. All volunteer queues are stable.
              </div>
            ) : (
              priorityItems.map((item) => (
                <div
                  key={item.id}
                  className="vc-priority-item"
                  onClick={() => onSelectPriorityItem ? onSelectPriorityItem(item) : onNavigateTab('directory')}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div className="vc-priority-title">{item.title}</div>
                    <div className="vc-priority-sub">{item.subtitle}</div>
                  </div>
                  <div className="vc-priority-right">
                    <span className={`vc-status-pill ${item.badge}`}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor:
                            item.badge === 'critical'
                              ? '#ef4444'
                              : item.badge === 'warning'
                              ? '#f59e0b'
                              : '#22c55e'
                        }}
                      />
                      {item.badgeText}
                    </span>
                    <ChevronRight size={15} style={{ color: '#8a9480' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Connected Assistance Workflow */}
        <div className="vc-card">
          <div className="vc-card-header">
            <div>
              <h3 className="vc-card-title">Connected assistance workflow</h3>
              <div style={{ fontSize: '11.5px', color: '#657367' }}>
                Cross-module humanitarian response pipeline
              </div>
            </div>
          </div>

          <div className="vc-workflow-list">
            {workflowSteps.map((ws) => (
              <div key={ws.step} className="vc-workflow-step">
                <div
                  className={`vc-workflow-step-num ${
                    ws.status === 'completed'
                      ? 'done'
                      : ws.status === 'current'
                      ? 'active'
                      : 'pending'
                  }`}
                >
                  {ws.status === 'completed' ? '✓' : ws.step}
                </div>
                <div>
                  <div className="vc-workflow-step-title">{ws.title}</div>
                  <div className="vc-workflow-step-sub">{ws.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Section (2 Columns) */}
      <div className="vc-two-col-grid">
        {/* Left: Recent Activity */}
        <div className="vc-card">
          <div className="vc-card-header">
            <h3 className="vc-card-title">Recent activity & dispatch log</h3>
          </div>
          <div className="vc-timeline">
            {recentActivity.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#657367', fontSize: '13px' }}>
                No recent coordination activity recorded yet.
              </div>
            ) : (
              recentActivity.map((act) => (
                <div key={act.id} className="vc-timeline-item">
                  <div className="vc-timeline-time">{act.time}</div>
                  <div className="vc-timeline-content">
                    <div className="vc-timeline-title">{act.title}</div>
                    <div className="vc-timeline-action">{act.action}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Privacy Boundary */}
        <div className="vc-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="vc-card-header">
            <h3 className="vc-card-title">Privacy & role boundary</h3>
          </div>
          <div className="vc-privacy-card">
            <ShieldCheck size={22} style={{ color: '#15803d', flexShrink: 0 }} />
            <div style={{ fontSize: '12.5px', color: '#166534', lineHeight: 1.45 }}>
              Volunteer coordinator role is granted access to verified skills, availability windows, and operational assignments. Direct emergency contacts and private residential lines remain restricted per privacy governance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboardView;

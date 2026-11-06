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
  AlertTriangle
} from 'lucide-react';

export const CoordinatorDashboardView = ({
  metrics,
  priorityItems,
  workflowSteps,
  recentActivity,
  onOpenDirectory,
  onNavigateTab,
  onSelectPriorityItem
}) => {
  return (
    <div>
      {/* 1. Top Notice Banner */}
      <div className="vc-notice-banner">
        <Info size={16} className="vc-notice-icon" />
        <span>
          <strong>Coursework prototype:</strong> All records, AI results and transactions are fictional demonstration data. Actions are local UI simulations.
        </span>
      </div>

      {/* 2. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">Illustrative Coursework Workspace</div>
          <h1 className="vc-page-title">Volunteer Coordinator Dashboard</h1>
          <p className="vc-page-desc">
            Fictional demonstration data shows role-scoped workload, handoffs and decisions. No live operation is connected.
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
        >
          <div>
            <div className="vc-stat-label">Registered volunteers</div>
            <div className="vc-stat-number">{metrics.registeredVolunteers}</div>
            <div className="vc-stat-subtext">{metrics.registeredSub}</div>
          </div>
          <div className="vc-stat-icon-box">
            <FolderArchive size={17} />
          </div>
        </div>

        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('directory')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="vc-stat-label">Verification pending</div>
            <div className="vc-stat-number">{metrics.verificationPending}</div>
            <div className="vc-stat-subtext">{metrics.verificationSub}</div>
          </div>
          <div className="vc-stat-icon-box">
            <UserCheck size={17} />
          </div>
        </div>

        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('directory')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="vc-stat-label">Available now</div>
            <div className="vc-stat-number">{metrics.availableNow}</div>
            <div className="vc-stat-subtext">{metrics.availableSub}</div>
          </div>
          <div className="vc-stat-icon-box">
            <CheckCircle2 size={17} />
          </div>
        </div>

        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('scheduling')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="vc-stat-label">Active assignments</div>
            <div className="vc-stat-number">{metrics.activeAssignments}</div>
            <div className="vc-stat-subtext">{metrics.activeSub}</div>
          </div>
          <div className="vc-stat-icon-box">
            <CheckSquare size={17} />
          </div>
        </div>

        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('ai-matching')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="vc-stat-label">Unfilled tasks</div>
            <div className="vc-stat-number">{metrics.unfilledTasks}</div>
            <div className="vc-stat-subtext">{metrics.unfilledSub}</div>
          </div>
          <div className="vc-stat-icon-box">
            <Send size={17} />
          </div>
        </div>

        <div
          className="vc-stat-card"
          onClick={() => onNavigateTab('reports')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="vc-stat-label">Completed activities</div>
            <div className="vc-stat-number">{metrics.completedActivities}</div>
            <div className="vc-stat-subtext">{metrics.completedSub}</div>
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
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                Show-impact records requiring review
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
              3 items
            </span>
          </div>

          <div className="vc-priority-list">
            {priorityItems.map((item) => (
              <div
                key={item.id}
                className="vc-priority-item"
                onClick={() => onSelectPriorityItem(item)}
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
                  <ChevronRight size={15} style={{ color: '#94a3b8' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Connected Assistance Workflow */}
        <div className="vc-card">
          <div className="vc-card-header">
            <div>
              <h3 className="vc-card-title">Connected assistance workflow</h3>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                End-to-end humanitarian response coordination
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
            <h3 className="vc-card-title">Recent activity</h3>
          </div>
          <div className="vc-timeline">
            {recentActivity.map((act) => (
              <div key={act.id} className="vc-timeline-item">
                <div className="vc-timeline-time">{act.time}</div>
                <div className="vc-timeline-content">
                  <div className="vc-timeline-title">{act.title}</div>
                  <div className="vc-timeline-action">{act.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Privacy Boundary */}
        <div className="vc-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="vc-card-header">
            <h3 className="vc-card-title">Privacy boundary</h3>
          </div>
          <div className="vc-privacy-card">
            <ShieldCheck size={22} style={{ color: '#15803d', flexShrink: 0 }} />
            <div style={{ fontSize: '12.5px', color: '#166534', lineHeight: 1.45 }}>
              Volunteer eligibility, skills and assignments only. Emergency contacts and personal address lines remain restricted.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


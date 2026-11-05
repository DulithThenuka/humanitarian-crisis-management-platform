import React from 'react';
import {
  Building2,
  Users,
  Bed,
  CheckCircle2,
  AlertTriangle,
  Send,
  BarChart2,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ShelterDashboardView = ({
  metrics,
  priorityItems,
  workflowSteps,
  recentActivity,
  onNavigateTab,
  onSelectPriorityItem
}) => {
  return (
    <>
      {/* View Header */}
      <div className="sh-view-header-row">
        <div>
          <div className="sh-view-pre-title">Illustrative Coursework Workspace</div>
          <h1 className="sh-view-title">Shelter Admin Dashboard</h1>
          <p className="sh-view-desc">
            Fictional demonstration data shows role-scoped workload, handoffs and decisions. No live operation is connected.
          </p>
        </div>
        <div className="sh-header-actions">
          <button
            className="sh-btn-primary"
            onClick={() => onNavigateTab('directory')}
          >
            Open Directory & Facilities
          </button>
        </div>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="sh-metrics-grid">
        {/* 1. Registered shelters */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Registered shelters</span>
            <div className="sh-metric-icon-tile">
              <Building2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.registeredShelters}</div>
          <div className="sh-metric-subtext">{metrics.operationalShelters} operational</div>
        </div>

        {/* 2. Current occupancy */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Current occupancy</span>
            <div className="sh-metric-icon-tile">
              <Users size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.currentOccupancy.toLocaleString()}</div>
          <div className="sh-metric-subtext">Across {metrics.acrossSites} sites</div>
        </div>

        {/* 3. Remaining capacity */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Remaining capacity</span>
            <div className="sh-metric-icon-tile">
              <Bed size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.remainingCapacity}</div>
          <div className="sh-metric-subtext">Across {metrics.acrossSites} sites</div>
        </div>

        {/* 4. Near capacity */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Near capacity</span>
            <div className="sh-metric-icon-tile">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.nearCapacityCount}</div>
          <div className="sh-metric-subtext">Review required</div>
        </div>

        {/* 5. Supply shortages */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Supply shortages</span>
            <div className="sh-metric-icon-tile">
              <Send size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.supplyShortages}</div>
          <div className="sh-metric-subtext">{metrics.criticalShortages} critical</div>
        </div>

        {/* 6. Admissions today */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Admissions today</span>
            <div className="sh-metric-icon-tile">
              <BarChart2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.admissionsToday}</div>
          <div className="sh-metric-subtext">{metrics.transfersToday} transfers</div>
        </div>
      </div>

      {/* Middle Row: Priority Attention & Connected Assistance Workflow */}
      <div className="sh-two-col-grid">
        {/* Priority Attention */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Priority attention</h2>
            <span className="sh-count-badge-amber">{priorityItems.length} items</span>
          </div>
          <div className="sh-section-box-subtitle">Role-scoped records requiring review</div>

          <div className="sh-priority-list">
            {priorityItems.map((item) => (
              <div
                key={item.id}
                className="sh-priority-item"
                onClick={() => onSelectPriorityItem(item)}
              >
                <div className="sh-priority-left">
                  <div className="sh-num-circle">{item.id}</div>
                  <div>
                    <h4 className="sh-priority-title">{item.title}</h4>
                    <p className="sh-priority-subtitle">{item.subtitle}</p>
                  </div>
                </div>
                <div className="sh-priority-right">
                  <span className={`sh-badge sh-badge-${item.badge}`}>
                    <span className="sh-badge-dot" />
                    {item.badgeText}
                  </span>
                  <ChevronRight size={16} color="#8ca393" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Assistance Workflow */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Connected assistance workflow</h2>
          </div>
          <div className="sh-section-box-subtitle">Role-specific handoffs and automated tracking</div>

          <div className="sh-workflow-steps">
            {workflowSteps.map((step) => (
              <div key={step.step} className="sh-workflow-step">
                {step.status === 'completed' ? (
                  <div className="sh-step-indicator-done">
                    <CheckCircle2 size={20} />
                  </div>
                ) : (
                  <div className="sh-step-indicator-num">{step.step}</div>
                )}
                <div>
                  <h4 className="sh-workflow-title">{step.title}</h4>
                  <p className="sh-workflow-sub">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity & Privacy Boundary */}
      <div className="sh-two-col-grid">
        {/* Recent Activity */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Recent activity</h2>
          </div>
          <div className="sh-activity-timeline" style={{ marginTop: '12px' }}>
            {recentActivity.map((act) => (
              <div key={act.id} className="sh-activity-row">
                <span className="sh-activity-time">{act.time}</span>
                <div className="sh-activity-content">
                  <h4 className="sh-activity-title">{act.title}</h4>
                  <p className="sh-activity-sub">{act.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Boundary */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Privacy boundary</h2>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div className="sh-privacy-card">
              <ShieldCheck size={22} color="#15803d" />
              <span>
                Shelter operations and placements only. Detailed case notes remain hidden.
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#6f8576', marginTop: '14px', lineHeight: '1.45' }}>
              All queries and updates performed in this workspace comply with role-based access security. Personally identifiable citizen data and sensitive triage interviews are accessible only by authorized Emergency Coordinators.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};


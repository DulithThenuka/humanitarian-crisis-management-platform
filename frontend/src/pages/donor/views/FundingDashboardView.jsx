import React from 'react';
import { 
  Lock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  BarChart3, 
  ChevronRight, 
  Check
} from 'lucide-react';

export const FundingDashboardView = ({
  metrics,
  priorityItems,
  workflowSteps,
  onNavigateTab,
  onOpenPriorityItem,
  onOpenApprovalModal
}) => {
  return (
    <div className="fo-workspace">
      {/* Title & Action Block (matching Screenshot 1) */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>ILLUSTRATIVE COURSEWORK WORKSPACE</span>
          </div>
          <h1 className="fo-title">Funding Officer Dashboard</h1>
          <p className="fo-subtitle">
            Fictional demonstration data shows role-scoped workload, handoffs and decisions. No live operation is connected.
          </p>
        </div>

        <button 
          className="fo-btn fo-btn-primary"
          onClick={() => onNavigateTab('donors')}
        >
          <span>Open Donor Management</span>
        </button>
      </div>

      {/* 6 Metrics KPI Row (Screenshot 1) */}
      <div className="fo-metrics-grid">
        {/* Metric 1: Registered donors */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donors')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Registered donors</span>
            <div className="fo-metric-icon-wrap">
              <Lock size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.registeredDonors?.value || '214'}</div>
          <span className="fo-metric-subtext">Restricted directory</span>
        </div>

        {/* Metric 2: Monetary records */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donations')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Monetary records</span>
            <div className="fo-metric-icon-wrap">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.monetaryRecords?.value || 'LKR 8.4m'}</div>
          <span className="fo-metric-subtext">Demo transactions</span>
        </div>

        {/* Metric 3: Material donations */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donations')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Material donations</span>
            <div className="fo-metric-icon-wrap">
              <AlertTriangle size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.materialDonations?.value || '38,420'}</div>
          <span className="fo-metric-subtext">Recorded units</span>
        </div>

        {/* Metric 4: Active campaigns */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('campaigns')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Active campaigns</span>
            <div className="fo-metric-icon-wrap">
              <CheckCircle size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.activeCampaigns?.value || '6'}</div>
          <span className="fo-metric-subtext">4 on target</span>
        </div>

        {/* Metric 5: Pending verification */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donors')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Pending verification</span>
            <div className="fo-metric-icon-wrap">
              <Send size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.pendingVerification?.value || '12'}</div>
          <span className="fo-metric-subtext">No funds moved</span>
        </div>

        {/* Metric 6: Allocated balance */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('allocations')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Allocated balance</span>
            <div className="fo-metric-icon-wrap">
              <BarChart3 size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.allocatedBalance?.value || '64%'}</div>
          <span className="fo-metric-subtext">Approved records</span>
        </div>
      </div>

      {/* Middle Grid: Priority Attention & Connected Assistance Workflow */}
      <div className="fo-middle-grid">
        {/* Left Column: Priority Attention */}
        <div className="fo-panel">
          <div className="fo-panel-header">
            <div className="fo-panel-title-wrap">
              <h2 className="fo-panel-title">Priority attention</h2>
              <span className="fo-badge-pill-cream">● 3 items</span>
            </div>
            <p className="fo-panel-subtitle">Role-scoped records requiring review</p>
          </div>

          <div className="fo-priority-list">
            {/* Item 1 */}
            <div 
              className="fo-priority-item"
              onClick={() => onNavigateTab('suspicious')}
            >
              <div className="fo-priority-left">
                <div className="fo-priority-number">1</div>
                <div>
                  <div className="fo-priority-title">DON-2047 anomaly flag</div>
                  <div className="fo-priority-desc">AI flag is not an accusation or rejection</div>
                </div>
              </div>
              <div className="fo-priority-right">
                <span className="fo-badge-tag-purple">● purple &gt;</span>
              </div>
            </div>

            {/* Item 2 */}
            <div 
              className="fo-priority-item"
              onClick={() => onOpenApprovalModal ? onOpenApprovalModal({ id: 'ALC-309', title: 'Community Relief Allocation', allocatedAmount: 'LKR 450,000' }) : onNavigateTab('allocations')}
            >
              <div className="fo-priority-left">
                <div className="fo-priority-number">2</div>
                <div>
                  <div className="fo-priority-title">ALC-309 approval pending</div>
                  <div className="fo-priority-desc">Dual approval required before allocation</div>
                </div>
              </div>
              <div className="fo-priority-right">
                <span className="fo-badge-tag-warning">● warning &gt;</span>
              </div>
            </div>

            {/* Item 3 */}
            <div 
              className="fo-priority-item"
              onClick={() => onNavigateTab('campaigns')}
            >
              <div className="fo-priority-left">
                <div className="fo-priority-number">3</div>
                <div>
                  <div className="fo-priority-title">Campaign target update</div>
                  <div className="fo-priority-desc">Verified demo records total 71%</div>
                </div>
              </div>
              <div className="fo-priority-right">
                <span className="fo-badge-tag-success">● success &gt;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Connected Assistance Workflow */}
        <div className="fo-panel">
          <div className="fo-panel-header">
            <h2 className="fo-panel-title">Connected assistance workflow</h2>
          </div>

          <div className="fo-workflow-list">
            {/* Step 1 */}
            <div className="fo-workflow-item completed">
              <div className="fo-workflow-icon check">
                <Check size={14} />
              </div>
              <div className="fo-workflow-text">
                <div className="fo-workflow-title">Citizen request recorded</div>
                <div className="fo-workflow-sub">Only relevant roles receive the handoff</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="fo-workflow-item completed">
              <div className="fo-workflow-icon check">
                <Check size={14} />
              </div>
              <div className="fo-workflow-text">
                <div className="fo-workflow-title">Human case review</div>
                <div className="fo-workflow-sub">Funding Officer action retained in audit history</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="fo-workflow-item pending">
              <div className="fo-workflow-icon num">3</div>
              <div className="fo-workflow-text">
                <div className="fo-workflow-title">Resource / shelter decision</div>
                <div className="fo-workflow-sub">Only relevant roles receive the handoff</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="fo-workflow-item pending">
              <div className="fo-workflow-icon num">4</div>
              <div className="fo-workflow-text">
                <div className="fo-workflow-title">Volunteer or partner handoff</div>
                <div className="fo-workflow-sub">Only relevant roles receive the handoff</div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="fo-workflow-item pending">
              <div className="fo-workflow-icon num">5</div>
              <div className="fo-workflow-text">
                <div className="fo-workflow-title">Citizen status notification</div>
                <div className="fo-workflow-sub">Only relevant roles receive the handoff</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingDashboardView;

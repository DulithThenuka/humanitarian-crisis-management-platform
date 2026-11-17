import React from 'react';
import { 
  Building2, 
  GitPullRequest, 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  BarChart2, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

export const PartnerOfficerDashboard = ({
  metrics,
  priorityItems,
  workflowSteps,
  activity,
  onNavigateTab
}) => {
  return (
    <div className="po-workspace">
      {/* Title & Action Block (matching Screenshot 1) */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>ILLUSTRATIVE COURSEWORK WORKSPACE</span>
          </div>
          <h1 className="po-title">Partner Officer Dashboard</h1>
          <p className="po-subtitle">
            Fictional demonstration data shows role-scoped workload, handoffs and decisions. No live operation is connected.
          </p>
        </div>

        <button 
          className="po-btn po-btn-primary"
          onClick={() => onNavigateTab('profile')}
        >
          <span>Open Organisation Profile</span>
        </button>
      </div>

      {/* 6 Metrics KPI Row (Screenshot 1) */}
      <div className="po-metrics-grid">
        {/* Metric 1 */}
        <div className="po-metric-card" onClick={() => onNavigateTab('profile')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Verification status</span>
            <div className="po-metric-icon-wrap">
              <Building2 size={15} />
            </div>
          </div>
          <div className="po-metric-val">{metrics?.verificationStatus?.value || 'Verified'}</div>
          <span className="po-metric-subtext">{metrics?.verificationStatus?.sub || 'National Relief Unit'}</span>
        </div>

        {/* Metric 2 */}
        <div className="po-metric-card" onClick={() => onNavigateTab('requests')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Collaboration requests</span>
            <div className="po-metric-icon-wrap">
              <GitPullRequest size={15} />
            </div>
          </div>
          <div className="po-metric-val">{metrics?.collaborationRequests?.value || '14'}</div>
          <span className="po-metric-subtext">{metrics?.collaborationRequests?.sub || '5 awaiting review'}</span>
        </div>

        {/* Metric 3 */}
        <div className="po-metric-card" onClick={() => onNavigateTab('contributions')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Resources offered</span>
            <div className="po-metric-icon-wrap">
              <AlertTriangle size={15} />
            </div>
          </div>
          <div className="po-metric-val">{metrics?.resourcesOffered?.value || '2,480'}</div>
          <span className="po-metric-subtext">{metrics?.resourcesOffered?.sub || 'Demo units'}</span>
        </div>

        {/* Metric 4 */}
        <div className="po-metric-card" onClick={() => onNavigateTab('profile')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Active commitments</span>
            <div className="po-metric-icon-wrap">
              <CheckCircle size={15} />
            </div>
          </div>
          <div className="po-metric-val">{metrics?.activeCommitments?.value || '18'}</div>
          <span className="po-metric-subtext">{metrics?.activeCommitments?.sub || '6 due today'}</span>
        </div>

        {/* Metric 5 */}
        <div className="po-metric-card" onClick={() => onNavigateTab('coordination')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Pending approvals</span>
            <div className="po-metric-icon-wrap">
              <Send size={15} />
            </div>
          </div>
          <div className="po-metric-val">{metrics?.pendingApprovals?.value || '5'}</div>
          <span className="po-metric-subtext">{metrics?.pendingApprovals?.sub || 'Organisation scope'}</span>
        </div>

        {/* Metric 6 */}
        <div className="po-metric-card" onClick={() => onNavigateTab('tracking')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">On-time deliveries</span>
            <div className="po-metric-icon-wrap">
              <BarChart2 size={15} />
            </div>
          </div>
          <div className="po-metric-val">{metrics?.onTimeDeliveries?.value || '89%'}</div>
          <span className="po-metric-subtext">{metrics?.onTimeDeliveries?.sub || 'Demo summary'}</span>
        </div>
      </div>

      {/* Middle Grid: Priority Attention & Connected Assistance Workflow */}
      <div className="po-middle-grid">
        {/* Left: Priority Attention */}
        <div className="po-panel">
          <div className="po-panel-header">
            <div className="po-panel-title-wrap">
              <h2 className="po-panel-title">Priority attention</h2>
              <span className="po-badge-pill-cream">● 3 items</span>
            </div>
            <p className="po-panel-subtitle">Role-scoped records requiring review</p>
          </div>

          <div className="po-priority-list">
            {/* Item 1 */}
            <div 
              className="po-priority-item"
              onClick={() => onNavigateTab('profile')}
            >
              <div className="po-priority-left">
                <div className="po-priority-number">1</div>
                <div>
                  <div className="po-priority-title">COM-109 delayed</div>
                  <div className="po-priority-desc">Responsible organisation asked for ETA</div>
                </div>
              </div>
              <div className="po-priority-right">
                <span className="po-badge-tag-critical">● critical &gt;</span>
              </div>
            </div>

            {/* Item 2 */}
            <div 
              className="po-priority-item"
              onClick={() => onNavigateTab('requests')}
            >
              <div className="po-priority-left">
                <div className="po-priority-number">2</div>
                <div>
                  <div className="po-priority-title">REQ-309 needs response</div>
                  <div className="po-priority-desc">Operating-area coordination requested</div>
                </div>
              </div>
              <div className="po-priority-right">
                <span className="po-badge-tag-warning">● warning &gt;</span>
              </div>
            </div>

            {/* Item 3 */}
            <div 
              className="po-priority-item"
              onClick={() => onNavigateTab('contributions')}
            >
              <div className="po-priority-left">
                <div className="po-priority-number">3</div>
                <div>
                  <div className="po-priority-title">Receipt confirmation</div>
                  <div className="po-priority-desc">COM-102 confirmed by authorised recipient</div>
                </div>
              </div>
              <div className="po-priority-right">
                <span className="po-badge-tag-success">● success &gt;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Connected Assistance Workflow */}
        <div className="po-panel">
          <div className="po-panel-header">
            <h2 className="po-panel-title">Connected assistance workflow</h2>
          </div>

          <div className="po-workflow-list">
            {/* Step 1 */}
            <div className="po-workflow-item">
              <div className="po-workflow-icon check">
                <Check size={14} />
              </div>
              <div className="po-workflow-text">
                <div className="po-workflow-title">Citizen request recorded</div>
                <div className="po-workflow-sub">Only relevant roles receive the handoff</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="po-workflow-item">
              <div className="po-workflow-icon check">
                <Check size={14} />
              </div>
              <div className="po-workflow-text">
                <div className="po-workflow-title">Human case review</div>
                <div className="po-workflow-sub">Partner Officer action retained in audit history</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="po-workflow-item">
              <div className="po-workflow-icon num">3</div>
              <div className="po-workflow-text">
                <div className="po-workflow-title">Resource / shelter decision</div>
                <div className="po-workflow-sub">Only relevant roles receive the handoff</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="po-workflow-item">
              <div className="po-workflow-icon num">4</div>
              <div className="po-workflow-text">
                <div className="po-workflow-title">Volunteer or partner handoff</div>
                <div className="po-workflow-sub">Only relevant roles receive the handoff</div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="po-workflow-item">
              <div className="po-workflow-icon num">5</div>
              <div className="po-workflow-text">
                <div className="po-workflow-title">Citizen status notification</div>
                <div className="po-workflow-sub">Only relevant roles receive the handoff</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Privacy Boundary */}
      <div className="po-bottom-grid">
        {/* Left: Recent Activity */}
        <div className="po-panel">
          <div className="po-panel-header">
            <h2 className="po-panel-title">Recent activity</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', backgroundColor: '#f8faf7', borderRadius: '8px', border: '1px solid #edf1eb' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#738075' }}>10:12</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1e3d2c' }}></span>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>COM-118 · CR-2026-014</span>
                <div style={{ fontSize: '12px', color: '#657367' }}>Prototype record updated by authorised staff</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Privacy Boundary */}
        <div className="po-panel">
          <div className="po-panel-header">
            <h2 className="po-panel-title">Privacy boundary</h2>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px',
            backgroundColor: '#edf2e8',
            borderRadius: '8px',
            border: '1px solid #dbe4c6'
          }}>
            <ShieldCheck size={18} color="#2e4d3a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#2f4033', lineHeight: 1.5 }}>
              Only authorised organisation records and linked crisis incidents are visible in this scope. Personal identifying information and unrelated partner details are automatically restricted.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerOfficerDashboard;

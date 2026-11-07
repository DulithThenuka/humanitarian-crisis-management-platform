import React from 'react';
import { 
  ShieldCheck, 
  GitPullRequest, 
  Package, 
  Check, 
  Send, 
  BarChart2, 
  ChevronRight, 
  Shield, 
  ExternalLink 
} from 'lucide-react';

export const PartnerOfficerDashboard = ({ 
  records, 
  activity, 
  onSelectRecord, 
  onNavigateTab 
}) => {
  return (
    <div>
      {/* 1. Header Title & Open Organisation Profile Button */}
      <div className="po-title-action-row">
        <div>
          <div className="po-workspace-label">Illustrative Coursework Workspace</div>
          <h1 className="po-page-heading">Partner Officer Dashboard</h1>
          <p className="po-page-subtext">
            Fictional demonstration data shows role-scoped workload, handoffs and decisions. No live operation is connected.
          </p>
        </div>

        <button 
          type="button" 
          className="po-btn-blue-primary"
          onClick={() => onNavigateTab('profile')}
        >
          <span>Open Organisation Profile</span>
          <ExternalLink size={14} />
        </button>
      </div>

      {/* 2. Six Metric Cards Grid (White cards with blue accents) */}
      <div className="po-dashboard-kpi-grid">
        {/* Verification status */}
        <div className="po-white-metric-card">
          <div className="po-card-meta-top">
            <span className="po-metric-title-label">Verification status</span>
            <div className="po-metric-icon-bubble" style={{ background: '#dcfce7', color: '#15803d' }}>
              <ShieldCheck size={15} />
            </div>
          </div>
          <div>
            <div className="po-metric-main-number" style={{ color: '#15803d' }}>Verified</div>
            <div className="po-metric-subtext">National Relief Unit</div>
          </div>
        </div>

        {/* Collaboration requests */}
        <div className="po-white-metric-card">
          <div className="po-card-meta-top">
            <span className="po-metric-title-label">Collaboration requests</span>
            <div className="po-metric-icon-bubble">
              <GitPullRequest size={15} />
            </div>
          </div>
          <div>
            <div className="po-metric-main-number">14</div>
            <div className="po-metric-subtext">6 awaiting review</div>
          </div>
        </div>

        {/* Resources offered */}
        <div className="po-white-metric-card">
          <div className="po-card-meta-top">
            <span className="po-metric-title-label">Resources offered</span>
            <div className="po-metric-icon-bubble">
              <Package size={15} />
            </div>
          </div>
          <div>
            <div className="po-metric-main-number">2,480</div>
            <div className="po-metric-subtext">Donated units</div>
          </div>
        </div>

        {/* Active commitments */}
        <div className="po-white-metric-card">
          <div className="po-card-meta-top">
            <span className="po-metric-title-label">Active commitments</span>
            <div className="po-metric-icon-bubble" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Check size={15} />
            </div>
          </div>
          <div>
            <div className="po-metric-main-number">18</div>
            <div className="po-metric-subtext">In field today</div>
          </div>
        </div>

        {/* Pending approvals */}
        <div className="po-white-metric-card">
          <div className="po-card-meta-top">
            <span className="po-metric-title-label">Pending approvals</span>
            <div className="po-metric-icon-bubble" style={{ background: '#fef3c7', color: '#b45309' }}>
              <Send size={14} />
            </div>
          </div>
          <div>
            <div className="po-metric-main-number">5</div>
            <div className="po-metric-subtext">Organisation scope</div>
          </div>
        </div>

        {/* On-time deliveries */}
        <div className="po-white-metric-card">
          <div className="po-card-meta-top">
            <span className="po-metric-title-label">On-time deliveries</span>
            <div className="po-metric-icon-bubble">
              <BarChart2 size={15} />
            </div>
          </div>
          <div>
            <div className="po-metric-main-number">89%</div>
            <div className="po-metric-subtext">Units summary</div>
          </div>
        </div>
      </div>

      {/* 3. Middle Two-Column Grid: Priority Attention & Connected Workflow */}
      <div className="po-dual-column-grid">
        {/* Left: Priority attention */}
        <div className="po-white-panel-card">
          <div className="po-panel-top-row">
            <h3 className="po-panel-heading">Priority attention</h3>
            <span className="po-pill-amber">3 items</span>
          </div>
          <p className="po-panel-desc">Role-scoped records requiring review</p>

          <div className="po-priority-group">
            {/* Item 1 */}
            <div 
              className="po-priority-card-row"
              onClick={() => {
                onSelectRecord('COM-110');
                onNavigateTab('profile');
              }}
            >
              <div className="po-priority-left-side">
                <div className="po-number-disc">1</div>
                <div>
                  <div className="po-priority-item-title">COM-110 delayed</div>
                  <div className="po-priority-item-sub">Responsible organization asked for ETA</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="po-tag-critical">&bull; critical</span>
                <ChevronRight size={15} color="#94a3b8" />
              </div>
            </div>

            {/* Item 2 */}
            <div 
              className="po-priority-card-row"
              onClick={() => {
                onSelectRecord('REG-309');
                onNavigateTab('profile');
              }}
            >
              <div className="po-priority-left-side">
                <div className="po-number-disc">2</div>
                <div>
                  <div className="po-priority-item-title">REG-309 needs response</div>
                  <div className="po-priority-item-sub">Operating area certification requested</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="po-tag-warning">&bull; warning</span>
                <ChevronRight size={15} color="#94a3b8" />
              </div>
            </div>

            {/* Item 3 */}
            <div 
              className="po-priority-card-row"
              onClick={() => {
                onSelectRecord('COM-105');
                onNavigateTab('profile');
              }}
            >
              <div className="po-priority-left-side">
                <div className="po-number-disc">3</div>
                <div>
                  <div className="po-priority-item-title">Receipt confirmation</div>
                  <div className="po-priority-item-sub">COM-105 confirmed by authorized recipient</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="po-tag-success">&bull; success</span>
                <ChevronRight size={15} color="#94a3b8" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Connected assistance workflow */}
        <div className="po-white-panel-card">
          <div className="po-panel-top-row" style={{ marginBottom: '16px' }}>
            <h3 className="po-panel-heading">Connected assistance workflow</h3>
          </div>

          <div className="po-workflow-container">
            {/* Step 1 */}
            <div className="po-wf-stage-row">
              <div className="po-wf-step-disc completed">
                <Check size={12} />
              </div>
              <div>
                <div className="po-wf-step-title">Citizen request recorded</div>
                <div className="po-wf-step-desc">Only relevant roles receive the handoff</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="po-wf-stage-row">
              <div className="po-wf-step-disc completed">
                <Check size={12} />
              </div>
              <div>
                <div className="po-wf-step-title">Human case review</div>
                <div className="po-wf-step-desc">Partner Officer action retained in audit history</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="po-wf-stage-row">
              <div className="po-wf-step-disc">3</div>
              <div>
                <div className="po-wf-step-title">Resource / shelter decision</div>
                <div className="po-wf-step-desc">Only relevant roles receive the handoff</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="po-wf-stage-row">
              <div className="po-wf-step-disc">4</div>
              <div>
                <div className="po-wf-step-title">Volunteer or partner handoff</div>
                <div className="po-wf-step-desc">Only relevant roles receive the handoff</div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="po-wf-stage-row">
              <div className="po-wf-step-disc">5</div>
              <div>
                <div className="po-wf-step-title">Citizen status notification</div>
                <div className="po-wf-step-desc">Only relevant roles receive the handoff</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Two-Column Grid: Recent Activity & Privacy Boundary */}
      <div className="po-dual-column-grid">
        {/* Left: Recent activity */}
        <div className="po-white-panel-card">
          <div className="po-panel-top-row" style={{ marginBottom: '16px' }}>
            <h3 className="po-panel-heading">Recent activity</h3>
          </div>

          <div className="po-activity-stream">
            {activity.map((act) => (
              <div key={act.id} className="po-activity-entry">
                <span className="po-activity-time-pill">{act.time}</span>
                <div className="po-activity-node-dot"></div>
                <div>
                  <div className="po-activity-primary-text">
                    {act.recordId} &bull; <span style={{ color: '#2563eb' }}>{act.incidentId}</span>
                  </div>
                  <div className="po-activity-secondary-text">{act.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Privacy boundary */}
        <div className="po-white-panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="po-panel-top-row" style={{ marginBottom: '16px' }}>
            <h3 className="po-panel-heading">Privacy boundary</h3>
          </div>

          <div className="po-privacy-box">
            <div className="po-privacy-shield-icon">
              <Shield size={14} />
            </div>
            <div className="po-privacy-body-text">
              Your organisation's shared incidents and commitments only. Other partners' private records, financial data, and unassigned citizen identities are securely isolated.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { 
  Users, 
  DollarSign, 
  Package, 
  CheckCircle, 
  AlertCircle, 
  PieChart, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  Lock,
  Send,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';

export const FundingDashboardView = ({
  metrics,
  priorityItems,
  workflowSteps,
  recentActivity,
  onNavigateTab,
  onOpenPriorityItem,
  onOpenApprovalModal
}) => {
  return (
    <div className="fo-workspace">
      {/* Title & Action Block (matching Figma Image 1 & Coordinator Image 2) */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <Layers size={13} />
            <span>ILLUSTRATIVE COURSEWORK WORKSPACE</span>
          </div>
          <h1 className="fo-title">Funding Dashboard</h1>
          <p className="fo-subtitle">
            Fictional demonstration data shows role-scoped workload, handoffs and decisions. No live operation is connected.
          </p>
        </div>

        <button 
          className="fo-btn fo-btn-primary"
          onClick={() => onNavigateTab('donors')}
        >
          <span>Open Donor Management</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 6 Metrics KPI Row (Crisp White Cards) */}
      <div className="fo-metrics-grid">
        {/* Metric 1 */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donors')} style={{ cursor: 'pointer' }}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">{metrics.registeredDonors.label}</span>
            <div className="fo-metric-icon-wrap">
              <Lock size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics.registeredDonors.value}</div>
          <span className="fo-metric-subtext">{metrics.registeredDonors.subtext}</span>
          <span className="fo-metric-trend">
            <TrendingUp size={11} />
            <span>{metrics.registeredDonors.trend}</span>
          </span>
        </div>

        {/* Metric 2 */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donations')} style={{ cursor: 'pointer' }}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">{metrics.monetaryRecords.label}</span>
            <div className="fo-metric-icon-wrap">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics.monetaryRecords.value}</div>
          <span className="fo-metric-subtext">{metrics.monetaryRecords.subtext}</span>
          <span className="fo-metric-trend">
            <TrendingUp size={11} />
            <span>{metrics.monetaryRecords.trend}</span>
          </span>
        </div>

        {/* Metric 3 */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donations')} style={{ cursor: 'pointer' }}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">{metrics.materialDonations.label}</span>
            <div className="fo-metric-icon-wrap">
              <Package size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics.materialDonations.value}</div>
          <span className="fo-metric-subtext">{metrics.materialDonations.subtext}</span>
          <span className="fo-metric-trend">
            <Activity size={11} />
            <span>{metrics.materialDonations.trend}</span>
          </span>
        </div>

        {/* Metric 4 */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('campaigns')} style={{ cursor: 'pointer' }}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">{metrics.activeCampaigns.label}</span>
            <div className="fo-metric-icon-wrap">
              <CheckCircle size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics.activeCampaigns.value}</div>
          <span className="fo-metric-subtext">{metrics.activeCampaigns.subtext}</span>
          <span className="fo-metric-trend">
            <Sparkles size={11} />
            <span>{metrics.activeCampaigns.trend}</span>
          </span>
        </div>

        {/* Metric 5 */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donors')} style={{ cursor: 'pointer' }}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">{metrics.pendingVerification.label}</span>
            <div className="fo-metric-icon-wrap" style={{ color: '#b45309', borderColor: '#fde68a', backgroundColor: '#fffbeb' }}>
              <Send size={15} />
            </div>
          </div>
          <div className="fo-metric-val" style={{ color: '#b45309' }}>{metrics.pendingVerification.value}</div>
          <span className="fo-metric-subtext">{metrics.pendingVerification.subtext}</span>
          <span className="fo-metric-trend" style={{ color: '#b45309' }}>
            <span>{metrics.pendingVerification.trend}</span>
          </span>
        </div>

        {/* Metric 6 */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('allocations')} style={{ cursor: 'pointer' }}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">{metrics.allocatedBalance.label}</span>
            <div className="fo-metric-icon-wrap">
              <PieChart size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics.allocatedBalance.value}</div>
          <span className="fo-metric-subtext">{metrics.allocatedBalance.subtext}</span>
          <span className="fo-metric-trend">
            <TrendingUp size={11} />
            <span>{metrics.allocatedBalance.trend}</span>
          </span>
        </div>
      </div>

      {/* Middle Grid: Priority Attention & Connected Assistance Workflow */}
      <div className="fo-middle-grid">
        {/* Left Column: Priority Attention */}
        <div className="fo-panel">
          <div className="fo-panel-header">
            <div className="fo-panel-title-wrap">
              <h2 className="fo-panel-title">Priority attention</h2>
              <span className="fo-panel-count-badge">● {priorityItems.length} items</span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Field-scoped records requiring review</span>
          </div>

          <div className="fo-priority-list">
            {priorityItems.map((item, index) => (
              <div 
                key={item.id} 
                className="fo-priority-item"
                onClick={() => {
                  if (item.id === 'ALC-302') {
                    onOpenApprovalModal({ id: 'ALC-302', title: 'Emergency Field Clinic Pharmaceuticals', allocatedAmount: 'LKR 850,000', cluster: 'Healthcare & Medical SAR' });
                  } else {
                    onOpenPriorityItem(item);
                  }
                }}
              >
                <div className="fo-priority-left">
                  <div className="fo-priority-number">{index + 1}</div>
                  <div>
                    <div className="fo-priority-title">{item.code}</div>
                    <div className="fo-priority-desc">{item.description}</div>
                  </div>
                </div>

                <div className="fo-priority-right">
                  <span 
                    className="fo-priority-tag"
                    style={{
                      backgroundColor: item.status === 'urgent' ? '#fef2f2' : item.status === 'pending' ? '#fffbeb' : '#ecfdf5',
                      color: item.status === 'urgent' ? '#dc2626' : item.status === 'pending' ? '#b45309' : '#059669',
                      border: `1px solid ${item.status === 'urgent' ? '#fecaca' : item.status === 'pending' ? '#fde68a' : '#a7f3d0'}`
                    }}
                  >
                    <span 
                      className="fo-tag-dot" 
                      style={{ backgroundColor: item.tagColor }}
                    ></span>
                    {item.badgeText}
                  </span>
                  <ChevronRight size={15} color="#94a3b8" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Connected Assistance Workflow */}
        <div className="fo-panel">
          <div className="fo-panel-header">
            <div className="fo-panel-title-wrap">
              <h2 className="fo-panel-title">Connected assistance workflow</h2>
            </div>
            <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>End-to-End Traceability</span>
          </div>

          <div className="fo-workflow-list">
            {workflowSteps.map((step) => (
              <div 
                key={step.step} 
                className={`fo-workflow-item ${step.status}`}
              >
                <div className="fo-workflow-left">
                  <div className="fo-workflow-step-num">
                    {step.step}
                  </div>
                  <div>
                    <div className="fo-workflow-title">{step.title}</div>
                    <div className="fo-workflow-sub">{step.description}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {step.actionLink}
                  </span>
                  <ChevronRight size={13} color="#94a3b8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Privacy Boundary */}
      <div className="fo-bottom-grid">
        {/* Recent Activity */}
        <div className="fo-panel">
          <div className="fo-panel-header">
            <div className="fo-panel-title-wrap">
              <h2 className="fo-panel-title">Recent activity</h2>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Real-time verified ledger stream</span>
          </div>

          <div className="fo-activity-list">
            {recentActivity.map((act) => (
              <div key={act.id} className="fo-activity-row">
                <span className="fo-activity-time">{act.time}</span>
                <div className="fo-activity-body">
                  <div className="fo-activity-heading">
                    <span style={{ color: '#0284c7', fontWeight: 700 }}>{act.recordId}</span>
                    <span style={{ color: '#94a3b8', margin: '0 6px' }}>·</span>
                    <span>{act.source}</span>
                  </div>
                  <div className="fo-activity-desc">{act.action}</div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#0f172a',
                  padding: '2px 8px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '6px'
                }}>
                  {act.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Boundary Card */}
        <div className="fo-privacy-card">
          <div className="fo-privacy-header">
            <ShieldCheck size={20} color="#0284c7" />
            <span>Privacy boundary</span>
          </div>
          <p className="fo-privacy-detail">
            Approved donor and funding records only. Payment processing, citizen banking credentials, and unrelated personal identifiers are excluded from this workstation pursuant to Humanitarian Protection Directives.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#eff6ff',
              color: '#0284c7',
              border: '1px solid #bfdbfe',
              fontWeight: 600
            }}>
              Role Scoped: Tier 3
            </span>
            <span style={{
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              fontWeight: 600
            }}>
              Audit Trail Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

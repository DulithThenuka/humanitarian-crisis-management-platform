import React from 'react';
import { 
  Users, 
  DollarSign, 
  Package, 
  Target, 
  Clock, 
  PieChart, 
  ChevronRight, 
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';

export const FundingDashboardView = ({
  metrics,
  priorityItems = [],
  workflowSteps = [],
  recentActivity = [],
  onNavigateTab,
  onOpenPriorityItem,
  onOpenApprovalModal
}) => {
  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>HUMANAID RESOURCE COORDINATION · LIVE OPERATIONS</span>
          </div>
          <h1 className="fo-title">Funding Officer Dashboard</h1>
          <p className="fo-subtitle">
            Live operational telemetry, donation audit verification, emergency relief campaigns, and dual-approval fund allocations.
          </p>
        </div>

        <div className="fo-title-actions">
          <button 
            className="fo-btn fo-btn-secondary"
            onClick={() => onNavigateTab('reports')}
          >
            <FileText size={15} />
            <span>Transparency Reports</span>
          </button>
          <button 
            className="fo-btn fo-btn-primary"
            onClick={() => onNavigateTab('donors')}
          >
            <Users size={15} />
            <span>Open Donor Directory</span>
          </button>
        </div>
      </div>

      {/* 6 Metrics KPI Row */}
      <div className="fo-metrics-grid">
        {/* Metric 1: Registered donors */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donors')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Registered donors</span>
            <div className="fo-metric-icon-wrap">
              <Users size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.registeredDonors?.value ?? 0}</div>
          <span className="fo-metric-subtext">{metrics?.registeredDonors?.subtext || 'Verified donor profiles'}</span>
          <div className="fo-metric-trend positive">
            <TrendingUp size={12} />
            <span>{metrics?.registeredDonors?.trend || 'Active directory'}</span>
          </div>
        </div>

        {/* Metric 2: Monetary records */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donations')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Monetary records</span>
            <div className="fo-metric-icon-wrap">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.monetaryRecords?.value ?? 'LKR 0'}</div>
          <span className="fo-metric-subtext">{metrics?.monetaryRecords?.subtext || 'Live cleared funds'}</span>
          <div className="fo-metric-trend positive">
            <TrendingUp size={12} />
            <span>{metrics?.monetaryRecords?.trend || 'Verified ledger'}</span>
          </div>
        </div>

        {/* Metric 3: Material donations */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donations')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Material donations</span>
            <div className="fo-metric-icon-wrap">
              <Package size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.materialDonations?.value ?? '0'}</div>
          <span className="fo-metric-subtext">{metrics?.materialDonations?.subtext || 'Recorded units'}</span>
          <div className="fo-metric-trend positive">
            <TrendingUp size={12} />
            <span>{metrics?.materialDonations?.trend || 'Warehouse intake'}</span>
          </div>
        </div>

        {/* Metric 4: Active campaigns */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('campaigns')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Active campaigns</span>
            <div className="fo-metric-icon-wrap">
              <Target size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.activeCampaigns?.value ?? 0}</div>
          <span className="fo-metric-subtext">{metrics?.activeCampaigns?.subtext || 'Emergency appeals'}</span>
          <div className="fo-metric-trend positive">
            <TrendingUp size={12} />
            <span>{metrics?.activeCampaigns?.trend || 'Active appeals'}</span>
          </div>
        </div>

        {/* Metric 5: Pending verification */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('donors')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Pending verification</span>
            <div className="fo-metric-icon-wrap" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
              <Clock size={15} />
            </div>
          </div>
          <div className="fo-metric-val" style={{ color: (metrics?.pendingVerification?.value > 0) ? '#d97706' : '#162e20' }}>
            {metrics?.pendingVerification?.value ?? 0}
          </div>
          <span className="fo-metric-subtext">{metrics?.pendingVerification?.subtext || 'Awaiting officer sign-off'}</span>
          <div className="fo-metric-trend" style={{ color: '#d97706' }}>
            <span>{metrics?.pendingVerification?.trend || 'Actionable queue'}</span>
          </div>
        </div>

        {/* Metric 6: Allocated balance */}
        <div className="fo-metric-card" onClick={() => onNavigateTab('allocations')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Allocated balance</span>
            <div className="fo-metric-icon-wrap">
              <PieChart size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{metrics?.allocatedBalance?.value ?? '0%'}</div>
          <span className="fo-metric-subtext">{metrics?.allocatedBalance?.subtext || 'Approved disbursements'}</span>
          <div className="fo-metric-trend positive">
            <span>{metrics?.allocatedBalance?.trend || 'Deployed balance'}</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Priority Attention & Connected Assistance Workflow */}
      <div className="fo-middle-grid">
        {/* Left Column: Priority Attention */}
        <div className="fo-panel">
          <div className="fo-panel-header">
            <div className="fo-panel-title-wrap">
              <h2 className="fo-panel-title">Priority Attention Queue</h2>
              <span className="fo-badge-pill-cream">
                ● {priorityItems.length} {priorityItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="fo-panel-subtitle">Actionable records requiring Funding Officer verification, co-signature or clearance</p>
          </div>

          <div className="fo-priority-list">
            {priorityItems.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#657367' }}>
                <CheckCircle size={28} color="#059669" style={{ margin: '0 auto 8px' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>All priority review items are cleared.</p>
                <span style={{ fontSize: '12px' }}>New incoming pledges and allocation requests will populate here automatically.</span>
              </div>
            ) : (
              priorityItems.map((item, index) => (
                <div 
                  key={item.id || index}
                  className="fo-priority-item"
                  onClick={() => {
                    if (item.relatedTab) onNavigateTab(item.relatedTab);
                    else if (onOpenPriorityItem) onOpenPriorityItem(item);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="fo-priority-left">
                    <div className="fo-priority-number" style={{ 
                      backgroundColor: item.status === 'urgent' ? '#fef2f2' : (item.status === 'pending' ? '#fffbeb' : '#f0fdf4'),
                      color: item.status === 'urgent' ? '#dc2626' : (item.status === 'pending' ? '#d97706' : '#059669'),
                      border: `1px solid ${item.status === 'urgent' ? '#fecaca' : (item.status === 'pending' ? '#fde68a' : '#bbf7d0')}`
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="fo-priority-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{item.code || item.id}</span>
                        <span style={{ fontSize: '11px', color: '#8c9c8e', fontWeight: 400 }}>{item.timestamp}</span>
                      </div>
                      <div className="fo-priority-desc">{item.description}</div>
                    </div>
                  </div>
                  <div className="fo-priority-right">
                    <span 
                      className="fo-badge"
                      style={{ 
                        backgroundColor: item.status === 'urgent' ? '#fef2f2' : (item.status === 'pending' ? '#fffbeb' : '#f0fdf4'),
                        color: item.status === 'urgent' ? '#dc2626' : (item.status === 'pending' ? '#d97706' : '#059669'),
                        border: `1px solid ${item.status === 'urgent' ? '#fecaca' : (item.status === 'pending' ? '#fde68a' : '#bbf7d0')}`,
                        textTransform: 'uppercase',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '12px'
                      }}
                    >
                      ● {item.badgeText || item.status} &gt;
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Connected Assistance Workflow */}
        <div className="fo-panel">
          <div className="fo-panel-header">
            <h2 className="fo-panel-title">Connected Humanitarian Pipeline</h2>
            <p className="fo-panel-subtitle">End-to-end trace from citizen intake to verified aid fulfillment</p>
          </div>

          <div className="fo-workflow-list">
            <div className="fo-workflow-item completed">
              <div className="fo-workflow-icon check">
                <CheckCircle size={14} />
              </div>
              <div className="fo-workflow-text">
                <div className="fo-workflow-title">1. Citizen Request Recorded</div>
                <div className="fo-workflow-sub">Verified intake triage & field demand logged in database</div>
              </div>
            </div>

            <div className="fo-workflow-item completed">
              <div className="fo-workflow-icon check">
                <CheckCircle size={14} />
              </div>
              <div className="fo-workflow-text">
                <div className="fo-workflow-title">2. Donor Pledge & Verification</div>
                <div className="fo-workflow-sub">Funding Officer verifies monetary grant or warehouse manifest</div>
              </div>
            </div>

            <div className="fo-workflow-item completed">
              <div className="fo-workflow-icon check">
                <CheckCircle size={14} />
              </div>
              <div className="fo-workflow-text">
                <div className="fo-workflow-title">3. Dual Approval Fund Allocation</div>
                <div className="fo-workflow-sub">Officer & Senior Coordinator co-sign emergency expenditure</div>
              </div>
            </div>

            <div className="fo-workflow-item in-progress">
              <div className="fo-workflow-icon num" style={{ backgroundColor: '#2d5a3e', color: '#fff' }}>4</div>
              <div className="fo-workflow-text">
                <div className="fo-workflow-title">4. Logistics Dispatch & Warehouse Handoff</div>
                <div className="fo-workflow-sub">Supplies dispatched from regional hub to active shelter depot</div>
              </div>
            </div>

            <div className="fo-workflow-item pending">
              <div className="fo-workflow-icon num">5</div>
              <div className="fo-workflow-text">
                <div className="fo-workflow-title">5. Field Delivery & Transparency Audit</div>
                <div className="fo-workflow-sub">Receipt signed by shelter lead, final audit hash recorded</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      {recentActivity && recentActivity.length > 0 && (
        <div className="fo-panel" style={{ marginTop: '24px' }}>
          <div className="fo-panel-header">
            <div className="fo-panel-title-wrap">
              <h2 className="fo-panel-title">Recent Operational Activity</h2>
              <span className="fo-badge-pill-cream">● Live Audit Feed</span>
            </div>
            <p className="fo-panel-subtitle">Real-time log of recorded pledges, clearance decisions, and verified disbursements</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="fo-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Record ID</th>
                  <th>Source / Donor</th>
                  <th>Action</th>
                  <th>Officer</th>
                  <th>Type</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((act) => (
                  <tr key={act.id}>
                    <td style={{ fontSize: '12px', color: '#657367' }}>{act.time}</td>
                    <td style={{ fontWeight: 600, color: '#162e20' }}>{act.recordId}</td>
                    <td style={{ fontWeight: 500 }}>{act.source}</td>
                    <td>{act.action}</td>
                    <td style={{ fontSize: '12px', color: '#657367' }}>{act.officer}</td>
                    <td>
                      <span className={`fo-type-pill ${act.type.toLowerCase()}`}>
                        {act.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#2d5a3e' }}>{act.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingDashboardView;

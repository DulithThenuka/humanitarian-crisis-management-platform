import React from 'react';
import {
  Users,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  BarChart3,
  Wallet,
  ChevronRight,
  Check,
  AlertTriangle
} from 'lucide-react';

export const FundingDashboardView = ({
  metrics,
  priorityItems = [],
  workflowSteps = [],
  recentActivity = [],
  loading = false,
  onNavigateTab,
  onOpenPriorityItem
}) => {
  const m = metrics || {};

  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>REAL-TIME FUNDING & DONOR OPERATIONS</span>
          </div>
          <h1 className="fo-title">Funding Officer Dashboard</h1>
          <p className="fo-subtitle">
            Live executive overview computed from persisted donor, campaign, verification, and allocation records.
          </p>
        </div>

        <button
          className="fo-btn fo-btn-primary"
          onClick={() => onNavigateTab('donations')}
        >
          <span>Manage Donation Records</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="fo-metrics-grid">
        <div className="fo-metric-card" onClick={() => onNavigateTab('donors')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Registered donors</span>
            <div className="fo-metric-icon-wrap">
              <Users size={15} />
            </div>
          </div>
          <div className="fo-metric-val">
            {loading ? '...' : (m.registeredDonors?.value ?? 0)}
          </div>
          <span className="fo-metric-subtext">{m.registeredDonors?.trend || 'Active contributors'}</span>
        </div>

        <div className="fo-metric-card" onClick={() => onNavigateTab('donations')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Verified monetary</span>
            <div className="fo-metric-icon-wrap">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="fo-metric-val">
            {loading ? '...' : (m.monetaryRecords?.value ?? 'LKR 0')}
          </div>
          <span className="fo-metric-subtext">{m.monetaryRecords?.subtext || '0 verified grants'}</span>
        </div>

        <div className="fo-metric-card" onClick={() => onNavigateTab('donations')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Material donations</span>
            <div className="fo-metric-icon-wrap">
              <Package size={15} />
            </div>
          </div>
          <div className="fo-metric-val">
            {loading ? '...' : (m.materialDonations?.value ?? '0')}
          </div>
          <span className="fo-metric-subtext">{m.materialDonations?.trend || 'Recorded units'}</span>
        </div>

        <div className="fo-metric-card" onClick={() => onNavigateTab('campaigns')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Active campaigns</span>
            <div className="fo-metric-icon-wrap">
              <CheckCircle size={15} />
            </div>
          </div>
          <div className="fo-metric-val">
            {loading ? '...' : (m.activeCampaigns?.value ?? 0)}
          </div>
          <span className="fo-metric-subtext">{m.activeCampaigns?.subtext || 'Crisis operations'}</span>
        </div>

        <div className="fo-metric-card" onClick={() => onNavigateTab('donations')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Pending verification</span>
            <div className="fo-metric-icon-wrap">
              <Clock size={15} />
            </div>
          </div>
          <div className="fo-metric-val">
            {loading ? '...' : (m.pendingVerification?.value ?? 0)}
          </div>
          <span className="fo-metric-subtext">{m.pendingVerification?.trend || 'Awaiting review'}</span>
        </div>

        <div className="fo-metric-card" onClick={() => onNavigateTab('allocations')}>
          <div className="fo-metric-top">
            <span className="fo-metric-label">Allocated balance</span>
            <div className="fo-metric-icon-wrap">
              <BarChart3 size={15} />
            </div>
          </div>
          <div className="fo-metric-val">
            {loading ? '...' : (m.allocatedBalance?.value ?? '0%')}
          </div>
          <span className="fo-metric-subtext">{m.allocatedBalance?.subtext || 'LKR 0 allocated'}</span>
        </div>
      </div>

      {/* Available Unallocated Balance Banner */}
      {m.availableUnallocated && (
        <div
          className="fo-panel"
          style={{
            padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet size={18} color="#3d6b4f" />
            <div>
              <div style={{ fontSize: '12px', color: '#657367', fontWeight: 600 }}>
                Available Verified Unallocated Funds
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#162e20' }}>
                {m.availableUnallocated.value}
              </div>
            </div>
          </div>
          <button className="fo-btn fo-btn-secondary" onClick={() => onNavigateTab('allocations')}>
            <span>Allocate Verified Funds</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Middle Grid: Priority Attention & Connected Assistance Workflow */}
      <div className="fo-middle-grid">
        {/* Left Column: Priority Attention */}
        <div className="fo-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                Priority Attention
              </h3>
              <span style={{ fontSize: '12px', color: '#657367' }}>
                Pending verifications and compliance flags requiring officer action
              </span>
            </div>
            <span className="fo-badge">{priorityItems.length} items</span>
          </div>

          {priorityItems.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#657367', fontSize: '13px', backgroundColor: '#f8faf8', borderRadius: '8px' }}>
              No pending verifications or open compliance flags at this time.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {priorityItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenPriorityItem && onOpenPriorityItem(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e5ebe2',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle size={16} color={item.tagColor || '#d97706'} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                        {item.code}
                      </div>
                      <div style={{ fontSize: '12px', color: '#657367' }}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '12px',
                        backgroundColor: item.status === 'urgent' ? '#fef2f2' : '#fffbeb',
                        color: item.tagColor || '#d97706',
                        textTransform: 'capitalize'
                      }}
                    >
                      {item.badgeText || item.status}
                    </span>
                    <ChevronRight size={14} color="#94a3b8" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Connected Assistance Workflow */}
        <div className="fo-panel" style={{ padding: '22px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: 0 }}>
              Connected Funding Workflow
            </h3>
            <span style={{ fontSize: '12px', color: '#657367' }}>
              End-to-end verification, allocation, and dispatch pipeline
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {workflowSteps.map((step) => (
              <div
                key={step.step}
                onClick={() => step.actionLink && onNavigateTab(step.actionLink)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #e5ebe2',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: step.status === 'completed' ? '#edf2e6' : '#f1f5f9',
                      color: step.status === 'completed' ? '#3d6b4f' : '#64748b',
                      fontSize: '12px',
                      fontWeight: 700
                    }}
                  >
                    {step.status === 'completed' ? <Check size={13} /> : step.step}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#657367' }}>
                      {step.description}
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} color="#94a3b8" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Feed: Recent Activity */}
      <div className="fo-panel" style={{ padding: '22px', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: 0 }}>
            Recent Funding Activity
          </h3>
          <button className="fo-btn fo-btn-secondary" onClick={() => onNavigateTab('donations')}>
            View Full Ledger
          </button>
        </div>

        {recentActivity.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#657367', fontSize: '13px' }}>
            No donation activity recorded yet.
          </div>
        ) : (
          <div className="fo-table-wrap">
            <table className="fo-table">
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>RECORD</th>
                  <th>DONOR / SOURCE</th>
                  <th>ACTION</th>
                  <th>VALUE</th>
                  <th>OFFICER</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((act) => (
                  <tr key={act.id} onClick={() => onNavigateTab('donations')} style={{ cursor: 'pointer' }}>
                    <td style={{ fontSize: '12px', color: '#657367' }}>{act.time}</td>
                    <td><strong style={{ color: '#0e6f76' }}>{act.RecordId || act.recordId}</strong></td>
                    <td>{act.source}</td>
                    <td>{act.action}</td>
                    <td><strong>{act.amount}</strong></td>
                    <td style={{ fontSize: '12px', color: '#657367' }}>{act.officer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingDashboardView;

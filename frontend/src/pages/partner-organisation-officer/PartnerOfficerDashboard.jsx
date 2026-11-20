import React, { useMemo } from 'react';
import {
  Building2,
  GitPullRequest,
  Package,
  CheckCircle,
  Truck,
  BarChart2,
  ShieldCheck,
  ArrowRight,
  Clock
} from 'lucide-react';
import {
  formatShortCode,
  formatDateTime,
  getCommitmentStatusMeta,
  getRequestStatusLabel,
  getPriorityLabel
} from './partnerOfficerUtils';

export const PartnerOfficerDashboard = ({
  partner = null,
  commitments = [],
  requests = [],
  zones = [],
  alerts = [],
  onNavigateTab,
  onSelectCommitment,
  onSelectRequest,
  loading = false
}) => {
  const partnerCommitments = useMemo(() => {
    if (!partner) return commitments;
    return commitments.filter((c) => c.partnerOrganisationId === partner.id);
  }, [commitments, partner]);

  const stats = useMemo(() => {
    const isVerified = partner ? !(partner.mouStatus || '').toLowerCase().includes('pending') : false;

    const pendingRequests = requests.filter((r) => {
      const s = getRequestStatusLabel(r.status).toLowerCase();
      return s === 'submitted' || s === 'verified';
    });
    const criticalRequests = pendingRequests.filter((r) => {
      const p = getPriorityLabel(r.urgency).toLowerCase();
      return p === 'critical' || p === 'high';
    });

    const metas = partnerCommitments.map((c) => ({ c, meta: getCommitmentStatusMeta(c.status) }));
    const active = metas.filter((x) => x.meta.isActive);
    const inTransit = metas.filter((x) => x.meta.isInTransit);
    const completed = metas.filter((x) => x.meta.isCompleted);
    const delayed = metas.filter((x) => x.meta.isDelayed);
    const pendingApproval = metas.filter((x) => x.meta.isPending);

    const totalUnits = partnerCommitments
      .filter((c) => !getCommitmentStatusMeta(c.status).isWithdrawn)
      .reduce((sum, c) => sum + (Number(c.qty) || 0), 0);

    const totalValueMillions = partnerCommitments
      .filter((c) => !getCommitmentStatusMeta(c.status).isWithdrawn)
      .reduce((sum, c) => sum + (Number(c.estimatedValueLkr) || 0), 0) / 1_000_000;

    const completionRate = partnerCommitments.length > 0
      ? Math.round((completed.length / partnerCommitments.length) * 100)
      : 0;

    return {
      isVerified,
      totalRequests: requests.length,
      pendingRequestsCount: pendingRequests.length,
      criticalRequestsCount: criticalRequests.length,
      activeCount: active.length,
      inTransitCount: inTransit.length,
      completedCount: completed.length,
      delayedCount: delayed.length,
      pendingApprovalCount: pendingApproval.length,
      totalUnits,
      totalValueMillions,
      completionRate,
      delayedItems: delayed.map((x) => x.c),
      pendingItems: pendingApproval.map((x) => x.c),
      urgentRequests: criticalRequests.length > 0 ? criticalRequests : pendingRequests
    };
  }, [partner, partnerCommitments, requests]);

  const priorityAttention = useMemo(() => {
    const items = [];

    stats.delayedItems.slice(0, 2).forEach((c) => {
      items.push({
        id: `delay-${c.id}`,
        title: `${formatShortCode(c.id, 'COM')} delayed — ${c.item}`,
        desc: `Destination: ${c.destinationZone}`,
        tag: 'critical',
        action: () => {
          onSelectCommitment && onSelectCommitment(c.id);
          onNavigateTab('tracking');
        }
      });
    });

    stats.urgentRequests.slice(0, 2).forEach((r) => {
      const p = getPriorityLabel(r.urgency);
      items.push({
        id: `req-${r.id}`,
        title: `${formatShortCode(r.id, 'REQ')} (${p}) — ${r.category}`,
        desc: `${r.address || 'Location unspecified'} · Status: ${getRequestStatusLabel(r.status)}`,
        tag: p.toLowerCase() === 'critical' ? 'critical' : 'warning',
        action: () => {
          onSelectRequest && onSelectRequest(r.id);
          onNavigateTab('requests');
        }
      });
    });

    stats.pendingItems.slice(0, 2).forEach((c) => {
      items.push({
        id: `pend-${c.id}`,
        title: `${formatShortCode(c.id, 'COM')} awaiting confirmation`,
        desc: `${c.item} (${Number(c.qty || 0).toLocaleString()} units) → ${c.destinationZone}`,
        tag: 'warning',
        action: () => {
          onSelectCommitment && onSelectCommitment(c.id);
          onNavigateTab('contributions');
        }
      });
    });

    if (items.length === 0 && alerts.length > 0) {
      const alert = alerts[0];
      items.push({
        id: `alert-${alert.id}`,
        title: alert.title || 'Active Emergency Alert',
        desc: alert.area || alert.severity || 'Active operational bulletin',
        tag: 'warning',
        action: () => onNavigateTab('coordination')
      });
    }

    return items.slice(0, 4);
  }, [stats, alerts, onNavigateTab, onSelectCommitment, onSelectRequest]);

  const recentActivity = useMemo(() => {
    const commEvents = partnerCommitments.map((c) => ({
      id: `act-c-${c.id}`,
      timestamp: c.updatedAt || c.createdAt,
      title: `${formatShortCode(c.id, 'COM')} · ${c.item}`,
      desc: `Status: ${c.status} · Zone: ${c.destinationZone}`,
      onClick: () => {
        onSelectCommitment && onSelectCommitment(c.id);
        onNavigateTab('contributions');
      }
    }));

    const reqEvents = requests.slice(0, 5).map((r) => ({
      id: `act-r-${r.id}`,
      timestamp: r.createdAt,
      title: `${formatShortCode(r.id, 'REQ')} · ${r.category}`,
      desc: `${getRequestStatusLabel(r.status)} · ${r.address || 'General'}`,
      onClick: () => {
        onSelectRequest && onSelectRequest(r.id);
        onNavigateTab('requests');
      }
    }));

    return [...commEvents, ...reqEvents]
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
      .slice(0, 5);
  }, [partnerCommitments, requests, onNavigateTab, onSelectCommitment, onSelectRequest]);

  const activeZonesCount = useMemo(() => {
    if (!partner) return zones.length;
    return (partner.assignedZones || []).length;
  }, [partner, zones]);

  return (
    <div className="po-workspace">
      {/* Header */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>LIVE PARTNER OPERATIONS OVERVIEW</span>
          </div>
          <h1 className="po-title">Partner Officer Dashboard</h1>
          <p className="po-subtitle">
            {partner
              ? `Operational metrics, pending requests, and fulfilment status for ${partner.name} (${partner.acronym}).`
              : 'Live operational metrics and partner coordination overview.'}
          </p>
        </div>

        <button
          type="button"
          className="po-btn po-btn-primary"
          onClick={() => onNavigateTab('profile')}
        >
          <span>Open Organisation Profile</span>
        </button>
      </div>

      {/* 6 Real Metrics KPI Row */}
      <div className="po-metrics-grid">
        <div className="po-metric-card" onClick={() => onNavigateTab('profile')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Verification status</span>
            <div className="po-metric-icon-wrap">
              <Building2 size={15} />
            </div>
          </div>
          <div className="po-metric-val">
            {loading && !partner ? '...' : (stats.isVerified ? 'Verified' : 'Pending')}
          </div>
          <span className="po-metric-subtext">{partner?.mouStatus || partner?.name || 'No partner selected'}</span>
        </div>

        <div className="po-metric-card" onClick={() => onNavigateTab('requests')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Pending assistance requests</span>
            <div className="po-metric-icon-wrap">
              <GitPullRequest size={15} />
            </div>
          </div>
          <div className="po-metric-val">{stats.pendingRequestsCount}</div>
          <span className="po-metric-subtext">
            {stats.criticalRequestsCount} high/critical · {stats.totalRequests} total
          </span>
        </div>

        <div className="po-metric-card" onClick={() => onNavigateTab('contributions')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Resources offered</span>
            <div className="po-metric-icon-wrap">
              <Package size={15} />
            </div>
          </div>
          <div className="po-metric-val">{stats.totalUnits.toLocaleString()}</div>
          <span className="po-metric-subtext">
            LKR {stats.totalValueMillions.toFixed(1)}M pledged value
          </span>
        </div>

        <div className="po-metric-card" onClick={() => onNavigateTab('contributions')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Active commitments</span>
            <div className="po-metric-icon-wrap">
              <CheckCircle size={15} />
            </div>
          </div>
          <div className="po-metric-val">{stats.activeCount}</div>
          <span className="po-metric-subtext">
            {stats.pendingApprovalCount} awaiting confirmation · {activeZonesCount} zones
          </span>
        </div>

        <div className="po-metric-card" onClick={() => onNavigateTab('tracking')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Deliveries in progress</span>
            <div className="po-metric-icon-wrap">
              <Truck size={15} />
            </div>
          </div>
          <div className="po-metric-val">{stats.inTransitCount}</div>
          <span className="po-metric-subtext">
            {stats.delayedCount > 0 ? `${stats.delayedCount} delayed` : 'No delayed shipments'}
          </span>
        </div>

        <div className="po-metric-card" onClick={() => onNavigateTab('reports')} style={{ cursor: 'pointer' }}>
          <div className="po-metric-top">
            <span className="po-metric-label">Completed deliveries</span>
            <div className="po-metric-icon-wrap">
              <BarChart2 size={15} />
            </div>
          </div>
          <div className="po-metric-val">{stats.completedCount}</div>
          <span className="po-metric-subtext">
            {stats.completionRate}% completion rate ({partnerCommitments.length} total)
          </span>
        </div>
      </div>

      {/* Middle Grid: Priority Attention & Fulfilment Summary */}
      <div className="po-middle-grid">
        <div className="po-panel">
          <div className="po-panel-header">
            <div className="po-panel-title-wrap">
              <h2 className="po-panel-title">Priority attention</h2>
              <span className="po-badge-pill-cream">● {priorityAttention.length} items</span>
            </div>
            <p className="po-panel-subtitle">Live records requiring partner officer review or action</p>
          </div>

          {priorityAttention.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f8faf7', borderRadius: '8px', color: '#657367', fontSize: '13px' }}>
              All partner commitments and assistance requests are currently up to date.
            </div>
          ) : (
            <div className="po-priority-list">
              {priorityAttention.map((item, idx) => (
                <div key={item.id} className="po-priority-item" onClick={item.action}>
                  <div className="po-priority-left">
                    <div className="po-priority-number">{idx + 1}</div>
                    <div>
                      <div className="po-priority-title">{item.title}</div>
                      <div className="po-priority-desc">{item.desc}</div>
                    </div>
                  </div>
                  <div className="po-priority-right">
                    <span className={`po-badge-tag-${item.tag}`}>
                      ● {item.tag} &gt;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Operational Modules & Active Zones */}
        <div className="po-panel">
          <div className="po-panel-header">
            <h2 className="po-panel-title">Operational readiness &amp; quick actions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="po-priority-item"
              style={{ width: '100%', textAlign: 'left', border: '1px solid #e2e8dd', background: '#ffffff' }}
              onClick={() => onNavigateTab('contributions')}
            >
              <div>
                <div className="po-priority-title">Manage Resource Contributions</div>
                <div className="po-priority-desc">{partnerCommitments.length} logged commitments for {partner?.acronym || 'organisation'}</div>
              </div>
              <ArrowRight size={15} color="#1e3d2c" />
            </button>

            <button
              type="button"
              className="po-priority-item"
              style={{ width: '100%', textAlign: 'left', border: '1px solid #e2e8dd', background: '#ffffff' }}
              onClick={() => onNavigateTab('requests')}
            >
              <div>
                <div className="po-priority-title">Review Assistance Requests</div>
                <div className="po-priority-desc">{stats.pendingRequestsCount} open requests awaiting support or verification</div>
              </div>
              <ArrowRight size={15} color="#1e3d2c" />
            </button>

            <button
              type="button"
              className="po-priority-item"
              style={{ width: '100%', textAlign: 'left', border: '1px solid #e2e8dd', background: '#ffffff' }}
              onClick={() => onNavigateTab('tracking')}
            >
              <div>
                <div className="po-priority-title">Update Delivery Tracking</div>
                <div className="po-priority-desc">{stats.inTransitCount} active dispatches in progress</div>
              </div>
              <ArrowRight size={15} color="#1e3d2c" />
            </button>

            <button
              type="button"
              className="po-priority-item"
              style={{ width: '100%', textAlign: 'left', border: '1px solid #e2e8dd', background: '#ffffff' }}
              onClick={() => onNavigateTab('coordination')}
            >
              <div>
                <div className="po-priority-title">Open Coordination Workspace</div>
                <div className="po-priority-desc">Review incident handoffs and log internal updates</div>
              </div>
              <ArrowRight size={15} color="#1e3d2c" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Role Access Boundary */}
      <div className="po-bottom-grid">
        <div className="po-panel">
          <div className="po-panel-header">
            <h2 className="po-panel-title">Recent activity</h2>
          </div>

          {recentActivity.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#657367', fontSize: '13px' }}>
              No recent commitment or request activity recorded.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  onClick={act.onClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    backgroundColor: '#f8faf7',
                    borderRadius: '8px',
                    border: '1px solid #edf1eb',
                    cursor: 'pointer'
                  }}
                >
                  <Clock size={14} color="#738075" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>{act.title}</div>
                    <div style={{ fontSize: '12px', color: '#657367' }}>{act.desc}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#738075', whiteSpace: 'nowrap' }}>
                    {formatDateTime(act.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="po-panel">
          <div className="po-panel-header">
            <h2 className="po-panel-title">Role access boundary</h2>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px',
              backgroundColor: '#edf2e8',
              borderRadius: '8px',
              border: '1px solid #dbe4c6'
            }}
          >
            <ShieldCheck size={18} color="#2e4d3a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#2f4033', lineHeight: 1.5 }}>
              All metrics and records are loaded live from the RELIEFCORE backend API within your authorised role scope. Sensitive citizen PII and unrelated administrative controls remain restricted.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerOfficerDashboard;

import React, { useState, useMemo } from 'react';
import { Download, BarChart2 } from 'lucide-react';
import {
  formatShortCode,
  formatDateTime,
  inferResourceCategory,
  getCommitmentStatusMeta,
  getRequestStatusLabel,
  exportToCsv
} from './partnerOfficerUtils';

export const PartnerReportsView = ({
  partner = null,
  commitments = [],
  requests = [],
  zones = [],
  loading = false
}) => {
  const [dateRange, setDateRange] = useState('all'); // all, 7d, 30d
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [scopeAllPartners, setScopeAllPartners] = useState(false);

  const uniqueZones = useMemo(() => {
    return Array.from(new Set([
      ...zones.map((z) => z.zoneCode).filter(Boolean),
      ...commitments.map((c) => c.destinationZone).filter(Boolean)
    ])).sort();
  }, [zones, commitments]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(commitments.map((c) => c.status).filter(Boolean))).sort();
  }, [commitments]);

  const isWithinDateRange = (isoDate) => {
    if (dateRange === 'all' || !isoDate) return true;
    const dt = new Date(isoDate);
    if (Number.isNaN(dt.getTime())) return true;
    const days = dateRange === '7d' ? 7 : 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return dt.getTime() >= cutoff;
  };

  const filteredCommitments = useMemo(() => {
    const base = scopeAllPartners || !partner
      ? commitments
      : commitments.filter((c) => c.partnerOrganisationId === partner.id);

    return base
      .filter((c) => {
        if (!isWithinDateRange(c.createdAt)) return false;
        if (statusFilter !== 'All' && c.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
        if (zoneFilter !== 'All' && c.destinationZone !== zoneFilter) return false;
        return true;
      })
      .map((c) => ({
        ...c,
        category: inferResourceCategory(c.item),
        meta: getCommitmentStatusMeta(c.status)
      }));
  }, [commitments, partner, scopeAllPartners, dateRange, statusFilter, zoneFilter]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => isWithinDateRange(r.createdAt));
  }, [requests, dateRange]);

  const reportMetrics = useMemo(() => {
    const total = filteredCommitments.length;
    const completed = filteredCommitments.filter((c) => c.meta.isCompleted).length;
    const delayed = filteredCommitments.filter((c) => c.meta.isDelayed).length;
    const active = filteredCommitments.filter((c) => c.meta.isActive).length;
    const totalUnits = filteredCommitments.reduce((sum, c) => sum + (Number(c.qty) || 0), 0);
    const totalValueLkr = filteredCommitments.reduce((sum, c) => sum + (Number(c.estimatedValueLkr) || 0), 0);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Group by category
    const categoryMap = new Map();
    filteredCommitments.forEach((c) => {
      const prev = categoryMap.get(c.category) || { label: c.category, count: 0, qty: 0 };
      prev.count += 1;
      prev.qty += Number(c.qty) || 0;
      categoryMap.set(c.category, prev);
    });
    const byCategory = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
    const maxCatCount = Math.max(1, ...byCategory.map((x) => x.count));

    // Group by status
    const statusMap = new Map();
    filteredCommitments.forEach((c) => {
      statusMap.set(c.status, (statusMap.get(c.status) || 0) + 1);
    });
    const byStatus = Array.from(statusMap.entries())
      .map(([label, count]) => ({
        label,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Group by district / destination zone
    const zoneMap = new Map();
    filteredCommitments.forEach((c) => {
      const z = c.destinationZone || 'Unspecified';
      const prev = zoneMap.get(z) || { zone: z, count: 0, units: 0, valueLkr: 0 };
      prev.count += 1;
      prev.units += Number(c.qty) || 0;
      prev.valueLkr += Number(c.estimatedValueLkr) || 0;
      zoneMap.set(z, prev);
    });
    const byZone = Array.from(zoneMap.values()).sort((a, b) => b.count - a.count);

    const respondedRequests = filteredRequests.filter((r) => {
      const s = getRequestStatusLabel(r.status).toLowerCase();
      return s !== 'submitted';
    }).length;

    return {
      total,
      completed,
      delayed,
      active,
      totalUnits,
      totalValueLkr,
      completionRate,
      byCategory,
      maxCatCount,
      byStatus,
      byZone,
      totalRequests: filteredRequests.length,
      respondedRequests
    };
  }, [filteredCommitments, filteredRequests]);

  const handleExportFiltered = () => {
    const headers = [
      'Contribution ID',
      'Partner',
      'Item',
      'Category',
      'Quantity',
      'Estimated Value (LKR)',
      'Destination Zone',
      'Status',
      'Logged At'
    ];
    const rows = filteredCommitments.map((c) => [
      formatShortCode(c.id, 'COM'),
      `${c.partnerName} (${c.partnerAcronym})`,
      c.item,
      c.category,
      c.qty,
      c.estimatedValueLkr,
      c.destinationZone,
      c.status,
      formatDateTime(c.createdAt)
    ]);
    exportToCsv(`Partner_Operational_Report_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="po-workspace">
      {/* Header */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>LIVE ANALYTICAL REPORTING</span>
          </div>
          <h1 className="po-title">Partner Reports</h1>
          <p className="po-subtitle">
            Real-time contribution, district allocation, request response, and delivery performance summaries.
          </p>
        </div>

        <div className="po-title-actions">
          <button
            type="button"
            className="po-btn po-btn-primary"
            onClick={handleExportFiltered}
            disabled={filteredCommitments.length === 0}
          >
            <Download size={14} />
            <span>Export Filtered CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="po-filter-bar" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className="po-filter-selects" style={{ flexWrap: 'wrap' }}>
          <select className="po-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="all">All dates</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

          <select className="po-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All statuses</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select className="po-select" value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
            <option value="All">All districts / zones</option>
            {uniqueZones.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#405044', cursor: 'pointer', padding: '0 6px' }}>
            <input
              type="checkbox"
              checked={scopeAllPartners}
              onChange={(e) => setScopeAllPartners(e.target.checked)}
            />
            <span>Include all partners</span>
          </label>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="po-metrics-grid" style={{ marginBottom: '20px' }}>
        <div className="po-metric-card">
          <div className="po-metric-top"><span className="po-metric-label">Filtered contributions</span></div>
          <div className="po-metric-val">{reportMetrics.total}</div>
          <span className="po-metric-subtext">{reportMetrics.totalUnits.toLocaleString()} total units</span>
        </div>

        <div className="po-metric-card">
          <div className="po-metric-top"><span className="po-metric-label">Delivery completion rate</span></div>
          <div className="po-metric-val">{reportMetrics.completionRate}%</div>
          <span className="po-metric-subtext">{reportMetrics.completed} delivered / completed</span>
        </div>

        <div className="po-metric-card">
          <div className="po-metric-top"><span className="po-metric-label">Delayed deliveries</span></div>
          <div className="po-metric-val">{reportMetrics.delayed}</div>
          <span className="po-metric-subtext">{reportMetrics.active} active commitments</span>
        </div>

        <div className="po-metric-card">
          <div className="po-metric-top"><span className="po-metric-label">Assistance requests</span></div>
          <div className="po-metric-val">{reportMetrics.totalRequests}</div>
          <span className="po-metric-subtext">{reportMetrics.respondedRequests} verified or in progress</span>
        </div>
      </div>

      {loading && commitments.length === 0 ? (
        <div className="po-panel" style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
          Calculating operational reports...
        </div>
      ) : filteredCommitments.length === 0 ? (
        <div className="po-panel" style={{ padding: '44px', textAlign: 'center' }}>
          <BarChart2 size={28} color="#657367" style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '0 0 6px 0', color: '#162e20', fontSize: '16px' }}>Insufficient data for selected filters</h3>
          <p style={{ margin: 0, color: '#657367', fontSize: '13px' }}>
            No commitment records match the selected date range, status, or district filter.
          </p>
        </div>
      ) : (
        <>
          <div className="po-split-layout" style={{ marginBottom: '20px' }}>
            {/* Left: Contributions by Category */}
            <div className="po-panel" style={{ padding: '24px', flex: '1 1 55%' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: '0 0 4px 0' }}>
                Contributions by Resource Category
              </h3>
              <div style={{ fontSize: '12px', color: '#657367', marginBottom: '20px' }}>
                Distribution of {reportMetrics.total} filtered contributions across relief categories
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reportMetrics.byCategory.map((cat) => {
                  const widthPct = Math.round((cat.count / reportMetrics.maxCatCount) * 100);
                  return (
                    <div key={cat.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600, color: '#162e20' }}>{cat.label}</span>
                        <span style={{ color: '#405044', fontWeight: 700 }}>
                          {cat.count} items ({cat.qty.toLocaleString()} units)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e5ece0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${widthPct}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #1e3d2c 0%, #687452 100%)',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Commitments by Status */}
            <div className="po-panel" style={{ padding: '24px', flex: '1 1 42%' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: '0 0 4px 0' }}>
                Commitments by Status
              </h3>
              <div style={{ fontSize: '12px', color: '#657367', marginBottom: '20px' }}>
                Percentage share across current lifecycle states
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reportMetrics.byStatus.map((st) => (
                  <div key={st.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 500, color: '#162e20' }}>{st.label}</span>
                      <span style={{ fontWeight: 700, color: '#162e20' }}>
                        {st.count} ({st.pct}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#e5ece0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${st.pct}%`,
                          height: '100%',
                          backgroundColor: st.label.toLowerCase() === 'delayed' ? '#dc2626' : '#1e3d2c',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* District / Zone Breakdown Table */}
          <div className="po-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: '0 0 14px 0' }}>
              Contributions by District / Sector Zone
            </h3>
            <div className="po-table-container">
              <table className="po-data-table">
                <thead>
                  <tr>
                    <th>DESTINATION ZONE</th>
                    <th>CONTRIBUTIONS</th>
                    <th>TOTAL UNITS</th>
                    <th>ESTIMATED VALUE (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportMetrics.byZone.map((z) => (
                    <tr key={z.zone}>
                      <td style={{ fontWeight: 600, color: '#162e20' }}>{z.zone}</td>
                      <td>{z.count}</td>
                      <td style={{ fontWeight: 700 }}>{z.units.toLocaleString()}</td>
                      <td>LKR {z.valueLkr.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PartnerReportsView;

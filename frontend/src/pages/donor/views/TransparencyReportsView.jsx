import React, { useState, useMemo } from 'react';
import { Download, Search, Info } from 'lucide-react';

export const TransparencyReportsView = ({
  reportData,
  campaigns = [],
  loading = false,
  onExportCsv
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const allRecords = reportData?.records || [];

  const filteredRecords = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allRecords.filter((r) => {
      const matchesSearch = !q ||
        r.id.toLowerCase().includes(q) ||
        r.donorOrg.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.allocationTarget.toLowerCase().includes(q);
      const matchesCampaign = selectedCampaign === 'All' || r.source === selectedCampaign;
      const matchesStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
      const created = new Date(r.createdAt);
      const matchesFrom = !fromDate || created >= new Date(fromDate);
      const matchesTo = !toDate || created <= new Date(`${toDate}T23:59:59`);
      return matchesSearch && matchesCampaign && matchesStatus && matchesFrom && matchesTo;
    });
  }, [allRecords, searchTerm, selectedCampaign, statusFilter, fromDate, toDate]);

  const metrics = useMemo(() => {
    const verifiedMonetary = filteredRecords
      .filter(r => r.type === 'Monetary' && (r.status === 'Verified' || r.status === 'Allocated' || r.status === 'Dispatched'))
      .reduce((sum, r) => sum + Number(r.rawValue || 0), 0);
    const pendingMonetary = filteredRecords
      .filter(r => r.type === 'Monetary' && (r.status === 'Pending' || r.status === 'Flagged'))
      .reduce((sum, r) => sum + Number(r.rawValue || 0), 0);
    const materialUnits = filteredRecords
      .filter(r => r.type === 'Material' && r.status !== 'Rejected')
      .reduce((sum, r) => sum + Number(r.rawValue || 0), 0);
    const allocatedMonetary = filteredRecords
      .filter(r => r.type === 'Monetary' && (r.status === 'Allocated' || r.status === 'Dispatched'))
      .reduce((sum, r) => sum + Number(r.rawValue || 0), 0);

    return {
      verifiedMonetary,
      pendingMonetary,
      materialUnits,
      allocatedMonetary,
      verifiedCount: filteredRecords.filter(r => r.status === 'Verified' || r.status === 'Allocated' || r.status === 'Dispatched').length,
      pendingCount: filteredRecords.filter(r => r.status === 'Pending' || r.status === 'Flagged').length,
      rejectedCount: filteredRecords.filter(r => r.status === 'Rejected').length
    };
  }, [filteredRecords]);

  return (
    <div className="fo-workspace">
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>AUDITABLE REAL-TIME REPORTING</span>
          </div>
          <h1 className="fo-title">Transparency Reports</h1>
          <p className="fo-subtitle">
            Live financial and material summaries recalculated dynamically from filtered database records.
          </p>
        </div>

        <div className="fo-title-actions">
          <button
            className="fo-btn fo-btn-secondary"
            disabled={filteredRecords.length === 0}
            onClick={() => onExportCsv && onExportCsv(filteredRecords, 'Transparency_Report')}
          >
            <Download size={14} />
            <span>Export filtered CSV ({filteredRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="fo-filter-bar" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className="fo-filter-search" style={{ minWidth: '220px' }}>
          <Search size={14} className="fo-search-icon" />
          <input
            type="text"
            placeholder="Search donor, ID, or target..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="fo-select" value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)}>
          <option value="All">All Campaigns / Operations</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.title}>{c.title}</option>
          ))}
        </select>

        <select className="fo-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Verified">Verified</option>
          <option value="Allocated">Allocated</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Pending">Pending</option>
          <option value="Flagged">Flagged</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input type="date" className="fo-select" value={fromDate} onChange={(e) => setFromDate(e.target.value)} title="From date" />
        <input type="date" className="fo-select" value={toDate} onChange={(e) => setToDate(e.target.value)} title="To date" />
      </div>

      {/* Dynamic Summary Cards */}
      <div className="fo-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '16px' }}>
        <div className="fo-metric-card">
          <span className="fo-metric-label">Verified Monetary</span>
          <div className="fo-metric-val">LKR {metrics.verifiedMonetary.toLocaleString()}</div>
          <span className="fo-metric-subtext">{metrics.verifiedCount} verified records</span>
        </div>
        <div className="fo-metric-card">
          <span className="fo-metric-label">Pending / Flagged</span>
          <div className="fo-metric-val">LKR {metrics.pendingMonetary.toLocaleString()}</div>
          <span className="fo-metric-subtext">{metrics.pendingCount} pending · {metrics.rejectedCount} rejected</span>
        </div>
        <div className="fo-metric-card">
          <span className="fo-metric-label">Material Units</span>
          <div className="fo-metric-val">{metrics.materialUnits.toLocaleString()}</div>
          <span className="fo-metric-subtext">Non-rejected supply units</span>
        </div>
        <div className="fo-metric-card">
          <span className="fo-metric-label">Allocated / Dispatched</span>
          <div className="fo-metric-val">LKR {metrics.allocatedMonetary.toLocaleString()}</div>
          <span className="fo-metric-subtext">Committed to operations</span>
        </div>
      </div>

      {reportData && !reportData.hasExpenditureTracking && (
        <div className="fo-panel" style={{ padding: '10px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
          <Info size={15} color="#0e6f76" />
          <span>{reportData.expenditureTrackingNote}</span>
        </div>
      )}

      {/* Campaign Progress Summary + Filtered Records Table */}
      <div className="fo-split-layout">
        <div className="fo-panel" style={{ flex: '1 1 38%', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', color: '#162e20' }}>Campaign Progress Summary</h3>
          {campaigns.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#657367' }}>No active campaigns found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {campaigns.map((c) => (
                <div key={c.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
                    <span>{c.title}</span>
                    <span>{c.percentFunded}%</span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${c.percentFunded}%`, height: '100%', backgroundColor: '#0e6f76' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#657367', marginTop: '2px' }}>
                    LKR {Number(c.raisedAmount || 0).toLocaleString()} / LKR {Number(c.targetAmount || 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="fo-panel fo-table-panel" style={{ flex: '1 1 62%' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>Loading report dataset...</div>
          ) : filteredRecords.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
              No records match the selected report filters.
            </div>
          ) : (
            <div className="fo-table-wrap">
              <table className="fo-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DONOR</th>
                    <th>CAMPAIGN / SOURCE</th>
                    <th>TYPE</th>
                    <th>VALUE</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => (
                    <tr key={r.id}>
                      <td><strong style={{ color: '#0e6f76' }}>{r.id}</strong></td>
                      <td>{r.donorOrg}</td>
                      <td>{r.source}</td>
                      <td>{r.type}</td>
                      <td><strong>{r.recordedValue}</strong></td>
                      <td>{r.status}</td>
                      <td style={{ fontSize: '12px', color: '#657367' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransparencyReportsView;

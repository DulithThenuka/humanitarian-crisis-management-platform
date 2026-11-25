import React, { useState } from 'react';
import { 
  Search, 
  Receipt, 
  Plus, 
  Download, 
  CheckCircle, 
  Clock, 
  Package, 
  DollarSign,
  Filter,
  ArrowUpRight
} from 'lucide-react';

export const DonationRecordsView = ({
  records = [],
  selectedRecordId,
  setSelectedRecordId,
  onOpenCreateRecordModal,
  onOpenApprovalModal,
  onOpenReceiptModal,
  onExportReport,
  onSaveNote,
  onClarifyRecord,
  onEscalateRecord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const displayRecords = records || [];

  const monetaryTotal = displayRecords
    .filter(r => r.type === 'Monetary')
    .reduce((sum, r) => sum + (r.rawValue || 0), 0);

  const materialTotal = displayRecords
    .filter(r => r.type === 'Material')
    .reduce((sum, r) => sum + (r.rawValue || 0), 0);

  const verifiedCount = displayRecords.filter(r => r.verification === 'Verified').length;
  const pendingCount = displayRecords.filter(r => r.verification !== 'Verified').length;

  const filteredRecords = displayRecords.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      (r.id && r.id.toLowerCase().includes(q)) ||
      (r.donorOrg && r.donorOrg.toLowerCase().includes(q)) ||
      (r.source && r.source.toLowerCase().includes(q)) ||
      (r.category && r.category.toLowerCase().includes(q)) ||
      (r.operationalArea && r.operationalArea.toLowerCase().includes(q));

    const matchesType = typeFilter === 'All' || 
      (r.type && r.type.toLowerCase() === typeFilter.toLowerCase());

    const matchesStatus = statusFilter === 'All' || 
      (r.status && r.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>HUMANAID FINANCIAL & MATERIAL LEDGER · LIVE RECORDS</span>
          </div>
          <h1 className="fo-title">Donation Records</h1>
          <p className="fo-subtitle">
            Verified ledger of all citizen, corporate, and multilateral donations. Tracks monetary inflows, material consignments, and audit trail receipts.
          </p>
        </div>

        <div className="fo-title-actions">
          <button 
            className="fo-btn fo-btn-secondary"
            onClick={onExportReport}
          >
            <Download size={14} />
            <span>Export Ledger CSV</span>
          </button>
          <button 
            className="fo-btn fo-btn-primary"
            onClick={onOpenCreateRecordModal}
          >
            <Plus size={14} />
            <span>Record Donation Pledge</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Telemetry Cards */}
      <div className="fo-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
        <div className="fo-metric-card">
          <div className="fo-metric-top">
            <span className="fo-metric-label">Total Monetary Inflow</span>
            <div className="fo-metric-icon-wrap">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="fo-metric-val">
            LKR {monetaryTotal >= 1_000_000 ? `${(monetaryTotal / 1_000_000).toFixed(2)}m` : monetaryTotal.toLocaleString()}
          </div>
          <span className="fo-metric-subtext">Verified & pending grant total</span>
        </div>

        <div className="fo-metric-card">
          <div className="fo-metric-top">
            <span className="fo-metric-label">Material Supplies</span>
            <div className="fo-metric-icon-wrap">
              <Package size={15} />
            </div>
          </div>
          <div className="fo-metric-val">{materialTotal.toLocaleString()} units</div>
          <span className="fo-metric-subtext">Total recorded warehouse intake</span>
        </div>

        <div className="fo-metric-card">
          <div className="fo-metric-top">
            <span className="fo-metric-label">Verified & Cleared</span>
            <div className="fo-metric-icon-wrap" style={{ backgroundColor: '#edf2e6', color: '#2d5a3e' }}>
              <CheckCircle size={15} />
            </div>
          </div>
          <div className="fo-metric-val" style={{ color: '#2d5a3e' }}>{verifiedCount}</div>
          <span className="fo-metric-subtext">Passed audit compliance</span>
        </div>

        <div className="fo-metric-card">
          <div className="fo-metric-top">
            <span className="fo-metric-label">Pending Verification</span>
            <div className="fo-metric-icon-wrap" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
              <Clock size={15} />
            </div>
          </div>
          <div className="fo-metric-val" style={{ color: pendingCount > 0 ? '#d97706' : '#162e20' }}>
            {pendingCount}
          </div>
          <span className="fo-metric-subtext">Awaiting officer determination</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fo-filter-bar">
        <div className="fo-filter-search">
          <Search size={14} className="fo-search-icon" />
          <input
            type="text"
            placeholder="Search by donor name, record code, sector, district..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fo-filter-selects">
          <select 
            className="fo-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Monetary">Monetary Grants</option>
            <option value="Material">Material Supplies</option>
          </select>

          <select 
            className="fo-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Allocated">Allocated</option>
            <option value="Review">Under Review</option>
            <option value="Completed">Completed</option>
            <option value="Dispatched">Dispatched</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="fo-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="fo-data-table">
          <thead>
            <tr>
              <th>RECORD ID</th>
              <th>DONOR ENTITY</th>
              <th>TYPE</th>
              <th>RECORDED VALUE</th>
              <th>SECTOR / CATEGORY</th>
              <th>TARGET DISTRICT</th>
              <th>VERIFICATION</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#657367' }}>
                  No donation records match the selected filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="fo-cell-record-id">{item.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#162e20' }}>{item.donorOrg || item.source}</div>
                    <div style={{ fontSize: '11px', color: '#657367' }}>{item.email || 'donor@reliefcore.lk'}</div>
                  </td>
                  <td>
                    <span className={`fo-type-pill ${item.type?.toLowerCase()}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: item.type === 'Monetary' ? '#2d5a3e' : '#1e40af' }}>
                      {item.recordedValue}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px' }}>{item.category || 'General Relief'}</td>
                  <td style={{ fontSize: '12px' }}>{item.operationalArea || 'Western Province'}</td>
                  <td>
                    <span className={`fo-verify-badge ${item.verification?.toLowerCase()}`}>
                      {item.verification === 'Verified' ? '● Verified' : '○ Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`fo-status-badge ${item.statusBadge || item.status?.toLowerCase()}`}>
                      ● {item.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        className="fo-btn fo-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        title="View Official Receipt"
                        onClick={() => onOpenReceiptModal && onOpenReceiptModal(item)}
                      >
                        <Receipt size={12} />
                        <span>Receipt</span>
                      </button>
                      <button 
                        className="fo-btn fo-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        title="Review / Co-sign"
                        onClick={() => onOpenApprovalModal && onOpenApprovalModal(item)}
                      >
                        <span>Review</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationRecordsView;

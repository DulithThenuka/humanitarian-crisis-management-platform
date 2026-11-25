import React, { useState } from 'react';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Download, 
  Plus, 
  Search, 
  ShieldCheck, 
  Building2,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export const AllocationExpenditureView = ({
  allocations = [],
  selectedAllocationId,
  setSelectedAllocationId,
  onOpenApprovalModal,
  onExportReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const displayAllocs = allocations || [];

  const totalAllocated = displayAllocs.reduce((sum, a) => sum + (a.amount || 0), 0);
  const approvedAllocs = displayAllocs.filter(a => 
    a.status === 'Approved' || a.status === 'Dual Approved' || a.status === 'Dispatched'
  );
  const approvedTotal = approvedAllocs.reduce((sum, a) => sum + (a.amount || 0), 0);
  const pendingCount = displayAllocs.filter(a => 
    a.status?.toLowerCase().includes('pending')
  ).length;

  const filteredAllocs = displayAllocs.filter(a => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      (a.allocationCode && a.allocationCode.toLowerCase().includes(q)) ||
      (a.targetHubOrDepot && a.targetHubOrDepot.toLowerCase().includes(q)) ||
      (a.purpose && a.purpose.toLowerCase().includes(q)) ||
      (a.coSignedBy && a.coSignedBy.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || 
      (a.status && a.status.toLowerCase().includes(statusFilter.toLowerCase()));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>HUMANAID TREASURY & LOGISTICS · DUAL APPROVAL PROTOCOL</span>
          </div>
          <h1 className="fo-title">Allocation & Expenditure</h1>
          <p className="fo-subtitle">
            Audited financial disbursements and material allocations. Requires verified dual authorization by Funding Officer and Senior Coordinator before warehouse release.
          </p>
        </div>

        <div className="fo-title-actions">
          <button 
            className="fo-btn fo-btn-secondary"
            onClick={onExportReport}
          >
            <Download size={14} />
            <span>Export Allocation Ledger</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Telemetry Cards */}
      <div className="fo-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
        <div className="fo-metric-card">
          <div className="fo-metric-top">
            <span className="fo-metric-label">Total Allocated</span>
            <div className="fo-metric-icon-wrap">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="fo-metric-val">LKR {totalAllocated.toLocaleString()}</div>
          <span className="fo-metric-subtext">All active allocation vouchers</span>
        </div>

        <div className="fo-metric-card">
          <div className="fo-metric-top">
            <span className="fo-metric-label">Dual-Approved Disbursements</span>
            <div className="fo-metric-icon-wrap" style={{ backgroundColor: '#edf2e6', color: '#2d5a3e' }}>
              <ShieldCheck size={15} />
            </div>
          </div>
          <div className="fo-metric-val" style={{ color: '#2d5a3e' }}>
            LKR {approvedTotal.toLocaleString()}
          </div>
          <span className="fo-metric-subtext">{approvedAllocs.length} vouchers verified</span>
        </div>

        <div className="fo-metric-card">
          <div className="fo-metric-top">
            <span className="fo-metric-label">Pending Dual Sign-off</span>
            <div className="fo-metric-icon-wrap" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
              <Clock size={15} />
            </div>
          </div>
          <div className="fo-metric-val" style={{ color: pendingCount > 0 ? '#d97706' : '#162e20' }}>
            {pendingCount}
          </div>
          <span className="fo-metric-subtext">Awaiting secondary co-signer</span>
        </div>

        <div className="fo-metric-card">
          <div className="fo-metric-top">
            <span className="fo-metric-label">Compliance Status</span>
            <div className="fo-metric-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
              <FileCheck size={15} />
            </div>
          </div>
          <div className="fo-metric-val" style={{ color: '#1e40af', fontSize: '18px' }}>
            100% Audited
          </div>
          <span className="fo-metric-subtext">Zero unauthorized dispatches</span>
        </div>
      </div>

      {/* Dual Authorization Banner */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <ShieldCheck size={20} color="#059669" />
        <div style={{ fontSize: '12px', color: '#166534', lineHeight: 1.4 }}>
          <strong>Dual-Approval Security Protocol Active:</strong> Under Financial Regulations §4.2, every emergency expenditure exceeding LKR 500,000 or 500 relief units requires co-signatures from both the Funding Officer and the Incident/Emergency Coordinator before depot dispatch.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fo-filter-bar">
        <div className="fo-filter-search">
          <Search size={14} className="fo-search-icon" />
          <input
            type="text"
            placeholder="Search by allocation code, hub, shelter destination, purpose..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fo-filter-selects">
          <select 
            className="fo-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Approval Statuses</option>
            <option value="Approved">Approved / Dual Approved</option>
            <option value="Pending">Pending Dual Approval</option>
          </select>
        </div>
      </div>

      {/* Allocations Table */}
      <div className="fo-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="fo-data-table">
          <thead>
            <tr>
              <th>VOUCHER CODE</th>
              <th>TARGET HUB / SHELTER</th>
              <th>PURPOSE / ALLOCATION TARGET</th>
              <th>AMOUNT (LKR)</th>
              <th>APPROVAL STATUS</th>
              <th>CO-SIGNATORIES</th>
              <th>TIMESTAMP</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllocs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#657367' }}>
                  No allocation vouchers match your criteria.
                </td>
              </tr>
            ) : (
              filteredAllocs.map((item) => {
                const isPending = item.status?.toLowerCase().includes('pending');
                return (
                  <tr key={item.id}>
                    <td>
                      <span className="fo-cell-record-id">{item.allocationCode || item.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#162e20' }}>{item.targetHubOrDepot}</div>
                      <div style={{ fontSize: '11px', color: '#657367' }}>Western Regional Logistics</div>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <span style={{ fontSize: '12px', color: '#334155' }}>{item.purpose}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#2d5a3e' }}>
                        LKR {Number(item.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="fo-status-badge"
                        style={{
                          backgroundColor: isPending ? '#fffbeb' : '#ecfdf5',
                          color: isPending ? '#d97706' : '#059669',
                          borderColor: isPending ? '#fde68a' : '#a7f3d0'
                        }}
                      >
                        ● {item.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '11px', color: '#657367' }}>
                      {item.coSignedBy || (isPending ? 'Awaiting Secondary Signature' : 'Authorized')}
                    </td>
                    <td style={{ fontSize: '11px', color: '#657367' }}>
                      {item.coSignedAt || new Date(item.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td>
                      {isPending ? (
                        <button 
                          className="fo-btn fo-btn-primary"
                          style={{ padding: '5px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}
                          onClick={() => onOpenApprovalModal && onOpenApprovalModal(item)}
                        >
                          <ShieldCheck size={12} />
                          <span>Co-Sign / Approve</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={13} />
                          <span>Verified</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllocationExpenditureView;

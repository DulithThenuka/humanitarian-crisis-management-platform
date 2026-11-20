import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Info, CheckCircle2, Plus } from 'lucide-react';

export const AllocationExpenditureView = ({
  allocationOverview,
  allocations = [],
  verifiedPendingRecords = [],
  selectedAllocationId,
  setSelectedAllocationId,
  loading = false,
  globalSearch = '',
  onCreateAllocation,
  onOpenApprovalModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sourceRef, setSourceRef] = useState('');
  const [targetHub, setTargetHub] = useState('');
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const effectiveSearch = (searchTerm || globalSearch).trim().toLowerCase();

  const filteredAllocations = allocations.filter((a) => {
    const matchesSearch = !effectiveSearch ||
      (a.allocationCode || '').toLowerCase().includes(effectiveSearch) ||
      (a.sourceReference || '').toLowerCase().includes(effectiveSearch) ||
      (a.targetHubOrDepot || '').toLowerCase().includes(effectiveSearch) ||
      (a.purpose || '').toLowerCase().includes(effectiveSearch);
    const matchesStatus = statusFilter === 'All' || (a.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (filteredAllocations.length > 0 && !filteredAllocations.some(a => a.id === selectedAllocationId)) {
      setSelectedAllocationId(filteredAllocations[0].id);
    }
  }, [filteredAllocations, selectedAllocationId, setSelectedAllocationId]);

  const selectedAllocation = filteredAllocations.find(a => a.id === selectedAllocationId) || filteredAllocations[0] || null;

  const ov = allocationOverview || {
    totalVerifiedMonetary: 0,
    totalAllocatedMonetary: 0,
    availableUnallocatedMonetary: 0,
    totalDispatchedMonetary: 0,
    hasExpenditureTracking: false,
    expenditureTrackingNote: 'Monetary expenditure tracking table is not yet present in the shared database schema; displaying verified receipts, allocations, and material dispatches.'
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const numericAmt = Number(amount);
    if (!sourceRef || !targetHub.trim() || !purpose.trim() || numericAmt <= 0) {
      alert('Please select a verified source donation and fill in destination, purpose, and amount.');
      return;
    }
    if (numericAmt > ov.availableUnallocatedMonetary) {
      alert(`Over-allocation prevented: LKR ${numericAmt.toLocaleString()} exceeds available verified unallocated balance (LKR ${ov.availableUnallocatedMonetary.toLocaleString()}).`);
      return;
    }
    setSubmitting(true);
    try {
      await onCreateAllocation({
        sourceReference: sourceRef,
        targetHubOrDepot: targetHub.trim(),
        purpose: purpose.trim(),
        amount: numericAmt,
        currency: 'LKR',
        authorizedNote: 'Allocated via Funding Officer workspace'
      });
      setSourceRef('');
      setTargetHub('');
      setPurpose('');
      setAmount('');
      setShowCreateForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fo-workspace">
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>VERIFIED BALANCE & DISBURSEMENT CONTROL</span>
          </div>
          <h1 className="fo-title">Allocation & Expenditure</h1>
          <p className="fo-subtitle">
            Allocate verified funds and supplies to crisis hubs without exceeding verified available balances.
          </p>
        </div>

        <div className="fo-title-actions">
          <button className="fo-btn fo-btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus size={14} />
            <span>{showCreateForm ? 'Cancel' : 'Allocate Verified Funds'}</span>
          </button>
        </div>
      </div>

      {/* Balance Summary Cards */}
      <div className="fo-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '14px' }}>
        <div className="fo-metric-card">
          <span className="fo-metric-label">Total Verified Monetary</span>
          <div className="fo-metric-val">LKR {Number(ov.totalVerifiedMonetary || 0).toLocaleString()}</div>
          <span className="fo-metric-subtext">Cleared for allocation</span>
        </div>
        <div className="fo-metric-card">
          <span className="fo-metric-label">Total Allocated</span>
          <div className="fo-metric-val">LKR {Number(ov.totalAllocatedMonetary || 0).toLocaleString()}</div>
          <span className="fo-metric-subtext">Committed to hubs</span>
        </div>
        <div className="fo-metric-card">
          <span className="fo-metric-label">Available Unallocated</span>
          <div className="fo-metric-val" style={{ color: '#0f766e' }}>
            LKR {Number(ov.availableUnallocatedMonetary || 0).toLocaleString()}
          </div>
          <span className="fo-metric-subtext">Remaining verified balance</span>
        </div>
        <div className="fo-metric-card">
          <span className="fo-metric-label">Dispatched Value</span>
          <div className="fo-metric-val">LKR {Number(ov.totalDispatchedMonetary || 0).toLocaleString()}</div>
          <span className="fo-metric-subtext">Released to operations</span>
        </div>
      </div>

      {/* Honest Expenditure Schema Note */}
      {!ov.hasExpenditureTracking && (
        <div
          className="fo-panel"
          style={{
            padding: '10px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#f8fafc',
            fontSize: '12px',
            color: '#475569'
          }}
        >
          <Info size={15} color="#0e6f76" />
          <span>{ov.expenditureTrackingNote}</span>
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateSubmit} className="fo-panel" style={{ padding: '18px', marginBottom: '18px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#162e20' }}>
            Allocate Verified Donation (Available: LKR {Number(ov.availableUnallocatedMonetary || 0).toLocaleString()})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <select
              required
              className="fo-select"
              value={sourceRef}
              onChange={(e) => {
                setSourceRef(e.target.value);
                const match = verifiedPendingRecords.find(r => r.id === e.target.value);
                if (match && match.rawValue) setAmount(String(match.rawValue));
              }}
            >
              <option value="">Select Verified Donation...</option>
              {verifiedPendingRecords.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} · {r.donorOrg} ({r.recordedValue})
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="Destination Hub / Request (e.g. RES-021)"
              className="fo-search-input"
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px' }}
              value={targetHub}
              onChange={(e) => setTargetHub(e.target.value)}
            />
            <input
              type="text"
              required
              placeholder="Allocation Purpose"
              className="fo-search-input"
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px' }}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
            <input
              type="number"
              required
              min={1}
              placeholder="Amount (LKR)"
              className="fo-search-input"
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px' }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="fo-btn fo-btn-primary" disabled={submitting}>
              {submitting ? 'Allocating...' : 'Confirm Allocation'}
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="fo-filter-bar">
        <div className="fo-filter-search">
          <Search size={14} className="fo-search-icon" />
          <input
            type="text"
            placeholder="Search allocation code, source, destination hub, or purpose..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fo-filter-selects">
          <select className="fo-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending Dual Approval">Pending Dual Approval</option>
            <option value="Approved">Approved</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="fo-split-layout">
        <div className="fo-panel fo-table-panel" style={{ flex: '1 1 62%' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>Loading allocations...</div>
          ) : filteredAllocations.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>No allocations match the current filters.</div>
          ) : (
            <div className="fo-table-wrap">
              <table className="fo-table">
                <thead>
                  <tr>
                    <th>ALLOCATION</th>
                    <th>SOURCE REFERENCE</th>
                    <th>DESTINATION HUB</th>
                    <th>AMOUNT / QTY</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAllocations.map((alloc) => (
                    <tr
                      key={alloc.id}
                      className={selectedAllocation?.id === alloc.id ? 'selected' : ''}
                      onClick={() => setSelectedAllocationId(alloc.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td><strong style={{ color: '#0e6f76' }}>{alloc.allocationCode}</strong></td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#162e20' }}>{alloc.sourceReference}</div>
                        <div style={{ fontSize: '11px', color: '#657367' }}>{alloc.purpose}</div>
                      </td>
                      <td>{alloc.targetHubOrDepot}</td>
                      <td><strong>{alloc.currency} {Number(alloc.amount || 0).toLocaleString()}</strong></td>
                      <td>
                        <span
                          className="fo-status-pill"
                          style={{
                            color: alloc.status === 'Dispatched' || alloc.status === 'Delivered' ? '#1e40af' : alloc.status === 'Approved' ? '#0f766e' : '#b45309',
                            backgroundColor: alloc.status === 'Dispatched' || alloc.status === 'Delivered' ? '#eff6ff' : alloc.status === 'Approved' ? '#f0fdfa' : '#fffbeb'
                          }}
                        >
                          {alloc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Dual-Approval & Dispatch Control */}
        <div className="fo-panel fo-detail-panel" style={{ flex: '1 1 38%', padding: '20px' }}>
          {!selectedAllocation ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#657367' }}>
              Select an allocation record to inspect co-signature status and disburse.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0e6f76' }}>{selectedAllocation.allocationCode}</span>
                  <h3 style={{ margin: '2px 0', fontSize: '16px', color: '#162e20' }}>{selectedAllocation.targetHubOrDepot}</h3>
                  <div style={{ fontSize: '12px', color: '#657367' }}>Source: {selectedAllocation.sourceReference}</div>
                </div>
                <span className="fo-status-pill">{selectedAllocation.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f8faf8', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#657367' }}>Allocated Value</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#162e20' }}>
                    {selectedAllocation.currency} {Number(selectedAllocation.amount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#657367' }}>Dispatched</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f766e' }}>
                    {selectedAllocation.currency} {Number(selectedAllocation.utilizedAmount || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12.5px', color: '#334155', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>Purpose:</strong> {selectedAllocation.purpose}
                {selectedAllocation.coSignedBy && (
                  <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#0f766e' }}>
                    <ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    Co-signed by {selectedAllocation.coSignedBy} ({selectedAllocation.coSignedAt})
                  </div>
                )}
              </div>

              {(selectedAllocation.status === 'Pending Dual Approval' || selectedAllocation.status === 'Approved') && (
                <button
                  className="fo-btn fo-btn-primary"
                  onClick={() => onOpenApprovalModal && onOpenApprovalModal(selectedAllocation)}
                >
                  <CheckCircle2 size={14} />
                  <span>
                    {selectedAllocation.status === 'Pending Dual Approval'
                      ? 'Dual-Approve & Allocate'
                      : 'Co-Sign & Mark Dispatched'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllocationExpenditureView;

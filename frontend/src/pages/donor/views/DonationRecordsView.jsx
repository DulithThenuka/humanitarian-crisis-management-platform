import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle2, AlertTriangle, XCircle, FileText, Truck, Send } from 'lucide-react';

export const DonationRecordsView = ({
  records = [],
  selectedRecordId,
  setSelectedRecordId,
  loading = false,
  globalSearch = '',
  onOpenCreateRecordModal,
  onOpenReceiptModal,
  onProcessDecision,
  onExportCsv
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [decisionNote, setDecisionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const effectiveSearch = (searchTerm || globalSearch).trim().toLowerCase();

  const filteredRecords = records.filter((r) => {
    const matchesSearch = !effectiveSearch ||
      r.id.toLowerCase().includes(effectiveSearch) ||
      r.donorOrg.toLowerCase().includes(effectiveSearch) ||
      r.source.toLowerCase().includes(effectiveSearch) ||
      r.allocationTarget.toLowerCase().includes(effectiveSearch);
    const matchesType = typeFilter === 'All' || r.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  useEffect(() => {
    if (filteredRecords.length > 0 && !filteredRecords.some(r => r.id === selectedRecordId)) {
      setSelectedRecordId(filteredRecords[0].id);
    }
  }, [filteredRecords, selectedRecordId, setSelectedRecordId]);

  const selectedRecord = filteredRecords.find(r => r.id === selectedRecordId) || filteredRecords[0] || null;

  const handleAction = async (action, label, requireReason = false) => {
    if (!selectedRecord || !onProcessDecision) return;
    const reason = decisionNote.trim();
    if (requireReason && !reason) {
      alert(`Please enter a decision reason before choosing "${label}".`);
      return;
    }
    if (!window.confirm(`Confirm "${label}" for donation ${selectedRecord.id} (${selectedRecord.donorOrg})?`)) {
      return;
    }
    setSubmitting(true);
    try {
      await onProcessDecision(selectedRecord.id, {
        action,
        decisionReason: reason || `${label} recorded by Funding Officer`,
        note: reason || undefined
      });
      setDecisionNote('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fo-workspace">
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>DONATION INTAKE & VERIFICATION LEDGER</span>
          </div>
          <h1 className="fo-title">Donation Records</h1>
          <p className="fo-subtitle">
            Manage individual monetary and material contributions, verification workflow, and allocation readiness.
          </p>
        </div>

        <div className="fo-title-actions">
          <button
            className="fo-btn fo-btn-secondary"
            onClick={() => onExportCsv && onExportCsv(filteredRecords, 'Donation_Records')}
          >
            <Download size={14} />
            <span>Export filtered CSV</span>
          </button>
          <button className="fo-btn fo-btn-primary" onClick={onOpenCreateRecordModal}>
            <span>+ Record donation</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fo-filter-bar">
        <div className="fo-filter-search">
          <Search size={14} className="fo-search-icon" />
          <input
            type="text"
            placeholder="Search donation ID, donor, campaign, or allocation..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fo-filter-selects">
          <select className="fo-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Monetary">Monetary</option>
            <option value="Material">Material</option>
          </select>

          <select className="fo-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Flagged">Flagged</option>
            <option value="Verified">Verified</option>
            <option value="Allocated">Allocated</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="fo-split-layout">
        {/* Left: Transactions Table */}
        <div className="fo-panel fo-table-panel" style={{ flex: '1 1 62%' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>Loading donation records...</div>
          ) : filteredRecords.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
              No donation records match the selected filters.
            </div>
          ) : (
            <div className="fo-table-wrap">
              <table className="fo-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DONOR / CAMPAIGN</th>
                    <th>TYPE</th>
                    <th>VALUE / QTY</th>
                    <th>VERIFICATION</th>
                    <th>ALLOCATION</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((item) => (
                    <tr
                      key={item.id}
                      className={selectedRecord?.id === item.id ? 'selected' : ''}
                      onClick={() => setSelectedRecordId(item.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td><strong style={{ color: '#0e6f76' }}>{item.id}</strong></td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#162e20' }}>{item.donorOrg}</div>
                        <div style={{ fontSize: '11px', color: '#657367' }}>{item.source}</div>
                      </td>
                      <td>{item.type}</td>
                      <td><strong>{item.recordedValue}</strong></td>
                      <td>{item.verification}</td>
                      <td style={{ fontSize: '12px' }}>{item.allocation}</td>
                      <td>
                        <span
                          className="fo-status-pill"
                          style={{
                            color: item.statusColor,
                            backgroundColor: item.statusBg,
                            border: `1px solid ${item.statusBorder}`
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Status-Driven Detail & Action Panel */}
        <div className="fo-panel fo-detail-panel" style={{ flex: '1 1 38%', padding: '20px' }}>
          {!selectedRecord ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#657367' }}>
              Select a donation record to view details and perform status-driven actions.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0e6f76' }}>{selectedRecord.id}</div>
                  <h3 style={{ margin: '2px 0', fontSize: '17px', color: '#162e20' }}>{selectedRecord.donorOrg}</h3>
                  <div style={{ fontSize: '12px', color: '#657367' }}>
                    Campaign: {selectedRecord.source} · {new Date(selectedRecord.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className="fo-status-pill"
                  style={{
                    color: selectedRecord.statusColor,
                    backgroundColor: selectedRecord.statusBg
                  }}
                >
                  {selectedRecord.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f8faf8', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#657367' }}>Type & Value</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                    {selectedRecord.type} · {selectedRecord.recordedValue}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#657367' }}>Verification</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                    {selectedRecord.verification} ({selectedRecord.verifiedBy})
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#657367' }}>Target Area</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#162e20' }}>
                    {selectedRecord.allocationTarget}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#657367' }}>Category</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#162e20' }}>
                    {selectedRecord.category}
                  </div>
                </div>
              </div>

              {selectedRecord.notes && (
                <div style={{ fontSize: '12px', color: '#334155', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <strong>Notes:</strong> {selectedRecord.notes}
                </div>
              )}

              {/* Status-driven Decision Controls */}
              <div style={{ borderTop: '1px solid #e5ebe2', paddingTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  OFFICER AUDIT NOTE / DECISION REASON
                </label>
                <textarea
                  rows={2}
                  className="fo-textarea"
                  placeholder="Enter verification note, allocation target, or rejection reason..."
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px' }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(selectedRecord.status === 'Pending' || selectedRecord.status === 'Flagged') && (
                    <>
                      <button
                        className="fo-btn fo-btn-primary"
                        disabled={submitting}
                        onClick={() => handleAction('verify', 'Verify Donation', false)}
                      >
                        <CheckCircle2 size={14} />
                        <span>Verify & Clear Donation</span>
                      </button>
                      <button
                        className="fo-btn fo-btn-secondary"
                        disabled={submitting}
                        onClick={() => handleAction('request-clarification', 'Flag / Request Clarification', true)}
                      >
                        <AlertTriangle size={14} />
                        <span>Flag for Clarification</span>
                      </button>
                      <button
                        className="fo-btn fo-btn-secondary"
                        style={{ borderColor: '#fca5a5', color: '#dc2626' }}
                        disabled={submitting}
                        onClick={() => handleAction('reject', 'Reject Donation', true)}
                      >
                        <XCircle size={14} />
                        <span>Reject (Requires Reason)</span>
                      </button>
                    </>
                  )}

                  {selectedRecord.status === 'Verified' && (
                    <button
                      className="fo-btn fo-btn-primary"
                      disabled={submitting}
                      onClick={() => handleAction('allocate', 'Allocate Verified Funds', false)}
                    >
                      <Send size={14} />
                      <span>Allocate to Relief Operation</span>
                    </button>
                  )}

                  {selectedRecord.status === 'Allocated' && (
                    <button
                      className="fo-btn fo-btn-primary"
                      disabled={submitting}
                      onClick={() => handleAction('dispatch', 'Mark Dispatched', false)}
                    >
                      <Truck size={14} />
                      <span>Mark Dispatched to Hub</span>
                    </button>
                  )}

                  {(selectedRecord.status === 'Verified' || selectedRecord.status === 'Allocated' || selectedRecord.status === 'Dispatched') && (
                    <button
                      className="fo-btn fo-btn-secondary"
                      onClick={() => onOpenReceiptModal && onOpenReceiptModal(selectedRecord)}
                    >
                      <FileText size={14} />
                      <span>View Verified Tax Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationRecordsView;

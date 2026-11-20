import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, AlertTriangle, CheckCircle2, History } from 'lucide-react';

export const DonorManagementView = ({
  donorProfiles = [],
  loading = false,
  globalSearch = '',
  onUpdateDonorVerification,
  onOpenCreateRecordModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [auditNote, setAuditNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const effectiveSearch = (searchTerm || globalSearch).trim().toLowerCase();

  const filteredDonors = donorProfiles.filter((d) => {
    const matchesSearch = !effectiveSearch ||
      d.donorId.toLowerCase().includes(effectiveSearch) ||
      d.donorName.toLowerCase().includes(effectiveSearch) ||
      d.donorType.toLowerCase().includes(effectiveSearch) ||
      d.operationalArea.toLowerCase().includes(effectiveSearch);
    const matchesType = typeFilter === 'All' || d.donorType.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || d.verificationStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  useEffect(() => {
    if (filteredDonors.length > 0 && !filteredDonors.some(d => d.donorId === selectedDonorId)) {
      setSelectedDonorId(filteredDonors[0].donorId);
    }
  }, [filteredDonors, selectedDonorId]);

  const selectedDonor = filteredDonors.find(d => d.donorId === selectedDonorId) || filteredDonors[0] || null;

  const handleVerificationAction = async (newStatus) => {
    if (!selectedDonor || !onUpdateDonorVerification) return;
    if (!auditNote.trim()) {
      alert('Please enter an authorised audit note before updating donor verification.');
      return;
    }
    if (!window.confirm(`Confirm setting donor "${selectedDonor.donorName}" verification status to ${newStatus}?`)) {
      return;
    }
    setSubmitting(true);
    try {
      await onUpdateDonorVerification(selectedDonor.donorId, newStatus, auditNote.trim());
      setAuditNote('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fo-workspace">
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>DONOR DIRECTORY · ROLE-SCOPED PROFILES</span>
          </div>
          <h1 className="fo-title">Donor Management</h1>
          <p className="fo-subtitle">
            Review verified donor profiles, contribution totals, and per-donor donation history. Payment credentials are excluded.
          </p>
        </div>

        <div className="fo-title-actions">
          <button className="fo-btn fo-btn-primary" onClick={onOpenCreateRecordModal}>
            <span>+ Record Contribution</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fo-filter-bar">
        <div className="fo-filter-search">
          <Search size={14} className="fo-search-icon" />
          <input
            type="text"
            placeholder="Search donor ID, name, type, or operational area..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fo-filter-selects">
          <select className="fo-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Donor Types</option>
            <option value="Individual">Individual</option>
            <option value="Corporate">Corporate</option>
            <option value="Institutional">Institutional</option>
            <option value="NGO / Foundation">NGO / Foundation</option>
          </select>

          <select className="fo-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Verification Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="fo-split-layout">
        {/* Left: Donor Directory Table */}
        <div className="fo-panel fo-table-panel" style={{ flex: '1 1 62%' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>Loading donor profiles...</div>
          ) : filteredDonors.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
              No donor profiles match the current filters.
            </div>
          ) : (
            <div className="fo-table-wrap">
              <table className="fo-table">
                <thead>
                  <tr>
                    <th>DONOR ID</th>
                    <th>DONOR / ORGANISATION</th>
                    <th>TYPE</th>
                    <th>STATUS</th>
                    <th>TOTAL MONETARY</th>
                    <th>DONATIONS</th>
                    <th>LATEST DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonors.map((donor) => (
                    <tr
                      key={donor.donorId}
                      className={selectedDonor?.donorId === donor.donorId ? 'selected' : ''}
                      onClick={() => setSelectedDonorId(donor.donorId)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td><strong style={{ color: '#0e6f76' }}>{donor.donorId}</strong></td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#162e20' }}>{donor.donorName}</div>
                        <div style={{ fontSize: '11px', color: '#657367' }}>{donor.operationalArea}</div>
                      </td>
                      <td>{donor.donorType}</td>
                      <td>
                        <span
                          className="fo-status-pill"
                          style={{
                            color: donor.verificationStatus === 'Verified' ? '#0f766e' : donor.verificationStatus === 'Flagged' ? '#dc2626' : '#b45309',
                            backgroundColor: donor.verificationStatus === 'Verified' ? '#f0fdfa' : donor.verificationStatus === 'Flagged' ? '#fef2f2' : '#fffbeb'
                          }}
                        >
                          {donor.verificationStatus}
                        </span>
                      </td>
                      <td>
                        <strong>LKR {Number(donor.totalMonetaryAmount || 0).toLocaleString()}</strong>
                        {donor.totalMaterialUnits > 0 && (
                          <div style={{ fontSize: '11px', color: '#657367' }}>+ {donor.totalMaterialUnits.toLocaleString()} units</div>
                        )}
                      </td>
                      <td>{donor.donationCount}</td>
                      <td style={{ fontSize: '12px', color: '#657367' }}>
                        {donor.latestContributionDate ? new Date(donor.latestContributionDate).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Donor Profile & Donation History */}
        <div className="fo-panel fo-detail-panel" style={{ flex: '1 1 38%', padding: '20px' }}>
          {!selectedDonor ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#657367' }}>
              Select a donor profile to inspect verification details and contribution history.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0e6f76' }}>{selectedDonor.donorId}</span>
                  <h3 style={{ margin: '2px 0 4px 0', fontSize: '17px', color: '#162e20' }}>{selectedDonor.donorName}</h3>
                  <span style={{ fontSize: '12px', color: '#657367' }}>{selectedDonor.donorType} · {selectedDonor.operationalArea}</span>
                </div>
                <span
                  className="fo-status-pill"
                  style={{
                    color: selectedDonor.verificationStatus === 'Verified' ? '#0f766e' : selectedDonor.verificationStatus === 'Flagged' ? '#dc2626' : '#b45309',
                    backgroundColor: selectedDonor.verificationStatus === 'Verified' ? '#f0fdfa' : selectedDonor.verificationStatus === 'Flagged' ? '#fef2f2' : '#fffbeb'
                  }}
                >
                  {selectedDonor.verificationStatus}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f8faf8', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#657367' }}>Total Monetary</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#162e20' }}>
                    LKR {Number(selectedDonor.totalMonetaryAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#657367' }}>Material Units</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#162e20' }}>
                    {(selectedDonor.totalMaterialUnits || 0).toLocaleString()} units
                  </div>
                </div>
              </div>

              {/* Verification Action Box */}
              <div style={{ borderTop: '1px solid #e5ebe2', paddingTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  AUTHORISED VERIFICATION AUDIT NOTE
                </label>
                <textarea
                  rows={2}
                  className="fo-textarea"
                  placeholder="Enter verification or compliance review note..."
                  value={auditNote}
                  onChange={(e) => setAuditNote(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedDonor.verificationStatus !== 'Verified' && (
                    <button
                      className="fo-btn fo-btn-primary"
                      style={{ flex: 1 }}
                      disabled={submitting}
                      onClick={() => handleVerificationAction('Verified')}
                    >
                      <CheckCircle2 size={14} />
                      <span>Verify Donor</span>
                    </button>
                  )}
                  {selectedDonor.verificationStatus !== 'Flagged' && (
                    <button
                      className="fo-btn fo-btn-secondary"
                      style={{ flex: 1, borderColor: '#fca5a5', color: '#dc2626' }}
                      disabled={submitting}
                      onClick={() => handleVerificationAction('Flagged')}
                    >
                      <AlertTriangle size={14} />
                      <span>Flag for Review</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Per-Donor Donation History */}
              <div style={{ borderTop: '1px solid #e5ebe2', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontSize: '12px', fontWeight: 700, color: '#162e20' }}>
                  <History size={14} />
                  <span>Donation History ({selectedDonor.donationHistory?.length || 0})</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                  {(selectedDonor.donationHistory || []).map((hist) => (
                    <div
                      key={hist.id}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #e5ebe2',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0e6f76' }}>{hist.id}</div>
                        <div style={{ fontSize: '11px', color: '#657367' }}>{hist.source} · {new Date(hist.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>{hist.recordedValue}</div>
                        <div style={{ fontSize: '11px', color: hist.statusColor }}>{hist.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#657367', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={13} color="#0e6f76" />
                <span>Payment gateway details excluded per role boundary.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorManagementView;

import React, { useState, useEffect } from 'react';
import { Search, Plus, Play, Pause, CheckCircle2, HeartHandshake } from 'lucide-react';

export const CampaignsView = ({
  campaigns = [],
  selectedCampaignId,
  setSelectedCampaignId,
  loading = false,
  globalSearch = '',
  onCreateCampaign,
  onUpdateCampaignStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newArea, setNewArea] = useState('Western Province');
  const [newDesc, setNewDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const effectiveSearch = (searchTerm || globalSearch).trim().toLowerCase();

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = !effectiveSearch ||
      c.id.toLowerCase().includes(effectiveSearch) ||
      c.title.toLowerCase().includes(effectiveSearch) ||
      c.operationalArea.toLowerCase().includes(effectiveSearch);
    const matchesStatus = statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (filteredCampaigns.length > 0 && !filteredCampaigns.some(c => c.id === selectedCampaignId)) {
      setSelectedCampaignId(filteredCampaigns[0].id);
    }
  }, [filteredCampaigns, selectedCampaignId, setSelectedCampaignId]);

  const selectedCampaign = filteredCampaigns.find(c => c.id === selectedCampaignId) || filteredCampaigns[0] || null;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || Number(newTarget) < 1000) {
      alert('Please enter a campaign title and a target amount of at least LKR 1,000.');
      return;
    }
    setSubmitting(true);
    try {
      await onCreateCampaign({
        title: newTitle.trim(),
        targetAmount: Number(newTarget),
        operationalArea: newArea.trim() || 'Western Province',
        category: 'Emergency Relief',
        targetDescription: newDesc.trim() || 'Humanitarian crisis fundraising campaign.',
        durationDays: 30
      });
      setNewTitle('');
      setNewTarget('');
      setNewDesc('');
      setShowCreateForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedCampaign || !onUpdateCampaignStatus) return;
    if (!window.confirm(`Change campaign "${selectedCampaign.title}" status to ${newStatus}?`)) return;
    setSubmitting(true);
    try {
      await onUpdateCampaignStatus(selectedCampaign.id, newStatus);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fo-workspace">
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>FUNDRAISING & CRISIS RESOURCE MOBILIZATION</span>
          </div>
          <h1 className="fo-title">Campaigns</h1>
          <p className="fo-subtitle">
            Track crisis fundraising targets, verified contributions received, remaining funding gaps, and linked donations.
          </p>
        </div>

        <div className="fo-title-actions">
          <button className="fo-btn fo-btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus size={14} />
            <span>{showCreateForm ? 'Cancel' : 'New Campaign'}</span>
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateSubmit} className="fo-panel" style={{ padding: '18px', marginBottom: '18px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#162e20' }}>Create Fundraising Campaign</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <input
              type="text"
              required
              placeholder="Campaign / Crisis Title"
              className="fo-search-input"
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px' }}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="number"
              required
              min={1000}
              placeholder="Target Amount (LKR)"
              className="fo-search-input"
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px' }}
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
            />
            <input
              type="text"
              placeholder="Target Operational Area"
              className="fo-search-input"
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px' }}
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description / Relief Scope"
              className="fo-search-input"
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px' }}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="fo-btn fo-btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Save Campaign'}
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
            placeholder="Search campaign ID, title, or disaster type..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fo-filter-selects">
          <select className="fo-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="fo-split-layout">
        <div className="fo-panel fo-table-panel" style={{ flex: '1 1 60%' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>Loading campaigns...</div>
          ) : filteredCampaigns.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>No campaigns match your filters.</div>
          ) : (
            <div className="fo-table-wrap">
              <table className="fo-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>CAMPAIGN / CRISIS</th>
                    <th>TARGET (LKR)</th>
                    <th>VERIFIED RAISED</th>
                    <th>PROGRESS</th>
                    <th>DONATIONS</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((camp) => (
                    <tr
                      key={camp.id}
                      className={selectedCampaign?.id === camp.id ? 'selected' : ''}
                      onClick={() => setSelectedCampaignId(camp.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td><strong style={{ color: '#0e6f76' }}>{camp.id}</strong></td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#162e20' }}>{camp.title}</div>
                        <div style={{ fontSize: '11px', color: '#657367' }}>{camp.category}</div>
                      </td>
                      <td>LKR {Number(camp.targetAmount || 0).toLocaleString()}</td>
                      <td><strong>LKR {Number(camp.raisedAmount || 0).toLocaleString()}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '64px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${camp.percentFunded || 0}%`, height: '100%', backgroundColor: '#0e6f76' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>{camp.percentFunded || 0}%</span>
                        </div>
                      </td>
                      <td>{camp.donationCount ?? 0}</td>
                      <td>
                        <span
                          className="fo-status-pill"
                          style={{
                            color: camp.status === 'Active' ? '#0f766e' : camp.status === 'Completed' ? '#166534' : '#b45309',
                            backgroundColor: camp.status === 'Active' ? '#f0fdfa' : camp.status === 'Completed' ? '#f0fdf4' : '#fffbeb'
                          }}
                        >
                          {camp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Campaign Details & Linked Donations */}
        <div className="fo-panel fo-detail-panel" style={{ flex: '1 1 40%', padding: '20px' }}>
          {!selectedCampaign ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#657367' }}>
              Select a campaign to inspect targets, progress, and linked donations.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0e6f76' }}>{selectedCampaign.id}</span>
                  <h3 style={{ margin: '2px 0', fontSize: '16px', color: '#162e20' }}>{selectedCampaign.title}</h3>
                  <div style={{ fontSize: '12px', color: '#657367' }}>
                    {new Date(selectedCampaign.startDate).toLocaleDateString()} – {new Date(selectedCampaign.endDate).toLocaleDateString()}
                  </div>
                </div>
                <span className="fo-status-pill">{selectedCampaign.status}</span>
              </div>

              <p style={{ fontSize: '12.5px', color: '#334155', margin: 0 }}>{selectedCampaign.targetDescription}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f8faf8', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#657367' }}>Verified Raised</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f766e' }}>
                    LKR {Number(selectedCampaign.raisedAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#657367' }}>Remaining Target</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#162e20' }}>
                    LKR {Number(selectedCampaign.remainingAmount ?? Math.max(0, (selectedCampaign.targetAmount || 0) - (selectedCampaign.raisedAmount || 0))).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Status Controls */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedCampaign.status !== 'Active' && (
                  <button className="fo-btn fo-btn-primary" style={{ flex: 1 }} disabled={submitting} onClick={() => handleStatusChange('Active')}>
                    <Play size={14} /> <span>Activate</span>
                  </button>
                )}
                {selectedCampaign.status === 'Active' && (
                  <button className="fo-btn fo-btn-secondary" style={{ flex: 1 }} disabled={submitting} onClick={() => handleStatusChange('Paused')}>
                    <Pause size={14} /> <span>Pause</span>
                  </button>
                )}
                {selectedCampaign.status !== 'Completed' && (
                  <button className="fo-btn fo-btn-secondary" style={{ flex: 1 }} disabled={submitting} onClick={() => handleStatusChange('Completed')}>
                    <CheckCircle2 size={14} /> <span>Mark Completed</span>
                  </button>
                )}
              </div>

              {/* Linked Donations Breakdown */}
              <div style={{ borderTop: '1px solid #e5ebe2', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '12px', fontWeight: 700, color: '#162e20' }}>
                  <HeartHandshake size={14} />
                  <span>Linked Donations ({selectedCampaign.linkedDonations?.length || 0})</span>
                </div>
                {(!selectedCampaign.linkedDonations || selectedCampaign.linkedDonations.length === 0) ? (
                  <div style={{ fontSize: '12px', color: '#657367', padding: '12px', backgroundColor: '#f8faf8', borderRadius: '8px' }}>
                    No donations linked to this campaign yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                    {selectedCampaign.linkedDonations.map((ld) => (
                      <div key={ld.id} style={{ padding: '8px 10px', border: '1px solid #e5ebe2', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0e6f76' }}>{ld.id} · {ld.donorOrg}</div>
                          <div style={{ fontSize: '11px', color: '#657367' }}>{ld.status}</div>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>{ld.recordedValue}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignsView;

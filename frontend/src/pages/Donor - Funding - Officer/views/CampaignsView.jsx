import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  Megaphone, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Layers,
  Calendar,
  Users
} from 'lucide-react';

export const CampaignsView = ({
  campaigns,
  selectedCampaignId,
  setSelectedCampaignId,
  onOpenCreateRecordModal,
  onOpenApprovalModal,
  onExportReport,
  onSaveNote,
  onClarifyRecord,
  onEscalateRecord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [activeNoteText, setActiveNoteText] = useState('');

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  React.useEffect(() => {
    if (selectedCampaign) {
      setActiveNoteText(`Funding progress is tracking at ${selectedCampaign.progress}%. Lead operational officer: ${selectedCampaign.leadOfficer}.`);
    }
  }, [selectedCampaignId]);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.operationalArea.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUrgency = urgencyFilter === 'All' || c.urgency.toLowerCase() === urgencyFilter.toLowerCase();

    return matchesSearch && matchesUrgency;
  });

  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <Layers size={13} />
            <span>FUNDING OFFICER · CONTROLLED WORKSPACE</span>
          </div>
          <h1 className="fo-title">Campaigns</h1>
          <p className="fo-subtitle">
            Search, filter and review fictional records within this role's authorised scope.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="fo-btn fo-btn-secondary"
            onClick={onExportReport}
          >
            <Download size={14} />
            <span>Export demo report</span>
          </button>
          <button 
            className="fo-btn fo-btn-primary"
            onClick={onOpenCreateRecordModal}
          >
            <Plus size={14} />
            <span>+ Create prototype record</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fo-filter-bar">
        <div className="fo-filter-search">
          <Search size={14} className="fo-search-icon" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fo-filter-inputs">
          <select 
            className="fo-select"
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
          >
            <option value="All">All urgencies</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Split Layout */}
      <div className="fo-split-layout">
        {/* Table Section */}
        <div className="fo-table-container">
          <table className="fo-data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Campaign Name</th>
                <th>Target</th>
                <th>Raised</th>
                <th>Progress</th>
                <th>Donors</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((camp) => {
                const isSelected = camp.id === selectedCampaign?.id;
                return (
                  <tr 
                    key={camp.id} 
                    className={isSelected ? 'selected' : ''}
                    onClick={() => setSelectedCampaignId(camp.id)}
                  >
                    <td>
                      <span className="fo-record-id">{camp.code}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{camp.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{camp.operationalArea}</div>
                    </td>
                    <td style={{ color: '#334155' }}>{camp.targetAmount}</td>
                    <td style={{ fontWeight: 700, color: '#0284c7' }}>{camp.raisedAmount}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          flex: 1,
                          height: '6px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          width: '60px'
                        }}>
                          <div style={{
                            width: `${Math.min(camp.progress, 100)}%`,
                            height: '100%',
                            backgroundColor: camp.progress >= 90 ? '#059669' : '#0284c7',
                            borderRadius: '3px'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>{camp.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} />
                        {camp.donorCount}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="fo-badge"
                        style={{
                          backgroundColor: camp.urgency === 'Critical' ? '#fef2f2' : '#eff6ff',
                          color: camp.urgency === 'Critical' ? '#dc2626' : '#0284c7',
                          border: `1px solid ${camp.urgency === 'Critical' ? '#fecaca' : '#bfdbfe'}`
                        }}
                      >
                        ● {camp.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Campaign Detail Panel */}
        {selectedCampaign && (
          <div className="fo-detail-card">
            <div className="fo-detail-header-row">
              <span className="fo-detail-id">{selectedCampaign.code}</span>
              <span 
                className="fo-badge"
                style={{
                  backgroundColor: '#eff6ff',
                  color: '#0284c7',
                  border: '1px solid #bfdbfe'
                }}
              >
                ● {selectedCampaign.status}
              </span>
            </div>

            <div className="fo-detail-source">{selectedCampaign.name}</div>
            <div className="fo-detail-subtag">Selected fictional campaign · role scoped</div>

            <div className="fo-detail-fields-grid">
              <div className="fo-field-group">
                <span className="fo-field-label">Target</span>
                <span className="fo-field-value">{selectedCampaign.targetAmount}</span>
              </div>
              <div className="fo-field-group">
                <span className="fo-field-label">Raised to Date</span>
                <span className="fo-field-value" style={{ color: '#0284c7' }}>
                  {selectedCampaign.raisedAmount}
                </span>
              </div>
              <div className="fo-field-group">
                <span className="fo-field-label">Funding Progress</span>
                <span className="fo-field-value" style={{ color: '#059669' }}>
                  {selectedCampaign.progress}% Funded
                </span>
              </div>
              <div className="fo-field-group">
                <span className="fo-field-label">Urgency Level</span>
                <span className="fo-field-value" style={{ color: selectedCampaign.urgencyColor }}>
                  {selectedCampaign.urgency}
                </span>
              </div>
            </div>

            <div className="fo-note-section">
              <label className="fo-note-label">AUTHORISED NOTE / DECISION REASON</label>
              <textarea
                className="fo-note-textarea"
                placeholder="Enter campaign notes or allocation directives..."
                value={activeNoteText}
                onChange={(e) => setActiveNoteText(e.target.value)}
              ></textarea>
              <button 
                type="button"
                style={{
                  alignSelf: 'flex-end',
                  marginTop: '4px',
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onClick={() => onSaveNote(selectedCampaign.id, activeNoteText)}
              >
                Save Memo
              </button>
            </div>

            <div className="fo-detail-actions">
              <button 
                className="fo-action-btn-primary"
                onClick={() => onOpenApprovalModal({
                  id: selectedCampaign.code,
                  title: selectedCampaign.name,
                  allocatedAmount: selectedCampaign.raisedAmount,
                  cluster: selectedCampaign.operationalArea
                })}
              >
                Submit for approval
              </button>

              <button 
                className="fo-action-btn-secondary"
                onClick={() => onClarifyRecord({ id: selectedCampaign.code, source: selectedCampaign.name })}
              >
                Request clarification
              </button>

              <button 
                className="fo-action-btn-danger"
                onClick={() => onEscalateRecord({ id: selectedCampaign.code, source: selectedCampaign.name })}
              >
                Escalate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

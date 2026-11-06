import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  FileCheck, 
  Package, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight
} from 'lucide-react';

export const DonationRecordsView = ({
  records,
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
  const [activeNoteText, setActiveNoteText] = useState('');

  const selectedRecord = records.find(r => r.id === selectedRecordId) || records[0];

  React.useEffect(() => {
    if (selectedRecord) {
      setActiveNoteText(selectedRecord.notes || '');
    }
  }, [selectedRecordId]);

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.allocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.category && r.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
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
          <h1 className="fo-title">Donation Records</h1>
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
            placeholder="Search donation records..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fo-filter-inputs">
          <select 
            className="fo-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types (Monetary & Material)</option>
            <option value="Monetary">Monetary Only</option>
            <option value="Material">Material (In-Kind) Only</option>
          </select>

          <select 
            className="fo-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Allocated">Allocated</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
            <option value="Dispatched">Dispatched</option>
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
                <th>Record</th>
                <th>Source / Campaign</th>
                <th>Type</th>
                <th>Recorded Value</th>
                <th>Verification</th>
                <th>Allocation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((item) => {
                const isSelected = item.id === selectedRecord?.id;
                return (
                  <tr 
                    key={item.id} 
                    className={isSelected ? 'selected' : ''}
                    onClick={() => setSelectedRecordId(item.id)}
                  >
                    <td>
                      <span className="fo-record-id">{item.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.source}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.donorOrg}</div>
                    </td>
                    <td>
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: item.type === 'Monetary' ? '#0284c7' : '#059669',
                        fontWeight: 600
                      }}>
                        {item.type === 'Monetary' ? <DollarSign size={12} /> : <Package size={12} />}
                        {item.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      {item.recordedValue}
                    </td>
                    <td>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        backgroundColor: item.verification === 'Verified' ? '#ecfdf5' : '#fffbeb',
                        color: item.verification === 'Verified' ? '#059669' : '#b45309',
                        border: `1px solid ${item.verification === 'Verified' ? '#a7f3d0' : '#fde68a'}`,
                        fontWeight: 600
                      }}>
                        {item.verification}
                      </span>
                    </td>
                    <td style={{ color: '#334155' }}>
                      {item.allocation}
                    </td>
                    <td>
                      <span 
                        className="fo-badge"
                        style={{
                          backgroundColor: item.statusBg,
                          color: item.statusColor,
                          border: `1px solid ${item.statusBorder}`
                        }}
                      >
                        <span style={{ 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          backgroundColor: item.statusColor 
                        }}></span>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Record Detail Panel */}
        {selectedRecord && (
          <div className="fo-detail-card">
            <div className="fo-detail-header-row">
              <span className="fo-detail-id">{selectedRecord.id}</span>
              <span 
                className="fo-badge"
                style={{
                  backgroundColor: selectedRecord.statusBg,
                  color: selectedRecord.statusColor,
                  border: `1px solid ${selectedRecord.statusBorder}`
                }}
              >
                ● {selectedRecord.status}
              </span>
            </div>

            <div className="fo-detail-source">{selectedRecord.source}</div>
            <div className="fo-detail-subtag">Selected fictional record · role scoped</div>

            <div className="fo-detail-fields-grid">
              <div className="fo-field-group">
                <span className="fo-field-label">Type</span>
                <span className="fo-field-value">{selectedRecord.type}</span>
              </div>
              <div className="fo-field-group">
                <span className="fo-field-label">Recorded Value</span>
                <span className="fo-field-value" style={{ color: '#0284c7' }}>
                  {selectedRecord.recordedValue}
                </span>
              </div>
              <div className="fo-field-group">
                <span className="fo-field-label">Verification</span>
                <span className="fo-field-value" style={{ color: '#059669' }}>
                  {selectedRecord.verification}
                </span>
              </div>
              <div className="fo-field-group">
                <span className="fo-field-label">Allocation</span>
                <span className="fo-field-value">{selectedRecord.allocation}</span>
              </div>
            </div>

            <div className="fo-note-section">
              <label className="fo-note-label">AUTHORISED NOTE / DECISION REASON</label>
              <textarea
                className="fo-note-textarea"
                placeholder="Enter audit notes or approval rationale..."
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
                onClick={() => onSaveNote(selectedRecord.id, activeNoteText)}
              >
                Save Memo
              </button>
            </div>

            <div className="fo-detail-actions">
              <button 
                className="fo-action-btn-primary"
                onClick={() => onOpenApprovalModal(selectedRecord)}
              >
                Submit for approval
              </button>

              <button 
                className="fo-action-btn-secondary"
                onClick={() => onClarifyRecord(selectedRecord)}
              >
                Request clarification
              </button>

              <button 
                className="fo-action-btn-danger"
                onClick={() => onEscalateRecord(selectedRecord)}
              >
                Escalate
              </button>

              <button
                type="button"
                style={{
                  marginTop: '6px',
                  padding: '8px',
                  backgroundColor: '#eff6ff',
                  border: '1px dashed #bfdbfe',
                  borderRadius: '6px',
                  color: '#0284c7',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onClick={() => onOpenReceiptModal(selectedRecord)}
              >
                <FileCheck size={13} />
                <span>View Donation Certificate</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

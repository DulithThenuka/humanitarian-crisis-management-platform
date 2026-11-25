import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Archive, 
  Receipt,
  Building
} from 'lucide-react';

export const DonorManagementView = ({
  records = [],
  selectedRecordId,
  setSelectedRecordId,
  onOpenCreateRecordModal,
  onOpenApprovalModal,
  onOpenReceiptModal,
  onExportReport,
  onSaveNote,
  onClarifyRecord,
  onEscalateRecord,
  onUpdateRecord,
  onDeactivateRecord,
  title = 'Donor Management',
  searchPlaceholder = 'Search by donor organization, code, source...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [noteText, setNoteText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    contactPerson: '',
    email: '',
    phone: '',
    operationalArea: '',
    notes: ''
  });

  const displayRecords = records || [];
  const currentSelectedId = selectedRecordId || displayRecords[0]?.id;
  const selectedRecord = displayRecords.find(r => r.id === currentSelectedId) || displayRecords[0];

  const filteredRecords = displayRecords.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      (r.id && r.id.toLowerCase().includes(q)) ||
      (r.donorOrg && r.donorOrg.toLowerCase().includes(q)) ||
      (r.source && r.source.toLowerCase().includes(q)) ||
      (r.contactPerson && r.contactPerson.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || 
      (r.status && r.status.toLowerCase() === statusFilter.toLowerCase());

    const matchesType = typeFilter === 'All' || 
      (r.type && r.type.toLowerCase() === typeFilter.toLowerCase());

    const matchesArea = areaFilter === 'All' || 
      (r.operationalArea && r.operationalArea.toLowerCase().includes(areaFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesType && matchesArea;
  });

  // Calculate donor's total contributions from live records
  const donorHistory = selectedRecord 
    ? displayRecords.filter(r => 
        (r.donorOrg && selectedRecord.donorOrg && r.donorOrg.toLowerCase() === selectedRecord.donorOrg.toLowerCase()) ||
        r.id === selectedRecord.id
      )
    : [];

  const handleStartEdit = () => {
    if (!selectedRecord) return;
    setEditForm({
      contactPerson: selectedRecord.contactPerson || '',
      email: selectedRecord.email || '',
      phone: selectedRecord.phone || '',
      operationalArea: selectedRecord.operationalArea || '',
      notes: selectedRecord.notes || ''
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedRecord || !onUpdateRecord) return;
    await onUpdateRecord(selectedRecord.id, editForm);
    setIsEditing(false);
  };

  const handleArchive = async () => {
    if (!selectedRecord || !onDeactivateRecord) return;
    const reason = window.prompt(`Enter reason to archive donor ${selectedRecord.id} (audit trail is strictly preserved):`);
    if (reason) {
      await onDeactivateRecord(selectedRecord.id, reason);
    }
  };

  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>HUMANAID RESOURCE COORDINATION · VERIFIED DIRECTORY</span>
          </div>
          <h1 className="fo-title">{title}</h1>
          <p className="fo-subtitle">
            Search, verify, and manage authorized humanitarian donor profiles, contribution ledgers, and allocation history.
          </p>
        </div>

        <div className="fo-title-actions">
          <button 
            className="fo-btn fo-btn-secondary"
            onClick={onExportReport}
          >
            <Download size={14} />
            <span>Export Audit CSV</span>
          </button>
          <button 
            className="fo-btn fo-btn-primary"
            onClick={onOpenCreateRecordModal}
          >
            <Plus size={14} />
            <span>Record Donation / Grant</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fo-filter-bar">
        <div className="fo-filter-search">
          <Search size={14} className="fo-search-icon" />
          <input
            type="text"
            placeholder={searchPlaceholder}
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
            <option value="All">All donation types</option>
            <option value="Monetary">Monetary grants</option>
            <option value="Material">Material supplies</option>
          </select>

          <select 
            className="fo-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Allocated">Allocated</option>
            <option value="Review">Under Review</option>
            <option value="Completed">Completed</option>
            <option value="Dispatched">Dispatched</option>
          </select>

          <select 
            className="fo-select"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="All">All districts / areas</option>
            <option value="Colombo">Colombo District</option>
            <option value="Gampaha">Gampaha District</option>
            <option value="Kalutara">Kalutara District</option>
            <option value="Western">Western Province</option>
          </select>
        </div>
      </div>

      {/* Split Layout: Table on left, Detail panel on right */}
      <div className="fo-split-layout">
        {/* Table Section */}
        <div className="fo-table-container">
          {filteredRecords.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
              <Building size={32} style={{ margin: '0 auto 12px', color: '#8c9c8e' }} />
              <div style={{ fontSize: '15px', fontWeight: 600 }}>No matching donor records found</div>
              <p style={{ fontSize: '13px', margin: '4px 0 0' }}>Try broadening your search term or filter criteria.</p>
            </div>
          ) : (
            <table className="fo-data-table">
              <thead>
                <tr>
                  <th>RECORD ID</th>
                  <th>DONOR / ORGANIZATION</th>
                  <th>TYPE</th>
                  <th>RECORDED VALUE</th>
                  <th>VERIFICATION</th>
                  <th>ALLOCATION</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((item) => {
                  const isSelected = item.id === selectedRecord?.id;
                  return (
                    <tr 
                      key={item.id} 
                      className={isSelected ? 'selected' : ''}
                      onClick={() => setSelectedRecordId && setSelectedRecordId(item.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span className="fo-cell-record-id">{item.id}</span>
                      </td>
                      <td>
                        <span className="fo-cell-source" style={{ fontWeight: 600, color: '#162e20' }}>
                          {item.donorOrg || item.source}
                        </span>
                        {item.operationalArea && (
                          <div style={{ fontSize: '11px', color: '#657367' }}>{item.operationalArea}</div>
                        )}
                      </td>
                      <td>
                        <span className={`fo-type-pill ${item.type?.toLowerCase()}`}>
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <span className="fo-cell-value" style={{ fontWeight: 600 }}>{item.recordedValue}</span>
                      </td>
                      <td>
                        <span className={`fo-verify-badge ${item.verification?.toLowerCase()}`}>
                          {item.verification === 'Verified' ? '● Verified' : '○ Pending'}
                        </span>
                      </td>
                      <td>
                        <span className="fo-cell-allocation">{item.allocation || 'Unallocated'}</span>
                      </td>
                      <td>
                        <span className={`fo-status-badge ${item.statusBadge || item.status?.toLowerCase()}`}>
                          ● {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Selected Record Detail Panel (Right Column) */}
        {selectedRecord && (
          <div className="fo-detail-card">
            {/* Header Row */}
            <div className="fo-detail-header-row">
              <span className="fo-detail-id">{selectedRecord.id}</span>
              <span className={`fo-status-badge ${selectedRecord.statusBadge || selectedRecord.status?.toLowerCase()}`}>
                ● {selectedRecord.status}
              </span>
            </div>

            <div className="fo-detail-title">{selectedRecord.donorOrg || selectedRecord.source}</div>
            <div className="fo-detail-subtitle">
              Verified Donor Profile · {selectedRecord.category || 'General Humanitarian Relief'}
            </div>

            {/* Profile Fields */}
            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#445145' }}>
                <User size={13} color="#2d5a3e" />
                <span>Contact: <strong>{selectedRecord.contactPerson || selectedRecord.donorOrg}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#445145' }}>
                <Mail size={13} color="#2d5a3e" />
                <span>Email: <strong>{selectedRecord.email || 'donor@reliefcore.lk'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#445145' }}>
                <Phone size={13} color="#2d5a3e" />
                <span>Phone: <strong>{selectedRecord.phone || '+94 11 200 4000'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#445145' }}>
                <MapPin size={13} color="#2d5a3e" />
                <span>District: <strong>{selectedRecord.operationalArea || 'Western Province'}</strong></span>
              </div>
              {selectedRecord.complianceDoc && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2d5a3e', fontSize: '11px', fontWeight: 600 }}>
                  <FileText size={13} />
                  <span>Audit Doc: {selectedRecord.complianceDoc}</span>
                </div>
              )}
            </div>

            {/* 2x2 Fields Grid */}
            <div className="fo-detail-grid" style={{ marginTop: '16px' }}>
              <div className="fo-detail-field">
                <span className="fo-detail-label">Type</span>
                <span className="fo-detail-val">{selectedRecord.type}</span>
              </div>
              <div className="fo-detail-field">
                <span className="fo-detail-label">Recorded Value</span>
                <span className="fo-detail-val" style={{ color: '#2d5a3e', fontWeight: 700 }}>
                  {selectedRecord.recordedValue}
                </span>
              </div>
              <div className="fo-detail-field">
                <span className="fo-detail-label">Verification</span>
                <span className="fo-detail-val">{selectedRecord.verification}</span>
              </div>
              <div className="fo-detail-field">
                <span className="fo-detail-label">Allocation</span>
                <span className="fo-detail-val">{selectedRecord.allocation}</span>
              </div>
            </div>

            {/* Donor Contribution History */}
            {donorHistory.length > 1 && (
              <div style={{ marginTop: '16px', borderTop: '1px solid #dfe5d8', paddingTop: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#657367', textTransform: 'uppercase' }}>
                  Donor Contribution History ({donorHistory.length} records)
                </span>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                  {donorHistory.map((h) => (
                    <div 
                      key={h.id} 
                      onClick={() => setSelectedRecordId(h.id)}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '6px 8px', 
                        borderRadius: '4px',
                        backgroundColor: h.id === selectedRecord.id ? '#edf2e6' : '#f8faf6',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{h.id}</span>
                      <span>{h.recordedValue}</span>
                      <span style={{ color: '#657367' }}>{h.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note Textarea */}
            <div className="fo-note-section">
              <label className="fo-note-label">AUTHORISED NOTE / DECISION REASON</label>
              <textarea
                className="fo-note-textarea"
                placeholder="Enter mandatory audit determination or compliance notes..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={2}
              />
            </div>

            {/* Action Buttons Stacked */}
            <div className="fo-detail-actions">
              <button 
                className="fo-btn fo-btn-primary fo-btn-full"
                onClick={() => {
                  if (onOpenApprovalModal) {
                    onOpenApprovalModal(selectedRecord);
                  } else if (onSaveNote) {
                    onSaveNote(selectedRecord.id, noteText);
                  }
                }}
              >
                Submit Decision / Co-Sign
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="fo-btn fo-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => onOpenReceiptModal ? onOpenReceiptModal(selectedRecord) : null}
                >
                  <Receipt size={13} />
                  <span>View Receipt</span>
                </button>
                <button 
                  className="fo-btn fo-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => onClarifyRecord && onClarifyRecord(selectedRecord)}
                >
                  <span>Clarification</span>
                </button>
                <button 
                  className="fo-btn fo-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => onEscalateRecord && onEscalateRecord(selectedRecord)}
                >
                  <span>Escalate</span>
                </button>
              </div>

              {onDeactivateRecord && (
                <button 
                  className="fo-btn fo-btn-secondary fo-btn-full"
                  style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                  onClick={handleArchive}
                >
                  <Archive size={13} />
                  <span>Archive Donor Profile</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorManagementView;

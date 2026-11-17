import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const DonorManagementView = ({
  records = [],
  selectedRecordId,
  setSelectedRecordId,
  onOpenCreateRecordModal,
  onOpenApprovalModal,
  onExportReport,
  onSaveNote,
  onClarifyRecord,
  onEscalateRecord,
  title = 'Donor Management',
  searchPlaceholder = 'Search donor management...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [noteText, setNoteText] = useState('');

  // Default records matching Screenshot 2, 3, 4, 5
  const fallbackRecords = [
    {
      id: 'DON-2048',
      source: 'Community Relief Fund',
      type: 'Monetary',
      recordedValue: 'LKR 450,000',
      verification: 'Verified',
      allocation: 'Flood campaign',
      status: 'Allocated',
      statusBadge: 'allocated'
    },
    {
      id: 'DON-2047',
      source: 'MedCare Lanka',
      type: 'Material',
      recordedValue: '240 medicine packs',
      verification: 'Pending',
      allocation: 'Unallocated',
      status: 'Review',
      statusBadge: 'review'
    },
    {
      id: 'DON-2044',
      source: 'Public campaign',
      type: 'Monetary',
      recordedValue: 'LKR 128,500',
      verification: 'Verified',
      allocation: 'Shelter supplies',
      status: 'Completed',
      statusBadge: 'completed'
    },
    {
      id: 'DON-2041',
      source: 'WaterAid Response',
      type: 'Material',
      recordedValue: '1,200 water units',
      verification: 'Verified',
      allocation: 'RES-021',
      status: 'Dispatched',
      statusBadge: 'dispatched'
    }
  ];

  const displayRecords = (records && records.length > 0) ? records : fallbackRecords;
  const currentSelectedId = selectedRecordId || displayRecords[0]?.id || 'DON-2048';
  const selectedRecord = displayRecords.find(r => r.id === currentSelectedId) || displayRecords[0];

  const filteredRecords = displayRecords.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.allocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fo-workspace">
      {/* Title & Action Block (Screenshots 2-5) */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>FUNDING OFFICER · CONTROLLED WORKSPACE</span>
          </div>
          <h1 className="fo-title">{title}</h1>
          <p className="fo-subtitle">
            Search, filter and review fictional records within this role's authorised scope.
          </p>
        </div>

        <div className="fo-title-actions">
          <button 
            className="fo-btn fo-btn-secondary"
            onClick={onExportReport}
          >
            <span>Export demo report</span>
          </button>
          <button 
            className="fo-btn fo-btn-primary"
            onClick={onOpenCreateRecordModal}
          >
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
            placeholder={searchPlaceholder}
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
            <option value="All">All statuses</option>
            <option value="Allocated">Allocated</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
            <option value="Dispatched">Dispatched</option>
          </select>

          <select 
            className="fo-select"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="All">All operational areas</option>
            <option value="Western">Western Province</option>
            <option value="Central">Central Province</option>
            <option value="Southern">Southern Province</option>
          </select>
        </div>
      </div>

      {/* Split Layout: Table on left, Detail panel on right */}
      <div className="fo-split-layout">
        {/* Table Section */}
        <div className="fo-table-container">
          <table className="fo-data-table">
            <thead>
              <tr>
                <th>RECORD</th>
                <th>SOURCE / CAMPAIGN</th>
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
                  >
                    <td>
                      <span className="fo-cell-record-id">{item.id}</span>
                    </td>
                    <td>
                      <span className="fo-cell-source">{item.source}</span>
                    </td>
                    <td>
                      <span className="fo-cell-type">{item.type}</span>
                    </td>
                    <td>
                      <span className="fo-cell-value">{item.recordedValue}</span>
                    </td>
                    <td>
                      <span className="fo-cell-verification">{item.verification}</span>
                    </td>
                    <td>
                      <span className="fo-cell-allocation">{item.allocation}</span>
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

            <div className="fo-detail-title">{selectedRecord.source}</div>
            <div className="fo-detail-subtitle">Selected fictional record - role-scoped</div>

            {/* 2x2 Fields Grid */}
            <div className="fo-detail-grid">
              <div className="fo-detail-field">
                <span className="fo-detail-label">Type</span>
                <span className="fo-detail-val">{selectedRecord.type}</span>
              </div>
              <div className="fo-detail-field">
                <span className="fo-detail-label">Recorded value</span>
                <span className="fo-detail-val">{selectedRecord.recordedValue}</span>
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

            {/* Note Textarea */}
            <div className="fo-note-section">
              <label className="fo-note-label">AUTHORISED NOTE / DECISION REASON</label>
              <textarea
                className="fo-note-textarea"
                placeholder="Avoid unnecessary personal information..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons Stacked */}
            <div className="fo-detail-actions">
              <button 
                className="fo-btn fo-btn-primary fo-btn-full"
                onClick={() => onOpenApprovalModal ? onOpenApprovalModal(selectedRecord) : onSaveNote && onSaveNote(selectedRecord.id, noteText)}
              >
                Submit for approval
              </button>
              <button 
                className="fo-btn fo-btn-secondary fo-btn-full"
                onClick={() => onClarifyRecord && onClarifyRecord(selectedRecord)}
              >
                Request clarification
              </button>
              <button 
                className="fo-btn fo-btn-secondary fo-btn-full"
                onClick={() => onEscalateRecord && onEscalateRecord(selectedRecord)}
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

export default DonorManagementView;

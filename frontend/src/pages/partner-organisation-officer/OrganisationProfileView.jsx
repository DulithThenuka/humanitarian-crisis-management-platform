import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const OrganisationProfileView = ({
  records = [],
  selectedRecordId,
  setSelectedRecordId,
  onOpenCreateRecordModal,
  onExportReport,
  onConfirmCommitment,
  onClarifyRecord,
  onEscalateRecord,
  title = 'Organisation Profile',
  searchPlaceholder = 'Search organisation profile...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [noteText, setNoteText] = useState('');

  const fallbackRecords = [
    {
      id: 'COM-118',
      sharedIncident: 'CR-2026-014',
      contribution: 'Drinking water',
      quantity: '800 units',
      responsibleOrg: 'National Relief Unit',
      deadline: '18 Feb · 14:00',
      status: 'Dispatched',
      statusBadge: 'dispatched'
    },
    {
      id: 'COM-115',
      sharedIncident: 'CR-2026-014',
      contribution: 'Medical support team',
      quantity: '1 team',
      responsibleOrg: 'MedCare Lanka',
      deadline: '18 Feb · 16:00',
      status: 'Confirmed',
      statusBadge: 'confirmed'
    },
    {
      id: 'REQ-309',
      sharedIncident: 'CR-2026-011',
      contribution: 'Transport vehicles',
      quantity: '4 vehicles',
      responsibleOrg: 'Partner network',
      deadline: '19 Feb · 09:00',
      status: 'Awaiting response',
      statusBadge: 'awaiting'
    },
    {
      id: 'COM-109',
      sharedIncident: 'CR-2026-014',
      contribution: 'Family food kits',
      quantity: '320 kits',
      responsibleOrg: 'Community Relief Lanka',
      deadline: '18 Feb · 12:00',
      status: 'Delayed',
      statusBadge: 'delayed'
    }
  ];

  const displayRecords = (records && records.length > 0) ? records : fallbackRecords;
  const currentSelectedId = selectedRecordId || displayRecords[0]?.id || 'COM-118';
  const selectedRecord = displayRecords.find(r => r.id === currentSelectedId) || displayRecords[0];

  const filteredRecords = displayRecords.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sharedIncident.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contribution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.responsibleOrg.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="po-workspace">
      {/* Title & Action Block (Screenshots 2-4) */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>PARTNER OFFICER · CONTROLLED WORKSPACE</span>
          </div>
          <h1 className="po-title">{title}</h1>
          <p className="po-subtitle">
            Search, filter and review fictional records within this role's authorised scope.
          </p>
        </div>

        <div className="po-title-actions">
          <button 
            className="po-btn po-btn-secondary"
            onClick={onExportReport}
          >
            <span>Export demo report</span>
          </button>
          <button 
            className="po-btn po-btn-primary"
            onClick={onOpenCreateRecordModal}
          >
            <span>+ Create prototype record</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="po-filter-bar">
        <div className="po-filter-search">
          <Search size={14} className="po-search-icon" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="po-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="po-filter-selects">
          <select 
            className="po-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Awaiting response">Awaiting response</option>
            <option value="Delayed">Delayed</option>
          </select>

          <select 
            className="po-select"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="All">All operational areas</option>
            <option value="Western">Western Province</option>
            <option value="Southern">Southern Province</option>
            <option value="Central">Central Province</option>
          </select>
        </div>
      </div>

      {/* Split Layout: Table on left, Detail panel on right */}
      <div className="po-split-layout">
        {/* Table Section */}
        <div className="po-table-container">
          <table className="po-data-table">
            <thead>
              <tr>
                <th>COMMITMENT</th>
                <th>SHARED INCIDENT</th>
                <th>CONTRIBUTION / REQUEST</th>
                <th>QUANTITY</th>
                <th>RESPONSIBLE ORG</th>
                <th>DEADLINE</th>
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
                      <span className="po-cell-record-id">{item.id}</span>
                    </td>
                    <td>
                      <span style={{ color: '#405044' }}>{item.sharedIncident}</span>
                    </td>
                    <td>
                      <span style={{ color: '#405044' }}>{item.contribution}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#162e20' }}>{item.quantity}</span>
                    </td>
                    <td>
                      <span style={{ color: '#405044' }}>{item.responsibleOrg}</span>
                    </td>
                    <td>
                      <span style={{ color: '#405044' }}>{item.deadline}</span>
                    </td>
                    <td>
                      <span className={`po-status-badge ${item.statusBadge || item.status?.toLowerCase().replace(/\s+/g, '-')}`}>
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
          <div className="po-detail-card">
            {/* Header Row */}
            <div className="po-detail-header-row">
              <span className="po-detail-id">{selectedRecord.id}</span>
              <span className={`po-status-badge ${selectedRecord.statusBadge || selectedRecord.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                ● {selectedRecord.status}
              </span>
            </div>

            <div className="po-detail-title">{selectedRecord.sharedIncident}</div>
            <div className="po-detail-subtitle">Selected fictional record · role-scoped</div>

            {/* 2x2 Fields Grid */}
            <div className="po-detail-grid">
              <div className="po-detail-field">
                <span className="po-detail-label">Contribution / request</span>
                <span className="po-detail-val">{selectedRecord.contribution}</span>
              </div>
              <div className="po-detail-field">
                <span className="po-detail-label">Quantity</span>
                <span className="po-detail-val">{selectedRecord.quantity}</span>
              </div>
              <div className="po-detail-field">
                <span className="po-detail-label">Responsible org</span>
                <span className="po-detail-val">{selectedRecord.responsibleOrg}</span>
              </div>
              <div className="po-detail-field">
                <span className="po-detail-label">Deadline</span>
                <span className="po-detail-val">{selectedRecord.deadline}</span>
              </div>
            </div>

            {/* Note Textarea */}
            <div className="po-note-section">
              <label className="po-note-label">AUTHORISED NOTE / DECISION REASON</label>
              <textarea
                className="po-note-textarea"
                placeholder="Avoid unnecessary personal information..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons Stacked */}
            <div className="po-detail-actions">
              <button 
                className="po-btn po-btn-primary po-btn-full"
                onClick={() => onConfirmCommitment ? onConfirmCommitment(selectedRecord, noteText) : alert(`Commitment ${selectedRecord.id} confirmed.`)}
              >
                Confirm commitment
              </button>
              <button 
                className="po-btn po-btn-secondary po-btn-full"
                onClick={() => onClarifyRecord && onClarifyRecord(selectedRecord)}
              >
                Request clarification
              </button>
              <button 
                className="po-btn po-btn-secondary po-btn-full"
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

export default OrganisationProfileView;

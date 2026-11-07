import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Search, 
  CheckCircle, 
  HelpCircle, 
  AlertOctagon 
} from 'lucide-react';

export const ResourceContributionsView = ({
  records,
  selectedRecordId,
  onSelectRecord,
  onUpdateStatus,
  onCreateRecordClick,
  onExportReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [decisionNote, setDecisionNote] = useState('');

  const contributionRecords = records.filter(r => r.type === 'Contribution');

  const filteredRecords = contributionRecords.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sharedIncident.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contribution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.responsibleOrg.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedRecord = contributionRecords.find(r => r.id === selectedRecordId) || contributionRecords[0];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Dispatched':
        return <span className="po-tag-success" style={{ background: '#dbeafe', color: '#1e40af' }}>&bull; Dispatched</span>;
      case 'Confirmed':
        return <span className="po-tag-success">&bull; Confirmed</span>;
      case 'Awaiting response':
        return <span className="po-tag-warning">&bull; Awaiting response</span>;
      case 'Delayed':
        return <span className="po-tag-critical">&bull; Delayed</span>;
      default:
        return <span className="po-tag-warning">&bull; {status}</span>;
    }
  };

  const handleAction = (newStatus, actionLabel) => {
    if (!selectedRecord) return;
    onUpdateStatus(selectedRecord.id, newStatus, decisionNote, actionLabel);
    setDecisionNote('');
  };

  return (
    <div>
      {/* Top Header */}
      <div className="po-title-action-row">
        <div>
          <div className="po-workspace-label">Partner Officer - Controlled Workspace</div>
          <h1 className="po-page-heading">Resource Contributions</h1>
          <p className="po-page-subtext">
            Search, filter and review fictional records within this role's authorised scope.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            type="button" 
            className="po-btn-white-secondary"
            onClick={onExportReport}
          >
            <Download size={14} />
            <span>Export demo report</span>
          </button>

          <button 
            type="button" 
            className="po-btn-blue-primary"
            onClick={onCreateRecordClick}
          >
            <Plus size={15} />
            <span>Create prototype record</span>
          </button>
        </div>
      </div>

      {/* Main Two-Pane Layout */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="po-table-card" style={{ flex: 1, minWidth: '600px' }}>
          <div className="po-table-controls-bar">
            <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
              <Search size={14} className="po-search-input-icon" />
              <input
                type="text"
                placeholder="Search resource contributions..."
                className="po-table-search-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="po-dropdown-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Awaiting response">Awaiting response</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="po-enterprise-table">
              <thead>
                <tr>
                  <th>Commitment</th>
                  <th>Shared Incident</th>
                  <th>Contribution</th>
                  <th>Quantity</th>
                  <th>Responsible Org</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    className={selectedRecord?.id === r.id ? 'active-row' : ''}
                    onClick={() => onSelectRecord(r.id)}
                  >
                    <td style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{r.id}</td>
                    <td style={{ color: '#2563eb', fontWeight: 600, fontFamily: 'monospace' }}>{r.sharedIncident}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{r.contribution}</td>
                    <td>{r.quantity}</td>
                    <td>{r.responsibleOrg}</td>
                    <td style={{ color: '#64748b', fontSize: '12px' }}>{r.deadline}</td>
                    <td>{getStatusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedRecord && (
          <div className="po-detail-card-drawer">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{selectedRecord.id}</span>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>{selectedRecord.sharedIncident}</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Selected fictional record - role-scoped</div>
              </div>
              <div>{getStatusBadge(selectedRecord.status)}</div>
            </div>

            <div className="po-drawer-attributes-grid">
              <div>
                <div className="po-attr-tag">Contribution / request</div>
                <div className="po-attr-value">{selectedRecord.contribution}</div>
              </div>
              <div>
                <div className="po-attr-tag">Quantity</div>
                <div className="po-attr-value">{selectedRecord.quantity}</div>
              </div>
              <div>
                <div className="po-attr-tag">Responsible org</div>
                <div className="po-attr-value">{selectedRecord.responsibleOrg}</div>
              </div>
              <div>
                <div className="po-attr-tag">Deadline</div>
                <div className="po-attr-value">{selectedRecord.deadline}</div>
              </div>
            </div>

            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '6px' }}>
                Authorised Note / Decision Reason
              </label>
              <textarea
                className="po-drawer-textarea-field"
                placeholder="Avoid unnecessary personal information..."
                value={decisionNote}
                onChange={(e) => setDecisionNote(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="po-btn-blue-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => handleAction('Confirmed', 'Confirmed commitment')}
              >
                <CheckCircle size={15} />
                <span>Confirm commitment</span>
              </button>

              <button
                type="button"
                className="po-btn-white-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '13px' }}
                onClick={() => handleAction('Awaiting response', 'Requested clarification')}
              >
                <HelpCircle size={15} />
                <span>Request clarification</span>
              </button>

              <button
                type="button"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '9px',
                  fontSize: '13px',
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => handleAction('Delayed', 'Escalated priority')}
              >
                <AlertOctagon size={15} />
                <span>Escalate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  X,
  ChevronDown
} from 'lucide-react';

export const CaseManagementView = ({
  casesList = [],
  selectedCaseId,
  onSelectCase,
  onUpdateCase,
  onCreateCase,
  showToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  
  // Detail action form state
  const [actionNote, setActionNote] = useState('');
  const [newStatus, setNewStatus] = useState('');

  // Create record modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRecordForm, setNewRecordForm] = useState({
    category: 'Emergency Shelter',
    operationalArea: 'Kelani East - Zone 03',
    priority: 'Critical',
    assignedStaff: 'I. Senanayake',
    citizenQuote: ''
  });

  const currentCase = casesList.find((c) => c.id === selectedCaseId) || casesList[0];

  // Filtering
  const filteredCases = casesList.filter((item) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchArea = item.operationalArea.toLowerCase().includes(q);
      const matchStaff = item.assignedStaff.toLowerCase().includes(q);
      if (!matchId && !matchCat && !matchArea && !matchStaff) return false;
    }
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (areaFilter !== 'All' && item.operationalArea !== areaFilter) return false;
    return true;
  });

  const handleUpdateStatus = () => {
    if (!currentCase) return;
    const targetStatus = newStatus || (currentCase.status === 'Open' ? 'Assigned' : 'Open');
    onUpdateCase(currentCase.id, {
      status: targetStatus,
      statusType: targetStatus.toLowerCase(),
      note: actionNote.trim()
    });
    setActionNote('');
    showToast?.(`Case ${currentCase.id} updated to '${targetStatus}'`, 'success');
  };

  const handleRequestClarification = () => {
    if (!currentCase) return;
    onUpdateCase(currentCase.id, {
      verification: 'Need information',
      verificationType: 'warning',
      note: actionNote.trim() || 'Clarification requested on citizen contact & evidence'
    });
    setActionNote('');
    showToast?.(`Clarification request dispatched for ${currentCase.id}`, 'info');
  };

  const handleEscalateCase = () => {
    if (!currentCase) return;
    onUpdateCase(currentCase.id, {
      status: 'Escalated',
      statusType: 'escalated',
      priority: 'Critical',
      priorityType: 'critical',
      note: actionNote.trim() || 'Escalated for senior operations specialist oversight'
    });
    setActionNote('');
    showToast?.(`Case ${currentCase.id} escalated to Senior Incident Coordinator`, 'warning');
  };

  const handleExportReport = () => {
    showToast?.('Exporting role-scoped Case Management CSV summary...', 'info');
    setTimeout(() => {
      showToast?.('Export complete: 4 active demonstration records saved.', 'success');
    }, 700);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newId = `HMR-${Math.floor(1040 + Math.random() * 90)}`;
    const createdItem = {
      id: newId,
      category: newRecordForm.category,
      operationalArea: newRecordForm.operationalArea,
      priority: newRecordForm.priority,
      priorityType: newRecordForm.priority.toLowerCase(),
      verification: 'Awaiting review',
      verificationType: 'pending',
      assignedStaff: newRecordForm.assignedStaff,
      status: 'Open',
      statusType: 'open',
      affectedPeople: '4 people',
      currentSafety: 'Reported safe location',
      accessibility: 'None specified',
      submittedAgo: 'Just now',
      citizenQuote: newRecordForm.citizenQuote || 'New prototype record submitted via Case Manager workspace.',
      notes: []
    };
    onCreateCase(createdItem);
    onSelectCase(newId);
    setShowCreateModal(false);
    setNewRecordForm({
      category: 'Emergency Shelter',
      operationalArea: 'Kelani East - Zone 03',
      priority: 'Critical',
      assignedStaff: 'I. Senanayake',
      citizenQuote: ''
    });
    showToast?.(`New prototype case ${newId} logged successfully!`, 'success');
  };

  return (
    <div className="cm-canvas-wrapper">
      {/* Top Header Row */}
      <div className="cm-management-head-row">
        <div>
          <span className="cm-tag-uppercase">CASE MANAGER · CONTROLLED WORKSPACE</span>
          <h1 className="cm-canvas-h1">Case Management</h1>
          <p className="cm-canvas-sub">
            Search, filter and review fictional records within this role's authorised scope.
          </p>
        </div>

        <div className="cm-mgmt-actions-group">
          <button className="cm-btn-export-outline" onClick={handleExportReport}>
            <Download size={14} />
            <span>Export demo report</span>
          </button>

          <button className="cm-btn-create-record" onClick={() => setShowCreateModal(true)}>
            <Plus size={15} />
            <span>+ Create prototype record</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="cm-filter-toolbar">
        <div className="cm-filter-search-wrap">
          <Search size={14} className="cm-search-icon" />
          <input
            type="text"
            placeholder="Search case management..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cm-filter-search-input"
          />
        </div>

        <div className="cm-dropdowns-row">
          <select 
            className="cm-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="Pending">Pending</option>
            <option value="Escalated">Escalated</option>
          </select>

          <select 
            className="cm-filter-select"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="All">All operational areas</option>
            <option value="Kelani East - Zone 03">Kelani East - Zone 03</option>
            <option value="Wattala South">Wattala South</option>
            <option value="Kaduwela West">Kaduwela West</option>
            <option value="Hanwella Zone 02">Hanwella Zone 02</option>
          </select>
        </div>
      </div>

      {/* Two-Column Split Layout: Data Table (Left) + Case Action Drawer (Right) */}
      <div className="cm-mgmt-split-grid">
        {/* Left: Data Table Card */}
        <div className="cm-table-card">
          <table className="cm-mgmt-table">
            <thead>
              <tr>
                <th>CASE ID</th>
                <th>CATEGORY</th>
                <th>OPERATIONAL AREA</th>
                <th>PRIORITY</th>
                <th>VERIFICATION</th>
                <th>ASSIGNED STAFF</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((row) => {
                const isSelected = currentCase?.id === row.id;
                return (
                  <tr
                    key={row.id}
                    className={`cm-table-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectCase(row.id)}
                  >
                    <td className="cm-case-id-cell">{row.id}</td>
                    <td style={{ fontWeight: 600 }}>{row.category}</td>
                    <td>{row.operationalArea}</td>
                    <td>
                      <span className={`cm-pill-tag ${row.priorityType}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td style={{ color: '#475569' }}>{row.verification}</td>
                    <td style={{ fontWeight: 500 }}>{row.assignedStaff}</td>
                    <td>
                      <span className={`cm-status-pill ${row.statusType}`}>
                        ● {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right: Case Action Drawer / Panel */}
        {currentCase && (
          <div className="cm-detail-action-card">
            <div className="cm-detail-head">
              <span className="cm-detail-case-id">{currentCase.id}</span>
              <span className={`cm-status-pill ${currentCase.statusType}`}>
                ● {currentCase.status}
              </span>
            </div>

            <div>
              <h3 className="cm-detail-title">{currentCase.category}</h3>
              <p className="cm-detail-sub">Selected fictional record · role-scoped</p>
            </div>

            <div className="cm-detail-meta-4grid">
              <div className="cm-meta-col">
                <span className="cm-meta-label">OPERATIONAL AREA</span>
                <span className="cm-meta-value">{currentCase.operationalArea}</span>
              </div>
              <div className="cm-meta-col">
                <span className="cm-meta-label">PRIORITY</span>
                <span className={`cm-pill-tag ${currentCase.priorityType}`}>
                  {currentCase.priority}
                </span>
              </div>
              <div className="cm-meta-col">
                <span className="cm-meta-label">VERIFICATION</span>
                <span className="cm-meta-value">{currentCase.verification}</span>
              </div>
              <div className="cm-meta-col">
                <span className="cm-meta-label">ASSIGNED STAFF</span>
                <span className="cm-meta-value">{currentCase.assignedStaff}</span>
              </div>
            </div>

            {/* Action Form */}
            <div className="cm-detail-action-form">
              <label className="cm-form-label">AUTHORISED NOTE / DECISION REASON</label>
              <textarea
                className="cm-form-textarea"
                rows={4}
                placeholder="Avoid unnecessary personal information..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
              />

              <div className="cm-actions-stack">
                <button className="cm-btn-update-status" onClick={handleUpdateStatus}>
                  Update case status
                </button>
                <button className="cm-btn-clarification" onClick={handleRequestClarification}>
                  Request clarification
                </button>
                <button className="cm-btn-escalate" onClick={handleEscalateCase}>
                  Escalate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Prototype Record Modal */}
      {showCreateModal && (
        <div className="cm-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="cm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Create Prototype Case Record</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="cm-form-label">Category</label>
                <select
                  className="cm-filter-select"
                  style={{ width: '100%', marginTop: '4px' }}
                  value={newRecordForm.category}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, category: e.target.value })}
                >
                  <option value="Emergency Shelter">Emergency Shelter</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Food">Food & Water</option>
                  <option value="Transport">Transport / Evacuation</option>
                </select>
              </div>

              <div>
                <label className="cm-form-label">Operational Area</label>
                <input
                  type="text"
                  className="cm-filter-search-input"
                  style={{ marginTop: '4px', paddingLeft: '12px' }}
                  value={newRecordForm.operationalArea}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, operationalArea: e.target.value })}
                />
              </div>

              <div>
                <label className="cm-form-label">Priority</label>
                <select
                  className="cm-filter-select"
                  style={{ width: '100%', marginTop: '4px' }}
                  value={newRecordForm.priority}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, priority: e.target.value })}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>

              <div>
                <label className="cm-form-label">Citizen Need Narrative</label>
                <textarea
                  className="cm-form-textarea"
                  rows={3}
                  placeholder="Enter context without private identity data..."
                  value={newRecordForm.citizenQuote}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, citizenQuote: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="cm-btn-export-outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cm-btn-create-record">
                  Save Prototype Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

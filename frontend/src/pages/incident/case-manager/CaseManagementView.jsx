import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  X,
  ChevronDown,
  ShieldCheck
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

  // Action confirmation modal state ('update' | 'clarify' | 'escalate' | null)
  const [activeActionModal, setActiveActionModal] = useState(null);
  const [modalReason, setModalReason] = useState('');
  const [modalConfirmed, setModalConfirmed] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);

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

  // Action Modal Configurations matching Screenshots 1, 2, 3
  const ACTION_MODAL_CONFIG = {
    update: {
      title: 'Confirm this reviewed action?',
      subtitle: 'Audited case action. Reviewer, reason and timestamp are recorded in the incident status history and audit trail.',
      defaultReason: 'Operational review verified; status updated within assigned scope.',
      toastMessage: (id, target) => `Case ${id} reviewed and status updated to '${target}'`,
      execute: (currCase, reason) => {
        const targetStatus = currCase.status === 'Open' ? 'Assigned' : 'Open';
        onUpdateCase(currCase.id, {
          status: targetStatus,
          statusType: targetStatus.toLowerCase(),
          note: reason
        }, 'update');
        return targetStatus;
      }
    },
    clarify: {
      title: 'Request additional information?',
      subtitle: 'Audited case action. Reviewer, reason and timestamp are recorded in the incident status history and audit trail.',
      defaultReason: 'Clarification requested on citizen contact & operational scope.',
      toastMessage: (id) => `Clarification request recorded for ${id}`,
      execute: (currCase, reason) => {
        onUpdateCase(currCase.id, {
          verification: 'Need information',
          verificationType: 'warning',
          status: 'Pending',
          statusType: 'pending',
          note: reason
        }, 'clarify');
        return 'Pending';
      }
    },
    escalate: {
      title: 'Escalate for review?',
      subtitle: 'Audited case action. Reviewer, reason and timestamp are recorded in the incident escalation and audit trail.',
      defaultReason: 'Escalated for senior operations specialist review.',
      toastMessage: (id) => `Case ${id} escalated to Senior Incident Coordinator`,
      execute: (currCase, reason) => {
        onUpdateCase(currCase.id, {
          status: 'Escalated',
          statusType: 'escalated',
          priority: 'Critical',
          priorityType: 'critical',
          note: reason
        }, 'escalate');
        return 'Escalated';
      }
    }
  };

  const handleOpenActionModal = (type) => {
    setActiveActionModal(type);
    setModalReason(actionNote || '');
    setModalConfirmed(false);
    setCheckboxError(false);
  };

  const handleConfirmActionModal = () => {
    if (!activeActionModal || !currentCase) return;

    if (!modalConfirmed) {
      setCheckboxError(true);
      showToast?.('Please review and check the confirmation checkbox before submitting.', 'warning');
      return;
    }

    const config = ACTION_MODAL_CONFIG[activeActionModal];
    if (config) {
      const finalReason = modalReason.trim() || config.defaultReason;
      const resultStatus = config.execute(currentCase, finalReason);
      showToast?.(config.toastMessage(currentCase.id, resultStatus), 'success');
    }

    setActiveActionModal(null);
    setModalReason('');
    setActionNote('');
    setModalConfirmed(false);
    setCheckboxError(false);
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
                <button 
                  className="cm-btn-update-status" 
                  onClick={() => handleOpenActionModal('update')}
                >
                  Update case status
                </button>
                <button 
                  className="cm-btn-clarification" 
                  onClick={() => handleOpenActionModal('clarify')}
                >
                  Request clarification
                </button>
                <button 
                  className="cm-btn-escalate" 
                  onClick={() => handleOpenActionModal('escalate')}
                >
                  Escalate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Confirmation Modal Card (Screenshots 1, 2, 3) */}
      {activeActionModal && ACTION_MODAL_CONFIG[activeActionModal] && (
        <div 
          className="cm-modal-backdrop" 
          onClick={() => {
            setActiveActionModal(null);
            setCheckboxError(false);
          }}
        >
          <div 
            className="cm-action-modal-card" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top icon bubble with ShieldCheck */}
            <div className="cm-action-modal-icon-bubble">
              <ShieldCheck size={22} className="cm-action-modal-icon" />
            </div>

            {/* Title & Subtitle */}
            <h3 className="cm-action-modal-title">
              {ACTION_MODAL_CONFIG[activeActionModal].title}
            </h3>
            <p className="cm-action-modal-subtitle">
              {ACTION_MODAL_CONFIG[activeActionModal].subtitle}
            </p>

            {/* Required Reason Input */}
            <div style={{ marginBottom: '4px' }}>
              <label className="cm-action-modal-label">
                REQUIRED REASON
              </label>
              <textarea
                className="cm-action-modal-textarea"
                rows={3}
                placeholder="Provide an operational reason..."
                value={modalReason}
                onChange={(e) => setModalReason(e.target.value)}
                autoFocus
              />
            </div>

            {/* Checkbox row */}
            <label className={`cm-action-modal-checkbox-row ${checkboxError && !modalConfirmed ? 'has-error' : ''}`}>
              <input
                type="checkbox"
                checked={modalConfirmed}
                onChange={(e) => {
                  setModalConfirmed(e.target.checked);
                  if (e.target.checked) setCheckboxError(false);
                }}
                className="cm-action-modal-checkbox"
              />
              <span className="cm-action-modal-checkbox-text">
                I reviewed the available information and role scope.
              </span>
            </label>

            {/* Footer Buttons */}
            <div className="cm-action-modal-footer">
              <button
                type="button"
                className="cm-action-modal-btn-cancel"
                onClick={() => {
                  setActiveActionModal(null);
                  setCheckboxError(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cm-action-modal-btn-confirm"
                onClick={handleConfirmActionModal}
              >
                Confirm prototype action
              </button>
            </div>
          </div>
        </div>
      )}

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

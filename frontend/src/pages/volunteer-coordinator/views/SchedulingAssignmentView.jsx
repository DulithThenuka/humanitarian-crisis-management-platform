import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Plus,
  Download,
  ShieldCheck
} from 'lucide-react';
import { OPERATIONAL_AREAS } from '../data/coordinatorData';

/* ─── Confirm Assignment Modal ─── */
const ConfirmAssignmentModal = ({ isOpen, volunteer, shiftTime, shiftTask, onCancel, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [reviewed, setReviewed] = useState(false);

  if (!isOpen || !volunteer) return null;

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
    setReviewed(false);
  };

  const handleCancel = () => {
    setReason('');
    setReviewed(false);
    onCancel();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '480px',
          padding: '28px 28px 24px 28px',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Shield icon */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px'
          }}
        >
          <ShieldCheck size={20} style={{ color: '#16a34a' }} />
        </div>

        {/* Title */}
        <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
          Confirm this reviewed action?
        </h3>

        {/* Subtitle */}
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
          UI-only prototype action. No backend transaction occurs. Reviewer, reason and timestamp
          are represented in the local audit trail.
        </p>

        {/* Required Reason */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#475569',
              marginBottom: '8px'
            }}
          >
            Required reason
          </label>
          <textarea
            rows={4}
            placeholder="Provide an operational reason…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '13px',
              color: '#0f172a',
              fontFamily: 'inherit',
              resize: 'vertical',
              backgroundColor: '#f8fafc',
              outline: 'none'
            }}
            onFocus={(e) => { e.target.style.borderColor = '#0b1528'; e.target.style.backgroundColor = '#fff'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; }}
          />
        </div>

        {/* Acknowledgement checkbox */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            color: '#334155',
            cursor: 'pointer',
            marginBottom: '24px',
            userSelect: 'none'
          }}
        >
          <input
            type="checkbox"
            checked={reviewed}
            onChange={(e) => setReviewed(e.target.checked)}
            style={{ width: '15px', height: '15px', accentColor: '#0b1528', cursor: 'pointer' }}
          />
          I reviewed the available information and role scope.
        </label>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#ffffff'; }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reviewed}
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: reviewed ? '#0b1528' : '#94a3b8',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: reviewed ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => { if (reviewed) e.target.style.backgroundColor = '#1e3a5f'; }}
            onMouseLeave={(e) => { if (reviewed) e.target.style.backgroundColor = '#0b1528'; }}
          >
            Confirm prototype action
          </button>
        </div>
      </div>
    </div>
  );
};

export const SchedulingAssignmentView = ({
  volunteers,
  onAssignShift,
  onRequestClarification,
  onEscalate,
  onOpenCreateModal,
  onOpenExportModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(volunteers[0]?.id || 'VOL-0104');
  const [selectedShiftTime, setSelectedShiftTime] = useState('08:00-14:00');
  const [selectedShiftTask, setSelectedShiftTask] = useState('Supply delivery');
  const [authorizedNote, setAuthorizedNote] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const selectedVolunteer =
    volunteers.find((v) => v.id === selectedVolunteerId) || volunteers[0];

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((vol) => {
      const matchesSearch =
        vol.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.serviceArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.currentShift.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || vol.status === statusFilter;

      const matchesArea =
        areaFilter === 'All' || areaFilter === 'All operational areas' || vol.serviceArea === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [volunteers, searchTerm, statusFilter, areaFilter]);

  const handleConfirmAssignment = () => {
    if (!selectedVolunteer) return;
    onAssignShift(selectedVolunteer.id, selectedShiftTime, selectedShiftTask, authorizedNote);
    setFeedbackMsg({
      type: 'success',
      text: `Shift successfully assigned to ${selectedVolunteer.id} (${selectedShiftTime} - ${selectedShiftTask}). Record audit logged.`
    });
    setAuthorizedNote('');
    setConfirmModalOpen(false);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleClarification = () => {
    if (!selectedVolunteer) return;
    onRequestClarification(selectedVolunteer.id, authorizedNote || 'Verification check required on operational availability');
    setFeedbackMsg({
      type: 'info',
      text: `Clarification request sent for ${selectedVolunteer.id}. Supervisor alerted.`
    });
    setAuthorizedNote('');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleEscalate = () => {
    if (!selectedVolunteer) return;
    onEscalate(selectedVolunteer.id, authorizedNote || 'Escalation raised for coordinator review');
    setFeedbackMsg({
      type: 'warning',
      text: `Record ${selectedVolunteer.id} escalated to District Emergency Ops Command.`
    });
    setAuthorizedNote('');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div>
      {/* Confirmation Modal */}
      <ConfirmAssignmentModal
        isOpen={confirmModalOpen}
        volunteer={selectedVolunteer}
        shiftTime={selectedShiftTime}
        shiftTask={selectedShiftTask}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={(reason) => {
          setAuthorizedNote(reason || authorizedNote);
          handleConfirmAssignment();
        }}
      />

      {/* 1. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">Volunteer Coordinator - Controlled Workspace</div>
          <h1 className="vc-page-title">Scheduling & Assignment</h1>
          <p className="vc-page-desc">
            Search, filter and review fictional records within this role's authorised scope.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="vc-btn-outline" onClick={onOpenExportModal}>
            <Download size={14} />
            <span>Export demo report</span>
          </button>
          <button className="vc-btn-primary" onClick={onOpenCreateModal}>
            <Plus size={15} />
            <span>+ Create prototype record</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor:
              feedbackMsg.type === 'success'
                ? '#ecfdf5'
                : feedbackMsg.type === 'warning'
                ? '#fffbeb'
                : '#eff6ff',
            color:
              feedbackMsg.type === 'success'
                ? '#065f46'
                : feedbackMsg.type === 'warning'
                ? '#92400e'
                : '#1e40af',
            border: `1px solid ${
              feedbackMsg.type === 'success'
                ? '#a7f3d0'
                : feedbackMsg.type === 'warning'
                ? '#fde68a'
                : '#bfdbfe'
            }`
          }}
        >
          <CheckCircle2 size={16} />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 2. Filter Bar */}
      <div className="vc-filter-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
          />
          <input
            type="text"
            className="vc-filter-input"
            style={{ paddingLeft: '32px', width: '100%', boxSizing: 'border-box' }}
            placeholder="Search scheduling & assignment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="vc-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Eligible">Eligible</option>
          <option value="Assigned">Assigned</option>
          <option value="Review">Review</option>
        </select>

        <select
          className="vc-filter-select"
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
        >
          {OPERATIONAL_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Main Split Content */}
      <div className="vc-split-layout">
        {/* Left Table */}
        <div className="vc-split-main">
          <div className="vc-table-card">
            <table className="vc-table">
              <thead>
                <tr>
                  <th>Volunteer Ref</th>
                  <th>Verified Skills</th>
                  <th>Service Area</th>
                  <th>Availability</th>
                  <th>Current Shift</th>
                  <th>Verification</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                      No volunteers found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredVolunteers.map((vol) => {
                    const isSelected = selectedVolunteer?.id === vol.id;
                    const statusClass =
                      vol.status === 'Eligible'
                        ? 'vc-status-eligible'
                        : vol.status === 'Assigned'
                        ? 'vc-status-assigned'
                        : 'vc-status-review';

                    return (
                      <tr
                        key={vol.id}
                        className={isSelected ? 'selected' : ''}
                        onClick={() => setSelectedVolunteerId(vol.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ fontWeight: 600, color: '#0f172a' }}>{vol.id}</td>
                        <td style={{ color: '#334155' }}>{vol.skills}</td>
                        <td style={{ color: '#475569' }}>{vol.serviceArea}</td>
                        <td style={{ color: '#475569' }}>{vol.availability}</td>
                        <td style={{ color: '#475569' }}>{vol.currentShift}</td>
                        <td style={{ color: '#334155' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {vol.verification === 'Verified' ? (
                              <CheckCircle2 size={13} style={{ color: '#166534' }} />
                            ) : (
                              <Clock size={13} style={{ color: '#92400e' }} />
                            )}
                            {vol.verification}
                          </span>
                        </td>
                        <td>
                          <span className={`vc-status-badge ${statusClass}`}>
                            <span className="dot" />
                            {vol.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Inspector Panel */}
        {selectedVolunteer && (
          <div className="vc-inspector">
            <div className="vc-inspector-header">
              <div>
                <div className="vc-inspector-title">
                  {selectedVolunteer.id} - {selectedVolunteer.skills}
                </div>
                <div className="vc-inspector-sub">
                  Selected fictional record · role-scoped
                </div>
              </div>
              <span
                className={`vc-status-badge ${
                  selectedVolunteer.status === 'Eligible'
                    ? 'vc-status-eligible'
                    : selectedVolunteer.status === 'Assigned'
                    ? 'vc-status-assigned'
                    : 'vc-status-review'
                }`}
              >
                <span className="dot" />
                {selectedVolunteer.status}
              </span>
            </div>

            <div className="vc-inspector-grid">
              <div className="vc-inspector-field">
                <span className="label">Service area</span>
                <span className="value">{selectedVolunteer.serviceArea}</span>
              </div>
              <div className="vc-inspector-field">
                <span className="label">Availability</span>
                <span className="value">{selectedVolunteer.availability}</span>
              </div>
              <div className="vc-inspector-field">
                <span className="label">Current shift</span>
                <span className="value">{selectedVolunteer.currentShift}</span>
              </div>
              <div className="vc-inspector-field">
                <span className="label">Verification</span>
                <span className="value">{selectedVolunteer.verification}</span>
              </div>
            </div>

            {/* Shift Assignment Selector */}
            <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                Shift Allocation Options
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Shift Window</label>
                  <select
                    className="vc-filter-select"
                    style={{ width: '100%', fontSize: '12px' }}
                    value={selectedShiftTime}
                    onChange={(e) => setSelectedShiftTime(e.target.value)}
                  >
                    <option value="08:00-14:00">08:00 - 14:00 (Morning)</option>
                    <option value="14:00-20:00">14:00 - 20:00 (Evening)</option>
                    <option value="20:00-02:00">20:00 - 02:00 (Night)</option>
                    <option value="Standby">Standby On-call</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Task Type</label>
                  <select
                    className="vc-filter-select"
                    style={{ width: '100%', fontSize: '12px' }}
                    value={selectedShiftTask}
                    onChange={(e) => setSelectedShiftTask(e.target.value)}
                  >
                    <option value="Supply delivery">Supply delivery</option>
                    <option value="Shelter support">Shelter support</option>
                    <option value="First aid post">First aid post</option>
                    <option value="Logistics dispatch">Logistics dispatch</option>
                    <option value="Medical assistance">Medical assistance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Authorised Note */}
            <div style={{ marginTop: '16px' }}>
              <label className="vc-inspector-field label" style={{ display: 'block', marginBottom: '6px' }}>
                Authorised note / decision reason
              </label>
              <textarea
                className="vc-textarea"
                rows={3}
                placeholder="Avoid unnecessary personal information..."
                value={authorizedNote}
                onChange={(e) => setAuthorizedNote(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="vc-inspector-actions">
              <button className="vc-btn-primary" onClick={() => setConfirmModalOpen(true)}>
                Confirm assignment
              </button>
              <button className="vc-btn-secondary" onClick={handleClarification}>
                Request clarification
              </button>
              <button className="vc-btn-secondary" style={{ color: '#b91c1c' }} onClick={handleEscalate}>
                Escalate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


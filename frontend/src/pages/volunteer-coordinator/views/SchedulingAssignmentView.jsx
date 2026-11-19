import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Plus,
  Download,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckSquare
} from 'lucide-react';
import { OPERATIONAL_AREAS } from '../data/coordinatorData';

/* ─── Confirm Assignment Modal ─── */
const ConfirmAssignmentModal = ({
  isOpen,
  volunteer,
  shiftTime,
  shiftTask,
  onCancel,
  onConfirm,
  isSubmitting = false
}) => {
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
        <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#14291e' }}>
          Confirm Field Shift Assignment
        </h3>

        {/* Subtitle */}
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#657367', lineHeight: 1.5 }}>
          Assigning {volunteer.name || volunteer.id} to <strong>{shiftTask}</strong> ({shiftTime}) in {volunteer.serviceArea}. This assignment will be validated and saved directly to the platform database.
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
              color: '#4a5b4a',
              marginBottom: '8px'
            }}
          >
            Assignment reason / deployment note
          </label>
          <textarea
            rows={4}
            placeholder="Operational justification (e.g. Surge deployment for flood relief)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #dfe5d8',
              fontSize: '13px',
              color: '#14291e',
              fontFamily: 'inherit',
              resize: 'vertical',
              backgroundColor: '#f4f6f2',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#14291e';
              e.target.style.backgroundColor = '#fff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#dfe5d8';
              e.target.style.backgroundColor = '#f4f6f2';
            }}
          />
        </div>

        {/* Acknowledgement checkbox */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            color: '#2a4a35',
            cursor: 'pointer',
            marginBottom: '24px',
            userSelect: 'none'
          }}
        >
          <input
            type="checkbox"
            checked={reviewed}
            onChange={(e) => setReviewed(e.target.checked)}
            disabled={isSubmitting}
            style={{ width: '15px', height: '15px', accentColor: '#14291e', cursor: 'pointer' }}
          />
          I confirmed volunteer eligibility, verification, and non-conflicting shift hours.
        </label>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              border: '1px solid #dfe5d8',
              backgroundColor: '#ffffff',
              color: '#4a5b4a',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#eef1ea';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reviewed || isSubmitting}
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: reviewed && !isSubmitting ? '#14291e' : '#8a9480',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: reviewed && !isSubmitting ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              if (reviewed && !isSubmitting) e.target.style.backgroundColor = '#1e3a5f';
            }}
            onMouseLeave={(e) => {
              if (reviewed && !isSubmitting) e.target.style.backgroundColor = '#14291e';
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="vc-spin" />
                Assigning...
              </>
            ) : (
              'Confirm Assignment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const SchedulingAssignmentView = ({
  volunteers = [],
  onAssignShift,
  onCompleteAssignment,
  onReleaseAssignment,
  onRequestClarification,
  onEscalate,
  onOpenCreateModal,
  onOpenExportModal,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(volunteers[0]?.id || '');
  const [selectedShiftTime, setSelectedShiftTime] = useState('08:00-14:00');
  const [selectedShiftTask, setSelectedShiftTask] = useState('Supply delivery');
  const [authorizedNote, setAuthorizedNote] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVolunteer =
    volunteers.find((v) => v.id === selectedVolunteerId) || volunteers[0];

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((vol) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        (vol.id && vol.id.toLowerCase().includes(q)) ||
        (vol.name && vol.name.toLowerCase().includes(q)) ||
        (vol.skills && vol.skills.toLowerCase().includes(q)) ||
        (vol.serviceArea && vol.serviceArea.toLowerCase().includes(q)) ||
        (vol.currentShift && vol.currentShift.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'All' ||
        vol.status === statusFilter ||
        vol.statusType === statusFilter.toLowerCase();

      const matchesArea =
        areaFilter === 'All' ||
        areaFilter === 'All operational areas' ||
        vol.serviceArea === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [volunteers, searchTerm, statusFilter, areaFilter]);

  const handlePreAssignmentCheck = () => {
    if (!selectedVolunteer) return;

    // Validation 1: Already assigned conflict check
    if (selectedVolunteer.status === 'Assigned' && selectedVolunteer.currentShift !== 'None') {
      setFeedbackMsg({
        type: 'warning',
        text: `Conflict warning: Volunteer ${selectedVolunteer.id} is already assigned to "${selectedVolunteer.currentShift}". Releasing or completing previous assignment is recommended before reallocating.`
      });
      // We still allow coordinator override if intentional
    }

    setConfirmModalOpen(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedVolunteer) return;
    setIsSubmitting(true);
    try {
      await onAssignShift(selectedVolunteer.id, selectedShiftTime, selectedShiftTask, authorizedNote);
      setFeedbackMsg({
        type: 'success',
        text: `Shift successfully assigned to ${selectedVolunteer.id} (${selectedShiftTime} - ${selectedShiftTask}). Record saved to database.`
      });
      setAuthorizedNote('');
      setConfirmModalOpen(false);
      setTimeout(() => setFeedbackMsg(null), 5000);
    } catch (err) {
      setFeedbackMsg({
        type: 'warning',
        text: err.message || 'Failed to persist assignment to database.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteShift = async () => {
    if (!selectedVolunteer) return;
    setIsSubmitting(true);
    try {
      if (onCompleteAssignment) {
        await onCompleteAssignment(selectedVolunteer.id, authorizedNote);
      } else {
        // Fallback: update status to Eligible, shift to None
        await onAssignShift(selectedVolunteer.id, 'Available', 'None', authorizedNote || 'Shift completed successfully');
      }
      setFeedbackMsg({
        type: 'success',
        text: `Assignment completed for ${selectedVolunteer.id}. Volunteer returned to available pool.`
      });
      setAuthorizedNote('');
      setTimeout(() => setFeedbackMsg(null), 5000);
    } catch (err) {
      setFeedbackMsg({
        type: 'warning',
        text: err.message || 'Failed to complete assignment.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReleaseShift = async () => {
    if (!selectedVolunteer) return;
    setIsSubmitting(true);
    try {
      if (onReleaseAssignment) {
        await onReleaseAssignment(selectedVolunteer.id, authorizedNote);
      } else {
        await onAssignShift(selectedVolunteer.id, 'Available', 'None', authorizedNote || 'Assignment released/cancelled');
      }
      setFeedbackMsg({
        type: 'info',
        text: `Assignment released for ${selectedVolunteer.id}. Availability restored in database.`
      });
      setAuthorizedNote('');
      setTimeout(() => setFeedbackMsg(null), 5000);
    } catch (err) {
      setFeedbackMsg({
        type: 'warning',
        text: err.message || 'Failed to release assignment.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClarification = async () => {
    if (!selectedVolunteer) return;
    try {
      await onRequestClarification(selectedVolunteer.id, authorizedNote || 'Verification check required on operational availability');
      setFeedbackMsg({
        type: 'info',
        text: `Clarification request saved for ${selectedVolunteer.id}. Supervisor alerted.`
      });
      setAuthorizedNote('');
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      setFeedbackMsg({ type: 'warning', text: err.message || 'Failed to send clarification.' });
    }
  };

  const handleEscalate = async () => {
    if (!selectedVolunteer) return;
    try {
      await onEscalate(selectedVolunteer.id, authorizedNote || 'Escalation raised for coordinator review');
      setFeedbackMsg({
        type: 'warning',
        text: `Record ${selectedVolunteer.id} escalated to District Emergency Ops Command.`
      });
      setAuthorizedNote('');
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      setFeedbackMsg({ type: 'warning', text: err.message || 'Failed to escalate.' });
    }
  };

  return (
    <div>
      {/* Confirmation Modal */}
      <ConfirmAssignmentModal
        isOpen={confirmModalOpen}
        volunteer={selectedVolunteer}
        shiftTime={selectedShiftTime}
        shiftTask={selectedShiftTask}
        isSubmitting={isSubmitting}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={(reason) => {
          setAuthorizedNote(reason || authorizedNote);
          handleConfirmAssignment();
        }}
      />

      {/* 1. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">ReliefCore Volunteer Scheduling</div>
          <h1 className="vc-page-title">Scheduling & Assignment</h1>
          <p className="vc-page-desc">
            Allocate validated volunteers to priority operational shifts and manage active deployment lifecycle.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="vc-btn-outline" onClick={onOpenExportModal}>
            <Download size={14} />
            <span>Export Report</span>
          </button>
          <button className="vc-btn-primary" onClick={onOpenCreateModal}>
            <Plus size={15} />
            <span>+ Register Volunteer</span>
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
          {feedbackMsg.type === 'warning' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
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
              color: '#8a9480'
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
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#657367' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Loader2 size={16} className="vc-spin" />
                        Loading records from database...
                      </div>
                    </td>
                  </tr>
                ) : filteredVolunteers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#657367' }}>
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
                        <td style={{ fontWeight: 600, color: '#14291e' }}>{vol.id}</td>
                        <td style={{ color: '#2a4a35' }}>{vol.skills}</td>
                        <td style={{ color: '#4a5b4a' }}>{vol.serviceArea}</td>
                        <td style={{ color: '#4a5b4a' }}>{vol.availability}</td>
                        <td style={{ color: vol.currentShift === 'None' ? '#8a9480' : '#2a4a35', fontWeight: vol.currentShift !== 'None' ? 600 : 400 }}>
                          {vol.currentShift}
                        </td>
                        <td style={{ color: '#2a4a35' }}>
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
                  {selectedVolunteer.id} - {selectedVolunteer.name || selectedVolunteer.skills}
                </div>
                <div className="vc-inspector-sub">
                  Operational record · role-scoped
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
            <div style={{ marginTop: '16px', padding: '12px', background: '#f4f6f2', borderRadius: '8px', border: '1px solid #dfe5d8' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#4a5b4a', textTransform: 'uppercase', marginBottom: '8px' }}>
                Shift Allocation Options
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ fontSize: '10px', color: '#657367', display: 'block', marginBottom: '4px' }}>Shift Window</label>
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
                  <label style={{ fontSize: '10px', color: '#657367', display: 'block', marginBottom: '4px' }}>Task Type</label>
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
              <button
                className="vc-btn-primary"
                onClick={handlePreAssignmentCheck}
                disabled={isSubmitting}
              >
                {selectedVolunteer.status === 'Assigned' ? 'Reassign Shift' : 'Assign Shift'}
              </button>

              {selectedVolunteer.status === 'Assigned' && (
                <>
                  <button
                    className="vc-btn-secondary"
                    style={{ color: '#166534', borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}
                    onClick={handleCompleteShift}
                    disabled={isSubmitting}
                    title="Mark task completed and release volunteer"
                  >
                    Complete Shift
                  </button>
                  <button
                    className="vc-btn-secondary"
                    style={{ color: '#92400e', borderColor: '#fde68a' }}
                    onClick={handleReleaseShift}
                    disabled={isSubmitting}
                    title="Release assignment without completion"
                  >
                    Release Shift
                  </button>
                </>
              )}

              <button className="vc-btn-secondary" onClick={handleClarification} disabled={isSubmitting}>
                Request clarification
              </button>
              <button className="vc-btn-secondary" style={{ color: '#b91c1c' }} onClick={handleEscalate} disabled={isSubmitting}>
                Escalate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulingAssignmentView;

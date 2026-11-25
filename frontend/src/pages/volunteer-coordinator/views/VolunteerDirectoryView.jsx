import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Plus,
  Download,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Edit,
  Trash2
} from 'lucide-react';
import { OPERATIONAL_AREAS } from '../data/coordinatorData';
import { EditVolunteerModal } from '../components/EditVolunteerModal';

/* ─── Shared Action Modal ─── */
const ActionModal = ({
  isOpen,
  onCancel,
  onConfirm,
  icon,
  iconBg,
  title,
  subtitle,
  confirmLabel,
  confirmBg,
  confirmHoverBg,
  isSubmitting = false
}) => {
  const [reason, setReason] = useState('');
  const [reviewed, setReviewed] = useState(false);

  if (!isOpen) return null;

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
        {/* Icon */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px'
          }}
        >
          {icon}
        </div>

        <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#14291e' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#657367', lineHeight: 1.5 }}>
          {subtitle}
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
            Required reason / audit justification
          </label>
          <textarea
            rows={4}
            placeholder="Provide an operational justification for the audit trail…"
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
              e.target.style.borderColor = confirmBg;
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
            style={{ width: '15px', height: '15px', accentColor: confirmBg, cursor: 'pointer' }}
          />
          I have reviewed the volunteer profile, credentials, and role scope.
        </label>

        {/* Buttons */}
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
              backgroundColor: reviewed && !isSubmitting ? confirmBg : '#8a9480',
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
              if (reviewed && !isSubmitting) e.target.style.backgroundColor = confirmHoverBg;
            }}
            onMouseLeave={(e) => {
              if (reviewed && !isSubmitting) e.target.style.backgroundColor = confirmBg;
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="vc-spin" />
                Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main View ─── */
export const VolunteerDirectoryView = ({
  volunteers = [],
  onConfirmAssignment,
  onRequestClarification,
  onEscalate,
  onUpdateVolunteer,
  onDeleteVolunteer,
  onOpenCreateModal,
  onOpenExportModal,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(volunteers[0]?.id || '');
  const [authorizedNote, setAuthorizedNote] = useState('');
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  // Modal states
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [clarifyModalOpen, setClarifyModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [volunteerToEdit, setVolunteerToEdit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState(null);

  const [successBanner, setSuccessBanner] = useState(null);
  const [errorBanner, setErrorBanner] = useState(null);

  const selectedVolunteer =
    volunteers.find((v) => v.id === selectedVolunteerId) || volunteers[0];

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((vol) => {
      const q = searchTerm.toLowerCase();
      const code = (vol.volunteerCode || vol.id || '').toLowerCase();
      const name = (vol.fullName || vol.name || '').toLowerCase();
      const email = (vol.email || '').toLowerCase();
      const skills = (vol.skills || '').toLowerCase();
      const area = (vol.serviceArea || '').toLowerCase();
      const phone = (vol.phoneNumber || vol.phone || '').toLowerCase();

      const matchesSearch =
        !q ||
        code.includes(q) ||
        name.includes(q) ||
        email.includes(q) ||
        skills.includes(q) ||
        area.includes(q) ||
        phone.includes(q);

      const matchesStatus =
        statusFilter === 'All' ||
        (vol.status && vol.status.toLowerCase() === statusFilter.toLowerCase()) ||
        (vol.statusType && vol.statusType.toLowerCase() === statusFilter.toLowerCase());

      const matchesArea =
        areaFilter === 'All' ||
        areaFilter === 'All operational areas' ||
        (vol.serviceArea && vol.serviceArea.toLowerCase() === areaFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [volunteers, searchTerm, statusFilter, areaFilter]);

  const showBanner = (msg) => {
    setSuccessBanner(msg);
    setErrorBanner(null);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const showError = (msg) => {
    setErrorBanner(msg);
    setTimeout(() => setErrorBanner(null), 6000);
  };

  const handleConfirmFromModal = async (reason) => {
    if (!selectedVolunteer) return;
    setIsActionSubmitting(true);
    try {
      await onConfirmAssignment(selectedVolunteer.id, reason || authorizedNote);
      setConfirmModalOpen(false);
      setAuthorizedNote('');
      showBanner(`Operational verification & assignment successfully saved for ${selectedVolunteer.volunteerCode || selectedVolunteer.id} (${selectedVolunteer.fullName || selectedVolunteer.name}). Database updated.`);
    } catch (err) {
      showError(err.message || 'Failed to update volunteer record in database.');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleClarifyFromModal = async (reason) => {
    if (!selectedVolunteer) return;
    setIsActionSubmitting(true);
    try {
      await onRequestClarification(selectedVolunteer.id, reason || authorizedNote);
      setClarifyModalOpen(false);
      setAuthorizedNote('');
      showBanner(`Clarification request saved for ${selectedVolunteer.volunteerCode || selectedVolunteer.id}. Record set to Review in database.`);
    } catch (err) {
      showError(err.message || 'Failed to request clarification.');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleEscalateFromModal = async (reason) => {
    if (!selectedVolunteer) return;
    setIsActionSubmitting(true);
    try {
      await onEscalate(selectedVolunteer.id, reason || authorizedNote);
      setEscalateModalOpen(false);
      setAuthorizedNote('');
      showBanner(`Record ${selectedVolunteer.volunteerCode || selectedVolunteer.id} escalated to District Emergency Ops Command. Audit record persisted.`);
    } catch (err) {
      showError(err.message || 'Failed to escalate record.');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleEditSave = async (id, updatedData) => {
    if (!onUpdateVolunteer) return;
    try {
      await onUpdateVolunteer(id, updatedData);
      setEditModalOpen(false);
      setVolunteerToEdit(null);
      showBanner(`Volunteer ${updatedData.fullName || updatedData.name || id} updated successfully in SQL Server database.`);
    } catch (err) {
      showError(err.message || 'Failed to update volunteer record in database.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!volunteerToDelete || !onDeleteVolunteer) return;
    setIsActionSubmitting(true);
    try {
      await onDeleteVolunteer(volunteerToDelete.id);
      setDeleteModalOpen(false);
      showBanner(`Volunteer record ${volunteerToDelete.volunteerCode || volunteerToDelete.id} successfully processed in database.`);
      setVolunteerToDelete(null);
    } catch (err) {
      showError(err.message || 'Failed to delete volunteer record.');
    } finally {
      setIsActionSubmitting(false);
    }
  };

  return (
    <div>
      {/* ── Modals ── */}
      <ActionModal
        isOpen={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmFromModal}
        isSubmitting={isActionSubmitting}
        icon={<ShieldCheck size={20} style={{ color: '#16a34a' }} />}
        iconBg="#f0fdf4"
        title="Verify and Activate Volunteer"
        subtitle="Confirms identity credentials and activates volunteer for field shift deployment. Saves changes to SQL Server database."
        confirmLabel="Confirm & Persist"
        confirmBg="#14291e"
        confirmHoverBg="#1f3f2f"
      />

      <ActionModal
        isOpen={clarifyModalOpen}
        onCancel={() => setClarifyModalOpen(false)}
        onConfirm={handleClarifyFromModal}
        isSubmitting={isActionSubmitting}
        icon={<HelpCircle size={20} style={{ color: '#2563eb' }} />}
        iconBg="#eff6ff"
        title="Request Clarification on Record"
        subtitle="Places record into Review status and logs clarification notice for district supervisor review."
        confirmLabel="Submit Clarification"
        confirmBg="#2563eb"
        confirmHoverBg="#1d4ed8"
      />

      <ActionModal
        isOpen={escalateModalOpen}
        onCancel={() => setEscalateModalOpen(false)}
        onConfirm={handleEscalateFromModal}
        isSubmitting={isActionSubmitting}
        icon={<AlertTriangle size={20} style={{ color: '#dc2626' }} />}
        iconBg="#fef2f2"
        title="Escalate Volunteer Record"
        subtitle="Flags this record for District Emergency Operations Command with an audit justification."
        confirmLabel="Escalate Record"
        confirmBg="#dc2626"
        confirmHoverBg="#b91c1c"
      />

      {/* Delete / Deactivate Action Modal */}
      <ActionModal
        isOpen={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setVolunteerToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isActionSubmitting}
        icon={<Trash2 size={20} style={{ color: '#dc2626' }} />}
        iconBg="#fef2f2"
        title={`Delete / Deactivate Volunteer: ${volunteerToDelete?.volunteerCode || volunteerToDelete?.id}`}
        subtitle={`Permanently removes this record from the database if there are no assignments, or safely deactivates the profile to protect foreign key integrity and audit logs.`}
        confirmLabel="Confirm Delete / Deactivate"
        confirmBg="#dc2626"
        confirmHoverBg="#b91c1c"
      />

      {/* Edit Volunteer Modal */}
      <EditVolunteerModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setVolunteerToEdit(null);
        }}
        volunteer={volunteerToEdit}
        onUpdateVolunteer={handleEditSave}
      />

      {/* 1. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">ReliefCore Volunteer Management</div>
          <h1 className="vc-page-title">Volunteer Directory</h1>
          <p className="vc-page-desc">
            Search, filter, verify and review authorized volunteer responder records from SQL Server.
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

      {/* Success Banner */}
      {successBanner && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorBanner && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} />
          <span>{errorBanner}</span>
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
            placeholder="Search volunteer ref, name, skills, or area..."
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
          {OPERATIONAL_AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* 3. 2-Column Workspace Layout */}
      <div className="vc-workspace-layout">
        {/* Left: Data Table */}
        <div className="vc-table-card">
          <table className="vc-data-table">
            <thead>
              <tr>
                <th>Volunteer Ref</th>
                <th>Volunteer Name</th>
                <th>Verified Skills</th>
                <th>Service Area</th>
                <th>Availability</th>
                <th>Current Shift</th>
                <th>Verification</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#657367' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Loader2 size={16} className="vc-spin" />
                      Loading volunteers from SQL Server...
                    </div>
                  </td>
                </tr>
              ) : filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#657367' }}>
                    <div>No volunteer records found matching your filters.</div>
                    <button
                      className="vc-btn-outline"
                      style={{ marginTop: '12px', fontSize: '12px' }}
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('All');
                        setAreaFilter('All');
                      }}
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((vol) => (
                  <tr
                    key={vol.id}
                    className={selectedVolunteer?.id === vol.id ? 'selected' : ''}
                    onClick={() => setSelectedVolunteerId(vol.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="vc-ref-mono">{vol.volunteerCode || vol.id?.slice(0, 8) || vol.id}</td>
                    <td style={{ fontWeight: 700, color: '#14291e' }}>{vol.fullName || vol.name || 'Volunteer Member'}</td>
                    <td style={{ fontWeight: 500 }}>{vol.skills}</td>
                    <td>{vol.serviceArea}</td>
                    <td>{vol.availability}</td>
                    <td style={{ color: vol.currentShift === 'None' ? '#8a9480' : '#2a4a35' }}>
                      {vol.currentShift}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          color: vol.verification === 'Verified' ? '#15803d' : '#b45309',
                          fontWeight: 600
                        }}
                      >
                        {vol.verification}
                      </span>
                    </td>
                    <td>
                      <span className={`vc-status-pill ${vol.statusType || vol.status?.toLowerCase() || 'eligible'}`}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor:
                              vol.status === 'Eligible'
                                ? '#22c55e'
                                : vol.status === 'Assigned'
                                ? '#3d6b4f'
                                : '#f59e0b'
                          }}
                        />
                        {vol.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="vc-btn-outline"
                          style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Edit Volunteer in SQL Server"
                          onClick={() => {
                            setVolunteerToEdit(vol);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="vc-btn-outline"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#dc2626', borderColor: '#fecaca', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Delete / Deactivate from SQL Server"
                          onClick={() => {
                            setVolunteerToDelete(vol);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right: Inspector Detail Panel */}
        {selectedVolunteer && (
          <div className="vc-inspector-card">
            <div className="vc-inspector-ref">{selectedVolunteer.volunteerCode || selectedVolunteer.id?.slice(0, 8) || selectedVolunteer.id}</div>
            <div className="vc-inspector-header">
              <h3 className="vc-inspector-title">{selectedVolunteer.fullName || selectedVolunteer.name || selectedVolunteer.skills}</h3>
              <span className={`vc-status-pill ${selectedVolunteer.statusType || selectedVolunteer.status?.toLowerCase() || 'eligible'}`}>
                {selectedVolunteer.status}
              </span>
            </div>
            <div className="vc-inspector-sub">Operational database record · SQL Server connected</div>

            <div className="vc-inspector-grid">
              <div>
                <div className="vc-grid-key">Full Name</div>
                <div className="vc-grid-val" style={{ fontWeight: 600 }}>{selectedVolunteer.fullName || selectedVolunteer.name || 'N/A'}</div>
              </div>
              <div>
                <div className="vc-grid-key">Email</div>
                <div className="vc-grid-val">{selectedVolunteer.email || 'N/A'}</div>
              </div>
              <div>
                <div className="vc-grid-key">Contact / Phone</div>
                <div className="vc-grid-val">{selectedVolunteer.phoneNumber || selectedVolunteer.phone || 'N/A'}</div>
              </div>
              <div>
                <div className="vc-grid-key">Service area</div>
                <div className="vc-grid-val">{selectedVolunteer.serviceArea}</div>
              </div>
              <div>
                <div className="vc-grid-key">Verified Skills</div>
                <div className="vc-grid-val">{selectedVolunteer.skills}</div>
              </div>
              <div>
                <div className="vc-grid-key">Availability</div>
                <div className="vc-grid-val">{selectedVolunteer.availability}</div>
              </div>
              <div>
                <div className="vc-grid-key">Current shift</div>
                <div className="vc-grid-val">{selectedVolunteer.currentShift}</div>
              </div>
              <div>
                <div className="vc-grid-key">Verification</div>
                <div className="vc-grid-val">{selectedVolunteer.verification}</div>
              </div>
            </div>

            {selectedVolunteer.notes && (
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#657367', backgroundColor: '#f4f6f2', padding: '6px 10px', borderRadius: '4px' }}>
                <strong>Audit Notes:</strong> {selectedVolunteer.notes}
              </div>
            )}

            <div style={{ marginTop: '12px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#657367',
                  marginBottom: '6px'
                }}
              >
                Authorised note / decision reason
              </label>
              <textarea
                className="vc-textarea-field"
                rows="3"
                placeholder="Avoid unnecessary personal information..."
                value={authorizedNote}
                onChange={(e) => setAuthorizedNote(e.target.value)}
              />
            </div>

            <div className="vc-inspector-actions">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <button
                  className="vc-btn-primary"
                  style={{ justifyContent: 'center' }}
                  onClick={() => {
                    setVolunteerToEdit(selectedVolunteer);
                    setEditModalOpen(true);
                  }}
                >
                  <Edit size={14} />
                  <span>Edit Details</span>
                </button>
                <button
                  className="vc-btn-outline"
                  style={{ justifyContent: 'center', color: '#dc2626', borderColor: '#fecaca' }}
                  onClick={() => {
                    setVolunteerToDelete(selectedVolunteer);
                    setDeleteModalOpen(true);
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete / Deactivate</span>
                </button>
              </div>

              <button
                className="vc-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setConfirmModalOpen(true)}
              >
                Verify / Activate
              </button>
              <button
                className="vc-btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setClarifyModalOpen(true)}
              >
                Request clarification
              </button>
              <button
                className="vc-btn-outline"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  color: '#dc2626',
                  borderColor: '#fecaca'
                }}
                onClick={() => setEscalateModalOpen(true)}
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

export default VolunteerDirectoryView;

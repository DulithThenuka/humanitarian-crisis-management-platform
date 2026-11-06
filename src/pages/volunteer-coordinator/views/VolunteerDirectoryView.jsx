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
const ConfirmAssignmentModal = ({ isOpen, volunteer, onCancel, onConfirm }) => {
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
              fontFamily: 'inherit',
              transition: 'all 0.15s'
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
              fontFamily: 'inherit',
              transition: 'all 0.15s'
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

/* ─── Main View ─── */
export const VolunteerDirectoryView = ({
  volunteers,
  onConfirmAssignment,
  onRequestClarification,
  onEscalate,
  onOpenCreateModal,
  onOpenExportModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(volunteers[0]?.id || 'VOL-0104');
  const [authorizedNote, setAuthorizedNote] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  const selectedVolunteer =
    volunteers.find((v) => v.id === selectedVolunteerId) || volunteers[0];

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((vol) => {
      const matchesSearch =
        vol.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.serviceArea.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || vol.status === statusFilter;

      const matchesArea =
        areaFilter === 'All' || areaFilter === 'All operational areas' || vol.serviceArea === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [volunteers, searchTerm, statusFilter, areaFilter]);

  const handleConfirmFromModal = (reason) => {
    const finalNote = reason || authorizedNote;
    onConfirmAssignment(selectedVolunteer.id, finalNote);
    setConfirmModalOpen(false);
    setAuthorizedNote('');
    setSuccessBanner(`Assignment confirmed for ${selectedVolunteer.id} (${selectedVolunteer.skills}). Audit entry logged.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div>
      {/* Confirmation Modal */}
      <ConfirmAssignmentModal
        isOpen={confirmModalOpen}
        volunteer={selectedVolunteer}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmFromModal}
      />

      {/* 1. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">Volunteer Coordinator - Controlled Workspace</div>
          <h1 className="vc-page-title">Volunteer Directory</h1>
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
            placeholder="Search volunteer directory..."
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    No volunteer records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((vol) => (
                  <tr
                    key={vol.id}
                    className={selectedVolunteer?.id === vol.id ? 'selected' : ''}
                    onClick={() => setSelectedVolunteerId(vol.id)}
                  >
                    <td className="vc-ref-mono">{vol.id}</td>
                    <td style={{ fontWeight: 600 }}>{vol.skills}</td>
                    <td>{vol.serviceArea}</td>
                    <td>{vol.availability}</td>
                    <td style={{ color: vol.currentShift === 'None' ? '#94a3b8' : '#334155' }}>
                      {vol.currentShift}
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
                        {vol.verification}
                      </span>
                    </td>
                    <td>
                      <span className={`vc-status-pill ${vol.statusType}`}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor:
                              vol.statusType === 'eligible'
                                ? '#22c55e'
                                : vol.statusType === 'assigned'
                                ? '#0284c7'
                                : '#f59e0b'
                          }}
                        />
                        {vol.status}
                      </span>
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
            <div className="vc-inspector-ref">{selectedVolunteer.id}</div>
            <div className="vc-inspector-header">
              <h3 className="vc-inspector-title">{selectedVolunteer.skills}</h3>
              <span className={`vc-status-pill ${selectedVolunteer.statusType}`}>
                {selectedVolunteer.status}
              </span>
            </div>
            <div className="vc-inspector-sub">Selected fictional record - role-scoped</div>

            <div className="vc-inspector-grid">
              <div>
                <div className="vc-grid-key">Service area</div>
                <div className="vc-grid-val">{selectedVolunteer.serviceArea}</div>
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

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#64748b',
                  marginBottom: '6px'
                }}
              >
                Authorised note / decision reason
              </label>
              <textarea
                className="vc-textarea-field"
                rows="4"
                placeholder="Avoid unnecessary personal information..."
                value={authorizedNote}
                onChange={(e) => setAuthorizedNote(e.target.value)}
              />
            </div>

            <div className="vc-inspector-actions">
              {/* Confirm assignment → opens modal */}
              <button
                className="vc-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setConfirmModalOpen(true)}
              >
                Confirm assignment
              </button>
              <button
                className="vc-btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  onRequestClarification(selectedVolunteer.id, authorizedNote);
                }}
              >
                Request clarification
              </button>
              <button
                className="vc-btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  onEscalate(selectedVolunteer.id, authorizedNote);
                }}
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

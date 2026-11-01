import React, { useState } from 'react';
import {
  Building2,
  Users,
  Plus,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  Shield,
  Clock,
  MapPin,
  Sparkles,
  Accessibility
} from 'lucide-react';
import {
  SHELTERS_DATA,
  VOLUNTEERS_DATA
} from '../data/coordinatorPortalData';
import './ShelterVolunteerCoordinationView.css';

export const ShelterVolunteerCoordinationView = ({ showToast }) => {
  const [shelters, setShelters] = useState(SHELTERS_DATA);
  const [volunteers, setVolunteers] = useState(VOLUNTEERS_DATA);

  // Modals
  const [selectedShelterModal, setSelectedShelterModal] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [targetVolunteer, setTargetVolunteer] = useState(null);
  const [assignForm, setAssignForm] = useState({
    taskName: 'Emergency Water Bowser Escort',
    zone: 'Kelani East',
    urgency: 'High',
    notes: ''
  });

  const handleOpenSuitability = (shelter) => {
    setSelectedShelterModal(shelter);
  };

  const handleOpenAssignModal = (vol = null) => {
    setTargetVolunteer(vol);
    setShowAssignModal(true);
  };

  const handleConfirmPlacement = (shelter) => {
    showToast(`Shelter recommendation for ${shelter.name} logged in allocation roster!`, 'success');
    setSelectedShelterModal(null);
  };

  const handleSubmitAssignment = (e) => {
    e.preventDefault();
    const volRef = targetVolunteer ? targetVolunteer.ref : 'VOL-0184';
    setVolunteers(prev =>
      prev.map(v =>
        v.ref === volRef
          ? { ...v, availability: 'On assignment', availabilityClass: 'pill-assignment', task: assignForm.taskName, taskStatus: 'In progress' }
          : v
      )
    );
    setShowAssignModal(false);
    showToast(`Task "${assignForm.taskName}" assigned to ${volRef}!`, 'success');
  };

  return (
    <div className="ec-portal-canvas">
      {/* 1. Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">CAPACITY AND ASSIGNMENT COLLABORATION</span>
          <h2 className="ec-review-main-title">Shelter &amp; Volunteer Coordination</h2>
          <p className="ec-review-sub-meta">
            Recommend suitable placements and create assignment requests without exposing unnecessary personal details.
          </p>
        </div>
      </div>

      {/* 2. Shelter Coordination Section */}
      <section className="ec-svc-section">
        <div className="ec-svc-section-header">
          <div>
            <div className="ec-svc-sec-title-wrap">
              <Building2 size={18} color="#0284c7" />
              <h3 className="ec-svc-sec-title">Shelter coordination</h3>
            </div>
            <p className="ec-svc-sec-sub">Publicly appropriate capacity and accessibility information</p>
          </div>
          <button
            className="ec-btn-svc-outline"
            onClick={() => showToast('Shelter suitability wizard initialized', 'info')}
          >
            <Sparkles size={14} color="#0284c7" />
            <span>Recommend shelter</span>
          </button>
        </div>

        {/* Shelter Cards Grid */}
        <div className="ec-shelter-cards-grid">
          {shelters.map((sh) => {
            const pct = Math.round((sh.occupancy / sh.capacity) * 100);
            const isNearCapacity = sh.status === 'Near capacity' || pct > 85;

            return (
              <div key={sh.id} className="ec-shelter-card">
                <div className="ec-shelter-card-top">
                  <div>
                    <span className="ec-shelter-id-pill">{sh.id}</span>
                    <h4 className="ec-shelter-name">{sh.name}</h4>
                    <div className="ec-shelter-meta-row">
                      <span>{sh.location}</span>
                      <span className="ec-dot-sep">·</span>
                      <span>{sh.updatedAgo}</span>
                    </div>
                  </div>
                  <span className={`ec-svc-status-badge ${isNearCapacity ? 'badge-amber' : 'badge-green'}`}>
                    <span className="ec-svc-status-dot"></span>
                    {sh.status}
                  </span>
                </div>

                {/* Occupancy Progress */}
                <div className="ec-shelter-occupancy-block">
                  <div className="ec-shelter-occ-head">
                    <span className="ec-shelter-occ-label">Occupancy</span>
                    <span className="ec-shelter-occ-nums">
                      <strong>{sh.occupancy}</strong> / {sh.capacity}
                    </span>
                  </div>
                  <div className="ec-shelter-bar-track">
                    <div
                      className={`ec-shelter-bar-fill ${isNearCapacity ? 'fill-amber' : 'fill-blue'}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="ec-shelter-details-grid">
                  <div className="ec-shelter-stat-cell">
                    <span className="ec-shelter-cell-lbl">Remaining</span>
                    <span className="ec-shelter-cell-val" style={{ color: isNearCapacity ? '#d97706' : '#0284c7' }}>
                      {sh.remaining}
                    </span>
                  </div>
                  <div className="ec-shelter-stat-cell">
                    <span className="ec-shelter-cell-lbl">Accessibility</span>
                    <span className="ec-shelter-cell-val ec-truncate" title={sh.accessibility}>
                      {sh.accessibility}
                    </span>
                  </div>
                </div>

                <div className="ec-shelter-card-foot">
                  <button
                    className="ec-btn-shelter-suitability"
                    onClick={() => handleOpenSuitability(sh)}
                  >
                    <span>View suitability</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Volunteer Coordination Section */}
      <section className="ec-svc-section">
        <div className="ec-svc-section-header">
          <div>
            <div className="ec-svc-sec-title-wrap">
              <Users size={18} color="#0284c7" />
              <h3 className="ec-svc-sec-title">Volunteer coordination</h3>
            </div>
            <p className="ec-svc-sec-sub">Skills and availability only - personal contacts restricted</p>
          </div>
          <button
            className="ec-btn-action-primary"
            onClick={() => handleOpenAssignModal(null)}
          >
            <Plus size={15} />
            <span>Create assignment request</span>
          </button>
        </div>

        {/* Volunteers Table */}
        <div className="ec-svc-table-card">
          <table className="ec-svc-table">
            <thead>
              <tr>
                <th>VOLUNTEER REFERENCE</th>
                <th>SKILLS / QUALIFICATIONS</th>
                <th>AVAILABILITY</th>
                <th>GENERAL DEPLOYMENT AREA</th>
                <th>ASSIGNED TASK</th>
                <th>TASK STATUS</th>
                <th>HISTORY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol) => (
                <tr key={vol.ref}>
                  <td className="ec-vol-ref-cell">{vol.ref}</td>
                  <td className="ec-vol-skills-cell">{vol.skills}</td>
                  <td>
                    <span className={`ec-svc-status-pill ${vol.availabilityClass}`}>
                      <span className="ec-rc-status-dot"></span>
                      {vol.availability}
                    </span>
                  </td>
                  <td className="ec-vol-area-cell">{vol.area}</td>
                  <td className="ec-vol-task-cell">{vol.task}</td>
                  <td className="ec-vol-taskstatus-cell">{vol.taskStatus}</td>
                  <td className="ec-vol-history-cell">{vol.history}</td>
                  <td>
                    <button
                      className="ec-btn-recommend-vol"
                      onClick={() => handleOpenAssignModal(vol)}
                    >
                      <span>Recommend</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Shelter Suitability Modal */}
      {selectedShelterModal && (
        <div className="ec-modal-overlay" onClick={() => setSelectedShelterModal(null)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">SHELTER CAPACITY &amp; TRIAGE</span>
                <h3 className="ec-modal-title">{selectedShelterModal.name}</h3>
              </div>
              <button className="ec-modal-close-btn" onClick={() => setSelectedShelterModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ec-modal-body-pad">
              <div className="ec-suitability-hud">
                <div className="ec-hud-pill">
                  <span>Location:</span>
                  <strong>{selectedShelterModal.location}</strong>
                </div>
                <div className="ec-hud-pill">
                  <span>Current Beds:</span>
                  <strong>{selectedShelterModal.remaining} Available</strong>
                </div>
                <div className="ec-hud-pill">
                  <span>Access:</span>
                  <strong>{selectedShelterModal.accessibility}</strong>
                </div>
              </div>

              <div className="ec-suitability-factors">
                <h4 className="ec-suitability-title">Facility Readiness Attributes</h4>
                <div className="ec-factor-row">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>24/7 Backup Diesel Power Generators Operational</span>
                </div>
                <div className="ec-factor-row">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Separated Maternal &amp; Infant Nursing Zone</span>
                </div>
                <div className="ec-factor-row">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Mobile Medical Dispensary &amp; First-Aid Team Stationed</span>
                </div>
                <div className="ec-factor-row">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Direct High-Water Evacuation Boat Jetty Access</span>
                </div>
              </div>
            </div>

            <div className="ec-modal-footer">
              <button
                type="button"
                className="ec-btn-modal-cancel"
                onClick={() => setSelectedShelterModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="ec-btn-action-primary"
                onClick={() => handleConfirmPlacement(selectedShelterModal)}
              >
                <CheckCircle2 size={15} />
                <span>Confirm Placement Match</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Assignment Modal */}
      {showAssignModal && (
        <div className="ec-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">FIELD DEPLOYMENT</span>
                <h3 className="ec-modal-title">
                  {targetVolunteer ? `Assign Task to ${targetVolunteer.ref}` : 'Create Volunteer Assignment'}
                </h3>
              </div>
              <button className="ec-modal-close-btn" onClick={() => setShowAssignModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="ec-modal-form">
              <div className="ec-form-field">
                <label className="ec-field-label">Assignment Task Title *</label>
                <input
                  type="text"
                  className="ec-form-input"
                  required
                  value={assignForm.taskName}
                  onChange={(e) => setAssignForm({ ...assignForm, taskName: e.target.value })}
                />
              </div>

              <div className="ec-form-row">
                <div className="ec-form-field">
                  <label className="ec-field-label">Deployment Zone *</label>
                  <select
                    className="ec-form-select"
                    value={assignForm.zone}
                    onChange={(e) => setAssignForm({ ...assignForm, zone: e.target.value })}
                  >
                    <option value="Kelani East">Kelani East</option>
                    <option value="Biyagama North">Biyagama North</option>
                    <option value="Wattala South">Wattala South</option>
                    <option value="Peliyagoda Central">Peliyagoda Central</option>
                  </select>
                </div>

                <div className="ec-form-field">
                  <label className="ec-field-label">Priority Level *</label>
                  <select
                    className="ec-form-select"
                    value={assignForm.urgency}
                    onChange={(e) => setAssignForm({ ...assignForm, urgency: e.target.value })}
                  >
                    <option value="Critical">Critical (Immediate Dispatch)</option>
                    <option value="High">High (Within 2 Hours)</option>
                    <option value="Standard">Standard Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Special Field Instructions</label>
                <textarea
                  className="ec-form-textarea"
                  rows="3"
                  placeholder="Safety equipment, PPE requirements, rendezvous point..."
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="ec-modal-footer">
                <button
                  type="button"
                  className="ec-btn-modal-cancel"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ec-btn-action-primary">
                  <CheckCircle2 size={15} />
                  <span>Confirm Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, UserCheck, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';
import { shelterService } from '../../../services/shelterService';

export const CreatePlacementModal = ({
  isOpen,
  onClose,
  shelters = [],
  intakeQueue = [],
  preselectedIntake = null,
  preselectedShelterId = null,
  onSuccess
}) => {
  const [selectedIntakeId, setSelectedIntakeId] = useState('');
  const [personName, setPersonName] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [shelterId, setShelterId] = useState('');
  const [accessibilityNeeded, setAccessibilityNeeded] = useState('Step-free access');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (preselectedIntake) {
      setSelectedIntakeId(preselectedIntake.id || '');
      setPersonName(preselectedIntake.citizenName || '');
      setNumberOfPersons(preselectedIntake.numberOfPeople || 1);
      setNotes(preselectedIntake.specialNeeds ? `Intake Case: ${preselectedIntake.specialNeeds}` : '');
    } else {
      setSelectedIntakeId('');
      setPersonName('');
      setNumberOfPersons(1);
      setNotes('');
    }
  }, [preselectedIntake, isOpen]);

  useEffect(() => {
    if (preselectedShelterId) {
      setShelterId(preselectedShelterId);
    } else if (shelters.length > 0 && !shelterId) {
      const firstAvailable = shelters.find((s) => (s.available ?? 0) > 0) || shelters[0];
      setShelterId(firstAvailable.id);
    }
  }, [preselectedShelterId, shelters, isOpen]);

  if (!isOpen) return null;

  const handleIntakeSelect = (e) => {
    const id = e.target.value;
    setSelectedIntakeId(id);
    if (!id) {
      setPersonName('');
      setNumberOfPersons(1);
      return;
    }
    const req = intakeQueue.find((q) => q.id === id);
    if (req) {
      setPersonName(req.citizenName || 'Evacuee');
      setNumberOfPersons(req.numberOfPeople || 1);
      setNotes(req.specialNeeds ? `Case ${req.caseReference}: ${req.specialNeeds}` : '');
    }
  };

  const selectedShelterObj = shelters.find((s) => s.id === shelterId);
  const availableBeds = selectedShelterObj ? (selectedShelterObj.available ?? 0) : 0;
  const isOverCapacity = selectedShelterObj && numberOfPersons > availableBeds;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!personName.trim()) {
      setErrorMsg('Evacuee or family head name is required.');
      return;
    }
    if (!shelterId) {
      setErrorMsg('Please select a target shelter.');
      return;
    }
    if (numberOfPersons <= 0) {
      setErrorMsg('Party size must be at least 1 person.');
      return;
    }
    if (isOverCapacity) {
      setErrorMsg(`Selected shelter only has ${availableBeds} beds remaining. Cannot allocate ${numberOfPersons} persons.`);
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const payload = {
        shelterId,
        personName: personName.trim(),
        numberOfPersons: Number(numberOfPersons),
        accessibilityNeeded,
        notes: notes.trim(),
        assistanceRequestId: selectedIntakeId || undefined
      };

      const res = await shelterService.createPlacement(payload);
      if (res?.succeeded === false) {
        throw new Error(res.message || 'Failed to allocate shelter placement.');
      }

      if (onSuccess) {
        onSuccess(res?.data || payload);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error creating placement allocation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sh-modal-backdrop" onClick={onClose}>
      <div className="sh-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="sh-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#edf4eb',
                color: '#153322',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UserCheck size={18} />
            </div>
            <div>
              <h3 className="sh-modal-title">Allocate Evacuee Placement</h3>
              <div style={{ fontSize: '11px', color: '#6f8576' }}>
                Verify space availability & assign displaced household
              </div>
            </div>
          </div>
          <button className="sh-modal-close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="sh-modal-body">
            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #f87171',
                  color: '#991b1b',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  marginBottom: '12px'
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {intakeQueue.length > 0 && (
              <div className="sh-form-group">
                <label className="sh-form-label">Link to Pending Citizen Intake Request (Optional)</label>
                <select
                  className="sh-form-select"
                  value={selectedIntakeId}
                  onChange={handleIntakeSelect}
                >
                  <option value="">-- Manual walk-in / direct referral --</option>
                  {intakeQueue.map((req) => (
                    <option key={req.id} value={req.id}>
                      {req.caseReference} - {req.citizenName} ({req.numberOfPeople} persons, {req.urgency} urgency)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div className="sh-form-group">
                <label className="sh-form-label">Evacuee / Family Head Name *</label>
                <input
                  type="text"
                  className="sh-form-input"
                  placeholder="e.g. Priyantha Jayasuriya"
                  required
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                />
              </div>

              <div className="sh-form-group">
                <label className="sh-form-label">Party Size *</label>
                <input
                  type="number"
                  className="sh-form-input"
                  min="1"
                  max="50"
                  required
                  value={numberOfPersons}
                  onChange={(e) => setNumberOfPersons(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="sh-form-group">
              <label className="sh-form-label">Target Shelter Facility *</label>
              <select
                className="sh-form-select"
                value={shelterId}
                onChange={(e) => setShelterId(e.target.value)}
                required
              >
                {shelters.map((s) => {
                  const avail = s.available ?? Math.max(0, (s.capacity || 0) - (s.occupied || 0));
                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} ({avail} beds free / {s.capacity} cap) - {s.status}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedShelterObj && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: isOverCapacity ? '#fef2f2' : '#f0fdf4',
                  border: isOverCapacity ? '1px solid #fecaca' : '1px solid #bbf7d0',
                  fontSize: '12px',
                  marginBottom: '12px'
                }}
              >
                <div>
                  <strong>{selectedShelterObj.name}</strong>
                  <div style={{ fontSize: '11px', color: '#657367' }}>
                    {selectedShelterObj.area} • {selectedShelterObj.accessibility || 'Standard'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: isOverCapacity ? '#b91c1c' : '#15803d',
                      fontSize: '13px'
                    }}
                  >
                    {availableBeds} Beds Free
                  </span>
                  {isOverCapacity && (
                    <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
                      Insufficient capacity!
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="sh-form-group">
              <label className="sh-form-label">Accessibility / Special Needs</label>
              <select
                className="sh-form-select"
                value={accessibilityNeeded}
                onChange={(e) => setAccessibilityNeeded(e.target.value)}
              >
                <option value="Step-free access">Step-free access / Ramp</option>
                <option value="Wheelchair ramp">Wheelchair ramp & accessible toilets</option>
                <option value="Medical support">Medical / oxygen support wing</option>
                <option value="Family areas">Family area / infant care partition</option>
                <option value="Standard Placement">Standard bed placement</option>
              </select>
            </div>

            <div className="sh-form-group">
              <label className="sh-form-label">Notes & Case Referral Details</label>
              <textarea
                className="sh-form-textarea"
                rows="2"
                placeholder="Include medical conditions, pets, or specific family considerations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="sh-guard-active-alert" style={{ margin: '6px 0 0 0' }}>
              <ShieldCheck size={16} color="#15803d" style={{ marginTop: '1px', flexShrink: 0 }} />
              <div>
                <h4 className="sh-guard-title" style={{ color: '#15803d' }}>
                  Database Capacity Validation Active
                </h4>
                <p className="sh-guard-desc">
                  Submitting will decrement verified facility capacity in real time and log an auditable placement record.
                </p>
              </div>
            </div>
          </div>

          <div className="sh-modal-footer">
            <button
              type="button"
              className="sh-btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sh-btn-primary"
              disabled={isSubmitting || isOverCapacity}
              style={{
                opacity: isOverCapacity || isSubmitting ? 0.6 : 1,
                cursor: isOverCapacity || isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Confirming Placement...' : isOverCapacity ? 'Capacity Exceeded' : 'Confirm Evacuee Placement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlacementModal;

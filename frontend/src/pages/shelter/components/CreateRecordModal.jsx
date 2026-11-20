import React, { useState } from 'react';
import { X, Building2, ShieldCheck, AlertCircle } from 'lucide-react';

export const CreateRecordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    facilityName: '',
    area: 'Kelani East',
    capacity: 150,
    occupied: 0,
    accessibility: 'Step-free access',
    status: 'Operational',
    contactPhone: '+94 11 234 5678',
    notes: ''
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const facilityName = formData.facilityName.trim();
    if (!facilityName) {
      setErrorMsg('Facility or shelter name is required.');
      return;
    }
    const cap = Number(formData.capacity);
    const occ = Number(formData.occupied) || 0;

    if (cap <= 0) {
      setErrorMsg('Total capacity must be greater than zero.');
      return;
    }
    if (occ < 0) {
      setErrorMsg('Current occupancy cannot be negative.');
      return;
    }
    if (occ > cap) {
      setErrorMsg(`Occupancy (${occ}) cannot exceed total capacity (${cap}).`);
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const newId = `SH-${Math.floor(100 + Math.random() * 900)}`;
      const newShelter = {
        id: newId,
        name: `${newId} - ${facilityName}`,
        facilityName,
        area: formData.area,
        capacity: cap,
        totalCapacity: cap,
        occupied: occ,
        currentOccupancy: occ,
        available: Math.max(0, cap - occ),
        accessibility: formData.accessibility,
        status: formData.status,
        statusType: formData.status === 'Operational' ? 'operational' : formData.status === 'Near capacity' ? 'warning' : 'critical',
        guardActive: true,
        contactPhone: formData.contactPhone.trim(),
        managerContact: formData.contactPhone.trim() || 'Authorised Staff (+94 11 000 0000)',
        notes: formData.notes.trim() || 'Registered operational shelter.'
      };

      await onSave(newShelter);
      onClose();
    } catch (err) {
      setErrorMsg(err?.message || 'Error registering shelter facility.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sh-modal-backdrop" onClick={onClose}>
      <div className="sh-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="sh-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: '#edf4eb',
              color: '#153322',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={18} />
            </div>
            <div>
              <h3 className="sh-modal-title">Register Operational Shelter</h3>
              <div style={{ fontSize: '11px', color: '#6f8576' }}>Shelter Facility Management</div>
            </div>
          </div>
          <button className="sh-modal-close-btn" onClick={onClose}>
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

            <div className="sh-form-group">
              <label className="sh-form-label">Facility / Centre Name *</label>
              <input
                type="text"
                className="sh-form-input"
                placeholder="e.g. Kelani Central Maha Vidyalaya Hall"
                required
                value={formData.facilityName}
                onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sh-form-group">
                <label className="sh-form-label">Operational Area / Sector</label>
                <select
                  className="sh-form-select"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                >
                  <option value="Kelani East">Kelani East</option>
                  <option value="Biyagama North">Biyagama North</option>
                  <option value="Wattala South">Wattala South</option>
                  <option value="Hanwella">Hanwella</option>
                  <option value="Kaduwela">Kaduwela</option>
                  <option value="Malwana">Malwana</option>
                  <option value="Kolonnawa">Kolonnawa</option>
                  <option value="Galle">Galle</option>
                  <option value="Matara">Matara</option>
                  <option value="Kalutara">Kalutara</option>
                </select>
              </div>

              <div className="sh-form-group">
                <label className="sh-form-label">Total Verified Bed Capacity *</label>
                <input
                  type="number"
                  className="sh-form-input"
                  min="1"
                  max="5000"
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sh-form-group">
                <label className="sh-form-label">Accessibility & Features</label>
                <input
                  type="text"
                  className="sh-form-input"
                  placeholder="e.g. Step-free access, Clean water, Medical triage"
                  value={formData.accessibility}
                  onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })}
                />
              </div>

              <div className="sh-form-group">
                <label className="sh-form-label">Initial Operational Status</label>
                <select
                  className="sh-form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Operational">Operational</option>
                  <option value="Near capacity">Near capacity</option>
                  <option value="Full">Full</option>
                </select>
              </div>
            </div>

            <div className="sh-form-group">
              <label className="sh-form-label">Contact Phone / Authorised Facility Lead</label>
              <input
                type="text"
                className="sh-form-input"
                placeholder="e.g. +94 11 234 5678"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>

            <div className="sh-form-group">
              <label className="sh-form-label">Operational Instructions & Notes</label>
              <textarea
                className="sh-form-input"
                rows="2"
                placeholder="Entry ramps, generator availability, triage wings..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11.5px',
              color: '#324e3a',
              backgroundColor: '#edf4eb',
              padding: '8px 12px',
              borderRadius: '6px'
            }}>
              <ShieldCheck size={16} />
              <span>Record will be registered in the shared database and synced across Maps, Coordinator, and Capacity surveillance.</span>
            </div>
          </div>

          <div className="sh-modal-footer">
            <button type="button" className="sh-btn-outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="sh-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecordModal;

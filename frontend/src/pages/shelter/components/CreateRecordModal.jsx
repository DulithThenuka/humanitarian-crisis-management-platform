import React, { useState } from 'react';
import { X, Building2, ShieldCheck } from 'lucide-react';

export const CreateRecordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    facilityName: '',
    area: 'Kelani East',
    capacity: 150,
    occupied: 0,
    accessibility: 'Step-free access',
    status: 'Operational',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.facilityName.trim()) return;

    const newId = `SH-${Math.floor(100 + Math.random() * 900)}`;
    const newShelter = {
      id: newId,
      name: `${newId} - ${formData.facilityName}`,
      facilityName: formData.facilityName,
      area: formData.area,
      capacity: Number(formData.capacity),
      occupied: Number(formData.occupied) || 0,
      available: Math.max(0, Number(formData.capacity) - (Number(formData.occupied) || 0)),
      accessibility: formData.accessibility,
      status: formData.status,
      statusType: formData.status === 'Operational' ? 'success' : formData.status === 'Near capacity' ? 'warning' : 'critical',
      guardActive: true,
      managerContact: 'Authorised Staff (+94 11 000 0000)',
      notes: formData.notes || 'Created via Shelter Admin prototype record workspace.'
    };

    onSave(newShelter);
    onClose();
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
              <h3 className="sh-modal-title">Create Prototype Shelter Record</h3>
              <div style={{ fontSize: '11px', color: '#6f8576' }}>Controlled Coursework Workspace</div>
            </div>
          </div>
          <button className="sh-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="sh-modal-body">
            <div className="sh-form-group">
              <label className="sh-form-label">Facility / Centre Name *</label>
              <input
                type="text"
                className="sh-form-input"
                placeholder="e.g. Kelani Maha Vidyalaya Hall"
                required
                value={formData.facilityName}
                onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sh-form-group">
                <label className="sh-form-label">Operational Area</label>
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
                </select>
              </div>

              <div className="sh-form-group">
                <label className="sh-form-label">Total Verified Capacity</label>
                <input
                  type="number"
                  className="sh-form-input"
                  min="10"
                  max="1500"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sh-form-group">
                <label className="sh-form-label">Accessibility Features</label>
                <select
                  className="sh-form-select"
                  value={formData.accessibility}
                  onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })}
                >
                  <option value="Step-free access">Step-free access</option>
                  <option value="Accessible toilets">Accessible toilets</option>
                  <option value="Family areas">Family areas</option>
                  <option value="Medical support">Medical support</option>
                  <option value="Wheelchair ramp">Wheelchair ramp</option>
                </select>
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
              <label className="sh-form-label">Initial Authorised Note</label>
              <textarea
                className="sh-form-input"
                rows="2"
                placeholder="Operational instructions, entry ramps or triage points..."
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
              <span>Record will be created with prototype authorization under your staff credentials.</span>
            </div>
          </div>

          <div className="sh-modal-footer">
            <button type="button" className="sh-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="sh-btn-primary">
              Save Prototype Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


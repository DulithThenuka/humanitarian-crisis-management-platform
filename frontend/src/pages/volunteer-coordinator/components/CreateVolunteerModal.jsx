import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { OPERATIONAL_AREAS } from '../data/coordinatorData';

export const CreateVolunteerModal = ({ isOpen, onClose, onCreateVolunteer }) => {
  const [formData, setFormData] = useState({
    id: `VOL-0${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    email: '',
    phone: '+94 77 000 0000',
    skills: 'Logistics, First Aid',
    serviceArea: 'Kelani East',
    availability: 'Available',
    currentShift: 'None',
    verification: 'Verified',
    status: 'Eligible',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter volunteer full name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onCreateVolunteer({
        ...formData,
        email: formData.email.trim() || `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'vol'}${Math.floor(100 + Math.random() * 900)}@reliefcore.local`,
        statusType: formData.status.toLowerCase()
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register volunteer. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vc-modal-overlay" onClick={onClose}>
      <div className="vc-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="vc-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={18} style={{ color: '#233831' }} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#14291e' }}>
              Register Field Volunteer
            </h3>
          </div>
          <button className="vc-modal-close" onClick={onClose} disabled={isSubmitting}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="vc-modal-body">
            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  color: '#b91c1c',
                  fontSize: '12px',
                  marginBottom: '12px'
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="vc-form-label">Volunteer Ref</label>
                <input
                  type="text"
                  className="vc-filter-input"
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#eef1ea' }}
                  value={formData.id}
                  readOnly
                />
              </div>
              <div>
                <label className="vc-form-label">Full Name *</label>
                <input
                  type="text"
                  className="vc-filter-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="e.g. Kasun Bandara"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="vc-form-label">Email (Optional)</label>
                <input
                  type="email"
                  className="vc-filter-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="volunteer@domain.lk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="vc-form-label">Phone Number</label>
                <input
                  type="text"
                  className="vc-filter-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="+94 77 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="vc-form-label">Verified Skills</label>
              <input
                type="text"
                className="vc-filter-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                placeholder="e.g. Logistics, First Aid, Driving"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="vc-form-label">Operational Area</label>
                <select
                  className="vc-filter-select"
                  style={{ width: '100%' }}
                  value={formData.serviceArea}
                  onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                >
                  {OPERATIONAL_AREAS.filter((a) => a !== 'All operational areas').map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="vc-form-label">Availability</label>
                <select
                  className="vc-filter-select"
                  style={{ width: '100%' }}
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                >
                  <option value="Available">Available (On-call)</option>
                  <option value="08:00-14:00">08:00 - 14:00 (Morning)</option>
                  <option value="14:00-20:00">14:00 - 20:00 (Evening)</option>
                  <option value="20:00-02:00">20:00 - 02:00 (Night)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="vc-form-label">Verification Status</label>
                <select
                  className="vc-filter-select"
                  style={{ width: '100%' }}
                  value={formData.verification}
                  onChange={(e) => setFormData({ ...formData, verification: e.target.value })}
                >
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending Review</option>
                </select>
              </div>

              <div>
                <label className="vc-form-label">Initial Status</label>
                <select
                  className="vc-filter-select"
                  style={{ width: '100%' }}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Eligible">Eligible</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Review">Review</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="vc-form-label">Authorised Notes & Credentials</label>
              <textarea
                className="vc-textarea"
                rows={2}
                placeholder="Background, certifications, verified emergency driving license..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f4f6f2',
                borderRadius: '6px',
                border: '1px solid #dfe5d8',
                fontSize: '11px',
                color: '#657367'
              }}
            >
              Operational record is validated and saved directly to SQL Server database.
            </div>
          </div>

          <div className="vc-modal-footer">
            <button type="button" className="vc-btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="vc-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="vc-spin" style={{ marginRight: '6px' }} />
                  Saving...
                </>
              ) : (
                'Register Volunteer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

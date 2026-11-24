import React, { useState, useEffect } from 'react';
import { X, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { OPERATIONAL_AREAS } from '../data/coordinatorData';

export const EditVolunteerModal = ({ isOpen, onClose, volunteer, onUpdateVolunteer }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    serviceArea: 'Kelani East',
    availability: 'Available',
    verification: 'Verified',
    status: 'Eligible',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (volunteer) {
      setFormData({
        name: volunteer.fullName || volunteer.name || '',
        email: volunteer.email || '',
        phone: volunteer.phoneNumber || volunteer.phone || '',
        skills: volunteer.skills || '',
        serviceArea: volunteer.serviceArea || 'Kelani East',
        availability: volunteer.availability || 'Available',
        verification: volunteer.verification || 'Verified',
        status: volunteer.status || 'Eligible',
        notes: volunteer.notes || ''
      });
      setErrorMsg(null);
    }
  }, [volunteer]);

  if (!isOpen || !volunteer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Volunteer full name is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onUpdateVolunteer(volunteer.id, {
        ...formData,
        fullName: formData.name.trim(),
        name: formData.name.trim(),
        phoneNumber: formData.phone.trim(),
        verificationStatus: formData.verification
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update volunteer record in SQL Server database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vc-modal-overlay" onClick={onClose}>
      <div className="vc-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="vc-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} style={{ color: '#0c2340' }} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#14291e' }}>
              Edit Field Volunteer Details
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
                  value={volunteer.volunteerCode || volunteer.id?.slice(0, 8) || volunteer.id}
                  readOnly
                />
              </div>
              <div>
                <label className="vc-form-label">Full Name *</label>
                <input
                  type="text"
                  className="vc-filter-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="vc-form-label">Email</label>
                <input
                  type="email"
                  className="vc-filter-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
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
                  {OPERATIONAL_AREAS.filter((a) => a !== 'All operational areas' && a !== 'All').map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="vc-form-label">Availability Schedule</label>
                <input
                  type="text"
                  className="vc-filter-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                />
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
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="vc-form-label">Deployment Status</label>
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

            <div style={{ marginBottom: '8px' }}>
              <label className="vc-form-label">Audit & Operational Notes</label>
              <textarea
                className="vc-filter-input"
                style={{ width: '100%', boxSizing: 'border-box', height: '60px', resize: 'vertical' }}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="vc-modal-footer">
            <button
              type="button"
              className="vc-btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="vc-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="vc-spin" />
                  <span>Saving to SQL Server...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

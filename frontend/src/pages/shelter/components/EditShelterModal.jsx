import React, { useState, useEffect } from 'react';
import { X, Building2, ShieldCheck, AlertCircle } from 'lucide-react';
import { shelterService } from '../../../services/shelterService';

export const EditShelterModal = ({
  isOpen,
  onClose,
  shelter,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalCapacity: 100,
    currentOccupancy: 0,
    facilities: '',
    contactPhone: '',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (shelter) {
      setFormData({
        name: shelter.name || shelter.facilityName || '',
        address: shelter.address || shelter.area || '',
        totalCapacity: shelter.totalCapacity || shelter.capacity || 100,
        currentOccupancy: shelter.currentOccupancy ?? shelter.occupied ?? 0,
        facilities: shelter.facilities || shelter.accessibility || '',
        contactPhone: shelter.contactPhone || shelter.managerContact || '',
        isActive: shelter.isActive !== undefined ? shelter.isActive : true
      });
      setErrorMsg(null);
    }
  }, [shelter, isOpen]);

  if (!isOpen || !shelter) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Shelter name is required.');
      return;
    }
    const cap = Number(formData.totalCapacity);
    const occ = Number(formData.currentOccupancy);

    if (cap <= 0) {
      setErrorMsg('Total capacity must be greater than zero.');
      return;
    }
    if (occ < 0) {
      setErrorMsg('Current occupancy cannot be negative.');
      return;
    }
    if (occ > cap) {
      setErrorMsg(`Current occupancy (${occ}) cannot exceed total capacity (${cap}).`);
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        totalCapacity: cap,
        currentOccupancy: occ,
        facilities: formData.facilities.trim(),
        contactPhone: formData.contactPhone.trim(),
        isActive: formData.isActive
      };

      const res = await shelterService.update(shelter.id, payload);
      if (res?.succeeded === false) {
        throw new Error(res.message || 'Failed to update shelter facility.');
      }

      if (onSuccess) {
        onSuccess(res?.data || { ...shelter, ...payload });
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error updating shelter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sh-modal-backdrop" onClick={onClose}>
      <div className="sh-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
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
              <Building2 size={18} />
            </div>
            <div>
              <h3 className="sh-modal-title">Edit Shelter Facility</h3>
              <div style={{ fontSize: '11px', color: '#6f8576' }}>
                Update operational capacity, amenities, or contact info
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

            <div className="sh-form-group">
              <label className="sh-form-label">Shelter Name *</label>
              <input
                type="text"
                className="sh-form-input"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="sh-form-group">
              <label className="sh-form-label">Address / Location</label>
              <input
                type="text"
                className="sh-form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sh-form-group">
                <label className="sh-form-label">Total Bed Capacity *</label>
                <input
                  type="number"
                  className="sh-form-input"
                  min="1"
                  required
                  value={formData.totalCapacity}
                  onChange={(e) => setFormData({ ...formData, totalCapacity: e.target.value })}
                />
              </div>

              <div className="sh-form-group">
                <label className="sh-form-label">Current Occupancy *</label>
                <input
                  type="number"
                  className="sh-form-input"
                  min="0"
                  required
                  value={formData.currentOccupancy}
                  onChange={(e) => setFormData({ ...formData, currentOccupancy: e.target.value })}
                />
              </div>
            </div>

            <div className="sh-form-group">
              <label className="sh-form-label">Facilities & Accessibility Notes</label>
              <input
                type="text"
                className="sh-form-input"
                placeholder="e.g. Step-free access, Clean water, Medical triage"
                value={formData.facilities}
                onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
              />
            </div>

            <div className="sh-form-group">
              <label className="sh-form-label">Contact Phone / Authorised Lead</label>
              <input
                type="text"
                className="sh-form-input"
                placeholder="e.g. +94 11 234 5678"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <input
                type="checkbox"
                id="edit-shelter-active"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <label htmlFor="edit-shelter-active" style={{ fontSize: '13px', color: '#142e1f', fontWeight: 600, cursor: 'pointer' }}>
                Operational & Open for Evacuee Intake
              </label>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Shelter Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShelterModal;

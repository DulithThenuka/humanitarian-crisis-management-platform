import React, { useState } from 'react';
import { X, HeartHandshake, ShieldCheck } from 'lucide-react';

export const AddSupplierModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    categories: '',
    contactRef: 'Approved contact',
    location: 'Western Province',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newSupplier = {
      id: `SUP-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      categories: formData.categories || 'Relief goods',
      contactRef: formData.contactRef,
      status: 'Verified',
      statusBadge: 'verified',
      lastDelivery: 'Today'
    };

    onSave(newSupplier);
    onClose();
  };

  return (
    <div className="rm-modal-backdrop" onClick={onClose}>
      <div className="rm-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="rm-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#edf4ec',
                color: '#1e3d2c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HeartHandshake size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#162e20' }}>
                Add Supplier or Donor
              </h3>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#657367' }}>
                Register verified external relief supplier or contributing organization
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rm-btn-ghost" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="rm-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="rm-form-label">Supplier / Donor Name *</label>
              <input
                type="text"
                required
                className="rm-form-input"
                placeholder="e.g. Ceylon Logistics & Cold Chain, Red Cross Partner"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="rm-form-label">Supply Categories *</label>
              <input
                type="text"
                required
                className="rm-form-input"
                placeholder="e.g. Water, emergency kits, blankets, medical packs"
                value={formData.categories}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="rm-form-label">Verification Status</label>
                <select
                  className="rm-form-input"
                  value={formData.contactRef}
                  onChange={(e) => setFormData({ ...formData, contactRef: e.target.value })}
                >
                  <option value="Approved contact">Approved contact (Verified)</option>
                  <option value="Pending verification">Pending verification (Under Review)</option>
                  <option value="Direct NGO partner">Direct NGO partner</option>
                </select>
              </div>

              <div>
                <label className="rm-form-label">Operating Location</label>
                <input
                  type="text"
                  className="rm-form-input"
                  placeholder="e.g. Western Province"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="rm-form-label">Verification Notes</label>
              <textarea
                rows={2}
                className="rm-note-textarea"
                placeholder="MOU details, registration certificates or coordinator contact..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#f5f7f4',
                fontSize: '11px',
                color: '#657367'
              }}
            >
              <ShieldCheck size={14} style={{ color: '#1e3d2c', flexShrink: 0 }} />
              <span>Supplier records comply with HumanAid Response verification guidelines.</span>
            </div>
          </div>

          {/* Footer */}
          <div className="rm-modal-footer">
            <button type="button" onClick={onClose} className="rm-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="rm-btn-primary">
              Register Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;

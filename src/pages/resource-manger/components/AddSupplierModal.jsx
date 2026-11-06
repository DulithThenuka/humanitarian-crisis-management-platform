import React, { useState } from 'react';
import { Truck, X } from 'lucide-react';

export const AddSupplierModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    categories: 'Water, emergency kits',
    contactReference: '',
    status: 'Verified'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newSupplier = {
      id: `SUP-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name.trim(),
      categories: formData.categories,
      contactReference: formData.contactReference.trim() || 'Approved relief channel (+94 11 200 8899)',
      status: formData.status,
      statusType: formData.status === 'Verified' ? 'success' : 'warning',
      lastDelivery: 'Just registered'
    };

    onAdd(newSupplier);
    onClose();
  };

  return (
    <div className="rm-modal-backdrop" onClick={onClose}>
      <div className="rm-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="rm-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="rm-metric-icon-tile">
              <Truck size={18} />
            </div>
            <div>
              <h2 className="rm-modal-title">Register Verified Relief Partner</h2>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--rm-text-muted)' }}>
                Add authorised humanitarian supply vendor or NGO partner
              </p>
            </div>
          </div>
          <button className="rm-modal-close-corner-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rm-modal-body">
            <div className="rm-form-group">
              <label className="rm-form-label">Organization / Supplier Name *</label>
              <input
                type="text"
                className="rm-form-input"
                placeholder="e.g. Lanka Pure Hydration Ltd"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="rm-form-group">
              <label className="rm-form-label">Supplied Categories</label>
              <input
                type="text"
                className="rm-form-input"
                placeholder="e.g. Drinking Water, Purification Tablets"
                value={formData.categories}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
              />
            </div>

            <div className="rm-form-group">
              <label className="rm-form-label">Contact Reference / Phone *</label>
              <input
                type="text"
                className="rm-form-input"
                placeholder="+94 11 234 5678 (Emergency Dispatch Lead)"
                value={formData.contactReference}
                onChange={(e) => setFormData({ ...formData, contactReference: e.target.value })}
              />
            </div>

            <div className="rm-form-group">
              <label className="rm-form-label">Verification Status</label>
              <select
                className="rm-form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Verified">Verified & Active</option>
                <option value="Review">Under Security Review</option>
              </select>
            </div>
          </div>

          <div className="rm-modal-footer">
            <button type="button" className="rm-btn-outline" onClick={onClose}>
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


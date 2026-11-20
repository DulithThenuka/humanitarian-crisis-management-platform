import React, { useState, useEffect } from 'react';
import { X, Package, ShieldCheck } from 'lucide-react';

export const AddInventoryModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Water',
    quantity: '',
    unit: 'units',
    storageLocation: 'Central Depot',
    threshold: '100',
    notes: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        category: 'Water',
        quantity: '',
        unit: 'units',
        storageLocation: 'Central Depot',
        threshold: '100',
        notes: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const qty = parseInt(formData.quantity, 10) || 0;
    const thresh = parseInt(formData.threshold, 10) || 100;
    
    // Automatic status badge determination
    let status = 'Available';
    let badge = 'available';
    if (qty <= 0) {
      status = 'Shortage';
      badge = 'critical';
    } else if (qty <= thresh) {
      status = 'Low stock';
      badge = 'warning';
    }

    const newItem = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name.trim(),
      category: formData.category,
      quantity: qty,
      unit: formData.unit,
      storageLocation: formData.storageLocation,
      threshold: thresh,
      stockStatus: status,
      statusBadge: badge,
      lastUpdated: 'Just now',
      notes: formData.notes
    };

    onSave(newItem);
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
              <Package size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#162e20' }}>
                Add Inventory Item
              </h3>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#657367' }}>
                Record new relief goods into authorized warehouse stock
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
              <label className="rm-form-label">Item Name *</label>
              <input
                type="text"
                required
                className="rm-form-input"
                placeholder="e.g. Bottled Water 5L Packs, Cotton Blankets"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="rm-form-label">Category *</label>
                <select
                  className="rm-form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Water">Water</option>
                  <option value="Food">Food</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Shelter">Shelter</option>
                  <option value="Emergency Kits">Emergency Kits</option>
                  <option value="Sanitation">Sanitation</option>
                </select>
              </div>

              <div>
                <label className="rm-form-label">Storage Location *</label>
                <select
                  className="rm-form-input"
                  value={formData.storageLocation}
                  onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                >
                  <option value="Central Depot">Central Depot</option>
                  <option value="Wattala Store">Wattala Store</option>
                  <option value="Biyagama Depot">Biyagama Depot</option>
                  <option value="Medical Store">Medical Store</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '14px' }}>
              <div>
                <label className="rm-form-label">Initial Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="rm-form-input"
                  placeholder="e.g. 500"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="rm-form-label">Unit</label>
                <select
                  className="rm-form-input"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="units">units</option>
                  <option value="kits">kits</option>
                  <option value="packs">packs</option>
                  <option value="items">items</option>
                  <option value="tablets">tablets</option>
                  <option value="boxes">boxes</option>
                </select>
              </div>

              <div>
                <label className="rm-form-label">Low Stock Threshold</label>
                <input
                  type="number"
                  min="0"
                  className="rm-form-input"
                  placeholder="e.g. 100"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="rm-form-label">Allocation / Intake Note</label>
              <textarea
                rows={2}
                className="rm-note-textarea"
                placeholder="Optional delivery reference, supplier batch code or conditions..."
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
              <span>Record will be stamped with authorized officer Dilan Perera (Relief / Resource Manager).</span>
            </div>
          </div>

          {/* Footer */}
          <div className="rm-modal-footer">
            <button type="button" onClick={onClose} className="rm-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="rm-btn-primary">
              Confirm and Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInventoryModal;

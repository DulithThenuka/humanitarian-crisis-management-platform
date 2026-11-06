import React, { useState } from 'react';
import { Package, X } from 'lucide-react';

export const AddInventoryModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Water',
    quantity: 100,
    unit: 'units',
    storageLocation: 'Central Depot',
    reorderLevel: 50
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newItem = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name.trim(),
      category: formData.category,
      quantity: Number(formData.quantity) || 0,
      unit: formData.unit,
      storageLocation: formData.storageLocation,
      stockStatus: (Number(formData.quantity) || 0) < Number(formData.reorderLevel) ? 'Low stock' : 'Available',
      statusType: (Number(formData.quantity) || 0) < Number(formData.reorderLevel) ? 'warning' : 'success',
      lastUpdated: 'Just now',
      reorderLevel: Number(formData.reorderLevel) || 50
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="rm-modal-backdrop" onClick={onClose}>
      <div className="rm-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="rm-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="rm-metric-icon-tile">
              <Package size={18} />
            </div>
            <div>
              <h2 className="rm-modal-title">Register Inventory Item</h2>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--rm-text-muted)' }}>
                Add relief supplies to active emergency stores
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
              <label className="rm-form-label">Item Name *</label>
              <input
                type="text"
                className="rm-form-input"
                placeholder="e.g. Bottled Drinking Water 5L"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="rm-form-row">
              <div className="rm-form-group">
                <label className="rm-form-label">Category</label>
                <select
                  className="rm-form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Water">Water & Sanitation</option>
                  <option value="Food">Food Rations</option>
                  <option value="Medicine">Medicine & First Aid</option>
                  <option value="Shelter">Shelter & Bedding</option>
                  <option value="Emergency Kits">Emergency Kits</option>
                  <option value="Hygiene">Hygiene Packs</option>
                </select>
              </div>

              <div className="rm-form-group">
                <label className="rm-form-label">Storage Location</label>
                <select
                  className="rm-form-select"
                  value={formData.storageLocation}
                  onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                >
                  <option value="Central Depot">Central Depot</option>
                  <option value="Wattala Store">Wattala Store</option>
                  <option value="Biyagama Depot">Biyagama Depot</option>
                  <option value="Medical Store">Medical Store</option>
                  <option value="Kelani Forward Base">Kelani Forward Base</option>
                </select>
              </div>
            </div>

            <div className="rm-form-row">
              <div className="rm-form-group">
                <label className="rm-form-label">Initial Quantity *</label>
                <input
                  type="number"
                  min="1"
                  className="rm-form-input"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="rm-form-group">
                <label className="rm-form-label">Unit of Measure</label>
                <select
                  className="rm-form-select"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="units">units</option>
                  <option value="kits">kits</option>
                  <option value="packs">packs</option>
                  <option value="items">items</option>
                  <option value="tablets">tablets</option>
                  <option value="boxes">boxes</option>
                  <option value="liters">liters</option>
                </select>
              </div>
            </div>

            <div className="rm-form-group">
              <label className="rm-form-label">Reorder Warning Threshold</label>
              <input
                type="number"
                min="1"
                className="rm-form-input"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
              />
              <span style={{ fontSize: 11, color: 'var(--rm-text-muted)' }}>
                Item status flags 'Low stock' when available count drops below this level.
              </span>
            </div>
          </div>

          <div className="rm-modal-footer">
            <button type="button" className="rm-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rm-btn-primary">
              Save Inventory Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


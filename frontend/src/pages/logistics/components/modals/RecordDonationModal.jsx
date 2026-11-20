import React, { useState } from 'react';
import { X, HeartHandshake, ShieldCheck, Package, Building2 } from 'lucide-react';

export const RecordDonationModal = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    donorName: '',
    category: 'Water',
    description: '',
    quantity: '',
    unit: 'boxes',
    targetWarehouse: 'Central Depot',
    stockStatus: 'Pending Inspection',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.donorName.trim() || !formData.description.trim()) return;

    const qty = parseInt(formData.quantity, 10) || 1;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newDonation = {
      id: `DON-2026-0${Math.floor(82 + Math.random() * 50)}`,
      donorName: formData.donorName.trim(),
      category: formData.category,
      description: formData.description.trim(),
      quantity: qty,
      unit: formData.unit,
      targetWarehouse: formData.targetWarehouse,
      stockStatus: formData.stockStatus,
      statusBadge: formData.stockStatus === 'Add Directly to Inventory' ? 'available' : 'warning',
      recordedDate: `Today · ${nowTime}`,
      notes: formData.notes
    };

    onSave(newDonation);
    onClose();
  };

  return (
    <div className="rm-modal-backdrop" onClick={onClose}>
      <div className="rm-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div className="rm-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HeartHandshake size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#162e20' }}>
                Record Inbound Donation
              </h3>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#657367' }}>
                Register external crisis relief contributions into warehouse management
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className="rm-btn-ghost" 
            style={{ padding: '6px', borderRadius: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="rm-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Donor / Organization Name */}
            <div>
              <label className="rm-form-label">Donor / Organization Name *</label>
              <input
                type="text"
                required
                className="rm-form-input"
                placeholder="e.g. Sri Lanka Red Cross Society, UNICEF, Rotary Club"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
              />
            </div>

            {/* Category & Unit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label className="rm-form-label">Category *</label>
                <select
                  className="rm-form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Water">Water</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Hygiene">Hygiene</option>
                  <option value="Shelter">Shelter</option>
                  <option value="Food">Food</option>
                </select>
              </div>

              <div>
                <label className="rm-form-label">Unit *</label>
                <select
                  className="rm-form-input"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="boxes">boxes</option>
                  <option value="liters">liters</option>
                  <option value="kits">kits</option>
                  <option value="packs">packs</option>
                </select>
              </div>
            </div>

            {/* Item Description */}
            <div>
              <label className="rm-form-label">Item Description *</label>
              <input
                type="text"
                required
                className="rm-form-input"
                placeholder="e.g. Bottled Water 5L Packs, Emergency Antibiotic Kits"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Quantity & Target Warehouse */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '12px' }}>
              <div>
                <label className="rm-form-label">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="rm-form-input"
                  placeholder="e.g. 250"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="rm-form-label">Target Warehouse *</label>
                <select
                  className="rm-form-input"
                  value={formData.targetWarehouse}
                  onChange={(e) => setFormData({ ...formData, targetWarehouse: e.target.value })}
                >
                  <option value="Central Depot">Central Depot (Colombo)</option>
                  <option value="Wattala Store">Wattala Store</option>
                  <option value="Biyagama Depot">Biyagama Depot</option>
                  <option value="Medical Store">Medical Store</option>
                </select>
              </div>
            </div>

            {/* Target Stock Status */}
            <div>
              <label className="rm-form-label">Target Stock Status *</label>
              <select
                className="rm-form-input"
                value={formData.stockStatus}
                onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
              >
                <option value="Pending Inspection">Pending Inspection (Requires Quality / Quarantine Clearance)</option>
                <option value="Add Directly to Inventory">Add Directly to Inventory (Immediate Allocation Ready)</option>
              </select>
            </div>

            {/* Remarks / Manifest Note */}
            <div>
              <label className="rm-form-label">Intake Notes / Manifest Ref</label>
              <textarea
                rows={2}
                className="rm-note-textarea"
                placeholder="Optional delivery consignment reference, batch expiry or transport details..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Sign-off badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#f8faf7',
              border: '1px solid #dce5d9',
              fontSize: '11px',
              color: '#405044'
            }}>
              <ShieldCheck size={14} color="#1e3d2c" style={{ flexShrink: 0 }} />
              <span>
                Logged under authorized officer <strong>Dilan Perera</strong>. Will generate verified intake receipt.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="rm-modal-footer">
            <button type="button" onClick={onClose} className="rm-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="rm-btn-primary">
              <HeartHandshake size={14} />
              <span>Confirm & Record Donation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordDonationModal;

import React, { useState, useEffect } from 'react';
import { X, Package, ShieldCheck, AlertCircle } from 'lucide-react';

export const CreateResourceRequestModal = ({
  isOpen,
  onClose,
  shelters = [],
  currentShelterId,
  onSave
}) => {
  const [formData, setFormData] = useState({
    shelterId: currentShelterId || (shelters[0]?.id || ''),
    itemCategory: 'Bedding & Mattresses',
    quantity: 50,
    unit: 'units',
    urgency: 'High',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (currentShelterId) {
      setFormData((prev) => ({ ...prev, shelterId: currentShelterId }));
    } else if (shelters.length > 0 && !formData.shelterId) {
      setFormData((prev) => ({ ...prev, shelterId: shelters[0].id }));
    }
  }, [currentShelterId, shelters]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shelterId) {
      setErrorMsg('Please select a target shelter facility.');
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setErrorMsg('Please enter a valid quantity greater than 0.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await onSave({
        shelterId: formData.shelterId,
        itemCategory: formData.itemCategory,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        urgency: formData.urgency,
        notes: formData.notes
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit resource requisition.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedShelterObj = shelters.find((s) => s.id === formData.shelterId);

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
              <Package size={18} />
            </div>
            <div>
              <h3 className="sh-modal-title">Request Shelter Supplies</h3>
              <div style={{ fontSize: '11px', color: '#6f8576' }}>
                Submit replenishment requisition to Central Logistics
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
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  marginBottom: '14px'
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="sh-form-group">
              <label className="sh-form-label">Target Shelter Facility *</label>
              <select
                className="sh-form-select"
                value={formData.shelterId}
                onChange={(e) => setFormData({ ...formData, shelterId: e.target.value })}
                required
              >
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.area})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sh-form-group">
                <label className="sh-form-label">Supply Category *</label>
                <select
                  className="sh-form-select"
                  value={formData.itemCategory}
                  onChange={(e) => setFormData({ ...formData, itemCategory: e.target.value })}
                  required
                >
                  <option value="Bedding & Mattresses">Bedding & Mattresses</option>
                  <option value="Drinking Water & Electrolytes">Drinking Water & Electrolytes</option>
                  <option value="Emergency Food Rations">Emergency Food Rations</option>
                  <option value="Medical & First Aid Supplies">Medical & First Aid Supplies</option>
                  <option value="Hygiene Kits & Sanitation">Hygiene Kits & Sanitation</option>
                  <option value="Infant & Baby Nutrition">Infant & Baby Nutrition</option>
                  <option value="Blankets & Cold Weather Gear">Blankets & Clothing</option>
                  <option value="Power, Lanterns & Batteries">Power & Batteries</option>
                </select>
              </div>

              <div className="sh-form-group">
                <label className="sh-form-label">Priority / Urgency *</label>
                <select
                  className="sh-form-select"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  required
                >
                  <option value="Critical">Critical - Urgent (immediate dispatch)</option>
                  <option value="High">High Priority (within 12h)</option>
                  <option value="Medium">Medium Priority (standard replenishment)</option>
                  <option value="Low">Low Priority (planned restock)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sh-form-group">
                <label className="sh-form-label">Requested Quantity *</label>
                <input
                  type="number"
                  min="1"
                  className="sh-form-input"
                  placeholder="e.g. 50"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="sh-form-group">
                <label className="sh-form-label">Measurement Unit</label>
                <select
                  className="sh-form-select"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="units">Units / Pieces</option>
                  <option value="kits">Kits / Packs</option>
                  <option value="cartons">Cartons / Boxes</option>
                  <option value="litres">Litres</option>
                  <option value="kg">Kilograms (kg)</option>
                </select>
              </div>
            </div>

            <div className="sh-form-group">
              <label className="sh-form-label">Operational Justification / Specific Requirements</label>
              <textarea
                className="sh-form-textarea"
                rows={3}
                placeholder="Specify requirements, storage constraints or special delivery instructions..."
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
                backgroundColor: '#f6f9f5',
                border: '1px solid #dbe4c6',
                borderRadius: '6px',
                fontSize: '11.5px',
                color: '#2d4b35'
              }}
            >
              <ShieldCheck size={16} color="#15803d" />
              <span>
                Requisition is routed directly to the Logistics Manager and tracked under official supply chain telemetry.
              </span>
            </div>
          </div>

          <div className="sh-modal-actions">
            <button type="button" className="sh-btn-outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="sh-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Requisition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

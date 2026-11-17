import React, { useState } from 'react';
import { X, Plus, DollarSign, Package, CheckCircle2 } from 'lucide-react';

export const CreateRecordModal = ({ isOpen, onClose, onCreateRecord }) => {
  const [formData, setFormData] = useState({
    source: '',
    donorOrg: '',
    contactPerson: '',
    type: 'Monetary',
    recordedValue: '',
    currency: 'LKR',
    allocation: 'Flood campaign',
    operationalArea: 'Colombo District',
    notes: '',
    category: 'Emergency Relief'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.source || !formData.recordedValue) return;

    const newId = `DON-${Math.floor(2050 + Math.random() * 900)}`;
    const newRecord = {
      id: newId,
      source: formData.source,
      donorOrg: formData.donorOrg || formData.source,
      contactPerson: formData.contactPerson || 'Authorized Representative',
      email: 'donor.contact@reliefcore.org',
      phone: '+94 11 000 0000',
      type: formData.type,
      recordedValue: formData.type === 'Monetary' ? `LKR ${Number(formData.recordedValue).toLocaleString()}` : `${formData.recordedValue} units`,
      rawValue: Number(formData.recordedValue) || 100,
      currency: formData.type === 'Monetary' ? 'LKR' : 'Units',
      verification: 'Verified',
      allocation: formData.allocation,
      allocationTarget: `${formData.allocation} Rapid Reserve`,
      status: 'Allocated',
      statusColor: '#0284c7',
      statusBg: '#eff6ff',
      statusBorder: '#bfdbfe',
      operationalArea: formData.operationalArea,
      notes: formData.notes || 'Prototype demonstration record logged by Funding Officer.',
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      verifiedBy: 'Malini Wijeratne (Funding Officer)',
      category: formData.category
    };

    onCreateRecord(newRecord);
    onClose();
  };

  return (
    <div className="fo-modal-backdrop" onClick={onClose}>
      <div className="fo-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="fo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="#0284c7" />
            <span className="fo-modal-title">Create Prototype Record</span>
          </div>
          <button className="fo-modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fo-modal-body">
            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              Enter demonstration donor or material contribution details to simulate funding allocation workflows within the western province disaster response scope.
            </p>

            <div className="fo-form-group">
              <label className="fo-form-label">Record Type</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className={`fo-btn ${formData.type === 'Monetary' ? 'fo-btn-primary' : 'fo-btn-secondary'}`}
                  style={{ flex: 1, padding: '8px' }}
                  onClick={() => setFormData({ ...formData, type: 'Monetary' })}
                >
                  <DollarSign size={14} />
                  <span>Monetary Contribution</span>
                </button>
                <button
                  type="button"
                  className={`fo-btn ${formData.type === 'Material' ? 'fo-btn-primary' : 'fo-btn-secondary'}`}
                  style={{ flex: 1, padding: '8px' }}
                  onClick={() => setFormData({ ...formData, type: 'Material' })}
                >
                  <Package size={14} />
                  <span>Material / In-Kind Items</span>
                </button>
              </div>
            </div>

            <div className="fo-form-group">
              <label className="fo-form-label">Source / Donor Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. Community Relief Fund, MedCare Lanka..."
                className="fo-form-input"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value, donorOrg: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="fo-form-group">
                <label className="fo-form-label">
                  {formData.type === 'Monetary' ? 'Amount (LKR) *' : 'Quantity (Units) *'}
                </label>
                <input
                  type="number"
                  required
                  placeholder={formData.type === 'Monetary' ? 'e.g. 500000' : 'e.g. 250'}
                  className="fo-form-input"
                  value={formData.recordedValue}
                  onChange={(e) => setFormData({ ...formData, recordedValue: e.target.value })}
                />
              </div>

              <div className="fo-form-group">
                <label className="fo-form-label">Category</label>
                <select
                  className="fo-form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Emergency Relief">Emergency Relief</option>
                  <option value="Medical Supplies">Medical Supplies</option>
                  <option value="Food & Rations">Food & Rations</option>
                  <option value="WASH (Clean Water)">WASH (Clean Water)</option>
                  <option value="Shelter Bedding">Shelter Bedding</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="fo-form-group">
                <label className="fo-form-label">Allocation Stream</label>
                <select
                  className="fo-form-input"
                  value={formData.allocation}
                  onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
                >
                  <option value="Flood campaign">Flood campaign</option>
                  <option value="Shelter supplies">Shelter supplies</option>
                  <option value="Medical stockpiles">Medical stockpiles</option>
                  <option value="Clean water bowsers">Clean water bowsers</option>
                  <option value="Unallocated">Unallocated (Hold)</option>
                </select>
              </div>

              <div className="fo-form-group">
                <label className="fo-form-label">Operational Area</label>
                <select
                  className="fo-form-input"
                  value={formData.operationalArea}
                  onChange={(e) => setFormData({ ...formData, operationalArea: e.target.value })}
                >
                  <option value="Colombo District">Colombo District</option>
                  <option value="Gampaha District">Gampaha District</option>
                  <option value="Kalutara District">Kalutara District</option>
                  <option value="Kelani Basin Hub">Kelani Basin Hub</option>
                </select>
              </div>
            </div>

            <div className="fo-form-group">
              <label className="fo-form-label">Authorised Note / Decision Reason</label>
              <textarea
                className="fo-form-input"
                rows="3"
                placeholder="Audit memorandum and verification signoff notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="fo-modal-footer">
            <button type="button" className="fo-btn fo-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fo-btn fo-btn-primary">
              <CheckCircle2 size={15} />
              <span>Save & Register Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export const CreateRecordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: `COM-${Math.floor(100 + Math.random() * 900)}`,
    sharedIncident: 'CR-2026-014',
    contribution: '',
    quantity: '',
    responsibleOrg: 'National Relief Unit',
    deadline: '11 Feb - 14:00',
    status: 'Confirmed',
    type: 'Contribution',
    operationalArea: 'Western Province',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.contribution || !formData.quantity) return;
    onSave(formData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Create Prototype Record</h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Commitment ID</label>
                <input
                  type="text"
                  className="po-table-search-field"
                  style={{ paddingLeft: '12px' }}
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Shared Incident</label>
                <input
                  type="text"
                  className="po-table-search-field"
                  style={{ paddingLeft: '12px' }}
                  value={formData.sharedIncident}
                  onChange={(e) => setFormData({ ...formData, sharedIncident: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Contribution / Request Item</label>
              <input
                type="text"
                placeholder="e.g. Drinking Water, Medical team, Food packets"
                className="po-table-search-field"
                style={{ paddingLeft: '12px' }}
                value={formData.contribution}
                onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Quantity / Units</label>
                <input
                  type="text"
                  placeholder="e.g. 800 units, 4 vehicles"
                  className="po-table-search-field"
                  style={{ paddingLeft: '12px' }}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Deadline</label>
                <input
                  type="text"
                  className="po-table-search-field"
                  style={{ paddingLeft: '12px' }}
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Responsible Org</label>
                <select
                  className="po-dropdown-select"
                  style={{ width: '100%' }}
                  value={formData.responsibleOrg}
                  onChange={(e) => setFormData({ ...formData, responsibleOrg: e.target.value })}
                >
                  <option value="National Relief Unit">National Relief Unit</option>
                  <option value="MediCare Lanka">MediCare Lanka</option>
                  <option value="Community Relief Lanka">Community Relief Lanka</option>
                  <option value="Habitat Aid Global">Habitat Aid Global</option>
                  <option value="Partner network">Partner network</option>
                </select>
              </div>
              <div>
                <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Status</label>
                <select
                  className="po-dropdown-select"
                  style={{ width: '100%' }}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Awaiting response">Awaiting response</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{
            padding: '14px 22px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            backgroundColor: '#f8fafc'
          }}>
            <button
              type="button"
              className="po-btn-white-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="po-btn-blue-primary">
              <Plus size={14} /> Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


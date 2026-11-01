import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const CreateIncidentModal = ({
  isOpen,
  onClose,
  newIncidentForm,
  setNewIncidentForm,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div className="ec-verify-modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#0284c7" />
            <h3 className="ec-modal-title">Create Crisis Incident Record</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="ec-form-field-group">
            <label className="ec-field-label-tiny">INCIDENT NAME *</label>
            <input
              type="text"
              required
              className="ec-modal-textarea"
              placeholder="e.g. Kolonnawa Secondary Flood Wave"
              value={newIncidentForm.title}
              onChange={(e) => setNewIncidentForm({ ...newIncidentForm, title: e.target.value })}
            />
          </div>

          <div className="ec-form-field-group">
            <label className="ec-field-label-tiny">SEVERITY LEVEL</label>
            <select
              className="ec-modal-textarea"
              value={newIncidentForm.severity}
              onChange={(e) => setNewIncidentForm({ ...newIncidentForm, severity: e.target.value })}
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          <div className="ec-form-field-group">
            <label className="ec-field-label-tiny">OPERATIONAL AREA</label>
            <input
              type="text"
              className="ec-modal-textarea"
              placeholder="e.g. Kolonnawa Division - Sector 02"
              value={newIncidentForm.area}
              onChange={(e) => setNewIncidentForm({ ...newIncidentForm, area: e.target.value })}
            />
          </div>

          <div className="ec-modal-actions-footer">
            <button type="button" className="ec-btn-hero-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ec-btn-verify-primary" style={{ width: 'auto', padding: '8px 18px' }}>
              Create Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

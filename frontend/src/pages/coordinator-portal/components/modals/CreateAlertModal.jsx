import React from 'react';
import { Megaphone, X } from 'lucide-react';

export const CreateAlertModal = ({
  isOpen,
  onClose,
  newAlertForm,
  setNewAlertForm,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div className="ec-verify-modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Megaphone size={18} color="#dc2626" />
            <h3 className="ec-modal-title">Broadcast Emergency Alert</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="ec-form-field-group">
            <label className="ec-field-label-tiny">ALERT TITLE *</label>
            <input
              type="text"
              required
              className="ec-modal-textarea"
              placeholder="e.g. Flash Flood Evacuation Notice - Kelani Valley"
              value={newAlertForm.title}
              onChange={(e) => setNewAlertForm({ ...newAlertForm, title: e.target.value })}
            />
          </div>

          <div className="ec-form-field-group">
            <label className="ec-field-label-tiny">TARGET REGION</label>
            <input
              type="text"
              className="ec-modal-textarea"
              value={newAlertForm.area}
              onChange={(e) => setNewAlertForm({ ...newAlertForm, area: e.target.value })}
            />
          </div>

          <div className="ec-modal-actions-footer">
            <button type="button" className="ec-btn-hero-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ec-btn-reject-red" style={{ width: 'auto', padding: '8px 18px' }}>
              Broadcast Immediately
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

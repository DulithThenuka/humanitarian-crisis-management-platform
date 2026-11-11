import React from 'react';
import { ShieldCheck } from 'lucide-react';
import './CoordinatorModals.css';

export const VerifyRequestModal = ({
  isOpen,
  onClose,
  verifyReason,
  setVerifyReason,
  verifyConfirmedCheck,
  setVerifyConfirmedCheck,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div className="ec-verify-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="ec-modal-shield-icon icon-primary">
          <ShieldCheck size={22} color="#0284c7" />
        </div>

        <div>
          <h3 className="ec-modal-title">Mark request as verified?</h3>
          <p className="ec-modal-desc">
            This consequential action will record your identity, timestamp, related request, and reason in the decision history.
          </p>
        </div>

        <div className="ec-form-field-group">
          <label className="ec-field-label-tiny">REASON *</label>
          <textarea
            rows={3}
            className="ec-modal-textarea"
            placeholder="Provide a clear operational reason..."
            value={verifyReason}
            onChange={(e) => setVerifyReason(e.target.value)}
          />
        </div>

        <label className="ec-modal-checkbox-row">
          <input
            type="checkbox"
            checked={verifyConfirmedCheck}
            onChange={(e) => setVerifyConfirmedCheck(e.target.checked)}
            style={{ accentColor: '#0284c7' }}
          />
          <span>I reviewed the request information and understand the operational impact.</span>
        </label>

        <div className="ec-modal-actions-footer">
          <button type="button" className="ec-btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="ec-btn-confirm-primary"
            disabled={!verifyReason.trim() || !verifyConfirmedCheck}
            onClick={onConfirm}
          >
            Confirm action
          </button>
        </div>
      </div>
    </div>
  );
};

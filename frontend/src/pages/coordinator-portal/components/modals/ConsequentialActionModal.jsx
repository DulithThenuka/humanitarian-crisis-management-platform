import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import './CoordinatorModals.css';

export const ConsequentialActionModal = ({
  isOpen,
  onClose,
  title,
  subtitle = 'This consequential action will record your identity, timestamp, related request, and reason in the decision history.',
  icon,
  reason,
  setReason,
  confirmedCheck,
  setConfirmedCheck,
  onConfirm,
  confirmText = 'Confirm action',
  confirmVariant = 'primary'
}) => {
  if (!isOpen) return null;

  const isDanger = confirmVariant === 'danger';

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div className="ec-verify-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Shield Icon in Styled Circle Badge */}
        <div className={`ec-modal-shield-icon ${isDanger ? 'icon-danger' : 'icon-primary'}`}>
          {icon || (isDanger ? <ShieldAlert size={22} color="#dc2626" /> : <ShieldCheck size={22} color="#0284c7" />)}
        </div>

        {/* Modal Header */}
        <div>
          <h3 className="ec-modal-title">{title}</h3>
          <p className="ec-modal-desc">{subtitle}</p>
        </div>

        {/* Reason Textarea */}
        <div className="ec-form-field-group">
          <label className="ec-field-label-tiny">REASON *</label>
          <textarea
            rows={3}
            className="ec-modal-textarea"
            placeholder="Provide a clear operational reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Impact Acknowledgment Checkbox */}
        <label className="ec-modal-checkbox-row">
          <input
            type="checkbox"
            checked={confirmedCheck}
            onChange={(e) => setConfirmedCheck(e.target.checked)}
            style={{ accentColor: isDanger ? '#dc2626' : '#0284c7' }}
          />
          <span>I reviewed the request information and understand the operational impact.</span>
        </label>

        {/* Footer Actions */}
        <div className="ec-modal-actions-footer">
          <button
            type="button"
            className="ec-btn-modal-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={isDanger ? 'ec-btn-confirm-danger' : 'ec-btn-confirm-primary'}
            disabled={!reason.trim() || !confirmedCheck}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

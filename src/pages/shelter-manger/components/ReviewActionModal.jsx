import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const ReviewActionModal = ({
  isOpen,
  actionType = 'allocation', // 'allocation', 'clarification', 'escalation'
  shelter,
  onClose,
  onConfirm
}) => {
  const [reason, setReason] = useState('');
  const [isReviewedChecked, setIsReviewedChecked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setIsReviewedChecked(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actionTitles = {
    allocation: 'Confirm this reviewed action?',
    clarification: 'Request clarification for this record?',
    escalation: 'Escalate this reviewed record?'
  };

  const actionButtonLabels = {
    allocation: 'Confirm prototype action',
    clarification: 'Submit clarification request',
    escalation: 'Confirm prototype escalation'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isReviewedChecked) return;
    onConfirm({
      shelterId: shelter?.id,
      actionType,
      reason: reason.trim() || 'Reviewed and confirmed according to role-scoped procedure.'
    });
    onClose();
  };

  return (
    <div className="sh-modal-backdrop" onClick={onClose}>
      <div
        className="sh-action-card-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Icon Badge matching Figma */}
        <div className="sh-action-card-icon-wrap">
          <div className="sh-action-card-icon-circle">
            <ShieldCheck size={24} />
          </div>
          <button className="sh-modal-close-corner-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Title & Subtitle */}
        <h2 className="sh-action-card-title">
          {actionTitles[actionType] || 'Confirm this reviewed action?'}
        </h2>
        <p className="sh-action-card-desc">
          UI-only prototype action. No backend transaction occurs. Reviewer, reason and timestamp are represented in the local audit trail.
        </p>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="sh-action-card-form-group">
            <label className="sh-action-card-label">Required reason</label>
            <textarea
              className="sh-action-card-textarea"
              placeholder="Provide an operational reason..."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Checkbox */}
          <label className="sh-action-card-checkbox-label">
            <input
              type="checkbox"
              className="sh-action-card-checkbox"
              checked={isReviewedChecked}
              onChange={(e) => setIsReviewedChecked(e.target.checked)}
            />
            <span>I reviewed the available information and role scope.</span>
          </label>

          {/* Footer Buttons */}
          <div className="sh-action-card-footer">
            <button
              type="button"
              className="sh-action-card-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sh-action-card-btn-confirm"
              disabled={!isReviewedChecked}
            >
              {actionButtonLabels[actionType] || 'Confirm prototype action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


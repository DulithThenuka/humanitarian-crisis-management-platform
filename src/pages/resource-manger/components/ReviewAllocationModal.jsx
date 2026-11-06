import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const ReviewAllocationModal = ({
  isOpen,
  actionType = 'approve', // 'approve', 'reject', 'clarification', 'delivery'
  item,
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
    approve: 'Confirm this reviewed action?',
    reject: 'Confirm rejection of this request?',
    clarification: 'Request clarification for this record?',
    delivery: 'Confirm delivery acknowledgement?'
  };

  const actionButtonLabels = {
    approve: 'Confirm prototype action',
    reject: 'Confirm rejection',
    clarification: 'Submit clarification request',
    delivery: 'Confirm delivery'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isReviewedChecked) return;
    onConfirm({
      itemId: item?.id,
      actionType,
      reason: reason.trim() || 'Reviewed and confirmed according to role-scoped procedure.'
    });
    onClose();
  };

  return (
    <div className="rm-modal-backdrop" onClick={onClose}>
      <div
        className="rm-action-card-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Icon Badge matching Figma */}
        <div className="rm-action-card-icon-wrap">
          <div className="rm-action-card-icon-circle">
            <ShieldCheck size={24} />
          </div>
          <button className="rm-modal-close-corner-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Title & Subtitle */}
        <h2 className="rm-action-card-title">
          {actionTitles[actionType] || 'Confirm this reviewed action?'}
        </h2>
        <p className="rm-action-card-desc">
          UI-only prototype action. No backend transaction occurs. Reviewer, reason and timestamp are represented in the local audit trail.
        </p>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="rm-action-card-form-group">
            <label className="rm-action-card-label">Required reason</label>
            <textarea
              className="rm-action-card-textarea"
              placeholder="Provide an operational reason..."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Checkbox */}
          <label className="rm-action-card-checkbox-label">
            <input
              type="checkbox"
              className="rm-action-card-checkbox"
              checked={isReviewedChecked}
              onChange={(e) => setIsReviewedChecked(e.target.checked)}
            />
            <span>I reviewed the available information and role scope.</span>
          </label>

          {/* Footer Buttons */}
          <div className="rm-action-card-footer">
            <button
              type="button"
              className="rm-action-card-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rm-action-card-btn-confirm"
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


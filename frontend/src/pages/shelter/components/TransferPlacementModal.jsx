import React, { useState } from 'react';
import { X, ArrowRightLeft, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';
import { shelterService } from '../../../services/shelterService';

export const TransferPlacementModal = ({
  isOpen,
  onClose,
  placement,
  shelters = [],
  onSuccess
}) => {
  const [targetShelterId, setTargetShelterId] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen || !placement) return null;

  const partySize = placement.partySize || 1;
  const currentShelterId = placement.shelterId;
  const availableDestinations = shelters.filter((s) => s.id !== currentShelterId);

  const selectedTargetShelter = shelters.find((s) => s.id === targetShelterId);
  const targetAvailableBeds = selectedTargetShelter ? (selectedTargetShelter.available ?? 0) : 0;
  const isOverCapacity = selectedTargetShelter && partySize > targetAvailableBeds;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetShelterId) {
      setErrorMsg('Please select a destination shelter.');
      return;
    }
    if (isOverCapacity) {
      setErrorMsg(`Destination shelter only has ${targetAvailableBeds} beds free. Cannot transfer ${partySize} persons.`);
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const payload = {
        targetShelterId,
        status: 'Confirmed',
        notes: transferReason.trim()
          ? `Transferred from ${placement.assignedShelter || 'previous shelter'}: ${transferReason.trim()}`
          : `Transferred from ${placement.assignedShelter || 'previous shelter'}`
      };

      const idToUse = placement.rawId || placement.id;
      const res = await shelterService.updatePlacementStatus(idToUse, payload);
      if (res?.succeeded === false) {
        throw new Error(res.message || 'Failed to transfer evacuee placement.');
      }

      if (onSuccess) {
        onSuccess(placement, selectedTargetShelter);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error executing shelter transfer.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <ArrowRightLeft size={18} />
            </div>
            <div>
              <h3 className="sh-modal-title">Transfer Evacuee Placement</h3>
              <div style={{ fontSize: '11px', color: '#6f8576' }}>
                Reallocate household to another operational facility
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
                  border: '1px solid #f87171',
                  color: '#991b1b',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  marginBottom: '12px'
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Current Evacuee Card */}
            <div
              style={{
                backgroundColor: '#f5f9f4',
                border: '1px solid #ddecda',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#183526' }}>
                    {placement.evacueeName}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#657367' }}>
                    Household Size: <strong>{partySize} {partySize > 1 ? 'persons' : 'person'}</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#6f8576', display: 'block' }}>Current Location</span>
                  <span style={{ fontWeight: 600, fontSize: '12.5px', color: '#183526' }}>
                    {placement.assignedShelter}
                  </span>
                </div>
              </div>
            </div>

            <div className="sh-form-group">
              <label className="sh-form-label">Destination Shelter Facility *</label>
              <select
                className="sh-form-select"
                value={targetShelterId}
                onChange={(e) => setTargetShelterId(e.target.value)}
                required
              >
                <option value="">-- Select Destination Shelter --</option>
                {availableDestinations.map((s) => {
                  const avail = s.available ?? Math.max(0, (s.capacity || 0) - (s.occupied || 0));
                  const disabled = avail < partySize;
                  return (
                    <option key={s.id} value={s.id} disabled={disabled}>
                      {s.name} ({avail} beds available / {s.capacity} cap) {disabled ? '- [INSUFFICIENT SPACE]' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedTargetShelter && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: isOverCapacity ? '#fef2f2' : '#f0fdf4',
                  border: isOverCapacity ? '1px solid #fecaca' : '1px solid #bbf7d0',
                  fontSize: '12px',
                  marginBottom: '12px'
                }}
              >
                <div>
                  <strong>{selectedTargetShelter.name}</strong>
                  <div style={{ fontSize: '11px', color: '#657367' }}>
                    {selectedTargetShelter.area} • {selectedTargetShelter.accessibility || 'Standard'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: isOverCapacity ? '#b91c1c' : '#15803d',
                      fontSize: '13px'
                    }}
                  >
                    {targetAvailableBeds} Beds Free
                  </span>
                  {isOverCapacity && (
                    <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
                      Insufficient capacity!
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="sh-form-group">
              <label className="sh-form-label">Operational Transfer Reason</label>
              <textarea
                className="sh-form-textarea"
                rows="2"
                placeholder="Medical accessibility need, family reunification, or flood surge mitigation..."
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
              />
            </div>

            <div className="sh-guard-active-alert" style={{ margin: '6px 0 0 0' }}>
              <ShieldCheck size={16} color="#15803d" style={{ marginTop: '1px', flexShrink: 0 }} />
              <div>
                <h4 className="sh-guard-title" style={{ color: '#15803d' }}>
                  Two-Way Capacity Rebalancing Active
                </h4>
                <p className="sh-guard-desc">
                  Transfer will decrement destination shelter beds, increment origin shelter beds, and maintain continuous case history.
                </p>
              </div>
            </div>
          </div>

          <div className="sh-modal-footer">
            <button
              type="button"
              className="sh-btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sh-btn-primary"
              disabled={isSubmitting || !targetShelterId || isOverCapacity}
              style={{
                opacity: isOverCapacity || !targetShelterId || isSubmitting ? 0.6 : 1,
                cursor: isOverCapacity || !targetShelterId || isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Transferring...' : 'Execute Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferPlacementModal;

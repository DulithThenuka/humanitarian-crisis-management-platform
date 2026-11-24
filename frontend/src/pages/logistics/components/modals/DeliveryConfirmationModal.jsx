import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Truck, ShieldCheck, MapPin } from 'lucide-react';

export const DeliveryConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  dispatch
}) => {
  const [receivedBy, setReceivedBy] = useState('Ruwan Silva');
  const [roleTitle, setRoleTitle] = useState('Shelter Lead / Receiving Coordinator');
  const [deliveryNotes, setDeliveryNotes] = useState('All packages physically inspected and verified intact against manifest.');

  useEffect(() => {
    if (dispatch) {
      const defaultName = dispatch.destination?.includes('Shelter') 
        ? 'Ruwan Silva' 
        : (dispatch.destination?.includes('Wattala') ? 'Dr. Priyantha Silva' : 'K. L. Bandara');
      setReceivedBy(defaultName);
      setRoleTitle('Authorized Receiving Officer');
      setDeliveryNotes('All items verified against manifest. Count and conditions verified intact.');
    }
  }, [dispatch, isOpen]);

  if (!isOpen || !dispatch) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!receivedBy.trim()) return;

    const fullSignOff = `${receivedBy.trim()} (${roleTitle.trim()})`;
    onConfirm(dispatch, fullSignOff, deliveryNotes.trim());
    onClose();
  };

  return (
    <div className="rm-modal-backdrop" onClick={onClose}>
      <div className="rm-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '490px' }}>
        {/* Header */}
        <div className="rm-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#edf4ec',
                color: '#1e3d2c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Truck size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#162e20' }}>
                Record Delivery Confirmation
              </h3>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#657367' }}>
                {dispatch.id} · {dispatch.title}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className="rm-btn-ghost" 
            style={{ padding: '6px', borderRadius: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="rm-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick Context Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              padding: '12px',
              backgroundColor: '#f7faf5',
              border: '1px solid #dce5d9',
              borderRadius: '8px',
              fontSize: '11.5px'
            }}>
              <div>
                <span style={{ color: '#657367', display: 'block' }}>Destination:</span>
                <span style={{ fontWeight: 700, color: '#162e20', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={12} color="#1e3d2c" />
                  {dispatch.destination}
                </span>
              </div>
              <div>
                <span style={{ color: '#657367', display: 'block' }}>Assigned Team:</span>
                <span style={{ fontWeight: 700, color: '#162e20', marginTop: '2px', display: 'block' }}>
                  {dispatch.team}
                </span>
              </div>
            </div>

            <div>
              <label className="rm-form-label">Received By (Officer Name) *</label>
              <input
                type="text"
                required
                className="rm-form-input"
                placeholder="e.g. Ruwan Silva, K. L. Bandara"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
              />
            </div>

            <div>
              <label className="rm-form-label">Receiving Role / Title *</label>
              <input
                type="text"
                required
                className="rm-form-input"
                placeholder="e.g. Shelter Lead, Health Officer, Community Lead"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="rm-form-label">Delivery & Handover Notes</label>
              <textarea
                rows={3}
                className="rm-note-textarea"
                placeholder="Record arrival condition, seal verification, discrepancies or remarks..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #bbf7d0',
              fontSize: '11.5px',
              color: '#166534'
            }}>
              <CheckCircle2 size={16} color="#166534" style={{ flexShrink: 0 }} />
              <span>
                Confirms handover completion. The dispatch status will advance to <strong>Delivered</strong> and stamp the official sign-off record.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="rm-modal-footer">
            <button type="button" onClick={onClose} className="rm-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="rm-btn-primary">
              <CheckCircle2 size={14} />
              <span>Confirm Delivery Sign-Off</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryConfirmationModal;

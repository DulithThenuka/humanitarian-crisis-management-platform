import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, Calendar, MapPin, Check } from 'lucide-react';

export const AcceptTaskModal = ({ opportunity, onClose, onConfirm }) => {
  const [agreed, setAgreed] = useState(true);

  if (!opportunity) return null;

  return (
    <div className="vol-modal-backdrop" onClick={onClose}>
      <div className="vol-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="vol-modal-header">
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d' }}>
              Confirm Task Acceptance
            </div>
            <h3 className="vol-modal-title">{opportunity.title}</h3>
          </div>
          <button className="vol-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="vol-modal-body">
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#065f46', marginBottom: '4px' }}>
              {opportunity.categoryCode}
            </div>
            <div style={{ fontSize: '12px', color: '#047857' }}>
              You are committing to attend the operational shift at <strong>{opportunity.location}</strong> on <strong>{opportunity.date}</strong>.
            </div>
          </div>

          <div style={{ fontSize: '12.5px', color: '#334155', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Calendar size={14} style={{ color: '#64748b' }} />
              <span>Shift Time: {opportunity.shift || '08:30 - 13:30'} ({opportunity.duration})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <MapPin size={14} style={{ color: '#64748b' }} />
              <span>Deployment Staging: {opportunity.location}</span>
            </div>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8e0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#1e293b',
              lineHeight: 1.4
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ accentColor: '#183526', marginTop: '2px' }}
            />
            <span>
              I confirm that I am fit for duty, agree to follow all safety guidelines, and will arrive wearing my HumanAid identification.
            </span>
          </label>
        </div>

        <div className="vol-modal-footer">
          <button className="vol-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="vol-btn-primary"
            disabled={!agreed}
            style={{ opacity: agreed ? 1 : 0.5, cursor: agreed ? 'pointer' : 'not-allowed' }}
            onClick={() => {
              onConfirm(opportunity);
              onClose();
            }}
          >
            <Check size={16} />
            <span>Confirm Acceptance</span>
          </button>
        </div>
      </div>
    </div>
  );
};


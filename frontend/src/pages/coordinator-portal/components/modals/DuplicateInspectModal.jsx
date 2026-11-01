import React from 'react';
import { Sparkles, X } from 'lucide-react';

export const DuplicateInspectModal = ({
  isOpen,
  onClose,
  onMarkDistinct
}) => {
  if (!isOpen) return null;

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div className="ec-verify-modal-card" style={{ width: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#0284c7" />
            <h3 className="ec-modal-title">Duplicate Inspection: HMR-1042 vs HMR-1018</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        <p className="ec-modal-desc">
          AI calculated 71% geographic and category similarity. Side-by-side inspection ensures no duplicate aid kits are dispatched.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff' }}>
            <span className="ec-meta-label-tiny" style={{ color: '#0284c7' }}>CURRENT REQUEST</span>
            <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '4px' }}>HMR-1042 · Emergency Shelter</div>
            <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '6px' }}>
              Location: Kelani East · Zone 03<br />
              Household: 6 people (2 children, 2 elders)<br />
              Time: 18 Feb 09:34
            </div>
          </div>

          <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fed7aa', backgroundColor: '#fff7ed' }}>
            <span className="ec-meta-label-tiny" style={{ color: '#c2410c' }}>POTENTIAL DUPLICATE</span>
            <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '4px' }}>HMR-1018 · Shelter Request</div>
            <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '6px' }}>
              Location: Kelani East · Zone 02 (800m away)<br />
              Household: 4 people (1 elder)<br />
              Time: 17 Feb 21:10
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#334155', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <strong>Coordinator Recommendation:</strong> Distinct families in adjacent flood zones. Both requests require independent shelter accommodation.
        </div>

        <div className="ec-modal-actions-footer">
          <button className="ec-btn-hero-outline" onClick={onClose}>
            Dismiss
          </button>
          <button
            className="ec-btn-verify-primary"
            style={{ width: 'auto', padding: '8px 18px' }}
            onClick={onMarkDistinct}
          >
            Mark as Distinct Case
          </button>
        </div>
      </div>
    </div>
  );
};

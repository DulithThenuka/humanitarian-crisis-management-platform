import React from 'react';
import { Sparkles, X, ShieldCheck } from 'lucide-react';

export const DuplicateInspectModal = ({
  isOpen,
  onClose,
  onMarkDistinct,
  currentCase
}) => {
  if (!isOpen) return null;

  const caseId = currentCase?.id || 'HMR-1042';
  const category = currentCase?.category || 'Emergency Shelter';
  const location = currentCase?.location || currentCase?.generalLocation || 'Kelani East · Zone 03';
  const people = currentCase?.affectedPeople ? `${currentCase.affectedPeople} people` : '6 people';
  const submittedAt = currentCase?.submittedAt || '18 Feb 09:34';

  const duplicateId = currentCase?.id === 'HMR-1039' ? 'HMR-1042' : 'HMR-1018';
  const duplicateCategory = currentCase?.id === 'HMR-1039' ? 'Medical Assistance' : 'Shelter Request';
  const duplicateLocation = currentCase?.id === 'HMR-1039' ? 'Wattala Central (950m away)' : 'Kelani East · Zone 02 (800m away)';
  const duplicatePeople = currentCase?.id === 'HMR-1039' ? '12 patients' : '4 people (1 elder)';
  const duplicateTime = '17 Feb 21:10';

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div className="ec-verify-modal-card" style={{ width: '700px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#0284c7" />
            <h3 className="ec-modal-title">Duplicate Inspection: {caseId} vs {duplicateId}</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b' }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        <p className="ec-modal-desc" style={{ marginBottom: '16px' }}>
          Automated similarity detection flagged 71% category and geographic overlap. Side-by-side inspection ensures separate households receive aid without duplicate kit dispatch.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
          <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff' }}>
            <span className="ec-meta-label-tiny" style={{ color: '#0284c7', display: 'block', marginBottom: '4px' }}>
              CURRENT REQUEST (ACTIVE)
            </span>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{caseId} · {category}</div>
            <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '6px', lineHeight: 1.5 }}>
              <strong>Location:</strong> {location}<br />
              <strong>Household:</strong> {people}<br />
              <strong>Submitted:</strong> {submittedAt}
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #fed7aa', backgroundColor: '#fff7ed' }}>
            <span className="ec-meta-label-tiny" style={{ color: '#c2410c', display: 'block', marginBottom: '4px' }}>
              POTENTIAL DUPLICATE CANDIDATE
            </span>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{duplicateId} · {duplicateCategory}</div>
            <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '6px', lineHeight: 1.5 }}>
              <strong>Location:</strong> {duplicateLocation}<br />
              <strong>Household:</strong> {duplicatePeople}<br />
              <strong>Submitted:</strong> {duplicateTime}
            </div>
          </div>
        </div>

        <div style={{
          fontSize: '12px',
          color: '#334155',
          backgroundColor: '#f8fafc',
          padding: '12px 14px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <ShieldCheck size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Coordinator Verification Finding:</strong> Distinct households identified in adjacent sectors. Both cases require independent dispatch and tracking.
          </div>
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

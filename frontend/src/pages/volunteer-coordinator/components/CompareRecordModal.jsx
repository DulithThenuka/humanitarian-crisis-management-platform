import React, { useState } from 'react';
import { X, Scale, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CompareRecordModal = ({ isOpen, onClose }) => {
  const [resolution, setResolution] = useState(null);

  if (!isOpen) return null;

  const handleResolve = (action) => {
    setResolution(action);
    setTimeout(() => {
      setResolution(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="vc-modal-overlay" onClick={onClose}>
      <div className="vc-modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="vc-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={18} style={{ color: '#233831' }} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Compare Suspected Duplicate / Related Records
            </h3>
          </div>
          <button className="vc-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="vc-modal-body">
          {/* Warning banner */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              color: '#92400e',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}
          >
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Privacy & Safety Protocol:</strong> Compare separately. Autonomous or automatic merging of volunteer identities is prohibited.
            </span>
          </div>

          {/* Comparison Table / Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* Record 1 */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>VOL-0104 (Active)</span>
                <span className="vc-status-badge vc-status-eligible">Eligible</span>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Name:</strong> Nimali Senanayake</div>
                <div><strong>Skills:</strong> Logistics, First Aid</div>
                <div><strong>Area:</strong> Kelani East</div>
                <div><strong>Availability:</strong> Available (On-call)</div>
                <div><strong>Current Shift:</strong> None</div>
                <div><strong>Verification:</strong> Verified (SL Red Cross)</div>
              </div>
            </div>

            {/* Record 2 */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>VOL-0212 (Duplicate Flag)</span>
                <span className="vc-status-badge vc-status-assigned">Assigned</span>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Name:</strong> Dinesh Wickramasinghe</div>
                <div><strong>Skills:</strong> Driving, Distribution</div>
                <div><strong>Area:</strong> Niyagama North</div>
                <div><strong>Availability:</strong> 08:00 - 14:00</div>
                <div><strong>Current Shift:</strong> Supply delivery</div>
                <div><strong>Verification:</strong> Verified</div>
              </div>
            </div>
          </div>

          {/* Analysis Note */}
          <div style={{ fontSize: '12px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '10px 12px', borderRadius: '6px', marginBottom: '16px' }}>
            <strong>Analysis:</strong> Different individuals, non-conflicting national IDs. Flagged solely due to adjacent transport corridor in Kelani basin. No identity overlap detected.
          </div>

          {resolution && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '6px',
                color: '#065f46',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Resolution logged: <strong>{resolution}</strong>. Retained in coordinator audit.</span>
            </div>
          )}
        </div>

        <div className="vc-modal-footer">
          <button type="button" className="vc-btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="vc-btn-outline"
            style={{ color: '#b45309', borderColor: '#fde68a' }}
            onClick={() => handleResolve('Flagged for Supervisor Investigation')}
          >
            Flag for Review
          </button>
          <button
            type="button"
            className="vc-btn-primary"
            onClick={() => handleResolve('Confirmed Distinct Records (Kept Separate)')}
          >
            Confirm Distinct (Keep Separate)
          </button>
        </div>
      </div>
    </div>
  );
};


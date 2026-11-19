import React, { useState } from 'react';
import { X, Scale, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CompareRecordModal = ({ isOpen, onClose, duplicateInfo }) => {
  const [resolution, setResolution] = useState(null);

  if (!isOpen) return null;

  const handleResolve = (action) => {
    setResolution(action);
    setTimeout(() => {
      setResolution(null);
      onClose();
    }, 1500);
  };

  const record1 = duplicateInfo?.record1 || {
    ref: 'VOL-0104 (Current Candidate)',
    name: 'Bob Volunteer',
    skills: 'Logistics, First Aid',
    serviceArea: 'Kelani East',
    availability: 'Available (On-call)',
    currentShift: 'None',
    verification: 'Verified',
    status: 'Eligible'
  };

  const record2 = duplicateInfo?.record2 || {
    ref: duplicateInfo?.ref || 'VOL-0212 (Flagged Candidate)',
    name: 'Field Volunteer #2',
    skills: duplicateInfo?.skills || 'Driving, Distribution',
    serviceArea: 'Biyagama North',
    availability: '08:00 - 14:00',
    currentShift: 'Supply delivery',
    verification: 'Verified',
    status: 'Assigned'
  };

  return (
    <div className="vc-modal-overlay" onClick={onClose}>
      <div className="vc-modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="vc-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={18} style={{ color: '#233831' }} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#14291e' }}>
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
            <div style={{ border: '1px solid #dfe5d8', borderRadius: '8px', padding: '14px', backgroundColor: '#f4f6f2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#14291e' }}>{record1.ref}</span>
                <span className="vc-status-badge vc-status-eligible">{record1.status}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#4a5b4a', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Name:</strong> {record1.name}</div>
                <div><strong>Skills:</strong> {record1.skills}</div>
                <div><strong>Area:</strong> {record1.serviceArea}</div>
                <div><strong>Availability:</strong> {record1.availability}</div>
                <div><strong>Current Shift:</strong> {record1.currentShift}</div>
                <div><strong>Verification:</strong> {record1.verification}</div>
              </div>
            </div>

            {/* Record 2 */}
            <div style={{ border: '1px solid #dfe5d8', borderRadius: '8px', padding: '14px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#14291e' }}>{record2.ref}</span>
                <span className="vc-status-badge vc-status-assigned">{record2.status}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#4a5b4a', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Name:</strong> {record2.name}</div>
                <div><strong>Skills:</strong> {record2.skills}</div>
                <div><strong>Area:</strong> {record2.serviceArea}</div>
                <div><strong>Availability:</strong> {record2.availability}</div>
                <div><strong>Current Shift:</strong> {record2.currentShift}</div>
                <div><strong>Verification:</strong> {record2.verification}</div>
              </div>
            </div>
          </div>

          {/* Analysis Note */}
          <div style={{ fontSize: '12px', color: '#657367', backgroundColor: '#eef1ea', padding: '10px 12px', borderRadius: '6px', marginBottom: '16px' }}>
            <strong>Analysis:</strong> {duplicateInfo?.note || 'Distinct volunteer entities verified in SQL Server. Flagged due to matching operational sector or complementary emergency skills. No identity clash detected.'}
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
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Resolution logged: <strong>{resolution}</strong>. Audit trail updated.</span>
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
            onClick={() => handleResolve('Confirmed Independent')}
          >
            Confirm Distinct Records
          </button>
          <button
            type="button"
            className="vc-btn-primary"
            onClick={() => handleResolve('Flagged for Manual Investigation')}
          >
            Flag for Supervisor
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

export const DualApprovalModal = ({ isOpen, onClose, record, onConfirmApproval }) => {
  const [coSignatory, setCoSignatory] = useState('Amara Chen (Emergency Coordinator)');
  const [pinCode, setPinCode] = useState('');
  const [authorizerNote, setAuthorizerNote] = useState('');

  if (!isOpen || !record) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    onConfirmApproval({
      recordId: record.id,
      coSignatory,
      authorizerNote: authorizerNote || 'Dual authorization verified and executed.',
      approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    onClose();
  };

  return (
    <div className="fo-modal-backdrop" onClick={onClose}>
      <div className="fo-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="fo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#059669" />
            <span className="fo-modal-title">Dual Authorization & Approval</span>
          </div>
          <button className="fo-modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleConfirm}>
          <div className="fo-modal-body">
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '12px 14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <AlertCircle size={20} color="#0284c7" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: '#0369a1', lineHeight: 1.4 }}>
                Pursuant to humanitarian financial governance rules, disbursements and allocations exceeding LKR 250,000 require dual officer signoff.
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px 14px'
            }}>
              <div>
                <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Target Record</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7', marginTop: '2px' }}>{record.id}</div>
                <div style={{ fontSize: '11px', color: '#334155' }}>{record.source || record.title}</div>
              </div>
              <div>
                <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Value / Commitment</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                  {record.recordedValue || record.allocatedAmount}
                </div>
                <div style={{ fontSize: '11px', color: '#334155' }}>{record.allocation || record.cluster}</div>
              </div>
            </div>

            <div className="fo-form-group">
              <label className="fo-form-label">Primary Authorizer (Signed)</label>
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '12.5px',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600
              }}>
                <UserCheck size={14} color="#059669" />
                <span>Malini Wijeratne — Donor / Funding Officer (Signed)</span>
              </div>
            </div>

            <div className="fo-form-group">
              <label className="fo-form-label">Required Co-Signatory</label>
              <select
                className="fo-form-input"
                value={coSignatory}
                onChange={(e) => setCoSignatory(e.target.value)}
              >
                <option value="Amara Chen (Emergency Coordinator)">Amara Chen (Emergency Coordinator)</option>
                <option value="D. Mendis (Finance Comptroller)">D. Mendis (Finance Comptroller)</option>
                <option value="Dr. Dayan Jayasuriya (Health Liaison)">Dr. Dayan Jayasuriya (Health Liaison)</option>
              </select>
            </div>

            <div className="fo-form-group">
              <label className="fo-form-label">Audit Decision Memorandum</label>
              <textarea
                className="fo-form-input"
                rows="2"
                placeholder="Compliance rationale and allocation purpose..."
                value={authorizerNote}
                onChange={(e) => setAuthorizerNote(e.target.value)}
              ></textarea>
            </div>

            <div className="fo-form-group">
              <label className="fo-form-label">Authorizer Passkey / PIN (Simulation: 2026)</label>
              <input
                type="password"
                placeholder="Enter 4-digit token..."
                defaultValue="2026"
                className="fo-form-input"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
          </div>

          <div className="fo-modal-footer">
            <button type="button" className="fo-btn fo-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fo-btn fo-btn-primary">
              <CheckCircle2 size={15} />
              <span>Confirm Dual Authorization</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

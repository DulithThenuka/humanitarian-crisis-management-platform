import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export const ReceiptPreviewModal = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fo-modal-backdrop" onClick={onClose}>
      <div className="fo-modal-card" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <div className="fo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#3d6b4f" />
            <span className="fo-modal-title">Humanitarian Aid Contribution Certificate</span>
          </div>
          <button className="fo-modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="fo-modal-body" id="printable-receipt">
          {/* Certificate Container (Clean White Document) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #dfe5d8',
            borderRadius: '10px',
            padding: '24px',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            {/* Top Certificate Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #dfe5d8', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#3d6b4f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Heart size={16} color="#fff" />
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#14291e', letterSpacing: '-0.02em' }}>HumanAid</span>
                </div>
                <div style={{ fontSize: '11px', color: '#657367' }}>HumanAid Emergency Response Directorate</div>
                <div style={{ fontSize: '10px', color: '#8a9480' }}>Western Province Crisis Response Fund · LK-TAX-EXEMPT-0941</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0'
                }}>
                  VERIFIED AUDIT RECEIPT
                </span>
                <div style={{ fontSize: '11px', color: '#657367', marginTop: '6px' }}>Ref: {record.id}</div>
                <div style={{ fontSize: '10px', color: '#8a9480' }}>Issued: {record.verifiedAt || '2026-11-05'}</div>
              </div>
            </div>

            {/* Donor & Contribution Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: '#657367', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Donor Organization / Entity</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#14291e', marginTop: '3px' }}>{record.source || record.donorOrg}</div>
                <div style={{ fontSize: '11px', color: '#657367' }}>Contact: {record.contactPerson || 'Authorized Representative'}</div>
                <div style={{ fontSize: '11px', color: '#8a9480' }}>Scope: {record.operationalArea || 'Western Province'}</div>
              </div>

              <div>
                <span style={{ fontSize: '10.5px', color: '#657367', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Certified Value / Quantities</span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#3d6b4f', marginTop: '3px' }}>{record.recordedValue}</div>
                <div style={{ fontSize: '11px', color: '#657367' }}>Type: {record.type} · {record.category || 'Disaster Relief'}</div>
                <div style={{ fontSize: '11px', color: '#8a9480' }}>Allocation: {record.allocation || 'Emergency Reserve'}</div>
              </div>
            </div>

            {/* Verification Signoff */}
            <div style={{
              backgroundColor: '#f4f6f2',
              border: '1px solid #dfe5d8',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#3d6b4f', marginBottom: '4px' }}>
                AUDIT MEMORANDUM & DECISION REASON
              </div>
              <div style={{ fontSize: '11.5px', color: '#2a4a35', lineHeight: 1.5 }}>
                {record.notes || 'Contribution received, authenticated and allocated strictly in accordance with Disaster Management Centre (DMC) emergency guidelines.'}
              </div>
            </div>

            {/* Signatures & Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '10px', borderTop: '1px dashed #dfe5d8' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#657367' }}>Authorized Officer:</div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#14291e' }}>Malini Wijeratne</div>
                <div style={{ fontSize: '10.5px', color: '#3d6b4f', fontWeight: 600 }}>Funding Officer, Tier 3 Clearance</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#657367' }}>SHA-256: 7f8c9b2a...e041</div>
                <div style={{ fontSize: '10px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '2px', fontWeight: 600 }}>
                  <CheckCircle2 size={12} />
                  <span>Audited by External Oversight</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fo-modal-footer">
          <button type="button" className="fo-btn fo-btn-secondary" onClick={handlePrint}>
            <Printer size={14} />
            <span>Print Certificate</span>
          </button>
          <button type="button" className="fo-btn fo-btn-primary" onClick={onClose}>
            <Download size={14} />
            <span>Download Signed PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

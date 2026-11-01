import React from 'react';
import { FileText, X } from 'lucide-react';

export const AttachmentPreviewModal = ({
  isOpen,
  onClose,
  attachment,
  previewImageSrc
}) => {
  if (!isOpen) return null;

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div
        className="ec-verify-modal-card"
        style={{ width: '600px', padding: '16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#0284c7" />
            <strong style={{ fontSize: '13px' }}>{attachment?.fileName}</strong>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', backgroundColor: '#0f172a' }}>
          <img
            src={previewImageSrc}
            alt="Uploaded evidence"
            style={{ width: '100%', height: 'auto', maxHeight: '420px', objectFit: 'contain', display: 'block' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/req-drawer-flood.jpg';
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
          <span>Uploaded: 18 Feb 2026 09:34</span>
          <span>Metadata: GPS (6.9271° N, 79.8612° E) · Verifiable</span>
        </div>
      </div>
    </div>
  );
};

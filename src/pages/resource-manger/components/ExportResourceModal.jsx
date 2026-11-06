import React, { useState } from 'react';
import { Download, FileText, CheckCircle, X } from 'lucide-react';

export const ExportResourceModal = ({ isOpen, onClose, onExport, defaultScope = 'Inventory' }) => {
  const [reportType, setReportType] = useState(defaultScope);
  const [fileFormat, setFileFormat] = useState('csv');
  const [includeAuditLog, setIncludeAuditLog] = useState(true);

  if (!isOpen) return null;

  const handleDownload = () => {
    onExport({
      reportType,
      fileFormat,
      includeAuditLog,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="rm-modal-backdrop" onClick={onClose}>
      <div className="rm-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="rm-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="rm-metric-icon-tile">
              <Download size={18} />
            </div>
            <div>
              <h2 className="rm-modal-title">Export Operations Report</h2>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--rm-text-muted)' }}>
                Download role-scoped inventory and dispatch manifest
              </p>
            </div>
          </div>
          <button className="rm-modal-close-corner-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="rm-modal-body">
          <div className="rm-form-group">
            <label className="rm-form-label">Report Dataset Scope</label>
            <select
              className="rm-form-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="Inventory">Resource Inventory & Shortage Balances</option>
              <option value="Allocations">Resource Allocation Approvals & Rejections</option>
              <option value="Dispatches">Fulfillment & Last-Mile Delivery Log</option>
              <option value="Suppliers">Approved Relief Suppliers & Donations</option>
            </select>
          </div>

          <div className="rm-form-group">
            <label className="rm-form-label">Format</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {['csv', 'pdf', 'xlsx'].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFileFormat(fmt)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${fileFormat === fmt ? 'var(--rm-primary-blue)' : 'var(--rm-border)'}`,
                    backgroundColor: fileFormat === fmt ? 'var(--rm-ice-blue-pill)' : '#ffffff',
                    color: fileFormat === fmt ? 'var(--rm-primary-blue)' : 'var(--rm-text-secondary)',
                    fontWeight: 700,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <FileText size={14} />
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <label className="rm-action-card-checkbox-label" style={{ margin: '8px 0 0 0' }}>
            <input
              type="checkbox"
              className="rm-action-card-checkbox"
              checked={includeAuditLog}
              onChange={(e) => setIncludeAuditLog(e.target.checked)}
            />
            <span>Include reviewer identity and digital approval trail</span>
          </label>
        </div>

        <div className="rm-modal-footer">
          <button type="button" className="rm-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="rm-btn-primary" onClick={handleDownload}>
            <Download size={15} />
            Generate & Download
          </button>
        </div>
      </div>
    </div>
  );
};


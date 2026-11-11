import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';

export const ExportReportModal = ({ isOpen, onClose, onExportComplete }) => {
  const [reportType, setReportType] = useState('full-occupancy');
  const [format, setFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onExportComplete(`Report exported: ${reportType.toUpperCase()} (${format.toUpperCase()})`);
      onClose();
    }, 1200);
  };

  return (
    <div className="sh-modal-backdrop" onClick={onClose}>
      <div className="sh-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="sh-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: '#edf4eb',
              color: '#153322',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Download size={18} />
            </div>
            <div>
              <h3 className="sh-modal-title">Export Demo Shelter Report</h3>
              <div style={{ fontSize: '11px', color: '#6f8576' }}>Audit & Response Coordination Export</div>
            </div>
          </div>
          <button className="sh-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sh-modal-body">
          <div className="sh-form-group">
            <label className="sh-form-label">Report Data Scope</label>
            <select
              className="sh-form-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="full-occupancy">Shelter Directory & Live Occupancy Summary (All 16 Shelters)</option>
              <option value="capacity-bottlenecks">Near Capacity & Full Shelters (Bottleneck Review)</option>
              <option value="evacuee-placements">Evacuee Placements & Intake Audit</option>
              <option value="logistics-supply">Resource & Bedding Supply Handover Status</option>
            </select>
          </div>

          <div className="sh-form-group">
            <label className="sh-form-label">Document Format</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: format === 'pdf' ? '2px solid #183526' : '1px solid #d5dfd3',
                  backgroundColor: format === 'pdf' ? '#edf4eb' : '#ffffff',
                  color: '#153322',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                <FileText size={16} /> PDF Coursework Report
              </button>
              <button
                type="button"
                onClick={() => setFormat('csv')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: format === 'csv' ? '2px solid #183526' : '1px solid #d5dfd3',
                  backgroundColor: format === 'csv' ? '#edf4eb' : '#ffffff',
                  color: '#153322',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                <Download size={16} /> Raw CSV Spreadsheet
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: '#fafbf9',
            border: '1px solid #e3eae0',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '12px',
            color: '#496050',
            lineHeight: '1.4'
          }}>
            <strong>Role Scoped Notice:</strong> In compliance with the privacy boundary, the exported file will exclude all personally identifiable information of citizens and internal sensitive case annotations.
          </div>
        </div>

        <div className="sh-modal-footer">
          <button type="button" className="sh-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="sh-btn-primary"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Generating Demo Export...' : 'Download Demo Report'}
          </button>
        </div>
      </div>
    </div>
  );
};


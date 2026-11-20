import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { volunteerService } from '../../../services/volunteerService';

export const ExportReportModal = ({ isOpen, onClose, operationalArea = 'All' }) => {
  const [format, setFormat] = useState('csv');
  const [scope, setScope] = useState('all');
  const [includeAudit, setIncludeAudit] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    setErrorMsg(null);

    try {
      const response = await volunteerService.exportReport({
        format,
        scope,
        operationalArea: operationalArea === 'All operational areas' ? null : operationalArea,
        includeAudit
      });

      const exportData = response.data || response;
      const csvContent = exportData.csvContent || '';
      const fileName = exportData.fileName || `ReliefCore_Volunteer_Report_${Date.now()}.${format}`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate export report from database.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="vc-modal-overlay" onClick={onClose}>
      <div className="vc-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="vc-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} style={{ color: '#233831' }} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#14291e' }}>
              Export Volunteer Report
            </h3>
          </div>
          <button className="vc-modal-close" onClick={onClose} disabled={isExporting}>
            <X size={16} />
          </button>
        </div>

        <div className="vc-modal-body">
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#b91c1c',
                fontSize: '12px',
                marginBottom: '12px'
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label className="vc-form-label">Report Scope</label>
            <select
              className="vc-filter-select"
              style={{ width: '100%' }}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <option value="all">Entire Database Volunteer Directory</option>
              <option value="active">Active On-Duty Assignments</option>
              <option value="unfilled">Unfilled Priority Attention Tasks</option>
              <option value="area">Selected Operational Sector Specific</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label className="vc-form-label">Export Format</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className="vc-btn-outline"
                style={{
                  justifyContent: 'center',
                  padding: '10px',
                  borderColor: format === 'csv' ? '#233831' : '#dfe5d8',
                  backgroundColor: format === 'csv' ? '#f0fdf4' : '#ffffff',
                  color: format === 'csv' ? '#166534' : '#4a5b4a'
                }}
                onClick={() => setFormat('csv')}
              >
                <FileSpreadsheet size={15} />
                <span>CSV Spreadsheet</span>
              </button>

              <button
                type="button"
                className="vc-btn-outline"
                style={{
                  justifyContent: 'center',
                  padding: '10px',
                  borderColor: format === 'pdf' ? '#233831' : '#dfe5d8',
                  backgroundColor: format === 'pdf' ? '#f0fdf4' : '#ffffff',
                  color: format === 'pdf' ? '#166534' : '#4a5b4a'
                }}
                onClick={() => setFormat('pdf')}
              >
                <FileText size={15} />
                <span>Text Summary</span>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12.5px',
                color: '#2a4a35',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={includeAudit}
                onChange={(e) => setIncludeAudit(e.target.checked)}
                style={{ accentColor: '#233831' }}
              />
              Include audit timestamps and coordinator reviewer trail
            </label>
          </div>

          {downloadSuccess && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                color: '#166534',
                fontSize: '12px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Report generated successfully from live database. Download initiated.</span>
            </div>
          )}
        </div>

        <div className="vc-modal-footer">
          <button type="button" className="vc-btn-secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </button>
          <button
            type="button"
            className="vc-btn-primary"
            onClick={handleDownload}
            disabled={isExporting || downloadSuccess}
          >
            {isExporting ? (
              <>
                <Loader2 size={14} className="vc-spin" style={{ marginRight: '6px' }} />
                Generating...
              </>
            ) : (
              'Download Export'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

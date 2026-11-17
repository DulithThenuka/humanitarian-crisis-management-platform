import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

export const ExportReportModal = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState('csv');
  const [scope, setScope] = useState('all');
  const [includeAudit, setIncludeAudit] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      // Mock download file
      const dummyData = `Volunteer Coordination Report - Western Province Flood\nExported: ${new Date().toISOString()}\nScope: ${scope}\nFormat: ${format}\nAudit Trail Included: ${includeAudit}\n\nID,Skills,Area,Availability,Status\nVOL-0104,"Logistics, First Aid","Kelani East",Available,Eligible\nVOL-0212,"Driving, Distribution","Niyagama North",08:00-14:00,Assigned\nVOL-0261,"Translation, Childcare","Wattala South",Available,Review\nVOL-0298,"Medical support","Kelani East",14:00-20:00,Assigned\n`;
      const blob = new Blob([dummyData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `HumanAid_Volunteer_Report_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1000);
    }, 500);
  };

  return (
    <div className="vc-modal-overlay" onClick={onClose}>
      <div className="vc-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="vc-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} style={{ color: '#233831' }} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Export Demo Report
            </h3>
          </div>
          <button className="vc-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="vc-modal-body">
          <div style={{ marginBottom: '14px' }}>
            <label className="vc-form-label">Report Scope</label>
            <select
              className="vc-filter-select"
              style={{ width: '100%' }}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <option value="all">Entire Volunteer Directory (386 records)</option>
              <option value="active">Active On-Duty Shifts (86 records)</option>
              <option value="unfilled">Unfilled Priority Attention Tasks (14 records)</option>
              <option value="area">Western Province Flood Zone Specific</option>
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
                  borderColor: format === 'csv' ? '#233831' : '#e2e8f0',
                  backgroundColor: format === 'csv' ? '#f0fdf4' : '#ffffff',
                  color: format === 'csv' ? '#166534' : '#475569'
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
                  borderColor: format === 'pdf' ? '#233831' : '#e2e8f0',
                  backgroundColor: format === 'pdf' ? '#f0fdf4' : '#ffffff',
                  color: format === 'pdf' ? '#166534' : '#475569'
                }}
                onClick={() => setFormat('pdf')}
              >
                <FileText size={15} />
                <span>PDF Document</span>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
              <input
                type="checkbox"
                checked={includeAudit}
                onChange={(e) => setIncludeAudit(e.target.checked)}
              />
              <span>Include verification audit timestamps & decision logs</span>
            </label>
          </div>

          {downloadSuccess && (
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#ecfdf5',
                borderRadius: '6px',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={14} />
              <span>Generating prototype report file download...</span>
            </div>
          )}
        </div>

        <div className="vc-modal-footer">
          <button type="button" className="vc-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="vc-btn-primary" onClick={handleDownload}>
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};


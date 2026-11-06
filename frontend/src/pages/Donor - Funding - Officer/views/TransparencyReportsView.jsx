import React from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export const TransparencyReportsView = ({
  reports,
  onExportReport
}) => {
  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <Layers size={13} />
            <span>DISASTER TRANSPARENCY & OVERSIGHT DIRECTIVE</span>
          </div>
          <h1 className="fo-title">Transparency Reports</h1>
          <p className="fo-subtitle">
            External audit disclosures, UN cluster milestone reporting, and real-time humanitarian spending reconciliations.
          </p>
        </div>

        <button 
          className="fo-btn fo-btn-primary"
          onClick={onExportReport}
        >
          <Download size={14} />
          <span>Export Master Audit Package</span>
        </button>
      </div>

      {/* Summary KPI Banner (Crisp White Cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <div className="fo-panel" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Public Inflow Disclosed</span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>LKR 8,400,000</div>
          <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px', fontWeight: 600 }}>100% Reconciled to Treasury</div>
        </div>

        <div className="fo-panel" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Verified Disaster Aid Outflow</span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>LKR 5,370,000</div>
          <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '2px', fontWeight: 600 }}>64% of Pledged Capital Active</div>
        </div>

        <div className="fo-panel" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Audit Compliance Index</span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>99.4%</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Zero Unreconciled Discrepancies</div>
        </div>
      </div>

      {/* Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {reports.map((rep) => (
          <div 
            key={rep.id} 
            className="fo-panel"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid #bfdbfe'
              }}>
                <FileText size={22} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{rep.title}</h3>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    border: '1px solid #a7f3d0'
                  }}>
                    {rep.auditStatus}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span>Period: {rep.period}</span>
                  <span>•</span>
                  <span>Inflow: {rep.totalInflow}</span>
                  <span>•</span>
                  <span>Disbursed: {rep.totalOutflow}</span>
                  <span>•</span>
                  <span>Certified by: {rep.certifiedBy}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{rep.fileSize} · {rep.format}</span>
              <button 
                className="fo-btn fo-btn-secondary"
                style={{ padding: '8px 14px', fontSize: '12px' }}
                onClick={onExportReport}
              >
                <Download size={13} />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Download, 
  TrendingUp, 
  BarChart3, 
  CheckCircle, 
  PieChart, 
  FileSpreadsheet 
} from 'lucide-react';

export const PartnerReportsView = ({ records, onExportReport }) => {
  return (
    <div>
      <div className="po-title-action-row">
        <div>
          <div className="po-workspace-label">Compliance & Inter-Agency Governance</div>
          <h1 className="po-page-heading">Partner Reports</h1>
          <p className="po-page-subtext">
            Audited operational performance metrics, humanitarian SLA compliance, and dispatch reports.
          </p>
        </div>

        <button type="button" className="po-btn-blue-primary" onClick={onExportReport}>
          <Download size={14} />
          <span>Export Full Audit CSV</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="po-dashboard-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
        <div className="po-white-metric-card">
          <div className="po-card-meta-top">
            <span className="po-metric-title-label">SLA Compliance Rate</span>
            <div className="po-metric-icon-bubble" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="po-metric-main-number" style={{ color: '#16a34a' }}>96.4%</div>
          <div className="po-metric-subtext">Benchmark &gt; 90%</div>
        </div>

        <div className="po-white-metric-card">
          <div className="po-card-meta-top">
            <span className="po-metric-title-label">Average Response Time</span>
            <div className="po-metric-icon-bubble">
              <BarChart3 size={14} />
            </div>
          </div>
          <div className="po-metric-main-number">42 mins</div>
          <div className="po-metric-subtext">From incident triage</div>
        </div>

        <div className="po-white-metric-card">
          <div className="po-card-meta-top">
            <span className="po-metric-title-label">Completed Missions</span>
            <div className="po-metric-icon-bubble" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
              <CheckCircle size={14} />
            </div>
          </div>
          <div className="po-metric-main-number">128</div>
          <div className="po-metric-subtext">Western & Southern</div>
        </div>

        <div className="po-white-metric-card">
          <div className="po-card-meta-top">
            <span className="po-metric-title-label">Verification Score</span>
            <div className="po-metric-icon-bubble" style={{ background: '#fef3c7', color: '#d97706' }}>
              <PieChart size={14} />
            </div>
          </div>
          <div className="po-metric-main-number">100%</div>
          <div className="po-metric-subtext">Cryptographically audited</div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="po-table-card">
        <div className="po-table-controls-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={16} color="#2563eb" />
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
              Audited Operational Statements
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="po-enterprise-table">
            <thead>
              <tr>
                <th>Report Title</th>
                <th>Period</th>
                <th>Authorised Sign-off</th>
                <th>Scope</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, color: '#0f172a' }}>Western Province Flood Response - Phase 1 Manifest</td>
                <td>Feb 2026</td>
                <td>Partner Relief Unit / Director</td>
                <td>800 Water Units, 4 Ambulances</td>
                <td><span className="po-tag-success">&bull; Certified</span></td>
                <td>
                  <button 
                    type="button" 
                    className="po-btn-white-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={onExportReport}
                  >
                    <Download size={13} /> Download
                  </button>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: '#0f172a' }}>Inter-Agency Logistics Coordination Audit</td>
                <td>Jan - Feb 2026</td>
                <td>National Relief Coordinator</td>
                <td>320 Food Kits, 150 Shelter Tents</td>
                <td><span className="po-tag-success">&bull; Certified</span></td>
                <td>
                  <button 
                    type="button" 
                    className="po-btn-white-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={onExportReport}
                  >
                    <Download size={13} /> Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


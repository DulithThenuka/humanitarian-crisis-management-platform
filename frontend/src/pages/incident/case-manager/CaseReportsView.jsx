import React, { useState } from 'react';
import { 
  Download, 
  BarChart2, 
  Filter, 
  ChevronDown 
} from 'lucide-react';
import { REPORT_BARS_DATA, REPORT_BREAKDOWN } from './caseManagerData';

export const CaseReportsView = ({ showToast }) => {
  const [selectedOperation, setSelectedOperation] = useState('Current operation');
  const [hoveredBar, setHoveredBar] = useState(null);

  const handleExportCSV = () => {
    showToast?.('Exporting Case Manager reporting metrics (CSV)...', 'info');
    setTimeout(() => {
      showToast?.('Reports exported: 12-hour workload trend & breakdown saved.', 'success');
    }, 700);
  };

  return (
    <div className="cm-canvas-wrapper">
      {/* Header */}
      <div className="cm-management-head-row">
        <div>
          <span className="cm-tag-uppercase">ILLUSTRATIVE REPORTING · NOT LIVE METRICS</span>
          <h1 className="cm-canvas-h1">Case Manager Reports</h1>
          <p className="cm-canvas-sub">
            Filterable demonstration summaries use fictional coursework records.
          </p>
        </div>

        <div className="cm-mgmt-actions-group">
          <select
            className="cm-filter-select"
            value={selectedOperation}
            onChange={(e) => setSelectedOperation(e.target.value)}
          >
            <option value="Current operation">Current operation</option>
            <option value="Western Province Flood">Western Province Flood</option>
            <option value="Southern Coastal Surge">Southern Coastal Surge</option>
            <option value="All active emergencies">All active emergencies</option>
          </select>

          <button className="cm-btn-export-outline" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export demo CSV</span>
          </button>
        </div>
      </div>

      {/* Two-Column Split Layout (Screenshot 5 exact match) */}
      <div className="cm-dash-split-row">
        {/* Left Column: Unresolved Cases Over Time Bar Chart */}
        <div className="cm-panel-card">
          <div className="cm-panel-header">
            <div>
              <h3 className="cm-panel-title">Unresolved cases over time</h3>
              <p className="cm-panel-sub">Illustrative trend across monitored shift intervals</p>
            </div>
            <span className="cm-pill-tag purple">● Demo</span>
          </div>

          <div className="cm-barchart-container">
            {REPORT_BARS_DATA.map((bar) => {
              const isHovered = hoveredBar === bar.hour;
              return (
                <div 
                  key={bar.hour} 
                  className="cm-bar-col"
                  onMouseEnter={() => setHoveredBar(bar.hour)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {isHovered && (
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0284c7' }}>
                      {bar.count}
                    </span>
                  )}
                  <div 
                    className="cm-bar-pillar" 
                    style={{ height: `${bar.height}%` }}
                    title={`Interval ${bar.hour}: ${bar.count} unresolved cases`}
                  />
                  <span className="cm-bar-label">{bar.hour}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '11px', color: '#94a3b8' }}>
            <span>Shift hours (1 - 12)</span>
            <span>Average peak: Interval 8 (42 open cases)</span>
          </div>
        </div>

        {/* Right Column: Operational Breakdown Progress Bars */}
        <div className="cm-panel-card">
          <div className="cm-panel-header">
            <div>
              <h3 className="cm-panel-title">Operational breakdown</h3>
              <p className="cm-panel-sub">SLA adherence, resolution rate and verification velocity</p>
            </div>
          </div>

          <div className="cm-breakdown-list">
            {REPORT_BREAKDOWN.map((item) => (
              <div key={item.label} className="cm-breakdown-item">
                <div className="cm-breakdown-header">
                  <span className="cm-breakdown-label">{item.label}</span>
                  <span className="cm-breakdown-pct">{item.pct}%</span>
                </div>
                <div className="cm-progress-track">
                  <div 
                    className="cm-progress-bar-fill"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11.5px', color: '#64748b', lineHeight: 1.4 }}>
            <strong>System Safeguard Note:</strong> Fictional demonstration summaries reflect simulated incident records only. No production PII or external citizen metrics are stored.
          </div>
        </div>
      </div>
    </div>
  );
};

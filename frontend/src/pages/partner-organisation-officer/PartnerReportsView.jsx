import React, { useState } from 'react';

export const PartnerReportsView = ({
  onExportReport
}) => {
  const [selectedOperation, setSelectedOperation] = useState('Current operation');

  const barData = [
    { label: '1', height: 34 },
    { label: '2', height: 50 },
    { label: '3', height: 40 },
    { label: '4', height: 65 },
    { label: '5', height: 58 },
    { label: '6', height: 78 },
    { label: '7', height: 70 },
    { label: '8', height: 92 },
    { label: '9', height: 64 },
    { label: '10', height: 72 },
    { label: '11', height: 58 },
    { label: '12', height: 52 }
  ];

  const breakdownMetrics = [
    { label: 'Contributions', value: 68 },
    { label: 'Fulfilled requests', value: 82 },
    { label: 'Commitments', value: 31 },
    { label: 'Delivery performance', value: 24 }
  ];

  return (
    <div className="po-workspace">
      {/* Title & Action Block (Screenshot 7) */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>ILLUSTRATIVE REPORTING · NOT LIVE METRICS</span>
          </div>
          <h1 className="po-title">Partner Officer Reports</h1>
          <p className="po-subtitle">
            Filterable demonstration summaries use fictional coursework records.
          </p>
        </div>

        <div className="po-title-actions">
          <select
            className="po-select"
            value={selectedOperation}
            onChange={(e) => setSelectedOperation(e.target.value)}
            style={{ minWidth: '160px' }}
          >
            <option value="Current operation">Current operation</option>
            <option value="Western Province Flood">Western Province Flood</option>
            <option value="Southern Monsoon Relief">Southern Monsoon Relief</option>
            <option value="Eastern Coastal Aid">Eastern Coastal Aid</option>
          </select>

          <button 
            className="po-btn po-btn-secondary"
            onClick={onExportReport}
          >
            <span>Export demo CSV</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Contributions over time, Right Operational breakdown */}
      <div className="po-split-layout">
        {/* Left Card (60%): Contributions over time */}
        <div style={{ flex: '1 1 58%' }}>
          <div className="po-panel" style={{ padding: '24px', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                  Contributions over time
                </h3>
                <div style={{ fontSize: '12px', color: '#657367', marginTop: '3px' }}>
                  Illustrative trend
                </div>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                Demo
              </span>
            </div>

            {/* Vertical 12-bar chart */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '220px',
              padding: '0 10px',
              borderBottom: '1px solid #edf1eb',
              gap: '12px'
            }}>
              {barData.map((bar, idx) => (
                <div 
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}
                >
                  <div 
                    style={{
                      width: '100%',
                      maxWidth: '38px',
                      height: `${bar.height}%`,
                      background: 'linear-gradient(180deg, #244131 0%, #687452 100%)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.4s ease'
                    }}
                    title={`Interval ${bar.label}: ${bar.height}%`}
                  />
                </div>
              ))}
            </div>

            {/* Bottom X-axis labels 1 to 12 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 10px 0 10px',
              gap: '12px'
            }}>
              {barData.map((bar, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '11px',
                    color: '#738075',
                    fontWeight: 500
                  }}
                >
                  {bar.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card (40%): Operational breakdown */}
        <div style={{ flex: '1 1 38%' }}>
          <div className="po-panel" style={{ padding: '24px', height: '100%', boxSizing: 'border-box' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', marginBottom: '28px' }}>
              Operational breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {breakdownMetrics.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#162e20' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>
                      {item.value}%
                    </span>
                  </div>

                  {/* Horizontal progress track */}
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#e5ece0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.value}%`,
                      height: '100%',
                      backgroundColor: '#1e3d2c',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerReportsView;

import React, { useState } from 'react';
import {
  Package,
  BarChart2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  ChevronDown
} from 'lucide-react';

const CONSUMPTION_BARS = [
  { label: '06', height: 24 },
  { label: '08', height: 38 },
  { label: '10', height: 28 },
  { label: '12', height: 50 },
  { label: '14', height: 42 },
  { label: '16', height: 65 },
  { label: '18', height: 55 },
  { label: '20', height: 78 },
  { label: '22', height: 68 },
  { label: '00', height: 92, active: true },
  { label: '02', height: 72 },
  { label: '04', height: 80 }
];

const CATEGORY_STOCK = [
  { name: 'Food', count: 320, pct: 25 },
  { name: 'Water', count: 240, pct: 19 },
  { name: 'Medicine', count: 110, pct: 9 },
  { name: 'Shelter supplies', count: 438, pct: 34 },
  { name: 'Emergency kits', count: 176, pct: 13 }
];

const INCIDENT_ALLOCATIONS = [
  { name: 'CR-2026-014 · Flood response', count: '214 units', pct: 62 },
  { name: 'CR-2026-011 · Landslide watch', count: '74 units', pct: 22 },
  { name: 'Other active requests', count: '54 units', pct: 16 }
];

export const ReportsAnalyticsView = ({ showToast }) => {
  const [timeRange, setTimeRange] = useState('Last 30 days');

  const handleExport = () => {
    if (showToast) {
      showToast('Resource analytics report exported as PDF/CSV');
    }
  };

  return (
    <div className="rm-view-container">
      {/* View Header */}
      <div className="rm-view-header">
        <div>
          <span className="rm-view-pretitle">MEASURED PROTOTYPE VALUES</span>
          <h1 className="rm-view-title">Resource Reports & Analytics</h1>
          <p className="rm-view-subtitle">
            Monitor stock, consumption, allocation, fulfillment, expiry and wastage.
          </p>
        </div>
        <div className="rm-view-actions">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rm-filter-select"
              style={{
                appearance: 'none',
                paddingRight: '28px',
                backgroundColor: '#ffffff',
                border: '1px solid #d4ded3',
                borderRadius: '8px',
                height: '38px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#162e20'
              }}
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 90 days">Last 90 days</option>
              <option value="Year to date">Year to date</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#657367'
              }}
            />
          </div>

          <button onClick={handleExport} className="rm-btn-secondary">
            <Download size={14} />
            Export report
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="rm-metrics-grid rm-metrics-grid-5" style={{ marginBottom: '24px' }}>
        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-title">Stock available</span>
            <div className="rm-metric-icon-box rm-icon-green">
              <Package size={16} />
            </div>
          </div>
          <div className="rm-metric-val">1,284</div>
          <span className="rm-metric-sub">6 categories</span>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-title">Consumption</span>
            <div className="rm-metric-icon-box rm-icon-blue">
              <BarChart2 size={16} />
            </div>
          </div>
          <div className="rm-metric-val">1,642</div>
          <span className="rm-metric-sub">units in period</span>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-title">Pending requests</span>
            <div className="rm-metric-icon-box rm-icon-orange">
              <Clock size={16} />
            </div>
          </div>
          <div className="rm-metric-val">12</div>
          <span className="rm-metric-sub">4 high priority</span>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-title">Fulfilled allocations</span>
            <div className="rm-metric-icon-box rm-icon-green">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="rm-metric-val">68%</div>
          <span className="rm-metric-sub">342 approved units</span>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-title">Expiry / wastage</span>
            <div className="rm-metric-icon-box rm-icon-red">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="rm-metric-val">26</div>
          <span className="rm-metric-sub">tracked units</span>
        </div>
      </div>

      {/* Middle Grid: Trend Chart & Category Stock */}
      <div className="rm-dashboard-grid" style={{ marginBottom: '24px' }}>
        {/* Resource Consumption Trend Chart */}
        <div className="rm-chart-card">
          <div className="rm-card-header-flex">
            <div>
              <h2 className="rm-card-title">Resource consumption trend</h2>
              <p className="rm-card-subtitle">Measured stock movements · Last 30 days</p>
            </div>
          </div>

          <div className="rm-chart-body" style={{ marginTop: '20px' }}>
            <div className="rm-chart-y-axis">
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>
            <div className="rm-chart-bars-wrap">
              {CONSUMPTION_BARS.map((bar, idx) => (
                <div key={idx} className="rm-chart-col">
                  <div className="rm-chart-bar-track">
                    <div
                      className={`rm-chart-bar-fill ${bar.active ? 'rm-bar-active' : ''}`}
                      style={{ height: `${bar.height}%` }}
                    />
                  </div>
                  <span className="rm-chart-label">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock by Category Progress Bars */}
        <div className="rm-chart-card">
          <div className="rm-card-header-flex" style={{ marginBottom: '16px' }}>
            <h2 className="rm-card-title">Stock by category</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {CATEGORY_STOCK.map((cat, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px'
                  }}
                >
                  <span style={{ fontSize: '12.5px', color: '#334135', fontWeight: 500 }}>
                    {cat.name}
                  </span>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>
                      {cat.count}
                    </span>
                    <span style={{ fontSize: '11px', color: '#738075', width: '28px', textAlign: 'right' }}>
                      {cat.pct}%
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: '#e6ece3',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${cat.pct * 2.5}%`,
                      backgroundColor: '#1e3d2c',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Allocation by Incident & Pending vs Fulfilled Donut */}
      <div className="rm-dashboard-grid">
        {/* Allocation by Incident */}
        <div className="rm-chart-card">
          <div className="rm-card-header-flex" style={{ marginBottom: '16px' }}>
            <h2 className="rm-card-title">Allocation by incident</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {INCIDENT_ALLOCATIONS.map((inc, idx) => (
              <div
                key={idx}
                style={{
                  borderBottom: idx < INCIDENT_ALLOCATIONS.length - 1 ? '1px solid #f0f3ee' : 'none',
                  paddingBottom: '14px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}
                >
                  <span style={{ fontSize: '12.5px', color: '#243328', fontWeight: 600 }}>
                    {inc.name}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>
                    {inc.count}
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: '#e6ece3',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${inc.pct}%`,
                      backgroundColor: '#1e3d2c',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending versus Fulfilled Donut */}
        <div className="rm-chart-card">
          <div className="rm-card-header-flex" style={{ marginBottom: '16px' }}>
            <h2 className="rm-card-title">Pending versus fulfilled</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0' }}>
            {/* Donut Graphic */}
            <div style={{ position: 'relative', width: '130px', height: '130px' }}>
              <svg width="130" height="130" viewBox="0 0 100 100">
                {/* Circumference = 2 * PI * 38 = 238.76 */}
                {/* Background ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#e6ece3"
                  strokeWidth="14"
                />
                {/* Fulfilled segment (68%) = 162.35 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="14"
                  strokeDasharray="162.35 238.76"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* Pending segment (24%) = 57.3 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#eab308"
                  strokeWidth="14"
                  strokeDasharray="57.3 238.76"
                  strokeDashoffset="-162.35"
                  transform="rotate(-90 50 50)"
                />
                {/* Shortage segment (8%) = 19.1 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="14"
                  strokeDasharray="19.1 238.76"
                  strokeDashoffset="-219.65"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#162e20', lineHeight: 1 }}>
                  68%
                </span>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#738075', marginTop: '2px' }}>
                  fulfilled
                </span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#1e3d2c'
                  }}
                />
                <span style={{ fontSize: '12px', color: '#405044', minWidth: '70px' }}>Fulfilled</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>68%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#eab308'
                  }}
                />
                <span style={{ fontSize: '12px', color: '#405044', minWidth: '70px' }}>Pending</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>24%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444'
                  }}
                />
                <span style={{ fontSize: '12px', color: '#405044', minWidth: '70px' }}>Shortage</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalyticsView;

import React, { useState } from 'react';
import {
  Package,
  BarChart2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  ChevronDown,
  TrendingUp
} from 'lucide-react';

const CONSUMPTION_TRENDS = {
  'Last 7 days': [
    { label: '13 Nov', value: 38, target: 50 },
    { label: '14 Nov', value: 45, target: 50 },
    { label: '15 Nov', value: 42, target: 50 },
    { label: '16 Nov', value: 68, target: 50 },
    { label: '17 Nov', value: 74, target: 50 },
    { label: '18 Nov', value: 55, target: 50 },
    { label: '19 Nov', value: 82, target: 50 }
  ],
  'Last 30 days': [
    { label: '21 Oct', value: 28, target: 50 },
    { label: '24 Oct', value: 42, target: 50 },
    { label: '27 Oct', value: 34, target: 50 },
    { label: '30 Oct', value: 56, target: 50 },
    { label: '02 Nov', value: 48, target: 50 },
    { label: '05 Nov', value: 72, target: 50 },
    { label: '08 Nov', value: 60, target: 50 },
    { label: '11 Nov', value: 84, target: 50 },
    { label: '14 Nov', value: 66, target: 50 },
    { label: '17 Nov', value: 92, target: 50 },
    { label: '19 Nov', value: 78, target: 50 }
  ],
  'Last 90 days': [
    { label: '01 Sep', value: 32, target: 50 },
    { label: '15 Sep', value: 48, target: 50 },
    { label: '01 Oct', value: 54, target: 50 },
    { label: '15 Oct', value: 68, target: 50 },
    { label: '01 Nov', value: 76, target: 50 },
    { label: '15 Nov', value: 88, target: 50 },
    { label: '19 Nov', value: 74, target: 50 }
  ],
  'Year to date': [
    { label: 'Jan', value: 28, target: 50 },
    { label: 'Mar', value: 42, target: 50 },
    { label: 'May', value: 55, target: 50 },
    { label: 'Jul', value: 48, target: 50 },
    { label: 'Sep', value: 66, target: 50 },
    { label: 'Nov', value: 85, target: 50 }
  ]
};

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

// Helper to compute Catmull-Rom spline converted to cubic Bézier
function getSmoothSplinePath(pts) {
  if (!pts || pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let path = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

export const ReportsAnalyticsView = ({ showToast }) => {
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleExport = () => {
    if (showToast) {
      showToast('Resource analytics report exported as PDF/CSV');
    }
  };

  // Chart data calculations
  const trendData = CONSUMPTION_TRENDS[timeRange] || CONSUMPTION_TRENDS['Last 30 days'];
  const peakValue = Math.max(...trendData.map((d) => d.value));

  // Geometry dimensions
  const svgWidth = 680;
  const svgHeight = 220;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 18;
  const padBottom = 32;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  const bottomY = padTop + plotHeight;

  // Map data to SVG points
  const points = trendData.map((d, i) => {
    const x = padLeft + (i / (trendData.length - 1)) * plotWidth;
    const y = padTop + ((100 - d.value) / 100) * plotHeight;
    return { ...d, x, y };
  });

  const linePath = getSmoothSplinePath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${bottomY} L ${points[0].x.toFixed(1)} ${bottomY} Z`
    : '';

  const yTicks = [100, 80, 60, 40, 20, 0];
  const targetY = padTop + ((100 - 50) / 100) * plotHeight;

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
              <p className="rm-card-subtitle">Measured stock movements · {timeRange}</p>
            </div>
            <div className="rm-chart-legend">
              <div className="rm-legend-item">
                <span className="rm-legend-dot" style={{ backgroundColor: '#1e3d2c' }} />
                <span>Daily consumption</span>
              </div>
              <div className="rm-legend-item">
                <span className="rm-legend-dash" />
                <span>Daily baseline (50)</span>
              </div>
              <div className="rm-legend-stat">
                <TrendingUp size={13} style={{ color: '#15803d' }} />
                <span>Peak:</span>
                <strong>{peakValue} units</strong>
              </div>
            </div>
          </div>

          <div
            className="rm-line-chart-container"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <svg
              className="rm-line-chart-svg"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="rmConsumptionArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3d2c" stopOpacity="0.25" />
                  <stop offset="80%" stopColor="#1e3d2c" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#1e3d2c" stopOpacity="0" />
                </linearGradient>
                <filter id="rmLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#1e3d2c" floodOpacity="0.18" />
                </filter>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {yTicks.map((tick) => {
                const y = padTop + ((100 - tick) / 100) * plotHeight;
                return (
                  <g key={`ytick-${tick}`}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={svgWidth - padRight}
                      y2={y}
                      stroke="#e6ece3"
                      strokeDasharray={tick === 0 ? undefined : '4 4'}
                      strokeWidth={tick === 0 ? 1.5 : 1}
                    />
                    <text
                      x={padLeft - 10}
                      y={y + 4}
                      textAnchor="end"
                      fill="#8d9a8f"
                      fontSize="10.5"
                      fontWeight="600"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Target Baseline Reference Line (50 units) */}
              <line
                x1={padLeft}
                y1={targetY}
                x2={svgWidth - padRight}
                y2={targetY}
                stroke="#d97706"
                strokeDasharray="5 4"
                strokeWidth="1.5"
                opacity="0.85"
              />

              {/* Filled Area Gradient */}
              {areaPath && (
                <path d={areaPath} fill="url(#rmConsumptionArea)" />
              )}

              {/* Main Trend Line Spline */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#1e3d2c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#rmLineGlow)"
                />
              )}

              {/* Point Nodes */}
              {points.map((pt, i) => (
                <circle
                  key={`pt-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#1e3d2c"
                  strokeWidth="2"
                />
              ))}

              {/* X-Axis Date Labels */}
              {points.map((pt, i) => (
                <text
                  key={`xlabel-${i}`}
                  x={pt.x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  fill="#657367"
                  fontSize="11"
                  fontWeight="500"
                >
                  {pt.label}
                </text>
              ))}

              {/* Active Hover Scrubber & Highlight Indicator */}
              {hoveredIndex !== null && points[hoveredIndex] && (
                <g>
                  <line
                    x1={points[hoveredIndex].x}
                    y1={padTop}
                    x2={points[hoveredIndex].x}
                    y2={bottomY}
                    stroke="#1e3d2c"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={points[hoveredIndex].x}
                    cy={points[hoveredIndex].y}
                    r="8"
                    fill="#1e3d2c"
                    fillOpacity="0.2"
                  />
                  <circle
                    cx={points[hoveredIndex].x}
                    cy={points[hoveredIndex].y}
                    r="5"
                    fill="#1e3d2c"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                </g>
              )}

              {/* Transparent Hit-test Columns for Smooth Hover */}
              {points.map((pt, i) => {
                const colW = plotWidth / (points.length - 1);
                const xLeft = i === 0 ? padLeft : pt.x - colW / 2;
                const width = i === 0 || i === points.length - 1 ? colW / 2 : colW;
                return (
                  <rect
                    key={`hit-${i}`}
                    x={xLeft}
                    y={padTop}
                    width={width}
                    height={plotHeight}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredIndex(i)}
                  />
                );
              })}
            </svg>

            {/* Floating Tooltip Bubble */}
            {hoveredIndex !== null && points[hoveredIndex] && (
              <div
                className="rm-chart-tooltip"
                style={{
                  left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
                  top: `${(points[hoveredIndex].y / svgHeight) * 100}%`
                }}
              >
                <div className="rm-chart-tooltip-date">
                  {points[hoveredIndex].label} · Stock Movement
                </div>
                <div className="rm-chart-tooltip-row">
                  <span className="rm-chart-tooltip-dot" style={{ backgroundColor: '#1e3d2c' }} />
                  <span>Consumption:</span>
                  <strong>{points[hoveredIndex].value} units</strong>
                </div>
                <div className="rm-chart-tooltip-row">
                  <span className="rm-chart-tooltip-dot" style={{ backgroundColor: '#d97706' }} />
                  <span>Daily Target:</span>
                  <strong>{points[hoveredIndex].target} units</strong>
                </div>
              </div>
            )}
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

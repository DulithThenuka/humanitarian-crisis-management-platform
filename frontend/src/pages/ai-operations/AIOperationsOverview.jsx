import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  AlertTriangle, 
  Target, 
  Calendar, 
  BarChart2, 
  Copy, 
  Share2, 
  Home, 
  TrendingUp, 
  Globe, 
  ArrowUp, 
  ChevronDown, 
  Search, 
  Bell, 
  HelpCircle,
  ExternalLink,
  Zap,
  Activity,
  CheckCircle2,
  X,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight,
  Filter,
  Play
} from 'lucide-react';
import { 
  AI_SERVICES_CATALOG, 
  TIME_RANGE_OPTIONS, 
  createSmoothSplinePath, 
  createSmoothAreaPath 
} from './aiOperationsData';

export const AIOperationsOverview = ({ 
  queueData = [],
  onNavigateQueue, 
  onNavigateReview, 
  onNavigateWorkspaces, 
  onNavigateGovernance,
  onRunDiagnostics,
  showToast 
}) => {
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Chart state
  const [activeMetricMode, setActiveMetricMode] = useState('volume'); // 'volume' | 'accuracy' | 'latency'
  const [hiddenSeries, setHiddenSeries] = useState([]);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState(null);

  // Selected Microservice for Live Telemetry Modal
  const [inspectingService, setInspectingService] = useState(null);
  const [testInferenceInput, setTestInferenceInput] = useState('');
  const [testInferenceResult, setTestInferenceResult] = useState(null);
  const [isInferencing, setIsInferencing] = useState(false);

  // KPI Calculations from queue
  const totalAnalyzed = 186;
  const pendingReview = queueData.filter(q => q.reviewStatus === 'Pending').length;
  const criticalCount = queueData.filter(q => q.priority === 'CRITICAL').length;
  const accuracyScore = '94.8%';

  // 7-day trend config & dynamic data per mode
  const trendDays = ['Oct 21', 'Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27'];
  const xCoords = [65, 148, 231, 314, 397, 480, 565];

  const datasetsByMode = {
    volume: {
      yTitle: 'Number of Requests',
      unit: 'reqs',
      yAxisLabels: ['100', '80', '60', '40', '20', '0'],
      getY: (v) => 210 - (Math.max(0, Math.min(100, v)) / 100) * 190,
      series: {
        medical: [30, 55, 48, 72, 65, 88, 75],
        food: [22, 34, 30, 48, 42, 58, 68],
        shelter: [18, 24, 22, 36, 32, 46, 52],
        protection: [12, 16, 15, 22, 20, 30, 35],
        other: [8, 11, 10, 14, 13, 18, 22]
      }
    },
    accuracy: {
      yTitle: 'Precision Rate (%)',
      unit: '%',
      yAxisLabels: ['100%', '95%', '90%', '85%', '80%', '75%'],
      getY: (v) => 210 - ((Math.max(75, Math.min(100, v)) - 75) / 25) * 190,
      series: {
        medical: [94, 96, 95, 98, 97, 99, 98],
        food: [91, 93, 92, 95, 96, 95, 97],
        shelter: [88, 89, 91, 92, 94, 95, 94],
        protection: [85, 87, 89, 90, 92, 93, 95],
        other: [82, 84, 85, 87, 88, 90, 91]
      }
    },
    latency: {
      yTitle: 'Inference Latency (ms)',
      unit: 'ms',
      yAxisLabels: ['100ms', '80ms', '60ms', '40ms', '20ms', '0ms'],
      getY: (v) => 210 - (Math.max(0, Math.min(100, v)) / 100) * 190,
      series: {
        medical: [42, 36, 32, 28, 26, 24, 22],
        food: [30, 26, 24, 22, 21, 19, 18],
        shelter: [35, 31, 28, 26, 25, 23, 22],
        protection: [48, 44, 40, 36, 33, 30, 28],
        other: [24, 21, 18, 16, 15, 14, 13]
      }
    }
  };

  const seriesColors = {
    medical: '#2563eb',
    food: '#16a34a',
    shelter: '#ea580c',
    protection: '#9333ea',
    other: '#64748b'
  };

  const toggleSeries = (key) => {
    setHiddenSeries(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Open Service Modal
  const handleInspectService = (srv) => {
    setInspectingService(srv);
    setTestInferenceInput(srv.samplePrompt || '');
    setTestInferenceResult(null);
  };

  // Run Test Inference inside Modal
  const handleRunTestInference = () => {
    if (!testInferenceInput.trim()) return;
    setIsInferencing(true);

    setTimeout(() => {
      setIsInferencing(false);
      if (inspectingService.id === 'classification') {
        setTestInferenceResult({
          classification: testInferenceInput.toLowerCase().includes('water') ? 'Water & Sanitation' : 'Medical Assistance',
          priority: 'CRITICAL',
          confidence: '96.4%',
          urgency: 92,
          entities: ['Negombo (Location)', 'Oxygen Cylinder (Critical Asset)', 'Elderly (Vulnerable Group)']
        });
      } else if (inspectingService.id === 'priority') {
        setTestInferenceResult({
          priority: 'CRITICAL',
          urgencyScore: 94,
          confidence: '95.8%',
          keyFactors: ['Life-safety risk', 'Vulnerable demographics', 'Severe flood zone (Stage 3)']
        });
      } else {
        setTestInferenceResult({
          prediction: 'Optimal Match Dispatched',
          confidence: '94.2%',
          latency: '22ms',
          recommendedUnit: 'Regional Rapid Response Depot #4'
        });
      }
      showToast?.(`Live inference test completed on ${inspectingService.name}`, 'success');
    }, 600);
  };

  const currentModeConfig = datasetsByMode[activeMetricMode];

  return (
    <div className="ai-page-canvas">
      {/* Top Breadcrumb & Search Bar */}
      <div className="ai-top-breadcrumb-bar">
        <div className="ai-breadcrumb-path">
          <span className="crumb-root">AI Operations</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">Overview</span>
        </div>

        <div className="ai-top-header-controls">
          <div className="ai-header-search">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search requests, models, alerts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ai-search-input"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                <X size={12} />
              </button>
            )}
          </div>

          <div className="ai-header-actions">
            <div className="relative-popover-box">
              <button 
                className={`header-icon-pill ${showNotifications ? 'active' : ''}`}
                title="AI Event Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={16} />
                <span className="badge-count">3</span>
              </button>

              {showNotifications && (
                <div className="ai-floating-popover notifications-popover">
                  <div className="popover-head">
                    <span className="popover-title">AI System Notifications</span>
                    <button className="popover-close-btn" onClick={() => setShowNotifications(false)}>
                      <X size={13} />
                    </button>
                  </div>
                  <div className="popover-list">
                    <div className="popover-item" onClick={() => { setShowNotifications(false); onNavigateReview('REQ-2026-01842'); }}>
                      <span className="item-dot red"></span>
                      <div>
                        <strong>Critical Urgency Score (94)</strong>
                        <p>REQ-2026-01842 requires immediate oxygen delivery.</p>
                        <span className="time-sub">4 mins ago</span>
                      </div>
                    </div>
                    <div className="popover-item" onClick={() => { setShowNotifications(false); onNavigateQueue(); }}>
                      <span className="item-dot amber"></span>
                      <div>
                        <strong>Potential Duplicate Cluster</strong>
                        <p>5 requests flagged in Kochchikade flood zone.</p>
                        <span className="time-sub">22 mins ago</span>
                      </div>
                    </div>
                    <div className="popover-item">
                      <span className="item-dot green"></span>
                      <div>
                        <strong>Demand Model Retrained</strong>
                        <p>Weather radar data updated for Western Province.</p>
                        <span className="time-sub">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="header-icon-pill" 
              title="AI Documentation &amp; Help"
              onClick={() => setShowHelpModal(true)}
            >
              <HelpCircle size={16} />
            </button>

            <div className="user-avatar-badge" title="Active AI Operator: Sarah Johnson">
              <span>SJ</span>
              <ChevronDown size={12} className="chevron" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Title Header with Working Date Selector */}
      <div className="ai-page-title-row">
        <div>
          <div className="title-badge-row">
            <h1 className="ai-main-heading">AI Operations Overview</h1>
            <span className="neural-live-badge">
              <Sparkles size={12} />
              <span>LIVE TELEMETRY</span>
            </span>
          </div>
          <p className="ai-main-subheading">
            Autonomous humanitarian decision support with continuous human-in-the-loop oversight.
          </p>
        </div>

        <div className="relative-date-picker-wrap">
          <button 
            className="ai-date-picker-btn"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <Calendar size={14} />
            <span>{timeRange}</span>
            <ChevronDown size={14} className={showDatePicker ? 'rotate-180' : ''} />
          </button>

          {showDatePicker && (
            <div className="ai-date-picker-dropdown">
              <div className="dropdown-label">Select Aggregation Period</div>
              {TIME_RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`date-opt-btn ${timeRange === opt ? 'active' : ''}`}
                  onClick={() => {
                    setTimeRange(opt);
                    setShowDatePicker(false);
                    showToast?.(`Aggregating AI operations metrics for: ${opt}`, 'info');
                  }}
                >
                  <span>{opt}</span>
                  {timeRange === opt && <CheckCircle2 size={13} color="#0f766e" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4 Eye-Catching KPI Cards with Neural Glow & Sparklines */}
      <div className="ai-kpi-quad-grid">
        {/* Card 1: Requests Analyzed */}
        <div 
          className="ai-kpi-card glowing-blue" 
          onClick={onNavigateQueue} 
          title="Click to view all analyzed requests"
        >
          <div className="kpi-top-row">
            <div className="kpi-icon-box blue">
              <FileText size={20} color="#2563eb" />
            </div>
            <div className="kpi-trend-pill green">
              <span className="arrow">↑</span>
              <span className="pct">+12%</span>
            </div>
          </div>
          <div className="kpi-data-block">
            <div className="kpi-value-number">{totalAnalyzed}</div>
            <div className="kpi-title-label">Requests Analyzed</div>
            <div className="kpi-sparkline-wrap">
              <svg viewBox="0 0 100 24" className="kpi-sparkline-svg">
                <path 
                  d="M 0 20 Q 20 16 35 18 T 65 8 T 100 4" 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth="2.5" 
                />
              </svg>
              <span className="sparkline-subtext">vs. 166 prev. cycle</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Human Review */}
        <div 
          className="ai-kpi-card glowing-amber" 
          onClick={onNavigateQueue} 
          title="Click to open Decision Support Queue"
        >
          <div className="kpi-top-row">
            <div className="kpi-icon-box orange">
              <Users size={20} color="#ea580c" />
            </div>
            <div className="kpi-trend-pill red">
              <span className="arrow">↑</span>
              <span className="pct">+{pendingReview} new</span>
            </div>
          </div>
          <div className="kpi-data-block">
            <div className="kpi-value-number">{pendingReview}</div>
            <div className="kpi-title-label">Pending Human Review</div>
            <div className="kpi-sparkline-wrap">
              <svg viewBox="0 0 100 24" className="kpi-sparkline-svg">
                <path 
                  d="M 0 18 Q 25 15 50 12 T 75 16 T 100 6" 
                  fill="none" 
                  stroke="#ea580c" 
                  strokeWidth="2.5" 
                />
              </svg>
              <span className="sparkline-subtext text-amber">Requires Coordinator triage</span>
            </div>
          </div>
        </div>

        {/* Card 3: High Risk / Critical */}
        <div 
          className="ai-kpi-card glowing-red" 
          onClick={onNavigateQueue} 
          title="Click to filter queue for Critical cases"
        >
          <div className="kpi-top-row">
            <div className="kpi-icon-box red">
              <AlertTriangle size={20} color="#dc2626" />
            </div>
            <div className="kpi-trend-pill red">
              <span className="pulse-ping-dot"></span>
              <span className="pct">Priority 1</span>
            </div>
          </div>
          <div className="kpi-data-block">
            <div className="kpi-value-number">{criticalCount}</div>
            <div className="kpi-title-label">High Risk / Critical</div>
            <div className="kpi-sparkline-wrap">
              <svg viewBox="0 0 100 24" className="kpi-sparkline-svg">
                <path 
                  d="M 0 22 Q 30 18 60 14 T 85 8 T 100 3" 
                  fill="none" 
                  stroke="#dc2626" 
                  strokeWidth="2.5" 
                />
              </svg>
              <span className="sparkline-subtext text-red">Life-threat &amp; medical priority</span>
            </div>
          </div>
        </div>

        {/* Card 4: AI Recommendation Accuracy */}
        <div 
          className="ai-kpi-card glowing-green"
          onClick={() => onNavigateGovernance()}
          title="Click to view AI Governance &amp; Model Accuracy"
        >
          <div className="kpi-top-row">
            <div className="kpi-icon-box green">
              <Target size={20} color="#16a34a" />
            </div>
            <div className="kpi-trend-pill green">
              <span className="arrow">↑</span>
              <span className="pct">+4.2%</span>
            </div>
          </div>
          <div className="kpi-data-block">
            <div className="kpi-value-number">{accuracyScore}</div>
            <div className="kpi-title-label">AI Recommendation Accuracy</div>
            <div className="kpi-sparkline-wrap">
              <svg viewBox="0 0 100 24" className="kpi-sparkline-svg">
                <path 
                  d="M 0 16 Q 30 12 55 10 T 80 6 T 100 2" 
                  fill="none" 
                  stroke="#16a34a" 
                  strokeWidth="2.5" 
                />
              </svg>
              <span className="sparkline-subtext text-green">F1 Score: 0.941 | P99: 24ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Trend Line Chart & Priority Donut */}
      <div className="ai-charts-split-grid">
        {/* Request Classification Trend (Interactive SVG with Perfectly Aligned Spline Scrubber) */}
        <div className="ai-white-card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-section-title">Request Classification Trend (7 Days)</h2>
              <span className="card-subtitle-hint">Mathematically centered curves • Click legend or mode to toggle</span>
            </div>

            <div className="chart-mode-pill-group">
              <button 
                className={`mode-btn ${activeMetricMode === 'volume' ? 'active' : ''}`}
                onClick={() => {
                  setActiveMetricMode('volume');
                  showToast?.('Switched trend chart to Request Volume', 'info');
                }}
              >
                Volume
              </button>
              <button 
                className={`mode-btn ${activeMetricMode === 'accuracy' ? 'active' : ''}`}
                onClick={() => {
                  setActiveMetricMode('accuracy');
                  showToast?.('Switched trend chart to Model Accuracy (%)', 'info');
                }}
              >
                Accuracy
              </button>
              <button 
                className={`mode-btn ${activeMetricMode === 'latency' ? 'active' : ''}`}
                onClick={() => {
                  setActiveMetricMode('latency');
                  showToast?.('Switched trend chart to Inference Latency (ms)', 'info');
                }}
              >
                Latency
              </button>
            </div>
          </div>

          {/* Interactive Legend with click to hide/show */}
          <div className="chart-legend-row interactive-legend">
            {Object.keys(seriesColors).map((key) => {
              const isHidden = hiddenSeries.includes(key);
              return (
                <button
                  key={key}
                  className={`legend-item-btn ${isHidden ? 'hidden-series' : ''}`}
                  onClick={() => toggleSeries(key)}
                  title={`Toggle ${key} series`}
                >
                  <i style={{ backgroundColor: isHidden ? '#cbd5e1' : seriesColors[key] }}></i>
                  <span className="legend-label-text">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="svg-trend-container">
            <div className="y-axis-label-vertical">
              {currentModeConfig.yTitle}
            </div>

            <svg 
              viewBox="0 0 600 230" 
              className="trend-line-svg" 
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredPointIndex(null)}
            >
              <defs>
                <linearGradient id="gradient-medical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradient-food" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradient-shelter" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradient-protection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradient-other" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748b" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#64748b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              <line x1="45" y1="20" x2="585" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="58" x2="585" y2="58" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="96" x2="585" y2="96" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="134" x2="585" y2="134" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="172" x2="585" y2="172" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="210" x2="585" y2="210" stroke="#e2e8f0" strokeWidth="1" />

              {/* Dynamic Y Axis Numbers from current mode */}
              <text x="35" y="24" className="chart-axis-text" textAnchor="end">{currentModeConfig.yAxisLabels[0]}</text>
              <text x="35" y="62" className="chart-axis-text" textAnchor="end">{currentModeConfig.yAxisLabels[1]}</text>
              <text x="35" y="100" className="chart-axis-text" textAnchor="end">{currentModeConfig.yAxisLabels[2]}</text>
              <text x="35" y="138" className="chart-axis-text" textAnchor="end">{currentModeConfig.yAxisLabels[3]}</text>
              <text x="35" y="176" className="chart-axis-text" textAnchor="end">{currentModeConfig.yAxisLabels[4]}</text>
              <text x="35" y="213" className="chart-axis-text" textAnchor="end">{currentModeConfig.yAxisLabels[5]}</text>

              {/* Dynamic Mathematically Aligned Curves & Points */}
              {Object.keys(seriesColors).map((seriesKey) => {
                if (hiddenSeries.includes(seriesKey)) return null;
                const rawValues = currentModeConfig.series[seriesKey];
                const points = rawValues.map((val, idx) => ({
                  x: xCoords[idx],
                  y: currentModeConfig.getY(val),
                  val
                }));

                const pathD = createSmoothSplinePath(points, 0.2);
                const areaD = createSmoothAreaPath(points, 210, 0.2);
                const color = seriesColors[seriesKey];

                return (
                  <g key={seriesKey} className={`series-group-${seriesKey}`}>
                    {/* Area fill under curve */}
                    <path 
                      d={areaD} 
                      fill={`url(#gradient-${seriesKey})`} 
                      opacity="0.45" 
                    />
                    {/* Curve line */}
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke={color} 
                      strokeWidth="2.8" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Circle dots centered PRECISELY on the line */}
                    {points.map((pt, idx) => {
                      const isHovered = hoveredPointIndex === idx;
                      return (
                        <circle 
                          key={idx} 
                          cx={pt.x} 
                          cy={pt.y} 
                          r={isHovered ? 6 : 3.8} 
                          fill={color} 
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 2.5 : 1.2}
                          style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                          onMouseEnter={() => setHoveredPointIndex(idx)}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Vertical Scrubber Cursor Line when hovered */}
              {hoveredPointIndex !== null && (
                <line 
                  x1={xCoords[hoveredPointIndex]}
                  y1="20"
                  x2={xCoords[hoveredPointIndex]}
                  y2="210"
                  stroke="#0f766e"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}
            </svg>

            {/* X Axis Labels */}
            <div className="x-axis-labels-row">
              {trendDays.map((day, idx) => (
                <span 
                  key={day} 
                  className={hoveredPointIndex === idx ? 'label-active' : ''}
                  onMouseEnter={() => setHoveredPointIndex(idx)}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Floating Scrubber HUD Tooltip with Real Synced Values */}
            {hoveredPointIndex !== null && (
              <div 
                className="chart-scrubber-hud"
                style={{
                  left: `${(hoveredPointIndex / 6) * 75 + 12}%`
                }}
              >
                <div className="hud-date-title">{trendDays[hoveredPointIndex]} Telemetry</div>
                <div className="hud-metrics-list">
                  {!hiddenSeries.includes('medical') && (
                    <span className="hud-row text-blue">
                      Medical: <strong>{currentModeConfig.series.medical[hoveredPointIndex]}</strong> {currentModeConfig.unit}
                    </span>
                  )}
                  {!hiddenSeries.includes('food') && (
                    <span className="hud-row text-green">
                      Food: <strong>{currentModeConfig.series.food[hoveredPointIndex]}</strong> {currentModeConfig.unit}
                    </span>
                  )}
                  {!hiddenSeries.includes('shelter') && (
                    <span className="hud-row text-orange">
                      Shelter: <strong>{currentModeConfig.series.shelter[hoveredPointIndex]}</strong> {currentModeConfig.unit}
                    </span>
                  )}
                  {!hiddenSeries.includes('protection') && (
                    <span className="hud-row" style={{ color: '#c084fc' }}>
                      Protection: <strong>{currentModeConfig.series.protection[hoveredPointIndex]}</strong> {currentModeConfig.unit}
                    </span>
                  )}
                  {!hiddenSeries.includes('other') && (
                    <span className="hud-row" style={{ color: '#94a3b8' }}>
                      Other: <strong>{currentModeConfig.series.other[hoveredPointIndex]}</strong> {currentModeConfig.unit}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Priority Distribution Donut (Interactive Slices) */}
        <div className="ai-white-card">
          <div className="card-header-flex">
            <h2 className="card-section-title">Priority Distribution</h2>
            <span className="badge-pill-light">Multi-Factor Triage</span>
          </div>
          
          <div className="donut-and-legend-flex">
            <div className="donut-relative-container">
              <svg width="170" height="170" viewBox="0 0 100 100" className="donut-svg">
                {/* Critical (9.7%) Red */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth={hoveredDonutSegment === 'Critical' ? 17 : 14}
                  strokeDasharray="23.1 215.7"
                  strokeDashoffset="59.7"
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
                  onMouseEnter={() => setHoveredDonutSegment('Critical')}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                  onClick={onNavigateQueue}
                />
                {/* High (28.0%) Orange */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f97316"
                  strokeWidth={hoveredDonutSegment === 'High' ? 17 : 14}
                  strokeDasharray="66.8 172.0"
                  strokeDashoffset="36.6"
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
                  onMouseEnter={() => setHoveredDonutSegment('High')}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                  onClick={onNavigateQueue}
                />
                {/* Medium (38.7%) Yellow */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#eab308"
                  strokeWidth={hoveredDonutSegment === 'Medium' ? 17 : 14}
                  strokeDasharray="92.4 146.4"
                  strokeDashoffset="-30.2"
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
                  onMouseEnter={() => setHoveredDonutSegment('Medium')}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                  onClick={onNavigateQueue}
                />
                {/* Low (23.7%) Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth={hoveredDonutSegment === 'Low' ? 17 : 14}
                  strokeDasharray="56.6 182.2"
                  strokeDashoffset="-122.6"
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
                  onMouseEnter={() => setHoveredDonutSegment('Low')}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                  onClick={onNavigateQueue}
                />
              </svg>
              <div className="donut-center-metric">
                <span className="donut-total-label">
                  {hoveredDonutSegment ? hoveredDonutSegment : 'Total'}
                </span>
                <span className="donut-total-val">
                  {hoveredDonutSegment === 'Critical' ? '18' : 
                   hoveredDonutSegment === 'High' ? '52' :
                   hoveredDonutSegment === 'Medium' ? '72' :
                   hoveredDonutSegment === 'Low' ? '44' : '186'}
                </span>
              </div>
            </div>

            <div className="donut-legend-col">
              <div 
                className={`donut-legend-row ${hoveredDonutSegment === 'Critical' ? 'active-slice' : ''}`}
                onMouseEnter={() => setHoveredDonutSegment('Critical')}
                onMouseLeave={() => setHoveredDonutSegment(null)}
                onClick={onNavigateQueue}
                style={{ cursor: 'pointer' }}
              >
                <span className="dot" style={{ backgroundColor: '#ef4444' }}></span>
                <span className="cat-name">Critical (P1)</span>
                <span className="cat-stat">18 (9.7%)</span>
              </div>
              <div 
                className={`donut-legend-row ${hoveredDonutSegment === 'High' ? 'active-slice' : ''}`}
                onMouseEnter={() => setHoveredDonutSegment('High')}
                onMouseLeave={() => setHoveredDonutSegment(null)}
                onClick={onNavigateQueue}
                style={{ cursor: 'pointer' }}
              >
                <span className="dot" style={{ backgroundColor: '#f97316' }}></span>
                <span className="cat-name">High (P2)</span>
                <span className="cat-stat">52 (28.0%)</span>
              </div>
              <div 
                className={`donut-legend-row ${hoveredDonutSegment === 'Medium' ? 'active-slice' : ''}`}
                onMouseEnter={() => setHoveredDonutSegment('Medium')}
                onMouseLeave={() => setHoveredDonutSegment(null)}
                onClick={onNavigateQueue}
                style={{ cursor: 'pointer' }}
              >
                <span className="dot" style={{ backgroundColor: '#eab308' }}></span>
                <span className="cat-name">Medium (P3)</span>
                <span className="cat-stat">72 (38.7%)</span>
              </div>
              <div 
                className={`donut-legend-row ${hoveredDonutSegment === 'Low' ? 'active-slice' : ''}`}
                onMouseEnter={() => setHoveredDonutSegment('Low')}
                onMouseLeave={() => setHoveredDonutSegment(null)}
                onClick={onNavigateQueue}
                style={{ cursor: 'pointer' }}
              >
                <span className="dot" style={{ backgroundColor: '#10b981' }}></span>
                <span className="cat-name">Low (P4)</span>
                <span className="cat-stat">44 (23.7%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: AI Service Status & Recent AI Insights */}
      <div className="ai-charts-split-grid bottom-grid">
        {/* AI Service Status (All 10 Interactive Microservices) */}
        <div className="ai-white-card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-section-title">AI Microservice Status</h2>
              <span className="card-subtitle-hint">Click any service to inspect latency &amp; run test inference</span>
            </div>
            <button 
              className="view-all-link-btn"
              onClick={() => onNavigateWorkspaces('classification')}
            >
              <span>Workspaces</span>
              <span className="arrow-sym">&rarr;</span>
            </button>
          </div>

          <div className="service-status-two-col">
            <div className="service-status-column">
              {AI_SERVICES_CATALOG.slice(0, 5).map((srv) => (
                <div 
                  key={srv.id} 
                  className="service-status-line interactive-service-row"
                  onClick={() => handleInspectService(srv)}
                  title={`Inspect ${srv.name}`}
                >
                  <div className="serv-left">
                    <span className="srv-icon-badge" style={{ backgroundColor: `${srv.color}15`, color: srv.color }}>
                      <Cpu size={14} />
                    </span>
                    <span className="srv-title-text">{srv.name}</span>
                  </div>
                  <div className="serv-right-telemetry">
                    <span className="srv-latency-tag">{srv.latencyMs}ms</span>
                    <span className="status-online-pill">
                      <i className="green-bullet"></i> Online
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="service-status-column">
              {AI_SERVICES_CATALOG.slice(5, 10).map((srv) => (
                <div 
                  key={srv.id} 
                  className="service-status-line interactive-service-row"
                  onClick={() => handleInspectService(srv)}
                  title={`Inspect ${srv.name}`}
                >
                  <div className="serv-left">
                    <span className="srv-icon-badge" style={{ backgroundColor: `${srv.color}15`, color: srv.color }}>
                      <Cpu size={14} />
                    </span>
                    <span className="srv-title-text">{srv.name}</span>
                  </div>
                  <div className="serv-right-telemetry">
                    <span className="srv-latency-tag">{srv.latencyMs}ms</span>
                    <span className="status-online-pill">
                      <i className="green-bullet"></i> Online
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent AI Insights (Interactive Actionable Cards) */}
        <div className="ai-white-card">
          <div className="card-header-flex">
            <h2 className="card-section-title">Recent AI Insights</h2>
            <button className="view-all-link-btn" onClick={onNavigateQueue}>
              <span>View All</span>
              <span className="arrow-sym">&rarr;</span>
            </button>
          </div>

          <div className="insights-vertical-stack">
            <div 
              className="insight-entry-item interactive"
              onClick={() => onNavigateReview('REQ-2026-01842')}
              title="Click to review Medical Assistance request REQ-2026-01842"
            >
              <div className="insight-icon-square blue">
                <BarChart2 size={16} color="#2563eb" />
              </div>
              <div className="insight-info-wrap">
                <div className="insight-headline">Increase in medical requests</div>
                <div className="insight-desc">32% higher than last week in Colombo 07</div>
              </div>
              <div className="insight-action-tag">
                <span>Review Case</span>
                <ArrowRight size={12} />
              </div>
            </div>

            <div 
              className="insight-entry-item interactive"
              onClick={() => {
                showToast?.('Opening Northern District supply reallocation planner...', 'info');
                onNavigateWorkspaces('resource');
              }}
              title="Click to view Resource Matching workspace"
            >
              <div className="insight-icon-square orange">
                <AlertTriangle size={16} color="#d97706" />
              </div>
              <div className="insight-info-wrap">
                <div className="insight-headline">Potential resource shortage</div>
                <div className="insight-desc">In Gampaha &amp; Ja-Ela logistics depot</div>
              </div>
              <div className="insight-action-tag">
                <span>Dispatch</span>
                <ArrowRight size={12} />
              </div>
            </div>

            <div 
              className="insight-entry-item interactive"
              onClick={() => {
                showToast?.('Opening Duplicate Detection cluster inspection...', 'info');
                onNavigateWorkspaces('duplicate');
              }}
              title="Click to inspect Duplicate Detection model"
            >
              <div className="insight-icon-square purple">
                <Users size={16} color="#7c3aed" />
              </div>
              <div className="insight-info-wrap">
                <div className="insight-headline">High duplication risk detected</div>
                <div className="insight-desc">5 similar requests in Negombo Kochchikade</div>
              </div>
              <div className="insight-action-tag">
                <span>Deduplicate</span>
                <ArrowRight size={12} />
              </div>
            </div>

            <div 
              className="insight-entry-item interactive"
              onClick={() => {
                showToast?.('Initiating predictive weather alert & flood map sync...', 'info');
                onNavigateWorkspaces('demand');
              }}
              title="Click to inspect Demand Forecasting model"
            >
              <div className="insight-icon-square green">
                <ArrowUp size={16} color="#16a34a" />
              </div>
              <div className="insight-info-wrap">
                <div className="insight-headline">Heavy rainfall expected (Kelani River basin)</div>
                <div className="insight-desc">Food supplies &amp; rescue dinghies likely needed</div>
              </div>
              <div className="insight-action-tag">
                <span>Forecast</span>
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: AI Microservice Live Telemetry & Inference Playground */}
      {inspectingService && (
        <div className="ai-modal-backdrop" onClick={() => setInspectingService(null)}>
          <div className="ai-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div className="modal-title-group">
                <div className="srv-modal-icon-badge" style={{ backgroundColor: `${inspectingService.color}18`, color: inspectingService.color }}>
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 className="ai-modal-title">{inspectingService.name}</h3>
                  <span className="ai-modal-subtitle">{inspectingService.category} • Model: <code>{inspectingService.model}</code></span>
                </div>
              </div>
              <button className="modal-close-icon" onClick={() => setInspectingService(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="ai-modal-body">
              {/* Telemetry Quad Stats */}
              <div className="modal-telemetry-grid">
                <div className="telemetry-box">
                  <span className="tel-label">Latency (P99)</span>
                  <span className="tel-val text-teal">{inspectingService.latencyMs} ms</span>
                </div>
                <div className="telemetry-box">
                  <span className="tel-label">Throughput</span>
                  <span className="tel-val">{inspectingService.qps} QPS</span>
                </div>
                <div className="telemetry-box">
                  <span className="tel-label">Historical Accuracy</span>
                  <span className="tel-val text-green">{inspectingService.accuracy}</span>
                </div>
                <div className="telemetry-box">
                  <span className="tel-label">Uptime</span>
                  <span className="tel-val">{inspectingService.uptime}</span>
                </div>
              </div>

              <div className="modal-desc-text">
                {inspectingService.description}
              </div>

              {/* Interactive Test Playground */}
              <div className="modal-playground-box">
                <div className="playground-head">
                  <span className="playground-title">Live Test Inference Playground</span>
                  <span className="playground-tag">Real-time Model Execution</span>
                </div>

                <div className="playground-input-row">
                  <textarea 
                    className="playground-textarea"
                    rows={2}
                    value={testInferenceInput}
                    onChange={(e) => setTestInferenceInput(e.target.value)}
                    placeholder="Enter raw emergency text, call transcript, or coordinates..."
                  />
                </div>

                <div className="playground-action-row">
                  <button 
                    className="btn-solid-teal"
                    onClick={handleRunTestInference}
                    disabled={isInferencing}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>{isInferencing ? 'Running Neural Inference...' : 'Evaluate with Model'}</span>
                  </button>
                </div>

                {/* Inference Result Output */}
                {testInferenceResult && (
                  <div className="playground-result-card">
                    <div className="result-header">
                      <Sparkles size={14} color="#0f766e" />
                      <span>Model Inference Output</span>
                      <span className="confidence-pill">Confidence: {testInferenceResult.confidence}</span>
                    </div>
                    <div className="result-body">
                      {testInferenceResult.classification && (
                        <div className="result-line">
                          <strong>Predicted Sector:</strong> <span>{testInferenceResult.classification}</span>
                        </div>
                      )}
                      {testInferenceResult.priority && (
                        <div className="result-line">
                          <strong>Triage Priority:</strong> <span className="badge-priority critical">{testInferenceResult.priority}</span>
                        </div>
                      )}
                      {testInferenceResult.entities && (
                        <div className="result-line">
                          <strong>Extracted Entities:</strong> 
                          <span className="entity-pills-row">
                            {testInferenceResult.entities.map((ent, i) => (
                              <span key={i} className="entity-chip">{ent}</span>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="ai-modal-footer">
              <button 
                className="btn-outline-white" 
                onClick={() => {
                  setInspectingService(null);
                  onNavigateWorkspaces(inspectingService.id);
                }}
              >
                <span>Open in Workspaces</span>
                <ExternalLink size={13} />
              </button>
              <button className="btn-solid-teal" onClick={() => setInspectingService(null)}>
                <span>Close Inspector</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AI Quick Reference & Documentation */}
      {showHelpModal && (
        <div className="ai-modal-backdrop" onClick={() => setShowHelpModal(false)}>
          <div className="ai-modal-dialog help-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div className="modal-title-group">
                <HelpCircle size={22} color="#0f766e" />
                <div>
                  <h3 className="ai-modal-title">ReliefCore AI Operations Guide</h3>
                  <span className="ai-modal-subtitle">System architecture and human-in-the-loop policies</span>
                </div>
              </div>
              <button className="modal-close-icon" onClick={() => setShowHelpModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="ai-modal-body">
              <div className="help-section">
                <h4>Human-in-the-Loop Safeguards</h4>
                <p>All AI recommendations with confidence below <strong>85%</strong> or flagged as <strong>CRITICAL</strong> automatically route to the Decision Support Queue for mandatory human review before dispatch actions occur.</p>
              </div>
              <div className="help-section">
                <h4>Supported AI Capabilities</h4>
                <ul className="help-bullets">
                  <li><strong>Natural Language Triage:</strong> Converts multilingual SMS and voice calls to structured crisis categories.</li>
                  <li><strong>Geospatial Deduplication:</strong> Flags overlapping requests within 500m to conserve relief supplies.</li>
                  <li><strong>Cryptographic Trace Audit:</strong> All AI inference passes and coordinator overrides are recorded in the SHA-256 audit ledger.</li>
                </ul>
              </div>
            </div>
            <div className="ai-modal-footer">
              <button className="btn-solid-teal" onClick={() => setShowHelpModal(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
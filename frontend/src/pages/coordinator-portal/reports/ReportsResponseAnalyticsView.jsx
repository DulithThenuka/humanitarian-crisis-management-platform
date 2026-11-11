import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  BarChart2,
  Package,
  Download,
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import { REPORTS_ANALYTICS_DATA } from '../data/coordinatorPortalData';
import './ReportsResponseAnalyticsView.css';

export const ReportsResponseAnalyticsView = ({ showToast }) => {
  const [period, setPeriod] = useState('30d');
  const [hoveredBar, setHoveredBar] = useState(null);

  const { metrics, requestsOverTime, priorityDistribution, requestsByCategory, operationalProgress } = REPORTS_ANALYTICS_DATA;

  // SVG Donut calculation
  // Radii: center (80, 80), r = 60, circumference = 2 * PI * 60 = 376.99
  const circumference = 2 * Math.PI * 60;
  let accumulatedOffset = 0;
  const donutSlices = priorityDistribution.slices.map(slice => {
    const strokeDasharray = `${(slice.pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += (slice.pct / 100) * circumference;
    return { ...slice, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="ec-portal-canvas">
      {/* 1. Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">MEASURED PROTOTYPE VALUES AND LABELED ESTIMATES</span>
          <h2 className="ec-review-main-title">Reports &amp; Response Analytics</h2>
          <p className="ec-review-sub-meta">
            Coordinator-focused request, response, resource, shelter and volunteer performance.
          </p>
        </div>
        <div className="ec-reports-header-actions">
          <select
            className="ec-filter-dropdown-btn"
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              showToast(`Analytics filtered for: ${e.target.options[e.target.selectedIndex].text}`, 'info');
            }}
          >
            <option value="30d">Last 30 days</option>
            <option value="14d">Last 14 days</option>
            <option value="7d">Last 7 days</option>
            <option value="24h">Past 24 hours</option>
          </select>

          <button
            className="ec-btn-action-primary"
            onClick={() => showToast('Generating comprehensive PDF & CSV Operational Performance Report...', 'info')}
          >
            <Download size={14} />
            <span>Export report</span>
          </button>
        </div>
      </div>

      {/* 2. Top 5 KPI Metrics Cards */}
      <div className="ec-analytics-kpi-grid">
        {/* Incoming Requests */}
        <div className="ec-akpi-card">
          <div className="ec-akpi-head">
            <span className="ec-akpi-title">Incoming requests</span>
            <div className="ec-akpi-icon-wrap" style={{ background: '#eff6ff', color: '#0284c7' }}>
              <FileText size={16} />
            </div>
          </div>
          <div className="ec-akpi-val-row">
            <span className="ec-akpi-main-val">{metrics.incomingRequests.value}</span>
            <span className="ec-akpi-trend-pill positive">
              <TrendingUp size={11} />
              <span>{metrics.incomingRequests.trend}</span>
            </span>
          </div>
        </div>

        {/* Average initial review */}
        <div className="ec-akpi-card">
          <div className="ec-akpi-head">
            <span className="ec-akpi-title">Average initial review</span>
            <div className="ec-akpi-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="ec-akpi-val-row">
            <span className="ec-akpi-main-val">{metrics.avgInitialReview.value}</span>
            <span className="ec-akpi-sub-target">{metrics.avgInitialReview.target}</span>
          </div>
        </div>

        {/* Average resolution time */}
        <div className="ec-akpi-card">
          <div className="ec-akpi-head">
            <span className="ec-akpi-title">Average resolution time</span>
            <div className="ec-akpi-icon-wrap" style={{ background: '#f0fdf4', color: '#10b981' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="ec-akpi-val-row">
            <span className="ec-akpi-main-val">{metrics.avgResolutionTime.value}</span>
            <span className="ec-akpi-sub-target">{metrics.avgResolutionTime.trend}</span>
          </div>
        </div>

        {/* Open vs resolved */}
        <div className="ec-akpi-card">
          <div className="ec-akpi-head">
            <span className="ec-akpi-title">Open vs resolved</span>
            <div className="ec-akpi-icon-wrap" style={{ background: '#f8fafc', color: '#64748b' }}>
              <BarChart2 size={16} />
            </div>
          </div>
          <div className="ec-akpi-val-row">
            <span className="ec-akpi-main-val">{metrics.openVsResolved.value}</span>
            <span className="ec-akpi-sub-target">{metrics.openVsResolved.sub}</span>
          </div>
        </div>

        {/* Resource fulfillment */}
        <div className="ec-akpi-card">
          <div className="ec-akpi-head">
            <span className="ec-akpi-title">Resource fulfillment</span>
            <div className="ec-akpi-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
              <Package size={16} />
            </div>
          </div>
          <div className="ec-akpi-val-row">
            <span className="ec-akpi-main-val">{metrics.resourceFulfillment.value}</span>
            <span className="ec-akpi-sub-target">{metrics.resourceFulfillment.sub}</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Grid: Incoming Requests Over Time (Bar Chart) & Priority Distribution (Donut Chart) */}
      <div className="ec-analytics-charts-grid">
        {/* Left: Bar Chart */}
        <div className="ec-chart-card">
          <div className="ec-chart-card-header">
            <div>
              <h3 className="ec-chart-title">Incoming requests over time</h3>
              <p className="ec-chart-sub">Measured request count · sample records</p>
            </div>
            <span className="ec-chart-badge-pill">● Last 30 days</span>
          </div>

          <div className="ec-barchart-container">
            {/* Y Axis Guides */}
            <div className="ec-barchart-y-axis">
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>

            {/* Bars Area */}
            <div className="ec-barchart-bars-area">
              {requestsOverTime.map((item, idx) => {
                const heightPct = Math.round((item.count / 60) * 100);
                const isHovered = hoveredBar === idx;

                return (
                  <div
                    key={idx}
                    className="ec-bar-col"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {isHovered && (
                      <div className="ec-bar-tooltip">
                        <strong>{item.count}</strong> requests
                      </div>
                    )}
                    <div className="ec-bar-track-vertical">
                      <div
                        className={`ec-bar-fill-vertical ${item.isPeak ? 'bar-peak' : ''}`}
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    <span className="ec-bar-x-lbl">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Donut Chart Priority Distribution */}
        <div className="ec-chart-card">
          <div className="ec-chart-card-header">
            <div>
              <h3 className="ec-chart-title">Priority distribution</h3>
              <p className="ec-chart-sub">Severity assessment breakdown</p>
            </div>
          </div>

          <div className="ec-donut-layout">
            {/* SVG Donut */}
            <div className="ec-donut-svg-wrap">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="20"
                />
                {donutSlices.map((slice, i) => (
                  <circle
                    key={i}
                    cx="80"
                    cy="80"
                    r="60"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="20"
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="butt"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '80px 80px',
                      transition: 'all 0.5s ease'
                    }}
                  />
                ))}
              </svg>
              <div className="ec-donut-center-info">
                <span className="ec-donut-center-num">{priorityDistribution.total}</span>
                <span className="ec-donut-center-lbl">requests</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="ec-donut-legend-list">
              {priorityDistribution.slices.map((slice) => (
                <div key={slice.name} className="ec-donut-legend-item">
                  <div className="ec-donut-legend-left">
                    <span className="ec-rc-dot" style={{ backgroundColor: slice.color }}></span>
                    <span className="ec-donut-slice-name">{slice.name}</span>
                  </div>
                  <span className="ec-donut-slice-pct">{slice.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Requests by Category & Operational Progress */}
      <div className="ec-analytics-bottom-grid">
        {/* Left: Requests by Category */}
        <div className="ec-chart-card">
          <div className="ec-chart-card-header">
            <h3 className="ec-chart-title">Requests by category</h3>
          </div>

          <div className="ec-category-progress-list">
            {requestsByCategory.map((cat) => (
              <div key={cat.category} className="ec-cat-prog-row">
                <div className="ec-cat-prog-head">
                  <span className="ec-cat-prog-name">{cat.category}</span>
                  <span className="ec-cat-prog-pct">{cat.pct}%</span>
                </div>
                <div className="ec-cat-prog-track">
                  <div
                    className="ec-cat-prog-fill"
                    style={{ width: `${cat.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Operational Progress */}
        <div className="ec-chart-card">
          <div className="ec-chart-card-header">
            <h3 className="ec-chart-title">Operational progress</h3>
          </div>

          <div className="ec-op-progress-list">
            {operationalProgress.map((item, idx) => (
              <div key={idx} className="ec-op-progress-row">
                <span className="ec-op-prog-lbl">{item.label}</span>
                <div className="ec-op-prog-right">
                  <span className="ec-op-prog-val">{item.value}</span>
                  <span className={`ec-op-pill ${item.typeClass}`}>
                    <span className="ec-rc-status-dot"></span>
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

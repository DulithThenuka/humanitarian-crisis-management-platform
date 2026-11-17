import React, { useState, useEffect, useCallback } from 'react';
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
  Info,
  RefreshCw,
  AlertCircle,
  Home,
  Users,
  Layers,
  Activity
} from 'lucide-react';
import coordinatorService from '../../../services/coordinatorService';
import './ReportsResponseAnalyticsView.css';

export const ReportsResponseAnalyticsView = ({ showToast }) => {
  const [period, setPeriod] = useState('30d');
  const [customStartDate, setCustomStartDate] = useState(
    new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
  );
  const [customEndDate, setCustomEndDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAnalytics = useCallback(async (selectedPeriod = period, start = null, end = null, isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else if (!data) {
      setLoading(true);
    }
    setError(null);

    try {
      const params = { period: selectedPeriod };
      if (selectedPeriod === 'custom' && start && end) {
        params.startDate = new Date(start).toISOString();
        params.endDate = new Date(end + 'T23:59:59.999Z').toISOString();
      }

      const res = await coordinatorService.getAnalytics(params);
      if (res) {
        setData(res);
        setLastUpdated(new Date());
        if (isManualRefresh && showToast) {
          showToast('Analytics data refreshed from database.', 'success');
        }
      } else {
        throw new Error('No analytics data received from database.');
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Error loading live analytics data.';
      setError(errMsg);
      if (showToast) {
        showToast(errMsg, 'error');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period, data, showToast]);

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const handlePeriodChange = (e) => {
    const val = e.target.value;
    setPeriod(val);
    if (val !== 'custom') {
      fetchAnalytics(val);
      if (showToast) {
        showToast(`Analytics filtered for: ${e.target.options[e.target.selectedIndex].text}`, 'info');
      }
    }
  };

  const handleCustomApply = () => {
    if (!customStartDate || !customEndDate) {
      if (showToast) showToast('Please select both start and end dates.', 'warning');
      return;
    }
    if (new Date(customStartDate) > new Date(customEndDate)) {
      if (showToast) showToast('Start date cannot be after end date.', 'warning');
      return;
    }
    fetchAnalytics('custom', customStartDate, customEndDate);
    if (showToast) {
      showToast(`Custom range applied: ${customStartDate} to ${customEndDate}`, 'info');
    }
  };

  // Export report to CSV
  const handleExportReport = () => {
    if (!data) {
      if (showToast) showToast('No analytics data available to export.', 'warning');
      return;
    }

    try {
      const rows = [];
      rows.push(['HumanAid ReliefCore - Operational Performance & Response Analytics Report']);
      rows.push([`Generated At`, new Date().toISOString()]);
      rows.push([`Filtered Period`, data.period || period]);
      rows.push([`Date Range`, `${data.startDate || 'N/A'} to ${data.endDate || 'N/A'}`]);
      rows.push([]);

      // Section 1: KPI Metrics
      rows.push(['--- KEY PERFORMANCE INDICATORS ---']);
      rows.push(['Metric', 'Value', 'Trend / Subtext', 'Target']);
      rows.push([
        'Incoming Assistance Requests',
        data.metrics?.incomingRequestsCount ?? 0,
        data.metrics?.incomingRequestsTrend || '',
        'N/A'
      ]);
      rows.push([
        'Average Initial Review Time',
        data.metrics?.avgInitialReviewTime || 'N/A',
        data.metrics?.avgInitialReviewMinutes ? `${Math.round(data.metrics.avgInitialReviewMinutes)} mins` : 'N/A',
        data.metrics?.avgInitialReviewTarget || 'Target: < 30m'
      ]);
      rows.push([
        'Average Resolution Time',
        data.metrics?.avgResolutionTime || 'N/A',
        data.metrics?.avgResolutionTrend || '',
        'N/A'
      ]);
      rows.push([
        'Open vs Resolved Requests',
        data.metrics?.openVsResolvedRatio || '0 / 0',
        `Resolution Rate: ${data.metrics?.resolutionRatePct ?? 0}%`,
        'N/A'
      ]);
      rows.push([
        'Resource Delivery Fulfillment',
        data.metrics?.resourceFulfillmentRatio || '0%',
        `${data.metrics?.deliveredQuantity ?? 0} / ${data.metrics?.totalAllocatedQuantity ?? 0} units delivered`,
        '100%'
      ]);
      rows.push([]);

      // Section 2: Priority Distribution
      rows.push(['--- PRIORITY DISTRIBUTION ---']);
      rows.push(['Priority Level', 'Count', 'Percentage']);
      if (data.priorityDistribution?.slices?.length) {
        data.priorityDistribution.slices.forEach(s => {
          rows.push([s.name, s.count, `${s.pct}%`]);
        });
      }
      rows.push(['Total Requests', data.priorityDistribution?.total ?? 0, '100%']);
      rows.push([]);

      // Section 3: Requests by Category
      rows.push(['--- REQUESTS BY CATEGORY ---']);
      rows.push(['Category', 'Count', 'Percentage']);
      if (data.requestsByCategory?.length) {
        data.requestsByCategory.forEach(c => {
          rows.push([c.category, c.count, `${c.pct}%`]);
        });
      }
      rows.push([]);

      // Section 4: Operational Progress
      rows.push(['--- OPERATIONAL PROGRESS ---']);
      rows.push(['Operational Objective', 'Performance Value', 'Status']);
      if (data.operationalProgress?.length) {
        data.operationalProgress.forEach(o => {
          rows.push([o.label, o.value, o.type]);
        });
      }
      rows.push([]);

      // Section 5: Logistics & Coordination Summary
      rows.push(['--- LOGISTICS & COORDINATION METRICS ---']);
      rows.push(['Coordination Module', 'Key Metric', 'Value']);
      rows.push(['Resource Coordination', 'Total Allocations', data.resourceCoordination?.totalAllocations ?? 0]);
      rows.push(['Resource Coordination', 'Delivered Quantity', `${data.resourceCoordination?.deliveredQuantity ?? 0} / ${data.resourceCoordination?.totalQuantity ?? 0}`]);
      rows.push(['Resource Coordination', 'Dispatched / In-Transit', data.resourceCoordination?.dispatchedCount ?? 0]);
      rows.push(['Resource Coordination', 'Pending Manager Review', data.resourceCoordination?.pendingCount ?? 0]);
      rows.push(['Shelter Coordination', 'Placement Requests', data.shelterCoordination?.totalPlacementRequests ?? 0]);
      rows.push(['Shelter Coordination', 'Approved Placements', data.shelterCoordination?.approvedCount ?? 0]);
      rows.push(['Shelter Coordination', 'Evacuees Placed/Requested', `${data.shelterCoordination?.totalEvacueesRequested ?? 0} persons`]);
      rows.push(['Shelter Coordination', 'Total Available Capacity', `${data.shelterCoordination?.totalCapacityAvailable ?? 0} beds`]);
      rows.push(['Volunteer Coordination', 'Assignment Requests', data.volunteerCoordination?.totalAssignmentRequests ?? 0]);
      rows.push(['Volunteer Coordination', 'Volunteers Requested', data.volunteerCoordination?.volunteersRequested ?? 0]);
      rows.push(['Volunteer Coordination', 'Active Volunteer Pool', `${data.volunteerCoordination?.availableVolunteersCount ?? 0} volunteers`]);

      const csvContent = rows
        .map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `ReliefCore_Operational_Analytics_${period}_${new Date().toISOString().slice(0, 10)}.csv`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (showToast) {
        showToast(`Report downloaded: ${filename}`, 'success');
      }
    } catch (exportErr) {
      console.error('Export error:', exportErr);
      if (showToast) showToast('Failed to export report CSV.', 'error');
    }
  };

  // Safe defaults if data is still loading
  const metrics = data?.metrics || {
    incomingRequestsCount: 0,
    incomingRequestsTrend: 'Loading...',
    avgInitialReviewTime: 'N/A',
    avgInitialReviewTarget: 'Target: < 30m',
    avgResolutionTime: 'N/A',
    avgResolutionTrend: '0 resolved',
    openVsResolvedRatio: '0 / 0',
    resolutionRatePct: 0,
    resourceFulfillmentRatio: '0%',
    deliveredQuantity: 0,
    totalAllocatedQuantity: 0
  };

  const requestsOverTime = data?.requestsOverTime || [];
  const priorityDistribution = data?.priorityDistribution || { total: 0, slices: [] };
  const requestsByCategory = data?.requestsByCategory || [];
  const operationalProgress = data?.operationalProgress || [];
  const resourceCoordination = data?.resourceCoordination || {};
  const shelterCoordination = data?.shelterCoordination || {};
  const volunteerCoordination = data?.volunteerCoordination || {};

  // SVG Donut calculation
  const circumference = 2 * Math.PI * 60; // 376.99
  let accumulatedOffset = 0;
  const donutSlices = (priorityDistribution.slices || []).map(slice => {
    const strokeDasharray = `${(slice.pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += (slice.pct / 100) * circumference;
    return { ...slice, strokeDasharray, strokeDashoffset };
  });

  // Calculate Bar Chart max
  const maxBarCount = Math.max(10, ...requestsOverTime.map(d => d.count || 0));

  return (
    <div className="ec-portal-canvas">
      {/* 1. Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">LIVE OPERATIONAL DATABASE ANALYTICS</span>
          <h2 className="ec-review-main-title">Reports &amp; Response Analytics</h2>
          <div className="ec-live-status-row">
            <span className="ec-live-badge">
              <span className="ec-live-badge-dot"></span>
              Live SQL Server Data
            </span>
            <span className="ec-last-updated-text">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()} (${lastUpdated.toLocaleDateString()})` : 'Connecting to database...'}
            </span>
          </div>
        </div>

        <div className="ec-reports-header-actions">
          <button
            className="ec-refresh-btn"
            onClick={() => fetchAnalytics(period, customStartDate, customEndDate, true)}
            disabled={loading || refreshing}
            title="Refresh analytics from database"
          >
            <RefreshCw size={13} className={refreshing ? 'ec-spinning' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <select
            className="ec-filter-dropdown-btn"
            value={period}
            onChange={handlePeriodChange}
            disabled={loading}
          >
            <option value="7d">Last 7 days</option>
            <option value="14d">Last 14 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range...</option>
          </select>

          <button
            className="ec-btn-action-primary"
            onClick={handleExportReport}
            disabled={loading || !data}
          >
            <Download size={14} />
            <span>Export report</span>
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker (shown only when period === 'custom') */}
      {period === 'custom' && (
        <div className="ec-custom-date-bar">
          <span className="ec-custom-date-label">
            <Calendar size={14} /> Custom Date Filter:
          </span>
          <input
            type="date"
            className="ec-date-input"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
          <span style={{ fontSize: '12px', color: '#64748b' }}>to</span>
          <input
            type="date"
            className="ec-date-input"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
          <button className="ec-btn-custom-apply" onClick={handleCustomApply}>
            Apply Range
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="ec-analytics-error-box">
          <AlertCircle size={28} color="#ef4444" />
          <h4 style={{ margin: 0, color: '#b91c1c' }}>Error Fetching Database Analytics</h4>
          <p style={{ margin: 0, color: '#4b5563', fontSize: '13px' }}>{error}</p>
          <button
            className="ec-btn-action-primary"
            onClick={() => fetchAnalytics(period, customStartDate, customEndDate, true)}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton if no data yet */}
      {loading && !data && (
        <div className="ec-analytics-loading-box">
          <RefreshCw size={28} className="ec-spinning" color="#0284c7" />
          <p style={{ margin: 0, color: '#475569', fontSize: '13px', fontWeight: 600 }}>
            Querying HumanitarianCrisisDb for verified request &amp; resource metrics...
          </p>
        </div>
      )}

      {/* 2. Top 5 KPI Metrics Cards */}
      <div className="ec-analytics-kpi-grid">
        {/* KPI 1: Incoming Requests */}
        <div className="ec-akpi-card">
          <div className="ec-akpi-head">
            <span className="ec-akpi-title">Incoming requests</span>
            <div className="ec-akpi-icon-wrap" style={{ background: '#eff6ff', color: '#0284c7' }}>
              <FileText size={16} />
            </div>
          </div>
          <div className="ec-akpi-val-row">
            <span className="ec-akpi-main-val">{metrics.incomingRequestsCount}</span>
            <span className={`ec-akpi-trend-pill ${metrics.incomingRequestsTrend?.startsWith('+') ? 'positive' : ''}`}>
              {metrics.incomingRequestsTrend?.startsWith('+') ? (
                <TrendingUp size={11} />
              ) : metrics.incomingRequestsTrend?.startsWith('-') ? (
                <TrendingDown size={11} />
              ) : (
                <Activity size={11} />
              )}
              <span>{metrics.incomingRequestsTrend || '0 records'}</span>
            </span>
          </div>
        </div>

        {/* KPI 2: Average initial review */}
        <div className="ec-akpi-card">
          <div className="ec-akpi-head">
            <span className="ec-akpi-title">Average initial review</span>
            <div className="ec-akpi-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="ec-akpi-val-row">
            <span className="ec-akpi-main-val">{metrics.avgInitialReviewTime}</span>
            <span className="ec-akpi-sub-target">{metrics.avgInitialReviewTarget}</span>
          </div>
        </div>

        {/* KPI 3: Average resolution time */}
        <div className="ec-akpi-card">
          <div className="ec-akpi-head">
            <span className="ec-akpi-title">Average resolution time</span>
            <div className="ec-akpi-icon-wrap" style={{ background: '#f0fdf4', color: '#10b981' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="ec-akpi-val-row">
            <span className="ec-akpi-main-val">{metrics.avgResolutionTime}</span>
            <span className="ec-akpi-sub-target">{metrics.avgResolutionTrend}</span>
          </div>
        </div>

        {/* KPI 4: Open vs resolved */}
        <div className="ec-akpi-card">
          <div className="ec-akpi-head">
            <span className="ec-akpi-title">Open vs resolved</span>
            <div className="ec-akpi-icon-wrap" style={{ background: '#f8fafc', color: '#64748b' }}>
              <BarChart2 size={16} />
            </div>
          </div>
          <div className="ec-akpi-val-row">
            <span className="ec-akpi-main-val">{metrics.openVsResolvedRatio}</span>
            <span className="ec-akpi-sub-target">
              Resolution rate: {metrics.resolutionRatePct}%
            </span>
          </div>
        </div>

        {/* KPI 5: Resource fulfillment */}
        <div className="ec-akpi-card">
          <div className="ec-akpi-head">
            <span className="ec-akpi-title">Resource fulfillment</span>
            <div className="ec-akpi-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
              <Package size={16} />
            </div>
          </div>
          <div className="ec-akpi-val-row">
            <span className="ec-akpi-main-val">{metrics.resourceFulfillmentRatio}</span>
            <span className="ec-akpi-sub-target">
              {metrics.deliveredQuantity} / {metrics.totalAllocatedQuantity} units delivered
            </span>
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
              <p className="ec-chart-sub">
                Live database timeline · {data?.period ? `Filtered: ${data.period}` : period}
              </p>
            </div>
            <span className="ec-chart-badge-pill">● {data?.period || period}</span>
          </div>

          <div className="ec-barchart-container">
            {/* Y Axis Guides */}
            <div className="ec-barchart-y-axis">
              <span>{maxBarCount}</span>
              <span>{Math.round(maxBarCount * 0.66)}</span>
              <span>{Math.round(maxBarCount * 0.33)}</span>
              <span>0</span>
            </div>

            {/* Bars Area */}
            <div className="ec-barchart-bars-area">
              {requestsOverTime.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '160px', color: '#94a3b8', fontSize: '13px' }}>
                  No incident records found for this period
                </div>
              ) : (
                requestsOverTime.map((item, idx) => {
                  const heightPct = Math.max(4, Math.round((item.count / maxBarCount) * 100));
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
                          <div style={{ fontSize: '10px', color: '#94a3b8' }}>{item.time}</div>
                        </div>
                      )}
                      <div className="ec-bar-track-vertical">
                        <div
                          className={`ec-bar-fill-vertical ${item.isPeak ? 'bar-peak' : ''}`}
                          style={{ height: `${heightPct}%`, opacity: item.count === 0 ? 0.3 : 1 }}
                        ></div>
                      </div>
                      <span className="ec-bar-x-lbl">{item.time}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Donut Chart Priority Distribution */}
        <div className="ec-chart-card">
          <div className="ec-chart-card-header">
            <div>
              <h3 className="ec-chart-title">Priority distribution</h3>
              <p className="ec-chart-sub">Live severity assessment breakdown</p>
            </div>
            <span className="ec-chart-badge-pill">{priorityDistribution.total} total</span>
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
              {donutSlices.length === 0 ? (
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>No priority data</span>
              ) : (
                donutSlices.map((slice) => (
                  <div key={slice.name} className="ec-donut-legend-item">
                    <div className="ec-donut-legend-left">
                      <span className="ec-rc-dot" style={{ backgroundColor: slice.color }}></span>
                      <span className="ec-donut-slice-name">{slice.name} ({slice.count})</span>
                    </div>
                    <span className="ec-donut-slice-pct">{slice.pct}%</span>
                  </div>
                ))
              )}
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
            <span className="ec-chart-badge-pill">{requestsByCategory.length} categories</span>
          </div>

          <div className="ec-category-progress-list">
            {requestsByCategory.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                No category data recorded in this period.
              </div>
            ) : (
              requestsByCategory.map((cat) => (
                <div key={cat.category} className="ec-cat-prog-row">
                  <div className="ec-cat-prog-head">
                    <span className="ec-cat-prog-name">{cat.category} ({cat.count})</span>
                    <span className="ec-cat-prog-pct">{cat.pct}%</span>
                  </div>
                  <div className="ec-cat-prog-track">
                    <div
                      className="ec-cat-prog-fill"
                      style={{ width: `${Math.max(4, cat.pct)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Operational Progress */}
        <div className="ec-chart-card">
          <div className="ec-chart-card-header">
            <h3 className="ec-chart-title">Operational progress</h3>
            <span className="ec-chart-badge-pill">Target SLAs</span>
          </div>

          <div className="ec-op-progress-list">
            {operationalProgress.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                No operational progress indicators available.
              </div>
            ) : (
              operationalProgress.map((item, idx) => (
                <div key={idx} className="ec-op-progress-row">
                  <span className="ec-op-prog-lbl">{item.label}</span>
                  <div className="ec-op-prog-right">
                    <span className="ec-op-prog-val">{item.value}</span>
                    <span className={`ec-op-pill ${item.typeClass || 'pill-ontarget'}`}>
                      <span className="ec-rc-status-dot"></span>
                      {item.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. Coordination Summary Grid (Resource, Shelter, Volunteer) */}
      <div className="ec-coord-summary-grid">
        {/* Card 1: Resource Coordination */}
        <div className="ec-coord-card">
          <div className="ec-coord-head">
            <div className="ec-coord-title-wrap">
              <div className="ec-coord-icon-badge" style={{ background: '#fffbeb', color: '#d97706' }}>
                <Package size={16} />
              </div>
              <div>
                <h4 className="ec-coord-title">Resource Coordination</h4>
                <p className="ec-coord-sub">Allocations &amp; Dispatch Status</p>
              </div>
            </div>
            <span className="ec-chart-badge-pill">
              {resourceCoordination.totalAllocations ?? 0} requests
            </span>
          </div>
          <div className="ec-coord-stat-list">
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Delivered / Fulfilled</span>
              <span className="ec-coord-stat-val" style={{ color: '#16a34a' }}>
                {resourceCoordination.fulfilledCount ?? 0} ({resourceCoordination.deliveredQuantity ?? 0} units)
              </span>
            </div>
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Dispatched / In-Transit</span>
              <span className="ec-coord-stat-val" style={{ color: '#0284c7' }}>
                {resourceCoordination.dispatchedCount ?? 0}
              </span>
            </div>
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Pending Manager Review</span>
              <span className="ec-coord-stat-val" style={{ color: '#d97706' }}>
                {resourceCoordination.pendingCount ?? 0}
              </span>
            </div>
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Total Allocated Quantity</span>
              <span className="ec-coord-stat-val">
                {resourceCoordination.totalQuantity ?? 0} units
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Shelter Placement Coordination */}
        <div className="ec-coord-card">
          <div className="ec-coord-head">
            <div className="ec-coord-title-wrap">
              <div className="ec-coord-icon-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                <Home size={16} />
              </div>
              <div>
                <h4 className="ec-coord-title">Shelter Coordination</h4>
                <p className="ec-coord-sub">Evacuee Placements &amp; Capacity</p>
              </div>
            </div>
            <span className="ec-chart-badge-pill">
              {shelterCoordination.totalPlacementRequests ?? 0} requests
            </span>
          </div>
          <div className="ec-coord-stat-list">
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Approved Placements</span>
              <span className="ec-coord-stat-val" style={{ color: '#16a34a' }}>
                {shelterCoordination.approvedCount ?? 0}
              </span>
            </div>
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Pending Review</span>
              <span className="ec-coord-stat-val" style={{ color: '#d97706' }}>
                {shelterCoordination.pendingCount ?? 0}
              </span>
            </div>
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Evacuees Placed / Requested</span>
              <span className="ec-coord-stat-val">
                {shelterCoordination.totalEvacueesRequested ?? 0} persons
              </span>
            </div>
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Total Capacity Available</span>
              <span className="ec-coord-stat-val" style={{ color: '#0284c7' }}>
                {shelterCoordination.totalCapacityAvailable ?? 0} beds
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Volunteer Assignment Coordination */}
        <div className="ec-coord-card">
          <div className="ec-coord-head">
            <div className="ec-coord-title-wrap">
              <div className="ec-coord-icon-badge" style={{ background: '#eff6ff', color: '#0284c7' }}>
                <Users size={16} />
              </div>
              <div>
                <h4 className="ec-coord-title">Volunteer Coordination</h4>
                <p className="ec-coord-sub">Assignments &amp; Field Staffing</p>
              </div>
            </div>
            <span className="ec-chart-badge-pill">
              {volunteerCoordination.totalAssignmentRequests ?? 0} requests
            </span>
          </div>
          <div className="ec-coord-stat-list">
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Assigned Requests</span>
              <span className="ec-coord-stat-val" style={{ color: '#16a34a' }}>
                {volunteerCoordination.assignedCount ?? 0}
              </span>
            </div>
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Pending Volunteer Assignment</span>
              <span className="ec-coord-stat-val" style={{ color: '#d97706' }}>
                {volunteerCoordination.pendingCount ?? 0}
              </span>
            </div>
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Volunteers Requested</span>
              <span className="ec-coord-stat-val">
                {volunteerCoordination.volunteersRequested ?? 0} volunteers
              </span>
            </div>
            <div className="ec-coord-stat-row">
              <span className="ec-coord-stat-lbl">Active Volunteer Pool</span>
              <span className="ec-coord-stat-val" style={{ color: '#0284c7' }}>
                {volunteerCoordination.availableVolunteersCount ?? 0} registered
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsResponseAnalyticsView;

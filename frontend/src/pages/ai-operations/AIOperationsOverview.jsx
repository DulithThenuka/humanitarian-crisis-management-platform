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
  ExternalLink
} from 'lucide-react';

export const AIOperationsOverview = ({ onNavigateQueue, onNavigateReview, onNavigateWorkspaces }) => {
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  return (
    <div className="ai-page-canvas">
      {/* Top Breadcrumb Bar */}
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
              placeholder="Search requests, locations, shelters..." 
              className="ai-search-input"
            />
          </div>

          <div className="ai-header-actions">
            <button className="header-icon-pill" title="Notifications">
              <Bell size={16} />
              <span className="badge-count">3</span>
            </button>
            <button className="header-icon-pill" title="Help">
              <HelpCircle size={16} />
            </button>
            <div className="user-avatar-badge">
              <span>AC</span>
              <ChevronDown size={12} className="chevron" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Title Header */}
      <div className="ai-page-title-row">
        <div>
          <h1 className="ai-main-heading">AI Operations Overview</h1>
          <p className="ai-main-subheading">
            AI-powered decision support for faster, fairer and more effective humanitarian response.
          </p>
        </div>

        <div className="ai-date-picker-btn">
          <Calendar size={14} />
          <span>{timeRange}</span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* 4 Metric KPI Cards (Picture 1) */}
      <div className="ai-kpi-quad-grid">
        {/* Card 1 */}
        <div className="ai-kpi-card" onClick={onNavigateQueue} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-box blue">
            <FileText size={20} color="#2563eb" />
          </div>
          <div className="kpi-data-block">
            <div className="kpi-value-number">186</div>
            <div className="kpi-title-label">Requests Analyzed</div>
            <div className="kpi-trend-pill green">
              <span className="arrow">↑</span>
              <span className="pct">+12%</span>
              <span className="comp-text">vs. previous period</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="ai-kpi-card" onClick={onNavigateQueue} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-box orange">
            <Users size={20} color="#ea580c" />
          </div>
          <div className="kpi-data-block">
            <div className="kpi-value-number">24</div>
            <div className="kpi-title-label">Pending Human Review</div>
            <div className="kpi-trend-pill red">
              <span className="arrow">↑</span>
              <span className="pct">+8%</span>
              <span className="comp-text">vs. previous period</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="ai-kpi-card" onClick={onNavigateQueue} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-box red">
            <AlertTriangle size={20} color="#dc2626" />
          </div>
          <div className="kpi-data-block">
            <div className="kpi-value-number">18</div>
            <div className="kpi-title-label">High Risk / Critical</div>
            <div className="kpi-trend-pill red">
              <span className="arrow">↑</span>
              <span className="pct">+5%</span>
              <span className="comp-text">vs. previous period</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="ai-kpi-card">
          <div className="kpi-icon-box green">
            <Target size={20} color="#16a34a" />
          </div>
          <div className="kpi-data-block">
            <div className="kpi-value-number">89%</div>
            <div className="kpi-title-label">AI Recommendation Accuracy</div>
            <div className="kpi-trend-pill green">
              <span className="arrow">↑</span>
              <span className="pct">+4%</span>
              <span className="comp-text">vs. previous period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Trend Line Chart & Donut Chart */}
      <div className="ai-charts-split-grid">
        {/* Request Classification Trend (7 Days) */}
        <div className="ai-white-card">
          <div className="card-header-flex">
            <h2 className="card-section-title">Request Classification Trend (7 Days)</h2>
          </div>

          <div className="chart-legend-row">
            <span className="legend-item"><i style={{ backgroundColor: '#2563eb' }}></i> Medical</span>
            <span className="legend-item"><i style={{ backgroundColor: '#16a34a' }}></i> Food</span>
            <span className="legend-item"><i style={{ backgroundColor: '#ea580c' }}></i> Shelter</span>
            <span className="legend-item"><i style={{ backgroundColor: '#9333ea' }}></i> Protection</span>
            <span className="legend-item"><i style={{ backgroundColor: '#64748b' }}></i> Other</span>
          </div>

          <div className="svg-trend-container">
            <div className="y-axis-label-vertical">Number of Requests</div>
            <svg viewBox="0 0 600 230" className="trend-line-svg" preserveAspectRatio="none">
              {/* Horizontal grid lines */}
              <line x1="45" y1="20" x2="585" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="58" x2="585" y2="58" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="96" x2="585" y2="96" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="134" x2="585" y2="134" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="172" x2="585" y2="172" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="45" y1="210" x2="585" y2="210" stroke="#e2e8f0" strokeWidth="1" />

              {/* Y Axis Numbers */}
              <text x="35" y="24" className="chart-axis-text" textAnchor="end">100</text>
              <text x="35" y="62" className="chart-axis-text" textAnchor="end">80</text>
              <text x="35" y="100" className="chart-axis-text" textAnchor="end">60</text>
              <text x="35" y="138" className="chart-axis-text" textAnchor="end">40</text>
              <text x="35" y="176" className="chart-axis-text" textAnchor="end">20</text>
              <text x="35" y="213" className="chart-axis-text" textAnchor="end">0</text>

              {/* Multi-line curves with exact styling from Screenshot 1 */}
              {/* Medical (Blue #2563eb) */}
              <path 
                d="M 65 155 Q 150 95 235 125 T 415 65 T 565 30" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="2.5" 
              />
              <circle cx="65" cy="155" r="3.5" fill="#2563eb" />
              <circle cx="150" cy="108" r="3.5" fill="#2563eb" />
              <circle cx="235" cy="125" r="3.5" fill="#2563eb" />
              <circle cx="325" cy="72" r="3.5" fill="#2563eb" />
              <circle cx="415" cy="75" r="3.5" fill="#2563eb" />
              <circle cx="500" cy="58" r="3.5" fill="#2563eb" />
              <circle cx="565" cy="30" r="3.5" fill="#2563eb" />

              {/* Food (Green #16a34a) */}
              <path 
                d="M 65 168 Q 150 148 235 158 T 415 130 T 565 85" 
                fill="none" 
                stroke="#16a34a" 
                strokeWidth="2.5" 
              />
              <circle cx="65" cy="168" r="3.5" fill="#16a34a" />
              <circle cx="150" cy="148" r="3.5" fill="#16a34a" />
              <circle cx="235" cy="158" r="3.5" fill="#16a34a" />
              <circle cx="325" cy="138" r="3.5" fill="#16a34a" />
              <circle cx="415" cy="148" r="3.5" fill="#16a34a" />
              <circle cx="500" cy="120" r="3.5" fill="#16a34a" />
              <circle cx="565" cy="85" r="3.5" fill="#16a34a" />

              {/* Shelter (Orange #ea580c) */}
              <path 
                d="M 65 178 Q 150 162 235 170 T 415 150 T 565 112" 
                fill="none" 
                stroke="#ea580c" 
                strokeWidth="2.5" 
              />
              <circle cx="65" cy="178" r="3.5" fill="#ea580c" />
              <circle cx="150" cy="162" r="3.5" fill="#ea580c" />
              <circle cx="235" cy="170" r="3.5" fill="#ea580c" />
              <circle cx="325" cy="150" r="3.5" fill="#ea580c" />
              <circle cx="415" cy="158" r="3.5" fill="#ea580c" />
              <circle cx="500" cy="142" r="3.5" fill="#ea580c" />
              <circle cx="565" cy="112" r="3.5" fill="#ea580c" />

              {/* Protection (Purple #9333ea) */}
              <path 
                d="M 65 192 Q 150 178 235 182 T 415 170 T 565 145" 
                fill="none" 
                stroke="#9333ea" 
                strokeWidth="2" 
              />
              <circle cx="65" cy="192" r="3" fill="#9333ea" />
              <circle cx="150" cy="178" r="3" fill="#9333ea" />
              <circle cx="235" cy="182" r="3" fill="#9333ea" />
              <circle cx="325" cy="172" r="3" fill="#9333ea" />
              <circle cx="415" cy="176" r="3" fill="#9333ea" />
              <circle cx="500" cy="162" r="3" fill="#9333ea" />
              <circle cx="565" cy="145" r="3" fill="#9333ea" />

              {/* Other (Gray #64748b) */}
              <path 
                d="M 65 200 Q 150 188 235 192 T 415 186 T 565 168" 
                fill="none" 
                stroke="#64748b" 
                strokeWidth="2" 
              />
              <circle cx="65" cy="200" r="3" fill="#64748b" />
              <circle cx="150" cy="188" r="3" fill="#64748b" />
              <circle cx="235" cy="192" r="3" fill="#64748b" />
              <circle cx="325" cy="188" r="3" fill="#64748b" />
              <circle cx="415" cy="192" r="3" fill="#64748b" />
              <circle cx="500" cy="182" r="3" fill="#64748b" />
              <circle cx="565" cy="168" r="3" fill="#64748b" />
            </svg>

            {/* X Axis Labels */}
            <div className="x-axis-labels-row">
              <span>Oct 21</span>
              <span>Oct 22</span>
              <span>Oct 23</span>
              <span>Oct 24</span>
              <span>Oct 25</span>
              <span>Oct 26</span>
              <span>Oct 27</span>
            </div>
          </div>
        </div>

        {/* Priority Distribution Donut */}
        <div className="ai-white-card">
          <h2 className="card-section-title">Priority Distribution</h2>
          
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
                  strokeWidth="14"
                  strokeDasharray="23.1 215.7"
                  strokeDashoffset="59.7"
                />
                {/* High (28.0%) Orange */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f97316"
                  strokeWidth="14"
                  strokeDasharray="66.8 172.0"
                  strokeDashoffset="36.6"
                />
                {/* Medium (38.7%) Yellow */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#eab308"
                  strokeWidth="14"
                  strokeDasharray="92.4 146.4"
                  strokeDashoffset="-30.2"
                />
                {/* Low (23.7%) Teal/Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray="56.6 182.2"
                  strokeDashoffset="-122.6"
                />
              </svg>
              <div className="donut-center-metric">
                <span className="donut-total-label">Total</span>
                <span className="donut-total-val">186</span>
              </div>
            </div>

            <div className="donut-legend-col">
              <div className="donut-legend-row">
                <span className="dot" style={{ backgroundColor: '#ef4444' }}></span>
                <span className="cat-name">Critical</span>
                <span className="cat-stat">18 (9.7%)</span>
              </div>
              <div className="donut-legend-row">
                <span className="dot" style={{ backgroundColor: '#f97316' }}></span>
                <span className="cat-name">High</span>
                <span className="cat-stat">52 (28.0%)</span>
              </div>
              <div className="donut-legend-row">
                <span className="dot" style={{ backgroundColor: '#eab308' }}></span>
                <span className="cat-name">Medium</span>
                <span className="cat-stat">72 (38.7%)</span>
              </div>
              <div className="donut-legend-row">
                <span className="dot" style={{ backgroundColor: '#10b981' }}></span>
                <span className="cat-name">Low</span>
                <span className="cat-stat">44 (23.7%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: AI Service Status & Recent AI Insights */}
      <div className="ai-charts-split-grid bottom-grid">
        {/* AI Service Status */}
        <div className="ai-white-card">
          <h2 className="card-section-title">AI Service Status</h2>

          <div className="service-status-two-col">
            <div className="service-status-column">
              <div className="service-status-line">
                <div className="serv-left">
                  <FileText size={15} color="#475569" />
                  <span>Request Classification</span>
                </div>
                <span className="status-online-pill">
                  <i className="green-bullet"></i> Online
                </span>
              </div>

              <div className="service-status-line">
                <div className="serv-left">
                  <BarChart2 size={15} color="#475569" />
                  <span>Priority Scoring</span>
                </div>
                <span className="status-online-pill">
                  <i className="green-bullet"></i> Online
                </span>
              </div>

              <div className="service-status-line">
                <div className="serv-left">
                  <Copy size={15} color="#475569" />
                  <span>Duplicate Detection</span>
                </div>
                <span className="status-online-pill">
                  <i className="green-bullet"></i> Online
                </span>
              </div>

              <div className="service-status-line">
                <div className="serv-left">
                  <Share2 size={15} color="#475569" />
                  <span>Resource Matching</span>
                </div>
                <span className="status-online-pill">
                  <i className="green-bullet"></i> Online
                </span>
              </div>

              <div className="service-status-line">
                <div className="serv-left">
                  <Home size={15} color="#475569" />
                  <span>Shelter Recommendation</span>
                </div>
                <span className="status-online-pill">
                  <i className="green-bullet"></i> Online
                </span>
              </div>
            </div>

            <div className="service-status-column">
              <div className="service-status-line">
                <div className="serv-left">
                  <Users size={15} color="#475569" />
                  <span>Volunteer Matching</span>
                </div>
                <span className="status-online-pill">
                  <i className="green-bullet"></i> Online
                </span>
              </div>

              <div className="service-status-line">
                <div className="serv-left">
                  <TrendingUp size={15} color="#475569" />
                  <span>Demand Forecasting</span>
                </div>
                <span className="status-online-pill">
                  <i className="green-bullet"></i> Online
                </span>
              </div>

              <div className="service-status-line">
                <div className="serv-left">
                  <AlertTriangle size={15} color="#475569" />
                  <span>Anomaly Detection</span>
                </div>
                <span className="status-online-pill">
                  <i className="green-bullet"></i> Online
                </span>
              </div>

              <div className="service-status-line">
                <div className="serv-left">
                  <Globe size={15} color="#475569" />
                  <span>Multilingual Response</span>
                </div>
                <span className="status-online-pill">
                  <i className="green-bullet"></i> Online
                </span>
              </div>

              <div className="service-status-line">
                <div className="serv-left">
                  <FileText size={15} color="#475569" />
                  <span>Crisis Summarization</span>
                </div>
                <span className="status-online-pill">
                  <i className="green-bullet"></i> Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent AI Insights */}
        <div className="ai-white-card">
          <div className="card-header-flex">
            <h2 className="card-section-title">Recent AI Insights</h2>
            <button className="view-all-link-btn" onClick={onNavigateQueue}>
              <span>View All</span>
              <span className="arrow-sym">&rarr;</span>
            </button>
          </div>

          <div className="insights-vertical-stack">
            <div className="insight-entry-item" onClick={() => onNavigateReview('REQ-2026-01842')} style={{ cursor: 'pointer' }}>
              <div className="insight-icon-square blue">
                <BarChart2 size={16} color="#2563eb" />
              </div>
              <div className="insight-info-wrap">
                <div className="insight-headline">Increase in medical requests</div>
                <div className="insight-desc">32% higher than last week</div>
              </div>
              <div className="insight-timestamp">2 hours ago</div>
            </div>

            <div className="insight-entry-item">
              <div className="insight-icon-square orange">
                <AlertTriangle size={16} color="#d97706" />
              </div>
              <div className="insight-info-wrap">
                <div className="insight-headline">Potential resource shortage</div>
                <div className="insight-desc">In Northern District</div>
              </div>
              <div className="insight-timestamp">4 hours ago</div>
            </div>

            <div className="insight-entry-item">
              <div className="insight-icon-square purple">
                <Users size={16} color="#7c3aed" />
              </div>
              <div className="insight-info-wrap">
                <div className="insight-headline">High duplication risk detected</div>
                <div className="insight-desc">5 similar requests identified</div>
              </div>
              <div className="insight-timestamp">6 hours ago</div>
            </div>

            <div className="insight-entry-item">
              <div className="insight-icon-square green">
                <ArrowUp size={16} color="#16a34a" />
              </div>
              <div className="insight-info-wrap">
                <div className="insight-headline">Heavy rainfall expected</div>
                <div className="insight-desc">Food supplies likely needed</div>
              </div>
              <div className="insight-timestamp">8 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
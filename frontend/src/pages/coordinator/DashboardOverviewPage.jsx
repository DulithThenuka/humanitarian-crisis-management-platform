import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  AlertCircle, 
  PlusSquare, 
  Package, 
  Building2, 
  Users, 
  Gift, 
  Brain, 
  Compass, 
  Bell, 
  FileBarChart, 
  ClipboardList, 
  Settings, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Maximize2, 
  Plus, 
  Minus, 
  Radio, 
  TrendingUp, 
  Eye, 
  UserCheck, 
  MoreHorizontal, 
  AlertTriangle, 
  Info, 
  FileText 
} from 'lucide-react';

import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import sarahJohnson from '../../assets/sarah-johnson.jpg';
import crisisCenterIcon from '../../assets/crisis-center-icon.png';
import { LiveSatelliteCrisisMap } from '../../components/maps/LiveSatelliteCrisisMap';
import './DashboardOverviewPage.css';

export const DashboardOverviewPage = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchVal, setSearchVal] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Western Province');

  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, hasSub: false },
    { id: 'crisis', label: 'Crisis Management', icon: AlertCircle, hasSub: true },
    { id: 'requests', label: 'Assistance Requests', icon: PlusSquare, hasSub: true },
    { id: 'resources', label: 'Resources', icon: Package, hasSub: true },
    { id: 'shelters', label: 'Shelters', icon: Building2, hasSub: true },
    { id: 'volunteers', label: 'Volunteers', icon: Users, hasSub: true },
    { id: 'donations', label: 'Donations', icon: Gift, hasSub: true },
    { id: 'ai-ops', label: 'AI Operations', icon: Brain, hasSub: true },
    { id: 'maps', label: 'Maps', icon: Compass, hasSub: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3, hasSub: false },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart, hasSub: false },
    { id: 'audit', label: 'Audit Logs', icon: ClipboardList, hasSub: false },
    { id: 'settings', label: 'Settings', icon: Settings, hasSub: false },
  ];

  const criticalRequests = [
    {
      id: 'REQ-2026-01842',
      subId: 'REQ-2026-01549',
      category: 'Medical Assistance',
      priority: 'Critical',
      time: '2 min ago',
      iconBg: '#fee2e2',
      iconColor: '#dc2626'
    },
    {
      id: 'REQ-2026-01877',
      subId: 'REQ-2026-01534',
      category: 'Shelter Request',
      priority: 'High',
      time: '5 min ago',
      iconBg: '#fef3c7',
      iconColor: '#d97706'
    },
    {
      id: 'REQ-2026-01835',
      subId: 'REQ-2026-01672',
      category: 'Food Assistance',
      priority: 'High',
      time: '8 min ago',
      iconBg: '#fef3c7',
      iconColor: '#d97706'
    },
    {
      id: 'REQ-2026-01628',
      subId: 'REQ-2026-01490',
      category: 'Transport Assistance',
      priority: 'Medium',
      time: '12 min ago',
      iconBg: '#e0f2fe',
      iconColor: '#0284c7'
    },
    {
      id: 'REQ-2026-01821',
      subId: 'REQ-2026-01649',
      category: 'Evacuation Support',
      priority: 'Medium',
      time: '15 min ago',
      iconBg: '#e0f2fe',
      iconColor: '#0284c7'
    }
  ];

  const priorityQueueData = [
    {
      id: 'REQ-2026-01842',
      category: 'Medical',
      location: 'Colombo',
      priority: 'Critical',
      aiScore: '91%',
      status: 'Under Review',
      assignedTo: 'Unassigned',
      created: '2 min ago'
    },
    {
      id: 'REQ-2026-01877',
      category: 'Shelter',
      location: 'Gampaha',
      priority: 'High',
      aiScore: '87%',
      status: 'Assigned',
      assignedTo: 'Team Alpha',
      created: '5 min ago'
    },
    {
      id: 'REQ-2026-01835',
      category: 'Food',
      location: 'Kalutara',
      priority: 'High',
      aiScore: '82%',
      status: 'Pending',
      assignedTo: 'Unassigned',
      created: '8 min ago'
    },
    {
      id: 'REQ-2026-01628',
      category: 'Transport',
      location: 'Negombo',
      priority: 'Medium',
      aiScore: '76%',
      status: 'Under Review',
      assignedTo: 'Team Bravo',
      created: '12 min ago'
    },
    {
      id: 'REQ-2026-01821',
      category: 'Evacuation',
      location: 'Kalutara',
      priority: 'Medium',
      aiScore: '62%',
      status: 'Assigned',
      assignedTo: 'Team Alpha',
      created: '15 min ago'
    }
  ];

  return (
    <div className="command-center-container">
      {/* =========================================================
         1. Left Sidebar Navigation
         ========================================================= */}
      <aside className="coord-sidebar">
        <div>
          {/* Brand Logo */}
          <div className="coord-sidebar-brand">
            <Link to="/coordinator/dashboard">
              <img
                src={reliefcoreLogoWhite}
                alt="RELIEFCORE Humanitarian Operations"
                className="coord-brand-logo"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="coord-sidebar-nav">
            {navMenuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  className={`coord-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  <div className="coord-nav-left">
                    <IconComp size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && <span className="coord-nav-badge">{item.badge}</span>}
                  {item.hasSub && <ChevronRight size={13} color="#64748b" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="coord-sidebar-bottom">
          <div className="coord-user-card">
            <img src={sarahJohnson} alt="Sarah Johnson" className="coord-avatar-img" />
            <div>
              <div className="coord-user-name">Sarah Johnson</div>
              <div className="coord-user-role">Emergency Coordinator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================
         2. Main Content
         ========================================================= */}
      <main className="coord-main-content">
        {/* Top Header */}
        <header className="coord-top-header">
          <div className="header-brand-title-wrap">
            <img src={crisisCenterIcon} alt="Command Center" className="header-icon-box" />
            <div>
              <h1 className="header-title-text">Crisis Command Center</h1>
              <p className="header-subtitle-text">Real-time overview of humanitarian operations</p>
            </div>
          </div>

          <div className="header-center-search">
            <Search size={14} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search requests, locations, resources..."
              className="header-search-input"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>

          <div className="header-right-tools">
            <button className="header-bell-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="header-bell-dot">3</span>
            </button>

            <div className="header-user-profile">
              <img src={sarahJohnson} alt="Sarah Johnson" className="header-avatar" />
              <div className="header-user-col">
                <span className="header-user-fullname">Sarah Johnson</span>
                <span className="header-user-subrole">Emergency Coordinator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="coord-body-padding">
          {/* Live Operation Status Bar */}
          <div className="live-op-card">
            <div className="live-op-left">
              <div className="live-op-pill">
                <Radio size={11} />
                <span>LIVE OPERATION</span>
              </div>
              <span className="live-op-title">Flood Response - Western Province</span>
              <span className="live-op-time">Updated 18 seconds ago</span>
            </div>

            <Link to="/coordinator/triage" className="live-op-link">
              <span>View Details</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {/* Row of 6 KPI Stat Cards */}
          <div className="kpi-row-grid">
            {/* Card 1: Active Crises */}
            <div className="kpi-stat-card">
              <div className="kpi-card-top">
                <div className="kpi-icon-box" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                  <Users size={14} />
                </div>
                <span className="kpi-label-text">Active Crises</span>
              </div>
              <div className="kpi-value-text">24</div>
              <span className="kpi-sub-trend trend-green">↑ +3 this week</span>
            </div>

            {/* Card 2: Open Requests */}
            <div className="kpi-stat-card">
              <div className="kpi-card-top">
                <div className="kpi-icon-box" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                  <ClipboardList size={14} />
                </div>
                <span className="kpi-label-text">Open Requests</span>
              </div>
              <div className="kpi-value-text">186</div>
              <span className="kpi-sub-trend trend-red">↑ +12%</span>
            </div>

            {/* Card 3: High Priority */}
            <div className="kpi-stat-card">
              <div className="kpi-card-top">
                <div className="kpi-icon-box" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                  <AlertTriangle size={14} />
                </div>
                <span className="kpi-label-text">High Priority</span>
              </div>
              <div className="kpi-value-text">42</div>
              <span className="kpi-sub-trend trend-red">↑ +7</span>
            </div>

            {/* Card 4: Resources Allocated */}
            <div className="kpi-stat-card">
              <div className="kpi-card-top">
                <div className="kpi-icon-box" style={{ backgroundColor: '#f0fdfa', color: '#14b8a6' }}>
                  <Package size={14} />
                </div>
                <span className="kpi-label-text">Resources Allocated</span>
              </div>
              <div className="kpi-value-text">78%</div>
              <div className="kpi-mini-bar">
                <div className="kpi-bar-fill" style={{ width: '78%', backgroundColor: '#10b981' }}></div>
              </div>
            </div>

            {/* Card 5: Shelter Occupancy */}
            <div className="kpi-stat-card">
              <div className="kpi-card-top">
                <div className="kpi-icon-box" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                  <Building2 size={14} />
                </div>
                <span className="kpi-label-text">Shelter Occupancy</span>
              </div>
              <div className="kpi-value-text">74%</div>
              <div className="kpi-mini-bar">
                <div className="kpi-bar-fill" style={{ width: '74%', backgroundColor: '#f97316' }}></div>
              </div>
            </div>

            {/* Card 6: AI Recommendations */}
            <div className="kpi-stat-card">
              <div className="kpi-card-top">
                <div className="kpi-icon-box" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                  <Brain size={14} />
                </div>
                <span className="kpi-label-text">AI Recommendations</span>
              </div>
              <div className="kpi-value-text">12</div>
              <span className="kpi-sub-trend trend-purple">→ 3 pending review</span>
            </div>
          </div>

          {/* Middle Row: Satellite Crisis Map + Critical Requests */}
          <div className="map-and-requests-row">
            {/* Satellite Map */}
            <div className="satellite-map-card">
              <LiveSatelliteCrisisMap onProvinceChange={(prov) => setSelectedProvince(prov)} />
            </div>

            {/* Critical Requests List */}
            <div className="critical-requests-card">
              <div className="card-title-header">
                <h3 className="card-heading-text">Critical Requests</h3>
                <Link to="/coordinator/triage" className="card-view-all-link">View All</Link>
              </div>

              <div className="critical-list">
                {criticalRequests.map((req) => (
                  <div key={req.id} className="critical-item-row">
                    <div className="crit-item-left">
                      <div className="crit-icon-box" style={{ backgroundColor: req.iconBg, color: req.iconColor }}>
                        <AlertTriangle size={12} />
                      </div>
                      <div className="crit-details-col">
                        <span className="crit-id-text">{req.id}</span>
                        <span className="crit-sub-id">{req.subId}</span>
                      </div>
                    </div>

                    <span className="crit-category-center">{req.category}</span>

                    <div className="crit-item-right">
                      <span className={`crit-priority-pill priority-${req.priority.toLowerCase()}`}>
                        {req.priority}
                      </span>
                      <span className="crit-time-text">{req.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Row 2: Request Activity + Resource Utilisation + Recent Decisions */}
          <div className="activity-util-decisions-row">
            {/* Request Activity Area Chart */}
            <div className="activity-card">
              <div className="activity-top-row">
                <div>
                  <h4 className="card-heading-text">Request Activity</h4>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>Last 7 days</span>
                </div>
                <span className="activity-badge-green">+12%</span>
              </div>

              <div className="activity-count-row">
                <span className="activity-big-count">186</span>
                <span className="activity-count-label">Total Requests</span>
              </div>

              {/* Vector SVG Line Chart */}
              <svg className="chart-svg-container" viewBox="0 0 260 90" fill="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Axis Grid lines */}
                <line x1="25" y1="15" x2="255" y2="15" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="25" y1="40" x2="255" y2="40" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="25" y1="65" x2="255" y2="65" stroke="#f1f5f9" strokeDasharray="3 3" />

                {/* Y Axis text */}
                <text x="5" y="18" fill="#94a3b8" fontSize="8">150</text>
                <text x="5" y="43" fill="#94a3b8" fontSize="8">100</text>
                <text x="12" y="68" fill="#94a3b8" fontSize="8">50</text>
                <text x="15" y="80" fill="#94a3b8" fontSize="8">0</text>

                {/* Area under curve */}
                <path
                  d="M 35 65 L 65 52 L 100 48 L 135 40 L 170 38 L 205 24 L 240 18 L 240 75 L 35 75 Z"
                  fill="url(#chartGradient)"
                />

                {/* Main line */}
                <path
                  d="M 35 65 L 65 52 L 100 48 L 135 40 L 170 38 L 205 24 L 240 18"
                  stroke="#0ea5e9"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                <circle cx="35" cy="65" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                <circle cx="65" cy="52" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                <circle cx="100" cy="48" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                <circle cx="135" cy="40" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                <circle cx="170" cy="38" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                <circle cx="205" cy="24" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                <circle cx="240" cy="18" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />

                {/* X Axis days */}
                <text x="30" y="88" fill="#94a3b8" fontSize="7.5">Mon</text>
                <text x="62" y="88" fill="#94a3b8" fontSize="7.5">Tue</text>
                <text x="96" y="88" fill="#94a3b8" fontSize="7.5">Wed</text>
                <text x="131" y="88" fill="#94a3b8" fontSize="7.5">Thu</text>
                <text x="168" y="88" fill="#94a3b8" fontSize="7.5">Fri</text>
                <text x="201" y="88" fill="#94a3b8" fontSize="7.5">Sat</text>
                <text x="234" y="88" fill="#94a3b8" fontSize="7.5">Sun</text>
              </svg>
            </div>

            {/* Resource Utilisation Donuts */}
            <div className="utilisation-card">
              <h4 className="card-heading-text">Resource Utilisation</h4>

              <div className="donuts-group">
                {/* Donut 1: Food 78% */}
                <div className="donut-stat-item">
                  <div className="donut-circle-wrap">
                    <svg width="48" height="48" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="3.5"
                        strokeDasharray="78, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="donut-pct-text">78%</span>
                  </div>
                  <span className="donut-label-text">Food</span>
                </div>

                {/* Donut 2: Medical 64% */}
                <div className="donut-stat-item">
                  <div className="donut-circle-wrap">
                    <svg width="48" height="48" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="3.5"
                        strokeDasharray="64, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="donut-pct-text">64%</span>
                  </div>
                  <span className="donut-label-text">Medical</span>
                </div>

                {/* Donut 3: Vehicles 52% */}
                <div className="donut-stat-item">
                  <div className="donut-circle-wrap">
                    <svg width="48" height="48" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#0369a1"
                        strokeWidth="3.5"
                        strokeDasharray="52, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="donut-pct-text">52%</span>
                  </div>
                  <span className="donut-label-text">Vehicles</span>
                </div>

                {/* Donut 4: Shelter 89% */}
                <div className="donut-stat-item">
                  <div className="donut-circle-wrap">
                    <svg width="48" height="48" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#0f766e"
                        strokeWidth="3.5"
                        strokeDasharray="89, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="donut-pct-text">89%</span>
                  </div>
                  <span className="donut-label-text">Shelter</span>
                </div>
              </div>
            </div>

            {/* Recent Decisions Card */}
            <div className="decisions-card">
              <h4 className="card-heading-text">Recent Decisions</h4>

              <div className="decisions-timeline">
                <div className="decision-item-entry">
                  <div className="dec-item-left">
                    <div className="dec-icon-bullet" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
                      <FileText size={11} />
                    </div>
                    <div>
                      <div className="dec-title-main">Approved resource allocation</div>
                      <div className="dec-sub-ref">REQ-2026-01835</div>
                    </div>
                  </div>
                  <span className="dec-time-right">10 min ago</span>
                </div>

                <div className="decision-item-entry">
                  <div className="dec-item-left">
                    <div className="dec-icon-bullet" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                      <AlertCircle size={11} />
                    </div>
                    <div>
                      <div className="dec-title-main">Modified AI recommendation</div>
                      <div className="dec-sub-ref">REQ-2026-01821</div>
                    </div>
                  </div>
                  <span className="dec-time-right">25 min ago</span>
                </div>

                <div className="decision-item-entry">
                  <div className="dec-item-left">
                    <div className="dec-icon-bullet" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
                      <Users size={11} />
                    </div>
                    <div>
                      <div className="dec-title-main">Assigned volunteers team</div>
                      <div className="dec-sub-ref">REQ-2026-01815</div>
                    </div>
                  </div>
                  <span className="dec-time-right">32 min ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Priority Request Queue Table + Emergency Alerts */}
          <div className="queue-and-alerts-row">
            {/* Priority Request Queue Table */}
            <div className="queue-table-card">
              <div className="queue-header-flex">
                <div className="queue-title-left">
                  <span style={{ color: '#ef4444' }}>🎯</span>
                  <span>Priority Request Queue</span>
                </div>
                <Link to="/coordinator/triage" className="queue-pill-btn">
                  <span>View All Requests</span>
                  <ChevronRight size={12} />
                </Link>
              </div>

              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '24px' }}>
                      <input type="checkbox" style={{ accentColor: '#0f766e' }} />
                    </th>
                    <th>Request ID</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>AI Score</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityQueueData.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input type="checkbox" style={{ accentColor: '#0f766e' }} />
                      </td>
                      <td className="req-table-id">{row.id}</td>
                      <td>{row.category}</td>
                      <td>{row.location}</td>
                      <td>
                        <span className={`crit-priority-pill priority-${row.priority.toLowerCase()}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{row.aiScore}</td>
                      <td>
                        <span className={`table-status-pill status-${row.status.toLowerCase().replace(' ', '-')}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{row.assignedTo}</td>
                      <td style={{ color: '#94a3b8' }}>{row.created}</td>
                      <td>
                        <div className="table-actions-cell">
                          <button className="action-icon-btn" title="View Details">
                            <Eye size={13} />
                          </button>
                          <button className="action-icon-btn" title="Assign">
                            <UserCheck size={13} />
                          </button>
                          <button className="action-icon-btn" title="More">
                            <MoreHorizontal size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Emergency Alerts */}
            <div className="alerts-card-box">
              <div className="card-title-header">
                <h3 className="card-heading-text">Emergency Alerts</h3>
                <Link to="/coordinator/alerts" className="card-view-all-link">View All</Link>
              </div>

              <div className="alerts-list-col">
                {/* Alert 1 */}
                <div className="alert-entry-card alert-entry-red">
                  <div className="alert-entry-head">
                    <AlertTriangle size={13} color="#dc2626" />
                    <span className="alert-title-strong" style={{ color: '#dc2626' }}>Severe Weather Warning</span>
                  </div>
                  <p className="alert-p-text">
                    Heavy rainfall expected in Western Province next 24 hours. Possible flooding in low-lying areas.
                  </p>
                  <span className="alert-time-sm">2 hours ago</span>
                </div>

                {/* Alert 2 */}
                <div className="alert-entry-card alert-entry-amber">
                  <div className="alert-entry-head">
                    <AlertCircle size={13} color="#d97706" />
                    <span className="alert-title-strong" style={{ color: '#d97706' }}>Road Closure</span>
                  </div>
                  <p className="alert-p-text">
                    Main road A1 closed due to landslide near Gampaha. Use alternative routes.
                  </p>
                  <span className="alert-time-sm">4 hours ago</span>
                </div>

                {/* Alert 3 */}
                <div className="alert-entry-card alert-entry-blue">
                  <div className="alert-entry-head">
                    <Info size={13} color="#2563eb" />
                    <span className="alert-title-strong" style={{ color: '#2563eb' }}>New Shelter Opened</span>
                  </div>
                  <p className="alert-p-text">
                    Colombo Central School now open for displaced families. Capacity: 500 people.
                  </p>
                  <span className="alert-time-sm">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

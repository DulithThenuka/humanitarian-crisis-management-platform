import React, { useState, useMemo } from 'react';
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
  FileText,
  ShieldCheck,
  Cpu,
  User,
  Copy,
  Check,
  ExternalLink,
  X
} from 'lucide-react';

import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import sarahJohnson from '../../assets/sarah-johnson.jpg';
import crisisCenterIcon from '../../assets/crisis-center-icon.png';
import { LiveSatelliteCrisisMap } from '../../components/maps/LiveSatelliteCrisisMap';

import { ReportsAnalyticsView } from "../reports-and-analysis/ReportsAnalyticsView";
import { OperationalMapView } from "../map/OperationalMapView";

import './DashboardOverviewPage.css';

const INITIAL_AUDIT_DATA = [
  {
    id: 'AUD-9021',
    timestamp: '10:25 AM',
    date: '2026-10-23',
    user: 'Amara Chen',
    userType: 'human',
    role: 'Coordinator',
    action: 'Priority Modified',
    entityId: 'REQ-01842',
    entityType: 'Assistance Request',
    aiRecommendation: 'HIGH',
    humanDecision: 'CRITICAL',
    status: 'APPROVED',
    notes: 'Pregnant household member confirmed. Road blockage verified by field team.',
    immutableHash: '0x8f2a49b21dc33e08...ba71',
    modelConfidence: '88.4%'
  },
  {
    id: 'AUD-9020',
    timestamp: '10:22 AM',
    date: '2026-10-23',
    user: 'AI Engine',
    userType: 'ai',
    role: 'AI System',
    action: 'Classification',
    entityId: 'REQ-01842',
    entityType: 'Assistance Request',
    aiRecommendation: 'Medical',
    humanDecision: 'Medical',
    status: 'ACCEPTED',
    notes: 'Automatic classification based on description analysis.',
    immutableHash: '0x3c71a9e884d12bb5...e41f',
    modelConfidence: '96.2%'
  },
  {
    id: 'AUD-9019',
    timestamp: '10:19 AM',
    date: '2026-10-23',
    user: 'Ravi Kumar',
    userType: 'human',
    role: 'Coordinator',
    action: 'Resource Allocated',
    entityId: 'REQ-01847',
    entityType: 'Inventory Dispatch',
    aiRecommendation: '80 units',
    humanDecision: '80 units',
    status: 'APPROVED',
    notes: 'Resource allocated per regional warehouse inventory thresholds.',
    immutableHash: '0x10b981d77a5e0192...99cf',
    modelConfidence: '91.0%'
  },
  {
    id: 'AUD-9018',
    timestamp: '10:14 AM',
    date: '2026-10-23',
    user: 'Amara Chen',
    userType: 'human',
    role: 'Coordinator',
    action: 'Volunteer Assigned',
    entityId: 'REQ-01862',
    entityType: 'Personnel Match',
    aiRecommendation: 'Dr. Priya Nair',
    humanDecision: 'Dr. Priya Nair',
    status: 'APPROVED',
    notes: 'Assigned specialist to emergency triage post.',
    immutableHash: '0x44fd712ea4c9019b...88aa',
    modelConfidence: '94.8%'
  },
  {
    id: 'AUD-9017',
    timestamp: '10:08 AM',
    date: '2026-10-23',
    user: 'System Core',
    userType: 'system',
    role: 'System',
    action: 'Shelter Allocated',
    entityId: 'REQ-01878',
    entityType: 'Shelter Unit',
    aiRecommendation: 'Colombo Central',
    humanDecision: 'Colombo Central',
    status: 'ACCEPTED',
    notes: 'Shelter occupancy verified and reservation committed.',
    immutableHash: '0x99e410b00c5a31e8...d309',
    modelConfidence: '99.1%'
  },
  {
    id: 'AUD-9016',
    timestamp: '09:55 AM',
    date: '2026-10-23',
    user: 'Priya Nair',
    userType: 'human',
    role: 'Coordinator',
    action: 'Request Rejected',
    entityId: 'REQ-01935',
    entityType: 'Assistance Request',
    aiRecommendation: 'MEDIUM',
    humanDecision: 'REJECTED',
    status: 'OVERRIDE',
    notes: 'Duplicate request identified. Linked to REQ-01842 from same household.',
    immutableHash: '0xef4444a19dc0981e...271c',
    modelConfidence: '72.5%'
  },
  {
    id: 'AUD-9015',
    timestamp: '09:42 AM',
    date: '2026-10-23',
    user: 'Amara Chen',
    userType: 'human',
    role: 'Admin',
    action: 'User Role Modified',
    entityId: 'USR-0042',
    entityType: 'User Permission',
    aiRecommendation: 'N/A',
    humanDecision: 'Coordinator',
    status: 'APPROVED',
    notes: 'User role escalated after verification of field credentials.',
    immutableHash: '0x7c3aeda4598110b9...fa51',
    modelConfidence: 'N/A'
  },
  {
    id: 'AUD-9014',
    timestamp: '09:30 AM',
    date: '2026-10-23',
    user: 'AI Engine',
    userType: 'ai',
    role: 'AI System',
    action: 'Priority Escalation',
    entityId: 'REQ-01890',
    entityType: 'Assistance Request',
    aiRecommendation: 'CRITICAL',
    humanDecision: 'CRITICAL',
    status: 'ACCEPTED',
    notes: 'Water levels threshold exceeded in sector 2.',
    immutableHash: '0x0284c718a22ec901...4411',
    modelConfidence: '95.7%'
  }
];

export const DashboardOverviewPage = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchVal, setSearchVal] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Western Province');

  // Audit Center specific states
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditFilter, setAuditFilter] = useState('ALL');
  const [selectedAuditLog, setSelectedAuditLog] = useState(INITIAL_AUDIT_DATA[0]);
  const [copiedHash, setCopiedHash] = useState(false);

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

  const filteredAuditData = useMemo(() => {
    return INITIAL_AUDIT_DATA.filter((log) => {
      const q = auditSearchQuery.toLowerCase();
      const matchSearch =
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q) ||
        log.role.toLowerCase().includes(q);

      if (!matchSearch) return false;
      if (auditFilter === 'OVERRIDE') return log.status === 'OVERRIDE';
      if (auditFilter === 'AI') return log.userType === 'ai';
      if (auditFilter === 'APPROVED') return log.status === 'APPROVED' || log.status === 'ACCEPTED';
      return true;
    });
  }, [auditSearchQuery, auditFilter]);

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const getHeaderTitle = () => {
    if (activeNav === 'reports') return 'Operations Intelligence';
    if (activeNav === 'audit') return 'Governance & Audit Center';
    if (activeNav === 'maps') return 'Operational GIS & Logistics Map';
    return 'Crisis Command Center';
  };

  const getHeaderSubtitle = () => {
    if (activeNav === 'reports') return 'Real-time insights to improve humanitarian response';
    if (activeNav === 'audit') return 'Cryptographically verifiable tracking of AI recommendations & decisions';
    if (activeNav === 'maps') return 'Geospatial service coverage, road routing, and proximity matching';
    return 'Real-time overview of humanitarian operations';
  };

  return (
    <div className="command-center-container">
      {/* 1. Left Sidebar Navigation */}
      <aside className="coord-sidebar">
        <div>
          <div className="coord-sidebar-brand">
            <Link to="/coordinator/dashboard" onClick={() => setActiveNav('dashboard')}>
              <img
                src={reliefcoreLogoWhite}
                alt="RELIEFCORE Humanitarian Operations"
                className="coord-brand-logo"
              />
            </Link>
          </div>

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

      {/* 2. Main Content */}
      <main className="coord-main-content">
        <header className="coord-top-header">
          <div className="header-brand-title-wrap">
            <img src={crisisCenterIcon} alt="Command Center" className="header-icon-box" />
            <div>
              <h1 className="header-title-text">{getHeaderTitle()}</h1>
              <p className="header-subtitle-text">{getHeaderSubtitle()}</p>
            </div>
          </div>

          {activeNav !== 'audit' && activeNav !== 'maps' && (
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
          )}

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
          {activeNav === 'reports' ? (
            <ReportsAnalyticsView />
          ) : activeNav === 'maps' ? (
            <OperationalMapView />
          ) : activeNav === 'audit' ? (
            <div className="audit-embedded-wrapper">
              <div className="audit-hero-banner">
                <div className="hero-banner-left">
                  <div className="hero-shield-icon">
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <h2 className="hero-banner-title">Transparent Operational Audit</h2>
                    <p className="hero-banner-subtitle">
                      Immutable history of all AI recommendations, human decisions, and system actions[cite: 3].
                    </p>
                  </div>
                </div>

                <div className="hero-banner-metrics">
                  <div className="hero-stat-block">
                    <span className="hero-stat-num stat-white">2,847</span>
                    <span className="hero-stat-tag">Total Records</span>
                  </div>
                  <div className="hero-stat-divider"></div>
                  <div className="hero-stat-block">
                    <span className="hero-stat-num stat-purple">1,284</span>
                    <span className="hero-stat-tag">AI Actions</span>
                  </div>
                  <div className="hero-stat-divider"></div>
                  <div className="hero-stat-block">
                    <span className="hero-stat-num stat-amber">423</span>
                    <span className="hero-stat-tag">Human Overrides</span>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="audit-toolbar-row">
                <div className="audit-search-field">
                  <Search size={15} className="audit-search-icon" />
                  <input
                    type="text"
                    placeholder="Search audit log by user, action, entity (e.g. REQ-01842)..."
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                  />
                  {auditSearchQuery && (
                    <button className="search-clear-btn" onClick={() => setAuditSearchQuery('')}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="audit-filter-pills">
                  <button
                    className={`filter-chip ${auditFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setAuditFilter('ALL')}
                  >
                    All Records
                  </button>
                  <button
                    className={`filter-chip ${auditFilter === 'OVERRIDE' ? 'active' : ''}`}
                    onClick={() => setAuditFilter('OVERRIDE')}
                  >
                    Overrides Only
                  </button>
                  <button
                    className={`filter-chip ${auditFilter === 'AI' ? 'active' : ''}`}
                    onClick={() => setAuditFilter('AI')}
                  >
                    AI Actions
                  </button>
                  <button
                    className={`filter-chip ${auditFilter === 'APPROVED' ? 'active' : ''}`}
                    onClick={() => setAuditFilter('APPROVED')}
                  >
                    Approved
                  </button>
                </div>
              </div>

              {/* Split Workspace */}
              <div className="audit-split-workspace">
                <div className="audit-table-card">
                  <div className="table-card-head">
                    <span className="table-count-label">
                      Showing <b>{filteredAuditData.length}</b> records
                    </span>
                    <span className="table-hint-text">Click any row to inspect details</span>
                  </div>

                  <div className="table-scroller">
                    <table className="audit-grid-table">
                      <thead>
                        <tr>
                          <th>TIMESTAMP</th>
                          <th>USER</th>
                          <th>ROLE</th>
                          <th>ACTION</th>
                          <th>ENTITY</th>
                          <th>AI RECOMMENDATION</th>
                          <th>HUMAN DECISION</th>
                          <th>STATUS</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAuditData.map((row) => {
                          const isSelected = selectedAuditLog?.id === row.id;
                          return (
                            <tr
                              key={row.id}
                              className={`audit-row ${isSelected ? 'row-active' : ''}`}
                              onClick={() => setSelectedAuditLog(row)}
                            >
                              <td className="cell-time">{row.timestamp}</td>
                              <td className="cell-user">
                                <div className="actor-badge-wrap">
                                  {row.userType === 'ai' ? (
                                    <Cpu size={14} className="actor-icon icon-ai" />
                                  ) : (
                                    <User size={14} className="actor-icon icon-human" />
                                  )}
                                  <span>{row.user}</span>
                                </div>
                              </td>
                              <td className="cell-role">{row.role}</td>
                              <td className="cell-action">{row.action}</td>
                              <td className="cell-entity">
                                <span className="entity-chip">{row.entityId}</span>
                              </td>
                              <td className="cell-ai-rec">
                                <span className="pill-ai">{row.aiRecommendation}</span>
                              </td>
                              <td className="cell-decision">
                                <span className="text-decision">{row.humanDecision}</span>
                              </td>
                              <td className="cell-status">
                                <span className={`status-pill status-${row.status.toLowerCase()}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="cell-chevron">
                                <ChevronRight size={14} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Side Inspection Drawer */}
                {selectedAuditLog && (
                  <aside className="audit-inspector-drawer">
                    <div className="drawer-header">
                      <div>
                        <h3 className="drawer-title">Audit Detail</h3>
                        <p className="drawer-subtitle">Record Reference: #{selectedAuditLog.id}</p>
                      </div>
                      <span className={`status-pill status-${selectedAuditLog.status.toLowerCase()}`}>
                        {selectedAuditLog.status}
                      </span>
                    </div>

                    <div className="drawer-content-scroll">
                      <div className="detail-meta-list">
                        <div className="meta-pair">
                          <span className="meta-label">TIMESTAMP</span>
                          <span className="meta-val">{selectedAuditLog.date} • {selectedAuditLog.timestamp}</span>
                        </div>

                        <div className="meta-pair">
                          <span className="meta-label">ENTITY</span>
                          <div className="entity-link-box">
                            <span className="entity-id-bold">{selectedAuditLog.entityId}</span>
                            <span className="entity-type-tag">({selectedAuditLog.entityType})</span>
                            <ExternalLink size={12} className="link-icon" />
                          </div>
                        </div>

                        <div className="meta-pair">
                          <span className="meta-label">ACTION</span>
                          <span className="meta-val font-semibold">{selectedAuditLog.action}</span>
                        </div>

                        <div className="meta-pair">
                          <span className="meta-label">USER</span>
                          <div className="actor-line">
                            <span className="meta-val">{selectedAuditLog.user}</span>
                            <span className="sub-role-pill">{selectedAuditLog.role}</span>
                          </div>
                        </div>
                      </div>

                      <div className="decision-diff-card">
                        <span className="diff-heading">DECISION COMPARISON</span>
                        <div className="diff-cols-grid">
                          <div className="diff-col col-ai">
                            <div className="diff-top">
                              <Cpu size={12} />
                              <span>AI RECOMMENDATION</span>
                            </div>
                            <div className="diff-value-box">{selectedAuditLog.aiRecommendation}</div>
                            <span className="diff-confidence">
                              Confidence: {selectedAuditLog.modelConfidence}
                            </span>
                          </div>

                          <div className="diff-col col-human">
                            <div className="diff-top">
                              <User size={12} />
                              <span>HUMAN DECISION</span>
                            </div>
                            <div className="diff-value-box highlight-human">
                              {selectedAuditLog.humanDecision}
                            </div>
                            <span className="diff-confidence text-teal">Recorded Action</span>
                          </div>
                        </div>
                      </div>

                      <div className="notes-section-box">
                        <span className="notes-header-tag">REASON / NOTES</span>
                        <p className="notes-text-body">{selectedAuditLog.notes}</p>
                      </div>

                      <div className="crypto-ledger-box">
                        <div className="ledger-top">
                          <ShieldCheck size={14} className="crypto-badge-icon" />
                          <span>CRYPTOGRAPHIC IMMUTABILITY</span>
                        </div>
                        <p className="ledger-desc">
                          This record is immutable and stored with a cryptographic hash for audit integrity[cite: 3].
                        </p>
                        <div className="hash-code-row">
                          <code className="hash-string">{selectedAuditLog.immutableHash}</code>
                          <button
                            className="copy-hash-btn"
                            title="Copy Hash"
                            onClick={() => handleCopyHash(selectedAuditLog.immutableHash)}
                          >
                            {copiedHash ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </aside>
                )}
              </div>
            </div>
          ) : (
            /* DEFAULT DASHBOARD VIEW */
            <>
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

              <div className="kpi-row-grid">
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

              <div className="map-and-requests-row">
                <div className="satellite-map-card">
                  <LiveSatelliteCrisisMap onProvinceChange={(prov) => setSelectedProvince(prov)} />
                </div>

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

              <div className="activity-util-decisions-row">
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

                  <svg className="chart-svg-container" viewBox="0 0 260 90" fill="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="25" y1="15" x2="255" y2="15" stroke="#f1f5f9" strokeDasharray="3 3" />
                    <line x1="25" y1="40" x2="255" y2="40" stroke="#f1f5f9" strokeDasharray="3 3" />
                    <line x1="25" y1="65" x2="255" y2="65" stroke="#f1f5f9" strokeDasharray="3 3" />
                    <text x="5" y="18" fill="#94a3b8" fontSize="8">150</text>
                    <text x="5" y="43" fill="#94a3b8" fontSize="8">100</text>
                    <text x="12" y="68" fill="#94a3b8" fontSize="8">50</text>
                    <text x="15" y="80" fill="#94a3b8" fontSize="8">0</text>
                    <path
                      d="M 35 65 L 65 52 L 100 48 L 135 40 L 170 38 L 205 24 L 240 18 L 240 75 L 35 75 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M 35 65 L 65 52 L 100 48 L 135 40 L 170 38 L 205 24 L 240 18"
                      stroke="#0ea5e9"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="35" cy="65" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                    <circle cx="65" cy="52" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                    <circle cx="100" cy="48" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                    <circle cx="135" cy="40" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                    <circle cx="170" cy="38" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                    <circle cx="205" cy="24" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                    <circle cx="240" cy="18" r="3" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                    <text x="30" y="88" fill="#94a3b8" fontSize="7.5">Mon</text>
                    <text x="62" y="88" fill="#94a3b8" fontSize="7.5">Tue</text>
                    <text x="96" y="88" fill="#94a3b8" fontSize="7.5">Wed</text>
                    <text x="131" y="88" fill="#94a3b8" fontSize="7.5">Thu</text>
                    <text x="168" y="88" fill="#94a3b8" fontSize="7.5">Fri</text>
                    <text x="201" y="88" fill="#94a3b8" fontSize="7.5">Sat</text>
                    <text x="234" y="88" fill="#94a3b8" fontSize="7.5">Sun</text>
                  </svg>
                </div>

                <div className="utilisation-card">
                  <h4 className="card-heading-text">Resource Utilisation</h4>

                  <div className="donuts-group">
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

              <div className="queue-and-alerts-row">
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

                <div className="alerts-card-box">
                  <div className="card-title-header">
                    <h3 className="card-heading-text">Emergency Alerts</h3>
                    <Link to="/coordinator/alerts" className="card-view-all-link">View All</Link>
                  </div>

                  <div className="alerts-list-col">
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};
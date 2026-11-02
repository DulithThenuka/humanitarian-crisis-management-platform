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
  ShieldCheck,
  Cpu,
  User,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  X
} from 'lucide-react';

import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import sarahJohnson from '../../assets/sarah-johnson.jpg';
import crisisCenterIcon from '../../assets/crisis-center-icon.png';

import './AuditCenterPage.css';

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
    notes: 'Automatic classification based on multi-lingual emergency keyword extraction.',
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
    notes: 'Ration packs approved per regional warehouse inventory thresholds.',
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
    notes: 'Closest active certified triage medic deployed to sector 4.',
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
    notes: 'Capacity reservation committed successfully to facility ledger.',
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
    notes: 'Duplicate request identified. Linked to REQ-01842 from the same primary household.',
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
    notes: 'Role escalated after supervisory ID check and field credential approval.',
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
    notes: 'Sensor telemetry indicated water rise beyond 1.2m threshold.',
    immutableHash: '0x0284c718a22ec901...4411',
    modelConfidence: '95.7%'
  }
];

export const AuditCenterPage = () => {
  const [activeNav, setActiveNav] = useState('audit');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(INITIAL_AUDIT_DATA[0]);
  const [copiedHash, setCopiedHash] = useState(false);

  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/coordinator/dashboard' },
    { id: 'crisis', label: 'Crisis Management', icon: AlertCircle, hasSub: true },
    { id: 'requests', label: 'Assistance Requests', icon: PlusSquare, hasSub: true },
    { id: 'resources', label: 'Resources', icon: Package, hasSub: true },
    { id: 'shelters', label: 'Shelters', icon: Building2, hasSub: true },
    { id: 'volunteers', label: 'Volunteers', icon: Users, hasSub: true },
    { id: 'donations', label: 'Donations', icon: Gift, hasSub: true },
    { id: 'ai-ops', label: 'AI Operations', icon: Brain, hasSub: true },
    { id: 'maps', label: 'Maps', icon: Compass, hasSub: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart },
    { id: 'audit', label: 'Audit Center', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const filteredLogs = useMemo(() => {
    return INITIAL_AUDIT_DATA.filter((log) => {
      const matchSearch =
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.role.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (activeFilter === 'OVERRIDE') return log.status === 'OVERRIDE';
      if (activeFilter === 'AI') return log.userType === 'ai';
      if (activeFilter === 'APPROVED') return log.status === 'APPROVED' || log.status === 'ACCEPTED';

      return true;
    });
  }, [searchQuery, activeFilter]);

  const copyHashToClipboard = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="audit-command-container">
      {/* 1. Left Sidebar Navigation */}
      <aside className="audit-sidebar">
        <div>
          <div className="audit-sidebar-brand">
            <Link to="/coordinator/dashboard">
              <img
                src={reliefcoreLogoWhite}
                alt="RELIEFCORE Humanitarian Operations"
                className="audit-brand-logo"
              />
            </Link>
          </div>

          <nav className="audit-sidebar-nav">
            {navMenuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeNav === item.id;
              return (
                <Link
                  to={item.path || '#'}
                  key={item.id}
                  className={`audit-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  <div className="audit-nav-left">
                    <IconComp size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && <span className="audit-nav-badge">{item.badge}</span>}
                  {item.hasSub && <ChevronRight size={13} color="#64748b" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="audit-sidebar-bottom">
          <div className="audit-user-card">
            <img src={sarahJohnson} alt="Sarah Johnson" className="audit-avatar-img" />
            <div>
              <div className="audit-user-name">Sarah Johnson</div>
              <div className="audit-user-role">Emergency Coordinator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="audit-main-content">
        {/* Top Header */}
        <header className="audit-top-header">
          <div className="header-brand-title-wrap">
            <img src={crisisCenterIcon} alt="Audit Center" className="header-icon-box" />
            <div>
              <h1 className="header-title-text">Governance & Audit Center</h1>
              <p className="header-subtitle-text">
                Cryptographically verifiable tracking of AI recommendations and decisions
              </p>
            </div>
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
        <div className="audit-body-padding">
          {/* Transparent Operational Audit Banner */}
          <div className="audit-hero-banner">
            <div className="hero-banner-left">
              <div className="hero-shield-icon">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h2 className="hero-banner-title">Transparent Operational Audit</h2>
                <p className="hero-banner-subtitle">
                  Immutable history of all AI recommendations, human decisions, and automated system actions.
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

          {/* Search and Filters Toolbar */}
          <div className="audit-toolbar-row">
            <div className="audit-search-field">
              <Search size={15} className="audit-search-icon" />
              <input
                type="text"
                placeholder="Search audit log by user, action, entity ID (e.g. REQ-01842)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="audit-filter-pills">
              <button
                className={`filter-chip ${activeFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveFilter('ALL')}
              >
                All Records
              </button>
              <button
                className={`filter-chip ${activeFilter === 'OVERRIDE' ? 'active' : ''}`}
                onClick={() => setActiveFilter('OVERRIDE')}
              >
                Overrides Only
              </button>
              <button
                className={`filter-chip ${activeFilter === 'AI' ? 'active' : ''}`}
                onClick={() => setActiveFilter('AI')}
              >
                AI Actions
              </button>
              <button
                className={`filter-chip ${activeFilter === 'APPROVED' ? 'active' : ''}`}
                onClick={() => setActiveFilter('APPROVED')}
              >
                Approved
              </button>
            </div>
          </div>

          {/* Master-Detail Split Workspace */}
          <div className="audit-split-workspace">
            {/* Table Master View */}
            <div className="audit-table-card">
              <div className="table-card-head">
                <span className="table-count-label">
                  Showing <b>{filteredLogs.length}</b> audit events
                </span>
                <span className="table-hint-text">Click any row to inspect verification details</span>
              </div>

              <div className="table-scroller">
                <table className="audit-grid-table">
                  <thead>
                    <tr>
                      <th>TIMESTAMP</th>
                      <th>ACTOR / USER</th>
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
                    {filteredLogs.map((log) => {
                      const isSelected = selectedRecord?.id === log.id;
                      return (
                        <tr
                          key={log.id}
                          className={`audit-row ${isSelected ? 'row-active' : ''}`}
                          onClick={() => setSelectedRecord(log)}
                        >
                          <td className="cell-time">{log.timestamp}</td>
                          <td className="cell-user">
                            <div className="actor-badge-wrap">
                              {log.userType === 'ai' ? (
                                <Cpu size={14} className="actor-icon icon-ai" />
                              ) : (
                                <User size={14} className="actor-icon icon-human" />
                              )}
                              <span>{log.user}</span>
                            </div>
                          </td>
                          <td className="cell-role">{log.role}</td>
                          <td className="cell-action">{log.action}</td>
                          <td className="cell-entity">
                            <span className="entity-chip">{log.entityId}</span>
                          </td>
                          <td className="cell-ai-rec">
                            <span className="pill-ai">{log.aiRecommendation}</span>
                          </td>
                          <td className="cell-decision">
                            <span className="text-decision">{log.humanDecision}</span>
                          </td>
                          <td className="cell-status">
                            <span className={`status-pill status-${log.status.toLowerCase()}`}>
                              {log.status}
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

            {/* Side Detail Inspection Drawer */}
            {selectedRecord && (
              <aside className="audit-inspector-drawer">
                <div className="drawer-header">
                  <div>
                    <h3 className="drawer-title">Audit Event Detail</h3>
                    <p className="drawer-subtitle">Record Reference: #{selectedRecord.id}</p>
                  </div>
                  <span className={`status-pill status-${selectedRecord.status.toLowerCase()}`}>
                    {selectedRecord.status}
                  </span>
                </div>

                <div className="drawer-content-scroll">
                  {/* Metadata List */}
                  <div className="detail-meta-list">
                    <div className="meta-pair">
                      <span className="meta-label">TIMESTAMP</span>
                      <span className="meta-val">{selectedRecord.date} • {selectedRecord.timestamp}</span>
                    </div>

                    <div className="meta-pair">
                      <span className="meta-label">TARGET ENTITY</span>
                      <div className="entity-link-box">
                        <span className="entity-id-bold">{selectedRecord.entityId}</span>
                        <span className="entity-type-tag">({selectedRecord.entityType})</span>
                        <ExternalLink size={12} className="link-icon" />
                      </div>
                    </div>

                    <div className="meta-pair">
                      <span className="meta-label">ACTION PERFORMED</span>
                      <span className="meta-val font-semibold">{selectedRecord.action}</span>
                    </div>

                    <div className="meta-pair">
                      <span className="meta-label">ACTOR</span>
                      <div className="actor-line">
                        <span className="meta-val">{selectedRecord.user}</span>
                        <span className="sub-role-pill">{selectedRecord.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI vs Human Decision Comparison */}
                  <div className="decision-diff-card">
                    <span className="diff-heading">DECISION COMPARISON</span>
                    <div className="diff-cols-grid">
                      <div className="diff-col col-ai">
                        <div className="diff-top">
                          <Cpu size={12} />
                          <span>AI RECOMMENDATION</span>
                        </div>
                        <div className="diff-value-box">{selectedRecord.aiRecommendation}</div>
                        <span className="diff-confidence">
                          Confidence: {selectedRecord.modelConfidence}
                        </span>
                      </div>

                      <div className="diff-col col-human">
                        <div className="diff-top">
                          <User size={12} />
                          <span>FINAL DECISION</span>
                        </div>
                        <div className="diff-value-box highlight-human">
                          {selectedRecord.humanDecision}
                        </div>
                        <span className="diff-confidence text-teal">Recorded Action</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason & Notes Field */}
                  <div className="notes-section-box">
                    <span className="notes-header-tag">REASON / AUDIT NOTES</span>
                    <p className="notes-text-body">{selectedRecord.notes}</p>
                  </div>

                  {/* Cryptographic Ledger Card */}
                  <div className="crypto-ledger-box">
                    <div className="ledger-top">
                      <ShieldCheck size={14} className="crypto-badge-icon" />
                      <span>CRYPTOGRAPHIC IMMUTABILITY</span>
                    </div>
                    <p className="ledger-desc">
                      Signed via ReliefCore SHA-256 node network. Stored in tamper-proof operational ledger.
                    </p>
                    <div className="hash-code-row">
                      <code className="hash-string">{selectedRecord.immutableHash}</code>
                      <button
                        className="copy-hash-btn"
                        title="Copy Hash"
                        onClick={() => copyHashToClipboard(selectedRecord.immutableHash)}
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
      </main>
    </div>
  );
};
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
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
  Radio, 
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
  X,
  Plus,
  GitMerge,
  ArrowUpRight,
  CheckCircle2,
  Building,
  Sparkles,
  Inbox
} from 'lucide-react';

import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import sarahJohnson from '../../assets/sarah-johnson.jpg';
import crisisCenterIcon from '../../assets/crisis-center-icon.png';
import { LiveSatelliteCrisisMap } from '../../components/maps/LiveSatelliteCrisisMap';

import { ReportsAnalyticsView } from "../reports-and-analysis/ReportsAnalyticsView";
import { OperationalMapView } from "../map/OperationalMapView";
import { AssistanceRequestDetailPage } from "./AssistanceRequestDetailPage";
import { AssistanceRequestsListView } from "./AssistanceRequestsListView";
import { ResourceInventoryPage } from "../logistics/ResourceInventoryPage";
import { ShelterDirectoryPage } from "../shelters/ShelterDirectoryPage";
import { VolunteerRosterPage } from "../volunteers/VolunteerRosterPage";
import { AllocationDispatchPage } from "../logistics/AllocationDispatchPage";
import { AIDecisionReviewPage } from "./AIDecisionReviewPage";

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
  }
];

export const DashboardOverviewPage = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState('requests');
  const [requestViewMode, setRequestViewMode] = useState('list');
  const [selectedRequestId, setSelectedRequestId] = useState('REQ-2026-01842');
  const [searchVal, setSearchVal] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Western Province');

  useEffect(() => {
    if (params.id) {
      setActiveNav('requests');
      setSelectedRequestId(params.id);
      setRequestViewMode('detail');
    } else if (location.pathname === '/coordinator/requests' || location.pathname === '/requests') {
      setActiveNav('requests');
      setRequestViewMode('list');
    } else if (location.pathname === '/map') {
      setActiveNav('maps');
    } else if (location.pathname === '/reports' || location.pathname === '/analytics') {
      setActiveNav('reports');
    } else if (location.pathname === '/logistics/inventory' || location.pathname === '/coordinator/resources') {
      setActiveNav('resources');
    } else if (location.pathname === '/shelters/directory' || location.pathname === '/coordinator/shelters') {
      setActiveNav('shelters');
    } else if (location.pathname === '/volunteers/roster' || location.pathname === '/coordinator/volunteers') {
      setActiveNav('volunteers');
    } else if (location.pathname === '/logistics/dispatch' || location.pathname === '/coordinator/dispatch') {
      setActiveNav('donations');
    } else if (location.pathname === '/coordinator/ai-review' || location.pathname === '/coordinator/ai-ops') {
      setActiveNav('ai-ops');
    } else if (location.pathname === '/coordinator/dashboard') {
      setActiveNav('dashboard');
    }
  }, [location.pathname, params.id]);

  const handleNavClick = (itemId) => {
    if (itemId === 'requests') {
      setActiveNav('requests');
      setRequestViewMode('list');
    } else {
      setActiveNav(itemId);
    }
  };

  // Crisis Creation Modal State
  const [showCreateCrisisModal, setShowCreateCrisisModal] = useState(false);
  const [newCrisisData, setNewCrisisData] = useState({
    title: '',
    province: 'Western Province',
    severity: 'Critical',
    operationalArea: 'Kelani River Basin Sector 3'
  });

  // Table Selection & Batch Actions State
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [activeAIRationale, setActiveAIRationale] = useState(null);

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
      aiConfidence: 'Very High',
      aiRationale: 'Telemetry shows rising flood water (1.4m) + pregnant resident trapped on upper terrace.',
      status: 'Under Review',
      assignedTo: 'Unassigned',
      created: '2 min ago',
      slaStatus: 'On Track'
    },
    {
      id: 'REQ-2026-01877',
      category: 'Shelter',
      location: 'Gampaha',
      priority: 'High',
      aiScore: '87%',
      aiConfidence: 'High',
      aiRationale: 'Displaced family of 6 with 2 infants; nearest shelter currently has 15 available beds.',
      status: 'Assigned',
      assignedTo: 'Team Alpha',
      created: '42 min ago',
      slaStatus: 'Overdue (SLA Breached)'
    },
    {
      id: 'REQ-2026-01835',
      category: 'Food',
      location: 'Kalutara',
      priority: 'High',
      aiScore: '82%',
      aiConfidence: 'High',
      aiRationale: 'Cut-off community sector 4 without drinking water for >18 hours.',
      status: 'Pending',
      assignedTo: 'Unassigned',
      created: '8 min ago',
      slaStatus: 'On Track'
    },
    {
      id: 'REQ-2026-01628',
      category: 'Transport',
      location: 'Negombo',
      priority: 'Medium',
      aiScore: '76%',
      aiConfidence: 'Moderate',
      aiRationale: 'Road A1 obstruction; evacuation route requires off-road 4WD transport.',
      status: 'Under Review',
      assignedTo: 'Team Bravo',
      created: '12 min ago',
      slaStatus: 'On Track'
    },
    {
      id: 'REQ-2026-01821',
      category: 'Evacuation',
      location: 'Kalutara',
      priority: 'Medium',
      aiScore: '62%',
      aiConfidence: 'Moderate',
      aiRationale: 'Precautionary evacuation request for low-risk elevation zone.',
      status: 'Assigned',
      assignedTo: 'Team Alpha',
      created: '58 min ago',
      slaStatus: 'Overdue (SLA Breached)'
    }
  ];

  const partnerOrganisations = [
    { name: 'Sri Lanka Red Cross', status: 'Deployed', personnel: 42, units: '12 Ambulances' },
    { name: 'Disaster Management Centre (DMC)', status: 'Active HQ', personnel: 28, units: 'Western Command' },
    { name: 'Tri-Forces Rescue Brigade', status: 'In Transit', personnel: 95, units: '6 Inflatable Boats' },
    { name: 'Sarvodaya Relief Foundation', status: 'Staged', personnel: 34, units: '5,000 Food Packs' }
  ];

  const handleSelectAllQueue = (e) => {
    if (e.target.checked) {
      setSelectedQueueIds(priorityQueueData.map(r => r.id));
    } else {
      setSelectedQueueIds([]);
    }
  };

  const handleToggleSelectRow = (id) => {
    setSelectedQueueIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBatchAction = (action) => {
    alert(`Batch Action executed: [${action.toUpperCase()}] for ${selectedQueueIds.length} request(s): ${selectedQueueIds.join(', ')}`);
    setSelectedQueueIds([]);
  };

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
    if (activeNav === 'resources') return 'Resource Inventory & Logistics';
    if (activeNav === 'shelters') return 'Shelter Directory & Capacity';
    if (activeNav === 'volunteers') return 'Volunteer Operations Roster';
    if (activeNav === 'donations') return 'Supply Dispatch & Allocation';
    if (activeNav === 'ai-ops') return 'AI Decision Review & Governance';
    if (activeNav === 'crisis') return 'Crisis Event Management';
    if (activeNav === 'notifications') return 'Operational Notifications';
    if (activeNav === 'settings') return 'Platform Configuration & Settings';
    return 'Crisis Command Center';
  };

  const getHeaderSubtitle = () => {
    if (activeNav === 'reports') return 'Real-time insights to improve humanitarian response';
    if (activeNav === 'audit') return 'Cryptographically verifiable tracking of AI recommendations & decisions';
    if (activeNav === 'maps') return 'Geospatial service coverage, road routing, and proximity matching';
    if (activeNav === 'resources') return 'Regional warehouse stockpiles, provisions, water, and pharmaceuticals';
    if (activeNav === 'shelters') return 'Evacuation centers, shelter capacity, and occupancy monitoring';
    if (activeNav === 'volunteers') return 'Certified field responders, skill sets, and deployment schedules';
    if (activeNav === 'donations') return 'Multi-constraint relief dispatch and convoy distribution';
    if (activeNav === 'ai-ops') return 'Human-in-the-loop review board for automated AI incident scoring';
    if (activeNav === 'crisis') return 'Active incident declarations, hazard zones, and severity triage';
    if (activeNav === 'notifications') return 'Urgent incident dispatch pings and SLA breach alerts';
    if (activeNav === 'settings') return 'System parameters, governance rules, and API connections';
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
                  onClick={() => handleNavClick(item.id)}
                >
                  <div className="coord-nav-left">
                    <IconComp size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && <span className="coord-nav-badge">{item.badge}</span>}
                  {item.hasSub && !isActive && <ChevronRight size={13} color="#64748b" />}
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
          {activeNav === 'requests' ? (
            requestViewMode === 'detail' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span style={{ color: '#0d9488', display: 'flex', alignItems: 'center' }}>
                  <Inbox size={15} />
                </span>
                <span 
                  style={{ color: '#64748b', fontWeight: 500, cursor: 'pointer' }}
                  onClick={() => setRequestViewMode('list')}
                >
                  Assistance Requests
                </span>
                <span style={{ color: '#94a3b8', fontSize: '11px' }}>&gt;</span>
                <span style={{ color: '#475569', fontWeight: 600 }}>{selectedRequestId}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="13" stroke="#0e6f76" strokeWidth="2.5" />
                    <path d="M12 12C12 9.79 13.79 8 16 8C18.21 8 20 9.79 20 12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="16" cy="16" r="3" fill="#0284c7" />
                    <path d="M10 22C11 19 13.5 18 16 18C18.5 18 21 19 22 22" stroke="#0e6f76" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h1 className="header-title-text" style={{ fontSize: '17px', fontWeight: 800 }}>Assistance Requests</h1>
                  <p className="header-subtitle-text" style={{ fontSize: '11px' }}>Manage, review and coordinate all emergency assistance requests</p>
                </div>
              </div>
            )
          ) : (
            <div className="header-brand-title-wrap">
              <img src={crisisCenterIcon} alt="Command Center" className="header-icon-box" />
              <div>
                <h1 className="header-title-text">{getHeaderTitle()}</h1>
                <p className="header-subtitle-text">{getHeaderSubtitle()}</p>
              </div>
            </div>
          )}

          {activeNav === 'dashboard' && (
            <div className="header-crisis-action-wrap">
              <button 
                className="header-create-crisis-btn"
                onClick={() => setShowCreateCrisisModal(true)}
              >
                <Plus size={14} />
                <span>+ New Crisis Event</span>
              </button>
            </div>
          )}

          {activeNav !== 'audit' && activeNav !== 'maps' && (
            <div className="header-center-search">
              <Search size={14} className="header-search-icon" />
              <input
                type="text"
                placeholder={activeNav === 'requests' && requestViewMode === 'list' ? "Search requests by ID, location, category..." : "Search requests, locations, resources..."}
                className="header-search-input"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>
          )}

          <div className="header-right-tools">
            <button className="header-bell-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="header-bell-dot">{activeNav === 'requests' && requestViewMode === 'detail' ? '1' : '3'}</span>
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
        <div className={`coord-body-padding ${activeNav === 'maps' ? 'maps-full-dock' : ''} ${activeNav === 'requests' ? 'requests-full-dock' : ''}`}>
          {activeNav === 'requests' ? (
            requestViewMode === 'detail' ? (
              <AssistanceRequestDetailPage 
                isEmbedded={true}
                requestId={selectedRequestId}
                onNavigateTab={(tab) => {
                  if (!tab || tab === 'list' || tab === 'requests') {
                    setRequestViewMode('list');
                  } else {
                    setActiveNav(tab);
                  }
                }}
                onOpenMap={() => setActiveNav('maps')}
              />
            ) : (
              <AssistanceRequestsListView 
                isEmbedded={true}
                onSelectFullDetail={(id) => {
                  setSelectedRequestId(id);
                  setRequestViewMode('detail');
                }}
                onOpenMap={() => setActiveNav('maps')}
              />
            )
          ) : activeNav === 'reports' ? (
            <ReportsAnalyticsView />
          ) : activeNav === 'maps' ? (
            <OperationalMapView />
          ) : activeNav === 'resources' ? (
            <ResourceInventoryPage />
          ) : activeNav === 'shelters' ? (
            <ShelterDirectoryPage />
          ) : activeNav === 'volunteers' ? (
            <VolunteerRosterPage />
          ) : activeNav === 'donations' ? (
            <AllocationDispatchPage />
          ) : activeNav === 'ai-ops' ? (
            <AIDecisionReviewPage />
          ) : activeNav === 'crisis' ? (
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Active Crisis Management</h2>
                  <p style={{ color: '#94a3b8', fontSize: '12.5px', marginTop: '4px' }}>Coordinated disaster response operations across monitored provinces.</p>
                </div>
                <button 
                  onClick={() => setShowCreateCrisisModal(true)}
                  style={{ background: '#0e6f76', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  + Declare New Crisis Event
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '12px' }}>LEVEL 4 CRITICAL</span>
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>Kelani River Basin Sector 3</span>
                  </div>
                  <h3 style={{ color: '#f8fafc', fontSize: '15px', margin: '0 0 8px 0' }}>Flood Response - Western Province</h3>
                  <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.4 }}>Rapid inundation affecting Colombo and Gampaha lowlands. Evacuation routes active.</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => setActiveNav('maps')} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}>View on Map</button>
                    <button onClick={() => { setActiveNav('requests'); setRequestViewMode('list'); }} style={{ background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}>View 186 Requests</button>
                  </div>
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#f97316', fontWeight: 700, fontSize: '12px' }}>LEVEL 2 MODERATE</span>
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>Southern Coastal Belt</span>
                  </div>
                  <h3 style={{ color: '#f8fafc', fontSize: '15px', margin: '0 0 8px 0' }}>Coastal Surge - Southern Province</h3>
                  <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.4 }}>High tide warnings in Galle and Matara districts. Fisherfolk pre-evacuation staged.</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => setActiveNav('maps')} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}>View on Map</button>
                    <button onClick={() => setActiveNav('shelters')} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}>Check Shelters</button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeNav === 'notifications' ? (
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>Operational Notifications & Alerts (3 Unread)</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#0f172a', borderLeft: '4px solid #ef4444', padding: '14px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>CRITICAL INCIDENT</span>
                    <span>2 min ago</span>
                  </div>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px', marginTop: '4px' }}>Request #REQ-2026-01842 requires urgent medical team dispatch</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>Trapped resident on upper terrace with medical emergency in Kelani Flood Zone.</div>
                  <button onClick={() => { setSelectedRequestId('REQ-2026-01842'); setRequestViewMode('detail'); setActiveNav('requests'); }} style={{ background: '#0e6f76', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', marginTop: '8px' }}>Open Request</button>
                </div>
                <div style={{ background: '#0f172a', borderLeft: '4px solid #f97316', padding: '14px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8' }}>
                    <span style={{ color: '#f97316', fontWeight: 700 }}>SLA BREACH ALERT</span>
                    <span>14 min ago</span>
                  </div>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px', marginTop: '4px' }}>Shelter allocation overdue in Gampaha District Zone B</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>Family of 6 awaiting shelter unit dispatch. Response threshold exceeded.</div>
                  <button onClick={() => setActiveNav('shelters')} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', marginTop: '8px' }}>View Shelters</button>
                </div>
                <div style={{ background: '#0f172a', borderLeft: '4px solid #0284c7', padding: '14px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8' }}>
                    <span style={{ color: '#0284c7', fontWeight: 700 }}>INVENTORY NOTICE</span>
                    <span>42 min ago</span>
                  </div>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px', marginTop: '4px' }}>Drinking water supplies below minimum safety threshold at Kandy Depot</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>Current stock: 400 bottles (Threshold: 1,000). Automated restock requisition staged.</div>
                  <button onClick={() => setActiveNav('resources')} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', marginTop: '8px' }}>Check Inventory</button>
                </div>
              </div>
            </div>
          ) : activeNav === 'settings' ? (
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>Platform Operations & Dispatch Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
                <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px' }}>AI Auto-Triage Threshold</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>Requests scoring above 90% confidence automatically flag for priority dispatch.</div>
                  <input type="range" min="70" max="95" defaultValue="90" style={{ width: '100%', marginTop: '10px', accentColor: '#0e6f76' }} />
                </div>
                <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px' }}>Cryptographic Governance Logging</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>SHA-256 block auditing enabled for all triage and override decisions.</div>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: '12px', marginTop: '6px' }}>Status: ACTIVE & VERIFIED</div>
                </div>
              </div>
            </div>
          ) : activeNav === 'audit' ? (
            /* AUDIT LOGS VIEW */
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

              <div className="audit-toolbar-row">
                <div className="audit-search-field">
                  <Search size={15} className="audit-search-icon" />
                  <input
                    type="text"
                    placeholder="Search audit log by user, action, entity..."
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
                        <div className="hash-code-row">
                          <code className="hash-string">{selectedAuditLog.immutableHash}</code>
                          <button
                            className="copy-hash-btn"
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
            /* =========================================================
               DEFAULT COMMAND CENTER DASHBOARD (100% COMPLETE SECTION B)
               ========================================================= */
            <>
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

                <div className="live-op-right-tools">
                  <span className="overdue-counter-pill">
                    <AlertTriangle size={12} />
                    <strong>2 Cases Overdue SLA</strong>
                  </span>
                  <span 
                    className="live-op-link"
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setActiveNav('requests'); setRequestViewMode('list'); }}
                  >
                    <span>View Operational Details</span>
                    <ChevronRight size={13} />
                  </span>
                </div>
              </div>

              {/* Row of 6 KPI Stat Cards */}
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

                <div 
                  className="kpi-stat-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => { setActiveNav('requests'); setRequestViewMode('list'); }}
                >
                  <div className="kpi-card-top">
                    <div className="kpi-icon-box" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                      <ClipboardList size={14} />
                    </div>
                    <span className="kpi-label-text">Open Requests</span>
                  </div>
                  <div className="kpi-value-text">186</div>
                  <span className="kpi-sub-trend trend-red">↑ +12%</span>
                </div>

                <div 
                  className="kpi-stat-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => { setActiveNav('requests'); setRequestViewMode('list'); }}
                >
                  <div className="kpi-card-top">
                    <div className="kpi-icon-box" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                      <AlertTriangle size={14} />
                    </div>
                    <span className="kpi-label-text">High Priority</span>
                  </div>
                  <div className="kpi-value-text">42</div>
                  <span className="kpi-sub-trend trend-red">↑ +7</span>
                </div>

                <div 
                  className="kpi-stat-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/logistics/inventory')}
                >
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

                <div 
                  className="kpi-stat-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/shelters/directory')}
                >
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

                <div 
                  className="kpi-stat-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/coordinator/ai-review')}
                >
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

              {/* Middle Row 1: Crisis Map + Critical Requests */}
              <div className="map-and-requests-row">
                <div className="satellite-map-card">
                  <LiveSatelliteCrisisMap onProvinceChange={(prov) => setSelectedProvince(prov)} />
                </div>

                <div className="critical-requests-card">
                  <div className="card-title-header">
                    <h3 className="card-heading-text">Critical Requests</h3>
                    <span 
                      style={{ cursor: 'pointer' }}
                      onClick={() => { setActiveNav('requests'); setRequestViewMode('list'); }}
                      className="card-view-all-link"
                    >
                      View All
                    </span>
                  </div>

                  <div className="critical-list">
                    {criticalRequests.map((req) => (
                      <div 
                        key={req.id} 
                        className="critical-item-row"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedRequestId(req.id);
                          setRequestViewMode('detail');
                          setActiveNav('requests');
                        }}
                      >
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
                {/* Request Activity Chart */}
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
                    <path
                      d="M 35 65 L 65 52 L 100 48 L 135 40 L 170 38 L 205 24 L 240 18 L 240 75 L 35 75 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M 35 65 L 65 52 L 100 48 L 135 40 L 170 38 L 205 24 L 240 18"
                      stroke="#0ea5e9"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Resource Utilisation Donuts */}
                <div className="utilisation-card">
                  <h4 className="card-heading-text">Resource Utilisation</h4>
                  <div className="donuts-group">
                    <div className="donut-stat-item">
                      <div className="donut-circle-wrap">
                        <span className="donut-pct-text">78%</span>
                      </div>
                      <span className="donut-label-text">Food</span>
                    </div>
                    <div className="donut-stat-item">
                      <div className="donut-circle-wrap">
                        <span className="donut-pct-text">64%</span>
                      </div>
                      <span className="donut-label-text">Medical</span>
                    </div>
                    <div className="donut-stat-item">
                      <div className="donut-circle-wrap">
                        <span className="donut-pct-text">52%</span>
                      </div>
                      <span className="donut-label-text">Vehicles</span>
                    </div>
                    <div className="donut-stat-item">
                      <div className="donut-circle-wrap">
                        <span className="donut-pct-text">89%</span>
                      </div>
                      <span className="donut-label-text">Shelter</span>
                    </div>
                  </div>
                </div>

                {/* Recent Decisions Audit Trail */}
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
                  </div>
                </div>
              </div>

              {/* Middle Row 3: Partner Organisation Coordination Widget (Section B.6) */}
              <div className="partner-orgs-row-card">
                <div className="partner-orgs-header">
                  <div className="orgs-header-left">
                    <Building size={16} className="text-teal" />
                    <h3 className="card-heading-text">Partner Organisations Coordination</h3>
                  </div>
                  <span className="active-agencies-badge">4 Agencies Deployed in Operational Area</span>
                </div>

                <div className="partner-grid-cards">
                  {partnerOrganisations.map((org) => (
                    <div key={org.name} className="partner-item-card">
                      <div className="p-card-top">
                        <strong className="p-org-name">{org.name}</strong>
                        <span className="p-status-pill">{org.status}</span>
                      </div>
                      <div className="p-card-meta">
                        <span>Personnel: <strong>{org.personnel} Active</strong></span>
                        <span>Equipment: <strong>{org.units}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Priority Request Queue Table (With AI Rationale + SLA Tracker) */}
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
                          <input 
                            type="checkbox" 
                            checked={selectedQueueIds.length === priorityQueueData.length}
                            onChange={handleSelectAllQueue}
                            style={{ accentColor: '#0f766e' }} 
                          />
                        </th>
                        <th>Request ID</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Priority</th>
                        <th>AI Score & Rationale</th>
                        <th>SLA Status</th>
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
                            <input 
                              type="checkbox" 
                              checked={selectedQueueIds.includes(row.id)}
                              onChange={() => handleToggleSelectRow(row.id)}
                              style={{ accentColor: '#0f766e' }} 
                            />
                          </td>
                          <td 
                            className="req-table-id"
                            style={{ cursor: 'pointer', color: '#0284c7' }}
                            onClick={() => {
                              setSelectedRequestId(row.id);
                              setRequestViewMode('detail');
                              setActiveNav('requests');
                            }}
                          >
                            {row.id}
                          </td>
                          <td>{row.category}</td>
                          <td>{row.location}</td>
                          <td>
                            <span className={`crit-priority-pill priority-${row.priority.toLowerCase()}`}>
                              {row.priority}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="ai-score-interactive-btn"
                              onClick={() => setActiveAIRationale(row)}
                              title="Click to view AI reasoning rationale"
                            >
                              <Sparkles size={11} className="sparkle-icon" />
                              <span>{row.aiScore}</span>
                            </button>
                          </td>
                          <td>
                            <span className={`sla-badge ${row.slaStatus.includes('Overdue') ? 'sla-breach' : 'sla-ok'}`}>
                              {row.slaStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`table-status-pill status-${row.status.toLowerCase().replace(' ', '-')}`}>
                              {row.status}
                            </span>
                          </td>
                          <td>{row.assignedTo}</td>
                          <td style={{ color: '#94a3b8' }}>{row.created}</td>
                          <td>
                            <div className="table-actions-cell">
                              <button 
                                className="action-icon-btn" 
                                title="View Details"
                                onClick={() => {
                                  setSelectedRequestId(row.id);
                                  setRequestViewMode('detail');
                                  setActiveNav('requests');
                                }}
                              >
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

                {/* Emergency Alerts Column */}
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
                      <p className="alert-p-text">Heavy rainfall expected in Western Province next 24 hours.</p>
                      <span className="alert-time-sm">2 hours ago</span>
                    </div>

                    <div className="alert-entry-card alert-entry-amber">
                      <div className="alert-entry-head">
                        <AlertCircle size={13} color="#d97706" />
                        <span className="alert-title-strong" style={{ color: '#d97706' }}>Road Closure</span>
                      </div>
                      <p className="alert-p-text">Main road A1 closed due to landslide near Gampaha.</p>
                      <span className="alert-time-sm">4 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Batch Actions Bar (Section B.3) */}
              {selectedQueueIds.length > 0 && (
                <div className="floating-batch-toolbar">
                  <div className="batch-toolbar-left">
                    <CheckCircle2 size={16} className="text-teal" />
                    <span>Selected <strong>{selectedQueueIds.length}</strong> request cases</span>
                  </div>

                  <div className="batch-toolbar-actions">
                    <button className="batch-btn btn-escalate" onClick={() => handleBatchAction('Escalate')}>
                      <AlertTriangle size={13} />
                      <span>Escalate Priority</span>
                    </button>
                    <button className="batch-btn btn-assign" onClick={() => handleBatchAction('Assign Team')}>
                      <UserCheck size={13} />
                      <span>Assign Team</span>
                    </button>
                    <button className="batch-btn btn-merge" onClick={() => handleBatchAction('Merge Cases')}>
                      <GitMerge size={13} />
                      <span>Merge Duplicates</span>
                    </button>
                    <button className="batch-btn btn-close" onClick={() => handleBatchAction('Close Cases')}>
                      <Check size={13} />
                      <span>Close Case</span>
                    </button>
                  </div>
                </div>
              )}

              {/* AI Rationale Inspector Popover (Section B.4) */}
              {activeAIRationale && (
                <div className="ai-rationale-modal-backdrop" onClick={() => setActiveAIRationale(null)}>
                  <div className="ai-rationale-popover-card" onClick={(e) => e.stopPropagation()}>
                    <div className="ai-popover-header">
                      <div className="ai-pop-title">
                        <Brain size={16} className="text-purple" />
                        <h4>AI Urgency & Recommendation Rationale</h4>
                      </div>
                      <button className="popover-close-btn" onClick={() => setActiveAIRationale(null)}>
                        <X size={14} />
                      </button>
                    </div>

                    <div className="ai-popover-content">
                      <div className="ai-stat-row">
                        <span>Target Entity: <strong>{activeAIRationale.id}</strong></span>
                        <span>Confidence: <strong className="text-teal">{activeAIRationale.aiConfidence} ({activeAIRationale.aiScore})</strong></span>
                      </div>

                      <div className="ai-rationale-box">
                        <span className="rationale-label">SUPPORTING REASONING:</span>
                        <p>{activeAIRationale.aiRationale}</p>
                      </div>

                      <div className="ai-meta-pills">
                        <span>Model: ReliefCore-BioAlert-v3.2</span>
                        <span>Source: Telemetry + NLP Form Analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Crisis Event Modal (Section B.1) */}
              {showCreateCrisisModal && (
                <div className="crisis-modal-overlay" onClick={() => setShowCreateCrisisModal(false)}>
                  <div className="crisis-modal-box" onClick={(e) => e.stopPropagation()}>
                    <div className="crisis-modal-head">
                      <h3>Create New Crisis Event & Operational Area</h3>
                      <button className="modal-close-x" onClick={() => setShowCreateCrisisModal(false)}>
                        <X size={16} />
                      </button>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        alert(`New Crisis Event "${newCrisisData.title}" created successfully in ${newCrisisData.province}!`);
                        setShowCreateCrisisModal(false);
                      }}
                      className="crisis-create-form"
                    >
                      <div className="form-group-item">
                        <label>Crisis Event Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Cyclone Relief Operation - Eastern Zone" 
                          required 
                          value={newCrisisData.title}
                          onChange={(e) => setNewCrisisData({ ...newCrisisData, title: e.target.value })}
                        />
                      </div>

                      <div className="form-group-item">
                        <label>Province / Region</label>
                        <select 
                          value={newCrisisData.province}
                          onChange={(e) => setNewCrisisData({ ...newCrisisData, province: e.target.value })}
                        >
                          <option value="Western Province">Western Province</option>
                          <option value="Southern Province">Southern Province</option>
                          <option value="Eastern Province">Eastern Province</option>
                          <option value="Central Province">Central Province</option>
                        </select>
                      </div>

                      <div className="form-group-item">
                        <label>Severity Level</label>
                        <select 
                          value={newCrisisData.severity}
                          onChange={(e) => setNewCrisisData({ ...newCrisisData, severity: e.target.value })}
                        >
                          <option value="Critical">Critical (Level 1 Disaster)</option>
                          <option value="High">High (Level 2 Disaster)</option>
                          <option value="Moderate">Moderate (Regional Emergency)</option>
                        </select>
                      </div>

                      <div className="form-group-item">
                        <label>Designated Operational Area</label>
                        <input 
                          type="text" 
                          placeholder="Define geographic operational zone..."
                          value={newCrisisData.operationalArea}
                          onChange={(e) => setNewCrisisData({ ...newCrisisData, operationalArea: e.target.value })}
                        />
                      </div>

                      <div className="modal-actions-footer">
                        <button type="button" className="btn-cancel" onClick={() => setShowCreateCrisisModal(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-save-crisis">
                          Launch Operation
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

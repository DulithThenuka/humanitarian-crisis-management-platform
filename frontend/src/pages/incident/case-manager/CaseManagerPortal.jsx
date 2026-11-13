import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Shield, 
  ShieldCheck, 
  LayoutDashboard, 
  Briefcase, 
  Sparkles, 
  Send, 
  BarChart2, 
  UserCheck, 
  Search, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  X,
  AlertCircle
} from 'lucide-react';

import { 
  CASE_MANAGER_USER, 
  INITIAL_CASES_LIST 
} from './caseManagerData';

import { useAuth } from '../../../context/AuthContext';
import { incidentService, normalizeIncidentForUI } from '../../../services/incidentService';

import { CaseDashboardView } from './CaseDashboardView';
import { CaseManagementView } from './CaseManagementView';
import { AIAssistedReviewView } from './AIAssistedReviewView';
import { CaseCommunicationView } from './CaseCommunicationView';
import { CaseReportsView } from './CaseReportsView';
import { CasePermissionsProfileView } from './CasePermissionsProfileView';

import './CaseManager.css';

export const CaseManagerPortal = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [dutyActive, setDutyActive] = useState(true);
  const [activeOperation, setActiveOperation] = useState(CASE_MANAGER_USER.activeOperation);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Live API state
  const [casesList, setCasesList] = useState([]);
  const [myAssignedCases, setMyAssignedCases] = useState([]);
  const [unassignedCases, setUnassignedCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('HMR-1042');
  const [selectedCaseDetail, setSelectedCaseDetail] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [apiOfflineError, setApiOfflineError] = useState(false);
  
  // Toast Alert HUD
  const [toast, setToast] = useState(null);

  const activeUser = {
    ...CASE_MANAGER_USER,
    name: user?.fullName || user?.name || CASE_MANAGER_USER.name,
    initials: user?.initials || CASE_MANAGER_USER.initials,
    role:
      user?.role === 'CaseManager'
        ? 'Incident / Case Manager'
        : user?.role || CASE_MANAGER_USER.role,
    shortRole: user?.role || CASE_MANAGER_USER.shortRole,
    email: user?.email || ''
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 3800);
  }, []);

  const fetchCaseById = useCallback(async (caseId) => {
    if (!caseId || !isAuthenticated) return null;
    try {
      const detailRes = await incidentService.getById(caseId);
      const rawDetail = detailRes?.data || detailRes;
      if (rawDetail && (rawDetail.id || rawDetail.caseNumber)) {
        const normalized = normalizeIncidentForUI(rawDetail);
        setSelectedCaseDetail(normalized);
        setCasesList((prev) =>
          prev.some((c) => c.id === normalized.id)
            ? prev.map((c) => (c.id === normalized.id ? normalized : c))
            : prev
        );
        return normalized;
      }
    } catch {
      // Retain existing list item if individual fetch fails
    }
    return null;
  }, [isAuthenticated]);

  const fetchCasesAndDashboard = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingApi(true);
    try {
      const [dashRes, incidentsRes, myAssignedRes, unassignedRes] = await Promise.all([
        incidentService.getDashboard(),
        incidentService.getAll(),
        incidentService.getMyAssigned(),
        incidentService.getUnassigned()
      ]);

      let loadedLive = false;

      const rawDash = dashRes?.data || dashRes;
      if (rawDash && rawDash.metrics) {
        setDashboardData(rawDash);
        loadedLive = true;
      }

      const rawList = incidentsRes?.data || incidentsRes;
      let initialTargetCaseId = 'HMR-1042';
      if (Array.isArray(rawList)) {
        const mapped = rawList.map(normalizeIncidentForUI).filter(Boolean);
        setCasesList(mapped);
        if (mapped.length > 0) {
          const preferred = mapped.find((c) => c.id === 'HMR-1042') || mapped[0];
          initialTargetCaseId = preferred.id;
          setSelectedCaseId((prev) => (mapped.some((c) => c.id === prev) ? prev : preferred.id));
        }
        loadedLive = true;
      }

      const rawMyAssigned = myAssignedRes?.data || myAssignedRes;
      if (Array.isArray(rawMyAssigned)) {
        setMyAssignedCases(rawMyAssigned.map(normalizeIncidentForUI).filter(Boolean));
        loadedLive = true;
      }

      const rawUnassigned = unassignedRes?.data || unassignedRes;
      if (Array.isArray(rawUnassigned)) {
        setUnassignedCases(rawUnassigned.map(normalizeIncidentForUI).filter(Boolean));
        loadedLive = true;
      }

      if (loadedLive) {
        setIsLiveApi(true);
        setApiOfflineError(false);
        await fetchCaseById(initialTargetCaseId);
      }
    } catch (err) {
      // If 401 occurred, apiClient clears auth and redirects to /login
      if (err?.status === 401) return;
      setCasesList((prev) => (prev.length > 0 ? prev : INITIAL_CASES_LIST));
      setIsLiveApi(false);
      setApiOfflineError(true);
    } finally {
      setIsLoadingApi(false);
    }
  }, [isAuthenticated, fetchCaseById]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCasesAndDashboard();
    }
  }, [isAuthenticated, fetchCasesAndDashboard]);

  const handleSelectCase = useCallback(
    (caseId) => {
      setSelectedCaseId(caseId);
      fetchCaseById(caseId);
    },
    [fetchCaseById]
  );

  const handleRefreshScope = useCallback(
    async (scope) => {
      if (!isAuthenticated) return;
      try {
        if (scope === 'MyAssigned') {
          const res = await incidentService.getMyAssigned();
          const list = res?.data || res;
          if (Array.isArray(list)) {
            setMyAssignedCases(list.map(normalizeIncidentForUI).filter(Boolean));
            setIsLiveApi(true);
          }
        } else if (scope === 'Unassigned') {
          const res = await incidentService.getUnassigned();
          const list = res?.data || res;
          if (Array.isArray(list)) {
            setUnassignedCases(list.map(normalizeIncidentForUI).filter(Boolean));
            setIsLiveApi(true);
          }
        } else {
          const res = await incidentService.getAll();
          const list = res?.data || res;
          if (Array.isArray(list)) {
            setCasesList(list.map(normalizeIncidentForUI).filter(Boolean));
            setIsLiveApi(true);
          }
        }
      } catch {
        // Keep current scope data if refresh fails
      }
    },
    [isAuthenticated]
  );

  const handleUpdateCase = async (id, updates, actionType = 'update') => {
    // Optimistically update local state
    setCasesList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    try {
      let res = null;
      if (actionType === 'escalate' || updates.status === 'Escalated') {
        res = await incidentService.escalate(id, {
          escalatedToRole: 'Senior Incident Coordinator',
          targetPriority: updates.priority || 'Critical',
          reason: updates.note || 'Escalated for senior operations specialist review.'
        });
      } else if (actionType === 'clarify' || updates.verification === 'Need information') {
        res = await incidentService.verify(id, {
          verificationStatus: 'Need information',
          reason: updates.note || 'Clarification requested on citizen contact & operational scope.'
        });
      } else if (updates.status) {
        res = await incidentService.updateStatus(id, {
          status: updates.status,
          verification: updates.verification,
          reason: updates.note || 'Operational review verified; status updated within assigned scope.'
        });
      } else {
        res = await incidentService.update(id, updates);
      }

      const updatedDto = res?.data || res;
      if (updatedDto && (updatedDto.id || updatedDto.caseNumber)) {
        const normalized = normalizeIncidentForUI(updatedDto);
        setCasesList((prev) =>
          prev.map((c) => (c.id === id || c.id === normalized.id ? normalized : c))
        );
        setMyAssignedCases((prev) =>
          prev.map((c) => (c.id === id || c.id === normalized.id ? normalized : c))
        );
        setSelectedCaseDetail(normalized);
        setIsLiveApi(true);
        setApiOfflineError(false);

        // Refresh dashboard KPIs after mutation
        const dashRes = await incidentService.getDashboard();
        const rawDash = dashRes?.data || dashRes;
        if (rawDash && rawDash.metrics) {
          setDashboardData(rawDash);
        }
      }
    } catch {
      // Fallback retains local state update if API is offline
    }
  };

  const handleCreateCase = async (newCase) => {
    setCasesList((prev) => [newCase, ...prev]);

    try {
      const res = await incidentService.create({
        caseNumber: newCase.id,
        category: newCase.category,
        operationalArea: newCase.operationalArea,
        priority: newCase.priority,
        assignedStaff: newCase.assignedStaff,
        citizenQuote: newCase.citizenQuote,
        affectedPeople: 4,
        currentSafety: newCase.currentSafety,
        accessibility: newCase.accessibility
      });
      const createdDto = res?.data || res;
      if (createdDto && (createdDto.id || createdDto.caseNumber)) {
        const normalized = normalizeIncidentForUI(createdDto);
        setCasesList((prev) =>
          prev.map((c) => (c.id === newCase.id ? normalized : c))
        );
        setSelectedCaseId(normalized.id);
        setSelectedCaseDetail(normalized);
        setIsLiveApi(true);
        setApiOfflineError(false);
      }
    } catch {
      // Preserve optimistic local creation when offline
    }
  };

  const getSubViewTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Case Dashboard';
      case 'management': return 'Case Management';
      case 'review': return 'AI-assisted Review';
      case 'communication': return 'Case Communication';
      case 'reports': return 'Case Reports';
      case 'profile': return 'Permissions & Profile';
      default: return 'Case Dashboard';
    }
  };

  const handleSignOut = async () => {
    showToast('Signing out of Incident / Case Manager workspace...', 'info');
    await logout();
    navigate('/login', { replace: true });
  };

  if (!isAuthenticated) {
    const redirectTarget = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectTarget)}`} replace />;
  }

  return (
    <div className="cm-portal-shell">
      {/* Toast Notification HUD */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          background: '#091a2b',
          border: '1px solid #0284c7',
          color: '#ffffff',
          borderRadius: '10px',
          padding: '12px 18px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={16} color="#38bdf8" />
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(null)} 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: '6px' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. Left Docked Navy Sidebar */}
      <aside className="cm-sidebar">
        <div>
          {/* Brand Header */}
          <div className="cm-sidebar-brand" onClick={() => setActiveTab('dashboard')}>
            <div className="cm-brand-icon">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="cm-brand-title">HumanAid</h2>
              <p className="cm-brand-sub">Response coordination</p>
            </div>
          </div>

          {/* User Status Card */}
          <div className="cm-user-status-card">
            <div className="cm-user-meta-left">
              <div className="cm-avatar-circle">
                {activeUser.initials}
              </div>
              <div>
                <span className="cm-user-tag-tiny">SIGNED IN AS</span>
                <div className="cm-user-role">{activeUser.role}</div>
                <div className="cm-user-name">{activeUser.name}</div>
              </div>
            </div>
            <div 
              className={`cm-duty-toggle ${dutyActive ? 'active' : ''}`}
              onClick={() => {
                setDutyActive(!dutyActive);
                showToast(dutyActive ? 'Duty status set to Standby' : 'Duty status set to Active Duty');
              }}
              title="Toggle duty status"
            >
              <div className="cm-duty-knob" />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="cm-nav-list">
            <button
              className={`cm-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="cm-nav-item-left">
                <LayoutDashboard size={16} />
                <span>Case Dashboard</span>
              </div>
            </button>

            <button
              className={`cm-nav-item ${activeTab === 'management' ? 'active' : ''}`}
              onClick={() => setActiveTab('management')}
            >
              <div className="cm-nav-item-left">
                <Briefcase size={16} />
                <span>Case Management</span>
              </div>
              <span className="cm-badge-red">{casesList.length}</span>
            </button>

            <button
              className={`cm-nav-item ${activeTab === 'review' ? 'active' : ''}`}
              onClick={() => setActiveTab('review')}
            >
              <div className="cm-nav-item-left">
                <Sparkles size={16} />
                <span>AI-assisted Review</span>
              </div>
            </button>

            <button
              className={`cm-nav-item ${activeTab === 'communication' ? 'active' : ''}`}
              onClick={() => setActiveTab('communication')}
            >
              <div className="cm-nav-item-left">
                <Send size={16} />
                <span>Case Communication</span>
              </div>
            </button>

            <button
              className={`cm-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <div className="cm-nav-item-left">
                <BarChart2 size={16} />
                <span>Case Reports</span>
              </div>
            </button>

            <button
              className={`cm-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <div className="cm-nav-item-left">
                <UserCheck size={16} />
                <span>Permissions &amp; Profile</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Box */}
        <div className="cm-sidebar-bottom">
          <div className="cm-role-boundary-box">
            <div className="cm-boundary-head">
              <ShieldCheck size={15} color="#38bdf8" />
              <span className="cm-boundary-title">Role access boundary</span>
            </div>
            <p className="cm-boundary-text">
              Assigned cases only. Citizen credentials and system administration are restricted.
            </p>
          </div>

          <button className="cm-btn-signout" onClick={handleSignOut}>
            <span>&gt; Sign out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="cm-main-area">
        {/* Top Navbar */}
        <header className="cm-top-navbar">
          <div className="cm-nav-breadcrumb">
            <span className="cm-crumb-category">INCIDENT / CASE MANAGER PORTAL</span>
            <span className="cm-crumb-title">{getSubViewTitle()}</span>
          </div>

          <div className="cm-top-search">
            <Search size={14} className="cm-search-icon" />
            <input
              type="text"
              placeholder="Search authorised records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cm-search-input"
            />
            <span className="cm-search-k">⌘K</span>
          </div>

          <div className="cm-top-right-tools">
            <div className="cm-op-dropdown">
              <span className="cm-op-lbl">Active operation</span>
              <div className="cm-op-val">
                <select
                  value={activeOperation}
                  onChange={(e) => setActiveOperation(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    outline: 'none',
                    padding: 0
                  }}
                >
                  <option value="Western Province Flood" style={{ background: '#0f172a', color: '#f8fafc' }}>Western Province Flood</option>
                  <option value="2024 Southern Province Floods" style={{ background: '#0f172a', color: '#f8fafc' }}>2024 Southern Province Floods</option>
                  <option value="Badulla District Landslide" style={{ background: '#0f172a', color: '#f8fafc' }}>Badulla District Landslide</option>
                  <option value="All Active Operations" style={{ background: '#0f172a', color: '#f8fafc' }}>All Active Operations</option>
                </select>
              </div>
            </div>

            <button 
              className="cm-bell-btn"
              onClick={() => showToast(`${casesList.length || 5} active case records in scope`, 'info')}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="cm-bell-dot">{casesList.length || CASE_MANAGER_USER.badgeCount}</span>
            </button>

            <div className="cm-user-badge">
              <div className="cm-user-badge-avatar">
                {activeUser.initials}
              </div>
              <div className="cm-user-badge-text">
                <span className="cm-user-badge-name">{activeUser.name}</span>
                <span className="cm-user-badge-role">{activeUser.shortRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Only display fallback warning banner if the backend API is genuinely unreachable */}
        {!isLoadingApi && !isLiveApi && apiOfflineError && (
          <div className="cm-prototype-ribbon">
            <AlertCircle size={14} className="cm-ribbon-icon" />
            <span className="cm-ribbon-bold">Development Fallback Mode</span>
            <span className="cm-ribbon-text">
              Backend unreachable — displaying local development fallback records. Start ASP.NET Core API to persist live changes.
            </span>
          </div>
        )}

        {/* 3. Subview Body */}
        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <CaseDashboardView
              dashboardData={dashboardData}
              isLiveApi={isLiveApi}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectCase={(id) => handleSelectCase(id)}
              showToast={showToast}
            />
          )}

          {activeTab === 'management' && (
            <CaseManagementView
              casesList={casesList}
              myAssignedCases={myAssignedCases}
              unassignedCases={unassignedCases}
              selectedCaseId={selectedCaseId}
              selectedCaseDetail={selectedCaseDetail}
              isLiveApi={isLiveApi}
              globalSearchQuery={searchQuery}
              onSelectCase={(id) => handleSelectCase(id)}
              onRefreshScope={handleRefreshScope}
              onUpdateCase={handleUpdateCase}
              onCreateCase={handleCreateCase}
              showToast={showToast}
            />
          )}

          {activeTab === 'review' && (
            <AIAssistedReviewView
              caseId={selectedCaseId}
              onDecisionRecorded={(id, dec, reason) => {
                setCasesList((prev) =>
                  prev.map((c) =>
                    c.id === id
                      ? {
                          ...c,
                          verification: 'Verified',
                          verificationType: 'verified',
                          note: `Human Review [${dec}]: ${reason}`
                        }
                      : c
                  )
                );
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'communication' && (
            <CaseCommunicationView
              caseId={selectedCaseId}
              showToast={showToast}
            />
          )}

          {activeTab === 'reports' && (
            <CaseReportsView
              showToast={showToast}
            />
          )}

          {activeTab === 'profile' && (
            <CasePermissionsProfileView
              activeUser={activeUser}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default CaseManagerPortal;

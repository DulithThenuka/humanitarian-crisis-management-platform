import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  LogOut, 
  CheckCircle2, 
  X,
  AlertCircle
} from 'lucide-react';

import { 
  CASE_MANAGER_USER, 
  INITIAL_CASES_LIST 
} from './caseManagerData';

import { CaseDashboardView } from './CaseDashboardView';
import { CaseManagementView } from './CaseManagementView';
import { AIAssistedReviewView } from './AIAssistedReviewView';
import { CaseCommunicationView } from './CaseCommunicationView';
import { CaseReportsView } from './CaseReportsView';
import { CasePermissionsProfileView } from './CasePermissionsProfileView';

import './CaseManager.css';

export const CaseManagerPortal = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [dutyActive, setDutyActive] = useState(true);
  const [activeOperation, setActiveOperation] = useState(CASE_MANAGER_USER.activeOperation);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Shared Cases state
  const [casesList, setCasesList] = useState(INITIAL_CASES_LIST);
  const [selectedCaseId, setSelectedCaseId] = useState('HMR-1042');
  
  // Toast Alert HUD
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 3800);
  };

  const handleUpdateCase = (id, updates) => {
    setCasesList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleCreateCase = (newCase) => {
    setCasesList((prev) => [newCase, ...prev]);
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

  const handleSignOut = () => {
    showToast('Signed out of Incident / Case Manager workspace', 'info');
    setTimeout(() => {
      navigate('/login');
    }, 800);
  };

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

      {/* 1. Left Docked Navy Sidebar (Screenshots 1-5 exact match) */}
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
                {CASE_MANAGER_USER.initials}
              </div>
              <div>
                <span className="cm-user-tag-tiny">SIGNED IN AS</span>
                <div className="cm-user-role">{CASE_MANAGER_USER.role}</div>
                <div className="cm-user-name">{CASE_MANAGER_USER.name}</div>
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
              <span className="cm-badge-red">{casesList.length + 5}</span>
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

          <button className="cm-btn-signout" onClick={() => navigate('/')} style={{ marginBottom: '6px', color: '#38bdf8' }}>
            <span>&gt; Platform Home</span>
          </button>

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
                <strong>{activeOperation}</strong>
                <ChevronDown size={13} />
              </div>
            </div>

            <button 
              className="cm-bell-btn"
              onClick={() => showToast('5 urgent case notifications requiring review', 'info')}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="cm-bell-dot">{CASE_MANAGER_USER.badgeCount}</span>
            </button>

            <div className="cm-user-badge">
              <div className="cm-user-badge-avatar">
                {CASE_MANAGER_USER.initials}
              </div>
              <div className="cm-user-badge-text">
                <span className="cm-user-badge-name">{CASE_MANAGER_USER.name}</span>
                <span className="cm-user-badge-role">{CASE_MANAGER_USER.shortRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Prototype Coursework Simulation Ribbon */}
        <div className="cm-prototype-ribbon">
          <ShieldCheck size={14} className="cm-ribbon-icon" />
          <span className="cm-ribbon-bold">Coursework prototype</span>
          <span className="cm-ribbon-text">
            All records, AI results and transactions are fictional demonstration data. Actions are local UI simulations.
          </span>
        </div>

        {/* 3. Subview Body */}
        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <CaseDashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectCase={(id) => setSelectedCaseId(id)}
              showToast={showToast}
            />
          )}

          {activeTab === 'management' && (
            <CaseManagementView
              casesList={casesList}
              selectedCaseId={selectedCaseId}
              onSelectCase={(id) => setSelectedCaseId(id)}
              onUpdateCase={handleUpdateCase}
              onCreateCase={handleCreateCase}
              showToast={showToast}
            />
          )}

          {activeTab === 'review' && (
            <AIAssistedReviewView
              caseId={selectedCaseId}
              onDecisionRecorded={(id, dec, reason) => {
                handleUpdateCase(id, {
                  verification: 'Verified',
                  verificationType: 'verified',
                  note: `Human Review [${dec}]: ${reason}`
                });
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
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default CaseManagerPortal;

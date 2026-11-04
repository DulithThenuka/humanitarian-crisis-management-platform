import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ShieldCheck, 
  Sparkles, 
  CheckSquare, 
  FileText, 
  Layers, 
  GitCommit, 
  Search, 
  Bell, 
  ChevronDown, 
  ChevronLeft,
  CheckCircle2,
  X
} from 'lucide-react';

import { AIOperationsOverview } from './AIOperationsOverview';
import { DecisionSupportQueue } from './DecisionSupportQueue';
import { AIDecisionReview } from './AIDecisionReview';
import { AIServiceWorkspace } from './AIServiceWorkspace';
import { DecisionTraceAudit } from './DecisionTraceAudit';
import { AIGovernanceSettings } from './AIGovernanceSettings';

import './AIOperationsCommon.css';

export const AIOperationsContainer = ({ 
  initialSubView = 'overview', 
  onBack = null 
}) => {
  const navigate = useNavigate();
  const [activeSubView, setActiveSubView] = useState(initialSubView);
  const [selectedCaseId, setSelectedCaseId] = useState('AID-2051');
  const [selectedWorkspace, setSelectedWorkspace] = useState('classification');
  const [dutyActive, setDutyActive] = useState(true);
  const [activeOperation, setActiveOperation] = useState('Western Province Flood');
  const [topSearch, setTopSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.id ? null : prev));
    }, 3600);
  };

  const handleBackToCoordinator = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/coordinator');
    }
  };

  const getSubViewTitle = () => {
    switch (activeSubView) {
      case 'overview': return 'AI Operations Overview';
      case 'queue': return 'AI Decision Support Queue';
      case 'review': return 'AI Decision Review';
      case 'workspace': return 'AI Service Workspaces';
      case 'trace': return 'Decision Trace & Audit';
      case 'governance': return 'Governance & Audit Settings';
      default: return 'AI Operations Overview';
    }
  };

  return (
    <div className="ai-portal-shell">
      {/* Toast Notification HUD */}
      {toast && (
        <div className={`ai-toast-hud ${toast.type}`}>
          <div className="toast-content">
            <CheckCircle2 size={16} className="toast-icon" />
            <span>{toast.message}</span>
          </div>
          <button className="toast-close-btn" onClick={() => setToast(null)}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* 1. Left Docked Sidebar (HumanAid deep navy matching Screenshots) */}
      <aside className="ai-portal-sidebar">
        <div>
          {/* Brand Header */}
          <div className="ai-sidebar-brand" onClick={() => setActiveSubView('overview')}>
            <div className="ai-brand-shield-icon">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="ai-brand-title">HumanAid</h2>
              <p className="ai-brand-subtitle">Response coordination</p>
            </div>
          </div>

          {/* Authorised Reviewer User Card */}
          <div className="ai-reviewer-card">
            <div className="ai-reviewer-meta-left">
              <div className="ai-reviewer-avatar">MF</div>
              <div>
                <span className="ai-reviewer-tag">AUTHORISED REVIEWER</span>
                <div className="ai-reviewer-role">Emergency Coordinator</div>
                <div className="ai-reviewer-name">Maya Fernando</div>
              </div>
            </div>
            <div 
              className={`ai-duty-toggle-switch ${dutyActive ? 'active' : 'inactive'}`}
              onClick={() => {
                setDutyActive(!dutyActive);
                showToast(dutyActive ? 'Coordinator duty set to Standby' : 'Coordinator duty set to Active Duty');
              }}
              title="Toggle duty status"
            >
              <div className="ai-duty-toggle-knob" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="ai-sidebar-nav">
            <button
              className={`ai-nav-item-btn ${activeSubView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSubView('overview')}
            >
              <div className="nav-item-left">
                <Sparkles size={16} />
                <span>AI Operations Overview</span>
              </div>
            </button>

            <button
              className={`ai-nav-item-btn ${activeSubView === 'queue' ? 'active' : ''}`}
              onClick={() => setActiveSubView('queue')}
            >
              <div className="nav-item-left">
                <CheckSquare size={16} />
                <span>Decision Support Queue</span>
              </div>
              <span className="queue-red-count-badge">36</span>
            </button>

            <button
              className={`ai-nav-item-btn ${activeSubView === 'review' ? 'active' : ''}`}
              onClick={() => setActiveSubView('review')}
            >
              <div className="nav-item-left">
                <FileText size={16} />
                <span>AI Decision Review</span>
              </div>
            </button>

            <button
              className={`ai-nav-item-btn ${activeSubView === 'workspace' ? 'active' : ''}`}
              onClick={() => setActiveSubView('workspace')}
            >
              <div className="nav-item-left">
                <Layers size={16} />
                <span>AI Service Workspaces</span>
              </div>
            </button>

            <button
              className={`ai-nav-item-btn ${activeSubView === 'trace' ? 'active' : ''}`}
              onClick={() => setActiveSubView('trace')}
            >
              <div className="nav-item-left">
                <GitCommit size={16} />
                <span>Decision Trace &amp; Audit</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Box */}
        <div className="ai-sidebar-bottom-zone">
          <div className="human-decision-guardrail-card">
            <div className="guardrail-head">
              <ShieldCheck size={16} className="text-blue" />
              <span className="guardrail-title">Human decision required</span>
            </div>
            <p className="guardrail-text">
              AI recommendations never independently determine access to assistance.
            </p>
          </div>

          <button className="btn-back-coordinator-portal" onClick={handleBackToCoordinator}>
            <ChevronLeft size={16} />
            <span>Back to Emergency Coordinator Portal</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="ai-portal-main-area">
        {/* Top Header Navbar (matching Screenshots 1-5) */}
        <header className="ai-portal-top-navbar">
          <div className="top-nav-left-breadcrumb">
            <span className="nav-crumb-category">AI OPERATIONS &amp; DECISION SUPPORT</span>
            <span className="nav-crumb-title">{getSubViewTitle()}</span>
          </div>

          <div className="top-nav-center-search">
            <Search size={15} className="top-search-icon" />
            <input 
              type="text" 
              placeholder="Search decisions, requests, AI services..." 
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              className="top-search-input"
            />
            <span className="top-search-shortcut">⌘K</span>
          </div>

          <div className="top-nav-right-tools">
            <div className="active-operation-dropdown">
              <span className="active-op-label">Active operation</span>
              <div className="active-op-selector">
                <strong>{activeOperation}</strong>
                <ChevronDown size={14} />
              </div>
            </div>

            <button 
              className="top-nav-bell-btn"
              onClick={() => showToast('12 unreviewed high-priority AI recommendations awaiting action', 'info')}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="top-bell-badge">12</span>
            </button>

            <div className="top-nav-user-badge">
              <div className="user-avatar-circle">MF</div>
              <div className="user-badge-text">
                <strong className="user-name">Maya Fernando</strong>
                <span className="user-role">Emergency Coordinator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Simulated AI Outputs Warning Ribbon */}
        <div className="ai-simulated-ribbon">
          <Sparkles size={14} className="ribbon-sparkle-icon" />
          <span className="ribbon-bold">Simulated AI outputs</span>
          <span className="ribbon-text">
            No AI provider is connected. All recommendations and service activity are labeled demonstration examples.
          </span>
        </div>

        {/* 3. Subview Body */}
        <main className="ai-portal-page-body">
          {activeSubView === 'overview' && (
            <AIOperationsOverview 
              onNavigateQueue={() => setActiveSubView('queue')}
              onNavigateReview={(id = 'AID-2051') => {
                setSelectedCaseId(id);
                setActiveSubView('review');
              }}
              onNavigateWorkspaces={(ws = 'classification') => {
                setSelectedWorkspace(ws);
                setActiveSubView('workspace');
              }}
              onNavigateGovernance={() => setActiveSubView('governance')}
              showToast={showToast}
            />
          )}

          {activeSubView === 'queue' && (
            <DecisionSupportQueue 
              onOpenReview={(id = 'AID-2051') => {
                setSelectedCaseId(id);
                setActiveSubView('review');
              }}
              onBackOverview={() => setActiveSubView('overview')}
              showToast={showToast}
            />
          )}

          {activeSubView === 'review' && (
            <AIDecisionReview 
              caseId={selectedCaseId}
              onBackToQueue={() => setActiveSubView('queue')}
              showToast={showToast}
            />
          )}

          {activeSubView === 'workspace' && (
            <AIServiceWorkspace 
              initialService={selectedWorkspace}
              onBackOverview={() => setActiveSubView('overview')}
              onViewCase={(id = 'AID-2051') => {
                setSelectedCaseId(id);
                setActiveSubView('review');
              }}
              showToast={showToast}
            />
          )}

          {activeSubView === 'trace' && (
            <DecisionTraceAudit 
              caseId={selectedCaseId}
              onBackToQueue={() => setActiveSubView('queue')}
              showToast={showToast}
            />
          )}

          {activeSubView === 'governance' && (
            <AIGovernanceSettings 
              onNavigateWorkspace={(wsId) => {
                setSelectedWorkspace(wsId);
                setActiveSubView('workspace');
              }}
              onBackOverview={() => setActiveSubView('overview')}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AIOperationsContainer;
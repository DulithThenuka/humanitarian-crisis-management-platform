import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  ListFilter, 
  CheckSquare, 
  Layers, 
  GitCommit,
  ShieldCheck
} from 'lucide-react';

import { AIOperationsOverview } from './AIOperationsOverview';
import { DecisionSupportQueue } from './DecisionSupportQueue';
import { AIDecisionReview } from './AIDecisionReview';
import { AIServiceWorkspace } from './AIServiceWorkspace';
import { DecisionTraceAudit } from './DecisionTraceAudit';
import { AIGovernanceSettings } from './AIGovernanceSettings';

import './AIOperationsCommon.css';

export const AIOperationsContainer = ({ initialSubView = 'overview' }) => {
  // 6 Views matching all user requirements & designs:
  // 'overview'   -> Picture 1: AI Operations Overview
  // 'queue'      -> Picture 2: Decision Support Queue
  // 'review'     -> Picture 3: Decision Review
  // 'workspace'  -> Picture 4: AI Service Workspaces
  // 'trace'      -> Picture 5: Decision Trace & Audit (embedded inside AI Operations)
  // 'governance' -> Picture 6: AI Governance & Settings
  const [activeSubView, setActiveSubView] = useState(initialSubView);
  const [selectedCaseId, setSelectedCaseId] = useState('REQ-2026-01842');
  const [selectedWorkspace, setSelectedWorkspace] = useState('classification');

  useEffect(() => {
    if (initialSubView) {
      setActiveSubView(initialSubView);
    }
  }, [initialSubView]);

  const handleOpenReview = (caseId = 'REQ-2026-01842') => {
    setSelectedCaseId(caseId);
    setActiveSubView('review');
  };

  const handleOpenTrace = (caseId = 'REQ-2026-01842') => {
    setSelectedCaseId(caseId);
    setActiveSubView('trace');
  };

  const handleBackToQueue = () => {
    setActiveSubView('queue');
  };

  const handleBackToOverview = () => {
    setActiveSubView('overview');
  };

  const handleOpenWorkspaces = (workspaceId = 'classification') => {
    setSelectedWorkspace(workspaceId);
    setActiveSubView('workspace');
  };

  const handleOpenGovernance = () => {
    setActiveSubView('governance');
  };

  return (
    <div className="ai-module-wrapper">
      {/* Top View-Switcher Ribbon across the 6 Picture Views */}
      <nav className="ai-subnav-ribbon">
        <div className="ai-subnav-items">
          <button 
            className={`ai-subnav-btn ${activeSubView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSubView('overview')}
          >
            <Brain size={14} />
            <span>AI Operations Overview</span>
          </button>

          <button 
            className={`ai-subnav-btn ${activeSubView === 'queue' ? 'active' : ''}`}
            onClick={() => setActiveSubView('queue')}
          >
            <ListFilter size={14} />
            <span>Decision Support Queue</span>
          </button>

          <button 
            className={`ai-subnav-btn ${activeSubView === 'review' ? 'active' : ''}`}
            onClick={() => setActiveSubView('review')}
          >
            <CheckSquare size={14} />
            <span>Decision Review</span>
          </button>

          <button 
            className={`ai-subnav-btn ${activeSubView === 'workspace' ? 'active' : ''}`}
            onClick={() => setActiveSubView('workspace')}
          >
            <Layers size={14} />
            <span>AI Service Workspaces</span>
          </button>

          <button 
            className={`ai-subnav-btn ${activeSubView === 'trace' ? 'active' : ''}`}
            onClick={() => setActiveSubView('trace')}
          >
            <GitCommit size={14} />
            <span>Decision Trace &amp; Audit</span>
          </button>

          <button 
            className={`ai-subnav-btn ${activeSubView === 'governance' ? 'active' : ''}`}
            onClick={() => setActiveSubView('governance')}
          >
            <ShieldCheck size={14} />
            <span>AI Governance &amp; Settings</span>
          </button>
        </div>
      </nav>

      {/* Render selected view */}
      <div className="ai-subview-content">
        {activeSubView === 'overview' && (
          <AIOperationsOverview 
            onNavigateQueue={() => setActiveSubView('queue')}
            onNavigateReview={handleOpenReview}
            onNavigateWorkspaces={handleOpenWorkspaces}
            onNavigateGovernance={handleOpenGovernance}
          />
        )}

        {activeSubView === 'queue' && (
          <DecisionSupportQueue 
            onOpenReview={handleOpenReview}
            onOpenTrace={handleOpenTrace}
            onBackOverview={handleBackToOverview}
          />
        )}

        {activeSubView === 'review' && (
          <AIDecisionReview 
            caseId={selectedCaseId}
            onBackToQueue={handleBackToQueue}
            onViewTrace={handleOpenTrace}
          />
        )}

        {activeSubView === 'workspace' && (
          <AIServiceWorkspace 
            initialService={selectedWorkspace}
            onBackOverview={handleBackToOverview}
            onViewCase={handleOpenReview}
          />
        )}

        {activeSubView === 'trace' && (
          <DecisionTraceAudit 
            caseId={selectedCaseId}
            onBackToQueue={handleBackToQueue}
          />
        )}

        {activeSubView === 'governance' && (
          <AIGovernanceSettings 
            onNavigateWorkspace={(wsId) => {
              setSelectedWorkspace(wsId);
              setActiveSubView('workspace');
            }}
            onBackOverview={handleBackToOverview}
          />
        )}
      </div>
    </div>
  );
};
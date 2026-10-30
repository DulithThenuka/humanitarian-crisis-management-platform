import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  ListFilter, 
  CheckSquare, 
  Layers, 
  GitCommit,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
  X
} from 'lucide-react';

import { AIOperationsOverview } from './AIOperationsOverview';
import { DecisionSupportQueue } from './DecisionSupportQueue';
import { AIDecisionReview } from './AIDecisionReview';
import { AIServiceWorkspace } from './AIServiceWorkspace';
import { DecisionTraceAudit } from './DecisionTraceAudit';
import { AIGovernanceSettings } from './AIGovernanceSettings';
import { INITIAL_QUEUE_DATA, AI_SERVICES_CATALOG } from './aiOperationsData';

import './AIOperationsCommon.css';

export const AIOperationsContainer = ({ initialSubView = 'overview' }) => {
  const [activeSubView, setActiveSubView] = useState(initialSubView);
  const [selectedCaseId, setSelectedCaseId] = useState('REQ-2026-01842');
  const [selectedWorkspace, setSelectedWorkspace] = useState('classification');
  
  // Shared reactive state across sub-views
  const [queueData, setQueueData] = useState(INITIAL_QUEUE_DATA);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsProgress, setDiagnosticsProgress] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (initialSubView) {
      setActiveSubView(initialSubView);
    }
  }, [initialSubView]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 3800);
  };

  const handleRunDiagnostics = () => {
    if (diagnosticsRunning) return;
    setDiagnosticsRunning(true);
    setDiagnosticsProgress(10);
    showToast('Initiating ReliefCore neural model diagnostics & pipeline sync...', 'info');

    const interval = setInterval(() => {
      setDiagnosticsProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDiagnosticsRunning(false);
          showToast('Diagnostics complete: All 10 AI microservices healthy. P99 latency: 26ms.', 'success');
          return 100;
        }
        return prev + 30;
      });
    }, 450);
  };

  const handleUpdateQueueItem = (id, updates) => {
    setQueueData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleAddQueueItem = (newItem) => {
    setQueueData((prev) => [newItem, ...prev]);
    showToast(`New urgent request ${newItem.id} ingested & classified by AI`, 'success');
  };

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

  // Compute live queue badges
  const pendingCount = queueData.filter((q) => q.reviewStatus === 'Pending').length;
  const criticalCount = queueData.filter((q) => q.priority === 'CRITICAL').length;

  return (
    <div className="ai-module-wrapper">
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

      {/* Diagnostics Progress Bar (if running) */}
      {diagnosticsRunning && (
        <div className="ai-diagnostics-progress-track">
          <div 
            className="ai-diagnostics-progress-fill"
            style={{ width: `${diagnosticsProgress}%` }}
          ></div>
        </div>
      )}

      {/* Futuristic Telemetry Status Bar */}
      <div className="ai-telemetry-header-strip">
        <div className="telemetry-left">
          <div className="telemetry-live-chip">
            <span className="telemetry-pulse-dot"></span>
            <span className="telemetry-chip-text">RELIEFCORE NEURAL CORE v4.2</span>
          </div>
          <span className="telemetry-metric">
            <strong>10/10</strong> Microservices Online
          </span>
          <span className="telemetry-divider">|</span>
          <span className="telemetry-metric">
            Avg Latency: <strong>24ms</strong>
          </span>
          <span className="telemetry-divider">|</span>
          <span className="telemetry-metric">
            Inference Accuracy: <strong>94.8%</strong>
          </span>
        </div>

        <div className="telemetry-right">
          <button 
            className={`btn-diagnostics-pill ${diagnosticsRunning ? 'running' : ''}`}
            onClick={handleRunDiagnostics}
            disabled={diagnosticsRunning}
            title="Run simulated inference latency tests across all models"
          >
            <Zap size={13} className={diagnosticsRunning ? 'spin-icon' : ''} />
            <span>{diagnosticsRunning ? `Diagnosing (${diagnosticsProgress}%)` : 'Run AI Diagnostics'}</span>
          </button>
        </div>
      </div>

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
            {pendingCount > 0 && <span className="subnav-badge amber">{pendingCount}</span>}
          </button>

          <button 
            className={`ai-subnav-btn ${activeSubView === 'review' ? 'active' : ''}`}
            onClick={() => setActiveSubView('review')}
          >
            <CheckSquare size={14} />
            <span>Decision Review</span>
            <span className="subnav-badge blue">Active Case</span>
          </button>

          <button 
            className={`ai-subnav-btn ${activeSubView === 'workspace' ? 'active' : ''}`}
            onClick={() => setActiveSubView('workspace')}
          >
            <Layers size={14} />
            <span>AI Service Workspaces</span>
            <span className="subnav-badge green">10 Models</span>
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
            queueData={queueData}
            onNavigateQueue={() => setActiveSubView('queue')}
            onNavigateReview={handleOpenReview}
            onNavigateWorkspaces={handleOpenWorkspaces}
            onNavigateGovernance={handleOpenGovernance}
            onRunDiagnostics={handleRunDiagnostics}
            showToast={showToast}
          />
        )}

        {activeSubView === 'queue' && (
          <DecisionSupportQueue 
            queueData={queueData}
            onUpdateQueueItem={handleUpdateQueueItem}
            onAddQueueItem={handleAddQueueItem}
            onOpenReview={handleOpenReview}
            onOpenTrace={handleOpenTrace}
            onBackOverview={handleBackToOverview}
            showToast={showToast}
          />
        )}

        {activeSubView === 'review' && (
          <AIDecisionReview 
            caseId={selectedCaseId}
            queueData={queueData}
            onUpdateQueueItem={handleUpdateQueueItem}
            onBackToQueue={handleBackToQueue}
            onViewTrace={handleOpenTrace}
            showToast={showToast}
          />
        )}

        {activeSubView === 'workspace' && (
          <AIServiceWorkspace 
            initialService={selectedWorkspace}
            onBackOverview={handleBackToOverview}
            onViewCase={handleOpenReview}
            showToast={showToast}
          />
        )}

        {activeSubView === 'trace' && (
          <DecisionTraceAudit 
            caseId={selectedCaseId}
            queueData={queueData}
            onBackToQueue={handleBackToQueue}
            showToast={showToast}
          />
        )}

        {activeSubView === 'governance' && (
          <AIGovernanceSettings 
            onNavigateWorkspace={(wsId) => {
              setSelectedWorkspace(wsId);
              setActiveSubView('workspace');
            }}
            onBackOverview={handleBackToOverview}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
};
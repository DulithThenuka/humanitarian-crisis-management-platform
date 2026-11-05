import React from 'react';
import { 
  Package, 
  GitBranch, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  BarChart2, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { 
  INITIAL_METRICS, 
  PRIORITY_ATTENTION_ITEMS, 
  WORKFLOW_STEPS, 
  RECENT_ACTIVITY_ITEMS 
} from './caseManagerData';

export const CaseDashboardView = ({ 
  onNavigate, 
  onSelectCase, 
  showToast 
}) => {
  return (
    <div className="cm-canvas-wrapper">
      {/* Top Header Row with 'Open Case Management' action */}
      <div className="cm-canvas-head-row">
        <div>
          <span className="cm-tag-uppercase">ILLUSTRATIVE COURSEWORK WORKSPACE</span>
          <h1 className="cm-canvas-h1">Case Manager Dashboard</h1>
          <p className="cm-canvas-sub">
            Fictional demonstration data shows role-scoped workload, handoffs and decisions. No live operation is connected.
          </p>
        </div>

        <button 
          className="cm-btn-open-management"
          onClick={() => {
            onNavigate('management');
            showToast?.('Navigated to Case Management workspace', 'info');
          }}
          title="Open Case Management table & actions"
        >
          <span>Open Case Management</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* 6 KPI Cards in a Row (Screenshot 1 exact match) */}
      <div className="cm-kpi-6grid">
        {/* 1. Assigned cases */}
        <div 
          className="cm-kpi-card" 
          onClick={() => onNavigate('management')} 
          title="Click to view assigned cases"
        >
          <div className="cm-kpi-top">
            <span className="cm-kpi-label">Assigned cases</span>
            <div className="cm-kpi-icon-bubble bubble-blue">
              <Package size={15} />
            </div>
          </div>
          <div className="cm-kpi-bottom">
            <span className="cm-kpi-num">{INITIAL_METRICS.assignedCases.value}</span>
            <span className="cm-kpi-sub">{INITIAL_METRICS.assignedCases.sub}</span>
          </div>
        </div>

        {/* 2. Open / unresolved */}
        <div 
          className="cm-kpi-card" 
          onClick={() => onNavigate('management')}
          title="Click to view open unresolved cases"
        >
          <div className="cm-kpi-top">
            <span className="cm-kpi-label">Open / unresolved</span>
            <div className="cm-kpi-icon-bubble bubble-amber">
              <GitBranch size={15} />
            </div>
          </div>
          <div className="cm-kpi-bottom">
            <span className="cm-kpi-num">{INITIAL_METRICS.openUnresolved.value}</span>
            <span className="cm-kpi-sub">{INITIAL_METRICS.openUnresolved.sub}</span>
          </div>
        </div>

        {/* 3. Escalated */}
        <div 
          className="cm-kpi-card" 
          onClick={() => onNavigate('management')}
          title="Click to view escalated cases"
        >
          <div className="cm-kpi-top">
            <span className="cm-kpi-label">Escalated</span>
            <div className="cm-kpi-icon-bubble bubble-rose">
              <AlertTriangle size={15} />
            </div>
          </div>
          <div className="cm-kpi-bottom">
            <span className="cm-kpi-num">{INITIAL_METRICS.escalated.value}</span>
            <span className="cm-kpi-sub">{INITIAL_METRICS.escalated.sub}</span>
          </div>
        </div>

        {/* 4. Awaiting verification */}
        <div 
          className="cm-kpi-card" 
          onClick={() => onNavigate('management')}
          title="Click to view cases awaiting verification"
        >
          <div className="cm-kpi-top">
            <span className="cm-kpi-label">Awaiting verification</span>
            <div className="cm-kpi-icon-bubble bubble-emerald">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="cm-kpi-bottom">
            <span className="cm-kpi-num">{INITIAL_METRICS.awaitingVerification.value}</span>
            <span className="cm-kpi-sub">{INITIAL_METRICS.awaitingVerification.sub}</span>
          </div>
        </div>

        {/* 5. Need information */}
        <div 
          className="cm-kpi-card" 
          onClick={() => onNavigate('communication')}
          title="Click to view communication requests"
        >
          <div className="cm-kpi-top">
            <span className="cm-kpi-label">Need information</span>
            <div className="cm-kpi-icon-bubble bubble-sky">
              <Send size={15} />
            </div>
          </div>
          <div className="cm-kpi-bottom">
            <span className="cm-kpi-num">{INITIAL_METRICS.needInformation.value}</span>
            <span className="cm-kpi-sub">{INITIAL_METRICS.needInformation.sub}</span>
          </div>
        </div>

        {/* 6. Median response */}
        <div 
          className="cm-kpi-card" 
          onClick={() => onNavigate('reports')}
          title="Click to view response reports"
        >
          <div className="cm-kpi-top">
            <span className="cm-kpi-label">Median response</span>
            <div className="cm-kpi-icon-bubble bubble-indigo">
              <BarChart2 size={15} />
            </div>
          </div>
          <div className="cm-kpi-bottom">
            <span className="cm-kpi-num">{INITIAL_METRICS.medianResponse.value}</span>
            <span className="cm-kpi-sub">{INITIAL_METRICS.medianResponse.sub}</span>
          </div>
        </div>
      </div>

      {/* Split Section: Left (Priority Attention & Recent Activity) + Right (Connected Workflow & Privacy) */}
      <div className="cm-dash-split-row">
        {/* Left Column */}
        <div className="cm-dash-left-col">
          {/* Priority Attention Card */}
          <div className="cm-panel-card">
            <div className="cm-panel-header">
              <div>
                <h3 className="cm-panel-title">Priority attention</h3>
                <p className="cm-panel-sub">Role-scoped records requiring review</p>
              </div>
              <span className="cm-badge-count-pill">● 3 items</span>
            </div>

            <div className="cm-priority-list">
              {PRIORITY_ATTENTION_ITEMS.map((item) => (
                <div 
                  key={item.id} 
                  className="cm-priority-item"
                  onClick={() => {
                    onSelectCase(item.id);
                    onNavigate('management');
                    showToast?.(`Selected ${item.id} for review`, 'info');
                  }}
                >
                  <div className="cm-num-circle">{item.num}</div>
                  <div className="cm-priority-info">
                    <div className="cm-priority-item-title">{item.title}</div>
                    <div className="cm-priority-item-desc">{item.desc}</div>
                  </div>
                  <div className="cm-priority-action-wrap">
                    <span className={`cm-pill-tag ${item.pillType}`}>
                      ● {item.pillText}
                    </span>
                    <ChevronRight size={14} className="cm-chevron-arrow" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="cm-panel-card">
            <div className="cm-panel-header">
              <div>
                <h3 className="cm-panel-title">Recent activity</h3>
                <p className="cm-panel-sub">Audit-logged operations by authorised staff</p>
              </div>
            </div>

            <div className="cm-activity-list">
              {RECENT_ACTIVITY_ITEMS.map((act) => (
                <div key={act.id} className="cm-activity-item">
                  <span className="cm-act-time">{act.time}</span>
                  <div className="cm-act-detail">
                    <strong className="cm-act-bold">● {act.caseId} - {act.category}</strong>
                    <span style={{ marginLeft: '8px' }}>{act.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="cm-dash-right-col">
          {/* Connected Assistance Workflow Card */}
          <div className="cm-panel-card">
            <div className="cm-panel-header">
              <div>
                <h3 className="cm-panel-title">Connected assistance workflow</h3>
                <p className="cm-panel-sub">Role handoffs and verification flow</p>
              </div>
            </div>

            <div className="cm-workflow-list">
              {WORKFLOW_STEPS.map((step) => (
                <div key={step.step} className="cm-workflow-step-item">
                  <div className={`cm-step-indicator ${step.status}`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      step.step
                    )}
                  </div>
                  <div className="cm-step-info">
                    <span className="cm-step-title">{step.title}</span>
                    <span className="cm-step-desc">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Boundary Card */}
          <div className="cm-privacy-alert-card">
            <ShieldCheck size={20} color="#16a34a" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '2px' }}>Privacy boundary</strong>
              <p style={{ margin: 0, fontSize: '11.5px', lineHeight: 1.4 }}>
                Assigned cases only. Citizen credentials and system administration are restricted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

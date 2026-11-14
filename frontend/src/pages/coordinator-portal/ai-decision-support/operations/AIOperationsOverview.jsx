import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Clock, 
  BarChart2, 
  Shuffle, 
  AlertTriangle, 
  Settings, 
  ChevronRight, 
  CheckCircle2, 
  X,
  ExternalLink,
  Layers,
  Send,
  PieChart
} from 'lucide-react';

export const AIOperationsOverview = ({
  onNavigateQueue,
  onNavigateReview,
  onNavigateWorkspaces,
  onNavigateGovernance,
  showToast
}) => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // 10 AI services matching Screenshots 1 & 2
  const aiServices = [
    {
      id: 'classification',
      title: 'Assistance classification',
      desc: 'Categorises incoming requests for review',
      status: 'Online',
      statusType: 'online',
      stat: '124 today',
      icon: Sparkles
    },
    {
      id: 'urgency-priority',
      title: 'Urgency & priority scoring',
      desc: 'Recommends operational priority',
      status: 'Online',
      statusType: 'online',
      stat: 'AID-2051 pending',
      icon: Sparkles
    },
    {
      id: 'duplicate-detection',
      title: 'Duplicate detection',
      desc: 'Surfaces potentially related cases',
      status: 'Online',
      statusType: 'online',
      stat: '8 groups found',
      icon: Sparkles
    },
    {
      id: 'resource-matching',
      title: 'Resource matching',
      desc: 'Compares needs with available stock',
      status: 'Attention',
      statusType: 'attention',
      stat: '3 conflicts',
      icon: Sparkles
    },
    {
      id: 'shelter-recommendation',
      title: 'Shelter recommendation',
      desc: 'Assesses suitable verified shelters',
      status: 'Online',
      statusType: 'online',
      stat: '28 today',
      icon: Sparkles
    },
    {
      id: 'volunteer-matching',
      title: 'Volunteer matching',
      desc: 'Suggests eligible volunteer-task matches',
      status: 'Online',
      statusType: 'online',
      stat: '42 suggestions',
      icon: Sparkles
    },
    {
      id: 'demand-forecasting',
      title: 'Demand forecasting',
      desc: 'Forecasts operational resource demand',
      status: 'Online',
      statusType: 'online',
      stat: 'Updated 08:30',
      icon: BarChart2
    },
    {
      id: 'suspicious-activity',
      title: 'Suspicious activity',
      desc: 'Flags anomalies for investigation',
      status: 'Review',
      statusType: 'attention',
      stat: '4 flags',
      icon: ShieldCheck
    },
    {
      id: 'multilingual-response',
      title: 'Multilingual response',
      desc: 'Drafts messages for human approval',
      status: 'Online',
      statusType: 'online',
      stat: '88 today',
      icon: Send
    },
    {
      id: 'crisis-summaries',
      title: 'Crisis summaries',
      desc: 'Drafts cited operational summaries',
      status: 'Online',
      statusType: 'online',
      stat: 'Generated 09:15',
      icon: Sparkles
    }
  ];

  return (
    <div className="ai-overview-canvas">
      {/* Title & Governance Action Row */}
      <div className="ai-overview-title-row">
        <div>
          <span className="ai-sub-tag-uppercase">HUMAN-GOVERNED INTELLIGENCE</span>
          <h1 className="ai-overview-h1">AI Operations Overview</h1>
          <p className="ai-overview-desc">
            Monitor recommendations, review workload and service health. AI supports — people decide.
          </p>
        </div>

        <button 
          className="btn-governance-settings" 
          onClick={() => onNavigateGovernance ? onNavigateGovernance() : showToast?.('Opening Governance & Audit settings...', 'info')}
        >
          <Settings size={15} />
          <span>Governance settings</span>
        </button>
      </div>

      {/* Human Approval Required Banner */}
      <div className="ai-governance-banner-card">
        <div className="ai-banner-left">
          <div className="ai-banner-shield-icon">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="ai-banner-title">Human approval is required for consequential decisions</h4>
            <p className="ai-banner-subtitle">
              Recommendations cannot independently deny aid, remove requests, assign unsuitable shelter or finalise critical allocations.
            </p>
          </div>
        </div>

        <button 
          className="btn-view-policy-link"
          onClick={() => setShowPolicyModal(true)}
        >
          View policy
        </button>
      </div>

      {/* 5 KPI Stat Cards in a Row (Screenshot 1 exact match) */}
      <div className="ai-kpi-5grid">
        {/* Card 1 */}
        <div className="ai-kpi-metric-card" onClick={onNavigateQueue} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-label">Pending recommendations</span>
            <div className="kpi-icon-bubble bubble-blue">
              <Globe size={16} />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-big-num">36</span>
            <span className="kpi-sub-text">12 critical</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="ai-kpi-metric-card" onClick={onNavigateQueue} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-label">Awaiting approval</span>
            <div className="kpi-icon-bubble bubble-amber">
              <Clock size={16} />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-big-num">12</span>
            <span className="kpi-sub-text">Oldest: 42 min</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="ai-kpi-metric-card">
          <div className="kpi-top">
            <span className="kpi-label">Average confidence</span>
            <div className="kpi-icon-bubble bubble-emerald">
              <BarChart2 size={16} />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-big-num">84%</span>
            <span className="kpi-sub-text">Not an accuracy score</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="ai-kpi-metric-card">
          <div className="kpi-top">
            <span className="kpi-label">Human modification rate</span>
            <div className="kpi-icon-bubble bubble-sky">
              <Shuffle size={16} />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-big-num">18%</span>
            <span className="kpi-sub-text">Last 30 days</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="ai-kpi-metric-card">
          <div className="kpi-top">
            <span className="kpi-label">Investigation flags</span>
            <div className="kpi-icon-bubble bubble-rose">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-big-num">4</span>
            <span className="kpi-sub-text">Not proof of wrongdoing</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Workspaces Grid (Left) + Workload & Alerts (Right) */}
      <div className="ai-overview-split-row">
        {/* LEFT: 10 AI Service Workspaces */}
        <div className="ai-workspaces-column">
          <div className="workspaces-header-strip">
            <div>
              <h2 className="workspaces-heading">AI service workspaces</h2>
              <p className="workspaces-sub">Ten services with mandatory human oversight</p>
            </div>
            <span className="badge-online-pulse">
              <span className="dot-green"></span>
              9 online
            </span>
          </div>

          <div className="ai-services-cards-grid">
            {aiServices.map((service) => {
              const IconComp = service.icon;
              return (
                <div key={service.id} className="ai-service-item-card">
                  <div className="service-card-top">
                    <div className="service-icon-box">
                      <IconComp size={16} />
                    </div>
                  </div>

                  <div className="service-card-middle">
                    <h3 className="service-card-title">{service.title}</h3>
                    <p className="service-card-desc">{service.desc}</p>
                  </div>

                  <div className="service-card-bottom">
                    <div className="service-status-line">
                      <span className={`status-dot ${service.statusType}`}></span>
                      <strong className="status-label">{service.status}</strong>
                      <span className="status-stat">{service.stat}</span>
                    </div>

                    <button 
                      className="btn-open-workspace"
                      onClick={() => {
                        if (service.id === 'urgency-priority') {
                          onNavigateReview ? onNavigateReview('AID-2051') : onNavigateQueue?.();
                        } else if (onNavigateWorkspaces) {
                          onNavigateWorkspaces(service.id);
                        } else {
                          showToast?.(`Workspace for ${service.title} opened`, 'info');
                        }
                      }}
                    >
                      <span>Open workspace</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Review Workload & Service Alerts */}
        <div className="ai-sidebar-widgets-column">
          {/* Widget 1: Review Workload Donut Chart */}
          <div className="ai-widget-card workload-widget">
            <div className="widget-header">
              <h3 className="widget-title">Review workload</h3>
              <p className="widget-subtitle">By recommendation state</p>
            </div>

            <div className="workload-donut-container">
              <div className="donut-chart-wrap">
                <svg viewBox="0 0 160 160" className="donut-svg">
                  {/* Circle 1: Critical (Red) 12 / 36 = 33.3% -> strokeDasharray="98 202" */}
                  <circle
                    cx="80"
                    cy="80"
                    r="48"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="18"
                    strokeDasharray="99 202"
                    strokeDashoffset="75"
                    className="donut-slice"
                  />
                  {/* Circle 2: Low confidence (Amber) 8 / 36 = 22.2% -> strokeDasharray="66 235" */}
                  <circle
                    cx="80"
                    cy="80"
                    r="48"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="18"
                    strokeDasharray="67 234"
                    strokeDashoffset="-24"
                    className="donut-slice"
                  />
                  {/* Circle 3: Standard (Project Blue) 16 / 36 = 44.4% -> strokeDasharray="135 166" */}
                  <circle
                    cx="80"
                    cy="80"
                    r="48"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="18"
                    strokeDasharray="135 166"
                    strokeDashoffset="-91"
                    className="donut-slice"
                  />
                </svg>
                <div className="donut-center-text">
                  <span className="donut-center-num">36</span>
                  <span className="donut-center-lbl">total</span>
                </div>
              </div>

              {/* Legend */}
              <div className="donut-legend-list">
                <div className="legend-row">
                  <div className="legend-label-wrap">
                    <span className="legend-dot dot-red"></span>
                    <span>Critical</span>
                  </div>
                  <strong className="legend-val">12</strong>
                </div>

                <div className="legend-row">
                  <div className="legend-label-wrap">
                    <span className="legend-dot dot-amber"></span>
                    <span>Low confidence</span>
                  </div>
                  <strong className="legend-val">8</strong>
                </div>

                <div className="legend-row">
                  <div className="legend-label-wrap">
                    <span className="legend-dot dot-blue"></span>
                    <span>Standard</span>
                  </div>
                  <strong className="legend-val">16</strong>
                </div>
              </div>
            </div>

            <button 
              className="btn-open-decision-queue-main"
              onClick={onNavigateQueue}
            >
              Open decision queue
            </button>
          </div>

          {/* Widget 2: Service Alerts */}
          <div className="ai-widget-card alerts-widget">
            <div className="widget-header">
              <h3 className="widget-title">Service alerts</h3>
              <p className="widget-subtitle">Requires operational attention</p>
            </div>

            <div className="service-alerts-list">
              <div className="service-alert-item" onClick={onNavigateQueue} style={{ cursor: 'pointer' }}>
                <div className="alert-item-icon icon-amber">
                  <AlertTriangle size={17} />
                </div>
                <div className="alert-item-content">
                  <h4 className="alert-item-heading">Resource matching conflict</h4>
                  <p className="alert-item-detail">3 recommendations compete for RES-021</p>
                </div>
              </div>

              <div className="service-alert-item">
                <div className="alert-item-icon icon-amber">
                  <Clock size={17} />
                </div>
                <div className="alert-item-content">
                  <h4 className="alert-item-heading">Forecast data delayed</h4>
                  <p className="alert-item-detail">Supplier feed is 26 minutes behind</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="ai-modal-backdrop" onClick={() => setShowPolicyModal(false)}>
          <div className="ai-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#0284c7" />
                <h3 className="modal-title">Human-Governed AI Policy &amp; Safety Mandate</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowPolicyModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div className="policy-block">
                <h4>1. Mandatory Human Oversight</h4>
                <p>
                  No AI system operates with full autonomy regarding life-critical, shelter allocation, or priority denial determinations. A human Emergency Coordinator must actively verify context and authorize any decision.
                </p>
              </div>

              <div className="policy-block">
                <h4>2. Full Auditability &amp; Non-Repudiation</h4>
                <p>
                  Every recommendation, confidence metric, and human modification is captured with cryptographic timestamps in the immutable audit trail for full transparency.
                </p>
              </div>

              <div className="policy-block">
                <h4>3. Explainability &amp; Risk Visibility</h4>
                <p>
                  Reviewers are presented with the original citizen narrative, confidence scores, supporting rationale factors, and highlighted operational risks before taking action.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-primary" onClick={() => setShowPolicyModal(false)}>
                Understood &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
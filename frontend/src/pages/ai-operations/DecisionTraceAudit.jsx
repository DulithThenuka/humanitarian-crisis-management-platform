import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  Download, 
  Search, 
  Bell, 
  HelpCircle, 
  Cpu, 
  User, 
  Settings, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const DecisionTraceAudit = ({ 
  caseId = 'REQ-2026-01842', 
  onBackToQueue 
}) => {
  const [activeTab, setActiveTab] = useState('Timeline');
  const [actorFilter, setActorFilter] = useState('All Actors');

  const timelineSteps = [
    {
      id: 1,
      date: '02 Nov 2026',
      time: '10:15 AM',
      actorType: 'system',
      actorColor: 'gray',
      icon: Settings,
      title: 'Request Submitted',
      description: 'Request received via mobile application',
      agentLabel: 'System',
      agentRole: 'Initial submission'
    },
    {
      id: 2,
      date: '02 Nov 2026',
      time: '10:16 AM',
      actorType: 'ai',
      actorColor: 'purple',
      icon: Cpu,
      title: 'Classification Completed',
      description: 'Request classified as Medical Emergency',
      agentLabel: 'AI Engine v2.1',
      agentRole: '92% confidence'
    },
    {
      id: 3,
      date: '02 Nov 2026',
      time: '10:17 AM',
      actorType: 'ai',
      actorColor: 'purple',
      icon: Cpu,
      title: 'Priority Score Calculated',
      description: 'Marked as CRITICAL priority',
      agentLabel: 'AI Engine v2.1',
      agentRole: 'Urgency: 92/100'
    },
    {
      id: 4,
      date: '02 Nov 2026',
      time: '10:18 AM',
      actorType: 'ai',
      actorColor: 'purple',
      icon: Cpu,
      title: 'Duplicate Check Completed',
      description: 'No similar requests found in nearby areas',
      agentLabel: 'AI Engine v2.1',
      agentRole: 'No duplicates'
    },
    {
      id: 5,
      date: '02 Nov 2026',
      time: '10:20 AM',
      actorType: 'ai',
      actorColor: 'purple',
      icon: Cpu,
      title: 'Resource Match Generated',
      description: 'Found 3 available resources (ambulance, medical team, supplies)',
      agentLabel: 'AI Engine v2.1',
      agentRole: '3 matches'
    },
    {
      id: 6,
      date: '02 Nov 2026',
      time: '10:24 AM',
      actorType: 'human',
      actorColor: 'orange',
      icon: User,
      title: 'Reviewed by Field Coordinator',
      description: 'Reviewed AI recommendation and supporting data',
      agentLabel: 'Amara Perera',
      agentRole: 'Field Coordinator'
    },
    {
      id: 7,
      date: '02 Nov 2026',
      time: '10:24 AM',
      actorType: 'human',
      actorColor: 'blue',
      icon: User,
      title: 'Modified Resource Selection',
      description: 'Changed medical team to nearest available unit',
      agentLabel: 'Amara Perera',
      agentRole: 'Field Coordinator'
    },
    {
      id: 8,
      date: '02 Nov 2026',
      time: '10:25 AM',
      actorType: 'system',
      actorColor: 'red',
      icon: Settings,
      title: 'Escalation Rule Check',
      description: 'Confirmed approval required for critical medical requests',
      agentLabel: 'System',
      agentRole: 'Policy Engine'
    },
    {
      id: 9,
      date: '02 Nov 2026',
      time: '10:28 AM',
      actorType: 'human',
      actorColor: 'green',
      icon: User,
      title: 'Decision Approved',
      description: 'Final decision approved and resources dispatched',
      agentLabel: 'Dr. Nimal Fernando',
      agentRole: 'District Manager'
    },
    {
      id: 10,
      date: '02 Nov 2026',
      time: '10:30 AM',
      actorType: 'system',
      actorColor: 'teal',
      icon: Settings,
      title: 'Resources Dispatched',
      description: 'Ambulance and medical team dispatched to location',
      agentLabel: 'System',
      agentRole: 'Notification sent'
    }
  ];

  return (
    <div className="ai-page-canvas">
      {/* Top Breadcrumb Bar */}
      <div className="ai-top-breadcrumb-bar">
        <div className="ai-breadcrumb-path">
          <span className="crumb-root clickable" onClick={onBackToQueue}>AI Operations</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-parent clickable" onClick={onBackToQueue}>Decision Support Queue</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">Decision Trace</span>
        </div>

        <div className="ai-top-header-controls">
          <div className="ai-header-search">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search requests, locations, shelters..." 
              className="ai-search-input"
            />
          </div>

          <div className="ai-header-actions">
            <button className="header-icon-pill" title="Notifications">
              <Bell size={16} />
              <span className="badge-count">3</span>
            </button>
            <button className="header-icon-pill" title="Help">
              <HelpCircle size={16} />
            </button>
            <div className="user-avatar-badge">
              <span>AC</span>
              <ChevronDown size={12} className="chevron" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Title & Action Buttons Header */}
      <div className="ai-page-title-row">
        <div>
          <h1 className="ai-main-heading">Decision Trace &amp; Audit</h1>
          <p className="ai-main-subheading">
            Complete history of AI and human decisions for this request
          </p>
        </div>

        <div className="ai-head-btn-group">
          <button className="btn-outline-white">
            <Download size={14} />
            <span>Export Report</span>
          </button>
          <button className="btn-outline-white" onClick={onBackToQueue}>
            <ChevronLeft size={14} />
            <span>Back to Queue</span>
          </button>
        </div>
      </div>

      {/* Header Info Banner Card (Picture 5) */}
      <div className="trace-case-header-card">
        <div className="trace-header-col-left">
          <div className="red-medical-cross-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
            </svg>
          </div>

          <div className="trace-header-details">
            <div className="trace-id-badge-line">
              <span className="trace-case-id">{caseId}</span>
              <span className="badge-priority critical">CRITICAL</span>
            </div>
            <div className="trace-sub-desc">
              Medical Emergency | Colombo | 02 Nov 2026, 10:15 AM
            </div>
            <div className="trace-source-channel">
              Submitted via Mobile App
            </div>
          </div>
        </div>

        <div className="trace-header-col-middle">
          <div className="trace-meta-col">
            <span className="meta-small-label">Current Status</span>
            <div className="trace-status-pill-wrap">
              <span className="badge-review-status pending">Pending Review</span>
            </div>
            <span className="meta-tiny-sub">In queue for Human Review</span>
          </div>

          <div className="trace-meta-col">
            <span className="meta-small-label">Request Owner</span>
            <div className="meta-user-row">
              <User size={15} color="#475569" />
              <span className="meta-user-name">Amara Perera</span>
            </div>
            <span className="meta-tiny-sub">Field Coordinator · Colombo District</span>
          </div>

          <div className="trace-meta-col">
            <span className="meta-small-label">Last Updated</span>
            <span className="meta-bold-val">02 Nov 2026, 10:30 AM</span>
            <span className="meta-tiny-sub">12 minutes ago</span>
          </div>
        </div>
      </div>

      {/* Subtabs Bar (Picture 5) */}
      <div className="review-horizontal-subtabs">
        <button 
          className={`subtab-btn ${activeTab === 'Timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('Timeline')}
        >
          <Clock size={14} className="tab-icon-svg" />
          <span>Timeline</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Decision Details' ? 'active' : ''}`}
          onClick={() => setActiveTab('Decision Details')}
        >
          <span>Decision Details</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'AI Analysis Data' ? 'active' : ''}`}
          onClick={() => setActiveTab('AI Analysis Data')}
        >
          <span>AI Analysis Data</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Resource Actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('Resource Actions')}
        >
          <span>Resource Actions</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Related Requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('Related Requests')}
        >
          <span>Related Requests</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('Compliance')}
        >
          <span>Compliance</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Files & Evidence' ? 'active' : ''}`}
          onClick={() => setActiveTab('Files & Evidence')}
        >
          <span>Files & Evidence</span>
        </button>
      </div>

      {/* 2-Column Split: Timeline Left, Statistics + Comparison Right */}
      <div className="trace-split-grid">
        {/* Left Column: Decision Timeline Card */}
        <div className="ai-white-card">
          <div className="card-header-flex">
            <div>
              <div className="timeline-title-with-icon">
                <div className="green-brain-icon-badge">
                  <Clock size={16} color="#059669" />
                </div>
                <h2 className="card-section-title">Decision Timeline</h2>
              </div>
              <p className="card-sub-description">
                Chronological history of all AI and human decisions related to this request
              </p>
            </div>

            <div className="actors-filter-dropdown">
              <span>{actorFilter}</span>
              <ChevronDown size={13} />
            </div>
          </div>

          {/* 10 Chronological Timeline Steps (Picture 5) */}
          <div className="timeline-steps-vertical-flow">
            {timelineSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isLast = idx === timelineSteps.length - 1;
              return (
                <div key={step.id} className="timeline-step-row">
                  {/* Column 1: Time */}
                  <div className="step-timestamp-col">
                    <span className="step-date-str">{step.date}</span>
                    <span className="step-time-str">{step.time}</span>
                  </div>

                  {/* Column 2: Node Icon & Connecting Line */}
                  <div className="step-node-col">
                    <div className={`step-node-circle ${step.actorColor}`}>
                      <StepIcon size={12} />
                    </div>
                    {!isLast && <div className="step-connecting-line"></div>}
                  </div>

                  {/* Column 3: Event Details */}
                  <div className="step-content-col">
                    <div className="step-title-bold">{step.title}</div>
                    <div className="step-desc-p">{step.description}</div>
                  </div>

                  {/* Column 4: Actor Info */}
                  <div className="step-actor-col">
                    <div className="step-actor-name">
                      {step.agentLabel}
                    </div>
                    <div className="step-actor-role">
                      {step.agentRole}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Decision Statistics, AI vs Final, Audit & Accountability */}
        <div className="trace-right-sidebar-stack">
          {/* Card 1: Decision Statistics */}
          <div className="ai-white-card">
            <div className="card-header-flex">
              <div className="title-with-icon">
                <div className="green-brain-icon-badge">
                  <FileText size={15} color="#059669" />
                </div>
                <h3 className="card-section-title">Decision Statistics</h3>
              </div>
              <span className="badge-sync-live">
                <i className="green-bullet"></i> Real-time Sync
              </span>
            </div>

            {/* 3 Metric Pills */}
            <div className="stat-kpi-three-pills">
              <div className="stat-pill-row">
                <span className="stat-label-left">Total Processing Time</span>
                <span className="stat-badge-salmon">15 minutes</span>
              </div>
              <div className="stat-pill-row">
                <span className="stat-label-left">AI Processing Time</span>
                <span className="stat-badge-salmon">5 minutes</span>
              </div>
              <div className="stat-pill-row">
                <span className="stat-label-left">Human Review Time</span>
                <span className="stat-badge-salmon">10 minutes</span>
              </div>
            </div>

            <div className="stat-attributes-list">
              <div className="stat-attr-line">
                <span className="attr-title">Final Decision By</span>
                <span className="attr-val-bold">Dr. Nimal Fernando</span>
              </div>
              <div className="stat-attr-line">
                <span className="attr-title">Decision Type</span>
                <span className="attr-val-bold">Modified (AI Recommendation)</span>
              </div>
              <div className="stat-attr-line">
                <span className="attr-title">Resources Assigned</span>
                <span className="attr-val-bold">1 Ambulance, 1 Medical Team, Medical Supplies</span>
              </div>
              <div className="stat-attr-line">
                <span className="attr-title">Related Cases</span>
                <span className="attr-val-bold">2 similar cases in past 30 days</span>
              </div>
            </div>
          </div>

          {/* Card 2: AI Recommendation vs Final Decision */}
          <div className="ai-white-card">
            <div className="title-with-icon mb-12">
              <div className="green-brain-icon-badge">
                <ShieldCheck size={15} color="#059669" />
              </div>
              <h3 className="card-section-title">AI Recommendation vs Final Decision</h3>
            </div>

            <div className="ai-vs-final-dual-box">
              {/* Left Purple Box: AI Recommendation */}
              <div className="comparison-card-box purple">
                <div className="comp-head-row">
                  <Cpu size={14} color="#7c3aed" />
                  <span className="comp-title-text purple">AI Recommendation</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Priority</span>
                  <span className="c-value critical-text">Critical (92/100)</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Category</span>
                  <span className="c-value">Medical Emergency</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Resources</span>
                  <span className="c-value">Ambulance, Medical Team, Supplies</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Location</span>
                  <span className="c-value">Colombo District</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Confidence</span>
                  <span className="c-value">92%</span>
                </div>
              </div>

              {/* Right Yellow Box: Final Decision */}
              <div className="comparison-card-box yellow">
                <div className="comp-head-row">
                  <User size={14} color="#d97706" />
                  <span className="comp-title-text orange">Final Decision</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Priority</span>
                  <span className="c-value critical-text">Critical (92/100)</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Category</span>
                  <span className="c-value">Medical Emergency</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Resources</span>
                  <span className="c-value">Ambulance (Nearest), Medical Team, Supplies</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Location</span>
                  <span className="c-value">Colombo District</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Approved By</span>
                  <span className="c-value bold">Dr. Nimal Fernando</span>
                </div>
                <div className="comp-attr-item">
                  <span className="c-label">Decision</span>
                  <span className="c-value modified-pill">Modified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Audit & Accountability */}
          <div className="ai-white-card">
            <div className="card-header-flex">
              <div className="title-with-icon">
                <ShieldCheck size={16} color="#059669" />
                <h3 className="card-section-title">Audit &amp; Accountability</h3>
              </div>
              <button className="btn-outline-white sm">
                <Download size={13} />
                <span>Download Audit Log</span>
              </button>
            </div>

            <p className="card-sub-description mt-6">
              All actions are logged and immutable for accountability.
            </p>

            <div className="audit-crypto-footer-line">
              <div className="crypto-item">
                <span className="c-label">Log ID:</span>
                <span className="c-val-code">AUD-2026-01842-7739</span>
              </div>
              <div className="crypto-item">
                <span className="c-label">Retention Period:</span>
                <span className="c-val-bold">7 years</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
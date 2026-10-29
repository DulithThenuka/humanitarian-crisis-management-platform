import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Users, 
  ClipboardList, 
  Lock, 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  FileText, 
  BarChart2, 
  Copy, 
  Box, 
  Home, 
  TrendingUp, 
  AlertCircle, 
  Globe, 
  Check, 
  Sliders,
  X,
  Activity,
  Key,
  ShieldAlert
} from 'lucide-react';

export const AIGovernanceSettings = ({ onNavigateWorkspace, onBackOverview }) => {
  const [activeTab, setActiveTab] = useState('Approval Rules');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Priority Approval Rules toggles
  const [priorityRules, setPriorityRules] = useState({
    critical: true,
    high: true,
    medium: false,
    low: false
  });

  // Escalation Categories toggles
  const [escalationRules, setEscalationRules] = useState({
    medical: true,
    childProtection: true,
    fatality: true,
    resourceShortage: false,
    highMedia: true
  });

  // Service enabled statuses
  const [servicesEnabled, setServicesEnabled] = useState({
    classification: true,
    priority: true,
    duplicate: true,
    resource: true,
    shelter: true,
    demand: true,
    anomaly: true,
    multilingual: true,
    summarization: true
  });

  // Notification Settings checkboxes
  const [notificationSettings, setNotificationSettings] = useState({
    highRisk: true,
    duplicateDetection: true,
    escalation: true,
    confidenceThreshold: true
  });

  // Access Control checkboxes
  const [accessControls, setAccessControls] = useState({
    enableAIOps: true,
    restrictAdmin: true,
    resourceManager: true,
    districtCoordinator: true,
    sysAdminFull: true
  });

  // Modal / Drawer state for configuring a service
  const [configuringService, setConfiguringService] = useState(null);

  const handleTogglePriority = (key) => {
    setPriorityRules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleEscalation = (key) => {
    setEscalationRules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleService = (key) => {
    setServicesEnabled(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleNotification = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleAccess = (key) => {
    setAccessControls(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveChanges = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const servicesConfigList = [
    {
      id: 'classification',
      title: 'Request Classification',
      icon: BrainIcon,
      iconColor: '#2563eb',
      iconBg: '#eff6ff',
      workspaceId: 'classification'
    },
    {
      id: 'priority',
      title: 'Priority Scoring',
      icon: BarChart2,
      iconColor: '#9333ea',
      iconBg: '#f3e8ff',
      workspaceId: 'priority'
    },
    {
      id: 'duplicate',
      title: 'Duplicate Detection',
      icon: Copy,
      iconColor: '#16a34a',
      iconBg: '#f0fdf4',
      workspaceId: 'duplicate'
    },
    {
      id: 'resource',
      title: 'Resource Matching',
      icon: Box,
      iconColor: '#0284c7',
      iconBg: '#e0f2fe',
      workspaceId: 'resource'
    },
    {
      id: 'shelter',
      title: 'Shelter Recommendation',
      icon: Home,
      iconColor: '#ea580c',
      iconBg: '#fff7ed',
      workspaceId: 'shelter'
    },
    {
      id: 'demand',
      title: 'Demand Forecasting',
      icon: TrendingUp,
      iconColor: '#0284c7',
      iconBg: '#e0f2fe',
      workspaceId: 'demand'
    },
    {
      id: 'anomaly',
      title: 'Anomaly Detection',
      icon: AlertCircle,
      iconColor: '#dc2626',
      iconBg: '#fee2e2',
      workspaceId: 'anomaly'
    },
    {
      id: 'multilingual',
      title: 'Multilingual Response',
      icon: Globe,
      iconColor: '#2563eb',
      iconBg: '#eff6ff',
      workspaceId: 'multilingual'
    },
    {
      id: 'summarization',
      title: 'Crisis Summarization',
      icon: FileText,
      iconColor: '#0f766e',
      iconBg: '#ccfbf1',
      workspaceId: 'classification'
    }
  ];

  return (
    <div className="ai-page-canvas">
      {/* Top Breadcrumb Bar */}
      <div className="ai-top-breadcrumb-bar">
        <div className="ai-breadcrumb-path">
          <span className="crumb-root clickable" onClick={onBackOverview}>AI Operations</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">Governance &amp; Settings</span>
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

      {/* Main Title Header */}
      <div className="ai-page-title-row">
        <div>
          <h1 className="ai-main-heading">AI Governance &amp; Settings</h1>
          <p className="ai-main-subheading">
            Manage AI services and organisation controls with clear policies and access control.
          </p>
        </div>
      </div>

      {/* Underline Sub-tabs Bar (Picture 6) */}
      <div className="review-horizontal-subtabs">
        <button 
          className={`subtab-btn ${activeTab === 'Approval Rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('Approval Rules')}
        >
          <ShieldCheck size={14} className="tab-icon-svg" />
          <span>Approval Rules</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'AI Service Settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('AI Service Settings')}
        >
          <Sliders size={14} />
          <span>AI Service Settings</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Role Permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('Role Permissions')}
        >
          <Users size={14} />
          <span>Role Permissions</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Audit & Compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('Audit & Compliance')}
        >
          <ClipboardList size={14} />
          <span>Audit &amp; Compliance</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'System Settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('System Settings')}
        >
          <Settings size={14} />
          <span>System Settings</span>
        </button>
      </div>

      {/* TAB 1: APPROVAL RULES (Picture 6) */}
      {activeTab === 'Approval Rules' && (
        <>
          {/* Approval Rules Banner Card */}
          <div className="gov-banner-card">
            <div className="gov-banner-left">
              <div className="gov-shield-icon-box">
                <ShieldCheck size={24} color="#059669" />
              </div>
              <div>
                <h2 className="gov-banner-heading">Approval Rules</h2>
                <p className="gov-banner-sub">
                  Configure rules and thresholds to control AI recommendations.
                </p>
              </div>
            </div>

            <button className="btn-solid-teal save-gov-btn" onClick={handleSaveChanges}>
              {saveSuccess ? <Check size={14} /> : <Lock size={14} />}
              <span>{saveSuccess ? 'Changes Saved!' : 'Save Changes'}</span>
            </button>
          </div>

          {/* Row 1: Priority Approval Rules + Escalation Categories (Left) vs AI Service Configuration (Right) */}
          <div className="gov-main-split-grid">
            {/* Left Column: Two Cards */}
            <div className="gov-left-stack">
              {/* Card 1: Priority Approval Rules */}
              <div className="ai-white-card">
                <div className="card-header-flex title-with-icon">
                  <div className="green-brain-icon-badge">
                    <Sliders size={16} color="#059669" />
                  </div>
                  <h3 className="card-section-title">Priority Approval Rules</h3>
                </div>

                <div className="gov-toggles-list">
                  {/* Critical */}
                  <div className="gov-toggle-line">
                    <span className="gov-rule-label">Critical (Score ≥ 90)</span>
                    <div className="gov-toggle-action-wrap">
                      <label className="switch-toggle">
                        <input 
                          type="checkbox" 
                          checked={priorityRules.critical} 
                          onChange={() => handleTogglePriority('critical')} 
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="gov-action-desc">Always require human approval</span>
                    </div>
                  </div>

                  {/* High */}
                  <div className="gov-toggle-line">
                    <span className="gov-rule-label">High (Score 70 - 89)</span>
                    <div className="gov-toggle-action-wrap">
                      <label className="switch-toggle">
                        <input 
                          type="checkbox" 
                          checked={priorityRules.high} 
                          onChange={() => handleTogglePriority('high')} 
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="gov-action-desc">Require approval for resource allocation</span>
                    </div>
                  </div>

                  {/* Medium */}
                  <div className="gov-toggle-line">
                    <span className="gov-rule-label">Medium (Score 40 - 69)</span>
                    <div className="gov-toggle-action-wrap">
                      <label className="switch-toggle">
                        <input 
                          type="checkbox" 
                          checked={priorityRules.medium} 
                          onChange={() => handleTogglePriority('medium')} 
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="gov-action-desc">Allow auto-approve (suggestion only)</span>
                    </div>
                  </div>

                  {/* Low */}
                  <div className="gov-toggle-line">
                    <span className="gov-rule-label">Low (Score &lt; 40)</span>
                    <div className="gov-toggle-action-wrap">
                      <label className="switch-toggle">
                        <input 
                          type="checkbox" 
                          checked={priorityRules.low} 
                          onChange={() => handleTogglePriority('low')} 
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="gov-action-desc">Allow auto-assign (suggestion only)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Escalation Categories */}
              <div className="ai-white-card">
                <div className="card-header-flex title-with-icon">
                  <div className="green-brain-icon-badge">
                    <ShieldCheck size={16} color="#059669" />
                  </div>
                  <h3 className="card-section-title">Escalation Categories</h3>
                </div>

                <div className="gov-toggles-list">
                  {/* Medical Emergencies */}
                  <div className="gov-toggle-line">
                    <span className="gov-rule-label">Medical Emergencies</span>
                    <div className="gov-toggle-action-wrap">
                      <label className="switch-toggle">
                        <input 
                          type="checkbox" 
                          checked={escalationRules.medical} 
                          onChange={() => handleToggleEscalation('medical')} 
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="gov-action-desc">Require human approval</span>
                    </div>
                  </div>

                  {/* Child Protection */}
                  <div className="gov-toggle-line">
                    <span className="gov-rule-label">Child Protection</span>
                    <div className="gov-toggle-action-wrap">
                      <label className="switch-toggle">
                        <input 
                          type="checkbox" 
                          checked={escalationRules.childProtection} 
                          onChange={() => handleToggleEscalation('childProtection')} 
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="gov-action-desc">Require human approval</span>
                    </div>
                  </div>

                  {/* Fatality Assistance */}
                  <div className="gov-toggle-line">
                    <span className="gov-rule-label">Fatality Assistance</span>
                    <div className="gov-toggle-action-wrap">
                      <label className="switch-toggle">
                        <input 
                          type="checkbox" 
                          checked={escalationRules.fatality} 
                          onChange={() => handleToggleEscalation('fatality')} 
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="gov-action-desc">Require human approval</span>
                    </div>
                  </div>

                  {/* Resource Shortage */}
                  <div className="gov-toggle-line">
                    <span className="gov-rule-label">Resource Shortage</span>
                    <div className="gov-toggle-action-wrap">
                      <label className="switch-toggle">
                        <input 
                          type="checkbox" 
                          checked={escalationRules.resourceShortage} 
                          onChange={() => handleToggleEscalation('resourceShortage')} 
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="gov-action-desc">Allow auto-approve (with alert)</span>
                    </div>
                  </div>

                  {/* High Media Attention */}
                  <div className="gov-toggle-line">
                    <span className="gov-rule-label">High Media Attention</span>
                    <div className="gov-toggle-action-wrap">
                      <label className="switch-toggle">
                        <input 
                          type="checkbox" 
                          checked={escalationRules.highMedia} 
                          onChange={() => handleToggleEscalation('highMedia')} 
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="gov-action-desc">Require approval by senior coordinator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Service Configuration Card (Picture 6) */}
            <div className="ai-white-card">
              <div className="card-header-flex title-with-icon">
                <div className="green-brain-icon-badge">
                  <Settings size={16} color="#059669" />
                </div>
                <h3 className="card-section-title">AI Service Configuration</h3>
              </div>

              <div className="ai-service-config-rows">
                {servicesConfigList.map((srv) => {
                  const IconComp = srv.icon;
                  const isEnabled = servicesEnabled[srv.id];
                  return (
                    <div key={srv.id} className="service-config-item">
                      <div className="srv-config-left">
                        <div className="srv-icon-badge" style={{ backgroundColor: srv.iconBg }}>
                          <IconComp size={15} color={srv.iconColor} />
                        </div>
                        <span className="srv-config-name">{srv.title}</span>
                      </div>

                      <div className="srv-config-right">
                        <button 
                          className={`btn-enabled-pill ${isEnabled ? 'on' : 'off'}`}
                          onClick={() => handleToggleService(srv.id)}
                          title="Click to toggle Enabled/Disabled"
                        >
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </button>

                        <button 
                          className="btn-outline-white sm configure-btn"
                          onClick={() => onNavigateWorkspace ? onNavigateWorkspace(srv.workspaceId) : setConfiguringService(srv)}
                          title="Open dedicated Service Workspace"
                        >
                          Configure
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 2: Notification Settings (Left) & Access Control (Right) */}
          <div className="gov-bottom-dual-grid">
            {/* Notification Settings */}
            <div className="ai-white-card">
              <div className="card-header-flex title-with-icon">
                <div className="blue-icon-circle-badge">
                  <Bell size={15} color="#2563eb" />
                </div>
                <h3 className="card-section-title">Notification Settings</h3>
              </div>

              <div className="checkboxes-stack-list">
                <label className="custom-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.highRisk}
                    onChange={() => handleToggleNotification('highRisk')}
                    className="checkbox-blue"
                  />
                  <span className="cb-label-text">Notify coordinators when AI flags high-risk requests</span>
                </label>

                <label className="custom-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.duplicateDetection}
                    onChange={() => handleToggleNotification('duplicateDetection')}
                    className="checkbox-blue"
                  />
                  <span className="cb-label-text">Notify on duplicate detection</span>
                </label>

                <label className="custom-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.escalation}
                    onChange={() => handleToggleNotification('escalation')}
                    className="checkbox-blue"
                  />
                  <span className="cb-label-text">Notify on escalation of prioritization requests</span>
                </label>

                <label className="custom-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.confidenceThreshold}
                    onChange={() => handleToggleNotification('confidenceThreshold')}
                    className="checkbox-blue"
                  />
                  <span className="cb-label-text">Notify when AI confidence is below threshold</span>
                </label>
              </div>
            </div>

            {/* Access Control */}
            <div className="ai-white-card">
              <div className="card-header-flex title-with-icon">
                <div className="blue-icon-circle-badge">
                  <Users size={15} color="#2563eb" />
                </div>
                <h3 className="card-section-title">Access Control</h3>
              </div>

              <div className="checkboxes-stack-list">
                <label className="custom-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={accessControls.enableAIOps}
                    onChange={() => handleToggleAccess('enableAIOps')}
                    className="checkbox-blue"
                  />
                  <span className="cb-label-text">Enable AI operations</span>
                </label>

                <label className="custom-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={accessControls.restrictAdmin}
                    onChange={() => handleToggleAccess('restrictAdmin')}
                    className="checkbox-blue"
                  />
                  <span className="cb-label-text">Restrict configuration to administrators</span>
                </label>

                <label className="custom-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={accessControls.resourceManager}
                    onChange={() => handleToggleAccess('resourceManager')}
                    className="checkbox-blue"
                  />
                  <span className="cb-label-text">Resource manager access</span>
                </label>

                <label className="custom-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={accessControls.districtCoordinator}
                    onChange={() => handleToggleAccess('districtCoordinator')}
                    className="checkbox-blue"
                  />
                  <span className="cb-label-text">District coordinator access</span>
                </label>

                <label className="custom-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={accessControls.sysAdminFull}
                    onChange={() => handleToggleAccess('sysAdminFull')}
                    className="checkbox-blue"
                  />
                  <span className="cb-label-text">System administrator full access</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: AI SERVICE SETTINGS */}
      {activeTab === 'AI Service Settings' && (
        <div className="ai-white-card">
          <div className="card-header-flex title-with-icon mb-12">
            <div className="green-brain-icon-badge">
              <Sliders size={16} color="#059669" />
            </div>
            <div>
              <h3 className="card-section-title">Global AI Service Parameters &amp; Endpoints</h3>
              <p className="section-subtext">Manage latency limits, inference timeouts, and safety fallback thresholds.</p>
            </div>
          </div>

          <div className="ai-service-config-rows">
            {servicesConfigList.map((srv) => (
              <div key={srv.id} className="service-config-item" style={{ padding: '14px 16px' }}>
                <div className="srv-config-left">
                  <div className="srv-icon-badge" style={{ backgroundColor: srv.iconBg }}>
                    <srv.icon size={16} color={srv.iconColor} />
                  </div>
                  <div>
                    <div className="srv-config-name" style={{ fontSize: '13.5px' }}>{srv.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Model: BERT-Crisis-v2.4 | Latency SLA: &lt; 250ms</div>
                  </div>
                </div>

                <div className="srv-config-right" style={{ gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                    <span>Confidence Cutoff:</span>
                    <strong style={{ color: '#059669' }}>85%</strong>
                  </div>
                  <button 
                    className="btn-outline-white sm configure-btn"
                    onClick={() => onNavigateWorkspace ? onNavigateWorkspace(srv.workspaceId) : setConfiguringService(srv)}
                  >
                    Open Workspace
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ROLE PERMISSIONS */}
      {activeTab === 'Role Permissions' && (
        <div className="ai-white-card">
          <div className="card-header-flex title-with-icon mb-12">
            <div className="blue-icon-circle-badge">
              <Users size={16} color="#2563eb" />
            </div>
            <div>
              <h3 className="card-section-title">Human-in-the-Loop AI Governance Matrix</h3>
              <p className="section-subtext">Fine-grained access controls defining which staff tiers can override or configure models.</p>
            </div>
          </div>

          <table className="queue-data-table mt-4">
            <thead>
              <tr>
                <th>Role Tier</th>
                <th>Override AI Decisions</th>
                <th>Reconfigure Thresholds</th>
                <th>View Audit Traces</th>
                <th>Emergency Kill-Switch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>System Administrator</strong></td>
                <td><span className="badge-review-status approved">● Granted</span></td>
                <td><span className="badge-review-status approved">● Granted</span></td>
                <td><span className="badge-review-status approved">● Granted</span></td>
                <td><span className="badge-review-status approved">● Granted</span></td>
              </tr>
              <tr>
                <td><strong>District Coordinator</strong></td>
                <td><span className="badge-review-status approved">● Granted</span></td>
                <td><span className="badge-review-status pending">● View Only</span></td>
                <td><span className="badge-review-status approved">● Granted</span></td>
                <td><span className="badge-review-status rejected">● Restricted</span></td>
              </tr>
              <tr>
                <td><strong>Logistics Manager</strong></td>
                <td><span className="badge-review-status approved">● Dispatch Only</span></td>
                <td><span className="badge-review-status rejected">● Restricted</span></td>
                <td><span className="badge-review-status approved">● Granted</span></td>
                <td><span className="badge-review-status rejected">● Restricted</span></td>
              </tr>
              <tr>
                <td><strong>Field First Responder</strong></td>
                <td><span className="badge-review-status rejected">● Restricted</span></td>
                <td><span className="badge-review-status rejected">● Restricted</span></td>
                <td><span className="badge-review-status rejected">● Restricted</span></td>
                <td><span className="badge-review-status rejected">● Restricted</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: AUDIT & COMPLIANCE */}
      {activeTab === 'Audit & Compliance' && (
        <div className="ai-white-card">
          <div className="card-header-flex title-with-icon mb-12">
            <div className="green-brain-icon-badge">
              <ClipboardList size={16} color="#059669" />
            </div>
            <div>
              <h3 className="card-section-title">Compliance &amp; Algorithmic Accountability</h3>
              <p className="section-subtext">Verification status against humanitarian AI ethics and transparency benchmarks.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '16px 0 24px' }}>
            <div style={{ padding: '14px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '11px', color: '#047857', fontWeight: '700' }}>HUMANITARIAN ETHICS CHARTER</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#065f46', marginTop: '4px' }}>100% Compliant</div>
              <div style={{ fontSize: '11.5px', color: '#059669', marginTop: '2px' }}>Zero unverified automated dispatches</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: '700' }}>DEMOGRAPHIC PARITY BIAS</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e40af', marginTop: '4px' }}>0.02% Variance</div>
              <div style={{ fontSize: '11.5px', color: '#2563eb', marginTop: '2px' }}>Passes fair-allocation criteria</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: '#faf5ff', border: '1px solid #e9d5ff' }}>
              <div style={{ fontSize: '11px', color: '#7e22ce', fontWeight: '700' }}>LEDGER HASH CHAIN INTEGRITY</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#6b21a8', marginTop: '4px' }}>SHA-256 Valid</div>
              <div style={{ fontSize: '11.5px', color: '#7c3aed', marginTop: '2px' }}>14,289 blocks verified intact</div>
            </div>
          </div>

          <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12.5px', color: '#334155' }}>
            All algorithmic suggestions are accompanied by human-readable explanation vectors, model confidence metrics, and immutable audit logs available for inspection under the UN OCHA Relief Standard.
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM SETTINGS */}
      {activeTab === 'System Settings' && (
        <div className="ai-white-card">
          <div className="card-header-flex title-with-icon mb-12">
            <div className="green-brain-icon-badge">
              <Settings size={16} color="#059669" />
            </div>
            <div>
              <h3 className="card-section-title">System Infrastructure &amp; Circuit Breakers</h3>
              <p className="section-subtext">Manage automated fallback failovers, memory caching, and model version rollbacks.</p>
            </div>
          </div>

          <div className="gov-toggles-list mt-4">
            <div className="gov-toggle-line">
              <span className="gov-rule-label">Automatic Heuristic Fallback</span>
              <div className="gov-toggle-action-wrap">
                <label className="switch-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
                <span className="gov-action-desc">Fall back to rule-engine triage if inference API latency exceeds 500ms</span>
              </div>
            </div>

            <div className="gov-toggle-line">
              <span className="gov-rule-label">PII Anonymization Filter</span>
              <div className="gov-toggle-action-wrap">
                <label className="switch-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
                <span className="gov-action-desc">Mask names and contact numbers before sending tokens to language model</span>
              </div>
            </div>

            <div className="gov-toggle-line">
              <span className="gov-rule-label">Emergency Operations Killswitch</span>
              <div className="gov-toggle-action-wrap">
                <label className="switch-toggle">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
                <span className="gov-action-desc">Immediately pause all AI suggestion pipelines and switch to 100% manual dispatch</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Service Quick Configuration */}
      {configuringService && (
        <div className="modal-backdrop-overlay">
          <div className="service-config-modal-card">
            <div className="modal-header-flex">
              <div className="modal-title-left">
                <Sliders size={18} color="#059669" />
                <h3 className="modal-title-text">{configuringService.title} Policies</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setConfiguringService(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body-form">
              <div className="form-group-line">
                <label className="form-field-label">Service Operational Status</label>
                <div>
                  <button 
                    className={`btn-enabled-pill ${servicesEnabled[configuringService.id] ? 'on' : 'off'}`}
                    onClick={() => handleToggleService(configuringService.id)}
                  >
                    {servicesEnabled[configuringService.id] ? 'Active & Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div className="form-group-line">
                <label className="form-field-label">Human Review Threshold</label>
                <input type="range" min="50" max="99" defaultValue="85" className="range-slider-control" />
                <span className="slider-hint">Recommendations scoring below 85% confidence strictly require coordinator sign-off.</span>
              </div>

              <div className="form-group-line">
                <label className="form-field-label">Escalation Notification Group</label>
                <select className="form-select-control" defaultValue="district">
                  <option value="district">District Coordinator Group (Urgent SMS + Push)</option>
                  <option value="lead">National Logistics Lead (Direct Call + Dispatch)</option>
                  <option value="field">Field Rapid Response Unit (Radio + Mesh)</option>
                </select>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button 
                className="btn-outline-white" 
                onClick={() => {
                  const ws = configuringService.workspaceId;
                  setConfiguringService(null);
                  if (onNavigateWorkspace) onNavigateWorkspace(ws);
                }}
              >
                Open Service Workspace &rarr;
              </button>
              <button className="btn-solid-teal" onClick={() => setConfiguringService(null)}>
                Save Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// SVG helper for brain icon
const BrainIcon = ({ size = 16, color = '#2563eb' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
  </svg>
);
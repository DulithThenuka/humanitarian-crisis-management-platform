import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Share2, 
  Printer, 
  FileEdit, 
  MoreHorizontal, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  PlusSquare, 
  AlertTriangle, 
  Users, 
  Home, 
  FileText, 
  Radio, 
  UserCheck, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Package, 
  ChevronRight, 
  Star, 
  User, 
  ExternalLink, 
  X, 
  ChevronDown, 
  Search, 
  Bell, 
  Clock, 
  Compass,
  Inbox,
  AlertCircle
} from 'lucide-react';

import reqLocationMap from '../../assets/req-location-map.jpg';
import reqEvidence1 from '../../assets/req-evidence-1.jpg';
import reqEvidence2 from '../../assets/req-evidence-2.jpg';
import sarahJohnson from '../../assets/sarah-johnson.jpg';
import { useAlert } from '../../context/AlertContext';

import './AssistanceRequestDetailPage.css';

export const AssistanceRequestDetailPage = ({ 
  isEmbedded = false,
  onNavigateTab,
  onOpenMap
}) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Tab State
  const [activeTab, setActiveTab] = useState('timeline');

  // Request State
  const [requestStatus, setRequestStatus] = useState('Under Review');
  const [requestPriority, setRequestPriority] = useState('Critical Priority');
  const [isApproved, setIsApproved] = useState(false);

  // Modals
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  // Form states
  const [modifyPriority, setModifyPriority] = useState('Critical');
  const [modifyReason, setModifyReason] = useState('');
  const [newNote, setNewNote] = useState('');

  // Timeline events list
  const [timelineEvents, setTimelineEvents] = useState([
    {
      id: 'e1',
      type: 'submit',
      time: '15 Jun 2026, 10:24 AM',
      relative: '2 min ago',
      title: 'Request submitted by Nimal Perera',
      description: 'Medical Assistance request created.',
      nodeStyle: 'node-blue'
    },
    {
      id: 'e2',
      type: 'ai',
      time: '15 Jun 2026, 10:25 AM',
      relative: '',
      title: 'AI analysis completed',
      description: 'Recommended priority: HIGH (91% confidence).',
      nodeStyle: 'node-green'
    },
    {
      id: 'e3',
      type: 'review',
      time: '15 Jun 2026, 10:27 AM',
      relative: '',
      title: 'Pending human review',
      description: 'Awaiting coordinator decision.',
      nodeStyle: 'node-grey'
    }
  ]);

  const handleApprove = () => {
    setIsApproved(true);
    setRequestStatus('Approved');
    const newEvent = {
      id: 'e-' + Date.now(),
      type: 'approve',
      time: 'Just now',
      relative: 'Just now',
      title: 'Request Approved by Sarah Johnson',
      description: 'AI recommendation approved without modifications. Proceeding to resource allocation.',
      nodeStyle: 'node-green'
    };
    setTimelineEvents([newEvent, ...timelineEvents]);
    showAlert("Request approved! Resource allocation workflow initialized.", "success");
  };

  const handleCommitModify = () => {
    if (!modifyReason.trim()) {
      showAlert("Please provide a reason for overriding AI recommendation.", "error");
      return;
    }
    setRequestPriority(`${modifyPriority} Priority`);
    setShowModifyModal(false);
    const newEvent = {
      id: 'e-' + Date.now(),
      type: 'modify',
      time: 'Just now',
      relative: 'Just now',
      title: `Priority Modified to ${modifyPriority.toUpperCase()} by Sarah Johnson`,
      description: `Reason: ${modifyReason}`,
      nodeStyle: 'node-blue'
    };
    setTimelineEvents([newEvent, ...timelineEvents]);
    showAlert(`Priority updated to ${modifyPriority}`, "success");
    setModifyReason('');
  };

  const handleAddNoteCommit = () => {
    if (!newNote.trim()) return;
    setShowNoteModal(false);
    const newEvent = {
      id: 'e-' + Date.now(),
      type: 'note',
      time: 'Just now',
      relative: 'Just now',
      title: 'Coordinator Note Added',
      description: newNote,
      nodeStyle: 'node-blue'
    };
    setTimelineEvents([newEvent, ...timelineEvents]);
    showAlert("Note appended to request activity timeline.", "success");
    setNewNote('');
  };

  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showAlert("Request permalink copied to clipboard!", "success");
    } else {
      showAlert("Link copied: REQ-2026-01842", "success");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewOnMapClick = () => {
    if (onOpenMap) {
      onOpenMap();
    } else {
      navigate('/map');
    }
  };

  return (
    <div className="req-detail-container">
      {/* 1. Sub-Header: Breadcrumbs & Top Search (rendered if not embedded in a header) */}
      {!isEmbedded && (
        <div className="req-top-nav-bar">
          <div className="req-breadcrumb-wrap">
            <span className="req-bc-icon">
              <Inbox size={15} />
            </span>
            <span 
              className="req-bc-parent" 
              onClick={() => onNavigateTab ? onNavigateTab('requests') : navigate('/coordinator/dashboard')}
            >
              Assistance Requests
            </span>
            <span className="req-bc-sep">&gt;</span>
            <span className="req-bc-current">REQ-2026-01842</span>
          </div>

          <div className="req-top-right-group">
            <div className="req-search-box">
              <Search size={14} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Search requests, locations, resources..." 
                className="req-search-input"
              />
            </div>

            <button className="req-bell-wrap" title="Notifications">
              <Bell size={18} />
              <span className="req-bell-badge">1</span>
            </button>

            <div className="req-user-badge">
              <img src={sarahJohnson} alt="Sarah Johnson" className="req-user-avatar" />
              <div>
                <div className="req-user-name">Sarah Johnson</div>
                <div className="req-user-sub">Emergency Coordinator</div>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Title Row with Badges & Action Buttons */}
      <div className="req-header-section">
        <div className="req-header-row-top">
          <div className="req-title-cluster">
            <h1 className="req-page-title">Request #REQ-2026-01842</h1>
            <span className="req-badge-review">{requestStatus}</span>
            <span className="req-badge-critical">
              <Star size={12} fill="#ffffff" stroke="#ffffff" />
              {requestPriority}
            </span>
          </div>

          <div className="req-actions-cluster">
            <button className="req-action-btn" onClick={handleShare}>
              <Share2 size={14} color="#475569" />
              <span>Share</span>
            </button>
            <button className="req-action-btn" onClick={handlePrint}>
              <Printer size={14} color="#475569" />
              <span>Print</span>
            </button>
            <button className="req-action-btn" onClick={() => setShowNoteModal(true)}>
              <FileEdit size={14} color="#475569" />
              <span>Add Note</span>
            </button>
            <button className="req-action-btn req-action-btn-more" title="More Options">
              <MoreHorizontal size={15} color="#475569" />
            </button>
          </div>
        </div>

        <div className="req-meta-row">
          <User size={13} color="#94a3b8" />
          <span>Submitted on 15 Jun 2026, 10:24 AM</span>
          <span className="req-meta-sep">|</span>
          <span>Last updated: 2 min ago</span>
        </div>
      </div>

      {/* 3. Horizontal Stepper Pipeline */}
      <div className="req-stepper-card">
        {/* Step 1: Submitted */}
        <div className="req-step-item">
          <div className="req-step-node completed">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="req-step-title">Submitted</span>
          <span className="req-step-sub">15 Jun 2026<br />10:24 AM</span>
        </div>

        <div className="req-step-connector completed"></div>

        {/* Step 2: AI Assessment */}
        <div className="req-step-item">
          <div className="req-step-node in-progress">
            <div className="req-step-pulse"></div>
          </div>
          <span className="req-step-title active-blue">AI Assessment</span>
          <span className="req-step-sub active-blue">In Progress</span>
        </div>

        <div className="req-step-connector"></div>

        {/* Step 3: Human Review */}
        <div className="req-step-item">
          <div className="req-step-node pending"></div>
          <span className="req-step-title">Human Review</span>
          <span className="req-step-sub">Pending</span>
        </div>

        <div className="req-step-connector"></div>

        {/* Step 4: Resource Allocation */}
        <div className="req-step-item">
          <div className="req-step-node pending"></div>
          <span className="req-step-title">Resource Allocation</span>
          <span className="req-step-sub">Pending</span>
        </div>

        <div className="req-step-connector"></div>

        {/* Step 5: Assistance Delivered */}
        <div className="req-step-item">
          <div className="req-step-node pending"></div>
          <span className="req-step-title">Assistance Delivered</span>
          <span className="req-step-sub">Pending</span>
        </div>
      </div>

      {/* 4. Main Two-Column Content Grid */}
      <div className="req-main-grid">
        {/* Left Column (Approx 68%) */}
        <div className="req-col-left">
          {/* Row Top: Requester Information + Location */}
          <div className="req-row-top">
            {/* Requester Information */}
            <div className="req-card">
              <h3 className="req-card-title">Requester Information</h3>
              <div className="req-requester-body">
                <div className="req-requester-left">
                  <div className="req-avatar-large">
                    <User size={26} />
                  </div>
                  <div className="req-requester-name">Nimal Perera</div>
                  <div className="req-contact-item">
                    <Phone size={13} color="#64748b" />
                    <span>+94 77 123 4567</span>
                  </div>
                  <div className="req-contact-item">
                    <Mail size={13} color="#64748b" />
                    <span>nimalp@example.com</span>
                  </div>
                  <div className="req-badge-vulnerable">
                    <span className="req-badge-dot-blue"></span>
                    <span>Vulnerable household</span>
                  </div>
                </div>

                <div className="req-requester-right">
                  <div className="req-kv-block">
                    <span className="req-kv-label">Household Size</span>
                    <span className="req-kv-value">3 people</span>
                  </div>

                  <div className="req-kv-block">
                    <span className="req-kv-label">Special Requirements</span>
                    <span className="req-kv-value">Elderly, wheelchair access</span>
                  </div>

                  <div className="req-kv-block">
                    <span className="req-kv-label">Preferred Language</span>
                    <span className="req-kv-value">English / Sinhala</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="req-card req-location-card">
              <h3 className="req-card-title">Location</h3>
              
              <div className="req-map-thumb-wrap" onClick={handleViewOnMapClick} style={{ cursor: 'pointer' }}>
                <img 
                  src={reqLocationMap} 
                  alt="Colombo, Western Province Map Location" 
                  className="req-map-thumb-img" 
                />
              </div>

              <div className="req-location-footer">
                <div className="req-loc-text-col">
                  <MapPin size={16} color="#475569" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div className="req-loc-name">Colombo, Western Province</div>
                    <div className="req-loc-coords">6.9271° N, 79.8612° E</div>
                  </div>
                </div>

                <button className="req-btn-view-map" onClick={handleViewOnMapClick}>
                  <ExternalLink size={12} />
                  <span>View on Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row Bottom: Request Details + (Supporting Evidence & Related Info) */}
          <div className="req-row-bottom">
            {/* Request Details */}
            <div className="req-card req-details-card">
              <h3 className="req-card-title">Request Details</h3>

              <div className="req-details-list">
                {/* 1. Category */}
                <div className="req-detail-row">
                  <div className="req-detail-icon">
                    <PlusSquare size={16} color="#dc2626" />
                  </div>
                  <span className="req-detail-label">Category</span>
                  <span className="req-detail-val bold">Medical Assistance</span>
                </div>

                {/* 2. Urgency Level */}
                <div className="req-detail-row">
                  <div className="req-detail-icon">
                    <AlertTriangle size={16} color="#d97706" />
                  </div>
                  <span className="req-detail-label">Urgency Level</span>
                  <div>
                    <span className="req-pill-crit">Critical</span>
                  </div>
                </div>

                {/* 3. Number of People */}
                <div className="req-detail-row">
                  <div className="req-detail-icon">
                    <Users size={16} color="#0284c7" />
                  </div>
                  <span className="req-detail-label">Number of People</span>
                  <span className="req-detail-val">3</span>
                </div>

                {/* 4. Location */}
                <div className="req-detail-row">
                  <div className="req-detail-icon">
                    <MapPin size={16} color="#0284c7" />
                  </div>
                  <span className="req-detail-label">Location</span>
                  <span className="req-detail-val">Colombo, Western Province</span>
                </div>

                {/* 5. Description */}
                <div className="req-detail-row">
                  <div className="req-detail-icon">
                    <Home size={16} color="#0284c7" />
                  </div>
                  <span className="req-detail-label">Description</span>
                  <span className="req-detail-val desc">
                    Elderly person with serious health condition needs immediate medical assistance. Unable to reach hospital due to flooding. Requires urgent transport and medical team.
                  </span>
                </div>

                {/* 6. Special Requirements */}
                <div className="req-detail-row">
                  <div className="req-detail-icon">
                    <ShieldCheck size={16} color="#0284c7" />
                  </div>
                  <span className="req-detail-label">Special Requirements</span>
                  <span className="req-detail-val">
                    Elderly, wheelchair access, ongoing medication
                  </span>
                </div>
              </div>
            </div>

            {/* Supporting Evidence + Related Information */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Supporting Evidence */}
              <div className="req-card req-evidence-card">
                <div className="req-evidence-header">
                  <h3 className="req-card-title" style={{ margin: 0 }}>Supporting Evidence</h3>
                  <span 
                    className="req-view-all-link"
                    onClick={() => setShowEvidenceModal(true)}
                  >
                    View All (3)
                  </span>
                </div>

                <div className="req-evidence-grid">
                  <img 
                    src={reqEvidence1} 
                    alt="Flooded residential sector" 
                    className="req-evidence-thumb"
                    onClick={() => { setSelectedEvidence(reqEvidence1); setShowEvidenceModal(true); }}
                  />
                  <img 
                    src={reqEvidence2} 
                    alt="Rescue boat operations" 
                    className="req-evidence-thumb"
                    onClick={() => { setSelectedEvidence(reqEvidence2); setShowEvidenceModal(true); }}
                  />
                  <div 
                    className="req-pdf-card"
                    onClick={() => showAlert("Opening document: Medical Report.pdf (1.2 MB)", "info")}
                  >
                    <FileText size={24} color="#60a5fa" />
                    <span className="req-pdf-name">Medical Report.pdf</span>
                    <span className="req-pdf-size">1.2 MB</span>
                  </div>
                </div>
              </div>

              {/* Related Information */}
              <div className="req-card">
                <h3 className="req-card-title">Related Information</h3>

                <div className="req-related-list">
                  {/* Row 1: Crisis Event */}
                  <div className="req-related-row">
                    <div className="req-related-left">
                      <Radio size={14} color="#0284c7" />
                      <span className="req-related-label">Crisis Event</span>
                      <span className="req-related-val">Flood Response - Western Province</span>
                    </div>
                    <button 
                      className="req-btn-outline-sm"
                      onClick={() => onNavigateTab ? onNavigateTab('crisis') : showAlert("Viewing Western Province Crisis details", "info")}
                    >
                      View Crisis
                    </button>
                  </div>

                  {/* Row 2: Operational Area */}
                  <div className="req-related-row">
                    <div className="req-related-left">
                      <Compass size={14} color="#0284c7" />
                      <span className="req-related-label">Operational Area</span>
                      <span className="req-related-val">Colombo District - Zone A</span>
                    </div>
                    <button 
                      className="req-btn-outline-sm"
                      onClick={() => onNavigateTab ? onNavigateTab('maps') : handleViewOnMapClick()}
                    >
                      View Area
                    </button>
                  </div>

                  {/* Row 3: Assigned To */}
                  <div className="req-related-row">
                    <div className="req-related-left">
                      <UserCheck size={14} color="#0284c7" />
                      <span className="req-related-label">Assigned To</span>
                      <span className="req-related-val italic-unassigned">Not yet assigned</span>
                    </div>
                    <button 
                      className="req-btn-outline-sm"
                      onClick={() => showAlert("Quick assign modal opened for Dispatch Teams", "info")}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Decision Support (~32%) */}
        <div className="req-col-right">
          <div className="req-card req-ai-card">
            {/* Header */}
            <div className="req-ai-header">
              <div className="req-ai-header-left">
                <Sparkles size={18} className="req-ai-sparkle-icon" />
                <span className="req-ai-title">AI Decision Support</span>
              </div>
              <button 
                className="req-btn-full-analysis"
                onClick={() => setActiveTab('ai-analysis')}
              >
                <span>View Full Analysis</span>
                <span style={{ fontSize: '12px' }}>→</span>
              </button>
            </div>

            {/* Metric Row: Recommended Priority + Confidence */}
            <div className="req-ai-metric-row">
              <div className="req-ai-metric-col">
                <span className="req-ai-metric-label">Recommended Priority</span>
                <div className="req-ai-priority-box">
                  <Star size={13} fill="#ffffff" stroke="#ffffff" />
                  <span>HIGH</span>
                </div>
              </div>

              <div className="req-ai-metric-col">
                <span className="req-ai-metric-label">Confidence</span>
                <div className="req-ai-gauge-box">
                  <div className="req-ai-donut-wrap">
                    <svg className="req-ai-donut-svg" viewBox="0 0 44 44">
                      <circle cx="22" cy="22" r="18" className="req-ai-donut-bg" />
                      <circle cx="22" cy="22" r="18" className="req-ai-donut-meter" />
                    </svg>
                    <span className="req-ai-donut-text">91%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reasoning */}
            <div className="req-ai-section">
              <span className="req-ai-section-title">Reasoning</span>
              <p className="req-ai-reasoning-text">
                Medical emergency detected for vulnerable household located within flood affected zone. Immediate assistance required based on keywords and location analysis.
              </p>
            </div>

            {/* Key Factors */}
            <div className="req-ai-section">
              <span className="req-ai-section-title">Key Factors</span>
              <div className="req-ai-factor-list">
                <div className="req-ai-factor-item">
                  <PlusSquare size={14} className="req-factor-icon-red" />
                  <span>Medical emergency</span>
                </div>
                <div className="req-ai-factor-item">
                  <User size={14} className="req-factor-icon-orange" />
                  <span>Vulnerable household (elderly)</span>
                </div>
                <div className="req-ai-factor-item">
                  <Compass size={14} className="req-factor-icon-blue" />
                  <span>Located in high-risk flood zone</span>
                </div>
                <div className="req-ai-factor-item">
                  <ShieldCheck size={14} className="req-factor-icon-green" />
                  <span>Limited access to healthcare</span>
                </div>
              </div>
            </div>

            {/* Suggested Actions */}
            <div className="req-ai-section">
              <span className="req-ai-section-title">Suggested Actions</span>
              <div className="req-ai-action-list">
                <div className="req-ai-action-item">
                  <Radio size={14} className="req-action-icon-teal" />
                  <span>Deploy medical response team</span>
                </div>
                <div className="req-ai-action-item">
                  <Building2 size={14} className="req-action-icon-teal" />
                  <span>Arrange temporary shelter if required</span>
                </div>
                <div className="req-ai-action-item">
                  <Package size={14} className="req-action-icon-teal" />
                  <span>Provide emergency transportation</span>
                </div>
                <div className="req-ai-action-item">
                  <ChevronRight size={14} className="req-action-icon-teal" />
                  <span>Prioritise for immediate allocation</span>
                </div>
              </div>
            </div>

            {/* Human Review Required Callout */}
            <div className="req-ai-warning-box">
              <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div className="req-ai-warning-title">Human Review Required</div>
                <p className="req-ai-warning-sub">
                  AI recommendation must be reviewed and approved by an authorised coordinator.
                </p>
              </div>
            </div>

            {/* Decision Action Buttons */}
            <div className="req-ai-btn-row">
              <button 
                className="req-btn-approve"
                onClick={handleApprove}
                disabled={isApproved}
                style={{ opacity: isApproved ? 0.7 : 1 }}
              >
                {isApproved ? 'Approved ✓' : 'Approve'}
              </button>
              <button 
                className="req-btn-modify"
                onClick={() => setShowModifyModal(true)}
              >
                Modify
              </button>
              <button 
                className="req-btn-reject"
                onClick={() => {
                  setRequestStatus('Rejected');
                  showAlert("Request REQ-2026-01842 marked as Rejected.", "error");
                }}
              >
                Reject
              </button>
              <button 
                className="req-btn-defer"
                onClick={() => {
                  setRequestStatus('Deferred');
                  showAlert("Request deferred for next operational shift.", "info");
                }}
              >
                Defer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Tabs & Activity Timeline Section */}
      <div className="req-bottom-section">
        {/* Tabs Bar */}
        <div className="req-tabs-bar">
          <button 
            className={`req-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Activity Timeline
          </button>
          <button 
            className={`req-tab-btn ${activeTab === 'ai-analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-analysis')}
          >
            AI Analysis
          </button>
          <button 
            className={`req-tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
          <button 
            className={`req-tab-btn ${activeTab === 'communications' ? 'active' : ''}`}
            onClick={() => setActiveTab('communications')}
          >
            Communications
          </button>
          <button 
            className={`req-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            Audit History
          </button>
        </div>

        {/* Tab Content */}
        <div className="req-tab-content">
          {activeTab === 'timeline' && (
            <div className="req-timeline-list">
              {timelineEvents.map((evt) => (
                <div key={evt.id} className="req-timeline-item">
                  <div className="req-timeline-line"></div>
                  
                  <div className={`req-timeline-node ${evt.nodeStyle}`}>
                    {evt.nodeStyle === 'node-blue' && <div className="node-inner-dot-blue"></div>}
                    {evt.nodeStyle === 'node-green' && <Check size={12} strokeWidth={3} />}
                    {evt.nodeStyle === 'node-grey' && <div className="node-inner-dot-grey"></div>}
                  </div>

                  <div className="req-timeline-time">{evt.time}</div>

                  <div className="req-timeline-body">
                    <span className="req-timeline-event-title">{evt.title}</span>
                    <span className="req-timeline-event-desc">{evt.description}</span>
                  </div>

                  <div className="req-timeline-meta-right">{evt.relative}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ai-analysis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>NLP Model</div>
                  <div style={{ fontWeight: 700, marginTop: '4px' }}>Bi-Encoder Transformer v4.2</div>
                  <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>Inference Latency: 42ms</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Flood Hazard Overlay</div>
                  <div style={{ fontWeight: 700, marginTop: '4px' }}>Zone 1 High Inundation (1.4m)</div>
                  <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '2px' }}>Risk Factor: 0.94</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Vulnerability Score</div>
                  <div style={{ fontWeight: 700, marginTop: '4px' }}>Composite Score: 9.2 / 10</div>
                  <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '2px' }}>Elderly resident + wheelchair</div>
                </div>
              </div>
              <p style={{ color: '#475569', lineHeight: 1.5, margin: 0 }}>
                <strong>Semantic Extraction:</strong> Extracted emergency entities: <code>medical emergency</code>, <code>elderly wheelchair</code>, <code>inaccessible hospital</code>.
                Proximity matching recommends dispatch from Western Regional Hospital Mobile Unit 2 (3.8 km away).
              </p>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div style={{ fontSize: '13px', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600 }}>Field Units & Dispatch Assignments</span>
                <button 
                  className="req-btn-outline-sm"
                  onClick={() => showAlert("Assigning closest mobile ambulance unit...", "info")}
                >
                  + Assign Unit
                </button>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontStyle: 'italic', color: '#64748b' }}>No units assigned yet. Awaiting coordinator triage approval.</span>
              </div>
            </div>
          )}

          {activeTab === 'communications' && (
            <div style={{ fontSize: '13px', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600 }}>SMS & Dispatch Log with Requester</span>
                <button 
                  className="req-btn-outline-sm"
                  onClick={() => showAlert("Opening outbound SMS dispatch modal...", "info")}
                >
                  Send SMS Notification
                </button>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>15 Jun 2026, 10:24 AM</div>
                <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>SMS Sent to +94 77 123 4567</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                  "ReliefCore Alert: Your assistance request #REQ-2026-01842 has been received. Our coordination team is evaluating dispatch."
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div style={{ fontSize: '13px', color: '#475569' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Cryptographic Governance Trail</div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '11.5px' }}>
                <div>BLOCK_HASH: 0x8f2a49b21dc33e08...ba71</div>
                <div>ENTITY: REQ-2026-01842 | AI_SUGGESTION: HIGH (91.0%) | ACTOR: Sarah Johnson</div>
                <div>SIGNATURE: VERIFIED_ED25519_IMMUTABLE</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modify Priority Modal */}
      {showModifyModal && (
        <div className="req-modal-overlay" onClick={() => setShowModifyModal(false)}>
          <div className="req-modal-box" onClick={e => e.stopPropagation()}>
            <div className="req-modal-header">
              <h3 className="req-modal-title">Modify Recommendation & Priority</h3>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }} 
                onClick={() => setShowModifyModal(false)}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>
            <div className="req-modal-body">
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Adjusted Priority Level
                </label>
                <select 
                  value={modifyPriority} 
                  onChange={e => setModifyPriority(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="Critical">Critical Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Coordinator Justification (Mandatory Audit Trail)
                </label>
                <textarea 
                  rows={3}
                  placeholder="Provide operational reason for this override..."
                  value={modifyReason}
                  onChange={e => setModifyReason(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div className="req-modal-footer">
              <button className="req-action-btn" onClick={() => setShowModifyModal(false)}>Cancel</button>
              <button className="req-btn-approve" style={{ padding: '7px 18px' }} onClick={handleCommitModify}>
                Save Modification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="req-modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="req-modal-box" onClick={e => e.stopPropagation()}>
            <div className="req-modal-header">
              <h3 className="req-modal-title">Add Coordinator Note</h3>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }} 
                onClick={() => setShowNoteModal(false)}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>
            <div className="req-modal-body">
              <textarea 
                rows={4}
                placeholder="Type your notes regarding this request, field verification, or dispatch directives..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div className="req-modal-footer">
              <button className="req-action-btn" onClick={() => setShowNoteModal(false)}>Cancel</button>
              <button className="req-btn-approve" style={{ padding: '7px 18px' }} onClick={handleAddNoteCommit}>
                Post Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Full View Modal */}
      {showEvidenceModal && (
        <div className="req-modal-overlay" onClick={() => setShowEvidenceModal(false)}>
          <div className="req-modal-box" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div className="req-modal-header">
              <h3 className="req-modal-title">Supporting Evidence Gallery (3 items)</h3>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }} 
                onClick={() => setShowEvidenceModal(false)}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>
            <div className="req-modal-body" style={{ alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
                <img 
                  src={reqEvidence1} 
                  alt="Flooded house" 
                  style={{ width: '48%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} 
                />
                <img 
                  src={reqEvidence2} 
                  alt="Rescue boat" 
                  style={{ width: '48%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} 
                />
              </div>
              <div style={{ marginTop: '12px', width: '100%', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={28} color="#3b82f6" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>Medical Report.pdf</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>1.2 MB • Uploaded by Requester</div>
                  </div>
                </div>
                <button className="req-btn-view-map" onClick={() => showAlert("Downloading Medical Report.pdf...", "info")}>
                  Download
                </button>
              </div>
            </div>
            <div className="req-modal-footer">
              <button className="req-action-btn" onClick={() => setShowEvidenceModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

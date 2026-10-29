import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronLeft, 
  Copy, 
  Lock, 
  Sparkles, 
  Plus, 
  Truck, 
  Users, 
  FileText, 
  MapPin, 
  Layers, 
  ExternalLink,
  Search,
  Bell,
  HelpCircle,
  Check
} from 'lucide-react';

export const AIDecisionReview = ({ 
  caseId = 'REQ-2026-01842', 
  onBackToQueue, 
  onViewTrace 
}) => {
  const [activeTab, setActiveTab] = useState('AI Analysis');
  const [activeRecTab, setActiveRecTab] = useState('Resources');
  const [selectedPriority, setSelectedPriority] = useState('Critical');
  const [selectedDecision, setSelectedDecision] = useState('Modify');
  const [selectedResources, setSelectedResources] = useState(['mobile-unit', 'ambulance']);
  const [reasonText, setReasonText] = useState(
    'Approved with modification. Send nearest available medical unit and ambulance. Monitor situation and update in 1 hour.'
  );
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleResource = (id) => {
    setSelectedResources(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(
      "Your request has been received and is under review. A medical team is being arranged and will reach your location as soon as possible."
    );
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleSaveDecision = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onBackToQueue();
    }, 1200);
  };

  return (
    <div className="ai-page-canvas">
      {/* Top Breadcrumb Bar */}
      <div className="ai-top-breadcrumb-bar">
        <div className="ai-breadcrumb-path">
          <span className="crumb-root clickable" onClick={onBackToQueue}>AI Operations</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-parent clickable" onClick={onBackToQueue}>Decision Support Queue</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">Decision Review</span>
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

      {/* Case Header Card (Picture 3) */}
      <div className="review-case-header-card">
        <div className="case-header-left">
          <div className="red-medical-cross-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
            </svg>
          </div>

          <div className="case-header-titles">
            <div className="case-id-badges-line">
              <h1 className="case-id-heading">{caseId}</h1>
              <span className="badge-priority critical">CRITICAL</span>
              <span className="badge-review-status pending">Pending Review</span>
            </div>
            <div className="case-meta-subline">
              <span>Medical Emergency</span>
              <span className="sep-bullet">|</span>
              <span>Colombo</span>
              <span className="sep-bullet">|</span>
              <span>02 Nov 2026, 10:15 AM</span>
            </div>
            <div className="case-channel-subline">
              Submitted via Mobile App
            </div>
          </div>
        </div>

        <div className="case-header-actions">
          <button className="btn-outline-white" onClick={() => onViewTrace(caseId)}>
            <FileText size={14} />
            <span>View Trace</span>
          </button>
          <button className="btn-outline-white dropdown">
            <span>More</span>
            <ChevronDown size={13} />
          </button>
        </div>
      </div>

      {/* Underline Sub-tabs Bar (Picture 3) */}
      <div className="review-horizontal-subtabs">
        <button 
          className={`subtab-btn ${activeTab === 'AI Analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('AI Analysis')}
        >
          <Sparkles size={14} className="tab-icon-svg" />
          <span>AI Analysis</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Request Details' ? 'active' : ''}`}
          onClick={() => setActiveTab('Request Details')}
        >
          <span>Request Details</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Location & Map' ? 'active' : ''}`}
          onClick={() => setActiveTab('Location & Map')}
        >
          <span>Location & Map</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Recommended Resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('Recommended Resources')}
        >
          <span>Recommended Resources</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Similar Requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('Similar Requests')}
        >
          <span>Similar Requests</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'Files & Evidence' ? 'active' : ''}`}
          onClick={() => setActiveTab('Files & Evidence')}
        >
          <span>Files & Evidence</span>
        </button>
      </div>

      {/* 2-Column Split: AI Analysis Results & AI Recommendations */}
      <div className="ai-charts-split-grid review-split-grid">
        {/* Left Card: AI Analysis Results */}
        <div className="ai-white-card">
          <div className="card-header-flex title-with-icon">
            <div className="green-brain-icon-badge">
              <Sparkles size={16} color="#059669" />
            </div>
            <h2 className="card-section-title">AI Analysis Results</h2>
          </div>

          <div className="analysis-classification-block">
            <div className="classification-label">AI Classification</div>
            <div className="classification-bold-val">Medical Emergency</div>
            <div className="classification-conf-sub">High confidence match</div>
          </div>

          <div className="metric-progress-line-group">
            <div className="progress-stat-header">
              <span className="stat-name">Urgency Score</span>
              <span className="stat-number-val red-text">92 / 100</span>
            </div>
            <div className="progress-track-bg">
              <div className="progress-fill-bar red-gradient" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div className="metric-progress-line-group">
            <div className="progress-stat-header">
              <span className="stat-name">Confidence</span>
              <span className="stat-number-val purple-text">88%</span>
            </div>
            <div className="progress-track-bg">
              <div className="progress-fill-bar purple-gradient" style={{ width: '88%' }}></div>
            </div>
          </div>

          <div className="key-factors-container">
            <h3 className="key-factors-heading">Key Factors</h3>
            <ul className="factors-dots-list">
              <li>
                <span className="factor-dot green"></span>
                <span>Matches medical high-priority patterns</span>
              </li>
              <li>
                <span className="factor-dot green"></span>
                <span>Critical location (urban area)</span>
              </li>
              <li>
                <span className="factor-dot green"></span>
                <span>Multiple vulnerable people affected</span>
              </li>
              <li>
                <span className="factor-dot yellow"></span>
                <span>Limited local medical facilities</span>
              </li>
              <li>
                <span className="factor-dot gray"></span>
                <span>Recent similar requests in nearby areas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Card: AI Recommendations */}
        <div className="ai-white-card">
          <div className="card-header-flex title-with-icon">
            <div className="green-brain-icon-badge">
              <Sparkles size={16} color="#059669" />
            </div>
            <h2 className="card-section-title">AI Recommendations</h2>
          </div>

          {/* Sub-tabs: Resources, Shelter, Volunteers, Communication */}
          <div className="rec-category-pills-bar">
            <button 
              className={`rec-cat-btn ${activeRecTab === 'Resources' ? 'active' : ''}`}
              onClick={() => setActiveRecTab('Resources')}
            >
              Resources
            </button>
            <button 
              className={`rec-cat-btn ${activeRecTab === 'Shelter' ? 'active' : ''}`}
              onClick={() => setActiveRecTab('Shelter')}
            >
              Shelter
            </button>
            <button 
              className={`rec-cat-btn ${activeRecTab === 'Volunteers' ? 'active' : ''}`}
              onClick={() => setActiveRecTab('Volunteers')}
            >
              Volunteers
            </button>
            <button 
              className={`rec-cat-btn ${activeRecTab === 'Communication' ? 'active' : ''}`}
              onClick={() => setActiveRecTab('Communication')}
            >
              Communication
            </button>
          </div>

          {/* 3 Recommended Resource items */}
          <div className="recommended-resources-list">
            {/* Resource 1 */}
            <div className={`rec-resource-item ${selectedResources.includes('mobile-unit') ? 'selected' : ''}`}>
              <div className="rec-item-left">
                <div className="rec-avatar-circle green">
                  <Plus size={16} color="#16a34a" />
                </div>
                <div className="rec-info-col">
                  <div className="rec-title-row">
                    <span className="rec-name">Mobile Medical Unit</span>
                    <span className="badge-avail-pill">Available</span>
                  </div>
                  <div className="rec-detail-text">From Colombo Health District</div>
                  <div className="rec-eta-text">ETA: 30 mins</div>
                </div>
              </div>
              <button 
                className={`btn-select-rec ${selectedResources.includes('mobile-unit') ? 'selected' : ''}`}
                onClick={() => toggleResource('mobile-unit')}
              >
                {selectedResources.includes('mobile-unit') ? 'Selected' : 'Select'}
              </button>
            </div>

            {/* Resource 2 */}
            <div className={`rec-resource-item ${selectedResources.includes('ambulance') ? 'selected' : ''}`}>
              <div className="rec-item-left">
                <div className="rec-avatar-circle red">
                  <Truck size={16} color="#dc2626" />
                </div>
                <div className="rec-info-col">
                  <div className="rec-title-row">
                    <span className="rec-name">Ambulance Transport</span>
                    <span className="badge-avail-pill">Available</span>
                  </div>
                  <div className="rec-detail-text">From Colombo Emergency Unit</div>
                  <div className="rec-eta-text">ETA: 45 mins</div>
                </div>
              </div>
              <button 
                className={`btn-select-rec ${selectedResources.includes('ambulance') ? 'selected' : ''}`}
                onClick={() => toggleResource('ambulance')}
              >
                {selectedResources.includes('ambulance') ? 'Selected' : 'Select'}
              </button>
            </div>

            {/* Resource 3 */}
            <div className={`rec-resource-item ${selectedResources.includes('medical-team') ? 'selected' : ''}`}>
              <div className="rec-item-left">
                <div className="rec-avatar-circle blue">
                  <Users size={16} color="#2563eb" />
                </div>
                <div className="rec-info-col">
                  <div className="rec-title-row">
                    <span className="rec-name">Medical Team</span>
                    <span className="badge-avail-pill">Available</span>
                  </div>
                  <div className="rec-detail-text">From Local Volunteer Network</div>
                  <div className="rec-eta-text">ETA: 1 hour</div>
                </div>
              </div>
              <button 
                className={`btn-select-rec ${selectedResources.includes('medical-team') ? 'selected' : ''}`}
                onClick={() => toggleResource('medical-team')}
              >
                {selectedResources.includes('medical-team') ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>

          {/* Multilingual Citizen Response Sub-Box */}
          <div className="multilingual-response-container">
            <div className="multi-resp-head">
              <span className="multi-resp-title">Multilingual Citizen Response (AI Generated)</span>
              <div className="multi-resp-controls">
                <div className="lang-dropdown-pill">
                  <span>{selectedLanguage}</span>
                  <ChevronDown size={12} />
                </div>
                <button className="copy-icon-btn" onClick={handleCopyResponse} title="Copy to clipboard">
                  {copiedResponse ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="multi-resp-textbox">
              "Your request has been received and is under review. A medical team is being arranged and will reach your location as soon as possible."
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Human Decision (Picture 3) */}
      <div className="human-decision-card">
        <div className="decision-header-row">
          <div className="decision-title-group">
            <div className="orange-user-circle">
              <Users size={16} color="#ea580c" />
            </div>
            <h2 className="decision-heading">Human Decision</h2>
          </div>
        </div>

        {/* Radio Option 1: Final Priority */}
        <div className="decision-radio-group">
          <span className="radio-group-label">Final Priority</span>
          <div className="radios-inline-list">
            <label className="custom-radio-item">
              <input 
                type="radio" 
                name="finalPriority" 
                value="Critical" 
                checked={selectedPriority === 'Critical'}
                onChange={(e) => setSelectedPriority(e.target.value)}
              />
              <span className="radio-custom-disc"></span>
              <span className="radio-text">Critical</span>
            </label>

            <label className="custom-radio-item">
              <input 
                type="radio" 
                name="finalPriority" 
                value="High" 
                checked={selectedPriority === 'High'}
                onChange={(e) => setSelectedPriority(e.target.value)}
              />
              <span className="radio-custom-disc"></span>
              <span className="radio-text">High</span>
            </label>

            <label className="custom-radio-item">
              <input 
                type="radio" 
                name="finalPriority" 
                value="Medium" 
                checked={selectedPriority === 'Medium'}
                onChange={(e) => setSelectedPriority(e.target.value)}
              />
              <span className="radio-custom-disc"></span>
              <span className="radio-text">Medium</span>
            </label>

            <label className="custom-radio-item">
              <input 
                type="radio" 
                name="finalPriority" 
                value="Low" 
                checked={selectedPriority === 'Low'}
                onChange={(e) => setSelectedPriority(e.target.value)}
              />
              <span className="radio-custom-disc"></span>
              <span className="radio-text">Low</span>
            </label>
          </div>
        </div>

        {/* Radio Option 2: Decision */}
        <div className="decision-radio-group">
          <span className="radio-group-label">Decision</span>
          <div className="radios-inline-list">
            <label className="custom-radio-item">
              <input 
                type="radio" 
                name="decisionAction" 
                value="Approve" 
                checked={selectedDecision === 'Approve'}
                onChange={(e) => setSelectedDecision(e.target.value)}
              />
              <span className="radio-custom-disc"></span>
              <span className="radio-text">Approve</span>
            </label>

            <label className="custom-radio-item">
              <input 
                type="radio" 
                name="decisionAction" 
                value="Modify" 
                checked={selectedDecision === 'Modify'}
                onChange={(e) => setSelectedDecision(e.target.value)}
              />
              <span className="radio-custom-disc"></span>
              <span className="radio-text">Modify</span>
            </label>

            <label className="custom-radio-item">
              <input 
                type="radio" 
                name="decisionAction" 
                value="Reject" 
                checked={selectedDecision === 'Reject'}
                onChange={(e) => setSelectedDecision(e.target.value)}
              />
              <span className="radio-custom-disc"></span>
              <span className="radio-text">Reject</span>
            </label>

            <label className="custom-radio-item">
              <input 
                type="radio" 
                name="decisionAction" 
                value="Refer" 
                checked={selectedDecision === 'Refer'}
                onChange={(e) => setSelectedDecision(e.target.value)}
              />
              <span className="radio-custom-disc"></span>
              <span className="radio-text">Refer</span>
            </label>
          </div>
        </div>

        {/* Reason for decision & Save Button */}
        <div className="decision-reason-row">
          <div className="reason-input-col">
            <label className="reason-field-label">Reason for decision (optional)</label>
            <input 
              type="text" 
              className="reason-text-input" 
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Provide governance rationale..."
            />
          </div>

          <button className="btn-solid-teal save-decision-btn" onClick={handleSaveDecision}>
            <Lock size={14} />
            <span>{savedSuccess ? 'Saved!' : 'Save Decision'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
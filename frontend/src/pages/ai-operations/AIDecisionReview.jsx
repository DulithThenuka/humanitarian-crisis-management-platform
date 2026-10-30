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
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  Radio,
  FileCheck,
  Share2,
  Volume2,
  Image,
  RefreshCw,
  X
} from 'lucide-react';
import { MULTILINGUAL_TRANSLATIONS } from './aiOperationsData';

export const AIDecisionReview = ({ 
  caseId = 'REQ-2026-01842', 
  queueData = [],
  onUpdateQueueItem,
  onBackToQueue, 
  onViewTrace,
  showToast 
}) => {
  // Find case in queueData or fallback
  const currentCase = queueData.find(q => q.id === caseId) || {
    id: caseId,
    category: 'Medical Assistance',
    location: 'Colombo 07 - Cinnamon Gardens',
    priority: 'CRITICAL',
    confidence: '94%',
    urgencyScore: 92,
    caller: 'Dr. Priyantha Silva',
    phone: '+94 77 123 4567',
    summary: 'Elderly care home with 6 trapped residents requiring continuous oxygen and insulin. Basement generator inundated.'
  };

  const [activeTab, setActiveTab] = useState('AI Analysis');
  const [activeRecTab, setActiveRecTab] = useState('Resources');
  const [selectedPriority, setSelectedPriority] = useState(currentCase.priority === 'CRITICAL' ? 'Critical' : 'High');
  const [selectedDecision, setSelectedDecision] = useState('Modify');
  const [selectedResources, setSelectedResources] = useState(['mobile-unit', 'ambulance']);
  const [reasonText, setReasonText] = useState(
    'Approved with modification. Send nearest available mobile medical unit and high-clearance ambulance. Monitor situation and update in 1 hour.'
  );

  // Multilingual state
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [isRegeneratingResp, setIsRegeneratingResp] = useState(false);

  // More Header dropdown
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleResource = (id) => {
    setSelectedResources(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleCopyResponse = () => {
    const textToCopy = MULTILINGUAL_TRANSLATIONS[selectedLanguage] || MULTILINGUAL_TRANSLATIONS.English;
    navigator.clipboard.writeText(textToCopy);
    setCopiedResponse(true);
    showToast?.('Citizen response text copied to clipboard', 'info');
    setTimeout(() => setCopiedResponse(false), 2200);
  };

  const handleRegenerateResponse = () => {
    setIsRegeneratingResp(true);
    setTimeout(() => {
      setIsRegeneratingResp(false);
      showToast?.('AI regenerated empathetic citizen notification with dynamic GPS ETA', 'success');
    }, 600);
  };

  const handleSaveDecision = () => {
    setSavedSuccess(true);
    onUpdateQueueItem(currentCase.id, {
      priority: selectedPriority.toUpperCase(),
      priorityColor: selectedPriority.toLowerCase(),
      reviewStatus: selectedDecision === 'Approve' ? 'Approved' : selectedDecision === 'Reject' ? 'Rejected' : selectedDecision === 'Refer' ? 'Deferred' : 'Modified',
      reviewStatusType: selectedDecision === 'Approve' ? 'approved' : selectedDecision === 'Reject' ? 'critical' : selectedDecision === 'Refer' ? 'deferred' : 'approved',
      humanDecision: `${selectedDecision} by Sarah Johnson (Coordinator): ${reasonText}`,
      actionType: 'trace'
    });

    showToast?.(`Decision recorded: ${selectedDecision} for ${currentCase.id}`, 'success');

    setTimeout(() => {
      setSavedSuccess(false);
      onBackToQueue();
    }, 900);
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
          <span className="crumb-current">{caseId}</span>
        </div>

        <div className="ai-top-header-controls">
          <div className="ai-header-search">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search case notes, triage factors..." 
              className="ai-search-input"
            />
          </div>

          <div className="ai-header-actions">
            <button className="header-icon-pill" title="Notifications">
              <Bell size={16} />
              <span className="badge-count">3</span>
            </button>
            <div className="user-avatar-badge">
              <span>SJ</span>
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
              <h1 className="case-id-heading">{currentCase.id}</h1>
              <span className={`badge-priority ${currentCase.priority?.toLowerCase() || 'critical'}`}>
                {currentCase.priority}
              </span>
              <span className="badge-review-status pending">
                {currentCase.reviewStatus || 'Pending Review'}
              </span>
            </div>
            <div className="case-meta-subline">
              <span>{currentCase.category}</span>
              <span className="sep-bullet">|</span>
              <span>{currentCase.location}</span>
              <span className="sep-bullet">|</span>
              <span>Caller: {currentCase.caller || 'Dr. Priyantha Silva'} ({currentCase.phone || '+94 77 123 4567'})</span>
            </div>
            <div className="case-channel-subline">
              Submitted via Citizen Mobile App • AI Model: ReliefCore-BERT-Triage-v4
            </div>
          </div>
        </div>

        <div className="case-header-actions">
          <button className="btn-outline-white" onClick={() => onViewTrace(caseId)} title="View cryptographic audit trace">
            <FileText size={14} />
            <span>View Trace</span>
          </button>

          <div className="relative-more-menu-wrap">
            <button 
              className="btn-outline-white dropdown"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              <span>Actions</span>
              <ChevronDown size={13} className={showMoreMenu ? 'rotate-180' : ''} />
            </button>

            {showMoreMenu && (
              <div className="ai-more-dropdown-menu">
                <button 
                  className="menu-action-item"
                  onClick={() => {
                    setShowMoreMenu(false);
                    showToast?.('Exporting complete case dossier PDF...', 'info');
                  }}
                >
                  <FileCheck size={14} />
                  <span>Print Case Dossier</span>
                </button>
                <button 
                  className="menu-action-item"
                  onClick={() => {
                    setShowMoreMenu(false);
                    showToast?.('Re-running neural inference on case data...', 'info');
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Re-evaluate with AI</span>
                </button>
                <button 
                  className="menu-action-item"
                  onClick={() => {
                    setShowMoreMenu(false);
                    showToast?.('Case flagged for Human Rights &amp; Ethics review', 'info');
                  }}
                >
                  <AlertTriangle size={14} />
                  <span>Flag for Ethics Review</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Underline Sub-tabs Bar (Picture 3) - NOW FULLY WORKING */}
      <div className="review-horizontal-subtabs">
        {[
          { id: 'AI Analysis', label: 'AI Analysis', icon: Sparkles },
          { id: 'Request Details', label: 'Request Details', icon: FileText },
          { id: 'Location & Map', label: 'Location & Map', icon: MapPin },
          { id: 'Recommended Resources', label: 'Recommended Resources', icon: Truck },
          { id: 'Similar Requests', label: 'Similar Requests', icon: Layers },
          { id: 'Files & Evidence', label: 'Files & Evidence', icon: Image }
        ].map(tab => {
          const IconComp = tab.icon;
          return (
            <button 
              key={tab.id}
              className={`subtab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComp size={14} className="tab-icon-svg" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC CONTENT SWITCHER BASED ON ACTIVE SUB-TAB */}
      {activeTab === 'AI Analysis' && (
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
              <div className="classification-bold-val">{currentCase.category}</div>
              <div className="classification-conf-sub">Confidence: {currentCase.confidence} match</div>
            </div>

            <div className="metric-progress-line-group">
              <div className="progress-stat-header">
                <span className="stat-name">Urgency Score</span>
                <span className="stat-number-val red-text">{currentCase.urgencyScore || 92} / 100</span>
              </div>
              <div className="progress-track-bg">
                <div 
                  className="progress-fill-bar red-gradient" 
                  style={{ width: `${currentCase.urgencyScore || 92}%` }}
                ></div>
              </div>
            </div>

            <div className="metric-progress-line-group">
              <div className="progress-stat-header">
                <span className="stat-name">Confidence</span>
                <span className="stat-number-val purple-text">{currentCase.confidence}</span>
              </div>
              <div className="progress-track-bg">
                <div 
                  className="progress-fill-bar purple-gradient" 
                  style={{ width: currentCase.confidence }}
                ></div>
              </div>
            </div>

            <div className="key-factors-container">
              <h3 className="key-factors-heading">Key Explainability Factors</h3>
              <ul className="factors-dots-list">
                <li>
                  <span className="factor-dot green"></span>
                  <span>Matches medical emergency life-threat pattern (keyword cluster: oxygen, insulin, elderly)</span>
                </li>
                <li>
                  <span className="factor-dot green"></span>
                  <span>Critical urban location in inundation path</span>
                </li>
                <li>
                  <span className="factor-dot green"></span>
                  <span>Vulnerable demographic count: 6 elderly citizens</span>
                </li>
                <li>
                  <span className="factor-dot yellow"></span>
                  <span>Road blockage alert detected on primary access route (Ward Place)</span>
                </li>
                <li>
                  <span className="factor-dot gray"></span>
                  <span>Nearest medical hospital (National Hospital) at 88% capacity</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Card: AI Recommendations & Multilingual Generator */}
          <div className="ai-white-card">
            <div className="card-header-flex title-with-icon">
              <div className="green-brain-icon-badge">
                <Sparkles size={16} color="#059669" />
              </div>
              <h2 className="card-section-title">AI Recommendations</h2>
            </div>

            {/* Sub-tabs: Resources, Shelter, Volunteers, Communication */}
            <div className="rec-category-pills-bar">
              {['Resources', 'Shelter', 'Volunteers', 'Communication'].map(tab => (
                <button 
                  key={tab}
                  className={`rec-cat-btn ${activeRecTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveRecTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Recommended Resource items */}
            <div className="recommended-resources-list">
              {/* Resource 1 */}
              <div className={`rec-resource-item ${selectedResources.includes('mobile-unit') ? 'selected' : ''}`}>
                <div className="rec-item-left">
                  <div className="rec-avatar-circle green">
                    <Plus size={16} color="#16a34a" />
                  </div>
                  <div className="rec-info-col">
                    <div className="rec-title-row">
                      <span className="rec-name">Mobile Medical Unit #2</span>
                      <span className="badge-avail-pill">Available</span>
                    </div>
                    <div className="rec-detail-text">From Colombo Health District Station</div>
                    <div className="rec-eta-text">ETA: 30 mins • Oxygen &amp; Vitals Equip</div>
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
                      <span className="rec-name">High-Clearance Ambulance 4x4</span>
                      <span className="badge-avail-pill">Available</span>
                    </div>
                    <div className="rec-detail-text">Colombo Disaster Management Emergency Unit</div>
                    <div className="rec-eta-text">ETA: 45 mins • Capable of 0.8m fording</div>
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
                      <span className="rec-name">Rapid Nurse &amp; Paramedic Team</span>
                      <span className="badge-avail-pill">Available</span>
                    </div>
                    <div className="rec-detail-text">Red Cross Emergency Medical Volunteer Network</div>
                    <div className="rec-eta-text">ETA: 55 mins • 3 Certified Paramedics</div>
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

            {/* Multilingual Citizen Response Sub-Box with REAL Language Switcher */}
            <div className="multilingual-response-container">
              <div className="multi-resp-head">
                <span className="multi-resp-title">Multilingual Citizen Response (AI Generated)</span>
                <div className="multi-resp-controls">
                  <div className="relative-lang-selector">
                    <button 
                      className="lang-dropdown-pill"
                      onClick={() => setShowLangMenu(!showLangMenu)}
                    >
                      <span>{selectedLanguage}</span>
                      <ChevronDown size={12} className={showLangMenu ? 'rotate-180' : ''} />
                    </button>

                    {showLangMenu && (
                      <div className="lang-popover-menu">
                        {Object.keys(MULTILINGUAL_TRANSLATIONS).map(lang => (
                          <button
                            key={lang}
                            className={`lang-opt-item ${selectedLanguage === lang ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setShowLangMenu(false);
                            }}
                          >
                            <span>{lang}</span>
                            {selectedLanguage === lang && <Check size={12} color="#0f766e" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    className="copy-icon-btn" 
                    onClick={handleRegenerateResponse}
                    title="Regenerate with AI"
                    disabled={isRegeneratingResp}
                  >
                    <RefreshCw size={13} className={isRegeneratingResp ? 'spin-icon' : ''} />
                  </button>

                  <button className="copy-icon-btn" onClick={handleCopyResponse} title="Copy to clipboard">
                    {copiedResponse ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="multi-resp-textbox">
                "{MULTILINGUAL_TRANSLATIONS[selectedLanguage] || MULTILINGUAL_TRANSLATIONS.English}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Request Details */}
      {activeTab === 'Request Details' && (
        <div className="ai-white-card">
          <h2 className="card-section-title">Request Dossier &amp; Incident Telemetry</h2>
          <div className="dossier-grid">
            <div className="dossier-item">
              <span className="dossier-label">Request Identifier</span>
              <span className="dossier-value code-font">{currentCase.id}</span>
            </div>
            <div className="dossier-item">
              <span className="dossier-label">Reporting Party</span>
              <span className="dossier-value">{currentCase.caller}</span>
            </div>
            <div className="dossier-item">
              <span className="dossier-label">Contact Phone</span>
              <span className="dossier-value text-teal">{currentCase.phone}</span>
            </div>
            <div className="dossier-item">
              <span className="dossier-label">Incident Location</span>
              <span className="dossier-value">{currentCase.location}</span>
            </div>
            <div className="dossier-item">
              <span className="dossier-label">Vulnerable Persons Count</span>
              <span className="dossier-value font-bold">{currentCase.affectedCount || 6} persons</span>
            </div>
            <div className="dossier-item">
              <span className="dossier-label">Submission Channel</span>
              <span className="dossier-value">Citizen Mobile App (v2.8) • GPS Verified</span>
            </div>
          </div>
          <div className="incident-raw-block">
            <span className="dossier-label">Raw Citizen Message</span>
            <blockquote className="raw-quote">
              "{currentCase.summary}"
            </blockquote>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Location & Map */}
      {activeTab === 'Location & Map' && (
        <div className="ai-white-card">
          <h2 className="card-section-title">Geospatial Context &amp; Proximity Matching</h2>
          <div className="map-context-layout">
            <div className="mock-map-visual-box">
              <div className="map-radar-ring"></div>
              <MapPin size={32} color="#dc2626" className="pin-center" />
              <div className="map-hud-overlay">
                <span>Lat: 6.9147° N, Lon: 79.8732° E</span>
                <span>Flood Stage: 2.1m (High Risk)</span>
              </div>
            </div>
            <div className="map-facilities-list">
              <h4>Nearest Verified Facilities</h4>
              <div className="facility-row">
                <span>Colombo National Hospital (Emergency Trauma)</span>
                <span className="badge-avail-pill">1.8 km</span>
              </div>
              <div className="facility-row">
                <span>Kollupitiya Fire &amp; Rescue Depot</span>
                <span className="badge-avail-pill">2.4 km</span>
              </div>
              <div className="facility-row">
                <span>St. Peter's College Evacuation Shelter</span>
                <span className="badge-avail-pill">3.1 km (Headroom: 140 beds)</span>
              </div>
              <div className="road-warning-box">
                <AlertTriangle size={15} color="#ea580c" />
                <span>Road closure: Ward Place submerged. Routing algorithm directing emergency vehicles via Horton Place.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Recommended Resources */}
      {activeTab === 'Recommended Resources' && (
        <div className="ai-white-card">
          <h2 className="card-section-title">Full Logistics &amp; Resource Allocation Matrix</h2>
          <div className="resources-matrix-grid">
            <div className="resource-matrix-card">
              <h4>Primary Medical Unit</h4>
              <p>Mobile Medical Unit #2 equipped with 4 oxygen concentrators and insulin refrigeration.</p>
              <span className="badge-avail-pill green">Dispatched to Ward Place Route</span>
            </div>
            <div className="resource-matrix-card">
              <h4>Evacuation Transport</h4>
              <p>2x 4x4 High-Clearance Amphibious Land Cruisers with paramedic escort.</p>
              <span className="badge-avail-pill blue">En Route (ETA 35 mins)</span>
            </div>
            <div className="resource-matrix-card">
              <h4>Auxiliary Generator</h4>
              <p>15kVA Diesel Generator from Colombo Central Depot for emergency ICU power backup.</p>
              <span className="badge-avail-pill amber">Ready for Dispatch</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Similar Requests (Deduplication) */}
      {activeTab === 'Similar Requests' && (
        <div className="ai-white-card">
          <h2 className="card-section-title">Geospatial Deduplication Cluster (AI Cluster #412)</h2>
          <p className="section-desc">AI has detected 2 similar incident reports in the same 500m radius within the last 45 minutes.</p>
          <div className="similar-cluster-list">
            <div className="similar-cluster-item">
              <div>
                <strong>REQ-2026-01844</strong> • 150m from location
                <p>"Elderly home ground floor flooded near Cinnamon Gardens."</p>
              </div>
              <button className="btn-outline-white" onClick={() => showToast?.('Merged REQ-01844 into primary case REQ-01842', 'success')}>
                Merge with Case
              </button>
            </div>
            <div className="similar-cluster-item">
              <div>
                <strong>REQ-2026-01837</strong> • 350m from location
                <p>"Need boat for senior citizens on Barnes Place."</p>
              </div>
              <button className="btn-outline-white" onClick={() => showToast?.('Linked REQ-01837 as correlated incident', 'info')}>
                Link as Correlated
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: Files & Evidence */}
      {activeTab === 'Files & Evidence' && (
        <div className="ai-white-card">
          <h2 className="card-section-title">Verified Citizen Evidence &amp; Telemetry Audio</h2>
          <div className="evidence-grid">
            <div className="evidence-card">
              <div className="evidence-head">
                <Volume2 size={16} color="#0f766e" />
                <span>Citizen 911 Call Audio Stream (42s)</span>
              </div>
              <div className="audio-wave-box">
                <div className="audio-wave-bars">
                  {[40, 65, 80, 45, 90, 75, 30, 85, 95, 60, 40, 70, 85, 50].map((h, i) => (
                    <span key={i} style={{ height: `${h}%` }}></span>
                  ))}
                </div>
                <button className="btn-solid-teal" onClick={() => showToast?.('Playing recorded caller dispatch audio...', 'info')}>
                  Play Transcript
                </button>
              </div>
            </div>
            <div className="evidence-card">
              <div className="evidence-head">
                <Image size={16} color="#0f766e" />
                <span>Geo-Tagged Inundation Photo (Verified Exif)</span>
              </div>
              <div className="mock-evidence-photo">
                <span>Flood Stage: 1.2m on Ward Place Marker</span>
                <span className="photo-time">Captured today, 10:14 AM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Card: Human Decision (Picture 3) */}
      <div className="human-decision-card">
        <div className="decision-header-row">
          <div className="decision-title-group">
            <div className="orange-user-circle">
              <Users size={16} color="#ea580c" />
            </div>
            <h2 className="decision-heading">Human Coordinator Sign-off</h2>
          </div>
        </div>

        {/* Radio Option 1: Final Priority */}
        <div className="decision-radio-group">
          <span className="radio-group-label">Final Priority</span>
          <div className="radios-inline-list">
            {['Critical', 'High', 'Medium', 'Low'].map(p => (
              <label key={p} className="custom-radio-item">
                <input 
                  type="radio" 
                  name="finalPriority" 
                  value={p} 
                  checked={selectedPriority === p}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                />
                <span className="radio-custom-disc"></span>
                <span className={`radio-text priority-${p.toLowerCase()}`}>{p}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Radio Option 2: Decision */}
        <div className="decision-radio-group">
          <span className="radio-group-label">Decision Action</span>
          <div className="radios-inline-list">
            {['Approve', 'Modify', 'Reject', 'Refer'].map(d => (
              <label key={d} className="custom-radio-item">
                <input 
                  type="radio" 
                  name="decisionAction" 
                  value={d} 
                  checked={selectedDecision === d}
                  onChange={(e) => setSelectedDecision(e.target.value)}
                />
                <span className="radio-custom-disc"></span>
                <span className="radio-text font-semibold">{d}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reason for decision & Save Button */}
        <div className="decision-reason-row">
          <div className="reason-input-col">
            <label className="reason-field-label">Audit Rationale &amp; Operational Directives (Cryptographically Logged)</label>
            <input 
              type="text" 
              className="reason-text-input" 
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Specify rationale for modifying or approving AI recommendation..."
            />
          </div>

          <button 
            className={`btn-solid-teal save-decision-btn ${savedSuccess ? 'saved' : ''}`} 
            onClick={handleSaveDecision}
          >
            <Lock size={14} />
            <span>{savedSuccess ? 'Decision Saved!' : 'Save & Execute'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
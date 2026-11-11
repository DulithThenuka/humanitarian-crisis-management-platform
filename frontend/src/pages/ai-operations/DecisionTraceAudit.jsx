import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Activity,
  Layers,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  MapPin,
  Truck,
  Check,
  AlertCircle,
  Share2,
  Printer,
  Lock,
  Eye,
  Info,
  RefreshCw,
  Sparkles,
  Navigation,
  Send,
  Radio,
  FileSpreadsheet,
  Paperclip,
  CheckSquare,
  Square,
  Copy,
  Sliders,
  Shield,
  FileCheck,
  MessageSquare,
  Maximize2
} from 'lucide-react';

export const DecisionTraceAudit = ({ 
  caseId = 'REQ-2026-01842', 
  onBackToQueue,
  showToast 
}) => {
  const [activeTab, setActiveTab] = useState('Timeline');
  const [actorFilter, setActorFilter] = useState('All Actors');
  const [showActorDropdown, setShowActorDropdown] = useState(false);

  // Audio Player State for Files & Evidence tab
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(18); // seconds out of 48

  useEffect(() => {
    let interval = null;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioCurrentTime(prev => {
          if (prev >= 48) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Decision Details State: Supervisor incident notes
  const [supervisorNoteInput, setSupervisorNoteInput] = useState('');
  const [incidentNotes, setIncidentNotes] = useState([
    {
      id: 1,
      author: 'Amara Perera',
      role: 'Field Coordinator',
      time: '10:24 AM',
      text: 'Ward Place access road is underwater by 0.85m near the Cambridge Place intersection. Swapped initial dispatch from MMU-04 (2WD) to MMU-02 (4WD high-axle unit) with Zodiac boat standby.'
    },
    {
      id: 2,
      author: 'Dr. Nimal Fernando',
      role: 'District Medical Director',
      time: '10:28 AM',
      text: 'Approved resource override under Emergency Ordinance Protocol E-04. National Hospital Colombo Emergency Department notified for reception of 6 patients if evacuation is deemed critical on scene.'
    }
  ]);

  // AI Analysis Token Saliency Inspector
  const [selectedToken, setSelectedToken] = useState({
    token: 'continuous oxygen',
    score: '0.982',
    category: 'Life Threat Critical',
    layer: 'Layer 23 / Head 11',
    description: 'Strongest multi-task attention weight triggering immediate Critical (P1) classification due to hypoxia risk.'
  });

  // Resource Actions Tracking State
  const [resourcesList, setResourcesList] = useState([
    {
      id: 'MMU-02',
      name: 'High-Axle 4WD Mobile Medical Unit',
      type: 'Medical ICU Van',
      personnel: 'Dr. K. Wickramasinghe, Paramedic T. Jayasinghe',
      status: 'En Route',
      speed: '38 km/h',
      eta: '7 mins',
      progress: 78,
      gps: '6.9150° N, 79.8730° E',
      badgeColor: 'blue'
    },
    {
      id: 'BOAT-05',
      name: 'Rapid Flood Rescue Zodiac Boat',
      type: 'Auxiliary Watercraft',
      personnel: 'SL Coast Guard Post 3 (3 Divers)',
      status: 'On Standby at Perimeter',
      speed: '0 km/h',
      eta: 'On Scene',
      progress: 100,
      gps: '6.9142° N, 79.8725° E',
      badgeColor: 'green'
    },
    {
      id: 'VAN-03',
      name: 'Emergency Oxygen & Battery Resupply',
      type: 'Logistics Van',
      personnel: 'Driver K. Bandara',
      status: 'En Route (Depot B)',
      speed: '45 km/h',
      eta: '16 mins',
      progress: 45,
      gps: '6.9080° N, 79.8650° E',
      badgeColor: 'purple'
    }
  ]);

  // Related Requests State
  const [clusterRadius, setClusterRadius] = useState('2.5 km');
  const [relatedCases, setRelatedCases] = useState([
    {
      id: 'REQ-2026-01839',
      distance: '0.4 km',
      category: 'Infrastructure / Power',
      similarity: '88%',
      summary: 'Ward Place electrical substation flooded - 3 residential blocks without grid power.',
      relationship: 'Root Cause of Generator Failure',
      status: 'Linked',
      urgency: 'HIGH'
    },
    {
      id: 'REQ-2026-01822',
      distance: '0.8 km',
      category: 'Medical Assistance',
      similarity: '74%',
      summary: 'Elderly patient needing emergency transport to dialysis clinic on Horton Place.',
      relationship: 'Nearby Clinical Vulnerability',
      status: 'Independent Dispatch',
      urgency: 'CRITICAL'
    },
    {
      id: 'REQ-2026-01799',
      distance: '1.2 km',
      category: 'Road Obstruction',
      similarity: '91%',
      summary: 'Cinnamon Gardens avenue waterlogged >0.8m. Impassable for light vehicles.',
      relationship: 'Corroborating Hazard Evidence',
      status: 'Verified by Drone',
      urgency: 'MEDIUM'
    }
  ]);

  // Compliance Checklist State
  const [complianceItems, setComplianceItems] = useState([
    { id: 'c1', label: 'Humanity: Priority driven solely by immediate threat to life', checked: true },
    { id: 'c2', label: 'Neutrality: Zero algorithmic bias across demographic identifiers', checked: true },
    { id: 'c3', label: 'Impartiality: Resource allocation calculated via clinical criteria', checked: true },
    { id: 'c4', label: 'Independence: Microservice actions uninhibited by external pressure', checked: true },
    { id: 'c5', label: 'Data Protection: PII and telephone numbers masked at ingest', checked: true },
    { id: 'c6', label: 'Cryptographic Ledger: SHA-256 block committed to audit chain', checked: true }
  ]);

  const handleAddIncidentNote = (e) => {
    e?.preventDefault();
    if (!supervisorNoteInput.trim()) return;
    const newNote = {
      id: Date.now(),
      author: 'Amara Perera',
      role: 'Field Coordinator',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: supervisorNoteInput.trim()
    };
    setIncidentNotes(prev => [...prev, newNote]);
    setSupervisorNoteInput('');
    showToast?.('Coordinator note permanently appended to audit trail', 'success');
  };

  const handlePingUnit = (unitId) => {
    showToast?.(`GPS radio telemetry ping sent to ${unitId}. Latency: 18ms. Signal: 98%`, 'info');
  };

  const handleMarkUnitArrived = (unitId) => {
    setResourcesList(prev => prev.map(u => u.id === unitId ? { ...u, status: 'Arrived On Scene', progress: 100, eta: 'On Scene' } : u));
    showToast?.(`${unitId} status updated to: Arrived On Scene`, 'success');
  };

  const handleCopyHash = (hashStr) => {
    navigator.clipboard?.writeText(hashStr);
    showToast?.('Cryptographic Merkle hash copied to clipboard', 'success');
  };

  const handleToggleCaseLink = (cId) => {
    setRelatedCases(prev => prev.map(c => {
      if (c.id === cId) {
        const nextStatus = c.status === 'Linked' ? 'Unlinked' : 'Linked';
        showToast?.(`Case ${cId} marked as ${nextStatus}`, 'info');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleToggleCompliance = (id) => {
    setComplianceItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    showToast?.('Compliance verification checklist state updated', 'info');
  };

  const handleExportTraceReport = () => {
    const reportData = {
      caseId,
      exportedAt: new Date().toISOString(),
      cryptographicSignature: '0x8f2a991b5c43d7890e1fa67290bc91823746a',
      hashAlgorithm: 'SHA-256',
      totalTimelineEvents: timelineSteps.length,
      timelineEvents: timelineSteps
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reliefcore_audit_trace_${caseId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast?.(`Audit trace exported to JSON with SHA-256 verification hash`, 'success');
  };

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
          <button className="btn-outline-white" onClick={handleExportTraceReport} title="Export cryptographic audit log">
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

      {/* Subtab 1: Timeline View (Picture 5) */}
      {activeTab === 'Timeline' && (
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

              <div className="filter-dropdown-container">
                <button 
                  className="actors-filter-dropdown"
                  onClick={() => setShowActorDropdown(!showActorDropdown)}
                >
                  <span>{actorFilter}</span>
                  <ChevronDown size={13} className={showActorDropdown ? 'rotate-180' : ''} />
                </button>

                {showActorDropdown && (
                  <div className="filter-popover-menu">
                    {['All Actors', 'AI Engine v2.1', 'Field Coordinator', 'System'].map((act) => (
                      <button
                        key={act}
                        className={`menu-option-btn ${actorFilter === act ? 'active' : ''}`}
                        onClick={() => {
                          setActorFilter(act);
                          setShowActorDropdown(false);
                        }}
                      >
                        <span>{act}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 10 Chronological Timeline Steps */}
            <div className="timeline-steps-vertical-flow">
              {timelineSteps
                .filter(step => {
                  if (actorFilter === 'All Actors') return true;
                  if (actorFilter === 'AI Engine v2.1') return step.actorType === 'ai';
                  if (actorFilter === 'Field Coordinator') return step.actorType === 'human';
                  if (actorFilter === 'System') return step.actorType === 'system';
                  return true;
                })
                .map((step, idx, arr) => {
                  const StepIcon = step.icon;
                  const isLast = idx === arr.length - 1;
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
                <button className="btn-outline-white sm" onClick={handleExportTraceReport}>
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
      )}

      {/* Subtab 2: Decision Details View */}
      {activeTab === 'Decision Details' && (
        <div className="trace-subtab-container" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Top 3-Way Comparative Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px' }}>
            {/* AI Recommendation */}
            <div className="ai-white-card" style={{ borderTop: '3.5px solid #8b5cf6' }}>
              <div className="card-header-flex mb-12">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="green-brain-icon-badge" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                    <Cpu size={15} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>AI Proposal</h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>ReliefCore-BERT v4.2 · 10:17 AM</span>
                  </div>
                </div>
                <span className="badge-priority critical">Critical (92)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Assigned Category</span>
                  <strong style={{ color: '#0f172a' }}>Medical Emergency (Urgent)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Primary Resource</span>
                  <strong style={{ color: '#0f172a' }}>MMU-04 (Trauma Van)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Model Confidence</span>
                  <strong style={{ color: '#7c3aed' }}>92.4% Probability</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', color: '#475569', fontSize: '12px', lineHeight: 1.5 }}>
                  <strong style={{ color: '#1e293b' }}>Inference Rationale:</strong> Multi-term symptom detection indicates trapped residents with medical dependency requiring urgent oxygen replenishment.
                </div>
              </div>
            </div>

            {/* Field Coordinator Override */}
            <div className="ai-white-card" style={{ borderTop: '3.5px solid #f59e0b' }}>
              <div className="card-header-flex mb-12">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="green-brain-icon-badge" style={{ background: '#fef3c7', color: '#d97706' }}>
                    <User size={15} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Coordinator Override</h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Amara Perera · 10:24 AM</span>
                  </div>
                </div>
                <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                  MODIFIED
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Swapped Resource</span>
                  <strong style={{ color: '#d97706' }}>MMU-02 (4WD High-Axle Unit)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Auxiliary Support</span>
                  <strong style={{ color: '#0f172a' }}>Zodiac Flood Boat BR-05</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Transit Route</span>
                  <strong style={{ color: '#0f172a' }}>Via Cambridge Place Bypass</strong>
                </div>
                <div style={{ background: '#fffbeb', padding: '10px', borderRadius: '8px', color: '#92400e', fontSize: '12px', lineHeight: 1.5, border: '1px solid #fef3c7' }}>
                  <strong style={{ color: '#b45309' }}>Coordinator Note:</strong> Ward Place flooded &gt; 0.85m. 2WD trauma van cannot enter. Dispatched 4WD unit with boat escort to traverse standing water.
                </div>
              </div>
            </div>

            {/* District Director Final Approval */}
            <div className="ai-white-card" style={{ borderTop: '3.5px solid #10b981' }}>
              <div className="card-header-flex mb-12">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="green-brain-icon-badge" style={{ background: '#d1fae5', color: '#059669' }}>
                    <ShieldCheck size={15} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Authorized Decision</h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Dr. Nimal Fernando · 10:28 AM</span>
                  </div>
                </div>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                  AUTHORIZED
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Approval Protocol</span>
                  <strong style={{ color: '#0f172a' }}>Emergency Directive E-04</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Digital Signature</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                    SIG-NIMAL-FD-9014
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Hospital Receiving</span>
                  <strong style={{ color: '#0f172a' }}>Colombo National Hospital EOC</strong>
                </div>
                <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', color: '#065f46', fontSize: '12px', lineHeight: 1.5, border: '1px solid #a7f3d0' }}>
                  <strong style={{ color: '#047857' }}>Director Confirmation:</strong> Full resource allocation approved with immediate siren dispatch. Secondary power generators prepped at depot.
                </div>
              </div>
            </div>
          </div>

          {/* Decision Comparison Matrix Table */}
          <div className="ai-white-card no-padding overflow-table">
            <div className="card-header-flex p-16">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="#059669" />
                <h3 className="card-section-title" style={{ margin: 0 }}>Decision Parameter Matrix</h3>
              </div>
              <span className="badge-sync-live">Audit Verified</span>
            </div>
            <table className="queue-data-table">
              <thead>
                <tr>
                  <th>Decision Parameter</th>
                  <th>AI Model Proposal</th>
                  <th>Coordinator Adjustment</th>
                  <th>Final Executed Value</th>
                  <th>Resolution Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Triage Urgency Score</strong></td>
                  <td>92 / 100 (Critical)</td>
                  <td>92 / 100 (Confirmed)</td>
                  <td><span className="badge-priority critical">92 / 100 (Critical)</span></td>
                  <td><span className="status-cell-flex"><CheckCircle2 size={13} color="#16a34a" /> Accepted</span></td>
                </tr>
                <tr>
                  <td><strong>Primary Transport Unit</strong></td>
                  <td>MMU-04 (Standard Van)</td>
                  <td>MMU-02 (4WD High-Axle)</td>
                  <td><strong>MMU-02 (4WD Unit)</strong></td>
                  <td><span className="status-cell-flex" style={{ color: '#d97706' }}><Sliders size={13} /> Overridden</span></td>
                </tr>
                <tr>
                  <td><strong>Watercraft Escort</strong></td>
                  <td>Not Recommended</td>
                  <td>Requested (1 Zodiac Boat)</td>
                  <td><strong>BR-05 Zodiac Deployed</strong></td>
                  <td><span className="status-cell-flex" style={{ color: '#2563eb' }}><CheckCircle2 size={13} /> Added</span></td>
                </tr>
                <tr>
                  <td><strong>Transit Route</strong></td>
                  <td>Direct via Ward Place</td>
                  <td>Cambridge Place Diversion</td>
                  <td><strong>Cambridge Place Bypass</strong></td>
                  <td><span className="status-cell-flex" style={{ color: '#d97706' }}><Sliders size={13} /> Rerouted</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Supervisor Incident Notes Feed + Post Note Input */}
          <div className="ai-white-card">
            <div className="card-header-flex mb-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="#059669" />
                <h3 className="card-section-title" style={{ margin: 0 }}>Incident Coordinator Notes &amp; Rationale</h3>
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>{incidentNotes.length} recorded entries</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {incidentNotes.map(n => (
                <div key={n.id} style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                    {n.author.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{n.author} <span style={{ fontWeight: 500, color: '#64748b', fontSize: '11px' }}>({n.role})</span></strong>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{n.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: 1.5 }}>{n.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Post Note Form */}
            <form onSubmit={handleAddIncidentNote} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={supervisorNoteInput}
                onChange={(e) => setSupervisorNoteInput(e.target.value)}
                placeholder="Append official operational note to this audit case..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                className="btn-solid-teal"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                <Send size={13} />
                <span>Add Note</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Subtab 3: AI Analysis Data View */}
      {activeTab === 'AI Analysis Data' && (
        <div className="trace-subtab-container" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Telemetry Bar */}
          <div className="ai-white-card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles size={16} color="#38bdf8" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>NEURAL INFERENCE TELEMETRY HUD</span>
                  <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    FP16 TensorRT
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Model: <span style={{ color: '#ffffff', fontWeight: 600 }}>ReliefCore-BERT-Triage-v4.2.0-prod</span> · Checkpoint: <code style={{ color: '#a78bfa' }}>hf/reliefcore-bert-large-colombo-monsoon</code>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Latency</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#4ade80' }}>24.2 ms</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Attention Heads</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>16 Heads</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Classification Conf</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>92.4%</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column Grid: Probabilities & Urgency Decomposition */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
            {/* Left: Softmax Classification Distribution */}
            <div className="ai-white-card">
              <div className="card-header-flex mb-12">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} color="#059669" />
                  <h3 className="card-section-title" style={{ margin: 0 }}>Softmax Probability Distribution</h3>
                </div>
                <span className="badge-sync-live">Calibrated</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Medical Assistance', pct: 92.4, color: '#2563eb', count: '0.924 (Primary Choice)' },
                  { label: 'Shelter Support', pct: 4.1, color: '#ea580c', count: '0.041' },
                  { label: 'Food & Nutrition', pct: 2.2, color: '#dc2626', count: '0.022' },
                  { label: 'Protection & Security', pct: 1.3, color: '#ec4899', count: '0.013' }
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{item.label}</span>
                      <span style={{ color: '#64748b' }}>{item.count}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Urgency Score Multi-Factor Decomposition */}
            <div className="ai-white-card">
              <div className="card-header-flex mb-12">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={16} color="#059669" />
                  <h3 className="card-section-title" style={{ margin: 0 }}>Urgency Score Decomposition (92/100)</h3>
                </div>
                <span className="badge-priority critical">Critical</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef2f2', padding: '8px 12px', borderRadius: '6px' }}>
                  <div>
                    <strong style={{ color: '#991b1b' }}>Life Threat Index</strong>
                    <div style={{ fontSize: '11px', color: '#b91c1c' }}>Continuous oxygen dependency detected</div>
                  </div>
                  <strong style={{ color: '#dc2626' }}>40 / 40 pts</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffbeb', padding: '8px 12px', borderRadius: '6px' }}>
                  <div>
                    <strong style={{ color: '#92400e' }}>Vulnerable Demographic</strong>
                    <div style={{ fontSize: '11px', color: '#b45309' }}>6 bedridden elderly individuals trapped</div>
                  </div>
                  <strong style={{ color: '#d97706' }}>25 / 25 pts</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>
                  <div>
                    <strong style={{ color: '#1e293b' }}>Hazard Severity</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Basement inundated, backup generator drowned</div>
                  </div>
                  <strong style={{ color: '#475569' }}>18 / 20 pts</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>
                  <div>
                    <strong style={{ color: '#1e293b' }}>Temporal Escalation Decay</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Elapsed time without power: 15 mins</div>
                  </div>
                  <strong style={{ color: '#475569' }}>9 / 15 pts</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Token Attention / Saliency Inspector */}
          <div className="ai-white-card">
            <div className="card-header-flex mb-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} color="#059669" />
                <h3 className="card-section-title" style={{ margin: 0 }}>NLP Attention &amp; Key Token Saliency</h3>
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>Click highlighted token to inspect activation weight</span>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
              ReliefCore BERT transformer multi-head attention weights computed over caller transcript:
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', lineHeight: 2, fontSize: '13.5px', color: '#334155' }}>
              "Caller states that in Cinnamon Gardens elder care home there are{' '}
              <button
                type="button"
                onClick={() => setSelectedToken({
                  token: '6 trapped elderly residents',
                  score: '0.941',
                  category: 'Vulnerable Demographic',
                  layer: 'Layer 21 / Head 08',
                  description: 'High semantic attention on vulnerability multiplier (+25 pts urgency).'
                })}
                style={{
                  background: selectedToken.token.includes('trapped') ? '#fde047' : '#fef08a',
                  border: '1px solid #eab308',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#713f12'
                }}
              >
                6 trapped elderly residents (0.94)
              </button>{' '}
              who require{' '}
              <button
                type="button"
                onClick={() => setSelectedToken({
                  token: 'continuous oxygen',
                  score: '0.982',
                  category: 'Life Threat Critical',
                  layer: 'Layer 23 / Head 11',
                  description: 'Strongest multi-task attention weight triggering immediate Critical (P1) classification due to hypoxia risk.'
                })}
                style={{
                  background: selectedToken.token.includes('oxygen') ? '#fca5a5' : '#fee2e2',
                  border: '1px solid #ef4444',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  color: '#991b1b'
                }}
              >
                continuous oxygen (0.98)
              </button>{' '}
              and daily insulin. The{' '}
              <button
                type="button"
                onClick={() => setSelectedToken({
                  token: 'basement generator is inundated',
                  score: '0.892',
                  category: 'Hazard Severity',
                  layer: 'Layer 19 / Head 04',
                  description: 'Environmental failure token signaling complete power loss to electrical life-support.'
                })}
                style={{
                  background: selectedToken.token.includes('generator') ? '#fdba74' : '#ffedd5',
                  border: '1px solid #f97316',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#9a3412'
                }}
              >
                basement generator is inundated (0.89)
              </button>{' '}
              due to flood water on Ward Place reaching 0.85m."
            </div>

            {/* Selected Token Inspector Card */}
            {selectedToken && (
              <div style={{ marginTop: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#166534' }}>Inspected Token:</span>
                    <strong style={{ fontSize: '13px', color: '#14532d' }}>"{selectedToken.token}"</strong>
                    <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '11px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Weight: {selectedToken.score}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#166534' }}>
                    {selectedToken.description} · <span style={{ fontFamily: 'monospace' }}>{selectedToken.layer}</span>
                  </div>
                </div>
                <span className="badge-sync-live" style={{ fontSize: '11px' }}>
                  <i className="green-bullet"></i> Active In Saliency Graph
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab 4: Resource Actions View */}
      {activeTab === 'Resource Actions' && (
        <div className="trace-subtab-container" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Active Units Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {resourcesList.map(unit => (
              <div key={unit.id} className="ai-white-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-header-flex mb-8">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Truck size={15} color="#2563eb" />
                        <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{unit.id} · {unit.name}</h4>
                      </div>
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>{unit.type}</span>
                    </div>
                    <span style={{
                      background: unit.status.includes('Scene') ? '#dcfce7' : '#dbeafe',
                      color: unit.status.includes('Scene') ? '#15803d' : '#1e40af',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {unit.status}
                    </span>
                  </div>

                  {/* Route Progress Bar */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Route Progress</span>
                      <strong style={{ color: '#0f172a' }}>{unit.progress}% (ETA: {unit.eta})</strong>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${unit.progress}%`, height: '100%', background: unit.status.includes('Scene') ? '#10b981' : '#2563eb', transition: 'width 0.3s ease' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#475569' }}>
                    <div><strong>Assigned Crew:</strong> {unit.personnel}</div>
                    <div><strong>Live GPS Telemetry:</strong> <code style={{ color: '#059669' }}>{unit.gps}</code> ({unit.speed})</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                  <button 
                    type="button" 
                    className="btn-outline-white sm"
                    onClick={() => handlePingUnit(unit.id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Radio size={12} />
                    <span>Ping GPS</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-solid-teal sm"
                    onClick={() => handleMarkUnitArrived(unit.id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Check size={12} />
                    <span>Mark Arrived</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Dispatch Radio & Checkpoint Milestones */}
          <div className="ai-white-card">
            <div className="card-header-flex mb-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={16} color="#059669" />
                <h3 className="card-section-title" style={{ margin: 0 }}>Route Checkpoints &amp; Field Navigation Bypass</h3>
              </div>
              <span className="badge-sync-live"><i className="green-bullet"></i> Active GPS Feed</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '10px' }}>
              {[
                { title: 'Depot Dispatch', time: '10:20 AM', status: 'Passed', color: '#16a34a' },
                { title: 'Cambridge Place Turn', time: '10:25 AM', status: 'Passed', color: '#16a34a' },
                { title: 'Flood Barrier Bypass', time: '10:29 AM', status: 'In Transit (Current)', color: '#2563eb' },
                { title: 'Ward Place Gate Arrival', time: '10:35 AM (Est)', status: 'Pending', color: '#94a3b8' }
              ].map((step, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Checkpoint {i + 1}</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: step.color }}>{step.status}</span>
                  </div>
                  <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{step.title}</strong>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{step.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: Related Requests View */}
      {activeTab === 'Related Requests' && (
        <div className="trace-subtab-container" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Radar Header & Radius Filters */}
          <div className="ai-white-card">
            <div className="card-header-flex">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} color="#059669" />
                  <h3 className="card-section-title" style={{ margin: 0 }}>Geospatial &amp; Semantic Cluster Detection</h3>
                </div>
                <p className="card-sub-description mt-6">
                  Cross-referencing nearby incidents within Colombo 07 to eliminate duplication and coordinate multi-victim response.
                </p>
              </div>

              {/* Cluster Radius Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {['500 m', '1 km', '2.5 km', '5 km'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setClusterRadius(r);
                      showToast?.(`Incident search radius updated to ${r}`, 'info');
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: clusterRadius === r ? '#059669' : '#e2e8f0',
                      background: clusterRadius === r ? '#ecfdf5' : '#ffffff',
                      color: clusterRadius === r ? '#059669' : '#64748b',
                      fontSize: '11.5px',
                      fontWeight: clusterRadius === r ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Related Incidents List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {relatedCases.map(c => (
              <div key={c.id} className="ai-white-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{c.id}</strong>
                    <span className={`badge-priority ${c.urgency.toLowerCase()}`}>{c.urgency}</span>
                    <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>
                      {c.distance} away
                    </span>
                    <span style={{ background: '#ede9fe', color: '#7c3aed', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                      {c.similarity} Semantic Match
                    </span>
                  </div>
                  <p style={{ margin: '4px 0', fontSize: '12.5px', color: '#334155' }}>{c.summary}</p>
                  <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>
                    Correlation: {c.relationship}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="btn-outline-white sm"
                    onClick={() => handleToggleCaseLink(c.id)}
                  >
                    <span>{c.status === 'Linked' ? 'Unlink Case' : 'Link Case'}</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-solid-teal sm"
                    onClick={() => showToast?.(`Consolidated dispatch order merged for ${c.id}`, 'success')}
                  >
                    <span>Merge Response</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 6: Compliance View */}
      {activeTab === 'Compliance' && (
        <div className="trace-subtab-container" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Top Cryptographic Ledger Proof Banner */}
          <div className="ai-white-card" style={{ borderLeft: '4px solid #059669' }}>
            <div className="card-header-flex mb-8">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#059669" />
                <h3 className="card-section-title" style={{ margin: 0 }}>UN-OCHA Humanitarian Principles &amp; Cryptographic Audit Ledger</h3>
              </div>
              <span className="badge-sync-live"><i className="green-bullet"></i> Blockchain Anchor Active</span>
            </div>
            <p className="card-sub-description">
              Every automated recommendation and human modification is mathematically sealed with a SHA-256 block hash for legal and international compliance.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Immutable Block Hash (SHA-256)</div>
                <code style={{ fontSize: '12px', color: '#0f172a', fontWeight: 700, wordBreak: 'break-all' }}>
                  0x7b2a991b5c43d7890e1fa67290bc91823746a598c39de1a88b2094892c90e
                </code>
              </div>
              <button 
                type="button" 
                className="btn-outline-white sm"
                onClick={() => handleCopyHash('0x7b2a991b5c43d7890e1fa67290bc91823746a598c39de1a88b2094892c90e')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Copy size={12} />
                <span>Copy Hash</span>
              </button>
            </div>
          </div>

          {/* Checklist of Humanitarian Principles */}
          <div className="ai-white-card">
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: '#0f172a' }}>Humanitarian Compliance Verification Checklist</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {complianceItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleToggleCompliance(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: item.checked ? '#f0fdf4' : '#f8fafc',
                    border: '1px solid',
                    borderColor: item.checked ? '#bbf7d0' : '#e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12.5px',
                    color: item.checked ? '#166534' : '#64748b',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {item.checked ? <CheckSquare size={16} color="#16a34a" /> : <Square size={16} color="#94a3b8" />}
                  <span style={{ fontWeight: item.checked ? 600 : 400 }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button 
                type="button" 
                className="btn-solid-teal sm"
                onClick={() => showToast?.('Official UN-OCHA Compliance Certificate generated (PDF)', 'success')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FileCheck size={13} />
                <span>Generate Official UN Compliance Certificate (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 7: Files & Evidence View */}
      {activeTab === 'Files & Evidence' && (
        <div className="trace-subtab-container" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Top 2 Items: Photo Evidence & Audio Recording */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {/* Citizen Geo-tagged Photo Evidence */}
            <div className="ai-white-card">
              <div className="card-header-flex mb-12">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={16} color="#059669" />
                  <h3 className="card-section-title" style={{ margin: 0 }}>Field Photo Evidence</h3>
                </div>
                <span className="badge-sync-live"><i className="green-bullet"></i> EXIF Authenticated</span>
              </div>

              {/* Photo Card Preview */}
              <div style={{
                height: '180px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <MapPin size={28} color="#38bdf8" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>Ward Place Entrance Waterlogging</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Visual Flood Depth: 0.85m standing water</div>
                </div>
                <div style={{ position: 'absolute', bottom: '8px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: '4px', fontSize: '10px' }}>
                  GPS: 6.9147° N, 79.8732° E · 10:14 AM
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: '#64748b', marginTop: '12px' }}>
                <div><strong>Camera Device:</strong> Samsung Galaxy S23 Ultra · f/1.8 · ISO 50</div>
                <div><strong>C2PA Authenticity:</strong> Verified original sensor capture (0.0% deepfake/tamper)</div>
              </div>
            </div>

            {/* 911 Call Audio Recording & Waveform */}
            <div className="ai-white-card">
              <div className="card-header-flex mb-12">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Volume2 size={16} color="#059669" />
                  <h3 className="card-section-title" style={{ margin: 0 }}>911 Emergency Audio Recording</h3>
                </div>
                <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '10px' }}>
                  Duration: 0:48s
                </span>
              </div>

              {/* Player UI */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    {isPlayingAudio ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                  </button>

                  {/* Waveform Bars Simulation */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flex: 1, height: '36px' }}>
                    {[14, 22, 34, 18, 28, 36, 12, 30, 24, 38, 20, 16, 32, 28, 14, 26, 35, 18, 22, 30, 15, 25, 33, 19, 27].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${isPlayingAudio ? Math.min(36, h * (0.8 + Math.random() * 0.4)) : h}px`,
                          background: i < (audioCurrentTime / 48) * 25 ? '#059669' : '#cbd5e1',
                          borderRadius: '2px',
                          transition: 'height 0.1s ease, background 0.2s ease'
                        }}
                      ></div>
                    ))}
                  </div>

                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', minWidth: '40px' }}>
                    0:{audioCurrentTime < 10 ? `0${audioCurrentTime}` : audioCurrentTime}
                  </span>
                </div>

                {/* Speech to text transcript */}
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Caller Transcript: </strong>
                  "Please help, we have 6 bedridden elderly patients at Cinnamon Gardens facility. The basement generator is submerged in floodwater, and their oxygen concentrators only have 40 minutes of battery life remaining!"
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                <span>Audio Sampling: 44.1 kHz, 16-bit PCM</span>
                <button 
                  type="button" 
                  className="btn-outline-white sm"
                  onClick={() => showToast?.('Audio recording exported as WAV', 'success')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Download size={11} />
                  <span>Download Audio</span>
                </button>
              </div>
            </div>
          </div>

          {/* Paramedic Field Triage PDF & Document Attachments */}
          <div className="ai-white-card">
            <div className="card-header-flex mb-12">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Paperclip size={16} color="#059669" />
                <h3 className="card-section-title" style={{ margin: 0 }}>Attached Field Documents &amp; Vitals</h3>
              </div>
              <button 
                type="button" 
                className="btn-outline-white sm"
                onClick={() => showToast?.('Attach document modal: Select files to upload', 'info')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Download size={12} />
                <span>Upload New Attachment</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <FileText size={24} color="#dc2626" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}>Paramedic_Field_Triage_Note.pdf</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>1.4 MB · Uploaded by Dr. K. Wickramasinghe</div>
                </div>
                <button 
                  type="button" 
                  className="btn-outline-white sm"
                  onClick={() => showToast?.('Opening Paramedic_Field_Triage_Note.pdf in viewer', 'info')}
                >
                  View
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <FileSpreadsheet size={24} color="#059669" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}>Oxygen_Depletion_Telemetry_Log.csv</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>340 KB · Real-time Medical Sensor Stream</div>
                </div>
                <button 
                  type="button" 
                  className="btn-outline-white sm"
                  onClick={() => showToast?.('Oxygen_Depletion_Telemetry_Log.csv downloaded', 'success')}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
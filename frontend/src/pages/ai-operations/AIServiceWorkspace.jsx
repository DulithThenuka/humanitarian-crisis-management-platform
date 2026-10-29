import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  BarChart2, 
  Copy, 
  Box, 
  Home,
  TrendingUp, 
  ShieldAlert, 
  ShieldCheck, 
  MessageSquare, 
  FileText,
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Eye, 
  Search, 
  Bell, 
  HelpCircle,
  Sliders,
  Check,
  RotateCw,
  X,
  Plus
} from 'lucide-react';

export const AIServiceWorkspace = ({ onBackOverview, onViewCase, initialService = 'classification' }) => {
  const [selectedService, setSelectedService] = useState(initialService);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [activeModelVersion, setActiveModelVersion] = useState('v2.4-Production');

  const carouselRef = useRef(null);

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const servicesList = [
    {
      id: 'classification',
      title: 'Classification',
      sub: 'Categorize requests',
      icon: Brain,
      color: '#059669',
      bannerTitle: 'Request Classification',
      bannerDesc: 'AI automatically categorizes incoming requests into appropriate humanitarian categories.'
    },
    {
      id: 'priority',
      title: 'Priority Scoring',
      sub: 'Score & rank requests',
      icon: BarChart2,
      color: '#2563eb',
      bannerTitle: 'Priority Scoring',
      bannerDesc: 'AI urgency scoring and triage ranking based on life-threat parameters and vulnerable groups.'
    },
    {
      id: 'duplicate',
      title: 'Duplicate Detection',
      sub: 'Find similar requests',
      icon: Copy,
      color: '#7c3aed',
      bannerTitle: 'Duplicate Detection',
      bannerDesc: 'Geospatial and contact-based deduplication to prevent double allocation of relief resources.'
    },
    {
      id: 'resource',
      title: 'Resource Matching',
      sub: 'Match needs with resources',
      icon: Box,
      color: '#9333ea',
      bannerTitle: 'Resource Matching',
      bannerDesc: 'Constraint-based matching of available inventory, medical units, and supplies to active requests.'
    },
    {
      id: 'shelter',
      title: 'Shelter Allocation',
      sub: 'Recommend camp space',
      icon: Home,
      color: '#ea580c',
      bannerTitle: 'Shelter Recommendation & Capacity',
      bannerDesc: 'Real-time shelter capacity matching and proximity-based family placement recommendation.'
    },
    {
      id: 'demand',
      title: 'Demand Forecasting',
      sub: 'Predict future needs',
      icon: TrendingUp,
      color: '#0284c7',
      bannerTitle: 'Demand Forecasting',
      bannerDesc: 'Predictive modeling of relief supplies, rations, and shelter capacities 48-72 hours in advance.'
    },
    {
      id: 'anomaly',
      title: 'Anomaly Detection',
      sub: 'Detect unusual patterns',
      icon: ShieldAlert,
      color: '#d97706',
      bannerTitle: 'Anomaly Detection',
      bannerDesc: 'Sensor telemetry analysis and sudden disaster hotspot cluster detection.'
    },
    {
      id: 'security',
      title: 'Content Verification',
      sub: 'Detect conflicts & fraud',
      icon: ShieldCheck,
      color: '#2563eb',
      bannerTitle: 'Content Verification & Integrity',
      bannerDesc: 'Image metadata validation, GPS spoofing prevention, and multi-source corroboration.'
    },
    {
      id: 'multilingual',
      title: 'Multilingual Response',
      sub: 'Generate responses',
      icon: MessageSquare,
      color: '#7c3aed',
      bannerTitle: 'Multilingual Response Generator',
      bannerDesc: 'Automated high-precision two-way citizen translation across Sinhala, Tamil, and English.'
    },
    {
      id: 'summarization',
      title: 'Crisis Summarization',
      sub: 'Generate briefings',
      icon: FileText,
      color: '#0f766e',
      bannerTitle: 'Crisis Summarization Engine',
      bannerDesc: 'Natural language synthesis of multi-agency incident logs into situational intelligence briefings.'
    }
  ];

  const currentServiceMeta = servicesList.find(s => s.id === selectedService) || servicesList[0];

  // Specific data sets per service
  const workspaceData = {
    classification: {
      rates: [
        { name: 'Medical', count: '45 (24%)', pct: '24%', color: '#2563eb' },
        { name: 'Food', count: '38 (20%)', pct: '20%', color: '#dc2626' },
        { name: 'Shelter', count: '32 (17%)', pct: '17%', color: '#ea580c' },
        { name: 'Protection', count: '28 (15%)', pct: '15%', color: '#ec4899' },
        { name: 'Water & Sanitation', count: '22 (12%)', pct: '12%', color: '#8b5cf6' },
        { name: 'Education', count: '14 (7%)', pct: '7%', color: '#0d9488' },
        { name: 'Other', count: '10 (5%)', pct: '5%', color: '#64748b' }
      ],
      tableHead: ['Request ID', 'Request Summary', 'Predicted Category', 'Confidence', 'Status', 'Action'],
      rows: [
        { id: 'REQ-2026-01842', summary: 'Elderly patient needs medication', category: 'Medical (Urgent)', conf: '92%', status: 'Completed' },
        { id: 'REQ-2026-01839', summary: 'Family needs temporary shelter', category: 'Shelter (Emergency)', conf: '88%', status: 'Completed' },
        { id: 'REQ-2026-01835', summary: 'Food supplies for 50 families', category: 'Food (Standard)', conf: '85%', status: 'Completed' },
        { id: 'REQ-2026-01831', summary: 'Transport for injured person', category: 'Medical (Urgent)', conf: '91%', status: 'Completed' },
        { id: 'REQ-2026-01828', summary: 'Clean drinking water request', category: 'Water & Sanitation', conf: '87%', status: 'Completed' }
      ]
    },
    priority: {
      rates: [
        { name: 'Critical (≥90)', count: '52 (28%)', pct: '28%', color: '#dc2626' },
        { name: 'High (70-89)', count: '65 (35%)', pct: '35%', color: '#ea580c' },
        { name: 'Medium (40-69)', count: '46 (25%)', pct: '25%', color: '#eab308' },
        { name: 'Low (<40)', count: '23 (12%)', pct: '12%', color: '#16a34a' }
      ],
      tableHead: ['Request ID', 'Urgency Score', 'Assigned Priority', 'Model Confidence', 'Status', 'Action'],
      rows: [
        { id: 'REQ-2026-01842', summary: 'Score: 92/100', category: 'CRITICAL', conf: '88%', status: 'Scored' },
        { id: 'REQ-2026-01839', summary: 'Score: 78/100', category: 'HIGH', conf: '91%', status: 'Scored' },
        { id: 'REQ-2026-01835', summary: 'Score: 74/100', category: 'HIGH', conf: '84%', status: 'Scored' },
        { id: 'REQ-2026-01831', summary: 'Score: 94/100', category: 'CRITICAL', conf: '79%', status: 'Scored' },
        { id: 'REQ-2026-01828', summary: 'Score: 55/100', category: 'MEDIUM', conf: '93%', status: 'Scored' }
      ]
    },
    duplicate: {
      rates: [
        { name: 'Unique Request', count: '152 (82%)', pct: '82%', color: '#16a34a' },
        { name: 'Exact Match', count: '17 (9%)', pct: '9%', color: '#dc2626' },
        { name: 'Nearby Cluster', count: '11 (6%)', pct: '6%', color: '#ea580c' },
        { name: 'Conflict Flag', count: '6 (3%)', pct: '3%', color: '#8b5cf6' }
      ],
      tableHead: ['Primary ID', 'Matched Cluster ID', 'Similarity Score', 'Coordinates Offset', 'Status', 'Action'],
      rows: [
        { id: 'REQ-2026-01835', summary: 'REQ-2026-01812', category: '94% Match (Same Address)', conf: '0.02 km', status: 'Flagged Duplicate' },
        { id: 'REQ-2026-01820', summary: 'REQ-2026-01799', category: '89% Match (Phone Number)', conf: '0.05 km', status: 'Flagged Duplicate' },
        { id: 'REQ-2026-01804', summary: 'REQ-2026-01801', category: '82% Match (Same Household)', conf: '0.01 km', status: 'Merged' },
        { id: 'REQ-2026-01788', summary: 'REQ-2026-01770', category: '96% Match (Exact Text)', conf: '0.00 km', status: 'Merged' }
      ]
    },
    resource: {
      rates: [
        { name: 'Exact Stock Match', count: '84 (45%)', pct: '45%', color: '#16a34a' },
        { name: 'Substitute Dispatched', count: '56 (30%)', pct: '30%', color: '#2563eb' },
        { name: 'Nearby Hub Transfer', count: '34 (18%)', pct: '18%', color: '#ea580c' },
        { name: 'Depot Stockout', count: '12 (7%)', pct: '7%', color: '#dc2626' }
      ],
      tableHead: ['Request ID', 'Matched Resource', 'Warehouse Hub', 'Estimated ETA', 'Status', 'Action'],
      rows: [
        { id: 'REQ-2026-01842', summary: 'Mobile Medical Unit (MMU-04)', category: 'Colombo Central Depot', conf: '30 mins', status: 'Allocated' },
        { id: 'REQ-2026-01839', summary: 'Emergency Ration Packs (x50)', category: 'Gampaha Regional Hub', conf: '45 mins', status: 'Allocated' },
        { id: 'REQ-2026-01835', summary: 'Temporary Tents (Family x12)', category: 'Negombo Logistics Base', conf: '1.2 hours', status: 'Allocated' },
        { id: 'REQ-2026-01831', summary: 'Ambulance Transport (AMB-11)', category: 'Kalutara Hospital Post', conf: '25 mins', status: 'En Route' }
      ]
    },
    demand: {
      rates: [
        { name: 'Food Rations Pack', count: '1,420 pk (38%)', pct: '38%', color: '#dc2626' },
        { name: 'Drinking Water (5L)', count: '1,200 bt (32%)', pct: '32%', color: '#2563eb' },
        { name: 'First Aid & Trauma', count: '680 kt (18%)', pct: '18%', color: '#ea580c' },
        { name: 'Blankets & Tarps', count: '450 un (12%)', pct: '12%', color: '#8b5cf6' }
      ],
      tableHead: ['District Sector', 'Projected Inundation', 'Forecast 48h Need', 'Confidence', 'Risk Status', 'Action'],
      rows: [
        { id: 'SEC-COLOMBO-N', summary: 'Rainfall: 140mm Expected', category: '3,200 Rations Needed', conf: '94%', status: 'Critical Forecast' },
        { id: 'SEC-GAMPAHA-W', summary: 'River Level: +1.4m Rise', category: '2,100 Rations Needed', conf: '91%', status: 'High Alert' },
        { id: 'SEC-KALUTARA-S', summary: 'Landslide Risk Zone 2', category: '1,400 Tents Needed', conf: '88%', status: 'Elevated Risk' },
        { id: 'SEC-RATNAPURA-C', summary: 'Water Level Stagnant', category: '850 Water Packs', conf: '85%', status: 'Normal Tracking' }
      ]
    },
    anomaly: {
      rates: [
        { name: 'Normal Incident Flow', count: '164 (88%)', pct: '88%', color: '#16a34a' },
        { name: 'Hotspot Cluster Spike', count: '11 (6%)', pct: '6%', color: '#dc2626' },
        { name: 'Communication Blackout', count: '7 (4%)', pct: '4%', color: '#ea580c' },
        { name: 'Sensor Telemetry Spike', count: '4 (2%)', pct: '2%', color: '#8b5cf6' }
      ],
      tableHead: ['Anomaly ID', 'Detection Type', 'Affected Sector', 'Telemetry Divergence', 'Status', 'Action'],
      rows: [
        { id: 'ANOM-2026-081', summary: '34 requests in 12 mins', category: 'Kelani River Sector 4', conf: '+380% vs Baseline', status: 'Hotspot Spike' },
        { id: 'ANOM-2026-079', summary: 'Telemetry Water Rise >2.1m', category: 'Galle Canal Sensor 9', conf: '+140% Sensor Spike', status: 'Sensor Alert' },
        { id: 'ANOM-2026-074', summary: 'Zero citizen pings in 2h', category: 'Hanwella Rural Sector', conf: 'Tower Offline', status: 'Blackout' }
      ]
    },
    shelter: {
      rates: [
        { name: 'Western Province Camps', count: '14 (40%)', pct: '40%', color: '#ea580c' },
        { name: 'Southern Province Camps', count: '10 (28%)', pct: '28%', color: '#2563eb' },
        { name: 'Sabaragamuwa Camps', count: '7 (20%)', pct: '20%', color: '#16a34a' },
        { name: 'Northern Transitional', count: '4 (12%)', pct: '12%', color: '#8b5cf6' }
      ],
      tableHead: ['Request ID', 'Recommended Shelter', 'Capacity Status', 'Proximity Offset', 'Status', 'Action'],
      rows: [
        { id: 'REQ-2026-01839', summary: 'St. Thomas Relief Camp', category: 'Capacity: 84/120 Beds', conf: '1.2 km away', status: 'Assigned' },
        { id: 'REQ-2026-01824', summary: 'Moratuwa Community Hall', category: 'Capacity: 45/60 Beds', conf: '2.4 km away', status: 'Assigned' },
        { id: 'REQ-2026-01802', summary: 'Kalutara North Sports Complex', category: 'Capacity: 110/250 Beds', conf: '3.1 km away', status: 'En Route' },
        { id: 'REQ-2026-01791', summary: 'Ratnapura Primary College Camp', category: 'Capacity: 92/100 Beds', conf: '0.8 km away', status: 'Allocated' }
      ]
    },
    security: {
      rates: [
        { name: 'Sensor/Photo Corroborated', count: '142 (76%)', pct: '76%', color: '#16a34a' },
        { name: 'Field Agent Verified', count: '30 (16%)', pct: '16%', color: '#2563eb' },
        { name: 'Unverified Web Form', count: '11 (6%)', pct: '6%', color: '#ea580c' },
        { name: 'False / Spoofed Ping', count: '3 (2%)', pct: '2%', color: '#dc2626' }
      ],
      tableHead: ['Audit ID', 'Submission Source', 'Validation Method', 'Integrity Hash', 'Status', 'Action'],
      rows: [
        { id: 'VERIF-9014', summary: 'Mobile App GPS Coordinate', category: 'Cell-Tower Trilateral', conf: '0x8f2a49b2...ba71', status: 'Verified Valid' },
        { id: 'VERIF-9011', summary: 'Disaster Photo Upload', category: 'EXIF & Weather Timestamp', conf: '0x3c71a9e8...e41f', status: 'Verified Valid' },
        { id: 'VERIF-9008', summary: 'Duplicate SMS Gateway', category: 'IP Frequency Throttling', conf: '0x10b981d7...99cf', status: 'Spoof Blocked' }
      ]
    },
    multilingual: {
      rates: [
        { name: 'Sinhala Responses', count: '90 (48%)', pct: '48%', color: '#2563eb' },
        { name: 'Tamil Responses', count: '60 (32%)', pct: '32%', color: '#dc2626' },
        { name: 'English Responses', count: '36 (20%)', pct: '20%', color: '#16a34a' }
      ],
      tableHead: ['Request ID', 'Language Pair', 'Sentiment Score', 'Inference Latency', 'Delivery Status', 'Action'],
      rows: [
        { id: 'REQ-2026-01842', summary: 'Sinhala → English', category: 'Distress: 0.94 High', conf: '38ms', status: 'Delivered (SMS)' },
        { id: 'REQ-2026-01839', summary: 'Tamil → English', category: 'Distress: 0.82 Medium', conf: '42ms', status: 'Delivered (SMS)' },
        { id: 'REQ-2026-01835', summary: 'English → English', category: 'Distress: 0.78 Medium', conf: '24ms', status: 'Delivered (Web)' },
        { id: 'REQ-2026-01831', summary: 'Sinhala → Sinhala', category: 'Distress: 0.96 Critical', conf: '35ms', status: 'Delivered (SMS)' }
      ]
    },
    summarization: {
      rates: [
        { name: 'Situation Reports (SitRep)', count: '18 (45%)', pct: '45%', color: '#0f766e' },
        { name: 'Operational Briefings', count: '12 (30%)', pct: '30%', color: '#2563eb' },
        { name: 'Executive Summaries', count: '6 (15%)', pct: '15%', color: '#8b5cf6' },
        { name: 'Citizen Broadcasts', count: '4 (10%)', pct: '10%', color: '#ea580c' }
      ],
      tableHead: ['Briefing ID', 'SitRep Focus', 'Source Incident Feeds', 'Inference Time', 'Publication Status', 'Action'],
      rows: [
        { id: 'SUM-2026-092', summary: 'Hourly Western Flood Inundation Summary', category: '48 Incident Feeds', conf: '1.4s', status: 'Published' },
        { id: 'SUM-2026-088', summary: 'Kelani River Basin Flash Briefing', category: '22 Incident Feeds', conf: '0.9s', status: 'Published' },
        { id: 'SUM-2026-081', summary: '24h Inter-Agency Coordination SitRep', category: '140 Incident Feeds', conf: '2.1s', status: 'Approved' }
      ]
    }
  };

  const currentDataset = workspaceData[selectedService] || workspaceData.classification;

  const filteredRows = currentDataset.rows.filter(r => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return r.id.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
  });

  const handleSaveModalConfig = () => {
    setConfigSaved(true);
    setTimeout(() => {
      setConfigSaved(false);
      setShowConfigModal(false);
    }, 1200);
  };

  return (
    <div className="ai-page-canvas">
      {/* Top Breadcrumb Bar */}
      <div className="ai-top-breadcrumb-bar">
        <div className="ai-breadcrumb-path">
          <span className="crumb-root clickable" onClick={onBackOverview}>
            &lt; AI Operations
          </span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">AI Service Workspaces</span>
        </div>

        <div className="ai-top-header-controls">
          <div className="ai-header-search">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search requests, locations, shelters..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Main Title Header with Service Configuration Action */}
      <div className="ai-page-title-row">
        <div>
          <h1 className="ai-main-heading">AI Service Workspaces</h1>
          <p className="ai-main-subheading">
            Access and configure AI services for humanitarian decision support.
          </p>
        </div>

        <div className="ai-head-btn-group">
          <button className="btn-outline-white" onClick={() => setShowConfigModal(true)}>
            <Sliders size={14} />
            <span>Service Configuration</span>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel of AI Services (Picture 4) with functional scrolling */}
      <div className="services-carousel-track-container">
        <button 
          className="carousel-nav-arrow left" 
          onClick={() => scrollCarousel('left')} 
          title="Previous Services"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="services-carousel-scroll" ref={carouselRef}>
          {servicesList.map((srv) => {
            const IconComponent = srv.icon;
            const isSelected = selectedService === srv.id;
            return (
              <div 
                key={srv.id}
                className={`service-carousel-card ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedService(srv.id)}
              >
                <div className={`srv-carousel-icon-box ${isSelected ? 'active' : ''}`}>
                  <IconComponent size={20} color={srv.color} />
                </div>
                <div className="srv-carousel-title">{srv.title}</div>
                <div className="srv-carousel-sub">{srv.sub}</div>
              </div>
            );
          })}
        </div>

        <button 
          className="carousel-nav-arrow right" 
          onClick={() => scrollCarousel('right')} 
          title="Next Services"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Active Service Workspace Container */}
      <div className="active-service-workspace-container">
        {/* Workspace Banner */}
        <div className="workspace-header-banner">
          <div className="workspace-shield-icon">
            <currentServiceMeta.icon size={22} color={currentServiceMeta.color} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 className="workspace-banner-title">{currentServiceMeta.bannerTitle}</h2>
            <p className="workspace-banner-subtitle">
              {currentServiceMeta.bannerDesc}
            </p>
          </div>
          <div className="workspace-banner-quick-actions">
            <button className="btn-outline-white sm" onClick={() => setShowConfigModal(true)}>
              <Sliders size={13} />
              <span>Configure Model</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Rate Breakdown + Trend Chart */}
        <div className="ai-charts-split-grid">
          {/* Left Column: Rate Breakdown */}
          <div className="ai-white-card">
            <h3 className="card-section-title">
              {currentServiceMeta.title} Distribution (Last 7 Days)
            </h3>

            <div className="classification-bars-stack">
              {currentDataset.rates.map((rate, i) => (
                <div key={i} className="class-bar-row">
                  <span className="class-cat-dot" style={{ backgroundColor: rate.color }}></span>
                  <span className="class-cat-name">{rate.name}</span>
                  <div className="class-bar-track">
                    <div className="class-bar-fill" style={{ width: rate.pct, backgroundColor: rate.color }}></div>
                  </div>
                  <span className="class-cat-val">{rate.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Multi-line / Trend Chart */}
          <div className="ai-white-card">
            <h3 className="card-section-title">{currentServiceMeta.title} Trend</h3>

            <div className="chart-legend-row">
              <span className="legend-item"><i style={{ backgroundColor: '#2563eb' }}></i> Primary</span>
              <span className="legend-item"><i style={{ backgroundColor: '#16a34a' }}></i> Secondary</span>
              <span className="legend-item"><i style={{ backgroundColor: '#ea580c' }}></i> Escalated</span>
              <span className="legend-item"><i style={{ backgroundColor: '#dc2626' }}></i> Anomalies</span>
              <span className="legend-item"><i style={{ backgroundColor: '#8b5cf6' }}></i> Automated</span>
            </div>

            <div className="svg-trend-container">
              <div className="y-axis-label-vertical">Events / Hour</div>
              <svg viewBox="0 0 600 230" className="trend-line-svg" preserveAspectRatio="none">
                <line x1="45" y1="20" x2="585" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="45" y1="58" x2="585" y2="58" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="45" y1="96" x2="585" y2="96" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="45" y1="134" x2="585" y2="134" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="45" y1="172" x2="585" y2="172" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="45" y1="210" x2="585" y2="210" stroke="#e2e8f0" strokeWidth="1" />

                <text x="35" y="24" className="chart-axis-text" textAnchor="end">100</text>
                <text x="35" y="62" className="chart-axis-text" textAnchor="end">80</text>
                <text x="35" y="100" className="chart-axis-text" textAnchor="end">60</text>
                <text x="35" y="138" className="chart-axis-text" textAnchor="end">40</text>
                <text x="35" y="176" className="chart-axis-text" textAnchor="end">20</text>
                <text x="35" y="213" className="chart-axis-text" textAnchor="end">0</text>

                {/* Primary Curve */}
                <path d="M 65 155 Q 150 95 235 125 T 415 65 T 565 30" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                <circle cx="65" cy="155" r="3.5" fill="#2563eb" />
                <circle cx="150" cy="108" r="3.5" fill="#2563eb" />
                <circle cx="235" cy="125" r="3.5" fill="#2563eb" />
                <circle cx="325" cy="72" r="3.5" fill="#2563eb" />
                <circle cx="415" cy="75" r="3.5" fill="#2563eb" />
                <circle cx="500" cy="58" r="3.5" fill="#2563eb" />
                <circle cx="565" cy="30" r="3.5" fill="#2563eb" />

                {/* Secondary Curve */}
                <path d="M 65 178 Q 150 160 235 168 T 415 140 T 565 110" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                <circle cx="65" cy="178" r="3.5" fill="#dc2626" />
                <circle cx="150" cy="160" r="3.5" fill="#dc2626" />
                <circle cx="235" cy="168" r="3.5" fill="#dc2626" />
                <circle cx="325" cy="148" r="3.5" fill="#dc2626" />
                <circle cx="415" cy="140" r="3.5" fill="#dc2626" />
                <circle cx="500" cy="148" r="3.5" fill="#dc2626" />
                <circle cx="565" cy="110" r="3.5" fill="#dc2626" />

                {/* Automation Curve */}
                <path d="M 65 190 Q 150 170 235 178 T 415 165 T 565 145" fill="none" stroke="#16a34a" strokeWidth="2.5" />
                <circle cx="65" cy="190" r="3.5" fill="#16a34a" />
                <circle cx="150" cy="170" r="3.5" fill="#16a34a" />
                <circle cx="235" cy="178" r="3.5" fill="#16a34a" />
                <circle cx="325" cy="172" r="3.5" fill="#16a34a" />
                <circle cx="415" cy="165" r="3.5" fill="#16a34a" />
                <circle cx="500" cy="162" r="3.5" fill="#16a34a" />
                <circle cx="565" cy="145" r="3.5" fill="#16a34a" />
              </svg>

              <div className="x-axis-labels-row">
                <span>Oct 21</span>
                <span>Oct 22</span>
                <span>Oct 23</span>
                <span>Oct 24</span>
                <span>Oct 25</span>
                <span>Oct 26</span>
                <span>Oct 27</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Table: Dynamic Service Results Table */}
        <div className="ai-white-card no-padding overflow-table mt-4">
          <div className="card-header-flex p-16">
            <h3 className="card-section-title">
              Recent {currentServiceMeta.title} Records
            </h3>
            <button className="view-all-link-btn" onClick={() => onBackOverview && onBackOverview()}>
              <span>View All</span>
              <span className="arrow-sym">&rarr;</span>
            </button>
          </div>

          <table className="queue-data-table">
            <thead>
              <tr>
                {currentDataset.tableHead.map((th, idx) => (
                  <th key={idx} className={idx === currentDataset.tableHead.length - 1 ? 'text-right' : ''}>
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td className="col-req-id">
                    <span 
                      className="req-link-text" 
                      onClick={() => onViewCase && onViewCase(row.id.startsWith('REQ') ? row.id : 'REQ-2026-01842')}
                    >
                      {row.id}
                    </span>
                  </td>
                  <td>{row.summary}</td>
                  <td>{row.category}</td>
                  <td className="col-conf">{row.conf}</td>
                  <td>
                    <span className="badge-review-status approved">
                      ● {row.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button 
                      className="tbl-action-btn solid-teal"
                      onClick={() => onViewCase && onViewCase(row.id.startsWith('REQ') ? row.id : 'REQ-2026-01842')}
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Service Configuration Modal */}
      {showConfigModal && (
        <div className="modal-backdrop-overlay">
          <div className="service-config-modal-card">
            <div className="modal-header-flex">
              <div className="modal-title-left">
                <Sliders size={18} color="#059669" />
                <h3 className="modal-title-text">{currentServiceMeta.title} Configuration</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowConfigModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body-form">
              <div className="form-group-line">
                <label className="form-field-label">Active Model Pipeline</label>
                <select 
                  className="form-select-control"
                  value={activeModelVersion}
                  onChange={(e) => setActiveModelVersion(e.target.value)}
                >
                  <option value="v2.4-Production">v2.4-Production (BERT-Crisis fine-tuned)</option>
                  <option value="v2.5-Canary">v2.5-Canary (Multi-lingual LLM RoBERTa)</option>
                  <option value="v2.3-Fallback">v2.3-Fallback (Heuristic Rule-Engine)</option>
                </select>
              </div>

              <div className="form-group-line">
                <div className="slider-label-flex">
                  <label className="form-field-label">Confidence Auto-Approval Threshold</label>
                  <span className="slider-val-badge">{confidenceThreshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="99" 
                  value={confidenceThreshold} 
                  onChange={(e) => setConfidenceThreshold(e.target.value)}
                  className="range-slider-control"
                />
                <span className="slider-hint">
                  Requests above {confidenceThreshold}% confidence are flagged for rapid human sign-off.
                </span>
              </div>

              <div className="form-group-line">
                <label className="form-field-label">Service Telemetry Logging</label>
                <div className="checkbox-toggle-wrap">
                  <label className="custom-checkbox-row">
                    <input type="checkbox" defaultChecked className="checkbox-blue" />
                    <span>Log all decision vectors to immutable SHA-256 audit ledger</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button className="btn-outline-white" onClick={() => setShowConfigModal(false)}>
                Cancel
              </button>
              <button className="btn-solid-teal" onClick={handleSaveModalConfig}>
                {configSaved ? <Check size={14} /> : null}
                <span>{configSaved ? 'Config Saved!' : 'Apply Configuration'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
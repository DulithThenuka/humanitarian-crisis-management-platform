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
import { createSmoothSplinePath, createSmoothAreaPath } from './aiOperationsData';

export const AIServiceWorkspace = ({ onBackOverview, onViewCase, initialService = 'classification', showToast }) => {
  const [selectedService, setSelectedService] = useState(initialService);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [activeModelVersion, setActiveModelVersion] = useState('v2.4-Production');
  const [isRestarting, setIsRestarting] = useState(false);

  const carouselRef = useRef(null);

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  const handleRestartService = () => {
    setIsRestarting(true);
    showToast?.(`Restarting ${selectedService} microservice pod on cluster...`, 'info');
    setTimeout(() => {
      setIsRestarting(false);
      showToast?.(`${selectedService} microservice restarted successfully. Health: 100%`, 'success');
    }, 1400);
  };

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

  // Dynamic trend telemetry state & mathematical curves
  const [activeSeries, setActiveSeries] = useState({
    primary: true,
    secondary: true,
    escalated: true,
    anomalies: true,
    automated: true
  });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const trendDates = ['Oct 21', 'Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27'];

  const serviceTrendProfiles = {
    classification: {
      primary: [28, 55, 48, 74, 62, 88, 76],
      secondary: [16, 24, 21, 25, 34, 45, 48],
      escalated: [12, 19, 18, 22, 28, 36, 40],
      anomalies: [6, 12, 10, 16, 24, 30, 32],
      automated: [10, 14, 15, 20, 26, 32, 35]
    },
    priority: {
      primary: [35, 48, 42, 68, 75, 92, 84],
      secondary: [20, 28, 25, 32, 40, 50, 52],
      escalated: [15, 22, 26, 30, 42, 48, 55],
      anomalies: [8, 14, 12, 18, 22, 28, 25],
      automated: [14, 18, 22, 28, 34, 40, 42]
    },
    duplicate: {
      primary: [50, 62, 58, 70, 80, 85, 90],
      secondary: [14, 18, 16, 20, 24, 26, 28],
      escalated: [8, 12, 10, 15, 18, 20, 22],
      anomalies: [4, 6, 8, 10, 14, 16, 15],
      automated: [25, 35, 40, 50, 65, 75, 80]
    },
    resource: {
      primary: [40, 52, 49, 65, 72, 86, 82],
      secondary: [22, 30, 28, 35, 42, 54, 50],
      escalated: [10, 15, 14, 18, 25, 30, 34],
      anomalies: [5, 9, 8, 12, 15, 19, 21],
      automated: [18, 25, 28, 36, 45, 52, 58]
    },
    shelter: {
      primary: [30, 42, 40, 58, 66, 78, 72],
      secondary: [18, 22, 20, 28, 35, 42, 44],
      escalated: [10, 14, 12, 16, 22, 28, 30],
      anomalies: [4, 8, 6, 10, 14, 18, 20],
      automated: [12, 16, 18, 24, 30, 38, 40]
    },
    demand: {
      primary: [45, 60, 55, 72, 82, 94, 88],
      secondary: [25, 32, 30, 38, 48, 56, 54],
      escalated: [14, 20, 18, 24, 32, 38, 42],
      anomalies: [6, 10, 9, 14, 18, 22, 20],
      automated: [20, 28, 32, 40, 50, 60, 64]
    },
    anomaly: {
      primary: [20, 35, 30, 52, 65, 82, 74],
      secondary: [15, 20, 18, 24, 30, 38, 40],
      escalated: [22, 28, 25, 36, 45, 52, 58],
      anomalies: [12, 24, 20, 32, 44, 58, 62],
      automated: [8, 12, 14, 18, 24, 30, 32]
    },
    security: {
      primary: [38, 50, 46, 62, 70, 84, 80],
      secondary: [16, 22, 20, 26, 32, 40, 42],
      escalated: [8, 12, 11, 15, 20, 24, 26],
      anomalies: [5, 8, 7, 11, 14, 18, 16],
      automated: [15, 22, 25, 34, 42, 50, 54]
    },
    multilingual: {
      primary: [42, 56, 52, 68, 78, 90, 85],
      secondary: [18, 24, 22, 28, 36, 44, 46],
      escalated: [9, 13, 12, 16, 22, 26, 28],
      anomalies: [4, 7, 6, 9, 12, 15, 14],
      automated: [22, 30, 35, 45, 55, 68, 72]
    },
    summarization: {
      primary: [25, 38, 34, 50, 60, 72, 68],
      secondary: [14, 18, 16, 22, 28, 34, 36],
      escalated: [6, 10, 8, 12, 16, 20, 22],
      anomalies: [3, 5, 4, 7, 10, 12, 11],
      automated: [16, 22, 26, 35, 44, 54, 58]
    }
  };

  const currentTrendProfile = serviceTrendProfiles[selectedService] || serviceTrendProfiles.classification;

  const trendSeriesConfig = [
    { key: 'primary', label: 'Primary', color: '#2563eb', fillId: 'wsGradPrimary', values: currentTrendProfile.primary },
    { key: 'secondary', label: 'Secondary', color: '#16a34a', fillId: 'wsGradSecondary', values: currentTrendProfile.secondary },
    { key: 'escalated', label: 'Escalated', color: '#ea580c', fillId: 'wsGradEscalated', values: currentTrendProfile.escalated },
    { key: 'anomalies', label: 'Anomalies', color: '#dc2626', fillId: 'wsGradAnomalies', values: currentTrendProfile.anomalies },
    { key: 'automated', label: 'Automated', color: '#8b5cf6', fillId: 'wsGradAutomated', values: currentTrendProfile.automated }
  ];

  const trendXCoords = [65, 148, 232, 315, 398, 482, 565];
  const computedTrendSeries = trendSeriesConfig.map(s => {
    const points = s.values.map((val, idx) => ({
      x: trendXCoords[idx],
      y: 210 - (val / 100) * 190,
      val,
      day: trendDates[idx]
    }));
    return {
      ...s,
      points,
      linePath: createSmoothSplinePath(points, 0.2),
      areaPath: createSmoothAreaPath(points, 210, 0.2)
    };
  });

  const filteredRows = currentDataset.rows.filter(r => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return r.id.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
  });

  const handleSaveModalConfig = () => {
    setConfigSaved(true);
    showToast?.(`Model configuration updated for ${currentServiceMeta.title}: ${activeModelVersion} (${confidenceThreshold}% threshold)`, 'success');
    setTimeout(() => {
      setConfigSaved(false);
      setShowConfigModal(false);
    }, 900);
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
            <button 
              className={`btn-outline-white sm ${isRestarting ? 'running' : ''}`} 
              onClick={handleRestartService}
              disabled={isRestarting}
              title="Restart service container"
            >
              <RotateCw size={13} className={isRestarting ? 'spin-icon' : ''} />
              <span>{isRestarting ? 'Restarting...' : 'Restart Pod'}</span>
            </button>
            <button className="btn-solid-teal sm" onClick={() => setShowConfigModal(true)}>
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
            <div className="card-header-flex">
              <h3 className="card-section-title">{currentServiceMeta.title} Trend</h3>
              <span className="badge-sync-live" style={{ fontSize: '11px' }}>
                <i className="green-bullet"></i> Active Telemetry
              </span>
            </div>

            {/* Interactive Series Legend */}
            <div className="chart-legend-row" style={{ flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {[
                { key: 'primary', label: 'Primary', color: '#2563eb' },
                { key: 'secondary', label: 'Secondary', color: '#16a34a' },
                { key: 'escalated', label: 'Escalated', color: '#ea580c' },
                { key: 'anomalies', label: 'Anomalies', color: '#dc2626' },
                { key: 'automated', label: 'Automated', color: '#8b5cf6' }
              ].map(item => {
                const isVisible = activeSeries[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveSeries(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className="legend-item interactive"
                    style={{
                      background: isVisible ? 'transparent' : '#f1f5f9',
                      opacity: isVisible ? 1 : 0.45,
                      border: '1px solid',
                      borderColor: isVisible ? '#e2e8f0' : 'transparent',
                      borderRadius: '20px',
                      padding: '3px 10px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11.5px',
                      fontWeight: isVisible ? 600 : 500,
                      transition: 'all 0.15s ease'
                    }}
                    title={`Click to ${isVisible ? 'hide' : 'show'} ${item.label}`}
                  >
                    <i style={{ 
                      backgroundColor: item.color, 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%',
                      display: 'inline-block' 
                    }}></i> 
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="svg-trend-container" style={{ position: 'relative' }}>
              <div className="y-axis-label-vertical">Events / Hour</div>
              <svg 
                viewBox="0 0 600 230" 
                className="trend-line-svg" 
                preserveAspectRatio="none"
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  <linearGradient id="wsGradPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="wsGradSecondary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="wsGradEscalated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ea580c" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="wsGradAnomalies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="wsGradAutomated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
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

                {/* Vertical Scrubber Line when hovering */}
                {hoveredPoint && (
                  <line 
                    x1={hoveredPoint.x} 
                    y1="20" 
                    x2={hoveredPoint.x} 
                    y2="210" 
                    stroke="#94a3b8" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 3" 
                  />
                )}

                {/* Render Each Active Series with Exact Spline Curves & Centered Circles */}
                {computedTrendSeries.map(series => {
                  if (!activeSeries[series.key]) return null;
                  return (
                    <g key={series.key} className="chart-series-group">
                      {/* Gradient Fill under curve */}
                      <path 
                        d={series.areaPath} 
                        fill={`url(#${series.fillId})`} 
                      />

                      {/* Smooth cubic Bézier stroke passing through all points */}
                      <path 
                        d={series.linePath} 
                        fill="none" 
                        stroke={series.color} 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Discrete Points guaranteed to align with the curve */}
                      {series.points.map((pt, pIdx) => {
                        const isHovered = hoveredPoint?.dayIdx === pIdx;
                        return (
                          <g key={pIdx}>
                            <circle 
                              cx={pt.x} 
                              cy={pt.y} 
                              r={isHovered ? 6 : 3.5} 
                              fill={isHovered ? '#ffffff' : series.color}
                              stroke={series.color}
                              strokeWidth={isHovered ? 3 : 1.5}
                              style={{ transition: 'r 0.15s ease, stroke-width 0.15s ease', cursor: 'pointer' }}
                            />
                            {/* Transparent hitbox for easy hovering */}
                            <rect
                              x={pt.x - 25}
                              y="15"
                              width="50"
                              height="200"
                              fill="transparent"
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => setHoveredPoint({ x: pt.x, dayIdx: pIdx, day: pt.day })}
                            />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Floating Tooltip */}
              {hoveredPoint && (
                <div 
                  className="trend-tooltip-card"
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: `${Math.min(Math.max((hoveredPoint.x / 600) * 100, 15), 78)}%`,
                    transform: 'translateX(-50%)',
                    background: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                    pointerEvents: 'none',
                    zIndex: 20,
                    minWidth: '150px'
                  }}
                >
                  <div style={{ fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px', marginBottom: '6px', color: '#38bdf8' }}>
                    {hoveredPoint.day} · Telemetry
                  </div>
                  {computedTrendSeries.map(s => {
                    if (!activeSeries[s.key]) return null;
                    const val = s.values[hoveredPoint.dayIdx];
                    return (
                      <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.color }}></span>
                          <span style={{ color: '#cbd5e1' }}>{s.label}:</span>
                        </span>
                        <strong style={{ color: '#ffffff' }}>{val} / hr</strong>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="x-axis-labels-row">
                {trendDates.map((d, i) => (
                  <span 
                    key={d} 
                    style={{ 
                      fontWeight: hoveredPoint?.dayIdx === i ? 700 : 500,
                      color: hoveredPoint?.dayIdx === i ? '#059669' : '#64748b'
                    }}
                  >
                    {d}
                  </span>
                ))}
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
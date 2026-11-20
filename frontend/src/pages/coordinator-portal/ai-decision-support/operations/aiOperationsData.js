// Centralized Mock Data & Helpers for ReliefCore AI Operations Suite

export const INITIAL_QUEUE_DATA = [
  {
    id: 'REQ-2026-01842',
    category: 'Medical Assistance',
    location: 'Colombo 07 - Cinnamon Gardens',
    priority: 'CRITICAL',
    priorityColor: 'critical',
    confidence: '94%',
    confidenceNum: 94,
    riskFlag: 'Road blockage reported on Ward Place',
    riskFlagType: 'alert',
    reviewStatus: 'Pending',
    reviewStatusType: 'pending',
    actionType: 'review',
    time: '4 mins ago',
    caller: 'Dr. Priyantha Silva',
    phone: '+94 77 123 4567',
    urgencyScore: 94,
    affectedCount: 6,
    summary: 'Elderly care home with 6 trapped residents requiring continuous oxygen and insulin. Basement generator inundated.',
    aiModel: 'ReliefCore-BERT-Triage-v4',
    selectedResources: ['mobile-unit', 'ambulance'],
    humanDecision: null,
    coordinates: [6.9147, 79.8732]
  },
  {
    id: 'REQ-2026-01839',
    category: 'Food Supply',
    location: 'Gampaha - Ja-Ela Division',
    priority: 'HIGH',
    priorityColor: 'high',
    confidence: '91%',
    confidenceNum: 91,
    riskFlag: 'None',
    riskFlagType: 'none',
    reviewStatus: 'Pending',
    reviewStatusType: 'pending',
    actionType: 'review',
    time: '12 mins ago',
    caller: 'Nimali Senanayake',
    phone: '+94 71 889 0012',
    urgencyScore: 78,
    affectedCount: 45,
    summary: 'Community center shelter has depleted ready-to-eat dry rations and infant milk powder for 18 infants.',
    aiModel: 'ReliefCore-BERT-Triage-v4',
    selectedResources: ['food-packs', 'infant-care'],
    humanDecision: null,
    coordinates: [7.0840, 79.8939]
  },
  {
    id: 'REQ-2026-01835',
    category: 'Shelter Support',
    location: 'Negombo - Kochchikade South',
    priority: 'HIGH',
    priorityColor: 'high',
    confidence: '84%',
    confidenceNum: 84,
    riskFlag: 'Possible duplicate of REQ-01829',
    riskFlagType: 'alert',
    reviewStatus: 'Pending',
    reviewStatusType: 'pending',
    actionType: 'review',
    time: '26 mins ago',
    caller: 'Jude Fernando',
    phone: '+94 76 543 2198',
    urgencyScore: 82,
    affectedCount: 30,
    summary: 'Coastal flooding reached 1.2 meters. Temporary community hall overflowing. Need bedding and partition tents.',
    aiModel: 'ReliefCore-Vision-Cluster-v2',
    selectedResources: ['shelter-kit', 'tents'],
    humanDecision: null,
    coordinates: [7.2083, 79.8358]
  },
  {
    id: 'REQ-2026-01831',
    category: 'Medical Assistance',
    location: 'Kalutara - Nagoda District Hospital',
    priority: 'CRITICAL',
    priorityColor: 'critical',
    confidence: '89%',
    confidenceNum: 89,
    riskFlag: 'Emergency dialysis power cutoff',
    riskFlagType: 'alert',
    reviewStatus: 'In Review',
    reviewStatusType: 'in-review',
    actionType: 'continue',
    time: '38 mins ago',
    caller: 'Nurse In-Charge Malani',
    phone: '+94 70 334 5566',
    urgencyScore: 98,
    affectedCount: 12,
    summary: 'Auxiliary power failing in ICU dialysis wing. Fuel delivery blocked by river overflow near Kalu Ganga.',
    aiModel: 'ReliefCore-BERT-Triage-v4',
    selectedResources: ['mobile-generator', 'fuel-transport'],
    humanDecision: 'In Progress - Assigned to Colombo Logistics Depot',
    coordinates: [6.5854, 79.9607]
  },
  {
    id: 'REQ-2026-01828',
    category: 'Water Supply',
    location: 'Ratnapura - Kiriella Road',
    priority: 'MEDIUM',
    priorityColor: 'medium',
    confidence: '93%',
    confidenceNum: 93,
    riskFlag: 'None',
    riskFlagType: 'none',
    reviewStatus: 'Approved',
    reviewStatusType: 'approved',
    actionType: 'trace',
    time: '1 hour ago',
    caller: 'Sunil Weerakkody',
    phone: '+94 72 112 3344',
    urgencyScore: 65,
    affectedCount: 80,
    summary: 'Well contamination due to sediment run-off. 80 families require potable bowser delivery and water purification tablets.',
    aiModel: 'ReliefCore-Demand-Predict-v3',
    selectedResources: ['water-bowser'],
    humanDecision: 'Approved without modification by S. Johnson',
    coordinates: [6.6828, 80.4037]
  },
  {
    id: 'REQ-2026-01824',
    category: 'Volunteer Support',
    location: 'Colombo 03 - Kollupitiya',
    priority: 'LOW',
    priorityColor: 'low',
    confidence: '89%',
    confidenceNum: 89,
    riskFlag: 'None',
    riskFlagType: 'none',
    reviewStatus: 'Deferred',
    reviewStatusType: 'deferred',
    actionType: 'trace',
    time: '2 hours ago',
    caller: 'Rotaract Club Volunteer Lead',
    phone: '+94 77 998 7766',
    urgencyScore: 42,
    affectedCount: 15,
    summary: 'Assistance requested for sorting dry rations at central logistics hub. No immediate life safety threat.',
    aiModel: 'ReliefCore-Match-v2',
    selectedResources: ['volunteer-unit'],
    humanDecision: 'Deferred to next morning shift',
    coordinates: [6.9034, 79.8510]
  },
  {
    id: 'REQ-2026-01819',
    category: 'Search & Rescue',
    location: 'Kelaniya - Peliyagoda Bridge',
    priority: 'CRITICAL',
    priorityColor: 'critical',
    confidence: '96%',
    confidenceNum: 96,
    riskFlag: 'Rapid water level rise (+0.4m/hr)',
    riskFlagType: 'alert',
    reviewStatus: 'Pending',
    reviewStatusType: 'pending',
    actionType: 'review',
    time: 'Just now',
    caller: 'Gramasevaka Officer Bandara',
    phone: '+94 71 223 3445',
    urgencyScore: 99,
    affectedCount: 18,
    summary: 'Boat capsized near railway embankment. 4 citizens clinging to branch; naval rescue dinghy requested urgently.',
    aiModel: 'ReliefCore-MultiModal-Crisis-v5',
    selectedResources: ['rescue-boat', 'paramedics'],
    humanDecision: null,
    coordinates: [6.9572, 79.9142]
  },
  {
    id: 'REQ-2026-01815',
    category: 'Medical Assistance',
    location: 'Moratuwa - Lunawa Lagoon',
    priority: 'HIGH',
    priorityColor: 'high',
    confidence: '87%',
    confidenceNum: 87,
    riskFlag: 'Specialized pediatrics required',
    riskFlagType: 'alert',
    reviewStatus: 'Pending',
    reviewStatusType: 'pending',
    actionType: 'review',
    time: '45 mins ago',
    caller: 'Fathima Rizwan',
    phone: '+94 75 443 2211',
    urgencyScore: 86,
    affectedCount: 3,
    summary: 'Child with high fever and respiratory distress trapped on second floor due to floodwater surrounding compound.',
    aiModel: 'ReliefCore-BERT-Triage-v4',
    selectedResources: ['pediatric-unit', 'high-clearance-4x4'],
    humanDecision: null,
    coordinates: [6.7731, 79.8816]
  }
];

export const AI_SERVICES_CATALOG = [
  {
    id: 'classification',
    name: 'Request Classification',
    category: 'Natural Language Processing',
    model: 'ReliefBERT-Large-v4',
    version: 'v4.2.1-prod',
    status: 'ONLINE',
    latencyMs: 24,
    accuracy: '94.8%',
    qps: 18.4,
    uptime: '99.99%',
    processedToday: 186,
    icon: 'FileText',
    color: '#059669',
    description: 'Classifies unstructured crisis SMS, voice transcripts, and citizen submissions into 8 UN-OCHA humanitarian sectors.',
    confidenceThreshold: 85,
    samplePrompt: 'Water entered living room, grandfather needs oxygen cylinder immediately near Negombo.'
  },
  {
    id: 'priority',
    name: 'Priority Scoring & Triage',
    category: 'Risk Analytics',
    model: 'CrisisRank-XGBoost-Ensemble',
    version: 'v3.1.0-prod',
    status: 'ONLINE',
    latencyMs: 18,
    accuracy: '96.2%',
    qps: 22.1,
    uptime: '99.98%',
    processedToday: 186,
    icon: 'BarChart2',
    color: '#2563eb',
    description: 'Calculates multi-criteria urgency scores (0–100) weighting vulnerability, life threat, and flood stage.',
    confidenceThreshold: 80,
    samplePrompt: 'ICU patients without power generator backup on Hospital Road Kalutara.'
  },
  {
    id: 'duplicate',
    name: 'Duplicate Detection',
    category: 'Semantic & Spatial',
    model: 'GeoDedupe-Embedding-v2',
    version: 'v2.4.0-prod',
    status: 'ONLINE',
    latencyMs: 32,
    accuracy: '93.5%',
    qps: 14.8,
    uptime: '99.95%',
    processedToday: 42,
    icon: 'Copy',
    color: '#7c3aed',
    description: 'Prevents double-allocation of rations and ambulances using cosine semantic similarity & 500m geofencing.',
    confidenceThreshold: 88,
    samplePrompt: 'Checking similarity between REQ-01835 and REQ-01829 in Kochchikade.'
  },
  {
    id: 'resource',
    name: 'Resource Matching',
    category: 'Optimization & Constraint',
    model: 'OptiRoute-Simplex-v3',
    version: 'v3.0.2-prod',
    status: 'ONLINE',
    latencyMs: 41,
    accuracy: '91.7%',
    qps: 9.6,
    uptime: '99.92%',
    processedToday: 134,
    icon: 'Share2',
    color: '#0891b2',
    description: 'Matches validated humanitarian requests with nearest verified logistics inventory depots and vehicles.',
    confidenceThreshold: 82,
    samplePrompt: 'Find closest available mobile generator within 15km of Nagoda Hospital.'
  },
  {
    id: 'shelter',
    name: 'Shelter Recommendation',
    category: 'Spatial Analytics',
    model: 'ShelterCapacity-Alloc-v2',
    version: 'v2.1.0-prod',
    status: 'ONLINE',
    latencyMs: 29,
    accuracy: '95.1%',
    qps: 11.2,
    uptime: '99.97%',
    processedToday: 89,
    icon: 'Home',
    color: '#ea580c',
    description: 'Recommends optimal evacuation shelters based on occupancy headroom, family unit preservation, and road safety.',
    confidenceThreshold: 85,
    samplePrompt: 'Allocate 30 displaced families from Negombo coastline to nearest shelter with available beds.'
  },
  {
    id: 'volunteer',
    name: 'Volunteer Matching',
    category: 'Skills Matching',
    model: 'SkillMatch-Graph-v1',
    version: 'v1.8.4-prod',
    status: 'ONLINE',
    latencyMs: 22,
    accuracy: '89.4%',
    qps: 7.3,
    uptime: '99.91%',
    processedToday: 54,
    icon: 'Users',
    color: '#4f46e5',
    description: 'Dispatches certified medical professionals, translators, and boat operators according to incident profile.',
    confidenceThreshold: 78,
    samplePrompt: 'Match 2 pediatric nurses and 1 Tamil translator for Moratuwa flood zone.'
  },
  {
    id: 'demand',
    name: 'Demand Forecasting',
    category: 'Time-Series & Weather',
    model: 'ReliefForecast-LSTM-v3',
    version: 'v3.3.1-prod',
    status: 'ONLINE',
    latencyMs: 56,
    accuracy: '88.9%',
    qps: 4.1,
    uptime: '99.88%',
    processedToday: 24,
    icon: 'TrendingUp',
    color: '#16a34a',
    description: 'Forecasts 24h–72h supply bottlenecks across districts by merging Doppler radar and historical flood curves.',
    confidenceThreshold: 75,
    samplePrompt: 'Predict clean drinking water requirements in Kalutara for the next 48 hours.'
  },
  {
    id: 'anomaly',
    name: 'Anomaly Detection',
    category: 'Fraud & Safety',
    model: 'IsolationForest-Audit-v2',
    version: 'v2.0.5-prod',
    status: 'ONLINE',
    latencyMs: 19,
    accuracy: '97.4%',
    qps: 28.5,
    uptime: '100.0%',
    processedToday: 312,
    icon: 'AlertTriangle',
    color: '#dc2626',
    description: 'Detects coordinated fraud, automated bot requests, and aberrant bulk aid requests for immediate audit.',
    confidenceThreshold: 90,
    samplePrompt: 'Scan for repeated IP submissions from single IMEI with changing citizen national IDs.'
  },
  {
    id: 'multilingual',
    name: 'Multilingual Response',
    category: 'Generative Translation',
    model: 'Llama-3-Humanitarian-Polyglot',
    version: 'v4.0.0-prod',
    status: 'ONLINE',
    latencyMs: 48,
    accuracy: '96.8%',
    qps: 16.2,
    uptime: '99.96%',
    processedToday: 164,
    icon: 'Globe',
    color: '#0d9488',
    description: 'Generates culturally respectful, reassuring SMS and voice responses in Sinhala, Tamil, and English.',
    confidenceThreshold: 92,
    samplePrompt: 'Translate emergency triage status into empathetic Sinhala with dispatch ETA.'
  },
  {
    id: 'summarization',
    name: 'Crisis Summarization',
    category: 'Executive Intelligence',
    model: 'ReliefSum-Mixtral-8x7B',
    version: 'v2.2.0-prod',
    status: 'ONLINE',
    latencyMs: 65,
    accuracy: '94.1%',
    qps: 5.4,
    uptime: '99.94%',
    processedToday: 18,
    icon: 'FileText',
    color: '#6366f1',
    description: 'Synthesizes situational reports (SitReps) and multi-agency briefings from hundreds of live incident logs.',
    confidenceThreshold: 88,
    samplePrompt: 'Summarize key bottlenecks and priority life-threat cases in Western Province for District Secretariat.'
  }
];

export const TIME_RANGE_OPTIONS = [
  'Today',
  'Last 24 Hours',
  'Last 7 Days',
  'Last 30 Days',
  'Quarter-to-Date'
];

export const MULTILINGUAL_TRANSLATIONS = {
  English: "Your request has been received and is under high-priority review. A specialized medical team and ambulance have been dispatched and will reach your location within 30–45 minutes.",
  'Sinhala - සිංහල': "ඔබගේ ඉල්ලීම පද්ධතියට ලැබී ඇති අතර ඉහළ ප්‍රමුඛතාවක් සහිතව සමාලෝචනය කෙරේ. විශේෂ වෛද්‍ය කණ්ඩායමක් සහ ගිලන් රථයක් පිටත් කර ඇති අතර මිනිත්තු 30–45 ක් ඇතුළත ඔබ වෙත ළඟා වනු ඇත.",
  'Tamil - தமிழ்': "உங்கள் கோரிக்கை பெறப்பட்டு, அவசர முன்னுரிமையுடன் பரிசீலிக்கப்படுகிறது. ஒரு சிறப்பு மருத்துவக் குழு மற்றும் ஆம்புலன்ஸ் அனுப்பப்பட்டுள்ளது, அவர்கள் 30-45 நிமிடங்களுக்குள் உங்கள் இடத்தை அடைவார்கள்.",
  'Arabic - العربية': "تم استلام طلبك وهو قيد المراجعة ذات الأولوية القصوى. تم إرسال فريق طبي متخصص وسيارة إسعاف وسيصلان إلى موقعك خلال 30 إلى 45 دقيقة.",
  'French - Français': "Votre demande a été reçue et fait l'objet d'un examen prioritaire. Une équipe médicale spécialisée et une ambulance ont été dépêchées sur place et arriveront d'ici 30 à 45 minutes."
};

/**
 * Generates an SVG cubic Bézier path string passing EXACTLY through every point.
 * Mathematical guarantee: curves always touch and center upon all points.
 */
export const createSmoothSplinePath = (points, tension = 0.2) => {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;

    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
};

/**
 * Generates closed SVG area path for soft gradient fill under the curve.
 */
export const createSmoothAreaPath = (points, baselineY = 210, tension = 0.2) => {
  if (!points || points.length === 0) return '';
  const linePath = createSmoothSplinePath(points, tension);
  return `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baselineY} L ${points[0].x.toFixed(1)} ${baselineY} Z`;
};


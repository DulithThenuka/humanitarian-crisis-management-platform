/**
 * Emergency Coordinator Portal - Illustrative Operations Dataset
 * Designed for HumanAid / RELIEFCORE Crisis Response Coordination
 */

export const COORDINATOR_USER = {
  fullName: 'Maya Fernando',
  initials: 'MF',
  role: 'Emergency Coordinator',
  activeOperation: 'Western Province Flood Response',
  operationCode: 'CR-2026-014',
  sector: 'Kelani East - Sector 03',
  status: 'Online · Active Duty'
};

export const INITIAL_METRICS = {
  incomingRequests: 248,
  incomingTrend: '18 today',
  pendingReviews: 46,
  pendingTrend: '12 due soon',
  criticalPriority: 64,
  criticalTrend: '17 critical',
  moreInfoRequired: 9,
  moreInfoTrend: '3 overdue',
  activeEmergencies: 3,
  emergenciesTrend: '1 high severity',
  volunteersAssigned: 86,
  volunteersTrend: '12 tasks active'
};

export const RESPONSE_PERFORMANCE = [
  { label: 'Initial review within target', value: 84, color: '#0284c7' },
  { label: 'Requests verified', value: 71, color: '#0284c7' },
  { label: 'Resolved requests', value: 62, color: '#0284c7' },
  { label: 'Resource fulfillment', value: 68, color: '#0284c7' }
];

export const EMERGENCY_ALERTS = [
  {
    id: 'ALT-904',
    title: 'Flood warning - Kelani East',
    meta: 'Published · Updated 09:30',
    type: 'flood',
    severity: 'Critical',
    badgeClass: 'badge-critical'
  },
  {
    id: 'ALT-902',
    title: 'Road closure advisory',
    meta: 'Draft · Review required',
    type: 'road',
    severity: 'Draft',
    badgeClass: 'badge-draft'
  }
];

export const INITIAL_RECENT_ACTIVITY = [
  {
    id: 'ACT-1',
    time: '09:51',
    title: 'Approved AID-2051',
    detail: 'HMR-1042 priority review',
    type: 'approved'
  },
  {
    id: 'ACT-2',
    time: '09:38',
    title: 'Updated incident',
    detail: 'CR-2026-014 situation update',
    type: 'incident'
  },
  {
    id: 'ACT-3',
    time: '09:12',
    title: 'Requested resources',
    detail: '80 water units - RES-021',
    type: 'resource'
  },
  {
    id: 'ACT-4',
    time: '08:54',
    title: 'Verified request',
    detail: 'HMR-1039 medical request',
    type: 'verified'
  }
];

export const PRIORITY_CASES = [
  {
    id: 'HMR-1042',
    index: 1,
    title: 'Emergency shelter for displaced household',
    category: 'Emergency Shelter',
    categoryIcon: 'home',
    location: 'Kelani East · Zone 03',
    timeAgo: '8 min ago',
    submittedAt: '18 Feb 2026 at 09:34',
    severity: 'Critical',
    status: 'Pending verification',
    assignedTo: 'Assigned to you',
    requesterName: 'Nimal Silva',
    contactNumber: '+94 77 482 9104',
    contactStatus: 'Pending call-back',
    affectedSummary: '6 people affected · 2 adults, 2 children, 2 older adults',
    description: 'Flood water entered the household overnight. The family moved to a roadside location and needs accessible temporary accommodation.',
    generalLocation: 'Kelani East - Zone 03',
    accessibility: 'Step-free access required',
    emergencyContext: 'Active flood incident',
    attachmentsCount: 2,
    attachment: {
      fileName: 'flooded-home-entrance.jpg',
      fileSize: '2.4 MB',
      uploadType: 'Citizen upload',
      previewUrl: '/src/assets/req-drawer-flood.jpg'
    },
    history: [
      { time: '09:34', event: 'Request submitted', actor: 'Nimal Silva' },
      { time: '09:35', event: 'Submission confirmation delivered', actor: 'Communication service' },
      { time: '09:38', event: 'AI priority recommendation generated', actor: 'Priority scoring service' },
      { time: '09:42', event: 'Assigned for coordinator review', actor: 'Coordination system' }
    ],
    checklist: [
      { id: 'c1', label: 'Request category is consistent with description', checked: true, required: false },
      { id: 'c2', label: 'General location is within active operation', checked: true, required: false },
      { id: 'c3', label: 'Citizen contact information has been confirmed', checked: false, required: true },
      { id: 'c4', label: 'Supporting evidence has been reviewed', checked: false, required: true }
    ],
    notes: [
      { id: 'n1', author: 'Maya Fernando', time: '09:45', text: 'Spoke to Grama Niladhari division officer. Water level peaked at 1.2m around 04:00 AM.' }
    ]
  },
  {
    id: 'HMR-1041',
    index: 2,
    title: 'Drinking water distribution for cut-off sector',
    category: 'Drinking Water',
    categoryIcon: 'droplet',
    location: 'Biyagama North',
    timeAgo: '14 min ago',
    submittedAt: '18 Feb 2026 at 09:28',
    severity: 'High',
    status: 'Pending verification',
    assignedTo: 'Assigned to you',
    requesterName: 'Kamal Perera',
    contactNumber: '+94 71 839 2011',
    contactStatus: 'Verified via SMS',
    affectedSummary: '120 households · Municipal pipe burst under flood pressure',
    description: 'Contaminated well water. Need clean bottled drinking water pallets delivered to Biyagama Community Hall staging point.',
    generalLocation: 'Biyagama North - Ward 4',
    accessibility: 'Standard truck delivery',
    emergencyContext: 'Potable water supply failure',
    attachmentsCount: 1,
    attachment: {
      fileName: 'well-water-contamination.jpg',
      fileSize: '1.8 MB',
      uploadType: 'Field officer upload',
      previewUrl: '/src/assets/req-evidence-1.jpg'
    },
    history: [
      { time: '09:28', event: 'Request submitted', actor: 'Kamal Perera' },
      { time: '09:30', event: 'Automated triage scored high priority', actor: 'AI Decision Engine' },
      { time: '09:32', event: 'Assigned for coordinator review', actor: 'Coordination system' }
    ],
    checklist: [
      { id: 'c1', label: 'Request category is consistent with description', checked: true, required: false },
      { id: 'c2', label: 'General location is within active operation', checked: true, required: false },
      { id: 'c3', label: 'Citizen contact information has been confirmed', checked: true, required: true },
      { id: 'c4', label: 'Supporting evidence has been reviewed', checked: true, required: true }
    ],
    notes: []
  },
  {
    id: 'HMR-1039',
    index: 3,
    title: 'Urgent insulin & trauma dressings for elderly clinic',
    category: 'Medicine',
    categoryIcon: 'pill',
    location: 'Wattala South',
    timeAgo: '21 min ago',
    submittedAt: '18 Feb 2026 at 09:21',
    severity: 'Critical',
    status: 'Pending verification',
    assignedTo: 'Assigned to you',
    requesterName: 'Dr. S. Jayakody',
    contactNumber: '+94 76 990 1245',
    contactStatus: 'Verified call-back',
    affectedSummary: '18 elderly patients requiring refrigerated medication',
    description: 'Local pharmacy submerged. Generator power running out. Need cold-chain transport for 30 vials of insulin and sterile bandages.',
    generalLocation: 'Wattala South - Old Negombo Road',
    accessibility: 'Boat / 4WD transport only',
    emergencyContext: 'Critical medical supply line break',
    attachmentsCount: 2,
    attachment: {
      fileName: 'clinic-flooded-generator.jpg',
      fileSize: '3.1 MB',
      uploadType: 'Medical volunteer upload',
      previewUrl: '/src/assets/req-evidence-2.jpg'
    },
    history: [
      { time: '09:21', event: 'Request submitted', actor: 'Dr. S. Jayakody' },
      { time: '09:22', event: 'Categorized as Medical Critical', actor: 'AI Decision Engine' },
      { time: '09:25', event: 'Assigned for coordinator review', actor: 'Coordination system' }
    ],
    checklist: [
      { id: 'c1', label: 'Request category is consistent with description', checked: true, required: false },
      { id: 'c2', label: 'General location is within active operation', checked: true, required: false },
      { id: 'c3', label: 'Citizen contact information has been confirmed', checked: true, required: true },
      { id: 'c4', label: 'Supporting evidence has been reviewed', checked: false, required: true }
    ],
    notes: []
  },
  {
    id: 'HMR-1038',
    index: 4,
    title: 'Supplementary food packs for temporary relief staging',
    category: 'Food',
    categoryIcon: 'package',
    location: 'Kaduwela West',
    timeAgo: '29 min ago',
    submittedAt: '18 Feb 2026 at 09:13',
    severity: 'Medium',
    status: 'Pending verification',
    assignedTo: 'Assigned to you',
    requesterName: 'Anura Wickramasinghe',
    contactNumber: '+94 72 314 5589',
    contactStatus: 'Pending call-back',
    affectedSummary: '45 displaced persons staying at community hall',
    description: 'Dry rations, infant formula, and bottled milk requested for morning meal distribution.',
    generalLocation: 'Kaduwela West - Korathota',
    accessibility: 'Road accessible via bypass',
    emergencyContext: 'Secondary relief center staging',
    attachmentsCount: 1,
    attachment: {
      fileName: 'kaduwela-staging-pantry.jpg',
      fileSize: '1.5 MB',
      uploadType: 'Volunteer upload',
      previewUrl: '/src/assets/shelter-1.jpg'
    },
    history: [
      { time: '09:13', event: 'Request submitted', actor: 'Anura Wickramasinghe' },
      { time: '09:15', event: 'Assigned for coordinator review', actor: 'Coordination system' }
    ],
    checklist: [
      { id: 'c1', label: 'Request category is consistent with description', checked: true, required: false },
      { id: 'c2', label: 'General location is within active operation', checked: true, required: false },
      { id: 'c3', label: 'Citizen contact information has been confirmed', checked: false, required: true },
      { id: 'c4', label: 'Supporting evidence has been reviewed', checked: true, required: true }
    ],
    notes: []
  }
];

// All Assistance Requests Table Dataset (Screenshot 1)
export const ASSISTANCE_REQUESTS_LIST = [
  {
    id: 'HMR-1042',
    category: 'Emergency Shelter',
    submitted: '18 Feb · 09:34',
    location: 'Kelani East · Zone 03',
    people: 6,
    aiPriority: 'Critical',
    aiScore: '0.89',
    verification: 'Pending review',
    coordinator: 'M. Fernando',
    status: 'Awaiting Human Review',
    statusClass: 'status-awaiting'
  },
  {
    id: 'HMR-1041',
    category: 'Drinking Water',
    submitted: '18 Feb · 09:28',
    location: 'Biyagama North',
    people: 24,
    aiPriority: 'High',
    aiScore: '0.84',
    verification: 'Pending review',
    coordinator: 'M. Fernando',
    status: 'Verified',
    statusClass: 'status-verified'
  },
  {
    id: 'HMR-1039',
    category: 'Medicine',
    submitted: '18 Feb · 09:21',
    location: 'Wattala South',
    people: 3,
    aiPriority: 'Critical',
    aiScore: '0.92',
    verification: 'Verified',
    coordinator: 'M. Fernando',
    status: 'Assigned',
    statusClass: 'status-assigned'
  },
  {
    id: 'HMR-1038',
    category: 'Food',
    submitted: '18 Feb · 09:12',
    location: 'Kaduwela West',
    people: 18,
    aiPriority: 'Medium',
    aiScore: '0.76',
    verification: 'Pending review',
    coordinator: 'Unassigned',
    status: 'Under Review',
    statusClass: 'status-review'
  },
  {
    id: 'HMR-1036',
    category: 'Transportation',
    submitted: '18 Feb · 08:58',
    location: 'Hanwella Zone 02',
    people: 8,
    aiPriority: 'High',
    aiScore: '0.81',
    verification: 'Pending review',
    coordinator: 'Unassigned',
    status: 'Pending Assignment',
    statusClass: 'status-pending'
  },
  {
    id: 'HMR-1035',
    category: 'Emergency Shelter',
    submitted: '18 Feb · 08:42',
    location: 'Kolonnawa Sector 1',
    people: 5,
    aiPriority: 'High',
    aiScore: '0.83',
    verification: 'Pending review',
    coordinator: 'M. Fernando',
    status: 'Awaiting Human Review',
    statusClass: 'status-awaiting'
  },
  {
    id: 'HMR-1031',
    category: 'Drinking Water',
    submitted: '18 Feb · 08:15',
    location: 'Malwana Central',
    people: 35,
    aiPriority: 'Critical',
    aiScore: '0.94',
    verification: 'Verified',
    coordinator: 'M. Fernando',
    status: 'In Dispatch',
    statusClass: 'status-dispatch'
  }
];

// AI Decision Support Dataset (Screenshots 2 & 3)
export const AI_DECISION_SUPPORT_DATA = {
  assessmentId: 'AID-2051',
  relatedCaseId: 'HMR-1042',
  status: 'Pending Human Review',
  disclaimer: 'You remain responsible for the final decision. Never reject a request solely because of an AI score, missing data, or a suspected duplicate.',
  recommendedPriority: 'Critical',
  urgencyScore: 89,
  confidence: 89,
  confidenceNote: 'Confidence reflects model certainty, not verified accuracy or entitlement to assistance.',
  factors: [
    {
      id: 'f1',
      title: 'Immediate exposure risk',
      detail: 'Rising floodwater and unsafe roadside location',
      impact: 'High'
    },
    {
      id: 'f2',
      title: 'People potentially affected',
      detail: '6 household members',
      impact: 'High'
    },
    {
      id: 'f3',
      title: 'Vulnerability indicators',
      detail: 'Children and mobility requirement provided',
      impact: 'High'
    },
    {
      id: 'f4',
      title: 'Time sensitivity',
      detail: 'Conditions may worsen before nightfall',
      impact: 'Medium'
    }
  ],
  duplicateWarning: {
    similarity: '71% similarity',
    note: 'Potentially related — never automatically deleted',
    matchId: 'HMR-1018',
    matchCategory: 'Shelter request',
    matchDesc: 'Same general area · different household size and submission time'
  },
  recommendedActions: [
    'Verify current safety and contact details',
    'Review accessible shelter options',
    'Coordinate emergency kit and transport need',
    'Check potentially related request separately'
  ],
  suggestedResources: ['Temporary Shelter', 'Transport', 'Emergency Kit']
};

// Crisis & Incident Management Dataset (Screenshots 4 & 5)
export const CRISIS_INCIDENTS_DATA = [
  {
    id: 'CR-2026-014',
    title: 'Western Province Flood Response',
    leadTeam: 'National Relief Unit',
    severity: 'High',
    severityPillClass: 'pill-high',
    area: 'Demonstration operational area · 2,840 affected',
    stats: '248 requests · Team 1 assigned · Active',
    affectedEstimate: '2,840 people',
    relatedRequests: '248 open',
    assignedCoordinator: 'Maya Fernando',
    currentStatus: 'Active response',
    unresolvedIssues: [
      {
        id: 'iss-1',
        title: 'Drinking water shortfall of 140 units',
        percentage: 65,
        severity: 'Critical'
      },
      {
        id: 'iss-2',
        title: 'Four shelters above 85% public planning threshold',
        percentage: 88,
        severity: 'Attention'
      }
    ],
    timeline: [
      { time: '09:58', event: 'Shelter SH-008 status updated', actor: 'Recorded by authorised coordinator' },
      { time: '09:42', event: 'Critical flood alert published', actor: 'Recorded by authorised coordinator' },
      { time: '09:20', event: 'Resource shortage escalated', actor: 'Recorded by authorised coordinator' },
      { time: '08:45', event: 'Operational area expanded', actor: 'Recorded by authorised coordinator' }
    ]
  },
  {
    id: 'CR-2026-011',
    title: 'Biyagama Landslide Watch',
    leadTeam: 'District Engineering Corps',
    severity: 'Medium',
    severityPillClass: 'pill-medium',
    area: 'Demonstration operational area · 420 potentially affected',
    stats: '31 requests · Team 2 assigned · Active',
    affectedEstimate: '420 people',
    relatedRequests: '31 open',
    assignedCoordinator: 'D. Senanayake',
    currentStatus: 'Active surveillance',
    unresolvedIssues: [
      {
        id: 'iss-3',
        title: 'Slope movement sensors battery maintenance overdue',
        percentage: 45,
        severity: 'Attention'
      }
    ],
    timeline: [
      { time: '09:10', event: 'Geotechnical alert issued', actor: 'Recorded by Disaster Management Center' },
      { time: '08:20', event: 'Evacuation advisory sent to Ward 4', actor: 'Recorded by field coordinator' }
    ]
  },
  {
    id: 'CR-2026-009',
    title: 'Wattala Disease Cluster',
    leadTeam: 'Public Health Department',
    severity: 'High',
    severityPillClass: 'pill-high',
    area: 'Demonstration operational area · 184 reported cases',
    stats: '46 requests · Team 3 assigned · Active',
    affectedEstimate: '184 cases',
    relatedRequests: '46 open',
    assignedCoordinator: 'Dr. Jayakody / M. Fernando',
    currentStatus: 'Active isolation & mobile dispensary',
    unresolvedIssues: [
      {
        id: 'iss-4',
        title: 'Chlorination powder and water test kits pending dispatch',
        percentage: 78,
        severity: 'Critical'
      }
    ],
    timeline: [
      { time: '09:30', event: 'Mobile water testing unit dispatched', actor: 'Recorded by Medical Response Command' },
      { time: '08:50', event: 'Temporary quarantine zone demarcated', actor: 'Recorded by Public Health Officer' }
    ]
  }
];

// Resource Coordination Dataset (Screenshot 1)
export const RESOURCE_COORDINATION_DATA = [
  {
    id: 'RES-001',
    category: 'Drinking Water',
    requested: 380,
    unit: 'units',
    available: 240,
    allocated: 240,
    outstanding: 140,
    fulfillmentStatus: 'Shortage',
    destination: 'Kelani East',
    relatedRecord: 'RES-021 / HMR-1042',
    priority: 'Critical'
  },
  {
    id: 'RES-002',
    category: 'Emergency Food Kits',
    requested: 190,
    unit: 'kits',
    available: 320,
    allocated: 160,
    outstanding: 0,
    fulfillmentStatus: 'Approved',
    destination: 'Zone 03',
    relatedRecord: 'REQ-302',
    priority: 'High'
  },
  {
    id: 'RES-003',
    category: 'Medicine Packs',
    requested: 75,
    unit: 'packs',
    available: 110,
    allocated: 60,
    outstanding: 0,
    fulfillmentStatus: 'Dispatched',
    destination: 'Wattala South',
    relatedRecord: 'REQ-303',
    priority: 'Critical'
  },
  {
    id: 'RES-004',
    category: 'Temporary Shelter Kits',
    requested: 48,
    unit: 'kits',
    available: 52,
    allocated: 32,
    outstanding: 0,
    fulfillmentStatus: 'Requested',
    destination: 'Biyagama North',
    relatedRecord: 'REQ-304',
    priority: 'Medium'
  },
  {
    id: 'RES-005',
    category: 'Hygiene & Sanitation Packs',
    requested: 120,
    unit: 'kits',
    available: 150,
    allocated: 120,
    outstanding: 0,
    fulfillmentStatus: 'Delivered',
    destination: 'Kelani West',
    relatedRecord: 'REQ-305',
    priority: 'Medium'
  }
];

export const RESOURCE_DISTRIBUTION_STATUS = [
  { stage: 'Requested', units: 430, total: 450, color: '#0284c7' },
  { stage: 'Approved', units: 342, total: 450, color: '#0ea5e9' },
  { stage: 'Dispatched', units: 228, total: 450, color: '#38bdf8' },
  { stage: 'Delivered', units: 146, total: 450, color: '#10b981' }
];

// Shelter & Volunteer Coordination Dataset (Screenshot 2)
export const SHELTERS_DATA = [
  {
    id: 'SH-008',
    name: 'Kelani Community Centre',
    status: 'Operational',
    statusPillClass: 'pill-operational',
    location: 'Kelani East',
    updatedAgo: 'Updated 5 min ago',
    occupancy: 164,
    capacity: 200,
    remaining: 36,
    accessibility: 'Step-free access',
    contact: '+94 11 254 7891'
  },
  {
    id: 'SH-003',
    name: 'Biyagama School Hall',
    status: 'Near capacity',
    statusPillClass: 'pill-warning',
    location: 'Biyagama North',
    updatedAgo: 'Updated 14 min ago',
    occupancy: 194,
    capacity: 220,
    remaining: 26,
    accessibility: 'Accessible toilets',
    contact: '+94 11 254 8832'
  },
  {
    id: 'SH-011',
    name: 'Wattala Civic Centre',
    status: 'Operational',
    statusPillClass: 'pill-operational',
    location: 'Wattala South',
    updatedAgo: 'Updated 20 min ago',
    occupancy: 112,
    capacity: 180,
    remaining: 68,
    accessibility: 'Family areas',
    contact: '+94 11 254 9920'
  },
  {
    id: 'SH-015',
    name: 'Peliyagoda Youth Center',
    status: 'Operational',
    statusPillClass: 'pill-operational',
    location: 'Peliyagoda Central',
    updatedAgo: 'Updated 42 min ago',
    occupancy: 84,
    capacity: 150,
    remaining: 66,
    accessibility: 'Medical bay equipped',
    contact: '+94 11 254 3311'
  }
];

export const VOLUNTEERS_DATA = [
  {
    ref: 'VOL-0184',
    skills: 'Logistics, First Aid',
    availability: 'Available',
    availabilityClass: 'pill-available',
    area: 'Kelani East',
    task: 'Unassigned',
    taskStatus: 'Available',
    history: '12 completed'
  },
  {
    ref: 'VOL-0212',
    skills: 'Driving, Distribution',
    availability: 'On assignment',
    availabilityClass: 'pill-assignment',
    area: 'Biyagama North',
    task: 'Supply distribution',
    taskStatus: 'In progress',
    history: '8 completed'
  },
  {
    ref: 'VOL-0261',
    skills: 'Translation, Childcare',
    availability: 'Available',
    availabilityClass: 'pill-available',
    area: 'Wattala South',
    task: 'Unassigned',
    taskStatus: 'Available',
    history: '5 completed'
  },
  {
    ref: 'VOL-0309',
    skills: 'Boat Operations, Search & Rescue',
    availability: 'Available',
    availabilityClass: 'pill-available',
    area: 'Kelani River Sector',
    task: 'Unassigned',
    taskStatus: 'Available',
    history: '19 completed'
  }
];

// Emergency Alerts Dataset (Screenshots 3, 4, 5)
export const EMERGENCY_ALERTS_LIST = [
  {
    id: 'ALT-204',
    title: 'Flood warning for low-lying Kelani East areas',
    category: 'Flood warning',
    severity: 'Critical',
    severityClass: 'pill-critical',
    area: 'Kelani East',
    publication: 'Published',
    tab: 'active',
    createdBy: 'Maya Fernando',
    lastUpdated: '5 min ago',
    startTime: '02/18/2026 10:30 AM',
    expiryTime: '02/18/2026 08:00 PM',
    message: 'Water levels are expected to remain elevated. Avoid flooded roads and follow instructions from verified response teams.',
    safetyInstructions: [
      'Move essential medicines and documents to safety.',
      'Do not walk or drive through flood water.',
      'Use verified shelters only.'
    ]
  },
  {
    id: 'ALT-201',
    title: 'Temporary road closure near Biyagama North',
    category: 'Road closure',
    severity: 'High',
    severityClass: 'pill-high',
    area: 'Biyagama North',
    publication: 'Published',
    tab: 'active',
    createdBy: 'R. Perera',
    lastUpdated: '32 min ago',
    startTime: '02/18/2026 09:15 AM',
    expiryTime: '02/18/2026 06:00 PM',
    message: 'Bridge access restricted due to minor subsidence. Divert all emergency transit via bypass route B-4.',
    safetyInstructions: [
      'Follow detour signage posted at junction 4B.',
      'Emergency vehicles maintain radio contact on Channel 3.'
    ]
  },
  {
    id: 'ALT-198',
    title: 'Potable water distribution schedule for Wattala South',
    category: 'Resource notice',
    severity: 'Moderate',
    severityClass: 'pill-moderate',
    area: 'Wattala South',
    publication: 'Draft',
    tab: 'drafts',
    createdBy: 'Maya Fernando',
    lastUpdated: '1 hr ago',
    startTime: '02/18/2026 01:00 PM',
    expiryTime: '02/18/2026 07:00 PM',
    message: 'Water bowsers will arrive at Community Ground from 13:00 to 19:00. Limit 20L per family unit.',
    safetyInstructions: [
      'Bring clean, sealed containers.',
      'Prioritize elderly and pregnant residents in distribution queue.'
    ]
  },
  {
    id: 'ALT-195',
    title: 'Night curfew advisory along riverbank settlements',
    category: 'Civil safety',
    severity: 'High',
    severityClass: 'pill-high',
    area: 'Kelani East - Riverbank',
    publication: 'Draft',
    tab: 'drafts',
    createdBy: 'D. Senanayake',
    lastUpdated: '2 hrs ago',
    startTime: '02/18/2026 08:00 PM',
    expiryTime: '02/19/2026 05:30 AM',
    message: 'Precautionary curfew implemented from 20:00 to 05:30. River patrols active.',
    safetyInstructions: [
      'Remain indoors or within certified evacuation shelters.',
      'Report any levee seepage immediately via DMC hotline 117.'
    ]
  },
  {
    id: 'ALT-192',
    title: 'Scheduled power shutdown for transformer maintenance',
    category: 'Infrastructure',
    severity: 'Low',
    severityClass: 'pill-low',
    area: 'Biyagama Zone 2',
    publication: 'Scheduled',
    tab: 'scheduled',
    createdBy: 'CEB Grid Controller',
    lastUpdated: '3 hrs ago',
    startTime: '02/19/2026 06:00 AM',
    expiryTime: '02/19/2026 09:00 AM',
    message: 'Controlled outage for emergency water pump tie-in.',
    safetyInstructions: [
      'Keep backup batteries charged.',
      'Medical equipment users notify sector coordinator.'
    ]
  },
  {
    id: 'ALT-185',
    title: 'Resolved: Kelani Bridge debris clearance completed',
    category: 'Road update',
    severity: 'Resolved',
    severityClass: 'pill-resolved',
    area: 'Kelani Central Bridge',
    publication: 'Resolved',
    tab: 'resolved',
    createdBy: 'Road Development Authority',
    lastUpdated: 'Yesterday',
    startTime: '02/17/2026 08:00 AM',
    expiryTime: '02/17/2026 04:00 PM',
    message: 'All driftwood cleared. Dual carriageway reopened to normal traffic.',
    safetyInstructions: ['Normal driving speeds permitted.']
  }
];


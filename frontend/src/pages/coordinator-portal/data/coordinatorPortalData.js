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

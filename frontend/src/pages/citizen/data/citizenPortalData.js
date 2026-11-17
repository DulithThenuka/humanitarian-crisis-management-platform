// ==========================================
// Official Citizen Portal Data
// User: Nimal Silva (Citizen Account)
// ==========================================

export const INITIAL_CITIZEN_PROFILE = {
  fullName: 'Nimal Silva',
  shortName: 'NS',
  email: 'nimal.silva@example.test',
  phone: '+94 77 *** **42',
  location: 'Kelani East',
  preferredLanguage: 'English',
  contactPreference: 'SMS and phone call',
  householdSize: '6',
  accessibilityRequirements: 'Step-free access may be required'
};

export const DASHBOARD_METRICS = {
  activeRequests: 2,
  awaitingReview: 1,
  assistanceInProgress: 1,
  completedRequests: 3
};

export const ACTIVE_REQUEST_PROGRESS = {
  id: 'HMR-1042',
  title: 'Emergency Shelter',
  steps: [
    { label: 'Request submitted', time: '08:34', status: 'completed' },
    { label: 'Under review', time: 'Current', status: 'current' },
    { label: 'Verified', time: 'Next', status: 'upcoming' },
    { label: 'Assistance assigned', time: 'Pending', status: 'upcoming' }
  ],
  nextInfo: 'An authorised coordinator is checking your information. We may ask for more details.'
};

export const RECENT_REQUESTS = [
  {
    id: 'HMR-1042',
    category: 'Emergency Shelter',
    iconType: 'home',
    date: 'Submitted 18 Feb',
    status: 'Under Review',
    statusType: 'review',
    updated: 'Updated 12 min ago'
  },
  {
    id: 'HMR-0001',
    category: 'Drinking Water',
    iconType: 'droplet',
    date: 'Submitted 12 Feb',
    status: 'Completed',
    statusType: 'completed',
    updated: 'Completed 14 Feb'
  },
  {
    id: 'HMR-0924',
    category: 'Medical Assistance',
    iconType: 'medical',
    date: 'Submitted 04 Feb',
    status: 'Completed',
    statusType: 'completed',
    updated: 'Completed 05 Feb'
  }
];

export const MY_REQUESTS_LIST = [
  {
    id: 'HMR-1042',
    category: 'Emergency Shelter',
    title: 'Shelter needed after home flooding',
    iconType: 'home',
    status: 'Under Review',
    statusType: 'review',
    submitted: '18 Feb 2026',
    lastUpdated: '12 min ago'
  },
  {
    id: 'HMR-1021',
    category: 'Drinking Water',
    title: 'Clean water for household',
    iconType: 'droplet',
    status: 'More Information Required',
    statusType: 'warning',
    submitted: '17 Feb 2026',
    lastUpdated: '1 hour ago'
  },
  {
    id: 'HMR-0981',
    category: 'Drinking Water',
    title: 'Water supply after service interruption',
    iconType: 'droplet',
    status: 'Completed',
    statusType: 'completed',
    submitted: '12 Feb 2026',
    lastUpdated: '14 Feb 2026'
  }
];

export const EMERGENCY_ALERTS_LIST = [
  {
    id: 'ALT-101',
    severity: 'Critical',
    severityType: 'critical',
    time: 'Verified · Published today, 8:30',
    title: 'Flood warning for low-lying Kelani East areas',
    location: 'Kelani East · Zones 02–03',
    description: 'Avoid flooded roads and follow official evacuation guidance.',
    borderAccent: '#dc2626'
  },
  {
    id: 'ALT-102',
    severity: 'High',
    severityType: 'warning',
    time: 'Verified · Published today, 9:30',
    title: 'Temporary road closure near Biyagama North',
    location: 'Biyagama North',
    description: 'Use the marked alternative route and allow emergency vehicles through.',
    borderAccent: '#f59e0b'
  },
  {
    id: 'ALT-103',
    severity: 'Information',
    severityType: 'info',
    time: 'Verified · Published today, 10:30',
    title: 'Verified help centres extended opening hours',
    location: 'Western Province demonstration area',
    description: 'Three centres will remain open until 22:00 today.',
    borderAccent: '#3b82f6'
  }
];

export const SHELTERS_LIST = [
  {
    id: 'SH-001',
    name: 'Kelani Community Help Centre',
    distance: 'Kelani East · 1.8 km',
    status: 'Operational',
    statusType: 'operational',
    updateNote: 'Limited spaces reported · Last update 12 min ago',
    tags: ['Drinking water', 'Accessible entrance', 'Basic support'],
    iconType: 'home'
  },
  {
    id: 'SH-002',
    name: 'Biyagama School Assistance Point',
    distance: 'Biyagama North · 4.2 km',
    status: 'Operational',
    statusType: 'pending',
    updateNote: 'Availability not confirmed · Last update 21 min ago',
    tags: ['Drinking water', 'Accessible entrance', 'Basic support'],
    iconType: 'school'
  },
  {
    id: 'SH-003',
    name: 'Wattala Civic Service Centre',
    distance: 'Wattala South · 7.1 km',
    status: 'Open for services',
    statusType: 'operational',
    updateNote: 'No overnight shelter · Last update 30 min ago',
    tags: ['Information only'],
    iconType: 'building'
  }
];

export const CITIZEN_NOTIFICATIONS = [
  {
    id: 'NTF-C1',
    category: 'REQUEST UPDATES',
    isUnread: true,
    title: 'Your request is under review',
    description: 'HMR-1042 is being checked by an authorised coordinator.',
    time: 'Today · 08:42 · Related request',
    iconType: 'file'
  },
  {
    id: 'NTF-C2',
    category: 'IMPORTANT ANNOUNCEMENTS',
    isUnread: true,
    title: 'Verified flood warning published',
    description: 'Avoid flooded roads in Kelani East zones 02–03.',
    time: 'Today · 08:30',
    iconType: 'alert'
  },
  {
    id: 'NTF-C3',
    category: 'REQUEST UPDATES',
    isUnread: true,
    title: 'More information required',
    description: 'Please answer two questions about request HMR-1021.',
    time: 'Today · 08:40 · Related request',
    iconType: 'file'
  },
  {
    id: 'NTF-C4',
    category: 'ASSISTANCE ASSIGNMENT',
    isUnread: false,
    title: 'Water assistance completed',
    description: 'Request HMR-0981 was marked completed.',
    time: '14 Feb · 16:20 · Related request',
    iconType: 'check'
  }
];

export const FAQ_QUESTIONS = [
  {
    q: 'How do I submit a request?',
    a: 'Use Submit Assistance Request and complete all three steps.'
  },
  {
    q: 'How do I track a request?',
    a: 'Open My Requests and select the request reference.'
  },
  {
    q: 'How do I update information?',
    a: 'Respond when staff request details or contact support.'
  },
  {
    q: 'How do I find shelters?',
    a: 'Use the verified public directory and check updates before travel.'
  }
];

export const ASSISTANCE_CATEGORIES = [
  { id: 'food', label: 'Food', icon: 'utensils' },
  { id: 'water', label: 'Drinking Water', icon: 'droplet' },
  { id: 'medicine', label: 'Medicine', icon: 'pill' },
  { id: 'shelter', label: 'Temporary Shelter', icon: 'home', defaultChecked: true },
  { id: 'transport', label: 'Transportation', icon: 'bus' },
  { id: 'medical', label: 'Medical Assistance', icon: 'pulse' },
  { id: 'accessibility', label: 'Accessibility Assistance', icon: 'accessibility' },
  { id: 'other', label: 'Other Emergency Needs', icon: 'plus' }
];

export const AI_SUGGESTIONS = [
  'How do I request emergency assistance?',
  'How can I check my request status?',
  'Where can I find a shelter?',
  'What information should I include?',
  'How do I update my request?'
];

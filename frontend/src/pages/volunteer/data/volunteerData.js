// Volunteer Admin / Volunteer Portal Data Store
// HumanAid Response Coordination Platform

export const VOLUNTEER_USER = {
  name: 'Nadeesha Perera',
  role: 'Humanitarian Volunteer',
  roleCode: 'VOLUNTEER',
  shortRole: 'Verified Volunteer',
  avatar: 'NP',
  volunteerId: 'VOL-LK-8841',
  operationArea: 'Kelani East and nearby service areas',
  serviceArea: 'Kelani East',
  notificationCount: 3,
  dutyStatus: true,
  dutyLoggedTime: 'Logged 18:00 - Logistics, First Aid and Shelter shifts',
  phone: '+94 77 123 4567',
  email: 'nadeesha.perera@humanaid.lk',
  bloodGroup: 'O+',
  emergencyContact: 'Sunil Perera (Father) - +94 71 987 6543',
  verificationTier: 'Tier 2 - Field Operative (Verified)',
  certifications: [
    { title: 'Emergency First Aid (Level 2)', issuer: 'Sri Lanka Red Cross', year: '2025' },
    { title: 'Humanitarian Supply Chain & Warehousing', issuer: 'UN OCHA Certified', year: '2025' },
    { title: 'Child & Vulnerable Adult Safeguarding', issuer: 'Disaster Management Centre', year: '2024' },
    { title: 'Disaster Assessment & Shelter Intake', issuer: 'HumanAid Academy', year: '2026' }
  ]
};

export const INITIAL_METRICS = {
  assignedTasks: 3,
  assignedSub: '1 upcoming',
  pendingAcceptance: 1,
  pendingSub: '1 responding by 18:00',
  inProgress: 0,
  inProgressSub: 'Current assignment',
  completedTasks: 12,
  completedSub: '38 volunteer hours'
};

export const MOST_UPCOMING_ASSIGNMENT = {
  id: 'VOL-009',
  title: 'Emergency Supply Distribution',
  code: 'VOL-009 - Kelani East Distribution Point - 08:30-13:30',
  day: '19',
  month: 'FEB',
  dateStr: '19 Feb 2026',
  time: '08:30-13:30',
  reportingBy: 'Today - 18:00',
  location: 'Kelani East Distribution Point',
  area: 'Kelani East',
  tags: ['Logistics', 'First Aid', 'High Priority'],
  coordinator: 'Maya Fernando',
  coordinatorPhone: '+94 77 555 0192',
  description: 'Support authorized humanitarian distribution team with unloading trucks, categorizing dry rations, and handing out relief packages to displaced families.',
  ppeRequired: 'Reflective vest, safety boots, work gloves',
  status: 'Offered'
};

export const UPCOMING_ASSIGNMENTS = [
  {
    id: 'VOL-009',
    title: 'Emergency Supply Distribution',
    timeLoc: '19 Feb - 08:30 - Kelani East',
    status: 'Offered',
    badgeType: 'warning',
    iconType: 'truck'
  },
  {
    id: 'VOL-004',
    title: 'Shelter Support Shift',
    timeLoc: '21 Feb - 14:00 - Niyagama North',
    status: 'Assigned',
    badgeType: 'info',
    iconType: 'shelter'
  }
];

export const RECENT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New assignment offered',
    subtitle: 'VOL-009 - Emergency Supply Distribution',
    time: '10 mins ago',
    type: 'assignment',
    unread: true
  },
  {
    id: 'notif-2',
    title: 'Safety instructions updated',
    subtitle: 'Shelter Support (VOL-004) - PPE mandatory',
    time: '1 hour ago',
    type: 'safety',
    unread: true
  },
  {
    id: 'notif-3',
    title: 'Task completion approved',
    subtitle: 'VOL-001 - Thank you - 3 hours log',
    time: 'Yesterday',
    type: 'approval',
    unread: false
  }
];

export const VOLUNTEER_ACTIVITY_SUMMARY = {
  completedAssignments: 12,
  volunteerHours: '38h',
  primaryServiceArea: 'Kelani East',
  coordinatorVerificationStatus: 'Verified'
};

export const INITIAL_OPPORTUNITIES = [
  {
    id: 'VOL-009',
    categoryCode: 'VOL-009 - Logistics',
    category: 'Logistics',
    title: 'Emergency Supply Distribution',
    description: 'Support the authorized distribution team with organizing and handing out emergency supplies.',
    duration: '5 hours',
    date: '19 Feb - 08:30',
    volunteersNeeded: '3 volunteers',
    location: 'Kelani East',
    priority: 'High',
    priorityColor: 'orange',
    skills: ['Logistics', 'First Aid'],
    eligibilityType: 'eligible',
    eligibilityText: 'You meet the basic eligibility requirements.',
    coordinator: 'Maya Fernando',
    contactPhone: '+94 77 555 0192',
    shift: 'Morning Shift (08:30 - 13:30)'
  },
  {
    id: 'VOL-004',
    categoryCode: 'VOL-004 - Shelter Support',
    category: 'Shelter Support',
    title: 'Shelter Welcome Desk Support',
    description: 'Assist an authorized humanitarian team with a defined, supervised operational task.',
    duration: '6 hours',
    date: '21 Feb - 14:00',
    volunteersNeeded: '2 volunteers',
    location: 'Niyagama North',
    priority: 'Medium',
    priorityColor: 'blue',
    skills: ['Communication', 'Registration'],
    eligibilityType: 'eligible',
    eligibilityText: 'You meet the basic eligibility requirements.',
    coordinator: 'Ruwan Perera',
    contactPhone: '+94 71 888 2390',
    shift: 'Afternoon Shift (14:00 - 20:00)'
  },
  {
    id: 'VOL-008',
    categoryCode: 'VOL-008 - Community Support',
    category: 'Community Support',
    title: 'Multilingual Information Support',
    description: 'Assist an authorized humanitarian team with a defined, supervised operational task.',
    duration: '4 hours',
    date: '25 Feb - 09:00',
    volunteersNeeded: '2 volunteers',
    location: 'Central Depot',
    priority: 'Medium',
    priorityColor: 'blue',
    skills: ['Sinhala', 'Tamil', 'English'],
    eligibilityType: 'attention',
    eligibilityText: 'Language preference applies for coordinator verification.',
    coordinator: 'Kamal Gunaratne',
    contactPhone: '+94 76 345 6789',
    shift: 'Morning Shift (09:00 - 13:00)'
  },
  {
    id: 'VOL-001',
    categoryCode: 'VOL-001 - Logistics',
    category: 'Logistics',
    title: 'Emergency Kit Packing',
    description: 'Assist an authorized humanitarian team with a defined, supervised operational task.',
    duration: '3 hours',
    date: '12 Feb - 10:00',
    volunteersNeeded: '5 volunteers',
    location: 'Central Depot',
    priority: 'Low',
    priorityColor: 'gray',
    skills: ['Packing', 'Inventory'],
    eligibilityType: 'eligible',
    eligibilityText: 'You meet the basic eligibility requirements.',
    coordinator: 'Dilak Peiris',
    contactPhone: '+94 70 234 5678',
    shift: 'Morning Shift (10:00 - 13:00)'
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'VOL-009',
    taskTitle: 'Emergency Supply Distribution',
    assigned: '18 Feb',
    deadline: '19 Feb - 12:00',
    location: 'Kelani East',
    coordinator: 'Maya Fernando',
    priority: 'High',
    status: 'Offered',
    nextAction: 'Respond',
    actionType: 'respond',
    details: 'Distribution point staging area at Kelani Community Hall. Distribution of 300 emergency dry ration packs.'
  },
  {
    id: 'VOL-004',
    taskTitle: 'Shelter Support Shift',
    assigned: '17 Feb',
    deadline: '21 Feb - 20:00',
    location: 'Niyagama North',
    coordinator: 'Ruwan Perera',
    priority: 'Medium',
    status: 'Accepted',
    nextAction: 'Open task',
    actionType: 'open',
    details: 'Reception and desk registration for incoming families evacuated from flood-affected zones in Niyagama.'
  },
  {
    id: 'VOL-001',
    taskTitle: 'Emergency Kit Packing',
    assigned: '12 Feb',
    deadline: '12 Feb - 13:00',
    location: 'Central Depot',
    coordinator: 'Dilak Peiris',
    priority: 'Low',
    status: 'Completed',
    nextAction: 'View history',
    actionType: 'history',
    details: 'Assembly of hygiene kits and family dignity packs for rapid deployment. 3 hours served and certified.'
  }
];

export const INITIAL_SCHEDULE_DAYS = [
  { day: 'Mon', date: 17, hasTask: false },
  {
    day: 'Tue',
    date: 18,
    hasTask: true,
    taskTitle: 'Kit Packing',
    taskSub: 'Completed',
    status: 'completed'
  },
  {
    day: 'Wed',
    date: 19,
    hasTask: true,
    taskTitle: 'Supply Distribution',
    taskSub: 'Kelani East',
    status: 'active',
    isToday: true
  },
  { day: 'Thu', date: 20, hasTask: false },
  {
    day: 'Fri',
    date: 21,
    hasTask: true,
    taskTitle: 'Shelter Support',
    taskSub: 'Niyagama North',
    status: 'assigned'
  },
  { day: 'Sat', date: 22, hasTask: false },
  { day: 'Sun', date: 23, hasTask: false }
];

export const INITIAL_AVAILABILITY_DAYS = [
  { day: 'Monday', active: true, start: '08:00 AM', end: '05:00 PM' },
  { day: 'Tuesday', active: true, start: '08:00 AM', end: '05:00 PM' },
  { day: 'Wednesday', active: true, start: '08:00 AM', end: '05:00 PM' },
  { day: 'Thursday', active: true, start: '08:00 AM', end: '05:00 PM' },
  { day: 'Friday', active: true, start: '08:00 AM', end: '05:00 PM' },
  { day: 'Saturday', active: false, start: '08:00 AM', end: '05:00 PM' },
  { day: 'Sunday', active: false, start: '08:00 AM', end: '05:00 PM' }
];

export const INITIAL_PREFERRED_CATEGORIES = [
  { name: 'Logistics', checked: true },
  { name: 'First Aid', checked: true },
  { name: 'Supply Distribution', checked: true },
  { name: 'Shelter Support', checked: false }
];

export const SERVICE_AREAS = [
  'Kelani East and nearby areas',
  'Niyagama North sector',
  'Central Depot & Western Hub',
  'Colombo Central District',
  'Kalutara Flood Response Zone'
];


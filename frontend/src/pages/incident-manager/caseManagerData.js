// Initial Mock Data for Incident / Case Manager Portal

export const CASE_MANAGER_USER = {
  name: 'Ishara Senanayake',
  role: 'Incident / Case Manager',
  shortRole: 'Case Manager',
  initials: 'IS',
  zone: 'Western Province - Kelani River Sector 03',
  clearance: 'Level 3 - Role-Scoped Incident Coordinator',
  activeOperation: 'Western Province Flood',
  badgeCount: 5
};

export const INITIAL_METRICS = {
  assignedCases: { value: 42, sub: '2 due today' },
  openUnresolved: { value: 31, sub: '4 overdue' },
  escalated: { value: 6, sub: '2 critical' },
  awaitingVerification: { value: 9, sub: '3 need evidence' },
  needInformation: { value: 5, sub: 'Citizen response' },
  medianResponse: { value: '18m', sub: 'Demo summary' }
};

export const PRIORITY_ATTENTION_ITEMS = [
  {
    id: 'HMR-1042',
    num: 1,
    title: 'HMR-1042 overdue verification',
    desc: 'evidence and contact review required',
    pillText: 'critical',
    pillType: 'critical'
  },
  {
    id: 'HMR-1036',
    num: 2,
    title: 'HMR-1036 escalated',
    desc: 'transport dependency unresolved',
    pillText: 'warning',
    pillType: 'warning'
  },
  {
    id: 'HMR-1047',
    num: 3,
    title: 'Possible duplicate pair',
    desc: 'HMR-1047 / HMR-1039 needs human comparison',
    pillText: 'duplicate',
    pillType: 'purple'
  }
];

export const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Citizen request recorded',
    desc: 'Only relevant roles receive the handoff',
    status: 'completed'
  },
  {
    step: 2,
    title: 'Human case review',
    desc: 'Case Manager action retained in audit history',
    status: 'completed'
  },
  {
    step: 3,
    title: 'Resource / shelter decision',
    desc: 'Only relevant roles receive the handoff',
    status: 'in-progress'
  },
  {
    step: 4,
    title: 'Volunteer or partner handoff',
    desc: 'Only relevant roles receive the handoff',
    status: 'pending'
  },
  {
    step: 5,
    title: 'Citizen status notification',
    desc: 'Only relevant roles receive the handoff',
    status: 'pending'
  }
];

export const INITIAL_CASES_LIST = [
  {
    id: 'HMR-1042',
    category: 'Emergency Shelter',
    operationalArea: 'Kelani East - Zone 03',
    priority: 'Critical',
    priorityType: 'critical',
    verification: 'Awaiting review',
    verificationType: 'pending',
    assignedStaff: 'I. Senanayake',
    status: 'Open',
    statusType: 'open',
    affectedPeople: '6 people',
    currentSafety: 'Temporary roadside location',
    accessibility: 'Older adult with limited mobility',
    submittedAgo: '8 minutes ago',
    citizenQuote: 'Flood water entered our home overnight. We have two children and my mother cannot walk far. We need a safe place before the water rises again.',
    notes: []
  },
  {
    id: 'HMR-1039',
    category: 'Medicine',
    operationalArea: 'Wattala South',
    priority: 'Critical',
    priorityType: 'critical',
    verification: 'Verified',
    verificationType: 'verified',
    assignedStaff: 'R. Perera',
    status: 'Assigned',
    statusType: 'assigned',
    affectedPeople: '2 people',
    currentSafety: 'Sheltered with neighbor',
    accessibility: 'Insulin-dependent diabetic',
    submittedAgo: '24 minutes ago',
    citizenQuote: 'Urgent insulin supply needed within 6 hours. Refrigerated storage submerged.',
    notes: []
  },
  {
    id: 'HMR-1035',
    category: 'Food',
    operationalArea: 'Kaduwela West',
    priority: 'Medium',
    priorityType: 'medium',
    verification: 'Need information',
    verificationType: 'warning',
    assignedStaff: 'I. Senanayake',
    status: 'Pending',
    statusType: 'pending',
    affectedPeople: '4 people',
    currentSafety: 'Upper floor of residence',
    accessibility: 'Infant formula required',
    submittedAgo: '42 minutes ago',
    citizenQuote: 'Drinking water exhausted. Need ration pack and baby formula.',
    notes: []
  },
  {
    id: 'HMR-1036',
    category: 'Transport',
    operationalArea: 'Hanwella Zone 02',
    priority: 'High',
    priorityType: 'high',
    verification: 'Verified',
    verificationType: 'verified',
    assignedStaff: 'S. Silva',
    status: 'Escalated',
    statusType: 'escalated',
    affectedPeople: '9 people',
    currentSafety: 'Cut off by water surge',
    accessibility: 'Wheelchair user in group',
    submittedAgo: '55 minutes ago',
    citizenQuote: 'Boat rescue needed. Ground floor flooded 4 feet deep.',
    notes: []
  }
];

export const RECENT_ACTIVITY_ITEMS = [
  {
    id: 'act-1',
    time: '09:51',
    caseId: 'HMR-1042',
    category: 'Emergency Shelter',
    detail: 'prototype record updated by authorised staff'
  },
  {
    id: 'act-2',
    time: '09:48',
    caseId: 'HMR-1039',
    category: 'Medicine',
    detail: 'prototype record updated by authorised staff'
  },
  {
    id: 'act-3',
    time: '09:21',
    caseId: 'HMR-1035',
    category: 'Food',
    detail: 'prototype record updated by authorised staff'
  }
];

export const TIMELINE_COMMUNICATION_EVENTS = [
  {
    id: 'comm-1',
    time: '10:14',
    title: 'Case Manager reviewed linked record',
    caseTag: 'HMR-1042 - authorised participants only'
  },
  {
    id: 'comm-2',
    time: '10:02',
    title: 'Scoped handoff received',
    caseTag: 'HMR-1042 - authorised participants only'
  },
  {
    id: 'comm-3',
    time: '09:48',
    title: 'Citizen update prepared',
    caseTag: 'HMR-1042 - authorised participants only'
  },
  {
    id: 'comm-4',
    time: '09:18',
    title: 'Simulated recommendation generated',
    caseTag: 'HMR-1042 - authorised participants only'
  }
];

export const AI_REVIEW_FACTORS = [
  {
    id: 'f1',
    title: 'Operational fit',
    desc: 'Attributes match stated need',
    tag: 'High',
    tagType: 'high'
  },
  {
    id: 'f2',
    title: 'Availability',
    desc: 'Demo availability considered',
    tag: 'Medium',
    tagType: 'medium'
  },
  {
    id: 'f3',
    title: 'Human authority',
    desc: 'Final action requires authorised review',
    tag: 'Required',
    tagType: 'required'
  },
  {
    id: 'f4',
    title: 'Data limitation',
    desc: 'Inputs may be incomplete',
    tag: 'Review',
    tagType: 'review'
  }
];

export const REPORT_BARS_DATA = [
  { hour: '1', height: 42, count: 14 },
  { hour: '2', height: 58, count: 21 },
  { hour: '3', height: 38, count: 12 },
  { hour: '4', height: 72, count: 28 },
  { hour: '5', height: 65, count: 25 },
  { hour: '6', height: 86, count: 35 },
  { hour: '7', height: 78, count: 31 },
  { hour: '8', height: 98, count: 42 },
  { hour: '9', height: 68, count: 26 },
  { hour: '10', height: 82, count: 33 },
  { hour: '11', height: 62, count: 24 },
  { hour: '12', height: 54, count: 19 }
];

export const REPORT_BREAKDOWN = [
  { label: 'Unresolved cases', pct: 68 },
  { label: 'Response time', pct: 82 },
  { label: 'Escalations', pct: 31 },
  { label: 'AI overrides', pct: 24 }
];

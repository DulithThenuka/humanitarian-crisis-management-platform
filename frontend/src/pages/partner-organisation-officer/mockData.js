export const initialPartnerOfficer = {
  fullName: 'Ravindu Perera',
  shortName: 'RP',
  role: 'Partner Organisation Officer',
  organisation: 'National Relief Unit'
};

export const initialPartnerMetrics = {
  verificationStatus: { value: 'Verified', sub: 'National Relief Unit' },
  collaborationRequests: { value: '14', sub: '5 awaiting review' },
  resourcesOffered: { value: '2,480', sub: 'Demo units' },
  activeCommitments: { value: '18', sub: '6 due today' },
  pendingApprovals: { value: '5', sub: 'Organisation scope' },
  onTimeDeliveries: { value: '89%', sub: 'Demo summary' }
};

export const initialPriorityAttention = [
  {
    id: 'COM-109',
    title: 'COM-109 delayed',
    desc: 'Responsible organisation asked for ETA',
    tag: 'critical',
    relatedTab: 'profile'
  },
  {
    id: 'REQ-309',
    title: 'REQ-309 needs response',
    desc: 'Operating-area coordination requested',
    tag: 'warning',
    relatedTab: 'requests'
  },
  {
    id: 'COM-102',
    title: 'Receipt confirmation',
    desc: 'COM-102 confirmed by authorised recipient',
    tag: 'success',
    relatedTab: 'contributions'
  }
];

export const initialWorkflowSteps = [
  { step: 1, title: 'Citizen request recorded', sub: 'Only relevant roles receive the handoff', status: 'completed' },
  { step: 2, title: 'Human case review', sub: 'Partner Officer action retained in audit history', status: 'completed' },
  { step: 3, title: 'Resource / shelter decision', sub: 'Only relevant roles receive the handoff', status: 'pending' },
  { step: 4, title: 'Volunteer or partner handoff', sub: 'Only relevant roles receive the handoff', status: 'pending' },
  { step: 5, title: 'Citizen status notification', sub: 'Only relevant roles receive the handoff', status: 'pending' }
];

export const initialRecords = [
  {
    id: 'COM-118',
    sharedIncident: 'CR-2026-014',
    contribution: 'Drinking water',
    quantity: '800 units',
    responsibleOrg: 'National Relief Unit',
    deadline: '18 Feb · 14:00',
    status: 'Dispatched',
    statusBadge: 'dispatched',
    operationalArea: 'Western Province',
    notes: 'Dispatched via convoy Bravo-3. Arrival inspection confirmed.'
  },
  {
    id: 'COM-115',
    sharedIncident: 'CR-2026-014',
    contribution: 'Medical support team',
    quantity: '1 team',
    responsibleOrg: 'MedCare Lanka',
    deadline: '18 Feb · 16:00',
    status: 'Confirmed',
    statusBadge: 'confirmed',
    operationalArea: 'Western Province',
    notes: 'Medical team of 6 clinicians equipped with trauma packs.'
  },
  {
    id: 'REQ-309',
    sharedIncident: 'CR-2026-011',
    contribution: 'Transport vehicles',
    quantity: '4 vehicles',
    responsibleOrg: 'Partner network',
    deadline: '19 Feb · 09:00',
    status: 'Awaiting response',
    statusBadge: 'awaiting',
    operationalArea: 'Southern Province',
    notes: 'Awaiting operating area safety certification before dispatching 4WD trucks.'
  },
  {
    id: 'COM-109',
    sharedIncident: 'CR-2026-014',
    contribution: 'Family food kits',
    quantity: '320 kits',
    responsibleOrg: 'Community Relief Lanka',
    deadline: '18 Feb · 12:00',
    status: 'Delayed',
    statusBadge: 'delayed',
    operationalArea: 'Western Province',
    notes: 'Responsible organisation asked for ETA due to road blockages near Kelani river basin.'
  }
];

export const initialTimeline = [
  {
    id: 'tl-1',
    time: '10:14',
    title: 'Partner Officer reviewed linked record',
    scope: 'HMR-1042 · authorised participants only'
  },
  {
    id: 'tl-2',
    time: '10:02',
    title: 'Scoped handoff received',
    scope: 'HMR-1042 · authorised participants only'
  },
  {
    id: 'tl-3',
    time: '09:48',
    title: 'Citizen update prepared',
    scope: 'HMR-1042 · authorised participants only'
  },
  {
    id: 'tl-4',
    time: '09:30',
    title: 'Simulated recommendation generated',
    scope: 'HMR-1042 · authorised participants only'
  }
];

export const initialActivity = [
  {
    id: 'act-1',
    time: '10:12',
    recordId: 'COM-118 · CR-2026-014',
    text: 'Prototype record updated by authorised staff'
  }
];

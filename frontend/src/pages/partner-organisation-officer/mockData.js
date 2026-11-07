export const initialRecords = [
  {
    id: 'COM-110',
    sharedIncident: 'CR-2026-014',
    contribution: 'Drinking water',
    quantity: '800 units',
    responsibleOrg: 'National Relief Unit',
    deadline: '10 Feb - 14:00',
    status: 'Dispatched',
    type: 'Contribution',
    operationalArea: 'Western Province',
    notes: 'Dispatched via convoy Bravo-3. Driver contact confirmed with relief staging base.',
    category: 'Water & Sanitation',
    priority: 'High'
  },
  {
    id: 'COM-105',
    sharedIncident: 'CR-2026-014',
    contribution: 'Medical support team',
    quantity: '1 team',
    responsibleOrg: 'MediCare Lanka',
    deadline: '10 Feb - 16:30',
    status: 'Confirmed',
    type: 'Contribution',
    operationalArea: 'Western Province',
    notes: 'Medical team of 6 clinicians equipped with trauma packs and pediatric care kits.',
    category: 'Medical',
    priority: 'Critical'
  },
  {
    id: 'REG-309',
    sharedIncident: 'CR-2026-011',
    contribution: 'Transport vehicles',
    quantity: '4 vehicles',
    responsibleOrg: 'Partner network',
    deadline: '10 Feb - 09:00',
    status: 'Awaiting response',
    type: 'Assistance Request',
    operationalArea: 'Southern Province',
    notes: 'Awaiting operating area safety certification before dispatching 4WD trucks.',
    category: 'Logistics',
    priority: 'Medium'
  },
  {
    id: 'COM-109',
    sharedIncident: 'CR-2026-014',
    contribution: 'Family food kits',
    quantity: '320 kits',
    responsibleOrg: 'Community Relief Lanka',
    deadline: '10 Feb - 12:00',
    status: 'Delayed',
    type: 'Contribution',
    operationalArea: 'Western Province',
    notes: 'Responsible organization asked for ETA due to road blockages near Kelani river basin.',
    category: 'Food Rations',
    priority: 'High'
  },
  {
    id: 'COM-112',
    sharedIncident: 'CR-2026-016',
    contribution: 'Temporary Shelter Tents',
    quantity: '150 units',
    responsibleOrg: 'Habitat Aid Global',
    deadline: '11 Feb - 08:30',
    status: 'Confirmed',
    type: 'Contribution',
    operationalArea: 'Central Province',
    notes: 'Waterproof family dome tents with thermal insulating mats.',
    category: 'Shelter',
    priority: 'Medium'
  },
  {
    id: 'REG-314',
    sharedIncident: 'CR-2026-014',
    contribution: 'Baby Formula & Infant Care',
    quantity: '450 packs',
    responsibleOrg: 'Save The Children Partner',
    deadline: '11 Feb - 11:00',
    status: 'Dispatched',
    type: 'Assistance Request',
    operationalArea: 'Western Province',
    notes: 'High-priority delivery directly assigned to St. Mary evacuation facility.',
    category: 'Infant Nutrition',
    priority: 'Critical'
  }
];

export const initialTimeline = [
  {
    id: 'tl-1',
    time: '10:14',
    actor: 'Partner Officer (Ravindu Perera)',
    role: 'Role 1542 - authorized participants only',
    action: 'Partner Officer reviewed latest record',
    details: 'Verified COM-110 manifest and confirmed departure checkpoint coordinates.',
    tag: 'Manifest Verified'
  },
  {
    id: 'tl-2',
    time: '10:00',
    actor: 'ReliefCore Logistics Dispatcher',
    role: 'Role 1542 - authorized participants only',
    action: 'Record handoff received',
    details: 'Logistics team routed crisis incident CR-2026-014 to partner desk.',
    tag: 'Incident Handoff'
  },
  {
    id: 'tl-3',
    time: '09:18',
    actor: 'Autonomous Triage Engine',
    role: 'Role 1542 - authorized participants only',
    action: 'Citizen update prepared',
    details: 'Status notifications queued for 120 displaced families at Sector 4 shelter.',
    tag: 'Citizen Notice'
  },
  {
    id: 'tl-4',
    time: '09:02',
    actor: 'AI Crisis Governance Agent',
    role: 'Role 1542 - authorized participants only',
    action: 'Calculated recommendation generated',
    details: 'Resource prioritization index calculated at 94.2% match confidence.',
    tag: 'AI Recommendation'
  }
];

export const initialActivity = [
  {
    id: 'act-1',
    time: '10:14',
    recordId: 'COM-110',
    incidentId: 'CR-2026-014',
    text: 'Prototype record updated in authorized staff'
  },
  {
    id: 'act-2',
    time: '09:48',
    recordId: 'COM-105',
    incidentId: 'CR-2026-014',
    text: 'Prototype record updated in authorized staff'
  },
  {
    id: 'act-3',
    time: '08:30',
    recordId: 'REG-309',
    incidentId: 'CR-2026-011',
    text: 'Prototype record updated in authorized staff'
  }
];

export const workflowSteps = [
  {
    step: 1,
    title: 'Citizen request recorded',
    description: 'Only relevant roles receive the handoff',
    status: 'completed'
  },
  {
    step: 2,
    title: 'Human case review',
    description: 'Partner Officer action retained in audit history',
    status: 'completed'
  },
  {
    step: 3,
    title: 'Resource / shelter decision',
    description: 'Only relevant roles receive the handoff',
    status: 'pending'
  },
  {
    step: 4,
    title: 'Volunteer or partner handoff',
    description: 'Only relevant roles receive the handoff',
    status: 'pending'
  },
  {
    step: 5,
    title: 'Citizen status notification',
    description: 'Only relevant roles receive the handoff',
    status: 'pending'
  }
];


// Volunteer Coordinator Portal Data Store
// HumanAid Crisis Coordination Platform

export const COORDINATOR_USER = {
  name: 'Kavindi Rodrigo',
  role: 'Volunteer Coordinator',
  roleCode: 'VOLUNTEER_COORDINATOR',
  avatar: 'KR',
  operation: 'Western Province Flood',
  notificationCount: 2,
  dutyStatus: true,
  accessBoundaryNotice: 'Volunteer eligibility, skills and assignments only. Emergency contacts are restricted.'
};

export const INITIAL_METRICS = {
  registeredVolunteers: 386,
  registeredSub: 'Entire directory',
  verificationPending: 24,
  verificationSub: '6 due today',
  availableNow: 128,
  availableSub: 'In service areas',
  activeAssignments: 86,
  activeSub: '12 shifts today',
  unfilledTasks: 14,
  unfilledSub: '3 high priority',
  completedActivities: 742,
  completedSub: 'Across operation'
};

export const PRIORITY_ATTENTION_ITEMS = [
  {
    id: 'TASK-118',
    title: 'TASK-118 unfilled',
    subtitle: 'Needs 4 first-aid volunteers by 18:00',
    badge: 'critical',
    badgeText: 'critical',
    targetTab: 'ai-matching'
  },
  {
    id: 'VOL-0261',
    title: 'VOL-0261 verification pending',
    subtitle: 'Qualification review for rabies intake',
    badge: 'warning',
    badgeText: 'warning',
    targetTab: 'directory'
  },
  {
    id: 'CONFLICT-01',
    title: 'Schedule conflict prevented',
    subtitle: 'Existing shift blocked double assignment',
    badge: 'resolved',
    badgeText: 'resolved',
    targetTab: 'scheduling'
  }
];

export const CONNECTED_ASSISTANCE_WORKFLOW = [
  {
    step: 1,
    title: 'Citizen request recorded',
    description: 'Only relevant roles receive this handoff',
    status: 'completed'
  },
  {
    step: 2,
    title: 'Human case review',
    description: 'Volunteer Coordinator action received on each intake',
    status: 'completed'
  },
  {
    step: 3,
    title: 'Resource / shelter decision',
    description: 'Only relevant roles receive this handoff',
    status: 'current'
  },
  {
    step: 4,
    title: 'Volunteer or partner handoff',
    description: 'Only relevant roles receive this handoff',
    status: 'upcoming'
  },
  {
    step: 5,
    title: 'Citizen status notification',
    description: 'Only relevant roles receive this handoff',
    status: 'upcoming'
  }
];

export const RECENT_COORDINATOR_ACTIVITY = [
  {
    id: 'ACT-01',
    time: '07:15',
    title: 'VOL-0104 - Logistics, First Aid',
    action: 'Prototype record updated by authorised staff'
  },
  {
    id: 'ACT-02',
    time: '06:33',
    title: 'VOL-0212 - Driving, Distribution',
    action: 'Prototype record updated by authorised staff'
  },
  {
    id: 'ACT-03',
    time: '04:21',
    title: 'VOL-0261 - Translation, Childcare',
    action: 'Prototype record updated by authorised staff'
  }
];

export const INITIAL_VOLUNTEERS = [
  {
    id: 'VOL-0104',
    name: 'Nimali Senanayake',
    skills: 'Logistics, First Aid',
    serviceArea: 'Kelani East',
    availability: 'Available',
    currentShift: 'None',
    verification: 'Verified',
    status: 'Eligible',
    statusType: 'eligible',
    phone: '+94 77 112 3344',
    notes: 'Experienced warehouse lead. Qualified first responder SL Red Cross 2025.'
  },
  {
    id: 'VOL-0212',
    name: 'Dinesh Wickramasinghe',
    skills: 'Driving, Distribution',
    serviceArea: 'Niyagama North',
    availability: '08:00-14:00',
    currentShift: 'Supply delivery',
    verification: 'Verified',
    status: 'Assigned',
    statusType: 'assigned',
    phone: '+94 71 445 6677',
    notes: 'Heavy vehicle license holder. Currently operating distribution route 3.'
  },
  {
    id: 'VOL-0261',
    name: 'Fatima Rizwan',
    skills: 'Translation, Childcare',
    serviceArea: 'Wattala South',
    availability: 'Available',
    currentShift: 'None',
    verification: 'Pending',
    status: 'Review',
    statusType: 'review',
    phone: '+94 76 778 9900',
    notes: 'Multilingual intake specialist (Sinhala, Tamil, Arabic). Pending credential review.'
  },
  {
    id: 'VOL-0298',
    name: 'Roshan Fernando',
    skills: 'Medical support',
    serviceArea: 'Kelani East',
    availability: '14:00-20:00',
    currentShift: 'Shelter support',
    verification: 'Verified',
    status: 'Assigned',
    statusType: 'assigned',
    phone: '+94 70 889 0011',
    notes: 'Senior nurse practitioner assigned to shelter infirmary support.'
  },
  {
    id: 'VOL-0315',
    name: 'Anura Jayasinghe',
    skills: 'Logistics, Inventory',
    serviceArea: 'Central Depot',
    availability: 'Available',
    currentShift: 'None',
    verification: 'Verified',
    status: 'Eligible',
    statusType: 'eligible',
    phone: '+94 72 334 5566',
    notes: 'Warehouse sorting specialist ready for immediate dispatch.'
  }
];

export const AI_MATCHING_TASK = {
  taskId: 'TASK-118',
  title: 'Volunteer match',
  refCode: 'DEMO-AI-2021: Human review required',
  suggestedAction: 'Match 4 verified volunteers',
  confidence: 'Simulated confidence 88%, not verified accuracy',
  targetNeed: 'Emergency First Aid & Crowd Relief at Kelani East Point',
  deadline: 'Today by 18:00',
  factors: [
    {
      name: 'Operational fit',
      description: 'Attribute match status: Valid',
      badge: 'High',
      badgeColor: 'blue',
      icon: 'check'
    },
    {
      name: 'Availability',
      description: 'Demo availability considered',
      badge: 'Medium',
      badgeColor: 'blue',
      icon: 'check'
    },
    {
      name: 'Human authority',
      description: 'Coordinator requires authorised review',
      badge: 'Required',
      badgeColor: 'orange',
      icon: 'check'
    },
    {
      name: 'Data limitation',
      description: 'Inputs may be incomplete',
      badge: 'Review',
      badgeColor: 'amber',
      icon: 'alert'
    }
  ],
  possibleDuplicate: {
    ref: 'VOL-0212',
    skills: 'Driving, Distribution',
    note: 'compare separated, never auto-merge'
  }
};

export const COORDINATION_TIMELINE = [
  {
    id: 'TL-01',
    time: '12:15',
    title: 'Volunteer Coordinator reviewed linked record',
    scope: '1.0dB-SL42 - authorised participants only'
  },
  {
    id: 'TL-02',
    time: '12:02',
    title: 'Scoped handoff received',
    scope: '1.0dB-SL42 - authorised participants only'
  },
  {
    id: 'TL-03',
    time: '09:55',
    title: 'Citizen update prepared',
    scope: '1.0dB-SL42 - authorised participants only'
  },
  {
    id: 'TL-04',
    time: '09:20',
    title: 'Simulated recommendation generated',
    scope: '1.0dB-SL42 - authorised participants only'
  }
];

export const WORKFLOW_RECIPIENTS = [
  'Resource & Logistics Manager',
  'Shelter Administrator',
  'Field Safety Lead',
  'Emergency Operations Coordinator',
  'Medical Response Lead'
];

export const OPERATIONAL_AREAS = [
  'All operational areas',
  'Kelani East',
  'Niyagama North',
  'Wattala South',
  'Central Depot',
  'Colombo Central'
];


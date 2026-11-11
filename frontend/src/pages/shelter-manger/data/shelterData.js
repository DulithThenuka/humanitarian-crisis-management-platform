export const SHELTER_ADMIN_USER = {
  name: 'Tharushi De Alwis',
  role: 'Shelter Administrator',
  roleCode: 'SHELTER_ADMIN',
  shortRole: 'Shelter Admin',
  avatar: 'TA',
  operationArea: 'Western Province Flood',
  notificationCount: 3,
  dutyStatus: true,
  accessBoundaryNotice: 'Shelter operations and placements only. Detailed case notes remain hidden.'
};

export const INITIAL_METRICS = {
  registeredShelters: 16,
  operationalShelters: 11,
  currentOccupancy: 1284,
  acrossSites: 14,
  remainingCapacity: 236,
  nearCapacityCount: 4,
  supplyShortages: 7,
  criticalShortages: 3,
  admissionsToday: 48,
  transfersToday: 12
};

export const PRIORITY_ATTENTION_ITEMS = [
  {
    id: 1,
    title: 'SH-014 allocation blocked',
    subtitle: 'No spaces matching accessibility criteria',
    badge: 'critical',
    badgeText: 'critical',
    targetShelterId: 'SH-014',
    category: 'Placement'
  },
  {
    id: 2,
    title: 'SH-003 nearing capacity',
    subtitle: '6 verified spaces remain',
    badge: 'warning',
    badgeText: 'warning',
    targetShelterId: 'SH-003',
    category: 'Capacity'
  },
  {
    id: 3,
    title: 'Bedding request SRR-208',
    subtitle: 'Logistics Manager notified in prototype',
    badge: 'info',
    badgeText: 'info',
    targetShelterId: 'SH-008',
    category: 'Supply'
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
    title: 'Human/Case review',
    description: 'Shelter Admin action creates an audit history',
    status: 'completed'
  },
  {
    step: 3,
    title: 'Resource / shelter decision',
    description: 'Only relevant roles receive this handoff',
    status: 'active'
  },
  {
    step: 4,
    title: 'Volunteer or partner handoff',
    description: 'Only relevant roles receive this handoff',
    status: 'pending'
  },
  {
    step: 5,
    title: 'Citizen status notification',
    description: 'Only relevant roles receive this handoff',
    status: 'pending'
  }
];

export const INITIAL_RECENT_ACTIVITY = [
  {
    id: 'ACT-101',
    time: '10:22',
    title: 'SH-008 - Kelani Community Centre - Kelani East',
    action: 'Prototype record updated by authorised staff',
    shelterId: 'SH-008'
  },
  {
    id: 'ACT-102',
    time: '09:18',
    title: 'SH-003 - Biyagama School Hall - Biyagama North',
    action: 'Prototype record updated by authorised staff',
    shelterId: 'SH-003'
  },
  {
    id: 'ACT-103',
    time: '08:41',
    title: 'SH-011 - Wattala Civic Centre - Wattala South',
    action: 'Prototype record updated by authorised staff',
    shelterId: 'SH-011'
  }
];

export const INITIAL_SHELTERS_DATA = [
  {
    id: 'SH-008',
    name: 'SH-008 - Kelani Community Centre',
    facilityName: 'Kelani Community Centre',
    area: 'Kelani East',
    capacity: 200,
    occupied: 164,
    available: 36,
    accessibility: 'Step-free access',
    status: 'Operational',
    statusType: 'success',
    guardActive: true,
    managerContact: 'Mrs. H. Ranasinghe (+94 77 123 4567)',
    notes: 'Central reception point. Medical triage wing setup. Step-free ramp and wide corridor entrance.'
  },
  {
    id: 'SH-003',
    name: 'SH-003 - Biyagama School Hall',
    facilityName: 'Biyagama School Hall',
    area: 'Biyagama North',
    capacity: 220,
    occupied: 214,
    available: 6,
    accessibility: 'Accessible toilets',
    status: 'Near capacity',
    statusType: 'warning',
    guardActive: true,
    managerContact: 'Mr. P. Wickramasinghe (+94 71 890 1234)',
    notes: '6 verified spaces remain. Capacity guard active to prevent accidental overbooking.'
  },
  {
    id: 'SH-011',
    name: 'SH-011 - Wattala Civic Centre',
    facilityName: 'Wattala Civic Centre',
    area: 'Wattala South',
    capacity: 190,
    occupied: 112,
    available: 78,
    accessibility: 'Family areas',
    status: 'Operational',
    statusType: 'success',
    guardActive: false,
    managerContact: 'Ms. S. Fernando (+94 76 345 6789)',
    notes: 'Dedicated nursery partitions, 24/7 volunteer attendance, hot meals active.'
  },
  {
    id: 'SH-014',
    name: 'SH-014 - Hanwella Relief Hall',
    facilityName: 'Hanwella Relief Hall',
    area: 'Hanwella',
    capacity: 120,
    occupied: 120,
    available: 0,
    accessibility: 'Medical support',
    status: 'Full',
    statusType: 'critical',
    guardActive: true,
    managerContact: 'Dr. C. Jayawardena (+94 70 234 5678)',
    notes: 'All 120 beds allocated. Inbound evacuation buses diverted to Wattala Civic Centre.'
  },
  {
    id: 'SH-019',
    name: 'SH-019 - Kaduwela Youth Club',
    facilityName: 'Kaduwela Youth Club',
    area: 'Kaduwela',
    capacity: 160,
    occupied: 95,
    available: 65,
    accessibility: 'Step-free access',
    status: 'Operational',
    statusType: 'success',
    guardActive: false,
    managerContact: 'Mr. T. Rajapaksha (+94 72 456 7890)',
    notes: 'Equipped with ground-floor step-free dormitories and generator backup power.'
  },
  {
    id: 'SH-002',
    name: 'SH-002 - Malwana Central Complex',
    facilityName: 'Malwana Central Complex',
    area: 'Malwana',
    capacity: 250,
    occupied: 242,
    available: 8,
    accessibility: 'Wheelchair ramp',
    status: 'Near capacity',
    statusType: 'warning',
    guardActive: true,
    managerContact: 'Mrs. K. Alwis (+94 77 987 6543)',
    notes: 'Buffer beds strictly reserved for elderly evacuees and wheelchair users.'
  },
  {
    id: 'SH-007',
    name: 'SH-007 - Kolonnawa Buddhist Hall',
    facilityName: 'Kolonnawa Buddhist Hall',
    area: 'Kolonnawa',
    capacity: 140,
    occupied: 132,
    available: 8,
    accessibility: 'Family areas',
    status: 'Near capacity',
    statusType: 'warning',
    guardActive: true,
    managerContact: 'Ven. Dhammarathana (+94 11 254 3210)',
    notes: 'Community kitchen running. Additional drinking water tanks requested.'
  }
];

export const PLACEMENT_ALLOCATIONS_DATA = [
  {
    id: 'PLC-501',
    evacueeName: 'Perera Family (4 members)',
    headOfFamily: 'Nimal Perera',
    partySize: 4,
    assignedShelter: 'SH-008 - Kelani Community Centre',
    shelterId: 'SH-008',
    accessibilityNeeded: 'Step-free access (Elderly parent)',
    specialNotes: 'Diabetic medication refrigeration required',
    status: 'Confirmed',
    statusType: 'success',
    allocatedAt: '10:14 AM'
  },
  {
    id: 'PLC-502',
    evacueeName: 'Silva Household (3 members)',
    headOfFamily: 'Kamani Silva',
    partySize: 3,
    assignedShelter: 'SH-011 - Wattala Civic Centre',
    shelterId: 'SH-011',
    accessibilityNeeded: 'Family areas (Infant 4 months)',
    specialNotes: 'Formula and baby cot provided in family wing',
    status: 'Confirmed',
    statusType: 'success',
    allocatedAt: '09:45 AM'
  },
  {
    id: 'PLC-503',
    evacueeName: 'Gunasekara Family (5 members)',
    headOfFamily: 'Anura Gunasekara',
    partySize: 5,
    assignedShelter: 'SH-014 - Hanwella Relief Hall',
    shelterId: 'SH-014',
    accessibilityNeeded: 'Medical support (Wheelchair user)',
    specialNotes: 'Allocation blocked due to Hanwella 100% capacity threshold',
    status: 'Pending Reallocation',
    statusType: 'critical',
    allocatedAt: '08:30 AM'
  },
  {
    id: 'PLC-504',
    evacueeName: 'Jayatissa Family (2 members)',
    headOfFamily: 'Dharmadasa Jayatissa',
    partySize: 2,
    assignedShelter: 'SH-003 - Biyagama School Hall',
    shelterId: 'SH-003',
    accessibilityNeeded: 'Accessible toilets',
    specialNotes: 'Awaiting secondary triage confirmation',
    status: 'In Review',
    statusType: 'warning',
    allocatedAt: '08:15 AM'
  }
];

export const RESOURCE_REQUESTS_DATA = [
  {
    id: 'SRR-208',
    shelterId: 'SH-008',
    shelterName: 'Kelani Community Centre',
    itemCategory: 'Bedding & Linens',
    requestedQuantity: '60 sleeping mats & blankets',
    urgency: 'High',
    urgencyType: 'warning',
    status: 'Dispatched',
    statusType: 'info',
    requestedBy: 'Shelter Lead - H. Ranasinghe',
    eta: 'Today, 12:30 PM'
  },
  {
    id: 'SRR-209',
    shelterId: 'SH-003',
    shelterName: 'Biyagama School Hall',
    itemCategory: 'Sanitation Kits',
    requestedQuantity: '120 Hygiene & Sanitation Packs',
    urgency: 'Critical',
    urgencyType: 'critical',
    status: 'Approved',
    statusType: 'warning',
    requestedBy: 'P. Wickramasinghe',
    eta: 'Today, 2:00 PM'
  },
  {
    id: 'SRR-210',
    shelterId: 'SH-011',
    shelterName: 'Wattala Civic Centre',
    itemCategory: 'Baby Care & Nutrition',
    requestedQuantity: '40 Infant Formula & Diaper boxes',
    urgency: 'Medium',
    urgencyType: 'info',
    status: 'In Review',
    statusType: 'info',
    requestedBy: 'S. Fernando',
    eta: 'Tomorrow, 09:00 AM'
  },
  {
    id: 'SRR-211',
    shelterId: 'SH-014',
    shelterName: 'Hanwella Relief Hall',
    itemCategory: 'First Aid & Chronic Meds',
    requestedQuantity: '5 Emergency Medical Resupply Kits',
    urgency: 'Critical',
    urgencyType: 'critical',
    status: 'Pending Dispatch',
    statusType: 'critical',
    requestedBy: 'Dr. C. Jayawardena',
    eta: 'Pending Courier Allocation'
  }
];

export const SHELTER_REPORTS_DATA = {
  dailySummary: {
    totalAdmissions: 148,
    discharges: 24,
    occupancyRateAverage: '84.5%',
    safetyCompliantShelters: 15,
    pendingSafetyInspections: 1
  },
  areaOccupancies: [
    { area: 'Kelani East', rate: 82, totalCap: 200, occupied: 164 },
    { area: 'Biyagama North', rate: 97, totalCap: 220, occupied: 214 },
    { area: 'Wattala South', rate: 59, totalCap: 190, occupied: 112 },
    { area: 'Hanwella', rate: 100, totalCap: 120, occupied: 120 },
    { area: 'Kaduwela', rate: 59, totalCap: 160, occupied: 95 },
    { area: 'Malwana', rate: 96, totalCap: 250, occupied: 242 },
    { area: 'Kolonnawa', rate: 94, totalCap: 140, occupied: 132 }
  ]
};


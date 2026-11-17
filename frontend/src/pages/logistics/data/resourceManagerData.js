export const INITIAL_RESOURCE_OFFICER = {
  fullName: 'Dilan Perera',
  shortName: 'DP',
  role: 'Relief / Resource Manager',
  department: 'National Relief Unit',
  email: 'dilan.perera@example.test',
  defaultStorage: 'Central Depot',
  thresholdType: 'Use item thresholds',
  reminderFrequency: 'Every 15 minutes for critical requests',
  density: 'Compact'
};

export const OVERVIEW_METRICS = {
  totalResources: { value: '2,048', sub: 'Across 6 categories' },
  availableStock: { value: '1,284', sub: '62.7% of total' },
  lowStockWarnings: { value: '5', sub: '2 critical shortages' },
  pendingAllocations: { value: '12', sub: '4 high priority' },
  approvedAllocations: { value: '18', sub: '342 units' },
  dispatchedDelivered: { value: '228 / 146', sub: 'Separate stages' }
};

export const INVENTORY_ITEMS = [
  {
    id: 'RES-021',
    name: 'Drinking Water',
    category: 'Water',
    quantity: 240,
    unit: 'units',
    storageLocation: 'Central Depot',
    stockStatus: 'Shortage',
    statusBadge: 'shortage',
    lastUpdated: '2 min ago'
  },
  {
    id: 'RES-034',
    name: 'Emergency Food Kits',
    category: 'Food',
    quantity: 320,
    unit: 'kits',
    storageLocation: 'Central Depot',
    stockStatus: 'Available',
    statusBadge: 'available',
    lastUpdated: '8 min ago'
  },
  {
    id: 'RES-045',
    name: 'Medical Supply Packs',
    category: 'Medicine',
    quantity: 110,
    unit: 'packs',
    storageLocation: 'Wattala Store',
    stockStatus: 'Available',
    statusBadge: 'available',
    lastUpdated: '14 min ago'
  },
  {
    id: 'RES-052',
    name: 'Thermal Blankets',
    category: 'Shelter',
    quantity: 86,
    unit: 'items',
    storageLocation: 'Biyagama Depot',
    stockStatus: 'Low stock',
    statusBadge: 'low-stock',
    lastUpdated: '20 min ago'
  },
  {
    id: 'RES-063',
    name: 'Family Emergency Kits',
    category: 'Emergency Kits',
    quantity: 52,
    unit: 'kits',
    storageLocation: 'Central Depot',
    stockStatus: 'Low stock',
    statusBadge: 'low-stock',
    lastUpdated: '26 min ago'
  },
  {
    id: 'RES-074',
    name: 'Water Purification Tablets',
    category: 'Water',
    quantity: 1240,
    unit: 'tablets',
    storageLocation: 'Medical Store',
    stockStatus: 'Available',
    statusBadge: 'available',
    lastUpdated: '32 min ago'
  }
];

export const ALLOCATION_REQUESTS = [
  {
    id: 'RAR-204',
    item: 'Drinking Water',
    cluster: 'CR-2026-014 · Kelani East',
    requestedQty: 140,
    availableQty: 240,
    remainingStock: 100,
    destination: 'Kelani East',
    relatedRecord: 'CR-2026-014',
    coordinator: 'Maya Fernando',
    priority: 'Critical priority',
    priorityTag: 'critical'
  },
  {
    id: 'RAR-201',
    item: 'Emergency Food Kits',
    cluster: 'HMR-1042 Cluster · Zone 02',
    requestedQty: 80,
    availableQty: 320,
    remainingStock: 240,
    destination: 'Zone 02 Staging Depot',
    relatedRecord: 'CR-2026-014',
    coordinator: 'Amara Chen',
    priority: 'High',
    priorityTag: 'warning'
  },
  {
    id: 'RAR-198',
    item: 'Thermal Blankets',
    cluster: 'SH-006 · Kelani East',
    requestedQty: 60,
    availableQty: 86,
    remainingStock: 26,
    destination: 'Kelani East Community Shelter',
    relatedRecord: 'CR-2026-011',
    coordinator: 'Ruwan Silva',
    priority: 'High',
    priorityTag: 'warning'
  }
];

export const DISTRIBUTION_DISPATCHES = [
  {
    id: 'DSP-041',
    title: 'Drinking Water · 80 units',
    destination: 'Kelani East',
    team: 'Rapid Logistics Team',
    status: 'Dispatched',
    statusBadge: 'dispatched',
    dispatchDate: '18 Feb · 09:40',
    expectedDelivery: '18 Feb · 11:30',
    relatedAllocation: 'RAR-199',
    deliveryConfirmation: 'Not yet received',
    currentStep: 4,
    history: [
      { time: '10:02', title: 'Vehicle departed Central Depot', sub: 'Recorded by authorised team' },
      { time: '09:48', title: 'Loading checklist completed', sub: 'Recorded by authorised team' },
      { time: '09:40', title: 'Dispatch prepared by Logistics Team', sub: 'Recorded by authorised team' }
    ]
  },
  {
    id: 'DSP-039',
    title: 'Medical Packs · 40',
    destination: 'Wattala South',
    team: 'Medical Supply Team',
    status: 'Prepared',
    statusBadge: 'prepared',
    dispatchDate: '18 Feb · 08:30',
    expectedDelivery: '18 Feb · 10:15',
    relatedAllocation: 'RAR-195',
    deliveryConfirmation: 'Awaiting departure',
    currentStep: 3,
    history: [
      { time: '09:15', title: 'Pack verification signed off', sub: 'Recorded by Pharmacy Officer' },
      { time: '08:30', title: 'Staging allocated in Bay 2', sub: 'Recorded by Depot Staff' }
    ]
  },
  {
    id: 'DSP-038',
    title: 'Thermal Blankets · 60',
    destination: 'SH-008',
    team: 'Shelter Supply Team',
    status: 'Delivered',
    statusBadge: 'delivered',
    dispatchDate: '17 Feb · 16:00',
    expectedDelivery: '17 Feb · 17:45',
    relatedAllocation: 'RAR-190',
    deliveryConfirmation: 'Confirmed by Shelter Lead',
    currentStep: 5,
    history: [
      { time: '17:50', title: 'Intake signed by Shelter Coordinator', sub: 'Recorded by Field Lead' },
      { time: '16:00', title: 'Dispatched from Central Depot', sub: 'Recorded by Logistics Team' }
    ]
  }
];

export const SUPPLIERS_LIST = [
  {
    id: 'SUP-014',
    name: 'Aqua Relief Supplies',
    categories: 'Water, emergency kits',
    contactRef: 'Approved contact',
    status: 'Verified',
    statusBadge: 'verified',
    lastDelivery: '18 Feb 2026'
  },
  {
    id: 'SUP-009',
    name: 'HealthLine Distributors',
    categories: 'Medicine, hygiene',
    contactRef: 'Approved contact',
    status: 'Verified',
    statusBadge: 'verified',
    lastDelivery: '17 Feb 2026'
  },
  {
    id: 'SUP-021',
    name: 'Community Textile Works',
    categories: 'Blankets, shelter',
    contactRef: 'Pending verification',
    status: 'Review',
    statusBadge: 'review',
    lastDelivery: '12 Feb 2026'
  }
];

export const STOCK_ALERTS = [
  {
    id: 'ALT-01',
    item: 'Drinking Water',
    code: 'RES-021',
    available: 240,
    requested: 380,
    tag: 'Critical shortage',
    tagType: 'critical',
    recommendedAction: 'Replenish 200 units',
    iconType: 'droplet'
  },
  {
    id: 'ALT-02',
    item: 'Thermal Blankets',
    code: 'RES-052',
    available: 86,
    threshold: 100,
    tag: 'Low stock',
    tagType: 'warning',
    recommendedAction: 'Reorder 80 items',
    iconType: 'warning'
  },
  {
    id: 'ALT-03',
    item: 'Medical Supply Packs',
    code: 'RES-045',
    expiringQty: 14,
    daysLeft: 21,
    tag: 'Expiry approaching',
    tagType: 'warning',
    recommendedAction: 'Prioritise suitable allocation',
    iconType: 'warning'
  },
  {
    id: 'ALT-04',
    item: 'Family Emergency Kits',
    code: 'RES-063',
    available: 52,
    threshold: 60,
    tag: 'Low stock',
    tagType: 'warning',
    recommendedAction: 'Reorder 40 kits',
    iconType: 'warning'
  }
];

export const ACTIVITY_HISTORY = [
  {
    reference: 'ACT-9921',
    action: 'Inventory quantity adjusted',
    relatedRecord: 'RES-034',
    userTeam: 'Dilan Perera',
    result: '+40 food kits',
    timestamp: '10:12'
  },
  {
    reference: 'ACT-9918',
    action: 'Allocation approved',
    relatedRecord: 'RAR-199',
    userTeam: 'Dilan Perera',
    result: '80 water units',
    timestamp: '09:56'
  },
  {
    reference: 'ACT-9914',
    action: 'Dispatch status updated',
    relatedRecord: 'DSP-041',
    userTeam: 'Logistics Team',
    result: 'Dispatched',
    timestamp: '09:28'
  },
  {
    reference: 'ACT-9908',
    action: 'Delivery confirmed',
    relatedRecord: 'DSP-038',
    userTeam: 'Shelter Supply Team',
    result: 'Delivered',
    timestamp: '08:44'
  }
];

export const RESOURCE_NOTIFICATIONS = [
  {
    reference: 'NTF-401',
    action: 'Critical water shortage requires action',
    relatedRecord: 'RES-021',
    received: '2 min ago',
    result: 'Critical',
    resultBadge: 'critical'
  },
  {
    reference: 'NTF-398',
    action: 'New allocation request from coordinator',
    relatedRecord: 'RAR-204',
    received: '8 min ago',
    result: 'Review',
    resultBadge: 'review'
  },
  {
    reference: 'NTF-392',
    action: 'Medical packs approaching expiry',
    relatedRecord: 'RES-045',
    received: '22 min ago',
    result: 'Warning',
    resultBadge: 'warning'
  },
  {
    reference: 'NTF-388',
    action: 'Delivery confirmation received',
    relatedRecord: 'DSP-038',
    received: '1 hour ago',
    result: 'Completed',
    resultBadge: 'completed'
  }
];

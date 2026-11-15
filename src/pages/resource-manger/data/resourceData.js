export const RESOURCE_MANAGER_USER = {
  name: 'Dilan Perera',
  role: 'Relief / Resource Manager',
  shortRole: 'Resource Manager',
  avatar: 'DP',
  operationArea: 'Western Province Flood',
  notificationCount: 3,
  dutyStatus: true,
  accessBoundaryNotice: 'Resource operations access: Inventory and allocation workflows only. System administration is restricted.'
};

export const INITIAL_RESOURCE_METRICS = {
  totalResources: 2048,
  totalCategories: 9,
  availableStock: 1284,
  availablePercentage: '62.7%',
  lowStockWarnings: 5,
  criticalShortages: 3,
  pendingAllocations: 12,
  highPriorityPending: 4,
  approvedAllocations: 18,
  approvedUnits: 542,
  dispatchedCount: 228,
  deliveredCount: 146
};

export const INVENTORY_DISTRIBUTION = [
  { category: 'Drinking Water', count: 280, max: 400, percent: 70 },
  { category: 'Food Kits', count: 320, max: 500, percent: 64 },
  { category: 'Medical Supplies', count: 110, max: 200, percent: 55 },
  { category: 'Thermal Blankets', count: 85, max: 250, percent: 34 },
  { category: 'Emergency Kits', count: 52, max: 150, percent: 35 },
  { category: 'Water Purification', count: 310, max: 400, percent: 77 },
  { category: 'Hygiene Packs', count: 160, max: 250, percent: 64 },
  { category: 'Baby Nutrition', count: 140, max: 200, percent: 70 },
  { category: 'Shelter Tools', count: 95, max: 150, percent: 63 }
];

export const STOCK_HEALTH_ALERTS = [
  {
    id: 'ALT-1',
    item: 'Drinking Water',
    detail: '340 available / 500 requested',
    badge: 'Critical',
    badgeType: 'critical',
    type: 'water'
  },
  {
    id: 'ALT-2',
    item: 'Thermal Blankets',
    detail: '85 items - reorder at 120',
    badge: 'Low stock',
    badgeType: 'warning',
    type: 'blanket'
  },
  {
    id: 'ALT-3',
    item: 'Medical Supply Packs',
    detail: '14 expire within 30 days',
    badge: 'Expiry',
    badgeType: 'warning',
    type: 'medical'
  }
];

export const INVENTORY_ITEMS_DATA = [
  {
    id: 'RES-021',
    name: 'Drinking Water',
    category: 'Water',
    quantity: 280,
    unit: 'units',
    storageLocation: 'Central Depot',
    stockStatus: 'Shortage',
    statusType: 'critical',
    lastUpdated: '2 min ago',
    reorderLevel: 500
  },
  {
    id: 'RES-034',
    name: 'Emergency Food Kits',
    category: 'Food',
    quantity: 320,
    unit: 'kits',
    storageLocation: 'Central Depot',
    stockStatus: 'Available',
    statusType: 'success',
    lastUpdated: '6 min ago',
    reorderLevel: 150
  },
  {
    id: 'RES-045',
    name: 'Medical Supply Packs',
    category: 'Medicine',
    quantity: 110,
    unit: 'packs',
    storageLocation: 'Wattala Store',
    stockStatus: 'Available',
    statusType: 'success',
    lastUpdated: '14 min ago',
    reorderLevel: 80
  },
  {
    id: 'RES-052',
    name: 'Thermal Blankets',
    category: 'Shelter',
    quantity: 85,
    unit: 'items',
    storageLocation: 'Biyagama Depot',
    stockStatus: 'Low stock',
    statusType: 'warning',
    lastUpdated: '20 min ago',
    reorderLevel: 120
  },
  {
    id: 'RES-063',
    name: 'Family Emergency Kits',
    category: 'Emergency Kits',
    quantity: 52,
    unit: 'kits',
    storageLocation: 'Central Depot',
    stockStatus: 'Low stock',
    statusType: 'warning',
    lastUpdated: '26 min ago',
    reorderLevel: 100
  },
  {
    id: 'RES-074',
    name: 'Water Purification Tablets',
    category: 'Water',
    quantity: 1240,
    unit: 'tablets',
    storageLocation: 'Medical Store',
    stockStatus: 'Available',
    statusType: 'success',
    lastUpdated: '32 min ago',
    reorderLevel: 500
  },
  {
    id: 'RES-088',
    name: 'Infant Formula & Feeding Kits',
    category: 'Nutrition',
    quantity: 140,
    unit: 'boxes',
    storageLocation: 'Central Depot',
    stockStatus: 'Available',
    statusType: 'success',
    lastUpdated: '40 min ago',
    reorderLevel: 60
  },
  {
    id: 'RES-092',
    name: 'Hygiene & Sanitation Packs',
    category: 'Hygiene',
    quantity: 160,
    unit: 'packs',
    storageLocation: 'Wattala Store',
    stockStatus: 'Available',
    statusType: 'success',
    lastUpdated: '50 min ago',
    reorderLevel: 100
  }
];

export const ALLOCATION_REQUESTS_DATA = [
  {
    id: 'RAR-204',
    title: 'Drinking Water allocation',
    itemName: 'Drinking Water',
    category: 'Water',
    relatedIncident: 'CR-2026-014',
    destination: 'Kelani East',
    requestedQuantity: 140,
    availableQuantity: 240,
    stockAfterAllocation: 100,
    requestedBy: 'Emergency Coordinator Maya Fernando',
    priority: 'Critical',
    priorityType: 'critical',
    time: '12 min ago',
    status: 'Pending Review',
    notes: 'Urgent for Kelani Community Hall evacuation wing.'
  },
  {
    id: 'RAR-205',
    title: 'Emergency Food Kits allocation',
    itemName: 'Emergency Food Kits',
    category: 'Food',
    relatedIncident: 'HMR-1042',
    destination: 'HMR-1042 Shelter • Zone 02',
    requestedQuantity: 80,
    availableQuantity: 320,
    stockAfterAllocation: 240,
    requestedBy: 'Coordinator Sarah Johnson',
    priority: 'High',
    priorityType: 'warning',
    time: '28 min ago',
    status: 'Pending Review',
    notes: 'Evening ration supply for newly arrived families.'
  },
  {
    id: 'RAR-206',
    title: 'Thermal Blankets allocation',
    itemName: 'Thermal Blankets',
    category: 'Shelter',
    relatedIncident: 'SH-008',
    destination: 'SH-008 • Relief Hall',
    requestedQuantity: 60,
    availableQuantity: 85,
    stockAfterAllocation: 25,
    requestedBy: 'Shelter Admin Tharushi De Alwis',
    priority: 'High',
    priorityType: 'warning',
    time: '45 min ago',
    status: 'Pending Review',
    notes: 'Elderly shelter wing bedding resupply.'
  },
  {
    id: 'RAR-207',
    title: 'Medical Supply Packs allocation',
    itemName: 'Medical Supply Packs',
    category: 'Medicine',
    relatedIncident: 'CR-2026-016',
    destination: 'Wattala South Primary Clinic',
    requestedQuantity: 30,
    availableQuantity: 110,
    stockAfterAllocation: 80,
    requestedBy: 'Dr. C. Jayawardena',
    priority: 'Medium',
    priorityType: 'info',
    time: '1 hour ago',
    status: 'Pending Review',
    notes: 'First aid replenishment for waterborne injuries.'
  }
];

export const DISTRIBUTION_TRACKING_DATA = [
  {
    id: 'DSP-041',
    itemTitle: 'Drinking Water • 80 units',
    itemName: 'Drinking Water',
    quantity: 80,
    destination: 'Kelani East',
    team: 'Rapid Logistics Team',
    status: 'Dispatched',
    statusType: 'info',
    currentStep: 4, // 1: Requested, 2: Approved, 3: Prepared, 4: Dispatched, 5: Delivered
    dispatchDate: '18 Feb • 08:45',
    expectedDelivery: '18 Feb • 11:30',
    relatedAllocation: 'RAR-198',
    deliveryConfirmation: 'Not yet received',
    history: [
      { time: '10:12', event: 'Vehicle departed Central Depot', detail: 'Recorded by authorized team' },
      { time: '09:40', event: 'Loading checklist completed', detail: 'Recorded by authorized team' },
      { time: '09:10', event: 'Dispatch prepared by Logistics Team', detail: 'Recorded by authorized team' }
    ]
  },
  {
    id: 'DSP-039',
    itemTitle: 'Medical Packs • 40',
    itemName: 'Medical Supply Packs',
    quantity: 40,
    destination: 'Wattala South',
    team: 'Medical Supply Team',
    status: 'Prepared',
    statusType: 'warning',
    currentStep: 3,
    dispatchDate: '18 Feb • 09:15',
    expectedDelivery: '18 Feb • 13:00',
    relatedAllocation: 'RAR-201',
    deliveryConfirmation: 'Driver assigned, loading underway',
    history: [
      { time: '09:15', event: 'Staging in dispatch bay 2', detail: 'Verified by Warehouse Lead' },
      { time: '08:50', event: 'Stock picked from Wattala Store', detail: 'Quantity verified: 40' }
    ]
  },
  {
    id: 'DSP-038',
    itemTitle: 'Thermal Blankets • 60',
    itemName: 'Thermal Blankets',
    quantity: 60,
    destination: 'SH-008',
    team: 'Shelter Supply Team',
    status: 'Delivered',
    statusType: 'success',
    currentStep: 5,
    dispatchDate: '17 Feb • 16:30',
    expectedDelivery: '17 Feb • 19:00',
    relatedAllocation: 'RAR-189',
    deliveryConfirmation: 'Received & signed by H. Ranasinghe',
    history: [
      { time: '18:55', event: 'Delivery confirmed and signed', detail: 'Acknowledged at SH-008' },
      { time: '17:40', event: 'Vehicle arrived at destination', detail: 'Unloading completed' },
      { time: '16:30', event: 'Departed Central Depot', detail: 'Convoy Alpha' }
    ]
  }
];

export const SUPPLIERS_DATA = [
  {
    id: 'SUP-014',
    name: 'Aqua Relief Supplies',
    categories: 'Water, emergency kits',
    contactReference: 'Approved contact (+94 11 234 5678)',
    status: 'Verified',
    statusType: 'success',
    lastDelivery: '18 Feb 2026'
  },
  {
    id: 'SUP-009',
    name: 'HealthLine Distributors',
    categories: 'Medicine, hygiene',
    contactReference: 'Approved contact (+94 11 876 5432)',
    status: 'Verified',
    statusType: 'success',
    lastDelivery: '17 Feb 2026'
  },
  {
    id: 'SUP-021',
    name: 'Community Textile Works',
    categories: 'Blankets, shelter',
    contactReference: 'Pending verification',
    status: 'Review',
    statusType: 'warning',
    lastDelivery: '12 Feb 2026'
  },
  {
    id: 'SUP-033',
    name: 'Ceylon Logistics & Rations',
    categories: 'Packaged food, pulses',
    contactReference: 'Approved contact (+94 77 555 4321)',
    status: 'Verified',
    statusType: 'success',
    lastDelivery: '16 Feb 2026'
  }
];

export const RECENT_RESOURCE_ACTIVITY = [
  {
    id: 'ACT-R1',
    time: '10:12',
    title: 'Stock adjusted',
    desc: 'RES-021 +50 units from reserve'
  },
  {
    id: 'ACT-R2',
    time: '09:50',
    title: 'Allocation approved',
    desc: 'REQ-789 80 water units'
  },
  {
    id: 'ACT-R3',
    time: '09:20',
    title: 'Dispatch prepared',
    desc: 'DSP-041 Medical packs'
  },
  {
    id: 'ACT-R4',
    time: '08:44',
    title: 'Delivery confirmed',
    desc: 'DSP-038 60 blankets'
  }
];


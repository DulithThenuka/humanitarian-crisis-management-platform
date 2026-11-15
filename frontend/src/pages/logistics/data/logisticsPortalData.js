export const LOGISTICS_STATS = {
  totalWarehouses: 5,
  criticalStockItems: 3,
  pendingRequisitions: 14,
  pendingDispatches: 8,
  activeDeliveries: 15,
  fleetUtilization: '84%',
  totalItemsTracked: 42350,
  dockIntakeTodayKg: '14,800 kg',
  totalStorageCapacitySqFt: '240,000 sq ft',
  averageOccupancyRate: '78%'
};

export const QUICK_METRICS = [
  { label: 'Available Rations', value: '18,400 packs', status: 'optimal' },
  { label: 'Clean Water Reserve', value: '45,000 L', status: 'optimal' },
  { label: 'Medical First Aid Kits', value: '310 units', status: 'warning' },
  { label: 'Emergency Tarpaulins', value: '1,250 units', status: 'optimal' },
  { label: 'Infant Nutrition Kits', value: '42 units', status: 'critical' }
];

export const INITIAL_REQUISITIONS = [
  {
    id: 'REQ-SUP-2026-081',
    shelterName: 'Kelani Central Relief Center',
    shelterId: 'SH-001',
    district: 'Colombo',
    zone: 'Kelani East - Sector 03',
    requester: 'Rev. Sarath Dhammaratana (Shelter Head)',
    phone: '+94 77 234 5678',
    urgency: 'Critical',
    urgencyClass: 'badge-critical',
    status: 'Pending Review',
    statusClass: 'status-pending',
    requestedAt: '12 mins ago',
    items: [
      { name: 'Family Food Ration Packs', qty: 250, unit: 'packs', allocatedFrom: null },
      { name: 'Potable Drinking Water (1L)', qty: 1500, unit: 'bottles', allocatedFrom: null },
      { name: 'Infant Milk Formula (400g)', qty: 45, unit: 'tins', allocatedFrom: null }
    ],
    notes: 'Severe flood surge cut off local shops. 340 displaced people arrived since morning, 28 infants require immediate feeding.'
  },
  {
    id: 'REQ-SUP-2026-082',
    shelterName: "St. Anthony's College Emergency Camp",
    shelterId: 'SH-002',
    district: 'Gampaha',
    zone: 'Ja-Ela Basin',
    requester: 'Dr. Harshani Alwis (Medical Officer)',
    phone: '+94 71 890 1234',
    urgency: 'High',
    urgencyClass: 'badge-high',
    status: 'Pending Review',
    statusClass: 'status-pending',
    requestedAt: '28 mins ago',
    items: [
      { name: 'Emergency Trauma & First Aid Kits', qty: 50, unit: 'kits', allocatedFrom: null },
      { name: 'Antiseptic Solution (500ml)', qty: 100, unit: 'bottles', allocatedFrom: null },
      { name: 'Clean Blankets & Sleeping Mats', qty: 300, unit: 'units', allocatedFrom: null }
    ],
    notes: 'Multiple water-borne lacerations and minor trauma injuries among evacuated residents.'
  },
  {
    id: 'REQ-SUP-2026-083',
    shelterName: 'Kalutara South Maha Vidyalaya Shelter',
    shelterId: 'SH-004',
    district: 'Kalutara',
    zone: 'Kalu Ganga Lowland',
    requester: 'M. K. Bandara (Grama Niladhari)',
    phone: '+94 76 543 2109',
    urgency: 'Normal',
    urgencyClass: 'badge-normal',
    status: 'Approved',
    statusClass: 'status-approved',
    requestedAt: '1 hour ago',
    items: [
      { name: 'Heavy Duty Waterproof Tarpaulins', qty: 80, unit: 'sheets', allocatedFrom: 'Kalutara Depot' },
      { name: 'Sanitary Hygiene Packs (Women/Girls)', qty: 200, unit: 'packs', allocatedFrom: 'Kalutara Depot' }
    ],
    notes: 'Temporary outdoor awning protection for overflow cooking and sanitation.'
  },
  {
    id: 'REQ-SUP-2026-084',
    shelterName: 'Kolonnawa Technical College Camp',
    shelterId: 'SH-003',
    district: 'Colombo',
    zone: 'Kolonnawa Basin',
    requester: 'Nalaka Wickremasinghe',
    phone: '+94 70 112 3344',
    urgency: 'Critical',
    urgencyClass: 'badge-critical',
    status: 'Approved',
    statusClass: 'status-approved',
    requestedAt: '2 hours ago',
    items: [
      { name: 'Drinking Water Tanker / Bowser (6,000L)', qty: 2, unit: 'bowsers', allocatedFrom: 'Peliyagoda Central' },
      { name: 'Oral Rehydration Salts (ORS)', qty: 600, unit: 'packets', allocatedFrom: 'Peliyagoda Central' }
    ],
    notes: 'Municipal pipeline ruptured due to embankment failure. Tanker required immediately.'
  },
  {
    id: 'REQ-SUP-2026-085',
    shelterName: 'Negombo Fishery Community Hall',
    shelterId: 'SH-006',
    district: 'Gampaha',
    zone: 'Negombo Coastal',
    requester: 'Francis Fernando',
    phone: '+94 77 998 7766',
    urgency: 'High',
    urgencyClass: 'badge-high',
    status: 'Dispatched',
    statusClass: 'status-dispatched',
    requestedAt: '3 hours ago',
    items: [
      { name: 'Dry Ration Hampers (Rice, Dhal, Fish)', qty: 180, unit: 'hampers', allocatedFrom: 'Peliyagoda Central' },
      { name: 'Adult Life Jackets (High Buoyancy)', qty: 60, unit: 'vests', allocatedFrom: 'Peliyagoda Central' }
    ],
    notes: 'Convoy TRK-104 en route with police escort.'
  }
];

export const INITIAL_DEPOTS = [
  {
    id: 'DEPOT-001',
    name: 'Peliyagoda Central Logistics Hub',
    code: 'PCH-01',
    district: 'Colombo North',
    address: 'Logistics Park, Peliyagoda Bypass Road, Kelaniya',
    type: 'Primary Central Distribution Warehouse',
    capacitySqFt: 88000,
    occupiedPercent: 86,
    loadingBays: 6,
    activeBays: 5,
    coldChainAvailable: true,
    coldStorageTemp: '2°C to 8°C (Operational)',
    manager: 'Sunil Jayawardena',
    phone: '+94 11 291 4455',
    email: 'peliyagoda.hub@reliefcore.lk',
    status: 'High Volume Operations',
    statusClass: 'status-active',
    primaryItems: ['Food Ration Packs (8,500)', 'Medical Kits (180)', 'Bottled Water (22,000L)', 'Tents & Tarps (650)'],
    fleetStationed: ['4x Heavy 10-Ton Trucks', '2x 6000L Water Bowsers', '3x 4WD Relief Vans']
  },
  {
    id: 'DEPOT-002',
    name: 'Colombo Port Clearance & Staging Depot',
    code: 'CPD-02',
    district: 'Colombo Harbour',
    address: 'Gate 4, Colombo Port Logistics Free Zone',
    type: 'International Aid Inward Clearance & Bulk Depot',
    capacitySqFt: 65000,
    occupiedPercent: 72,
    loadingBays: 4,
    activeBays: 3,
    coldChainAvailable: true,
    coldStorageTemp: '-20°C Deep Freeze Available',
    manager: 'Dammika Seneviratne',
    phone: '+94 11 244 8899',
    email: 'port.depot@reliefcore.lk',
    status: 'Normal Operations',
    statusClass: 'status-active',
    primaryItems: ['WFP High-Energy Biscuits (35 MT)', 'UNICEF WASH Tablets (80,000)', 'Emergency Blankets (4,000)'],
    fleetStationed: ['3x 10-Ton Container Trucks', '2x Forklifts']
  },
  {
    id: 'DEPOT-003',
    name: 'Gampaha Regional Supply Depot',
    code: 'GRD-03',
    district: 'Gampaha',
    address: 'Industrial Zone, Ja-Ela Road, Gampaha',
    type: 'Regional Rapid Dispatch Depot',
    capacitySqFt: 42000,
    occupiedPercent: 94,
    loadingBays: 3,
    activeBays: 3,
    coldChainAvailable: false,
    coldStorageTemp: 'Dry Ambient Storage Only',
    manager: 'Anoma Priyadarshani',
    phone: '+94 33 222 7100',
    email: 'gampaha.depot@reliefcore.lk',
    status: 'Capacity Warning (>90%)',
    statusClass: 'status-warning',
    primaryItems: ['Cooked Meal Kits (4,200)', 'Drinking Water (12,000L)', 'Hygiene Kits (800)'],
    fleetStationed: ['3x 4WD All-Terrain Trucks', '2x Rescue Dinghies']
  },
  {
    id: 'DEPOT-004',
    name: 'Kalutara South Relief Stockpile Facility',
    code: 'KSD-04',
    district: 'Kalutara',
    address: 'Old District Secretariat Complex, Nagoda, Kalutara',
    type: 'Secondary Regional Depot',
    capacitySqFt: 30000,
    occupiedPercent: 58,
    loadingBays: 3,
    activeBays: 2,
    coldChainAvailable: true,
    coldStorageTemp: '2°C to 8°C (Medical Chamber)',
    manager: 'Kavindu Fernando',
    phone: '+94 34 223 9944',
    email: 'kalutara.depot@reliefcore.lk',
    status: 'Normal Operations',
    statusClass: 'status-active',
    primaryItems: ['Family Food Rations (3,100)', 'Disinfectant Supplies (1,500L)', 'Shelter Materials (420)'],
    fleetStationed: ['2x 5-Ton Trucks', '1x 4WD Support Van']
  },
  {
    id: 'DEPOT-005',
    name: 'Negombo Coastal Amphibious Forward Post',
    code: 'NCF-05',
    district: 'Negombo Coastal',
    address: 'Lagoon Fishery Wharf Road, Pitipana, Negombo',
    type: 'Waterborne Rescue & Forward Depot',
    capacitySqFt: 15000,
    occupiedPercent: 64,
    loadingBays: 2,
    activeBays: 2,
    coldChainAvailable: false,
    coldStorageTemp: 'Ambient Marine Facility',
    manager: 'Marcus Fernando',
    phone: '+94 31 227 5500',
    email: 'negombo.forward@reliefcore.lk',
    status: 'Active Field Operations',
    statusClass: 'status-active',
    primaryItems: ['Outboard Motor Fuel (8,000L)', 'Safety Vests (850)', 'Waterproof Medical Packs (120)'],
    fleetStationed: ['6x Motorized Rescue Dinghies', '1x Amphibious Cargo Carrier']
  }
];

export const INITIAL_INTAKE_SHIPMENTS = [
  {
    id: 'IN-2026-041',
    carrier: 'World Food Programme (WFP Logistics)',
    consignor: 'WFP Colombo Country Office',
    waybillNo: 'WB-WFP-LK-9021',
    vehiclePlate: 'WP-ND-4521',
    targetDepot: 'Peliyagoda Central Hub',
    bayAssigned: 'Bay 02',
    driverName: 'S. K. Gunawardena',
    driverPhone: '+94 77 123 9876',
    arrivedAt: 'Today, 14:15',
    status: 'Unloading & Quality Check',
    statusClass: 'status-in-progress',
    items: [
      { name: 'High-Energy Fortified Biscuits', qty: 2500, unit: 'cartons', weightKg: 12500, expiry: '2027-11-30' },
      { name: 'Emergency Family Ration Packs', qty: 800, unit: 'packs', weightKg: 8000, expiry: '2027-05-15' }
    ],
    qualityAudit: 'Inspection in Progress (Sampling 5%)',
    securitySealHash: '0x8fba442c...e19'
  },
  {
    id: 'IN-2026-042',
    carrier: 'Sri Lanka Red Cross Disaster Response',
    consignor: 'Red Cross National Society HQ',
    waybillNo: 'WB-SLRC-2026-118',
    vehiclePlate: 'WP-LH-8802',
    targetDepot: 'Colombo Port Clearance Depot',
    bayAssigned: 'Bay 01',
    driverName: 'Mohamed Rizwan',
    driverPhone: '+94 76 998 1122',
    arrivedAt: 'Today, 12:40',
    status: 'Verified & Stored',
    statusClass: 'status-verified',
    items: [
      { name: 'Emergency Trauma & First Aid Kits', qty: 200, unit: 'kits', weightKg: 1400, expiry: '2028-06-30' },
      { name: 'Sterile Surgical Dressing Kits', qty: 500, unit: 'packs', weightKg: 750, expiry: '2028-08-15' }
    ],
    qualityAudit: 'PASSED (Certificate #MED-9021)',
    securitySealHash: '0x33ac919d...77b'
  },
  {
    id: 'IN-2026-043',
    carrier: 'National Water Supply & Drainage Board',
    consignor: 'NWSDB Western Operations',
    waybillNo: 'WB-NWSDB-WB-094',
    vehiclePlate: 'WP-NA-3319',
    targetDepot: 'Peliyagoda Central Hub',
    bayAssigned: 'Bay 05 (Liquid Intake)',
    driverName: 'K. Somapala',
    driverPhone: '+94 71 445 6677',
    arrivedAt: 'Today, 10:30',
    status: 'Verified & Stored',
    statusClass: 'status-verified',
    items: [
      { name: 'Chlorine-Purified Drinking Water', qty: 18000, unit: 'litres', weightKg: 18000, expiry: 'N/A' }
    ],
    qualityAudit: 'PASSED (WHO Water Quality Cert #WASH-112)',
    securitySealHash: '0x71ee880a...94f'
  },
  {
    id: 'IN-2026-044',
    carrier: 'Ceylon Chamber of Commerce Food Consortium',
    consignor: 'Corporate Flood Relief Coalition',
    waybillNo: 'WB-CCC-RELIEF-402',
    vehiclePlate: 'WP-PJ-6211',
    targetDepot: 'Gampaha Regional Supply Depot',
    bayAssigned: 'Bay 03',
    driverName: 'D. M. Karunaratne',
    driverPhone: '+94 70 334 5566',
    arrivedAt: 'Scheduled Today, 16:30',
    status: 'Expected at Dock',
    statusClass: 'status-scheduled',
    items: [
      { name: 'Basmati Rice (50kg Sacks)', qty: 300, unit: 'sacks', weightKg: 15000, expiry: '2027-10-01' },
      { name: 'Red Split Dhal (25kg Sacks)', qty: 200, unit: 'sacks', weightKg: 5000, expiry: '2027-09-15' },
      { name: 'Canned Mackerel in Oil (425g)', qty: 4800, unit: 'cans', weightKg: 2040, expiry: '2028-12-31' }
    ],
    qualityAudit: 'Pending Dockside Weighing',
    securitySealHash: 'Pending Verification'
  }
];

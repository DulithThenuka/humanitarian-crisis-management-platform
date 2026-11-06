// Mock data for Donor / Funding Officer Portal
// Follows ReliefCore Humanitarian Platform specifications
// Optimized with high-contrast colors for crisp Light & White Theme

export const FUNDING_OFFICER_USER = {
  id: 'usr-fo-042',
  fullName: 'Malini Wijeratne',
  shortName: 'MW',
  role: 'Donor / Funding Officer',
  department: 'HumanAid Resource Coordination',
  email: 'malini.wijeratne@reliefcore.org',
  dutyActive: true,
  operationalArea: 'Western Province Crisis Operations',
  authorizedScope: 'Donor & Funding Operations (Tier 3 Clearance)'
};

export const INITIAL_METRICS = {
  registeredDonors: {
    value: 214,
    label: 'Registered donors',
    subtext: 'Restricted directory',
    trend: '+18 this month',
    trendUp: true
  },
  monetaryRecords: {
    value: 'LKR 8.4m',
    raw: 8400000,
    label: 'Monetary records',
    subtext: 'Demo transactions',
    trend: '+24% vs baseline',
    trendUp: true
  },
  materialDonations: {
    value: '38,420',
    raw: 38420,
    label: 'Material donations',
    subtext: 'Recorded units',
    trend: '14 categories',
    trendUp: true
  },
  activeCampaigns: {
    value: 6,
    label: 'Active campaigns',
    subtext: 'In scope',
    trend: '2 fully funded',
    trendUp: true
  },
  pendingVerification: {
    value: 12,
    label: 'Pending verification',
    subtext: 'Actionable items',
    trend: '3 high priority',
    trendUp: false
  },
  allocatedBalance: {
    value: '64%',
    percentage: 64,
    label: 'Allocated balance',
    subtext: 'Approved records',
    trend: 'LKR 5.37m deployed',
    trendUp: true
  }
};

export const PRIORITY_ATTENTION_ITEMS = [
  {
    id: 'DON-2047',
    code: 'DON-2047 anomaly flag',
    description: 'AI flag on value escalation requires review',
    status: 'urgent',
    tagColor: '#dc2626',
    badgeText: 'urgent',
    relatedTab: 'suspicious',
    timestamp: '15 mins ago',
    details: 'Material intake quantity was updated from 80 kits to 240 kits without secondary warehouse receipt.'
  },
  {
    id: 'ALC-302',
    code: 'ALC-302 approval pending',
    description: 'Dual approval required before distribution',
    status: 'pending',
    tagColor: '#d97706',
    badgeText: 'pending',
    relatedTab: 'allocations',
    timestamp: '42 mins ago',
    details: 'LKR 850,000 emergency medical allocation for Kaduwela field clinics requires Funding Officer co-signature.'
  },
  {
    id: 'CMP-104',
    code: 'Campaign target update',
    description: 'Kaduwela flood response reached 91%',
    status: 'tracking',
    tagColor: '#059669',
    badgeText: 'tracking',
    relatedTab: 'campaigns',
    timestamp: '2 hours ago',
    details: 'Goal of LKR 3,500,000 reached LKR 3,185,000. Reallocation review suggested for southern buffer zone.'
  }
];

export const CONNECTED_WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Citizen request recorded',
    description: 'Funding officer views matched supply inventory',
    status: 'completed',
    nodeType: 'intake',
    actionLink: 'Assistance Triage'
  },
  {
    step: 2,
    title: 'Relief core review',
    description: 'Verify donor-item match',
    status: 'completed',
    nodeType: 'verification',
    actionLink: 'Donor Matching'
  },
  {
    step: 3,
    title: 'Outcome / shelter decision',
    description: 'Shipment allocated to local facility',
    status: 'in-progress',
    nodeType: 'allocation',
    actionLink: 'Shelter Hubs'
  },
  {
    step: 4,
    title: 'Volunteer or partner handoff',
    description: 'Logistics dispatch verified',
    status: 'upcoming',
    nodeType: 'dispatch',
    actionLink: 'Transport Fleet'
  },
  {
    step: 5,
    title: 'Citizen status notification',
    description: 'Aid arrival alert sent to shelter head',
    status: 'upcoming',
    nodeType: 'fulfillment',
    actionLink: 'SMS / Alert Log'
  }
];

export const INITIAL_RECENT_ACTIVITY = [
  {
    id: 'ACT-101',
    time: '14:10',
    recordId: 'DON-2048',
    source: 'Community Relief Fund',
    action: 'Allocation approved by authorised staff',
    officer: 'Malini Wijeratne',
    type: 'Monetary',
    amount: 'LKR 450,000'
  },
  {
    id: 'ACT-102',
    time: '13:45',
    recordId: 'DON-2047',
    source: 'MedCare Lanka',
    action: 'Material intake recorded by authorised staff',
    officer: 'Rohan Senanayake',
    type: 'Material',
    amount: '240 medicine packs'
  },
  {
    id: 'ACT-103',
    time: '11:20',
    recordId: 'DON-2046',
    source: 'Public campaign',
    action: 'Monetary record submitted by authorised staff',
    officer: 'Amara Chen',
    type: 'Monetary',
    amount: 'LKR 120,000'
  },
  {
    id: 'ACT-104',
    time: '09:50',
    recordId: 'DON-2045',
    source: 'WaterAid Response',
    action: 'Dispatch confirmed to Kelani Buffer Zone RES-021',
    officer: 'Malini Wijeratne',
    type: 'Material',
    amount: '1,200 water units'
  },
  {
    id: 'ACT-105',
    time: '08:15',
    recordId: 'CMP-102',
    source: 'Clean Water Initiative',
    action: 'Campaign milestone reached (75% funded)',
    officer: 'System Alert',
    type: 'Campaign',
    amount: 'LKR 1,500,000'
  }
];

export const DONOR_MANAGEMENT_RECORDS = [
  {
    id: 'DON-2048',
    source: 'Community Relief Fund',
    donorOrg: 'Colombo Community Relief Trust',
    contactPerson: 'Dr. Dayan Jayasuriya',
    email: 'treasury@communityrelieftrust.lk',
    phone: '+94 11 285 4100',
    type: 'Monetary',
    recordedValue: 'LKR 450,000',
    rawValue: 450000,
    currency: 'LKR',
    verification: 'Verified',
    allocation: 'Flood campaign',
    allocationTarget: 'Western Province Flood Emergency Fund (WPF-2026)',
    status: 'Allocated',
    statusColor: '#0284c7',
    statusBg: '#eff6ff',
    statusBorder: '#bfdbfe',
    operationalArea: 'Colombo District',
    notes: 'Dual verification completed for flood relief fund. Earmarked for high-ground shelter hygiene and dry ration packages.',
    verifiedAt: '2026-11-05 14:10',
    verifiedBy: 'Malini Wijeratne (Funding Officer)',
    category: 'Emergency Relief Grants',
    complianceDoc: 'DOC-CRF-4820-AUDIT.pdf'
  },
  {
    id: 'DON-2047',
    source: 'MedCare Lanka',
    donorOrg: 'MedCare Lanka Pharmaceutical Consortium',
    contactPerson: 'Samanthi Perera',
    email: 'donations@medcarelanka.org',
    phone: '+94 77 392 8110',
    type: 'Material',
    recordedValue: '240 medicine packs',
    rawValue: 240,
    currency: 'Units',
    verification: 'Pending',
    allocation: 'Unallocated',
    allocationTarget: 'Regional Medical Stockpile',
    status: 'Review',
    statusColor: '#b45309',
    statusBg: '#fffbeb',
    statusBorder: '#fde68a',
    operationalArea: 'Gampaha District',
    notes: 'Awaiting secondary batch certificate for antibiotics and insulin storage temperature logs. Dual verification pending.',
    verifiedAt: 'Pending Review',
    verifiedBy: 'Assigned to Malini Wijeratne',
    category: 'Medical Supplies',
    complianceDoc: 'BATCH-MCL-2026-X12.pdf'
  },
  {
    id: 'DON-2046',
    source: 'Public campaign',
    donorOrg: 'Western Province Citizen Solidarity Fund',
    contactPerson: 'Niroshan Alwis',
    email: 'solidarity@reliefcore.org',
    phone: '+94 11 740 9200',
    type: 'Monetary',
    recordedValue: 'LKR 120,000',
    rawValue: 120000,
    currency: 'LKR',
    verification: 'Verified',
    allocation: 'Shelter supplies',
    allocationTarget: 'St. Peter\'s College Evacuation Centre',
    status: 'Completed',
    statusColor: '#059669',
    statusBg: '#ecfdf5',
    statusBorder: '#a7f3d0',
    operationalArea: 'Colombo North',
    notes: 'Direct online crowdfunding micro-donations aggregated into emergency shelter bedding and potable water allocation.',
    verifiedAt: '2026-11-05 11:20',
    verifiedBy: 'System Auto-Reconciliation',
    category: 'Crowdfunding',
    complianceDoc: 'RECON-AGG-8841.pdf'
  },
  {
    id: 'DON-2045',
    source: 'WaterAid Response',
    donorOrg: 'WaterAid Global Emergency Network',
    contactPerson: 'Helena Berg',
    email: 'response.lanka@wateraid-network.org',
    phone: '+94 71 883 4521',
    type: 'Material',
    recordedValue: '1,200 water units',
    rawValue: 1200,
    currency: 'Units',
    verification: 'Verified',
    allocation: 'RES-021',
    allocationTarget: 'Kelani Buffer Zone Rapid Dispatch (RES-021)',
    status: 'Dispatched',
    statusColor: '#0369a1',
    statusBg: '#f0f9ff',
    statusBorder: '#bae6fd',
    operationalArea: 'Kalutara & Kelani Basin',
    notes: 'Consignment cleared customs and dispatched via Logistics Convoy 04. Delivery signed by Shelter In-Charge.',
    verifiedAt: '2026-11-05 09:50',
    verifiedBy: 'Malini Wijeratne & Capt. T. Silva',
    category: 'WASH (Water & Sanitation)',
    complianceDoc: 'WAYBILL-WA-99201.pdf'
  },
  {
    id: 'DON-2044',
    source: 'Ceylon Chamber of Commerce',
    donorOrg: 'Ceylon Chamber Disaster Relief Wing',
    contactPerson: 'Kavan Wickramasinghe',
    email: 'kavan@chamber.lk',
    phone: '+94 11 558 8800',
    type: 'Monetary',
    recordedValue: 'LKR 2,000,000',
    rawValue: 2000000,
    currency: 'LKR',
    verification: 'Verified',
    allocation: 'Dry Rations Procurement',
    allocationTarget: 'Regional Food Bank Bulk Order (RFB-404)',
    status: 'Allocated',
    statusColor: '#0284c7',
    statusBg: '#eff6ff',
    statusBorder: '#bfdbfe',
    operationalArea: 'Western Province Multi-Zone',
    notes: 'Corporate CSR consortium grant. Allocated to bulk dry ration contracts with local cooperative wholesale markets.',
    verifiedAt: '2026-11-04 16:30',
    verifiedBy: 'Malini Wijeratne',
    category: 'Corporate CSR',
    complianceDoc: 'MOU-CCC-2026-08.pdf'
  },
  {
    id: 'DON-2043',
    source: 'UN OCHA Flash Appeal Match',
    donorOrg: 'UN OCHA Humanitarian Emergency Window',
    contactPerson: 'Amina Al-Mansoor',
    email: 'amina.almansoor@unocha.org',
    phone: '+41 22 917 1234',
    type: 'Monetary',
    recordedValue: 'LKR 3,500,000',
    rawValue: 3500000,
    currency: 'LKR',
    verification: 'Verified',
    allocation: 'SAR Boat Fleet & Medical Airlift',
    allocationTarget: 'Operation Swift Waters Rescue Command',
    status: 'Allocated',
    statusColor: '#0284c7',
    statusBg: '#eff6ff',
    statusBorder: '#bfdbfe',
    operationalArea: 'Kelani / Kalu River Basins',
    notes: 'Institutional emergency response allocation. Audited against UN cluster protocols for disaster response.',
    verifiedAt: '2026-11-04 10:15',
    verifiedBy: 'Amara Chen & Malini Wijeratne',
    category: 'Institutional Grant',
    complianceDoc: 'UNOCHA-LKA-FL26-GRANT.pdf'
  },
  {
    id: 'DON-2042',
    source: 'Rotary Club of Colombo West',
    donorOrg: 'Rotary International District 3220',
    contactPerson: 'Rukshan De Silva',
    email: 'service@rotarycolombowest.org',
    phone: '+94 77 733 9901',
    type: 'Material',
    recordedValue: '500 Hygiene & Dignity Kits',
    rawValue: 500,
    currency: 'Units',
    verification: 'Verified',
    allocation: 'Shelter Hub Kolonnawa',
    allocationTarget: 'Kolonnawa High Ground Refuge Centre',
    status: 'Completed',
    statusColor: '#059669',
    statusBg: '#ecfdf5',
    statusBorder: '#a7f3d0',
    operationalArea: 'Kolonnawa / Wellampitiya',
    notes: '500 family dignity and infant hygiene packs delivered directly to Kolonnawa shelter management team.',
    verifiedAt: '2026-11-03 14:00',
    verifiedBy: 'Malini Wijeratne',
    category: 'Sanitation Supplies',
    complianceDoc: 'ROTARY-DIST-3220-ACK.pdf'
  }
];

export const CAMPAIGNS_DATA = [
  {
    id: 'CMP-101',
    code: 'WPF-2026',
    name: 'Western Province Monsoon Flood Emergency Appeal',
    targetAmount: 'LKR 10,000,000',
    rawTarget: 10000000,
    raisedAmount: 'LKR 8,400,000',
    rawRaised: 8400000,
    progress: 84,
    donorCount: 142,
    urgency: 'Critical',
    urgencyColor: '#dc2626',
    operationalArea: 'Colombo, Gampaha & Kalutara',
    leadOfficer: 'Malini Wijeratne',
    status: 'Active',
    endDate: '2026-11-30',
    description: 'Emergency airlift, high-ground shelter provisioning, and immediate hot meal distribution across flooded river basin communities.'
  },
  {
    id: 'CMP-102',
    code: 'CWI-WASH',
    name: 'Clean Water & Sanitation Rapid Response',
    targetAmount: 'LKR 2,000,000',
    rawTarget: 2000000,
    raisedAmount: 'LKR 1,500,000',
    rawRaised: 1500000,
    progress: 75,
    donorCount: 38,
    urgency: 'High',
    urgencyColor: '#d97706',
    operationalArea: 'Kelani East & Inundated Zones',
    leadOfficer: 'Malini Wijeratne',
    status: 'Active',
    endDate: '2026-11-25',
    description: 'Procurement of mobile water purification tablets, 1,000L collapsible storage tanks, and daily clean bowser supply runs.'
  },
  {
    id: 'CMP-103',
    code: 'MED-KIT',
    name: 'Emergency Medical Trauma Kits & Insulin Bank',
    targetAmount: 'LKR 3,000,000',
    rawTarget: 3000000,
    raisedAmount: 'LKR 2,850,000',
    rawRaised: 2850000,
    progress: 95,
    donorCount: 29,
    urgency: 'High',
    urgencyColor: '#d97706',
    operationalArea: 'All 16 Active Shelters',
    leadOfficer: 'Dr. Dayan Jayasuriya',
    status: 'Active',
    endDate: '2026-11-20',
    description: 'Cold-chain battery refrigerated packs for insulin storage and 500 trauma kits for field ambulance paramedics.'
  },
  {
    id: 'CMP-104',
    code: 'KAD-REL',
    name: 'Kaduwela & Kelani Basin Targeted Community Recovery',
    targetAmount: 'LKR 3,500,000',
    rawTarget: 3500000,
    raisedAmount: 'LKR 3,185,000',
    rawRaised: 3185000,
    progress: 91,
    donorCount: 54,
    urgency: 'Medium',
    urgencyColor: '#0284c7',
    operationalArea: 'Kaduwela & Biyagama',
    leadOfficer: 'Malini Wijeratne',
    status: 'Active',
    endDate: '2026-12-10',
    description: 'Post-flood mud clearance tools, building disinfectant packs, and direct cash-voucher assistance to vulnerable elderly households.'
  },
  {
    id: 'CMP-105',
    code: 'SHEL-BED',
    name: 'High-Ground Shelter Mat & Bedding Logistics',
    targetAmount: 'LKR 1,500,000',
    rawTarget: 1500000,
    raisedAmount: 'LKR 1,500,000',
    rawRaised: 1500000,
    progress: 100,
    donorCount: 22,
    urgency: 'Completed',
    urgencyColor: '#059669',
    operationalArea: 'Western Province High-Ground Hubs',
    leadOfficer: 'Rohan Senanayake',
    status: 'Funded',
    endDate: '2026-11-04',
    description: 'Completed provision of 1,200 waterproof sleeping mats and wool blankets to St. Peter\'s and Kolonnawa shelters.'
  },
  {
    id: 'CMP-106',
    code: 'ORPH-SUP',
    name: 'Mother & Infant Emergency Nutritional Care',
    targetAmount: 'LKR 1,800,000',
    rawTarget: 1800000,
    raisedAmount: 'LKR 1,260,000',
    rawRaised: 1260000,
    progress: 70,
    donorCount: 19,
    urgency: 'Critical',
    urgencyColor: '#dc2626',
    operationalArea: 'Flooded Lowlands Maternity Wards',
    leadOfficer: 'Malini Wijeratne',
    status: 'Active',
    endDate: '2026-11-28',
    description: 'Infant milk formula, sterile baby bottles, and supplemental micro-nutrients for nursing mothers displaced by floodwaters.'
  }
];

export const ALLOCATIONS_EXPENDITURE_DATA = [
  {
    id: 'ALC-301',
    voucherCode: 'VCH-WP-991',
    title: 'Dry Rations Bulk Wholesale Contract',
    cluster: 'Food & Nutrition',
    clusterColor: '#0284c7',
    sourceDonation: 'DON-2044 (Ceylon Chamber)',
    allocatedAmount: 'LKR 1,200,000',
    disbursedAmount: 'LKR 1,200,000',
    beneficiaries: '3,800 individuals (950 families)',
    destinationFacility: 'Western Food Logistics Depot (Peliyagoda)',
    approver1: 'Malini Wijeratne (Funding Officer)',
    approver2: 'Amara Chen (Emergency Coordinator)',
    approvalStatus: 'Dual Approved',
    statusColor: '#059669',
    date: '2026-11-04',
    auditReference: 'AUD-FOOD-4011'
  },
  {
    id: 'ALC-302',
    voucherCode: 'VCH-WP-992',
    title: 'Emergency Field Clinic Pharmaceuticals',
    cluster: 'Healthcare & Medical SAR',
    clusterColor: '#dc2626',
    sourceDonation: 'DON-2048 (Community Relief)',
    allocatedAmount: 'LKR 850,000',
    disbursedAmount: 'LKR 0 (Pending Release)',
    beneficiaries: '1,400 affected patients in Kaduwela',
    destinationFacility: 'Kaduwela Mobile Triage Station #2',
    approver1: 'Malini Wijeratne (Signed)',
    approver2: 'Awaiting Co-Signatory',
    approvalStatus: 'Pending Co-Signature',
    statusColor: '#d97706',
    date: '2026-11-05',
    auditReference: 'AUD-MED-4012'
  },
  {
    id: 'ALC-303',
    voucherCode: 'VCH-WP-993',
    title: 'Clean Water Bowser 10-Day Contract',
    cluster: 'WASH (Water & Sanitation)',
    clusterColor: '#0284c7',
    sourceDonation: 'DON-2043 (UN OCHA Match)',
    allocatedAmount: 'LKR 950,000',
    disbursedAmount: 'LKR 950,000',
    beneficiaries: '8,200 shelter residents',
    destinationFacility: 'Kolonnawa, Kelaniya & Sedawatta Hubs',
    approver1: 'Malini Wijeratne (Funding Officer)',
    approver2: 'D. Mendis (Finance Comptroller)',
    approvalStatus: 'Dual Approved',
    statusColor: '#059669',
    date: '2026-11-03',
    auditReference: 'AUD-WASH-4013'
  },
  {
    id: 'ALC-304',
    voucherCode: 'VCH-WP-994',
    title: 'Inflatable Rescue Rafts & Life Jackets',
    cluster: 'Search & Rescue Fleet',
    clusterColor: '#7c3aed',
    sourceDonation: 'DON-2043 (UN OCHA Match)',
    allocatedAmount: 'LKR 1,400,000',
    disbursedAmount: 'LKR 1,400,000',
    beneficiaries: '450 flood-trapped citizens extracted',
    destinationFacility: 'Navy SAR Coordination Center (DMC)',
    approver1: 'Malini Wijeratne (Funding Officer)',
    approver2: 'Amara Chen (Emergency Coordinator)',
    approvalStatus: 'Dual Approved',
    statusColor: '#059669',
    date: '2026-11-02',
    auditReference: 'AUD-SAR-4014'
  },
  {
    id: 'ALC-305',
    voucherCode: 'VCH-WP-995',
    title: 'Shelter Sanitation Kits & Baby Nutrition',
    cluster: 'Shelter Management',
    clusterColor: '#059669',
    sourceDonation: 'DON-2046 (Public Campaign)',
    allocatedAmount: 'LKR 120,000',
    disbursedAmount: 'LKR 120,000',
    beneficiaries: '120 mothers and infants',
    destinationFacility: 'St. Peter\'s College Evacuation Centre',
    approver1: 'Malini Wijeratne (Funding Officer)',
    approver2: 'S. Bandara (Shelter Coordinator)',
    approvalStatus: 'Dual Approved',
    statusColor: '#059669',
    date: '2026-11-05',
    auditReference: 'AUD-SHEL-4015'
  }
];

export const SUSPICIOUS_FLAGS_DATA = [
  {
    id: 'FLG-801',
    recordId: 'DON-2047',
    source: 'MedCare Lanka',
    flagType: 'Value Escalation Anomaly',
    severity: 'High',
    severityColor: '#dc2626',
    detectedAt: '2026-11-05 13:46',
    triggerReason: 'Intake reported 240 antibiotic kits but original electronic dispatch manifest specified 80 kits. Potential duplicate billing or packaging batch mismatch.',
    recommendedAction: 'Freeze batch allocation until physical count is co-signed by MedCare warehouse manager.',
    status: 'Under Review',
    statusColor: '#d97706',
    assignedOfficer: 'Malini Wijeratne',
    auditTrail: [
      { time: '13:45', action: 'Record entered by warehouse desk' },
      { time: '13:46', action: 'AI heuristic flag triggered (300% variance vs prior mean)' },
      { time: '14:02', action: 'Assigned to Funding Officer queue for verification' }
    ]
  },
  {
    id: 'FLG-802',
    recordId: 'DON-2039',
    source: 'Unverified Overseas Wire (Apex Relief)',
    flagType: 'Unverified Entity / PEP Check',
    severity: 'Medium',
    severityColor: '#d97706',
    detectedAt: '2026-11-04 18:22',
    triggerReason: 'Remittance source country lacks reciprocal NGO tax exemption certificate. Compliance documentation missing.',
    recommendedAction: 'Request standard Form C anti-money laundering self-declaration from sending entity.',
    status: 'Pending Document',
    statusColor: '#0284c7',
    assignedOfficer: 'D. Mendis (Legal/Compliance)',
    auditTrail: [
      { time: '18:20', action: 'Inbound wire received in clearing account' },
      { time: '18:22', action: 'Bank AML screening tagged overseas jurisdiction' },
      { time: '19:00', action: 'Clarification email sent to registered donor address' }
    ]
  }
];

export const TRANSPARENCY_REPORTS_DATA = [
  {
    id: 'REP-01',
    title: 'Western Province Flood Emergency Financial Statement (Week 1)',
    period: '28 Oct 2026 - 04 Nov 2026',
    totalInflow: 'LKR 8,400,000',
    totalOutflow: 'LKR 5,370,000',
    committedBalance: 'LKR 3,030,000',
    auditStatus: 'External Audit Certified',
    certifiedBy: 'Transparency International LK & National Audit Office',
    fileSize: '2.4 MB',
    format: 'PDF / Verified Hash'
  },
  {
    id: 'REP-02',
    title: 'In-Kind Relief Goods Utilization & Warehouse Manifest',
    period: '01 Nov 2026 - 05 Nov 2026',
    totalInflow: '38,420 units',
    totalOutflow: '26,180 units distributed',
    committedBalance: '12,240 units in reserve',
    auditStatus: 'Verified by Logistics Directorate',
    certifiedBy: 'Peliyagoda Central Warehouse Authority',
    fileSize: '1.8 MB',
    format: 'PDF / CSV'
  },
  {
    id: 'REP-03',
    title: 'Institutional Donors Compliance & Milestone Report',
    period: 'October - November 2026',
    totalInflow: 'USD $42,500 equivalent',
    totalOutflow: 'USD $32,000 allocated',
    committedBalance: 'USD $10,500 active reserve',
    auditStatus: 'UN Cluster Compliant',
    certifiedBy: 'UN OCHA Liaison Desk',
    fileSize: '3.1 MB',
    format: 'PDF'
  }
];

export const PARTNER_ORGANISATIONS = [
  {
    id: 'PART-001',
    name: 'Sri Lanka Red Cross Society',
    acronym: 'SLRCS',
    type: 'Humanitarian / First Response',
    leadContact: 'Dr. Rohan Jayasinghe',
    phone: '+94 11 269 1095',
    email: 'operations@redcross.lk',
    status: 'Active Response',
    statusClass: 'status-active',
    assignedZones: ['Kelani East - Sector 03', 'Kolonnawa', 'Kaduwela'],
    commitments: [
      { item: 'Inflatable Rescue Boats with Crew', qty: 12, status: 'Deployed' },
      { item: 'Emergency First Aid Mobile Units', qty: 6, status: 'Deployed' },
      { item: 'Dry Food Family Packs (7-day)', qty: 4500, status: 'Distributing' }
    ],
    mouStatus: 'Active MoU (2025-2027)',
    mouBadge: 'badge-verified'
  },
  {
    id: 'PART-002',
    name: 'Sarvodaya Shramadana Movement',
    acronym: 'SARVODAYA',
    type: 'Community Relief & Volunteer Mobilisation',
    leadContact: 'Nimali Senaratne',
    phone: '+94 11 265 5255',
    email: 'relief@sarvodaya.org',
    status: 'Active Response',
    statusClass: 'status-active',
    assignedZones: ['Gampaha Central', 'Wattala', 'Ja-Ela'],
    commitments: [
      { item: 'Community Kitchen Meal Distribution', qty: 8500, status: 'Serving' },
      { item: 'Trained Community First Responders', qty: 140, status: 'Active' },
      { item: 'Water Purification Tablets (strips)', qty: 15000, status: 'Distributing' }
    ],
    mouStatus: 'Active MoU (2024-2026)',
    mouBadge: 'badge-verified'
  },
  {
    id: 'PART-003',
    name: 'World Food Programme (Sri Lanka)',
    acronym: 'WFP',
    type: 'UN Agency / Food Logistics',
    leadContact: 'Marcus Lindqvist',
    phone: '+94 11 250 2481',
    email: 'colombo.logistics@wfp.org',
    status: 'Staged Support',
    statusClass: 'status-staged',
    assignedZones: ['National Warehouse Hub - Peliyagoda', 'Kalutara South'],
    commitments: [
      { item: 'High-Energy Biscuits (Metric Tonnes)', qty: 35, status: 'Warehoused' },
      { item: 'Mobile Storage Units (MSUs)', qty: 4, status: 'Erected' },
      { item: 'Last-Mile Logistics 4x4 Fleet', qty: 8, status: 'Dispatched' }
    ],
    mouStatus: 'UN Bilateral Framework',
    mouBadge: 'badge-un'
  },
  {
    id: 'PART-004',
    name: 'UNICEF Sri Lanka',
    acronym: 'UNICEF',
    type: 'UN Agency / WASH & Child Protection',
    leadContact: 'Shireen Al-Hashimi',
    phone: '+94 11 276 8555',
    email: 'emergency.wash@unicef.org',
    status: 'Active Response',
    statusClass: 'status-active',
    assignedZones: ['Kolonnawa Relief Hub', 'Wellampitiya Safe Center'],
    commitments: [
      { item: 'Emergency Water Bladders (5000L)', qty: 10, status: 'Installed' },
      { item: 'Child-Friendly Space Recreation Kits', qty: 25, status: 'Deployed' },
      { item: 'Maternal Hygiene Dignity Packs', qty: 2200, status: 'Distributing' }
    ],
    mouStatus: 'UN Bilateral Framework',
    mouBadge: 'badge-un'
  },
  {
    id: 'PART-005',
    name: 'Direct Relief International',
    acronym: 'DRI',
    type: 'International NGO / Medical Logistics',
    leadContact: 'Dr. Evelyn Ward',
    phone: '+1 805 964 4767',
    email: 'asia-ops@directrelief.org',
    status: 'In Transit',
    statusClass: 'status-transit',
    assignedZones: ['Colombo General Hospital Annex', 'IDH Angoda'],
    commitments: [
      { item: 'Emergency Health Modules (interagency)', qty: 6, status: 'In Transit' },
      { item: 'IV Fluids & Antibiotics Consignment', qty: 500, status: 'Clearing Customs' }
    ],
    mouStatus: 'Pending Renewal',
    mouBadge: 'badge-review'
  }
];

export const OPERATIONAL_SECTORS = [
  { name: 'WASH (Water & Sanitation)', leadAgency: 'UNICEF / National Water Board', activePartners: 4, coverage: '92%' },
  { name: 'Food Security & Nutrition', leadAgency: 'WFP / Sarvodaya', activePartners: 7, coverage: '88%' },
  { name: 'Emergency Shelter & NFIs', leadAgency: 'Sri Lanka Red Cross / Disaster Mgmt Centre', activePartners: 5, coverage: '79%' },
  { name: 'Health & Medical Response', leadAgency: 'Ministry of Health / Direct Relief', activePartners: 6, coverage: '95%' },
  { name: 'Logistics & Telecomms', leadAgency: 'WFP / Sri Lanka Telecom', activePartners: 3, coverage: '85%' }
];

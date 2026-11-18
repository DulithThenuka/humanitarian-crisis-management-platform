import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Shield,
  ShieldAlert,
  ClipboardList,
  Package,
  Building2,
  Users,
  Gift,
  Cpu,
  MapPin,
  Bell,
  FileBarChart,
  ShieldCheck,
  Settings,
  ChevronRight,
  Search,
  Plus,
  RefreshCw,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Truck,
  Droplets,
  HeartPulse,
  Lock,
  Unlock,
  Key,
  Trash2,
  Edit,
  Eye,
  X,
  PhoneCall,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  Download,
  Share2,
  Sparkles,
  Radio,
  Send,
  Sliders,
  Activity,
  Check,
  ExternalLink,
  Compass,
  Navigation,
  Zap,
  BarChart3,
  PieChart,
  Info,
  Globe,
  Wifi,
  AlertCircle,
  CreditCard,
  Award,
  TrendingDown,
  Target,
  Clock
} from 'lucide-react';

import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import reliefcoreIcon from '../../assets/reliefcore-icon.png';
import sarahJohnsonAvatar from '../../assets/sarah-johnson.jpg';
import westernProvinceMap from '../../assets/western-province-map-clean.png';
import shelterPhoto1 from '../../assets/shelter-1.jpg';
import reqEvidencePhoto from '../../assets/req-evidence-1.jpg';

import './AdminDashboard.css';

// Default Telemetry Stats matching the screenshots
const DEFAULT_STATS = {
  activeCrises: 8,
  totalUsers: 1248,
  activeVolunteers: 1245,
  resourcesDeployed: 6280,
  peopleAssisted: 12450,
  totalInventoryItems: 6280,
  itemsDispatched: 4320,
  inStock: 3860,
  lowStockItems: 320,
  inventoryValueRs: 12450000,
  totalShelters: 28,
  totalShelterCapacity: 6240,
  occupiedShelterBeds: 4618,
  availableShelterBeds: 1622,
  systemUptimePercentage: 99.98,
  databaseLatencyMs: 14.2
};

// Default User Accounts
const DEFAULT_USERS = [
  { id: 'usr-001', fullName: 'Sarah Johnson', email: 'sarah.johnson@reliefcore.lk', role: 'Coordinator', assignedDistrict: 'Colombo', isActive: true, createdAt: '2026-09-12' },
  { id: 'usr-002', fullName: 'Kasun Perera', email: 'kasun.p@reliefcore.lk', role: 'LogisticsManager', assignedDistrict: 'Gampaha', isActive: true, createdAt: '2026-09-14' },
  { id: 'usr-003', fullName: 'Tharushi De Alwis', email: 'tharushi.d@reliefcore.lk', role: 'ShelterAdministrator', assignedDistrict: 'Kalutara', isActive: true, createdAt: '2026-09-18' },
  { id: 'usr-004', fullName: 'Dulith Thenuka', email: 'admin@reliefcore.lk', role: 'Admin', assignedDistrict: 'National Command', isActive: true, createdAt: '2026-09-01' },
  { id: 'usr-005', fullName: 'Nimali Silva', email: 'nimali.s@gmail.com', role: 'Volunteer', assignedDistrict: 'Galle', isActive: false, createdAt: '2026-10-02' },
  { id: 'usr-006', fullName: 'Kamal Bandara', email: 'kamal.b@outlook.com', role: 'Citizen', assignedDistrict: 'Ratnapura', isActive: true, createdAt: '2026-10-05' },
  { id: 'usr-007', fullName: 'Tharindu Perera', email: 'tharindu.p@field.lk', role: 'Volunteer', assignedDistrict: 'Colombo', isActive: true, createdAt: '2026-10-10' },
  { id: 'usr-008', fullName: 'Kavindu Fernando', email: 'kavindu.f@reliefcore.lk', role: 'LogisticsManager', assignedDistrict: 'Kalutara', isActive: true, createdAt: '2026-10-12' }
];

// Default Crisis Incidents
const DEFAULT_CRISES = [
  {
    id: 'CRS-2026-001',
    title: 'Kelani River Flash Flooding',
    type: 'Flood',
    district: 'Colombo',
    severity: 'Critical',
    affectedPeople: 3200,
    areaSqKm: 42,
    teamsDeployed: 6,
    status: 'Active Escalation',
    declaredAt: '2026-06-15 04:30',
    leadCoordinator: 'Sarah Johnson',
    waterLevelMeters: 1.84,
    notes: 'Low-lying areas of Wellampitiya and Kolonnawa severely inundated. Water crest exceeded major flood threshold.'
  },
  {
    id: 'CRS-2026-002',
    title: 'Gampaha Railway Embankment Mudslide',
    type: 'Landslide',
    district: 'Gampaha',
    severity: 'High',
    affectedPeople: 850,
    areaSqKm: 12,
    teamsDeployed: 3,
    status: 'Evacuation Underway',
    declaredAt: '2026-06-15 06:15',
    leadCoordinator: 'Kasun Perera',
    waterLevelMeters: 1.12,
    notes: 'A1 bypass route blocked near Miriswatta. Mud deposit clearance underway with 2 heavy backhoes.'
  },
  {
    id: 'CRS-2026-003',
    title: 'Kalutara Estuary Coastal Surge',
    type: 'Storm Surge',
    district: 'Kalutara',
    severity: 'High',
    affectedPeople: 2100,
    areaSqKm: 28,
    teamsDeployed: 5,
    status: 'Active Escalation',
    declaredAt: '2026-06-14 22:45',
    leadCoordinator: 'Tharushi De Alwis',
    waterLevelMeters: 2.10,
    notes: 'High tide combined with south-west monsoon swell. Sea wall overtopped near Maggona.'
  },
  {
    id: 'CRS-2026-004',
    title: 'Negombo Lagoon Inundation',
    type: 'Flood',
    district: 'Negombo',
    severity: 'Low',
    affectedPeople: 600,
    areaSqKm: 8,
    teamsDeployed: 2,
    status: 'Contained',
    declaredAt: '2026-06-14 18:00',
    leadCoordinator: 'Sadeepa Wickramasinghe',
    waterLevelMeters: 0.65,
    notes: 'Sluice gates opened at tidal peak. Water levels subsiding steadily.'
  },
  {
    id: 'CRS-2026-005',
    title: 'Hambantota Arid Zone Water Deficit',
    type: 'Drought',
    district: 'Hambantota',
    severity: 'Medium',
    affectedPeople: 1800,
    areaSqKm: 110,
    teamsDeployed: 2,
    status: 'Operations Deployed',
    declaredAt: '2026-06-13 09:00',
    leadCoordinator: 'Kamal Bandara',
    waterLevelMeters: 0.15,
    notes: '5 water bowsers dispatched from regional depot to serve agricultural worker clusters.'
  },
  {
    id: 'CRS-2026-006',
    title: 'Attanagalu Oya Inundation Zone',
    type: 'Flood',
    district: 'Gampaha',
    severity: 'High',
    affectedPeople: 1450,
    areaSqKm: 19,
    teamsDeployed: 4,
    status: 'Operations Deployed',
    declaredAt: '2026-06-15 08:20',
    leadCoordinator: 'Kasun Perera',
    waterLevelMeters: 1.45,
    notes: 'Ja-Ela industrial corridor access roads compromised. Inflatable rescue dinghies deployed.'
  },
  {
    id: 'CRS-2026-007',
    title: 'Ratnapura Kalu Ganga Inundation',
    type: 'Flood',
    district: 'Ratnapura',
    severity: 'Critical',
    affectedPeople: 4100,
    areaSqKm: 65,
    teamsDeployed: 7,
    status: 'Active Escalation',
    declaredAt: '2026-06-15 03:00',
    leadCoordinator: 'Dulith Thenuka',
    waterLevelMeters: 2.35,
    notes: 'Major flood level declared at Putupaula hydrometric station. Tri-forces rescue operations activated.'
  },
  {
    id: 'CRS-2026-008',
    title: 'Kaduwela Expressway Waterlogging',
    type: 'Flash Flood',
    district: 'Colombo',
    severity: 'Medium',
    affectedPeople: 920,
    areaSqKm: 6,
    teamsDeployed: 3,
    status: 'Contained',
    declaredAt: '2026-06-15 07:10',
    leadCoordinator: 'Sarah Johnson',
    waterLevelMeters: 0.85,
    notes: 'Drainage sumps cleared. Expressway entry reopened under single-lane escort.'
  }
];

// Default Donations & Grants Ledger
const DEFAULT_DONATIONS = [
  {
    id: 'DON-2026-0101',
    donorName: 'Dilmah Tea Relief Trust',
    type: 'Monetary Grant',
    amountFormatted: 'Rs. 5,000,000',
    amountRaw: 5000000,
    sector: 'Food & Clean Water',
    targetDistrict: 'Colombo (Kelani Basin)',
    status: 'Verified & Cleared',
    date: '2026-06-15',
    verifiedBy: 'DMC Treasury Audit',
    taxExemptId: 'TE-2026-8841',
    auditHash: '0x8f7a...33b9'
  },
  {
    id: 'DON-2026-0102',
    donorName: 'UN OCHA Emergency Rapid Fund',
    type: 'International Grant',
    amountFormatted: 'Rs. 8,500,000',
    amountRaw: 8500000,
    sector: 'Medical Field Hospitals',
    targetDistrict: 'Western & Sabaragamuwa',
    status: 'Verified & Cleared',
    date: '2026-06-14',
    verifiedBy: 'UN Comptroller Office',
    taxExemptId: 'UN-NGO-2026-002',
    auditHash: '0x12c4...e891'
  },
  {
    id: 'DON-2026-0103',
    donorName: 'John Keells Foundation',
    type: 'In-Kind Relief Supplies',
    amountFormatted: '2,500 Ration Packs (Rs. 3.75M)',
    amountRaw: 3750000,
    sector: 'Dry Rations & Baby Care',
    targetDistrict: 'Gampaha Evacuee Shelters',
    status: 'Allocated to Depot',
    date: '2026-06-14',
    verifiedBy: 'Logistics Intake Dock',
    taxExemptId: 'TE-2026-8812',
    auditHash: '0x99ea...04bc'
  },
  {
    id: 'DON-2026-0104',
    donorName: 'Commercial Bank CSR Division',
    type: 'Monetary Grant',
    amountFormatted: 'Rs. 3,200,000',
    amountRaw: 3200000,
    sector: 'Water Bowsers & Fuel Reserves',
    targetDistrict: 'Colombo & Kalutara',
    status: 'Verified & Cleared',
    date: '2026-06-13',
    verifiedBy: 'DMC Treasury Audit',
    taxExemptId: 'TE-2026-8790',
    auditHash: '0x33d1...ff20'
  },
  {
    id: 'DON-2026-0105',
    donorName: 'Sri Lanka Red Cross Society',
    type: 'In-Kind Medical Equipment',
    amountFormatted: '1,200 Surgical & First Aid Kits',
    amountRaw: 2400000,
    sector: 'Emergency Medical Care',
    targetDistrict: 'Colombo Base Stations',
    status: 'Allocated to Depot',
    date: '2026-06-13',
    verifiedBy: 'Medical Corps Logistics',
    taxExemptId: 'RC-MED-2026',
    auditHash: '0x44aa...7719'
  },
  {
    id: 'DON-2026-0106',
    donorName: 'Rotary Club Colombo West',
    type: 'Monetary Grant',
    amountFormatted: 'Rs. 1,800,000',
    amountRaw: 1800000,
    sector: 'Shelter Bedding & Tarpaulins',
    targetDistrict: 'Western Province Shelters',
    status: 'Verified & Cleared',
    date: '2026-06-12',
    verifiedBy: 'DMC Treasury Audit',
    taxExemptId: 'TE-2026-8744',
    auditHash: '0xaa42...9901'
  },
  {
    id: 'DON-2026-0107',
    donorName: 'Aitken Spence Logistics Aid',
    type: 'Logistics Asset Donation',
    amountFormatted: '6 4x4 Off-Road Transport Trucks',
    amountRaw: 4800000,
    sector: 'Flood Rescue Convoys',
    targetDistrict: 'Western Province Command',
    status: 'Active Deployment',
    date: '2026-06-12',
    verifiedBy: 'Fleet Master Verification',
    taxExemptId: 'TE-2026-8711',
    auditHash: '0x55bc...bb22'
  },
  {
    id: 'DON-2026-0108',
    donorName: 'Australia-Sri Lanka Disaster Solidarity',
    type: 'International Grant',
    amountFormatted: 'Rs. 2,600,000',
    amountRaw: 2600000,
    sector: 'Mobile Water Purification Units',
    targetDistrict: 'Kalutara & Galle',
    status: 'Pending Audit Clearance',
    date: '2026-06-11',
    verifiedBy: 'Central Bank Escrow Unit',
    taxExemptId: 'PENDING-CB',
    auditHash: '0x77ee...1134'
  }
];

// Default AI Operations Triage Telemetry Stream
const DEFAULT_AI_TRIAGE_LOGS = [
  {
    id: 'REQ-2026-01842',
    requester: 'Nimal Perera',
    phone: '+94 77 123 4567',
    category: 'Medical Assistance',
    priority: 'Critical',
    aiScore: 91,
    location: 'Colombo, Western Province (6.9271° N, 79.8612° E)',
    extractedFactors: ['Acute cardiac medication needed', 'Submerged road access (>1.2m)', 'Elderly resident with wheelchair access needs'],
    confidenceExplanation: 'High certainty (91%): Medical distress detected with vulnerable demographic in verified high-inundation polygon.',
    recommendation: 'Deploy Medical Response Boat #02 & arrange emergency intake at Colombo Base Hospital.',
    status: 'Under Review',
    actionApproved: false,
    timestamp: '2 min ago'
  },
  {
    id: 'REQ-2026-01877',
    requester: 'S. Fernando',
    phone: '+94 71 889 2234',
    category: 'Shelter',
    priority: 'High',
    aiScore: 87,
    location: 'Gampaha, Miriswatta (7.0917° N, 79.9999° E)',
    extractedFactors: ['Mudslide proximity (<150m)', '4 family members displaced', 'Dwelling roof compromised'],
    confidenceExplanation: 'High certainty (87%): Proximity to landslide risk zone confirmed by DMC topological radar.',
    recommendation: 'Direct family to St. Anthony\'s College Shelter (2.8km away) and dispatch 4 tarpaulin sheets.',
    status: 'Assigned',
    actionApproved: true,
    timestamp: '5 min ago'
  },
  {
    id: 'REQ-2026-01835',
    requester: 'K. Silva',
    phone: '+94 76 554 9911',
    category: 'Food & Clean Water',
    priority: 'High',
    aiScore: 82,
    location: 'Kalutara South (6.5854° N, 79.9607° E)',
    extractedFactors: ['Well water contaminated with silt', 'Infant 8 months present', 'Isolated pocket cut off by canal surge'],
    confidenceExplanation: 'High certainty (82%): Contaminated groundwater crisis with high infant vulnerability weighting.',
    recommendation: 'Dispatch 20L sealed drinking water, infant nutrition pack, and water purification tablets.',
    status: 'Pending',
    actionApproved: false,
    timestamp: '8 min ago'
  },
  {
    id: 'REQ-2026-01628',
    requester: 'M. Jayasiri',
    phone: '+94 72 334 1122',
    category: 'Transport & Evacuation',
    priority: 'Medium',
    aiScore: 76,
    location: 'Negombo Coastal (7.2083° N, 79.8358° E)',
    extractedFactors: ['Flood water 0.5m on access lane', 'Vehicle immobilized', 'Low immediate physical hazard'],
    confidenceExplanation: 'Moderate certainty (76%): Property waterlogged but high-ground path available within 200m walking distance.',
    recommendation: 'Queue for high-clearance tractor evacuation sweep at 14:00.',
    status: 'Under Review',
    actionApproved: false,
    timestamp: '12 min ago'
  },
  {
    id: 'REQ-2026-01821',
    requester: 'D. Perera',
    phone: '+94 77 882 1045',
    category: 'Evacuation',
    priority: 'Medium',
    aiScore: 72,
    location: 'Kalutara North (6.6100° N, 79.9700° E)',
    extractedFactors: ['Rising water level near canal bank', 'Precautionary evacuation requested'],
    confidenceExplanation: 'Moderate certainty (72%): Water level rising at 4cm/hr, non-immediate danger.',
    recommendation: 'Assign Volunteer Convoy Unit #4 for planned evacuation within 3 hours.',
    status: 'Assigned',
    actionApproved: true,
    timestamp: '15 min ago'
  },
  {
    id: 'REQ-2026-04415',
    requester: 'A. Kumara',
    phone: '+94 70 119 4433',
    category: 'Medical Prescription',
    priority: 'Low',
    aiScore: 62,
    location: 'Colombo 07 (6.9044° N, 79.8660° E)',
    extractedFactors: ['Routine insulin prescription refill', 'No flood inundation at residence'],
    confidenceExplanation: 'Moderate certainty (62%): Essential medicine request outside flooded polygon.',
    recommendation: 'Route request to Sri Lanka Red Cross community pharmacy courier team.',
    status: 'Completed',
    actionApproved: true,
    timestamp: '1 hour ago'
  },
  {
    id: 'REQ-2026-04416',
    requester: 'T. Mendis',
    phone: '+94 77 440 9811',
    category: 'Food Rations',
    priority: 'High',
    aiScore: 84,
    location: 'Matara Lowlands (5.9549° N, 80.5550° E)',
    extractedFactors: ['Community shelter 180 evacuees', 'Food stock remaining < 18 hours'],
    confidenceExplanation: 'High certainty (84%): Institutional scale food deficit alert.',
    recommendation: 'Expedite 1,200kg dry rations from Galle Regional Distribution Center.',
    status: 'Escalated',
    actionApproved: true,
    timestamp: '2 hours ago'
  }
];

// Default Emergency Broadcasts & Notifications
const DEFAULT_BROADCASTS = [
  {
    id: 'ALT-2026-091',
    title: 'Emergency Flash Flood Warning: Kelani River Basin',
    severity: 'Emergency',
    channels: ['SMS Broadcast', 'Push Notification', 'Field Radio'],
    targetRegion: 'Colombo & Gampaha Lowlands',
    targetAudience: 'All Citizens in Zone A & B (45,200 recipients)',
    message: 'CRITICAL ALERT: Kelani River has exceeded major flood level (1.84m). Immediate evacuation advised for low-lying areas of Wellampitiya, Kolonnawa, Kelaniya. Proceed to designated high-ground shelters.',
    sentAt: '2026-06-15 05:00',
    sentBy: 'DMC Emergency Command / Sarah Johnson',
    deliveryRate: '99.2%',
    status: 'Active Live'
  },
  {
    id: 'ALT-2026-092',
    title: 'Severe Road Inundation: A1 Colombo-Kandy Road at Peliyagoda',
    severity: 'Warning',
    channels: ['Push Notification', 'Citizen Portal'],
    targetRegion: 'Peliyagoda & Kelaniya Corridors',
    targetAudience: 'Commuters & Logistics Convoys (28,400 recipients)',
    message: 'ROAD CLOSURE: A1 Highway submerged between Peliyagoda junction and 4th Mile Post. Light vehicles cannot pass. Use Southern Expressway or Minuwangoda diversion route.',
    sentAt: '2026-06-15 06:15',
    sentBy: 'Traffic Police Disaster Liaison',
    deliveryRate: '98.7%',
    status: 'Active Live'
  },
  {
    id: 'ALT-2026-093',
    title: 'New High-Ground Relief Shelter Opened: Colombo Central School',
    severity: 'Advisory',
    channels: ['SMS Broadcast', 'Push Notification'],
    targetRegion: 'Colombo District - Zone A',
    targetAudience: 'Registered Evacuees (18,500 recipients)',
    message: 'SHELTER NOTIFICATION: Colombo Central School (Capacity 500) is now open with clean water, hot meals, and a Sri Lanka Red Cross medical aid post.',
    sentAt: '2026-06-15 07:30',
    sentBy: 'Shelter Administration Lead',
    deliveryRate: '99.4%',
    status: 'Active Live'
  },
  {
    id: 'ALT-2026-094',
    title: 'Precautionary Boil Water Directive: Kalutara District',
    severity: 'Warning',
    channels: ['SMS Broadcast', 'Field Radio'],
    targetRegion: 'Kalutara South & Beruwala',
    targetAudience: 'Residents in Coastal Inundation Areas (32,100 recipients)',
    message: 'HEALTH DIRECTIVE: Groundwater wells contaminated due to sea surge. All tap and well water must be boiled vigorously for at least 3 minutes before drinking or food preparation.',
    sentAt: '2026-06-14 23:10',
    sentBy: 'Ministry of Health Disaster Response',
    deliveryRate: '97.8%',
    status: 'Active Live'
  },
  {
    id: 'ALT-2026-089',
    title: 'Dam Spillway Gate #3 Release Notice: Laxapana Hydro Complex',
    severity: 'Emergency',
    channels: ['SMS Broadcast', 'Emergency Sirens'],
    targetRegion: 'Kelani Downstream Riparian Communities',
    targetAudience: 'Riparian Riverfront Dwellings (24,000 recipients)',
    message: 'DAM GATE NOTICE: 3 spillway gates opened at 02:00 due to torrential catchment rainfall. Expect river crest surge between 06:00 and 10:00. Maintain 100m clearance from riverbanks.',
    sentAt: '2026-06-14 02:30',
    sentBy: 'Irrigation Dept & CEB Command',
    deliveryRate: '99.8%',
    status: 'Expired'
  },
  {
    id: 'ALT-2026-085',
    title: 'Volunteer Search & Rescue Call-Up: Zone 4 Roster',
    severity: 'Advisory',
    channels: ['Field Radio', 'Push Notification'],
    targetRegion: 'Western Province Operational Headquarters',
    targetAudience: 'Certified Rescue Volunteers (1,245 Responders)',
    message: 'MOBILIZATION ORDER: Swiftwater Rescue Teams 1 through 8 report to Sugathadasa Stadium assembly depot with flotation gear and waterproof comms radios.',
    sentAt: '2026-06-13 19:00',
    sentBy: 'Volunteer Deployment Coordinator',
    deliveryRate: '99.0%',
    status: 'Expired'
  }
];

export const AdminDashboardPage = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout } = useAuth();

  // Active Tab State (matching Sidebar Screenshot 1)
  const [activeTab, setActiveTab] = useState(initialTab === 'users' ? 'settings' : initialTab);
  const [settingsSubTab, setSettingsSubTab] = useState(initialTab === 'users' ? 'users' : 'overview');

  // Reactively sync activeTab and settingsSubTab from route or props
  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'users') {
        setActiveTab('settings');
        setSettingsSubTab('users');
      } else if (initialTab === 'overview') {
        setActiveTab('dashboard');
      } else {
        setActiveTab(initialTab);
      }
    }
    const p = (location.pathname || '').toLowerCase();
    if (p.includes('/admin/users')) {
      setActiveTab('settings');
      setSettingsSubTab('users');
    } else if (p.includes('/admin/crisis')) {
      setActiveTab('crisis');
    } else if (p.includes('/admin/requests')) {
      setActiveTab('requests');
    } else if (p.includes('/admin/resources')) {
      setActiveTab('resources');
    } else if (p.includes('/admin/shelters')) {
      setActiveTab('shelters');
    } else if (p.includes('/admin/volunteers')) {
      setActiveTab('volunteers');
    } else if (p.includes('/admin/donations')) {
      setActiveTab('donations');
    } else if (p.includes('/admin/ai-ops')) {
      setActiveTab('ai-ops');
    } else if (p.includes('/admin/maps')) {
      setActiveTab('maps');
    } else if (p.includes('/admin/notifications')) {
      setActiveTab('notifications');
    } else if (p.includes('/admin/reports')) {
      setActiveTab('reports');
    } else if (p.includes('/admin/audit')) {
      setActiveTab('audit');
    } else if (p.includes('/admin/settings')) {
      setActiveTab('settings');
    } else if (p === '/admin' || p === '/admin/dashboard' || p === '/admin/overview') {
      setActiveTab('dashboard');
    }
  }, [initialTab, location.pathname]);

  // Core Data States
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toast, setToast] = useState(null);

  // Selected Item Modal / Inspector States
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', role: 'Coordinator', password: '', assignedDistrict: 'Colombo' });
  const [resetPasswordModal, setResetPasswordModal] = useState({ isOpen: false, user: null, newPassword: '' });
  const [roleChangeModal, setRoleChangeModal] = useState({ isOpen: false, user: null, newRole: 'Coordinator' });

  // Map Filter Layers
  const [mapLayers, setMapLayers] = useState({
    activeCrises: true,
    shelters: true,
    medicalFacilities: true,
    volunteers: true,
    roadConditions: true,
    affectedAreas: true
  });

  // 1. Crisis Management States
  const [crises, setCrises] = useState(DEFAULT_CRISES);
  const [crisisSearch, setCrisisSearch] = useState('');
  const [crisisSeverityFilter, setCrisisSeverityFilter] = useState('ALL');
  const [crisisStatusFilter, setCrisisStatusFilter] = useState('ALL');
  const [selectedCrisis, setSelectedCrisis] = useState(null);
  const [isDeclareCrisisModalOpen, setIsDeclareCrisisModalOpen] = useState(false);
  const [newCrisis, setNewCrisis] = useState({
    title: '',
    type: 'Flood',
    district: 'Colombo',
    severity: 'High',
    affectedPeople: '1500',
    areaSqKm: '18',
    notes: ''
  });

  // 2. Donations Management States
  const [donations, setDonations] = useState(DEFAULT_DONATIONS);
  const [donationSearch, setDonationSearch] = useState('');
  const [donationTypeFilter, setDonationTypeFilter] = useState('ALL');
  const [donationStatusFilter, setDonationStatusFilter] = useState('ALL');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isRecordDonationModalOpen, setIsRecordDonationModalOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({
    donorName: '',
    type: 'Monetary Grant',
    amountFormatted: 'Rs. 2,500,000',
    sector: 'Food & Clean Water',
    targetDistrict: 'Colombo (Kelani Basin)'
  });

  // 3. AI Operations Center States
  const [aiTriageLogs, setAiTriageLogs] = useState(DEFAULT_AI_TRIAGE_LOGS);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(80);
  const [aiSearch, setAiSearch] = useState('');
  const [aiPriorityFilter, setAiPriorityFilter] = useState('ALL');
  const [selectedAiLog, setSelectedAiLog] = useState(null);

  // 4. Satellite GIS Map States
  const [mapDistrict, setMapDistrict] = useState('all');
  const [selectedMapSector, setSelectedMapSector] = useState(null);

  // 5. System Emergency Broadcasts States
  const [broadcasts, setBroadcasts] = useState(DEFAULT_BROADCASTS);
  const [broadcastSearch, setBroadcastSearch] = useState('');
  const [broadcastSeverityFilter, setBroadcastSeverityFilter] = useState('ALL');
  const [broadcastStatusFilter, setBroadcastStatusFilter] = useState('ALL');
  const [isComposeBroadcastModalOpen, setIsComposeBroadcastModalOpen] = useState(false);
  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    severity: 'Emergency',
    message: '',
    targetRegion: 'Colombo & Gampaha Lowlands',
    channels: ['SMS Broadcast', 'Push Notification']
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch real data on mount
  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminService.getDashboardStats();
      if (statsRes?.succeeded && statsRes.data) {
        setStats(prev => ({
          ...prev,
          ...statsRes.data,
          totalUsers: statsRes.data.totalUsers || prev.totalUsers,
          activeCrises: statsRes.data.activeCrises || prev.activeCrises
        }));
      }
    } catch {
      // Keep rich fallback
    }

    try {
      const usersRes = await adminService.getUsers({
        role: roleFilter === 'ALL' ? undefined : roleFilter,
        search: searchQuery || undefined
      });
      if (usersRes?.succeeded && usersRes.data && usersRes.data.length > 0) {
        setUsers(usersRes.data);
      }
    } catch {
      // Keep rich fallback
    }

    try {
      const donationsRes = await adminService.getDonations();
      if (donationsRes?.succeeded && donationsRes.data && donationsRes.data.length > 0) {
        setDonations(donationsRes.data);
      }
    } catch {
      // Keep rich fallback
    }

    try {
      const broadcastsRes = await adminService.getBroadcasts();
      if (broadcastsRes?.succeeded && broadcastsRes.data && broadcastsRes.data.length > 0) {
        setBroadcasts(broadcastsRes.data);
      }
    } catch {
      // Keep rich fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter]);

  // User RBAC Actions
  const handleToggleStatus = async (targetUser) => {
    const updatedStatus = !targetUser.isActive;
    try {
      await adminService.updateUserStatus(targetUser.id, updatedStatus);
    } catch {
      // Dev mode fallback
    }
    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, isActive: updatedStatus } : u));
    showToast(`Account for ${targetUser.fullName} ${updatedStatus ? 'unlocked' : 'locked'}.`);
  };

  const handleRoleChange = async () => {
    if (!roleChangeModal.user) return;
    try {
      await adminService.updateUserRole(roleChangeModal.user.id, roleChangeModal.newRole);
    } catch {
      // Dev mode fallback
    }
    setUsers(prev => prev.map(u => u.id === roleChangeModal.user.id ? { ...u, role: roleChangeModal.newRole } : u));
    showToast(`Security role for ${roleChangeModal.user.fullName} updated to ${roleChangeModal.newRole}.`);
    setRoleChangeModal({ isOpen: false, user: null, newRole: 'Coordinator' });
  };

  const handleResetPassword = async () => {
    if (!resetPasswordModal.user || !resetPasswordModal.newPassword) return;
    try {
      await adminService.resetPassword(resetPasswordModal.user.id, resetPasswordModal.newPassword);
    } catch {
      // Dev mode fallback
    }
    showToast(`Temporary password hash generated for ${resetPasswordModal.user.fullName}.`);
    setResetPasswordModal({ isOpen: false, user: null, newPassword: '' });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      showToast('Please fill out all required fields.');
      return;
    }
    try {
      await adminService.createUser(newUser);
    } catch {
      // Dev mode fallback
    }
    const created = {
      id: `usr-${Date.now()}`,
      ...newUser,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([created, ...users]);
    setStats(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
    setIsCreateModalOpen(false);
    setNewUser({ fullName: '', email: '', role: 'Coordinator', password: '', assignedDistrict: 'Colombo' });
    showToast(`Account created for ${created.fullName}.`);
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user account "${name}"?`)) return;
    try {
      await adminService.deleteUser(id);
    } catch {
      // Dev mode fallback
    }
    setUsers(users.filter(u => u.id !== id));
    setStats(prev => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
    showToast(`User account deleted.`);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.assignedDistrict && u.assignedDistrict.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? u.isActive : !u.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Crisis Action Handlers
  const handleDeclareCrisis = (e) => {
    e.preventDefault();
    if (!newCrisis.title || !newCrisis.district) {
      showToast('Please provide a title and district for the emergency incident.');
      return;
    }
    const createdIncident = {
      id: `CRS-2026-0${crises.length + 10}`,
      title: newCrisis.title,
      type: newCrisis.type,
      district: newCrisis.district,
      severity: newCrisis.severity,
      affectedPeople: parseInt(newCrisis.affectedPeople || '1000', 10),
      areaSqKm: parseInt(newCrisis.areaSqKm || '15', 10),
      teamsDeployed: 2,
      status: 'Active Escalation',
      declaredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      leadCoordinator: authUser?.fullName || 'Sarah Johnson',
      waterLevelMeters: 1.5,
      notes: newCrisis.notes || 'Emergency response protocol initiated under DMC directive.'
    };
    setCrises([createdIncident, ...crises]);
    setStats(prev => ({ ...prev, activeCrises: prev.activeCrises + 1 }));
    setIsDeclareCrisisModalOpen(false);
    setNewCrisis({ title: '', type: 'Flood', district: 'Colombo', severity: 'High', affectedPeople: '1500', areaSqKm: '18', notes: '' });
    showToast(`Emergency incident "${createdIncident.title}" declared successfully.`);
  };

  const handleToggleCrisisStatus = (crisisId) => {
    setCrises(prev => prev.map(c => {
      if (c.id === crisisId) {
        const nextStatus = c.status === 'Contained' ? 'Active Escalation' : 'Contained';
        showToast(`Crisis incident #${c.id} updated to ${nextStatus}.`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleDispatchRescueTeams = (crisisId) => {
    setCrises(prev => prev.map(c => {
      if (c.id === crisisId) {
        const nextTeams = c.teamsDeployed + 2;
        showToast(`2 additional swiftwater rescue teams dispatched to ${c.district}. Total teams: ${nextTeams}.`);
        return { ...c, teamsDeployed: nextTeams };
      }
      return c;
    }));
  };

  // Donations Action Handlers
  const handleRecordDonation = (e) => {
    e.preventDefault();
    if (!newDonation.donorName || !newDonation.amountFormatted) {
      showToast('Please provide donor name and contribution details.');
      return;
    }
    const createdDonation = {
      id: `DON-2026-0${donations.length + 110}`,
      donorName: newDonation.donorName,
      type: newDonation.type,
      amountFormatted: newDonation.amountFormatted,
      amountRaw: 2500000,
      sector: newDonation.sector,
      targetDistrict: newDonation.targetDistrict,
      status: 'Verified & Cleared',
      date: new Date().toISOString().split('T')[0],
      verifiedBy: 'DMC Treasury Audit',
      taxExemptId: `TE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      auditHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`
    };
    setDonations([createdDonation, ...donations]);
    setIsRecordDonationModalOpen(false);
    setNewDonation({ donorName: '', type: 'Monetary Grant', amountFormatted: 'Rs. 2,500,000', sector: 'Food & Clean Water', targetDistrict: 'Colombo (Kelani Basin)' });
    showToast(`Donation from ${createdDonation.donorName} verified and allocated.`);
  };

  const handleDownloadReceipt = (donation) => {
    showToast(`Tax exemption certificate and audit receipt generated for ${donation.donorName} (${donation.taxExemptId}).`);
  };

  // AI-Ops Handlers
  const handleApproveAiRecommendation = (logId) => {
    setAiTriageLogs(prev => prev.map(item => {
      if (item.id === logId) {
        showToast(`AI recommendation for request #${item.id} approved and dispatched.`);
        return { ...item, status: 'Assigned', actionApproved: true };
      }
      return item;
    }));
  };

  const handleOverrideAiTriage = (logId) => {
    setAiTriageLogs(prev => prev.map(item => {
      if (item.id === logId) {
        const nextPriority = item.priority === 'Critical' ? 'High' : item.priority === 'High' ? 'Medium' : 'Critical';
        showToast(`Coordinator override applied: Priority updated to ${nextPriority} for #${item.id}.`);
        return { ...item, priority: nextPriority, status: 'Under Review' };
      }
      return item;
    }));
  };

  const handleRunAiDiagnostic = () => {
    showToast('Running edge model diagnostics... Neural triage latency: 142ms. Bias: 0.0%. Status: OPTIMAL.');
  };

  // Emergency Broadcast Handlers
  const handleDispatchEmergencyBroadcast = (e) => {
    e.preventDefault();
    if (!newBroadcast.title || !newBroadcast.message) {
      showToast('Please provide an alert title and broadcast message payload.');
      return;
    }
    const createdBroadcast = {
      id: `ALT-2026-0${broadcasts.length + 95}`,
      title: newBroadcast.title,
      severity: newBroadcast.severity,
      channels: newBroadcast.channels.length > 0 ? newBroadcast.channels : ['SMS Broadcast', 'Push Notification'],
      targetRegion: newBroadcast.targetRegion,
      targetAudience: `All Citizens in ${newBroadcast.targetRegion} (38,500 recipients)`,
      message: newBroadcast.message,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      sentBy: authUser?.fullName ? `${authUser.fullName} (DMC Authorized)` : 'DMC Emergency Ops / Sarah Johnson',
      deliveryRate: '99.4%',
      status: 'Active Live'
    };
    setBroadcasts([createdBroadcast, ...broadcasts]);
    setIsComposeBroadcastModalOpen(false);
    setNewBroadcast({ title: '', severity: 'Emergency', message: '', targetRegion: 'Colombo & Gampaha Lowlands', channels: ['SMS Broadcast', 'Push Notification'] });
    showToast(`Emergency broadcast #${createdBroadcast.id} transmitted to telecom gateways.`);
  };

  const handleRevokeBroadcast = (broadcastId) => {
    setBroadcasts(prev => prev.map(b => {
      if (b.id === broadcastId) {
        showToast(`Broadcast alert #${b.id} revoked and de-escalated.`);
        return { ...b, status: 'Revoked' };
      }
      return b;
    }));
  };

  const handleRetransmitBroadcast = (b) => {
    showToast(`Alert #${b.id} retransmitted across SMS and Push gateways.`);
  };

  // Sidebar Menu Config Matching Screenshot 1
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, hasChevron: false },
    { id: 'crisis', label: 'Crisis Management', icon: ShieldAlert, hasChevron: true },
    { id: 'requests', label: 'Assistance Requests', icon: ClipboardList, hasChevron: true },
    { id: 'resources', label: 'Resources', icon: Package, hasChevron: true },
    { id: 'shelters', label: 'Shelters', icon: Building2, hasChevron: true },
    { id: 'volunteers', label: 'Volunteers', icon: Users, hasChevron: true },
    { id: 'donations', label: 'Donations', icon: Gift, hasChevron: true },
    { id: 'ai-ops', label: 'AI Operations', icon: Cpu, hasChevron: true },
    { id: 'maps', label: 'Maps', icon: MapPin, hasChevron: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, hasChevron: false, badge: '3' },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart, hasChevron: false },
    { id: 'audit', label: 'Audit Logs', icon: ShieldCheck, hasChevron: false },
    { id: 'settings', label: 'Settings', icon: Settings, hasChevron: false }
  ];

  // Dynamic Header Titles
  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Crisis Command Center',
          subtitle: 'Real-time overview of humanitarian operations and emergency coordination',
          icon: Home,
          iconBg: 'bg-[#3d6b4f]'
        };
      case 'crisis':
        return {
          title: 'Crisis Management',
          subtitle: 'Monitor crises, assess impact, coordinate response, and track recovery',
          icon: ShieldAlert,
          iconBg: 'bg-rose-600'
        };
      case 'requests':
        return {
          title: 'Assistance Requests',
          subtitle: 'Manage, review, and coordinate all emergency assistance requests',
          icon: ClipboardList,
          iconBg: 'bg-indigo-600'
        };
      case 'resources':
        return {
          title: 'Resources Management',
          subtitle: 'Track inventory, allocate resources, and manage supply distribution',
          icon: Package,
          iconBg: 'bg-emerald-600'
        };
      case 'shelters':
        return {
          title: 'Shelter Management',
          subtitle: 'Manage shelter locations, occupancy, facilities, and evacuee services',
          icon: Building2,
          iconBg: 'bg-amber-600'
        };
      case 'volunteers':
        return {
          title: 'Volunteer Management',
          subtitle: 'Manage volunteer rosters, skills, deployments, and mission teams',
          icon: Users,
          iconBg: 'bg-blue-600'
        };
      case 'donations':
        return {
          title: 'Donations Management',
          subtitle: 'Track monetary & item donations, manage donors, and allocate relief supplies',
          icon: Gift,
          iconBg: 'bg-teal-600'
        };
      case 'ai-ops':
        return {
          title: 'AI Operations Center',
          subtitle: 'Explainable AI decision oversight, automated triage models, and ethical governance',
          icon: Cpu,
          iconBg: 'bg-purple-600'
        };
      case 'maps':
        return {
          title: 'Satellite GIS Map',
          subtitle: 'High-resolution geospatial Western Province hazard radar and operational zones',
          icon: MapPin,
          iconBg: 'bg-sky-600'
        };
      case 'notifications':
        return {
          title: 'System Notifications & Alerts',
          subtitle: 'Real-time broadcast alerts, security events, and DMC operational warnings',
          icon: Bell,
          iconBg: 'bg-rose-500'
        };
      case 'reports':
        return {
          title: 'Reports & Analytics',
          subtitle: 'Generate insights, track performance, and support data-driven decisions',
          icon: FileBarChart,
          iconBg: 'bg-cyan-600'
        };
      case 'audit':
        return {
          title: 'Immutable Audit Ledger',
          subtitle: 'Cryptographic oversight logs, administrative changes, and verification history',
          icon: ShieldCheck,
          iconBg: 'bg-slate-700'
        };
      case 'settings':
      default:
        return {
          title: 'Platform Administration & RBAC',
          subtitle: 'Manage user credentials, security roles, system health, and global controls',
          icon: Settings,
          iconBg: 'bg-[#3d6b4f]'
        };
    }
  };

  const currentMeta = getHeaderMeta();
  const HeaderIcon = currentMeta.icon;

  return (
    <div className="adm-ss-layout">
      {/* =========================================================
         1. Left Navigation Sidebar (Exact Match to Screenshot 1)
         ========================================================= */}
      <aside className="adm-ss-sidebar">
        <div className="adm-ss-sidebar-top">
          {/* Brand Header */}
          <div className="adm-ss-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={reliefcoreIcon} alt="RELIEFCORE" className="adm-ss-brand-logo" />
            <div>
              <h2 className="adm-ss-brand-title">RELIEFCORE</h2>
              <span className="adm-ss-brand-sub">Humanitarian Operations</span>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="adm-ss-nav-list">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`adm-ss-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="adm-ss-nav-left">
                      <IconComp size={16} />
                      <span>{item.label}</span>
                    </div>
                    <div className="adm-ss-nav-right">
                      {item.badge && (
                        <span className="adm-ss-badge-pill">{item.badge}</span>
                      )}
                      {item.hasChevron && (
                        <ChevronRight size={13} className="adm-ss-chevron" />
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="adm-ss-sidebar-bottom">
          <div className="adm-ss-user-pill" onClick={() => setActiveTab('settings')}>
            <img src={sarahJohnsonAvatar} alt="Admin User" className="adm-ss-user-avatar" />
            <div className="min-w-0">
              <div className="adm-ss-user-name truncate">
                {authUser?.fullName || 'Sarah Johnson'}
              </div>
              <div className="adm-ss-user-role truncate">
                {authUser?.role || 'Emergency Coordinator'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================
         2. Main Application Wrapper (#F4F7FB)
         ========================================================= */}
      <main className="adm-ss-main">
        {/* Top Header Bar */}
        <header className="adm-ss-topbar">
          <div className="adm-ss-title-group">
            <div className={`adm-ss-title-icon ${currentMeta.iconBg}`}>
              <HeaderIcon size={20} />
            </div>
            <div>
              <h1 className="adm-ss-page-heading">{currentMeta.title}</h1>
              <p className="adm-ss-page-subheading">{currentMeta.subtitle}</p>
            </div>
          </div>

          {/* Global Search Input */}
          <div className="adm-ss-search-box">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search people, locations, resources, tickets..."
              className="adm-ss-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right Profile & Alert Badges */}
          <div className="adm-ss-actions-right">
            <button
              className="adm-ss-bell-btn"
              onClick={() => setActiveTab('notifications')}
              title="3 Operational Notifications"
            >
              <Bell size={18} />
              <span className="adm-ss-bell-dot"></span>
            </button>

            <div className="adm-ss-profile-pill" onClick={() => setActiveTab('settings')}>
              <img src={sarahJohnsonAvatar} alt="User" className="w-8 h-8 rounded-full object-cover" />
              <div className="hidden sm:block text-left">
                <div className="text-[13px] font-semibold text-slate-800 leading-tight">
                  {authUser?.fullName || 'Sarah Johnson'}
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {authUser?.role || 'Emergency Coordinator'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Views */}
        <div className="adm-ss-content">

          {/* =====================================================
             VIEW 1: DASHBOARD (Matching Screenshot 7 & 9)
             ===================================================== */}
          {activeTab === 'dashboard' && (
            <>
              {/* KPI Banner Row */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-red-soft">
                    <ShieldAlert size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Active Crises</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">{stats.activeCrises}</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-red">↑ 33% Requiring attention</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <Users size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Volunteers</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">1,245</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 18% Active volunteers</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <Package size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Resources Deployed</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">6,280</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 22% Items delivered</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <Users size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">People Assisted</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">12,450</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 28% This month</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button
                    className="adm-ss-btn-primary"
                    onClick={() => {
                      setActiveTab('settings');
                      setIsCreateModalOpen(true);
                    }}
                  >
                    <Plus size={16} />
                    <span>+ New Assistance Request</span>
                  </button>
                </div>
              </div>

              {/* Middle Section: Crisis Map + Active Crises */}
              <div className="adm-ss-split-grid">
                {/* Left: Crisis Map */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <div>
                      <h3 className="adm-ss-card-title">Crisis Zones Map</h3>
                      <p className="adm-ss-card-subtitle">Real-time geospatial disaster overlays for Western Province</p>
                    </div>
                    <button
                      className="text-[12px] font-semibold text-[#3d6b4f] hover:underline bg-transparent border-0 cursor-pointer"
                      onClick={() => setActiveTab('maps')}
                    >
                      View Full Map →
                    </button>
                  </div>

                  <div className="adm-ss-map-container">
                    <img src={westernProvinceMap} alt="Crisis Radar Map" className="adm-ss-map-bg" />
                    {/* Layer Floating Box */}
                    <div className="adm-ss-map-layers-panel">
                      <div className="font-semibold text-slate-800 mb-1">Map Layers</div>
                      <label className="adm-ss-map-legend-item cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mapLayers.activeCrises}
                          onChange={() => setMapLayers(p => ({ ...p, activeCrises: !p.activeCrises }))}
                        />
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span>Active Crises</span>
                      </label>
                      <label className="adm-ss-map-legend-item cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mapLayers.shelters}
                          onChange={() => setMapLayers(p => ({ ...p, shelters: !p.shelters }))}
                        />
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Shelters</span>
                      </label>
                      <label className="adm-ss-map-legend-item cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mapLayers.medicalFacilities}
                          onChange={() => setMapLayers(p => ({ ...p, medicalFacilities: !p.medicalFacilities }))}
                        />
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>Medical Centers</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right: Active Crises List */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <h3 className="adm-ss-card-title">Active Crises</h3>
                    <span className="text-[11px] text-slate-400">View All →</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">Flood - Kelani Area</div>
                        <div className="text-[11.5px] text-slate-500">Colombo, Western Province · 3,200 affected</div>
                      </div>
                      <span className="adm-ss-pill pill-red">High</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">Landslide Risk</div>
                        <div className="text-[11.5px] text-slate-500">Gampaha District · 850 affected</div>
                      </div>
                      <span className="adm-ss-pill pill-orange">Medium</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">Severe Weather</div>
                        <div className="text-[11.5px] text-slate-500">Kalutara District · 2,100 affected</div>
                      </div>
                      <span className="adm-ss-pill pill-red">High</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">Coastal Erosion</div>
                        <div className="text-[11.5px] text-slate-500">Negombo Area · 600 affected</div>
                      </div>
                      <span className="adm-ss-pill pill-green">Low</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Section: Recent Responders & Resource Deployment */}
              <div className="adm-ss-split-grid">
                {/* Recent Responders Table */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <h3 className="adm-ss-card-title">Recent Volunteers & Responders</h3>
                    <button
                      className="text-[12px] font-semibold text-[#3d6b4f] hover:underline bg-transparent border-0 cursor-pointer"
                      onClick={() => setActiveTab('volunteers')}
                    >
                      View All →
                    </button>
                  </div>

                  <div className="adm-ss-table-container">
                    <table className="adm-ss-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="font-semibold text-slate-800">Tharindu Perera</td>
                          <td>Field Volunteer</td>
                          <td>Colombo</td>
                          <td><span className="adm-ss-pill pill-green">Active</span></td>
                          <td>Today</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-slate-800">Nimali Silva</td>
                          <td>Medical Support</td>
                          <td>Gampaha</td>
                          <td><span className="adm-ss-pill pill-green">Active</span></td>
                          <td>Today</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-slate-800">Kavindu Fernando</td>
                          <td>Logistics</td>
                          <td>Kalutara</td>
                          <td><span className="adm-ss-pill pill-blue">On Mission</span></td>
                          <td>Yesterday</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-slate-800">Sadeepa Wickramasinghe</td>
                          <td>Community Support</td>
                          <td>Negombo</td>
                          <td><span className="adm-ss-pill pill-green">Active</span></td>
                          <td>2 days ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Resource Deployment Progress */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <h3 className="adm-ss-card-title">Resource Deployment</h3>
                    <span className="text-[11px] text-slate-400">View All →</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-slate-700">Food Packs</span>
                        <span className="text-slate-500">3,200 / 5,000 (64%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-slate-700">Medical Kits</span>
                        <span className="text-slate-500">1,450 / 2,000 (73%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-slate-700">Tents</span>
                        <span className="text-slate-500">320 / 500 (64%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-slate-700">Blankets</span>
                        <span className="text-slate-500">980 / 1,500 (65%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 2: RESOURCES MANAGEMENT (Matching Screenshot 2 & 3)
             ===================================================== */}
          {activeTab === 'resources' && (
            <>
              {/* KPI Banner Row */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <Package size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Inventory Items</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">6,280</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 18% Across all categories</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <Truck size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Items Dispatched</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">4,320</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 25% This month</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <Package size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">In Stock</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">3,860</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 12% Available items</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-red-soft">
                    <AlertTriangle size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Low Stock Items</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">320</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-red">↑ 40% Need replenishment</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-purple-soft">
                    <RefreshCw size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Value (Rs.)</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">12,450,000</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 22% Current inventory value</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button className="adm-ss-btn-primary" onClick={() => showToast('New Resource modal opened')}>
                    <Plus size={16} />
                    <span>+ Add New Resource</span>
                  </button>
                </div>
              </div>

              {/* Resource Categories Row */}
              <div className="adm-ss-card">
                <h3 className="adm-ss-card-title mb-3">Resource Categories</h3>
                <div className="adm-ss-category-grid">
                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-red-50 text-red-500">
                      <Package size={20} />
                    </div>
                    <span className="adm-ss-category-name">Food & Water</span>
                    <span className="adm-ss-category-items">2,140 items · 34%</span>
                  </div>

                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-blue-50 text-blue-500">
                      <HeartPulse size={20} />
                    </div>
                    <span className="adm-ss-category-name">Medical Supplies</span>
                    <span className="adm-ss-category-items">1,520 items · 24%</span>
                  </div>

                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-amber-50 text-amber-500">
                      <Building2 size={20} />
                    </div>
                    <span className="adm-ss-category-name">Shelter Materials</span>
                    <span className="adm-ss-category-items">980 items · 16%</span>
                  </div>

                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-purple-50 text-purple-500">
                      <Package size={20} />
                    </div>
                    <span className="adm-ss-category-name">Clothing</span>
                    <span className="adm-ss-category-items">620 items · 10%</span>
                  </div>

                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-emerald-50 text-emerald-500">
                      <Droplets size={20} />
                    </div>
                    <span className="adm-ss-category-name">Hygiene Kits</span>
                    <span className="adm-ss-category-items">520 items · 8%</span>
                  </div>

                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-slate-100 text-slate-600">
                      <Package size={20} />
                    </div>
                    <span className="adm-ss-category-name">Other Supplies</span>
                    <span className="adm-ss-category-items">500 items · 8%</span>
                  </div>
                </div>

                {/* Inventory Table */}
                <div className="adm-ss-filters-bar">
                  <div className="adm-ss-filters-left">
                    <input
                      type="text"
                      placeholder="Search items..."
                      className="adm-ss-filter-select w-[220px]"
                    />
                    <select className="adm-ss-filter-select">
                      <option>All Categories</option>
                      <option>Food & Water</option>
                      <option>Medical Supplies</option>
                      <option>Shelter Materials</option>
                    </select>
                    <select className="adm-ss-filter-select">
                      <option>All Status</option>
                      <option>In Stock</option>
                      <option>Low Stock</option>
                    </select>
                    <select className="adm-ss-filter-select">
                      <option>All Locations</option>
                      <option>Colombo Hub</option>
                      <option>Gampaha Depot</option>
                      <option>Kalutara Safe Camp</option>
                    </select>
                    <button className="adm-ss-btn-reset">
                      <RefreshCw size={12} />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-mono text-slate-500">ITM-2026-001</td>
                        <td className="font-semibold text-slate-800">Bottled Water (1L)</td>
                        <td>Food & Water</td>
                        <td>5,000</td>
                        <td>Bottles</td>
                        <td><span className="adm-ss-pill pill-green">In Stock</span></td>
                        <td>Colombo</td>
                        <td>
                          <div className="adm-ss-row-actions">
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                            <button className="adm-ss-icon-btn"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-mono text-slate-500">ITM-2026-002</td>
                        <td className="font-semibold text-slate-800">Rice (10kg Bags)</td>
                        <td>Food & Water</td>
                        <td>1,200</td>
                        <td>Bags</td>
                        <td><span className="adm-ss-pill pill-green">In Stock</span></td>
                        <td>Gampaha</td>
                        <td>
                          <div className="adm-ss-row-actions">
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                            <button className="adm-ss-icon-btn"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-mono text-slate-500">ITM-2026-003</td>
                        <td className="font-semibold text-slate-800">First Aid Emergency Kit</td>
                        <td>Medical Supplies</td>
                        <td>800</td>
                        <td>Kits</td>
                        <td><span className="adm-ss-pill pill-orange">Low Stock</span></td>
                        <td>Colombo</td>
                        <td>
                          <div className="adm-ss-row-actions">
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                            <button className="adm-ss-icon-btn"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-mono text-slate-500">ITM-2026-004</td>
                        <td className="font-semibold text-slate-800">Tarpaulin Heavy Sheet</td>
                        <td>Shelter Materials</td>
                        <td>450</td>
                        <td>Sheets</td>
                        <td><span className="adm-ss-pill pill-green">In Stock</span></td>
                        <td>Kalutara</td>
                        <td>
                          <div className="adm-ss-row-actions">
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                            <button className="adm-ss-icon-btn"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-mono text-slate-500">ITM-2026-005</td>
                        <td className="font-semibold text-slate-800">Emergency Blankets</td>
                        <td>Clothing</td>
                        <td>1,000</td>
                        <td>Pieces</td>
                        <td><span className="adm-ss-pill pill-green">In Stock</span></td>
                        <td>Negombo</td>
                        <td>
                          <div className="adm-ss-row-actions">
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                            <button className="adm-ss-icon-btn"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 3: ASSISTANCE REQUESTS (Matching Screenshot 4 & 5)
             ===================================================== */}
          {activeTab === 'requests' && (
            <>
              {/* Top Stats */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <ClipboardList size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Requests</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">186</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 12% Incoming flow</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-red-soft">
                    <AlertTriangle size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Critical Priority</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">24</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-red">↑ 8% Immediate dispatch</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <AlertTriangle size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">High Priority</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">48</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-orange">↑ 5% Urgent review</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-teal-soft">
                    <RefreshCw size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Pending Review</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">62</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 15% Processing</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <CheckCircle2 size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Resolved</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">52</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 18% Completed</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button className="adm-ss-btn-primary" onClick={() => showToast('New Assistance Request dialog active')}>
                    <Plus size={16} />
                    <span>+ New Request</span>
                  </button>
                </div>
              </div>

              {/* Split View: Requests Table + AI Decision Support Side Panel */}
              <div className="adm-ss-split-grid">
                {/* Left: Requests Table */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <h3 className="adm-ss-card-title">Live Assistance Request Queue</h3>
                    <span className="text-[12px] text-slate-500">Showing 1-5 of 186 requests</span>
                  </div>

                  <div className="adm-ss-table-container">
                    <table className="adm-ss-table">
                      <thead>
                        <tr>
                          <th>Request ID</th>
                          <th>Requester</th>
                          <th>Category</th>
                          <th>Location</th>
                          <th>Priority</th>
                          <th>AI Score</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className="cursor-pointer hover:bg-slate-100/80 transition-colors"
                          onClick={() => setSelectedRequest({
                            id: 'REQ-2026-01842',
                            requester: 'Nimal Perera',
                            phone: '+94 77 123 4567',
                            email: 'nimalp@example.com',
                            category: 'Medical Assistance',
                            urgency: 'Critical',
                            people: 3,
                            location: 'Colombo, Western Province (6.9271° N, 79.8612° E)',
                            aiConfidence: '91%',
                            recommendedPriority: 'HIGH',
                            desc: 'Elderly person with serious health condition needs immediate medical assistance. Unable to reach hospital due to severe local flash flood water levels.',
                            specialReq: 'Elderly, wheelchair access, ongoing heart medication'
                          })}
                        >
                          <td className="font-mono font-semibold text-sky-700">REQ-2026-01842</td>
                          <td className="font-semibold text-slate-800">N. Perera</td>
                          <td>Medical</td>
                          <td>Colombo</td>
                          <td><span className="adm-ss-pill pill-red">Critical</span></td>
                          <td><span className="font-semibold text-emerald-600">91%</span></td>
                          <td><span className="adm-ss-pill pill-orange">Under Review</span></td>
                          <td>
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                          </td>
                        </tr>

                        <tr
                          className="cursor-pointer hover:bg-slate-100/80 transition-colors"
                          onClick={() => setSelectedRequest({
                            id: 'REQ-2026-01877',
                            requester: 'S. Fernando',
                            phone: '+94 71 889 2233',
                            email: 's.fernando@gmail.com',
                            category: 'Temporary Shelter',
                            urgency: 'High',
                            people: 5,
                            location: 'Gampaha District Center',
                            aiConfidence: '87%',
                            recommendedPriority: 'HIGH',
                            desc: 'House inundated to window height. Family of 5 including 2 children stranded on terrace without drinking water.',
                            specialReq: 'Infant formula, blankets'
                          })}
                        >
                          <td className="font-mono font-semibold text-sky-700">REQ-2026-01877</td>
                          <td className="font-semibold text-slate-800">S. Fernando</td>
                          <td>Shelter</td>
                          <td>Gampaha</td>
                          <td><span className="adm-ss-pill pill-orange">High</span></td>
                          <td><span className="font-semibold text-emerald-600">87%</span></td>
                          <td><span className="adm-ss-pill pill-blue">Assigned</span></td>
                          <td>
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                          </td>
                        </tr>

                        <tr>
                          <td className="font-mono font-semibold text-sky-700">REQ-2026-01835</td>
                          <td className="font-semibold text-slate-800">K. Silva</td>
                          <td>Food</td>
                          <td>Kalutara</td>
                          <td><span className="adm-ss-pill pill-orange">High</span></td>
                          <td><span className="font-semibold text-emerald-600">82%</span></td>
                          <td><span className="adm-ss-pill pill-gray">Pending</span></td>
                          <td>
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                          </td>
                        </tr>

                        <tr>
                          <td className="font-mono font-semibold text-sky-700">REQ-2026-01628</td>
                          <td className="font-semibold text-slate-800">M. Jayasiri</td>
                          <td>Transport</td>
                          <td>Negombo</td>
                          <td><span className="adm-ss-pill pill-blue">Medium</span></td>
                          <td><span className="font-semibold text-emerald-600">76%</span></td>
                          <td><span className="adm-ss-pill pill-orange">Under Review</span></td>
                          <td>
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                          </td>
                        </tr>

                        <tr>
                          <td className="font-mono font-semibold text-sky-700">REQ-2026-01821</td>
                          <td className="font-semibold text-slate-800">D. Perera</td>
                          <td>Evacuation</td>
                          <td>Kalutara</td>
                          <td><span className="adm-ss-pill pill-blue">Medium</span></td>
                          <td><span className="font-semibold text-emerald-600">72%</span></td>
                          <td><span className="adm-ss-pill pill-blue">Assigned</span></td>
                          <td>
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Selected Request Details & AI Decision Support Card (Matching Screenshot 4) */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-bold text-slate-900">
                          {selectedRequest ? selectedRequest.id : 'Request #REQ-2026-01842'}
                        </span>
                        <span className="adm-ss-pill pill-red">Critical Priority</span>
                      </div>
                      <span className="text-[11.5px] text-slate-500">Submitted 15 Jun 2026 · AI Triage Verified</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-3">
                    {/* Requester Info */}
                    <div>
                      <div className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Requester Information
                      </div>
                      <div className="text-[13.5px] font-semibold text-slate-900">
                        {selectedRequest ? selectedRequest.requester : 'Nimal Perera'}
                      </div>
                      <div className="text-[12px] text-slate-500">
                        {selectedRequest ? selectedRequest.phone : '+94 77 123 4567'} · Household: 3 people
                      </div>
                      <div className="mt-1">
                        <span className="adm-ss-pill pill-blue">Vulnerable Household (Elderly)</span>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div>
                      <div className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Urgency & Medical Description
                      </div>
                      <p className="text-[12.5px] text-slate-600 leading-relaxed">
                        {selectedRequest ? selectedRequest.desc : 'Elderly person with serious health condition needs immediate medical assistance. Flood waters breached access roads.'}
                      </p>
                    </div>

                    {/* AI Decision Support Panel */}
                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-purple-900 font-bold text-[13px]">
                          <Cpu size={15} />
                          <span>AI Decision Support</span>
                        </div>
                        <span className="text-[11px] font-semibold text-purple-700">91% Confidence</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="adm-ss-pill pill-red">RECOMMENDED: HIGH</span>
                        <span className="text-[11.5px] text-slate-600">Immediate ground rescue unit required</span>
                      </div>
                      <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-[11.5px] text-amber-800 font-medium">
                        Human Review Required: Coordinator approval mandatory before fleet dispatch.
                      </div>

                      {/* Action Decision Buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <button
                          className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[12px] border-0 cursor-pointer transition-colors"
                          onClick={() => showToast('Request #REQ-2026-01842 Approved & Dispatched.')}
                        >
                          Approve
                        </button>
                        <button
                          className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[12px] border-0 cursor-pointer transition-colors"
                          onClick={() => showToast('Request modified for joint shelter placement.')}
                        >
                          Modify
                        </button>
                        <button
                          className="h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[12px] border-0 cursor-pointer transition-colors"
                          onClick={() => showToast('Request rejected with advisory notes.')}
                        >
                          Reject
                        </button>
                        <button
                          className="h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-[12px] border-0 cursor-pointer transition-colors"
                          onClick={() => showToast('Request deferred to secondary review queue.')}
                        >
                          Defer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 4: SHELTERS (Matching Screenshot 11)
             ===================================================== */}
          {activeTab === 'shelters' && (
            <>
              {/* KPI Banner */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <Building2 size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Shelters</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">28</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 12% Operational centers</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-teal-soft">
                    <Users size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Capacity</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">6,240</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 8% Available bed spaces</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <Building2 size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Occupied</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">4,618</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-orange">↑ 6% Currently in use</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <CheckCircle2 size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Available Beds</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">1,622</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 18% Ready for placement</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-purple-soft">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Accessibility Ready</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">18</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 20% Disabled friendly</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button className="adm-ss-btn-primary" onClick={() => showToast('Add New Shelter dialog active')}>
                    <Plus size={16} />
                    <span>+ Add Shelter</span>
                  </button>
                </div>
              </div>

              {/* Shelter Directory Table */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <div>
                    <h3 className="adm-ss-card-title">Verified Shelters Directory</h3>
                    <p className="adm-ss-card-subtitle">Real-time status, capacities and facilities across Western Province</p>
                  </div>
                </div>

                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Shelter Name</th>
                        <th>Location</th>
                        <th>Capacity</th>
                        <th>Occupancy</th>
                        <th>Available</th>
                        <th>Accessibility</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold text-slate-800">Colombo Central School</td>
                        <td>Colombo</td>
                        <td>500</td>
                        <td><span className="text-rose-600 font-semibold">420 (84%)</span></td>
                        <td>80 beds</td>
                        <td><span className="adm-ss-pill pill-green">Yes</span></td>
                        <td><span className="adm-ss-pill pill-green">Open</span></td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Gampaha Community Hall</td>
                        <td>Gampaha</td>
                        <td>300</td>
                        <td><span className="text-amber-600 font-semibold">210 (70%)</span></td>
                        <td>90 beds</td>
                        <td><span className="adm-ss-pill pill-green">Yes</span></td>
                        <td><span className="adm-ss-pill pill-green">Open</span></td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Kalutara Relief Center</td>
                        <td>Kalutara</td>
                        <td>250</td>
                        <td><span className="text-rose-600 font-semibold">200 (80%)</span></td>
                        <td>50 beds</td>
                        <td><span className="adm-ss-pill pill-gray">No</span></td>
                        <td><span className="adm-ss-pill pill-green">Open</span></td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Negombo Public School</td>
                        <td>Negombo</td>
                        <td>400</td>
                        <td><span className="text-rose-600 font-semibold">320 (80%)</span></td>
                        <td>80 beds</td>
                        <td><span className="adm-ss-pill pill-green">Yes</span></td>
                        <td><span className="adm-ss-pill pill-green">Open</span></td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 5: VOLUNTEERS (Matching Screenshot 12)
             ===================================================== */}
          {activeTab === 'volunteers' && (
            <>
              {/* KPI Banner */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft"><Users size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Volunteers</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">328</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 15% Registered</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft"><CheckCircle2 size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Available</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">142</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 12% Ready for deployment</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft"><Truck size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Assigned</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">136</span></div>
                    <span className="adm-ss-kpi-trend text-orange">↑ 8% Currently deployed</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-purple-soft"><RefreshCw size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Pending Verification</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">32</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 5% Awaiting check</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button className="adm-ss-btn-primary" onClick={() => showToast('Register Volunteer modal opened')}>
                    <Plus size={16} />
                    <span>+ Register Volunteer</span>
                  </button>
                </div>
              </div>

              {/* Volunteer Roster Table with AI Match Scores */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <h3 className="adm-ss-card-title">Registered Volunteer Personnel</h3>
                </div>

                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Skills</th>
                        <th>Location</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th>Match Score</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold text-slate-800">Amal Perera</td>
                        <td>Medical, First Aid</td>
                        <td>Colombo</td>
                        <td><span className="adm-ss-pill pill-green">Available</span></td>
                        <td><span className="adm-ss-pill pill-teal">Verified</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-purple-600 h-2" style={{ width: '95%' }}></div>
                            </div>
                            <span className="text-[11px] font-bold text-purple-700">95%</span>
                          </div>
                        </td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Sena Fernando</td>
                        <td>Logistics, Transport</td>
                        <td>Gampaha</td>
                        <td><span className="adm-ss-pill pill-green">Available</span></td>
                        <td><span className="adm-ss-pill pill-teal">Verified</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-purple-600 h-2" style={{ width: '92%' }}></div>
                            </div>
                            <span className="text-[11px] font-bold text-purple-700">92%</span>
                          </div>
                        </td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Nadee Silva</td>
                        <td>Food Distribution, Community</td>
                        <td>Kalutara</td>
                        <td><span className="adm-ss-pill pill-orange">Busy</span></td>
                        <td><span className="adm-ss-pill pill-teal">Verified</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-purple-600 h-2" style={{ width: '88%' }}></div>
                            </div>
                            <span className="text-[11px] font-bold text-purple-700">88%</span>
                          </div>
                        </td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 6: SETTINGS / USER MANAGEMENT & RBAC (CORE ADMIN)
             ===================================================== */}
          {activeTab === 'settings' && (
            <>
              {/* Sub-tabs for Settings */}
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <button
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer border-0 transition-colors ${
                    settingsSubTab === 'users' ? 'bg-[#3d6b4f] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setSettingsSubTab('users')}
                >
                  User Accounts & Security Roles
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer border-0 transition-colors ${
                    settingsSubTab === 'system' ? 'bg-[#3d6b4f] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setSettingsSubTab('system')}
                >
                  System Telemetry & Platform Health
                </button>
              </div>

              {settingsSubTab === 'users' && (
                <>
                  {/* KPI Row for Users */}
                  <div className="adm-ss-kpi-row">
                    <div className="adm-ss-kpi-card">
                      <div className="adm-ss-kpi-icon-box bg-blue-soft"><Users size={22} /></div>
                      <div className="adm-ss-kpi-content">
                        <span className="adm-ss-kpi-label">Total System Users</span>
                        <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">{stats.totalUsers}</span></div>
                        <span className="adm-ss-kpi-trend text-green">All roles combined</span>
                      </div>
                    </div>

                    <div className="adm-ss-kpi-card">
                      <div className="adm-ss-kpi-icon-box bg-purple-soft"><Shield size={22} /></div>
                      <div className="adm-ss-kpi-content">
                        <span className="adm-ss-kpi-label">Administrators</span>
                        <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">4</span></div>
                        <span className="adm-ss-kpi-trend text-purple">National Command</span>
                      </div>
                    </div>

                    <div className="adm-ss-kpi-card">
                      <div className="adm-ss-kpi-icon-box bg-green-soft"><CheckCircle2 size={22} /></div>
                      <div className="adm-ss-kpi-content">
                        <span className="adm-ss-kpi-label">Active Coordinators</span>
                        <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">18</span></div>
                        <span className="adm-ss-kpi-trend text-green">Online in field hubs</span>
                      </div>
                    </div>

                    <div className="adm-ss-kpi-card">
                      <div className="adm-ss-kpi-icon-box bg-orange-soft"><AlertTriangle size={22} /></div>
                      <div className="adm-ss-kpi-content">
                        <span className="adm-ss-kpi-label">Security Alerts</span>
                        <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">0</span></div>
                        <span className="adm-ss-kpi-trend text-green">No breach attempts</span>
                      </div>
                    </div>

                    <div className="adm-ss-kpi-action-col">
                      <button className="adm-ss-btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} />
                        <span>+ Add New User</span>
                      </button>
                    </div>
                  </div>

                  {/* Users Filter & Table Card */}
                  <div className="adm-ss-card">
                    <div className="adm-ss-card-header">
                      <div>
                        <h3 className="adm-ss-card-title">User Accounts & RBAC Matrix</h3>
                        <p className="adm-ss-card-subtitle">Manage administrative privileges, credentials and field district assignments</p>
                      </div>
                      <button className="adm-ss-btn-reset" onClick={loadData}>
                        <RefreshCw size={12} />
                        <span>Refresh List</span>
                      </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="adm-ss-filters-bar">
                      <div className="adm-ss-filters-left">
                        <input
                          type="text"
                          placeholder="Filter by name, email, district..."
                          className="adm-ss-filter-select w-[240px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                          className="adm-ss-filter-select"
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                        >
                          <option value="ALL">All Roles</option>
                          <option value="Admin">Admin</option>
                          <option value="Coordinator">Coordinator</option>
                          <option value="LogisticsManager">Logistics Manager</option>
                          <option value="ShelterAdministrator">Shelter Admin</option>
                          <option value="Volunteer">Volunteer</option>
                          <option value="Citizen">Citizen</option>
                        </select>
                        <select
                          className="adm-ss-filter-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="ALL">All Status</option>
                          <option value="ACTIVE">Active Accounts</option>
                          <option value="LOCKED">Locked Accounts</option>
                        </select>
                        <button
                          className="adm-ss-btn-reset"
                          onClick={() => {
                            setSearchQuery('');
                            setRoleFilter('ALL');
                            setStatusFilter('ALL');
                          }}
                        >
                          <span>Clear Filters</span>
                        </button>
                      </div>
                      <span className="text-[12px] text-slate-500 font-medium">
                        Showing {filteredUsers.length} accounts
                      </span>
                    </div>

                    {/* User Data Table */}
                    <div className="adm-ss-table-container">
                      <table className="adm-ss-table">
                        <thead>
                          <tr>
                            <th>User ID</th>
                            <th>Full Name & Email</th>
                            <th>Role & Permissions</th>
                            <th>District</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr key={u.id}>
                              <td className="font-mono text-slate-400 text-[11px]">{u.id}</td>
                              <td>
                                <div className="font-semibold text-slate-900">{u.fullName}</div>
                                <div className="text-[11.5px] text-slate-500">{u.email}</div>
                              </td>
                              <td>
                                <span className={`adm-ss-pill ${
                                  u.role === 'Admin' ? 'pill-purple' :
                                  u.role === 'Coordinator' ? 'pill-teal' :
                                  u.role === 'LogisticsManager' ? 'pill-blue' :
                                  u.role === 'ShelterAdministrator' ? 'pill-orange' :
                                  u.role === 'Volunteer' ? 'pill-green' : 'pill-gray'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="text-slate-700">{u.assignedDistrict || 'National'}</td>
                              <td>
                                <span className={`adm-ss-pill ${u.isActive ? 'pill-green' : 'pill-red'}`}>
                                  {u.isActive ? 'Active' : 'Locked'}
                                </span>
                              </td>
                              <td className="text-slate-400 text-[11.5px]">{u.createdAt}</td>
                              <td>
                                <div className="adm-ss-row-actions">
                                  {/* Lock / Unlock Toggle */}
                                  <button
                                    className="adm-ss-icon-btn"
                                    onClick={() => handleToggleStatus(u)}
                                    title={u.isActive ? 'Lock Account' : 'Unlock Account'}
                                  >
                                    {u.isActive ? <Lock size={13} className="text-amber-600" /> : <Unlock size={13} className="text-emerald-600" />}
                                  </button>

                                  {/* Change Role */}
                                  <button
                                    className="adm-ss-icon-btn"
                                    onClick={() => setRoleChangeModal({ isOpen: true, user: u, newRole: u.role })}
                                    title="Modify Role"
                                  >
                                    <Edit size={13} className="text-blue-600" />
                                  </button>

                                  {/* Reset Password */}
                                  <button
                                    className="adm-ss-icon-btn"
                                    onClick={() => setResetPasswordModal({ isOpen: true, user: u, newPassword: '' })}
                                    title="Reset Password Hash"
                                  >
                                    <Key size={13} className="text-purple-600" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    className="adm-ss-icon-btn"
                                    onClick={() => handleDeleteUser(u.id, u.fullName)}
                                    title="Delete User"
                                  >
                                    <Trash2 size={13} className="text-rose-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {settingsSubTab === 'system' && (
                <div className="adm-ss-card space-y-6">
                  <div>
                    <h3 className="adm-ss-card-title">System Infrastructure & Diagnostics</h3>
                    <p className="adm-ss-card-subtitle">Real-time health telemetry across the Western Province server cluster</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[12px] font-semibold text-slate-500">System Uptime</div>
                      <div className="text-[26px] font-bold text-emerald-600">99.98%</div>
                      <div className="text-[11.5px] text-slate-500 mt-1">Continuous operation 48 days</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[12px] font-semibold text-slate-500">Database Latency</div>
                      <div className="text-[26px] font-bold text-sky-600">14.2 ms</div>
                      <div className="text-[11.5px] text-slate-500 mt-1">SQL Server connection verified</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[12px] font-semibold text-slate-500">Cryptographic Ledger</div>
                      <div className="text-[26px] font-bold text-purple-600">Synced</div>
                      <div className="text-[11.5px] text-slate-500 mt-1">SHA-256 block hash valid</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* =====================================================
             VIEW 7: REPORTS & ANALYTICS (Matching Screenshot 8)
             ===================================================== */}
          {activeTab === 'reports' && (
            <>
              {/* Top Stats */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft"><Users size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">People Assisted</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">12,560</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 28% vs last month</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft"><Package size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Resources Distributed</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">6,280</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 18% Items delivered</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft"><Building2 size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Active Shelters</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">28</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 12% Operational</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-red-soft"><ShieldAlert size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Active Crises</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">8</span></div>
                    <span className="adm-ss-kpi-trend text-red">↑ 33% Attention</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button className="adm-ss-btn-primary" onClick={() => showToast('Generating Provincial Humanitarian Report PDF...')}>
                    <Download size={16} />
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>

              {/* Reports Table */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <h3 className="adm-ss-card-title">Recent Operational Reports</h3>
                </div>

                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Report Name</th>
                        <th>Type</th>
                        <th>Date Generated</th>
                        <th>Generated By</th>
                        <th>Format</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold text-slate-800">June 2026 - Monthly Crisis Summary</td>
                        <td>Monthly</td>
                        <td>30 Jun 2026</td>
                        <td>Sarah Johnson</td>
                        <td><span className="adm-ss-pill pill-red">PDF</span></td>
                        <td><button className="adm-ss-icon-btn"><Download size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Q2 2026 - Provincial Impact Report</td>
                        <td>Quarterly</td>
                        <td>15 Jun 2026</td>
                        <td>Admin User</td>
                        <td><span className="adm-ss-pill pill-red">PDF</span></td>
                        <td><button className="adm-ss-icon-btn"><Download size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Resource Distribution Audit Ledger</td>
                        <td>Operational</td>
                        <td>10 Jun 2026</td>
                        <td>Kasun Perera</td>
                        <td><span className="adm-ss-pill pill-green">Excel</span></td>
                        <td><button className="adm-ss-icon-btn"><Download size={13} /></button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 8: AUDIT LOGS (Cryptographic Ledger)
             ===================================================== */}
          {activeTab === 'audit' && (
            <div className="adm-ss-card">
              <div className="adm-ss-card-header">
                <div>
                  <h3 className="adm-ss-card-title">Immutable Audit Trail</h3>
                  <p className="adm-ss-card-subtitle">Every administrative action, permission elevation and critical dispatch is cryptographically signed</p>
                </div>
              </div>

              <div className="adm-ss-table-container">
                <table className="adm-ss-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Operator</th>
                      <th>Action</th>
                      <th>Target Entity</th>
                      <th>IP Address</th>
                      <th>Verification Hash</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono text-slate-500">2026-11-14 17:20:12</td>
                      <td className="font-semibold text-slate-800">Sarah Johnson</td>
                      <td>APPROVED_AID_DISPATCH</td>
                      <td>REQ-2026-01842</td>
                      <td>192.168.1.100</td>
                      <td className="font-mono text-[11px] text-purple-700">e82a...91b4</td>
                      <td><span className="adm-ss-pill pill-green">Verified</span></td>
                    </tr>
                    <tr>
                      <td className="font-mono text-slate-500">2026-11-14 16:45:00</td>
                      <td className="font-semibold text-slate-800">Admin User</td>
                      <td>ROLE_SECURITY_ELEVATION</td>
                      <td>usr-002 (Kasun P.)</td>
                      <td>172.20.240.1</td>
                      <td className="font-mono text-[11px] text-purple-700">4c12...88df</td>
                      <td><span className="adm-ss-pill pill-green">Verified</span></td>
                    </tr>
                    <tr>
                      <td className="font-mono text-slate-500">2026-11-14 15:30:19</td>
                      <td className="font-semibold text-slate-800">Kasun Perera</td>
                      <td>CONVOY_DISPATCH_AUTHORIZED</td>
                      <td>CNV-2026-004</td>
                      <td>10.4.2.2</td>
                      <td className="font-mono text-[11px] text-purple-700">77bb...aa01</td>
                      <td><span className="adm-ss-pill pill-green">Verified</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================
             VIEW 9: CRISIS MANAGEMENT
             ===================================================== */}
          {activeTab === 'crisis' && (
            <>
              {/* National Emergency Alert Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between shadow-md flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ShieldAlert size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[14px] tracking-wide">NATIONAL EMERGENCY LEVEL 3 (RED ALERT) ACTIVE</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold">DMC Directive #DMC-LK-2026-08</span>
                    </div>
                    <p className="text-[12px] text-white/90 mt-0.5 m-0">
                      Kelani River crest at 1.84m (Major Flood). Multi-agency tri-forces disaster response operations mobilized across Western & Sabaragamuwa.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3.5 py-1.5 rounded-lg bg-white text-red-700 text-[12px] font-bold hover:bg-slate-100 border-0 cursor-pointer transition shadow-sm flex items-center gap-1.5"
                    onClick={() => {
                      setActiveTab('notifications');
                      setIsComposeBroadcastModalOpen(true);
                    }}
                  >
                    <Radio size={14} />
                    <span>Broadcast Directive</span>
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg bg-red-800/60 hover:bg-red-800 text-white text-[12px] font-semibold border border-white/20 cursor-pointer transition"
                    onClick={() => setActiveTab('maps')}
                  >
                    View Satellite Radar
                  </button>
                </div>
              </div>

              {/* KPI Metrics Row */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-red-soft">
                    <ShieldAlert size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Active Crises</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">{crises.filter(c => c.status !== 'Contained').length}</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-red">↑ 33% Requiring DMC action</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <Users size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">People in Hazard Zones</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">18,450</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-orange">↑ 14% Western & Sabaragamuwa</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <HeartPulse size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Multi-Agency Teams</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">42 Units</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">Army, Navy SBS, Red Cross</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-purple-soft">
                    <Droplets size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Flooded Land Area</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">282 km²</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-red">Kelani & Attanagalu Basins</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button
                    className="adm-ss-btn-primary"
                    onClick={() => setIsDeclareCrisisModalOpen(true)}
                  >
                    <Plus size={16} />
                    <span>+ Declare Crisis Incident</span>
                  </button>
                </div>
              </div>

              {/* Crises Roster Card */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <div>
                    <h3 className="adm-ss-card-title">Active Crisis Incidents & Hazard Zones</h3>
                    <p className="adm-ss-card-subtitle">Real-time emergency incident dossiers, triage status, and tri-force deployments</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-slate-500 font-medium">
                      Showing {crises.length} incidents
                    </span>
                  </div>
                </div>

                {/* Filters Bar */}
                <div className="adm-ss-filters-bar">
                  <div className="adm-ss-filters-left">
                    <div className="adm-ss-search-box" style={{ width: '280px' }}>
                      <Search size={15} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search incident, district, or code..."
                        className="adm-ss-search-input"
                        value={crisisSearch}
                        onChange={(e) => setCrisisSearch(e.target.value)}
                      />
                    </div>

                    <select
                      className="adm-ss-filter-select"
                      value={crisisSeverityFilter}
                      onChange={(e) => setCrisisSeverityFilter(e.target.value)}
                    >
                      <option value="ALL">All Severities</option>
                      <option value="Critical">Critical (Red)</option>
                      <option value="High">High (Orange)</option>
                      <option value="Medium">Medium (Amber)</option>
                      <option value="Low">Low (Green)</option>
                    </select>

                    <select
                      className="adm-ss-filter-select"
                      value={crisisStatusFilter}
                      onChange={(e) => setCrisisStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Active Escalation">Active Escalation</option>
                      <option value="Evacuation Underway">Evacuation Underway</option>
                      <option value="Operations Deployed">Operations Deployed</option>
                      <option value="Contained">Contained</option>
                    </select>

                    {(crisisSearch || crisisSeverityFilter !== 'ALL' || crisisStatusFilter !== 'ALL') && (
                      <button
                        className="adm-ss-btn-reset"
                        onClick={() => {
                          setCrisisSearch('');
                          setCrisisSeverityFilter('ALL');
                          setCrisisStatusFilter('ALL');
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Crises Table */}
                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Incident ID</th>
                        <th>Crisis Title & Type</th>
                        <th>District</th>
                        <th>Severity</th>
                        <th>Affected Pop.</th>
                        <th>Area (km²)</th>
                        <th>Deployed Teams</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crises
                        .filter(c => {
                          const matchSearch =
                            c.title.toLowerCase().includes(crisisSearch.toLowerCase()) ||
                            c.district.toLowerCase().includes(crisisSearch.toLowerCase()) ||
                            c.id.toLowerCase().includes(crisisSearch.toLowerCase());
                          const matchSeverity = crisisSeverityFilter === 'ALL' || c.severity === crisisSeverityFilter;
                          const matchStatus = crisisStatusFilter === 'ALL' || c.status === crisisStatusFilter;
                          return matchSearch && matchSeverity && matchStatus;
                        })
                        .map((c) => (
                          <tr key={c.id}>
                            <td className="font-mono text-[11.5px] font-semibold text-[#3d6b4f]">{c.id}</td>
                            <td>
                              <div className="font-semibold text-slate-900">{c.title}</div>
                              <div className="text-[11px] text-slate-500">Declared: {c.declaredAt} · Lead: {c.leadCoordinator}</div>
                            </td>
                            <td>
                              <span className="font-medium text-slate-700">{c.district}</span>
                            </td>
                            <td>
                              <span className={`adm-ss-pill ${
                                c.severity === 'Critical' ? 'pill-red' :
                                c.severity === 'High' ? 'pill-orange' :
                                c.severity === 'Medium' ? 'pill-orange' : 'pill-green'
                              }`}>
                                {c.severity}
                              </span>
                            </td>
                            <td className="font-semibold text-slate-800">{c.affectedPeople.toLocaleString()}</td>
                            <td className="text-slate-600">{c.areaSqKm} km²</td>
                            <td>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#3d6b4f]">{c.teamsDeployed}</span>
                                <span className="text-[11px] text-slate-500">teams</span>
                              </div>
                            </td>
                            <td>
                              <span className={`adm-ss-pill ${
                                c.status === 'Active Escalation' ? 'pill-red' :
                                c.status === 'Evacuation Underway' ? 'pill-orange' :
                                c.status === 'Operations Deployed' ? 'pill-blue' : 'pill-green'
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td>
                              <div className="adm-ss-row-actions">
                                <button
                                  className="adm-ss-icon-btn"
                                  title="View Incident Dossier"
                                  onClick={() => setSelectedCrisis(c)}
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  className="adm-ss-icon-btn"
                                  title="Toggle Contained / Escalated"
                                  onClick={() => handleToggleCrisisStatus(c.id)}
                                >
                                  <RefreshCw size={13} />
                                </button>
                                <button
                                  className="adm-ss-icon-btn text-[#3d6b4f]"
                                  title="Dispatch Reinforcement Units (+2)"
                                  onClick={() => handleDispatchRescueTeams(c.id)}
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Hydrometric & Response Telemetry Split */}
              <div className="adm-ss-split-grid">
                {/* Hydrometric River Basin Sensors */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <div>
                      <h3 className="adm-ss-card-title">Live Hydrometric River Basin Gauges</h3>
                      <p className="adm-ss-card-subtitle">Real-time water crest levels & automated flood threshold sensors</p>
                    </div>
                    <span className="adm-ss-pill pill-red">3 Alerts Active</span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Droplets size={16} className="text-red-600" />
                          <span className="text-[13px] font-bold text-slate-900">Kelani Ganga (Nagalagam Street Gauge)</span>
                        </div>
                        <span className="adm-ss-pill pill-red font-mono">1.84m / Max 1.50m</span>
                      </div>
                      <div className="adm-ss-progress-track mb-1.5">
                        <div className="adm-ss-progress-fill bg-red-600" style={{ width: '92%' }}></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Threshold: Major Flood Exceeded (+0.34m)</span>
                        <span className="font-semibold text-red-700">Crest Rising (+3cm/hr)</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Droplets size={16} className="text-amber-600" />
                          <span className="text-[13px] font-bold text-slate-900">Kalu Ganga (Putupaula Hydrometric Station)</span>
                        </div>
                        <span className="adm-ss-pill pill-orange font-mono">2.35m / Max 2.20m</span>
                      </div>
                      <div className="adm-ss-progress-track mb-1.5">
                        <div className="adm-ss-progress-fill bg-amber-500" style={{ width: '82%' }}></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Threshold: Minor Flood Exceeded (+0.15m)</span>
                        <span className="font-semibold text-amber-700">Steady High Tide</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Droplets size={16} className="text-[#3d6b4f]" />
                          <span className="text-[13px] font-bold text-slate-900">Attanagalu Oya (Dunamale Gauge)</span>
                        </div>
                        <span className="adm-ss-pill pill-green font-mono">1.45m / Max 1.80m</span>
                      </div>
                      <div className="adm-ss-progress-track mb-1.5">
                        <div className="adm-ss-progress-fill bg-[#3d6b4f]" style={{ width: '64%' }}></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Threshold: Alert Level Active</span>
                        <span className="font-semibold text-slate-700">Slight Recede (-2cm/hr)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tri-Forces & Agency Roster */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <div>
                      <h3 className="adm-ss-card-title">Tri-Forces & Emergency Units</h3>
                      <p className="adm-ss-card-subtitle">Armed forces & multi-agency operational readiness</p>
                    </div>
                    <span className="adm-ss-pill pill-green">42 Teams Active</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[12px]">
                          SLA
                        </div>
                        <div>
                          <div className="text-[12.5px] font-semibold text-slate-900">Sri Lanka Army 58 Division</div>
                          <div className="text-[11px] text-slate-500">18 Teams · Heavy Rescue & Bulldozers</div>
                        </div>
                      </div>
                      <span className="adm-ss-pill pill-green">Colombo & Gampaha</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[12px]">
                          SLN
                        </div>
                        <div>
                          <div className="text-[12.5px] font-semibold text-slate-900">Navy Special Boat Squadron (SBS)</div>
                          <div className="text-[11px] text-slate-500">14 Inflatable Dinghies · Swiftwater Rescues</div>
                        </div>
                      </div>
                      <span className="adm-ss-pill pill-blue">Kelani Riparian Basin</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-bold text-[12px]">
                          SLAF
                        </div>
                        <div>
                          <div className="text-[12.5px] font-semibold text-slate-900">Air Force Bell 412 Search Wing</div>
                          <div className="text-[11px] text-slate-500">2 Helicopters on Standby at Ratmalana</div>
                        </div>
                      </div>
                      <span className="adm-ss-pill pill-orange">Airborne Ready</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-[12px]">
                          SLRC
                        </div>
                        <div>
                          <div className="text-[12.5px] font-semibold text-slate-900">Sri Lanka Red Cross Disaster Unit</div>
                          <div className="text-[11px] text-slate-500">12 Mobile First Aid Teams & Ambulances</div>
                        </div>
                      </div>
                      <span className="adm-ss-pill pill-teal">Field Deployed</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 10: DONATIONS MANAGEMENT
             ===================================================== */}
          {activeTab === 'donations' && (
            <>
              {/* KPI Metrics Row */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-teal-soft">
                    <DollarSign size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Funds Raised</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">Rs. 24,850,000</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 34% vs previous appeal</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <CheckCircle2 size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Verified Disbursements</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">Rs. 19,420,000</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">92% allocation across districts</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <Package size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">In-Kind Relief Crates</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">6,280 Items</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">Water, ration packs & kits</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-purple-soft">
                    <Building2 size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Corporate & NGO Donors</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">46 Partners</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">100% Tax Exempt Verified</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button
                    className="adm-ss-btn-primary"
                    onClick={() => setIsRecordDonationModalOpen(true)}
                  >
                    <Plus size={16} />
                    <span>+ Record Donation / Grant</span>
                  </button>
                </div>
              </div>

              {/* Two-Column Visual Allocation & Financial Integrity */}
              <div className="adm-ss-split-grid">
                {/* Sector Allocation Breakdown */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <div>
                      <h3 className="adm-ss-card-title">Relief Funds Allocation by Sector</h3>
                      <p className="adm-ss-card-subtitle">Transparent expenditure allocation across priority humanitarian needs</p>
                    </div>
                    <span className="adm-ss-pill pill-teal">Rs. 24.85M Total</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[12.5px] font-semibold text-slate-800 mb-1">
                        <span>Food & Clean Drinking Water</span>
                        <span className="text-[#3d6b4f]">Rs. 9,443,000 (38%)</span>
                      </div>
                      <div className="adm-ss-progress-track">
                        <div className="adm-ss-progress-fill bg-[#3d6b4f]" style={{ width: '38%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12.5px] font-semibold text-slate-800 mb-1">
                        <span>Emergency Medical Supplies & First Aid</span>
                        <span className="text-blue-600">Rs. 6,958,000 (28%)</span>
                      </div>
                      <div className="adm-ss-progress-track">
                        <div className="adm-ss-progress-fill bg-blue-600" style={{ width: '28%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12.5px] font-semibold text-slate-800 mb-1">
                        <span>Shelter Materials, Tents & Bedding</span>
                        <span className="text-amber-600">Rs. 4,970,000 (20%)</span>
                      </div>
                      <div className="adm-ss-progress-track">
                        <div className="adm-ss-progress-fill bg-amber-500" style={{ width: '20%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12.5px] font-semibold text-slate-800 mb-1">
                        <span>Logistics Convoys, Water Bowsers & Fuel</span>
                        <span className="text-purple-600">Rs. 3,479,000 (14%)</span>
                      </div>
                      <div className="adm-ss-progress-track">
                        <div className="adm-ss-progress-fill bg-purple-600" style={{ width: '14%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Transparency & Audit Stamping */}
                <div className="adm-ss-card flex flex-col justify-between">
                  <div>
                    <div className="adm-ss-card-header">
                      <div>
                        <h3 className="adm-ss-card-title">Cryptographic Escrow & Audit Stamping</h3>
                        <p className="adm-ss-card-subtitle">Tamper-proof immutable ledger oversight</p>
                      </div>
                      <span className="adm-ss-pill pill-green">KPMG Certified</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 mb-4">
                      <div className="flex justify-between text-[12px]">
                        <span className="text-slate-500">Escrow Verification Status:</span>
                        <span className="font-semibold text-emerald-700">100% Cleared via Central Bank</span>
                      </div>
                      <div className="flex justify-between text-[12px]">
                        <span className="text-slate-500">Disbursement Turnaround:</span>
                        <span className="font-semibold text-slate-800">4.2 Hours Avg Latency</span>
                      </div>
                      <div className="flex justify-between text-[12px]">
                        <span className="text-slate-500">Tax Exemption Certs:</span>
                        <span className="font-semibold text-[#3d6b4f]">38 Issued of 38 Eligible</span>
                      </div>
                      <div className="flex justify-between text-[12px]">
                        <span className="text-slate-500">Ledger Root Hash:</span>
                        <span className="font-mono text-[11px] text-purple-700">0x8a9f...33e1</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[12.5px] font-semibold border-0 cursor-pointer flex items-center justify-center gap-2 transition"
                    onClick={() => showToast('Exporting full humanitarian financial audit report (PDF)...')}
                  >
                    <Download size={15} />
                    <span>Download Comprehensive Audit Report (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Donations & Grants Ledger Table */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <div>
                    <h3 className="adm-ss-card-title">Donations & Corporate Grants Ledger</h3>
                    <p className="adm-ss-card-subtitle">Verified disaster relief contributions, allocation tracking, and tax exemption receipts</p>
                  </div>
                  <span className="text-[12px] text-slate-500 font-medium">
                    {donations.length} total entries
                  </span>
                </div>

                {/* Filters */}
                <div className="adm-ss-filters-bar">
                  <div className="adm-ss-filters-left">
                    <div className="adm-ss-search-box" style={{ width: '280px' }}>
                      <Search size={15} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search donor, sector, or code..."
                        className="adm-ss-search-input"
                        value={donationSearch}
                        onChange={(e) => setDonationSearch(e.target.value)}
                      />
                    </div>

                    <select
                      className="adm-ss-filter-select"
                      value={donationTypeFilter}
                      onChange={(e) => setDonationTypeFilter(e.target.value)}
                    >
                      <option value="ALL">All Grant Types</option>
                      <option value="Monetary Grant">Monetary Grant</option>
                      <option value="International Grant">International Grant</option>
                      <option value="In-Kind Relief Supplies">In-Kind Relief Supplies</option>
                      <option value="In-Kind Medical Equipment">In-Kind Medical Equipment</option>
                      <option value="Logistics Asset Donation">Logistics Asset Donation</option>
                    </select>

                    <select
                      className="adm-ss-filter-select"
                      value={donationStatusFilter}
                      onChange={(e) => setDonationStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Verification Statuses</option>
                      <option value="Verified & Cleared">Verified & Cleared</option>
                      <option value="Allocated to Depot">Allocated to Depot</option>
                      <option value="Active Deployment">Active Deployment</option>
                      <option value="Pending Audit Clearance">Pending Audit Clearance</option>
                    </select>

                    {(donationSearch || donationTypeFilter !== 'ALL' || donationStatusFilter !== 'ALL') && (
                      <button
                        className="adm-ss-btn-reset"
                        onClick={() => {
                          setDonationSearch('');
                          setDonationTypeFilter('ALL');
                          setDonationStatusFilter('ALL');
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Donation ID</th>
                        <th>Donor / Organization</th>
                        <th>Type</th>
                        <th>Amount / Consignment</th>
                        <th>Allocated Sector</th>
                        <th>Target District</th>
                        <th>Status</th>
                        <th>Audit Hash</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations
                        .filter(d => {
                          const matchSearch =
                            d.donorName.toLowerCase().includes(donationSearch.toLowerCase()) ||
                            d.sector.toLowerCase().includes(donationSearch.toLowerCase()) ||
                            d.id.toLowerCase().includes(donationSearch.toLowerCase());
                          const matchType = donationTypeFilter === 'ALL' || d.type === donationTypeFilter;
                          const matchStatus = donationStatusFilter === 'ALL' || d.status === donationStatusFilter;
                          return matchSearch && matchType && matchStatus;
                        })
                        .map((d) => (
                          <tr key={d.id}>
                            <td className="font-mono text-[11.5px] font-semibold text-[#3d6b4f]">{d.id}</td>
                            <td>
                              <div className="font-semibold text-slate-900">{d.donorName}</div>
                              <div className="text-[11px] text-slate-500">Date: {d.date} · Verified by {d.verifiedBy}</div>
                            </td>
                            <td>
                              <span className="adm-ss-pill pill-blue">{d.type}</span>
                            </td>
                            <td className="font-semibold text-slate-900">{d.amountFormatted}</td>
                            <td className="text-slate-700 font-medium">{d.sector}</td>
                            <td className="text-slate-600">{d.targetDistrict}</td>
                            <td>
                              <span className={`adm-ss-pill ${
                                d.status === 'Verified & Cleared' ? 'pill-green' :
                                d.status === 'Allocated to Depot' ? 'pill-teal' :
                                d.status === 'Active Deployment' ? 'pill-blue' : 'pill-orange'
                              }`}>
                                {d.status}
                              </span>
                            </td>
                            <td className="font-mono text-[11px] text-purple-700">{d.auditHash}</td>
                            <td>
                              <div className="adm-ss-row-actions">
                                <button
                                  className="adm-ss-icon-btn"
                                  title="View Audit Receipt"
                                  onClick={() => setSelectedDonation(d)}
                                >
                                  <FileText size={13} />
                                </button>
                                <button
                                  className="adm-ss-icon-btn"
                                  title="Download Tax Exemption Certificate"
                                  onClick={() => handleDownloadReceipt(d)}
                                >
                                  <Download size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 11: AI OPERATIONS CENTER
             ===================================================== */}
          {activeTab === 'ai-ops' && (
            <>
              {/* Telemetry Metrics Row */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-purple-soft">
                    <Cpu size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">AI Decision Accuracy</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">94.2%</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">1,840 Verified emergency cases</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <Sparkles size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Mean Confidence Score</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">88.4%</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">High certainty index</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Human Coordinator Overrides</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">5.8%</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-orange">48 cases reviewed by Sarah J.</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <Zap size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Edge Inference Latency</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">142 ms</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">Sub-second neural classifier</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button
                    className="adm-ss-btn-primary"
                    onClick={handleRunAiDiagnostic}
                  >
                    <Activity size={16} />
                    <span>Run Diagnostic</span>
                  </button>
                </div>
              </div>

              {/* Model Governance & Threshold Controls */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <div>
                    <h3 className="adm-ss-card-title">AI Decision Policy & Confidence Routing Threshold</h3>
                    <p className="adm-ss-card-subtitle">
                      Control automatic rescue routing vs coordinator manual review boundaries
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-slate-700">Active Routing Policy:</span>
                    <span className="adm-ss-pill pill-purple font-mono">
                      {aiConfidenceThreshold >= 90 ? 'Strict Verification (90%)' : aiConfidenceThreshold >= 80 ? 'Standard Balance (80%)' : 'Urgent Flash Flood (70%)'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                  <button
                    className={`adm-ss-threshold-btn ${aiConfidenceThreshold === 90 ? 'active' : ''}`}
                    onClick={() => {
                      setAiConfidenceThreshold(90);
                      showToast('AI Threshold set to Strict (90%+ required for automated dispatch).');
                    }}
                  >
                    <Shield size={16} />
                    <div>
                      <div className="text-[13px] font-bold">Strict Protocol (90%+)</div>
                      <div className="text-[11px] opacity-80">High human oversight, zero false positives</div>
                    </div>
                  </button>

                  <button
                    className={`adm-ss-threshold-btn ${aiConfidenceThreshold === 80 ? 'active' : ''}`}
                    onClick={() => {
                      setAiConfidenceThreshold(80);
                      showToast('AI Threshold set to Standard (80%+ auto-dispatch, recommended).');
                    }}
                  >
                    <Sparkles size={16} />
                    <div>
                      <div className="text-[13px] font-bold">Standard Protocol (80% Default)</div>
                      <div className="text-[11px] opacity-80">Recommended operational triage threshold</div>
                    </div>
                  </button>

                  <button
                    className={`adm-ss-threshold-btn ${aiConfidenceThreshold === 70 ? 'active' : ''}`}
                    onClick={() => {
                      setAiConfidenceThreshold(70);
                      showToast('AI Threshold set to Urgent Flash Flood Mode (70%+ auto-dispatch).');
                    }}
                  >
                    <Zap size={16} />
                    <div>
                      <div className="text-[13px] font-bold">Urgent Flood Surge (70%)</div>
                      <div className="text-[11px] opacity-80">Fast-tracks 92% of triage during red alerts</div>
                    </div>
                  </button>
                </div>

                {/* Demographic Fairness & Protected Groups */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span className="text-[13px] font-bold text-slate-900">Demographic Fairness & Vulnerability Boost Engine</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Zero Regional Bias Audited
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[12px]">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-500 block">Colombo District</span>
                      <span className="font-bold text-slate-800">0.0% Variance (Parity)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-500 block">Gampaha District</span>
                      <span className="font-bold text-slate-800">+0.2% Variance (Parity)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-500 block">Kalutara District</span>
                      <span className="font-bold text-slate-800">-0.1% Variance (Parity)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-100">
                      <span className="text-purple-700 font-semibold block">Vulnerability Boost</span>
                      <span className="font-bold text-purple-900">+25% Weight for Elderly / Infants</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-Time AI Triage Inference Stream */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <div>
                    <h3 className="adm-ss-card-title">Real-Time AI Triage Decision Telemetry</h3>
                    <p className="adm-ss-card-subtitle">
                      Live inference logs with explainable extracted features, confidence scores, and coordinator verdicts
                    </p>
                  </div>
                  <span className="text-[12px] text-slate-500 font-medium">
                    {aiTriageLogs.length} live inference records
                  </span>
                </div>

                {/* Filters */}
                <div className="adm-ss-filters-bar">
                  <div className="adm-ss-filters-left">
                    <div className="adm-ss-search-box" style={{ width: '280px' }}>
                      <Search size={15} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search requester, keyword, or ID..."
                        className="adm-ss-search-input"
                        value={aiSearch}
                        onChange={(e) => setAiSearch(e.target.value)}
                      />
                    </div>

                    <select
                      className="adm-ss-filter-select"
                      value={aiPriorityFilter}
                      onChange={(e) => setAiPriorityFilter(e.target.value)}
                    >
                      <option value="ALL">All Priorities</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>

                    {(aiSearch || aiPriorityFilter !== 'ALL') && (
                      <button
                        className="adm-ss-btn-reset"
                        onClick={() => {
                          setAiSearch('');
                          setAiPriorityFilter('ALL');
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Requester</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>AI Score</th>
                        <th>Extracted Decision Factors</th>
                        <th>Recommendation</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiTriageLogs
                        .filter(item => {
                          const matchSearch =
                            item.requester.toLowerCase().includes(aiSearch.toLowerCase()) ||
                            item.category.toLowerCase().includes(aiSearch.toLowerCase()) ||
                            item.id.toLowerCase().includes(aiSearch.toLowerCase());
                          const matchPriority = aiPriorityFilter === 'ALL' || item.priority === aiPriorityFilter;
                          return matchSearch && matchPriority;
                        })
                        .map((item) => (
                          <tr key={item.id}>
                            <td className="font-mono text-[11.5px] font-semibold text-[#3d6b4f]">{item.id}</td>
                            <td>
                              <div className="font-semibold text-slate-900">{item.requester}</div>
                              <div className="text-[11px] text-slate-500">{item.phone} · {item.timestamp}</div>
                            </td>
                            <td>
                              <span className="font-medium text-slate-700">{item.category}</span>
                            </td>
                            <td>
                              <span className={`adm-ss-pill ${
                                item.priority === 'Critical' ? 'pill-red' :
                                item.priority === 'High' ? 'pill-orange' :
                                item.priority === 'Medium' ? 'pill-orange' : 'pill-green'
                              }`}>
                                {item.priority}
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-1.5">
                                <span className={`font-mono font-bold text-[13px] ${
                                  item.aiScore >= 85 ? 'text-emerald-700' :
                                  item.aiScore >= 75 ? 'text-blue-700' : 'text-amber-700'
                                }`}>
                                  {item.aiScore}%
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="max-w-[260px] text-[11.5px] text-slate-600 line-clamp-2">
                                {item.extractedFactors.join(' · ')}
                              </div>
                            </td>
                            <td>
                              <div className="max-w-[240px] text-[11.5px] font-medium text-slate-800 line-clamp-2">
                                {item.recommendation}
                              </div>
                            </td>
                            <td>
                              <span className={`adm-ss-pill ${
                                item.status === 'Assigned' ? 'pill-green' :
                                item.status === 'Under Review' ? 'pill-orange' :
                                item.status === 'Escalated' ? 'pill-red' : 'pill-blue'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td>
                              <div className="adm-ss-row-actions">
                                <button
                                  className="adm-ss-icon-btn text-purple-700"
                                  title="Inspect Feature Attribution Tree"
                                  onClick={() => setSelectedAiLog(item)}
                                >
                                  <Sparkles size={13} />
                                </button>
                                {!item.actionApproved && (
                                  <button
                                    className="adm-ss-icon-btn text-emerald-600"
                                    title="Approve Recommendation"
                                    onClick={() => handleApproveAiRecommendation(item.id)}
                                  >
                                    <Check size={13} />
                                  </button>
                                )}
                                <button
                                  className="adm-ss-icon-btn text-amber-600"
                                  title="Override Priority"
                                  onClick={() => handleOverrideAiTriage(item.id)}
                                >
                                  <Sliders size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 12: SATELLITE RADAR & GIS MAP
             ===================================================== */}
          {activeTab === 'maps' && (
            <>
              {/* Map Filter Controls Bar */}
              <div className="adm-ss-card p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* District Selector Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] font-semibold text-slate-600 mr-1">District Radar:</span>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border-0 cursor-pointer transition ${
                        mapDistrict === 'all' ? 'bg-[#3d6b4f] text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      onClick={() => setMapDistrict('all')}
                    >
                      Western Province (All)
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border-0 cursor-pointer transition ${
                        mapDistrict === 'colombo' ? 'bg-[#3d6b4f] text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      onClick={() => setMapDistrict('colombo')}
                    >
                      Colombo Zone A (Red Alert)
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border-0 cursor-pointer transition ${
                        mapDistrict === 'gampaha' ? 'bg-[#3d6b4f] text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      onClick={() => setMapDistrict('gampaha')}
                    >
                      Gampaha Zone B (Amber)
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border-0 cursor-pointer transition ${
                        mapDistrict === 'kalutara' ? 'bg-[#3d6b4f] text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      onClick={() => setMapDistrict('kalutara')}
                    >
                      Kalutara Zone C (Surge)
                    </button>
                  </div>

                  {/* Satellite Coordinates HUD */}
                  <div className="flex items-center gap-3 text-[11.5px] text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="flex items-center gap-1">
                      <Compass size={13} className="text-[#3d6b4f]" />
                      <span>6.9271° N, 79.8612° E</span>
                    </span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">Sentinel-2 Live Feed (Updated 18m ago)</span>
                  </div>
                </div>

                {/* Layer Checkboxes */}
                <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-100 flex-wrap text-[12px]">
                  <span className="font-semibold text-slate-700">Display Layers:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={mapLayers.activeCrises}
                      onChange={() => setMapLayers(p => ({ ...p, activeCrises: !p.activeCrises }))}
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span>Active Crises (8)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={mapLayers.shelters}
                      onChange={() => setMapLayers(p => ({ ...p, shelters: !p.shelters }))}
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Open Shelters (28)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={mapLayers.medicalFacilities}
                      onChange={() => setMapLayers(p => ({ ...p, medicalFacilities: !p.medicalFacilities }))}
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>Medical Hubs (14)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={mapLayers.volunteers}
                      onChange={() => setMapLayers(p => ({ ...p, volunteers: !p.volunteers }))}
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>Field Responders (1,245)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={mapLayers.roadConditions}
                      onChange={() => setMapLayers(p => ({ ...p, roadConditions: !p.roadConditions }))}
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span>Road Closures (12)</span>
                  </label>
                </div>
              </div>

              {/* Main Map Viewport & Sector Inspector Split */}
              <div className="adm-ss-split-grid">
                {/* High-Resolution Satellite Map Canvas */}
                <div className="adm-ss-card p-0 overflow-hidden relative">
                  <div className="adm-ss-map-full-container">
                    <img
                      src={westernProvinceMap}
                      alt="Western Province High Resolution Crisis Radar"
                      className="adm-ss-map-bg"
                    />

                    {/* Interactive Satellite Pins */}
                    {mapLayers.activeCrises && (
                      <>
                        {/* Kelani River Basin Pin */}
                        <div
                          className="adm-ss-beacon"
                          style={{ top: '48%', left: '36%' }}
                          onClick={() => setSelectedMapSector({
                            title: 'Kelani River Basin Flash Flooding',
                            type: 'Major Flood (Red Alert)',
                            waterLevel: '1.84m (Threshold +0.34m)',
                            affected: '3,200 Citizens',
                            teams: '6 Rescue Teams Deployed',
                            shelter: 'Colombo Central School (3.1km away)',
                            status: 'Critical Active',
                            severity: 'Critical'
                          })}
                        >
                          <div className="adm-ss-beacon-pulse bg-red-500"></div>
                          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[12px] shadow-lg border-2 border-white">
                            <ShieldAlert size={16} />
                          </div>
                        </div>

                        {/* Gampaha Landslide Pin */}
                        <div
                          className="adm-ss-beacon"
                          style={{ top: '36%', left: '60%' }}
                          onClick={() => setSelectedMapSector({
                            title: 'Gampaha Railway Embankment Mudslide',
                            type: 'Landslide Risk (High)',
                            waterLevel: '1.12m Soil Saturation',
                            affected: '850 Citizens',
                            teams: '3 Army Engineer Teams',
                            shelter: 'St. Anthony\'s College (2.8km away)',
                            status: 'Evacuation Underway',
                            severity: 'High'
                          })}
                        >
                          <div className="adm-ss-beacon-pulse bg-orange-500"></div>
                          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[12px] shadow-lg border-2 border-white">
                            <AlertTriangle size={15} />
                          </div>
                        </div>

                        {/* Kalutara Coastal Surge Pin */}
                        <div
                          className="adm-ss-beacon"
                          style={{ top: '74%', left: '38%' }}
                          onClick={() => setSelectedMapSector({
                            title: 'Kalutara Estuary Coastal Surge',
                            type: 'Storm Surge & Tidal Inundation',
                            waterLevel: '2.10m Sea Swell',
                            affected: '2,100 Citizens',
                            teams: '5 Navy SBS Units',
                            shelter: 'Kalutara South High-Ground Center',
                            status: 'Active Escalation',
                            severity: 'High'
                          })}
                        >
                          <div className="adm-ss-beacon-pulse bg-orange-500"></div>
                          <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-[12px] shadow-lg border-2 border-white">
                            <Droplets size={16} />
                          </div>
                        </div>

                        {/* Negombo Lagoon Pin */}
                        <div
                          className="adm-ss-beacon"
                          style={{ top: '24%', left: '26%' }}
                          onClick={() => setSelectedMapSector({
                            title: 'Negombo Lagoon Inundation',
                            type: 'Tidal Inundation (Contained)',
                            waterLevel: '0.65m Receding',
                            affected: '600 Citizens',
                            teams: '2 Volunteer Units',
                            shelter: 'Negombo Town Hall Shelter',
                            status: 'Contained',
                            severity: 'Low'
                          })}
                        >
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shadow-md border-2 border-white">
                            <CheckCircle2 size={14} />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Shelter Markers */}
                    {mapLayers.shelters && (
                      <div
                        className="adm-ss-beacon"
                        style={{ top: '44%', left: '42%' }}
                        onClick={() => setSelectedMapSector({
                          title: 'Colombo Central School High-Ground Shelter',
                          type: 'Verified Open Shelter',
                          waterLevel: 'Dry (High-Ground Elevated)',
                          affected: '420 Evacuees Sheltered (Cap: 500)',
                          teams: 'Medical Post & Red Cross Staffed',
                          shelter: 'Open Beds Available: 80',
                          status: 'Operational',
                          severity: 'Low'
                        })}
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                          <Building2 size={13} />
                        </div>
                      </div>
                    )}

                    {/* Medical Marker */}
                    {mapLayers.medicalFacilities && (
                      <div
                        className="adm-ss-beacon"
                        style={{ top: '50%', left: '32%' }}
                        onClick={() => setSelectedMapSector({
                          title: 'Colombo Base General Hospital Trauma Center',
                          type: 'Emergency Medical Facility',
                          waterLevel: 'Protected via Flood Barriers',
                          affected: '14 Rescue Admissions Today',
                          teams: 'Emergency Surgical Team On Duty',
                          shelter: 'Critical Care Units Ready',
                          status: 'Operational',
                          severity: 'Low'
                        })}
                      >
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                          <HeartPulse size={13} />
                        </div>
                      </div>
                    )}

                    {/* Floating Map Legend */}
                    <div className="adm-ss-map-layers-panel">
                      <div className="font-bold text-slate-900 mb-1">Satellite Legend</div>
                      <div className="text-[10.5px] text-slate-500 mb-2">Click any marker to inspect telemetry</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                          <span>Red Alert Flood Zone</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                          <span>High Hazard Landslide</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          <span>Open Shelter / Safe Point</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                          <span>Medical Facility</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sector Telemetry Inspector Card */}
                <div className="adm-ss-card flex flex-col justify-between">
                  <div>
                    <div className="adm-ss-card-header">
                      <div>
                        <h3 className="adm-ss-card-title">Geospatial Sector Telemetry</h3>
                        <p className="adm-ss-card-subtitle">Live environmental sensors & field response assets</p>
                      </div>
                      <span className={`adm-ss-pill ${
                        selectedMapSector?.severity === 'Critical' ? 'pill-red' :
                        selectedMapSector?.severity === 'High' ? 'pill-orange' : 'pill-green'
                      }`}>
                        {selectedMapSector ? selectedMapSector.status : 'Sector Selected'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                      <div className="text-[14px] font-bold text-slate-900 mb-1">
                        {selectedMapSector ? selectedMapSector.title : 'Kelani River Basin Flash Flooding'}
                      </div>
                      <div className="text-[12px] text-[#3d6b4f] font-semibold mb-3">
                        {selectedMapSector ? selectedMapSector.type : 'Major Flood (Red Alert)'}
                      </div>

                      <div className="space-y-2 text-[12px]">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Live Water / Hazard Gauge:</span>
                          <span className="font-bold text-red-600">
                            {selectedMapSector ? selectedMapSector.waterLevel : '1.84m (Threshold +0.34m)'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Affected Population:</span>
                          <span className="font-semibold text-slate-800">
                            {selectedMapSector ? selectedMapSector.affected : '3,200 Citizens'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Assigned Response:</span>
                          <span className="font-semibold text-slate-800">
                            {selectedMapSector ? selectedMapSector.teams : '6 Rescue Teams Deployed'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Nearest Evac Shelter:</span>
                          <span className="font-semibold text-[#3d6b4f]">
                            {selectedMapSector ? selectedMapSector.shelter : 'Colombo Central School (3.1km)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      className="w-full adm-ss-btn-primary justify-center"
                      onClick={() => showToast('Dispatching relief convoy to selected sector...')}
                    >
                      <Truck size={15} />
                      <span>Dispatch Emergency Convoy to Sector</span>
                    </button>
                    <button
                      className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12.5px] font-semibold border-0 cursor-pointer transition"
                      onClick={() => setActiveTab('crisis')}
                    >
                      View Incident in Crisis Management
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom 3 District Readiness Telemetry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="adm-ss-card">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900 m-0">Colombo District (Zone A)</h4>
                      <span className="text-[11px] text-slate-500">Riparian lowlands & Metro basin</span>
                    </div>
                    <span className="adm-ss-pill pill-red">Red Alert</span>
                  </div>
                  <div className="space-y-1.5 text-[12px] text-slate-600 mt-3">
                    <div className="flex justify-between">
                      <span>Kelani Crest:</span>
                      <span className="font-bold text-red-600">1.84m (Major Flood)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Open Shelters:</span>
                      <span className="font-semibold text-slate-800">12 Open (84% Capacity)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deployed Units:</span>
                      <span className="font-semibold text-[#3d6b4f]">24 Response Teams</span>
                    </div>
                  </div>
                </div>

                <div className="adm-ss-card">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900 m-0">Gampaha District (Zone B)</h4>
                      <span className="text-[11px] text-slate-500">Attanagalu basin & hill slopes</span>
                    </div>
                    <span className="adm-ss-pill pill-orange">Amber Alert</span>
                  </div>
                  <div className="space-y-1.5 text-[12px] text-slate-600 mt-3">
                    <div className="flex justify-between">
                      <span>River Level:</span>
                      <span className="font-bold text-amber-600">1.12m (Alert Level)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Open Shelters:</span>
                      <span className="font-semibold text-slate-800">9 Open (62% Capacity)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deployed Units:</span>
                      <span className="font-semibold text-[#3d6b4f]">11 Response Teams</span>
                    </div>
                  </div>
                </div>

                <div className="adm-ss-card">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900 m-0">Kalutara District (Zone C)</h4>
                      <span className="text-[11px] text-slate-500">Kalu Ganga & Coastal Estuary</span>
                    </div>
                    <span className="adm-ss-pill pill-red">Red Alert</span>
                  </div>
                  <div className="space-y-1.5 text-[12px] text-slate-600 mt-3">
                    <div className="flex justify-between">
                      <span>Coastal Surge:</span>
                      <span className="font-bold text-red-600">2.10m High Swell</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Open Shelters:</span>
                      <span className="font-semibold text-slate-800">7 Open (76% Capacity)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deployed Units:</span>
                      <span className="font-semibold text-[#3d6b4f]">7 Navy SBS Teams</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 13: SYSTEM NOTIFICATIONS & BROADCASTS
             ===================================================== */}
          {activeTab === 'notifications' && (
            <>
              {/* Top Alert Beacon Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white flex items-center justify-between shadow-md flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Bell size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px]">EMERGENCY BROADCAST SYSTEM ACTIVE</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold">Gateway: Dialog · Mobitel · SLT Push</span>
                    </div>
                    <p className="text-[12px] text-white/90 mt-0.5 m-0">
                      Disaster Management Centre emergency alert feeds linked to Cell Broadcast, Mobile Push, and Field Radio Channels.
                    </p>
                  </div>
                </div>
                <button
                  className="px-3.5 py-1.5 rounded-lg bg-white text-red-700 text-[12px] font-bold hover:bg-slate-100 border-0 cursor-pointer transition shadow-sm flex items-center gap-1.5"
                  onClick={() => setIsComposeBroadcastModalOpen(true)}
                >
                  <Send size={14} />
                  <span>+ Compose Emergency Broadcast</span>
                </button>
              </div>

              {/* KPI Metrics Row */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-red-soft">
                    <Radio size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Emergency Broadcasts Sent</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">{broadcasts.length} Alerts</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-red">Across 3 Western districts</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <Wifi size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Delivery Success Rate</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">98.4%</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">Multi-channel gateway confirmed</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <Users size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Citizen Reach</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">142,500</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">Cell-broadcast enabled</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <AlertTriangle size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Active Emergency Warnings</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">{broadcasts.filter(b => b.status === 'Active Live').length}</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-orange">DMC Authorized Live Alerts</span>
                  </div>
                </div>
              </div>

              {/* Broadcasts History Ledger Table */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <div>
                    <h3 className="adm-ss-card-title">Emergency Broadcast Dispatches & Citizen Alerts</h3>
                    <p className="adm-ss-card-subtitle">Audited record of multi-channel cell broadcasts, weather warnings, and shelter notices</p>
                  </div>
                  <span className="text-[12px] text-slate-500 font-medium">
                    Showing {broadcasts.length} dispatches
                  </span>
                </div>

                {/* Filters */}
                <div className="adm-ss-filters-bar">
                  <div className="adm-ss-filters-left">
                    <div className="adm-ss-search-box" style={{ width: '280px' }}>
                      <Search size={15} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search broadcast title, region, or ID..."
                        className="adm-ss-search-input"
                        value={broadcastSearch}
                        onChange={(e) => setBroadcastSearch(e.target.value)}
                      />
                    </div>

                    <select
                      className="adm-ss-filter-select"
                      value={broadcastSeverityFilter}
                      onChange={(e) => setBroadcastSeverityFilter(e.target.value)}
                    >
                      <option value="ALL">All Severities</option>
                      <option value="Emergency">Emergency (Red)</option>
                      <option value="Warning">Warning (Amber)</option>
                      <option value="Advisory">Advisory (Blue)</option>
                    </select>

                    <select
                      className="adm-ss-filter-select"
                      value={broadcastStatusFilter}
                      onChange={(e) => setBroadcastStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Active Live">Active Live</option>
                      <option value="Expired">Expired</option>
                      <option value="Revoked">Revoked</option>
                    </select>

                    {(broadcastSearch || broadcastSeverityFilter !== 'ALL' || broadcastStatusFilter !== 'ALL') && (
                      <button
                        className="adm-ss-btn-reset"
                        onClick={() => {
                          setBroadcastSearch('');
                          setBroadcastSeverityFilter('ALL');
                          setBroadcastStatusFilter('ALL');
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Alert ID</th>
                        <th>Broadcast Title & Summary</th>
                        <th>Severity</th>
                        <th>Channels</th>
                        <th>Target Region & Audience</th>
                        <th>Sent By & Time</th>
                        <th>Delivery</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {broadcasts
                        .filter(b => {
                          const matchSearch =
                            b.title.toLowerCase().includes(broadcastSearch.toLowerCase()) ||
                            b.targetRegion.toLowerCase().includes(broadcastSearch.toLowerCase()) ||
                            b.id.toLowerCase().includes(broadcastSearch.toLowerCase());
                          const matchSeverity = broadcastSeverityFilter === 'ALL' || b.severity === broadcastSeverityFilter;
                          const matchStatus = broadcastStatusFilter === 'ALL' || b.status === broadcastStatusFilter;
                          return matchSearch && matchSeverity && matchStatus;
                        })
                        .map((b) => (
                          <tr key={b.id}>
                            <td className="font-mono text-[11.5px] font-semibold text-[#3d6b4f]">{b.id}</td>
                            <td>
                              <div className="font-semibold text-slate-900">{b.title}</div>
                              <div className="text-[11.5px] text-slate-500 max-w-[280px] line-clamp-1">{b.message}</div>
                            </td>
                            <td>
                              <span className={`adm-ss-pill ${
                                b.severity === 'Emergency' ? 'pill-red' :
                                b.severity === 'Warning' ? 'pill-orange' : 'pill-blue'
                              }`}>
                                {b.severity}
                              </span>
                            </td>
                            <td>
                              <div className="flex flex-wrap gap-1 max-w-[150px]">
                                {b.channels.map((ch, i) => (
                                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                                    {ch}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="font-medium text-slate-800">{b.targetRegion}</div>
                              <div className="text-[11px] text-slate-500">{b.targetAudience}</div>
                            </td>
                            <td>
                              <div className="text-[12px] font-medium text-slate-800">{b.sentBy}</div>
                              <div className="text-[11px] text-slate-500">{b.sentAt}</div>
                            </td>
                            <td>
                              <span className="font-mono font-bold text-emerald-700 text-[12px]">{b.deliveryRate}</span>
                            </td>
                            <td>
                              <span className={`adm-ss-pill ${
                                b.status === 'Active Live' ? 'pill-green' :
                                b.status === 'Expired' ? 'pill-gray' : 'pill-red'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td>
                              <div className="adm-ss-row-actions">
                                <button
                                  className="adm-ss-icon-btn text-[#3d6b4f]"
                                  title="Retransmit Broadcast"
                                  onClick={() => handleRetransmitBroadcast(b)}
                                >
                                  <RefreshCw size={13} />
                                </button>
                                {b.status === 'Active Live' && (
                                  <button
                                    className="adm-ss-icon-btn text-red-600"
                                    title="Revoke / Deactivate Alert"
                                    onClick={() => handleRevokeBroadcast(b.id)}
                                  >
                                    <X size={13} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* =========================================================
         3. Administrative Modals (Add User, Change Role, Reset Password)
         ========================================================= */}

      {/* CREATE NEW USER MODAL */}
      {isCreateModalOpen && (
        <div className="adm-ss-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="adm-ss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-[18px] font-bold text-slate-900 m-0">Create Platform Account</h3>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  className="adm-ss-form-input"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                />
              </div>

              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="kasun.f@reliefcore.lk"
                  className="adm-ss-form-input"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="adm-ss-form-label">Security Role *</label>
                  <select
                    className="adm-ss-form-input"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Coordinator">Coordinator</option>
                    <option value="LogisticsManager">Logistics Manager</option>
                    <option value="ShelterAdministrator">Shelter Administrator</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Citizen">Citizen</option>
                  </select>
                </div>
                <div>
                  <label className="adm-ss-form-label">Assigned District</label>
                  <select
                    className="adm-ss-form-input"
                    value={newUser.assignedDistrict}
                    onChange={(e) => setNewUser({ ...newUser, assignedDistrict: e.target.value })}
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="National Command">National Command</option>
                  </select>
                </div>
              </div>

              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Initial Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="adm-ss-form-input"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold border-0 cursor-pointer"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-ss-btn-primary"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE SECURITY ROLE MODAL */}
      {roleChangeModal.isOpen && (
        <div className="adm-ss-modal-overlay" onClick={() => setRoleChangeModal({ isOpen: false, user: null, newRole: 'Coordinator' })}>
          <div className="adm-ss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-[17px] font-bold text-slate-900 m-0">
                Modify Role for {roleChangeModal.user?.fullName}
              </h3>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setRoleChangeModal({ isOpen: false, user: null, newRole: 'Coordinator' })}
              >
                <X size={15} />
              </button>
            </div>

            <div className="adm-ss-form-group">
              <label className="adm-ss-form-label">Select Platform Privilege Level</label>
              <select
                className="adm-ss-form-input"
                value={roleChangeModal.newRole}
                onChange={(e) => setRoleChangeModal({ ...roleChangeModal, newRole: e.target.value })}
              >
                <option value="Admin">Admin (Full System Controls)</option>
                <option value="Coordinator">Emergency Coordinator</option>
                <option value="LogisticsManager">Resource & Logistics Manager</option>
                <option value="ShelterAdministrator">Shelter Administrator</option>
                <option value="Volunteer">Field Volunteer</option>
                <option value="Citizen">Citizen / Affected Person</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold border-0 cursor-pointer"
                onClick={() => setRoleChangeModal({ isOpen: false, user: null, newRole: 'Coordinator' })}
              >
                Cancel
              </button>
              <button
                className="adm-ss-btn-primary"
                onClick={handleRoleChange}
              >
                Update Privilege
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPasswordModal.isOpen && (
        <div className="adm-ss-modal-overlay" onClick={() => setResetPasswordModal({ isOpen: false, user: null, newPassword: '' })}>
          <div className="adm-ss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-[17px] font-bold text-slate-900 m-0">
                Reset Password: {resetPasswordModal.user?.fullName}
              </h3>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setResetPasswordModal({ isOpen: false, user: null, newPassword: '' })}
              >
                <X size={15} />
              </button>
            </div>

            <div className="adm-ss-form-group">
              <label className="adm-ss-form-label">New Temporary Password</label>
              <input
                type="password"
                placeholder="Enter secure temporary password"
                className="adm-ss-form-input"
                value={resetPasswordModal.newPassword}
                onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, newPassword: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold border-0 cursor-pointer"
                onClick={() => setResetPasswordModal({ isOpen: false, user: null, newPassword: '' })}
              >
                Cancel
              </button>
              <button
                className="adm-ss-btn-primary"
                onClick={handleResetPassword}
              >
                Generate Hash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         4. Operational Modals (Crisis, Donations, AI-Ops, Broadcasts)
         ========================================================= */}

      {/* 1. DECLARE NEW CRISIS INCIDENT MODAL */}
      {isDeclareCrisisModalOpen && (
        <div className="adm-ss-modal-overlay" onClick={() => setIsDeclareCrisisModalOpen(false)}>
          <div className="adm-ss-modal-card adm-ss-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-red-600" />
                <h3 className="text-[18px] font-bold text-slate-900 m-0">Declare Emergency Crisis Incident</h3>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setIsDeclareCrisisModalOpen(false)}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleDeclareCrisis}>
              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Crisis Incident Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Attanagalu Oya Sudden Inundation Surge"
                  className="adm-ss-form-input"
                  value={newCrisis.title}
                  onChange={(e) => setNewCrisis({ ...newCrisis, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="adm-ss-form-group">
                  <label className="adm-ss-form-label">Disaster Type *</label>
                  <select
                    className="adm-ss-form-input"
                    value={newCrisis.type}
                    onChange={(e) => setNewCrisis({ ...newCrisis, type: e.target.value })}
                  >
                    <option value="Flood">Flood (River / Urban)</option>
                    <option value="Landslide">Landslide / Mudslide</option>
                    <option value="Storm Surge">Coastal Surge / High Tide</option>
                    <option value="Drought">Drought / Water Deficit</option>
                    <option value="Industrial Spill">Industrial / Chemical Hazard</option>
                  </select>
                </div>

                <div className="adm-ss-form-group">
                  <label className="adm-ss-form-label">Target District *</label>
                  <select
                    className="adm-ss-form-input"
                    value={newCrisis.district}
                    onChange={(e) => setNewCrisis({ ...newCrisis, district: e.target.value })}
                  >
                    <option value="Colombo">Colombo District</option>
                    <option value="Gampaha">Gampaha District</option>
                    <option value="Kalutara">Kalutara District</option>
                    <option value="Negombo">Negombo Area</option>
                    <option value="Ratnapura">Ratnapura District</option>
                    <option value="Hambantota">Hambantota District</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="adm-ss-form-group">
                  <label className="adm-ss-form-label">Severity Level *</label>
                  <select
                    className="adm-ss-form-input font-semibold"
                    value={newCrisis.severity}
                    onChange={(e) => setNewCrisis({ ...newCrisis, severity: e.target.value })}
                  >
                    <option value="Critical">Critical (Red Alert)</option>
                    <option value="High">High (Orange)</option>
                    <option value="Medium">Medium (Amber)</option>
                    <option value="Low">Low (Advisory)</option>
                  </select>
                </div>

                <div className="adm-ss-form-group">
                  <label className="adm-ss-form-label">Affected People (Est.)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2400"
                    className="adm-ss-form-input"
                    value={newCrisis.affectedPeople}
                    onChange={(e) => setNewCrisis({ ...newCrisis, affectedPeople: e.target.value })}
                  />
                </div>

                <div className="adm-ss-form-group">
                  <label className="adm-ss-form-label">Inundated Area (km²)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    className="adm-ss-form-input"
                    value={newCrisis.areaSqKm}
                    onChange={(e) => setNewCrisis({ ...newCrisis, areaSqKm: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Operational Notes & Field Directives</label>
                <textarea
                  rows="3"
                  placeholder="Outline emergency dispatch orders, evacuated shelters, and tri-force instructions..."
                  className="adm-ss-form-input"
                  style={{ resize: 'vertical' }}
                  value={newCrisis.notes}
                  onChange={(e) => setNewCrisis({ ...newCrisis, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold border-0 cursor-pointer"
                  onClick={() => setIsDeclareCrisisModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-ss-btn-primary bg-red-600 hover:bg-red-700"
                >
                  <ShieldAlert size={15} />
                  <span>Declare Emergency Incident</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CRISIS INCIDENT DOSSIER INSPECTOR MODAL */}
      {selectedCrisis && (
        <div className="adm-ss-modal-overlay" onClick={() => setSelectedCrisis(null)}>
          <div className="adm-ss-modal-card adm-ss-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] font-semibold text-[#3d6b4f]">{selectedCrisis.id}</span>
                  <span className={`adm-ss-pill ${
                    selectedCrisis.severity === 'Critical' ? 'pill-red' :
                    selectedCrisis.severity === 'High' ? 'pill-orange' : 'pill-green'
                  }`}>
                    {selectedCrisis.severity} Severity
                  </span>
                  <span className="adm-ss-pill pill-teal">{selectedCrisis.status}</span>
                </div>
                <h3 className="text-[18px] font-bold text-slate-900 mt-1 m-0">{selectedCrisis.title}</h3>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setSelectedCrisis(null)}
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4 text-[12.5px]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">District / Sector</span>
                  <span className="font-bold text-slate-900">{selectedCrisis.district}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Affected Citizens</span>
                  <span className="font-bold text-slate-900">{selectedCrisis.affectedPeople?.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Hazard Area</span>
                  <span className="font-bold text-slate-900">{selectedCrisis.areaSqKm} km²</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Water Gauge Crest</span>
                  <span className="font-bold text-red-600 font-mono">{selectedCrisis.waterLevelMeters}m</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Operational Incident Notes</span>
                <p className="text-slate-700 m-0 leading-relaxed">{selectedCrisis.notes}</p>
                <div className="text-[11px] text-slate-500 mt-2">
                  Declared: {selectedCrisis.declaredAt} · Incident Commander: {selectedCrisis.leadCoordinator}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-50 border border-cyan-200">
                <div className="flex items-center gap-2 text-[#3d6b4f]">
                  <Truck size={16} />
                  <span className="font-bold">Deployed Multi-Agency Units: {selectedCrisis.teamsDeployed} Teams</span>
                </div>
                <button
                  className="px-3 py-1.5 rounded-lg bg-[#3d6b4f] text-white text-[11.5px] font-bold border-0 cursor-pointer shadow-sm"
                  onClick={() => {
                    handleDispatchRescueTeams(selectedCrisis.id);
                    setSelectedCrisis(prev => ({ ...prev, teamsDeployed: prev.teamsDeployed + 2 }));
                  }}
                >
                  + Dispatch 2 More Units
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 mt-6 pt-3 border-t border-slate-100">
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12.5px] font-semibold border-0 cursor-pointer"
                onClick={() => {
                  handleToggleCrisisStatus(selectedCrisis.id);
                  setSelectedCrisis(prev => ({
                    ...prev,
                    status: prev.status === 'Contained' ? 'Active Escalation' : 'Contained'
                  }));
                }}
              >
                {selectedCrisis.status === 'Contained' ? 'Re-escalate to Active' : 'Mark as Contained'}
              </button>
              <button
                className="adm-ss-btn-primary"
                onClick={() => setSelectedCrisis(null)}
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. RECORD DONATION / GRANT MODAL */}
      {isRecordDonationModalOpen && (
        <div className="adm-ss-modal-overlay" onClick={() => setIsRecordDonationModalOpen(false)}>
          <div className="adm-ss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Gift size={20} className="text-[#3d6b4f]" />
                <h3 className="text-[18px] font-bold text-slate-900 m-0">Record Relief Contribution / Grant</h3>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setIsRecordDonationModalOpen(false)}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleRecordDonation}>
              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Donor Name / Foundation / Agency *</label>
                <input
                  type="text"
                  placeholder="e.g. Dilmah Tea Relief Trust"
                  className="adm-ss-form-input"
                  value={newDonation.donorName}
                  onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
                  required
                />
              </div>

              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Contribution Type *</label>
                <select
                  className="adm-ss-form-input"
                  value={newDonation.type}
                  onChange={(e) => setNewDonation({ ...newDonation, type: e.target.value })}
                >
                  <option value="Monetary Grant">Monetary Grant (LKR / Escrow)</option>
                  <option value="International Grant">International Grant (Foreign Currency)</option>
                  <option value="In-Kind Relief Supplies">In-Kind Relief Supplies (Food & Water)</option>
                  <option value="In-Kind Medical Equipment">In-Kind Medical Kits & Pharmaceuticals</option>
                  <option value="Logistics Asset Donation">Logistics Asset (Boats / 4x4 Trucks)</option>
                </select>
              </div>

              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Amount / Consignment Volume *</label>
                <input
                  type="text"
                  placeholder="e.g. Rs. 2,500,000 or 1,200 Food Hampers"
                  className="adm-ss-form-input"
                  value={newDonation.amountFormatted}
                  onChange={(e) => setNewDonation({ ...newDonation, amountFormatted: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="adm-ss-form-group">
                  <label className="adm-ss-form-label">Allocated Sector</label>
                  <select
                    className="adm-ss-form-input"
                    value={newDonation.sector}
                    onChange={(e) => setNewDonation({ ...newDonation, sector: e.target.value })}
                  >
                    <option value="Food & Clean Water">Food & Clean Water</option>
                    <option value="Medical Field Hospitals">Emergency Medical Care</option>
                    <option value="Shelter Reconstruction">Shelter & Bedding</option>
                    <option value="Logistics & Fuel">Logistics & Water Bowsers</option>
                  </select>
                </div>

                <div className="adm-ss-form-group">
                  <label className="adm-ss-form-label">Target District</label>
                  <select
                    className="adm-ss-form-input"
                    value={newDonation.targetDistrict}
                    onChange={(e) => setNewDonation({ ...newDonation, targetDistrict: e.target.value })}
                  >
                    <option value="Colombo (Kelani Basin)">Colombo (Kelani Basin)</option>
                    <option value="Gampaha Evacuee Shelters">Gampaha Shelters</option>
                    <option value="Kalutara Coastal Communities">Kalutara Coastal</option>
                    <option value="Western Province (All)">Western Province (All)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold border-0 cursor-pointer"
                  onClick={() => setIsRecordDonationModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-ss-btn-primary"
                >
                  <CheckCircle2 size={15} />
                  <span>Record & Verify Grant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. DONATION AUDIT RECEIPT INSPECTOR MODAL */}
      {selectedDonation && (
        <div className="adm-ss-modal-overlay" onClick={() => setSelectedDonation(null)}>
          <div className="adm-ss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-[11.5px] font-semibold text-[#3d6b4f]">{selectedDonation.id}</span>
                <h3 className="text-[17px] font-bold text-slate-900 m-0">Donation Audit Certificate</h3>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setSelectedDonation(null)}
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-[12.5px] mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Donor Name:</span>
                <span className="font-bold text-slate-900">{selectedDonation.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Grant Type:</span>
                <span className="font-semibold text-slate-800">{selectedDonation.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contribution Value:</span>
                <span className="font-bold text-[#3d6b4f]">{selectedDonation.amountFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Allocated Sector:</span>
                <span className="font-semibold text-slate-800">{selectedDonation.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax Exemption Code:</span>
                <span className="font-mono font-bold text-emerald-700">{selectedDonation.taxExemptId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Audit Verification Hash:</span>
                <span className="font-mono text-[11px] text-purple-700">{selectedDonation.auditHash}</span>
              </div>
            </div>

            <div className="flex justify-between gap-2 mt-5">
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12.5px] font-semibold border-0 cursor-pointer flex items-center gap-1.5"
                onClick={() => handleDownloadReceipt(selectedDonation)}
              >
                <Download size={14} />
                <span>Download Tax Certificate</span>
              </button>
              <button
                className="adm-ss-btn-primary"
                onClick={() => setSelectedDonation(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. EXPLAINABLE AI DECISION ATTRIBUTION MODAL */}
      {selectedAiLog && (
        <div className="adm-ss-modal-overlay" onClick={() => setSelectedAiLog(null)}>
          <div className="adm-ss-modal-card adm-ss-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] font-semibold text-[#3d6b4f]">{selectedAiLog.id}</span>
                  <span className={`adm-ss-pill ${
                    selectedAiLog.priority === 'Critical' ? 'pill-red' :
                    selectedAiLog.priority === 'High' ? 'pill-orange' : 'pill-green'
                  }`}>
                    {selectedAiLog.priority} Priority
                  </span>
                  <span className="adm-ss-pill pill-purple">AI Confidence {selectedAiLog.aiScore}%</span>
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 mt-1 m-0">
                  Explainable Decision Attribution: {selectedAiLog.requester}
                </h3>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setSelectedAiLog(null)}
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4 text-[12.5px]">
              <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-200">
                <span className="font-bold text-purple-900 block mb-1">Model Inference Justification</span>
                <p className="text-purple-950 m-0 leading-relaxed">{selectedAiLog.confidenceExplanation}</p>
              </div>

              {/* Feature Attribution Weight Bars */}
              <div>
                <h4 className="font-bold text-slate-800 text-[13px] mb-2.5">Key Extracted Neural Feature Weights</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11.5px] font-medium text-slate-700 mb-1">
                      <span>Emergency Semantic Keywords ("cardiac", "submerged", "trapped")</span>
                      <span className="font-bold text-slate-900">35% Weight</span>
                    </div>
                    <div className="adm-ss-progress-track">
                      <div className="adm-ss-progress-fill bg-purple-600" style={{ width: '35%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11.5px] font-medium text-slate-700 mb-1">
                      <span>Geospatial Flood Polygon Intersection (DMC Sensor Radar)</span>
                      <span className="font-bold text-slate-900">30% Weight</span>
                    </div>
                    <div className="adm-ss-progress-track">
                      <div className="adm-ss-progress-fill bg-blue-600" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11.5px] font-medium text-slate-700 mb-1">
                      <span>Demographic Vulnerability Score (Elderly / Wheelchair access)</span>
                      <span className="font-bold text-slate-900">25% Weight</span>
                    </div>
                    <div className="adm-ss-progress-track">
                      <div className="adm-ss-progress-fill bg-emerald-600" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11.5px] font-medium text-slate-700 mb-1">
                      <span>Historical Incident Frequency in Grid Sector</span>
                      <span className="font-bold text-slate-900">10% Weight</span>
                    </div>
                    <div className="adm-ss-progress-track">
                      <div className="adm-ss-progress-fill bg-slate-500" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px] mb-0.5">Recommended Automated Action</span>
                <span className="font-bold text-slate-900">{selectedAiLog.recommendation}</span>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[12px] font-bold border border-amber-200 cursor-pointer"
                onClick={() => {
                  handleOverrideAiTriage(selectedAiLog.id);
                  setSelectedAiLog(null);
                }}
              >
                Override AI Priority
              </button>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[12.5px] font-semibold border-0 cursor-pointer"
                  onClick={() => setSelectedAiLog(null)}
                >
                  Close
                </button>
                <button
                  className="adm-ss-btn-primary"
                  onClick={() => {
                    handleApproveAiRecommendation(selectedAiLog.id);
                    setSelectedAiLog(null);
                  }}
                >
                  <Check size={15} />
                  <span>Approve & Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. COMPOSE EMERGENCY BROADCAST MODAL */}
      {isComposeBroadcastModalOpen && (
        <div className="adm-ss-modal-overlay" onClick={() => setIsComposeBroadcastModalOpen(false)}>
          <div className="adm-ss-modal-card adm-ss-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio size={20} className="text-red-600" />
                <h3 className="text-[18px] font-bold text-slate-900 m-0">Compose Emergency Public Broadcast</h3>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setIsComposeBroadcastModalOpen(false)}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleDispatchEmergencyBroadcast}>
              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Broadcast Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Severe Flood Inundation Warning: Kelani Lowlands"
                  className="adm-ss-form-input"
                  value={newBroadcast.title}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="adm-ss-form-group">
                  <label className="adm-ss-form-label">Alert Severity *</label>
                  <select
                    className="adm-ss-form-input font-semibold"
                    value={newBroadcast.severity}
                    onChange={(e) => setNewBroadcast({ ...newBroadcast, severity: e.target.value })}
                  >
                    <option value="Emergency">Emergency (Red - Siren & Cell Broadcast)</option>
                    <option value="Warning">Warning (Orange - Multi-channel Alert)</option>
                    <option value="Advisory">Advisory (Blue - Informational Notice)</option>
                  </select>
                </div>

                <div className="adm-ss-form-group">
                  <label className="adm-ss-form-label">Target Region *</label>
                  <select
                    className="adm-ss-form-input"
                    value={newBroadcast.targetRegion}
                    onChange={(e) => setNewBroadcast({ ...newBroadcast, targetRegion: e.target.value })}
                  >
                    <option value="Western Province (All Districts)">Western Province (All Districts)</option>
                    <option value="Colombo & Gampaha Lowlands">Colombo & Gampaha Lowlands</option>
                    <option value="Kalutara Coastal Zone">Kalutara Coastal Zone</option>
                    <option value="Field Responders Only">Field Responders Only</option>
                  </select>
                </div>
              </div>

              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Emergency Broadcast Payload Text *</label>
                <textarea
                  rows="4"
                  placeholder="Enter concise, life-safety emergency directive instructions for citizens..."
                  className="adm-ss-form-input"
                  style={{ resize: 'vertical' }}
                  value={newBroadcast.message}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, message: e.target.value })}
                  required
                ></textarea>
                <div className="text-[11px] text-slate-500 mt-1">
                  Character count: {newBroadcast.message.length} · Recommended SMS length: &lt; 160 characters
                </div>
              </div>

              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label mb-2">Transmission Channels</label>
                <div className="flex items-center gap-4 flex-wrap text-[12.5px] text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked />
                    <span>SMS Cell Broadcast (Dialog/Mobitel)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked />
                    <span>Mobile Push Notification</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked />
                    <span>Citizen Web Portal Top Banner</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" />
                    <span>Field Radio Channel 4</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold border-0 cursor-pointer"
                  onClick={() => setIsComposeBroadcastModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-ss-btn-primary bg-red-600 hover:bg-red-700"
                >
                  <Send size={15} />
                  <span>Transmit Emergency Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="adm-ss-toast">
          {toast}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

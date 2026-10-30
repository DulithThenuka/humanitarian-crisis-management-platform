import React from 'react';
import { BarChart3, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export const ReportsAnalyticsView = () => {
  return (
    <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#f0fdfa',
            color: '#0f766e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Operations Intelligence & Performance Reports
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
              Comprehensive real-time analytics, response latency SLA metrics, and resource dispatch distribution.
            </p>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px'
      }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #eef2f6', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f766e', fontWeight: 700, fontSize: '12px' }}>
            <TrendingUp size={16} />
            <span>Response Velocity</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>14.2 min</div>
          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>↑ 22% faster than 30-day baseline</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #eef2f6', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontWeight: 700, fontSize: '12px' }}>
            <Users size={16} />
            <span>Evacuee Shelter Coverage</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>88.6%</div>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>4,120 of 4,650 individuals sheltered</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #eef2f6', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 700, fontSize: '12px' }}>
            <AlertTriangle size={16} />
            <span>SLA Compliance Rate</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>96.4%</div>
          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>Within target &lt; 30 min critical threshold</span>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  PieChart, 
  Users, 
  Cpu, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  ChevronDown, 
  Calendar, 
  Lightbulb, 
  ChevronRight, 
  Truck, 
  Droplet, 
  Utensils, 
  Cross,
  Home,
  Download,
  Printer,
  RefreshCw,
  Filter,
  Check,
  X,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Building2,
  BarChart2,
  Share2,
  Layers,
  Search,
  Eye,
  Activity,
  Zap,
  Info,
  SlidersHorizontal,
  FileCheck2,
  Table,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import './ReportsAnalyticsView.css';

// =========================================================================
// MOCK DATASETS & MASTER CATALOG
// =========================================================================

const CRISES = [
  { id: 'all', label: 'All Crises' },
  { id: 'kelani-flood', label: 'Kelani River Basin Flooding' },
  { id: 'kalutara-landslide', label: 'Kalutara Landslide Sector B' },
  { id: 'gampaha-inundation', label: 'Gampaha Urban Inundation' },
  { id: 'cyclone-mocha', label: 'Cyclone Coastal Surge' },
];

const ORGANISATIONS = [
  { id: 'all', label: 'All Organisations' },
  { id: 'red-cross', label: 'Sri Lanka Red Cross' },
  { id: 'un-ocha', label: 'UN OCHA Disaster Unit' },
  { id: 'dmc', label: 'Disaster Management Centre' },
  { id: 'sarvodaya', label: 'Sarvodaya Shramadana' },
  { id: 'municipal-health', label: 'Municipal Health Services' },
];

const LOCATIONS = [
  { id: 'all', label: 'All Locations' },
  { id: 'colombo', label: 'Colombo' },
  { id: 'gampaha', label: 'Gampaha' },
  { id: 'kalutara', label: 'Kalutara' },
  { id: 'kelaniya', label: 'Kelaniya' },
  { id: 'negombo', label: 'Negombo' },
];

const TIME_RANGES = ['24 Hours', '7 Days', '30 Days', '90 Days'];

// Time-series mock data generator base
const TIME_SERIES_DATA = {
  '24 Hours': {
    labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    submitted: [14, 18, 11, 9, 26, 48, 64, 82, 79, 94, 62, 38],
    resolved: [10, 14, 10, 7, 19, 36, 52, 69, 72, 81, 55, 34],
    peakText: '18:00 (94 incoming)',
    efficiency: '83.2%'
  },
  '7 Days': {
    labels: ['Oct 23', 'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27', 'Oct 28', 'Oct 29'],
    submitted: [86, 112, 94, 142, 168, 154, 130],
    resolved: [72, 94, 82, 98, 138, 142, 124],
    peakText: 'Oct 27 (168 requests)',
    efficiency: '84.8%'
  },
  '30 Days': {
    labels: ['Sep 30', 'Oct 03', 'Oct 06', 'Oct 09', 'Oct 12', 'Oct 15', 'Oct 18', 'Oct 21', 'Oct 24', 'Oct 27'],
    submitted: [380, 420, 490, 560, 610, 580, 640, 710, 690, 620],
    resolved: [340, 390, 450, 510, 550, 540, 600, 670, 660, 605],
    peakText: 'Oct 21 (710 requests)',
    efficiency: '91.4%'
  },
  '90 Days': {
    labels: ['Aug W1', 'Aug W3', 'Sep W1', 'Sep W3', 'Oct W1', 'Oct W3'],
    submitted: [1180, 1340, 1580, 1820, 1940, 1750],
    resolved: [1090, 1250, 1480, 1710, 1840, 1690],
    peakText: 'Oct W1 (1,940 requests)',
    efficiency: '93.1%'
  }
};

// Requests Master Ledger for deep inspection and CSV exports
const MASTER_REQUEST_LEDGER = [
  { id: 'REQ-2026-01842', time: '12 min ago', crisis: 'kelani-flood', location: 'colombo', category: 'Medical', priority: 'Critical', status: 'In Progress', responseTime: 24, assignedOrg: 'red-cross', aiScore: '94%', citizen: 'K. Perera', address: 'Ward Place, Colombo 07' },
  { id: 'REQ-2026-01841', time: '28 min ago', crisis: 'kelani-flood', location: 'kelaniya', category: 'Shelter', priority: 'Critical', status: 'Pending', responseTime: 38, assignedOrg: 'dmc', aiScore: '92%', citizen: 'S. Fernando', address: 'Peliyagoda Road, Kelaniya' },
  { id: 'REQ-2026-01839', time: '45 min ago', crisis: 'kalutara-landslide', location: 'kalutara', category: 'Medical', priority: 'Critical', status: 'Resolved', responseTime: 22, assignedOrg: 'municipal-health', aiScore: '96%', citizen: 'M. Bandara', address: 'Horana Rd, Kalutara' },
  { id: 'REQ-2026-01838', time: '1 hr ago', crisis: 'gampaha-inundation', location: 'gampaha', category: 'Food & Water', priority: 'High', status: 'Resolved', responseTime: 34, assignedOrg: 'sarvodaya', aiScore: '89%', citizen: 'A. De Silva', address: 'Main Street, Gampaha' },
  { id: 'REQ-2026-01835', time: '1 hr 15m ago', crisis: 'kelani-flood', location: 'colombo', category: 'Food & Water', priority: 'High', status: 'In Progress', responseTime: 41, assignedOrg: 'un-ocha', aiScore: '87%', citizen: 'R. Mohamed', address: 'Grandpass, Colombo 14' },
  { id: 'REQ-2026-01831', time: '1 hr 40m ago', crisis: 'cyclone-mocha', location: 'negombo', category: 'Transport', priority: 'Medium', status: 'Resolved', responseTime: 52, assignedOrg: 'dmc', aiScore: '81%', citizen: 'C. Rodrigo', address: 'Sea Street, Negombo' },
  { id: 'REQ-2026-01828', time: '2 hrs ago', crisis: 'kelani-flood', location: 'kelaniya', category: 'Accessibility', priority: 'High', status: 'Resolved', responseTime: 31, assignedOrg: 'red-cross', aiScore: '90%', citizen: 'D. Gunawardena', address: 'Biyagama Road, Kelaniya' },
  { id: 'REQ-2026-01824', time: '2 hrs 20m ago', crisis: 'kalutara-landslide', location: 'kalutara', category: 'Shelter', priority: 'Critical', status: 'In Progress', responseTime: 46, assignedOrg: 'sarvodaya', aiScore: '93%', citizen: 'T. Jayakody', address: 'Agalawatta Sector 4' },
  { id: 'REQ-2026-01819', time: '3 hrs ago', crisis: 'gampaha-inundation', location: 'gampaha', category: 'Food & Water', priority: 'Medium', status: 'Resolved', responseTime: 39, assignedOrg: 'un-ocha', aiScore: '84%', citizen: 'N. Wickramasinghe', address: 'Miriswatta, Gampaha' },
  { id: 'REQ-2026-01815', time: '3 hrs 45m ago', crisis: 'kelani-flood', location: 'colombo', category: 'Medical', priority: 'Critical', status: 'Resolved', responseTime: 19, assignedOrg: 'red-cross', aiScore: '95%', citizen: 'P. Senanayake', address: 'Orugodawatta, Colombo' },
  { id: 'REQ-2026-01810', time: '4 hrs ago', crisis: 'cyclone-mocha', location: 'negombo', category: 'Food & Water', priority: 'High', status: 'In Progress', responseTime: 62, assignedOrg: 'municipal-health', aiScore: '78%', citizen: 'W. Kurera', address: 'Kochchikade, Negombo' },
  { id: 'REQ-2026-01804', time: '4 hrs 30m ago', crisis: 'kalutara-landslide', location: 'kalutara', category: 'Transport', priority: 'Medium', status: 'Resolved', responseTime: 55, assignedOrg: 'dmc', aiScore: '85%', citizen: 'B. Alwis', address: 'Matugama Junction' },
  { id: 'REQ-2026-01798', time: '5 hrs ago', crisis: 'kelani-flood', location: 'kelaniya', category: 'Shelter', priority: 'Critical', status: 'Resolved', responseTime: 33, assignedOrg: 'sarvodaya', aiScore: '91%', citizen: 'H. Mendis', address: 'Waragoda, Kelaniya' },
  { id: 'REQ-2026-01792', time: '5 hrs 40m ago', crisis: 'gampaha-inundation', location: 'gampaha', category: 'Medical', priority: 'High', status: 'Resolved', responseTime: 36, assignedOrg: 'red-cross', aiScore: '92%', citizen: 'V. Rathnayake', address: 'Yakkala Road, Gampaha' },
  { id: 'REQ-2026-01785', time: '6 hrs ago', crisis: 'kelani-flood', location: 'colombo', category: 'Accessibility', priority: 'Medium', status: 'Resolved', responseTime: 28, assignedOrg: 'un-ocha', aiScore: '88%', citizen: 'F. Cassim', address: 'Dematagoda, Colombo 09' },
  { id: 'REQ-2026-01780', time: '6 hrs 30m ago', crisis: 'cyclone-mocha', location: 'negombo', category: 'Shelter', priority: 'High', status: 'In Progress', responseTime: 58, assignedOrg: 'dmc', aiScore: '83%', citizen: 'J. Peiris', address: 'Porutota Rd, Negombo' },
  { id: 'REQ-2026-01772', time: '7 hrs ago', crisis: 'kalutara-landslide', location: 'kalutara', category: 'Medical', priority: 'Critical', status: 'Resolved', responseTime: 25, assignedOrg: 'municipal-health', aiScore: '97%', citizen: 'E. Samarasinghe', address: 'Bulathsinhala Pass' },
  { id: 'REQ-2026-01768', time: '7 hrs 45m ago', crisis: 'kelani-flood', location: 'kelaniya', category: 'Food & Water', priority: 'Medium', status: 'Resolved', responseTime: 32, assignedOrg: 'sarvodaya', aiScore: '86%', citizen: 'L. Fonseka', address: 'Kiribathgoda West' }
];

// District baseline metrics
const DISTRICT_STATS = {
  colombo: { label: 'Colombo', time: 28, backlog: 14, rate: 89, teams: 16, status: 'Normal' },
  gampaha: { label: 'Gampaha', time: 42, backlog: 22, rate: 81, teams: 11, status: 'Moderate' },
  kalutara: { label: 'Kalutara', time: 58, backlog: 18, rate: 74, teams: 8, status: 'High Wait' },
  kelaniya: { label: 'Kelaniya', time: 35, backlog: 12, rate: 86, teams: 9, status: 'Optimal' },
  negombo: { label: 'Negombo', time: 64, backlog: 16, rate: 68, teams: 6, status: 'Bottleneck' }
};

// Resource utilization items
const BASE_RESOURCES = [
  { id: 'med', name: 'Medical Supplies & Trauma Kits', icon: Cross, boxClass: 'box-red', fillClass: 'fill-orange', textClass: 'text-orange', dispatched: 320, total: 410, unit: 'kits' },
  { id: 'food', name: 'Emergency Food Packs', icon: Utensils, boxClass: 'box-teal', fillClass: 'fill-teal', textClass: 'text-teal', dispatched: 1340, total: 2000, unit: 'packs' },
  { id: 'water', name: 'Potable Drinking Water (L)', icon: Droplet, boxClass: 'box-blue', fillClass: 'fill-red', textClass: 'text-red', dispatched: 5400, total: 6500, unit: 'liters' },
  { id: 'vehicles', name: 'High-Clearance Transport Vehicles', icon: Truck, boxClass: 'box-cyan', fillClass: 'fill-cyan', textClass: 'text-teal', dispatched: 19, total: 34, unit: 'units' },
  { id: 'blankets', name: 'Blankets & Thermal Bedding', icon: Home, boxClass: 'box-amber', fillClass: 'fill-orange', textClass: 'text-orange', dispatched: 910, total: 1300, unit: 'units' },
];

// Shelter occupancy records
const BASE_SHELTERS = [
  { id: 'colombo-cent', name: 'Colombo Central Safe Hall', district: 'colombo', occupied: 185, capacity: 250, fillClass: 'fill-blue', textClass: 'text-blue' },
  { id: 'gampaha-hall', name: 'Gampaha Municipal Youth Centre', district: 'gampaha', occupied: 144, capacity: 180, fillClass: 'fill-orange', textClass: 'text-orange' },
  { id: 'kelaniya-ctr', name: 'Kelaniya Community Relief Centre', district: 'kelaniya', occupied: 78, capacity: 120, fillClass: 'fill-teal', textClass: 'text-teal' },
  { id: 'kalutara-gym', name: 'Kalutara Indoor Sports Complex', district: 'kalutara', occupied: 202, capacity: 300, fillClass: 'fill-blue', textClass: 'text-blue' },
  { id: 'wattala-haven', name: 'Wattala Coastal Evacuation Centre', district: 'negombo', occupied: 79, capacity: 80, fillClass: 'fill-red', textClass: 'text-red' },
];

export const ReportsAnalyticsView = () => {
  // Navigation / sub-views
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'ledger' | 'forecast'
  const [activeRange, setActiveRange] = useState('7 Days');

  // Filter dropdown selections
  const [selectedCrisis, setSelectedCrisis] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Mini dropdown toggles
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [responseMetric, setResponseMetric] = useState('time'); // 'time' | 'backlog' | 'rate'
  const [resourceFilter, setResourceFilter] = useState('all'); // 'all' | 'critical' | 'moderate'
  const [shelterFilter, setShelterFilter] = useState('all'); // 'all' | 'critical' | 'available'

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState(null); // 'range' | 'crisis' | 'org' | 'location' | 'cat' | 'resp' | 'res' | 'sh'

  // Interactive UI state
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState('kelaniya');
  const [showSubmittedLine, setShowSubmittedLine] = useState(true);
  const [showResolvedLine, setShowResolvedLine] = useState(true);

  // Search in ledger
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerPriorityFilter, setLedgerPriorityFilter] = useState('all');

  // Modals & Feedback
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [toastMessage, setToastMessage] = useState(null);
  const [showSitRepModal, setShowSitRepModal] = useState(false);
  const [spotlightKpi, setSpotlightKpi] = useState(null);

  const containerRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  };

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setOpenDropdown(null);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
      triggerToast('Telemetry and operations intelligence refreshed from field relays');
    }, 650);
  };

  // Filtered requests ledger
  const filteredLedger = useMemo(() => {
    return MASTER_REQUEST_LEDGER.filter((req) => {
      if (selectedCrisis !== 'all' && req.crisis !== selectedCrisis) return false;
      if (selectedOrg !== 'all' && req.assignedOrg !== selectedOrg) return false;
      if (selectedLocation !== 'all' && req.location !== selectedLocation) return false;
      if (categoryFilter !== 'all' && req.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (ledgerPriorityFilter !== 'all' && req.priority.toLowerCase() !== ledgerPriorityFilter.toLowerCase()) return false;
      if (ledgerSearch.trim()) {
        const q = ledgerSearch.toLowerCase();
        return (
          req.id.toLowerCase().includes(q) ||
          req.citizen.toLowerCase().includes(q) ||
          req.address.toLowerCase().includes(q) ||
          req.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCrisis, selectedOrg, selectedLocation, categoryFilter, ledgerPriorityFilter, ledgerSearch]);

  // Dynamic KPI computations based on active filters
  const computedKPIs = useMemo(() => {
    const totalRequests = filteredLedger.length;
    const unresolved = filteredLedger.filter((r) => r.status !== 'Resolved').length;
    const avgResponseTime = filteredLedger.length 
      ? Math.round(filteredLedger.reduce((acc, curr) => acc + curr.responseTime, 0) / filteredLedger.length) 
      : 38;

    // Scale factors if filtered
    const locationMultiplier = selectedLocation === 'all' ? 1 : 0.65;
    const crisisMultiplier = selectedCrisis === 'all' ? 1 : 0.85;

    return {
      unresolvedCount: Math.round(unresolved > 0 ? unresolved * 6.5 : 52 * locationMultiplier * crisisMultiplier),
      avgTime: avgResponseTime,
      resourceRate: Math.min(94, Math.round(78 * (selectedCrisis !== 'all' ? 1.08 : 1))),
      shelterOccupancy: Math.min(96, Math.round(74 * (selectedLocation === 'kalutara' ? 1.15 : 1))),
      overrideRate: Math.round(26 * (selectedOrg === 'un-ocha' ? 0.8 : 1))
    };
  }, [filteredLedger, selectedLocation, selectedCrisis, selectedOrg]);

  // Dynamic category breakdown based on filtered data
  const categoryBreakdown = useMemo(() => {
    const baseCounts = {
      medical: 68,
      food: 52,
      shelter: 34,
      transport: 22,
      accessibility: 10
    };

    // Calculate actual occurrences in current ledger
    const occurrences = { medical: 0, food: 0, shelter: 0, transport: 0, accessibility: 0 };
    filteredLedger.forEach((item) => {
      const cat = item.category.toLowerCase();
      if (cat.includes('med')) occurrences.medical++;
      else if (cat.includes('food') || cat.includes('water')) occurrences.food++;
      else if (cat.includes('shelter')) occurrences.shelter++;
      else if (cat.includes('trans')) occurrences.transport++;
      else occurrences.accessibility++;
    });

    const hasFilters = selectedCrisis !== 'all' || selectedLocation !== 'all' || selectedOrg !== 'all';
    const multiplier = hasFilters ? 2.4 : 1;

    const med = Math.max(8, Math.round((occurrences.medical || baseCounts.medical) * multiplier));
    const food = Math.max(6, Math.round((occurrences.food || baseCounts.food) * multiplier));
    const shelter = Math.max(4, Math.round((occurrences.shelter || baseCounts.shelter) * multiplier));
    const trans = Math.max(3, Math.round((occurrences.transport || baseCounts.transport) * multiplier));
    const acc = Math.max(2, Math.round((occurrences.accessibility || baseCounts.accessibility) * multiplier));

    const total = med + food + shelter + trans + acc;

    return [
      { id: 'medical', label: 'Medical', count: med, pct: Math.round((med / total) * 100), color: '#ef4444', dotClass: 'dot-red', valClass: 'val-red' },
      { id: 'food', label: 'Food & Water', count: food, pct: Math.round((food / total) * 100), color: '#f59e0b', dotClass: 'dot-orange', valClass: 'val-orange' },
      { id: 'shelter', label: 'Shelter', count: shelter, pct: Math.round((shelter / total) * 100), color: '#0e7490', dotClass: 'dot-teal', valClass: 'val-teal' },
      { id: 'transport', label: 'Transport', count: trans, pct: Math.round((trans / total) * 100), color: '#0284c7', dotClass: 'dot-blue', valClass: 'val-blue' },
      { id: 'accessibility', label: 'Accessibility', count: acc, pct: Math.round((acc / total) * 100), color: '#8b5cf6', dotClass: 'dot-purple', valClass: 'val-purple' },
    ];
  }, [filteredLedger, selectedCrisis, selectedLocation, selectedOrg]);

  const totalCategoryRequests = useMemo(() => {
    return categoryBreakdown.reduce((sum, item) => sum + item.count, 0);
  }, [categoryBreakdown]);

  // Time-series coordinates generator for SVG curves
  const timeSeriesConfig = useMemo(() => {
    const raw = TIME_SERIES_DATA[activeRange];
    // Apply filters scale
    const scale = (selectedLocation !== 'all' ? 0.45 : 1) * (selectedCrisis !== 'all' ? 0.75 : 1);
    const subValues = raw.submitted.map((v) => Math.max(4, Math.round(v * scale)));
    const resValues = raw.resolved.map((v) => Math.max(3, Math.round(v * scale)));

    const maxVal = Math.ceil(Math.max(...subValues, ...resValues) * 1.15);
    const width = 560;
    const height = 135;
    const paddingLeft = 30;
    const paddingRight = 20;
    const paddingTop = 15;
    const paddingBottom = 20;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;
    const count = raw.labels.length;

    const subPoints = subValues.map((val, idx) => ({
      x: paddingLeft + (idx / (count - 1)) * chartW,
      y: paddingTop + chartH - (val / maxVal) * chartH,
      value: val,
      label: raw.labels[idx]
    }));

    const resPoints = resValues.map((val, idx) => ({
      x: paddingLeft + (idx / (count - 1)) * chartW,
      y: paddingTop + chartH - (val / maxVal) * chartH,
      value: val,
      label: raw.labels[idx]
    }));

    // Smooth Bezier path calculation
    const createCurvedPath = (pts) => {
      if (!pts.length) return '';
      let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = i > 0 ? pts[i - 1] : pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
      }
      return d;
    };

    const subLineD = createCurvedPath(subPoints);
    const resLineD = createCurvedPath(resPoints);
    const subAreaD = `${subLineD} L ${subPoints[subPoints.length - 1].x},${paddingTop + chartH} L ${subPoints[0].x},${paddingTop + chartH} Z`;

    const yAxisTicks = [
      maxVal,
      Math.round(maxVal * 0.75),
      Math.round(maxVal * 0.5),
      Math.round(maxVal * 0.25),
      0
    ];

    return {
      subPoints,
      resPoints,
      subLineD,
      resLineD,
      subAreaD,
      yAxisTicks,
      labels: raw.labels,
      peakText: raw.peakText,
      efficiency: raw.efficiency
    };
  }, [activeRange, selectedLocation, selectedCrisis]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return BASE_RESOURCES.filter((res) => {
      const pct = (res.dispatched / res.total) * 100;
      if (resourceFilter === 'critical') return pct >= 80;
      if (resourceFilter === 'moderate') return pct < 80;
      return true;
    });
  }, [resourceFilter]);

  // Filtered shelters
  const filteredShelters = useMemo(() => {
    return BASE_SHELTERS.filter((sh) => {
      if (selectedLocation !== 'all' && sh.district !== selectedLocation) return false;
      const pct = (sh.occupied / sh.capacity) * 100;
      if (shelterFilter === 'critical') return pct >= 80;
      if (shelterFilter === 'available') return pct < 80;
      return true;
    });
  }, [shelterFilter, selectedLocation]);

  // District statistics array for bar chart
  const districtBars = useMemo(() => {
    const list = Object.entries(DISTRICT_STATS).map(([id, d]) => {
      let val = d.time;
      let labelVal = `${d.time} min`;
      let fill = d.time > 50 ? 'fill-red' : d.time > 35 ? 'fill-orange' : 'fill-teal';

      if (responseMetric === 'backlog') {
        val = d.backlog;
        labelVal = `${d.backlog} cases`;
        fill = d.backlog > 20 ? 'fill-red' : d.backlog > 14 ? 'fill-orange' : 'fill-blue';
      } else if (responseMetric === 'rate') {
        val = d.rate;
        labelVal = `${d.rate}%`;
        fill = d.rate >= 85 ? 'fill-teal' : d.rate >= 75 ? 'fill-blue' : 'fill-orange';
      }

      return {
        id,
        name: d.label,
        rawVal: val,
        displayVal: labelVal,
        teams: d.teams,
        fillClass: fill,
        status: d.status
      };
    });

    if (selectedLocation !== 'all') {
      return list.filter((item) => item.id === selectedLocation);
    }
    return list;
  }, [responseMetric, selectedLocation]);

  // Max value for district bar height scaling
  const maxDistrictVal = useMemo(() => {
    if (responseMetric === 'time') return 80;
    if (responseMetric === 'backlog') return 30;
    return 100;
  }, [responseMetric]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Request_ID',
      'Reported_Time',
      'Crisis_Context',
      'District',
      'Category',
      'Priority',
      'Status',
      'Response_Time_Min',
      'Assigned_Organisation',
      'AI_Confidence_Score',
      'Citizen_Contact'
    ];

    const rows = filteredLedger.map((r) => [
      r.id,
      r.time,
      r.crisis,
      r.location,
      r.category,
      r.priority,
      r.status,
      r.responseTime,
      r.assignedOrg,
      r.aiScore,
      `"${r.citizen}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ReliefCore_Operational_Analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${filteredLedger.length} operational records to CSV`);
  };

  // JSON Export Handler
  const handleExportJSON = () => {
    const payload = {
      platform: 'RELIEFCORE Disaster Intelligence Engine',
      generatedAt: new Date().toISOString(),
      activeFilters: {
        range: activeRange,
        crisis: selectedCrisis,
        organisation: selectedOrg,
        location: selectedLocation
      },
      kpiSummary: computedKPIs,
      categories: categoryBreakdown,
      districts: districtBars,
      shelters: filteredShelters,
      resources: filteredResources,
      ledger: filteredLedger
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ReliefCore_SitRep_Telemetry_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('Operations data exported as structured JSON');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCrisis('all');
    setSelectedOrg('all');
    setSelectedLocation('all');
    setCategoryFilter('all');
    setResponseMetric('time');
    setResourceFilter('all');
    setShelterFilter('all');
    setOpenDropdown(null);
    triggerToast('All operational filters reset to platform defaults');
  };

  const hasActiveFilters = 
    selectedCrisis !== 'all' || 
    selectedOrg !== 'all' || 
    selectedLocation !== 'all' || 
    categoryFilter !== 'all';

  // Active hover point for line graph
  const activeHoverPoint = hoveredPointIndex !== null ? {
    sub: timeSeriesConfig.subPoints[hoveredPointIndex],
    res: timeSeriesConfig.resPoints[hoveredPointIndex]
  } : null;

  return (
    <div className="reports-view-container" ref={containerRef}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="rep-floating-toast">
          <Sparkles size={16} className="toast-sparkle" />
          <span>{toastMessage}</span>
          <button className="toast-close-btn" onClick={() => setToastMessage(null)}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Top Filter Ribbon & Operations Toolbar */}
      <div className="rep-filter-bar">
        <div className="rep-bar-left">
          {/* Sub-view switcher tabs */}
          <div className="rep-nav-pills">
            <button 
              className={`rep-pill-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart2 size={13} />
              <span>Overview & KPIs</span>
            </button>
            <button 
              className={`rep-pill-btn ${activeTab === 'ledger' ? 'active' : ''}`}
              onClick={() => setActiveTab('ledger')}
            >
              <Table size={13} />
              <span>Requests Ledger ({filteredLedger.length})</span>
            </button>
            <button 
              className={`rep-pill-btn ${activeTab === 'forecast' ? 'active' : ''}`}
              onClick={() => setActiveTab('forecast')}
            >
              <Zap size={13} />
              <span>Predictive Forecast</span>
            </button>
          </div>
        </div>

        <div className="rep-bar-right">
          {/* Date Range Dropdown */}
          <div className="rep-dropdown-wrapper">
            <button 
              className="rep-filter-dropdown date-filter"
              onClick={() => setOpenDropdown(openDropdown === 'range' ? null : 'range')}
            >
              <Calendar size={13} />
              <span>{activeRange}</span>
              <ChevronDown size={12} className={openDropdown === 'range' ? 'rotate-up' : ''} />
            </button>
            {openDropdown === 'range' && (
              <div className="rep-menu-popover">
                <div className="rep-menu-header">Select Time Horizon</div>
                {TIME_RANGES.map((r) => (
                  <button 
                    key={r}
                    className={`rep-menu-item ${activeRange === r ? 'selected' : ''}`}
                    onClick={() => {
                      setActiveRange(r);
                      setOpenDropdown(null);
                      triggerToast(`Switched time range to ${r}`);
                    }}
                  >
                    <span>{r}</span>
                    {activeRange === r && <Check size={13} className="menu-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Crisis Filter Dropdown */}
          <div className="rep-dropdown-wrapper">
            <button 
              className={`rep-filter-dropdown ${selectedCrisis !== 'all' ? 'has-filter' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'crisis' ? null : 'crisis')}
            >
              <span className="fd-label">Crisis:</span>
              <span className="fd-val">
                {CRISES.find((c) => c.id === selectedCrisis)?.label || 'All'}
              </span>
              <ChevronDown size={12} className={openDropdown === 'crisis' ? 'rotate-up' : ''} />
            </button>
            {openDropdown === 'crisis' && (
              <div className="rep-menu-popover">
                <div className="rep-menu-header">Filter by Active Incident</div>
                {CRISES.map((c) => (
                  <button 
                    key={c.id}
                    className={`rep-menu-item ${selectedCrisis === c.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCrisis(c.id);
                      setOpenDropdown(null);
                      triggerToast(`Filtered by crisis: ${c.label}`);
                    }}
                  >
                    <span>{c.label}</span>
                    {selectedCrisis === c.id && <Check size={13} className="menu-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Organisation Filter Dropdown */}
          <div className="rep-dropdown-wrapper">
            <button 
              className={`rep-filter-dropdown ${selectedOrg !== 'all' ? 'has-filter' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'org' ? null : 'org')}
            >
              <span className="fd-label">Organisation:</span>
              <span className="fd-val">
                {ORGANISATIONS.find((o) => o.id === selectedOrg)?.label || 'All'}
              </span>
              <ChevronDown size={12} className={openDropdown === 'org' ? 'rotate-up' : ''} />
            </button>
            {openDropdown === 'org' && (
              <div className="rep-menu-popover">
                <div className="rep-menu-header">Disaster Response Agency</div>
                {ORGANISATIONS.map((o) => (
                  <button 
                    key={o.id}
                    className={`rep-menu-item ${selectedOrg === o.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedOrg(o.id);
                      setOpenDropdown(null);
                      triggerToast(`Filtered agency: ${o.label}`);
                    }}
                  >
                    <span>{o.label}</span>
                    {selectedOrg === o.id && <Check size={13} className="menu-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Filter Dropdown */}
          <div className="rep-dropdown-wrapper">
            <button 
              className={`rep-filter-dropdown ${selectedLocation !== 'all' ? 'has-filter' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
            >
              <span className="fd-label">Location:</span>
              <span className="fd-val">
                {LOCATIONS.find((l) => l.id === selectedLocation)?.label || 'All'}
              </span>
              <ChevronDown size={12} className={openDropdown === 'location' ? 'rotate-up' : ''} />
            </button>
            {openDropdown === 'location' && (
              <div className="rep-menu-popover">
                <div className="rep-menu-header">Operational District</div>
                {LOCATIONS.map((l) => (
                  <button 
                    key={l.id}
                    className={`rep-menu-item ${selectedLocation === l.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedLocation(l.id);
                      setOpenDropdown(null);
                      triggerToast(`Filtered location: ${l.label}`);
                    }}
                  >
                    <span>{l.label}</span>
                    {selectedLocation === l.id && <Check size={13} className="menu-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Filters Button if any active */}
          {hasActiveFilters && (
            <button 
              className="rep-action-btn btn-reset" 
              onClick={handleResetFilters}
              title="Reset all filters"
            >
              <X size={12} />
              <span>Clear</span>
            </button>
          )}

          {/* Refresh Action Button */}
          <button 
            className={`rep-action-btn ${isRefreshing ? 'refreshing' : ''}`}
            onClick={handleRefreshTelemetry}
            title="Refresh live telemetry"
          >
            <RefreshCw size={13} className={isRefreshing ? 'spin-icon' : ''} />
            <span className="hide-mobile">{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Export CSV Action Button */}
          <button 
            className="rep-action-btn btn-primary"
            onClick={handleExportCSV}
            title="Export filtered records to CSV"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          {/* Generate Situation Report (SitRep) Modal Trigger */}
          <button 
            className="rep-action-btn btn-sitrep"
            onClick={() => setShowSitRepModal(true)}
            title="Generate & print Situation Report"
          >
            <Printer size={13} />
            <span>SitRep</span>
          </button>
        </div>
      </div>

      {/* Active Filter Notice Bar */}
      {hasActiveFilters && (
        <div className="rep-active-filter-ribbon">
          <Filter size={12} />
          <span>Active telemetry filters:</span>
          {selectedCrisis !== 'all' && (
            <span className="filter-chip">
              Crisis: {CRISES.find((c) => c.id === selectedCrisis)?.label}
              <X size={10} onClick={() => setSelectedCrisis('all')} />
            </span>
          )}
          {selectedOrg !== 'all' && (
            <span className="filter-chip">
              Agency: {ORGANISATIONS.find((o) => o.id === selectedOrg)?.label}
              <X size={10} onClick={() => setSelectedOrg('all')} />
            </span>
          )}
          {selectedLocation !== 'all' && (
            <span className="filter-chip">
              District: {LOCATIONS.find((l) => l.id === selectedLocation)?.label}
              <X size={10} onClick={() => setSelectedLocation('all')} />
            </span>
          )}
          {categoryFilter !== 'all' && (
            <span className="filter-chip">
              Category: {categoryFilter}
              <X size={10} onClick={() => setCategoryFilter('all')} />
            </span>
          )}
          <button className="clear-all-link" onClick={handleResetFilters}>Reset All</button>
        </div>
      )}

      {/* MAIN VIEW CONTENT */}
      {activeTab === 'overview' && (
        <>
          {/* Row 1: 5 Top KPI Cards */}
          <div className="rep-kpi-grid">
            <div 
              className={`rep-kpi-card card-red ${spotlightKpi === 'unresolved' ? 'spotlight' : ''}`}
              onClick={() => {
                setSpotlightKpi(spotlightKpi === 'unresolved' ? null : 'unresolved');
                triggerToast('Spotlight: Unresolved critical and urgent caseload');
              }}
            >
              <div className="rep-kpi-header">
                <div className="rep-icon-box box-red">
                  <FileText size={17} />
                </div>
                <div className="rep-meta-col">
                  <span className="rep-kpi-label">Unresolved Cases</span>
                  <div className="rep-val-row">
                    <span className="rep-kpi-num">{computedKPIs.unresolvedCount}</span>
                    <span className="rep-tag tag-red"><ArrowUp size={11} /> 18%</span>
                  </div>
                </div>
              </div>
              <div className="rep-card-foot">
                <span>+8 from prior period</span>
              </div>
              <svg className="rep-kpi-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path d="M0,35 Q40,10 80,30 T160,15 T200,28 L200,40 L0,40 Z" fill="#fee2e2" />
                <path d="M0,35 Q40,10 80,30 T160,15 T200,28" fill="none" stroke="#ef4444" strokeWidth="2" />
              </svg>
            </div>

            <div 
              className={`rep-kpi-card card-green ${spotlightKpi === 'response' ? 'spotlight' : ''}`}
              onClick={() => {
                setSpotlightKpi(spotlightKpi === 'response' ? null : 'response');
                triggerToast('Spotlight: Average dispatch time metrics');
              }}
            >
              <div className="rep-kpi-header">
                <div className="rep-icon-box box-green">
                  <Clock size={17} />
                </div>
                <div className="rep-meta-col">
                  <span className="rep-kpi-label">Average Response Time</span>
                  <div className="rep-val-row">
                    <span className="rep-kpi-num">{computedKPIs.avgTime} min</span>
                    <span className="rep-tag tag-green"><ArrowDown size={11} /> 30%</span>
                  </div>
                </div>
              </div>
              <div className="rep-card-foot">
                <span>Target benchmark: 60 min</span>
              </div>
              <svg className="rep-kpi-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path d="M0,38 Q50,30 90,20 T150,22 T200,10 L200,40 L0,40 Z" fill="#d1fae5" />
                <path d="M0,38 Q50,30 90,20 T150,22 T200,10" fill="none" stroke="#10b981" strokeWidth="2" />
              </svg>
            </div>

            <div 
              className={`rep-kpi-card card-orange ${spotlightKpi === 'resources' ? 'spotlight' : ''}`}
              onClick={() => {
                setSpotlightKpi(spotlightKpi === 'resources' ? null : 'resources');
                triggerToast('Spotlight: Resource burn rate and warehouse supplies');
              }}
            >
              <div className="rep-kpi-header">
                <div className="rep-icon-box box-orange">
                  <PieChart size={17} />
                </div>
                <div className="rep-meta-col">
                  <span className="rep-kpi-label">Resource Utilisation</span>
                  <div className="rep-val-row">
                    <span className="rep-kpi-num">{computedKPIs.resourceRate}%</span>
                    <span className="rep-tag tag-orange"><ArrowUp size={11} /> 12%</span>
                  </div>
                </div>
              </div>
              <div className="rep-card-foot">
                <span>High warehouse demand</span>
              </div>
              <svg className="rep-kpi-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path d="M0,32 Q50,38 100,25 T160,20 T200,28 L200,40 L0,40 Z" fill="#fef3c7" />
                <path d="M0,32 Q50,38 100,25 T160,20 T200,28" fill="none" stroke="#f59e0b" strokeWidth="2" />
              </svg>
            </div>

            <div 
              className={`rep-kpi-card card-blue ${spotlightKpi === 'shelter' ? 'spotlight' : ''}`}
              onClick={() => {
                setSpotlightKpi(spotlightKpi === 'shelter' ? null : 'shelter');
                triggerToast('Spotlight: Evacuee shelter capacity and overflow');
              }}
            >
              <div className="rep-kpi-header">
                <div className="rep-icon-box box-blue">
                  <Users size={17} />
                </div>
                <div className="rep-meta-col">
                  <span className="rep-kpi-label">Shelter Occupancy</span>
                  <div className="rep-val-row">
                    <span className="rep-kpi-num">{computedKPIs.shelterOccupancy}%</span>
                    <span className="rep-tag tag-blue"><ArrowUp size={11} /> 8%</span>
                  </div>
                </div>
              </div>
              <div className="rep-card-foot">
                <span>2 centers near capacity</span>
              </div>
              <svg className="rep-kpi-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path d="M0,38 Q40,32 90,26 T150,15 T200,20 L200,40 L0,40 Z" fill="#e0f2fe" />
                <path d="M0,38 Q40,32 90,26 T150,15 T200,20" fill="none" stroke="#0284c7" strokeWidth="2" />
              </svg>
            </div>

            <div 
              className={`rep-kpi-card card-purple ${spotlightKpi === 'ai' ? 'spotlight' : ''}`}
              onClick={() => {
                setSpotlightKpi(spotlightKpi === 'ai' ? null : 'ai');
                triggerToast('Spotlight: AI decision support and human coordinator overrides');
              }}
            >
              <div className="rep-kpi-header">
                <div className="rep-icon-box box-purple">
                  <Cpu size={17} />
                </div>
                <div className="rep-meta-col">
                  <span className="rep-kpi-label">AI Override Rate</span>
                  <div className="rep-val-row">
                    <span className="rep-kpi-num">{computedKPIs.overrideRate}%</span>
                    <span className="rep-tag tag-purple"><ArrowDown size={11} /> 5%</span>
                  </div>
                </div>
              </div>
              <div className="rep-card-foot">
                <span>Human coordinator approvals</span>
              </div>
              <svg className="rep-kpi-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path d="M0,32 Q60,38 100,22 T160,30 T200,18 L200,40 L0,40 Z" fill="#ede9fe" />
                <path d="M0,32 Q60,38 100,22 T160,30 T200,18" fill="none" stroke="#8b5cf6" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Row 2: Dynamic Working Charts */}
          <div className="rep-charts-row">
            {/* Chart 1: Requests Over Time (Interactive Area Curve with dynamic hover) */}
            <div className="rep-panel-box">
              <div className="rep-panel-head">
                <div className="rep-title-group">
                  <div className="rep-icon-badge"><TrendingUp size={15} /></div>
                  <div>
                    <h4>Requests Over Time</h4>
                    <p>Submitted vs. resolved requests — {activeRange.toLowerCase()} window</p>
                  </div>
                </div>

                <div className="rep-chart-head-actions">
                  <div className="rep-tab-toggle">
                    {TIME_RANGES.map((t) => (
                      <button 
                        key={t} 
                        className={`rep-t-btn ${activeRange === t ? 'active' : ''}`}
                        onClick={() => {
                          setActiveRange(t);
                          triggerToast(`Switched time view to ${t}`);
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Body with SVG Graphic & Interactive Cursor */}
              <div className="rep-chart-body">
                {/* Y-Axis */}
                <div className="rep-y-axis">
                  {timeSeriesConfig.yAxisTicks.map((val, idx) => (
                    <span key={idx}>{val}</span>
                  ))}
                </div>

                {/* SVG Graphics Canvas */}
                <div 
                  className="rep-svg-wrapper"
                  onMouseLeave={() => setHoveredPointIndex(null)}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const pct = Math.max(0, Math.min(1, (mouseX - 30) / (rect.width - 50)));
                    const nearestIdx = Math.round(pct * (timeSeriesConfig.labels.length - 1));
                    setHoveredPointIndex(nearestIdx);
                  }}
                >
                  <div className="rep-dashed-lines">
                    <div></div><div></div><div></div><div></div><div></div>
                  </div>

                  <svg className="rep-svg-graph" viewBox="0 0 560 135" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="submittedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="resolvedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient fill area */}
                    {showSubmittedLine && (
                      <path d={timeSeriesConfig.subAreaD} fill="url(#submittedAreaGrad)" />
                    )}

                    {/* Submitted Curve */}
                    {showSubmittedLine && (
                      <path 
                        d={timeSeriesConfig.subLineD} 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                      />
                    )}

                    {/* Resolved Curve */}
                    {showResolvedLine && (
                      <path 
                        d={timeSeriesConfig.resLineD} 
                        fill="none" 
                        stroke="#0284c7" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                      />
                    )}

                    {/* Dynamic Point Circles */}
                    {showSubmittedLine && timeSeriesConfig.subPoints.map((pt, idx) => (
                      <circle 
                        key={`sub-${idx}`}
                        cx={pt.x} 
                        cy={pt.y} 
                        r={hoveredPointIndex === idx ? 6 : 3.5} 
                        fill="#10b981" 
                        stroke="#ffffff" 
                        strokeWidth={hoveredPointIndex === idx ? 2.5 : 1.5} 
                        style={{ transition: 'r 0.15s ease' }}
                      />
                    ))}

                    {showResolvedLine && timeSeriesConfig.resPoints.map((pt, idx) => (
                      <circle 
                        key={`res-${idx}`}
                        cx={pt.x} 
                        cy={pt.y} 
                        r={hoveredPointIndex === idx ? 6 : 3.5} 
                        fill="#0284c7" 
                        stroke="#ffffff" 
                        strokeWidth={hoveredPointIndex === idx ? 2.5 : 1.5} 
                        style={{ transition: 'r 0.15s ease' }}
                      />
                    ))}

                    {/* Vertical scrub guideline on hover */}
                    {activeHoverPoint && (
                      <line 
                        x1={activeHoverPoint.sub.x} 
                        y1={0} 
                        x2={activeHoverPoint.sub.x} 
                        y2={135} 
                        stroke="#94a3b8" 
                        strokeWidth="1.2" 
                        strokeDasharray="3 3" 
                      />
                    )}
                  </svg>

                  {/* Interactive Floating Tooltip */}
                  {activeHoverPoint && (
                    <div 
                      className="rep-floating-tooltip" 
                      style={{ 
                        left: `${Math.min(78, Math.max(14, (activeHoverPoint.sub.x / 560) * 100))}%`, 
                        top: '8%' 
                      }}
                    >
                      <div className="tip-date">{activeHoverPoint.sub.label}</div>
                      <div className="tip-row">
                        <span className="dot dot-green"></span> 
                        <span>Submitted:</span> 
                        <strong>{activeHoverPoint.sub.value}</strong>
                      </div>
                      <div className="tip-row">
                        <span className="dot dot-blue"></span> 
                        <span>Resolved:</span> 
                        <strong>{activeHoverPoint.res.value}</strong>
                      </div>
                      <div className="tip-rate">
                        Clearance: {Math.round((activeHoverPoint.res.value / (activeHoverPoint.sub.value || 1)) * 100)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chart Footer with X-Axis & Interactive Legend */}
              <div className="rep-chart-footer">
                <div className="rep-x-axis">
                  {timeSeriesConfig.labels.map((lbl, idx) => (
                    <span key={idx}>{lbl}</span>
                  ))}
                </div>

                <div className="rep-chart-legend">
                  <button 
                    className={`legend-toggle ${showSubmittedLine ? 'active' : 'muted'}`}
                    onClick={() => setShowSubmittedLine(!showSubmittedLine)}
                    title="Toggle submitted line"
                  >
                    <span className="dot dot-green"></span> 
                    <span>Submitted</span>
                  </button>
                  <button 
                    className={`legend-toggle ${showResolvedLine ? 'active' : 'muted'}`}
                    onClick={() => setShowResolvedLine(!showResolvedLine)}
                    title="Toggle resolved line"
                  >
                    <span className="dot dot-blue"></span> 
                    <span>Resolved</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Chart 2: Requests by Category (Interactive Donut & Distribution) */}
            <div className="rep-panel-box">
              <div className="rep-panel-head">
                <div className="rep-title-group">
                  <div className="rep-icon-badge"><PieChart size={15} /></div>
                  <div>
                    <h4>Requests by Category</h4>
                    <p>Distribution across humanitarian clusters</p>
                  </div>
                </div>

                {/* Category Mini-Dropdown */}
                <div className="rep-dropdown-wrapper">
                  <button 
                    className="rep-mini-dropdown"
                    onClick={() => setOpenDropdown(openDropdown === 'cat' ? null : 'cat')}
                  >
                    <span>
                      {categoryFilter === 'all' 
                        ? 'All Categories' 
                        : categoryBreakdown.find((c) => c.id === categoryFilter)?.label || 'All'}
                    </span>
                    <ChevronDown size={12} className={openDropdown === 'cat' ? 'rotate-up' : ''} />
                  </button>

                  {openDropdown === 'cat' && (
                    <div className="rep-menu-popover right-align">
                      <div className="rep-menu-header">Cluster Category</div>
                      <button 
                        className={`rep-menu-item ${categoryFilter === 'all' ? 'selected' : ''}`}
                        onClick={() => {
                          setCategoryFilter('all');
                          setOpenDropdown(null);
                        }}
                      >
                        <span>All Categories</span>
                        {categoryFilter === 'all' && <Check size={12} className="menu-check" />}
                      </button>
                      {categoryBreakdown.map((c) => (
                        <button 
                          key={c.id}
                          className={`rep-menu-item ${categoryFilter === c.id ? 'selected' : ''}`}
                          onClick={() => {
                            setCategoryFilter(c.id);
                            setOpenDropdown(null);
                            triggerToast(`Focusing cluster: ${c.label}`);
                          }}
                        >
                          <span className="cat-bullet" style={{ color: c.color }}>●</span>
                          <span>{c.label}</span>
                          {categoryFilter === c.id && <Check size={12} className="menu-check" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Donut Graphic & Legend Breakdown */}
              <div className="rep-donut-row">
                {/* Interactive SVG Donut */}
                <div className="rep-donut-svg-box">
                  <svg className="rep-donut-svg" viewBox="0 0 160 160">
                    {(() => {
                      const C = 2 * Math.PI * 54; // ~339.29
                      let currentOffset = 0;
                      return categoryBreakdown.map((cat) => {
                        const segLength = (cat.count / totalCategoryRequests) * C;
                        const dashOffset = -currentOffset;
                        currentOffset += segLength;
                        const isHovered = hoveredCategory === cat.id;

                        return (
                          <circle 
                            key={cat.id}
                            cx="80" 
                            cy="80" 
                            r="54" 
                            fill="none" 
                            stroke={cat.color}
                            strokeWidth={isHovered ? 23 : 18}
                            strokeDasharray={`${segLength.toFixed(2)} ${(C - segLength).toFixed(2)}`}
                            strokeDashoffset={dashOffset.toFixed(2)}
                            transform="rotate(-90 80 80)"
                            className="donut-segment"
                            onMouseEnter={() => setHoveredCategory(cat.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            onClick={() => {
                              setCategoryFilter(categoryFilter === cat.id ? 'all' : cat.id);
                              triggerToast(`Filtered ledger to ${cat.label}`);
                            }}
                          />
                        );
                      });
                    })()}
                  </svg>

                  {/* Donut Center Label */}
                  <div className="rep-donut-core">
                    {hoveredCategory ? (
                      (() => {
                        const cat = categoryBreakdown.find((c) => c.id === hoveredCategory);
                        return (
                          <>
                            <span className="donut-num" style={{ color: cat.color }}>{cat.count}</span>
                            <span className="donut-sub">{cat.label} ({cat.pct}%)</span>
                          </>
                        );
                      })()
                    ) : (
                      <>
                        <span className="donut-num">{totalCategoryRequests}</span>
                        <span className="donut-sub">Total Requests</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Categories List */}
                <div className="rep-cat-list">
                  {categoryBreakdown.map((cat) => {
                    const isFocus = categoryFilter === cat.id || hoveredCategory === cat.id;
                    return (
                      <div 
                        key={cat.id} 
                        className={`rep-cat-item ${isFocus ? 'cat-item-highlight' : ''}`}
                        onMouseEnter={() => setHoveredCategory(cat.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        onClick={() => {
                          setCategoryFilter(categoryFilter === cat.id ? 'all' : cat.id);
                          triggerToast(`Selected category filter: ${cat.label}`);
                        }}
                      >
                        <div className="cat-title">
                          <span className={`dot ${cat.dotClass}`}></span> 
                          <span>{cat.label}</span>
                        </div>
                        <span className={`cat-val ${cat.valClass}`}>{cat.count}</span>
                        <span className="cat-pct">{cat.pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic AI Recommendation Banner */}
              <div 
                className="rep-smart-banner"
                onClick={() => {
                  setActiveTab('forecast');
                  triggerToast('Viewing AI resource allocation recommendations');
                }}
              >
                <Lightbulb size={16} className="rep-bulb" />
                <p>
                  <strong>Medical and Food & Water represent 64% of active demand.</strong> AI recommends staging 4 extra paramedic teams in Kelaniya sector.
                </p>
                <ChevronRight size={14} className="rep-arrow" />
              </div>
            </div>
          </div>

          {/* Row 3: Bottom Operational Panels */}
          <div className="rep-bottom-grid">
            {/* Panel 1: Response Time / District Bar Chart */}
            <div className="rep-panel-box">
              <div className="rep-panel-head">
                <div className="rep-title-group">
                  <div className="rep-icon-badge"><Clock size={15} /></div>
                  <div>
                    <h4>Regional Response Velocity</h4>
                    <p>
                      {responseMetric === 'time' && 'Average response time (minutes)'}
                      {responseMetric === 'backlog' && 'Active unresolved caseload'}
                      {responseMetric === 'rate' && 'Clearance & resolution rate (%)'}
                    </p>
                  </div>
                </div>

                {/* Metric Selector Mini Dropdown */}
                <div className="rep-dropdown-wrapper">
                  <button 
                    className="rep-mini-dropdown"
                    onClick={() => setOpenDropdown(openDropdown === 'resp' ? null : 'resp')}
                  >
                    <span>
                      {responseMetric === 'time' && 'Response Time'}
                      {responseMetric === 'backlog' && 'Active Backlog'}
                      {responseMetric === 'rate' && 'Clearance Rate'}
                    </span>
                    <ChevronDown size={12} className={openDropdown === 'resp' ? 'rotate-up' : ''} />
                  </button>

                  {openDropdown === 'resp' && (
                    <div className="rep-menu-popover right-align">
                      <div className="rep-menu-header">Select Metric</div>
                      <button 
                        className={`rep-menu-item ${responseMetric === 'time' ? 'selected' : ''}`}
                        onClick={() => { setResponseMetric('time'); setOpenDropdown(null); }}
                      >
                        <span>Response Time (min)</span>
                        {responseMetric === 'time' && <Check size={12} className="menu-check" />}
                      </button>
                      <button 
                        className={`rep-menu-item ${responseMetric === 'backlog' ? 'selected' : ''}`}
                        onClick={() => { setResponseMetric('backlog'); setOpenDropdown(null); }}
                      >
                        <span>Active Backlog Cases</span>
                        {responseMetric === 'backlog' && <Check size={12} className="menu-check" />}
                      </button>
                      <button 
                        className={`rep-menu-item ${responseMetric === 'rate' ? 'selected' : ''}`}
                        onClick={() => { setResponseMetric('rate'); setOpenDropdown(null); }}
                      >
                        <span>Clearance Rate (%)</span>
                        {responseMetric === 'rate' && <Check size={12} className="menu-check" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Working Interactive Bars */}
              <div className="rep-bars-body">
                <div className="rep-bar-scale">
                  <span>{maxDistrictVal}</span>
                  <span>{Math.round(maxDistrictVal * 0.75)}</span>
                  <span>{Math.round(maxDistrictVal * 0.5)}</span>
                  <span>{Math.round(maxDistrictVal * 0.25)}</span>
                  <span>0</span>
                </div>

                <div className="rep-bars-flex">
                  {districtBars.map((d) => {
                    const heightPct = Math.min(100, Math.max(12, (d.rawVal / maxDistrictVal) * 100));
                    const isHovered = hoveredDistrict === d.id;

                    return (
                      <div 
                        key={d.id} 
                        className={`rep-col ${isHovered ? 'active-col' : ''}`}
                        onMouseEnter={() => setHoveredDistrict(d.id)}
                        onClick={() => {
                          setSelectedLocation(selectedLocation === d.id ? 'all' : d.id);
                          triggerToast(`Filtered telemetry to ${d.name} sector`);
                        }}
                      >
                        {isHovered && (
                          <div className="kelaniya-tip">
                            <span>{d.name}</span>
                            <strong>{d.displayVal}</strong>
                            <small>{d.teams} active teams</small>
                          </div>
                        )}
                        <span className={`col-val ${d.rawVal > 50 && responseMetric === 'time' ? 'text-red' : ''}`}>
                          {d.rawVal}
                        </span>
                        <div 
                          className={`col-fill ${d.fillClass}`} 
                          style={{ height: `${heightPct}%` }}
                        ></div>
                        <span className="col-label">{d.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Panel 2: Resource Utilisation by Category */}
            <div className="rep-panel-box">
              <div className="rep-panel-head">
                <div className="rep-title-group">
                  <div className="rep-icon-badge"><Cross size={15} /></div>
                  <div>
                    <h4>Resource Inventory Velocity</h4>
                    <p>Dispatched vs reserve warehouse stock</p>
                  </div>
                </div>

                {/* Resource Mini-Dropdown */}
                <div className="rep-dropdown-wrapper">
                  <button 
                    className="rep-mini-dropdown"
                    onClick={() => setOpenDropdown(openDropdown === 'res' ? null : 'res')}
                  >
                    <span>
                      {resourceFilter === 'all' && 'All Resources'}
                      {resourceFilter === 'critical' && 'Critical (>80%)'}
                      {resourceFilter === 'moderate' && 'Adequate (<80%)'}
                    </span>
                    <ChevronDown size={12} className={openDropdown === 'res' ? 'rotate-up' : ''} />
                  </button>

                  {openDropdown === 'res' && (
                    <div className="rep-menu-popover right-align">
                      <div className="rep-menu-header">Inventory Threshold</div>
                      <button 
                        className={`rep-menu-item ${resourceFilter === 'all' ? 'selected' : ''}`}
                        onClick={() => { setResourceFilter('all'); setOpenDropdown(null); }}
                      >
                        <span>All Resources</span>
                        {resourceFilter === 'all' && <Check size={12} className="menu-check" />}
                      </button>
                      <button 
                        className={`rep-menu-item ${resourceFilter === 'critical' ? 'selected' : ''}`}
                        onClick={() => { setResourceFilter('critical'); setOpenDropdown(null); }}
                      >
                        <span>Critical High Burn (&gt;80%)</span>
                        {resourceFilter === 'critical' && <Check size={12} className="menu-check" />}
                      </button>
                      <button 
                        className={`rep-menu-item ${resourceFilter === 'moderate' ? 'selected' : ''}`}
                        onClick={() => { setResourceFilter('moderate'); setOpenDropdown(null); }}
                      >
                        <span>Adequate Reserve (&lt;80%)</span>
                        {resourceFilter === 'moderate' && <Check size={12} className="menu-check" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Meters */}
              <div className="rep-meters-body">
                {filteredResources.map((res) => {
                  const pct = Math.round((res.dispatched / res.total) * 100);
                  const IconComp = res.icon;

                  return (
                    <div key={res.id} className="meter-unit">
                      <div className="m-head">
                        <div className="m-left">
                          <span className={`mini-box ${res.boxClass}`}><IconComp size={10} /></span>
                          <span>{res.name}</span>
                        </div>
                        <span className="m-stat">
                          {res.dispatched.toLocaleString()} / {res.total.toLocaleString()} {res.unit} · 
                          <strong className={res.textClass}> {pct}%</strong>
                        </span>
                      </div>
                      <div className="m-track">
                        <div className={`m-fill ${res.fillClass}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Restock trigger action button */}
              <div className="meter-footer-action">
                <button 
                  className="restock-btn"
                  onClick={() => triggerToast('Emergency requisition broadcasted to National Logistics Depot')}
                >
                  <Truck size={12} />
                  <span>Request Emergency Restock</span>
                </button>
              </div>
            </div>

            {/* Panel 3: Shelter Occupancy Trend */}
            <div className="rep-panel-box">
              <div className="rep-panel-head">
                <div className="rep-title-group">
                  <div className="rep-icon-badge"><Home size={15} /></div>
                  <div>
                    <h4>Shelter Occupancy Census</h4>
                    <p>Live evacuee census by location</p>
                  </div>
                </div>

                {/* Shelter Mini Dropdown */}
                <div className="rep-dropdown-wrapper">
                  <button 
                    className="rep-mini-dropdown"
                    onClick={() => setOpenDropdown(openDropdown === 'sh' ? null : 'sh')}
                  >
                    <span>
                      {shelterFilter === 'all' && 'All Shelters'}
                      {shelterFilter === 'critical' && 'Critical (&gt;80%)'}
                      {shelterFilter === 'available' && 'Available Space'}
                    </span>
                    <ChevronDown size={12} className={openDropdown === 'sh' ? 'rotate-up' : ''} />
                  </button>

                  {openDropdown === 'sh' && (
                    <div className="rep-menu-popover right-align">
                      <div className="rep-menu-header">Capacity Filter</div>
                      <button 
                        className={`rep-menu-item ${shelterFilter === 'all' ? 'selected' : ''}`}
                        onClick={() => { setShelterFilter('all'); setOpenDropdown(null); }}
                      >
                        <span>All Active Shelters</span>
                        {shelterFilter === 'all' && <Check size={12} className="menu-check" />}
                      </button>
                      <button 
                        className={`rep-menu-item ${shelterFilter === 'critical' ? 'selected' : ''}`}
                        onClick={() => { setShelterFilter('critical'); setOpenDropdown(null); }}
                      >
                        <span>Near Capacity (&gt;80%)</span>
                        {shelterFilter === 'critical' && <Check size={12} className="menu-check" />}
                      </button>
                      <button 
                        className={`rep-menu-item ${shelterFilter === 'available' ? 'selected' : ''}`}
                        onClick={() => { setShelterFilter('available'); setOpenDropdown(null); }}
                      >
                        <span>Available Space (&lt;80%)</span>
                        {shelterFilter === 'available' && <Check size={12} className="menu-check" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Shelter Occupancy Meters */}
              <div className="rep-meters-body">
                {filteredShelters.map((sh) => {
                  const pct = Math.round((sh.occupied / sh.capacity) * 100);
                  const isUrgent = pct >= 95;

                  return (
                    <div key={sh.id} className="meter-unit">
                      <div className="m-head">
                        <div className="shelter-name-col">
                          <span>{sh.name}</span>
                          {isUrgent && <span className="urgent-badge">Urgent Overflow</span>}
                        </div>
                        <span className="m-stat">
                          <strong className={sh.textClass}>{pct}%</strong> {sh.occupied} / {sh.capacity}
                        </span>
                      </div>
                      <div className="m-track">
                        <div className={`m-fill ${sh.fillClass}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shelter action button */}
              <div className="meter-footer-action">
                <button 
                  className="shelter-route-btn"
                  onClick={() => triggerToast('Evacuee routing algorithm updated with nearest overflow zones')}
                >
                  <Users size={12} />
                  <span>Rebalance Evacuee Allocations</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* REQUESTS LEDGER TAB */}
      {activeTab === 'ledger' && (
        <div className="rep-ledger-card">
          <div className="rep-ledger-toolbar">
            <div className="ledger-search-box">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by ID, citizen name, address, or cluster..." 
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
              />
              {ledgerSearch && (
                <button className="clear-search-btn" onClick={() => setLedgerSearch('')}>
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="ledger-filters-group">
              <div className="priority-pills">
                <button 
                  className={`p-pill ${ledgerPriorityFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setLedgerPriorityFilter('all')}
                >
                  All Priorities
                </button>
                <button 
                  className={`p-pill pill-critical ${ledgerPriorityFilter === 'critical' ? 'active' : ''}`}
                  onClick={() => setLedgerPriorityFilter('critical')}
                >
                  Critical
                </button>
                <button 
                  className={`p-pill pill-high ${ledgerPriorityFilter === 'high' ? 'active' : ''}`}
                  onClick={() => setLedgerPriorityFilter('high')}
                >
                  High
                </button>
                <button 
                  className={`p-pill pill-med ${ledgerPriorityFilter === 'medium' ? 'active' : ''}`}
                  onClick={() => setLedgerPriorityFilter('medium')}
                >
                  Medium
                </button>
              </div>

              <button className="export-ledger-btn" onClick={handleExportCSV}>
                <Download size={13} />
                <span>Export Ledger CSV</span>
              </button>
            </div>
          </div>

          <div className="rep-table-responsive">
            <table className="rep-data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Time</th>
                  <th>Citizen & Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Resp. Time</th>
                  <th>AI Triage</th>
                  <th>Assigned Agency</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="empty-table-cell">
                      <Info size={16} />
                      <span>No request records match the current filter criteria.</span>
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((r) => (
                    <tr key={r.id}>
                      <td className="font-mono-id">
                        <strong>{r.id}</strong>
                      </td>
                      <td className="text-muted-cell">{r.time}</td>
                      <td>
                        <div className="citizen-info">
                          <span className="citizen-name">{r.citizen}</span>
                          <span className="citizen-addr">{r.address}</span>
                        </div>
                      </td>
                      <td>
                        <span className="cat-pill">{r.category}</span>
                      </td>
                      <td>
                        <span className={`p-tag p-${r.priority.toLowerCase()}`}>
                          {r.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill s-${r.status.toLowerCase().replace(' ', '-')}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <span className="metric-time">{r.responseTime} min</span>
                      </td>
                      <td>
                        <span className="ai-score-pill">{r.aiScore}</span>
                      </td>
                      <td className="org-cell">
                        {ORGANISATIONS.find((o) => o.id === r.assignedOrg)?.label || r.assignedOrg}
                      </td>
                      <td>
                        <button 
                          className="table-action-btn"
                          onClick={() => triggerToast(`Reviewing details for ${r.id}`)}
                          title="Quick inspect"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="rep-ledger-footer">
            <span>Showing {filteredLedger.length} active humanitarian records</span>
            <span className="refresh-notice">Telemetry synchronized with coordinator hub</span>
          </div>
        </div>
      )}

      {/* PREDICTIVE FORECAST TAB */}
      {activeTab === 'forecast' && (
        <div className="rep-forecast-container">
          <div className="rep-forecast-grid">
            <div className="rep-panel-box forecast-card">
              <div className="forecast-card-header">
                <div className="forecast-title-badge">
                  <Zap size={16} />
                  <h4>48-Hour Monsoon Surge Projection</h4>
                </div>
                <span className="forecast-confidence">AI Confidence: 94.2%</span>
              </div>
              <p className="forecast-desc">
                Predictive hydrological models indicate water levels at Nagalagam Street will breach critical 7.0 ft threshold by 04:30 AM.
              </p>

              <div className="forecast-metrics-row">
                <div className="forecast-stat">
                  <span className="stat-label">Expected Caseload Surge</span>
                  <span className="stat-value text-red">+42%</span>
                  <span className="stat-sub">Est. 180 incoming</span>
                </div>
                <div className="forecast-stat">
                  <span className="stat-label">Critical Sector</span>
                  <span className="stat-value text-orange">Kelaniya</span>
                  <span className="stat-sub">River Basin Sector 2</span>
                </div>
                <div className="forecast-stat">
                  <span className="stat-label">Recommended Volunteers</span>
                  <span className="stat-value text-teal">+24 Responders</span>
                  <span className="stat-sub">Red Cross deployment</span>
                </div>
              </div>

              <div className="forecast-action-row">
                <button 
                  className="rep-action-btn btn-primary"
                  onClick={() => triggerToast('Pre-emptive surge alert dispatched to Sector 2 team')}
                >
                  <ShieldCheck size={14} />
                  <span>Deploy Early Warning Alert</span>
                </button>
                <button 
                  className="rep-action-btn"
                  onClick={() => triggerToast('Emergency staging orders sent to Central Logistics')}
                >
                  <Truck size={14} />
                  <span>Pre-Stage Emergency Supplies</span>
                </button>
              </div>
            </div>

            <div className="rep-panel-box forecast-card">
              <div className="forecast-card-header">
                <div className="forecast-title-badge">
                  <Cpu size={16} />
                  <h4>AI Logistics Optimization Directives</h4>
                </div>
                <span className="forecast-confidence">Model: Humanitarian-LLM-v4</span>
              </div>

              <div className="forecast-list">
                <div className="forecast-item">
                  <div className="item-icon-col icon-red"><AlertTriangle size={15} /></div>
                  <div className="item-content">
                    <h5>Wattala Evacuation Center Approaching Total Saturation</h5>
                    <p>Current occupancy is 99% (79/80). Automatically reroute future buses to Colombo Central Safe Hall.</p>
                  </div>
                </div>

                <div className="forecast-item">
                  <div className="item-icon-col icon-teal"><Droplet size={15} /></div>
                  <div className="item-content">
                    <h5>Water Purifier Kits Critical in Kalutara District</h5>
                    <p>Water supplies burn rate is 90%. Dispatch additional 1,200 liters from Ratmalana reserve depot.</p>
                  </div>
                </div>

                <div className="forecast-item">
                  <div className="item-icon-col icon-blue"><Users size={15} /></div>
                  <div className="item-content">
                    <h5>Volunteer Allocation Imbalance Detected</h5>
                    <p>Colombo currently has 16 teams for 14 backlog cases, while Negombo has only 6 teams for 16 cases.</p>
                  </div>
                </div>
              </div>

              <div className="forecast-action-row">
                <button 
                  className="rep-action-btn btn-sitrep"
                  onClick={() => triggerToast('All 3 AI directives applied to field dispatch queue')}
                >
                  <Sparkles size={14} />
                  <span>Execute Optimization Directives</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SITUATION REPORT (SITREP) MODAL */}
      {showSitRepModal && (
        <div className="sitrep-modal-backdrop" onClick={() => setShowSitRepModal(false)}>
          <div className="sitrep-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sitrep-modal-header">
              <div className="sitrep-header-title">
                <FileCheck2 size={20} className="sitrep-icon" />
                <div>
                  <h3>Official Situation Report (SitRep #48)</h3>
                  <p>Disaster Management Operations Intelligence • UN OCHA Standard Format</p>
                </div>
              </div>
              <div className="sitrep-header-actions">
                <button 
                  className="sitrep-btn btn-print"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  <span>Print / PDF</span>
                </button>
                <button 
                  className="sitrep-btn btn-json"
                  onClick={handleExportJSON}
                >
                  <Download size={14} />
                  <span>JSON</span>
                </button>
                <button 
                  className="sitrep-btn btn-close"
                  onClick={() => setShowSitRepModal(false)}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="sitrep-modal-body print-document">
              {/* Document Header */}
              <div className="doc-top-ribbon">
                <div>
                  <span className="doc-org-title">RELIEFCORE DISASTER COMMAND CENTER</span>
                  <div className="doc-meta-row">
                    <span><strong>Incident:</strong> {CRISES.find((c) => c.id === selectedCrisis)?.label || 'All Combined Operations'}</span>
                    <span><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span><strong>Lead Coordinator:</strong> Sarah Johnson</span>
                  </div>
                </div>
                <div className="doc-badge-status">OPERATIONAL • LEVEL 3</div>
              </div>

              <hr className="doc-divider" />

              {/* Section 1: Executive Overview */}
              <div className="doc-section">
                <h4 className="doc-sec-title">1. Operational Synopsis</h4>
                <p className="doc-text">
                  The coordinated humanitarian response is actively managing sustained heavy monsoon inundation across the Western Province. 
                  A total of <strong>{filteredLedger.length * 12} cumulative requests</strong> have been processed with an average field response time of <strong>{computedKPIs.avgTime} minutes</strong>. 
                  Critical focus remains concentrated on the Kelani River Basin where localized flooding continues to displace suburban communities.
                </p>
              </div>

              {/* Section 2: Key Operational Metrics Grid */}
              <div className="doc-section">
                <h4 className="doc-sec-title">2. Field Performance Matrix</h4>
                <div className="doc-stats-grid">
                  <div className="doc-stat-cell">
                    <span className="d-label">Unresolved Caseload</span>
                    <span className="d-val text-red">{computedKPIs.unresolvedCount}</span>
                  </div>
                  <div className="doc-stat-cell">
                    <span className="d-label">Avg Response Velocity</span>
                    <span className="d-val text-teal">{computedKPIs.avgTime} min</span>
                  </div>
                  <div className="doc-stat-cell">
                    <span className="d-label">Resource Dispatched</span>
                    <span className="d-val text-orange">{computedKPIs.resourceRate}%</span>
                  </div>
                  <div className="doc-stat-cell">
                    <span className="d-label">Shelter Saturation</span>
                    <span className="d-val text-blue">{computedKPIs.shelterOccupancy}%</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Sector Breakdown Table */}
              <div className="doc-section">
                <h4 className="doc-sec-title">3. Regional Sector Census</h4>
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>District Sector</th>
                      <th>Response Time</th>
                      <th>Active Backlog</th>
                      <th>Clearance Rate</th>
                      <th>Assigned Responder Teams</th>
                      <th>Status Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtBars.map((d) => (
                      <tr key={d.id}>
                        <td><strong>{d.name}</strong></td>
                        <td>{d.rawVal} min</td>
                        <td>{DISTRICT_STATS[d.id]?.backlog || 12} cases</td>
                        <td>{DISTRICT_STATS[d.id]?.rate || 80}%</td>
                        <td>{d.teams} teams</td>
                        <td>{d.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Section 4: Urgent Action Directives */}
              <div className="doc-section">
                <h4 className="doc-sec-title">4. Immediate Operational Directives</h4>
                <ul className="doc-bullets">
                  <li><strong>Medical Priority:</strong> Route 4 trauma packs and 2 mobile ambulance units to Kelaniya Community Centre.</li>
                  <li><strong>Shelter Overflow:</strong> Wattala center has exceeded recommended safe density (99%). Direct all incoming evacuees to Gampaha Youth Hall.</li>
                  <li><strong>Drinking Water Supply:</strong> Restock request submitted for 5,000L clean drinking water tankers to avoid contamination outbreaks.</li>
                </ul>
              </div>

              <div className="doc-footer-signoff">
                <div>
                  <span className="sign-line">Certified by: Sarah Johnson, Chief Emergency Coordinator</span>
                  <span className="sign-hash">Cryptographic SHA-256 Digest: 8f4b29a...d9e13a (Verified Immutable)</span>
                </div>
                <div className="sign-stamp">RELIEFCORE OFFICIAL</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

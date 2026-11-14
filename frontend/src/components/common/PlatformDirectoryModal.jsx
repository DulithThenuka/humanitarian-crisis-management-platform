import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  PlusSquare,
  Compass,
  Building2,
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
  User,
  Gift,
  Radio,
  LayoutDashboard,
  Brain,
  ClipboardList,
  FileText,
  AlertCircle,
  Cpu,
  MapPin,
  FileBarChart,
  GitMerge,
  Building,
  UserCheck,
  Package,
  Truck,
  CheckCircle2,
  Sparkles,
  Settings,
  ShieldAlert,
  Lock,
  UserPlus,
  Eye,
  Search,
  X,
  Copy,
  Check,
  LayoutGrid,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const PLATFORM_PAGES = [
  // 1. Citizen & Public Aid
  {
    id: 'citizen-portal',
    category: 'Citizen & Public Aid',
    name: 'Citizen Crisis Portal',
    path: '/citizen',
    description: 'Central self-service hub for flood-affected families, immediate relief assistance, and verified shelter discovery.',
    badge: 'Public & Citizen',
    icon: Users,
    color: '#38bdf8',
    highlight: 'SOS Requests & Status'
  },
  {
    id: 'citizen-submit',
    category: 'Citizen & Public Aid',
    name: 'Submit Assistance Request',
    path: '/citizen/submit',
    description: 'Emergency form to submit urgent requests for rescue, food rations, clean drinking water, medical kits, and infant supplies.',
    badge: 'Citizen',
    icon: PlusSquare,
    color: '#ef4444',
    highlight: '6 Priority Aid Types'
  },
  {
    id: 'citizen-track',
    category: 'Citizen & Public Aid',
    name: 'Track Assistance Requests',
    path: '/citizen/track',
    description: 'Real-time GPS dispatch tracking, volunteer verification checkpoints, and ETA countdowns for filed tickets.',
    badge: 'Citizen',
    icon: Compass,
    color: '#06b6d4',
    highlight: 'Live ETA & Verification'
  },
  {
    id: 'citizen-shelters',
    category: 'Citizen & Public Aid',
    name: 'Emergency Shelter Finder',
    path: '/citizen/shelters',
    description: 'Find verified open flood relief shelters with real-time bed capacity, medical care availability, and relief supplies.',
    badge: 'Public',
    icon: Building2,
    color: '#10b981',
    highlight: 'Live Beds & Amenities'
  },
  {
    id: 'citizen-alerts',
    category: 'Citizen & Public Aid',
    name: 'Real-Time Hazard Alerts',
    path: '/citizen/alerts',
    description: 'Live hydro-meteorological river flood advisories, Kelani/Kalu ganga basin water levels, and red-zone bulletins.',
    badge: 'Live Broadcast',
    icon: AlertTriangle,
    color: '#f59e0b',
    highlight: 'River Level Telemetry'
  },
  {
    id: 'citizen-safety',
    category: 'Citizen & Public Aid',
    name: 'Flood Safety & Evacuation Guide',
    path: '/citizen/safety',
    description: 'Preparedness instructions, 72-hour survival checklist, evacuation route rules, and flood water health precautions.',
    badge: 'Preparedness',
    icon: ShieldCheck,
    color: '#10b981',
    highlight: '72-Hour Emergency Kit'
  },
  {
    id: 'citizen-support',
    category: 'Citizen & Public Aid',
    name: '24/7 Helplines & Crisis Support',
    path: '/citizen/support',
    description: 'Toll-free direct dial contacts for Disaster Management Centre (117), 1990 Ambulance, and regional police control.',
    badge: 'Direct Dial',
    icon: PhoneCall,
    color: '#ec4899',
    highlight: 'DMC: 117 · Ambulance: 1990'
  },
  {
    id: 'citizen-profile',
    category: 'Citizen & Public Aid',
    name: 'Citizen Household Profile',
    path: '/citizen/profile',
    description: 'Manage vulnerable family members (infants, elderly, chronic illness) and designated evacuation emergency contacts.',
    badge: 'Profile',
    icon: User,
    color: '#8b5cf6',
    highlight: 'Vulnerability Registry'
  },
  {
    id: 'public-donations',
    category: 'Citizen & Public Aid',
    name: 'Public Relief Donations',
    path: '/donations',
    description: 'Verified public donations portal for financial aid, dry ration packs, clean water tankers, and essential medical supplies.',
    badge: 'Public & Donors',
    icon: Gift,
    color: '#f43f5e',
    highlight: 'Direct Humanitarian Impact'
  },

  // 2. Incident Command & Operations
  {
    id: 'coordinator-portal',
    category: 'Command & Operations',
    name: 'Emergency Coordinator Portal',
    path: '/coordinator',
    description: 'Unified command center for Western Province operations, regional situation radar, and multi-agency response workflows.',
    badge: 'Command',
    icon: Radio,
    color: '#10b981',
    highlight: 'Western Province Hub'
  },
  {
    id: 'coordinator-overview',
    category: 'Command & Operations',
    name: 'Operations Command Overview',
    path: '/coordinator/overview',
    description: 'Situational awareness command map, regional active incidents, critical resource allocations, and live priority feed.',
    badge: 'Situational HQ',
    icon: LayoutDashboard,
    color: '#38bdf8',
    highlight: 'Sector Incident Radar'
  },
  {
    id: 'coordinator-review',
    category: 'Command & Operations',
    name: 'AI Assisted Request Review',
    path: '/coordinator/review',
    description: 'Explainable AI scoring inspection, vulnerability factor breakdown, and human-in-the-loop coordinator overrides.',
    badge: 'Human-in-the-Loop',
    icon: Brain,
    color: '#8b5cf6',
    highlight: 'Explainable AI Triage'
  },
  {
    id: 'coordinator-dashboard',
    category: 'Command & Operations',
    name: 'Coordinator Operations Dashboard',
    path: '/coordinator/dashboard',
    description: 'Comprehensive operational cockpit with live citizen ticket feeds, resource gauges, and multi-channel telemetry.',
    badge: 'Coordinator',
    icon: LayoutDashboard,
    color: '#3b82f6',
    highlight: 'Complete Telemetry Cockpit'
  },
  {
    id: 'coordinator-triage',
    category: 'Command & Operations',
    name: 'Assistance Request Triage Queue',
    path: '/coordinator/triage',
    description: 'High-speed emergency intake sorting, district-level clustering, and rapid status escalation.',
    badge: 'Triage Queue',
    icon: ClipboardList,
    color: '#f59e0b',
    highlight: 'District Clustering'
  },
  {
    id: 'case-manager',
    category: 'Command & Operations',
    name: 'Incident Case Manager Portal',
    path: '/case-manager',
    description: 'Deep case investigation portal with multi-agency communication logs, victim notes, and resolution verification.',
    badge: 'Case Management',
    icon: FileText,
    color: '#06b6d4',
    highlight: 'Multi-Agency Dossiers'
  },
  {
    id: 'case-manager-cases',
    category: 'Command & Operations',
    name: 'Incident Cases & Investigations',
    path: '/case-manager/cases',
    description: 'Manage active emergency incidents, multi-family evacuations, and inter-agency dispatch escalations.',
    badge: 'Cases',
    icon: AlertCircle,
    color: '#f43f5e',
    highlight: 'Escalations & Verification'
  },

  // 3. AI Intelligence & Analytics
  {
    id: 'ai-operations',
    category: 'AI & Intelligence',
    name: 'AI Operations & Model Telemetry',
    path: '/ai-operations',
    description: 'Autonomous triage confidence metrics, model drift monitoring, automated batch inference, and fallback monitors.',
    badge: 'AI Operations',
    icon: Cpu,
    color: '#8b5cf6',
    highlight: 'Confidence & Drift Tracking'
  },
  {
    id: 'ai-governance',
    category: 'AI & Intelligence',
    name: 'AI Governance & Ethics Settings',
    path: '/ai-governance',
    description: 'Human-in-the-loop confidence thresholds, algorithmic fairness audits, and automated override compliance.',
    badge: 'Governance',
    icon: ShieldCheck,
    color: '#10b981',
    highlight: 'Ethics & Safety Guardrails'
  },
  {
    id: 'map-view',
    category: 'AI & Intelligence',
    name: 'Operational GIS Satellite Map',
    path: '/map',
    description: 'Geospatial flood basin radar heatmaps, impassable bridge corridors, shelter pins, and GPS convoy tracks.',
    badge: 'Geospatial GIS',
    icon: MapPin,
    color: '#f43f5e',
    highlight: 'Multi-layer Satellite GIS'
  },
  {
    id: 'reports-analytics',
    category: 'AI & Intelligence',
    name: 'Reports & Deep Analytics',
    path: '/reports',
    description: 'Aggregated relief volume charts, demand forecasting by district, response latency, and exportable reports.',
    badge: 'Analytics',
    icon: FileBarChart,
    color: '#3b82f6',
    highlight: 'Predictive Flood Forecasting'
  },
  {
    id: 'audit-center',
    category: 'AI & Intelligence',
    name: 'Immutable Audit & Compliance Ledger',
    path: '/audit',
    description: 'Cryptographically verified audit trail with SHA-256 hashes recording all automated triage and manual actions.',
    badge: 'Compliance',
    icon: GitMerge,
    color: '#6366f1',
    highlight: 'SHA-256 Tamper-Proof Trail'
  },

  // 4. Shelters & Logistics Management
  {
    id: 'shelter-admin',
    category: 'Shelters & Logistics',
    name: 'Shelter Manager & Facility Admin',
    path: '/shelter-admin',
    description: 'Real-time bed occupancy tracker, vulnerable evacuee placement, food supply alerts, and intake logs.',
    badge: 'Facilities Admin',
    icon: Building2,
    color: '#f87171',
    highlight: 'Real-time Occupancy Tracker'
  },
  {
    id: 'shelters-directory',
    category: 'Shelters & Logistics',
    name: 'Regional Shelter Directory',
    path: '/shelters/directory',
    description: 'Administrative catalog of all designated emergency evacuation centers, school gyms, and temples.',
    badge: 'Shelter Directory',
    icon: Building,
    color: '#38bdf8',
    highlight: 'Verified Capacity Lists'
  },
  {
    id: 'shelters-allocation',
    category: 'Shelters & Logistics',
    name: 'Evacuee Placements & Allocations',
    path: '/shelters/allocation',
    description: 'Family placement optimization matching available beds, medical special needs, and dietary accommodations.',
    badge: 'Evacuee Allocation',
    icon: UserCheck,
    color: '#10b981',
    highlight: 'Family Unit Placement'
  },
  {
    id: 'logistics-inventory',
    category: 'Shelters & Logistics',
    name: 'Logistics Resource Inventory',
    path: '/logistics/inventory',
    description: 'Regional warehouse stockpile counts for dry rations, clean water bowsers, infant formula, and medicine.',
    badge: 'Warehouse Depots',
    icon: Package,
    color: '#fbbf24',
    highlight: 'Supply Chain Stockpiles'
  },
  {
    id: 'logistics-dispatch',
    category: 'Shelters & Logistics',
    name: 'Relief Convoy Supply Dispatch',
    path: '/logistics/dispatch',
    description: 'Coordinate dispatch manifests, truck convoy assignments, and safe route delivery verifications.',
    badge: 'Convoy Dispatch',
    icon: Truck,
    color: '#f59e0b',
    highlight: 'GPS Fleet Manifests'
  },

  // 5. Volunteers & Field Response
  {
    id: 'volunteer-portal',
    category: 'Volunteers & Field Ops',
    name: 'Volunteer Responder Portal',
    path: '/volunteer',
    description: 'Personal mission board, assigned rescue tickets, shift hours verification, and real-time field check-in.',
    badge: 'Volunteer HQ',
    icon: CheckCircle2,
    color: '#c084fc',
    highlight: 'Shift Check-in & Missions'
  },
  {
    id: 'volunteer-opportunities',
    category: 'Volunteers & Field Ops',
    name: 'Volunteer Mission Opportunities',
    path: '/volunteer/opportunities',
    description: 'Browse urgent field missions: boat rescue crew, medical tent triage, ration packing, and translation.',
    badge: 'Open Shifts',
    icon: Sparkles,
    color: '#a855f7',
    highlight: 'Frontline Disaster Roles'
  },
  {
    id: 'volunteers-roster',
    category: 'Volunteers & Field Ops',
    name: 'Volunteer Roster & Scheduling',
    path: '/volunteers/roster',
    description: 'Administrative coordination of active on-duty volunteer rosters, badge credentials, and field certifications.',
    badge: 'Field Roster',
    icon: Users,
    color: '#3b82f6',
    highlight: 'Credentialed Responders'
  },
  {
    id: 'volunteers-assignments',
    category: 'Volunteers & Field Ops',
    name: 'Task Assignments Dispatch Board',
    path: '/volunteers/assignments',
    description: 'Interactive dispatch board assigning field tasks to specialized NGO and civil volunteer groups.',
    badge: 'Dispatch Tasks',
    icon: ClipboardList,
    color: '#10b981',
    highlight: 'Rescue Task Board'
  },

  // 6. Platform Administration & Security
  {
    id: 'admin-dashboard',
    category: 'Platform Administration',
    name: 'Platform Administration & System Health',
    path: '/admin',
    description: 'System health telemetry, real-time database connection metrics, memory usage, and global emergency modes.',
    badge: 'Platform Admin',
    icon: Settings,
    color: '#f43f5e',
    highlight: 'Health & System Telemetry'
  },
  {
    id: 'admin-users',
    category: 'Platform Administration',
    name: 'User Management & Role RBAC',
    path: '/admin/users',
    description: 'Manage operator credentials, district assignments, account lockouts, and cryptographic password resets.',
    badge: 'Security RBAC',
    icon: ShieldAlert,
    color: '#e11d48',
    highlight: 'District & Role Controls'
  },
  {
    id: 'auth-login',
    category: 'Platform Administration',
    name: 'Operator Secure Sign In',
    path: '/login',
    description: 'Secure JWT authenticated portal sign-in with role-based access for coordinators, logistics, and volunteers.',
    badge: 'Authentication',
    icon: Lock,
    color: '#94a3b8',
    highlight: 'Role-Based Access'
  },
  {
    id: 'auth-register',
    category: 'Platform Administration',
    name: 'Platform Account Registration',
    path: '/signup',
    description: 'Register as an emergency responder, humanitarian NGO operator, or community volunteer.',
    badge: 'Registration',
    icon: UserPlus,
    color: '#38bdf8',
    highlight: 'Join Crisis Response'
  },

  // 7. Design Concepts
  {
    id: 'bloom-design',
    category: 'Design Showcase',
    name: 'Bloom Liquid Glass Showcase',
    path: '/bloom',
    description: 'Experimental liquid glass morphism UI showcase with dual-tier backdrop blur and organic motion aesthetics.',
    badge: 'Experimental UI',
    icon: Sparkles,
    color: '#c084fc',
    highlight: 'Liquid Glass Aesthetics'
  },
  {
    id: 'apogee-hero',
    category: 'Design Showcase',
    name: 'Apogee Spatial Hero Section',
    path: '/apogee',
    description: 'Spatial dynamic hero section with fluid typography and interactive bar chart telemetry.',
    badge: 'Spatial Hero',
    icon: Eye,
    color: '#38bdf8',
    highlight: 'Dynamic Spatial Motion'
  }
];

const CATEGORIES = [
  'All Pages',
  'Citizen & Public Aid',
  'Command & Operations',
  'AI & Intelligence',
  'Shelters & Logistics',
  'Volunteers & Field Ops',
  'Platform Administration',
  'Design Showcase'
];

export const PlatformDirectoryModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Pages');
  const [copiedPath, setCopiedPath] = useState(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const filteredPages = useMemo(() => {
    return PLATFORM_PAGES.filter((page) => {
      const matchesCategory =
        selectedCategory === 'All Pages' || page.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        page.name.toLowerCase().includes(q) ||
        page.path.toLowerCase().includes(q) ||
        page.description.toLowerCase().includes(q) ||
        page.badge.toLowerCase().includes(q) ||
        page.category.toLowerCase().includes(q) ||
        (page.highlight && page.highlight.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleLaunch = (path) => {
    onClose();
    navigate(path);
  };

  const handleCopy = (path, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-[20px] animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div 
        className="relative z-10 w-full max-w-[1240px] max-h-[92vh] flex flex-col rounded-[26px] bg-[#0c1024]/95 border border-white/[0.12] shadow-[0_32px_96px_rgba(0,0,0,0.8)] overflow-hidden font-display text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
              <LayoutGrid size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[20px] sm:text-[22px] font-[500] text-white">
                  Platform Directory & Navigation Index
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10.5px] font-semibold tracking-wider uppercase">
                  {PLATFORM_PAGES.length} Destinations
                </span>
              </div>
              <p className="text-[12.5px] text-white/50 mt-0.5">
                Instant one-click access to every public service, operational command console, and administrative workspace.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-[10px] bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.08] text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Directory (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="px-6 sm:px-8 py-3.5 border-b border-white/[0.08] shrink-0 bg-[#080b1a]/60 flex flex-col gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search platform by page name, route path, role, or keywords (e.g. shelter, triage, map, donations, admin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full h-[42px] pl-10 pr-10 rounded-[12px] bg-white/[0.06] border border-white/[0.12] text-white text-[13.5px] placeholder:text-white/40 focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all font-[450]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-[30px] px-3.5 rounded-[9px] text-[12px] font-[450] whitespace-nowrap transition-all cursor-pointer border ${
                    active
                      ? 'bg-sky-500/20 text-sky-200 border-sky-400/40 shadow-sm'
                      : 'bg-white/[0.03] text-white/60 border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Page Cards Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 min-h-[300px]">
          {filteredPages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-12 h-12 rounded-[14px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 mb-3">
                <Search size={22} />
              </div>
              <h4 className="text-[16px] font-medium text-white">No matching destinations found</h4>
              <p className="text-[13px] text-white/50 max-w-[360px] mt-1">
                Try searching for a different keyword or switch to "All Pages" to view all available platform portals.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All Pages'); }}
                className="mt-4 px-4 py-2 rounded-[10px] bg-white/[0.08] hover:bg-white/[0.15] text-white text-[12.5px] transition-colors border border-white/10 cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPages.map((page) => {
                const IconComponent = page.icon || LayoutGrid;
                const isCopied = copiedPath === page.path;

                return (
                  <div
                    key={page.id}
                    onClick={() => handleLaunch(page.path)}
                    className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-[18px] bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/20 transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                  >
                    <div>
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div
                          className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: `${page.color}15`,
                            border: `1px solid ${page.color}35`,
                            color: page.color
                          }}
                        >
                          <IconComponent size={18} />
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="px-2 py-0.5 rounded-[6px] text-[10px] font-semibold tracking-wider uppercase font-mono"
                            style={{
                              backgroundColor: `${page.color}15`,
                              color: page.color,
                              border: `1px solid ${page.color}30`
                            }}
                          >
                            {page.badge}
                          </span>
                        </div>
                      </div>

                      {/* Title & Path */}
                      <h4 className="text-[15.5px] font-[500] text-white group-hover:text-sky-300 transition-colors leading-snug">
                        {page.name}
                      </h4>

                      <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px] text-sky-400/80">
                        <span>{page.path}</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopy(page.path, e)}
                          className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                          title="Copy Full URL"
                        >
                          {isCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-[12px] text-white/55 mt-2 line-clamp-2 leading-relaxed">
                        {page.description}
                      </p>
                    </div>

                    {/* Bottom Feature Pill & Launch Action */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11.5px]">
                      <span className="text-white/40 truncate max-w-[170px]" title={page.highlight}>
                        {page.highlight}
                      </span>
                      <span className="inline-flex items-center gap-1 text-white/80 group-hover:text-white font-medium group-hover:translate-x-0.5 transition-transform shrink-0">
                        <span>Launch</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-3.5 border-t border-white/[0.08] bg-white/[0.015] flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/50 shrink-0">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-white">{filteredPages.length}</strong> of {PLATFORM_PAGES.length} platform pages</span>
            <span className="text-white/20">·</span>
            <span>Western Province Humanitarian Crisis Operations</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleLaunch('/citizen')}
              className="text-sky-300 hover:text-sky-200 transition-colors bg-transparent border-0 cursor-pointer p-0"
            >
              Citizen Portal →
            </button>
            <span className="text-white/20">|</span>
            <button
              type="button"
              onClick={() => handleLaunch('/coordinator')}
              className="text-emerald-300 hover:text-emerald-200 transition-colors bg-transparent border-0 cursor-pointer p-0"
            >
              Coordinator Hub →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowRight, 
  Users, 
  Search, 
  Globe, 
  Home, 
  Layers, 
  ShieldCheck, 
  Droplets, 
  Package, 
  HeartPulse, 
  Building2, 
  Truck, 
  ChevronRight, 
  X, 
  MapPin, 
  Radio, 
  PhoneCall, 
  CheckCircle2, 
  Compass, 
  Cpu, 
  FileText,
  Activity,
  Sparkles,
  UtensilsCrossed,
  Plus,
  Bus,
  Accessibility,
  Check,
  TrendingUp,
  ShieldAlert,
  Headphones,
  User,
  Zap,
  ChevronDown,
  LayoutGrid,
  GitMerge,
  FileBarChart,
  Settings,
  Gift,
  Lock,
  ClipboardList,
  Brain,
  Building
} from 'lucide-react';

import westernProvinceMap from '../../assets/western-province-map-clean.png';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import { homeService } from '../../services/homeService';
import Hero, { Animate, RevenueCard, BAR_HEIGHTS } from '../../components/Hero';
import { PlatformDirectoryModal } from '../../components/common/PlatformDirectoryModal';

export const LandingHomePage = () => {
  const navigate = useNavigate();

  // Apogee Hero Theme Mode State ('crisis' | 'apogee')
  const [heroMode, setHeroMode] = useState('crisis');

  // Modals & Interactivity
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');

  // Live Backend Telemetry & Endpoints State
  const [alerts, setAlerts] = useState([]);
  const [hotlines, setHotlines] = useState([]);
  const [safetyGuides, setSafetyGuides] = useState([]);
  const [sheltersPreview, setSheltersPreview] = useState([]);
  const [trackingModalData, setTrackingModalData] = useState(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState(null);

  const [telemetry, setTelemetry] = useState({
    activeCrisis: {
      title: 'Western Province Monsoon Floods',
      severity: 'Level 4 Severe',
      description: 'Kelani & Kalu Ganga river crest advisory in effect'
    },
    metrics: {
      peopleSupported: 12430,
      activeResponseOperations: 186,
      requestsReviewedOnTimePercent: 94.0,
      operationalSheltersCount: 16,
      shelterOccupancyPercent: 68.0,
      activeGroundTeams: 42
    },
    quickCategories: [],
    verifiedShelters: []
  });

  useEffect(() => {
    let isMounted = true;
    const fetchHomeTelemetry = async () => {
      // 1. Fetch live summary telemetry
      try {
        const res = await homeService.getSummary();
        const data = res?.data || res?.Data || res;
        if (isMounted && data) {
          if (data.activeCrisis && data.metrics) {
            setTelemetry({
              activeCrisis: data.activeCrisis,
              metrics: data.metrics,
              quickCategories: data.quickCategories || [],
              verifiedShelters: data.verifiedShelters || []
            });
          }
          if (Array.isArray(data.verifiedShelters) && data.verifiedShelters.length > 0) {
            setSheltersPreview(data.verifiedShelters);
          }
          if (Array.isArray(data.safetyAlerts) && data.safetyAlerts.length > 0) {
            setAlerts(data.safetyAlerts);
          }
          if (Array.isArray(data.emergencyHotlines) && data.emergencyHotlines.length > 0) {
            setHotlines(data.emergencyHotlines);
          }
        }
      } catch (err) {
        console.debug('Home telemetry service fallback active', err);
      }

      // 2. Fetch live crisis alerts
      try {
        const aRes = await homeService.getAlerts();
        const aData = aRes?.data || aRes?.Data || aRes;
        if (isMounted && Array.isArray(aData) && aData.length > 0) {
          setAlerts(aData);
        }
      } catch (err) {
        console.debug('Alerts service fallback active', err);
      }

      // 3. Fetch emergency hotlines
      try {
        const hRes = await homeService.getHotlines();
        const hData = hRes?.data || hRes?.Data || hRes;
        if (isMounted && Array.isArray(hData) && hData.length > 0) {
          setHotlines(hData);
        }
      } catch (err) {
        console.debug('Hotlines service fallback active', err);
      }

      // 4. Fetch safety guidance
      try {
        const sRes = await homeService.getSafetyGuidance();
        const sData = sRes?.data || sRes?.Data || sRes;
        if (isMounted && Array.isArray(sData) && sData.length > 0) {
          setSafetyGuides(sData);
        }
      } catch (err) {
        console.debug('Safety guidance service fallback active', err);
      }
    };

    fetchHomeTelemetry();
    return () => { isMounted = false; };
  }, []);

  // 6 Primary Assistance Categories Matching CitizenPortal & Backend Database
  const quickCategories = [
    {
      id: 'food',
      key: 'food',
      title: 'Emergency Food & Rations',
      desc: 'Pre-packed family ration hampers, baby nutrition & clean meal packs.',
      icon: UtensilsCrossed,
      color: '#38bdf8',
      link: '/citizen/submit?category=Food'
    },
    {
      id: 'medical',
      key: 'medicine',
      title: 'Critical Medical Care',
      desc: 'Emergency trauma first aid, chronic medicine kits & mobile clinics.',
      icon: Plus,
      color: '#34d399',
      link: '/citizen/submit?category=Medical'
    },
    {
      id: 'shelter',
      key: 'shelter',
      title: 'Verified Open Shelters',
      desc: 'High-ground relief centers with real-time bed capacity & meals.',
      icon: Building2,
      color: '#fbbf24',
      link: '/citizen/shelters'
    },
    {
      id: 'transport',
      key: 'transport',
      title: 'Search & Flood Rescue',
      desc: 'Amphibious rescue boats, stranded resident extraction & SOS airlift.',
      icon: Bus,
      color: '#f87171',
      link: '/citizen/submit?category=Transport'
    },
    {
      id: 'water',
      key: 'water',
      title: 'Potable Clean Water',
      desc: 'Purified water bowsers, portable filtration & sanitary hydration packs.',
      icon: Droplets,
      color: '#60a5fa',
      link: '/citizen/submit?category=Drinking%20Water'
    },
    {
      id: 'access',
      key: 'access',
      title: 'Vulnerable & Special Care',
      desc: 'Priority assistance for infants, expectant mothers, elderly & disabled citizens.',
      icon: Accessibility,
      color: '#c084fc',
      link: '/citizen/submit?category=Accessibility'
    }
  ];

  // 12 Comprehensive Role Showcase Workspaces matching platform roles
  const roles = [
    {
      id: 'citizen',
      title: 'Disaster Affected Citizen',
      desc: 'Submit urgent rescue/ration requests, locate verified open shelters, and track real-time ticket milestones.',
      path: '/citizen',
      badge: 'Public Portal',
      icon: Users,
      color: '#38bdf8',
      featured: 'Instant SOS intake & live status tracking',
      sublinks: [
        { label: 'Submit SOS', path: '/citizen/submit' },
        { label: 'Track Requests', path: '/citizen/track' },
        { label: 'Find Shelters', path: '/citizen/shelters' },
        { label: 'Hazard Alerts', path: '/citizen/alerts' },
      ]
    },
    {
      id: 'coordinator',
      title: 'Emergency Coordinator',
      desc: 'Live operational overview, automated AI triage review, dynamic priority queues, and incident command.',
      path: '/coordinator',
      badge: 'Command Center',
      icon: Radio,
      color: '#34d399',
      featured: 'Explainable AI triage rationale & resource dispatch',
      sublinks: [
        { label: 'Command Overview', path: '/coordinator/overview' },
        { label: 'AI Review', path: '/coordinator/review' },
        { label: 'Operations Cockpit', path: '/coordinator/dashboard' },
        { label: 'Triage Queue', path: '/coordinator/triage' },
      ]
    },
    {
      id: 'case-manager',
      title: 'Incident & Case Manager',
      desc: 'Comprehensive victim dossiers, inter-agency case logs, communication notes, and verification outcomes.',
      path: '/case-manager',
      badge: 'Case Management',
      icon: FileText,
      color: '#06b6d4',
      featured: 'Multi-agency incident escalation & verification',
      sublinks: [
        { label: 'Case Dossiers', path: '/case-manager/cases' },
        { label: 'AI Assisted Review', path: '/case-manager/review' },
        { label: 'Case Reports', path: '/case-manager/reports' },
      ]
    },
    {
      id: 'ai-ops',
      title: 'AI Operations & Governance',
      desc: 'Autonomous triage confidence metrics, model drift tracking, human-in-the-loop policies, and ethical thresholds.',
      path: '/ai-operations',
      badge: 'AI Intelligence',
      icon: Cpu,
      color: '#8b5cf6',
      featured: 'Real-time model drift telemetry & confidence scoring',
      sublinks: [
        { label: 'Model Telemetry', path: '/ai-operations' },
        { label: 'AI Workspaces', path: '/ai-workspaces' },
        { label: 'Governance & Ethics', path: '/ai-governance' },
      ]
    },
    {
      id: 'shelters',
      title: 'Shelter Facility Manager',
      desc: 'Live bed occupancy, evacuee intake registration, facility amenities, and capacity management.',
      path: '/shelter-admin',
      badge: 'Facilities',
      icon: Building2,
      color: '#f87171',
      featured: 'Live bed counters & vulnerable intake prioritization',
      sublinks: [
        { label: 'Bed Occupancy', path: '/shelter-admin' },
        { label: 'Regional Directory', path: '/shelters/directory' },
        { label: 'Evacuee Placements', path: '/shelters/allocation' },
      ]
    },
    {
      id: 'logistics',
      title: 'Logistics & Supply Chain',
      desc: 'Stockpile depot tracking, relief convoy allocation, medical supplies, and route optimization.',
      path: '/logistics/inventory',
      badge: 'Supply Chain',
      icon: Package,
      color: '#fbbf24',
      featured: 'Real-time warehouse depots & GPS convoy routing',
      sublinks: [
        { label: 'Warehouse Stockpiles', path: '/logistics/inventory' },
        { label: 'Convoy Dispatch', path: '/logistics/dispatch' },
      ]
    },
    {
      id: 'volunteer',
      title: 'Field Volunteer Responder',
      desc: 'Task assignment dispatch, on-ground rescue rosters, search & rescue coordination, and field check-ins.',
      path: '/volunteer',
      badge: 'Field Ops',
      icon: Compass,
      color: '#c084fc',
      featured: 'Search & rescue teams & on-duty field rosters',
      sublinks: [
        { label: 'Volunteer Portal', path: '/volunteer' },
        { label: 'Mission Shifts', path: '/volunteer/opportunities' },
        { label: 'Roster Schedule', path: '/volunteers/roster' },
        { label: 'Task Assignments', path: '/volunteers/assignments' },
      ]
    },
    {
      id: 'map',
      title: 'Operational GIS Satellite Map',
      desc: 'Multi-layer geospatial flood mapping, real-time river basin advisories, and safe transit corridors.',
      path: '/map',
      badge: 'Geospatial',
      icon: MapPin,
      color: '#f43f5e',
      featured: 'Flood basin radar heatmaps & route status',
      sublinks: [
        { label: 'Satellite Flood Radar', path: '/map' },
        { label: 'Impassable Bridges', path: '/map' },
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Deep Analytics',
      desc: 'Aggregated relief volume charts, demand forecasting by district, response latency, and exportable reports.',
      path: '/reports',
      badge: 'Analytics',
      icon: FileBarChart,
      color: '#3b82f6',
      featured: 'Predictive crisis telemetry & sector analytics',
      sublinks: [
        { label: 'Crisis Reports', path: '/reports' },
        { label: 'Response Velocity', path: '/analytics' },
      ]
    },
    {
      id: 'audit',
      title: 'Immutable Audit & Compliance',
      desc: 'Cryptographically verified audit trail with SHA-256 hashes recording all automated triage and manual actions.',
      path: '/audit',
      badge: 'Governance',
      icon: GitMerge,
      color: '#6366f1',
      featured: 'Cryptographic SHA-256 ledger integrity',
      sublinks: [
        { label: 'Audit Ledger', path: '/audit' },
        { label: 'Tamper Verification', path: '/audit' },
      ]
    },
    {
      id: 'admin',
      title: 'Platform Administration & Health',
      desc: 'System health telemetry, real-time database connection metrics, memory usage, and global emergency modes.',
      path: '/admin',
      badge: 'Administration',
      icon: Settings,
      color: '#f43f5e',
      featured: 'System health telemetry & operator RBAC controls',
      sublinks: [
        { label: 'System Health', path: '/admin' },
        { label: 'User RBAC Controls', path: '/admin/users' },
      ]
    },
    {
      id: 'donations',
      title: 'Public Relief Donations',
      desc: 'Verified public donations portal for financial aid, dry ration packs, clean water tankers, and medical supplies.',
      path: '/donations',
      badge: 'Donations',
      icon: Gift,
      color: '#ec4899',
      featured: 'Direct emergency contribution channels',
      sublinks: [
        { label: 'Online Donation', path: '/donations' },
        { label: 'Dry Ration Relief', path: '/donations' },
      ]
    }
  ];

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    const query = trackingInput.trim();
    if (!query) {
      navigate('/citizen/track');
      return;
    }

    setIsTrackingLoading(true);
    setTrackingError(null);
    try {
      const res = await homeService.trackRequest(query);
      const data = res?.data || res?.Data || res;
      if (data && (data.publicReference || data.status)) {
        setTrackingModalData(data);
      } else {
        navigate(`/citizen/track?id=${encodeURIComponent(query)}`);
      }
    } catch (err) {
      console.warn('Direct track API fallback, navigating to portal:', err);
      navigate(`/citizen/track?id=${encodeURIComponent(query)}`);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080A19] text-white font-display font-['Poppins','Suisse_Intl',-apple-system,BlinkMacSystemFont,sans-serif] -webkit-font-smoothing-antialiased overflow-x-hidden selection:bg-white/20 selection:text-white flex flex-col">
      {/* =========================================================
         1. Top Prototype Notice Banner
         ========================================================= */}
      <div className="w-full bg-[#080A19]/90 border-b border-white/[0.08] backdrop-blur-[16px] py-2.5 px-5 sm:px-8 md:px-[82px] text-[12px] text-white/70 relative z-50">
        <div className="w-full max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            <AlertTriangle size={13} className="text-rose-400 shrink-0" />
            <span className="text-white/80">
              <strong className="text-white font-[500]">National Humanitarian Emergency Protocol:</strong> RELIEFCORE Operations Network — Western Province Flood Response, Sri Lanka.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-white/60">
            <button
              type="button"
              onClick={() => setShowDirectoryModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-200 transition-colors text-[11.5px] cursor-pointer"
            >
              <LayoutGrid size={12} className="text-sky-300" />
              <span>Platform Directory (30 Portals)</span>
            </button>
            <span className="text-white/20 hidden sm:inline">|</span>
            <a href="tel:117" className="flex items-center gap-1.5 text-rose-300 hover:text-rose-200 transition-colors text-decoration-none font-medium">
              <PhoneCall size={12} />
              <span>Emergency DMC: <strong className="text-white">117</strong></span>
            </a>
            <span className="text-white/20">|</span>
            <button 
              type="button"
              className="flex items-center gap-1 text-white/80 hover:text-white transition-colors bg-transparent border-0 p-0 text-[12px] cursor-pointer"
              onClick={() => setShowSafetyModal(true)}
            >
              <span>Field Evacuation Protocols</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Crisis Broadcast Advisory Banner */}
      {alerts && alerts.length > 0 && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-5 sm:px-8 md:px-[82px] py-2.5 backdrop-blur-md">
          <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between text-[12.5px] text-amber-200">
            <div className="flex items-center gap-2.5 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-100 font-semibold text-[10px] tracking-wider uppercase">
                {alerts[0].level || 'CRITICAL FLOOD ADVISORY'}
              </span>
              <strong className="text-white">{alerts[0].title}:</strong>
              <span className="text-amber-200/90">{alerts[0].message}</span>
            </div>
            <span className="hidden md:inline-block text-[11px] text-amber-300/70 shrink-0 ml-4 font-mono">
              Sector: {alerts[0].region}
            </span>
          </div>
        </div>
      )}

      {/* =========================================================
         2. Apogee Hero Landing Section (Pixel-Exact & Website Themed)
         ========================================================= */}
      {heroMode === 'crisis' ? (
        <Hero
          brandName="RELIEFCORE"
          brandLogo={
            <div className="flex items-center gap-2.5">
              <img 
                src={reliefcoreLogoWhite} 
                alt="RELIEFCORE Humanitarian Operations" 
                className="h-[28px] sm:h-[32px] w-auto object-contain"
              />
            </div>
          }
          liveOpsBadge={
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE OPERATIONS ACTIVE</span>
            </div>
          }
          badgeTag={
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-[14px] border border-white/15 text-white/90 text-[12px] font-[450]">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              <span className="tracking-wide">WESTERN PROVINCE DISASTER COORDINATION NETWORK</span>
              <span className="text-white/30">|</span>
              <span className="text-amber-300 font-semibold">{telemetry.activeCrisis.severity}</span>
            </div>
          }
          headline="Rapid crisis response when every second counts"
          subheadline="Autonomous emergency triage, real-time high-ground evacuation routing, and life-saving resource convoys deployed across Western Province, Sri Lanka."
          primaryCtaLabel="Request Urgent Aid"
          primaryCtaLink="/citizen/submit"
          secondaryCtaLabel="Find Verified Shelters"
          secondaryCtaLink="/citizen/shelters"
          extraLeftContent={
            <div className="mt-5 max-w-[440px]">
              <form className="flex items-center gap-2 p-1.5 rounded-[14px] bg-slate-900/60 backdrop-blur-[20px] border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/20 transition-all" onSubmit={handleTrackSubmit}>
                <Search size={16} className="text-white/50 ml-3 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search assistance ticket (e.g. REQ-2026-01842)..."
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-white text-[13.5px] font-[450] placeholder:text-white/40 px-2"
                />
                <button 
                  type="submit" 
                  disabled={isTrackingLoading}
                  className="h-[38px] px-4 rounded-[10px] bg-[#E9E9E9] hover:bg-white text-[#0A0707] text-[13px] font-[500] shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer border-0 disabled:opacity-60"
                >
                  {isTrackingLoading ? (
                    <span>Searching...</span>
                  ) : (
                    <>
                      <span>Track Status</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </form>
              <div className="flex items-center justify-between mt-3 text-[12px] text-white/60 px-1">
                <span>Emergency DMC: <strong className="text-white">117</strong> · Ambulance: <strong className="text-white">1990</strong></span>
                <button 
                  type="button"
                  onClick={() => setShowSafetyModal(true)} 
                  className="text-white/80 hover:text-white underline cursor-pointer bg-transparent border-0 p-0 text-[12px]"
                >
                  Evacuation Protocols →
                </button>
              </div>

              {/* Quick Jump Buttons to Access Key Pages */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-white/[0.08]">
                <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mr-1">Quick Portals:</span>
                <button 
                  type="button" 
                  onClick={() => navigate('/citizen/submit')} 
                  className="text-[11px] px-2.5 py-1 rounded-[7px] bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 transition-colors cursor-pointer"
                >
                  Request Aid
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/citizen/shelters')} 
                  className="text-[11px] px-2.5 py-1 rounded-[7px] bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 transition-colors cursor-pointer"
                >
                  Shelters ({telemetry.metrics.operationalSheltersCount})
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/map')} 
                  className="text-[11px] px-2.5 py-1 rounded-[7px] bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-200 transition-colors cursor-pointer"
                >
                  GIS Map
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/coordinator')} 
                  className="text-[11px] px-2.5 py-1 rounded-[7px] bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 transition-colors cursor-pointer"
                >
                  Coordinator
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/volunteer')} 
                  className="text-[11px] px-2.5 py-1 rounded-[7px] bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 transition-colors cursor-pointer"
                >
                  Volunteers
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowDirectoryModal(true)} 
                  className="text-[11px] px-2.5 py-1 rounded-[7px] bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                >
                  <LayoutGrid size={11} className="text-sky-300" />
                  <span>All 30 Portals →</span>
                </button>
              </div>
            </div>
          }
          rightContent={
            <Animate delay={900} direction="scale" className="w-full max-w-[440px] mx-auto lg:mx-0">
              <div className="w-full rounded-[24px] sm:rounded-[33px] bg-slate-900/60 backdrop-blur-[24px] p-5 sm:p-7 pb-5 sm:pb-6 border border-white/[0.12] shadow-[0_24px_50px_rgba(0,0,0,0.55)]">
                {/* HUD Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <p className="text-white text-[15px] sm:text-[18px] font-[500] leading-none">
                      Live Crisis Telemetry Feed
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10.5px] font-medium tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE STREAM</span>
                  </div>
                </div>

                {/* Metric Display */}
                <div className="mb-2 sm:mb-3">
                  <div className="flex items-baseline">
                    <span className="text-white text-[28px] sm:text-[44px] font-[500] leading-[1]">
                      {telemetry.metrics.peopleSupported.toLocaleString()}
                    </span>
                    <span className="text-white/50 text-[16px] sm:text-[22px] font-normal ml-2">
                      Citizens Aided
                    </span>
                  </div>
                </div>

                {/* Delta row */}
                <div className="flex items-center gap-[10px] mb-4 sm:mb-5">
                  <span className="px-[6px] py-[5px] bg-emerald-500/20 border border-emerald-500/30 rounded-[6px] text-emerald-300 text-[12px] sm:text-[13px] font-medium leading-[14px]">
                    +32.4% Aid Flow
                  </span>
                  <span className="text-white/70 text-[12px] sm:text-[13px] font-normal leading-[14px]">
                    Western Province flood relief deployment
                  </span>
                </div>

                {/* Chart block with 32 stagger bars */}
                <div className="relative mb-5">
                  <div className="flex items-end gap-[1.5px] h-[64px] sm:h-[80px]">
                    {BAR_HEIGHTS.map((h, i) => {
                      const isProjected = i >= 28;
                      const heightPercent = (h / 95) * 100;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-[0.5px] animate-bar-grow origin-bottom"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: isProjected ? 'rgba(56, 189, 248, 0.35)' : '#38bdf8',
                            animationDelay: `${1100 + i * 30}ms`,
                          }}
                          title={`Sector dispatch load: ${h}%`}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute inset-0 pointer-events-none">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 w-px bg-white/10"
                        style={{ left: `${((i + 1) / 5) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {['10:00', '12:00', '14:00', '16:00', '18:00'].map((time, i) => (
                      <span
                        key={i}
                        className="text-[9px] sm:text-[10px] font-[450] leading-[10px] text-white/60"
                        style={{ opacity: i >= 4 ? 0.4 : 1 }}
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4 Connected Platform Sector Cards */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.08]">
                  {/* 1. Active Crisis */}
                  <button
                    type="button"
                    onClick={() => navigate('/coordinator/dashboard')}
                    className="flex flex-col text-left p-2.5 rounded-[12px] bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-amber-300 tracking-wider uppercase">Active Crisis</span>
                      <ArrowRight size={11} className="text-white/40 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-[12px] font-medium text-white line-clamp-1 group-hover:text-amber-200 transition-colors">
                      {telemetry.activeCrisis.title}
                    </p>
                    <span className="text-[10px] text-white/50">{telemetry.activeCrisis.severity}</span>
                  </button>

                  {/* 2. Shelters */}
                  <button
                    type="button"
                    onClick={() => navigate('/citizen/shelters')}
                    className="flex flex-col text-left p-2.5 rounded-[12px] bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-emerald-300 tracking-wider uppercase">Open Shelters</span>
                      <ArrowRight size={11} className="text-white/40 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-[12px] font-medium text-white line-clamp-1 group-hover:text-emerald-200 transition-colors">
                      {telemetry.metrics.operationalSheltersCount} Verified Centers
                    </p>
                    <span className="text-[10px] text-white/50">{telemetry.metrics.shelterOccupancyPercent}% Bed Occupancy</span>
                  </button>

                  {/* 3. Field Teams */}
                  <button
                    type="button"
                    onClick={() => navigate('/volunteers/roster')}
                    className="flex flex-col text-left p-2.5 rounded-[12px] bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-purple-300 tracking-wider uppercase">Ground Responders</span>
                      <ArrowRight size={11} className="text-white/40 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-[12px] font-medium text-white line-clamp-1 group-hover:text-purple-200 transition-colors">
                      {telemetry.metrics.activeGroundTeams} Active Units
                    </p>
                    <span className="text-[10px] text-white/50">{telemetry.metrics.requestsReviewedOnTimePercent}% On-Time Triage</span>
                  </button>

                  {/* 4. GIS Map */}
                  <button
                    type="button"
                    onClick={() => navigate('/map')}
                    className="flex flex-col text-left p-2.5 rounded-[12px] bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-sky-300 tracking-wider uppercase">GIS Radar Map</span>
                      <ArrowRight size={11} className="text-white/40 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-[12px] font-medium text-white line-clamp-1 group-hover:text-sky-200 transition-colors">
                      Western Province
                    </p>
                    <span className="text-[10px] text-white/50">6.9271° N, 79.8612° E</span>
                  </button>
                </div>
              </div>
            </Animate>
          }
          navLinks={[
            { label: 'Citizen Portal', href: '/citizen' },
            { label: 'Verified Shelters', href: '/citizen/shelters', badge: `${telemetry.metrics.operationalSheltersCount} Active` },
            { label: 'Satellite Map', href: '/map' },
            { label: 'Coordinator Command', href: '/coordinator/dashboard' },
            { 
              label: 'All Portals & Hubs', 
              href: '#directory', 
              onClick: () => setShowDirectoryModal(true),
              badge: '30 Pages' 
            },
            { label: 'Role Demos', href: '#demos', onClick: () => setShowRoleModal(true) },
          ]}
          loginLabel="Sign In"
          loginLink="/login"
          signupLabel="Sign Up"
          signupLink="/signup"
          ctaNavLabel="Request Help"
          ctaNavLink="/citizen/submit"
          onScrollDown={() => {
            const el = document.getElementById('operations-telemetry-section') || document.getElementById('immediate-assistance-tray');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          scrollDownLabel="Explore Live Ground Operations"
        />
      ) : (
        <div className="relative">
          <div className="absolute top-5 right-24 z-50">
            <button
              type="button"
              onClick={() => setHeroMode('crisis')}
              className="text-[12px] px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-[12px] border border-white/20 text-white font-[450] transition-colors cursor-pointer"
            >
              ← Back to Crisis Operations
            </button>
          </div>
          <Hero
            onScrollDown={() => {
              const el = document.getElementById('operations-telemetry-section') || document.getElementById('immediate-assistance-tray');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            scrollDownLabel="Explore Website Features"
          />
        </div>
      )}

      {/* =========================================================
         3. Horizontal Stats Ribbon (Matching Website Telemetry)
         ========================================================= */}
      <section className="w-full bg-[#080A19] border-y border-white/[0.08] py-12" id="operations-telemetry-section">
        <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Stat 1 */}
            <div className="rounded-[22px] bg-slate-900/50 backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-[500] text-white tracking-tight">{telemetry.metrics.peopleSupported.toLocaleString()}+</span>
                  <span className="text-[11px] font-[500] text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp size={11} /> +340 today
                  </span>
                </div>
                <h4 className="text-[14px] font-[500] text-white/90 mt-0.5">Citizens Supported</h4>
                <p className="text-[12px] text-white/50 mt-1 leading-snug">Western Province relief coverage across 3 flooded districts</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="rounded-[22px] bg-slate-900/50 backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Layers size={22} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-[500] text-white tracking-tight">{telemetry.metrics.activeResponseOperations}</span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-semibold">Active</span>
                </div>
                <h4 className="text-[14px] font-[500] text-white/90 mt-0.5">Field Operations</h4>
                <p className="text-[12px] text-white/50 mt-1 leading-snug">Rescue boats, dry ration convoys & potable water bowsers</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="rounded-[22px] bg-slate-900/50 backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Zap size={22} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-[500] text-white tracking-tight">4.2 min</span>
                  <span className="text-[11px] font-[500] text-amber-300 flex items-center gap-0.5">
                    <Activity size={11} /> -82% SLA
                  </span>
                </div>
                <h4 className="text-[14px] font-[500] text-white/90 mt-0.5">AI Triage Speed</h4>
                <p className="text-[12px] text-white/50 mt-1 leading-snug">Automated NLP hazard classification & priority queueing</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="rounded-[22px] bg-slate-900/50 backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Building2 size={22} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-[500] text-white tracking-tight">{telemetry.metrics.operationalSheltersCount} Shelters</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold">Verified</span>
                </div>
                <h4 className="text-[14px] font-[500] text-white/90 mt-0.5">Evacuation Centers</h4>
                <p className="text-[12px] text-white/50 mt-1 leading-snug">{telemetry.metrics.shelterOccupancyPercent}% bed capacity currently occupied</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
         4. Immediate Assistance Quick Category Tray (Matching CitizenPortal)
         ========================================================= */}
      <section className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] py-16 sm:py-24" id="immediate-assistance-tray">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-emerald-400 text-[12px] tracking-[0.2em] font-[500] uppercase mb-2 block">
              EMERGENCY RELIEF INTAKE
            </span>
            <h2 className="text-white text-[32px] sm:text-[48px] font-normal leading-[1.05] tracking-[-0.02em]">
              Need Immediate Humanitarian Assistance?
            </h2>
            <p className="text-white/70 text-[16px] sm:text-[18px] font-[450] mt-3 max-w-[640px] leading-relaxed">
              Select your critical need below to initiate instant AI-triaged dispatch, locate the nearest verified evacuation shelter, or request urgent life-saving supplies.
            </p>
          </div>

          <Link 
            to="/citizen"
            className="h-[46px] px-6 rounded-[12px] border border-white text-white text-[14px] sm:text-[15px] font-[450] hover:bg-white/10 transition-colors inline-flex items-center gap-2 cursor-pointer text-decoration-none self-start md:self-auto shrink-0"
          >
            <span>Explore Citizen Portal</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 6 Category Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickCategories.map((cat) => {
            const IconComponent = cat.icon;
            const backendCategory = telemetry.quickCategories?.find(
              (q) => q.key?.toLowerCase() === cat.key?.toLowerCase() || q.key?.toLowerCase() === cat.id?.toLowerCase()
            );
            const openCount = backendCategory?.openRequestsCount;

            return (
              <div 
                key={cat.id} 
                onClick={() => navigate(cat.link)}
                className="rounded-[24px] bg-slate-900/40 hover:bg-slate-900/70 backdrop-blur-[20px] border border-white/[0.08] hover:border-white/25 p-7 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[190px] shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-start justify-between">
                  <div 
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}30`, color: cat.color }}
                  >
                    <IconComponent size={22} />
                  </div>
                  <div className="flex items-center gap-2">
                    {openCount !== undefined && openCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-semibold">
                        {openCount} Active
                      </span>
                    )}
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white text-white/70 group-hover:text-[#0A0707] flex items-center justify-center transition-all">
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-white text-[19px] sm:text-[20px] font-[500] leading-snug group-hover:text-emerald-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-white/60 text-[13.5px] font-[450] mt-1.5 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
         5. CORE CAPABILITIES (Intelligent Crisis Architecture)
         ========================================================= */}
      <section className="w-full bg-[#080A19] border-t border-white/[0.06] py-16 sm:py-24">
        <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]">
          <div className="max-w-[760px] mb-14">
            <span className="text-sky-400 text-[12px] tracking-[0.2em] font-[500] uppercase mb-2 block">
              INTELLIGENT CRISIS INFRASTRUCTURE
            </span>
            <h2 className="text-white text-[32px] sm:text-[48px] font-normal leading-[1.05] tracking-[-0.02em]">
              Engineered for Rapid Humanitarian Action
            </h2>
            <p className="text-white/70 text-[16px] sm:text-[18px] font-[450] mt-3 leading-relaxed">
              RELIEFCORE connects vulnerable citizens, volunteer search-and-rescue teams, and provincial command centers through automated machine triage, verifiable supply chains, and transparent shelter networks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Capability 1 */}
            <div className="rounded-[28px] bg-slate-900/50 backdrop-blur-[20px] border border-white/[0.08] p-8 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="w-14 h-14 rounded-[16px] bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6">
                  <Cpu size={26} />
                </div>
                <h3 className="text-white text-[22px] font-[500] mb-3">
                  Automated AI Triage & NLP
                </h3>
                <p className="text-white/70 text-[14.5px] font-[450] leading-relaxed mb-6">
                  Machine learning algorithms process unstructured citizen emergency descriptions, automatically extract trapped member counts, identify medical hazards, and calculate dynamic urgency scores (1-5).
                </p>
              </div>
              <ul className="space-y-2.5 pt-6 border-t border-white/[0.08] text-[13px] text-white/80">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Trapped count, water level & medical urgency extraction</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Dynamic priority queues prevent response SLA breach</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Explainable AI rationale presented for human sign-off</span>
                </li>
              </ul>
            </div>

            {/* Capability 2 */}
            <div className="rounded-[28px] bg-slate-900/50 backdrop-blur-[20px] border border-white/[0.08] p-8 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="w-14 h-14 rounded-[16px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <Truck size={26} />
                </div>
                <h3 className="text-white text-[22px] font-[500] mb-3">
                  Resource Logistics & Dispatch
                </h3>
                <p className="text-white/70 text-[14.5px] font-[450] leading-relaxed mb-6">
                  Real-time inventory ledger tracking across regional warehouses, automated supply convoy routing, medical kits, and life-boat allocations to priority hazard zones.
                </p>
              </div>
              <ul className="space-y-2.5 pt-6 border-t border-white/[0.08] text-[13px] text-white/80">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Multi-depot inventory visibility & stock threshold alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>GPS vehicle tracking & safe high-ground route optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Strict multi-agency allocation audit logs</span>
                </li>
              </ul>
            </div>

            {/* Capability 3 */}
            <div className="rounded-[28px] bg-slate-900/50 backdrop-blur-[20px] border border-white/[0.08] p-8 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="w-14 h-14 rounded-[16px] bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                  <Building2 size={26} />
                </div>
                <h3 className="text-white text-[22px] font-[500] mb-3">
                  Verified Shelter Capacity
                </h3>
                <p className="text-white/70 text-[14.5px] font-[450] leading-relaxed mb-6">
                  Dynamic bed counter sync for evacuation centers across Western Province, direct evacuee family intake, vulnerable demographic tracking, and medical facility proximity.
                </p>
              </div>
              <ul className="space-y-2.5 pt-6 border-t border-white/[0.08] text-[13px] text-white/80">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Live bed availability verified by on-site managers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Special needs placement (elderly, infants & pregnant women)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Automated evacuee overflow redirection to secondary hubs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
         6. Operational GIS Satellite Map & Sector Overview
         ========================================================= */}
      <section className="w-full bg-[#080A19] border-t border-white/[0.06] py-16 sm:py-24">
        <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column (5 Cols) */}
            <div className="lg:col-span-5 rounded-[28px] bg-slate-900/50 backdrop-blur-[20px] border border-white/[0.08] p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-semibold tracking-wider uppercase mb-5">
                  <MapPin size={12} />
                  <span>SATELLITE SITUATION REPORT</span>
                </div>
                <h2 className="text-white text-[32px] sm:text-[42px] font-normal leading-[1.05] tracking-[-0.02em] mb-4">
                  Western Province Sector Radar & Basin Telemetry
                </h2>
                <p className="text-white/70 text-[15px] font-[450] leading-relaxed mb-6">
                  Continuous multi-layer satellite flood telemetry, high-water breach perimeters, and shelter proximity mapping across Colombo, Gampaha, and Kalutara districts.
                </p>

                {/* District Sector Status */}
                <div className="space-y-3 pt-6 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between text-[13.5px]">
                    <span className="text-white/80">Colombo Sector (Kelani Basin):</span>
                    <span className="text-amber-400 font-medium">Minor Flood Crest Advisory</span>
                  </div>
                  <div className="flex items-center justify-between text-[13.5px]">
                    <span className="text-white/80">Gampaha Sector (Attanagalu Oya):</span>
                    <span className="text-rose-400 font-medium">Critical Overflow Watch</span>
                  </div>
                  <div className="flex items-center justify-between text-[13.5px]">
                    <span className="text-white/80">Kalutara Sector (Kalu Ganga):</span>
                    <span className="text-emerald-400 font-medium">Safe Corridors Open</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/map')}
                  className="h-[48px] sm:h-[51px] px-6 sm:px-[27px] bg-[#E9E9E9] hover:bg-white text-[#0A0707] text-[14px] sm:text-[15.5px] font-[500] rounded-[12px] transition-colors inline-flex items-center gap-2 cursor-pointer border-0 shadow-lg"
                >
                  <span>Inspect GIS Map</span>
                  <ArrowRight size={14} />
                </button>
                <span className="text-[11px] font-mono text-white/50">6.9271° N, 79.8612° E</span>
              </div>
            </div>

            {/* Right Column (7 Cols): Satellite Map Visual Preview */}
            <div className="lg:col-span-7 rounded-[28px] overflow-hidden border border-white/[0.1] relative bg-slate-900/60 backdrop-blur-[20px] min-h-[440px] flex items-center justify-center p-6 shadow-[0_24px_50px_rgba(0,0,0,0.5)]">
              <div className="relative w-full max-w-[540px] flex items-center justify-center">
                <img 
                  src={westernProvinceMap} 
                  alt="Western Province Sri Lanka Flood Map" 
                  className="w-full h-auto max-h-[380px] object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                />
                {/* Radar Pulses */}
                <div className="absolute top-[48%] left-[42%] flex items-center justify-center pointer-events-none">
                  <span className="absolute w-10 h-10 rounded-full bg-rose-500/30 animate-ping"></span>
                  <span className="relative w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-[0_0_12px_#f43f5e]"></span>
                  <span className="absolute left-6 text-[11px] font-semibold text-rose-300 bg-[#080A19]/80 px-2 py-0.5 rounded backdrop-blur border border-rose-500/30 whitespace-nowrap">
                    Colombo (Active SOS)
                  </span>
                </div>
                <div className="absolute top-[28%] left-[48%] flex items-center justify-center pointer-events-none">
                  <span className="absolute w-8 h-8 rounded-full bg-amber-500/30 animate-ping"></span>
                  <span className="relative w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-[0_0_10px_#f59e0b]"></span>
                  <span className="absolute left-5 text-[11px] font-semibold text-amber-300 bg-[#080A19]/80 px-2 py-0.5 rounded backdrop-blur border border-amber-500/30 whitespace-nowrap">
                    Gampaha (Convoys En Route)
                  </span>
                </div>
                <div className="absolute top-[72%] left-[54%] flex items-center justify-center pointer-events-none">
                  <span className="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></span>
                  <span className="relative w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-[0_0_10px_#10b981]"></span>
                  <span className="absolute left-5 text-[11px] font-semibold text-emerald-300 bg-[#080A19]/80 px-2 py-0.5 rounded backdrop-blur border border-emerald-500/30 whitespace-nowrap">
                    Kalutara (Shelters Open)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
         7. Platform Role Showcase (12 Command Workspaces)
         ========================================================= */}
      <section className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] py-16 sm:py-24 border-t border-white/[0.06]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-purple-400 text-[12px] tracking-[0.2em] font-[500] uppercase mb-2 block">
              HUMANITARIAN COMMAND NETWORK
            </span>
            <h2 className="text-white text-[32px] sm:text-[48px] font-normal leading-[1.05] tracking-[-0.02em]">
              Role-Based Command for Every Responder
            </h2>
            <p className="text-white/70 text-[16px] sm:text-[18px] font-[450] mt-3 max-w-[660px] leading-relaxed">
              Dedicated operational workspaces engineered to deliver zero-latency situational awareness to citizens, coordinators, logistics depots, and frontline rescue teams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
            <button 
              type="button"
              onClick={() => setShowDirectoryModal(true)}
              className="h-[46px] px-6 rounded-[12px] bg-white text-[#0A0707] hover:bg-white/90 text-[14px] sm:text-[15px] font-[500] transition-colors inline-flex items-center gap-2 cursor-pointer border-0 shadow-md"
            >
              <LayoutGrid size={16} />
              <span>Platform Directory (30)</span>
            </button>
            <button 
              type="button"
              onClick={() => setShowRoleModal(true)}
              className="h-[46px] px-6 rounded-[12px] border border-white text-white text-[14px] sm:text-[15px] font-[450] hover:bg-white/10 transition-colors inline-flex items-center gap-2 cursor-pointer bg-transparent"
            >
              <span>Role Switcher Demo</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 12 Operational Role Workspaces Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r, i) => {
            const IconComponent = r.icon;
            return (
              <div 
                key={i} 
                className="rounded-[24px] bg-slate-900/40 hover:bg-slate-900/70 backdrop-blur-[20px] border border-white/[0.08] hover:border-white/25 p-6 sm:p-7 transition-all duration-300 group flex flex-col justify-between shadow-[0_12px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${r.color}15`, border: `1px solid ${r.color}30`, color: r.color }}
                    >
                      <IconComponent size={22} />
                    </div>
                    <span 
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase font-mono"
                      style={{ backgroundColor: `${r.color}15`, color: r.color, border: `1px solid ${r.color}30` }}
                    >
                      {r.badge}
                    </span>
                  </div>

                  <h3 
                    onClick={() => navigate(r.path)}
                    className="text-white text-[19px] sm:text-[20px] font-[500] group-hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    {r.title}
                  </h3>
                  <p className="text-white/60 text-[13px] font-[450] mt-1.5 leading-relaxed">
                    {r.desc}
                  </p>

                  {/* Sub-links / Quick launch buttons to access each sub-page */}
                  {r.sublinks && r.sublinks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/[0.06]">
                      {r.sublinks.map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(sub.path);
                          }}
                          className="px-2.5 py-1 rounded-[8px] bg-white/[0.05] hover:bg-white/[0.14] text-white/75 hover:text-white text-[11px] font-[450] border border-white/[0.08] transition-colors cursor-pointer"
                        >
                          {sub.label} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11.5px] text-white/50 line-clamp-1">{r.featured}</span>
                  <button
                    type="button"
                    onClick={() => navigate(r.path)}
                    className="h-[34px] px-4 rounded-[10px] bg-white/[0.08] hover:bg-white text-white hover:text-slate-900 text-[12.5px] font-[500] flex items-center gap-1.5 transition-all cursor-pointer border border-white/10 shrink-0 ml-2"
                  >
                    <span>Launch</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
         8. Emergency Safety Guidance & Hotlines Directory
         ========================================================= */}
      <section className="w-full bg-[#080A19] border-t border-white/[0.06] py-16 sm:py-20">
        <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-rose-400 text-[12px] tracking-[0.2em] font-[500] uppercase mb-2 block">
                24/7 TOLL-FREE EMERGENCY DIRECTORY
              </span>
              <h2 className="text-white text-[32px] sm:text-[44px] font-normal leading-[1.05] tracking-[-0.02em]">
                Immediate Help & Emergency Direct Lines
              </h2>
              <p className="text-white/70 text-[16px] font-[450] mt-2 max-w-[640px]">
                Immediate, toll-free 24/7 direct dial contacts for Sri Lanka disaster response, ambulance trauma care, and armed forces search & rescue units.
              </p>
            </div>

            <button 
              type="button"
              onClick={() => setShowSafetyModal(true)}
              className="h-[46px] px-6 rounded-[12px] border border-white text-white text-[14px] font-[450] hover:bg-white/10 transition-colors inline-flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0 bg-transparent"
            >
              <span>Full Field Safety Protocols</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(hotlines && hotlines.length > 0 ? hotlines : [
              { name: 'Disaster Management Centre', number: '117', service: 'National 24/7 toll-free crisis response intake' },
              { name: 'Suwa Seriya Ambulance', number: '1990', service: 'Pre-hospital emergency care & rapid dispatch' },
              { name: 'Police Emergency Service', number: '119', service: 'Ground rescue & emergency security operations' }
            ]).slice(0, 3).map((item, idx) => {
              const styles = [
                { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', hover: 'hover:text-rose-300', icon: PhoneCall },
                { bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-400', hover: 'hover:text-sky-300', icon: HeartPulse },
                { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', hover: 'hover:text-emerald-300', icon: ShieldAlert },
              ];
              const cur = styles[idx % styles.length];
              const IconComp = cur.icon;

              return (
                <div key={idx} className="rounded-[22px] bg-slate-900/50 backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-[14px] ${cur.bg} border ${cur.border} ${cur.text} flex items-center justify-center shrink-0`}>
                    <IconComp size={22} />
                  </div>
                  <div>
                    <a href={`tel:${item.number.replace(/\s+/g, '')}`} className={`text-[28px] font-mono font-[500] ${cur.text} ${cur.hover} transition-colors text-decoration-none`}>
                      {item.number}
                    </a>
                    <h4 className="text-[14px] font-[500] text-white mt-1">{item.name}</h4>
                    <p className="text-[12px] text-white/50 mt-0.5">{item.service || '24/7 Emergency Line'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
         9. Apogee Style Footer
         ========================================================= */}
      <footer className="w-full bg-[#080A19] border-t border-white/[0.08] pt-16 pb-12 text-white/70">
        <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-white/[0.08]">
            {/* Col 1: Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <img 
                  src={reliefcoreLogoWhite} 
                  alt="RELIEFCORE" 
                  className="h-[28px] w-auto object-contain"
                />
              </div>
              <p className="text-[13.5px] font-[450] text-white/60 max-w-[380px] leading-relaxed">
                Autonomous humanitarian logistics & crisis coordination platform engineered for real-time disaster response across Sri Lanka.
              </p>
              <div className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit text-[11.5px] text-white/70">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Western Province Operations Active · All Regional Hubs Synchronized</span>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setShowDirectoryModal(true)}
                  className="px-4 py-2 rounded-[10px] bg-white/[0.08] hover:bg-white/[0.16] text-white border border-white/15 text-[12.5px] font-[500] inline-flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LayoutGrid size={14} className="text-sky-300" />
                  <span>Open Platform Directory (30 Portals)</span>
                </button>
              </div>
            </div>

            {/* Col 2: Citizen Services */}
            <div>
              <h5 className="text-white text-[13px] font-[500] uppercase tracking-wider mb-4">Citizen Services</h5>
              <ul className="space-y-2 text-[13px]">
                <li><Link to="/citizen/submit" className="text-white/60 hover:text-white transition-colors text-decoration-none">Submit Assistance SOS</Link></li>
                <li><Link to="/citizen/track" className="text-white/60 hover:text-white transition-colors text-decoration-none">Track My Request</Link></li>
                <li><Link to="/citizen/shelters" className="text-white/60 hover:text-white transition-colors text-decoration-none">Verified Open Shelters</Link></li>
                <li><Link to="/citizen/alerts" className="text-white/60 hover:text-white transition-colors text-decoration-none">Live Hazard Alerts</Link></li>
                <li><Link to="/citizen/safety" className="text-white/60 hover:text-white transition-colors text-decoration-none">Safety & Evacuation</Link></li>
                <li><Link to="/citizen/support" className="text-white/60 hover:text-white transition-colors text-decoration-none">24/7 Helplines</Link></li>
                <li><Link to="/citizen/profile" className="text-white/60 hover:text-white transition-colors text-decoration-none">Household Profile</Link></li>
                <li><Link to="/donations" className="text-white/60 hover:text-white transition-colors text-decoration-none">Public Relief Donations</Link></li>
                <li><Link to="/citizen" className="text-white/60 hover:text-white transition-colors text-decoration-none">Public Citizen Portal</Link></li>
              </ul>
            </div>

            {/* Col 3: Command & AI */}
            <div>
              <h5 className="text-white text-[13px] font-[500] uppercase tracking-wider mb-4">Command &amp; AI</h5>
              <ul className="space-y-2 text-[13px]">
                <li><Link to="/coordinator" className="text-white/60 hover:text-white transition-colors text-decoration-none">Coordinator Portal</Link></li>
                <li><Link to="/coordinator/overview" className="text-white/60 hover:text-white transition-colors text-decoration-none">Operations Overview</Link></li>
                <li><Link to="/coordinator/review" className="text-white/60 hover:text-white transition-colors text-decoration-none">AI Assisted Review</Link></li>
                <li><Link to="/coordinator/dashboard" className="text-white/60 hover:text-white transition-colors text-decoration-none">Coordinator Cockpit</Link></li>
                <li><Link to="/coordinator/triage" className="text-white/60 hover:text-white transition-colors text-decoration-none">Request Triage Queue</Link></li>
                <li><Link to="/case-manager" className="text-white/60 hover:text-white transition-colors text-decoration-none">Incident Case Manager</Link></li>
                <li><Link to="/ai-operations" className="text-white/60 hover:text-white transition-colors text-decoration-none">AI Operations Center</Link></li>
                <li><Link to="/ai-governance" className="text-white/60 hover:text-white transition-colors text-decoration-none">AI Ethics &amp; Governance</Link></li>
              </ul>
            </div>

            {/* Col 4: Shelters & Logistics */}
            <div>
              <h5 className="text-white text-[13px] font-[500] uppercase tracking-wider mb-4">Shelters &amp; Logistics</h5>
              <ul className="space-y-2 text-[13px]">
                <li><Link to="/shelter-admin" className="text-white/60 hover:text-white transition-colors text-decoration-none">Shelter Facility Manager</Link></li>
                <li><Link to="/shelters/directory" className="text-white/60 hover:text-white transition-colors text-decoration-none">Shelter Directory</Link></li>
                <li><Link to="/shelters/allocation" className="text-white/60 hover:text-white transition-colors text-decoration-none">Evacuee Allocation</Link></li>
                <li><Link to="/logistics/inventory" className="text-white/60 hover:text-white transition-colors text-decoration-none">Warehouse Stockpiles</Link></li>
                <li><Link to="/logistics/dispatch" className="text-white/60 hover:text-white transition-colors text-decoration-none">Supply Convoy Dispatch</Link></li>
                <li><Link to="/volunteer" className="text-white/60 hover:text-white transition-colors text-decoration-none">Volunteer Portal</Link></li>
                <li><Link to="/volunteer/opportunities" className="text-white/60 hover:text-white transition-colors text-decoration-none">Mission Opportunities</Link></li>
                <li><Link to="/volunteers/roster" className="text-white/60 hover:text-white transition-colors text-decoration-none">Volunteer Roster</Link></li>
              </ul>
            </div>

            {/* Col 5: Governance & Access */}
            <div>
              <h5 className="text-white text-[13px] font-[500] uppercase tracking-wider mb-4">System &amp; Access</h5>
              <ul className="space-y-2 text-[13px]">
                <li><Link to="/map" className="text-white/60 hover:text-white transition-colors text-decoration-none">Satellite GIS Map</Link></li>
                <li><Link to="/reports" className="text-white/60 hover:text-white transition-colors text-decoration-none">Reports &amp; Analytics</Link></li>
                <li><Link to="/audit" className="text-white/60 hover:text-white transition-colors text-decoration-none">Immutable Audit Ledger</Link></li>
                <li><Link to="/admin" className="text-white/60 hover:text-white transition-colors text-decoration-none">Platform Admin &amp; Health</Link></li>
                <li><Link to="/admin/users" className="text-white/60 hover:text-white transition-colors text-decoration-none">User RBAC Controls</Link></li>
                <li><Link to="/login" className="text-white/60 hover:text-white transition-colors text-decoration-none">Operator Sign In</Link></li>
                <li><Link to="/signup" className="text-white/60 hover:text-white transition-colors text-decoration-none">Register Account</Link></li>
                <li><Link to="/bloom" className="text-white/60 hover:text-white transition-colors text-decoration-none">Bloom Glass Concept</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white/50">
            <span>© 2026 RELIEFCORE Crisis Operations System. Western Province, Sri Lanka.</span>
            <span>Humanitarian AI Architecture · Rapid Disaster Response · Open Data Protocols</span>
          </div>
        </div>
      </footer>

      {/* =========================================================
         10. Interactive Role Demo Access Modal
         ========================================================= */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080A19]/90 backdrop-blur-[24px]" onClick={() => setShowRoleModal(false)}>
          <div className="w-full max-w-[680px] rounded-[28px] bg-[#0B1120]/95 backdrop-blur-[32px] border border-white/[0.12] p-7 sm:p-9 shadow-[0_24px_50px_rgba(0,0,0,0.6)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6 pb-5 border-b border-white/[0.08]">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold tracking-wider uppercase mb-2 inline-block">
                  RAPID ROLE SWITCHER
                </span>
                <h3 className="text-white text-[24px] font-[500]">Select Operational Workspace</h3>
                <p className="text-white/60 text-[13.5px] font-[450] mt-1">
                  Click any role to jump directly into that user experience.
                </p>
              </div>
              <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border-0 transition-colors" onClick={() => setShowRoleModal(false)} title="Close">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {roles.map((r, i) => {
                const IconComp = r.icon;
                return (
                  <div 
                    key={i} 
                    className="p-4 rounded-[16px] bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer group flex items-start gap-3"
                    onClick={() => {
                      setShowRoleModal(false);
                      navigate(r.path);
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${r.color}15`, color: r.color }}
                    >
                      <IconComp size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-white text-[14px] font-[500] truncate group-hover:text-emerald-300 transition-colors">{r.title}</h4>
                      </div>
                      <p className="text-white/50 text-[12px] font-[450] mt-0.5 line-clamp-1">{r.badge}</p>
                    </div>
                    <ChevronRight size={14} className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all self-center shrink-0" />
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between text-[13px] text-white/60">
              <span>Need a new personal or volunteer account?</span>
              <button
                type="button"
                className="h-[38px] px-5 bg-[#E9E9E9] hover:bg-white text-[#0A0707] font-[500] rounded-[10px] transition-colors cursor-pointer border-0 text-[13px]"
                onClick={() => {
                  setShowRoleModal(false);
                  navigate('/signup');
                }}
              >
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         11. Safety Guidance Modal
         ========================================================= */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080A19]/90 backdrop-blur-[24px]" onClick={() => setShowSafetyModal(false)}>
          <div className="w-full max-w-[680px] rounded-[28px] bg-[#0B1120]/95 backdrop-blur-[32px] border border-white/[0.12] p-7 sm:p-9 shadow-[0_24px_50px_rgba(0,0,0,0.6)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6 pb-5 border-b border-white/[0.08]">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-semibold tracking-wider uppercase mb-2 inline-block">
                  OFFICIAL PROTOCOLS
                </span>
                <h3 className="text-white text-[24px] font-[500]">Field Safety Guidance & Hotlines</h3>
                <p className="text-white/60 text-[13.5px] font-[450] mt-1">
                  Official procedures for Western Province flood basin advisories.
                </p>
              </div>
              <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border-0 transition-colors" onClick={() => setShowSafetyModal(false)} title="Close">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-1">
              {/* Hotlines */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(hotlines && hotlines.length > 0 ? hotlines : [
                  { name: 'DMC Operations', number: '117', service: 'Toll-Free 24/7 Hotline' },
                  { name: 'Suwa Seriya', number: '1990', service: 'Ambulance Dispatch' },
                  { name: 'Police Rescue', number: '119', service: 'Emergency Response' }
                ]).slice(0, 3).map((h, i) => (
                  <div key={i} className="p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.08]">
                    <a href={`tel:${h.number.replace(/\s+/g, '')}`} className="text-rose-400 font-mono text-[22px] font-[500] hover:underline text-decoration-none block">
                      {h.number}
                    </a>
                    <div className="text-white text-[13px] font-[500] mt-1 truncate">{h.name}</div>
                    <div className="text-white/50 text-[11px] truncate">{h.service || 'Emergency Hotline'}</div>
                  </div>
                ))}
              </div>

              {/* Dynamic Safety Guides from Backend */}
              {safetyGuides && safetyGuides.length > 0 ? (
                safetyGuides.map((guide, idx) => (
                  <div key={idx} className="p-5 rounded-[18px] bg-white/[0.04] border border-white/[0.08]">
                    <div className="flex items-center gap-2 text-emerald-400 text-[14.5px] font-[500] mb-2">
                      <CheckCircle2 size={16} />
                      <span>{guide.title}</span>
                    </div>
                    <p className="text-[12.5px] text-white/60 mb-3">{guide.description}</p>
                    {guide.actionItems && guide.actionItems.length > 0 && (
                      <ul className="space-y-1.5 text-[13px] text-white/70 leading-relaxed list-disc pl-5 mb-3">
                        {guide.actionItems.map((item, aIdx) => (
                          <li key={aIdx}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {guide.packItems && guide.packItems.length > 0 && (
                      <div className="pt-2 border-t border-white/[0.06] text-[12px] text-amber-200/80">
                        <strong className="text-white font-[500]">Emergency Bag Pack:</strong>{' '}
                        {guide.packItems.join(' · ')}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                /* Fallback static protocol */
                <div className="p-5 rounded-[18px] bg-white/[0.04] border border-white/[0.08]">
                  <div className="flex items-center gap-2 text-emerald-400 text-[14.5px] font-[500] mb-3">
                    <CheckCircle2 size={16} />
                    <span>Flash Flood Evacuation Safety Protocol</span>
                  </div>
                  <ul className="space-y-2 text-[13px] text-white/70 leading-relaxed">
                    <li><strong>Avoid Floodwaters:</strong> Never attempt to walk, swim, or drive through moving water. 15 cm of rapid flow can sweep adults away.</li>
                    <li><strong>Electrical Isolation:</strong> Shut off main circuit breakers before floodwaters enter building entrances. Avoid wet power points.</li>
                    <li><strong>Secure Critical Documents:</strong> Place identification, deeds, and prescription medicines in sealed waterproof bags on upper floors.</li>
                    <li><strong>Evacuate Proactively:</strong> If residing along Kelani or Kalu Ganga riverbanks, evacuate early to designated high-ground shelters.</li>
                  </ul>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setShowSafetyModal(false)}
                  className="h-[44px] px-6 bg-[#E9E9E9] hover:bg-white text-[#0A0707] font-[500] text-[14px] rounded-[11px] transition-colors cursor-pointer border-0 shadow-md"
                >
                  Understood & Saved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         12. How It Works Modal
         ========================================================= */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080A19]/90 backdrop-blur-[24px]" onClick={() => setShowHowItWorksModal(false)}>
          <div className="w-full max-w-[680px] rounded-[28px] bg-[#0B1120]/95 backdrop-blur-[32px] border border-white/[0.12] p-7 sm:p-9 shadow-[0_24px_50px_rgba(0,0,0,0.6)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6 pb-5 border-b border-white/[0.08]">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-semibold tracking-wider uppercase mb-2 inline-block">
                  PROCESS WORKFLOW
                </span>
                <h3 className="text-white text-[24px] font-[450]">How RELIEFCORE Works</h3>
                <p className="text-white/60 text-[13.5px] font-[450] mt-1">
                  From citizen SOS intake to on-the-ground rescue and verification.
                </p>
              </div>
              <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border-0 transition-colors" onClick={() => setShowHowItWorksModal(false)} title="Close">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-3.5 rounded-[16px] bg-white/[0.04] border border-white/[0.08]">
                <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center text-[12px] font-bold shrink-0">1</div>
                <div>
                  <h4 className="text-white text-[14.5px] font-[450]">SOS Request Submission</h4>
                  <p className="text-white/60 text-[13px] mt-0.5">Citizens or relatives submit emergency requests with location coordinates and assistance categories.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-[16px] bg-white/[0.04] border border-white/[0.08]">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[12px] font-bold shrink-0">2</div>
                <div>
                  <h4 className="text-white text-[14.5px] font-[450]">Automated AI NLP Triage</h4>
                  <p className="text-white/60 text-[13px] mt-0.5">AI extracts hazard cues, identifies vulnerable family members, and generates urgency scores in seconds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-[16px] bg-white/[0.04] border border-white/[0.08]">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[12px] font-bold shrink-0">3</div>
                <div>
                  <h4 className="text-white text-[14.5px] font-[450]">Coordinator Dispatch & Shelter Assignment</h4>
                  <p className="text-white/60 text-[13px] mt-0.5">Incident commanders confirm assignments and allocate nearest high-ground shelters and relief convoys.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-[16px] bg-white/[0.04] border border-white/[0.08]">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[12px] font-bold shrink-0">4</div>
                <div>
                  <h4 className="text-white text-[14.5px] font-[450]">Field Execution & Live Tracking</h4>
                  <p className="text-white/60 text-[13px] mt-0.5">Volunteers check in via mobile rosters while citizens track milestone progress in real-time.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.08] flex justify-end">
              <button 
                type="button"
                onClick={() => setShowHowItWorksModal(false)}
                className="h-[44px] px-6 bg-[#E9E9E9] hover:bg-white text-[#0A0707] font-[450] text-[14px] rounded-[11px] transition-colors cursor-pointer border-0"
              >
                Close Workflow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         13. Instant Live Request Tracking Modal
         ========================================================= */}
      {trackingModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080A19]/90 backdrop-blur-[24px]" onClick={() => setTrackingModalData(null)}>
          <div className="w-full max-w-[620px] rounded-[28px] bg-[#0B1120]/95 backdrop-blur-[32px] border border-white/[0.12] p-6 sm:p-8 shadow-[0_24px_50px_rgba(0,0,0,0.6)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-semibold">
                    {trackingModalData.publicReference || 'REQ-LIVE'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                    trackingModalData.urgency === 'Critical' ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' :
                    trackingModalData.urgency === 'High' ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' :
                    'bg-sky-500/15 border border-sky-500/30 text-sky-300'
                  }`}>
                    {trackingModalData.urgency || 'Active'}
                  </span>
                </div>
                <h3 className="text-white text-[22px] font-[500]">
                  {trackingModalData.category || 'Humanitarian Assistance Request'}
                </h3>
                <p className="text-white/60 text-[13px] font-[450] mt-0.5">
                  {trackingModalData.coarseLocation} · {trackingModalData.peopleCount} individuals in household
                </p>
              </div>
              <button 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border-0 transition-colors" 
                onClick={() => setTrackingModalData(null)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Status Highlight Banner */}
              <div className="p-4 rounded-[16px] bg-slate-900/60 border border-white/[0.08] flex items-start gap-3">
                <Activity size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 text-white text-[13.5px] font-[500]">
                    <span>Status: <strong className="text-emerald-300">{trackingModalData.status}</strong></span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/70">Assigned: {trackingModalData.assignedTeam || 'Rapid Response Unit'}</span>
                  </div>
                  <p className="text-white/60 text-[12.5px] mt-1 leading-relaxed">
                    {trackingModalData.statusNote || 'Your ticket is synchronized with provincial coordinator dispatch.'}
                  </p>
                </div>
              </div>

              {/* Milestone Timeline */}
              {trackingModalData.timeline && trackingModalData.timeline.length > 0 && (
                <div className="p-4 rounded-[16px] bg-white/[0.02] border border-white/[0.06]">
                  <h4 className="text-white/80 text-[12px] font-[500] uppercase tracking-wider mb-3">Response Milestones</h4>
                  <div className="space-y-3">
                    {trackingModalData.timeline.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-[13px]">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          step.isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                          step.isCurrent ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse' :
                          'bg-white/5 text-white/30 border border-white/10'
                        }`}>
                          {step.isCompleted ? <Check size={11} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-[500] ${step.isCompleted ? 'text-white' : step.isCurrent ? 'text-amber-300' : 'text-white/40'}`}>
                              {step.title}
                            </span>
                            {step.timestamp && (
                              <span className="text-[11px] font-mono text-white/40">
                                {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-white/50 mt-0.5 leading-snug">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setTrackingModalData(null)}
                  className="h-[42px] px-5 rounded-[11px] border border-white/20 text-white/80 hover:text-white hover:bg-white/5 text-[13.5px] font-[450] transition-colors cursor-pointer bg-transparent"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const ref = trackingModalData.publicReference || trackingModalData.id;
                    setTrackingModalData(null);
                    navigate(`/citizen/track?id=${encodeURIComponent(ref)}`);
                  }}
                  className="h-[42px] px-6 bg-[#E9E9E9] hover:bg-white text-[#0A0707] font-[500] text-[13.5px] rounded-[11px] transition-colors cursor-pointer border-0 shadow-md inline-flex items-center gap-1.5"
                >
                  <span>Open in Citizen Portal</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         14. Master Platform Directory Modal (All 30 Pages)
         ========================================================= */}
      <PlatformDirectoryModal
        isOpen={showDirectoryModal}
        onClose={() => setShowDirectoryModal(false)}
      />

      {/* =========================================================
         15. Persistent Floating Platform Directory Launcher Pill
         ========================================================= */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setShowDirectoryModal(true)}
          className="h-[46px] px-4 sm:px-5 rounded-full bg-[#0c1024]/90 hover:bg-[#121836] text-white backdrop-blur-[20px] border border-white/20 shadow-[0_12px_32px_rgba(0,0,0,0.65)] hover:border-white/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer font-medium text-[13px] group"
          title="Open Platform Directory: One-click access to all 30 platform destinations (Esc to close)"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <LayoutGrid size={16} className="text-sky-300 group-hover:rotate-90 transition-transform duration-300" />
          <span>Platform Directory</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10.5px] font-mono text-white/80">30</span>
        </button>
      </div>
    </div>
  );
};
export default LandingHomePage;

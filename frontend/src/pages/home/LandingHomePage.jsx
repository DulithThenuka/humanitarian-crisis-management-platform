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
  ChevronDown
} from 'lucide-react';

import westernProvinceMap from '../../assets/western-province-map-clean.png';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import { homeService } from '../../services/homeService';
import Hero, { Animate, RevenueCard, BAR_HEIGHTS } from '../../components/Hero';

export const LandingHomePage = () => {
  const navigate = useNavigate();

  // Apogee Hero Theme Mode State ('crisis' | 'apogee')
  const [heroMode, setHeroMode] = useState('crisis');

  // Modals & Interactivity
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');

  // Live Backend Telemetry & Endpoints State
  const [alerts, setAlerts] = useState([]);
  const [hotlines, setHotlines] = useState([]);
  const [safetyGuides, setSafetyGuides] = useState([]);
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
    }
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
              metrics: data.metrics
            });
          }
        }
      } catch (err) {
        console.debug('Home telemetry service fallback active');
      }

      // 2. Fetch live crisis alerts
      try {
        const aRes = await homeService.getAlerts();
        const aData = aRes?.data || aRes?.Data || aRes;
        if (isMounted && Array.isArray(aData) && aData.length > 0) {
          setAlerts(aData);
        }
      } catch (err) {
        console.debug('Alerts service fallback active');
      }

      // 3. Fetch emergency hotlines
      try {
        const hRes = await homeService.getHotlines();
        const hData = hRes?.data || hRes?.Data || hRes;
        if (isMounted && Array.isArray(hData) && hData.length > 0) {
          setHotlines(hData);
        }
      } catch (err) {
        console.debug('Hotlines service fallback active');
      }

      // 4. Fetch safety guidance
      try {
        const sRes = await homeService.getSafetyGuidance();
        const sData = sRes?.data || sRes?.Data || sRes;
        if (isMounted && Array.isArray(sData) && sData.length > 0) {
          setSafetyGuides(sData);
        }
      } catch (err) {
        console.debug('Safety guidance service fallback active');
      }
    };

    fetchHomeTelemetry();
    return () => { isMounted = false; };
  }, []);

  // 6 Primary Assistance Categories Matching CitizenPortal
  const quickCategories = [
    {
      id: 'food',
      title: 'Emergency Food & Rations',
      desc: 'Pre-packed family ration hampers, baby nutrition & clean meal packs.',
      icon: UtensilsCrossed,
      color: '#38bdf8',
      link: '/citizen/submit?category=Food'
    },
    {
      id: 'medical',
      title: 'Critical Medical Care',
      desc: 'Emergency trauma first aid, chronic medicine kits & mobile clinics.',
      icon: Plus,
      color: '#34d399',
      link: '/citizen/submit?category=Medical'
    },
    {
      id: 'shelter',
      title: 'Verified Open Shelters',
      desc: 'High-ground relief centers with real-time bed capacity & meals.',
      icon: Building2,
      color: '#fbbf24',
      link: '/citizen/shelters'
    },
    {
      id: 'transport',
      title: 'Search & Flood Rescue',
      desc: 'Amphibious rescue boats, stranded resident extraction & SOS airlift.',
      icon: Bus,
      color: '#f87171',
      link: '/citizen/submit?category=Transport'
    },
    {
      id: 'water',
      title: 'Potable Clean Water',
      desc: 'Purified water bowsers, portable filtration & sanitary hydration packs.',
      icon: Droplets,
      color: '#60a5fa',
      link: '/citizen/submit?category=Drinking%20Water'
    },
    {
      id: 'access',
      title: 'Vulnerable & Special Care',
      desc: 'Priority assistance for infants, expectant mothers, elderly & disabled citizens.',
      icon: Accessibility,
      color: '#c084fc',
      link: '/citizen/submit?category=Accessibility'
    }
  ];

  // Role Showcase matching platform roles
  const roles = [
    {
      title: 'Disaster Affected Citizen',
      desc: 'Submit urgent rescue/ration requests, locate verified open shelters, and track real-time ticket milestones.',
      path: '/citizen',
      badge: 'Public Portal',
      icon: Users,
      color: '#38bdf8',
      featured: 'Instant SOS intake & live status tracking'
    },
    {
      title: 'Emergency Coordinator',
      desc: 'Live operational overview, automated AI triage review, dynamic priority queues, and incident command.',
      path: '/coordinator',
      badge: 'Command Center',
      icon: Radio,
      color: '#34d399',
      featured: 'Explainable AI triage rationale & resource dispatch'
    },
    {
      title: 'Logistics Manager',
      desc: 'Stockpile depot tracking, relief convoy allocation, medical supplies, and route optimization.',
      path: '/logistics/inventory',
      badge: 'Supply Chain',
      icon: Package,
      color: '#fbbf24',
      featured: 'Real-time warehouse depots & GPS convoy routing'
    },
    {
      title: 'Shelter Manager',
      desc: 'Live bed occupancy, evacuee intake registration, facility amenities, and capacity management.',
      path: '/shelters/directory',
      badge: 'Facilities',
      icon: Building2,
      color: '#f87171',
      featured: 'Live bed counters & vulnerable intake prioritization'
    },
    {
      title: 'Field Volunteer Responder',
      desc: 'Task assignment dispatch, on-ground rescue rosters, search & rescue coordination, and field check-ins.',
      path: '/volunteers/roster',
      badge: 'Field Ops',
      icon: Compass,
      color: '#c084fc',
      featured: 'Search & rescue teams & on-duty field rosters'
    },
    {
      title: 'Operational GIS Satellite Map',
      desc: 'Multi-layer geospatial flood mapping, real-time river basin advisories, and safe transit corridors.',
      path: '/map',
      badge: 'Geospatial',
      icon: MapPin,
      color: '#f43f5e',
      featured: 'Flood basin radar heatmaps & route status'
    }
  ];

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      navigate(`/citizen/track?id=${encodeURIComponent(trackingInput.trim())}`);
    } else {
      navigate('/citizen/track');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080A19] text-white font-['Suisse_Intl',-apple-system,BlinkMacSystemFont,sans-serif] -webkit-font-smoothing-antialiased overflow-x-hidden selection:bg-white/20 selection:text-white flex flex-col">
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

          <div className="flex items-center gap-4 text-white/60">
            <a href="tel:117" className="flex items-center gap-1.5 text-rose-300 hover:text-rose-200 transition-colors text-decoration-none font-medium">
              <PhoneCall size={12} />
              <span>Emergency DMC Hotline: <strong className="text-white">117</strong></span>
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
              <form className="flex items-center gap-2 p-1.5 rounded-[14px] bg-[rgba(17,16,15,0.45)] backdrop-blur-[20px] border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.37)]" onSubmit={handleTrackSubmit}>
                <Search size={16} className="text-white/50 ml-3 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search assistance ticket (e.g. REQ-2026-01842)..."
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-white text-[13.5px] font-[450] placeholder:text-white/40 px-2"
                />
                <button type="submit" className="h-[38px] px-4 rounded-[10px] bg-[#E9E9E9] hover:bg-white text-[#0A0707] text-[13px] font-[500] shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer border-0">
                  <span>Track Status</span>
                  <ArrowRight size={13} />
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
            </div>
          }
          rightContent={
            <Animate delay={900} direction="scale" className="w-full max-w-[440px] mx-auto lg:mx-0">
              <div className="w-full rounded-[24px] sm:rounded-[33px] bg-[rgba(17,16,15,0.45)] backdrop-blur-[24px] p-5 sm:p-7 pb-5 sm:pb-6 border border-white/[0.1] shadow-[0_24px_50px_rgba(0,0,0,0.5)]">
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
            <div className="rounded-[22px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-[450] text-white tracking-tight">{telemetry.metrics.peopleSupported.toLocaleString()}+</span>
                  <span className="text-[11px] font-[450] text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp size={11} /> +340 today
                  </span>
                </div>
                <h4 className="text-[14px] font-[450] text-white/90 mt-0.5">Citizens Supported</h4>
                <p className="text-[12px] text-white/50 mt-1 leading-snug">Western Province relief coverage across 3 flooded districts</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="rounded-[22px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Layers size={22} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-[450] text-white tracking-tight">{telemetry.metrics.activeResponseOperations}</span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-semibold">Active</span>
                </div>
                <h4 className="text-[14px] font-[450] text-white/90 mt-0.5">Field Operations</h4>
                <p className="text-[12px] text-white/50 mt-1 leading-snug">Rescue boats, dry ration convoys & potable water bowsers</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="rounded-[22px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Zap size={22} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-[450] text-white tracking-tight">4.2 min</span>
                  <span className="text-[11px] font-[450] text-amber-300 flex items-center gap-0.5">
                    <Activity size={11} /> -82% SLA
                  </span>
                </div>
                <h4 className="text-[14px] font-[450] text-white/90 mt-0.5">AI Triage Speed</h4>
                <p className="text-[12px] text-white/50 mt-1 leading-snug">Automated NLP hazard classification & priority queueing</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="rounded-[22px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Building2 size={22} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[26px] font-[450] text-white tracking-tight">{telemetry.metrics.operationalSheltersCount} Shelters</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold">Verified</span>
                </div>
                <h4 className="text-[14px] font-[450] text-white/90 mt-0.5">Evacuation Centers</h4>
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
            return (
              <div 
                key={cat.id} 
                onClick={() => navigate(cat.link)}
                className="rounded-[24px] bg-[rgba(17,16,15,0.35)] hover:bg-[rgba(17,16,15,0.6)] backdrop-blur-[20px] border border-white/[0.08] hover:border-white/25 p-7 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[190px] shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-start justify-between">
                  <div 
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}30`, color: cat.color }}
                  >
                    <IconComponent size={22} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white text-white/70 group-hover:text-[#0A0707] flex items-center justify-center transition-all">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-white text-[19px] sm:text-[20px] font-[450] leading-snug group-hover:text-emerald-300 transition-colors">
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
            <div className="rounded-[28px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-8 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="w-14 h-14 rounded-[16px] bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6">
                  <Cpu size={26} />
                </div>
                <h3 className="text-white text-[22px] font-[450] mb-3">
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
            <div className="rounded-[28px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-8 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="w-14 h-14 rounded-[16px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <Truck size={26} />
                </div>
                <h3 className="text-white text-[22px] font-[450] mb-3">
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
            <div className="rounded-[28px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-8 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="w-14 h-14 rounded-[16px] bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                  <Building2 size={26} />
                </div>
                <h3 className="text-white text-[22px] font-[450] mb-3">
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
            <div className="lg:col-span-5 rounded-[28px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-8 sm:p-10 flex flex-col justify-between">
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
                  className="h-[48px] sm:h-[51px] px-6 sm:px-[27px] bg-[#E9E9E9] hover:bg-white text-[#0A0707] text-[14px] sm:text-[15.5px] font-[450] rounded-[12px] transition-colors inline-flex items-center gap-2 cursor-pointer border-0"
                >
                  <span>Inspect GIS Map</span>
                  <ArrowRight size={14} />
                </button>
                <span className="text-[11px] font-mono text-white/50">6.9271° N, 79.8612° E</span>
              </div>
            </div>

            {/* Right Column (7 Cols): Satellite Map Visual Preview */}
            <div className="lg:col-span-7 rounded-[28px] overflow-hidden border border-white/[0.1] relative bg-[rgba(17,16,15,0.5)] backdrop-blur-[20px] min-h-[440px] flex items-center justify-center p-6 shadow-[0_24px_50px_rgba(0,0,0,0.5)]">
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
         7. Platform Role Showcase (6 Command Workspaces)
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

          <button 
            type="button"
            onClick={() => setShowRoleModal(true)}
            className="h-[46px] px-6 rounded-[12px] border border-white text-white text-[14px] sm:text-[15px] font-[450] hover:bg-white/10 transition-colors inline-flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0 bg-transparent"
          >
            <span>Role Switcher Demo</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 6 Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r, i) => {
            const IconComponent = r.icon;
            return (
              <div 
                key={i} 
                onClick={() => navigate(r.path)}
                className="rounded-[24px] bg-[rgba(17,16,15,0.35)] hover:bg-[rgba(17,16,15,0.6)] backdrop-blur-[20px] border border-white/[0.08] hover:border-white/25 p-7 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[260px] shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div 
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${r.color}15`, border: `1px solid ${r.color}30`, color: r.color }}
                    >
                      <IconComponent size={22} />
                    </div>
                    <span 
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase"
                      style={{ backgroundColor: `${r.color}15`, color: r.color, border: `1px solid ${r.color}30` }}
                    >
                      {r.badge}
                    </span>
                  </div>

                  <h3 className="text-white text-[20px] font-[450] group-hover:text-emerald-300 transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-white/60 text-[13.5px] font-[450] mt-2 leading-relaxed">
                    {r.desc}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[12px] text-white/50 line-clamp-1">{r.featured}</span>
                  <span className="text-white/80 group-hover:text-white text-[13px] font-[450] flex items-center gap-1 shrink-0 ml-2">
                    Launch <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
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
            {/* Hotline 1: DMC */}
            <div className="rounded-[22px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <PhoneCall size={22} />
              </div>
              <div>
                <a href="tel:117" className="text-[28px] font-mono font-[450] text-rose-400 hover:text-rose-300 transition-colors text-decoration-none">
                  117
                </a>
                <h4 className="text-[14px] font-[450] text-white mt-1">Disaster Management Centre</h4>
                <p className="text-[12px] text-white/50 mt-0.5">National 24/7 toll-free crisis response intake</p>
              </div>
            </div>

            {/* Hotline 2: 1990 */}
            <div className="rounded-[22px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <HeartPulse size={22} />
              </div>
              <div>
                <a href="tel:1990" className="text-[28px] font-mono font-[450] text-sky-400 hover:text-sky-300 transition-colors text-decoration-none">
                  1990
                </a>
                <h4 className="text-[14px] font-[450] text-white mt-1">Suwa Seriya Ambulance</h4>
                <p className="text-[12px] text-white/50 mt-0.5">Pre-hospital emergency care & rapid dispatch</p>
              </div>
            </div>

            {/* Hotline 3: 119 */}
            <div className="rounded-[22px] bg-[rgba(17,16,15,0.4)] backdrop-blur-[20px] border border-white/[0.08] p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldAlert size={22} />
              </div>
              <div>
                <a href="tel:119" className="text-[28px] font-mono font-[450] text-emerald-400 hover:text-emerald-300 transition-colors text-decoration-none">
                  119
                </a>
                <h4 className="text-[14px] font-[450] text-white mt-1">Police Emergency Service</h4>
                <p className="text-[12px] text-white/50 mt-0.5">Ground rescue & emergency security operations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
         9. Apogee Style Footer
         ========================================================= */}
      <footer className="w-full bg-[#080A19] border-t border-white/[0.08] pt-16 pb-12 text-white/70">
        <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
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
            </div>

            {/* Col 2 */}
            <div>
              <h5 className="text-white text-[13px] font-[450] uppercase tracking-wider mb-4">Citizen Services</h5>
              <ul className="space-y-2.5 text-[13.5px]">
                <li><Link to="/citizen/submit" className="text-white/60 hover:text-white transition-colors text-decoration-none">Request Assistance</Link></li>
                <li><Link to="/citizen/track" className="text-white/60 hover:text-white transition-colors text-decoration-none">Track My Request</Link></li>
                <li><Link to="/citizen/shelters" className="text-white/60 hover:text-white transition-colors text-decoration-none">Verified Open Shelters</Link></li>
                <li><Link to="/citizen" className="text-white/60 hover:text-white transition-colors text-decoration-none">Public Citizen Portal</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h5 className="text-white text-[13px] font-[450] uppercase tracking-wider mb-4">Command & Ops</h5>
              <ul className="space-y-2.5 text-[13.5px]">
                <li><Link to="/coordinator/dashboard" className="text-white/60 hover:text-white transition-colors text-decoration-none">Coordinator Command</Link></li>
                <li><Link to="/logistics/inventory" className="text-white/60 hover:text-white transition-colors text-decoration-none">Resource Inventory</Link></li>
                <li><Link to="/shelters/directory" className="text-white/60 hover:text-white transition-colors text-decoration-none">Shelter Capacity</Link></li>
                <li><Link to="/volunteers/roster" className="text-white/60 hover:text-white transition-colors text-decoration-none">Volunteer Roster</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h5 className="text-white text-[13px] font-[450] uppercase tracking-wider mb-4">Operations & Access</h5>
              <ul className="space-y-2.5 text-[13.5px]">
                <li><Link to="/map" className="text-white/60 hover:text-white transition-colors text-decoration-none">Satellite GIS Radar</Link></li>
                <li><Link to="/bloom" className="text-white/60 hover:text-white transition-colors text-decoration-none">Crisis Overview Experience</Link></li>
                <li><button type="button" onClick={() => setShowSafetyModal(true)} className="text-white/60 hover:text-white transition-colors text-decoration-none bg-transparent border-0 p-0 text-[13.5px] cursor-pointer">Safety Protocols</button></li>
                <li><Link to="/login" className="text-white/60 hover:text-white transition-colors text-decoration-none">Responder Command Sign In</Link></li>
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
          <div className="w-full max-w-[680px] rounded-[28px] bg-[rgba(17,16,15,0.85)] backdrop-blur-[30px] border border-white/[0.1] p-7 sm:p-9 shadow-[0_24px_50px_rgba(0,0,0,0.6)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6 pb-5 border-b border-white/[0.08]">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold tracking-wider uppercase mb-2 inline-block">
                  RAPID ROLE SWITCHER
                </span>
                <h3 className="text-white text-[24px] font-[450]">Select Operational Workspace</h3>
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
                        <h4 className="text-white text-[14px] font-[450] truncate group-hover:text-emerald-300 transition-colors">{r.title}</h4>
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
                className="h-[38px] px-5 bg-[#E9E9E9] hover:bg-white text-[#0A0707] font-[450] rounded-[10px] transition-colors cursor-pointer border-0 text-[13px]"
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
          <div className="w-full max-w-[680px] rounded-[28px] bg-[rgba(17,16,15,0.85)] backdrop-blur-[30px] border border-white/[0.1] p-7 sm:p-9 shadow-[0_24px_50px_rgba(0,0,0,0.6)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6 pb-5 border-b border-white/[0.08]">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-semibold tracking-wider uppercase mb-2 inline-block">
                  OFFICIAL PROTOCOLS
                </span>
                <h3 className="text-white text-[24px] font-[450]">Field Safety Guidance & Hotlines</h3>
                <p className="text-white/60 text-[13.5px] font-[450] mt-1">
                  Official procedures for Western Province flood basin advisories.
                </p>
              </div>
              <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border-0 transition-colors" onClick={() => setShowSafetyModal(false)} title="Close">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Hotlines */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.08]">
                  <div className="text-rose-400 font-mono text-[22px] font-[450]">117</div>
                  <div className="text-white text-[13px] font-[450] mt-1">DMC Operations</div>
                  <div className="text-white/50 text-[11px]">Toll-Free 24/7 Hotline</div>
                </div>

                <div className="p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.08]">
                  <div className="text-sky-400 font-mono text-[22px] font-[450]">1990</div>
                  <div className="text-white text-[13px] font-[450] mt-1">Suwa Seriya</div>
                  <div className="text-white/50 text-[11px]">Ambulance Dispatch</div>
                </div>

                <div className="p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.08]">
                  <div className="text-emerald-400 font-mono text-[22px] font-[450]">119</div>
                  <div className="text-white text-[13px] font-[450] mt-1">Police Rescue</div>
                  <div className="text-white/50 text-[11px]">Emergency Response</div>
                </div>
              </div>

              {/* Protocol Card */}
              <div className="p-5 rounded-[18px] bg-white/[0.04] border border-white/[0.08]">
                <div className="flex items-center gap-2 text-emerald-400 text-[14.5px] font-[450] mb-3">
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

              <div className="pt-2 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setShowSafetyModal(false)}
                  className="h-[44px] px-6 bg-[#E9E9E9] hover:bg-white text-[#0A0707] font-[450] text-[14px] rounded-[11px] transition-colors cursor-pointer border-0"
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
          <div className="w-full max-w-[680px] rounded-[28px] bg-[rgba(17,16,15,0.85)] backdrop-blur-[30px] border border-white/[0.1] p-7 sm:p-9 shadow-[0_24px_50px_rgba(0,0,0,0.6)]" onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
};
export default LandingHomePage;

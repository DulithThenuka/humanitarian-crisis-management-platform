import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';

import heroCinematicBg from '../../assets/hero-cinematic-bg.jpg';
import westernProvinceMap from '../../assets/western-province-map-clean.png';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import './LandingHomePage.css';

export const LandingHomePage = () => {
  const navigate = useNavigate();

  // Modals & Interactivity
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');

  // 6 Primary Assistance Categories Matching CitizenPortalPage
  const quickCategories = [
    {
      id: 'food',
      title: 'Food Assistance',
      desc: 'Get dry rations and family nutrition packs',
      icon: UtensilsCrossed,
      iconBg: '#e0f2fe',
      iconColor: '#0284c7',
      link: '/citizen/submit?category=Food'
    },
    {
      id: 'medical',
      title: 'Medical Assistance',
      desc: 'Prescription medicines, insulin, and trauma care',
      icon: Plus,
      iconBg: '#ccfbf1',
      iconColor: '#0d9488',
      link: '/citizen/submit?category=Medical'
    },
    {
      id: 'shelter',
      title: 'Find Shelter',
      desc: 'Verified high-ground evacuation shelters with open beds',
      icon: Building2,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      link: '/citizen/shelters'
    },
    {
      id: 'transport',
      title: 'Rescue & Transport',
      desc: 'Inundated area boat extraction & high-water transit',
      icon: Bus,
      iconBg: '#fef3c7',
      iconColor: '#d97706',
      link: '/citizen/submit?category=Transport'
    },
    {
      id: 'water',
      title: 'Drinking Water',
      desc: 'Clean water bowser dispatch & purification supplies',
      icon: Droplets,
      iconBg: '#e0f2fe',
      iconColor: '#0284c7',
      link: '/citizen/submit?category=Drinking%20Water'
    },
    {
      id: 'access',
      title: 'Accessibility Support',
      desc: 'Specialized priority aid for elderly, infants & disabled',
      icon: Accessibility,
      iconBg: '#ede9fe',
      iconColor: '#7c3aed',
      link: '/citizen/submit?category=Accessibility'
    }
  ];

  // Role Showcase matching platform roles
  const roles = [
    {
      title: 'Disaster Affected Citizen',
      desc: 'Submit urgent rescue/ration requests, locate open shelters, and track real-time ticket progress.',
      path: '/citizen',
      badge: 'Public Portal',
      icon: Users,
      color: '#0e6f76',
      featured: 'Instant SOS intake & live status tracking'
    },
    {
      title: 'Emergency Coordinator',
      desc: 'Live operational overview, automated AI triage review, priority queues, and incident management.',
      path: '/coordinator/dashboard',
      badge: 'Command Center',
      icon: Radio,
      color: '#0284c7',
      featured: 'AI decision rationale & resource assignment'
    },
    {
      title: 'Logistics Manager',
      desc: 'Stockpile inventory tracking, relief convoy allocation, medical supplies, and route optimization.',
      path: '/logistics/inventory',
      badge: 'Supply Chain',
      icon: Package,
      color: '#16a34a',
      featured: 'Real-time warehouse depots & route dispatch'
    },
    {
      title: 'Shelter Manager',
      desc: 'Live bed occupancy, evacuee registration, facility amenities, and capacity management.',
      path: '/shelters/directory',
      badge: 'Facilities',
      icon: Building2,
      color: '#d97706',
      featured: 'Live bed capacity & vulnerable intake'
    },
    {
      title: 'Field Volunteer Responder',
      desc: 'Task assignment dispatch, on-ground rescue rosters, and field check-ins.',
      path: '/volunteers/roster',
      badge: 'Field Ops',
      icon: Compass,
      color: '#7c3aed',
      featured: 'Search & rescue teams & ground rosters'
    },
    {
      title: 'Operational GIS Satellite Map',
      desc: 'Live multi-layer geospatial disaster mapping, flood heatmaps, and route network status.',
      path: '/map',
      badge: 'Geospatial',
      icon: MapPin,
      color: '#dc2626',
      featured: 'Flood basin heatmaps & safe transit corridors'
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
    <div className="lnd-page-wrapper">
      {/* =========================================================
         1. Top Prototype Notice Banner
         ========================================================= */}
      <div className="lnd-prototype-banner">
        <div className="lnd-banner-content">
          <div className="lnd-banner-left">
            <span className="lnd-live-pulse-amber"></span>
            <AlertTriangle size={13} className="lnd-banner-icon" />
            <span>
              <strong>Academic Environment:</strong> RELIEFCORE Crisis Operations System — Western Province, Sri Lanka.
            </span>
          </div>
          <div className="lnd-banner-right">
            <a href="tel:117" className="lnd-banner-hotline">
              <PhoneCall size={11} />
              <span>DMC Emergency Hotline: <strong>117</strong></span>
            </a>
            <span className="lnd-banner-divider">|</span>
            <button 
              className="lnd-banner-link"
              onClick={() => setShowSafetyModal(true)}
            >
              <span>Field Safety Guide</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
         2. Main Navigation Bar (Website Themed Petrol Slate #082128)
         ========================================================= */}
      <header className="lnd-navbar">
        <div className="lnd-nav-inner">
          {/* Official Brand Logo */}
          <Link to="/" className="lnd-brand">
            <img 
              src={reliefcoreLogoWhite} 
              alt="RELIEFCORE Humanitarian Operations" 
              className="lnd-brand-logo-img" 
            />
          </Link>

          {/* Navigation Links */}
          <nav className="lnd-nav-links">
            <Link to="/citizen" className="lnd-nav-item">
              <span>Citizen Portal</span>
            </Link>
            <button 
              className="lnd-nav-item"
              onClick={() => {
                const el = document.getElementById('immediate-assistance-tray');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/citizen/submit');
              }}
            >
              <span>Find Assistance</span>
            </button>
            <Link to="/citizen/shelters" className="lnd-nav-item">
              <span>Shelters</span>
              <span className="lnd-nav-badge">16 Active</span>
            </Link>
            <Link to="/map" className="lnd-nav-item">
              <MapPin size={14} className="lnd-nav-icon" />
              <span>Satellite Map</span>
            </Link>
            <button 
              className="lnd-nav-item lnd-nav-demo-btn"
              onClick={() => setShowRoleModal(true)}
            >
              <span>Role Demos</span>
              <span className="lnd-nav-role-dot"></span>
            </button>
            <Link to="/coordinator/dashboard" className="lnd-nav-item lnd-nav-command-btn">
              <Radio size={14} className="lnd-nav-icon" />
              <span>Coordinator Command</span>
            </Link>
          </nav>

          {/* Right Action Button & Emergency Fast-Track */}
          <div className="lnd-nav-action">
            <div className="lnd-ops-status-badge" title="Operational Telemetry Online">
              <span className="lnd-status-beacon"></span>
              <span>LIVE OPS</span>
            </div>
            <Link to="/citizen/submit" className="lnd-btn-request-nav">
              <span>Request Assistance</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
         3. Hero Section (Deep Petrol Blue/Slate with Cinematic Visual)
         ========================================================= */}
      <section 
        className="lnd-hero-section"
        style={{ backgroundImage: `url(${heroCinematicBg})` }}
      >
        <div className="lnd-hero-overlay"></div>
        <div className="lnd-hero-radial-glow"></div>

        <div className="lnd-hero-container">
          {/* Left Column: Headline, Search & CTAs */}
          <div className="lnd-hero-left">
            {/* Pill Tag */}
            <div className="lnd-hero-pill-tag">
              <span className="lnd-pill-radar-dot"></span>
              <Users size={13} />
              <span>WESTERN PROVINCE DISASTER COORDINATION NETWORK</span>
            </div>

            {/* Main Headline */}
            <h1 className="lnd-hero-title">
              Stronger Communities.<br />
              <span className="lnd-hero-title-accent">Safer Tomorrows.</span>
            </h1>

            {/* Subtitle */}
            <p className="lnd-hero-subtitle">
              RELIEFCORE coordinates automated AI triage, multi-layer GIS satellite flood heatmaps, and rapid convoy dispatch to connect affected citizens with verified high-ground shelters, rations, and emergency medical teams.
            </p>

            {/* Fast Ticket Search Box (matching CitizenPortal search design) */}
            <form className="lnd-hero-search-wrapper" onSubmit={handleTrackSubmit}>
              <Search size={16} className="lnd-hero-search-icon" />
              <input 
                type="text" 
                placeholder="Enter Request ID to track (e.g. REQ-2026-01842)..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="lnd-hero-search-input"
              />
              <button type="submit" className="lnd-hero-search-btn">
                <span>Track Status</span>
                <ArrowRight size={13} />
              </button>
            </form>

            {/* CTA Button Group */}
            <div className="lnd-hero-btn-group">
              <Link to="/citizen/submit" className="lnd-hero-btn-primary">
                <Users size={16} />
                <span>Request Emergency Assistance</span>
                <ArrowRight size={15} />
              </Link>

              <Link to="/citizen/track" className="lnd-hero-btn-secondary">
                <Search size={15} />
                <span>Citizen Track Center</span>
              </Link>

              <button 
                onClick={() => setShowHowItWorksModal(true)} 
                className="lnd-hero-btn-tertiary"
              >
                <span>How It Works</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Language Selection Bar */}
            <div className="lnd-hero-lang-bar">
              <Globe size={14} className="lnd-lang-globe" />
              <span>Available in: <strong>English</strong>, <strong>සිංහල</strong> and <strong>தமிழ்</strong></span>
              <button 
                className="lnd-lang-switch-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
              >
                <span>{currentLang}</span>
                <ChevronRight size={12} style={{ transform: showLangMenu ? 'rotate(90deg)' : 'none' }} />
              </button>

              {showLangMenu && (
                <div className="lnd-lang-dropdown">
                  <button 
                    className={currentLang === 'English' ? 'active' : ''}
                    onClick={() => { setCurrentLang('English'); setShowLangMenu(false); }}
                  >
                    English (Active)
                  </button>
                  <button 
                    className={currentLang === 'Sinhala' ? 'active' : ''}
                    onClick={() => { setCurrentLang('Sinhala'); setShowLangMenu(false); }}
                  >
                    සිංහල (Sinhala)
                  </button>
                  <button 
                    className={currentLang === 'Tamil' ? 'active' : ''}
                    onClick={() => { setCurrentLang('Tamil'); setShowLangMenu(false); }}
                  >
                    தமிழ் (Tamil)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Floating Status HUD Cards */}
          <div className="lnd-hero-right">
            {/* Card 1: Active Crisis */}
            <div 
              className="lnd-glass-card lnd-crisis-card"
              onClick={() => navigate('/coordinator/dashboard')}
            >
              <div className="lnd-card-icon-red">
                <AlertTriangle size={16} color="#ffffff" />
              </div>
              <div className="lnd-card-info">
                <div className="lnd-card-header-row">
                  <span className="lnd-card-label">Active Regional Crisis</span>
                  <span className="lnd-card-badge-high">Level 4 Severe</span>
                </div>
                <span className="lnd-card-val">Western Province Monsoon Floods</span>
                <span className="lnd-card-extra">Kelani & Kalu Ganga river crest advisory in effect</span>
              </div>
              <ChevronRight size={16} className="lnd-card-chevron" />
            </div>

            {/* Card 2: Verified Shelters */}
            <div 
              className="lnd-glass-card"
              onClick={() => navigate('/citizen/shelters')}
            >
              <div className="lnd-card-icon-teal">
                <Building2 size={16} color="#ffffff" />
              </div>
              <div className="lnd-card-info">
                <div className="lnd-card-header-row">
                  <span className="lnd-card-label">Verified Evacuation Shelters</span>
                  <span className="lnd-card-badge-green">68% Capacity</span>
                </div>
                <span className="lnd-card-val">16 Active High-Ground Facilities</span>
                <div className="lnd-capacity-bar-wrap">
                  <div className="lnd-capacity-bar" style={{ width: '68%' }}></div>
                </div>
              </div>
              <ChevronRight size={16} className="lnd-card-chevron" />
            </div>

            {/* Card 3: Response Teams */}
            <div 
              className="lnd-glass-card"
              onClick={() => navigate('/volunteers/roster')}
            >
              <div className="lnd-card-icon-cyan">
                <Users size={16} color="#ffffff" />
              </div>
              <div className="lnd-card-info">
                <div className="lnd-card-header-row">
                  <span className="lnd-card-label">Ground Field Responders</span>
                  <span className="lnd-card-badge-pulse">
                    <span className="lnd-pulse-dot"></span> 42 Teams Active
                  </span>
                </div>
                <span className="lnd-card-val">Tri-Forces & Red Cross SAR Units</span>
                <span className="lnd-card-extra">Average on-scene triage: 18 mins</span>
              </div>
              <ChevronRight size={16} className="lnd-card-chevron" />
            </div>

            {/* Card 4: Western Province Map Card */}
            <div className="lnd-map-card">
              <div className="lnd-map-visual">
                <img 
                  src={westernProvinceMap} 
                  alt="Western Province Sri Lanka" 
                  className="lnd-map-img" 
                />
                {/* Colombo Sector */}
                <div className="lnd-map-radar-pulse lnd-pulse-colombo" title="Colombo Sector"></div>
                {/* Gampaha Sector */}
                <div className="lnd-map-radar-pulse lnd-pulse-gampaha" title="Gampaha Sector"></div>
                {/* Kalutara Sector */}
                <div className="lnd-map-radar-pulse lnd-pulse-kalutara" title="Kalutara Sector"></div>
              </div>

              <div className="lnd-map-details">
                <div className="lnd-map-tag">
                  <MapPin size={11} />
                  <span>Geospatial Radar</span>
                </div>
                <h3 className="lnd-map-title">Western Province Sector</h3>
                <p className="lnd-map-sub">Real-time satellite flood telemetry & shelter proximity mapping.</p>
                <div className="lnd-map-actions">
                  <button 
                    className="lnd-btn-map-action"
                    onClick={() => navigate('/map')}
                  >
                    <span>Inspect GIS Map</span>
                    <ArrowRight size={12} />
                  </button>
                  <span className="lnd-map-coords">6.9271° N, 79.8612° E</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
           4. Horizontal Stats Ribbon (Matching Website Telemetry)
           ========================================================= */}
        <div className="lnd-stats-ribbon">
          <div className="lnd-stats-inner">
            {/* Stat 1 */}
            <div className="lnd-stat-col">
              <div className="lnd-stat-icon-wrap" style={{ color: '#5eead4' }}>
                <Users size={22} />
              </div>
              <div className="lnd-stat-text">
                <div className="lnd-stat-number-row">
                  <span className="lnd-stat-number">12,430+</span>
                  <span className="lnd-stat-trend">
                    <TrendingUp size={12} /> +340 today
                  </span>
                </div>
                <span className="lnd-stat-label">Citizens Supported</span>
                <span className="lnd-stat-demo">Western Province relief coverage</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="lnd-stat-col">
              <div className="lnd-stat-icon-wrap" style={{ color: '#38bdf8' }}>
                <Layers size={22} />
              </div>
              <div className="lnd-stat-text">
                <div className="lnd-stat-number-row">
                  <span className="lnd-stat-number">186</span>
                  <span className="lnd-stat-trend">Active</span>
                </div>
                <span className="lnd-stat-label">Coordinated Field Missions</span>
                <span className="lnd-stat-demo">Rescue boats, convoys, supplies</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="lnd-stat-col">
              <div className="lnd-stat-icon-wrap" style={{ color: '#fbbf24' }}>
                <Zap size={22} />
              </div>
              <div className="lnd-stat-text">
                <div className="lnd-stat-number-row">
                  <span className="lnd-stat-number">4.2 min</span>
                  <span className="lnd-stat-trend" style={{ color: '#5eead4' }}>
                    <Activity size={12} /> -82% SLA
                  </span>
                </div>
                <span className="lnd-stat-label">AI Triage Classification</span>
                <span className="lnd-stat-demo">NLP urgency score generation</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="lnd-stat-col">
              <div className="lnd-stat-icon-wrap" style={{ color: '#a78bfa' }}>
                <Home size={22} />
              </div>
              <div className="lnd-stat-text">
                <div className="lnd-stat-number-row">
                  <span className="lnd-stat-number">16 Shelters</span>
                  <span className="lnd-stat-trend">Verified</span>
                </div>
                <span className="lnd-stat-label">High-Ground Evac Centers</span>
                <span className="lnd-stat-demo">Live bed capacity tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
         5. Immediate Assistance Quick Category Tray (Matching CitizenPortal)
         ========================================================= */}
      <section className="lnd-assistance-tray-section" id="immediate-assistance-tray">
        <div className="lnd-tray-header">
          <div className="lnd-tray-header-left">
            <span className="lnd-tray-eyebrow">CITIZEN RAPID INTAKE</span>
            <h2 className="lnd-tray-heading">Need Immediate Assistance?</h2>
            <p className="lnd-tray-sub">Choose your assistance category to access fast-track intake and prioritized AI dispatch.</p>
          </div>
          <Link to="/citizen" className="lnd-tray-all-btn">
            <span>Explore Full Citizen Portal</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 6 Category Grid exactly matching CitizenPortal layout */}
        <div className="lnd-assistance-grid">
          {quickCategories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div 
                key={cat.id} 
                className="lnd-assist-card"
                onClick={() => navigate(cat.link)}
              >
                <div className="lnd-assist-card-left">
                  <div 
                    className="lnd-assist-icon-circle"
                    style={{ backgroundColor: cat.iconBg, color: cat.iconColor }}
                  >
                    <IconComponent size={20} />
                  </div>
                  <div className="lnd-assist-text">
                    <h3 className="lnd-assist-title">{cat.title}</h3>
                    <p className="lnd-assist-desc">{cat.desc}</p>
                  </div>
                </div>
                <div 
                  className="lnd-assist-arrow-circle"
                  style={{ backgroundColor: cat.iconBg, color: cat.iconColor }}
                >
                  <ArrowRight size={15} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
         6. CORE CAPABILITIES (Intelligent Crisis Architecture)
         ========================================================= */}
      <section className="lnd-capabilities-section">
        <div className="lnd-section-container">
          <div className="lnd-section-header">
            <span className="lnd-section-eyebrow">SYSTEM ARCHITECTURE</span>
            <h2 className="lnd-section-title">Engineered for Rapid Humanitarian Action</h2>
            <p className="lnd-section-desc">
              RELIEFCORE bridges the communication divide between vulnerable citizens, field volunteers, and regional command centers through automated triage and verified allocations.
            </p>
          </div>

          <div className="lnd-capabilities-grid">
            {/* Capability 1 */}
            <div className="lnd-cap-card">
              <div className="lnd-cap-icon-box" style={{ background: 'rgba(14, 111, 118, 0.12)', color: '#0e6f76' }}>
                <Cpu size={24} />
              </div>
              <h3 className="lnd-cap-title">Automated AI Triage & NLP</h3>
              <p className="lnd-cap-desc">
                Machine learning models analyze citizen free-text requests, extract hazard indicators, and calculate urgency scores (1-5) within seconds.
              </p>
              <ul className="lnd-cap-list">
                <li><Check size={14} /> Natural language extraction of trapped count & medical urgency</li>
                <li><Check size={14} /> Dynamic priority queues preventing SLA breaches</li>
                <li><Check size={14} /> Explainable AI rationale for emergency coordinators</li>
              </ul>
            </div>

            {/* Capability 2 */}
            <div className="lnd-cap-card">
              <div className="lnd-cap-icon-box" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7' }}>
                <MapPin size={24} />
              </div>
              <h3 className="lnd-cap-title">Geospatial Satellite Heatmaps</h3>
              <p className="lnd-cap-desc">
                Interactive Leaflet and GIS layers visualize flood inundation corridors, road bottlenecks, and safe evacuation shelter radii in real time.
              </p>
              <ul className="lnd-cap-list">
                <li><Check size={14} /> Multi-layer flood depth and road status toggling</li>
                <li><Check size={14} /> GPS reverse geocoding with verified landmarks</li>
                <li><Check size={14} /> Safe evacuation corridor routing around flooded zones</li>
              </ul>
            </div>

            {/* Capability 3 */}
            <div className="lnd-cap-card">
              <div className="lnd-cap-icon-box" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a' }}>
                <Package size={24} />
              </div>
              <h3 className="lnd-cap-title">Convoy Logistics & Stockpiles</h3>
              <p className="lnd-cap-desc">
                Real-time inventory tracking across divisional disaster storehouses ensures relief items are allocated where need is verified.
              </p>
              <ul className="lnd-cap-list">
                <li><Check size={14} /> Warehouse stockpile reserves of water, rations, & tents</li>
                <li><Check size={14} /> Automated delivery verification with cryptographic logs</li>
                <li><Check size={14} /> Boat and 4x4 high-clearance convoy routing</li>
              </ul>
            </div>

            {/* Capability 4 */}
            <div className="lnd-cap-card">
              <div className="lnd-cap-icon-box" style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 className="lnd-cap-title">Auditable Accountability</h3>
              <p className="lnd-cap-desc">
                Every triage override, resource dispatch, and bed reservation is recorded in a tamper-evident audit log with coordinator verification.
              </p>
              <ul className="lnd-cap-list">
                <li><Check size={14} /> Human-in-the-loop coordinator approval workflow</li>
                <li><Check size={14} /> Timestamped audit trails for government accountability</li>
                <li><Check size={14} /> Public ticket tracking by ID without personal data leak</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
         7. STAKEHOLDER COMMAND PORTALS (Interactive Directory)
         ========================================================= */}
      <section className="lnd-portals-section">
        <div className="lnd-section-container">
          <div className="lnd-section-header">
            <span className="lnd-section-eyebrow">ROLE-BASED WORKSTATIONS</span>
            <h2 className="lnd-section-title">Dedicated Portals for Every Operational Role</h2>
            <p className="lnd-section-desc">
              Explore how RELIEFCORE provides tailored intelligence across affected citizens, tactical coordinators, facility managers, and rescue teams.
            </p>
          </div>

          <div className="lnd-portals-grid">
            {roles.map((r, i) => {
              const IconComp = r.icon;
              return (
                <div 
                  key={i} 
                  className="lnd-portal-card"
                  onClick={() => navigate(r.path)}
                >
                  <div className="lnd-portal-top">
                    <div className="lnd-portal-icon-wrap" style={{ backgroundColor: `${r.color}18`, color: r.color }}>
                      <IconComp size={22} />
                    </div>
                    <span className="lnd-portal-badge" style={{ color: r.color, borderColor: `${r.color}35` }}>
                      {r.badge}
                    </span>
                  </div>

                  <h3 className="lnd-portal-title">{r.title}</h3>
                  <p className="lnd-portal-desc">{r.desc}</p>

                  <div className="lnd-portal-feature">
                    <Sparkles size={12} style={{ color: r.color }} />
                    <span>{r.featured}</span>
                  </div>

                  <div className="lnd-portal-footer">
                    <span className="lnd-portal-cta">Launch Workstation</span>
                    <ArrowRight size={14} className="lnd-portal-arrow" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
         8. OFFICIAL EMERGENCY CONTACTS & SAFETY ADVISORY STRIP
         ========================================================= */}
      <section className="lnd-emergency-strip-section">
        <div className="lnd-section-container">
          <div className="lnd-emergency-box">
            <div className="lnd-emergency-left">
              <div className="lnd-emergency-icon">
                <ShieldAlert size={26} />
              </div>
              <div>
                <h3 className="lnd-emergency-title">Immediate Life-Threatening Emergency?</h3>
                <p className="lnd-emergency-desc">
                  If water levels are actively rising or immediate medical rescue is required, contact government response agencies directly:
                </p>
              </div>
            </div>

            <div className="lnd-hotlines-grid">
              <a href="tel:117" className="lnd-hotline-pill">
                <span className="lnd-hotline-num">117</span>
                <span className="lnd-hotline-name">Disaster Management Centre</span>
              </a>
              <a href="tel:1990" className="lnd-hotline-pill">
                <span className="lnd-hotline-num">1990</span>
                <span className="lnd-hotline-name">Suwa Seriya Ambulance</span>
              </a>
              <a href="tel:119" className="lnd-hotline-pill">
                <span className="lnd-hotline-num">119</span>
                <span className="lnd-hotline-name">Police Emergency SAR</span>
              </a>
              <button 
                className="lnd-safety-btn"
                onClick={() => setShowSafetyModal(true)}
              >
                <span>Full Safety Protocol</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
         9. FOOTER (Matching Website Petrol Slate Theme #082128)
         ========================================================= */}
      <footer className="lnd-footer">
        <div className="lnd-footer-container">
          <div className="lnd-footer-top">
            {/* Col 1: Brand & Mission */}
            <div className="lnd-footer-col lnd-footer-brand-col">
              <div className="lnd-footer-brand">
                <img 
                  src={reliefcoreLogoWhite} 
                  alt="RELIEFCORE Humanitarian Operations" 
                  className="lnd-footer-logo-img" 
                />
              </div>
              <p className="lnd-footer-mission">
                An intelligent disaster response coordination framework designed to optimize rescue triage, shelter allocations, and logistical supply chains during severe weather emergencies.
              </p>
              <div className="lnd-footer-status">
                <span className="lnd-status-beacon"></span>
                <span>System Operational • SLA 99.98% • Academic Sandbox</span>
              </div>
            </div>

            {/* Col 2: Citizen Services */}
            <div className="lnd-footer-col">
              <h4 className="lnd-footer-heading">Citizen Services</h4>
              <ul className="lnd-footer-links">
                <li><Link to="/citizen/submit">Request Assistance</Link></li>
                <li><Link to="/citizen/track">Track Request Ticket</Link></li>
                <li><Link to="/citizen/shelters">Find Evacuation Shelters</Link></li>
                <li><Link to="/citizen/alerts">Weather & Flood Alerts</Link></li>
                <li><button onClick={() => setShowSafetyModal(true)} className="lnd-footer-link-btn">Flood Safety Protocols</button></li>
              </ul>
            </div>

            {/* Col 3: Operations & Command */}
            <div className="lnd-footer-col">
              <h4 className="lnd-footer-heading">Operations & GIS</h4>
              <ul className="lnd-footer-links">
                <li><Link to="/coordinator/dashboard">Coordinator Command Center</Link></li>
                <li><Link to="/map">Live Operational GIS Map</Link></li>
                <li><Link to="/logistics/inventory">Relief Inventory & Convoys</Link></li>
                <li><Link to="/shelters/directory">Shelter Bed Management</Link></li>
                <li><Link to="/volunteers/roster">Volunteer Response Roster</Link></li>
              </ul>
            </div>

            {/* Col 4: Role Demos & Hotlines */}
            <div className="lnd-footer-col">
              <h4 className="lnd-footer-heading">Emergency Hotlines</h4>
              <ul className="lnd-footer-hotlines-list">
                <li>
                  <span className="lnd-ft-tag">DMC Sri Lanka:</span>
                  <a href="tel:117">117 (Toll-Free)</a>
                </li>
                <li>
                  <span className="lnd-ft-tag">Suwa Seriya:</span>
                  <a href="tel:1990">1990 (Ambulance)</a>
                </li>
                <li>
                  <span className="lnd-ft-tag">Police SAR:</span>
                  <a href="tel:119">119 (Emergency)</a>
                </li>
                <li>
                  <span className="lnd-ft-tag">SL Red Cross:</span>
                  <a href="tel:+94112670002">011-2670002</a>
                </li>
              </ul>
              <button 
                className="lnd-footer-demo-btn"
                onClick={() => setShowRoleModal(true)}
              >
                <span>Launch Role Demo Switcher</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="lnd-footer-bottom">
            <div className="lnd-footer-copy">
              © {new Date().getFullYear()} RELIEFCORE Humanitarian Operations Platform. Created for Academic Evaluation & Disaster Management Research.
            </div>
            <div className="lnd-footer-bottom-links">
              <button onClick={() => setShowSafetyModal(true)}>Safety Guidelines</button>
              <span>•</span>
              <button onClick={() => setShowHowItWorksModal(true)}>How It Works</button>
              <span>•</span>
              <Link to="/login">Coordinator Login</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================
         10. Interactive Role Demo Access Modal
         ========================================================= */}
      {showRoleModal && (
        <div className="lnd-modal-backdrop" onClick={() => setShowRoleModal(false)}>
          <div className="lnd-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="lnd-modal-header">
              <div>
                <span className="lnd-modal-pill">Role Navigator</span>
                <h3 className="lnd-modal-title">Select Role Demo View</h3>
                <p className="lnd-modal-desc">
                  Explore how RELIEFCORE delivers tailored intelligence across every disaster management persona.
                </p>
              </div>
              <button 
                className="lnd-modal-close"
                onClick={() => setShowRoleModal(false)}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="lnd-roles-grid">
              {roles.map((r, i) => {
                const IconComp = r.icon;
                return (
                  <div 
                    key={i} 
                    className="lnd-role-card"
                    onClick={() => {
                      setShowRoleModal(false);
                      navigate(r.path);
                    }}
                  >
                    <div className="lnd-role-icon-box" style={{ backgroundColor: `${r.color}15`, color: r.color }}>
                      <IconComp size={22} />
                    </div>
                    <div className="lnd-role-info">
                      <div className="lnd-role-title-row">
                        <span className="lnd-role-name">{r.title}</span>
                        <span className="lnd-role-pill">{r.badge}</span>
                      </div>
                      <p className="lnd-role-desc">{r.desc}</p>
                      <span className="lnd-role-highlight">{r.featured}</span>
                    </div>
                    <ChevronRight size={18} className="lnd-role-arrow" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         11. Safety Guidance Modal
         ========================================================= */}
      {showSafetyModal && (
        <div className="lnd-modal-backdrop" onClick={() => setShowSafetyModal(false)}>
          <div className="lnd-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="lnd-modal-header">
              <div>
                <span className="lnd-modal-pill" style={{ background: '#fef2f2', color: '#dc2626' }}>Safety Guidance</span>
                <h3 className="lnd-modal-title">Official Emergency Protocols & Hotlines</h3>
                <p className="lnd-modal-desc">
                  Emergency numbers and actions for Western Province severe weather conditions.
                </p>
              </div>
              <button className="lnd-modal-close" onClick={() => setShowSafetyModal(false)} title="Close">
                <X size={20} />
              </button>
            </div>

            <div className="lnd-safety-modal-body">
              <div className="lnd-safety-hotlines-row">
                <div className="lnd-safety-hotline-card">
                  <div className="lnd-sh-num" style={{ color: '#dc2626' }}>117</div>
                  <div className="lnd-sh-name">Disaster Management Centre</div>
                  <div className="lnd-sh-desc">Toll-Free National 24/7 Hotline</div>
                </div>

                <div className="lnd-safety-hotline-card">
                  <div className="lnd-sh-num" style={{ color: '#0284c7' }}>1990</div>
                  <div className="lnd-sh-name">Suwa Seriya Ambulance</div>
                  <div className="lnd-sh-desc">Rapid Medical Dispatch & First Aid</div>
                </div>

                <div className="lnd-safety-hotline-card">
                  <div className="lnd-sh-num" style={{ color: '#16a34a' }}>119</div>
                  <div className="lnd-sh-name">Police Emergency Service</div>
                  <div className="lnd-sh-desc">Search & Rescue Unit Dispatch</div>
                </div>
              </div>

              <div className="lnd-safety-protocol-card">
                <div className="lnd-sp-title">
                  <CheckCircle2 size={18} /> Flash Flood Safety Protocol
                </div>
                <ul className="lnd-sp-list">
                  <li><strong>Avoid Floodwaters:</strong> Never attempt to walk, swim, or drive through flowing water. 15 cm of rapid flow can sweep adults away.</li>
                  <li><strong>Electrical Isolation:</strong> Shut down main circuit breakers before floodwaters breach building entries. Avoid wet power points.</li>
                  <li><strong>Secure Critical Documents:</strong> Place identification, medicines, and deeds in sealed waterproof pouches on higher levels.</li>
                  <li><strong>Evacuate Proactively:</strong> If in low-lying Kelani or Kalu Ganga riverbanks, evacuate early to designated shelters before nightfall.</li>
                </ul>
              </div>

              <div className="lnd-modal-footer">
                <button 
                  onClick={() => setShowSafetyModal(false)}
                  className="lnd-modal-btn-confirm"
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
        <div className="lnd-modal-backdrop" onClick={() => setShowHowItWorksModal(false)}>
          <div className="lnd-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="lnd-modal-header">
              <div>
                <span className="lnd-modal-pill" style={{ background: '#ccfbf1', color: '#0e6f76' }}>System Workflow</span>
                <h3 className="lnd-modal-title">How RELIEFCORE Coordinates Response</h3>
                <p className="lnd-modal-desc">
                  From incident reporting to verified delivery across 4 synchronized stages.
                </p>
              </div>
              <button className="lnd-modal-close" onClick={() => setShowHowItWorksModal(false)} title="Close">
                <X size={20} />
              </button>
            </div>

            <div className="lnd-hiw-steps-grid">
              <div className="lnd-hiw-step">
                <div className="lnd-hiw-step-num" style={{ background: '#ccfbf1', color: '#0e6f76' }}>1</div>
                <h4 className="lnd-hiw-step-title">Citizen Intake</h4>
                <p className="lnd-hiw-step-desc">
                  Residents report urgent medical, shelter, or food ration needs with GPS location coordinates.
                </p>
              </div>

              <div className="lnd-hiw-step">
                <div className="lnd-hiw-step-num" style={{ background: '#e0f2fe', color: '#0284c7' }}>2</div>
                <h4 className="lnd-hiw-step-title">AI Severity Triage</h4>
                <p className="lnd-hiw-step-desc">
                  NLP algorithms assess hazard urgency, evaluate vulnerable demographic flags, and calculate priority scores.
                </p>
              </div>

              <div className="lnd-hiw-step">
                <div className="lnd-hiw-step-num" style={{ background: '#fef3c7', color: '#d97706' }}>3</div>
                <h4 className="lnd-hiw-step-title">Coordinator Review</h4>
                <p className="lnd-hiw-step-desc">
                  Emergency coordinators review AI recommendations, confirm resource allocations, and issue field dispatch orders.
                </p>
              </div>

              <div className="lnd-hiw-step">
                <div className="lnd-hiw-step-num" style={{ background: '#ede9fe', color: '#7c3aed' }}>4</div>
                <h4 className="lnd-hiw-step-title">Automated Dispatch</h4>
                <p className="lnd-hiw-step-desc">
                  Relief convoys and shelter bed allocations are verified with timestamped telemetry and citizen tracking updates.
                </p>
              </div>
            </div>

            <div className="lnd-hiw-action-row">
              <button 
                onClick={() => {
                  setShowHowItWorksModal(false);
                  navigate('/coordinator/requests/REQ-2026-01842');
                }}
                className="lnd-btn-study"
              >
                <span>Inspect Live AI Request Case Study (#REQ-2026-01842)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

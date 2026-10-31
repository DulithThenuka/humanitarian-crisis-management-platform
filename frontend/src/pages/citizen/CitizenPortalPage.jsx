import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CitizenAssistanceRequestForm } from './CitizenAssistanceRequestForm';
import { TrackRequestsPage } from './TrackRequestsPage';
import { FindShelterPage } from './FindShelterPage';
import { EmergencyAlertsPage } from './EmergencyAlertsPage';
import { SafetyGuidePage } from './SafetyGuidePage';
import { 
  Home, 
  PlusSquare, 
  FileText, 
  Building2, 
  Bell, 
  ShieldAlert, 
  Headphones, 
  User, 
  Globe, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  ArrowRight, 
  UtensilsCrossed, 
  Plus, 
  Bus, 
  Accessibility, 
  MoreHorizontal, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Droplets, 
  Check 
} from 'lucide-react';

import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import citizenMapPreview from '../../assets/citizen-map-preview.jpg';
import shelter1 from '../../assets/shelter-1.jpg';
import shelter2 from '../../assets/shelter-2.jpg';
import shelter3 from '../../assets/shelter-3.jpg';
import robot3D from '../../assets/robot-3d.png';
import familyPopout from '../../assets/family-popout.png';
import './CitizenPortalPage.css';

export const CitizenPortalPage = ({ initialTab = 'home' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    const p = (location.pathname || '').toLowerCase().replace(/\/$/, '');
    if (p.includes('/submit') || p.includes('/request-assistance')) return 'request';
    if (p.includes('/track')) return 'requests';
    if (p.includes('/shelter')) return 'shelters';
    if (p.includes('/alert')) return 'alerts';
    if (p.includes('/safety')) return 'safety';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('English');

  useEffect(() => {
    const p = (location.pathname || '').toLowerCase().replace(/\/$/, '');
    if (p.includes('/submit') || p.includes('/request-assistance')) {
      setActiveTab('request');
    } else if (p.includes('/track')) {
      setActiveTab('requests');
    } else if (p.includes('/shelter')) {
      setActiveTab('shelters');
    } else if (p.includes('/alert')) {
      setActiveTab('alerts');
    } else if (p.includes('/safety')) {
      setActiveTab('safety');
    } else if (p === '/citizen' || p === '/citizen/home' || p === '/citizen/portal') {
      setActiveTab('home');
    }
  }, [location.pathname, initialTab]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/citizen' },
    { id: 'request', label: 'Request Assistance', icon: PlusSquare, path: '/citizen/submit' },
    { id: 'requests', label: 'My Requests', icon: FileText, path: '/citizen/track' },
    { id: 'shelters', label: 'Find Shelters', icon: Building2, path: '/citizen/shelters' },
    { id: 'alerts', label: 'Emergency Alerts', icon: Bell, path: '/citizen/alerts' },
    { id: 'safety', label: 'Safety Guide', icon: ShieldAlert, path: '/citizen/safety' },
    { id: 'support', label: 'Support', icon: Headphones, path: '/citizen/support' },
    { id: 'profile', label: 'Profile', icon: User, path: '/citizen/profile' },
  ];

  const quickCategories = [
    {
      id: 'food',
      title: 'Food Assistance',
      desc: 'Get food and essentials for your family',
      icon: UtensilsCrossed,
      iconClass: 'assist-icon-food',
      arrowBg: '#e0f2fe',
      arrowColor: '#0284c7',
      link: '/citizen/submit?category=Food'
    },
    {
      id: 'medical',
      title: 'Medical Assistance',
      desc: 'Request medical help and healthcare support',
      icon: Plus,
      iconClass: 'assist-icon-medical',
      arrowBg: '#ccfbf1',
      arrowColor: '#0d9488',
      link: '/citizen/submit?category=Medical'
    },
    {
      id: 'shelter',
      title: 'Find Shelter',
      desc: 'Locate nearby safe shelters',
      icon: Building2,
      iconClass: 'assist-icon-shelter',
      arrowBg: '#dcfce7',
      arrowColor: '#16a34a',
      link: '/citizen/shelters'
    },
    {
      id: 'transport',
      title: 'Transport Support',
      desc: 'Request evacuation or transport',
      icon: Bus,
      iconClass: 'assist-icon-transport',
      arrowBg: '#fef3c7',
      arrowColor: '#d97706',
      link: '/citizen/submit?category=Transport'
    },
    {
      id: 'access',
      title: 'Accessibility Support',
      desc: 'Assistance for elderly and disabled',
      icon: Accessibility,
      iconClass: 'assist-icon-access',
      arrowBg: '#ede9fe',
      arrowColor: '#7c3aed',
      link: '/citizen/submit?category=Accessibility'
    },
    {
      id: 'other',
      title: 'Other Support',
      desc: 'Report other emergency needs',
      icon: MoreHorizontal,
      iconClass: 'assist-icon-other',
      arrowBg: '#e0f2fe',
      arrowColor: '#0284c7',
      link: '/citizen/submit?category=Other'
    }
  ];

  return (
    <div className="citizen-container">
      {/* =========================================================
         1. Left Navigation Sidebar
         ========================================================= */}
      <aside className="citizen-sidebar">
        <div>
          {/* Brand Logo */}
          <div className="sidebar-brand">
            <Link to="/citizen">
              <img
                src={reliefcoreLogoWhite}
                alt="RELIEFCORE Humanitarian Operations"
                className="sidebar-logo-img"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.path !== '/citizen') {
                      navigate(item.path);
                    }
                  }}
                >
                  <IconComp size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="sidebar-bottom">
          <button className="lang-picker-btn" onClick={() => setSelectedLang(selectedLang === 'English' ? 'Sinhala' : 'English')}>
            <div className="lang-left">
              <Globe size={16} />
              <span>{selectedLang}</span>
            </div>
            <ChevronDown size={14} />
          </button>

          <div className="user-profile-badge">
            <div className="user-info-left">
              <div className="user-avatar-circle">
                <User size={18} color="#0f172a" />
              </div>
              <div className="user-details">
                <span className="user-name">Dinithi Perera</span>
                <span className="user-role">Citizen</span>
              </div>
            </div>
            <ChevronRight size={16} color="#94a3b8" />
          </div>
        </div>
      </aside>

      {/* =========================================================
         2. Main Dashboard Content
         ========================================================= */}
      <main className="citizen-main">
        {/* Top Header Controls (Notifications & Help) */}
        <header className="main-top-bar">
          <button className="top-notif-btn" aria-label="Notifications">
            <Bell size={19} />
            <span className="notif-badge-count">2</span>
          </button>

          <button className="help-support-pill" onClick={() => navigate('/citizen/support')}>
            <Headphones size={15} color="#0f766e" />
            <span>Help & Support</span>
          </button>
        </header>

        {activeTab === 'request' ? (
          <CitizenAssistanceRequestForm onBack={() => { setActiveTab('home'); navigate('/citizen'); }} />
        ) : activeTab === 'requests' ? (
          <TrackRequestsPage />
        ) : activeTab === 'shelters' ? (
          <FindShelterPage onBack={() => { setActiveTab('home'); navigate('/citizen'); }} />
        ) : activeTab === 'alerts' ? (
          <EmergencyAlertsPage onBack={() => { setActiveTab('home'); navigate('/citizen'); }} />
        ) : activeTab === 'safety' ? (
          <SafetyGuidePage onBack={() => { setActiveTab('home'); navigate('/citizen'); }} />
        ) : (
          <>
            {/* Hero Section Banner */}
            <section className="citizen-hero-card">
          <div className="hero-text-block">
            <h1 className="hero-main-heading">How can we help you?</h1>
            <p className="hero-sub-text">
              Get assistance, find shelters, track your request or stay informed during emergencies.
            </p>

            <div className="hero-search-wrapper">
              <Search size={17} className="search-icon-hero" />
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search for shelters, alerts or support..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 3D Pop-Out Cutout of Mother and Child */}
          <div className="hero-popout-wrapper">
            <img
              src={familyPopout}
              alt="Disaster response family"
              className="hero-popout-img"
            />
          </div>
        </section>

        {/* Body 2-Column Grid */}
        <div className="citizen-body-layout">
          {/* =====================================================
             Left Main Column (64%)
             ===================================================== */}
          <div className="layout-col-left">
            {/* Quick Assistance 6 Cards */}
            <div className="quick-assistance-grid">
              {quickCategories.map((cat) => {
                const IconComp = cat.icon;
                return (
                  <Link to={cat.link} key={cat.id} className="assist-category-card">
                    <div className="assist-card-left">
                      <div className={`assist-icon-circle ${cat.iconClass}`}>
                        <IconComp size={20} />
                      </div>
                      <div className="assist-text-col">
                        <span className="assist-card-title">{cat.title}</span>
                        <span className="assist-card-desc">{cat.desc}</span>
                      </div>
                    </div>
                    <div 
                      className="assist-arrow-circle" 
                      style={{ backgroundColor: cat.arrowBg, color: cat.arrowColor }}
                    >
                      <ChevronRight size={14} />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* My Recent Requests */}
            <div className="section-header-row">
              <h2 className="section-title">My Recent Requests</h2>
              <Link to="/citizen/track" className="view-all-link">
                View All Requests <ArrowRight size={13} />
              </Link>
            </div>

            <div 
              className="request-summary-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/coordinator/requests/REQ-2026-01842')}
              title="Click to view live tracking details for REQ-2026-01842"
            >
              <div className="request-card-info-side">
                <div className="request-red-bar"></div>
                <div>
                  <div className="request-id-row">
                    <span className="req-id-text">REQ-2026-01842</span>
                    <span className="req-status-pill">Under Review</span>
                  </div>
                  <div className="req-category-name">Medical Assistance</div>
                  <div className="req-meta-details">
                    <div className="req-meta-item">
                      <Calendar size={13} />
                      <span>Submitted on 15 Jun 2026, 10:24 AM</span>
                    </div>
                    <div className="req-meta-item">
                      <MapPin size={13} />
                      <span>Colombo, Western Province</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Milestones Stepper */}
              <div className="request-stepper-side">
                <div className="step-node completed">
                  <div className="step-indicator">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="step-name">Submitted</span>
                  <span className="step-subtext">15 Jun<br />10:24 AM</span>
                </div>

                <div className="step-line-sep completed"></div>

                <div className="step-node active">
                  <div className="step-indicator">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }}></div>
                  </div>
                  <span className="step-name" style={{ color: '#2563eb' }}>AI Assessment</span>
                  <span className="step-subtext" style={{ color: '#2563eb', fontWeight: 600 }}>In Progress</span>
                </div>

                <div className="step-line-sep"></div>

                <div className="step-node">
                  <div className="step-indicator"></div>
                  <span className="step-name">Human Review</span>
                  <span className="step-subtext">Pending</span>
                </div>

                <div className="step-line-sep"></div>

                <div className="step-node">
                  <div className="step-indicator"></div>
                  <span className="step-name">Resource<br />Allocation</span>
                  <span className="step-subtext">Pending</span>
                </div>

                <div className="step-line-sep"></div>

                <div className="step-node">
                  <div className="step-indicator"></div>
                  <span className="step-name">Assistance<br />Delivered</span>
                </div>
              </div>

              <div className="req-arrow-btn" onClick={() => navigate('/citizen/track')}>
                <ChevronRight size={18} />
              </div>
            </div>

            {/* Latest Emergency Alerts */}
            <div className="section-header-row">
              <h2 className="section-title">Latest Emergency Alerts</h2>
              <Link to="/citizen/alerts" className="view-all-link">
                View All <ArrowRight size={13} />
              </Link>
            </div>

            <div className="alerts-row-grid">
              {/* Alert 1 */}
              <div className="alert-item-card alert-red">
                <div className="alert-card-top">
                  <div className="alert-icon-box" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    <AlertTriangle size={16} />
                  </div>
                  <span className="alert-title-text" style={{ color: '#dc2626' }}>Severe Weather Warning</span>
                </div>
                <p className="alert-body-desc">
                  Heavy rainfall expected in Western Province next 24 hours.
                </p>
                <span className="alert-time-stamp">2 hours ago</span>
              </div>

              {/* Alert 2 */}
              <div className="alert-item-card alert-amber">
                <div className="alert-card-top">
                  <div className="alert-icon-box" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                    <AlertCircle size={16} />
                  </div>
                  <span className="alert-title-text" style={{ color: '#d97706' }}>Road Closure</span>
                </div>
                <p className="alert-body-desc">
                  Main road A1 closed due to landslide near Gampaha.
                </p>
                <span className="alert-time-stamp">4 hours ago</span>
              </div>

              {/* Alert 3 */}
              <div className="alert-item-card alert-blue">
                <div className="alert-card-top">
                  <div className="alert-icon-box" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
                    <Info size={16} />
                  </div>
                  <span className="alert-title-text" style={{ color: '#2563eb' }}>New Shelter Opened</span>
                </div>
                <p className="alert-body-desc">
                  Colombo Central School now open for displaced families.
                </p>
                <span className="alert-time-stamp">6 hours ago</span>
              </div>
            </div>
          </div>

          {/* =====================================================
             Right Sidebar Column (36%)
             ===================================================== */}
          <div className="layout-col-right">
            {/* Active Emergency Card */}
            <div className="active-emergency-card">
              <div className="active-emergency-header">
                <div className="active-emergency-title-col">
                  <div style={{ color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                    <AlertTriangle size={18} />
                  </div>
                  <span className="active-emergency-title">Active Emergency</span>
                </div>
                <span className="high-risk-badge">High Risk</span>
              </div>
              <p className="active-emergency-desc">
                Heavy rainfall expected in Western Province next 24 hours. Possible flooding in low-lying areas.
              </p>
              <Link to="/citizen/alerts" className="active-emergency-link">
                View Details <ArrowRight size={13} />
              </Link>
            </div>

            {/* Nearby Shelters */}
            <div className="nearby-shelters-card">
              <div className="section-header-row" style={{ marginBottom: '6px' }}>
                <h3 className="section-title">Nearby Shelters</h3>
                <Link to="/citizen/shelters" className="view-all-link">
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              {/* Map Preview */}
              <div className="shelter-map-container" onClick={() => navigate('/citizen/shelters')}>
                <img
                  src={citizenMapPreview}
                  alt="Nearby Shelters Map Preview"
                  className="shelter-map-img"
                />
              </div>

              {/* Shelters List */}
              <div className="shelter-items-list">
                {/* Shelter 1 */}
                <div className="shelter-list-entry" onClick={() => navigate('/citizen/shelters')}>
                  <div className="shelter-entry-left">
                    <img src={shelter1} alt="Colombo Central School" className="shelter-photo-thumb" />
                    <div className="shelter-info-col">
                      <span className="shelter-entry-title">Colombo Central School</span>
                      <span className="shelter-entry-meta">2.4 km away &nbsp;|&nbsp; Capacity: 500</span>
                      <div className="shelter-amenity-tags">
                        <span className="amenity-chip"><Droplets size={11} color="#0ea5e9" /> Water</span>
                        <span className="amenity-chip"><UtensilsCrossed size={11} color="#16a34a" /> Food</span>
                        <span className="amenity-chip"><Plus size={11} color="#ef4444" /> Medical</span>
                      </div>
                    </div>
                  </div>
                  <div className="shelter-entry-right">
                    <span className="shelter-status-tag status-open">Open</span>
                    <ChevronRight size={15} color="#94a3b8" />
                  </div>
                </div>

                {/* Shelter 2 */}
                <div className="shelter-list-entry" onClick={() => navigate('/citizen/shelters')}>
                  <div className="shelter-entry-left">
                    <img src={shelter2} alt="St. Anthony's College" className="shelter-photo-thumb" />
                    <div className="shelter-info-col">
                      <span className="shelter-entry-title">St. Anthony's College</span>
                      <span className="shelter-entry-meta">3.1 km away &nbsp;|&nbsp; Capacity: 300</span>
                      <div className="shelter-amenity-tags">
                        <span className="amenity-chip"><Droplets size={11} color="#0ea5e9" /> Water</span>
                        <span className="amenity-chip"><UtensilsCrossed size={11} color="#16a34a" /> Food</span>
                        <span className="amenity-chip"><Plus size={11} color="#ef4444" /> Medical</span>
                      </div>
                    </div>
                  </div>
                  <div className="shelter-entry-right">
                    <span className="shelter-status-tag status-open">Open</span>
                    <ChevronRight size={15} color="#94a3b8" />
                  </div>
                </div>

                {/* Shelter 3 */}
                <div className="shelter-list-entry" onClick={() => navigate('/citizen/shelters')}>
                  <div className="shelter-entry-left">
                    <img src={shelter3} alt="Gampaha Community Hall" className="shelter-photo-thumb" />
                    <div className="shelter-info-col">
                      <span className="shelter-entry-title">Gampaha Community Hall</span>
                      <span className="shelter-entry-meta">5.6 km away &nbsp;|&nbsp; Capacity: 150</span>
                      <div className="shelter-amenity-tags">
                        <span className="amenity-chip"><Droplets size={11} color="#0ea5e9" /> Water</span>
                        <span className="amenity-chip"><UtensilsCrossed size={11} color="#16a34a" /> Food</span>
                      </div>
                    </div>
                  </div>
                  <div className="shelter-entry-right">
                    <span className="shelter-status-tag status-limited">Limited</span>
                    <ChevronRight size={15} color="#94a3b8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
           8. Full-Width Bottom Banner: AI Support Assistant
           ========================================================= */}
        <section className="ai-assistant-banner">
          <div className="ai-banner-left">
            <div className="ai-robot-badge">
              <img src={robot3D} alt="AI Support Assistant" className="ai-robot-3d-img" />
            </div>
            <div>
              <h3 className="ai-banner-title">AI Support Assistant</h3>
              <p className="ai-banner-subtext">
                Get instant answers in your language. Ask about shelters, safety, or how to request assistance.
              </p>
            </div>
          </div>

          <button className="chat-ai-pill-btn" onClick={() => navigate('/citizen/support')}>
            <span>Chat with AI</span>
            <ArrowRight size={14} />
          </button>
        </section>
          </>
        )}

        {/* Floating 3D AI Assistant Widget */}
        <div className="floating-ai-widget" onClick={() => navigate('/citizen/support')} title="Talk with AI Support Assistant">
          <img src={robot3D} alt="AI Assistant" className="floating-robot-img" />
          <span className="floating-ai-ping"></span>
        </div>
      </main>
    </div>
  );
};

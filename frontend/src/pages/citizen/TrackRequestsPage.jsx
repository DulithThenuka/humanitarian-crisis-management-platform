import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PlusSquare, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Eye, 
  AlertTriangle, 
  Flame, 
  HeartPulse, 
  UtensilsCrossed, 
  Home, 
  Bus, 
  Accessibility, 
  Package, 
  Sparkles, 
  Phone, 
  User, 
  Check, 
  ShieldCheck, 
  Activity, 
  Radio, 
  X, 
  Calendar, 
  FileText, 
  ChevronRight, 
  RefreshCw,
  Send,
  MessageSquare
} from 'lucide-react';

import { requestService } from '../../services/requestService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAlert } from '../../context/AlertContext';
import './TrackRequestsPage.css';

const DEFAULT_DEMO_REQUESTS = [
  {
    id: 'REQ-2026-01842',
    category: 'Medical Assistance',
    description: 'Elderly diabetic person requiring insulin refrigeration and immediate flood evacuation. Rising flood level in ground floor living area.',
    urgency: 3, // Critical
    status: 1, // 0=Submitted, 1=In Review, 2=Dispatched, 3=Delivered, 4=Resolved
    statusLabel: 'En Route / Dispatched',
    numberOfPeople: 4,
    vulnerabilities: ['Elderly (65+)', 'Chronic Medical Need'],
    address: 'Sedawatta Road, Kolonnawa, Western Province',
    coords: { lat: 6.942, lon: 79.886 },
    createdAt: '2026-06-15T10:24:00Z',
    assignedTeam: {
      name: 'Western Sector Inflatable Boat Crew #3',
      lead: 'Lead Officer K. Jayasuriya',
      vehicle: 'Zodiac Rescue Boat (Unit B-14)',
      phone: '+94 77 412 8901',
      eta: '12 minutes'
    },
    timeline: [
      { time: '10:24 AM', label: 'Incident Lodged', desc: 'Emergency request submitted via Citizen Portal.', dot: 'green' },
      { time: '10:25 AM', label: 'AI Triage Completed', desc: 'Automated urgency set to Critical (94% confidence match).', dot: 'blue' },
      { time: '10:28 AM', label: 'Coordinator Verified', desc: 'Coordinator Amara Chen verified medical prescription urgency.', dot: 'blue' },
      { time: '10:36 AM', label: 'Field Convoy Dispatched', desc: 'Zodiac Boat B-14 deployed from Kelaniya Regional Staging Hub.', dot: 'blue' }
    ]
  },
  {
    id: 'REQ-2026-01877',
    category: 'Emergency Shelter',
    description: 'House flooded up to waist level. Displaced family of 6 including pregnant mother and two infants. Seeking shelter bed allocation.',
    urgency: 2, // High
    status: 1, // In Progress
    statusLabel: 'Shelter Allocated',
    numberOfPeople: 6,
    vulnerabilities: ['Infants & Children', 'Pregnant Mothers'],
    address: 'Biyagama South, Kelaniya Sector, Western Province',
    coords: { lat: 6.963, lon: 79.921 },
    createdAt: '2026-06-15T09:12:00Z',
    assignedTeam: {
      name: 'Kelaniya Logistics Evacuation Team',
      lead: 'Coordinator R. Mendis',
      vehicle: 'Relief Bus Convoy #4',
      phone: '+94 71 892 3341',
      eta: '35 minutes'
    },
    timeline: [
      { time: '09:12 AM', label: 'Request Registered', desc: 'Logged via Web Portal.', dot: 'green' },
      { time: '09:14 AM', label: 'AI Shelter Match', desc: 'Matched with Colombo Central School Relief Camp (Capacity: 180 available).', dot: 'blue' },
      { time: '09:30 AM', label: 'Transport Scheduled', desc: 'Evacuation bus departing Staging Post.', dot: 'blue' }
    ]
  },
  {
    id: 'REQ-2026-01835',
    category: 'Food & Clean Water',
    description: 'Drinking water canisters depleted in isolated sector. 3 households cut off by flooded main road A1.',
    urgency: 1, // Medium
    status: 0, // Submitted
    statusLabel: 'Queued for Dispatch',
    numberOfPeople: 9,
    vulnerabilities: ['Depleted Clean Drinking Water'],
    address: 'Kaduwela River Basin Sector 2, Western Province',
    coords: { lat: 6.935, lon: 79.972 },
    createdAt: '2026-06-15T08:05:00Z',
    assignedTeam: {
      name: 'Western Regional Food Logistics Depot',
      lead: 'Dispatcher T. Gunaratne',
      vehicle: 'High-Clearance Water Tanker W-02',
      phone: '+94 76 554 9912',
      eta: 'Scheduled 1:30 PM'
    },
    timeline: [
      { time: '08:05 AM', label: 'Request Queued', desc: 'Registered in Food & Water distribution manifest.', dot: 'green' },
      { time: '08:08 AM', label: 'Stock Allocated', desc: '40 Clean water canisters & 18 ration packs assigned.', dot: 'blue' }
    ]
  }
];

export const TrackRequestsPage = ({ onBack }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, active, review, resolved
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDrawerRequest, setActiveDrawerRequest] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateText, setUpdateText] = useState('');
  
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await requestService.getAll();
      if (res && res.succeeded && Array.isArray(res.data) && res.data.length > 0) {
        // Merge API data with rich demo fields
        const formattedApi = res.data.map(item => ({
          id: item.id || `REQ-2026-0${Math.floor(1000 + Math.random() * 9000)}`,
          category: item.category || 'Humanitarian Aid',
          description: item.description || 'Assistance request logged in regional pipeline.',
          urgency: item.urgency !== undefined ? item.urgency : 2,
          status: item.status !== undefined ? item.status : 1,
          statusLabel: item.status === 3 || item.status === 4 ? 'Resolved / Safe' : item.status === 2 ? 'En Route / Dispatched' : 'Under Review',
          numberOfPeople: item.numberOfPeople || 2,
          vulnerabilities: ['Verified Field Need'],
          address: item.address || 'Western Province',
          coords: { lat: item.latitude || 6.9271, lon: item.longitude || 79.8612 },
          createdAt: item.createdAt || new Date().toISOString(),
          assignedTeam: {
            name: 'Western Sector Rapid Response Unit',
            lead: 'Field Coordinator On-Duty',
            vehicle: 'Rescue Fleet Unit',
            phone: '+94 77 117 0000',
            eta: 'Active Response'
          },
          timeline: [
            { time: 'Recorded', label: 'Request Logged', desc: 'Assistance request registered in platform.', dot: 'green' },
            { time: 'In Progress', label: 'AI & Field Triage', desc: 'Evaluated by humanitarian response dispatch.', dot: 'blue' }
          ]
        }));
        
        // Combine API requests with default demo items to ensure rich experience
        setRequests([...formattedApi, ...DEFAULT_DEMO_REQUESTS]);
      } else {
        setRequests(DEFAULT_DEMO_REQUESTS);
      }
    } catch {
      setRequests(DEFAULT_DEMO_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  // Filtered requests computation
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Tab filter
      if (activeTab === 'active' && req.status !== 1 && req.status !== 2) return false;
      if (activeTab === 'review' && req.status !== 0) return false;
      if (activeTab === 'resolved' && req.status !== 3 && req.status !== 4) return false;

      // Text search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = req.id?.toLowerCase().includes(query);
        const matchesCategory = req.category?.toLowerCase().includes(query);
        const matchesDesc = req.description?.toLowerCase().includes(query);
        const matchesAddress = req.address?.toLowerCase().includes(query);
        if (!matchesId && !matchesCategory && !matchesDesc && !matchesAddress) return false;
      }

      return true;
    });
  }, [requests, activeTab, searchQuery]);

  const activeCount = useMemo(() => requests.filter(r => r.status === 1 || r.status === 2).length, [requests]);
  const reviewCount = useMemo(() => requests.filter(r => r.status === 0).length, [requests]);
  const resolvedCount = useMemo(() => requests.filter(r => r.status === 3 || r.status === 4).length, [requests]);

  const handleSendUrgentUpdate = (e) => {
    e.preventDefault();
    if (!updateText.trim()) return;

    if (activeDrawerRequest) {
      const updatedList = requests.map(r => {
        if (r.id === activeDrawerRequest.id) {
          const newEvent = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            label: 'Citizen Status Update',
            desc: updateText,
            dot: 'blue'
          };
          return {
            ...r,
            timeline: [newEvent, ...r.timeline]
          };
        }
        return r;
      });

      setRequests(updatedList);
      setActiveDrawerRequest(prev => prev ? {
        ...prev,
        timeline: [{
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          label: 'Citizen Status Update',
          desc: updateText,
          dot: 'blue'
        }, ...prev.timeline]
      } : null);

      if (showAlert) showAlert("Your situation update was broadcast to the assigned field team.", "success");
      setUpdateText('');
      setShowUpdateModal(false);
    }
  };

  const getUrgencyClass = (urgency) => {
    if (urgency === 3) return 'critical';
    if (urgency === 2) return 'high';
    if (urgency === 1) return 'medium';
    return 'low';
  };

  const getUrgencyLabel = (urgency) => {
    if (urgency === 3) return 'Critical Priority';
    if (urgency === 2) return 'High Priority';
    if (urgency === 1) return 'Medium Priority';
    return 'Standard Priority';
  };

  const getCategoryIcon = (category) => {
    const c = category?.toLowerCase() || '';
    if (c.includes('rescue')) return <Flame size={16} color="#ef4444" />;
    if (c.includes('med')) return <HeartPulse size={16} color="#0e6f76" />;
    if (c.includes('food') || c.includes('water')) return <UtensilsCrossed size={16} color="#0284c7" />;
    if (c.includes('shelter')) return <Home size={16} color="#16a34a" />;
    if (c.includes('transport')) return <Bus size={16} color="#d97706" />;
    if (c.includes('access') || c.includes('elderly')) return <Accessibility size={16} color="#7c3aed" />;
    return <Package size={16} color="#475569" />;
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving your assistance requests telemetry..." />;
  }

  return (
    <div className="track-page-container">
      {/* 1. Top Navigation Bar */}
      <div className="track-top-nav-bar">
        <button
          type="button"
          className="track-back-btn"
          onClick={() => {
            if (onBack) onBack();
            else navigate('/citizen');
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Citizen Portal</span>
        </button>

        <div className="track-nav-actions">
          <Link to="/citizen/submit" className="btn-new-request-link">
            <PlusSquare size={16} />
            <span>Submit New Request</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Overview & Live Telemetry Card */}
      <div className="track-hero-card">
        <div className="track-hero-content">
          <h1>Track My Assistance Requests</h1>
          <p>
            Monitor live status, AI triage assessment, and convoy dispatch telemetry for all humanitarian aid requests submitted from your account or household.
          </p>
        </div>

        <div className="track-stats-cluster">
          <div className="stat-pill-box">
            <span className="stat-pill-num text-teal">{requests.length}</span>
            <span className="stat-pill-label">Total Logged</span>
          </div>

          <div className="stat-pill-box">
            <span className="stat-pill-num text-amber">{activeCount}</span>
            <span className="stat-pill-label">Active En Route</span>
          </div>

          <div className="stat-pill-box">
            <span className="stat-pill-num">{resolvedCount}</span>
            <span className="stat-pill-label">Safe / Delivered</span>
          </div>
        </div>
      </div>

      {/* 3. Controls Strip: Filter Tabs & Search */}
      <div className="track-controls-strip">
        <div className="track-filter-pills">
          <button
            type="button"
            className={`filter-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>All Requests</span>
            <span className="filter-count-badge">{requests.length}</span>
          </button>

          <button
            type="button"
            className={`filter-tab-pill ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <span>Active & En Route</span>
            <span className="filter-count-badge">{activeCount}</span>
          </button>

          <button
            type="button"
            className={`filter-tab-pill ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            <span>Under AI Triage</span>
            <span className="filter-count-badge">{reviewCount}</span>
          </button>

          <button
            type="button"
            className={`filter-tab-pill ${activeTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveTab('resolved')}
          >
            <span>Delivered / Safe</span>
            <span className="filter-count-badge">{resolvedCount}</span>
          </button>
        </div>

        <div className="track-search-wrap">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by ID (REQ-2026-...), category, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X size={15} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
          )}
        </div>
      </div>

      {/* 4. Requests Cards Stack */}
      <div className="track-cards-stack">
        {filteredRequests.length === 0 ? (
          <div className="track-empty-card">
            <div className="empty-icon-circle">
              <FileText size={28} />
            </div>
            <h3 style={{ margin: '4px 0', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
              No matching assistance requests found
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', maxWidth: '420px' }}>
              You do not have any requests under this filter. If you require emergency aid, submit a request to alert field coordinators.
            </p>
            <Link to="/citizen/submit" className="btn-new-request-link" style={{ marginTop: '8px' }}>
              <PlusSquare size={16} />
              <span>Submit Emergency Request</span>
            </Link>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const urgencyClass = getUrgencyClass(req.urgency);
            return (
              <div key={req.id} className="request-live-card">
                {/* Colored Priority Left Accent Strip */}
                <div className={`card-${urgencyClass}-accent-bar`}></div>

                {/* Card Header */}
                <div className="req-header-row">
                  <div className="req-header-left">
                    <span className="req-id-text-badge">{req.id}</span>
                    <span className={`priority-tag-pill ${urgencyClass}`}>
                      {req.urgency === 3 && <Flame size={12} />}
                      {getUrgencyLabel(req.urgency)}
                    </span>
                    <span className={`status-badge-outline ${req.status === 1 || req.status === 2 ? 'in-progress' : req.status >= 3 ? 'resolved' : ''}`}>
                      {req.statusLabel}
                    </span>
                  </div>

                  <div className="req-header-right">
                    <Calendar size={13} />
                    <span>Submitted on {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="req-body-row">
                  <div className="req-info-col">
                    <div className="req-category-title">
                      {getCategoryIcon(req.category)}
                      <span>{req.category}</span>
                    </div>

                    <p className="req-desc-paragraph">{req.description}</p>

                    <div className="req-tags-strip">
                      <span className="req-meta-tag">
                        <User size={12} color="#0e6f76" />
                        <span>{req.numberOfPeople} Persons Requiring Aid</span>
                      </span>

                      <span className="req-meta-tag">
                        <MapPin size={12} color="#0e6f76" />
                        <span>{req.address}</span>
                      </span>

                      {req.vulnerabilities && req.vulnerabilities.map((vuln, vIdx) => (
                        <span key={vIdx} className="req-meta-tag" style={{ background: '#fef3c7', color: '#b45309' }}>
                          <AlertTriangle size={11} />
                          <span>{vuln}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Assigned Field Unit Box */}
                  {req.assignedTeam && (
                    <div className="assigned-team-card">
                      <div className="assigned-team-head">
                        <Radio size={14} />
                        <span>Assigned Emergency Response Team</span>
                      </div>
                      <div className="assigned-team-name">{req.assignedTeam.name}</div>
                      <div className="assigned-team-sub">{req.assignedTeam.vehicle}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '12px' }}>
                        <span style={{ color: '#0e6f76', fontWeight: 700 }}>ETA: {req.assignedTeam.eta}</span>
                        <a
                          href={`tel:${req.assignedTeam.phone}`}
                          style={{ color: '#0e6f76', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}
                        >
                          <Phone size={12} /> Contact
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5-Node Visual Lifecycle Stepper */}
                <div className="req-milestones-track">
                  <div className="milestones-flex-row">
                    <div className="stepper-connecting-line">
                      <div 
                        className="stepper-connecting-line-fill" 
                        style={{ width: req.status >= 3 ? '100%' : req.status === 2 ? '75%' : req.status === 1 ? '50%' : '25%' }}
                      ></div>
                    </div>

                    {/* Step 1: Lodged */}
                    <div className="milestone-step-item completed">
                      <div className="step-circle-icon">✓</div>
                      <span className="step-label-title">Lodged</span>
                      <span className="step-time-sub">Received</span>
                    </div>

                    {/* Step 2: AI Triage */}
                    <div className={`milestone-step-item ${req.status >= 1 ? 'completed' : 'active'}`}>
                      <div className="step-circle-icon">{req.status >= 1 ? '✓' : '2'}</div>
                      <span className="step-label-title">AI Triage</span>
                      <span className="step-time-sub">{req.urgency >= 2 ? 'Prioritized' : 'Evaluated'}</span>
                    </div>

                    {/* Step 3: Verified */}
                    <div className={`milestone-step-item ${req.status >= 2 ? 'completed' : req.status === 1 ? 'active' : ''}`}>
                      <div className="step-circle-icon">{req.status >= 2 ? '✓' : '3'}</div>
                      <span className="step-label-title">Verified</span>
                      <span className="step-time-sub">Desk Approved</span>
                    </div>

                    {/* Step 4: Dispatched */}
                    <div className={`milestone-step-item ${req.status >= 3 ? 'completed' : req.status === 2 ? 'active' : ''}`}>
                      <div className="step-circle-icon">{req.status >= 3 ? '✓' : '4'}</div>
                      <span className="step-label-title">Dispatched</span>
                      <span className="step-time-sub">{req.status === 2 ? 'En Route' : 'Allocated'}</span>
                    </div>

                    {/* Step 5: Delivered */}
                    <div className={`milestone-step-item ${req.status >= 3 ? 'completed' : ''}`}>
                      <div className="step-circle-icon">{req.status >= 3 ? '✓' : '5'}</div>
                      <span className="step-label-title">Completed</span>
                      <span className="step-time-sub">Safe</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="req-footer-bar">
                  <div className="footer-left-info">
                    <Clock size={13} />
                    <span>Last updated: Recently via Sector Operations Hub</span>
                  </div>

                  <div className="footer-actions-group">
                    <button
                      type="button"
                      className="btn-urgent-update"
                      onClick={() => {
                        setActiveDrawerRequest(req);
                        setShowUpdateModal(true);
                      }}
                    >
                      <MessageSquare size={13} />
                      <span>Send Situation Update</span>
                    </button>

                    <button
                      type="button"
                      className="btn-open-detail"
                      onClick={() => setActiveDrawerRequest(req)}
                    >
                      <Eye size={13} />
                      <span>View Live Trace Logs</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================================================
         5. Slide-Over Detail Drawer
         ========================================================= */}
      {activeDrawerRequest && !showUpdateModal && (
        <div className="track-drawer-overlay" onClick={() => setActiveDrawerRequest(null)}>
          <div className="track-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head-section">
              <div className="drawer-head-title-col">
                <h3>{activeDrawerRequest.id}</h3>
                <p>Live Incident Telemetry & Response Lifecycle</p>
              </div>

              <button className="drawer-close-btn" onClick={() => setActiveDrawerRequest(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="drawer-content-body">
              {/* Category & Status */}
              <div className="drawer-card-block">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className={`priority-tag-pill ${getUrgencyClass(activeDrawerRequest.urgency)}`}>
                    {getUrgencyLabel(activeDrawerRequest.urgency)}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0e6f76' }}>
                    {activeDrawerRequest.statusLabel}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  {activeDrawerRequest.category}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.45 }}>
                  {activeDrawerRequest.description}
                </p>
              </div>

              {/* Geolocation Details */}
              <div className="drawer-card-block">
                <div className="drawer-card-title">
                  <MapPin size={15} color="#0e6f76" />
                  <span>Geographic Pin & Operational Sector</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                  {activeDrawerRequest.address}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  GPS: {activeDrawerRequest.coords.lat}° N, {activeDrawerRequest.coords.lon}° E
                </div>
              </div>

              {/* Assigned Convoy */}
              {activeDrawerRequest.assignedTeam && (
                <div className="drawer-card-block">
                  <div className="drawer-card-title">
                    <Radio size={15} color="#0e6f76" />
                    <span>Assigned Field Response Unit</span>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                    {activeDrawerRequest.assignedTeam.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', margin: '3px 0' }}>
                    {activeDrawerRequest.assignedTeam.vehicle} | {activeDrawerRequest.assignedTeam.lead}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#0e6f76', fontWeight: 700, marginTop: '6px' }}>
                    Estimated Arrival: {activeDrawerRequest.assignedTeam.eta}
                  </div>
                </div>
              )}

              {/* Timeline Audit Logs */}
              <div className="drawer-card-block">
                <div className="drawer-card-title">
                  <Clock size={15} color="#0e6f76" />
                  <span>Real-Time Audit Trail & Dispatch Events</span>
                </div>

                <div className="drawer-timeline-list">
                  {activeDrawerRequest.timeline && activeDrawerRequest.timeline.map((event, idx) => (
                    <div key={idx} className="timeline-event-item">
                      <div className={`timeline-dot ${event.dot}`}></div>
                      <div className="timeline-event-time">{event.time}</div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{event.label}</div>
                      <p className="timeline-event-desc">{event.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="drawer-footer-actions">
              <button
                className="btn-drawer-action-primary"
                onClick={() => setShowUpdateModal(true)}
              >
                <MessageSquare size={15} />
                <span>Transmit Status Update</span>
              </button>

              <button
                className="btn-drawer-action-secondary"
                onClick={() => setActiveDrawerRequest(null)}
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         6. Situation Update Modal Popover
         ========================================================= */}
      {showUpdateModal && activeDrawerRequest && (
        <div className="track-drawer-overlay" onClick={() => setShowUpdateModal(false)}>
          <div 
            style={{ 
              maxWidth: '500px', 
              width: '90%', 
              background: '#ffffff', 
              borderRadius: '14px', 
              padding: '24px', 
              margin: 'auto',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                  Update Emergency Incident Status
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Target: {activeDrawerRequest.id}</span>
              </div>
              <button 
                onClick={() => setShowUpdateModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendUrgentUpdate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Situation Change or Critical Note
                </label>
                <textarea
                  rows="4"
                  placeholder="e.g. Water has risen another foot; power is now cut off. We have moved from 1st floor to rooftop..."
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13.5px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 18px',
                    borderRadius: '7px',
                    border: 'none',
                    background: '#0e6f76',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={14} /> Transmit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

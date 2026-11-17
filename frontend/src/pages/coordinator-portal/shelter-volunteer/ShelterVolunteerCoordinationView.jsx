import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Building2,
  Users,
  Plus,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  ChevronRight,
  Shield,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  Accessibility,
  Search,
  Filter,
  RefreshCw,
  Phone,
  FileText,
  UserCheck,
  Layers,
  HeartHandshake,
  ArrowRight,
  Info,
  Calendar,
  ExternalLink
} from 'lucide-react';
import coordinatorService from '../../../services/coordinatorService';
import './ShelterVolunteerCoordinationView.css';

export const ShelterVolunteerCoordinationView = ({
  cases = [],
  coordinatorUser,
  showToast,
  onNavigateTab
}) => {
  // Navigation sub-tab: 'shelters' | 'shelter-requests' | 'volunteers' | 'volunteer-requests' | 'history'
  const [activeTab, setActiveTab] = useState('shelters');

  // Loading & Refresh State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Core Data States
  const [metrics, setMetrics] = useState({
    availableShelterCapacity: 0,
    activeShelterRequests: 0,
    pendingVolunteerRequests: 0,
    approvedCoordinationRequests: 0,
    totalSheltersCount: 0,
    totalVolunteersCount: 0
  });
  const [shelters, setShelters] = useState([]);
  const [shelterRecommendations, setShelterRecommendations] = useState([]);
  const [shelterRequests, setShelterRequests] = useState([]);
  const [volunteerRequirements, setVolunteerRequirements] = useState([]);
  const [volunteerRequests, setVolunteerRequests] = useState([]);
  const [volunteerSummary, setVolunteerSummary] = useState({
    totalRegisteredVolunteers: 0,
    availableVolunteers: 0,
    onAssignmentVolunteers: 0,
    topSkills: [],
    generalAreas: []
  });
  const [unifiedHistory, setUnifiedHistory] = useState([]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals
  const [selectedSuitabilityShelter, setSelectedSuitabilityShelter] = useState(null);
  const [showShelterRequestModal, setShowShelterRequestModal] = useState(false);
  const [showVolunteerRequestModal, setShowVolunteerRequestModal] = useState(false);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Form Submitting States
  const [isSubmittingShelter, setIsSubmittingShelter] = useState(false);
  const [isSubmittingVolunteer, setIsSubmittingVolunteer] = useState(false);

  // Shelter Placement Form State
  const [shelterForm, setShelterForm] = useState({
    shelterId: '',
    relatedIncident: 'HMR-1042',
    numberOfPersons: 6,
    specialRequirements: 'Ground-floor access and infant care zone',
    accessibilityNeeds: 'Older adult with limited mobility',
    priority: 'Critical',
    coordinatorNotes: ''
  });

  // Volunteer Assignment Form State
  const [volunteerForm, setVolunteerForm] = useState({
    relatedIncident: 'HMR-1042',
    requiredVolunteerCount: 4,
    requiredSkills: 'First Aid, Water Rescue',
    location: 'Kelani East Zone 03',
    requiredDate: '',
    priority: 'Critical',
    taskDescription: 'Boat rescue escort and primary evacuation triage',
    additionalInstructions: 'Report to Sector Staging command with life-vest gear'
  });

  // Fetch real backend data
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await coordinatorService.getShelterVolunteerCoordination();
      if (res) {
        if (res.metrics) setMetrics(res.metrics);
        if (Array.isArray(res.shelters)) setShelters(res.shelters);
        if (Array.isArray(res.shelterRecommendations)) setShelterRecommendations(res.shelterRecommendations);
        if (Array.isArray(res.shelterRequests)) setShelterRequests(res.shelterRequests);
        if (Array.isArray(res.volunteerRequirements)) setVolunteerRequirements(res.volunteerRequirements);
        if (Array.isArray(res.volunteerRequests)) setVolunteerRequests(res.volunteerRequests);
        if (res.volunteerSummary) setVolunteerSummary(res.volunteerSummary);
        if (Array.isArray(res.unifiedHistory)) setUnifiedHistory(res.unifiedHistory);
      }
    } catch (err) {
      console.error('Failed to load shelter & volunteer coordination data:', err);
      setError('Unable to load live coordination data from server. Please retry.');
      if (showToast) {
        showToast('Failed to load coordination data from server.', 'error');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open Shelter Placement Request Modal with optional pre-fill
  const handleOpenShelterRequestModal = (prefill = {}) => {
    const defaultShelter = shelters[0];
    const defaultCase = cases && cases.length > 0 ? cases[0] : null;

    setShelterForm({
      shelterId: prefill.shelterId || (defaultShelter ? defaultShelter.id : ''),
      relatedIncident: prefill.relatedIncident || defaultCase?.caseNumber || defaultCase?.id || 'HMR-1042',
      numberOfPersons: prefill.numberOfPersons || (defaultCase?.peopleCount || 6),
      specialRequirements: prefill.specialRequirements || 'Ground-floor access and infant care supplies',
      accessibilityNeeds: prefill.accessibilityNeeds || defaultCase?.accessibilityNeeds || 'Older adult with limited mobility',
      priority: prefill.priority || defaultCase?.priority || 'Critical',
      coordinatorNotes: prefill.coordinatorNotes || ''
    });
    setSelectedSuitabilityShelter(null);
    setShowRecommendModal(false);
    setShowShelterRequestModal(true);
  };

  // Open Volunteer Assignment Request Modal with optional pre-fill
  const handleOpenVolunteerRequestModal = (prefill = {}) => {
    const defaultCase = cases && cases.length > 0 ? cases[0] : null;

    setVolunteerForm({
      relatedIncident: prefill.relatedIncident || defaultCase?.caseNumber || defaultCase?.id || 'HMR-1042',
      requiredVolunteerCount: prefill.requiredVolunteerCount || 4,
      requiredSkills: prefill.requiredSkills || 'First Aid, Water Rescue',
      location: prefill.location || defaultCase?.address || 'Kelani East Zone 03',
      requiredDate: prefill.requiredDate || new Date(Date.now() + 4 * 3600000).toISOString().slice(0, 16),
      priority: prefill.priority || defaultCase?.priority || 'Critical',
      taskDescription: prefill.taskDescription || 'Boat rescue escort and evacuation support',
      additionalInstructions: prefill.additionalInstructions || 'Equipped with standard high-visibility vests'
    });
    setShowVolunteerRequestModal(true);
  };

  // Submit Shelter Placement Request
  const handleSubmitShelterRequest = async (e) => {
    e.preventDefault();
    if (!shelterForm.shelterId) {
      showToast && showToast('Please select a target shelter.', 'error');
      return;
    }
    if (!shelterForm.numberOfPersons || Number(shelterForm.numberOfPersons) <= 0) {
      showToast && showToast('Number of persons must be at least 1.', 'error');
      return;
    }

    try {
      setIsSubmittingShelter(true);
      const payload = {
        shelterId: shelterForm.shelterId,
        relatedIncident: shelterForm.relatedIncident,
        numberOfPersons: parseInt(shelterForm.numberOfPersons, 10),
        specialRequirements: shelterForm.specialRequirements,
        accessibilityNeeds: shelterForm.accessibilityNeeds,
        priority: shelterForm.priority,
        coordinatorNotes: shelterForm.coordinatorNotes
      };

      const res = await coordinatorService.submitShelterPlacementRequest(payload);
      if (res) {
        showToast && showToast(`Shelter placement request for ${shelterForm.numberOfPersons} persons submitted to Shelter Manager!`, 'success');
        setShowShelterRequestModal(false);
        await fetchData(true);
        setActiveTab('shelter-requests');
      }
    } catch (err) {
      console.error('Error submitting shelter request:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to submit shelter request.';
      showToast && showToast(msg, 'error');
    } finally {
      setIsSubmittingShelter(false);
    }
  };

  // Submit Volunteer Assignment Request
  const handleSubmitVolunteerRequest = async (e) => {
    e.preventDefault();
    if (!volunteerForm.relatedIncident.trim()) {
      showToast && showToast('Please specify a related incident reference.', 'error');
      return;
    }
    if (!volunteerForm.requiredVolunteerCount || Number(volunteerForm.requiredVolunteerCount) <= 0) {
      showToast && showToast('Required volunteer count must be at least 1.', 'error');
      return;
    }
    if (!volunteerForm.taskDescription.trim()) {
      showToast && showToast('Task description is required.', 'error');
      return;
    }

    try {
      setIsSubmittingVolunteer(true);
      const payload = {
        relatedIncident: volunteerForm.relatedIncident,
        requiredVolunteerCount: parseInt(volunteerForm.requiredVolunteerCount, 10),
        requiredSkills: volunteerForm.requiredSkills,
        location: volunteerForm.location,
        requiredDate: volunteerForm.requiredDate ? new Date(volunteerForm.requiredDate) : null,
        priority: volunteerForm.priority,
        taskDescription: volunteerForm.taskDescription,
        additionalInstructions: volunteerForm.additionalInstructions
      };

      const res = await coordinatorService.submitVolunteerAssignmentRequest(payload);
      if (res) {
        showToast && showToast(`Volunteer request for ${volunteerForm.requiredVolunteerCount} volunteers submitted to Volunteer Manager!`, 'success');
        setShowVolunteerRequestModal(false);
        await fetchData(true);
        setActiveTab('volunteer-requests');
      }
    } catch (err) {
      console.error('Error submitting volunteer request:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to submit volunteer request.';
      showToast && showToast(msg, 'error');
    } finally {
      setIsSubmittingVolunteer(false);
    }
  };

  // Filtered Shelters
  const filteredShelters = useMemo(() => {
    return shelters.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        s.name?.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q) ||
        s.shelterCode?.toLowerCase().includes(q) ||
        (Array.isArray(s.facilities) && s.facilities.some(f => f.toLowerCase().includes(q)));

      const matchStatus = statusFilter === 'all' || s.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [shelters, searchQuery, statusFilter]);

  // Filtered Shelter Requests
  const filteredShelterRequests = useMemo(() => {
    return shelterRequests.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        r.requestNumber?.toLowerCase().includes(q) ||
        r.shelterName?.toLowerCase().includes(q) ||
        r.relatedIncident?.toLowerCase().includes(q) ||
        r.shelterLocation?.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || r.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchPriority = priorityFilter === 'all' || r.priority?.toLowerCase() === priorityFilter.toLowerCase();
      return matchSearch && matchStatus && matchPriority;
    });
  }, [shelterRequests, searchQuery, statusFilter, priorityFilter]);

  // Filtered Volunteer Requests
  const filteredVolunteerRequests = useMemo(() => {
    return volunteerRequests.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        r.requestNumber?.toLowerCase().includes(q) ||
        r.relatedIncident?.toLowerCase().includes(q) ||
        r.taskDescription?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || r.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchPriority = priorityFilter === 'all' || r.priority?.toLowerCase() === priorityFilter.toLowerCase();
      return matchSearch && matchStatus && matchPriority;
    });
  }, [volunteerRequests, searchQuery, statusFilter, priorityFilter]);

  // Filtered Unified History
  const filteredHistory = useMemo(() => {
    return unifiedHistory.filter(h => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        h.requestNumber?.toLowerCase().includes(q) ||
        h.relatedIncident?.toLowerCase().includes(q) ||
        h.targetName?.toLowerCase().includes(q) ||
        h.submittedBy?.toLowerCase().includes(q);

      const matchType = typeFilter === 'all' || h.requestType?.toLowerCase().includes(typeFilter.toLowerCase());
      const matchStatus = statusFilter === 'all' || h.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchPriority = priorityFilter === 'all' || h.priority?.toLowerCase() === priorityFilter.toLowerCase();
      return matchSearch && matchType && matchStatus && matchPriority;
    });
  }, [unifiedHistory, searchQuery, typeFilter, statusFilter, priorityFilter]);

  // Status Badge Class Helper
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational':
      case 'approved':
      case 'completed':
        return 'pill-approved';
      case 'near capacity':
      case 'partially fulfilled':
      case 'more information required':
        return 'pill-warning';
      case 'full':
      case 'temporarily unavailable':
      case 'rejected':
      case 'unsuitable':
        return 'pill-danger';
      case 'under review':
      case 'dispatched':
        return 'pill-dispatched';
      case 'submitted':
      default:
        return 'pill-requested';
    }
  };

  const getUrgencyBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'ec-svc-badge-critical';
      case 'high':
        return 'ec-svc-badge-high';
      case 'medium':
        return 'ec-svc-badge-medium';
      case 'low':
      default:
        return 'ec-svc-badge-low';
    }
  };

  return (
    <div className="ec-portal-canvas">
      {/* 1. Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">
            HUMANAID PLATFORM &bull; EMERGENCY OPERATIONS &bull; COORDINATION
          </span>
          <h2 className="ec-review-main-title">Shelter &amp; Volunteer Coordination</h2>
          <p className="ec-review-sub-meta">
            Review shelter capacity, recommend suitable facilities, submit placement requests to Shelter Managers, and coordinate volunteer deployment.
          </p>
        </div>
        <div className="ec-svc-header-actions">
          <button
            className="ec-btn-action-secondary"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            title="Refresh coordination data from live server"
          >
            <RefreshCw size={14} className={refreshing ? 'ec-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            className="ec-btn-action-secondary"
            onClick={() => handleOpenVolunteerRequestModal()}
          >
            <Users size={14} color="#7c3aed" />
            <span>Request Volunteers</span>
          </button>
          <button
            className="ec-btn-action-primary"
            onClick={() => handleOpenShelterRequestModal()}
          >
            <Building2 size={15} />
            <span>Submit Shelter Request</span>
          </button>
        </div>
      </div>

      {/* Role Boundary Notice Banner */}
      <div className="ec-svc-role-notice">
        <div className="ec-svc-role-notice-icon">
          <ShieldCheck size={18} color="#0284c7" />
        </div>
        <div className="ec-svc-role-notice-text">
          <strong>Coordinator Scope (Recommend &rarr; Request &rarr; Track):</strong> The Emergency Coordinator identifies crisis requirements, evaluates shelter suitability, recommends facilities, and submits formal requests to <em>Shelter Managers</em> and <em>Volunteer Managers</em>. Shelter occupancy updates, facility maintenance, and direct volunteer assignment are managed exclusively in their respective manager portals.
        </div>
      </div>

      {/* 2. Coordination Summary KPI Cards */}
      <div className="ec-svc-kpi-grid">
        <div className="ec-svc-kpi-card" onClick={() => setActiveTab('shelters')}>
          <div className="ec-svc-kpi-header">
            <span className="ec-svc-kpi-title">Available Shelter Capacity</span>
            <div className="ec-svc-kpi-icon-wrap icon-blue">
              <Building2 size={18} />
            </div>
          </div>
          <div className="ec-svc-kpi-val">{metrics.availableShelterCapacity}</div>
          <div className="ec-svc-kpi-sub">Total available beds across active emergency shelters</div>
        </div>

        <div className="ec-svc-kpi-card" onClick={() => setActiveTab('shelter-requests')}>
          <div className="ec-svc-kpi-header">
            <span className="ec-svc-kpi-title">Active Shelter Requests</span>
            <div className="ec-svc-kpi-icon-wrap icon-amber">
              <Clock size={18} />
            </div>
          </div>
          <div className="ec-svc-kpi-val val-amber">{metrics.activeShelterRequests}</div>
          <div className="ec-svc-kpi-sub">Pending review by authorized Shelter Managers</div>
        </div>

        <div className="ec-svc-kpi-card" onClick={() => setActiveTab('volunteer-requests')}>
          <div className="ec-svc-kpi-header">
            <span className="ec-svc-kpi-title">Pending Volunteer Requests</span>
            <div className="ec-svc-kpi-icon-wrap icon-purple">
              <Users size={18} />
            </div>
          </div>
          <div className="ec-svc-kpi-val val-purple">{metrics.pendingVolunteerRequests}</div>
          <div className="ec-svc-kpi-sub">Field requirements awaiting Volunteer Manager assignment</div>
        </div>

        <div className="ec-svc-kpi-card" onClick={() => setActiveTab('history')}>
          <div className="ec-svc-kpi-header">
            <span className="ec-svc-kpi-title">Approved Requests</span>
            <div className="ec-svc-kpi-icon-wrap icon-emerald">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="ec-svc-kpi-val val-emerald">{metrics.approvedCoordinationRequests}</div>
          <div className="ec-svc-kpi-sub">Shelter &amp; volunteer placements approved by managers</div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="ec-svc-tab-nav">
        <button
          className={`ec-svc-nav-tab ${activeTab === 'shelters' ? 'active' : ''}`}
          onClick={() => setActiveTab('shelters')}
        >
          <Building2 size={15} />
          <span>Shelter Coordination</span>
          <span className="ec-svc-tab-count">{shelters.length}</span>
        </button>

        <button
          className={`ec-svc-nav-tab ${activeTab === 'shelter-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('shelter-requests')}
        >
          <Clock size={15} />
          <span>Shelter Placement Requests</span>
          <span className="ec-svc-tab-count">{shelterRequests.length}</span>
        </button>

        <button
          className={`ec-svc-nav-tab ${activeTab === 'volunteers' ? 'active' : ''}`}
          onClick={() => setActiveTab('volunteers')}
        >
          <Users size={15} />
          <span>Volunteer Coordination</span>
          <span className="ec-svc-tab-count">{volunteerRequirements.length}</span>
        </button>

        <button
          className={`ec-svc-nav-tab ${activeTab === 'volunteer-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('volunteer-requests')}
        >
          <HeartHandshake size={15} />
          <span>Volunteer Assignment Requests</span>
          <span className="ec-svc-tab-count">{volunteerRequests.length}</span>
        </button>

        <button
          className={`ec-svc-nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <FileText size={15} />
          <span>Unified Request History</span>
          <span className="ec-svc-tab-count">{unifiedHistory.length}</span>
        </button>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="ec-svc-loading-state">
          <RefreshCw size={24} className="ec-spin" />
          <p>Loading live shelter and volunteer coordination data from HumanitarianCrisisDb...</p>
        </div>
      )}

      {/* Error state indicator */}
      {!loading && error && (
        <div className="ec-svc-error-state">
          <AlertCircle size={22} color="#dc2626" />
          <div className="ec-svc-error-text">
            <strong>Connection Warning:</strong> {error}
          </div>
          <button className="ec-btn-action-secondary" onClick={() => fetchData(true)}>
            Try Again
          </button>
        </div>
      )}

      {/* TAB 1: SHELTER COORDINATION */}
      {!loading && activeTab === 'shelters' && (
        <div className="ec-svc-tab-panel">
          {/* Header Row with Recommend Shelter Action */}
          <div className="ec-svc-panel-header-row">
            <div>
              <h3 className="ec-svc-panel-title">Active Emergency Shelters</h3>
              <p className="ec-svc-panel-sub">
                Review verified capacity, accessibility infrastructure, and suitability before submitting placement requests.
              </p>
            </div>
            <button
              className="ec-btn-action-secondary ec-btn-highlight"
              onClick={() => setShowRecommendModal(true)}
            >
              <Sparkles size={14} color="#0284c7" />
              <span>Recommend Shelter for Incident</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="ec-svc-toolbar-container">
            <div className="ec-svc-filter-bar">
              <div className="ec-svc-search-box">
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search shelter by name, location, or facility..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ec-svc-search-input"
                />
                {searchQuery && (
                  <X size={14} className="ec-svc-search-clear" onClick={() => setSearchQuery('')} />
                )}
              </div>

              <div className="ec-svc-select-group">
                <select
                  className="ec-svc-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Operational Statuses</option>
                  <option value="Operational">Operational</option>
                  <option value="Near Capacity">Near Capacity</option>
                  <option value="Full">Full</option>
                  <option value="Temporarily Unavailable">Temporarily Unavailable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shelter Cards Grid */}
          <div className="ec-shelter-cards-grid">
            {filteredShelters.map((sh) => {
              const isNearCapacity = sh.status === 'Near Capacity' || sh.utilizationPercentage > 85;
              const isFull = sh.status === 'Full' || sh.remainingCapacity === 0;

              return (
                <div key={sh.id} className="ec-shelter-card">
                  <div className="ec-shelter-card-top">
                    <div>
                      <span className="ec-shelter-id-pill">{sh.shelterCode}</span>
                      <h4 className="ec-shelter-name">{sh.name}</h4>
                      <div className="ec-shelter-meta-row">
                        <MapPin size={12} className="ec-inline-icon" />
                        <span>{sh.address}</span>
                      </div>
                    </div>
                    <span className={`ec-svc-status-pill ${getStatusBadgeClass(sh.status)}`}>
                      <span className="ec-rc-status-dot"></span>
                      {sh.status}
                    </span>
                  </div>

                  {/* Occupancy Progress */}
                  <div className="ec-shelter-occupancy-block">
                    <div className="ec-shelter-occ-head">
                      <span className="ec-shelter-occ-label">Capacity Utilization</span>
                      <span className="ec-shelter-occ-nums">
                        <strong>{sh.currentOccupancy}</strong> / {sh.totalCapacity} ({sh.utilizationPercentage}%)
                      </span>
                    </div>
                    <div className="ec-shelter-bar-track">
                      <div
                        className={`ec-shelter-bar-fill ${isFull ? 'fill-red' : isNearCapacity ? 'fill-amber' : 'fill-blue'}`}
                        style={{ width: `${Math.min(100, sh.utilizationPercentage)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="ec-shelter-details-grid">
                    <div className="ec-shelter-stat-cell">
                      <span className="ec-shelter-cell-lbl">Remaining Capacity</span>
                      <span className="ec-shelter-cell-val" style={{ color: isFull ? '#dc2626' : isNearCapacity ? '#d97706' : '#0284c7' }}>
                        {sh.remainingCapacity} beds
                      </span>
                    </div>
                    <div className="ec-shelter-stat-cell">
                      <span className="ec-shelter-cell-lbl">Suitability Score</span>
                      <span className="ec-shelter-cell-val val-emerald">
                        {sh.suitabilityScore}% match
                      </span>
                    </div>
                  </div>

                  {/* Facilities and Accessibility */}
                  <div className="ec-shelter-facilities-row">
                    {sh.facilities.map((fac, idx) => (
                      <span key={idx} className="ec-facility-tag">{fac}</span>
                    ))}
                  </div>

                  <div className="ec-shelter-access-info">
                    <Accessibility size={13} color="#0284c7" />
                    <span>{sh.accessibilityInfo}</span>
                  </div>

                  <div className="ec-shelter-card-foot">
                    <button
                      className="ec-btn-shelter-suitability"
                      onClick={() => setSelectedSuitabilityShelter(sh)}
                    >
                      <Info size={13} />
                      <span>View Suitability</span>
                    </button>
                    <button
                      className="ec-btn-action-primary ec-btn-sm"
                      onClick={() => handleOpenShelterRequestModal({ shelterId: sh.id })}
                      disabled={isFull || sh.status === 'Temporarily Unavailable'}
                    >
                      <span>Request Placement</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredShelters.length === 0 && (
              <div className="ec-svc-empty-card">
                <Building2 size={32} color="#0284c7" />
                <h3>No Shelters Found</h3>
                <p>No active emergency shelters match your current search and filters in HumanitarianCrisisDb.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SHELTER PLACEMENT REQUESTS (TRACKING) */}
      {!loading && activeTab === 'shelter-requests' && (
        <div className="ec-svc-tab-panel">
          <div className="ec-svc-panel-header-row">
            <div>
              <h3 className="ec-svc-panel-title">Track Shelter Placement Requests</h3>
              <p className="ec-svc-panel-sub">
                Placement requests submitted to authorized Shelter Managers with real-time status and manager feedback.
              </p>
            </div>
            <button
              className="ec-btn-action-primary"
              onClick={() => handleOpenShelterRequestModal()}
            >
              <Plus size={15} />
              <span>Submit Placement Request</span>
            </button>
          </div>

          <div className="ec-svc-toolbar-container">
            <div className="ec-svc-filter-bar">
              <div className="ec-svc-search-box">
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search placement requests by #, shelter, incident..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ec-svc-search-input"
                />
                {searchQuery && (
                  <X size={14} className="ec-svc-search-clear" onClick={() => setSearchQuery('')} />
                )}
              </div>

              <div className="ec-svc-select-group">
                <select
                  className="ec-svc-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="More Information Required">More Information Required</option>
                </select>

                <select
                  className="ec-svc-select"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="ec-svc-table-wrapper">
            <table className="ec-svc-table">
              <thead>
                <tr>
                  <th>REQUEST #</th>
                  <th>SELECTED SHELTER</th>
                  <th>RELATED INCIDENT</th>
                  <th>PERSONS</th>
                  <th>PRIORITY</th>
                  <th>CURRENT STATUS</th>
                  <th>SHELTER MANAGER RESPONSE</th>
                  <th>SUBMITTED BY</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredShelterRequests.map((r) => (
                  <tr key={r.id}>
                    <td className="ec-svc-cell-code">{r.requestNumber}</td>
                    <td>
                      <div className="ec-svc-item-name">{r.shelterName}</div>
                      <div className="ec-svc-item-sub">{r.shelterLocation}</div>
                    </td>
                    <td>
                      <span className="ec-svc-cell-incident">{r.relatedIncident}</span>
                    </td>
                    <td>
                      <strong>{r.numberOfPersons}</strong> evacuees
                    </td>
                    <td>
                      <span className={`ec-svc-badge ${getUrgencyBadgeClass(r.priority)}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`ec-svc-status-pill ${getStatusBadgeClass(r.status)}`}>
                        <span className="ec-rc-status-dot"></span>
                        {r.status}
                      </span>
                    </td>
                    <td className="ec-svc-cell-notes">
                      {r.shelterManagerResponse || 'Pending Shelter Manager review'}
                    </td>
                    <td>
                      <div className="ec-svc-submitter">{r.submittedBy}</div>
                      <div className="ec-svc-sub-date">
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="ec-btn-table-action"
                        onClick={() => setSelectedHistoryItem({
                          requestNumber: r.requestNumber,
                          requestType: 'Shelter Placement',
                          relatedIncident: r.relatedIncident,
                          targetName: r.shelterName,
                          quantityOrCount: r.numberOfPersons,
                          priority: r.priority,
                          status: r.status,
                          submittedAt: r.submittedAt,
                          lastUpdatedAt: r.lastUpdatedAt,
                          managerResponse: r.shelterManagerResponse,
                          submittedBy: r.submittedBy,
                          details: `Special Needs: ${r.specialRequirements || 'None'} | Accessibility: ${r.accessibilityNeeds || 'None'} | Notes: ${r.coordinatorNotes || 'None'}`
                        })}
                      >
                        <span>Details</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredShelterRequests.length === 0 && (
                  <tr>
                    <td colSpan="9" className="ec-svc-empty-state">
                      No shelter placement requests match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VOLUNTEER COORDINATION */}
      {!loading && activeTab === 'volunteers' && (
        <div className="ec-svc-tab-panel">
          {/* Volunteer Availability Summary Card */}
          <div className="ec-vol-roster-summary-card">
            <div className="ec-vol-summary-top">
              <div>
                <span className="ec-breadcrumb-tiny">ROSTER AVAILABILITY OVERVIEW</span>
                <h3 className="ec-vol-summary-title">Volunteer Mobilization Status</h3>
                <p className="ec-vol-summary-sub">
                  Summarized availability by operational capability. Individual volunteer personal records remain strictly managed by the Volunteer Manager.
                </p>
              </div>
              <button
                className="ec-btn-action-primary"
                onClick={() => handleOpenVolunteerRequestModal()}
              >
                <Plus size={15} />
                <span>Create Volunteer Requirement</span>
              </button>
            </div>

            <div className="ec-vol-stats-bar">
              <div className="ec-vol-stat-item">
                <span className="ec-vol-stat-lbl">Registered Volunteers</span>
                <strong className="ec-vol-stat-val">{volunteerSummary.totalRegisteredVolunteers}</strong>
              </div>
              <div className="ec-vol-stat-item">
                <span className="ec-vol-stat-lbl">Currently Available</span>
                <strong className="ec-vol-stat-val val-emerald">{volunteerSummary.availableVolunteers}</strong>
              </div>
              <div className="ec-vol-stat-item">
                <span className="ec-vol-stat-lbl">Active on Field Tasks</span>
                <strong className="ec-vol-stat-val val-purple">{volunteerSummary.onAssignmentVolunteers}</strong>
              </div>
            </div>

            {/* Skill Breakdown Pills */}
            <div className="ec-vol-skills-wrap">
              <span className="ec-vol-skills-title">Active Capabilities:</span>
              <div className="ec-vol-skills-list">
                {volunteerSummary.topSkills.map((sk, idx) => (
                  <div key={idx} className="ec-vol-skill-badge">
                    <span>{sk.skill}</span>
                    <strong>{sk.count} ready</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Field Volunteer Requirements */}
          <div className="ec-svc-panel-header-row" style={{ marginTop: '24px' }}>
            <div>
              <h3 className="ec-svc-panel-title">Active Crisis Volunteer Requirements</h3>
              <p className="ec-svc-panel-sub">
                Field volunteer needs identified from active incident response sectors.
              </p>
            </div>
          </div>

          <div className="ec-vol-req-grid">
            {volunteerRequirements.map((vr) => (
              <div key={vr.id} className="ec-vol-req-card">
                <div className="ec-vol-req-top">
                  <span className="ec-vol-req-id">{vr.id} &bull; {vr.relatedIncident}</span>
                  <span className={`ec-svc-badge ${getUrgencyBadgeClass(vr.priority)}`}>
                    {vr.priority}
                  </span>
                </div>

                <h4 className="ec-vol-req-title">{vr.taskDescription}</h4>

                <div className="ec-vol-req-meta">
                  <div className="ec-vol-req-metric">
                    <span className="ec-vol-req-lbl">Volunteers Needed</span>
                    <strong className="ec-vol-req-val">{vr.requiredVolunteers} field responders</strong>
                  </div>
                  <div className="ec-vol-req-metric">
                    <span className="ec-vol-req-lbl">Operational Area</span>
                    <strong className="ec-vol-req-val">{vr.location}</strong>
                  </div>
                </div>

                <div className="ec-vol-req-skills">
                  <span className="ec-vol-req-lbl">Required Capabilities:</span>
                  <p>{vr.requiredSkills}</p>
                </div>

                <div className="ec-vol-req-foot">
                  <button
                    className="ec-btn-action-primary ec-btn-sm"
                    onClick={() => handleOpenVolunteerRequestModal({
                      relatedIncident: vr.relatedIncident,
                      requiredVolunteerCount: vr.requiredVolunteers,
                      requiredSkills: vr.RequiredSkills || vr.requiredSkills,
                      location: vr.location,
                      priority: vr.priority,
                      taskDescription: vr.taskDescription
                    })}
                  >
                    <span>Request from Volunteer Manager</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VOLUNTEER ASSIGNMENT REQUESTS (TRACKING) */}
      {!loading && activeTab === 'volunteer-requests' && (
        <div className="ec-svc-tab-panel">
          <div className="ec-svc-panel-header-row">
            <div>
              <h3 className="ec-svc-panel-title">Track Volunteer Assignment Requests</h3>
              <p className="ec-svc-panel-sub">
                Task requirements submitted to the Volunteer Manager for individual roster selection and deployment.
              </p>
            </div>
            <button
              className="ec-btn-action-primary"
              onClick={() => handleOpenVolunteerRequestModal()}
            >
              <Plus size={15} />
              <span>Create Volunteer Requirement</span>
            </button>
          </div>

          <div className="ec-svc-toolbar-container">
            <div className="ec-svc-filter-bar">
              <div className="ec-svc-search-box">
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search volunteer requests by #, task, incident..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ec-svc-search-input"
                />
                {searchQuery && (
                  <X size={14} className="ec-svc-search-clear" onClick={() => setSearchQuery('')} />
                )}
              </div>

              <div className="ec-svc-select-group">
                <select
                  className="ec-svc-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Partially Fulfilled">Partially Fulfilled</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="ec-svc-table-wrapper">
            <table className="ec-svc-table">
              <thead>
                <tr>
                  <th>REQUEST #</th>
                  <th>TASK DESCRIPTION &amp; LOCATION</th>
                  <th>INCIDENT</th>
                  <th>REQUIRED</th>
                  <th>ASSIGNED</th>
                  <th>SKILLS NEEDED</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th>VOLUNTEER MANAGER RESPONSE</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteerRequests.map((r) => (
                  <tr key={r.id}>
                    <td className="ec-svc-cell-code">{r.requestNumber}</td>
                    <td>
                      <div className="ec-svc-item-name">{r.taskDescription}</div>
                      <div className="ec-svc-item-sub">
                        <MapPin size={11} className="ec-inline-icon" />
                        <span>{r.location}</span>
                      </div>
                    </td>
                    <td>
                      <span className="ec-svc-cell-incident">{r.relatedIncident}</span>
                    </td>
                    <td>
                      <strong>{r.requiredVolunteerCount}</strong> vols
                    </td>
                    <td>
                      {r.approvedOrAssignedCount > 0 ? (
                        <strong className="val-emerald">{r.approvedOrAssignedCount} assigned</strong>
                      ) : (
                        <span className="ec-rc-subdued">Pending match</span>
                      )}
                    </td>
                    <td className="ec-svc-cell-skills">{r.requiredSkills}</td>
                    <td>
                      <span className={`ec-svc-badge ${getUrgencyBadgeClass(r.priority)}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`ec-svc-status-pill ${getStatusBadgeClass(r.status)}`}>
                        <span className="ec-rc-status-dot"></span>
                        {r.status}
                      </span>
                    </td>
                    <td className="ec-svc-cell-notes">
                      {r.volunteerManagerResponse || 'Pending assignment by Volunteer Manager'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="ec-btn-table-action"
                        onClick={() => setSelectedHistoryItem({
                          requestNumber: r.requestNumber,
                          requestType: 'Volunteer Assignment',
                          relatedIncident: r.relatedIncident,
                          targetName: r.taskDescription,
                          quantityOrCount: r.requiredVolunteerCount,
                          priority: r.priority,
                          status: r.status,
                          submittedAt: r.submittedAt,
                          lastUpdatedAt: r.lastUpdatedAt,
                          managerResponse: r.volunteerManagerResponse,
                          submittedBy: r.submittedBy,
                          details: `Location: ${r.location} | Skills: ${r.requiredSkills} | Extra: ${r.additionalInstructions || 'None'}`
                        })}
                      >
                        <span>Details</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredVolunteerRequests.length === 0 && (
                  <tr>
                    <td colSpan="10" className="ec-svc-empty-state">
                      No volunteer assignment requests submitted yet. Use "+ Create Volunteer Requirement" to request volunteers from the Volunteer Manager.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: UNIFIED REQUEST HISTORY */}
      {!loading && activeTab === 'history' && (
        <div className="ec-svc-tab-panel">
          <div className="ec-svc-panel-header-row">
            <div>
              <h3 className="ec-svc-panel-title">Unified Coordination Request History</h3>
              <p className="ec-svc-panel-sub">
                Consolidated audit trail of shelter placement requests and volunteer assignment requests submitted by coordinators in HumanitarianCrisisDb.
              </p>
            </div>
          </div>

          <div className="ec-svc-toolbar-container">
            <div className="ec-svc-filter-bar">
              <div className="ec-svc-search-box">
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search by request #, incident, target, or submitter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ec-svc-search-input"
                />
                {searchQuery && (
                  <X size={14} className="ec-svc-search-clear" onClick={() => setSearchQuery('')} />
                )}
              </div>

              <div className="ec-svc-select-group">
                <select
                  className="ec-svc-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Request Types</option>
                  <option value="Shelter">Shelter Placement</option>
                  <option value="Volunteer">Volunteer Assignment</option>
                </select>

                <select
                  className="ec-svc-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="More Information Required">More Information Required</option>
                </select>
              </div>
            </div>
          </div>

          <div className="ec-svc-table-wrapper">
            <table className="ec-svc-table">
              <thead>
                <tr>
                  <th>REQUEST ID</th>
                  <th>TYPE</th>
                  <th>RELATED INCIDENT</th>
                  <th>TARGET / REQUIREMENT</th>
                  <th>COUNT</th>
                  <th>PRIORITY</th>
                  <th>CURRENT STATUS</th>
                  <th>MANAGER FEEDBACK</th>
                  <th>SUBMITTED</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="ec-svc-cell-code">{item.requestNumber}</td>
                    <td>
                      <span className={`ec-svc-type-pill ${item.requestType.includes('Shelter') ? 'pill-type-shelter' : 'pill-type-vol'}`}>
                        {item.requestType.includes('Shelter') ? <Building2 size={12} /> : <Users size={12} />}
                        <span>{item.requestType}</span>
                      </span>
                    </td>
                    <td>
                      <span className="ec-svc-cell-incident">{item.relatedIncident}</span>
                    </td>
                    <td className="ec-svc-cell-target">
                      <div className="ec-svc-target-title">{item.targetName}</div>
                    </td>
                    <td>
                      <strong>{item.quantityOrCount}</strong> {item.requestType.includes('Shelter') ? 'persons' : 'volunteers'}
                    </td>
                    <td>
                      <span className={`ec-svc-badge ${getUrgencyBadgeClass(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`ec-svc-status-pill ${getStatusBadgeClass(item.status)}`}>
                        <span className="ec-rc-status-dot"></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="ec-svc-cell-notes">
                      {item.managerResponse || 'Under review'}
                    </td>
                    <td>
                      <div className="ec-svc-sub-date">
                        {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="ec-btn-table-action"
                        onClick={() => setSelectedHistoryItem(item)}
                      >
                        <span>Details</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan="10" className="ec-svc-empty-state">
                      No coordination requests match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW SUITABILITY MODAL */}
      {selectedSuitabilityShelter && (
        <div className="ec-modal-overlay" onClick={() => setSelectedSuitabilityShelter(null)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">SHELTER CAPACITY &amp; SUITABILITY EVALUATION</span>
                <h3 className="ec-modal-title">{selectedSuitabilityShelter.name}</h3>
              </div>
              <button
                className="ec-modal-close-btn"
                onClick={() => setSelectedSuitabilityShelter(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ec-modal-body-pad">
              <div className="ec-suitability-hud">
                <div className="ec-hud-pill">
                  <span>Location:</span>
                  <strong>{selectedSuitabilityShelter.address}</strong>
                </div>
                <div className="ec-hud-pill">
                  <span>Available Beds:</span>
                  <strong>{selectedSuitabilityShelter.remainingCapacity} / {selectedSuitabilityShelter.totalCapacity}</strong>
                </div>
                <div className="ec-hud-pill">
                  <span>Operational Status:</span>
                  <strong style={{ color: selectedSuitabilityShelter.status === 'Operational' ? '#16a34a' : '#d97706' }}>
                    {selectedSuitabilityShelter.status}
                  </strong>
                </div>
              </div>

              <div className="ec-suitability-factors">
                <h4 className="ec-suitability-title">Facility Readiness &amp; Suitability Attributes</h4>
                {selectedSuitabilityShelter.suitabilityReasons.map((reason, idx) => (
                  <div key={idx} className="ec-factor-row">
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              <div className="ec-suitability-access-box">
                <Accessibility size={16} color="#0284c7" />
                <div>
                  <strong>Accessibility Infrastructure:</strong>
                  <p>{selectedSuitabilityShelter.accessibilityInfo}</p>
                </div>
              </div>
            </div>

            <div className="ec-modal-footer">
              <button
                type="button"
                className="ec-btn-modal-cancel"
                onClick={() => setSelectedSuitabilityShelter(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="ec-btn-action-primary"
                onClick={() => handleOpenShelterRequestModal({ shelterId: selectedSuitabilityShelter.id })}
                disabled={selectedSuitabilityShelter.remainingCapacity === 0 || selectedSuitabilityShelter.status === 'Temporarily Unavailable'}
              >
                <CheckCircle2 size={15} />
                <span>Proceed to Placement Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RECOMMEND SHELTER DRAWER / MODAL */}
      {showRecommendModal && (
        <div className="ec-modal-overlay" onClick={() => setShowRecommendModal(false)}>
          <div className="ec-modal-dialog ec-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">DECISION SUPPORT RECOMMENDATIONS</span>
                <h3 className="ec-modal-title">Recommended Shelters for Active Incidents</h3>
              </div>
              <button
                className="ec-modal-close-btn"
                onClick={() => setShowRecommendModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ec-modal-body-pad">
              <p className="ec-rec-explainer">
                Shelter recommendations are automatically evaluated based on reported evacuee counts, accessibility requirements (e.g. mobility constraints), and operational capacity in HumanitarianCrisisDb.
              </p>

              <div className="ec-rec-cards-list">
                {shelterRecommendations.map((rec, idx) => (
                  <div key={idx} className="ec-rec-card-item">
                    <div className="ec-rec-item-header">
                      <div>
                        <span className="ec-rec-item-case">{rec.incidentCaseNumber}</span>
                        <h4 className="ec-rec-item-name">{rec.shelterName}</h4>
                        <div className="ec-rec-item-loc">
                          <MapPin size={12} className="ec-inline-icon" />
                          <span>{rec.location}</span>
                        </div>
                      </div>
                      <div className="ec-rec-match-badge">
                        <span>{rec.matchScore}% Match</span>
                      </div>
                    </div>

                    <p className="ec-rec-item-rationale">{rec.recommendationRationale}</p>

                    <div className="ec-rec-item-footer">
                      <div className="ec-rec-item-stat">
                        <span>Available Beds: <strong>{rec.remainingCapacity}</strong></span>
                        <span className="ec-dot-sep">&bull;</span>
                        <span>Needed: <strong>{rec.peopleNeedingPlacement}</strong></span>
                      </div>
                      <button
                        className="ec-btn-action-primary ec-btn-sm"
                        onClick={() => handleOpenShelterRequestModal({
                          shelterId: rec.shelterId,
                          relatedIncident: rec.incidentCaseNumber,
                          numberOfPersons: rec.peopleNeedingPlacement
                        })}
                      >
                        <span>Select &amp; Request Placement</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {shelterRecommendations.length === 0 && (
                  <div className="ec-svc-empty-card">
                    <Sparkles size={28} color="#0284c7" />
                    <h3>No Active Shelter Recommendations</h3>
                    <p>All active incident evacuees currently have recommended or assigned placements.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="ec-modal-footer">
              <button
                type="button"
                className="ec-btn-modal-cancel"
                onClick={() => setShowRecommendModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SUBMIT SHELTER PLACEMENT REQUEST MODAL */}
      {showShelterRequestModal && (
        <div className="ec-modal-overlay" onClick={() => setShowShelterRequestModal(false)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">COORDINATION TO SHELTER MANAGER</span>
                <h3 className="ec-modal-title">Submit Shelter Placement Request</h3>
              </div>
              <button
                className="ec-modal-close-btn"
                onClick={() => setShowShelterRequestModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitShelterRequest} className="ec-modal-form">
              <div className="ec-svc-modal-notice">
                <Info size={15} color="#0284c7" />
                <span>
                  This request will be sent to the <strong>Shelter Manager</strong> for formal bed reservation and intake verification.
                </span>
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Target Shelter *</label>
                <select
                  className="ec-form-select"
                  value={shelterForm.shelterId}
                  onChange={(e) => setShelterForm({ ...shelterForm, shelterId: e.target.value })}
                  required
                >
                  <option value="">Select a shelter...</option>
                  {shelters.map((s) => (
                    <option key={s.id} value={s.id} disabled={s.status === 'Full' || s.status === 'Temporarily Unavailable'}>
                      {s.name} ({s.remainingCapacity} beds available - {s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="ec-form-row">
                <div className="ec-form-field">
                  <label className="ec-field-label">Related Incident / Case *</label>
                  <input
                    type="text"
                    className="ec-form-input"
                    placeholder="e.g. HMR-1042"
                    required
                    value={shelterForm.relatedIncident}
                    onChange={(e) => setShelterForm({ ...shelterForm, relatedIncident: e.target.value })}
                  />
                </div>

                <div className="ec-form-field">
                  <label className="ec-field-label">Number of People Requiring Placement *</label>
                  <input
                    type="number"
                    min="1"
                    className="ec-form-input"
                    placeholder="e.g. 6"
                    required
                    value={shelterForm.numberOfPersons}
                    onChange={(e) => setShelterForm({ ...shelterForm, numberOfPersons: e.target.value })}
                  />
                </div>
              </div>

              <div className="ec-form-row">
                <div className="ec-form-field">
                  <label className="ec-field-label">Priority Level *</label>
                  <select
                    className="ec-form-select"
                    value={shelterForm.priority}
                    onChange={(e) => setShelterForm({ ...shelterForm, priority: e.target.value })}
                  >
                    <option value="Critical">Critical (Immediate placement)</option>
                    <option value="High">High (Within 4 hours)</option>
                    <option value="Medium">Medium (Within 12 hours)</option>
                    <option value="Low">Low (Scheduled transfer)</option>
                  </select>
                </div>

                <div className="ec-form-field">
                  <label className="ec-field-label">Accessibility Needs</label>
                  <input
                    type="text"
                    className="ec-form-input"
                    placeholder="e.g. Older adult with limited mobility, wheelchair"
                    value={shelterForm.accessibilityNeeds}
                    onChange={(e) => setShelterForm({ ...shelterForm, accessibilityNeeds: e.target.value })}
                  />
                </div>
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Special Requirements (Medical, Dietary, Infant)</label>
                <input
                  type="text"
                  className="ec-form-input"
                  placeholder="e.g. Refrigerated insulin storage, infant formula"
                  value={shelterForm.specialRequirements}
                  onChange={(e) => setShelterForm({ ...shelterForm, specialRequirements: e.target.value })}
                />
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Coordinator Notes &amp; Rationale</label>
                <textarea
                  className="ec-form-textarea"
                  rows="3"
                  placeholder="Operational context, evacuation point, contact details of escort team..."
                  value={shelterForm.coordinatorNotes}
                  onChange={(e) => setShelterForm({ ...shelterForm, coordinatorNotes: e.target.value })}
                ></textarea>
              </div>

              <div className="ec-modal-footer">
                <button
                  type="button"
                  className="ec-btn-modal-cancel"
                  onClick={() => setShowShelterRequestModal(false)}
                  disabled={isSubmittingShelter}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ec-btn-action-primary"
                  disabled={isSubmittingShelter}
                >
                  {isSubmittingShelter ? (
                    <>
                      <RefreshCw size={14} className="ec-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Submit to Shelter Manager</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SUBMIT VOLUNTEER ASSIGNMENT REQUEST MODAL */}
      {showVolunteerRequestModal && (
        <div className="ec-modal-overlay" onClick={() => setShowVolunteerRequestModal(false)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">COORDINATION TO VOLUNTEER MANAGER</span>
                <h3 className="ec-modal-title">Create Volunteer Assignment Request</h3>
              </div>
              <button
                className="ec-modal-close-btn"
                onClick={() => setShowVolunteerRequestModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitVolunteerRequest} className="ec-modal-form">
              <div className="ec-svc-modal-notice">
                <Info size={15} color="#0284c7" />
                <span>
                  This requirement will be submitted to the <strong>Volunteer Manager</strong> to select certified volunteers and dispatch teams.
                </span>
              </div>

              <div className="ec-form-row">
                <div className="ec-form-field">
                  <label className="ec-field-label">Related Incident / Case *</label>
                  <input
                    type="text"
                    className="ec-form-input"
                    placeholder="e.g. HMR-1042"
                    required
                    value={volunteerForm.relatedIncident}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, relatedIncident: e.target.value })}
                  />
                </div>

                <div className="ec-form-field">
                  <label className="ec-field-label">Required Volunteer Count *</label>
                  <input
                    type="number"
                    min="1"
                    className="ec-form-input"
                    placeholder="e.g. 4"
                    required
                    value={volunteerForm.requiredVolunteerCount}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, requiredVolunteerCount: e.target.value })}
                  />
                </div>
              </div>

              <div className="ec-form-row">
                <div className="ec-form-field">
                  <label className="ec-field-label">Required Capabilities &amp; Skills *</label>
                  <input
                    type="text"
                    className="ec-form-input"
                    placeholder="e.g. First Aid, Water Rescue, Driving"
                    required
                    value={volunteerForm.requiredSkills}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, requiredSkills: e.target.value })}
                  />
                </div>

                <div className="ec-form-field">
                  <label className="ec-field-label">Deployment Location *</label>
                  <input
                    type="text"
                    className="ec-form-input"
                    placeholder="e.g. Kelani East Zone 03"
                    required
                    value={volunteerForm.location}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="ec-form-row">
                <div className="ec-form-field">
                  <label className="ec-field-label">Priority Level *</label>
                  <select
                    className="ec-form-select"
                    value={volunteerForm.priority}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, priority: e.target.value })}
                  >
                    <option value="Critical">Critical (Immediate field dispatch)</option>
                    <option value="High">High (Within 2 hours)</option>
                    <option value="Medium">Medium (Within 6 hours)</option>
                    <option value="Low">Low (Scheduled shift)</option>
                  </select>
                </div>

                <div className="ec-form-field">
                  <label className="ec-field-label">Deployment Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    className="ec-form-input"
                    value={volunteerForm.requiredDate}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, requiredDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Task Description *</label>
                <input
                  type="text"
                  className="ec-form-input"
                  placeholder="e.g. Assist boat rescue teams and trauma triage"
                  required
                  value={volunteerForm.taskDescription}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, taskDescription: e.target.value })}
                />
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Special Field Instructions &amp; Gear</label>
                <textarea
                  className="ec-form-textarea"
                  rows="3"
                  placeholder="Staging location, PPE gear requirements, rendezvous officer contact..."
                  value={volunteerForm.additionalInstructions}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, additionalInstructions: e.target.value })}
                ></textarea>
              </div>

              <div className="ec-modal-footer">
                <button
                  type="button"
                  className="ec-btn-modal-cancel"
                  onClick={() => setShowVolunteerRequestModal(false)}
                  disabled={isSubmittingVolunteer}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ec-btn-action-primary"
                  disabled={isSubmittingVolunteer}
                >
                  {isSubmittingVolunteer ? (
                    <>
                      <RefreshCw size={14} className="ec-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Submit to Volunteer Manager</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: REQUEST DETAILS MODAL */}
      {selectedHistoryItem && (
        <div className="ec-modal-overlay" onClick={() => setSelectedHistoryItem(null)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">{selectedHistoryItem.requestType.toUpperCase()} DETAILS</span>
                <h3 className="ec-modal-title">{selectedHistoryItem.requestNumber}</h3>
              </div>
              <button
                className="ec-modal-close-btn"
                onClick={() => setSelectedHistoryItem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ec-modal-body-pad">
              <div className="ec-suitability-hud">
                <div className="ec-hud-pill">
                  <span>Incident:</span>
                  <strong>{selectedHistoryItem.relatedIncident}</strong>
                </div>
                <div className="ec-hud-pill">
                  <span>Priority:</span>
                  <strong className={selectedHistoryItem.priority === 'Critical' ? 'val-danger' : 'val-amber'}>
                    {selectedHistoryItem.priority}
                  </strong>
                </div>
                <div className="ec-hud-pill">
                  <span>Status:</span>
                  <strong>{selectedHistoryItem.status}</strong>
                </div>
              </div>

              <div className="ec-detail-section">
                <span className="ec-field-label">Target / Requirement:</span>
                <p className="ec-detail-text">{selectedHistoryItem.targetName}</p>
              </div>

              <div className="ec-detail-section">
                <span className="ec-field-label">Manager Feedback &amp; Response:</span>
                <p className="ec-detail-text ec-detail-highlight">
                  {selectedHistoryItem.managerResponse || 'Awaiting formal review by authorized manager.'}
                </p>
              </div>

              {selectedHistoryItem.details && (
                <div className="ec-detail-section">
                  <span className="ec-field-label">Operational Notes &amp; Specifications:</span>
                  <p className="ec-detail-text">{selectedHistoryItem.details}</p>
                </div>
              )}

              <div className="ec-detail-meta-row">
                <span>Submitted by: <strong>{selectedHistoryItem.submittedBy}</strong></span>
                <span className="ec-dot-sep">&bull;</span>
                <span>Date: <strong>{selectedHistoryItem.submittedAt ? new Date(selectedHistoryItem.submittedAt).toLocaleString() : 'Recent'}</strong></span>
              </div>
            </div>

            <div className="ec-modal-footer">
              <button
                type="button"
                className="ec-btn-modal-cancel"
                onClick={() => setSelectedHistoryItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterVolunteerCoordinationView;

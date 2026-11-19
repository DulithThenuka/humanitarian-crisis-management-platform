import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  Droplet,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Send,
  PackageCheck,
  TrendingUp,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileText,
  Filter,
  Boxes,
  Truck,
  Info,
  ExternalLink,
  ChevronRight,
  MapPin,
  Calendar,
  UserCheck
} from 'lucide-react';
import coordinatorService from '../../../services/coordinatorService';
import './ResourceCoordinationView.css';

export const ResourceCoordinationView = ({
  cases = [],
  coordinatorUser,
  showToast,
  onNavigateTab
}) => {
  // Tab state: 'requirements' | 'shortages' | 'tracking' | 'recommendations' | 'history'
  const [activeTab, setActiveTab] = useState('requirements');

  // Loading & error state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Core data states
  const [metrics, setMetrics] = useState({
    totalActiveRequirements: 0,
    criticalShortagesCount: 0,
    pendingAllocationRequests: 0,
    approvedAllocations: 0
  });
  const [requirements, setRequirements] = useState([]);
  const [shortages, setShortages] = useState([]);
  const [allocationRequests, setAllocationRequests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalForm, setModalForm] = useState({
    category: 'Water',
    resourceName: 'Clean Drinking Water Bottles (500ml)',
    requestedQuantity: 100,
    destination: 'Kelani East Zone 03',
    urgency: 'High',
    relatedRecord: '',
    relatedAssistanceRequestId: null,
    justification: ''
  });

  // Fetch real backend data
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await coordinatorService.getResourceCoordination();
      if (res) {
        if (res.metrics) setMetrics(res.metrics);
        if (Array.isArray(res.requirements)) setRequirements(res.requirements);
        if (Array.isArray(res.shortages)) setShortages(res.shortages);
        if (Array.isArray(res.allocationRequests)) setAllocationRequests(res.allocationRequests);
        if (Array.isArray(res.recommendations)) setRecommendations(res.recommendations);
        if (Array.isArray(res.history)) setHistory(res.history);
      }
    } catch (err) {
      console.error('Failed to load resource coordination data:', err);
      setError('Unable to load live resource coordination data. Please retry.');
      if (showToast) {
        showToast('Failed to load resource data from server.', 'error');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open modal with prefilled data
  const handleOpenModal = (prefill = {}) => {
    const defaultCase = cases && cases.length > 0 ? cases[0] : null;
    setModalForm({
      category: prefill.category || 'Water',
      resourceName: prefill.resourceName || (prefill.category ? `${prefill.category} Supplies` : 'Clean Drinking Water Bottles (500ml)'),
      requestedQuantity: prefill.requestedQuantity || 100,
      destination: prefill.destination || (defaultCase?.address || 'Kelani East Zone 03'),
      urgency: prefill.urgency || (defaultCase?.priority || 'High'),
      relatedRecord: prefill.relatedRecord || (defaultCase?.id || defaultCase?.caseNumber || ''),
      relatedAssistanceRequestId: prefill.relatedAssistanceRequestId || null,
      justification: prefill.justification || ''
    });
    setShowSubmitModal(true);
  };

  // Submit allocation request
  const handleSubmitAllocation = async (e) => {
    e.preventDefault();

    if (!modalForm.category.trim()) {
      showToast && showToast('Please select a resource category.', 'error');
      return;
    }
    if (!modalForm.destination.trim()) {
      showToast && showToast('Please specify a destination sector.', 'error');
      return;
    }
    if (!modalForm.requestedQuantity || Number(modalForm.requestedQuantity) <= 0) {
      showToast && showToast('Please enter a valid requested quantity greater than 0.', 'error');
      return;
    }
    if (!modalForm.justification.trim()) {
      showToast && showToast('Operational justification is required for allocation requests.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        category: modalForm.category,
        resourceName: modalForm.resourceName,
        requestedQuantity: parseInt(modalForm.requestedQuantity, 10),
        destination: modalForm.destination,
        urgency: modalForm.urgency,
        relatedRecord: modalForm.relatedRecord || null,
        relatedAssistanceRequestId: modalForm.relatedAssistanceRequestId || null,
        justification: modalForm.justification
      };

      const result = await coordinatorService.submitResourceAllocationRequest(payload);
      if (result) {
        showToast && showToast(`Allocation request submitted successfully for ${modalForm.requestedQuantity} units of ${modalForm.resourceName}!`, 'success');
        setShowSubmitModal(false);
        // Refresh data to reflect real backend state
        await fetchData(true);
        // Switch to tracking tab so coordinator can see the submitted request
        setActiveTab('tracking');
      }
    } catch (err) {
      console.error('Error submitting allocation request:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit allocation request.';
      showToast && showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Requirements
  const filteredRequirements = useMemo(() => {
    return requirements.filter(req => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        req.category?.toLowerCase().includes(q) ||
        req.resourceName?.toLowerCase().includes(q) ||
        req.destination?.toLowerCase().includes(q) ||
        req.relatedRecord?.toLowerCase().includes(q) ||
        req.id?.toLowerCase().includes(q);

      const matchCategory = categoryFilter === 'all' || req.category?.toLowerCase() === categoryFilter.toLowerCase();
      const matchUrgency = urgencyFilter === 'all' || req.urgency?.toLowerCase() === urgencyFilter.toLowerCase();

      return matchSearch && matchCategory && matchUrgency;
    });
  }, [requirements, searchQuery, categoryFilter, urgencyFilter]);

  // Filtered Shortages
  const filteredShortages = useMemo(() => {
    return shortages.filter(sht => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        sht.category?.toLowerCase().includes(q) ||
        sht.resourceName?.toLowerCase().includes(q) ||
        sht.location?.toLowerCase().includes(q) ||
        (Array.isArray(sht.affectedRequests) && sht.affectedRequests.some(r => r.toLowerCase().includes(q)));

      const matchCategory = categoryFilter === 'all' || sht.category?.toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [shortages, searchQuery, categoryFilter]);

  // Filtered Allocation Requests
  const filteredAllocations = useMemo(() => {
    return allocationRequests.filter(req => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        req.requestNumber?.toLowerCase().includes(q) ||
        req.resourceName?.toLowerCase().includes(q) ||
        req.category?.toLowerCase().includes(q) ||
        req.destination?.toLowerCase().includes(q) ||
        req.relatedRecord?.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || req.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [allocationRequests, searchQuery, statusFilter]);

  // Helper for status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'fulfilled':
        return 'pill-approved';
      case 'rejected':
      case 'critical':
      case 'shortage':
        return 'pill-shortage';
      case 'dispatched':
      case 'partially allocated':
      case 'under review':
        return 'pill-dispatched';
      case 'submitted':
      case 'pending allocation':
      default:
        return 'pill-requested';
    }
  };

  const getUrgencyBadgeClass = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
        return 'ec-rc-badge-critical';
      case 'high':
        return 'ec-rc-badge-high';
      case 'medium':
        return 'ec-rc-badge-medium';
      case 'low':
      default:
        return 'ec-rc-badge-low';
    }
  };

  return (
    <div className="ec-portal-canvas">
      {/* 1. Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">
            HUMANAID PLATFORM &bull; CRISIS LOGISTICS &bull; EMERGENCY COORDINATOR
          </span>
          <h2 className="ec-review-main-title">Resource Coordination</h2>
          <p className="ec-review-sub-meta">
            Coordinate crisis requirements, identify warehouse shortages, submit allocation requests to Resource Managers, and track fulfillment status.
          </p>
        </div>
        <div className="ec-rc-header-actions">
          <button
            className="ec-btn-action-secondary"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            title="Refresh resource coordination data from live server"
          >
            <RefreshCw size={14} className={refreshing ? 'ec-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            className="ec-btn-action-primary"
            onClick={() => handleOpenModal()}
          >
            <Plus size={15} />
            <span>Submit Allocation Request</span>
          </button>
        </div>
      </div>

      {/* Role Boundary Notice Banner */}
      <div className="ec-rc-role-notice">
        <div className="ec-rc-role-notice-icon">
          <ShieldCheck size={18} color="#3d6b4f" />
        </div>
        <div className="ec-rc-role-notice-text">
          <strong>Coordinator Scope:</strong> Identify field requirements, flag warehouse shortages, and submit allocation requests to Resource Managers. Warehouse stock maintenance, physical delivery dispatch, depot transfers, and inventory adjustments are managed exclusively in the <em>Resource Manager portal</em>.
        </div>
      </div>

      {/* 2. KPI Metric Cards Strip */}
      <div className="ec-rc-kpi-grid">
        <div className="ec-rc-kpi-card" onClick={() => setActiveTab('requirements')}>
          <div className="ec-rc-kpi-header">
            <span className="ec-rc-kpi-title">Active Requirements</span>
            <div className="ec-rc-kpi-icon-wrap icon-blue">
              <Layers size={18} />
            </div>
          </div>
          <div className="ec-rc-kpi-val">{metrics.totalActiveRequirements || requirements.length}</div>
          <div className="ec-rc-kpi-sub">Field needs from active crisis incidents</div>
        </div>

        <div className="ec-rc-kpi-card alert-card" onClick={() => setActiveTab('shortages')}>
          <div className="ec-rc-kpi-header">
            <span className="ec-rc-kpi-title">Warehouse Shortages</span>
            <div className="ec-rc-kpi-icon-wrap icon-red">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="ec-rc-kpi-val val-danger">{metrics.criticalShortagesCount || shortages.length}</div>
          <div className="ec-rc-kpi-sub">Items where required quantity exceeds stock</div>
        </div>

        <div className="ec-rc-kpi-card" onClick={() => setActiveTab('tracking')}>
          <div className="ec-rc-kpi-header">
            <span className="ec-rc-kpi-title">Pending Requests</span>
            <div className="ec-rc-kpi-icon-wrap icon-amber">
              <Clock size={18} />
            </div>
          </div>
          <div className="ec-rc-kpi-val val-amber">{metrics.pendingAllocationRequests}</div>
          <div className="ec-rc-kpi-sub">Awaiting Resource Manager review</div>
        </div>

        <div className="ec-rc-kpi-card" onClick={() => setActiveTab('tracking')}>
          <div className="ec-rc-kpi-header">
            <span className="ec-rc-kpi-title">Approved Allocations</span>
            <div className="ec-rc-kpi-icon-wrap icon-emerald">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="ec-rc-kpi-val val-emerald">{metrics.approvedAllocations}</div>
          <div className="ec-rc-kpi-sub">Approved by Resource Managers</div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="ec-rc-tab-nav">
        <button
          className={`ec-rc-nav-tab ${activeTab === 'requirements' ? 'active' : ''}`}
          onClick={() => setActiveTab('requirements')}
        >
          <Layers size={15} />
          <span>Field Requirements</span>
          <span className="ec-rc-tab-count">{requirements.length}</span>
        </button>

        <button
          className={`ec-rc-nav-tab ${activeTab === 'shortages' ? 'active' : ''}`}
          onClick={() => setActiveTab('shortages')}
        >
          <AlertTriangle size={15} />
          <span>Warehouse Shortages</span>
          {shortages.length > 0 && (
            <span className="ec-rc-tab-count alert-count">{shortages.length}</span>
          )}
        </button>

        <button
          className={`ec-rc-nav-tab ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          <Clock size={15} />
          <span>Allocation Request Tracking</span>
          <span className="ec-rc-tab-count">{allocationRequests.length}</span>
        </button>

        <button
          className={`ec-rc-nav-tab ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <TrendingUp size={15} />
          <span>Recommendations</span>
          <span className="ec-rc-tab-count">{recommendations.length}</span>
        </button>

        <button
          className={`ec-rc-nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <FileText size={15} />
          <span>Coordination History</span>
          <span className="ec-rc-tab-count">{history.length}</span>
        </button>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="ec-rc-loading-state">
          <RefreshCw size={24} className="ec-spin" />
          <p>Loading resource coordination data from HumanitarianCrisisDb...</p>
        </div>
      )}

      {/* Error state indicator */}
      {!loading && error && (
        <div className="ec-rc-error-state">
          <AlertCircle size={22} color="#dc2626" />
          <div className="ec-rc-error-text">
            <strong>Connection Warning:</strong> {error}
          </div>
          <button className="ec-btn-action-secondary" onClick={() => fetchData(true)}>
            Try Again
          </button>
        </div>
      )}

      {/* TAB 1: FIELD REQUIREMENTS */}
      {!loading && activeTab === 'requirements' && (
        <div className="ec-rc-tab-panel">
          {/* Toolbar */}
          <div className="ec-rc-toolbar-container">
            <div className="ec-rc-filter-bar">
              <div className="ec-rc-search-box">
                <Search size={15} color="#8a9480" />
                <input
                  type="text"
                  placeholder="Search requirement by category, item, destination, or case reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ec-rc-search-input"
                />
                {searchQuery && (
                  <X size={14} className="ec-rc-search-clear" onClick={() => setSearchQuery('')} />
                )}
              </div>

              <div className="ec-rc-select-group">
                <select
                  className="ec-rc-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All categories</option>
                  <option value="Water">Water</option>
                  <option value="Food">Food</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Shelter">Shelter</option>
                  <option value="Equipment">Equipment</option>
                </select>

                <select
                  className="ec-rc-select"
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                >
                  <option value="all">All Urgency</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="ec-rc-table-wrapper">
            <table className="ec-rc-table">
              <thead>
                <tr>
                  <th>REQUIREMENT ID</th>
                  <th>CATEGORY & ITEM</th>
                  <th>REQUIRED</th>
                  <th>ALLOCATED</th>
                  <th>OUTSTANDING</th>
                  <th>DESTINATION</th>
                  <th>URGENCY</th>
                  <th>STATUS</th>
                  <th>RELATED CASE</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequirements.map((req) => {
                  const isOutstanding = req.outstandingQuantity > 0;
                  return (
                    <tr key={req.id}>
                      <td className="ec-rc-cell-code">{req.id}</td>
                      <td>
                        <div className="ec-rc-item-name">{req.resourceName}</div>
                        <div className="ec-rc-item-cat">{req.category}</div>
                      </td>
                      <td>
                        <strong>{req.requiredQuantity}</strong> <span className="ec-rc-unit">{req.unit}</span>
                      </td>
                      <td>{req.allocatedQuantity} <span className="ec-rc-unit">{req.unit}</span></td>
                      <td className={isOutstanding ? 'ec-rc-val-shortage' : ''}>
                        {req.outstandingQuantity} <span className="ec-rc-unit">{req.unit}</span>
                      </td>
                      <td className="ec-rc-cell-dest">
                        <MapPin size={12} className="ec-inline-icon" />
                        <span>{req.destination}</span>
                      </td>
                      <td>
                        <span className={`ec-rc-badge ${getUrgencyBadgeClass(req.urgency)}`}>
                          {req.urgency}
                        </span>
                      </td>
                      <td>
                        <span className={`ec-rc-status-pill ${getStatusBadgeClass(req.status)}`}>
                          <span className="ec-rc-status-dot"></span>
                          {req.status}
                        </span>
                      </td>
                      <td className="ec-rc-cell-ref">{req.relatedRecord || '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="ec-btn-table-action"
                          onClick={() => handleOpenModal({
                            category: req.category,
                            resourceName: req.resourceName,
                            requestedQuantity: req.outstandingQuantity > 0 ? req.outstandingQuantity : req.requiredQuantity,
                            destination: req.destination,
                            urgency: req.urgency,
                            relatedRecord: req.relatedRecord,
                            justification: `Allocation requested for crisis requirement ${req.id} in ${req.destination}`
                          })}
                          title="Submit allocation request to Resource Manager"
                        >
                          <span>Request</span>
                          <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredRequirements.length === 0 && (
                  <tr>
                    <td colSpan="10" className="ec-rc-empty-state">
                      No active crisis requirements match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WAREHOUSE SHORTAGES */}
      {!loading && activeTab === 'shortages' && (
        <div className="ec-rc-tab-panel">
          <div className="ec-rc-shortage-explainer">
            <AlertTriangle size={18} color="#dc2626" />
            <div>
              <strong>Warehouse Shortage Alerts:</strong> These deficits indicate where field requirements from active incidents exceed current available warehouse stock in HumanitarianCrisisDb. Coordinators should submit priority allocation requests or alert partner organizations.
            </div>
          </div>

          <div className="ec-rc-shortage-grid">
            {filteredShortages.map((sht) => (
              <div key={sht.id} className="ec-rc-shortage-card">
                <div className="ec-rc-shortage-card-top">
                  <div className="ec-rc-shortage-badges">
                    <span className="ec-rc-cat-pill">{sht.category}</span>
                    <span className={`ec-rc-badge ${getUrgencyBadgeClass(sht.severity)}`}>
                      {sht.severity} Deficit
                    </span>
                  </div>
                  <div className="ec-rc-shortage-id">{sht.id}</div>
                </div>

                <h3 className="ec-rc-shortage-name">{sht.resourceName}</h3>

                <div className="ec-rc-shortage-stat-row">
                  <div className="ec-rc-stat-box">
                    <span className="ec-rc-stat-lbl">Required by Field</span>
                    <span className="ec-rc-stat-num">{sht.requiredQuantity} {sht.unit}</span>
                  </div>
                  <div className="ec-rc-stat-box">
                    <span className="ec-rc-stat-lbl">In Warehouse</span>
                    <span className="ec-rc-stat-num">{sht.availableQuantity} {sht.unit}</span>
                  </div>
                  <div className="ec-rc-stat-box box-deficit">
                    <span className="ec-rc-stat-lbl">Stock Deficit</span>
                    <span className="ec-rc-stat-num val-deficit">-{sht.deficitQuantity} {sht.unit}</span>
                  </div>
                </div>

                <div className="ec-rc-shortage-loc">
                  <MapPin size={13} color="#3d6b4f" />
                  <span>Affected Locations: <strong>{sht.location}</strong></span>
                </div>

                <p className="ec-rc-shortage-impact">{sht.impactSummary}</p>

                {sht.affectedRequests && sht.affectedRequests.length > 0 && (
                  <div className="ec-rc-affected-cases">
                    <span className="ec-rc-affected-label">Impacting Requests:</span>
                    <div className="ec-rc-cases-pills">
                      {sht.affectedRequests.map((c, i) => (
                        <span key={i} className="ec-rc-case-tag">{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ec-rc-shortage-footer">
                  <button
                    className="ec-btn-action-primary ec-btn-sm"
                    onClick={() => handleOpenModal({
                      category: sht.category,
                      resourceName: sht.resourceName,
                      requestedQuantity: sht.deficitQuantity,
                      destination: sht.location,
                      urgency: sht.severity === 'Critical' ? 'Critical' : 'High',
                      justification: `Urgent allocation to address warehouse shortage of ${sht.resourceName}. Deficit of ${sht.deficitQuantity} ${sht.unit} at ${sht.location}.`
                    })}
                  >
                    <Plus size={14} />
                    <span>Submit Allocation Request</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredShortages.length === 0 && (
              <div className="ec-rc-empty-card">
                <CheckCircle2 size={32} color="#16a34a" />
                <h3>No Critical Shortages Detected</h3>
                <p>All active requirements currently have corresponding warehouse stock available in HumanitarianCrisisDb.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ALLOCATION REQUEST TRACKING */}
      {!loading && activeTab === 'tracking' && (
        <div className="ec-rc-tab-panel">
          <div className="ec-rc-toolbar-container">
            <div className="ec-rc-filter-bar">
              <div className="ec-rc-search-box">
                <Search size={15} color="#8a9480" />
                <input
                  type="text"
                  placeholder="Search allocation requests by number, resource, destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ec-rc-search-input"
                />
                {searchQuery && (
                  <X size={14} className="ec-rc-search-clear" onClick={() => setSearchQuery('')} />
                )}
              </div>

              <div className="ec-rc-select-group">
                <select
                  className="ec-rc-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted (Pending Review)</option>
                  <option value="Approved">Approved</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="ec-rc-table-wrapper">
            <table className="ec-rc-table">
              <thead>
                <tr>
                  <th>REQUEST #</th>
                  <th>RESOURCE & CATEGORY</th>
                  <th>REQUESTED</th>
                  <th>APPROVED</th>
                  <th>DESTINATION</th>
                  <th>URGENCY</th>
                  <th>STATUS</th>
                  <th>RESOURCE MANAGER NOTES</th>
                  <th>SUBMITTED BY</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllocations.map((alloc) => (
                  <tr key={alloc.id}>
                    <td className="ec-rc-cell-code">{alloc.requestNumber}</td>
                    <td>
                      <div className="ec-rc-item-name">{alloc.resourceName}</div>
                      <div className="ec-rc-item-cat">{alloc.category}</div>
                    </td>
                    <td>
                      <strong>{alloc.requestedQuantity}</strong> <span className="ec-rc-unit">{alloc.unit}</span>
                    </td>
                    <td>
                      {alloc.approvedQuantity !== null && alloc.approvedQuantity !== undefined ? (
                        <strong className="val-emerald">{alloc.approvedQuantity} {alloc.unit}</strong>
                      ) : (
                        <span className="ec-rc-subdued">—</span>
                      )}
                    </td>
                    <td className="ec-rc-cell-dest">
                      <MapPin size={12} className="ec-inline-icon" />
                      <span>{alloc.destination}</span>
                    </td>
                    <td>
                      <span className={`ec-rc-badge ${getUrgencyBadgeClass(alloc.urgency)}`}>
                        {alloc.urgency}
                      </span>
                    </td>
                    <td>
                      <span className={`ec-rc-status-pill ${getStatusBadgeClass(alloc.status)}`}>
                        <span className="ec-rc-status-dot"></span>
                        {alloc.status}
                      </span>
                    </td>
                    <td className="ec-rc-cell-notes">
                      {alloc.responseNotes || alloc.justification || 'Pending review by Resource Manager'}
                    </td>
                    <td>
                      <div className="ec-rc-submitter">{alloc.submittedBy || 'Coordinator'}</div>
                      <div className="ec-rc-sub-date">
                        {alloc.submittedAt ? new Date(alloc.submittedAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAllocations.length === 0 && (
                  <tr>
                    <td colSpan="9" className="ec-rc-empty-state">
                      No allocation requests submitted yet. Use "+ Submit Allocation Request" to request stock from Resource Managers.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RECOMMENDATIONS */}
      {!loading && activeTab === 'recommendations' && (
        <div className="ec-rc-tab-panel">
          <div className="ec-rc-rec-grid">
            {recommendations.map((rec) => (
              <div key={rec.id} className="ec-rc-recommendation-card">
                <div className="ec-rc-rec-card-top">
                  <div className="ec-rc-rec-cat-wrap">
                    <Droplet size={16} color="#3d6b4f" />
                    <span className="ec-rc-rec-cat">{rec.category}</span>
                  </div>
                  <span className={`ec-rc-badge ${getUrgencyBadgeClass(rec.urgency)}`}>
                    {rec.urgency} Priority
                  </span>
                </div>

                <h3 className="ec-rc-rec-title">{rec.resourceName}</h3>

                <div className="ec-rc-rec-metrics">
                  <div className="ec-rc-rec-metric">
                    <span className="ec-rc-rec-lbl">Recommended Quantity</span>
                    <strong className="ec-rc-rec-val">{rec.suggestedQuantity} units</strong>
                  </div>
                  <div className="ec-rc-rec-metric">
                    <span className="ec-rc-rec-lbl">Destination Sector</span>
                    <strong className="ec-rc-rec-val">{rec.destination}</strong>
                  </div>
                </div>

                <div className="ec-rc-rec-rationale">
                  <span className="ec-rc-rec-lbl">Operational Rationale:</span>
                  <p>{rec.rationale}</p>
                </div>

                {rec.potentialImpact && (
                  <div className="ec-rc-rec-impact">
                    <span className="ec-rc-rec-lbl">Expected Impact:</span>
                    <p>{rec.potentialImpact}</p>
                  </div>
                )}

                <div className="ec-rc-rec-footer">
                  <button
                    className="ec-btn-action-primary ec-btn-sm"
                    onClick={() => handleOpenModal({
                      category: rec.category,
                      resourceName: rec.resourceName,
                      requestedQuantity: rec.suggestedQuantity,
                      destination: rec.destination,
                      urgency: rec.urgency,
                      justification: `AI Crisis Recommendation applied: ${rec.rationale}`
                    })}
                  >
                    <Plus size={14} />
                    <span>Apply to Allocation Request</span>
                  </button>
                </div>
              </div>
            ))}

            {recommendations.length === 0 && (
              <div className="ec-rc-empty-card">
                <Info size={32} color="#3d6b4f" />
                <h3>No Recommendations Available</h3>
                <p>Recommendations appear based on crisis severity and evacuation numbers.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: COORDINATION HISTORY */}
      {!loading && activeTab === 'history' && (
        <div className="ec-rc-tab-panel">
          <div className="ec-rc-history-container">
            <h3 className="ec-rc-history-title">Audit Trail & Coordination Milestones</h3>
            <p className="ec-rc-history-sub">
              Historical record of resource allocation requests submitted by coordinators and reviews processed by Resource Managers in HumanitarianCrisisDb.
            </p>

            <div className="ec-rc-timeline">
              {history.map((item, idx) => (
                <div key={item.id || idx} className="ec-rc-timeline-item">
                  <div className="ec-rc-timeline-marker"></div>
                  <div className="ec-rc-timeline-content">
                    <div className="ec-rc-timeline-header">
                      <span className="ec-rc-timeline-action">{item.actionType || 'Coordination Action'}</span>
                      <span className="ec-rc-timeline-date">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}
                      </span>
                    </div>
                    <p className="ec-rc-timeline-desc">{item.description}</p>
                    <div className="ec-rc-timeline-footer">
                      <span className="ec-rc-timeline-actor">
                        <UserCheck size={12} className="ec-inline-icon" />
                        {item.actorName || 'Emergency Coordinator'} ({item.actorRole || 'Coordinator'})
                      </span>
                      {item.status && (
                        <span className={`ec-rc-status-pill ${getStatusBadgeClass(item.status)}`}>
                          <span className="ec-rc-status-dot"></span>
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {history.length === 0 && (
                <div className="ec-rc-empty-state">
                  No coordination history events recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT RESOURCE ALLOCATION REQUEST MODAL */}
      {showSubmitModal && (
        <div className="ec-modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">RESOURCE LOGISTICS REQUEST</span>
                <h3 className="ec-modal-title">Submit Resource Allocation Request</h3>
              </div>
              <button
                className="ec-modal-close-btn"
                onClick={() => setShowSubmitModal(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitAllocation} className="ec-modal-form">
              <div className="ec-rc-modal-notice">
                <Info size={15} color="#3d6b4f" />
                <span>
                  This request will be sent directly to <strong>Resource Managers</strong> for warehouse verification and dispatch scheduling.
                </span>
              </div>

              <div className="ec-form-row">
                <div className="ec-form-field">
                  <label className="ec-field-label">Resource Category *</label>
                  <select
                    className="ec-form-select"
                    value={modalForm.category}
                    onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                  >
                    <option value="Water">Drinking Water & Purification</option>
                    <option value="Food">Emergency Food Packs & Rations</option>
                    <option value="Medicine">Medical Packs & Trauma Kits</option>
                    <option value="Shelter">Temporary Shelter & Tarpaulins</option>
                    <option value="Equipment">Rescue Gear & Flashlights</option>
                    <option value="Sanitation">Sanitation & Hygiene Kits</option>
                    <option value="Transport">Transport & Evacuation Vehicles</option>
                  </select>
                </div>

                <div className="ec-form-field">
                  <label className="ec-field-label">Resource Item Name *</label>
                  <input
                    type="text"
                    className="ec-form-input"
                    placeholder="e.g. Clean Water Tanker (5000L)"
                    required
                    value={modalForm.resourceName}
                    onChange={(e) => setModalForm({ ...modalForm, resourceName: e.target.value })}
                  />
                </div>
              </div>

              <div className="ec-form-row">
                <div className="ec-form-field">
                  <label className="ec-field-label">Requested Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    className="ec-form-input"
                    placeholder="e.g. 150"
                    required
                    value={modalForm.requestedQuantity}
                    onChange={(e) => setModalForm({ ...modalForm, requestedQuantity: e.target.value })}
                  />
                </div>

                <div className="ec-form-field">
                  <label className="ec-field-label">Destination Sector *</label>
                  <input
                    type="text"
                    className="ec-form-input"
                    placeholder="e.g. Kelani East Zone 03"
                    required
                    value={modalForm.destination}
                    onChange={(e) => setModalForm({ ...modalForm, destination: e.target.value })}
                  />
                </div>
              </div>

              <div className="ec-form-row">
                <div className="ec-form-field">
                  <label className="ec-field-label">Urgency Level *</label>
                  <select
                    className="ec-form-select"
                    value={modalForm.urgency}
                    onChange={(e) => setModalForm({ ...modalForm, urgency: e.target.value })}
                  >
                    <option value="Critical">Critical (Immediate dispatch required)</option>
                    <option value="High">High (Within 6 hours)</option>
                    <option value="Medium">Medium (Within 24 hours)</option>
                    <option value="Low">Low (Scheduled replenishments)</option>
                  </select>
                </div>

                <div className="ec-form-field">
                  <label className="ec-field-label">Related Request Reference</label>
                  <input
                    type="text"
                    className="ec-form-input"
                    placeholder="e.g. HMR-1042 / INC-01"
                    value={modalForm.relatedRecord}
                    onChange={(e) => setModalForm({ ...modalForm, relatedRecord: e.target.value })}
                  />
                </div>
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Operational Justification & Rationale *</label>
                <textarea
                  className="ec-form-textarea"
                  rows="3"
                  required
                  placeholder="Explain why this allocation is required, affected individuals count, priority reasons, or delivery constraints..."
                  value={modalForm.justification}
                  onChange={(e) => setModalForm({ ...modalForm, justification: e.target.value })}
                ></textarea>
              </div>

              <div className="ec-modal-footer">
                <button
                  type="button"
                  className="ec-btn-modal-cancel"
                  onClick={() => setShowSubmitModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ec-btn-action-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="ec-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Submit to Resource Manager</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCoordinationView;

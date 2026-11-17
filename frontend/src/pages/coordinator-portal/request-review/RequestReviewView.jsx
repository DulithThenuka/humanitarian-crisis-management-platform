import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Home,
  FileText,
  Eye,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Zap,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ConsequentialActionModal } from '../components/modals/ConsequentialActionModal';
import './RequestReviewView.css';

export const RequestReviewView = ({
  cases = [],
  selectedCaseId,
  onSelectCase,
  currentCase: currentCaseProp,
  metrics,
  autoNextEnabled = false,
  setAutoNextEnabled,
  onBackToRequests,
  onToggleChecklist,
  newNoteText,
  setNewNoteText,
  onAddNote,
  onOpenVerifyModal,
  onPreviewAttachment,
  onReviewAIRecommendation,
  onEscalateRequest,
  onRequestInfo,
  onRejectRequest,
  showToast
}) => {
  // Filter & Queue Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scopeFilter, setScopeFilter] = useState('all'); // 'all' | 'assigned'
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  // Consequential Action Modal State
  const [activeModalType, setActiveModalType] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [actionConfirmedCheck, setActionConfirmedCheck] = useState(false);

  // Priority Rank Mapping
  const priorityRank = { Critical: 1, High: 2, Medium: 3, Low: 4 };

  // Filtered & Sorted Queue
  const filteredAndSortedCases = useMemo(() => {
    let list = Array.isArray(cases) ? [...cases] : [];

    // 1. Scope filter: Assigned to Me vs All
    if (scopeFilter === 'assigned') {
      list = list.filter(c => {
        const assigned = (c.assignedTo || '').toLowerCase();
        return assigned.includes('you') || assigned.includes('coordinator') || assigned.includes('jane');
      });
    }

    // 2. Search query filter: ID, category, location, caller, description, title
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(c =>
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        (c.generalLocation && c.generalLocation.toLowerCase().includes(q)) ||
        (c.callerName && c.callerName.toLowerCase().includes(q)) ||
        (c.requesterName && c.requesterName.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // 3. Priority filter
    if (priorityFilter !== 'all') {
      list = list.filter(c => (c.severity || '').toLowerCase() === priorityFilter.toLowerCase());
    }

    // 4. Status / Verification filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        list = list.filter(c => {
          const isVerified = c.status === 'Verified' || c.verificationStatus === 'Verified';
          const isInfo = c.status === 'Need information' ||
            c.verificationStatus === 'More Information Required' ||
            c.verificationStatus === 'Information Requested';
          return !isVerified && !isInfo;
        });
      } else if (statusFilter === 'info') {
        list = list.filter(c =>
          c.status === 'Need information' ||
          c.verificationStatus === 'More Information Required' ||
          c.verificationStatus === 'Information Requested'
        );
      } else if (statusFilter === 'verified') {
        list = list.filter(c => c.status === 'Verified' || c.verificationStatus === 'Verified');
      }
    }

    // 5. Priority-First Default Sorting
    // Critical -> High -> Medium -> Low
    // Within each priority, actionable Pending Review requests appear first before Verified or Need Information
    list.sort((a, b) => {
      const rankA = priorityRank[a.severity] || 3;
      const rankB = priorityRank[b.severity] || 3;
      if (rankA !== rankB) return rankA - rankB;

      const isPendingA = a.status !== 'Verified' && a.status !== 'Need information' &&
        a.verificationStatus !== 'Verified' && a.verificationStatus !== 'More Information Required';
      const isPendingB = b.status !== 'Verified' && b.status !== 'Need information' &&
        b.verificationStatus !== 'Verified' && b.verificationStatus !== 'More Information Required';

      if (isPendingA && !isPendingB) return -1;
      if (!isPendingA && isPendingB) return 1;

      return (a.id || '').localeCompare(b.id || '');
    });

    return list;
  }, [cases, scopeFilter, searchQuery, priorityFilter, statusFilter]);

  // Active Selected Case
  const activeCase = useMemo(() => {
    if (selectedCaseId) {
      const match = cases.find(c => c.id === selectedCaseId);
      if (match) return match;
    }
    if (currentCaseProp) return currentCaseProp;
    if (filteredAndSortedCases.length > 0) return filteredAndSortedCases[0];
    return cases[0] || null;
  }, [cases, selectedCaseId, currentCaseProp, filteredAndSortedCases]);

  // Queue Position & Navigation
  const activeIndex = useMemo(() => {
    if (!activeCase) return -1;
    return filteredAndSortedCases.findIndex(c => c.id === activeCase.id);
  }, [filteredAndSortedCases, activeCase]);

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < filteredAndSortedCases.length - 1;

  const handlePrevRequest = () => {
    if (hasPrev) {
      const prevCase = filteredAndSortedCases[activeIndex - 1];
      onSelectCase?.(prevCase.id);
    }
  };

  const handleNextRequest = () => {
    if (hasNext) {
      const nextCase = filteredAndSortedCases[activeIndex + 1];
      onSelectCase?.(nextCase.id);
    }
  };

  // Metrics Bar Counts
  const kpiCounts = useMemo(() => {
    const total = metrics?.incomingRequests ?? cases.length;
    const pending = metrics?.pendingReviews ?? cases.filter(c =>
      c.status !== 'Verified' && c.status !== 'Need information' &&
      c.verificationStatus !== 'Verified' && c.verificationStatus !== 'More Information Required'
    ).length;
    const critical = metrics?.criticalPriority ?? cases.filter(c => c.severity === 'Critical').length;
    const high = cases.filter(c => c.severity === 'High').length;
    const info = metrics?.moreInfoRequired ?? cases.filter(c =>
      c.status === 'Need information' ||
      c.verificationStatus === 'More Information Required' ||
      c.verificationStatus === 'Information Requested'
    ).length;

    return { total, pending, critical, high, info };
  }, [metrics, cases]);

  // Modal Handlers
  const handleOpenActionModal = (type) => {
    setActiveModalType(type);
    setActionReason('');
    setActionConfirmedCheck(false);
  };

  const handleConfirmAction = () => {
    if (!activeCase) return;

    if (activeModalType === 'verify') {
      onOpenVerifyModal?.();
    } else if (activeModalType === 'info') {
      if (!actionReason || !actionReason.trim()) {
        showToast?.('Please enter an information request message', 'error');
        return;
      }
      if (onRequestInfo) {
        onRequestInfo(activeCase.id, actionReason.trim());
      } else {
        showToast(`Additional information requested for ${activeCase.id}. Status updated.`, 'success');
      }
    } else if (activeModalType === 'escalate') {
      if (onEscalateRequest) {
        onEscalateRequest(activeCase.id, actionReason);
      } else {
        showToast(`Operational priority for ${activeCase.id} escalated to Critical Emergency Command`, 'warning');
      }
    } else if (activeModalType === 'investigate') {
      showToast(`Request ${activeCase.id} flagged for authorised field investigation`, 'warning');
    } else if (activeModalType === 'reject') {
      if (onRejectRequest) {
        onRejectRequest(activeCase.id, actionReason);
      } else {
        showToast(`Request ${activeCase.id} rejected with logged operational rationale`, 'error');
      }
    }
    setActiveModalType(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setStatusFilter('all');
    setScopeFilter('all');
  };

  const isFilterActive = searchQuery.trim() !== '' || priorityFilter !== 'all' || statusFilter !== 'all' || scopeFilter !== 'all';

  // Fallbacks for active case details
  const caseHistory = (activeCase?.history && Array.isArray(activeCase.history) && activeCase.history.length > 0)
    ? activeCase.history
    : [
        {
          time: activeCase?.submittedAt || 'Today',
          event: `Assistance request submitted by ${activeCase?.callerName || activeCase?.requesterName || 'Citizen'}`,
          actor: 'Citizen Portal / Dispatch'
        },
        {
          time: 'AI Assessment',
          event: `Automated triage assigned ${activeCase?.severity || 'High'} urgency rating`,
          actor: 'AI Risk Engine'
        },
        ...(activeCase?.status === 'Verified' || activeCase?.verificationStatus === 'Verified' ? [{
          time: 'Current',
          event: 'Request marked as verified by Emergency Coordinator',
          actor: 'Emergency Coordinator'
        }] : []),
        ...(activeCase?.status === 'Need information' || activeCase?.verificationStatus === 'More Information Required' ? [{
          time: 'Current',
          event: 'Additional information requested from citizen by Emergency Coordinator',
          actor: 'Emergency Coordinator'
        }] : [])
      ];

  const caseChecklist = (activeCase?.checklist && Array.isArray(activeCase.checklist) && activeCase.checklist.length > 0)
    ? activeCase.checklist
    : [
        { id: 'chk-1', label: 'Citizen contact verified', checked: activeCase?.status === 'Verified' || activeCase?.verificationStatus === 'Verified', required: true },
        { id: 'chk-2', label: 'Location verified on map', checked: Boolean(activeCase?.lat), required: true },
        { id: 'chk-3', label: 'No direct duplicate found', checked: true, required: false },
        { id: 'chk-4', label: 'Resource availability confirmed', checked: false, required: false }
      ];

  const checklistCheckedCount = caseChecklist.filter(c => c.checked).length;
  const checklistTotalCount = caseChecklist.length;
  const hasIncompleteRequiredChecks = caseChecklist.some(c => c.required && !c.checked);

  const caseNotes = (activeCase?.notes && Array.isArray(activeCase.notes)) ? activeCase.notes : [];

  return (
    <div className="ec-portal-canvas ec-review-workspace-root">
      {/* 1. Top Section - Navigation, Header & Metric Pills */}
      <div className="ec-review-top-section">
        <div className="ec-review-header-nav">
          <button className="ec-back-link-btn" onClick={onBackToRequests}>
            <ChevronLeft size={14} />
            <span>Back to Assistance Requests</span>
          </button>

          {/* Auto-Next and Scope Toggle Bar */}
          <div className="ec-review-top-toggles">
            <div className="ec-scope-toggle-group">
              <button
                type="button"
                className={`ec-scope-btn ${scopeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setScopeFilter('all')}
              >
                All Requests ({cases.length})
              </button>
              <button
                type="button"
                className={`ec-scope-btn ${scopeFilter === 'assigned' ? 'active' : ''}`}
                onClick={() => setScopeFilter('assigned')}
              >
                Assigned to Me
              </button>
            </div>

            <button
              type="button"
              className={`ec-autonext-toggle-btn ${autoNextEnabled ? 'is-enabled' : ''}`}
              onClick={() => setAutoNextEnabled?.(!autoNextEnabled)}
              title="When enabled, completing an action advances automatically to the next actionable pending request"
            >
              <Zap size={13} className={autoNextEnabled ? 'ec-pulse-icon' : ''} />
              <span>Auto-Next: {autoNextEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Title Heading */}
        <div className="ec-review-title-row">
          <div>
            <h1 className="ec-review-page-title">Request Review &amp; Verification</h1>
            <p className="ec-review-page-subtitle">
              Prioritised review workspace: triage, verify citizen evidence, and authorize operational actions.
            </p>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="ec-review-kpi-strip">
          <div className="ec-review-kpi-card">
            <span className="ec-review-kpi-val">{kpiCounts.total}</span>
            <span className="ec-review-kpi-lbl">Total requests</span>
          </div>
          <div className="ec-review-kpi-card is-pending">
            <span className="ec-review-kpi-val">{kpiCounts.pending}</span>
            <span className="ec-review-kpi-lbl">Pending reviews</span>
          </div>
          <div className="ec-review-kpi-card is-critical">
            <span className="ec-review-kpi-val">{kpiCounts.critical}</span>
            <span className="ec-review-kpi-lbl">Critical requests</span>
          </div>
          <div className="ec-review-kpi-card is-high">
            <span className="ec-review-kpi-val">{kpiCounts.high}</span>
            <span className="ec-review-kpi-lbl">High-priority</span>
          </div>
          <div className="ec-review-kpi-card is-info">
            <span className="ec-review-kpi-val">{kpiCounts.info}</span>
            <span className="ec-review-kpi-lbl">More info required</span>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="ec-review-toolbar">
          <div className="ec-review-search-box">
            <Search size={14} className="ec-search-icon" />
            <input
              type="text"
              placeholder="Search by ID, location, category, citizen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ec-review-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="ec-search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="ec-review-filters-group">
            <div className="ec-filter-select-wrapper">
              <label htmlFor="priority-filter" className="ec-filter-label">Priority:</label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="ec-filter-select"
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="ec-filter-select-wrapper">
              <label htmlFor="status-filter" className="ec-filter-label">Status:</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="ec-filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending review</option>
                <option value="info">Need information</option>
                <option value="verified">Verified</option>
              </select>
            </div>

            {isFilterActive && (
              <button
                type="button"
                className="ec-reset-filters-btn"
                onClick={handleResetFilters}
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}

            <div className="ec-queue-count-pill">
              Showing <strong>{filteredAndSortedCases.length}</strong> of {cases.length}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Panel Layout */}
      <div className="ec-review-two-panel-grid">
        {/* Left Panel: Request Review Queue */}
        <aside className="ec-review-queue-panel">
          <div className="ec-queue-panel-header">
            <div>
              <h3 className="ec-queue-panel-title">Review Queue</h3>
              <p className="ec-queue-panel-sub">
                Sorted by priority (Critical &rarr; Low)
              </p>
            </div>
            <span className="ec-queue-counter-tag">
              {filteredAndSortedCases.length} in queue
            </span>
          </div>

          <div className="ec-queue-cards-scroll">
            {filteredAndSortedCases.length === 0 ? (
              <div className="ec-queue-empty-state">
                <AlertTriangle size={24} color="#94a3b8" />
                <p className="ec-queue-empty-title">No requests match filters</p>
                <p className="ec-queue-empty-sub">Adjust your search query or reset filters to view all queue items.</p>
                {isFilterActive && (
                  <button type="button" className="ec-queue-reset-btn" onClick={handleResetFilters}>
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              filteredAndSortedCases.map((item, idx) => {
                const isSelected = activeCase?.id === item.id;
                const isVerified = item.status === 'Verified' || item.verificationStatus === 'Verified';
                const isNeedInfo = item.status === 'Need information' ||
                  item.verificationStatus === 'More Information Required' ||
                  item.verificationStatus === 'Information Requested';

                return (
                  <div
                    key={item.id || idx}
                    className={`ec-queue-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => onSelectCase?.(item.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectCase?.(item.id);
                      }
                    }}
                  >
                    {/* Top Row: ID, Priority, Category */}
                    <div className="ec-queue-card-top">
                      <span className="ec-queue-card-id">{item.id}</span>
                      <span className={
                        item.severity === 'Critical' ? 'ec-badge-critical' :
                        item.severity === 'High' ? 'ec-badge-high' :
                        item.severity === 'Low' ? 'ec-badge-low' :
                        'ec-badge-medium'
                      }>
                        ● {item.severity || 'High'}
                      </span>
                    </div>

                    {/* Title / Summary */}
                    <div className="ec-queue-card-title">
                      {item.title || item.category || 'Emergency Assistance'}
                    </div>

                    {/* Metadata: Location, Submitted, People */}
                    <div className="ec-queue-card-meta-row">
                      <span className="ec-queue-meta-item">
                        <MapPin size={11} />
                        <span>{item.location || item.generalLocation || 'Western Province'}</span>
                      </span>
                      <span className="ec-queue-meta-item">
                        <Clock size={11} />
                        <span>{item.submittedAt || item.timeAgo || 'Recent'}</span>
                      </span>
                    </div>

                    {/* Footer Row: Status badge & Assigned */}
                    <div className="ec-queue-card-foot">
                      <span className={
                        isVerified ? 'ec-badge-verified' :
                        isNeedInfo ? 'ec-badge-info' :
                        'ec-badge-pending'
                      }>
                        ● {isVerified ? 'Verified' : isNeedInfo ? 'Need information' : 'Pending review'}
                      </span>

                      <span className="ec-queue-card-assigned">
                        {item.assignedTo || 'Assigned to you'}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="ec-queue-card-active-indicator">
                        <span>Currently reviewing</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Panel: Selected Request Operational Workspace */}
        <main className="ec-review-workspace-panel">
          {!activeCase ? (
            <div className="ec-panel-card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <Layers size={36} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <h3>No Request Selected</h3>
              <p>Please select an assistance request from the review queue on the left.</p>
            </div>
          ) : (
            <>
              {/* Workspace Header Strip with Prev/Next Navigation */}
              <div className="ec-case-heading-strip">
                <div>
                  <div className="ec-breadcrumb-row">
                    <span className="ec-breadcrumb-tiny">REQUEST REVIEW &amp; VERIFICATION</span>
                    <span className="ec-breadcrumb-sep">/</span>
                    <span className="ec-breadcrumb-current-id">{activeCase.id}</span>
                  </div>
                  <h2 className="ec-review-main-title">{activeCase.title || 'Emergency Case'}</h2>
                  <p className="ec-review-sub-meta">
                    {activeCase.id} · Submitted {activeCase.submittedAt || 'Recent'} · {activeCase.location || activeCase.generalLocation || 'Operational Area'}
                  </p>
                </div>

                <div className="ec-workspace-header-actions">
                  {/* Prev / Next Queue Nav Controls */}
                  <div className="ec-queue-nav-btn-group">
                    <span className="ec-queue-position-text">
                      {activeIndex >= 0 ? `${activeIndex + 1} of ${filteredAndSortedCases.length}` : ''}
                    </span>
                    <button
                      type="button"
                      className="ec-nav-step-btn"
                      onClick={handlePrevRequest}
                      disabled={!hasPrev}
                      title="Previous request in queue"
                    >
                      <ChevronLeft size={14} />
                      <span>Prev</span>
                    </button>
                    <button
                      type="button"
                      className="ec-nav-step-btn"
                      onClick={handleNextRequest}
                      disabled={!hasNext}
                      title="Next request in queue"
                    >
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Status Badges Dock */}
                  <div className="ec-review-badges-dock">
                    <span className={
                      activeCase.severity === 'Critical' ? 'ec-badge-critical' :
                      activeCase.severity === 'High' ? 'ec-badge-high' :
                      activeCase.severity === 'Low' ? 'ec-badge-low' :
                      'ec-badge-medium'
                    }>
                      ● {activeCase.severity || 'High'}
                    </span>
                    <span className={
                      activeCase.status === 'Verified' || activeCase.verificationStatus === 'Verified' ? 'ec-badge-verified' :
                      (activeCase.status === 'Need information' || activeCase.verificationStatus === 'More Information Required' || activeCase.verificationStatus === 'Information Requested') ? 'ec-badge-info' :
                      'ec-badge-pending'
                    }>
                      ● {activeCase.verificationStatus === 'More Information Required' ? 'More information required' : (activeCase.verificationStatus || activeCase.status || 'Pending review')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Functional Workspace Split Cards */}
              <div className="ec-workspace-cards-stack">
                {/* 1. Request Information Card */}
                <div className="ec-panel-card">
                  <div className="ec-panel-card-head">
                    <div>
                      <h3 className="ec-panel-title-text">Request information</h3>
                      <p className="ec-panel-subtitle-text">Citizen-provided information - access controlled</p>
                    </div>
                    <span className="ec-cmd-k-badge">
                      {activeCase.attachmentsCount ?? (activeCase.attachment || activeCase.attachmentUrl ? 1 : 0)} attachments
                    </span>
                  </div>

                  {/* Category Banner Box */}
                  <div className="ec-category-banner-card">
                    <div className="ec-category-icon-box">
                      <Home size={20} />
                    </div>
                    <div>
                      <h4 className="ec-cat-title">{activeCase.category || 'Emergency Assistance'}</h4>
                      <p className="ec-cat-affected">
                        {activeCase.affectedSummary || (
                          `${activeCase.affectedPeople ? `${activeCase.affectedPeople} people affected` : 'Displaced household'} · ${activeCase.callerName || activeCase.requesterName || 'Citizen'} · Urgent assistance required`
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Highlight Quote Box */}
                  <div className="ec-desc-callout-box">
                    "{activeCase.description || 'Assistance request logged in crisis platform.'}"
                  </div>

                  {/* 4-column Metadata Quad Grid */}
                  <div className="ec-meta-quad-grid">
                    <div className="ec-meta-quad-item">
                      <span className="ec-meta-label-tiny">GENERAL LOCATION</span>
                      <span className="ec-meta-val-text">{activeCase.generalLocation || activeCase.location || 'Western Province'}</span>
                    </div>
                    <div className="ec-meta-quad-item">
                      <span className="ec-meta-label-tiny">ACCESSIBILITY</span>
                      <span className="ec-meta-val-text">{activeCase.accessibility || 'Standard access / Ground route'}</span>
                    </div>
                    <div className="ec-meta-quad-item">
                      <span className="ec-meta-label-tiny">CONTACT VERIFIED</span>
                      <span className="ec-meta-val-text" style={{ color: activeCase.callerPhone || activeCase.contactNumber ? '#0284c7' : '#d97706' }}>
                        {activeCase.contactStatus || (activeCase.callerPhone ? `Verified (${activeCase.callerPhone})` : activeCase.contactNumber ? `Verified (${activeCase.contactNumber})` : 'Pending contact verification')}
                      </span>
                    </div>
                    <div className="ec-meta-quad-item">
                      <span className="ec-meta-label-tiny">EMERGENCY CONTEXT</span>
                      <span className="ec-meta-val-text">{activeCase.emergencyContext || activeCase.operationalArea || 'Active response'}</span>
                    </div>
                  </div>

                  {/* 2. Attachment Card */}
                  {(activeCase.attachment || activeCase.attachmentUrl) ? (
                    <div className="ec-attachment-item-card">
                      <div className="ec-attachment-left">
                        <FileText size={18} color="#0284c7" />
                        <div>
                          <div className="ec-attachment-name">{activeCase.attachment?.fileName || 'Incident_Report_Attachment.pdf'}</div>
                          <div className="ec-attachment-meta">
                            {activeCase.attachment?.uploadType || 'Citizen Field Document'} · {activeCase.attachment?.fileSize || '1.2 MB'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ec-btn-preview-sm"
                        onClick={() => onPreviewAttachment?.(activeCase.attachment?.previewUrl || activeCase.attachmentUrl)}
                      >
                        <Eye size={13} />
                        <span>Preview</span>
                      </button>
                    </div>
                  ) : (
                    <div className="ec-attachment-empty-note">
                      <FileText size={14} color="#94a3b8" />
                      <span>No citizen files or image attachments submitted for this request.</span>
                    </div>
                  )}

                  {/* 3. Citizen Information Requests & Communications */}
                  {((activeCase.communications && activeCase.communications.length > 0) ||
                    activeCase.status === 'Need information' ||
                    activeCase.verificationStatus === 'More Information Required') && (
                    <div className="ec-citizen-comm-card">
                      <div className="ec-citizen-comm-head">
                        <div>
                          <span className="ec-comm-title-tag">Citizen Information Requests</span>
                          <p className="ec-comm-sub-tag">Public operational inquiries sent to citizen</p>
                        </div>
                        <span className="ec-badge-info">Awaiting Citizen Response</span>
                      </div>

                      {activeCase.communications && activeCase.communications.length > 0 ? (
                        <div className="ec-comm-messages-stack">
                          {activeCase.communications.map((comm, idx) => (
                            <div key={comm.id || idx} className="ec-comm-bubble">
                              <div className="ec-comm-bubble-meta">
                                <span>To: {comm.recipient || 'Citizen / Requestor'}</span>
                                <span>{comm.time || 'Recently'}</span>
                              </div>
                              <div className="ec-comm-bubble-text">"{comm.message}"</div>
                              <div className="ec-comm-bubble-author">
                                Requested by: {comm.senderName || 'Emergency Coordinator'} ({comm.senderRole || 'Coordinator'})
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ec-comm-placeholder-note">
                          Additional information has been requested from citizen. Awaiting citizen submission.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Request History Card */}
                <div className="ec-panel-card">
                  <h3 className="ec-panel-title-text" style={{ marginBottom: '12px' }}>Request history</h3>
                  <div className="ec-history-stepper-list">
                    {caseHistory.map((step, idx) => (
                      <div key={idx} className="ec-history-step-row">
                        <span className="ec-step-time-lbl">{step.time}</span>
                        <div className="ec-step-bullet-dot" />
                        <div>
                          <div className="ec-step-title">{step.event}</div>
                          <div className="ec-step-actor">{step.actor}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Collapsible Verification Checklist Accordion */}
                <div className="ec-panel-card ec-checklist-accordion-card">
                  <div
                    className="ec-accordion-header"
                    onClick={() => setIsChecklistOpen(!isChecklistOpen)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setIsChecklistOpen(!isChecklistOpen);
                      }
                    }}
                  >
                    <div className="ec-accordion-title-wrap">
                      <ShieldCheck size={16} color="#0284c7" />
                      <div>
                        <h3 className="ec-panel-title-text" style={{ fontSize: '13px', margin: 0 }}>
                          Verification Checklist &amp; Evidence ({checklistCheckedCount}/{checklistTotalCount} confirmed)
                        </h3>
                        <p className="ec-panel-subtitle-text" style={{ margin: 0 }}>
                          Operational criteria details - click to {isChecklistOpen ? 'collapse' : 'expand'}
                        </p>
                      </div>
                    </div>

                    <div className="ec-accordion-chevron-box">
                      {isChecklistOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isChecklistOpen && (
                    <div className="ec-accordion-body">
                      <div className="ec-checklist-stack">
                        {caseChecklist.map(item => (
                          <div
                            key={item.id}
                            className="ec-check-item-row"
                            onClick={() => onToggleChecklist?.(item.id)}
                          >
                            <div className="ec-check-left">
                              <input
                                type="checkbox"
                                checked={Boolean(item.checked)}
                                onChange={() => {}}
                                style={{ cursor: 'pointer', accentColor: '#0284c7' }}
                              />
                              <span>{item.label}</span>
                            </div>
                            {item.required && !item.checked && (
                              <span className="ec-pill-required-red">Required</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {hasIncompleteRequiredChecks && (
                        <div className="ec-warning-callout-box">
                          <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong>Verification reminder:</strong>
                            <div>Contact confirmation and location evidence should be validated prior to dispatch.</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 6. Internal Coordinator Notes Section */}
                <div className="ec-panel-card">
                  <h3 className="ec-panel-title-text" style={{ marginBottom: '4px' }}>Internal coordinator notes</h3>
                  <p className="ec-panel-subtitle-text" style={{ marginBottom: '10px' }}>
                    Visible only to authorised operational staff
                  </p>

                  <textarea
                    className="ec-notes-textarea"
                    placeholder="Enter confidential notes, logistics updates or field contacts..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                  />
                  <button
                    type="button"
                    className="ec-btn-add-note"
                    onClick={onAddNote}
                  >
                    <Plus size={13} />
                    <span>Add note</span>
                  </button>

                  {/* Existing Notes Display */}
                  {caseNotes.length > 0 && (
                    <div className="ec-existing-notes-list">
                      {caseNotes.map((n, idx) => (
                        <div key={n.id || idx} className="ec-note-item-bubble">
                          <div className="ec-note-item-head">
                            <strong>{n.author || 'Coordinator'}</strong>
                            <span>{n.time || 'Recent'}</span>
                          </div>
                          <div className="ec-note-item-body">{n.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. Authorised Actions Stack */}
                <div className="ec-panel-card">
                  <div className="ec-panel-card-head" style={{ marginBottom: '10px' }}>
                    <div>
                      <h3 className="ec-panel-title-text">Authorised actions</h3>
                      <p className="ec-panel-subtitle-text">Consequential actions are committed to the crisis audit ledger</p>
                    </div>
                  </div>

                  <div className="ec-authorised-actions-stack">
                    <button
                      type="button"
                      className="ec-btn-verify-primary"
                      onClick={onOpenVerifyModal}
                    >
                      <CheckCircle2 size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      <span>Mark as verified</span>
                    </button>

                    <button
                      type="button"
                      className="ec-btn-action-outline"
                      onClick={() => handleOpenActionModal('info')}
                    >
                      Request additional information
                    </button>

                    <button
                      type="button"
                      className="ec-btn-action-outline"
                      onClick={() => handleOpenActionModal('escalate')}
                    >
                      Escalate priority
                    </button>

                    <button
                      type="button"
                      className="ec-btn-action-outline"
                      onClick={onReviewAIRecommendation}
                    >
                      Review AI recommendation
                    </button>

                    <button
                      type="button"
                      className="ec-btn-action-outline"
                      onClick={() => handleOpenActionModal('investigate')}
                    >
                      Flag for investigation
                    </button>

                    <button
                      type="button"
                      className="ec-btn-reject-red"
                      onClick={() => handleOpenActionModal('reject')}
                    >
                      Reject with reason
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Consequential Action Confirmation Modal */}
      <ConsequentialActionModal
        isOpen={Boolean(activeModalType)}
        onClose={() => setActiveModalType(null)}
        title={
          activeModalType === 'info'
            ? 'Request additional information?'
            : activeModalType === 'escalate'
            ? 'Escalate operational priority?'
            : activeModalType === 'investigate'
            ? 'Flag for authorised investigation?'
            : activeModalType === 'reject'
            ? 'Reject assistance request with reason?'
            : 'Mark request as verified?'
        }
        confirmVariant={activeModalType === 'reject' ? 'danger' : 'primary'}
        reason={actionReason}
        setReason={setActionReason}
        confirmedCheck={actionConfirmedCheck}
        setConfirmedCheck={setActionConfirmedCheck}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

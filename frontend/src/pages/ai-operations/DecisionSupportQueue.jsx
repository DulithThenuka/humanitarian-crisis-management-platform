import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Flag, 
  Clock, 
  Search, 
  RotateCcw, 
  Plus, 
  Download, 
  ChevronDown, 
  Eye, 
  RotateCw,
  Bell, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  X,
  Sparkles,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';

export const DecisionSupportQueue = ({ 
  queueData = [],
  onUpdateQueueItem,
  onAddQueueItem,
  onOpenReview, 
  onOpenTrace, 
  onBackOverview,
  showToast 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedRows, setSelectedRows] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const pageSize = 5;

  // Active Dropdowns state
  const [openDropdown, setOpenDropdown] = useState(null); // 'category' | 'priority' | 'status' | 'risk' | null

  // New Request Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newReqCategory, setNewReqCategory] = useState('Medical Assistance');
  const [newReqLocation, setNewReqLocation] = useState('Colombo - Pettah Multi-Storey');
  const [newReqCaller, setNewReqCaller] = useState('Ananda Perera');
  const [newReqPhone, setNewReqPhone] = useState('+94 77 987 6543');
  const [newReqUrgency, setNewReqUrgency] = useState('CRITICAL');
  const [newReqCount, setNewReqCount] = useState(14);
  const [newReqSummary, setNewReqSummary] = useState('Flash flood entering ground floor ward; elderly and infant evacuations needed.');

  const categoryOptions = ['All', 'Medical Assistance', 'Food Supply', 'Shelter Support', 'Water Supply', 'Search & Rescue', 'Volunteer Support'];
  const priorityOptions = ['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const statusOptions = ['All', 'Pending', 'In Review', 'Approved', 'Deferred'];
  const riskOptions = ['All', 'Alerts Only', 'None'];

  // Toggle selection
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredRows.map(r => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
    setSelectedRisk('All');
    setOpenDropdown(null);
    setActivePage(1);
    showToast?.('Queue filters reset', 'info');
  };

  // Filter queue data
  const filteredRows = queueData.filter(row => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchId = row.id.toLowerCase().includes(q);
      const matchLoc = row.location.toLowerCase().includes(q);
      const matchCat = row.category.toLowerCase().includes(q);
      const matchCaller = row.caller?.toLowerCase().includes(q);
      if (!matchId && !matchLoc && !matchCat && !matchCaller) return false;
    }
    if (selectedCategory !== 'All' && !row.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
    if (selectedPriority !== 'All' && row.priority !== selectedPriority) return false;
    if (selectedStatus !== 'All' && row.reviewStatus !== selectedStatus) return false;
    if (selectedRisk === 'Alerts Only' && row.riskFlagType !== 'alert') return false;
    if (selectedRisk === 'None' && row.riskFlagType === 'alert') return false;
    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((activePage - 1) * pageSize, activePage * pageSize);

  // Export to CSV
  const handleExportCSV = () => {
    const dataToExport = selectedRows.length > 0 
      ? queueData.filter(r => selectedRows.includes(r.id))
      : filteredRows;

    const headers = ['Request ID', 'Category', 'Location', 'Priority', 'AI Confidence', 'Risk Flags', 'Status', 'Caller', 'Time'];
    const rows = dataToExport.map(r => [
      `"${r.id}"`,
      `"${r.category}"`,
      `"${r.location}"`,
      `"${r.priority}"`,
      `"${r.confidence}"`,
      `"${r.riskFlag}"`,
      `"${r.reviewStatus}"`,
      `"${r.caller || 'Citizen'}"`,
      `"${r.time || 'Today'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reliefcore_ai_queue_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast?.(`Exported ${dataToExport.length} queue records to CSV`, 'success');
  };

  // Batch actions
  const handleBatchApprove = () => {
    selectedRows.forEach(id => {
      onUpdateQueueItem(id, { reviewStatus: 'Approved', reviewStatusType: 'approved', actionType: 'trace' });
    });
    showToast?.(`Approved AI recommendation for ${selectedRows.length} requests`, 'success');
    setSelectedRows([]);
  };

  const handleBatchEscalate = () => {
    selectedRows.forEach(id => {
      onUpdateQueueItem(id, { priority: 'CRITICAL', priorityColor: 'critical' });
    });
    showToast?.(`Escalated ${selectedRows.length} requests to Priority 1 (CRITICAL)`, 'info');
    setSelectedRows([]);
  };

  // Handle New Urgent Request Submit
  const handleCreateNewRequest = (e) => {
    e.preventDefault();
    const newId = `REQ-2026-0${1843 + queueData.length}`;
    const newItem = {
      id: newId,
      category: newReqCategory,
      location: newReqLocation,
      priority: newReqUrgency,
      priorityColor: newReqUrgency.toLowerCase(),
      confidence: '95%',
      confidenceNum: 95,
      riskFlag: newReqUrgency === 'CRITICAL' ? 'High life-threat priority' : 'None',
      riskFlagType: newReqUrgency === 'CRITICAL' ? 'alert' : 'none',
      reviewStatus: 'Pending',
      reviewStatusType: 'pending',
      actionType: 'review',
      time: 'Just now',
      caller: newReqCaller,
      phone: newReqPhone,
      urgencyScore: newReqUrgency === 'CRITICAL' ? 96 : 74,
      affectedCount: parseInt(newReqCount) || 1,
      summary: newReqSummary,
      aiModel: 'ReliefCore-BERT-Triage-v4',
      selectedResources: ['rapid-response-team'],
      humanDecision: null
    };

    onAddQueueItem(newItem);
    setShowNewModal(false);
  };

  // KPI calculations
  const pendingCount = queueData.filter(r => r.reviewStatus === 'Pending').length;
  const highPriorityCount = queueData.filter(r => r.priority === 'CRITICAL' || r.priority === 'HIGH').length;
  const riskFlagCount = queueData.filter(r => r.riskFlagType === 'alert').length;
  const deferredCount = queueData.filter(r => r.reviewStatus === 'Deferred').length;

  return (
    <div className="ai-page-canvas">
      {/* Top Breadcrumb Bar */}
      <div className="ai-top-breadcrumb-bar">
        <div className="ai-breadcrumb-path">
          <span className="crumb-root clickable" onClick={onBackOverview}>AI Operations</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">Decision Support Queue</span>
        </div>

        <div className="ai-top-header-controls">
          <div className="ai-header-search">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search request ID, citizen, location..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setActivePage(1); }}
              className="ai-search-input"
            />
            {searchTerm && (
              <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                <X size={12} />
              </button>
            )}
          </div>

          <div className="ai-header-actions">
            <button className="header-icon-pill" title="Notifications">
              <Bell size={16} />
              <span className="badge-count">3</span>
            </button>
            <div className="user-avatar-badge">
              <span>SJ</span>
              <ChevronDown size={12} className="chevron" />
            </div>
          </div>
        </div>
      </div>

      {/* Title & Action Buttons Header */}
      <div className="ai-page-title-row">
        <div>
          <div className="title-badge-row">
            <h1 className="ai-main-heading">Decision Support Queue</h1>
            <span className="neural-live-badge amber">
              <AlertTriangle size={12} />
              <span>{pendingCount} PENDING TRIAGE</span>
            </span>
          </div>
          <p className="ai-main-subheading">
            Review AI-assisted recommendations and prioritize requests requiring human coordinator sign-off.
          </p>
        </div>

        <div className="ai-head-btn-group">
          <button className="btn-solid-teal" onClick={() => setShowNewModal(true)}>
            <Plus size={15} />
            <span>New Request</span>
          </button>
          <button className="btn-outline-white" onClick={handleExportCSV} title="Export filtered requests to CSV">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Horizontal KPI Cards (Picture 2) */}
      <div className="ai-kpi-quad-grid queue-kpis">
        {/* 1. Pending Review */}
        <div 
          className={`ai-kpi-card-horizontal ${selectedStatus === 'Pending' ? 'active-filter' : ''}`}
          onClick={() => setSelectedStatus(selectedStatus === 'Pending' ? 'All' : 'Pending')}
          style={{ cursor: 'pointer' }}
          title="Filter by Pending Review"
        >
          <div className="kpi-icon-square green">
            <FileText size={20} color="#059669" />
          </div>
          <div className="kpi-info-side">
            <div className="kpi-side-number">{pendingCount}</div>
            <div className="kpi-side-label">Pending Review</div>
          </div>
        </div>

        {/* 2. High Priority */}
        <div 
          className={`ai-kpi-card-horizontal ${selectedPriority === 'CRITICAL' ? 'active-filter' : ''}`}
          onClick={() => setSelectedPriority(selectedPriority === 'CRITICAL' ? 'All' : 'CRITICAL')}
          style={{ cursor: 'pointer' }}
          title="Filter by Critical Priority"
        >
          <div className="kpi-icon-square red">
            <AlertTriangle size={20} color="#dc2626" />
          </div>
          <div className="kpi-info-side">
            <div className="kpi-side-number">{highPriorityCount}</div>
            <div className="kpi-side-label">High Priority</div>
          </div>
        </div>

        {/* 3. Risk Flags */}
        <div 
          className={`ai-kpi-card-horizontal ${selectedRisk === 'Alerts Only' ? 'active-filter' : ''}`}
          onClick={() => setSelectedRisk(selectedRisk === 'Alerts Only' ? 'All' : 'Alerts Only')}
          style={{ cursor: 'pointer' }}
          title="Filter by Risk Flags"
        >
          <div className="kpi-icon-square orange">
            <Flag size={20} color="#ea580c" />
          </div>
          <div className="kpi-info-side">
            <div className="kpi-side-number">{riskFlagCount}</div>
            <div className="kpi-side-label">Risk Flags</div>
          </div>
        </div>

        {/* 4. Deferred */}
        <div 
          className={`ai-kpi-card-horizontal ${selectedStatus === 'Deferred' ? 'active-filter' : ''}`}
          onClick={() => setSelectedStatus(selectedStatus === 'Deferred' ? 'All' : 'Deferred')}
          style={{ cursor: 'pointer' }}
          title="Filter by Deferred"
        >
          <div className="kpi-icon-square purple">
            <Clock size={20} color="#7c3aed" />
          </div>
          <div className="kpi-info-side">
            <div className="kpi-side-number">{deferredCount}</div>
            <div className="kpi-side-label">Deferred</div>
          </div>
        </div>
      </div>

      {/* Filter Bar Toolbar with REAL Clickable Dropdowns */}
      <div className="queue-filter-toolbar">
        <div className="filter-search-box">
          <Search size={14} className="filter-search-icon" />
          <input 
            type="text" 
            placeholder="Search request ID or location..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setActivePage(1); }}
            className="filter-input-field"
          />
        </div>

        {/* Category Dropdown */}
        <div className="filter-dropdown-container">
          <button 
            className={`filter-dropdown-pill ${selectedCategory !== 'All' ? 'filter-active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
          >
            <span>Category: <strong>{selectedCategory}</strong></span>
            <ChevronDown size={13} className={openDropdown === 'category' ? 'rotate-180' : ''} />
          </button>
          {openDropdown === 'category' && (
            <div className="filter-popover-menu">
              {categoryOptions.map(cat => (
                <button
                  key={cat}
                  className={`menu-option-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(cat); setOpenDropdown(null); setActivePage(1); }}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check size={13} color="#0f766e" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Priority Dropdown */}
        <div className="filter-dropdown-container">
          <button 
            className={`filter-dropdown-pill ${selectedPriority !== 'All' ? 'filter-active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'priority' ? null : 'priority')}
          >
            <span>Priority: <strong>{selectedPriority}</strong></span>
            <ChevronDown size={13} className={openDropdown === 'priority' ? 'rotate-180' : ''} />
          </button>
          {openDropdown === 'priority' && (
            <div className="filter-popover-menu">
              {priorityOptions.map(p => (
                <button
                  key={p}
                  className={`menu-option-btn ${selectedPriority === p ? 'active' : ''}`}
                  onClick={() => { setSelectedPriority(p); setOpenDropdown(null); setActivePage(1); }}
                >
                  <span>{p}</span>
                  {selectedPriority === p && <Check size={13} color="#0f766e" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Review Status Dropdown */}
        <div className="filter-dropdown-container">
          <button 
            className={`filter-dropdown-pill ${selectedStatus !== 'All' ? 'filter-active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
          >
            <span>Status: <strong>{selectedStatus}</strong></span>
            <ChevronDown size={13} className={openDropdown === 'status' ? 'rotate-180' : ''} />
          </button>
          {openDropdown === 'status' && (
            <div className="filter-popover-menu">
              {statusOptions.map(s => (
                <button
                  key={s}
                  className={`menu-option-btn ${selectedStatus === s ? 'active' : ''}`}
                  onClick={() => { setSelectedStatus(s); setOpenDropdown(null); setActivePage(1); }}
                >
                  <span>{s}</span>
                  {selectedStatus === s && <Check size={13} color="#0f766e" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Risk Flag Dropdown */}
        <div className="filter-dropdown-container">
          <button 
            className={`filter-dropdown-pill ${selectedRisk !== 'All' ? 'filter-active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'risk' ? null : 'risk')}
          >
            <span>Risk Flag: <strong>{selectedRisk}</strong></span>
            <ChevronDown size={13} className={openDropdown === 'risk' ? 'rotate-180' : ''} />
          </button>
          {openDropdown === 'risk' && (
            <div className="filter-popover-menu">
              {riskOptions.map(r => (
                <button
                  key={r}
                  className={`menu-option-btn ${selectedRisk === r ? 'active' : ''}`}
                  onClick={() => { setSelectedRisk(r); setOpenDropdown(null); setActivePage(1); }}
                >
                  <span>{r}</span>
                  {selectedRisk === r && <Check size={13} color="#0f766e" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="reset-filters-btn" onClick={resetFilters}>
          <RotateCcw size={13} />
          <span>Reset filters</span>
        </button>
      </div>

      {/* Floating Batch Action Bar when items selected */}
      {selectedRows.length > 0 && (
        <div className="ai-floating-batch-bar">
          <div className="batch-info">
            <span className="batch-badge">{selectedRows.length}</span>
            <span>requests selected for bulk action</span>
          </div>
          <div className="batch-actions-cluster">
            <button className="btn-batch-action approve" onClick={handleBatchApprove}>
              <CheckCircle2 size={14} />
              <span>Batch Approve AI</span>
            </button>
            <button className="btn-batch-action escalate" onClick={handleBatchEscalate}>
              <AlertTriangle size={14} />
              <span>Escalate (CRITICAL)</span>
            </button>
            <button className="btn-batch-action export" onClick={handleExportCSV}>
              <Download size={14} />
              <span>Export Selected</span>
            </button>
            <button className="btn-batch-action clear" onClick={() => setSelectedRows([])}>
              <X size={14} />
              <span>Deselect</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table Card (Picture 2) */}
      <div className="ai-white-card no-padding overflow-table">
        <table className="queue-data-table">
          <thead>
            <tr>
              <th className="col-chk">
                <input 
                  type="checkbox" 
                  onChange={toggleSelectAll} 
                  checked={paginatedRows.length > 0 && paginatedRows.every(r => selectedRows.includes(r.id))} 
                  className="table-checkbox"
                />
              </th>
              <th>Request ID <span className="sort-arrows">⇅</span></th>
              <th>Category <span className="sort-arrows">⇅</span></th>
              <th>Location <span className="sort-arrows">⇅</span></th>
              <th>AI Priority <span className="sort-arrows">⇅</span></th>
              <th>Confidence <span className="sort-arrows">⇅</span></th>
              <th>Risk Flags</th>
              <th>Review Status <span className="sort-arrows">⇅</span></th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-table-cell">
                  <div className="empty-state-box">
                    <AlertTriangle size={24} color="#94a3b8" />
                    <h4>No matching requests found</h4>
                    <p>Try resetting filters or adjusting search parameters</p>
                    <button className="btn-solid-teal" onClick={resetFilters}>Reset Filters</button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => {
                const isSelected = selectedRows.includes(row.id);
                return (
                  <tr key={row.id} className={isSelected ? 'row-selected' : ''}>
                    <td className="col-chk">
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => toggleSelectRow(row.id)}
                        className="table-checkbox"
                      />
                    </td>
                    <td className="col-req-id">
                      <span className="req-link-text" onClick={() => onOpenReview(row.id)} title="Open Full Decision Review">
                        {row.id}
                      </span>
                    </td>
                    <td className="col-cat">
                      <span className="cat-text-strong">{row.category}</span>
                    </td>
                    <td className="col-loc" title={row.location}>
                      {row.location}
                    </td>
                    <td>
                      <span className={`badge-priority ${row.priorityColor}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="col-conf">
                      <div className="conf-progress-cell">
                        <span>{row.confidence}</span>
                        <div className="mini-conf-track">
                          <div 
                            className="mini-conf-fill" 
                            style={{ 
                              width: row.confidence,
                              backgroundColor: row.confidenceNum >= 90 ? '#10b981' : row.confidenceNum >= 80 ? '#f59e0b' : '#ef4444'
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {row.riskFlagType === 'alert' ? (
                        <span className="badge-risk-flag" title={row.riskFlag}>
                          <AlertTriangle size={11} className="flag-icon" />
                          <span>{row.riskFlag}</span>
                        </span>
                      ) : (
                        <span className="text-muted-dash">None</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge-review-status ${row.reviewStatusType}`}>
                        {row.reviewStatus}
                      </span>
                    </td>
                    <td className="text-right">
                      {row.actionType === 'review' || row.reviewStatus === 'Pending' ? (
                        <button 
                          className="tbl-action-btn solid-teal" 
                          onClick={() => onOpenReview(row.id)}
                          title="Review AI recommendation"
                        >
                          <Eye size={13} />
                          <span>Review</span>
                        </button>
                      ) : row.reviewStatus === 'In Review' ? (
                        <button 
                          className="tbl-action-btn outline-white" 
                          onClick={() => onOpenReview(row.id)}
                        >
                          <RotateCw size={13} />
                          <span>Continue</span>
                        </button>
                      ) : (
                        <button 
                          className="tbl-action-btn outline-white" 
                          onClick={() => onOpenTrace(row.id)}
                          title="View cryptographic decision trace"
                        >
                          <FileText size={13} />
                          <span>Trace</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table Footer with Working Pagination */}
        <div className="table-footer-bar">
          <div className="showing-records-text">
            Showing {filteredRows.length > 0 ? (activePage - 1) * pageSize + 1 : 0} – {Math.min(activePage * pageSize, filteredRows.length)} of {filteredRows.length} requests
          </div>

          <div className="pagination-btn-cluster">
            <button 
              className="page-arrow-btn" 
              onClick={() => setActivePage(prev => Math.max(1, prev - 1))}
              disabled={activePage === 1}
            >
              <ChevronLeft size={14} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`page-number-btn ${activePage === page ? 'active' : ''}`}
                onClick={() => setActivePage(page)}
              >
                {page}
              </button>
            ))}

            <button 
              className="page-arrow-btn" 
              onClick={() => setActivePage(prev => Math.min(totalPages, prev + 1))}
              disabled={activePage === totalPages}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: Ingest New Urgent Request */}
      {showNewModal && (
        <div className="ai-modal-backdrop" onClick={() => setShowNewModal(false)}>
          <div className="ai-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div className="modal-title-group">
                <div className="modal-header-icon-pill">
                  <Plus size={18} color="#0f766e" />
                </div>
                <div>
                  <h3 className="ai-modal-title">Ingest Emergency Request</h3>
                  <span className="ai-modal-subtitle">AI model will instantly categorize, triage and match resources</span>
                </div>
              </div>
              <button className="modal-close-icon" onClick={() => setShowNewModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNewRequest}>
              <div className="ai-modal-body form-grid-layout">
                <div className="modal-form-row">
                  <label>Incident Sector / Category</label>
                  <select 
                    value={newReqCategory} 
                    onChange={(e) => setNewReqCategory(e.target.value)}
                    className="modal-select-field"
                  >
                    <option>Medical Assistance</option>
                    <option>Food Supply</option>
                    <option>Shelter Support</option>
                    <option>Water Supply</option>
                    <option>Search &amp; Rescue</option>
                    <option>Volunteer Support</option>
                  </select>
                </div>

                <div className="modal-form-row">
                  <label>Location / Division</label>
                  <input 
                    type="text" 
                    value={newReqLocation}
                    onChange={(e) => setNewReqLocation(e.target.value)}
                    required
                    className="modal-input-field"
                  />
                </div>

                <div className="modal-split-fields">
                  <div className="modal-form-row">
                    <label>Caller / Reporting Party</label>
                    <input 
                      type="text" 
                      value={newReqCaller}
                      onChange={(e) => setNewReqCaller(e.target.value)}
                      required
                      className="modal-input-field"
                    />
                  </div>
                  <div className="modal-form-row">
                    <label>Contact Phone</label>
                    <input 
                      type="text" 
                      value={newReqPhone}
                      onChange={(e) => setNewReqPhone(e.target.value)}
                      required
                      className="modal-input-field"
                    />
                  </div>
                </div>

                <div className="modal-split-fields">
                  <div className="modal-form-row">
                    <label>Triage Priority</label>
                    <select 
                      value={newReqUrgency} 
                      onChange={(e) => setNewReqUrgency(e.target.value)}
                      className="modal-select-field"
                    >
                      <option value="CRITICAL">CRITICAL (Priority 1)</option>
                      <option value="HIGH">HIGH (Priority 2)</option>
                      <option value="MEDIUM">MEDIUM (Priority 3)</option>
                      <option value="LOW">LOW (Priority 4)</option>
                    </select>
                  </div>
                  <div className="modal-form-row">
                    <label>People Affected</label>
                    <input 
                      type="number" 
                      value={newReqCount}
                      onChange={(e) => setNewReqCount(e.target.value)}
                      min={1}
                      required
                      className="modal-input-field"
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <label>Incident Details / Raw Message</label>
                  <textarea 
                    rows={3}
                    value={newReqSummary}
                    onChange={(e) => setNewReqSummary(e.target.value)}
                    required
                    className="modal-textarea-field"
                  />
                </div>
              </div>

              <div className="ai-modal-footer">
                <button type="button" className="btn-outline-white" onClick={() => setShowNewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-solid-teal">
                  <Sparkles size={14} />
                  <span>Classify &amp; Enqueue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
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
  ChevronRight
} from 'lucide-react';

const QUEUE_TABLE_DATA = [
  {
    id: 'REQ-2026-01842',
    category: 'Medical Assistance',
    location: 'Colombo',
    priority: 'CRITICAL',
    priorityColor: 'critical',
    confidence: '88%',
    riskFlag: 'Road blockage',
    riskFlagType: 'alert',
    reviewStatus: 'Pending',
    reviewStatusType: 'pending',
    actionType: 'review'
  },
  {
    id: 'REQ-2026-01839',
    category: 'Food Supply',
    location: 'Gampaha',
    priority: 'HIGH',
    priorityColor: 'high',
    confidence: '91%',
    riskFlag: 'None',
    riskFlagType: 'none',
    reviewStatus: 'Pending',
    reviewStatusType: 'pending',
    actionType: 'review'
  },
  {
    id: 'REQ-2026-01835',
    category: 'Shelter Support',
    location: 'Negombo',
    priority: 'HIGH',
    priorityColor: 'high',
    confidence: '84%',
    riskFlag: 'Possible duplicate',
    riskFlagType: 'alert',
    reviewStatus: 'Pending',
    reviewStatusType: 'pending',
    actionType: 'review'
  },
  {
    id: 'REQ-2026-01831',
    category: 'Medical Assistance',
    location: 'Kalutara',
    priority: 'CRITICAL',
    priorityColor: 'critical',
    confidence: '79%',
    riskFlag: 'Medication need',
    riskFlagType: 'alert',
    reviewStatus: 'In Review',
    reviewStatusType: 'in-review',
    actionType: 'continue'
  },
  {
    id: 'REQ-2026-01828',
    category: 'Water Supply',
    location: 'Ratnapura',
    priority: 'MEDIUM',
    priorityColor: 'medium',
    confidence: '93%',
    riskFlag: 'None',
    riskFlagType: 'none',
    reviewStatus: 'Approved',
    reviewStatusType: 'approved',
    actionType: 'trace'
  },
  {
    id: 'REQ-2026-01824',
    category: 'Volunteer Support',
    location: 'Colombo',
    priority: 'LOW',
    priorityColor: 'low',
    confidence: '89%',
    riskFlag: 'None',
    riskFlagType: 'none',
    reviewStatus: 'Deferred',
    reviewStatusType: 'deferred',
    actionType: 'trace'
  }
];

export const DecisionSupportQueue = ({ onOpenReview, onOpenTrace, onBackOverview }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedRows, setSelectedRows] = useState([]);
  const [activePage, setActivePage] = useState(1);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(QUEUE_TABLE_DATA.map(r => r.id));
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
  };

  const filteredRows = QUEUE_TABLE_DATA.filter(row => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchId = row.id.toLowerCase().includes(q);
      const matchLoc = row.location.toLowerCase().includes(q);
      const matchCat = row.category.toLowerCase().includes(q);
      if (!matchId && !matchLoc && !matchCat) return false;
    }
    if (selectedCategory !== 'All' && !row.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
    if (selectedPriority !== 'All' && row.priority !== selectedPriority) return false;
    if (selectedStatus !== 'All' && row.reviewStatus !== selectedStatus) return false;
    return true;
  });

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
              placeholder="Search requests, locations, shelters..." 
              className="ai-search-input"
            />
          </div>

          <div className="ai-header-actions">
            <button className="header-icon-pill" title="Notifications">
              <Bell size={16} />
              <span className="badge-count">3</span>
            </button>
            <button className="header-icon-pill" title="Help">
              <HelpCircle size={16} />
            </button>
            <div className="user-avatar-badge">
              <span>AC</span>
              <ChevronDown size={12} className="chevron" />
            </div>
          </div>
        </div>
      </div>

      {/* Title & Action Buttons Header */}
      <div className="ai-page-title-row">
        <div>
          <h1 className="ai-main-heading">Decision Support Queue</h1>
          <p className="ai-main-subheading">
            Review AI-assisted recommendations and prioritize requests for human oversight.
          </p>
        </div>

        <div className="ai-head-btn-group">
          <button className="btn-solid-teal" onClick={() => onOpenReview('REQ-2026-01842')}>
            <Plus size={15} />
            <span>New Request</span>
          </button>
          <button className="btn-outline-white">
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards (Picture 2) */}
      <div className="ai-kpi-quad-grid queue-kpis">
        {/* 1. Pending Review */}
        <div className="ai-kpi-card-horizontal">
          <div className="kpi-icon-square green">
            <FileText size={20} color="#059669" />
          </div>
          <div className="kpi-info-side">
            <div className="kpi-side-number">24</div>
            <div className="kpi-side-label">Pending Review</div>
          </div>
        </div>

        {/* 2. High Priority */}
        <div className="ai-kpi-card-horizontal">
          <div className="kpi-icon-square red">
            <AlertTriangle size={20} color="#dc2626" />
          </div>
          <div className="kpi-info-side">
            <div className="kpi-side-number">12</div>
            <div className="kpi-side-label">High Priority</div>
          </div>
        </div>

        {/* 3. Risk Flags */}
        <div className="ai-kpi-card-horizontal">
          <div className="kpi-icon-square orange">
            <Flag size={20} color="#ea580c" />
          </div>
          <div className="kpi-info-side">
            <div className="kpi-side-number">4</div>
            <div className="kpi-side-label">Risk Flags</div>
          </div>
        </div>

        {/* 4. Deferred */}
        <div className="ai-kpi-card-horizontal">
          <div className="kpi-icon-square purple">
            <Clock size={20} color="#7c3aed" />
          </div>
          <div className="kpi-info-side">
            <div className="kpi-side-number">6</div>
            <div className="kpi-side-label">Deferred</div>
          </div>
        </div>
      </div>

      {/* Filter Bar Toolbar */}
      <div className="queue-filter-toolbar">
        <div className="filter-search-box">
          <Search size={14} className="filter-search-icon" />
          <input 
            type="text" 
            placeholder="Search request ID or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input-field"
          />
        </div>

        <div className="filter-dropdown-pill">
          <span>Category</span>
          <ChevronDown size={13} />
        </div>

        <div className="filter-dropdown-pill">
          <span>Priority</span>
          <ChevronDown size={13} />
        </div>

        <div className="filter-dropdown-pill">
          <span>Review Status</span>
          <ChevronDown size={13} />
        </div>

        <div className="filter-dropdown-pill">
          <span>Risk Flag</span>
          <ChevronDown size={13} />
        </div>

        <button className="reset-filters-btn" onClick={resetFilters}>
          <RotateCcw size={13} />
          <span>Reset filters</span>
        </button>
      </div>

      {/* Main Table Card (Picture 2) */}
      <div className="ai-white-card no-padding overflow-table">
        <table className="queue-data-table">
          <thead>
            <tr>
              <th className="col-chk">
                <input 
                  type="checkbox" 
                  onChange={toggleSelectAll} 
                  checked={selectedRows.length === QUEUE_TABLE_DATA.length && QUEUE_TABLE_DATA.length > 0} 
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
            {filteredRows.map((row) => {
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
                    <span className="req-link-text" onClick={() => onOpenReview(row.id)}>
                      {row.id}
                    </span>
                  </td>
                  <td className="col-cat">{row.category}</td>
                  <td className="col-loc">{row.location}</td>
                  <td>
                    <span className={`badge-priority ${row.priorityColor}`}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="col-conf">{row.confidence}</td>
                  <td>
                    {row.riskFlagType === 'alert' ? (
                      <span className="badge-risk-flag">
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
                    {row.actionType === 'review' ? (
                      <button 
                        className="tbl-action-btn solid-teal" 
                        onClick={() => onOpenReview(row.id)}
                      >
                        <Eye size={13} />
                        <span>Review</span>
                      </button>
                    ) : row.actionType === 'continue' ? (
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
                      >
                        <FileText size={13} />
                        <span>View Trace</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table Footer with Pagination */}
        <div className="table-footer-bar">
          <div className="showing-records-text">
            Showing 1 – {filteredRows.length} of 24 requests
          </div>

          <div className="pagination-btn-cluster">
            <button className="page-arrow-btn" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className={`page-number-btn ${activePage === 1 ? 'active' : ''}`} onClick={() => setActivePage(1)}>1</button>
            <button className={`page-number-btn ${activePage === 2 ? 'active' : ''}`} onClick={() => setActivePage(2)}>2</button>
            <button className={`page-number-btn ${activePage === 3 ? 'active' : ''}`} onClick={() => setActivePage(3)}>3</button>
            <button className={`page-number-btn ${activePage === 4 ? 'active' : ''}`} onClick={() => setActivePage(4)}>4</button>
            <button className="page-arrow-btn">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Calendar, 
  RotateCcw, 
  Eye, 
  Edit3, 
  MoreVertical, 
  Plus, 
  Sparkles, 
  Star, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  ClipboardList, 
  ExternalLink, 
  X,
  ChevronRight,
  ChevronLeft,
  Truck,
  Building2,
  Stethoscope
} from 'lucide-react';

import reqEvidence1 from '../../assets/req-evidence-1.jpg';
import reqLocationMap from '../../assets/req-location-map.jpg';
import sarahJohnson from '../../assets/sarah-johnson.jpg';
import { useAlert } from '../../context/AlertContext';

import './AssistanceRequestsListView.css';

const MOCK_REQUESTS = [
  {
    id: 'REQ-2026-01842',
    requester: 'N. Perera',
    fullName: 'Nimal Perera',
    phone: '+94 77 123 4567',
    email: 'nimalp@example.com',
    category: 'Medical',
    fullCategory: 'Medical Assistance',
    location: 'Colombo',
    fullLocation: 'Colombo, Western Province',
    coords: '6.9271° N, 79.8612° E',
    priority: 'Critical',
    aiScore: '91%',
    status: 'Under Review',
    created: '2 min ago',
    people: 3,
    specialRequirements: 'Elderly, wheelchair access',
    description: 'Elderly person with serious health condition needs immediate medical assistance. Unable to reach hospital due to flooding.'
  },
  {
    id: 'REQ-2026-01877',
    requester: 'S. Fernando',
    fullName: 'Sunil Fernando',
    phone: '+94 71 884 1029',
    email: 'sunil.f@example.com',
    category: 'Shelter',
    fullCategory: 'Emergency Shelter',
    location: 'Gampaha',
    fullLocation: 'Gampaha District - Zone B',
    coords: '7.0840° N, 79.9939° E',
    priority: 'High',
    aiScore: '87%',
    status: 'Assigned',
    created: '5 min ago',
    people: 6,
    specialRequirements: '2 infants, dry rations needed',
    description: 'House flooded up to waist level. Temporary shelter required immediately.'
  },
  {
    id: 'REQ-2026-01835',
    requester: 'K. Silva',
    fullName: 'Kamal Silva',
    phone: '+94 75 921 4452',
    email: 'kamal.silva@example.com',
    category: 'Food',
    fullCategory: 'Drinking Water & Rations',
    location: 'Kalutara',
    fullLocation: 'Kalutara South - Zone 3',
    coords: '6.5854° N, 79.9607° E',
    priority: 'High',
    aiScore: '82%',
    status: 'Pending',
    created: '8 min ago',
    people: 4,
    specialRequirements: 'Infant formula, potable water',
    description: 'Cut-off community sector without clean drinking water for over 18 hours.'
  },
  {
    id: 'REQ-2026-01628',
    requester: 'M. Jayasiri',
    fullName: 'Mahesh Jayasiri',
    phone: '+94 77 341 9081',
    email: 'm.jayasiri@example.com',
    category: 'Transport',
    fullCategory: 'Emergency Evacuation Transport',
    location: 'Negombo',
    fullLocation: 'Negombo Coastal Sector',
    coords: '7.2083° N, 79.8358° E',
    priority: 'Medium',
    aiScore: '76%',
    status: 'Under Review',
    created: '12 min ago',
    people: 2,
    specialRequirements: '4WD or boat evacuation required',
    description: 'Road obstruction due to falling trees and flash flooding.'
  },
  {
    id: 'REQ-2026-01821',
    requester: 'D. Perera',
    fullName: 'Dinesh Perera',
    phone: '+94 72 450 1192',
    email: 'dinesh.p@example.com',
    category: 'Evacuation',
    fullCategory: 'Precautionary Evacuation',
    location: 'Kalutara',
    fullLocation: 'Kalutara North River Basin',
    coords: '6.6022° N, 79.9711° E',
    priority: 'Medium',
    aiScore: '72%',
    status: 'Assigned',
    created: '15 min ago',
    people: 5,
    specialRequirements: 'Livestock transport assistance',
    description: 'Rising water levels in proximity to river dam.'
  },
  {
    id: 'REQ-2026-04415',
    requester: 'A. Kumara',
    fullName: 'Ajith Kumara',
    phone: '+94 78 512 8820',
    email: 'ajith.k@example.com',
    category: 'Medical',
    fullCategory: 'First Aid Supplies',
    location: 'Colombo',
    fullLocation: 'Colombo 05',
    coords: '6.8900° N, 79.8650° E',
    priority: 'Low',
    aiScore: '62%',
    status: 'Completed',
    created: '1 hour ago',
    people: 1,
    specialRequirements: 'Minor injury dressing',
    description: 'Superficial cuts from debris handled by volunteer team.'
  },
  {
    id: 'REQ-2026-04416',
    requester: 'T. Mendis',
    fullName: 'Tharindu Mendis',
    phone: '+94 76 991 3241',
    email: 'tmendis@example.com',
    category: 'Food',
    fullCategory: 'Community Cookpack',
    location: 'Matara',
    fullLocation: 'Matara Central',
    coords: '5.9549° N, 80.5550° E',
    priority: 'High',
    aiScore: '84%',
    status: 'Escalated',
    created: '2 hours ago',
    people: 15,
    specialRequirements: 'Bulk food preparation',
    description: 'Displaced community shelter running low on cooking gas and dry grain.'
  },
  {
    id: 'REQ-2026-04417',
    requester: 'R. Pathirana',
    fullName: 'Rohan Pathirana',
    phone: '+94 71 334 7761',
    email: 'rohan.p@example.com',
    category: 'Shelter',
    fullCategory: 'Tarpaulin & Tents',
    location: 'Galle',
    fullLocation: 'Galle Fort Boundary',
    coords: '6.0535° N, 80.2210° E',
    priority: 'Medium',
    aiScore: '71%',
    status: 'Pending',
    created: '3 hours ago',
    people: 8,
    specialRequirements: 'Weatherproof sheeting',
    description: 'Roof blew off secondary staging shelter.'
  },
  {
    id: 'REQ-2026-04418',
    requester: 'S. Wijesinghe',
    fullName: 'Sanduni Wijesinghe',
    phone: '+94 77 109 2384',
    email: 'sanduni.w@example.com',
    category: 'Accessibility',
    fullCategory: 'Disability Transport',
    location: 'Kandy',
    fullLocation: 'Peradeniya Sector',
    coords: '7.2600° N, 80.5900° E',
    priority: 'High',
    aiScore: '80%',
    status: 'Assigned',
    created: '4 hours ago',
    people: 2,
    specialRequirements: 'Electric wheelchair ramp',
    description: 'Medical evacuation required to higher ground hospital.'
  },
  {
    id: 'REQ-2026-04419',
    requester: 'P. Dissanayake',
    fullName: 'Pradeep Dissanayake',
    phone: '+94 70 882 1459',
    email: 'pradeep.d@example.com',
    category: 'Other',
    fullCategory: 'Power / Communication Link',
    location: 'Kurunegala',
    fullLocation: 'Kurunegala Town',
    coords: '7.4863° N, 80.3623° E',
    priority: 'Low',
    aiScore: '60%',
    status: 'Under Review',
    created: '5 hours ago',
    people: 3,
    specialRequirements: 'Generator fuel or satellite radio',
    description: 'Local relief coordination office power outage.'
  }
];

export const AssistanceRequestsListView = ({ 
  onSelectFullDetail,
  onOpenMap,
  isEmbedded = false
}) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  // Selected request (defaults to REQ-2026-01842 matching screenshot)
  const [selectedReqId, setSelectedReqId] = useState('REQ-2026-01842');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerTab, setDrawerTab] = useState('details');

  // Selected checkboxes
  const [checkedIds, setCheckedIds] = useState([]);

  const selectedRequest = MOCK_REQUESTS.find(r => r.id === selectedReqId) || MOCK_REQUESTS[0];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setCheckedIds(MOCK_REQUESTS.map(r => r.id));
    } else {
      setCheckedIds([]);
    }
  };

  const handleToggleRow = (id, e) => {
    e.stopPropagation();
    setCheckedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRowClick = (req) => {
    setSelectedReqId(req.id);
    setDrawerOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterCategory('All');
    setFilterStatus('All');
    setFilterPriority('All');
    showAlert("Filters reset to default view.", "info");
  };

  const getPriorityClass = (prio) => {
    switch (prio.toLowerCase()) {
      case 'critical': return 'arl-prio-critical';
      case 'high': return 'arl-prio-high';
      case 'medium': return 'arl-prio-medium';
      case 'low': return 'arl-prio-low';
      default: return 'arl-prio-low';
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'under review': return 'arl-status-under-review';
      case 'assigned': return 'arl-status-assigned';
      case 'pending': return 'arl-status-pending';
      case 'completed': return 'arl-status-completed';
      case 'escalated': return 'arl-status-escalated';
      default: return 'arl-status-pending';
    }
  };

  return (
    <div className="arl-container">
      {/* 1. Header Bar (rendered if standalone or embedded) */}
      {!isEmbedded && (
        <header className="arl-header-bar">
          <div className="arl-header-left">
            <div className="arl-header-icon-box">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#0e6f76" strokeWidth="2.5" />
                <path d="M12 12C12 9.79 13.79 8 16 8C18.21 8 20 9.79 20 12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="16" cy="16" r="3" fill="#0284c7" />
                <path d="M10 22C11 19 13.5 18 16 18C18.5 18 21 19 22 22" stroke="#0e6f76" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="arl-header-title">Assistance Requests</h1>
              <p className="arl-header-subtitle">Manage, review and coordinate all emergency assistance requests</p>
            </div>
          </div>

          <div className="arl-header-search-wrap">
            <Search size={14} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search requests by ID, location, category..." 
              className="arl-header-search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="arl-header-right-tools">
            <button className="arl-bell-btn" title="Notifications">
              <Bell size={18} />
              <span className="arl-bell-badge">3</span>
            </button>

            <div className="arl-user-profile">
              <img src={sarahJohnson} alt="Sarah Johnson" className="arl-user-avatar" />
              <div>
                <div className="arl-user-name">Sarah Johnson</div>
                <div className="arl-user-role">Emergency Coordinator</div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 2. Body Content */}
      <div className="arl-body-wrap">
        {/* KPI Stat Cards Row */}
        <div className="arl-kpi-row">
          <div className="arl-kpi-cards-group">
            {/* Total Requests */}
            <div className="arl-kpi-card">
              <div className="arl-kpi-icon-box" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                <ClipboardList size={18} />
              </div>
              <div className="arl-kpi-content">
                <span className="arl-kpi-label">Total Requests</span>
                <div className="arl-kpi-num-row">
                  <span className="arl-kpi-value">186</span>
                  <span className="arl-kpi-trend arl-trend-green">↑ 12%</span>
                </div>
              </div>
            </div>

            {/* Critical */}
            <div className="arl-kpi-card">
              <div className="arl-kpi-icon-box" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                <AlertTriangle size={18} />
              </div>
              <div className="arl-kpi-content">
                <span className="arl-kpi-label">Critical</span>
                <div className="arl-kpi-num-row">
                  <span className="arl-kpi-value">24</span>
                  <span className="arl-kpi-trend arl-trend-red">↑ 8%</span>
                </div>
              </div>
            </div>

            {/* High Priority */}
            <div className="arl-kpi-card">
              <div className="arl-kpi-icon-box" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                <AlertCircle size={18} />
              </div>
              <div className="arl-kpi-content">
                <span className="arl-kpi-label">High Priority</span>
                <div className="arl-kpi-num-row">
                  <span className="arl-kpi-value">48</span>
                  <span className="arl-kpi-trend arl-trend-green">↑ 5%</span>
                </div>
              </div>
            </div>

            {/* Pending Review */}
            <div className="arl-kpi-card">
              <div className="arl-kpi-icon-box" style={{ backgroundColor: '#eff6ff', color: '#0284c7' }}>
                <Clock size={18} />
              </div>
              <div className="arl-kpi-content">
                <span className="arl-kpi-label">Pending Review</span>
                <div className="arl-kpi-num-row">
                  <span className="arl-kpi-value">62</span>
                  <span className="arl-kpi-trend arl-trend-red">↑ 15%</span>
                </div>
              </div>
            </div>

            {/* Resolved */}
            <div className="arl-kpi-card">
              <div className="arl-kpi-icon-box" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <CheckCircle size={18} />
              </div>
              <div className="arl-kpi-content">
                <span className="arl-kpi-label">Resolved</span>
                <div className="arl-kpi-num-row">
                  <span className="arl-kpi-value">52</span>
                  <span className="arl-kpi-trend arl-trend-green">→ 18%</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="arl-btn-new-request"
            onClick={() => navigate('/citizen/submit')}
          >
            <Plus size={15} />
            <span>+ New Request</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="arl-filter-bar">
          <div className="arl-filter-search-box">
            <Search size={13} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search requests..." 
              className="arl-filter-search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="arl-filter-select"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Medical">Medical</option>
            <option value="Shelter">Shelter</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Evacuation">Evacuation</option>
          </select>

          <select 
            className="arl-filter-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <select 
            className="arl-filter-select"
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="arl-filter-date-box">
            <Calendar size={13} color="#64748b" />
            <span>01/06/2026 - 30/06/2026</span>
          </div>

          <button className="arl-filter-btn-reset" onClick={handleResetFilters}>
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>

        {/* Split Content: Table on Left + Drawer on Right */}
        <div className="arl-split-content">
          {/* Requests Table */}
          <div className="arl-table-card">
            <div className="arl-table-wrap">
              <table className="arl-table">
                <thead>
                  <tr>
                    <th style={{ width: '32px' }}>
                      <input 
                        type="checkbox" 
                        checked={checkedIds.length === MOCK_REQUESTS.length}
                        onChange={handleSelectAll}
                        style={{ accentColor: '#0e6f76' }}
                      />
                    </th>
                    <th>Request ID</th>
                    <th>Requester</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>AI Score</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_REQUESTS.map((req) => {
                    const isSelected = selectedReqId === req.id && drawerOpen;
                    return (
                      <tr 
                        key={req.id} 
                        className={isSelected ? 'active-selected-row' : ''}
                        onClick={() => handleRowClick(req)}
                      >
                        <td onClick={e => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={checkedIds.includes(req.id)}
                            onChange={(e) => handleToggleRow(req.id, e)}
                            style={{ accentColor: '#0e6f76' }}
                          />
                        </td>
                        <td className="arl-req-id">{req.id}</td>
                        <td>{req.requester}</td>
                        <td>{req.category}</td>
                        <td>{req.location}</td>
                        <td>
                          <span className={`arl-prio-pill ${getPriorityClass(req.priority)}`}>
                            {req.priority}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{req.aiScore}</td>
                        <td>
                          <span className={`arl-status-pill ${getStatusClass(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td style={{ color: '#64748b' }}>{req.created}</td>
                        <td onClick={e => e.stopPropagation()}>
                          <div className="arl-actions-cell">
                            <button 
                              className="arl-action-icon-btn" 
                              title="View Full Details"
                              onClick={() => onSelectFullDetail ? onSelectFullDetail(req.id) : handleRowClick(req)}
                            >
                              <Eye size={13} />
                            </button>
                            <button 
                              className="arl-action-icon-btn" 
                              title="Edit"
                              onClick={() => showAlert(`Editing ${req.id}`, "info")}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button 
                              className="arl-action-icon-btn" 
                              title="More"
                            >
                              <MoreVertical size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="arl-table-footer">
              <span>Showing 1-10 of 186 requests</span>
              <div className="arl-pagination">
                <button className="arl-page-btn" title="Previous Page">
                  <ChevronLeft size={13} />
                </button>
                <button className="arl-page-btn active">1</button>
                <button className="arl-page-btn">2</button>
                <button className="arl-page-btn">3</button>
                <button className="arl-page-btn">4</button>
                <button className="arl-page-btn">5</button>
                <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>
                <button className="arl-page-btn">19</button>
                <button className="arl-page-btn" title="Next Page">
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Drawer Panel */}
          {drawerOpen && selectedRequest && (
            <aside className="arl-drawer-panel">
              {/* Drawer Top Row */}
              <div className="arl-drawer-top-row">
                <div className="arl-drawer-title-stack">
                  <div 
                    className="arl-drawer-id"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectFullDetail && onSelectFullDetail(selectedRequest.id)}
                    title="Click to open full page view"
                  >
                    Request #{selectedRequest.id}
                  </div>
                  <div className="arl-drawer-badge-row">
                    <span className="arl-drawer-badge-crit">+ {selectedRequest.priority}</span>
                    <span className="arl-drawer-badge-review">{selectedRequest.status}</span>
                    <span className="arl-drawer-time">
                      <Clock size={11} />
                      <span>{selectedRequest.created}</span>
                    </span>
                  </div>
                </div>

                <button 
                  className="arl-drawer-btn-close" 
                  onClick={() => setDrawerOpen(false)}
                  title="Close Side Panel"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="arl-drawer-tabs">
                <button 
                  className={`arl-drawer-tab-btn ${drawerTab === 'details' ? 'active' : ''}`}
                  onClick={() => setDrawerTab('details')}
                >
                  Details
                </button>
                <button 
                  className={`arl-drawer-tab-btn ${drawerTab === 'ai' ? 'active' : ''}`}
                  onClick={() => setDrawerTab('ai')}
                >
                  AI Recommendation
                </button>
                <button 
                  className={`arl-drawer-tab-btn ${drawerTab === 'history' ? 'active' : ''}`}
                  onClick={() => setDrawerTab('history')}
                >
                  History
                </button>
                <button 
                  className={`arl-drawer-tab-btn ${drawerTab === 'attachments' ? 'active' : ''}`}
                  onClick={() => setDrawerTab('attachments')}
                >
                  Attachments
                </button>
              </div>

              {/* Drawer Tab: Details */}
              {drawerTab === 'details' && (
                <>
                  <div className="arl-drawer-info-grid">
                    {/* Left Column: Requester + Request details */}
                    <div className="arl-drawer-left-col">
                      {/* Requester Information */}
                      <div className="arl-drawer-requester-wrap">
                        <div className="arl-drawer-section-title">Requester Information</div>
                        <div className="arl-drawer-user-row">
                          <div className="arl-drawer-avatar-circle">
                            <User size={16} />
                          </div>
                          <span className="arl-drawer-user-name">{selectedRequest.fullName}</span>
                        </div>
                        <div className="arl-drawer-sub-contact">{selectedRequest.phone}</div>
                        <div className="arl-drawer-sub-contact">{selectedRequest.email}</div>
                        <div className="arl-drawer-badge-vuln">🛡 Vulnerable household</div>
                      </div>

                      {/* Request Details */}
                      <div className="arl-drawer-details-wrap">
                        <div className="arl-drawer-section-title">Request Details</div>
                        <div className="arl-drawer-detail-item">
                          <span className="arl-drawer-dt-label">Category</span>
                          <span className="arl-drawer-dt-val">{selectedRequest.fullCategory}</span>
                        </div>
                        <div className="arl-drawer-detail-item">
                          <span className="arl-drawer-dt-label">Location</span>
                          <span className="arl-drawer-dt-val">{selectedRequest.fullLocation}</span>
                        </div>
                        <div className="arl-drawer-detail-item">
                          <span className="arl-drawer-dt-label">Number of People</span>
                          <span className="arl-drawer-dt-val">{selectedRequest.people}</span>
                        </div>
                        <div className="arl-drawer-detail-item">
                          <span className="arl-drawer-dt-label">Special Requirements</span>
                          <span className="arl-drawer-dt-val">{selectedRequest.specialRequirements}</span>
                        </div>
                        <div className="arl-drawer-desc-block">
                          <strong style={{ color: '#0f172a' }}>Description: </strong>
                          {selectedRequest.description}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Evidence Photo + Map Preview */}
                    <div className="arl-drawer-right-col">
                      <img 
                        src={reqEvidence1} 
                        alt="Flooded sector" 
                        className="arl-drawer-photo-thumb"
                      />

                      <div className="arl-drawer-map-box">
                        <img 
                          src={reqLocationMap} 
                          alt="Colombo map" 
                          className="arl-drawer-map-img"
                        />
                      </div>

                      <div className="arl-drawer-map-caption">
                        <strong>{selectedRequest.location}</strong>
                        <div>{selectedRequest.coords}</div>
                      </div>

                      <button 
                        className="arl-drawer-btn-map"
                        onClick={() => onOpenMap ? onOpenMap() : navigate('/map')}
                      >
                        <ExternalLink size={11} />
                        <span>View on Map</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Recommendation Card */}
                  <div className="arl-drawer-ai-card">
                    <div className="arl-drawer-ai-header">
                      <div className="arl-drawer-ai-title-wrap">
                        <Sparkles size={14} color="#7c3aed" />
                        <span>AI Recommendation</span>
                      </div>
                      <button 
                        className="arl-drawer-btn-full-analysis"
                        onClick={() => onSelectFullDetail ? onSelectFullDetail(selectedRequest.id) : setDrawerTab('ai')}
                      >
                        <span>View Full Analysis</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* Priority & Confidence */}
                    <div className="arl-drawer-ai-metrics">
                      <div className="arl-drawer-prio-red-box">
                        <Star size={11} fill="#ffffff" stroke="#ffffff" />
                        <span>HIGH</span>
                      </div>

                      <div className="arl-drawer-gauge-box">
                        <svg className="arl-drawer-gauge-svg" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                          <circle 
                            cx="18" 
                            cy="18" 
                            r="14" 
                            fill="none" 
                            stroke="#0d9488" 
                            strokeWidth="3" 
                            strokeDasharray="88" 
                            strokeDashoffset="8"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="arl-drawer-gauge-text">{selectedRequest.aiScore}</span>
                      </div>
                    </div>

                    {/* Reasoning Factors */}
                    <div className="arl-drawer-factors-wrap">
                      <div style={{ fontWeight: 700, color: '#334155', marginBottom: '2px' }}>Reasoning Factors</div>
                      <div className="arl-drawer-factor-item">
                        <span className="arl-dot-green"></span>
                        <span>Medical emergency detected</span>
                      </div>
                      <div className="arl-drawer-factor-item">
                        <span className="arl-dot-green"></span>
                        <span>Vulnerable household (elderly)</span>
                      </div>
                      <div className="arl-drawer-factor-item">
                        <span className="arl-dot-green"></span>
                        <span>Located within flood affected zone</span>
                      </div>
                      <div className="arl-drawer-factor-item">
                        <span className="arl-dot-green"></span>
                        <span>Limited access to healthcare</span>
                      </div>
                    </div>

                    {/* Suggested Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontWeight: 700, color: '#334155', fontSize: '10.5px' }}>Suggested Actions</div>
                      <div className="arl-drawer-actions-chips">
                        <span className="arl-chip-action arl-chip-blue">
                          <Stethoscope size={10} />
                          <span>Medical team</span>
                        </span>
                        <span className="arl-chip-action arl-chip-green">
                          <Building2 size={10} />
                          <span>Temporary shelter</span>
                        </span>
                        <span className="arl-chip-action arl-chip-blue">
                          <Truck size={10} />
                          <span>Transport support</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="arl-drawer-bottom-actions">
                      <button 
                        className="arl-drawer-btn-approve"
                        onClick={() => showAlert(`Request ${selectedRequest.id} Approved!`, "success")}
                      >
                        Approve
                      </button>
                      <button 
                        className="arl-drawer-btn-modify"
                        onClick={() => showAlert(`Modify priority modal for ${selectedRequest.id}`, "info")}
                      >
                        Modify
                      </button>
                      <button 
                        className="arl-drawer-btn-reject"
                        onClick={() => showAlert(`Request ${selectedRequest.id} marked as Rejected.`, "error")}
                      >
                        Reject
                      </button>
                      <button 
                        className="arl-drawer-btn-defer"
                        onClick={() => showAlert(`Request ${selectedRequest.id} deferred.`, "info")}
                      >
                        Defer
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Drawer Tab: History */}
              {drawerTab === 'history' && (
                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>• 10:24 AM - Request logged by {selectedRequest.fullName}</div>
                  <div>• 10:25 AM - AI prioritized as {selectedRequest.priority} ({selectedRequest.aiScore})</div>
                  <div>• 10:27 AM - Awaiting triage coordinator approval</div>
                </div>
              )}

              {/* Drawer Tab: Attachments */}
              {drawerTab === 'attachments' && (
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  <div>Medical Report.pdf (1.2 MB)</div>
                  <div>Field_Photo_01.jpg (240 KB)</div>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};


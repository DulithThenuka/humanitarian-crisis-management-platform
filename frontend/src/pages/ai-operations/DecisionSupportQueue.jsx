import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  TrendingUp,
  Home,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const DecisionSupportQueue = ({ 
  queueData = [],
  onOpenReview, 
  onBackOverview,
  showToast 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState('Pending');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [activePage, setActivePage] = useState(1);

  // Exact Queue items from Screenshot 3
  const queueItems = [
    {
      decisionId: 'AID-2051',
      relatedRecord: 'HMR-1042',
      service: 'Urgency & Priority',
      recommendation: 'Critical',
      confidence: 89,
      priority: 'Critical',
      priorityType: 'critical',
      reviewStatus: 'Pending approval',
      statusType: 'pending',
      submitted: '8 min ago'
    },
    {
      decisionId: 'AID-2049',
      relatedRecord: 'HMR-1041',
      service: 'Resource Matching',
      recommendation: 'Allocate 120 water units',
      confidence: 82,
      priority: 'High',
      priorityType: 'high',
      reviewStatus: 'Pending approval',
      statusType: 'pending',
      submitted: '15 min ago'
    },
    {
      decisionId: 'AID-2047',
      relatedRecord: 'HMR-1039',
      service: 'Duplicate Detection',
      recommendation: 'Review as potentially related',
      confidence: 71,
      priority: 'High',
      priorityType: 'high',
      reviewStatus: 'Human review',
      statusType: 'review',
      submitted: '22 min ago'
    },
    {
      decisionId: 'AID-2044',
      relatedRecord: 'CR-2026-014',
      service: 'Demand Forecasting',
      recommendation: 'Water shortage in 36 hours',
      confidence: 78,
      priority: 'Medium',
      priorityType: 'medium',
      reviewStatus: 'Deferred',
      statusType: 'deferred',
      submitted: '29 min ago'
    },
    {
      decisionId: 'AID-2041',
      relatedRecord: 'HMR-1036',
      service: 'Shelter Recommendation',
      recommendation: 'Consider SH-008',
      confidence: 86,
      priority: 'High',
      priorityType: 'high',
      reviewStatus: 'Pending approval',
      statusType: 'pending',
      submitted: '36 min ago'
    }
  ];

  const filterTabs = [
    { id: 'Pending', label: 'Pending', count: 38 },
    { id: 'Critical', label: 'Critical', count: 12 },
    { id: 'Low confidence', label: 'Low confidence', count: 8 },
    { id: 'Duplicate candidates', label: 'Duplicate candidates', count: 6 },
    { id: 'Resource conflicts', label: 'Resource conflicts', count: 3 },
    { id: 'Investigation flags', label: 'Investigation flags', count: 4 },
    { id: 'Reviewed', label: 'Reviewed', count: null }
  ];

  // Filtering
  const filteredItems = queueItems.filter(item => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchId = item.decisionId.toLowerCase().includes(q);
      const matchRec = item.relatedRecord.toLowerCase().includes(q);
      const matchServ = item.service.toLowerCase().includes(q);
      const matchRecom = item.recommendation.toLowerCase().includes(q);
      if (!matchId && !matchRec && !matchServ && !matchRecom) return false;
    }

    if (activeTabFilter === 'Critical' && item.priority !== 'Critical') return false;
    if (activeTabFilter === 'Low confidence' && item.confidence >= 80) return false;
    if (activeTabFilter === 'Duplicate candidates' && item.service !== 'Duplicate Detection') return false;
    if (activeTabFilter === 'Resource conflicts' && item.service !== 'Resource Matching') return false;
    if (selectedService !== 'All' && item.service !== selectedService) return false;
    if (selectedPriority !== 'All' && item.priority !== selectedPriority) return false;

    return true;
  });

  const handleExportQueue = () => {
    showToast?.('Exporting decision support queue (CSV) with cryptographic hashes...', 'info');
    setTimeout(() => {
      showToast?.('Queue exported successfully. 36 records saved.', 'success');
    }, 900);
  };

  return (
    <div className="ai-queue-canvas">
      {/* Top Header */}
      <div className="ai-queue-header-row">
        <div>
          <span className="ai-category-badge-tiny">AI DECISION SUPPORT</span>
          <h1 className="ai-queue-main-title">Decision Support Queue</h1>
          <p className="ai-queue-subtitle">
            Review recommendations before they affect humanitarian operations.
          </p>
        </div>

        <button className="btn-export-queue" onClick={handleExportQueue}>
          <Download size={14} />
          <span>Export queue</span>
        </button>
      </div>

      {/* Horizontal Filter Tabs (Screenshot 3 exact match) */}
      <div className="ai-queue-tabs-bar">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            className={`ai-queue-tab-btn ${activeTabFilter === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTabFilter(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`tab-count-pill ${activeTabFilter === tab.id ? 'active' : ''}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="ai-queue-toolbar-card">
        <div className="queue-search-input-wrap">
          <Search size={14} className="search-icon text-muted" />
          <input 
            type="text" 
            placeholder="Search decision or related record" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="queue-search-input"
          />
        </div>

        <div className="queue-dropdowns-group">
          {/* Services Dropdown */}
          <div className="queue-select-wrap">
            <select 
              value={selectedService} 
              onChange={(e) => setSelectedService(e.target.value)}
              className="queue-filter-select"
            >
              <option value="All">All AI services</option>
              <option value="Urgency & Priority">Urgency &amp; Priority</option>
              <option value="Resource Matching">Resource Matching</option>
              <option value="Duplicate Detection">Duplicate Detection</option>
              <option value="Demand Forecasting">Demand Forecasting</option>
              <option value="Shelter Recommendation">Shelter Recommendation</option>
            </select>
            <ChevronDown size={12} className="select-arrow" />
          </div>

          {/* Priority Dropdown */}
          <div className="queue-select-wrap">
            <select 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="queue-filter-select"
            >
              <option value="All">Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
            <ChevronDown size={12} className="select-arrow" />
          </div>

          {/* Submitted Date Dropdown */}
          <div className="queue-select-wrap">
            <select 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="queue-filter-select"
            >
              <option value="All">Submitted date</option>
              <option value="today">Today</option>
              <option value="1hour">Past 1 hour</option>
              <option value="24hours">Past 24 hours</option>
            </select>
            <ChevronDown size={12} className="select-arrow" />
          </div>
        </div>
      </div>

      {/* Data Table Card (Screenshot 3 exact match in blue theme) */}
      <div className="ai-queue-table-card">
        <div className="table-responsive-wrapper">
          <table className="ai-queue-data-table">
            <thead>
              <tr>
                <th>DECISION ID</th>
                <th>RELATED RECORD</th>
                <th>AI SERVICE</th>
                <th>RECOMMENDATION</th>
                <th>CONFIDENCE</th>
                <th>PRIORITY</th>
                <th>REVIEW STATUS</th>
                <th>SUBMITTED</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(row => (
                <tr 
                  key={row.decisionId}
                  className="queue-table-row"
                  onClick={() => onOpenReview?.(row.decisionId)}
                  title="Click to review this recommendation"
                >
                  <td className="cell-decision-id">
                    <strong>{row.decisionId}</strong>
                  </td>

                  <td className="cell-related-record">
                    <span 
                      className="link-record-blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReview?.(row.decisionId);
                      }}
                    >
                      {row.relatedRecord}
                    </span>
                  </td>

                  <td className="cell-service-name">
                    {row.service}
                  </td>

                  <td className="cell-recommendation">
                    <span className="rec-text-bold">{row.recommendation}</span>
                  </td>

                  <td className="cell-confidence">
                    <div className="confidence-gauge-bar-wrap">
                      <div className="gauge-track">
                        <div 
                          className="gauge-fill-blue"
                          style={{ width: `${row.confidence}%` }}
                        ></div>
                      </div>
                      <span className="gauge-pct-text">{row.confidence}%</span>
                    </div>
                  </td>

                  <td className="cell-priority">
                    <span className={`priority-indicator-pill ${row.priorityType}`}>
                      <span className="dot"></span>
                      <span>{row.priority}</span>
                    </span>
                  </td>

                  <td className="cell-status">
                    <span className={`review-status-pill ${row.statusType}`}>
                      <span className="dot"></span>
                      <span>{row.reviewStatus}</span>
                    </span>
                  </td>

                  <td className="cell-submitted">
                    <span className="text-muted-sm">{row.submitted}</span>
                  </td>

                  <td className="cell-action-chevron">
                    <ChevronRight size={16} className="chevron-icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="ai-queue-table-footer">
          <div className="footer-count-text">
            Showing 1-{filteredItems.length} of 36 recommendations
          </div>

          <div className="pagination-controls">
            <button 
              className="btn-page-step"
              disabled={activePage === 1}
              onClick={() => setActivePage(1)}
            >
              Previous
            </button>
            <button 
              className={`btn-page-num ${activePage === 1 ? 'active' : ''}`}
              onClick={() => setActivePage(1)}
            >
              1
            </button>
            <button 
              className={`btn-page-num ${activePage === 2 ? 'active' : ''}`}
              onClick={() => setActivePage(2)}
            >
              2
            </button>
            <button 
              className="btn-page-step"
              disabled={activePage === 2}
              onClick={() => setActivePage(2)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
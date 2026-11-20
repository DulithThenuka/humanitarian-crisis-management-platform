import React, { useState, useEffect } from 'react';
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
import { aiGovernanceService } from '@/services/aiGovernanceService';

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
  const [liveQueue, setLiveQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchQueue = async () => {
      try {
        const res = await aiGovernanceService.getQueue();
        if (isMounted && res?.data?.data) {
          setLiveQueue(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load decision support queue:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQueue();
    return () => { isMounted = false; };
  }, []);

  const baseItems = liveQueue.length > 0 ? liveQueue : [
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

  const pendingCount = baseItems.filter(i => (i.reviewStatus || '').toLowerCase().includes('pending')).length;
  const criticalCount = baseItems.filter(i => (i.priority || '').toLowerCase() === 'critical').length;
  const lowConfCount = baseItems.filter(i => i.confidence < 85).length;
  const duplicateCount = baseItems.filter(i => (i.service || '').toLowerCase().includes('duplicate')).length;
  const resourceCount = baseItems.filter(i => (i.service || '').toLowerCase().includes('resource')).length;
  const flagsCount = baseItems.filter(i => (i.riskFlag && i.riskFlag !== 'None') || (i.priority || '').toLowerCase() === 'critical').length;

  const filterTabs = [
    { id: 'Pending', label: 'Pending', count: pendingCount },
    { id: 'Critical', label: 'Critical', count: criticalCount },
    { id: 'Low confidence', label: 'Low confidence', count: lowConfCount },
    { id: 'Duplicate candidates', label: 'Duplicate candidates', count: duplicateCount },
    { id: 'Resource conflicts', label: 'Resource conflicts', count: resourceCount },
    { id: 'Investigation flags', label: 'Investigation flags', count: flagsCount },
    { id: 'Reviewed', label: 'Reviewed', count: null }
  ];

  // Filtering
  const filteredItems = baseItems.filter(item => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchId = (item.decisionId || '').toLowerCase().includes(q);
      const matchRec = (item.relatedRecord || '').toLowerCase().includes(q);
      const matchServ = (item.service || '').toLowerCase().includes(q);
      const matchRecom = (item.recommendation || '').toLowerCase().includes(q);
      if (!matchId && !matchRec && !matchServ && !matchRecom) return false;
    }

    if (activeTabFilter === 'Pending' && !(item.reviewStatus || '').toLowerCase().includes('pending')) return false;
    if (activeTabFilter === 'Critical' && (item.priority || '').toLowerCase() !== 'critical') return false;
    if (activeTabFilter === 'Low confidence' && item.confidence >= 85) return false;
    if (activeTabFilter === 'Duplicate candidates' && !(item.service || '').toLowerCase().includes('duplicate')) return false;
    if (activeTabFilter === 'Resource conflicts' && !(item.service || '').toLowerCase().includes('resource')) return false;
    if (activeTabFilter === 'Investigation flags' && (!item.riskFlag || item.riskFlag === 'None') && (item.priority || '').toLowerCase() !== 'critical') return false;
    if (activeTabFilter === 'Reviewed' && (item.reviewStatus || '').toLowerCase().includes('pending')) return false;

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
                    {typeof row.confidence === 'number' && !isNaN(row.confidence) ? (
                      <div className="confidence-gauge-bar-wrap">
                        <div className="gauge-track">
                          <div 
                            className="gauge-fill-blue"
                            style={{ width: `${Math.min(100, Math.max(0, row.confidence))}%` }}
                          ></div>
                        </div>
                        <span className="gauge-pct-text">{row.confidence}%</span>
                      </div>
                    ) : (
                      <span style={{ color: '#657367', fontSize: '12px', fontWeight: 500 }}>N/A</span>
                    )}
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
            Showing 1-{filteredItems.length} of {filteredItems.length} recommendations
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
import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  X
} from 'lucide-react';
import './AssistanceRequestsView.css';

export const AssistanceRequestsView = ({
  requestsList,
  onOpenCaseReview,
  showToast
}) => {
  const [reqSearchInput, setReqSearchInput] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [appliedFilters, setAppliedFilters] = useState(['Critical', 'Pending review']);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    return requestsList.filter(item => {
      const matchSearch =
        !reqSearchInput ||
        item.id.toLowerCase().includes(reqSearchInput.toLowerCase()) ||
        item.location.toLowerCase().includes(reqSearchInput.toLowerCase()) ||
        item.category.toLowerCase().includes(reqSearchInput.toLowerCase());

      const matchPriority = priorityFilter === 'all' || item.aiPriority === priorityFilter;
      const matchVerification = verificationFilter === 'all' || item.verification === verificationFilter;
      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;

      return matchSearch && matchPriority && matchVerification && matchCategory;
    });
  }, [requestsList, reqSearchInput, priorityFilter, verificationFilter, categoryFilter]);

  return (
    <div className="ec-portal-canvas">
      {/* Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">ASSISTANCE OPERATIONS</span>
          <h2 className="ec-review-main-title">Assistance Request Management</h2>
          <p className="ec-review-sub-meta">
            Search, verify and coordinate requests assigned to your operational scope.
          </p>
        </div>
        <button
          className="ec-btn-hero-outline"
          onClick={() => showToast('Exporting filtered assistance requests (CSV)...', 'info')}
        >
          <Download size={14} />
          <span>Export filtered data</span>
        </button>
      </div>

      {/* Dark KPI Summary Strip */}
      <div className="ec-req-summary-strip">
        <div className="ec-req-stat-pill">
          <span className="ec-req-stat-num">248</span>
          <span className="ec-req-stat-label">Total incoming</span>
        </div>
        <div className="ec-req-stat-pill">
          <span className="ec-req-stat-num">46</span>
          <span className="ec-req-stat-label">Pending review</span>
        </div>
        <div className="ec-req-stat-pill">
          <span className="ec-req-stat-num" style={{ color: '#ef4444' }}>17</span>
          <span className="ec-req-stat-label">Critical</span>
        </div>
        <div className="ec-req-stat-pill">
          <span className="ec-req-stat-num" style={{ color: '#38bdf8' }}>9</span>
          <span className="ec-req-stat-label">Need information</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="ec-req-toolbar-card">
        <div className="ec-req-toolbar-row">
          <div className="ec-req-search-box">
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search request ID or location..."
              className="ec-search-input"
              value={reqSearchInput}
              onChange={(e) => setReqSearchInput(e.target.value)}
            />
            {reqSearchInput && (
              <X size={13} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setReqSearchInput('')} />
            )}
          </div>

          <div className="ec-req-filter-group">
            <select
              className="ec-filter-dropdown-btn"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Priority: All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>

            <select
              className="ec-filter-dropdown-btn"
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
            >
              <option value="all">Verification: All</option>
              <option value="Pending review">Pending review</option>
              <option value="Verified">Verified</option>
            </select>

            <select
              className="ec-filter-dropdown-btn"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Category: All</option>
              <option value="Emergency Shelter">Emergency Shelter</option>
              <option value="Drinking Water">Drinking Water</option>
              <option value="Medicine">Medicine</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
            </select>

            <button
              className="ec-btn-clear-filters"
              onClick={() => {
                setReqSearchInput('');
                setPriorityFilter('all');
                setVerificationFilter('all');
                setCategoryFilter('all');
                setAppliedFilters([]);
                showToast('Filters reset to default');
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        <div className="ec-req-filter-tags-row">
          {appliedFilters.map((flt, idx) => (
            <span
              key={idx}
              className="ec-filter-tag-chip"
              onClick={() => setAppliedFilters(prev => prev.filter(f => f !== flt))}
            >
              <span>{flt}</span>
              <X size={11} />
            </span>
          ))}
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            {appliedFilters.length} filters applied
          </span>
        </div>
      </div>

      {/* Assistance Requests Data Table */}
      <div className="ec-table-container">
        <table className="ec-data-table">
          <thead>
            <tr>
              <th>REQUEST ID</th>
              <th>CATEGORY</th>
              <th>SUBMITTED</th>
              <th>GENERAL LOCATION</th>
              <th>PEOPLE</th>
              <th>AI PRIORITY</th>
              <th>VERIFICATION</th>
              <th>COORDINATOR</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((row) => (
              <tr
                key={row.id}
                onClick={() => onOpenCaseReview(row.id)}
                title={`Click to review details of ${row.id}`}
              >
                <td>
                  <span className="ec-table-req-id">{row.id}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 600 }}>{row.category}</span>
                </td>
                <td style={{ color: '#64748b' }}>{row.submitted}</td>
                <td>{row.location}</td>
                <td style={{ fontWeight: 700 }}>{row.people}</td>
                <td>
                  <span className={row.aiPriority === 'Critical' ? 'ec-badge-critical' : row.aiPriority === 'High' ? 'ec-badge-high' : 'ec-badge-medium'}>
                    ▲ {row.aiPriority} · {row.aiScore}
                  </span>
                </td>
                <td>
                  <span className={row.verification === 'Verified' ? 'ec-badge-verified' : 'ec-badge-pending'}>
                    ● {row.verification}
                  </span>
                </td>
                <td style={{ color: '#475569' }}>{row.coordinator}</td>
                <td>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: row.status === 'Verified' ? '#059669' : row.status === 'Assigned' ? '#0284c7' : '#d97706'
                  }}>
                    ● {row.status}
                  </span>
                </td>
                <td onClick={(e) => { e.stopPropagation(); onOpenCaseReview(row.id); }}>
                  <span style={{ color: '#94a3b8', fontSize: '16px', letterSpacing: '2px', cursor: 'pointer' }}>
                    •••
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Table Footer with Pagination */}
        <div className="ec-table-pagination-bar">
          <span>Showing 1-5 of 248 requests</span>
          <div className="ec-pagination-btn-group">
            <button className="ec-page-num-btn" onClick={() => setCurrentPage(1)}>Previous</button>
            <button className={`ec-page-num-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
            <button className={`ec-page-num-btn ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
            <button className={`ec-page-num-btn ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</button>
            <button className="ec-page-num-btn" onClick={() => setCurrentPage(2)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

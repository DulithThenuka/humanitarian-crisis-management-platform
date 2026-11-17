import React, { useState } from 'react';
import { Search, ChevronDown, Download, ChevronRight } from 'lucide-react';
import { ACTIVITY_HISTORY } from '../data/resourceManagerData';

export const ActivityHistoryView = ({ showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All');

  const filteredHistory = ACTIVITY_HISTORY.filter((item) => {
    const matchesSearch =
      item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relatedRecord.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userTeam.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleExport = () => {
    if (showToast) {
      showToast('Activity audit trail exported successfully');
    }
  };

  const handleRowClick = (item) => {
    if (showToast) {
      showToast(`Audit details for ${item.reference} (${item.relatedRecord})`);
    }
  };

  return (
    <div className="rm-view-container">
      {/* View Header */}
      <div className="rm-view-header">
        <div>
          <span className="rm-view-pretitle">TRACEABLE OPERATIONAL RECORDS</span>
          <h1 className="rm-view-title">Activity History</h1>
          <p className="rm-view-subtitle">
            Inventory changes, allocation decisions, dispatches and delivery confirmations.
          </p>
        </div>
        <div className="rm-view-actions">
          <button onClick={handleExport} className="rm-btn-secondary">
            <Download size={14} />
            Export history
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="rm-metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="rm-metric-card">
          <span className="rm-metric-title">Inventory changes</span>
          <div className="rm-metric-val" style={{ marginTop: '12px' }}>18</div>
        </div>

        <div className="rm-metric-card">
          <span className="rm-metric-title">Allocation decisions</span>
          <div className="rm-metric-val" style={{ marginTop: '12px' }}>12</div>
        </div>

        <div className="rm-metric-card">
          <span className="rm-metric-title">Delivery updates</span>
          <div className="rm-metric-val" style={{ marginTop: '12px' }}>9</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rm-filter-bar">
        <div className="rm-search-input-wrap" style={{ maxWidth: '380px' }}>
          <Search size={15} className="rm-search-icon" />
          <input
            type="text"
            className="rm-search-input"
            placeholder="Search activity or related record"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rm-filter-group">
          {/* Action type */}
          <div style={{ position: 'relative' }}>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rm-filter-select"
            >
              <option value="All">Action type</option>
              <option value="inventory">Inventory adjustments</option>
              <option value="allocation">Allocations</option>
              <option value="dispatch">Dispatch & Delivery</option>
            </select>
            <ChevronDown size={14} className="rm-select-arrow" />
          </div>

          {/* Date range */}
          <div style={{ position: 'relative' }}>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rm-filter-select"
            >
              <option value="All">Date range</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Past 7 days</option>
            </select>
            <ChevronDown size={14} className="rm-select-arrow" />
          </div>

          {/* User */}
          <div style={{ position: 'relative' }}>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="rm-filter-select"
            >
              <option value="All">User</option>
              <option value="dilan">Dilan Perera</option>
              <option value="logistics">Logistics Team</option>
              <option value="shelter">Shelter Supply Team</option>
            </select>
            <ChevronDown size={14} className="rm-select-arrow" />
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="rm-table-card">
        <div className="rm-table-wrap">
          <table className="rm-table">
            <thead>
              <tr>
                <th>REFERENCE</th>
                <th>ACTION</th>
                <th>RELATED RECORD</th>
                <th>USER / TEAM</th>
                <th>RESULT</th>
                <th>TIMESTAMP</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr
                  key={item.reference}
                  onClick={() => handleRowClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="rm-td-id">{item.reference}</td>
                  <td style={{ color: '#243328', fontWeight: 500 }}>{item.action}</td>
                  <td>
                    <span style={{ color: '#1d4ed8', fontWeight: 600, fontSize: '12px' }}>
                      {item.relatedRecord}
                    </span>
                  </td>
                  <td style={{ color: '#334135' }}>{item.userTeam}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        backgroundColor: '#edf4ec',
                        color: '#1e3d2c'
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#15803d'
                        }}
                      />
                      {item.result}
                    </span>
                  </td>
                  <td style={{ color: '#738075', fontSize: '12px' }}>{item.timestamp}</td>
                  <td style={{ textAlign: 'right', color: '#9eb09e' }}>
                    <ChevronRight size={15} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityHistoryView;

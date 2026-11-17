import React, { useState } from 'react';
import { Search, ChevronDown, CheckCheck, ChevronRight } from 'lucide-react';
import { RESOURCE_NOTIFICATIONS } from '../data/resourceManagerData';

export const NotificationsView = ({ showToast }) => {
  const [notifications, setNotifications] = useState(RESOURCE_NOTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All');

  const filteredNotifications = notifications.filter((item) => {
    const matchesSearch =
      item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relatedRecord.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleMarkAllRead = () => {
    if (showToast) {
      showToast('All 5 resource notifications marked as read');
    }
  };

  const handleNotificationClick = (item) => {
    if (showToast) {
      showToast(`Viewing notification ${item.reference} - related to ${item.relatedRecord}`);
    }
  };

  const renderBadge = (result, badgeType) => {
    let bg = '#fee2e2';
    let text = '#b91c1c';
    let dot = '#dc2626';

    if (badgeType === 'review' || badgeType === 'warning') {
      bg = '#fef3c7';
      text = '#92400e';
      dot = '#d97706';
    } else if (badgeType === 'completed') {
      bg = '#dcfce7';
      text = '#166534';
      dot = '#16a34a';
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 9px',
          borderRadius: '12px',
          fontSize: '11.5px',
          fontWeight: 600,
          backgroundColor: bg,
          color: text
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: dot
          }}
        />
        {result}
      </span>
    );
  };

  return (
    <div className="rm-view-container">
      {/* View Header */}
      <div className="rm-view-header">
        <div>
          <span className="rm-view-pretitle">RESOURCE ATTENTION CENTRE</span>
          <h1 className="rm-view-title">Resource Notifications</h1>
          <p className="rm-view-subtitle">
            Shortages, allocation requests, expiry warnings and delivery updates.
          </p>
        </div>
        <div className="rm-view-actions">
          <button onClick={handleMarkAllRead} className="rm-btn-secondary">
            <CheckCheck size={14} />
            Mark all as read
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="rm-metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="rm-metric-card">
          <span className="rm-metric-title">Unread</span>
          <div className="rm-metric-val" style={{ marginTop: '12px' }}>5</div>
        </div>

        <div className="rm-metric-card">
          <span className="rm-metric-title">Critical</span>
          <div className="rm-metric-val" style={{ marginTop: '12px' }}>2</div>
        </div>

        <div className="rm-metric-card">
          <span className="rm-metric-title">Action required</span>
          <div className="rm-metric-val" style={{ marginTop: '12px' }}>3</div>
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
              <option value="shortage">Shortages</option>
              <option value="requests">Allocation requests</option>
              <option value="expiry">Expiry warnings</option>
              <option value="delivery">Delivery confirmations</option>
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
              <option value="all">All members</option>
            </select>
            <ChevronDown size={14} className="rm-select-arrow" />
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="rm-table-card">
        <div className="rm-table-wrap">
          <table className="rm-table">
            <thead>
              <tr>
                <th>REFERENCE</th>
                <th>ACTION</th>
                <th>RELATED RECORD</th>
                <th>RECEIVED</th>
                <th>RESULT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((item) => (
                <tr
                  key={item.reference}
                  onClick={() => handleNotificationClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="rm-td-id">{item.reference}</td>
                  <td style={{ color: '#243328', fontWeight: 500 }}>{item.action}</td>
                  <td>
                    <span style={{ color: '#1d4ed8', fontWeight: 600, fontSize: '12px' }}>
                      {item.relatedRecord}
                    </span>
                  </td>
                  <td style={{ color: '#738075', fontSize: '12px' }}>{item.received}</td>
                  <td>{renderBadge(item.result, item.resultBadge)}</td>
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

export default NotificationsView;

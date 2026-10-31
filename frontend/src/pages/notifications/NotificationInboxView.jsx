import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Plus, 
  Search, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

export const NotificationInboxView = ({ 
  notifications = [], 
  onBackToHub, 
  onSelectScreen, 
  onSelectNotification,
  onExport,
  showToast 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredItems = useMemo(() => {
    return notifications.filter(item => {
      const matchesSearch = !searchTerm || 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [notifications, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const moduleScreens = [
    { id: 'inbox', label: 'Notification Inbox' },
    { id: 'compose', label: 'Compose Notification' },
    { id: 'recipient-drawer', label: 'Recipient Detail Drawer' },
    { id: 'delivery-status', label: 'Email & SMS Delivery Status' },
    { id: 'failed-handling', label: 'Failed Notification Handling' },
    { id: 'detail', label: 'Notification Detail' }
  ];

  return (
    <div className="notif-container">
      {/* 1. Breadcrumb Row */}
      <div className="notif-breadcrumb-row">
        <button 
          type="button" 
          className="notif-back-btn"
          onClick={onBackToHub}
        >
          <ChevronLeft size={14} />
          <span>Back to Notification Centre</span>
        </button>
        <span className="notif-breadcrumb-path-text">
          Notification Centre / Notification Inbox
        </span>
      </div>

      {/* 2. Page Header & Actions */}
      <div className="notif-header-row">
        <div className="notif-header-col-left">
          <span className="notif-section-tag">COMMUNICATIONS</span>
          <h1 className="notif-page-title">Notification Inbox</h1>
          <p className="notif-page-subtitle">
            Manage recipient notifications across email, SMS and push integration channels. · Fictional demonstration data
          </p>
        </div>

        <div className="notif-header-actions">
          <button 
            type="button" 
            className="btn-notif-outline"
            onClick={onExport}
          >
            <Download size={13} />
            <span>Export</span>
          </button>
          <button 
            type="button" 
            className="btn-notif-primary"
            onClick={() => onSelectScreen('compose')}
          >
            <Plus size={14} />
            <span>Create new</span>
          </button>
        </div>
      </div>

      {/* 3. Horizontal MODULE SCREENS Tab Bar */}
      <div className="notif-subscreens-bar">
        <span className="subscreens-label">MODULE SCREENS</span>
        <div className="subscreens-tabs-list">
          {moduleScreens.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`module-screen-tab-btn ${tab.id === 'inbox' ? 'active' : ''}`}
              onClick={() => onSelectScreen(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. 2-Column Main Workspace */}
      <div className="notif-split-workspace">
        {/* Left: Table Card */}
        <div className="notif-main-card">
          {/* Table Toolbar */}
          <div className="notif-table-toolbar">
            <div className="toolbar-left-filters">
              <div className="notif-search-field">
                <Search size={14} className="notif-search-icon" />
                <input
                  type="text"
                  placeholder="Search notification inbox"
                  className="notif-search-input"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <select
                className="notif-filter-dropdown"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All statuses</option>
                <option value="DELIVERED">Delivered</option>
                <option value="SENT">Sent</option>
                <option value="FAILED">Failed</option>
              </select>

              <select
                className="notif-filter-dropdown"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  showToast?.(`Filtering by date: ${e.target.value}`, 'info');
                }}
              >
                <option value="ALL">Date range</option>
                <option value="TODAY">Today (Last 24h)</option>
                <option value="WEEK">Last 7 Days</option>
                <option value="MONTH">This Month</option>
              </select>
            </div>

            <button 
              type="button" 
              className="btn-notif-outline"
              onClick={onExport}
            >
              <Download size={12} />
              <span>Export</span>
            </button>
          </div>

          {/* Table Element */}
          <table className="notif-data-table">
            <thead>
              <tr>
                <th>REFERENCE</th>
                <th>NAME / RECORD</th>
                <th>CATEGORY OR ROLE</th>
                <th>STATUS</th>
                <th>UPDATED / OWNER</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map(row => (
                <tr 
                  key={row.id}
                  className="notif-table-row"
                  onClick={() => {
                    onSelectNotification(row);
                    onSelectScreen('detail');
                  }}
                >
                  <td className="cell-reference">{row.id}</td>
                  <td>
                    <div className="cell-name-record">
                      <span className="cell-name-title">{row.name}</span>
                      <span className="cell-name-sub">{row.subtitle}</span>
                    </div>
                  </td>
                  <td className="cell-category-tag">{row.category}</td>
                  <td>
                    <span className={`status-pill-badge ${row.status.toLowerCase()}`}>
                      <span className="dot-status"></span>
                      <span>{row.status}</span>
                    </span>
                  </td>
                  <td className="cell-updated-time">{row.updated}</td>
                  <td className="cell-action-arrow">
                    <ChevronRight size={14} />
                  </td>
                </tr>
              ))}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No notification records found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="notif-pagination-row">
            <span>
              Showing {paginatedItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} records
            </span>
            <div className="pagination-btn-group">
              <button 
                type="button" 
                className={`page-num-btn ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              {totalPages > 1 && (
                <button 
                  type="button" 
                  className={`page-num-btn ${currentPage === 2 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </button>
              )}
              {totalPages > 2 && (
                <button 
                  type="button" 
                  className={`page-num-btn ${currentPage === 3 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(3)}
                >
                  3
                </button>
              )}
              <button 
                type="button" 
                className="page-text-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                style={{ opacity: currentPage >= totalPages ? 0.45 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right: Operational Summary Card */}
        <aside className="notif-sidebar-card">
          <h2 className="sidebar-summary-title">Operational summary</h2>

          <div className="sidebar-kpi-list">
            <div className="sidebar-kpi-item">
              <span className="sidebar-kpi-label">Open records</span>
              <span className="sidebar-kpi-num">28</span>
            </div>
            <div className="sidebar-kpi-item">
              <span className="sidebar-kpi-label">Pending review</span>
              <span className="sidebar-kpi-num">7</span>
            </div>
            <div className="sidebar-kpi-item">
              <span className="sidebar-kpi-label">Completed today</span>
              <span className="sidebar-kpi-num">14</span>
            </div>
          </div>

          {/* Exception Callout Box */}
          <div 
            className="sidebar-exception-callout"
            onClick={() => onSelectScreen('failed-handling')}
            style={{ cursor: 'pointer' }}
            title="Click to view failed exceptions"
          >
            <AlertTriangle size={16} className="exception-icon" />
            <div>
              <div className="exception-title">2 exceptions require attention</div>
              <div className="exception-sub">Review before the next coordination update.</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

import React from 'react';
import { Search, ChevronDown, Bell, ShieldAlert } from 'lucide-react';

const TAB_TITLES = {
  overview: 'Resource Manager Overview',
  inventory: 'Inventory Management',
  allocations: 'Resource Allocation Requests',
  tracking: 'Distribution & Delivery Tracking',
  suppliers: 'Suppliers & Donations',
  'stock-alerts': 'Stock Alerts & Replenishment',
  reports: 'Resource Reports & Analytics',
  activity: 'Activity History',
  notifications: 'Resource Notifications',
  profile: 'Profile & Settings'
};

export const ResourceHeader = ({ activeTab, onSelectTab, showToast }) => {
  const currentTitle = TAB_TITLES[activeTab] || 'Resource Manager Portal';

  return (
    <header className="rm-header-container">
      {/* Top Bar */}
      <div className="rm-header-top">
        {/* Left: Breadcrumbs */}
        <div className="rm-header-left">
          <span className="rm-header-pretitle">RESOURCE MANAGER PORTAL</span>
          <span className="rm-header-current-title">{currentTitle}</span>
        </div>

        {/* Center: Global Search */}
        <div className="rm-header-search-wrap">
          <Search size={15} className="rm-header-search-icon" />
          <input
            type="text"
            className="rm-header-search-input"
            placeholder="Search inventory, allocations, dispatches..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && showToast) {
                showToast(`Searching for "${e.target.value}" across resource records`);
              }
            }}
          />
          <kbd className="rm-header-search-kbd">⌘ K</kbd>
        </div>

        {/* Right: Active Operation, Notification Bell, User Avatar */}
        <div className="rm-header-right">
          {/* Active Operation Selector */}
          <div className="rm-active-op-card">
            <span className="rm-active-op-label">Active operation</span>
            <div className="rm-active-op-row">
              <span className="rm-active-op-name">Western Province Flood</span>
              <ChevronDown size={14} style={{ color: '#657367' }} />
            </div>
          </div>

          {/* Bell with red badge */}
          <button
            onClick={() => onSelectTab('notifications')}
            className="rm-header-bell-btn"
            title="5 unread notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="rm-header-bell-badge">5</span>
          </button>

          {/* User Profile Pill */}
          <button
            onClick={() => onSelectTab('profile')}
            className="rm-header-user-btn"
            title="Profile & Settings"
          >
            <div className="rm-header-user-avatar">DP</div>
            <div className="rm-header-user-meta">
              <span className="rm-header-user-name">Dilan Perera</span>
              <span className="rm-header-user-role">Resource Manager</span>
            </div>
          </button>
        </div>
      </div>

      {/* Coursework Prototype Banner */}
      <div className="rm-prototype-banner">
        <ShieldAlert size={15} className="rm-prototype-banner-icon" />
        <span className="rm-prototype-banner-tag">Resource prototype</span>
        <span className="rm-prototype-banner-text">
          Illustrative records only. Prototype actions do not update a database or confirm physical delivery.
        </span>
      </div>
    </header>
  );
};

export default ResourceHeader;

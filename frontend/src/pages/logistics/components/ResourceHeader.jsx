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
      <div className="rm-header">
        {/* Left: Breadcrumbs */}
        <div className="rm-header-left">
          <div className="rm-breadcrumb">
            <span className="rm-breadcrumb-root">RESOURCE MANAGER PORTAL</span>
            <span className="rm-breadcrumb-current">{currentTitle}</span>
          </div>

          {/* Center: Global Search */}
          <div className="rm-search-wrapper">
            <Search size={15} className="rm-search-icon" />
            <input
              type="text"
              className="rm-search-input"
              placeholder="Search inventory, allocations, dispatches..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && showToast) {
                  showToast(`Searching for "${e.target.value}" across resource records`);
                }
              }}
            />
            <kbd className="rm-search-kbd">⌘ K</kbd>
          </div>
        </div>

        {/* Right: Active Operation, Notification Bell, User Avatar */}
        <div className="rm-header-right">
          {/* Active Operation Selector */}
          <div className="rm-operation-box">
            <div className="rm-op-info">
              <span className="rm-op-label">ACTIVE OPERATION</span>
              <span className="rm-op-value">Western Province Flood</span>
            </div>
            <ChevronDown size={14} style={{ color: '#657367' }} />

            {/* Bell with red badge inside operation box */}
            <div
              className="rm-op-bell"
              onClick={() => onSelectTab('notifications')}
              title="5 unread notifications"
              style={{ cursor: 'pointer', marginLeft: '6px' }}
            >
              <Bell size={16} />
              <span className="rm-bell-badge">5</span>
            </div>
          </div>

          {/* User Profile Pill */}
          <div
            className="rm-header-user"
            onClick={() => onSelectTab('profile')}
            title="Profile & Settings"
            style={{ cursor: 'pointer' }}
          >
            <div className="rm-officer-avatar">DP</div>
            <div className="rm-user-text">
              <span className="rm-user-name">Dilan Perera</span>
              <span className="rm-user-role">Resource Manager</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coursework Prototype Banner */}
      <div className="rm-prototype-banner">
        <ShieldAlert size={14} className="rm-banner-shield" />
        <strong style={{ fontWeight: 700 }}>Resource prototype</strong>
        <span>
          Illustrative records only. Prototype actions do not update a database or confirm physical delivery.
        </span>
      </div>
    </header>
  );
};

export default ResourceHeader;

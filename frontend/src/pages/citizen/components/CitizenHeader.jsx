import React from 'react';
import { Search, Bell, ChevronRight } from 'lucide-react';

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  submit: 'Submit Assistance Request',
  requests: 'My Requests',
  alerts: 'Emergency Alerts',
  shelters: 'Find Shelters & Help Centres',
  notifications: 'Notifications',
  'ai-assistance': 'AI Assistance',
  profile: 'My Profile',
  support: 'Help & Support'
};

export const CitizenHeader = ({ activeTab, onSelectTab, showToast }) => {
  const currentTitle = VIEW_TITLES[activeTab] || 'Dashboard';

  return (
    <header className="cp-header">
      {/* Left: Breadcrumb */}
      <div className="cp-header-title">{currentTitle}</div>

      {/* Right: Search, Language, Notifications, Profile */}
      <div className="cp-header-right">
        {/* Search */}
        <div className="cp-search-wrap">
          <Search size={15} className="cp-search-icon" />
          <input
            type="text"
            className="cp-search-input"
            placeholder="Search or go to..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && showToast) {
                showToast(`Searching for "${e.target.value}"`);
              }
            }}
          />
        </div>

        {/* Language Pill */}
        <button
          className="cp-lang-btn"
          onClick={() => showToast && showToast('Language selection: English (US)')}
        >
          <span>English</span>
          <ChevronRight size={13} />
        </button>

        {/* Bell with Badge 3 */}
        <button
          onClick={() => onSelectTab('notifications')}
          className="cp-bell-btn"
          title="3 unread notifications"
        >
          <Bell size={18} />
          <span className="cp-bell-badge">3</span>
        </button>

        {/* User Pill */}
        <div
          className="cp-header-user"
          onClick={() => onSelectTab('profile')}
          title="My Profile"
        >
          <div className="cp-header-avatar">NS</div>
          <div className="cp-header-user-meta">
            <span className="cp-header-user-name">Nimal Silva</span>
            <span className="cp-header-user-role">Citizen</span>
          </div>
          <ChevronRight size={14} color="#738075" />
        </div>
      </div>
    </header>
  );
};

export default CitizenHeader;

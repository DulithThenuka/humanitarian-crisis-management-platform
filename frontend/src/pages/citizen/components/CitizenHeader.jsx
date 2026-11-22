import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

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
  const { user, logout } = useAuth();
  const currentTitle = VIEW_TITLES[activeTab] || 'Dashboard';
  const citizenName = user?.fullName || 'Alice Citizen';

  const initials = (citizenName || 'C')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUnread = () => {
      try {
        const userId = user?.id || user?.userId || 'citizen';
        const stored = localStorage.getItem(`reliefcore_read_notifications_${userId}`);
        const readIds = new Set(stored ? JSON.parse(stored) : []);
        // Baseline estimation or read from actual storage
        setUnreadCount(Math.max(0, 2 - readIds.size));
      } catch {
        setUnreadCount(0);
      }
    };
    updateUnread();
  }, [user, activeTab]);

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
            placeholder="Search relief services..."
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
          onClick={() => showToast && showToast('Language: English (Sri Lanka)')}
        >
          <span>English</span>
          <ChevronRight size={13} />
        </button>

        {/* Bell with Badge */}
        <button
          onClick={() => onSelectTab('notifications')}
          className="cp-bell-btn"
          title={`${unreadCount} notifications`}
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="cp-bell-badge">{unreadCount}</span>}
        </button>

        {/* User Pill */}
        <div
          className="cp-header-user"
          onClick={() => onSelectTab('profile')}
          title="Manage My Profile"
          style={{ cursor: 'pointer' }}
        >
          <div className="cp-header-avatar">{initials}</div>
          <div className="cp-header-user-meta">
            <span className="cp-header-user-name">{citizenName}</span>
            <span className="cp-header-user-role">Citizen Account</span>
          </div>
          <ChevronRight size={14} color="#738075" />
        </div>
      </div>
    </header>
  );
};

export default CitizenHeader;

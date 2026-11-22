import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Plus,
  FileText,
  AlertTriangle,
  Building2,
  Bell,
  Sparkles,
  User,
  HelpCircle,
  Shield,
  ShieldCheck,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const CITIZEN_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'submit', label: '+ Submit Assistance Request', icon: Plus },
  { id: 'requests', label: 'My Requests', icon: FileText },
  { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle },
  { id: 'shelters', label: 'Find Shelters & Help Centres', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai-assistance', label: 'AI Assistance', icon: Sparkles },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'support', label: 'Help & Support', icon: HelpCircle }
];

export const CitizenSidebar = ({ activeTab, onSelectTab }) => {
  const { user, logout } = useAuth();
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
    try {
      const userId = user?.id || user?.userId || 'citizen';
      const stored = localStorage.getItem(`reliefcore_read_notifications_${userId}`);
      const readIds = new Set(stored ? JSON.parse(stored) : []);
      setUnreadCount(Math.max(0, 2 - readIds.size));
    } catch {
      setUnreadCount(0);
    }
  }, [user, activeTab]);

  return (
    <aside className="cp-sidebar">
      {/* Brand Header */}
      <div className="cp-sidebar-header">
        <a href="/citizen" className="cp-brand-row">
          <div className="cp-brand-logo-wrap">
            <Shield size={22} color="#ffffff" />
          </div>
          <div className="cp-brand-text">
            <span className="cp-brand-title">HumanAid</span>
            <span className="cp-brand-sub">Crisis relief network</span>
          </div>
        </a>

        {/* Citizen User Card */}
        <div
          className="cp-user-card"
          onClick={() => onSelectTab('profile')}
          style={{ cursor: 'pointer' }}
          title="View profile"
        >
          <div className="cp-user-avatar">{initials}</div>
          <div className="cp-user-meta">
            <span className="cp-user-name">{citizenName}</span>
            <span className="cp-user-sub">Verified Citizen</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="cp-nav-menu">
        {CITIZEN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const showBadge = item.id === 'notifications' && unreadCount > 0;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`cp-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="cp-nav-item-left">
                <Icon size={17} />
                <span>{item.label}</span>
              </div>
              {showBadge && <span className="cp-nav-badge">{unreadCount}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="cp-sidebar-footer">
        <div className="cp-privacy-box">
          <div className="cp-privacy-header">
            <ShieldCheck size={14} color="#9fa89e" />
            <span>Secure relief protocol</span>
          </div>
          <p className="cp-privacy-desc">
            Your contact details are encrypted and protected.
          </p>
        </div>

        <button
          onClick={() => logout()}
          className="cp-signout-btn"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default CitizenSidebar;

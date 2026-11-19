import React from 'react';
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
  ChevronRight
} from 'lucide-react';

export const CITIZEN_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'submit', label: '+ Submit Assistance Request', icon: Plus },
  { id: 'requests', label: 'My Requests', icon: FileText },
  { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle },
  { id: 'shelters', label: 'Find Shelters & Help Centres', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { id: 'ai-assistance', label: 'AI Assistance', icon: Sparkles },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'support', label: 'Help & Support', icon: HelpCircle }
];

export const CitizenSidebar = ({ activeTab, onSelectTab }) => {
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
            <span className="cp-brand-sub">Response coordination</span>
          </div>
        </a>

        {/* Citizen User Card */}
        <div className="cp-user-card">
          <div className="cp-user-avatar">NS</div>
          <div className="cp-user-meta">
            <span className="cp-user-name">Nimal Silva</span>
            <span className="cp-user-sub">Citizen account</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="cp-nav-menu">
        {CITIZEN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
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
              {item.badge && <span className="cp-nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="cp-sidebar-footer">
        <div className="cp-privacy-box">
          <div className="cp-privacy-header">
            <ShieldCheck size={14} color="#9fa89e" />
            <span>Your information is protected</span>
          </div>
          <p className="cp-privacy-desc">
            Only authorised teams can access request details.
          </p>
        </div>

        <a href="/" className="cp-signout-btn">
          <ChevronRight size={15} />
          <span>Sign out</span>
        </a>
      </div>
    </aside>
  );
};

export default CitizenSidebar;

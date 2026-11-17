import React from 'react';
import {
  LayoutDashboard,
  Package,
  CheckCircle,
  Truck,
  HeartHandshake,
  AlertTriangle,
  BarChart2,
  History,
  Bell,
  Settings,
  Shield,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'allocations', label: 'Allocation Requests', icon: CheckCircle },
  { id: 'tracking', label: 'Distribution Tracking', icon: Truck },
  { id: 'suppliers', label: 'Suppliers & Donations', icon: HeartHandshake },
  { id: 'stock-alerts', label: 'Stock Alerts', icon: AlertTriangle },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart2 },
  { id: 'activity', label: 'Activity History', icon: History },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 5 },
  { id: 'profile', label: 'Profile & Settings', icon: Settings }
];

export const ResourceSidebar = ({ activeTab, onSelectTab, onDutyToggle, onDuty = true }) => {
  return (
    <aside className="rm-sidebar">
      {/* Brand Header */}
      <div className="rm-sidebar-header">
        <a href="/logistics" className="rm-brand-row">
          <div className="rm-brand-logo-wrap">
            <Shield size={22} className="rm-brand-shield-icon" />
          </div>
          <div className="rm-brand-text">
            <span className="rm-brand-title">HumanAid</span>
            <span className="rm-brand-sub">Response coordination</span>
          </div>
        </a>

        {/* Officer Duty Card */}
        <div className="rm-officer-card">
          <div className="rm-officer-info">
            <div className="rm-officer-avatar">DP</div>
            <div className="rm-officer-meta">
              <span className="rm-officer-pre">SIGNED IN AS</span>
              <span className="rm-officer-role">Relief / Resource Manager</span>
              <span className="rm-officer-name">Dilan Perera</span>
            </div>
          </div>
          <div
            className={`rm-duty-toggle ${onDuty ? 'active' : ''}`}
            onClick={onDutyToggle}
            title="Toggle active duty"
            role="button"
            tabIndex={0}
          >
            <div className="rm-duty-dot" />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="rm-nav-menu">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`rm-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="rm-nav-item-left">
                <Icon size={17} />
                <span>{item.label}</span>
              </div>
              {item.badge && <span className="rm-nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="rm-sidebar-footer">
        {/* Role Access Boundary Notice */}
        <div className="rm-privacy-notice-box">
          <div className="rm-privacy-notice-header">
            <ShieldCheck size={14} className="rm-privacy-shield-icon" />
            <span className="rm-privacy-title">Resource operations access</span>
          </div>
          <p className="rm-privacy-text">
            Inventory and allocation workflows only. System administration is restricted.
          </p>
        </div>

        {/* Exit Link */}
        <a href="/" className="rm-signout-btn">
          <ChevronRight size={15} />
          <span>Exit resource portal</span>
        </a>
      </div>
    </aside>
  );
};

export default ResourceSidebar;

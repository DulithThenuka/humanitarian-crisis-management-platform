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
        <div className="rm-brand-wrap">
          <div className="rm-brand-logo-box">
            <Shield size={20} className="rm-brand-shield-icon" />
          </div>
          <div className="rm-brand-text">
            <span className="rm-brand-name">HumanAid</span>
            <span className="rm-brand-sub">Response coordination</span>
          </div>
        </div>

        {/* Officer Duty Card */}
        <div className="rm-officer-card">
          <div className="rm-officer-info">
            <div className="rm-officer-avatar">DP</div>
            <div className="rm-officer-details">
              <span className="rm-officer-badge">SIGNED IN AS</span>
              <span className="rm-officer-role">Relief / Resource Manager</span>
              <span className="rm-officer-name">Dilan Perera</span>
            </div>
          </div>
          <button
            type="button"
            className={`rm-switch ${onDuty ? 'active' : ''}`}
            onClick={onDutyToggle}
            aria-label="Toggle active duty"
          >
            <span className="rm-switch-knob" />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="rm-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`rm-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="rm-nav-item-inner">
                <Icon size={18} className="rm-nav-icon" />
                <span className="rm-nav-label">{item.label}</span>
              </div>
              {item.badge && <span className="rm-nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="rm-sidebar-footer">
        {/* Role Access Boundary Notice */}
        <div className="rm-access-boundary-box">
          <div className="rm-boundary-header">
            <ShieldCheck size={14} className="rm-boundary-icon" />
            <span className="rm-boundary-title">Resource operations access</span>
          </div>
          <p className="rm-boundary-desc">
            Inventory and allocation workflows only. System administration is restricted.
          </p>
        </div>

        {/* Exit Link */}
        <a href="/" className="rm-exit-link">
          <ChevronRight size={15} />
          <span>Exit resource portal</span>
        </a>
      </div>
    </aside>
  );
};

export default ResourceSidebar;

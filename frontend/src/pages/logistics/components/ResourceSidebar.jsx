import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { HumanAidLogo } from '@/components/common/HumanAidLogo';
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
  ShieldCheck,
  LogOut
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

export const ResourceSidebar = ({
  activeTab,
  onSelectTab,
  onDutyToggle,
  onDuty = true,
  onSignOut
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOutClick = async (e) => {
    e.preventDefault();
    if (onSignOut) {
      await onSignOut();
      return;
    }
    try {
      await logout();
    } catch (err) {
      console.error('Sign out error:', err);
    }
    navigate('/login', { replace: true });
  };

  const officerName = user?.fullName || user?.name || 'Dilan Perera';
  const officerAvatar = user?.initials || 'DP';

  return (
    <aside className="rm-sidebar">
      {/* Brand Header */}
      <div className="rm-sidebar-header">
        <a
          href="/logistics/overview"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('overview');
          }}
          className="rm-brand-row"
          style={{ textDecoration: 'none' }}
        >
          <HumanAidLogo variant="full" size="md" withContainer={true} />
        </a>

        {/* Officer Duty Card */}
        <div className="rm-officer-card">
          <div className="rm-officer-info">
            <div className="rm-officer-avatar">{officerAvatar}</div>
            <div className="rm-officer-meta">
              <span className="rm-officer-pre">SIGNED IN AS</span>
              <span className="rm-officer-role">Relief / Resource Manager</span>
              <span className="rm-officer-name">{officerName}</span>
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

        {/* Exit Resource Portal Option (retaining exact existing behavior) */}
        <a href="/" className="rm-signout-btn" style={{ marginBottom: '4px' }}>
          <ChevronRight size={15} />
          <span>Exit resource portal</span>
        </a>

        {/* Subtle Divider */}
        <div className="rm-sidebar-divider" />

        {/* Sign Out Menu Item */}
        <button
          type="button"
          onClick={handleSignOutClick}
          className="rm-signout-btn"
          style={{ marginTop: '4px' }}
        >
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default ResourceSidebar;

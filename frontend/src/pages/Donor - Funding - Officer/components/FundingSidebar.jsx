import React from 'react';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Megaphone,
  PieChart,
  AlertTriangle,
  FileText,
  LogOut,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';

export const FundingSidebar = ({
  activeTab,
  setActiveTab,
  dutyActive,
  setDutyActive,
  officer,
  pendingReviewCount = 12,
  suspiciousCount = 1,
  onSignOut
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Funding Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'donors',
      label: 'Donor Management',
      icon: Users,
      badge: pendingReviewCount
    },
    {
      id: 'donations',
      label: 'Donation Records',
      icon: HeartHandshake,
      badge: null
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: Megaphone,
      badge: null
    },
    {
      id: 'allocations',
      label: 'Allocation & Expenditure',
      icon: PieChart,
      badge: null
    },
    {
      id: 'suspicious',
      label: 'Suspicious Flag Review',
      icon: AlertTriangle,
      badge: suspiciousCount,
      badgeType: 'danger'
    },
    {
      id: 'reports',
      label: 'Transparency Reports',
      icon: FileText,
      badge: null
    }
  ];

  return (
    <aside className="fo-sidebar">
      {/* Brand Header */}
      <div className="fo-sidebar-header">
        <div className="fo-brand-row">
          <div className="fo-brand-logo-wrap">
            <Layers size={20} />
          </div>
          <div className="fo-brand-text">
            <span className="fo-brand-title">HumanAid</span>
            <span className="fo-brand-sub">Response Coordination</span>
          </div>
        </div>
      </div>

      {/* Officer Card with Live Duty Toggle */}
      <div className="fo-officer-card">
        <div className="fo-officer-info">
          <div className="fo-officer-avatar">
            {officer?.shortName || 'MW'}
          </div>
          <div className="fo-officer-meta">
            <span className="fo-officer-name">{officer?.fullName || 'Malini Wijeratne'}</span>
            <span className="fo-officer-role">{officer?.role || 'Donor / Funding Officer'}</span>
          </div>
        </div>

        {/* Duty Status Switch */}
        <div
          className={`fo-duty-toggle ${dutyActive ? 'active' : ''}`}
          onClick={() => setDutyActive(!dutyActive)}
          title={`Status: ${dutyActive ? 'On Duty (Active)' : 'Off Duty'}`}
        >
          <div className="fo-duty-dot"></div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="fo-nav-menu">
        <div className="fo-nav-label">Funding Operations</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`fo-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="fo-nav-item-left">
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && item.badge > 0 && (
                <span className={`fo-nav-badge ${item.badgeType === 'danger' ? 'danger' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer with Privacy Boundary & Sign Out */}
      <div className="fo-sidebar-footer">
        <div className="fo-privacy-notice-box">
          <ShieldCheck size={14} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p className="fo-privacy-text">
            Approved donor and funding records only. Payment processing and unrelated personal data are excluded.
          </p>
        </div>

        <button className="fo-signout-btn" onClick={onSignOut}>
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};


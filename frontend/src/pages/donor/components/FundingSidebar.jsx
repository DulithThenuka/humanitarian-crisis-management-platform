import React from 'react';
import { HumanAidLogo } from '@/components/common/HumanAidLogo';
import {
  LayoutGrid,
  Users,
  Heart,
  BarChart3,
  Briefcase,
  AlertTriangle,
  FileText,
  ChevronRight,
  Shield,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export const FundingSidebar = ({
  activeTab,
  setActiveTab,
  dutyActive,
  setDutyActive,
  officer,
  pendingReviewCount = 12,
  onSignOut
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Funding Dashboard',
      icon: LayoutGrid,
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
      icon: Heart,
      badge: null
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'allocations',
      label: 'Allocation & Expenditure',
      icon: Briefcase,
      badge: null
    },
    {
      id: 'suspicious',
      label: 'Suspicious Flag Review',
      icon: AlertTriangle,
      badge: null
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
        <div className="fo-brand-row" style={{ textDecoration: 'none' }}>
          <HumanAidLogo variant="full" size="md" withContainer={true} />
        </div>
      </div>

      {/* Officer Card with Live Duty Toggle */}
      <div className="fo-officer-card">
        <div className="fo-officer-info">
          <div className="fo-officer-avatar">
            {officer?.shortName || 'MW'}
          </div>
          <div className="fo-officer-meta">
            <span className="fo-officer-pre">SIGNED IN AS</span>
            <span className="fo-officer-role">{officer?.role || 'Donor / Funding Officer'}</span>
            <span className="fo-officer-name">{officer?.fullName || 'Malini Wijeratne'}</span>
          </div>
        </div>

        {/* Duty Status Switch Pill */}
        <div
          className={`fo-duty-toggle ${dutyActive ? 'active' : ''}`}
          onClick={() => setDutyActive && setDutyActive(!dutyActive)}
          title={`Status: ${dutyActive ? 'On Duty' : 'Off Duty'}`}
        >
          <div className="fo-duty-dot"></div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="fo-nav-menu">
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
                <span className="fo-nav-badge">
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
          <div className="fo-privacy-notice-header">
            <ShieldCheck size={14} className="fo-privacy-shield-icon" />
            <span className="fo-privacy-title">Role access boundary</span>
          </div>
          <p className="fo-privacy-text">
            Approved donor and funding records only. Payment processing and unrelated personal data are excluded.
          </p>
        </div>

        <button 
          type="button" 
          className="fo-signout-btn" 
          onClick={onSignOut}
          title="Sign out of Donor & Funding Officer session"
        >
          <LogOut size={14} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default FundingSidebar;

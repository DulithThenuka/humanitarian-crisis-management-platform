import React from 'react';
import { Search, Bell, ShieldCheck } from 'lucide-react';

export const FundingHeader = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  officer,
  onOpenNotifications,
  unreadCount = 0
}) => {
  const getTabLabel = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Funding Dashboard';
      case 'donors': return 'Donor Management';
      case 'donations': return 'Donation Records';
      case 'campaigns': return 'Campaigns';
      case 'allocations': return 'Allocation & Expenditure';
      case 'suspicious': return 'Suspicious Flag Review';
      case 'reports': return 'Transparency Reports';
      default: return 'Funding Dashboard';
    }
  };

  return (
    <div className="fo-header-container">
      {/* Top Header Row */}
      <header className="fo-header">
        <div className="fo-header-left">
          {/* Breadcrumb Navigation */}
          <div className="fo-breadcrumb">
            <span className="fo-breadcrumb-root">DONOR / FUNDING OFFICER PORTAL</span>
            <span className="fo-breadcrumb-current">{getTabLabel(activeTab)}</span>
          </div>

          {/* Search Bar */}
          <div className="fo-search-wrapper">
            <Search size={14} className="fo-search-icon" />
            <input
              type="text"
              placeholder="Search authorised records..."
              className="fo-search-input"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="fo-header-right">
          {/* Active Operation Status Box */}
          <div className="fo-operation-box" onClick={onOpenNotifications}>
            <div className="fo-op-info">
              <span className="fo-op-label">Active operation</span>
              <span className="fo-op-value">Western Province Flood</span>
            </div>
            <div className="fo-op-bell">
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="fo-bell-badge">{unreadCount}</span>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="fo-header-user">
            <div className="fo-officer-avatar">
              {officer?.shortName || 'MW'}
            </div>
            <div className="fo-user-text">
              <span className="fo-user-name">
                {officer?.fullName || 'Malini Wijeratne'}
              </span>
              <span className="fo-user-role">
                Funding Officer
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Operational Role-Scope Banner */}
      <div className="fo-prototype-banner">
        <ShieldCheck size={14} className="fo-banner-shield" />
        <span>
          <strong>Role-Scoped Live Workspace</strong> &nbsp;Connected to HumanitarianCrisisDb. Payment gateway credentials and unrelated personal data are excluded.
        </span>
      </div>
    </div>
  );
};

export default FundingHeader;

import React from 'react';
import { Search, Bell, AlertTriangle, ChevronRight } from 'lucide-react';

export const FundingHeader = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  officer,
  onOpenNotifications,
  unreadCount = 1
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
      default: return 'Funding Operations';
    }
  };

  return (
    <>
      {/* Coursework Prototype Banner (Light Oceanic Bar) */}
      <div className="fo-prototype-banner">
        <div className="fo-banner-left">
          <AlertTriangle size={13} color="#0284c7" />
          <span>
            <strong>Coursework prototype:</strong> All records, AI outputs and transactions are fictional demonstration data. Actions are local UI simulations.
          </span>
        </div>
        <div className="fo-banner-right">
          <span>ReliefCore Humanitarian Aid Platform</span>
          <span>•</span>
          <span>Western Province Ops</span>
        </div>
      </div>

      {/* Main Header Bar (Clean White Background) */}
      <header className="fo-header">
        <div className="fo-header-left">
          {/* Breadcrumb Navigation */}
          <div className="fo-breadcrumb">
            <span className="fo-breadcrumb-root">DONOR / FUNDING OFFICER PORTAL</span>
            <ChevronRight size={13} color="#94a3b8" />
            <span className="fo-breadcrumb-current">{getTabLabel(activeTab)}</span>
          </div>

          {/* Search Bar */}
          <div className="fo-search-wrapper">
            <Search size={14} className="fo-search-icon" />
            <input
              type="text"
              placeholder="Search authorised records..."
              className="fo-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="fo-header-right">
          {/* Active Operation Status Pill */}
          <div className="fo-operation-pill">
            <span className="fo-pulse-dot"></span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>Western Province Flood</span>
          </div>

          {/* Notification Alert Bell */}
          <button 
            className="fo-alert-bell-btn" 
            title="Operational Alerts"
            onClick={onOpenNotifications}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="fo-bell-badge">{unreadCount}</span>
            )}
          </button>

          {/* User Profile */}
          <div className="fo-header-user">
            <div className="fo-officer-avatar" style={{ width: '32px', height: '32px', fontSize: '11.5px' }}>
              {officer?.shortName || 'MW'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                {officer?.fullName || 'Malini Wijeratne'}
              </span>
              <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                Funding Officer
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

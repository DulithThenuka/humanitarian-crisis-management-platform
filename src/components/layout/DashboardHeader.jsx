import React from 'react';
import { Search, HelpCircle, Bell, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import reliefcoreIcon from '../../assets/reliefcore-icon.png';
import './DashboardHeader.css';

export const DashboardHeader = () => {
  const { user } = useAuth();
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AC';

  return (
    <header className="dashboard-top-header">
      <div className="header-left">
        <div className="header-breadcrumbs">
          <img src={reliefcoreIcon} alt="RELIEFCORE" className="breadcrumb-logo-icon" />
          <span className="breadcrumb-org">RELIEFCORE</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-curr">Dashboard</span>
        </div>
        <h1 className="header-page-title">Crisis Command Center</h1>
      </div>

      <div className="header-right">
        <div className="header-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search requests, locations, shelters..."
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <button className="header-icon-btn" title="Help & Documentation" aria-label="Help">
            <HelpCircle size={18} />
          </button>
          
          <button className="header-icon-btn notification-btn" title="Alerts & Notifications" aria-label="Notifications">
            <Bell size={18} />
            <span className="notification-dot"></span>
          </button>

          <button className="header-icon-btn" title="Language & Region" aria-label="Language">
            <Globe size={18} />
          </button>

          <div className="header-user-badge">
            <div className="header-avatar-circle">{initials}</div>
            <ChevronDown size={14} className="header-chevron" />
          </div>
        </div>
      </div>
    </header>
  );
};

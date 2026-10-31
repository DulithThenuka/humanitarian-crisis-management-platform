import React from 'react';
import { 
  Bell, 
  ChevronRight, 
  Download, 
  Plus, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export const NotificationCenterHub = ({ 
  onSelectScreen, 
  onExport, 
  showToast,
  areaFilter,
  setAreaFilter,
  operationalSummary
}) => {
  const hubTiles = [
    {
      id: 'inbox',
      seq: '01',
      title: 'Notification Inbox',
      desc: 'Detailed operational record with realistic data and connected actions'
    },
    {
      id: 'compose',
      seq: '02',
      title: 'Compose Notification',
      desc: 'Validated form with role-aware submission and confirmation'
    },
    {
      id: 'recipient-drawer',
      seq: '03',
      title: 'Recipient Detail Drawer',
      desc: 'Detailed operational record with realistic data and connected actions'
    },
    {
      id: 'delivery-status',
      seq: '04',
      title: 'Email & SMS Delivery Status',
      desc: 'Detailed operational record with realistic data and connected actions'
    },
    {
      id: 'failed-handling',
      seq: '05',
      title: 'Failed Notification Handling',
      desc: 'Detailed operational record with realistic data and connected actions'
    },
    {
      id: 'detail',
      seq: '06',
      title: 'Notification Detail',
      desc: 'Detailed operational record with realistic data and connected actions'
    }
  ];

  return (
    <div className="notif-container">
      {/* 1. Top Active Crisis Alert Bar */}
      <div className="notif-crisis-alert-bar">
        <div className="alert-bar-left">
          <AlertTriangle size={15} color="#d97706" />
          <span className="alert-bar-title">Active crisis Western Province Flood Response</span>
          <span className="badge-severity-pill">
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#b45309', display: 'inline-block' }}></span>
            High severity
          </span>
        </div>
        <button 
          className="alert-bar-right"
          onClick={() => {
            showToast?.(`Filtering operational area: ${areaFilter === 'All affected areas' ? 'Kelani East - Zone 03' : 'All affected areas'}`, 'info');
            setAreaFilter?.(prev => prev === 'All affected areas' ? 'Kelani East - Zone 03' : 'All affected areas');
          }}
        >
          <span>Operational area {areaFilter}</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* 2. Top Header & Action Row */}
      <div className="notif-header-row">
        <div className="notif-header-col-left">
          <span className="notif-section-tag">COMMUNICATIONS</span>
          <h1 className="notif-page-title">Notification Centre</h1>
          <p className="notif-page-subtitle">
            Manage recipient notifications across email, SMS and push integration channels.
          </p>
        </div>

        <div className="notif-header-actions">
          <button 
            type="button" 
            className="btn-notif-outline"
            onClick={onExport}
          >
            <Download size={13} />
            <span>Export</span>
          </button>
          <button 
            type="button" 
            className="btn-notif-primary"
            onClick={() => onSelectScreen('compose')}
          >
            <Plus size={14} />
            <span>Create new</span>
          </button>
        </div>
      </div>

      {/* 3. Hero Active Operation Banner */}
      <div className="notif-hero-banner">
        <div className="hero-banner-left-wrap">
          <div className="hero-bell-icon-box">
            <Bell size={20} />
          </div>
          <div className="hero-banner-text-col">
            <span className="hero-tag-mini">ACTIVE OPERATION</span>
            <div className="hero-operation-name">Western Province Flood Response</div>
            <div className="hero-operation-meta">
              CR-2026-014 · High severity · Updated moments ago
            </div>
          </div>
        </div>

        <div className="badge-operational-status">
          <span className="dot-pulse-green"></span>
          <span>Operational</span>
        </div>
      </div>

      {/* 4. Six Hub Navigation Cards */}
      <div className="notif-hub-grid">
        {hubTiles.map(tile => (
          <div
            key={tile.id}
            className="notif-hub-tile-card"
            onClick={() => onSelectScreen(tile.id)}
            role="button"
            tabIndex={0}
          >
            <div className="tile-content-left">
              <div className="tile-seq-box">{tile.seq}</div>
              <div className="tile-text-col">
                <div className="tile-title">{tile.title}</div>
                <div className="tile-desc">{tile.desc}</div>
              </div>
            </div>
            <ChevronRight size={16} className="tile-arrow-icon" />
          </div>
        ))}
      </div>

      {/* 5. Bottom 3 Information Feature Cards */}
      <div className="notif-features-grid">
        <div className="notif-feature-card">
          <div className="feature-icon-badge">
            <FileText size={16} />
          </div>
          <div className="feature-text-col">
            <div className="feature-title">Structured records</div>
            <div className="feature-desc">
              Search, filters, pagination, detail views and permission-aware actions.
            </div>
          </div>
        </div>

        <div className="notif-feature-card">
          <div className="feature-icon-badge">
            <ShieldCheck size={16} />
          </div>
          <div className="feature-text-col">
            <div className="feature-title">Role-based control</div>
            <div className="feature-desc">
              Sensitive actions require an authorised role and produce an audit event.
            </div>
          </div>
        </div>

        <div className="notif-feature-card">
          <div className="feature-icon-badge">
            <AlertTriangle size={16} />
          </div>
          <div className="feature-text-col">
            <div className="feature-title">Resilient workflows</div>
            <div className="feature-desc">
              Loading, empty, failure and manual fallback states are represented.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Plus, 
  Search, 
  Check, 
  X, 
  User, 
  Phone, 
  Mail, 
  Smartphone, 
  Send, 
  Copy, 
  MapPin, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { RECIPIENTS_DATA } from './notificationData';

export const RecipientDetailDrawerView = ({ 
  notifications = [], 
  onBackToHub, 
  onSelectScreen, 
  onExport,
  showToast 
}) => {
  const [showBanner, setShowBanner] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState(RECIPIENTS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(true);

  const moduleScreens = [
    { id: 'inbox', label: 'Notification Inbox' },
    { id: 'compose', label: 'Compose Notification' },
    { id: 'recipient-drawer', label: 'Recipient Detail Drawer' },
    { id: 'delivery-status', label: 'Email & SMS Delivery Status' },
    { id: 'failed-handling', label: 'Failed Notification Handling' },
    { id: 'detail', label: 'Notification Detail' }
  ];

  const filteredRecipients = RECIPIENTS_DATA.filter(r => 
    !searchQuery || 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.includes(searchQuery) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyToken = () => {
    navigator.clipboard?.writeText('fcm_token_srilanka_aid_' + selectedRecipient.id.toLowerCase());
    showToast?.(`Recipient push token for ${selectedRecipient.name} copied to clipboard!`, 'success');
  };

  const handleResend = () => {
    showToast?.(`High-priority dispatch re-sent to ${selectedRecipient.phone} via primary gateway`, 'success');
  };

  return (
    <div className="notif-container">
      {/* 1. Breadcrumb Row */}
      <div className="notif-breadcrumb-row">
        <button 
          type="button" 
          className="notif-back-btn"
          onClick={onBackToHub}
        >
          <ChevronLeft size={14} />
          <span>Back to Notification Centre</span>
        </button>
        <span className="notif-breadcrumb-path-text">
          Notification Centre / Recipient Detail Drawer
        </span>
      </div>

      {/* 2. Page Header & Actions */}
      <div className="notif-header-row">
        <div className="notif-header-col-left">
          <span className="notif-section-tag">COMMUNICATIONS</span>
          <h1 className="notif-page-title">Recipient Detail Drawer</h1>
          <p className="notif-page-subtitle">
            Manage recipient notifications across email, SMS and push integration channels. · Fictional demonstration data
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

      {/* 3. Horizontal MODULE SCREENS Tab Bar */}
      <div className="notif-subscreens-bar">
        <span className="subscreens-label">MODULE SCREENS</span>
        <div className="subscreens-tabs-list">
          {moduleScreens.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`module-screen-tab-btn ${tab.id === 'recipient-drawer' ? 'active' : ''}`}
              onClick={() => onSelectScreen(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Prototype Action Completed Alert Banner */}
      {showBanner && (
        <div className="banner-action-completed">
          <div className="banner-completed-left">
            <Check size={16} color="#059669" />
            <div>
              <strong>Prototype action completed</strong>
              <div style={{ fontSize: '11.5px', color: '#047857' }}>
                The change is displayed locally and would create an audit event in a connected implementation.
              </div>
            </div>
          </div>
          <button 
            type="button" 
            className="banner-close-btn"
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 5. 2-Column Split: Recipient Directory on Left, Detailed Drawer on Right */}
      <div className="notif-split-workspace" style={{ gridTemplateColumns: drawerOpen ? '1fr 340px' : '1fr' }}>
        {/* Recipient Roster Table */}
        <div className="notif-main-card">
          <div className="notif-table-toolbar">
            <div className="toolbar-left-filters">
              <div className="notif-search-field">
                <Search size={14} className="notif-search-icon" />
                <input
                  type="text"
                  placeholder="Search recipient directory..."
                  className="notif-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Showing <b>{filteredRecipients.length}</b> verified contacts
              </span>
            </div>

            <button 
              type="button" 
              className="btn-notif-outline"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <span>{drawerOpen ? 'Hide Drawer' : 'Show Drawer'}</span>
            </button>
          </div>

          <table className="notif-data-table">
            <thead>
              <tr>
                <th>RECIPIENT ID</th>
                <th>NAME / ROLE</th>
                <th>PRIMARY CHANNEL</th>
                <th>DELIVERY SUCCESS</th>
                <th>LOCATION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipients.map(r => {
                const isSelected = selectedRecipient.id === r.id;
                return (
                  <tr
                    key={r.id}
                    className="notif-table-row"
                    style={{ backgroundColor: isSelected ? '#f0fdf4' : 'transparent' }}
                    onClick={() => {
                      setSelectedRecipient(r);
                      setDrawerOpen(true);
                      showToast?.(`Viewing recipient profile: ${r.name}`, 'info');
                    }}
                  >
                    <td className="cell-reference">{r.id}</td>
                    <td>
                      <div className="cell-name-record">
                        <span className="cell-name-title">{r.name}</span>
                        <span className="cell-name-sub">{r.role}</span>
                      </div>
                    </td>
                    <td className="cell-category-tag">{r.phone}</td>
                    <td>
                      <span className="status-pill-badge delivered">
                        <span className="dot-status"></span>
                        <span>{r.stats.deliverySuccessRate}</span>
                      </span>
                    </td>
                    <td className="cell-updated-time">{r.location}</td>
                    <td className="cell-action-arrow">
                      <ChevronRight size={14} color={isSelected ? '#059669' : '#94a3b8'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detailed Drawer Dock */}
        {drawerOpen && (
          <aside className="recipient-drawer-dock">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="drawer-top-profile">
                <div className="drawer-avatar-circle">
                  {selectedRecipient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="drawer-name-title" style={{ margin: 0 }}>{selectedRecipient.name}</h3>
                  <span className="drawer-role-tag">{selectedRecipient.category}</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#475569', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={13} color="#0f766e" />
                <strong>{selectedRecipient.phone}</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Carrier: {selectedRecipient.carrier}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <Mail size={13} color="#0f766e" />
                <span>{selectedRecipient.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <MapPin size={13} color="#0f766e" />
                <span>{selectedRecipient.location}</span>
              </div>
            </div>

            {/* Channel Status */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12.5px', color: '#0f172a' }}>Configured Channels</h4>
              <div className="channel-status-grid">
                <div className="channel-card-item">
                  <span className="channel-name-head">SMS</span>
                  <span className="channel-val-text" style={{ color: '#059669' }}>Online</span>
                </div>
                <div className="channel-card-item">
                  <span className="channel-name-head">Email</span>
                  <span className="channel-val-text" style={{ color: '#059669' }}>Verified</span>
                </div>
                <div className="channel-card-item">
                  <span className="channel-name-head">Push</span>
                  <span className="channel-val-text" style={{ color: '#2563eb' }}>Registered</span>
                </div>
              </div>
            </div>

            {/* Recent Message History for this Recipient */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12.5px', color: '#0f172a' }}>Delivery Dispatch History</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedRecipient.recentAlerts.map((alert, idx) => (
                  <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px', fontSize: '11.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#0f172a' }}>{alert.title}</strong>
                      <span className={`status-pill-badge ${alert.status.toLowerCase()}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                        {alert.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '10.5px', marginTop: '4px' }}>
                      <span>{alert.time} · {alert.channel}</span>
                      <span>Latency: {alert.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button 
                type="button" 
                className="btn-notif-outline"
                onClick={handleCopyToken}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Copy size={12} />
                <span>Copy Token</span>
              </button>
              <button 
                type="button" 
                className="btn-notif-primary"
                onClick={handleResend}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Send size={12} />
                <span>Resend Alert</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

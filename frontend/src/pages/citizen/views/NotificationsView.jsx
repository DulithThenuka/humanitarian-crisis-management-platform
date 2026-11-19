import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, ChevronRight, CheckCheck } from 'lucide-react';
import { CITIZEN_NOTIFICATIONS } from '../data/citizenPortalData';

export const NotificationsView = ({ onSelectTab, showToast }) => {
  const [notifications, setNotifications] = useState(CITIZEN_NOTIFICATIONS);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [readFilter, setReadFilter] = useState('All');

  const filtered = notifications.filter((item) => {
    if (readFilter === 'unread' && !item.isUnread) return false;
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    if (showToast) {
      showToast('All 3 unread notifications marked as read');
    }
  };

  const handleNotificationClick = (item) => {
    if (showToast) {
      showToast(`Viewing details for notification: ${item.title}`);
    }
  };

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">3 UNREAD MESSAGES</span>
          <h1 className="cp-view-title">Notifications</h1>
          <p className="cp-view-subtitle">
            Request updates, assignments, shelter information and verified alerts.
          </p>
        </div>
        <div>
          <button onClick={handleMarkAllRead} className="cp-btn-secondary">
            <CheckCheck size={14} />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <select
          className="cp-form-select"
          style={{ width: 'auto' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All categories</option>
          <option value="REQUEST UPDATES">Request Updates</option>
          <option value="IMPORTANT ANNOUNCEMENTS">Important Announcements</option>
          <option value="ASSISTANCE ASSIGNMENT">Assistance Assignment</option>
        </select>

        <select
          className="cp-form-select"
          style={{ width: 'auto' }}
          value={readFilter}
          onChange={(e) => setReadFilter(e.target.value)}
        >
          <option value="All">All messages</option>
          <option value="unread">Unread only</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="cp-card" style={{ padding: '4px 0' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNotificationClick(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #edf1eb',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            className="cp-notif-row"
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: '#f0f4ee',
                  color: '#1e3d2c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                {item.iconType === 'alert' && <AlertTriangle size={16} />}
                {item.iconType === 'file' && <FileText size={16} />}
                {item.iconType === 'check' && <CheckCircle size={16} />}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      backgroundColor: '#edf1eb',
                      color: '#405044',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {item.category}
                  </span>

                  {item.isUnread && (
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: 800,
                        backgroundColor: '#162e20',
                        color: '#ffffff',
                        letterSpacing: '0.04em'
                      }}
                    >
                      UNREAD
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#162e20', margin: '2px 0 2px 0' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '12px', color: '#657367', margin: '0 0 6px 0' }}>
                  {item.description}
                </p>

                <div style={{ fontSize: '11px', color: '#9fa89e' }}>{item.time}</div>
              </div>
            </div>

            <ChevronRight size={16} color="#9fa89e" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsView;

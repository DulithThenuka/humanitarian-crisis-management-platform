import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  CheckCheck,
  RefreshCw,
  Info,
  Clock,
  Bell
} from 'lucide-react';
import { requestService } from '../../../services/requestService';
import { adminService } from '../../../services/adminService';
import { useAuth } from '../../../context/AuthContext';
import { useRealtimeRefresh } from '../../../hooks/useRealtimeRefresh';

export const NotificationsView = ({ onSelectTab, showToast }) => {
  const { user } = useAuth();
  const userId = user?.id || user?.userId || 'citizen_guest';
  const storageKey = `reliefcore_read_notifications_${userId}`;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [readFilter, setReadFilter] = useState('All');

  const getReadNotificationIds = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, [storageKey]);

  const saveReadNotificationIds = useCallback((ids) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(ids));
    } catch {
      // non-fatal
    }
  }, [storageKey]);

  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const readIds = new Set(getReadNotificationIds());
      const aggregated = [];

      // 1. Fetch citizen requests
      try {
        const reqRes = await requestService.getAll();
        const reqList = reqRes?.data || (Array.isArray(reqRes) ? reqRes : []);
        if (Array.isArray(reqList)) {
          reqList.forEach((r) => {
            const reqRef = r.id ? `REQ-${r.id.toString().substring(0, 8).toUpperCase()}` : 'REQ';
            const isResolved = r.status === 3 || r.status === 'Resolved' || r.status === 'Closed';
            const isVerified = r.status === 1 || r.status === 'Verified';
            const isInProgress = r.status === 2 || r.status === 'InProgress';

            const notifId = `req_${r.id}_${r.status}`;
            const timeAgo = r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent';

            let title = `Assistance request ${reqRef} submitted`;
            let description = `Your application for ${r.category || 'aid'} is currently queued for triage.`;
            let cat = 'REQUEST UPDATES';
            let iconType = 'file';

            if (isResolved) {
              title = `Assistance completed for ${reqRef}`;
              description = `Your emergency assistance request was marked fulfilled.`;
              cat = 'ASSISTANCE ASSIGNMENT';
              iconType = 'check';
            } else if (isInProgress) {
              title = `Aid in progress for ${reqRef}`;
              description = `Relief resources have been allocated and queued for dispatch.`;
              cat = 'ASSISTANCE ASSIGNMENT';
              iconType = 'check';
            } else if (isVerified) {
              title = `Request ${reqRef} verified by Coordinator`;
              description = `An emergency coordinator reviewed and approved your request.`;
              cat = 'REQUEST UPDATES';
              iconType = 'file';
            }

            aggregated.push({
              id: notifId,
              targetTab: 'requests',
              category: cat,
              isUnread: !readIds.has(notifId),
              title,
              description,
              time: `${timeAgo} · Related request ${reqRef}`,
              iconType
            });
          });
        }
      } catch (e) {
        // non-fatal
      }

      // 2. Fetch active crisis broadcasts
      try {
        const alertRes = await adminService.getActiveBroadcasts();
        const alertList = alertRes?.succeeded && Array.isArray(alertRes.data)
          ? alertRes.data
          : Array.isArray(alertRes)
          ? alertRes
          : [];
        if (Array.isArray(alertList)) {
          alertList.forEach((a) => {
            const notifId = `alert_${a.id}`;
            const timeAgo = a.sentAt ? new Date(a.sentAt).toLocaleDateString() : 'Today';

            aggregated.push({
              id: notifId,
              targetTab: 'alerts',
              category: 'IMPORTANT ANNOUNCEMENTS',
              isUnread: !readIds.has(notifId),
              title: `Crisis Alert: ${a.title}`,
              description: a.message || 'Avoid hazard zones and follow official safety directives.',
              time: `${timeAgo} · ${a.targetRegion || 'Western Province'}`,
              iconType: 'alert'
            });
          });
        }
      } catch (e) {
        // non-fatal
      }

      setNotifications(aggregated);
    } finally {
      setLoading(false);
    }
  }, [getReadNotificationIds]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useRealtimeRefresh(['notifications', 'assistancerequests', 'broadcasts'], refreshNotifications);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    saveReadNotificationIds(allIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    if (showToast) {
      showToast('All notifications marked as read');
    }
  };

  const handleNotificationClick = (item) => {
    const readIds = new Set(getReadNotificationIds());
    readIds.add(item.id);
    saveReadNotificationIds(Array.from(readIds));

    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isUnread: false } : n))
    );

    if (item.targetTab && onSelectTab) {
      onSelectTab(item.targetTab);
    }
    if (showToast) {
      showToast(`Viewing: ${item.title}`);
    }
  };

  const filtered = useMemo(() => {
    return notifications.filter((item) => {
      if (readFilter === 'unread' && !item.isUnread) return false;
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      return true;
    });
  }, [notifications, readFilter, categoryFilter]);

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">
            {unreadCount > 0 ? `${unreadCount} UNREAD NOTIFICATIONS` : 'ALL CAUGHT UP'}
          </span>
          <h1 className="cp-view-title">Notifications</h1>
          <p className="cp-view-subtitle">
            Live request progression updates, coordinator verification notes, and verified emergency alerts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={refreshNotifications}
            className="cp-btn-secondary"
            title="Refresh notifications"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="cp-btn-secondary">
              <CheckCheck size={14} />
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap'
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
          <option value="unread">Unread only ({unreadCount})</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="cp-card" style={{ padding: '4px 0' }}>
        {loading && notifications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: '#657367' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 8px auto', color: '#1e3d2c' }} />
            <p style={{ fontSize: '13px', margin: 0 }}>Syncing notifications...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#738075' }}>
            <Bell size={28} style={{ margin: '0 auto 8px auto', color: '#9fa89e' }} />
            <div style={{ fontSize: '14px', fontWeight: 600 }}>No notifications found</div>
            <div style={{ fontSize: '12px', marginTop: '2px' }}>
              {readFilter === 'unread'
                ? 'You have read all current notifications.'
                : 'There are no notifications matching your selected filter.'}
            </div>
          </div>
        )}

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
              backgroundColor: item.isUnread ? '#f8faf7' : '#ffffff',
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
                  backgroundColor: item.isUnread ? '#edf4ec' : '#f0f4ee',
                  color: '#1e3d2c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                {item.iconType === 'alert' && <AlertTriangle size={16} color="#dc2626" />}
                {item.iconType === 'file' && <FileText size={16} color="#2563eb" />}
                {item.iconType === 'check' && <CheckCircle size={16} color="#059669" />}
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
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#059669'
                      }}
                      title="Unread"
                    />
                  )}
                </div>

                <h3
                  style={{
                    fontSize: '13.5px',
                    fontWeight: item.isUnread ? 700 : 600,
                    color: '#162e20',
                    margin: '0 0 3px 0'
                  }}
                >
                  {item.title}
                </h3>

                <p style={{ fontSize: '12px', color: '#657367', margin: 0, lineHeight: 1.4 }}>
                  {item.description}
                </p>

                <div style={{ fontSize: '11px', color: '#9fa89e', marginTop: '6px' }}>
                  {item.time}
                </div>
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

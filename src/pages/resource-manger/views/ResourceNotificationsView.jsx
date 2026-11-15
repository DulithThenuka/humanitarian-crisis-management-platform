import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  Droplet,
  Package,
  Layers,
  ChevronRight,
  Filter,
  CheckCheck,
  Trash2
} from 'lucide-react';

export const ResourceNotificationsView = ({ onNavigate, onUpdateBadgeCount }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-1',
      title: 'Critical Deficit: Drinking Water at Central Depot',
      detail: 'Available stock is 280 units against 380 requested. Reorder threshold of 500 exceeded.',
      time: '2 min ago',
      category: 'stock',
      priority: 'critical',
      priorityType: 'critical',
      read: false,
      actionLabel: 'Check Stock',
      actionTab: 'inventory'
    },
    {
      id: 'NOTIF-2',
      title: 'High Priority Allocation: Drinking Water (RAR-204)',
      detail: 'Emergency Coordinator Maya Fernando submitted request for 140 units to Kelani East.',
      time: '12 min ago',
      category: 'allocation',
      priority: 'critical',
      priorityType: 'critical',
      read: false,
      actionLabel: 'Review Request',
      actionTab: 'allocations'
    },
    {
      id: 'NOTIF-3',
      title: 'Dispatch En Route: DSP-041 Departed Central Depot',
      detail: 'Rapid Logistics Team is en route to Kelani East evacuation center (ETA: 11:30 AM).',
      time: '1 hour ago',
      category: 'dispatch',
      priority: 'info',
      priorityType: 'info',
      read: true,
      actionLabel: 'Track Delivery',
      actionTab: 'tracking'
    },
    {
      id: 'NOTIF-4',
      title: 'Delivery Confirmed: DSP-038 Signed at SH-008',
      detail: '60 Thermal Blankets delivered and signed by Shelter Admin H. Ranasinghe.',
      time: '2 hours ago',
      category: 'dispatch',
      priority: 'success',
      priorityType: 'success',
      read: true,
      actionLabel: 'View Manifest',
      actionTab: 'tracking'
    },
    {
      id: 'NOTIF-5',
      title: 'New Partner Verified: Aqua Relief Supplies (SUP-014)',
      detail: 'Emergency water and purification supply contract verified by Regional Operations.',
      time: '3 hours ago',
      category: 'supplier',
      priority: 'success',
      priorityType: 'success',
      read: true,
      actionLabel: 'View Suppliers',
      actionTab: 'suppliers'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('ALL');

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'CRITICAL') return n.priority === 'critical';
    if (activeFilter === 'DISPATCH') return n.category === 'dispatch';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (onUpdateBadgeCount) onUpdateBadgeCount(0);
  };

  const toggleRead = (id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
      const remainingUnread = updated.filter((n) => !n.read).length;
      if (onUpdateBadgeCount) onUpdateBadgeCount(remainingUnread);
      return updated;
    });
  };

  const dismiss = (id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      const remainingUnread = updated.filter((n) => !n.read).length;
      if (onUpdateBadgeCount) onUpdateBadgeCount(remainingUnread);
      return updated;
    });
  };

  return (
    <div className="rm-view-container">
      {/* Header */}
      <div className="rm-header-row">
        <div>
          <span className="rm-header-kicker">REAL-TIME LOGISTICS & ALLOCATION SIGNALS</span>
          <h1 className="rm-header-title">Operational Notifications</h1>
          <p className="rm-header-subtitle">
            Audited alerts from Emergency Coordinators, storage depot shortfalls and delivery confirmations.
          </p>
        </div>
        <div className="rm-header-actions">
          {unreadCount > 0 && (
            <button type="button" className="rm-btn-outline" onClick={markAllRead}>
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="rm-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${activeFilter === 'ALL' ? 'var(--rm-primary-blue)' : 'var(--rm-border)'}`,
              backgroundColor: activeFilter === 'ALL' ? 'var(--rm-ice-blue-pill)' : '#ffffff',
              color: activeFilter === 'ALL' ? 'var(--rm-primary-blue)' : 'var(--rm-text-secondary)',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer'
            }}
          >
            All Alerts ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('UNREAD')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${activeFilter === 'UNREAD' ? 'var(--rm-primary-blue)' : 'var(--rm-border)'}`,
              backgroundColor: activeFilter === 'UNREAD' ? 'var(--rm-ice-blue-pill)' : '#ffffff',
              color: activeFilter === 'UNREAD' ? 'var(--rm-primary-blue)' : 'var(--rm-text-secondary)',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer'
            }}
          >
            Unread ({unreadCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('CRITICAL')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${activeFilter === 'CRITICAL' ? '#fca5a5' : 'var(--rm-border)'}`,
              backgroundColor: activeFilter === 'CRITICAL' ? '#fee2e2' : '#ffffff',
              color: activeFilter === 'CRITICAL' ? '#dc2626' : 'var(--rm-text-secondary)',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer'
            }}
          >
            Critical Priority ({notifications.filter((n) => n.priority === 'critical').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('DISPATCH')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${activeFilter === 'DISPATCH' ? 'var(--rm-primary-blue)' : 'var(--rm-border)'}`,
              backgroundColor: activeFilter === 'DISPATCH' ? 'var(--rm-ice-blue-pill)' : '#ffffff',
              color: activeFilter === 'DISPATCH' ? 'var(--rm-primary-blue)' : 'var(--rm-text-secondary)',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer'
            }}
          >
            Dispatches ({notifications.filter((n) => n.category === 'dispatch').length})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
        {filtered.length === 0 ? (
          <div className="rm-section-box" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle size={36} color="var(--rm-primary-blue)" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>All Caught Up</h3>
            <p style={{ fontSize: 13, color: 'var(--rm-text-muted)', marginTop: 4 }}>
              No notifications matching the selected filter.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: item.read ? '#ffffff' : '#f0f9ff',
                border: `1px solid ${item.read ? 'var(--rm-border)' : 'var(--rm-ice-blue-border)'}`,
                borderLeft: item.read ? '1px solid var(--rm-border)' : '4px solid var(--rm-primary-blue)',
                borderRadius: 10,
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      item.priority === 'critical' ? '#fee2e2' : item.priority === 'success' ? '#dcfce7' : '#e0f2fe',
                    color:
                      item.priority === 'critical' ? '#dc2626' : item.priority === 'success' ? '#15803d' : '#0284c7'
                  }}
                >
                  {item.category === 'stock' && <Droplet size={18} />}
                  {item.category === 'allocation' && <Package size={18} />}
                  {item.category === 'dispatch' && <Send size={18} />}
                  {item.category === 'supplier' && <CheckCircle size={18} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--rm-text-primary)' }}>
                      {item.title}
                    </span>
                    {!item.read && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'var(--rm-primary-blue)'
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--rm-text-secondary)', lineHeight: 1.4 }}>
                    {item.detail}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--rm-text-muted)', marginTop: 4 }}>
                    {item.time}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  className="rm-btn-primary"
                  style={{ padding: '6px 14px', fontSize: 12.5 }}
                  onClick={() => onNavigate(item.actionTab)}
                >
                  {item.actionLabel}
                  <ChevronRight size={14} />
                </button>

                <button
                  type="button"
                  className="rm-modal-close-corner-btn"
                  title={item.read ? 'Mark as unread' : 'Mark as read'}
                  onClick={() => toggleRead(item.id)}
                >
                  <CheckCheck size={16} color={item.read ? 'var(--rm-text-muted)' : 'var(--rm-primary-blue)'} />
                </button>

                <button
                  type="button"
                  className="rm-modal-close-corner-btn"
                  title="Dismiss notification"
                  onClick={() => dismiss(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


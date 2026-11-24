import React, { useState } from 'react';
import {
  Bell,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileText,
  Send,
  ChevronDown
} from 'lucide-react';

export const NotificationsMessagesView = ({
  notifications: initialNotifications,
  onMarkAllAsRead,
  showToast,
  onNavigateTab
}) => {
  // Enhanced notification models matching the Figma master-detail specifications
  const [notifList, setNotifList] = useState([
    {
      id: 'notif-1',
      category: 'TASK ASSIGNMENT',
      categoryTitle: 'Task Assignment',
      title: 'New assignment offered',
      description: 'VOL-009 requires a response by today at 18:00.',
      time: '8 min ago',
      unread: true,
      relatedTask: {
        id: 'VOL-009',
        title: 'Emergency Supply Distribution'
      },
      messages: [
        {
          id: 'm1',
          sender: 'Maya Fernando • Coordinator',
          text: 'Please confirm you have reviewed the updated safety instructions before accepting.',
          isCoordinator: true
        },
        {
          id: 'm2',
          sender: 'Nadeesha Perera',
          text: 'I have reviewed the instructions and will confirm my availability.',
          isCoordinator: false
        }
      ]
    },
    {
      id: 'notif-2',
      category: 'SAFETY',
      categoryTitle: 'Safety Alert',
      title: 'Safety instructions updated',
      description: 'Review the updated flood-distribution safety instructions.',
      time: '35 min ago',
      unread: true,
      relatedTask: {
        id: 'VOL-004',
        title: 'Shelter Support - Kelani North'
      },
      messages: [
        {
          id: 'm3',
          sender: 'Maya Fernando • Coordinator',
          text: 'Mandatory PPE protocol in effect: high-visibility vests and boots must be worn in flooded zones.',
          isCoordinator: true
        }
      ]
    },
    {
      id: 'notif-3',
      category: 'SCHEDULE',
      categoryTitle: 'Schedule Notice',
      title: 'Schedule changed',
      description: 'VOL-004 now begins at 10:00 on 21 February.',
      time: '4 hours ago',
      unread: false,
      relatedTask: {
        id: 'VOL-004',
        title: 'Shelter Support Shift'
      },
      messages: [
        {
          id: 'm4',
          sender: 'Maya Fernando • Coordinator',
          text: 'The staging window at Kelani East has been pushed forward by 1 hour to accommodate supply delivery.',
          isCoordinator: true
        }
      ]
    },
    {
      id: 'notif-4',
      category: 'TASK REVIEW',
      categoryTitle: 'Task Review',
      title: 'Completion report approved',
      description: 'Your report for VOL-001 was reviewed and approved.',
      time: 'Yesterday',
      unread: false,
      relatedTask: {
        id: 'VOL-001',
        title: 'Supply Transit Logistics'
      },
      messages: [
        {
          id: 'm5',
          sender: 'Maya Fernando • Coordinator',
          text: 'Thank you for your rapid response and 3 hours verified field service log.',
          isCoordinator: true
        }
      ]
    }
  ]);

  const [selectedNotifId, setSelectedNotifId] = useState('notif-1');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [readFilter, setReadFilter] = useState('All');
  const [messageInput, setMessageInput] = useState('');

  const selectedNotif =
    notifList.find((n) => n.id === selectedNotifId) || notifList[0];

  const filteredList = notifList.filter((item) => {
    const matchCategory =
      categoryFilter === 'All' || item.category === categoryFilter;
    const matchRead =
      readFilter === 'All' || (readFilter === 'Unread' && item.unread);
    return matchCategory && matchRead;
  });

  const handleMarkAllRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (onMarkAllAsRead) onMarkAllAsRead();
    if (showToast) showToast('All notifications marked as read.');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Nadeesha Perera',
      text: messageInput.trim(),
      isCoordinator: false
    };

    setNotifList((prev) =>
      prev.map((n) => {
        if (n.id === selectedNotif.id) {
          return {
            ...n,
            messages: [...n.messages, newMsg]
          };
        }
        return n;
      })
    );

    setMessageInput('');
    if (showToast) {
      showToast('Message sent to coordinator.');
    }
  };

  const renderIcon = (category) => {
    switch (category) {
      case 'SAFETY':
        return <ShieldCheck size={18} style={{ color: '#16a34a' }} />;
      case 'SCHEDULE':
        return <Calendar size={18} style={{ color: '#0284c7' }} />;
      case 'TASK REVIEW':
        return <CheckCircle2 size={18} style={{ color: '#16a34a' }} />;
      case 'TASK ASSIGNMENT':
      default:
        return <Bell size={18} style={{ color: '#ea580c' }} />;
    }
  };

  return (
    <div>
      {/* 1. Header Section */}
      <div className="vol-page-header">
        <div>
          <div
            className="vol-page-eyebrow"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#657367'
            }}
          >
            PRIVATE VOLUNTEER COMMUNICATIONS
          </div>
          <h1
            className="vol-page-title"
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '4px 0 6px 0',
              letterSpacing: '-0.02em'
            }}
          >
            Notifications & Messages
          </h1>
          <p
            className="vol-page-desc"
            style={{ fontSize: '13px', color: '#475569', margin: 0 }}
          >
            Task updates and messages between you and authorised coordinators only.
          </p>
        </div>
        <button
          className="vol-btn-outline"
          onClick={handleMarkAllRead}
          style={{
            height: '36px',
            padding: '0 16px',
            fontSize: '12.5px',
            fontWeight: 600,
            borderRadius: '6px'
          }}
        >
          Mark all as read
        </button>
      </div>

      {/* 2. Main Two-Column Layout (Figma Master-Detail View) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Notification Feed with Filter Dropdowns */}
        <div>
          {/* Filter Dropdowns Row */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 28px 7px 12px',
                  borderRadius: '6px',
                  border: '1px solid #dfe5d8',
                  background: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#14291e',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              >
                <option value="All">All categories</option>
                <option value="TASK ASSIGNMENT">Task Assignment</option>
                <option value="SAFETY">Safety</option>
                <option value="SCHEDULE">Schedule</option>
                <option value="TASK REVIEW">Task Review</option>
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#657367'
                }}
              />
            </div>

            <div style={{ position: 'relative', width: '130px' }}>
              <select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 28px 7px 12px',
                  borderRadius: '6px',
                  border: '1px solid #dfe5d8',
                  background: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#14291e',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              >
                <option value="All">All status</option>
                <option value="Unread">Unread only</option>
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#657367'
                }}
              />
            </div>
          </div>

          {/* Notifications Feed Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredList.map((item) => {
              const isSelected = item.id === selectedNotif?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedNotifId(item.id)}
                  style={{
                    backgroundColor: isSelected ? '#f2f6ee' : '#ffffff',
                    border: isSelected ? '1px solid #c7dbc0' : '1px solid #e2e8e0',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected
                      ? '0 1px 3px rgba(0, 0, 0, 0.04)'
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#fafbfc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#ffffff' : '#f4f6f2',
                        border: '1px solid #dfe5d8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {renderIcon(item.category)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: '#657367',
                          marginBottom: '3px'
                        }}
                      >
                        {item.category}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#14291e',
                          marginBottom: '3px',
                          lineHeight: 1.3
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: '11.5px',
                          color: '#4b6152',
                          lineHeight: 1.4,
                          marginBottom: '6px'
                        }}
                      >
                        {item.description}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#8a9480' }}>
                        {item.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Notification Detail & Task-Related Messages */}
        {selectedNotif && (
          <div
            className="vol-card"
            style={{
              padding: '24px 28px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8e0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Detail Top Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0f172a',
                    margin: '0 0 4px 0',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {selectedNotif.title}
                </h2>
                <div style={{ fontSize: '12px', color: '#657367' }}>
                  {selectedNotif.categoryTitle} • {selectedNotif.time}
                </div>
              </div>

              {selectedNotif.unread ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#0284c7'
                    }}
                  />
                  Unread
                </span>
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    fontSize: '11px',
                    fontWeight: 600
                  }}
                >
                  Read
                </span>
              )}
            </div>

            {/* Description Text */}
            <p
              style={{
                fontSize: '13px',
                color: '#334155',
                lineHeight: 1.5,
                margin: '0 0 16px 0'
              }}
            >
              {selectedNotif.description}
            </p>

            {/* Related Task Box */}
            {selectedNotif.relatedTask && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8e0',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #e2e8e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569'
                    }}
                  >
                    <FileText size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                      Related task - {selectedNotif.relatedTask.id}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {selectedNotif.relatedTask.title}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('assignments')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0c2340',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Open task
                </button>
              </div>
            )}

            {/* Sub-Section Header: TASK-RELATED MESSAGES */}
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#657367',
                marginBottom: '14px'
              }}
            >
              TASK-RELATED MESSAGES
            </div>

            {/* Chat Stream with Dark Blue Bubble */}
            <div
              style={{
                flex: 1,
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px'
              }}
            >
              {selectedNotif.messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    width: '100%',
                    backgroundColor: msg.isCoordinator ? '#f4f6f2' : '#0c2340',
                    color: msg.isCoordinator ? '#0f172a' : '#ffffff',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    lineHeight: 1.45,
                    boxShadow: msg.isCoordinator
                      ? 'none'
                      : '0 1px 3px rgba(12, 35, 64, 0.25)',
                    boxSizing: 'border-box'
                  }}
                >
                  {msg.isCoordinator && (
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#475569',
                        marginBottom: '4px'
                      }}
                    >
                      {msg.sender}
                    </div>
                  )}
                  <div
                    style={{
                      color: msg.isCoordinator ? '#0f172a' : '#ffffff',
                      fontWeight: 500
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Message Input */}
            <form
              onSubmit={handleSendMessage}
              style={{
                display: 'flex',
                gap: '8px',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9'
              }}
            >
              <input
                type="text"
                className="vol-filter-input"
                placeholder="Message authorised coordinator..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #dfe5d8',
                  fontSize: '12.5px'
                }}
              />
              <button
                type="submit"
                className="vol-btn-primary"
                style={{
                  width: '42px',
                  height: '40px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: '#0c2340',
                  flexShrink: 0
                }}
                title="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsMessagesView;

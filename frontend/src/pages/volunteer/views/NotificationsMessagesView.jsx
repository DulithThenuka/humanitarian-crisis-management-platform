import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  User,
  Clock,
  Phone
} from 'lucide-react';

export const NotificationsMessagesView = ({
  notifications,
  onMarkAllAsRead,
  showToast
}) => {
  const [messagesList, setMessagesList] = useState([
    {
      id: 1,
      sender: 'Maya Fernando',
      role: 'Logistics Coordinator (Kelani East)',
      phone: '+94 77 555 0192',
      text: 'Nadeesha, please arrive at Kelani Distribution Point at 08:30 sharp. The first 2 supply trucks from Colombo hub will arrive by 09:00.',
      time: 'Today - 09:15 AM',
      isCoordinator: true
    },
    {
      id: 2,
      sender: 'Nadeesha Perera',
      role: 'Humanitarian Volunteer',
      text: 'Understood Maya. I have my safety boots, vest and Red Cross first aid kit ready.',
      time: 'Today - 09:22 AM',
      isCoordinator: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeCoordinator, setActiveCoordinator] = useState('Maya Fernando');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: Date.now(),
      sender: 'Nadeesha Perera',
      role: 'Humanitarian Volunteer',
      text: newMessage.trim(),
      time: 'Just now',
      isCoordinator: false
    };

    setMessagesList([...messagesList, newMsgObj]);
    setNewMessage('');
    if (showToast) {
      showToast('Message sent to Field Coordinator');
    }
  };

  return (
    <div>
      <div className="vol-page-header">
        <div>
          <div className="vol-page-eyebrow">Communications & Field Updates</div>
          <h1 className="vol-page-title">Notifications & Messages</h1>
          <p className="vol-page-desc">
            Stay aligned with operational dispatches, safety notices, and direct coordinator instructions.
          </p>
        </div>
        <button
          className="vol-btn-outline"
          onClick={onMarkAllAsRead}
        >
          Mark all as read
        </button>
      </div>

      <div className="vol-two-col-grid">
        {/* Left Column: Notifications Feed */}
        <div className="vol-card">
          <div className="vol-card-header">
            <h3 className="vol-card-title">Recent Broadcasts & Alerts</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {notifications.length} notifications
            </span>
          </div>

          <div className="vol-list">
            {notifications.map((item) => (
              <div key={item.id} className="vol-list-item" style={{ padding: '12px 14px' }}>
                <div className="vol-item-left">
                  <div className="vol-item-icon-box">
                    {item.type === 'assignment' && <Bell size={18} style={{ color: '#ea580c' }} />}
                    {item.type === 'safety' && <ShieldCheck size={18} style={{ color: '#0284c7' }} />}
                    {item.type === 'approval' && <CheckCircle2 size={18} style={{ color: '#16a34a' }} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span className="vol-item-title">{item.title}</span>
                      {item.unread && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                      )}
                    </div>
                    <div className="vol-item-sub">{item.subtitle}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {item.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Direct Coordinator Messenger */}
        <div className="vol-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="vol-card-header">
            <div>
              <h3 className="vol-card-title">Coordinator Channel</h3>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Direct communication with assigned operational leads
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
              <Phone size={13} />
              <span>+94 77 555 0192</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, minHeight: '260px', maxHeight: '340px', overflowY: 'auto', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messagesList.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.isCoordinator ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  background: msg.isCoordinator ? '#f1f5f9' : '#183526',
                  color: msg.isCoordinator ? '#1e293b' : '#ffffff',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  lineHeight: 1.4
                }}
              >
                <div style={{ fontSize: '10.5px', opacity: 0.8, marginBottom: '3px', fontWeight: 600 }}>
                  {msg.sender} • {msg.time}
                </div>
                <div>{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMessage} style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="vol-filter-input"
              placeholder="Type message to field coordinator..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="vol-btn-primary">
              <Send size={15} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import {
  Clock,
  Send,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Radio,
  FileText
} from 'lucide-react';
import { COORDINATION_TIMELINE, WORKFLOW_RECIPIENTS } from '../data/coordinatorData';

export const ActivitySafetyView = ({ onRecordUpdate }) => {
  const [timeline, setTimeline] = useState(COORDINATION_TIMELINE);
  const [recipient, setRecipient] = useState(WORKFLOW_RECIPIENTS[0]);
  const [message, setMessage] = useState('');
  const [successBanner, setSuccessBanner] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please enter an operational message.');
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newEntry = {
      id: `TL-${Date.now()}`,
      time: timeStr,
      title: `Scoped update sent to ${recipient}`,
      scope: '1.0dB-SL42 - authorised participants only',
      messageContent: message
    };

    setTimeline([newEntry, ...timeline]);
    if (onRecordUpdate) {
      onRecordUpdate(newEntry);
    }
    setSuccessBanner(`Scoped update successfully logged to ${recipient}.`);
    setMessage('');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div>
      {/* 1. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">ACCESS-CONTROLLED COORDINATION</div>
          <h1 className="vc-page-title">Activity & Safety</h1>
          <p className="vc-page-desc">
            Only necessary operational information is shared. All messages are fictional demonstration records.
          </p>
        </div>
      </div>

      {/* Success banner */}
      {successBanner && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* 2. Main Two-Column Layout */}
      <div className="vc-split-layout">
        {/* Left Column: Timeline */}
        <div className="vc-split-main">
          <div className="vc-card">
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              Coordination timeline
            </h3>

            <div style={{ position: 'relative', paddingLeft: '6px' }}>
              {timeline.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    position: 'relative',
                    paddingBottom: index === timeline.length - 1 ? '0' : '20px'
                  }}
                >
                  {/* Vertical connecting line */}
                  {index !== timeline.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '42px',
                        top: '18px',
                        bottom: '0',
                        width: '2px',
                        backgroundColor: '#e2e8f0'
                      }}
                    />
                  )}

                  {/* Time label */}
                  <div
                    style={{
                      width: '38px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748b',
                      paddingTop: '2px',
                      flexShrink: 0
                    }}
                  >
                    {item.time}
                  </div>

                  {/* Bullet */}
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#233831',
                      marginTop: '6px',
                      flexShrink: 0,
                      zIndex: 1
                    }}
                  />

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                      {item.title}
                    </div>
                    {item.messageContent && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#334155',
                          marginTop: '4px',
                          padding: '6px 10px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        "{item.messageContent}"
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      {item.scope}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Record Scoped Update Form */}
        <div className="vc-inspector" style={{ minWidth: '340px' }}>
          <div className="vc-card" style={{ border: 'none', padding: 0 }}>
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '14px',
                paddingBottom: '8px',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              Record scoped update
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    marginBottom: '6px'
                  }}
                >
                  Recipient workflow
                </label>
                <select
                  className="vc-filter-select"
                  style={{ width: '100%' }}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                >
                  {WORKFLOW_RECIPIENTS.map((rec) => (
                    <option key={rec} value={rec}>
                      {rec}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    marginBottom: '6px'
                  }}
                >
                  Operational message
                </label>
                <textarea
                  className="vc-textarea"
                  rows={4}
                  placeholder="Do not include unrelated personal data..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '16px'
                }}
              >
                <ShieldCheck size={16} style={{ color: '#64748b', flexShrink: 0 }} />
                <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                  No real email, SMS or notification will be sent.
                </div>
              </div>

              <button
                type="submit"
                className="vc-btn-primary"
                style={{
                  width: '100%',
                  padding: '10px',
                  justifyContent: 'center',
                  backgroundColor: '#233831',
                  color: '#ffffff'
                }}
              >
                Record update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

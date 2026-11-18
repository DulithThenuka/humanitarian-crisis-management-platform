import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export const CoordinationWorkspaceView = ({
  timeline = [],
  onAddTimelineEntry,
  title = 'Coordination Workspace'
}) => {
  const [recipient, setRecipient] = useState('Resource & Logistics Manager');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fallbackTimeline = [
    {
      id: 'tl-1',
      time: '10:14',
      title: 'Partner Officer reviewed linked record',
      scope: 'HMR-1042 · authorised participants only'
    },
    {
      id: 'tl-2',
      time: '10:02',
      title: 'Scoped handoff received',
      scope: 'HMR-1042 · authorised participants only'
    },
    {
      id: 'tl-3',
      time: '09:48',
      title: 'Citizen update prepared',
      scope: 'HMR-1042 · authorised participants only'
    },
    {
      id: 'tl-4',
      time: '09:30',
      title: 'Simulated recommendation generated',
      scope: 'HMR-1042 · authorised participants only'
    }
  ];

  const displayTimeline = (timeline && timeline.length > 0) ? timeline : fallbackTimeline;

  const handlePostUpdate = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (onAddTimelineEntry) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      onAddTimelineEntry({
        id: `tl-${Date.now()}`,
        time: timeStr,
        title: `Scoped update logged for ${recipient}`,
        scope: 'HMR-1042 · authorised participants only'
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setMessage('');
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="po-workspace">
      {/* Top Header (Screenshots 5 & 6) */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>ACCESS-CONTROLLED COORDINATION</span>
          </div>
          <h1 className="po-title">{title}</h1>
          <p className="po-subtitle">
            Only necessary operational information is shared. All messages are fictional demonstration records.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="po-split-layout">
        {/* Left: Coordination Timeline */}
        <div className="po-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', marginBottom: '24px' }}>
            Coordination timeline
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {displayTimeline.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #edf1eb'
                }}
              >
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#657367', 
                  minWidth: '40px',
                  paddingTop: '2px'
                }}>
                  {item.time}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1e3d2c' }}></span>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#162e20' }}>
                      {item.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#738075', paddingLeft: '14px' }}>
                    {item.scope}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Record Scoped Update Form */}
        <div className="po-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', marginBottom: '20px' }}>
            Record scoped update
          </h3>

          <form onSubmit={handlePostUpdate}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                color: '#4a5b4a',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                RECIPIENT WORKFLOW
              </label>
              <select
                className="po-select"
                style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '13px' }}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="Resource & Logistics Manager">Resource &amp; Logistics Manager</option>
                <option value="Emergency Coordinator">Emergency Coordinator</option>
                <option value="Medical Triage Officer">Medical Triage Officer</option>
                <option value="Shelter Supervisor">Shelter Supervisor</option>
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                color: '#4a5b4a',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                OPERATIONAL MESSAGE
              </label>
              <textarea
                className="po-note-textarea"
                style={{
                  width: '100%',
                  minHeight: '110px',
                  padding: '12px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  border: '1px solid #d4ded3',
                  backgroundColor: '#ffffff',
                  fontFamily: 'inherit',
                  color: '#162e20',
                  resize: 'vertical'
                }}
                placeholder="Do not include unrelated personal data..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Informational notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#edf2e8',
              border: '1px solid #dbe4c6',
              color: '#3d4d40',
              fontSize: '11px',
              lineHeight: 1.4,
              marginBottom: '20px'
            }}>
              <ShieldCheck size={14} style={{ flexShrink: 0, color: '#2d4b38' }} />
              <span>No real email, SMS or notification will be sent.</span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="po-btn po-btn-primary"
              style={{
                width: '100%',
                padding: '11px 16px',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: message.trim() ? '#1e3d2c' : '#7c9082',
                cursor: message.trim() ? 'pointer' : 'default'
              }}
            >
              <span>Record update</span>
            </button>

            {submitted && (
              <div style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#15803d',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                Scoped message logged into role coordination audit!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoordinationWorkspaceView;

import React, { useState } from 'react';
import { 
  Send, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { TIMELINE_COMMUNICATION_EVENTS } from './caseManagerData';

export const CaseCommunicationView = ({
  caseId = 'HMR-1042',
  showToast
}) => {
  const [timeline, setTimeline] = useState(TIMELINE_COMMUNICATION_EVENTS);
  const [recipient, setRecipient] = useState('Resource & Logistics Manager');
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecordUpdate = (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      showToast?.('Please enter an operational message before recording', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newEvent = {
        id: `comm-${Date.now()}`,
        time: nowStr,
        title: `Handoff update dispatched to ${recipient}`,
        caseTag: `${caseId} - authorised participants only`
      };
      setTimeline([newEvent, ...timeline]);
      setMessageText('');
      setIsSubmitting(false);
      showToast?.(`Scoped coordination update logged for ${recipient}`, 'success');
    }, 500);
  };

  return (
    <div className="cm-canvas-wrapper">
      {/* Header */}
      <div className="cm-canvas-head-row">
        <div>
          <span className="cm-tag-uppercase">ACCESS-CONTROLLED COORDINATION</span>
          <h1 className="cm-canvas-h1">Case Communication</h1>
          <p className="cm-canvas-sub">
            Only necessary operational information is shared. All messages are fictional demonstration records.
          </p>
        </div>
      </div>

      {/* Two-Column Split Layout (Screenshot 4 exact match) */}
      <div className="cm-mgmt-split-grid">
        {/* Left Column: Coordination Timeline */}
        <div className="cm-panel-card">
          <div className="cm-panel-header">
            <div>
              <h3 className="cm-panel-title">Coordination timeline</h3>
              <p className="cm-panel-sub">Role-scoped message exchange & audit stamps</p>
            </div>
          </div>

          <div className="cm-timeline-list">
            {timeline.map((evt) => (
              <div key={evt.id} className="cm-timeline-row">
                <span className="cm-timeline-time">{evt.time}</span>
                <div className="cm-timeline-content">
                  <div className="cm-timeline-title">● {evt.title}</div>
                  <span className="cm-timeline-tag">{evt.caseTag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Record Scoped Update Form */}
        <div className="cm-panel-card">
          <div className="cm-panel-header">
            <div>
              <h3 className="cm-panel-title">Record scoped update</h3>
              <p className="cm-panel-sub">Targeted operational briefing for downstream roles</p>
            </div>
          </div>

          <form onSubmit={handleRecordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="cm-form-label" style={{ display: 'block', marginBottom: '6px' }}>
                RECIPIENT WORKFLOW
              </label>
              <select
                className="cm-select-decision"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="Resource & Logistics Manager">Resource & Logistics Manager</option>
                <option value="Shelter Coordinator">Shelter Coordinator</option>
                <option value="Volunteer Task Lead">Volunteer Task Lead</option>
                <option value="Medical Dispatch Unit">Medical Dispatch Unit</option>
                <option value="Citizen Notification Desk">Citizen Notification Desk</option>
              </select>
            </div>

            <div>
              <label className="cm-form-label" style={{ display: 'block', marginBottom: '6px' }}>
                OPERATIONAL MESSAGE
              </label>
              <textarea
                className="cm-form-textarea"
                rows={6}
                placeholder="Do not include unrelated personal data..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11.5px', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ShieldCheck size={16} color="#0284c7" style={{ flexShrink: 0 }} />
              <span>No real email, SMS or notification will be sent.</span>
            </div>

            <button 
              type="submit" 
              className="cm-btn-record-decision"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging update...' : 'Record update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

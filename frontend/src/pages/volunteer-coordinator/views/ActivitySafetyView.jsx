import React, { useState, useEffect } from 'react';
import {
  Clock,
  Send,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Radio,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { WORKFLOW_RECIPIENTS } from '../data/coordinatorData';
import { volunteerService } from '../../../services/volunteerService';

export const ActivitySafetyView = ({ onRecordUpdate }) => {
  const [timeline, setTimeline] = useState([]);
  const [recipient, setRecipient] = useState(WORKFLOW_RECIPIENTS[0] || 'Shelter Operations');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);
  const [errorBanner, setErrorBanner] = useState(null);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    setLoading(true);
    setErrorBanner(null);
    try {
      const res = await volunteerService.getActivityTimeline();
      const items = res.data || res;
      if (Array.isArray(items)) {
        setTimeline(items);
      }
    } catch (err) {
      setErrorBanner(err.message || 'Failed to load activity timeline from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please enter an operational coordination message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        recipient,
        message: message.trim(),
        scope: '1.0dB-SL42 - authorised participants only'
      };

      const res = await volunteerService.recordScopedUpdate(payload);
      const savedItem = res.data || {
        id: `TL-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Scoped update sent to ${recipient}`,
        scope: '1.0dB-SL42 - authorised participants only',
        messageContent: message.trim()
      };

      setTimeline((prev) => [savedItem, ...prev]);
      if (onRecordUpdate) {
        onRecordUpdate(savedItem);
      }
      setSuccessBanner(`Scoped update saved to platform audit trail and routed to ${recipient}.`);
      setMessage('');
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err) {
      alert(err.message || 'Failed to save update to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* 1. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">ACCESS-CONTROLLED FIELD DISPATCH</div>
          <h1 className="vc-page-title">Activity & Safety Coordination</h1>
          <p className="vc-page-desc">
            Role-scoped operational timeline and secure dispatch log. Updates are logged to the platform database and shared strictly with authorized sector personnel.
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

      {errorBanner && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} />
          <span>{errorBanner}</span>
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
                color: '#14291e',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #eef1ea'
              }}
            >
              Operational timeline & field events
            </h3>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
                <Loader2 size={20} className="vc-spin" style={{ margin: '0 auto 8px auto' }} />
                <div>Loading operational timeline...</div>
              </div>
            ) : timeline.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#657367' }}>
                No activity records recorded yet. Post an operational update below.
              </div>
            ) : (
              <div style={{ position: 'relative', paddingLeft: '6px' }}>
                {timeline.map((item, index) => (
                  <div
                    key={item.id || index}
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
                          backgroundColor: '#dfe5d8'
                        }}
                      />
                    )}

                    {/* Time label */}
                    <div
                      style={{
                        width: '38px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#657367',
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
                        backgroundColor: '#0c2340',
                        marginTop: '6px',
                        flexShrink: 0,
                        zIndex: 1
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#14291e' }}>
                        {item.title}
                      </div>
                      {item.messageContent && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#2a4a35',
                            marginTop: '4px',
                            padding: '6px 10px',
                            backgroundColor: '#f4f6f2',
                            borderRadius: '6px',
                            border: '1px solid #dfe5d8'
                          }}
                        >
                          "{item.messageContent}"
                        </div>
                      )}
                      <div style={{ fontSize: '11px', color: '#8a9480', marginTop: '2px' }}>
                        {item.scope}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Record Scoped Update Form */}
        <div className="vc-inspector" style={{ minWidth: '340px' }}>
          <div className="vc-card" style={{ border: 'none', padding: 0 }}>
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#14291e',
                marginBottom: '14px',
                paddingBottom: '8px',
                borderBottom: '1px solid #eef1ea'
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
                    color: '#657367',
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
                  disabled={isSubmitting}
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
                    color: '#657367',
                    marginBottom: '6px'
                  }}
                >
                  Operational message
                </label>
                <textarea
                  className="vc-textarea"
                  rows={4}
                  placeholder="Operational briefing (exclude sensitive personal identifiers)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: '#f4f6f2',
                  borderRadius: '6px',
                  border: '1px solid #dfe5d8',
                  marginBottom: '16px'
                }}
              >
                <ShieldCheck size={16} style={{ color: '#657367', flexShrink: 0 }} />
                <div style={{ fontSize: '11px', color: '#657367', lineHeight: 1.4 }}>
                  Preserved in database audit trail. External SMS/Email gateway dispatch is disabled by platform policy.
                </div>
              </div>

              <button
                type="submit"
                className="vc-btn-primary"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '10px',
                  justifyContent: 'center',
                  backgroundColor: '#0c2340',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="vc-spin" />
                    Recording...
                  </>
                ) : (
                  'Record Scoped Update'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySafetyView;

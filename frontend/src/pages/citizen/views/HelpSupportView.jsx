import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, Upload, CheckCircle2, PhoneCall, Mail, MessageSquare } from 'lucide-react';
import { FAQ_QUESTIONS } from '../data/citizenPortalData';

export const HelpSupportView = ({ showToast }) => {
  const [reqRef, setReqRef] = useState('');
  const [topic, setTopic] = useState('Help with my request');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const ticketId = `TIC-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicket({
      id: ticketId,
      reqRef: reqRef.trim() || 'N/A',
      topic,
      message: message.trim(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    if (showToast) {
      showToast(`Support ticket ${ticketId} created successfully`);
    }

    setReqRef('');
    setMessage('');
  };

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">PLATFORM SUPPORT CENTRE</span>
          <h1 className="cp-view-title">Help & Support</h1>
          <p className="cp-view-subtitle">
            Get platform guidance and technical support. This help desk is not an emergency dispatch line.
          </p>
        </div>
      </div>

      {/* 4 FAQ Cards (2x2 Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {FAQ_QUESTIONS.map((faq, idx) => (
          <div key={idx} className="cp-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <HelpCircle size={16} color="#1e3d2c" />
              <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                {faq.q}
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#657367', margin: 0, lineHeight: 1.45 }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* 2-Column Split: Contact Support Form & Emergency Warning */}
      <div className="cp-grid-split" style={{ gridTemplateColumns: '2fr 1fr', gap: '22px' }}>
        {/* Left: Contact Platform Support Form */}
        <div className="cp-card">
          <h2 className="cp-card-title" style={{ marginBottom: '18px' }}>
            Contact platform support
          </h2>

          {submittedTicket && (
            <div
              style={{
                padding: '16px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontWeight: 700, fontSize: '13.5px' }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>Support Inquiry Registered: {submittedTicket.id}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#047857', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                Your request regarding <strong>{submittedTicket.topic}</strong> has been logged at {submittedTicket.date}. A coordination desk operator will review your message.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="cp-form-label">Related Request Reference</label>
                <input
                  type="text"
                  className="cp-form-input"
                  placeholder="e.g. REQ-BF61CA61"
                  value={reqRef}
                  onChange={(e) => setReqRef(e.target.value)}
                />
              </div>

              <div>
                <label className="cp-form-label">Support topic *</label>
                <select
                  className="cp-form-select"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="Help with my request">Help with my request</option>
                  <option value="Updating contact info">Updating contact info</option>
                  <option value="Shelter inquiry">Shelter inquiry</option>
                  <option value="Technical assistance">Technical assistance</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label className="cp-form-label">Message *</label>
              <textarea
                rows={4}
                required
                className="cp-form-textarea"
                placeholder="Describe how the support desk can assist you..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="cp-btn-primary">
                Send Support Message
              </button>
            </div>
          </form>
        </div>

        {/* Right: Emergency Warning & Support Hotlines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              backgroundColor: '#fff5f5',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '20px'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
              <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#991b1b', margin: 0 }}>
                  Immediate Danger Warning
                </h4>
                <p style={{ fontSize: '11.5px', color: '#b91c1c', margin: '4px 0 0 0', lineHeight: 1.45 }}>
                  This support centre cannot dispatch emergency rescue units. If you are in immediate peril, call 119 or 1990 immediately.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid #fee2e2' }}>
              <div style={{ fontSize: '11.5px', color: '#7f1d1d' }}>
                Police Emergency: <strong>119</strong>
              </div>
              <div style={{ fontSize: '11.5px', color: '#7f1d1d' }}>
                Medical Ambulance (Suwa Seriya): <strong>1990</strong>
              </div>
              <div style={{ fontSize: '11.5px', color: '#7f1d1d' }}>
                Disaster Management Centre: <strong>117</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportView;

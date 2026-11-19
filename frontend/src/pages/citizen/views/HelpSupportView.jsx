import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, Upload, CheckCircle2 } from 'lucide-react';
import { FAQ_QUESTIONS } from '../data/citizenPortalData';

export const HelpSupportView = ({ showToast }) => {
  const [reqRef, setReqRef] = useState('');
  const [topic, setTopic] = useState('Help with my request');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast('Support ticket dispatched to platform coordination desk');
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
            Get help using HumanAid. This support centre is not an emergency rescue or dispatch service.
          </p>
        </div>
      </div>

      {/* 4 FAQ Cards (2x2 Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {FAQ_QUESTIONS.map((faq, idx) => (
          <div key={idx} className="cp-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <HelpCircle size={15} color="#1e3d2c" />
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

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="cp-form-label">Request reference</label>
                <input
                  type="text"
                  className="cp-form-input"
                  placeholder="e.g. HMR-1042"
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
                placeholder="Describe how the support team can help..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Add an attachment bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                border: '1px solid #d4ded3',
                borderRadius: '8px',
                backgroundColor: '#f8faf7',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload size={16} color="#1e3d2c" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>
                    Add an attachment
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#738075' }}>
                    Optional · Do not include unrelated sensitive information
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast && showToast('Attachment picker opened')}
                className="cp-btn-secondary"
                style={{ padding: '5px 12px', fontSize: '11.5px' }}
              >
                Choose file
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="cp-btn-primary">
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Right: Emergency Rescue Warning & Support Availability */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Emergency Rescue Card */}
          <div
            style={{
              backgroundColor: '#fff5f5',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '20px'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}
            >
              <AlertTriangle size={18} />
            </div>

            <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#991b1b', margin: '0 0 6px 0' }}>
              Need emergency rescue?
            </h3>
            <p style={{ fontSize: '11.5px', color: '#b91c1c', margin: 0, lineHeight: 1.5 }}>
              HumanAid platform support cannot dispatch emergency services. Contact the relevant official emergency service for immediate threats to life.
            </p>
          </div>

          {/* Support Availability Card */}
          <div className="cp-card">
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#738075', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              SUPPORT AVAILABILITY
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', marginBottom: '4px' }}>
              Prototype support status: Online
            </div>
            <div style={{ fontSize: '11.5px', color: '#657367' }}>
              Replies typically within 2 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportView;

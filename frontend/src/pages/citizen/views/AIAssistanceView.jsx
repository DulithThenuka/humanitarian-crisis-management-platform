import React, { useState } from 'react';
import { Sparkles, Send, ShieldAlert, AlertTriangle, ChevronRight, RotateCcw } from 'lucide-react';
import { AI_SUGGESTIONS } from '../data/citizenPortalData';

export const AIAssistanceView = ({ onSelectTab, showToast }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello Nimal. I can help you understand how to use HumanAid. I cannot approve assistance or dispatch emergency services.'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      let reply =
        'You can submit a request through the "Submit Assistance Request" tab. Enter your needs, location, and household size, and an authorized coordinator will review it.';
      if (query.toLowerCase().includes('status') || query.toLowerCase().includes('check')) {
        reply =
          'To check your request status, go to "My Requests". You can view real-time stage updates such as Under Review, Verified, or Assistance Assigned.';
      } else if (query.toLowerCase().includes('shelter')) {
        reply =
          'You can explore verified shelters in the "Find Shelters & Help Centres" section, where operational capacity and contact details are shown on the map.';
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: reply }
      ]);
    }, 600);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: 'Hello Nimal. I can help you understand how to use HumanAid. I cannot approve assistance or dispatch emergency services.'
      }
    ]);
  };

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">AI-GENERATED PLATFORM GUIDANCE</span>
          <h1 className="cp-view-title">HumanAid Assistant</h1>
          <p className="cp-view-subtitle">
            Get help using HumanAid in English, සිංහල or தமிழ். For urgent danger, contact emergency services.
          </p>
        </div>
      </div>

      {/* Green Disclaimer Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          backgroundColor: '#edf4ec',
          border: '1px solid #dbe4c6',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#243328',
          marginBottom: '22px'
        }}
      >
        <ShieldAlert size={16} style={{ color: '#1e3d2c', flexShrink: 0 }} />
        <span>
          This assistant cannot approve requests, allocate aid, guarantee shelter availability, or access other citizens' information.{' '}
          <strong
            onClick={() => onSelectTab('support')}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Contact human support
          </strong>
        </span>
      </div>

      {/* 2-Column Chat Layout */}
      <div className="cp-grid-split" style={{ gridTemplateColumns: '1.8fr 1fr', gap: '22px' }}>
        {/* Left: Chat Window */}
        <div
          className="cp-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '520px',
            padding: 0,
            overflow: 'hidden'
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #edf1eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8faf7'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: '#edf4ec',
                  color: '#1e3d2c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                  HumanAid Assistant
                </div>
                <div style={{ fontSize: '10.5px', color: '#738075' }}>AI guidance · English</div>
              </div>
            </div>

            <button
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                color: '#738075',
                fontSize: '11.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} />
              Clear conversation
            </button>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {m.sender === 'ai' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#657367',
                      marginBottom: '4px'
                    }}
                  >
                    <Sparkles size={10} color="#1e3d2c" />
                    AI-generated response
                  </div>
                )}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    backgroundColor: m.sender === 'user' ? '#1e3d2c' : '#f0f4ee',
                    color: m.sender === 'user' ? '#ffffff' : '#162e20'
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid #edf1eb',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <input
              type="text"
              className="cp-form-input"
              placeholder="Ask how to use HumanAid..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={() => handleSend()}
              className="cp-btn-primary"
              style={{ padding: '8px 14px' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Right: Suggested Questions & Danger Warning */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Suggested Questions */}
          <div className="cp-card">
            <h3 className="cp-card-title" style={{ marginBottom: '14px' }}>
              Suggested questions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {AI_SUGGESTIONS.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSend(q)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 0',
                    borderBottom: idx < AI_SUGGESTIONS.length - 1 ? '1px solid #edf1eb' : 'none',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    color: '#243328',
                    cursor: 'pointer'
                  }}
                >
                  <span>{q}</span>
                  <ChevronRight size={14} color="#9fa89e" />
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Threat Danger Box */}
          <div
            style={{
              backgroundColor: '#fff5f5',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}
          >
            <AlertTriangle size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#991b1b', marginBottom: '3px' }}>
                Immediate threat to life?
              </div>
              <div style={{ fontSize: '11px', color: '#b91c1c', lineHeight: 1.45 }}>
                Do not use chat as emergency dispatch. Contact the relevant emergency service.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistanceView;

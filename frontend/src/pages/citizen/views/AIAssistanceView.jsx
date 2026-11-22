import React, { useState } from 'react';
import { Sparkles, Send, ShieldAlert, AlertTriangle, ChevronRight, RotateCcw, Loader2 } from 'lucide-react';
import { AI_SUGGESTIONS } from '../data/citizenPortalData';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../services/apiClient';

export const AIAssistanceView = ({ onSelectTab, showToast }) => {
  const { user } = useAuth();
  const citizenName = user?.fullName || 'Citizen';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${citizenName}. I can provide guidance on navigating the HumanAid platform, submitting crisis relief requests, tracking application status, and finding emergency evacuation shelters. I cannot approve assistance or dispatch emergency rescue.`
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim() || isLoading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/ai/assistant', { query: query.trim() });
      const data = response?.data?.data || response?.data || response;
      const reply = data?.reply || 'You can submit assistance requests via the "Submit Assistance Request" tab and check updates under "My Requests".';

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: reply }
      ]);
    } catch (err) {
      // Fallback helpful guidance if network hiccup occurs
      let fallback =
        'You can submit a relief request through the "Submit Assistance Request" tab. Enter your needs, location, and household size, and an authorized coordinator will review it.';
      const q = query.toLowerCase();
      if (q.includes('status') || q.includes('check') || q.includes('track')) {
        fallback =
          'To check your request status, navigate to "My Requests". You can view real-time stage updates such as Under Review, Verified, or Assistance In Progress.';
      } else if (q.includes('shelter') || q.includes('evacuat')) {
        fallback =
          'You can explore verified shelters in the "Find Shelters & Help Centres" section, where operational capacity and intake contact details are displayed.';
      } else if (q.includes('emergency') || q.includes('danger') || q.includes('immediate')) {
        fallback =
          'WARNING: If you or someone else is in immediate life-threatening danger, contact 119 / 110 / 1990 Suwa Seriya immediately. The Assistant cannot dispatch rescue teams directly.';
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: fallback }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `Hello ${citizenName}. I can provide guidance on navigating the HumanAid platform, submitting crisis relief requests, tracking application status, and finding emergency evacuation shelters. I cannot approve assistance or dispatch emergency rescue.`
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
            Get instant help with requesting relief, locating nearby shelters, and understanding disaster advisories.
          </p>
        </div>
      </div>

      {/* Safety Notice Banner */}
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
          This assistant provides information on using HumanAid. It cannot approve aid applications, assign field volunteers, or guarantee shelter availability.{' '}
          <strong
            onClick={() => onSelectTab('support')}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Contact platform support
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
                <div style={{ fontSize: '10.5px', color: '#738075' }}>Connected · AI Safety Guardrails Active</div>
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
                    AI Platform Guidance
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

            {isLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', color: '#657367', fontSize: '12px' }}>
                <Loader2 size={14} className="animate-spin" />
                Thinking...
              </div>
            )}
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
              placeholder="Ask how to submit requests, find shelters, or check status..."
              value={inputVal}
              disabled={isLoading}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={() => handleSend()}
              className="cp-btn-primary"
              disabled={isLoading || !inputVal.trim()}
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
                Do not wait for online chat during an emergency. Call <strong>119</strong> (Police) or <strong>1990</strong> (Ambulance) immediately.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistanceView;

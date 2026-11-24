import React, { useState, useRef, useEffect } from 'react';
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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputVal || '').trim();
    if (!query || isLoading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputVal('');
    setIsLoading(true);

    // Build multi-turn context from current session messages
    const conversationHistory = updatedMessages
      .filter((m) => m.text && !m.isError)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

    try {
      const response = await apiClient.post('/ai/assistant', {
        query: query,
        messages: conversationHistory
      });

      const data = response?.data?.data || response?.data || response;
      const reply =
        data?.reply ||
        'I can assist you with submitting requests, locating shelters, or tracking your current relief applications.';

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: reply,
          provider: data?.provider
        }
      ]);
    } catch (err) {
      console.error('AI chat failed:', err?.message);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'I am temporarily experiencing connection issues with the AI assistance service. Please try again shortly or navigate directly using the sidebar options. If facing an emergency, call 119 or 1990 immediately.',
          isError: true
        }
      ]);
      if (showToast) {
        showToast('Unable to connect to AI Assistant. Please retry.', 'error');
      }
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
    setInputVal('');
    setIsLoading(false);
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
                    AI Platform Guidance {m.provider ? `(${m.provider})` : ''}
                  </div>
                )}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    backgroundColor: m.sender === 'user' ? '#1e3d2c' : m.isError ? '#fef2f2' : '#f0f4ee',
                    color: m.sender === 'user' ? '#ffffff' : m.isError ? '#991b1b' : '#162e20',
                    border: m.isError ? '1px solid #fecaca' : 'none',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#657367',
                  fontSize: '12px',
                  padding: '4px 0'
                }}
              >
                <Loader2 size={14} className="animate-spin" />
                HumanAid Assistant is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
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
                  onClick={() => !isLoading && handleSend(q)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 0',
                    borderBottom: idx < AI_SUGGESTIONS.length - 1 ? '1px solid #edf1eb' : 'none',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    color: '#243328',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1
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

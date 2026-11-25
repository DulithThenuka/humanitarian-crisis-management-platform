import React, { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  X
} from 'lucide-react';
import volunteerService from '../../../services/volunteerService';

export const HelpSupportView = ({ showToast, onNavigateTab }) => {
  const [relatedTask, setRelatedTask] = useState('VOL-009 - Supply Distribution');
  const [topic, setTopic] = useState('Assignment help');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [safetyDetails, setSafetyDetails] = useState('');

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await volunteerService.recordScopedUpdate({
        type: 'support',
        details: `[${topic}] ${relatedTask}: ${message.trim()}`,
        serviceArea: 'Kelani East'
      });
      setMessage('');
      if (showToast) {
        showToast('Support request sent to authorized field response team.');
      }
    } catch (err) {
      if (showToast) {
        showToast(`Failed to send support request: ${err?.message || 'Error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSafetySubmit = async (e) => {
    e.preventDefault();
    if (!safetyDetails.trim()) return;

    try {
      await volunteerService.recordScopedUpdate({
        type: 'safety',
        details: `SAFETY ALERT: ${safetyDetails.trim()}`,
        serviceArea: 'Kelani East'
      });
      setIsSafetyModalOpen(false);
      setSafetyDetails('');
      if (showToast) {
        showToast('Urgent safety concern logged. Operational coordinator notified.');
      }
    } catch (err) {
      if (showToast) {
        showToast(`Failed to log safety concern: ${err?.message || 'Error'}`);
      }
    }
  };

  const faqItems = [
    {
      id: 'faq-1',
      question: 'How do I accept a task?',
      answer:
        'Open an offered assignment, review safety instructions, then confirm acceptance.'
    },
    {
      id: 'faq-2',
      question: 'What if conditions are unsafe?',
      answer:
        'Stop work, report the problem and request coordinator assistance.'
    },
    {
      id: 'faq-3',
      question: 'How is completion verified?',
      answer:
        'A coordinator reviews your submitted completion report.'
    },
    {
      id: 'faq-4',
      question: 'How do I change availability?',
      answer:
        'Use Schedule & Availability before accepting conflicting work.'
    }
  ];

  return (
    <div>
      {/* 1. Page Header Section */}
      <div className="vol-page-header" style={{ marginBottom: '20px' }}>
        <div>
          <div
            className="vol-page-eyebrow"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#657367'
            }}
          >
            VOLUNTEER SUPPORT CENTRE
          </div>
          <h1
            className="vol-page-title"
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '4px 0 6px 0',
              letterSpacing: '-0.02em'
            }}
          >
            Help & Support
          </h1>
          <p
            className="vol-page-desc"
            style={{ fontSize: '13px', color: '#475569', margin: 0 }}
          >
            Get help with assignments, safety, scheduling or your volunteer account.
          </p>
        </div>
      </div>

      {/* 2. Main Two-Column Layout (Figma Master-Detail View) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 310px',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: 2x2 FAQ Grid & Contact Volunteer Support Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 2x2 FAQ Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px'
            }}
          >
            {faqItems.map((faq) => (
              <div
                key={faq.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8e0',
                  borderRadius: '10px',
                  padding: '18px 20px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div style={{ marginBottom: '10px', color: '#64748b' }}>
                  <HelpCircle size={18} />
                </div>
                <div
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '6px'
                  }}
                >
                  {faq.question}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#475569',
                    lineHeight: 1.45
                  }}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Volunteer Support Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8e0',
              borderRadius: '12px',
              padding: '24px 28px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 18px 0'
              }}
            >
              Contact Volunteer Support
            </h3>

            <form onSubmit={handleSupportSubmit}>
              {/* Row 1: Related task & Topic */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px'
                    }}
                  >
                    Related task
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={relatedTask}
                      onChange={(e) => setRelatedTask(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 30px 8px 12px',
                        fontSize: '13px',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        border: '1px solid #dfe5d8',
                        borderRadius: '6px',
                        boxSizing: 'border-box',
                        appearance: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="VOL-009 - Supply Distribution">
                        VOL-009 - Supply Distribution
                      </option>
                      <option value="VOL-004 - Shelter Support Shift">
                        VOL-004 - Shelter Support Shift
                      </option>
                      <option value="VOL-001 - Supply Sorting Support">
                        VOL-001 - Supply Sorting Support
                      </option>
                      <option value="General inquiry / No specific task">
                        General inquiry / No specific task
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#657367'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px'
                    }}
                  >
                    Topic
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 30px 8px 12px',
                        fontSize: '13px',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        border: '1px solid #dfe5d8',
                        borderRadius: '6px',
                        boxSizing: 'border-box',
                        appearance: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="Assignment help">Assignment help</option>
                      <option value="Safety & Equipment inquiry">
                        Safety & Equipment inquiry
                      </option>
                      <option value="Schedule & Shift change">
                        Schedule & Shift change
                      </option>
                      <option value="Profile & Verification update">
                        Profile & Verification update
                      </option>
                      <option value="Technical / Platform issue">
                        Technical / Platform issue
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#657367'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Message Field */}
              <div style={{ marginBottom: '18px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#475569',
                    marginBottom: '6px'
                  }}
                >
                  Message *
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe how the authorised support team can help..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13px',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    border: '1px solid #dfe5d8',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Submit Button (Dark Navy Blue) */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    height: '38px',
                    padding: '0 20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#ffffff',
                    backgroundColor: '#14291e',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    boxShadow: '0 1px 2px rgba(20, 41, 30, 0.2)'
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#1f3f2f')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#14291e')
                  }
                >
                  {isSubmitting ? 'Submitting...' : 'Submit support request'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Unsafe Operational Conditions Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8e0',
            borderRadius: '12px',
            padding: '24px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}
        >
          {/* Red Alert Icon in Circle */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}
          >
            <AlertTriangle size={22} style={{ color: '#dc2626' }} />
          </div>

          <h3
            style={{
              fontSize: '14.5px',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 8px 0'
            }}
          >
            Unsafe operational conditions?
          </h3>

          <p
            style={{
              fontSize: '11.5px',
              color: '#64748b',
              lineHeight: 1.5,
              margin: '0 0 20px 0'
            }}
          >
            Stop the task, move to a safe location, and use "Report a problem" from the task workspace. Contact emergency services for immediate threats to life.
          </p>

          <button
            type="button"
            onClick={() => setIsSafetyModalOpen(true)}
            style={{
              width: '100%',
              height: '36px',
              padding: '0 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#dc2626',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
              boxShadow: '0 1px 2px rgba(220, 38, 38, 0.2)'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#b91c1c')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#dc2626')
            }
          >
            Report safety concern
          </button>
        </div>
      </div>

      {/* Safety Concern Modal */}
      {isSafetyModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '460px',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} style={{ color: '#dc2626' }} />
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: 0
                  }}
                >
                  Report Immediate Safety Concern
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSafetyModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.45, margin: '0 0 16px 0' }}>
              If your current location or assignment conditions pose an immediate threat, cease operations immediately and move to safety.
            </p>

            <form onSubmit={handleSafetySubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#475569',
                    marginBottom: '6px'
                  }}
                >
                  Describe Hazard / Environmental Risk
                </label>
                <textarea
                  rows={4}
                  value={safetyDetails}
                  onChange={(e) => setSafetyDetails(e.target.value)}
                  placeholder="E.g., Rising flood water at Kelani staging point, unstable terrain, structural hazard..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13px',
                    border: '1px solid #dfe5d8',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsSafetyModalOpen(false)}
                  style={{
                    height: '34px',
                    padding: '0 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#475569',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    height: '34px',
                    padding: '0 16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#ffffff',
                    backgroundColor: '#dc2626',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Dispatch Safety Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSupportView;

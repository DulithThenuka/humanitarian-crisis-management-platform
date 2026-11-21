import React, { useState } from 'react';
import {
  ChevronLeft,
  CheckSquare,
  Square,
  ShieldAlert,
  Send,
  X
} from 'lucide-react';

export const TaskProgressView = ({
  assignments = [],
  onCompleteTask,
  showToast,
  onNavigateTab
}) => {
  // Task data matching the Figma task details & progress specification
  const [taskStatus, setTaskStatus] = useState('Offered'); // 'Offered' | 'Accepted' | 'Declined'
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Checked in with team lead', checked: true },
    { id: 2, text: 'Safety briefing completed', checked: false },
    { id: 3, text: 'Distribution station prepared', checked: false },
    { id: 4, text: 'Supply count reconciled', checked: false }
  ]);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const calculateProgress = () => {
    const checkedCount = checklist.filter((item) => item.checked).length;
    return Math.round((checkedCount / checklist.length) * 100);
  };

  const progressPercent = calculateProgress();

  const handleAcceptAssignment = () => {
    setTaskStatus('Accepted');
    if (showToast) {
      showToast('Assignment VOL-009 accepted. Reporting to Kelani East Distribution Point.');
    }
  };

  const handleDeclineSubmit = (e) => {
    e.preventDefault();
    setTaskStatus('Declined');
    setIsDeclineModalOpen(false);
    if (showToast) {
      showToast('Assignment declined. Coordinator Maya Fernando notified.');
    }
  };

  const instructions = [
    'Check in with the team lead before handling supplies',
    'Wear the provided identification and safety vest',
    'Do not photograph or record assistance recipients',
    'Stop work and report unsafe conditions immediately'
  ];

  return (
    <div>
      {/* 1. Back Navigation Link */}
      <div style={{ marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('assignments')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: '12.5px',
            color: '#64748b',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          <ChevronLeft size={16} />
          <span>Back to My Assignments</span>
        </button>
      </div>

      {/* 2. Page Header Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '22px'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#657367'
            }}
          >
            TASK DETAILS & PROGRESS
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '4px 0 6px 0',
              letterSpacing: '-0.02em'
            }}
          >
            Emergency Supply Distribution
          </h1>
          <p
            style={{
              fontSize: '12.5px',
              color: '#475569',
              margin: 0
            }}
          >
            Kelani East Distribution Point • 19 Feb 2026 • 08:00–12:00
          </p>
        </div>

        {/* Right side assignment ID & priority badges */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '11.5px',
              color: '#64748b',
              marginBottom: '6px'
            }}
          >
            VOL-009 • Assigned to your account
          </div>
          <div
            style={{
              display: 'flex',
              gap: '6px',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: '12px',
                backgroundColor: '#ffedd5',
                border: '1px solid #fed7aa',
                color: '#c2410c',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              • High priority
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: '12px',
                backgroundColor: taskStatus === 'Accepted' ? '#dcfce7' : '#fef9c3',
                border: `1px solid ${taskStatus === 'Accepted' ? '#bbf7d0' : '#fde047'}`,
                color: taskStatus === 'Accepted' ? '#15803d' : '#854d0e',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              • {taskStatus}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout (Figma Master-Detail View) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Task Overview & Instructions/Safety */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Task Overview */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8e0',
              borderRadius: '12px',
              padding: '24px 28px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: 0
                  }}
                >
                  Task overview
                </h2>
                <div
                  style={{
                    fontSize: '11.5px',
                    color: '#64748b',
                    marginTop: '2px'
                  }}
                >
                  General operational information only
                </div>
              </div>

              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  backgroundColor: '#fff7ed',
                  border: '1px solid #ffedd5',
                  color: '#ea580c',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                Deadline 19 Feb • 12:00
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '13px',
                color: '#334155',
                lineHeight: 1.5,
                margin: '16px 0 20px 0'
              }}
            >
              Support the authorised distribution team with organising emergency supply kits and guiding recipients through the public collection process.
            </p>

            {/* Metadata 4-Column Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9'
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#64748b',
                    marginBottom: '4px'
                  }}
                >
                  GENERAL LOCATION
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                >
                  Kelani East Distribution Point
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#64748b',
                    marginBottom: '4px'
                  }}
                >
                  SCHEDULE
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                >
                  08:00–12:00
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#64748b',
                    marginBottom: '4px'
                  }}
                >
                  COORDINATOR
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                >
                  Maya Fernando
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#64748b',
                    marginBottom: '4px'
                  }}
                >
                  REQUIRED SKILLS
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                >
                  Logistics, First Aid
                </div>
              </div>
            </div>

            {/* Expected Outcome Box */}
            <div
              style={{
                backgroundColor: '#f4f7f4',
                border: '1px solid #dfe5d8',
                borderRadius: '8px',
                padding: '14px 18px',
                marginTop: '20px'
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#657367',
                  marginBottom: '4px'
                }}
              >
                EXPECTED OUTCOME
              </div>
              <p
                style={{
                  fontSize: '12.5px',
                  color: '#1e293b',
                  lineHeight: 1.45,
                  margin: 0
                }}
              >
                Prepare and distribute 120 labelled emergency kits under team-lead supervision, with all distribution counts reconciled.
              </p>
            </div>
          </div>

          {/* Card 2: Instructions & Safety */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8e0',
              borderRadius: '12px',
              padding: '24px 28px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 16px 0'
              }}
            >
              Instructions & safety
            </h2>

            {/* Numbered Instruction Steps */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px'
              }}
            >
              {instructions.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #e2e8e0',
                      color: '#475569',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#334155' }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>

            {/* Safety Acknowledgement Required Box */}
            <div
              style={{
                backgroundColor: '#fff1f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <ShieldAlert
                size={20}
                style={{ color: '#dc2626', flexShrink: 0 }}
              />
              <div>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#991b1b'
                  }}
                >
                  Safety acknowledgement required
                </div>
                <div style={{ fontSize: '11px', color: '#b91c1c' }}>
                  Review these instructions before starting the task
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Task Progress & Authorised Coordinator Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1: Task Progress Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8e0',
              borderRadius: '12px',
              padding: '22px 20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0
                }}
              >
                Task progress
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {taskStatus}
              </span>
            </div>

            {/* Big Percentage Number */}
            <div
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#0f172a',
                margin: '10px 0 6px 0',
                lineHeight: 1
              }}
            >
              {progressPercent}%
            </div>

            {/* Progress Bar */}
            <div
              style={{
                height: '6px',
                width: '100%',
                backgroundColor: '#e2e8f0',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '16px'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  backgroundColor: '#ea580c',
                  transition: 'width 0.2s ease'
                }}
              />
            </div>

            {/* Progress Checkboxes */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '18px'
              }}
            >
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {item.checked ? (
                    <CheckSquare
                      size={16}
                      style={{ color: '#16a34a', flexShrink: 0 }}
                    />
                  ) : (
                    <Square
                      size={16}
                      style={{ color: '#94a3b8', flexShrink: 0 }}
                    />
                  )}
                  <span
                    style={{
                      color: item.checked ? '#15803d' : '#334155',
                      userSelect: 'none'
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={handleAcceptAssignment}
                disabled={taskStatus === 'Accepted'}
                style={{
                  width: '100%',
                  height: '38px',
                  borderRadius: '6px',
                  backgroundColor: '#0c2340',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: taskStatus === 'Accepted' ? 'default' : 'pointer',
                  opacity: taskStatus === 'Accepted' ? 0.7 : 1,
                  transition: 'background-color 0.15s ease',
                  boxShadow: '0 1px 2px rgba(12, 35, 64, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (taskStatus !== 'Accepted') {
                    e.currentTarget.style.backgroundColor = '#173d66';
                  }
                }}
                onMouseLeave={(e) => {
                  if (taskStatus !== 'Accepted') {
                    e.currentTarget.style.backgroundColor = '#0c2340';
                  }
                }}
              >
                {taskStatus === 'Accepted'
                  ? 'Assignment Accepted'
                  : 'Accept assignment'}
              </button>

              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(true)}
                disabled={taskStatus === 'Declined'}
                style={{
                  width: '100%',
                  height: '38px',
                  borderRadius: '6px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: 'none',
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
                Decline with reason
              </button>
            </div>
          </div>

          {/* Card 2: Authorised Coordinator Contact */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8e0',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 14px 0'
              }}
            >
              Authorised coordinator contact
            </h3>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '14px'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  color: '#1e293b',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                MF
              </div>
              <div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                >
                  Maya Fernando
                </div>
                <div
                  style={{
                    fontSize: '10.5px',
                    color: '#64748b',
                    marginTop: '1px'
                  }}
                >
                  Emergency Coordinator • Operational messages only
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('notifications')}
              style={{
                width: '100%',
                height: '34px',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#f8fafc')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#ffffff')
              }
            >
              <Send size={13} />
              <span>Open task messages</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decline with Reason Modal */}
      {isDeclineModalOpen && (
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
              maxWidth: '440px',
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
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0
                }}
              >
                Decline Assignment VOL-009
              </h3>
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(false)}
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

            <p
              style={{
                fontSize: '12.5px',
                color: '#475569',
                lineHeight: 1.45,
                margin: '0 0 16px 0'
              }}
            >
              Please specify a reason so the emergency coordinator can reassign another available volunteer immediately.
            </p>

            <form onSubmit={handleDeclineSubmit}>
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
                  Reason for declining
                </label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    border: '1px solid #dfe5d8',
                    borderRadius: '6px',
                    marginBottom: '10px'
                  }}
                >
                  <option value="">Select reason...</option>
                  <option value="Schedule Conflict">Schedule Conflict</option>
                  <option value="Transport / Distance Limitation">
                    Transport / Distance Limitation
                  </option>
                  <option value="Health / Safety Hazard">
                    Health / Safety Hazard
                  </option>
                  <option value="Assigned to another task">
                    Assigned to another task
                  </option>
                </select>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsDeclineModalOpen(false)}
                  style={{
                    height: '34px',
                    padding: '0 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#475569',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8e0',
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
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskProgressView;

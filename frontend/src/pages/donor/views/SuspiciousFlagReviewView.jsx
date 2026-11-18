import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export const SuspiciousFlagReviewView = ({
  flags = [],
  onResolveFlag,
  onEscalateFlag
}) => {
  const [selectedDecision, setSelectedDecision] = useState('');
  const [decisionReason, setDecisionReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDecision || !decisionReason.trim()) {
      alert('Please select a decision and enter the required reason.');
      return;
    }
    setSubmitted(true);
    if (onResolveFlag) {
      onResolveFlag('DON-2047', `${selectedDecision}: ${decisionReason}`);
    }
  };

  return (
    <div className="fo-workspace">
      {/* Title & Action Block (Screenshot 6) */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>HUMAN-CONTROLLED DECISION SUPPORT</span>
          </div>
          <h1 className="fo-title">Suspicious Donation Review</h1>
          <p className="fo-subtitle">
            Simulated recommendation only. It cannot approve, reject, accuse, allocate, or bypass role permissions.
          </p>
        </div>
      </div>

      {/* Main Grid: Left simulated AI rec + factors, Right human decision */}
      <div className="fo-split-layout">
        {/* Left Column (65%) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1 1 60%' }}>
          {/* Card 1: Simulated AI Recommendation */}
          <div className="fo-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#f3e8ff',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    SIMULATED AI RECOMMENDATION
                  </div>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#162e20', margin: '2px 0 0 0' }}>
                    DON-2047 · Anomaly flag
                  </h2>
                  <div style={{ fontSize: '12px', color: '#657367', marginTop: '2px' }}>
                    DEMO-AI-2051 · Human review required
                  </div>
                </div>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '16px',
                backgroundColor: '#f5f3ff',
                color: '#6d28d9',
                border: '1px solid #ddd6fe',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#7c3aed' }}></span>
                REVIEW
              </span>
            </div>

            {/* Suggested outcome box */}
            <div style={{
              backgroundColor: '#faf8fc',
              borderLeft: '4px solid #7c3aed',
              borderRadius: '0 8px 8px 0',
              padding: '16px 20px',
              marginTop: '16px'
            }}>
              <div style={{ fontSize: '11px', color: '#657367', fontWeight: 600, textTransform: 'none', marginBottom: '4px' }}>
                Suggested outcome
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#162e20', marginBottom: '4px' }}>
                Investigate metadata; do not reject
              </div>
              <div style={{ fontSize: '12px', color: '#738075' }}>
                Simulated confidence 89%; not verified accuracy.
              </div>
            </div>
          </div>

          {/* Card 2: Factors, limits and possible conflicts */}
          <div className="fo-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', marginBottom: '16px' }}>
              Factors, limits and possible conflicts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Item 1 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid #edf1eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={16} color="#4a5b4a" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#162e20' }}>
                      Operational fit
                    </div>
                    <div style={{ fontSize: '12px', color: '#657367' }}>
                      Attributes match stated need
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backgroundColor: '#eef1ea',
                  color: '#4a5b4a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#657367' }}></span>
                  High
                </span>
              </div>

              {/* Item 2 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid #edf1eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={16} color="#4a5b4a" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#162e20' }}>
                      Availability
                    </div>
                    <div style={{ fontSize: '12px', color: '#657367' }}>
                      Demo availability considered
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backgroundColor: '#eef1ea',
                  color: '#4a5b4a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#657367' }}></span>
                  Medium
                </span>
              </div>

              {/* Item 3 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid #edf1eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={16} color="#4a5b4a" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#162e20' }}>
                      Human authority
                    </div>
                    <div style={{ fontSize: '12px', color: '#657367' }}>
                      Final action requires authorised review
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                  Required
                </span>
              </div>

              {/* Item 4 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertTriangle size={16} color="#b45309" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#162e20' }}>
                      Data limitation
                    </div>
                    <div style={{ fontSize: '12px', color: '#657367' }}>
                      Inputs may be incomplete
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backgroundColor: '#fffbeb',
                  color: '#b45309',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                  Review
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (35%): Record human decision */}
        <div style={{ flex: '1 1 38%' }}>
          <div className="fo-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', marginBottom: '20px' }}>
              Record human decision
            </h3>

            <form onSubmit={handleSubmit}>
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
                  DECISION
                </label>
                <select
                  className="fo-select"
                  style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '13px', color: selectedDecision ? '#162e20' : '#8a9480' }}
                  value={selectedDecision}
                  onChange={(e) => setSelectedDecision(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Investigate metadata; do not reject">Investigate metadata; do not reject</option>
                  <option value="Clear anomaly flag & Verify record">Clear anomaly flag &amp; Verify record</option>
                  <option value="Request supplier / donor invoice metadata">Request supplier / donor invoice metadata</option>
                  <option value="Escalate to Emergency Coordinator">Escalate to Emergency Coordinator</option>
                  <option value="Reject & freeze allocation">Reject &amp; freeze allocation</option>
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
                  REQUIRED REASON
                </label>
                <textarea
                  className="fo-textarea"
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
                  placeholder="Explain the evidence and decision..."
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                />
              </div>

              {/* Informational retention notice */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
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
                <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#2d4b38' }} />
                <span>Original recommendation, reviewer, decision, reason and timestamp are retained.</span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="fo-btn fo-btn-primary"
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: (selectedDecision && decisionReason.trim()) ? '#1e3d2c' : '#7c9082',
                  cursor: (selectedDecision && decisionReason.trim()) ? 'pointer' : 'default'
                }}
              >
                <span>Record reviewed decision</span>
              </button>

              {submitted && (
                <div style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  color: '#15803d',
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  Decision successfully logged in role audit history!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspiciousFlagReviewView;

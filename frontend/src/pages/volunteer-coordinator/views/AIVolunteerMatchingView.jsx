import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Scale,
  Clock,
  Layers,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { AI_MATCHING_TASK } from '../data/coordinatorData';

export const AIVolunteerMatchingView = ({
  onOpenCompareModal,
  onRecordDecision
}) => {
  const [selectedDecision, setSelectedDecision] = useState('');
  const [reason, setReason] = useState('');
  const [recordedStatus, setRecordedStatus] = useState(null);
  const [decisionHistory, setDecisionHistory] = useState([]);

  const handleSubmitDecision = (e) => {
    e.preventDefault();
    if (!selectedDecision) {
      alert('Please select a decision action before recording.');
      return;
    }
    if (!reason.trim()) {
      alert('Please enter a required reason / justification.');
      return;
    }

    const decisionRecord = {
      decision: selectedDecision,
      reason,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reviewer: 'Kavindi Rodrigo (Volunteer Coordinator)'
    };

    setDecisionHistory([decisionRecord, ...decisionHistory]);
    setRecordedStatus(decisionRecord);
    if (onRecordDecision) {
      onRecordDecision(decisionRecord);
    }
    setSelectedDecision('');
    setReason('');
  };

  return (
    <div>
      {/* 1. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">HUMAN - CONTROLLED DECISION SUPPORT</div>
          <h1 className="vc-page-title">AI Volunteer Matching</h1>
          <p className="vc-page-desc">
            Simulated recommendation only. It cannot approve, reject, accuse, allocate, or bypass role permissions.
          </p>
        </div>
      </div>

      {/* Success banner if recorded */}
      {recordedStatus && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
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
          <span>
            Human decision recorded: <strong>{recordedStatus.decision}</strong> at {recordedStatus.timestamp}. Preserved in tamper-evident coordination log.
          </span>
        </div>
      )}

      {/* 2. Main Two-Column Layout */}
      <div className="vc-ai-layout">
        {/* Left Column: Recommendations, Factors & Duplicate check */}
        <div className="vc-ai-main">
          {/* Card 1: Simulated AI Recommendation */}
          <div className="vc-card" style={{ marginBottom: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    backgroundColor: '#ede9fe',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Sparkles size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b', fontWeight: 600 }}>
                    SIMULATED AI RECOMMENDATION
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    {AI_MATCHING_TASK.taskId} - {AI_MATCHING_TASK.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {AI_MATCHING_TASK.refCode}
                  </div>
                </div>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  color: '#475569'
                }}
              >
                ● REVIEW
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>
                Suggested actions
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                {AI_MATCHING_TASK.suggestedAction}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {AI_MATCHING_TASK.confidence}
              </div>
            </div>
          </div>

          {/* Card 2: Factors, Limits and Possible Conflicts */}
          <div className="vc-card" style={{ marginBottom: '16px' }}>
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '14px',
                paddingBottom: '8px',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              Factors, limits and possible conflicts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {AI_MATCHING_TASK.factors.map((factor, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#fafbfc',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {factor.icon === 'alert' ? (
                      <AlertTriangle size={15} style={{ color: '#d97706', flexShrink: 0 }} />
                    ) : (
                      <CheckCircle2 size={15} style={{ color: '#64748b', flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                        {factor.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {factor.description}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor:
                        factor.badge === 'Review'
                          ? '#fef3c7'
                          : factor.badge === 'Required'
                          ? '#fee2e2'
                          : '#e2e8f0',
                      color:
                        factor.badge === 'Review'
                          ? '#92400e'
                          : factor.badge === 'Required'
                          ? '#991b1b'
                          : '#334155'
                    }}
                  >
                    {factor.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Possible Duplicate / Related Record */}
          <div className="vc-card">
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '12px'
              }}
            >
              Possible duplicate / related record
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            >
              <div style={{ fontSize: '12px', color: '#334155' }}>
                <strong style={{ color: '#0f172a' }}>{AI_MATCHING_TASK.possibleDuplicate.ref}</strong>{' '}
                {AI_MATCHING_TASK.possibleDuplicate.skills} · {AI_MATCHING_TASK.possibleDuplicate.note}
              </div>
              <button
                className="vc-btn-outline"
                onClick={onOpenCompareModal}
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                Compare
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Record Human Decision */}
        <div className="vc-ai-sidebar">
          <div className="vc-card">
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '14px',
                paddingBottom: '8px',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              Record human decision
            </h3>

            <form onSubmit={handleSubmitDecision}>
              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    marginBottom: '6px'
                  }}
                >
                  Decision
                </label>
                <select
                  className="vc-filter-select"
                  style={{ width: '100%' }}
                  value={selectedDecision}
                  onChange={(e) => setSelectedDecision(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Approve match recommendation">Approve match recommendation</option>
                  <option value="Adjust allocation to 3 volunteers">Adjust allocation to 3 volunteers</option>
                  <option value="Hold for senior review">Hold for senior review</option>
                  <option value="Reject match proposal">Reject match proposal</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    marginBottom: '6px'
                  }}
                >
                  Required reason
                </label>
                <textarea
                  className="vc-textarea"
                  rows={4}
                  placeholder="Explain the evidence and decision..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '6px',
                  border: '1px solid #dcfce7',
                  marginBottom: '16px'
                }}
              >
                <ShieldCheck size={16} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '11px', color: '#166534', lineHeight: 1.4 }}>
                  Original recommendation, reviewer decision, reason and timestamp are retained.
                </div>
              </div>

              <button
                type="submit"
                className="vc-btn-primary"
                style={{
                  width: '100%',
                  padding: '10px',
                  justifyContent: 'center',
                  backgroundColor: '#233831',
                  color: '#ffffff'
                }}
              >
                Record reviewed decision
              </button>
            </form>

            {/* Decision Log if any */}
            {decisionHistory.length > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Decisions recorded this session
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {decisionHistory.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        fontSize: '11px'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{h.decision}</div>
                      <div style={{ color: '#475569', margin: '2px 0' }}>{h.reason}</div>
                      <div style={{ color: '#94a3b8', fontSize: '10px' }}>{h.timestamp} · {h.reviewer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


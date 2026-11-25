import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Scale,
  Clock,
  Layers,
  HelpCircle,
  FileCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { volunteerService } from '../../../services/volunteerService';

export const AIVolunteerMatchingView = ({
  onOpenCompareModal,
  onRecordDecision
}) => {
  const [matchingData, setMatchingData] = useState(null);
  const [selectedDecision, setSelectedDecision] = useState('');
  const [reason, setReason] = useState('');
  const [recordedStatus, setRecordedStatus] = useState(null);
  const [decisionHistory, setDecisionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadMatchingData();
  }, []);

  const loadMatchingData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [matchingRes, historyRes] = await Promise.all([
        volunteerService.getMatchingRecommendation(),
        volunteerService.getMatchingHistory()
      ]);

      const data = matchingRes.data || matchingRes;
      setMatchingData(data);

      const history = historyRes.data || historyRes;
      if (Array.isArray(history)) {
        setDecisionHistory(history);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load matching recommendation from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDecision = async (e) => {
    e.preventDefault();
    if (!selectedDecision) {
      alert('Please select a decision action before recording.');
      return;
    }
    if (!reason.trim()) {
      alert('Please enter a required reason / justification.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        taskId: matchingData?.taskId || 'TASK-01',
        taskTitle: matchingData?.title || 'Operational Matching Request',
        decision: selectedDecision,
        reason: reason.trim()
      };

      const res = await volunteerService.recordMatchingDecision(payload);
      const savedRecord = res.data || {
        decision: selectedDecision,
        reason: reason.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reviewer: 'Volunteer Coordinator'
      };

      setDecisionHistory((prev) => [savedRecord, ...prev]);
      setRecordedStatus(savedRecord);

      if (onRecordDecision) {
        onRecordDecision(savedRecord);
      }

      setSelectedDecision('');
      setReason('');
      setTimeout(() => setRecordedStatus(null), 5000);
    } catch (err) {
      alert(err.message || 'Failed to persist decision to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* 1. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">HUMAN-IN-THE-LOOP DECISION SUPPORT</div>
          <h1 className="vc-page-title">Volunteer Task Matching & Decision Audit</h1>
          <p className="vc-page-desc">
            Rule-based algorithmic matching recommendations based on verified skills, proximity, and operational availability. Recommendations are advisory only and cannot automatically assign volunteers without human review.
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
            Human decision recorded: <strong>{recordedStatus.decision}</strong> at {recordedStatus.timestamp}. Persisted to SQL Server AIDecisionAudits table.
          </span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
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
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#657367' }}>
          <Loader2 size={24} className="vc-spin" style={{ margin: '0 auto 12px auto' }} />
          <div>Evaluating volunteer capabilities and active operational tasks...</div>
        </div>
      ) : (
        /* 2. Main Two-Column Layout */
        <div className="vc-ai-layout">
          {/* Left Column: Recommendations, Factors & Duplicate check */}
          <div className="vc-ai-main">
            {/* Card 1: Recommendation Details */}
            <div className="vc-card" style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #eef1ea',
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
                    <div
                      style={{
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: '#657367',
                        fontWeight: 600
                      }}
                    >
                      RULE-BASED MATCH RECOMMENDATION
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#14291e' }}>
                      {matchingData?.taskId || 'TASK-01'} - {matchingData?.title || 'Operational Assistance Task'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#657367' }}>
                      Ref: {matchingData?.refCode || 'KEL-FLD-0104'}
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
                    backgroundColor: '#eef1ea',
                    color: '#4a5b4a'
                  }}
                >
                  ● PENDING REVIEW
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#f4f6f2',
                  border: '1px solid #dfe5d8',
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    color: '#657367',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}
                >
                  Suggested actions
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#14291e', marginBottom: '4px' }}>
                  {matchingData?.suggestedAction || 'Match 2 verified responders with logistics or first aid certification'}
                </div>
                <div style={{ fontSize: '12px', color: '#657367' }}>
                  {matchingData?.confidence || 'Confidence: High (Deterministic rule match based on verified skills & availability)'}
                </div>
              </div>
            </div>

            {/* Card 2: Factors, Limits and Possible Conflicts */}
            <div className="vc-card" style={{ marginBottom: '16px' }}>
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
                Evaluation factors & constraints
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(matchingData?.factors || []).map((factor, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#fafbfc',
                      border: '1px solid #eef1ea'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {factor.icon === 'alert' ? (
                        <AlertTriangle size={15} style={{ color: '#d97706', flexShrink: 0 }} />
                      ) : (
                        <CheckCircle2 size={15} style={{ color: '#657367', flexShrink: 0 }} />
                      )}
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#14291e' }}>
                          {factor.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#657367' }}>
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
                            : '#dfe5d8',
                        color:
                          factor.badge === 'Review'
                            ? '#92400e'
                            : factor.badge === 'Required'
                            ? '#991b1b'
                            : '#2a4a35'
                      }}
                    >
                      {factor.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Possible Duplicate / Related Record */}
            {matchingData?.possibleDuplicate && (
              <div className="vc-card">
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#14291e',
                    marginBottom: '12px'
                  }}
                >
                  Candidate alignment check
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    backgroundColor: '#f4f6f2',
                    border: '1px solid #dfe5d8',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#2a4a35' }}>
                    <strong style={{ color: '#14291e' }}>{matchingData.possibleDuplicate.ref}</strong>{' '}
                    {matchingData.possibleDuplicate.skills} · {matchingData.possibleDuplicate.note}
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
            )}
          </div>

          {/* Right Column: Record Human Decision */}
          <div className="vc-ai-sidebar">
            <div className="vc-card">
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
                      color: '#657367',
                      marginBottom: '6px'
                    }}
                  >
                    Decision Action *
                  </label>
                  <select
                    className="vc-filter-select"
                    style={{ width: '100%' }}
                    value={selectedDecision}
                    onChange={(e) => setSelectedDecision(e.target.value)}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select an action...</option>
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
                      color: '#657367',
                      marginBottom: '6px'
                    }}
                  >
                    Required justification *
                  </label>
                  <textarea
                    className="vc-textarea"
                    rows={4}
                    placeholder="Provide coordinator justification for the audit log..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isSubmitting}
                    required
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
                    Original recommendation, reviewer identity, decision reason and timestamp are saved to AIDecisionAudits in SQL Server.
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
                    backgroundColor: '#14291e',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="vc-spin" />
                      Saving to Audit Log...
                    </>
                  ) : (
                    'Record Reviewed Decision'
                  )}
                </button>
              </form>

              {/* Persisted Decision History */}
              {decisionHistory.length > 0 && (
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eef1ea' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#657367',
                      textTransform: 'uppercase',
                      marginBottom: '8px'
                    }}
                  >
                    Persisted Decision History
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                    {decisionHistory.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          backgroundColor: '#f4f6f2',
                          border: '1px solid #dfe5d8',
                          fontSize: '11px'
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#14291e' }}>{h.decision}</div>
                        <div style={{ color: '#4a5b4a', margin: '2px 0' }}>{h.reason}</div>
                        <div style={{ color: '#8a9480', fontSize: '10px' }}>
                          {h.timestamp} · {h.reviewer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIVolunteerMatchingView;

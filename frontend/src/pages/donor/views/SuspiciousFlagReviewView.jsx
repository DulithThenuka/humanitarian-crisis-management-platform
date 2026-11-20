import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SuspiciousFlagReviewView = ({
  flags = [],
  loading = false,
  onResolveFlag
}) => {
  const [selectedFlagId, setSelectedFlagId] = useState(null);
  const [selectedDecision, setSelectedDecision] = useState('');
  const [decisionReason, setDecisionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (flags.length > 0 && !flags.some(f => f.id === selectedFlagId)) {
      setSelectedFlagId(flags[0].id);
    }
  }, [flags, selectedFlagId]);

  const selectedFlag = flags.find(f => f.id === selectedFlagId) || flags[0] || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFlag || !selectedDecision || !decisionReason.trim()) {
      alert('Please select a human decision and enter the mandatory decision reason.');
      return;
    }
    if (!window.confirm(`Confirm human compliance decision "${selectedDecision}" for ${selectedFlag.recordId}?`)) {
      return;
    }
    setSubmitting(true);
    try {
      await onResolveFlag(selectedFlag.id, selectedDecision, decisionReason.trim());
      setSelectedDecision('');
      setDecisionReason('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fo-workspace">
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>HUMAN-CONTROLLED COMPLIANCE & RISK REVIEW</span>
          </div>
          <h1 className="fo-title">Suspicious Flag Review</h1>
          <p className="fo-subtitle">
            Advisory risk flags only. AI cannot approve, reject, accuse, allocate, or bypass officer permissions.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="fo-panel" style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
          Loading compliance flags...
        </div>
      ) : flags.length === 0 ? (
        <div className="fo-panel" style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
          <CheckCircle2 size={28} color="#0f766e" style={{ marginBottom: '8px' }} />
          <div style={{ fontWeight: 700, color: '#162e20' }}>No Flagged Records</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>
            All high-value and flagged donations have been reviewed.
          </div>
        </div>
      ) : (
        <div className="fo-split-layout">
          {/* Left: Flag Queue + Advisory AI Analysis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '1 1 60%' }}>
            {/* Flag Queue Selector */}
            <div className="fo-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
                FLAGGED RECORDS QUEUE ({flags.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {flags.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFlagId(f.id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: selectedFlag?.id === f.id ? '2px solid #0e6f76' : '1px solid #e2e8f0',
                      backgroundColor: selectedFlag?.id === f.id ? '#f0fdfa' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#162e20', fontSize: '13px' }}>{f.recordId} · {f.donorOrg}</strong>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{f.anomalyReason}</div>
                    </div>
                    <span
                      className="fo-status-pill"
                      style={{
                        color: f.status === 'Cleared' ? '#0f766e' : f.status === 'Rejected' || f.status === 'Escalated' ? '#dc2626' : '#b45309',
                        backgroundColor: f.status === 'Cleared' ? '#f0fdfa' : f.status === 'Rejected' || f.status === 'Escalated' ? '#fef2f2' : '#fffbeb'
                      }}
                    >
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedFlag && (
              <>
                {/* Advisory Recommendation Card */}
                <div className="fo-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.06em' }}>
                          ADVISORY COMPLIANCE SUPPORT · {selectedFlag.id}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#162e20' }}>
                          {selectedFlag.recordId} · {selectedFlag.donorOrg}
                        </h3>
                      </div>
                    </div>
                    <span className="fo-badge">Risk Score: {selectedFlag.riskScore}/100</span>
                  </div>

                  <div style={{ backgroundColor: '#faf8fc', borderLeft: '4px solid #7c3aed', padding: '12px 16px', borderRadius: '0 8px 8px 0', fontSize: '13px', color: '#162e20' }}>
                    <strong>Advisory Recommendation:</strong> {selectedFlag.aiRecommendation}
                  </div>
                </div>

                {/* Risk Factors & Audit Trail */}
                <div className="fo-panel" style={{ padding: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#162e20' }}>
                    Supporting Risk Factors & Limitations
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(selectedFlag.riskFactors || []).map((rf, i) => (
                      <li key={i}>{rf}</li>
                    ))}
                  </ul>
                  {selectedFlag.decisionReason && (
                    <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '12px', color: '#334155' }}>
                      <strong>Last Audit Decision:</strong> {selectedFlag.decisionReason}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: Human Decision Panel */}
          <div className="fo-panel" style={{ flex: '1 1 40%', padding: '20px', alignSelf: 'flex-start' }}>
            {selectedFlag && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#0e6f76" />
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#162e20' }}>Human Officer Decision</h3>
                </div>

                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Final compliance authority rests strictly with the Funding Officer. Selecting a decision persists directly to {selectedFlag.recordId}.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { value: 'clear', label: 'Clear & Verify' },
                    { value: 'investigate', label: 'Under Investigation' },
                    { value: 'escalate', label: 'Escalate' },
                    { value: 'reject', label: 'Reject Donation' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedDecision(opt.value)}
                      className={`fo-btn ${selectedDecision === opt.value ? 'fo-btn-primary' : 'fo-btn-secondary'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    MANDATORY DECISION REASON
                  </label>
                  <textarea
                    rows={3}
                    required
                    className="fo-textarea"
                    placeholder="Document verification evidence, escalation basis, or rejection reason..."
                    value={decisionReason}
                    onChange={(e) => setDecisionReason(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <button type="submit" className="fo-btn fo-btn-primary" disabled={submitting}>
                  <AlertTriangle size={14} />
                  <span>{submitting ? 'Recording Decision...' : 'Record Authorised Decision'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuspiciousFlagReviewView;

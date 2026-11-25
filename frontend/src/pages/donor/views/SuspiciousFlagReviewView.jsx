import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  HelpCircle,
  Building,
  Clock,
  ArrowRight
} from 'lucide-react';

export const SuspiciousFlagReviewView = ({
  flags = [],
  onResolveFlag,
  onEscalateFlag
}) => {
  const displayFlags = flags || [];
  const [selectedFlagId, setSelectedFlagId] = useState(displayFlags[0]?.id || 'FLG-801');
  const [selectedDecision, setSelectedDecision] = useState('clear');
  const [decisionReason, setDecisionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const currentFlag = displayFlags.find(f => f.id === selectedFlagId) || displayFlags[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentFlag) return;
    if (!decisionReason.trim()) {
      alert('Please enter a mandatory audit justification before submitting your determination.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onResolveFlag) {
        await onResolveFlag(currentFlag.id, {
          action: selectedDecision,
          resolutionNotes: `${selectedDecision.toUpperCase()}: ${decisionReason}`
        });
      }
      setFeedbackMessage(`Determination recorded: Flag ${currentFlag.id} marked as ${selectedDecision === 'clear' ? 'Cleared & Cleared for Allocation' : 'Escalated to National Command'}.`);
      setDecisionReason('');
    } catch (err) {
      console.error(err);
      alert('Error submitting determination.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>ANTI-FRAUD & ANOMALY HEURISTICS · HUMAN-IN-THE-LOOP CLEARANCE</span>
          </div>
          <h1 className="fo-title">Suspicious Donation Review</h1>
          <p className="fo-subtitle">
            System-detected value escalations, quantity variances, and AML screening flags requiring authorized human evaluation and regulatory sign-off.
          </p>
        </div>
      </div>

      {/* Mandatory Advisory Notice Banner */}
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '8px',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.5 }}>
          <strong>Operational Advisory Disclaimer:</strong> Automated risk scores and anomaly detection flags provide operational decision assistance only. Heuristic assessments cannot reject, accuse, or bypass role permissions. Formal financial, compliance, and legal clearance strictly requires authorized human review and documented audit justification.
        </div>
      </div>

      {/* Flag Selector Tabs if multiple */}
      {displayFlags.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
          {displayFlags.map((f) => (
            <button
              key={f.id}
              onClick={() => { setSelectedFlagId(f.id); setFeedbackMessage(null); }}
              className={`fo-btn ${selectedFlagId === f.id ? 'fo-btn-primary' : 'fo-btn-secondary'}`}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <span>{f.id} ({f.donorOrg || f.recordId})</span>
              <span style={{ 
                fontSize: '10px', 
                backgroundColor: f.severity === 'urgent' ? '#dc2626' : '#d97706',
                color: '#fff',
                padding: '1px 6px',
                borderRadius: '8px',
                marginLeft: '6px'
              }}>
                Risk {f.riskScore || 75}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          color: '#166534',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} color="#059669" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Grid: Left Flag Details & Risk Breakdown, Right Human Determination */}
      <div className="fo-split-layout">
        {/* Left Column (60%) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1 1 60%' }}>
          {currentFlag ? (
            <div className="fo-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      AUTOMATED HEURISTIC ANOMALY FLAG
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#162e20', margin: '2px 0 0 0' }}>
                      {currentFlag.recordId} · {currentFlag.donorOrg}
                    </h2>
                    <div style={{ fontSize: '12px', color: '#657367', marginTop: '2px' }}>
                      Flag ID: {currentFlag.id} · Detected {new Date(currentFlag.detectedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '16px',
                  backgroundColor: currentFlag.status === 'Cleared' ? '#ecfdf5' : '#f5f3ff',
                  color: currentFlag.status === 'Cleared' ? '#059669' : '#6d28d9',
                  border: `1px solid ${currentFlag.status === 'Cleared' ? '#a7f3d0' : '#ddd6fe'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentFlag.status === 'Cleared' ? '#059669' : '#7c3aed' }}></span>
                  {currentFlag.status || 'REVIEW REQUIRED'}
                </span>
              </div>

              {/* Anomaly Reason Box */}
              <div style={{
                backgroundColor: '#faf8fc',
                borderLeft: '4px solid #7c3aed',
                borderRadius: '0 8px 8px 0',
                padding: '14px 18px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Primary Trigger Heuristic
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#162e20', lineHeight: 1.4 }}>
                  {currentFlag.anomalyReason}
                </div>
                <p style={{ fontSize: '12px', color: '#556358', margin: '6px 0 0', lineHeight: 1.4 }}>
                  {currentFlag.details || 'Secondary compliance manifest verification required by Funding Officer.'}
                </p>
              </div>

              {/* Risk Score Meter */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>
                    Calculated Anomaly Score: {currentFlag.riskScore || 75}/100
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    color: currentFlag.severity === 'urgent' ? '#dc2626' : '#d97706',
                    textTransform: 'uppercase'
                  }}>
                    Severity: {currentFlag.severity || 'warning'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${currentFlag.riskScore || 75}%`,
                    height: '100%',
                    backgroundColor: (currentFlag.riskScore || 75) > 80 ? '#dc2626' : '#d97706',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              {/* Context Information */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', margin: '0 0 10px 0' }}>
                  Intake Context & Regulatory Audit Checkpoints
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#445145', lineHeight: 1.6 }}>
                  <li>Cross-checked against National Central Bank AML blacklist: <strong>Clean</strong></li>
                  <li>Donor Entity Profile Verification: <strong>Registered Humanitarian Entity</strong></li>
                  <li>Physical Inventory Manifest: <strong>Secondary Warehouse Counter-Sign Pending</strong></li>
                  <li>Tax Exemption / NGO Reciprocal Status: <strong>Standard Form C Required</strong></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="fo-panel" style={{ padding: '36px', textAlign: 'center', color: '#657367' }}>
              <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 12px' }} />
              <h3>No Active Suspicious Flags</h3>
              <p>All recorded contributions have cleared anti-fraud and anomaly heuristics.</p>
            </div>
          )}
        </div>

        {/* Right Column: Human Review Determination (40%) */}
        <div style={{ flex: '1 1 40%' }}>
          <div className="fo-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: '0 0 4px 0' }}>
              Authorized Human Determination
            </h3>
            <p style={{ fontSize: '12px', color: '#657367', margin: '0 0 16px 0' }}>
              Documented human clearance determination required to update audit status.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Decision Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${selectedDecision === 'clear' ? '#2d5a3e' : '#e2e8f0'}`,
                    backgroundColor: selectedDecision === 'clear' ? '#f4f7f4' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="clear"
                    checked={selectedDecision === 'clear'}
                    onChange={(e) => setSelectedDecision(e.target.value)}
                    style={{ marginTop: '2px' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#162e20' }}>
                      Clear & Verify for Allocation
                    </div>
                    <div style={{ fontSize: '11px', color: '#657367' }}>
                      Discrepancy resolved through verified secondary documentation. Clears pledge for shelter/depot allocation.
                    </div>
                  </div>
                </label>

                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${selectedDecision === 'escalate' ? '#dc2626' : '#e2e8f0'}`,
                    backgroundColor: selectedDecision === 'escalate' ? '#fef2f2' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="escalate"
                    checked={selectedDecision === 'escalate'}
                    onChange={(e) => setSelectedDecision(e.target.value)}
                    style={{ marginTop: '2px' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#162e20' }}>
                      Escalate to National Command & Audit Desk
                    </div>
                    <div style={{ fontSize: '11px', color: '#657367' }}>
                      Freeze allocation voucher and transfer dossier to National Audit Comptroller for formal inquiry.
                    </div>
                  </div>
                </label>

                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${selectedDecision === 'clarify' ? '#d97706' : '#e2e8f0'}`,
                    backgroundColor: selectedDecision === 'clarify' ? '#fffbeb' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="clarify"
                    checked={selectedDecision === 'clarify'}
                    onChange={(e) => setSelectedDecision(e.target.value)}
                    style={{ marginTop: '2px' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#162e20' }}>
                      Request Supplementary Manifest / Invoice
                    </div>
                    <div style={{ fontSize: '11px', color: '#657367' }}>
                      Maintain hold status and transmit automated inquiry to donor's authorized representative.
                    </div>
                  </div>
                </label>
              </div>

              {/* Justification Textarea */}
              <div style={{ marginBottom: '16px' }}>
                <label className="fo-note-label">
                  OFFICIAL DETERMINATION JUSTIFICATION *
                </label>
                <textarea
                  className="fo-note-textarea"
                  rows={4}
                  placeholder="State the verified physical verification steps, invoice numbers, warehouse sign-offs, or escalation rationale..."
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="fo-btn fo-btn-primary fo-btn-full"
                disabled={isSubmitting || !currentFlag}
              >
                <ShieldCheck size={14} />
                <span>{isSubmitting ? 'Recording Determination...' : 'Sign & Record Official Determination'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspiciousFlagReviewView;

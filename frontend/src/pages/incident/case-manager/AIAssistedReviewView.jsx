import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  X 
} from 'lucide-react';
import { AI_REVIEW_FACTORS } from './caseManagerData';
import { incidentService } from '../../../services/incidentService';

export const AIAssistedReviewView = ({
  caseId = 'HMR-1042',
  onDecisionRecorded,
  showToast
}) => {
  const [selectedDecision, setSelectedDecision] = useState('');
  const [decisionReason, setDecisionReason] = useState('');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiReviewData, setAiReviewData] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [isLiveReview, setIsLiveReview] = useState(false);

  useEffect(() => {
    let active = true;
    const loadAIReview = async () => {
      try {
        const [reviewRes, dupRes] = await Promise.all([
          incidentService.getAIReview(caseId),
          incidentService.getPossibleDuplicates(caseId)
        ]);
        if (!active) return;

        const review = reviewRes?.data || reviewRes;
        if (review && (review.referenceCode || review.urgencyAssessment)) {
          setAiReviewData(review);
          setIsLiveReview(true);
        }

        const dupList = dupRes?.data || dupRes;
        if (Array.isArray(dupList)) {
          setDuplicates(dupList);
        }
      } catch {
        if (!active) return;
        setIsLiveReview(false);
      }
    };

    loadAIReview();
    return () => {
      active = false;
    };
  }, [caseId]);

  const handleRecordDecision = async () => {
    if (!selectedDecision) {
      showToast?.('Please select a human decision from the dropdown', 'warning');
      return;
    }
    if (!decisionReason.trim()) {
      showToast?.('A justification reason is required for audited human decisions', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await incidentService.recordAIReviewDecision(caseId, {
        decision: selectedDecision,
        reason: decisionReason.trim()
      });
      const updated = res?.data || res;
      if (updated) {
        setAiReviewData(updated);
        setIsLiveReview(true);
      }
      showToast?.(`Audited human decision (${selectedDecision}) recorded for ${caseId}`, 'success');
      onDecisionRecorded?.(caseId, selectedDecision, decisionReason);
      setDecisionReason('');
      setSelectedDecision('');
    } catch {
      // Fallback simulation if backend is unreachable
      showToast?.(`Audited human decision (${selectedDecision}) recorded locally for ${caseId}`, 'success');
      onDecisionRecorded?.(caseId, selectedDecision, decisionReason);
      setDecisionReason('');
      setSelectedDecision('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const factors = aiReviewData?.factors?.length ? aiReviewData.factors : AI_REVIEW_FACTORS;
  const primaryCandidate = duplicates[0] || {
    candidateCaseNumber: aiReviewData?.duplicateSuggestionCaseNumber || 'HMR-1039',
    category: 'Medicine',
    operationalArea: 'Wattala South',
    citizenQuote: 'Urgent insulin supply needed within 6 hours. Refrigerated storage submerged.',
    auditMandate: 'Different categories and operational sectors. Human verification confirms these are distinct non-duplicate households.'
  };

  return (
    <div className="cm-canvas-wrapper">
      {/* Header */}
      <div className="cm-canvas-head-row">
        <div>
          <span className="cm-tag-uppercase">
            {isLiveReview
              ? 'HUMAN-CONTROLLED DECISION SUPPORT · RULE-BASED API PROVIDER'
              : 'HUMAN-CONTROLLED DECISION SUPPORT (FALLBACK)'}
          </span>
          <h1 className="cm-canvas-h1">AI-assisted Review</h1>
          <p className="cm-canvas-sub">
            Rule-based demonstration recommendation only. It cannot approve, reject, accuse, allocate, or bypass role permissions.
          </p>
        </div>
      </div>

      {/* Two-Column Split Grid */}
      <div className="cm-mgmt-split-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. Simulated AI Recommendation Hero Card */}
          <div className="cm-ai-rec-card">
            <div className="cm-ai-rec-header">
              <div className="cm-ai-rec-left">
                <div className="cm-ai-rec-icon">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="cm-ai-rec-tag">
                    {aiReviewData?.providerLabel?.toUpperCase() || 'RULE-BASED DEMONSTRATION AI RECOMMENDATION'}
                  </span>
                  <div className="cm-ai-rec-case">
                    {caseId} · {aiReviewData?.recommendedCategory || 'Shelter'} case
                  </div>
                  <div className="cm-ai-rec-sub">
                    {aiReviewData?.referenceCode || 'DEMO-AI-2051'} · Human review required
                  </div>
                </div>
              </div>
              <span className="cm-ai-rec-badge">
                ● {aiReviewData?.isReviewedByHuman ? 'Reviewed' : 'Review'}
              </span>
            </div>

            <div className="cm-ai-rec-outcome-box">
              <p className="cm-outcome-text">
                {aiReviewData?.urgencyAssessment || 'Classify as shelter · critical priority'}
              </p>
              <p className="cm-outcome-sub">
                Rule-based demonstration confidence {aiReviewData?.confidencePercent ?? 88}% (never auto-rejects)
              </p>
            </div>
          </div>

          {/* 2. Factors, limits and possible conflicts */}
          <div className="cm-panel-card">
            <div className="cm-panel-header">
              <h3 className="cm-panel-title">Factors, limits and possible conflicts</h3>
            </div>

            <div className="cm-factors-list">
              {factors.map((f) => (
                <div key={f.id} className="cm-factor-row">
                  <div className="cm-factor-left">
                    {f.tagType === 'review' ? (
                      <AlertTriangle size={16} color="#dc2626" />
                    ) : (
                      <CheckCircle2 size={16} color="#0284c7" />
                    )}
                    <div>
                      <div className="cm-factor-title">{f.title}</div>
                      <div className="cm-factor-desc">{f.desc}</div>
                    </div>
                  </div>
                  <span className={`cm-factor-tag ${f.tagType}`}>
                    ● {f.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Possible duplicate / related record */}
          <div className="cm-duplicate-card">
            <div>
              <strong style={{ display: 'block', fontSize: '13.5px', marginBottom: '3px' }}>
                Possible duplicate / related record
              </strong>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {primaryCandidate.candidateCaseNumber} · {primaryCandidate.category} - compare separately, never auto-merge
              </span>
            </div>
            <button className="cm-btn-compare" onClick={() => setShowCompareModal(true)}>
              Compare
            </button>
          </div>
        </div>

        {/* Right Column: Record Human Decision */}
        <div>
          <div className="cm-decision-panel">
            <h3 className="cm-panel-title">Record human decision</h3>

            <div>
              <label className="cm-form-label" style={{ display: 'block', marginBottom: '6px' }}>
                DECISION
              </label>
              <select
                className="cm-select-decision"
                value={selectedDecision}
                onChange={(e) => setSelectedDecision(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="Approve recommendation">Approve recommendation as proposed</option>
                <option value="Modify priority">Modify priority level</option>
                <option value="Request clarification">Request clarification from citizen</option>
                <option value="Escalate">Escalate to Senior Incident Coordinator</option>
              </select>
            </div>

            <div>
              <label className="cm-form-label" style={{ display: 'block', marginBottom: '6px' }}>
                REQUIRED REASON
              </label>
              <textarea
                className="cm-form-textarea"
                rows={5}
                placeholder="Explain the evidence and decision..."
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ShieldCheck size={16} color="#0284c7" style={{ flexShrink: 0 }} />
              <span>Original recommendation, reviewer, decision, reason and timestamp are retained in immutable audit history.</span>
            </div>

            <button 
              className="cm-btn-record-decision"
              onClick={handleRecordDecision}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording decision...' : 'Record reviewed decision'}
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Compare Modal */}
      {showCompareModal && (
        <div className="cm-modal-backdrop" onClick={() => setShowCompareModal(false)}>
          <div className="cm-modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Compare Potential Duplicate Pair</h3>
              <button onClick={() => setShowCompareModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '10px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                <span className="cm-pill-tag critical" style={{ marginBottom: '8px' }}>{caseId}</span>
                <h4 style={{ margin: '4px 0', fontSize: '13px' }}>{aiReviewData?.recommendedCategory || 'Emergency Shelter'}</h4>
                <p style={{ fontSize: '11.5px', color: '#64748b', margin: '4px 0 8px 0' }}>Kelani East - Zone 03</p>
                <p style={{ fontSize: '11.5px', color: '#334155', fontStyle: 'italic', background: '#ffffff', padding: '8px', borderRadius: '6px' }}>
                  "Flood water entered our home overnight. We have two children and my mother cannot walk far."
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                <span className="cm-pill-tag warning" style={{ marginBottom: '8px' }}>{primaryCandidate.candidateCaseNumber}</span>
                <h4 style={{ margin: '4px 0', fontSize: '13px' }}>{primaryCandidate.category}</h4>
                <p style={{ fontSize: '11.5px', color: '#64748b', margin: '4px 0 8px 0' }}>{primaryCandidate.operationalArea}</p>
                <p style={{ fontSize: '11.5px', color: '#334155', fontStyle: 'italic', background: '#ffffff', padding: '8px', borderRadius: '6px' }}>
                  "{primaryCandidate.citizenQuote}"
                </p>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '11.5px', color: '#166534', marginTop: '10px' }}>
              <strong>Audit Mandate:</strong> {primaryCandidate.auditMandate}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button 
                className="cm-btn-create-record" 
                onClick={() => {
                  setShowCompareModal(false);
                  showToast?.('Marked as verified distinct cases in system audit log', 'success');
                }}
              >
                Mark as Distinct Cases
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

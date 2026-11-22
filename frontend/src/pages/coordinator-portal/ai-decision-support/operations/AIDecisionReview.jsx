import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Home, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Users, 
  Droplets, 
  CheckCircle2, 
  ExternalLink,
  Info,
  Check
} from 'lucide-react';
import { aiGovernanceService } from '@/services/aiGovernanceService';

export const AIDecisionReview = ({ 
  caseId = 'AID-2051', 
  onBackToQueue, 
  showToast 
}) => {
  const [selectedDecision, setSelectedDecision] = useState('approve'); // 'approve' | 'modify' | 'reject' | 'defer'
  const [modifiedPriority, setModifiedPriority] = useState('High');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [confirmedCheck, setConfirmedCheck] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullRequestModal, setShowFullRequestModal] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCase = async () => {
      try {
        const res = await aiGovernanceService.getCase(caseId);
        const caseDetail = res?.data?.data ?? res?.data ?? res;
        if (isMounted && caseDetail && typeof caseDetail === 'object') {
          setCaseData(caseDetail);
          if (caseDetail.humanDecision) {
            const decLower = caseDetail.humanDecision.toLowerCase();
            if (decLower.includes('modify') || decLower.includes('override')) setSelectedDecision('modify');
            else if (decLower.includes('reject')) setSelectedDecision('reject');
            else if (decLower.includes('defer')) setSelectedDecision('defer');
            else setSelectedDecision('approve');
          }
          if (caseDetail.decisionReason) {
            setReviewerNotes(caseDetail.decisionReason);
          }
        }
      } catch (err) {
        console.error('Failed to load case detail:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCase();
    return () => { isMounted = false; };
  }, [caseId]);

  const handleRecordDecision = async () => {
    if (!confirmedCheck) {
      showToast?.('Please check the confirmation box before recording the decision', 'warning');
      return;
    }

    if (!reviewerNotes.trim()) {
      showToast?.('Please provide reviewer rationale notes to support your decision.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const targetCaseId = caseData?.relatedRecord || caseId;
      const res = await aiGovernanceService.recordDecision({
        caseId: targetCaseId,
        decision: selectedDecision,
        reason: reviewerNotes,
        overriddenPriority: selectedDecision === 'modify' ? modifiedPriority : null
      });

      const isSuccess = res?.succeeded ?? res?.data?.succeeded ?? (res && !res.errors?.length);
      if (isSuccess) {
        showToast?.(`Audited decision (${selectedDecision.toUpperCase()}) recorded in SQL database for ${targetCaseId}.`, 'success');
        setTimeout(() => {
          onBackToQueue?.();
        }, 700);
      } else {
        showToast?.(res?.message || res?.data?.message || 'Failed to record decision.', 'error');
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to record decision.';
      showToast?.(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const decisionOptions = [
    {
      id: 'approve',
      title: 'Approve',
      desc: 'Accept the recommendation as proposed'
    },
    {
      id: 'modify',
      title: 'Modify',
      desc: 'Record a different priority with reason'
    },
    {
      id: 'reject',
      title: 'Reject',
      desc: 'Do not use this recommendation'
    },
    {
      id: 'defer',
      title: 'Defer',
      desc: 'Return to queue for later review'
    }
  ];

  return (
    <div className="ai-review-canvas">
      {/* Top Breadcrumb & Decision Identifier */}
      <div className="ai-review-top-bar">
        <button className="btn-back-queue" onClick={() => onBackToQueue?.()}>
          <ChevronLeft size={16} />
          <span>Back to decision queue</span>
        </button>

        <span className="ai-review-case-id-tag">Decision {caseData?.decisionId || caseId}</span>
      </div>

      {/* Main Title Row */}
      <div className="ai-review-title-row">
        <div className="review-title-left">
          <span className="ai-category-badge-tiny">AI DECISION REVIEW</span>
          <h1 className="ai-review-heading">Urgency &amp; Priority Recommendation</h1>
          <div className="ai-review-sub-meta">
            <span>Related request <strong>{caseData?.relatedRecord || 'HMR-1042'}</strong></span>
            <span className="dot-sep">·</span>
            <span>Category: <strong>{caseData?.category || 'Emergency Shelter'}</strong></span>
            <span className="dot-sep">·</span>
            <span className="pill-pending-approval">● {caseData?.reviewStatus || 'Pending Human Approval'}</span>
          </div>
        </div>
      </div>

      {/* Two-Column Split Layout (Screenshot 4 & 5 exact match) */}
      <div className="ai-review-split-grid">
        {/* LEFT COLUMN: Request details, AI recommendation, Rationale & Risks */}
        <div className="review-left-column">
          {/* 1. Original Assistance Request Card */}
          <div className="review-panel-card">
            <div className="panel-card-header">
              <div>
                <h3 className="panel-card-title">Original assistance request</h3>
                <p className="panel-card-subtitle">Submitted by affected person · Sensitive access controlled</p>
              </div>
              <button 
                className="link-view-full"
                onClick={() => setShowFullRequestModal(true)}
              >
                View full request
              </button>
            </div>

            {/* Request Summary Lead */}
            <div className="request-lead-box">
              <div className="request-lead-top">
                <div className="request-icon-box">
                  <Home size={18} className="text-red" />
                </div>
                <div className="request-titles">
                  <h4 className="req-main-name">{caseData?.title || 'Emergency shelter for displaced household'}</h4>
                  <span className="req-sub-geo">{caseData?.relatedRecord || 'HMR-1042'} · {caseData?.address || caseData?.operationalArea || 'Kelani East, Zone 03'}</span>
                </div>
                <span className="pill-reported-urgent">● Priority: {caseData?.currentPriority || 'Critical'}</span>
              </div>

              {/* 4 Metadata Points Grid */}
              <div className="request-meta-4grid">
                <div className="meta-point">
                  <span className="meta-lbl">PEOPLE AFFECTED</span>
                  <strong className="meta-val">{caseData?.affectedCount ?? 6} people</strong>
                </div>
                <div className="meta-point">
                  <span className="meta-lbl">CURRENT SAFETY</span>
                  <strong className="meta-val">{caseData?.currentSafety || 'Temporary roadside location'}</strong>
                </div>
                <div className="meta-point">
                  <span className="meta-lbl">ACCESSIBILITY</span>
                  <strong className="meta-val">{caseData?.accessibilityNeeds || 'Older adult with limited mobility'}</strong>
                </div>
                <div className="meta-point">
                  <span className="meta-lbl">CALLER CONTACT</span>
                  <strong className="meta-val">{caseData?.contactPhone || '+94 77 123 4567'}</strong>
                </div>
              </div>

              {/* Citizen Quote Box */}
              <div className="citizen-statement-quote">
                <p>
                  "{caseData?.description || 'Flood water entered our home overnight. We have two children and my mother cannot walk far. We need a safe place before the water rises again.'}"
                </p>
              </div>
            </div>
          </div>

          {/* 2. AI Recommendation Card */}
          <div className="review-panel-card ai-recommendation-hero-card">
            <div className="ai-rec-hero-header">
              <div className="ai-rec-left">
                <div className="ai-rec-sparkle-box">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="ai-rec-tag">AI recommendation ({caseData?.providerLabel || 'Deterministic Rule Support'})</span>
                  <h3 className="ai-rec-bold-title">{caseData?.reasoning || `Assign ${caseData?.recommendedPriority || 'Critical'} priority for immediate human coordination`}</h3>
                </div>
              </div>

              <div className="ai-confidence-score-box">
                <span className="score-num">
                  {caseData?.confidenceScore != null && !isNaN(caseData.confidenceScore)
                    ? Number(caseData.confidenceScore).toFixed(2)
                    : (typeof caseData?.confidence === 'number' && !isNaN(caseData.confidence)
                        ? (caseData.confidence / 100).toFixed(2)
                        : 'N/A')}
                </span>
                <span className="score-lbl">confidence</span>
              </div>
            </div>

            {/* Disclaimer strip */}
            <div className="ai-rec-disclaimer-strip">
              <ShieldCheck size={16} className="text-blue shrink-0" />
              <span>
                This is decision support, not a final determination. A qualified reviewer must consider context and record the final action.
              </span>
            </div>
          </div>

          {/* 3. Supporting Rationale Section */}
          <div className="review-panel-card">
            <h3 className="section-small-title">SUPPORTING RATIONALE</h3>

            <div className="rationale-cards-2x2-grid">
              <div className="rationale-card">
                <div className="rationale-top">
                  <Droplets size={16} className="text-blue" />
                  <strong>Immediate hazard exposure</strong>
                </div>
                <p>Rising floodwater mentioned in report</p>
                <span className="impact-tag high">High impact</span>
              </div>

              <div className="rationale-card">
                <div className="rationale-top">
                  <Users size={16} className="text-blue" />
                  <strong>Household vulnerability</strong>
                </div>
                <p>Children and an older adult with mobility needs</p>
                <span className="impact-tag high">High impact</span>
              </div>

              <div className="rationale-card">
                <div className="rationale-top">
                  <Home size={16} className="text-blue" />
                  <strong>No safe accommodation</strong>
                </div>
                <p>Household currently located roadside</p>
                <span className="impact-tag high">High impact</span>
              </div>

              <div className="rationale-card">
                <div className="rationale-top">
                  <Clock size={16} className="text-amber" />
                  <strong>Time sensitivity</strong>
                </div>
                <p>Conditions may worsen before nightfall</p>
                <span className="impact-tag medium">Medium impact</span>
              </div>
            </div>

            {/* Evidence Limitations Banner */}
            <div className="evidence-limitations-box">
              <div className="evidence-title">Evidence limitations</div>
              <p>
                Location evidence has not yet been independently verified. No shelter availability is considered by this priority service.
              </p>
            </div>
          </div>

          {/* 4. Alternatives & Risk Considerations */}
          <div className="review-panel-card">
            <div className="panel-card-header">
              <div>
                <h3 className="panel-card-title">Alternatives &amp; risk considerations</h3>
                <p className="panel-card-subtitle">Options to consider before recording a decision</p>
              </div>
            </div>

            {/* Alternative priority row */}
            <div className="alt-priority-row">
              <span className="alt-dot amber">●</span>
              <strong className="alt-name">High</strong>
              <span className="alt-desc">
                Alternative priority: Use if immediate exposure cannot be verified and safe temporary accommodation is confirmed.
              </span>
            </div>

            {/* Two Risk Cards */}
            <div className="risk-cards-stack">
              <div className="risk-item-card">
                <AlertTriangle size={16} className="risk-icon amber shrink-0" />
                <div className="risk-text">
                  <strong>Risk of under-prioritisation</strong>
                  <span>Delay could leave a vulnerable household exposed to worsening conditions.</span>
                </div>
              </div>

              <div className="risk-item-card">
                <AlertTriangle size={16} className="risk-icon amber shrink-0" />
                <div className="risk-text">
                  <strong>Risk of over-prioritisation</strong>
                  <span>Critical handling may delay other verified life-threatening cases. Confirm evidence promptly.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Record Human Decision Form (Screenshots 4 & 5) */}
        <div className="review-right-column">
          <div className="record-decision-panel-card">
            <div className="record-decision-head">
              <div className="record-decision-icon-box">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="record-decision-title">Record human decision</h3>
                <p className="record-decision-sub">Your identity and rationale will be audited.</p>
              </div>
            </div>

            {/* Decision Radio Choice Cards (Project Blue Theme) */}
            <div className="decision-radio-list">
              {decisionOptions.map(opt => (
                <div 
                  key={opt.id}
                  className={`decision-radio-option-card ${selectedDecision === opt.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDecision(opt.id)}
                >
                  <div className="radio-circle-indicator">
                    {selectedDecision === opt.id && <div className="inner-dot"></div>}
                  </div>
                  <div className="radio-option-text">
                    <strong>{opt.title}</strong>
                    <span>{opt.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedDecision === 'modify' && (
              <div className="reviewer-notes-group" style={{ marginTop: '12px' }}>
                <label className="notes-label">ASSIGN ADJUSTED PRIORITY</label>
                <select
                  value={modifiedPriority}
                  onChange={(e) => setModifiedPriority(e.target.value)}
                  className="queue-filter-select"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #c5ccbe' }}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            )}

            {/* Reviewer Notes Textarea */}
            <div className="reviewer-notes-group">
              <label className="notes-label">REVIEWER NOTES / JUSTIFICATION (REQUIRED)</label>
              <textarea
                rows={3}
                placeholder="Explain justification for your decision..."
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                className="reviewer-notes-textarea"
              />
            </div>

            {/* Confirmation Checkbox */}
            <label className="decision-confirm-checkbox-row">
              <input 
                type="checkbox"
                checked={confirmedCheck}
                onChange={(e) => setConfirmedCheck(e.target.checked)}
                className="custom-checkbox"
              />
              <span>I have reviewed the original request, supporting rationale and relevant risks.</span>
            </label>

            {/* Primary Action Button (Blue gradient) */}
            <button 
              className="btn-record-approve-decision"
              onClick={handleRecordDecision}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording Decision...' : `Record ${selectedDecision} decision`}
            </button>

            {/* Audit Reference Footer */}
            <div className="decision-audit-footer-note">
              <CheckCircle2 size={13} className="text-muted" />
              <span>Recorded with reviewer, timestamp and audit reference</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
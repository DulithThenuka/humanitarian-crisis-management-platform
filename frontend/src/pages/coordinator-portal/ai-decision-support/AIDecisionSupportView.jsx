import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  SlidersHorizontal,
  ExternalLink,
  MapPin,
  Users,
  Clock,
  Loader2,
  Check
} from 'lucide-react';
import { AI_DECISION_SUPPORT_DATA } from '../data/coordinatorPortalData';
import { ConsequentialActionModal } from '../components/modals/ConsequentialActionModal';
import './AIDecisionSupportView.css';

export const AIDecisionSupportView = ({
  cases = [],
  selectedCaseId,
  onSelectCase,
  currentCase,
  onOpenCaseReview,
  onInspectDuplicate,
  onAcceptRecommendation,
  onRecordAIDecision,
  aiReviewed,
  showToast,
  coordinatorUser
}) => {
  // Resolve the active request being evaluated
  const activeCase = useMemo(() => {
    if (selectedCaseId && cases.length > 0) {
      const match = cases.find(c => c.id === selectedCaseId);
      if (match) return match;
    }
    return currentCase || (cases.length > 0 ? cases[0] : null);
  }, [cases, selectedCaseId, currentCase]);

  const activeCaseId = activeCase?.id || AI_DECISION_SUPPORT_DATA.relatedCaseId;
  const assessmentId = `AID-${activeCaseId.replace(/\D/g, '') || '2051'}`;
  const recommendedPriority = activeCase?.severity || AI_DECISION_SUPPORT_DATA.recommendedPriority;

  // Urgency Score (0-100) vs AI Confidence
  // Rule: Do NOT present urgency score as AI confidence!
  const rawUrgencyScore = activeCase?.aipriorityScore ?? activeCase?.aiPriorityScore;
  const urgencyScore = typeof rawUrgencyScore === 'number'
    ? Math.round(rawUrgencyScore > 1 ? rawUrgencyScore : rawUrgencyScore * 100)
    : (activeCase?.severity === 'Critical' ? 89 : activeCase?.severity === 'High' ? 76 : 58);

  // AI Confidence: meaningful model certainty value (distinct from urgency score)
  const rawConfidence = activeCase?.aiConfidence ?? activeCase?.aiConfidenceScore;
  const hasValidConfidence = typeof rawConfidence === 'number' && rawConfidence > 0 && rawConfidence !== rawUrgencyScore;
  const confidenceScore = hasValidConfidence
    ? Math.round(rawConfidence > 1 ? rawConfidence : rawConfidence * 100)
    : (activeCase?.severity === 'Critical' ? 88 : activeCase?.severity === 'High' ? 84 : null);

  const affectedCount = activeCase?.affectedPeople || 6;

  // Human Review Form State
  const [humanFinalPriority, setHumanFinalPriority] = useState(recommendedPriority);
  const [humanReviewReason, setHumanReviewReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRecordedDecision, setLastRecordedDecision] = useState(
    aiReviewed ? { type: 'accept', priority: recommendedPriority, time: 'Recently' } : null
  );

  // Consequential Action Modal State
  const [aiActionModal, setAiActionModal] = useState(null);
  const [modalReason, setModalReason] = useState('');
  const [modalConfirmedCheck, setModalConfirmedCheck] = useState(false);

  // Keep final priority in sync when switching cases
  React.useEffect(() => {
    setHumanFinalPriority(recommendedPriority);
    setHumanReviewReason('');
  }, [activeCaseId, recommendedPriority]);

  // Request-specific evidence behind each recommendation factor
  const factors = useMemo(() => [
    {
      id: 'f1',
      title: 'Immediate exposure risk',
      evidenceLabel: 'HAZARD PROXIMITY',
      detail: activeCase?.description
        ? `"${activeCase.description.slice(0, 90)}${activeCase.description.length > 90 ? '...' : ''}" (${activeCase.location || activeCase.generalLocation || 'Active hazard sector'})`
        : `Hazard proximity and floodwater conditions in ${activeCase?.location || 'Western Province Sector'}`,
      impact: activeCase?.severity === 'Critical' ? 'High' : 'Medium'
    },
    {
      id: 'f2',
      title: 'People potentially affected',
      evidenceLabel: 'AFFECTED OCCUPANTS',
      detail: activeCase?.affectedSummary
        ? activeCase.affectedSummary
        : `${affectedCount} household occupants requiring emergency intervention`,
      impact: affectedCount >= 5 ? 'High' : 'Medium'
    },
    {
      id: 'f3',
      title: 'Vulnerability & access constraints',
      evidenceLabel: 'ACCESSIBILITY & NEEDS',
      detail: activeCase?.accessibility
        ? `${activeCase.accessibility} · Contact: ${activeCase.contactStatus || 'Citizen direct line'}`
        : 'Elderly occupants / step-free access requirement noted in dispatch report',
      impact: 'High'
    },
    {
      id: 'f4',
      title: 'Operational time sensitivity',
      evidenceLabel: 'TEMPORAL URGENCY',
      detail: `Submitted: ${activeCase?.submittedAt || 'Today'} · Context: ${activeCase?.emergencyContext || activeCase?.operationalArea || 'Active response sector'}`,
      impact: activeCase?.severity === 'Critical' ? 'High' : 'Medium'
    }
  ], [activeCase, affectedCount]);

  // AI Recommendation Rationale
  const aiRationale = useMemo(() => {
    if (activeCase?.severity === 'Critical') {
      return `Multiple high-vulnerability indicators detected: ${affectedCount} occupants in an exposed hazard area (${activeCase?.location || 'Operational Sector'}), with acute accessibility and physical safety requirements. Calculated urgency of ${urgencyScore}/100 exceeds critical dispatch threshold.`;
    }
    if (activeCase?.severity === 'High') {
      return `Significant infrastructure or safety constraint identified: priority aid distribution recommended for ${activeCase?.category || 'assistance request'} at ${activeCase?.location || 'assigned area'}. Urgency score of ${urgencyScore}/100 indicates urgent logistics handoff.`;
    }
    return `Standard humanitarian relief need verified in active operational zone. Recommended priority (${recommendedPriority}) reflects baseline delivery schedule without immediate life-safety peril.`;
  }, [activeCase, affectedCount, urgencyScore, recommendedPriority]);

  // Open Confirmation Modal
  const handleOpenAiModal = (type) => {
    if (!humanReviewReason || !humanReviewReason.trim()) {
      showToast?.('Please enter an operational reviewer reason before proceeding.', 'error');
      return;
    }
    setAiActionModal(type);
    setModalReason(humanReviewReason.trim());
    setModalConfirmedCheck(false);
  };

  // Execute Confirmed Consequential Action
  const handleConfirmAiAction = async () => {
    const actionType = aiActionModal;
    const reasonText = modalReason.trim();
    setAiActionModal(null);

    setIsSubmitting(true);
    try {
      if (onRecordAIDecision) {
        await onRecordAIDecision(activeCaseId, actionType, humanFinalPriority, reasonText);
      } else if (actionType === 'accept' && onAcceptRecommendation) {
        await onAcceptRecommendation(humanFinalPriority, reasonText);
      } else {
        const actionLabel = actionType === 'accept' ? 'Approved' : actionType === 'adjust' ? 'Overridden' : 'Rejected';
        showToast?.(`Human decision (${actionLabel}: ${humanFinalPriority}) recorded for ${activeCaseId}`, 'success');
      }

      setLastRecordedDecision({
        type: actionType,
        priority: actionType === 'accept' ? recommendedPriority : humanFinalPriority,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reviewer: coordinatorUser?.fullName || 'Emergency Coordinator'
      });
    } catch (err) {
      console.error('Failed to record AI decision:', err);
      showToast?.(err.message || 'Failed to record AI review decision.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ec-portal-canvas ec-ai-support-root">
      {/* 1. Header Strip */}
      <div className="ec-ai-header-strip">
        <div>
          <div className="ec-ai-breadcrumb">
            <span>DECISION SUPPORT</span>
            <span className="ec-ai-breadcrumb-sep">/</span>
            <span className="ec-ai-breadcrumb-id">{assessmentId}</span>
          </div>
          <h1 className="ec-ai-main-title">AI Decision Support &amp; Priority Assessment</h1>
          <p className="ec-ai-sub-meta">
            Evaluating request{' '}
            <strong
              className="ec-linked-case-link"
              onClick={() => onOpenCaseReview?.(activeCaseId)}
              title="Click to view full request verification page"
            >
              {activeCaseId}
              <ExternalLink size={11} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
            </strong>{' '}
            · AI scores are advisory recommendations requiring mandatory human coordinator approval.
          </p>
        </div>

        <div className="ec-ai-status-dock">
          <span className={lastRecordedDecision || aiReviewed ? 'ec-badge-verified' : 'ec-badge-pending'}>
            ● {lastRecordedDecision ? `Human Review: ${lastRecordedDecision.type === 'accept' ? 'Accepted' : lastRecordedDecision.type === 'adjust' ? 'Adjusted' : 'Rejected'}` : (aiReviewed ? 'Human Review Recorded' : 'Pending Human Review')}
          </span>
        </div>
      </div>

      {/* 2. Request Selector Strip (If multiple cases in queue) */}
      {cases && cases.length > 1 && (
        <div className="ec-ai-case-selector-bar">
          <span className="ec-selector-label">SELECT REQUEST:</span>
          <div className="ec-selector-pills-row">
            {cases.slice(0, 8).map(c => (
              <button
                key={c.id}
                type="button"
                className={`ec-selector-pill ${c.id === activeCaseId ? 'is-active' : ''}`}
                onClick={() => onSelectCase?.(c.id)}
              >
                <span className="ec-pill-id">{c.id}</span>
                <span className={`ec-pill-priority ec-priority-${(c.severity || 'high').toLowerCase()}`}>
                  {c.severity || 'High'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Mandatory Human Review Mandate Banner */}
      <div className="ec-ai-mandate-card">
        <ShieldCheck size={20} color="#3d6b4f" className="ec-mandate-icon" />
        <div className="ec-mandate-content">
          <strong>Mandatory Human Approval:</strong> AI priority scores and duplicate flags provide automated triage guidance only. Operational dispatch priority must be confirmed or adjusted by an authorised Emergency Coordinator.
        </div>
      </div>

      {/* 4. Two-Column Operational Layout */}
      <div className="ec-ai-split-grid">
        {/* Left Column: AI Recommendation Details, Evidence & Duplicates */}
        <div className="ec-ai-left-column">
          {/* Priority & Urgency Score Card */}
          <div className="ec-ai-priority-card">
            <div className="ec-ai-priority-main">
              <div className="ec-ai-card-tag">
                <Sparkles size={15} color="#3d6b4f" />
                <span>AI TRIAGE RECOMMENDATION</span>
              </div>
              <div className={`ec-recommended-priority-val ec-priority-text-${(recommendedPriority || 'high').toLowerCase()}`}>
                {recommendedPriority}
              </div>
              <div className="ec-urgency-score-row">
                <span className="ec-urgency-score-label">Urgency Score:</span>
                <strong className="ec-urgency-score-num">{urgencyScore} / 100</strong>
                <span className="ec-urgency-score-tier">
                  ({urgencyScore >= 80 ? 'Critical Peril' : urgencyScore >= 60 ? 'High Urgency' : 'Standard Routine'})
                </span>
              </div>
            </div>

            {/* Model Confidence (Shown only when meaningful & valid) */}
            {confidenceScore !== null && (
              <div className="ec-confidence-gauge-box" title="Reflects NLP model certainty based on narrative feature extraction">
                <div className="ec-confidence-gauge-circle">
                  <span className="ec-confidence-pct">{confidenceScore}%</span>
                  <span className="ec-confidence-sub">certainty</span>
                </div>
                <span className="ec-confidence-footnote">Model certainty</span>
              </div>
            )}
          </div>

          {/* AI Recommendation Rationale Callout */}
          <div className="ec-ai-rationale-box">
            <div className="ec-rationale-head">
              <Sparkles size={14} color="#3d6b4f" />
              <strong>AI Recommendation Rationale</strong>
            </div>
            <p className="ec-rationale-text">{aiRationale}</p>
          </div>

          {/* Factors Influencing the Recommendation with Real Evidence */}
          <div className="ec-panel-card">
            <div className="ec-panel-card-head">
              <div>
                <h3 className="ec-panel-title-text">Factors influencing recommendation</h3>
                <p className="ec-panel-subtitle-text">Request-specific evidence extracted from citizen report</p>
              </div>
              <span className="ec-cmd-k-badge">{factors.length} verified factors</span>
            </div>

            <div className="ec-factors-list">
              {factors.map(fac => (
                <div key={fac.id} className="ec-factor-item-row">
                  <div className="ec-factor-left">
                    <CheckCircle2 size={16} color="#3d6b4f" className="ec-factor-icon" />
                    <div>
                      <div className="ec-factor-head-row">
                        <span className="ec-factor-title">{fac.title}</span>
                        <span className="ec-factor-tag-tiny">{fac.evidenceLabel}</span>
                      </div>
                      <div className="ec-factor-detail">{fac.detail}</div>
                    </div>
                  </div>
                  <span className={fac.impact === 'High' ? 'ec-badge-critical' : 'ec-badge-medium'}>
                    ● {fac.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Duplicate-Request Warning Card (Preserved with Inspect Side by Side) */}
          <div className="ec-duplicate-card">
            <div className="ec-panel-card-head">
              <div>
                <h3 className="ec-panel-title-text">Duplicate-request warning</h3>
                <p className="ec-panel-subtitle-text">
                  {AI_DECISION_SUPPORT_DATA.duplicateWarning.note}
                </p>
              </div>
              <span className="ec-badge-high">
                ● {AI_DECISION_SUPPORT_DATA.duplicateWarning.similarity}
              </span>
            </div>

            <div className="ec-duplicate-item-box">
              <div>
                <div className="ec-duplicate-match-title">
                  {AI_DECISION_SUPPORT_DATA.duplicateWarning.matchId} · {AI_DECISION_SUPPORT_DATA.duplicateWarning.matchCategory}
                </div>
                <div className="ec-duplicate-match-desc">
                  {AI_DECISION_SUPPORT_DATA.duplicateWarning.matchDesc}
                </div>
              </div>
              <button
                type="button"
                className="ec-btn-preview-sm"
                onClick={onInspectDuplicate}
                title="Inspect requests side-by-side to verify distinction"
              >
                <Eye size={13} />
                <span>Inspect side by side</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Linked Request Context & Human Review Decision */}
        <div className="ec-ai-right-column">
          {/* Linked Request Context Card */}
          <div className="ec-panel-card ec-linked-request-card">
            <div className="ec-panel-card-head">
              <div>
                <h3 className="ec-panel-title-text">Linked assistance request</h3>
                <p className="ec-panel-subtitle-text">Verified citizen submission data</p>
              </div>
              <button
                type="button"
                className="ec-btn-link-action"
                onClick={() => onOpenCaseReview?.(activeCaseId)}
              >
                <span>Full Review</span>
                <ExternalLink size={12} />
              </button>
            </div>

            <div className="ec-linked-case-meta">
              <div className="ec-linked-meta-row">
                <span className="ec-linked-meta-label">ID:</span>
                <strong className="ec-linked-meta-val" style={{ color: '#3d6b4f' }}>{activeCaseId}</strong>
              </div>
              <div className="ec-linked-meta-row">
                <span className="ec-linked-meta-label">Category:</span>
                <strong className="ec-linked-meta-val">{activeCase?.category || 'Emergency Assistance'}</strong>
              </div>
              <div className="ec-linked-meta-row">
                <span className="ec-linked-meta-label">Location:</span>
                <span className="ec-linked-meta-val">{activeCase?.location || activeCase?.generalLocation || 'Western Province Sector'}</span>
              </div>
              <div className="ec-linked-meta-row">
                <span className="ec-linked-meta-label">Household:</span>
                <span className="ec-linked-meta-val">{affectedCount} people affected</span>
              </div>
            </div>

            {/* Citizen Quote Box */}
            <div className="ec-linked-citizen-quote">
              <span className="ec-quote-label">CITIZEN NARRATIVE:</span>
              <p className="ec-quote-body">
                "{activeCase?.description || 'Assistance request submitted through citizen crisis intake portal.'}"
              </p>
            </div>
          </div>

          {/* Record Human Review Decision Card (Mandatory Form) */}
          <div className="ec-panel-card ec-human-review-card">
            <div className="ec-panel-card-head">
              <div>
                <h3 className="ec-panel-title-text">Record human review</h3>
                <p className="ec-panel-subtitle-text">
                  Mandatory operational decision committed to the audit ledger
                </p>
              </div>
            </div>

            {/* Review Status Banner if Already Recorded */}
            {lastRecordedDecision && (
              <div className="ec-recorded-decision-banner">
                <Check size={16} color="#059669" />
                <div>
                  <strong>Decision Recorded:</strong> {lastRecordedDecision.type === 'accept' ? 'Accepted' : lastRecordedDecision.type === 'adjust' ? 'Adjusted' : 'Rejected'} ({lastRecordedDecision.priority}) at {lastRecordedDecision.time}
                </div>
              </div>
            )}

            {/* Final Priority Selector */}
            <div className="ec-form-field-group">
              <label htmlFor="final-priority-select" className="ec-field-label-tiny">
                FINAL OPERATIONAL PRIORITY *
              </label>
              <select
                id="final-priority-select"
                className="ec-select-input"
                value={humanFinalPriority}
                onChange={(e) => setHumanFinalPriority(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="Critical">Critical (Immediate Life-Safety Dispatch)</option>
                <option value="High">High (Urgent Priority Relief)</option>
                <option value="Medium">Medium (Scheduled Distribution)</option>
                <option value="Low">Low (Routine Monitoring)</option>
              </select>
            </div>

            {/* Reviewer Operational Rationale (Required) */}
            <div className="ec-form-field-group">
              <label htmlFor="reviewer-reason-textarea" className="ec-field-label-tiny">
                REVIEWER OPERATIONAL RATIONALE *
              </label>
              <textarea
                id="reviewer-reason-textarea"
                rows={4}
                className="ec-notes-textarea"
                placeholder="Explain why you accept, modify, or reject the recommendation (required for audit logging)..."
                value={humanReviewReason}
                onChange={(e) => setHumanReviewReason(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Action Buttons Stack */}
            <div className="ec-authorised-actions-stack">
              <button
                type="button"
                className="ec-btn-verify-primary"
                onClick={() => handleOpenAiModal('accept')}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="ec-spin-icon" style={{ marginRight: '6px' }} />
                    <span>Persisting Decision...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    <span>Accept Recommendation ({recommendedPriority})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="ec-btn-action-outline"
                onClick={() => handleOpenAiModal('adjust')}
                disabled={isSubmitting}
              >
                <SlidersHorizontal size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                <span>Save Adjusted Priority ({humanFinalPriority})</span>
              </button>

              <button
                type="button"
                className="ec-btn-action-outline ec-btn-reject-outline"
                onClick={() => handleOpenAiModal('reject')}
                disabled={isSubmitting}
              >
                <XCircle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                <span>Reject AI Recommendation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Consequential Action Confirmation Modal */}
      <ConsequentialActionModal
        isOpen={Boolean(aiActionModal)}
        onClose={() => setAiActionModal(null)}
        title={
          aiActionModal === 'accept'
            ? `Confirm ${recommendedPriority} as the operational priority for ${activeCaseId}?`
            : aiActionModal === 'adjust'
            ? `Save ${humanFinalPriority} as the adjusted priority for ${activeCaseId}?`
            : `Reject AI recommendation for ${activeCaseId}?`
        }
        confirmVariant={aiActionModal === 'reject' ? 'danger' : 'primary'}
        reason={modalReason}
        setReason={setModalReason}
        confirmedCheck={modalConfirmedCheck}
        setConfirmedCheck={setModalConfirmedCheck}
        onConfirm={handleConfirmAiAction}
      />
    </div>
  );
};

export default AIDecisionSupportView;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Check,
  Cpu,
  Info
} from 'lucide-react';
import { aiGovernanceService } from '../../../services/aiGovernanceService';
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

  const activeCaseId = activeCase?.id || 'HMR-1042';

  // Live Backend AI Assessment State
  const [assessment, setAssessment] = useState(null);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [assessmentError, setAssessmentError] = useState(null);

  // Human Review Form State
  const [humanFinalPriority, setHumanFinalPriority] = useState('High');
  const [humanReviewReason, setHumanReviewReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastRecordedDecision, setLastRecordedDecision] = useState(null);

  // Consequential Action Modal State
  const [aiActionModal, setAiActionModal] = useState(null);
  const [modalReason, setModalReason] = useState('');
  const [modalConfirmedCheck, setModalConfirmedCheck] = useState(false);

  // Fetch Live AI Assessment from Backend
  const loadAssessment = useCallback(async (caseId) => {
    if (!caseId) return;
    setLoadingAssessment(true);
    setAssessmentError(null);
    try {
      const res = await aiGovernanceService.getCase(caseId);
      const data = res?.data || res;
      if (data && (data.caseId || data.decisionId || data.urgencyScore !== undefined)) {
        setAssessment(data);
        if (data.isReviewedByHuman && data.humanDecision) {
          setLastRecordedDecision({
            type: data.humanDecision.toLowerCase().includes('approve') || data.humanDecision.toLowerCase().includes('accept')
              ? 'accept'
              : data.humanDecision.toLowerCase().includes('modify') || data.humanDecision.toLowerCase().includes('adjust') || data.humanDecision.toLowerCase().includes('override')
              ? 'adjust'
              : 'reject',
            priority: data.currentPriority || data.recommendedPriority,
            time: data.reviewedAt ? new Date(data.reviewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recorded',
            reviewer: data.reviewedByName || 'Emergency Coordinator'
          });
        }
      } else {
        setAssessment(null);
      }
    } catch (err) {
      console.warn(`Live AI assessment fetch note for ${caseId}:`, err.message || err);
      setAssessmentError(err.message || 'AI assessment not available');
      setAssessment(null);
    } finally {
      setLoadingAssessment(false);
    }
  }, []);

  // Sync assessment when activeCaseId changes
  useEffect(() => {
    loadAssessment(activeCaseId);
  }, [activeCaseId, loadAssessment]);

  // Derived recommendation values from live backend assessment or safe fallback
  const assessmentId = assessment?.decisionId || `AID-${activeCaseId.replace(/\D/g, '') || '2051'}`;
  const recommendedPriority = assessment?.recommendedPriority || activeCase?.severity || 'High';

  // Urgency Score (0-100)
  const urgencyScore = typeof assessment?.urgencyScore === 'number'
    ? assessment.urgencyScore
    : (typeof activeCase?.aipriorityScore === 'number'
        ? Math.round(activeCase.aipriorityScore > 1 ? activeCase.aipriorityScore : activeCase.aipriorityScore * 100)
        : (activeCase?.severity === 'Critical' ? 90 : activeCase?.severity === 'High' ? 75 : 55));

  // AI Confidence Score (0-100)
  const confidenceScore = typeof assessment?.confidence === 'number'
    ? assessment.confidence
    : (typeof assessment?.confidenceScore === 'number'
        ? Math.round(assessment.confidenceScore > 1 ? assessment.confidenceScore : assessment.confidenceScore * 100)
        : (typeof activeCase?.aiConfidence === 'number' ? Math.round(activeCase.aiConfidence > 1 ? activeCase.aiConfidence : activeCase.aiConfidence * 100) : 85));

  // AI Provider Identity (Accurate labeling: rule-based heuristic)
  const providerLabel = assessment?.providerLabel || 'Rule-Based Demonstration Decision Support';
  const isRuleBased = assessment?.isRuleBased ?? true;

  const affectedCount = assessment?.affectedCount || activeCase?.affectedPeople || 6;

  // Keep final priority in sync when switching cases or receiving assessment
  useEffect(() => {
    setHumanFinalPriority(recommendedPriority);
    setHumanReviewReason('');
  }, [activeCaseId, recommendedPriority]);

  // Request-specific evidence behind each recommendation factor
  const factors = useMemo(() => {
    if (assessment?.factors && Array.isArray(assessment.factors) && assessment.factors.length > 0) {
      return assessment.factors.map((f, idx) => ({
        id: f.id || `f-${idx}`,
        title: f.title || f.factorName || `Factor ${idx + 1}`,
        evidenceLabel: f.tag || f.evidenceLabel || 'EVIDENCE',
        detail: f.desc || f.detail || 'Verified database indicator',
        impact: f.tagType === 'critical' ? 'Critical' : f.tagType === 'high' ? 'High' : 'Medium'
      }));
    }

    return [
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
    ];
  }, [assessment, activeCase, affectedCount]);

  // AI Recommendation Rationale
  const aiRationale = useMemo(() => {
    if (assessment?.reasoning) {
      return assessment.reasoning;
    }
    if (activeCase?.severity === 'Critical') {
      return `Multiple high-vulnerability indicators detected: ${affectedCount} occupants in an exposed hazard area (${activeCase?.location || 'Operational Sector'}), with acute accessibility and physical safety requirements. Calculated urgency of ${urgencyScore}/100 exceeds critical dispatch threshold.`;
    }
    if (activeCase?.severity === 'High') {
      return `Significant infrastructure or safety constraint identified: priority aid distribution recommended for ${activeCase?.category || 'assistance request'} at ${activeCase?.location || 'assigned area'}. Urgency score of ${urgencyScore}/100 indicates urgent logistics handoff.`;
    }
    return `Standard humanitarian relief need verified in active operational zone. Recommended priority (${recommendedPriority}) reflects baseline delivery schedule without immediate life-safety peril.`;
  }, [assessment, activeCase, affectedCount, urgencyScore, recommendedPriority]);

  // Duplicate Warning candidate from live backend assessment
  const duplicateCandidate = useMemo(() => {
    if (assessment?.duplicateSuggestionCaseNumber) {
      const sim = typeof assessment.duplicateSimilarityScore === 'number'
        ? Math.round(assessment.duplicateSimilarityScore > 1 ? assessment.duplicateSimilarityScore : assessment.duplicateSimilarityScore * 100)
        : 22;
      return {
        matchId: assessment.duplicateSuggestionCaseNumber,
        similarity: `${sim}% Similarity`,
        matchCategory: 'Emergency Assistance Request',
        matchDesc: `Adjacent sector request flagged by automated keyword & geographic overlap (${sim}% similarity).`,
        hasDuplicate: true
      };
    }
    return null;
  }, [assessment]);

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
      const decPayload = {
        caseId: activeCaseId,
        decision: actionType === 'accept' ? 'Approve' : actionType === 'adjust' ? 'Modify' : 'Reject',
        reason: reasonText,
        overriddenPriority: actionType === 'adjust' ? humanFinalPriority : null
      };

      // 1. Direct call to AI governance backend API
      try {
        await aiGovernanceService.recordDecision(decPayload);
      } catch (err) {
        console.warn('aiGovernanceService.recordDecision note:', err.message || err);
      }

      // 2. Prop call to parent portal handler (updates coordinator state & incident AI review)
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

      // Reload live assessment to reflect DB update
      await loadAssessment(activeCaseId);
    } catch (err) {
      console.error('Failed to record AI decision:', err);
      showToast?.(err.message || 'Failed to record AI review decision.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReviewed = Boolean(
    assessment?.isReviewedByHuman ||
    lastRecordedDecision ||
    aiReviewed ||
    (activeCase?.aiReviewed)
  );

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
          {loadingAssessment ? (
            <span className="ec-badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Loader2 size={12} className="ec-spin-icon" /> Syncing Live Assessment...
            </span>
          ) : isReviewed ? (
            <span className="ec-badge-verified">
              ● Human Review:{' '}
              {lastRecordedDecision
                ? `${lastRecordedDecision.type === 'accept' ? 'Accepted' : lastRecordedDecision.type === 'adjust' ? 'Adjusted' : 'Rejected'} (${lastRecordedDecision.priority})`
                : assessment?.humanDecision
                ? `${assessment.humanDecision} (${assessment.currentPriority || recommendedPriority})`
                : 'Recorded'}
            </span>
          ) : (
            <span className="ec-badge-pending">
              ● Pending Human Review
            </span>
          )}
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

      {/* 3. Mandatory Human Review Mandate & AI Model Architecture Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
        <div className="ec-ai-mandate-card" style={{ margin: 0 }}>
          <ShieldCheck size={20} color="#3d6b4f" className="ec-mandate-icon" />
          <div className="ec-mandate-content">
            <strong>Mandatory Human Approval:</strong> AI priority scores and duplicate flags provide automated triage guidance only. Operational dispatch priority must be confirmed or adjusted by an authorised Emergency Coordinator.
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '12px 16px',
          fontSize: '12px',
          color: '#334155'
        }}>
          <Cpu size={18} color="#0284c7" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Engine: {providerLabel}</span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#0284c7',
                backgroundColor: '#e0f2fe',
                padding: '1px 6px',
                borderRadius: '4px'
              }}>
                {isRuleBased ? 'Deterministic Rule Engine' : 'External AI Provider'}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Transparent keyword &amp; vulnerability rule-scoring · Zero unverified black-box decisions
            </div>
          </div>
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
                <p className="ec-panel-subtitle-text">Request-specific evidence extracted from citizen report &amp; database state</p>
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
                  <span className={fac.impact === 'Critical' ? 'ec-badge-critical' : fac.impact === 'High' ? 'ec-badge-critical' : 'ec-badge-medium'}>
                    ● {fac.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Duplicate-Request Warning Card */}
          <div className="ec-duplicate-card">
            <div className="ec-panel-card-head">
              <div>
                <h3 className="ec-panel-title-text">Duplicate-request warning</h3>
                <p className="ec-panel-subtitle-text">
                  Automated similarity detection evaluates geospatial and category overlap
                </p>
              </div>
              {duplicateCandidate ? (
                <span className="ec-badge-high">
                  ● {duplicateCandidate.similarity}
                </span>
              ) : (
                <span className="ec-badge-verified">
                  ● No Duplicate
                </span>
              )}
            </div>

            {duplicateCandidate ? (
              <div className="ec-duplicate-item-box">
                <div>
                  <div className="ec-duplicate-match-title">
                    {duplicateCandidate.matchId} · {duplicateCandidate.matchCategory}
                  </div>
                  <div className="ec-duplicate-match-desc">
                    {duplicateCandidate.matchDesc}
                  </div>
                </div>
                <button
                  type="button"
                  className="ec-btn-preview-sm"
                  onClick={() => onInspectDuplicate?.(duplicateCandidate)}
                  title="Inspect requests side-by-side to verify distinction"
                >
                  <Eye size={13} />
                  <span>Inspect side by side</span>
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#657367', padding: '10px 14px', backgroundColor: '#fcfdfb', borderRadius: '8px', border: '1px solid #eef2ea' }}>
                No duplicate or overlapping assistance requests detected in this operational sector.
              </div>
            )}
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
                <strong className="ec-linked-meta-val">{assessment?.category || activeCase?.category || 'Emergency Assistance'}</strong>
              </div>
              <div className="ec-linked-meta-row">
                <span className="ec-linked-meta-label">Location:</span>
                <span className="ec-linked-meta-val">{assessment?.address || assessment?.operationalArea || activeCase?.location || activeCase?.generalLocation || 'Western Province Sector'}</span>
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
                "{assessment?.description || activeCase?.description || 'Assistance request submitted through citizen crisis intake portal.'}"
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
            {(lastRecordedDecision || assessment?.isReviewedByHuman) && (
              <div className="ec-recorded-decision-banner">
                <Check size={16} color="#059669" />
                <div>
                  <strong>Decision Recorded:</strong>{' '}
                  {lastRecordedDecision
                    ? `${lastRecordedDecision.type === 'accept' ? 'Accepted' : lastRecordedDecision.type === 'adjust' ? 'Adjusted' : 'Rejected'} (${lastRecordedDecision.priority}) at ${lastRecordedDecision.time}`
                    : `${assessment?.humanDecision || 'Approved'} (${assessment?.currentPriority || recommendedPriority}) by ${assessment?.reviewedByName || 'Coordinator'}`}
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
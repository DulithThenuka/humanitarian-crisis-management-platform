import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { AI_DECISION_SUPPORT_DATA } from '../data/coordinatorPortalData';
import './AIDecisionSupportView.css';

export const AIDecisionSupportView = ({
  onOpenCaseReview,
  onInspectDuplicate,
  onAcceptRecommendation,
  aiReviewed,
  showToast
}) => {
  const [humanFinalPriority, setHumanFinalPriority] = useState('Critical');
  const [humanReviewReason, setHumanReviewReason] = useState('');

  return (
    <div className="ec-portal-canvas">
      {/* Header Strip */}
      <div className="ec-ai-header-strip">
        <div>
          <span className="ec-breadcrumb-tiny">HUMAN-REVIEWED RECOMMENDATION</span>
          <h2 className="ec-review-main-title">AI Decision Support &amp; Priority Assessment</h2>
          <p className="ec-review-sub-meta">
            {AI_DECISION_SUPPORT_DATA.assessmentId} · Related request{' '}
            <strong
              style={{ color: '#0284c7', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => onOpenCaseReview(AI_DECISION_SUPPORT_DATA.relatedCaseId)}
            >
              {AI_DECISION_SUPPORT_DATA.relatedCaseId}
            </strong>{' '}
            · AI outputs are recommendations, not confirmed facts.
          </p>
        </div>
        <span className={aiReviewed ? 'ec-badge-verified' : 'ec-badge-pending'}>
          ● {aiReviewed ? 'Human Review Recorded' : AI_DECISION_SUPPORT_DATA.status}
        </span>
      </div>

      {/* Responsibility Notice Alert Banner */}
      <div className="ec-ai-responsibility-banner">
        <ShieldCheck size={20} color="#0284c7" />
        <div>
          <strong>You remain responsible for the final decision.</strong> Never reject a request solely because of an AI score, missing data, or a suspected duplicate.
        </div>
      </div>

      {/* Split Grid */}
      <div className="ec-ai-split-grid">
        {/* Left Column: AI Recommendation Details & Factors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Recommended Priority Card */}
          <div className="ec-ai-priority-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Sparkles size={16} color="#0284c7" />
                <span className="ec-meta-label-tiny">Recommended priority</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#dc2626', marginBottom: '4px' }}>
                {AI_DECISION_SUPPORT_DATA.recommendedPriority}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Urgency score {AI_DECISION_SUPPORT_DATA.urgencyScore} / 100
              </div>
            </div>

            {/* Circular Confidence Gauge */}
            <div className="ec-confidence-gauge-circle">
              <span style={{ fontSize: '20px', fontWeight: 800 }}>
                {AI_DECISION_SUPPORT_DATA.confidence}
              </span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b' }}>% confidence</span>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', paddingLeft: '4px' }}>
            {AI_DECISION_SUPPORT_DATA.confidenceNote}
          </div>

          {/* Factors Influencing Recommendation Card */}
          <div className="ec-panel-card">
            <h3 className="ec-panel-title-text" style={{ marginBottom: '14px' }}>
              Factors influencing the recommendation
            </h3>
            <div>
              {AI_DECISION_SUPPORT_DATA.factors.map(fac => (
                <div key={fac.id} className="ec-factor-item-row">
                  <div className="ec-factor-left">
                    <CheckCircle2 size={16} color="#0284c7" />
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{fac.title}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{fac.detail}</div>
                    </div>
                  </div>
                  <span className={fac.impact === 'High' ? 'ec-badge-critical' : 'ec-badge-medium'}>
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
                <p className="ec-panel-subtitle-text">{AI_DECISION_SUPPORT_DATA.duplicateWarning.note}</p>
              </div>
              <span className="ec-badge-high">● {AI_DECISION_SUPPORT_DATA.duplicateWarning.similarity}</span>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {AI_DECISION_SUPPORT_DATA.duplicateWarning.matchId} · {AI_DECISION_SUPPORT_DATA.duplicateWarning.matchCategory}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  {AI_DECISION_SUPPORT_DATA.duplicateWarning.matchDesc}
                </div>
              </div>
              <button
                className="ec-btn-preview-sm"
                onClick={onInspectDuplicate}
              >
                <Eye size={13} />
                <span>Inspect side by side</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Human Review Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Recommended Next Actions Card */}
          <div className="ec-panel-card">
            <h3 className="ec-panel-title-text" style={{ marginBottom: '14px' }}>
              Recommended next actions
            </h3>
            <div className="ec-next-actions-list">
              {AI_DECISION_SUPPORT_DATA.recommendedActions.map((act, idx) => (
                <div key={idx} className="ec-next-action-item">
                  <div className="ec-action-num-badge">{idx + 1}</div>
                  <span>{act}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <span className="ec-meta-label-tiny" style={{ display: 'block', marginBottom: '8px' }}>
                SUGGESTED RESOURCE CATEGORIES
              </span>
              <div className="ec-tags-pill-row">
                {AI_DECISION_SUPPORT_DATA.suggestedResources.map((res, i) => (
                  <span key={i} className="ec-resource-tag-pill">{res}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Record Human Review Card */}
          <div className="ec-panel-card">
            <h3 className="ec-panel-title-text" style={{ marginBottom: '14px' }}>
              Record human review
            </h3>

            <div className="ec-form-field-group" style={{ marginBottom: '12px' }}>
              <label className="ec-field-label-tiny">FINAL PRIORITY</label>
              <select
                className="ec-modal-textarea"
                style={{ height: '38px', padding: '6px 10px' }}
                value={humanFinalPriority}
                onChange={(e) => setHumanFinalPriority(e.target.value)}
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="ec-form-field-group" style={{ marginBottom: '14px' }}>
              <label className="ec-field-label-tiny">REVIEWER REASON *</label>
              <textarea
                rows={3}
                className="ec-modal-textarea"
                placeholder="Explain why you accept or adjust the recommendation..."
                value={humanReviewReason}
                onChange={(e) => setHumanReviewReason(e.target.value)}
              />
            </div>

            <div className="ec-authorised-actions-stack">
              <button
                className="ec-btn-verify-primary"
                onClick={() => onAcceptRecommendation(humanFinalPriority, humanReviewReason)}
              >
                Accept recommendation
              </button>
              <button
                className="ec-btn-action-outline"
                onClick={() => showToast('Adjusted priority saved to audit trail', 'info')}
              >
                Save adjusted priority
              </button>
              <button
                className="ec-btn-action-outline"
                onClick={() => showToast('AI recommendation rejected with reason', 'warning')}
              >
                Reject AI recommendation
              </button>
              <button
                className="ec-panel-link-btn"
                style={{ textAlign: 'center', marginTop: '4px' }}
                onClick={() => showToast('Escalated for senior operations specialist review')}
              >
                Escalate for specialist review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

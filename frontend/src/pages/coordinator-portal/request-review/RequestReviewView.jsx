import React from 'react';
import {
  ChevronLeft,
  Home,
  FileText,
  Eye,
  AlertTriangle,
  Plus
} from 'lucide-react';
import './RequestReviewView.css';

export const RequestReviewView = ({
  currentCase,
  onBackToRequests,
  onToggleChecklist,
  newNoteText,
  setNewNoteText,
  onAddNote,
  onOpenVerifyModal,
  onPreviewAttachment,
  onReviewAIRecommendation,
  showToast
}) => {
  return (
    <div className="ec-portal-canvas">
      {/* Header Subnav */}
      <div className="ec-review-header-nav">
        <button
          className="ec-back-link-btn"
          onClick={onBackToRequests}
        >
          <ChevronLeft size={14} />
          <span>Back to Assistance Requests</span>
        </button>
        <span className="ec-review-assigned-badge">
          {currentCase.id} · Assigned to you
        </span>
      </div>

      {/* Case Title Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">REQUEST REVIEW &amp; VERIFICATION</span>
          <h2 className="ec-review-main-title">{currentCase.title}</h2>
          <p className="ec-review-sub-meta">
            {currentCase.id} · Submitted {currentCase.submittedAt} · {currentCase.location}
          </p>
        </div>

        <div className="ec-review-badges-dock">
          <span className={currentCase.severity === 'Critical' ? 'ec-badge-critical' : 'ec-badge-high'}>
            ● {currentCase.severity}
          </span>
          <span className={currentCase.status === 'Verified' ? 'ec-badge-verified' : 'ec-badge-pending'}>
            ● {currentCase.status}
          </span>
        </div>
      </div>

      {/* Split Grid */}
      <div className="ec-review-split-grid">
        {/* Left Column: Request Details & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="ec-panel-card">
            <div className="ec-panel-card-head">
              <div>
                <h3 className="ec-panel-title-text">Request information</h3>
                <p className="ec-panel-subtitle-text">Citizen-provided information - access controlled</p>
              </div>
              <span className="ec-cmd-k-badge">{currentCase.attachmentsCount} attachments</span>
            </div>

            {/* Category Banner Box */}
            <div className="ec-category-banner-card">
              <div className="ec-category-icon-box">
                <Home size={20} />
              </div>
              <div>
                <h4 className="ec-cat-title">{currentCase.category}</h4>
                <p className="ec-cat-affected">{currentCase.affectedSummary}</p>
              </div>
            </div>

            {/* Highlight Quote Box */}
            <div className="ec-desc-callout-box">
              "{currentCase.description}"
            </div>

            {/* 4-column Metadata Quad Grid */}
            <div className="ec-meta-quad-grid">
              <div className="ec-meta-quad-item">
                <span className="ec-meta-label-tiny">GENERAL LOCATION</span>
                <span className="ec-meta-val-text">{currentCase.generalLocation}</span>
              </div>
              <div className="ec-meta-quad-item">
                <span className="ec-meta-label-tiny">ACCESSIBILITY</span>
                <span className="ec-meta-val-text">{currentCase.accessibility}</span>
              </div>
              <div className="ec-meta-quad-item">
                <span className="ec-meta-label-tiny">CONTACT VERIFIED</span>
                <span className="ec-meta-val-text" style={{ color: '#d97706' }}>
                  {currentCase.contactStatus}
                </span>
              </div>
              <div className="ec-meta-quad-item">
                <span className="ec-meta-label-tiny">EMERGENCY CONTEXT</span>
                <span className="ec-meta-val-text">{currentCase.emergencyContext}</span>
              </div>
            </div>

            {/* Attachment Card */}
            {currentCase.attachment && (
              <div className="ec-attachment-item-card">
                <div className="ec-attachment-left">
                  <FileText size={18} color="#0284c7" />
                  <div>
                    <div className="ec-attachment-name">{currentCase.attachment.fileName}</div>
                    <div className="ec-attachment-meta">
                      {currentCase.attachment.uploadType} · {currentCase.attachment.fileSize}
                    </div>
                  </div>
                </div>
                <button
                  className="ec-btn-preview-sm"
                  onClick={() => onPreviewAttachment(currentCase.attachment.previewUrl)}
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </button>
              </div>
            )}
          </div>

          {/* Request History Card */}
          <div className="ec-panel-card">
            <h3 className="ec-panel-title-text" style={{ marginBottom: '12px' }}>Request history</h3>
            <div className="ec-history-stepper-list">
              {currentCase.history.map((step, idx) => (
                <div key={idx} className="ec-history-step-row">
                  <span className="ec-step-time-lbl">{step.time}</span>
                  <div className="ec-step-bullet-dot" />
                  <div>
                    <div className="ec-step-title">{step.event}</div>
                    <div className="ec-step-actor">{step.actor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verification Checklist & Authorised Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Verification Checklist Card */}
          <div className="ec-panel-card">
            <h3 className="ec-panel-title-text" style={{ marginBottom: '4px' }}>Verification checklist</h3>
            <p className="ec-panel-subtitle-text" style={{ marginBottom: '12px' }}>
              Complete relevant checks before operational approval.
            </p>

            <div className="ec-checklist-stack">
              {currentCase.checklist.map(item => (
                <div
                  key={item.id}
                  className="ec-check-item-row"
                  onClick={() => onToggleChecklist(item.id)}
                >
                  <div className="ec-check-left">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}}
                      style={{ cursor: 'pointer', accentColor: '#0284c7' }}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.required && !item.checked && (
                    <span className="ec-pill-required-red">Required</span>
                  )}
                </div>
              ))}
            </div>

            {/* Missing information warning if required checklist unchecked */}
            {currentCase.checklist.some(c => c.required && !c.checked) && (
              <div className="ec-warning-callout-box">
                <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Missing information</strong>
                  <div>Contact confirmation and attachment review are still required.</div>
                </div>
              </div>
            )}

            {/* Internal Coordinator Notes Section */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <span className="ec-meta-label-tiny" style={{ display: 'block', marginBottom: '6px' }}>
                INTERNAL COORDINATOR NOTES
              </span>
              <textarea
                className="ec-notes-textarea"
                placeholder="Visible only to authorised operational staff..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
              />
              <button
                className="ec-btn-add-note"
                onClick={onAddNote}
              >
                <Plus size={13} />
                <span>Add note</span>
              </button>

              {/* Existing Notes Display */}
              {currentCase.notes && currentCase.notes.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentCase.notes.map(n => (
                    <div
                      key={n.id}
                      style={{
                        fontSize: '11px',
                        padding: '8px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '2px' }}>
                        <strong>{n.author}</strong>
                        <span>{n.time}</span>
                      </div>
                      <div style={{ color: '#0f172a' }}>{n.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Authorised Actions Stack */}
          <div className="ec-panel-card">
            <h3 className="ec-panel-title-text" style={{ marginBottom: '12px' }}>Authorised actions</h3>
            <div className="ec-authorised-actions-stack">
              <button
                className="ec-btn-verify-primary"
                onClick={onOpenVerifyModal}
              >
                Mark as verified
              </button>

              <button
                className="ec-btn-action-outline"
                onClick={() => {
                  showToast(`Information request sent to ${currentCase.requesterName || 'citizen'}`);
                }}
              >
                Request additional information
              </button>

              <button
                className="ec-btn-action-outline"
                onClick={() => {
                  showToast(`Priority escalated to Urgent Command`);
                }}
              >
                Escalate priority
              </button>

              <button
                className="ec-btn-action-outline"
                onClick={onReviewAIRecommendation}
              >
                Review AI recommendation
              </button>

              <button
                className="ec-btn-action-outline"
                onClick={() => {
                  showToast(`Request ${currentCase.id} flagged for field investigation`, 'warning');
                }}
              >
                Flag for investigation
              </button>

              <button
                className="ec-btn-reject-red"
                onClick={() => {
                  showToast(`Rejection rationale dialog opened for ${currentCase.id}`, 'error');
                }}
              >
                Reject with reason
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

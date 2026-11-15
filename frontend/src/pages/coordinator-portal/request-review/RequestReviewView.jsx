import React, { useState } from 'react';
import {
  ChevronLeft,
  Home,
  FileText,
  Eye,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { ConsequentialActionModal } from '../components/modals/ConsequentialActionModal';
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
  onEscalateRequest,
  onRequestInfo,
  onRejectRequest,
  showToast
}) => {
  const [activeModalType, setActiveModalType] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [actionConfirmedCheck, setActionConfirmedCheck] = useState(false);

  if (!currentCase) {
    return (
      <div className="ec-portal-canvas" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
        <p>No request selected for review.</p>
        <button className="ec-back-link-btn" onClick={onBackToRequests} style={{ margin: '16px auto' }}>
          <ChevronLeft size={14} />
          <span>Back to Assistance Requests</span>
        </button>
      </div>
    );
  }

  const handleOpenActionModal = (type) => {
    setActiveModalType(type);
    setActionReason('');
    setActionConfirmedCheck(false);
  };

  const handleConfirmAction = () => {
    if (activeModalType === 'verify') {
      onOpenVerifyModal?.();
    } else if (activeModalType === 'info') {
      if (!actionReason || !actionReason.trim()) {
        showToast?.('Please enter an information request message', 'error');
        return;
      }
      if (onRequestInfo) {
        onRequestInfo(currentCase.id, actionReason.trim());
      } else {
        showToast(`Additional information requested for ${currentCase.id}. Status updated.`, 'success');
      }
    } else if (activeModalType === 'escalate') {
      if (onEscalateRequest) {
        onEscalateRequest(currentCase.id, actionReason);
      } else {
        showToast(`Operational priority for ${currentCase.id} escalated to Critical Emergency Command`, 'warning');
      }
    } else if (activeModalType === 'investigate') {
      showToast(`Request ${currentCase.id} flagged for authorised field investigation`, 'warning');
    } else if (activeModalType === 'reject') {
      if (onRejectRequest) {
        onRejectRequest(currentCase.id, actionReason);
      } else {
        showToast(`Request ${currentCase.id} rejected with logged operational rationale`, 'error');
      }
    }
    setActiveModalType(null);
  };

  // Safe fallbacks for data
  const caseHistory = (currentCase.history && Array.isArray(currentCase.history) && currentCase.history.length > 0)
    ? currentCase.history
    : [
        {
          time: currentCase.submittedAt || 'Today',
          event: `Assistance request submitted by ${currentCase.callerName || 'Citizen'}`,
          actor: 'Citizen Portal / Dispatch'
        },
        {
          time: 'AI Assessment',
          event: `Automated triage assigned ${currentCase.severity || 'High'} urgency rating`,
          actor: 'AI Risk Engine'
        },
        ...(currentCase.status === 'Verified' ? [{
          time: 'Current',
          event: 'Request marked as verified by Emergency Coordinator',
          actor: 'Emergency Coordinator'
        }] : []),
        ...(currentCase.status === 'Need information' || currentCase.verificationStatus === 'More Information Required' ? [{
          time: 'Current',
          event: 'Additional information requested from citizen by Emergency Coordinator',
          actor: 'Emergency Coordinator'
        }] : [])
      ];

  const caseChecklist = (currentCase.checklist && Array.isArray(currentCase.checklist) && currentCase.checklist.length > 0)
    ? currentCase.checklist
    : [
        { id: 'chk-1', label: 'Citizen contact verified', checked: currentCase.status === 'Verified', required: true },
        { id: 'chk-2', label: 'Location verified on map', checked: Boolean(currentCase.lat), required: true },
        { id: 'chk-3', label: 'No direct duplicate found', checked: true, required: false },
        { id: 'chk-4', label: 'Resource availability confirmed', checked: false, required: false }
      ];

  const caseNotes = (currentCase.notes && Array.isArray(currentCase.notes)) ? currentCase.notes : [];

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
          <h2 className="ec-review-main-title">{currentCase.title || 'Emergency Case'}</h2>
          <p className="ec-review-sub-meta">
            {currentCase.id} · Submitted {currentCase.submittedAt || 'Recent'} · {currentCase.location || 'Operational Area'}
          </p>
        </div>

        <div className="ec-review-badges-dock">
          <span className={currentCase.severity === 'Critical' ? 'ec-badge-critical' : 'ec-badge-high'}>
            ● {currentCase.severity || 'High'}
          </span>
          <span className={
            currentCase.status === 'Verified' || currentCase.verificationStatus === 'Verified' ? 'ec-badge-verified' :
            (currentCase.status === 'Need information' || currentCase.verificationStatus === 'More Information Required' || currentCase.verificationStatus === 'Information Requested') ? 'ec-badge-info' :
            'ec-badge-pending'
          }>
            ● {currentCase.verificationStatus === 'More Information Required' ? 'More information required' : (currentCase.verificationStatus || currentCase.status || 'Pending review')}
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
              <span className="ec-cmd-k-badge">{currentCase.attachmentsCount ?? (currentCase.attachment ? 1 : 0)} attachments</span>
            </div>

            {/* Category Banner Box */}
            <div className="ec-category-banner-card">
              <div className="ec-category-icon-box">
                <Home size={20} />
              </div>
              <div>
                <h4 className="ec-cat-title">{currentCase.category || 'Emergency Assistance'}</h4>
                <p className="ec-cat-affected">{currentCase.affectedSummary || `${currentCase.callerName || 'Citizen'} · Urgent assistance required`}</p>
              </div>
            </div>

            {/* Highlight Quote Box */}
            <div className="ec-desc-callout-box">
              "{currentCase.description || 'Assistance request logged in crisis platform.'}"
            </div>

            {/* 4-column Metadata Quad Grid */}
            <div className="ec-meta-quad-grid">
              <div className="ec-meta-quad-item">
                <span className="ec-meta-label-tiny">GENERAL LOCATION</span>
                <span className="ec-meta-val-text">{currentCase.generalLocation || currentCase.location || 'Western Province'}</span>
              </div>
              <div className="ec-meta-quad-item">
                <span className="ec-meta-label-tiny">ACCESSIBILITY</span>
                <span className="ec-meta-val-text">{currentCase.accessibility || 'Standard access / Ground route'}</span>
              </div>
              <div className="ec-meta-quad-item">
                <span className="ec-meta-label-tiny">CONTACT VERIFIED</span>
                <span className="ec-meta-val-text" style={{ color: '#d97706' }}>
                  {currentCase.contactStatus || (currentCase.callerPhone ? `Verified (${currentCase.callerPhone})` : 'Pending contact verification')}
                </span>
              </div>
              <div className="ec-meta-quad-item">
                <span className="ec-meta-label-tiny">EMERGENCY CONTEXT</span>
                <span className="ec-meta-val-text">{currentCase.emergencyContext || currentCase.operationalArea || 'Active response'}</span>
              </div>
            </div>

            {/* Attachment Card */}
            {(currentCase.attachment || currentCase.attachmentUrl) && (
              <div className="ec-attachment-item-card">
                <div className="ec-attachment-left">
                  <FileText size={18} color="#0284c7" />
                  <div>
                    <div className="ec-attachment-name">{currentCase.attachment?.fileName || 'Incident_Report_Attachment.pdf'}</div>
                    <div className="ec-attachment-meta">
                      {currentCase.attachment?.uploadType || 'Citizen Field Document'} · {currentCase.attachment?.fileSize || '1.2 MB'}
                    </div>
                  </div>
                </div>
                <button
                  className="ec-btn-preview-sm"
                  onClick={() => onPreviewAttachment(currentCase.attachment?.previewUrl || currentCase.attachmentUrl)}
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </button>
              </div>
            )}

            {/* Citizen Information Requests & Communications */}
            {currentCase.communications && currentCase.communications.length > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '12px 14px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Citizen Information Requests
                    </span>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                      Public operational inquiries sent to citizen
                    </p>
                  </div>
                  <span className="ec-badge-info" style={{ fontSize: '10px' }}>
                    Awaiting Citizen Response
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentCase.communications.map((comm, idx) => (
                    <div
                      key={comm.id || idx}
                      style={{
                        padding: '10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0f2fe',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#0284c7', marginBottom: '4px', fontWeight: 600 }}>
                        <span>To: {comm.recipient || 'Citizen / Requestor'}</span>
                        <span>{comm.time || 'Recently'}</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: 500, lineHeight: 1.4 }}>
                        "{comm.message}"
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        Requested by: {comm.senderName || 'Emergency Coordinator'} ({comm.senderRole || 'Coordinator'})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Request History Card */}
          <div className="ec-panel-card">
            <h3 className="ec-panel-title-text" style={{ marginBottom: '12px' }}>Request history</h3>
            <div className="ec-history-stepper-list">
              {caseHistory.map((step, idx) => (
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
              {caseChecklist.map(item => (
                <div
                  key={item.id}
                  className="ec-check-item-row"
                  onClick={() => onToggleChecklist(item.id)}
                >
                  <div className="ec-check-left">
                    <input
                      type="checkbox"
                      checked={Boolean(item.checked)}
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
            {caseChecklist.some(c => c.required && !c.checked) && (
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
              {caseNotes.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {caseNotes.map((n, idx) => (
                    <div
                      key={n.id || idx}
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
                onClick={() => handleOpenActionModal('info')}
              >
                Request additional information
              </button>

              <button
                className="ec-btn-action-outline"
                onClick={() => handleOpenActionModal('escalate')}
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
                onClick={() => handleOpenActionModal('investigate')}
              >
                Flag for investigation
              </button>

              <button
                className="ec-btn-reject-red"
                onClick={() => handleOpenActionModal('reject')}
              >
                Reject with reason
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Consequential Action Confirmation Modal */}
      <ConsequentialActionModal
        isOpen={Boolean(activeModalType)}
        onClose={() => setActiveModalType(null)}
        title={
          activeModalType === 'info'
            ? 'Request additional information?'
            : activeModalType === 'escalate'
            ? 'Escalate operational priority?'
            : activeModalType === 'investigate'
            ? 'Flag for authorised investigation?'
            : activeModalType === 'reject'
            ? 'Reject assistance request with reason?'
            : 'Mark request as verified?'
        }
        confirmVariant={activeModalType === 'reject' ? 'danger' : 'primary'}
        reason={actionReason}
        setReason={setActionReason}
        confirmedCheck={actionConfirmedCheck}
        setConfirmedCheck={setActionConfirmedCheck}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

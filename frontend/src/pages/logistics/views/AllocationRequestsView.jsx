import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  AlertTriangle, 
  FileText,
  UserCheck
} from 'lucide-react';
import { ALLOCATION_REQUESTS } from '../data/resourceManagerData';

export const AllocationRequestsView = ({
  requests = [],
  onApprove,
  onReject,
  onRequestInfo,
  showToast
}) => {
  // Local reactive list of pending requests
  const [localRequests, setLocalRequests] = useState(
    requests && requests.length > 0 ? requests : ALLOCATION_REQUESTS
  );

  // Sync if requests prop updates from upstream
  useEffect(() => {
    if (requests && requests.length > 0) {
      setLocalRequests(requests);
    }
  }, [requests]);

  const [selectedRequestId, setSelectedRequestId] = useState('RAR-204');
  const [approvedQty, setApprovedQty] = useState('140');
  const [managerNote, setManagerNote] = useState('');
  const [noteError, setNoteError] = useState(null);

  // Current selected request
  const selectedReq = localRequests.find(r => r.id === selectedRequestId) || localRequests[0] || null;

  // Whenever selected request changes, update approved quantity input and clear error
  useEffect(() => {
    if (selectedReq) {
      setApprovedQty(String(selectedReq.requestedQty ?? '140'));
      setNoteError(null);
    }
  }, [selectedReq?.id]);

  // Dynamic stock calculations based on approvedQty input
  const totalAvailable = selectedReq ? Number(selectedReq.availableQty || 0) : 0;
  const parsedApproved = Math.max(0, parseFloat(approvedQty) || 0);
  const remainingStock = totalAvailable - parsedApproved;
  const isDeficit = remainingStock < 0;
  const percentRemaining = totalAvailable > 0 
    ? Math.max(0, Math.min(100, (remainingStock / totalAvailable) * 100))
    : 0;

  // Dynamic progress bar styling
  const progressBg = isDeficit 
    ? '#dc2626' 
    : (remainingStock <= 50 ? '#d97706' : '#1e3d2c');

  // Handle Approve Allocation
  const handleApprove = () => {
    if (!selectedReq) return;
    const finalQty = Math.max(0, parseFloat(approvedQty) || selectedReq.requestedQty);
    const newAvailable = Math.max(0, totalAvailable - finalQty);

    // Remove from pending requests and update available stock across items in local state
    const remainingRequests = localRequests
      .filter(r => r.id !== selectedReq.id)
      .map(r => {
        if (r.item === selectedReq.item) {
          return {
            ...r,
            availableQty: newAvailable,
            remainingStock: Math.max(0, newAvailable - r.requestedQty)
          };
        }
        return r;
      });

    setLocalRequests(remainingRequests);

    if (remainingRequests.length > 0) {
      setSelectedRequestId(remainingRequests[0].id);
    } else {
      setSelectedRequestId(null);
    }

    setManagerNote('');
    setNoteError(null);

    const toastText = `Allocation for ${selectedReq.item} (${selectedReq.id}) approved: ${finalQty} units dispatched`;
    if (showToast) {
      showToast(toastText);
    }

    if (onApprove) {
      onApprove(selectedReq, finalQty, managerNote);
    }
  };

  // Handle Reject with Reason (Requires note validation)
  const handleReject = () => {
    if (!selectedReq) return;
    if (!managerNote.trim()) {
      setNoteError('Please provide an operational rejection reason in Resource Manager Note before proceeding.');
      if (showToast) {
        showToast('Please provide an operational rejection reason before rejecting.');
      }
      return;
    }

    setNoteError(null);
    const reason = managerNote.trim();
    const remainingRequests = localRequests.filter(r => r.id !== selectedReq.id);
    setLocalRequests(remainingRequests);

    if (remainingRequests.length > 0) {
      setSelectedRequestId(remainingRequests[0].id);
    } else {
      setSelectedRequestId(null);
    }

    setManagerNote('');

    const toastText = `Allocation request ${selectedReq.id} rejected with operational reason`;
    if (showToast) {
      showToast(toastText);
    }

    if (onReject) {
      onReject(selectedReq, reason);
    }
  };

  // Handle Request More Information (Requires note validation)
  const handleRequestInfo = () => {
    if (!selectedReq) return;
    if (!managerNote.trim()) {
      setNoteError('Please specify the required information or clarification in Resource Manager Note.');
      if (showToast) {
        showToast('Please specify what clarification is needed before submitting.');
      }
      return;
    }

    setNoteError(null);
    const note = managerNote.trim();
    const remainingRequests = localRequests.filter(r => r.id !== selectedReq.id);
    setLocalRequests(remainingRequests);

    if (remainingRequests.length > 0) {
      setSelectedRequestId(remainingRequests[0].id);
    } else {
      setSelectedRequestId(null);
    }

    setManagerNote('');

    const toastText = `Clarification requested for ${selectedReq.id}: "${note}"`;
    if (showToast) {
      showToast(toastText);
    }

    if (onRequestInfo) {
      onRequestInfo(selectedReq, note);
    }
  };

  const highPriorityCount = localRequests.filter(r => 
    (r.priorityTag === 'critical' || r.priorityTag === 'warning' || 
    (r.priority || '').toLowerCase().includes('high') || 
    (r.priority || '').toLowerCase().includes('critical'))
  ).length;

  return (
    <div className="rm-workspace">
      {/* Title & Action Block (Screenshot 3) */}
      <div className="rm-title-block">
        <div>
          <div className="rm-eyebrow">
            <span>REQUESTS FROM AUTHORISED COORDINATORS</span>
          </div>
          <h1 className="rm-title">Resource Allocation Requests</h1>
          <p className="rm-subtitle">
            Review availability, operational priority and destination before recording an allocation decision.
          </p>
        </div>
      </div>

      {/* Split Layout: Left requests list, Right detail card */}
      <div className="rm-split-layout-reverse">
        {/* Left: Pending Requests List */}
        <div className="rm-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                Pending requests
              </h3>
              <div style={{ fontSize: '11.5px', color: '#657367', marginTop: '2px' }}>
                {localRequests.length} awaiting resource review
              </div>
            </div>

            {highPriorityCount > 0 && (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '12px',
                backgroundColor: '#fff7ed',
                color: '#c2410c',
                border: '1px solid #ffedd5'
              }}>
                ● {highPriorityCount} high priority
              </span>
            )}
          </div>

          {localRequests.length === 0 ? (
            <div style={{ 
              padding: '40px 16px', 
              textAlign: 'center', 
              backgroundColor: '#fafcf9', 
              borderRadius: '8px',
              border: '1px dashed #d4ded3'
            }}>
              <CheckCircle size={32} color="#047857" style={{ margin: '0 auto 10px auto', display: 'block' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#162e20' }}>
                All Requests Handled
              </div>
              <div style={{ fontSize: '12px', color: '#657367', marginTop: '4px' }}>
                No pending allocation requests awaiting decision.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {localRequests.map((req) => {
                const isSelected = req.id === selectedReq?.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      setSelectedRequestId(req.id);
                      setNoteError(null);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#ebf1e5' : '#ffffff',
                      border: isSelected ? '1px solid #c7d5c5' : '1px solid #edf1eb',
                      boxShadow: isSelected ? '0 2px 6px rgba(22, 46, 32, 0.06)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '8px',
                        bottom: '8px',
                        width: '3px',
                        backgroundColor: '#1e3d2c',
                        borderRadius: '0 2px 2px 0'
                      }} />
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#657367' }}>{req.id}</span>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#162e20', marginTop: '1px' }}>
                          {req.item}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#738075', marginTop: '2px' }}>
                          {req.cluster}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className={`rm-status-badge ${req.priorityTag || 'warning'}`} style={{ padding: '2px 8px', fontSize: '10.5px' }}>
                          ● {req.priority}
                        </span>
                        <div style={{ fontSize: '11px', color: '#657367', marginTop: '4px', fontWeight: 600 }}>
                          {req.requestedQty} requested
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Allocation Detail Card */}
        {selectedReq ? (
          <div className="rm-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#657367' }}>{selectedReq.id}</span>
              <span className={`rm-status-badge ${selectedReq.priorityTag || 'critical'}`}>
                ● {selectedReq.priority}
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162e20', margin: '2px 0 2px 0' }}>
              {selectedReq.item} allocation
            </h2>
            <div style={{ fontSize: '12px', color: '#657367', marginBottom: '20px' }}>
              Requested by Emergency Coordinator {selectedReq.coordinator || 'Maya Fernando'}
            </div>

            {/* 4 Fields Grid */}
            <div className="rm-detail-grid">
              <div className="rm-detail-field">
                <span className="rm-detail-label">RELATED RECORD</span>
                <span className="rm-detail-val">{selectedReq.relatedRecord}</span>
              </div>
              <div className="rm-detail-field">
                <span className="rm-detail-label">DESTINATION</span>
                <span className="rm-detail-val">{selectedReq.destination}</span>
              </div>
              <div className="rm-detail-field">
                <span className="rm-detail-label">REQUIRED QUANTITY</span>
                <span className="rm-detail-val">{selectedReq.requestedQty} units</span>
              </div>
              <div className="rm-detail-field">
                <span className="rm-detail-label">AVAILABLE QUANTITY</span>
                <span className="rm-detail-val">{totalAvailable} units</span>
              </div>
            </div>

            {/* Remaining Stock Gauge Bar (Dynamically updated) */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#405044' }}>Stock after requested allocation</span>
                <span style={{ 
                  fontWeight: 700, 
                  color: isDeficit ? '#dc2626' : '#162e20',
                  transition: 'color 0.2s ease'
                }}>
                  {isDeficit 
                    ? `${Math.abs(remainingStock)} units deficit (Stock shortage)` 
                    : `${remainingStock} units remaining`}
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#edf1eb', 
                borderRadius: '4px', 
                overflow: 'hidden' 
              }}>
                <div 
                  style={{ 
                    width: `${percentRemaining}%`, 
                    height: '100%', 
                    backgroundColor: progressBg, 
                    borderRadius: '4px',
                    transition: 'width 0.25s ease, background-color 0.25s ease'
                  }} 
                />
              </div>
            </div>

            {/* Approved Quantity Input */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#4a5b4a', 
                letterSpacing: '0.04em', 
                textTransform: 'uppercase', 
                marginBottom: '8px' 
              }}>
                APPROVED QUANTITY *
              </label>
              <input
                type="number"
                min="0"
                className="rm-form-input"
                style={{ fontWeight: 600, fontSize: '14px' }}
                value={approvedQty}
                onChange={(e) => setApprovedQty(e.target.value)}
              />
            </div>

            {/* Resource Manager Note */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#4a5b4a', 
                letterSpacing: '0.04em', 
                textTransform: 'uppercase', 
                marginBottom: '8px' 
              }}>
                RESOURCE MANAGER NOTE
              </label>
              <textarea
                className="rm-note-textarea"
                rows={3}
                placeholder="Record allocation constraints, alternatives or operational conditions..."
                style={{
                  border: noteError ? '1px solid #dc2626' : undefined,
                  transition: 'border-color 0.15s ease'
                }}
                value={managerNote}
                onChange={(e) => {
                  setManagerNote(e.target.value);
                  if (noteError) setNoteError(null);
                }}
              />
              
              {/* Validation Prompt if Note is Missing for Reject / Request Info */}
              {noteError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  color: '#dc2626',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  animation: 'rmFadeIn 0.15s ease-out'
                }}>
                  <AlertCircle size={14} color="#dc2626" style={{ flexShrink: 0 }} />
                  <span>{noteError}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="rm-btn rm-btn-secondary"
                onClick={handleRequestInfo}
              >
                <span>Request more information</span>
              </button>
              <button
                type="button"
                className="rm-btn rm-btn-danger"
                onClick={handleReject}
              >
                <span>Reject with reason</span>
              </button>
              <button
                type="button"
                className="rm-btn rm-btn-primary"
                onClick={handleApprove}
              >
                <span>Approve allocation</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rm-panel" style={{ 
            padding: '40px 24px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center' 
          }}>
            <UserCheck size={36} color="#1e3d2c" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: '0 0 6px 0' }}>
              Queue Completed
            </h3>
            <p style={{ fontSize: '12.5px', color: '#657367', maxWidth: '340px', margin: 0 }}>
              All coordinator allocation requests have been processed. Switch to Inventory or Tracking to monitor dispatched supplies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocationRequestsView;

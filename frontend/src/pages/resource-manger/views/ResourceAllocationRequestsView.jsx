import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  User,
  MapPin,
  Package,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

export const ResourceAllocationRequestsView = ({
  allocationRequests,
  onTriggerReviewAction
}) => {
  const [selectedRequestId, setSelectedRequestId] = useState(
    allocationRequests[0]?.id || 'RAR-204'
  );
  const [approvedQuantity, setApprovedQuantity] = useState(140);
  const [managerNote, setManagerNote] = useState('');

  const selectedRequest =
    allocationRequests.find((r) => r.id === selectedRequestId) || allocationRequests[0];

  const handleSelectRequest = (req) => {
    setSelectedRequestId(req.id);
    setApprovedQuantity(req.requestedQuantity);
    setManagerNote('');
  };

  const remainingAfterApproval = Math.max(
    0,
    (selectedRequest?.availableQuantity || 0) - (approvedQuantity || 0)
  );

  const remainingPercent = selectedRequest?.availableQuantity
    ? Math.round((remainingAfterApproval / selectedRequest.availableQuantity) * 100)
    : 0;

  return (
    <div className="rm-view-container">
      {/* Top Header Row */}
      <div className="rm-header-row">
        <div>
          <span className="rm-header-kicker">
            REQUESTS FROM AUTHORISED COORDINATORS
          </span>
          <h1 className="rm-header-title">Resource Allocation Requests</h1>
          <p className="rm-header-subtitle">
            Review availability, operational priority and destination before recording an allocation decision.
          </p>
        </div>
      </div>

      {/* Split Grid */}
      <div className="rm-master-detail-grid">
        {/* Left Column: Pending Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--rm-text-primary)' }}>
                Pending requests
              </div>
              <div style={{ fontSize: 12, color: 'var(--rm-text-muted)' }}>
                {allocationRequests.length} awaiting resource review
              </div>
            </div>
            <span className="rm-badge rm-badge-warning">
              <span className="rm-badge-dot" />
              4 high priority
            </span>
          </div>

          <div className="rm-queue-list">
            {allocationRequests.map((req) => {
              const isSelected = req.id === selectedRequestId;
              return (
                <div
                  key={req.id}
                  className={`rm-queue-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectRequest(req)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--rm-primary-blue)' }}>
                      {req.id}
                    </span>
                    <span className={`rm-badge rm-badge-${req.priorityType}`}>
                      <span className="rm-badge-dot" />
                      {req.priority}
                    </span>
                  </div>

                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--rm-text-primary)', marginBottom: 4 }}>
                    {req.itemName}
                  </div>

                  <div style={{ fontSize: 11.5, color: 'var(--rm-text-muted)', marginBottom: 6 }}>
                    {req.relatedIncident} • {req.destination}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--rm-text-secondary)' }}>
                      {req.requestedQuantity} requested
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--rm-text-muted)' }}>
                      {req.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Request Review Panel */}
        {selectedRequest && (
          <div className="rm-detail-card">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--rm-border)' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--rm-primary-blue)' }}>
                  {selectedRequest.id}
                </span>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: '2px 0 4px 0', color: 'var(--rm-text-primary)' }}>
                  {selectedRequest.title}
                </h2>
                <div style={{ fontSize: 12.5, color: 'var(--rm-text-muted)' }}>
                  Requested by <strong style={{ color: 'var(--rm-text-secondary)' }}>{selectedRequest.requestedBy}</strong>
                </div>
              </div>

              <span className={`rm-badge rm-badge-${selectedRequest.priorityType}`}>
                <span className="rm-badge-dot" />
                {selectedRequest.priority} priority
              </span>
            </div>

            {/* 4 Info Fields Grid matching Figma Screenshot 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, backgroundColor: '#f8fafc', padding: '14px', borderRadius: 8, border: '1px solid var(--rm-border)' }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--rm-text-muted)' }}>
                  Related incident
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--rm-text-primary)', marginTop: 4 }}>
                  {selectedRequest.relatedIncident}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--rm-text-muted)' }}>
                  Destination
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--rm-text-primary)', marginTop: 4 }}>
                  {selectedRequest.destination}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--rm-text-muted)' }}>
                  Request quantity
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--rm-text-primary)', marginTop: 4 }}>
                  {selectedRequest.requestedQuantity} units
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--rm-text-muted)' }}>
                  Available quantity
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0369a1', marginTop: 4 }}>
                  {selectedRequest.availableQuantity} units
                </div>
              </div>
            </div>

            {/* Visual Stock Depletion Bar */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--rm-border)', padding: 14, borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--rm-text-secondary)' }}>
                  Stock after requested allocation
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: remainingAfterApproval < 50 ? '#dc2626' : '#0369a1' }}>
                  {remainingAfterApproval} units remaining
                </span>
              </div>
              <div style={{ height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${remainingPercent}%`,
                    backgroundColor: remainingAfterApproval < 50 ? '#ea580c' : '#0284c7',
                    borderRadius: 4,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="rm-form-group">
                <label className="rm-form-label">Approved Quantity *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedRequest.availableQuantity}
                  className="rm-form-input"
                  value={approvedQuantity}
                  onChange={(e) => setApprovedQuantity(Number(e.target.value))}
                />
              </div>

              <div className="rm-form-group">
                <label className="rm-form-label">Resource Manager Note</label>
                <textarea
                  className="rm-form-textarea"
                  rows={3}
                  placeholder="Record allocation constraints, alternatives or conditions..."
                  value={managerNote}
                  onChange={(e) => setManagerNote(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons Row matching Figma */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, paddingTop: 10, borderTop: '1px solid var(--rm-border)' }}>
              <button
                type="button"
                className="rm-btn-outline"
                onClick={() =>
                  onTriggerReviewAction({
                    request: selectedRequest,
                    actionType: 'clarification',
                    approvedQuantity,
                    managerNote
                  })
                }
              >
                Request more information
              </button>

              <button
                type="button"
                className="rm-btn-outline"
                style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                onClick={() =>
                  onTriggerReviewAction({
                    request: selectedRequest,
                    actionType: 'reject',
                    approvedQuantity,
                    managerNote
                  })
                }
              >
                Reject with reason
              </button>

              <button
                type="button"
                className="rm-btn-primary"
                onClick={() =>
                  onTriggerReviewAction({
                    request: selectedRequest,
                    actionType: 'approve',
                    approvedQuantity,
                    managerNote
                  })
                }
              >
                <CheckCircle size={15} />
                Approve allocation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


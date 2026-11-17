import React, { useState } from 'react';

export const AllocationRequestsView = ({
  requests = [],
  onApprove,
  onReject,
  onRequestInfo
}) => {
  const [selectedRequestId, setSelectedRequestId] = useState('RAR-204');
  const [approvedQty, setApprovedQty] = useState('140');
  const [managerNote, setManagerNote] = useState('');

  const selectedReq = requests.find(r => r.id === selectedRequestId) || requests[0];

  React.useEffect(() => {
    if (selectedReq) {
      setApprovedQty(String(selectedReq.requestedQty || '140'));
    }
  }, [selectedRequestId]);

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
                12 awaiting resource review
              </div>
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '12px',
              backgroundColor: '#fff7ed',
              color: '#c2410c',
              border: '1px solid #ffedd5'
            }}>
              ● 4 high priority
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {requests.map((req) => {
              const isSelected = req.id === selectedReq?.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#ebf1e5' : '#ffffff',
                    border: isSelected ? '1px solid #dbe4c6' : '1px solid #edf1eb',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
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
        </div>

        {/* Right: Allocation Detail Card */}
        {selectedReq && (
          <div className="rm-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#657367' }}>{selectedReq.id}</span>
              <span className="rm-status-badge critical">● {selectedReq.priority}</span>
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
                <span className="rm-detail-val">{selectedReq.availableQty} units</span>
              </div>
            </div>

            {/* Remaining Stock Gauge Bar */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#405044' }}>Stock after requested allocation</span>
                <span style={{ fontWeight: 700, color: '#162e20' }}>{selectedReq.remainingStock} units remaining</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#edf1eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(selectedReq.remainingStock / selectedReq.availableQty) * 100}%`, height: '100%', backgroundColor: '#d97706', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Approved Quantity Input */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                APPROVED QUANTITY *
              </label>
              <input
                type="number"
                className="rm-form-input"
                value={approvedQty}
                onChange={(e) => setApprovedQty(e.target.value)}
              />
            </div>

            {/* Resource Manager Note */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                RESOURCE MANAGER NOTE
              </label>
              <textarea
                className="rm-note-textarea"
                placeholder="Record allocation constraints, alternatives or conditions..."
                value={managerNote}
                onChange={(e) => setManagerNote(e.target.value)}
              />
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => onRequestInfo && onRequestInfo(selectedReq)}
              >
                <span>Request more information</span>
              </button>
              <button
                className="rm-btn rm-btn-danger"
                onClick={() => onReject && onReject(selectedReq, managerNote)}
              >
                <span>Reject with reason</span>
              </button>
              <button
                className="rm-btn rm-btn-primary"
                onClick={() => onApprove && onApprove(selectedReq, approvedQty, managerNote)}
              >
                <span>Approve allocation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocationRequestsView;

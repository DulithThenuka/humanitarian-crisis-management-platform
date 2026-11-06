import React, { useState } from 'react';
import {
  Truck,
  CheckCircle,
  Clock,
  Search,
  Download,
  Calendar,
  Layers,
  MapPin,
  FileCheck,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const DistributionTrackingView = ({
  dispatches,
  onOpenExport,
  onTriggerDeliveryAction,
  onUpdateStatusAction
}) => {
  const [selectedDispatchId, setSelectedDispatchId] = useState(
    dispatches[0]?.id || 'DSP-041'
  );
  const [searchTerm, setSearchTerm] = useState('');

  const selectedDispatch =
    dispatches.find((d) => d.id === selectedDispatchId) || dispatches[0];

  const filteredDispatches = dispatches.filter(
    (d) =>
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const steps = [
    { num: 1, label: 'Requested' },
    { num: 2, label: 'Approved' },
    { num: 3, label: 'Prepared' },
    { num: 4, label: 'Dispatched' },
    { num: 5, label: 'Delivered' }
  ];

  return (
    <div className="rm-view-container">
      {/* Header Row */}
      <div className="rm-header-row">
        <div>
          <span className="rm-header-kicker">
            FULFILLMENT AND LAST-MILE VISIBILITY
          </span>
          <h1 className="rm-header-title">Distribution & Delivery Tracking</h1>
          <p className="rm-header-subtitle">
            Track preparation, dispatch and confirmation as separate operational states.
          </p>
        </div>
        <div className="rm-header-actions">
          <button
            type="button"
            className="rm-btn-outline"
            onClick={() => onOpenExport('Dispatches')}
          >
            <Download size={15} />
            Export dispatch log
          </button>
        </div>
      </div>

      {/* Split Grid */}
      <div className="rm-master-detail-grid">
        {/* Left: Dispatch Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="rm-top-search-box" style={{ width: '100%', boxSizing: 'border-box' }}>
            <Search size={15} color="var(--rm-text-muted)" />
            <input
              type="text"
              className="rm-top-search-input"
              placeholder="Search dispatch or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rm-queue-list">
            {filteredDispatches.map((dispatch) => {
              const isSelected = dispatch.id === selectedDispatchId;
              return (
                <div
                  key={dispatch.id}
                  className={`rm-queue-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDispatchId(dispatch.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--rm-primary-blue)' }}>
                      {dispatch.id}
                    </span>
                    <span className={`rm-badge rm-badge-${dispatch.statusType}`}>
                      <span className="rm-badge-dot" />
                      {dispatch.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--rm-text-primary)', marginBottom: 4 }}>
                    {dispatch.itemTitle}
                  </div>

                  <div style={{ fontSize: 11.5, color: 'var(--rm-text-muted)' }}>
                    Destination: {dispatch.destination} • Team: {dispatch.team}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Dispatch Workspace */}
        {selectedDispatch && (
          <div className="rm-detail-card">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--rm-border)' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--rm-primary-blue)' }}>
                  {selectedDispatch.id}
                </span>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: '2px 0 4px 0', color: 'var(--rm-text-primary)' }}>
                  {selectedDispatch.itemTitle}
                </h2>
                <div style={{ fontSize: 12.5, color: 'var(--rm-text-muted)' }}>
                  Destination: <strong style={{ color: 'var(--rm-text-secondary)' }}>{selectedDispatch.destination}</strong> • Team: <strong style={{ color: 'var(--rm-text-secondary)' }}>{selectedDispatch.team}</strong>
                </div>
              </div>

              <span className={`rm-badge rm-badge-${selectedDispatch.statusType}`}>
                <span className="rm-badge-dot" />
                {selectedDispatch.status}
              </span>
            </div>

            {/* 5-Stage Step Progress Tracker */}
            <div className="rm-step-tracker">
              {steps.map((step, idx) => {
                const isDone = step.num < selectedDispatch.currentStep || (selectedDispatch.currentStep === 5 && step.num === 5);
                const isActive = step.num === selectedDispatch.currentStep && selectedDispatch.currentStep !== 5;
                return (
                  <React.Fragment key={step.num}>
                    <div className={`rm-step-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isDone ? '#15803d' : isActive ? 'var(--rm-primary-blue)' : '#ffffff',
                          color: isDone || isActive ? '#ffffff' : 'var(--rm-text-muted)',
                          border: `1.5px solid ${isDone ? '#15803d' : isActive ? 'var(--rm-primary-blue)' : '#cbd5e1'}`,
                          fontWeight: 700,
                          fontSize: 12
                        }}
                      >
                        {isDone ? <CheckCircle size={15} /> : step.num}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: isActive || isDone ? 700 : 500 }}>
                        {step.label}
                      </span>
                    </div>

                    {idx < steps.length - 1 && (
                      <div className={`rm-step-line ${step.num < selectedDispatch.currentStep ? 'done' : ''}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* 4 Metadata Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, backgroundColor: '#f8fafc', padding: '14px', borderRadius: 8, border: '1px solid var(--rm-border)' }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--rm-text-muted)' }}>
                  Dispatch Date
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--rm-text-primary)', marginTop: 4 }}>
                  {selectedDispatch.dispatchDate}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--rm-text-muted)' }}>
                  Expected Delivery
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--rm-text-primary)', marginTop: 4 }}>
                  {selectedDispatch.expectedDelivery}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--rm-text-muted)' }}>
                  Related Allocation
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--rm-primary-blue)', marginTop: 4 }}>
                  {selectedDispatch.relatedAllocation}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--rm-text-muted)' }}>
                  Delivery Confirmation
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: selectedDispatch.status === 'Delivered' ? '#15803d' : '#ea580c', marginTop: 4 }}>
                  {selectedDispatch.deliveryConfirmation}
                </div>
              </div>
            </div>

            {/* Distribution History Timeline */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--rm-text-muted)', marginBottom: 10 }}>
                Distribution History
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedDispatch.history?.map((hist, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '10px 14px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 6,
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--rm-primary-blue)', minWidth: 44 }}>
                      {hist.time}
                    </span>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--rm-text-primary)' }}>
                        {hist.event}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--rm-text-muted)' }}>
                        {hist.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, paddingTop: 10, borderTop: '1px solid var(--rm-border)' }}>
              <button
                type="button"
                className="rm-btn-outline"
                onClick={() => onUpdateStatusAction(selectedDispatch)}
              >
                Update status
              </button>

              <button
                type="button"
                className="rm-btn-primary"
                disabled={selectedDispatch.status === 'Delivered'}
                onClick={() => onTriggerDeliveryAction(selectedDispatch)}
              >
                <CheckCircle size={15} />
                {selectedDispatch.status === 'Delivered' ? 'Delivery Confirmed' : 'Record delivery confirmation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


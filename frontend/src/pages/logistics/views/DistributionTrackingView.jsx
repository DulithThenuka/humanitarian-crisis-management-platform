import React, { useState, useEffect } from 'react';
import { Search, Download, Check, Truck, CheckCircle2, Clock } from 'lucide-react';
import { DISTRIBUTION_DISPATCHES } from '../data/resourceManagerData';
import { DeliveryConfirmationModal } from '../components/modals/DeliveryConfirmationModal';

export const DistributionTrackingView = ({
  dispatches = [],
  onExportReport,
  onUpdateStatus,
  onConfirmDelivery,
  showToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDispatchId, setSelectedDispatchId] = useState('DSP-041');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Local reactive state for dispatches
  const [localDispatches, setLocalDispatches] = useState(
    dispatches && dispatches.length > 0 ? dispatches : DISTRIBUTION_DISPATCHES
  );

  useEffect(() => {
    if (dispatches && dispatches.length > 0) {
      setLocalDispatches(dispatches);
    }
  }, [dispatches]);

  const selectedDisp = localDispatches.find(d => d.id === selectedDispatchId) || localDispatches[0] || null;

  const filteredDispatches = localDispatches.filter(d => 
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const stepNames = { 1: 'Requested', 2: 'Approved', 3: 'Prepared', 4: 'Dispatched', 5: 'Delivered' };
  const stepBadges = { 1: 'pending', 2: 'approved', 3: 'prepared', 4: 'dispatched', 5: 'delivered' };
  const stepTitles = {
    2: 'Allocation approved by Resource Officer',
    3: 'Supplies prepared and staged for transport',
    4: 'Vehicle departed Central Depot for destination',
    5: 'Shipment delivered to destination'
  };

  // Advance dispatch stage
  const handleAdvanceStatus = () => {
    if (!selectedDisp) return;
    const current = selectedDisp.currentStep || 4;

    if (current >= 5) {
      if (showToast) {
        showToast(`Dispatch ${selectedDisp.id} is already in the final Delivered stage.`);
      }
      return;
    }

    const nextStep = current + 1;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextStatus = stepNames[nextStep] || 'In Transit';

    const newHistoryEntry = {
      time: nowTime,
      title: stepTitles[nextStep] || `Advanced to ${nextStatus}`,
      sub: 'Recorded by Dilan Perera (Relief / Resource Manager)'
    };

    const updatedDisp = {
      ...selectedDisp,
      currentStep: nextStep,
      status: nextStatus,
      statusBadge: stepBadges[nextStep] || nextStatus.toLowerCase(),
      deliveryConfirmation: nextStep === 5 
        ? `Confirmed by receiving officer (${nowTime})` 
        : selectedDisp.deliveryConfirmation,
      history: [newHistoryEntry, ...(selectedDisp.history || [])]
    };

    setLocalDispatches(prev => prev.map(d => d.id === selectedDisp.id ? updatedDisp : d));

    const toastMsg = `Dispatch ${selectedDisp.id} moved to stage: ${nextStatus}`;
    if (showToast) showToast(toastMsg);

    if (onUpdateStatus) {
      onUpdateStatus(updatedDisp);
    }
  };

  // Handle Delivery Confirmation from Modal
  const handleConfirmDeliverySubmit = (disp, receivedBy, notes) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newHistoryEntry = {
      time: nowTime,
      title: `Delivery confirmed by ${receivedBy}`,
      sub: notes || `Official sign-off recorded at ${disp.destination}`
    };

    const updatedDisp = {
      ...disp,
      currentStep: 5,
      status: 'Delivered',
      statusBadge: 'delivered',
      deliveryConfirmation: `Confirmed by ${receivedBy} (${nowTime})`,
      history: [newHistoryEntry, ...(disp.history || [])]
    };

    setLocalDispatches(prev => prev.map(d => d.id === disp.id ? updatedDisp : d));

    const toastMsg = `Delivery confirmed for ${disp.id}: Signed by ${receivedBy}`;
    if (showToast) showToast(toastMsg);

    if (onConfirmDelivery) {
      onConfirmDelivery(updatedDisp, receivedBy, notes);
    }
  };

  const progressPercent = selectedDisp 
    ? Math.max(0, Math.min(100, ((Math.min(5, selectedDisp.currentStep || 1) - 1) / 4) * 100))
    : 0;

  return (
    <div className="rm-workspace">
      {/* Title & Action Block (Screenshot 4) */}
      <div className="rm-title-block">
        <div>
          <div className="rm-eyebrow">
            <span>FULFILLMENT AND LAST-MILE VISIBILITY</span>
          </div>
          <h1 className="rm-title">Distribution &amp; Delivery Tracking</h1>
          <p className="rm-subtitle">
            Track preparation, dispatch and confirmation as separate operational states.
          </p>
        </div>

        <button 
          className="rm-btn rm-btn-secondary"
          onClick={onExportReport}
        >
          <Download size={14} />
          <span>Export dispatch log</span>
        </button>
      </div>

      {/* Split Layout */}
      <div className="rm-split-layout-reverse">
        {/* Left: Dispatch List */}
        <div className="rm-panel" style={{ padding: '20px' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#657367' }} />
            <input
              type="text"
              placeholder="Search dispatch or destination..."
              className="rm-form-input"
              style={{ paddingLeft: '34px', fontSize: '12px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredDispatches.map((disp) => {
              const isSelected = disp.id === selectedDisp?.id;
              return (
                <div
                  key={disp.id}
                  onClick={() => setSelectedDispatchId(disp.id)}
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
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#657367' }}>{disp.id}</span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', marginTop: '1px' }}>
                        {disp.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#738075', marginTop: '2px' }}>
                        {disp.destination} · {disp.team}
                      </div>
                    </div>

                    <span className={`rm-status-badge ${disp.statusBadge || disp.status.toLowerCase()}`}>
                      ● {disp.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Dispatch Detail */}
        {selectedDisp ? (
          <div className="rm-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#657367' }}>{selectedDisp.id}</span>
              <span className={`rm-status-badge ${selectedDisp.statusBadge || selectedDisp.status.toLowerCase()}`}>
                ● {selectedDisp.status}
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162e20', margin: '2px 0 2px 0' }}>
              {selectedDisp.title}
            </h2>
            <div style={{ fontSize: '12px', color: '#657367', marginBottom: '24px' }}>
              Destination: {selectedDisp.destination} · Team: {selectedDisp.team}
            </div>

            {/* 5-Step Horizontal Stepper with dynamic fill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              padding: '12px 20px',
              backgroundColor: '#f8faf7',
              borderRadius: '8px',
              border: '1px solid #edf1eb',
              marginBottom: '24px'
            }}>
              {/* Stepper connecting background track */}
              <div style={{
                position: 'absolute',
                left: '42px',
                right: '42px',
                top: '23px',
                height: '3px',
                backgroundColor: '#e2e8dd',
                zIndex: 1,
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  backgroundColor: '#1e3d2c',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {steps.map((s) => {
                const isPassed = s.num <= (selectedDisp.currentStep || 4);
                const isCurrent = s.num === (selectedDisp.currentStep || 4);
                return (
                  <div 
                    key={s.num} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      zIndex: 2,
                      gap: '6px'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isPassed ? '#1e3d2c' : '#ffffff',
                      color: isPassed ? '#ffffff' : '#738075',
                      border: isPassed ? 'none' : '1px solid #d4ded3',
                      boxShadow: isCurrent ? '0 0 0 3px rgba(30, 61, 44, 0.18)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      transition: 'all 0.25s ease'
                    }}>
                      {isPassed ? <Check size={13} strokeWidth={2.5} /> : s.num}
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      color: isPassed ? '#162e20' : '#738075', 
                      fontWeight: isPassed ? 700 : 500,
                      transition: 'color 0.2s ease'
                    }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 4 Fields Grid */}
            <div className="rm-detail-grid">
              <div className="rm-detail-field">
                <span className="rm-detail-label">DISPATCH DATE</span>
                <span className="rm-detail-val">{selectedDisp.dispatchDate}</span>
              </div>
              <div className="rm-detail-field">
                <span className="rm-detail-label">EXPECTED DELIVERY</span>
                <span className="rm-detail-val">{selectedDisp.expectedDelivery}</span>
              </div>
              <div className="rm-detail-field">
                <span className="rm-detail-label">RELATED ALLOCATION</span>
                <span className="rm-detail-val">{selectedDisp.relatedAllocation}</span>
              </div>
              <div className="rm-detail-field">
                <span className="rm-detail-label">DELIVERY CONFIRMATION</span>
                <span className="rm-detail-val" style={{
                  color: selectedDisp.deliveryConfirmation?.toLowerCase().includes('confirmed') ? '#047857' : '#162e20',
                  fontWeight: selectedDisp.deliveryConfirmation?.toLowerCase().includes('confirmed') ? 700 : 500
                }}>
                  {selectedDisp.deliveryConfirmation}
                </span>
              </div>
            </div>

            {/* Distribution History */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#4a5b4a', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '14px' }}>
                DISTRIBUTION HISTORY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(selectedDisp.history || []).map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#738075', minWidth: '40px' }}>
                      {h.time}
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1e3d2c' }}></span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>{h.title}</span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#738075', paddingLeft: '12px', marginTop: '2px' }}>
                        {h.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="rm-btn rm-btn-secondary"
                onClick={handleAdvanceStatus}
                disabled={selectedDisp.currentStep >= 5}
                style={{
                  opacity: selectedDisp.currentStep >= 5 ? 0.6 : 1,
                  cursor: selectedDisp.currentStep >= 5 ? 'not-allowed' : 'pointer'
                }}
              >
                <span>{selectedDisp.currentStep >= 5 ? 'Delivery completed' : 'Update status'}</span>
              </button>
              <button
                type="button"
                className="rm-btn rm-btn-primary"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                <span>Record delivery confirmation</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Delivery Confirmation Modal */}
      <DeliveryConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDeliverySubmit}
        dispatch={selectedDisp}
      />
    </div>
  );
};

export default DistributionTrackingView;

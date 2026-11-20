import React, { useState } from 'react';
import { Search, Download, Check } from 'lucide-react';

export const DistributionTrackingView = ({
  dispatches = [],
  onExportReport,
  onUpdateStatus,
  onConfirmDelivery
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDispatchId, setSelectedDispatchId] = useState('DSP-041');

  const selectedDisp = dispatches.find(d => d.id === selectedDispatchId) || dispatches[0];

  const filteredDispatches = dispatches.filter(d => 
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
                    border: isSelected ? '1px solid #dbe4c6' : '1px solid #edf1eb',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
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
        {selectedDisp && (
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

            {/* 5-Step Horizontal Stepper */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              padding: '10px 20px',
              backgroundColor: '#f8faf7',
              borderRadius: '8px',
              border: '1px solid #edf1eb',
              marginBottom: '24px'
            }}>
              {/* Stepper connecting line */}
              <div style={{
                position: 'absolute',
                left: '40px',
                right: '40px',
                top: '21px',
                height: '2px',
                backgroundColor: '#dbe4c6',
                zIndex: 1
              }} />

              {steps.map((s) => {
                const isPassed = s.num <= (selectedDisp.currentStep || 4);
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {isPassed ? <Check size={13} /> : s.num}
                    </div>
                    <span style={{ fontSize: '11px', color: isPassed ? '#162e20' : '#738075', fontWeight: isPassed ? 700 : 500 }}>
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
                <span className="rm-detail-val">{selectedDisp.deliveryConfirmation}</span>
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
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#738075', minWidth: '40px' }}>{h.time}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#1e3d2c' }}></span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>{h.title}</span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#738075', paddingLeft: '11px' }}>{h.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="rm-btn rm-btn-secondary"
                onClick={() => onUpdateStatus && onUpdateStatus(selectedDisp)}
              >
                <span>Update status</span>
              </button>
              <button
                className="rm-btn rm-btn-primary"
                onClick={() => onConfirmDelivery && onConfirmDelivery(selectedDisp)}
              >
                <span>Record delivery confirmation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionTrackingView;

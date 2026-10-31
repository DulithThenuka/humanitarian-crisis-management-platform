import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Download, 
  RotateCcw, 
  AlertTriangle, 
  Radio, 
  CheckCircle2, 
  PhoneCall, 
  ShieldAlert, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { FAILED_EXCEPTIONS_DATA } from './notificationData';

export const FailedNotificationHandlingView = ({ 
  onBackToHub, 
  onSelectScreen, 
  onExport,
  showToast 
}) => {
  const [exceptions, setExceptions] = useState(FAILED_EXCEPTIONS_DATA);
  const [isRetryingAll, setIsRetryingAll] = useState(false);

  const moduleScreens = [
    { id: 'inbox', label: 'Notification Inbox' },
    { id: 'compose', label: 'Compose Notification' },
    { id: 'recipient-drawer', label: 'Recipient Detail Drawer' },
    { id: 'delivery-status', label: 'Email & SMS Delivery Status' },
    { id: 'failed-handling', label: 'Failed Notification Handling' },
    { id: 'detail', label: 'Notification Detail' }
  ];

  const handleRetrySingle = (id, ref) => {
    showToast?.(`Retrying dispatch for ${ref} through secondary high-priority gateway...`, 'info');
    setTimeout(() => {
      setExceptions(prev => prev.filter(e => e.id !== id));
      showToast?.(`Transmission successful! ${ref} delivered via Mobitel Gateway 2`, 'success');
    }, 1000);
  };

  const handleRerouteRadio = (ref) => {
    showToast?.(`Emergency VHF dispatch order generated for ${ref} on 144.200 MHz`, 'success');
  };

  const handleBatchRetry = () => {
    setIsRetryingAll(true);
    showToast?.('Initiating automated batch retry across all failed notification buffers...', 'info');
    setTimeout(() => {
      setIsRetryingAll(false);
      setExceptions([]);
      showToast?.('Batch retry complete: All 2 exceptions cleared and successfully rerouted!', 'success');
    }, 1400);
  };

  return (
    <div className="notif-container">
      {/* 1. Breadcrumb Row */}
      <div className="notif-breadcrumb-row">
        <button 
          type="button" 
          className="notif-back-btn"
          onClick={onBackToHub}
        >
          <ChevronLeft size={14} />
          <span>Back to Notification Centre</span>
        </button>
        <span className="notif-breadcrumb-path-text">
          Notification Centre / Failed Notification Handling
        </span>
      </div>

      {/* 2. Page Header & Actions */}
      <div className="notif-header-row">
        <div className="notif-header-col-left">
          <span className="notif-section-tag">EXCEPTION TRIAGE</span>
          <h1 className="notif-page-title">Failed Notification Handling</h1>
          <p className="notif-page-subtitle">
            Review delivery exceptions, telecom timeouts and automated fallback rerouting.
          </p>
        </div>

        <div className="notif-header-actions">
          <button 
            type="button" 
            className="btn-notif-outline"
            onClick={onExport}
          >
            <Download size={13} />
            <span>Export Log</span>
          </button>
          {exceptions.length > 0 && (
            <button 
              type="button" 
              className="btn-notif-primary"
              onClick={handleBatchRetry}
              disabled={isRetryingAll}
            >
              <RotateCcw size={13} className={isRetryingAll ? 'animate-spin' : ''} />
              <span>{isRetryingAll ? 'Retrying...' : `Batch Retry All (${exceptions.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Horizontal MODULE SCREENS Tab Bar */}
      <div className="notif-subscreens-bar">
        <span className="subscreens-label">MODULE SCREENS</span>
        <div className="subscreens-tabs-list">
          {moduleScreens.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`module-screen-tab-btn ${tab.id === 'failed-handling' ? 'active' : ''}`}
              onClick={() => onSelectScreen(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Top Exception Status Banner */}
      <div className="notif-crisis-alert-bar" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
        <div className="alert-bar-left">
          <ShieldAlert size={16} color="#dc2626" />
          <strong style={{ color: '#7f1d1d' }}>
            {exceptions.length > 0 ? `${exceptions.length} exceptions require manual or automated intervention` : 'All delivery exceptions cleared! Zero failed messages pending.'}
          </strong>
        </div>
        <span style={{ fontSize: '11px', color: '#b91c1c', fontWeight: 600 }}>
          Carrier Incident Ticket: INC-COLOMBO-FLOOD-88
        </span>
      </div>

      {/* 5. Exception Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {exceptions.map(item => (
          <div 
            key={item.id}
            style={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderLeft: '4px solid #ef4444', 
              borderRadius: '10px', 
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{item.ref} · {item.recipient}</strong>
                  <span style={{ background: '#fef2f2', color: '#991b1b', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                    {item.channel} Delivery Failed
                  </span>
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px' }}>
                    {item.timestamp}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Destination: <b>{item.phone}</b> · Error Code: <code style={{ color: '#dc2626' }}>{item.failureCode}</code>
                </div>
              </div>

              <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                Attempts: {item.attemptCount} / 3
              </span>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: '#92400e' }}>
              <strong>Root Cause:</strong> {item.failureReason}
              <div style={{ marginTop: '4px', color: '#78350f' }}>
                <strong>Recommended Resolution:</strong> {item.suggestedAction}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
              <button 
                type="button" 
                className="btn-notif-outline"
                onClick={() => handleRerouteRadio(item.ref)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Radio size={12} color="#0f766e" />
                <span>Reroute via VHF Radio</span>
              </button>
              <button 
                type="button" 
                className="btn-notif-outline"
                onClick={() => showToast?.(`Automated voice phone call triggered to ${item.phone}`, 'info')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <PhoneCall size={12} color="#2563eb" />
                <span>Trigger Voice Call</span>
              </button>
              <button 
                type="button" 
                className="btn-notif-primary"
                onClick={() => handleRetrySingle(item.id, item.ref)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={12} />
                <span>Retry Transmission</span>
              </button>
            </div>
          </div>
        ))}

        {exceptions.length === 0 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '48px', textAlign: 'center' }}>
            <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Zero Failed Transmissions</h3>
            <p style={{ margin: '6px 0 16px 0', fontSize: '12.5px', color: '#64748b' }}>
              All recipient dispatches have been confirmed and acknowledged by local telecom towers.
            </p>
            <button 
              type="button" 
              className="btn-notif-outline"
              onClick={() => onSelectScreen('inbox')}
            >
              Return to Notification Inbox
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

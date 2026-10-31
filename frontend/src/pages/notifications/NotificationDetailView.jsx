import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Download, 
  Copy, 
  Check, 
  Send, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Globe, 
  Users, 
  Activity,
  Smartphone,
  Mail,
  Radio
} from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from './notificationData';

export const NotificationDetailView = ({ 
  notification, 
  onBackToHub, 
  onSelectScreen, 
  onExport,
  showToast 
}) => {
  const currentNotif = notification || INITIAL_NOTIFICATIONS[0];
  const [langTab, setLangTab] = useState('en');
  const [copiedHash, setCopiedHash] = useState(false);

  const moduleScreens = [
    { id: 'inbox', label: 'Notification Inbox' },
    { id: 'compose', label: 'Compose Notification' },
    { id: 'recipient-drawer', label: 'Recipient Detail Drawer' },
    { id: 'delivery-status', label: 'Email & SMS Delivery Status' },
    { id: 'failed-handling', label: 'Failed Notification Handling' },
    { id: 'detail', label: 'Notification Detail' }
  ];

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(currentNotif.sha256);
    setCopiedHash(true);
    showToast?.('Cryptographic audit hash copied to clipboard', 'success');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleResendBroadcast = () => {
    showToast?.(`Broadcast ${currentNotif.id} re-queued for dispatch across ${currentNotif.category}`, 'success');
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
          Notification Centre / Notification Detail · {currentNotif.id}
        </span>
      </div>

      {/* 2. Page Header & Actions */}
      <div className="notif-header-row">
        <div className="notif-header-col-left">
          <span className="notif-section-tag">COMMUNICATIONS</span>
          <h1 className="notif-page-title">Notification Detail</h1>
          <p className="notif-page-subtitle">
            Manage recipient notifications across email, SMS and push integration channels. · Fictional demonstration data
          </p>
        </div>

        <div className="notif-header-actions">
          <button 
            type="button" 
            className="btn-notif-outline"
            onClick={onExport}
          >
            <Download size={13} />
            <span>Export Record</span>
          </button>
          <button 
            type="button" 
            className="btn-notif-primary"
            onClick={handleResendBroadcast}
          >
            <Send size={13} />
            <span>Resend Broadcast</span>
          </button>
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
              className={`module-screen-tab-btn ${tab.id === 'detail' ? 'active' : ''}`}
              onClick={() => onSelectScreen(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Top Overview Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{currentNotif.id}</span>
              <span className={`status-pill-badge ${currentNotif.status.toLowerCase()}`}>
                <span className="dot-status"></span>
                <span>{currentNotif.status}</span>
              </span>
              <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                {currentNotif.priority} Priority
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f766e' }}>
              {currentNotif.name}
            </h2>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              {currentNotif.subtitle}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Operational Area</div>
              <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{currentNotif.operationalArea}</strong>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Responsible Auth</div>
              <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{currentNotif.organisation}</strong>
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginTop: '4px' }}>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Target Recipients</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{currentNotif.recipientsCount}</div>
          </div>
          <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: '11px', color: '#166534' }}>Delivered Successfully</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803d' }}>{currentNotif.deliveredCount}</div>
          </div>
          <div style={{ background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fecaca' }}>
            <span style={{ fontSize: '11px', color: '#991b1b' }}>Failed / Bounced</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>{currentNotif.failedCount}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Transit Latency</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f766e' }}>{currentNotif.deliveryTimeMs} ms</div>
          </div>
        </div>
      </div>

      {/* 5. Multilingual Payload Viewer & Milestone Stepper */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        {/* Left: Multilingual Content Box */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="#0f766e" />
              <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>Broadcast Message Payload</h3>
            </div>
            {/* Language Switcher Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '2px', borderRadius: '6px' }}>
              {[
                { id: 'en', label: 'English' },
                { id: 'si', label: 'සිංහල' },
                { id: 'ta', label: 'தமிழ்' }
              ].map(lang => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLangTab(lang.id)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: langTab === lang.id ? '#ffffff' : 'transparent',
                    color: langTab === lang.id ? '#0f766e' : '#64748b',
                    fontSize: '11px',
                    fontWeight: langTab === lang.id ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: langTab === lang.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', fontSize: '13px', lineHeight: 1.6, color: '#334155' }}>
            {currentNotif.translations[langTab]}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#64748b' }}>
            <Radio size={13} color="#059669" />
            <span>Channels: <strong>{currentNotif.channels.join(' · ')}</strong></span>
            <span>· Geofence: <strong>{currentNotif.operationalArea}</strong></span>
          </div>
        </div>

        {/* Right: Delivery Milestones Stepper */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#0f766e" />
            <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>Delivery Milestones</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { step: '1. Ingestion & Validation', time: '09:55 AM', desc: 'Message queued by System Administrator', status: 'Completed', color: '#16a34a' },
              { step: '2. Geofence & Audience Filtering', time: '09:56 AM', desc: 'Targeted 142 valid MSISDNs in Sector 3', status: 'Completed', color: '#16a34a' },
              { step: '3. Gateway SMPP Handshake', time: '09:57 AM', desc: 'Accepted by Dialog & Mobitel SMS Relays', status: 'Completed', color: '#16a34a' },
              { step: '4. Cell Tower Broadcast', time: '09:58 AM', desc: 'Signal acknowledged across 4 local BTS nodes', status: 'Completed', color: '#16a34a' },
              { step: '5. Handset Read Receipts', time: '09:58 AM', desc: '140 of 142 handsets delivered (98.6%)', status: 'Completed', color: '#16a34a' }
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ecfdf5', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0, marginTop: '2px' }}>
                  ✓
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '12px', color: '#0f172a' }}>{m.step}</strong>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Cryptographic Proof & Ledger Audit */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#059669" />
            <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>Cryptographic Proof of Delivery (SHA-256)</strong>
          </div>
          <code style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block', wordBreak: 'break-all' }}>
            {currentNotif.sha256}
          </code>
        </div>

        <button 
          type="button" 
          className="btn-notif-outline"
          onClick={handleCopyHash}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          {copiedHash ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
          <span>{copiedHash ? 'Hash Copied' : 'Copy Hash'}</span>
        </button>
      </div>
    </div>
  );
};

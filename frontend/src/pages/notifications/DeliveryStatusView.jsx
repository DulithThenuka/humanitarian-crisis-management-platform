import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Download, 
  RefreshCw, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Smartphone, 
  Mail, 
  Send, 
  Activity, 
  Zap, 
  Layers,
  Search,
  Server
} from 'lucide-react';
import { TELEMETRY_DELIVERY_DATA } from './notificationData';

export const DeliveryStatusView = ({ 
  onBackToHub, 
  onSelectScreen, 
  onExport,
  showToast 
}) => {
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [isPinging, setIsPinging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const moduleScreens = [
    { id: 'inbox', label: 'Notification Inbox' },
    { id: 'compose', label: 'Compose Notification' },
    { id: 'recipient-drawer', label: 'Recipient Detail Drawer' },
    { id: 'delivery-status', label: 'Email & SMS Delivery Status' },
    { id: 'failed-handling', label: 'Failed Notification Handling' },
    { id: 'detail', label: 'Notification Detail' }
  ];

  const handleTestPing = () => {
    setIsPinging(true);
    showToast?.('Testing carrier SMPP & SES gateway connections...', 'info');
    setTimeout(() => {
      setIsPinging(false);
      showToast?.('All 4 delivery relays responsive! Latency: 22ms. Signal: 100%', 'success');
    }, 1200);
  };

  const filteredRecords = TELEMETRY_DELIVERY_DATA.pipelineRecords.filter(item => {
    const matchesChannel = selectedChannel === 'ALL' || item.channel.toUpperCase() === selectedChannel.toUpperCase();
    const matchesSearch = !searchTerm || 
      item.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.carrier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesChannel && matchesSearch;
  });

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
          Notification Centre / Email &amp; SMS Delivery Status
        </span>
      </div>

      {/* 2. Page Header & Actions */}
      <div className="notif-header-row">
        <div className="notif-header-col-left">
          <span className="notif-section-tag">TELEMETRY &amp; INFRASTRUCTURE</span>
          <h1 className="notif-page-title">Email &amp; SMS Delivery Status</h1>
          <p className="notif-page-subtitle">
            Real-time multi-carrier telemetry, gateway throughput and dispatch handshake monitoring.
          </p>
        </div>

        <div className="notif-header-actions">
          <button 
            type="button" 
            className="btn-notif-outline"
            onClick={onExport}
          >
            <Download size={13} />
            <span>Export Manifest</span>
          </button>
          <button 
            type="button" 
            className="btn-notif-primary"
            onClick={handleTestPing}
            disabled={isPinging}
          >
            <Radio size={14} className={isPinging ? 'animate-pulse' : ''} />
            <span>{isPinging ? 'Testing Ping...' : 'Test Gateway Ping'}</span>
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
              className={`module-screen-tab-btn ${tab.id === 'delivery-status' ? 'active' : ''}`}
              onClick={() => onSelectScreen(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Top Telemetry KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>SMS Delivery Rate</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{TELEMETRY_DELIVERY_DATA.summary.smsRate}</div>
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>↑ 1,240 / 1,260 delivered (18ms avg)</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Email In-box Rate</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{TELEMETRY_DELIVERY_DATA.summary.emailRate}</div>
          <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>↑ 850 / 878 delivered (0 bounces)</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Push FCM / APNs</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{TELEMETRY_DELIVERY_DATA.summary.pushRate}</div>
          <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600 }}>↑ 2,410 active push receipts</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Average Gateway Latency</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{TELEMETRY_DELIVERY_DATA.summary.avgLatencyMs} ms</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>P99: 45ms · Cluster Health 100%</span>
        </div>
      </div>

      {/* 5. Live Gateway Node Status Cards */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={16} color="#0f766e" />
            <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>Active Gateway Connectors</h3>
          </div>
          <span className="badge-operational-status" style={{ fontSize: '10.5px' }}>
            <span className="dot-pulse-green"></span>
            All Core Relays Online
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
          {TELEMETRY_DELIVERY_DATA.gateways.map((gw, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{gw.name}</strong>
                <span style={{ background: '#ecfdf5', color: '#065f46', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>
                  {gw.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '11px', marginTop: '6px' }}>
                <span>Latency: <b style={{ color: '#059669' }}>{gw.latency}</b></span>
                <span>Uptime: <b>{gw.uptime}</b></span>
                <span>{gw.protocol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Live Delivery Pipeline Records Table */}
      <div className="notif-main-card">
        <div className="notif-table-toolbar">
          <div className="toolbar-left-filters">
            <div className="notif-search-field">
              <Search size={14} className="notif-search-icon" />
              <input
                type="text"
                placeholder="Search delivery pipeline records..."
                className="notif-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {['ALL', 'SMS', 'EMAIL', 'PUSH'].map(ch => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setSelectedChannel(ch)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: selectedChannel === ch ? '#0f766e' : '#cbd5e1',
                    background: selectedChannel === ch ? '#133a30' : '#ffffff',
                    color: selectedChannel === ch ? '#ffffff' : '#475569',
                    fontSize: '11.5px',
                    fontWeight: selectedChannel === ch ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Showing <b>{filteredRecords.length}</b> live transmissions
          </span>
        </div>

        <table className="notif-data-table">
          <thead>
            <tr>
              <th>PIPELINE ID</th>
              <th>REF</th>
              <th>RECIPIENT / DESTINATION</th>
              <th>CHANNEL</th>
              <th>CARRIER / RELAY</th>
              <th>DISPATCH</th>
              <th>DELIVERY</th>
              <th>LATENCY</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(item => (
              <tr key={item.id} className="notif-table-row">
                <td className="cell-reference">{item.id}</td>
                <td><strong style={{ color: '#0f766e' }}>{item.ref}</strong></td>
                <td><span style={{ fontWeight: 600 }}>{item.recipient}</span></td>
                <td><span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{item.channel}</span></td>
                <td style={{ color: '#475569', fontSize: '11.5px' }}>{item.carrier}</td>
                <td style={{ color: '#64748b', fontSize: '11px' }}>{item.dispatchTime}</td>
                <td style={{ color: '#64748b', fontSize: '11px' }}>{item.deliverTime}</td>
                <td style={{ color: item.status === 'Failed' ? '#ef4444' : '#059669', fontWeight: 600, fontSize: '11.5px' }}>{item.latency}</td>
                <td>
                  <span className={`status-pill-badge ${item.status.toLowerCase()}`}>
                    <span className="dot-status"></span>
                    <span>{item.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

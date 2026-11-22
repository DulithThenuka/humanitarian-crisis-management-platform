import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  Megaphone,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  Clock,
  Radio,
  CheckCircle2,
  X,
  Share2,
  PhoneCall,
  ExternalLink,
  Info
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { homeService } from '../../../services/homeService';
import { EMERGENCY_ALERTS_LIST } from '../data/citizenPortalData';
import { useRealtimeRefresh } from '../../../hooks/useRealtimeRefresh';

const formatAlertTime = (dateStr) => {
  if (!dateStr) return 'Verified';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Verified';
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Verified';
  }
};

export const EmergencyAlertsView = ({ showToast }) => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('critical');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = null;
      try {
        const res = await adminService.getBroadcasts();
        if (res?.succeeded && Array.isArray(res.data)) {
          data = res.data;
        } else if (Array.isArray(res?.data)) {
          data = res.data;
        } else if (Array.isArray(res)) {
          data = res;
        }
      } catch (adminErr) {
        console.warn('adminService.getBroadcasts fallback to homeService', adminErr);
        try {
          const homeRes = await homeService.getBroadcasts();
          if (homeRes?.data?.succeeded && Array.isArray(homeRes.data.data)) {
            data = homeRes.data.data;
          } else if (Array.isArray(homeRes?.data)) {
            data = homeRes.data;
          }
        } catch (homeErr) {
          console.warn('homeService.getBroadcasts fallback failed', homeErr);
        }
      }

      if (data && data.length > 0) {
        setBroadcasts(data);
      } else if (data && data.length === 0) {
        setBroadcasts([]);
      } else {
        // Fallback demo data only if network/API totally offline
        setBroadcasts(
          EMERGENCY_ALERTS_LIST.map((d) => ({
            id: d.id,
            title: d.title,
            severity: d.severity,
            message: d.description,
            targetRegion: d.location,
            sentBy: 'Disaster Management Centre',
            status: 'Active Live',
            isActive: true,
            sentAt: new Date().toISOString()
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load emergency broadcasts:', err);
      setError('Could not connect to emergency broadcast server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  useRealtimeRefresh(['broadcasts', 'alerts'], fetchAlerts);

  const normalizedAlerts = useMemo(() => {
    return (broadcasts || []).map((b) => {
      const severity = b.severity || 'Advisory';
      const sevLower = severity.toLowerCase();
      const isEmergency = sevLower === 'emergency' || sevLower === 'critical';
      const isWarning = sevLower === 'warning' || sevLower === 'high';
      const severityType = isEmergency ? 'critical' : isWarning ? 'warning' : 'info';
      const borderAccent = isEmergency ? '#dc2626' : isWarning ? '#f59e0b' : '#2563eb';

      const isArchived =
        b.isActive === false ||
        (typeof b.status === 'string' &&
          (b.status.toLowerCase().includes('archive') ||
            b.status.toLowerCase().includes('resolve') ||
            b.status.toLowerCase().includes('de-escalat')));

      return {
        id: b.id?.toString() || `alt-${Math.random()}`,
        rawId: b.id,
        title: b.title || 'Emergency Advisory',
        severity,
        severityType: isArchived ? 'archived' : severityType,
        borderAccent: isArchived ? '#94a3b8' : borderAccent,
        time: formatAlertTime(b.sentAt),
        rawSentAt: b.sentAt,
        location: b.targetRegion || 'Western Province Disaster Zone',
        description: b.message || 'No additional warning details specified.',
        channels: Array.isArray(b.channels)
          ? b.channels
          : typeof b.channels === 'string'
          ? b.channels.split(',').map((s) => s.trim()).filter(Boolean)
          : ['SMS Broadcast', 'Push Notification'],
        targetAudience: b.targetAudience || 'All Registered Citizens',
        sentBy: b.sentBy || 'DMC National Emergency Command',
        deliveryRate: b.deliveryRate || '99.2%',
        status: b.status || (isArchived ? 'Archived' : 'Active Live'),
        isActive: !isArchived
      };
    });
  }, [broadcasts]);

  const criticalAlerts = useMemo(
    () => normalizedAlerts.filter((a) => a.isActive && a.severityType === 'critical'),
    [normalizedAlerts]
  );
  const highAlerts = useMemo(
    () => normalizedAlerts.filter((a) => a.isActive && a.severityType === 'warning'),
    [normalizedAlerts]
  );
  const announcementAlerts = useMemo(
    () => normalizedAlerts.filter((a) => a.isActive && a.severityType === 'info'),
    [normalizedAlerts]
  );
  const pastAlerts = useMemo(
    () => normalizedAlerts.filter((a) => !a.isActive),
    [normalizedAlerts]
  );

  const counts = {
    critical: criticalAlerts.length,
    high: highAlerts.length,
    announcements: announcementAlerts.length,
    past: pastAlerts.length
  };

  const activeList = useMemo(() => {
    let list = [];
    if (activeTab === 'critical') list = criticalAlerts;
    else if (activeTab === 'high') list = highAlerts;
    else if (activeTab === 'announcements') list = announcementAlerts;
    else if (activeTab === 'past') list = pastAlerts;

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.sentBy.toLowerCase().includes(q)
    );
  }, [activeTab, criticalAlerts, highAlerts, announcementAlerts, pastAlerts, searchQuery]);

  const handleCopyAlert = (alert) => {
    const text = `[RELIEFCORE EMERGENCY ALERT]\nSeverity: ${alert.severity}\nTitle: ${alert.title}\nRegion: ${alert.location}\nMessage: ${alert.description}\nIssued by: ${alert.sentBy}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(alert.id);
    if (showToast) {
      showToast('Emergency alert details copied to clipboard.');
    }
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="cp-view-pretitle">VERIFIED PUBLIC SAFETY INFORMATION</span>
          <h1 className="cp-view-title">Emergency Alerts</h1>
          <p className="cp-view-subtitle">
            Authoritative multi-channel disaster alerts synchronized with the National Emergency Command.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="cp-btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '7px 12px' }}
            title="Refresh alerts from database"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh Alerts'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '450px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#738075' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by area, title, or keyword..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid #d4ded3',
              fontSize: '13px',
              outline: 'none',
              backgroundColor: '#ffffff'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#738075' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Error state banner */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#b91c1c',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchAlerts}
            style={{ background: 'none', border: 'none', color: '#b91c1c', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid #d4ded3',
          marginBottom: '20px',
          overflowX: 'auto'
        }}
      >
        <button
          onClick={() => setActiveTab('critical')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'critical' ? '#1e3d2c' : '#738075',
            borderBottom: activeTab === 'critical' ? '2.5px solid #1e3d2c' : '2.5px solid transparent',
            whiteSpace: 'nowrap'
          }}
        >
          Critical Alerts ({counts.critical})
        </button>

        <button
          onClick={() => setActiveTab('high')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'high' ? '#1e3d2c' : '#738075',
            borderBottom: activeTab === 'high' ? '2.5px solid #1e3d2c' : '2.5px solid transparent',
            whiteSpace: 'nowrap'
          }}
        >
          High Priority ({counts.high})
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'announcements' ? '#1e3d2c' : '#738075',
            borderBottom: activeTab === 'announcements' ? '2.5px solid #1e3d2c' : '2.5px solid transparent',
            whiteSpace: 'nowrap'
          }}
        >
          General Announcements ({counts.announcements})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'past' ? '#1e3d2c' : '#738075',
            borderBottom: activeTab === 'past' ? '2.5px solid #1e3d2c' : '2.5px solid transparent',
            whiteSpace: 'nowrap'
          }}
        >
          Past Alerts ({counts.past})
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#657367', fontSize: '13.5px' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#1e3d2c' }} />
          <div>Synchronizing with Emergency Broadcast System...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && activeList.length === 0 && (
        <div
          className="cp-card"
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px dashed #d4ded3'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#eef4ec',
              color: '#1e3d2c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto'
            }}
          >
            {activeTab === 'past' ? <Clock size={22} /> : <CheckCircle2 size={22} />}
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162e20', margin: '0 0 6px 0' }}>
            {activeTab === 'past'
              ? 'No Past Alerts Recorded'
              : searchQuery
              ? 'No Alerts Match Your Search'
              : `No Active ${activeTab === 'critical' ? 'Critical' : activeTab === 'high' ? 'High Priority' : 'General'} Alerts`}
          </h3>
          <p style={{ fontSize: '12.5px', color: '#657367', margin: '0 auto', maxWidth: '420px' }}>
            {activeTab === 'past'
              ? 'De-escalated and archived emergency broadcasts will appear in this log.'
              : searchQuery
              ? 'Try adjusting your search keywords to find relevant area broadcasts.'
              : 'All regional hazard and monitoring stations currently report stable parameters for this alert level.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="cp-btn-secondary"
              style={{ marginTop: '14px', fontSize: '12px' }}
            >
              Clear Search Query
            </button>
          )}
        </div>
      )}

      {/* Alert Cards List */}
      {!loading && activeList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeList.map((alt) => (
            <div
              key={alt.id}
              className="cp-card"
              style={{
                borderLeft: `4px solid ${alt.borderAccent}`,
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                backgroundColor: alt.severityType === 'archived' ? '#f8faf7' : '#ffffff',
                opacity: alt.severityType === 'archived' ? 0.9 : 1
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#f8faf7',
                    color: alt.borderAccent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {alt.severityType === 'info' ? (
                    <Megaphone size={18} />
                  ) : alt.severityType === 'archived' ? (
                    <Clock size={18} />
                  ) : (
                    <AlertTriangle size={18} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        backgroundColor:
                          alt.severityType === 'critical'
                            ? '#fee2e2'
                            : alt.severityType === 'warning'
                            ? '#fef3c7'
                            : alt.severityType === 'archived'
                            ? '#f1f5f9'
                            : '#eff6ff',
                        color:
                          alt.severityType === 'critical'
                            ? '#dc2626'
                            : alt.severityType === 'warning'
                            ? '#b45309'
                            : alt.severityType === 'archived'
                            ? '#64748b'
                            : '#2563eb'
                      }}
                    >
                      ● {alt.severity}
                    </span>

                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        backgroundColor: alt.isActive ? '#ecfdf5' : '#f1f5f9',
                        color: alt.isActive ? '#047857' : '#64748b'
                      }}
                    >
                      {alt.status}
                    </span>

                    <span style={{ fontSize: '11px', color: '#738075' }}>{alt.time}</span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162e20', margin: '2px 0 4px 0' }}>
                    {alt.title}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '11.5px',
                      color: '#657367',
                      marginBottom: '6px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} style={{ color: '#738075' }} />
                      <span>{alt.location}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Radio size={13} style={{ color: '#738075' }} />
                      <span>{alt.channels.join(' · ')}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#405044', margin: 0, lineHeight: 1.5 }}>
                    {alt.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => setSelectedAlert(alt)}
                  className="cp-btn-secondary"
                  style={{ whiteSpace: 'nowrap', fontSize: '12px', padding: '6px 14px' }}
                >
                  View Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedAlert(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: `2px solid ${selectedAlert.borderAccent}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px 16px 24px',
                borderBottom: '1px solid #e2e8dd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor:
                        selectedAlert.severityType === 'critical'
                          ? '#fee2e2'
                          : selectedAlert.severityType === 'warning'
                          ? '#fef3c7'
                          : selectedAlert.severityType === 'archived'
                          ? '#f1f5f9'
                          : '#eff6ff',
                      color:
                        selectedAlert.severityType === 'critical'
                          ? '#dc2626'
                          : selectedAlert.severityType === 'warning'
                          ? '#b45309'
                          : selectedAlert.severityType === 'archived'
                          ? '#64748b'
                          : '#2563eb'
                    }}
                  >
                    ● {selectedAlert.severity} Priority
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: selectedAlert.isActive ? '#ecfdf5' : '#f1f5f9',
                      color: selectedAlert.isActive ? '#047857' : '#64748b'
                    }}
                  >
                    {selectedAlert.status}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162e20', margin: 0 }}>
                  {selectedAlert.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#738075',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px' }}>
              {/* Meta details */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  backgroundColor: '#f8faf7',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '18px',
                  fontSize: '12px',
                  color: '#405044'
                }}
              >
                <div>
                  <strong style={{ color: '#162e20' }}>Target Region:</strong>
                  <div>{selectedAlert.location}</div>
                </div>
                <div>
                  <strong style={{ color: '#162e20' }}>Target Audience:</strong>
                  <div>{selectedAlert.targetAudience}</div>
                </div>
                <div>
                  <strong style={{ color: '#162e20' }}>Issuing Agency:</strong>
                  <div>{selectedAlert.sentBy}</div>
                </div>
                <div>
                  <strong style={{ color: '#162e20' }}>Dispatched At:</strong>
                  <div>{selectedAlert.time}</div>
                </div>
              </div>

              {/* Message text */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', marginBottom: '8px' }}>
                  Official Alert Broadcast Message
                </h4>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d4ded3',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    color: '#243328',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {selectedAlert.description}
                </div>
              </div>

              {/* Broadcast Transmission Gateways */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: '#162e20', marginBottom: '6px' }}>
                  Transmitted Communication Channels
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedAlert.channels.map((ch) => (
                    <span
                      key={ch}
                      style={{
                        padding: '3px 10px',
                        backgroundColor: '#eef4ec',
                        color: '#1e3d2c',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600
                      }}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Emergency Helplines Notice */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <PhoneCall size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Emergency Hotlines:</strong> DMC Disaster Center: <strong>117</strong> |
                  Suwa Seriya Ambulance: <strong>1990</strong> | Police Emergency: <strong>119</strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '1px solid #e2e8dd',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                backgroundColor: '#f8faf7',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px'
              }}
            >
              <button
                onClick={() => handleCopyAlert(selectedAlert)}
                className="cp-btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
              >
                <Share2 size={13} />
                <span>{copiedId === selectedAlert.id ? 'Copied to Clipboard!' : 'Copy Alert Details'}</span>
              </button>
              <button
                onClick={() => setSelectedAlert(null)}
                className="cp-btn-primary"
                style={{ fontSize: '12px', padding: '6px 18px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyAlertsView;

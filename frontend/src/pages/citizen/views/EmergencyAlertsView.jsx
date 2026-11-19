import React, { useState } from 'react';
import { AlertTriangle, Megaphone, MapPin } from 'lucide-react';
import { EMERGENCY_ALERTS_LIST } from '../data/citizenPortalData';

export const EmergencyAlertsView = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('critical');

  const handleViewAlert = (alert) => {
    if (showToast) {
      showToast(`Viewing alert briefing: ${alert.title}`);
    }
  };

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">VERIFIED PUBLIC SAFETY INFORMATION</span>
          <h1 className="cp-view-title">Emergency Alerts</h1>
          <p className="cp-view-subtitle">
            Only officially published prototype alerts are shown here.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid #d4ded3',
          marginBottom: '20px'
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
            borderBottom: activeTab === 'critical' ? '2.5px solid #1e3d2c' : '2.5px solid transparent'
          }}
        >
          Critical Alerts (1)
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
            borderBottom: activeTab === 'high' ? '2.5px solid #1e3d2c' : '2.5px solid transparent'
          }}
        >
          High Priority (2)
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
            borderBottom: activeTab === 'announcements' ? '2.5px solid #1e3d2c' : '2.5px solid transparent'
          }}
        >
          General Announcements (4)
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
            borderBottom: activeTab === 'past' ? '2.5px solid #1e3d2c' : '2.5px solid transparent'
          }}
        >
          Past Alerts
        </button>
      </div>

      {/* Alert Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {EMERGENCY_ALERTS_LIST.map((alt) => (
          <div
            key={alt.id}
            className="cp-card"
            style={{
              borderLeft: `4px solid ${alt.borderAccent}`,
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
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
                {alt.severityType === 'info' ? <Megaphone size={18} /> : <AlertTriangle size={18} />}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
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
                          : '#eff6ff',
                      color:
                        alt.severityType === 'critical'
                          ? '#dc2626'
                          : alt.severityType === 'warning'
                          ? '#b45309'
                          : '#2563eb'
                    }}
                  >
                    ● {alt.severity}
                  </span>
                  <span style={{ fontSize: '11px', color: '#738075' }}>{alt.time}</span>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162e20', margin: '2px 0 4px 0' }}>
                  {alt.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#657367', marginBottom: '4px' }}>
                  <MapPin size={13} style={{ color: '#738075' }} />
                  <span>{alt.location}</span>
                </div>

                <p style={{ fontSize: '12px', color: '#405044', margin: 0 }}>
                  {alt.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleViewAlert(alt)}
              className="cp-btn-secondary"
              style={{ flexShrink: 0 }}
            >
              View Alert
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyAlertsView;

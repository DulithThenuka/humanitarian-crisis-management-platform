import React, { useState } from 'react';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'RELIEFCORE Humanitarian Platform',
    emergencyMode: true,
    emailNotifications: true,
    dataSyncInterval: '15 mins',
    language: 'English'
  });

  return (
    <div style={{ padding: '28px', maxWidth: '1000px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>System Settings</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Configure platform preferences, notification channels, and operational thresholds</p>
      </div>

      {/* Settings Form Section */}
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Platform Title / Name</label>
          <input 
            type="text" 
            value={settings.platformName} 
            onChange={(e) => setSettings({...settings, platformName: e.target.value})}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '13px' }} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Data Synchronization Interval</label>
            <select 
              value={settings.dataSyncInterval}
              onChange={(e) => setSettings({...settings, dataSyncInterval: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '13px' }}
            >
              <option>5 mins</option>
              <option>15 mins</option>
              <option>30 mins</option>
              <option>1 hour</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>System Language</label>
            <select 
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '13px' }}
            >
              <option>English</option>
              <option>Sinhala (සිංහල)</option>
              <option>Tamil (தமிழ்)</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#f8fafc' }}>Emergency High-Priority Broadcast</p>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Enable immediate alerts across all active coordinator dashboards</p>
            </div>
            <input 
              type="checkbox" 
              checked={settings.emergencyMode}
              onChange={(e) => setSettings({...settings, emergencyMode: e.target.checked})}
              style={{ width: '18px', height: '18px', accentColor: '#0d9488', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#f8fafc' }}>Email Notifications for Critical Requests</p>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Send automated email digests to assigned logistics officers</p>
            </div>
            <input 
              type="checkbox" 
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              style={{ width: '18px', height: '18px', accentColor: '#0d9488', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ padding: '10px 20px', backgroundColor: '#0d9488', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
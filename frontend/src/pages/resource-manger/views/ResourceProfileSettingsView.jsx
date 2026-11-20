import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Mail,
  Phone,
  Building,
  CheckCircle,
  Save,
  Lock,
  Key
} from 'lucide-react';
import { RESOURCE_MANAGER_USER } from '../data/resourceData';

export const ResourceProfileSettingsView = ({ showToast }) => {
  const [profile, setProfile] = useState({
    name: RESOURCE_MANAGER_USER.name,
    email: 'dilan.perera@reliefcore.gov.lk',
    phone: '+94 77 123 4567',
    station: 'Central Depot - Kelaniya',
    role: RESOURCE_MANAGER_USER.role,
    id: 'RM-2026-088'
  });

  const [toggles, setToggles] = useState({
    criticalAlerts: true,
    smsDispatch: true,
    dailySummary: true,
    twoFactorAudit: true
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast('Profile and operational preferences updated successfully.');
    }
  };

  return (
    <div className="rm-view-container">
      {/* Header */}
      <div className="rm-header-row">
        <div>
          <span className="rm-header-kicker">USER CREDENTIALS & OPERATIONAL POLICIES</span>
          <h1 className="rm-header-title">Profile & Settings</h1>
          <p className="rm-header-subtitle">
            Manage your relief coordinator identity, automated alert triggers and depot authorizations.
          </p>
        </div>
        <div className="rm-header-actions">
          <button type="button" className="rm-btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save Preferences
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'flex-start' }}>
        {/* Left: User Identity Card */}
        <div className="rm-section-box">
          <div style={{ textAlign: 'center', padding: '10px 0 16px 0', borderBottom: '1px solid var(--rm-border)' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                fontSize: 26,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
              }}
            >
              DP
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 4px 0', color: 'var(--rm-text-primary)' }}>
              {profile.name}
            </h3>
            <span className="rm-badge rm-badge-info" style={{ marginBottom: 8 }}>
              <span className="rm-badge-dot" />
              {profile.role}
            </span>
            <div style={{ fontSize: 11.5, color: 'var(--rm-text-muted)' }}>
              ID: {profile.id}
            </div>
          </div>

          <div style={{ padding: '16px 0 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--rm-text-secondary)' }}>
              <Mail size={15} color="var(--rm-primary-blue)" />
              <span>{profile.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--rm-text-secondary)' }}>
              <Phone size={15} color="var(--rm-primary-blue)" />
              <span>{profile.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--rm-text-secondary)' }}>
              <Building size={15} color="var(--rm-primary-blue)" />
              <span>{profile.station}</span>
            </div>
          </div>
        </div>

        {/* Right: Settings Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Identity & Station Form */}
          <div className="rm-section-box">
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 4px 0', color: 'var(--rm-text-primary)' }}>
              Station Contact Information
            </h3>
            <p style={{ fontSize: 12, color: 'var(--rm-text-muted)', margin: '0 0 16px 0' }}>
              Used on delivery waybills and allocation audit records.
            </p>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="rm-form-group">
                  <label className="rm-form-label">Full Name</label>
                  <input
                    type="text"
                    className="rm-form-input"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="rm-form-group">
                  <label className="rm-form-label">Operational Email</label>
                  <input
                    type="email"
                    className="rm-form-input"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div className="rm-form-group">
                  <label className="rm-form-label">Emergency Phone</label>
                  <input
                    type="text"
                    className="rm-form-input"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className="rm-form-group">
                  <label className="rm-form-label">Assigned Dispatch Station</label>
                  <select
                    className="rm-form-select"
                    value={profile.station}
                    onChange={(e) => setProfile({ ...profile, station: e.target.value })}
                  >
                    <option value="Central Depot - Kelaniya">Central Depot - Kelaniya</option>
                    <option value="Wattala Regional Store">Wattala Regional Store</option>
                    <option value="Biyagama Forward Base">Biyagama Forward Base</option>
                    <option value="Medical Cold Chain Facility">Medical Cold Chain Facility</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Automated Notification Triggers */}
          <div className="rm-section-box">
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 4px 0', color: 'var(--rm-text-primary)' }}>
              Operational Alert Policies
            </h3>
            <p style={{ fontSize: 12, color: 'var(--rm-text-muted)', margin: '0 0 16px 0' }}>
              Configure proactive signals and automated reorder alerts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                {
                  key: 'criticalAlerts',
                  title: 'Critical Stock Depletion Warnings',
                  desc: 'Notify immediately when warehouse reserves drop below reorder threshold.'
                },
                {
                  key: 'smsDispatch',
                  title: 'SMS Delivery Dispatches',
                  desc: 'Broadcast SMS notifications to convoy leads upon departure from Central Depot.'
                },
                {
                  key: 'dailySummary',
                  title: 'Daily 08:00 AM Inventory Digest',
                  desc: 'Email aggregated stock consumption manifests to Emergency Coordinator.'
                },
                {
                  key: 'twoFactorAudit',
                  title: 'Mandatory Review Checkbox on Allocation',
                  desc: 'Require explicit checklist confirmation and operational reason before commitment.'
                }
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--rm-text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--rm-text-muted)', marginTop: 2 }}>
                      {item.desc}
                    </div>
                  </div>

                  <label className="rm-toggle-switch">
                    <input
                      type="checkbox"
                      checked={toggles[item.key]}
                      onChange={() => handleToggle(item.key)}
                    />
                    <span className="rm-toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Role Access Boundary */}
          <div className="rm-section-box" style={{ borderLeft: '4px solid var(--rm-primary-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Shield size={18} color="var(--rm-primary-blue)" />
              <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--rm-text-primary)' }}>
                Role Access Boundary
              </h3>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--rm-text-secondary)', lineHeight: 1.45, margin: 0 }}>
              {RESOURCE_MANAGER_USER.accessBoundaryNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


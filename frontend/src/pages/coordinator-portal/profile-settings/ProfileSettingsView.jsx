import React, { useState } from 'react';
import {
  User,
  Shield,
  ShieldAlert,
  CheckCircle2,
  Save,
  Globe,
  Bell,
  Sliders,
  Mail,
  Lock
} from 'lucide-react';
import { PROFILE_SETTINGS_DATA } from '../data/coordinatorPortalData';
import './ProfileSettingsView.css';

export const ProfileSettingsView = ({ showToast }) => {
  const [profile, setProfile] = useState(PROFILE_SETTINGS_DATA);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Operational profile preferences updated successfully!', 'success');
  };

  return (
    <div className="ec-portal-canvas">
      {/* 1. Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">ROLE-BASED ACCOUNT</span>
          <h2 className="ec-review-main-title">Profile &amp; Settings</h2>
          <p className="ec-review-sub-meta">
            Manage personal operational preferences. System-wide security and administrator accounts are restricted.
          </p>
        </div>
        <button
          className="ec-btn-action-primary"
          onClick={handleSave}
        >
          <Save size={15} />
          <span>Save changes</span>
        </button>
      </div>

      {/* 2. Two-Column Layout */}
      <div className="ec-profile-layout-grid">
        {/* Left Column: Form & Coordinator Identity */}
        <div className="ec-profile-main-card">
          {/* User Banner */}
          <div className="ec-profile-user-banner">
            <div className="ec-profile-avatar-circle">
              MF
            </div>
            <div className="ec-profile-user-meta">
              <h3 className="ec-profile-name">{profile.fullName}</h3>
              <p className="ec-profile-role-dept">{profile.role} · {profile.organization}</p>
            </div>
            <div className="ec-profile-status-badge">
              <span className="ec-rc-status-dot"></span>
              <span>Active</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="ec-profile-form">
            <div className="ec-form-row">
              <div className="ec-form-field">
                <label className="ec-field-label">Display name</label>
                <input
                  type="text"
                  className="ec-form-input"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Work email</label>
                <input
                  type="email"
                  className="ec-form-input"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
            </div>

            <div className="ec-form-row">
              <div className="ec-form-field">
                <label className="ec-field-label">Default operational area</label>
                <select
                  className="ec-form-select"
                  value={profile.operationalArea}
                  onChange={(e) => setProfile({ ...profile, operationalArea: e.target.value })}
                >
                  <option value="Western Province Flood Response">Western Province Flood Response</option>
                  <option value="Kelani East Basin Operations">Kelani East Basin Operations</option>
                  <option value="Central Province Landslide Watch">Central Province Landslide Watch</option>
                </select>
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Language</label>
                <select
                  className="ec-form-select"
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                >
                  <option value="English">English</option>
                  <option value="Sinhala">Sinhala (සිංහල)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                </select>
              </div>
            </div>

            <div className="ec-form-row">
              <div className="ec-form-field">
                <label className="ec-field-label">Review reminder</label>
                <select
                  className="ec-form-select"
                  value={profile.reviewReminder}
                  onChange={(e) => setProfile({ ...profile, reviewReminder: e.target.value })}
                >
                  <option value="5 minutes before due">5 minutes before due</option>
                  <option value="10 minutes before due">10 minutes before due</option>
                  <option value="15 minutes before due">15 minutes before due</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Compact table density</label>
                <select
                  className="ec-form-select"
                  value={profile.compactDensity}
                  onChange={(e) => setProfile({ ...profile, compactDensity: e.target.value })}
                >
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Permission Summary & Security Guardrail */}
        <div className="ec-profile-side-card">
          <h4 className="ec-perm-card-title">Permission summary</h4>

          <div className="ec-perm-list">
            {profile.permissions.map((perm, idx) => (
              <div key={idx} className="ec-perm-item">
                <CheckCircle2 size={16} color="#16a34a" className="ec-perm-check" />
                <span>{perm}</span>
              </div>
            ))}
          </div>

          {/* Restricted Box */}
          <div className="ec-perm-restricted-card">
            <div className="ec-restricted-head">
              <ShieldAlert size={16} color="#b45309" />
              <span className="ec-restricted-title">Restricted</span>
            </div>
            <p className="ec-restricted-desc">{profile.restrictionNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

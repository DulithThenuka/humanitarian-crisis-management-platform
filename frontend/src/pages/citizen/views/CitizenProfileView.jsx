import React, { useState } from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { INITIAL_CITIZEN_PROFILE } from '../data/citizenPortalData';

export const CitizenProfileView = ({ showToast }) => {
  const [profile, setProfile] = useState(INITIAL_CITIZEN_PROFILE);

  const handleSave = () => {
    if (showToast) {
      showToast('Citizen profile and household preferences updated successfully');
    }
  };

  const handleChange = (field, val) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">CITIZEN ACCOUNT</span>
          <h1 className="cp-view-title">My Profile</h1>
          <p className="cp-view-subtitle">
            Manage the permitted information used for your assistance requests.
          </p>
        </div>
        <div>
          <button onClick={handleSave} className="cp-btn-primary">
            Save Changes
          </button>
        </div>
      </div>

      {/* 2-Column Split */}
      <div className="cp-grid-split" style={{ gridTemplateColumns: '2fr 1fr', gap: '22px' }}>
        {/* Left Card: Account details and household */}
        <div className="cp-card">
          {/* User profile row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '22px',
              borderBottom: '1px solid #edf1eb',
              marginBottom: '22px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#e5ebe0',
                  color: '#162e20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '16px'
                }}
              >
                {profile.shortName}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                  {profile.fullName}
                </h3>
                <div style={{ fontSize: '11.5px', color: '#657367', marginTop: '2px' }}>
                  Citizen account · Verified email
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast && showToast('Photo upload simulation')}
              className="cp-btn-secondary"
              style={{ fontSize: '11.5px', padding: '6px 12px' }}
            >
              Change photo
            </button>
          </div>

          {/* Form Fields: 2 Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
            <div>
              <label className="cp-form-label">Full name *</label>
              <input
                type="text"
                className="cp-form-input"
                value={profile.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
            </div>

            <div>
              <label className="cp-form-label">Email *</label>
              <input
                type="text"
                disabled
                className="cp-form-input"
                style={{ backgroundColor: '#f8faf7', color: '#738075', cursor: 'not-allowed' }}
                value={profile.email}
              />
            </div>

            <div>
              <label className="cp-form-label">Phone number</label>
              <input
                type="text"
                className="cp-form-input"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div>
              <label className="cp-form-label">Preferred language</label>
              <select
                className="cp-form-select"
                value={profile.preferredLanguage}
                onChange={(e) => handleChange('preferredLanguage', e.target.value)}
              >
                <option value="English">English</option>
                <option value="Sinhala">සිංහල (Sinhala)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
              </select>
            </div>

            <div>
              <label className="cp-form-label">General location</label>
              <input
                type="text"
                className="cp-form-input"
                value={profile.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>

            <div>
              <label className="cp-form-label">Contact preference</label>
              <select
                className="cp-form-select"
                value={profile.contactPreference}
                onChange={(e) => handleChange('contactPreference', e.target.value)}
              >
                <option value="SMS and phone call">SMS and phone call</option>
                <option value="SMS only">SMS only</option>
                <option value="Phone call only">Phone call only</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>

          {/* Subheading: Household & Assistance */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#657367', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
            HOUSEHOLD & ASSISTANCE INFORMATION
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '18px' }}>
            <div>
              <label className="cp-form-label">Household size</label>
              <input
                type="number"
                className="cp-form-input"
                value={profile.householdSize}
                onChange={(e) => handleChange('householdSize', e.target.value)}
              />
            </div>

            <div>
              <label className="cp-form-label">Accessibility requirements</label>
              <input
                type="text"
                className="cp-form-input"
                value={profile.accessibilityRequirements}
                onChange={(e) => handleChange('accessibilityRequirements', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Card: Privacy & Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="cp-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid #edf1eb',
                cursor: 'pointer'
              }}
              onClick={() => showToast && showToast('Opening security preferences')}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                  Privacy & Security
                </div>
                <div style={{ fontSize: '11px', color: '#657367', marginTop: '2px' }}>
                  Password, sessions and notification preferences
                </div>
              </div>
              <ChevronRight size={16} color="#9fa89e" />
            </div>

            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f8faf7',
                border: '1px solid #edf1eb',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}
            >
              <ShieldCheck size={16} style={{ color: '#1e3d2c', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '11px', color: '#405044', lineHeight: 1.45 }}>
                Sensitive details are only used to assess and coordinate your own assistance requests.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenProfileView;

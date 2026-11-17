import React, { useState } from 'react';
import { CheckCircle, ShieldAlert, ChevronDown, Check } from 'lucide-react';
import { INITIAL_RESOURCE_OFFICER } from '../data/resourceManagerData';

export const ProfileSettingsView = ({ showToast }) => {
  const [officer, setOfficer] = useState(INITIAL_RESOURCE_OFFICER);

  const handleSave = () => {
    if (showToast) {
      showToast('Profile and workflow preferences updated successfully');
    }
  };

  const handleChange = (field, value) => {
    setOfficer((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="rm-view-container">
      {/* View Header */}
      <div className="rm-view-header">
        <div>
          <span className="rm-view-pretitle">ROLE-BASED ACCOUNT</span>
          <h1 className="rm-view-title">Profile & Settings</h1>
          <p className="rm-view-subtitle">
            Manage resource workflow preferences without access to system-wide administration.
          </p>
        </div>
        <div className="rm-view-actions">
          <button onClick={handleSave} className="rm-btn-primary">
            Save changes
          </button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="rm-split-layout" style={{ gridTemplateColumns: '2fr 1.15fr', gap: '24px' }}>
        {/* Left Card: Account and Preferences */}
        <div className="rm-detail-card" style={{ padding: '24px' }}>
          {/* User profile banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '24px',
              borderBottom: '1px solid #edf1eb',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#e5ebe0',
                  color: '#162e20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '15px'
                }}
              >
                {officer.shortName}
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                  {officer.fullName}
                </h3>
                <p style={{ fontSize: '12px', color: '#657367', margin: '2px 0 0 0' }}>
                  {officer.role} · {officer.department}
                </p>
              </div>
            </div>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: 600,
                backgroundColor: '#dcfce7',
                color: '#15803d'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a'
                }}
              />
              Active
            </span>
          </div>

          {/* Form Fields: 2 Columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
          >
            {/* Display Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#657367',
                  marginBottom: '6px'
                }}
              >
                Display name
              </label>
              <input
                type="text"
                className="rm-form-input"
                value={officer.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
            </div>

            {/* Work Email */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#657367',
                  marginBottom: '6px'
                }}
              >
                Work email
              </label>
              <input
                type="text"
                className="rm-form-input"
                value={officer.email}
                disabled
                style={{ backgroundColor: '#f5f7f4', color: '#738075', cursor: 'not-allowed' }}
              />
            </div>

            {/* Default Storage Location */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#657367',
                  marginBottom: '6px'
                }}
              >
                Default storage location
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  className="rm-form-input"
                  style={{ appearance: 'none', paddingRight: '28px' }}
                  value={officer.defaultStorage}
                  onChange={(e) => handleChange('defaultStorage', e.target.value)}
                >
                  <option value="Central Depot">Central Depot</option>
                  <option value="Wattala Store">Wattala Store</option>
                  <option value="Biyagama Depot">Biyagama Depot</option>
                  <option value="Medical Store">Medical Store</option>
                </select>
                <ChevronDown size={14} className="rm-select-arrow" />
              </div>
            </div>

            {/* Low-stock notification threshold */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#657367',
                  marginBottom: '6px'
                }}
              >
                Low-stock notification threshold
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  className="rm-form-input"
                  style={{ appearance: 'none', paddingRight: '28px' }}
                  value={officer.thresholdType}
                  onChange={(e) => handleChange('thresholdType', e.target.value)}
                >
                  <option value="Use item thresholds">Use item thresholds</option>
                  <option value="15% remaining">15% remaining</option>
                  <option value="25% remaining">25% remaining</option>
                  <option value="Strict minimum">Strict minimum</option>
                </select>
                <ChevronDown size={14} className="rm-select-arrow" />
              </div>
            </div>

            {/* Allocation Reminders */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#657367',
                  marginBottom: '6px'
                }}
              >
                Allocation reminders
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  className="rm-form-input"
                  style={{ appearance: 'none', paddingRight: '28px' }}
                  value={officer.reminderFrequency}
                  onChange={(e) => handleChange('reminderFrequency', e.target.value)}
                >
                  <option value="Every 15 minutes for critical requests">
                    Every 15 minutes for critical requests
                  </option>
                  <option value="Every 30 minutes">Every 30 minutes</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Never">Never</option>
                </select>
                <ChevronDown size={14} className="rm-select-arrow" />
              </div>
            </div>

            {/* Table Density */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#657367',
                  marginBottom: '6px'
                }}
              >
                Table density
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  className="rm-form-input"
                  style={{ appearance: 'none', paddingRight: '28px' }}
                  value={officer.density}
                  onChange={(e) => handleChange('density', e.target.value)}
                >
                  <option value="Compact">Compact</option>
                  <option value="Default">Default</option>
                  <option value="Comfortable">Comfortable</option>
                </select>
                <ChevronDown size={14} className="rm-select-arrow" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Permission Summary */}
        <div className="rm-detail-card" style={{ padding: '24px' }}>
          <h2 className="rm-card-title" style={{ marginBottom: '18px' }}>
            Permission summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1.5px solid #16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a',
                  flexShrink: 0
                }}
              >
                <Check size={12} strokeWidth={3} />
              </div>
              <span style={{ fontSize: '12.5px', color: '#243328', fontWeight: 500 }}>
                View and update inventory
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1.5px solid #16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a',
                  flexShrink: 0
                }}
              >
                <Check size={12} strokeWidth={3} />
              </div>
              <span style={{ fontSize: '12.5px', color: '#243328', fontWeight: 500 }}>
                Review allocation requests
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1.5px solid #16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a',
                  flexShrink: 0
                }}
              >
                <Check size={12} strokeWidth={3} />
              </div>
              <span style={{ fontSize: '12.5px', color: '#243328', fontWeight: 500 }}>
                Record dispatch and delivery states
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1.5px solid #16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a',
                  flexShrink: 0
                }}
              >
                <Check size={12} strokeWidth={3} />
              </div>
              <span style={{ fontSize: '12.5px', color: '#243328', fontWeight: 500 }}>
                Manage supplier and donation receipts
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1.5px solid #16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a',
                  flexShrink: 0
                }}
              >
                <Check size={12} strokeWidth={3} />
              </div>
              <span style={{ fontSize: '12.5px', color: '#243328', fontWeight: 500 }}>
                View resource reports
              </span>
            </div>
          </div>

          {/* Restricted Notice Box */}
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}
          >
            <ShieldAlert size={18} style={{ color: '#d97706', marginTop: '1px', flexShrink: 0 }} />
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#92400e',
                  marginBottom: '2px'
                }}
              >
                Restricted
              </span>
              <p
                style={{
                  fontSize: '11px',
                  color: '#b45309',
                  lineHeight: '1.45',
                  margin: 0
                }}
              >
                Administrator accounts, system security, citizen credentials and audit modification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsView;

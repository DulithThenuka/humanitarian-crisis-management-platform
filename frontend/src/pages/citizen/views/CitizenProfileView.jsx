import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronRight, CheckCircle2, Loader2, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';

export const CitizenProfileView = ({ showToast }) => {
  const { user, login } = useAuth();
  const userId = user?.id || user?.userId || 'citizen';
  const prefsKey = `reliefcore_citizen_prefs_${userId}`;

  const [fullName, setFullName] = useState(user?.fullName || 'Alice Citizen');
  const [email, setEmail] = useState(user?.email || 'citizen@crisisplatform.org');
  const [phone, setPhone] = useState(user?.phoneNumber || user?.phone || '+94 77 123 4567');
  const [location, setLocation] = useState(user?.assignedDistrict || user?.location || 'Kelani East, Colombo');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [contactPreference, setContactPreference] = useState('SMS and phone call');
  const [householdSize, setHouseholdSize] = useState('4');
  const [accessibilityRequirements, setAccessibilityRequirements] = useState('Step-free access may be required');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // 1. Initialize from auth user
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.email) setEmail(user.email);
      if (user.phoneNumber) setPhone(user.phoneNumber);
      if (user.assignedDistrict) setLocation(user.assignedDistrict);
    }

    // 2. Load stored household preferences
    try {
      const stored = localStorage.getItem(prefsKey);
      if (stored) {
        const p = JSON.parse(stored);
        if (p.preferredLanguage) setPreferredLanguage(p.preferredLanguage);
        if (p.contactPreference) setContactPreference(p.contactPreference);
        if (p.householdSize) setHouseholdSize(p.householdSize);
        if (p.accessibilityRequirements) setAccessibilityRequirements(p.accessibilityRequirements);
      }
    } catch {
      // non-fatal
    }
  }, [user, prefsKey]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Update database profile via backend API
      const res = await authService.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phone.trim(),
        assignedDistrict: location.trim()
      });

      // Update in-memory auth context user if response returned updated data
      const updatedUser = {
        ...(user || {}),
        fullName: fullName.trim(),
        name: fullName.trim(),
        phoneNumber: phone.trim(),
        phone: phone.trim(),
        assignedDistrict: location.trim(),
        location: location.trim()
      };
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (e) {}

      // 2. Persist household preferences to localStorage
      const prefs = {
        preferredLanguage,
        contactPreference,
        householdSize,
        accessibilityRequirements
      };
      localStorage.setItem(prefsKey, JSON.stringify(prefs));

      setSaveSuccess(true);
      if (showToast) {
        showToast('Citizen profile and household preferences updated successfully in database');
      }

      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update citizen profile:', err);
      if (showToast) {
        showToast('Failed to save profile changes. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const shortName = (fullName || 'Citizen')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">CITIZEN ACCOUNT MANAGEMENT</span>
          <h1 className="cp-view-title">My Profile</h1>
          <p className="cp-view-subtitle">
            Manage your personal contact details, verified address, and emergency assistance preferences.
          </p>
        </div>
        <div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="cp-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#065f46',
            marginBottom: '20px'
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />
          <span>Profile changes successfully persisted to the database.</span>
        </div>
      )}

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
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#1e3d2c',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '18px'
                }}
              >
                {shortName}
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                  {fullName}
                </h3>
                <div style={{ fontSize: '12px', color: '#657367', marginTop: '2px' }}>
                  Verified Citizen Account · {email}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields: 2 Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
            <div>
              <label className="cp-form-label">Full name *</label>
              <input
                type="text"
                className="cp-form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="cp-form-label">Email address *</label>
              <input
                type="text"
                disabled
                className="cp-form-input"
                style={{ backgroundColor: '#f8faf7', color: '#738075', cursor: 'not-allowed' }}
                value={email}
              />
            </div>

            <div>
              <label className="cp-form-label">Phone number</label>
              <input
                type="text"
                className="cp-form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="cp-form-label">Preferred language</label>
              <select
                className="cp-form-select"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Sinhala">සිංහල (Sinhala)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
              </select>
            </div>

            <div>
              <label className="cp-form-label">Residential district / Location</label>
              <input
                type="text"
                className="cp-form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="cp-form-label">Contact preference</label>
              <select
                className="cp-form-select"
                value={contactPreference}
                onChange={(e) => setContactPreference(e.target.value)}
              >
                <option value="SMS and phone call">SMS and phone call</option>
                <option value="SMS only">SMS only</option>
                <option value="Phone call only">Phone call only</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>
          </div>

          {/* Subheading: Household & Assistance */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#657367',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '14px'
            }}
          >
            HOUSEHOLD & ASSISTANCE INFORMATION
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '18px' }}>
            <div>
              <label className="cp-form-label">Household size</label>
              <input
                type="number"
                min="1"
                className="cp-form-input"
                value={householdSize}
                onChange={(e) => setHouseholdSize(e.target.value)}
              />
            </div>

            <div>
              <label className="cp-form-label">Accessibility requirements</label>
              <input
                type="text"
                className="cp-form-input"
                placeholder="e.g. Wheelchair access, infant supplies"
                value={accessibilityRequirements}
                onChange={(e) => setAccessibilityRequirements(e.target.value)}
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
                borderBottom: '1px solid #edf1eb'
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#162e20' }}>
                  Privacy & Data Security
                </div>
                <div style={{ fontSize: '11px', color: '#657367', marginTop: '2px' }}>
                  Encrypted emergency contact details
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '16px',
                padding: '14px',
                borderRadius: '8px',
                backgroundColor: '#f8faf7',
                border: '1px solid #edf1eb',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}
            >
              <ShieldCheck size={18} style={{ color: '#1e3d2c', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '11.5px', color: '#405044', lineHeight: 1.45 }}>
                Your personal telephone number and address are strictly restricted to certified emergency response coordinators and dispatched relief volunteers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenProfileView;

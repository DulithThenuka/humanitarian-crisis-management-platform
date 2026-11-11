import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Users,
  HeartPulse,
  Building2,
  Bell,
  Edit3,
  Check,
  X,
  Plus,
  AlertTriangle,
  Clock,
  Compass,
  FileText,
  BadgeAlert,
  Save,
  CheckCircle2,
  Droplets,
  ExternalLink
} from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';
import './CitizenProfilePage.css';

const DEFAULT_PROFILE = {
  fullName: 'Dinithi Perera',
  nic: '199274810293',
  dob: '1992-06-14',
  gender: 'Female',
  bloodGroup: 'O+',
  phone: '077 123 4567',
  emergencyPhone: '071 987 6543 (Sunil Perera - Brother)',
  email: 'dinithi.perera@gmail.com',
  address: '45/2, Kelani Valley Road, Wellampitiya',
  district: 'Colombo',
  dsDivision: 'Kolonnawa',
  gnDivision: '512 - Sedawatta',
  hazardZone: 'High Risk (Kelani River Basin - Sector 3)',
  gpsCoords: '6.9382° N, 79.8821° E',
  evacuationTier: 'Tier 1 Priority (Elderly & Infant Present)',
  designatedShelter: 'St. Sebastian Maha Vidyalaya',
  designatedShelterDist: '1.2 km away',
  assemblyPoint: 'Wellampitiya Clock Tower Junction (Boat Pickup)',
  chronicConditions: 'None (Self); Mother has Stage 2 Hypertension',
  criticalMedications: 'Amlodipine 5mg (Daily for Mother), Infant Paracetamol syrup',
  mobilityRequirements: 'Wheelchair ramp required for elderly mother',
  dietaryNotes: 'Lactose-free infant formula required for 14-month child',
  notifications: {
    smsAlerts: true,
    voiceBroadcast: true,
    whatsApp: true,
    batterySaverMode: false
  },
  familyMembers: [
    {
      id: 1,
      name: 'Dinithi Perera',
      relation: 'Self (Head of Household)',
      age: 34,
      gender: 'Female',
      nic: '199274810293',
      bloodGroup: 'O+',
      specialNeed: 'None'
    },
    {
      id: 2,
      name: 'Kusal Perera',
      relation: 'Spouse',
      age: 37,
      gender: 'Male',
      nic: '198921405981',
      bloodGroup: 'A+',
      specialNeed: 'Community First Responder Volunteer'
    },
    {
      id: 3,
      name: 'Soma Perera',
      relation: 'Mother',
      age: 68,
      gender: 'Female',
      nic: '195861209384',
      bloodGroup: 'B+',
      specialNeed: 'Mobility impaired / Daily BP medication required'
    },
    {
      id: 4,
      name: 'Shenuka Perera',
      relation: 'Son',
      age: 1.2,
      gender: 'Male',
      nic: 'Pending Certificate',
      bloodGroup: 'O+',
      specialNeed: 'Infant formula & diapers required'
    }
  ]
};

export const CitizenProfilePage = ({ onBack }) => {
  const navigate = useNavigate();
  const alertCtx = useAlert();
  const showAlert = alertCtx?.showAlert || ((msg) => window.alert(msg));

  // Profile data stored in localStorage
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('reliefcore_citizen_profile');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('identity'); // 'identity' | 'family' | 'medical' | 'shelter' | 'alerts'
  const [editFormData, setEditFormData] = useState(profile);

  // New family member modal / row state
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relation: 'Dependent',
    age: '',
    gender: 'Female',
    nic: '',
    bloodGroup: 'O+',
    specialNeed: ''
  });

  useEffect(() => {
    setEditFormData(profile);
  }, [profile]);

  const { user } = useAuth();
  useEffect(() => {
    if (user?.fullName && user.fullName !== 'Amara Chen') {
      setProfile(prev => ({
        ...prev,
        fullName: user.fullName,
        email: user.email || prev.email,
        phone: user.phoneNumber || prev.phone
      }));
    }
  }, [user]);

  const handleSaveProfile = () => {
    setProfile(editFormData);
    try {
      localStorage.setItem('reliefcore_citizen_profile', JSON.stringify(editFormData));
    } catch (e) {
      console.error(e);
    }
    setIsEditing(false);
    showAlert('Citizen profile updated successfully!', 'success');
  };

  const handleCancelEdit = () => {
    setEditFormData(profile);
    setIsEditing(false);
  };

  const handleToggleNotif = (key) => {
    const updated = {
      ...profile,
      notifications: {
        ...profile.notifications,
        [key]: !profile.notifications[key]
      }
    };
    setProfile(updated);
    setEditFormData(updated);
    try {
      localStorage.setItem('reliefcore_citizen_profile', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showAlert('Emergency notification preferences updated.', 'info');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    const added = {
      id: Date.now(),
      ...newMember,
      age: Number(newMember.age) || 1
    };

    const updatedMembers = [...profile.familyMembers, added];
    const updated = {
      ...profile,
      familyMembers: updatedMembers
    };

    setProfile(updated);
    setEditFormData(updated);
    try {
      localStorage.setItem('reliefcore_citizen_profile', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setShowAddMember(false);
    setNewMember({
      name: '',
      relation: 'Dependent',
      age: '',
      gender: 'Female',
      nic: '',
      bloodGroup: 'O+',
      specialNeed: ''
    });
    showAlert(`Added ${added.name} to the household evacuation registry.`, 'success');
  };

  const handleRemoveMember = (id) => {
    if (profile.familyMembers.length <= 1) {
      showAlert('Cannot remove the primary head of household.', 'error');
      return;
    }
    const updatedMembers = profile.familyMembers.filter((m) => m.id !== id);
    const updated = { ...profile, familyMembers: updatedMembers };
    setProfile(updated);
    setEditFormData(updated);
    try {
      localStorage.setItem('reliefcore_citizen_profile', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showAlert('Member removed from household registry.', 'info');
  };

  return (
    <div className="profile-page-container">
      {/* ===================================================================
         1. Top Navigation Bar
         =================================================================== */}
      <div className="profile-top-nav-bar">
        <button
          className="profile-back-btn"
          onClick={() => {
            if (onBack) onBack();
            else navigate('/citizen');
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Citizen Portal</span>
        </button>

        <div className="profile-actions-bar">
          {isEditing ? (
            <>
              <button className="btn-profile-cancel" onClick={handleCancelEdit}>
                <X size={15} />
                <span>Cancel</span>
              </button>
              <button className="btn-profile-save" onClick={handleSaveProfile}>
                <Check size={16} />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button className="btn-profile-edit" onClick={() => setIsEditing(true)}>
              <Edit3 size={15} />
              <span>Edit Profile & Household</span>
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================
         2. Hero Profile Banner
         =================================================================== */}
      <div className="profile-hero-card">
        <div className="profile-hero-left">
          <div className="profile-avatar-large">
            <User size={38} />
          </div>

          <div>
            <h1 className="profile-name-title">{profile.fullName}</h1>
            <div className="profile-meta-tags">
              <span className="profile-tag-nic">NIC: {profile.nic}</span>
              <span className="profile-tag-verified">
                <ShieldCheck size={13} />
                <span>Verified Citizen (DRP Sri Lanka)</span>
              </span>
              <span className="profile-tag-hazard">
                <AlertTriangle size={13} />
                <span>Flood High Risk Zone</span>
              </span>
            </div>
          </div>
        </div>

        <div className="profile-hero-stats">
          <div className="profile-stat-box">
            <span className="stat-number">{profile.familyMembers.length}</span>
            <span className="stat-label-text">Household Roster</span>
          </div>
          <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
          <div className="profile-stat-box">
            <span className="stat-number">Tier 1</span>
            <span className="stat-label-text">Rescue Priority</span>
          </div>
          <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
          <div className="profile-stat-box">
            <span className="stat-number">1.2 km</span>
            <span className="stat-label-text">To Shelter</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
         3. Profile Subtabs Switcher
         =================================================================== */}
      <div className="profile-tabs-row">
        <button
          className={`profile-tab-btn ${activeTab === 'identity' ? 'active' : ''}`}
          onClick={() => setActiveTab('identity')}
        >
          <User size={16} />
          <span>Identity & Location</span>
        </button>

        <button
          className={`profile-tab-btn ${activeTab === 'family' ? 'active' : ''}`}
          onClick={() => setActiveTab('family')}
        >
          <Users size={16} />
          <span>Household Registry ({profile.familyMembers.length})</span>
        </button>

        <button
          className={`profile-tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          <HeartPulse size={16} />
          <span>Medical & Special Needs</span>
        </button>

        <button
          className={`profile-tab-btn ${activeTab === 'shelter' ? 'active' : ''}`}
          onClick={() => setActiveTab('shelter')}
        >
          <Building2 size={16} />
          <span>Designated Safe Shelter</span>
        </button>

        <button
          className={`profile-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <Bell size={16} />
          <span>Notification Preferences</span>
        </button>
      </div>

      {/* ===================================================================
         4. TAB CONTENT
         =================================================================== */}

      {/* -------------------- TAB 1: IDENTITY & LOCATION -------------------- */}
      {activeTab === 'identity' && (
        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">
              <MapPin size={18} color="#0e6f76" />
              <span>Residential Address & Geolocation</span>
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Used by DMC rescue boats and food dispatch units
            </span>
          </div>

          <div className="profile-grid-2col">
            <div className="profile-field-block">
              <span className="field-label">Primary Residential Address</span>
              {isEditing ? (
                <input
                  type="text"
                  className="field-input"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                />
              ) : (
                <span className="field-value">{profile.address}</span>
              )}
            </div>

            <div className="profile-field-block">
              <span className="field-label">District & Divisional Secretariat</span>
              <span className="field-value">
                {profile.district} District &bull; {profile.dsDivision} DS
              </span>
            </div>

            <div className="profile-field-block">
              <span className="field-label">Grama Niladhari Division</span>
              <span className="field-value">{profile.gnDivision}</span>
            </div>

            <div className="profile-field-block">
              <span className="field-label">GPS Geolocation Coordinates</span>
              <span className="field-value" style={{ fontFamily: 'monospace', color: '#0e6f76' }}>
                {profile.gpsCoords}
              </span>
            </div>

            <div className="profile-field-block">
              <span className="field-label">Primary Mobile Phone (SMS / Calls)</span>
              {isEditing ? (
                <input
                  type="tel"
                  className="field-input"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              ) : (
                <span className="field-value">{profile.phone}</span>
              )}
            </div>

            <div className="profile-field-block">
              <span className="field-label">Emergency Next of Kin Contact</span>
              {isEditing ? (
                <input
                  type="text"
                  className="field-input"
                  value={editFormData.emergencyPhone}
                  onChange={(e) => setEditFormData({ ...editFormData, emergencyPhone: e.target.value })}
                />
              ) : (
                <span className="field-value">{profile.emergencyPhone}</span>
              )}
            </div>

            <div className="profile-field-block">
              <span className="field-label">Registered Email</span>
              {isEditing ? (
                <input
                  type="email"
                  className="field-input"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              ) : (
                <span className="field-value">{profile.email}</span>
              )}
            </div>

            <div className="profile-field-block">
              <span className="field-label">National Flood Hazard Classification</span>
              <span className="field-value" style={{ color: '#b91c1c', fontWeight: 700 }}>
                {profile.hazardZone}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 2: FAMILY & HOUSEHOLD ROSTER -------------------- */}
      {activeTab === 'family' && (
        <div className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2 className="profile-card-title">
                <Users size={18} color="#0e6f76" />
                <span>Household Family Roster & Evacuation Manifest</span>
              </h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Total {profile.familyMembers.length} persons recorded. Accurate counts determine relief ration packs.
              </span>
            </div>

            <button className="btn-add-member" onClick={() => setShowAddMember(true)}>
              <Plus size={15} />
              <span>Add Member</span>
            </button>
          </div>

          {/* Add member inline modal/form */}
          {showAddMember && (
            <form
              onSubmit={handleAddMember}
              style={{
                background: '#f0fdfa',
                border: '1.5px solid #5eead4',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '18px'
              }}
            >
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#0f766e' }}>
                Add New Household Member
              </h4>
              <div className="profile-grid-2col">
                <div>
                  <label className="field-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="field-input"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="field-label">Relationship *</label>
                  <select
                    className="field-input"
                    value={newMember.relation}
                    onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent / Mother">Parent / Mother</option>
                    <option value="Parent / Father">Parent / Father</option>
                    <option value="Child / Son">Child / Son</option>
                    <option value="Child / Daughter">Child / Daughter</option>
                    <option value="Elderly Relative">Elderly Relative</option>
                    <option value="Other Dependent">Other Dependent</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Age *</label>
                  <input
                    type="number"
                    required
                    className="field-input"
                    value={newMember.age}
                    onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="field-label">Blood Group</label>
                  <select
                    className="field-input"
                    value={newMember.bloodGroup}
                    onChange={(e) => setNewMember({ ...newMember, bloodGroup: e.target.value })}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="field-label">Medical Condition / Special Assistance Need</label>
                  <input
                    type="text"
                    placeholder="e.g. Asthma inhaler, wheelchair, infant diet, diabetic"
                    className="field-input"
                    value={newMember.specialNeed}
                    onChange={(e) => setNewMember({ ...newMember, specialNeed: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
                <button
                  type="button"
                  className="btn-profile-cancel"
                  onClick={() => setShowAddMember(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-profile-save">
                  Add to Manifest
                </button>
              </div>
            </form>
          )}

          <div className="family-roster-grid">
            {profile.familyMembers.map((m) => (
              <div key={m.id} className="family-member-card">
                <div className="member-header-row">
                  <h3 className="member-name">{m.name}</h3>
                  <span className="member-relation-tag">{m.relation}</span>
                </div>

                <div className="member-info-list">
                  <div>
                    <strong>Age:</strong> {m.age} years &bull; <strong>Gender:</strong> {m.gender}
                  </div>
                  <div>
                    <strong>Blood Group:</strong> <span style={{ color: '#dc2626', fontWeight: 700 }}>{m.bloodGroup}</span>
                  </div>
                  <div>
                    <strong>NIC:</strong> {m.nic || 'Not Applicable'}
                  </div>
                </div>

                {m.specialNeed && m.specialNeed !== 'None' && (
                  <div className="member-badge-warning">
                    <AlertTriangle size={13} />
                    <span>{m.specialNeed}</span>
                  </div>
                )}

                {profile.familyMembers.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '11px',
                      position: 'absolute',
                      bottom: '10px',
                      right: '12px'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- TAB 3: MEDICAL & SPECIAL NEEDS -------------------- */}
      {activeTab === 'medical' && (
        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">
              <HeartPulse size={18} color="#0e6f76" />
              <span>Medical Vulnerability & Special Rescue Requirements</span>
            </h2>
          </div>

          <div className="medical-alert-banner">
            <BadgeAlert size={20} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Dispatch Priority Advisory:</strong> Because your household includes an infant and an elderly
              family member requiring mobility assistance, your household is classified as <strong>Tier 1 High Priority</strong>{' '}
              on the Western Province automated dispatch algorithm.
            </div>
          </div>

          <div className="profile-grid-2col">
            <div className="profile-field-block">
              <span className="field-label">Chronic Medical Conditions</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  className="field-input"
                  value={editFormData.chronicConditions}
                  onChange={(e) => setEditFormData({ ...editFormData, chronicConditions: e.target.value })}
                />
              ) : (
                <span className="field-value">{profile.chronicConditions}</span>
              )}
            </div>

            <div className="profile-field-block">
              <span className="field-label">Critical Daily Medications Required</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  className="field-input"
                  value={editFormData.criticalMedications}
                  onChange={(e) => setEditFormData({ ...editFormData, criticalMedications: e.target.value })}
                />
              ) : (
                <span className="field-value">{profile.criticalMedications}</span>
              )}
            </div>

            <div className="profile-field-block">
              <span className="field-label">Mobility & Evacuation Equipment Needed</span>
              {isEditing ? (
                <input
                  type="text"
                  className="field-input"
                  value={editFormData.mobilityRequirements}
                  onChange={(e) => setEditFormData({ ...editFormData, mobilityRequirements: e.target.value })}
                />
              ) : (
                <span className="field-value">{profile.mobilityRequirements}</span>
              )}
            </div>

            <div className="profile-field-block">
              <span className="field-label">Special Dietary & Infant Needs</span>
              {isEditing ? (
                <input
                  type="text"
                  className="field-input"
                  value={editFormData.dietaryNotes}
                  onChange={(e) => setEditFormData({ ...editFormData, dietaryNotes: e.target.value })}
                />
              ) : (
                <span className="field-value">{profile.dietaryNotes}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 4: DESIGNATED SAFE SHELTER -------------------- */}
      {activeTab === 'shelter' && (
        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">
              <Building2 size={18} color="#0e6f76" />
              <span>Assigned Evacuation Shelter & Assembly Point</span>
            </h2>
            <Link to="/citizen/shelters" className="btn-add-member" style={{ textDecoration: 'none' }}>
              <span>View Shelter Map &rarr;</span>
            </Link>
          </div>

          <div className="profile-grid-2col">
            <div className="profile-field-block">
              <span className="field-label">Primary Designated Evacuation Shelter</span>
              <span className="field-value" style={{ fontSize: '16px', fontWeight: 700, color: '#0e6f76' }}>
                {profile.designatedShelter}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {profile.designatedShelterDist} &bull; Verified wheelchair accessible &bull; Open capacity
              </span>
            </div>

            <div className="profile-field-block">
              <span className="field-label">Safe Neighborhood Assembly Point</span>
              <span className="field-value" style={{ fontWeight: 700 }}>
                {profile.assemblyPoint}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Designated boat pickup and tractor evacuation boarding hub
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>
                Emergency Shelter Bed Reservation Status
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                4 beds pre-reserved for Family Unit #FU-COL-512 under Sri Lanka DMC Protocol.
              </div>
            </div>

            <Link
              to="/citizen/shelters"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#0e6f76',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} />
              <span>Verify Shelter Capacity</span>
            </Link>
          </div>
        </div>
      )}

      {/* -------------------- TAB 5: NOTIFICATION PREFERENCES -------------------- */}
      {activeTab === 'alerts' && (
        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">
              <Bell size={18} color="#0e6f76" />
              <span>Emergency Broadcast & Warning Preferences</span>
            </h2>
          </div>

          <div className="notif-settings-list">
            <div className="notif-setting-item">
              <div className="setting-text-col">
                <h4>SMS Emergency Alerts</h4>
                <p>Receive Level 3 & Level 4 Critical Inundation SMS warnings directly from DMC.</p>
              </div>
              <button
                type="button"
                className={`toggle-switch-btn ${profile.notifications.smsAlerts ? 'on' : ''}`}
                onClick={() => handleToggleNotif('smsAlerts')}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>

            <div className="notif-setting-item">
              <div className="setting-text-col">
                <h4>Automated IVR Voice Call Broadcast</h4>
                <p>Receive emergency sirens and evacuation orders via phone call when cell data fails.</p>
              </div>
              <button
                type="button"
                className={`toggle-switch-btn ${profile.notifications.voiceBroadcast ? 'on' : ''}`}
                onClick={() => handleToggleNotif('voiceBroadcast')}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>

            <div className="notif-setting-item">
              <div className="setting-text-col">
                <h4>WhatsApp Emergency Updates</h4>
                <p>Get daily ration distribution schedules and flood gauge readings on WhatsApp.</p>
              </div>
              <button
                type="button"
                className={`toggle-switch-btn ${profile.notifications.whatsApp ? 'on' : ''}`}
                onClick={() => handleToggleNotif('whatsApp')}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>

            <div className="notif-setting-item">
              <div className="setting-text-col">
                <h4>Low Battery Lightweight Mode</h4>
                <p>Disables heavy map previews and background syncing when phone battery is below 20%.</p>
              </div>
              <button
                type="button"
                className={`toggle-switch-btn ${profile.notifications.batterySaverMode ? 'on' : ''}`}
                onClick={() => handleToggleNotif('batterySaverMode')}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

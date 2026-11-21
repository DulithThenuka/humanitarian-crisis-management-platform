import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
  Check
} from 'lucide-react';

export const MyProfileView = ({ user, activitySummary, showToast }) => {
  // State for editable profile fields matching Figma specification
  const [formData, setFormData] = useState({
    displayName: user?.name || 'Nadeesha Perera',
    email: user?.email || 'nadeesha.perera@example.test',
    serviceArea: 'Kelani East and nearby areas',
    availability: 'Available',
    skills: 'Logistics, Supply Distribution, Community Support',
    training: 'Community first aid course — volunteer provided',
    emergencyContactPreference: 'Stored securely',
    preferredCategory: 'Logistics and Distribution'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (showToast) {
        showToast('Volunteer profile and service preferences saved.');
      }
    }, 400);
  };

  const completedHistory = [
    {
      id: 'VOL-012',
      title: 'Emergency Kit Packing',
      date: '12 Feb',
      hours: '5 hours',
      status: 'Coordinator reviewed'
    },
    {
      id: 'VOL-008',
      title: 'Community Information Desk',
      date: '08 Feb',
      hours: '4 hours',
      status: 'Coordinator reviewed'
    },
    {
      id: 'VOL-001',
      title: 'Supply Sorting Support',
      date: '02 Feb',
      hours: '3 hours',
      status: 'Coordinator reviewed'
    }
  ];

  const volunteerIdDisplay = user?.volunteerId || 'VOL-0181';
  const avatarInitials = user?.avatar || 'NP';

  return (
    <div>
      {/* 1. Page Header Section */}
      <div className="vol-page-header" style={{ marginBottom: '20px' }}>
        <div>
          <div
            className="vol-page-eyebrow"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#657367'
            }}
          >
            VOLUNTEER-PROVIDED AND VERIFIED INFORMATION
          </div>
          <h1
            className="vol-page-title"
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '4px 0 6px 0',
              letterSpacing: '-0.02em'
            }}
          >
            Volunteer Profile & Activity
          </h1>
          <p
            className="vol-page-desc"
            style={{ fontSize: '13px', color: '#475569', margin: 0 }}
          >
            Manage permitted profile details, availability and service preferences.
          </p>
        </div>

        {/* Save Changes Action Button (Dark Navy Blue) */}
        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={isSaving}
          style={{
            height: '38px',
            padding: '0 20px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#ffffff',
            backgroundColor: '#0c2340',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            boxShadow: '0 1px 2px rgba(12, 35, 64, 0.15)'
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#173d66')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#0c2340')
          }
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {/* 2. Main Two-Column Layout (Figma Master-Detail View) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 310px',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Profile Form Card & Completed Tasks History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Form & Identity Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8e0',
              padding: '24px 28px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            {/* Profile Bar Header with Initials and Change Photo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '20px',
                marginBottom: '20px',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#e2e8f0',
                    color: '#1e293b',
                    fontSize: '15px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {avatarInitials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '15.5px',
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.3
                    }}
                  >
                    {formData.displayName}
                  </div>
                  <div
                    style={{
                      fontSize: '11.5px',
                      color: '#64748b',
                      marginTop: '2px'
                    }}
                  >
                    Volunteer ID: {volunteerIdDisplay} • Active since January 2025
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  showToast && showToast('Photo upload dialogue opened.')
                }
                style={{
                  height: '32px',
                  padding: '0 14px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#334155',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f8fafc')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#ffffff')
                }
              >
                Change photo
              </button>
            </div>

            {/* Form Fields Grid */}
            <form onSubmit={handleSaveChanges}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  columnGap: '16px',
                  rowGap: '16px'
                }}
              >
                {/* Row 1: Display Name & Email */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px'
                    }}
                  >
                    Display name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      handleInputChange('displayName', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      border: '1px solid #dfe5d8',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px'
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      border: '1px solid #dfe5d8',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Row 2: General Service Area & Availability */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px'
                    }}
                  >
                    General service area
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formData.serviceArea}
                      onChange={(e) =>
                        handleInputChange('serviceArea', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '8px 30px 8px 12px',
                        fontSize: '13px',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        border: '1px solid #dfe5d8',
                        borderRadius: '6px',
                        boxSizing: 'border-box',
                        appearance: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="Kelani East and nearby areas">
                        Kelani East and nearby areas
                      </option>
                      <option value="Colombo Hub and Metro">
                        Colombo Hub and Metro
                      </option>
                      <option value="Kelani North & Central">
                        Kelani North & Central
                      </option>
                      <option value="Western Province All Sectors">
                        Western Province All Sectors
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#657367'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px'
                    }}
                  >
                    Availability
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formData.availability}
                      onChange={(e) =>
                        handleInputChange('availability', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '8px 30px 8px 12px',
                        fontSize: '13px',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        border: '1px solid #dfe5d8',
                        borderRadius: '6px',
                        boxSizing: 'border-box',
                        appearance: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                      <option value="On Call">On Call</option>
                      <option value="Weekends Only">Weekends Only</option>
                    </select>
                    <ChevronDown
                      size={14}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#657367'
                      }}
                    />
                  </div>
                </div>

                {/* Row 3: Volunteer-provided skills (Full width) */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px'
                    }}
                  >
                    Volunteer-provided skills
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) =>
                      handleInputChange('skills', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      border: '1px solid #dfe5d8',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Row 4: Relevant training (Full width) */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px'
                    }}
                  >
                    Relevant training
                  </label>
                  <input
                    type="text"
                    value={formData.training}
                    onChange={(e) =>
                      handleInputChange('training', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      border: '1px solid #dfe5d8',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Row 5: Emergency contact preference & Preferred Categories */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px'
                    }}
                  >
                    Emergency contact preference
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formData.emergencyContactPreference}
                      onChange={(e) =>
                        handleInputChange(
                          'emergencyContactPreference',
                          e.target.value
                        )
                      }
                      style={{
                        width: '100%',
                        padding: '8px 30px 8px 12px',
                        fontSize: '13px',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        border: '1px solid #dfe5d8',
                        borderRadius: '6px',
                        boxSizing: 'border-box',
                        appearance: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="Stored securely">Stored securely</option>
                      <option value="Share with coordinator only">
                        Share with coordinator only
                      </option>
                      <option value="Emergency medical contacts only">
                        Emergency medical contacts only
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#657367'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '6px'
                    }}
                  >
                    Preferred Categories
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formData.preferredCategory}
                      onChange={(e) =>
                        handleInputChange('preferredCategory', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '8px 30px 8px 12px',
                        fontSize: '13px',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        border: '1px solid #dfe5d8',
                        borderRadius: '6px',
                        boxSizing: 'border-box',
                        appearance: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="Logistics and Distribution">
                        Logistics and Distribution
                      </option>
                      <option value="Medical & First Aid">
                        Medical & First Aid
                      </option>
                      <option value="Emergency Shelter Operations">
                        Emergency Shelter Operations
                      </option>
                      <option value="Community Support & Relief">
                        Community Support & Relief
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#657367'
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Card 2: Completed Task History */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8e0',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 16px 0'
              }}
            >
              Completed task history
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {completedHistory.map((task, idx) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom:
                      idx !== completedHistory.length - 1
                        ? '1px solid #f1f5f9'
                        : 'none'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 600,
                        color: '#64748b',
                        letterSpacing: '0.02em',
                        marginBottom: '2px'
                      }}
                    >
                      {task.id}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0f172a'
                      }}
                    >
                      {task.title}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '32px'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        width: '50px',
                        textAlign: 'left'
                      }}
                    >
                      {task.date}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#334155',
                        fontWeight: 500,
                        width: '55px',
                        textAlign: 'left'
                      }}
                    >
                      {task.hours}
                    </div>
                    <div style={{ width: '150px', textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          backgroundColor: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          color: '#047857',
                          fontSize: '11px',
                          fontWeight: 600
                        }}
                      >
                        <Check size={12} strokeWidth={2.5} />
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Volunteer Activity & Verification Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1: Volunteer Activity */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8e0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <h3
              style={{
                fontSize: '14.5px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 14px 0'
              }}
            >
              Volunteer activity
            </h3>

            {/* Big Hours Metric */}
            <div
              style={{
                fontSize: '38px',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1
              }}
            >
              38
            </div>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#64748b',
                margin: '4px 0 16px 0'
              }}
            >
              HOURS SERVED
            </div>

            {/* Breakdown List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '14px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px'
                }}
              >
                <span style={{ color: '#64748b' }}>Completed tasks</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>12</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px'
                }}
              >
                <span style={{ color: '#64748b' }}>Current assignments</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>2</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px'
                }}
              >
                <span style={{ color: '#64748b' }}>Service areas</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>2</span>
              </div>
            </div>
          </div>

          {/* Card 2: Verification Status */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8e0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <h3
              style={{
                fontSize: '14.5px',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 14px 0'
              }}
            >
              Verification status
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {/* Identity */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <CheckCircle2
                  size={16}
                  style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }}
                />
                <div>
                  <div
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 700,
                      color: '#0f172a'
                    }}
                  >
                    Identity
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Verified by Lead Coordinator
                  </div>
                </div>
              </div>

              {/* First Aid */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <CheckCircle2
                  size={16}
                  style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }}
                />
                <div>
                  <div
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 700,
                      color: '#0f172a'
                    }}
                  >
                    First Aid
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Confirmed certified qualification
                  </div>
                </div>
              </div>

              {/* Logistics Experience */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <AlertCircle
                  size={16}
                  style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }}
                />
                <div>
                  <div
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 700,
                      color: '#0f172a'
                    }}
                  >
                    Logistics experience
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Volunteer-provided, not independently verified
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Disclaimer Note */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8e0',
                borderRadius: '8px',
                padding: '10px 12px',
                marginTop: '16px'
              }}
            >
              <Info
                size={14}
                style={{ color: '#64748b', flexShrink: 0, marginTop: '2px' }}
              />
              <div
                style={{
                  fontSize: '10.5px',
                  color: '#64748b',
                  lineHeight: 1.4
                }}
              >
                Other volunteers cannot view your private profile or emergency contact settings.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileView;

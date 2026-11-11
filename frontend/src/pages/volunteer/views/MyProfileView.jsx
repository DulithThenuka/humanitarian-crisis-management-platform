import React from 'react';
import {
  User,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  FileCheck2,
  Clock
} from 'lucide-react';

export const MyProfileView = ({ user, activitySummary }) => {
  return (
    <div>
      <div className="vol-page-header">
        <div>
          <div className="vol-page-eyebrow">Volunteer Identity & Credentials</div>
          <h1 className="vol-page-title">My Volunteer Profile</h1>
          <p className="vol-page-desc">
            Verified credentials, field qualifications, and operational deployment records.
          </p>
        </div>
      </div>

      <div className="vol-schedule-grid-layout">
        {/* Left Column: ID & Basic Details */}
        <div className="vol-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8e0' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#d2e5ce',
                color: '#153322',
                fontSize: '24px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {user.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#12281b', margin: 0 }}>
                  {user.name}
                </h2>
                <span className="vol-badge-verified">
                  <ShieldCheck size={13} />
                  Verified
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#4b6152', marginTop: '2px' }}>
                {user.role} • <span className="vol-task-id-mono">{user.volunteerId}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {user.verificationTier}
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8e0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Phone size={12} /> Contact Number
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{user.phone}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8e0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Mail size={12} /> Email Address
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{user.email}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8e0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Heart size={12} /> Blood Group
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626' }}>{user.bloodGroup}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8e0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <MapPin size={12} /> Primary Deployment Area
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{user.serviceArea}</div>
            </div>
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', marginBottom: '2px' }}>
              Emergency In-Field Contact
            </div>
            <div style={{ fontSize: '12.5px', color: '#7f1d1d' }}>
              {user.emergencyContact}
            </div>
          </div>
        </div>

        {/* Right Column: Certifications & Recognition */}
        <div className="vol-avail-settings-card">
          <h3 className="vol-card-title" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={18} style={{ color: '#ea580c' }} />
            <span>Accreditations & Certifications</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {user.certifications.map((cert, cIdx) => (
              <div
                key={cIdx}
                style={{
                  padding: '10px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8e0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <FileCheck2 size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                    {cert.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {cert.issuer} • Validated {cert.year}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="vol-card-title" style={{ marginBottom: '10px' }}>
            Deployment Stats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '6px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#166534' }}>
                {activitySummary.completedAssignments}
              </div>
              <div style={{ fontSize: '11px', color: '#15803d' }}>Completed Shifts</div>
            </div>
            <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '6px', textAlign: 'center', border: '1px solid #bae6fd' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0369a1' }}>
                {activitySummary.volunteerHours}
              </div>
              <div style={{ fontSize: '11px', color: '#0284c7' }}>Field Hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


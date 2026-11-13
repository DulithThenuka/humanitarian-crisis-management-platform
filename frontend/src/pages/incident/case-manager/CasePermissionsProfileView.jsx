import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { CASE_MANAGER_USER } from './caseManagerData';

export const CasePermissionsProfileView = ({ activeUser = CASE_MANAGER_USER, showToast }) => {
  const profileUser = activeUser || CASE_MANAGER_USER;
  return (
    <div className="cm-canvas-wrapper">
      <div className="cm-canvas-head-row">
        <div>
          <span className="cm-tag-uppercase">SECURITY &amp; ROLE GOVERNANCE</span>
          <h1 className="cm-canvas-h1">Permissions &amp; Profile</h1>
          <p className="cm-canvas-sub">
            Authorised scope boundaries, operational zone clearance and non-repudiation audit profile.
          </p>
        </div>
      </div>

      <div className="cm-dash-split-row">
        {/* Left: User Profile Details */}
        <div className="cm-panel-card">
          <div className="cm-panel-header">
            <h3 className="cm-panel-title">Active Role Identity</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div className="cm-user-badge-avatar" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
              {profileUser.initials}
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800 }}>{profileUser.name}</h2>
              <span className="cm-pill-tag warning">● {profileUser.role}</span>
            </div>
          </div>

          <div className="cm-detail-meta-4grid" style={{ marginBottom: '16px' }}>
            <div className="cm-meta-col">
              <span className="cm-meta-label">CLEARANCE LEVEL</span>
              <span className="cm-meta-value">{profileUser.clearance}</span>
            </div>
            <div className="cm-meta-col">
              <span className="cm-meta-label">ASSIGNED ZONE</span>
              <span className="cm-meta-value">{profileUser.zone}</span>
            </div>
            <div className="cm-meta-col">
              <span className="cm-meta-label">OPERATION</span>
              <span className="cm-meta-value">{profileUser.activeOperation}</span>
            </div>
            <div className="cm-meta-col">
              <span className="cm-meta-label">STATUS</span>
              <span className="cm-pill-tag critical">Active Duty</span>
            </div>
          </div>
        </div>

        {/* Right: Security & Boundary Rules */}
        <div className="cm-panel-card">
          <div className="cm-panel-header">
            <h3 className="cm-panel-title">Role Access Boundaries</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <CheckCircle2 size={16} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '12px' }}>
                <strong style={{ display: 'block', color: '#0f172a' }}>Role-Scoped Case Access</strong>
                <span style={{ color: '#64748b' }}>Permitted to view and update cases explicitly routed to Western Province Kelani East sector.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px', background: '#fff1f2', borderRadius: '8px', border: '1px solid #fecdd3' }}>
              <Lock size={16} color="#e11d48" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '12px' }}>
                <strong style={{ display: 'block', color: '#9f1239' }}>Citizen Identity Restriction</strong>
                <span style={{ color: '#be123c' }}>Direct citizen contact details and credentials are redacted to preserve privacy.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
              <AlertTriangle size={16} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '12px' }}>
                <strong style={{ display: 'block', color: '#92400e' }}>Cryptographic Logging</strong>
                <span style={{ color: '#b45309' }}>All status modifications, priority adjustments and notes are immutably timestamped.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Phone,
  Mail,
  Users,
  Truck,
  MapPin,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const OrganisationProfileView = ({
  partner = null,
  allPartners = [],
  selectedPartnerId,
  onSelectPartner,
  zones = [],
  commitments = [],
  officer = null,
  canEdit = false,
  onUpdatePartner,
  loading = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    acronym: '',
    type: '',
    leadContact: '',
    phone: '',
    email: '',
    status: '',
    mouStatus: '',
    fieldTeamsCount: 0,
    fleetCount: 0
  });

  useEffect(() => {
    if (!partner) return;
    setFormState({
      name: partner.name || '',
      acronym: partner.acronym || '',
      type: partner.type || '',
      leadContact: partner.leadContact || '',
      phone: partner.phone || '',
      email: partner.email || '',
      status: partner.status || 'Active Response',
      mouStatus: partner.mouStatus || '',
      fieldTeamsCount: partner.fieldTeamsCount ?? 0,
      fleetCount: partner.fleetCount ?? 0
    });
    setIsEditing(false);
    setErrorMsg('');
  }, [partner]);

  if (loading && !partner) {
    return (
      <div className="po-workspace">
        <div className="po-panel" style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
          Loading organisation profile from backend...
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="po-workspace">
        <div className="po-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: '#162e20', marginBottom: '8px' }}>No Partner Organisation Loaded</h2>
          <p style={{ color: '#657367', margin: 0 }}>
            No accredited partner organisation records were returned for your account scope.
          </p>
        </div>
      </div>
    );
  }

  // Zones assigned to this partner from live SectorZones data
  const assignedZonesDetails = zones
    .map((z) => {
      const match = (z.assignedPartners || []).find((ap) => ap.partnerId === partner.id);
      if (!match && !(partner.assignedZones || []).includes(z.zoneCode)) return null;
      return {
        ...z,
        roleSummary: match?.roleSummary || 'Assigned operational zone'
      };
    })
    .filter(Boolean);

  const partnerCommitments = commitments.filter((c) => c.partnerOrganisationId === partner.id);
  const totalPledgedLkr = partnerCommitments.reduce((sum, c) => sum + (Number(c.estimatedValueLkr) || 0), 0);

  const isVerified = !(partner.mouStatus || '').toLowerCase().includes('pending');

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formState.name.trim() || !formState.leadContact.trim() || !formState.email.trim()) {
      setErrorMsg('Organisation name, lead contact, and email are required.');
      return;
    }
    setSaving(true);
    try {
      const ok = await onUpdatePartner(partner.id, {
        ...formState,
        fieldTeamsCount: Number(formState.fieldTeamsCount) || 0,
        fleetCount: Number(formState.fleetCount) || 0
      });
      if (ok) {
        setIsEditing(false);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update organisation profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="po-workspace">
      {/* Header */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>ACCREDITED PARTNER DOSSIER</span>
          </div>
          <h1 className="po-title">Organisation Profile</h1>
          <p className="po-subtitle">
            Verified registration, operational capacity, representative details, and assigned sector zones.
          </p>
        </div>

        <div className="po-title-actions">
          {allPartners.length > 1 && (
            <select
              className="po-select"
              value={selectedPartnerId || partner.id}
              onChange={(e) => onSelectPartner(e.target.value)}
              aria-label="Select active partner organisation"
            >
              {allPartners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} · {p.acronym} — {p.name}
                </option>
              ))}
            </select>
          )}

          {canEdit && !isEditing && (
            <button
              type="button"
              className="po-btn po-btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Permission Note for non-Coordinator/Admin */}
      {!canEdit && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: '#edf2e8',
            border: '1px solid #dbe4c6',
            color: '#2f4033',
            fontSize: '12.5px',
            marginBottom: '20px'
          }}
        >
          <Lock size={15} />
          <span>
            Read-only view: Your current role ({officer?.role || 'Staff'}) can view organisation details. Profile updates require Coordinator or Admin authorization.
          </span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: '13px',
            marginBottom: '18px'
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Top Identity Summary Card */}
      <div className="po-panel" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: '#1e3d2c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '16px',
                flexShrink: 0
              }}
            >
              {partner.acronym?.slice(0, 4) || 'ORG'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#162e20' }}>
                  {partner.name}
                </h2>
                <span className="po-cell-record-id">{partner.code}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#405044', marginTop: '4px' }}>
                {partner.type}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`po-status-badge ${isVerified ? 'confirmed' : 'awaiting'}`}>
              ● {isVerified ? 'Verified Partner' : 'Verification Pending'}
            </span>
            <span className="po-status-badge dispatched">
              ● {partner.status}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form OR Read-Only Structured Details */}
      {isEditing ? (
        <form onSubmit={handleSave} className="po-panel" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#162e20' }}>
              Update Organisation Details
            </h3>
            <button
              type="button"
              className="po-btn po-btn-secondary"
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              <X size={14} />
              <span>Cancel</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Organisation Name *</label>
              <input
                type="text"
                className="po-table-search-field"
                style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Acronym *</label>
              <input
                type="text"
                className="po-table-search-field"
                style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                value={formState.acronym}
                onChange={(e) => setFormState({ ...formState, acronym: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Organisation Type *</label>
              <input
                type="text"
                className="po-table-search-field"
                style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                value={formState.type}
                onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Assigned Representative *</label>
              <input
                type="text"
                className="po-table-search-field"
                style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                value={formState.leadContact}
                onChange={(e) => setFormState({ ...formState, leadContact: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Contact Phone *</label>
              <input
                type="text"
                className="po-table-search-field"
                style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Contact Email *</label>
              <input
                type="email"
                className="po-table-search-field"
                style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Operational Status</label>
              <select
                className="po-select"
                style={{ width: '100%' }}
                value={formState.status}
                onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              >
                <option value="Active Response">Active Response</option>
                <option value="Active Support">Active Support</option>
                <option value="Mobilising">Mobilising</option>
                <option value="Standby">Standby</option>
              </select>
            </div>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>MoU / Accreditation Status</label>
              <input
                type="text"
                className="po-table-search-field"
                style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                value={formState.mouStatus}
                onChange={(e) => setFormState({ ...formState, mouStatus: e.target.value })}
              />
            </div>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Field Teams Count</label>
              <input
                type="number"
                min="0"
                className="po-table-search-field"
                style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                value={formState.fieldTeamsCount}
                onChange={(e) => setFormState({ ...formState, fieldTeamsCount: e.target.value })}
              />
            </div>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>Fleet Vehicles Count</label>
              <input
                type="number"
                min="0"
                className="po-table-search-field"
                style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                value={formState.fleetCount}
                onChange={(e) => setFormState({ ...formState, fleetCount: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="po-btn po-btn-primary" disabled={saving}>
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Organisation Profile'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="po-middle-grid" style={{ marginBottom: '20px' }}>
          {/* Left: Registration, Verification & Contact */}
          <div className="po-panel" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', fontWeight: 700, color: '#162e20', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={17} color="#1e3d2c" />
              <span>Registration &amp; Contact Information</span>
            </h3>

            <div className="po-detail-grid" style={{ marginBottom: '16px' }}>
              <div className="po-detail-field">
                <span className="po-detail-label">Registration Code</span>
                <span className="po-detail-val">{partner.code}</span>
              </div>
              <div className="po-detail-field">
                <span className="po-detail-label">MoU / Verification</span>
                <span className="po-detail-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#15803d" />
                  {partner.mouStatus || 'Not specified'}
                </span>
              </div>
              <div className="po-detail-field">
                <span className="po-detail-label">Assigned Representative</span>
                <span className="po-detail-val">{partner.leadContact}</span>
              </div>
              <div className="po-detail-field">
                <span className="po-detail-label">Signed-In Officer</span>
                <span className="po-detail-val">{officer?.fullName || 'Authorised Staff'} ({officer?.role || 'Staff'})</span>
              </div>
              <div className="po-detail-field">
                <span className="po-detail-label">Phone</span>
                <span className="po-detail-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color="#405044" />
                  {partner.phone}
                </span>
              </div>
              <div className="po-detail-field">
                <span className="po-detail-label">Official Email</span>
                <span className="po-detail-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} color="#405044" />
                  {partner.email}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Operational Capacity */}
          <div className="po-panel" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', fontWeight: 700, color: '#162e20', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={17} color="#1e3d2c" />
              <span>Resource &amp; Service Capacity</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8faf7', border: '1px solid #edf1eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#405044', fontSize: '12px', fontWeight: 600 }}>
                  <Users size={15} color="#1e3d2c" />
                  <span>Field Response Teams</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#162e20', marginTop: '6px' }}>
                  {partner.fieldTeamsCount ?? 0}
                </div>
                <div style={{ fontSize: '11.5px', color: '#657367', marginTop: '2px' }}>Active deployable units</div>
              </div>

              <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8faf7', border: '1px solid #edf1eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#405044', fontSize: '12px', fontWeight: 600 }}>
                  <Truck size={15} color="#1e3d2c" />
                  <span>Fleet Vehicles</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#162e20', marginTop: '6px' }}>
                  {partner.fleetCount ?? 0}
                </div>
                <div style={{ fontSize: '11.5px', color: '#657367', marginTop: '2px' }}>Logistics &amp; transport</div>
              </div>

              <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8faf7', border: '1px solid #edf1eb' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#405044' }}>Logged Contributions</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#162e20', marginTop: '6px' }}>
                  {partnerCommitments.length}
                </div>
                <div style={{ fontSize: '11.5px', color: '#657367', marginTop: '2px' }}>Managed in Resource Contributions</div>
              </div>

              <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#f8faf7', border: '1px solid #edf1eb' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#405044' }}>Total Pledged Value</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#162e20', marginTop: '6px' }}>
                  LKR {(totalPledgedLkr / 1_000_000).toFixed(2)}M
                </div>
                <div style={{ fontSize: '11.5px', color: '#657367', marginTop: '2px' }}>Across active commitments</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operating Districts & Assigned Sector Zones */}
      <div className="po-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#162e20', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={17} color="#1e3d2c" />
              <span>Operating Districts &amp; Assigned Sector Zones</span>
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#657367' }}>
              Authorised operational areas and sector coordination roles assigned to {partner.acronym}.
            </p>
          </div>
          <span className="po-badge-pill-cream">● {assignedZonesDetails.length} assigned zones</span>
        </div>

        {assignedZonesDetails.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f8faf7', borderRadius: '10px', color: '#657367', fontSize: '13px' }}>
            No sector zones are currently assigned to {partner.name}.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {assignedZonesDetails.map((zone) => (
              <div
                key={zone.id}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8dd',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#162e20' }}>{zone.zoneCode}</div>
                  <span className="po-status-badge confirmed">{zone.priorityStatus}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#405044', marginBottom: '10px' }}>
                  {zone.description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#657367', borderTop: '1px solid #edf1eb', paddingTop: '8px' }}>
                  <span>Role: <strong style={{ color: '#162e20' }}>{zone.roleSummary}</strong></span>
                  <span>Coverage: <strong style={{ color: '#162e20' }}>{zone.coveragePercent}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganisationProfileView;

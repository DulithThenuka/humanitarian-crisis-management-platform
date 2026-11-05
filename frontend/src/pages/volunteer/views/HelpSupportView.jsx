import React, { useState } from 'react';
import {
  LifeBuoy,
  PhoneCall,
  ShieldAlert,
  FileText,
  Send,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const HelpSupportView = ({ showToast }) => {
  const [incidentType, setIncidentType] = useState('Safety Concern');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (showToast) {
      showToast('Incident report logged. Emergency field safety lead dispatched alert.');
    }
  };

  return (
    <div>
      <div className="vol-page-header">
        <div>
          <div className="vol-page-eyebrow">Field Assistance & Rapid Support</div>
          <h1 className="vol-page-title">Help & Support Center</h1>
          <p className="vol-page-desc">
            Direct operational hotlines, incident reporting, and safety protocols for on-duty volunteers.
          </p>
        </div>
      </div>

      <div className="vol-two-col-grid">
        {/* Left Column: Hotlines & Safety SOPs */}
        <div className="vol-card">
          <h3 className="vol-card-title" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={18} style={{ color: '#dc2626' }} />
            <span>Emergency Command Hotlines</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                Western Province Crisis Dispatch
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#dc2626', margin: '2px 0' }}>
                +94 11 267 0000 (Toll-Free 117)
              </div>
              <div style={{ fontSize: '11.5px', color: '#7f1d1d' }}>
                Immediate field hazards, flood surges, or medical evacuation.
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8e0', padding: '12px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Volunteer Operations Helpdesk
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#183526', margin: '2px 0' }}>
                +94 77 999 4433
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                Assignment queries, check-in issues, or schedule changes.
              </div>
            </div>
          </div>

          <h3 className="vol-card-title" style={{ marginBottom: '10px' }}>
            Volunteer Standard Operating Guidelines
          </h3>
          <ul style={{ fontSize: '12.5px', color: '#334155', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
            <li>Always display your official HumanAid volunteer credential badge when on site.</li>
            <li>Wear high-visibility reflective gear in active distribution or transport zones.</li>
            <li>Do not accept cash donations or unmanifested medical supplies in the field.</li>
            <li>Report any unattended minors or medical emergencies immediately to shelter intake.</li>
          </ul>
        </div>

        {/* Right Column: Incident Reporting Form */}
        <div className="vol-avail-settings-card">
          <h3 className="vol-card-title" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} style={{ color: '#ea580c' }} />
            <span>File Field Incident or Safety Report</span>
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Category
              </label>
              <select
                className="vol-select-field"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
              >
                <option value="Safety Concern">Safety Concern / Environmental Hazard</option>
                <option value="Crowd Control">Crowd Surge / Distribution Dispute</option>
                <option value="Supply Shortage">Critical Supply or Water Shortage</option>
                <option value="Medical Need">Evacuee First Aid / Health Need</option>
                <option value="Other">Other Operational Issue</option>
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Incident Description & Exact Location
              </label>
              <textarea
                className="vol-select-field"
                rows="5"
                placeholder="Describe what occurred, who was affected, and immediate assistance required..."
                value={incidentDetails}
                onChange={(e) => setIncidentDetails(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              className="vol-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Send size={15} />
              <span>Submit Incident Report</span>
            </button>
          </form>

          {submitted && (
            <div style={{ marginTop: '14px', padding: '10px 12px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '12px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} />
              <span>Report transmitted to Emergency Response Coordinator.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


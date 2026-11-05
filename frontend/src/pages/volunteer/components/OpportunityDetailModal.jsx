import React from 'react';
import { X, Clock, Calendar, Users, MapPin, CheckCircle2, Shield, Phone, AlertCircle } from 'lucide-react';

export const OpportunityDetailModal = ({ opportunity, onClose, onAccept }) => {
  if (!opportunity) return null;

  return (
    <div className="vol-modal-backdrop" onClick={onClose}>
      <div className="vol-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="vol-modal-header">
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
              {opportunity.categoryCode}
            </div>
            <h3 className="vol-modal-title">{opportunity.title}</h3>
          </div>
          <button className="vol-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="vol-modal-body">
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            {opportunity.description}
          </p>

          <div className="vol-opp-meta-grid" style={{ marginBottom: '16px' }}>
            <div className="vol-meta-item">
              <Clock size={15} style={{ color: '#64748b' }} />
              <span><strong>Duration:</strong> {opportunity.duration}</span>
            </div>
            <div className="vol-meta-item">
              <Calendar size={15} style={{ color: '#64748b' }} />
              <span><strong>Shift:</strong> {opportunity.date}</span>
            </div>
            <div className="vol-meta-item">
              <Users size={15} style={{ color: '#64748b' }} />
              <span><strong>Quota:</strong> {opportunity.volunteersNeeded}</span>
            </div>
            <div className="vol-meta-item">
              <MapPin size={15} style={{ color: '#64748b' }} />
              <span><strong>Staging Area:</strong> {opportunity.location}</span>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div className="vol-opp-skills-label">Required Volunteer Skills</div>
            <div className="vol-pill-group">
              {opportunity.skills.map((s, idx) => (
                <span key={idx} className="vol-pill tag-neutral">{s}</span>
              ))}
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8e0', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>
              Designated Field Coordinator
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#183526' }}>
              {opportunity.coordinator}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Phone size={12} /> {opportunity.contactPhone}
            </div>
          </div>

          <div className="vol-opp-eligibility-banner eligible" style={{ margin: 0 }}>
            <CheckCircle2 size={16} />
            <span>You meet all verified prerequisites for this task deployment.</span>
          </div>
        </div>

        <div className="vol-modal-footer">
          <button className="vol-btn-outline" onClick={onClose}>
            Close
          </button>
          <button
            className="vol-btn-primary"
            onClick={() => {
              onClose();
              onAccept(opportunity);
            }}
          >
            Accept This Task
          </button>
        </div>
      </div>
    </div>
  );
};


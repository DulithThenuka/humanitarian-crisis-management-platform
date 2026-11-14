import React from 'react';
import { Building2, MapPin, Phone, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { PARTNER_ORGANISATIONS } from '../data/partnerData';

export const PartnerDirectoryView = ({ searchQuery = '', filterStatus = 'ALL', onSelectPartner }) => {
  const filtered = PARTNER_ORGANISATIONS.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || partner.statusClass === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="partner-directory-grid">
      {filtered.map(partner => (
        <div key={partner.id} className="partner-card" onClick={() => onSelectPartner?.(partner)}>
          <div className="partner-card-header">
            <div className="partner-logo-avatar">
              <Building2 size={24} />
            </div>
            <div className="partner-title-block">
              <div className="partner-name-row">
                <h3>{partner.name}</h3>
                <span className="partner-acronym">{partner.acronym}</span>
              </div>
              <p className="partner-type">{partner.type}</p>
            </div>
            <span className={`status-badge ${partner.statusClass}`}>{partner.status}</span>
          </div>

          <div className="partner-card-body">
            <div className="partner-meta-row">
              <span className="meta-label">Lead Contact:</span>
              <span className="meta-value">{partner.leadContact}</span>
            </div>
            <div className="partner-meta-row">
              <span className="meta-label">Direct Hotline:</span>
              <span className="meta-value"><Phone size={13} /> {partner.phone}</span>
            </div>
            <div className="partner-zones-row">
              <span className="meta-label"><MapPin size={13} /> Operating Zones:</span>
              <div className="zone-tags">
                {partner.assignedZones.map((z, idx) => (
                  <span key={idx} className="zone-tag">{z}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="partner-card-footer">
            <span className={`mou-badge ${partner.mouBadge}`}>
              <ShieldCheck size={13} /> {partner.mouStatus}
            </span>
            <button className="partner-detail-btn" onClick={() => onSelectPartner?.(partner)}>
              Details <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

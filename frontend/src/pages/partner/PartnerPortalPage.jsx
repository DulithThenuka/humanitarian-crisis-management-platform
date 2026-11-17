import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Building2,
  Users,
  Package,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Layers,
  HeartHandshake,
  Truck,
  Plus
} from 'lucide-react';
import './PartnerPortalPage.css';
import { partnerService } from '../../services/partnerService';

export const PartnerPortalPage = ({ initialTab = 'overview' }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Reactively sync activeTab with URL route and props
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    const p = (location.pathname || '').toLowerCase();
    if (p.includes('/directory')) {
      setActiveTab('directory');
    } else if (p.includes('/commitments')) {
      setActiveTab('commitments');
    } else if (p.includes('/zones')) {
      setActiveTab('zones');
    } else if (p === '/partner' || p === '/partner/portal' || p === '/partner/dashboard' || p === '/partners') {
      setActiveTab('overview');
    }
  }, [initialTab, location.pathname]);
  const [partners, setPartners] = useState([]);
  const [summary, setSummary] = useState(null);
  const [sectorZones, setSectorZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [newCommitment, setNewCommitment] = useState({
    partnerOrganisationId: '',
    item: '',
    qty: '',
    zone: 'Kelani East - Sector 03'
  });

  const loadPartnerData = async () => {
    setLoading(true);
    setApiError('');
    try {
      const [partnersRes, summaryRes, zonesRes] = await Promise.all([
        partnerService.getPartners(),
        partnerService.getSummary(),
        partnerService.getSectorZones()
      ]);

      const loadedPartners = partnersRes?.data || [];
      setPartners(loadedPartners);
      setSummary(summaryRes?.data || null);
      setSectorZones(zonesRes?.data || []);

      if (loadedPartners.length > 0) {
        setSelectedPartner(prev =>
          prev ? loadedPartners.find(p => p.id === prev.id) || loadedPartners[0] : loadedPartners[0]
        );
        setNewCommitment(prev => ({
          ...prev,
          partnerOrganisationId: prev.partnerOrganisationId || loadedPartners[0].id
        }));
      }
    } catch (err) {
      setApiError(err?.errors?.[0] || err?.message || 'Unable to load partner coordination data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartnerData();
  }, []);

  const filteredPartners = partners.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.assignedZones || []).some(z => z.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="partner-portal-container">
      {/* Top Banner */}
      <div className="partner-header-card">
        <div className="partner-header-left">
          <div className="partner-badge-row">
            <span className="partner-pill pill-navy">Module 08 · Partner Organisation Management</span>
            <span className="partner-pill pill-green">● {summary?.accreditedPartnersCount ?? partners.length} Humanitarian Partners On-Grid</span>
            <span className="partner-pill pill-amber">Western Province Monsoon Operations</span>
          </div>
          <h1 className="partner-title">Inter-Agency Partner Coordination Portal</h1>
          <p className="partner-subtitle">
            Joint humanitarian crisis response platform linking Government Disaster Management, Red Cross, UN agencies, and accredited NGOs.
          </p>
        </div>
        <div className="partner-header-actions">
          <button className="partner-btn btn-secondary" onClick={() => window.location.href = '/coordinator'}>
            Coordinator HQ
          </button>
          <button className="partner-btn btn-primary" onClick={() => setShowCommitmentModal(true)}>
            <Plus size={16} /> Pledge Resources
          </button>
        </div>
      </div>

      {apiError && (
        <div className="partner-card" style={{ marginBottom: 16, borderColor: '#ef4444' }}>
          <p style={{ color: '#fca5a5', margin: 0 }}>{apiError}</p>
        </div>
      )}

      {/* Metrics Row */}
      <div className="partner-metrics-grid">
        <div className="partner-metric-card">
          <div className="metric-icon-wrap icon-blue">
            <Building2 size={22} />
          </div>
          <div>
            <span className="metric-label">Accredited Partner NGOs</span>
            <h3 className="metric-value">{summary?.accreditedPartnersCount ?? partners.length} Organisations</h3>
            <span className="metric-subtext text-emerald">↑ {summary?.verifiedMouPercentage ?? 0}% Verified MoUs</span>
          </div>
        </div>
        <div className="partner-metric-card">
          <div className="metric-icon-wrap icon-emerald">
            <HeartHandshake size={22} />
          </div>
          <div>
            <span className="metric-label">Joint Response Units</span>
            <h3 className="metric-value">{summary?.jointResponseUnitsCount ?? 0} Field Teams</h3>
            <span className="metric-subtext text-emerald">Active across {summary?.activeZonesCount ?? sectorZones.length} sectors</span>
          </div>
        </div>
        <div className="partner-metric-card">
          <div className="metric-icon-wrap icon-purple">
            <Package size={22} />
          </div>
          <div>
            <span className="metric-label">Pledged Aid Material Value</span>
            <h3 className="metric-value">Rs. {summary?.pledgedAidValueMillionsLkr ?? 0} Million</h3>
            <span className="metric-subtext text-cyan">{summary?.dispatchedPercentage ?? 0}% Dispatched to shelters</span>
          </div>
        </div>
        <div className="partner-metric-card">
          <div className="metric-icon-wrap icon-amber">
            <Truck size={22} />
          </div>
          <div>
            <span className="metric-label">Partner Fleet Deployed</span>
            <h3 className="metric-value">{summary?.fleetDeployedCount ?? 0} Vehicles / Boats</h3>
            <span className="metric-subtext text-emerald">{summary?.totalCommitmentsCount ?? 0} active commitments</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="partner-tabs-bar">
        <button
          className={`partner-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Layers size={16} /> Overview & Joint Operations
        </button>
        <button
          className={`partner-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          <Building2 size={16} /> Partner Directory & MoUs
        </button>
        <button
          className={`partner-tab-btn ${activeTab === 'commitments' ? 'active' : ''}`}
          onClick={() => setActiveTab('commitments')}
        >
          <Package size={16} /> Resource Commitments
        </button>
        <button
          className={`partner-tab-btn ${activeTab === 'zones' ? 'active' : ''}`}
          onClick={() => setActiveTab('zones')}
        >
          <MapPin size={16} /> Sector Coordination Zones
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="partner-content-grid">
          {/* Active Partners List */}
          <div className="partner-card">
            <div className="partner-card-header">
              <div>
                <h3 className="card-title">Frontline Partner Organisations</h3>
                <p className="card-desc">Currently deployed in Western Province flood disaster operations</p>
              </div>
              <div className="search-wrap">
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search partner, zone, or acronym..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="partner-list">
              {loading && partners.length === 0 && (
                <p style={{ color: '#94a3b8', padding: '12px 0' }}>Loading partner organisations...</p>
              )}
              {filteredPartners.map(partner => (
                <div
                  key={partner.id}
                  className={`partner-item ${selectedPartner?.id === partner.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPartner(partner)}
                >
                  <div className="partner-item-top">
                    <div>
                      <span className="partner-acronym">{partner.acronym}</span>
                      <h4 className="partner-name">{partner.name}</h4>
                      <span className="partner-type">{partner.type}</span>
                    </div>
                    <span className={`status-pill ${partner.statusClass}`}>
                      {partner.status}
                    </span>
                  </div>

                  <div className="partner-item-zones">
                    <MapPin size={13} color="#94a3b8" />
                    <span>{partner.assignedZones.join(' · ')}</span>
                  </div>

                  <div className="partner-item-footer">
                    <span className="mou-tag"><ShieldCheck size={13} /> {partner.mouStatus}</span>
                    <span className="contact-link"><Phone size={13} /> {partner.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Detail Dossier */}
          <div className="partner-card">
            <div className="partner-card-header">
              <div>
                <h3 className="card-title">Partner Dossier & Pledges</h3>
                <p className="card-desc">Detailed commitments and liaison communications</p>
              </div>
              <span className="dossier-id">{selectedPartner?.code || selectedPartner?.id || '—'}</span>
            </div>

            {selectedPartner ? (
            <div className="dossier-body">
              <div className="dossier-highlight-box">
                <div className="dossier-badge-row">
                  <span className="badge-lg">{selectedPartner.acronym}</span>
                  <div>
                    <h2 className="dossier-org-name">{selectedPartner.name}</h2>
                    <p className="dossier-type-text">{selectedPartner.type}</p>
                  </div>
                </div>
                <div className="dossier-contact-grid">
                  <div>
                    <span className="dossier-label">Lead Liaison Officer</span>
                    <strong className="dossier-val">{selectedPartner.leadContact}</strong>
                  </div>
                  <div>
                    <span className="dossier-label">Emergency Phone</span>
                    <strong className="dossier-val">{selectedPartner.phone}</strong>
                  </div>
                  <div>
                    <span className="dossier-label">Official Comms Email</span>
                    <strong className="dossier-val">{selectedPartner.email}</strong>
                  </div>
                  <div>
                    <span className="dossier-label">Agreement Status</span>
                    <span className="text-emerald font-semibold"><ShieldCheck size={14} style={{ display: 'inline', marginRight: 4 }} />{selectedPartner.mouStatus}</span>
                  </div>
                </div>
              </div>

              <h4 className="section-heading">Operational Sector Deployments</h4>
              <div className="zones-pill-wrap">
                {selectedPartner.assignedZones.map((zone, idx) => (
                  <span key={idx} className="zone-pill"><MapPin size={13} /> {zone}</span>
                ))}
              </div>

              <h4 className="section-heading">Pledged Resources & Dispatches</h4>
              <div className="commitments-table-wrap">
                <table className="commitments-table">
                  <thead>
                    <tr>
                      <th>Resource / Supply Item</th>
                      <th>Quantity Committed</th>
                      <th>Deployment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPartner.commitments.map((comm, idx) => (
                      <tr key={idx}>
                        <td><strong>{comm.item}</strong></td>
                        <td>{comm.qty.toLocaleString()}</td>
                        <td>
                          <span className={`status-pill ${comm.status === 'Deployed' || comm.status === 'Active' || comm.status === 'Delivered' ? 'status-active' : 'status-warning'}`}>
                            {comm.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="dossier-actions-footer">
                <a href={`tel:${selectedPartner.phone}`} className="partner-btn btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                  <Phone size={16} /> Direct Comms Call
                </a>
                <button
                  className="partner-btn btn-secondary"
                  onClick={() => {
                    setNewCommitment(prev => ({ ...prev, partnerOrganisationId: selectedPartner.id }));
                    setShowCommitmentModal(true);
                  }}
                >
                  Log Inter-Agency Task
                </button>
              </div>
            </div>
            ) : (
              <p style={{ color: '#94a3b8', padding: '16px 0' }}>Select a partner organisation to view its dossier.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'directory' && (
        <div className="partner-card">
          <div className="partner-card-header">
            <div>
              <h3 className="card-title">Full Humanitarian Partner Roster & Framework Agreements</h3>
              <p className="card-desc">All verified international NGOs, UN bodies, and accredited civil defence partners</p>
            </div>
          </div>
          <div className="directory-table-wrap">
            <table className="commitments-table">
              <thead>
                <tr>
                  <th>Partner Organisation</th>
                  <th>Classification</th>
                  <th>Liaison Officer</th>
                  <th>Direct Contact</th>
                  <th>Assigned Sectors</th>
                  <th>Framework Agreement</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {partners.map(p => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {p.code || p.id} ({p.acronym})</div>
                    </td>
                    <td>{p.type}</td>
                    <td>{p.leadContact}</td>
                    <td>
                      <div>{p.phone}</div>
                      <div style={{ fontSize: '11px', color: '#38bdf8' }}>{p.email}</div>
                    </td>
                    <td>{p.assignedZones.join(', ')}</td>
                    <td><span className="mou-tag"><ShieldCheck size={13} /> {p.mouStatus}</span></td>
                    <td><span className={`status-pill ${p.statusClass}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'commitments' && (
        <div className="partner-card">
          <div className="partner-card-header">
            <div>
              <h3 className="card-title">Consolidated Material Commitments Ledger</h3>
              <p className="card-desc">Master list of inter-agency contributions across water, food, medicine, and rescue fleets</p>
            </div>
            <button className="partner-btn btn-primary" onClick={() => setShowCommitmentModal(true)}>
              <Plus size={16} /> Add Commitment
            </button>
          </div>
          <div className="directory-table-wrap">
            <table className="commitments-table">
              <thead>
                <tr>
                  <th>Organisation</th>
                  <th>Resource Item</th>
                  <th>Committed Quantity</th>
                  <th>Primary Sector Target</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {partners.flatMap(p =>
                  (p.commitments || []).map((c, i) => (
                    <tr key={c.id || `${p.id}-${i}`}>
                      <td><strong>{p.acronym}</strong> ({p.name})</td>
                      <td>{c.item}</td>
                      <td><strong>{(c.qty ?? 0).toLocaleString()}</strong></td>
                      <td>{c.destinationZone || p.assignedZones?.[0] || '—'}</td>
                      <td>
                        <span className={`status-pill ${c.status === 'Deployed' || c.status === 'Active' || c.status === 'Delivered' ? 'status-active' : 'status-warning'}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'zones' && (
        <div className="partner-card">
          <div className="partner-card-header">
            <div>
              <h3 className="card-title">Sector Coordination Matrix</h3>
              <p className="card-desc">Zone-level partner assignments to avoid aid duplication and ensure full coverage</p>
            </div>
          </div>
          <div className="zones-grid-layout">
            {sectorZones.map(zone => (
              <div key={zone.id} className="zone-card">
                <div className="zone-card-header">
                  <h4>{zone.name}</h4>
                  <span className={`status-pill ${zone.statusClass}`}>{zone.priorityStatus}</span>
                </div>
                <p className="zone-desc">{zone.description}</p>
                <div className="zone-orgs">
                  <strong>Assigned Partners:</strong>
                  <ul>
                    {(zone.assignedPartners || []).map((ap, idx) => (
                      <li key={`${zone.id}-${ap.partnerId}-${idx}`}>
                        {ap.partnerName} ({ap.roleSummary})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal to Pledge / Log Commitment */}
      {showCommitmentModal && (
        <div className="partner-modal-backdrop" onClick={() => setShowCommitmentModal(false)}>
          <div className="partner-modal" onClick={e => e.stopPropagation()}>
            <div className="partner-modal-header">
              <h3>Pledge Partner Resource Commitment</h3>
              <button className="partner-modal-close" onClick={() => setShowCommitmentModal(false)}>×</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              setApiError('');
              try {
                await partnerService.logCommitment({
                  partnerOrganisationId: newCommitment.partnerOrganisationId || selectedPartner?.id,
                  item: newCommitment.item,
                  qty: Number(newCommitment.qty),
                  destinationZone: newCommitment.zone,
                  status: 'Pledged'
                });
                setShowCommitmentModal(false);
                setNewCommitment(prev => ({ ...prev, item: '', qty: '' }));
                await loadPartnerData();
              } catch (err) {
                setApiError(err?.errors?.[0] || err?.message || 'Failed to log commitment.');
              } finally {
                setSubmitting(false);
              }
            }}>
              <div className="form-group">
                <label>Partner Organisation</label>
                <select
                  className="form-input"
                  value={newCommitment.partnerOrganisationId || selectedPartner?.id || ''}
                  onChange={e => setNewCommitment({ ...newCommitment, partnerOrganisationId: e.target.value })}
                  required
                >
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.acronym})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Resource / Supply Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500 Family Food Rations, 4 Inflatable Rescue Boats"
                  className="form-input"
                  value={newCommitment.item}
                  onChange={e => setNewCommitment({ ...newCommitment, item: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Quantity / Units</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500"
                  className="form-input"
                  value={newCommitment.qty}
                  onChange={e => setNewCommitment({ ...newCommitment, qty: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Destination Sector Zone</label>
                <select
                  className="form-input"
                  value={newCommitment.zone}
                  onChange={e => setNewCommitment({ ...newCommitment, zone: e.target.value })}
                >
                  <option>Kelani East - Sector 03</option>
                  <option>Gampaha - Ja-Ela Basin</option>
                  <option>Kalutara & Kalu Ganga Basin</option>
                  <option>Central Logistics Depot - Peliyagoda</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="partner-btn btn-secondary" onClick={() => setShowCommitmentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="partner-btn btn-primary" disabled={submitting}>
                  {submitting ? 'Logging...' : 'Confirm Inter-Agency Pledge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerPortalPage;

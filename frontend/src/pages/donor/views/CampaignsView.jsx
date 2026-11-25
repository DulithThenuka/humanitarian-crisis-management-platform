import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Download, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  X
} from 'lucide-react';

export const CampaignsView = ({
  campaigns = [],
  selectedCampaignId,
  setSelectedCampaignId,
  onCreateCampaign,
  onExportReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    targetAmount: 3000000,
    operationalArea: 'Western Province',
    category: 'Emergency Relief',
    durationDays: 30,
    targetDescription: ''
  });

  const displayCampaigns = campaigns || [];

  const filteredCampaigns = displayCampaigns.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.id && c.id.toLowerCase().includes(q)) ||
      (c.operationalArea && c.operationalArea.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || 
      (c.status && c.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!newCampaign.title.trim()) {
      alert('Please provide a campaign title.');
      return;
    }
    if (onCreateCampaign) {
      await onCreateCampaign(newCampaign);
      setShowCreateModal(false);
      setNewCampaign({
        title: '',
        targetAmount: 3000000,
        operationalArea: 'Western Province',
        category: 'Emergency Relief',
        durationDays: 30,
        targetDescription: ''
      });
    }
  };

  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <span>HUMANAID CRISIS RESPONSE APPEALS · LIVE OPERATIONS</span>
          </div>
          <h1 className="fo-title">Emergency Relief Campaigns</h1>
          <p className="fo-subtitle">
            Monitored funding campaigns connected to active crisis events. Real-time contribution tracking against humanitarian aid expenditure targets.
          </p>
        </div>

        <div className="fo-title-actions">
          <button 
            className="fo-btn fo-btn-secondary"
            onClick={onExportReport}
          >
            <Download size={14} />
            <span>Export Campaigns CSV</span>
          </button>
          <button 
            className="fo-btn fo-btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={14} />
            <span>+ Create Emergency Campaign</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fo-filter-bar">
        <div className="fo-filter-search">
          <input
            type="text"
            placeholder="Search campaigns by title, code, operational district..."
            className="fo-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="fo-filter-selects">
          <select 
            className="fo-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Campaign Statuses</option>
            <option value="Active">Active Appeals</option>
            <option value="Completed">Fully Funded / Completed</option>
          </select>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredCampaigns.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#657367' }}>
            <Target size={32} style={{ margin: '0 auto 12px', color: '#8c9c8e' }} />
            <div style={{ fontSize: '15px', fontWeight: 600 }}>No campaigns match your filter</div>
          </div>
        ) : (
          filteredCampaigns.map((camp) => {
            const percent = camp.percentFunded ?? (camp.targetAmount > 0 ? Math.min(100, Math.round((camp.raisedAmount / camp.targetAmount) * 100)) : 0);
            return (
              <div 
                key={camp.id}
                className="fo-panel"
                style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#2d5a3e', letterSpacing: '0.04em' }}>
                      {camp.id}
                    </span>
                    <span className={`fo-status-badge ${camp.status?.toLowerCase()}`}>
                      ● {camp.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {camp.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#657367', margin: '0 0 16px 0', lineHeight: 1.4, minHeight: '34px' }}>
                    {camp.targetDescription || 'Emergency relief operations and community support.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#445145', marginBottom: '14px' }}>
                    <MapPin size={12} color="#2d5a3e" />
                    <span>{camp.operationalArea || 'Western Province'}</span>
                    <span style={{ margin: '0 4px', color: '#cbd5e1' }}>|</span>
                    <span>{camp.category || 'Disaster Response'}</span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: '#657367' }}>Raised: <strong>LKR {Number(camp.raisedAmount || 0).toLocaleString()}</strong></span>
                      <span style={{ fontWeight: 700, color: '#2d5a3e' }}>{percent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${percent}%`, 
                          height: '100%', 
                          backgroundColor: percent >= 90 ? '#059669' : (percent >= 50 ? '#2d5a3e' : '#d97706'),
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }} 
                      />
                    </div>
                    <div style={{ fontSize: '11px', color: '#8c9c8e', marginTop: '4px', textAlign: 'right' }}>
                      Target: LKR {Number(camp.targetAmount || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '11px', color: '#657367' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    <span>Until {new Date(camp.endDate || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#2d5a3e' }}>Active Appeal</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fo-modal-overlay">
          <div className="fo-modal-card" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#162e20' }}>
                Establish Emergency Relief Campaign
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#657367' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label className="fo-note-label">CAMPAIGN TITLE *</label>
                <input 
                  type="text" 
                  className="fo-search-input" 
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="e.g. Kelani River Basin Flood Relief Fund (2026)"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="fo-note-label">TARGET AMOUNT (LKR) *</label>
                  <input 
                    type="number" 
                    className="fo-search-input" 
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={newCampaign.targetAmount}
                    onChange={(e) => setNewCampaign({ ...newCampaign, targetAmount: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div>
                  <label className="fo-note-label">DURATION (DAYS)</label>
                  <input 
                    type="number" 
                    className="fo-search-input" 
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={newCampaign.durationDays}
                    onChange={(e) => setNewCampaign({ ...newCampaign, durationDays: parseInt(e.target.value) || 30 })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="fo-note-label">OPERATIONAL AREA</label>
                  <select 
                    className="fo-select" 
                    style={{ width: '100%' }}
                    value={newCampaign.operationalArea}
                    onChange={(e) => setNewCampaign({ ...newCampaign, operationalArea: e.target.value })}
                  >
                    <option value="Western Province (All Districts)">Western Province (All Districts)</option>
                    <option value="Colombo District & Kelani Basin">Colombo District & Kelani Basin</option>
                    <option value="Gampaha District">Gampaha District</option>
                    <option value="Kalutara Coastal Sector">Kalutara Coastal Sector</option>
                    <option value="National Multi-Cluster">National Multi-Cluster</option>
                  </select>
                </div>

                <div>
                  <label className="fo-note-label">RELIEF CLUSTER / CATEGORY</label>
                  <select 
                    className="fo-select" 
                    style={{ width: '100%' }}
                    value={newCampaign.category}
                    onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
                  >
                    <option value="Emergency Monsoon Response">Emergency Monsoon Response</option>
                    <option value="WASH & Water Bowser Ops">WASH & Water Bowser Ops</option>
                    <option value="Medical & Mobile Triage">Medical & Mobile Triage</option>
                    <option value="Shelter Bedding & Winterization">Shelter Bedding & Winterization</option>
                    <option value="Food & Nutrition Security">Food & Nutrition Security</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="fo-note-label">TARGET DESCRIPTION & AID ALLOCATION GOALS</label>
                <textarea 
                  className="fo-note-textarea"
                  rows={3}
                  placeholder="Describe beneficiary demographics, targeted relief packages, and shelter destinations..."
                  value={newCampaign.targetDescription}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetDescription: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="fo-btn fo-btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="fo-btn fo-btn-primary"
                >
                  Launch & Activate Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsView;

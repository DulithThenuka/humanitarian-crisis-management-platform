import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronRight,
  Droplet,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  PackageCheck,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import {
  RESOURCE_COORDINATION_DATA,
  RESOURCE_DISTRIBUTION_STATUS
} from '../data/coordinatorPortalData';
import './ResourceCoordinationView.css';

export const ResourceCoordinationView = ({ showToast }) => {
  const [resources, setResources] = useState(RESOURCE_COORDINATION_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Submit Allocation Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    category: 'Drinking Water',
    requested: '',
    destination: 'Kelani East',
    relatedRecord: 'RES-022 / NEW',
    notes: ''
  });

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchSearch =
        !searchQuery ||
        res.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.relatedRecord.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === 'all' || res.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || res.fulfillmentStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchCategory && matchStatus;
    });
  }, [resources, searchQuery, categoryFilter, statusFilter]);

  const handleSendRecommendation = () => {
    showToast('Coordinator resource priority recommendation sent to Logistics Command!', 'success');
  };

  const handleCreateAllocationRequest = (e) => {
    e.preventDefault();
    if (!newRequest.requested || isNaN(newRequest.requested)) {
      showToast('Please enter a valid requested quantity', 'error');
      return;
    }

    const newItem = {
      id: `RES-${Date.now().toString().slice(-4)}`,
      category: newRequest.category,
      requested: parseInt(newRequest.requested, 10),
      unit: 'units',
      available: 0,
      allocated: 0,
      outstanding: parseInt(newRequest.requested, 10),
      fulfillmentStatus: 'Requested',
      destination: newRequest.destination,
      relatedRecord: newRequest.relatedRecord,
      priority: 'High'
    };

    setResources([newItem, ...resources]);
    setShowSubmitModal(false);
    setNewRequest({ category: 'Drinking Water', requested: '', destination: 'Kelani East', relatedRecord: 'RES-022 / NEW', notes: '' });
    showToast(`Allocation request for ${newRequest.category} submitted successfully!`, 'success');
  };

  return (
    <div className="ec-portal-canvas">
      {/* 1. Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">COLLABORATION WITH AUTHORISED RESOURCE MANAGERS</span>
          <h2 className="ec-review-main-title">Resource Coordination</h2>
          <p className="ec-review-sub-meta">
            Recommend priorities, request allocations and monitor fulfillment without implying physical delivery.
          </p>
        </div>
        <button
          className="ec-btn-action-primary"
          onClick={() => setShowSubmitModal(true)}
        >
          <Plus size={15} />
          <span>Submit allocation request</span>
        </button>
      </div>

      {/* 2. Legend & Filter Toolbar */}
      <div className="ec-rc-toolbar-container">
        {/* Status Legend */}
        <div className="ec-rc-legend-row">
          <div className="ec-rc-legend-item">
            <span className="ec-rc-dot dot-requested"></span>
            <span>Requested</span>
          </div>
          <div className="ec-rc-legend-item">
            <span className="ec-rc-dot dot-approved"></span>
            <span>Approved</span>
          </div>
          <div className="ec-rc-legend-item">
            <span className="ec-rc-dot dot-dispatched"></span>
            <span>Dispatched</span>
          </div>
          <div className="ec-rc-legend-item">
            <span className="ec-rc-dot dot-delivered"></span>
            <span>Delivered</span>
          </div>
        </div>

        {/* Inputs & Dropdowns */}
        <div className="ec-rc-filter-bar">
          <div className="ec-rc-search-box">
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search resource or related request..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ec-rc-search-input"
            />
            {searchQuery && (
              <X size={14} className="ec-rc-search-clear" onClick={() => setSearchQuery('')} />
            )}
          </div>

          <div className="ec-rc-select-group">
            <select
              className="ec-rc-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All categories</option>
              <option value="Drinking Water">Drinking Water</option>
              <option value="Emergency Food Kits">Emergency Food Kits</option>
              <option value="Medicine Packs">Medicine Packs</option>
              <option value="Temporary Shelter Kits">Temporary Shelter Kits</option>
              <option value="Hygiene & Sanitation Packs">Hygiene & Sanitation Packs</option>
            </select>

            <select
              className="ec-rc-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status: All</option>
              <option value="shortage">Shortage</option>
              <option value="approved">Approved</option>
              <option value="dispatched">Dispatched</option>
              <option value="requested">Requested</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Main Resource Coordination Table */}
      <div className="ec-rc-table-wrapper">
        <table className="ec-rc-table">
          <thead>
            <tr>
              <th>RESOURCE CATEGORY</th>
              <th>REQUESTED</th>
              <th>AVAILABLE</th>
              <th>ALLOCATED</th>
              <th>OUTSTANDING</th>
              <th>FULFILLMENT STATUS</th>
              <th>DESTINATION</th>
              <th>RELATED RECORD</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((row) => {
              const isShortage = row.fulfillmentStatus === 'Shortage' || row.outstanding > 0;
              return (
                <tr key={row.id} onClick={() => showToast(`Selected ${row.category} (${row.relatedRecord})`, 'info')}>
                  <td className="ec-rc-cell-strong">{row.category}</td>
                  <td>{row.requested} <span className="ec-rc-unit">{row.unit}</span></td>
                  <td>{row.available}</td>
                  <td>{row.allocated}</td>
                  <td className={isShortage && row.outstanding > 0 ? 'ec-rc-val-shortage' : ''}>
                    {row.outstanding}
                  </td>
                  <td>
                    <span className={`ec-rc-status-pill pill-${row.fulfillmentStatus.toLowerCase()}`}>
                      <span className="ec-rc-status-dot"></span>
                      {row.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="ec-rc-cell-dest">{row.destination}</td>
                  <td className="ec-rc-cell-ref">{row.relatedRecord}</td>
                  <td className="ec-rc-cell-action">
                    <ChevronRight size={16} className="ec-rc-chevron" />
                  </td>
                </tr>
              );
            })}
            {filteredResources.length === 0 && (
              <tr>
                <td colSpan="9" className="ec-rc-empty-state">
                  No resource records matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Bottom Cards: Relief Distribution Status & Coordinator Recommendation */}
      <div className="ec-rc-bottom-grid">
        {/* Left Card: Relief Distribution Status */}
        <div className="ec-rc-card">
          <div className="ec-rc-card-head">
            <h3 className="ec-rc-card-title">Relief distribution status</h3>
            <span className="ec-rc-card-sub">Separate operational stages</span>
          </div>

          <div className="ec-rc-stages-list">
            {RESOURCE_DISTRIBUTION_STATUS.map((item) => {
              const pct = Math.round((item.units / item.total) * 100);
              return (
                <div key={item.stage} className="ec-rc-stage-row">
                  <div className="ec-rc-stage-name">{item.stage}</div>
                  <div className="ec-rc-bar-track">
                    <div
                      className="ec-rc-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                  <div className="ec-rc-stage-count">
                    <strong>{item.units}</strong> units
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Coordinator Recommendation */}
        <div className="ec-rc-card">
          <div className="ec-rc-card-head">
            <h3 className="ec-rc-card-title">Coordinator recommendation</h3>
          </div>

          <div className="ec-rc-recommendation-box">
            <div className="ec-rc-rec-icon-wrap">
              <Droplet size={18} color="#0284c7" />
            </div>
            <div className="ec-rc-rec-content">
              <h4 className="ec-rc-rec-headline">Prioritise verified medical and shelter sites</h4>
              <p className="ec-rc-rec-body">
                RES-021 has 240 units against 380 requested. Recommend partner transfer for the remaining 140.
              </p>
            </div>
          </div>

          <div className="ec-rc-rec-action-row">
            <button
              className="ec-btn-rec-send"
              onClick={handleSendRecommendation}
            >
              <Send size={14} />
              <span>Send recommendation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submit Allocation Request Modal */}
      {showSubmitModal && (
        <div className="ec-modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">RESOURCE LOGISTICS</span>
                <h3 className="ec-modal-title">Submit Allocation Request</h3>
              </div>
              <button className="ec-modal-close-btn" onClick={() => setShowSubmitModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAllocationRequest} className="ec-modal-form">
              <div className="ec-form-field">
                <label className="ec-field-label">Resource Category *</label>
                <select
                  className="ec-form-select"
                  value={newRequest.category}
                  onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                >
                  <option value="Drinking Water">Drinking Water (bottles/bowsers)</option>
                  <option value="Emergency Food Kits">Emergency Food Kits</option>
                  <option value="Medicine Packs">Medicine Packs (trauma &amp; insulin)</option>
                  <option value="Temporary Shelter Kits">Temporary Shelter Kits</option>
                  <option value="Hygiene & Sanitation Packs">Hygiene &amp; Sanitation Packs</option>
                </select>
              </div>

              <div className="ec-form-row">
                <div className="ec-form-field">
                  <label className="ec-field-label">Requested Quantity *</label>
                  <input
                    type="number"
                    className="ec-form-input"
                    placeholder="e.g. 150"
                    required
                    value={newRequest.requested}
                    onChange={(e) => setNewRequest({ ...newRequest, requested: e.target.value })}
                  />
                </div>

                <div className="ec-form-field">
                  <label className="ec-field-label">Destination Sector *</label>
                  <select
                    className="ec-form-select"
                    value={newRequest.destination}
                    onChange={(e) => setNewRequest({ ...newRequest, destination: e.target.value })}
                  >
                    <option value="Kelani East">Kelani East</option>
                    <option value="Zone 03">Zone 03</option>
                    <option value="Wattala South">Wattala South</option>
                    <option value="Biyagama North">Biyagama North</option>
                    <option value="Peliyagoda Central">Peliyagoda Central</option>
                  </select>
                </div>
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Related Request Reference</label>
                <input
                  type="text"
                  className="ec-form-input"
                  placeholder="e.g. RES-022 / HMR-1045"
                  value={newRequest.relatedRecord}
                  onChange={(e) => setNewRequest({ ...newRequest, relatedRecord: e.target.value })}
                />
              </div>

              <div className="ec-form-field">
                <label className="ec-field-label">Operational Notes &amp; Justification</label>
                <textarea
                  className="ec-form-textarea"
                  rows="3"
                  placeholder="Explain priority level, affected persons, or urgent delivery window..."
                  value={newRequest.notes}
                  onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="ec-modal-footer">
                <button
                  type="button"
                  className="ec-btn-modal-cancel"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ec-btn-action-primary">
                  <CheckCircle2 size={15} />
                  <span>Submit to Logistics Hub</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

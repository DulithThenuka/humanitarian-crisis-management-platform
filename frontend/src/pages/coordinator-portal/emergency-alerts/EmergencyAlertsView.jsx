import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Eye,
  Edit3,
  X,
  Share2,
  Send,
  Radio
} from 'lucide-react';
import { EMERGENCY_ALERTS_LIST } from '../data/coordinatorPortalData';
import './EmergencyAlertsView.css';

export const EmergencyAlertsView = ({ showToast }) => {
  const [alerts, setAlerts] = useState(EMERGENCY_ALERTS_LIST);
  const [activeTab, setActiveTab] = useState('active'); // active, drafts, scheduled, resolved
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'create'
  const [selectedAlertForModal, setSelectedAlertForModal] = useState(null);

  // Form State for Create Alert
  const [formData, setFormData] = useState({
    title: 'Flood warning for low-lying Kelani East areas',
    category: 'Flood warning',
    severity: 'Critical',
    message: 'Water levels are expected to remain elevated. Avoid flooded roads and follow instructions from verified response teams.',
    area: 'Kelani East - Zones 02-03',
    startTime: '02/18/2026 10:30 AM',
    expiryTime: '02/18/2026 08:00 PM',
    safetyInstructions: 'Move essential medicines and documents to safety.\nDo not walk or drive through flood water.\nUse verified shelters only.'
  });

  // Filtered alerts by tab
  const filteredAlerts = alerts.filter(a => a.tab === activeTab);

  const getTabCount = (tabName) => {
    return alerts.filter(a => a.tab === tabName).length;
  };

  const handlePublishAlert = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter an alert title', 'error');
      return;
    }

    const instructionsArray = formData.safetyInstructions
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newAlert = {
      id: `ALT-${Math.floor(205 + Math.random() * 20)}`,
      title: formData.title,
      category: formData.category,
      severity: formData.severity,
      severityClass: formData.severity === 'Critical' ? 'pill-critical' : formData.severity === 'High' ? 'pill-high' : 'pill-moderate',
      area: formData.area,
      publication: 'Published',
      tab: 'active',
      createdBy: 'Maya Fernando',
      lastUpdated: 'Just now',
      startTime: formData.startTime,
      expiryTime: formData.expiryTime,
      message: formData.message,
      safetyInstructions: instructionsArray.length > 0 ? instructionsArray : ['Follow official evacuation route signage.']
    };

    setAlerts([newAlert, ...alerts]);
    setViewMode('list');
    setActiveTab('active');
    showToast(`Emergency Broadcast ${newAlert.id} published to Citizen Portal & SMS Gateway!`, 'success');
  };

  const handleSaveDraft = () => {
    const instructionsArray = formData.safetyInstructions
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const draftAlert = {
      id: `ALT-${Math.floor(205 + Math.random() * 20)}`,
      title: formData.title || 'Untitled Draft Alert',
      category: formData.category,
      severity: formData.severity,
      severityClass: 'pill-moderate',
      area: formData.area || 'Western Province',
      publication: 'Draft',
      tab: 'drafts',
      createdBy: 'Maya Fernando',
      lastUpdated: 'Just now',
      startTime: formData.startTime,
      expiryTime: formData.expiryTime,
      message: formData.message,
      safetyInstructions: instructionsArray
    };

    setAlerts([draftAlert, ...alerts]);
    setViewMode('list');
    setActiveTab('drafts');
    showToast('Alert saved to coordinator drafts queue.', 'info');
  };

  const parsedInstructions = formData.safetyInstructions
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div className="ec-portal-canvas">
      {viewMode === 'list' ? (
        /* =========================================================
           1. ALERTS MANAGEMENT LISTING VIEW (Screenshot 3)
           ========================================================= */
        <div>
          {/* Header */}
          <div className="ec-case-heading-strip">
            <div>
              <span className="ec-breadcrumb-tiny">OFFICIAL OPERATIONAL COMMUNICATION</span>
              <h2 className="ec-review-main-title">Emergency Alerts</h2>
              <p className="ec-review-sub-meta">
                Manage drafts, schedules, publication states and resolved alerts.
              </p>
            </div>
            <button
              className="ec-btn-action-primary"
              onClick={() => setViewMode('create')}
            >
              <Plus size={15} />
              <span>Create alert</span>
            </button>
          </div>

          {/* Tab Navigation Strip */}
          <div className="ec-alerts-tab-bar">
            <button
              className={`ec-alert-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              <span>Active</span>
              <span className="ec-tab-count-badge">{getTabCount('active')}</span>
            </button>

            <button
              className={`ec-alert-tab-btn ${activeTab === 'drafts' ? 'active' : ''}`}
              onClick={() => setActiveTab('drafts')}
            >
              <span>Drafts</span>
              <span className="ec-tab-count-badge">{getTabCount('drafts')}</span>
            </button>

            <button
              className={`ec-alert-tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`}
              onClick={() => setActiveTab('scheduled')}
            >
              <span>Scheduled</span>
              <span className="ec-tab-count-badge">{getTabCount('scheduled')}</span>
            </button>

            <button
              className={`ec-alert-tab-btn ${activeTab === 'resolved' ? 'active' : ''}`}
              onClick={() => setActiveTab('resolved')}
            >
              <span>Resolved</span>
              <span className="ec-tab-count-badge">{getTabCount('resolved')}</span>
            </button>
          </div>

          {/* Alerts Grid */}
          <div className="ec-alerts-grid">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="ec-alert-card">
                <div className="ec-alert-card-top">
                  <span className="ec-alert-ref-num">{alert.id}</span>
                  <span className={`ec-alert-sev-pill ${alert.severityClass}`}>
                    <span className="ec-rc-status-dot"></span>
                    {alert.severity}
                  </span>
                </div>

                <h3 className="ec-alert-card-title">{alert.title}</h3>

                <div className="ec-alert-meta-grid">
                  <div className="ec-alert-meta-item">
                    <span className="ec-meta-lbl">Affected area</span>
                    <span className="ec-meta-val">{alert.area}</span>
                  </div>
                  <div className="ec-alert-meta-item">
                    <span className="ec-meta-lbl">Publication</span>
                    <span className="ec-meta-val">{alert.publication}</span>
                  </div>
                  <div className="ec-alert-meta-item">
                    <span className="ec-meta-lbl">Created by</span>
                    <span className="ec-meta-val">{alert.createdBy}</span>
                  </div>
                  <div className="ec-alert-meta-item">
                    <span className="ec-meta-lbl">Last updated</span>
                    <span className="ec-meta-val">{alert.lastUpdated}</span>
                  </div>
                </div>

                <div className="ec-alert-card-actions">
                  <button
                    className="ec-btn-alert-outline"
                    onClick={() => setSelectedAlertForModal(alert)}
                  >
                    <span>View details</span>
                  </button>
                  <button
                    className="ec-btn-alert-outline"
                    onClick={() => {
                      setFormData({
                        title: alert.title,
                        category: alert.category,
                        severity: alert.severity,
                        message: alert.message,
                        area: alert.area,
                        startTime: alert.startTime,
                        expiryTime: alert.expiryTime,
                        safetyInstructions: alert.safetyInstructions.join('\n')
                      });
                      setViewMode('create');
                    }}
                  >
                    <span>Update alert</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="ec-alerts-empty-card">
                <p>No alerts in the <strong>{activeTab}</strong> queue.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* =========================================================
           2. CREATE EMERGENCY ALERT VIEW (Screenshots 4 & 5)
           ========================================================= */
        <div className="ec-create-alert-canvas">
          {/* Back Button */}
          <button
            className="ec-back-link-btn"
            onClick={() => setViewMode('list')}
          >
            <ArrowLeft size={15} />
            <span>Back to alerts</span>
          </button>

          {/* Heading */}
          <div className="ec-case-heading-strip" style={{ marginBottom: '22px' }}>
            <div>
              <span className="ec-breadcrumb-tiny">EMERGENCY COMMUNICATION</span>
              <h2 className="ec-review-main-title">Create Emergency Alert</h2>
              <p className="ec-review-sub-meta">
                Complete the draft, review the citizen preview, and confirm publication according to permissions.
              </p>
            </div>
            <div className="ec-draft-status-pill">
              <span className="ec-rc-status-dot" style={{ backgroundColor: '#94a3b8' }}></span>
              <span>Draft</span>
            </div>
          </div>

          {/* Two-Column Form & Live Citizen Portal Preview Layout */}
          <div className="ec-create-alert-layout">
            {/* Left Column: Form Controls */}
            <div className="ec-create-form-column">
              <form onSubmit={handlePublishAlert} className="ec-create-form-card">
                {/* Alert Title */}
                <div className="ec-form-field">
                  <label className="ec-field-label">Alert title *</label>
                  <input
                    type="text"
                    className="ec-form-input"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* Category & Severity */}
                <div className="ec-form-row">
                  <div className="ec-form-field">
                    <label className="ec-field-label">Alert category *</label>
                    <select
                      className="ec-form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Flood warning">Flood warning</option>
                      <option value="Evacuation Order">Evacuation Order</option>
                      <option value="Temporary Road Closure">Temporary Road Closure</option>
                      <option value="Drinking Water Advisory">Drinking Water Advisory</option>
                      <option value="Severe Weather Alert">Severe Weather Alert</option>
                    </select>
                  </div>

                  <div className="ec-form-field">
                    <label className="ec-field-label">Severity *</label>
                    <select
                      className="ec-form-select"
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="ec-form-field">
                  <label className="ec-field-label">Message *</label>
                  <textarea
                    className="ec-form-textarea"
                    rows="3"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                {/* Affected general area */}
                <div className="ec-form-field">
                  <label className="ec-field-label">Affected general area *</label>
                  <input
                    type="text"
                    className="ec-form-input"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>

                {/* Start & Expiry Time */}
                <div className="ec-form-row">
                  <div className="ec-form-field">
                    <label className="ec-field-label">Start time *</label>
                    <input
                      type="text"
                      className="ec-form-input"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>

                  <div className="ec-form-field">
                    <label className="ec-field-label">Expiry time</label>
                    <input
                      type="text"
                      className="ec-form-input"
                      value={formData.expiryTime}
                      onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
                    />
                  </div>
                </div>

                {/* Safety instructions */}
                <div className="ec-form-field">
                  <label className="ec-field-label">Safety instructions *</label>
                  <textarea
                    className="ec-form-textarea"
                    rows="4"
                    value={formData.safetyInstructions}
                    onChange={(e) => setFormData({ ...formData, safetyInstructions: e.target.value })}
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="ec-form-actions-row">
                  <button
                    type="button"
                    className="ec-btn-save-draft"
                    onClick={handleSaveDraft}
                  >
                    <span>Save draft</span>
                  </button>
                  <button
                    type="submit"
                    className="ec-btn-action-primary"
                  >
                    <Radio size={14} />
                    <span>Publish broadcast alert</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Live Citizen Portal Preview */}
            <div className="ec-preview-column">
              <div className="ec-preview-card">
                <span className="ec-preview-header-lbl">CITIZEN PORTAL PREVIEW</span>

                {/* Citizen Emergency Alert Banner Preview */}
                <div className={`ec-citizen-alert-box sev-${formData.severity.toLowerCase()}`}>
                  <div className="ec-cab-icon-wrap">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h4 className="ec-cab-title">{formData.title || 'Emergency Alert Title'}</h4>
                    <div className="ec-cab-meta">
                      {formData.severity} · {formData.area || 'All Sectors'} · Official prototype alert
                    </div>
                  </div>
                </div>

                {/* Citizen Message */}
                <p className="ec-citizen-message-text">
                  {formData.message || 'Alert message text will appear here.'}
                </p>

                {/* Citizen Safety Instructions */}
                <div className="ec-citizen-safety-card">
                  <h5 className="ec-csc-title">Safety instructions</h5>
                  <div className="ec-csc-list">
                    {parsedInstructions.map((inst, idx) => (
                      <div key={idx} className="ec-csc-item">
                        <CheckCircle2 size={16} color="#0284c7" className="ec-csc-check" />
                        <span>{inst}</span>
                      </div>
                    ))}
                    {parsedInstructions.length === 0 && (
                      <div className="ec-csc-item" style={{ color: '#94a3b8' }}>
                        No specific instructions entered.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Details Modal */}
      {selectedAlertForModal && (
        <div className="ec-modal-overlay" onClick={() => setSelectedAlertForModal(null)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">BROADCAST RECORD #{selectedAlertForModal.id}</span>
                <h3 className="ec-modal-title">{selectedAlertForModal.title}</h3>
              </div>
              <button className="ec-modal-close-btn" onClick={() => setSelectedAlertForModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ec-modal-body-pad">
              <div className="ec-alert-detail-banner">
                <span className={`ec-alert-sev-pill ${selectedAlertForModal.severityClass}`}>
                  {selectedAlertForModal.severity}
                </span>
                <span>Area: <strong>{selectedAlertForModal.area}</strong></span>
                <span>Created by: <strong>{selectedAlertForModal.createdBy}</strong></span>
              </div>

              <div style={{ margin: '16px 0', fontSize: '13.5px', color: '#1e293b', lineHeight: '1.5' }}>
                {selectedAlertForModal.message}
              </div>

              <div className="ec-citizen-safety-card">
                <h5 className="ec-csc-title">Safety instructions</h5>
                <div className="ec-csc-list">
                  {selectedAlertForModal.safetyInstructions.map((s, idx) => (
                    <div key={idx} className="ec-csc-item">
                      <CheckCircle2 size={16} color="#0284c7" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ec-modal-footer">
              <button
                type="button"
                className="ec-btn-modal-cancel"
                onClick={() => setSelectedAlertForModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="ec-btn-action-primary"
                onClick={() => {
                  showToast(`Emergency alert ${selectedAlertForModal.id} re-broadcast queued!`, 'success');
                  setSelectedAlertForModal(null);
                }}
              >
                <Share2 size={15} />
                <span>Re-broadcast Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

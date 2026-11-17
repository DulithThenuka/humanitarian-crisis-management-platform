import React, { useState, useEffect } from 'react';
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
  Radio,
  FileText,
  CheckCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import coordinatorService from '../../../services/coordinatorService';
import './EmergencyAlertsView.css';

export const EmergencyAlertsView = ({
  showToast,
  alerts: sharedAlerts,
  setAlerts: setSharedAlerts,
  onRefreshAlerts,
  cases = []
}) => {
  const { user } = useAuth();
  const coordinatorName = user?.fullName || 'Jane Coordinator';

  const [localAlerts, setLocalAlerts] = useState([]);
  const alerts = sharedAlerts !== undefined ? sharedAlerts : localAlerts;
  const setAlerts = setSharedAlerts || setLocalAlerts;

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'drafts' | 'scheduled' | 'resolved'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'create'
  const [editingAlertId, setEditingAlertId] = useState(null); // null when creating, string ID when editing

  const [selectedAlertForModal, setSelectedAlertForModal] = useState(null);
  const [resolvingAlert, setResolvingAlert] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const defaultFormData = {
    title: '',
    category: 'Flood warning',
    severity: 'Critical',
    message: '',
    area: 'Western Province',
    relatedIncident: '',
    startTime: '',
    expiryTime: '',
    scheduledDate: '',
    safetyInstructions: 'Move vital medicines, dry rations and identity documents to high ground.\nDo not attempt to walk or drive through flowing water.\nFollow instructions from authorized relief personnel.',
    publicationStatus: 'Published'
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Initial load if sharedAlerts not provided or empty
  useEffect(() => {
    if (!sharedAlerts || sharedAlerts.length === 0) {
      coordinatorService.getAlerts().then(backendAlerts => {
        const rawAlerts = Array.isArray(backendAlerts) ? backendAlerts : (backendAlerts?.data && Array.isArray(backendAlerts.data) ? backendAlerts.data : []);
        if (rawAlerts && rawAlerts.length > 0) {
          const mapped = rawAlerts.map(a => ({
            id: a.id,
            sourceCrisisEventId: a.sourceCrisisEventId,
            title: a.title,
            category: a.category || 'Flood warning',
            severity: a.severity || 'Critical',
            severityClass: (a.severity || '').toLowerCase() === 'critical' ? 'pill-critical' : (a.severity || '').toLowerCase() === 'high' ? 'pill-high' : 'pill-moderate',
            area: a.area || 'Western Province',
            relatedIncident: a.relatedIncident || '',
            publication: a.publication || 'Published',
            tab: a.tab || 'active',
            createdBy: a.createdBy || coordinatorName,
            createdDate: a.createdDate || a.lastUpdated || 'Recently',
            lastUpdated: a.lastUpdated || 'Recently',
            startTime: a.startTime || 'Now',
            expiryTime: a.expiryTime || 'Ongoing',
            scheduledDate: a.scheduledDate || null,
            resolutionNotes: a.resolutionNotes || null,
            resolvedAt: a.resolvedAt || null,
            resolvedBy: a.resolvedBy || null,
            message: a.message || '',
            safetyInstructions: a.safetyInstructions && a.safetyInstructions.length > 0 ? a.safetyInstructions : ['Follow official evacuation route signage.']
          }));
          setAlerts(mapped);
        }
      }).catch(err => {
        console.warn('Backend alerts offline or unauthenticated:', err.message);
      });
    }
  }, [coordinatorName, setAlerts, sharedAlerts]);

  // Tab Counts based on actual backend records
  const activeCount = alerts.filter(a => a.tab === 'active' || a.publication === 'Published').length;
  const draftsCount = alerts.filter(a => a.tab === 'drafts' || a.publication === 'Draft').length;
  const scheduledCount = alerts.filter(a => a.tab === 'scheduled' || a.publication === 'Scheduled').length;
  const resolvedCount = alerts.filter(a => a.tab === 'resolved' || a.publication === 'Resolved').length;

  // Filtered alerts by tab
  const filteredAlerts = alerts.filter(a => {
    if (activeTab === 'active') return a.tab === 'active' || a.publication === 'Published';
    if (activeTab === 'drafts') return a.tab === 'drafts' || a.publication === 'Draft';
    if (activeTab === 'scheduled') return a.tab === 'scheduled' || a.publication === 'Scheduled';
    if (activeTab === 'resolved') return a.tab === 'resolved' || a.publication === 'Resolved';
    return true;
  });

  // Open Create Mode
  const handleOpenCreate = () => {
    setEditingAlertId(null);
    setFormData({
      ...defaultFormData,
      publicationStatus: activeTab === 'drafts' ? 'Draft' : activeTab === 'scheduled' ? 'Scheduled' : 'Published'
    });
    setViewMode('create');
  };

  // Open Edit Mode
  const handleOpenEdit = (alert) => {
    setEditingAlertId(alert.id);
    const pubStatus = alert.publication === 'Draft' ? 'Draft'
      : alert.publication === 'Scheduled' ? 'Scheduled'
      : alert.publication === 'Resolved' ? 'Resolved'
      : 'Published';

    setFormData({
      title: alert.title || '',
      category: alert.category || 'Flood warning',
      severity: alert.severity || 'Critical',
      message: alert.message || '',
      area: alert.area || 'Western Province',
      relatedIncident: alert.relatedIncident || '',
      startTime: alert.startTime || '',
      expiryTime: alert.expiryTime || '',
      scheduledDate: alert.scheduledDate || '',
      safetyInstructions: Array.isArray(alert.safetyInstructions) ? alert.safetyInstructions.join('\n') : '',
      publicationStatus: pubStatus,
      resolutionNotes: alert.resolutionNotes || ''
    });
    setViewMode('create');
  };

  // Submit Handler (Create or Update)
  const handleSaveAlert = async (targetPublicationStatus) => {
    if (!formData.title.trim()) {
      showToast && showToast('Please enter an alert title', 'error');
      return;
    }
    if (!formData.message.trim()) {
      showToast && showToast('Please enter a broadcast message', 'error');
      return;
    }

    const pubStatus = targetPublicationStatus || formData.publicationStatus || 'Published';
    const isDraft = pubStatus === 'Draft';
    const isScheduled = pubStatus === 'Scheduled';

    const instructionsArray = formData.safetyInstructions
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      severity: formData.severity,
      message: formData.message.trim(),
      area: formData.area.trim(),
      relatedIncident: formData.relatedIncident ? formData.relatedIncident.trim() : null,
      startTime: formData.startTime || null,
      expiryTime: formData.expiryTime || null,
      scheduledDate: isScheduled ? (formData.scheduledDate || null) : null,
      safetyInstructions: instructionsArray.length > 0 ? instructionsArray : ['Follow official guidance.'],
      isDraft,
      publicationStatus: pubStatus,
      resolutionNotes: pubStatus === 'Resolved' ? (formData.resolutionNotes || null) : null
    };

    try {
      setIsSubmitting(true);
      if (editingAlertId) {
        // UPDATE existing alert
        const updated = await coordinatorService.updateAlert(editingAlertId, payload);
        showToast && showToast(`Emergency Alert ${editingAlertId} updated successfully!`, 'success');
      } else {
        // CREATE new alert
        const created = await coordinatorService.createAlert(payload);
        const successMsg = isDraft
          ? `Alert ${created?.id || ''} saved to drafts queue.`
          : isScheduled
          ? `Alert ${created?.id || ''} scheduled for future broadcast.`
          : `Emergency Broadcast ${created?.id || ''} published successfully!`;
        showToast && showToast(successMsg, 'success');
      }

      setViewMode('list');
      setEditingAlertId(null);
      if (onRefreshAlerts) {
        await onRefreshAlerts();
      } else {
        const res = await coordinatorService.getAlerts();
        if (res) setAlerts(res);
      }

      // Switch to matching tab
      if (isDraft) setActiveTab('drafts');
      else if (isScheduled) setActiveTab('scheduled');
      else if (pubStatus === 'Resolved') setActiveTab('resolved');
      else setActiveTab('active');

    } catch (err) {
      console.error('Error saving alert:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to persist alert in database.';
      showToast && showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Action: Publish Draft or Scheduled Alert Immediately
  const handleQuickPublish = async (alertId) => {
    try {
      setIsSubmitting(true);
      await coordinatorService.publishAlert(alertId);
      showToast && showToast(`Emergency Alert ${alertId} published to live broadcast!`, 'success');
      if (selectedAlertForModal && selectedAlertForModal.id === alertId) {
        setSelectedAlertForModal(null);
      }
      if (onRefreshAlerts) await onRefreshAlerts();
      setActiveTab('active');
    } catch (err) {
      console.error('Error publishing alert:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to publish alert.';
      showToast && showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Action: Open Resolve Dialog
  const handleOpenResolveDialog = (alert) => {
    setResolvingAlert(alert);
    setResolutionNotes(`All public safety measures completed for ${alert.title}. Danger has receded.`);
  };

  // Quick Action: Confirm Resolve
  const handleConfirmResolve = async () => {
    if (!resolvingAlert) return;
    try {
      setIsSubmitting(true);
      await coordinatorService.resolveAlert(resolvingAlert.id, {
        resolutionNotes: resolutionNotes.trim()
      });
      showToast && showToast(`Emergency Alert ${resolvingAlert.id} has been marked as resolved.`, 'success');
      setResolvingAlert(null);
      if (selectedAlertForModal && selectedAlertForModal.id === resolvingAlert.id) {
        setSelectedAlertForModal(null);
      }
      if (onRefreshAlerts) await onRefreshAlerts();
      setActiveTab('resolved');
    } catch (err) {
      console.error('Error resolving alert:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to resolve alert.';
      showToast && showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedInstructions = formData.safetyInstructions
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div className="ec-portal-canvas">
      {viewMode === 'list' ? (
        /* =========================================================
           1. ALERTS MANAGEMENT LISTING VIEW
           ========================================================= */
        <div>
          {/* Header */}
          <div className="ec-case-heading-strip">
            <div>
              <span className="ec-breadcrumb-tiny">OFFICIAL OPERATIONAL COMMUNICATION</span>
              <h2 className="ec-review-main-title">Emergency Alerts</h2>
              <p className="ec-review-sub-meta">
                Manage drafts, schedules, publication states, and resolved broadcast records.
              </p>
            </div>
            <button
              className="ec-btn-action-primary"
              onClick={handleOpenCreate}
            >
              <Plus size={15} />
              <span>Create alert</span>
            </button>
          </div>

          {/* Tab Navigation Strip with Accurate DB Counts */}
          <div className="ec-alerts-tab-bar">
            <button
              className={`ec-alert-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              <span>Active</span>
              <span className="ec-tab-count-badge">{activeCount}</span>
            </button>

            <button
              className={`ec-alert-tab-btn ${activeTab === 'drafts' ? 'active' : ''}`}
              onClick={() => setActiveTab('drafts')}
            >
              <span>Drafts</span>
              <span className="ec-tab-count-badge">{draftsCount}</span>
            </button>

            <button
              className={`ec-alert-tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`}
              onClick={() => setActiveTab('scheduled')}
            >
              <span>Scheduled</span>
              <span className="ec-tab-count-badge">{scheduledCount}</span>
            </button>

            <button
              className={`ec-alert-tab-btn ${activeTab === 'resolved' ? 'active' : ''}`}
              onClick={() => setActiveTab('resolved')}
            >
              <span>Resolved</span>
              <span className="ec-tab-count-badge">{resolvedCount}</span>
            </button>
          </div>

          {/* Alerts Grid */}
          <div className="ec-alerts-grid">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="ec-alert-card">
                <div>
                  <div className="ec-alert-card-top">
                    <span className="ec-alert-ref-num">{alert.id}</span>
                    <span className={`ec-alert-sev-pill ${alert.severityClass || 'pill-high'}`}>
                      <span className="ec-rc-status-dot"></span>
                      {alert.severity}
                    </span>
                  </div>

                  <h3 className="ec-alert-card-title" style={{ marginTop: '10px' }}>{alert.title}</h3>

                  <div className="ec-alert-meta-grid" style={{ marginTop: '14px' }}>
                    <div className="ec-alert-meta-item">
                      <span className="ec-meta-lbl">Affected area</span>
                      <span className="ec-meta-val">{alert.area}</span>
                    </div>
                    <div className="ec-alert-meta-item">
                      <span className="ec-meta-lbl">Publication</span>
                      <span className="ec-meta-val" style={{
                        color: alert.publication === 'Published' ? '#059669' : alert.publication === 'Scheduled' ? '#0284c7' : alert.publication === 'Draft' ? '#64748b' : '#475569'
                      }}>
                        {alert.publication}
                      </span>
                    </div>
                    <div className="ec-alert-meta-item">
                      <span className="ec-meta-lbl">Created by</span>
                      <span className="ec-meta-val">{alert.createdBy}</span>
                    </div>
                    <div className="ec-alert-meta-item">
                      <span className="ec-meta-lbl">
                        {alert.publication === 'Scheduled' ? 'Scheduled for' : alert.publication === 'Resolved' ? 'Resolved at' : 'Last updated'}
                      </span>
                      <span className="ec-meta-val">
                        {alert.publication === 'Scheduled' ? (alert.scheduledDate || alert.startTime) : alert.publication === 'Resolved' ? (alert.resolvedAt || alert.lastUpdated) : alert.lastUpdated}
                      </span>
                    </div>
                  </div>

                  {alert.relatedIncident && (
                    <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#0284c7', background: '#f0f9ff', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                      Linked Incident: <strong>{alert.relatedIncident}</strong>
                    </div>
                  )}

                  {alert.resolutionNotes && (
                    <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#475569', background: '#f8fafc', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid #94a3b8' }}>
                      <strong>Resolution:</strong> {alert.resolutionNotes}
                    </div>
                  )}
                </div>

                <div className="ec-alert-card-actions-row">
                  <button
                    className="ec-btn-alert-outline"
                    style={{ flex: 1 }}
                    onClick={() => setSelectedAlertForModal(alert)}
                  >
                    <span>View details</span>
                  </button>

                  <button
                    className="ec-btn-alert-outline"
                    style={{ flex: 1 }}
                    onClick={() => handleOpenEdit(alert)}
                  >
                    <span>Update alert</span>
                  </button>

                  {/* Contextual quick action buttons */}
                  {alert.publication === 'Published' && (
                    <button
                      className="ec-btn-resolve-outline"
                      title="Mark emergency alert as resolved"
                      onClick={() => handleOpenResolveDialog(alert)}
                    >
                      <span>Resolve</span>
                    </button>
                  )}

                  {(alert.publication === 'Draft' || alert.publication === 'Scheduled') && (
                    <button
                      className="ec-btn-publish-outline"
                      title="Publish broadcast alert immediately"
                      onClick={() => handleQuickPublish(alert.id)}
                    >
                      <Radio size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      <span>Publish</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="ec-alerts-empty-card">
                <p>No alerts in the <strong>{activeTab}</strong> queue.</p>
                <button
                  className="ec-btn-hero-primary"
                  style={{ marginTop: '12px', fontSize: '12.5px' }}
                  onClick={handleOpenCreate}
                >
                  <Plus size={14} />
                  <span>Create {activeTab.slice(0, -1)} alert</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* =========================================================
           2. CREATE / UPDATE EMERGENCY ALERT VIEW
           ========================================================= */
        <div className="ec-create-alert-canvas">
          {/* Back Button */}
          <button
            className="ec-back-link-btn"
            onClick={() => {
              setViewMode('list');
              setEditingAlertId(null);
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to alerts</span>
          </button>

          {/* Heading */}
          <div className="ec-case-heading-strip" style={{ marginBottom: '22px' }}>
            <div>
              <span className="ec-breadcrumb-tiny">
                {editingAlertId ? `UPDATE BROADCAST RECORD #${editingAlertId}` : 'EMERGENCY COMMUNICATION'}
              </span>
              <h2 className="ec-review-main-title">
                {editingAlertId ? `Update Emergency Alert (${editingAlertId})` : 'Create Emergency Alert'}
              </h2>
              <p className="ec-review-sub-meta">
                {editingAlertId
                  ? 'Update alert specifications and synchronize changes with the SQL Server backend and live channels.'
                  : 'Complete the draft, review the citizen preview, and confirm publication according to permissions.'}
              </p>
            </div>
            <div className="ec-draft-status-pill">
              <span
                className="ec-rc-status-dot"
                style={{
                  backgroundColor: formData.publicationStatus === 'Published' ? '#10b981' : formData.publicationStatus === 'Scheduled' ? '#0284c7' : '#94a3b8'
                }}
              ></span>
              <span>{formData.publicationStatus}</span>
            </div>
          </div>

          {/* Two-Column Form & Live Citizen Portal Preview Layout */}
          <div className="ec-create-alert-layout">
            {/* Left Column: Form Controls */}
            <div className="ec-create-form-column">
              <div className="ec-create-form-card">
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
                      <option value="Storm warning">Storm warning</option>
                      <option value="Landslide warning">Landslide warning</option>
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

                {/* Affected general area & Related Incident */}
                <div className="ec-form-row">
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

                  <div className="ec-form-field">
                    <label className="ec-field-label">Related Incident / Crisis</label>
                    <select
                      className="ec-form-select"
                      value={formData.relatedIncident}
                      onChange={(e) => setFormData({ ...formData, relatedIncident: e.target.value })}
                    >
                      <option value="">-- General Operational Notice --</option>
                      {cases.map((c) => (
                        <option key={c.id} value={c.caseNumber || c.id}>
                          {c.caseNumber || c.id} · {c.category || 'Incident'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="ec-form-field">
                  <label className="ec-field-label">Broadcast message *</label>
                  <textarea
                    className="ec-form-textarea"
                    rows="3"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                {/* Scheduled Broadcast Date & Time */}
                <div className="ec-form-row">
                  <div className="ec-form-field">
                    <label className="ec-field-label">Scheduled broadcast time (if scheduling)</label>
                    <input
                      type="datetime-local"
                      className="ec-form-input"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value, publicationStatus: e.target.value ? 'Scheduled' : formData.publicationStatus })}
                    />
                  </div>

                  <div className="ec-form-field">
                    <label className="ec-field-label">Publication status</label>
                    <select
                      className="ec-form-select"
                      value={formData.publicationStatus}
                      onChange={(e) => setFormData({ ...formData, publicationStatus: e.target.value })}
                    >
                      <option value="Published">Published (Active)</option>
                      <option value="Draft">Draft</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* Resolution Notes if Resolved */}
                {formData.publicationStatus === 'Resolved' && (
                  <div className="ec-form-field">
                    <label className="ec-field-label">Resolution notes</label>
                    <input
                      type="text"
                      className="ec-form-input"
                      placeholder="e.g. Danger lifted, safe to return home."
                      value={formData.resolutionNotes || ''}
                      onChange={(e) => setFormData({ ...formData, resolutionNotes: e.target.value })}
                    />
                  </div>
                )}

                {/* Safety instructions */}
                <div className="ec-form-field">
                  <label className="ec-field-label">Safety instructions (one per line) *</label>
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
                    disabled={isSubmitting}
                    onClick={() => handleSaveAlert('Draft')}
                  >
                    <span>Save as Draft</span>
                  </button>

                  <button
                    type="button"
                    className="ec-btn-save-draft"
                    style={{ borderColor: '#0284c7', color: '#0284c7' }}
                    disabled={isSubmitting}
                    onClick={() => handleSaveAlert('Scheduled')}
                  >
                    <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    <span>Schedule</span>
                  </button>

                  <button
                    type="button"
                    className="ec-btn-action-primary"
                    disabled={isSubmitting}
                    onClick={() => handleSaveAlert('Published')}
                  >
                    <Radio size={14} />
                    <span>{editingAlertId ? 'Update & Publish' : 'Publish Broadcast Alert'}</span>
                  </button>
                </div>
              </div>
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
                      {formData.severity} · {formData.area || 'All Sectors'} · {formData.publicationStatus}
                    </div>
                  </div>
                </div>

                {/* Citizen Message */}
                <p className="ec-citizen-message-text">
                  {formData.message || 'Alert broadcast message will be presented here to citizens.'}
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

      {/* View Alert Details Modal */}
      {selectedAlertForModal && (
        <div className="ec-modal-overlay" onClick={() => setSelectedAlertForModal(null)}>
          <div className="ec-modal-dialog" style={{ maxWidth: '600px', width: '92%' }} onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">BROADCAST RECORD #{selectedAlertForModal.id}</span>
                <h3 className="ec-modal-title" style={{ marginTop: '4px' }}>{selectedAlertForModal.title}</h3>
              </div>
              <button className="ec-modal-close-btn" onClick={() => setSelectedAlertForModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ec-modal-body-pad">
              <div className="ec-alert-detail-banner" style={{ flexWrap: 'wrap' }}>
                <span className={`ec-alert-sev-pill ${selectedAlertForModal.severityClass || 'pill-high'}`}>
                  {selectedAlertForModal.severity}
                </span>
                <span>Area: <strong>{selectedAlertForModal.area}</strong></span>
                <span>Status: <strong>{selectedAlertForModal.publication}</strong></span>
                <span>Created by: <strong>{selectedAlertForModal.createdBy}</strong></span>
              </div>

              {selectedAlertForModal.relatedIncident && (
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#0369a1', background: '#f0f9ff', padding: '6px 12px', borderRadius: '6px' }}>
                  Related Crisis Incident: <strong>{selectedAlertForModal.relatedIncident}</strong>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px', fontSize: '12px', color: '#64748b', background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                <div>Created: <strong>{selectedAlertForModal.createdDate || selectedAlertForModal.startTime || 'Recorded'}</strong></div>
                <div>Last Updated: <strong>{selectedAlertForModal.lastUpdated}</strong></div>
                {selectedAlertForModal.scheduledDate && (
                  <div style={{ gridColumn: '1 / -1', color: '#0284c7' }}>
                    Scheduled Broadcast: <strong>{selectedAlertForModal.scheduledDate}</strong>
                  </div>
                )}
                {selectedAlertForModal.resolutionNotes && (
                  <div style={{ gridColumn: '1 / -1', color: '#059669' }}>
                    Resolution Notes: <strong>{selectedAlertForModal.resolutionNotes}</strong>
                  </div>
                )}
              </div>

              <div style={{ margin: '16px 0', fontSize: '13.5px', color: '#1e293b', lineHeight: '1.55', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>Broadcast Message:</strong>
                <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-line' }}>{selectedAlertForModal.message}</p>
              </div>

              <div className="ec-citizen-safety-card">
                <h5 className="ec-csc-title">Safety instructions</h5>
                <div className="ec-csc-list">
                  {selectedAlertForModal.safetyInstructions && selectedAlertForModal.safetyInstructions.map((s, idx) => (
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
                className="ec-btn-alert-outline"
                onClick={() => {
                  const alertToEdit = selectedAlertForModal;
                  setSelectedAlertForModal(null);
                  handleOpenEdit(alertToEdit);
                }}
              >
                <Edit3 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                <span>Update Alert</span>
              </button>

              {selectedAlertForModal.publication === 'Published' && (
                <button
                  type="button"
                  className="ec-btn-resolve-outline"
                  onClick={() => {
                    const alertToResolve = selectedAlertForModal;
                    setSelectedAlertForModal(null);
                    handleOpenResolveDialog(alertToResolve);
                  }}
                >
                  <CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  <span>Resolve Alert</span>
                </button>
              )}

              {(selectedAlertForModal.publication === 'Draft' || selectedAlertForModal.publication === 'Scheduled') && (
                <button
                  type="button"
                  className="ec-btn-action-primary"
                  onClick={() => handleQuickPublish(selectedAlertForModal.id)}
                >
                  <Radio size={14} />
                  <span>Publish Broadcast Immediately</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resolve Alert Confirmation Modal */}
      {resolvingAlert && (
        <div className="ec-modal-overlay" onClick={() => setResolvingAlert(null)}>
          <div className="ec-modal-dialog" style={{ maxWidth: '520px', width: '92%' }} onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={20} color="#059669" />
                <h3 className="ec-modal-title">Resolve Alert #{resolvingAlert.id}</h3>
              </div>
              <button className="ec-modal-close-btn" onClick={() => setResolvingAlert(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ec-modal-body-pad">
              <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                Marking <strong>{resolvingAlert.title}</strong> as resolved will archive it to the <strong>Resolved</strong> tab and signal to emergency teams that this advisory is concluded.
              </p>

              <div className="ec-form-field">
                <label className="ec-field-label">Resolution summary / notes *</label>
                <textarea
                  className="ec-form-textarea"
                  rows="3"
                  required
                  placeholder="e.g. Danger has passed, flood waters receded, all evacuation routes reopened."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="ec-modal-footer">
              <button
                type="button"
                className="ec-btn-modal-cancel"
                onClick={() => setResolvingAlert(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ec-btn-action-primary"
                style={{ background: '#059669' }}
                onClick={handleConfirmResolve}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resolving...' : 'Confirm Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

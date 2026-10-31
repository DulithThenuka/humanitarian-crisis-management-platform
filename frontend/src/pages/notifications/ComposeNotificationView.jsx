import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Download, 
  Save, 
  Send, 
  ShieldCheck, 
  FileText, 
  AlertTriangle,
  Smartphone,
  Mail,
  Radio,
  Check
} from 'lucide-react';
import { NOTIFICATION_CATEGORIES, OPERATIONAL_AREAS, ORGANISATIONS } from './notificationData';

export const ComposeNotificationView = ({ 
  onBackToHub, 
  onSelectScreen, 
  onCreateNotification, 
  onExport,
  showToast 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    reference: 'COM-2282',
    category: '',
    status: 'Active',
    description: '',
    operationalArea: 'Kelani East - Zone 03',
    responsibleOrg: 'National Relief Unit',
    startDate: '2026-02-18',
    reviewDate: '2026-02-18',
    channels: ['SMS', 'Push'],
    audience: 'All Citizens in Sector'
  });

  const [previewTab, setPreviewTab] = useState('sms');

  const moduleScreens = [
    { id: 'inbox', label: 'Notification Inbox' },
    { id: 'compose', label: 'Compose Notification' },
    { id: 'recipient-drawer', label: 'Recipient Detail Drawer' },
    { id: 'delivery-status', label: 'Email & SMS Delivery Status' },
    { id: 'failed-handling', label: 'Failed Notification Handling' },
    { id: 'detail', label: 'Notification Detail' }
  ];

  const handleToggleChannel = (channel) => {
    setFormData(prev => {
      const exists = prev.channels.includes(channel);
      const next = exists 
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel];
      return { ...prev, channels: next.length > 0 ? next : [channel] };
    });
  };

  const handleSaveDraft = () => {
    showToast?.('Draft saved locally. Reference: COM-2282 (Draft)', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast?.('Please enter a notification title or name', 'error');
      return;
    }
    if (!formData.category) {
      showToast?.('Please select an operational category', 'error');
      return;
    }

    const newNotification = {
      id: formData.reference,
      name: formData.title,
      subtitle: `${formData.category} - Operational Record`,
      category: formData.channels.join(' + '),
      channelType: formData.channels.join('-').toLowerCase(),
      channels: formData.channels,
      status: 'Sent',
      statusType: 'sent',
      updated: 'Just now',
      date: new Date().toISOString().split('T')[0],
      owner: 'Amara Jayasinghe',
      role: 'System Administrator',
      operationalArea: formData.operationalArea,
      organisation: formData.responsibleOrg,
      recipientsCount: 85,
      deliveredCount: 84,
      failedCount: 1,
      priority: formData.category.includes('Emergency') || formData.category.includes('Evacuation') ? 'Critical' : 'High',
      description: formData.description || 'Operational notification dispatched across selected integration channels.',
      translations: {
        en: formData.description || formData.title,
        si: `[ස්වයංක්‍රීය පරිවර්තනය]: ${formData.title}`,
        ta: `[தானியங்கி மொழிபெயர்ப்பு]: ${formData.title}`
      },
      sha256: '0x' + Math.random().toString(16).substr(2, 64),
      deliveryTimeMs: 1100
    };

    onCreateNotification(newNotification);
    showToast?.(`Notification ${formData.reference} successfully queued and dispatched!`, 'success');
    onSelectScreen('inbox');
  };

  return (
    <div className="notif-container">
      {/* 1. Breadcrumb Row */}
      <div className="notif-breadcrumb-row">
        <button 
          type="button" 
          className="notif-back-btn"
          onClick={onBackToHub}
        >
          <ChevronLeft size={14} />
          <span>Back to Notification Centre</span>
        </button>
        <span className="notif-breadcrumb-path-text">
          Notification Centre / Compose Notification
        </span>
      </div>

      {/* 2. Page Header & Actions */}
      <div className="notif-header-row">
        <div className="notif-header-col-left">
          <span className="notif-section-tag">COMMUNICATIONS</span>
          <h1 className="notif-page-title">Compose Notification</h1>
          <p className="notif-page-subtitle">
            Manage recipient notifications across email, SMS and push integration channels. · Fictional demonstration data
          </p>
        </div>

        <div className="notif-header-actions">
          <button 
            type="button" 
            className="btn-notif-outline"
            onClick={onExport}
          >
            <Download size={13} />
            <span>Export</span>
          </button>
          <button 
            type="button" 
            className="btn-notif-primary"
            onClick={handleSubmit}
          >
            <Save size={13} />
            <span>Save changes</span>
          </button>
        </div>
      </div>

      {/* 3. Horizontal MODULE SCREENS Tab Bar */}
      <div className="notif-subscreens-bar">
        <span className="subscreens-label">MODULE SCREENS</span>
        <div className="subscreens-tabs-list">
          {moduleScreens.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`module-screen-tab-btn ${tab.id === 'compose' ? 'active' : ''}`}
              onClick={() => onSelectScreen(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Split Grid: Form Left, Guidance & Smartphone Preview Right */}
      <form onSubmit={handleSubmit} className="compose-split-grid">
        {/* Form Card Left */}
        <div className="compose-form-card">
          {/* Section 01: Core Information */}
          <div className="form-section-block">
            <div className="form-section-head">
              <div className="section-num-badge">01</div>
              <div className="section-title-wrap">
                <h3>Core information</h3>
                <p className="section-subtext">Required fields are marked and validated before submission.</p>
              </div>
            </div>

            <div className="form-fields-grid-2">
              <div className="form-field-group">
                <label className="form-field-label">
                  Title or name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Enter compose notification name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Reference</label>
                <input
                  type="text"
                  className="form-input-text readonly"
                  value={formData.reference}
                  readOnly
                />
              </div>
            </div>

            <div className="form-fields-grid-2">
              <div className="form-field-group">
                <label className="form-field-label">
                  Category <span className="req">*</span>
                </label>
                <select
                  className="form-select-dropdown"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {NOTIFICATION_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Operational status *</label>
                <select
                  className="form-select-dropdown"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>

            <div className="form-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-field-label">
                  Description <span className="req">*</span>
                </label>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {formData.description.length}/320 characters
                </span>
              </div>
              <textarea
                className="form-textarea"
                placeholder="Provide clear operational details and relevant context..."
                value={formData.description}
                maxLength={320}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          {/* Section 02: Assignment & Location */}
          <div className="form-section-block">
            <div className="form-section-head">
              <div className="section-num-badge">02</div>
              <div className="section-title-wrap">
                <h3>Assignment &amp; location</h3>
                <p className="section-subtext">Access is restricted to authorised organisations.</p>
              </div>
            </div>

            <div className="form-fields-grid-2">
              <div className="form-field-group">
                <label className="form-field-label">Operational area</label>
                <select
                  className="form-select-dropdown"
                  value={formData.operationalArea}
                  onChange={(e) => setFormData({ ...formData, operationalArea: e.target.value })}
                >
                  {OPERATIONAL_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Responsible organisation</label>
                <select
                  className="form-select-dropdown"
                  value={formData.responsibleOrg}
                  onChange={(e) => setFormData({ ...formData, responsibleOrg: e.target.value })}
                >
                  {ORGANISATIONS.map(org => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-fields-grid-2">
              <div className="form-field-group">
                <label className="form-field-label">Start date</label>
                <input
                  type="date"
                  className="form-input-text"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Review date</label>
                <input
                  type="date"
                  className="form-input-text"
                  value={formData.reviewDate}
                  onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                />
              </div>
            </div>

            {/* Channels & Audience Selector */}
            <div className="form-field-group">
              <label className="form-field-label">Integration Channels</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                {['SMS', 'Email', 'Push', 'Voice Call'].map(ch => {
                  const isChecked = formData.channels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => handleToggleChannel(ch)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: isChecked ? '#0f766e' : '#cbd5e1',
                        background: isChecked ? '#ecfdf5' : '#ffffff',
                        color: isChecked ? '#065f46' : '#64748b',
                        fontSize: '12px',
                        fontWeight: isChecked ? 700 : 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      {isChecked && <Check size={12} />}
                      <span>{ch}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Action Bar Bottom */}
          <div className="form-action-bar-bottom">
            <button 
              type="button" 
              className="btn-notif-outline"
              onClick={handleSaveDraft}
            >
              Save draft
            </button>
            <button 
              type="submit" 
              className="btn-notif-primary"
            >
              <Send size={13} />
              <span>Review &amp; submit</span>
            </button>
          </div>
        </div>

        {/* Right Guidance & Live Preview Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Before You Continue Card */}
          <div className="compose-guide-card">
            <h3 className="guide-title">Before you continue</h3>

            <div className="guide-points-list">
              <div className="guide-point-row">
                <div className="guide-icon-wrap">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="point-bold-title">Permission-aware</div>
                  <div className="point-desc">Only authorised roles can submit this record.</div>
                </div>
              </div>

              <div className="guide-point-row">
                <div className="guide-icon-wrap">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="point-bold-title">Audit-ready</div>
                  <div className="point-desc">Changes and submission reasons are retained.</div>
                </div>
              </div>

              <div className="guide-point-row">
                <div className="guide-icon-wrap">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div className="point-bold-title">Validation</div>
                  <div className="point-desc">Missing or inconsistent information will be highlighted.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipient Handset Live Preview HUD */}
          <div className="mobile-preview-box">
            <div className="mobile-preview-head">
              <span>Recipient Preview ({previewTab.toUpperCase()})</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setPreviewTab('sms')}
                  style={{
                    border: 'none',
                    background: previewTab === 'sms' ? '#cbd5e1' : 'transparent',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  SMS
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('email')}
                  style={{
                    border: 'none',
                    background: previewTab === 'email' ? '#cbd5e1' : 'transparent',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Email
                </button>
              </div>
            </div>

            <div className="mock-sms-bubble">
              <div style={{ fontSize: '10px', color: '#a7f3d0', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>
                [RELIEFCORE DISPATCH · {formData.category || 'EMERGENCY'}]
              </div>
              <strong style={{ color: '#ffffff' }}>
                {formData.title || 'Untitled Notification Alert'}
              </strong>
              <div style={{ marginTop: '4px', fontSize: '11px', color: '#e2e8f0', lineHeight: 1.4 }}>
                {formData.description || 'Provide operational details in description field to preview outgoing message broadcast.'}
              </div>
              <div style={{ marginTop: '6px', fontSize: '9.5px', color: '#94a3b8' }}>
                Area: {formData.operationalArea} · Auth: {formData.responsibleOrg}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

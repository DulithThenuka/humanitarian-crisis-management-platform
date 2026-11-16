import React, { useState } from 'react';
import { Megaphone, X, Radio, Clock, FileText, CheckCircle2 } from 'lucide-react';

export const CreateAlertModal = ({
  isOpen,
  onClose,
  newAlertForm,
  setNewAlertForm,
  onSubmit,
  cases = [],
  isSubmitting = false
}) => {
  if (!isOpen) return null;

  const [publicationAction, setPublicationAction] = useState('publish'); // 'publish' | 'draft' | 'schedule'

  const handleSubmit = (action) => {
    onSubmit({
      ...newAlertForm,
      publicationAction: action || publicationAction
    });
  };

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div
        className="ec-verify-modal-card"
        style={{ maxWidth: '640px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={18} color="#dc2626" />
            </div>
            <div>
              <h3 className="ec-modal-title" style={{ margin: 0, fontSize: '17px' }}>Create Emergency Alert</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Broadcast live warnings to Citizen Portal, SMS Gateway, and regional operational teams.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={18} color="#64748b" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(publicationAction);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          {/* Title */}
          <div className="ec-form-field-group">
            <label className="ec-field-label-tiny">ALERT TITLE *</label>
            <input
              type="text"
              required
              className="ec-modal-textarea"
              style={{ minHeight: '38px', height: '38px', padding: '8px 12px' }}
              placeholder="e.g. Flash Flood Evacuation Notice - Kelani East"
              value={newAlertForm.title}
              onChange={(e) => setNewAlertForm({ ...newAlertForm, title: e.target.value })}
            />
          </div>

          {/* Category & Severity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="ec-form-field-group">
              <label className="ec-field-label-tiny">ALERT CATEGORY *</label>
              <select
                className="ec-modal-textarea"
                style={{ height: '38px', padding: '6px 10px' }}
                value={newAlertForm.category || 'Flood warning'}
                onChange={(e) => setNewAlertForm({ ...newAlertForm, category: e.target.value })}
              >
                <option value="Flood warning">Flood warning</option>
                <option value="Evacuation Order">Evacuation Order</option>
                <option value="Storm warning">Storm warning</option>
                <option value="Landslide warning">Landslide warning</option>
                <option value="Drinking Water Advisory">Drinking Water Advisory</option>
                <option value="Severe Weather Alert">Severe Weather Alert</option>
              </select>
            </div>

            <div className="ec-form-field-group">
              <label className="ec-field-label-tiny">SEVERITY LEVEL *</label>
              <select
                className="ec-modal-textarea"
                style={{ height: '38px', padding: '6px 10px' }}
                value={newAlertForm.severity || 'Critical'}
                onChange={(e) => setNewAlertForm({ ...newAlertForm, severity: e.target.value })}
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Area & Related Incident */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="ec-form-field-group">
              <label className="ec-field-label-tiny">AFFECTED GENERAL AREA *</label>
              <input
                type="text"
                required
                className="ec-modal-textarea"
                style={{ minHeight: '38px', height: '38px', padding: '8px 12px' }}
                placeholder="e.g. Kelani East - Zone 03"
                value={newAlertForm.area}
                onChange={(e) => setNewAlertForm({ ...newAlertForm, area: e.target.value })}
              />
            </div>

            <div className="ec-form-field-group">
              <label className="ec-field-label-tiny">RELATED INCIDENT (OPTIONAL)</label>
              <select
                className="ec-modal-textarea"
                style={{ height: '38px', padding: '6px 10px' }}
                value={newAlertForm.relatedIncident || ''}
                onChange={(e) => setNewAlertForm({ ...newAlertForm, relatedIncident: e.target.value })}
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

          {/* Broadcast Message */}
          <div className="ec-form-field-group">
            <label className="ec-field-label-tiny">BROADCAST MESSAGE / DESCRIPTION *</label>
            <textarea
              required
              rows={3}
              className="ec-modal-textarea"
              placeholder="Enter exact public safety message to broadcast to affected citizens..."
              value={newAlertForm.message}
              onChange={(e) => setNewAlertForm({ ...newAlertForm, message: e.target.value })}
            />
          </div>

          {/* Safety Instructions */}
          <div className="ec-form-field-group">
            <label className="ec-field-label-tiny">SAFETY INSTRUCTIONS (ONE PER LINE)</label>
            <textarea
              rows={2}
              className="ec-modal-textarea"
              placeholder="Move to nearest designated shelter on high ground.&#10;Keep emergency phone batteries charged."
              value={newAlertForm.safetyInstructions}
              onChange={(e) => setNewAlertForm({ ...newAlertForm, safetyInstructions: e.target.value })}
            />
          </div>

          {/* Publication Action Selector */}
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label className="ec-field-label-tiny" style={{ marginBottom: '8px', display: 'block' }}>PUBLICATION ACTION</label>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: publicationAction === 'publish' ? 600 : 400 }}>
                <input
                  type="radio"
                  name="modalPublicationAction"
                  checked={publicationAction === 'publish'}
                  onChange={() => setPublicationAction('publish')}
                />
                <Radio size={14} color="#dc2626" />
                <span>Publish Immediately (Active)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: publicationAction === 'draft' ? 600 : 400 }}>
                <input
                  type="radio"
                  name="modalPublicationAction"
                  checked={publicationAction === 'draft'}
                  onChange={() => setPublicationAction('draft')}
                />
                <FileText size={14} color="#64748b" />
                <span>Save as Draft</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: publicationAction === 'schedule' ? 600 : 400 }}>
                <input
                  type="radio"
                  name="modalPublicationAction"
                  checked={publicationAction === 'schedule'}
                  onChange={() => setPublicationAction('schedule')}
                />
                <Clock size={14} color="#0284c7" />
                <span>Schedule for Later</span>
              </label>
            </div>

            {publicationAction === 'schedule' && (
              <div style={{ marginTop: '10px' }}>
                <label className="ec-field-label-tiny">SCHEDULED BROADCAST DATE &amp; TIME *</label>
                <input
                  type="datetime-local"
                  required
                  className="ec-modal-textarea"
                  style={{ height: '36px', padding: '4px 10px' }}
                  value={newAlertForm.scheduledDate || ''}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, scheduledDate: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Modal Actions Footer */}
          <div className="ec-modal-actions-footer" style={{ marginTop: '4px' }}>
            <button type="button" className="ec-btn-hero-outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>

            {publicationAction === 'draft' ? (
              <button
                type="button"
                className="ec-btn-hero-primary"
                style={{ width: 'auto', padding: '8px 18px', background: '#475569' }}
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting || !newAlertForm.title.trim()}
              >
                {isSubmitting ? 'Saving Draft...' : 'Save as Draft'}
              </button>
            ) : publicationAction === 'schedule' ? (
              <button
                type="submit"
                className="ec-btn-hero-primary"
                style={{ width: 'auto', padding: '8px 18px', background: '#0284c7' }}
                disabled={isSubmitting || !newAlertForm.title.trim()}
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Broadcast Alert'}
              </button>
            ) : (
              <button
                type="submit"
                className="ec-btn-reject-red"
                style={{ width: 'auto', padding: '8px 18px' }}
                disabled={isSubmitting || !newAlertForm.title.trim()}
              >
                {isSubmitting ? 'Publishing...' : 'Broadcast Immediately'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

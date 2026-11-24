import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';

export const CreateRecordModal = ({
  isOpen,
  onClose,
  onSave,
  partner = null,
  zones = [],
  initialData = null,
  prefill = null,
  submitting = false
}) => {
  const isEdit = Boolean(initialData?.id);
  const defaultZone = zones[0]?.zoneCode || 'Kelani East - Sector 03';

  const [formData, setFormData] = useState({
    item: '',
    qty: '100',
    destinationZone: defaultZone,
    estimatedValueLkr: '0',
    status: 'Pledged'
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setFormError('');
    if (initialData) {
      setFormData({
        item: initialData.item || '',
        qty: String(initialData.qty ?? ''),
        destinationZone: initialData.destinationZone || defaultZone,
        estimatedValueLkr: String(initialData.estimatedValueLkr ?? 0),
        status: initialData.status || 'Pledged'
      });
    } else {
      setFormData({
        item: prefill?.item || '',
        qty: prefill?.qty ? String(prefill.qty) : '100',
        destinationZone: prefill?.destinationZone || defaultZone,
        estimatedValueLkr: '0',
        status: 'Pledged'
      });
    }
  }, [isOpen, initialData, prefill, defaultZone]);

  if (!isOpen) return null;

  const zoneOptions = Array.from(
    new Set([
      ...zones.map((z) => z.zoneCode).filter(Boolean),
      formData.destinationZone
    ].filter(Boolean))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const trimmedItem = formData.item.trim();
    const numericQty = Number(formData.qty);
    const numericValue = Number(formData.estimatedValueLkr || 0);

    if (trimmedItem.length < 2) {
      setFormError('Resource item description must be at least 2 characters.');
      return;
    }
    if (!Number.isInteger(numericQty) || numericQty <= 0) {
      setFormError('Quantity must be a positive whole number.');
      return;
    }
    if (!formData.destinationZone.trim()) {
      setFormError('Target district or sector zone is required.');
      return;
    }
    if (Number.isNaN(numericValue) || numericValue < 0) {
      setFormError('Estimated value must be zero or positive.');
      return;
    }

    await onSave({
      id: initialData?.id,
      partnerOrganisationId: initialData?.partnerOrganisationId || partner?.id,
      item: trimmedItem,
      qty: numericQty,
      destinationZone: formData.destinationZone.trim(),
      estimatedValueLkr: numericValue,
      status: formData.status
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #dfe5d8'
        }}
      >
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid #dfe5d8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f4f6f2'
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#14291e', margin: 0 }}>
              {isEdit ? 'Edit Resource Contribution' : 'Log Resource Contribution'}
            </h3>
            {partner && (
              <div style={{ fontSize: '12px', color: '#657367', marginTop: '2px' }}>
                {partner.name} ({partner.acronym})
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{ background: 'none', border: 'none', color: '#657367', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {formError && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  fontSize: '12.5px',
                  fontWeight: 600
                }}
              >
                {formError}
              </div>
            )}

            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>
                Resource / Service Item *
              </label>
              <input
                type="text"
                placeholder="e.g. Clean Drinking Water Packs, Emergency Medical Kits"
                className="po-table-search-field"
                style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>
                  Quantity (Units) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="po-table-search-field"
                  style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>
                  Estimated Value (LKR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  className="po-table-search-field"
                  style={{ paddingLeft: '12px', width: '100%', boxSizing: 'border-box' }}
                  value={formData.estimatedValueLkr}
                  onChange={(e) => setFormData({ ...formData, estimatedValueLkr: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>
                  Target District / Zone *
                </label>
                <select
                  className="po-select"
                  style={{ width: '100%' }}
                  value={formData.destinationZone}
                  onChange={(e) => setFormData({ ...formData, destinationZone: e.target.value })}
                >
                  {zoneOptions.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="po-attr-tag" style={{ display: 'block', marginBottom: '4px' }}>
                  Initial Status
                </label>
                <select
                  className="po-select"
                  style={{ width: '100%' }}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={isEdit}
                >
                  <option value="Pledged">Pledged</option>
                  <option value="Confirmed">Confirmed</option>
                  {isEdit && !['Pledged', 'Confirmed'].includes(formData.status) && (
                    <option value={formData.status}>{formData.status}</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '14px 22px',
              borderTop: '1px solid #dfe5d8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              backgroundColor: '#f4f6f2'
            }}
          >
            <button
              type="button"
              className="po-btn po-btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="po-btn po-btn-primary" disabled={submitting}>
              {isEdit ? <Save size={14} /> : <Plus size={14} />}
              <span>{submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Submit Contribution'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

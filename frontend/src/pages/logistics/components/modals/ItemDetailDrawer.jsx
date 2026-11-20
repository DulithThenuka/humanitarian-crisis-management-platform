import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  SlidersHorizontal, 
  Layers, 
  Plus, 
  Minus, 
  Calendar, 
  MapPin, 
  Tag, 
  Clock,
  ArrowRight
} from 'lucide-react';

export const ItemDetailDrawer = ({ 
  isOpen, 
  item, 
  initialTab = 'details', 
  onClose, 
  onSaveAdjustment,
  showToast 
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [adjustQty, setAdjustQty] = useState(item?.quantity || 0);
  const [adjustReason, setAdjustReason] = useState('Physical stock count correction (Audit)');
  const [adjustNotes, setAdjustNotes] = useState('');

  // Sync state whenever selected item or initialTab changes
  useEffect(() => {
    if (item) {
      setAdjustQty(item.quantity);
      setActiveTab(initialTab);
      setAdjustNotes('');
      setAdjustReason('Physical stock count correction (Audit)');
    }
  }, [item, initialTab, isOpen]);

  if (!isOpen || !item) return null;

  const threshold = item.threshold || 100;

  // Determine dynamic stock status based on proposed adjustment quantity
  const calculateStatus = (qty) => {
    const num = Number(qty) || 0;
    if (num <= 0) {
      return { status: 'Shortage', badge: 'critical', label: '● Shortage (Critical)' };
    }
    if (num <= threshold) {
      return { status: 'Low stock', badge: 'warning', label: '● Low stock (Warning)' };
    }
    return { status: 'Available', badge: 'available', label: '● Available' };
  };

  const previewStatus = calculateStatus(adjustQty);

  const handleStep = (delta) => {
    setAdjustQty(prev => Math.max(0, (Number(prev) || 0) + delta));
  };

  const handleSubmitAdjustment = (e) => {
    e.preventDefault();
    const finalQty = Math.max(0, Number(adjustQty) || 0);
    const { status, badge } = calculateStatus(finalQty);

    const updatedItem = {
      ...item,
      quantity: finalQty,
      stockStatus: status,
      statusBadge: badge,
      lastUpdated: 'Just now',
      notes: adjustNotes || item.notes
    };

    onSaveAdjustment(updatedItem);
    if (showToast) {
      showToast(`Stock updated for ${item.name}: ${finalQty} ${item.unit} (${status})`);
    }
    onClose();
  };

  return (
    <div className="rm-drawer-overlay" onClick={onClose}>
      <div className="rm-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="rm-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="rm-drawer-icon-wrap">
              <Package size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="rm-drawer-code">{item.id}</span>
                <span className={`rm-status-badge ${item.statusBadge || item.stockStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                  ● {item.stockStatus}
                </span>
              </div>
              <h2 className="rm-drawer-title">{item.name}</h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="rm-btn-ghost"
            style={{ padding: '6px', borderRadius: '6px' }}
            title="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="rm-drawer-tabs">
          <button
            type="button"
            className={`rm-drawer-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <Layers size={14} />
            <span>Batch & Details</span>
          </button>
          <button
            type="button"
            className={`rm-drawer-tab ${activeTab === 'adjust' ? 'active' : ''}`}
            onClick={() => setActiveTab('adjust')}
          >
            <SlidersHorizontal size={14} />
            <span>Adjust Stock</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="rm-drawer-body">
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Primary Stock Card */}
              <div className="rm-drawer-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#657367', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Current Stock Balance
                  </span>
                  <span style={{ fontSize: '11px', color: '#738075' }}>
                    Updated {item.lastUpdated || 'Recently'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: '#162e20', letterSpacing: '-0.02em' }}>
                    {item.quantity.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#657367' }}>
                    {item.unit}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #edf1eb' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#738075' }}>Reorder Threshold</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', marginTop: '2px' }}>
                      {threshold} {item.unit}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#738075' }}>Storage Location</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="#1e3d2c" />
                      <span>{item.storageLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Batch & Quality Specifications */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', margin: '0 0 10px 0' }}>
                  Batch Tracking & Quality Inspection
                </h4>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8dd', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #edf1eb', fontSize: '12px' }}>
                    <span style={{ color: '#657367' }}>Batch Identification</span>
                    <span style={{ fontWeight: 600, color: '#162e20' }}>
                      BAT-2026-{(item.id || 'RES').replace(/[^0-9]/g, '') || '042'}B
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #edf1eb', fontSize: '12px' }}>
                    <span style={{ color: '#657367' }}>Resource Category</span>
                    <span style={{ fontWeight: 600, color: '#162e20' }}>{item.category}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #edf1eb', fontSize: '12px' }}>
                    <span style={{ color: '#657367' }}>Quality Verification</span>
                    <span style={{ fontWeight: 600, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={13} /> Passed · Grade A
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #edf1eb', fontSize: '12px' }}>
                    <span style={{ color: '#657367' }}>Storage Conditions</span>
                    <span style={{ fontWeight: 600, color: '#162e20' }}>Climate-controlled dry depot (18°C–24°C)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', fontSize: '12px' }}>
                    <span style={{ color: '#657367' }}>Shelf Expiry / Re-test</span>
                    <span style={{ fontWeight: 600, color: '#162e20' }}>December 2026</span>
                  </div>
                </div>
              </div>

              {/* Authorized Chain of Custody */}
              <div style={{ 
                padding: '12px 14px', 
                backgroundColor: '#f7faf5', 
                border: '1px solid #dce5d9', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <ShieldCheck size={16} style={{ color: '#1e3d2c', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '11.5px', color: '#4a594d', lineHeight: 1.5 }}>
                  <strong>Authorized Custody:</strong> Managed under Resource Officer <strong>Dilan Perera</strong> at Western Province Response Depot. All modifications trigger automated audit logs.
                </div>
              </div>

              {/* Direct Jump to Adjustment Button */}
              <button
                type="button"
                className="rm-btn rm-btn-secondary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                onClick={() => setActiveTab('adjust')}
              >
                <SlidersHorizontal size={14} />
                <span>Adjust Stock Quantity</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {activeTab === 'adjust' && (
            <form onSubmit={handleSubmitAdjustment} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Status Preview Card */}
              <div className="rm-drawer-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#657367', textTransform: 'uppercase' }}>
                    Stock Level Preview
                  </span>
                  <span className={`rm-status-badge ${previewStatus.badge}`}>
                    {previewStatus.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#738075' }}>Current Balance</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#405044' }}>
                      {item.quantity.toLocaleString()} {item.unit}
                    </div>
                  </div>

                  <div style={{ fontSize: '18px', color: '#9bb19f' }}>➔</div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#738075' }}>Updated Balance</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#162e20' }}>
                      {adjustQty.toLocaleString()} {item.unit}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stepper & Number Input */}
              <div>
                <label className="rm-form-label">
                  Set New Quantity ({item.unit}) *
                </label>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <button
                    type="button"
                    className="rm-stepper-btn"
                    onClick={() => handleStep(-10)}
                    title="Subtract 10"
                  >
                    -10
                  </button>
                  <button
                    type="button"
                    className="rm-stepper-btn"
                    onClick={() => handleStep(-1)}
                    title="Subtract 1"
                  >
                    <Minus size={14} />
                  </button>

                  <input
                    type="number"
                    min="0"
                    required
                    className="rm-form-input"
                    style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, padding: '8px' }}
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  />

                  <button
                    type="button"
                    className="rm-stepper-btn"
                    onClick={() => handleStep(1)}
                    title="Add 1"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    type="button"
                    className="rm-stepper-btn"
                    onClick={() => handleStep(10)}
                    title="Add 10"
                  >
                    +10
                  </button>
                </div>

                {/* Quick Increment Presets */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button type="button" className="rm-adjust-quick-btn" onClick={() => handleStep(50)}>+50</button>
                  <button type="button" className="rm-adjust-quick-btn" onClick={() => handleStep(100)}>+100</button>
                  <button type="button" className="rm-adjust-quick-btn" onClick={() => handleStep(250)}>+250</button>
                  <button type="button" className="rm-adjust-quick-btn" onClick={() => handleStep(-50)}>-50</button>
                  <button type="button" className="rm-adjust-quick-btn" onClick={() => handleStep(-100)}>-100</button>
                </div>
              </div>

              {/* Reason for Adjustment */}
              <div>
                <label className="rm-form-label">Operational Reason *</label>
                <select
                  className="rm-form-input"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                >
                  <option value="Physical stock count correction (Audit)">Physical stock count correction (Audit)</option>
                  <option value="Delivery intake replenishment">Delivery intake replenishment</option>
                  <option value="Emergency crisis dispatch">Emergency crisis dispatch</option>
                  <option value="Damaged / Expired stock write-off">Damaged / Expired stock write-off</option>
                  <option value="Inter-depot transfer">Inter-depot transfer</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="rm-form-label">Adjustment Notes (Optional)</label>
                <textarea
                  rows={3}
                  className="rm-note-textarea"
                  placeholder="Record reference code, intake receipt or dispatch verification..."
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                />
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="rm-btn rm-btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rm-btn rm-btn-primary"
                  style={{ flex: 2, justifyContent: 'center' }}
                >
                  Confirm & Update Stock
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailDrawer;

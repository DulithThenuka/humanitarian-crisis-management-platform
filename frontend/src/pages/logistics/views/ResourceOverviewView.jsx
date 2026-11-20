import React, { useState } from 'react';
import { 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Send, 
  Droplet, 
  Plus, 
  ArrowRight,
  ChevronRight 
} from 'lucide-react';

export const ResourceOverviewView = ({
  metrics,
  onNavigateTab,
  onSelectTab,
  onOpenAddModal,
  onAddInventory,
  showToast
}) => {
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const handleNav = onNavigateTab || onSelectTab || (() => {});
  const handleAdd = onOpenAddModal || onAddInventory || (() => {});

  const chartBars = [
    { label: '06', time: '06:00 AM', category: 'Water & Hydration', available: 240, allocated: 140, height: 28 },
    { label: '08', time: '08:00 AM', category: 'Emergency Food Kits', available: 320, allocated: 180, height: 45 },
    { label: '10', time: '10:00 AM', category: 'Medical Supplies', available: 110, allocated: 40, height: 32 },
    { label: '12', time: '12:00 PM', category: 'Thermal Blankets', available: 86, allocated: 60, height: 58 },
    { label: '14', time: '02:00 PM', category: 'Family Hygiene Packs', available: 160, allocated: 90, height: 48 },
    { label: '16', time: '04:00 PM', category: 'Water Purification', available: 420, allocated: 250, height: 72 },
    { label: '18', time: '06:00 PM', category: 'Infant Nutrition Kits', available: 95, allocated: 55, height: 62 },
    { label: '20', time: '08:00 PM', category: 'Emergency Tarpaulins', available: 210, allocated: 160, height: 82 },
    { label: '22', time: '10:00 PM', category: 'First Aid Packs', available: 175, allocated: 120, height: 70 },
    { label: '00', time: '12:00 AM (Peak)', category: 'High-Energy Rations', available: 540, allocated: 380, height: 95, active: true },
    { label: '02', time: '02:00 AM', category: 'Clean Water Reservoirs', available: 380, allocated: 220, height: 76 },
    { label: '04', time: '04:00 AM', category: 'Shelter Equipment', available: 290, allocated: 190, height: 86 }
  ];

  return (
    <div className="rm-view-container">
      {/* Title & Action Block (Screenshot 1) */}
      <div className="rm-title-block">
        <div>
          <div className="rm-eyebrow">
            <span>WEDNESDAY, 18 FEBRUARY 2026 · 10:20</span>
          </div>
          <h1 className="rm-title">Welcome back, Resource Manager</h1>
          <p className="rm-subtitle">
            Western Province Flood Response · Inventory snapshot updated 2 minutes ago
          </p>
        </div>

        <div className="rm-title-actions">
          <button 
            className="rm-btn rm-btn-secondary"
            onClick={handleAdd}
          >
            <Plus size={14} />
            <span>Add inventory</span>
          </button>
          <button 
            className="rm-btn rm-btn-primary"
            onClick={() => {
              handleNav('allocations');
              if (showToast) showToast('Switched to Allocation Requests');
            }}
          >
            <span>Review allocations</span>
          </button>
        </div>
      </div>

      {/* 6 Metrics KPI Row */}
      <div className="rm-metrics-grid">
        {/* Metric 1 */}
        <div className="rm-metric-card" onClick={() => handleNav('inventory')} style={{ cursor: 'pointer' }}>
          <div className="rm-metric-top">
            <span className="rm-metric-label">Total resources</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
              <Package size={15} />
            </div>
          </div>
          <div className="rm-metric-val">{metrics?.totalResources?.value || '2,048'}</div>
          <span className="rm-metric-subtext">{metrics?.totalResources?.sub || 'Across 6 categories'}</span>
        </div>

        {/* Metric 2 */}
        <div className="rm-metric-card" onClick={() => handleNav('inventory')} style={{ cursor: 'pointer' }}>
          <div className="rm-metric-top">
            <span className="rm-metric-label">Available stock</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              <CheckCircle size={15} />
            </div>
          </div>
          <div className="rm-metric-val">{metrics?.availableStock?.value || '1,284'}</div>
          <span className="rm-metric-subtext">{metrics?.availableStock?.sub || '62.7% of total'}</span>
        </div>

        {/* Metric 3 */}
        <div className="rm-metric-card" onClick={() => handleNav('stock-alerts')} style={{ cursor: 'pointer' }}>
          <div className="rm-metric-top">
            <span className="rm-metric-label">Low-stock warnings</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              <AlertTriangle size={15} />
            </div>
          </div>
          <div className="rm-metric-val">{metrics?.lowStockWarnings?.value || '5'}</div>
          <span className="rm-metric-subtext">{metrics?.lowStockWarnings?.sub || '2 critical shortages'}</span>
        </div>

        {/* Metric 4 */}
        <div className="rm-metric-card" onClick={() => handleNav('allocations')} style={{ cursor: 'pointer' }}>
          <div className="rm-metric-top">
            <span className="rm-metric-label">Pending allocations</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>
              <Clock size={15} />
            </div>
          </div>
          <div className="rm-metric-val">{metrics?.pendingAllocations?.value || '12'}</div>
          <span className="rm-metric-subtext">{metrics?.pendingAllocations?.sub || '4 high priority'}</span>
        </div>

        {/* Metric 5 */}
        <div className="rm-metric-card" onClick={() => handleNav('allocations')} style={{ cursor: 'pointer' }}>
          <div className="rm-metric-top">
            <span className="rm-metric-label">Approved allocations</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#eef1ea', color: '#4a5b4a' }}>
              <FileText size={15} />
            </div>
          </div>
          <div className="rm-metric-val">{metrics?.approvedAllocations?.value || '18'}</div>
          <span className="rm-metric-subtext">{metrics?.approvedAllocations?.sub || '342 units'}</span>
        </div>

        {/* Metric 6 */}
        <div className="rm-metric-card" onClick={() => handleNav('tracking')} style={{ cursor: 'pointer' }}>
          <div className="rm-metric-top">
            <span className="rm-metric-label">Dispatched / delivered</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              <Send size={15} />
            </div>
          </div>
          <div className="rm-metric-val">{metrics?.dispatchedDelivered?.value || '228 / 146'}</div>
          <span className="rm-metric-subtext">{metrics?.dispatchedDelivered?.sub || 'Separate stages'}</span>
        </div>
      </div>

      {/* Middle/Bottom Grid: Inventory Distribution & Stock Health */}
      <div className="rm-split-layout">
        {/* Left: Inventory Distribution Chart */}
        <div className="rm-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                Inventory distribution
              </h3>
              <div style={{ fontSize: '12px', color: '#657367', marginTop: '3px' }}>
                Available stock by resource category
              </div>
            </div>

            <button
              onClick={() => {
                handleNav('reports');
                if (showToast) showToast('Navigated to Reports & Analytics');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#1e3d2c',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                borderRadius: '5px',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eef3eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span>View analytics</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Bar Chart with interactive hover tooltips */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '210px',
            padding: '0 8px',
            borderBottom: '1px solid #edf1eb',
            gap: '12px'
          }}>
            {/* Interactive Tooltip Bubble */}
            {hoveredBarIndex !== null && chartBars[hoveredBarIndex] && (
              <div 
                style={{
                  position: 'absolute',
                  left: `${((hoveredBarIndex + 0.5) / chartBars.length) * 100}%`,
                  bottom: `${Math.min(chartBars[hoveredBarIndex].height + 14, 82)}%`,
                  transform: 'translateX(-50%)',
                  backgroundColor: '#14291e',
                  color: '#ffffff',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  fontSize: '11px',
                  pointerEvents: 'none',
                  zIndex: 20,
                  whiteSpace: 'nowrap',
                  animation: 'fadeIn 0.15s ease-out'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#dbe4c6' }}>{chartBars[hoveredBarIndex].category}</span>
                  <span style={{ fontSize: '10px', color: '#9bb19f' }}>{chartBars[hoveredBarIndex].time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginTop: '3px' }}>
                  <span style={{ color: '#bcc5b9' }}>Available:</span>
                  <span style={{ fontWeight: 700, color: '#86efac' }}>{chartBars[hoveredBarIndex].available.toLocaleString()} units</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginTop: '2px' }}>
                  <span style={{ color: '#bcc5b9' }}>Allocated:</span>
                  <span style={{ fontWeight: 700, color: '#fde047' }}>{chartBars[hoveredBarIndex].allocated.toLocaleString()} units</span>
                </div>
                {/* Pointer triangle */}
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '5px solid #14291e'
                }} />
              </div>
            )}

            {chartBars.map((bar, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  padding: '0 2px'
                }}
              >
                <div 
                  style={{
                    width: '100%',
                    maxWidth: '32px',
                    height: `${bar.height}%`,
                    backgroundColor: idx === hoveredBarIndex 
                      ? '#166534' 
                      : (bar.active ? '#1e3d2c' : '#94a395'),
                    borderRadius: '3px 3px 0 0',
                    transform: idx === hoveredBarIndex ? 'scaleY(1.03)' : 'scaleY(1)',
                    transformOrigin: 'bottom',
                    transition: 'height 0.3s ease, background-color 0.15s ease, transform 0.15s ease'
                  }}
                  title={`${bar.category} (${bar.time}): ${bar.available} available, ${bar.allocated} allocated`}
                />
              </div>
            ))}
          </div>

          {/* Bottom X-axis labels */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 8px 0 8px',
            gap: '12px'
          }}>
            {chartBars.map((bar, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: '11px',
                  cursor: 'pointer',
                  color: (idx === hoveredBarIndex || bar.active) ? '#162e20' : '#738075',
                  fontWeight: (idx === hoveredBarIndex || bar.active) ? 700 : 500,
                  transition: 'color 0.15s ease'
                }}
              >
                {bar.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Stock Health */}
        <div className="rm-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                Stock health
              </h3>
              <div style={{ fontSize: '12px', color: '#657367', marginTop: '3px' }}>
                Items requiring attention
              </div>
            </div>

            <button
              onClick={() => {
                handleNav('stock-alerts');
                if (showToast) showToast('Navigated to Stock Alerts');
              }}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '12px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              title="Click to view all stock alerts"
            >
              ● 5 alerts
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Item 1 */}
            <div 
              className="rm-overview-alert-card"
              onClick={() => {
                handleNav('stock-alerts');
                if (showToast) showToast('Viewing Drinking Water stock alert');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #edf1eb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Droplet size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                    Drinking Water
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#657367' }}>
                    240 available / 380 requested
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="rm-status-badge critical">● Critical</span>
                <ChevronRight size={14} className="rm-alert-arrow" color="#657367" />
              </div>
            </div>

            {/* Item 2 */}
            <div 
              className="rm-overview-alert-card"
              onClick={() => {
                handleNav('stock-alerts');
                if (showToast) showToast('Viewing Thermal Blankets stock alert');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #edf1eb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#fffbeb',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                    Thermal Blankets
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#657367' }}>
                    86 items · reorder at 100
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="rm-status-badge warning">● Low stock</span>
                <ChevronRight size={14} className="rm-alert-arrow" color="#657367" />
              </div>
            </div>

            {/* Item 3 */}
            <div 
              className="rm-overview-alert-card"
              onClick={() => {
                handleNav('stock-alerts');
                if (showToast) showToast('Viewing Medical Supply Packs expiry alert');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #edf1eb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#fffbeb',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                    Medical Supply Packs
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#657367' }}>
                    14 expire within 30 days
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="rm-status-badge warning">● Expiry</span>
                <ChevronRight size={14} className="rm-alert-arrow" color="#657367" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceOverviewView;

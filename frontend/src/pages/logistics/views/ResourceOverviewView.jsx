import React from 'react';
import { 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Send, 
  Droplet, 
  Plus, 
  ArrowRight 
} from 'lucide-react';

export const ResourceOverviewView = ({
  metrics,
  onNavigateTab,
  onOpenAddModal
}) => {
  const chartBars = [
    { label: '06', height: 20 },
    { label: '08', height: 35 },
    { label: '10', height: 28 },
    { label: '12', height: 50 },
    { label: '14', height: 44 },
    { label: '16', height: 68 },
    { label: '18', height: 58 },
    { label: '20', height: 80 },
    { label: '22', height: 70 },
    { label: '00', height: 95, active: true },
    { label: '02', height: 75 },
    { label: '04', height: 85 }
  ];

  return (
    <div className="rm-workspace">
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
            onClick={onOpenAddModal}
          >
            <Plus size={14} />
            <span>Add inventory</span>
          </button>
          <button 
            className="rm-btn rm-btn-primary"
            onClick={() => onNavigateTab('allocations')}
          >
            <span>Review allocations</span>
          </button>
        </div>
      </div>

      {/* 6 Metrics KPI Row */}
      <div className="rm-metrics-grid">
        {/* Metric 1 */}
        <div className="rm-metric-card" onClick={() => onNavigateTab('inventory')} style={{ cursor: 'pointer' }}>
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
        <div className="rm-metric-card" onClick={() => onNavigateTab('inventory')} style={{ cursor: 'pointer' }}>
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
        <div className="rm-metric-card" onClick={() => onNavigateTab('stock-alerts')} style={{ cursor: 'pointer' }}>
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
        <div className="rm-metric-card" onClick={() => onNavigateTab('allocations')} style={{ cursor: 'pointer' }}>
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
        <div className="rm-metric-card" onClick={() => onNavigateTab('allocations')} style={{ cursor: 'pointer' }}>
          <div className="rm-metric-top">
            <span className="rm-metric-label">Approved allocations</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
              <FileText size={15} />
            </div>
          </div>
          <div className="rm-metric-val">{metrics?.approvedAllocations?.value || '18'}</div>
          <span className="rm-metric-subtext">{metrics?.approvedAllocations?.sub || '342 units'}</span>
        </div>

        {/* Metric 6 */}
        <div className="rm-metric-card" onClick={() => onNavigateTab('tracking')} style={{ cursor: 'pointer' }}>
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
              onClick={() => onNavigateTab('reports')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1e3d2c',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View analytics
            </button>
          </div>

          {/* Bar Chart */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '210px',
            padding: '0 8px',
            borderBottom: '1px solid #edf1eb',
            gap: '12px'
          }}>
            {chartBars.map((bar, idx) => (
              <div 
                key={idx}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}
              >
                <div 
                  style={{
                    width: '100%',
                    maxWidth: '32px',
                    height: `${bar.height}%`,
                    backgroundColor: bar.active ? '#1e3d2c' : '#94a395',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.4s ease'
                  }}
                  title={`Hour ${bar.label}: ${bar.height}%`}
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
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: '11px',
                  color: bar.active ? '#162e20' : '#738075',
                  fontWeight: bar.active ? 700 : 500
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

            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '12px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca'
            }}>
              ● 5 alerts
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Item 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #edf1eb',
              borderRadius: '8px'
            }}>
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

              <span className="rm-status-badge critical">● Critical</span>
            </div>

            {/* Item 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #edf1eb',
              borderRadius: '8px'
            }}>
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

              <span className="rm-status-badge warning">● Low stock</span>
            </div>

            {/* Item 3 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #edf1eb',
              borderRadius: '8px'
            }}>
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

              <span className="rm-status-badge warning">● Expiry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceOverviewView;

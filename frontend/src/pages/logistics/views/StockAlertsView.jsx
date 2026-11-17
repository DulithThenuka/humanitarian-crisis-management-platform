import React from 'react';
import { 
  Droplet, 
  AlertTriangle, 
  Download 
} from 'lucide-react';

export const StockAlertsView = ({
  alerts = [],
  onExportReport,
  onViewItem,
  onCreateReorder
}) => {
  return (
    <div className="rm-workspace">
      {/* Title & Action Block (Screenshot 6) */}
      <div className="rm-title-block">
        <div>
          <div className="rm-eyebrow">
            <span>INVENTORY EXCEPTIONS AND REPLENISHMENT GUIDANCE</span>
          </div>
          <h1 className="rm-title">Stock Alerts</h1>
          <p className="rm-subtitle">
            Review shortages, low stock, expiry risks and reorder recommendations.
          </p>
        </div>

        <button 
          className="rm-btn rm-btn-secondary"
          onClick={onExportReport}
        >
          <Download size={14} />
          <span>Export reorder list</span>
        </button>
      </div>

      {/* 4 Mini Metric Cards */}
      <div className="rm-metrics-grid-4">
        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Critical shortages</span>
            <span className="rm-status-badge critical">● critical</span>
          </div>
          <div className="rm-metric-val">2</div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Low stock</span>
            <span className="rm-status-badge warning">● warning</span>
          </div>
          <div className="rm-metric-val">3</div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Expiring soon</span>
            <span className="rm-status-badge warning">● warning</span>
          </div>
          <div className="rm-metric-val">14</div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Quarantined</span>
            <span className="rm-status-badge neutral">● neutral</span>
          </div>
          <div className="rm-metric-val">12</div>
        </div>
      </div>

      {/* Alert Cards Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="rm-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              flexDirection: 'row'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: alt.iconType === 'droplet' ? '#fef2f2' : '#fffbeb',
                color: alt.iconType === 'droplet' ? '#dc2626' : '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {alt.iconType === 'droplet' ? <Droplet size={17} /> : <AlertTriangle size={17} />}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span className={`rm-status-badge ${alt.tagType || 'warning'}`} style={{ padding: '1px 7px', fontSize: '10.5px' }}>
                    ● {alt.tag} · {alt.code}
                  </span>
                </div>
                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#162e20', margin: '2px 0' }}>
                  {alt.item}
                </h3>
                <div style={{ fontSize: '12px', color: '#657367' }}>
                  {alt.available !== undefined && `${alt.available} available`}
                  {alt.requested !== undefined && ` · ${alt.requested} requested`}
                  {alt.threshold !== undefined && ` · threshold ${alt.threshold}`}
                  {alt.daysLeft !== undefined && `${alt.expiringQty} packs expire in ${alt.daysLeft} days`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#738075' }}>Recommended action:</span>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#162e20' }}>
                  {alt.recommendedAction}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="rm-btn rm-btn-secondary"
                  style={{ padding: '7px 12px', fontSize: '12px' }}
                  onClick={() => onViewItem && onViewItem(alt)}
                >
                  View item
                </button>
                <button
                  className="rm-btn rm-btn-primary"
                  style={{ padding: '7px 14px', fontSize: '12px' }}
                  onClick={() => onCreateReorder && onCreateReorder(alt)}
                >
                  Create reorder
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockAlertsView;

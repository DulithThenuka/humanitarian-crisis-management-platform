import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Download, ShieldCheck, Activity } from 'lucide-react';

export const ResourceReportsView = ({ onOpenExport }) => {
  return (
    <div className="rm-view-container">
      <div className="rm-header-row">
        <div>
          <span className="rm-header-kicker">SUPPLY CHAIN PERFORMANCE & AUDIT REPORTING</span>
          <h1 className="rm-header-title">Resource Reports & Analytics</h1>
          <p className="rm-header-subtitle">
            Audited inventory turnover metrics, storage utilization and last-mile fulfillment rates.
          </p>
        </div>
        <div className="rm-header-actions">
          <button type="button" className="rm-btn-primary" onClick={() => onOpenExport('Inventory')}>
            <Download size={16} />
            Export Comprehensive Report
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div className="rm-metric-card">
          <div className="rm-metric-card-top">
            <span className="rm-metric-label">Fulfillment Rate</span>
            <div className="rm-metric-icon-tile">
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div>
            <div className="rm-metric-value">94.8%</div>
            <div className="rm-metric-subtext">+2.1% from yesterday</div>
          </div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-card-top">
            <span className="rm-metric-label">Average Dispatch Time</span>
            <div className="rm-metric-icon-tile">
              <Activity size={17} />
            </div>
          </div>
          <div>
            <div className="rm-metric-value">42 min</div>
            <div className="rm-metric-subtext">From approval to convoy departure</div>
          </div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-card-top">
            <span className="rm-metric-label">Depot Capacity In-Use</span>
            <div className="rm-metric-icon-tile">
              <BarChart3 size={17} />
            </div>
          </div>
          <div>
            <div className="rm-metric-value">71.4%</div>
            <div className="rm-metric-subtext">Across 4 regional warehouses</div>
          </div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-card-top">
            <span className="rm-metric-label">Audit Discrepancy Rate</span>
            <div className="rm-metric-icon-tile" style={{ backgroundColor: '#dcfce7', borderColor: '#bbf7d0', color: '#16a34a' }}>
              <ShieldCheck size={17} />
            </div>
          </div>
          <div>
            <div className="rm-metric-value" style={{ color: '#15803d' }}>0.0%</div>
            <div className="rm-metric-subtext">Zero unverified write-offs</div>
          </div>
        </div>
      </div>

      {/* Warehouse Utilization Breakdown */}
      <div className="rm-section-box" style={{ marginTop: 20 }}>
        <h2 className="rm-section-box-title">Storage Depot Utilization</h2>
        <p className="rm-section-box-subtitle">Live pallet allocation and cubic capacity</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { name: 'Central Depot - Kelaniya', current: 780, max: 1000, percent: 78, color: '#0284c7' },
            { name: 'Wattala Regional Store', current: 310, max: 450, percent: 69, color: '#0284c7' },
            { name: 'Biyagama Forward Hub', current: 185, max: 200, percent: 92, color: '#ea580c' },
            { name: 'Medical Cold Storage Unit', current: 85, max: 150, percent: 56, color: '#16a34a' }
          ].map((wh) => (
            <div key={wh.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                <span>{wh.name}</span>
                <span style={{ color: wh.percent > 90 ? '#ea580c' : 'var(--rm-text-secondary)' }}>
                  {wh.current} / {wh.max} m³ ({wh.percent}%)
                </span>
              </div>
              <div style={{ height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${wh.percent}%`,
                    backgroundColor: wh.color,
                    borderRadius: 4
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


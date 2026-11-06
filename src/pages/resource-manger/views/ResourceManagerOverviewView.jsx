import React from 'react';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Send,
  Droplet,
  Layers,
  Thermometer,
  ShieldAlert,
  ChevronRight,
  Plus
} from 'lucide-react';
import {
  INITIAL_RESOURCE_METRICS,
  INVENTORY_DISTRIBUTION,
  STOCK_HEALTH_ALERTS,
  ALLOCATION_REQUESTS_DATA,
  RECENT_RESOURCE_ACTIVITY
} from '../data/resourceData';

export const ResourceManagerOverviewView = ({
  onNavigate,
  onOpenAddInventory,
  onRequestReview
}) => {
  return (
    <div className="rm-view-container">
      {/* Header section matching Figma */}
      <div className="rm-header-row">
        <div>
          <span className="rm-header-kicker">
            WEDNESDAY, 19 FEBRUARY 2026 • 19:20
          </span>
          <h1 className="rm-header-title">Welcome back, Resource Manager</h1>
          <p className="rm-header-subtitle">
            Western Province Flood Response · Inventory snapshot updated 2 minutes ago
          </p>
        </div>
        <div className="rm-header-actions">
          <button
            type="button"
            className="rm-btn-outline"
            onClick={onOpenAddInventory}
          >
            <Plus size={16} />
            Add inventory
          </button>
          <button
            type="button"
            className="rm-btn-primary"
            onClick={() => onNavigate('allocations')}
          >
            <CheckCircle size={16} />
            Review allocations
          </button>
        </div>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="rm-metrics-grid">
        <div className="rm-metric-card">
          <div className="rm-metric-card-top">
            <span className="rm-metric-label">Total resources</span>
            <div className="rm-metric-icon-tile">
              <Package size={17} />
            </div>
          </div>
          <div>
            <div className="rm-metric-value">{INITIAL_RESOURCE_METRICS.totalResources.toLocaleString()}</div>
            <div className="rm-metric-subtext">Across {INITIAL_RESOURCE_METRICS.totalCategories} categories</div>
          </div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-card-top">
            <span className="rm-metric-label">Available stock</span>
            <div className="rm-metric-icon-tile">
              <CheckCircle size={17} />
            </div>
          </div>
          <div>
            <div className="rm-metric-value">{INITIAL_RESOURCE_METRICS.availableStock.toLocaleString()}</div>
            <div className="rm-metric-subtext">{INITIAL_RESOURCE_METRICS.availablePercentage} of total</div>
          </div>
        </div>

        <div className="rm-metric-card" style={{ borderColor: '#fecaca' }}>
          <div className="rm-metric-card-top">
            <span className="rm-metric-label" style={{ color: '#b91c1c' }}>Low-stock warnings</span>
            <div className="rm-metric-icon-tile" style={{ backgroundColor: '#fee2e2', borderColor: '#fecaca', color: '#dc2626' }}>
              <AlertTriangle size={17} />
            </div>
          </div>
          <div>
            <div className="rm-metric-value" style={{ color: '#b91c1c' }}>{INITIAL_RESOURCE_METRICS.lowStockWarnings}</div>
            <div className="rm-metric-subtext" style={{ color: '#dc2626' }}>{INITIAL_RESOURCE_METRICS.criticalShortages} critical shortages</div>
          </div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-card-top">
            <span className="rm-metric-label">Pending allocations</span>
            <div className="rm-metric-icon-tile" style={{ backgroundColor: '#fef3c7', borderColor: '#fde68a', color: '#d97706' }}>
              <Clock size={17} />
            </div>
          </div>
          <div>
            <div className="rm-metric-value">{INITIAL_RESOURCE_METRICS.pendingAllocations}</div>
            <div className="rm-metric-subtext">{INITIAL_RESOURCE_METRICS.highPriorityPending} high priority</div>
          </div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-card-top">
            <span className="rm-metric-label">Approved allocations</span>
            <div className="rm-metric-icon-tile">
              <FileText size={17} />
            </div>
          </div>
          <div>
            <div className="rm-metric-value">{INITIAL_RESOURCE_METRICS.approvedAllocations}</div>
            <div className="rm-metric-subtext">{INITIAL_RESOURCE_METRICS.approvedUnits} units</div>
          </div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-card-top">
            <span className="rm-metric-label">Dispatched / delivered</span>
            <div className="rm-metric-icon-tile" style={{ backgroundColor: '#dcfce7', borderColor: '#bbf7d0', color: '#16a34a' }}>
              <Send size={17} />
            </div>
          </div>
          <div>
            <div className="rm-metric-value">{INITIAL_RESOURCE_METRICS.dispatchedCount} / {INITIAL_RESOURCE_METRICS.deliveredCount}</div>
            <div className="rm-metric-subtext">separate stages</div>
          </div>
        </div>
      </div>

      {/* Row 2: Inventory Distribution Bar Chart + Stock Health Alerts */}
      <div className="rm-two-col-grid" style={{ marginTop: 20 }}>
        {/* Inventory Distribution Chart Box */}
        <div className="rm-section-box">
          <div className="rm-section-box-header">
            <h2 className="rm-section-box-title">Inventory distribution</h2>
            <button
              type="button"
              className="rm-section-box-link"
              style={{ background: 'none', border: 'none' }}
              onClick={() => onNavigate('inventory')}
            >
              View analytics
            </button>
          </div>
          <p className="rm-section-box-subtitle">Available stock by resource category</p>

          {/* Bar Chart Visualization */}
          <div style={{ padding: '10px 0 6px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, height: 160, paddingBottom: 10, borderBottom: '1px solid #e2e8f0' }}>
              {INVENTORY_DISTRIBUTION.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(18, Math.round((item.count / 350) * 100)));
                const isKeyFocus = item.count > 250;
                return (
                  <div
                    key={item.category}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      gap: 6
                    }}
                    title={`${item.category}: ${item.count} units (${item.percent}%)`}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--rm-text-muted)' }}>
                      {item.count}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 32,
                        height: `${heightPercent}%`,
                        backgroundColor: isKeyFocus ? '#0284c7' : '#94a3b8',
                        backgroundImage: isKeyFocus ? 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)' : 'none',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Category Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 8 }}>
              {INVENTORY_DISTRIBUTION.map((item) => (
                <div
                  key={item.category}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 9.5,
                    color: 'var(--rm-text-secondary)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.category}
                >
                  {item.category.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Health Alerts Box */}
        <div className="rm-section-box">
          <div className="rm-section-box-header">
            <h2 className="rm-section-box-title">Stock health</h2>
            <span className="rm-badge rm-badge-critical">
              <span className="rm-badge-dot" />
              {STOCK_HEALTH_ALERTS.length} alerts
            </span>
          </div>
          <p className="rm-section-box-subtitle">Items requiring attention</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STOCK_HEALTH_ALERTS.map((alert) => (
              <div
                key={alert.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      backgroundColor: alert.badgeType === 'critical' ? '#fee2e2' : '#fef3c7',
                      color: alert.badgeType === 'critical' ? '#dc2626' : '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {alert.type === 'water' && <Droplet size={17} />}
                    {alert.type === 'blanket' && <Layers size={17} />}
                    {alert.type === 'medical' && <Thermometer size={17} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--rm-text-primary)' }}>
                      {alert.item}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--rm-text-muted)' }}>
                      {alert.detail}
                    </div>
                  </div>
                </div>

                <span className={`rm-badge rm-badge-${alert.badgeType}`}>
                  <span className="rm-badge-dot" />
                  {alert.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Pending Allocation Requests + Recent Resource Activity */}
      <div className="rm-two-col-grid" style={{ marginTop: 20 }}>
        {/* Pending Allocation Requests Box */}
        <div className="rm-section-box">
          <div className="rm-section-box-header">
            <h2 className="rm-section-box-title">Pending allocation requests</h2>
            <button
              type="button"
              className="rm-section-box-link"
              style={{ background: 'none', border: 'none' }}
              onClick={() => onNavigate('allocations')}
            >
              View all
            </button>
          </div>
          <p className="rm-section-box-subtitle">Received from authorised Emergency Coordinators</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ALLOCATION_REQUESTS_DATA.slice(0, 3).map((req) => (
              <div
                key={req.id}
                onClick={() => onNavigate('allocations', req.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                  e.currentTarget.style.borderColor = '#bae6fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--rm-primary-blue)' }}>
                      {req.id}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--rm-text-primary)' }}>
                      {req.itemName}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--rm-text-muted)', marginTop: 2 }}>
                    {req.requestedQuantity} units • {req.relatedIncident} • {req.destination}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`rm-badge rm-badge-${req.priorityType}`}>
                    <span className="rm-badge-dot" />
                    {req.priority}
                  </span>
                  <ChevronRight size={16} color="var(--rm-text-muted)" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Resource Activity Box */}
        <div className="rm-section-box">
          <div className="rm-section-box-header">
            <h2 className="rm-section-box-title">Recent resource activity</h2>
            <button
              type="button"
              className="rm-section-box-link"
              style={{ background: 'none', border: 'none' }}
              onClick={() => onNavigate('activity')}
            >
              Full log
            </button>
          </div>
          <p className="rm-section-box-subtitle">Traceable inventory and fulfillment events</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {RECENT_RESOURCE_ACTIVITY.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--rm-text-muted)',
                    minWidth: 42,
                    paddingTop: 1
                  }}
                >
                  {act.time}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'var(--rm-primary-blue)',
                      marginTop: 6
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--rm-text-primary)' }}>
                      {act.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--rm-text-muted)' }}>
                      {act.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


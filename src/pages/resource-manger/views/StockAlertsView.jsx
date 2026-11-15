import React from 'react';
import { AlertTriangle, AlertCircle, Droplet, Layers, Thermometer, PlusCircle } from 'lucide-react';
import { STOCK_HEALTH_ALERTS } from '../data/resourceData';

export const StockAlertsView = ({ onOpenAddInventory, onNavigate }) => {
  return (
    <div className="rm-view-container">
      <div className="rm-header-row">
        <div>
          <span className="rm-header-kicker">INVENTORY DEFICIT & SHELF-LIFE SURVEILLANCE</span>
          <h1 className="rm-header-title">Stock Alerts & Replenishment</h1>
          <p className="rm-header-subtitle">
            Proactive monitoring of depleted relief goods, reserve margins and expiration windows.
          </p>
        </div>
        <div className="rm-header-actions">
          <button type="button" className="rm-btn-primary" onClick={onOpenAddInventory}>
            <PlusCircle size={16} />
            Stock Replenishment
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
        {STOCK_HEALTH_ALERTS.map((alert) => (
          <div
            key={alert.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--rm-border)',
              borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: alert.badgeType === 'critical' ? '#fee2e2' : '#fef3c7',
                  color: alert.badgeType === 'critical' ? '#dc2626' : '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {alert.type === 'water' && <Droplet size={22} />}
                {alert.type === 'blanket' && <Layers size={22} />}
                {alert.type === 'medical' && <Thermometer size={22} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--rm-text-primary)' }}>
                    {alert.item}
                  </span>
                  <span className={`rm-badge rm-badge-${alert.badgeType}`}>
                    <span className="rm-badge-dot" />
                    {alert.badge}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--rm-text-secondary)', marginTop: 4 }}>
                  {alert.detail}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                className="rm-btn-outline"
                onClick={() => onNavigate('inventory')}
              >
                View Inventory
              </button>
              <button
                type="button"
                className="rm-btn-primary"
                onClick={onOpenAddInventory}
              >
                Restock Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Search, 
  Plus, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { ResourceInventoryPage } from './inventory/ResourceInventoryPage';
import { AllocationDispatchPage } from './dispatch/AllocationDispatchPage';
import { LOGISTICS_STATS, QUICK_METRICS } from './data/logisticsPortalData';
import './LogisticsPortalPage.css';

export const LogisticsPortalPage = ({ initialTab = 'inventory' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="logistics-portal-page">
      {/* Top Portal Banner */}
      <header className="logistics-header">
        <div className="logistics-header-content">
          <div className="logistics-title-group">
            <span className="portal-badge">
              <Package size={14} /> Module 04
            </span>
            <h1 className="portal-title">Resource & Logistics Management</h1>
            <p className="portal-subtitle">
              Manage multi-depot emergency supplies, track real-time stock levels, and dispatch relief allocations.
            </p>
          </div>

          <div className="logistics-header-stats">
            <div className="header-stat-pill">
              <span className="stat-label">Active Dispatches</span>
              <span className="stat-val stat-val-blue">{LOGISTICS_STATS.activeDeliveries}</span>
            </div>
            <div className="header-stat-pill">
              <span className="stat-label">Critical Shortages</span>
              <span className="stat-val stat-val-amber">{LOGISTICS_STATS.criticalStockItems}</span>
            </div>
            <div className="header-stat-pill">
              <span className="stat-label">Fleet Efficiency</span>
              <span className="stat-val stat-val-green">{LOGISTICS_STATS.fleetUtilization}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="logistics-tab-nav" aria-label="Logistics Navigation">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`logistics-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          >
            <Layers size={16} />
            <span>Warehouse Inventory</span>
          </button>
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`logistics-tab-btn ${activeTab === 'dispatch' ? 'active' : ''}`}
          >
            <Truck size={16} />
            <span>Allocation & Dispatch</span>
          </button>
        </nav>
      </header>

      {/* Main Tab Content */}
      <main className="logistics-main-body">
        {activeTab === 'inventory' && <ResourceInventoryPage />}
        {activeTab === 'dispatch' && <AllocationDispatchPage />}
      </main>
    </div>
  );
};

export default LogisticsPortalPage;

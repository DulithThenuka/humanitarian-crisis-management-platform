import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  Building2,
  ClipboardList,
  ArrowDownToLine
} from 'lucide-react';
import { ResourceInventoryPage } from './inventory/ResourceInventoryPage';
import { AllocationDispatchPage } from './dispatch/AllocationDispatchPage';
import { SupplyRequisitionsView } from './requests/SupplyRequisitionsView';
import { DepotFacilitiesView } from './depots/DepotFacilitiesView';
import { ReceivingDockView } from './intake/ReceivingDockView';
import { LOGISTICS_STATS, QUICK_METRICS } from './data/logisticsPortalData';
import './LogisticsPortalPage.css';

export const LogisticsPortalPage = ({ initialTab = 'inventory' }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Reactively sync activeTab with URL route and props
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    const p = (location.pathname || '').toLowerCase();
    if (p.includes('/dispatch') || p.includes('/allocations')) {
      setActiveTab('dispatch');
    } else if (p.includes('/requests') || p.includes('/requisitions')) {
      setActiveTab('requests');
    } else if (p.includes('/depots') || p.includes('/warehouses')) {
      setActiveTab('depots');
    } else if (p.includes('/intake') || p.includes('/receiving')) {
      setActiveTab('intake');
    } else if (p.includes('/inventory') || p === '/logistics' || p === '/logistics/dashboard') {
      setActiveTab('inventory');
    }
  }, [initialTab, location.pathname]);

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
              Manage multi-depot emergency supplies, track real-time stock levels, review shelter requisitions, and dispatch relief convoys.
            </p>
          </div>

          <div className="logistics-header-stats">
            <div className="header-stat-pill">
              <span className="stat-label">Active Dispatches</span>
              <span className="stat-val stat-val-blue">{LOGISTICS_STATS.activeDeliveries}</span>
            </div>
            <div className="header-stat-pill">
              <span className="stat-label">Pending Requisitions</span>
              <span className="stat-val stat-val-amber">{LOGISTICS_STATS.pendingRequisitions || 14}</span>
            </div>
            <div className="header-stat-pill">
              <span className="stat-label">Regional Depots</span>
              <span className="stat-val stat-val-green">{LOGISTICS_STATS.totalWarehouses}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="logistics-tab-nav" aria-label="Logistics Navigation" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
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
          <button
            onClick={() => setActiveTab('requests')}
            className={`logistics-tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          >
            <ClipboardList size={16} />
            <span>Supply Requisitions</span>
            <span style={{ fontSize: '0.7rem', background: '#f59e0b', color: '#0f172a', padding: '0.1rem 0.45rem', borderRadius: '999px', fontWeight: 700, marginLeft: '0.2rem' }}>
              {LOGISTICS_STATS.pendingRequisitions || 14}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('depots')}
            className={`logistics-tab-btn ${activeTab === 'depots' ? 'active' : ''}`}
          >
            <Building2 size={16} />
            <span>Depot Facilities</span>
          </button>
          <button
            onClick={() => setActiveTab('intake')}
            className={`logistics-tab-btn ${activeTab === 'intake' ? 'active' : ''}`}
          >
            <ArrowDownToLine size={16} />
            <span>Receiving Dock</span>
          </button>
        </nav>
      </header>

      {/* Main Tab Content */}
      <main className="logistics-main-body">
        {activeTab === 'inventory' && <ResourceInventoryPage />}
        {activeTab === 'dispatch' && <AllocationDispatchPage />}
        {activeTab === 'requests' && <SupplyRequisitionsView showToast={showToast} />}
        {activeTab === 'depots' && <DepotFacilitiesView showToast={showToast} />}
        {activeTab === 'intake' && <ReceivingDockView showToast={showToast} />}
      </main>

      {/* Toast HUD */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#1e293b', border: '1px solid #38bdf8', color: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '10px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <CheckCircle2 size={18} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default LogisticsPortalPage;

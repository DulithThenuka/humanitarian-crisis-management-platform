import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Package,
  FileCheck,
  Truck,
  HeartHandshake,
  AlertTriangle,
  BarChart3,
  Clock,
  Bell,
  Settings,
  ChevronRight,
  LogOut,
  Search,
  CheckCircle,
  X
} from 'lucide-react';

import './ResourceManager.css';
import {
  RESOURCE_MANAGER_USER,
  INITIAL_RESOURCE_METRICS,
  INVENTORY_ITEMS_DATA,
  ALLOCATION_REQUESTS_DATA,
  DISTRIBUTION_TRACKING_DATA,
  SUPPLIERS_DATA
} from './data/resourceData';

import { ReviewAllocationModal } from './components/ReviewAllocationModal';
import { AddInventoryModal } from './components/AddInventoryModal';
import { AddSupplierModal } from './components/AddSupplierModal';
import { ExportResourceModal } from './components/ExportResourceModal';

import { ResourceManagerOverviewView } from './views/ResourceManagerOverviewView';
import { InventoryManagementView } from './views/InventoryManagementView';
import { ResourceAllocationRequestsView } from './views/ResourceAllocationRequestsView';
import { DistributionTrackingView } from './views/DistributionTrackingView';
import { SuppliersDonationsView } from './views/SuppliersDonationsView';
import { StockAlertsView } from './views/StockAlertsView';
import { ResourceReportsView } from './views/ResourceReportsView';
import { ResourceNotificationsView } from './views/ResourceNotificationsView';
import { ResourceProfileSettingsView } from './views/ResourceProfileSettingsView';

export const ResourceManagerDashboard = ({ initialTab = 'overview' }) => {
  const navigate = useNavigate();

  // Navigation State
  const [currentTab, setCurrentTab] = useState(initialTab);

  // Live Data State
  const [inventoryItems, setInventoryItems] = useState(INVENTORY_ITEMS_DATA);
  const [allocationRequests, setAllocationRequests] = useState(ALLOCATION_REQUESTS_DATA);
  const [dispatches, setDispatches] = useState(DISTRIBUTION_TRACKING_DATA);
  const [suppliers, setSuppliers] = useState(SUPPLIERS_DATA);

  // User & Duty State
  const [dutyStatus, setDutyStatus] = useState(RESOURCE_MANAGER_USER.dutyStatus);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(1);
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals State
  const [reviewModalState, setReviewModalState] = useState({
    isOpen: false,
    actionType: 'approve',
    item: null,
    source: null,
    payload: null
  });

  const [addInventoryModalOpen, setAddInventoryModalOpen] = useState(false);
  const [addSupplierModalOpen, setAddSupplierModalOpen] = useState(false);
  const [exportModalState, setExportModalState] = useState({
    isOpen: false,
    scope: 'Inventory'
  });

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Nav labels for breadcrumbs
  const tabTitles = {
    overview: 'Resource Manager Overview',
    inventory: 'Inventory Management',
    allocations: 'Resource Allocation Requests',
    tracking: 'Distribution & Delivery Tracking',
    suppliers: 'Suppliers & Donations',
    alerts: 'Stock Alerts & Deficits',
    reports: 'Resource Reports & Analytics',
    activity: 'Audit & Activity Log',
    notifications: 'Operational Notifications',
    settings: 'Profile & Settings'
  };

  // Handlers for adding items
  const handleAddInventory = (newItem) => {
    setInventoryItems((prev) => [newItem, ...prev]);
    showToast(`Inventory item "${newItem.name}" registered successfully.`);
  };

  const handleAddSupplier = (newSupplier) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
    showToast(`Supplier "${newSupplier.name}" added to approved network.`);
  };

  const handleExportDownload = (exportData) => {
    showToast(`Export generated: ${exportData.reportType} (${exportData.fileFormat.toUpperCase()})`);
  };

  // Allocation Action Trigger from Detail View
  const handleTriggerAllocationReview = ({ request, actionType, approvedQuantity, managerNote }) => {
    setReviewModalState({
      isOpen: true,
      actionType,
      item: request,
      source: 'allocation',
      payload: { approvedQuantity, managerNote }
    });
  };

  // Delivery Action Trigger from Tracking View
  const handleTriggerDeliveryReview = (dispatch) => {
    setReviewModalState({
      isOpen: true,
      actionType: 'delivery',
      item: dispatch,
      source: 'delivery',
      payload: null
    });
  };

  // Delivery status step advancement
  const handleUpdateStatusAction = (dispatch) => {
    if (dispatch.currentStep < 5) {
      const nextStep = dispatch.currentStep + 1;
      const stepNames = { 2: 'Approved', 3: 'Prepared', 4: 'Dispatched', 5: 'Delivered' };
      setDispatches((prev) =>
        prev.map((d) =>
          d.id === dispatch.id
            ? {
                ...d,
                currentStep: nextStep,
                status: stepNames[nextStep] || 'In Transit',
                statusType: nextStep === 5 ? 'success' : 'info'
              }
            : d
        )
      );
      showToast(`Dispatch ${dispatch.id} moved to stage: ${stepNames[nextStep]}`);
    }
  };

  // Confirm Action from Modal (Exact User-Requested Confirmation Dialog)
  const handleConfirmReviewedAction = ({ itemId, actionType, reason }) => {
    if (reviewModalState.source === 'allocation') {
      const { item: request, payload } = reviewModalState;
      if (actionType === 'approve') {
        const approvedQty = payload?.approvedQuantity || request.requestedQuantity;
        setInventoryItems((prev) =>
          prev.map((inv) =>
            inv.name.toLowerCase().includes(request.itemName.toLowerCase())
              ? {
                  ...inv,
                  quantity: Math.max(0, inv.quantity - approvedQty),
                  stockStatus: inv.quantity - approvedQty < 50 ? 'Low stock' : 'Available',
                  lastUpdated: 'Just now'
                }
              : inv
          )
        );

        setAllocationRequests((prev) => prev.filter((r) => r.id !== request.id));
        showToast(`Allocation ${request.id} approved for ${approvedQty} units. Logged in audit trail.`);
      } else if (actionType === 'reject') {
        setAllocationRequests((prev) => prev.filter((r) => r.id !== request.id));
        showToast(`Allocation ${request.id} rejected with operational reason.`);
      } else if (actionType === 'clarification') {
        showToast(`Clarification requested for ${request.id}. Emergency Coordinator notified.`);
      }
    } else if (reviewModalState.source === 'delivery') {
      const dispatch = reviewModalState.item;
      setDispatches((prev) =>
        prev.map((d) =>
          d.id === dispatch.id
            ? {
                ...d,
                status: 'Delivered',
                statusType: 'success',
                currentStep: 5,
                deliveryConfirmation: `Confirmed by ${RESOURCE_MANAGER_USER.name} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
              }
            : d
        )
      );
      showToast(`Delivery confirmation recorded for ${dispatch.id}.`);
    }
  };

  return (
    <div className="rm-portal-container">
      {/* 1. Left Sidebar - Styled in Project Deep Slate Navy */}
      <aside className="rm-sidebar">
        <div>
          {/* Brand Header */}
          <div className="rm-brand-header">
            <div className="rm-brand-icon-box">
              <Shield size={18} color="#ffffff" />
            </div>
            <div>
              <h2 className="rm-brand-title">HumanAid</h2>
              <p className="rm-brand-subtitle">Response coordination</p>
            </div>
          </div>

          {/* User Profile Switcher Card */}
          <div className="rm-user-card">
            <div className="rm-user-card-info">
              <div className="rm-user-avatar">{RESOURCE_MANAGER_USER.avatar}</div>
              <div>
                <div className="rm-user-role-label">Signed in as</div>
                <div className="rm-user-role-name">{RESOURCE_MANAGER_USER.shortRole}</div>
                <div className="rm-user-person-name">{RESOURCE_MANAGER_USER.name}</div>
              </div>
            </div>
            {/* Interactive Toggle Switch */}
            <label className="rm-toggle-switch">
              <input
                type="checkbox"
                checked={dutyStatus}
                onChange={(e) => {
                  setDutyStatus(e.target.checked);
                  showToast(e.target.checked ? 'Duty status switched to Active Duty' : 'Duty status switched to Off Duty');
                }}
              />
              <span className="rm-toggle-slider" />
            </label>
          </div>

          {/* Navigation Menu */}
          <ul className="rm-nav-list">
            <li>
              <button
                type="button"
                className={`rm-nav-btn ${currentTab === 'overview' ? 'active' : ''}`}
                onClick={() => setCurrentTab('overview')}
              >
                <div className="rm-nav-btn-content">
                  <LayoutDashboard size={17} />
                  <span>Overview</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`rm-nav-btn ${currentTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setCurrentTab('inventory')}
              >
                <div className="rm-nav-btn-content">
                  <Package size={17} />
                  <span>Inventory</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`rm-nav-btn ${currentTab === 'allocations' ? 'active' : ''}`}
                onClick={() => setCurrentTab('allocations')}
              >
                <div className="rm-nav-btn-content">
                  <FileCheck size={17} />
                  <span>Allocation Requests</span>
                </div>
                {allocationRequests.length > 0 && (
                  <span className="rm-nav-badge">{allocationRequests.length}</span>
                )}
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`rm-nav-btn ${currentTab === 'tracking' ? 'active' : ''}`}
                onClick={() => setCurrentTab('tracking')}
              >
                <div className="rm-nav-btn-content">
                  <Truck size={17} />
                  <span>Distribution Tracking</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`rm-nav-btn ${currentTab === 'suppliers' ? 'active' : ''}`}
                onClick={() => setCurrentTab('suppliers')}
              >
                <div className="rm-nav-btn-content">
                  <HeartHandshake size={17} />
                  <span>Suppliers & Donations</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`rm-nav-btn ${currentTab === 'alerts' ? 'active' : ''}`}
                onClick={() => setCurrentTab('alerts')}
              >
                <div className="rm-nav-btn-content">
                  <AlertTriangle size={17} />
                  <span>Stock Alerts</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`rm-nav-btn ${currentTab === 'reports' ? 'active' : ''}`}
                onClick={() => setCurrentTab('reports')}
              >
                <div className="rm-nav-btn-content">
                  <BarChart3 size={17} />
                  <span>Reports & Analytics</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`rm-nav-btn ${currentTab === 'activity' ? 'active' : ''}`}
                onClick={() => setCurrentTab('activity')}
              >
                <div className="rm-nav-btn-content">
                  <Clock size={17} />
                  <span>Activity History</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`rm-nav-btn ${currentTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setCurrentTab('notifications')}
              >
                <div className="rm-nav-btn-content">
                  <Bell size={17} />
                  <span>Notifications</span>
                </div>
                {unreadNotificationCount > 0 && (
                  <span className="rm-nav-badge">{unreadNotificationCount}</span>
                )}
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`rm-nav-btn ${currentTab === 'settings' ? 'active' : ''}`}
                onClick={() => setCurrentTab('settings')}
              >
                <div className="rm-nav-btn-content">
                  <Settings size={17} />
                  <span>Profile & Settings</span>
                </div>
              </button>
            </li>
          </ul>
        </div>

        {/* Bottom Sidebar: Boundary Badge & Exit */}
        <div className="rm-sidebar-footer">
          <div className="rm-boundary-box">
            <div className="rm-boundary-header">
              <Shield size={13} />
              <span>Resource operations access</span>
            </div>
            <p className="rm-boundary-text">
              Inventory and allocation workflows only. System administration is restricted.
            </p>
          </div>

          <button
            type="button"
            className="rm-signout-btn"
            style={{ width: '100%', marginTop: 6 }}
            onClick={() => navigate('/dashboard')}
          >
            <ChevronRight size={16} />
            <span>Exit resource portal</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <main className="rm-main-wrapper">
        {/* Top Navbar */}
        <header className="rm-top-navbar">
          {/* Breadcrumb */}
          <div className="rm-top-breadcrumbs">
            <span className="rm-breadcrumb-portal">RESOURCE MANAGER PORTAL</span>
            <span className="rm-breadcrumb-current">{tabTitles[currentTab] || 'Dashboard'}</span>
          </div>

          {/* Search Box */}
          <div className="rm-top-search-box">
            <Search size={16} color="var(--rm-text-muted)" />
            <input
              type="text"
              className="rm-top-search-input"
              placeholder="Search inventory, allocations, dispatches..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
            <span className="rm-search-shortcut">⌘K</span>
          </div>

          {/* Right Action Icons */}
          <div className="rm-top-right-group">
            <div className="rm-active-op-chip">
              <span className="rm-op-indicator-dot" />
              <span>Western Province Flood</span>
            </div>

            <button
              type="button"
              className="rm-bell-btn"
              title="Notifications"
              onClick={() => setCurrentTab('notifications')}
            >
              <Bell size={18} />
              {unreadNotificationCount > 0 && (
                <span className="rm-bell-badge">{unreadNotificationCount}</span>
              )}
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px',
                borderRadius: 20,
                border: '1px solid var(--rm-border)',
                backgroundColor: '#f8fafc',
                cursor: 'pointer'
              }}
              title="Open Profile & Settings"
              onClick={() => setCurrentTab('settings')}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: 'var(--rm-primary-blue)',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                DP
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--rm-text-primary)' }}>
                  {RESOURCE_MANAGER_USER.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--rm-text-muted)' }}>
                  {RESOURCE_MANAGER_USER.shortRole}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Coursework Prototype Banner */}
        <div className="rm-prototype-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0369a1' }}>Coursework prototype:</span>
            <span>All records, AI results and transactions are fictional demonstration data. Actions are local UI simulations.</span>
          </div>
        </div>

        {/* Body View Render */}
        <div className="rm-content-body">
          {currentTab === 'overview' && (
            <ResourceManagerOverviewView
              onNavigate={(tab, targetId) => {
                setCurrentTab(tab);
              }}
              onOpenAddInventory={() => setAddInventoryModalOpen(true)}
              onRequestReview={(item) =>
                handleTriggerAllocationReview({
                  request: item,
                  actionType: 'approve',
                  approvedQuantity: item.requestedQuantity,
                  managerNote: ''
                })
              }
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryManagementView
              inventoryItems={inventoryItems}
              onOpenAddInventory={() => setAddInventoryModalOpen(true)}
              onOpenExport={(scope) => setExportModalState({ isOpen: true, scope })}
              onSelectActionItem={(item, action) => {
                showToast(`Adjusting item ${item.name} (${item.id})`);
                setAddInventoryModalOpen(true);
              }}
            />
          )}

          {currentTab === 'allocations' && (
            <ResourceAllocationRequestsView
              allocationRequests={allocationRequests}
              onTriggerReviewAction={handleTriggerAllocationReview}
            />
          )}

          {currentTab === 'tracking' && (
            <DistributionTrackingView
              dispatches={dispatches}
              onOpenExport={(scope) => setExportModalState({ isOpen: true, scope })}
              onTriggerDeliveryAction={handleTriggerDeliveryReview}
              onUpdateStatusAction={handleUpdateStatusAction}
            />
          )}

          {currentTab === 'suppliers' && (
            <SuppliersDonationsView
              suppliers={suppliers}
              onOpenAddSupplier={() => setAddSupplierModalOpen(true)}
              onOpenExport={(scope) => setExportModalState({ isOpen: true, scope })}
            />
          )}

          {currentTab === 'alerts' && (
            <StockAlertsView
              onOpenAddInventory={() => setAddInventoryModalOpen(true)}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'reports' && (
            <ResourceReportsView
              onOpenExport={(scope) => setExportModalState({ isOpen: true, scope })}
            />
          )}

          {currentTab === 'activity' && (
            <div className="rm-view-container">
              <div className="rm-header-row">
                <div>
                  <span className="rm-header-kicker">AUDIT TRAIL & LOGISTICS EVENTS</span>
                  <h1 className="rm-header-title">Activity History</h1>
                  <p className="rm-header-subtitle">Comprehensive ledger of resource movements and approvals.</p>
                </div>
              </div>
              <div className="rm-section-box">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { time: '10:12:44', event: 'Stock adjusted', detail: 'RES-021 +50 bottled water units received at Central Depot', user: 'Dilan Perera' },
                    { time: '09:50:18', event: 'Allocation approved', detail: 'RAR-199 300 water units authorized for Kelani Relief Camp', user: 'Dilan Perera' },
                    { time: '09:20:05', event: 'Dispatch prepared', detail: 'DSP-041 Medical packs staged at Wattala loading bay 2', user: 'Logistics Team Alpha' },
                    { time: '08:44:30', event: 'Delivery confirmed', detail: 'DSP-038 60 blankets delivered to SH-008 and signed', user: 'H. Ranasinghe' }
                  ].map((act, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--rm-primary-blue)' }}>{act.time}</span>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{act.event}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--rm-text-secondary)', marginTop: 2 }}>{act.detail}</div>
                      </div>
                      <span style={{ fontSize: 11.5, color: 'var(--rm-text-muted)', fontWeight: 600 }}>{act.user}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'notifications' && (
            <ResourceNotificationsView
              onNavigate={(tab) => setCurrentTab(tab)}
              onUpdateBadgeCount={(cnt) => setUnreadNotificationCount(cnt)}
            />
          )}

          {currentTab === 'settings' && (
            <ResourceProfileSettingsView
              showToast={showToast}
            />
          )}
        </div>
      </main>

      {/* Action Review Confirmation Dialog Card (Exact Figma Pattern) */}
      <ReviewAllocationModal
        isOpen={reviewModalState.isOpen}
        actionType={reviewModalState.actionType}
        item={reviewModalState.item}
        onClose={() => setReviewModalState({ isOpen: false, actionType: 'approve', item: null, source: null, payload: null })}
        onConfirm={handleConfirmReviewedAction}
      />

      {/* Add Inventory Modal */}
      <AddInventoryModal
        isOpen={addInventoryModalOpen}
        onClose={() => setAddInventoryModalOpen(false)}
        onAdd={handleAddInventory}
      />

      {/* Add Supplier Modal */}
      <AddSupplierModal
        isOpen={addSupplierModalOpen}
        onClose={() => setAddSupplierModalOpen(false)}
        onAdd={handleAddSupplier}
      />

      {/* Export Report Modal */}
      <ExportResourceModal
        isOpen={exportModalState.isOpen}
        defaultScope={exportModalState.scope}
        onClose={() => setExportModalState({ isOpen: false, scope: 'Inventory' })}
        onExport={handleExportDownload}
      />

      {/* Toast Notifications */}
      <div className="rm-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="rm-toast">
            <CheckCircle size={16} color="#38bdf8" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ResourceManagerDashboard;


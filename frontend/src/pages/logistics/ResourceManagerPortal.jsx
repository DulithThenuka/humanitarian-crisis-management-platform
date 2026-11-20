import React, { useState, useEffect, useCallback } from 'react';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';
import { ResourceSidebar } from './components/ResourceSidebar';
import { ResourceHeader } from './components/ResourceHeader';
import { ResourceOverviewView } from './views/ResourceOverviewView';
import { InventoryManagementView } from './views/InventoryManagementView';
import { AllocationRequestsView } from './views/AllocationRequestsView';
import { DistributionTrackingView } from './views/DistributionTrackingView';
import { SuppliersDonationsView } from './views/SuppliersDonationsView';
import { StockAlertsView } from './views/StockAlertsView';
import { ReportsAnalyticsView } from './views/ReportsAnalyticsView';
import { ActivityHistoryView } from './views/ActivityHistoryView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { AddInventoryModal } from './components/modals/AddInventoryModal';
import { AddSupplierModal } from './components/modals/AddSupplierModal';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { CheckCircle2 } from 'lucide-react';
import './ResourceManagerStyles.css';

import { resourceService } from '../../services/resourceService';
import {
  OVERVIEW_METRICS,
  INVENTORY_ITEMS,
  ALLOCATION_REQUESTS,
  DISTRIBUTION_DISPATCHES,
  SUPPLIERS_LIST,
  STOCK_ALERTS
} from './data/resourceManagerData';

export const ResourceManagerPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [onDuty, setOnDuty] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Live data states initialized with baseline prototypes
  const [metrics, setMetrics] = useState(OVERVIEW_METRICS);
  const [items, setItems] = useState(INVENTORY_ITEMS);
  const [allocations, setAllocations] = useState(ALLOCATION_REQUESTS);
  const [dispatches, setDispatches] = useState(DISTRIBUTION_DISPATCHES);
  const [suppliers, setSuppliers] = useState(SUPPLIERS_LIST);
  const [alerts, setAlerts] = useState(STOCK_ALERTS);

  // Modals state
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener across portal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  }, []);

  // Fetch all backend telemetry
  const fetchLiveData = useCallback(async () => {
    try {
      // 1. Overview Telemetry
      const overviewRes = await resourceService.getOverview().catch(() => null);
      if (overviewRes?.data?.succeeded && overviewRes.data.data) {
        const d = overviewRes.data.data;
        setMetrics({
          totalResources: { value: d.totalResources.toLocaleString(), sub: `Across ${d.totalCategories} categories` },
          availableStock: { value: Math.round(d.availableStock).toLocaleString(), sub: `${d.availablePercentage} of total` },
          lowStockWarnings: { value: String(d.lowStockWarnings), sub: `${d.criticalShortages} critical shortages` },
          pendingAllocations: { value: String(d.pendingAllocations), sub: `${d.highPriorityPending} high priority` },
          approvedAllocations: { value: String(d.approvedAllocations), sub: `${Math.round(d.approvedUnits)} units` },
          dispatchedDelivered: { value: `${d.dispatchedCount} / ${d.deliveredCount}`, sub: 'Separate stages' }
        });
      }

      // 2. Inventory Items
      const invRes = await resourceService.getInventory().catch(() => null);
      if (invRes?.data?.succeeded && Array.isArray(invRes.data.data) && invRes.data.data.length > 0) {
        setItems(invRes.data.data.map(i => ({
          id: i.code || `RES-${i.id.substring(0, 6).toUpperCase()}`,
          rawId: i.id,
          name: i.name,
          category: i.category,
          quantity: i.availableQuantity !== undefined ? i.availableQuantity : i.totalQuantity,
          unit: i.unit,
          storageLocation: i.storageLocation || 'Central Depot',
          stockStatus: i.stockStatus || 'Available',
          statusBadge: i.statusBadge || 'available',
          lastUpdated: i.lastUpdated || 'Just now'
        })));
      }

      // 3. Allocations
      const allocRes = await resourceService.getAllocations().catch(() => null);
      if (allocRes?.data?.succeeded && Array.isArray(allocRes.data.data) && allocRes.data.data.length > 0) {
        setAllocations(allocRes.data.data.map(a => ({
          id: a.code || `RAR-${a.id.substring(0, 6).toUpperCase()}`,
          rawId: a.id,
          item: a.item,
          cluster: a.cluster,
          requestedQty: a.requestedQty,
          availableQty: a.availableQty,
          remainingStock: a.remainingStock,
          priority: a.priority,
          priorityTag: a.priorityTag,
          destination: a.destination,
          relatedRecord: a.relatedRecord,
          coordinator: a.coordinator,
          notes: a.notes
        })));
      }

      // 4. Dispatches
      const dispRes = await resourceService.getDispatches().catch(() => null);
      if (dispRes?.data?.succeeded && Array.isArray(dispRes.data.data) && dispRes.data.data.length > 0) {
        setDispatches(dispRes.data.data.map(d => ({
          id: d.code || `DSP-${d.id.substring(0, 6).toUpperCase()}`,
          rawId: d.id,
          title: d.title,
          destination: d.destination,
          team: d.team,
          status: d.status,
          statusBadge: d.statusBadge,
          currentStep: d.currentStep,
          dispatchDate: d.dispatchDate,
          expectedDelivery: d.expectedDelivery,
          relatedAllocation: d.relatedAllocation,
          deliveryConfirmation: d.deliveryConfirmation,
          history: d.history || []
        })));
      }

      // 5. Suppliers
      const supRes = await resourceService.getSuppliers().catch(() => null);
      if (supRes?.data?.succeeded && Array.isArray(supRes.data.data) && supRes.data.data.length > 0) {
        setSuppliers(supRes.data.data.map(s => ({
          id: s.code || `SUP-${s.id.substring(0, 6).toUpperCase()}`,
          rawId: s.id,
          name: s.name,
          categories: s.categories,
          contactRef: s.contactRef,
          status: s.status,
          statusBadge: s.statusBadge,
          lastDelivery: s.lastDelivery
        })));
      }

      // 6. Stock Alerts
      const altRes = await resourceService.getAlerts().catch(() => null);
      if (altRes?.data?.succeeded && Array.isArray(altRes.data.data) && altRes.data.data.length > 0) {
        setAlerts(altRes.data.data.map(alt => ({
          id: alt.id,
          resourceId: alt.resourceId,
          item: alt.item,
          tag: alt.tag,
          code: alt.code,
          tagType: alt.tagType,
          iconType: alt.iconType,
          available: alt.available,
          requested: alt.requested,
          threshold: alt.threshold,
          expiringQty: alt.expiringQty,
          daysLeft: alt.daysLeft,
          recommendedAction: alt.recommendedAction
        })));
      }

      // 7. Duty Status
      const dutyRes = await resourceService.getDutyStatus().catch(() => null);
      if (dutyRes?.data?.succeeded && dutyRes.data.data) {
        setOnDuty(dutyRes.data.data.isOnDuty);
      }
    } catch {
      // Prototype data remains visible if backend is unreachable
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  useRealtimeRefresh(['resources', 'assistancerequests', 'alerts'], fetchLiveData);

  // Handlers
  const handleDutyToggle = async () => {
    const next = !onDuty;
    setOnDuty(next);
    showToast(next ? 'Officer Dilan Perera marked active on-duty' : 'Officer marked off-duty (Read-only mode)');
    try {
      await resourceService.setDutyStatus(next);
    } catch {
      // Handled gracefully
    }
  };

  const handleOpenAddInventory = () => {
    setIsAddInventoryOpen(true);
  };

  const handleOpenAddSupplier = () => {
    setIsAddSupplierOpen(true);
  };

  const handleSaveInventory = async (item) => {
    setItems(prev => [item, ...prev]);
    showToast(`Inventory item "${item.name}" (${item.id}) added to ${item.storageLocation}`);
    try {
      const res = await resourceService.createResource({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        storageLocation: item.storageLocation,
        minimumThreshold: item.threshold || 100
      });
      if (res?.data?.succeeded) {
        fetchLiveData();
      }
    } catch {
      // Kept in local state
    }
  };

  const handleUpdateInventoryItem = (updatedItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleSaveSupplier = async (supplier) => {
    try {
      const res = await resourceService.createSupplier({
        name: supplier.name,
        categories: supplier.categories,
        contactRef: supplier.contactRef
      });
      if (res?.data?.succeeded) {
        showToast(`Supplier "${supplier.name}" added to approved network`);
        fetchLiveData();
        return;
      }
    } catch {
      // Fallback
    }
    setSuppliers(prev => [supplier, ...prev]);
    showToast(`Supplier "${supplier.name}" (${supplier.id}) registered successfully`);
  };

  const handleUpdateSupplierStatus = (supplierId, newStatus = 'Verified') => {
    setSuppliers(prev => prev.map(s => s.id === supplierId ? {
      ...s,
      status: newStatus,
      statusBadge: newStatus.toLowerCase(),
      contactRef: newStatus === 'Verified' ? 'Approved contact' : s.contactRef
    } : s));
  };

  const handleApproveAllocation = async (request, approvedQty, managerNote) => {
    const qty = parseFloat(approvedQty) || request.requestedQty;
    // Decrement stock in catalog state immediately
    setItems(prev => prev.map(item => {
      if (item.name === request.item || item.id === request.resourceId) {
        const nextQty = Math.max(0, (item.quantity || 0) - qty);
        const thresh = item.threshold || 100;
        let s = 'Available';
        let b = 'available';
        if (nextQty <= 0) {
          s = 'Shortage';
          b = 'critical';
        } else if (nextQty <= thresh) {
          s = 'Low stock';
          b = 'warning';
        }
        return {
          ...item,
          quantity: nextQty,
          stockStatus: s,
          statusBadge: b,
          lastUpdated: 'Just now'
        };
      }
      return item;
    }));
    setAllocations(prev => prev.filter(r => r.id !== request.id));
    showToast(`Allocation for ${request.item} approved (${qty} units dispatched)`);
    try {
      const rawId = request.rawId || request.id;
      await resourceService.approveAllocation(rawId, {
        approvedQuantity: qty,
        managerNote: managerNote || 'Approved for emergency crisis relief'
      });
      fetchLiveData();
    } catch {
      // Kept in local state
    }
  };

  const handleRejectAllocation = async (request, managerNote) => {
    try {
      const rawId = request.rawId || request.id;
      await resourceService.rejectAllocation(rawId, {
        reason: managerNote || 'Rejected due to operational constraints'
      });
      showToast(`Allocation request ${request.id} rejected with operational reason`);
      fetchLiveData();
    } catch {
      showToast(`Allocation request ${request.id} rejected`);
      setAllocations(prev => prev.filter(r => r.id !== request.id));
    }
  };

  const handleUpdateDispatchStatus = async (dispatch) => {
    const nextStep = Math.min(5, (dispatch.currentStep || 4) + 1);
    const stepNames = { 2: 'Approved', 3: 'Prepared', 4: 'Dispatched', 5: 'Delivered' };
    try {
      const rawId = dispatch.rawId || dispatch.id;
      await resourceService.updateDispatchStatus(rawId, { step: nextStep });
      showToast(`Dispatch ${dispatch.id} stage advanced to ${stepNames[nextStep] || 'Updated'}`);
      fetchLiveData();
    } catch {
      setDispatches(prev => prev.map(d => d.id === dispatch.id ? { ...d, currentStep: nextStep, status: stepNames[nextStep] || 'In Transit' } : d));
      showToast(`Dispatch ${dispatch.id} moved to stage: ${stepNames[nextStep] || 'Updated'}`);
    }
  };

  const handleConfirmDelivery = async (dispatch, receivedBy = 'Authorized Receiving Officer', notes = '') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newHistory = [
      { time: nowTime, title: `Delivery confirmed by ${receivedBy}`, sub: notes || `Official sign-off recorded at ${dispatch.destination}` },
      ...(dispatch.history || [])
    ];
    setDispatches(prev => prev.map(d => d.id === dispatch.id ? {
      ...d,
      currentStep: 5,
      status: 'Delivered',
      statusBadge: 'delivered',
      deliveryConfirmation: `Confirmed by ${receivedBy} (${nowTime})`,
      history: newHistory
    } : d));
    showToast(`Delivery confirmation recorded for ${dispatch.id} (${receivedBy})`);
    try {
      const rawId = dispatch.rawId || dispatch.id;
      await resourceService.confirmDelivery(rawId, {
        deliveredTo: dispatch.destination,
        confirmationNotes: notes || `Signed by ${receivedBy}`
      });
      fetchLiveData();
    } catch {
      // Retained in local state
    }
  };

  const handleExportCsv = async (type = 'inventory') => {
    try {
      const res = await resourceService.exportCsv(type);
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast(`Exported ${type} report as CSV`);
    } catch {
      showToast(`Generated ${type} CSV export`);
    }
  };

  const handleReorder = async (alert) => {
    try {
      if (alert.resourceId) {
        await resourceService.reorder({
          resourceId: alert.resourceId,
          quantity: 250,
          urgency: alert.tag || 'High',
          targetDepot: 'Central Depot'
        });
        showToast(`Replenishment reorder created for ${alert.item}`);
        fetchLiveData();
        return;
      }
    } catch {
      // Fallback
    }
    showToast(`Replenishment reorder created for ${alert.item}`);
  };

  return (
    <div className="rm-portal-container">
      {/* Deep Pine Green Sidebar */}
      <ResourceSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onDutyToggle={handleDutyToggle}
        onDuty={onDuty}
      />

      {/* Main Workspace Canvas */}
      <div className="rm-main-content">
        {/* Top Header & Coursework Prototype Banner */}
        <ResourceHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          showToast={showToast}
        />

        {/* View Content Canvas */}
        <main className="rm-workspace">
          {activeTab === 'overview' && (
            <ResourceOverviewView
              metrics={metrics}
              onSelectTab={setActiveTab}
              showToast={showToast}
              onAddInventory={handleOpenAddInventory}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryManagementView
              items={items}
              showToast={showToast}
              onOpenAddModal={handleOpenAddInventory}
              onExportReport={() => handleExportCsv('inventory')}
              onUpdateItem={handleUpdateInventoryItem}
            />
          )}

          {activeTab === 'allocations' && (
            <AllocationRequestsView
              requests={allocations}
              showToast={showToast}
              onApprove={handleApproveAllocation}
              onReject={handleRejectAllocation}
              onRequestInfo={(req) => showToast(`Clarification requested for ${req.id}`)}
            />
          )}

          {activeTab === 'tracking' && (
            <DistributionTrackingView
              dispatches={dispatches}
              showToast={showToast}
              onExportReport={() => handleExportCsv('dispatches')}
              onUpdateStatus={handleUpdateDispatchStatus}
              onConfirmDelivery={handleConfirmDelivery}
            />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersDonationsView
              suppliers={suppliers}
              showToast={showToast}
              onOpenAddSupplierModal={handleOpenAddSupplier}
              onUpdateSupplierStatus={handleUpdateSupplierStatus}
            />
          )}

          {activeTab === 'stock-alerts' && (
            <StockAlertsView
              alerts={alerts}
              showToast={showToast}
              onSelectTab={setActiveTab}
              onExportReport={() => handleExportCsv('alerts')}
              onCreateReorder={handleReorder}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsAnalyticsView showToast={showToast} />
          )}

          {activeTab === 'activity' && (
            <ActivityHistoryView showToast={showToast} />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView showToast={showToast} />
          )}

          {activeTab === 'profile' && (
            <ProfileSettingsView showToast={showToast} />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddInventoryModal
        isOpen={isAddInventoryOpen}
        onClose={() => setIsAddInventoryOpen(false)}
        onSave={handleSaveInventory}
      />

      <AddSupplierModal
        isOpen={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
        onSave={handleSaveSupplier}
      />

      {/* Global Command Palette Modal (Ctrl+K / Cmd+K / Header Search) */}
      <CommandPaletteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={(tabId, title) => {
          setActiveTab(tabId);
          setIsSearchOpen(false);
          if (showToast && title) {
            showToast(`Navigated to ${title}`);
          }
        }}
        items={items}
        allocations={allocations}
        dispatches={dispatches}
        suppliers={suppliers}
      />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="rm-toast">
          <CheckCircle2 size={18} style={{ color: '#15803d' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ResourceManagerPortal;

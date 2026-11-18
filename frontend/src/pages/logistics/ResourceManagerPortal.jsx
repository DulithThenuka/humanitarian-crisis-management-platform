import React, { useState } from 'react';
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
import { CheckCircle2 } from 'lucide-react';
import './ResourceManagerStyles.css';

export const ResourceManagerPortal = ({ initialActiveTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [onDuty, setOnDuty] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  const handleDutyToggle = () => {
    setOnDuty((prev) => {
      const next = !prev;
      showToast(next ? 'Officer Dilan Perera marked active on-duty' : 'Officer marked off-duty (Read-only mode)');
      return next;
    });
  };

  const handleOpenAddInventory = () => {
    setIsAddInventoryOpen(true);
  };

  const handleOpenAddSupplier = () => {
    setIsAddSupplierOpen(true);
  };

  const handleSaveInventory = (item) => {
    showToast(`Inventory item "${item.name}" (${item.id}) added to ${item.storageLocation}`);
  };

  const handleSaveSupplier = (supplier) => {
    showToast(`Supplier "${supplier.name}" (${supplier.id}) registered successfully`);
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
          showToast={showToast}
        />

        {/* View Content Canvas */}
        <main className="rm-workspace">
          {activeTab === 'overview' && (
            <ResourceOverviewView
              onSelectTab={setActiveTab}
              showToast={showToast}
              onAddInventory={handleOpenAddInventory}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryManagementView
              showToast={showToast}
              onAddInventory={handleOpenAddInventory}
            />
          )}

          {activeTab === 'allocations' && (
            <AllocationRequestsView showToast={showToast} />
          )}

          {activeTab === 'tracking' && (
            <DistributionTrackingView showToast={showToast} />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersDonationsView
              showToast={showToast}
              onAddSupplier={handleOpenAddSupplier}
            />
          )}

          {activeTab === 'stock-alerts' && (
            <StockAlertsView
              showToast={showToast}
              onSelectTab={setActiveTab}
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

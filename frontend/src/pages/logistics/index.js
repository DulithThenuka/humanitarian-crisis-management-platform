// ==========================================
// Resource & Logistics Manager Module (Module 4)
// ==========================================

// Main Module Entry
export { LogisticsPortalPage } from './LogisticsPortalPage';
export { LogisticsPortalPage as default } from './LogisticsPortalPage';

// Sub-Category Page Modules
export { ResourceInventoryPage } from './inventory/ResourceInventoryPage';
export { AllocationDispatchPage } from './dispatch/AllocationDispatchPage';
export { SupplyRequisitionsView } from './requests/SupplyRequisitionsView';
export { DepotFacilitiesView } from './depots/DepotFacilitiesView';
export { ReceivingDockView } from './intake/ReceivingDockView';
export * from './data/logisticsPortalData';

// ==========================================
// Resource & Logistics Manager Module (Module 4)
// ==========================================

// Main Official Module Entry
export { ResourceManagerPortal } from './ResourceManagerPortal';
export { ResourceManagerPortal as default } from './ResourceManagerPortal';
export { LogisticsPortalPage } from './LogisticsPortalPage';

// Sub-Category Page Modules
export { ResourceInventoryPage } from './inventory/ResourceInventoryPage';
export { AllocationDispatchPage } from './dispatch/AllocationDispatchPage';
export { SupplyRequisitionsView } from './requests/SupplyRequisitionsView';
export { DepotFacilitiesView } from './depots/DepotFacilitiesView';
export { ReceivingDockView } from './intake/ReceivingDockView';
export * from './data/logisticsPortalData';
export * from './data/resourceManagerData';

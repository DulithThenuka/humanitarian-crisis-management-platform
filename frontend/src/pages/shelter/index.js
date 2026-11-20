// ==========================================
// Shelter Management Module (Module 5)
// ==========================================

// Main Module Entry
export {
  ShelterAdminDashboard,
  ShelterAdminDashboard as ShelterPortalPage,
  ShelterAdminDashboard as ShelterManagerPortal,
  ShelterAdminDashboard as ShelterManagerDashboard,
  ShelterAdminDashboard as default
} from './ShelterAdminDashboard';

// Sub-Category Page Modules
export { ShelterDirectoryPage } from './directory/ShelterDirectoryPage';
export { EvacueeAllocationPage } from './allocations/EvacueeAllocationPage';
export { CapacityOccupancyView } from './capacity/CapacityOccupancyView';
export { DirectoryFacilitiesView } from './facilities/DirectoryFacilitiesView';
export { PlacementAllocationsView } from './placements/PlacementAllocationsView';
export { ResourceRequestsView } from './requests/ResourceRequestsView';
export { ShelterReportsView } from './reports/ShelterReportsView';
export { ShelterDashboardView } from './dashboard/ShelterDashboardView';
export * from './data/shelterData';

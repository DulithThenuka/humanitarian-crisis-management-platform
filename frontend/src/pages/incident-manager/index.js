// ==========================================
// Incident / Case Manager Module (Module 3)
// ==========================================

// Main Module Entry
export { CaseManagerPortal } from './CaseManagerPortal';
export { CaseManagerPortal as default } from './CaseManagerPortal';

// Sub-Category Page Modules
export { CaseDashboardView } from './dashboard/CaseDashboardView';
export { CaseManagementView } from './cases/CaseManagementView';
export { AIAssistedReviewView } from './ai-review/AIAssistedReviewView';
export { CaseCommunicationView } from './communication/CaseCommunicationView';
export { CaseReportsView } from './reports/CaseReportsView';
export { CasePermissionsProfileView } from './profile/CasePermissionsProfileView';
export * from './caseManagerData';

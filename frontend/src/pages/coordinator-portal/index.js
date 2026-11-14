// ==========================================
// Emergency Coordinator Module (Module 2)
// ==========================================

// Main Module Entry
export { EmergencyCoordinatorPortal } from './EmergencyCoordinatorPortal';
export { EmergencyCoordinatorPortal as default } from './EmergencyCoordinatorPortal';

// Sub-Category Page Modules
export { DashboardOverviewPage } from './overview/DashboardOverviewPage';
export { CoordinatorOverviewView } from './overview/CoordinatorOverviewView';
export { OperationalMapView } from './overview/OperationalMapView';

export { RequestTriagePage } from './request-review/RequestTriagePage';
export { RequestReviewView } from './request-review/RequestReviewView';

export { AIDecisionReviewPage } from './ai-decision-support/AIDecisionReviewPage';
export { AIDecisionSupportView } from './ai-decision-support/AIDecisionSupportView';
export { AIOperationsContainer } from './ai-decision-support/operations/AIOperationsContainer';

export { AssistanceRequestDetailPage } from './assistance-requests/AssistanceRequestDetailPage';
export { AssistanceRequestsListView } from './assistance-requests/AssistanceRequestsListView';
export { AssistanceRequestsView } from './assistance-requests/AssistanceRequestsView';

export { CrisisManagementDashboardView } from './crisis-management/CrisisManagementDashboardView';
export { CrisisManagementView } from './crisis-management/CrisisManagementView';

export { ResourceCoordinationView } from './resource-coordination/ResourceCoordinationView';
export { ShelterVolunteerCoordinationView } from './shelter-volunteer/ShelterVolunteerCoordinationView';
export { EmergencyAlertsView } from './emergency-alerts/EmergencyAlertsView';
export { ReportsResponseAnalyticsView } from './reports/ReportsResponseAnalyticsView';
export { ReportsAnalyticsView } from './reports/ReportsAnalyticsView';
export { DecisionHistoryView } from './decision-history/DecisionHistoryView';

export { NotificationsRemindersView } from './notifications/NotificationsRemindersView';
export { NotificationCenterContainer } from './notifications/NotificationCenterContainer';
export { NotificationCenterHub } from './notifications/NotificationCenterHub';

export { ProfileSettingsView } from './profile-settings/ProfileSettingsView';

export * from './data/coordinatorPortalData';

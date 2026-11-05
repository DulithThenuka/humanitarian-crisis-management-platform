import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

// Public Home Landing
import { LandingHomePage } from '../pages/home/LandingHomePage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';

// Citizen Pages
import { CitizenPortalPage } from '../pages/citizen/CitizenPortalPage';
import { SubmitRequestPage } from '../pages/citizen/SubmitRequestPage';
import { TrackRequestsPage } from '../pages/citizen/TrackRequestsPage';
import { FindShelterPage } from '../pages/citizen/FindShelterPage';

// Coordinator Pages
import { DashboardOverviewPage } from '../pages/coordinator/DashboardOverviewPage';
import { EmergencyCoordinatorPortal } from '../pages/coordinator-portal/EmergencyCoordinatorPortal';
import { RequestTriagePage } from '../pages/coordinator/RequestTriagePage';
import { AIDecisionReviewPage } from '../pages/coordinator/AIDecisionReviewPage';
import { AssistanceRequestDetailPage } from '../pages/coordinator/AssistanceRequestDetailPage';
import { AssistanceRequestsListView } from '../pages/coordinator/AssistanceRequestsListView';

// Logistics Pages
import { ResourceInventoryPage } from '../pages/logistics/ResourceInventoryPage';
import { AllocationDispatchPage } from '../pages/logistics/AllocationDispatchPage';

// Shelters Pages
import { ShelterDirectoryPage } from '../pages/shelters/ShelterDirectoryPage';
import { EvacueeAllocationPage } from '../pages/shelters/EvacueeAllocationPage';
import { ShelterAdminDashboard } from '../pages/shelter-manger/ShelterAdminDashboard';

// Volunteers Pages
import { VolunteerPortal } from '../pages/volunteer/VolunteerPortal';
import { VolunteerRosterPage } from '../pages/volunteers/VolunteerRosterPage';
import { TaskAssignmentPage } from '../pages/volunteers/TaskAssignmentPage';

// Map & Analytics
import { OperationalMapView } from '../pages/map/OperationalMapView';
import { ReportsAnalyticsView } from '../pages/reports-and-analysis/ReportsAnalyticsView';

import { AuditCenterPage } from '../pages/audit/AuditCenterPage';
import { AIOperationsContainer } from '../pages/ai-operations/AIOperationsContainer';
import { CaseManagerPortal } from '../pages/incident/case-manager/CaseManagerPortal';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingHomePage />} />
      <Route path="/home" element={<LandingHomePage />} />
      <Route path="/landing" element={<LandingHomePage />} />

      {/* Emergency Coordinator Portal (HumanAid / Western Province Operations) */}
      <Route path="/coordinator" element={<EmergencyCoordinatorPortal />} />
      <Route path="/coordinator/portal" element={<EmergencyCoordinatorPortal />} />
      <Route path="/coordinator/overview" element={<EmergencyCoordinatorPortal initialActiveTab="overview" />} />
      <Route path="/coordinator/review" element={<EmergencyCoordinatorPortal initialActiveTab="review" />} />
      <Route path="/coordinator/review/:id" element={<EmergencyCoordinatorPortal initialActiveTab="review" />} />
      <Route path="/coordinator/resources" element={<EmergencyCoordinatorPortal initialActiveTab="resources" />} />
      <Route path="/coordinator/shelters" element={<EmergencyCoordinatorPortal initialActiveTab="shelters" />} />
      <Route path="/coordinator/alerts" element={<EmergencyCoordinatorPortal initialActiveTab="alerts" />} />
      <Route path="/coordinator/reports" element={<EmergencyCoordinatorPortal initialActiveTab="reports" />} />
      <Route path="/coordinator/history" element={<EmergencyCoordinatorPortal initialActiveTab="history" />} />
      <Route path="/coordinator/notifications" element={<EmergencyCoordinatorPortal initialActiveTab="notifications" />} />
      <Route path="/coordinator/settings" element={<EmergencyCoordinatorPortal initialActiveTab="settings" />} />
      <Route path="/emergency-coordinator" element={<EmergencyCoordinatorPortal />} />
      <Route path="/emergency-coordinator/:tab" element={<EmergencyCoordinatorPortal />} />

      <Route path="/dashboard" element={<DashboardOverviewPage />} />
      <Route path="/coordinator/dashboard" element={<DashboardOverviewPage />} />

      <Route path="/coordinator/requests" element={<DashboardOverviewPage />} />
      <Route path="/coordinator/requests/:id" element={<DashboardOverviewPage />} />
      <Route path="/requests/:id" element={<DashboardOverviewPage />} />
      <Route path="/request-detail" element={<DashboardOverviewPage />} />
      <Route path="/map" element={<DashboardOverviewPage />} />
      <Route path="/analytics" element={<DashboardOverviewPage />} />
      <Route path="/reports" element={<DashboardOverviewPage initialTab="reports" />} />
      <Route path="/notifications" element={<DashboardOverviewPage initialTab="notifications" />} />

      {/* Citizen routes */}
      <Route path="/citizen" element={<CitizenPortalPage />} />
      <Route path="/citizen/home" element={<CitizenPortalPage />} />
      <Route path="/citizen/portal" element={<CitizenPortalPage />} />
      <Route path="/citizen/submit" element={<CitizenPortalPage initialTab="request" />} />
      <Route path="/citizen/request" element={<CitizenPortalPage initialTab="request" />} />
      <Route path="/citizen/track" element={<CitizenPortalPage initialTab="requests" />} />
      <Route path="/track" element={<CitizenPortalPage initialTab="requests" />} />
      <Route path="/citizen/shelters" element={<CitizenPortalPage initialTab="shelters" />} />
      <Route path="/citize/shelters" element={<CitizenPortalPage initialTab="shelters" />} />
      <Route path="/shelters" element={<CitizenPortalPage initialTab="shelters" />} />
      <Route path="/citizen/alerts" element={<CitizenPortalPage initialTab="alerts" />} />
      <Route path="/alerts" element={<CitizenPortalPage initialTab="alerts" />} />
      <Route path="/emergency-alerts" element={<CitizenPortalPage initialTab="alerts" />} />
      <Route path="/citizen/safety" element={<CitizenPortalPage initialTab="safety" />} />
      <Route path="/citizen/safety-guide" element={<CitizenPortalPage initialTab="safety" />} />
      <Route path="/citizen/safetyguide" element={<CitizenPortalPage initialTab="safety" />} />
      <Route path="/safety" element={<CitizenPortalPage initialTab="safety" />} />
      <Route path="/safety-guide" element={<CitizenPortalPage initialTab="safety" />} />
      <Route path="/citizen/support" element={<CitizenPortalPage initialTab="support" />} />
      <Route path="/citizen/help" element={<CitizenPortalPage initialTab="support" />} />
      <Route path="/support" element={<CitizenPortalPage initialTab="support" />} />
      <Route path="/help" element={<CitizenPortalPage initialTab="support" />} />
      <Route path="/citizen/profile" element={<CitizenPortalPage initialTab="profile" />} />
      <Route path="/profile" element={<CitizenPortalPage initialTab="profile" />} />
      <Route path="/requests/new" element={<SubmitRequestPage />} />
      <Route path="/assistance-request" element={<SubmitRequestPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/sign-up" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Coordinator routes */}
      <Route path="/ai-ops" element={<AIOperationsContainer initialSubView="overview" />} />
      <Route path="/ai-operations" element={<AIOperationsContainer initialSubView="overview" />} />
      <Route path="/coordinator/ai-ops" element={<AIOperationsContainer initialSubView="overview" />} />
      <Route path="/ai-workspaces" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="workspace" /></ProtectedRoute>} />
      <Route path="/ai-governance" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="governance" /></ProtectedRoute>} />
      <Route path="/coordinator/triage" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><RequestTriagePage /></ProtectedRoute>} />
      <Route path="/coordinator/ai-review" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIDecisionReviewPage /></ProtectedRoute>} />

      {/* Incident / Case Manager routes */}
      <Route path="/case-manager" element={<CaseManagerPortal initialTab="dashboard" />} />
      <Route path="/case-manager/dashboard" element={<CaseManagerPortal initialTab="dashboard" />} />
      <Route path="/case-manager/management" element={<CaseManagerPortal initialTab="management" />} />
      <Route path="/case-manager/cases" element={<CaseManagerPortal initialTab="management" />} />
      <Route path="/case-manager/review" element={<CaseManagerPortal initialTab="review" />} />
      <Route path="/case-manager/communication" element={<CaseManagerPortal initialTab="communication" />} />
      <Route path="/case-manager/reports" element={<CaseManagerPortal initialTab="reports" />} />
      <Route path="/case-manager/profile" element={<CaseManagerPortal initialTab="profile" />} />
      <Route path="/incident/case-manager" element={<CaseManagerPortal initialTab="dashboard" />} />
      <Route path="/incident-case-manager" element={<CaseManagerPortal initialTab="dashboard" />} />
      <Route path="/cases" element={<CaseManagerPortal initialTab="management" />} />

      {/* Logistics routes */}
      <Route path="/logistics/inventory" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'Coordinator', 'Admin']}><ResourceInventoryPage /></ProtectedRoute>} />
      <Route path="/logistics/dispatch" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'Coordinator', 'Admin']}><AllocationDispatchPage /></ProtectedRoute>} />

      {/* Shelter Admin / Shelter Manager Portal (Figma Match) */}
      <Route path="/shelter-admin" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter-admin/dashboard" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter-admin/directory" element={<ShelterAdminDashboard initialTab="directory" />} />
      <Route path="/shelter-admin/capacity" element={<ShelterAdminDashboard initialTab="capacity" />} />
      <Route path="/shelter-admin/placements" element={<ShelterAdminDashboard initialTab="placements" />} />
      <Route path="/shelter-admin/resources" element={<ShelterAdminDashboard initialTab="resources" />} />
      <Route path="/shelter-admin/reports" element={<ShelterAdminDashboard initialTab="reports" />} />
      <Route path="/shelter-manager" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter-manger" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelters/admin" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter-dashboard" element={<ShelterAdminDashboard initialTab="dashboard" />} />

      {/* Volunteer Admin / Volunteer Portal (Figma Match) */}
      <Route path="/volunteer" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteer/dashboard" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteer/overview" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteer/opportunities" element={<VolunteerPortal initialTab="opportunities" />} />
      <Route path="/volunteer/assignments" element={<VolunteerPortal initialTab="assignments" />} />
      <Route path="/volunteer/progress" element={<VolunteerPortal initialTab="progress" />} />
      <Route path="/volunteer/schedule" element={<VolunteerPortal initialTab="schedule" />} />
      <Route path="/volunteer/availability" element={<VolunteerPortal initialTab="schedule" />} />
      <Route path="/volunteer/notifications" element={<VolunteerPortal initialTab="notifications" />} />
      <Route path="/volunteer/profile" element={<VolunteerPortal initialTab="profile" />} />
      <Route path="/volunteer/help" element={<VolunteerPortal initialTab="help" />} />
      <Route path="/volunteer-admin" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteer-admin/dashboard" element={<VolunteerPortal initialTab="overview" />} />

      {/* Legacy Shelter routes */}
      <Route path="/shelters/directory" element={<ProtectedRoute allowedRoles={['Coordinator', 'LogisticsManager', 'Admin', 'ShelterAdministrator', 'ShelterAdmin']}><ShelterDirectoryPage /></ProtectedRoute>} />
      <Route path="/shelters/allocation" element={<ProtectedRoute allowedRoles={['Coordinator', 'LogisticsManager', 'Admin', 'ShelterAdministrator', 'ShelterAdmin']}><EvacueeAllocationPage /></ProtectedRoute>} />

      {/* Legacy Volunteer routes */}
      <Route path="/volunteers/roster" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><VolunteerRosterPage /></ProtectedRoute>} />
      <Route path="/volunteers/assignments" element={<ProtectedRoute allowedRoles={['Coordinator', 'Volunteer', 'Admin']}><TaskAssignmentPage /></ProtectedRoute>} />

      {/* Audit routes */}
      <Route path="/audit" element={<AuditCenterPage />} />
      <Route path="/coordinator/audit" element={<AuditCenterPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

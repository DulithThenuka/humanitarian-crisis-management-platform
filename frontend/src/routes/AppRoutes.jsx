import React, { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { markInAppNavigation } from './roleNavigation';

// ==========================================
// 1. Citizen / Affected Person
// ==========================================
import {
  CitizenPortalPage,
  SubmitRequestPage,
  TrackRequestsPage,
  FindShelterPage,
  EmergencyAlertsPage,
  SafetyGuidePage,
  CitizenSupportPage,
  CitizenProfilePage
} from '../pages/citizen';

// ==========================================
// 2. Emergency Coordinator
// ==========================================
import {
  EmergencyCoordinatorPortal,
  DashboardOverviewPage,
  RequestTriagePage,
  AIDecisionReviewPage,
  AssistanceRequestDetailPage,
  AssistanceRequestsListView,
  AIOperationsContainer
} from '../pages/coordinator-portal';

// ==========================================
// 3. Incident / Case Manager
// ==========================================
import { CaseManagerPortal } from '../pages/incident-manager';

// ==========================================
// 4. Resource & Logistics Manager
// ==========================================
import {
  LogisticsPortalPage,
  ResourceInventoryPage,
  AllocationDispatchPage
} from '../pages/logistics';

// ==========================================
// 5. Shelter Management
// ==========================================
import {
  ShelterAdminDashboard,
  ShelterDirectoryPage,
  EvacueeAllocationPage
} from '../pages/shelter';

// ==========================================
// 6. Volunteer Management
// ==========================================
import {
  VolunteerPortal,
  VolunteerRosterPage,
  TaskAssignmentPage
} from '../pages/volunteer';
import { VolunteerCoordinatorPortal } from '../pages/volunteer-coordinator/VolunteerCoordinatorPortal';

// ==========================================
// 7. Donor & Funding Management
// ==========================================
import {
  DonorPortalPage,
  DonationsPage
} from '../pages/donor';

// ==========================================
// 8. Partner Organisation Management
// ==========================================
import { PartnerPortalPage } from '../pages/partner';

// ==========================================
// 9. System Administration
// ==========================================
import { AdminDashboardPage, AuditCenterPage } from '../pages/admin';

// Public & Security Pages
import {
  LandingHomePage,
  BloomLandingPage,
  PublicCrisisMapPage,
  EmergencyServicesPage,
  CoreCapabilitiesPage,
  EmergencyDirectoryPage
} from '../pages/home';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';

// Partner Organisation Officer Pages
import { PartnerOrganisationOfficerPage } from '../pages/partner-organisation-officer/PartnerOrganisationOfficerPage';

// Donor / Funding Officer Portal
import { DonorFundingOfficerPortal } from '../pages/donor/DonorFundingOfficerPortal';

const NavigationTracker = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      markInAppNavigation();
    }
  }, [location.pathname, location.search]);

  return null;
};

export const AppRoutes = () => {
  return (
    <>
      <NavigationTracker />
      <Routes>
      {/* Public Home & Dedicated Showcase Sections */}
      <Route path="/" element={<LandingHomePage />} />
      <Route path="/home" element={<LandingHomePage />} />
      <Route path="/landing" element={<LandingHomePage />} />
      <Route path="/apogee" element={<Navigate to="/" replace />} />
      <Route path="/bloom" element={<BloomLandingPage />} />
      <Route path="/map" element={<PublicCrisisMapPage />} />
      <Route path="/satellite-map" element={<PublicCrisisMapPage />} />
      <Route path="/services" element={<EmergencyServicesPage />} />
      <Route path="/relief-services" element={<EmergencyServicesPage />} />
      <Route path="/assistance-services" element={<EmergencyServicesPage />} />
      <Route path="/capabilities" element={<CoreCapabilitiesPage />} />
      <Route path="/operations-architecture" element={<CoreCapabilitiesPage />} />
      <Route path="/emergency-directory" element={<EmergencyDirectoryPage />} />
      <Route path="/safety-protocols" element={<EmergencyDirectoryPage />} />

      {/* ========================================================= */}
      {/* MODULE 1: Citizen / Affected Person (/citizen/*)          */}
      {/* ========================================================= */}
      <Route path="/citizen" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenPortalPage /></ProtectedRoute>} />
      <Route path="/citizen/portal" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenPortalPage /></ProtectedRoute>} />
      <Route path="/citizen/home" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenPortalPage /></ProtectedRoute>} />
      <Route path="/citizen/shelters" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><FindShelterPage /></ProtectedRoute>} />
      <Route path="/citizen/requests" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><TrackRequestsPage /></ProtectedRoute>} />
      <Route path="/citizen/requests/new" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><SubmitRequestPage /></ProtectedRoute>} />
      <Route path="/citizen/submit" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><SubmitRequestPage /></ProtectedRoute>} />
      <Route path="/citizen/track" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><TrackRequestsPage /></ProtectedRoute>} />
      <Route path="/citizen/my-requests" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><TrackRequestsPage /></ProtectedRoute>} />
      <Route path="/citizen/alerts" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><EmergencyAlertsPage /></ProtectedRoute>} />
      <Route path="/citizen/safety" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><SafetyGuidePage /></ProtectedRoute>} />
      <Route path="/citizen/safety-guide" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><SafetyGuidePage /></ProtectedRoute>} />
      <Route path="/citizen/support" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenSupportPage /></ProtectedRoute>} />
      <Route path="/citizen/help" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenSupportPage /></ProtectedRoute>} />
      <Route path="/citizen/ai" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenPortalPage initialTab="ai-assistance" /></ProtectedRoute>} />
      <Route path="/citizen/ai-assistance" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenPortalPage initialTab="ai-assistance" /></ProtectedRoute>} />
      <Route path="/citizen/profile" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenProfilePage /></ProtectedRoute>} />

      {/* Legacy / Direct Citizen Aliases */}
      <Route path="/shelters" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><FindShelterPage /></ProtectedRoute>} />
      <Route path="/track" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><TrackRequestsPage /></ProtectedRoute>} />
      <Route path="/my-requests" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><TrackRequestsPage /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><EmergencyAlertsPage /></ProtectedRoute>} />
      <Route path="/emergency-alerts" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><EmergencyAlertsPage /></ProtectedRoute>} />
      <Route path="/safety" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><SafetyGuidePage /></ProtectedRoute>} />
      <Route path="/safety-guide" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><SafetyGuidePage /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenSupportPage /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenSupportPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><CitizenProfilePage /></ProtectedRoute>} />
      <Route path="/requests/new" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><SubmitRequestPage /></ProtectedRoute>} />
      <Route path="/assistance-request" element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']}><SubmitRequestPage /></ProtectedRoute>} />

      {/* ========================================================= */}
      {/* MODULE 2: Emergency Coordinator (/coordinator/*)          */}
      {/* ========================================================= */}
      <Route path="/coordinator" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/coordinator/portal" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/coordinator/overview" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="overview" /></ProtectedRoute>} />
      <Route path="/coordinator/dashboard" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><DashboardOverviewPage /></ProtectedRoute>} />
      <Route path="/coordinator/cases" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="requests" /></ProtectedRoute>} />
      <Route path="/coordinator/cases/:id" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="review" /></ProtectedRoute>} />
      <Route path="/coordinator/review" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="review" /></ProtectedRoute>} />
      <Route path="/coordinator/review/:id" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="review" /></ProtectedRoute>} />
      <Route path="/coordinator/incidents" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="crisis" /></ProtectedRoute>} />
      <Route path="/coordinator/crisis" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="crisis" /></ProtectedRoute>} />
      <Route path="/coordinator/resources" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="resources" /></ProtectedRoute>} />
      <Route path="/coordinator/shelters" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="shelters" /></ProtectedRoute>} />
      <Route path="/coordinator/alerts" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="alerts" /></ProtectedRoute>} />
      <Route path="/coordinator/reports" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="reports" /></ProtectedRoute>} />
      <Route path="/coordinator/history" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="history" /></ProtectedRoute>} />
      <Route path="/coordinator/notifications" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="notifications" /></ProtectedRoute>} />
      <Route path="/coordinator/settings" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="settings" /></ProtectedRoute>} />
      <Route path="/coordinator/ai-support" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal initialActiveTab="ai-support" /></ProtectedRoute>} />
      <Route path="/coordinator/triage" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><RequestTriagePage /></ProtectedRoute>} />
      <Route path="/coordinator/ai-review" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIDecisionReviewPage /></ProtectedRoute>} />
      <Route path="/coordinator/ai-ops" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="overview" /></ProtectedRoute>} />
      <Route path="/coordinator/map" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><DashboardOverviewPage initialTab="map" /></ProtectedRoute>} />
      <Route path="/coordinator/audit" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AuditCenterPage /></ProtectedRoute>} />

      {/* Legacy Coordinator Aliases */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><DashboardOverviewPage /></ProtectedRoute>} />
      <Route path="/emergency-coordinator" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/emergency-coordinator/:tab" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><EmergencyCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/coordinator/requests" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AssistanceRequestsListView /></ProtectedRoute>} />
      <Route path="/coordinator/requests/:id" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AssistanceRequestDetailPage /></ProtectedRoute>} />
      <Route path="/requests/:id" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AssistanceRequestDetailPage /></ProtectedRoute>} />
      <Route path="/request-detail" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AssistanceRequestDetailPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><DashboardOverviewPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><DashboardOverviewPage initialTab="reports" /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><DashboardOverviewPage initialTab="notifications" /></ProtectedRoute>} />
      <Route path="/audit" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AuditCenterPage /></ProtectedRoute>} />
      <Route path="/ai-ops" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="overview" /></ProtectedRoute>} />
      <Route path="/ai-operations" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="overview" /></ProtectedRoute>} />
      <Route path="/ai-workspaces" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="workspace" /></ProtectedRoute>} />
      <Route path="/ai-governance" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="governance" /></ProtectedRoute>} />

      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* MODULE 3: Incident / Case Manager (/incident-manager/*)    */}
      {/* ========================================================= */}
      <Route path="/incident-manager" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/incident-manager/portal" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/incident-manager/dashboard" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/incident-manager/cases" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="management" /></ProtectedRoute>} />
      <Route path="/incident-manager/cases/:id" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="management" /></ProtectedRoute>} />
      <Route path="/incident-manager/review" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="review" /></ProtectedRoute>} />
      <Route path="/incident-manager/communication" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="communication" /></ProtectedRoute>} />
      <Route path="/incident-manager/reports" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="reports" /></ProtectedRoute>} />
      <Route path="/incident-manager/profile" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="profile" /></ProtectedRoute>} />

      {/* Case Manager Backward-Compatible Aliases */}
      <Route path="/case-manager" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/case-manager/dashboard" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/case-manager/management" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="management" /></ProtectedRoute>} />
      <Route path="/case-manager/cases" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="management" /></ProtectedRoute>} />
      <Route path="/case-manager/review" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="review" /></ProtectedRoute>} />
      <Route path="/case-manager/communication" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="communication" /></ProtectedRoute>} />
      <Route path="/case-manager/reports" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="reports" /></ProtectedRoute>} />
      <Route path="/case-manager/profile" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="profile" /></ProtectedRoute>} />
      <Route path="/incident/case-manager" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/incident-case-manager" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/cases" element={<ProtectedRoute allowedRoles={['CaseManager', 'IncidentManager', 'Coordinator', 'Admin']}><CaseManagerPortal initialTab="management" /></ProtectedRoute>} />

      {/* ========================================================= */}
      {/* MODULE 4: Resource & Logistics Manager (/logistics/*)     */}
      {/* ========================================================= */}
      <Route path="/logistics" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="inventory" /></ProtectedRoute>} />
      <Route path="/logistics/dashboard" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="inventory" /></ProtectedRoute>} />
      <Route path="/logistics/inventory" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><ResourceInventoryPage /></ProtectedRoute>} />
      <Route path="/logistics/dispatch" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><AllocationDispatchPage /></ProtectedRoute>} />
      <Route path="/logistics/allocations" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><AllocationDispatchPage /></ProtectedRoute>} />
      <Route path="/logistics/requests" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="requests" /></ProtectedRoute>} />
      <Route path="/logistics/requisitions" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="requests" /></ProtectedRoute>} />
      <Route path="/logistics/depots" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="depots" /></ProtectedRoute>} />
      <Route path="/logistics/warehouses" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="depots" /></ProtectedRoute>} />
      <Route path="/logistics/intake" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="intake" /></ProtectedRoute>} />
      <Route path="/logistics/receiving" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="intake" /></ProtectedRoute>} />
      <Route path="/resource-manager" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="inventory" /></ProtectedRoute>} />
      <Route path="/resource-portal" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="inventory" /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'ResourceManager', 'Coordinator', 'Admin']}><LogisticsPortalPage initialTab="inventory" /></ProtectedRoute>} />

      {/* ========================================================= */}
      {/* MODULE 5: Shelter Management (/shelter/*)                 */}
      {/* ========================================================= */}
      <Route path="/shelter" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/shelter/portal" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/shelter/dashboard" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/shelter/directory" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterDirectoryPage /></ProtectedRoute>} />
      <Route path="/shelter/capacity" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="capacity" /></ProtectedRoute>} />
      <Route path="/shelter/allocations" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><EvacueeAllocationPage /></ProtectedRoute>} />
      <Route path="/shelter/placements" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><EvacueeAllocationPage /></ProtectedRoute>} />
      <Route path="/shelter/resources" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="resources" /></ProtectedRoute>} />
      <Route path="/shelter/reports" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="reports" /></ProtectedRoute>} />

      {/* Shelter Manager Official Routes & Backward-Compatible Aliases */}
      <Route path="/shelter-manager" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/shelter-manager/dashboard" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/shelter-manager/directory" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="directory" /></ProtectedRoute>} />
      <Route path="/shelter-manager/capacity" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="capacity" /></ProtectedRoute>} />
      <Route path="/shelter-manager/placements" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="placements" /></ProtectedRoute>} />
      <Route path="/shelter-manager/resources" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="resources" /></ProtectedRoute>} />
      <Route path="/shelter-manager/reports" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="reports" /></ProtectedRoute>} />
      <Route path="/shelter-manager/*" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/shelter-admin" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/shelter-admin/dashboard" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/shelter-admin/directory" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="directory" /></ProtectedRoute>} />
      <Route path="/shelter-admin/capacity" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="capacity" /></ProtectedRoute>} />
      <Route path="/shelter-admin/placements" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="placements" /></ProtectedRoute>} />
      <Route path="/shelter-admin/resources" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="resources" /></ProtectedRoute>} />
      <Route path="/shelter-admin/reports" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="reports" /></ProtectedRoute>} />
      <Route path="/shelter-manger" element={<Navigate to="/shelter" replace />} />
      <Route path="/shelters/admin" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/shelter-dashboard" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/shelters/directory" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="directory" /></ProtectedRoute>} />
      <Route path="/shelters/allocation" element={<ProtectedRoute allowedRoles={['ShelterManager', 'ShelterAdmin', 'Coordinator', 'Admin']}><ShelterAdminDashboard initialTab="placements" /></ProtectedRoute>} />

      {/* ========================================================= */}
      {/* MODULE 6: Volunteer Management (/volunteer/*)             */}
      {/* ========================================================= */}
      <Route path="/volunteer" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="overview" /></ProtectedRoute>} />
      <Route path="/volunteer/portal" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="overview" /></ProtectedRoute>} />
      <Route path="/volunteer/dashboard" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="overview" /></ProtectedRoute>} />
      <Route path="/volunteer/overview" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="overview" /></ProtectedRoute>} />
      <Route path="/volunteer/opportunities" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="opportunities" /></ProtectedRoute>} />
      <Route path="/volunteer/assignments" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><TaskAssignmentPage /></ProtectedRoute>} />
      <Route path="/volunteer/progress" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="progress" /></ProtectedRoute>} />
      <Route path="/volunteer/schedule" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerRosterPage /></ProtectedRoute>} />
      <Route path="/volunteer/availability" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerRosterPage /></ProtectedRoute>} />
      <Route path="/volunteer/notifications" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="notifications" /></ProtectedRoute>} />
      <Route path="/volunteer/profile" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="profile" /></ProtectedRoute>} />
      <Route path="/volunteer/help" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="help" /></ProtectedRoute>} />
      <Route path="/volunteer/roster" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerRosterPage /></ProtectedRoute>} />

      {/* Volunteer Backward-Compatible Aliases */}
      <Route path="/volunteers" element={<Navigate to="/volunteer" replace />} />
      <Route path="/volunteers/portal" element={<Navigate to="/volunteer" replace />} />
      <Route path="/volunteer-admin" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-admin/dashboard" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-manager" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-manager/dashboard" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-manager/*" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-management" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteers/manager" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteers/dashboard" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="overview" /></ProtectedRoute>} />
      <Route path="/volunteers/roster" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="schedule" /></ProtectedRoute>} />
      <Route path="/volunteers/assignments" element={<ProtectedRoute allowedRoles={['Volunteer', 'VolunteerCoordinator', 'Coordinator', 'Admin']}><VolunteerPortal initialTab="assignments" /></ProtectedRoute>} />

      {/* Volunteer Coordinator Portal */}
      <Route path="/volunteer-coordinator" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-coordinator/*" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-coordinator/dashboard" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-coordinator/directory" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-coordinator/scheduling" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-coordinator/ai-matching" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-coordinator/activity-safety" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-coordinator/reports" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />
      <Route path="/volunteer-coordinator-portal" element={<ProtectedRoute allowedRoles={['VolunteerCoordinator', 'VolunteerManager', 'Coordinator', 'Admin']}><VolunteerCoordinatorPortal /></ProtectedRoute>} />

      {/* ========================================================= */}
      {/* MODULE 7: Donor & Funding Management (/donor/*)           */}
      {/* ========================================================= */}
      <Route path="/donor" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorPortalPage initialTab="overview" /></ProtectedRoute>} />
      <Route path="/donor/portal" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorPortalPage initialTab="overview" /></ProtectedRoute>} />
      <Route path="/donor/dashboard" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorPortalPage initialTab="overview" /></ProtectedRoute>} />
      <Route path="/donor/packages" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorPortalPage initialTab="packages" /></ProtectedRoute>} />
      <Route path="/donor/tracking" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorPortalPage initialTab="tracking" /></ProtectedRoute>} />
      <Route path="/donor/contribute" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorPortalPage initialTab="overview" /></ProtectedRoute>} />

      {/* Donor / Funding Officer Portal Routes */}
      <Route path="/donor/donors" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal initialActiveTab="donors" /></ProtectedRoute>} />
      <Route path="/donor/records" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal initialActiveTab="donations" /></ProtectedRoute>} />
      <Route path="/donor/campaigns" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal initialActiveTab="campaigns" /></ProtectedRoute>} />
      <Route path="/donor/allocations" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal initialActiveTab="allocations" /></ProtectedRoute>} />
      <Route path="/donor/suspicious" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal initialActiveTab="suspicious" /></ProtectedRoute>} />
      <Route path="/donor/reports" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal initialActiveTab="reports" /></ProtectedRoute>} />
      <Route path="/donor-funding-officer" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal /></ProtectedRoute>} />
      <Route path="/funding-officer" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal /></ProtectedRoute>} />
      <Route path="/donor-management" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal initialActiveTab="donors" /></ProtectedRoute>} />

      {/* Donations Backward-Compatible Aliases */}
      <Route path="/donations" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorPortalPage initialTab="overview" /></ProtectedRoute>} />
      <Route path="/donations/portal" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorPortalPage initialTab="overview" /></ProtectedRoute>} />
      <Route path="/donations/legacy" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonationsPage /></ProtectedRoute>} />
      <Route path="/donations/records" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal initialActiveTab="donations" /></ProtectedRoute>} />
      <Route path="/donations/campaigns" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal initialActiveTab="campaigns" /></ProtectedRoute>} />
      <Route path="/donations/allocations" element={<ProtectedRoute allowedRoles={['DonorOfficer', 'Donor', 'Coordinator', 'Admin']}><DonorFundingOfficerPortal initialActiveTab="allocations" /></ProtectedRoute>} />

      {/* ========================================================= */}
      {/* MODULE 8: Partner Organisation Management (/partner/*)    */}
      {/* ========================================================= */}
      <Route path="/partner" element={<ProtectedRoute allowedRoles={['PartnerOfficer', 'Partner', 'Coordinator', 'Admin']}><PartnerPortalPage initialTab="overview" /></ProtectedRoute>} />
      <Route path="/partner/portal" element={<ProtectedRoute allowedRoles={['PartnerOfficer', 'Partner', 'Coordinator', 'Admin']}><PartnerPortalPage initialTab="overview" /></ProtectedRoute>} />
      <Route path="/partner/dashboard" element={<ProtectedRoute allowedRoles={['PartnerOfficer', 'Partner', 'Coordinator', 'Admin']}><PartnerPortalPage initialTab="overview" /></ProtectedRoute>} />
      <Route path="/partner/directory" element={<ProtectedRoute allowedRoles={['PartnerOfficer', 'Partner', 'Coordinator', 'Admin']}><PartnerPortalPage initialTab="directory" /></ProtectedRoute>} />
      <Route path="/partner/commitments" element={<ProtectedRoute allowedRoles={['PartnerOfficer', 'Partner', 'Coordinator', 'Admin']}><PartnerPortalPage initialTab="commitments" /></ProtectedRoute>} />
      <Route path="/partner/zones" element={<ProtectedRoute allowedRoles={['PartnerOfficer', 'Partner', 'Coordinator', 'Admin']}><PartnerPortalPage initialTab="zones" /></ProtectedRoute>} />

      {/* Partner Officer Routes */}
      <Route path="/partner-organisation-officer" element={<ProtectedRoute allowedRoles={['PartnerOfficer', 'Partner', 'Coordinator', 'Admin']}><PartnerOrganisationOfficerPage /></ProtectedRoute>} />
      <Route path="/partner-officer" element={<ProtectedRoute allowedRoles={['PartnerOfficer', 'Partner', 'Coordinator', 'Admin']}><PartnerOrganisationOfficerPage /></ProtectedRoute>} />

      {/* Partner Backward-Compatible Aliases */}
      <Route path="/partners" element={<Navigate to="/partner-organisation-officer" replace />} />
      <Route path="/partners/*" element={<ProtectedRoute allowedRoles={['PartnerOfficer', 'Partner', 'Coordinator', 'Admin']}><PartnerPortalPage initialTab="overview" /></ProtectedRoute>} />
      <Route path="/partner-management" element={<Navigate to="/partner-organisation-officer" replace />} />

      {/* ========================================================= */}
      {/* MODULE 9: System Administration (/admin/*)                 */}
      {/* ========================================================= */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/admin/overview" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="dashboard" /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="users" /></ProtectedRoute>} />
      <Route path="/admin/partners" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="partners" /></ProtectedRoute>} />
      <Route path="/admin/broadcasts" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="broadcasts" /></ProtectedRoute>} />
      <Route path="/admin/health" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="health" /></ProtectedRoute>} />
      <Route path="/admin/crisis" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="crisis" /></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="requests" /></ProtectedRoute>} />
      <Route path="/admin/resources" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="resources" /></ProtectedRoute>} />
      <Route path="/admin/shelters" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="shelters" /></ProtectedRoute>} />
      <Route path="/admin/volunteers" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="volunteers" /></ProtectedRoute>} />
      <Route path="/admin/donations" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="donations" /></ProtectedRoute>} />
      <Route path="/admin/ai-ops" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="ai-ops" /></ProtectedRoute>} />
      <Route path="/admin/maps" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="maps" /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="broadcasts" /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="reports" /></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="audit" /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboardPage initialTab="settings" /></ProtectedRoute>} />
      <Route path="/administration" element={<Navigate to="/admin" replace />} />

      {/* Authentication & Security */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/sign-up" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
};


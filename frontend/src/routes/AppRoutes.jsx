import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

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
import Hero from '../components/Hero';

// Partner Organisation Officer Pages
import { PartnerOrganisationOfficerPage } from '../pages/partner-organisation-officer/PartnerOrganisationOfficerPage';

// Donor / Funding Officer Portal
import { DonorFundingOfficerPortal } from '../pages/donor/DonorFundingOfficerPortal';
export const AppRoutes = () => {
  return (
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
      <Route path="/citizen" element={<CitizenPortalPage />} />
      <Route path="/citizen/portal" element={<CitizenPortalPage />} />
      <Route path="/citizen/home" element={<CitizenPortalPage />} />
      <Route path="/citizen/shelters" element={<CitizenPortalPage initialTab="shelters" />} />
      <Route path="/citizen/requests" element={<CitizenPortalPage initialTab="requests" />} />
      <Route path="/citizen/requests/new" element={<SubmitRequestPage />} />
      <Route path="/citizen/submit" element={<CitizenPortalPage initialTab="request" />} />
      <Route path="/citizen/track" element={<CitizenPortalPage initialTab="requests" />} />
      <Route path="/citizen/alerts" element={<CitizenPortalPage initialTab="alerts" />} />
      <Route path="/citizen/safety" element={<CitizenPortalPage initialTab="safety" />} />
      <Route path="/citizen/safety-guide" element={<CitizenPortalPage initialTab="safety" />} />
      <Route path="/citizen/support" element={<CitizenPortalPage initialTab="support" />} />
      <Route path="/citizen/help" element={<CitizenPortalPage initialTab="support" />} />
      <Route path="/citizen/profile" element={<CitizenPortalPage initialTab="profile" />} />

      {/* Legacy / Direct Citizen Aliases */}
      <Route path="/shelters" element={<CitizenPortalPage initialTab="shelters" />} />
      <Route path="/track" element={<CitizenPortalPage initialTab="requests" />} />
      <Route path="/alerts" element={<CitizenPortalPage initialTab="alerts" />} />
      <Route path="/emergency-alerts" element={<CitizenPortalPage initialTab="alerts" />} />
      <Route path="/safety" element={<CitizenPortalPage initialTab="safety" />} />
      <Route path="/safety-guide" element={<CitizenPortalPage initialTab="safety" />} />
      <Route path="/support" element={<CitizenPortalPage initialTab="support" />} />
      <Route path="/help" element={<CitizenPortalPage initialTab="support" />} />
      <Route path="/profile" element={<CitizenPortalPage initialTab="profile" />} />
      <Route path="/requests/new" element={<SubmitRequestPage />} />
      <Route path="/assistance-request" element={<SubmitRequestPage />} />

      {/* ========================================================= */}
      {/* MODULE 2: Emergency Coordinator (/coordinator/*)          */}
      {/* ========================================================= */}
      <Route path="/coordinator" element={<EmergencyCoordinatorPortal />} />
      <Route path="/coordinator/portal" element={<EmergencyCoordinatorPortal />} />
      <Route path="/coordinator/overview" element={<EmergencyCoordinatorPortal initialActiveTab="overview" />} />
      <Route path="/coordinator/dashboard" element={<DashboardOverviewPage />} />
      <Route path="/coordinator/cases" element={<EmergencyCoordinatorPortal initialActiveTab="requests" />} />
      <Route path="/coordinator/cases/:id" element={<EmergencyCoordinatorPortal initialActiveTab="review" />} />
      <Route path="/coordinator/review" element={<EmergencyCoordinatorPortal initialActiveTab="review" />} />
      <Route path="/coordinator/review/:id" element={<EmergencyCoordinatorPortal initialActiveTab="review" />} />
      <Route path="/coordinator/incidents" element={<EmergencyCoordinatorPortal initialActiveTab="crisis" />} />
      <Route path="/coordinator/crisis" element={<EmergencyCoordinatorPortal initialActiveTab="crisis" />} />
      <Route path="/coordinator/resources" element={<EmergencyCoordinatorPortal initialActiveTab="resources" />} />
      <Route path="/coordinator/shelters" element={<EmergencyCoordinatorPortal initialActiveTab="shelters" />} />
      <Route path="/coordinator/alerts" element={<EmergencyCoordinatorPortal initialActiveTab="alerts" />} />
      <Route path="/coordinator/reports" element={<EmergencyCoordinatorPortal initialActiveTab="reports" />} />
      <Route path="/coordinator/history" element={<EmergencyCoordinatorPortal initialActiveTab="history" />} />
      <Route path="/coordinator/notifications" element={<EmergencyCoordinatorPortal initialActiveTab="notifications" />} />
      <Route path="/coordinator/settings" element={<EmergencyCoordinatorPortal initialActiveTab="settings" />} />
      <Route path="/coordinator/ai-support" element={<EmergencyCoordinatorPortal initialActiveTab="ai-support" />} />
      <Route path="/coordinator/triage" element={<RequestTriagePage />} />
      <Route path="/coordinator/ai-review" element={<AIDecisionReviewPage />} />
      <Route path="/coordinator/ai-ops" element={<AIOperationsContainer initialSubView="overview" />} />
      <Route path="/coordinator/map" element={<DashboardOverviewPage initialTab="map" />} />
      <Route path="/coordinator/audit" element={<AuditCenterPage />} />

      {/* Legacy Coordinator Aliases */}
      <Route path="/dashboard" element={<DashboardOverviewPage />} />
      <Route path="/emergency-coordinator" element={<EmergencyCoordinatorPortal />} />
      <Route path="/emergency-coordinator/:tab" element={<EmergencyCoordinatorPortal />} />
      <Route path="/coordinator/requests" element={<DashboardOverviewPage />} />
      <Route path="/coordinator/requests/:id" element={<DashboardOverviewPage />} />
      <Route path="/requests/:id" element={<DashboardOverviewPage />} />
      <Route path="/request-detail" element={<DashboardOverviewPage />} />
      <Route path="/analytics" element={<DashboardOverviewPage />} />
      <Route path="/reports" element={<DashboardOverviewPage initialTab="reports" />} />
      <Route path="/notifications" element={<DashboardOverviewPage initialTab="notifications" />} />
      <Route path="/audit" element={<AuditCenterPage />} />
      <Route path="/ai-ops" element={<AIOperationsContainer initialSubView="overview" />} />
      <Route path="/ai-operations" element={<AIOperationsContainer initialSubView="overview" />} />
      <Route path="/ai-workspaces" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="workspace" /></ProtectedRoute>} />
      <Route path="/ai-governance" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="governance" /></ProtectedRoute>} />

      {/* ========================================================= */}
      {/* MODULE 3: Incident / Case Manager (/incident-manager/*)    */}
      {/* ========================================================= */}
      <Route path="/incident-manager" element={<CaseManagerPortal initialTab="dashboard" />} />
      <Route path="/incident-manager/portal" element={<CaseManagerPortal initialTab="dashboard" />} />
      <Route path="/incident-manager/dashboard" element={<CaseManagerPortal initialTab="dashboard" />} />
      <Route path="/incident-manager/cases" element={<CaseManagerPortal initialTab="management" />} />
      <Route path="/incident-manager/cases/:id" element={<CaseManagerPortal initialTab="management" />} />
      <Route path="/incident-manager/review" element={<CaseManagerPortal initialTab="review" />} />
      <Route path="/incident-manager/communication" element={<CaseManagerPortal initialTab="communication" />} />
      <Route path="/incident-manager/reports" element={<CaseManagerPortal initialTab="reports" />} />
      <Route path="/incident-manager/profile" element={<CaseManagerPortal initialTab="profile" />} />

      {/* Case Manager Backward-Compatible Aliases */}
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

      {/* ========================================================= */}
      {/* MODULE 4: Resource & Logistics Manager (/logistics/*)     */}
      {/* ========================================================= */}
      <Route path="/logistics" element={<LogisticsPortalPage initialTab="inventory" />} />
      <Route path="/logistics/dashboard" element={<LogisticsPortalPage initialTab="inventory" />} />
      <Route path="/logistics/inventory" element={<LogisticsPortalPage initialTab="inventory" />} />
      <Route path="/logistics/dispatch" element={<LogisticsPortalPage initialTab="dispatch" />} />
      <Route path="/logistics/allocations" element={<LogisticsPortalPage initialTab="dispatch" />} />
      <Route path="/logistics/requests" element={<LogisticsPortalPage initialTab="requests" />} />
      <Route path="/logistics/requisitions" element={<LogisticsPortalPage initialTab="requests" />} />
      <Route path="/logistics/depots" element={<LogisticsPortalPage initialTab="depots" />} />
      <Route path="/logistics/warehouses" element={<LogisticsPortalPage initialTab="depots" />} />
      <Route path="/logistics/intake" element={<LogisticsPortalPage initialTab="intake" />} />
      <Route path="/logistics/receiving" element={<LogisticsPortalPage initialTab="intake" />} />
      <Route path="/resource-manager" element={<LogisticsPortalPage initialTab="inventory" />} />
      <Route path="/resource-portal" element={<LogisticsPortalPage initialTab="inventory" />} />
      <Route path="/resources" element={<LogisticsPortalPage initialTab="inventory" />} />

      {/* ========================================================= */}
      {/* MODULE 5: Shelter Management (/shelter/*)                 */}
      {/* ========================================================= */}
      <Route path="/shelter" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter/portal" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter/dashboard" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter/directory" element={<ShelterAdminDashboard initialTab="directory" />} />
      <Route path="/shelter/capacity" element={<ShelterAdminDashboard initialTab="capacity" />} />
      <Route path="/shelter/allocations" element={<ShelterAdminDashboard initialTab="placements" />} />
      <Route path="/shelter/placements" element={<ShelterAdminDashboard initialTab="placements" />} />
      <Route path="/shelter/resources" element={<ShelterAdminDashboard initialTab="resources" />} />
      <Route path="/shelter/reports" element={<ShelterAdminDashboard initialTab="reports" />} />

      {/* Shelter Manager Backward-Compatible Aliases */}
      <Route path="/shelter-admin" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter-admin/dashboard" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter-admin/directory" element={<ShelterAdminDashboard initialTab="directory" />} />
      <Route path="/shelter-admin/capacity" element={<ShelterAdminDashboard initialTab="capacity" />} />
      <Route path="/shelter-admin/placements" element={<ShelterAdminDashboard initialTab="placements" />} />
      <Route path="/shelter-admin/resources" element={<ShelterAdminDashboard initialTab="resources" />} />
      <Route path="/shelter-admin/reports" element={<ShelterAdminDashboard initialTab="reports" />} />
      <Route path="/shelter-manager" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter-manager/*" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter-manger" element={<Navigate to="/shelter" replace />} />
      <Route path="/shelters/admin" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelter-dashboard" element={<ShelterAdminDashboard initialTab="dashboard" />} />
      <Route path="/shelters/directory" element={<ShelterAdminDashboard initialTab="directory" />} />
      <Route path="/shelters/allocation" element={<ShelterAdminDashboard initialTab="placements" />} />

      {/* ========================================================= */}
      {/* MODULE 6: Volunteer Management (/volunteer/*)             */}
      {/* ========================================================= */}
      <Route path="/volunteer" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteer/portal" element={<VolunteerPortal initialTab="overview" />} />
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
      <Route path="/volunteer/roster" element={<VolunteerPortal initialTab="schedule" />} />

      {/* Volunteer Backward-Compatible Aliases */}
      <Route path="/volunteer-admin" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteer-admin/dashboard" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteer-manager" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteer-manager/dashboard" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteer-manager/*" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteer-management" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteers/manager" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteers/dashboard" element={<VolunteerPortal initialTab="overview" />} />
      <Route path="/volunteers/roster" element={<VolunteerPortal initialTab="schedule" />} />
      <Route path="/volunteers/assignments" element={<VolunteerPortal initialTab="assignments" />} />

      {/* Volunteer Coordinator Portal */}
      <Route path="/volunteer-coordinator" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/*" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/dashboard" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/directory" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/scheduling" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/ai-matching" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/activity-safety" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/reports" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator-portal" element={<VolunteerCoordinatorPortal />} />

      {/* ========================================================= */}
      {/* MODULE 7: Donor & Funding Management (/donor/*)           */}
      {/* ========================================================= */}
      <Route path="/donor" element={<DonorPortalPage initialTab="overview" />} />
      <Route path="/donor/portal" element={<DonorPortalPage initialTab="overview" />} />
      <Route path="/donor/dashboard" element={<DonorPortalPage initialTab="overview" />} />
      <Route path="/donor/packages" element={<DonorPortalPage initialTab="packages" />} />
      <Route path="/donor/tracking" element={<DonorPortalPage initialTab="tracking" />} />
      <Route path="/donor/contribute" element={<DonorPortalPage initialTab="overview" />} />

      {/* Donor / Funding Officer Portal Routes */}
      <Route path="/donor/donors" element={<DonorFundingOfficerPortal initialActiveTab="donors" />} />
      <Route path="/donor/records" element={<DonorFundingOfficerPortal initialActiveTab="donations" />} />
      <Route path="/donor/campaigns" element={<DonorFundingOfficerPortal initialActiveTab="campaigns" />} />
      <Route path="/donor/allocations" element={<DonorFundingOfficerPortal initialActiveTab="allocations" />} />
      <Route path="/donor/suspicious" element={<DonorFundingOfficerPortal initialActiveTab="suspicious" />} />
      <Route path="/donor/reports" element={<DonorFundingOfficerPortal initialActiveTab="reports" />} />
      <Route path="/donor-funding-officer" element={<DonorFundingOfficerPortal />} />
      <Route path="/funding-officer" element={<DonorFundingOfficerPortal />} />
      <Route path="/donor-management" element={<DonorFundingOfficerPortal initialActiveTab="donors" />} />

      {/* Donations Backward-Compatible Aliases */}
      <Route path="/donations" element={<DonorPortalPage initialTab="overview" />} />
      <Route path="/donations/portal" element={<DonorPortalPage initialTab="overview" />} />
      <Route path="/donations/legacy" element={<DonationsPage />} />
      <Route path="/donations/records" element={<DonorFundingOfficerPortal initialActiveTab="donations" />} />
      <Route path="/donations/campaigns" element={<DonorFundingOfficerPortal initialActiveTab="campaigns" />} />
      <Route path="/donations/allocations" element={<DonorFundingOfficerPortal initialActiveTab="allocations" />} />

      {/* ========================================================= */}
      {/* MODULE 8: Partner Organisation Management (/partner/*)    */}
      {/* ========================================================= */}
      <Route path="/partner" element={<PartnerPortalPage initialTab="overview" />} />
      <Route path="/partner/portal" element={<PartnerPortalPage initialTab="overview" />} />
      <Route path="/partner/dashboard" element={<PartnerPortalPage initialTab="overview" />} />
      <Route path="/partner/directory" element={<PartnerPortalPage initialTab="directory" />} />
      <Route path="/partner/commitments" element={<PartnerPortalPage initialTab="commitments" />} />
      <Route path="/partner/zones" element={<PartnerPortalPage initialTab="zones" />} />

      {/* Partner Officer Routes */}
      <Route path="/partner-organisation-officer" element={<PartnerOrganisationOfficerPage />} />
      <Route path="/partner-officer" element={<PartnerOrganisationOfficerPage />} />

      {/* Partner Backward-Compatible Aliases */}
      <Route path="/partners" element={<Navigate to="/partner" replace />} />
      <Route path="/partners/*" element={<PartnerPortalPage initialTab="overview" />} />
      <Route path="/partner-management" element={<Navigate to="/partner" replace />} />

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
  );
};


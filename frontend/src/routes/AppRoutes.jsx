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

// Volunteers Pages
import { VolunteerRosterPage } from '../pages/volunteers/VolunteerRosterPage';
import { TaskAssignmentPage } from '../pages/volunteers/TaskAssignmentPage';

// Map & Analytics
import { OperationalMapView } from '../pages/map/OperationalMapView';
import { ReportsAnalyticsView } from '../pages/reports-and-analysis/ReportsAnalyticsView';

import { AuditCenterPage } from '../pages/audit/AuditCenterPage';
import { AIOperationsContainer } from '../pages/ai-operations/AIOperationsContainer';
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingHomePage />} />
      <Route path="/home" element={<LandingHomePage />} />
      <Route path="/landing" element={<LandingHomePage />} />
      <Route path="/dashboard" element={<DashboardOverviewPage />} />
      <Route path="/coordinator/dashboard" element={<DashboardOverviewPage />} />
      <Route path="/coordinator/requests" element={<DashboardOverviewPage />} />
      <Route path="/coordinator/requests/:id" element={<DashboardOverviewPage />} />
      <Route path="/requests/:id" element={<DashboardOverviewPage />} />
      <Route path="/request-detail" element={<DashboardOverviewPage />} />
      <Route path="/map" element={<DashboardOverviewPage />} />
      <Route path="/reports" element={<DashboardOverviewPage />} />
      <Route path="/analytics" element={<DashboardOverviewPage />} />
      <Route path="/coordinator/reports" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><DashboardOverviewPage initialTab="reports" /></ProtectedRoute>} />
      <Route path="/reports" element={<DashboardOverviewPage initialTab="reports" />} />
      
      {/* Citizen routes */}
      <Route path="/citizen" element={<CitizenPortalPage />} />
      <Route path="/citizen/home" element={<CitizenPortalPage />} />
      <Route path="/citizen/portal" element={<CitizenPortalPage />} />
      <Route path="/citizen/submit" element={<CitizenPortalPage initialTab="request" />} />
      <Route path="/citizen/track" element={<CitizenPortalPage initialTab="requests" />} />
      <Route path="/citizen/shelters" element={<CitizenPortalPage initialTab="shelters" />} />
      <Route path="/citizen/alerts" element={<CitizenPortalPage initialTab="home" />} />
      <Route path="/requests/new" element={<SubmitRequestPage />} />
      <Route path="/assistance-request" element={<SubmitRequestPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Coordinator routes */}
      <Route path="/ai-ops" element={<DashboardOverviewPage initialTab="ai-ops" />} />
      <Route path="/ai-operations" element={<DashboardOverviewPage initialTab="ai-ops" />} />
      <Route path="/coordinator/ai-ops" element={<DashboardOverviewPage initialTab="ai-ops" />} />
      <Route path="/ai-workspaces" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="workspace" /></ProtectedRoute>} />
      <Route path="/ai-governance" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIOperationsContainer initialSubView="governance" /></ProtectedRoute>} />
      <Route path="/coordinator/triage" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><RequestTriagePage /></ProtectedRoute>} />
      <Route path="/coordinator/ai-review" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><AIDecisionReviewPage /></ProtectedRoute>} />

      {/* Logistics routes */}
      <Route path="/logistics/inventory" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'Coordinator', 'Admin']}><ResourceInventoryPage /></ProtectedRoute>} />
      <Route path="/logistics/dispatch" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'Coordinator', 'Admin']}><AllocationDispatchPage /></ProtectedRoute>} />

      {/* Shelter routes */}
      <Route path="/shelters/directory" element={<ProtectedRoute allowedRoles={['Coordinator', 'LogisticsManager', 'Admin']}><ShelterDirectoryPage /></ProtectedRoute>} />
      <Route path="/shelters/allocation" element={<ProtectedRoute allowedRoles={['Coordinator', 'LogisticsManager', 'Admin']}><EvacueeAllocationPage /></ProtectedRoute>} />

      {/* Volunteer routes */}
      <Route path="/volunteers/roster" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><VolunteerRosterPage /></ProtectedRoute>} />
      <Route path="/volunteers/assignments" element={<ProtectedRoute allowedRoles={['Coordinator', 'Volunteer', 'Admin']}><TaskAssignmentPage /></ProtectedRoute>} />

      {/* Audit routes */}
      <Route path="/audit" element={<AuditCenterPage />} />
      <Route path="/coordinator/audit" element={<AuditCenterPage />} />
      <Route path="/coordinator/alerts" element={<Navigate to="/coordinator/dashboard" replace />} />
      <Route path="/citizen/alerts" element={<Navigate to="/citizen" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

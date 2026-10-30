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
      
      {/* Citizen routes */}
      <Route path="/citizen" element={<CitizenPortalPage />} />
      <Route path="/citizen/home" element={<CitizenPortalPage />} />
      <Route path="/citizen/portal" element={<CitizenPortalPage />} />
      <Route path="/citizen/submit" element={<SubmitRequestPage />} />
      <Route path="/citizen/track" element={<TrackRequestsPage />} />
      <Route path="/citizen/shelters" element={<FindShelterPage />} />
      <Route path="/citizen/alerts" element={<CitizenPortalPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Coordinator routes */}
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

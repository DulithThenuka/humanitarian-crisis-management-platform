import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

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

// Logistics Pages
import { ResourceInventoryPage } from '../pages/logistics/ResourceInventoryPage';
import { AllocationDispatchPage } from '../pages/logistics/AllocationDispatchPage';

// Shelters Pages
import { ShelterDirectoryPage } from '../pages/shelters/ShelterDirectoryPage';
import { EvacueeAllocationPage } from '../pages/shelters/EvacueeAllocationPage';

// Volunteers Pages
<<<<<<< Updated upstream
=======
import { VolunteerPortal } from '../pages/volunteer/VolunteerPortal';
import { VolunteerCoordinatorPortal } from '../pages/volunteer-coordinator/VolunteerCoordinatorPortal';
>>>>>>> Stashed changes
import { VolunteerRosterPage } from '../pages/volunteers/VolunteerRosterPage';
import { TaskAssignmentPage } from '../pages/volunteers/TaskAssignmentPage';

import { AuditCenterPage } from '../pages/audit/AuditCenterPage';
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardOverviewPage />} />
      <Route path="/dashboard" element={<DashboardOverviewPage />} />
      <Route path="/coordinator/dashboard" element={<DashboardOverviewPage />} />
      
      {/* Citizen routes */}
      <Route path="/citizen" element={<CitizenPortalPage />} />
      <Route path="/citizen/home" element={<CitizenPortalPage />} />
      <Route path="/citizen/portal" element={<CitizenPortalPage />} />
      <Route path="/citizen/submit" element={<SubmitRequestPage />} />
      <Route path="/citizen/track" element={<TrackRequestsPage />} />
      <Route path="/citizen/shelters" element={<FindShelterPage />} />

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

<<<<<<< Updated upstream
      {/* Volunteer routes */}
=======
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

      {/* Volunteer Coordinator Portal (Figma Match) */}
      <Route path="/volunteer-coordinator" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/dashboard" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/directory" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/scheduling" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/ai-matching" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/activity-safety" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator/reports" element={<VolunteerCoordinatorPortal />} />
      <Route path="/volunteer-coordinator-portal" element={<VolunteerCoordinatorPortal />} />

      {/* Legacy Shelter routes */}
      <Route path="/shelters/directory" element={<ProtectedRoute allowedRoles={['Coordinator', 'LogisticsManager', 'Admin', 'ShelterAdministrator', 'ShelterAdmin']}><ShelterDirectoryPage /></ProtectedRoute>} />
      <Route path="/shelters/allocation" element={<ProtectedRoute allowedRoles={['Coordinator', 'LogisticsManager', 'Admin', 'ShelterAdministrator', 'ShelterAdmin']}><EvacueeAllocationPage /></ProtectedRoute>} />

      {/* Legacy Volunteer routes */}
>>>>>>> Stashed changes
      <Route path="/volunteers/roster" element={<ProtectedRoute allowedRoles={['Coordinator', 'Admin']}><VolunteerRosterPage /></ProtectedRoute>} />
      <Route path="/volunteers/assignments" element={<ProtectedRoute allowedRoles={['Coordinator', 'Volunteer', 'Admin']}><TaskAssignmentPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/audit" element={<AuditCenterPage />} />
      <Route path="/coordinator/audit" element={<AuditCenterPage />} />
    </Routes>
  );
};

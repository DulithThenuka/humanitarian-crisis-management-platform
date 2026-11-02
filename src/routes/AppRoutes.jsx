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

// Volunteers Pages (Admin/Coordinator Roster + Client Portal)
import { VolunteerRosterPage } from '../pages/volunteers/VolunteerRosterPage';
import { TaskAssignmentPage } from '../pages/volunteers/TaskAssignmentPage';
import { ClientVolunteerPortalPage } from '../pages/volunteers/ClientVolunteerPortalPage'; // අලුතින් එකතු කළ Client Volunteer Portal එක

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
      <Route path="/coordinator/triage" element={<ProtectedRoute allowedRoles={['Coordinator', 'Emergency Coordinator', 'Admin']}><RequestTriagePage /></ProtectedRoute>} />
      <Route path="/coordinator/ai-review" element={<ProtectedRoute allowedRoles={['Coordinator', 'Emergency Coordinator', 'Admin']}><AIDecisionReviewPage /></ProtectedRoute>} />

      {/* Logistics routes */}
      <Route path="/logistics/inventory" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'Logistics Manager', 'Coordinator', 'Emergency Coordinator', 'Admin']}><ResourceInventoryPage /></ProtectedRoute>} />
      <Route path="/logistics/dispatch" element={<ProtectedRoute allowedRoles={['LogisticsManager', 'Logistics Manager', 'Coordinator', 'Emergency Coordinator', 'Admin']}><AllocationDispatchPage /></ProtectedRoute>} />

      {/* Shelter routes */}
      <Route path="/shelters/directory" element={<ProtectedRoute allowedRoles={['Coordinator', 'Emergency Coordinator', 'LogisticsManager', 'Logistics Manager', 'Admin']}><ShelterDirectoryPage /></ProtectedRoute>} />
      <Route path="/shelters/allocation" element={<ProtectedRoute allowedRoles={['Coordinator', 'Emergency Coordinator', 'LogisticsManager', 'Logistics Manager', 'Admin']}><EvacueeAllocationPage /></ProtectedRoute>} />

      {/* Volunteer Public/Client Routes (Public Portal for Volunteers) */}
      <Route path="/volunteer/register" element={<ClientVolunteerPortalPage />} />
      <Route path="/citizen/volunteer" element={<ClientVolunteerPortalPage />} />

      {/* Volunteer Admin/Coordinator Routes */}
      <Route path="/volunteers/roster" element={<ProtectedRoute allowedRoles={['Coordinator', 'Emergency Coordinator', 'Admin']}><VolunteerRosterPage /></ProtectedRoute>} />
      <Route path="/coordinator/volunteers" element={<ProtectedRoute allowedRoles={['Coordinator', 'Emergency Coordinator', 'Admin']}><VolunteerRosterPage /></ProtectedRoute>} />
      <Route path="/volunteers/assignments" element={<ProtectedRoute allowedRoles={['Coordinator', 'Emergency Coordinator', 'Volunteer', 'Admin']}><TaskAssignmentPage /></ProtectedRoute>} />

      {/* Audit routes */}
      <Route path="/audit" element={<AuditCenterPage />} />
      <Route path="/coordinator/audit" element={<AuditCenterPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
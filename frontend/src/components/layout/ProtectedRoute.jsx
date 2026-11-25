import React from 'react';
import { Navigate, useLocation, useNavigationType } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import {
  isRoleAllowed,
  resolveAuthorizedRoute,
  hasNavigatedInSession
} from '../../routes/roleNavigation';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigationType = useNavigationType();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!token || !user || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = isRoleAllowed(user?.role, allowedRoles);

    if (!isAllowed) {
      // If arrival on this unauthorized route was triggered by browser history traversal
      // (Back / Forward button pop) within an active app session, safely redirect the user
      // to their authorized dashboard rather than unexpectedly showing a 403 Access Denied page.
      if (navigationType === 'POP' && hasNavigatedInSession()) {
        const authorizedDashboard = resolveAuthorizedRoute(user?.role);
        if (location.pathname !== authorizedDashboard) {
          return <Navigate to={authorizedDashboard} replace />;
        }
        return <Navigate to="/" replace />;
      }

      // Genuine direct or forward unauthorized access
      return (
        <Navigate
          to="/unauthorized"
          state={{
            attemptedPath: location.pathname,
            userRole: user?.role,
            isBackNavigation: false
          }}
          replace
        />
      );
    }
  }

  return children;
};

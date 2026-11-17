import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!token || !user || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRoleStr = String(user?.role || '').toLowerCase();
    const isAllowed = allowedRoles.some((role) => {
      const allowedStr = String(role || '').toLowerCase();
      return (
        allowedStr === userRoleStr ||
        (allowedStr === 'admin' && (userRoleStr === '4' || user?.role === 4)) ||
        (allowedStr === 'coordinator' && (userRoleStr === '1' || user?.role === 1)) ||
        (allowedStr === 'logisticsmanager' && (userRoleStr === '2' || user?.role === 2)) ||
        (allowedStr === 'volunteer' && (userRoleStr === '3' || user?.role === 3)) ||
        (allowedStr === 'citizen' && (userRoleStr === '0' || user?.role === 0))
      );
    });

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

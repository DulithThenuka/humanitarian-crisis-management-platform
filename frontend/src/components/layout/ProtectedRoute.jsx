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
    const userRoleNormalized = userRoleStr.replace(/[\s_\/-]/g, '');

    const isAllowed = allowedRoles.some((role) => {
      const allowedStr = String(role || '').toLowerCase();
      const allowedNormalized = allowedStr.replace(/[\s_\/-]/g, '');

      return (
        allowedStr === userRoleStr ||
        allowedNormalized === userRoleNormalized ||
        (allowedNormalized === 'admin' && (userRoleNormalized === '4' || user?.role === 4 || userRoleNormalized.includes('admin'))) ||
        (allowedNormalized === 'coordinator' && (userRoleNormalized === '1' || user?.role === 1 || userRoleNormalized.includes('coordinator'))) ||
        ((allowedNormalized === 'logisticsmanager' || allowedNormalized === 'resourcemanager') &&
          (userRoleNormalized === '2' || user?.role === 2 || userRoleNormalized.includes('logistics') || userRoleNormalized.includes('resource'))) ||
        (allowedNormalized === 'volunteer' && (userRoleNormalized === '3' || user?.role === 3)) ||
        (allowedNormalized === 'citizen' && (userRoleNormalized === '0' || user?.role === 0)) ||
        (allowedNormalized === 'casemanager' && (userRoleNormalized === '5' || user?.role === 5 || userRoleNormalized.includes('case'))) ||
        (allowedNormalized === 'sheltermanager' && (userRoleNormalized === '6' || user?.role === 6 || userRoleNormalized.includes('shelter')))
      );
    });

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

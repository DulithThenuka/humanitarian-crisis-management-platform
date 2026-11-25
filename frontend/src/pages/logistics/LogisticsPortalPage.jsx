import React from 'react';
import { ResourceManagerPortal } from './ResourceManagerPortal';

export const LogisticsPortalPage = ({ initialTab = 'overview' }) => {
  return <ResourceManagerPortal initialActiveTab={initialTab} />;
};

export default LogisticsPortalPage;

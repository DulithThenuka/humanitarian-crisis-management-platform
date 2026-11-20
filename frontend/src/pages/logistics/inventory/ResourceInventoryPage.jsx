import React from 'react';
import { ResourceManagerPortal } from '../ResourceManagerPortal';

export const ResourceInventoryPage = (props) => {
  return <ResourceManagerPortal initialActiveTab="inventory" {...props} />;
};

export default ResourceInventoryPage;

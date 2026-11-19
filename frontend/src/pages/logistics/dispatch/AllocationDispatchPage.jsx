import React from 'react';
import { ResourceManagerPortal } from '../ResourceManagerPortal';

export const AllocationDispatchPage = (props) => {
  return <ResourceManagerPortal initialActiveTab="dispatch" {...props} />;
};

export default AllocationDispatchPage;

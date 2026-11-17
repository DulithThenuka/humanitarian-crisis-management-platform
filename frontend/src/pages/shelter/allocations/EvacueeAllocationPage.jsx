import React from 'react';
import { ShelterAdminDashboard } from '../ShelterAdminDashboard';

export const EvacueeAllocationPage = (props) => {
  return <ShelterAdminDashboard initialTab="placements" {...props} />;
};

export default EvacueeAllocationPage;

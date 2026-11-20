import React from 'react';
import { ShelterAdminDashboard } from '../ShelterAdminDashboard';

export const ShelterDirectoryPage = (props) => {
  return <ShelterAdminDashboard initialTab="directory" {...props} />;
};

export default ShelterDirectoryPage;

import React from 'react';
import { DonorFundingOfficerPortal } from './DonorFundingOfficerPortal';

export const DonorPortalPage = ({ initialTab = 'dashboard' }) => {
  let mappedTab = initialTab;
  if (initialTab === 'overview' || initialTab === 'packages' || initialTab === 'tracking') {
    mappedTab = 'dashboard';
  }
  return <DonorFundingOfficerPortal initialActiveTab={mappedTab} />;
};

export default DonorPortalPage;

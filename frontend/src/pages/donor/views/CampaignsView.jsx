import React from 'react';
import { DonorManagementView } from './DonorManagementView';

export const CampaignsView = (props) => {
  return (
    <DonorManagementView
      {...props}
      title="Campaigns"
      searchPlaceholder="Search campaigns..."
    />
  );
};

export default CampaignsView;

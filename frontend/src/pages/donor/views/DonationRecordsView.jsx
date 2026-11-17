import React from 'react';
import { DonorManagementView } from './DonorManagementView';

export const DonationRecordsView = (props) => {
  return (
    <DonorManagementView
      {...props}
      title="Donation Records"
      searchPlaceholder="Search donation records..."
    />
  );
};

export default DonationRecordsView;

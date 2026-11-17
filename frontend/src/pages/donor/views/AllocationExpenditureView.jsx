import React from 'react';
import { DonorManagementView } from './DonorManagementView';

export const AllocationExpenditureView = (props) => {
  return (
    <DonorManagementView
      {...props}
      title="Allocation & Expenditure"
      searchPlaceholder="Search allocation & expenditure..."
    />
  );
};

export default AllocationExpenditureView;

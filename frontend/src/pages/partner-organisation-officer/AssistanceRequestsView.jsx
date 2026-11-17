import React from 'react';
import { OrganisationProfileView } from './OrganisationProfileView';

export const AssistanceRequestsView = (props) => {
  return (
    <OrganisationProfileView
      {...props}
      title="Assistance Requests"
      searchPlaceholder="Search assistance requests..."
    />
  );
};

export default AssistanceRequestsView;

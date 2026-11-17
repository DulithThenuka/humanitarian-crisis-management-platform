import React from 'react';
import { OrganisationProfileView } from './OrganisationProfileView';

export const ResourceContributionsView = (props) => {
  return (
    <OrganisationProfileView
      {...props}
      title="Resource Contributions"
      searchPlaceholder="Search resource contributions..."
    />
  );
};

export default ResourceContributionsView;

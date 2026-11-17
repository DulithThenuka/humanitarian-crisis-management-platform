import React from 'react';
import { PartnerOrganisationOfficerPage } from '../partner-organisation-officer/PartnerOrganisationOfficerPage';

export const PartnerPortalPage = ({ initialTab = 'dashboard' }) => {
  let mappedTab = initialTab;
  if (initialTab === 'overview' || initialTab === 'directory' || initialTab === 'commitments' || initialTab === 'zones') {
    mappedTab = 'dashboard';
  }
  return <PartnerOrganisationOfficerPage initialActiveTab={mappedTab} />;
};

export default PartnerPortalPage;

import React from 'react';
import { PartnerOrganisationOfficerPage } from '../partner-organisation-officer/PartnerOrganisationOfficerPage';

export const PartnerPortalPage = ({ initialTab = 'dashboard' }) => {
  let mappedTab = initialTab;
  if (initialTab === 'overview') mappedTab = 'dashboard';
  else if (initialTab === 'directory') mappedTab = 'profile';
  else if (initialTab === 'commitments') mappedTab = 'contributions';
  else if (initialTab === 'zones') mappedTab = 'coordination';
  return <PartnerOrganisationOfficerPage initialActiveTab={mappedTab} />;
};

export default PartnerPortalPage;

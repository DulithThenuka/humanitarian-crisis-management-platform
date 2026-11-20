import React from 'react';
import { VolunteerPortal } from '../VolunteerPortal';

export const VolunteerRosterPage = (props) => {
  return <VolunteerPortal initialTab="schedule" {...props} />;
};

export default VolunteerRosterPage;

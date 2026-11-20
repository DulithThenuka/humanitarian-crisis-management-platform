import React from 'react';
import { VolunteerPortal } from '../VolunteerPortal';

export const TaskAssignmentPage = (props) => {
  return <VolunteerPortal initialTab="assignments" {...props} />;
};

export default TaskAssignmentPage;

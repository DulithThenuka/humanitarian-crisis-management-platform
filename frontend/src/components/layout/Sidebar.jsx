import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const links = [
    // 1. Citizen / Affected Person
    { label: 'Citizen Portal', to: '/citizen', roles: ['Citizen', 'Coordinator', 'Admin'] },
    { label: 'Emergency Shelters', to: '/citizen/shelters', roles: ['Citizen', 'Coordinator', 'LogisticsManager', 'Volunteer', 'Admin'] },
    { label: 'Submit SOS Request', to: '/citizen/submit', roles: ['Citizen', 'Coordinator', 'Admin'] },
    { label: 'Track Requests', to: '/citizen/track', roles: ['Citizen', 'Coordinator', 'Admin'] },

    // 2. Emergency Coordinator
    { label: 'Coordinator Command HQ', to: '/coordinator', roles: ['Coordinator', 'Admin'] },
    { label: 'Operations Cockpit', to: '/coordinator/dashboard', roles: ['Coordinator', 'Admin'] },
    { label: 'Request Triage Queue', to: '/coordinator/cases', roles: ['Coordinator', 'Admin'] },
    { label: 'AI Review & Governance', to: '/coordinator/review', roles: ['Coordinator', 'Admin'] },

    // 3. Incident / Case Manager
    { label: 'Incident Case Manager', to: '/incident-manager', roles: ['Coordinator', 'Admin'] },

    // 4. Resource & Logistics Manager
    { label: 'Resource Inventory', to: '/logistics/inventory', roles: ['LogisticsManager', 'Coordinator', 'Admin'] },
    { label: 'Supply Fleet Dispatch', to: '/logistics/dispatch', roles: ['LogisticsManager', 'Coordinator', 'Admin'] },

    // 5. Shelter Management
    { label: 'Shelter Manager Portal', to: '/shelter', roles: ['ShelterAdministrator', 'ShelterAdmin', 'Coordinator', 'Admin'] },
    { label: 'Shelter Directory', to: '/shelter/directory', roles: ['Coordinator', 'LogisticsManager', 'Admin', 'ShelterAdministrator', 'ShelterAdmin'] },
    { label: 'Evacuee Placements', to: '/shelter/allocations', roles: ['Coordinator', 'LogisticsManager', 'Admin', 'ShelterAdministrator', 'ShelterAdmin'] },

    // 6. Volunteer Management
    { label: 'Volunteer Portal', to: '/volunteer', roles: ['Coordinator', 'Volunteer', 'Admin'] },
    { label: 'Volunteer Coordinator', to: '/volunteer-coordinator', roles: ['Coordinator', 'Admin'] },
    { label: 'Volunteer Roster', to: '/volunteer/roster', roles: ['Coordinator', 'Admin'] },
    { label: 'Task Assignments', to: '/volunteers/assignments', roles: ['Coordinator', 'Volunteer', 'Admin'] },

    // 7. Donor & Funding Management
    { label: 'Donor & Funding Portal', to: '/donor', roles: ['Coordinator', 'Admin', 'LogisticsManager', 'Volunteer', 'Citizen'] },

    // 8. Partner Organisation Management
    { label: 'Partner Organisation Portal', to: '/partner', roles: ['Coordinator', 'Admin', 'LogisticsManager'] },
    { label: 'Partner Officer Portal', to: '/partner-organisation-officer', roles: ['PartnerOfficer', 'PartnerOrganisationOfficer', 'Coordinator', 'Admin', 'LogisticsManager'] },

    // 9. Notifications & Platform Administration
    { label: 'Notifications', to: '/coordinator/notifications', roles: ['Coordinator', 'Admin'] },
    { label: 'Platform Administration', to: '/admin', roles: ['Admin'] },
  ];

  const allowedLinks = links.filter(l => !role || l.roles.includes(role));

  return (
    <aside style={{
      width: '260px',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      backgroundColor: '#14291e',
      padding: '20px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ padding: '4px 8px 16px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={20} color="#dbe4c6" />
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>HumanAid</div>
            <div style={{ fontSize: '10px', color: '#9fa89e' }}>Response coordination</div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: '#738075', padding: '0 12px 6px 12px', letterSpacing: '0.06em' }}>
        Navigation
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {allowedLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'block',
              padding: '9px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#162e20' : '#bcc5b9',
              backgroundColor: isActive ? '#dbe4c6' : 'transparent',
              transition: 'all 0.15s ease'
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';

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
    { label: 'Donor & Funding Portal', to: '/donor', roles: ['Coordinator', 'LogisticsManager', 'Admin', 'Citizen'] },

    // 8. Partner Organisation Management
    { label: 'Partner Organisation Portal', to: '/partner', roles: ['Coordinator', 'Admin', 'LogisticsManager'] },

    // 9. System Administration
    { label: 'Platform Administration', to: '/admin', roles: ['Admin'] },
  ];

  const allowedLinks = links.filter(l => !role || l.roles.includes(role));

  return (
    <aside style={{
      width: '260px',
      borderRight: '1px solid #334155',
      backgroundColor: '#0f172a',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }}>
      <div style={{ padding: '4px 8px 18px 8px', borderBottom: '1px solid rgba(51, 65, 85, 0.6)', marginBottom: '10px' }}>
        <img
          src={reliefcoreLogoWhite}
          alt="RELIEFCORE"
          style={{ height: '34px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
        />
      </div>
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', padding: '0 12px 10px 12px' }}>
        Navigation
      </div>
      {allowedLinks.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          style={({ isActive }) => ({
            display: 'block',
            padding: '10px 14px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '13.5px',
            fontWeight: isActive ? 700 : 500,
            color: isActive ? '#38bdf8' : '#94a3b8',
            backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
            transition: 'all 0.15s ease'
          })}
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
};

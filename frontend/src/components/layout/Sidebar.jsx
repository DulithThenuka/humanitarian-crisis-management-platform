import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const links = [
    { label: 'Citizen Portal', to: '/citizen/submit', roles: ['Citizen', 'Coordinator', 'Admin'] },
    { label: 'My Requests', to: '/citizen/track', roles: ['Citizen', 'Coordinator', 'Admin'] },
    { label: 'Find Shelters', to: '/citizen/shelters', roles: ['Citizen', 'Coordinator', 'LogisticsManager', 'Volunteer', 'Admin'] },
    { label: 'Emergency Overview', to: '/coordinator/dashboard', roles: ['Coordinator', 'Admin'] },
    { label: 'Request Triage', to: '/coordinator/triage', roles: ['Coordinator', 'Admin'] },
    { label: 'AI Review & Governance', to: '/coordinator/ai-review', roles: ['Coordinator', 'Admin'] },
    { label: 'Resource Inventory', to: '/logistics/inventory', roles: ['LogisticsManager', 'Coordinator', 'Admin'] },
    { label: 'Supply Dispatch', to: '/logistics/dispatch', roles: ['LogisticsManager', 'Coordinator', 'Admin'] },
    { label: 'Shelter Directory', to: '/shelters/directory', roles: ['Coordinator', 'LogisticsManager', 'Admin'] },
    { label: 'Evacuee Allocation', to: '/shelters/allocation', roles: ['Coordinator', 'LogisticsManager', 'Admin'] },
    { label: 'Volunteer Roster', to: '/volunteers/roster', roles: ['Coordinator', 'Admin'] },
    { label: 'Task Assignments', to: '/volunteers/assignments', roles: ['Coordinator', 'Volunteer', 'Admin'] },
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
            fontSize: '13px',
            fontWeight: 500,
            color: isActive ? '#ffffff' : '#94a3b8',
            backgroundColor: isActive ? '#1e293b' : 'transparent',
            borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
};

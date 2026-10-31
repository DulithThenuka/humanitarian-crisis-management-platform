import React, { useState } from 'react';

export function AdministrationPage() {
  const [usersList, setUsersList] = useState([
    { id: 'USR-001', name: 'Amara Chen', email: 'amara.chen@reliefcore.lk', role: 'Coordinator', status: 'Active' },
    { id: 'USR-002', name: 'Kasun Perera', email: 'kasun.p@reliefcore.lk', role: 'LogisticsManager', status: 'Active' },
    { id: 'USR-003', name: 'Nimali Silva', email: 'nimali.s@reliefcore.lk', role: 'Volunteer', status: 'Inactive' },
    { id: 'USR-004', name: 'Admin User', email: 'admin@reliefcore.lk', role: 'Admin', status: 'Active' },
  ]);

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>Platform Administration</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Manage user accounts, roles, permissions, and system-wide security logs</p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Total System Users</p>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2dd4bf' }}>1,245</h3>
          <span style={{ fontSize: '11px', color: '#34d399' }}>↑ 12% Active this week</span>
        </div>
        <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Active Sessions</p>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#60a5fa' }}>342</h3>
          <span style={{ fontSize: '11px', color: '#34d399' }}>Live online now</span>
        </div>
        <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Security Alerts</p>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fb7185' }}>0</h3>
          <span style={{ fontSize: '11px', color: '#34d399' }}>System secure</span>
        </div>
      </div>

      {/* User Management Table */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc' }}>User Accounts & Roles</h3>
          <button style={{ padding: '8px 14px', backgroundColor: '#0d9488', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            + Add New User
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '12px' }}>
                <th style={{ paddingBottom: '10px' }}>User ID</th>
                <th style={{ paddingBottom: '10px' }}>Name</th>
                <th style={{ paddingBottom: '10px' }}>Email</th>
                <th style={{ paddingBottom: '10px' }}>Role</th>
                <th style={{ paddingBottom: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                  <td style={{ padding: '12px 0', color: '#2dd4bf', fontWeight: 500 }}>{u.id}</td>
                  <td style={{ padding: '12px 0', color: '#cbd5e1' }}>{u.name}</td>
                  <td style={{ padding: '12px 0', color: '#94a3b8' }}>{u.email}</td>
                  <td style={{ padding: '12px 0', color: '#60a5fa', fontWeight: 500 }}>{u.role}</td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 500,
                      backgroundColor: u.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: u.status === 'Active' ? '#34d399' : '#f87171',
                      border: `1px solid ${u.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
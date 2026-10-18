import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid #334155',
      backgroundColor: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#38bdf8', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          CRISIS RESPONSE HUB
        </Link>
        <span style={{ fontSize: '11px', background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
          LIVE
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated ? (
          <>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{user?.fullName}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{user?.role}</div>
            </div>
            <Button variant="outline" onClick={handleLogout} style={{ padding: '6px 14px', fontSize: '12px' }}>
              Logout
            </Button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="outline" style={{ padding: '6px 14px', fontSize: '12px' }}>Login</Button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ padding: '6px 14px', fontSize: '12px' }}>Register</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

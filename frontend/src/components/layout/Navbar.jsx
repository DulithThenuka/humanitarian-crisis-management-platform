import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { HumanAidLogo } from '../common/HumanAidLogo';

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
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      backgroundColor: '#14291e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <HumanAidLogo variant="full" size="sm" withContainer={true} />
        </Link>
        <span style={{ fontSize: '10px', background: '#1c3628', color: '#dbe4c6', border: '1px solid #2a4c38', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
          LIVE
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated ? (
          <>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{user?.fullName}</div>
              <div style={{ fontSize: '11px', color: '#9fa89e' }}>{user?.role}</div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                borderColor: '#2a4c38',
                color: '#dbe4c6',
                background: 'transparent'
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button
                variant="outline"
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  borderColor: '#2a4c38',
                  color: '#ffffff',
                  background: 'transparent'
                }}
              >
                Login
              </Button>
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Button
                variant="primary"
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  backgroundColor: '#dbe4c6',
                  color: '#162e20',
                  fontWeight: 700,
                  border: 'none'
                }}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

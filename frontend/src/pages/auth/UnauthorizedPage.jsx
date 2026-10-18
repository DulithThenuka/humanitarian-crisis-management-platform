import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 24px' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#ef4444', marginBottom: '12px' }}>403</h1>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f8fafc', marginBottom: '8px' }}>Access Denied</h2>
      <p style={{ color: '#94a3b8', maxWidth: '420px', margin: '0 auto 24px auto', fontSize: '14px' }}>
        You do not have the required permissions or operational role to access this module.
      </p>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button variant="primary">Return to Safety / Home</Button>
      </Link>
    </div>
  );
};

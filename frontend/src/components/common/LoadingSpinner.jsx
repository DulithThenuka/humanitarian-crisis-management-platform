import React from 'react';

export const LoadingSpinner = ({ size = 32, message = "Loading..." }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        border: '3px solid #334155',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {message && <span style={{ color: '#94a3b8', fontSize: '13px' }}>{message}</span>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

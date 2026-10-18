import React from 'react';

export const Input = ({ label, error, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
      {label && <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>{label}</label>}
      <input
        style={{
          padding: '10px 14px',
          borderRadius: '8px',
          border: error ? '1px solid #ef4444' : '1px solid #334155',
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s ease'
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '12px', color: '#ef4444' }}>{error}</span>}
    </div>
  );
};

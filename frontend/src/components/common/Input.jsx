import React from 'react';

export const Input = ({ label, error, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
      {label && <label style={{ fontSize: '13px', fontWeight: 600, color: '#c5ccbe' }}>{label}</label>}
      <input
        style={{
          padding: '10px 14px',
          borderRadius: '8px',
          border: error ? '1px solid #ef4444' : '1px solid #2a4a35',
          backgroundColor: '#1e3328',
          color: '#f4f6f2',
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

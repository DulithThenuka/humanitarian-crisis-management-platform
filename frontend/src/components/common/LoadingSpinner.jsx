import React from 'react';
import humanaidLogoIcon from '../../assets/humanaid-logo-icon.jpg';

export const LoadingSpinner = ({ size = 36, message = "Loading...", showLogo = true }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px', gap: '14px' }}>
      {showLogo && (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={humanaidLogoIcon}
            alt="HumanAid Loading"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '8px',
              objectFit: 'contain',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              animation: 'pulseLogo 2s ease-in-out infinite'
            }}
          />
        </div>
      )}
      <div style={{
        width: `${Math.max(24, Math.round(size * 0.7))}px`,
        height: `${Math.max(24, Math.round(size * 0.7))}px`,
        border: '2.5px solid #2a4a35',
        borderTop: '2.5px solid #3d6b4f',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {message && <span style={{ color: '#8a9480', fontSize: '13px', fontWeight: 500 }}>{message}</span>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseLogo {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

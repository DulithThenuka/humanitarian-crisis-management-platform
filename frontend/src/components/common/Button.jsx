import React from 'react';

export const Button = ({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '', ...props }) => {
  const baseStyle = {
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: 'none',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const variants = {
    primary: { backgroundColor: '#3b82f6', color: '#ffffff' },
    secondary: { backgroundColor: '#334155', color: '#f8fafc' },
    danger: { backgroundColor: '#ef4444', color: '#ffffff' },
    success: { backgroundColor: '#10b981', color: '#ffffff' },
    outline: { backgroundColor: 'transparent', border: '1px solid #475569', color: '#f8fafc' }
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...currentVariant }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

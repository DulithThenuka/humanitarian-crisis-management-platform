import React from 'react';
import humanaidLogoFull from '../../assets/humanaid-logo-full.jpg';
import humanaidLogoIcon from '../../assets/humanaid-logo-icon.jpg';

/**
 * Shared HumanAid Branding Logo Component
 *
 * @param {'full' | 'icon'} variant - 'full' (icon + brand text) or 'icon' (standalone square emblem)
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl' | number} size - Predefined or explicit pixel height
 * @param {boolean} withContainer - Wraps in a subtle white container for optimal visibility on dark sidebars
 * @param {string} className - Additional CSS class name
 * @param {React.CSSProperties} style - Style overrides
 * @param {string} alt - Custom accessibility alt text
 */
export const HumanAidLogo = ({
  variant = 'full',
  size = 'md',
  withContainer = false,
  className = '',
  style = {},
  alt
}) => {
  const isIcon = variant === 'icon';
  const src = isIcon ? humanaidLogoIcon : humanaidLogoFull;
  const defaultAlt = isIcon
    ? 'HumanAid Humanitarian Operations Emblem'
    : 'HumanAid — Humanitarian Operations Platform';

  const heightMap = {
    xs: isIcon ? 22 : 24,
    sm: isIcon ? 30 : 28,
    md: isIcon ? 38 : 36,
    lg: isIcon ? 48 : 46,
    xl: isIcon ? 64 : 58
  };

  const pixelHeight = typeof size === 'number' ? size : (heightMap[size] || (isIcon ? 38 : 36));

  const imageElement = (
    <img
      src={src}
      alt={alt || defaultAlt}
      className={`humanaid-logo-${variant} ${className}`}
      style={{
        height: `${pixelHeight}px`,
        width: isIcon ? `${pixelHeight}px` : 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        borderRadius: isIcon ? '8px' : '4px',
        display: 'block',
        ...style
      }}
    />
  );

  if (withContainer) {
    return (
      <div
        className="humanaid-logo-container"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '9px',
          padding: '4px 10px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        {imageElement}
      </div>
    );
  }

  return imageElement;
};

export { humanaidLogoFull, humanaidLogoIcon };
export default HumanAidLogo;

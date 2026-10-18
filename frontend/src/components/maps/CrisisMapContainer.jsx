import React from 'react';

export const CrisisMapContainer = ({ center = [6.9271, 79.8612], zoom = 10, children, style = {} }) => {
  return (
    <div style={{
      width: '100%',
      height: '450px',
      borderRadius: '12px',
      border: '1px solid #334155',
      backgroundColor: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      position: 'relative',
      overflow: 'hidden',
      ...style
    }}>
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: '#0f172a', padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}>
        📍 Active Coordinates: [{center[0]}, {center[1]}] | Zoom: {zoom}
      </div>
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc', marginBottom: '8px' }}>OpenStreetMap Crisis Incident Overlay</p>
        <p style={{ fontSize: '13px', maxWidth: '400px' }}>Geospatial shelter locations and reported rescue incidents rendered across grid zones.</p>
      </div>
      {children}
    </div>
  );
};

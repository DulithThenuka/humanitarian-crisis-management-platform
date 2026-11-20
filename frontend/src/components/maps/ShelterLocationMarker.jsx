import React from 'react';

export const ShelterLocationMarker = ({ shelter, onSelect }) => {
  const occupancyPercent = shelter.totalCapacity > 0 
    ? Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100) 
    : 0;

  return (
    <div
      onClick={() => onSelect && onSelect(shelter)}
      style={{
        padding: '10px 14px',
        borderRadius: '8px',
        backgroundColor: '#14291e',
        border: '1px solid #2a4a35',
        cursor: 'pointer',
        fontSize: '13px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}
    >
      <div style={{ fontWeight: 600, color: '#f4f6f2' }}>{shelter.name}</div>
      <div style={{ color: '#8a9480', fontSize: '12px' }}>{shelter.address}</div>
      <div style={{
        marginTop: '6px',
        height: '6px',
        borderRadius: '3px',
        backgroundColor: '#2a4a35',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${occupancyPercent}%`,
          height: '100%',
          backgroundColor: occupancyPercent > 90 ? '#ef4444' : occupancyPercent > 70 ? '#f59e0b' : '#10b981'
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#657367', marginTop: '2px' }}>
        <span>Occupancy: {shelter.currentOccupancy}/{shelter.totalCapacity}</span>
        <span>{occupancyPercent}%</span>
      </div>
    </div>
  );
};

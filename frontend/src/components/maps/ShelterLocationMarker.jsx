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
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        cursor: 'pointer',
        fontSize: '13px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}
    >
      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{shelter.name}</div>
      <div style={{ color: '#94a3b8', fontSize: '12px' }}>{shelter.address}</div>
      <div style={{
        marginTop: '6px',
        height: '6px',
        borderRadius: '3px',
        backgroundColor: '#334155',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${occupancyPercent}%`,
          height: '100%',
          backgroundColor: occupancyPercent > 90 ? '#ef4444' : occupancyPercent > 70 ? '#f59e0b' : '#10b981'
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
        <span>Occupancy: {shelter.currentOccupancy}/{shelter.totalCapacity}</span>
        <span>{occupancyPercent}%</span>
      </div>
    </div>
  );
};

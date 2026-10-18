import React, { useState } from 'react';

export const RequestLocationPicker = ({ onLocationSelect }) => {
  const [coords, setCoords] = useState({ lat: 6.9271, lon: 79.8612 });

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...coords, [name]: parseFloat(value) || 0 };
    setCoords(updated);
    if (onLocationSelect) onLocationSelect(updated);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setCoords(loc);
          if (onLocationSelect) onLocationSelect(loc);
        },
        () => alert("Unable to retrieve GPS coordinates.")
      );
    }
  };

  return (
    <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>Incident Geolocation</span>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Use Device GPS
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8' }}>Latitude</label>
          <input
            type="number"
            step="0.0001"
            name="lat"
            value={coords.lat}
            onChange={handleManualChange}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '12px' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8' }}>Longitude</label>
          <input
            type="number"
            step="0.0001"
            name="lon"
            value={coords.lon}
            onChange={handleManualChange}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #334155', background: '#1e293b', color: '#f8fafc', fontSize: '12px' }}
          />
        </div>
      </div>
    </div>
  );
};

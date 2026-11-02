import React, { useEffect, useState } from 'react';
import { shelterService } from '../../services/shelterService';
import { CrisisMapContainer } from '../../components/maps/CrisisMapContainer';
import { ShelterLocationMarker } from '../../components/maps/ShelterLocationMarker';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const FindShelterPage = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShelter, setSelectedShelter] = useState(null);

  useEffect(() => {
    loadShelters();
  }, []);

  const loadShelters = async () => {
    try {
      const res = await shelterService.getAll();
      if (res.succeeded) {
        setShelters(res.data || []);
      }
    } catch {
      setShelters([
        { id: '1', name: 'Galle Central Shelter', address: 'Main Street, Galle', totalCapacity: 200, currentOccupancy: 85, facilities: 'Water, First Aid' },
        { id: '2', name: 'Matara High School Evacuation Center', address: 'Beach Rd, Matara', totalCapacity: 150, currentOccupancy: 40, facilities: 'Kitchen, Toilets' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Locating relief centres..." />;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Find Evacuation Shelters</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Locate nearby relief centers with real-time bed capacity and amenities.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <CrisisMapContainer center={[6.0535, 80.2210]} zoom={11}>
          {selectedShelter && (
            <div style={{ position: 'absolute', bottom: 16, left: 16, background: '#0f172a', padding: '12px 18px', borderRadius: '8px', border: '1px solid #334155' }}>
              <strong style={{ color: '#38bdf8' }}>{selectedShelter.name}</strong>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Capacity: {selectedShelter.currentOccupancy} / {selectedShelter.totalCapacity}</div>
            </div>
          )}
        </CrisisMapContainer>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto' }}>
          {shelters.map(shelter => (
            <ShelterLocationMarker
              key={shelter.id}
              shelter={shelter}
              onSelect={(s) => setSelectedShelter(s)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

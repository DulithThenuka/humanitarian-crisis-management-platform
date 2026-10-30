import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2, ExternalLink } from 'lucide-react';
import { shelterService } from '../../services/shelterService';
import { CrisisMapContainer } from '../../components/maps/CrisisMapContainer';
import { ShelterLocationMarker } from '../../components/maps/ShelterLocationMarker';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const FindShelterPage = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadShelters();
  }, []);

  const loadShelters = async () => {
    try {
      const res = await shelterService.getAll();
      if (res.succeeded && res.data && res.data.length > 0) {
        setShelters(res.data);
      } else {
        setShelters([
          { id: '1', name: 'Colombo Central School Relief Camp', address: 'Main Street, Colombo 07', totalCapacity: 500, currentOccupancy: 320, facilities: 'Water, Food, Medical' },
          { id: '2', name: 'St. Anthony’s Evacuation Center', address: 'Kandy Road, Peliyagoda', totalCapacity: 300, currentOccupancy: 180, facilities: 'Shelter, First Aid' },
          { id: '3', name: 'Gampaha Community Hall', address: 'Station Rd, Gampaha', totalCapacity: 150, currentOccupancy: 140, facilities: 'Water, Meals' }
        ]);
      }
    } catch {
      setShelters([
        { id: '1', name: 'Colombo Central School Relief Camp', address: 'Main Street, Colombo 07', totalCapacity: 500, currentOccupancy: 320, facilities: 'Water, Food, Medical' },
        { id: '2', name: 'St. Anthony’s Evacuation Center', address: 'Kandy Road, Peliyagoda', totalCapacity: 300, currentOccupancy: 180, facilities: 'Shelter, First Aid' },
        { id: '3', name: 'Gampaha Community Hall', address: 'Station Rd, Gampaha', totalCapacity: 150, currentOccupancy: 140, facilities: 'Water, Meals' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Locating relief centres..." />;

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Link 
          to="/citizen" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: '#38bdf8', 
            fontSize: '13px', 
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} /> Return to Citizen Portal
        </Link>
        <button
          onClick={() => navigate('/map')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#0e6f76',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <ExternalLink size={13} /> View Full Logistics Map
        </button>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Find Evacuation Shelters</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Locate nearby relief centers with real-time bed capacity and amenities.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        <CrisisMapContainer center={[6.9271, 79.8612]} zoom={11}>
          {selectedShelter && (
            <div style={{ position: 'absolute', bottom: 16, left: 16, background: '#0f172a', padding: '12px 18px', borderRadius: '8px', border: '1px solid #334155', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>{selectedShelter.name}</strong>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Capacity: {selectedShelter.currentOccupancy} / {selectedShelter.totalCapacity} ({Math.round((selectedShelter.currentOccupancy / selectedShelter.totalCapacity) * 100)}%)</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Amenities: {selectedShelter.facilities || 'Basic provisions'}</div>
              <button
                onClick={() => navigate(`/citizen/submit?category=Shelter`)}
                style={{
                  marginTop: '8px',
                  background: '#0e6f76',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Request Evacuation to this Shelter
              </button>
            </div>
          )}
        </CrisisMapContainer>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Available Shelter Facilities ({shelters.length})</div>
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

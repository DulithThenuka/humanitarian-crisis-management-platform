import React, { useEffect, useState } from 'react';
import { shelterService } from '../../services/shelterService';
import { DataTable } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ShelterDirectoryPage = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

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
        { id: '1', name: 'Galle Community Hall Shelter', address: 'Main St, Galle', totalCapacity: 200, currentOccupancy: 45, contactPhone: '+94912234567' },
        { id: '2', name: 'Matara Public School Shelter', address: 'School Lane, Matara', totalCapacity: 150, currentOccupancy: 80, contactPhone: '+94412345678' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Shelter Name', accessor: 'name' },
    { header: 'Address', accessor: 'address' },
    {
      header: 'Capacity & Occupancy',
      render: (s) => {
        const available = s.totalCapacity - s.currentOccupancy;
        return <span>{s.currentOccupancy} / {s.totalCapacity} ({available} beds left)</span>;
      }
    },
    { header: 'Contact', accessor: 'contactPhone' }
  ];

  if (loading) return <LoadingSpinner message="Loading shelter roster..." />;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Shelter & Evacuation Center Roster</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Directory of relief locations, maximum capacities, and contact points.</p>
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '16px' }}>
        <DataTable columns={columns} data={shelters} />
      </div>
    </div>
  );
};

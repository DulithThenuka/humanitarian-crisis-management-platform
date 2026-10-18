import React, { useEffect, useState } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { DataTable } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const VolunteerRosterPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    try {
      const res = await volunteerService.getAll();
      if (res.succeeded) {
        setVolunteers(res.data || []);
      }
    } catch {
      setVolunteers([
        { id: '1', fullName: 'Bob Volunteer', email: 'volunteer@crisisplatform.org', skills: 'First Aid, Search and Rescue', isAvailable: true, maxTravelDistance: 50 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Volunteer Name', accessor: 'fullName' },
    { header: 'Contact Email', accessor: 'email' },
    { header: 'Certified Skills', accessor: 'skills' },
    { header: 'Max Radius (km)', accessor: 'maxTravelDistance' },
    {
      header: 'Availability',
      render: (v) => v.isAvailable ? (
        <span style={{ color: '#10b981', fontWeight: 700 }}>ON CALL</span>
      ) : (
        <span style={{ color: '#ef4444', fontWeight: 700 }}>DEPLOYED</span>
      )
    }
  ];

  if (loading) return <LoadingSpinner message="Fetching volunteer roster..." />;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Volunteer Skill Roster</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Registered field volunteers, capabilities, and availability schedules.</p>
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '16px' }}>
        <DataTable columns={columns} data={volunteers} />
      </div>
    </div>
  );
};

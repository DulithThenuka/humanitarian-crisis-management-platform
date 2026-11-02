import React, { useEffect, useState } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { DataTable } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const VolunteerRosterPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadVolunteers();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, statusFilter, volunteers]);

  const loadVolunteers = async () => {
    try {
      const res = await volunteerService.getAll();
      if (res && res.succeeded) {
        setVolunteers(res.data || []);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch {
      // Fallback Demo Data for Testing UI
      setVolunteers([
        { id: '1', fullName: 'Bob Volunteer', email: 'bob@crisisplatform.org', phone: '+94 77 123 4567', skills: 'First Aid, Search & Rescue', isAvailable: true, maxTravelDistance: 50 },
        { id: '2', fullName: 'Sarah Jenkins', email: 'sarah@crisisplatform.org', phone: '+94 71 987 6543', skills: 'Logistics, Medical Assistant', isAvailable: false, maxTravelDistance: 25 },
        { id: '3', fullName: 'Kamal Perera', email: 'kamal@crisisplatform.org', phone: '+94 75 456 7890', skills: 'Food Distribution, Driver', isAvailable: true, maxTravelDistance: 40 },
        { id: '4', fullName: 'Dilini Fernando', email: 'dilini@crisisplatform.org', phone: '+94 70 333 1122', skills: 'Psychosocial Support, Child Care', isAvailable: true, maxTravelDistance: 15 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let updated = [...volunteers];

    // Search filter (Name, Email, Skills)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      updated = updated.filter(
        v =>
          v.fullName?.toLowerCase().includes(term) ||
          v.email?.toLowerCase().includes(term) ||
          v.skills?.toLowerCase().includes(term)
      );
    }

    // Availability Filter
    if (statusFilter === 'AVAILABLE') {
      updated = updated.filter(v => v.isAvailable === true);
    } else if (statusFilter === 'DEPLOYED') {
      updated = updated.filter(v => v.isAvailable === false);
    }

    setFilteredVolunteers(updated);
  };

  // Calculating Quick Stats
  const totalVolunteers = volunteers.length;
  const availableCount = volunteers.filter(v => v.isAvailable).length;
  const deployedCount = totalVolunteers - availableCount;

  // Table Columns Setup
  const columns = [
    {
      header: 'Volunteer Name',
      accessor: 'fullName',
      render: (v) => (
        <div>
          <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '14px' }}>{v.fullName}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{v.phone || 'N/A'}</div>
        </div>
      )
    },
    { header: 'Contact Email', accessor: 'email' },
    {
      header: 'Certified Skills',
      accessor: 'skills',
      render: (v) => (
        <span style={{ backgroundColor: '#0f172a', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', border: '1px solid #334155', color: '#cbd5e1' }}>
          {v.skills}
        </span>
      )
    },
    { 
      header: 'Max Radius', 
      render: (v) => <span style={{ color: '#94a3b8' }}>{v.maxTravelDistance} km</span>
    },
    {
      header: 'Availability',
      render: (v) => v.isAvailable ? (
        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
          ● ON CALL
        </span>
      ) : (
        <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
          ● DEPLOYED
        </span>
      )
    },
    {
      header: 'Action',
      render: (v) => (
        <button
          onClick={() => alert(`Assigning task to ${v.fullName}`)}
          style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          Assign Task
        </button>
      )
    }
  ];

  if (loading) return <LoadingSpinner message="Fetching volunteer roster..." />;

  return (
    <div style={{ padding: '28px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Volunteer Skill Roster</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Registered field volunteers, capabilities, and availability schedules.
          </p>
        </div>
        <button 
          onClick={() => alert('Add Volunteer Form / Modal')}
          style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Register New Volunteer
        </button>
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Total Volunteers</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>{totalVolunteers}</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Available (On Call)</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>{availableCount}</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Deployed</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginTop: '4px' }}>{deployedCount}</div>
        </div>
      </div>

      {/* Search Bar & Filter Options */}
      <div style={{ 
        backgroundColor: '#1e293b', 
        borderRadius: '12px 12px 0 0', 
        border: '1px solid #334155', 
        borderBottom: 'none',
        padding: '16px', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name, email, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            color: '#f8fafc',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            width: '320px',
            outline: 'none'
          }}
        />

        {/* Filter Dropdown */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              color: '#f8fafc',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available (On Call)</option>
            <option value="DEPLOYED">Deployed</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '0 0 12px 12px', border: '1px solid #334155', padding: '16px' }}>
        <DataTable columns={columns} data={filteredVolunteers} />
      </div>

    </div>
  );
};
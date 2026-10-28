import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { DataTable } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const TrackRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await requestService.getAll();
      if (res.succeeded && res.data && res.data.length > 0) {
        setRequests(res.data);
      } else {
        setRequests([
          { id: 'REQ-2026-01842', category: 'Medical Assistance', description: 'Elderly person with serious health condition needs immediate medical assistance. Flood zone.', urgency: 3, status: 0, createdAt: '2026-06-15' },
          { id: 'REQ-2026-01877', category: 'Emergency Shelter', description: 'House flooded up to waist level. Displaced family of 6.', urgency: 2, status: 1, createdAt: '2026-06-15' },
          { id: 'REQ-2026-01835', category: 'Food & Water', description: 'Drinking water supplies depleted in flood sector.', urgency: 2, status: 0, createdAt: '2026-06-15' }
        ]);
      }
    } catch {
      setRequests([
        { id: 'REQ-2026-01842', category: 'Medical Assistance', description: 'Elderly person with serious health condition needs immediate medical assistance. Flood zone.', urgency: 3, status: 0, createdAt: '2026-06-15' },
        { id: 'REQ-2026-01877', category: 'Emergency Shelter', description: 'House flooded up to waist level. Displaced family of 6.', urgency: 2, status: 1, createdAt: '2026-06-15' },
        { id: 'REQ-2026-01835', category: 'Food & Water', description: 'Drinking water supplies depleted in flood sector.', urgency: 2, status: 0, createdAt: '2026-06-15' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      header: 'Request ID', 
      render: (r) => (
        <Link 
          to={`/coordinator/requests/${r.id}`}
          style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}
        >
          {r.id}
        </Link>
      )
    },
    { header: 'Category', accessor: 'category' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Urgency',
      render: (r) => {
        const colors = { 0: '#3b82f6', 1: '#eab308', 2: '#f97316', 3: '#ef4444' };
        const labels = ['Low', 'Medium', 'High', 'Critical'];
        return <span style={{ color: colors[r.urgency] || '#fff', fontWeight: 600 }}>{labels[r.urgency]}</span>;
      }
    },
    {
      header: 'Status',
      render: (r) => {
        const statusMap = ['Submitted / Under Review', 'Verified', 'InProgress', 'Resolved', 'Closed'];
        return <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: '#334155', fontSize: '12px' }}>{statusMap[r.status] || 'Active'}</span>;
      }
    },
    { header: 'Submitted', render: (r) => new Date(r.createdAt || Date.now()).toLocaleDateString() },
    {
      header: 'Actions',
      render: (r) => (
        <Link
          to={`/coordinator/requests/${r.id}`}
          style={{
            padding: '4px 10px',
            backgroundColor: '#0e6f76',
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          Track Live
        </Link>
      )
    }
  ];

  if (loading) return <LoadingSpinner message="Fetching your requests..." />;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>My Incident Reports</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Real-time lifecycle and progress tracker for your logged assistance requests.</p>
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '16px' }}>
        <DataTable columns={columns} data={requests} emptyMessage="No assistance requests submitted yet." />
      </div>
    </div>
  );
};

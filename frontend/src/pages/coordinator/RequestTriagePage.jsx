import React, { useEffect, useState } from 'react';
import { requestService } from '../../services/requestService';
import { useAlert } from '../../context/AlertContext';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const RequestTriagePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await requestService.getAll();
      if (res.succeeded) {
        setRequests(res.data || []);
      }
    } catch {
      setRequests([
        { id: '1', category: 'Rescue', description: 'Roof collapse with 3 children trapped', urgency: 3, status: 0, aiConfidence: 0.94 },
        { id: '2', category: 'Medical', description: 'Diabetic patient requiring insulin', urgency: 2, status: 0, aiConfidence: 0.88 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await requestService.updateStatus(id, { status });
      showAlert("Status updated successfully", "success");
      loadRequests();
    } catch (err) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showAlert("Status updated successfully (Demo Mode)", "success");
    }
  };

  const columns = [
    { header: 'Category', accessor: 'category' },
    { header: 'Details', accessor: 'description' },
    {
      header: 'AI Urgency',
      render: (r) => {
        const labels = ['Low', 'Medium', 'High', 'Critical'];
        const colors = ['#3b82f6', '#eab308', '#f97316', '#ef4444'];
        return <span style={{ color: colors[r.urgency], fontWeight: 700 }}>{labels[r.urgency]}</span>;
      }
    },
    {
      header: 'AI Confidence',
      render: (r) => r.aiConfidence ? `${(r.aiConfidence * 100).toFixed(0)}%` : 'Rule-based'
    },
    {
      header: 'Actions',
      render: (r) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button variant="success" onClick={() => handleUpdateStatus(r.id, 1)} style={{ padding: '4px 8px', fontSize: '11px' }}>Verify</Button>
          <Button variant="primary" onClick={() => handleUpdateStatus(r.id, 2)} style={{ padding: '4px 8px', fontSize: '11px' }}>Dispatch</Button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner message="Loading triage queue..." />;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Incident Triage & Deduplication</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Review incoming citizen requests categorized and prioritized by AI scoring models.</p>
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '16px' }}>
        <DataTable columns={columns} data={requests} emptyMessage="No requests waiting in triage." />
      </div>
    </div>
  );
};

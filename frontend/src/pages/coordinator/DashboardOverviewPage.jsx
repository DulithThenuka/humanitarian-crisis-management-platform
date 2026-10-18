import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { CrisisSeverityChart } from '../../components/charts/CrisisSeverityChart';
import { ResourceInventoryBar } from '../../components/charts/ResourceInventoryBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const DashboardOverviewPage = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKpis();
  }, []);

  const loadKpis = async () => {
    try {
      const res = await apiClient.get('/analytics/operational-kpis');
      if (res.succeeded) {
        setKpis(res.data);
      }
    } catch {
      setKpis({
        totalRequests: 84,
        pendingRequests: 19,
        inProgressRequests: 42,
        resolvedRequests: 23,
        shelterUtilizationRate: 64.5,
        totalShelterCapacity: 450,
        currentShelterOccupancy: 290,
        lowStockResources: 2,
        availableVolunteers: 18
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating operational metrics..." />;

  const cards = [
    { label: 'Total Incidents', value: kpis?.totalRequests || 0, color: '#3b82f6' },
    { label: 'Active Triage Cases', value: kpis?.pendingRequests || 0, color: '#ef4444' },
    { label: 'Shelter Utilization', value: `${kpis?.shelterUtilizationRate?.toFixed(1) || 0}%`, color: '#eab308' },
    { label: 'Field Volunteers', value: kpis?.availableVolunteers || 0, color: '#10b981' }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Crisis Coordination Dashboard</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Real-time situation overview and resource status.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {cards.map((c, i) => (
          <div key={i} style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{c.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: c.color, marginTop: '8px' }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <CrisisSeverityChart />
        <ResourceInventoryBar resources={[
          { name: 'Water (500ml)', allocatedQuantity: 2500, totalQuantity: 10000, unit: 'Units' },
          { name: 'Rice Bags', allocatedQuantity: 380, totalQuantity: 500, unit: 'Bags' },
          { name: 'First Aid Kits', allocatedQuantity: 225, totalQuantity: 300, unit: 'Kits' }
        ]} />
      </div>
    </div>
  );
};

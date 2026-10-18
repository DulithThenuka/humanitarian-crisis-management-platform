import React, { useEffect, useState } from 'react';
import { resourceService } from '../../services/resourceService';
import { DataTable } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ResourceInventoryPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await resourceService.getInventory();
      if (res.succeeded) {
        setResources(res.data || []);
      }
    } catch {
      setResources([
        { id: '1', name: 'Water Bottles (500ml)', category: 'Water', unit: 'Bottles', totalQuantity: 10000, allocatedQuantity: 2500, minimumThreshold: 1000, warehouseLocation: 'Colombo Central' },
        { id: '2', name: 'Emergency Rations', category: 'Food', unit: 'Boxes', totalQuantity: 1200, allocatedQuantity: 800, minimumThreshold: 300, warehouseLocation: 'Galle Depot' },
        { id: '3', name: 'First Aid Packs', category: 'Medicine', unit: 'Packs', totalQuantity: 300, allocatedQuantity: 260, minimumThreshold: 80, warehouseLocation: 'Kandy Base' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Resource Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Available / Total',
      render: (r) => {
        const available = r.totalQuantity - r.allocatedQuantity;
        const isLow = available <= r.minimumThreshold;
        return (
          <span style={{ color: isLow ? '#ef4444' : '#10b981', fontWeight: 600 }}>
            {available} / {r.totalQuantity} {r.unit}
          </span>
        );
      }
    },
    { header: 'Warehouse Hub', accessor: 'warehouseLocation' },
    {
      header: 'Stock Status',
      render: (r) => {
        const isLow = (r.totalQuantity - r.allocatedQuantity) <= r.minimumThreshold;
        return isLow ? (
          <span style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
            LOW STOCK
          </span>
        ) : (
          <span style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
            OPTIMAL
          </span>
        );
      }
    }
  ];

  if (loading) return <LoadingSpinner message="Checking warehouse inventory levels..." />;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Emergency Supplies Inventory</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Stock tracking across food, medical supplies, water, and shelter materials.</p>
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '16px' }}>
        <DataTable columns={columns} data={resources} />
      </div>
    </div>
  );
};

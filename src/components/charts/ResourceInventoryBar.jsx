import React from 'react';

export const ResourceInventoryBar = ({ resources = [] }) => {
  return (
    <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>Resource Stock vs Allocations</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {resources.map((res, idx) => {
          const allocatedPct = res.totalQuantity > 0 ? Math.round((res.allocatedQuantity / res.totalQuantity) * 100) : 0;
          return (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>{res.name}</span>
                <span style={{ color: '#94a3b8' }}>
                  {res.allocatedQuantity} / {res.totalQuantity} {res.unit} ({allocatedPct}%)
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
                <div style={{
                  width: `${allocatedPct}%`,
                  height: '100%',
                  backgroundColor: allocatedPct > 85 ? '#ef4444' : '#3b82f6',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

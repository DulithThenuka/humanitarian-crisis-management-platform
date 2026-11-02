import React from 'react';

export const CrisisSeverityChart = ({ data = { critical: 12, high: 28, medium: 45, low: 18 } }) => {
  const total = Object.values(data).reduce((acc, v) => acc + v, 0) || 1;

  const categories = [
    { label: 'Critical', count: data.critical, color: '#ef4444' },
    { label: 'High', count: data.high, color: '#f97316' },
    { label: 'Medium', count: data.medium, color: '#eab308' },
    { label: 'Low', count: data.low, color: '#3b82f6' }
  ];

  return (
    <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>Request Volume by Urgency</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categories.map((cat, idx) => {
          const pct = Math.round((cat.count / total) * 100);
          return (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1' }}>{cat.label}</span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>{cat.count} ({pct}%)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: cat.color, borderRadius: '4px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

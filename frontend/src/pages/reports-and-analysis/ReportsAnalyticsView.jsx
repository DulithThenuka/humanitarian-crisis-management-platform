import React from 'react';
import { BarChart3, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export const ReportsAnalyticsView = () => {
  return (
    <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#f0fdfa',
            color: '#0f766e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Operations Intelligence & Performance Reports
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
              Comprehensive real-time analytics, response latency SLA metrics, and resource dispatch distribution.
            </p>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px'
      }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #eef2f6', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f766e', fontWeight: 700, fontSize: '12px' }}>
            <TrendingUp size={16} />
            <span>Response Velocity</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>14.2 min</div>
          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>↑ 22% faster than 30-day baseline</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #eef2f6', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontWeight: 700, fontSize: '12px' }}>
            <Users size={16} />
            <span>Evacuee Shelter Coverage</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>88.6%</div>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>4,120 of 4,650 individuals sheltered</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #eef2f6', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 700, fontSize: '12px' }}>
            <AlertTriangle size={16} />
            <span>SLA Compliance Rate</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>96.4%</div>
          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>Within target &lt; 30 min critical threshold</span>
        </div>
      </div>
    </div>
  );
};

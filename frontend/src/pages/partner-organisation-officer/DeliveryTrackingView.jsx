import React from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle, 
  Navigation 
} from 'lucide-react';

export const DeliveryTrackingView = ({ records }) => {
  const dispatchedItems = records.filter(r => r.status === 'Dispatched' || r.status === 'Confirmed');

  return (
    <div>
      <div className="po-title-action-row">
        <div>
          <div className="po-workspace-label">Field Logistics & Fleet Transit</div>
          <h1 className="po-page-heading">Delivery Tracking</h1>
          <p className="po-page-subtext">
            Role-scoped convoy tracking, distribution hub checkpoints and arrival validation.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {dispatchedItems.map((item) => (
          <div key={item.id} className="po-white-panel-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{item.id}</span>
                    <span style={{ fontSize: '11px', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {item.sharedIncident}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px' }}>
                    <strong>{item.contribution}</strong> &bull; {item.quantity} ({item.responsibleOrg})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="po-tag-success" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
                  &bull; Transit In Progress
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Target ETA: <strong style={{ color: '#0f172a' }}>{item.deadline}</strong>
                </span>
              </div>
            </div>

            {/* Milestones Flow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '22px 0 10px 0', position: 'relative', padding: '0 20px' }}>
              <div style={{ position: 'absolute', left: '40px', right: '40px', top: '14px', height: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }} />

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1, backgroundColor: '#ffffff', padding: '0 6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={14} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>Origin Base</span>
                <span style={{ fontSize: '9.5px', color: '#64748b' }}>Cleared</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1, backgroundColor: '#ffffff', padding: '0 6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={14} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>Security Checkpoint</span>
                <span style={{ fontSize: '9.5px', color: '#64748b' }}>Passed</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1, backgroundColor: '#ffffff', padding: '0 6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Navigation size={13} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>En Route (Sector B)</span>
                <span style={{ fontSize: '9.5px', color: '#16a34a' }}>Live GPS</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1, backgroundColor: '#ffffff', padding: '0 6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#94a3b8', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={13} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Distribution Hub</span>
                <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>Pending</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


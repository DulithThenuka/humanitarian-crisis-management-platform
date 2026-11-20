import React, { useState } from 'react';
import {
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Package,
  Truck,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  MapPin,
  RefreshCw,
  Plus
} from 'lucide-react';
import { INITIAL_REQUISITIONS, INITIAL_DEPOTS } from '../data/logisticsPortalData';

export const SupplyRequisitionsView = ({ showToast }) => {
  const [requisitions, setRequisitions] = useState(INITIAL_REQUISITIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');

  // Modal State
  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedDepot, setSelectedDepot] = useState('DEPOT-001');
  const [transportMode, setTransportMode] = useState('Heavy 10-Ton Relief Truck');
  const [fulfillmentNote, setFulfillmentNote] = useState('');

  // Toast Helper
  const triggerToast = (msg) => {
    if (showToast) showToast(msg);
    else alert(msg);
  };

  // Filter Logic
  const filteredList = requisitions.filter(item => {
    const matchesSearch =
      item.shelterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDistrict = districtFilter === 'ALL' || item.district === districtFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || item.urgency === urgencyFilter;

    return matchesSearch && matchesDistrict && matchesStatus && matchesUrgency;
  });

  // Action Handlers
  const handleOpenFulfillModal = (req) => {
    setSelectedReq(req);
    setSelectedDepot('DEPOT-001');
    setTransportMode('Heavy 10-Ton Relief Truck');
    setFulfillmentNote(`Fulfilling urgent emergency request for ${req.shelterName}. Stock allocated from central depot.`);
  };

  const handleApproveFulfillment = (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    const depotName = INITIAL_DEPOTS.find(d => d.id === selectedDepot)?.name || 'Peliyagoda Central Hub';

    setRequisitions(prev =>
      prev.map(r =>
        r.id === selectedReq.id
          ? {
              ...r,
              status: 'Approved',
              statusClass: 'status-approved',
              items: r.items.map(it => ({ ...it, allocatedFrom: depotName }))
            }
          : r
      )
    );

    triggerToast(`Requisition ${selectedReq.id} approved! Allocating from ${depotName} via ${transportMode}.`);
    setSelectedReq(null);
  };

  const handleRejectRequisition = (id, shelter) => {
    if (!window.confirm(`Are you sure you want to decline or request clarification on requisition ${id} for ${shelter}?`)) return;

    setRequisitions(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: 'Declined / Clarification Needed', statusClass: 'status-declined' }
          : r
      )
    );
    triggerToast(`Requisition ${id} flagged for clarification with shelter coordinator.`);
  };

  // Metrics
  const pendingCount = requisitions.filter(r => r.status === 'Pending Review').length;
  const criticalCount = requisitions.filter(r => r.urgency === 'Critical' && r.status === 'Pending Review').length;
  const approvedCount = requisitions.filter(r => r.status === 'Approved').length;

  return (
    <div className="logistics-subview-container" style={{ padding: '2rem' }}>
      {/* 1. Header Overview Cards */}
      <div className="logistics-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#8a9480', fontWeight: 600, textTransform: 'uppercase' }}>Pending Review</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f4f6f2' }}>{pendingCount} Requisitions</div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>Awaiting logistics depot allocation</div>
        </div>

        <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#8a9480', fontWeight: 600, textTransform: 'uppercase' }}>Critical Priority</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f4f6f2' }}>{criticalCount} Urgent</div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>Infant formula & medical relief required</div>
        </div>

        <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#8a9480', fontWeight: 600, textTransform: 'uppercase' }}>Approved & Staged</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f4f6f2' }}>{approvedCount} Queued</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Allocated to loading docks</div>
        </div>

        <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#8a9480', fontWeight: 600, textTransform: 'uppercase' }}>Avg Fulfilment Time</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7caa7e' }}>
              <Truck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f4f6f2' }}>42 Minutes</div>
          <div style={{ fontSize: '0.75rem', color: '#7caa7e', marginTop: '0.25rem' }}>Rapid response warehouse standard</div>
        </div>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#657367' }} />
            <input
              type="text"
              placeholder="Search by shelter name, requisition ID, items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                background: '#14291e',
                border: '1px solid #2a4a35',
                borderRadius: '8px',
                color: '#f4f6f2',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            style={{ background: '#14291e', border: '1px solid #2a4a35', color: '#f4f6f2', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Districts</option>
            <option value="Colombo">Colombo District</option>
            <option value="Gampaha">Gampaha District</option>
            <option value="Kalutara">Kalutara District</option>
          </select>

          <select
            value={urgencyFilter}
            onChange={e => setUrgencyFilter(e.target.value)}
            style={{ background: '#14291e', border: '1px solid #2a4a35', color: '#f4f6f2', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Urgencies</option>
            <option value="Critical">Critical Urgency</option>
            <option value="High">High Urgency</option>
            <option value="Normal">Normal</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ background: '#14291e', border: '1px solid #2a4a35', color: '#f4f6f2', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Dispatched">Dispatched</option>
          </select>

          <button
            onClick={() => { setSearchTerm(''); setDistrictFilter('ALL'); setStatusFilter('ALL'); setUrgencyFilter('ALL'); }}
            style={{ background: '#2a4a35', border: 'none', color: '#f4f6f2', padding: '0.65rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* 3. Requisitions Table */}
      <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #2a4a35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#f4f6f2' }}>
              Shelter & Field Supply Requisitions
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#8a9480' }}>
              Showing {filteredList.length} emergency requests awaiting warehouse allocation and convoy dispatch
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', color: '#7caa7e', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '0.25rem 0.65rem', borderRadius: '999px', fontWeight: 600 }}>
            Live Queue Active
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#14291e', borderBottom: '1px solid #2a4a35', color: '#8a9480', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Req ID</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Shelter Destination</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Requested Supplies</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Urgency</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Requester</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((req, idx) => (
                <tr
                  key={req.id}
                  style={{
                    borderBottom: idx === filteredList.length - 1 ? 'none' : '1px solid #2a4a35',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.4)'
                  }}
                >
                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontWeight: 600, color: '#7caa7e' }}>
                    {req.id}
                    <div style={{ fontSize: '0.75rem', color: '#657367', fontWeight: 'normal' }}>{req.requestedAt}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: '#f4f6f2' }}>{req.shelterName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8a9480', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                      <MapPin size={12} /> {req.zone}, {req.district}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      {req.items.map((it, iIdx) => (
                        <span key={iIdx} style={{ fontSize: '0.8rem', color: '#c5ccbe' }}>
                          • <strong style={{ color: '#f4f6f2' }}>{it.qty} {it.unit}</strong> {it.name}
                        </span>
                      ))}
                    </div>
                    {req.notes && (
                      <div style={{ fontSize: '0.75rem', color: '#8a9480', fontStyle: 'italic', marginTop: '0.3rem', maxWidth: '320px' }}>
                        "{req.notes}"
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background:
                          req.urgency === 'Critical'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : req.urgency === 'High'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(59, 130, 246, 0.2)',
                        color:
                          req.urgency === 'Critical'
                            ? '#fca5a5'
                            : req.urgency === 'High'
                            ? '#fcd34d'
                            : '#b8ccaa',
                        border:
                          req.urgency === 'Critical'
                            ? '1px solid rgba(239, 68, 68, 0.4)'
                            : req.urgency === 'High'
                            ? '1px solid rgba(245, 158, 11, 0.4)'
                            : '1px solid rgba(59, 130, 246, 0.4)'
                      }}
                    >
                      {req.urgency}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 500, color: '#f4f6f2' }}>{req.requester}</div>
                    <div style={{ fontSize: '0.75rem', color: '#7caa7e', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <PhoneCall size={11} /> {req.phone}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background:
                          req.status === 'Approved'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : req.status === 'Dispatched'
                            ? 'rgba(56, 189, 248, 0.2)'
                            : 'rgba(245, 158, 11, 0.2)',
                        color:
                          req.status === 'Approved'
                            ? '#6ee7b7'
                            : req.status === 'Dispatched'
                            ? '#a4c4a0'
                            : '#fde68a',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {req.status === 'Pending Review' ? (
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenFulfillModal(req)}
                          style={{
                            background: '#3d6b4f',
                            hover: { background: '#2d5a3e' },
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Check size={14} /> Fulfill & Allocate
                        </button>
                        <button
                          onClick={() => handleRejectRequisition(req.id, req.shelterName)}
                          title="Clarify or decline"
                          style={{
                            background: '#2a4a35',
                            color: '#8a9480',
                            border: 'none',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
                        <CheckCircle2 size={15} /> Queued for Fleet
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Fulfill & Allocate Modal */}
      {selectedReq && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setSelectedReq(null)}
        >
          <div
            style={{
              background: '#1e3328',
              border: '1px solid #2a4a35',
              borderRadius: '16px',
              maxWidth: '640px',
              width: '100%',
              padding: '2rem',
              color: '#f4f6f2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #2a4a35', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#7caa7e', fontWeight: 600, textTransform: 'uppercase' }}>
                  Emergency Allocation Action
                </span>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.25rem', fontWeight: 700 }}>
                  Allocate Supplies for {selectedReq.shelterName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                style={{ background: '#2a4a35', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#8a9480', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleApproveFulfillment}>
              <div style={{ marginBottom: '1.25rem', background: '#14291e', padding: '1rem', borderRadius: '8px', border: '1px solid #2a4a35' }}>
                <div style={{ fontSize: '0.8rem', color: '#8a9480', marginBottom: '0.5rem', fontWeight: 600 }}>Requested Supplies:</div>
                {selectedReq.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: i === selectedReq.items.length - 1 ? 'none' : '1px solid #1e3328', fontSize: '0.875rem' }}>
                    <span>{it.name}</span>
                    <strong style={{ color: '#7caa7e' }}>{it.qty} {it.unit}</strong>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#c5ccbe', fontWeight: 500, marginBottom: '0.4rem' }}>
                  Select Fulfilling Warehouse Depot
                </label>
                <select
                  value={selectedDepot}
                  onChange={e => setSelectedDepot(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: '#14291e', border: '1px solid #2a4a35', borderRadius: '8px', color: '#f4f6f2', fontSize: '0.9rem' }}
                >
                  {INITIAL_DEPOTS.map(depot => (
                    <option key={depot.id} value={depot.id}>
                      {depot.name} ({depot.district}) — {depot.occupiedPercent}% Occupied
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#c5ccbe', fontWeight: 500, marginBottom: '0.4rem' }}>
                  Assign Transport / Fleet Mode
                </label>
                <select
                  value={transportMode}
                  onChange={e => setTransportMode(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: '#14291e', border: '1px solid #2a4a35', borderRadius: '8px', color: '#f4f6f2', fontSize: '0.9rem' }}
                >
                  <option value="Heavy 10-Ton Relief Truck">Heavy 10-Ton Relief Truck (High Capacity)</option>
                  <option value="4WD All-Terrain Logistics Van">4WD All-Terrain Logistics Van (Inundated Zones)</option>
                  <option value="6000L Municipal Water Bowser">6000L Municipal Water Bowser (Potable Water)</option>
                  <option value="Amphibious Cargo Dinghy">Amphibious Cargo Dinghy (Submerged Access)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#c5ccbe', fontWeight: 500, marginBottom: '0.4rem' }}>
                  Internal Dispatch Instructions
                </label>
                <textarea
                  rows={3}
                  value={fulfillmentNote}
                  onChange={e => setFulfillmentNote(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: '#14291e', border: '1px solid #2a4a35', borderRadius: '8px', color: '#f4f6f2', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  style={{ padding: '0.65rem 1.25rem', background: '#2a4a35', border: 'none', borderRadius: '8px', color: '#c5ccbe', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.5rem', background: '#10b981', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <ShieldCheck size={16} /> Confirm & Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

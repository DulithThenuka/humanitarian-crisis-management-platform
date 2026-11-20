import React, { useState } from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  FileText,
  Printer,
  QrCode,
  X,
  Building2,
  Calendar,
  Layers,
  ArrowDownToLine,
  RefreshCw
} from 'lucide-react';
import { INITIAL_INTAKE_SHIPMENTS, INITIAL_DEPOTS } from '../data/logisticsPortalData';

export const ReceivingDockView = ({ showToast }) => {
  const [shipments, setShipments] = useState(INITIAL_INTAKE_SHIPMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [depotFilter, setDepotFilter] = useState('ALL');

  // Modals
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedInspectShipment, setSelectedInspectShipment] = useState(null);

  const [newShipmentForm, setNewShipmentForm] = useState({
    carrier: '',
    consignor: '',
    waybillNo: '',
    vehiclePlate: '',
    targetDepot: 'Peliyagoda Central Hub',
    bayAssigned: 'Bay 03',
    driverName: '',
    driverPhone: '',
    itemName: 'Family Food Ration Packs',
    quantity: 500,
    unit: 'packs',
    weightKg: 5000,
    expiry: '2027-12-31'
  });

  const triggerToast = (msg) => {
    if (showToast) showToast(msg);
    else alert(msg);
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.waybillNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesDepot = depotFilter === 'ALL' || s.targetDepot.toLowerCase().includes(depotFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesDepot;
  });

  const handleVerifyIntake = (id) => {
    setShipments(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              status: 'Verified & Stored',
              statusClass: 'status-verified',
              qualityAudit: 'PASSED (Dock QA Certified)'
            }
          : s
      )
    );
    triggerToast(`Shipment ${id} verified and added to warehouse active stock.`);
  };

  const handleCreateInwardLog = (e) => {
    e.preventDefault();
    if (!newShipmentForm.waybillNo || !newShipmentForm.carrier) {
      triggerToast('Please provide Carrier name and Waybill number.');
      return;
    }

    const created = {
      id: `IN-2026-${Math.floor(100 + Math.random() * 900)}`,
      carrier: newShipmentForm.carrier,
      consignor: newShipmentForm.consignor || 'Disaster Relief Consignor',
      waybillNo: newShipmentForm.waybillNo,
      vehiclePlate: newShipmentForm.vehiclePlate || 'WP-NA-1000',
      targetDepot: newShipmentForm.targetDepot,
      bayAssigned: newShipmentForm.bayAssigned,
      driverName: newShipmentForm.driverName || 'Designated Driver',
      driverPhone: newShipmentForm.driverPhone || '+94 77 000 0000',
      arrivedAt: 'Just Now',
      status: 'Unloading & Quality Check',
      statusClass: 'status-in-progress',
      items: [
        {
          name: newShipmentForm.itemName,
          qty: Number(newShipmentForm.quantity),
          unit: newShipmentForm.unit,
          weightKg: Number(newShipmentForm.weightKg),
          expiry: newShipmentForm.expiry
        }
      ],
      qualityAudit: 'Inspection in Progress (Sampling 5%)',
      securitySealHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    };

    setShipments([created, ...shipments]);
    setShowLogModal(false);
    triggerToast(`Inward consignment ${created.waybillNo} logged at ${created.targetDepot} - ${created.bayAssigned}.`);

    setNewShipmentForm({
      carrier: '',
      consignor: '',
      waybillNo: '',
      vehiclePlate: '',
      targetDepot: 'Peliyagoda Central Hub',
      bayAssigned: 'Bay 03',
      driverName: '',
      driverPhone: '',
      itemName: 'Family Food Ration Packs',
      quantity: 500,
      unit: 'packs',
      weightKg: 5000,
      expiry: '2027-12-31'
    });
  };

  const handlePrintVoucher = (s) => {
    triggerToast(`Generating Goods Receiving Voucher (GRV) for Consignment ${s.waybillNo}...`);
  };

  return (
    <div className="logistics-subview-container" style={{ padding: '2rem' }}>
      {/* 1. Header Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#8a9480', fontWeight: 600, textTransform: 'uppercase' }}>Inward Weight Today</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <ArrowDownToLine size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f4f6f2' }}>14,800 kg</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Food rations, water & medical supplies</div>
        </div>

        <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#8a9480', fontWeight: 600, textTransform: 'uppercase' }}>Shipments Processed</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7caa7e' }}>
              <Truck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f4f6f2' }}>{shipments.length} Deliveries</div>
          <div style={{ fontSize: '0.75rem', color: '#7caa7e', marginTop: '0.25rem' }}>Verified at dock bays today</div>
        </div>

        <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#8a9480', fontWeight: 600, textTransform: 'uppercase' }}>Dock Inspection QA</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f4f6f2' }}>100% Passed</div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>Zero contaminated / expired lots</div>
        </div>

        <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#8a9480', fontWeight: 600, textTransform: 'uppercase' }}>Key Partners Today</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <Package size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f4f6f2' }}>WFP &amp; Red Cross</div>
          <div style={{ fontSize: '0.75rem', color: '#c084fc', marginTop: '0.25rem' }}>UN joint air &amp; sea shipments</div>
        </div>
      </div>

      {/* 2. Actions & Filter Toolbar */}
      <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#657367' }} />
            <input
              type="text"
              placeholder="Search by Waybill, Carrier, Driver, or Items..."
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
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ background: '#14291e', border: '1px solid #2a4a35', color: '#f4f6f2', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Dock Statuses</option>
            <option value="Verified & Stored">Verified &amp; Stored</option>
            <option value="Unloading & Quality Check">Unloading &amp; QA</option>
            <option value="Expected at Dock">Expected Today</option>
          </select>

          <select
            value={depotFilter}
            onChange={e => setDepotFilter(e.target.value)}
            style={{ background: '#14291e', border: '1px solid #2a4a35', color: '#f4f6f2', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Receiving Depots</option>
            <option value="Peliyagoda">Peliyagoda Hub</option>
            <option value="Port">Colombo Port</option>
            <option value="Gampaha">Gampaha</option>
          </select>

          <button
            onClick={() => setShowLogModal(true)}
            style={{ background: '#3d6b4f', border: 'none', color: '#ffffff', padding: '0.65rem 1.15rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <Plus size={15} /> Log Inward Delivery
          </button>
        </div>
      </div>

      {/* 3. Shipments Table */}
      <div style={{ background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #2a4a35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#f4f6f2' }}>
              Receiving Dock Shipments &amp; Consignments Ledger
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#8a9480' }}>
              All incoming relief cargo, quality control inspection stamps, and Goods Receiving Vouchers (GRV)
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.25rem 0.65rem', borderRadius: '999px', fontWeight: 600 }}>
            Gate &amp; Scales Active
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#14291e', borderBottom: '1px solid #2a4a35', color: '#8a9480', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Waybill / ID</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Carrier &amp; Consignor</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Dock Location</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Cargo Items &amp; Weight</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Quality Audit</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment, idx) => (
                <tr
                  key={shipment.id}
                  style={{
                    borderBottom: idx === filteredShipments.length - 1 ? 'none' : '1px solid #2a4a35',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.4)'
                  }}
                >
                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontWeight: 600, color: '#7caa7e' }}>
                    {shipment.waybillNo}
                    <div style={{ fontSize: '0.75rem', color: '#657367', fontWeight: 'normal' }}>
                      {shipment.id} · {shipment.arrivedAt}
                    </div>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: '#f4f6f2' }}>{shipment.carrier}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8a9480' }}>{shipment.consignor}</div>
                    <div style={{ fontSize: '0.75rem', color: '#c5ccbe', marginTop: '0.15rem' }}>
                      Plate: <span style={{ fontFamily: 'monospace', color: '#f59e0b' }}>{shipment.vehiclePlate}</span> · Driver: {shipment.driverName}
                    </div>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 500, color: '#f4f6f2' }}>{shipment.targetDepot}</div>
                    <span style={{ display: 'inline-block', marginTop: '0.2rem', padding: '0.15rem 0.5rem', background: 'rgba(56, 189, 248, 0.1)', color: '#7caa7e', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {shipment.bayAssigned}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      {shipment.items.map((it, iIdx) => (
                        <span key={iIdx} style={{ fontSize: '0.8rem', color: '#c5ccbe' }}>
                          • <strong style={{ color: '#f4f6f2' }}>{it.qty} {it.unit}</strong> {it.name} ({it.weightKg.toLocaleString()} kg)
                        </span>
                      ))}
                    </div>
                  </td>

                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: shipment.qualityAudit.includes('PASSED') ? '#10b981' : '#f59e0b' }}>
                      {shipment.qualityAudit}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#657367', fontFamily: 'monospace', marginTop: '0.15rem' }}>
                      Seal: {shipment.securitySealHash}
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
                          shipment.status === 'Verified & Stored'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : shipment.status.includes('Unloading')
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(56, 189, 248, 0.2)',
                        color:
                          shipment.status === 'Verified & Stored'
                            ? '#6ee7b7'
                            : shipment.status.includes('Unloading')
                            ? '#fde68a'
                            : '#a4c4a0',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {shipment.status}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      {shipment.status !== 'Verified & Stored' ? (
                        <button
                          onClick={() => handleVerifyIntake(shipment.id)}
                          style={{
                            background: '#10b981',
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
                          <CheckCircle2 size={13} /> Complete Intake
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePrintVoucher(shipment)}
                          style={{
                            background: '#2a4a35',
                            color: '#c5ccbe',
                            border: 'none',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Printer size={13} /> Print GRV
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedInspectShipment(shipment)}
                        title="View Full Waybill & Security Seal"
                        style={{
                          background: '#2a4a35',
                          color: '#7caa7e',
                          border: 'none',
                          padding: '0.45rem 0.65rem',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Log Inward Delivery Modal */}
      {showLogModal && (
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
          onClick={() => setShowLogModal(false)}
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
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #2a4a35', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>Dock Receiving Gate</span>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.25rem', fontWeight: 700 }}>Log Inward Relief Cargo</h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                style={{ background: '#2a4a35', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#8a9480', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateInwardLog}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5ccbe', marginBottom: '0.3rem' }}>Carrier / Transport Agency</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WFP Sri Lanka / Red Cross"
                    value={newShipmentForm.carrier}
                    onChange={e => setNewShipmentForm({ ...newShipmentForm, carrier: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#14291e', border: '1px solid #2a4a35', borderRadius: '8px', color: '#f4f6f2', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5ccbe', marginBottom: '0.3rem' }}>Waybill / Consignment No.</label>
                  <input
                    type="text"
                    required
                    placeholder="WB-2026-LK-091"
                    value={newShipmentForm.waybillNo}
                    onChange={e => setNewShipmentForm({ ...newShipmentForm, waybillNo: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#14291e', border: '1px solid #2a4a35', borderRadius: '8px', color: '#f4f6f2', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5ccbe', marginBottom: '0.3rem' }}>Vehicle Registration Plate</label>
                  <input
                    type="text"
                    placeholder="WP-NA-4821"
                    value={newShipmentForm.vehiclePlate}
                    onChange={e => setNewShipmentForm({ ...newShipmentForm, vehiclePlate: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#14291e', border: '1px solid #2a4a35', borderRadius: '8px', color: '#f4f6f2', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5ccbe', marginBottom: '0.3rem' }}>Driver Full Name &amp; Phone</label>
                  <input
                    type="text"
                    placeholder="K. Perera (+94 77 123 4567)"
                    value={newShipmentForm.driverName}
                    onChange={e => setNewShipmentForm({ ...newShipmentForm, driverName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#14291e', border: '1px solid #2a4a35', borderRadius: '8px', color: '#f4f6f2', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5ccbe', marginBottom: '0.3rem' }}>Target Warehouse Depot</label>
                  <select
                    value={newShipmentForm.targetDepot}
                    onChange={e => setNewShipmentForm({ ...newShipmentForm, targetDepot: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#14291e', border: '1px solid #2a4a35', borderRadius: '8px', color: '#f4f6f2', fontSize: '0.85rem' }}
                  >
                    {INITIAL_DEPOTS.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.district})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#c5ccbe', marginBottom: '0.3rem' }}>Assigned Dock Bay</label>
                  <select
                    value={newShipmentForm.bayAssigned}
                    onChange={e => setNewShipmentForm({ ...newShipmentForm, bayAssigned: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#14291e', border: '1px solid #2a4a35', borderRadius: '8px', color: '#f4f6f2', fontSize: '0.85rem' }}
                  >
                    <option value="Bay 01">Bay 01 (Dry Bulk)</option>
                    <option value="Bay 02">Bay 02 (Dry Food)</option>
                    <option value="Bay 03">Bay 03 (Medical &amp; Cold)</option>
                    <option value="Bay 04">Bay 04 (Heavy Cargo)</option>
                    <option value="Bay 05 (Liquid Intake)">Bay 05 (Liquid / Water Tankers)</option>
                  </select>
                </div>
              </div>

              <div style={{ background: '#14291e', padding: '1rem', borderRadius: '8px', border: '1px solid #2a4a35', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#7caa7e', fontWeight: 600, marginBottom: '0.5rem' }}>Primary Cargo Line:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#8a9480', marginBottom: '0.2rem' }}>Item Description</label>
                    <input
                      type="text"
                      value={newShipmentForm.itemName}
                      onChange={e => setNewShipmentForm({ ...newShipmentForm, itemName: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '6px', color: '#f4f6f2', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#8a9480', marginBottom: '0.2rem' }}>Quantity</label>
                    <input
                      type="number"
                      value={newShipmentForm.quantity}
                      onChange={e => setNewShipmentForm({ ...newShipmentForm, quantity: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.55rem', background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '6px', color: '#f4f6f2', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#8a9480', marginBottom: '0.2rem' }}>Weight (kg)</label>
                    <input
                      type="number"
                      value={newShipmentForm.weightKg}
                      onChange={e => setNewShipmentForm({ ...newShipmentForm, weightKg: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.55rem', background: '#1e3328', border: '1px solid #2a4a35', borderRadius: '6px', color: '#f4f6f2', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  style={{ padding: '0.65rem 1.25rem', background: '#2a4a35', border: 'none', borderRadius: '8px', color: '#c5ccbe', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.5rem', background: '#3d6b4f', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <CheckCircle2 size={16} /> Register Inward Consignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Inspect Waybill & Security Seal Modal */}
      {selectedInspectShipment && (
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
          onClick={() => setSelectedInspectShipment(null)}
        >
          <div
            style={{
              background: '#1e3328',
              border: '1px solid #2a4a35',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              color: '#f4f6f2'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #2a4a35', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#7caa7e', fontWeight: 600, textTransform: 'uppercase' }}>Consignment Dossier</span>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.25rem', fontWeight: 700 }}>
                  Waybill #{selectedInspectShipment.waybillNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInspectShipment(null)}
                style={{ background: '#2a4a35', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#8a9480', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#14291e', padding: '1rem', borderRadius: '8px', border: '1px solid #2a4a35', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div><span style={{ color: '#8a9480' }}>Carrier:</span> <strong>{selectedInspectShipment.carrier}</strong></div>
                <div><span style={{ color: '#8a9480' }}>Consignor:</span> <strong>{selectedInspectShipment.consignor}</strong></div>
                <div><span style={{ color: '#8a9480' }}>Vehicle:</span> <strong>{selectedInspectShipment.vehiclePlate}</strong></div>
                <div><span style={{ color: '#8a9480' }}>Driver:</span> <strong>{selectedInspectShipment.driverName}</strong></div>
                <div><span style={{ color: '#8a9480' }}>Depot:</span> <strong>{selectedInspectShipment.targetDepot}</strong></div>
                <div><span style={{ color: '#8a9480' }}>Dock Bay:</span> <strong>{selectedInspectShipment.bayAssigned}</strong></div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#8a9480', marginBottom: '0.4rem', fontWeight: 600 }}>Manifest Items:</div>
              {selectedInspectShipment.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #2a4a35', fontSize: '0.85rem' }}>
                  <span>{it.name} (Exp: {it.expiry})</span>
                  <strong style={{ color: '#7caa7e' }}>{it.qty} {it.unit} · {it.weightKg.toLocaleString()} kg</strong>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <ShieldCheck size={16} color="#7caa7e" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f4f6f2' }}>Cryptographic Container Seal Verification</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#8a9480' }}>
                Seal Hash: {selectedInspectShipment.securitySealHash}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>
                {selectedInspectShipment.qualityAudit}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setSelectedInspectShipment(null)}
                style={{ padding: '0.65rem 1.25rem', background: '#2a4a35', border: 'none', borderRadius: '8px', color: '#c5ccbe', cursor: 'pointer', fontWeight: 600 }}
              >
                Close Dossier
              </button>
              <button
                onClick={() => {
                  handlePrintVoucher(selectedInspectShipment);
                  setSelectedInspectShipment(null);
                }}
                style={{ padding: '0.65rem 1.25rem', background: '#3d6b4f', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Printer size={15} /> Print Goods Receiving Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Building2,
  Package,
  Truck,
  Thermometer,
  ShieldAlert,
  CheckCircle2,
  MapPin,
  PhoneCall,
  Mail,
  Plus,
  ArrowRightLeft,
  Search,
  Filter,
  Layers,
  X,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { INITIAL_DEPOTS } from '../data/logisticsPortalData';

export const DepotFacilitiesView = ({ showToast }) => {
  const [depots, setDepots] = useState(INITIAL_DEPOTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [coldChainFilter, setColdChainFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferState, setTransferState] = useState({
    fromDepot: 'DEPOT-001',
    toDepot: 'DEPOT-003',
    item: 'Family Food Ration Packs',
    quantity: 500,
    transportMode: '10-Ton Container Truck'
  });

  const [newDepotForm, setNewDepotForm] = useState({
    name: '',
    code: '',
    district: 'Colombo',
    address: '',
    capacitySqFt: 25000,
    manager: '',
    phone: '',
    coldChainAvailable: false
  });

  const triggerToast = (msg) => {
    if (showToast) showToast(msg);
    else alert(msg);
  };

  const filteredDepots = depots.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = districtFilter === 'ALL' || d.district.toLowerCase().includes(districtFilter.toLowerCase());
    const matchesColdChain =
      coldChainFilter === 'ALL' ||
      (coldChainFilter === 'YES' && d.coldChainAvailable) ||
      (coldChainFilter === 'NO' && !d.coldChainAvailable);

    return matchesSearch && matchesDistrict && matchesColdChain;
  });

  const handleCreateDepot = (e) => {
    e.preventDefault();
    if (!newDepotForm.name || !newDepotForm.code) {
      triggerToast('Please provide a name and code for the new depot.');
      return;
    }

    const created = {
      id: `DEPOT-${Date.now()}`,
      ...newDepotForm,
      occupiedPercent: 15,
      loadingBays: 2,
      activeBays: 1,
      coldStorageTemp: newDepotForm.coldChainAvailable ? '2°C to 8°C' : 'Ambient',
      status: 'Commissioned & Active',
      statusClass: 'status-active',
      primaryItems: ['General Emergency Stock'],
      fleetStationed: ['1x Rapid Logistics Van']
    };

    setDepots([created, ...depots]);
    setShowAddModal(false);
    triggerToast(`Depot facility "${created.name}" registered successfully.`);
    setNewDepotForm({
      name: '',
      code: '',
      district: 'Colombo',
      address: '',
      capacitySqFt: 25000,
      manager: '',
      phone: '',
      coldChainAvailable: false
    });
  };

  const handleExecuteTransfer = (e) => {
    e.preventDefault();
    const source = depots.find(d => d.id === transferState.fromDepot)?.name || 'Source Depot';
    const target = depots.find(d => d.id === transferState.toDepot)?.name || 'Target Depot';

    triggerToast(`Inter-depot transfer logged: ${transferState.quantity}x ${transferState.item} routed from ${source} to ${target}.`);
    setShowTransferModal(false);
  };

  // Metrics
  const totalCapacity = depots.reduce((acc, d) => acc + d.capacitySqFt, 0);
  const activeBaysTotal = depots.reduce((acc, d) => acc + d.activeBays, 0);
  const coldChainCount = depots.filter(d => d.coldChainAvailable).length;

  return (
    <div className="logistics-subview-container" style={{ padding: '2rem' }}>
      {/* 1. Header Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Active Warehouses</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <Building2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc' }}>{depots.length} Regional Depots</div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.25rem' }}>Western Province strategic grid</div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Total Storage Volume</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Layers size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc' }}>{(totalCapacity / 1000).toFixed(0)}k sq ft</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Average 78% occupancy across facilities</div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Operational Dock Bays</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <Truck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc' }}>{activeBaysTotal} Active Bays</div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>Continuous intake and dispatch</div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Cold Chain Storage</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
              <Thermometer size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc' }}>{coldChainCount} Certified Facilities</div>
          <div style={{ fontSize: '0.75rem', color: '#c084fc', marginTop: '0.25rem' }}>Insulin, vaccines, and maternal milk</div>
        </div>
      </div>

      {/* 2. Actions & Toolbar */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search depot name, manager, code..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc',
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
            style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Sectors</option>
            <option value="Colombo">Colombo</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Negombo">Negombo Coastal</option>
          </select>

          <select
            value={coldChainFilter}
            onChange={e => setColdChainFilter(e.target.value)}
            style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Storage Types</option>
            <option value="YES">Cold-Chain Equipped</option>
            <option value="NO">Ambient Only</option>
          </select>

          <button
            onClick={() => setShowTransferModal(true)}
            style={{ background: '#334155', border: '1px solid #475569', color: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <ArrowRightLeft size={14} /> Transfer Stock
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            style={{ background: '#0284c7', border: 'none', color: '#ffffff', padding: '0.65rem 1.1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <Plus size={15} /> Add Depot Facility
          </button>
        </div>
      </div>

      {/* 3. Depots Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredDepots.map(depot => (
          <div
            key={depot.id}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {depot.code}
                  </span>
                  <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                    {depot.name}
                  </h3>
                </div>
                <span
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: depot.occupiedPercent > 90 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: depot.occupiedPercent > 90 ? '#fca5a5' : '#6ee7b7',
                    border: depot.occupiedPercent > 90 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {depot.occupiedPercent}% Capacity
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
                <MapPin size={13} style={{ flexShrink: 0 }} /> {depot.address}
              </div>

              {/* Capacity Bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                  <span>Floor Occupancy ({depot.capacitySqFt.toLocaleString()} sq ft)</span>
                  <strong style={{ color: '#f8fafc' }}>{depot.occupiedPercent}%</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#0f172a', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${depot.occupiedPercent}%`,
                      background: depot.occupiedPercent > 90 ? '#ef4444' : depot.occupiedPercent > 75 ? '#f59e0b' : '#10b981',
                      borderRadius: '999px'
                    }}
                  />
                </div>
              </div>

              {/* Facility Features */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', background: '#0f172a', padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Loading Bays</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                    <Truck size={14} color="#f59e0b" /> {depot.activeBays} / {depot.loadingBays} Active
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Cold Storage</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: depot.coldChainAvailable ? '#6ee7b7' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                    <Thermometer size={14} color={depot.coldChainAvailable ? '#10b981' : '#64748b'} />
                    {depot.coldChainAvailable ? 'Available' : 'Ambient'}
                  </div>
                </div>
              </div>

              {/* Primary Stock List */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 600 }}>Staged Critical Stocks:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {depot.primaryItems.map((item, iIdx) => (
                    <span
                      key={iIdx}
                      style={{
                        fontSize: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid #334155',
                        color: '#cbd5e1',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Contact & Action */}
            <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{depot.manager}</div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <PhoneCall size={11} /> {depot.phone}
                </div>
              </div>

              <button
                onClick={() => {
                  setTransferState(prev => ({ ...prev, fromDepot: depot.id }));
                  setShowTransferModal(true);
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <ArrowRightLeft size={13} /> Reallocate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Add Depot Modal */}
      {showAddModal && (
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
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              color: '#f8fafc'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Register New Logistics Depot</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: '#334155', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDepot}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Facility Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Moratuwa Forward Aid Depot"
                    value={newDepotForm.name}
                    onChange={e => setNewDepotForm({ ...newDepotForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Code</label>
                  <input
                    type="text"
                    required
                    placeholder="MFD-06"
                    value={newDepotForm.code}
                    onChange={e => setNewDepotForm({ ...newDepotForm, code: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>District Sector</label>
                  <select
                    value={newDepotForm.district}
                    onChange={e => setNewDepotForm({ ...newDepotForm, district: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem' }}
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kalutara">Kalutara</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Storage Capacity (Sq Ft)</label>
                  <input
                    type="number"
                    value={newDepotForm.capacitySqFt}
                    onChange={e => setNewDepotForm({ ...newDepotForm, capacitySqFt: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Street Address / Location</label>
                <input
                  type="text"
                  placeholder="e.g. 104 Wharf Road, Moratuwa"
                  value={newDepotForm.address}
                  onChange={e => setNewDepotForm({ ...newDepotForm, address: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Depot Officer In-Charge</label>
                  <input
                    type="text"
                    placeholder="Officer Name"
                    value={newDepotForm.manager}
                    onChange={e => setNewDepotForm({ ...newDepotForm, manager: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Emergency Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+94 77 000 0000"
                    value={newDepotForm.phone}
                    onChange={e => setNewDepotForm({ ...newDepotForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="coldChainCheck"
                  checked={newDepotForm.coldChainAvailable}
                  onChange={e => setNewDepotForm({ ...newDepotForm, coldChainAvailable: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="coldChainCheck" style={{ fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                  Equipped with Certified Cold-Chain Medical Refrigerator (2°C - 8°C)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '0.65rem 1.25rem', background: '#334155', border: 'none', borderRadius: '8px', color: '#cbd5e1', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.5rem', background: '#0284c7', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
                >
                  Save &amp; Commission Depot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Stock Transfer Modal */}
      {showTransferModal && (
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
          onClick={() => setShowTransferModal(false)}
        >
          <div
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              padding: '2rem',
              color: '#f8fafc'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Inter-Depot Stock Transfer</h3>
              <button
                onClick={() => setShowTransferModal(false)}
                style={{ background: '#334155', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Origin Facility</label>
                  <select
                    value={transferState.fromDepot}
                    onChange={e => setTransferState({ ...transferState, fromDepot: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.85rem' }}
                  >
                    {depots.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Destination Facility</label>
                  <select
                    value={transferState.toDepot}
                    onChange={e => setTransferState({ ...transferState, toDepot: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.85rem' }}
                  >
                    {depots.filter(d => d.id !== transferState.fromDepot).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Supply Item</label>
                  <select
                    value={transferState.item}
                    onChange={e => setTransferState({ ...transferState, item: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.85rem' }}
                  >
                    <option value="Family Food Ration Packs">Family Food Ration Packs</option>
                    <option value="Clean Drinking Water (1L)">Clean Drinking Water (1L)</option>
                    <option value="Emergency Medical Trauma Kits">Emergency Medical Trauma Kits</option>
                    <option value="Waterproof Tarpaulins">Waterproof Tarpaulins</option>
                    <option value="WASH Water Purification Tablets">WASH Water Purification Tablets</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Quantity</label>
                  <input
                    type="number"
                    value={transferState.quantity}
                    onChange={e => setTransferState({ ...transferState, quantity: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Logistics Fleet Carrier</label>
                <select
                  value={transferState.transportMode}
                  onChange={e => setTransferState({ ...transferState, transportMode: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.85rem' }}
                >
                  <option value="10-Ton Container Truck">10-Ton Container Truck (Dry Cargo)</option>
                  <option value="5-Ton Refrigerated Box Truck">5-Ton Refrigerated Box Truck (Cold-Chain)</option>
                  <option value="4WD Flatbed Transporter">4WD Flatbed Transporter</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  style={{ padding: '0.65rem 1.25rem', background: '#334155', border: 'none', borderRadius: '8px', color: '#cbd5e1', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.5rem', background: '#10b981', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <ShieldCheck size={16} /> Authorize Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

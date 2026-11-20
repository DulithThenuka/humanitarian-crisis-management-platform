import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  Layers,
  Truck,
  Users,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Package
} from 'lucide-react';
import { partnerService } from '../../../services/partnerService';

export const AdminPartnersView = ({ showToast, onRefresh }) => {
  const [partners, setPartners] = useState([]);
  const [sectorZones, setSectorZones] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCommitmentModalOpen, setIsCommitmentModalOpen] = useState(false);
  const [isAssignZoneModalOpen, setIsAssignZoneModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Form states
  const [registerForm, setRegisterForm] = useState({
    name: '',
    acronym: '',
    type: 'Humanitarian / First Response',
    leadContact: '',
    phone: '',
    email: '',
    mouStatus: 'Active MoU (2025-2027)',
    fieldTeamsCount: 5,
    fleetCount: 8
  });
  const [registerError, setRegisterError] = useState('');

  const [commitmentForm, setCommitmentForm] = useState({
    partnerOrganisationId: '',
    item: '',
    qty: 100,
    destinationZone: 'Kelani East - Sector 03',
    estimatedValueLkr: 1000000
  });

  const [zoneAssignForm, setZoneAssignForm] = useState({
    partnerOrganisationId: '',
    sectorZoneId: '',
    operationalRole: 'Primary Distribution'
  });

  const loadPartnerData = async () => {
    setLoading(true);
    try {
      const [partnersRes, summaryRes, zonesRes, commitmentsRes] = await Promise.all([
        partnerService.getPartners(),
        partnerService.getSummary(),
        partnerService.getSectorZones(),
        partnerService.getCommitments()
      ]);

      if (partnersRes?.succeeded && Array.isArray(partnersRes.data)) {
        setPartners(partnersRes.data);
      } else if (Array.isArray(partnersRes?.data)) {
        setPartners(partnersRes.data);
      } else if (Array.isArray(partnersRes)) {
        setPartners(partnersRes);
      }

      if (summaryRes?.succeeded && summaryRes.data) {
        setSummary(summaryRes.data);
      } else if (summaryRes && summaryRes.totalPartners !== undefined) {
        setSummary(summaryRes);
      }

      if (zonesRes?.succeeded && Array.isArray(zonesRes.data)) {
        setSectorZones(zonesRes.data);
      } else if (Array.isArray(zonesRes?.data)) {
        setSectorZones(zonesRes.data);
      } else if (Array.isArray(zonesRes)) {
        setSectorZones(zonesRes);
      }

      if (commitmentsRes?.succeeded && Array.isArray(commitmentsRes.data)) {
        setCommitments(commitmentsRes.data);
      } else if (Array.isArray(commitmentsRes?.data)) {
        setCommitments(commitmentsRes.data);
      } else if (Array.isArray(commitmentsRes)) {
        setCommitments(commitmentsRes);
      }
    } catch {
      showToast('Error loading partner organization data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartnerData();
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (!registerForm.name.trim() || !registerForm.acronym.trim()) {
      setRegisterError('Organization name and acronym are required.');
      return;
    }
    try {
      const res = await partnerService.createPartner(registerForm);
      if (res?.succeeded && res.data) {
        setPartners(prev => [res.data, ...prev]);
        showToast(`Partner organization ${res.data.name} registered.`);
        setIsRegisterModalOpen(false);
        setRegisterForm({
          name: '',
          acronym: '',
          type: 'Humanitarian / First Response',
          leadContact: '',
          phone: '',
          email: '',
          mouStatus: 'Active MoU (2025-2027)',
          fieldTeamsCount: 5,
          fleetCount: 8
        });
        loadPartnerData();
        if (typeof onRefresh === 'function') onRefresh();
      } else {
        setRegisterError(res?.errors?.[0] || 'Unable to register organization.');
      }
    } catch (err) {
      setRegisterError(err?.message || 'Error registering organization.');
    }
  };

  const handleToggleVerification = async (partner) => {
    const isCurrentlyActive = partner.status?.includes('Active');
    const newStatus = isCurrentlyActive ? 'Under Review' : 'Active Response';
    try {
      await partnerService.updatePartnerStatus(partner.id, {
        status: newStatus,
        statusClass: isCurrentlyActive ? 'status-warning' : 'status-active',
        mouBadge: isCurrentlyActive ? 'badge-pending' : 'badge-verified'
      });
      setPartners(prev =>
        prev.map(p =>
          p.id === partner.id
            ? { ...p, status: newStatus, statusClass: isCurrentlyActive ? 'status-warning' : 'status-active' }
            : p
        )
      );
      showToast(`${partner.acronym} verification status updated to ${newStatus}.`);
      if (typeof onRefresh === 'function') onRefresh();
    } catch {
      showToast('Failed to update partner verification status.', 'error');
    }
  };

  const handleCommitmentSubmit = async (e) => {
    e.preventDefault();
    if (!commitmentForm.item || !commitmentForm.partnerOrganisationId) {
      showToast('Please specify the partner organization and commitment item.', 'error');
      return;
    }
    try {
      const res = await partnerService.logCommitment({
        ...commitmentForm,
        qty: Number(commitmentForm.qty),
        estimatedValueLkr: Number(commitmentForm.estimatedValueLkr)
      });
      if (res?.succeeded && res.data) {
        showToast('Relief commitment registered and queued for logistics dispatch.');
        setIsCommitmentModalOpen(false);
        loadPartnerData();
        if (typeof onRefresh === 'function') onRefresh();
      } else {
        showToast(res?.errors?.[0] || 'Error recording commitment.', 'error');
      }
    } catch {
      showToast('Failed to log partner commitment.', 'error');
    }
  };

  const handleZoneAssignSubmit = async (e) => {
    e.preventDefault();
    if (!zoneAssignForm.partnerOrganisationId || !zoneAssignForm.sectorZoneId) {
      showToast('Select both partner organization and sector zone.', 'error');
      return;
    }
    try {
      const res = await partnerService.assignPartnerToZone(zoneAssignForm);
      if (res?.succeeded !== false) {
        showToast('Partner deployed and registered to operational sector zone.');
        setIsAssignZoneModalOpen(false);
        loadPartnerData();
        if (typeof onRefresh === 'function') onRefresh();
      } else {
        showToast(res?.errors?.[0] || 'Failed to assign partner to zone.', 'error');
      }
    } catch {
      showToast('Failed to assign partner to sector zone.', 'error');
    }
  };

  const safePartners = Array.isArray(partners) ? partners : [];

  const filteredPartners = safePartners.filter(p => {
    if (!p) return false;
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch =
      !q ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.acronym && p.acronym.toLowerCase().includes(q)) ||
      (p.leadContact && p.leadContact.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && p.status && p.status.includes('Active')) ||
      (statusFilter === 'MOBILISING' && p.status && p.status.includes('Mobilis')) ||
      (statusFilter === 'REVIEW' && p.status && p.status.includes('Review'));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Partner Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-emerald-50 text-emerald-600">
            <Building2 size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Registered Organizations</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">{partners.length}</span>
            </div>
            <span className="adm-ss-kpi-trend text-emerald-600 font-medium text-[11px]">
              SLRCS, Sarvodaya, UNICEF, WFP & SJA
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-blue-50 text-blue-600">
            <Users size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Deployed Field Teams</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">
                {partners.reduce((sum, p) => sum + (p.fieldTeamsCount || 0), 0)}
              </span>
            </div>
            <span className="adm-ss-kpi-trend text-blue-600 font-medium text-[11px]">
              Trained first-response personnel
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-purple-50 text-purple-600">
            <Truck size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Partner Fleet Vehicles</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">
                {partners.reduce((sum, p) => sum + (p.fleetCount || 0), 0)}
              </span>
            </div>
            <span className="adm-ss-kpi-trend text-purple-600 font-medium text-[11px]">
              Ambulances, supply trucks & rescue boats
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-action-col flex items-center justify-center p-4 adm-ss-card bg-[#0e7490]/5 border border-[#0e7490]/20">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#0e7490] hover:bg-[#0b5f75] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Plus size={16} />
            <span>Register Partner Organization</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar & Quick Actions */}
      <div className="adm-ss-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search partner, acronym, lead..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white text-slate-700"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Operational Statuses</option>
              <option value="ACTIVE">Active Response</option>
              <option value="MOBILISING">Mobilising</option>
              <option value="REVIEW">Under Review</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCommitmentModalOpen(true)}
              className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Package size={14} className="text-[#0e7490]" />
              <span>Log Relief Commitment</span>
            </button>

            <button
              onClick={() => setIsAssignZoneModalOpen(true)}
              className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <MapPin size={14} className="text-emerald-600" />
              <span>Assign Sector Zone</span>
            </button>

            <button
              onClick={loadPartnerData}
              disabled={loading}
              className="adm-ss-btn-reset flex items-center gap-1.5"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Partner Directory Table */}
      <div className="adm-ss-card overflow-hidden">
        <div className="adm-ss-card-header">
          <div>
            <h3 className="adm-ss-card-title">Authorized Humanitarian Partner Organizations</h3>
            <p className="adm-ss-card-subtitle">
              Verified agencies, MoUs, field fleet allocations, and operational sector coverage
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredPartners.length} Organizations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="adm-ss-table w-full">
            <thead>
              <tr>
                <th>Partner Code & Agency</th>
                <th>Classification</th>
                <th>Lead Contact</th>
                <th>MoU & Verification</th>
                <th>Sector Zones</th>
                <th>Field Fleet</th>
                <th className="text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.length > 0 ? (
                filteredPartners.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">
                          {p.name} <span className="text-[#0e7490]">({p.acronym})</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{p.code}</span>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {p.type}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs">
                        <span className="font-medium text-slate-800 block">{p.leadContact || 'Operations Desk'}</span>
                        <span className="text-[11px] text-slate-500">{p.phone || p.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {p.mouStatus || 'Active Agreement'}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            p.status?.includes('Active') ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          ● {p.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.assignedZones && p.assignedZones.length > 0 ? (
                          p.assignedZones.map((z, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10.5px] font-medium"
                            >
                              {z}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">No active zones</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-700">
                        <span className="font-semibold">{p.fieldTeamsCount || 0} Teams</span>
                        <span className="text-slate-400 block text-[11px]">{p.fleetCount || 0} Vehicles</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleToggleVerification(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          p.status?.includes('Active')
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        }`}
                      >
                        {p.status?.includes('Active') ? 'Revoke / Review' : 'Verify Agency'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                    No partner organizations matching the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Active Sector Zones Breakdown */}
      <div className="adm-ss-card">
        <div className="adm-ss-card-header">
          <div>
            <h3 className="adm-ss-card-title flex items-center gap-2">
              <Layers size={16} className="text-[#0e7490]" />
              Sector Zones & Strategic Humanitarian Coverage
            </h3>
            <p className="adm-ss-card-subtitle">
              Geographical flood basins, priority zones, and lead coordinating agencies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {sectorZones.map((zone) => (
            <div
              key={zone.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-2"
            >
              <div className="flex items-start justify-between">
                <span className="font-bold text-xs text-slate-900 block leading-tight">{zone.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    zone.priorityStatus?.includes('Severe') || zone.priorityStatus?.includes('High')
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {zone.priorityStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">{zone.description}</p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Lead: {zone.leadAgency}</span>
                <span className="font-bold text-[#0e7490]">{zone.coveragePercent}% Coverage</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Register Partner Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-fade-scale">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0e7490]/10 text-[#0e7490] flex items-center justify-center font-bold">
                  <Plus size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Register Partner Organization</h4>
                  <span className="text-[11px] text-slate-500">Record agency mandate and legal framework MoU</span>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-5 space-y-3.5 text-xs">
              {registerError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span>{registerError}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Organization Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sri Lanka Red Cross Society"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={registerForm.name}
                    onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Acronym *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SLRCS"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={registerForm.acronym}
                    onChange={e => setRegisterForm({ ...registerForm, acronym: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Agency Classification</label>
                <select
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white text-slate-700"
                  value={registerForm.type}
                  onChange={e => setRegisterForm({ ...registerForm, type: e.target.value })}
                >
                  <option value="Humanitarian / First Response">Humanitarian / First Response</option>
                  <option value="UN Agency / Protection">UN Agency / Protection</option>
                  <option value="Community Relief & Volunteer Mobilisation">Community Relief & Volunteer Mobilisation</option>
                  <option value="Food Security & Supply Chain Logistics">Food Security & Supply Chain Logistics</option>
                  <option value="Emergency Medical & Paramedic">Emergency Medical & Paramedic</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lead Contact Person</label>
                  <input
                    type="text"
                    placeholder="Dr. Rohan Jayasinghe"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={registerForm.leadContact}
                    onChange={e => setRegisterForm({ ...registerForm, leadContact: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Official Phone</label>
                  <input
                    type="text"
                    placeholder="+94 11 269 1095"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={registerForm.phone}
                    onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">Field Teams</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={registerForm.fieldTeamsCount}
                    onChange={e => setRegisterForm({ ...registerForm, fieldTeamsCount: Number(e.target.value) })}
                  />
                </div>

                <div className="col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">Fleet Count</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={registerForm.fleetCount}
                    onChange={e => setRegisterForm({ ...registerForm, fleetCount: Number(e.target.value) })}
                  />
                </div>

                <div className="col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">MoU Framework</label>
                  <input
                    type="text"
                    placeholder="Active MoU"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={registerForm.mouStatus}
                    onChange={e => setRegisterForm({ ...registerForm, mouStatus: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0e7490] hover:bg-[#0b5f75] text-white font-semibold flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Register Agency</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Log Commitment Modal */}
      {isCommitmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-5 space-y-4 animate-fade-scale text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-900">Log Relief Supply Commitment</h4>
              <button onClick={() => setIsCommitmentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCommitmentSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Partner Organization *</label>
                <select
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white font-medium"
                  value={commitmentForm.partnerOrganisationId}
                  onChange={e => setCommitmentForm({ ...commitmentForm, partnerOrganisationId: e.target.value })}
                >
                  <option value="">Select Partner Agency...</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.acronym})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Item / Asset Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Drinking Water Carts"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                  value={commitmentForm.item}
                  onChange={e => setCommitmentForm({ ...commitmentForm, item: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Committed Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={commitmentForm.qty}
                    onChange={e => setCommitmentForm({ ...commitmentForm, qty: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Estimated Value (LKR)</label>
                  <input
                    type="number"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={commitmentForm.estimatedValueLkr}
                    onChange={e => setCommitmentForm({ ...commitmentForm, estimatedValueLkr: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Destination Sector Zone</label>
                <select
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white font-medium"
                  value={commitmentForm.destinationZone}
                  onChange={e => setCommitmentForm({ ...commitmentForm, destinationZone: e.target.value })}
                >
                  {sectorZones.map(z => (
                    <option key={z.id} value={z.zoneCode || z.name}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCommitmentModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#0e7490] text-white font-semibold">
                  Record Commitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Assign Zone Modal */}
      {isAssignZoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-5 space-y-4 animate-fade-scale text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-900">Assign Partner to Sector Zone</h4>
              <button onClick={() => setIsAssignZoneModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleZoneAssignSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Partner Organization *</label>
                <select
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white font-medium"
                  value={zoneAssignForm.partnerOrganisationId}
                  onChange={e => setZoneAssignForm({ ...zoneAssignForm, partnerOrganisationId: e.target.value })}
                >
                  <option value="">Select Partner...</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.acronym})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Sector Zone *</label>
                <select
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white font-medium"
                  value={zoneAssignForm.sectorZoneId}
                  onChange={e => setZoneAssignForm({ ...zoneAssignForm, sectorZoneId: e.target.value })}
                >
                  <option value="">Select Sector Zone...</option>
                  {sectorZones.map(z => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.zoneCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Operational Role</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Inundation First Aid Agency"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                  value={zoneAssignForm.operationalRole}
                  onChange={e => setZoneAssignForm({ ...zoneAssignForm, operationalRole: e.target.value })}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignZoneModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold">
                  Deploy to Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPartnersView;

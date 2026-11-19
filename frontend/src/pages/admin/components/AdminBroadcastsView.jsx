import React, { useState, useEffect } from 'react';
import {
  Radio,
  Send,
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  Filter,
  X,
  Check,
  ShieldAlert,
  Clock,
  Archive,
  Volume2
} from 'lucide-react';
import { adminService } from '../../../services/adminService';

const DISTRICT_OPTIONS = [
  'Western Province (All Districts)',
  'Colombo District (Lowlands & Kelani Basin)',
  'Gampaha District (Ja-Ela & Negombo)',
  'Kalutara District (Kalu Ganga Basin)',
  'Ratnapura District',
  'Galle District',
  'National All-Island Alert'
];

const SEVERITY_LEVELS = [
  { level: 'Emergency', badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  { level: 'Warning', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  { level: 'Advisory', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  { level: 'Info', badge: 'bg-slate-100 text-slate-700 border-slate-200' }
];

export const AdminBroadcastsView = ({ showToast, currentUser }) => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const [composeForm, setComposeForm] = useState({
    title: '',
    severity: 'Emergency',
    targetRegion: 'Colombo District (Lowlands & Kelani Basin)',
    channels: ['SMS Broadcast', 'Push Notification'],
    message: ''
  });
  const [composeError, setComposeError] = useState('');

  const loadBroadcasts = async () => {
    setLoading(true);
    try {
      const res = await adminService.getBroadcasts();
      if (res?.succeeded && Array.isArray(res.data)) {
        setBroadcasts(res.data);
      } else if (Array.isArray(res)) {
        setBroadcasts(res);
      }
    } catch {
      showToast('Error loading emergency broadcasts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBroadcasts();
  }, []);

  const handleComposeSubmit = async (e) => {
    e.preventDefault();
    setComposeError('');
    if (!composeForm.title.trim() || !composeForm.message.trim()) {
      setComposeError('Broadcast title and alert message are required.');
      return;
    }
    try {
      const res = await adminService.createBroadcast({
        title: composeForm.title.trim(),
        severity: composeForm.severity,
        targetRegion: composeForm.targetRegion,
        channels: composeForm.channels,
        message: composeForm.message.trim()
      });
      if (res?.succeeded && res.data) {
        setBroadcasts(prev => [res.data, ...prev]);
        showToast(`Emergency alert #${res.data.id.substring(0, 8)} transmitted across telecom gateways.`);
        setIsComposeOpen(false);
        setComposeForm({
          title: '',
          severity: 'Emergency',
          targetRegion: 'Colombo District (Lowlands & Kelani Basin)',
          channels: ['SMS Broadcast', 'Push Notification'],
          message: ''
        });
      } else {
        setComposeError(res?.errors?.[0] || 'Failed to dispatch broadcast.');
      }
    } catch (err) {
      setComposeError(err?.message || 'Error communicating with broadcast gateway.');
    }
  };

  const handleArchive = async (broadcastId) => {
    try {
      await adminService.archiveBroadcast(broadcastId);
      setBroadcasts(prev =>
        prev.map(b => (b.id === broadcastId ? { ...b, isActive: false, status: 'Archived / De-escalated' } : b))
      );
      showToast('Broadcast archived and de-escalated from public radar.');
    } catch {
      showToast('Failed to archive broadcast.', 'error');
    }
  };

  const toggleChannel = (channel) => {
    setComposeForm(prev => {
      const current = prev.channels || [];
      const updated = current.includes(channel)
        ? current.filter(c => c !== channel)
        : [...current, channel];
      return { ...prev, channels: updated };
    });
  };

  const safeBroadcasts = Array.isArray(broadcasts) ? broadcasts : [];

  const filteredBroadcasts = safeBroadcasts.filter(b => {
    if (!b) return false;
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch =
      !q ||
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.message && b.message.toLowerCase().includes(q)) ||
      (b.targetRegion && b.targetRegion.toLowerCase().includes(q));

    const matchesSeverity = severityFilter === 'ALL' || b.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const activeAlertsCount = safeBroadcasts.filter(b => b && b.isActive).length;

  return (
    <div className="space-y-6">
      {/* 1. Broadcast Telemetry KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-rose-50 text-rose-600">
            <Radio size={22} className="animate-pulse" />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Active Public Broadcasts</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-rose-700">{activeAlertsCount}</span>
            </div>
            <span className="adm-ss-kpi-trend text-rose-600 font-medium text-[11px]">
              Active across mobile gateways
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-blue-50 text-blue-600">
            <Send size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Gateway Delivery Rate</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-blue-700">99.4%</span>
            </div>
            <span className="adm-ss-kpi-trend text-blue-600 font-medium text-[11px]">
              SMS / Push Gateway Handshake
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Total Transmissions</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">{broadcasts.length}</span>
            </div>
            <span className="adm-ss-kpi-trend text-emerald-600 font-medium text-[11px]">
              Official administrative dispatches
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-action-col flex items-center justify-center p-4 adm-ss-card bg-[#0e7490]/5 border border-[#0e7490]/20">
          <button
            onClick={() => setIsComposeOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Radio size={16} />
            <span>Compose Emergency Broadcast</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Controls Bar */}
      <div className="adm-ss-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search alerts, keywords, districts..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white text-slate-700"
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
            >
              <option value="ALL">All Severity Levels</option>
              {SEVERITY_LEVELS.map(s => (
                <option key={s.level} value={s.level}>
                  {s.level}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={loadBroadcasts}
            disabled={loading}
            className="adm-ss-btn-reset flex items-center gap-1.5 self-end md:self-auto"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Broadcasts</span>
          </button>
        </div>
      </div>

      {/* 3. Broadcasts Stream Table */}
      <div className="adm-ss-card overflow-hidden">
        <div className="adm-ss-card-header">
          <div>
            <h3 className="adm-ss-card-title flex items-center gap-2">
              <Volume2 size={16} className="text-[#0e7490]" />
              Public Disaster Warnings & Multi-Channel Broadcast Ledger
            </h3>
            <p className="adm-ss-card-subtitle">
              Verified operational directives dispatched to citizens, response units, and media networks
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredBroadcasts.length} Dispatches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="adm-ss-table w-full">
            <thead>
              <tr>
                <th>Broadcast Alert & Scope</th>
                <th>Severity</th>
                <th>Target Region</th>
                <th>Channels & Delivery</th>
                <th>Dispatched By</th>
                <th>Sent Date</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBroadcasts.length > 0 ? (
                filteredBroadcasts.map(b => {
                  const severityObj = SEVERITY_LEVELS.find(s => s.level.toLowerCase() === b.severity?.toLowerCase()) || SEVERITY_LEVELS[0];

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="max-w-xs">
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">{b.title}</span>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{b.message}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${severityObj.badge}`}>
                          {b.severity}
                        </span>
                      </td>
                      <td className="text-xs text-slate-700 font-medium">{b.targetRegion}</td>
                      <td>
                        <div className="text-xs">
                          <span className="font-semibold text-slate-800">
                            {Array.isArray(b.channels) ? b.channels.join(' + ') : 'SMS + Push'}
                          </span>
                          <span className="text-[11px] text-emerald-600 block">
                            ✓ {b.deliveryRate || '99.4% Delivered'}
                          </span>
                        </div>
                      </td>
                      <td className="text-xs text-slate-600">{b.sentBy || 'Disaster Management Center'}</td>
                      <td className="text-xs text-slate-500">
                        {new Date(b.sentAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            b.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${b.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                          ></span>
                          {b.isActive ? 'Active Live' : 'Archived'}
                        </span>
                      </td>
                      <td className="text-right">
                        {b.isActive && (
                          <button
                            onClick={() => handleArchive(b.id)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                            title="De-escalate & Archive Alert"
                          >
                            <Archive size={12} />
                            <span>Archive</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 text-xs">
                    No broadcasts matching current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Compose Broadcast Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-fade-scale">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Radio size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Compose Emergency Broadcast</h4>
                  <span className="text-[11px] text-slate-500">Official multi-channel transmission gateway</span>
                </div>
              </div>
              <button onClick={() => setIsComposeOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleComposeSubmit} className="p-5 space-y-4 text-xs">
              {composeError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span>{composeError}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alert Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flash Flood Evacuation Notice - Kelani Valley"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                  value={composeForm.title}
                  onChange={e => setComposeForm({ ...composeForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Severity Level</label>
                  <select
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white text-slate-700"
                    value={composeForm.severity}
                    onChange={e => setComposeForm({ ...composeForm, severity: e.target.value })}
                  >
                    <option value="Emergency">Emergency (Immediate Hazard)</option>
                    <option value="Warning">Warning (Severe Condition)</option>
                    <option value="Advisory">Advisory (Precautionary)</option>
                    <option value="Info">Information (General Notice)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target District</label>
                  <select
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white text-slate-700"
                    value={composeForm.targetRegion}
                    onChange={e => setComposeForm({ ...composeForm, targetRegion: e.target.value })}
                  >
                    {DISTRICT_OPTIONS.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Transmission Channels</label>
                <div className="grid grid-cols-2 gap-2">
                  {['SMS Broadcast', 'Push Notification', 'Civil Defense Radio', 'Local Hub Sirens'].map(ch => {
                    const isSelected = composeForm.channels.includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => toggleChannel(ch)}
                        className={`p-2 rounded-lg border text-left flex items-center justify-between transition ${
                          isSelected
                            ? 'border-[#0e7490] bg-[#0e7490]/10 text-[#0e7490] font-semibold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{ch}</span>
                        {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Detailed Advisory Directive *</label>
                  <span className="text-[11px] text-slate-400">{composeForm.message.length} / 500 chars</span>
                </div>
                <textarea
                  rows={4}
                  required
                  maxLength={500}
                  placeholder="Clear, factual instructions for citizens: evacuation assembly points, emergency numbers, and safe routes."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] resize-none"
                  value={composeForm.message}
                  onChange={e => setComposeForm({ ...composeForm, message: e.target.value })}
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Send size={14} />
                  <span>Transmit Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBroadcastsView;

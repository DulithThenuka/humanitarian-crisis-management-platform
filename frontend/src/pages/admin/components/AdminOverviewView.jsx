import React from 'react';
import {
  ShieldAlert,
  ClipboardList,
  Package,
  Building2,
  Users,
  Gift,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Radio,
  ShieldCheck,
  Server,
  Database,
  ExternalLink
} from 'lucide-react';

export const AdminOverviewView = ({ stats = {}, broadcasts = [], loading, loadData, setActiveTab }) => {
  const s = stats || {};
  const formatLkr = (num) => {
    if (!num && num !== 0) return 'Rs. 0';
    return `Rs. ${Number(num).toLocaleString('en-LK')}`;
  };

  const shelterOccupancyPct = (s.totalShelterCapacity > 0)
    ? Math.round(((s.occupiedShelterBeds || 0) / s.totalShelterCapacity) * 100)
    : Math.round(s.shelterOccupancyRate || 0);

  const liveBroadcasts = Array.isArray(broadcasts)
      ? broadcasts.filter(b => (b.isActive === true || b.isActive === 1) && b.status === 'Active Live')
      : [];
  const liveBroadcastsCount = Array.isArray(broadcasts) && broadcasts.length > 0
    ? liveBroadcasts.length
    : (stats.liveEmergencyBroadcasts ?? 0);

  return (
    <div className="space-y-6">
      {/* 1. Primary Operational KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Crises */}
        <div className="adm-ss-kpi-card hover:shadow-md transition-shadow">
          <div className="adm-ss-kpi-icon-box bg-rose-50 text-rose-600">
            <ShieldAlert size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Active Crises</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-rose-700">{stats.activeCrises ?? 0}</span>
              <span className="text-xs text-slate-500 ml-2">/ {stats.totalCrises ?? 0} Total</span>
            </div>
            <span className="adm-ss-kpi-trend text-rose-600 font-medium text-[11px]">
              {stats.criticalSeverityCrises ?? 0} Active Critical Levels (Red Alert L4-5)
            </span>
          </div>
        </div>

        {/* Assistance Requests */}
        <div className="adm-ss-kpi-card hover:shadow-md transition-shadow">
          <div className="adm-ss-kpi-icon-box bg-indigo-50 text-indigo-600">
            <ClipboardList size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Assistance Requests</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-indigo-700">{stats.totalAssistanceRequests ?? 0}</span>
              <span className="text-xs text-slate-500 ml-2">Logged in DB</span>
            </div>
            <span className="adm-ss-kpi-trend text-indigo-600 font-medium text-[11px]">
              {stats.pendingAssistanceRequests ?? 0} Pending Immediate Action
            </span>
          </div>
        </div>

        {/* Resources Available & Deployed */}
        <div className="adm-ss-kpi-card hover:shadow-md transition-shadow">
          <div className="adm-ss-kpi-icon-box bg-emerald-50 text-emerald-600">
            <Package size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Resources Inventory</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-emerald-700">
                {(stats.resourcesAvailableQuantity ?? 0).toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 ml-2">Units Avail.</span>
            </div>
            <span className="adm-ss-kpi-trend text-emerald-600 font-medium text-[11px]">
              {(stats.resourcesAllocatedQuantity ?? 0).toLocaleString()} Units Deployed
            </span>
          </div>
        </div>

        {/* Shelter Occupancy */}
        <div className="adm-ss-kpi-card hover:shadow-md transition-shadow">
          <div className="adm-ss-kpi-icon-box bg-amber-50 text-amber-600">
            <Building2 size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Shelter Capacity</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-amber-700">{stats.occupiedShelterBeds ?? 0}</span>
              <span className="text-xs text-slate-500 ml-2">/ {stats.totalShelterCapacity ?? 0} Beds</span>
            </div>
            <span className="adm-ss-kpi-trend text-amber-600 font-medium text-[11px]">
              {stats.availableShelterBeds ?? 0} Beds Available ({shelterOccupancyPct}% Occupied)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Volunteers */}
        <div className="adm-ss-kpi-card hover:shadow-md transition-shadow">
          <div className="adm-ss-kpi-icon-box bg-blue-50 text-blue-600">
            <Users size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Registered Volunteers</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-blue-700">{stats.totalVolunteers ?? 0}</span>
              <span className="text-xs text-slate-500 ml-2">On Roster</span>
            </div>
            <span className="adm-ss-kpi-trend text-green-600 font-medium text-[11px]">
              {stats.activeVolunteers ?? 0} Verified Active & Ready
            </span>
          </div>
        </div>

        {/* Donations & Grants */}
        <div className="adm-ss-kpi-card hover:shadow-md transition-shadow">
          <div className="adm-ss-kpi-icon-box bg-teal-50 text-teal-600">
            <Gift size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Relief Funds & Grants</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-teal-700">
                {formatLkr(stats.totalDonationsAmount ?? 0)}
              </span>
            </div>
            <span className="adm-ss-kpi-trend text-teal-600 font-medium text-[11px]">
              {stats.verifiedDonationsCount ?? 0} of {stats.totalDonationsCount ?? 0} Grants Cleared
            </span>
          </div>
        </div>

        {/* System Users */}
        <div className="adm-ss-kpi-card hover:shadow-md transition-shadow">
          <div className="adm-ss-kpi-icon-box bg-purple-50 text-purple-600">
            <Users size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Active System Users</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-purple-700">{stats.totalUsers ?? 0}</span>
              <span className="text-xs text-slate-500 ml-2">Accounts</span>
            </div>
            <span className="adm-ss-kpi-trend text-purple-600 font-medium text-[11px]">
              {stats.activeSessions ?? 0} Operational Roles
            </span>
          </div>
        </div>

        {/* System Health */}
        <div className="adm-ss-kpi-card hover:shadow-md transition-shadow">
          <div className="adm-ss-kpi-icon-box bg-emerald-50 text-emerald-600">
            <Activity size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Platform Health</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-emerald-700">
                {stats.systemHealth?.status === 'Healthy' ? 'Operational' : (stats.systemHealth?.status || 'Active')}
              </span>
              <span className="text-xs text-slate-500 ml-2">
                {stats.databaseLatencyMs ? `${stats.databaseLatencyMs}ms Latency` : 'Connected'}
              </span>
            </div>
            <span className="adm-ss-kpi-trend text-emerald-600 font-medium text-[11px]">
              MSSQL LocalDB Online {typeof stats.securityStats?.totalAuditLogs === 'number'
                ? `(${stats.securityStats.totalAuditLogs} Audits Verified)`
                : (loading ? '(Loading Audits...)' : '(Audits Unavailable)')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Split Layout: Emergency Activities & Operational Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Emergency Activities */}
        <div className="lg:col-span-2 adm-ss-card">
          <div className="adm-ss-card-header">
            <div>
              <h3 className="adm-ss-card-title flex items-center gap-2">
                <Clock size={16} className="text-[#0e7490]" />
                Recent Emergency Incidents & Activities
              </h3>
              <p className="adm-ss-card-subtitle">
                Live field log entries streamed from the centralized incident management database
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="adm-ss-btn-reset flex items-center gap-1.5"
              title="Refresh Data"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="adm-ss-table w-full">
              <thead>
                <tr>
                  <th>Incident / Event</th>
                  <th>Category</th>
                  <th>Operational Area</th>
                  <th>Priority</th>
                  <th>Logged Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(s.recentActivities) && s.recentActivities.length > 0 ? (
                  s.recentActivities.map((act) => (
                    <tr key={act.id}>
                      <td className="font-medium text-slate-900">{act.title}</td>
                      <td>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {act.activityType}
                        </span>
                      </td>
                      <td className="text-slate-600 text-[12px]">{act.district}</td>
                      <td>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${act.severity === 'Critical' || act.severity === '3'
                              ? 'bg-rose-100 text-rose-700'
                              : act.severity === 'High' || act.severity === '2'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                        >
                          {act.severity === '3' ? 'Critical' : act.severity === '2' ? 'High' : act.severity}
                        </span>
                      </td>
                      <td className="text-slate-500 text-[12px]">
                        {new Date(act.timestamp).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <button
                          onClick={() => setActiveTab('crisis')}
                          className="text-[#0e7490] hover:text-[#0b5f75] font-semibold text-xs flex items-center gap-1"
                        >
                          Inspect <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      No emergency incidents recorded in the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 Col): Pending Actions & Critical Warnings */}
        <div className="space-y-4">
          {/* Critical Alerts Card */}
          <div className="adm-ss-card border-l-4 border-l-rose-500">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio size={18} className="text-rose-600 animate-pulse" />
                <h4 className="font-semibold text-sm text-slate-900">Active Emergency Broadcasts</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                {liveBroadcastsCount} Live Alerts
              </span>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              {liveBroadcasts.length > 0 ? (
                liveBroadcasts.slice(0, 2).map((b) => (
                  <div
                    key={b.id}
                    className={`p-2.5 rounded-lg border text-left ${b.severity === 'Emergency' ? 'bg-rose-50 border-rose-100 text-rose-900' :
                        b.severity === 'Warning' ? 'bg-amber-50 border-amber-100 text-amber-900' :
                          'bg-blue-50 border-blue-100 text-blue-900'
                      }`}
                  >
                    <span className="font-bold block mb-1">{b.title}</span>
                    <p className={`text-[11px] leading-relaxed m-0 ${b.severity === 'Emergency' ? 'text-rose-700' :
                        b.severity === 'Warning' ? 'text-amber-700' : 'text-blue-700'
                      }`}>
                      {b.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-slate-500">
                  No active emergency broadcasts at this time.
                </div>
              )}

              <button
                onClick={() => setActiveTab('broadcasts')}
                className="w-full py-2 px-3 rounded-lg bg-[#0e7490] text-white font-medium text-xs hover:bg-[#0b5f75] transition flex items-center justify-center gap-1.5"
              >
                <span>Manage Emergency Broadcasts</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Quick Operations Navigation */}
          <div className="adm-ss-card">
            <h4 className="font-semibold text-sm text-slate-900 pb-3 border-b border-slate-100">
              Administrative Quick Actions
            </h4>
            <div className="space-y-2 pt-3">
              <button
                onClick={() => setActiveTab('users')}
                className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-between transition text-left"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#0e7490]" />
                  Manage User Accounts & RBAC
                </span>
                <ArrowRight size={13} className="text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('partners')}
                className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-between transition text-left"
              >
                <span className="flex items-center gap-2">
                  <Building2 size={15} className="text-emerald-600" />
                  Partner Organizations & Zones
                </span>
                <ArrowRight size={13} className="text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('maps')}
                className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-between transition text-left"
              >
                <span className="flex items-center gap-2">
                  <MapPin size={15} className="text-sky-600" />
                  Launch Interactive GIS Crisis Radar
                </span>
                <ArrowRight size={13} className="text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('health')}
                className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-between transition text-left"
              >
                <span className="flex items-center gap-2">
                  <Activity size={15} className="text-purple-600" />
                  System Diagnostics & Database Health
                </span>
                <ArrowRight size={13} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewView;

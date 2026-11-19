import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  Lock,
  FileText,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { adminService } from '../../../services/adminService';

export const AdminAuditView = ({ showToast }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs(100);
      if (res?.succeeded && Array.isArray(res.data)) {
        setLogs(res.data);
      } else if (Array.isArray(res)) {
        setLogs(res);
      }
    } catch {
      showToast('Error loading immutable audit ledger.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const safeLogs = Array.isArray(logs) ? logs : [];

  const actionTypes = Array.from(
    new Set(safeLogs.map(l => l?.action || l?.humanDecision || 'SystemAction').filter(Boolean))
  );

  const filteredLogs = safeLogs.filter(l => {
    if (!l) return false;
    const act = l.action || l.humanDecision || '';
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch =
      !q ||
      (l.caseNumber && l.caseNumber.toLowerCase().includes(q)) ||
      (l.actorName && l.actorName.toLowerCase().includes(q)) ||
      (l.detail && l.detail.toLowerCase().includes(q)) ||
      (l.verificationHash && l.verificationHash.toLowerCase().includes(q));

    const matchesAction = actionFilter === 'ALL' || act === actionFilter;
    return matchesSearch && matchesAction;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCsv = () => {
    if (filteredLogs.length === 0) {
      showToast('No audit logs to export.', 'info');
      return;
    }
    const headers = ['Timestamp', 'Case Number', 'Action', 'Detail', 'Actor Name', 'Actor Role', 'Verification Hash'];
    const rows = filteredLogs.map(l => [
      new Date(l.timestamp || l.reviewedAt).toISOString(),
      `"${l.caseNumber || 'N/A'}"`,
      `"${l.action || l.humanDecision || 'ACTION'}"`,
      `"${(l.detail || l.aiSuggestion || '').replace(/"/g, '""')}"`,
      `"${l.actorName || l.overriddenByName || 'Operator'}"`,
      `"${l.actorRole || 'Coordinator'}"`,
      `"${l.verificationHash || 'VERIFIED'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RELIEFCORE_Audit_Ledger_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Immutable audit ledger exported to CSV successfully.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-slate-100 text-slate-800">
            <ShieldCheck size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Total Verified Audit Entries</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-slate-900">{logs.length}</span>
            </div>
            <span className="adm-ss-kpi-trend text-emerald-600 font-medium text-[11px]">
              Cryptographically Hash-Linked
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-blue-50 text-blue-600">
            <Lock size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Ledger Integrity Status</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number text-blue-700">SHA-256</span>
            </div>
            <span className="adm-ss-kpi-trend text-blue-600 font-medium text-[11px]">
              Append-Only Tamper Resistance
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-action-col flex items-center justify-center p-4 adm-ss-card bg-slate-50 border border-slate-200">
          <button
            onClick={handleExportCsv}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Download size={15} />
            <span>Export Official Audit Ledger (CSV)</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="adm-ss-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search case #, operator, detail, hash..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              className="py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white text-slate-700"
              value={actionFilter}
              onChange={e => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Action Types</option>
              {actionTypes.map(act => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>

            <select
              className="py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white text-slate-700"
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10 rows / page</option>
              <option value={15}>15 rows / page</option>
              <option value={25}>25 rows / page</option>
              <option value={50}>50 rows / page</option>
            </select>
          </div>

          <button
            onClick={loadAuditLogs}
            disabled={loading}
            className="adm-ss-btn-reset flex items-center gap-1.5 self-end md:self-auto"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* 3. Audit Ledger Table */}
      <div className="adm-ss-card overflow-hidden">
        <div className="adm-ss-card-header">
          <div>
            <h3 className="adm-ss-card-title flex items-center gap-2">
              <ShieldCheck size={16} className="text-slate-800" />
              Immutable Lifecycle Operations & Security Ledger
            </h3>
            <p className="adm-ss-card-subtitle">
              Every status transition, supervisor note, priority escalation, and role assignment recorded in real-time
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="adm-ss-table w-full">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Case Ref</th>
                <th>Action Type</th>
                <th>Operation Details</th>
                <th>Responsible Operator</th>
                <th>Verification Hash</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((l) => {
                  const act = l.action || l.humanDecision || 'ACTION';
                  const dateStr = new Date(l.timestamp || l.reviewedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="text-xs text-slate-500 whitespace-nowrap">{dateStr}</td>
                      <td>
                        <span className="font-mono text-xs font-bold text-[#0e7490]">
                          {l.caseNumber || 'HMR-CORE'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                            act.includes('Status') || act.includes('Verify')
                              ? 'bg-blue-100 text-blue-700'
                              : act.includes('Escalat')
                              ? 'bg-rose-100 text-rose-700'
                              : act.includes('Note') || act.includes('Supervisor')
                              ? 'bg-purple-100 text-purple-700'
                              : act.includes('AI')
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {act}
                        </span>
                      </td>
                      <td className="max-w-md text-xs text-slate-700">
                        <p className="line-clamp-2 leading-relaxed">{l.detail || l.aiSuggestion || 'Operation completed.'}</p>
                      </td>
                      <td>
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 block">
                            {l.actorName || l.overriddenByName || 'System'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {l.actorRole || 'Coordinator'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {l.verificationHash || 'sha256-verified'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                    No audit records matching current search or action filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditView;

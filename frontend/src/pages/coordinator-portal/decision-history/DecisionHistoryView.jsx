import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  Search,
  Download,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  Clock,
  UserCheck
} from 'lucide-react';
import { DECISION_HISTORY_DATA } from '../data/coordinatorPortalData';
import './DecisionHistoryView.css';

export const DecisionHistoryView = ({ showToast }) => {
  const [records, setRecords] = useState(DECISION_HISTORY_DATA.records);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [selectedRecordModal, setSelectedRecordModal] = useState(null);

  const { summary } = DECISION_HISTORY_DATA;

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchSearch =
        !searchQuery ||
        rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.relatedRecord.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.coordinator.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === 'all' || rec.category === categoryFilter;
      const matchResult = resultFilter === 'all' || rec.status.toLowerCase() === resultFilter.toLowerCase();

      return matchSearch && matchCategory && matchResult;
    });
  }, [records, searchQuery, categoryFilter, resultFilter]);

  return (
    <div className="ec-portal-canvas">
      {/* 1. Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">TRACEABLE COORDINATOR ACTIONS</span>
          <h2 className="ec-review-main-title">Decision History</h2>
          <p className="ec-review-sub-meta">
            Every entry links to its related request, incident, AI review or allocation record.
          </p>
        </div>
        <button
          className="ec-btn-action-primary"
          onClick={() => showToast('Exporting encrypted coordinator decision log (JSON/CSV)...', 'info')}
        >
          <Download size={14} />
          <span>Export history</span>
        </button>
      </div>

      {/* 2. Top Summary Metrics */}
      <div className="ec-history-summary-grid">
        <div className="ec-hsum-card">
          <span className="ec-hsum-lbl">Decisions today</span>
          <span className="ec-hsum-val">{summary.decisionsToday}</span>
        </div>
        <div className="ec-hsum-card">
          <span className="ec-hsum-lbl">AI reviews</span>
          <span className="ec-hsum-val">{summary.aiReviews}</span>
        </div>
        <div className="ec-hsum-card">
          <span className="ec-hsum-lbl">Escalations</span>
          <span className="ec-hsum-val" style={{ color: '#dc2626' }}>{summary.escalations}</span>
        </div>
      </div>

      {/* 3. Filter Toolbar */}
      <div className="ec-rc-toolbar-container" style={{ padding: '12px 18px', marginBottom: '18px' }}>
        <div className="ec-rc-filter-bar">
          <div className="ec-rc-search-box">
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search history, request or incident..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ec-rc-search-input"
            />
            {searchQuery && (
              <X size={14} className="ec-rc-search-clear" onClick={() => setSearchQuery('')} />
            )}
          </div>

          <div className="ec-rc-select-group">
            <select
              className="ec-rc-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All categories</option>
              <option value="Resource">Resource</option>
              <option value="AI Review">AI Review</option>
              <option value="Request">Request</option>
              <option value="Incident">Incident</option>
              <option value="Shelter">Shelter</option>
              <option value="Volunteer">Volunteer</option>
            </select>

            <select
              className="ec-rc-select"
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
            >
              <option value="all">Result: All</option>
              <option value="approved">Approved</option>
              <option value="accepted">Accepted</option>
              <option value="verified">Verified</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Decision History Table */}
      <div className="ec-table-container">
        <table className="ec-data-table">
          <thead>
            <tr>
              <th>REFERENCE</th>
              <th>ACTION</th>
              <th>RELATED RECORD</th>
              <th>COORDINATOR</th>
              <th>STATUS / RESULT</th>
              <th>TIME</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec) => (
              <tr key={rec.id} onClick={() => setSelectedRecordModal(rec)}>
                <td className="ec-table-req-id">{rec.id}</td>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>{rec.action}</td>
                <td style={{ color: '#0284c7', fontWeight: 600, fontFamily: 'monospace' }}>
                  {rec.relatedRecord}
                </td>
                <td style={{ color: '#334155' }}>{rec.coordinator}</td>
                <td>
                  <span className={`ec-svc-status-pill ${rec.status === 'Escalated' ? 'pill-critical' : 'pill-available'}`}>
                    <span className="ec-rc-status-dot"></span>
                    {rec.status}
                  </span>
                </td>
                <td style={{ color: '#64748b', fontWeight: 600 }}>{rec.time}</td>
                <td>
                  <ChevronRight size={16} className="ec-rc-chevron" />
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan="7" className="ec-rc-empty-state">
                  No decision log entries match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Decision Detail Modal */}
      {selectedRecordModal && (
        <div className="ec-modal-overlay" onClick={() => setSelectedRecordModal(null)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">IMMUTABLE AUDIT LOG</span>
                <h3 className="ec-modal-title">{selectedRecordModal.id} — {selectedRecordModal.action}</h3>
              </div>
              <button className="ec-modal-close-btn" onClick={() => setSelectedRecordModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ec-modal-body-pad">
              <div className="ec-suitability-hud">
                <div className="ec-hud-pill">
                  <span>Timestamp:</span>
                  <strong>Today at {selectedRecordModal.time}</strong>
                </div>
                <div className="ec-hud-pill">
                  <span>Coordinator:</span>
                  <strong>{selectedRecordModal.coordinator}</strong>
                </div>
                <div className="ec-hud-pill">
                  <span>Linked Target:</span>
                  <strong>{selectedRecordModal.relatedRecord}</strong>
                </div>
              </div>

              <div className="ec-factor-row" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
                <ShieldCheck size={18} color="#0284c7" />
                <span style={{ fontSize: '12.5px', color: '#0369a1' }}>
                  <strong>SHA-256 Audit Integrity:</strong> Record signed with authorised coordinator digital certificate. Verified against National Crisis Ledger.
                </span>
              </div>
            </div>

            <div className="ec-modal-footer">
              <button
                type="button"
                className="ec-btn-modal-cancel"
                onClick={() => setSelectedRecordModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="ec-btn-action-primary"
                onClick={() => {
                  showToast(`Opened inspection details for ${selectedRecordModal.relatedRecord}`, 'info');
                  setSelectedRecordModal(null);
                }}
              >
                <span>Inspect Linked Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

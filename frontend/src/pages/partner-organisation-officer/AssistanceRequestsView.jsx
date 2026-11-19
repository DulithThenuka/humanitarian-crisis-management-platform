import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  MessageSquarePlus,
  AlertTriangle,
  PackagePlus,
  Download,
  GitPullRequest,
  Lock
} from 'lucide-react';
import {
  formatShortCode,
  formatDateTime,
  getRequestStatusLabel,
  getPriorityLabel,
  getRequestStatusBadgeClass,
  getPriorityBadgeClass,
  exportToCsv
} from './partnerOfficerUtils';

const PAGE_SIZE = 8;

export const AssistanceRequestsView = ({
  requests = [],
  selectedRequestId,
  setSelectedRequestId,
  canManageRequests = false,
  onVerifyRequest,
  onUpdateRequestStatus,
  onAddRequestNote,
  onEscalateRequest,
  onPledgeForRequest,
  globalSearch = '',
  loading = false,
  submitting = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [noteText, setNoteText] = useState('');
  const [page, setPage] = useState(1);

  const effectiveSearch = (searchTerm || globalSearch || '').trim().toLowerCase();

  const normalizedRequests = useMemo(() => {
    return requests.map((r) => {
      const statusLabel = getRequestStatusLabel(r.status);
      const priorityLabel = getPriorityLabel(r.urgency);
      return {
        ...r,
        shortId: formatShortCode(r.id, 'REQ'),
        statusLabel,
        priorityLabel,
        statusBadge: getRequestStatusBadgeClass(statusLabel),
        priorityBadge: getPriorityBadgeClass(priorityLabel)
      };
    });
  }, [requests]);

  const filtered = useMemo(() => {
    return normalizedRequests
      .filter((r) => {
        if (statusFilter !== 'All' && r.statusLabel.toLowerCase() !== statusFilter.toLowerCase()) return false;
        if (priorityFilter !== 'All' && r.priorityLabel.toLowerCase() !== priorityFilter.toLowerCase()) return false;
        if (effectiveSearch) {
          const hay = `${r.shortId} ${r.id} ${r.category} ${r.description} ${r.address || ''} ${r.crisisEventTitle || ''} ${r.requestorName || ''}`.toLowerCase();
          if (!hay.includes(effectiveSearch)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [normalizedRequests, statusFilter, priorityFilter, effectiveSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const selectedRequest = filtered.find((r) => r.id === selectedRequestId) || paged[0] || filtered[0] || null;

  const handleExport = () => {
    const headers = ['Request ID', 'Crisis Event', 'Category', 'Description', 'People Affected', 'Priority', 'Location', 'Status', 'Created At'];
    const rows = filtered.map((r) => [
      r.shortId,
      r.crisisEventTitle || 'General Response',
      r.category,
      r.description,
      r.numberOfPeople,
      r.priorityLabel,
      r.address || 'Not specified',
      r.statusLabel,
      formatDateTime(r.createdAt)
    ]);
    exportToCsv(`Assistance_Requests_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const handleNoteSubmit = async () => {
    if (!selectedRequest || !noteText.trim()) return;
    const ok = await onAddRequestNote(selectedRequest.id, noteText.trim());
    if (ok) setNoteText('');
  };

  return (
    <div className="po-workspace">
      {/* Header */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>HUMANITARIAN ASSISTANCE DEMANDS</span>
          </div>
          <h1 className="po-title">Assistance Requests</h1>
          <p className="po-subtitle">
            Review verified citizen and field assistance requests, record operational notes, or pledge partner resources.
          </p>
        </div>

        <div className="po-title-actions">
          <button
            type="button"
            className="po-btn po-btn-secondary"
            onClick={handleExport}
            disabled={filtered.length === 0}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="po-filter-bar" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className="po-filter-search" style={{ minWidth: '220px', flex: '1 1 220px' }}>
          <Search size={14} className="po-search-icon" />
          <input
            type="text"
            placeholder="Search request ID, category, location, crisis..."
            className="po-search-input"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        <div className="po-filter-selects">
          <select
            className="po-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Verified">Verified</option>
            <option value="InProgress">InProgress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            className="po-select"
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading && requests.length === 0 ? (
        <div className="po-panel" style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
          Loading assistance requests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="po-panel" style={{ padding: '44px', textAlign: 'center' }}>
          <GitPullRequest size={28} color="#657367" style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '0 0 6px 0', color: '#162e20', fontSize: '16px' }}>No assistance requests found</h3>
          <p style={{ margin: 0, color: '#657367', fontSize: '13px' }}>
            No assistance requests match your current search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="po-split-layout">
          {/* Table */}
          <div style={{ flex: '1 1 58%', minWidth: 0 }}>
            <div className="po-table-container">
              <table className="po-data-table">
                <thead>
                  <tr>
                    <th>REQUEST</th>
                    <th>CRISIS / LOCATION</th>
                    <th>NEED &amp; SCALE</th>
                    <th>PRIORITY</th>
                    <th>CREATED</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((req) => {
                    const isSelected = req.id === selectedRequest?.id;
                    return (
                      <tr
                        key={req.id}
                        className={isSelected ? 'selected' : ''}
                        onClick={() => setSelectedRequestId && setSelectedRequestId(req.id)}
                      >
                        <td>
                          <span className="po-cell-record-id" title={req.id}>{req.shortId}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#162e20' }}>
                            {req.crisisEventTitle || 'General Response'}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#657367' }}>
                            {req.address || 'Location not specified'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#162e20' }}>{req.category}</div>
                          <div style={{ fontSize: '11.5px', color: '#657367' }}>
                            {req.numberOfPeople || 1} people affected
                          </div>
                        </td>
                        <td>
                          <span className={`po-status-badge ${req.priorityBadge}`}>
                            ● {req.priorityLabel}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: '#657367', fontSize: '12px' }}>{formatDateTime(req.createdAt)}</span>
                        </td>
                        <td>
                          <span className={`po-status-badge ${req.statusBadge}`}>
                            ● {req.statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '12.5px', color: '#657367' }}>
                <span>
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} requests
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="po-btn po-btn-secondary"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="po-btn po-btn-secondary"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Request Details & Actions */}
          {selectedRequest && (
            <div className="po-detail-card">
              <div className="po-detail-header-row">
                <span className="po-detail-id" title={selectedRequest.id}>{selectedRequest.shortId}</span>
                <span className={`po-status-badge ${selectedRequest.statusBadge}`}>
                  ● {selectedRequest.statusLabel}
                </span>
              </div>

              <div className="po-detail-title">{selectedRequest.category}</div>
              <div className="po-detail-subtitle">
                {selectedRequest.crisisEventTitle || 'General Humanitarian Response'}
              </div>

              <p style={{ fontSize: '13px', color: '#243328', lineHeight: 1.5, margin: '10px 0 14px 0', padding: '10px 12px', backgroundColor: '#f8faf7', borderRadius: '8px', border: '1px solid #edf1eb' }}>
                {selectedRequest.description}
              </p>

              <div className="po-detail-grid">
                <div className="po-detail-field">
                  <span className="po-detail-label">Priority</span>
                  <span className="po-detail-val">{selectedRequest.priorityLabel}</span>
                </div>
                <div className="po-detail-field">
                  <span className="po-detail-label">People Affected</span>
                  <span className="po-detail-val">{selectedRequest.numberOfPeople || 1}</span>
                </div>
                <div className="po-detail-field">
                  <span className="po-detail-label">Location</span>
                  <span className="po-detail-val">{selectedRequest.address || 'Not specified'}</span>
                </div>
                <div className="po-detail-field">
                  <span className="po-detail-label">Submitted</span>
                  <span className="po-detail-val">{formatDateTime(selectedRequest.createdAt)}</span>
                </div>
              </div>

              {/* Pledge Contribution directly for this request */}
              <div style={{ marginTop: '14px', marginBottom: '14px' }}>
                <button
                  type="button"
                  className="po-btn po-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onPledgeForRequest({
                    item: `${selectedRequest.category} for ${selectedRequest.shortId}`,
                    qty: Math.max(1, Number(selectedRequest.numberOfPeople) || 10),
                    destinationZone: selectedRequest.address || ''
                  })}
                >
                  <PackagePlus size={14} />
                  <span>Pledge Resource Contribution</span>
                </button>
              </div>

              {/* Role-gated Coordinator/Admin workflow actions */}
              {canManageRequests ? (
                <>
                  <div className="po-note-section">
                    <label className="po-note-label">OPERATIONAL NOTE / CLARIFICATION REASON</label>
                    <textarea
                      className="po-note-textarea"
                      placeholder="Enter verification note, clarification request, or escalation reason..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="po-detail-actions">
                    {selectedRequest.statusLabel === 'Submitted' && (
                      <button
                        type="button"
                        className="po-btn po-btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => onVerifyRequest(selectedRequest.id, noteText.trim() || 'Verified by Partner Officer')}
                        disabled={submitting}
                      >
                        <CheckCircle2 size={14} />
                        <span>Verify &amp; Accept Request</span>
                      </button>
                    )}

                    {['Submitted', 'Verified'].includes(selectedRequest.statusLabel) && (
                      <button
                        type="button"
                        className="po-btn po-btn-secondary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => onUpdateRequestStatus(selectedRequest.id, 2)}
                        disabled={submitting}
                      >
                        <span>Confirm Support (Mark In Progress)</span>
                      </button>
                    )}

                    {selectedRequest.statusLabel === 'InProgress' && (
                      <button
                        type="button"
                        className="po-btn po-btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => onUpdateRequestStatus(selectedRequest.id, 3)}
                        disabled={submitting}
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Request Resolved</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="po-btn po-btn-secondary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={handleNoteSubmit}
                      disabled={submitting || !noteText.trim()}
                    >
                      <MessageSquarePlus size={14} />
                      <span>Log Clarification / Note</span>
                    </button>

                    {!['Resolved', 'Closed'].includes(selectedRequest.statusLabel) && (
                      <button
                        type="button"
                        className="po-btn po-btn-secondary"
                        style={{ width: '100%', justifyContent: 'center', color: '#b45309', borderColor: '#fde68a' }}
                        onClick={() => onEscalateRequest(selectedRequest.id, noteText.trim() || 'Escalated for urgent partner coordination')}
                        disabled={submitting}
                      >
                        <AlertTriangle size={14} />
                        <span>Escalate Request</span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#edf2e8',
                    border: '1px solid #dbe4c6',
                    fontSize: '12px',
                    color: '#2f4033'
                  }}
                >
                  <Lock size={14} />
                  <span>Request status transitions require Coordinator or Admin authorization. You can still pledge resource contributions above.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssistanceRequestsView;

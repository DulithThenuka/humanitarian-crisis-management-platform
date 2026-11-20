import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit3,
  CheckCircle2,
  XCircle,
  Truck,
  Download,
  Package
} from 'lucide-react';
import {
  formatShortCode,
  formatDateTime,
  inferResourceCategory,
  getCommitmentStatusMeta,
  exportToCsv
} from './partnerOfficerUtils';

const PAGE_SIZE = 8;

export const ResourceContributionsView = ({
  partner = null,
  commitments = [],
  zones = [],
  selectedCommitmentId,
  setSelectedCommitmentId,
  onOpenCreateModal,
  onOpenEditModal,
  onUpdateCommitmentStatus,
  onNavigateToTracking,
  globalSearch = '',
  loading = false,
  submitting = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [scopeAllPartners, setScopeAllPartners] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null); // { id, targetStatus, label }

  const effectiveSearch = (searchTerm || globalSearch || '').trim().toLowerCase();

  const scopedCommitments = useMemo(() => {
    const base = scopeAllPartners || !partner
      ? commitments
      : commitments.filter((c) => c.partnerOrganisationId === partner.id);

    return base.map((c) => ({
      ...c,
      shortId: formatShortCode(c.id, 'COM'),
      category: inferResourceCategory(c.item),
      statusMeta: getCommitmentStatusMeta(c.status)
    }));
  }, [commitments, partner, scopeAllPartners]);

  const uniqueStatuses = useMemo(
    () => Array.from(new Set(scopedCommitments.map((c) => c.status).filter(Boolean))).sort(),
    [scopedCommitments]
  );

  const uniqueCategories = useMemo(
    () => Array.from(new Set(scopedCommitments.map((c) => c.category))).sort(),
    [scopedCommitments]
  );

  const uniqueZones = useMemo(
    () => Array.from(new Set([
      ...zones.map((z) => z.zoneCode).filter(Boolean),
      ...scopedCommitments.map((c) => c.destinationZone).filter(Boolean)
    ])).sort(),
    [zones, scopedCommitments]
  );

  const filtered = useMemo(() => {
    const list = scopedCommitments.filter((c) => {
      if (statusFilter !== 'All' && c.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
      if (zoneFilter !== 'All' && c.destinationZone !== zoneFilter) return false;
      if (effectiveSearch) {
        const hay = `${c.shortId} ${c.id} ${c.item} ${c.category} ${c.destinationZone} ${c.partnerName} ${c.partnerAcronym} ${c.status}`.toLowerCase();
        if (!hay.includes(effectiveSearch)) return false;
      }
      return true;
    });

    const sorted = [...list];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'qty-desc') {
      sorted.sort((a, b) => (b.qty || 0) - (a.qty || 0));
    } else if (sortBy === 'value-desc') {
      sorted.sort((a, b) => (b.estimatedValueLkr || 0) - (a.estimatedValueLkr || 0));
    }
    return sorted;
  }, [scopedCommitments, statusFilter, categoryFilter, zoneFilter, effectiveSearch, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const selectedRecord = filtered.find((c) => c.id === selectedCommitmentId) || paged[0] || filtered[0] || null;

  const handleExport = () => {
    const headers = ['Contribution ID', 'Partner', 'Resource Item', 'Category', 'Quantity', 'Estimated Value (LKR)', 'Destination Zone', 'Status', 'Logged At'];
    const rows = filtered.map((c) => [
      c.shortId,
      `${c.partnerName} (${c.partnerAcronym})`,
      c.item,
      c.category,
      c.qty,
      c.estimatedValueLkr,
      c.destinationZone,
      c.status,
      formatDateTime(c.createdAt)
    ]);
    exportToCsv(`Resource_Contributions_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const executeConfirmedStatus = async () => {
    if (!confirmAction) return;
    await onUpdateCommitmentStatus(confirmAction.id, confirmAction.targetStatus);
    setConfirmAction(null);
  };

  return (
    <div className="po-workspace">
      {/* Header */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>PARTNER RESOURCE INVENTORY &amp; PLEDGES</span>
          </div>
          <h1 className="po-title">Resource Contributions</h1>
          <p className="po-subtitle">
            Manage relief supplies, teams, and equipment pledged by {scopeAllPartners ? 'all accredited partners' : (partner?.name || 'your organisation')}.
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
          <button
            type="button"
            className="po-btn po-btn-primary"
            onClick={() => onOpenCreateModal()}
            disabled={!partner}
          >
            <Plus size={14} />
            <span>Log Contribution</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="po-filter-bar" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className="po-filter-search" style={{ minWidth: '220px', flex: '1 1 220px' }}>
          <Search size={14} className="po-search-icon" />
          <input
            type="text"
            placeholder="Search item, ID, zone, category..."
            className="po-search-input"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        <div className="po-filter-selects" style={{ flexWrap: 'wrap' }}>
          <select
            className="po-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All statuses</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="po-select"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="po-select"
            value={zoneFilter}
            onChange={(e) => { setZoneFilter(e.target.value); setPage(1); }}
          >
            <option value="All">All zones / districts</option>
            {uniqueZones.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>

          <select
            className="po-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest</option>
            <option value="qty-desc">Sort: Highest Quantity</option>
            <option value="value-desc">Sort: Highest Value</option>
          </select>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#405044', cursor: 'pointer', padding: '0 6px' }}>
            <input
              type="checkbox"
              checked={scopeAllPartners}
              onChange={(e) => { setScopeAllPartners(e.target.checked); setPage(1); }}
            />
            <span>All partners</span>
          </label>
        </div>
      </div>

      {/* Main Split Layout */}
      {loading && commitments.length === 0 ? (
        <div className="po-panel" style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
          Loading resource contributions...
        </div>
      ) : filtered.length === 0 ? (
        <div className="po-panel" style={{ padding: '44px', textAlign: 'center' }}>
          <Package size={28} color="#657367" style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '0 0 6px 0', color: '#162e20', fontSize: '16px' }}>No matching resource contributions</h3>
          <p style={{ margin: '0 0 16px 0', color: '#657367', fontSize: '13px' }}>
            Adjust your filters or log a new resource contribution for {partner?.name || 'your organisation'}.
          </p>
          {partner && (
            <button type="button" className="po-btn po-btn-primary" onClick={() => onOpenCreateModal()}>
              <Plus size={14} />
              <span>Log Contribution</span>
            </button>
          )}
        </div>
      ) : (
        <div className="po-split-layout">
          {/* Table */}
          <div style={{ flex: '1 1 60%', minWidth: 0 }}>
            <div className="po-table-container">
              <table className="po-data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>RESOURCE &amp; CATEGORY</th>
                    <th>QUANTITY</th>
                    <th>TARGET ZONE</th>
                    <th>LOGGED</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item) => {
                    const isSelected = item.id === selectedRecord?.id;
                    return (
                      <tr
                        key={item.id}
                        className={isSelected ? 'selected' : ''}
                        onClick={() => setSelectedCommitmentId && setSelectedCommitmentId(item.id)}
                      >
                        <td>
                          <span className="po-cell-record-id" title={item.id}>{item.shortId}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#162e20' }}>{item.item}</div>
                          <div style={{ fontSize: '11.5px', color: '#657367' }}>
                            {item.category}{scopeAllPartners ? ` · ${item.partnerAcronym}` : ''}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: '#162e20' }}>
                            {Number(item.qty || 0).toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: '#405044' }}>{item.destinationZone}</span>
                        </td>
                        <td>
                          <span style={{ color: '#657367', fontSize: '12px' }}>{formatDateTime(item.createdAt)}</span>
                        </td>
                        <td>
                          <span className={`po-status-badge ${item.statusMeta.badgeClass}`}>
                            ● {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '12.5px', color: '#657367' }}>
                <span>
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} contributions
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

          {/* Right: Contribution Details Panel */}
          {selectedRecord && (
            <div className="po-detail-card">
              <div className="po-detail-header-row">
                <span className="po-detail-id" title={selectedRecord.id}>{selectedRecord.shortId}</span>
                <span className={`po-status-badge ${selectedRecord.statusMeta.badgeClass}`}>
                  ● {selectedRecord.status}
                </span>
              </div>

              <div className="po-detail-title">{selectedRecord.item}</div>
              <div className="po-detail-subtitle">
                {selectedRecord.category} · {selectedRecord.partnerName} ({selectedRecord.partnerAcronym})
              </div>

              <div className="po-detail-grid">
                <div className="po-detail-field">
                  <span className="po-detail-label">Quantity Offered</span>
                  <span className="po-detail-val">{Number(selectedRecord.qty || 0).toLocaleString()} units</span>
                </div>
                <div className="po-detail-field">
                  <span className="po-detail-label">Estimated Value</span>
                  <span className="po-detail-val">
                    LKR {Number(selectedRecord.estimatedValueLkr || 0).toLocaleString()}
                  </span>
                </div>
                <div className="po-detail-field">
                  <span className="po-detail-label">Target Zone / District</span>
                  <span className="po-detail-val">{selectedRecord.destinationZone}</span>
                </div>
                <div className="po-detail-field">
                  <span className="po-detail-label">Logged Date</span>
                  <span className="po-detail-val">{formatDateTime(selectedRecord.createdAt)}</span>
                </div>
              </div>

              {/* Confirmation Prompt */}
              {confirmAction && confirmAction.id === selectedRecord.id && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fde68a',
                    marginBottom: '14px',
                    fontSize: '12.5px',
                    color: '#92400e'
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '8px' }}>
                    Confirm action: {confirmAction.label}?
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="po-btn po-btn-primary"
                      onClick={executeConfirmedStatus}
                      disabled={submitting}
                    >
                      {submitting ? 'Updating...' : 'Yes, Confirm'}
                    </button>
                    <button
                      type="button"
                      className="po-btn po-btn-secondary"
                      onClick={() => setConfirmAction(null)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Permitted Actions */}
              <div className="po-detail-actions">
                {!selectedRecord.statusMeta.isCompleted && !selectedRecord.statusMeta.isWithdrawn && (
                  <button
                    type="button"
                    className="po-btn po-btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => onOpenEditModal(selectedRecord)}
                    disabled={submitting}
                  >
                    <Edit3 size={14} />
                    <span>Edit Contribution</span>
                  </button>
                )}

                {selectedRecord.status.toLowerCase() === 'pledged' && (
                  <button
                    type="button"
                    className="po-btn po-btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setConfirmAction({
                      id: selectedRecord.id,
                      targetStatus: 'Confirmed',
                      label: 'Confirm contribution offer'
                    })}
                    disabled={submitting}
                  >
                    <CheckCircle2 size={14} />
                    <span>Confirm Offer</span>
                  </button>
                )}

                {['pledged', 'confirmed'].includes(selectedRecord.status.toLowerCase()) && (
                  <button
                    type="button"
                    className="po-btn po-btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', color: '#dc2626', borderColor: '#fecaca' }}
                    onClick={() => setConfirmAction({
                      id: selectedRecord.id,
                      targetStatus: 'Withdrawn',
                      label: 'Withdraw contribution offer'
                    })}
                    disabled={submitting}
                  >
                    <XCircle size={14} />
                    <span>Withdraw Offer</span>
                  </button>
                )}

                <button
                  type="button"
                  className="po-btn po-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onNavigateToTracking(selectedRecord.id)}
                >
                  <Truck size={14} />
                  <span>Track Delivery Fulfilment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceContributionsView;

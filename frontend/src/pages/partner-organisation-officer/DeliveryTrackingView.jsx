import React, { useState, useMemo } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import {
  COMMITMENT_LIFECYCLE,
  formatShortCode,
  formatDateTime,
  getCommitmentStatusMeta,
  getAllowedNextDeliveryStatuses
} from './partnerOfficerUtils';

export const DeliveryTrackingView = ({
  partner = null,
  commitments = [],
  selectedCommitmentId,
  setSelectedCommitmentId,
  onUpdateCommitmentStatus,
  globalSearch = '',
  loading = false,
  submitting = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active'); // Active, Completed, Delayed, All
  const [scopeAllPartners, setScopeAllPartners] = useState(false);
  const [pendingTransition, setPendingTransition] = useState(null);

  const effectiveSearch = (searchTerm || globalSearch || '').trim().toLowerCase();

  const items = useMemo(() => {
    const base = scopeAllPartners || !partner
      ? commitments
      : commitments.filter((c) => c.partnerOrganisationId === partner.id);

    return base
      .map((c) => ({
        ...c,
        shortId: formatShortCode(c.id, 'COM'),
        meta: getCommitmentStatusMeta(c.status)
      }))
      .filter((c) => {
        if (statusFilter === 'Active' && (c.meta.isCompleted || c.meta.isWithdrawn)) return false;
        if (statusFilter === 'Completed' && !c.meta.isCompleted) return false;
        if (statusFilter === 'Delayed' && !c.meta.isDelayed) return false;
        if (effectiveSearch) {
          const hay = `${c.shortId} ${c.item} ${c.destinationZone} ${c.partnerName} ${c.status}`.toLowerCase();
          if (!hay.includes(effectiveSearch)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }, [commitments, partner, scopeAllPartners, statusFilter, effectiveSearch]);

  const selected = items.find((c) => c.id === selectedCommitmentId) || items[0] || null;
  const allowedNext = selected ? getAllowedNextDeliveryStatuses(selected.status) : [];

  const handleConfirmTransition = async () => {
    if (!pendingTransition) return;
    await onUpdateCommitmentStatus(pendingTransition.id, pendingTransition.nextStatus);
    setPendingTransition(null);
  };

  return (
    <div className="po-workspace">
      {/* Header */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>COMMITMENT FULFILMENT &amp; LOGISTICS</span>
          </div>
          <h1 className="po-title">Delivery Tracking</h1>
          <p className="po-subtitle">
            Track dispatch progress, destination handoffs, and completion status for committed partner supplies.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="po-filter-bar" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className="po-filter-search" style={{ minWidth: '220px', flex: '1 1 220px' }}>
          <Search size={14} className="po-search-icon" />
          <input
            type="text"
            placeholder="Search commitment ID, item, destination..."
            className="po-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="po-filter-selects">
          <select
            className="po-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Active">Active &amp; In-Progress</option>
            <option value="Completed">Delivered / Completed</option>
            <option value="Delayed">Delayed Only</option>
            <option value="All">All Commitments</option>
          </select>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#405044', cursor: 'pointer', padding: '0 6px' }}>
            <input
              type="checkbox"
              checked={scopeAllPartners}
              onChange={(e) => setScopeAllPartners(e.target.checked)}
            />
            <span>All partners</span>
          </label>
        </div>
      </div>

      {loading && commitments.length === 0 ? (
        <div className="po-panel" style={{ padding: '40px', textAlign: 'center', color: '#657367' }}>
          Loading delivery tracking records...
        </div>
      ) : items.length === 0 ? (
        <div className="po-panel" style={{ padding: '44px', textAlign: 'center' }}>
          <Truck size={28} color="#657367" style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '0 0 6px 0', color: '#162e20', fontSize: '16px' }}>No deliveries match this filter</h3>
          <p style={{ margin: 0, color: '#657367', fontSize: '13px' }}>
            Switch the status filter to "All Commitments" or log a new contribution first.
          </p>
        </div>
      ) : (
        <div className="po-split-layout">
          {/* Left: Delivery Table */}
          <div style={{ flex: '1 1 58%', minWidth: 0 }}>
            <div className="po-table-container">
              <table className="po-data-table">
                <thead>
                  <tr>
                    <th>COMMITMENT</th>
                    <th>RESOURCE &amp; QTY</th>
                    <th>DESTINATION</th>
                    <th>PROGRESS</th>
                    <th>UPDATED</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const isSelected = item.id === selected?.id;
                    return (
                      <tr
                        key={item.id}
                        className={isSelected ? 'selected' : ''}
                        onClick={() => {
                          setSelectedCommitmentId && setSelectedCommitmentId(item.id);
                          setPendingTransition(null);
                        }}
                      >
                        <td>
                          <span className="po-cell-record-id" title={item.id}>{item.shortId}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#162e20' }}>{item.item}</div>
                          <div style={{ fontSize: '11.5px', color: '#657367' }}>
                            {Number(item.qty || 0).toLocaleString()} units · {item.partnerAcronym}
                          </div>
                        </td>
                        <td>
                          <span style={{ color: '#405044' }}>{item.destinationZone}</span>
                        </td>
                        <td style={{ minWidth: '110px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', backgroundColor: '#e5ece0', borderRadius: '4px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${item.meta.progress}%`,
                                  height: '100%',
                                  backgroundColor: item.meta.isDelayed ? '#dc2626' : '#1e3d2c',
                                  borderRadius: '4px'
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#405044' }}>
                              {item.meta.progress}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: '#657367', fontSize: '12px' }}>
                            {formatDateTime(item.updatedAt || item.createdAt)}
                          </span>
                        </td>
                        <td>
                          <span className={`po-status-badge ${item.meta.badgeClass}`}>
                            ● {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Fulfilment Lifecycle & Status Update Panel */}
          {selected && (
            <div className="po-detail-card">
              <div className="po-detail-header-row">
                <span className="po-detail-id" title={selected.id}>{selected.shortId}</span>
                <span className={`po-status-badge ${selected.meta.badgeClass}`}>
                  ● {selected.status}
                </span>
              </div>

              <div className="po-detail-title">{selected.item}</div>
              <div className="po-detail-subtitle">
                Responsible: {selected.partnerName} ({selected.partnerAcronym})
              </div>

              <div className="po-detail-grid" style={{ marginTop: '14px' }}>
                <div className="po-detail-field">
                  <span className="po-detail-label">Quantity</span>
                  <span className="po-detail-val">{Number(selected.qty || 0).toLocaleString()} units</span>
                </div>
                <div className="po-detail-field">
                  <span className="po-detail-label">Destination Zone</span>
                  <span className="po-detail-val">{selected.destinationZone}</span>
                </div>
                <div className="po-detail-field">
                  <span className="po-detail-label">Logged Date</span>
                  <span className="po-detail-val">{formatDateTime(selected.createdAt)}</span>
                </div>
                <div className="po-detail-field">
                  <span className="po-detail-label">Last Updated</span>
                  <span className="po-detail-val">{formatDateTime(selected.updatedAt || selected.createdAt)}</span>
                </div>
              </div>

              {/* Lifecycle Stepper */}
              <div style={{ marginTop: '16px', marginBottom: '18px', padding: '14px', borderRadius: '10px', backgroundColor: '#f8faf7', border: '1px solid #edf1eb' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#4a5b4a', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  FULFILMENT LIFECYCLE
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {COMMITMENT_LIFECYCLE.map((stage, idx) => {
                    const reached = !selected.meta.isWithdrawn && selected.meta.stepIndex >= idx;
                    return (
                      <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px' }}>
                        {reached ? (
                          <CheckCircle2 size={15} color="#15803d" />
                        ) : (
                          <Clock size={15} color="#8d9a8f" />
                        )}
                        <span style={{ fontWeight: reached ? 700 : 500, color: reached ? '#162e20' : '#657367' }}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                  {selected.meta.isDelayed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#dc2626', marginTop: '4px' }}>
                      <AlertTriangle size={15} />
                      <span style={{ fontWeight: 700 }}>Currently flagged as Delayed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmation prompt */}
              {pendingTransition && pendingTransition.id === selected.id && (
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
                    Update delivery status from "{selected.status}" to "{pendingTransition.nextStatus}"?
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="po-btn po-btn-primary"
                      onClick={handleConfirmTransition}
                      disabled={submitting}
                    >
                      {submitting ? 'Updating...' : 'Confirm Update'}
                    </button>
                    <button
                      type="button"
                      className="po-btn po-btn-secondary"
                      onClick={() => setPendingTransition(null)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Valid Next Transitions */}
              <div className="po-detail-actions">
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#4a5b4a', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  PERMITTED DELIVERY UPDATES
                </div>
                {allowedNext.length === 0 ? (
                  <div style={{ fontSize: '12.5px', color: '#657367', padding: '10px', backgroundColor: '#f8faf7', borderRadius: '8px' }}>
                    No further status transitions available for "{selected.status}".
                  </div>
                ) : (
                  allowedNext.map((nextStatus) => (
                    <button
                      key={nextStatus}
                      type="button"
                      className={nextStatus === 'Delivered' || nextStatus === 'Completed' || nextStatus === 'Confirmed' || nextStatus === 'Dispatched' ? 'po-btn po-btn-primary' : 'po-btn po-btn-secondary'}
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        ...(nextStatus === 'Delayed' || nextStatus === 'Withdrawn' ? { color: '#b45309', borderColor: '#fde68a' } : {})
                      }}
                      onClick={() => setPendingTransition({ id: selected.id, nextStatus })}
                      disabled={submitting}
                    >
                      <ArrowRight size={14} />
                      <span>Mark as {nextStatus}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryTrackingView;

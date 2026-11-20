import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Truck,
  Check,
  XCircle,
  RefreshCw,
  Building2
} from 'lucide-react';

export const ResourceRequestsView = ({
  shelters = [],
  resourceRequests = [],
  onRequestSupplies,
  onOpenExportModal,
  onUpdateStatus,
  onRefreshData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Top Metrics
  const totalCount = resourceRequests.length;
  const pendingCount = resourceRequests.filter((r) => r.status === 'Approved' || r.status === 'Pending').length;
  const dispatchedCount = resourceRequests.filter((r) => r.status === 'Dispatched').length;
  const deliveredCount = resourceRequests.filter((r) => r.status === 'Delivered').length;

  // Filter logic
  const filteredRequests = resourceRequests.filter((r) => {
    const matchesSearch =
      (r.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.shelterName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.itemCategory || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.requestedQuantity || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || r.urgency?.toLowerCase() === urgencyFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const selectedRequest =
    resourceRequests.find((r) => r.id === selectedRequestId) || filteredRequests[0] || resourceRequests[0];

  const handleStatusChange = async (requestId, newDispatchStatus, statusLabel) => {
    setIsUpdating(true);
    try {
      if (onUpdateStatus) {
        await onUpdateStatus(requestId, newDispatchStatus);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="sh-view-header-row">
        <div>
          <div className="sh-view-pre-title">SHELTER SUPPLY & REQUISITIONS</div>
          <h1 className="sh-view-title">Resource Requests</h1>
          <p className="sh-view-desc">
            Supply requisition tracking, emergency logistics handovers, and facility stock replenishments.
          </p>
        </div>
        <div className="sh-header-actions">
          {onRefreshData && (
            <button className="sh-btn-outline" onClick={onRefreshData} title="Sync with database">
              <RefreshCw size={15} />
              Sync Supplies
            </button>
          )}
          <button className="sh-btn-outline" onClick={onOpenExportModal}>
            <Download size={15} />
            Export Requests Report
          </button>
          <button className="sh-btn-primary" onClick={onRequestSupplies}>
            <Plus size={16} />
            Request Relief Supplies
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="sh-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Total Requisitions</span>
            <div className="sh-metric-icon-tile">
              <Package size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{totalCount}</div>
          <div className="sh-metric-subtext">Shelter supply orders logged</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Pending Central Logistics</span>
            <div className="sh-metric-icon-tile">
              <Clock size={16} />
            </div>
          </div>
          <div className="sh-metric-value" style={{ color: pendingCount > 0 ? '#b45309' : '#183526' }}>
            {pendingCount}
          </div>
          <div className="sh-metric-subtext">Awaiting courier dispatch</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Dispatched / In-Transit</span>
            <div className="sh-metric-icon-tile">
              <Truck size={16} />
            </div>
          </div>
          <div className="sh-metric-value" style={{ color: dispatchedCount > 0 ? '#2563eb' : '#183526' }}>
            {dispatchedCount}
          </div>
          <div className="sh-metric-subtext">En route to shelters</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Delivered & Confirmed</span>
            <div className="sh-metric-icon-tile">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value" style={{ color: '#15803d' }}>
            {deliveredCount}
          </div>
          <div className="sh-metric-subtext">Stock received on-site</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sh-filter-bar">
        <div className="sh-table-search-box">
          <Search size={16} color="#6f8576" />
          <input
            type="text"
            className="sh-table-search-input"
            placeholder="Search supply requisitions, items, destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sh-filter-selects">
          <select
            className="sh-dropdown-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All requisition statuses</option>
            <option value="Approved">Approved / Pending</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            className="sh-dropdown-select"
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
          >
            <option value="ALL">All urgency levels</option>
            <option value="Critical">Critical priority</option>
            <option value="High">High priority</option>
            <option value="Medium">Medium priority</option>
            <option value="Low">Low priority</option>
          </select>
        </div>
      </div>

      {/* Master-Detail Split Grid */}
      <div className="sh-master-detail-grid">
        {/* Left Table */}
        <div className="sh-table-card">
          <table className="sh-data-table">
            <thead>
              <tr>
                <th>Requisition Code</th>
                <th>Destination Shelter</th>
                <th>Supplies Requested</th>
                <th>Priority</th>
                <th>Status</th>
                <th>ETA / Dispatch</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#6f8576' }}>
                    No supply requisitions found matching criteria. Click "Request Relief Supplies" to submit.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r) => {
                  const isSelected = selectedRequest && selectedRequest.id === r.id;
                  const isCritical = r.urgency?.toLowerCase() === 'critical';
                  const isHigh = r.urgency?.toLowerCase() === 'high';

                  return (
                    <tr
                      key={r.id}
                      className={isSelected ? 'selected-row' : ''}
                      onClick={() => setSelectedRequestId(r.id)}
                    >
                      <td style={{ fontWeight: 700, color: '#183526' }}>{r.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.shelterName}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#142e1f' }}>{r.itemCategory}</div>
                        <div style={{ fontSize: '11px', color: '#657367' }}>{r.requestedQuantity}</div>
                      </td>
                      <td>
                        <span
                          className={`sh-badge ${isCritical
                            ? 'sh-badge-critical'
                            : isHigh
                              ? 'sh-badge-warning'
                              : 'sh-badge-operational'
                            }`}
                        >
                          <span className="sh-badge-dot" />
                          {r.urgency}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`sh-badge ${r.status === 'Delivered'
                            ? 'sh-badge-operational'
                            : r.status === 'Dispatched'
                              ? 'sh-badge-info'
                              : r.status === 'Cancelled'
                                ? 'sh-badge-critical'
                                : 'sh-badge-warning'
                            }`}
                        >
                          <span className="sh-badge-dot" />
                          {r.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '11.5px', color: '#657367' }}>
                        {r.eta || 'Central Logistics Queue'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                          {(r.status === 'Approved' || r.status === 'Pending') && (
                            <button
                              className="sh-btn-outline"
                              style={{ padding: '3px 8px', fontSize: '10.5px', color: '#2563eb', borderColor: '#bfdbfe' }}
                              title="Mark Dispatched"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(r.id, 1, 'Dispatched')}
                            >
                              <Truck size={12} />
                              Dispatch
                            </button>
                          )}
                          {r.status === 'Dispatched' && (
                            <button
                              className="sh-btn-primary"
                              style={{ padding: '3px 8px', fontSize: '10.5px' }}
                              title="Confirm Delivered"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(r.id, 2, 'Delivered')}
                            >
                              <Check size={12} />
                              Receive
                            </button>
                          )}
                          {r.status !== 'Delivered' && r.status !== 'Cancelled' && (
                            <button
                              className="sh-btn-outline"
                              style={{ padding: '3px 6px', fontSize: '10.5px', color: '#b91c1c', borderColor: '#fca5a5' }}
                              title="Cancel Request"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(r.id, 3, 'Cancelled')}
                            >
                              <XCircle size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Right Requisition Inspector Drawer */}
        {selectedRequest && (
          <div className="sh-detail-panel">
            <div>
              <div className="sh-detail-header-top">
                <div className="sh-detail-code-label">{selectedRequest.id}</div>
                <span
                  className={`sh-badge ${selectedRequest.status === 'Delivered'
                    ? 'sh-badge-operational'
                    : selectedRequest.status === 'Dispatched'
                      ? 'sh-badge-info'
                      : selectedRequest.status === 'Cancelled'
                        ? 'sh-badge-critical'
                        : 'sh-badge-warning'
                    }`}
                >
                  <span className="sh-badge-dot" />
                  {selectedRequest.status}
                </span>
              </div>
              <h2 className="sh-detail-main-title">{selectedRequest.itemCategory}</h2>
              <div className="sh-detail-sub-label">Target: {selectedRequest.shelterName}</div>
            </div>

            {/* Stats Tile Grid */}
            <div className="sh-detail-stats-grid">
              <div className="sh-detail-stat-tile">
                <div className="sh-detail-stat-label">Quantity</div>
                <div className="sh-detail-stat-val" style={{ fontSize: '15px' }}>
                  {selectedRequest.requestedQuantity}
                </div>
              </div>
              <div className="sh-detail-stat-tile">
                <div className="sh-detail-stat-label">Priority</div>
                <div
                  className="sh-detail-stat-val"
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    marginTop: '5px',
                    color: selectedRequest.urgency?.toLowerCase() === 'critical' ? '#dc2626' : '#183526'
                  }}
                >
                  {selectedRequest.urgency}
                </div>
              </div>
              <div className="sh-detail-stat-tile">
                <div className="sh-detail-stat-label">Requested By</div>
                <div style={{ fontSize: '11px', fontWeight: 600, marginTop: '4px', color: '#183526' }}>
                  {selectedRequest.requestedBy || 'Shelter Manager'}
                </div>
              </div>
              <div className="sh-detail-stat-tile">
                <div className="sh-detail-stat-label">Status ETA</div>
                <div style={{ fontSize: '11px', fontWeight: 600, marginTop: '4px', color: '#2563eb' }}>
                  {selectedRequest.eta || 'Pending Dispatch'}
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedRequest.notes && (
              <div style={{
                fontSize: '11.5px',
                color: '#3e5847',
                backgroundColor: '#f5f8f4',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #e1ebe0',
                lineHeight: '1.45'
              }}>
                <strong>Requisition Details:</strong> {selectedRequest.notes}
              </div>
            )}

            {/* Quick Transition Action Buttons */}
            <div className="sh-action-stack" style={{ marginTop: '14px' }}>
              {(selectedRequest.status === 'Approved' || selectedRequest.status === 'Pending') && (
                <button
                  className="sh-btn-confirm-full"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(selectedRequest.id, 1, 'Dispatched')}
                >
                  <Truck size={15} />
                  Mark Dispatched & In-Transit
                </button>
              )}

              {selectedRequest.status === 'Dispatched' && (
                <button
                  className="sh-btn-confirm-full"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(selectedRequest.id, 2, 'Delivered')}
                >
                  <CheckCircle2 size={15} />
                  Confirm Receipt / Delivered on-site
                </button>
              )}

              {selectedRequest.status !== 'Delivered' && selectedRequest.status !== 'Cancelled' && (
                <button
                  className="sh-btn-secondary-full"
                  style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(selectedRequest.id, 3, 'Cancelled')}
                >
                  Cancel Requisition
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResourceRequestsView;

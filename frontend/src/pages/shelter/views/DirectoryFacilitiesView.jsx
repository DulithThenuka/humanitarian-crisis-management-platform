import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle,
  FileText,
  CornerUpRight,
  ShieldAlert,
  Edit3,
  UserCheck,
  Package,
  Phone,
  MapPin,
  RefreshCw
} from 'lucide-react';

export const DirectoryFacilitiesView = ({
  shelters = [],
  selectedShelter,
  onSelectShelter,
  onOpenCreateModal,
  onOpenExportModal,
  onOpenEditModal,
  onOpenAllocateModal,
  onRequestSupplies,
  onRequestClarification,
  onEscalate,
  onRefreshData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [noteText, setNoteText] = useState('');

  const distinctAreas = Array.from(new Set(shelters.map((s) => s.area).filter(Boolean)));

  const renderFacilityBadges = (facilities) => {
    if (!facilities) return <span style={{ fontSize: '11px', color: '#94a3b8' }}>Standard</span>;
    let items = [];
    if (Array.isArray(facilities)) {
      items = facilities;
    } else if (typeof facilities === 'string') {
      if (facilities.startsWith('[') && facilities.endsWith(']')) {
        try {
          items = JSON.parse(facilities);
        } catch {
          items = facilities.replace(/[\[\]"]/g, '').split(',');
        }
      } else {
        items = facilities.split(/[,|]/);
      }
    }
    const clean = items.map((i) => String(i).trim()).filter(Boolean);
    if (clean.length === 0) return <span style={{ fontSize: '11px', color: '#94a3b8' }}>Standard</span>;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {clean.map((tag, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '11px',
              backgroundColor: '#edf4eb',
              color: '#153322',
              padding: '2px 7px',
              borderRadius: '4px',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // Filter logic
  const filteredShelters = shelters.filter((s) => {
    const matchesSearch =
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.area || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.accessibility || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesArea = areaFilter === 'ALL' || s.area === areaFilter;
    return matchesSearch && matchesStatus && matchesArea;
  });

  const currentShelter = selectedShelter || filteredShelters[0] || shelters[0];

  const handleClarify = () => {
    if (onRequestClarification && currentShelter) {
      onRequestClarification(currentShelter.id, noteText);
      setNoteText('');
    }
  };

  const handleEscalateAction = () => {
    if (onEscalate && currentShelter) {
      onEscalate(currentShelter.id, noteText);
      setNoteText('');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="sh-view-header-row">
        <div>
          <div className="sh-view-pre-title">SHELTER FACILITY MANAGEMENT</div>
          <h1 className="sh-view-title">Directory & Facilities</h1>
          <p className="sh-view-desc">
            Search, inspect and manage operational shelters, facilities, and real-time bed capacity.
          </p>
        </div>
        <div className="sh-header-actions">
          {onRefreshData && (
            <button className="sh-btn-outline" onClick={onRefreshData} title="Sync with database">
              <RefreshCw size={15} />
              Sync Directory
            </button>
          )}
          <button className="sh-btn-outline" onClick={onOpenExportModal}>
            <Download size={15} />
            Export Directory Report
          </button>
          <button className="sh-btn-primary" onClick={onOpenCreateModal}>
            <Plus size={16} />
            Register Operational Shelter
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sh-filter-bar">
        <div className="sh-table-search-box">
          <Search size={16} color="#6f8576" />
          <input
            type="text"
            className="sh-table-search-input"
            placeholder="Search directory & facilities..."
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
            <option value="ALL">All statuses</option>
            <option value="Operational">Operational</option>
            <option value="Near capacity">Near capacity</option>
            <option value="Full">Full</option>
          </select>

          <select
            className="sh-dropdown-select"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="ALL">All operational areas</option>
            {distinctAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Master-Detail Split Grid */}
      <div className="sh-master-detail-grid">
        {/* Left Master Table */}
        <div className="sh-table-card">
          <table className="sh-data-table">
            <thead>
              <tr>
                <th>Shelter</th>
                <th>Area / Sector</th>
                <th>Capacity</th>
                <th>Occupied</th>
                <th>Available</th>
                <th>Accessibility</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredShelters.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#6f8576' }}>
                    No matching facilities found. Try adjusting filters or search.
                  </td>
                </tr>
              ) : (
                filteredShelters.map((s) => {
                  const isSelected = currentShelter && currentShelter.id === s.id;
                  const isCritical = s.status === 'Full' || (s.available !== undefined && s.available <= 0);
                  const isWarning = s.status === 'Near capacity' || (s.available !== undefined && s.available <= 10);

                  return (
                    <tr
                      key={s.id}
                      className={isSelected ? 'selected-row' : ''}
                      onClick={() => onSelectShelter(s)}
                    >
                      <td className="sh-shelter-title-cell">
                        <div style={{ fontWeight: 700 }}>{s.name}</div>
                        {s.contactPhone && (
                          <div style={{ fontSize: '11px', color: '#657367' }}>{s.contactPhone}</div>
                        )}
                      </td>
                      <td>{s.area}</td>
                      <td style={{ fontWeight: 600 }}>{s.capacity}</td>
                      <td>{s.occupied}</td>
                      <td style={{ fontWeight: 700, color: (s.available ?? 0) <= 5 ? '#b91c1c' : '#15803d' }}>
                        {s.available}
                      </td>
                      <td>
                        {renderFacilityBadges(s.facilities || s.accessibility)}
                      </td>
                      <td>
                        <span
                          className={`sh-badge ${isCritical
                            ? 'sh-badge-critical'
                            : isWarning
                              ? 'sh-badge-warning'
                              : 'sh-badge-operational'
                            }`}
                        >
                          <span className="sh-badge-dot" />
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Right Detail Panel */}
        {currentShelter && (
          <div className="sh-detail-panel">
            <div>
              <div className="sh-detail-header-top">
                <div className="sh-detail-code-label">{currentShelter.name}</div>
                <span
                  className={`sh-badge ${currentShelter.status === 'Operational'
                    ? 'sh-badge-operational'
                    : currentShelter.status === 'Near capacity'
                      ? 'sh-badge-warning'
                      : 'sh-badge-critical'
                    }`}
                >
                  <span className="sh-badge-dot" />
                  {currentShelter.status}
                </span>
              </div>
              <h2 className="sh-detail-main-title">{currentShelter.area}</h2>
              <div className="sh-detail-sub-label">Verified Shelter Record • Operational Status</div>
            </div>

            {/* 4 Stats Grid */}
            <div className="sh-detail-stats-grid">
              <div className="sh-detail-stat-tile">
                <div className="sh-detail-stat-label">Capacity</div>
                <div className="sh-detail-stat-val">{currentShelter.capacity}</div>
              </div>
              <div className="sh-detail-stat-tile">
                <div className="sh-detail-stat-label">Occupied</div>
                <div className="sh-detail-stat-val">{currentShelter.occupied}</div>
              </div>
              <div className="sh-detail-stat-tile">
                <div className="sh-detail-stat-label">Available</div>
                <div className="sh-detail-stat-val" style={{ color: currentShelter.available <= 5 ? '#b91c1c' : '#15803d' }}>
                  {currentShelter.available}
                </div>
              </div>
              <div className="sh-detail-stat-tile">
                <div className="sh-detail-stat-label">Facilities & Amenities</div>
                <div style={{ marginTop: '6px' }}>
                  {renderFacilityBadges(currentShelter.facilities || currentShelter.accessibility)}
                </div>
              </div>
            </div>

            {/* Existing Notes / Manager info */}
            {currentShelter.notes && (
              <div style={{
                fontSize: '11.5px',
                color: '#3e5847',
                backgroundColor: '#f5f8f4',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e1ebe0',
                lineHeight: '1.4'
              }}>
                <strong>Facility Info:</strong> {currentShelter.notes}
              </div>
            )}

            {/* Fast Management Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
              <button
                className="sh-btn-primary"
                style={{ padding: '8px 10px', fontSize: '12px' }}
                disabled={currentShelter.available <= 0}
                onClick={() => onOpenAllocateModal && onOpenAllocateModal(currentShelter)}
              >
                <UserCheck size={14} />
                Allocate Evacuee
              </button>
              <button
                className="sh-btn-outline"
                style={{ padding: '8px 10px', fontSize: '12px' }}
                onClick={() => onRequestSupplies && onRequestSupplies(currentShelter)}
              >
                <Package size={14} />
                Request Supplies
              </button>
            </div>

            <button
              className="sh-btn-outline"
              style={{ width: '100%', marginTop: '6px', fontSize: '12px', padding: '7px 10px' }}
              onClick={() => onOpenEditModal && onOpenEditModal(currentShelter)}
            >
              <Edit3 size={13} />
              Edit Shelter Capacity & Amenities
            </button>

            {/* Note & Reason */}
            <div className="sh-decision-note-box" style={{ marginTop: '12px' }}>
              <label className="sh-note-label">Authorised Note / Decision Reason</label>
              <textarea
                className="sh-note-textarea"
                placeholder="Log operational note or coordination justification..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>

            {/* Triage Review Buttons */}
            <div className="sh-action-stack">
              <button className="sh-btn-secondary-full" onClick={handleClarify}>
                Request clarification
              </button>
              <button className="sh-btn-secondary-full" onClick={handleEscalateAction}>
                Escalate to Coordinator
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DirectoryFacilitiesView;

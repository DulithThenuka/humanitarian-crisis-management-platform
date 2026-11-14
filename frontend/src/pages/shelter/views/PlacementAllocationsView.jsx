import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  Lock,
  UserCheck,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const PlacementAllocationsView = ({
  shelters,
  selectedShelter,
  placements,
  onSelectShelter,
  onOpenCreateModal,
  onOpenExportModal,
  onConfirmAllocation,
  onRequestClarification,
  onEscalate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [noteText, setNoteText] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('shelters'); // 'shelters' or 'intake'

  const filteredShelters = shelters.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.accessibility.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesArea = areaFilter === 'ALL' || s.area === areaFilter;
    return matchesSearch && matchesStatus && matchesArea;
  });

  const currentShelter = selectedShelter || shelters[0];

  const handleConfirm = () => {
    onConfirmAllocation(currentShelter.id, noteText);
    setNoteText('');
  };

  const handleClarify = () => {
    onRequestClarification(currentShelter.id, noteText);
    setNoteText('');
  };

  const handleEscalateAction = () => {
    onEscalate(currentShelter.id, noteText);
    setNoteText('');
  };

  return (
    <>
      {/* Header */}
      <div className="sh-view-header-row">
        <div>
          <div className="sh-view-pre-title">Shelter Admin - Controlled Workspace</div>
          <h1 className="sh-view-title">Placement Allocations</h1>
          <p className="sh-view-desc">
            Search, filter and review fictional records within this role's authorised scope.
          </p>
        </div>
        <div className="sh-header-actions">
          <button className="sh-btn-outline" onClick={onOpenExportModal}>
            <Download size={15} />
            Export demo report
          </button>
          <button className="sh-btn-primary" onClick={onOpenCreateModal}>
            <Plus size={16} />
            Create prototype record
          </button>
        </div>
      </div>

      {/* Sub Tabs Toggle */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8e0', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveSubTab('shelters')}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeSubTab === 'shelters' ? '2px solid #183526' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeSubTab === 'shelters' ? '#183526' : '#6f8576',
            cursor: 'pointer'
          }}
        >
          Shelter Placements & Spaces
        </button>
        <button
          onClick={() => setActiveSubTab('intake')}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeSubTab === 'intake' ? '2px solid #183526' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeSubTab === 'intake' ? '#183526' : '#6f8576',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Family Intakes Queue</span>
          <span style={{
            fontSize: '10px',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '1px 6px',
            borderRadius: '10px'
          }}>1 critical</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="sh-filter-bar">
        <div className="sh-table-search-box">
          <Search size={16} color="#6f8576" />
          <input
            type="text"
            className="sh-table-search-input"
            placeholder="Search placement allocations..."
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
            <option value="Kelani East">Kelani East</option>
            <option value="Biyagama North">Biyagama North</option>
            <option value="Wattala South">Wattala South</option>
            <option value="Hanwella">Hanwella</option>
            <option value="Kaduwela">Kaduwela</option>
            <option value="Malwana">Malwana</option>
            <option value="Kolonnawa">Kolonnawa</option>
          </select>
        </div>
      </div>

      {/* Master-Detail Split Grid */}
      {activeSubTab === 'shelters' ? (
        <div className="sh-master-detail-grid">
          {/* Left Master Table */}
          <div className="sh-table-card">
            <table className="sh-data-table">
              <thead>
                <tr>
                  <th>Shelter</th>
                  <th>Area</th>
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
                      No matching facilities found.
                    </td>
                  </tr>
                ) : (
                  filteredShelters.map((s) => {
                    const isSelected = currentShelter && currentShelter.id === s.id;
                    return (
                      <tr
                        key={s.id}
                        className={isSelected ? 'selected-row' : ''}
                        onClick={() => onSelectShelter(s)}
                      >
                        <td className="sh-shelter-title-cell">{s.name}</td>
                        <td>{s.area}</td>
                        <td>{s.capacity}</td>
                        <td>{s.occupied}</td>
                        <td>{s.available}</td>
                        <td>{s.accessibility}</td>
                        <td>
                          <span
                            className={`sh-badge ${
                              s.status === 'Operational'
                                ? 'sh-badge-operational'
                                : s.status === 'Near capacity'
                                ? 'sh-badge-warning'
                                : 'sh-badge-critical'
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
                    className={`sh-badge ${
                      currentShelter.status === 'Operational'
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
                <div className="sh-detail-sub-label">Selected fictional record • role-scoped</div>
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
                  <div className="sh-detail-stat-val">{currentShelter.available}</div>
                </div>
                <div className="sh-detail-stat-tile">
                  <div className="sh-detail-stat-label">Accessibility</div>
                  <div
                    className="sh-detail-stat-val"
                    style={{ fontSize: '13px', fontWeight: 700, marginTop: '5px' }}
                  >
                    {currentShelter.accessibility}
                  </div>
                </div>
              </div>

              {/* Capacity Guard Active Alert */}
              <div className="sh-guard-active-alert">
                <Lock size={18} color="#b45309" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h4 className="sh-guard-title">Capacity guard active</h4>
                  <p className="sh-guard-desc">
                    Availability is rechecked before confirmation to prevent overbooking and double allocation.
                  </p>
                </div>
              </div>

              {/* Note & Reason */}
              <div className="sh-decision-note-box">
                <label className="sh-note-label">Authorised Note / Decision Reason</label>
                <textarea
                  className="sh-note-textarea"
                  placeholder="Avoid unnecessary personal information..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="sh-action-stack">
                <button className="sh-btn-confirm-full" onClick={handleConfirm}>
                  Confirm allocation
                </button>
                <button className="sh-btn-secondary-full" onClick={handleClarify}>
                  Request clarification
                </button>
                <button className="sh-btn-secondary-full" onClick={handleEscalateAction}>
                  Escalate
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Family Intakes Queue Table */
        <div className="sh-table-card">
          <table className="sh-data-table">
            <thead>
              <tr>
                <th>Allocation ID</th>
                <th>Evacuee / Family Unit</th>
                <th>Party Size</th>
                <th>Assigned Facility</th>
                <th>Accessibility Need</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((plc) => (
                <tr key={plc.id}>
                  <td style={{ fontWeight: 700, color: '#142e1f' }}>{plc.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{plc.evacueeName}</div>
                    <div style={{ fontSize: '11px', color: '#6f8576' }}>{plc.specialNotes}</div>
                  </td>
                  <td>{plc.partySize} members</td>
                  <td>{plc.assignedShelter}</td>
                  <td>{plc.accessibilityNeeded}</td>
                  <td>{plc.allocatedAt}</td>
                  <td>
                    <span className={`sh-badge sh-badge-${plc.statusType}`}>
                      <span className="sh-badge-dot" />
                      {plc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};


import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle2,
  Users,
  Bed,
  BarChart3,
  Edit3,
  UserCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const CapacityOccupancyView = ({
  shelters = [],
  selectedShelter,
  onSelectShelter,
  onOpenCreateModal,
  onOpenExportModal,
  onOpenEditModal,
  onOpenAllocateModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [areaFilter, setAreaFilter] = useState('ALL');

  const distinctAreas = Array.from(new Set(shelters.map((s) => s.area).filter(Boolean)));

  // Aggregate Metrics computed from live shelters
  const totalCapacity = shelters.reduce((acc, s) => acc + (s.capacity || 0), 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + (s.occupied || 0), 0);
  const totalAvailable = Math.max(0, totalCapacity - totalOccupied);
  const avgOccupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  const nearCapacityCount = shelters.filter(
    (s) => (s.available <= 10 && s.available > 0) || (s.capacity > 0 && s.occupied / s.capacity >= 0.85 && s.occupied < s.capacity)
  ).length;
  const fullSheltersCount = shelters.filter(
    (s) => s.available === 0 || (s.capacity > 0 && s.occupied >= s.capacity)
  ).length;

  // Filtered shelters
  const filteredShelters = shelters.filter((s) => {
    const matchesSearch =
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.area || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.accessibility || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesArea = areaFilter === 'ALL' || s.area === areaFilter;
    return matchesSearch && matchesStatus && matchesArea;
  });

  const currentShelter = selectedShelter || shelters[0];

  const renderFacilityBadges = (facilities) => {
    if (!facilities) return null;
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
    if (clean.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '3px' }}>
        {clean.map((tag, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '10px',
              backgroundColor: '#edf4eb',
              color: '#153322',
              padding: '1px 5px',
              borderRadius: '3px',
              fontWeight: 600
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // Group by Area for Zone Comparison
  const areaGroups = distinctAreas.map((area) => {
    const inArea = shelters.filter((s) => s.area === area);
    const cap = inArea.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const occ = inArea.reduce((sum, s) => sum + (s.occupied || 0), 0);
    const rate = cap > 0 ? Math.round((occ / cap) * 100) : 0;
    return {
      area,
      sheltersCount: inArea.length,
      capacity: cap,
      occupied: occ,
      available: Math.max(0, cap - occ),
      rate
    };
  }).sort((a, b) => b.rate - a.rate);

  return (
    <>
      {/* Header */}
      <div className="sh-view-header-row">
        <div>
          <div className="sh-view-pre-title">CAPACITY & OCCUPANCY MONITORING</div>
          <h1 className="sh-view-title">Capacity & Occupancy</h1>
          <p className="sh-view-desc">
            Real-time space surveillance, bed utilization tracking, and surge overflow mitigation across verified shelters.
          </p>
        </div>
        <div className="sh-header-actions">
          <button className="sh-btn-outline" onClick={onOpenExportModal}>
            <Download size={15} />
            Export Capacity Report
          </button>
          <button className="sh-btn-primary" onClick={onOpenCreateModal}>
            <Plus size={16} />
            Register Operational Shelter
          </button>
        </div>
      </div>

      {/* Top 6 Capacity Telemetry Cards */}
      <div className="sh-metrics-grid">
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Total System Capacity</span>
            <div className="sh-metric-icon-tile">
              <Bed size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{totalCapacity.toLocaleString()}</div>
          <div className="sh-metric-subtext">Across {shelters.length} verified facilities</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Current Occupancy</span>
            <div className="sh-metric-icon-tile">
              <Users size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{totalOccupied.toLocaleString()}</div>
          <div className="sh-metric-subtext">Displaced individuals housed</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Verified Available Beds</span>
            <div className="sh-metric-icon-tile">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value" style={{ color: totalAvailable < 50 ? '#b91c1c' : '#15803d' }}>
            {totalAvailable.toLocaleString()}
          </div>
          <div className="sh-metric-subtext">Immediate bed inventory free</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Average Occupancy Rate</span>
            <div className="sh-metric-icon-tile">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{avgOccupancyRate}%</div>
          <div className="sh-metric-subtext">System-wide bed usage</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Near Capacity Alerts</span>
            <div className="sh-metric-icon-tile">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="sh-metric-value" style={{ color: nearCapacityCount > 0 ? '#b45309' : '#183526' }}>
            {nearCapacityCount}
          </div>
          <div className="sh-metric-subtext">&le; 10 spaces or &ge; 85% full</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Critical Full Shelters</span>
            <div className="sh-metric-icon-tile">
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="sh-metric-value" style={{ color: fullSheltersCount > 0 ? '#dc2626' : '#183526' }}>
            {fullSheltersCount}
          </div>
          <div className="sh-metric-subtext">Intake blocked (100% capacity)</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sh-filter-bar">
        <div className="sh-table-search-box">
          <Search size={16} color="#6f8576" />
          <input
            type="text"
            className="sh-table-search-input"
            placeholder="Search capacity by facility or area..."
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
            <option value="ALL">All threshold statuses</option>
            <option value="Operational">Operational</option>
            <option value="Near capacity">Near capacity</option>
            <option value="Full">Full</option>
          </select>

          <select
            className="sh-dropdown-select"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="ALL">All operational sectors</option>
            {distinctAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Master-Detail Split Grid */}
      <div className="sh-master-detail-grid">
        {/* Left Capacity Surveillance Table */}
        <div className="sh-table-card">
          <table className="sh-data-table">
            <thead>
              <tr>
                <th>Shelter Facility</th>
                <th>Sector</th>
                <th>Capacity</th>
                <th>Occupied</th>
                <th>Free Beds</th>
                <th style={{ minWidth: '150px' }}>Space Utilization</th>
                <th>Status</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShelters.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#6f8576' }}>
                    No matching facilities found. Try adjusting filters or search.
                  </td>
                </tr>
              ) : (
                filteredShelters.map((s) => {
                  const isSelected = currentShelter && currentShelter.id === s.id;
                  const cap = s.capacity || 1;
                  const occ = s.occupied || 0;
                  const avail = s.available ?? Math.max(0, cap - occ);
                  const rate = Math.min(100, Math.round((occ / cap) * 100));

                  const isCritical = avail === 0 || rate >= 100;
                  const isWarning = !isCritical && (avail <= 10 || rate >= 85);
                  const barColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e';

                  return (
                    <tr
                      key={s.id}
                      className={isSelected ? 'selected-row' : ''}
                      onClick={() => onSelectShelter(s)}
                    >
                      <td className="sh-shelter-title-cell">
                        <div style={{ fontWeight: 700 }}>{s.name}</div>
                        {renderFacilityBadges(s.facilities || s.accessibility)}
                      </td>
                      <td>{s.area}</td>
                      <td style={{ fontWeight: 600 }}>{cap}</td>
                      <td>{occ}</td>
                      <td style={{ fontWeight: 700, color: avail <= 5 ? '#b91c1c' : '#15803d' }}>
                        {avail}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e9e0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${rate}%`,
                                backgroundColor: barColor,
                                borderRadius: '4px'
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: barColor, minWidth: '35px' }}>
                            {rate}%
                          </span>
                        </div>
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
                          {isCritical ? 'Critical: Full' : isWarning ? 'Near Capacity' : 'Adequate'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            className="sh-btn-outline"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            title="Edit Bed Capacity"
                            onClick={() => onOpenEditModal && onOpenEditModal(s)}
                          >
                            <Edit3 size={13} />
                            Adjust
                          </button>
                          <button
                            className="sh-btn-primary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            title="Allocate Evacuee"
                            disabled={avail <= 0}
                            onClick={() => onOpenAllocateModal && onOpenAllocateModal(s)}
                          >
                            <UserCheck size={13} />
                            Place
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Right Detail Panel: Capacity Inspector */}
        {currentShelter && (
          <div className="sh-detail-panel">
            <div>
              <div className="sh-detail-header-top">
                <div className="sh-detail-code-label">{currentShelter.name}</div>
                <span
                  className={`sh-badge ${currentShelter.available === 0
                    ? 'sh-badge-critical'
                    : currentShelter.available <= 10
                      ? 'sh-badge-warning'
                      : 'sh-badge-operational'
                    }`}
                >
                  <span className="sh-badge-dot" />
                  {currentShelter.status}
                </span>
              </div>
              <h2 className="sh-detail-main-title">{currentShelter.area}</h2>
              <div className="sh-detail-sub-label">Capacity & Space Utilization Inspector</div>
            </div>

            {/* Gauge Breakdown */}
            <div style={{ backgroundColor: '#f5f9f4', border: '1px solid #ddecda', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#183526' }}>
                  Live Space Utilization
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: currentShelter.available <= 10 ? '#b45309' : '#15803d'
                }}>
                  {currentShelter.capacity > 0 ? Math.round((currentShelter.occupied / currentShelter.capacity) * 100) : 0}%
                </span>
              </div>
              <div style={{ height: '10px', backgroundColor: '#e0ebd8', borderRadius: '5px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${currentShelter.capacity > 0 ? Math.min(100, (currentShelter.occupied / currentShelter.capacity) * 100) : 0}%`,
                    backgroundColor: currentShelter.available === 0 ? '#ef4444' : currentShelter.available <= 10 ? '#f59e0b' : '#22c55e',
                    borderRadius: '5px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11.5px', color: '#4d6955' }}>
                <span>Occupied: <strong>{currentShelter.occupied}</strong> beds</span>
                <span>Free: <strong>{currentShelter.available}</strong> beds</span>
                <span>Total: <strong>{currentShelter.capacity}</strong></span>
              </div>
            </div>

            {/* Critical Alert Banner if near capacity or full */}
            {currentShelter.available <= 10 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  backgroundColor: currentShelter.available === 0 ? '#fef2f2' : '#fffbeb',
                  border: currentShelter.available === 0 ? '1px solid #fecaca' : '1px solid #fde68a',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              >
                <AlertTriangle size={18} color={currentShelter.available === 0 ? '#dc2626' : '#d97706'} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: currentShelter.available === 0 ? '#991b1b' : '#92400e' }}>
                    {currentShelter.available === 0 ? 'Shelter at 100% Full Capacity' : 'Near-Capacity Surge Warning'}
                  </div>
                  <div style={{ color: currentShelter.available === 0 ? '#b91c1c' : '#a16207', marginTop: '3px', lineHeight: '1.4' }}>
                    {currentShelter.available === 0
                      ? 'No additional evacuees can be placed here. Incoming arrivals must be routed to adjacent facilities.'
                      : `Only ${currentShelter.available} bed spaces remain free. Review incoming transfers before committing placements.`}
                  </div>
                </div>
              </div>
            )}

            {/* Facility Details */}
            <div className="sh-detail-stats-grid">
              <div className="sh-detail-stat-tile">
                <div className="sh-detail-stat-label">Manager Contact</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#183526', marginTop: '4px' }}>
                  {currentShelter.managerContact || 'Authorised Staff'}
                </div>
              </div>
              <div className="sh-detail-stat-tile">
                <div className="sh-detail-stat-label">Facilities & Amenities</div>
                <div style={{ marginTop: '4px' }}>
                  {renderFacilityBadges(currentShelter.facilities || currentShelter.accessibility)}
                </div>
              </div>
            </div>

            {/* Quick Management Actions */}
            <div className="sh-action-stack" style={{ marginTop: '12px' }}>
              <button
                className="sh-btn-confirm-full"
                onClick={() => onOpenAllocateModal && onOpenAllocateModal(currentShelter)}
                disabled={currentShelter.available <= 0}
                style={{
                  opacity: currentShelter.available <= 0 ? 0.5 : 1,
                  cursor: currentShelter.available <= 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {currentShelter.available <= 0 ? 'Intake Blocked (Full)' : 'Allocate Evacuee to this Facility'}
              </button>
              <button
                className="sh-btn-secondary-full"
                onClick={() => onOpenEditModal && onOpenEditModal(currentShelter)}
              >
                Edit Shelter Capacity & Amenities
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Regional Zone Capacity Comparison */}
      <div className="sh-section-box" style={{ marginTop: '24px' }}>
        <div className="sh-section-box-header">
          <h2 className="sh-section-box-title">Regional Operational Sector Breakdown</h2>
          <span className="sh-count-badge-amber">{areaGroups.length} sectors</span>
        </div>
        <div className="sh-section-box-subtitle">
          Aggregate capacity vs occupancy distribution across disaster zones
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '14px' }}>
          {areaGroups.map((g) => (
            <div
              key={g.area}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dce6dc',
                borderRadius: '8px',
                padding: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#183526' }}>{g.area}</span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: g.rate >= 90 ? '#dc2626' : g.rate >= 75 ? '#d97706' : '#15803d'
                }}>
                  {g.rate}% Utilized
                </span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#e2e9e0', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${g.rate}%`,
                    backgroundColor: g.rate >= 90 ? '#ef4444' : g.rate >= 75 ? '#f59e0b' : '#22c55e',
                    borderRadius: '3px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#657367' }}>
                <span>{g.sheltersCount} Facilities</span>
                <span>{g.occupied} Occupied</span>
                <span>{g.available} Beds Available</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CapacityOccupancyView;

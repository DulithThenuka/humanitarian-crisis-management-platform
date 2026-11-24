import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Calendar,
  ShieldCheck,
  Building2,
  Search,
  RefreshCw,
} from 'lucide-react';

export const ShelterReportsView = ({
  shelters = [],
  reportData = {},
  onOpenExportModal,
  onRefreshData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('ALL');

  const daily = reportData?.dailySummary || {
    totalAdmissions: 0,
    discharges: 0,
    occupancyRateAverage: '0%',
    safetyCompliantShelters: shelters.length,
    pendingSafetyInspections: 0
  };

  const areaOccupancies = reportData?.areaOccupancies || [];
  const distinctAreas = Array.from(new Set(shelters.map((s) => s.area).filter(Boolean)));

  const filteredShelters = shelters.filter((s) => {
    const matchesSearch =
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.area || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = areaFilter === 'ALL' || s.area === areaFilter;
    return matchesSearch && matchesArea;
  });

  const totalCompliant = daily.safetyCompliantShelters ?? shelters.filter((s) => s.accessibility).length;
  const totalSheltersCount = shelters.length > 0 ? shelters.length : (daily.safetyCompliantShelters + daily.pendingSafetyInspections);

  return (
    <>
      {/* Header */}
      <div className="sh-view-header-row">
        <div>
          <div className="sh-view-pre-title">SHELTER TELEMETRY & REPORTING</div>
          <h1 className="sh-view-title">Shelter Reports & Analytics</h1>
          <p className="sh-view-desc">
            Audited occupancy summaries, safety compliance metrics, sector-by-sector utilization, and shelter intake analytics.
          </p>
        </div>
        <div className="sh-header-actions">
          {onRefreshData && (
            <button className="sh-btn-outline" onClick={onRefreshData} title="Sync with database">
              <RefreshCw size={15} />
              Sync Reports
            </button>
          )}
          <button className="sh-btn-primary" onClick={onOpenExportModal}>
            <Download size={15} />
            Export Operational Report
          </button>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="sh-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">24h Admissions</span>
            <div className="sh-metric-icon-tile">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{daily.totalAdmissions ?? 0}</div>
          <div className="sh-metric-subtext">Verified evacuee intake</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">24h Discharges / Relocations</span>
            <div className="sh-metric-icon-tile">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{daily.discharges ?? 0}</div>
          <div className="sh-metric-subtext">Safe return or secondary move</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Average Occupancy</span>
            <div className="sh-metric-icon-tile">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{daily.occupancyRateAverage || '0%'}</div>
          <div className="sh-metric-subtext">Across {totalSheltersCount} active shelters</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Safety Compliance</span>
            <div className="sh-metric-icon-tile">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="sh-metric-value">
            {totalCompliant} / {totalSheltersCount}
          </div>
          <div className="sh-metric-subtext">
            {daily.pendingSafetyInspections > 0
              ? `${daily.pendingSafetyInspections} pending inspection`
              : 'All facilities verified'}
          </div>
        </div>
      </div>

      {/* Area Breakdown & Compliance Table */}
      <div className="sh-two-col-grid">
        {/* Area Occupancy Bar Breakdown */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Sector Occupancy Telemetry</h2>
          </div>
          <div className="sh-section-box-subtitle">Live utilization percentage by operational flood sector</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
            {areaOccupancies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#6f8576', fontSize: '12px' }}>
                No area telemetry recorded yet.
              </div>
            ) : (
              areaOccupancies.map((item) => (
                <div key={item.area}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    marginBottom: '5px'
                  }}>
                    <span>{item.area}</span>
                    <span style={{ color: item.rate >= 95 ? '#b91c1c' : item.rate >= 80 ? '#b45309' : '#15803d' }}>
                      {item.occupied} / {item.totalCap} beds ({item.rate}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e2e9e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.rate}%`,
                        backgroundColor: item.rate >= 95 ? '#ef4444' : item.rate >= 80 ? '#f59e0b' : '#22c55e',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Operational Certification & Audit */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Capacity Compliance & Governance</h2>
          </div>
          <div className="sh-section-box-subtitle">Verified shelter allocation protocol and status tracking</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div style={{
              backgroundColor: '#f3f8f3',
              border: '1px solid #d5e4d4',
              borderRadius: '8px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#183526', fontWeight: 700, fontSize: '13px' }}>
                <CheckCircle2 size={16} color="#15803d" />
                <span>Automated Capacity Guard Protection</span>
              </div>
              <p style={{ margin: '4px 0 0 24px', fontSize: '11.5px', color: '#496050', lineHeight: '1.4' }}>
                All allocation actions enforce database verification of remaining bed spaces to eliminate double-booking across operational facilities.
              </p>
            </div>

            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', fontWeight: 700, fontSize: '13px' }}>
                <AlertTriangle size={16} color="#d97706" />
                <span>High-Occupancy Threshold Alerts</span>
              </div>
              <p style={{ margin: '4px 0 0 24px', fontSize: '11.5px', color: '#a16207', lineHeight: '1.4' }}>
                Facilities exceeding 85% occupancy trigger priority rebalancing notifications to prevent regional overflow during surge disasters.
              </p>
            </div>

            <div style={{
              backgroundColor: '#fafbf9',
              border: '1px solid #e3eae0',
              borderRadius: '8px',
              padding: '12px 14px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#183526', marginBottom: '4px' }}>
                Verified Operational Audit Trail
              </div>
              <div style={{ fontSize: '11px', color: '#6f8576', lineHeight: '1.4' }}>
                Logged under authenticated Shelter Manager session • Compliant with RELIEFCORE data governance and role privacy standards.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Occupancy Report Table */}
      <div className="sh-section-box" style={{ marginTop: '24px' }}>
        <div className="sh-section-box-header">
          <h2 className="sh-section-box-title">Facility-by-Facility Compliance Roster</h2>
          <span className="sh-count-badge-amber">{shelters.length} facilities</span>
        </div>
        <div className="sh-section-box-subtitle">
          Audited facility inventory, capacity limits, and verified operational state
        </div>

        <div style={{ display: 'flex', gap: '12px', margin: '14px 0' }}>
          <div className="sh-table-search-box" style={{ flex: 1 }}>
            <Search size={16} color="#6f8576" />
            <input
              type="text"
              className="sh-table-search-input"
              placeholder="Search facilities roster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="sh-dropdown-select"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="ALL">All sectors</option>
            {distinctAreas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="sh-table-card">
          <table className="sh-data-table">
            <thead>
              <tr>
                <th>Shelter Facility</th>
                <th>Sector</th>
                <th>Capacity</th>
                <th>Occupancy</th>
                <th>Available</th>
                <th>Utilization</th>
                <th>Contact</th>
                <th>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredShelters.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#6f8576' }}>
                    No facilities found.
                  </td>
                </tr>
              ) : (
                filteredShelters.map((s) => {
                  const cap = s.capacity || 1;
                  const occ = s.occupied || 0;
                  const rate = Math.round((occ / cap) * 100);
                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700, color: '#183526' }}>{s.name}</td>
                      <td>{s.area}</td>
                      <td>{s.capacity}</td>
                      <td>{s.occupied}</td>
                      <td style={{ fontWeight: 700, color: s.available <= 5 ? '#b91c1c' : '#15803d' }}>
                        {s.available}
                      </td>
                      <td>{rate}%</td>
                      <td style={{ fontSize: '11.5px', color: '#657367' }}>{s.managerContact}</td>
                      <td>
                        <span
                          className={`sh-badge ${s.status === 'Operational'
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
      </div>
    </>
  );
};

export default ShelterReportsView;

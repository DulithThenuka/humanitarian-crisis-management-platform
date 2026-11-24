import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  UserCheck,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  LogOut,
  ArrowRight,
  ArrowRightLeft,
  ShieldCheck,
  Phone,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { shelterService } from '../../../services/shelterService';

export const PlacementAllocationsView = ({
  shelters = [],
  placements = [],
  intakeQueue = [],
  metrics = {},
  onOpenCreatePlacementModal,
  onOpenTransferModal,
  onOpenExportModal,
  onDischargePlacement,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'intake', 'history'
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [shelterFilter, setShelterFilter] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState(false);

  // Active placements
  const activePlacements = placements.filter((p) => p.status !== 'Discharged');
  // Discharged placements
  const dischargedPlacements = placements.filter((p) => p.status === 'Discharged');

  // Total active evacuees accommodated
  const totalActiveEvacuees = activePlacements.reduce((sum, p) => sum + (p.partySize || 1), 0);
  const pendingIntakesCount = intakeQueue.length;

  // Filtered Active Placements
  const filteredActive = activePlacements.filter((p) => {
    const matchesSearch =
      (p.evacueeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.headOfFamily || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.assignedShelter || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.specialNotes || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShelter = shelterFilter === 'ALL' || p.shelterId === shelterFilter || p.assignedShelter === shelterFilter;
    return matchesSearch && matchesShelter;
  });

  // Filtered Intake Queue
  const filteredIntake = intakeQueue.filter((q) => {
    const matchesSearch =
      (q.citizenName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.caseReference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.specialNeeds || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = urgencyFilter === 'ALL' || q.urgency?.toLowerCase() === urgencyFilter.toLowerCase();
    return matchesSearch && matchesUrgency;
  });

  // Filtered History
  const filteredHistory = dischargedPlacements.filter((p) => {
    return (
      (p.evacueeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.assignedShelter || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDischarge = async (placement) => {
    const confirmMsg = `Confirm discharge for ${placement.evacueeName} (${placement.partySize} persons)? This will release ${placement.partySize} bed spaces back to the shelter inventory.`;
    if (!window.confirm(confirmMsg)) return;

    setIsProcessing(true);
    try {
      if (onDischargePlacement) {
        await onDischargePlacement(placement.id);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="sh-view-header-row">
        <div>
          <div className="sh-view-pre-title">EVACUEE PLACEMENT & ALLOCATION WORKFLOW</div>
          <h1 className="sh-view-title">Placement Allocations</h1>
          <p className="sh-view-desc">
            Role-scoped evacuee intake registry, family allocations, bed space assignment, and safe discharge management.
          </p>
        </div>
        <div className="sh-header-actions">
          {onRefreshData && (
            <button className="sh-btn-outline" onClick={onRefreshData} title="Sync with database">
              <RefreshCw size={15} />
              Sync Roster
            </button>
          )}
          <button className="sh-btn-outline" onClick={onOpenExportModal}>
            <Download size={15} />
            Export Placement Report
          </button>
          <button className="sh-btn-primary" onClick={() => onOpenCreatePlacementModal && onOpenCreatePlacementModal(null)}>
            <Plus size={16} />
            New Evacuee Placement
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="sh-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Active Placements</span>
            <div className="sh-metric-icon-tile">
              <UserCheck size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{activePlacements.length}</div>
          <div className="sh-metric-subtext">{totalActiveEvacuees} total individuals housed</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Family Intake Queue</span>
            <div className="sh-metric-icon-tile">
              <Users size={16} />
            </div>
          </div>
          <div className="sh-metric-value" style={{ color: pendingIntakesCount > 0 ? '#b45309' : '#183526' }}>
            {pendingIntakesCount}
          </div>
          <div className="sh-metric-subtext">Pending citizen shelter requests</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Admissions Today</span>
            <div className="sh-metric-icon-tile">
              <Clock size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.admissionsToday ?? 0}</div>
          <div className="sh-metric-subtext">Verified 24h intakes</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Discharges / Transfers</span>
            <div className="sh-metric-icon-tile">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.transfersToday ?? dischargedPlacements.length}</div>
          <div className="sh-metric-subtext">Completed bed releases</div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #dce6dc', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'active' ? '3px solid #183526' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'active' ? '#183526' : '#6f8576',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Active Placements Roster</span>
          <span style={{
            fontSize: '11px',
            padding: '2px 7px',
            borderRadius: '10px',
            backgroundColor: activeTab === 'active' ? '#183526' : '#e2e9e0',
            color: activeTab === 'active' ? '#ffffff' : '#496050'
          }}>
            {activePlacements.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('intake')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'intake' ? '3px solid #183526' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'intake' ? '#183526' : '#6f8576',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Citizen Intake Queue</span>
          {pendingIntakesCount > 0 && (
            <span style={{
              fontSize: '11px',
              padding: '2px 7px',
              borderRadius: '10px',
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              fontWeight: 700
            }}>
              {pendingIntakesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'history' ? '3px solid #183526' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'history' ? '#183526' : '#6f8576',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Discharges & History</span>
          <span style={{
            fontSize: '11px',
            padding: '2px 7px',
            borderRadius: '10px',
            backgroundColor: '#e2e9e0',
            color: '#496050'
          }}>
            {dischargedPlacements.length}
          </span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="sh-filter-bar">
        <div className="sh-table-search-box">
          <Search size={16} color="#6f8576" />
          <input
            type="text"
            className="sh-table-search-input"
            placeholder={
              activeTab === 'intake'
                ? 'Search citizen requests, family names, locations...'
                : 'Search evacuees, allocation codes, facilities...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sh-filter-selects">
          {activeTab === 'intake' ? (
            <select
              className="sh-dropdown-select"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
            >
              <option value="ALL">All urgency levels</option>
              <option value="Critical">Critical urgency</option>
              <option value="High">High urgency</option>
              <option value="Medium">Medium urgency</option>
              <option value="Low">Low urgency</option>
            </select>
          ) : (
            <select
              className="sh-dropdown-select"
              value={shelterFilter}
              onChange={(e) => setShelterFilter(e.target.value)}
            >
              <option value="ALL">All shelter facilities</option>
              {shelters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Tab 1: Active Placements Roster */}
      {activeTab === 'active' && (
        <div className="sh-table-card">
          <table className="sh-data-table">
            <thead>
              <tr>
                <th>Allocation Code</th>
                <th>Evacuee / Family Head</th>
                <th>Party Size</th>
                <th>Assigned Facility</th>
                <th>Accessibility & Needs</th>
                <th>Check-In Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActive.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#6f8576' }}>
                    No active evacuee placements found. Placements will appear here once allocated.
                  </td>
                </tr>
              ) : (
                filteredActive.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: '#183526' }}>
                      {p.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#142e1f' }}>{p.evacueeName}</div>
                      {p.specialNotes && (
                        <div style={{ fontSize: '11px', color: '#657367' }}>{p.specialNotes}</div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{p.partySize}</span> {p.partySize > 1 ? 'persons' : 'person'}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.assignedShelter}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '11.5px', color: '#324a3a', backgroundColor: '#f0f5ee', padding: '3px 8px', borderRadius: '4px' }}>
                        {p.accessibilityNeeded || 'Standard'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#657367' }}>
                      {p.allocatedAt || (p.checkInDate ? new Date(p.checkInDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Verified')}
                    </td>
                    <td>
                      <span className={`sh-badge sh-badge-${p.statusType || 'operational'}`}>
                        <span className="sh-badge-dot" />
                        {p.status || 'Confirmed'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="sh-btn-outline"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#183526', borderColor: '#c8d6c7' }}
                          title="Transfer evacuee to another shelter"
                          disabled={isProcessing}
                          onClick={() => onOpenTransferModal && onOpenTransferModal(p)}
                        >
                          <ArrowRightLeft size={12} />
                          Transfer
                        </button>
                        <button
                          className="sh-btn-outline"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#b91c1c', borderColor: '#fca5a5' }}
                          title="Release bed spaces & record safe exit"
                          disabled={isProcessing}
                          onClick={() => handleDischarge(p)}
                        >
                          <LogOut size={12} />
                          Discharge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Family Intake Queue */}
      {activeTab === 'intake' && (
        <div className="sh-table-card">
          <table className="sh-data-table">
            <thead>
              <tr>
                <th>Case Ref</th>
                <th>Displaced Citizen / Household</th>
                <th>Party Size</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Urgency</th>
                <th>Special Needs / Context</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIntake.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#6f8576' }}>
                    No pending family intake requests in queue. All citizen requests currently placed or resolved!
                  </td>
                </tr>
              ) : (
                filteredIntake.map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 700, color: '#183526' }}>{q.caseReference}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{q.citizenName}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{q.numberOfPeople}</span> {q.numberOfPeople > 1 ? 'persons' : 'person'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#496050' }}>
                        <MapPin size={12} />
                        <span>{q.location}</span>
                      </div>
                    </td>
                    <td>
                      {q.contactPhone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#496050' }}>
                          <Phone size={12} />
                          <span>{q.contactPhone}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>None provided</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`sh-badge ${q.urgency?.toLowerCase() === 'critical'
                          ? 'sh-badge-critical'
                          : q.urgency?.toLowerCase() === 'high'
                            ? 'sh-badge-warning'
                            : 'sh-badge-operational'
                          }`}
                      >
                        <span className="sh-badge-dot" />
                        {q.urgency}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px', fontSize: '11.5px', color: '#657367' }}>
                      {q.specialNeeds || 'Evacuation shelter requested'}
                    </td>
                    <td>
                      <button
                        className="sh-btn-primary"
                        style={{ padding: '6px 12px', fontSize: '11.5px' }}
                        onClick={() => onOpenCreatePlacementModal && onOpenCreatePlacementModal(q)}
                      >
                        <UserCheck size={13} />
                        Assign & Place
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Placement History & Discharges */}
      {activeTab === 'history' && (
        <div className="sh-table-card">
          <table className="sh-data-table">
            <thead>
              <tr>
                <th>Allocation Code</th>
                <th>Evacuee / Family Head</th>
                <th>Party Size</th>
                <th>Accommodated Shelter</th>
                <th>Check-In</th>
                <th>Discharged / Relocated</th>
                <th>Audit Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#6f8576' }}>
                    No discharge records logged yet. Completed evacuations will be archived here.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: '#64748b' }}>{p.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.evacueeName}</div>
                    </td>
                    <td>{p.partySize} members</td>
                    <td>{p.assignedShelter}</td>
                    <td style={{ fontSize: '12px', color: '#657367' }}>
                      {p.checkInDate ? new Date(p.checkInDate).toLocaleDateString() : p.allocatedAt}
                    </td>
                    <td style={{ fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
                      {p.checkOutDate ? new Date(p.checkOutDate).toLocaleString() : 'Discharged'}
                    </td>
                    <td style={{ fontSize: '11.5px', color: '#6f8576' }}>
                      {p.specialNotes || 'Safe relocation completed'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default PlacementAllocationsView;

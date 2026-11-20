import React from 'react';
import {
  Building2,
  Users,
  Bed,
  CheckCircle2,
  Send,
  BarChart2,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const ShelterDashboardView = ({
  metrics = {},
  priorityItems = [],
  shelters = [],
  workflowSteps = [],
  recentActivity = [],
  onNavigateTab = () => {},
  onSelectPriorityItem = () => {},
  onRefresh
}) => {
  return (
    <>
      {/* View Header */}
      <div className="sh-view-header-row">
        <div>
          <div className="sh-view-pre-title">RELIEFCORE OPERATIONS</div>
          <h1 className="sh-view-title">Shelter Manager Dashboard</h1>
          <p className="sh-view-desc">
            Operational monitoring of verified emergency shelters, remaining capacity, evacuee placements, and urgent supply requisitions.
          </p>
        </div>
        <div className="sh-header-actions">
          {onRefresh && (
            <button className="sh-btn-outline" onClick={onRefresh} title="Sync with database">
              <RefreshCw size={15} />
              Refresh Telemetry
            </button>
          )}
          <button
            className="sh-btn-primary"
            onClick={() => onNavigateTab && onNavigateTab('directory')}
          >
            Open Directory & Facilities
          </button>
        </div>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="sh-metrics-grid">
        {/* 1. Registered shelters */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Registered shelters</span>
            <div className="sh-metric-icon-tile">
              <Building2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.registeredShelters || 0}</div>
          <div className="sh-metric-subtext">{metrics.operationalShelters || 0} operational</div>
        </div>

        {/* 2. Current occupancy */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Current occupancy</span>
            <div className="sh-metric-icon-tile">
              <Users size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{(metrics.currentOccupancy || 0).toLocaleString()}</div>
          <div className="sh-metric-subtext">Across {metrics.acrossSites || metrics.registeredShelters || 0} sites</div>
        </div>

        {/* 3. Remaining capacity */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Remaining capacity</span>
            <div className="sh-metric-icon-tile">
              <Bed size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{Math.max(0, metrics.remainingCapacity || 0)}</div>
          <div className="sh-metric-subtext">Verified available beds</div>
        </div>

        {/* 4. Near capacity */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Near capacity</span>
            <div className="sh-metric-icon-tile">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.nearCapacityCount || 0}</div>
          <div className="sh-metric-subtext">Capacity review required</div>
        </div>

        {/* 5. Pending Requisitions */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Pending requisitions</span>
            <div className="sh-metric-icon-tile">
              <Send size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.supplyShortages ?? 0}</div>
          <div className="sh-metric-subtext">{metrics.criticalShortages ?? 0} high priority</div>
        </div>

        {/* 6. Operational Status */}
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Active facilities</span>
            <div className="sh-metric-icon-tile">
              <BarChart2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{metrics.operationalShelters || 0}</div>
          <div className="sh-metric-subtext">Ready for disaster intake</div>
        </div>
      </div>

      {/* Middle Row: Priority Attention & Facility Capacity Surveillance */}
      <div className="sh-two-col-grid">
        {/* Priority Attention */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Priority attention</h2>
            <span className="sh-count-badge-amber">{priorityItems.length} items</span>
          </div>
          <div className="sh-section-box-subtitle">Role-scoped records requiring review</div>

          <div className="sh-priority-list">
            {priorityItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 12px', color: '#6f8576', fontSize: '12px' }}>
                <CheckCircle2 size={24} color="#15803d" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                All operational sectors stable. No urgent capacity bottlenecks or pending requisitions.
              </div>
            ) : (
              priorityItems.map((item) => (
                <div
                  key={item.id}
                  className="sh-priority-item"
                  onClick={() => onSelectPriorityItem && onSelectPriorityItem(item)}
                >
                  <div className="sh-priority-left">
                    <div className="sh-num-circle">{item.id}</div>
                    <div>
                      <h4 className="sh-priority-title">{item.title}</h4>
                      <p className="sh-priority-subtitle">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="sh-priority-right">
                    <span className={`sh-badge sh-badge-${item.badge}`}>
                      <span className="sh-badge-dot" />
                      {item.badgeText}
                    </span>
                    <ChevronRight size={16} color="#8ca393" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Facility Capacity Surveillance */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Facility Capacity Surveillance</h2>
            <button
              onClick={() => onNavigateTab('capacity')}
              style={{
                background: 'none',
                border: 'none',
                color: '#15803d',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="sh-section-box-subtitle">Live bed space availability across operational facilities</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            {shelters.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#6f8576', fontSize: '12px' }}>
                Connecting to shelter telemetry...
              </div>
            ) : (
              shelters.slice(0, 4).map((s) => {
                const cap = s.capacity || 1;
                const occ = s.occupied || 0;
                const avail = s.available ?? Math.max(0, cap - occ);
                const rate = Math.min(100, Math.round((occ / cap) * 100));
                const barColor = avail === 0 ? '#ef4444' : avail <= 10 ? '#f59e0b' : '#22c55e';

                return (
                  <div
                    key={s.id}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: '#fafbf9',
                      border: '1px solid #e3eae0',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    onClick={() => onNavigateTab('capacity')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#183526' }}>{s.name}</span>
                      <span style={{ fontWeight: 700, fontSize: '11.5px', color: barColor }}>
                        {avail} beds free ({rate}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#e2e9e0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${rate}%`,
                          backgroundColor: barColor,
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity & Privacy Boundary */}
      <div className="sh-two-col-grid">
        {/* Recent Activity */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Recent activity</h2>
          </div>
          <div className="sh-activity-timeline" style={{ marginTop: '12px' }}>
            {recentActivity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: '#6f8576', fontSize: '12px' }}>
                No recent shelter activity logged. Telemetry connected to live database.
              </div>
            ) : (
              recentActivity.map((act) => (
                <div key={act.id} className="sh-activity-row">
                  <span className="sh-activity-time">{act.time}</span>
                  <div className="sh-activity-content">
                    <h4 className="sh-activity-title">{act.title}</h4>
                    <p className="sh-activity-sub">{act.action}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Privacy Boundary */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Privacy boundary</h2>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div className="sh-privacy-card">
              <ShieldCheck size={22} color="#15803d" />
              <span>
                Shelter operations and placements only. Detailed case notes remain hidden.
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#6f8576', marginTop: '14px', lineHeight: '1.45' }}>
              All queries and updates performed in this workspace comply with role-based access security. Personally identifiable citizen data and sensitive triage interviews are accessible only by authorized Emergency Coordinators.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShelterDashboardView;



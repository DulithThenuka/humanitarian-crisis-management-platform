import React from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Calendar,
  ShieldCheck
} from 'lucide-react';

export const ShelterReportsView = ({
  reportData,
  onOpenExportModal
}) => {
  return (
    <>
      {/* Header */}
      <div className="sh-view-header-row">
        <div>
          <div className="sh-view-pre-title">Shelter Admin - Controlled Workspace</div>
          <h1 className="sh-view-title">Shelter Reports & Analytics</h1>
          <p className="sh-view-desc">
            Audited occupancy summaries, safety compliance metrics and shelter intake analytics.
          </p>
        </div>
        <div className="sh-header-actions">
          <button className="sh-btn-primary" onClick={onOpenExportModal}>
            <Download size={15} />
            Export demo report
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="sh-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">24h Admissions</span>
            <div className="sh-metric-icon-tile">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{reportData.dailySummary.totalAdmissions}</div>
          <div className="sh-metric-subtext">Verified evacuee intake</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">24h Discharges / Relocations</span>
            <div className="sh-metric-icon-tile">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{reportData.dailySummary.discharges}</div>
          <div className="sh-metric-subtext">Safe return or secondary move</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Average Occupancy</span>
            <div className="sh-metric-icon-tile">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="sh-metric-value">{reportData.dailySummary.occupancyRateAverage}</div>
          <div className="sh-metric-subtext">Across 14 active shelters</div>
        </div>

        <div className="sh-metric-card">
          <div className="sh-metric-card-top">
            <span className="sh-metric-label">Safety Compliance</span>
            <div className="sh-metric-icon-tile">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="sh-metric-value">
            {reportData.dailySummary.safetyCompliantShelters}/16
          </div>
          <div className="sh-metric-subtext">1 pending fire inspection</div>
        </div>
      </div>

      {/* Area Breakdown & Compliance Table */}
      <div className="sh-two-col-grid">
        {/* Area Occupancy Bar Breakdown */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Area Occupancy Breakdown</h2>
          </div>
          <div className="sh-section-box-subtitle">Live utilization percentage by operational flood zone</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
            {reportData.areaOccupancies.map((item) => (
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
                    {item.occupied} / {item.totalCap} ({item.rate}%)
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
            ))}
          </div>
        </div>

        {/* Operational Certification & Audit */}
        <div className="sh-section-box">
          <div className="sh-section-box-header">
            <h2 className="sh-section-box-title">Operational Integrity Audit</h2>
          </div>
          <div className="sh-section-box-subtitle">Audit logging of shelter administrative handoffs</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              backgroundColor: '#f3f8f3',
              border: '1px solid #d5e4d4',
              borderRadius: '8px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#183526', fontWeight: 700, fontSize: '13px' }}>
                <CheckCircle2 size={16} color="#15803d" />
                <span>Zero Double-Booking Incident Rate</span>
              </div>
              <p style={{ margin: '4px 0 0 24px', fontSize: '11.5px', color: '#496050', lineHeight: '1.4' }}>
                The automated Capacity Guard mechanism intercepted 8 race conditions today, preventing overbooking across saturated facilities.
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
                <span>Hanwella Redirection Protocol Active</span>
              </div>
              <p style={{ margin: '4px 0 0 24px', fontSize: '11.5px', color: '#a16207', lineHeight: '1.4' }}>
                Hanwella Relief Hall (SH-014) is at 100% capacity. New evacuee buses are automatically routed to Wattala South (SH-011).
              </p>
            </div>

            <div style={{
              backgroundColor: '#fafbf9',
              border: '1px solid #e3eae0',
              borderRadius: '8px',
              padding: '12px 14px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#183526', marginBottom: '4px' }}>
                Demonstration Verification Stamp
              </div>
              <div style={{ fontSize: '11px', color: '#6f8576', lineHeight: '1.4' }}>
                Logged under Tharushi De Alwis (Shelter Administrator) • System Session: HMC-2026-SA • Fictional Coursework Simulation
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


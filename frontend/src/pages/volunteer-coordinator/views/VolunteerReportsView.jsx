import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  CheckCircle2,
  Users,
  Clock,
  ShieldCheck,
  TrendingUp,
  MapPin,
  FileSpreadsheet,
  Printer,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { OPERATIONAL_AREAS } from '../data/coordinatorData';
import { volunteerService } from '../../../services/volunteerService';

export const VolunteerReportsView = ({ onOpenExportModal }) => {
  const [selectedRange, setSelectedRange] = useState('Today');
  const [selectedArea, setSelectedArea] = useState('All operational areas');
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadReports();
  }, [selectedRange, selectedArea]);

  const loadReports = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await volunteerService.getReports({
        period: selectedRange,
        operationalArea: selectedArea === 'All operational areas' ? null : selectedArea
      });
      const data = res.data || res;
      setReportsData(data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to aggregate volunteer reports from database.');
    } finally {
      setLoading(false);
    }
  };

  const reportMetrics = [
    {
      title: 'Total Mobilized',
      value: reportsData?.totalMobilized?.toString() || '0',
      sub: 'Active & eligible roster across crisis sector',
      icon: Users,
      color: '#2563eb'
    },
    {
      title: 'Shifts Fulfilled',
      value: reportsData?.shiftsFulfilled?.toString() || '0',
      sub: `${reportsData?.totalVolunteerHoursServed || 0}+ total hours deployed`,
      icon: Clock,
      color: '#16a34a'
    },
    {
      title: 'Mobilization Rate',
      value: reportsData?.mobilizationRate || '0.0%',
      sub: 'Verified responder deployment efficiency',
      icon: TrendingUp,
      color: '#0891b2'
    },
    {
      title: 'Safety Incidents',
      value: reportsData?.safetyIncidents?.toString() || '0',
      sub: reportsData?.safetyIncidents === 0 ? 'Zero critical hazards or injuries reported' : 'Incidents logged for review',
      icon: ShieldCheck,
      color: '#15803d'
    }
  ];

  const areaBreakdown = reportsData?.areaBreakdown || [];
  const skillDistribution = reportsData?.skillDistribution || [];

  return (
    <div>
      {/* 1. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">COMPREHENSIVE FIELD REPORTING</div>
          <h1 className="vc-page-title">Volunteer Reports & Analytics</h1>
          <p className="vc-page-desc">
            Aggregated operational metrics, mobilization indicators, and compliance verification logs derived directly from database records.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="vc-btn-outline" onClick={() => window.print()}>
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button className="vc-btn-primary" onClick={onOpenExportModal}>
            <Download size={14} />
            <span>Export CSV / Audit</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="vc-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4a5b4a' }}>
          <Calendar size={15} style={{ color: '#657367' }} />
          <span>Report Period:</span>
          <select
            className="vc-filter-select"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            <option value="Today">Today (Current Operation Shift)</option>
            <option value="Past 48 Hours">Past 48 Hours</option>
            <option value="Past 7 Days">Past 7 Days (Flood Surge Window)</option>
            <option value="Full Incident">Full Incident Cumulative</option>
          </select>
        </div>

        <select
          className="vc-filter-select"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          {OPERATIONAL_AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {errorMsg && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#657367' }}>
          <Loader2 size={24} className="vc-spin" style={{ margin: '0 auto 12px auto' }} />
          <div>Aggregating field deployment and volunteer statistics from SQL Server...</div>
        </div>
      ) : (
        <>
          {/* 3. Stat Cards */}
          <div className="vc-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
            {reportMetrics.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="vc-stat-card">
                  <div className="vc-stat-header">
                    <span className="vc-stat-label">{stat.title}</span>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#eef1ea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color
                      }}
                    >
                      <Icon size={15} />
                    </div>
                  </div>
                  <div className="vc-stat-value">{stat.value}</div>
                  <div className="vc-stat-sub">{stat.sub}</div>
                </div>
              );
            })}
          </div>

          {/* 4. Two-Column Chart/Breakdown Section */}
          <div className="vc-split-layout">
            {/* Left: Operational Area Distribution */}
            <div className="vc-card" style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#14291e',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #eef1ea'
                }}
              >
                Deployment Distribution by Operational Sector
              </h3>

              {areaBreakdown.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#657367', fontSize: '13px' }}>
                  No volunteer assignments recorded in selected sector for this timeframe.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {areaBreakdown.map((item, idx) => (
                    <div key={idx}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: '#14291e' }}>{item.name}</span>
                        <span style={{ color: '#657367' }}>
                          {item.count} volunteers ({item.percent}%) · {item.status}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '8px',
                          backgroundColor: '#eef1ea',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(100, item.percent)}%`,
                            backgroundColor: '#0c2340',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Skill Mix Allocation */}
            <div className="vc-card" style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#14291e',
                  marginBottom: '14px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #eef1ea'
                }}
              >
                Skill Set Capacity & Utilization
              </h3>

              {skillDistribution.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#657367', fontSize: '13px' }}>
                  No skills recorded for selected filters.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {skillDistribution.map((skill, idx) => (
                    <div key={idx}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: '#14291e' }}>{skill.skill}</span>
                        <span style={{ color: '#657367' }}>
                          {skill.count} ({skill.percent}%)
                        </span>
                      </div>
                      <div
                        style={{
                          height: '8px',
                          backgroundColor: '#eef1ea',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(100, skill.percent)}%`,
                            backgroundColor: skill.color || '#3b82f6',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                style={{
                  marginTop: '18px',
                  padding: '10px 12px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '6px',
                  border: '1px solid #dcfce7',
                  fontSize: '11px',
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                <span>All metrics are calculated directly from active records in SQL Server (HumanitarianCrisisDb).</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteerReportsView;

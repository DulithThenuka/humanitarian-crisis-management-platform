import React, { useState } from 'react';
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
  Printer
} from 'lucide-react';
import { OPERATIONAL_AREAS } from '../data/coordinatorData';

export const VolunteerReportsView = ({ onOpenExportModal }) => {
  const [selectedRange, setSelectedRange] = useState('Today');
  const [selectedArea, setSelectedArea] = useState('All operational areas');

  const reportMetrics = [
    {
      title: 'Total Mobilized',
      value: '386',
      sub: 'Active roster across western flood zone',
      icon: Users,
      color: '#2563eb'
    },
    {
      title: 'Shifts Fulfilled',
      value: '742',
      sub: '4,300+ total volunteer hours served',
      icon: Clock,
      color: '#16a34a'
    },
    {
      title: 'Mobilization Rate',
      value: '94.2%',
      sub: '98% on-time shift check-in',
      icon: TrendingUp,
      color: '#0891b2'
    },
    {
      title: 'Safety Incidents',
      value: '0',
      sub: 'Zero critical hazards or safety violations',
      icon: ShieldCheck,
      color: '#15803d'
    }
  ];

  const areaBreakdown = [
    { name: 'Kelani East', count: 148, percent: 38, status: 'High activity' },
    { name: 'Biyagama North', count: 112, percent: 29, status: 'Active distribution' },
    { name: 'Wattala South', count: 76, percent: 20, status: 'Intake & Shelter' },
    { name: 'Central Depot', count: 50, percent: 13, status: 'Logistics hub' }
  ];

  const skillDistribution = [
    { skill: 'Emergency First Aid & Medical', count: 132, percent: 34, color: '#ef4444' },
    { skill: 'Logistics & Supply Transport', count: 108, percent: 28, color: '#f59e0b' },
    { skill: 'Shelter & Intake Support', count: 85, percent: 22, color: '#3b82f6' },
    { skill: 'Translation & Community Outreach', count: 61, percent: 16, color: '#10b981' }
  ];

  return (
    <div>
      {/* 1. Header */}
      <div className="vc-page-header">
        <div>
          <div className="vc-page-eyebrow">COMPREHENSIVE FIELD REPORTING</div>
          <h1 className="vc-page-title">Volunteer Reports & Analytics</h1>
          <p className="vc-page-desc">
            Aggregated operational metrics, mobilization indicators, and compliance verification logs.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="vc-btn-outline" onClick={() => window.print()}>
            <Printer size={14} />
            <span>Print report</span>
          </button>
          <button className="vc-btn-primary" onClick={onOpenExportModal}>
            <Download size={14} />
            <span>Export CSV / Audit</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="vc-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
          <Calendar size={15} style={{ color: '#64748b' }} />
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
                    backgroundColor: '#f1f5f9',
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
              color: '#0f172a',
              marginBottom: '14px',
              paddingBottom: '8px',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            Deployment Distribution by Operational Sector
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {areaBreakdown.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</span>
                  <span style={{ color: '#64748b' }}>
                    {item.count} volunteers ({item.percent}%) · {item.status}
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.percent}%`,
                      backgroundColor: '#233831',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Skill Mix Allocation */}
        <div className="vc-card" style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '14px',
              paddingBottom: '8px',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            Skill Set Capacity & Utilization
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {skillDistribution.map((skill, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{skill.skill}</span>
                  <span style={{ color: '#64748b' }}>
                    {skill.count} ({skill.percent}%)
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${skill.percent}%`,
                      backgroundColor: skill.color,
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

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
            <span>All deployed personnel have undergone verified identity check & safety briefing.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

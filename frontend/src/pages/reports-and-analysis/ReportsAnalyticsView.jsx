import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  PieChart, 
  Users, 
  Cpu, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  ChevronDown, 
  Calendar, 
  Lightbulb, 
  ChevronRight, 
  Truck, 
  Droplet, 
  Utensils, 
  Cross,
  Home
} from 'lucide-react';
import './ReportsAnalyticsView.css';

export const ReportsAnalyticsView = () => {
  const [activeRange, setActiveRange] = useState('7 Days');

  return (
    <div className="reports-view-container">
      {/* Top Filter Ribbon */}
      <div className="rep-filter-bar">
        <div className="rep-filter-dropdown date-filter">
          <Calendar size={14} />
          <span>Last 7 Days</span>
          <ChevronDown size={13} />
        </div>

        <div className="rep-filter-dropdown">
          <span className="fd-label">Crisis:</span>
          <span className="fd-val">All</span>
          <ChevronDown size={13} />
        </div>

        <div className="rep-filter-dropdown">
          <span className="fd-label">Organisation:</span>
          <span className="fd-val">All</span>
          <ChevronDown size={13} />
        </div>

        <div className="rep-filter-dropdown">
          <span className="fd-label">Location:</span>
          <span className="fd-val">All</span>
          <ChevronDown size={13} />
        </div>
      </div>

      {/* Row 1: 5 Top KPI Cards */}
      <div className="rep-kpi-grid">
        <div className="rep-kpi-card card-red">
          <div className="rep-kpi-header">
            <div className="rep-icon-box box-red">
              <FileText size={17} />
            </div>
            <div className="rep-meta-col">
              <span className="rep-kpi-label">Unresolved Cases</span>
              <div className="rep-val-row">
                <span className="rep-kpi-num">52</span>
                <span className="rep-tag tag-red"><ArrowUp size={11} /> 18%</span>
              </div>
            </div>
          </div>
          <div className="rep-card-foot">
            <span>+8 from yesterday</span>
          </div>
          <svg className="rep-kpi-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
            <path d="M0,35 Q40,10 80,30 T160,15 T200,28 L200,40 L0,40 Z" fill="#fee2e2" />
            <path d="M0,35 Q40,10 80,30 T160,15 T200,28" fill="none" stroke="#ef4444" strokeWidth="2" />
          </svg>
        </div>

        <div className="rep-kpi-card card-green">
          <div className="rep-kpi-header">
            <div className="rep-icon-box box-green">
              <Clock size={17} />
            </div>
            <div className="rep-meta-col">
              <span className="rep-kpi-label">Average Response Time</span>
              <div className="rep-val-row">
                <span className="rep-kpi-num">42 min</span>
                <span className="rep-tag tag-green"><ArrowDown size={11} /> 30%</span>
              </div>
            </div>
          </div>
          <div className="rep-card-foot">
            <span>Target: 60 min</span>
          </div>
          <svg className="rep-kpi-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
            <path d="M0,38 Q50,30 90,20 T150,22 T200,10 L200,40 L0,40 Z" fill="#d1fae5" />
            <path d="M0,38 Q50,30 90,20 T150,22 T200,10" fill="none" stroke="#10b981" strokeWidth="2" />
          </svg>
        </div>

        <div className="rep-kpi-card card-orange">
          <div className="rep-kpi-header">
            <div className="rep-icon-box box-orange">
              <PieChart size={17} />
            </div>
            <div className="rep-meta-col">
              <span className="rep-kpi-label">Resource Utilisation</span>
              <div className="rep-val-row">
                <span className="rep-kpi-num">78%</span>
                <span className="rep-tag tag-orange"><ArrowUp size={11} /> 12%</span>
              </div>
            </div>
          </div>
          <div className="rep-card-foot">
            <span>High demand</span>
          </div>
          <svg className="rep-kpi-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
            <path d="M0,32 Q50,38 100,25 T160,20 T200,28 L200,40 L0,40 Z" fill="#fef3c7" />
            <path d="M0,32 Q50,38 100,25 T160,20 T200,28" fill="none" stroke="#f59e0b" strokeWidth="2" />
          </svg>
        </div>

        <div className="rep-kpi-card card-blue">
          <div className="rep-kpi-header">
            <div className="rep-icon-box box-blue">
              <Users size={17} />
            </div>
            <div className="rep-meta-col">
              <span className="rep-kpi-label">Shelter Occupancy</span>
              <div className="rep-val-row">
                <span className="rep-kpi-num">74%</span>
                <span className="rep-tag tag-blue"><ArrowUp size={11} /> 8%</span>
              </div>
            </div>
          </div>
          <div className="rep-card-foot">
            <span>2 near capacity</span>
          </div>
          <svg className="rep-kpi-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
            <path d="M0,38 Q40,32 90,26 T150,15 T200,20 L200,40 L0,40 Z" fill="#e0f2fe" />
            <path d="M0,38 Q40,32 90,26 T150,15 T200,20" fill="none" stroke="#0284c7" strokeWidth="2" />
          </svg>
        </div>

        <div className="rep-kpi-card card-purple">
          <div className="rep-kpi-header">
            <div className="rep-icon-box box-purple">
              <Cpu size={17} />
            </div>
            <div className="rep-meta-col">
              <span className="rep-kpi-label">AI Override Rate</span>
              <div className="rep-val-row">
                <span className="rep-kpi-num">26%</span>
                <span className="rep-tag tag-purple"><ArrowDown size={11} /> 5%</span>
              </div>
            </div>
          </div>
          <div className="rep-card-foot">
            <span>Coordinator modifications</span>
          </div>
          <svg className="rep-kpi-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
            <path d="M0,32 Q60,38 100,22 T160,30 T200,18 L200,40 L0,40 Z" fill="#ede9fe" />
            <path d="M0,32 Q60,38 100,22 T160,30 T200,18" fill="none" stroke="#8b5cf6" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="rep-charts-row">
        <div className="rep-panel-box">
          <div className="rep-panel-head">
            <div className="rep-title-group">
              <div className="rep-icon-badge"><TrendingUp size={15} /></div>
              <div>
                <h4>Requests Over Time</h4>
                <p>Submitted vs. resolved requests — last 7 days</p>
              </div>
            </div>
            <div className="rep-tab-toggle">
              {['7 Days', '30 Days', '90 Days'].map((t) => (
                <button 
                  key={t} 
                  className={`rep-t-btn ${activeRange === t ? 'active' : ''}`}
                  onClick={() => setActiveRange(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="rep-chart-body">
            <div className="rep-y-axis">
              <span>200</span><span>150</span><span>100</span><span>50</span><span>0</span>
            </div>
            <div className="rep-svg-wrapper">
              <div className="rep-dashed-lines">
                <div></div><div></div><div></div><div></div><div></div>
              </div>
              <svg className="rep-svg-graph" viewBox="0 0 600 170" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="submittedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 15,150 Q 110,135 200,115 T 340,55 T 480,30 T 585,18 L 585,170 L 15,170 Z" fill="url(#submittedAreaGrad)" />
                <path d="M 15,150 Q 110,135 200,115 T 340,55 T 480,30 T 585,18" fill="none" stroke="#10b981" strokeWidth="2.5" />
                <path d="M 15,160 Q 110,145 200,130 T 340,90 T 480,65 T 585,45" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                <circle cx="340" cy="55" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <circle cx="340" cy="90" r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              </svg>
              <div className="rep-floating-tooltip" style={{ left: '52%', top: '10%' }}>
                <div className="tip-date">Sep 27</div>
                <div className="tip-row"><span className="dot dot-green"></span> Submitted: <strong>142</strong></div>
                <div className="tip-row"><span className="dot dot-blue"></span> Resolved: <strong>98</strong></div>
              </div>
            </div>
          </div>

          <div className="rep-chart-footer">
            <div className="rep-x-axis">
              <span>Sep 24</span><span>Sep 25</span><span>Sep 26</span><span>Sep 27</span><span>Sep 28</span><span>Sep 29</span><span>Sep 30</span>
            </div>
            <div className="rep-chart-legend">
              <span><span className="dot dot-green"></span> Submitted</span>
              <span><span className="dot dot-blue"></span> Resolved</span>
            </div>
          </div>
        </div>

        <div className="rep-panel-box">
          <div className="rep-panel-head">
            <div className="rep-title-group">
              <div className="rep-icon-badge"><PieChart size={15} /></div>
              <div>
                <h4>Requests by Category</h4>
                <p>Distribution across assistance types</p>
              </div>
            </div>
            <div className="rep-mini-dropdown">
              <span>All Categories</span>
              <ChevronDown size={12} />
            </div>
          </div>

          <div className="rep-donut-row">
            <div className="rep-donut-ring">
              <div className="rep-donut-core">
                <span className="donut-num">186</span>
                <span className="donut-sub">Total Requests</span>
              </div>
            </div>

            <div className="rep-cat-list">
              <div className="rep-cat-item">
                <div className="cat-title"><span className="dot dot-red"></span> Medical</div>
                <span className="cat-val val-red">68</span>
                <span className="cat-pct">36%</span>
              </div>
              <div className="rep-cat-item">
                <div className="cat-title"><span className="dot dot-orange"></span> Food & Water</div>
                <span className="cat-val val-orange">52</span>
                <span className="cat-pct">28%</span>
              </div>
              <div className="rep-cat-item">
                <div className="cat-title"><span className="dot dot-teal"></span> Shelter</div>
                <span className="cat-val val-teal">34</span>
                <span className="cat-pct">18%</span>
              </div>
              <div className="rep-cat-item">
                <div className="cat-title"><span className="dot dot-blue"></span> Transport</div>
                <span className="cat-val val-blue">22</span>
                <span className="cat-pct">12%</span>
              </div>
              <div className="rep-cat-item">
                <div className="cat-title"><span className="dot dot-purple"></span> Accessibility</div>
                <span className="cat-val val-purple">10</span>
                <span className="cat-pct">6%</span>
              </div>
            </div>
          </div>

          <div className="rep-smart-banner">
            <Lightbulb size={16} className="rep-bulb" />
            <p>
              <strong>Medical and Food & Water make up 64% of total demand.</strong> Consider allocating more resources to these categories.
            </p>
            <ChevronRight size={14} className="rep-arrow" />
          </div>
        </div>
      </div>

      {/* Row 3: Bottom Panels */}
      <div className="rep-bottom-grid">
        <div className="rep-panel-box">
          <div className="rep-panel-head">
            <div className="rep-title-group">
              <div className="rep-icon-badge"><Clock size={15} /></div>
              <div>
                <h4>Average Response Time</h4>
                <p>By area (minutes)</p>
              </div>
            </div>
            <div className="rep-mini-dropdown">
              <span>Response Time</span>
              <ChevronDown size={12} />
            </div>
          </div>

          <div className="rep-bars-body">
            <div className="rep-bar-scale">
              <span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
            </div>
            <div className="rep-bars-flex">
              <div className="rep-col">
                <span className="col-val">28</span>
                <div className="col-fill fill-blue" style={{ height: '35%' }}></div>
                <span className="col-label">Colombo</span>
              </div>
              <div className="rep-col">
                <span className="col-val">42</span>
                <div className="col-fill fill-teal" style={{ height: '52%' }}></div>
                <span className="col-label">Gampaha</span>
              </div>
              <div className="rep-col">
                <span className="col-val">58</span>
                <div className="col-fill fill-orange" style={{ height: '72%' }}></div>
                <span className="col-label">Kalutara</span>
              </div>
              <div className="rep-col relative-col">
                <div className="kelaniya-tip">
                  <span>Kelaniya</span>
                  <strong>35 min</strong>
                </div>
                <div className="col-fill fill-cyan" style={{ height: '44%' }}></div>
                <span className="col-label">Kelaniya</span>
              </div>
              <div className="rep-col">
                <span className="col-val text-red">64</span>
                <div className="col-fill fill-red" style={{ height: '80%' }}></div>
                <span className="col-label">Negombo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rep-panel-box">
          <div className="rep-panel-head">
            <div className="rep-title-group">
              <div className="rep-icon-badge"><Cross size={15} /></div>
              <div>
                <h4>Resource Utilisation by Category</h4>
              </div>
            </div>
            <div className="rep-mini-dropdown">
              <span>All Resources</span>
              <ChevronDown size={12} />
            </div>
          </div>

          <div className="rep-meters-body">
            <div className="meter-unit">
              <div className="m-head">
                <div className="m-left"><span className="mini-box box-red"><Cross size={10} /></span><span>Medical Supplies</span></div>
                <span className="m-stat">300 dispatched · <strong className="text-orange">78%</strong></span>
              </div>
              <div className="m-track"><div className="m-fill fill-orange" style={{ width: '78%' }}></div></div>
            </div>
            <div className="meter-unit">
              <div className="m-head">
                <div className="m-left"><span className="mini-box box-teal"><Utensils size={10} /></span><span>Food Packs</span></div>
                <span className="m-stat">1,260 dispatched · <strong className="text-teal">65%</strong></span>
              </div>
              <div className="m-track"><div className="m-fill fill-teal" style={{ width: '65%' }}></div></div>
            </div>
            <div className="meter-unit">
              <div className="m-head">
                <div className="m-left"><span className="mini-box box-blue"><Droplet size={10} /></span><span>Drinking Water</span></div>
                <span className="m-stat">5,200 dispatched · <strong className="text-red">82%</strong></span>
              </div>
              <div className="m-track"><div className="m-fill fill-red" style={{ width: '82%' }}></div></div>
            </div>
            <div className="meter-unit">
              <div className="m-head">
                <div className="m-left"><span className="mini-box box-cyan"><Truck size={10} /></span><span>Vehicles</span></div>
                <span className="m-stat">18 dispatched · <strong className="text-teal">55%</strong></span>
              </div>
              <div className="m-track"><div className="m-fill fill-cyan" style={{ width: '55%' }}></div></div>
            </div>
            <div className="meter-unit">
              <div className="m-head">
                <div className="m-left"><span className="mini-box box-amber"><Cross size={10} /></span><span>Blankets</span></div>
                <span className="m-stat">880 dispatched · <strong className="text-orange">70%</strong></span>
              </div>
              <div className="m-track"><div className="m-fill fill-orange" style={{ width: '70%' }}></div></div>
            </div>
          </div>
        </div>

        <div className="rep-panel-box">
          <div className="rep-panel-head">
            <div className="rep-title-group">
              <div className="rep-icon-badge"><Home size={15} /></div>
              <div>
                <h4>Shelter Occupancy Trend</h4>
              </div>
            </div>
            <div className="rep-mini-dropdown">
              <span>All Shelters</span>
              <ChevronDown size={12} />
            </div>
          </div>

          <div className="rep-meters-body">
            <div className="meter-unit">
              <div className="m-head">
                <span>Colombo Central</span>
                <span className="m-stat"><strong className="text-blue">74%</strong> 185 / 250</span>
              </div>
              <div className="m-track"><div className="m-fill fill-blue" style={{ width: '74%' }}></div></div>
            </div>
            <div className="meter-unit">
              <div className="m-head">
                <span>Gampaha Hall</span>
                <span className="m-stat"><strong className="text-orange">79%</strong> 142 / 180</span>
              </div>
              <div className="m-track"><div className="m-fill fill-orange" style={{ width: '79%' }}></div></div>
            </div>
            <div className="meter-unit">
              <div className="m-head">
                <span>Kelaniya Centre</span>
                <span className="m-stat"><strong className="text-teal">65%</strong> 78 / 120</span>
              </div>
              <div className="m-track"><div className="m-fill fill-teal" style={{ width: '65%' }}></div></div>
            </div>
            <div className="meter-unit">
              <div className="m-head">
                <span>Kalutara Sports Hall</span>
                <span className="m-stat"><strong className="text-blue">66%</strong> 198 / 300</span>
              </div>
              <div className="m-track"><div className="m-fill fill-blue" style={{ width: '66%' }}></div></div>
            </div>
            <div className="meter-unit">
              <div className="m-head">
                <span>Wattala Centre</span>
                <span className="m-stat"><strong className="text-red">99%</strong> 79 / 80</span>
              </div>
              <div className="m-track"><div className="m-fill fill-red" style={{ width: '99%' }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
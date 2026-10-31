import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Radio, 
  Search, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Share2, 
  ChevronRight, 
  X, 
  ExternalLink, 
  Building2, 
  PlusSquare, 
  Bell, 
  CheckCircle2, 
  Compass, 
  PhoneCall, 
  Droplets, 
  Zap, 
  CloudRain,
  Flame
} from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import './EmergencyAlertsPage.css';

const VERIFIED_EMERGENCY_ALERTS = [
  {
    id: 'ALT-2026-081',
    title: 'LEVEL 4 CRITICAL: Major Flood Inundation Warning — Kelani River Basin',
    severity: 'Critical',
    severityLevel: 1,
    origin: 'Department of Meteorology & Irrigation Department',
    timestamp: '25 minutes ago',
    validUntil: 'Valid for next 24 hours (Monitored Continuous)',
    sector: 'Colombo & Gampaha (Kelani Basin)',
    district: 'Colombo',
    description: 'Nagalagam Street river gauge has surpassed Major Flood threshold at 7.2 ft and is continuing to rise due to torrential upper catchment discharge. Severe flooding is in progress in lowlands of Kolonnawa, Wellampitiya, Kaduwela, Sedawatta, and Kotikawatta.',
    directives: [
      'Residents in flood-prone zones must execute immediate evacuation to safe higher ground or designated shelters.',
      'Emergency boat evacuation units are operational in Kelani Basin Sector 3.',
      'Do not attempt to walk, wade, or drive through moving floodwaters exceeding 6 inches.',
      'Emergency rescue boats can be flagged using bright cloths or emergency whistles.'
    ],
    shelterRecommendation: 'Colombo Central School (2.4 km away, Capacity: 180 free beds)',
    category: 'Rescue',
    status: 'ACTIVE_RED'
  },
  {
    id: 'ALT-2026-079',
    title: 'LEVEL 3 WARNING: Landslide & Slope Failure Alert — Attanagalla & Mirigama',
    severity: 'High',
    severityLevel: 2,
    origin: 'National Building Research Organisation (NBRO)',
    timestamp: '1 hour ago',
    validUntil: 'Valid until 18:00 hrs tomorrow',
    sector: 'Gampaha District Hillsides & Kegalle Border',
    district: 'Gampaha',
    description: 'Continuous rainfall exceeding 165 mm in past 24 hours has saturated hill slopes. Severe risk of slope failure, rockfalls, and mudslides in elevated areas of Mirigama, Attanagalla, and Pasyala.',
    directives: [
      'Look for early warning signs: ground cracks, sudden muddy spring water, tilting telephone poles or trees.',
      'Evacuate immediately if unusual rumbling sounds or sudden wall cracking occurs.',
      'Do not seek refuge in roadside embankments or downstream ravines.'
    ],
    shelterRecommendation: 'Gampaha Community Hall (Beds available)',
    category: 'Shelter',
    status: 'ACTIVE_AMBER'
  },
  {
    id: 'ALT-2026-077',
    title: 'INFRASTRUCTURE NOTICE: Main Road A1 Closed at Peliyagoda Bridge',
    severity: 'High',
    severityLevel: 2,
    origin: 'Road Development Authority & Traffic Police',
    timestamp: '2 hours ago',
    validUntil: 'Indefinite until water recedes',
    sector: 'Peliyagoda / Kelaniya / Biyagama corridor',
    district: 'Gampaha',
    description: 'Colombo-Kandy Road (A1) between Peliyagoda Bridge and Thorana Junction is completely submerged with water levels exceeding 2.5 feet. Closed to all civilian light vehicles and motorcycles.',
    directives: [
      'Light vehicular traffic diverted to Colombo-Katunayake Expressway (E03) or Outer Circular Highway (E02).',
      'Heavy disaster relief convoys and military trucks have priority clearance.',
      'Pedestrian crossing over Peliyagoda pedestrian bridge prohibited due to structural water pressure.'
    ],
    shelterRecommendation: 'St. Anthony’s Evacuation Center (Peliyagoda)',
    category: 'Transport',
    status: 'ACTIVE_AMBER'
  },
  {
    id: 'ALT-2026-074',
    title: 'PUBLIC HEALTH ADVISORY: Boil-Water & Water Purification Order',
    severity: 'Advisory',
    severityLevel: 3,
    origin: 'Ministry of Health & Water Supply Board',
    timestamp: '4 hours ago',
    validUntil: 'Active during current flood period',
    sector: 'All Western Province Flood Zones',
    district: 'Colombo',
    description: 'Well-water and shallow municipal pipe networks in Kolonnawa, Kaduwela, and Kelaniya may be cross-contaminated with flood runoff. High risk of waterborne gastroenteritis and leptospirosis.',
    directives: [
      'Boil all drinking and food preparation water at a rolling boil for minimum 5 minutes before consumption.',
      'Free Chlorine / Aquatabs purification tablets distributed at all verified relief camps.',
      'Do not allow children to swim or wade in stagnant floodwater pools.'
    ],
    shelterRecommendation: 'All Active Relief Camps have clean bottled water',
    category: 'Medical',
    status: 'ACTIVE_BLUE'
  },
  {
    id: 'ALT-2026-071',
    title: 'COASTAL HIGH TIDE & ROUGH SEAS WARNING: Southern & Western Seaboard',
    severity: 'High',
    severityLevel: 2,
    origin: 'Department of Meteorology',
    timestamp: '5 hours ago',
    validUntil: 'Valid for 36 hours',
    sector: 'Galle, Matara, and Kalutara Coasts',
    district: 'Kalutara',
    description: 'Monsoon surge producing swell waves of 2.5 to 3.5 meters with localized coastal seawater intrusion in coastal lowlands between Panadura and Weligama. Fisherfolk advised not to venture to sea.',
    directives: [
      'Small craft and fishing trawlers must remain anchored in protected harbors.',
      'Coastal residents in low sand spits should prepare for nocturnal tidal surge.'
    ],
    shelterRecommendation: 'Panadura Town Hall Evacuation Facility',
    category: 'Shelter',
    status: 'ACTIVE_AMBER'
  },
  {
    id: 'ALT-2026-068',
    title: 'UTILITY NOTICE: Precautionary Power Grid Shutdown in Submerged Zones',
    severity: 'Advisory',
    severityLevel: 3,
    origin: 'Ceylon Electricity Board (CEB)',
    timestamp: '7 hours ago',
    validUntil: 'Until inspections completed post-recession',
    sector: 'Kolonnawa, Sedawatta, and Biyagama Lowlands',
    district: 'Colombo',
    description: 'Electricity supply temporarily disconnected to 4 sub-transformer grids where floodwaters have reached ground-level electrical distribution boxes. Measure taken to avoid electrocution fatalities.',
    directives: [
      'Treat all fallen cables and power poles as live and dangerous.',
      'Report sparking transformers immediately to 1987 (CEB Hotline) or 117.',
      'Use flashlights instead of open candles near fuel or propane cylinders.'
    ],
    shelterRecommendation: 'Relief camps are equipped with backup diesel generators',
    category: 'Other',
    status: 'ACTIVE_BLUE'
  }
];

export const EmergencyAlertsPage = ({ onBack }) => {
  const [alerts, setAlerts] = useState(VERIFIED_EMERGENCY_ALERTS);
  const [severityFilter, setSeverityFilter] = useState('All'); // All, Critical, High, Advisory
  const [districtFilter, setDistrictFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Voice Broadcast Player Simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Filter computation
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      // Severity filter
      if (severityFilter !== 'All' && a.severity !== severityFilter) return false;

      // District filter
      if (districtFilter !== 'All' && a.district !== districtFilter) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesDesc = a.description.toLowerCase().includes(q);
        const matchesSector = a.sector.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesSector) return false;
      }

      return true;
    });
  }, [alerts, severityFilter, districtFilter, searchQuery]);

  const criticalCount = useMemo(() => alerts.filter(a => a.severity === 'Critical').length, [alerts]);
  const highCount = useMemo(() => alerts.filter(a => a.severity === 'High').length, [alerts]);
  const advisoryCount = useMemo(() => alerts.filter(a => a.severity === 'Advisory').length, [alerts]);

  const handleToggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      if (showAlert) showAlert("Playing Disaster Management Center Emergency Audio Broadcast (Western Province).", "info");
    }
  };

  const handleSubscribeSms = (e) => {
    e.preventDefault();
    if (!smsPhone.trim()) {
      if (showAlert) showAlert("Please enter your mobile phone number.", "error");
      return;
    }
    if (showAlert) showAlert(`Mobile ${smsPhone} successfully subscribed to live DMC Emergency SMS Alerts.`, "success");
    setSmsPhone('');
  };

  const handleShareAlert = (alertItem) => {
    if (navigator.share) {
      navigator.share({
        title: alertItem.title,
        text: `${alertItem.title}\n${alertItem.description}\nIssued by ${alertItem.origin}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${alertItem.title} - ${alertItem.description}`);
      if (showAlert) showAlert("Alert bulletin copied to clipboard. You can paste it into WhatsApp or SMS.", "success");
    }
  };

  return (
    <div className="alerts-page-container">
      {/* 1. Top Navigation & Quick Actions */}
      <div className="alerts-top-nav-bar">
        <button
          type="button"
          className="alerts-back-btn"
          onClick={() => {
            if (onBack) onBack();
            else navigate('/citizen');
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Citizen Portal</span>
        </button>

        <div className="alerts-nav-actions">
          <button
            type="button"
            className="btn-radio-broadcast"
            onClick={handleToggleAudio}
          >
            {isPlayingAudio ? <VolumeX size={16} color="#ef4444" /> : <Volume2 size={16} />}
            <span>{isPlayingAudio ? 'Stop Audio Broadcast' : 'Listen to Live Audio Bulletin'}</span>
          </button>

          <Link to="/citizen/submit" className="btn-evacuate-link" style={{ background: '#dc2626' }}>
            <PlusSquare size={16} />
            <span>Request Emergency Rescue</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Header & Live Telemetry Banner */}
      <div className="alerts-hero-banner">
        <div className="alerts-hero-col">
          <h1>Official Emergency Broadcasts & Weather Warnings</h1>
          <p>
            Real-time meteorological warnings, river flood surge alerts, landslide hazards, and road closures issued by the Disaster Management Center and Ministry of Irrigation.
          </p>
        </div>

        <div className="alerts-stats-cluster">
          <div className="alert-stat-box">
            <span className="alert-stat-val text-red">{criticalCount}</span>
            <span className="alert-stat-label">Critical Red Alerts</span>
          </div>

          <div className="alert-stat-box">
            <span className="alert-stat-val text-amber">{highCount}</span>
            <span className="alert-stat-label">High Warnings</span>
          </div>

          <div className="alert-stat-box">
            <span className="alert-stat-val text-teal">{advisoryCount}</span>
            <span className="alert-stat-label">Advisories</span>
          </div>
        </div>
      </div>

      {/* 3. Audio Voice Broadcast Player Simulation Card */}
      {isPlayingAudio && (
        <div className="voice-broadcast-player-card">
          <div className="voice-left-col">
            <div className="audio-pulse-avatar">
              <Radio size={22} className="animate-pulse" />
            </div>
            <div className="audio-info-text">
              <h4>Live DMC Emergency Broadcast: Kelani River Basin Flood Warning</h4>
              <p>Frequency: 104.5 MHz Emergency Radio Simulcast &bull; Voice synthesized in Sinhala, Tamil, & English</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-play-audio"
            onClick={() => setIsPlayingAudio(false)}
          >
            <span>Mute Broadcast</span>
          </button>
        </div>
      )}

      {/* 4. Search & Filter Controls Strip */}
      <div className="alerts-controls-strip">
        <div className="alerts-controls-top-row">
          <div className="alerts-search-bar">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search warnings by keyword, sector, road (e.g. Kelani, A1, Landslide)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <X size={15} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
            )}
          </div>

          <div className="alert-severity-pills">
            <button
              type="button"
              className={`severity-pill-btn ${severityFilter === 'All' ? 'active' : ''}`}
              onClick={() => setSeverityFilter('All')}
            >
              <span>All Bulletins</span>
              <span className="severity-pill-count">{alerts.length}</span>
            </button>

            <button
              type="button"
              className={`severity-pill-btn ${severityFilter === 'Critical' ? 'active' : ''}`}
              onClick={() => setSeverityFilter('Critical')}
            >
              <AlertTriangle size={13} color="#ef4444" />
              <span>Critical (Level 1)</span>
              <span className="severity-pill-count">{criticalCount}</span>
            </button>

            <button
              type="button"
              className={`severity-pill-btn ${severityFilter === 'High' ? 'active' : ''}`}
              onClick={() => setSeverityFilter('High')}
            >
              <AlertCircle size={13} color="#f59e0b" />
              <span>High Warnings</span>
              <span className="severity-pill-count">{highCount}</span>
            </button>

            <button
              type="button"
              className={`severity-pill-btn ${severityFilter === 'Advisory' ? 'active' : ''}`}
              onClick={() => setSeverityFilter('Advisory')}
            >
              <Info size={13} color="#3b82f6" />
              <span>Advisories</span>
              <span className="severity-pill-count">{advisoryCount}</span>
            </button>
          </div>
        </div>

        {/* District Presets */}
        <div className="alert-districts-row">
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Compass size={13} /> Monitored Sector:
          </span>

          {['All', 'Colombo', 'Gampaha', 'Kalutara'].map((d) => (
            <button
              key={d}
              type="button"
              className={`district-chip-btn ${districtFilter === d ? 'active' : ''}`}
              onClick={() => setDistrictFilter(d)}
            >
              {d === 'All' ? 'All Western Districts' : `${d} District`}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Live Broadcast Feed Cards Stack */}
      <div className="alerts-cards-stack">
        {filteredAlerts.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1.5px dashed #cbd5e1', borderRadius: '14px', padding: '40px 24px', textAlign: 'center' }}>
            <ShieldAlert size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>No warnings matching filter criteria</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Currently there are no active warnings under the selected sector.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'Critical';
            const isHigh = alert.severity === 'High';
            const accentClass = isCritical ? 'red' : isHigh ? 'amber' : 'blue';

            return (
              <div key={alert.id} className="alert-broadcast-card">
                <div className={`card-accent-bar-${accentClass}`}></div>

                {/* Card Header Bar */}
                <div className="alert-card-header-bar">
                  <div className="alert-header-meta">
                    <span className={`severity-pill-badge ${accentClass}`}>
                      {isCritical ? <Flame size={12} /> : isHigh ? <AlertTriangle size={12} /> : <Info size={12} />}
                      <span>{alert.severity} Priority</span>
                    </span>

                    <span className="alert-origin-tag">
                      <ShieldCheck size={13} color="#0e6f76" />
                      <span>{alert.origin}</span>
                    </span>
                  </div>

                  <div className="alert-timestamp-text">
                    <Clock size={12} />
                    <span>Issued {alert.timestamp} &bull; {alert.validUntil}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="alert-card-main-title">
                  {alert.title}
                </h3>

                {/* Description */}
                <p className="alert-card-desc-text">
                  {alert.description}
                </p>

                {/* Directives / Safety Advice Box */}
                {alert.directives && alert.directives.length > 0 && (
                  <div className="alert-directives-box">
                    <div className="directives-head">
                      <AlertTriangle size={14} />
                      <span>OFFICIAL CITIZEN DIRECTIVES & ACTIONS</span>
                    </div>
                    <ul className="directives-list">
                      {alert.directives.map((dir, dIdx) => (
                        <li key={dIdx}>{dir}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Card Footer Actions */}
                <div className="alert-card-footer">
                  <div className="alert-footer-tags">
                    <span className="footer-chip-tag">
                      <MapPin size={11} color="#0e6f76" />
                      <span>{alert.sector}</span>
                    </span>

                    {alert.shelterRecommendation && (
                      <span className="footer-chip-tag" style={{ background: '#f0fdfa', color: '#0f766e', fontWeight: 700 }}>
                        <Building2 size={11} />
                        <span>{alert.shelterRecommendation}</span>
                      </span>
                    )}
                  </div>

                  <div className="alert-footer-actions-group">
                    <button
                      type="button"
                      className="btn-share-alert"
                      onClick={() => handleShareAlert(alert)}
                    >
                      <Share2 size={13} />
                      <span>Share Alert</span>
                    </button>

                    <Link
                      to="/citizen/shelters"
                      className="btn-share-alert"
                      style={{ color: '#0e6f76', borderColor: '#0e6f76' }}
                    >
                      <Building2 size={13} />
                      <span>View Shelters</span>
                    </Link>

                    {isCritical && (
                      <Link
                        to={`/citizen/submit?category=Rescue`}
                        className="btn-evacuate-link"
                      >
                        <PlusSquare size={13} />
                        <span>Request Boat Rescue</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. SMS Emergency Subscription Strip */}
      <div className="sms-subscribe-banner">
        <div className="sms-banner-left">
          <div className="sms-icon-box">
            <Bell size={20} />
          </div>
          <div className="sms-banner-text">
            <h4>Subscribe to Official DMC Early Warning SMS Alerts</h4>
            <p>Receive free instant alerts directly to your mobile phone when red flood warnings or landslide sirens trigger.</p>
          </div>
        </div>

        <form onSubmit={handleSubscribeSms} className="sms-input-group">
          <input
            type="tel"
            placeholder="+94 7X XXX XXXX"
            value={smsPhone}
            onChange={(e) => setSmsPhone(e.target.value)}
            className="sms-phone-input"
          />
          <button type="submit" className="btn-subscribe-sms">
            Subscribe Free
          </button>
        </form>
      </div>
    </div>
  );
};

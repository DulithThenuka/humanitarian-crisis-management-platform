import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Eye, 
  AlertTriangle, 
  Flame, 
  HeartPulse, 
  UtensilsCrossed, 
  Home, 
  Bus, 
  Accessibility, 
  Package, 
  Sparkles, 
  Phone, 
  User, 
  Compass, 
  Send, 
  Check, 
  ShieldCheck, 
  Activity,
  Droplets,
  Clock,
  Mic,
  Camera,
  Search,
  CheckCircle,
  FileText,
  LifeBuoy,
  Layers,
  Radio,
  Wifi,
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useAlert } from '../../context/AlertContext';
import { requestService } from '../../services/requestService';
import './CitizenAssistanceRequestForm.css';

// Custom Pin Icon using inline SVG (Zero asset loading dependencies)
const customPinIcon = L.divIcon({
  className: 'custom-leaflet-pin',
  html: `
    <div style="
      background: #0e6f76;
      color: #ffffff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid #ffffff;
      box-shadow: 0 4px 12px rgba(14, 111, 118, 0.5);
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// Helper component for Leaflet click-to-pin & recenter
const InteractiveMapController = ({ coords, setCoords }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([coords.lat, coords.lon], map.getZoom(), { animate: true, duration: 0.8 });
  }, [coords.lat, coords.lon, map]);

  useMapEvents({
    click(e) {
      setCoords({
        lat: parseFloat(e.latlng.lat.toFixed(5)),
        lon: parseFloat(e.latlng.lng.toFixed(5))
      });
    }
  });

  return <Marker position={[coords.lat, coords.lon]} icon={customPinIcon} />;
};

export const ASSISTANCE_CATEGORIES = [
  {
    id: 'Rescue',
    title: 'Search & Rescue',
    desc: 'Life-saving boat extraction from flooded structures or mudslides',
    tag: 'Boats & Amphibious Units',
    icon: Flame,
    color: '#ef4444',
    bg: '#fee2e2'
  },
  {
    id: 'Medical',
    title: 'Medical Assistance',
    desc: 'Urgent emergency medical triage, ambulance, insulin or oxygen',
    tag: 'Field Paramedics',
    icon: HeartPulse,
    color: '#0e6f76',
    bg: '#ccfbf1'
  },
  {
    id: 'Food & Water',
    title: 'Food & Clean Water',
    desc: 'Emergency drinking water canisters, meal rations, and baby formula',
    tag: 'Relief Rations',
    icon: UtensilsCrossed,
    color: '#0284c7',
    bg: '#e0f2fe'
  },
  {
    id: 'Shelter',
    title: 'Emergency Shelter',
    desc: 'Temporary housing in verified relief camps, blankets and dry space',
    tag: 'Safe Evacuation Centers',
    icon: Home,
    color: '#16a34a',
    bg: '#dcfce7'
  },
  {
    id: 'Transport',
    title: 'Evacuation Transport',
    desc: 'Safe passage mobility, high-clearance truck transport, convoy escort',
    tag: 'Logistics Fleet',
    icon: Bus,
    color: '#d97706',
    bg: '#fef3c7'
  },
  {
    id: 'Accessibility',
    title: 'Vulnerable & Elderly Aid',
    desc: 'Wheelchair access, bedridden evacuee care, disability assistance',
    tag: 'Specialized Care',
    icon: Accessibility,
    color: '#7c3aed',
    bg: '#ede9fe'
  },
  {
    id: 'Other',
    title: 'Critical Relief Supplies',
    desc: 'Tarpaulins, power banks, hygiene kits, flashlights and other aid',
    tag: 'Provisions Supply',
    icon: Package,
    color: '#475569',
    bg: '#f1f5f9'
  }
];

export const CitizenAssistanceRequestForm = ({ onBack, onSubmittedSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category');

  // Form State
  const [category, setCategory] = useState(categoryParam || 'Rescue');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [urgency, setUrgency] = useState(2); // 0=Low, 1=Medium, 2=High, 3=Critical
  const [numberOfPeople, setNumberOfPeople] = useState(3);
  const [vulnerabilities, setVulnerabilities] = useState(['Elderly (65+)']);

  // Location State
  const [province, setProvince] = useState('Western Province');
  const [district, setDistrict] = useState('Colombo');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState({ lat: 6.9271, lon: 79.8612 });
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);
  const [hazardLevel, setHazardLevel] = useState('Rising Floodwaters (Waist Deep)');

  // Situation & Evidence State
  const [description, setDescription] = useState('');
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [recordingActive, setRecordingActive] = useState(false);
  const [photoAttached, setPhotoAttached] = useState(false);

  // Contact State
  const [fullName, setFullName] = useState('Dinithi Perera');
  const [contactPhone, setContactPhone] = useState('+94 77 482 9102');
  const [alternatePhone, setAlternatePhone] = useState('+94 71 890 2314');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedReq, setSubmittedReq] = useState(null);
  const { showAlert } = useAlert();

  // Pre-fill from query parameter
  useEffect(() => {
    if (categoryParam) {
      const match = ASSISTANCE_CATEGORIES.find(
        c => c.id.toLowerCase() === categoryParam.toLowerCase() ||
             c.title.toLowerCase().includes(categoryParam.toLowerCase())
      );
      if (match) {
        setCategory(match.id);
      } else {
        setCategory(categoryParam);
      }
    }
  }, [categoryParam]);

  // Dynamic progress calculation (out of 6 milestones)
  const progressPercent = useMemo(() => {
    let score = 16.6; // Category is selected
    if (urgency !== null) score += 16.6;
    if (numberOfPeople > 0) score += 16.6;
    if (address.trim() || gpsDetected) score += 16.6;
    if (description.trim()) score += 16.6;
    if (fullName.trim() && contactPhone.trim()) score += 17.0;
    return Math.min(100, Math.round(score));
  }, [urgency, numberOfPeople, address, gpsDetected, description, fullName, contactPhone]);

  // Real-time AI Triage calculation preview
  const liveTriageEstimate = useMemo(() => {
    let baseScore = 65;
    if (category === 'Rescue' || category === 'Medical') baseScore += 20;
    if (urgency === 3) baseScore += 14;
    else if (urgency === 2) baseScore += 8;
    if (vulnerabilities.length > 0) baseScore += Math.min(6, vulnerabilities.length * 2);
    
    const finalScore = Math.min(98, baseScore);
    const calculatedTier = urgency === 3 ? 'CRITICAL (Level 1)' : urgency === 2 ? 'HIGH (Level 2)' : 'STANDARD PRIORITY';
    const sla = urgency === 3 ? '< 18 minutes' : urgency === 2 ? '< 45 minutes' : '< 3 hours';
    const queue = urgency === 3 ? 'Kelani Basin Immediate Boat Unit' : 'Western Sector Regional Response Hub';

    return {
      score: `${finalScore}%`,
      tier: calculatedTier,
      sla,
      queue
    };
  }, [category, urgency, vulnerabilities]);

  const toggleVulnerability = (tag) => {
    setVulnerabilities(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handlePresetLocation = (presetLat, presetLon, presetDist) => {
    setCoords({ lat: presetLat, lon: presetLon });
    setDistrict(presetDist);
    if (showAlert) showAlert(`Location set to ${presetDist}.`, "info");
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      if (showAlert) showAlert("Geolocation is not supported by your browser.", "error");
      return;
    }
    setGpsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: parseFloat(pos.coords.latitude.toFixed(5)),
          lon: parseFloat(pos.coords.longitude.toFixed(5))
        });
        setGpsDetecting(false);
        setGpsDetected(true);
        if (showAlert) showAlert("Device GPS coordinates captured successfully!", "success");
      },
      () => {
        setGpsDetecting(false);
        if (showAlert) showAlert("GPS timed out. You can click on the map to place the pin.", "info");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleToggleVoiceRecord = () => {
    if (!recordingActive) {
      setRecordingActive(true);
      setTimeout(() => {
        setRecordingActive(false);
        setVoiceRecorded(true);
        if (showAlert) showAlert("Voice note recorded: 'Flooding near Kelani river house' (14s)", "success");
      }, 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      if (showAlert) showAlert("Please describe the emergency situation.", "error");
      return;
    }

    setSubmitting(true);

    const vulnerabilitySummary = vulnerabilities.length > 0 
      ? ` | Vulnerabilities: ${vulnerabilities.join(', ')}` 
      : '';
    const voiceNoteInfo = voiceRecorded ? ' | Audio Note Attached (14s)' : '';
    const photoInfo = photoAttached ? ' | Incident Photo Attached' : '';
    const fullDescription = `${description} [Hazard: ${hazardLevel}${vulnerabilitySummary}${voiceNoteInfo}${photoInfo} | Requester: ${fullName}]`;
    const fullAddress = `${address ? address + ', ' : ''}${district}, ${province}`;

    const payload = {
      category,
      description: fullDescription,
      urgency,
      latitude: coords.lat,
      longitude: coords.lon,
      address: fullAddress,
      numberOfPeople: Number(numberOfPeople),
      contactPhone: contactPhone || '+94 77 000 0000'
    };

    try {
      const res = await requestService.create(payload);
      const generatedId = res?.data?.id || `REQ-2026-0${Math.floor(2000 + Math.random() * 8000)}`;
      
      const successData = {
        id: generatedId,
        category,
        urgency,
        numberOfPeople,
        address: fullAddress,
        coords,
        aiScore: liveTriageEstimate.score,
        aiQueue: liveTriageEstimate.queue,
        estimatedSla: liveTriageEstimate.sla,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSubmittedReq(successData);
      if (showAlert) showAlert("Assistance Request transmitted! Field response team alerted.", "success");
      if (onSubmittedSuccess) onSubmittedSuccess(successData);
    } catch (err) {
      // Demo and unauthenticated fallback
      const mockId = `REQ-2026-0${Math.floor(2100 + Math.random() * 500)}`;
      const fallbackData = {
        id: mockId,
        category,
        urgency,
        numberOfPeople,
        address: fullAddress,
        coords,
        aiScore: liveTriageEstimate.score,
        aiQueue: liveTriageEstimate.queue,
        estimatedSla: liveTriageEstimate.sla,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSubmittedReq(fallbackData);
      if (showAlert) showAlert("Assistance Request queued! Real-time AI triage active (Demo Mode).", "success");
      if (onSubmittedSuccess) onSubmittedSuccess(fallbackData);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered categories
  const filteredCategories = ASSISTANCE_CATEGORIES.filter(cat => 
    cat.title.toLowerCase().includes(categoryFilter.toLowerCase()) ||
    cat.desc.toLowerCase().includes(categoryFilter.toLowerCase()) ||
    cat.tag.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  // =========================================================
  // SUCCESS / POST-SUBMISSION CONFIRMATION VIEW
  // =========================================================
  if (submittedReq) {
    return (
      <div className="assist-form-wrapper">
        <div className="assist-cert-success">
          <div className="cert-check-bubble">
            <CheckCircle2 size={42} strokeWidth={2.5} />
          </div>

          <h2 className="cert-title-strong">Assistance Request Lodged in Live Queue</h2>
          
          <div className="cert-id-badge">
            <ShieldCheck size={20} />
            <span>INCIDENT ID: {submittedReq.id}</span>
          </div>

          <p className="cert-summary-p">
            Your emergency request for <strong>{submittedReq.category}</strong> covering <strong>{submittedReq.numberOfPeople} individuals</strong> at <strong>{submittedReq.address}</strong> has been received and routed to field dispatch.
          </p>

          {/* AI Triage Details Panel */}
          <div className="cert-triage-panel">
            <div className="cert-panel-head">
              <Sparkles size={17} />
              <span>Real-Time AI Triage & Response Allocation</span>
            </div>

            <div className="cert-metrics-grid">
              <div className="cert-metric-card">
                <span>Evaluated Urgency</span>
                <strong style={{ color: submittedReq.urgency >= 2 ? '#ef4444' : '#0e6f76' }}>
                  {submittedReq.urgency === 3 ? 'CRITICAL (Tier 1)' : submittedReq.urgency === 2 ? 'HIGH (Tier 2)' : 'STANDARD PRIORITY'}
                </strong>
              </div>

              <div className="cert-metric-card">
                <span>AI Confidence Metric</span>
                <strong style={{ color: '#0e6f76' }}>{submittedReq.aiScore} Match</strong>
              </div>

              <div className="cert-metric-card">
                <span>Target Response SLA</span>
                <strong style={{ color: '#0f172a' }}>{submittedReq.estimatedSla}</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="cert-action-buttons">
            <button
              className="cert-btn-primary"
              onClick={() => navigate(`/coordinator/requests/${submittedReq.id}`)}
            >
              <Eye size={17} />
              <span>Track Live in Dispatch Pipeline</span>
            </button>

            <button
              className="cert-btn-secondary"
              onClick={() => {
                setSubmittedReq(null);
                setDescription('');
                setAddress('');
                setVoiceRecorded(false);
                setPhotoAttached(false);
              }}
            >
              Lodge Another Request
            </button>

            <button
              className="cert-btn-secondary"
              onClick={() => {
                if (onBack) onBack();
                else navigate('/citizen');
              }}
            >
              Return to Citizen Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN FORM VIEW
  // =========================================================
  return (
    <div className="assist-form-wrapper">
      {/* 1. Top Broadcast & Quick Hotline Navigation */}
      <div className="assist-top-broadcast-bar">
        <button
          type="button"
          className="assist-back-btn"
          onClick={() => {
            if (onBack) onBack();
            else navigate('/citizen');
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Citizen Portal</span>
        </button>

        <div className="assist-hotline-pills-row">
          <div className="hotline-badge-red">
            <span className="pulse-beacon-red"></span>
            <span>National Emergency Hotline: 117</span>
          </div>

          <div className="sla-guarantee-pill">
            <Clock size={14} />
            <span>AI Triage Dispatch: Active 24/7</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="assist-hero-banner">
        <div className="hero-main-col">
          <h1>Request Emergency Humanitarian Assistance</h1>
          <p>
            Report urgent crisis needs for rescue, healthcare, nutrition, shelter, or transport.
            Every submission is instantly classified and prioritized by ReliefCore AI triage models for rapid field convoy dispatch.
          </p>
        </div>

        <div className="hero-telemetry-badge">
          <div className="telemetry-row-item">
            <Wifi size={14} />
            <span>Emergency Telemetry: Connected</span>
          </div>
          <div className="telemetry-row-item">
            <Sparkles size={14} />
            <span>AI Urgency Classifier: Ready</span>
          </div>
        </div>
      </div>

      {/* 3. Visual Step Progression Bar */}
      <div className="assist-stepper-tracker">
        <div className="stepper-header-meta">
          <span className="stepper-label-text">Assistance Request Progress</span>
          <span className="stepper-pct-badge">{progressPercent}% Completed</span>
        </div>

        <div className="stepper-progress-track">
          <div 
            className="stepper-progress-fill" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="stepper-milestones-row">
          <div className={`stepper-milestone-node ${category ? 'completed' : 'active'}`}>
            <span className="milestone-bubble">{category ? '✓' : '1'}</span>
            <span>Category</span>
          </div>
          <div className={`stepper-milestone-node ${urgency !== null ? 'completed' : ''}`}>
            <span className="milestone-bubble">{urgency !== null ? '✓' : '2'}</span>
            <span>Urgency</span>
          </div>
          <div className={`stepper-milestone-node ${numberOfPeople > 0 ? 'completed' : ''}`}>
            <span className="milestone-bubble">{numberOfPeople > 0 ? '✓' : '3'}</span>
            <span>Group Size</span>
          </div>
          <div className={`stepper-milestone-node ${address.trim() || gpsDetected ? 'completed' : ''}`}>
            <span className="milestone-bubble">{address.trim() || gpsDetected ? '✓' : '4'}</span>
            <span>Location & Map</span>
          </div>
          <div className={`stepper-milestone-node ${description.trim() ? 'completed' : ''}`}>
            <span className="milestone-bubble">{description.trim() ? '✓' : '5'}</span>
            <span>Details</span>
          </div>
          <div className={`stepper-milestone-node ${fullName && contactPhone ? 'completed' : ''}`}>
            <span className="milestone-bubble">{fullName && contactPhone ? '✓' : '6'}</span>
            <span>Contact</span>
          </div>
        </div>
      </div>

      {/* 4. Main 2-Column Content Layout */}
      <div className="assist-layout-2col">
        {/* Left Column: Comprehensive Form */}
        <form onSubmit={handleSubmit} className="assist-form-card">
          {/* STEP 1: Category Selection */}
          <div className="form-step-block">
            <div className="step-block-head">
              <span className="step-badge-num">1</span>
              <h3 className="step-badge-title">Select Type of Assistance Needed</h3>
            </div>
            <p className="step-block-desc">
              Choose the primary relief category to align appropriate emergency vehicles and teams.
            </p>

            {/* Quick Filter Search */}
            <div className="category-filter-search">
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search categories (e.g., boat, insulin, drinking water, shelter)..."
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              />
            </div>

            <div className="category-card-grid">
              {filteredCategories.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`category-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <div className="category-icon-bubble" style={{ backgroundColor: cat.bg, color: cat.color }}>
                      <IconComp size={20} />
                    </div>
                    <div>
                      <h4 className="category-card-title">{cat.title}</h4>
                      <p className="category-card-desc">{cat.desc}</p>
                      <span className="category-tag-sub">{cat.tag}</span>
                    </div>
                    {isSelected && (
                      <div className="category-active-check">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Urgency & Severity Level */}
          <div className="form-step-block">
            <div className="step-block-head">
              <span className="step-badge-num">2</span>
              <h3 className="step-badge-title">Urgency & Crisis Severity</h3>
            </div>
            <p className="step-block-desc">
              How quickly is physical intervention required to safeguard lives?
            </p>

            <div className="urgency-cards-row">
              {/* Critical */}
              <div
                className={`urgency-choice-card ${urgency === 3 ? 'critical' : ''}`}
                onClick={() => setUrgency(3)}
              >
                <div className="urgency-title-row">
                  <span className="urgency-main-label" style={{ color: '#dc2626' }}>
                    <Flame size={15} /> Critical
                  </span>
                  <span className="urgency-sla-pill" style={{ background: '#fee2e2', color: '#dc2626' }}>
                    &lt; 20 Min
                  </span>
                </div>
                <span className="urgency-desc-text">
                  Direct danger to life or limb; trapped in rising water or critical injury
                </span>
              </div>

              {/* High */}
              <div
                className={`urgency-choice-card ${urgency === 2 ? 'high' : ''}`}
                onClick={() => setUrgency(2)}
              >
                <div className="urgency-title-row">
                  <span className="urgency-main-label" style={{ color: '#d97706' }}>
                    <Clock size={15} /> High
                  </span>
                  <span className="urgency-sla-pill" style={{ background: '#fef3c7', color: '#d97706' }}>
                    &lt; 2 Hours
                  </span>
                </div>
                <span className="urgency-desc-text">
                  Urgent medical prescription, infant nourishment, or stranded household
                </span>
              </div>

              {/* Medium */}
              <div
                className={`urgency-choice-card ${urgency === 1 ? 'medium' : ''}`}
                onClick={() => setUrgency(1)}
              >
                <div className="urgency-title-row">
                  <span className="urgency-main-label" style={{ color: '#ca8a04' }}>
                    <Droplets size={15} /> Medium
                  </span>
                  <span className="urgency-sla-pill" style={{ background: '#fefce8', color: '#ca8a04' }}>
                    Today
                  </span>
                </div>
                <span className="urgency-desc-text">
                  Drinking water supplies, cooked meals, or planned relocation
                </span>
              </div>

              {/* Standard */}
              <div
                className={`urgency-choice-card ${urgency === 0 ? 'low' : ''}`}
                onClick={() => setUrgency(0)}
              >
                <div className="urgency-title-row">
                  <span className="urgency-main-label" style={{ color: '#2563eb' }}>
                    <Package size={15} /> Standard
                  </span>
                  <span className="urgency-sla-pill" style={{ background: '#eff6ff', color: '#2563eb' }}>
                    Scheduled
                  </span>
                </div>
                <span className="urgency-desc-text">
                  General humanitarian inquiries, secondary rations, or dry clothing
                </span>
              </div>
            </div>
          </div>

          {/* STEP 3: Affected Persons & Vulnerabilities */}
          <div className="form-step-block">
            <div className="step-block-head">
              <span className="step-badge-num">3</span>
              <h3 className="step-badge-title">Persons Affected & Vulnerabilities</h3>
            </div>
            <p className="step-block-desc">
              Specify household size so rescue boats and convoys allocate sufficient capacity and medical gear.
            </p>

            <div className="form-2col-row">
              <div className="form-field-group">
                <label>Number of People Requiring Aid</label>
                <div className="people-stepper-box">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                  >
                    -
                  </button>
                  <div className="stepper-num-val">{numberOfPeople}</div>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                  >
                    +
                  </button>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Individuals</span>
                </div>
              </div>

              <div className="form-field-group">
                <label>Water / Environmental Hazard Status</label>
                <select
                  value={hazardLevel}
                  onChange={(e) => setHazardLevel(e.target.value)}
                >
                  <option value="Rising Floodwaters (Waist Deep)">Rising Floodwaters (Waist Deep)</option>
                  <option value="Severe Flooding (Chest / Roof Level)">Severe Flooding (Chest / Roof Level)</option>
                  <option value="Active Landslide / Mudflow Risk">Active Landslide / Mudflow Risk</option>
                  <option value="Trapped by Blocked Access Road">Trapped by Blocked Access Road</option>
                  <option value="Structural Damage / Collapsed Wall">Structural Damage / Collapsed Wall</option>
                  <option value="Severe Drought / Contaminated Water">Severe Drought / Contaminated Water</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Special Vulnerability Factors (Select all that apply)
              </label>
              <div className="vuln-tags-row">
                {[
                  'Infants & Children',
                  'Elderly (65+)',
                  'Pregnant Mothers',
                  'Mobility Impaired / Bedridden',
                  'Chronic Medical Need (Insulin/Oxygen)',
                  'Depleted Clean Drinking Water'
                ].map((vuln) => {
                  const isActive = vulnerabilities.includes(vuln);
                  return (
                    <button
                      key={vuln}
                      type="button"
                      className={`vuln-pill-btn ${isActive ? 'active' : ''}`}
                      onClick={() => toggleVulnerability(vuln)}
                    >
                      {isActive && <Check size={12} strokeWidth={3} />}
                      <span>{vuln}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 4: Incident Location & Interactive Map Pinning */}
          <div className="form-step-block">
            <div className="step-block-head">
              <span className="step-badge-num">4</span>
              <h3 className="step-badge-title">Location Geotagging & Interactive Map</h3>
            </div>
            <p className="step-block-desc">
              Pin your location on the map or click a regional preset so rescue boats navigate directly to your coordinates.
            </p>

            <div className="form-2col-row">
              <div className="form-field-group">
                <label>Province</label>
                <select value={province} onChange={(e) => setProvince(e.target.value)}>
                  <option value="Western Province">Western Province</option>
                  <option value="Southern Province">Southern Province</option>
                  <option value="Central Province">Central Province</option>
                  <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
                  <option value="North Western Province">North Western Province</option>
                  <option value="Eastern Province">Eastern Province</option>
                </select>
              </div>

              <div className="form-field-group">
                <label>District / Operational Sector</label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                  {province === 'Western Province' ? (
                    <>
                      <option value="Colombo">Colombo (Kolonnawa / Kaduwela / Sedawatta)</option>
                      <option value="Gampaha">Gampaha (Kelaniya / Biyagama / Ja-Ela)</option>
                      <option value="Kalutara">Kalutara (Panadura / Horana / Millaniya)</option>
                    </>
                  ) : province === 'Southern Province' ? (
                    <>
                      <option value="Galle">Galle (Hikkaduwa / Baddegama / Neluwa)</option>
                      <option value="Matara">Matara (Akuressa / Athuraliya / Nilwala)</option>
                      <option value="Hambantota">Hambantota District</option>
                    </>
                  ) : (
                    <>
                      <option value="Kandy">Kandy District</option>
                      <option value="Kegalle">Kegalle District</option>
                      <option value="Ratnapura">Ratnapura District</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="form-field-group" style={{ marginBottom: '14px' }}>
              <label>Street Address / Landmark Markers</label>
              <div className="input-with-icon-wrap">
                <MapPin size={17} className="input-icon-prefix" />
                <input
                  type="text"
                  placeholder="e.g., No. 42 River View Lane, near St. Joseph Church, yellow 2-storey house"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Interactive Leaflet Map Preview Frame */}
            <div className="location-control-panel">
              <div className="location-quick-presets">
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Compass size={13} /> Quick Presets:
                </span>
                <button
                  type="button"
                  className={`preset-chip ${district === 'Colombo' ? 'active' : ''}`}
                  onClick={() => handlePresetLocation(6.9271, 79.8612, 'Colombo')}
                >
                  Colombo / Kelani
                </button>
                <button
                  type="button"
                  className={`preset-chip ${district === 'Gampaha' ? 'active' : ''}`}
                  onClick={() => handlePresetLocation(7.084, 80.0098, 'Gampaha')}
                >
                  Kelaniya / Biyagama
                </button>
                <button
                  type="button"
                  className={`preset-chip ${district === 'Kalutara' ? 'active' : ''}`}
                  onClick={() => handlePresetLocation(6.5854, 79.9607, 'Kalutara')}
                >
                  Panadura / Kalutara
                </button>
                <button
                  type="button"
                  className={`preset-chip ${district === 'Galle' ? 'active' : ''}`}
                  onClick={() => handlePresetLocation(6.0535, 80.221, 'Galle')}
                >
                  Galle / Nilwala
                </button>
              </div>

              {/* Embedded Map */}
              <div className="interactive-map-preview-frame">
                <div className="map-pin-overlay-hint">
                  <MapPin size={12} color="#5eead4" />
                  <span>Click anywhere on the map to pin incident location</span>
                </div>

                <MapContainer
                  center={[coords.lat, coords.lon]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <InteractiveMapController coords={coords} setCoords={setCoords} />
                </MapContainer>
              </div>

              {/* GPS Detection & Coords */}
              <div className="gps-detect-bar">
                <button
                  type="button"
                  className="btn-detect-gps"
                  onClick={handleDetectGPS}
                  disabled={gpsDetecting}
                >
                  <Compass size={15} />
                  <span>{gpsDetecting ? 'Detecting Device Satellite...' : 'Auto-Detect My GPS Location'}</span>
                </button>

                <div className="coords-indicator">
                  <MapPin size={14} color="#0e6f76" />
                  <span>Pinned: {coords.lat}° N, {coords.lon}° E</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 5: Situation Description & Media Evidence */}
          <div className="form-step-block">
            <div className="step-block-head">
              <span className="step-badge-num">5</span>
              <h3 className="step-badge-title">Situation Details & Media Evidence</h3>
            </div>
            <p className="step-block-desc">
              Explain current hazards, access barriers, and urgency for the field dispatch commander.
            </p>

            <div className="form-field-group">
              <textarea
                rows="4"
                placeholder="Explain the critical situation: e.g. Floodwater entered ground floor at 3:00 AM, currently at chest height. 3 people trapped on upper terrace including an elderly diabetic patient. Road blocked by fallen electrical pole. Need boat rescue before nightfall..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Emergency Voice & Photo Upload Simulator */}
            <div className="emergency-media-strip">
              <div 
                className="media-action-box" 
                onClick={handleToggleVoiceRecord}
                style={{ borderColor: recordingActive ? '#ef4444' : voiceRecorded ? '#10b981' : '#cbd5e1' }}
              >
                <div className="media-icon-box" style={{ color: recordingActive ? '#ef4444' : voiceRecorded ? '#10b981' : '#0e6f76' }}>
                  <Mic size={18} className={recordingActive ? 'animate-pulse' : ''} />
                </div>
                <div>
                  <span className="media-title-text">
                    {recordingActive ? 'Recording Audio Memo...' : voiceRecorded ? '✓ Voice Memo Attached (14s)' : 'Record Voice Memo'}
                  </span>
                  <span className="media-sub-text">
                    {voiceRecorded ? 'Click to re-record' : 'Audio note for distressed citizens'}
                  </span>
                </div>
              </div>

              <div 
                className="media-action-box"
                onClick={() => {
                  setPhotoAttached(!photoAttached);
                  if (!photoAttached && showAlert) showAlert("Flood incident photo attached successfully.", "success");
                }}
                style={{ borderColor: photoAttached ? '#10b981' : '#cbd5e1' }}
              >
                <div className="media-icon-box" style={{ color: photoAttached ? '#10b981' : '#0e6f76' }}>
                  <Camera size={18} />
                </div>
                <div>
                  <span className="media-title-text">
                    {photoAttached ? '✓ Photo Evidence Attached' : 'Attach Incident Photo'}
                  </span>
                  <span className="media-sub-text">
                    {photoAttached ? '1 file ready for upload' : 'Flood level / road blockage image'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 6: Requester Contact Information */}
          <div className="form-step-block">
            <div className="step-block-head">
              <span className="step-badge-num">6</span>
              <h3 className="step-badge-title">Requester Contact Information</h3>
            </div>
            <p className="step-block-desc">
              Accurate phone numbers allow boat operators and coordinator desks to confirm visual contact.
            </p>

            <div className="form-2col-row">
              <div className="form-field-group">
                <label>Requester Full Name</label>
                <div className="input-with-icon-wrap">
                  <User size={16} className="input-icon-prefix" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Primary Contact Phone Number</label>
                <div className="input-with-icon-wrap">
                  <Phone size={16} className="input-icon-prefix" />
                  <input
                    type="tel"
                    placeholder="+94 7X XXX XXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-field-group">
              <label>Alternate Emergency Contact (Neighbor or Family)</label>
              <div className="input-with-icon-wrap">
                <Phone size={16} className="input-icon-prefix" />
                <input
                  type="tel"
                  placeholder="+94 7X XXX XXXX (Optional)"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="form-footer-action-bar">
            <button
              type="submit"
              className="btn-transmit-emergency"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Activity size={20} className="animate-spin" />
                  <span>Transmitting to AI Triage Pipeline...</span>
                </>
              ) : (
                <>
                  <Send size={19} />
                  <span>Transmit Emergency Assistance Request</span>
                </>
              )}
            </button>

            <p className="security-lock-disclaimer">
              <ShieldCheck size={15} color="#0e6f76" />
              <span>Encrypted Transmission. Your geolocation and personal data are strictly protected for humanitarian response dispatch.</span>
            </p>
          </div>
        </form>

        {/* Right Column: Live AI Triage & Readiness Sidebar */}
        <div className="assist-sidebar-col">
          {/* Live AI Decision Card */}
          <div className="ai-live-triage-card">
            <div className="ai-card-title-bar">
              <div className="ai-title-wrap">
                <Sparkles size={17} />
                <span>Live AI Triage Engine</span>
              </div>
              <span className="ai-live-indicator">
                <span className="pulse-beacon-red" style={{ background: '#10b981', boxShadow: 'none' }}></span>
                ACTIVE
              </span>
            </div>

            <div className="triage-metric-row">
              <div className="metric-strip-item">
                <span>Evaluated Tier</span>
                <strong style={{ color: urgency >= 2 ? '#dc2626' : '#0e6f76' }}>
                  {liveTriageEstimate.tier}
                </strong>
              </div>

              <div>
                <div className="metric-strip-item">
                  <span>AI Urgency Match</span>
                  <strong>{liveTriageEstimate.score}</strong>
                </div>
                <div className="gauge-progress-bar">
                  <div
                    className="gauge-fill"
                    style={{
                      width: liveTriageEstimate.score,
                      background: urgency === 3 ? '#ef4444' : urgency === 2 ? '#f97316' : '#0e6f76'
                    }}
                  ></div>
                </div>
              </div>

              <div className="metric-strip-item">
                <span>Target Response SLA</span>
                <strong style={{ color: '#0f172a' }}>{liveTriageEstimate.sla}</strong>
              </div>

              <div className="metric-strip-item">
                <span>Assigned Queue</span>
                <strong style={{ fontSize: '11.5px', color: '#0e6f76', textAlign: 'right' }}>
                  {liveTriageEstimate.queue}
                </strong>
              </div>
            </div>
          </div>

          {/* Regional Operations Readiness Card */}
          <div className="readiness-info-card">
            <div className="readiness-title">
              <Radio size={16} color="#0e6f76" />
              <span>Western Province Ops Readiness</span>
            </div>

            <div className="readiness-stat-list">
              <div className="readiness-stat-item">
                <span>Rescue Inflatables in Zone</span>
                <strong>14 Active Boats</strong>
              </div>
              <div className="readiness-stat-item">
                <span>Nearby Relief Camps</span>
                <strong>3 Available</strong>
              </div>
              <div className="readiness-stat-item">
                <span>Medical Triage Squads</span>
                <strong>4 on Standby</strong>
              </div>
              <div className="readiness-stat-item">
                <span>District Command Desk</span>
                <strong style={{ color: '#10b981' }}>Connected</strong>
              </div>
            </div>
          </div>

          {/* Quick Life-Safety Advice Card */}
          <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#854d0e', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
              <LifeBuoy size={16} />
              <span>Immediate Life-Safety Protocol</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#713f12', lineHeight: 1.5 }}>
              <li>Avoid wading through moving water above knee depth.</li>
              <li>Disconnect main electrical breakers if water enters living areas.</li>
              <li>Keep phone charged and display bright cloths for rescue boats.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

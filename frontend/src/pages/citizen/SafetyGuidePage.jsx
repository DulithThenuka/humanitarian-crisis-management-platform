import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldAlert, 
  ShieldCheck, 
  PhoneCall, 
  Droplets, 
  Flame, 
  Wind, 
  Mountain, 
  AlertTriangle, 
  CheckCircle2, 
  Check, 
  Download, 
  Share2, 
  HeartPulse, 
  Sparkles, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  Search, 
  X, 
  Pill, 
  PackageCheck, 
  Briefcase, 
  FileText, 
  BatteryCharging, 
  Radio, 
  Home, 
  Building2, 
  PlusSquare, 
  Info, 
  Printer, 
  Eye, 
  Clock,
  Compass
} from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import './SafetyGuidePage.css';

// ============================================================================
// NATIONAL EMERGENCY CONTACTS (Sri Lanka Disaster Response)
// ============================================================================
const EMERGENCY_HOTLINES = [
  {
    number: '117',
    label: 'Disaster Management Center',
    subtext: '24/7 National Emergency Call Center & Warning Dispatch',
    category: 'Crisis Command',
    badgeClass: 'badge-red',
    tel: 'tel:117'
  },
  {
    number: '1990',
    label: '1990 Suwa Seriya Ambulance',
    subtext: 'Free Pre-Hospital Emergency Medical Care & Defibrillator Response',
    category: 'Medical Rescue',
    badgeClass: 'badge-emerald',
    tel: 'tel:1990'
  },
  {
    number: '119',
    label: 'Police Emergency Operations',
    subtext: 'Law enforcement, search missions, and security escorts',
    category: 'Police',
    badgeClass: 'badge-blue',
    tel: 'tel:119'
  },
  {
    number: '110',
    label: 'Fire & Water Rescue Command',
    subtext: 'Urban flood rescue boats, diver squads & structural extraction',
    category: 'Rescue',
    badgeClass: 'badge-amber',
    tel: 'tel:110'
  },
  {
    number: '1987',
    label: 'Ceylon Electricity Board (CEB)',
    subtext: 'Report downed live wires, sparking transformers & submerged grids',
    category: 'Utilities',
    badgeClass: 'badge-amber',
    tel: 'tel:1987'
  },
  {
    number: '1938',
    label: 'Women & Child Protection Help',
    subtext: 'Dedicated emergency line for vulnerable mothers and unaccompanied children',
    category: 'Protection',
    badgeClass: 'badge-teal',
    tel: 'tel:1938'
  }
];

// ============================================================================
// EMERGENCY GO-BAG CHECKLIST DATA
// ============================================================================
const DEFAULT_GOBAG_ITEMS = [
  { id: 'gb-1', category: 'Documents & Cash', label: 'National Identity Cards (NIC), Passports & Driving Licenses in sealed waterproof pouch' },
  { id: 'gb-2', category: 'Documents & Cash', label: 'Property deeds, birth certificates & insurance policies (physical copies or encrypted USB)' },
  { id: 'gb-3', category: 'Documents & Cash', label: 'Emergency cash in small denomination notes (Rs. 100, 500, 1000) - ATMs may be offline' },
  { id: 'gb-4', category: 'Water & Nutrition', label: '3 Liters of bottled drinking water per person (sufficient for 72 hours)' },
  { id: 'gb-5', category: 'Water & Nutrition', label: 'Aquatabs / Chlorine water purification tablets (1 strip of 50 tablets)' },
  { id: 'gb-6', category: 'Water & Nutrition', label: 'High-energy ready-to-eat dry rations (Biscuits, Samaposha, Canned fish, Dates)' },
  { id: 'gb-7', category: 'Medical & First Aid', label: '7-day supply of personal chronic prescription medications (Insulin, Blood Pressure, Inhalers)' },
  { id: 'gb-8', category: 'Medical & First Aid', label: 'Basic first-aid kit: Sterile gauze, surgical tape, antiseptic liquid, paracetamol, ORS packets' },
  { id: 'gb-9', category: 'Medical & First Aid', label: 'Doxycycline 200mg capsules (Leptospirosis / Rat fever prophylaxis as advised by MOH)' },
  { id: 'gb-10', category: 'Tools & Electronics', label: 'Heavy-duty waterproof LED flashlight / headlamp with spare rechargeable batteries' },
  { id: 'gb-11', category: 'Tools & Electronics', label: 'Fully charged 20,000mAh Powerbank with multi-device USB charging cables' },
  { id: 'gb-12', category: 'Tools & Electronics', label: 'Loud emergency whistle & high-visibility fluorescent reflective sash or cloth' }
];

// ============================================================================
// DETAILED DISASTER PROTOCOL CHAPTERS
// ============================================================================
const SAFETY_GUIDELINES = [
  {
    id: 'sg-flood',
    category: 'Flood',
    title: 'Severe Flooding & Rapid River Inundation Protocol',
    icon: Droplets,
    badgeText: 'High Probability Hazard',
    badgeType: 'red',
    summary: 'Comprehensive actions for Kelani, Kalu, and Gin river basin floods. How to prepare your home, execute rapid evacuation, and avoid waterborne hazards.',
    sections: [
      {
        heading: 'Phase 1: Pre-Flood Preparation (Warning Issued)',
        tips: [
          'Switch off the main electrical circuit breaker (MCB) and disconnect LP gas cylinder regulators before water enters the premises.',
          'Elevate critical household appliances, furniture, and food supplies to the second floor or sturdy ceiling rafters.',
          'Sterilize and seal ground-level drinking water storage tanks and well lids using heavy plastic sheeting to prevent silt contamination.',
          'Store clean municipal water in clean covered containers before supply pipelines are shut down.',
          'Move vehicles to designated high-elevation municipal staging grounds (e.g., elevated highway interchanges or high school grounds).'
        ]
      },
      {
        heading: 'Phase 2: During Flood Inundation (Stay Alive)',
        tips: [
          'Never attempt to walk, wade, or swim through moving water deeper than 6 inches — moving water has immense force and easily sweeps adults off their feet.',
          'Never drive through floodwaters ("Turn Around, Don’t Drown"). 30 cm (1 ft) of moving water can float a passenger car; 60 cm can carry away an SUV.',
          'Stay clear of submerged street drains, uncovered manholes, and canal banks where invisible suction vortices can trap pedestrians.',
          'Treat all fallen wires and submerged metallic lampposts as live. Electricity can conduct through water up to 15 meters away.',
          'If trapped on an upper floor or roof, display a bright cloth, white bedsheet, or use a flashlight in bursts of 3 to signal military and volunteer rescue boats.'
        ]
      },
      {
        heading: 'Phase 3: Post-Flood Re-entry & Recovery',
        tips: [
          'Do not turn main electricity back on until a certified electrician or CEB official inspects all internal wiring and submerged outlets.',
          'Wear heavy rubber gumboots and thick gloves when cleaning sediment. Watch for displaced venomous snakes (Russell’s vipers and Cobras seek dry shelter indoors).',
          'Discard all food, canned goods with dented seams, and perishable supplies that touched floodwater.',
          'Disinfect floors, countertops, and walls with a solution of 1 cup household bleach per 5 liters of clean water.'
        ]
      }
    ]
  },
  {
    id: 'sg-landslide',
    category: 'Landslide',
    title: 'Landslides, Slope Failure & Rockfall Protocol (NBRO Criteria)',
    icon: Mountain,
    badgeText: 'Critical Topographic Hazard',
    badgeType: 'amber',
    summary: 'Early recognition of hillside saturation signs, NBRO siren triggers, and critical evacuation route strategies for mountainous districts.',
    sections: [
      {
        heading: 'Phase 1: Recognizing NBRO Early Warning Indicators',
        tips: [
          'Emergence of new cracks wider than 10 mm on hillside slopes, retaining walls, paved roads, or floor slabs.',
          'Sudden tilting or leaning of utility poles, fence posts, coconut palms, or large trees.',
          'Sudden appearance of muddy spring water bubbling from previously dry ground, or sudden drying up of natural hillside wells.',
          'Doors and window frames suddenly jamming or sticking due to underlying foundation slope movement.',
          'A faint rumbling or cracking sound from the earth that increases in volume — this indicates active subterranean shear failure.'
        ]
      },
      {
        heading: 'Phase 2: Immediate Evacuation Maneuvers',
        tips: [
          'Do NOT delay to collect heavy household belongings. Grab only your Go-Bag and evacuate immediately on foot.',
          'Evacuate perpendicular to the direction of the landslide path. Run sideways out of the slide trajectory — NEVER attempt to outrun a slide downhill.',
          'Avoid stream gullies, ravines, and valley bottoms where debris flows naturally concentrate with tremendous kinetic velocity.',
          'If escape is physically impossible, curl into a tight protective ball and cover your head with your arms and hands under heavy furniture.'
        ]
      }
    ]
  },
  {
    id: 'sg-cyclone',
    category: 'Cyclone',
    title: 'Severe Cyclonic Storms & High Wind Protocol',
    icon: Wind,
    badgeText: 'Meteorological Hazard',
    badgeType: 'blue',
    summary: 'Structural hardening for gale-force winds, flying debris defense, and safe room protocols during deep depressions and monsoon squalls.',
    sections: [
      {
        heading: 'Phase 1: Pre-Storm Structural Hardening',
        tips: [
          'Inspect and firmly fasten corrugated asbestos or zinc roofing sheets with hurricane strapping or weighted sandbags.',
          'Prune dead, oversized, or hanging tree limbs situated within 5 meters of roofs, power lines, and verandas.',
          'Anchor or move inside all loose outdoor items: garden chairs, trash bins, potted plants, and tin roofing scraps.',
          'Tape large glass windows in a criss-cross pattern with heavy packing tape to minimize splintering if struck by flying debris.'
        ]
      },
      {
        heading: 'Phase 2: During Gale-Force Winds',
        tips: [
          'Gather family in the designated interior "Safe Room" — a windowless central bathroom, reinforced hallway, or basement on the ground floor.',
          'Keep away from exterior glass windows and doors. Cover family members with mattresses or heavy blankets if winds breach the roof.',
          'Beware of the "Eye of the Cyclone". If winds suddenly calm, do NOT go outside — the eyewall will pass and severe opposite winds will resume within minutes.'
        ]
      }
    ]
  },
  {
    id: 'sg-water',
    category: 'Water & Sanitation',
    title: 'Drinking Water Purification & Disease Prevention (WASH)',
    icon: Pill,
    badgeText: 'Public Health Essential',
    badgeType: 'emerald',
    summary: 'Official Ministry of Health procedures for boiling, chlorination, Leptospirosis (Rat fever) prophylaxis, and Dengue mitigation.',
    sections: [
      {
        heading: 'Safe Water Treatment Procedures',
        tips: [
          'Rolling Boil Method: Bring water to a vigorous, continuous rolling boil for a minimum of 5 minutes before allowing it to cool in a covered vessel.',
          'Aquatabs Chlorine Dosing: Dissolve 1 tablet (33mg/67mg) per 20 Liters of clear water. Stir vigorously and allow 30 minutes contact time before drinking.',
          'Turbid / Muddy Water: Filter through clean folded cotton fabric first to remove silt before boiling or adding chlorine purification tablets.',
          'Open Dug Wells: Never drink flood-submerged well water until the well has been pumped dry twice and treated with bleaching powder (50g per 1,000L).'
        ]
      },
      {
        heading: 'Leptospirosis (Rat Fever) Prevention',
        tips: [
          'Leptospira bacteria thrive in floodwaters contaminated by rodent urine. Bacteria enter the body through cuts, abrasions, mouth, and eyes.',
          'Wear protective rubber boots and waterproof bandages over all open skin wounds before entering flood-inundated areas.',
          'Obtain prophylactic Doxycycline (200mg once weekly) from your local Medical Officer of Health (MOH) or public relief camp clinic if engaged in cleanup.',
          'Report immediate symptoms: Sudden high fever, severe calf muscle pain, headache, and bloodshot eyes require urgent medical hospital admission.'
        ]
      }
    ]
  },
  {
    id: 'sg-firstaid',
    category: 'First Aid',
    title: 'Emergency First Aid, Snakebites & Hypothermia Protocol',
    icon: HeartPulse,
    badgeText: 'Life-Saving Actions',
    badgeType: 'amber',
    summary: 'Standardized First Aid protocols for flood victims: snakebite treatment rules, electric shock resuscitation, and pediatric hypothermia.',
    sections: [
      {
        heading: 'Snakebite Emergency Protocol (Crucial in Sri Lanka)',
        tips: [
          'DO: Keep the victim calm, still, and reassured. Muscle movement accelerates the absorption of venom into the lymphatic circulation.',
          'DO: Immobilize the bitten limb using a splint or loose crepe bandage. Keep the bitten area below the level of the heart.',
          'DO: Transport the victim IMMEDIATELY to the nearest government base or teaching hospital equipped with polyvalent anti-venom serum.',
          'DO NOT cut the bite wound with razors or attempt to suck venom by mouth.',
          'DO NOT apply tight arterial tourniquets (causes limb ischemia and permanent gangrene).',
          'DO NOT apply ice, potassium permanganate, or herbal pastes to the fang puncture sites.'
        ]
      },
      {
        heading: 'Hypothermia & Prolonged Water Immersion',
        tips: [
          'Gently remove wet clothing from the victim and wrap them in dry blankets, towels, or emergency reflective foil.',
          'Warm the core of the body first (chest, neck, groin) using warm blankets. Do not rub or massage cold extremities.',
          'If conscious and alert, provide warm sweet liquids (tea or soup). Never administer alcohol or caffeinated energy drinks.'
        ]
      }
    ]
  }
];

// ============================================================================
// CITIZEN FAQ ACCORDION ITEMS
// ============================================================================
const FREQUENT_QUESTIONS = [
  {
    q: 'What should we do if floodwaters reach our second floor and boats cannot access?',
    a: 'Move to the highest reinforced point (concrete roof slab or attic balcony). Signal your position using an emergency whistle (3 blasts spaced by 5 seconds is the universal distress signal), a mirror reflection during daytime, or a flashing torch at night. Do not climb into an enclosed attic without an exterior exit hatch.'
  },
  {
    q: 'How can I check if our village well water is safe to drink post-flood?',
    a: 'Do not drink unboiled well water after a flood. Contact your local Public Health Inspector (PHI) or Grama Niladhari for chlorine dosage kits. Wells must be pumped out until water runs clear, followed by shock chlorination with bleaching powder (Calcium Hypochlorite) for 24 hours before use.'
  },
  {
    q: 'How do I take care of family pets and livestock during mandatory evacuation?',
    a: 'Never leave animals tethered or caged where they cannot escape rising waters. If unable to evacuate pets with you, unchain dogs, open cattle sheds to allow animals to reach higher ground, and leave accessible dry food and elevated clean water.'
  },
  {
    q: 'Are government relief camp shelters free of charge?',
    a: 'Yes. All verified Disaster Management Center and Ministry of Social Services relief camps provide free shelter, cooked meals, clean drinking water, infant formula, and basic medical checkups to displaced citizens.'
  }
];

export const SafetyGuidePage = ({ onBack }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGuideId, setExpandedGuideId] = useState('sg-flood');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Go-Bag Checklist State (Stored in LocalStorage)
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('rc_safety_gobag_checks');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['gb-1', 'gb-4', 'gb-7', 'gb-10']; // pre-check 4 demo items
  });

  useEffect(() => {
    try {
      localStorage.setItem('rc_safety_gobag_checks', JSON.stringify(checkedItems));
    } catch {
      // ignore
    }
  }, [checkedItems]);

  const toggleCheckItem = (id) => {
    setCheckedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const checkAllItems = () => {
    setCheckedItems(DEFAULT_GOBAG_ITEMS.map(i => i.id));
    if (showAlert) showAlert("All Go-Bag items marked as packed!", "success");
  };

  const resetAllItems = () => {
    setCheckedItems([]);
    if (showAlert) showAlert("Go-Bag checklist reset.", "info");
  };

  const goBagProgress = useMemo(() => {
    return Math.round((checkedItems.length / DEFAULT_GOBAG_ITEMS.length) * 100);
  }, [checkedItems]);

  // Filtered Guidelines
  const filteredGuidelines = useMemo(() => {
    return SAFETY_GUIDELINES.filter(guide => {
      // Category filter
      if (activeCategory !== 'All' && guide.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = guide.title.toLowerCase().includes(q);
        const inSummary = guide.summary.toLowerCase().includes(q);
        const inTips = guide.sections.some(s => 
          s.heading.toLowerCase().includes(q) || 
          s.tips.some(t => t.toLowerCase().includes(q))
        );
        if (!inTitle && !inSummary && !inTips) return false;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareGuide = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ReliefCore Citizen Life-Safety Guide',
        text: 'Official disaster survival protocols, flood guidelines, and emergency hotlines.',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      if (showAlert) showAlert("Safety guide link copied to clipboard!", "success");
    }
  };

  return (
    <div className="safety-page-container">
      {/* =========================================================
         1. Top Navigation Bar
         ========================================================= */}
      <div className="safety-top-nav-bar">
        <button
          type="button"
          className="safety-back-btn"
          onClick={() => {
            if (onBack) onBack();
            else navigate('/citizen');
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Citizen Portal</span>
        </button>

        <div className="safety-nav-actions">
          <button
            type="button"
            className="safety-action-btn"
            onClick={handlePrint}
            title="Print or save offline copy"
          >
            <Printer size={15} />
            <span>Print / PDF</span>
          </button>

          <button
            type="button"
            className="safety-action-btn"
            onClick={handleShareGuide}
            title="Share this guide with family"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>

          <Link to="/citizen/shelters" className="safety-link-pill pill-teal">
            <Building2 size={15} />
            <span>Find Shelter</span>
          </Link>

          <Link to="/citizen/submit?category=Rescue" className="safety-link-pill pill-red">
            <PlusSquare size={15} />
            <span>Emergency Rescue</span>
          </Link>
        </div>
      </div>

      {/* =========================================================
         2. Hero Banner & Key Metrics
         ========================================================= */}
      <div className="safety-hero-banner">
        <div className="safety-hero-content">
          <div className="safety-hero-badge">
            <ShieldCheck size={14} color="#0e6f76" />
            <span>DMC & NBRO Official Standard Operating Procedures</span>
          </div>
          <h1 className="safety-hero-title">
            Disaster Preparedness & Life-Safety Protocols
          </h1>
          <p className="safety-hero-desc">
            Official step-by-step life preservation procedures, rapid evacuation strategies, water purification standards, and emergency survival kits validated for crisis operations.
          </p>
        </div>

        <div className="safety-metrics-grid">
          <div className="safety-metric-card">
            <div className="metric-icon-box bg-red-soft text-red">
              <ShieldAlert size={20} />
            </div>
            <div>
              <span className="metric-val">5 Hazards</span>
              <span className="metric-lbl">Flood, Slide, Wind, WASH, First Aid</span>
            </div>
          </div>

          <div className="safety-metric-card">
            <div className="metric-icon-box bg-emerald-soft text-emerald">
              <PhoneCall size={20} />
            </div>
            <div>
              <span className="metric-val">6 Hotlines</span>
              <span className="metric-lbl">117, 1990, 119, 110, 1987, 1938</span>
            </div>
          </div>

          <div className="safety-metric-card">
            <div className="metric-icon-box bg-teal-soft text-teal">
              <PackageCheck size={20} />
            </div>
            <div>
              <span className="metric-val">{goBagProgress}% Ready</span>
              <span className="metric-lbl">Household Go-Bag Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
         3. National Emergency Hotline Quick-Dial Grid
         ========================================================= */}
      <section className="safety-section hotline-section">
        <div className="section-title-strip">
          <div className="title-left">
            <PhoneCall size={18} color="#0e6f76" />
            <h2>National 24/7 Emergency Dispatch Hotlines</h2>
          </div>
          <span className="free-call-tag">Toll-Free &bull; Operates Without Mobile Credit</span>
        </div>

        <div className="hotlines-grid">
          {EMERGENCY_HOTLINES.map((hl) => (
            <a
              key={hl.number}
              href={hl.tel}
              className="hotline-card"
              title={`Call ${hl.label} directly`}
            >
              <div className="hotline-card-top">
                <span className={`hotline-num-pill ${hl.badgeClass}`}>
                  {hl.number}
                </span>
                <span className="hotline-cat-tag">{hl.category}</span>
              </div>
              <h4 className="hotline-title">{hl.label}</h4>
              <p className="hotline-desc">{hl.subtext}</p>
              <div className="hotline-card-cta">
                <PhoneCall size={13} />
                <span>Tap to Call {hl.number}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* =========================================================
         4. Interactive Household Go-Bag Checklist
         ========================================================= */}
      <section className="safety-section gobag-section">
        <div className="gobag-header-box">
          <div className="gobag-title-col">
            <div className="gobag-icon-badge">
              <Briefcase size={22} color="#0e6f76" />
            </div>
            <div>
              <h2 className="gobag-heading">72-Hour Evacuation Go-Bag Checklist</h2>
              <p className="gobag-subheading">
                Pack these items into a single waterproof backpack placed near your front exit. Keep it ready for rapid 5-minute evacuation.
              </p>
            </div>
          </div>

          <div className="gobag-progress-box">
            <div className="progress-labels">
              <span className="progress-status-text">
                {checkedItems.length} of {DEFAULT_GOBAG_ITEMS.length} Packed
              </span>
              <span className="progress-percent-text">{goBagProgress}%</span>
            </div>
            <div className="progress-track">
              <div 
                className={`progress-fill ${goBagProgress === 100 ? 'complete' : ''}`}
                style={{ width: `${goBagProgress}%` }}
              ></div>
            </div>
            <div className="gobag-btn-row">
              <button type="button" className="btn-small-checklist" onClick={checkAllItems}>
                <Check size={12} /> Pack All
              </button>
              <button type="button" className="btn-small-checklist" onClick={resetAllItems}>
                <X size={12} /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="gobag-items-grid">
          {DEFAULT_GOBAG_ITEMS.map((item) => {
            const isChecked = checkedItems.includes(item.id);
            return (
              <div
                key={item.id}
                className={`gobag-item-card ${isChecked ? 'checked' : ''}`}
                onClick={() => toggleCheckItem(item.id)}
              >
                <div className={`gobag-checkbox ${isChecked ? 'active' : ''}`}>
                  {isChecked && <Check size={14} color="#ffffff" strokeWidth={3} />}
                </div>
                <div className="gobag-item-text">
                  <span className="gobag-item-category">{item.category}</span>
                  <p className="gobag-item-label">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
         5. Hazard Filter Tabs & Search Bar
         ========================================================= */}
      <div className="safety-controls-strip">
        <div className="safety-search-box">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search safety tips (e.g., snakebite, boiled water, circuit breaker, NBRO, car)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X size={15} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
          )}
        </div>

        <div className="hazard-filter-pills">
          {[
            { id: 'All', label: 'All Hazards' },
            { id: 'Flood', label: 'Flood Safety' },
            { id: 'Landslide', label: 'Landslide Hazard' },
            { id: 'Cyclone', label: 'Cyclone & Wind' },
            { id: 'Water & Sanitation', label: 'Water & Disease' },
            { id: 'First Aid', label: 'First Aid & Bites' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`hazard-tab-btn ${activeCategory === tab.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================
         6. Disaster Protocols Stack (Expandable Accordion Cards)
         ========================================================= */}
      <div className="guidelines-stack">
        {filteredGuidelines.length === 0 ? (
          <div className="no-guidelines-box">
            <BookOpen size={36} color="#94a3b8" />
            <h3>No safety protocols match your search query</h3>
            <p>Try searching for terms like "water", "snake", "electricity", or select "All Hazards".</p>
          </div>
        ) : (
          filteredGuidelines.map(guide => {
            const IconComp = guide.icon;
            const isExpanded = expandedGuideId === guide.id;

            return (
              <div 
                key={guide.id} 
                className={`guideline-card ${isExpanded ? 'expanded' : ''}`}
              >
                {/* Accordion Header */}
                <div 
                  className="guideline-card-header"
                  onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                >
                  <div className="header-left">
                    <div className={`guide-icon-box badge-${guide.badgeType}`}>
                      <IconComp size={22} />
                    </div>
                    <div>
                      <div className="guide-meta-row">
                        <span className={`guide-category-tag tag-${guide.badgeType}`}>
                          {guide.badgeText}
                        </span>
                        <span className="guide-domain-text">{guide.category} Protocol</span>
                      </div>
                      <h3 className="guide-card-title">{guide.title}</h3>
                      <p className="guide-card-summary">{guide.summary}</p>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="guide-expand-btn" 
                    aria-label={isExpanded ? "Collapse section" : "Expand section"}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="guideline-card-body">
                    <div className="guideline-sections-grid">
                      {guide.sections.map((sec, sIdx) => (
                        <div key={sIdx} className="guide-section-block">
                          <h4 className="guide-section-heading">
                            <span className="heading-dot"></span>
                            {sec.heading}
                          </h4>
                          <ul className="guide-tips-list">
                            {sec.tips.map((tip, tIdx) => (
                              <li key={tIdx} className="guide-tip-item">
                                <span className="tip-bullet-icon">
                                  <CheckCircle2 size={14} color="#0e6f76" />
                                </span>
                                <span className="tip-text">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="guide-footer-actions">
                      <span className="official-stamp-text">
                        <ShieldCheck size={14} color="#0e6f76" />
                        Validated against National Disaster Management Act No. 13 of 2005
                      </span>
                      <div className="guide-sub-links">
                        <Link to="/citizen/shelters" className="sub-link-shelter">
                          Find Nearest Safe Shelter &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* =========================================================
         7. Frequently Asked Citizen Safety Questions (FAQ)
         ========================================================= */}
      <section className="safety-section faq-section">
        <div className="section-title-strip">
          <div className="title-left">
            <BookOpen size={18} color="#0e6f76" />
            <h2>Frequently Asked Crisis Safety Questions</h2>
          </div>
          <span className="free-call-tag">DMC Citizen Advisory</span>
        </div>

        <div className="faq-items-list">
          {FREQUENT_QUESTIONS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
              >
                <div className="faq-question-row">
                  <span className="faq-question-text">{item.q}</span>
                  <span className="faq-icon-arrow">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
                {isOpen && (
                  <div className="faq-answer-row">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
         8. Emergency Assistance Banner
         ========================================================= */}
      <div className="safety-cta-banner">
        <div className="cta-left-col">
          <div className="cta-icon-circle">
            <ShieldAlert size={28} color="#ffffff" />
          </div>
          <div>
            <h3>In Immediate Physical Danger?</h3>
            <p>If your home is flooding rapidly or a slope crack has opened, submit an urgent rescue request or locate an emergency shelter immediately.</p>
          </div>
        </div>

        <div className="cta-actions-cluster">
          <Link to="/citizen/submit?category=Rescue" className="btn-cta-rescue">
            <PlusSquare size={16} />
            <span>Request Immediate Rescue</span>
          </Link>
          <Link to="/citizen/shelters" className="btn-cta-shelter">
            <Building2 size={16} />
            <span>View Safe Shelters</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  UtensilsCrossed,
  HeartPulse,
  Building2,
  Bus,
  Droplets,
  Accessibility,
  ArrowLeft,
  ArrowRight,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  Flame,
  LifeBuoy,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';

export const EmergencyServicesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || searchParams.get('filter') || 'all';
  const [selectedFilter, setSelectedFilter] = useState(initialCategory);

  useEffect(() => {
    const param = searchParams.get('category') || searchParams.get('filter');
    if (param && ['all', 'food', 'medical', 'shelter', 'rescue', 'water', 'access'].includes(param)) {
      setSelectedFilter(param);
    }
  }, [searchParams]);

  const handleSelectFilter = (filterKey) => {
    setSelectedFilter(filterKey);
    if (filterKey === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: filterKey });
    }
  };

  const services = [
    {
      id: 'food',
      categoryParam: 'Food & Water',
      title: 'Emergency Food & Family Rations',
      tag: 'Food Security',
      color: '#38bdf8',
      icon: UtensilsCrossed,
      tagline: 'Pre-packed 7-day nutritional dry hampers and hot meal distribution for displaced families.',
      stockStatus: '3,860 Hampers Available',
      depotLocation: 'Kelani, Gampaha & Kalutara Zonal Depots',
      responseSla: 'Within 4 Hours',
      features: [
        'Family dry rations (Rice 10kg, Dhal, Flour, Canned Fish, Sugar, Tea)',
        'Infant nutrition packs & baby formula canisters',
        'Ready-to-eat high-energy biscuits for stranded flood victims',
        'Central community kitchen meal coordination (3 meals/day)'
      ],
      primaryActionLabel: 'Request Food Assistance',
      primaryActionLink: '/citizen/submit?category=Food%20%26%20Water'
    },
    {
      id: 'medical',
      categoryParam: 'Medical',
      title: 'Critical Medical & First Aid Support',
      tag: 'Healthcare Emergency',
      color: '#34d399',
      icon: HeartPulse,
      tagline: 'Urgent paramedic response, chronic prescription refills, insulin delivery, and mobile clinic care.',
      stockStatus: '1,520 First Aid Kits Ready',
      depotLocation: 'Colombo General & Kalutara Base Hospitals',
      responseSla: 'Within 45 Minutes (Critical)',
      features: [
        'Emergency swiftwater paramedic boat triage & acute trauma care',
        'Essential chronic prescription delivery (Insulin, Cardiac, Asthma)',
        'Portable oxygen concentrators and surgical dressing supplies',
        'Sri Lanka Red Cross mobile medical field post deployments'
      ],
      primaryActionLabel: 'Request Urgent Medical Aid',
      primaryActionLink: '/citizen/submit?category=Medical'
    },
    {
      id: 'shelter',
      categoryParam: 'Shelter',
      title: 'Verified Open High-Ground Shelters',
      tag: 'Safe Evacuation',
      color: '#fbbf24',
      icon: Building2,
      tagline: 'Safe, elevated community centers equipped with bedding, clean sanitation, and medical aid posts.',
      stockStatus: '28 Centers Operational (1,622 Beds Free)',
      depotLocation: 'Across Colombo, Gampaha & Kalutara',
      responseSla: 'Immediate Intake',
      features: [
        'Dedicated family quarters with clean mattress bedding and blankets',
        '24/7 on-site shelter management & security coordination',
        'Clean separated sanitation facilities with safe drinking water',
        'Wheelchair-accessible ground-floor zones for elderly citizens'
      ],
      primaryActionLabel: 'Browse Verified Open Shelters',
      primaryActionLink: '/citizen/shelters'
    },
    {
      id: 'rescue',
      categoryParam: 'Rescue',
      title: 'Search & Swiftwater Rescue Extraction',
      tag: 'Life-Threatening SOS',
      color: '#f87171',
      icon: Flame,
      tagline: 'Amphibious inflatable rescue boats and armed forces extraction from submerged residential clusters.',
      stockStatus: '14 Inflatable Dinghies Active',
      depotLocation: 'Sri Lanka Navy SBS & Army 58 Division Command',
      responseSla: 'Immediate Priority Dispatch',
      features: [
        'Navy Special Boat Squadron (SBS) inflatable motorized dinghies',
        'High-clearance amphibious trucks for inundated access lanes',
        'Air Force Bell 412 rooftop hoist extraction on standby',
        'GPS coordinate tracking via satellite distress telemetry'
      ],
      primaryActionLabel: 'Request Urgent Boat Rescue (SOS)',
      primaryActionLink: '/citizen/submit?category=Rescue'
    },
    {
      id: 'water',
      categoryParam: 'Food & Water',
      title: 'Potable Drinking Water & Hydration Fleet',
      tag: 'Water Sanitation',
      color: '#60a5fa',
      icon: Droplets,
      tagline: 'Mobile 5,000L clean water bowsers, bottled mineral water deliveries, and chlorine purification packs.',
      stockStatus: '12 Water Bowsers on Mission',
      depotLocation: 'Water Supply Board Rapid Fleet',
      responseSla: 'Within 2 Hours',
      features: [
        '5,000-liter drinking water bowser refills for community tanks',
        'Sealed 5L and 10L bottled water canisters for cut-off families',
        'Water purification tablets (Aquatabs) for contaminated wells',
        'Precautionary water testing & public health boil notices'
      ],
      primaryActionLabel: 'Request Clean Water Supply',
      primaryActionLink: '/citizen/submit?category=Food%20%26%20Water'
    },
    {
      id: 'access',
      categoryParam: 'Accessibility',
      title: 'Vulnerable & Special Priority Care',
      tag: 'Priority Demographic',
      color: '#c084fc',
      icon: Accessibility,
      tagline: 'Expedited high-priority relief dispatch tailored for infants, elderly (65+), expectant mothers, and disabled citizens.',
      stockStatus: '+25% Priority AI Weighting Active',
      depotLocation: 'Dedicated Special Needs Response Wings',
      responseSla: 'Accelerated Queue (< 30 Min)',
      features: [
        'Wheelchair-accessible transport and evacuation stretcher units',
        'Specialized infant diapers, baby foods & pediatric rehydration',
        'Bedridden resident assisted evacuation with medical escorts',
        'Continuous welfare check-ins by verified community responders'
      ],
      primaryActionLabel: 'Request Special Care Assistance',
      primaryActionLink: '/citizen/submit?category=Accessibility'
    }
  ];

  const filteredServices = selectedFilter === 'all'
    ? services
    : services.filter(s => s.id === selectedFilter);

  return (
    <div className="min-h-screen w-full bg-[#080A19] text-white font-['Poppins',-apple-system,BlinkMacSystemFont,sans-serif] flex flex-col">
      {/* Top Header */}
      <header className="w-full bg-[#080A19]/90 border-b border-white/[0.08] backdrop-blur-[16px] sticky top-0 z-50 py-3.5 px-5 sm:px-8 md:px-12">
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/70 hover:text-white text-[13px] font-medium bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1.5 rounded-lg border border-white/10 transition cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Back to Home</span>
            </button>

            <div className="h-5 w-px bg-white/15 hidden sm:block"></div>

            <Link to="/" className="flex items-center gap-2 text-decoration-none">
              <img
                src={reliefcoreLogoWhite}
                alt="RELIEFCORE"
                className="h-[26px] w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:117"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[12.5px] font-semibold text-decoration-none transition cursor-pointer"
            >
              <PhoneCall size={13} />
              <span>DMC 117</span>
            </a>

            <button
              onClick={() => navigate('/citizen/track')}
              className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white text-[12.5px] font-semibold border border-white/15 transition cursor-pointer"
            >
              Track Request Status
            </button>
          </div>
        </div>
      </header>

      {/* Hero Intro */}
      <section className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-12 pt-12 pb-6">
        <div className="max-w-[780px]">
          <span className="text-emerald-400 text-[12px] tracking-[0.2em] font-[500] uppercase mb-2 block">
            HUMANITARIAN RELIEF SERVICES DIRECTORY
          </span>
          <h1 className="text-white text-[32px] sm:text-[46px] font-normal leading-[1.05] tracking-[-0.02em]">
            Immediate Relief Assistance Services
          </h1>
          <p className="text-white/70 text-[16px] sm:text-[18px] font-[450] mt-3 leading-relaxed">
            Select your critical emergency need below to view live resource availability, deployed convoys, and initiate direct, AI-prioritized field dispatch across Western Province.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap mt-8 pt-6 border-t border-white/[0.08]">
          <span className="text-[12px] font-semibold text-white/60 mr-2">Filter Services:</span>
          <button
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition border cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 border-white font-bold'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/10'
            }`}
            onClick={() => handleSelectFilter('all')}
          >
            All Services (6)
          </button>
          <button
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition border cursor-pointer ${
              selectedFilter === 'food'
                ? 'bg-sky-400 text-slate-900 border-sky-400 font-bold'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/10'
            }`}
            onClick={() => handleSelectFilter('food')}
          >
            Food & Rations
          </button>
          <button
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition border cursor-pointer ${
              selectedFilter === 'medical'
                ? 'bg-emerald-400 text-slate-900 border-emerald-400 font-bold'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/10'
            }`}
            onClick={() => handleSelectFilter('medical')}
          >
            Medical Care
          </button>
          <button
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition border cursor-pointer ${
              selectedFilter === 'shelter'
                ? 'bg-amber-400 text-slate-900 border-amber-400 font-bold'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/10'
            }`}
            onClick={() => handleSelectFilter('shelter')}
          >
            Open Shelters
          </button>
          <button
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition border cursor-pointer ${
              selectedFilter === 'rescue'
                ? 'bg-red-400 text-slate-900 border-red-400 font-bold'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/10'
            }`}
            onClick={() => handleSelectFilter('rescue')}
          >
            Boat Rescue (SOS)
          </button>
          <button
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition border cursor-pointer ${
              selectedFilter === 'water'
                ? 'bg-blue-400 text-slate-900 border-blue-400 font-bold'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/10'
            }`}
            onClick={() => handleSelectFilter('water')}
          >
            Potable Water
          </button>
          <button
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition border cursor-pointer ${
              selectedFilter === 'access'
                ? 'bg-purple-400 text-slate-900 border-purple-400 font-bold'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/10'
            }`}
            onClick={() => handleSelectFilter('access')}
          >
            Special Priority Care
          </button>
        </div>
      </section>

      {/* Services Grid */}
      <main className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-12 py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const IconComp = service.icon;
            return (
              <div
                key={service.id}
                className="rounded-3xl bg-slate-900/60 backdrop-blur-[20px] border border-white/[0.1] hover:border-white/25 p-7 flex flex-col justify-between transition-all duration-300 shadow-xl group hover:shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${service.color}15`,
                        border: `1px solid ${service.color}35`,
                        color: service.color
                      }}
                    >
                      <IconComp size={24} />
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase font-mono"
                      style={{
                        backgroundColor: `${service.color}15`,
                        color: service.color,
                        border: `1px solid ${service.color}30`
                      }}
                    >
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-white text-[21px] font-bold leading-snug group-hover:text-emerald-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/70 text-[13.5px] font-[450] mt-2 leading-relaxed">
                    {service.tagline}
                  </p>

                  {/* Stock & Operational Status Pill */}
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] my-4 space-y-1.5 text-[12px]">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Live Stock Status:</span>
                      <span className="font-semibold text-emerald-400">{service.stockStatus}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Response SLA:</span>
                      <span className="font-semibold text-amber-300">{service.responseSla}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-2 border-t border-white/[0.06] text-[12.5px] text-white/80">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="mt-6 pt-5 border-t border-white/[0.08]">
                  <button
                    onClick={() => navigate(service.primaryActionLink)}
                    className="w-full py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-[13.5px] font-bold shadow-lg transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
                  >
                    <span>{service.primaryActionLabel}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Emergency Banner */}
      <footer className="w-full bg-[#080A19] border-t border-white/[0.08] py-8 text-center text-white/60 text-[13px]">
        <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8">
          <p className="m-0">
            Humanitarian aid is delivered strictly on humanitarian need, free of charge. For life-threatening distress, call <strong>117 (DMC)</strong> or <strong>1990 (Ambulance)</strong>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EmergencyServicesPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PhoneCall,
  ShieldAlert,
  HeartPulse,
  Flame,
  LifeBuoy,
  ArrowLeft,
  ArrowRight,
  Download,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Info,
  Droplets,
  Zap,
  Radio
} from 'lucide-react';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';

export const EmergencyDirectoryPage = () => {
  const navigate = useNavigate();
  const [downloadToast, setDownloadToast] = useState(null);

  const handleDownloadSurvivalCard = () => {
    setDownloadToast('Downloading National Flood Survival & Emergency Contacts Card (PDF)...');
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const nationalLines = [
    {
      name: 'Disaster Management Centre (DMC)',
      number: '117',
      tel: '117',
      desc: 'National 24/7 toll-free emergency intake, flood warning updates, and relief coordination.',
      badge: 'National Command',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/25',
      icon: ShieldAlert
    },
    {
      name: 'Suwa Seriya Pre-Hospital Care',
      number: '1990',
      tel: '1990',
      desc: 'Free 24/7 emergency ambulance dispatch and acute paramedic field trauma care.',
      badge: 'Medical Emergency',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/25',
      icon: HeartPulse
    },
    {
      name: 'Police Emergency Response Unit',
      number: '119',
      tel: '119',
      desc: 'Emergency law enforcement, public safety cordons, and rapid ground rescue teams.',
      badge: 'Security & Order',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/25',
      icon: ShieldAlert
    },
    {
      name: 'Sri Lanka Navy Special Boat Squadron',
      number: '011-2445368',
      tel: '0112445368',
      desc: 'Direct dispatch for swiftwater rescue dinghies and stranded citizen extraction from deep water.',
      badge: 'Water Rescue (SBS)',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/25',
      icon: Flame
    },
    {
      name: 'Sri Lanka Air Force Search & Rescue',
      number: '011-2343970',
      tel: '0112343970',
      desc: 'Helicopter winch extraction and airborne distress reconnaissance across flooded valleys.',
      badge: 'Airborne Search',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/25',
      icon: Radio
    },
    {
      name: 'Sri Lanka Red Cross Society Disaster Unit',
      number: '011-2691095',
      tel: '0112691095',
      desc: 'First aid posts, family reunifications, and community relief kitchen coordination.',
      badge: 'Humanitarian Red Cross',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/25',
      icon: LifeBuoy
    }
  ];

  const districtUnits = [
    {
      district: 'Colombo District Disaster Management Secretariat',
      officer: 'Major K. Wickremasinghe (Zonal Coordinator)',
      phone: '011-2303070',
      location: 'District Secretariat, Colombo 07',
      hotline: '077-3957890'
    },
    {
      district: 'Gampaha District Disaster Management Office',
      officer: 'S. Bandara (District Disaster Officer)',
      phone: '033-2222235',
      location: 'Kachcheri Complex, Gampaha',
      hotline: '071-8842100'
    },
    {
      district: 'Kalutara District Disaster Coordination Hub',
      officer: 'Capt. R. De Silva (Naval Operations Liaison)',
      phone: '034-2222271',
      location: 'District Secretariat, Kalutara North',
      hotline: '076-5541092'
    }
  ];

  const safetyProtocols = [
    {
      title: 'Rising Floodwaters & Sudden Inundation',
      icon: Droplets,
      color: 'text-sky-400',
      points: [
        'Disconnect the main domestic electrical trip breaker before water contacts power outlets.',
        'Move family members, medications, and valuables to the highest floor or elevated structural beams.',
        'Never attempt to walk, wade, or drive through flowing water over knee-deep (0.5m of water can sweep a vehicle).',
        'Signal rescue boats using a flashlight, whistle, or brightly colored cloth from an open upper window.'
      ]
    },
    {
      title: 'Waterborne Sanitation & Contamination Defense',
      icon: Zap,
      color: 'text-amber-400',
      points: [
        'Assume all shallow well water and tap water in flood zones is contaminated with sewage silt.',
        'Boil drinking and cooking water vigorously for a minimum of 3 full minutes before consumption.',
        'Dissolve Aquatabs (Water Purification Tablets) in 20L clear water and wait 30 minutes before drinking.',
        'Keep infants and open wounds strictly out of standing floodwaters to prevent leptospirosis (rat fever).'
      ]
    },
    {
      title: 'Landslide & Slope Instability Warning Signs',
      icon: AlertTriangle,
      color: 'text-rose-400',
      points: [
        'Inspect surrounding hillside terrain for sudden ground cracks, sinking patios, or tilting trees.',
        'Listen for unusual underground roaring sounds, falling boulders, or sudden muddy spring water bursts.',
        'Evacuate immediately without delay if rainfall exceeds 150mm in 24 hours in declared NBRO red zones.',
        'Proceed horizontally away from the path of the slide toward designated high-ground ridges.'
      ]
    }
  ];

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
                alt="HumanAid"
                className="h-[26px] w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadSurvivalCard}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white text-[12.5px] font-semibold border border-white/15 transition cursor-pointer flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Download Survival Guide (PDF)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Headline */}
      <section className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-12 pt-12 pb-6">
        <div className="max-w-[800px]">
          <span className="text-rose-400 text-[12px] tracking-[0.2em] font-[500] uppercase mb-2 block">
            24/7 TOLL-FREE NATIONAL EMERGENCY DIRECTORY
          </span>
          <h1 className="text-white text-[32px] sm:text-[46px] font-normal leading-[1.05] tracking-[-0.02em]">
            Immediate Help & Emergency Direct Lines
          </h1>
          <p className="text-white/70 text-[16px] sm:text-[18px] font-[450] mt-3 leading-relaxed">
            Verified direct-dial numbers for Sri Lanka disaster coordinators, swiftwater naval rescue teams, ambulance trauma centers, and district emergency command centers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-12 py-6 flex-1 space-y-12">
        {/* National Direct Lines Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[22px] sm:text-[26px] font-bold text-white m-0">National Toll-Free Emergency Services</h2>
              <p className="text-white/60 text-[13px] mt-1 m-0">Free 24/7 priority emergency dispatch across all Sri Lanka telecom networks</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nationalLines.map((line, idx) => {
              const IconComp = line.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-slate-900/60 backdrop-blur-[20px] border border-white/[0.1] hover:border-white/25 p-7 flex flex-col justify-between transition-all duration-300 shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${line.bg} ${line.color}`}>
                        <IconComp size={24} />
                      </div>
                      <span className="text-[11px] font-semibold text-white/50 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 uppercase tracking-wider font-mono">
                        {line.badge}
                      </span>
                    </div>

                    <a
                      href={`tel:${line.tel}`}
                      className={`text-[36px] sm:text-[40px] font-mono font-bold leading-none ${line.color} hover:underline transition text-decoration-none block mb-2`}
                    >
                      {line.number}
                    </a>
                    <h3 className="text-white text-[17px] font-bold mb-2">{line.name}</h3>
                    <p className="text-white/70 text-[13px] leading-relaxed m-0">{line.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.08]">
                    <a
                      href={`tel:${line.tel}`}
                      className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white text-white hover:text-slate-900 text-[13px] font-semibold transition flex items-center justify-center gap-2 text-decoration-none border border-white/15 cursor-pointer"
                    >
                      <PhoneCall size={14} />
                      <span>Direct Dial {line.number}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* District Emergency Secretariats */}
        <section className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 backdrop-blur-[20px] border border-white/[0.1] shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sky-400 text-[11.5px] font-semibold tracking-wider uppercase font-mono block mb-1">
                Local Command Posts
              </span>
              <h2 className="text-[22px] sm:text-[26px] font-bold text-white m-0">Western Province District Secretariats</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {districtUnits.map((u, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-[12.5px]">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-[14px] mb-1">
                  <MapPin size={16} />
                  <span>{u.district}</span>
                </div>
                <div className="text-white/80 font-medium">Duty Officer: {u.officer}</div>
                <div className="text-white/60">Office: {u.location}</div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-white/50">Direct Line:</span>
                  <a href={`tel:${u.phone.replace(/-/g, '')}`} className="font-mono font-bold text-white hover:underline text-decoration-none">
                    {u.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">24/7 Mobile Hotline:</span>
                  <a href={`tel:${u.hotline.replace(/-/g, '')}`} className="font-mono font-bold text-emerald-400 hover:underline text-decoration-none">
                    {u.hotline}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Field Survival Protocols */}
        <section className="space-y-6">
          <div>
            <span className="text-emerald-400 text-[11.5px] font-semibold tracking-wider uppercase font-mono block mb-1">
              Field Safety Protocols
            </span>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-white m-0">Life-Safety Disaster Response Directives</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {safetyProtocols.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div key={idx} className="p-7 rounded-3xl bg-slate-900/60 border border-white/[0.1] backdrop-blur-[20px] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                      <IconComp size={20} className={p.color} />
                    </div>
                    <h3 className="text-[16px] font-bold text-white m-0">{p.title}</h3>
                  </div>

                  <ul className="space-y-2.5 text-[12.5px] text-white/70 pl-4 m-0 leading-relaxed">
                    {p.points.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Download Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl border border-white/20 shadow-2xl text-[13px] flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-[#080A19] border-t border-white/[0.08] py-8 text-center text-white/60 text-[13px]">
        <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8">
          <p className="m-0">
            For medical or life-threatening emergencies requiring acute field triage, contact <strong>1990</strong> or <strong>117</strong> immediately.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EmergencyDirectoryPage;

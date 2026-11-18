import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Cpu,
  Truck,
  Building2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  Compass,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';

export const CoreCapabilitiesPage = () => {
  const navigate = useNavigate();

  // Interactive AI Triage Demo state
  const [demoInput, setDemoInput] = useState(
    'My mother is 72 in a wheelchair. Water is rising above knee level in Wellampitiya near the canal. Electricity is cut off and we have no clean water.'
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [demoResult, setDemoResult] = useState({
    urgency: 4,
    category: 'Medical & Swiftwater Extraction',
    priority: 'Critical / High (Level 4)',
    extractedFactors: [
      'Elderly resident (72 yrs) with wheelchair mobility requirement',
      'Rising floodwater (knee deep, estimated 0.6m - 0.8m)',
      'Submerged power infrastructure hazard (electrocution risk)',
      'Critical clean water depletion in hazard polygon'
    ],
    confidenceScore: 92,
    recommendedAction: 'Dispatch Amphibious Rescue Dinghy #04 + Paramedic Stretcher escort to Colombo Central High-Ground Shelter.'
  });

  const handleRunDemo = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setDemoResult({
        urgency: demoInput.toLowerCase().includes('chest pain') || demoInput.toLowerCase().includes('unconscious') ? 5 : 4,
        category: 'Medical & Swiftwater Rescue',
        priority: 'Critical Priority (Level 4)',
        extractedFactors: [
          'Vulnerable household indicator detected',
          'Active flood inundation zone proximity confirmed',
          'Urgent life-safety intervention requested'
        ],
        confidenceScore: 94,
        recommendedAction: 'Auto-queue for Emergency Coordinator verification & dispatch nearest multi-agency response boat.'
      });
    }, 700);
  };

  return (
    <div className="min-h-screen w-full bg-[#080A19] text-white font-['Poppins',-apple-system,BlinkMacSystemFont,sans-serif] flex flex-col">
      {/* Top Navigation */}
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
            <button
              onClick={() => navigate('/coordinator/dashboard')}
              className="px-4 py-1.5 rounded-lg bg-[#3d6b4f] hover:bg-[#085a70] text-white text-[12.5px] font-semibold transition cursor-pointer border-0 shadow-sm"
            >
              Coordinator Command
            </button>
          </div>
        </div>
      </header>

      {/* Hero Headline */}
      <section className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-12 pt-12 pb-8">
        <div className="max-w-[820px]">
          <span className="text-sky-400 text-[12px] tracking-[0.2em] font-[500] uppercase mb-2 block">
            INTELLIGENT CRISIS INFRASTRUCTURE
          </span>
          <h1 className="text-white text-[32px] sm:text-[48px] font-normal leading-[1.05] tracking-[-0.02em]">
            Engineered for Rapid Humanitarian Action
          </h1>
          <p className="text-white/70 text-[16px] sm:text-[18px] font-[450] mt-3 leading-relaxed">
            Discover the three foundational pillars powering the RELIEFCORE humanitarian coordination network: explainable machine learning triage, autonomous logistics supply chains, and dynamic shelter capacity synchronization.
          </p>
        </div>
      </section>

      {/* 3 Core Architecture Pillars */}
      <main className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-12 py-6 flex-1 space-y-12">
        {/* Pillar 1: Automated AI Triage */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 backdrop-blur-[20px] border border-white/[0.1] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center">
                <Cpu size={28} />
              </div>

              <span className="text-sky-400 text-[12px] font-semibold tracking-wider uppercase font-mono">
                Pillar 01 · Natural Language Processing
              </span>
              <h2 className="text-[26px] sm:text-[34px] font-bold text-white m-0">
                Automated AI Triage & Dynamic Urgency Scoring
              </h2>
              <p className="text-white/70 text-[14.5px] leading-relaxed">
                Traditional crisis hotlines suffer catastrophic bottlenecks during flood peaks. RELIEFCORE uses multi-lingual neural classifiers to parse unstructured voice and text citizen distress messages into structured tactical tickets in under 150 milliseconds.
              </p>

              <div className="space-y-2.5 pt-2 text-[13px] text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Automatic extraction of trapped family counts, water depth, and medical urgency</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Dynamic urgency score generation (Levels 1 to 5) with priority queue management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Explainable decision attribution trees presented to coordinators for human-in-the-loop sign-off</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => navigate('/coordinator/review')}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-[13px] font-bold shadow-md transition border-0 cursor-pointer flex items-center gap-2"
                >
                  <span>Open AI Triage Cockpit</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Interactive Live AI Triage Demo Widget */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950/70 border border-sky-500/20 shadow-inner">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-sky-400" />
                  <span className="text-[13px] font-bold text-white">Live AI Triage Model Simulator</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Latency: 142ms
                </span>
              </div>

              <label className="text-[11.5px] text-white/60 block mb-1.5">
                Simulated Citizen SOS Distress Message:
              </label>
              <textarea
                rows="3"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-[12.5px] outline-none focus:border-sky-400 transition"
              ></textarea>

              <div className="flex justify-between items-center my-3">
                <button
                  onClick={handleRunDemo}
                  disabled={analyzing}
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[12px] font-bold transition flex items-center gap-1.5 border-0 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <RotateCcw size={13} className="animate-spin" />
                      <span>Classifying NLP Tokens...</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} />
                      <span>Execute Neural Triage</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] text-white/40">Tested on 1,840 crisis cases</span>
              </div>

              {/* Triage Inference Output */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-white/60">Classified Priority:</span>
                  <span className="font-bold text-red-400">{demoResult.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Confidence Rating:</span>
                  <span className="font-mono font-bold text-emerald-400">{demoResult.confidenceScore}% Certainty</span>
                </div>
                <div className="pt-1 border-t border-white/[0.04]">
                  <span className="text-white/50 block text-[11px] mb-0.5">Extracted Key Factors:</span>
                  <ul className="m-0 pl-4 space-y-0.5 text-white/80 text-[11.5px]">
                    {demoResult.extractedFactors.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-1 border-t border-white/[0.04]">
                  <span className="text-white/50 block text-[11px] mb-0.5">Automated Dispatch Recommendation:</span>
                  <p className="text-sky-300 font-medium m-0 text-[11.5px]">{demoResult.recommendedAction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Logistics Supply Chain */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 backdrop-blur-[20px] border border-white/[0.1] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center">
                <Truck size={28} />
              </div>

              <span className="text-emerald-400 text-[12px] font-semibold tracking-wider uppercase font-mono">
                Pillar 02 · Supply Chain Logistics
              </span>
              <h2 className="text-[26px] sm:text-[34px] font-bold text-white m-0">
                Multi-Depot Inventory & Safe Convoy Routing
              </h2>
              <p className="text-white/70 text-[14.5px] leading-relaxed">
                Relief supplies are tracked from central intake receiving docks to regional field distribution centers. When road corridors are inundated, the routing engine dynamically calculates elevated bypass corridors for 4x4 trucks and boat convoys.
              </p>

              <div className="space-y-2.5 pt-2 text-[13px] text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Real-time inventory levels across 5 regional warehouses (Food, Water, Medical, Shelter)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Automated stock replenishment alerts when essential items fall below safety buffers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Tamper-proof cryptographic custody receipts stamped at dispatch and receiving docks</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => navigate('/logistics/inventory')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold shadow-md transition border-0 cursor-pointer flex items-center gap-2"
                >
                  <span>Explore Logistics Portal</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Warehouse Telemetry Snapshot */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950/70 border border-emerald-500/20 shadow-inner space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <h4 className="text-[14px] font-bold text-white m-0">Regional Depot Stockpile Status</h4>
                <span className="text-[11px] text-emerald-400 font-mono">6,280 Total Items</span>
              </div>

              <div className="space-y-2 text-[12px]">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Bottled Water (1L)</span>
                    <span className="text-[11px] text-white/50">Colombo Regional Warehouse</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">5,000 Units</span>
                    <span className="text-[10px] text-emerald-300 block">In Stock</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Family Rice Bags (10kg)</span>
                    <span className="text-[11px] text-white/50">Gampaha Zonal Distribution Center</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">1,200 Bags</span>
                    <span className="text-[10px] text-emerald-300 block">In Stock</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">First Aid Trauma Kits</span>
                    <span className="text-[11px] text-white/50">Colombo General Medical Depot</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400">800 Kits</span>
                    <span className="text-[10px] text-amber-300 block">Low Stock Alert</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Shelter Capacity */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 backdrop-blur-[20px] border border-white/[0.1] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center">
                <Building2 size={28} />
              </div>

              <span className="text-amber-400 text-[12px] font-semibold tracking-wider uppercase font-mono">
                Pillar 03 · Shelter & Facility Operations
              </span>
              <h2 className="text-[26px] sm:text-[34px] font-bold text-white m-0">
                Verified Shelter Capacity & Evacuee Allocation
              </h2>
              <p className="text-white/70 text-[14.5px] leading-relaxed">
                Prevents dangerous shelter overcrowding and chaotic family dispersal. On-site managers log live bed availability, while the system automatically reroutes approaching evacuee convoys to verified secondary hubs when centers reach 90% threshold.
              </p>

              <div className="space-y-2.5 pt-2 text-[13px] text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Real-time bed occupancy synchronization across 28 official Western Province relief hubs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Special needs placement rules for elderly, infants, and mobility-impaired citizens</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>On-site supply requisition queues linking shelter managers directly to logistics depots</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => navigate('/shelter/directory')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-[13px] font-bold shadow-md transition border-0 cursor-pointer flex items-center gap-2"
                >
                  <span>Open Shelter Management</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Live Shelter Occupancy Gauge */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950/70 border border-amber-500/20 shadow-inner space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <h4 className="text-[14px] font-bold text-white m-0">Western Province Shelter Readiness</h4>
                <span className="text-[11px] text-amber-400 font-mono">74% Total Occupancy</span>
              </div>

              <div className="space-y-3 text-[12px]">
                <div>
                  <div className="flex justify-between text-white/80 font-medium mb-1">
                    <span>Occupied Beds (Evacuees Sheltered)</span>
                    <span className="font-bold text-red-400">4,618 / 6,240</span>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-2.5" style={{ width: '74%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-white/80 font-medium mb-1">
                    <span>Available Emergency Beds</span>
                    <span className="font-bold text-emerald-400">1,622 Beds Ready</span>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-2.5" style={{ width: '26%' }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11.5px] text-white/70">
                  <span className="text-amber-300 font-semibold block mb-0.5">Overflow Redirection Protocol:</span>
                  Colombo Central School (84% full) is actively diverting arriving convoys to St. Anthony\'s College (62% full).
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#080A19] border-t border-white/[0.08] py-8 text-center text-white/60 text-[13px]">
        <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8">
          <p className="m-0">
            RELIEFCORE Intelligent Crisis Infrastructure · Designed for National Disaster Coordination in Sri Lanka.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CoreCapabilitiesPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  ShieldAlert,
  Droplets,
  Building2,
  PhoneCall,
  Search,
  Filter,
  Users,
  AlertTriangle,
  ArrowRight,
  LifeBuoy,
  Layers,
  CheckCircle2,
  Flame,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { LiveSatelliteCrisisMap } from '../../components/maps/LiveSatelliteCrisisMap';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';

export const PublicCrisisMapPage = () => {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState('Western Province');
  const [selectedDistrict, setSelectedDistrict] = useState('colombo');

  const districtsData = {
    colombo: {
      name: 'Colombo District (Zone A)',
      hazard: 'Major River Flooding (Red Alert)',
      waterLevel: '1.84m (Major Flood Exceeded)',
      affected: '3,200 Citizens',
      shelters: '12 Open Centers (84% Occupancy)',
      teams: '24 Army & Navy SBS Units',
      status: 'Critical Alert',
      severityColor: 'text-red-400',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30'
    },
    gampaha: {
      name: 'Gampaha District (Zone B)',
      hazard: 'Attanagalu Overflow & Mudslide Risk',
      waterLevel: '1.12m (Alert Level)',
      affected: '1,450 Citizens',
      shelters: '9 Open Centers (62% Occupancy)',
      teams: '11 Army Engineering Teams',
      status: 'High Hazard Watch',
      severityColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    kalutara: {
      name: 'Kalutara District (Zone C)',
      hazard: 'Kalu Ganga & Coastal Estuary Surge',
      waterLevel: '2.10m Sea Swell',
      affected: '2,100 Citizens',
      shelters: '7 Open Centers (76% Occupancy)',
      teams: '7 Navy Swiftwater Teams',
      status: 'Red Alert Surge',
      severityColor: 'text-red-400',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30'
    }
  };

  const currentSector = districtsData[selectedDistrict] || districtsData.colombo;

  return (
    <div className="min-h-screen w-full bg-[#080A19] text-white font-['Poppins',-apple-system,BlinkMacSystemFont,sans-serif] flex flex-col">
      {/* =========================================================
         1. Top Public Navigation Bar
         ========================================================= */}
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

          {/* Emergency Ticker Badge */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11.5px] font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            <span>LIVE SATELLITE DISASTER RADAR · SENTINEL-2 ACTIVE</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:117"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[12.5px] font-semibold text-decoration-none transition cursor-pointer"
            >
              <PhoneCall size={13} />
              <span>DMC: 117</span>
            </a>

            <button
              onClick={() => navigate('/citizen/submit')}
              className="px-4 py-1.5 rounded-lg bg-white text-slate-900 text-[12.5px] font-bold hover:bg-slate-100 transition shadow-md border-0 cursor-pointer flex items-center gap-1.5"
            >
              <LifeBuoy size={14} className="text-rose-600" />
              <span>Submit SOS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Emergency Alert Banner */}
      <div className="bg-gradient-to-r from-red-600/30 via-rose-600/20 to-amber-600/30 border-b border-red-500/30 px-5 sm:px-8 md:px-12 py-2.5 text-[12.5px] backdrop-blur-md">
        <div className="w-full max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-3 text-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-red-400 shrink-0" />
            <span>
              <strong className="text-white font-semibold">NATIONAL LEVEL 3 RED ALERT:</strong> Kelani River Basin water crest exceeded major flood mark (+0.34m). Citizens in low-lying zones must evacuate to designated shelters immediately.
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11.5px] text-white/70">
            <span className="font-mono">GPS HUD: 6.9271° N, 79.8612° E</span>
            <span>·</span>
            <Link to="/citizen/shelters" className="text-amber-300 underline font-semibold hover:text-white">
              View Open Shelters List →
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================
         2. Main Map Viewport & Telemetry HUD
         ========================================================= */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-12 py-6 flex flex-col gap-6">
        {/* District Filter & Province Select */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-[20px] border border-white/[0.1] shadow-lg">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-semibold text-white/60 mr-1 flex items-center gap-1.5">
              <Compass size={14} className="text-sky-400" />
              <span>Focus District:</span>
            </span>
            <button
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition border cursor-pointer ${
                selectedDistrict === 'colombo'
                  ? 'bg-[#0e7490] text-white border-[#0e7490] shadow-sm'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/10'
              }`}
              onClick={() => setSelectedDistrict('colombo')}
            >
              Colombo (Red Alert)
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition border cursor-pointer ${
                selectedDistrict === 'gampaha'
                  ? 'bg-[#0e7490] text-white border-[#0e7490] shadow-sm'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/10'
              }`}
              onClick={() => setSelectedDistrict('gampaha')}
            >
              Gampaha (Mudslide Risk)
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition border cursor-pointer ${
                selectedDistrict === 'kalutara'
                  ? 'bg-[#0e7490] text-white border-[#0e7490] shadow-sm'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border-white/10'
              }`}
              onClick={() => setSelectedDistrict('kalutara')}
            >
              Kalutara (Coastal Surge)
            </button>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-white/70">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Satellite Resolution: 10m Multi-spectral</span>
          </div>
        </div>

        {/* Map Grid Layout: Leaflet Satellite Container (8 Cols) + Live Sector Dossier (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Leaflet Satellite Map */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-white/[0.12] shadow-2xl relative min-h-[560px] bg-[#0b1d24]">
            <LiveSatelliteCrisisMap onProvinceChange={(p) => setSelectedProvince(p)} />
          </div>

          {/* Right Column: Live Sector Telemetry & Rapid Actions */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            {/* Sector Details Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-[20px] border border-white/[0.1] shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${currentSector.badgeBg}`}>
                  {currentSector.status}
                </span>
                <span className="text-[11.5px] font-mono text-white/50">Zone Ref #WP-01</span>
              </div>

              <h3 className="text-[20px] font-bold text-white mb-1">{currentSector.name}</h3>
              <p className="text-[13px] text-white/70 leading-relaxed mb-4">{currentSector.hazard}</p>

              <div className="space-y-3 pt-3 border-t border-white/[0.08] text-[12.5px]">
                <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                  <span className="text-white/60">Live Hydrometric Water Crest:</span>
                  <span className="font-mono font-bold text-red-400">{currentSector.waterLevel}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                  <span className="text-white/60">Affected Population:</span>
                  <span className="font-semibold text-white">{currentSector.affected}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                  <span className="text-white/60">Verified Open Shelters:</span>
                  <span className="font-semibold text-emerald-400">{currentSector.shelters}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-white/60">Deployed Rescue Units:</span>
                  <span className="font-semibold text-sky-400">{currentSector.teams}</span>
                </div>
              </div>
            </div>

            {/* Quick Public Action Buttons */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-[#0e3b43]/60 backdrop-blur-[20px] border border-cyan-500/20 shadow-xl space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <LifeBuoy size={18} className="text-cyan-400" />
                <h4 className="text-[15px] font-bold text-white m-0">Need Emergency Extraction?</h4>
              </div>
              <p className="text-[12.5px] text-white/70 m-0 leading-relaxed">
                Stranded residents can submit an instant GPS-tagged rescue ticket directly to field boat units.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => navigate('/citizen/submit?category=Rescue')}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold shadow-lg transition flex items-center justify-center gap-2 border-0 cursor-pointer"
                >
                  <Flame size={15} />
                  <span>Request Urgent Boat Rescue (SOS)</span>
                </button>

                <button
                  onClick={() => navigate('/citizen/shelters')}
                  className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-[13px] font-semibold border border-white/15 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 size={15} />
                  <span>Find Nearest Open Relief Shelter</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
           3. Bottom Operational Sector Summary Grid
           ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-[20px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-white m-0">8 Active Flood Sectors</h4>
                <span className="text-[11px] text-white/50">Kelani, Kalu Ganga & Attanagalu</span>
              </div>
            </div>
            <p className="text-[12px] text-white/60 m-0 leading-relaxed">
              Real-time watercrest telemetry updated every 5 minutes from Department of Irrigation stations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-[20px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Building2 size={18} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-white m-0">28 Verified Shelters Open</h4>
                <span className="text-[11px] text-white/50">1,622 Available Beds Remaining</span>
              </div>
            </div>
            <p className="text-[12px] text-white/60 m-0 leading-relaxed">
              Equipped with clean potable drinking water, hot meal distribution, and Sri Lanka Red Cross medical aid posts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-[20px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <Radio size={18} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-white m-0">42 Field Response Units</h4>
                <span className="text-[11px] text-white/50">Sri Lanka Army & Navy SBS</span>
              </div>
            </div>
            <p className="text-[12px] text-white/60 m-0 leading-relaxed">
              High-clearance rescue trucks and inflatable dinghies conducting continuous extraction sweeps.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicCrisisMapPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Wand2, 
  ShieldCheck, 
  Home, 
  PhoneCall, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Menu,
  X,
  AlertTriangle,
  Compass
} from 'lucide-react';
import reliefcoreIcon from '../../assets/reliefcore-icon.png';
import citizenHeroPhoto from '../../assets/citizen-hero-photo.jpg';

export const BloomLandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-hidden font-display text-white selection:bg-white/20 select-none">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Grayscale overlay for optimal contrast */}
      <div className="absolute inset-0 bg-black/45 z-[1] pointer-events-none" />

      {/* Main Two-Panel Split Layout */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row p-4 lg:p-6 gap-6">
        {/* =========================================================
           LEFT PANEL (w-[52%] on lg, full width on mobile)
           ========================================================= */}
        <div className="w-full lg:w-[52%] min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)] liquid-glass-strong rounded-3xl p-6 lg:p-10 flex flex-col justify-between relative">
          {/* Nav Header */}
          <header className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-3 text-decoration-none group">
              <img 
                src={reliefcoreIcon} 
                alt="RELIEFCORE Logo" 
                className="w-8 h-8 object-contain rounded-lg group-hover:scale-105 transition-transform" 
              />
              <span className="font-semibold text-2xl tracking-tighter text-white uppercase">RELIEFCORE</span>
              <span className="liquid-glass rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/60 ml-1">
                Ops
              </span>
            </Link>

            <button 
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="liquid-glass rounded-full px-4 py-2 text-sm text-white flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <span>Menu</span>
              <Menu size={16} />
            </button>
          </header>

          {/* Hero Center */}
          <main className="flex-1 flex flex-col items-center justify-center text-center py-12 lg:py-16 px-4">
            <div className="w-20 h-20 mb-8 rounded-2xl liquid-glass flex items-center justify-center hover:scale-105 transition-transform">
              <img 
                src={reliefcoreIcon} 
                alt="RELIEFCORE Crisis Command" 
                className="w-14 h-14 object-contain"
              />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-[-0.05em] font-[500] text-white leading-[1.05] max-w-2xl">
              Innovating the <br />
              <span className="font-serif italic text-white/80">future of crisis AI</span>
            </h1>

            <p className="text-white/60 text-sm sm:text-base max-w-lg mt-4 font-normal">
              Zero-latency disaster telemetry, intelligent triage, and decentralized relief dispatch for flood emergencies.
            </p>

            {/* CTA Button */}
            <Link
              to="/login"
              className="liquid-glass-strong rounded-full px-7 py-3.5 mt-8 flex items-center gap-3 text-white font-[500] hover:scale-105 active:scale-95 transition-transform cursor-pointer text-decoration-none"
            >
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                <ArrowRight size={14} className="text-white" />
              </div>
              <span className="text-[15px]">Access Command Portal</span>
            </Link>

            {/* Three Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform cursor-default">
                AI Triage Engine
              </span>
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform cursor-default">
                Real-Time Telemetry
              </span>
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform cursor-default">
                High-Ground Shelters
              </span>
            </div>
          </main>

          {/* Bottom Quote / Humanitarian Mandate */}
          <footer className="text-center pt-6 flex flex-col items-center">
            <span className="text-[11px] tracking-widest uppercase text-white/50 mb-2 font-display">
              HUMANITARIAN MANDATE
            </span>
            <blockquote className="text-[14px] text-white/80 max-w-md">
              <span className="font-display">"Every second counts when </span>
              <span className="font-serif italic">protecting human lives."</span>
            </blockquote>
            <div className="flex items-center gap-3 text-[11px] tracking-wider uppercase text-white/50 mt-3 w-full max-w-xs justify-center">
              <div className="flex-1 h-px bg-white/10" />
              <span>RELIEF OPERATIONS COMMAND</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          </footer>
        </div>

        {/* =========================================================
           RIGHT PANEL (w-[48%] on lg, hidden on mobile)
           ========================================================= */}
        <div className="hidden lg:flex w-[48%] min-h-[calc(100vh-3rem)] flex-col justify-between p-2">
          {/* Top Bar */}
          <div className="flex items-center justify-between w-full">
            {/* Hotlines Pill */}
            <div className="liquid-glass rounded-full px-4 py-2 flex items-center gap-3">
              <PhoneCall size={14} className="text-white/70" />
              <span className="text-xs text-white/90 font-medium">Emergency DMC 117</span>
              <div className="w-px h-3.5 bg-white/20" />
              <span className="text-xs text-white/70">Ambulance 1990</span>
            </div>

            {/* Account / Action Buttons */}
            <div className="flex items-center gap-2">
              <Link 
                to="/login"
                className="liquid-glass rounded-full px-5 py-2 text-sm text-white hover:scale-105 active:scale-95 transition-transform text-decoration-none"
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                className="liquid-glass rounded-full px-5 py-2 text-sm text-white hover:scale-105 active:scale-95 transition-transform text-decoration-none"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Crisis Overview Card */}
          <div className="liquid-glass w-72 p-5 rounded-3xl mt-8 hover:scale-105 transition-transform cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <AlertTriangle size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-[500] text-white">Western Province Response</h3>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              Active flood telemetry along Kelani Ganga basin with automated evacuation shelter coordination.
            </p>
          </div>

          {/* Bottom Feature Section */}
          <div className="mt-auto liquid-glass rounded-[2.5rem] p-4 flex flex-col gap-4">
            {/* Two Side-by-Side Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="liquid-glass rounded-3xl p-5 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <Wand2 size={16} className="text-white" />
                </div>
                <h4 className="text-sm font-[500] text-white">AI Request Triage</h4>
                <p className="text-xs text-white/60 mt-1">Automated urgency scoring and supply matching</p>
              </div>

              <div className="liquid-glass rounded-3xl p-5 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <Home size={16} className="text-white" />
                </div>
                <h4 className="text-sm font-[500] text-white">Shelter Grid</h4>
                <p className="text-xs text-white/60 mt-1">Real-time bed capacity & high-ground routing</p>
              </div>
            </div>

            {/* Bottom Card */}
            <div className="liquid-glass rounded-3xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <img 
                src={citizenHeroPhoto} 
                alt="Disaster Response Operation" 
                className="w-24 h-16 rounded-2xl object-cover shrink-0 filter grayscale" 
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-[500] text-white truncate">Western Province Field Operations</h4>
                <p className="text-xs text-white/60 mt-0.5 line-clamp-1">
                  186 active field rescue and relief teams deployed.
                </p>
              </div>
              <Link 
                to="/citizen/submit"
                aria-label="Request Aid"
                className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white shrink-0 hover:scale-110 transition-transform cursor-pointer no-underline"
              >
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-end"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="w-72 h-full liquid-glass-strong p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-semibold text-xl tracking-tight uppercase">RELIEFCORE</span>
                <button 
                  type="button" 
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="flex flex-col gap-4 text-sm">
                <Link to="/" className="text-white/80 hover:text-white transition-colors text-decoration-none">Home</Link>
                <Link to="/citizen" className="text-white/80 hover:text-white transition-colors text-decoration-none">Citizen Portal</Link>
                <Link to="/coordinator" className="text-white/80 hover:text-white transition-colors text-decoration-none">Coordinator Portal</Link>
                <Link to="/login" className="text-white/80 hover:text-white transition-colors text-decoration-none">Sign In</Link>
                <Link to="/signup" className="text-white/80 hover:text-white transition-colors text-decoration-none">Create Account</Link>
              </nav>
            </div>

            <div className="text-xs text-white/50">
              © 2026 RELIEFCORE Humanitarian Operations
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloomLandingPage;

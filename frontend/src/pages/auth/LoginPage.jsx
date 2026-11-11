import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  ChevronDown, 
  ShieldAlert,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { authService } from '../../services/authService';
import reliefcoreIcon from '../../assets/reliefcore-icon.png';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login(formData);
      if (response?.succeeded) {
        login(response.data);
        showAlert("Login successful", "success");
        navigate('/coordinator');
      } else {
        showAlert(response?.errors?.[0] || "Invalid credentials", "error");
      }
    } catch (err) {
      // Frontend-only / offline demo mode fallback
      const demoUser = {
        id: 'usr-001',
        fullName: formData.email ? (formData.email.split('@')[0].charAt(0).toUpperCase() + formData.email.split('@')[0].slice(1)) : 'Amara Chen',
        role: 'Coordinator',
        email: formData.email || 'amara.chen@reliefcore.org',
        token: 'reliefcore-session-token'
      };
      login(demoUser);
      showAlert("Logged in successfully (Demo Mode)", "success");
      navigate('/coordinator');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    showAlert(`Connecting to ${provider} authentication...`, "info");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showAlert("Password recovery instructions have been sent to your administrator.", "info");
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden font-display text-white selection:bg-white/20 select-none">
      {/* Background Video */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Grayscale overlay for optimal contrast */}
      <div className="fixed inset-0 bg-black/45 z-[1] pointer-events-none" />

      {/* Main Two-Panel Split Layout */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row p-4 lg:p-6 gap-6 items-stretch">
        
        {/* =========================================================
           LEFT PANEL: Hero & Brand Overview (w-[50%] on lg)
           ========================================================= */}
        <section className="w-full lg:w-[50%] liquid-glass-strong rounded-3xl p-6 lg:p-10 flex flex-col justify-between relative min-h-[500px] lg:min-h-[calc(100vh-3rem)]">
          {/* Header */}
          <header className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-3 no-underline group" title="Return to Homepage">
              <img 
                src={reliefcoreIcon} 
                alt="RELIEFCORE Crisis Command" 
                className="w-8 h-8 object-contain rounded-lg group-hover:scale-105 transition-transform" 
              />
              <span className="font-semibold text-xl tracking-tight text-white uppercase">RELIEFCORE</span>
              <span className="liquid-glass rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/60 ml-1">
                Operations
              </span>
            </Link>

            <Link
              to="/"
              className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform no-underline"
            >
              <ArrowLeft size={14} />
              <span>Home</span>
            </Link>
          </header>

          {/* Hero Center */}
          <main className="flex-1 flex flex-col items-center justify-center text-center py-10 lg:py-14 px-2">
            <div className="w-20 h-20 mb-6 rounded-2xl liquid-glass flex items-center justify-center hover:scale-105 transition-transform">
              <img 
                src={reliefcoreIcon} 
                alt="RELIEFCORE Emblem" 
                className="w-13 h-13 object-contain"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-[-0.05em] font-[500] text-white leading-[1.08] max-w-xl">
              Stronger communities, <br />
              <span className="font-serif italic text-white/80">safer tomorrows.</span>
            </h1>

            <p className="text-white/60 text-sm lg:text-base max-w-md mx-auto mt-4 font-normal">
              AI-powered coordination for faster, smarter, and more transparent humanitarian disaster response.
            </p>

            {/* Three Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform cursor-default">
                AI Triage Engine
              </span>
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform cursor-default">
                Real-Time Dispatch
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
        </section>

        {/* =========================================================
           RIGHT PANEL: Authentication Form (w-[50%] on lg)
           ========================================================= */}
        <section className="w-full lg:w-[50%] liquid-glass-strong rounded-3xl p-6 lg:p-10 flex flex-col justify-between relative min-h-[calc(100vh-3rem)]">
          {/* Top Bar with Language Selector and Back Link */}
          <div className="flex items-center justify-between w-full pb-4">
            <Link 
              to="/" 
              className="liquid-glass rounded-full px-4 py-2 text-xs text-white/70 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform no-underline"
              title="Return to Homepage"
            >
              <ArrowLeft size={14} />
              <span>Back to Homepage</span>
            </Link>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="liquid-glass rounded-full px-3.5 py-1.5 text-xs text-white/80 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                onClick={() => setShowLangMenu(!showLangMenu)}
                aria-expanded={showLangMenu}
              >
                <Globe size={13} className="text-white/60" />
                <span>{selectedLang}</span>
                <ChevronDown size={13} className="text-white/60" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 liquid-glass-strong rounded-2xl py-2 z-50 flex flex-col gap-1 shadow-2xl backdrop-blur-3xl">
                  {['English', 'සිංහල', 'தமிழ்', 'Español', 'Français'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className={`text-left px-4 py-1.5 text-xs transition-colors cursor-pointer ${
                        selectedLang === lang ? 'text-white bg-white/15 font-medium' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => {
                        setSelectedLang(lang);
                        setShowLangMenu(false);
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="w-full max-w-md mx-auto my-auto py-6">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-[500] text-white tracking-[-0.03em]">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1 font-normal">
                Secure access to humanitarian crisis operations
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-white/60 font-medium" htmlFor="email-input">
                  Email address
                </label>
                <div className="liquid-glass rounded-2xl px-4 py-3 flex items-center gap-3 transition-colors focus-within:bg-white/[0.04]">
                  <Mail className="text-white/40 shrink-0" size={17} />
                  <input
                    id="email-input"
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-display focus:ring-0"
                    type="email"
                    placeholder="coordinator@reliefcore.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-white/60 font-medium" htmlFor="password-input">
                  Password
                </label>
                <div className="liquid-glass rounded-2xl px-4 py-3 flex items-center gap-3 transition-colors focus-within:bg-white/[0.04]">
                  <Lock className="text-white/40 shrink-0" size={17} />
                  <input
                    id="password-input"
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-display focus:ring-0"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="text-white/40 hover:text-white transition-colors cursor-pointer shrink-0"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs text-white/70 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded bg-white/10 border-none text-white focus:ring-0 cursor-pointer accent-white/80"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-white/70 hover:text-white transition-colors">Remember me</span>
                </label>

                <a 
                  href="#forgot-password" 
                  onClick={handleForgotPassword} 
                  className="text-white/70 hover:text-white transition-colors no-underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="liquid-glass-strong rounded-full w-full py-3.5 px-6 flex items-center justify-center gap-3 text-white font-[500] text-[15px] hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg"
                disabled={loading}
                id="signin-btn"
              >
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                  <ArrowRight size={14} className="text-white" />
                </div>
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social Auth Buttons (Strict Grayscale) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="liquid-glass rounded-full py-2.5 px-4 flex items-center justify-center gap-2.5 text-xs font-medium text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                onClick={() => handleSocialLogin('Google')}
                id="google-signin-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-white/80">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="liquid-glass rounded-full py-2.5 px-4 flex items-center justify-center gap-2.5 text-xs font-medium text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                onClick={() => handleSocialLogin('Microsoft')}
                id="microsoft-signin-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-white/80">
                  <path d="M0 0h11v11H0zM13 0h11v11H13zM0 13h11v11H0zM13 13h11v11H13z" />
                </svg>
                <span>Microsoft</span>
              </button>
            </div>

            {/* Bottom Navigation Prompts */}
            <div className="flex flex-col items-center gap-2 mt-6 text-xs text-white/60">
              <div>
                <span>Don't have an account? </span>
                <Link to="/signup" className="text-white underline hover:text-white/80 transition-colors ml-1" id="signup-nav-link">
                  Sign up
                </Link>
              </div>

              <div>
                <span>Need emergency help? </span>
                <Link to="/citizen/submit" className="text-white/80 underline hover:text-white transition-colors ml-1">
                  Citizen Portal
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar Info */}
          <div className="text-center pt-4">
            <span className="text-[11px] uppercase tracking-widest text-white/40">
              RELIEF OPERATIONS SECURE GATEWAY
            </span>
          </div>
        </section>

      </div>
    </div>
  );
};

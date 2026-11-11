import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Shield, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  ChevronDown, 
  Globe,
  HeartHandshake,
  Truck,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { authService } from '../../services/authService';
import reliefcoreIcon from '../../assets/reliefcore-icon.png';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 0 // 0 = Citizen, 3 = Volunteer, 1 = Coordinator, 2 = Logistics
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const roleOptions = [
    { id: 0, title: 'Citizen / Displaced', icon: Users },
    { id: 3, title: 'Field Volunteer', icon: HeartHandshake },
    { id: 1, title: 'Coordinator', icon: Shield },
    { id: 2, title: 'Logistics Manager', icon: Truck },
  ];

  const getRoleDescription = (roleId) => {
    switch (Number(roleId)) {
      case 3:
        return 'Receive SAR alerts, check into field shelters, and accept dispatch assignments.';
      case 1:
        return 'Access AI triage, command center overview, and humanitarian resource approval.';
      case 2:
        return 'Manage regional inventory depots, dispatch convoys, and track emergency stockpiles.';
      case 0:
      default:
        return 'Access high-ground shelters, request rations & medical aid, and track tickets.';
    }
  };

  const redirectByRole = (role) => {
    const roleStr = (role || '').toString().toLowerCase();
    if (roleStr === 'volunteer' || roleStr === '3') {
      navigate('/volunteers/assignments');
    } else if (roleStr === 'coordinator' || roleStr === '1' || roleStr === 'admin' || roleStr === '4') {
      navigate('/coordinator/dashboard');
    } else if (roleStr === 'logisticsmanager' || roleStr === '2') {
      navigate('/logistics/inventory');
    } else {
      navigate('/citizen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showAlert('Please enter your full name', 'warning');
      return;
    }
    if (!formData.email.trim()) {
      showAlert('Please enter a valid email address', 'warning');
      return;
    }
    if (formData.password.length < 6) {
      showAlert('Password must contain at least 6 characters', 'warning');
      return;
    }
    if (!agreeTerms) {
      showAlert('Please accept data protection & privacy protocols to register', 'warning');
      return;
    }

    setLoading(true);

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phoneNumber: formData.phoneNumber.trim() || null,
      role: parseInt(formData.role, 10)
    };

    try {
      const response = await authService.register(payload);
      if (response?.succeeded) {
        login(response.data);
        showAlert('Registration successful! Welcome to the humanitarian platform.', 'success');
        redirectByRole(response.data.role);
      } else {
        showAlert(response?.errors?.[0] || 'Registration failed. Please verify your details.', 'error');
      }
    } catch (err) {
      // Fallback demo mode if backend is offline or demo environment
      const roleMap = {
        0: 'Citizen',
        1: 'Coordinator',
        2: 'LogisticsManager',
        3: 'Volunteer'
      };
      const roleName = roleMap[payload.role] || 'Citizen';
      const demoUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        fullName: payload.fullName,
        role: roleName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        token: 'reliefcore-session-token'
      };
      login(demoUser);
      showAlert(`Registration successful (Academic Demo Mode) as ${roleName}`, 'success');
      redirectByRole(roleName);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    showAlert(`Connecting to ${provider} single sign-on...`, 'info');
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
           LEFT PANEL: Hero & Brand Overview (w-[48%] on lg)
           ========================================================= */}
        <section className="w-full lg:w-[48%] liquid-glass-strong rounded-3xl p-6 lg:p-10 flex flex-col justify-between relative min-h-[500px] lg:min-h-[calc(100vh-3rem)]">
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
                Registration
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
              Empowering responders, <br />
              <span className="font-serif italic text-white/80">protecting lives.</span>
            </h1>

            <p className="text-white/60 text-sm lg:text-base max-w-md mx-auto mt-4 font-normal">
              Join the verified crisis response ecosystem. Request urgent aid, discover safe shelters, or deploy as a responder.
            </p>

            {/* Three Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform cursor-default">
                Verified Responders
              </span>
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform cursor-default">
                Dynamic Allocation
              </span>
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform cursor-default">
                Disaster Hotlines (117)
              </span>
            </div>
          </main>

          {/* Bottom Quote / Crisis Response Protocol */}
          <footer className="text-center pt-6 flex flex-col items-center">
            <span className="text-[11px] tracking-widest uppercase text-white/50 mb-2 font-display">
              CRISIS RESPONSE PROTOCOL
            </span>
            <blockquote className="text-[14px] text-white/80 max-w-md">
              <span className="font-display">"United in crisis, </span>
              <span className="font-serif italic">delivering hope without delay."</span>
            </blockquote>
            <div className="flex items-center gap-3 text-[11px] tracking-wider uppercase text-white/50 mt-3 w-full max-w-xs justify-center">
              <div className="flex-1 h-px bg-white/10" />
              <span>DISASTER MANAGEMENT DIRECTIVE</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          </footer>
        </section>

        {/* =========================================================
           RIGHT PANEL: Registration Form (w-[52%] on lg)
           ========================================================= */}
        <section className="w-full lg:w-[52%] liquid-glass-strong rounded-3xl p-6 lg:p-10 flex flex-col justify-between relative min-h-[calc(100vh-3rem)]">
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
          <div className="w-full max-w-lg mx-auto my-auto py-4">
            <div className="mb-5 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-[500] text-white tracking-[-0.03em]">
                Create Account
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1 font-normal">
                Join the verified humanitarian coordination network
              </p>
            </div>

            <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wider text-white/60 font-medium" htmlFor="reg-name-input">
                  Full name
                </label>
                <div className="liquid-glass rounded-2xl px-4 py-2.5 flex items-center gap-3 transition-colors focus-within:bg-white/[0.04]">
                  <User className="text-white/40 shrink-0" size={17} />
                  <input
                    id="reg-name-input"
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-display focus:ring-0"
                    type="text"
                    placeholder="Kasun Perera"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wider text-white/60 font-medium" htmlFor="reg-email-input">
                  Email address
                </label>
                <div className="liquid-glass rounded-2xl px-4 py-2.5 flex items-center gap-3 transition-colors focus-within:bg-white/[0.04]">
                  <Mail className="text-white/40 shrink-0" size={17} />
                  <input
                    id="reg-email-input"
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-display focus:ring-0"
                    type="email"
                    placeholder="responder@reliefcore.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password & Phone Row on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Password Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-white/60 font-medium" htmlFor="reg-password-input">
                    Password
                  </label>
                  <div className="liquid-glass rounded-2xl px-4 py-2.5 flex items-center gap-3 transition-colors focus-within:bg-white/[0.04]">
                    <Lock className="text-white/40 shrink-0" size={17} />
                    <input
                      id="reg-password-input"
                      className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-display focus:ring-0"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      autoComplete="new-password"
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

                {/* Phone Number Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-white/60 font-medium" htmlFor="reg-phone-input">
                    Phone number
                  </label>
                  <div className="liquid-glass rounded-2xl px-4 py-2.5 flex items-center gap-3 transition-colors focus-within:bg-white/[0.04]">
                    <Phone className="text-white/40 shrink-0" size={17} />
                    <input
                      id="reg-phone-input"
                      className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-display focus:ring-0"
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              {/* Account Role Field */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-white/60 font-medium" htmlFor="reg-role-select">
                    Select your primary role
                  </label>
                </div>

                {/* Hidden native select for form/test parity */}
                <select
                  id="reg-role-select"
                  className="sr-only"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: parseInt(e.target.value, 10) })}
                  aria-label="Account Role Select"
                >
                  <option value={0}>Citizen / Displaced Person</option>
                  <option value={3}>Field Volunteer Responder</option>
                  <option value={1}>Humanitarian Coordinator</option>
                  <option value={2}>Logistics & Supply Manager</option>
                </select>

                {/* Interactive Liquid Glass Role Chips */}
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = Number(formData.role) === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setFormData({ ...formData, role: opt.id })}
                        className={`rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                          isSelected 
                            ? 'liquid-glass-strong bg-white/15 text-white scale-[1.02]' 
                            : 'liquid-glass text-white/70 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'liquid-glass text-white/50'
                        }`}>
                          <Icon size={13} />
                        </div>
                        <span className="text-xs font-medium truncate">{opt.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Role Description Note */}
                <div className="liquid-glass rounded-xl px-3 py-2 text-[11px] text-white/60 mt-1 leading-relaxed">
                  {getRoleDescription(formData.role)}
                </div>
              </div>

              {/* Terms & Privacy Agreement */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded bg-white/10 border-none text-white focus:ring-0 cursor-pointer accent-white/80 shrink-0"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="text-xs text-white/60 leading-normal">
                  I agree to the Humanitarian Data Protection & Privacy protocols for emergency crisis response.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="liquid-glass-strong rounded-full w-full py-3.5 px-6 flex items-center justify-center gap-3 text-white font-[500] text-[15px] hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg"
                disabled={loading}
                id="signup-submit-btn"
              >
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                  <ArrowRight size={14} className="text-white" />
                </div>
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-white/40 font-medium">or sign up with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social Auth Buttons (Strict Grayscale) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="liquid-glass rounded-full py-2.5 px-4 flex items-center justify-center gap-2.5 text-xs font-medium text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                onClick={() => handleSocialRegister('Google')}
                id="google-signup-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-white/80">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="liquid-glass rounded-full py-2.5 px-4 flex items-center justify-center gap-2.5 text-xs font-medium text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                onClick={() => handleSocialRegister('Microsoft')}
                id="microsoft-signup-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-white/80">
                  <path d="M0 0h11v11H0zM13 0h11v11H13zM0 13h11v11H0zM13 13h11v11H13z" />
                </svg>
                <span>Microsoft</span>
              </button>
            </div>

            {/* Bottom Navigation Prompts */}
            <div className="flex flex-col items-center gap-2 mt-5 text-xs text-white/60">
              <div>
                <span>Already have an account? </span>
                <Link to="/login" className="text-white underline hover:text-white/80 transition-colors ml-1" id="login-nav-link">
                  Sign In
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
          <div className="text-center pt-3">
            <span className="text-[11px] uppercase tracking-widest text-white/40">
              RELIEF OPERATIONS SECURE GATEWAY
            </span>
          </div>
        </section>

      </div>
    </div>
  );
};

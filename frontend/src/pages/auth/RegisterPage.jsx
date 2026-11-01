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
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { authService } from '../../services/authService';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import reliefcoreLogo from '../../assets/reliefcore-logo.png';
import './LoginPage.css';

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
        showAlert('Registration successful! Welcome to RELIEFCORE.', 'success');
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
    <div className="login-wrapper">
      {/* Left Panel: Hero & Mission Overview */}
      <section className="login-hero">
        {/* Brand Header */}
        <div className="hero-brand">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }} title="Return to Homepage">
            <img
              src={reliefcoreLogoWhite}
              alt="RELIEFCORE Humanitarian Operations"
              className="hero-brand-logo-img"
            />
          </Link>
        </div>

        {/* Center Main Slogan */}
        <div className="hero-content">
          <h1 className="hero-title">
            Empowering<br />
            Responders.<br />
            Protecting Lives.
          </h1>
          <p className="hero-description">
            Join the RELIEFCORE humanitarian network. Register as a citizen to request urgent aid and find safe shelters, or sign up as a verified field responder.
          </p>
        </div>

        {/* Bottom Metrics */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">12,430+</span>
            <span className="stat-label">PEOPLE</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">186 Active</span>
            <span className="stat-label">SUPPORT</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">94%</span>
            <span className="stat-label">RECOVER</span>
          </div>
        </div>
      </section>

      {/* Right Panel: Registration Form */}
      <section className="login-panel">
        <div style={{ height: '10px' }}></div>

        <div className="login-form-container">
          <Link to="/" className="auth-back-link" title="Return to Homepage">
            <ArrowLeft size={15} />
            <span>Back to Homepage</span>
          </Link>

          <div className="login-header">
            <div className="login-brand-badge">
              <Link to="/" title="Return to Homepage">
                <img
                  src={reliefcoreLogo}
                  alt="RELIEFCORE Humanitarian Operations"
                  className="login-brand-img"
                />
              </Link>
            </div>
            <h2 className="login-title">Create Account</h2>
            <p className="login-subtitle">Join the RELIEFCORE humanitarian network</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="field-group">
              <label className="field-label" htmlFor="reg-name-input">Full name</label>
              <div className="input-wrapper">
                <User className="input-icon-left" size={18} />
                <input
                  id="reg-name-input"
                  className="custom-input"
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
            <div className="field-group">
              <label className="field-label" htmlFor="reg-email-input">Email address</label>
              <div className="input-wrapper">
                <Mail className="input-icon-left" size={18} />
                <input
                  id="reg-email-input"
                  className="custom-input"
                  type="email"
                  placeholder="you@organisation.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="field-group">
              <label className="field-label" htmlFor="reg-password-input">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon-left" size={18} />
                <input
                  id="reg-password-input"
                  className="custom-input input-password-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="field-group">
              <label className="field-label" htmlFor="reg-phone-input">Phone number</label>
              <div className="input-wrapper">
                <Phone className="input-icon-left" size={18} />
                <input
                  id="reg-phone-input"
                  className="custom-input"
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Account Role Field */}
            <div className="field-group">
              <label className="field-label" htmlFor="reg-role-select">Select your primary role</label>
              <div className="input-wrapper">
                <Shield className="input-icon-left" size={18} />
                <select
                  id="reg-role-select"
                  className="custom-input custom-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: parseInt(e.target.value, 10) })}
                >
                  <option value={0}>Citizen / Displaced Person</option>
                  <option value={3}>Field Volunteer Responder</option>
                  <option value={1}>Humanitarian Coordinator</option>
                  <option value={2}>Logistics & Supply Manager</option>
                </select>
              </div>
              <div className="role-helper-note">
                {getRoleDescription(formData.role)}
              </div>
            </div>

            {/* Terms & Privacy Agreement */}
            <label className="terms-agreement-row">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                I agree to the Humanitarian Data Protection & Privacy protocols for emergency crisis response.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
              id="signup-submit-btn"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="divider-row">
            <div className="divider-line"></div>
            <span className="divider-text">or sign up with</span>
            <div className="divider-line"></div>
          </div>

          {/* Social Auth Buttons */}
          <div className="social-grid">
            <button
              type="button"
              className="btn-social"
              onClick={() => handleSocialRegister('Google')}
              id="google-signup-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              className="btn-social"
              onClick={() => handleSocialRegister('Microsoft')}
              id="microsoft-signup-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
              </svg>
              <span>Microsoft</span>
            </button>
          </div>

          {/* Already have an account? Sign in */}
          <div className="signup-prompt-row">
            <span>Already have an account?</span>
            <Link to="/login" className="signin-link" id="login-nav-link">
              Sign In
            </Link>
          </div>

          {/* Citizen Portal Link */}
          <div className="portal-help-row">
            <span>Need emergency help?</span>
            <Link to="/citizen/submit" className="portal-link">
              Citizen Portal
            </Link>
          </div>
        </div>

        {/* Language Selector */}
        <div className="lang-selector-container">
          <button
            type="button"
            className="lang-selector-btn"
            onClick={() => setShowLangMenu(!showLangMenu)}
            aria-expanded={showLangMenu}
          >
            <span>{selectedLang}</span>
            <ChevronDown size={14} />
          </button>

          {showLangMenu && (
            <div className="lang-dropdown-menu">
              {['English', 'සිංහල', 'தமிழ்', 'Español', 'Français'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`lang-option ${selectedLang === lang ? 'active' : ''}`}
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
      </section>
    </div>
  );
};

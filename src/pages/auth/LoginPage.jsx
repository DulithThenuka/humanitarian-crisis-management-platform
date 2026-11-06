import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { authService } from '../../services/authService';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import reliefcoreLogo from '../../assets/reliefcore-logo.png';
import './LoginPage.css';

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
        navigate('/coordinator/dashboard');
      } else {
        showAlert(response?.errors?.[0] || "Invalid credentials", "error");
      }
    } catch (err) {
      showAlert(err?.message || "Login failed", "error");
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
    <div className="login-wrapper">
      {/* Left Panel: Hero & Mission Overview */}
      <section className="login-hero">
        {/* Brand Header */}
        <div className="hero-brand">
          <img
            src={reliefcoreLogoWhite}
            alt="RELIEFCORE Humanitarian Operations"
            className="hero-brand-logo-img"
          />
        </div>

        {/* Center Main Slogan */}
        <div className="hero-content">
          <h1 className="hero-title">
            Stronger<br />
            Communities.<br />
            Safer Tomorrows.
          </h1>
          <p className="hero-description">
            AI-powered coordination for faster, smarter, and more transparent disaster response.
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

      {/* Right Panel: Authentication Form */}
      <section className="login-panel">
        <div style={{ height: '10px' }}></div>

        <div className="login-form-container">
          <div className="login-header">
            <div className="login-brand-badge">
              <img
                src={reliefcoreLogo}
                alt="RELIEFCORE Humanitarian Operations"
                className="login-brand-img"
              />
            </div>
            <h2 className="login-title">Welcome back</h2>
            <p className="login-subtitle">Secure access to humanitarian operations</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="field-group">
              <label className="field-label" htmlFor="email-input">Email address</label>
              <div className="input-wrapper">
                <Mail className="input-icon-left" size={18} />
                <input
                  id="email-input"
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
              <label className="field-label" htmlFor="password-input">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon-left" size={18} />
                <input
                  id="password-input"
                  className="custom-input input-password-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
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

            {/* Options Row: Remember Me & Forgot Password */}
            <div className="form-options-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <a href="#forgot-password" onClick={handleForgotPassword} className="forgot-password-link">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
              id="signin-btn"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="divider-row">
            <div className="divider-line"></div>
            <span className="divider-text">or continue with</span>
            <div className="divider-line"></div>
          </div>

          {/* Social Auth Buttons */}
          <div className="social-grid">
            <button
              type="button"
              className="btn-social"
              onClick={() => handleSocialLogin('Google')}
              id="google-signin-btn"
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
              onClick={() => handleSocialLogin('Microsoft')}
              id="microsoft-signin-btn"
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
              {['English', 'Español', 'Français', 'العربية'].map((lang) => (
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

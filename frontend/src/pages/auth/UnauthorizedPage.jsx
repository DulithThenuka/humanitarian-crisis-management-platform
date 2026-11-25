import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Home, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resolveAuthorizedRoute, getRoleDisplayTitle } from '../../routes/roleNavigation';
import { HumanAidLogo } from '../../components/common/HumanAidLogo';

export const UnauthorizedPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = user?.role;
  const roleTitle = getRoleDisplayTitle(userRole) || userRole || 'Authenticated User';
  const authorizedDashboard = resolveAuthorizedRoute(userRole);

  const handleReturnToDashboard = () => {
    navigate(authorizedDashboard, { replace: true });
  };

  const handleReturnHome = () => {
    navigate('/', { replace: true });
  };

  const handleSwitchAccount = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#060814] text-white flex flex-col justify-between font-display selection:bg-white/20 select-none">
      {/* Background radial gradient glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(239,68,68,0.08),transparent_70%)]" />

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-5 flex items-center justify-between border-b border-white/[0.06] backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-3">
          <HumanAidLogo variant="full" size="sm" withContainer={true} />
        </div>
        <button
          onClick={handleReturnHome}
          className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/80 transition-all border border-white/[0.08]"
        >
          <Home size={14} />
          <span>Home</span>
        </button>
      </header>

      {/* Main Centered Warning Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-3xl p-8 sm:p-10 bg-slate-900/60 backdrop-blur-2xl border border-red-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center">
          {/* Shield Icon with Amber/Red Glow */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <ShieldAlert size={32} className="text-red-400" />
          </div>

          {/* Security Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <span>403 • Restricted Operational Area</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Access Denied
          </h1>

          {/* Role Status or Authentication Context */}
          {isAuthenticated && user ? (
            <div className="w-full my-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-left">
              <div className="text-xs text-white/50 uppercase tracking-wider mb-1 font-semibold">
                Active Session
              </div>
              <div className="text-sm font-medium text-white flex items-center justify-between">
                <span>{roleTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  Signed In
                </span>
              </div>
              <div className="text-xs text-white/60 mt-0.5 truncate">
                {user?.email}
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/60 my-4 max-w-sm">
              You must be authenticated with authorized role credentials to access this humanitarian operational module.
            </p>
          )}

          <p className="text-sm text-white/70 max-w-sm mb-6 leading-relaxed">
            {isAuthenticated
              ? 'Your current role does not possess the permissions required to view or manage this workspace. Use the actions below to return to your authorized dashboard.'
              : 'Please sign in with authorized platform credentials to proceed.'}
          </p>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleReturnToDashboard}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <LayoutDashboard size={16} />
                  <span>Return to My Dashboard</span>
                </button>
                <button
                  onClick={handleReturnHome}
                  className="py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/80 font-medium text-sm border border-white/[0.1] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Home size={16} />
                  <span>Home</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login', { replace: true })}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <ArrowLeft size={16} />
                  <span>Sign In to Platform</span>
                </button>
                <button
                  onClick={handleReturnHome}
                  className="py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/80 font-medium text-sm border border-white/[0.1] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Home size={16} />
                  <span>Home</span>
                </button>
              </>
            )}
          </div>

          {/* Log Out / Switch Account Option */}
          {isAuthenticated && (
            <button
              onClick={handleSwitchAccount}
              className="mt-5 text-xs text-white/40 hover:text-white/80 flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={13} />
              <span>Sign in with a different account</span>
            </button>
          )}
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-white/40 border-t border-white/[0.04]">
        <span>HumanAid Security & Access Governance • All unauthorized attempts are securely audited</span>
      </footer>
    </div>
  );
};

export default UnauthorizedPage;

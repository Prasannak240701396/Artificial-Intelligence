import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserProfile } from '../types';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, LogIn, CheckCircle2, UserPlus } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

export const LoginPage: React.FC = () => {
  const { login, registeredAccounts } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- LOGIN FORM STATE (Clean & empty by default) ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // LOGIN SUBMIT HANDLER
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrim = loginEmail.trim().toLowerCase();
    if (!emailTrim || !loginPassword) {
      setErrorMessage('Please enter both Email ID and Password.');
      return;
    }

    // Find account in registered accounts
    const account = registeredAccounts.find(
      (a) => a.email.toLowerCase() === emailTrim
    );

    if (!account) {
      setErrorMessage(`Authentication Error: Account '${emailTrim}' is not registered. Click 'Sign Up Here' to create an account.`);
      return;
    }

    if (account.passwordHash !== loginPassword) {
      setErrorMessage('Authentication Error: Invalid Password for this email address.');
      return;
    }

    // Login successful
    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: account.fullName,
      email: account.email,
      batchNo: account.batchNo,
      role: account.role,
      roleTitle: account.roleTitle,
      hierarchyLevel: account.hierarchyLevel,
      department: account.department
    };

    login(profile);
    addToast('Authentication Success', `Logged in as ${profile.fullName} (${profile.roleTitle})`, 'success');
    navigate(profile.hierarchyLevel >= 2 ? '/' : '/project-workflow');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f8fafc] flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/15 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl w-full z-10 space-y-6">
        {/* Header Title & Unique Brand Logo */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <BrandLogo size="xl" showSubtitle={true} subtitleText="FINANCIAL INTELLIGENCE & GOVERNANCE PORTAL" />

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#151c2c] border border-[#232d42] text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Institutional Authentication Gateway</span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-mono">
            Enter your official email address and password to authenticate and open the application.
          </p>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/40 p-4 rounded-xl text-red-300 text-xs font-mono flex items-start space-x-3 shadow-xl">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* FORM CONTAINER CARD */}
        <div className="bg-[#151c2c] border border-[#232d42] rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                Official Email ID *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="Enter your registered email ID..."
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0d121d] border border-[#232d42] rounded text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0d121d] border border-[#232d42] rounded text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center space-x-2 font-mono"
              >
                <LogIn className="w-4 h-4" />
                <span>Authenticate & Open Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Link to Dedicated Sign Up Page */}
          <div className="pt-3 border-t border-[#232d42] text-center font-mono text-xs flex justify-between items-center">
            <span className="text-slate-400">Don't have an official account?</span>
            <Link to="/signup" className="text-cyan-400 font-bold hover:underline inline-flex items-center space-x-1">
              <UserPlus className="w-3.5 h-3.5 mr-1" />
              <span>Sign Up Here</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Sample Credentials Reference for Testing */}
        <div className="bg-[#111622] border border-[#232d42] rounded-xl p-4 space-y-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center justify-between text-slate-300 font-bold border-b border-[#232d42] pb-1.5">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sample Pre-Validated Accounts (Default Pass: Pass@1234):</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
            <button
              onClick={() => {
                setLoginEmail('ceo@ceo.finos.gov.in');
                setLoginPassword('Pass@1234');
              }}
              className="text-left bg-[#151c2c] hover:bg-[#1c2638] p-2 rounded border border-[#232d42] transition-colors"
            >
              <div className="text-emerald-400 font-bold">👔 CEO (Level 4 - Full Access)</div>
              <div className="text-slate-300">ceo@ceo.finos.gov.in</div>
            </button>
            <button
              onClick={() => {
                setLoginEmail('director@director.finos.gov.in');
                setLoginPassword('Pass@1234');
              }}
              className="text-left bg-[#151c2c] hover:bg-[#1c2638] p-2 rounded border border-[#232d42] transition-colors"
            >
              <div className="text-blue-400 font-bold">🏛️ Regional Director (Level 3 - Full Access)</div>
              <div className="text-slate-300">director@director.finos.gov.in</div>
            </button>
            <button
              onClick={() => {
                setLoginEmail('manager@manager.finos.gov.in');
                setLoginPassword('Pass@1234');
              }}
              className="text-left bg-[#151c2c] hover:bg-[#1c2638] p-2 rounded border border-[#232d42] transition-colors"
            >
              <div className="text-amber-400 font-bold">📋 Project Manager (Level 2 - Operations)</div>
              <div className="text-slate-300">manager@manager.finos.gov.in</div>
            </button>
            <button
              onClick={() => {
                setLoginEmail('site@site.finos.gov.in');
                setLoginPassword('Pass@1234');
              }}
              className="text-left bg-[#151c2c] hover:bg-[#1c2638] p-2 rounded border border-[#232d42] transition-colors"
            >
              <div className="text-cyan-400 font-bold">👷 Site Incharge (Level 1 - Field Lead)</div>
              <div className="text-slate-300">site@site.finos.gov.in</div>
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] font-mono text-slate-500">
          FINOS v1.0.0 Enterprise Governance Portal • Dedicated Authentication System
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, POSITION_LIST, RegisteredAccount } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole, UserProfile } from '../types';
import { ShieldCheck, UserCheck, Mail, Award, Layers, Building2, Lock, ArrowRight, AlertCircle, Info, UserPlus } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

export const SignUpPage: React.FC = () => {
  const { login, registeredAccounts, registerAccount } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // FORM STATE
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('PROJECT_MANAGER');
  const [email, setEmail] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');

  const currentRolePos = POSITION_LIST.find((p) => p.role === role) || POSITION_LIST[0];

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrim = email.trim().toLowerCase();

    if (!fullName || !emailTrim || !batchNo || !password) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Validation Error: Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Validation Error: Password must be at least 6 characters long.');
      return;
    }

    // DOMAIN VALIDATION: Check if email ends with allowed domains for the selected role
    const isValidDomain = currentRolePos.allowedDomains.some((d) => emailTrim.endsWith(`@${d}`));

    if (!isValidDomain) {
      setErrorMessage(
        `Domain Error: Registration for '${currentRolePos.title}' requires an official email ending with domain '@${currentRolePos.primaryDomain}'. (Allowed domains: ${currentRolePos.allowedDomains.map(d => `@${d}`).join(', ')})`
      );
      return;
    }

    // Check if email already registered
    const existing = registeredAccounts.find((a) => a.email.toLowerCase() === emailTrim);
    if (existing) {
      setErrorMessage(`Registration Error: An account with email '${emailTrim}' is already registered. Please log in.`);
      return;
    }

    // Register new account
    const newAccount: RegisteredAccount = {
      email: emailTrim,
      passwordHash: password,
      fullName: fullName,
      batchNo: batchNo.toUpperCase().startsWith('EMP') || batchNo.toUpperCase().startsWith('EXEC')
        ? batchNo.toUpperCase()
        : `EMP-${batchNo.toUpperCase()}`,
      role: role,
      roleTitle: currentRolePos.title,
      hierarchyLevel: currentRolePos.hierarchyLevel,
      department: department || currentRolePos.department
    };

    registerAccount(newAccount);

    // Auto login
    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: newAccount.fullName,
      email: newAccount.email,
      batchNo: newAccount.batchNo,
      role: newAccount.role,
      roleTitle: newAccount.roleTitle,
      hierarchyLevel: newAccount.hierarchyLevel,
      department: newAccount.department
    };

    login(profile);
    addToast('Account Created', `Registered & logged in as ${profile.fullName} (${profile.roleTitle})`, 'success');
    navigate(profile.hierarchyLevel >= 2 ? '/' : '/project-workflow');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f8fafc] flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/15 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl w-full z-10 space-y-6">
        {/* Header Title & Unique Brand Logo */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <BrandLogo size="xl" showSubtitle={true} subtitleText="FINANCIAL INTELLIGENCE & GOVERNANCE PORTAL" />

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#151c2c] border border-[#232d42] text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Create Institutional Governance Profile</span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-mono">
            Register your official officer profile with role-matched email domain validation.
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
          <form onSubmit={handleSignupSubmit} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                  Full Name *
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0d121d] border border-[#232d42] rounded text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Designation Position Select */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                  Designation Role Position *
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <select
                    value={role}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      setRole(newRole);
                      const pos = POSITION_LIST.find(p => p.role === newRole);
                      if (pos) {
                        setEmail(`officer@${pos.primaryDomain}`);
                      }
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0d121d] border border-[#232d42] rounded text-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none font-mono"
                  >
                    {POSITION_LIST.map((pos) => (
                      <option key={pos.role} value={pos.role}>
                        {pos.title} (Level {pos.hierarchyLevel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Domain Helper Banner */}
            <div className="bg-[#0d121d] p-3 rounded-lg border border-[#232d42] space-y-1">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase text-[10px]">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Required Email Domain for '{currentRolePos.title}':</span>
              </div>
              <div className="text-slate-300 text-[11px]">
                Email MUST end with domain: <code className="bg-[#151c2c] px-2 py-0.5 rounded text-emerald-400 font-bold">@{currentRolePos.primaryDomain}</code>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email Input */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                  Role Email ID *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder={`e.g. officer@${currentRolePos.primaryDomain}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0d121d] border border-[#232d42] rounded text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Employee Batch ID */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                  Employee ID / Batch No *
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-2026-8800"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0d121d] border border-[#232d42] rounded text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0d121d] border border-[#232d42] rounded text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0d121d] border border-[#232d42] rounded text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 uppercase">
                Department / Division
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={`Default: ${currentRolePos.department}`}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0d121d] border border-[#232d42] rounded text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center space-x-2 font-mono"
              >
                <UserPlus className="w-4 h-4" />
                <span>Validate Domain & Create Role Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Dedicated Link to Login Page */}
          <div className="pt-3 border-t border-[#232d42] text-center font-mono text-xs">
            <span className="text-slate-400">Already have an official account? </span>
            <Link to="/login" className="text-cyan-400 font-bold hover:underline inline-flex items-center space-x-1">
              <span>Log In Here</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

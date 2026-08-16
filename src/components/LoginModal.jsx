import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { LogIn, KeyRound, UserCheck, Shield, GraduationCap, Users, UserPlus, AlertCircle, Calendar, Eye, EyeOff, Mail, Building2, Phone, School, Sparkles } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login, registerUser, currentUser } = useTimetable();

  // Primary Portal Selector: 'school' (School Institution Platform) vs 'superadmin' (SaaS Master Platform)
  const [portalType, setPortalType] = useState('school');
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [superAdminLoginType, setSuperAdminLoginType] = useState('email'); // 'email' | 'mobile' | 'username'

  // Sign In State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Sign Up State (Compulsory Email & School Name)
  const [fullNameInput, setFullNameInput] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupSchoolName, setSignupSchoolName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState('teacher');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen && currentUser?.isLoggedIn) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(usernameInput, passwordInput);
    if (success) {
      setUsernameInput('');
      setPasswordInput('');
      if (onClose) onClose();
    } else {
      setErrorMsg('Invalid username or password! Please check your credentials and try again.');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMsg('Compulsory Email Address is required (e.g. principal@school.edu)!');
      return;
    }

    if (!signupSchoolName.trim()) {
      setErrorMsg('Compulsory School / Institution Name is required!');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match! Please verify your password entry.');
      return;
    }

    if (signupPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long!');
      return;
    }

    const success = registerUser({
      name: fullNameInput.trim(),
      email: signupEmail.trim().toLowerCase(),
      schoolName: signupSchoolName.trim(),
      username: signupUsername.trim().toLowerCase(),
      password: signupPassword.trim(),
      role: signupRole
    });

    if (success) {
      setFullNameInput('');
      setSignupEmail('');
      setSignupSchoolName('');
      setSignupUsername('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      if (onClose) onClose();
    }
  };

  const handleQuickLogin = (user, pass) => {
    setErrorMsg('');
    login(user, pass);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border-4 shadow-2xl p-6 sm:p-8 space-y-6 animate-fadeIn text-slate-900 dark:text-slate-100 max-h-[95vh] overflow-y-auto ${
        portalType === 'superadmin' ? 'border-amber-400 dark:border-amber-500 shadow-amber-500/20' : 'border-indigo-600 dark:border-indigo-500 shadow-indigo-500/20'
      }`}>
        
        {/* DEDICATED PORTAL SELECTOR LANDING SWITCHER */}
        <div className="space-y-2">
          <p className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase text-center">
            SELECT ACCESS PORTAL TYPE
          </p>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setPortalType('school');
                setAuthMode('signin');
                setErrorMsg('');
                setUsernameInput('');
                setPasswordInput('');
              }}
              className={`py-3 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                portalType === 'school'
                  ? 'bg-indigo-700 text-white shadow-lg border-2 border-indigo-900 scale-[1.02]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <School className="h-4 w-4 text-amber-300" />
              <span>🏫 School Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortalType('superadmin');
                setAuthMode('superadmin');
                setErrorMsg('');
                setUsernameInput('megabytes1@gmail.com');
                setPasswordInput('');
              }}
              className={`py-3 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                portalType === 'superadmin'
                  ? 'bg-amber-400 text-slate-950 shadow-lg border-2 border-amber-500 scale-[1.02]'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40'
              }`}
            >
              <Shield className="h-4 w-4 text-slate-950" />
              <span>👑 Super Admin Portal</span>
            </button>
          </div>
        </div>

        {/* PORTAL 1: SCHOOL INSTITUTION PORTAL */}
        {portalType === 'school' && (
          <div className="space-y-5 animate-fadeIn">
            {/* School Brand Header */}
            <div className="text-center space-y-2 p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800">
              <div className="h-12 w-12 rounded-2xl bg-indigo-700 text-white mx-auto flex items-center justify-center shadow-lg border-2 border-indigo-800">
                <School className="h-7 w-7 text-amber-300" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-indigo-200 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-200 font-black text-[9px] uppercase rounded-full tracking-wider">
                  🏫 Institutional Access
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-950 dark:text-amber-300 mt-1">
                  AUMTARA SAMAY
                </h2>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Dual-Shift School Timetable & DEO Compliance Platform
                </p>
              </div>
            </div>

            {/* School Auth Mode Toggle: Sign In vs Sign Up */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-300 dark:border-slate-700 gap-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-indigo-700 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In to School Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-indigo-700 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register New School</span>
              </button>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-400 text-rose-950 dark:text-rose-200 text-xs font-black flex items-center space-x-2 animate-shake">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-700" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* SCHOOL MODE 1: Sign In Form */}
            {authMode === 'signin' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                    School Username / Email
                  </label>
                  <div className="relative">
                    <UserCheck className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="e.g. admin or principal or teacher"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 border border-indigo-900 cursor-pointer hover:scale-[1.02]"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In to School Workspace</span>
                </button>

                {/* School Quick Demo Accounts */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block text-center">
                    ⚡ Instant School Demo Accounts
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('admin', 'admin123')}
                      className="py-2 bg-indigo-100 dark:bg-indigo-950/80 hover:bg-indigo-200 text-indigo-900 dark:text-indigo-200 font-black text-[10px] rounded-xl border border-indigo-300 dark:border-indigo-800 cursor-pointer truncate"
                      title="Login as School Timetable Admin"
                    >
                      🛡️ Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('principal', 'principal123')}
                      className="py-2 bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 text-purple-900 dark:text-purple-200 font-black text-[10px] rounded-xl border border-purple-300 dark:border-purple-800 cursor-pointer truncate"
                      title="Login as School Principal"
                    >
                      🎓 Principal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('teacher', 'teacher123')}
                      className="py-2 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-900 dark:text-emerald-200 font-black text-[10px] rounded-xl border border-emerald-300 dark:border-emerald-800 cursor-pointer truncate"
                      title="Login as Faculty Teacher"
                    >
                      👤 Teacher
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* SCHOOL MODE 2: Sign Up Form */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                    Full Name & Title <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder="e.g. Prof. Rajesh Kumar"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                    School / Institution Name <span className="text-rose-500 font-bold">* (Compulsory)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="h-4 w-4 absolute left-3.5 top-3 text-indigo-600" />
                    <input
                      type="text"
                      value={signupSchoolName}
                      onChange={(e) => setSignupSchoolName(e.target.value)}
                      placeholder="e.g. St. Xavier State & CBSE Academy"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                    Official Email Address <span className="text-rose-500 font-bold">* (Compulsory)</span>
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3.5 top-3 text-indigo-600" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. principal@school.edu"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                    Choose School Username <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="e.g. rajeshkumar"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                      Password <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Set password"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                      Confirm Password <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                    Account Role / Access Level
                  </label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  >
                    <option value="admin">🛡️ School Administrator (Full Control)</option>
                    <option value="hod">🎓 Department HOD (Approvals & Solver)</option>
                    <option value="faculty">👤 Faculty Teacher (Staff Duty View)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 border border-emerald-900 cursor-pointer hover:scale-[1.02]"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account & Sign In</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* PORTAL 2: DEDICATED SUPER ADMIN SAAS MASTER PORTAL */}
        {portalType === 'superadmin' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Super Admin Executive Header */}
            <div className="text-center space-y-2 p-4 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 rounded-2xl border-2 border-amber-400/60 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-amber-400 text-slate-950 mx-auto flex items-center justify-center shadow-lg border-2 border-amber-500">
                <Shield className="h-7 w-7 text-slate-950" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] uppercase rounded-full tracking-wider shadow">
                  👑 Exclusive Master SaaS Portal
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-amber-300 mt-1">
                  SUPER ADMIN PORTAL
                </h2>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Global Tenant Management, Subscription Billing & System Governance
                </p>
              </div>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-400 text-rose-950 dark:text-rose-200 text-xs font-black flex items-center space-x-2 animate-shake">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-700" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 3 Login Credential Type Options Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 text-center">
                CHOOSE SUPER ADMIN LOGIN TYPE (3 OPTIONS):
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-amber-300 dark:border-amber-700">
                <button
                  type="button"
                  onClick={() => {
                    setSuperAdminLoginType('email');
                    setUsernameInput('megabytes1@gmail.com');
                  }}
                  className={`py-2 text-[10px] font-black rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    superAdminLoginType === 'email'
                      ? 'bg-amber-400 text-slate-950 shadow border-2 border-amber-500 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5 text-indigo-900" />
                  <span>1. Email ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSuperAdminLoginType('mobile');
                    setUsernameInput('+91 99241 00585');
                  }}
                  className={`py-2 text-[10px] font-black rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    superAdminLoginType === 'mobile'
                      ? 'bg-amber-400 text-slate-950 shadow border-2 border-amber-500 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-900" />
                  <span>2. Mobile No</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSuperAdminLoginType('username');
                    setUsernameInput('superadmin');
                  }}
                  className={`py-2 text-[10px] font-black rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    superAdminLoginType === 'username'
                      ? 'bg-amber-400 text-slate-950 shadow border-2 border-amber-500 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5 text-purple-900" />
                  <span>3. Username</span>
                </button>
              </div>
            </div>

            {/* Super Admin Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleQuickLogin(usernameInput || 'megabytes1@gmail.com', passwordInput || 'admin123'); }} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                  {superAdminLoginType === 'email' && 'Option 1: Registered Master Email Address *'}
                  {superAdminLoginType === 'mobile' && 'Option 2: Registered Mobile Phone Number *'}
                  {superAdminLoginType === 'username' && 'Option 3: Master Admin Username *'}
                </label>
                <div className="relative">
                  {superAdminLoginType === 'email' && <Mail className="h-4 w-4 absolute left-3.5 top-3 text-amber-600" />}
                  {superAdminLoginType === 'mobile' && <Phone className="h-4 w-4 absolute left-3.5 top-3 text-amber-600" />}
                  {superAdminLoginType === 'username' && <UserCheck className="h-4 w-4 absolute left-3.5 top-3 text-amber-600" />}
                  
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder={
                      superAdminLoginType === 'email'
                        ? 'e.g. megabytes1@gmail.com'
                        : superAdminLoginType === 'mobile'
                        ? 'e.g. +91 99241 00585'
                        : 'e.g. superadmin'
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                  Master Security Password *
                </label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 absolute left-3.5 top-3 text-amber-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 border border-amber-400 cursor-pointer hover:scale-[1.02]"
              >
                <Shield className="h-4 w-4" />
                <span>Unlock Master SaaS Control Center</span>
              </button>
            </form>

            {/* Super Admin Quick Login Shortcuts */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block text-center">
                ⚡ 1-Click Super Admin Access Shortcuts
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('megabytes1@gmail.com', 'admin123')}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-[10px] rounded-xl border border-amber-500/40 truncate cursor-pointer"
                  title="Login with Email: megabytes1@gmail.com"
                >
                  📧 Email Login
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('+91 99241 00585', 'admin123')}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-[10px] rounded-xl border border-amber-500/40 truncate cursor-pointer"
                  title="Login with Mobile: +91 99241 00585"
                >
                  📱 Mobile Login
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('superadmin', 'admin123')}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-[10px] rounded-xl border border-amber-500/40 truncate cursor-pointer"
                  title="Login with Username: superadmin"
                >
                  👤 User Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

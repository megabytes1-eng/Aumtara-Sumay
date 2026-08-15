import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { LogIn, KeyRound, UserCheck, Shield, GraduationCap, Users, UserPlus, AlertCircle, Calendar, Eye, EyeOff, Mail, Building2, Phone } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login, registerUser, currentUser } = useTimetable();

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
      setErrorMsg('Invalid username or password! Please try again or create a new account.');
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border-2 border-indigo-500 shadow-2xl p-6 sm:p-8 space-y-5 animate-fadeIn text-slate-900 dark:text-slate-100 max-h-[95vh] overflow-y-auto">
        {/* Modal Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-indigo-700 text-white mx-auto flex items-center justify-center shadow-lg border-2 border-indigo-800">
            <Calendar className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-950 dark:text-amber-300">
              AUMTARA SAMAY
            </h2>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Dual-Shift Timetable Security & Access Portal
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up vs Super Admin */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-300 dark:border-slate-700 gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all flex items-center justify-center space-x-1 ${
              authMode === 'signin'
                ? 'bg-indigo-700 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all flex items-center justify-center space-x-1 ${
              authMode === 'signup'
                ? 'bg-indigo-700 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('superadmin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all flex items-center justify-center space-x-1 ${
              authMode === 'superadmin'
                ? 'bg-amber-500 text-slate-950 shadow font-black'
                : 'text-amber-600 dark:text-amber-400 hover:text-amber-700'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>👑 Super Admin</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-400 text-rose-950 dark:text-rose-200 text-xs font-black flex items-center space-x-2 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-700" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* MODE 1: Sign In Form */}
        {authMode === 'signin' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                Username
              </label>
              <div className="relative">
                <UserCheck className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter username"
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
                  placeholder="Enter password"
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
              <span>Sign In to Aumtara Samay</span>
            </button>

            <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Quick Super Admin Login</span>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@fhmis.com', 'admin123')}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer flex items-center justify-center space-x-2 border border-amber-300 transition-all hover:scale-105"
              >
                <Shield className="h-4 w-4" />
                <span>⚡ Super Admin Login (admin@fhmis.com / admin123)</span>
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: Sign Up (Create New User Account) Form */}
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
                <Building2 className="h-4 w-4 absolute left-3.5 top-3 text-amber-600" />
                <input
                  type="text"
                  value={signupSchoolName}
                  onChange={(e) => setSignupSchoolName(e.target.value)}
                  placeholder="e.g. St. Xavier State & CBSE Academy"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                Official Email Address <span className="text-rose-500 font-bold">* (Compulsory)</span>
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3.5 top-3 text-amber-600" />
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="e.g. principal@school.edu"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                Choose Username <span className="text-rose-500 font-bold">*</span>
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
                <option value="admin">🛡️ Administrator (Full Control)</option>
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

        {/* MODE 3: Dedicated Super Admin SaaS Portal */}
        {authMode === 'superadmin' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border-2 border-amber-400/50 space-y-1.5 text-center">
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] uppercase rounded-full tracking-wider">
                👑 Multi-Tenant Master Control Portal
              </span>
              <h3 className="font-black text-sm text-slate-950 dark:text-white uppercase tracking-tight">
                Super Admin Master Access
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                Exclusive portal for platform owner to manage all school subscriptions, module access, & pricing.
              </p>
            </div>

            {/* 3 Login Type Option Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Choose Login Credential Type (3 Options):
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setSuperAdminLoginType('email');
                    setUsernameInput('admin@fhmis.com');
                  }}
                  className={`py-2 text-[10px] font-black rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    superAdminLoginType === 'email'
                      ? 'bg-amber-400 text-slate-950 shadow border border-amber-500 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5 text-indigo-800 dark:text-amber-900" />
                  <span>1. Email ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSuperAdminLoginType('mobile');
                    setUsernameInput('+91 98765 43210');
                  }}
                  className={`py-2 text-[10px] font-black rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    superAdminLoginType === 'mobile'
                      ? 'bg-amber-400 text-slate-950 shadow border border-amber-500 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-800 dark:text-amber-900" />
                  <span>2. Mobile No</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSuperAdminLoginType('username');
                    setUsernameInput('superadmin');
                  }}
                  className={`py-2 text-[10px] font-black rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    superAdminLoginType === 'username'
                      ? 'bg-amber-400 text-slate-950 shadow border border-amber-500 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5 text-purple-800 dark:text-amber-900" />
                  <span>3. Username</span>
                </button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleQuickLogin(usernameInput || 'admin@fhmis.com', passwordInput || 'admin123'); }} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                  {superAdminLoginType === 'email' && 'Option 1: Master Email Address *'}
                  {superAdminLoginType === 'mobile' && 'Option 2: Registered Mobile Phone Number *'}
                  {superAdminLoginType === 'username' && 'Option 3: Master Admin Username *'}
                </label>
                <div className="relative">
                  {superAdminLoginType === 'email' && <Mail className="h-4 w-4 absolute left-3.5 top-3 text-amber-500" />}
                  {superAdminLoginType === 'mobile' && <Phone className="h-4 w-4 absolute left-3.5 top-3 text-amber-500" />}
                  {superAdminLoginType === 'username' && <UserCheck className="h-4 w-4 absolute left-3.5 top-3 text-amber-500" />}
                  
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder={
                      superAdminLoginType === 'email'
                        ? 'e.g. admin@fhmis.com'
                        : superAdminLoginType === 'mobile'
                        ? 'e.g. +91 98765 43210'
                        : 'e.g. superadmin'
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-amber-400/50 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                  Master Security Password *
                </label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 absolute left-3.5 top-3 text-amber-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-amber-400/50 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
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
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 border border-amber-300 cursor-pointer hover:scale-[1.02]"
              >
                <Shield className="h-4 w-4" />
                <span>Unlock Master SaaS Control Center</span>
              </button>
            </form>

            <div className="pt-2 space-y-1.5 text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                ⚡ 1-Click Fast Login Shortcuts
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@fhmis.com', 'admin123')}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-[10px] rounded-lg border border-amber-500/30 truncate cursor-pointer"
                  title="Login with Email: admin@fhmis.com"
                >
                  📧 Email Login
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('+91 98765 43210', 'admin123')}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-[10px] rounded-lg border border-amber-500/30 truncate cursor-pointer"
                  title="Login with Mobile: +91 98765 43210"
                >
                  📱 Mobile Login
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('superadmin', 'admin123')}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-[10px] rounded-lg border border-amber-500/30 truncate cursor-pointer"
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

import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { LogIn, KeyRound, UserCheck, Shield, GraduationCap, Users, UserPlus, AlertCircle, Calendar, Eye, EyeOff, Mail, Building2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login, registerUser, currentUser } = useTimetable();

  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);

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

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-300 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
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
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              authMode === 'signup'
                ? 'bg-indigo-700 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Create Account / Sign Up</span>
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

        {/* 1-Click Quick Demo Accounts Presets (No Passwords Displayed!) */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide text-center">
            🔑 Quick 1-Click Demo Profiles:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 transition-colors text-left space-y-0.5 cursor-pointer"
            >
              <div className="flex items-center space-x-1 font-black text-amber-900 dark:text-amber-200 text-[11px]">
                <Shield className="h-3.5 w-3.5 text-amber-600" />
                <span>Admin Staff</span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Role: Principal</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('hod', 'hod123')}
              className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-700 hover:bg-purple-100 transition-colors text-left space-y-0.5 cursor-pointer"
            >
              <div className="flex items-center space-x-1 font-black text-purple-900 dark:text-purple-200 text-[11px]">
                <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                <span>HOD Dept</span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Role: Dept Head</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('teacher', 'teacher123')}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition-colors text-left space-y-0.5 cursor-pointer"
            >
              <div className="flex items-center space-x-1 font-black text-emerald-900 dark:text-emerald-200 text-[11px]">
                <Users className="h-3.5 w-3.5 text-emerald-600" />
                <span>Faculty Teacher</span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Role: Faculty</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

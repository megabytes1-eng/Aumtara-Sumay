import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { LogIn, KeyRound, UserCheck, Shield, GraduationCap, Users, Eye, AlertCircle, Calendar } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login, defaultAccounts, currentUser } = useTimetable();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
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
      setErrorMsg('Invalid username or password! Please check default credentials below.');
    }
  };

  const handleQuickLogin = (user, pass) => {
    setErrorMsg('');
    login(user, pass);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border-2 border-indigo-500 shadow-2xl p-6 sm:p-8 space-y-6 animate-fadeIn text-slate-900 dark:text-slate-100 max-h-[95vh] overflow-y-auto">
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
              Dual-Shift Timetable Management Authentication Portal
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

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
              Username
            </label>
            <div className="relative">
              <UserCheck className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter username (e.g. admin)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (e.g. admin123)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                required
              />
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

        {/* 1-Click Quick Demo Accounts Presets */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide text-center">
            🔑 1-Click Quick Login Default Accounts:
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
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">admin / admin123</p>
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
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">hod / hod123</p>
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
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">teacher / teacher123</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

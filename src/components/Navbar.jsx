import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  Sparkles,
  Database,
  Calendar,
  Sun,
  Sunset,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  LogIn,
  LogOut
} from 'lucide-react';
import HelpGuideModal from './HelpGuideModal';

export default function Navbar() {
  const {
    institution,
    loadSampleData,
    runGenerator,
    solveAllConflicts,
    isGenerating,
    toast,
    setActiveTab,
    selectedShiftFilter,
    setSelectedShiftFilter,
    currentUser,
    logout,
    setIsLoginModalOpen
  } = useTimetable();

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b-2 border-slate-300 dark:border-slate-800 px-6 py-3 shadow-md">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Brand & Institution Info */}
        <div className="flex items-center space-x-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="h-11 w-11 rounded-2xl bg-indigo-700 dark:bg-indigo-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-indigo-800 overflow-hidden shrink-0">
              {institution.logoUrl ? (
                <img src={institution.logoUrl} alt="School Logo" className="h-full w-full object-contain bg-white p-0.5" />
              ) : (
                <Calendar className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center leading-none">
                <h1 className="font-black text-xl tracking-tight text-indigo-950 dark:text-amber-300 uppercase font-sans">
                  AUMTARA SAMAY
                </h1>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-black mt-1 leading-tight">
                {institution.name} ({institution.board})
              </p>
            </div>
          </div>
        </div>

        {/* Global Shift & Quick Actions */}
        <div className="flex items-center space-x-3">
          {/* Shift Selector */}
          <div className="flex items-center space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => {
                setSelectedShiftFilter('All Shifts');
                showToast('Switched to Combined Shifts view', 'info');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                selectedShiftFilter === 'All Shifts'
                  ? 'bg-indigo-700 text-white shadow-sm border border-indigo-800'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Combined Shifts</span>
            </button>

            <button
              onClick={() => {
                setSelectedShiftFilter('Morning Shift');
                showToast('Filtered view to Morning Shift (CBSE)', 'info');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                selectedShiftFilter === 'Morning Shift'
                  ? 'bg-amber-600 text-white shadow-sm border border-amber-700'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              <span>Morning Shift</span>
            </button>

            <button
              onClick={() => {
                setSelectedShiftFilter('Afternoon Shift');
                showToast('Filtered view to Afternoon Shift (State Board)', 'info');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                selectedShiftFilter === 'Afternoon Shift'
                  ? 'bg-purple-700 text-white shadow-sm border border-purple-800'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Sunset className="h-3.5 w-3.5" />
              <span>Afternoon Shift</span>
            </button>
          </div>

          {/* Solve Conflicts */}
          <button
            onClick={solveAllConflicts}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 border border-emerald-800"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="hidden sm:inline">Solve Conflicts</span>
          </button>

          {/* Run AI Generator */}
          <button
            onClick={runGenerator}
            disabled={isGenerating}
            className={`flex items-center space-x-1.5 px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md transition-all border border-indigo-900 ${
              isGenerating ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Solving Shifts...' : 'Run Dual-Shift AI'}</span>
          </button>

          {/* User Authentication Badge & Sign Out / Sign In Button */}
          {currentUser?.isLoggedIn ? (
            <div className="flex items-center space-x-2 pl-2 border-l-2 border-slate-300 dark:border-slate-700">
              <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700">
                <div className="h-6 w-6 rounded-full bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center uppercase">
                  {currentUser.username.slice(0, 2)}
                </div>
                <div className="hidden lg:block text-left leading-tight">
                  <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                    {currentUser.name.split(' ')[0]}
                  </p>
                  <span className="text-[9px] font-black uppercase text-indigo-700 dark:text-amber-300">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign Out of Aumtara Samay"
                className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl border border-rose-800 transition-all cursor-pointer shadow hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              title="Sign In to Aumtara Samay"
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl border border-emerald-800 transition-all cursor-pointer shadow hover:scale-105"
            >
              <LogIn className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`mt-2 p-3 rounded-xl flex items-center space-x-3 text-xs font-black border-2 animate-fadeIn ${
            toast.type === 'success'
              ? 'bg-emerald-100 border-emerald-500 text-emerald-950 dark:bg-emerald-950 dark:border-emerald-500 dark:text-emerald-200'
              : toast.type === 'warning'
              ? 'bg-amber-100 border-amber-500 text-amber-950 dark:bg-amber-950 dark:border-amber-500 dark:text-amber-200'
              : 'bg-indigo-100 border-indigo-500 text-indigo-950 dark:bg-indigo-950 dark:border-indigo-500 dark:text-indigo-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />}
          {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Help Guide Modal */}
      <HelpGuideModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </header>
  );
}

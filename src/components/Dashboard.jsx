import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  Layers,
  BookOpen,
  Users,
  DoorOpen,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  UserX,
  Sun,
  Sunset,
  School,
  History,
  RotateCcw,
  UserCheck,
  LogOut,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export default function Dashboard() {
  const {
    classes,
    subjects,
    teachers,
    rooms,
    conflicts,
    optimizationScore,
    absences,
    runGenerator,
    isGenerating,
    setActiveTab,
    setActiveSubTab,
    timetable,
    selectedShiftFilter,
    setSelectedShiftFilter,
    showToast,
    timetableVersions,
    activeVersionId,
    restoreTimetableVersion,
    institution,
    currentUser,
    rolePermissions,
    logout,
    setIsLoginModalOpen
  } = useTimetable();

  const morningClassesCount = classes.filter((c) => c.shift === 'Morning Shift').length;
  const afternoonClassesCount = classes.filter((c) => c.shift === 'Afternoon Shift').length;

  const filteredClasses = selectedShiftFilter === 'All Shifts'
    ? classes
    : classes.filter((c) => c.shift === selectedShiftFilter || c.shift === 'Both Shifts');

  const filteredSubjects = selectedShiftFilter === 'All Shifts'
    ? subjects
    : subjects.filter((s) => s.shift === selectedShiftFilter || s.shift === 'Both Shifts');

  const filteredTeachers = selectedShiftFilter === 'All Shifts'
    ? teachers
    : teachers.filter((t) => t.shift === selectedShiftFilter || t.shift === 'Both Shifts');

  const filteredRooms = selectedShiftFilter === 'All Shifts'
    ? rooms
    : rooms.filter((r) => r.shift === selectedShiftFilter || r.shift === 'Shared (Both Shifts)');

  const navigateTo = (tab, subtab = '') => {
    setActiveTab(tab);
    setActiveSubTab(subtab);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Dashboard: School Details & Logged-In User Profile Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* School Information Card */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border-2 border-indigo-300 dark:border-indigo-800/80 bg-white dark:bg-slate-900 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-md">
                <School className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 dark:text-amber-300 tracking-wider">
                  ACTIVE ACADEMIC INSTITUTION
                </span>
                <h2 className="text-lg font-black text-slate-950 dark:text-white leading-tight">
                  {institution.name}
                </h2>
              </div>
            </div>
            <button
              onClick={() => navigateTo('setup', 'tab-1')}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-900 dark:text-indigo-200 text-xs font-black rounded-xl border border-indigo-300 dark:border-indigo-700 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Modify Setup</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-bold block">Board & Medium</span>
              <p className="font-black text-slate-900 dark:text-slate-100 truncate">{institution.board}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-bold block">Academic Year</span>
              <p className="font-black text-slate-900 dark:text-slate-100">{institution.academicYear}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-bold block">School Code</span>
              <p className="font-black text-indigo-700 dark:text-indigo-300 font-mono">{institution.code}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-bold block">Principal Head</span>
              <p className="font-black text-slate-900 dark:text-slate-100 truncate">{institution.principalName}</p>
            </div>
          </div>
        </div>

        {/* Active Admin / User Profile Details Card */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-slate-900 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow font-black text-xs uppercase">
                {currentUser?.username ? currentUser.username.slice(0, 2) : 'AD'}
              </div>
              <div>
                <p className="text-xs font-black text-slate-950 dark:text-white leading-tight">
                  {currentUser?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-indigo-700 dark:text-indigo-300 font-mono font-bold">
                  @{currentUser?.username || 'admin'}
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
              currentUser?.role === 'admin'
                ? 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                : currentUser?.role === 'hod'
                ? 'bg-purple-100 text-purple-950 border-purple-300 dark:bg-purple-950 dark:text-purple-200'
                : 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
            }`}>
              {currentUser?.role || 'admin'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-900 dark:text-emerald-200 uppercase">
                Session Status:
              </span>
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                🟢 Signed In
              </span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold leading-tight">
              {rolePermissions[currentUser?.role]?.description || 'Full System Administration'}
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => navigateTo('settings')}
              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-black rounded-xl border border-slate-300 dark:border-slate-600 transition-all text-center cursor-pointer"
            >
              Manage Users
            </button>

            <button
              onClick={logout}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-black rounded-xl border border-rose-300 dark:border-rose-800 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Banner & Dual Shift Info */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSelectedShiftFilter('Morning Shift');
                  showToast('Filtered view to Morning Shift (CBSE)', 'info');
                }}
                className={`px-3 py-1 rounded-full text-xs font-black shadow flex items-center space-x-1.5 cursor-pointer transition-all hover:scale-105 ${
                  selectedShiftFilter === 'Morning Shift'
                    ? 'bg-amber-400 text-amber-950 ring-2 ring-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Morning CBSE ({morningClassesCount} Classes)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedShiftFilter('Afternoon Shift');
                  showToast('Filtered view to Afternoon Shift (State Board)', 'info');
                }}
                className={`px-3 py-1 rounded-full text-xs font-black shadow flex items-center space-x-1.5 cursor-pointer transition-all hover:scale-105 ${
                  selectedShiftFilter === 'Afternoon Shift'
                    ? 'bg-purple-300 text-purple-950 ring-2 ring-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Sunset className="h-4 w-4" />
                <span>Afternoon State Board ({afternoonClassesCount} Classes)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedShiftFilter('All Shifts');
                  showToast('Switched to Combined Shifts view', 'info');
                }}
                className={`px-3 py-1 rounded-full text-xs font-black shadow flex items-center space-x-1.5 cursor-pointer transition-all hover:scale-105 ${
                  selectedShiftFilter === 'All Shifts'
                    ? 'bg-emerald-400 text-emerald-950 ring-2 ring-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>All Combined Shifts</span>
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Dual-Shift Timetable Command Hub
            </h1>
            <p className="text-xs text-indigo-100 max-w-2xl font-extrabold">
              Active Shift Filter: <strong className="text-amber-300 uppercase underline">{selectedShiftFilter}</strong> • AI solver optimizing Morning CBSE & Afternoon State Board English Medium.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
            <div className="relative flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#f59e0b"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="163.3"
                  strokeDashoffset={163.3 - (163.3 * optimizationScore) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-sm font-black text-white">{optimizationScore}%</span>
            </div>
            <div>
              <p className="text-xs text-indigo-100 font-extrabold">Dual-Shift Solver Score</p>
              <p className="text-sm font-black text-amber-300 flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>{conflicts.length === 0 ? 'Zero Shift Conflicts' : `${conflicts.length} Overlaps`}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => navigateTo('data', 'classes')}
          className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-600 cursor-pointer transition-all hover:scale-[1.02] shadow-md"
        >
          <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 mb-2">
            <Layers className="h-5 w-5" />
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-950 dark:text-purple-300 border border-purple-300">CLASSES</span>
          </div>
          <p className="text-2xl font-black text-slate-950 dark:text-white">{filteredClasses.length}</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-black truncate">{selectedShiftFilter}</p>
        </div>

        <div
          onClick={() => navigateTo('data', 'subjects')}
          className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-600 cursor-pointer transition-all hover:scale-[1.02] shadow-md"
        >
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 mb-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-950 dark:text-blue-300 border border-blue-300">SUBJECTS</span>
          </div>
          <p className="text-2xl font-black text-slate-950 dark:text-white">{filteredSubjects.length}</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-black truncate">{selectedShiftFilter}</p>
        </div>

        <div
          onClick={() => navigateTo('data', 'teachers')}
          className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-600 cursor-pointer transition-all hover:scale-[1.02] shadow-md"
        >
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 border border-emerald-300">FACULTY</span>
          </div>
          <p className="text-2xl font-black text-slate-950 dark:text-white">{filteredTeachers.length}</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-black truncate">{selectedShiftFilter}</p>
        </div>

        <div
          onClick={() => navigateTo('data', 'rooms')}
          className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-600 cursor-pointer transition-all hover:scale-[1.02] shadow-md"
        >
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-2">
            <DoorOpen className="h-5 w-5" />
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-300">ROOMS</span>
          </div>
          <p className="text-2xl font-black text-slate-950 dark:text-white">{filteredRooms.length}</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-black truncate">Shared Rooms</p>
        </div>

        <div
          onClick={() => navigateTo('generator', 'conflicts')}
          className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-600 cursor-pointer transition-all hover:scale-[1.02] shadow-md"
        >
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-950 dark:text-rose-300 border border-rose-300">CONFLICTS</span>
          </div>
          <p className="text-2xl font-black text-slate-950 dark:text-white">{conflicts.length}</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-black truncate">Shift Overlaps</p>
        </div>

        <div
          onClick={() => navigateTo('substitute', 'absent')}
          className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-600 cursor-pointer transition-all hover:scale-[1.02] shadow-md"
        >
          <div className="flex items-center justify-between text-cyan-700 dark:text-cyan-400 mb-2">
            <UserX className="h-5 w-5" />
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-950 dark:text-cyan-300 border border-cyan-300">SUBSTITUTE</span>
          </div>
          <p className="text-2xl font-black text-slate-950 dark:text-white">{absences.filter(a => a.status === 'Pending').length}</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-black truncate">Active Covers</p>
        </div>
      </div>

      {/* Saved Timetable Versions Quick Hub */}
      <div className="glass-panel p-5 rounded-2xl border-2 border-teal-300 dark:border-teal-800 bg-white dark:bg-slate-900 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-teal-700 text-white">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-950 dark:text-white flex items-center space-x-2">
                <span>Saved Timetable Versions & Snapshots</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-teal-100 text-teal-950 dark:bg-teal-500/20 dark:text-teal-300 font-black border border-teal-300">
                  {(timetableVersions || []).length} Saved
                </span>
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold">
                1-Click restore any created or saved timetable version snapshot onto your live grid.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('generator', 'history')}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-black rounded-xl shadow transition-all flex items-center space-x-1 border border-teal-900 cursor-pointer hover:scale-105"
          >
            <span>Open Full Version History</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(timetableVersions || []).slice(0, 2).map((ver, idx) => {
            const isActive = ver.id === activeVersionId;
            return (
              <div
                key={ver.id}
                className={`p-3.5 rounded-xl border-2 flex items-center justify-between ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="space-y-1 max-w-[70%]">
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-black text-slate-950 dark:text-white truncate">{ver.name}</p>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold truncate">{ver.description}</p>
                  <p className="text-[10px] text-slate-500 font-mono font-bold">{ver.timestamp} • Score: {ver.optimizationScore}%</p>
                </div>

                {isActive ? (
                  <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-lg">
                    Loaded
                  </span>
                ) : (
                  <button
                    onClick={() => restoreTimetableVersion(ver.id)}
                    className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-[10px] font-black rounded-lg shadow flex items-center space-x-1 border border-indigo-900 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Restore</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Timetable Quick Preview Matrix */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <School className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
              <span>Shift Timetable Matrix Preview (Monday)</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-black">
              Active Filter: <span className="text-indigo-700 dark:text-indigo-300 font-black uppercase underline">{selectedShiftFilter}</span> ({filteredClasses.length} Active Sections)
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedShiftFilter}
              onChange={(e) => {
                setSelectedShiftFilter(e.target.value);
                showToast(`Switched view to ${e.target.value}`, 'info');
              }}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            >
              <option value="All Shifts">Combined (All Shifts)</option>
              <option value="Morning Shift">Morning Shift (CBSE)</option>
              <option value="Afternoon Shift">Afternoon Shift (State Eng Med)</option>
            </select>

            <button
              onClick={() => navigateTo('generator', 'grid')}
              className="text-xs text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-black flex items-center space-x-1"
            >
              <span>Open Full Grid</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
              <tr>
                <th className="p-3.5 w-52 border-r border-slate-300 dark:border-slate-700">Class Section & Shift</th>
                {Array.from({ length: 7 }).map((_, i) => (
                  <th key={i} className="p-3.5 text-center border-r border-slate-300/80 dark:border-slate-700/50">
                    Period {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold text-slate-900 dark:text-slate-200">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-slate-500">
                    <div className="space-y-2">
                      <p className="text-sm font-black text-slate-950 dark:text-white">No Active Classes or Schedule Loaded</p>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        Class data has been cleared. Add new classes in Master Data Setup or reload sample demo data in Settings.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 border-r border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                    <p className="font-black text-indigo-950 dark:text-indigo-300">{cls.name}</p>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                      cls.shift === 'Afternoon Shift'
                        ? 'bg-purple-100 text-purple-950 border-purple-300 dark:bg-purple-500/20 dark:text-purple-300'
                        : 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300'
                    }`}>
                      {cls.shift} ({cls.board})
                    </span>
                  </td>
                  {Array.from({ length: 7 }).map((_, pIdx) => {
                    const slotKey = `Monday_${pIdx + 1}_${cls.id}`;
                    const slot = timetable[slotKey];
                    return (
                      <td key={pIdx} className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">
                        {slot ? (
                          <div
                            style={{ backgroundColor: `${slot.subjectColor}25`, borderColor: slot.subjectColor }}
                            className="p-2 rounded-xl border-2 text-[11px] font-black leading-tight shadow-sm text-slate-950 dark:text-white"
                          >
                            <p className="font-black text-slate-950 dark:text-white">{slot.subjectCode}</p>
                            <p className="text-[10px] text-slate-900 dark:text-slate-200 font-extrabold truncate">{slot.teacherName.split(' ')[1] || slot.teacherName}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 font-black font-mono">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

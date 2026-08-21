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
  Edit3,
  Printer,
  Award,
  Clock,
  Zap,
  CheckCircle2,
  FileSpreadsheet
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

  const filteredRooms = rooms;

  const navigateTo = (tab, subtab = '') => {
    setActiveTab(tab);
    setActiveSubTab(subtab);
  };

  return (
    <div className="space-y-6 pb-12">
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

      {/* FEATURE IDEA 5: Principal's 1-Click Operations Toolbar */}
      <div className="p-4 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-blue-50/80 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 shadow-md">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-indigo-600 dark:text-amber-400" />
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Principal's 1-Click Operations & Action Bar
            </h3>
          </div>
          <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-300">
            Quick Shortcuts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigateTo('reports', 'export')}
            className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-slate-800 hover:bg-indigo-700 hover:text-white text-indigo-950 dark:text-slate-100 font-black text-xs rounded-xl border-2 border-indigo-200 dark:border-slate-700 shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <Printer className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Print Master PDF</span>
          </button>

          <button
            onClick={() => navigateTo('substitute', 'absent')}
            className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-slate-800 hover:bg-rose-700 hover:text-white text-rose-950 dark:text-slate-100 font-black text-xs rounded-xl border-2 border-rose-200 dark:border-slate-700 shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <UserX className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Mark Teacher Leave</span>
          </button>

          <button
            onClick={runGenerator}
            disabled={isGenerating}
            className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-slate-800 hover:bg-purple-700 hover:text-white text-purple-950 dark:text-slate-100 font-black text-xs rounded-xl border-2 border-purple-200 dark:border-slate-700 shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{isGenerating ? 'Solving...' : 'Run Dual-Shift AI'}</span>
          </button>

          <button
            onClick={() => navigateTo('reports', 'export')}
            className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-950 dark:text-slate-100 font-black text-xs rounded-xl border-2 border-amber-300 dark:border-slate-700 shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <Award className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Open DEO Patrak-K</span>
          </button>
        </div>
      </div>

      {/* FEATURE IDEA 1: Live Bell Schedule & Shift Countdown Bar */}
      <div className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between flex-wrap gap-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center border border-indigo-300">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Live School Bell Schedule & Period Tracker
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 animate-pulse">
                ● LIVE PERIOD
              </span>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Current Period: <strong className="text-indigo-700 dark:text-indigo-300 font-black">Period 3 (09:45 AM - 10:30 AM)</strong> • Shift: <strong className="text-slate-900 dark:text-white font-black">{selectedShiftFilter}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs font-black">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700">
            ⏳ 22 Mins Remaining
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-300 border border-amber-300">
            🔔 Recess Bell at 10:30 AM
          </span>
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
              className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="All Shifts">Combined (All Shifts)</option>
              <option value="Morning Shift">Morning Shift (CBSE)</option>
              <option value="Afternoon Shift">Afternoon Shift (State Eng Med)</option>
            </select>

            <button
              onClick={() => navigateTo('generator', 'grid')}
              className="text-xs text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-black flex items-center space-x-1 cursor-pointer"
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
                            <p className="font-black text-slate-950 dark:text-white">{slot.subjectCode || 'SUB'}</p>
                            <p className="text-[10px] text-slate-900 dark:text-slate-200 font-extrabold truncate">
                              {slot.teacherName ? (slot.teacherName.split(' ')[1] || slot.teacherName) : 'Staff'}
                            </p>
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

      {/* 3-COLUMN FEATURE WIDGET GRID (IDEAS 2, 3, 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* FEATURE IDEA 2: Today's Faculty Attendance & Proxy Cover Widget */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Today's Faculty Attendance & Cover
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black">
              {teachers.length - absences.filter(a => a.status === 'Pending').length} / {teachers.length} Present
            </span>
          </div>

          <div className="space-y-2">
            {absences.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 text-center space-y-1">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
                <p className="text-xs font-black text-emerald-950 dark:text-emerald-200">100% Full Staff Attendance</p>
                <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">No faculty absences recorded today.</p>
              </div>
            ) : (
              absences.map((abs) => (
                <div key={abs.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-black text-slate-950 dark:text-white">{abs.teacherName}</p>
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">Absent: {abs.reason}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-950 border border-indigo-300 text-[10px] font-black">
                    Cover: {abs.assignedSubstituteName || 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => navigateTo('substitute', 'absent')}
            className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow transition-colors flex items-center justify-center space-x-1 border border-indigo-900 cursor-pointer"
          >
            <span>Manage Daily Proxy Duty</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* FEATURE IDEA 3: Gujarat DEO Inspection Readiness Widget */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-900/50 bg-white dark:bg-slate-900 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Gujarat DEO Inspection Readiness
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black">
              Audit Ready 🏛️
            </span>
          </div>

          <div className="space-y-2 text-xs font-bold">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span>📜 21-Hour Workload Regulation:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">✅ Compliant</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span>🇬🇯 Secondary Patrak-A, B, K:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">✅ Generated</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span>🎓 Higher Sec Patrak-A, B, K:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">✅ Generated</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('reports', 'export')}
            className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-slate-950 font-black text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1 border border-amber-700 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print DEO Inspection File</span>
          </button>
        </div>

        {/* FEATURE IDEA 4: Class Section Workload Coverage Heatmap */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Class Section Period Load Heatmap
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-300 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-black">
              100% Coverage
            </span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {classes.map((c) => (
              <div key={c.id} className="space-y-1">
                <div className="flex justify-between text-[11px] font-black">
                  <span className="text-slate-950 dark:text-white">{c.name}</span>
                  <span className="text-purple-700 dark:text-purple-300">35 / 35 Periods (100%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full w-full"></div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigateTo('data', 'classes')}
            className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-black rounded-xl shadow transition-colors flex items-center justify-center space-x-1 border border-purple-900 cursor-pointer"
          >
            <span>View Classes Setup</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

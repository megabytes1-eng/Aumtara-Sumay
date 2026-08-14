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

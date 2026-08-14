import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  UserCheck,
  BarChart3,
  Search
} from 'lucide-react';

export default function FreeTools() {
  const {
    teachers,
    timetable,
    bellSchedule,
    activeSubTab,
    setActiveSubTab,
    selectedShiftFilter
  } = useTimetable();

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [searchTeacher, setSearchTeacher] = useState('');

  const currentSubTab = activeSubTab || 'free-finder';
  const days = bellSchedule.workingDays;
  const periodsCount = bellSchedule.periodsPerDay;

  // Filter teachers by shift
  const filteredTeachers = selectedShiftFilter === 'All Shifts'
    ? teachers
    : teachers.filter((t) => t.shift === selectedShiftFilter || t.shift === 'Both Shifts');

  // Compute busy teachers in selected day & period
  const busyTeacherIds = new Set();
  Object.values(timetable).forEach((slot) => {
    if (slot && slot.day === selectedDay && slot.period === Number(selectedPeriod)) {
      busyTeacherIds.add(slot.teacherId);
    }
  });

  // Free teachers in selected day & period
  const freeTeachers = filteredTeachers.filter(
    (t) => !busyTeacherIds.has(t.id) && t.name.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  // Compute teacher workload statistics
  const teacherLoadStats = teachers.map((teacher) => {
    const assignedSlots = Object.values(timetable).filter((s) => s && s.teacherId === teacher.id);
    const weeklyCount = assignedSlots.length;
    const loadPercentage = Math.round((weeklyCount / (teacher.maxWeekly || 24)) * 100);

    return {
      ...teacher,
      assignedCount: weeklyCount,
      loadPercentage: Math.min(loadPercentage, 100),
      isOverloaded: weeklyCount > (teacher.maxWeekly || 24)
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation Subtabs */}
      <div className="flex items-center space-x-2 border-b-2 border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('free-finder')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            currentSubTab === 'free-finder'
              ? 'bg-emerald-700 text-white shadow-md border border-emerald-800'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Free Teacher Finder</span>
        </button>

        <button
          onClick={() => setActiveSubTab('workload')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            currentSubTab === 'workload'
              ? 'bg-indigo-700 text-white shadow-md border border-indigo-800'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Teacher Workload Analyzer</span>
        </button>
      </div>

      {/* 1. Free Teacher Finder Screen */}
      {currentSubTab === 'free-finder' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Instant Free Teacher Lookup</span>
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
                  Select day and period to list all available faculty ready for arrangement or substitution.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-200">Day:</span>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-200">Period:</span>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                    className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none"
                  >
                    {Array.from({ length: periodsCount }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>Period {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search teacher..."
                    value={searchTeacher}
                    onChange={(e) => setSearchTeacher(e.target.value)}
                    className="pl-9 pr-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-extrabold">
              <p>
                Showing <strong>{freeTeachers.length}</strong> available teachers for <strong>{selectedDay}</strong> • <strong>Period {selectedPeriod}</strong>
              </p>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-black text-[10px]">
                {freeTeachers.length} Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {freeTeachers.map((tch) => (
                <div
                  key={tch.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 space-y-2 relative shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-950 dark:text-white text-xs">{tch.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-black">
                      FREE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">Off-day: {tch.offDay} • Shift: {tch.shift}</p>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] font-extrabold">
                    <span className="text-indigo-950 dark:text-indigo-300">Max Weekly: {tch.maxWeekly} hrs</span>
                    <span className="text-amber-950 dark:text-amber-300">Daily Cap: {tch.maxDaily} periods</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Teacher Workload Analyzer Screen */}
      {currentSubTab === 'workload' && (
        <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xl">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
              <span>Teacher Workload Balancing & Capacity Analysis</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
              Monitors weekly period allocations against assigned capacity limits to ensure fair distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {teacherLoadStats.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-300 dark:border-slate-700 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-black text-slate-950 dark:text-white text-xs">{t.name}</span>
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-bold ml-2">({t.shift})</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-black">
                    <span className="text-slate-900 dark:text-slate-200">
                      {t.assignedCount} / {t.maxWeekly} Periods
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        t.isOverloaded
                          ? 'bg-rose-100 text-rose-950 border-rose-300'
                          : t.loadPercentage >= 80
                          ? 'bg-amber-100 text-amber-950 border-amber-300'
                          : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      }`}
                    >
                      {t.loadPercentage}% Load
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600">
                  <div
                    style={{ width: `${t.loadPercentage}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      t.isOverloaded
                        ? 'bg-rose-600'
                        : t.loadPercentage >= 80
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { UserX, UserCheck, Plus, Check } from 'lucide-react';

export default function SubstituteManagement() {
  const {
    absences,
    addAbsence,
    assignSubstitute,
    teachers,
    activeSubTab,
    setActiveSubTab
  } = useTimetable();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [absenceDate, setAbsenceDate] = useState(new Date().toISOString().split('T')[0]);
  const [absenceReason, setAbsenceReason] = useState('Personal Leave');

  const currentTab = activeSubTab || 'absent';

  const handleRecordAbsence = (e) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    if (!teacher) return;

    addAbsence({
      teacherId: teacher.id,
      teacherName: teacher.name,
      date: absenceDate,
      day: 'Monday',
      periods: [1, 2, 3],
      reason: absenceReason
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subtab Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('absent')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'absent' ? 'bg-rose-700 text-white shadow-md border border-rose-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <UserX className="h-4 w-4" />
            <span>Absentee Tracker ({absences.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('finder')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'finder' ? 'bg-emerald-700 text-white shadow-md border border-emerald-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Smart Cover Finder</span>
          </button>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-black rounded-xl shadow-md transition-all border border-rose-900"
        >
          <Plus className="h-4 w-4" />
          <span>Mark Teacher Absent</span>
        </button>
      </div>

      {/* 1. Absentee Tracker List */}
      {currentTab === 'absent' && (
        <div className="glass-panel rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Absent Teacher</th>
                <th className="p-3.5">Date & Day</th>
                <th className="p-3.5">Affected Periods</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5">Assigned Substitute</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
              {absences.map((abs) => (
                <tr key={abs.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-black text-indigo-950 dark:text-white">{abs.teacherName}</td>
                  <td className="p-3.5 font-mono text-slate-800 dark:text-slate-300">{abs.date} ({abs.day})</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-950 dark:text-indigo-200 font-mono font-black border border-indigo-300">
                      Periods {abs.periods.join(', ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">{abs.reason}</td>
                  <td className="p-3.5 font-black text-emerald-700 dark:text-emerald-400">
                    {abs.assignedSubstituteName || 'None Assigned'}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        abs.status === 'Assigned'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300'
                      }`}
                    >
                      {abs.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setActiveSubTab('finder')}
                      className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-black rounded-lg shadow-sm"
                    >
                      Find Cover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Smart Cover Finder */}
      {currentTab === 'finder' && (
        <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xl">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>AI Multi-Subject Substitute Recommendation Engine</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
                Ranks available teachers using 3-Tier Match Scoring (Primary Specialization, Secondary Capabilities & Proxy Knowledge).
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-200 text-xs font-black rounded-lg border border-emerald-300">
              3-Tier Skill Match Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teachers.map((t, idx) => {
              // Compute Match Tier
              let tierBadge = (
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-950 border border-blue-300 dark:bg-blue-950 dark:text-blue-200 text-[10px] font-black">
                  ⭐ Tier 1: Primary Match (95%)
                </span>
              );
              if (idx === 1 || t.secondarySubjectIds?.length > 0) {
                tierBadge = (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 text-[10px] font-black">
                    🌿 Tier 2: Secondary Match (85%)
                  </span>
                );
              }
              if (idx >= 2) {
                tierBadge = (
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-950 border border-purple-300 dark:bg-purple-950 dark:text-purple-200 text-[10px] font-black">
                    🔄 Tier 3: Proxy Cover (65%)
                  </span>
                );
              }

              return (
                <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 space-y-3 shadow-sm hover:border-emerald-500 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">{t.name}</span>
                    {tierBadge}
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">
                    Primary Shift: {t.shift} • Off-day: {t.offDay}
                  </p>
                  <div className="text-[10px] space-y-1 font-mono">
                    <p className="text-blue-700 dark:text-blue-300 font-black">Main: {t.primarySubjectId || 'Core Faculty'}</p>
                    <p className="text-slate-500">Weekly Capacity: {t.maxWeekly} Periods</p>
                  </div>
                  <button
                    onClick={() => assignSubstitute(absences[0]?.id, t.id, t.name)}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition-colors flex items-center justify-center space-x-1 border border-emerald-900 shadow-sm cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Assign Substitute Cover</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Absence Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border-2 border-slate-300 dark:border-slate-700 p-6 space-y-4 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Record Teacher Absence</h3>
            <form onSubmit={handleRecordAbsence} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Select Faculty</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                >
                  {teachers.length === 0 ? (
                    <option value="">No Teachers Available</option>
                  ) : (
                    teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Absence Date</label>
                <input
                  type="date"
                  value={absenceDate}
                  onChange={(e) => setAbsenceDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Reason</label>
                <input
                  type="text"
                  value={absenceReason}
                  onChange={(e) => setAbsenceReason(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-black rounded-xl shadow border border-rose-900"
                >
                  Save Absence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

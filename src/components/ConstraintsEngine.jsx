import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import { Sliders, ShieldCheck, Zap, Save } from 'lucide-react';

export default function ConstraintsEngine() {
  const { constraints, setConstraints, showToast, runGenerator } = useTimetable();

  const handleToggle = (key) => {
    setConstraints((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Constraints & Rules engine updated!', 'success');
    runGenerator();
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center">
            <Sliders className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Institutional Constraints & Solver Rules</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
              Define hard constraints (zero-tolerance rules) and soft preferences for the AI scheduler engine.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Teacher Constraints */}
        <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <ShieldCheck className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
            <span>Faculty Load & Health Rules</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Max Continuous Teaching Periods</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold">Prevent teacher fatigue by capping consecutive periods.</p>
              </div>
              <input
                type="number"
                min="1"
                max="5"
                value={constraints.maxTeacherContinuousPeriods}
                onChange={(e) => setConstraints({ ...constraints, maxTeacherContinuousPeriods: parseInt(e.target.value) || 3 })}
                className="w-20 px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white text-center font-black"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/60 pt-3">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Avoid Teacher Off-Day Assignments</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold">Enforce designated off-days strictly.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('avoidTeacherOffDayAssignments')}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  constraints.avoidTeacherOffDayAssignments ? 'bg-indigo-700' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    constraints.avoidTeacherOffDayAssignments ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/60 pt-3">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Restrict Period 1 for Part-Time Faculty</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold">Do not assign first morning period to visiting staff.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('noFirstPeriodForPartTime')}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  constraints.noFirstPeriodForPartTime ? 'bg-indigo-700' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    constraints.noFirstPeriodForPartTime ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Subject & Lab Constraints */}
        <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Subject & Lab Scheduling Rules</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Enforce Double Period for Practical Labs</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold">Physics, Chem, CS labs allocated in 2 consecutive slots.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('labMustBeDoublePeriod')}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  constraints.labMustBeDoublePeriod ? 'bg-indigo-700' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    constraints.labMustBeDoublePeriod ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/60 pt-3">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Uniform Core Subject Weekly Distribution</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold">Spread Math & Science across Monday - Saturday.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('spreadCoreSubjectsUniformly')}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  constraints.spreadCoreSubjectsUniformly ? 'bg-indigo-700' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    constraints.spreadCoreSubjectsUniformly ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/60 pt-3">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Allow Overtime Assignment With Warning</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold">Permit extra periods if no other teacher available.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('allowOvertimeWithWarning')}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  constraints.allowOvertimeWithWarning ? 'bg-indigo-700' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    constraints.allowOvertimeWithWarning ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-lg flex items-center space-x-2 transition-all hover:scale-105 border border-indigo-900"
        >
          <Save className="h-4 w-4" />
          <span>Save Rules & Re-solve Timetable</span>
        </button>
      </div>
    </form>
  );
}

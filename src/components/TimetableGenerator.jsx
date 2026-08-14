import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { checkSlotConflict } from '../utils/generatorAlgorithm';
import {
  Sparkles,
  Grid,
  AlertOctagon,
  Filter,
  CheckCircle2,
  History,
  Save,
  RotateCcw,
  Trash2,
  Clock,
  Plus
} from 'lucide-react';

export default function TimetableGenerator() {
  const {
    timetable,
    conflicts,
    optimizationScore,
    isGenerating,
    runGenerator,
    solveAllConflicts,
    activeSubTab,
    setActiveSubTab,
    classes,
    teachers,
    rooms,
    bellSchedule,
    updateTimetableSlot,
    selectedShiftFilter,
    showToast,
    timetableVersions,
    saveTimetableVersion,
    restoreTimetableVersion,
    deleteTimetableVersion
  } = useTimetable();

  const [filterType, setFilterType] = useState('class');
  const [selectedEntityId, setSelectedEntityId] = useState(classes[0]?.id || '');
  const [dragOverSlotKey, setDragOverSlotKey] = useState(null);

  // Save Version Modal State
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [versionNameInput, setVersionNameInput] = useState('');
  const [versionDescInput, setVersionDescInput] = useState('');

  const currentTab = activeSubTab || 'grid';
  const days = bellSchedule.workingDays;
  const periodsCount = bellSchedule.periodsPerDay;

  const filteredClasses = selectedShiftFilter === 'All Shifts'
    ? classes
    : classes.filter((c) => c.shift === selectedShiftFilter || c.shift === 'Both Shifts');

  React.useEffect(() => {
    if (filterType === 'class') {
      const validClass = filteredClasses.find((c) => c.id === selectedEntityId) || filteredClasses[0];
      if (validClass && validClass.id !== selectedEntityId) {
        setSelectedEntityId(validClass.id);
      }
    } else if (filterType === 'teacher') {
      const filteredTeachers = selectedShiftFilter === 'All Shifts'
        ? teachers
        : teachers.filter((t) => t.shift === selectedShiftFilter || t.shift === 'Both Shifts');
      const validTeacher = filteredTeachers.find((t) => t.id === selectedEntityId) || filteredTeachers[0];
      if (validTeacher && validTeacher.id !== selectedEntityId) {
        setSelectedEntityId(validTeacher.id);
      }
    }
  }, [selectedShiftFilter, filterType, classes, teachers]);

  const handleDragStart = (e, slotKey) => {
    e.dataTransfer.setData('text/plain', slotKey);
  };

  const handleDragOver = (e, slotKey) => {
    e.preventDefault();
    setDragOverSlotKey(slotKey);
  };

  const handleDrop = (e, targetDay, targetPeriod) => {
    e.preventDefault();
    const sourceKey = e.dataTransfer.getData('text/plain');
    if (!sourceKey || !timetable[sourceKey]) return;

    const sourceSlot = timetable[sourceKey];
    const targetKey = `${targetDay}_${targetPeriod}_${selectedEntityId}`;

    const validation = checkSlotConflict({
      day: targetDay,
      period: targetPeriod,
      classId: selectedEntityId,
      teacherId: sourceSlot.teacherId,
      roomId: sourceSlot.roomId,
      timetable,
      currentSlotKey: sourceKey,
      shift: sourceSlot.shift
    });

    if (validation.hasConflict) {
      showToast(`Shift Conflict Warning: ${validation.warnings[0]}`, 'warning');
    }

    const updatedSource = {
      ...sourceSlot,
      day: targetDay,
      period: targetPeriod,
      isConflict: validation.hasConflict,
      conflictReason: validation.hasConflict ? validation.warnings.join(' ') : ''
    };

    const targetSlot = timetable[targetKey];
    if (targetSlot) {
      updateTimetableSlot(sourceKey, { ...targetSlot, day: sourceSlot.day, period: sourceSlot.period });
    } else {
      updateTimetableSlot(sourceKey, null);
    }

    updateTimetableSlot(targetKey, updatedSource);
    setDragOverSlotKey(null);
  };

  const handleOpenSaveModal = () => {
    setVersionNameInput(`v1.${timetableVersions.length} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    setVersionDescInput('User saved timetable revision snapshot.');
    setSaveModalOpen(true);
  };

  const handleConfirmSaveVersion = (e) => {
    e.preventDefault();
    saveTimetableVersion(versionNameInput, versionDescInput);
    setSaveModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subtab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('ai')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'ai'
                ? 'bg-purple-700 text-white shadow-md border border-purple-800'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Dual-Shift AI Solver</span>
          </button>

          <button
            onClick={() => setActiveSubTab('grid')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'grid'
                ? 'bg-indigo-700 text-white shadow-md border border-indigo-800'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>Drag & Drop Shift Matrix</span>
          </button>

          <button
            onClick={() => setActiveSubTab('conflicts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'conflicts'
                ? 'bg-rose-700 text-white shadow-md border border-rose-800'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <AlertOctagon className="h-4 w-4" />
            <span>Shift Conflict Inspector ({conflicts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'history'
                ? 'bg-teal-700 text-white shadow-md border border-teal-800'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <History className="h-4 w-4 text-amber-300" />
            <span>Saved Versions & History ({timetableVersions.length})</span>
          </button>
        </div>

        <button
          onClick={handleOpenSaveModal}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 border border-emerald-900 self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          <span>Save Version Snapshot</span>
        </button>
      </div>

      {/* 1. AI Solver Screen */}
      {currentTab === 'ai' && (
        <div className="glass-panel p-8 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-8 text-center max-w-3xl mx-auto my-6 shadow-xl">
          <div className="space-y-3">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-indigo-700 flex items-center justify-center shadow-lg border border-indigo-900">
              <Sparkles className={`h-8 w-8 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Dual-Shift AI Timetable Solver Engine
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-extrabold max-w-md mx-auto">
              Optimizes Morning CBSE & Afternoon State Board English Medium shifts with shared campus room occupancy.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-slate-100 dark:bg-slate-800/80 p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 text-left shadow-sm">
            <div>
              <p className="text-xs text-slate-700 dark:text-slate-400 font-black">Total Classes</p>
              <p className="text-xl font-black text-slate-950 dark:text-white">{classes.length} Sections</p>
            </div>
            <div>
              <p className="text-xs text-slate-700 dark:text-slate-400 font-black">Scheduled Slots</p>
              <p className="text-xl font-black text-indigo-700 dark:text-indigo-400">{Object.keys(timetable).length} Periods</p>
            </div>
            <div>
              <p className="text-xs text-slate-700 dark:text-slate-400 font-black">Solver Score</p>
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">{optimizationScore}% Score</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={runGenerator}
              disabled={isGenerating}
              className="px-6 py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-lg transition-all hover:scale-105 border border-indigo-900"
            >
              {isGenerating ? 'Solving Dual-Shift Algorithm...' : 'Re-Run Dual-Shift AI Solver'}
            </button>

            <button
              onClick={solveAllConflicts}
              disabled={isGenerating}
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-lg transition-all hover:scale-105 flex items-center space-x-1.5 border border-emerald-900"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Solve Conflict Periods (100% Free)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Drag & Drop Grid Matrix Screen */}
      {currentTab === 'grid' && (
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-black text-slate-900 dark:text-slate-200 flex items-center space-x-1">
                <Filter className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                <span>View Shift Matrix By:</span>
              </span>

              <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 border-2 border-slate-300 dark:border-slate-700">
                <button
                  onClick={() => { setFilterType('class'); setSelectedEntityId(filteredClasses[0]?.id || ''); }}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                    filterType === 'class' ? 'bg-indigo-700 text-white shadow' : 'text-slate-800 dark:text-slate-300 hover:text-slate-950'
                  }`}
                >
                  Class Section
                </button>
                <button
                  onClick={() => { setFilterType('teacher'); setSelectedEntityId(teachers[0]?.id || ''); }}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                    filterType === 'teacher' ? 'bg-indigo-700 text-white shadow' : 'text-slate-800 dark:text-slate-300 hover:text-slate-950'
                  }`}
                >
                  Teacher
                </button>
                <button
                  onClick={() => { setFilterType('room'); setSelectedEntityId(rooms[0]?.id || ''); }}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                    filterType === 'room' ? 'bg-indigo-700 text-white shadow' : 'text-slate-800 dark:text-slate-300 hover:text-slate-950'
                  }`}
                >
                  Room (Shared)
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-black text-slate-900 dark:text-slate-200">Select Item:</span>
              <select
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
              >
                {filterType === 'class' &&
                  (filteredClasses.length === 0 ? (
                    <option value="">No Classes Available</option>
                  ) : (
                    filteredClasses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.shift})</option>
                    ))
                  ))}
                {filterType === 'teacher' &&
                  (teachers.length === 0 ? (
                    <option value="">No Teachers Available</option>
                  ) : (
                    teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.shift})</option>
                    ))
                  ))}
                {filterType === 'room' &&
                  (rooms.length === 0 ? (
                    <option value="">No Rooms Available</option>
                  ) : (
                    rooms.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))
                  ))}
              </select>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-xl">
            {!selectedEntityId || (filterType === 'class' && filteredClasses.length === 0) || (filterType === 'teacher' && teachers.length === 0) || (filterType === 'room' && rooms.length === 0) ? (
              <div className="p-16 text-center text-slate-500 space-y-4">
                <Grid className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto" />
                <div>
                  <p className="text-base font-black text-slate-950 dark:text-white">No Timetable Matrix Data to Display</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold max-w-md mx-auto mt-1">
                    The dataset for this section has been cleared. Add new entries in Master Data Setup or reload sample demo data in Settings.
                  </p>
                </div>
                <button
                  onClick={loadSampleData}
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-lg border border-indigo-900 cursor-pointer"
                >
                  Reload Sample Demo Data
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5 font-black w-28 border-r border-slate-300 dark:border-slate-700 text-center">Day / Period</th>
                    {Array.from({ length: periodsCount }).map((_, pIdx) => (
                      <th key={pIdx} className="p-3.5 font-black text-center border-r border-slate-300/80 dark:border-slate-700/50 min-w-[120px]">
                        Period {pIdx + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold">
                {days.map((day) => (
                  <tr key={day} className="hover:bg-slate-100 dark:hover:bg-slate-900/30">
                    <td className="p-3.5 font-black text-slate-900 dark:text-slate-200 border-r border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-center">
                      {day}
                    </td>

                    {Array.from({ length: periodsCount }).map((_, pIdx) => {
                      const period = pIdx + 1;
                      let slotKey = '';
                      let slot = null;

                      if (filterType === 'class') {
                        slotKey = `${day}_${period}_${selectedEntityId}`;
                        slot = timetable[slotKey];
                      } else if (filterType === 'teacher') {
                        const entry = Object.entries(timetable || {}).find(
                          ([k, s]) => s && s.day === day && s.period === period && s.teacherId === selectedEntityId
                        );
                        if (entry) {
                          slotKey = entry[0];
                          slot = entry[1];
                        }
                      } else if (filterType === 'room') {
                        const entry = Object.entries(timetable || {}).find(
                          ([k, s]) => s && s.day === day && s.period === period && s.roomId === selectedEntityId
                        );
                        if (entry) {
                          slotKey = entry[0];
                          slot = entry[1];
                        }
                      }

                      const isDragOver = dragOverSlotKey === `${day}_${period}_${selectedEntityId}`;

                      return (
                        <td
                          key={pIdx}
                          onDragOver={(e) => handleDragOver(e, `${day}_${period}_${selectedEntityId}`)}
                          onDrop={(e) => handleDrop(e, day, period)}
                          className={`p-2 border-r border-slate-200 dark:border-slate-800/80 timetable-cell align-top transition-colors ${
                            isDragOver ? 'cell-drag-over' : ''
                          }`}
                        >
                          {slot ? (
                            <div
                              draggable
                              onDragStart={(e) => handleDragStart(e, slotKey)}
                              style={{ backgroundColor: `${slot.subjectColor}30`, borderColor: slot.isConflict ? '#f43f5e' : slot.subjectColor }}
                              className="p-2.5 rounded-xl border-2 text-xs shadow-md cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-all space-y-1 relative bg-white dark:bg-slate-800"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-black text-slate-950 dark:text-white text-xs tracking-tight">{slot.subjectCode}</span>
                                <span className={`px-1.5 py-0.5 text-[9px] font-black rounded border ${
                                  slot.shift === 'Afternoon Shift'
                                    ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-950 dark:text-purple-200 border-purple-300'
                                    : 'bg-amber-100 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 border-amber-300'
                                }`}>
                                  {slot.shift === 'Afternoon Shift' ? 'AFTERNOON' : 'MORNING'}
                                </span>
                              </div>
                              <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 truncate">{slot.subjectName}</p>
                              <div className="text-[10px] space-y-0.5 pt-1 border-t border-slate-200 dark:border-slate-700">
                                <p className="truncate font-extrabold text-indigo-950 dark:text-indigo-300">👤 {slot.teacherName}</p>
                                <p className="truncate font-extrabold text-amber-950 dark:text-amber-300">🚪 {slot.roomName}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full min-h-[75px] rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-700 transition-colors">
                              <span className="text-[10px] font-black">+ Free Slot</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
      )}

      {/* 3. Shift Conflict Inspector Screen */}
      {currentTab === 'conflicts' && (
        <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <AlertOctagon className="h-5 w-5 text-rose-700 dark:text-rose-400" />
              <span>Dual-Shift Conflict Inspector</span>
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={solveAllConflicts}
                disabled={isGenerating}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-1.5 transition-all border border-emerald-900"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Auto-Solve All Conflicts</span>
              </button>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-950 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300">
                {conflicts.length} Overlaps Flagged
              </span>
            </div>
          </div>

          {conflicts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <p className="text-base font-black text-slate-900 dark:text-white">Zero Shift Conflicts Detected!</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">Morning CBSE and Afternoon State Board schedules operate completely conflict-free.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conflicts.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-rose-300 dark:border-rose-500/40 flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-900 dark:text-white text-xs">{c.className} ({c.shift})</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-[10px] font-mono font-black border border-slate-300">
                        {c.day} • Period {c.period}
                      </span>
                    </div>
                    <p className="text-xs text-rose-700 dark:text-rose-400 font-black">{c.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Revision History & Saved Versions Screen */}
      {currentTab === 'history' && (
        <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white flex items-center space-x-2.5">
                <History className="h-6 w-6 text-teal-700 dark:text-teal-400" />
                <span>Timetable Revision History & Saved Versions</span>
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-black mt-1">
                Review, restore, or create new timetable version snapshots across Morning & Afternoon shifts.
              </p>
            </div>

            <button
              onClick={handleOpenSaveModal}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center space-x-2 border-2 border-emerald-900 cursor-pointer hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span>Save Current Grid Snapshot</span>
            </button>
          </div>

          {/* Quick Version Stats Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-800 space-y-1">
              <span className="text-[10px] font-black text-teal-900 dark:text-teal-300 uppercase tracking-wider">TOTAL VERSIONS IN SESSION</span>
              <p className="text-2xl font-black text-teal-950 dark:text-white">{(timetableVersions || []).length} Saved Snapshots</p>
              <p className="text-[11px] text-teal-800 dark:text-teal-300 font-bold">1-Click restore any historical timetable</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 space-y-1">
              <span className="text-[10px] font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">CURRENT ACTIVE GRID</span>
              <p className="text-base font-black text-emerald-950 dark:text-emerald-200 truncate">
                {((timetableVersions || []).find((v) => v.id === activeVersionId) || timetableVersions?.[0])?.name || 'Baseline Schedule'}
              </p>
              <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white border border-emerald-700">
                ACTIVE LOADED GRID
              </span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-300 dark:border-indigo-800 space-y-1">
              <span className="text-[10px] font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">LATEST SAVED VERSION</span>
              <p className="text-base font-black text-indigo-950 dark:text-indigo-200 truncate">
                {timetableVersions?.[0]?.name || 'v1.0 Baseline'}
              </p>
              <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white border border-indigo-700">
                MOST RECENT REVISION
              </span>
            </div>
          </div>

          {/* Version History Table */}
          <div className="glass-panel rounded-2xl border-2 border-slate-300 dark:border-slate-800 overflow-hidden shadow-xl">
            {(!timetableVersions || timetableVersions.length === 0) ? (
              <div className="text-center py-12 p-6 space-y-3">
                <History className="h-12 w-12 text-slate-400 mx-auto" />
                <p className="text-base font-black text-slate-900 dark:text-white">No timetable versions saved yet.</p>
                <button
                  onClick={handleOpenSaveModal}
                  className="px-4 py-2 bg-indigo-700 text-white text-xs font-black rounded-xl"
                >
                  Save First Version Snapshot
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Version Name & Status Badges</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5">Saved Date & Time</th>
                    <th className="p-3.5">Saved By (Role)</th>
                    <th className="p-3.5 text-center">Score %</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
                  {(timetableVersions || []).map((ver, idx) => {
                    if (!ver) return null;
                    const isActive = ver.id === activeVersionId;
                    const isLatest = idx === 0;
                    const isBaseline = ver.id === 'VER-001';

                    return (
                      <tr key={ver.id} className={`transition-colors ${isActive ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-l-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}>
                        <td className="p-3.5 font-black text-indigo-950 dark:text-white">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-black text-slate-950 dark:text-white">{ver.name}</p>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black border border-emerald-700 shadow-sm animate-pulse">
                                ACTIVE GRID
                              </span>
                            )}
                            {isLatest && !isActive && (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-black border border-indigo-700">
                                LATEST SAVED
                              </span>
                            )}
                            {isBaseline && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black border border-purple-700">
                                BASELINE PRESET
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono font-black">{ver.id} • {ver.slotsCount || 120} Periods Scheduled</span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 font-extrabold max-w-xs">{ver.description}</td>
                        <td className="p-3.5 font-mono text-slate-800 dark:text-slate-300 font-black">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3.5 w-3.5 text-indigo-600" />
                            <span>{ver.timestamp}</span>
                          </span>
                        </td>
                        <td className="p-3.5 font-black text-slate-900 dark:text-slate-200">{ver.createdBy}</td>
                        <td className="p-3.5 text-center font-black text-emerald-700 dark:text-emerald-400">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-[11px] font-black">
                            {ver.optimizationScore}%
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          {isActive ? (
                            <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-950 text-[11px] font-black rounded-lg border border-emerald-300 inline-flex items-center space-x-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                              <span>Currently Active Grid</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => restoreTimetableVersion(ver.id)}
                              className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-black rounded-lg shadow-sm flex items-center space-x-1 inline-flex border border-indigo-900 cursor-pointer hover:scale-105 transition-all"
                              title="Restore this timetable version onto grid"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>Restore Version</span>
                            </button>
                          )}

                          <button
                            onClick={() => deleteTimetableVersion(ver.id)}
                            className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 hover:text-rose-700 rounded-lg inline-flex cursor-pointer transition-colors"
                            title="Delete version from history"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Save Version Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border-2 border-slate-300 dark:border-slate-700 p-6 space-y-4 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Save className="h-5 w-5 text-emerald-700" />
              <span>Save Timetable Version Snapshot</span>
            </h3>

            <form onSubmit={handleConfirmSaveVersion} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Version Name / Title</label>
                <input
                  type="text"
                  value={versionNameInput}
                  onChange={(e) => setVersionNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. v1.1 - Added Grade 9A Substitute"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Version Description / Notes</label>
                <input
                  type="text"
                  value={versionDescInput}
                  onChange={(e) => setVersionDescInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Swapped Physics lab to period 4"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow border border-emerald-900 flex items-center space-x-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Version Snapshot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

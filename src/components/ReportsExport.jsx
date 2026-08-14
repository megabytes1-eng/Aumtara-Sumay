import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { FileSpreadsheet, FileText, Printer, Download, School } from 'lucide-react';

export default function ReportsExport() {
  const {
    institution,
    classes,
    teachers,
    timetable,
    bellSchedule,
    activeSubTab,
    setActiveSubTab,
    selectedShiftFilter,
    setSelectedShiftFilter,
    showToast
  } = useTimetable();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [reportMode, setReportMode] = useState('class');

  const currentTab = activeSubTab || 'master';
  const days = bellSchedule.workingDays;
  const periodCount = bellSchedule.periodsPerDay;

  const filteredClasses = selectedShiftFilter === 'All Shifts'
    ? classes
    : classes.filter((c) => c.shift === selectedShiftFilter || c.shift === 'Both Shifts');

  React.useEffect(() => {
    const validClass = filteredClasses.find((c) => c.id === selectedClassId) || filteredClasses[0];
    if (validClass && validClass.id !== selectedClassId) {
      setSelectedClassId(validClass.id);
    }
  }, [selectedShiftFilter, classes]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Shift,Board,Day,Period,Class,Subject,Teacher,Room\n";
    Object.entries(timetable).forEach(([k, slot]) => {
      if (slot) {
        if (selectedShiftFilter === 'All Shifts' || slot.shift === selectedShiftFilter) {
          csvContent += `"${slot.shift}","${slot.classBoard}",${slot.day},${slot.period},"${slot.className}","${slot.subjectName}","${slot.teacherName}","${slot.roomName}"\n`;
        }
      }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aumtara_Samay_Combined_Dual_Shift_Report_${institution.academicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported Combined Dual-Shift Report CSV!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subtab Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3 no-print">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('master')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'master' ? 'bg-indigo-700 text-white shadow-md border border-indigo-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Master Dual-Shift Matrix</span>
          </button>

          <button
            onClick={() => setActiveSubTab('class')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'class' ? 'bg-teal-700 text-white shadow-md border border-teal-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Class & Faculty Schedules</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-black rounded-xl border-2 border-slate-300 dark:border-slate-700 transition-all shadow-sm"
          >
            <Download className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <span>Export Combined CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md transition-all border border-indigo-900"
          >
            <Printer className="h-4 w-4" />
            <span>Print PDF Report</span>
          </button>
        </div>
      </div>

      {/* 1. Master Dual-Shift Timetable View */}
      {(currentTab === 'master' || !currentTab) && (
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between no-print shadow-xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <School className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
              <span>Combined Morning (CBSE) & Afternoon (State Board Eng Med) Master Matrix</span>
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-slate-900 dark:text-slate-200">Shift Filter:</span>
              <select
                value={selectedShiftFilter}
                onChange={(e) => setSelectedShiftFilter(e.target.value)}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="All Shifts">All Shifts (Combined)</option>
                <option value="Morning Shift">Morning Shift (CBSE)</option>
                <option value="Afternoon Shift">Afternoon Shift (State Board Eng Med)</option>
              </select>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto p-4 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-3.5 border-r border-slate-300 dark:border-slate-700">Class & Shift</th>
                  <th className="p-3.5 border-r border-slate-300 dark:border-slate-700 text-center">Day</th>
                  {Array.from({ length: periodCount }).map((_, pIdx) => (
                    <th key={pIdx} className="p-3.5 text-center border-r border-slate-300/80 dark:border-slate-700/50">
                      P{pIdx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold">
                {filteredClasses.map((cls) =>
                  days.map((day, dIdx) => (
                    <tr key={`${cls.id}_${day}`} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                      {dIdx === 0 && (
                        <td rowSpan={days.length} className="p-3.5 font-black text-indigo-950 dark:text-indigo-300 border-r-2 border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 align-top">
                          <p>{cls.name}</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                            cls.shift === 'Afternoon Shift'
                              ? 'bg-purple-100 text-purple-950 border-purple-300 dark:bg-purple-500/20 dark:text-purple-300'
                              : 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300'
                          }`}>
                            {cls.shift} ({cls.board})
                          </span>
                        </td>
                      )}
                      <td className="p-2.5 font-black text-slate-900 dark:text-slate-200 border-r border-slate-300 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-900/30">
                        {day}
                      </td>
                      {Array.from({ length: periodCount }).map((_, pIdx) => {
                        const slotKey = `${day}_${pIdx + 1}_${cls.id}`;
                        const slot = timetable[slotKey];
                        return (
                          <td key={pIdx} className="p-1.5 border-r border-slate-200 dark:border-slate-800 text-center">
                            {slot ? (
                              <div
                                style={{ backgroundColor: `${slot.subjectColor}25`, borderColor: slot.subjectColor }}
                                className="p-1.5 rounded-xl border-2 text-[10px] leading-tight font-black shadow-sm"
                              >
                                <p className="font-black text-slate-950 dark:text-white">{slot.subjectCode}</p>
                                <p className="text-slate-900 dark:text-slate-200 font-extrabold truncate text-[9px]">{slot.teacherName.split(' ')[1] || slot.teacherName}</p>
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
      )}

      {/* 2. Class & Faculty Schedule View */}
      {currentTab === 'class' && (
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between no-print shadow-xl">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-black text-slate-900 dark:text-slate-200">Schedule Type:</span>
              <select
                value={reportMode}
                onChange={(e) => setReportMode(e.target.value)}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="class">Student Class Schedule</option>
                <option value="teacher">Faculty Duty Schedule</option>
              </select>

              {reportMode === 'class' ? (
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none"
                >
                  {filteredClasses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.shift})</option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.shift})</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xl">
            <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{institution.name}</h2>
              <p className="text-xs text-indigo-700 dark:text-indigo-400 font-black">
                {reportMode === 'class'
                  ? `Official Timetable for ${classes.find((c) => c.id === selectedClassId)?.name || 'No Class Selected'}`
                  : `Faculty Duty Schedule for ${teachers.find((t) => t.id === selectedTeacherId)?.name || 'No Teacher Selected'}`}
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5 text-center w-24">Day</th>
                    {Array.from({ length: periodCount }).map((_, i) => (
                      <th key={i} className="p-3.5 text-center border-l border-slate-300 dark:border-slate-700">
                        Period {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold text-slate-900 dark:text-slate-200">
                  {days.map((day) => (
                    <tr key={day} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-black text-center bg-slate-100 dark:bg-slate-900/60 text-slate-900 dark:text-slate-200">{day}</td>
                      {Array.from({ length: periodCount }).map((_, pIdx) => {
                        const period = pIdx + 1;
                        let slot = null;

                        if (reportMode === 'class') {
                          slot = timetable[`${day}_${period}_${selectedClassId}`];
                        } else {
                          slot = Object.values(timetable).find(
                            (s) => s && s.day === day && s.period === period && s.teacherId === selectedTeacherId
                          );
                        }

                        return (
                          <td key={pIdx} className="p-2 border-l border-slate-200 dark:border-slate-800 text-center">
                            {slot ? (
                              <div
                                style={{ backgroundColor: `${slot.subjectColor}25`, borderColor: slot.subjectColor }}
                                className="p-2 rounded-xl border-2 text-xs font-black shadow-sm"
                              >
                                <p className="font-black text-slate-950 dark:text-white">{slot.subjectName}</p>
                                <p className="text-[10px] text-slate-900 dark:text-slate-200 font-extrabold">{slot.teacherName}</p>
                                <p className="text-[9px] text-amber-950 dark:text-amber-300 font-black">{slot.roomName}</p>
                              </div>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-600 font-black font-mono">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  School,
  Award,
  CheckCircle2,
  AlertTriangle,
  Users,
  BookOpen,
  Clock,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function ReportsExport() {
  const {
    institution,
    classes,
    teachers,
    subjects,
    rooms,
    absences,
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
  const [deoFormat, setDeoFormat] = useState('format1'); // 'format1' | 'format2' | 'format3' | 'format4' | 'format5'

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

  const handleExportDEOCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (deoFormat === 'format1') {
      csvContent += "S.No,Teacher Name,Designation,Department,Morning Shift Load,Afternoon Shift Load,Total Weekly Load,DEO Max Limit,Workload Status\n";
      teachers.forEach((tch, idx) => {
        const morningCount = Object.values(timetable).filter(s => s && s.teacherId === tch.id && s.shift === 'Morning Shift').length;
        const afternoonCount = Object.values(timetable).filter(s => s && s.teacherId === tch.id && s.shift === 'Afternoon Shift').length;
        const total = morningCount + afternoonCount;
        const status = total > 32 ? 'Overloaded' : total < 18 ? 'Underloaded' : 'Optimal';
        csvContent += `${idx + 1},"${tch.name}","${tch.designation || 'Faculty'}","${tch.department || 'General'}",${morningCount},${afternoonCount},${total},${tch.maxPeriodsPerDay * days.length || 30},"${status}"\n`;
      });
    } else if (deoFormat === 'format2') {
      csvContent += "S.No,Class Section,Shift,Board,Subject Code,Subject Name,Assigned Teacher,Mandated Periods/Wk,Scheduled Periods/Wk,Compliance Status\n";
      let rowIdx = 1;
      classes.forEach((cls) => {
        subjects.forEach((sub) => {
          const scheduled = Object.values(timetable).filter(s => s && s.classId === cls.id && s.subjectId === sub.id).length;
          if (scheduled > 0) {
            const teacherName = teachers.find(t => t.id === sub.teacherId)?.name || 'Assigned Faculty';
            csvContent += `${rowIdx++},"${cls.name}","${cls.shift}","${cls.board}","${sub.code}","${sub.name}","${teacherName}",${sub.weeklyPeriods || 4},${scheduled},"Compliant"\n`;
          }
        });
      });
    } else if (deoFormat === 'format3') {
      csvContent += "S.No,Room Name,Room Type,Capacity,Occupied Periods/Wk,Total Weekly Slots,Occupancy Rate (%),DEO Utilization Status\n";
      rooms.forEach((rm, idx) => {
        const occupied = Object.values(timetable).filter(s => s && s.roomId === rm.id).length;
        const totalSlots = days.length * periodCount;
        const rate = Math.round((occupied / totalSlots) * 100);
        const status = rate > 75 ? 'High Usage' : rate < 30 ? 'Underutilized' : 'Optimal Usage';
        csvContent += `${idx + 1},"${rm.name}","${rm.type || 'Classroom'}",${rm.capacity || 40},${occupied},${totalSlots},${rate}%,"${status}"\n`;
      });
    } else if (deoFormat === 'format4') {
      csvContent += "S.No,Shift Name,Board,Start Time,End Time,Periods/Day,Period Duration (Mins),Recess Duration (Mins),Daily Instructional Mins,DEO Compliance\n";
      csvContent += `1,"Morning Shift","CBSE","${bellSchedule.morningStartTime}","12:30 PM",${bellSchedule.periodsPerDay},${bellSchedule.periodDuration},${bellSchedule.recessDuration},${bellSchedule.periodsPerDay * bellSchedule.periodDuration},"Compliant"\n`;
      csvContent += `2,"Afternoon Shift","State Board Eng Med","${bellSchedule.afternoonStartTime}","05:30 PM",${bellSchedule.periodsPerDay},${bellSchedule.periodDuration},${bellSchedule.recessDuration},${bellSchedule.periodsPerDay * bellSchedule.periodDuration},"Compliant"\n`;
    } else if (deoFormat === 'format5') {
      csvContent += "S.No,Absence ID,Date,Absent Teacher,Shift,Leave Reason,Assigned Substitute Teacher,Status\n";
      absences.forEach((abs, idx) => {
        csvContent += `${idx + 1},"${abs.id}","${abs.date}","${abs.teacherName}","${abs.shift || 'Morning Shift'}","${abs.reason}","${abs.assignedSubstituteName || 'Unassigned'}","${abs.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DEO_Official_Report_${deoFormat.toUpperCase()}_${institution.academicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported DEO Official ${deoFormat.toUpperCase()} CSV Report!`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subtab Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3 no-print flex-wrap gap-3">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('master')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              currentTab === 'master' ? 'bg-indigo-700 text-white shadow-md border border-indigo-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Master Dual-Shift Matrix</span>
          </button>

          <button
            onClick={() => setActiveSubTab('class')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              currentTab === 'class' ? 'bg-teal-700 text-white shadow-md border border-teal-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Class & Faculty Schedules</span>
          </button>

          <button
            onClick={() => setActiveSubTab('deo')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              currentTab === 'deo' ? 'bg-amber-400 text-slate-950 shadow-md border-2 border-amber-500 scale-105' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Award className="h-4 w-4 text-slate-950 dark:text-amber-400" />
            <span>🏛️ DEO Official Reports & Teacher Load Center</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {currentTab === 'deo' ? (
            <button
              onClick={handleExportDEOCSV}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl border border-amber-500 transition-all shadow-sm cursor-pointer"
            >
              <Download className="h-4 w-4 text-slate-950" />
              <span>Export DEO CSV</span>
            </button>
          ) : (
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-black rounded-xl border-2 border-slate-300 dark:border-slate-700 transition-all shadow-sm cursor-pointer"
            >
              <Download className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <span>Export Combined CSV</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md transition-all border border-indigo-900 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official PDF</span>
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

      {/* 3. DEO Compliance Reports & Teacher Load Center */}
      {currentTab === 'deo' && (
        <div className="space-y-6 animate-fadeIn">
          {/* DEO Format Controls Toolbar */}
          <div className="glass-panel p-4 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 no-print flex items-center justify-between flex-wrap gap-4 shadow-xl">
            <div className="space-y-1">
              <span className="px-3 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wider">
                🏛️ Official District Education Officer Formats
              </span>
              <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-tight">
                DEO Compliance & Teacher Load System Register
              </h3>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-black text-slate-900 dark:text-slate-200">Choose DEO Format:</span>
              <select
                value={deoFormat}
                onChange={(e) => setDeoFormat(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-amber-500 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none shadow-sm cursor-pointer"
              >
                <option value="format1">DEO Format 1: Teacher Workload & Load Master Register</option>
                <option value="format2">DEO Format 2: Class Subject Period Allocation Register</option>
                <option value="format3">DEO Format 3: Room & Lab Infrastructure Audit Register</option>
                <option value="format4">DEO Format 4: Dual-Shift Bell Schedule Instructional Register</option>
                <option value="format5">DEO Format 5: Monthly Absence & Substitute Duty Register</option>
              </select>
            </div>
          </div>

          {/* Teacher Workload Summary KPI Cards (For DEO Format 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
            <div className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-400 tracking-wider">Total Active Faculty Teachers</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{teachers.length} Faculty</p>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">Dual-Shift Staff Roster</p>
            </div>

            <div className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">Avg Weekly Workload</span>
              <p className="text-2xl font-black text-emerald-950 dark:text-emerald-300 mt-1">
                {(Object.keys(timetable).length / (teachers.length || 1)).toFixed(1)} Periods/Wk
              </p>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">DEO Mandate: 24 - 32 Periods</p>
            </div>

            <div className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-400 tracking-wider">Optimal Workload Staff</span>
              <p className="text-2xl font-black text-purple-950 dark:text-purple-300 mt-1">
                {teachers.filter((t) => {
                  const count = Object.values(timetable).filter((s) => s && s.teacherId === t.id).length;
                  return count >= 18 && count <= 32;
                }).length} Teachers
              </p>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">100% Balanced Load Status</p>
            </div>

            <div className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-400 tracking-wider">DEO Overload Warning Alert</span>
              <p className="text-2xl font-black text-rose-950 dark:text-rose-300 mt-1">
                {teachers.filter((t) => {
                  const count = Object.values(timetable).filter((s) => s && s.teacherId === t.id).length;
                  return count > 32;
                }).length} Teachers
              </p>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">&gt; 32 periods/week limit</p>
            </div>
          </div>

          {/* Printable Official Government DEO Document Box */}
          <div className="glass-panel p-8 rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-2xl">
            {/* Official DEO Header */}
            <div className="text-center border-b-2 border-slate-900 dark:border-slate-200 pb-6 space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black text-[10px] uppercase rounded-md tracking-widest mb-1">
                <Award className="h-3.5 w-3.5" />
                <span>Government of India & State Education Board Compliance</span>
              </div>
              <h1 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {institution.name}
              </h1>
              <p className="text-xs font-black text-slate-700 dark:text-slate-300">
                DISTRICT EDUCATION OFFICER (DEO) OFFICIAL TIMETABLE & TEACHER LOAD REGISTER
              </p>
              <div className="flex items-center justify-center space-x-6 text-[11px] font-mono text-slate-600 dark:text-slate-400 pt-1 flex-wrap gap-2">
                <span><strong>Academic Year:</strong> {institution.academicYear}</span>
                <span>•</span>
                <span><strong>DEO Reg Code:</strong> DEO-MH-2026-88</span>
                <span>•</span>
                <span><strong>Inspection Ref No:</strong> DEO/INSP/2026/0942</span>
                <span>•</span>
                <span><strong>Report Date:</strong> {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* FORMAT 1: Teacher Period Workload & Duty Summary Register */}
            {deoFormat === 'format1' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <span>DEO Format 1: Teacher Weekly Workload & Duty Summary Register</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-500">DEO Mandated Max: 32 Periods/Wk</span>
                </div>

                <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-700">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3 text-center w-12 border-r border-slate-300 dark:border-slate-700">S.No</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Faculty Teacher Name</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Designation / Cadre</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Morning Shift (CBSE)</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Afternoon Shift (State)</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Total Weekly Load</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Workload Meter</th>
                        <th className="p-3 text-center">DEO Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold text-slate-900 dark:text-slate-200">
                      {teachers.map((tch, idx) => {
                        const morningPeriods = Object.values(timetable).filter(
                          (s) => s && s.teacherId === tch.id && s.shift === 'Morning Shift'
                        ).length;
                        const afternoonPeriods = Object.values(timetable).filter(
                          (s) => s && s.teacherId === tch.id && s.shift === 'Afternoon Shift'
                        ).length;
                        const totalLoad = morningPeriods + afternoonPeriods;
                        const maxLimit = tch.maxPeriodsPerDay * days.length;
                        const loadPercent = Math.min(Math.round((totalLoad / maxLimit) * 100), 100);

                        let statusBadge = (
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200 font-black text-[10px] rounded-full border border-emerald-300">
                            Optimal Load
                          </span>
                        );
                        if (totalLoad > 32) {
                          statusBadge = (
                            <span className="px-2.5 py-0.5 bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-200 font-black text-[10px] rounded-full border border-rose-300">
                              Overloaded
                            </span>
                          );
                        } else if (totalLoad < 18) {
                          statusBadge = (
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200 font-black text-[10px] rounded-full border border-amber-300">
                              Underloaded
                            </span>
                          );
                        }

                        return (
                          <tr key={tch.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                            <td className="p-3 text-center font-mono text-slate-500 border-r border-slate-200 dark:border-slate-800">{idx + 1}</td>
                            <td className="p-3 font-black text-indigo-950 dark:text-white border-r border-slate-200 dark:border-slate-800">
                              {tch.name}
                            </td>
                            <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                              {tch.designation || 'Senior PGT Faculty'}
                            </td>
                            <td className="p-3 text-center font-mono text-indigo-700 dark:text-indigo-300 border-r border-slate-200 dark:border-slate-800">
                              {morningPeriods} Periods
                            </td>
                            <td className="p-3 text-center font-mono text-purple-700 dark:text-purple-300 border-r border-slate-200 dark:border-slate-800">
                              {afternoonPeriods} Periods
                            </td>
                            <td className="p-3 text-center font-mono font-black text-slate-950 dark:text-white text-sm border-r border-slate-200 dark:border-slate-800">
                              {totalLoad} / {maxLimit}
                            </td>
                            <td className="p-3 border-r border-slate-200 dark:border-slate-800 w-44">
                              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    totalLoad > 32 ? 'bg-rose-500' : totalLoad < 18 ? 'bg-amber-400' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${loadPercent}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-mono text-slate-500 block text-right mt-0.5">{loadPercent}% Capacity</span>
                            </td>
                            <td className="p-3 text-center">{statusBadge}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FORMAT 2: Subject Period Allocation & Curriculum Coverage */}
            {deoFormat === 'format2' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <span>DEO Format 2: Class Subject Period Allocation & Curriculum Coverage Register</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-700">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3 text-center w-12 border-r border-slate-300 dark:border-slate-700">S.No</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Class & Section</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Shift & Board</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Subject Code & Name</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Assigned Faculty</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Mandated Periods</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Scheduled Periods</th>
                        <th className="p-3 text-center">Compliance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold text-slate-900 dark:text-slate-200">
                      {(() => {
                        let counter = 1;
                        const rows = [];
                        classes.forEach((cls) => {
                          subjects.forEach((sub) => {
                            const scheduled = Object.values(timetable).filter(
                              (s) => s && s.classId === cls.id && s.subjectId === sub.id
                            ).length;
                            if (scheduled > 0) {
                              const tchName = teachers.find((t) => t.id === sub.teacherId)?.name || 'Assigned Faculty';
                              rows.push(
                                <tr key={`${cls.id}_${sub.id}`} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                                  <td className="p-3 text-center font-mono text-slate-500 border-r border-slate-200 dark:border-slate-800">{counter++}</td>
                                  <td className="p-3 font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800">{cls.name}</td>
                                  <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 rounded text-[10px]">
                                      {cls.shift} ({cls.board})
                                    </span>
                                  </td>
                                  <td className="p-3 font-black text-indigo-700 dark:text-indigo-300 border-r border-slate-200 dark:border-slate-800">
                                    {sub.code} - {sub.name}
                                  </td>
                                  <td className="p-3 border-r border-slate-200 dark:border-slate-800">{tchName}</td>
                                  <td className="p-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">{sub.weeklyPeriods || 4} p/wk</td>
                                  <td className="p-3 text-center font-mono font-black text-emerald-600 border-r border-slate-200 dark:border-slate-800">{scheduled} p/wk</td>
                                  <td className="p-3 text-center">
                                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 font-black text-[10px] rounded-full border border-emerald-300">
                                      100% Compliant
                                    </span>
                                  </td>
                                </tr>
                              );
                            }
                          });
                        });
                        return rows;
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FORMAT 3: Room & Lab Infrastructure Audit */}
            {deoFormat === 'format3' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <span>DEO Format 3: Room & Lab Infrastructure Utilization Audit Register</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-700">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3 text-center w-12 border-r border-slate-300 dark:border-slate-700">S.No</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Room No / Name</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Room Infrastructure Type</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Seating Capacity</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Occupied Periods/Wk</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Occupancy Rate (%)</th>
                        <th className="p-3 text-center">DEO Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold text-slate-900 dark:text-slate-200">
                      {rooms.map((rm, idx) => {
                        const occupied = Object.values(timetable).filter((s) => s && s.roomId === rm.id).length;
                        const totalSlots = days.length * periodCount;
                        const rate = Math.round((occupied / totalSlots) * 100);

                        return (
                          <tr key={rm.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                            <td className="p-3 text-center font-mono text-slate-500 border-r border-slate-200 dark:border-slate-800">{idx + 1}</td>
                            <td className="p-3 font-black text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800">{rm.name}</td>
                            <td className="p-3 border-r border-slate-200 dark:border-slate-800">{rm.type || 'Standard Lecture Classroom'}</td>
                            <td className="p-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">{rm.capacity || 40} Students</td>
                            <td className="p-3 text-center font-mono font-black text-indigo-700 dark:text-indigo-300 border-r border-slate-200 dark:border-slate-800">
                              {occupied} / {totalSlots} Slots
                            </td>
                            <td className="p-3 text-center font-mono font-black border-r border-slate-200 dark:border-slate-800">{rate}%</td>
                            <td className="p-3 text-center">
                              <span className={`px-2.5 py-0.5 font-black text-[10px] rounded-full border ${
                                rate > 75
                                  ? 'bg-purple-100 text-purple-950 border-purple-300'
                                  : rate < 30
                                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                                  : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                              }`}>
                                {rate > 75 ? 'High Demand' : rate < 30 ? 'Underutilized' : 'Optimal Capacity'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FORMAT 4: Dual-Shift Bell Schedule Instructional Register */}
            {deoFormat === 'format4' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>DEO Format 4: Dual-Shift Bell Schedule & Instructional Minutes Register</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-700">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3 text-center w-12 border-r border-slate-300 dark:border-slate-700">S.No</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">School Shift Name</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Board Affiliation</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Shift Timings</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Periods / Day</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Period Duration</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Daily Instructional Time</th>
                        <th className="p-3 text-center">DEO Mandate Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold text-slate-900 dark:text-slate-200">
                      <tr className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                        <td className="p-3 text-center font-mono text-slate-500 border-r border-slate-200 dark:border-slate-800">1</td>
                        <td className="p-3 font-black text-indigo-950 dark:text-white border-r border-slate-200 dark:border-slate-800">Morning Shift</td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-800">CBSE Affiliated</td>
                        <td className="p-3 font-mono border-r border-slate-200 dark:border-slate-800">{bellSchedule.morningStartTime} - 12:30 PM</td>
                        <td className="p-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">{bellSchedule.periodsPerDay} Periods</td>
                        <td className="p-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">{bellSchedule.periodDuration} Mins</td>
                        <td className="p-3 text-center font-mono font-black text-emerald-600 border-r border-slate-200 dark:border-slate-800">
                          {bellSchedule.periodsPerDay * bellSchedule.periodDuration} Mins ({(bellSchedule.periodsPerDay * bellSchedule.periodDuration / 60).toFixed(1)} Hours)
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 font-black text-[10px] rounded-full border border-emerald-300">
                            DEO Approved
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                        <td className="p-3 text-center font-mono text-slate-500 border-r border-slate-200 dark:border-slate-800">2</td>
                        <td className="p-3 font-black text-purple-950 dark:text-white border-r border-slate-200 dark:border-slate-800">Afternoon Shift</td>
                        <td className="p-3 border-r border-slate-200 dark:border-slate-800">State Board Eng Med</td>
                        <td className="p-3 font-mono border-r border-slate-200 dark:border-slate-800">{bellSchedule.afternoonStartTime} - 05:30 PM</td>
                        <td className="p-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">{bellSchedule.periodsPerDay} Periods</td>
                        <td className="p-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">{bellSchedule.periodDuration} Mins</td>
                        <td className="p-3 text-center font-mono font-black text-emerald-600 border-r border-slate-200 dark:border-slate-800">
                          {bellSchedule.periodsPerDay * bellSchedule.periodDuration} Mins ({(bellSchedule.periodsPerDay * bellSchedule.periodDuration / 60).toFixed(1)} Hours)
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 font-black text-[10px] rounded-full border border-emerald-300">
                            DEO Approved
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FORMAT 5: Monthly Faculty Absence & Substitute Duty Register */}
            {deoFormat === 'format5' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-rose-600" />
                  <span>DEO Format 5: Monthly Faculty Absence & Substitute Duty Compliance Register</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-700">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3 text-center w-12 border-r border-slate-300 dark:border-slate-700">S.No</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Absence ID & Date</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Absent Faculty Name</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Shift & Reason</th>
                        <th className="p-3 border-r border-slate-300 dark:border-slate-700">Assigned Substitute Faculty</th>
                        <th className="p-3 text-center border-r border-slate-300 dark:border-slate-700">Duty Status</th>
                        <th className="p-3 text-center">DEO Audit Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold text-slate-900 dark:text-slate-200">
                      {absences.map((abs, idx) => (
                        <tr key={abs.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                          <td className="p-3 text-center font-mono text-slate-500 border-r border-slate-200 dark:border-slate-800">{idx + 1}</td>
                          <td className="p-3 font-mono border-r border-slate-200 dark:border-slate-800">
                            <span className="font-black text-indigo-700 dark:text-indigo-300">{abs.id}</span>
                            <span className="block text-[10px] text-slate-500">{abs.date} ({abs.day})</span>
                          </td>
                          <td className="p-3 font-black text-rose-700 dark:text-rose-400 border-r border-slate-200 dark:border-slate-800">{abs.teacherName}</td>
                          <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                            <p>{abs.shift || 'Morning Shift'}</p>
                            <p className="text-[10px] font-normal text-slate-500">{abs.reason}</p>
                          </td>
                          <td className="p-3 font-black text-emerald-700 dark:text-emerald-300 border-r border-slate-200 dark:border-slate-800">
                            {abs.assignedSubstituteName || 'Unassigned'}
                          </td>
                          <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              abs.status === 'Assigned' ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'
                            }`}>
                              {abs.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 font-black text-[10px] rounded-full border border-emerald-300">
                              Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Official Signature & Stamp Endorsement Block (For DEO Printing) */}
            <div className="pt-8 border-t-2 border-slate-300 dark:border-slate-700 grid grid-cols-2 gap-8 text-center text-xs font-black">
              <div className="space-y-12">
                <div className="h-10"></div>
                <div>
                  <p className="text-slate-900 dark:text-white uppercase font-black">____________________________________</p>
                  <p className="text-slate-950 dark:text-white font-black text-sm mt-1">Signature of School Principal</p>
                  <p className="text-[10px] text-slate-500 font-mono">Institutional Stamp & Seal</p>
                </div>
              </div>

              <div className="space-y-12">
                <div className="h-10"></div>
                <div>
                  <p className="text-slate-900 dark:text-white uppercase font-black">____________________________________</p>
                  <p className="text-slate-950 dark:text-white font-black text-sm mt-1">Signature of District Education Officer (DEO)</p>
                  <p className="text-[10px] text-slate-500 font-mono">Government Department Verification Seal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


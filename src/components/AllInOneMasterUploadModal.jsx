import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, Sparkles, Layers, Users, BookOpen, School, DoorClosed } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';

export default function AllInOneMasterUploadModal({ isOpen, onClose }) {
  const { bulkImportAllMasterData, showToast } = useTimetable();

  const [rawText, setRawText] = useState('');
  const [activePreviewTab, setActivePreviewTab] = useState('teachers');
  const [parsedData, setParsedData] = useState({
    teachers: [],
    subjects: [],
    classes: [],
    rooms: []
  });
  const [isParsed, setIsParsed] = useState(false);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  // Generate Sample All-in-One Master Template
  const downloadMasterTemplate = () => {
    const templateContent = `=== TEACHERS ===
Name,Email,Phone,PrimarySubject,SecondarySubjects,Shift,MaxDaily,MaxWeekly
Prof. Vikram Sarabhai,sarabhai@school.edu,9876543210,SUB-101,"SUB-102,SUB-103",Afternoon Shift,5,24
Dr. APJ Abdul Kalam,kalam@school.edu,9876543211,SUB-102,"SUB-101",Morning Shift,5,24
Smt. Savitribai Phule,savitri@school.edu,9876543212,SUB-103,,Morning Shift,4,20

=== SUBJECTS ===
Code,Name,Category,WeeklyPeriods,MaxDailyPeriods,IsLab,RoomType,Color,Shift
SUB-101,Mathematics,Core,6,1,false,Classroom,#3b82f6,Afternoon Shift
SUB-102,Physics & Science,Core,5,1,true,Science Lab,#10b981,Morning Shift
SUB-103,Gujarati Literature,Language,4,1,false,Classroom,#8b5cf6,Morning Shift

=== CLASSES ===
Name,Grade,Section,Board,Shift,Capacity
Std 9-A (State),9,A,State Board,Afternoon Shift,45
Std 10-A (CBSE),10,A,CBSE,Morning Shift,40
Std 10-B (CBSE),10,B,CBSE,Morning Shift,38

=== ROOMS ===
Name,Building,Floor,Type,Capacity,Shift
Room 101,Main Block,1st Floor,Classroom,45,Shared (Both Shifts)
Science Lab,Science Block,Ground Floor,Science Lab,35,Morning Shift
Computer Lab 1,IT Wing,2nd Floor,Computer Lab,40,Shared (Both Shifts)
`;

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Aumtara_Samay_Master_School_Data_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded All-in-One Master CSV Template!', 'success');
  };

  // Parse Multi-Section Master CSV / Text
  const parseMasterText = (textToParse) => {
    if (!textToParse.trim()) {
      showToast('Please paste data or select a CSV/Text file first!', 'warning');
      return;
    }

    const lines = textToParse.split(/\r?\n/);
    let currentSection = 'teachers';
    const result = {
      teachers: [],
      subjects: [],
      classes: [],
      rooms: []
    };

    let sectionHeaders = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Section markers check
      const upperLine = trimmed.toUpperCase();
      if (upperLine.includes('TEACHER')) {
        currentSection = 'teachers';
        sectionHeaders = [];
        return;
      }
      if (upperLine.includes('SUBJECT')) {
        currentSection = 'subjects';
        sectionHeaders = [];
        return;
      }
      if (upperLine.includes('CLASS')) {
        currentSection = 'classes';
        sectionHeaders = [];
        return;
      }
      if (upperLine.includes('ROOM')) {
        currentSection = 'rooms';
        sectionHeaders = [];
        return;
      }

      // Check header row
      if (
        trimmed.toLowerCase().startsWith('name,') ||
        trimmed.toLowerCase().startsWith('code,')
      ) {
        sectionHeaders = trimmed.split(',').map((h) => h.trim().toLowerCase());
        return;
      }

      // Parse values row
      const cols = trimmed.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
      if (cols.length < 2) return;

      if (currentSection === 'teachers') {
        result.teachers.push({
          name: cols[0] || 'Faculty Member',
          email: cols[1] || '',
          phone: cols[2] || '',
          primarySubject: cols[3] || 'SUB-101',
          secondarySubjects: cols[4] ? cols[4].split(';').map((s) => s.trim()) : [],
          preferredShift: cols[5] || 'Morning Shift',
          maxDailyLectures: parseInt(cols[6], 10) || 5,
          maxWeeklyWorkload: parseInt(cols[7], 10) || 24,
          assignedRole: 'Faculty'
        });
      } else if (currentSection === 'subjects') {
        result.subjects.push({
          code: cols[0] || `SUB-${Date.now().toString().slice(-3)}`,
          name: cols[1] || 'General Subject',
          category: cols[2] || 'Core',
          weeklyPeriods: parseInt(cols[3], 10) || 5,
          maxDailyPeriods: parseInt(cols[4], 10) || 1,
          isLab: (cols[5] || '').toLowerCase() === 'true',
          roomTypeNeeded: cols[6] || 'Classroom',
          color: cols[7] || '#3b82f6',
          shift: cols[8] || 'Morning Shift'
        });
      } else if (currentSection === 'classes') {
        result.classes.push({
          name: cols[0] || 'Grade 10-A',
          grade: cols[1] || '10',
          section: cols[2] || 'A',
          board: cols[3] || 'CBSE',
          shift: cols[4] || 'Morning Shift',
          capacity: parseInt(cols[5], 10) || 40,
          room: 'Room 101'
        });
      } else if (currentSection === 'rooms') {
        result.rooms.push({
          name: cols[0] || 'Room 101',
          building: cols[1] || 'Main Block',
          floor: cols[2] || 'Ground Floor',
          type: cols[3] || 'Classroom',
          capacity: parseInt(cols[4], 10) || 45,
          shift: cols[5] || 'Shared (Both Shifts)'
        });
      }
    });

    setParsedData(result);
    setIsParsed(true);

    const totalRows =
      result.teachers.length +
      result.subjects.length +
      result.classes.length +
      result.rooms.length;

    if (totalRows > 0) {
      showToast(
        `Parsed ${totalRows} total master records (${result.teachers.length} Teachers, ${result.subjects.length} Subjects, ${result.classes.length} Classes, ${result.rooms.length} Rooms)!`,
        'success'
      );
    } else {
      showToast('No valid master data rows found! Please check formatting.', 'warning');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      setRawText(content);
      parseMasterText(content);
    };
    reader.readAsText(file);
  };

  const handleImportConfirm = () => {
    bulkImportAllMasterData(parsedData);
    if (onClose) onClose();
  };

  const totalParsedCount =
    parsedData.teachers.length +
    parsedData.subjects.length +
    parsedData.classes.length +
    parsedData.rooms.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border-4 border-indigo-600 dark:border-indigo-500 shadow-2xl p-6 sm:p-8 space-y-6 animate-fadeIn text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-700 text-white flex items-center justify-center shadow-lg border-2 border-indigo-800">
              <Sparkles className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-amber-300 font-black text-[10px] uppercase rounded-full tracking-wider border border-indigo-300">
                ⚡ 1-Click Master Importer
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                All-in-One Master Data Excel Importer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                Import Teachers, Subjects, Classes, and Rooms all at once in 1 step!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Step 1: Upload / Paste Section */}
        {!isParsed ? (
          <div className="space-y-6">
            {/* Top Download Template Banner */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-300 flex items-center justify-center sm:justify-start space-x-2">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                  <span>Download Master All-in-One Template</span>
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                  Download 1 ready CSV template containing Teachers, Subjects, Classes, and Rooms sections.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadMasterTemplate}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer shrink-0 border border-emerald-800 hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span>Download Master CSV Template</span>
              </button>
            </div>

            {/* Option A: Upload CSV File */}
            <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-2xl p-6 text-center bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 transition-all">
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                id="master-file-upload"
                className="hidden"
              />
              <label htmlFor="master-file-upload" className="cursor-pointer block space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-indigo-950 dark:text-indigo-200">
                    {fileName ? `Selected: ${fileName}` : 'Click to Upload Master CSV / Text File'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supports All-in-One master files containing Teachers, Subjects, Classes & Rooms
                  </p>
                </div>
              </label>
            </div>

            {/* Option B: Copy Paste CSV Text */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200">
                Or Paste Master CSV Text Data Directly:
              </label>
              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Paste your entire school master roster here (e.g. === TEACHERS === ... === SUBJECTS === ...)`}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Parse Action Button */}
            <button
              type="button"
              onClick={() => parseMasterText(rawText)}
              className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 border border-indigo-900 cursor-pointer"
            >
              <Sparkles className="h-5 w-5 text-amber-300" />
              <span>Parse & Preview All Master Data</span>
            </button>
          </div>
        ) : (
          /* Step 2: Live Preview & Confirm Import */
          <div className="space-y-5 animate-fadeIn">
            {/* Category Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b-2 border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActivePreviewTab('teachers')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activePreviewTab === 'teachers'
                    ? 'bg-indigo-700 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Teachers ({parsedData.teachers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePreviewTab('subjects')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activePreviewTab === 'subjects'
                    ? 'bg-blue-700 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Subjects ({parsedData.subjects.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePreviewTab('classes')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activePreviewTab === 'classes'
                    ? 'bg-purple-700 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <School className="h-4 w-4" />
                <span>Classes ({parsedData.classes.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePreviewTab('rooms')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activePreviewTab === 'rooms'
                    ? 'bg-emerald-700 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <DoorClosed className="h-4 w-4" />
                <span>Rooms ({parsedData.rooms.length})</span>
              </button>
            </div>

            {/* Preview Table */}
            <div className="border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black uppercase text-[10px] tracking-wider sticky top-0">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Name / Code</th>
                    <th className="p-3">Details / Shift</th>
                    <th className="p-3">Capacity / Workload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold">
                  {activePreviewTab === 'teachers' &&
                    parsedData.teachers.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-black text-slate-900 dark:text-white">{item.name}</td>
                        <td className="p-3 text-indigo-600 dark:text-indigo-400">{item.preferredShift} • {item.primarySubject}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{item.maxWeeklyWorkload} L/Wk</td>
                      </tr>
                    ))}

                  {activePreviewTab === 'subjects' &&
                    parsedData.subjects.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-black text-slate-900 dark:text-white">{item.name} ({item.code})</td>
                        <td className="p-3 text-blue-600 dark:text-blue-400">{item.category} • {item.shift}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{item.weeklyPeriods} Periods/Wk</td>
                      </tr>
                    ))}

                  {activePreviewTab === 'classes' &&
                    parsedData.classes.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-black text-slate-900 dark:text-white">{item.name}</td>
                        <td className="p-3 text-purple-600 dark:text-purple-400">{item.board} • {item.shift}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{item.capacity} Students</td>
                      </tr>
                    ))}

                  {activePreviewTab === 'rooms' &&
                    parsedData.rooms.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-black text-slate-900 dark:text-white">{item.name}</td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400">{item.type} • {item.building}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{item.capacity} Seats</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Confirm Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsParsed(false)}
                className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                ← Back to Upload
              </button>

              <button
                type="button"
                onClick={handleImportConfirm}
                disabled={totalParsedCount === 0}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer border border-emerald-800 hover:scale-105"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                <span>Confirm & Import All {totalParsedCount} Master Records</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

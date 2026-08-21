import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, Sparkles, Layers, Users, BookOpen, School, DoorClosed } from 'lucide-react';
import * as XLSX from 'xlsx';
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

  // 📥 Download Real Multi-Sheet Excel (.xlsx) Template
  const downloadMasterXLSXTemplate = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Teachers
      const teachersData = [
        {
          Name: 'Prof. Vikram Sarabhai',
          Email: 'sarabhai@school.edu',
          Phone: '9876543210',
          PrimarySubject: 'SUB-101',
          SecondarySubjects: 'SUB-102, SUB-103',
          Shift: 'Afternoon Shift',
          MaxDailyLectures: 5,
          MaxWeeklyWorkload: 24
        },
        {
          Name: 'Dr. APJ Abdul Kalam',
          Email: 'kalam@school.edu',
          Phone: '9876543211',
          PrimarySubject: 'SUB-102',
          SecondarySubjects: 'SUB-101',
          Shift: 'Morning Shift',
          MaxDailyLectures: 5,
          MaxWeeklyWorkload: 24
        },
        {
          Name: 'Smt. Savitribai Phule',
          Email: 'savitri@school.edu',
          Phone: '9876543212',
          PrimarySubject: 'SUB-103',
          SecondarySubjects: '',
          Shift: 'Morning Shift',
          MaxDailyLectures: 4,
          MaxWeeklyWorkload: 20
        }
      ];
      const wsTeachers = XLSX.utils.json_to_sheet(teachersData);
      XLSX.utils.book_append_sheet(wb, wsTeachers, 'Teachers');

      // Sheet 2: Subjects
      const subjectsData = [
        {
          Code: 'SUB-101',
          Name: 'Mathematics',
          Category: 'Core',
          WeeklyPeriods: 6,
          MaxDailyPeriods: 1,
          IsLab: 'false',
          RoomTypeNeeded: 'Classroom',
          Color: '#3b82f6',
          Shift: 'Afternoon Shift'
        },
        {
          Code: 'SUB-102',
          Name: 'Physics & Science',
          Category: 'Core',
          WeeklyPeriods: 5,
          MaxDailyPeriods: 1,
          IsLab: 'true',
          RoomTypeNeeded: 'Science Lab',
          Color: '#10b981',
          Shift: 'Morning Shift'
        },
        {
          Code: 'SUB-103',
          Name: 'Gujarati Literature',
          Category: 'Language',
          WeeklyPeriods: 4,
          MaxDailyPeriods: 1,
          IsLab: 'false',
          RoomTypeNeeded: 'Classroom',
          Color: '#8b5cf6',
          Shift: 'Morning Shift'
        }
      ];
      const wsSubjects = XLSX.utils.json_to_sheet(subjectsData);
      XLSX.utils.book_append_sheet(wb, wsSubjects, 'Subjects');

      // Sheet 3: Classes
      const classesData = [
        {
          Name: 'Std 9-A (State)',
          Grade: '9',
          Section: 'A',
          Board: 'State Board',
          Shift: 'Afternoon Shift',
          Capacity: 45
        },
        {
          Name: 'Std 10-A (CBSE)',
          Grade: '10',
          Section: 'A',
          Board: 'CBSE',
          Shift: 'Morning Shift',
          Capacity: 40
        },
        {
          Name: 'Std 10-B (CBSE)',
          Grade: '10',
          Section: 'B',
          Board: 'CBSE',
          Shift: 'Morning Shift',
          Capacity: 38
        }
      ];
      const wsClasses = XLSX.utils.json_to_sheet(classesData);
      XLSX.utils.book_append_sheet(wb, wsClasses, 'Classes');

      // Sheet 4: Rooms
      const roomsData = [
        {
          Name: 'Room 101',
          Building: 'Main Block',
          Floor: '1st Floor',
          Type: 'Classroom',
          Capacity: 45,
          Shift: 'Shared (Both Shifts)'
        },
        {
          Name: 'Science Lab',
          Building: 'Science Block',
          Floor: 'Ground Floor',
          Type: 'Science Lab',
          Capacity: 35,
          Shift: 'Morning Shift'
        },
        {
          Name: 'Computer Lab 1',
          Building: 'IT Wing',
          Floor: '2nd Floor',
          Type: 'Computer Lab',
          Capacity: 40,
          Shift: 'Shared (Both Shifts)'
        }
      ];
      const wsRooms = XLSX.utils.json_to_sheet(roomsData);
      XLSX.utils.book_append_sheet(wb, wsRooms, 'Rooms');

      // Write and download .xlsx file
      XLSX.writeFile(wb, 'Aumtara_Samay_Master_School_Data_Template.xlsx');
      showToast('Downloaded 4-Sheet Master Excel Template (.xlsx)!', 'success');
    } catch (err) {
      console.error('Error generating Excel file:', err);
      showToast('Could not download Excel template.', 'error');
    }
  };

  // ⚡ Handle 1-Click Excel (.xlsx) / CSV File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const result = { teachers: [], subjects: [], classes: [], rooms: [] };

          workbook.SheetNames.forEach((sheetName, sIdx) => {
            const lowerName = sheetName.toLowerCase().trim();
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            if (lowerName.includes('teacher') || lowerName.includes('faculty') || lowerName.includes('staff') || (sIdx === 0 && !result.teachers.length)) {
              result.teachers = rows.map((r) => ({
                name: r.Name || r.name || r['Teacher Name'] || 'Faculty Member',
                email: r.Email || r.email || r['Email Address'] || '',
                phone: r.Phone || r.phone || r['Phone Number'] || '',
                primarySubject: r.PrimarySubject || r.primarySubject || r['Primary Subject'] || 'SUB-101',
                secondarySubjects: typeof r.SecondarySubjects === 'string' ? r.SecondarySubjects.split(',').map(s=>s.trim()) : [],
                preferredShift: r.Shift || r.shift || r['Shift'] || 'Morning Shift',
                maxDailyLectures: parseInt(r.MaxDailyLectures || r.maxDailyLectures || r['Max Daily'], 10) || 5,
                maxWeeklyWorkload: parseInt(r.MaxWeeklyWorkload || r.maxWeeklyWorkload || r['Max Weekly'], 10) || 24,
                assignedRole: 'Faculty'
              }));
            } else if (lowerName.includes('subject') || lowerName.includes('course') || lowerName.includes('sub') || (sIdx === 1 && !result.subjects.length)) {
              result.subjects = rows.map((r) => ({
                code: r.Code || r.code || r['Subject Code'] || `SUB-${Date.now().toString().slice(-3)}`,
                name: r.Name || r.name || r['Subject Name'] || 'General Subject',
                category: r.Category || r.category || 'Core',
                weeklyPeriods: parseInt(r.WeeklyPeriods || r.weeklyPeriods || r['Weekly Periods'], 10) || 5,
                maxDailyPeriods: parseInt(r.MaxDailyPeriods || r.maxDailyPeriods || r['Max Daily Periods'], 10) || 1,
                isLab: String(r.IsLab || r.isLab || r['Is Lab']).toLowerCase() === 'true',
                roomTypeNeeded: r.RoomTypeNeeded || r.roomTypeNeeded || r['Room Type'] || 'Classroom',
                color: r.Color || r.color || '#3b82f6',
                shift: r.Shift || r.shift || 'Morning Shift'
              }));
            } else if (lowerName.includes('class') || lowerName.includes('grade') || lowerName.includes('std') || (sIdx === 2 && !result.classes.length)) {
              result.classes = rows.map((r) => ({
                name: r.Name || r.name || r['Class Name'] || 'Grade 10-A',
                grade: String(r.Grade || r.grade || '10'),
                section: r.Section || r.section || 'A',
                board: r.Board || r.board || 'CBSE',
                shift: r.Shift || r.shift || 'Morning Shift',
                capacity: parseInt(r.Capacity || r.capacity || r['Student Capacity'], 10) || 40,
                room: 'Room 101'
              }));
            } else if (lowerName.includes('room') || lowerName.includes('lab') || lowerName.includes('hall') || lowerName.includes('infra') || lowerName.includes('facility') || (sIdx === 3 && !result.rooms.length)) {
              result.rooms = rows.map((r) => ({
                name: r.Name || r.name || r['Room Name'] || r['Room Code'] || 'Room 101',
                building: r.Building || r.building || r['Building Name'] || 'Main Block',
                floor: r.Floor || r.floor || 'Ground Floor',
                type: r.Type || r.type || r['Room Type'] || 'Classroom',
                capacity: parseInt(r.Capacity || r.capacity || r['Seating Capacity'], 10) || 45,
                shift: r.Shift || r.shift || 'Shared (Both Shifts)'
              }));
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
              `Successfully read Excel workbook (${result.teachers.length} Teachers, ${result.subjects.length} Subjects, ${result.classes.length} Classes, ${result.rooms.length} Rooms)!`,
              'success'
            );
          } else {
            showToast('No valid sheet records found in Excel file.', 'warning');
          }
        } catch (err) {
          console.error('Error reading Excel file:', err);
          showToast('Failed to parse Excel file. Please ensure it is a valid .xlsx file.', 'error');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Text/CSV Fallback
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target.result;
        setRawText(content);
        parseMasterCSVText(content);
      };
      reader.readAsText(file);
    }
  };

  // CSV Text Fallback Parser
  const parseMasterCSVText = (textToParse) => {
    if (!textToParse.trim()) {
      showToast('Please paste data or select a file first!', 'warning');
      return;
    }

    const lines = textToParse.split(/\r?\n/);
    let currentSection = 'teachers';
    const result = { teachers: [], subjects: [], classes: [], rooms: [] };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const upperLine = trimmed.toUpperCase();
      if (upperLine.includes('TEACHER')) { currentSection = 'teachers'; return; }
      if (upperLine.includes('SUBJECT')) { currentSection = 'subjects'; return; }
      if (upperLine.includes('CLASS')) { currentSection = 'classes'; return; }
      if (upperLine.includes('ROOM')) { currentSection = 'rooms'; return; }

      if (trimmed.toLowerCase().startsWith('name,') || trimmed.toLowerCase().startsWith('code,')) return;

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
    const totalRows = result.teachers.length + result.subjects.length + result.classes.length + result.rooms.length;
    showToast(`Parsed ${totalRows} total master records!`, 'success');
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
                ⚡ 1-Click Multi-Sheet Excel (.xlsx) Importer
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                All-in-One Multi-Sheet Excel Importer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                Select 1 Excel file (.xlsx) with 4 sheets (Teachers, Subjects, Classes, Rooms) to import everything in 1 click!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
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
                  <span>Download 4-Sheet Master Excel Template (.xlsx)</span>
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                  Download 1 ready Excel (.xlsx) file with pre-formatted sheets for Teachers, Subjects, Classes, and Rooms.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadMasterXLSXTemplate}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer shrink-0 border border-emerald-800 hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span>Download Master Excel (.xlsx)</span>
              </button>
            </div>

            {/* Option A: Upload XLSX File */}
            <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-2xl p-8 text-center bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 transition-all cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.txt"
                onChange={handleFileUpload}
                id="master-file-upload"
                className="hidden"
              />
              <label htmlFor="master-file-upload" className="cursor-pointer block space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg">
                  <Upload className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-base font-black text-indigo-950 dark:text-indigo-200">
                    {fileName ? `Selected: ${fileName}` : 'Click to Select 1 Excel Workbook (.xlsx / .xls)'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    System reads all 4 sheets (Teachers, Subjects, Classes, Rooms) automatically in 1 single click!
                  </p>
                </div>
              </label>
            </div>

            {/* Option B: Copy Paste Text */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200">
                Or Paste Master CSV Text Data Directly:
              </label>
              <textarea
                rows={5}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Paste master text here...`}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Parse Action Button */}
            <button
              type="button"
              onClick={() => parseMasterCSVText(rawText)}
              className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 border border-indigo-900 cursor-pointer"
            >
              <Sparkles className="h-5 w-5 text-amber-300" />
              <span>Parse & Preview All Sheets</span>
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
                <span>Teachers Sheet ({parsedData.teachers.length})</span>
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
                <span>Subjects Sheet ({parsedData.subjects.length})</span>
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
                <span>Classes Sheet ({parsedData.classes.length})</span>
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
                <span>Rooms Sheet ({parsedData.rooms.length})</span>
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
                ← Select Another File
              </button>

              <button
                type="button"
                onClick={handleImportConfirm}
                disabled={totalParsedCount === 0}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer border border-emerald-800 hover:scale-105"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                <span>Confirm & Import All {totalParsedCount} Records in 1 Click</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';

export default function BulkUploadModal({ isOpen, onClose, type = 'teachers' }) {
  const {
    bulkAddTeachers,
    bulkAddSubjects,
    bulkAddClasses,
    bulkAddRooms,
    subjects,
    teachers,
    showToast
  } = useTimetable();

  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [isParsed, setIsParsed] = useState(false);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'teachers': return 'Teachers Directory (શિક્ષકોની યાદી)';
      case 'subjects': return 'Subjects Catalog (વિષયોની યાદી)';
      case 'classes': return 'Classes & Sections (વર્ગો અને સેક્શન)';
      case 'rooms': return 'Rooms & Labs (ઓરડાઓ અને લેબ)';
      default: return 'Data Roster';
    }
  };

  // Sample CSV Templates
  const downloadSampleCSV = () => {
    let headers = '';
    let sampleRow = '';

    if (type === 'teachers') {
      headers = 'Name,Email,Phone,PrimarySubject,SecondarySubjects,Shift,MaxDaily,MaxWeekly\n';
      sampleRow = 'Prof. Vikram Sarabhai,sarabhai@school.edu,9876543210,SUB-101,"SUB-102,SUB-103",Afternoon Shift,5,24\nDr. APJ Abdul Kalam,kalam@school.edu,9876543211,SUB-102,"SUB-101",Morning Shift,5,24\n';
    } else if (type === 'subjects') {
      headers = 'Code,Name,Category,WeeklyPeriods,MaxDailyPeriods,IsLab,RoomType,Color,Shift\n';
      sampleRow = 'SUB-101,Mathematics,Core,6,1,false,Classroom,#3b82f6,Afternoon Shift\nSUB-102,Science & Physics,Core,5,1,true,Science Lab,#10b981,Morning Shift\n';
    } else if (type === 'classes') {
      headers = 'Name,Grade,Section,Board,Shift,Capacity\n';
      sampleRow = 'Std 9-A (State),9,A,State Board,Afternoon Shift,45\nStd 10-A (CBSE),10,A,CBSE,Morning Shift,40\n';
    } else if (type === 'rooms') {
      headers = 'Name,Building,Floor,Type,Capacity,Shift\n';
      sampleRow = 'Room 101,Main Block,1st Floor,Classroom,45,Shared (Both Shifts)\nPhysics Lab,Science Block,Ground Floor,Science Lab,35,Morning Shift\n';
    }

    const blob = new Blob([headers + sampleRow], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sample_${type}_import_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded sample CSV template for ${type}!`, 'info');
  };

  // Parse CSV or Tab Separated text
  const parseCSVContent = (text) => {
    if (!text.trim()) {
      setParsedData([]);
      setIsParsed(false);
      return;
    }

    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) {
      showToast('CSV must contain at least a header line and 1 data line.', 'warning');
      return;
    }

    // Header parser
    const headers = lines[0].split(/,|\t/).map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      // Handle quoted CSV split
      const rawCols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)|(?:\t)/).map(c => c.trim().replace(/^"|"$/g, ''));

      if (type === 'teachers') {
        const primSubCode = rawCols[3] || (subjects[0]?.id || 'SUB-101');
        const secSubs = rawCols[4] ? rawCols[4].split(',').map(s => s.trim()) : [];
        rows.push({
          name: rawCols[0] || `Teacher ${i}`,
          email: rawCols[1] || `teacher${i}@school.edu`,
          phone: rawCols[2] || '9999999999',
          primarySubjectId: primSubCode,
          secondarySubjectIds: secSubs,
          substituteSubjectIds: [],
          subjects: [primSubCode, ...secSubs],
          shift: rawCols[5] || 'Afternoon Shift',
          maxDaily: parseInt(rawCols[6]) || 5,
          maxWeekly: parseInt(rawCols[7]) || 24,
          offDay: 'None'
        });
      } else if (type === 'subjects') {
        rows.push({
          code: rawCols[0] || `SUB-${100 + i}`,
          name: rawCols[1] || `Subject ${i}`,
          category: rawCols[2] || 'Core',
          weeklyPeriods: parseInt(rawCols[3]) || 5,
          maxDailyPeriods: parseInt(rawCols[4]) || 1,
          isLab: (rawCols[5] || '').toLowerCase() === 'true',
          roomType: rawCols[6] || 'Classroom',
          color: rawCols[7] || '#3b82f6',
          shift: rawCols[8] || 'Afternoon Shift'
        });
      } else if (type === 'classes') {
        rows.push({
          name: rawCols[0] || `Std ${9 + (i % 4)}-${String.fromCharCode(65 + (i % 3))}`,
          grade: rawCols[1] || '9',
          section: rawCols[2] || 'A',
          board: rawCols[3] || 'State Board',
          shift: rawCols[4] || 'Afternoon Shift',
          capacity: parseInt(rawCols[5]) || 45,
          classTeacherId: teachers[0]?.id || '',
          roomPrefId: '',
          subjects: subjects.slice(0, 5).map(s => s.id)
        });
      } else if (type === 'rooms') {
        rows.push({
          name: rawCols[0] || `Room ${100 + i}`,
          building: rawCols[1] || 'Main Block',
          floor: rawCols[2] || '1st Floor',
          type: rawCols[3] || 'Classroom',
          capacity: parseInt(rawCols[4]) || 40,
          shift: rawCols[5] || 'Shared (Both Shifts)',
          features: ['Smart Board']
        });
      }
    }

    setParsedData(rows);
    setIsParsed(true);
    showToast(`Successfully parsed ${rows.length} ${type} rows for import!`, 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setRawText(text);
      parseCSVContent(text);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0) return;

    if (type === 'teachers') {
      bulkAddTeachers(parsedData);
    } else if (type === 'subjects') {
      bulkAddSubjects(parsedData);
    } else if (type === 'classes') {
      bulkAddClasses(parsedData);
    } else if (type === 'rooms') {
      bulkAddRooms(parsedData);
    }

    onClose();
    setRawText('');
    setParsedData([]);
    setIsParsed(false);
    setFileName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                Bulk CSV / Excel Upload — {getTitle()}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
                Import dozens of records at once via CSV file upload or direct copy-paste from Excel.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Step 1: Download Sample CSV Template & Upload Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-900/50 space-y-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
                <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  Step 1: Download CSV Template
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                Download pre-formatted Excel / CSV template with sample data columns to easily structure your school list.
              </p>
              <button
                onClick={downloadSampleCSV}
                className="w-full py-2 px-4 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 border border-indigo-900 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download Sample {type.toUpperCase()} Template (.CSV)</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-900/50 space-y-3">
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  Step 2: Upload CSV File
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                Select your prepared `.csv` or `.txt` file from your computer.
              </p>
              <label className="w-full py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 border border-emerald-900 cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>{fileName ? `File: ${fileName}` : 'Choose CSV / Excel File'}</span>
                <input type="file" accept=".csv, .txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Paste CSV Data Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">
                Or Direct Paste CSV / Tab-Separated Data from Excel:
              </label>
              <button
                onClick={() => parseCSVContent(rawText)}
                className="px-3 py-1 bg-indigo-700 text-white text-xs font-black rounded-lg shadow hover:bg-indigo-800 cursor-pointer"
              >
                Parse Pasted Data
              </button>
            </div>
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Paste CSV text here...\nExample:\nName,Email,Phone,Shift\nProf. Ramanujan,ramanujan@school.edu,9876543210,Afternoon Shift`}
              className="w-full p-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Live Preview Table */}
          {isParsed && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-950 dark:text-white flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Parsed Import Preview ({parsedData.length} Records Validated)</span>
                </h4>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border-2 border-slate-300 dark:border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black border-b-2 border-slate-300 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Name / Code</th>
                      <th className="p-2.5">Detail / Category</th>
                      <th className="p-2.5">Shift</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold text-slate-900 dark:text-slate-200">
                    {parsedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-mono text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-black text-indigo-950 dark:text-indigo-300">
                          {row.name || row.code}
                        </td>
                        <td className="p-2.5 text-slate-700 dark:text-slate-300">
                          {row.email || row.category || row.board || row.building || 'Standard'}
                        </td>
                        <td className="p-2.5 font-black text-emerald-700 dark:text-emerald-400">
                          {row.shift || 'Afternoon Shift'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-black rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={parsedData.length === 0}
            className={`px-6 py-2.5 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center space-x-2 border cursor-pointer ${
              parsedData.length > 0
                ? 'bg-emerald-700 hover:bg-emerald-800 border-emerald-900 hover:scale-105'
                : 'bg-slate-400 border-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Import {parsedData.length > 0 ? `${parsedData.length} Records Now` : 'Records'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

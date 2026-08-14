import React, { useState, useRef } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { School, Clock, Sun, Sunset, Save, Plus, Trash2, Edit3, Sparkles, Upload, Image, MapPin, Layers } from 'lucide-react';

export default function InstitutionalSetup() {
  const {
    institution,
    setInstitution,
    bellSchedule,
    setBellSchedule,
    activeSubTab,
    setActiveSubTab,
    showToast,
    selectedShiftFilter,
    setSelectedShiftFilter
  } = useTimetable();

  const logoFileInputRef = useRef(null);

  const handleLogoFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE_MB = 2;
    const maxSizeBytes = MAX_SIZE_MB * 1024 * 1024; // 2MB

    if (file.size > maxSizeBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      showToast(`Selected file size (${fileSizeMB} MB) exceeds maximum limit of ${MAX_SIZE_MB} MB! Please choose a smaller image.`, 'warning');
      e.target.value = '';
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showToast('Unsupported logo file type! Allowed formats: PNG, JPG, JPEG, SVG, or WEBP.', 'warning');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      setInstitution((prev) => ({ ...prev, logoUrl: evt.target.result }));
      showToast('School logo image uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Local editable state initialized from global bellSchedule
  const [shifts, setShifts] = useState(bellSchedule.shifts || []);
  const [periods, setPeriods] = useState(bellSchedule.periods || []);
  const [periodsPerDay, setPeriodsPerDay] = useState(bellSchedule.periodsPerDay || 7);
  const [saturdayConfig, setSaturdayConfig] = useState(
    bellSchedule.saturdaySchedule || {
      enabled: true,
      periodsCount: 5,
      morningStartTime: "07:30",
      morningEndTime: "11:30",
      afternoonStartTime: "12:45",
      afternoonEndTime: "16:05",
      periodDurationMinutes: 40,
      recessBreakMinutes: 15,
      recessAfterPeriod: 3,
      assemblyMinutes: 15,
      periods: [
        { number: 1, name: "Saturday Period 1", startTime: "07:45 AM - 08:25 AM", endTime: "01:00 PM - 01:40 PM" },
        { number: 2, name: "Saturday Period 2", startTime: "08:25 AM - 09:05 AM", endTime: "01:40 PM - 02:20 PM" },
        { number: 3, name: "Saturday Period 3", startTime: "09:05 AM - 09:45 AM", endTime: "02:20 PM - 03:00 PM" },
        { number: 4, name: "Saturday Period 4", startTime: "10:00 AM - 10:40 AM", endTime: "03:15 PM - 03:55 PM" },
        { number: 5, name: "Saturday Period 5 (Half Day Final)", startTime: "10:40 AM - 11:20 AM", endTime: "03:55 PM - 04:35 PM" }
      ]
    }
  );

  const handleSaveInstitution = (e) => {
    e.preventDefault();
    showToast('Institutional & Board setup updated successfully!', 'success');
  };

  const handleShiftChange = (index, field, value) => {
    const updated = [...shifts];
    updated[index] = { ...updated[index], [field]: value };
    setShifts(updated);
  };

  const handlePeriodChange = (index, field, value) => {
    const updated = [...periods];
    updated[index] = { ...updated[index], [field]: value };
    setPeriods(updated);
  };

  const handleAddPeriod = () => {
    const nextNum = periods.length + 1;
    const newP = {
      number: nextNum,
      name: `Period ${nextNum}`,
      startTime: "12:00 / 05:00",
      endTime: "12:40 / 05:40"
    };
    setPeriods([...periods, newP]);
    setPeriodsPerDay(nextNum);
    showToast(`Added Period ${nextNum} to bell schedule!`, 'info');
  };

  const handleDeletePeriod = (index) => {
    if (periods.length <= 1) {
      showToast('At least 1 period is required!', 'warning');
      return;
    }
    const updated = periods.filter((_, i) => i !== index).map((p, i) => ({
      ...p,
      number: i + 1,
      name: p.name.startsWith('Period') ? `Period ${i + 1}` : p.name
    }));
    setPeriods(updated);
    setPeriodsPerDay(updated.length);
    showToast('Deleted period from schedule.', 'warning');
  };

  const handleAddSaturdayPeriod = () => {
    const nextNum = (saturdayConfig.periods || []).length + 1;
    const newPeriod = {
      number: nextNum,
      name: `Saturday Period ${nextNum}`,
      startTime: "10:40 AM - 11:20 AM",
      endTime: "03:55 PM - 04:35 PM"
    };
    setSaturdayConfig((prev) => ({
      ...prev,
      periodsCount: nextNum,
      periods: [...(prev.periods || []), newPeriod]
    }));
    showToast(`Added Saturday Period ${nextNum} to bell schedule!`, 'info');
  };

  const handleDeleteSaturdayPeriod = (index) => {
    if ((saturdayConfig.periods || []).length <= 1) {
      showToast('Saturday schedule must have at least 1 period!', 'warning');
      return;
    }
    const updated = (saturdayConfig.periods || []).filter((_, i) => i !== index).map((sp, i) => ({
      ...sp,
      number: i + 1,
      name: sp.name.startsWith('Saturday Period') ? `Saturday Period ${i + 1}${i === saturdayConfig.periods.length - 2 ? ' (Half Day Final)' : ''}` : sp.name
    }));
    setSaturdayConfig((prev) => ({
      ...prev,
      periodsCount: updated.length,
      periods: updated
    }));
    showToast(`Deleted Saturday Period ${index + 1} from schedule.`, 'warning');
  };

  const handleAutoCalculateSaturdaySlots = () => {
    const duration = saturdayConfig.periodDurationMinutes || 40;
    const breakMins = saturdayConfig.recessBreakMinutes || 15;
    const breakPos = saturdayConfig.recessAfterPeriod || 3;
    const assembly = saturdayConfig.assemblyMinutes || 15;

    const parseMins = (tStr) => {
      if (!tStr) return 450; // 07:30
      const [h, m] = tStr.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const formatTime = (mins) => {
      let h = Math.floor(mins / 60) % 24;
      let m = mins % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      let h12 = h % 12;
      if (h12 === 0) h12 = 12;
      const strH = String(h12).padStart(2, '0');
      const strM = String(m).padStart(2, '0');
      return `${strH}:${strM} ${ampm}`;
    };

    let mCurrent = parseMins(saturdayConfig.morningStartTime || '07:30') + assembly;
    let aCurrent = parseMins(saturdayConfig.afternoonStartTime || '12:45') + assembly;

    const updatedPeriods = (saturdayConfig.periods || []).map((sp, idx) => {
      const pNum = idx + 1;
      const mStart = mCurrent;
      const mEnd = mStart + duration;
      const aStart = aCurrent;
      const aEnd = aStart + duration;

      mCurrent = mEnd;
      aCurrent = aEnd;

      if (pNum === breakPos) {
        mCurrent += breakMins;
        aCurrent += breakMins;
      }

      return {
        ...sp,
        startTime: `${formatTime(mStart)} - ${formatTime(mEnd)}`,
        endTime: `${formatTime(aStart)} - ${formatTime(aEnd)}`
      };
    });

    setSaturdayConfig((prev) => ({
      ...prev,
      periods: updatedPeriods
    }));

    showToast('Auto-generated Saturday period time slots based on period duration and recess break!', 'success');
  };

  const handleSaveBellSchedule = (e) => {
    e.preventDefault();
    setBellSchedule({
      ...bellSchedule,
      shifts,
      periods,
      periodsPerDay,
      saturdaySchedule: saturdayConfig
    });
    showToast('Dual-Shift & Saturday Half-Day Bell Schedule saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subtab Header Navigation */}
      <div className="flex items-center space-x-2 border-b-2 border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('academic')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeSubTab === 'academic' || !activeSubTab
              ? 'bg-indigo-700 text-white shadow-md border border-indigo-800'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          <School className="h-4 w-4" />
          <span>Academic & Board Setup</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bell')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeSubTab === 'bell'
              ? 'bg-indigo-700 text-white shadow-md border border-indigo-800'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Bell Schedule & Shift Timings Configurator</span>
        </button>
      </div>

      {/* Subtab 1: Academic & Board Setup */}
      {(activeSubTab === 'academic' || !activeSubTab) && (
        <form onSubmit={handleSaveInstitution} className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xl">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <School className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
              <span>Dual-Board & Campus Infrastructure Setup</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
              Configure baseline parameters for Morning CBSE and Afternoon State Board English Medium shifts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
                School / Institution Name <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={institution.name || ''}
                onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                placeholder="e.g. Apex State & Central Academy"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black text-xs rounded-xl focus:outline-none focus:border-indigo-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
                School Code / Affiliation ID
              </label>
              <input
                type="text"
                value={institution.code || ''}
                onChange={(e) => setInstitution({ ...institution, code: e.target.value })}
                placeholder="e.g. ASCA-2026"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-indigo-700 dark:text-indigo-300 font-mono font-black text-xs rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
                Academic Year
              </label>
              <input
                type="text"
                value={institution.academicYear || ''}
                onChange={(e) => setInstitution({ ...institution, academicYear: e.target.value })}
                placeholder="e.g. 2026-2027"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black text-xs rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
                Principal / Head Name
              </label>
              <input
                type="text"
                value={institution.principalName || ''}
                onChange={(e) => setInstitution({ ...institution, principalName: e.target.value })}
                placeholder="e.g. Dr. Sarah Jenkins"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black text-xs rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
                Curriculum Boards Served
              </label>
              <input
                type="text"
                value={institution.board || ''}
                onChange={(e) => setInstitution({ ...institution, board: e.target.value })}
                placeholder="e.g. State Board & CBSE (Dual Board)"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black text-xs rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
                Instruction Medium
              </label>
              <input
                type="text"
                value={institution.medium || ''}
                onChange={(e) => setInstitution({ ...institution, medium: e.target.value })}
                placeholder="e.g. English Medium"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black text-xs rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
                Academic Term
              </label>
              <input
                type="text"
                value={institution.term || ''}
                onChange={(e) => setInstitution({ ...institution, term: e.target.value })}
                placeholder="e.g. Term 1 (Autumn)"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black text-xs rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
                Academic Shift Mode
              </label>
              <select
                value={institution.shiftMode || 'Dual Shift (Morning & Afternoon)'}
                onChange={(e) => setInstitution({ ...institution, shiftMode: e.target.value })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black text-xs rounded-xl focus:outline-none focus:border-indigo-600"
              >
                <option value="Dual Shift (Morning & Afternoon)">Dual Shift (Morning CBSE & Afternoon State Board)</option>
                <option value="Single Shift">Single Shift Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">
                Campus Address / Location
              </label>
              <input
                type="text"
                value={institution.address || ''}
                onChange={(e) => setInstitution({ ...institution, address: e.target.value })}
                placeholder="e.g. 100 Knowledge Boulevard, Education City"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black text-xs rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Active Shift Filter Control (Morning, Afternoon & Combined Shifts) */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800/60 space-y-3">
            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1">
                Active Shift View Selector (Morning, Afternoon & Combined Shifts)
              </label>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold mb-2">
                Configure baseline shift focus view across the software:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedShiftFilter('Morning Shift');
                  showToast('Selected Morning Shift view filter', 'info');
                }}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                  selectedShiftFilter === 'Morning Shift'
                    ? 'bg-amber-500 text-amber-950 border-amber-600 shadow-md ring-2 ring-amber-300'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Morning Shift (CBSE)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedShiftFilter('Afternoon Shift');
                  showToast('Selected Afternoon Shift view filter', 'info');
                }}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                  selectedShiftFilter === 'Afternoon Shift'
                    ? 'bg-purple-700 text-white border-purple-800 shadow-md ring-2 ring-purple-400'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sunset className="h-4 w-4" />
                <span>Afternoon Shift (State Board)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedShiftFilter('All Shifts');
                  showToast('Selected Combined Shifts view filter', 'info');
                }}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                  selectedShiftFilter === 'All Shifts'
                    ? 'bg-indigo-700 text-white border-indigo-800 shadow-md ring-2 ring-indigo-400'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Combined Shifts (Both Shifts)</span>
              </button>
            </div>
          </div>

          {/* School Logo Management Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-indigo-200 dark:border-indigo-800/60 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <Image className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>School / Institution Branding Logo</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
                  Upload official school logo image or paste image web link.
                </p>
              </div>

              {institution.logoUrl ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-400 text-[10px] font-black self-start sm:self-auto">
                  ● Custom Logo Active
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black self-start sm:self-auto">
                  ○ Default System Icon
                </span>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={logoFileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
              onChange={handleLogoFileUpload}
              className="hidden"
            />

            <div className="flex flex-col md:flex-row md:items-center gap-5">
              {/* Logo Preview Badge */}
              <div className="relative group shrink-0">
                <div className="h-20 w-20 rounded-2xl border-2 border-indigo-500 bg-white dark:bg-slate-900 flex items-center justify-center p-1.5 overflow-hidden shadow-lg">
                  {institution.logoUrl ? (
                    <img src={institution.logoUrl} alt="School Logo" className="h-full w-full object-contain" />
                  ) : (
                    <School className="h-10 w-10 text-indigo-700 dark:text-indigo-400" />
                  )}
                </div>
              </div>

              {/* Upload & Restrictions Details */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-400 block font-extrabold">Supported File Formats:</span>
                    <strong className="text-indigo-700 dark:text-indigo-300">.PNG, .JPG, .JPEG, .SVG, .WEBP</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-extrabold">Maximum Allowed File Size:</span>
                    <strong className="text-rose-600 dark:text-rose-400">Max 2.0 MB (2,048 KB)</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current && logoFileInputRef.current.click()}
                    className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center space-x-1.5 border border-indigo-900 cursor-pointer hover:scale-105"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{institution.logoUrl ? 'Modify / Replace Logo' : '+ Add School Logo'}</span>
                  </button>

                  {institution.logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setInstitution({ ...institution, logoUrl: '' });
                        showToast('School logo removed.', 'warning');
                      }}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-black rounded-xl border border-rose-300 dark:border-rose-800 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove Logo</span>
                    </button>
                  )}
                </div>

                {/* Direct Image Web URL Option */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300">
                    Or Enter Image Direct Web Link (URL):
                  </label>
                  <input
                    type="text"
                    value={institution.logoUrl || ''}
                    onChange={(e) => setInstitution({ ...institution, logoUrl: e.target.value })}
                    placeholder="e.g. https://my-school.edu/logo.png"
                    className="w-full px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold text-xs rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-105 border border-indigo-900"
            >
              <Save className="h-4 w-4" />
              <span>Save Academic Config</span>
            </button>
          </div>
        </form>
      )}

      {/* Subtab 2: Editable Bell Schedule & Shift Timings Configurator */}
      {activeSubTab === 'bell' && (
        <form onSubmit={handleSaveBellSchedule} className="space-y-6">
          {/* Shift Timing Cards Editor */}
          <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xl">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
                  <span>Dual Shift Timing & Recess Configurator</span>
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
                  Edit start time, end time, period duration, and recess breaks for each shift.
                </p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-105 border border-indigo-900"
              >
                <Save className="h-4 w-4" />
                <span>Save All Timings</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shifts.map((shift, idx) => (
                <div
                  key={shift.id || idx}
                  className={`p-5 rounded-2xl border-2 space-y-4 shadow-sm ${
                    idx === 0
                      ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-200'
                      : 'bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-500/40 text-purple-950 dark:text-purple-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-black text-sm border-b border-slate-300 dark:border-slate-800 pb-3">
                    {idx === 0 ? <Sun className="h-5 w-5 text-amber-600" /> : <Sunset className="h-5 w-5 text-purple-700" />}
                    <input
                      type="text"
                      value={shift.name}
                      onChange={(e) => handleShiftChange(idx, 'name', e.target.value)}
                      className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black text-sm px-3 py-1 rounded-lg focus:outline-none w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-900 dark:text-slate-200 font-black mb-1">Shift Start Time</label>
                      <input
                        type="time"
                        value={shift.startTime}
                        onChange={(e) => handleShiftChange(idx, 'startTime', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-900 dark:text-slate-200 font-black mb-1">Shift End Time</label>
                      <input
                        type="time"
                        value={shift.endTime}
                        onChange={(e) => handleShiftChange(idx, 'endTime', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-900 dark:text-slate-200 font-black mb-1">Period Duration (Mins)</label>
                      <input
                        type="number"
                        min="20"
                        max="90"
                        value={shift.periodDurationMinutes}
                        onChange={(e) => handleShiftChange(idx, 'periodDurationMinutes', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-900 dark:text-slate-200 font-black mb-1">Periods Per Shift</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={shift.periodsPerDay}
                        onChange={(e) => handleShiftChange(idx, 'periodsPerDay', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Recess & Lunch Config */}
                  <div className="pt-2 border-t border-slate-300 dark:border-slate-800/80 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-900 dark:text-slate-200 font-black mb-1">Recess Break After</label>
                      <select
                        value={shift.lunchBreakAfterPeriod}
                        onChange={(e) => handleShiftChange(idx, 'lunchBreakAfterPeriod', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        {Array.from({ length: 8 }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>After Period {i + 1}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-900 dark:text-slate-200 font-black mb-1">Break Duration (Mins)</label>
                      <input
                        type="number"
                        min="10"
                        max="60"
                        value={shift.lunchBreakMinutes}
                        onChange={(e) => handleShiftChange(idx, 'lunchBreakMinutes', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Period-by-Period Schedule Matrix Editor */}
          <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <Edit3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Period-by-Period Bell Schedule Matrix</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">Customize period names and morning / afternoon start-end slots.</p>
              </div>

              <button
                type="button"
                onClick={handleAddPeriod}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl flex items-center space-x-1.5 shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Period Slot</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black">
                  <tr>
                    <th className="p-3 w-16 text-center">#</th>
                    <th className="p-3">Period Label / Title</th>
                    <th className="p-3">Morning Shift Time Slot</th>
                    <th className="p-3">Afternoon Shift Time Slot</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
                  {periods.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-center font-black text-indigo-700 dark:text-indigo-400">{p.number}</td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handlePeriodChange(idx, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={p.startTime}
                          onChange={(e) => handlePeriodChange(idx, 'startTime', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 font-mono"
                          placeholder="07:30 - 08:10"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={p.endTime}
                          onChange={(e) => handlePeriodChange(idx, 'endTime', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 font-mono"
                          placeholder="12:45 - 01:25"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeletePeriod(idx)}
                          className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 rounded-xl transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Saturday Custom Half-Day Schedule Configurator */}
          <div className="glass-panel p-6 rounded-2xl border-2 border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-700 text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center space-x-2">
                    <span>Saturday Custom Half-Day Bell Schedule & Period Configurator</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-950 dark:bg-amber-500/20 dark:text-amber-300 font-black border border-amber-300">
                      SHORT DAY MODE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
                    Set specific Saturday timing slots and limit to 4 or 5 short-day periods.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">Saturday Short Day:</span>
                <button
                  type="button"
                  onClick={() =>
                    setSaturdayConfig((prev) => ({ ...prev, enabled: !prev.enabled }))
                  }
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    saturdayConfig.enabled
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {saturdayConfig.enabled ? 'ENABLED (Short Day)' : 'DISABLED (Same as Weekday)'}
                </button>
              </div>
            </div>

            {saturdayConfig.enabled && (
              <div className="space-y-4 pt-1">
                {/* Saturday Quick Controls & Add Period Action */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border-2 border-amber-300 dark:border-amber-800">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wide">
                      Saturday Period Count ({saturdayConfig.periods.length} Periods Configured):
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {[4, 5, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            const newPeriods = Array.from({ length: num }).map((_, i) => ({
                              number: i + 1,
                              name: `Saturday Period ${i + 1}${i === num - 1 ? ' (Half Day Final)' : ''}`,
                              startTime: saturdayConfig.periods[i]?.startTime || "07:30 - 08:10",
                              endTime: saturdayConfig.periods[i]?.endTime || "12:45 - 01:25"
                            }));
                            setSaturdayConfig((prev) => ({
                              ...prev,
                              periodsCount: num,
                              periods: newPeriods
                            }));
                            showToast(`Set Saturday Schedule to ${num} Short Periods`, 'info');
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all border ${
                            saturdayConfig.periodsCount === num
                              ? 'bg-amber-700 text-white border-amber-900 shadow'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {num} P
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleAutoCalculateSaturdaySlots}
                      className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center space-x-1.5 border border-indigo-900 cursor-pointer hover:scale-105"
                      title="Calculate per-period Saturday time slots from shift start time, period duration & recess break"
                    >
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      <span>⚡ Auto-Generate Time Slots</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddSaturdayPeriod}
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center space-x-1.5 border border-amber-900 cursor-pointer hover:scale-105"
                    >
                      <Plus className="h-4 w-4" />
                      <span>+ Add Saturday Period</span>
                    </button>
                  </div>
                </div>

                {/* Saturday Shift Start & End Time Controls (Morning & Afternoon) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border-2 border-amber-300 dark:border-amber-800/60 text-xs">
                  <div>
                    <label className="block font-black text-amber-950 dark:text-amber-200 mb-1 flex items-center space-x-1">
                      <Sun className="h-3.5 w-3.5 text-amber-600" />
                      <span>Morning Shift Sat Start Time</span>
                    </label>
                    <input
                      type="time"
                      value={saturdayConfig.morningStartTime || '07:30'}
                      onChange={(e) => setSaturdayConfig((prev) => ({ ...prev, morningStartTime: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 rounded-xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-amber-950 dark:text-amber-200 mb-1 flex items-center space-x-1">
                      <Sun className="h-3.5 w-3.5 text-amber-600" />
                      <span>Morning Shift Sat End Time</span>
                    </label>
                    <input
                      type="time"
                      value={saturdayConfig.morningEndTime || '11:30'}
                      onChange={(e) => setSaturdayConfig((prev) => ({ ...prev, morningEndTime: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 rounded-xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-purple-950 dark:text-purple-200 mb-1 flex items-center space-x-1">
                      <Sunset className="h-3.5 w-3.5 text-purple-600" />
                      <span>Afternoon Shift Sat Start Time</span>
                    </label>
                    <input
                      type="time"
                      value={saturdayConfig.afternoonStartTime || '12:45'}
                      onChange={(e) => setSaturdayConfig((prev) => ({ ...prev, afternoonStartTime: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-purple-950 dark:text-purple-200 mb-1 flex items-center space-x-1">
                      <Sunset className="h-3.5 w-3.5 text-purple-600" />
                      <span>Afternoon Shift Sat End Time</span>
                    </label>
                    <input
                      type="time"
                      value={saturdayConfig.afternoonEndTime || '16:05'}
                      onChange={(e) => setSaturdayConfig((prev) => ({ ...prev, afternoonEndTime: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                {/* Saturday Period Duration & Recess Break Timing Configurator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-xs">
                  <div>
                    <label className="block font-black text-slate-900 dark:text-slate-200 mb-1">Saturday Period Duration</label>
                    <input
                      type="number"
                      min="20"
                      max="60"
                      value={saturdayConfig.periodDurationMinutes || 40}
                      onChange={(e) => setSaturdayConfig((prev) => ({ ...prev, periodDurationMinutes: Number(e.target.value) }))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-black text-slate-900 dark:text-white"
                      placeholder="40 mins"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-900 dark:text-slate-200 mb-1">Saturday Recess Break Duration</label>
                    <input
                      type="number"
                      min="10"
                      max="45"
                      value={saturdayConfig.recessBreakMinutes || 15}
                      onChange={(e) => setSaturdayConfig((prev) => ({ ...prev, recessBreakMinutes: Number(e.target.value) }))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-black text-slate-900 dark:text-white"
                      placeholder="15 mins"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-900 dark:text-slate-200 mb-1">Recess Break Position</label>
                    <select
                      value={saturdayConfig.recessAfterPeriod || 3}
                      onChange={(e) => setSaturdayConfig((prev) => ({ ...prev, recessAfterPeriod: Number(e.target.value) }))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-black text-slate-900 dark:text-white"
                    >
                      {Array.from({ length: saturdayConfig.periods.length }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>After Period {i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-slate-900 dark:text-slate-200 mb-1">Saturday Assembly & Prayer</label>
                    <input
                      type="number"
                      min="5"
                      max="30"
                      value={saturdayConfig.assemblyMinutes || 15}
                      onChange={(e) => setSaturdayConfig((prev) => ({ ...prev, assemblyMinutes: Number(e.target.value) }))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-black text-slate-900 dark:text-white"
                      placeholder="15 mins"
                    />
                  </div>
                </div>

                {/* Saturday Period-by-Period Table */}
                <div className="overflow-x-auto rounded-xl border-2 border-amber-300 dark:border-amber-800 shadow-md">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 font-black border-b-2 border-amber-300 dark:border-amber-800">
                      <tr>
                        <th className="p-3.5 w-16 text-center">#</th>
                        <th className="p-3.5">Saturday Period Title</th>
                        <th className="p-3.5">Morning Shift Time Slot</th>
                        <th className="p-3.5">Afternoon Shift Time Slot</th>
                        <th className="p-3.5 text-right w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-200 dark:divide-amber-900/40 text-slate-900 dark:text-slate-200 font-bold bg-white dark:bg-slate-900">
                      {saturdayConfig.periods.map((sp, idx) => (
                        <tr key={idx} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-colors">
                          <td className="p-3.5 text-center font-black text-amber-700 dark:text-amber-400">{sp.number}</td>
                          <td className="p-3.5">
                            <input
                              type="text"
                              value={sp.name}
                              onChange={(e) => {
                                const updated = [...saturdayConfig.periods];
                                updated[idx].name = e.target.value;
                                setSaturdayConfig((prev) => ({ ...prev, periods: updated }));
                              }}
                              className="w-full px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-600"
                            />
                          </td>
                          <td className="p-3.5">
                            <input
                              type="text"
                              value={sp.startTime}
                              onChange={(e) => {
                                const updated = [...saturdayConfig.periods];
                                updated[idx].startTime = e.target.value;
                                setSaturdayConfig((prev) => ({ ...prev, periods: updated }));
                              }}
                              className="w-full px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-600 font-mono"
                              placeholder="07:30 - 08:10"
                            />
                          </td>
                          <td className="p-3.5">
                            <input
                              type="text"
                              value={sp.endTime}
                              onChange={(e) => {
                                const updated = [...saturdayConfig.periods];
                                updated[idx].endTime = e.target.value;
                                setSaturdayConfig((prev) => ({ ...prev, periods: updated }));
                              }}
                              className="w-full px-3.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-600 font-mono"
                              placeholder="12:45 - 01:25"
                            />
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteSaturdayPeriod(idx)}
                              className="p-2 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-300"
                              title="Delete Saturday Period"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-lg flex items-center space-x-2 transition-all hover:scale-105 border border-indigo-900 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Complete Bell Schedule Setup</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

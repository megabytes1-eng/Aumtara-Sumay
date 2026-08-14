import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  History,
  Plus,
  Clock,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Save,
  Search,
  Sparkles,
  Layers,
  ShieldCheck,
  X
} from 'lucide-react';

export default function VersionHistoryView() {
  const {
    timetable,
    conflicts,
    optimizationScore,
    timetableVersions,
    activeVersionId,
    saveTimetableVersion,
    restoreTimetableVersion,
    deleteTimetableVersion,
    activeRole,
    rolePermissions,
    setActiveTab,
    setActiveSubTab,
    showToast
  } = useTimetable();

  const [searchTerm, setSearchTerm] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [versionNameInput, setVersionNameInput] = useState('');
  const [versionDescInput, setVersionDescInput] = useState('');

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

  const filteredVersions = (timetableVersions || []).filter(
    (ver) =>
      ver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ver.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ver.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeVersion = (timetableVersions || []).find((v) => v.id === activeVersionId) || timetableVersions?.[0];
  const latestVersion = timetableVersions?.[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-teal-700 text-white shadow-lg">
              <History className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                  Saved Timetable Versions & Revisions Hub
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-teal-100 text-teal-950 dark:bg-teal-500/20 dark:text-teal-300 text-xs font-black border border-teal-300">
                  {timetableVersions.length} Snapshots Saved
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-extrabold mt-1">
                Review, restore, or create new timetable version snapshots across Morning CBSE & Afternoon State Board shifts.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenSaveModal}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center space-x-2 border-2 border-emerald-900 cursor-pointer hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>Save Current Grid Snapshot</span>
          </button>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-800 space-y-1">
            <span className="text-[10px] font-black text-teal-900 dark:text-teal-300 uppercase tracking-wider">TOTAL VERSIONS IN SESSION</span>
            <p className="text-2xl font-black text-teal-950 dark:text-white">{timetableVersions.length} Saved Snapshots</p>
            <p className="text-[11px] text-teal-800 dark:text-teal-300 font-bold">1-Click restore any historical timetable</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 space-y-1">
            <span className="text-[10px] font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">CURRENT ACTIVE GRID</span>
            <p className="text-base font-black text-emerald-950 dark:text-emerald-200 truncate">
              {activeVersion?.name || 'Baseline Schedule'}
            </p>
            <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white border border-emerald-700">
              ACTIVE LOADED GRID
            </span>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-300 dark:border-indigo-800 space-y-1">
            <span className="text-[10px] font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">LATEST SAVED VERSION</span>
            <p className="text-base font-black text-indigo-950 dark:text-indigo-200 truncate">
              {latestVersion?.name || 'v1.0 Baseline'}
            </p>
            <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white border border-indigo-700">
              MOST RECENT REVISION
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search saved versions by name, notes, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600"
          />
        </div>

        <button
          onClick={() => {
            setActiveTab('generator');
            setActiveSubTab('grid');
          }}
          className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow border border-indigo-900 flex items-center space-x-1.5 cursor-pointer"
        >
          <Layers className="h-4 w-4" />
          <span>Open Live Grid Matrix</span>
        </button>
      </div>

      {/* Main Version History Table */}
      <div className="glass-panel rounded-2xl border-2 border-slate-300 dark:border-slate-800 overflow-hidden shadow-xl bg-white dark:bg-slate-900">
        {filteredVersions.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-3">
            <History className="h-12 w-12 text-slate-400 mx-auto" />
            <p className="text-base font-black text-slate-900 dark:text-white">No timetable versions match your search filter.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-indigo-700 text-white text-xs font-black rounded-xl"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
              <tr>
                <th className="p-4">Version Name & Status Badges</th>
                <th className="p-4">Description & Notes</th>
                <th className="p-4">Saved Date & Time</th>
                <th className="p-4">Created By (Role)</th>
                <th className="p-4 text-center">Score %</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
              {filteredVersions.map((ver, idx) => {
                const isActive = ver.id === activeVersionId;
                const isLatest = idx === 0;
                const isBaseline = ver.id === 'VER-001';

                return (
                  <tr key={ver.id} className={`transition-colors ${isActive ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-l-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}>
                    <td className="p-4 font-black text-indigo-950 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-black text-slate-950 dark:text-white">{ver.name}</p>
                        {isActive && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black border border-emerald-700 shadow-sm animate-pulse">
                            ACTIVE GRID
                          </span>
                        )}
                        {isLatest && !isActive && (
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black border border-indigo-700">
                            LATEST SAVED
                          </span>
                        )}
                        {isBaseline && (
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black border border-purple-700">
                            BASELINE PRESET
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono font-black">{ver.id} • {ver.slotsCount || 120} Periods Scheduled</span>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-extrabold max-w-xs">{ver.description}</td>
                    <td className="p-4 font-mono text-slate-800 dark:text-slate-300 font-black">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5 text-indigo-600" />
                        <span>{ver.timestamp}</span>
                      </span>
                    </td>
                    <td className="p-4 font-black text-slate-900 dark:text-slate-200">{ver.createdBy}</td>
                    <td className="p-4 text-center font-black text-emerald-700 dark:text-emerald-400">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-black">
                        {ver.optimizationScore}%
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {isActive ? (
                        <span className="px-4 py-2 bg-emerald-100 text-emerald-950 text-xs font-black rounded-xl border border-emerald-300 inline-flex items-center space-x-1">
                          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                          <span>Currently Active Grid</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            restoreTimetableVersion(ver.id);
                            setActiveTab('generator');
                            setActiveSubTab('grid');
                          }}
                          className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-1.5 inline-flex border border-indigo-900 cursor-pointer hover:scale-105 transition-all"
                          title="Restore this timetable version onto live grid"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>Restore Version</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteTimetableVersion(ver.id)}
                        className="p-2 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 hover:text-rose-700 rounded-xl inline-flex cursor-pointer transition-colors"
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

      {/* Save Version Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border-2 border-slate-300 dark:border-slate-700 p-6 space-y-5 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Save className="h-5 w-5 text-emerald-700" />
                <span>Save Timetable Version Snapshot</span>
              </h3>
              <button onClick={() => setSaveModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSaveVersion} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Version Name / Title</label>
                <input
                  type="text"
                  value={versionNameInput}
                  onChange={(e) => setVersionNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. v1.2 - Added Physics Lab Cover"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Version Description / Notes</label>
                <input
                  type="text"
                  value={versionDescInput}
                  onChange={(e) => setVersionDescInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Swapped Math to period 2 for Grade 9A"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-lg border border-emerald-900 flex items-center space-x-1.5 cursor-pointer"
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

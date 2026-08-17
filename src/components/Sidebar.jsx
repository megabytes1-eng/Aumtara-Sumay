import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  LayoutDashboard,
  Building,
  Clock,
  Layers,
  BookOpen,
  Users,
  DoorOpen,
  Sliders,
  CalendarDays,
  Sparkles,
  Grid,
  AlertOctagon,
  UserX,
  UserCheck,
  FileSpreadsheet,
  FileText,
  Printer,
  Settings,
  ChevronDown,
  ChevronRight,
  School,
  BarChart3,
  HelpCircle,
  History,
  PanelLeftClose,
  ShieldAlert,
  Award
} from 'lucide-react';
import HelpGuideModal from './HelpGuideModal';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    conflicts,
    timetableVersions,
    isSidebarOpen,
    toggleSidebar,
    currentUser,
    subscribedSchools
  } = useTimetable();

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Submenu Collapsible Toggle State
  const [openSubmenus, setOpenSubmenus] = useState({
    setup: true,
    data: true,
    workspace: true,
    substitute: true,
    tools: true,
    reports: true
  });

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavClick = (tab, subtab = '') => {
    setActiveTab(tab);
    setActiveSubTab(subtab);
  };

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r-2 border-slate-300 dark:border-slate-800 flex flex-col h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto select-none no-print shadow-sm">
      <div className="p-4 space-y-5">
        {/* Navigation Group: Main */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-black tracking-wider text-slate-800 dark:text-slate-300 uppercase">
              Main Command
            </p>
            <button
              onClick={toggleSidebar}
              className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-amber-300 transition-colors"
              title="Hide Sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-700 text-white shadow-md border border-indigo-800'
                : 'text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Navigation Group: Institutional Setup */}
        <div>
          <button
            onClick={() => toggleSubmenu('setup')}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-black tracking-wider text-slate-800 dark:text-slate-300 uppercase hover:text-indigo-700"
          >
            <span>Institutional Setup</span>
            {openSubmenus.setup ? (
              <ChevronDown className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            )}
          </button>

          {openSubmenus.setup && (
            <div className="mt-1.5 space-y-1 pl-2">
              <button
                onClick={() => handleNavClick('setup', 'academic')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'setup' && activeSubTab === 'academic'
                    ? 'bg-indigo-700 text-white shadow-sm'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <School className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                <span>Academic Info</span>
              </button>

              <button
                onClick={() => handleNavClick('setup', 'bell')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'setup' && activeSubTab === 'bell'
                    ? 'bg-indigo-700 text-white shadow-sm'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Clock className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                <span>Bell Schedule & Shifts</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Group: Master Data */}
        <div>
          <button
            onClick={() => toggleSubmenu('data')}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-black tracking-wider text-slate-800 dark:text-slate-300 uppercase hover:text-indigo-700"
          >
            <span>Master Data Setup</span>
            {openSubmenus.data ? (
              <ChevronDown className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            )}
          </button>

          {openSubmenus.data && (
            <div className="mt-1.5 space-y-1 pl-2">
              <button
                onClick={() => handleNavClick('data', 'classes')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'data' && activeSubTab === 'classes'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                <span>Classes & Sections</span>
              </button>

              <button
                onClick={() => handleNavClick('data', 'subjects')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'data' && activeSubTab === 'subjects'
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                <span>Subjects Catalog</span>
              </button>

              <button
                onClick={() => handleNavClick('data', 'teachers')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'data' && activeSubTab === 'teachers'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                <span>Teachers Directory</span>
              </button>

              <button
                onClick={() => handleNavClick('data', 'rooms')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'data' && activeSubTab === 'rooms'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <DoorOpen className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                <span>Rooms & Labs</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Item: Rules & Constraints */}
        <div>
          <button
            onClick={() => handleNavClick('constraints')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'constraints'
                ? 'bg-indigo-700 text-white shadow-md border border-indigo-800'
                : 'text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="h-4 w-4 text-teal-700 dark:text-teal-400" />
            <span>Rules & Constraints</span>
          </button>
        </div>

        {/* Navigation Group: Timetable Workspace */}
        <div>
          <button
            onClick={() => toggleSubmenu('workspace')}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-black tracking-wider text-slate-800 dark:text-slate-300 uppercase hover:text-indigo-700"
          >
            <span>Generator & Grid</span>
            {openSubmenus.workspace ? (
              <ChevronDown className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            )}
          </button>

          {openSubmenus.workspace && (
            <div className="mt-1.5 space-y-1 pl-2">
              <button
                onClick={() => handleNavClick('generator', 'ai')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'generator' && activeSubTab === 'ai'
                    ? 'bg-indigo-700 text-white shadow-sm'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                <span>AI Generator</span>
              </button>

              <button
                onClick={() => handleNavClick('generator', 'grid')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'generator' && activeSubTab === 'grid'
                    ? 'bg-indigo-700 text-white shadow-sm'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Grid className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                <span>Drag & Drop Matrix</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Group: Substitute Management */}
        <div>
          <button
            onClick={() => toggleSubmenu('substitute')}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-black tracking-wider text-slate-800 dark:text-slate-300 uppercase hover:text-indigo-700 font-sans"
          >
            <span>Substitute Management</span>
            {openSubmenus.substitute ? (
              <ChevronDown className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            )}
          </button>

          {openSubmenus.substitute && (
            <div className="mt-1.5 space-y-1 pl-2">
              <button
                onClick={() => handleNavClick('substitute', 'absent')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'substitute' && activeSubTab === 'absent'
                    ? 'bg-rose-700 text-white shadow-sm'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <UserX className="h-4 w-4 text-rose-700 dark:text-rose-400" />
                <span>Absentee Tracker</span>
              </button>

              <button
                onClick={() => handleNavClick('substitute', 'finder')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'substitute' && activeSubTab === 'finder'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <UserCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                <span>Smart Cover Finder</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Group: Reports & DEO */}
        <div>
          <button
            onClick={() => toggleSubmenu('reports')}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-black tracking-wider text-slate-800 dark:text-slate-300 uppercase hover:text-indigo-700 font-sans"
          >
            <span>DEO Official Reports</span>
            {openSubmenus.reports ? (
              <ChevronDown className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            )}
          </button>

          {openSubmenus.reports && (
            <div className="mt-1.5 space-y-1 pl-2">
              <button
                onClick={() => handleNavClick('reports', 'export')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  activeTab === 'reports' && activeSubTab === 'export'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>🏛️ DEO Official Formats</span>
              </button>
            </div>
          )}
        </div>

        {/* System Settings */}
        <div>
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-700 text-white shadow-md border border-indigo-800'
                : 'text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <span>System Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

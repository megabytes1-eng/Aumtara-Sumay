import React, { useState, useEffect } from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  HelpCircle,
  X,
  Search,
  BookOpen,
  Layers,
  Sparkles,
  UserX,
  FileSpreadsheet,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  ShieldCheck,
  Clock,
  DoorOpen,
  Users,
  LayoutDashboard,
  Filter
} from 'lucide-react';

export default function HelpGuideModal({ isOpen, onClose }) {
  const { activeTab, activeSubTab } = useTimetable();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCurrentPageOnly, setShowCurrentPageOnly] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState('menu-0');

  const tabToTopicId = {
    dashboard: 'menu-0',
    setup: 'menu-1',
    data: 'menu-2',
    constraints: 'menu-3',
    generator: 'menu-4',
    substitute: 'menu-5',
    tools: 'menu-6',
    reports: 'menu-7',
    settings: 'menu-8'
  };

  const tabNames = {
    dashboard: 'Dashboard & Command Hub',
    setup: '1. Institutional Setup',
    data: '2. Master Data Setup',
    constraints: '3. Constraints & Rules Engine',
    generator: '4. Generator & Grid Workspace',
    substitute: '5. Substitute Management',
    tools: '6. Free Tools & Workload Analyzer',
    reports: '7. Reports & Exports',
    settings: '8. System Settings & RBAC'
  };

  useEffect(() => {
    if (isOpen) {
      const topicId = tabToTopicId[activeTab] || 'menu-0';
      setSelectedTopicId(topicId);
      setShowCurrentPageOnly(true);
      setSearchTerm('');
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const helpTopics = [
    {
      id: 'menu-0',
      tabKey: 'dashboard',
      title: 'Dashboard & Command Hub',
      submenu: 'Overview, Solver Score, Metric Cards & Live Matrix',
      icon: LayoutDashboard,
      fields: [
        {
          name: 'Global Shift Selector (Navbar / Header)',
          location: 'Dashboard -> Top Header',
          whatToFill: 'Click "Morning Shift", "Afternoon Shift", or "Combined Shifts" to filter dashboard stats and live matrices.',
          wrongFilling: 'Expecting afternoon state board classes to appear when set to Morning CBSE filter.',
          errorMsg: 'Filter Notice: Views are filtered to active selected shift.'
        },
        {
          name: 'Dynamic Metric Cards',
          location: 'Dashboard -> Stats Grid',
          whatToFill: 'Click any metric card (Classes, Subjects, Faculty, Rooms) to jump directly to its management page.',
          wrongFilling: 'Clicking cards when session permissions are restricted.',
          errorMsg: 'Navigation: Redirects to target setup subtab.'
        },
        {
          name: 'Dual-Shift Solver Score Ring',
          location: 'Dashboard -> Right Widget',
          whatToFill: 'Displays overall conflict-free score % (Target: 100% Zero Clash).',
          wrongFilling: 'Ignoring conflict alerts when score drops below 90%.',
          errorMsg: 'Conflict Alert: Click "Solve Conflicts" to auto-resolve timetable overlaps.'
        }
      ]
    },
    {
      id: 'menu-1',
      tabKey: 'setup',
      title: '1. Institutional Setup (School & Shift Setup)',
      submenu: 'Academic Info, Bell Schedule & Shift Timings',
      icon: Clock,
      fields: [
        {
          name: 'Institution Name & Board Mode',
          location: 'Institutional Setup -> Academic Info',
          whatToFill: 'Enter official school name and select Dual-Board mode (State Board & CBSE).',
          wrongFilling: 'Leaving empty, single-character abbreviations, or special characters only.',
          errorMsg: 'Validation Error: Institution Name is required.'
        },
        {
          name: 'Shift Start Time & End Time',
          location: 'Institutional Setup -> Shift Timings Editor',
          whatToFill: 'Morning shift start (07:30 AM to 01:00 PM), Afternoon shift (01:15 PM to 06:15 PM).',
          wrongFilling: 'End time set earlier than start time (e.g. Start 02:00 PM, End 10:00 AM).',
          errorMsg: 'Invalid Shift Range: Shift start time must precede shift end time.'
        },
        {
          name: 'Period Duration (Minutes)',
          location: 'Institutional Setup -> Shift Timings Editor',
          whatToFill: 'Standard period length in minutes (e.g. 40 mins or 45 mins).',
          wrongFilling: 'Entering 0, negative numbers, or duration exceeding shift length (e.g. 500 mins).',
          errorMsg: 'Invalid Period Length: Duration must be between 20 and 90 minutes.'
        },
        {
          name: 'Recess Break Position & Duration',
          location: 'Institutional Setup -> Shift Timings Editor',
          whatToFill: 'Period position after which recess occurs (e.g. After Period 4) and duration (e.g. 30 mins).',
          wrongFilling: 'Setting recess position higher than total periods (e.g. Recess after Period 12 when total is 7).',
          errorMsg: 'Recess Position Error: Recess period must be within active period slots.'
        }
      ]
    },
    {
      id: 'menu-2',
      tabKey: 'data',
      title: '2. Master Data Setup (Classes, Subjects, Faculty, Rooms)',
      submenu: 'Classes, Subjects Catalog, Teachers Directory, Rooms & Labs',
      icon: Layers,
      fields: [
        {
          name: 'Class Display Name & Grade',
          location: 'Master Data Setup -> Classes',
          whatToFill: 'Grade and section name with board tag (e.g. Grade 9A CBSE Morning or Grade 10B State Board Afternoon).',
          wrongFilling: 'Duplicate class names or missing section identifiers.',
          errorMsg: 'Duplicate Record: Class name already exists in master database.'
        },
        {
          name: 'Curriculum Board & Assigned Shift',
          location: 'Master Data Setup -> Classes',
          whatToFill: 'Select CBSE or ICSE for Morning Shift; State Board English Medium for Afternoon Shift.',
          wrongFilling: 'Assigning Morning shift classes to afternoon-only rooms without shared tag.',
          errorMsg: 'Shift Mismatch: Class shift does not match designated room availability.'
        },
        {
          name: 'Subject Code & Weekly Periods',
          location: 'Master Data Setup -> Subjects',
          whatToFill: 'Short uppercase code (e.g. MATH-101, ENG-202) and weekly period count (1 to 12).',
          wrongFilling: 'Setting weekly periods higher than working days x total periods.',
          errorMsg: 'Capacity Exceeded: Weekly periods exceed total available weekly slots.'
        },
        {
          name: 'Teacher Designated Off-Day & Max Weekly Load',
          location: 'Master Data Setup -> Teachers Directory',
          whatToFill: 'Off-day (e.g. Wednesday or None) and max weekly periods (e.g. 24 periods/week).',
          wrongFilling: 'Assigning a teacher to teach on their designated off-day or exceeding weekly cap.',
          errorMsg: 'Teacher Off-Day Violation: Faculty member is on designated off-day.'
        },
        {
          name: 'Room Code & Seating Capacity',
          location: 'Master Data Setup -> Rooms & Labs',
          whatToFill: 'Room code (e.g. Room 101, Physics Lab) and student capacity (e.g. 45 seats).',
          wrongFilling: 'Assigning a class of 50 students to a lab with capacity of 25 seats.',
          errorMsg: 'Room Capacity Deficit: Class student count exceeds room seating capacity.'
        }
      ]
    },
    {
      id: 'menu-3',
      tabKey: 'constraints',
      title: '3. Constraints & Rules (Dual-Shift Rules)',
      submenu: 'Shift Rules, Teacher Workload, Room Occupancy Rules',
      icon: ShieldCheck,
      fields: [
        {
          name: 'Teacher Double-Booking Prevention',
          location: 'Constraints & Rules -> Hard Constraints',
          whatToFill: 'Toggle enabled (Default: Active). Prevents a teacher from being assigned to 2 classes in same period.',
          wrongFilling: 'Disabling rule during manual grid drag-and-drop.',
          errorMsg: 'Teacher Double-Booking Alert: Faculty member assigned to 2 simultaneous classes.'
        },
        {
          name: 'Room Collision Across Shifts',
          location: 'Constraints & Rules -> Hard Constraints',
          whatToFill: 'Toggle enabled. Prevents Morning CBSE and Afternoon State Board from occupying same room simultaneously.',
          wrongFilling: 'Scheduling overlapping period times for shared rooms.',
          errorMsg: 'Room Occupancy Overlap: Room is already occupied by another shift class.'
        }
      ]
    },
    {
      id: 'menu-4',
      tabKey: 'generator',
      title: '4. Generator & Grid (Dual-Shift AI Solver & Matrix)',
      submenu: 'Dual-Shift AI Solver, Drag & Drop Matrix, Version History',
      icon: Sparkles,
      fields: [
        {
          name: 'Re-Run Dual-Shift AI Solver Button',
          location: 'Generator & Grid -> AI Solver',
          whatToFill: 'Click to automatically compute 100% conflict-free timetable across Morning & Afternoon shifts.',
          wrongFilling: 'Running solver with 0 teachers or 0 classes configured.',
          errorMsg: 'Data Missing Error: Configure at least 1 Class, Subject, and Teacher before running AI.'
        },
        {
          name: 'Drag & Drop Grid Matrix Cell',
          location: 'Generator & Grid -> Drag & Drop Matrix',
          whatToFill: 'Drag any subject card to swap period slots between days or periods.',
          wrongFilling: 'Dropping card onto an already occupied slot with teacher or room collision.',
          errorMsg: 'Warning Toast: Shift Conflict Warning: Teacher or Room already occupied.'
        },
        {
          name: 'Save Version Snapshot Button',
          location: 'Generator & Grid -> Saved Versions & History',
          whatToFill: 'Save current grid state under a custom version name and timestamp.',
          wrongFilling: 'Overwriting baseline without saving a snapshot.',
          errorMsg: 'Snapshot Info: Saves version permanently into session history.'
        }
      ]
    },
    {
      id: 'menu-5',
      tabKey: 'substitute',
      title: '5. Substitute Management (Absentee Tracker & Cover Finder)',
      submenu: 'Absentee Tracker, Smart Cover Finder',
      icon: UserX,
      fields: [
        {
          name: 'Mark Teacher Absent Form',
          location: 'Substitute Management -> Absentee Tracker',
          whatToFill: 'Select absent teacher, date, affected periods, and leave reason.',
          wrongFilling: 'Marking a teacher absent on a date they have 0 scheduled classes.',
          errorMsg: 'No Classes Found: Selected teacher has no scheduled periods on this date.'
        },
        {
          name: 'Assign Substitute Cover Button',
          location: 'Substitute Management -> Smart Cover Finder',
          whatToFill: 'Click "Assign Substitute Cover" next to top AI-recommended free teacher (95% match).',
          wrongFilling: 'Assigning a substitute who is already teaching another class in that period.',
          errorMsg: 'Substitute Busy Warning: Recommended cover faculty is already occupied.'
        }
      ]
    },
    {
      id: 'menu-6',
      tabKey: 'tools',
      title: '6. Free Tools & Load (Free Teacher Finder & Workload)',
      submenu: 'Free Teacher Finder, Workload Analyzer',
      icon: Users,
      fields: [
        {
          name: 'Instant Free Teacher Lookup Filter',
          location: 'Free Tools -> Free Teacher Finder',
          whatToFill: 'Select Day (Monday..Saturday) and Period (1..7) to instantly list all free teachers.',
          wrongFilling: 'Searching for a teacher name that does not exist in master directory.',
          errorMsg: 'No Results Found: No available teachers match your search filter.'
        }
      ]
    },
    {
      id: 'menu-7',
      tabKey: 'reports',
      title: '7. Reports & Exports (PDF & CSV Export)',
      submenu: 'Master Dual-Shift Matrix, Class & Faculty Schedules',
      icon: FileSpreadsheet,
      fields: [
        {
          name: 'Export Combined CSV / Print PDF',
          location: 'Reports & Exports -> Header Actions',
          whatToFill: 'Select Shift Filter (All Shifts / Morning / Afternoon) and click Export CSV or Print PDF.',
          wrongFilling: 'Attempting to print with empty timetable data.',
          errorMsg: 'Export Alert: Timetable is empty. Generate or load sample data before exporting.'
        }
      ]
    },
    {
      id: 'menu-8',
      tabKey: 'settings',
      title: '8. System Settings (RBAC & Backup Restore)',
      submenu: 'RBAC Switcher & Editor, Backup JSON Export & Upload Restore',
      icon: Settings,
      fields: [
        {
          name: 'Role-Based Access Control (RBAC) Switcher',
          location: 'System Settings -> RBAC Switcher',
          whatToFill: 'Click Academic Administrator, Department HOD, or Faculty Staff card to switch active session role.',
          wrongFilling: 'Unchecking all permissions for Academic Administrator role.',
          errorMsg: 'Access Restricted: Permission required to modify system settings.'
        },
        {
          name: 'Upload & Restore Backup JSON',
          location: 'System Settings -> Backup Restore Center',
          whatToFill: 'Click "Upload & Restore Backup" and select a valid .json file from your Downloads folder.',
          wrongFilling: 'Uploading non-JSON files (e.g. .pdf, .docx, .png) or corrupt file text.',
          errorMsg: 'Invalid File Format: Selected file is not a valid AUMTARA SAMAY JSON backup.'
        }
      ]
    }
  ];

  const currentTopicId = tabToTopicId[activeTab] || 'menu-0';

  const displayedTopics = helpTopics.filter((topic) => {
    if (showCurrentPageOnly && topic.id !== selectedTopicId && topic.id !== currentTopicId) {
      return false;
    }

    if (!searchTerm) return true;

    return (
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.submenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.fields.some(
        (f) =>
          f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.whatToFill.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.wrongFilling.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.errorMsg.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-700 text-white flex items-center justify-center shadow-md">
              <HelpCircle className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Field & Page User Guide
                </h2>
                <span className="px-3 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase border border-amber-500 shadow-sm flex items-center space-x-1">
                  <Filter className="h-3 w-3" />
                  <span>Showing: {tabNames[activeTab] || 'Current Page'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-extrabold mt-0.5">
                Field-by-field instructions, correct inputs, common mistakes, and error flags.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Current Page Banner & Scope Switcher */}
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-xs font-black text-amber-950 dark:text-amber-200">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>
              🎯 Auto-Detected Active Screen: <strong className="underline uppercase">{tabNames[activeTab]}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setShowCurrentPageOnly(true);
                setSelectedTopicId(currentTopicId);
              }}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                showCurrentPageOnly
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
              }`}
            >
              Current Page Only
            </button>
            <button
              onClick={() => setShowCurrentPageOnly(false)}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                !showCurrentPageOnly
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
              }`}
            >
              View All 9 Menus Guide
            </button>
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search field names, error messages, or what to fill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-100/50 dark:bg-slate-900/50">
          {displayedTopics.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <BookOpen className="h-12 w-12 text-slate-400 mx-auto" />
              <p className="text-base font-black text-slate-800 dark:text-slate-200">No matching help fields found.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowCurrentPageOnly(false);
                }}
                className="px-4 py-2 bg-indigo-700 text-white text-xs font-black rounded-xl"
              >
                Clear Search & Show All Topics
              </button>
            </div>
          ) : (
            displayedTopics.map((topic) => {
              const IconComp = topic.icon;
              const isCurrent = topic.id === currentTopicId;

              return (
                <div
                  key={topic.id}
                  className={`rounded-2xl border-2 p-6 bg-white dark:bg-slate-900 shadow-md space-y-5 ${
                    isCurrent
                      ? 'border-amber-500/80 ring-2 ring-amber-400/30'
                      : 'border-slate-300 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl text-white ${isCurrent ? 'bg-amber-600' : 'bg-indigo-700'}`}>
                        <IconComp className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-black text-slate-950 dark:text-white">{topic.title}</h3>
                          {isCurrent && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase">
                              Active Screen
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">{topic.submenu}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fields Table */}
                  <div className="space-y-4">
                    {topic.fields.map((field, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-indigo-950 dark:text-amber-300 flex items-center space-x-2">
                            <ChevronRight className="h-4 w-4 text-indigo-600" />
                            <span>{field.name}</span>
                          </span>
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                            📍 {field.location}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          {/* What to fill */}
                          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                            <p className="font-black text-emerald-900 dark:text-emerald-300 flex items-center space-x-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              <span>What to Fill (Correct Input):</span>
                            </p>
                            <p className="text-slate-800 dark:text-slate-200 font-extrabold text-[11px] leading-relaxed">
                              {field.whatToFill}
                            </p>
                          </div>

                          {/* Wrong filling */}
                          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1">
                            <p className="font-black text-amber-900 dark:text-amber-300 flex items-center space-x-1">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                              <span>Wrong Filling / Common Mistake:</span>
                            </p>
                            <p className="text-slate-800 dark:text-slate-200 font-extrabold text-[11px] leading-relaxed">
                              {field.wrongFilling}
                            </p>
                          </div>

                          {/* Error message */}
                          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 space-y-1">
                            <p className="font-black text-rose-900 dark:text-rose-300 flex items-center space-x-1">
                              <Info className="h-3.5 w-3.5 text-rose-600" />
                              <span>Error Flag / System Warning:</span>
                            </p>
                            <p className="text-slate-800 dark:text-slate-200 font-extrabold text-[11px] leading-relaxed">
                              {field.errorMsg}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

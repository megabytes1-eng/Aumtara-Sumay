import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  Layers,
  BookOpen,
  Users,
  DoorOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  X
} from 'lucide-react';

export default function DataManagement() {
  const {
    classes,
    addClass,
    updateClass,
    deleteClass,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    rooms,
    addRoom,
    updateRoom,
    deleteRoom,
    activeSubTab,
    setActiveSubTab,
    selectedShiftFilter
  } = useTimetable();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form States with Shift fields
  const [classForm, setClassForm] = useState({
    name: '',
    grade: '9',
    section: 'A',
    board: 'State Board',
    shift: 'Afternoon Shift',
    classTeacherId: '',
    roomPrefId: '',
    capacity: 45,
    subjects: []
  });

  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    category: 'Core',
    weeklyPeriods: 5,
    maxDailyPeriods: 1,
    isLab: false,
    roomType: 'Classroom',
    color: '#3b82f6',
    shift: 'Afternoon Shift'
  });

  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [],
    maxDaily: 5,
    maxWeekly: 24,
    offDay: 'None',
    shift: 'Afternoon Shift'
  });

  const [roomForm, setRoomForm] = useState({
    name: '',
    building: 'Main Block',
    floor: '1st Floor',
    type: 'Classroom',
    capacity: 40,
    features: ['Smart Board', 'Projector'],
    shift: 'Shared (Both Shifts)'
  });

  const currentTab = activeSubTab || 'classes';

  const filteredClasses = (classes || []).filter(
    (c) => c && (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) && (selectedShiftFilter === 'All Shifts' || c.shift === selectedShiftFilter || c.shift === 'Both Shifts')
  );

  const filteredTeachers = (teachers || []).filter(
    (t) => t && ((t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (t.email || '').toLowerCase().includes(searchTerm.toLowerCase())) && (selectedShiftFilter === 'All Shifts' || t.shift === selectedShiftFilter || t.shift === 'Both Shifts')
  );

  const filteredSubjects = (subjects || []).filter(
    (s) => s && ((s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.code || '').toLowerCase().includes(searchTerm.toLowerCase())) && (selectedShiftFilter === 'All Shifts' || s.shift === selectedShiftFilter || s.shift === 'Both Shifts')
  );

  const filteredRooms = (rooms || []).filter(
    (r) => r && (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) && (selectedShiftFilter === 'All Shifts' || r.shift === selectedShiftFilter || r.shift === 'Shared (Both Shifts)')
  );

  const handleOpenModal = (item = null) => {
    setEditingItem(item);

    if (currentTab === 'classes') {
      setClassForm(
        item
          ? { ...item }
          : {
              name: '',
              grade: '9',
              section: 'A',
              board: 'State Board',
              shift: 'Afternoon Shift',
              classTeacherId: teachers[0]?.id || '',
              roomPrefId: rooms[0]?.id || '',
              capacity: 45,
              subjects: subjects.slice(0, 5).map((s) => s.id)
            }
      );
    } else if (currentTab === 'subjects') {
      setSubjectForm(
        item
          ? { ...item }
          : {
              code: '',
              name: '',
              category: 'Core',
              weeklyPeriods: 5,
              maxDailyPeriods: 1,
              isLab: false,
              roomType: 'Classroom',
              color: '#3b82f6',
              shift: 'Afternoon Shift'
            }
      );
    } else if (currentTab === 'teachers') {
      setTeacherForm(
        item
          ? { ...item, subjects: item.subjects || [] }
          : {
              name: '',
              email: '',
              phone: '',
              subjects: subjects[0] ? [subjects[0].id] : [],
              maxDaily: 5,
              maxWeekly: 24,
              offDay: 'None',
              shift: 'Afternoon Shift'
            }
      );
    } else if (currentTab === 'rooms') {
      setRoomForm(
        item
          ? { ...item, features: item.features || [] }
          : {
              name: '',
              building: 'Main Block',
              floor: '1st Floor',
              type: 'Classroom',
              capacity: 40,
              features: ['Smart Board', 'Projector'],
              shift: 'Shared (Both Shifts)'
            }
      );
    }
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentTab === 'classes') {
      if (editingItem) updateClass(classForm);
      else addClass(classForm);
    } else if (currentTab === 'subjects') {
      if (editingItem) updateSubject(subjectForm);
      else addSubject(subjectForm);
    } else if (currentTab === 'teachers') {
      if (editingItem) updateTeacher(teacherForm);
      else addTeacher(teacherForm);
    } else if (currentTab === 'rooms') {
      if (editingItem) updateRoom(roomForm);
      else addRoom(roomForm);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subtab Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('classes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'classes'
                ? 'bg-purple-700 text-white shadow-md border border-purple-800'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Classes ({classes.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('subjects')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'subjects'
                ? 'bg-blue-700 text-white shadow-md border border-blue-800'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Subjects ({subjects.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('teachers')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'teachers'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-800'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Teachers Directory ({teachers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('rooms')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              currentTab === 'rooms'
                ? 'bg-amber-600 text-white shadow-md border border-amber-700'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <DoorOpen className="h-4 w-4" />
            <span>Rooms & Labs ({rooms.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${currentTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <button
            onClick={() => {
              setActiveTab('settings');
            }}
            className="flex items-center space-x-1.5 px-3 py-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/50 dark:hover:bg-rose-900 text-rose-900 dark:text-rose-200 text-xs font-black rounded-xl transition-all border border-rose-300 dark:border-rose-700 cursor-pointer"
            title="Clear all system data and start entering new data from scratch"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-700 dark:text-rose-400" />
            <span>Wipe & Start Fresh</span>
          </button>

          <button
            onClick={() => handleOpenModal(null)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 border border-indigo-900 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New {currentTab === 'classes' ? 'Class' : currentTab === 'subjects' ? 'Subject' : currentTab === 'teachers' ? 'Teacher' : 'Room'}</span>
          </button>
        </div>
      </div>

      {/* 1. Classes List */}
      {currentTab === 'classes' && (
        <div className="glass-panel rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Class Name</th>
                <th className="p-3.5">Board & Shift</th>
                <th className="p-3.5">Class Teacher</th>
                <th className="p-3.5">Shared Room</th>
                <th className="p-3.5">Capacity</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-500">
                    <div className="space-y-3 py-4">
                      <Layers className="h-10 w-10 text-purple-600 mx-auto" />
                      <p className="text-base font-black text-slate-950 dark:text-white">No Classes Data Found</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold max-w-sm mx-auto">
                        Class data is currently empty. Click below to add new grade sections or start fresh.
                      </p>
                      <button onClick={() => handleOpenModal(null)} className="px-4 py-2 bg-indigo-700 text-white text-xs font-black rounded-xl shadow border border-indigo-900 cursor-pointer">
                        + Add New Class Section
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => {
                  const teacher = teachers.find((t) => t.id === cls.classTeacherId);
                  const room = rooms.find((r) => r.id === cls.roomPrefId);
                  return (
                    <tr key={cls.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 font-black text-indigo-950 dark:text-white">{cls.name}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] border ${
                          cls.shift === 'Afternoon Shift'
                            ? 'bg-purple-100 text-purple-950 border-purple-300 dark:bg-purple-500/20 dark:text-purple-300'
                            : 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}>
                          {cls.board} ({cls.shift})
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-900 dark:text-slate-200 font-black">{teacher ? teacher.name : 'Unassigned'}</td>
                      <td className="p-3.5 text-slate-900 dark:text-slate-200 font-black">{room ? room.name : 'Unassigned'}</td>
                      <td className="p-3.5 font-mono text-slate-900 dark:text-slate-200 font-black">{cls.capacity} Students</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button onClick={() => handleOpenModal(cls)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteClass(cls.id)} className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-700 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Subjects List */}
      {currentTab === 'subjects' && (
        <div className="glass-panel rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Subject Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Shift Tag</th>
                <th className="p-3.5">Weekly Periods</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-500">
                    <div className="space-y-3 py-4">
                      <BookOpen className="h-10 w-10 text-blue-600 mx-auto" />
                      <p className="text-base font-black text-slate-950 dark:text-white">No Subjects Data Found</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold max-w-sm mx-auto">
                        Subjects catalog is currently empty. Click below to add new subject courses.
                      </p>
                      <button onClick={() => handleOpenModal(null)} className="px-4 py-2 bg-indigo-700 text-white text-xs font-black rounded-xl shadow border border-indigo-900 cursor-pointer">
                        + Add New Subject
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-black font-mono" style={{ color: sub.color }}>{sub.code}</td>
                    <td className="p-3.5 font-black text-indigo-950 dark:text-white">{sub.name}</td>
                    <td className="p-3.5 font-black">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-300 text-[10px] font-black">
                        {sub.category} {sub.isLab ? '(Lab)' : ''}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-slate-900 dark:text-slate-200">{sub.shift}</td>
                    <td className="p-3.5 font-mono text-slate-900 dark:text-slate-200 font-black">{sub.weeklyPeriods} Periods / Wk</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button onClick={() => handleOpenModal(sub)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteSubject(sub.id)} className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-700 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Teachers Directory List */}
      {currentTab === 'teachers' && (
        <div className="glass-panel rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Teacher Name</th>
                <th className="p-3.5">Contact Email & Phone</th>
                <th className="p-3.5">Primary Shift</th>
                <th className="p-3.5">Designated Off-Day</th>
                <th className="p-3.5">Max Weekly Load</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-500">
                    <div className="space-y-3 py-4">
                      <Users className="h-10 w-10 text-emerald-600 mx-auto" />
                      <p className="text-base font-black text-slate-950 dark:text-white">No Teachers Data Found</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold max-w-sm mx-auto">
                        Teacher names data has been cleared. Click below to add new faculty staff or start fresh.
                      </p>
                      <button onClick={() => handleOpenModal(null)} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow border border-emerald-900 cursor-pointer">
                        + Add New Teacher Staff
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((tch) => (
                  <tr key={tch.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-black text-indigo-950 dark:text-white">{tch.name}</td>
                    <td className="p-3.5 font-mono text-slate-900 dark:text-slate-200 font-black">{tch.email || 'N/A'} • {tch.phone || 'N/A'}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 text-[10px] font-black">
                        {tch.shift}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-indigo-700 dark:text-indigo-300">{tch.offDay}</td>
                    <td className="p-3.5 font-mono text-slate-900 dark:text-slate-200 font-black">{tch.maxWeekly} Periods / Wk</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button onClick={() => handleOpenModal(tch)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteTeacher(tch.id)} className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-700 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Rooms & Labs List */}
      {currentTab === 'rooms' && (
        <div className="glass-panel rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Room Name / Code</th>
                <th className="p-3.5">Building & Floor</th>
                <th className="p-3.5">Room Type</th>
                <th className="p-3.5">Shift Availability</th>
                <th className="p-3.5">Student Capacity</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-500">
                    <div className="space-y-3 py-4">
                      <DoorOpen className="h-10 w-10 text-amber-600 mx-auto" />
                      <p className="text-base font-black text-slate-950 dark:text-white">No Rooms Data Found</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold max-w-sm mx-auto">
                        Rooms directory is currently empty. Click below to add new classroom or lab facilities.
                      </p>
                      <button onClick={() => handleOpenModal(null)} className="px-4 py-2 bg-indigo-700 text-white text-xs font-black rounded-xl shadow border border-indigo-900 cursor-pointer">
                        + Add New Room
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRooms.map((rm) => (
                  <tr key={rm.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-black text-indigo-950 dark:text-white">{rm.name}</td>
                    <td className="p-3.5 text-slate-900 dark:text-slate-200 font-black">{rm.building} ({rm.floor})</td>
                    <td className="p-3.5 font-black text-amber-700 dark:text-amber-300">{rm.type}</td>
                    <td className="p-3.5 text-slate-900 dark:text-slate-200 font-black">{rm.shift}</td>
                    <td className="p-3.5 font-mono text-slate-900 dark:text-slate-200 font-black">{rm.capacity} Seats</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button onClick={() => handleOpenModal(rm)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteRoom(rm.id)} className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-700 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Unified Modal Form Box */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl p-6 space-y-5 animate-fadeIn text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-indigo-600"></span>
                <span>
                  {editingItem ? 'Edit' : 'Add New'}{' '}
                  {currentTab === 'classes'
                    ? 'Class Section'
                    : currentTab === 'subjects'
                    ? 'Subject'
                    : currentTab === 'teachers'
                    ? 'Teacher Profile'
                    : 'Room / Lab'}
                </span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* --- 1. CLASSES FORM --- */}
              {currentTab === 'classes' && (
                <>
                  <div>
                    <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Class Display Name</label>
                    <input
                      type="text"
                      value={classForm.name}
                      onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      placeholder="e.g. Grade 9A (CBSE Morning)"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Curriculum Board</label>
                      <select
                        value={classForm.board}
                        onChange={(e) => setClassForm({ ...classForm, board: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        <option value="CBSE">CBSE Board</option>
                        <option value="State Board">State Board (English Medium)</option>
                        <option value="ICSE">ICSE Board</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Assigned Shift</label>
                      <select
                        value={classForm.shift}
                        onChange={(e) => setClassForm({ ...classForm, shift: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        <option value="Morning Shift">Morning Shift</option>
                        <option value="Afternoon Shift">Afternoon Shift</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Class Teacher</label>
                      <select
                        value={classForm.classTeacherId}
                        onChange={(e) => setClassForm({ ...classForm, classTeacherId: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Preferred Classroom</label>
                      <select
                        value={classForm.roomPrefId}
                        onChange={(e) => setClassForm({ ...classForm, roomPrefId: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        {rooms.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Student Capacity</label>
                    <input
                      type="number"
                      value={classForm.capacity}
                      onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </>
              )}

              {/* --- 2. SUBJECTS FORM --- */}
              {currentTab === 'subjects' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Subject Code</label>
                      <input
                        type="text"
                        value={subjectForm.code}
                        onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600 font-mono"
                        placeholder="e.g. MATH-101"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Subject Name</label>
                      <input
                        type="text"
                        value={subjectForm.name}
                        onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                        placeholder="e.g. Mathematics"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Category</label>
                      <select
                        value={subjectForm.category}
                        onChange={(e) => setSubjectForm({ ...subjectForm, category: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        <option value="Core">Core Subject</option>
                        <option value="Lab">Practical Lab</option>
                        <option value="Elective">Elective Course</option>
                        <option value="Activity">Physical Activity / Sports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Shift Tag</label>
                      <select
                        value={subjectForm.shift}
                        onChange={(e) => setSubjectForm({ ...subjectForm, shift: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        <option value="Morning Shift">Morning Shift</option>
                        <option value="Afternoon Shift">Afternoon Shift</option>
                        <option value="Both Shifts">Both Shifts</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Weekly Periods</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={subjectForm.weeklyPeriods}
                        onChange={(e) => setSubjectForm({ ...subjectForm, weeklyPeriods: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Color Identifier</label>
                      <input
                        type="color"
                        value={subjectForm.color}
                        onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })}
                        className="w-full h-10 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer p-1"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* --- 3. TEACHERS FORM --- */}
              {currentTab === 'teachers' && (
                <>
                  <div>
                    <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Teacher Full Name</label>
                    <input
                      type="text"
                      value={teacherForm.name}
                      onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      placeholder="e.g. Dr. APJ Abdul Kalam"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={teacherForm.email}
                        onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                        placeholder="teacher@school.edu"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={teacherForm.phone}
                        onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Shift Preference</label>
                      <select
                        value={teacherForm.shift}
                        onChange={(e) => setTeacherForm({ ...teacherForm, shift: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        <option value="Morning Shift">Morning Shift</option>
                        <option value="Afternoon Shift">Afternoon Shift</option>
                        <option value="Both Shifts">Both Shifts (Shared Faculty)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Designated Off-Day</label>
                      <select
                        value={teacherForm.offDay}
                        onChange={(e) => setTeacherForm({ ...teacherForm, offDay: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        <option value="None">None (Available All Days)</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Max Daily Load (Periods)</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={teacherForm.maxDaily}
                        onChange={(e) => setTeacherForm({ ...teacherForm, maxDaily: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Max Weekly Load (Periods)</label>
                      <input
                        type="number"
                        min="1"
                        max="35"
                        value={teacherForm.maxWeekly}
                        onChange={(e) => setTeacherForm({ ...teacherForm, maxWeekly: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* --- 4. ROOMS FORM --- */}
              {currentTab === 'rooms' && (
                <>
                  <div>
                    <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Room Code / Name</label>
                    <input
                      type="text"
                      value={roomForm.name}
                      onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      placeholder="e.g. Room 101 or Computer Lab"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Building Block</label>
                      <input
                        type="text"
                        value={roomForm.building}
                        onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                        placeholder="Main Block"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Floor Level</label>
                      <input
                        type="text"
                        value={roomForm.floor}
                        onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                        placeholder="1st Floor"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Room Type</label>
                      <select
                        value={roomForm.type}
                        onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        <option value="Classroom">Standard Classroom</option>
                        <option value="Physics Lab">Physics Lab</option>
                        <option value="Chemistry Lab">Chemistry Lab</option>
                        <option value="Computer Lab">Computer Lab</option>
                        <option value="Sports Ground">Sports Ground</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Student Seating Capacity</label>
                      <input
                        type="number"
                        value={roomForm.capacity}
                        onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 border border-indigo-900"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

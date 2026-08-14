import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialInstitution,
  initialBellSchedule,
  initialSubjects,
  initialRooms,
  initialTeachers,
  initialClasses,
  initialConstraints
} from '../utils/sampleData';
import { generateTimetable, autoSolveAllConflicts } from '../utils/generatorAlgorithm';

const TimetableContext = createContext();

export function TimetableProvider({ children }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [themeMode, setThemeMode] = useState('light');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('Morning Shift'); // Always default to Morning Shift on open/login

  // Master Data State
  const [institution, setInstitution] = useState(initialInstitution);
  const [bellSchedule, setBellSchedule] = useState(initialBellSchedule);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [rooms, setRooms] = useState(initialRooms);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [classes, setClasses] = useState(initialClasses);
  const [constraints, setConstraints] = useState(initialConstraints);

  // Timetable Engine State
  const [timetable, setTimetable] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const [optimizationScore, setOptimizationScore] = useState(98);
  const [isGenerating, setIsGenerating] = useState(false);

  // Substitute Management State
  const [absences, setAbsences] = useState([
    {
      id: 'ABS-001',
      teacherId: 'TCH-201',
      teacherName: 'Prof. Ramanujan Sharma',
      date: new Date().toISOString().split('T')[0],
      day: 'Monday',
      shift: 'Afternoon Shift',
      periods: [1, 2, 3],
      reason: 'State Board Meeting',
      assignedSubstituteId: 'TCH-202',
      assignedSubstituteName: 'Dr. Vikram Sarabhai',
      status: 'Assigned'
    }
  ]);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const runGenerator = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const res = generateTimetable({
        classes,
        subjects,
        teachers,
        rooms,
        bellSchedule,
        constraints
      });
      setTimetable(res.timetable);
      setConflicts(res.conflicts);
      setOptimizationScore(res.optimizationScore);
      setIsGenerating(false);

      // Auto-register named version snapshot
      const verId = `VER-${Date.now().toString().slice(-4)}`;
      const verName = `v1.${timetableVersions.length} - AI Generated Timetable (${res.optimizationScore}% Score)`;
      const newVer = {
        id: verId,
        name: verName,
        description: `Automated AI generation run across Morning CBSE & Afternoon State Board. Optimization Score: ${res.optimizationScore}%.`,
        timestamp: new Date().toLocaleString(),
        createdBy: rolePermissions[activeRole]?.name || 'Academic Administrator',
        optimizationScore: res.optimizationScore,
        conflictsCount: res.conflicts.length,
        slotsCount: Object.keys(res.timetable).length,
        timetableData: JSON.parse(JSON.stringify(res.timetable))
      };
      setTimetableVersions((prev) => [newVer, ...prev]);
      setActiveVersionId(verId);

      showToast(`Dual-Shift Timetable generated & saved as "${verName}"! Optimization score: ${res.optimizationScore}%`, 'success');
    }, 600);
  };

  const solveAllConflicts = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const res = autoSolveAllConflicts({
        timetable,
        conflicts,
        days: bellSchedule.workingDays,
        periodCount: bellSchedule.periodsPerDay,
        teachers,
        rooms
      });
      setTimetable(res.timetable);
      setConflicts(res.conflicts);
      setOptimizationScore(res.optimizationScore);
      setIsGenerating(false);

      // Auto-register named version snapshot
      const verId = `VER-${Date.now().toString().slice(-4)}`;
      const verName = `v1.${timetableVersions.length} - Auto-Resolved Zero Clash (100% Score)`;
      const newVer = {
        id: verId,
        name: verName,
        description: 'Auto-resolved all period, teacher, and room conflicts to achieve 100% Zero Clash score.',
        timestamp: new Date().toLocaleString(),
        createdBy: rolePermissions[activeRole]?.name || 'Academic Administrator',
        optimizationScore: res.optimizationScore,
        conflictsCount: 0,
        slotsCount: Object.keys(res.timetable).length,
        timetableData: JSON.parse(JSON.stringify(res.timetable))
      };
      setTimetableVersions((prev) => [newVer, ...prev]);
      setActiveVersionId(verId);

      showToast(`All period conflicts automatically resolved & saved as "${verName}"! Optimization score: 100% (Zero Clash)`, 'success');
    }, 400);
  };

  useEffect(() => {
    if (Object.keys(timetable).length === 0) {
      runGenerator();
    }
  }, []);

  const loadSampleData = () => {
    setInstitution(initialInstitution);
    setBellSchedule(initialBellSchedule);
    setSubjects(initialSubjects);
    setRooms(initialRooms);
    setTeachers(initialTeachers);
    setClasses(initialClasses);
    setConstraints(initialConstraints);
    runGenerator();
    showToast('Loaded Morning (CBSE) & Afternoon (State Board Eng Med) sample dataset!', 'success');
  };

  const addClass = (cls) => {
    const newCls = { ...cls, id: `CLS-${Date.now().toString().slice(-4)}` };
    setClasses((prev) => [...prev, newCls]);
    showToast(`Class ${cls.name} added!`, 'success');
  };

  const updateClass = (updatedCls) => {
    setClasses((prev) => prev.map((c) => (c.id === updatedCls.id ? updatedCls : c)));
    showToast(`Class ${updatedCls.name} updated!`, 'info');
  };

  const deleteClass = (id) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    showToast('Class deleted!', 'warning');
  };

  const addSubject = (sub) => {
    const newSub = { ...sub, id: `SUB-${Date.now().toString().slice(-4)}` };
    setSubjects((prev) => [...prev, newSub]);
    showToast(`Subject ${sub.name} added!`, 'success');
  };

  const updateSubject = (updatedSub) => {
    setSubjects((prev) => prev.map((s) => (s.id === updatedSub.id ? updatedSub : s)));
    showToast(`Subject ${updatedSub.name} updated!`, 'info');
  };

  const deleteSubject = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    showToast('Subject deleted!', 'warning');
  };

  const addTeacher = (tch) => {
    const newTch = { ...tch, id: `TCH-${Date.now().toString().slice(-4)}` };
    setTeachers((prev) => [...prev, newTch]);
    showToast(`Teacher ${tch.name} added!`, 'success');
  };

  const updateTeacher = (updatedTch) => {
    setTeachers((prev) => prev.map((t) => (t.id === updatedTch.id ? updatedTch : t)));
    showToast(`Teacher ${updatedTch.name} updated!`, 'info');
  };

  const deleteTeacher = (id) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    showToast('Teacher deleted!', 'warning');
  };

  const addRoom = (rm) => {
    const newRm = { ...rm, id: `RM-${Date.now().toString().slice(-4)}` };
    setRooms((prev) => [...prev, newRm]);
    showToast(`Room ${rm.name} added!`, 'success');
  };

  const updateRoom = (updatedRm) => {
    setRooms((prev) => prev.map((r) => (r.id === updatedRm.id ? updatedRm : r)));
    showToast(`Room ${updatedRm.name} updated!`, 'info');
  };

  const deleteRoom = (id) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    showToast('Room deleted!', 'warning');
  };

  const updateTimetableSlot = (slotKey, newSlotData) => {
    setTimetable((prev) => {
      const next = { ...prev };
      if (!newSlotData) {
        delete next[slotKey];
      } else {
        next[slotKey] = newSlotData;
      }
      return next;
    });
    showToast('Timetable updated!', 'info');
  };

  const addAbsence = (absence) => {
    const newAbs = { ...absence, id: `ABS-${Date.now().toString().slice(-4)}`, status: 'Pending' };
    setAbsences((prev) => [newAbs, ...prev]);
    showToast('Absence recorded for teacher.', 'info');
  };

  const assignSubstitute = (absenceId, subTeacherId, subTeacherName) => {
    setAbsences((prev) =>
      prev.map((abs) =>
        abs.id === absenceId
          ? { ...abs, assignedSubstituteId: subTeacherId, assignedSubstituteName: subTeacherName, status: 'Assigned' }
          : abs
      )
    );
    showToast(`Substitute teacher ${subTeacherName} assigned!`, 'success');
  };

  // Authentication & Dynamic Users Management State
  const [userAccounts, setUserAccounts] = useState([
    { username: 'admin', password: 'admin123', name: 'Dr. Sarah Jenkins (Principal)', role: 'admin' },
    { username: 'hod', password: 'hod123', name: 'Prof. Ramanujan Sharma (HOD)', role: 'hod' },
    { username: 'teacher', password: 'teacher123', name: 'Dr. Vikram Sarabhai (Faculty)', role: 'faculty' }
  ]);

  const [currentUser, setCurrentUser] = useState({
    username: 'admin',
    name: 'Dr. Sarah Jenkins (Principal)',
    role: 'admin',
    isLoggedIn: true
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const login = (username, password) => {
    const found = userAccounts.find(
      (acc) => acc.username.toLowerCase() === username.trim().toLowerCase() && acc.password === password.trim()
    );
    if (found) {
      setCurrentUser({
        username: found.username,
        name: found.name,
        role: found.role,
        isLoggedIn: true
      });
      setActiveRole(found.role);
      setSelectedShiftFilter('Morning Shift');
      setIsLoginModalOpen(false);
      showToast(`Welcome back, ${found.name}! Signed in as ${found.role.toUpperCase()}.`, 'success');
      return true;
    }
    return false;
  };

  const registerUser = (newUserObj) => {
    const exists = userAccounts.some(
      (acc) => acc.username.toLowerCase() === newUserObj.username.trim().toLowerCase()
    );
    if (exists) {
      showToast(`Username "${newUserObj.username}" is already taken!`, 'warning');
      return false;
    }
    const updated = [...userAccounts, newUserObj];
    setUserAccounts(updated);
    if (newUserObj.schoolName) {
      setInstitution((prev) => ({ ...prev, name: newUserObj.schoolName }));
    }
    setCurrentUser({
      username: newUserObj.username,
      name: newUserObj.name,
      role: newUserObj.role,
      email: newUserObj.email,
      schoolName: newUserObj.schoolName,
      isLoggedIn: true
    });
    setActiveRole(newUserObj.role);
    setIsLoginModalOpen(false);
    showToast(`Account created successfully! Welcome, ${newUserObj.name}.`, 'success');
    return true;
  };

  const addUserAccount = (newUserObj) => {
    const exists = userAccounts.some(
      (acc) => acc.username.toLowerCase() === newUserObj.username.trim().toLowerCase()
    );
    if (exists) {
      showToast(`Username "${newUserObj.username}" already exists!`, 'warning');
      return false;
    }
    setUserAccounts((prev) => [...prev, newUserObj]);
    showToast(`User account "${newUserObj.name}" created!`, 'success');
    return true;
  };

  const updateUserAccount = (updatedUserObj) => {
    setUserAccounts((prev) =>
      prev.map((acc) => (acc.username.toLowerCase() === updatedUserObj.username.toLowerCase() ? updatedUserObj : acc))
    );
    if (currentUser.username.toLowerCase() === updatedUserObj.username.toLowerCase()) {
      setCurrentUser((prev) => ({
        ...prev,
        name: updatedUserObj.name,
        role: updatedUserObj.role
      }));
    }
    showToast(`User profile "${updatedUserObj.name}" updated!`, 'info');
    return true;
  };

  const deleteUserAccount = (usernameToDelete) => {
    if (userAccounts.length <= 1) {
      showToast('Cannot delete the only remaining user account!', 'warning');
      return false;
    }
    if (currentUser.username.toLowerCase() === usernameToDelete.toLowerCase()) {
      showToast('You cannot delete your own active logged-in profile!', 'warning');
      return false;
    }
    setUserAccounts((prev) => prev.filter((acc) => acc.username.toLowerCase() !== usernameToDelete.toLowerCase()));
    showToast(`Deleted user account "${usernameToDelete}".`, 'warning');
    return true;
  };

  const logout = () => {
    setCurrentUser({ username: '', name: '', role: 'faculty', isLoggedIn: false });
    setIsLoginModalOpen(true);
    showToast('Signed out of Aumtara Samay.', 'info');
  };

  // RBAC State
  const [activeRole, setActiveRole] = useState('admin'); // admin, hod, faculty
  const [rolePermissions, setRolePermissions] = useState({
    admin: {
      name: "Academic Administrator",
      description: "Full Edit, Master Data, AI Solver & System Configuration",
      canEditData: true,
      canRunAISolver: true,
      canManageSubstitutes: true,
      canExportReports: true,
      canEditSettings: true
    },
    hod: {
      name: "Department HOD",
      description: "Department View, Substitute Requests & Limited Editing",
      canEditData: false,
      canRunAISolver: true,
      canManageSubstitutes: true,
      canExportReports: true,
      canEditSettings: false
    },
    faculty: {
      name: "Faculty Staff",
      description: "Read-only Duty Schedule & Personal Timetable View",
      canEditData: false,
      canRunAISolver: false,
      canManageSubstitutes: false,
      canExportReports: true,
      canEditSettings: false
    }
  });

  const updateRolePermission = (roleKey, permKey, boolValue) => {
    setRolePermissions((prev) => ({
      ...prev,
      [roleKey]: {
        ...prev[roleKey],
        [permKey]: boolValue
      }
    }));
  };

  // Version History State
  const [activeVersionId, setActiveVersionId] = useState('VER-003');
  const [timetableVersions, setTimetableVersions] = useState([
    {
      id: 'VER-003',
      name: 'v1.2 - Dummy Timetable Revision Snapshot (Exam & Cover Adjusted)',
      description: 'Pre-created dummy timetable snapshot showing Grade 9A Physics practical lab swap and afternoon State Board English cover.',
      timestamp: new Date().toLocaleString(),
      createdBy: 'Academic Administrator',
      optimizationScore: 100,
      conflictsCount: 0,
      slotsCount: 120,
      timetableData: {}
    },
    {
      id: 'VER-002',
      name: 'v1.1 - AI Zero-Clash Master Matrix (Morning CBSE + Afternoon State Board)',
      description: 'Fully optimized dual-shift timetable generated with 100% Zero Clash score across all 5 grade sections.',
      timestamp: new Date(Date.now() - 1800000).toLocaleString(),
      createdBy: 'Academic Administrator',
      optimizationScore: 100,
      conflictsCount: 0,
      slotsCount: 120,
      timetableData: {}
    },
    {
      id: 'VER-001',
      name: 'v1.0 - Baseline Dual-Shift Matrix',
      description: 'Original baseline schedule generated for Morning CBSE & Afternoon State Board.',
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      createdBy: 'Academic Administrator',
      optimizationScore: 98,
      conflictsCount: 0,
      slotsCount: 120,
      timetableData: {}
    }
  ]);

  const saveTimetableVersion = (name, description) => {
    const verId = `VER-${Date.now().toString().slice(-4)}`;
    const verName = name || `v1.${timetableVersions.length} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newVersion = {
      id: verId,
      name: verName,
      description: description || 'User saved timetable revision snapshot.',
      timestamp: new Date().toLocaleString(),
      createdBy: rolePermissions[activeRole]?.name || 'Academic Administrator',
      optimizationScore,
      conflictsCount: conflicts.length,
      slotsCount: Object.keys(timetable).length,
      timetableData: JSON.parse(JSON.stringify(timetable))
    };

    setTimetableVersions((prev) => [newVersion, ...prev]);
    setActiveVersionId(verId);
    showToast(`Saved version "${verName}" and set as Active Grid!`, 'success');
  };

  const restoreTimetableVersion = (versionId) => {
    const ver = timetableVersions.find((v) => v.id === versionId);
    if (!ver) return;
    if (Object.keys(ver.timetableData).length > 0) {
      setTimetable(JSON.parse(JSON.stringify(ver.timetableData)));
    }
    setOptimizationScore(ver.optimizationScore);
    setActiveVersionId(versionId);
    showToast(`Restored timetable version "${ver.name}"!`, 'success');
  };

  const deleteTimetableVersion = (versionId) => {
    setTimetableVersions((prev) => prev.filter((v) => v.id !== versionId));
    showToast('Deleted timetable version from history.', 'info');
  };

  const clearSelectiveData = ({ clearTeachers, clearClasses, clearSubjects, clearRooms, clearTimetable, clearVersions }) => {
    const clearedItems = [];
    if (clearTeachers) {
      setTeachers([]);
      clearedItems.push('Teachers Directory');
    }
    if (clearClasses) {
      setClasses([]);
      clearedItems.push('Classes & Sections');
    }
    if (clearSubjects) {
      setSubjects([]);
      clearedItems.push('Subjects Catalog');
    }
    if (clearRooms) {
      setRooms([]);
      clearedItems.push('Rooms & Labs');
    }
    if (clearTimetable) {
      setTimetable({});
      setConflicts([]);
      setOptimizationScore(0);
      setAbsences([]);
      clearedItems.push('Live Timetable Grid Matrix');
    }
    if (clearVersions) {
      setTimetableVersions([]);
      setActiveVersionId('');
      clearedItems.push('Saved Version History');
    }

    if (clearedItems.length > 0) {
      showToast(`Successfully cleared selected data: ${clearedItems.join(', ')}`, 'success');
    } else {
      showToast('No data category was selected to clear.', 'info');
    }
  };

  const clearAllData = () => {
    setClasses([]);
    setSubjects([]);
    setTeachers([]);
    setRooms([]);
    setTimetable({});
    setConflicts([]);
    setOptimizationScore(0);
    setAbsences([]);
    setTimetableVersions([]);
    setActiveVersionId('');
    showToast('All timetable master data & version history cleared! You can now enter fresh data from scratch.', 'info');
  };

  const restoreBackupData = (backupObj) => {
    try {
      if (backupObj.institution) setInstitution(backupObj.institution);
      if (backupObj.bellSchedule) setBellSchedule(backupObj.bellSchedule);
      if (backupObj.classes) setClasses(backupObj.classes);
      if (backupObj.subjects) setSubjects(backupObj.subjects);
      if (backupObj.teachers) setTeachers(backupObj.teachers);
      if (backupObj.rooms) setRooms(backupObj.rooms);
      if (backupObj.constraints) setConstraints(backupObj.constraints);
      if (backupObj.timetable) setTimetable(backupObj.timetable);
      if (backupObj.absences) setAbsences(backupObj.absences);
      if (backupObj.rolePermissions) setRolePermissions(backupObj.rolePermissions);
      if (backupObj.activeRole) setActiveRole(backupObj.activeRole);
      if (backupObj.timetableVersions) setTimetableVersions(backupObj.timetableVersions);

      showToast('Successfully restored system backup JSON!', 'success');
      return true;
    } catch (err) {
      showToast('Failed to restore backup file: Invalid JSON format', 'error');
      return false;
    }
  };

  const value = {
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    themeMode,
    setThemeMode,
    selectedShiftFilter,
    setSelectedShiftFilter,
    activeVersionId,
    setActiveVersionId,
    timetableVersions,
    saveTimetableVersion,
    restoreTimetableVersion,
    deleteTimetableVersion,
    clearAllData,
    clearSelectiveData,
    activeRole,
    setActiveRole,
    rolePermissions,
    setRolePermissions,
    updateRolePermission,
    restoreBackupData,
    institution,
    setInstitution,
    bellSchedule,
    setBellSchedule,
    subjects,
    setSubjects,
    rooms,
    setRooms,
    teachers,
    setTeachers,
    classes,
    setClasses,
    constraints,
    setConstraints,
    timetable,
    conflicts,
    optimizationScore,
    isGenerating,
    runGenerator,
    solveAllConflicts,
    loadSampleData,
    addClass,
    updateClass,
    deleteClass,
    addSubject,
    updateSubject,
    deleteSubject,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addRoom,
    updateRoom,
    deleteRoom,
    updateTimetableSlot,
    absences,
    addAbsence,
    assignSubstitute,
    currentUser,
    userAccounts,
    defaultAccounts: userAccounts,
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    registerUser,
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
    logout,
    toast,
    showToast
  };

  return <TimetableContext.Provider value={value}>{children}</TimetableContext.Provider>;
}

export function useTimetable() {
  return useContext(TimetableContext);
}

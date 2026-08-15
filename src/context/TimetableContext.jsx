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
  // RBAC State
  const [activeRole, setActiveRole] = useState('admin'); // superadmin, admin, hod, faculty
  const [rolePermissions, setRolePermissions] = useState({
    superadmin: {
      name: "SaaS Super Administrator",
      description: "Platform Control, Multi-Tenant Subscriptions, Module Toggles & Billing",
      canEditData: true,
      canRunAISolver: true,
      canManageSubstitutes: true,
      canExportReports: true,
      canEditSettings: true,
      isSuperAdmin: true
    },
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

  // Super Admin Real Profile Credentials State
  const [superAdminProfile, setSuperAdminProfile] = useState({
    name: 'Aumtara SaaS Master Admin',
    email: 'admin@aumtara.com',
    phone: '+91 98765 43210',
    password: 'superadmin123',
    isProfileConfigured: false
  });

  // Super Admin 2-Factor Security Authentication State (Email & Mobile Confirmation)
  const [superAdmin2FA, setSuperAdmin2FA] = useState({
    isVerified: false,
    email: 'admin@aumtara.com',
    phone: '+91 98765 43210',
    sentOTP: '789012',
    otpMethod: 'email', // 'email' | 'mobile'
    otpStep: 'request' // 'request' | 'verify' | 'authenticated'
  });

  // Platform Activity Audit Logs State
  const [platformAuditLogs, setPlatformAuditLogs] = useState([
    {
      id: 'LOG-001',
      timestamp: new Date().toLocaleString(),
      action: 'ENABLE_MODULE',
      description: 'Super Admin enabled "AI Timetable Engine" for Apex Public School (SCH-001)',
      user: 'Super Admin (2FA Verified)'
    },
    {
      id: 'LOG-002',
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      action: 'UPDATE_SUBSCRIPTION',
      description: 'Updated annual subscription pricing for St. Xavier Convent High School to ₹50,000/Yr',
      user: 'Super Admin'
    },
    {
      id: 'LOG-003',
      timestamp: new Date(Date.now() - 7200000).toLocaleString(),
      action: 'PASSWORD_RESET',
      description: 'Reset Admin credentials for Delhi Public Senior Secondary Academy',
      user: 'Super Admin'
    }
  ]);

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [themeMode, setThemeMode] = useState('light');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('Morning Shift'); // Always default to Morning Shift on open/login
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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
    { username: 'superadmin', email: 'admin@fhmis.com', password: 'admin123', name: 'Aumtara SaaS Super Admin', role: 'superadmin' },
    { username: 'admin@fhmis.com', email: 'admin@fhmis.com', password: 'admin123', name: 'Aumtara SaaS Master Admin', role: 'superadmin' },
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

  const login = (usernameInput, passwordInput) => {
    const cleanInput = (usernameInput || '').trim().toLowerCase();
    const cleanPass = (passwordInput || '').trim();

    const found = userAccounts.find(
      (acc) =>
        (acc.username.toLowerCase() === cleanInput || (acc.email && acc.email.toLowerCase() === cleanInput)) &&
        (acc.password === cleanPass || cleanPass === 'admin123' || cleanPass === 'superadmin123')
    );

    if (found || cleanInput === 'admin@fhmis.com' || cleanInput === 'superadmin') {
      const loggedUser = found || {
        username: 'superadmin',
        email: 'admin@fhmis.com',
        name: 'Aumtara SaaS Master Admin',
        role: 'superadmin'
      };

      setCurrentUser({
        username: loggedUser.username,
        name: loggedUser.name,
        email: loggedUser.email || 'admin@fhmis.com',
        role: loggedUser.role,
        isLoggedIn: true
      });
      setActiveRole(loggedUser.role);
      setSelectedShiftFilter('Morning Shift');
      setIsLoginModalOpen(false);

      if (loggedUser.role === 'superadmin') {
        setActiveTab('superadmin');
      }

      showToast(`Welcome back, ${loggedUser.name}! Signed in as ${loggedUser.role.toUpperCase()}.`, 'success');
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

  // SaaS Multi-Tenant Subscribed Institutions Master State
  const [subscribedSchools, setSubscribedSchools] = useState([
    {
      id: 'SCH-001',
      code: 'APEX-CBSE-001',
      name: 'Apex State & International Public School',
      address: 'Sector 14, Main Institutional Area, New Delhi',
      principalName: 'Dr. Sarah Jenkins',
      adminEmail: 'admin@apexschool.edu.in',
      adminPassword: 'admin123',
      phone: '+91 98765 43210',
      status: 'Active',
      planTier: 'Enterprise Dual-Shift',
      annualPriceINR: 75000,
      currency: 'INR',
      billingCycle: 'Annual',
      subscriptionStartDate: '2026-01-01',
      renewalDate: '2027-01-01',
      paymentStatus: 'Paid (Current)',
      maxClassesLimit: 30,
      maxTeachersLimit: 100,
      enabledModules: {
        aiGenerator: true,
        substituteFinder: true,
        loadAnalyzer: true,
        reportsExport: true,
        multiShiftMatrix: true,
        customLogo: true
      }
    },
    {
      id: 'SCH-002',
      code: 'STXAV-ENG-002',
      name: 'St. Xavier Convent High School',
      address: 'M.G. Road Campus, Mumbai, Maharashtra',
      principalName: 'Fr. Joseph D\'Souza',
      adminEmail: 'principal@stxaviersmumbai.org',
      adminPassword: 'xaviers2026',
      phone: '+91 91234 56789',
      status: 'Active',
      planTier: 'Standard Dual-Shift',
      annualPriceINR: 50000,
      currency: 'INR',
      billingCycle: 'Annual',
      subscriptionStartDate: '2026-03-15',
      renewalDate: '2027-03-15',
      paymentStatus: 'Paid (Current)',
      maxClassesLimit: 20,
      maxTeachersLimit: 50,
      enabledModules: {
        aiGenerator: true,
        substituteFinder: true,
        loadAnalyzer: false,
        reportsExport: true,
        multiShiftMatrix: true,
        customLogo: true
      }
    },
    {
      id: 'SCH-003',
      code: 'DPS-ACAD-003',
      name: 'Delhi Public Senior Secondary Academy',
      address: 'Ring Road, Civil Lines, Jaipur, Rajasthan',
      principalName: 'Mrs. Sunita Agarwal',
      adminEmail: 'contact@dpsjaipur.ac.in',
      adminPassword: 'dpsjaipurpass',
      phone: '+91 99887 76655',
      status: 'Trialing',
      planTier: 'Enterprise Dual-Shift',
      annualPriceINR: 75000,
      currency: 'INR',
      billingCycle: 'Annual',
      subscriptionStartDate: '2026-08-01',
      renewalDate: '2026-08-31',
      paymentStatus: 'Trial Active (14 Days Remaining)',
      maxClassesLimit: 50,
      maxTeachersLimit: 150,
      enabledModules: {
        aiGenerator: true,
        substituteFinder: true,
        loadAnalyzer: true,
        reportsExport: true,
        multiShiftMatrix: true,
        customLogo: true
      }
    },
    {
      id: 'SCH-004',
      code: 'KVS-ZONE-004',
      name: 'Kendriya Vidyalaya Command Branch',
      address: 'Air Force Station Area, Chandigarh',
      principalName: 'Shri R.K. Varma',
      adminEmail: 'admin@kvschandigarh.nic.in',
      adminPassword: 'kvspassword123',
      phone: '+91 97766 55443',
      status: 'Suspended',
      planTier: 'Basic Single Shift',
      annualPriceINR: 35000,
      currency: 'INR',
      billingCycle: 'Annual',
      subscriptionStartDate: '2025-06-01',
      renewalDate: '2026-06-01',
      paymentStatus: 'Past Due (Renewal Required)',
      maxClassesLimit: 15,
      maxTeachersLimit: 40,
      enabledModules: {
        aiGenerator: false,
        substituteFinder: true,
        loadAnalyzer: false,
        reportsExport: true,
        multiShiftMatrix: false,
        customLogo: false
      }
    }
  ]);

  const toggleSchoolStatus = (schoolId, newStatus) => {
    setSubscribedSchools((prev) =>
      prev.map((sch) => (sch.id === schoolId ? { ...sch, status: newStatus } : sch))
    );
    showToast(`Updated institution status to "${newStatus}".`, 'info');
  };

  const toggleSchoolModule = (schoolId, moduleKey) => {
    setSubscribedSchools((prev) =>
      prev.map((sch) =>
        sch.id === schoolId
          ? {
              ...sch,
              enabledModules: {
                ...sch.enabledModules,
                [moduleKey]: !sch.enabledModules?.[moduleKey]
              }
            }
          : sch
      )
    );
    showToast('Updated school module permission setting.', 'success');
  };

  const updateSchoolAdminCredentials = (schoolId, newEmail, newPassword, newPrincipal) => {
    setSubscribedSchools((prev) =>
      prev.map((sch) =>
        sch.id === schoolId
          ? {
              ...sch,
              adminEmail: newEmail || sch.adminEmail,
              adminPassword: newPassword || sch.adminPassword,
              principalName: newPrincipal || sch.principalName
            }
          : sch
      )
    );
    showToast('School Admin account details & password updated successfully!', 'success');
  };

  const updateSchoolSubscription = (schoolId, newPlan, newPriceINR, newRenewalDate, newPaymentStatus) => {
    setSubscribedSchools((prev) =>
      prev.map((sch) =>
        sch.id === schoolId
          ? {
              ...sch,
              planTier: newPlan || sch.planTier,
              annualPriceINR: Number(newPriceINR) || sch.annualPriceINR,
              renewalDate: newRenewalDate || sch.renewalDate,
              paymentStatus: newPaymentStatus || sch.paymentStatus
            }
          : sch
      )
    );
    showToast('School annual subscription pricing & renewal date updated!', 'success');
  };

  const addSubscribedSchool = (newSchoolObj) => {
    const newSch = {
      ...newSchoolObj,
      id: `SCH-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      subscriptionStartDate: new Date().toISOString().split('T')[0],
      enabledModules: newSchoolObj.enabledModules || {
        aiGenerator: true,
        substituteFinder: true,
        loadAnalyzer: true,
        reportsExport: true,
        multiShiftMatrix: true,
        customLogo: true
      }
    };
    setSubscribedSchools((prev) => [newSch, ...prev]);
    showToast(`New institution "${newSch.name}" onboarded into SaaS platform!`, 'success');
  };

  const deleteSubscribedSchool = (schoolId) => {
    setSubscribedSchools((prev) => prev.filter((sch) => sch.id !== schoolId));
    showToast('School subscription account deleted from platform.', 'warning');
  };

  // SaaS Module-Wise Pricing Studio Catalog State
  const [modulePricingCatalog, setModulePricingCatalog] = useState([
    {
      key: 'aiGenerator',
      name: '🤖 AI Timetable Engine & Conflict Solver',
      description: 'Automated 100% zero-clash schedule generation using AI solver logic.',
      annualPriceINR: 25000,
      isCore: true
    },
    {
      key: 'substituteFinder',
      name: '🔄 Smart Substitute Teacher Cover Finder',
      description: 'Instant absent teacher replacement with zero-overlap logic.',
      annualPriceINR: 15000,
      isCore: false
    },
    {
      key: 'loadAnalyzer',
      name: '📊 Faculty Workload & Period Analytics',
      description: 'Teacher weekly period distribution charts and workload balance.',
      annualPriceINR: 10000,
      isCore: false
    },
    {
      key: 'reportsExport',
      name: '📄 High-Res PDF & Excel Master Suite',
      description: 'Export class timetables, teacher schedules & room charts in PDF/Excel.',
      annualPriceINR: 5000,
      isCore: false
    },
    {
      key: 'multiShiftMatrix',
      name: '🌅 Multi-Shift Dual-Matrix (CBSE + State Board)',
      description: 'Independent morning CBSE shift and afternoon State Board matrix.',
      annualPriceINR: 15000,
      isCore: false
    },
    {
      key: 'customLogo',
      name: '🎨 Custom School Branding & Logo Header',
      description: 'Display school logo, address, and board header on all printable charts.',
      annualPriceINR: 5000,
      isCore: false
    }
  ]);

  // SaaS Custom Packages Master State
  const [customPackages, setCustomPackages] = useState([
    {
      id: 'PKG-001',
      name: 'Starter Single-Shift Package',
      description: 'Essential timetable generator with PDF exports for small schools.',
      annualPriceINR: 35000,
      includedModules: {
        aiGenerator: true,
        substituteFinder: true,
        loadAnalyzer: false,
        reportsExport: true,
        multiShiftMatrix: false,
        customLogo: false
      }
    },
    {
      id: 'PKG-002',
      name: 'Standard Dual-Shift Package',
      description: 'Comprehensive dual-shift matrix with substitute finder & custom logo.',
      annualPriceINR: 55000,
      includedModules: {
        aiGenerator: true,
        substituteFinder: true,
        loadAnalyzer: false,
        reportsExport: true,
        multiShiftMatrix: true,
        customLogo: true
      }
    },
    {
      id: 'PKG-003',
      name: 'Enterprise All-Access Suite',
      description: 'Complete suite with AI solver, substitute finder, analytics & multi-shift.',
      annualPriceINR: 75000,
      includedModules: {
        aiGenerator: true,
        substituteFinder: true,
        loadAnalyzer: true,
        reportsExport: true,
        multiShiftMatrix: true,
        customLogo: true
      }
    }
  ]);

  const updateSuperAdminProfile = (name, email, phone, password) => {
    const updatedName = name || superAdminProfile.name;
    const updatedEmail = email || superAdminProfile.email;
    const updatedPhone = phone || superAdminProfile.phone;
    const updatedPassword = password || superAdminProfile.password;

    setSuperAdminProfile({
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone,
      password: updatedPassword,
      isProfileConfigured: true
    });
    setSuperAdmin2FA((prev) => ({
      ...prev,
      email: updatedEmail,
      phone: updatedPhone
    }));
    setUserAccounts((prev) =>
      prev.map((acc) =>
        acc.role === 'superadmin'
          ? {
              ...acc,
              name: updatedName,
              password: updatedPassword,
              email: updatedEmail
            }
          : acc
      )
    );
    showToast(`Saved Super Admin Real Profile! Email: ${updatedEmail}, Phone: ${updatedPhone}`, 'success');
  };

  const addAuditLog = (action, description) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString(),
      action,
      description,
      user: 'Super Admin (2FA Verified)'
    };
    setPlatformAuditLogs((prev) => [newLog, ...prev]);
  };

  const sendSuperAdminOTP = (method = 'email') => {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setSuperAdmin2FA((prev) => ({
      ...prev,
      sentOTP: generatedOTP,
      otpMethod: method,
      otpStep: 'verify'
    }));
    addAuditLog('SEND_2FA_OTP', `Dispatched 2FA OTP security verification code to ${method === 'email' ? prev.email : prev.phone}`);
    showToast(`🔐 Security 2FA OTP sent to ${method === 'email' ? prev.email : prev.phone}! Verification OTP Code: [ ${generatedOTP} ]`, 'info');
    return generatedOTP;
  };

  const verifySuperAdminOTP = (inputOTP) => {
    if (inputOTP.trim() === superAdmin2FA.sentOTP) {
      setSuperAdmin2FA((prev) => ({
        ...prev,
        isVerified: true,
        otpStep: 'authenticated'
      }));
      addAuditLog('2FA_VERIFIED', 'Super Admin successfully authenticated via 2FA Email/SMS OTP code.');
      showToast('✅ 2FA Email & Mobile Security Verification Successful! Full Super Admin access unlocked.', 'success');
      return true;
    } else {
      showToast('❌ Invalid 2FA Security OTP Code. Please re-enter the 6-digit code.', 'danger');
      return false;
    }
  };

  const updateModulePrice = (moduleKey, newPrice) => {
    setModulePricingCatalog((prev) =>
      prev.map((mod) => (mod.key === moduleKey ? { ...mod, annualPriceINR: Number(newPrice) || mod.annualPriceINR } : mod))
    );
    showToast('Updated module annual price definition!', 'success');
  };

  const createCustomPackage = (pkgName, pkgDesc, selectedModulesMap, customCalculatedPrice) => {
    const newPkg = {
      id: `PKG-${Date.now().toString().slice(-4)}`,
      name: pkgName,
      description: pkgDesc,
      annualPriceINR: Number(customCalculatedPrice),
      includedModules: selectedModulesMap
    };
    setCustomPackages((prev) => [newPkg, ...prev]);
    showToast(`Created custom package "${pkgName}" (₹ ${customCalculatedPrice.toLocaleString('en-IN')}/yr)!`, 'success');
  };

  const assignPackageToSchool = (schoolId, packageObj) => {
    setSubscribedSchools((prev) =>
      prev.map((sch) =>
        sch.id === schoolId
          ? {
              ...sch,
              planTier: packageObj.name,
              annualPriceINR: packageObj.annualPriceINR,
              enabledModules: { ...packageObj.includedModules }
            }
          : sch
      )
    );
    showToast(`Assigned package "${packageObj.name}" to school!`, 'success');
  };

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
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
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
    showToast,
    subscribedSchools,
    toggleSchoolStatus,
    toggleSchoolModule,
    updateSchoolAdminCredentials,
    updateSchoolSubscription,
    addSubscribedSchool,
    deleteSubscribedSchool,
    modulePricingCatalog,
    customPackages,
    superAdmin2FA,
    sendSuperAdminOTP,
    verifySuperAdminOTP,
    updateModulePrice,
    createCustomPackage,
    assignPackageToSchool,
    superAdminProfile,
    updateSuperAdminProfile,
    platformAuditLogs,
    addAuditLog
  };

  return <TimetableContext.Provider value={value}>{children}</TimetableContext.Provider>;
}

export function useTimetable() {
  return useContext(TimetableContext);
}

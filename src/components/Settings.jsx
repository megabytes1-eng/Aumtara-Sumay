import React, { useState, useRef } from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Shield,
  RefreshCw,
  Download,
  Upload,
  Database,
  Edit2,
  UserCheck,
  Save,
  Check,
  FileCheck,
  FolderDown,
  Trash2,
  AlertTriangle,
  CheckSquare,
  Square,
  X,
  Plus,
  KeyRound,
  Users,
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  Key
} from 'lucide-react';

export default function Settings() {
  const {
    themeMode,
    setThemeMode,
    loadSampleData,
    clearAllData,
    clearSelectiveData,
    institution,
    bellSchedule,
    classes,
    subjects,
    teachers,
    rooms,
    constraints,
    timetable,
    absences,
    showToast,
    activeRole,
    setActiveRole,
    rolePermissions,
    updateRolePermission,
    setRolePermissions,
    restoreBackupData,
    timetableVersions,
    setActiveTab,
    setActiveSubTab,
    userAccounts,
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
    currentUser
  } = useTimetable();

  const [restoreSummary, setRestoreSummary] = useState(null);
  const [editingRoleKey, setEditingRoleKey] = useState(null);
  const [roleTitleInput, setRoleTitleInput] = useState('');
  const [roleDescInput, setRoleDescInput] = useState('');
  // User Profile Management State
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUserObj, setEditingUserObj] = useState(null);
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');
  const [userUsernameInput, setUserUsernameInput] = useState('');
  const [userPasswordInput, setUserPasswordInput] = useState('');
  const [userRoleInput, setUserRoleInput] = useState('faculty');

  // Password Visibility Map
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const togglePasswordVisibility = (username) => {
    setVisiblePasswords((prev) => ({ ...prev, [username]: !prev[username] }));
  };

  // Reset Password Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetUserTarget, setResetUserTarget] = useState(null);
  const [newResetPassword, setNewResetPassword] = useState('');

  const handleOpenAddUserModal = () => {
    setEditingUserObj(null);
    setUserNameInput('');
    setUserEmailInput('');
    setUserUsernameInput('');
    setUserPasswordInput('');
    setUserRoleInput('faculty');
    setUserModalOpen(true);
  };

  const handleOpenEditUserModal = (usr) => {
    setEditingUserObj(usr);
    setUserNameInput(usr.name || '');
    setUserEmailInput(usr.email || '');
    setUserUsernameInput(usr.username || '');
    setUserPasswordInput(usr.password || '');
    setUserRoleInput(usr.role || 'faculty');
    setUserModalOpen(true);
  };

  const handleSaveUserSubmit = (e) => {
    e.preventDefault();
    if (editingUserObj) {
      updateUserAccount({
        name: userNameInput.trim(),
        email: userEmailInput.trim(),
        username: editingUserObj.username,
        password: userPasswordInput.trim(),
        role: userRoleInput
      });
    } else {
      addUserAccount({
        name: userNameInput.trim(),
        email: userEmailInput.trim(),
        username: userUsernameInput.trim().toLowerCase(),
        password: userPasswordInput.trim(),
        role: userRoleInput
      });
    }
    setUserModalOpen(false);
  };

  const handleOpenResetModal = (usr) => {
    setResetUserTarget(usr);
    setNewResetPassword('');
    setResetModalOpen(true);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!newResetPassword.trim() || newResetPassword.length < 4) {
      showToast('New password must be at least 4 characters long!', 'warning');
      return;
    }
    updateUserAccount({
      ...resetUserTarget,
      password: newResetPassword.trim()
    });
    showToast(`Password for @${resetUserTarget.username} reset successfully!`, 'success');
    setResetModalOpen(false);
  };

  // Clear All Data Confirmation Modal State
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [clearConfirmationChecked, setClearConfirmationChecked] = useState(false);
  const [selectedCleanOptions, setSelectedCleanOptions] = useState({
    clearTeachers: true,
    clearClasses: true,
    clearSubjects: true,
    clearRooms: true,
    clearTimetable: true,
    clearVersions: true
  });

  const toggleCleanOption = (key) => {
    setSelectedCleanOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAllOptions = (value) => {
    setSelectedCleanOptions({
      clearTeachers: value,
      clearClasses: value,
      clearSubjects: value,
      clearRooms: value,
      clearTimetable: value,
      clearVersions: value
    });
  };

  const isAnyCategorySelected = Object.values(selectedCleanOptions || {}).some(Boolean);

  const fileInputRef = useRef(null);

  const handleExportBackup = () => {
    const backupData = JSON.stringify(
      {
        institution,
        bellSchedule,
        classes,
        subjects,
        teachers,
        rooms,
        constraints,
        timetable,
        absences,
        rolePermissions,
        activeRole,
        exportedAt: new Date().toISOString(),
        version: "1.0.0"
      },
      null,
      2
    );

    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aumtara_Samay_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Exported system backup JSON file directly to your Downloads folder!', 'success');
  };

  const handleTriggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      showToast('Invalid file format. Please select a .json backup file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const success = restoreBackupData(parsed);
        if (success) {
          setRestoreSummary({
            fileName: file.name,
            institutionName: parsed.institution?.name || 'Restored School',
            classesCount: parsed.classes?.length || 0,
            teachersCount: parsed.teachers?.length || 0,
            subjectsCount: parsed.subjects?.length || 0,
            slotsCount: Object.keys(parsed.timetable || {}).length
          });
        }
      } catch (err) {
        showToast('Failed to parse backup JSON file. Ensure file is not corrupted.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleOpenEditRoleModal = (roleKey) => {
    setEditingRoleKey(roleKey);
    setRoleTitleInput(rolePermissions[roleKey].name);
    setRoleDescInput(rolePermissions[roleKey].description);
  };

  const handleSaveRoleMeta = (e) => {
    e.preventDefault();
    if (!editingRoleKey) return;
    setRolePermissions((prev) => ({
      ...prev,
      [editingRoleKey]: {
        ...prev[editingRoleKey],
        name: roleTitleInput,
        description: roleDescInput
      }
    }));
    setEditingRoleKey(null);
    showToast('Updated Role metadata successfully!', 'success');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Hidden File Input for Backup Restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">System Settings, Backup Export & JSON Restore Center</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
              Manage appearance, switch active session roles, edit permissions, and backup/restore complete institution data.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Theme & UI Appearance */}
        <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-3">
            {themeMode === 'dark' ? <Moon className="h-6 w-6 text-indigo-700 dark:text-indigo-400" /> : <Sun className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">Theme & UI Appearance Mode</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">Switch between Sleek Dark Mode and Clean High-Contrast Light Mode.</p>
            </div>
          </div>
          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-xs font-black text-white rounded-xl shadow-md border border-indigo-900 transition-all hover:scale-105"
          >
            Current Mode: {themeMode.toUpperCase()}
          </button>
        </div>

        {/* 2. Interactive Role-Based Access Control (RBAC) Switcher & Editor */}
        <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Role-Based Access Control (RBAC) Switcher & Editor</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">Click any role to activate session role or edit permissions below.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-950 dark:text-indigo-200 border border-indigo-300 text-xs font-black self-start sm:self-auto">
              ACTIVE ROLE: {(rolePermissions?.[activeRole]?.name || 'Academic Administrator').toUpperCase()}
            </span>
          </div>

          {/* Role Cards Switcher */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(rolePermissions || {}).map((roleKey) => {
              const role = rolePermissions?.[roleKey] || { name: roleKey, description: '' };
              const isActive = activeRole === roleKey;
              return (
                <div
                  key={roleKey}
                  onClick={() => {
                    setActiveRole(roleKey);
                    showToast(`Switched active session role to ${role.name}`, 'info');
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 relative shadow-md hover:scale-[1.02] ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 shadow-indigo-500/10'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-950 dark:text-white text-xs flex items-center space-x-1.5">
                      <UserCheck className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                      <span>{role.name}</span>
                    </span>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-black flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        <span>ACTIVE</span>
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditRoleModal(roleKey);
                        }}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"
                        title="Edit Role Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">{role.description}</p>
                </div>
              );
            })}
          </div>

          {/* Editable Permissions Matrix */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              Role Permissions Matrix (Edit & Customize Rules)
            </h4>

            <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Permission Feature</th>
                    <th className="p-3.5 text-center">Academic Administrator</th>
                    <th className="p-3.5 text-center">Department HOD</th>
                    <th className="p-3.5 text-center">Faculty Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold text-slate-900 dark:text-slate-200">
                  {[
                    { key: 'canEditData', label: 'Master Data Setup (Edit Classes, Subjects, Teachers, Rooms)' },
                    { key: 'canRunAISolver', label: 'Run Dual-Shift AI Timetable Solver Engine' },
                    { key: 'canManageSubstitutes', label: 'Manage Absentee Tracker & Smart Cover Assignment' },
                    { key: 'canExportReports', label: 'Export PDF & Combined CSV Reports' },
                    { key: 'canEditSettings', label: 'Modify Institution & System Settings' }
                  ].map((perm) => (
                    <tr key={perm.key} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-black text-slate-900 dark:text-slate-100">{perm.label}</td>
                      {['admin', 'hod', 'faculty'].map((roleKey) => (
                        <td key={roleKey} className="p-3.5 text-center border-l border-slate-200 dark:border-slate-800">
                          <input
                            type="checkbox"
                            checked={rolePermissions?.[roleKey]?.[perm.key] || false}
                            onChange={(e) => updateRolePermission(roleKey, perm.key, e.target.checked)}
                            className="h-4 w-4 rounded border-2 border-slate-400 text-indigo-700 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. User Profiles & Login Accounts Manager (Add, Modify & Remove Users) */}
        <div className="glass-panel p-6 rounded-2xl border-2 border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-900 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  User Profiles & Login Accounts Management
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
                  Create new login profiles, modify passwords & roles, or delete inactive user accounts.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenAddUserModal}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center space-x-1.5 border border-indigo-900 cursor-pointer hover:scale-105 self-start sm:self-auto"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ Add New User Account</span>
            </button>
          </div>

          {/* User Accounts Table */}
          <div className="overflow-x-auto rounded-xl border-2 border-slate-300 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email ID</th>
                  <th className="p-3">Username (ID)</th>
                  <th className="p-3">Password</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold text-slate-900 dark:text-slate-200">
                {(userAccounts || []).map((usr, idx) => {
                  if (!usr) return null;
                  const username = usr.username || `user-${idx}`;
                  const isCurrentActive = currentUser?.username?.toLowerCase() === username.toLowerCase();
                  const isPassVisible = visiblePasswords[username];
                  return (
                    <tr key={username} className="hover:bg-slate-100 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-black text-slate-900 dark:text-slate-100">
                        {usr.name || 'Unnamed User'}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-bold">
                        {usr.email || `${username}@school.edu`}
                      </td>
                      <td className="p-3 font-mono text-indigo-700 dark:text-indigo-300">
                        @{username}
                      </td>
                      <td className="p-3 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <span>{isPassVisible ? usr.password : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(username)}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            title={isPassVisible ? "Hide password" : "Show password"}
                          >
                            {isPassVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                          usr.role === 'admin'
                            ? 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                            : usr.role === 'hod'
                            ? 'bg-purple-100 text-purple-950 border-purple-300 dark:bg-purple-950 dark:text-purple-200'
                            : 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                        }`}>
                          {usr.role || 'faculty'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {isCurrentActive ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-400 text-[10px] font-black">
                            ● Active Logged In
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-slate-500 text-[10px]">Registered Profile</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => handleOpenResetModal(usr)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 rounded-lg text-[11px] font-black transition-colors cursor-pointer inline-flex items-center space-x-1"
                          title="Reset Password for this user"
                        >
                          <Key className="h-3.5 w-3.5 text-amber-600" />
                          <span className="hidden sm:inline">Reset Pass</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditUserModal(usr)}
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer"
                          title="Modify User Profile & Role"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => deleteUserAccount(username)}
                          disabled={isCurrentActive || (userAccounts || []).length <= 1}
                          className={`p-1.5 rounded-lg text-rose-600 dark:text-rose-400 transition-colors ${
                            isCurrentActive || (userAccounts || []).length <= 1
                              ? 'opacity-40 cursor-not-allowed'
                              : 'hover:bg-rose-100 dark:hover:bg-rose-950/60 cursor-pointer'
                          }`}
                          title={isCurrentActive ? "Cannot delete active session profile" : "Remove User Profile"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Comprehensive Data Backup & Restore Center */}
        <div className="glass-panel p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <Database className="h-6 w-6 text-purple-700 dark:text-purple-400" />
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Data Management, Storage Location & Backup Restore Center</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
                Export complete system backups as JSON or upload an existing JSON backup file to restore all school data.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Backup Storage Explanation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-300 dark:border-slate-700 space-y-2">
              <div className="flex items-center space-x-2">
                <FolderDown className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
                <h4 className="text-xs font-black text-slate-900 dark:text-white">Where are Backups Stored?</h4>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                When you click <strong>Export Backup JSON</strong>, your file is downloaded directly to your computer's default <strong>Downloads folder</strong> as a <code>.json</code> file (e.g. <code>Aumtara_Samay_Full_Backup_2026-08-14.json</code>). Keep this file safe to restore on any PC anytime!
              </p>
            </div>

            {/* Quick Actions */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-300 dark:border-slate-700 space-y-3 flex flex-col justify-between">
              <h4 className="text-xs font-black text-slate-900 dark:text-white">Backup & Restore Actions</h4>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center space-x-1.5 border border-purple-900"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Backup JSON</span>
                </button>

                <button
                  onClick={handleTriggerFileSelect}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center space-x-1.5 border border-emerald-900"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload & Restore Backup</span>
                </button>

                <button
                  onClick={() => {
                    setClearConfirmationChecked(false);
                    setClearModalOpen(true);
                  }}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center space-x-1.5 border border-rose-900 cursor-pointer hover:scale-105"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All Data & Start Fresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear All Data Safety Validation Modal with Checkmark Confirmation */}
      {clearModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border-2 border-rose-500 p-6 space-y-5 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
            <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300">
                <AlertTriangle className="h-7 w-7 text-rose-700 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight">
                  Selective Data Clean & Start Fresh
                </h3>
                <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                  Select checkmarks for which data categories you want to clean!
                </p>
              </div>
            </div>

            {/* Checkboxes List for Categories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300 pb-1">
                <span>Check Mark Data Categories to Clean:</span>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAllOptions(true)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAllOptions(false)}
                    className="text-slate-500 hover:underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div onClick={() => toggleCleanOption('clearTeachers')} className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedCleanOptions.clearTeachers ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  <div className="flex items-center space-x-2.5">
                    {selectedCleanOptions.clearTeachers ? <CheckSquare className="h-5 w-5 text-rose-600 dark:text-rose-400" /> : <Square className="h-5 w-5 text-slate-400" />}
                    <div><p className="text-xs font-black">Teachers Directory</p><p className="text-[10px] font-bold opacity-80">{teachers.length} Faculty Staff</p></div>
                  </div>
                  {selectedCleanOptions.clearTeachers && <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black">TO CLEAN</span>}
                </div>
                <div onClick={() => toggleCleanOption('clearClasses')} className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedCleanOptions.clearClasses ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  <div className="flex items-center space-x-2.5">
                    {selectedCleanOptions.clearClasses ? <CheckSquare className="h-5 w-5 text-rose-600 dark:text-rose-400" /> : <Square className="h-5 w-5 text-slate-400" />}
                    <div><p className="text-xs font-black">Classes & Sections</p><p className="text-[10px] font-bold opacity-80">{classes.length} Grade Sections</p></div>
                  </div>
                  {selectedCleanOptions.clearClasses && <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black">TO CLEAN</span>}
                </div>
                <div onClick={() => toggleCleanOption('clearSubjects')} className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedCleanOptions.clearSubjects ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  <div className="flex items-center space-x-2.5">
                    {selectedCleanOptions.clearSubjects ? <CheckSquare className="h-5 w-5 text-rose-600 dark:text-rose-400" /> : <Square className="h-5 w-5 text-slate-400" />}
                    <div><p className="text-xs font-black">Subjects Catalog</p><p className="text-[10px] font-bold opacity-80">{subjects.length} Courses</p></div>
                  </div>
                  {selectedCleanOptions.clearSubjects && <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black">TO CLEAN</span>}
                </div>
                <div onClick={() => toggleCleanOption('clearRooms')} className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedCleanOptions.clearRooms ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  <div className="flex items-center space-x-2.5">
                    {selectedCleanOptions.clearRooms ? <CheckSquare className="h-5 w-5 text-rose-600 dark:text-rose-400" /> : <Square className="h-5 w-5 text-slate-400" />}
                    <div><p className="text-xs font-black">Rooms & Science Labs</p><p className="text-[10px] font-bold opacity-80">{rooms.length} Rooms</p></div>
                  </div>
                  {selectedCleanOptions.clearRooms && <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black">TO CLEAN</span>}
                </div>
                <div onClick={() => toggleCleanOption('clearTimetable')} className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedCleanOptions.clearTimetable ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  <div className="flex items-center space-x-2.5">
                    {selectedCleanOptions.clearTimetable ? <CheckSquare className="h-5 w-5 text-rose-600 dark:text-rose-400" /> : <Square className="h-5 w-5 text-slate-400" />}
                    <div><p className="text-xs font-black">Live Timetable Matrix</p><p className="text-[10px] font-bold opacity-80">{Object.keys(timetable).length} Slots Scheduled</p></div>
                  </div>
                  {selectedCleanOptions.clearTimetable && <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black">TO CLEAN</span>}
                </div>
                <div onClick={() => toggleCleanOption('clearVersions')} className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedCleanOptions.clearVersions ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  <div className="flex items-center space-x-2.5">
                    {selectedCleanOptions.clearVersions ? <CheckSquare className="h-5 w-5 text-rose-600 dark:text-rose-400" /> : <Square className="h-5 w-5 text-slate-400" />}
                    <div><p className="text-xs font-black">Saved Version History</p><p className="text-[10px] font-bold opacity-80">{timetableVersions.length} Snapshots Saved</p></div>
                  </div>
                  {selectedCleanOptions.clearVersions && <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black">TO CLEAN</span>}
                </div>
              </div>
            </div>

            {/* Checkmark Validation Checkbox */}
            <div
              onClick={() => setClearConfirmationChecked(!clearConfirmationChecked)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                clearConfirmationChecked
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200'
                  : 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="mt-0.5">
                {clearConfirmationChecked ? (
                  <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Square className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-xs font-black">
                  Validation Checkmark Confirmation:
                </p>
                <p className="text-[11px] font-bold">
                  I confirm that I want to clean ONLY the checkmarked data categories above.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setClearModalOpen(false)}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!clearConfirmationChecked || !isAnyCategorySelected}
                onClick={() => {
                  clearSelectiveData(selectedCleanOptions);
                  setClearModalOpen(false);
                  setActiveTab('data');
                  setActiveSubTab('classes');
                }}
                className={`px-5 py-2.5 text-white text-xs font-black rounded-xl shadow-lg flex items-center space-x-2 border transition-all ${
                  clearConfirmationChecked && isAnyCategorySelected
                    ? 'bg-rose-700 hover:bg-rose-800 border-rose-900 cursor-pointer hover:scale-105'
                    : 'bg-slate-400 border-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                <span>Confirm & Clean Selected Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Success Confirmation Modal */}
      {restoreSummary && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border-2 border-emerald-500 p-6 space-y-4 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
            <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
              <FileCheck className="h-8 w-8" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Backup Restore Successful!</h3>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">File: {restoreSummary.fileName}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 space-y-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <p>🏫 <strong>Institution:</strong> {restoreSummary.institutionName}</p>
              <p>📚 <strong>Classes Restored:</strong> {restoreSummary.classesCount} Sections</p>
              <p>👥 <strong>Teachers Restored:</strong> {restoreSummary.teachersCount} Faculty</p>
              <p>📖 <strong>Subjects Restored:</strong> {restoreSummary.subjectsCount} Courses</p>
              <p>📅 <strong>Timetable Slots:</strong> {restoreSummary.slotsCount} Periods Scheduled</p>
            </div>

            <button
              onClick={() => setRestoreSummary(null)}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow border border-emerald-900"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Add / Modify User Account Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border-2 border-indigo-500 shadow-2xl p-6 space-y-4 animate-fadeIn text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black flex items-center space-x-2 text-indigo-950 dark:text-amber-300">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                <span>{editingUserObj ? 'Modify User Profile & Password' : 'Create New User Account'}</span>
              </h3>
              <button onClick={() => setUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-black mb-1">Full Name & Professional Title</label>
                <input
                  type="text"
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  placeholder="e.g. Prof. Sunita Rao"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-black text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-black mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={userEmailInput}
                  onChange={(e) => setUserEmailInput(e.target.value)}
                  placeholder="e.g. sunita.rao@school.edu"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-black text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-black mb-1">Username (Login ID)</label>
                <input
                  type="text"
                  value={userUsernameInput}
                  onChange={(e) => setUserUsernameInput(e.target.value)}
                  disabled={!!editingUserObj}
                  placeholder="e.g. sunitarao"
                  className={`w-full px-3.5 py-2 border-2 rounded-xl font-black ${
                    editingUserObj
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700 cursor-not-allowed'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block font-black mb-1">Password</label>
                <input
                  type="password"
                  value={userPasswordInput}
                  onChange={(e) => setUserPasswordInput(e.target.value)}
                  placeholder="Set account password"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-black text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-black mb-1">Assigned Role & Access Level</label>
                <select
                  value={userRoleInput}
                  onChange={(e) => setUserRoleInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-black text-slate-900 dark:text-white"
                >
                  <option value="admin">🛡️ Administrator (Full Control)</option>
                  <option value="hod">🎓 Department HOD (Approvals & Solver)</option>
                  <option value="faculty">👤 Faculty Teacher (Staff Duty View)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-black rounded-xl shadow-md flex items-center space-x-1 border border-indigo-900 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingUserObj ? 'Save Changes' : 'Create User Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Reset Password Modal */}
      {resetModalOpen && resetUserTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border-2 border-amber-500 shadow-2xl p-6 space-y-4 animate-fadeIn text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black flex items-center space-x-2 text-amber-950 dark:text-amber-300">
                <Key className="h-5 w-5 text-amber-600" />
                <span>Reset User Password (@{resetUserTarget.username})</span>
              </h3>
              <button onClick={() => setResetModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold">
              Set a new password for account <strong>{resetUserTarget.name}</strong> (@{resetUserTarget.username}).
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-black mb-1">Enter New Password</label>
                <input
                  type="text"
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-700 rounded-xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-amber-600"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl shadow-md flex items-center space-x-1 border border-amber-800 cursor-pointer"
                >
                  <Key className="h-4 w-4" />
                  <span>Confirm Reset Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRoleKey && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border-2 border-slate-300 dark:border-slate-700 p-6 space-y-4 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Edit2 className="h-5 w-5 text-indigo-700" />
              <span>Edit Role Metadata ({editingRoleKey.toUpperCase()})</span>
            </h3>

            <form onSubmit={handleSaveRoleMeta} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Role Display Title</label>
                <input
                  type="text"
                  value={roleTitleInput}
                  onChange={(e) => setRoleTitleInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-slate-200 mb-1.5">Role Description</label>
                <input
                  type="text"
                  value={roleDescInput}
                  onChange={(e) => setRoleDescInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingRoleKey(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow border border-indigo-900 flex items-center space-x-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Role Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

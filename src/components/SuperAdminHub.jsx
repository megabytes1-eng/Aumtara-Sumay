import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  ShieldAlert,
  Building2,
  Lock,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Key,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  Eye,
  EyeOff,
  RefreshCw,
  Award,
  BookOpen,
  Package,
  CheckSquare,
  Square
} from 'lucide-react';

export default function SuperAdminHub() {
  const {
    activeSubTab,
    setActiveSubTab,
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
    updateCustomPackagePrice,
    deleteCustomPackage,
    createCustomPackage,
    assignPackageToSchool,
    superAdminProfile,
    updateSuperAdminProfile,
    platformAuditLogs,
    addAuditLog,
    showToast
  } = useTimetable();

  // Sync active sub-tab from sidebar (defaulting to 'dashboard')
  const activeTab = activeSubTab || 'dashboard';
  const setActiveTab = (tabKey) => setActiveSubTab(tabKey);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // 2FA Security OTP Challenge State
  const [otpInput, setOtpInput] = useState('');
  const [selectedOtpMethod, setSelectedOtpMethod] = useState('email');

  // Interactive Email / SMS OTP Dispatch Simulator Modal State
  const [otpDispatchModal, setOtpDispatchModal] = useState({
    isOpen: false,
    otpCode: '',
    method: 'email',
    target: ''
  });

  const handleTriggerOTP = () => {
    const generated = sendSuperAdminOTP(selectedOtpMethod);
    const code = generated || superAdmin2FA.sentOTP || '789012';
    setOtpDispatchModal({
      isOpen: true,
      otpCode: code,
      method: selectedOtpMethod,
      target: selectedOtpMethod === 'email' ? superAdmin2FA.email : superAdmin2FA.phone
    });
  };

  const handleAutoFillAndVerify = () => {
    setOtpInput(otpDispatchModal.otpCode);
    verifySuperAdminOTP(otpDispatchModal.otpCode);
    setOtpDispatchModal({ ...otpDispatchModal, isOpen: false });
  };

  // Super Admin Real Profile Configuration Form State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: superAdminProfile.name || 'Aumtara SaaS Master Admin',
    email: superAdminProfile.email || 'admin@aumtara.com',
    phone: superAdminProfile.phone || '+91 98765 43210',
    password: superAdminProfile.password || 'superadmin123'
  });

  const handleSaveSuperAdminProfile = (e) => {
    e.preventDefault();
    if (!profileForm.email || !profileForm.phone) {
      showToast('Please enter your original Email and Mobile number.', 'warning');
      return;
    }
    updateSuperAdminProfile(
      profileForm.name,
      profileForm.email,
      profileForm.phone,
      profileForm.password
    );
    setProfileModalOpen(false);
  };

  // Modals
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [credentialModalOpen, setCredentialModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [assignPkgModalOpen, setAssignPkgModalOpen] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState({});

  // Custom Package Builder Studio Form State
  const [pkgBuilderForm, setPkgBuilderForm] = useState({
    name: '',
    description: '',
    customPriceOverride: '',
    selectedModules: {
      aiGenerator: true,
      substituteFinder: true,
      loadAnalyzer: false,
      reportsExport: true,
      multiShiftMatrix: false,
      customLogo: false
    }
  });

  // Assign Package Form State
  const [assignForm, setAssignForm] = useState({
    schoolId: '',
    packageId: ''
  });

  // Onboarding Form State
  const [newSchoolForm, setNewSchoolForm] = useState({
    code: '',
    name: '',
    address: '',
    principalName: '',
    adminEmail: '',
    adminPassword: '',
    phone: '',
    planTier: 'Enterprise Dual-Shift',
    annualPriceINR: 75000,
    renewalDate: '2027-01-01',
    maxClassesLimit: 30,
    maxTeachersLimit: 100
  });

  // Credential Edit Form State
  const [credForm, setCredForm] = useState({
    schoolId: '',
    adminEmail: '',
    adminPassword: '',
    principalName: ''
  });

  // Subscription Edit Form State
  const [subForm, setSubForm] = useState({
    schoolId: '',
    planTier: 'Enterprise Dual-Shift',
    annualPriceINR: 75000,
    renewalDate: '2027-01-01',
    paymentStatus: 'Paid (Current)'
  });

  // Editable Module Price State
  const [editingModulePrices, setEditingModulePrices] = useState(
    modulePricingCatalog.reduce((acc, m) => ({ ...acc, [m.key]: m.annualPriceINR }), {})
  );

  // Computed KPIs
  const totalSchools = subscribedSchools.length;
  const activeSchools = subscribedSchools.filter((s) => s.status === 'Active').length;
  const trialingSchools = subscribedSchools.filter((s) => s.status === 'Trialing').length;
  const suspendedSchools = subscribedSchools.filter((s) => s.status === 'Suspended').length;
  const totalARR = subscribedSchools.reduce((acc, s) => acc + (s.annualPriceINR || 0), 0);

  // Filtered Schools Directory
  const filteredSchools = subscribedSchools.filter((sch) => {
    const matchesSearch =
      sch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.principalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dynamic calculated package price from module pricing catalog
  const calculatedPackagePrice = Object.entries(pkgBuilderForm.selectedModules).reduce(
    (total, [modKey, isSelected]) => {
      if (!isSelected) return total;
      const foundMod = modulePricingCatalog.find((m) => m.key === modKey);
      return total + (foundMod?.annualPriceINR || 0);
    },
    0
  );

  const finalPackagePrice = pkgBuilderForm.customPriceOverride
    ? Number(pkgBuilderForm.customPriceOverride)
    : calculatedPackagePrice;

  const togglePasswordVisibility = (schoolId) => {
    setShowPasswordMap((prev) => ({ ...prev, [schoolId]: !prev[schoolId] }));
  };

  const handleOpenCredModal = (sch) => {
    setCredForm({
      schoolId: sch.id,
      adminEmail: sch.adminEmail,
      adminPassword: sch.adminPassword,
      principalName: sch.principalName
    });
    setEditingSchool(sch);
    setCredentialModalOpen(true);
  };

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    updateSchoolAdminCredentials(
      credForm.schoolId,
      credForm.adminEmail,
      credForm.adminPassword,
      credForm.principalName
    );
    setCredentialModalOpen(false);
  };

  const handleOpenSubModal = (sch) => {
    setSubForm({
      schoolId: sch.id,
      planTier: sch.planTier,
      annualPriceINR: sch.annualPriceINR,
      renewalDate: sch.renewalDate,
      paymentStatus: sch.paymentStatus
    });
    setEditingSchool(sch);
    setSubscriptionModalOpen(true);
  };

  const handleSaveSubscription = (e) => {
    e.preventDefault();
    updateSchoolSubscription(
      subForm.schoolId,
      subForm.planTier,
      subForm.annualPriceINR,
      subForm.renewalDate,
      subForm.paymentStatus
    );
    setSubscriptionModalOpen(false);
  };

  const handleOnboardSchoolSubmit = (e) => {
    e.preventDefault();
    if (!newSchoolForm.name || !newSchoolForm.adminEmail || !newSchoolForm.adminPassword) {
      showToast('Please fill out all required institution fields.', 'warning');
      return;
    }
    addSubscribedSchool({
      ...newSchoolForm,
      code: newSchoolForm.code || `SCH-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setOnboardModalOpen(false);
    setNewSchoolForm({
      code: '',
      name: '',
      address: '',
      principalName: '',
      adminEmail: '',
      adminPassword: '',
      phone: '',
      planTier: 'Enterprise Dual-Shift',
      annualPriceINR: 75000,
      renewalDate: '2027-01-01',
      maxClassesLimit: 30,
      maxTeachersLimit: 100
    });
  };

  const [editingPackagePrices, setEditingPackagePrices] = useState({});

  const handleModulePriceSave = (modKey) => {
    updateModulePrice(modKey, editingModulePrices[modKey]);
  };

  const handlePackagePriceSave = (pkgId) => {
    const newPrice = editingPackagePrices[pkgId];
    if (newPrice !== undefined && newPrice !== '') {
      updateCustomPackagePrice(pkgId, newPrice);
    }
  };

  const handleToggleModuleInBuilder = (modKey) => {
    setPkgBuilderForm((prev) => ({
      ...prev,
      selectedModules: {
        ...prev.selectedModules,
        [modKey]: !prev.selectedModules[modKey]
      }
    }));
  };

  const handleCreatePackageSubmit = (e) => {
    e.preventDefault();
    if (!pkgBuilderForm.name) {
      showToast('Please enter a package name.', 'warning');
      return;
    }
    createCustomPackage(
      pkgBuilderForm.name,
      pkgBuilderForm.description || 'Custom modular subscription package.',
      pkgBuilderForm.selectedModules,
      finalPackagePrice
    );
    setPkgBuilderForm({
      name: '',
      description: '',
      customPriceOverride: '',
      selectedModules: {
        aiGenerator: true,
        substituteFinder: true,
        loadAnalyzer: false,
        reportsExport: true,
        multiShiftMatrix: false,
        customLogo: false
      }
    });
  };

  const handleAssignPackageSubmit = (e) => {
    e.preventDefault();
    if (!assignForm.schoolId || !assignForm.packageId) {
      showToast('Please select both a school and a package.', 'warning');
      return;
    }
    const selectedPkg = customPackages.find((p) => p.id === assignForm.packageId);
    if (selectedPkg) {
      assignPackageToSchool(assignForm.schoolId, selectedPkg);
      setAssignPkgModalOpen(false);
    }
  };

  // 2FA Security Verification Screen
  if (!superAdmin2FA.isVerified) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 animate-fadeIn">
        <div className="glass-panel p-8 rounded-3xl border-2 border-rose-300 dark:border-rose-900 bg-white dark:bg-slate-900 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100 border-t-8 border-t-rose-600">
          <div className="flex items-start space-x-4">
            <div className="p-4 bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 rounded-2xl border border-rose-300 dark:border-rose-800 shrink-0">
              <Lock className="h-8 w-8 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-rose-200 text-rose-950 dark:bg-rose-900 dark:text-rose-200 font-black text-[10px] uppercase rounded-full tracking-wider">
                🔐 High-Security Verification
              </span>
              <h2 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                Super Admin 2FA Security Lock
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                Super Admin Master Program access requires mandatory 2-Factor Authentication via 6-digit Email or Mobile OTP confirmation.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <div className="flex items-center justify-between font-black">
              <span className="text-slate-700 dark:text-slate-300">Select OTP Destination:</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedOtpMethod('email')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer border transition-all ${
                    selectedOtpMethod === 'email'
                      ? 'bg-indigo-700 text-white border-indigo-900 shadow'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  📧 Email OTP
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOtpMethod('mobile')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer border transition-all ${
                    selectedOtpMethod === 'mobile'
                      ? 'bg-indigo-700 text-white border-indigo-900 shadow'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  📱 Mobile SMS OTP
                </button>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-slate-500 font-bold block">Verification Target:</span>
                <span className="font-mono font-black text-indigo-700 dark:text-indigo-300">
                  {selectedOtpMethod === 'email' ? superAdmin2FA.email : superAdmin2FA.phone}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-[11px] font-black rounded-lg border border-amber-300 cursor-pointer"
                title="Enter your real email and phone number for 2FA testing"
              >
                ⚙️ Set Real Contact
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleTriggerOTP}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg border border-amber-300 cursor-pointer flex items-center space-x-2 transition-all hover:scale-105"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Send 6-Digit Security OTP (Email/SMS)</span>
              </button>

              <div className="text-[11px] font-mono font-black text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-300">
                Demo OTP Code: [ 789012 ]
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Enter 6-Digit 2FA Verification Code:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="e.g. 789012"
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-center text-lg font-mono font-black text-indigo-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 tracking-widest"
              />
              <button
                type="button"
                onClick={() => verifySuperAdminOTP(otpInput || '789012')}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-lg border border-emerald-900 cursor-pointer shrink-0 transition-all hover:scale-105"
              >
                Verify & Unlock
              </button>
            </div>
            
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => verifySuperAdminOTP('789012')}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow border border-amber-300 cursor-pointer transition-all hover:scale-105"
              >
                ⚡ Instant 1-Click Auto-Verify 2FA & Open Master Control Panel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden glass-panel p-6 md:p-8 rounded-3xl border-2 border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wider shadow-md">
                👑 SaaS Super Admin
              </span>
              <span className="px-3 py-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-black text-[10px] uppercase rounded-full">
                🔒 2FA Verified Security
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>AUMTARA SAMAY — Platform Master Control</span>
            </h1>
            <p className="text-xs md:text-sm text-indigo-200/90 font-medium max-w-3xl leading-relaxed">
              Manage all subscribing school tenants, enable/disable institutional access, reset school admin passwords, configure module permissions, and build custom pricing packages ($ / ₹ per year).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAssignPkgModalOpen(true)}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-2xl shadow-xl transition-all border border-purple-400 flex items-center space-x-2 cursor-pointer"
            >
              <Package className="h-4 w-4" />
              <span>Assign Custom Package</span>
            </button>

            <button
              onClick={() => setOnboardModalOpen(true)}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition-all hover:scale-105 border border-amber-300 flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Onboard New Institution</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial & Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Subscriptions
            </span>
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalSchools}</p>
          <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-1">
            {activeSchools} Active • {trialingSchools} Trial • {suspendedSchools} Suspended
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-900/50 bg-white dark:bg-slate-900 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Annual Recurring Revenue
            </span>
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-2">
            ₹ {totalARR.toLocaleString('en-IN')} / Yr
          </p>
          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Total ARR across subscribed schools
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-2 border-purple-300 dark:border-purple-900/50 bg-white dark:bg-slate-900 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Modular Packages Built
            </span>
            <div className="p-2.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-xl">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-950 dark:text-purple-200 mt-2">{customPackages.length} Packages</p>
          <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-1">
            Custom module-wise pricing defined
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-900/50 bg-white dark:bg-slate-900 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Security 2FA Authentication
            </span>
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-xl">
              <Lock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-950 dark:text-amber-200 mt-2">Verified</p>
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
            Email & SMS OTP Confirmed
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'dashboard' || !activeTab
                ? 'bg-amber-500 text-slate-950 shadow-lg border border-amber-300 scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-950 dark:text-amber-300" />
            <span>1. SA Executive Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('schools')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'schools'
                ? 'bg-indigo-700 text-white shadow-lg border border-indigo-900 scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>2. Subscribed Institutions ({totalSchools})</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'modules'
                ? 'bg-indigo-700 text-white shadow-lg border border-indigo-900 scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>2. Module Access Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-indigo-700 text-white shadow-lg border border-indigo-900 scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="h-4 w-4 text-purple-400" />
            <span>3. Package & Module Pricing Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'billing'
                ? 'bg-indigo-700 text-white shadow-lg border border-indigo-900 scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>4. Annual Subscriptions</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-indigo-700 text-white shadow-lg border border-indigo-900 scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Key className="h-4 w-4" />
            <span>5. Admin Passwords</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-indigo-700 text-white shadow-lg border border-indigo-900 scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>7. Platform Audit Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-indigo-700 text-white shadow-lg border border-indigo-900 scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span>8. Super Admin Profile & 2FA</span>
          </button>
        </div>

        {/* Directory Search & Filters */}
        {activeTab === 'schools' && (
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search school name, code, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Trialing">Trialing Only</option>
              <option value="Suspended">Suspended Only</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: SA Executive Command Dashboard Overview */}
      {(activeTab === 'dashboard' || !activeTab) && (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive Hero Banner */}
          <div className="glass-panel p-6 rounded-3xl border-2 border-amber-300 dark:border-amber-900/50 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 shadow-xl flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wider">
                📊 SA Executive Command Dashboard
              </span>
              <h2 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                FHMIS Platform Command Overview
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                Platform status is 100% operational across all {totalSchools} subscribing school tenants.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setOnboardModalOpen(true)}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-105"
              >
                + Onboard New Subscribed School
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('schools')}
              className="p-5 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-900 hover:border-indigo-500 transition-all text-left space-y-2 cursor-pointer shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl group-hover:scale-110 transition-transform">
                  <Building2 className="h-5 w-5" />
                </span>
                <span className="text-xs font-mono font-black text-indigo-600">{activeSchools} / {totalSchools} Active</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white">Subscribed Institutions Directory</h4>
              <p className="text-xs text-slate-500 font-bold">Enable, disable, or suspend tenant institution accounts.</p>
            </button>

            <button
              onClick={() => setActiveTab('modules')}
              className="p-5 rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-900 hover:border-emerald-500 transition-all text-left space-y-2 cursor-pointer shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl group-hover:scale-110 transition-transform">
                  <Sliders className="h-5 w-5" />
                </span>
                <span className="text-xs font-mono font-black text-emerald-600">6 Core Modules</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white">Module Feature Permission Matrix</h4>
              <p className="text-xs text-slate-500 font-bold">Turn AI Generator, Substitute Finder, & Exports on/off per school.</p>
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className="p-5 rounded-2xl border-2 border-purple-200 dark:border-purple-900/50 bg-white dark:bg-slate-900 hover:border-purple-500 transition-all text-left space-y-2 cursor-pointer shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-xl group-hover:scale-110 transition-transform">
                  <Package className="h-5 w-5" />
                </span>
                <span className="text-xs font-mono font-black text-purple-600">{customPackages.length} Packages</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white">Custom Package & Pricing Studio</h4>
              <p className="text-xs text-slate-500 font-bold">Define per-year module pricing & build custom subscription packages.</p>
            </button>
          </div>

          {/* Subscribed Schools Table Snapshot */}
          <div className="glass-panel p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider">
                Recent Institutional Subscriptions Overview
              </h3>
              <button
                onClick={() => setActiveTab('schools')}
                className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View Full Directory ({totalSchools} Schools) →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="p-3">School Name</th>
                    <th className="p-3">Plan Tier</th>
                    <th className="p-3">ARR Charge</th>
                    <th className="p-3">Access Status</th>
                    <th className="p-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
                  {subscribedSchools.slice(0, 3).map((sch) => (
                    <tr key={sch.id}>
                      <td className="p-3 font-black text-indigo-950 dark:text-white">{sch.name}</td>
                      <td className="p-3">{sch.planTier}</td>
                      <td className="p-3 font-mono text-emerald-700 dark:text-emerald-400">₹ {sch.annualPriceINR.toLocaleString('en-IN')}/Yr</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          sch.status === 'Active' ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
                        }`}>
                          {sch.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => toggleSchoolStatus(sch.id, sch.status === 'Active' ? 'Suspended' : 'Active')}
                          className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-xs font-black rounded-lg hover:bg-slate-300 cursor-pointer"
                        >
                          Toggle Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Subscribed Schools Directory */}
      {activeTab === 'schools' && (
        <div className="glass-panel rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-4">Institution Name & Code</th>
                  <th className="p-4">Principal & Admin Email</th>
                  <th className="p-4">Plan Tier / Package</th>
                  <th className="p-4">Annual Fee (INR)</th>
                  <th className="p-4">Renewal Date</th>
                  <th className="p-4">Access Status</th>
                  <th className="p-4 text-right">Super Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
                {filteredSchools.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-500">
                      No subscribed institutions found matching search.
                    </td>
                  </tr>
                ) : (
                  filteredSchools.map((sch) => (
                    <tr
                      key={sch.id}
                      className={`hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors ${
                        sch.status === 'Suspended' ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="p-4 space-y-1">
                        <div className="font-black text-sm text-indigo-950 dark:text-white flex items-center space-x-2">
                          <span>{sch.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                          <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded font-black text-slate-800 dark:text-slate-200">
                            {sch.code}
                          </span>
                          <span>{sch.address}</span>
                        </div>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <div className="font-black text-slate-900 dark:text-slate-100">{sch.principalName}</div>
                        <div className="font-mono text-[11px] text-indigo-700 dark:text-indigo-400">{sch.adminEmail}</div>
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-950 dark:bg-purple-950/80 dark:text-purple-200 text-[10px] font-black border border-purple-300 dark:border-purple-800">
                          {sch.planTier}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-sm font-black text-emerald-700 dark:text-emerald-400">
                        ₹ {sch.annualPriceINR.toLocaleString('en-IN')} / Yr
                      </td>

                      <td className="p-4 font-mono text-slate-800 dark:text-slate-200">
                        {sch.renewalDate}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() =>
                            toggleSchoolStatus(sch.id, sch.status === 'Active' ? 'Suspended' : 'Active')
                          }
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-black cursor-pointer border transition-all ${
                            sch.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200'
                              : sch.status === 'Trialing'
                              ? 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200'
                              : 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200'
                          }`}
                          title="Click to Toggle Institution Access Enable/Disable"
                        >
                          {sch.status === 'Active' ? (
                            <ToggleRight className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-rose-700 dark:text-rose-400" />
                          )}
                          <span>{sch.status}</span>
                        </button>
                      </td>

                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenCredModal(sch)}
                          className="p-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/50 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 rounded-xl border border-amber-300 dark:border-amber-700 cursor-pointer"
                          title="Reset Password & Admin Credentials"
                        >
                          <Key className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleOpenSubModal(sch)}
                          className="p-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950/50 dark:hover:bg-indigo-900 text-indigo-900 dark:text-indigo-200 rounded-xl border border-indigo-300 dark:border-indigo-700 cursor-pointer"
                          title="Update Subscription Pricing & Renewal Date"
                        >
                          <DollarSign className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => deleteSubscribedSchool(sch.id)}
                          className="p-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/50 dark:hover:bg-rose-900 text-rose-900 dark:text-rose-200 rounded-xl border border-rose-300 dark:border-rose-700 cursor-pointer"
                          title="Delete School Subscription Account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Module Feature Access Control Matrix */}
      {activeTab === 'modules' && (
        <div className="glass-panel p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="h-5 w-5 text-indigo-600" />
              <span>Multi-Tenant School Module Enable / Disable Matrix</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
              Toggle specific features on or off for individual subscribing schools based on their paid plan level.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-4">Subscribed School</th>
                  <th className="p-4 text-center">🤖 AI Generator</th>
                  <th className="p-4 text-center">🔄 Substitute Finder</th>
                  <th className="p-4 text-center">📊 Load Analyzer</th>
                  <th className="p-4 text-center">📄 PDF/Excel Exports</th>
                  <th className="p-4 text-center">🌅 Multi-Shift Matrix</th>
                  <th className="p-4 text-center">🎨 Custom Logo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
                {subscribedSchools.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="font-black text-indigo-950 dark:text-white">{sch.name}</div>
                      <div className="font-mono text-[10px] text-slate-500">{sch.code} • {sch.planTier}</div>
                    </td>

                    {/* Module Toggles */}
                    {[
                      { key: 'aiGenerator', label: 'AI Generator' },
                      { key: 'substituteFinder', label: 'Substitute Finder' },
                      { key: 'loadAnalyzer', label: 'Load Analyzer' },
                      { key: 'reportsExport', label: 'Exports' },
                      { key: 'multiShiftMatrix', label: 'Multi-Shift' },
                      { key: 'customLogo', label: 'Custom Logo' }
                    ].map((mod) => {
                      const isEnabled = sch.enabledModules?.[mod.key];
                      return (
                        <td key={mod.key} className="p-4 text-center">
                          <button
                            onClick={() => toggleSchoolModule(sch.id, mod.key)}
                            className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer border ${
                              isEnabled
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200'
                                : 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {isEnabled ? 'ENABLED' : 'DISABLED'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Modular Package Builder Studio & Module Pricing */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          {/* Section A: Module-Wise Base & Add-on Price Editor */}
          <div className="glass-panel p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <span>1. Module-Wise Yearly Pricing Studio (Per-Year Charge Definition)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
                Define the individual annual price (₹ / Year) for each feature module. These prices are used to auto-calculate package totals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modulePricingCatalog.map((mod) => (
                <div
                  key={mod.key}
                  className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="font-black text-sm text-indigo-950 dark:text-white">{mod.name}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">{mod.description}</p>
                  
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-xs font-black text-slate-500">₹</span>
                    <input
                      type="number"
                      value={editingModulePrices[mod.key] ?? mod.annualPriceINR}
                      onChange={(e) =>
                        setEditingModulePrices({
                          ...editingModulePrices,
                          [mod.key]: e.target.value
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-black text-emerald-700 dark:text-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleModulePriceSave(mod.key)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl cursor-pointer shrink-0"
                    >
                      Save Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Custom Package Builder Studio */}
          <div className="glass-panel p-6 rounded-3xl border-2 border-purple-200 dark:border-purple-900/50 bg-white dark:bg-slate-900 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Package className="h-5 w-5 text-purple-600" />
                <span>2. Interactive Custom Package Builder</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
                Select modules to create custom pricing packages for schools. Package total is auto-computed based on module prices.
              </p>
            </div>

            <form onSubmit={handleCreatePackageSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">Package Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CBSE Premier Multi-Shift Package"
                    value={pkgBuilderForm.name}
                    onChange={(e) => setPkgBuilderForm({ ...pkgBuilderForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">Custom Price Override (Optional)</label>
                  <input
                    type="number"
                    placeholder={`Auto Calculated: ₹ ${calculatedPackagePrice.toLocaleString('en-IN')}`}
                    value={pkgBuilderForm.customPriceOverride}
                    onChange={(e) => setPkgBuilderForm({ ...pkgBuilderForm, customPriceOverride: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                  Select Modules to Include in Package:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {modulePricingCatalog.map((mod) => {
                    const isChecked = pkgBuilderForm.selectedModules[mod.key];
                    return (
                      <button
                        type="button"
                        key={mod.key}
                        onClick={() => handleToggleModuleInBuilder(mod.key)}
                        className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-700 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-black text-xs text-slate-900 dark:text-white">{mod.name}</div>
                          <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-black">
                            + ₹ {mod.annualPriceINR.toLocaleString('en-IN')} / Yr
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-100/70 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-xs font-black text-purple-950 dark:text-purple-200 uppercase tracking-wider">
                    Total Calculated Annual Package Charge:
                  </span>
                  <p className="text-2xl font-black text-purple-950 dark:text-white">
                    ₹ {finalPackagePrice.toLocaleString('en-IN')} / Year
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-lg border border-purple-900 cursor-pointer transition-all hover:scale-105"
                >
                  Create & Save Package
                </button>
              </div>
            </form>
          </div>

          {/* Section C: Saved Custom Packages Directory */}
          <div className="glass-panel p-6 rounded-3xl border-2 border-purple-300 dark:border-purple-900/50 bg-white dark:bg-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <span>3. Saved Custom Packages Catalog (Real-Time Price Sync)</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-0.5">
                  Package prices dynamically adjust when module definitions change. You can also override prices individually or assign packages to schools.
                </p>
              </div>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 text-xs font-black rounded-full border border-purple-300">
                {customPackages.length} Catalog Packages Saved
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customPackages.map((pkg) => {
                let liveSum = 0;
                Object.entries(pkg.includedModules || {}).forEach(([mKey, isInc]) => {
                  if (isInc) {
                    const mObj = modulePricingCatalog.find((m) => m.key === mKey);
                    if (mObj) liveSum += mObj.annualPriceINR;
                  }
                });

                return (
                  <div key={pkg.id} className="p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4 shadow-md hover:border-purple-400 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-black bg-purple-200 dark:bg-purple-900 text-purple-950 dark:text-purple-200 px-2 py-0.5 rounded">
                          {pkg.id}
                        </span>
                        <div className="text-right">
                          <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm block">
                            ₹ {pkg.annualPriceINR.toLocaleString('en-IN')} / Yr
                          </span>
                          {pkg.isCustomOverride ? (
                            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.2 rounded">
                              Custom Override
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-500 block">
                              (Auto-Synced from Modules)
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="font-black text-sm text-slate-900 dark:text-white">{pkg.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">{pkg.description}</p>

                      {/* Live Price Update Input */}
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 space-y-1.5">
                        <label className="block text-[10px] font-black text-slate-500 uppercase">Update Package Price (₹ / Yr):</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-400">₹</span>
                          <input
                            type="number"
                            value={editingPackagePrices[pkg.id] ?? pkg.annualPriceINR}
                            onChange={(e) =>
                              setEditingPackagePrices({
                                ...editingPackagePrices,
                                [pkg.id]: e.target.value
                              })
                            }
                            className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-black text-emerald-700 dark:text-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={() => handlePackagePriceSave(pkg.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black rounded-lg cursor-pointer shrink-0"
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 border-t border-slate-200 dark:border-slate-700 pt-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        <div className="font-black uppercase text-slate-500 flex justify-between">
                          <span>Included Modules:</span>
                          <span className="font-mono text-purple-600 dark:text-purple-400">Sum: ₹{liveSum.toLocaleString('en-IN')}</span>
                        </div>
                        <ul className="space-y-1">
                          {Object.entries(pkg.includedModules || {}).map(([mKey, isInc]) => {
                            if (!isInc) return null;
                            const mObj = modulePricingCatalog.find((m) => m.key === mKey);
                            return (
                              <li key={mKey} className="flex items-center justify-between bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                                <span>{mObj ? mObj.name : mKey}</span>
                                <span className="font-mono font-bold text-emerald-600 text-[10px]">
                                  + ₹{mObj ? mObj.annualPriceINR.toLocaleString('en-IN') : 0}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAssignForm({ schoolId: '', packageId: pkg.id });
                          setAssignPkgModalOpen(true);
                        }}
                        className="flex-1 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-black rounded-xl shadow cursor-pointer text-center"
                      >
                        Assign to School
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCustomPackage(pkg.id)}
                        className="p-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-black rounded-xl border border-rose-300 cursor-pointer"
                        title="Delete Package"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Annual Subscriptions & Pricing Manager */}
      {activeTab === 'billing' && (
        <div className="glass-panel p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <span>Annual Subscription Pricing & Plan Tiers Control</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
                Manage per-year pricing ($ / ₹ per year), set renewal dates, and manage payment statuses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customPackages.map((pkg) => {
              const subscribedCount = subscribedSchools.filter(
                (s) => s.packageId === pkg.id || s.planTier === pkg.name
              ).length;

              return (
                <div key={pkg.id} className="p-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200 text-[10px] font-black font-mono">
                      {pkg.id}
                    </span>
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                      {subscribedCount} School{subscribedCount === 1 ? '' : 's'} Active
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{pkg.name}</h4>
                  <p className="text-2xl font-black text-emerald-950 dark:text-emerald-200">
                    ₹ {pkg.annualPriceINR.toLocaleString('en-IN')} / Yr
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                    {pkg.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="overflow-x-auto pt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-4">School</th>
                  <th className="p-4">Plan Tier</th>
                  <th className="p-4">Annual Charge</th>
                  <th className="p-4">Renewal Date</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4 text-right">Update Subscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
                {subscribedSchools.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-black text-indigo-950 dark:text-white">{sch.name}</td>
                    <td className="p-4">{sch.planTier}</td>
                    <td className="p-4 font-mono font-black text-emerald-700 dark:text-emerald-400">
                      ₹ {sch.annualPriceINR.toLocaleString('en-IN')} / Yr
                    </td>
                    <td className="p-4 font-mono">{sch.renewalDate}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{sch.paymentStatus}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenSubModal(sch)}
                        className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black rounded-xl cursor-pointer"
                      >
                        Edit Pricing & Tier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: School Admin Credentials & Password Control */}
      {activeTab === 'security' && (
        <div className="glass-panel p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Key className="h-5 w-5 text-amber-600" />
              <span>School Admin Account Login & Password Management</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
              Super Admin can view, change, or generate new passwords for any subscribing school administrator.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-4">School Name</th>
                  <th className="p-4">Principal / Contact</th>
                  <th className="p-4">Admin Username / Email</th>
                  <th className="p-4">Admin Password</th>
                  <th className="p-4 text-right">Password Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
                {subscribedSchools.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-black text-indigo-950 dark:text-white">{sch.name}</td>
                    <td className="p-4">{sch.principalName}</td>
                    <td className="p-4 font-mono text-indigo-700 dark:text-indigo-300">{sch.adminEmail}</td>
                    <td className="p-4 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-900 dark:text-slate-100 font-black">
                          {showPasswordMap[sch.id] ? sch.adminPassword : '••••••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(sch.id)}
                          className="p-1 hover:text-indigo-600 cursor-pointer"
                        >
                          {showPasswordMap[sch.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenCredModal(sch)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl cursor-pointer"
                      >
                        Reset / Change Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: Platform Audit Logs & Live Activity Stream */}
      {activeTab === 'logs' && (
        <div className="glass-panel p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              <span>SaaS Platform Audit Trail & System Activity Stream</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
              Real-time security log of all Super Admin operations, school status toggles, 2FA OTP authentications, and pricing updates.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action Type</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200 font-bold">
                {platformAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200 text-[10px] font-black border border-emerald-300 dark:border-emerald-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-black text-slate-900 dark:text-white">{log.description}</td>
                    <td className="p-4 font-mono text-indigo-700 dark:text-indigo-300">{log.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: Super Admin Master Profile & Security Credentials Page */}
      {activeTab === 'profile' && (
        <div className="glass-panel p-6 rounded-3xl border-2 border-amber-300 dark:border-amber-900 bg-white dark:bg-slate-900 shadow-xl space-y-6 animate-fadeIn">
          <div>
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wider">
              👑 Master Account Management
            </span>
            <h3 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight mt-2 flex items-center space-x-2">
              <ShieldAlert className="h-6 w-6 text-amber-500" />
              <span>Super Admin Profile & 2FA Security Control</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
              Manage your master Super Admin name, official email address, mobile SMS phone number, and security password.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Badge Card */}
            <div className="p-6 rounded-3xl border-2 border-indigo-200 dark:border-indigo-900/50 bg-slate-50 dark:bg-slate-800/50 space-y-4 text-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-amber-400 via-indigo-600 to-purple-600 mx-auto flex items-center justify-center text-4xl shadow-xl border-4 border-white dark:border-slate-700">
                👑
              </div>

              <div>
                <h4 className="font-black text-lg text-slate-900 dark:text-white">{superAdminProfile.name}</h4>
                <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">SaaS Master Super Administrator</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 space-y-1 text-left">
                <span className="text-[10px] font-black text-emerald-900 dark:text-emerald-200 uppercase block">2FA Security Status:</span>
                <div className="flex items-center space-x-1.5 font-bold text-xs text-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Email & Mobile OTP Verified</span>
                </div>
              </div>
            </div>

            {/* Profile Edit Form Card */}
            <div className="md:col-span-2 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5">
              <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                Edit Master Contact Credentials
              </h4>

              <form onSubmit={handleSaveSuperAdminProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Official Name *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Master Admin Password *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-indigo-700 dark:text-indigo-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                      Original Email Address (For 2FA OTP Delivery) *
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-indigo-700 dark:text-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                      Original Mobile Phone Number (For 2FA SMS Delivery) *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-indigo-700 dark:text-indigo-400"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg border border-amber-300 cursor-pointer transition-all hover:scale-105"
                  >
                    Save Master Profile Credentials
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Simulated Email & SMS OTP Dispatcher Modal */}
      {otpDispatchModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border-2 border-indigo-300 dark:border-indigo-800 p-6 space-y-5 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100 border-t-8 border-t-indigo-600">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl text-lg">
                  {otpDispatchModal.method === 'email' ? '📨' : '📱'}
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-tight">
                    {otpDispatchModal.method === 'email' ? 'Official 2FA Email Dispatched' : 'Mobile SMS OTP Dispatched'}
                  </h3>
                  <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                    Target: {otpDispatchModal.target}
                  </p>
                </div>
              </div>
              <button onClick={() => setOtpDispatchModal({ ...otpDispatchModal, isOpen: false })} className="text-slate-400 font-black text-lg">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs font-sans">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>From: security-2fa@aumtara.saas</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                Subject: [AUMTARA SAMAY] 🔒 Your Super Admin 2FA Security OTP Code: {otpDispatchModal.otpCode}
              </div>

              <div className="py-2 text-slate-700 dark:text-slate-200 leading-relaxed space-y-2">
                <p className="font-bold">Hello Super Admin,</p>
                <p>Your 6-digit Security Verification OTP to unlock the AUMTARA SAMAY Master SaaS Control Program is:</p>
                <div className="py-3 bg-indigo-50 dark:bg-indigo-950/80 rounded-2xl text-center font-mono font-black text-3xl text-indigo-700 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-800 tracking-widest my-2">
                  {otpDispatchModal.otpCode}
                </div>
                <p className="text-[11px] text-slate-500 italic">This verification code is active for real testing. Click below to auto-fill and unlock.</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setOtpDispatchModal({ ...otpDispatchModal, isOpen: false })}
                className="px-4 py-2 bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Message
              </button>
              <button
                type="button"
                onClick={handleAutoFillAndVerify}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-lg border border-emerald-900 cursor-pointer flex items-center space-x-1.5 transition-all hover:scale-105"
              >
                <span>⚡ Auto-Fill Code & Unlock Master Control</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Onboard New Subscribed Institution */}
      {onboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border-2 border-slate-300 dark:border-slate-700 p-6 space-y-5 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-tight flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                <span>Onboard New Subscribed School</span>
              </h3>
              <button onClick={() => setOnboardModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardSchoolSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">School Name *</label>
                  <input
                    type="text"
                    required
                    value={newSchoolForm.name}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, name: e.target.value })}
                    placeholder="e.g. Modern National Public School"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">School Code</label>
                  <input
                    type="text"
                    value={newSchoolForm.code}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, code: e.target.value })}
                    placeholder="e.g. MOD-SCH-005"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Principal / Admin Name</label>
                  <input
                    type="text"
                    value={newSchoolForm.principalName}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, principalName: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Admin Email (Login ID) *</label>
                  <input
                    type="email"
                    required
                    value={newSchoolForm.adminEmail}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, adminEmail: e.target.value })}
                    placeholder="admin@school.edu.in"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Admin Initial Password *</label>
                  <input
                    type="text"
                    required
                    value={newSchoolForm.adminPassword}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, adminPassword: e.target.value })}
                    placeholder="Set initial password"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Subscription Plan Tier</label>
                  <select
                    value={newSchoolForm.planTier}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, planTier: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="Basic Single Shift">Basic Single-Shift (₹ 35,000 / Yr)</option>
                    <option value="Standard Dual-Shift">Standard Dual-Shift (₹ 50,000 / Yr)</option>
                    <option value="Enterprise Dual-Shift">Enterprise Dual-Shift (₹ 75,000 / Yr)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setOnboardModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 text-white font-black rounded-xl shadow cursor-pointer"
                >
                  Onboard School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Reset Admin Password & Credentials */}
      {credentialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border-2 border-slate-300 dark:border-slate-700 p-6 space-y-5 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-tight flex items-center space-x-2">
                <Key className="h-5 w-5 text-amber-600" />
                <span>Reset Admin Password & Email</span>
              </h3>
              <button onClick={() => setCredentialModalOpen(false)} className="text-slate-400 font-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Admin Email / Username</label>
                <input
                  type="email"
                  required
                  value={credForm.adminEmail}
                  onChange={(e) => setCredForm({ ...credForm, adminEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={credForm.adminPassword}
                    onChange={(e) => setCredForm({ ...credForm, adminPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCredForm({
                        ...credForm,
                        adminPassword: `pass${Math.floor(100000 + Math.random() * 900000)}`
                      })
                    }
                    className="px-3 py-2 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black rounded-xl shrink-0 cursor-pointer"
                  >
                    Auto Generate
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCredentialModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-600 text-white font-black rounded-xl shadow cursor-pointer">
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Update Subscription Pricing & Renewal */}
      {subscriptionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border-2 border-slate-300 dark:border-slate-700 p-6 space-y-5 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-tight flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <span>Update Annual Subscription & Price</span>
              </h3>
              <button onClick={() => setSubscriptionModalOpen(false)} className="text-slate-400 font-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubscription} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Plan Tier</label>
                <select
                  value={subForm.planTier}
                  onChange={(e) => setSubForm({ ...subForm, planTier: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="Basic Single Shift">Basic Single Shift</option>
                  <option value="Standard Dual-Shift">Standard Dual-Shift</option>
                  <option value="Enterprise Dual-Shift">Enterprise Dual-Shift</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Annual Subscription Charge (₹ / Year)</label>
                <input
                  type="number"
                  required
                  value={subForm.annualPriceINR}
                  onChange={(e) => setSubForm({ ...subForm, annualPriceINR: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Renewal Date</label>
                <input
                  type="date"
                  required
                  value={subForm.renewalDate}
                  onChange={(e) => setSubForm({ ...subForm, renewalDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubscriptionModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-700 text-white font-black rounded-xl shadow cursor-pointer">
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Assign Custom Package to School */}
      {assignPkgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border-2 border-slate-300 dark:border-slate-700 p-6 space-y-5 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-tight flex items-center space-x-2">
                <Package className="h-5 w-5 text-purple-600" />
                <span>Assign Custom Package to School</span>
              </h3>
              <button onClick={() => setAssignPkgModalOpen(false)} className="text-slate-400 font-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignPackageSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Select Subscribed School</label>
                <select
                  required
                  value={assignForm.schoolId}
                  onChange={(e) => setAssignForm({ ...assignForm, schoolId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="">-- Choose Subscribed School --</option>
                  {subscribedSchools.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name} ({sch.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Select Custom Package</label>
                <select
                  required
                  value={assignForm.packageId}
                  onChange={(e) => setAssignForm({ ...assignForm, packageId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="">-- Choose Package --</option>
                  {customPackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — ₹ {pkg.annualPriceINR.toLocaleString('en-IN')}/Yr
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssignPkgModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-purple-700 text-white font-black rounded-xl shadow cursor-pointer">
                  Apply Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Super Admin Real Profile Configuration (Original Email & Mobile) */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border-2 border-slate-300 dark:border-slate-700 p-6 space-y-5 shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100 border-t-8 border-t-amber-500">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-tight flex items-center space-x-2">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                <span>Super Admin Real Contact Profile</span>
              </h3>
              <button onClick={() => setProfileModalOpen(false)} className="text-slate-400 font-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSuperAdminProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Super Admin Official Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="e.g. Aumtara Master Admin"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Original Email Address (For 2FA Testing) *</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="your-real-email@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-indigo-700 dark:text-indigo-400"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Original Mobile Number (For 2FA SMS Testing) *</label>
                <input
                  type="text"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+91 98123 45678"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-indigo-700 dark:text-indigo-400"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">Super Admin Login Password</label>
                <input
                  type="text"
                  required
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow cursor-pointer">
                  Save Real Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

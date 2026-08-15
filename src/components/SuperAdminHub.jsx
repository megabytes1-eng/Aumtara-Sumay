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
  BookOpen
} from 'lucide-react';

export default function SuperAdminHub() {
  const {
    subscribedSchools,
    toggleSchoolStatus,
    toggleSchoolModule,
    updateSchoolAdminCredentials,
    updateSchoolSubscription,
    addSubscribedSchool,
    deleteSubscribedSchool,
    showToast
  } = useTimetable();

  const [activeTab, setActiveTab] = useState('schools'); // 'schools' | 'modules' | 'billing' | 'security'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [credentialModalOpen, setCredentialModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState({});

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
              <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-black text-[10px] uppercase rounded-full">
                Multi-Tenant Control Hub
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>AUMTARA SAMAY — Platform Master Control</span>
            </h1>
            <p className="text-xs md:text-sm text-indigo-200/90 font-medium max-w-3xl leading-relaxed">
              Manage all subscribing school tenants, enable/disable institutional access, reset school admin passwords, configure module permissions, and manage annual subscription pricing ($ / ₹ per year).
            </p>
          </div>

          <button
            onClick={() => setOnboardModalOpen(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition-all hover:scale-105 border border-amber-300 flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Onboard New Institution</span>
          </button>
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
              Active Module Toggles
            </span>
            <div className="p-2.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-xl">
              <Sliders className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-950 dark:text-purple-200 mt-2">6 Core Modules</p>
          <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-1">
            AI Engine, Substitutes, Load, Multi-Shift
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-900/50 bg-white dark:bg-slate-900 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Security & Credential Control
            </span>
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-xl">
              <Lock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-950 dark:text-amber-200 mt-2">Instant Reset</p>
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
            Change school admin logins & passwords
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('schools')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'schools'
                ? 'bg-indigo-700 text-white shadow-lg border border-indigo-900 scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>1. Subscribed Institutions ({totalSchools})</span>
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
            <span>2. Module Feature Matrix</span>
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
            <span>3. Annual Subscription Pricing</span>
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
            <span>4. School Admin Passwords</span>
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

      {/* TAB 1: Subscribed Schools Directory */}
      {activeTab === 'schools' && (
        <div className="glass-panel rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black border-b-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-4">Institution Name & Code</th>
                  <th className="p-4">Principal & Admin Email</th>
                  <th className="p-4">Plan Tier</th>
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

      {/* TAB 3: Annual Subscriptions & Pricing Manager */}
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
            <div className="p-5 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-200 text-[10px] font-black">
                TIER 1 PLAN
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Basic Single-Shift</h4>
              <p className="text-2xl font-black text-indigo-950 dark:text-white">₹ 35,000 / Yr</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                Up to 15 Grade Classes & 40 Teachers. Basic PDF timetable exports.
              </p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-950 dark:text-purple-200 text-[10px] font-black">
                TIER 2 PLAN
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Standard Dual-Shift</h4>
              <p className="text-2xl font-black text-purple-950 dark:text-white">₹ 50,000 / Yr</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                Up to 25 Grade Classes & 75 Teachers. Dual-Shift CBSE + State Board.
              </p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200 text-[10px] font-black">
                ENTERPRISE TIER
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Enterprise Multi-Campus</h4>
              <p className="text-2xl font-black text-emerald-950 dark:text-white">₹ 75,000 / Yr</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                Unlimited Classes & Faculty. AI Generator, Substitute Finder, Full Analytics.
              </p>
            </div>
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

      {/* TAB 4: School Admin Credentials & Password Control */}
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
    </div>
  );
}

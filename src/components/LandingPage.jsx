import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import {
  Sparkles,
  School,
  Award,
  CheckCircle2,
  Sliders,
  Users,
  ShieldCheck,
  ArrowRight,
  Zap,
  Clock,
  Printer,
  ChevronRight,
  Building,
  LogIn,
  Layers,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const { setViewMode, setIsLoginModalOpen, currentUser } = useTimetable();
  const [activePlan, setActivePlan] = useState('pro');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">

      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setViewMode('landing')}>
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <School className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black tracking-tight text-white font-mono">AUMTARA SAMAY</h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase">
                  SaaS v2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold tracking-wide">Dual-Shift School Timetable Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-black text-slate-300">
            <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
            <a href="#deo" className="hover:text-amber-400 transition-colors">DEO Compliance</a>
            <a href="#dual-shift" className="hover:text-amber-400 transition-colors">Dual-Shift Engine</a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">SaaS Pricing</a>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-black rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4 text-amber-400" />
              <span>{currentUser ? `User: ${currentUser.name}` : 'Sign In / Login'}</span>
            </button>

            <button
              onClick={() => setViewMode('app')}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 border border-indigo-400/30 cursor-pointer"
            >
              <span>Launch Control Management Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-black">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>AI-POWERED DUAL-SHIFT SCHOOL TIMETABLE PLATFORM FOR INDIA</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Seamlessly Manage <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Morning CBSE</span> & <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Afternoon State Board</span> Schedules.
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Eliminate period clashes, shared lab overlaps, and teacher proxy confusion. Generate official <strong>Gujarat DEO Inspection Patrak-A, B, and K</strong> documents in 1 click.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setViewMode('app')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-105 flex items-center justify-center space-x-3 cursor-pointer"
            >
              <Zap className="h-5 w-5 text-slate-950 fill-current" />
              <span>Launch School Control Portal</span>
            </button>

            <a
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>View SaaS Pricing Plans</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </a>
          </div>

          {/* Metric Badges */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl font-black text-amber-400">100% Zero-Clash</p>
              <p className="text-xs text-slate-400 font-bold mt-1">AI Conflict Prevention</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl font-black text-emerald-400">Patrak A, B, K</p>
              <p className="text-xs text-slate-400 font-bold mt-1">Gujarat DEO Formats</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl font-black text-purple-400">3-Tier AI Cover</p>
              <p className="text-xs text-slate-400 font-bold mt-1">Substitute Duty Engine</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl font-black text-cyan-400">21 Hours</p>
              <p className="text-xs text-slate-400 font-bold mt-1">GSHSEB Regulatory Load</p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">Built For Indian School Management</h2>
            <p className="text-3xl font-black text-white">Powerful Control Systems Designed for Principals & Administrators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-slate-950 border-2 border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white">Dual-Shift Master Management</h3>
              <p className="text-xs text-slate-400 font-bold leading-relaxed">
                Manages Morning CBSE (English Medium) & Afternoon State Board shifts with shared teachers, shared science labs, and separate bell schedules.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border-2 border-slate-800 space-y-4 hover:border-amber-500/50 transition-all shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white">Gujarat DEO Compliance Registers</h3>
              <p className="text-xs text-slate-400 font-bold leading-relaxed">
                Generates official Secondary & Higher Secondary Patrak-A, Patrak-B, and Patrak-K compliance forms conforming to 21-hour regulatory provisions.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border-2 border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white">3-Tier Multi-Subject AI Substitute</h3>
              <p className="text-xs text-slate-400 font-bold leading-relaxed">
                Ranks free substitute teachers dynamically based on ⭐ Tier 1 Primary Subject, 🌿 Tier 2 Secondary Knowledge, and 🔄 Tier 3 Emergency Proxy capabilities.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">Transparent SaaS Subscriptions</h2>
            <p className="text-3xl font-black text-white">Simple Annual Pricing for Every School Size</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Starter Plan */}
            <div className="p-8 rounded-3xl bg-slate-900 border-2 border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-black">STARTER SCHOOL</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-white">₹9,999</span>
                  <span className="text-xs font-bold text-slate-400">/ year</span>
                </div>
                <p className="text-xs text-slate-400 font-bold">Ideal for single-shift standalone schools up to 15 sections.</p>
                
                <ul className="space-y-2.5 text-xs text-slate-300 font-bold pt-4 border-t border-slate-800">
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /><span>Single Shift Timetable Engine</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /><span>Up to 15 Classes & 20 Teachers</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /><span>Basic Conflict Solver</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /><span>PDF & CSV Timetable Export</span></li>
                </ul>
              </div>

              <button
                onClick={() => setViewMode('app')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
              >
                Launch Starter Demo
              </button>
            </div>

            {/* Pro Dual-Shift Plan (Popular) */}
            <div className="p-8 rounded-3xl bg-slate-900 border-2 border-amber-500 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-amber-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                MOST POPULAR FOR DUAL-SHIFT
              </div>

              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black border border-amber-500/30">PRO DUAL-SHIFT SAAS</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white">₹19,999</span>
                  <span className="text-xs font-bold text-slate-400">/ year</span>
                </div>
                <p className="text-xs text-slate-300 font-bold">Complete SaaS platform for Morning CBSE + Afternoon State Board schools.</p>

                <ul className="space-y-2.5 text-xs text-slate-200 font-bold pt-4 border-t border-slate-800">
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /><span>Dual-Shift AI Master Engine</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /><span>Unlimited Classes & Teachers</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /><span>Official DEO Gujarat Patrak-A, B, K</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /><span>3-Tier AI Proxy & Substitute Finder</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /><span>Bulk CSV / Excel Upload System</span></li>
                </ul>
              </div>

              <button
                onClick={() => setViewMode('app')}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Launch Pro School Portal
              </button>
            </div>

            {/* Enterprise Multi-School Plan */}
            <div className="p-8 rounded-3xl bg-slate-900 border-2 border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-black border border-purple-500/30">ENTERPRISE SAAS HUB</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-white">₹39,999</span>
                  <span className="text-xs font-bold text-slate-400">/ year</span>
                </div>
                <p className="text-xs text-slate-400 font-bold">Multi-school educational trusts & group institutions.</p>

                <ul className="space-y-2.5 text-xs text-slate-300 font-bold pt-4 border-t border-slate-800">
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-purple-400 shrink-0" /><span>Multi-School Trust Management</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-purple-400 shrink-0" /><span>Super Admin Master SaaS Hub</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-purple-400 shrink-0" /><span>Custom DEO State Board Templates</span></li>
                  <li className="flex items-center space-x-2"><Check className="h-4 w-4 text-purple-400 shrink-0" /><span>24/7 Dedicated Account Manager</span></li>
                </ul>
              </div>

              <button
                onClick={() => setViewMode('app')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
              >
                Launch Enterprise Hub
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 bg-slate-950 border-t border-slate-800/80 text-center text-xs text-slate-500 font-bold space-y-2">
        <p className="text-slate-300 font-black">AUMTARA SAMAY — DUAL-SHIFT SCHOOL TIMETABLE SAAS PLATFORM</p>
        <p>© 2026 Aumtara Samay. GSHSEB Gujarat & CBSE Regulatory Compliant.</p>
      </footer>

    </div>
  );
}

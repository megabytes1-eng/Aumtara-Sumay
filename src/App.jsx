import React from 'react';
import { TimetableProvider, useTimetable } from './context/TimetableContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InstitutionalSetup from './components/InstitutionalSetup';
import DataManagement from './components/DataManagement';
import ConstraintsEngine from './components/ConstraintsEngine';
import TimetableGenerator from './components/TimetableGenerator';
import SubstituteManagement from './components/SubstituteManagement';
import FreeTools from './components/FreeTools';
import ReportsExport from './components/ReportsExport';
import Settings from './components/Settings';
import VersionHistoryView from './components/VersionHistoryView';
import SuperAdminHub from './components/SuperAdminHub';

import GlobalHelpFloatingButton from './components/GlobalHelpFloatingButton';
import LoginModal from './components/LoginModal';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-2xl w-full bg-slate-800 border-2 border-amber-400/50 rounded-3xl p-8 space-y-5 text-center shadow-2xl">
            <div className="h-16 w-16 bg-amber-500/20 text-amber-400 rounded-2xl mx-auto flex items-center justify-center text-3xl font-black">
              🛡️
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              AUMTARA SAMAY — Diagnostic Intercept Mode
            </h2>
            <p className="text-xs text-slate-300 font-bold leading-relaxed">
              An unexpected render exception was caught. Below is the exact diagnostic traceback:
            </p>
            <div className="p-4 bg-slate-950 rounded-2xl border-2 border-rose-500/50 text-left text-xs font-mono text-rose-300 overflow-x-auto max-h-64 space-y-2 select-text">
              <div className="font-black text-rose-400 border-b border-rose-900/50 pb-1">
                {this.state.error ? this.state.error.toString() : 'Render Exception Intercepted'}
              </div>
              <pre className="text-[11px] text-rose-300/90 whitespace-pre-wrap font-mono leading-tight">
                {this.state.error?.stack || 'No stack trace available.'}
              </pre>
              {this.state.errorInfo && (
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  <span className="font-bold text-slate-300">Component Stack:</span>
                  <pre className="text-[10px] text-slate-400 whitespace-pre-wrap font-mono">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.reload();
                }}
                className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105"
              >
                🔄 Reload Workspace
              </button>
              <button
                onClick={() => {
                  try { localStorage.clear(); sessionStorage.clear(); } catch(e){}
                  window.location.href = '/';
                }}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-amber-300 font-black text-xs rounded-xl shadow border border-slate-600 cursor-pointer"
              >
                🧹 Reset Browser Cache & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { activeTab, themeMode, isLoginModalOpen, setIsLoginModalOpen } = useTimetable();

  return (
    <div className={`min-h-screen ${themeMode === 'dark' ? 'theme-dark bg-slate-900 text-slate-100' : 'bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/30 text-slate-800'} flex flex-col font-sans transition-colors duration-300 relative`}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'setup' && <InstitutionalSetup />}
          {activeTab === 'data' && <DataManagement />}
          {activeTab === 'constraints' && <ConstraintsEngine />}
          {activeTab === 'generator' && <TimetableGenerator />}
          {activeTab === 'substitute' && <SubstituteManagement />}
          {activeTab === 'tools' && <FreeTools />}
          {activeTab === 'reports' && <ReportsExport />}
          {activeTab === 'settings' && <Settings />}
          {activeTab === 'history' && <VersionHistoryView />}
          {activeTab === 'superadmin' && <SuperAdminHub />}
          {!['dashboard', 'setup', 'data', 'constraints', 'generator', 'substitute', 'tools', 'reports', 'settings', 'history', 'superadmin'].includes(activeTab) && <Dashboard />}
        </main>
      </div>

      {/* Global Authentication Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Global Floating Colorful Help Button present on EVERY Page */}
      <GlobalHelpFloatingButton />
    </div>
  );
}

import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <TimetableProvider>
          <AppContent />
        </TimetableProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

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
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans select-none">
          <div className="max-w-md w-full bg-slate-800 border-2 border-amber-400/50 rounded-3xl p-8 space-y-5 text-center shadow-2xl">
            <div className="h-16 w-16 bg-amber-500/20 text-amber-400 rounded-2xl mx-auto flex items-center justify-center text-3xl font-black">
              🛡️
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              AUMTARA SAMAY — Master Recovery
            </h2>
            <p className="text-xs text-slate-300 font-bold leading-relaxed">
              An unexpected render state was intercepted. Click below to refresh and load the active command workspace.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 text-left text-[11px] font-mono text-amber-300 overflow-x-auto max-h-32">
              {this.state.error ? this.state.error.toString() : 'Render Exception Intercepted'}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105"
            >
              🔄 Reload AUMTARA SAMAY Workspace
            </button>
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

export default function App() {
  return (
    <ErrorBoundary>
      <TimetableProvider>
        <AppContent />
      </TimetableProvider>
    </ErrorBoundary>
  );
}

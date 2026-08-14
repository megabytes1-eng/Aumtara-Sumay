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

import GlobalHelpFloatingButton from './components/GlobalHelpFloatingButton';

function AppContent() {
  const { activeTab, themeMode } = useTimetable();

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
          {!['dashboard', 'setup', 'data', 'constraints', 'generator', 'substitute', 'tools', 'reports', 'settings', 'history'].includes(activeTab) && <Dashboard />}
        </main>
      </div>

      {/* Global Floating Colorful Help Button present on EVERY Page */}
      <GlobalHelpFloatingButton />
    </div>
  );
}

export default function App() {
  return (
    <TimetableProvider>
      <AppContent />
    </TimetableProvider>
  );
}

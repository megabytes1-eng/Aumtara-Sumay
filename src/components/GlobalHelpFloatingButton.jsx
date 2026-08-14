import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import HelpGuideModal from './HelpGuideModal';

export default function GlobalHelpFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          title="Open Master User Guide & Field Manual (?)"
          aria-label="Help and User Guide"
          className="h-13 w-13 rounded-full bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white shadow-2xl shadow-indigo-500/50 flex items-center justify-center transition-all hover:scale-115 active:scale-95 border-2 border-white cursor-pointer group"
        >
          <HelpCircle className="h-7 w-7 text-amber-300 group-hover:rotate-12 transition-transform stroke-[2.5]" />
        </button>
      </div>

      <HelpGuideModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

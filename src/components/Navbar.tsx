import React from 'react';
import { MapPin, SlidersHorizontal, Bookmark, Scale, Info, Database } from 'lucide-react';

interface NavbarProps {
  currentView: 'search' | 'results';
  savedCount: number;
  compareCount: number;
  onNavigateSearch: () => void;
  onOpenSaved: () => void;
  onOpenCompare: () => void;
  onOpenDataSources: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  savedCount,
  compareCount,
  onNavigateSearch,
  onOpenSaved,
  onOpenCompare,
  onOpenDataSources,
  onOpenAbout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Geometric Balance */}
        <div 
          id="nav-brand-logo"
          onClick={onNavigateSearch}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center text-white font-bold text-xl italic shadow-sm group-hover:bg-indigo-700 transition-colors">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight uppercase text-slate-900">
                Where<span className="text-indigo-600">SG</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                Pulse AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest hidden sm:block">
              Singapore Housing & Relocation Intelligence
            </p>
          </div>
        </div>

        {/* Navigation items - Uppercase tracked geometric layout */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-slate-500 mr-2">
            <button
              onClick={onNavigateSearch}
              className={`py-5 transition-colors ${
                currentView === 'search'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                  : 'hover:text-indigo-600'
              }`}
            >
              Market Data
            </button>
            <button
              onClick={() => {
                if (currentView !== 'results') onNavigateSearch();
              }}
              className={`py-5 transition-colors ${
                currentView === 'results'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                  : 'hover:text-indigo-600'
              }`}
            >
              Neighbourhoods
            </button>
          </div>

          {currentView === 'results' && (
            <button
              id="nav-search-btn"
              onClick={onNavigateSearch}
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded transition-colors"
            >
              Search
            </button>
          )}

          <button
            id="nav-compare-btn"
            onClick={onOpenCompare}
            className="relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded transition-colors flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            <span>Compare</span>
            {compareCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-sm">
                {compareCount}
              </span>
            )}
          </button>

          <button
            id="nav-saved-btn"
            onClick={onOpenSaved}
            className="relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded transition-colors flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-sm">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="nav-datasources-btn"
            onClick={onOpenDataSources}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded transition-colors hidden md:flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Data</span>
          </button>

          <button
            id="nav-about-btn"
            onClick={onOpenAbout}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 rounded transition-colors hidden sm:block"
          >
            About
          </button>
        </nav>
      </div>
    </header>
  );
};

import React from 'react';
import { MapPin, SlidersHorizontal, Bookmark, Scale, Info, Database, Sparkles, Compass, Navigation } from 'lucide-react';

interface NavbarProps {
  currentView: 'search' | 'questionnaire' | 'results';
  savedCount: number;
  compareCount: number;
  onNavigateHome: () => void;
  onStartQuiz: () => void;
  onExploreAreas: () => void;
  onOpenSaved: () => void;
  onOpenCompare: () => void;
  onOpenDataSources: () => void;
  onOpenOneMap: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  savedCount,
  compareCount,
  onNavigateHome,
  onStartQuiz,
  onExploreAreas,
  onOpenSaved,
  onOpenCompare,
  onOpenDataSources,
  onOpenOneMap,
  onOpenAbout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          id="nav-brand-logo"
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-base shadow-sm group-hover:bg-indigo-700 transition-colors">
            SG
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                Where<span className="text-indigo-600">SG</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Advisor
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Singapore Neighbourhood Advisor
            </p>
          </div>
        </div>

        {/* Global Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600 mr-2">
            <button
              onClick={onNavigateHome}
              className={`transition-colors ${
                currentView === 'search'
                  ? 'text-indigo-600 font-bold'
                  : 'hover:text-indigo-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={onExploreAreas}
              className={`transition-colors ${
                currentView === 'results'
                  ? 'text-indigo-600 font-bold'
                  : 'hover:text-indigo-600'
              }`}
            >
              Explore Areas
            </button>
            <button
              onClick={onOpenOneMap}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>OneMap Routing</span>
            </button>
            <button
              onClick={onOpenDataSources}
              className="hover:text-indigo-600 transition-colors"
            >
              How it Works & Data
            </button>
            <button
              onClick={onOpenAbout}
              className="hover:text-indigo-600 transition-colors"
            >
              About
            </button>
          </div>


          {currentView !== 'questionnaire' && (
            <button
              id="nav-find-area-btn"
              onClick={onStartQuiz}
              className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Find My Area</span>
            </button>
          )}

          {/* Compare Button */}
          <button
            id="nav-compare-btn"
            onClick={onOpenCompare}
            className="relative px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Compare</span>
            {compareCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-full">
                {compareCount}
              </span>
            )}
          </button>

          {/* Saved Button */}
          <button
            id="nav-saved-btn"
            onClick={onOpenSaved}
            className="relative px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

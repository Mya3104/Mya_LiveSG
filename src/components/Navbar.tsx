import React, { useState } from 'react';
import {
  MapPin,
  SlidersHorizontal,
  Bookmark,
  Scale,
  Info,
  Database,
  Sparkles,
  Compass,
  Navigation,
  Menu,
  X,
} from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          id="nav-brand-logo"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onNavigateHome();
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
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

        {/* Global Desktop Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600 mr-2">
            <button
              onClick={onNavigateHome}
              className={`transition-colors cursor-pointer ${
                currentView === 'search'
                  ? 'text-indigo-600 font-bold'
                  : 'hover:text-indigo-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={onExploreAreas}
              className={`transition-colors cursor-pointer ${
                currentView === 'results'
                  ? 'text-indigo-600 font-bold'
                  : 'hover:text-indigo-600'
              }`}
            >
              Explore Areas
            </button>
            <button
              id="nav-onemap-routing-desktop"
              onClick={onOpenOneMap}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100/70 transition-colors cursor-pointer shadow-2xs"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>OneMap Routing</span>
            </button>
            <button
              onClick={onOpenDataSources}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              How it Works & Data
            </button>
            <button
              onClick={onOpenAbout}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              About
            </button>
          </div>

          {/* Quick Mobile Routing Button */}
          <button
            id="nav-onemap-routing-mobile-pill"
            onClick={onOpenOneMap}
            className="md:hidden flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md transition-colors"
          >
            <Navigation className="w-3 h-3 text-emerald-600" />
            <span>OneMap</span>
          </button>

          {currentView !== 'questionnaire' && (
            <button
              id="nav-find-area-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onStartQuiz();
              }}
              className="px-3 sm:px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Find My Area</span>
              <span className="xs:hidden">Find</span>
            </button>
          )}

          {/* Compare Button */}
          <button
            id="nav-compare-btn"
            onClick={onOpenCompare}
            className="relative px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
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
            className="relative px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onNavigateHome();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'search' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onExploreAreas();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'results' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Explore Areas
          </button>
          <button
            id="nav-onemap-routing-mobile"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenOneMap();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between border border-emerald-200"
          >
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>OneMap Routing</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-200/70 text-emerald-900 uppercase">
              Live
            </span>
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenDataSources();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            How it Works & Data
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenAbout();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            About WhereSG AI
          </button>
        </div>
      )}
    </header>
  );
};

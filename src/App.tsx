import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { GuidedQuestionnaire } from './components/GuidedQuestionnaire';
import { LoadingScreen } from './components/LoadingScreen';
import { TopRecommendationHero } from './components/TopRecommendationHero';
import { ResultsSidebar } from './components/ResultsSidebar';
import { NeighborhoodDetail } from './components/NeighborhoodDetail';
import { PreferencesModal } from './components/PreferencesModal';
import { ComparisonModal } from './components/ComparisonModal';
import { ExportReportModal } from './components/ExportReportModal';
import { SavedModal } from './components/SavedModal';
import { DataSourcesModal } from './components/DataSourcesModal';
import { OneMapExplorerModal } from './components/OneMapExplorerModal';
import { INITIAL_NEIGHBORHOODS, WORKPLACE_HUBS } from './data/singaporeData';

import { rankNeighborhoods, parseNaturalLanguageQuery } from './utils/recommendationEngine';
import { Neighborhood, UserPreferences } from './types';
import { Search, Sparkles, SlidersHorizontal, ArrowLeft, TrendingUp, Info, Scale, BookmarkCheck, RotateCcw } from 'lucide-react';

const DEFAULT_PREFERENCES: UserPreferences = {
  familySize: 'family_with_kids',
  adultsCount: 2,
  childrenCount: 2,
  propertyCategory: 'condo',
  transactionType: 'resale',
  budgetMax: 1800000,
  bedroomsMin: 3,
  primaryWorkplace: 'mbfc',
  secondaryWorkplace: 'changi_biz',
  maxCommuteMins: 35,
  primarySchoolDistance: 'within_1km',
  schoolTierPreference: 'top_tier',
  mrtPriority: 'high',
  quietVibePreference: 'balanced',
  lifestyleTags: ['parks', 'hawker_food', 'shopping_malls'],
  query: 'Family of four looking for a 3-bedroom condo under $1.8m. I work at MBFC, my wife works at Changi. We want to be near MRT, within 1km of a primary school and near parks.',
};

export function App() {
  const [currentView, setCurrentView] = React.useState<'search' | 'questionnaire' | 'results'>('search');
  const [preferences, setPreferences] = React.useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('wheresg_preferences');
      if (saved) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_PREFERENCES;
  });
  const [neighborhoods, setNeighborhoods] = React.useState<Neighborhood[]>(() =>
    rankNeighborhoods(
      (() => {
        try {
          const saved = localStorage.getItem('wheresg_preferences');
          if (saved) return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
        } catch {}
        return DEFAULT_PREFERENCES;
      })(),
      INITIAL_NEIGHBORHOODS
    )
  );
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState<Neighborhood>(
    () => neighborhoods[0]
  );
  const [savedIds, setSavedIds] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wheresg_saved');
      return saved ? JSON.parse(saved) : ['tampines', 'bishan'];
    } catch {
      return ['tampines', 'bishan'];
    }
  });
  const [compareIds, setCompareIds] = React.useState<string[]>(() => {
    try {
      const cmp = localStorage.getItem('wheresg_compare');
      return cmp ? JSON.parse(cmp) : ['tampines', 'pasir_ris', 'queenstown'];
    } catch {
      return ['tampines', 'pasir_ris', 'queenstown'];
    }
  });

  const [sortBy, setSortBy] = React.useState<'score' | 'price_low' | 'commute_fast' | 'schools'>('score');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [quickQueryInput, setQuickQueryInput] = React.useState<string>('');

  // Modals
  const [isPreferencesOpen, setIsPreferencesOpen] = React.useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = React.useState<boolean>(false);
  const [isSavedOpen, setIsSavedOpen] = React.useState<boolean>(false);
  const [isExportReportOpen, setIsExportReportOpen] = React.useState<boolean>(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = React.useState<boolean>(false);
  const [isOneMapOpen, setIsOneMapOpen] = React.useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = React.useState<boolean>(false);

  // Sync to local storage
  React.useEffect(() => {
    try {
      localStorage.setItem('wheresg_preferences', JSON.stringify(preferences));
    } catch (e) {
      console.warn(e);
    }
  }, [preferences]);

  React.useEffect(() => {
    try {
      localStorage.setItem('wheresg_saved', JSON.stringify(savedIds));
    } catch (e) {
      console.warn(e);
    }
  }, [savedIds]);

  React.useEffect(() => {
    try {
      localStorage.setItem('wheresg_compare', JSON.stringify(compareIds));
    } catch (e) {
      console.warn(e);
    }
  }, [compareIds]);

  // Execute Search & Ranking
  const executeSearch = async (queryText: string, customPrefs?: Partial<UserPreferences>) => {
    setIsLoading(true);
    const parsed = parseNaturalLanguageQuery(queryText);
    const updatedPreferences: UserPreferences = {
      ...preferences,
      ...parsed,
      ...(customPrefs || {}),
      query: queryText,
    };

    setPreferences(updatedPreferences);
    setQuickQueryInput(queryText);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPreferences),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setNeighborhoods(data.results);
          setSelectedNeighborhood(data.results[0]);
          setCurrentView('results');
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API fallback to client calculation:', err);
    }

    // Fallback client rank
    const clientRanked = rankNeighborhoods(updatedPreferences, INITIAL_NEIGHBORHOODS);
    setNeighborhoods(clientRanked);
    setSelectedNeighborhood(clientRanked[0]);
    setCurrentView('results');
    setIsLoading(false);
  };

  const handleApplyPreferences = (updated: UserPreferences) => {
    setPreferences(updated);
    const ranked = rankNeighborhoods(updated, INITIAL_NEIGHBORHOODS);
    setNeighborhoods(ranked);
    const stillSelected = ranked.find((n) => n.id === selectedNeighborhood.id) || ranked[0];
    setSelectedNeighborhood(stillSelected);
  };

  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 neighbourhoods at once.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // Sort neighborhoods
  const sortedNeighborhoods = React.useMemo(() => {
    const list = [...neighborhoods];
    if (sortBy === 'score') {
      return list.sort((a, b) => b.matchScore - a.matchScore);
    }
    if (sortBy === 'price_low') {
      return list.sort(
        (a, b) => a.propertySnapshot.condo.median3Bed - b.propertySnapshot.condo.median3Bed
      );
    }
    if (sortBy === 'commute_fast') {
      const hub = preferences.workplaceLocation?.hubId || preferences.primaryWorkplace || 'mbfc';
      return list.sort(
        (a, b) =>
          (a.commutes[hub]?.mrtDurationMins || 50) - (b.commutes[hub]?.mrtDurationMins || 50)
      );
    }
    if (sortBy === 'schools') {
      return list.sort((a, b) => b.scores.schools - a.scores.schools);
    }
    return list;
  }, [neighborhoods, sortBy, preferences.primaryWorkplace, preferences.workplaceLocation]);

  const savedNeighborhoods = INITIAL_NEIGHBORHOODS.filter((n) => savedIds.includes(n.id));
  const compareNeighborhoods = INITIAL_NEIGHBORHOODS.filter((n) => compareIds.includes(n.id));

  // Top overall recommendation (#1 match)
  const topMatch = sortedNeighborhoods[0] || neighborhoods[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        savedCount={savedIds.length}
        compareCount={compareIds.length}
        onNavigateHome={() => setCurrentView('search')}
        onStartQuiz={() => setCurrentView('questionnaire')}
        onExploreAreas={() => setCurrentView('results')}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenDataSources={() => setIsDataSourcesOpen(true)}
        onOpenOneMap={() => setIsOneMapOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />


      {/* Main App Content Router */}
      <main className="flex-1">
        {isLoading ? (
          <LoadingScreen querySummary={quickQueryInput} />
        ) : currentView === 'search' ? (
          <HeroSearch
            onSearch={executeSearch}
            onStartQuestionnaire={() => setCurrentView('questionnaire')}
            onExploreAll={() => setCurrentView('results')}
            onOpenPreferences={() => setIsPreferencesOpen(true)}
            isLoading={isLoading}
          />
        ) : currentView === 'questionnaire' ? (
          <GuidedQuestionnaire
            initialPreferences={preferences}
            onComplete={(updatedPrefs) => {
              const locName =
                updatedPrefs.workplaceLocation?.name ||
                WORKPLACE_HUBS.find((h) => h.id === updatedPrefs.primaryWorkplace)?.name ||
                'CBD';
              executeSearch(
                `Preferences updated: ${updatedPrefs.familySize.replace('_', ' ')} (${updatedPrefs.propertyCategory}) with workplace at ${locName}`,
                updatedPrefs
              );
            }}
            onCancel={() => setCurrentView('search')}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Top Results Control Bar */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="back-to-landing-btn"
                  onClick={() => setCurrentView('search')}
                  className="px-3 py-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>

                <div className="relative flex-1 md:w-80">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (quickQueryInput.trim()) executeSearch(quickQueryInput.trim());
                    }}
                    className="flex items-center"
                  >
                    <input
                      type="text"
                      value={quickQueryInput}
                      onChange={(e) => setQuickQueryInput(e.target.value)}
                      placeholder="Refine search criteria..."
                      className="w-full text-xs py-2 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-600 focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                  </form>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 text-xs">
                {/* Adjust Preferences Button */}
                <button
                  id="refine-criteria-btn"
                  onClick={() => setCurrentView('questionnaire')}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Adjust Preferences</span>
                </button>

                <button
                  id="open-compare-bar-btn"
                  onClick={() => setIsCompareOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-semibold flex items-center gap-1.5 hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare ({compareIds.length})</span>
                </button>
              </div>
            </div>

            {/* Top #1 Standout Hero Recommendation Card */}
            {topMatch && (
              <TopRecommendationHero
                neighborhood={topMatch}
                preferences={preferences}
                isSaved={savedIds.includes(topMatch.id)}
                isCompared={compareIds.includes(topMatch.id)}
                onToggleSave={() => handleToggleSave(topMatch.id)}
                onToggleCompare={() => handleToggleCompare(topMatch.id)}
                onViewDetails={() => setSelectedNeighborhood(topMatch)}
                onAdjustPreferences={() => setCurrentView('questionnaire')}
              />
            )}

            {/* Header for All Ranked Results */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Your Best Matches
                </h3>
                <p className="text-xs text-slate-500">
                  Ranked by multi-attribute score matching your commute, budget, schools, and lifestyle priorities.
                </p>
              </div>
            </div>

            {/* Results Grid (Sidebar List + Main Estate Detail Pane) */}
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Left Sidebar List */}
              <ResultsSidebar
                neighborhoods={sortedNeighborhoods}
                selectedId={selectedNeighborhood.id}
                onSelect={(n) => setSelectedNeighborhood(n)}
                savedIds={savedIds}
                compareIds={compareIds}
                onToggleSave={handleToggleSave}
                onToggleCompare={handleToggleCompare}
                sortBy={sortBy}
                onSortChange={(s) => setSortBy(s)}
                preferences={preferences}
              />

              {/* Right Detail Pane */}
              <div className="flex-1 min-w-0 w-full">
                <NeighborhoodDetail
                  neighborhood={selectedNeighborhood}
                  allNeighborhoods={sortedNeighborhoods}
                  onSelectNeighborhood={(n) => setSelectedNeighborhood(n)}
                  preferences={preferences}
                  isSaved={savedIds.includes(selectedNeighborhood.id)}
                  isCompared={compareIds.includes(selectedNeighborhood.id)}
                  onToggleSave={() => handleToggleSave(selectedNeighborhood.id)}
                  onToggleCompare={() => handleToggleCompare(selectedNeighborhood.id)}
                  onOpenExportReport={() => setIsExportReportOpen(true)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-2">
            <span className="font-bold text-slate-900">WhereSG AI</span>
            <span>• Singapore Housing & Relocation Intelligence System</span>
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsDataSourcesOpen(true)}
              className="hover:text-indigo-600 transition-colors font-medium"
            >
              Data Methodology & Sources
            </button>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-indigo-600 transition-colors font-medium"
            >
              About
            </button>
            <span className="text-slate-400 font-mono">MAS SORA 3.12% | NEA PSI 38</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onApply={handleApplyPreferences}
      />

      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareList={compareNeighborhoods}
        onRemoveFromCompare={(id) => setCompareIds((prev) => prev.filter((i) => i !== id))}
        preferences={preferences}
      />

      <ExportReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        neighborhood={selectedNeighborhood}
        preferences={preferences}
      />

      <SavedModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedNeighborhoods={savedNeighborhoods}
        onSelect={(n) => {
          setSelectedNeighborhood(n);
          setCurrentView('results');
        }}
        onRemove={(id) => setSavedIds((prev) => prev.filter((i) => i !== id))}
      />

      <DataSourcesModal
        isOpen={isDataSourcesOpen}
        onClose={() => setIsDataSourcesOpen(false)}
      />

      <OneMapExplorerModal
        isOpen={isOneMapOpen}
        onClose={() => setIsOneMapOpen(false)}
      />


      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">About WhereSG AI</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              WhereSG AI is a friendly, intelligent Singapore neighbourhood advisor designed to help individuals, couples, and families identify the best places for them to live in Singapore. By combining real-time transit data (LTA DataMall), MOE primary school priority zones, URA price caveats, and MAS interest benchmarks, WhereSG AI eliminates hours of stressful, fragmented research.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAboutOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

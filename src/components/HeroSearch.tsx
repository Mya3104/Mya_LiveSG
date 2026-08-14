import React from 'react';
import { Search, Sparkles, Shield, Users, Building, TreePine, HeartHandshake, Database, SlidersHorizontal, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import { SingaporeSkylineIllustration } from './SingaporeSkylineIllustration';
import { UserPreferences } from '../types';

interface HeroSearchProps {
  onSearch: (queryText: string) => void;
  onOpenPreferences: () => void;
  isLoading: boolean;
}

const EXAMPLE_PROMPTS = [
  {
    icon: Shield,
    title: 'Young couple, close to CBD, condo under $1.5m',
    query: 'Young working couple looking for a 2-bedroom condo under $1.5m close to CBD or one-north, with good cafes and gyms.',
  },
  {
    icon: Users,
    title: 'Family with kids, near good schools and MRT',
    query: 'Family of four looking for a 3-bedroom condo under $1.8m. I work at MBFC, my wife works at Changi. We want to be near MRT, within 1km of a primary school and near parks.',
  },
  {
    icon: Building,
    title: 'Budget rental under $3k, near business parks',
    query: 'Single expat professional looking for an HDB or compact condo rental under $3,200/month near Changi Business Park or Punggol Digital District.',
  },
  {
    icon: TreePine,
    title: 'Retiree, quiet area, near parks and healthcare',
    query: 'Retiree couple looking for a quiet, leafy mature estate near a polyclinic/hospital, parks, and hawker food under $700k resale.',
  },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  onOpenPreferences,
  isLoading,
}) => {
  const [inputText, setInputText] = React.useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSearch(inputText.trim());
    } else {
      // Default to example family search if empty
      onSearch('Family of four looking for a 3-bedroom condo under $1.8m. I work at MBFC, my wife works at Changi. We want to be near MRT, within 1km of a primary school and near parks.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Top Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Singapore Housing & Relocation Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 tracking-tight leading-[1.1]">
            Where should <br className="hidden sm:block" />
            you live in <span className="font-extrabold text-indigo-600">Singapore</span>?
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Data-driven relocation algorithms leveraging official government datasets (URA, LTA DataMall, MOE, SingStat, MAS) to match your household with optimal planning areas.
          </p>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md p-4 rounded border border-slate-200 bg-white shadow-sm">
            <SingaporeSkylineIllustration />
          </div>
        </div>
      </div>

      {/* Main AI Search Box */}
      <div className="bg-white rounded border border-slate-200 shadow-sm p-5 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <label htmlFor="ai-search-input" className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <span>Natural Language Search Prompt</span>
            <span className="text-[10px] font-normal text-slate-400 lowercase">(English or Singlish criteria)</span>
          </label>
          
          <button
            id="filter-criteria-trigger"
            type="button"
            onClick={onOpenPreferences}
            className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Filters</span>
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              id="ai-search-input"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Example: We are a family of four looking for a 3-bedroom condo under $1.8m. I work at MBFC and my wife works at Changi. We want to be near MRT, within 1km of a primary school and near parks."
              className="w-full px-4 py-3.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:bg-white focus:outline-none transition-all resize-none font-sans"
            />
            <div className="absolute right-3.5 bottom-3.5 text-slate-400">
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cross-referencing URA caveats, LTA transit times & MOE school zones</span>
            </p>

            <button
              id="submit-ai-search-btn"
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Execute Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Example prompts */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Example Household Profiles:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EXAMPLE_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  id={`example-prompt-${idx}`}
                  onClick={() => {
                    setInputText(item.query);
                    onSearch(item.query);
                  }}
                  className="p-3.5 rounded border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-left transition-all group flex items-start gap-2.5 bg-white"
                >
                  <div className="w-7 h-7 rounded-sm bg-slate-100 group-hover:bg-indigo-50 flex-shrink-0 flex items-center justify-center text-slate-600 group-hover:text-indigo-600 border border-slate-200">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Use WhereSG AI Section - Geometric Grid */}
      <div className="space-y-6 text-center">
        <h2 className="text-xl sm:text-2xl font-light text-slate-900 tracking-tight">
          System <span className="font-bold">Capabilities</span> & Methodology
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="p-5 rounded bg-white border border-slate-200 hover:border-indigo-600 transition-all space-y-3">
            <div className="w-8 h-8 rounded-sm bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
              01
            </div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Official Gov.sg Data</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by authoritative APIs: URA caveats, LTA DataMall transit matrices, SingStat, and MAS SORA benchmarks.
            </p>
          </div>

          <div className="p-5 rounded bg-white border border-slate-200 hover:border-indigo-600 transition-all space-y-3">
            <div className="w-8 h-8 rounded-sm bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
              02
            </div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Commute Optimization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-point commute solver balancing split workplaces between CBD, Changi, one-north, and Jurong.
            </p>
          </div>

          <div className="p-5 rounded bg-white border border-slate-200 hover:border-indigo-600 transition-all space-y-3">
            <div className="w-8 h-8 rounded-sm bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
              03
            </div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight">School Balloting Zones</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Granular &lt;1km and 1-2km MOE Primary 1 registration distance zone checks and Phase 2C risk assessments.
            </p>
          </div>

          <div className="p-5 rounded bg-white border border-slate-200 hover:border-indigo-600 transition-all space-y-3">
            <div className="w-8 h-8 rounded-sm bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
              04
            </div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Dossier & Comparison</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Side-by-side estate benchmarking across 15+ metrics with printable housing intelligence dossier exports.
            </p>
          </div>
        </div>
      </div>

      {/* Trusted Data Sources Banner */}
      <div className="pt-8 border-t border-slate-200 text-center space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Integrated Singapore Data Infrastructure
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-600 font-semibold text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-200 bg-white">
            <span className="font-mono font-bold text-slate-900">data.gov.sg</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-200 bg-white">
            <span className="font-bold text-slate-900">SingStat</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-200 bg-white">
            <span className="font-bold text-slate-900">LTA DataMall</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-200 bg-white">
            <span className="font-bold text-slate-900">OneMap SG</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-200 bg-white">
            <span className="font-bold text-slate-900">MAS (SORA)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-200 bg-white">
            <span className="font-bold text-slate-900">URA Space</span>
          </div>
        </div>
      </div>
    </div>
  );
};

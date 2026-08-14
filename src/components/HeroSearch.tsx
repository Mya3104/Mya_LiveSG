import React from 'react';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Users,
  Building,
  TreePine,
  SlidersHorizontal,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Compass,
  Train,
  Clock,
  GraduationCap,
  DollarSign,
  HeartHandshake,
} from 'lucide-react';
import { SingaporeSkylineIllustration } from './SingaporeSkylineIllustration';

interface HeroSearchProps {
  onSearch: (queryText: string) => void;
  onStartQuestionnaire: () => void;
  onExploreAll: () => void;
  onOpenPreferences: () => void;
  isLoading: boolean;
}

const EXAMPLE_PROMPTS = [
  {
    icon: Users,
    title: 'Family with kids near top schools',
    desc: '3-Bed condo under $1.8M, near MBFC & Changi, <1km to good primary school',
    query: 'Family of four looking for a 3-bedroom condo under $1.8m. I work at MBFC, my wife works at Changi. We want to be near MRT, within 1km of a primary school and near parks.',
  },
  {
    icon: Compass,
    title: 'Young couple close to CBD',
    desc: '2-Bed condo under $1.5M, short commute, lively cafes & gyms',
    query: 'Young working couple looking for a 2-bedroom condo under $1.5m close to CBD or one-north, with good cafes and gyms.',
  },
  {
    icon: Building,
    title: 'Budget rental near business hubs',
    desc: 'Rental under $3.5k/mo near Changi Business Park or Punggol',
    query: 'Single expat professional looking for an HDB or compact condo rental under $3,200/month near Changi Business Park or Punggol Digital District.',
  },
  {
    icon: TreePine,
    title: 'Quiet, leafy haven for retirees',
    desc: 'Near nature parks, hawker centres, and polyclinic',
    query: 'Retiree couple looking for a quiet, leafy mature estate near a polyclinic/hospital, parks, and hawker food under $700k resale.',
  },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  onStartQuestionnaire,
  onExploreAll,
  onOpenPreferences,
  isLoading,
}) => {
  const [inputText, setInputText] = React.useState('');
  const [showDirectSearch, setShowDirectSearch] = React.useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSearch(inputText.trim());
    } else {
      onStartQuestionnaire();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      {/* 1. Landing Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        {/* Trust/Value Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Personalised recommendations • Singapore-wide • Takes about 2 minutes</span>
        </div>

        {/* Primary Message */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Find the best place to live in Singapore for <span className="text-indigo-600">YOU</span>.
        </h1>

        {/* Supporting Message */}
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Tell us what matters most — budget, commute, lifestyle, schools, amenities, and more — and we’ll recommend the areas that fit you best.
        </p>

        {/* Primary and Secondary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="hero-start-quiz-btn"
            onClick={onStartQuestionnaire}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
          >
            <span>Find my best area</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-explore-areas-btn"
            onClick={onExploreAll}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm sm:text-base border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Explore all areas on map</span>
          </button>
        </div>
      </div>

      {/* Skyline & How it Works Illustration Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Your Personal Singapore Neighbourhood Advisor
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              WhereSG AI models every Singapore planning area with authoritative government data. Whether you need a short MRT commute to Marina Bay, access to Top-Tier MOE primary schools, or a leafy peaceful haven on a budget, we find the exact estates that match your criteria.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>URA Real Transaction Caveats</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>LTA Door-to-Door Transit Times</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>MOE &lt;1km School Balloting Zones</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>MAS SORA Mortgage Estimates</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-xs">
              <SingaporeSkylineIllustration />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search Option or Example Profiles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Select an Example Profile or Type a Custom Search
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowDirectSearch(!showDirectSearch)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{showDirectSearch ? 'Hide text search' : 'Type custom prompt'}</span>
          </button>
        </div>

        {/* Optional Custom Search Box */}
        {showDirectSearch && (
          <form onSubmit={handleFormSubmit} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="relative">
              <textarea
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Example: We are a family of four looking for a 3-bedroom condo under $1.8m near MBFC and within 1km of a good school."
                className="w-full p-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search With Prompt</span>
              </button>
            </div>
          </form>
        )}

        {/* Example Household Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXAMPLE_PROMPTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                id={`example-prompt-card-${idx}`}
                onClick={() => onSearch(item.query)}
                className="p-5 rounded-xl border border-slate-200 hover:border-indigo-600 hover:shadow-md bg-white text-left transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  <span>See matches</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Official Data Source Badges */}
      <div className="pt-6 border-t border-slate-200 text-center space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Powered by Authoritative Singapore Public Data
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-600">
          <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-xs">
            URA (Urban Redevelopment Authority)
          </span>
          <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-xs">
            LTA DataMall (Land Transport)
          </span>
          <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-xs">
            MOE (Ministry of Education P1)
          </span>
          <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-xs">
            MAS (Monetary Authority of Singapore SORA)
          </span>
          <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-xs">
            SingStat & OneMap SG
          </span>
        </div>
      </div>
    </div>
  );
};

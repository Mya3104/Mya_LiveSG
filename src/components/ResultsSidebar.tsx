import React from 'react';
import { Neighborhood, UserPreferences } from '../types';
import {
  ChevronRight,
  ArrowUpDown,
  Bookmark,
  BookmarkCheck,
  Scale,
  Train,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { WORKPLACE_HUBS } from '../data/singaporeData';

interface ResultsSidebarProps {
  neighborhoods: Neighborhood[];
  selectedId: string;
  onSelect: (n: Neighborhood) => void;
  savedIds: string[];
  compareIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onToggleCompare: (id: string, e: React.MouseEvent) => void;
  sortBy: 'score' | 'price_low' | 'commute_fast' | 'schools';
  onSortChange: (sort: 'score' | 'price_low' | 'commute_fast' | 'schools') => void;
  preferences?: UserPreferences;
}

export const ResultsSidebar: React.FC<ResultsSidebarProps> = ({
  neighborhoods,
  selectedId,
  onSelect,
  savedIds,
  compareIds,
  onToggleSave,
  onToggleCompare,
  sortBy,
  onSortChange,
  preferences,
}) => {
  const workplaceLocation = preferences?.workplaceLocation;
  const activeHubId = workplaceLocation?.hubId || preferences?.primaryWorkplace || 'mbfc';
  const primaryHub = WORKPLACE_HUBS.find((h) => h.id === activeHubId) || WORKPLACE_HUBS[0];
  const workplaceLabel = workplaceLocation?.name || primaryHub.shortName || primaryHub.name;

  return (
    <div className="w-full lg:w-[410px] flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4 max-h-[88vh] lg:sticky lg:top-20 overflow-y-auto">
      {/* Header & Sort */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            All Recommendations
          </h2>
          <p className="text-xs font-mono font-bold text-slate-900">
            {neighborhoods.length} SINGAPORE PLANNING AREAS
          </p>
        </div>

        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-600 tracking-wide"
          >
            <option value="score">Rank: Best Match</option>
            <option value="price_low">Price: Low to High</option>
            <option value="commute_fast">Commute: Fastest</option>
            <option value="schools">Schools: Top Tier</option>
          </select>
        </div>
      </div>

      {/* Estate Card List */}
      <div className="space-y-3">
        {neighborhoods.map((n, index) => {
          const isSelected = n.id === selectedId;
          const isSaved = savedIds.includes(n.id);
          const isCompared = compareIds.includes(n.id);
          const commute = n.commutes[activeHubId] || n.commutes[primaryHub.id] || n.commutes['mbfc'];

          // Top 2 highlights
          const topHighlight1 = commute ? `${commute.mrtDurationMins}m to ${workplaceLabel}` : null;
          const topHighlight2 = n.mrtStations[0] ? `${n.mrtStations[0].name} (${n.mrtStations[0].walkMins}m walk)` : null;

          return (
            <div
              key={n.id}
              id={`estate-card-${n.id}`}
              onClick={() => onSelect(n)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left relative group ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/30 shadow-md ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs bg-white'
              }`}
            >
              {/* Rank, Title & Match Badge */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                      index === 0
                        ? 'bg-indigo-600 text-white'
                        : index < 3
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {n.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {n.region} SG
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      n.matchScore >= 90
                        ? 'bg-emerald-100 text-emerald-800'
                        : n.matchScore >= 80
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {n.matchScore}%
                  </span>

                  {/* Save & Compare Buttons */}
                  <button
                    type="button"
                    onClick={(e) => onToggleSave(n.id, e)}
                    title="Save estate"
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4 text-indigo-600" /> : <Bookmark className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => onToggleCompare(n.id, e)}
                    title="Compare estate"
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <Scale className={`w-4 h-4 ${isCompared ? 'text-indigo-600 font-bold' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-xs text-slate-500 line-clamp-1 mb-2.5">
                {n.tagline}
              </p>

              {/* Key Reasons / Highlights */}
              <div className="space-y-1 py-2 border-y border-slate-100 text-xs text-slate-700">
                {topHighlight1 && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{topHighlight1}</span>
                  </div>
                )}
                {topHighlight2 && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{topHighlight2}</span>
                  </div>
                )}
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2.5 text-[10px] text-slate-600 font-mono">
                <div className="flex items-center gap-1 truncate">
                  <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="font-bold truncate">
                    {commute?.mrtDurationMins || 25}m {workplaceLocation ? workplaceLocation.name.split(' ')[0] : primaryHub.shortName || 'CBD'}
                  </span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <DollarSign className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="font-bold">
                    ${(n.propertySnapshot.condo.median3Bed / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <Train className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="font-bold">{n.mrtStations.length} MRT</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

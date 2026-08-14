import React from 'react';
import { Neighborhood } from '../types';
import { ChevronRight, ArrowUpDown, Bookmark, BookmarkCheck, Scale, Train, DollarSign, Clock, CheckCircle2 } from 'lucide-react';

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
}) => {
  return (
    <div className="w-full lg:w-96 flex-shrink-0 bg-white rounded border border-slate-200 shadow-sm p-4 space-y-4 max-h-[85vh] lg:sticky lg:top-20 overflow-y-auto">
      {/* Header & Sort */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matching Estates</h2>
          <p className="text-xs font-mono font-bold text-slate-900">{neighborhoods.length} SG DISTRICTS</p>
        </div>

        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-indigo-600 uppercase tracking-wider"
          >
            <option value="score">Rank: Best Match</option>
            <option value="price_low">Price: Low to High</option>
            <option value="commute_fast">Transit: Fastest</option>
            <option value="schools">Schools: Top Tier</option>
          </select>
        </div>
      </div>

      {/* Estate Card List */}
      <div className="space-y-2.5">
        {neighborhoods.map((n, index) => {
          const isSelected = n.id === selectedId;
          const isSaved = savedIds.includes(n.id);
          const isCompared = compareIds.includes(n.id);

          return (
            <div
              key={n.id}
              id={`estate-card-${n.id}`}
              onClick={() => onSelect(n)}
              className={`p-3.5 rounded border transition-all cursor-pointer text-left relative group ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/30 shadow-sm ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-indigo-600 bg-white'
              }`}
            >
              {/* Rank & Score Pill */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-sm bg-slate-100 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center border border-slate-200">
                    0{index + 1}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {n.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                      n.matchScore >= 90
                        ? 'bg-emerald-100 text-emerald-700'
                        : n.matchScore >= 80
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {n.matchScore}% MATCH
                  </span>

                  {/* Save & Compare quick action buttons */}
                  <button
                    type="button"
                    onClick={(e) => onToggleSave(n.id, e)}
                    title="Save estate"
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => onToggleCompare(n.id, e)}
                    title="Compare"
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <Scale className={`w-3.5 h-3.5 ${isCompared ? 'text-indigo-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                {n.tagline}
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-[10px] text-slate-600 font-mono">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="font-bold">{n.commutes['mbfc']?.mrtDurationMins || 25}m CBD</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-slate-400" />
                  <span className="font-bold">${(n.propertySnapshot.condo.median3Bed / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex items-center gap-1">
                  <Train className="w-3 h-3 text-slate-400" />
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

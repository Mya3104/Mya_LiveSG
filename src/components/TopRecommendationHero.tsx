import React from 'react';
import { Neighborhood, UserPreferences } from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Train,
  DollarSign,
  Clock,
  GraduationCap,
  Scale,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  MapPin,
  Trees,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { WORKPLACE_HUBS } from '../data/singaporeData';

interface TopRecommendationHeroProps {
  neighborhood: Neighborhood;
  preferences: UserPreferences;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: () => void;
  onToggleCompare: () => void;
  onViewDetails: () => void;
  onAdjustPreferences: () => void;
}

export const TopRecommendationHero: React.FC<TopRecommendationHeroProps> = ({
  neighborhood,
  preferences,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onViewDetails,
  onAdjustPreferences,
}) => {
  const workplaceLocation = preferences.workplaceLocation;
  const activeHubId = workplaceLocation?.hubId || preferences.primaryWorkplace || 'mbfc';
  const primaryHub = WORKPLACE_HUBS.find((h) => h.id === activeHubId) || WORKPLACE_HUBS[0];
  const commute = neighborhood.commutes[activeHubId] || neighborhood.commutes[primaryHub.id] || neighborhood.commutes['mbfc'];
  
  const workplaceLabel = workplaceLocation?.name || primaryHub.shortName || primaryHub.name;
  const isHighCommutePriority = preferences.selectedPriorities?.includes('workplace') && preferences.selectedPriorities?.includes('commute');

  // Extract 3-5 concise, highly relevant reasons based on preferences
  const reasons: string[] = [];
  if (commute) {
    reasons.push(`${commute.mrtDurationMins} min estimated commute to ${workplaceLabel}`);
  }
  if (isHighCommutePriority) {
    reasons.push(`Top-tier transit scoring (Workplace + Easy Commute priority combination)`);
  }
  if (neighborhood.mrtStations.length > 0) {
    reasons.push(`${neighborhood.mrtStations[0].name} MRT (${neighborhood.mrtStations[0].walkMins}m walk)`);
  }
  if (preferences.transactionType === 'rental') {
    reasons.push(`Median rent fits your target budget range`);
  } else {
    reasons.push(`Strong price-to-amenity value in ${neighborhood.region} Region`);
  }
  const topSchool = neighborhood.schools.find((s) => s.zone === '<1km');
  if (topSchool && preferences.familySize === 'family_with_kids') {
    reasons.push(`Within 1km of ${topSchool.name} (${topSchool.tier})`);
  }
  if (neighborhood.officialData.greeneryParkCoverage > 35) {
    reasons.push(`${neighborhood.officialData.greeneryParkCoverage}% green park coverage and nature connectors`);
  }

  // Drawbacks / considerations
  const considerations: string[] = [];
  if (neighborhood.communitySentiment?.cons && neighborhood.communitySentiment.cons.length > 0) {
    considerations.push(neighborhood.communitySentiment.cons[0]);
    if (neighborhood.communitySentiment.cons.length > 1) {
      considerations.push(neighborhood.communitySentiment.cons[1]);
    }
  } else {
    considerations.push('Higher passenger volume during peak morning MRT hours');
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-600 shadow-lg overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white text-indigo-700 font-extrabold text-xs flex items-center justify-center">
            #1
          </div>
          <span className="font-extrabold text-xs uppercase tracking-widest text-indigo-100">
            Top Overall Recommendation
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold">
            {neighborhood.matchScore}% Match Score
          </span>
          <span className="hidden sm:inline text-indigo-200">• {neighborhood.matchTier}</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Main Title & Action header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {neighborhood.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                {neighborhood.region} Region
              </span>
            </div>
            <p className="text-sm text-slate-600 font-medium">{neighborhood.tagline}</p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSave}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" /> : <Bookmark className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleCompare}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                isCompared
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            <button
              type="button"
              onClick={onViewDetails}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Explore Area</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Why it fits you & Things to consider grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
          {/* Why it fits you */}
          <div className="md:col-span-7 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Why it fits you</span>
            </h3>

            <div className="space-y-2">
              {reasons.slice(0, 4).map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                  <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            {/* Things to consider */}
            <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Things to consider</span>
              </h4>
              {considerations.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-500">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why we recommended this score breakdown */}
          <div className="md:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Score Breakdown
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">WEIGHTED MATCH</span>
            </div>

            <div className="space-y-2.5">
              {/* Commute */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Commute Efficiency</span>
                  </span>
                  <span className="font-mono">{neighborhood.scores.commute}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${neighborhood.scores.commute}%` }}
                  />
                </div>
              </div>

              {/* Budget / Affordability */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-slate-400" />
                    <span>Budget Fit</span>
                  </span>
                  <span className="font-mono">{neighborhood.scores.affordability}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${neighborhood.scores.affordability}%` }}
                  />
                </div>
              </div>

              {/* Lifestyle & Amenities */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Trees className="w-3 h-3 text-slate-400" />
                    <span>Lifestyle & Parks</span>
                  </span>
                  <span className="font-mono">{neighborhood.scores.lifestyle}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{ width: `${neighborhood.scores.lifestyle}%` }}
                  />
                </div>
              </div>

              {/* Schools */}
              {preferences.familySize === 'family_with_kids' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-slate-400" />
                      <span>Primary Schools</span>
                    </span>
                    <span className="font-mono">{neighborhood.scores.schools}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${neighborhood.scores.schools}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-bold block truncate">
              Commute to {workplaceLocation ? workplaceLocation.name : primaryHub.shortName || 'CBD'}
            </span>
            <span className="font-bold text-slate-900 font-mono text-sm">
              {commute?.mrtDurationMins || 25} mins
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {preferences.propertyCategory === 'hdb' ? '4-Room HDB Median' : 'Median 3-Bed Condo'}
              </span>
              {preferences.propertyCategory === 'hdb' && (
                <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                  data.gov.sg
                </span>
              )}
            </div>
            <span className="font-bold text-slate-900 font-mono text-sm">
              ${(preferences.propertyCategory === 'hdb'
                ? neighborhood.propertySnapshot.hdb.median4Room / 1000
                : neighborhood.propertySnapshot.condo.median3Bed / 1000
              ).toFixed(0)}k
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Nearest Train Station</span>
            <span className="font-bold text-slate-900 truncate block">
              {neighborhood.mrtStations[0]?.name || 'MRT Station'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Top Primary School</span>
            <span className="font-bold text-slate-900 truncate block">
              {neighborhood.schools[0]?.name || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

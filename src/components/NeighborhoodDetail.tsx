import React from 'react';
import { 
  Bookmark, BookmarkCheck, Scale, Share2, FileDown, Train, GraduationCap, 
  DollarSign, Clock, Trees, ShieldCheck, ShoppingBag, Utensils, Hospital, 
  Sparkles, ExternalLink, Play, ArrowRight, Building, CheckCircle2, ChevronRight,
  TrendingUp, MessageSquare, Award, ThumbsUp, AlertCircle
} from 'lucide-react';
import { Neighborhood, UserPreferences } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { WORKPLACE_HUBS } from '../data/singaporeData';
import { HDBMarketAnalytics } from './HDBMarketAnalytics';

interface NeighborhoodDetailProps {
  neighborhood: Neighborhood;
  allNeighborhoods: Neighborhood[];
  onSelectNeighborhood: (n: Neighborhood) => void;
  preferences: UserPreferences;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: () => void;
  onToggleCompare: () => void;
  onOpenExportReport: () => void;
}

export const NeighborhoodDetail: React.FC<NeighborhoodDetailProps> = ({
  neighborhood,
  allNeighborhoods,
  onSelectNeighborhood,
  preferences,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onOpenExportReport,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'transport' | 'schools' | 'amenities' | 'market' | 'reviews' | 'ai_advisor'
  >('overview');

  const [deepAnalysis, setDeepAnalysis] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState<boolean>(false);

  // Mortgage Calculator quick calculation state
  const [loanYears, setLoanYears] = React.useState<number>(25);
  const [downpaymentPct, setDownpaymentPct] = React.useState<number>(25);
  const interestRate = 3.12; // MAS SORA benchmark

  const propertyPrice =
    preferences.propertyCategory === 'hdb'
      ? neighborhood.propertySnapshot.hdb.median4Room
      : neighborhood.propertySnapshot.condo.median3Bed;

  const loanAmount = propertyPrice * (1 - downpaymentPct / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numMonths = loanYears * 12;
  const estimatedMonthlyMortgage = Math.round(
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numMonths))) /
      (Math.pow(1 + monthlyRate, numMonths) - 1)
  );

  const fetchAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          neighborhoodId: neighborhood.id,
          userPreferences: preferences,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setDeepAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500 text-emerald-800';
    if (score >= 80) return 'bg-teal-500 text-teal-800';
    if (score >= 70) return 'bg-blue-500 text-blue-800';
    return 'bg-amber-500 text-amber-800';
  };

  const getScoreWidth = (score: number) => `${Math.min(100, Math.max(10, score))}%`;

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden space-y-6">
      {/* Top Estate Header Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {neighborhood.name}
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-100 text-emerald-700 font-mono font-bold text-xs uppercase tracking-wider">
              <span>{neighborhood.matchScore}% MATCH</span>
              <span>• {neighborhood.matchTier}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">{neighborhood.tagline}</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            id="estate-save-toggle-btn"
            onClick={onToggleSave}
            className={`px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-600 hover:bg-slate-50'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" /> : <Bookmark className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            id="estate-compare-toggle-btn"
            onClick={onToggleCompare}
            className={`px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all ${
              isCompared
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-600 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          <button
            id="estate-export-report-btn"
            onClick={onOpenExportReport}
            className="px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Box */}
      <div className="px-5 sm:px-6">
        <InteractiveMap
          neighborhood={neighborhood}
          allNeighborhoods={allNeighborhoods}
          onSelectNeighborhood={onSelectNeighborhood}
          primaryWorkplaceId={preferences.primaryWorkplace}
        />
      </div>

      {/* Tab Navigation - Geometric Balance */}
      <div className="px-5 sm:px-6 border-b border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-6 min-w-max pb-0">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'transport', label: 'Transport & Commute' },
            { id: 'schools', label: 'Schools (<1km/2km)' },
            { id: 'amenities', label: 'Amenities & Food' },
            { id: 'market', label: 'Market & Price Data' },
            { id: 'reviews', label: 'Community Sentiments' },
            { id: 'ai_advisor', label: 'AI Relocation Plan' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Containers */}
      <div className="px-5 sm:px-6 pb-6">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Score Breakdown Column (Left 4 cols) */}
              <div className="lg:col-span-4 space-y-3 p-5 rounded bg-slate-50 border border-slate-200">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Performance Breakdown
                </h2>

                <div className="space-y-3 pt-1">
                  {[
                    { label: 'Affordability', score: neighborhood.scores.affordability },
                    { label: 'Public Transit', score: neighborhood.scores.transport },
                    { label: 'Work Commute', score: neighborhood.scores.commute },
                    { label: 'School Zones', score: neighborhood.scores.schools },
                    { label: 'Family Amenities', score: neighborhood.scores.familyAmenities },
                    { label: 'Lifestyle & Food', score: neighborhood.scores.lifestyle },
                    { label: 'Healthcare Access', score: neighborhood.scores.healthcare },
                    { label: 'District Fundamentals', score: neighborhood.scores.areaFundamentals },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>{item.label}</span>
                        <span className="font-mono font-bold text-slate-900">{item.score}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-sm transition-all duration-500"
                          style={{ width: getScoreWidth(item.score) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Highlights Column (Middle 4 cols) */}
              <div className="lg:col-span-4 space-y-3 p-5 rounded bg-white border border-slate-200">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Estate Highlights
                </h2>

                <ul className="space-y-3 pt-1">
                  {neighborhood.keyHighlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug">
                      <div className="w-4 h-4 rounded-sm bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                        ✓
                      </div>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Property Snapshot Card (Right 4 cols) */}
              <div className="lg:col-span-4 p-5 rounded bg-slate-50 border border-slate-200 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Property Snapshot
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">
                      {preferences.propertyCategory === 'hdb' ? 'Median (4-Room HDB)' : 'Median (3BR+ condo)'}
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ${(propertyPrice / 1000000).toFixed(2)}M
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Avg PSF (URA Caveats)</span>
                    <span className="font-mono font-bold text-slate-900">
                      ${preferences.propertyCategory === 'hdb' ? neighborhood.propertySnapshot.hdb.avgPsf : neighborhood.propertySnapshot.condo.avgPsf}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Est. Rental Rate</span>
                    <span className="font-mono font-bold text-slate-900">
                      ${neighborhood.propertySnapshot.condo.rentalRate.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-500">Supply Pipeline</span>
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800">
                      {neighborhood.propertySnapshot.supplyPipeline}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('market')}
                  className="w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 rounded transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Price & Transaction Data</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Premium Insight Banner - Geometric Balance Theme */}
            <div className="p-5 rounded bg-indigo-600 text-white space-y-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-indigo-500 text-white rounded-sm uppercase tracking-wider">
                    Relocation Rationale
                  </span>
                  <h2 className="text-base font-bold tracking-tight">Why {neighborhood.name} is a top match</h2>
                </div>
                <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-3xl">
                  {neighborhood.whyGreatMatch}
                </p>
              </div>

              <button
                onClick={onOpenExportReport}
                className="flex-shrink-0 px-4 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-sm"
              >
                Export Dossier
              </button>
            </div>
          </div>
        )}

        {/* 2. TRANSPORT & COMMUTE TAB */}
        {activeTab === 'transport' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Commute Matrix to Core Employment Hubs
              </h2>
              <p className="text-xs text-slate-500">Calculated via LTA DataMall real-world peak hour transit algorithms</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WORKPLACE_HUBS.map((hub) => {
                const c = neighborhood.commutes[hub.id] || {
                  mrtDurationMins: 35,
                  driveDurationMins: 24,
                  transfers: 1,
                  mrtLines: ['MRT'],
                  routeSummary: 'Direct or 1-transfer train route.',
                };
                const isUserWorkplace = hub.id === preferences.primaryWorkplace;
                return (
                  <div
                    key={hub.id}
                    className={`p-4 rounded border transition-all ${
                      isUserWorkplace
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-900">{hub.shortName}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-mono">{hub.region} Zone</p>
                      </div>
                      {isUserWorkplace && (
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-sm uppercase tracking-wider">
                          Workplace
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-3 p-2 bg-slate-50 rounded border border-slate-100 text-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Public MRT</p>
                        <p className="text-base font-mono font-extrabold text-slate-900">{c.mrtDurationMins} mins</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Expressway</p>
                        <p className="text-base font-mono font-extrabold text-slate-900">{c.driveDurationMins} mins</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">{c.routeSummary}</p>
                  </div>
                );
              })}
            </div>

            {/* Nearest MRT Stations */}
            <div className="p-5 rounded bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Connected Transit Stations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {neighborhood.mrtStations.map((mrt) => (
                  <div key={mrt.code} className="p-3.5 bg-white rounded border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-900">{mrt.name}</p>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-sm border border-indigo-100">
                        {mrt.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{mrt.walkMins} min walk ({mrt.distanceKm} km)</span>
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {mrt.lines.map((l) => (
                        <span key={l} className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. SCHOOLS TAB */}
        {activeTab === 'schools' && (
          <div className="space-y-6">
            <div className="p-4 rounded bg-indigo-50 border border-indigo-200 text-indigo-900 space-y-1">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-700" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  MOE Primary 1 Priority Balloting Zone Intelligence
                </h3>
              </div>
              <p className="text-xs text-indigo-800 leading-relaxed">
                Homes situated strictly within 1km receive statutory priority during Phase 2B/2C MOE admission balloting oversubscription.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Primary Schools In Catchment Area
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {neighborhood.schools.map((school) => (
                  <div key={school.name} className="p-4 rounded border border-slate-200 bg-white space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{school.name}</h4>
                        <p className="text-xs text-slate-500 font-mono">{school.type} • {school.distanceKm} km</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                            school.zone === '<1km' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Zone {school.zone}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            school.ballotingRisk === 'High' ? 'text-rose-600' : 'text-slate-500'
                          }`}
                        >
                          Risk: {school.ballotingRisk}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {school.specialties.map((spec) => (
                        <span key={spec} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm border border-slate-200">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. AMENITIES TAB */}
        {activeTab === 'amenities' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Local Amenity Clusters & Infrastructure
              </h2>
              <p className="text-xs text-slate-500">Centres, retail complexes, green belts and polyclinics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {neighborhood.amenities.map((item) => (
                <div key={item.name} className="p-4 rounded border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-sm bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200">
                        {item.type === 'hawker' ? (
                          <Utensils className="w-3.5 h-3.5 text-amber-600" />
                        ) : item.type === 'mall' ? (
                          <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
                        ) : item.type === 'park' ? (
                          <Trees className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Hospital className="w-3.5 h-3.5 text-rose-600" />
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                    </div>

                    {item.rating && (
                      <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-100">
                        ★ {item.rating}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags?.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. MARKET & PRICE DATA TAB */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            {/* Live HDB Resale Data & Transaction Explorer */}
            <HDBMarketAnalytics neighborhood={neighborhood} preferences={preferences} />

            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Private Residential & Rental Yields
              </h3>
              
              {/* Private Property & Rental Benchmarks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Private Condominium</span>
                    <span className="text-xs font-mono font-bold text-emerald-600">+{neighborhood.propertySnapshot.condo.yearlyAppreciation}% YoY</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">2-Bedroom:</span>
                      <span className="font-bold text-slate-900">${(neighborhood.propertySnapshot.condo.median2Bed / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">3-Bedroom:</span>
                      <span className="font-bold text-slate-900">${(neighborhood.propertySnapshot.condo.median3Bed / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">4-Bedroom:</span>
                      <span className="font-bold text-slate-900">${(neighborhood.propertySnapshot.condo.median4Bed / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-sans">Avg Condo PSF:</span>
                      <span className="font-bold text-slate-900">${neighborhood.propertySnapshot.condo.avgPsf} psf</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded bg-white border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Rental & Yields</span>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">HDB 4-Room Rent:</span>
                      <span className="font-bold text-slate-900">${neighborhood.propertySnapshot.hdb.rentalRate}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Condo 3BR Rent:</span>
                      <span className="font-bold text-slate-900">${neighborhood.propertySnapshot.condo.rentalRate}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Rental Yield:</span>
                      <span className="font-bold text-slate-900">~3.3% - 3.8%</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-sans">URA Caveat Volume:</span>
                      <span className="font-bold text-slate-900">{neighborhood.officialData.uraCaveats2024} txns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MAS SORA Mortgage Estimator */}
            <div className="p-5 rounded bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">MAS SORA Mortgage Installment Estimator</h3>
                  <p className="text-xs text-slate-500">Based on 3.12% benchmark SORA loan interest rate</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Est. Monthly Installment</span>
                  <p className="text-xl font-mono font-extrabold text-slate-900">${estimatedMonthlyMortgage.toLocaleString()} <span className="text-xs font-normal">/mo</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-mono">
                    <span className="font-sans">Downpayment ({downpaymentPct}%)</span>
                    <span className="font-bold text-slate-900">${((propertyPrice * downpaymentPct) / 100).toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={50}
                    step={5}
                    value={downpaymentPct}
                    onChange={(e) => setDownpaymentPct(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-mono">
                    <span className="font-sans">Loan Tenure</span>
                    <span className="font-bold text-slate-900">{loanYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={30}
                    step={5}
                    value={loanYears}
                    onChange={(e) => setLoanYears(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. COMMUNITY & VIDEO REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Forum Sentiment Summary */}
            <div className="p-5 rounded bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Community Sentiment Synthesis</h3>
                  <p className="text-xs text-slate-500">
                    Aggregated from Singapore HardwareZone EDMW, Reddit r/singapore, and PropertyGuru forums
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-sm uppercase tracking-wider">
                  {neighborhood.communitySentiment.overall} ({neighborhood.communitySentiment.score}/100)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-white rounded border border-slate-200 space-y-2">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Resident Pros</p>
                  <ul className="space-y-1.5">
                    {neighborhood.communitySentiment.pros.map((pro, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-white rounded border border-slate-200 space-y-2">
                  <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Resident Considerations / Cons</p>
                  <ul className="space-y-1.5">
                    {neighborhood.communitySentiment.cons.map((con, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Forum Quotes */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Forum Snippets</p>
                <div className="space-y-2">
                  {neighborhood.communitySentiment.forumHighlights.map((quote, idx) => (
                    <div key={idx} className="p-3 bg-white rounded border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="font-semibold text-slate-700">{quote.source}</span>
                        <span className="font-mono">{quote.author} • {quote.date}</span>
                      </div>
                      <p className="text-slate-800 italic">&ldquo;{quote.quote}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Walkthroughs */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Estate Tours & Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {neighborhood.communitySentiment.videos.map((vid, idx) => (
                  <a
                    key={idx}
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-sm transition-all group block space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-red-600 flex items-center gap-1">
                        <Play className="w-3.5 h-3.5 fill-red-600" />
                        <span>{vid.channel}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{vid.views} • {vid.duration}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{vid.summary}</p>
                    
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 pt-1 group-hover:underline">
                      <span>Watch walkthrough</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. AI ADVISOR & RELOCATION PLAN TAB */}
        {activeTab === 'ai_advisor' && (
          <div className="space-y-5 p-5 rounded bg-indigo-50/40 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Relocation & Family Transition Advisory</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Custom analysis powered by Gemini 3.7 Flash using your exact household profile
                </p>
              </div>

              {!deepAnalysis && (
                <button
                  id="generate-ai-plan-btn"
                  onClick={fetchAIAnalysis}
                  disabled={isAnalyzing}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isAnalyzing ? 'Evaluating Matrices...' : 'Generate Advisory'}
                </button>
              )}
            </div>

            {isAnalyzing && (
              <div className="py-8 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  Evaluating transit matrices, MOE balloting odds, and URA price trends...
                </p>
              </div>
            )}

            {deepAnalysis ? (
              <div className="p-4 bg-white rounded border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal space-y-3">
                {deepAnalysis}
              </div>
            ) : !isAnalyzing ? (
              <div className="p-6 bg-white rounded border border-dashed border-slate-300 text-center space-y-2">
                <p className="text-xs text-slate-600">
                  Click the button above to generate a bespoke relocation roadmap for living in {neighborhood.name}, tailored to your workplace commute and budget.
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

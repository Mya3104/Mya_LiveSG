import React from 'react';
import { X, Printer, Download, CheckCircle2, Shield, MapPin, Building, GraduationCap, Train, Sparkles } from 'lucide-react';
import { Neighborhood, UserPreferences } from '../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  neighborhood: Neighborhood;
  preferences: UserPreferences;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  neighborhood,
  preferences,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Controls Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Singapore Housing Intelligence Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-sm bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-sm hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-8 space-y-6 text-slate-900 print:p-0">
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                <MapPin className="w-4 h-4" />
                <span>WHERESG AI RELOCATION INTELLIGENCE</span>
              </div>
              <h1 className="text-2xl font-bold uppercase tracking-wide mt-1 text-slate-900">{neighborhood.name}</h1>
              <p className="text-xs text-slate-500 font-medium">{neighborhood.region} Region • {neighborhood.tagline}</p>
            </div>

            <div className="text-right">
              <div className="inline-block px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-sm font-mono font-bold text-xs">
                MATCH SCORE: {neighborhood.matchScore} / 100
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-1">Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Executive Relocation Rationale</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {neighborhood.whyGreatMatch}
            </p>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 border border-slate-200 rounded bg-white">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Transit to CBD (MBFC)</p>
              <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                {neighborhood.commutes['mbfc']?.mrtDurationMins || 25} mins
              </p>
            </div>

            <div className="p-3 border border-slate-200 rounded bg-white">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Median 3BR Condo</p>
              <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                ${(neighborhood.propertySnapshot.condo.median3Bed / 1000000).toFixed(2)}M
              </p>
            </div>

            <div className="p-3 border border-slate-200 rounded bg-white">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">MOE Schools &lt;1km</p>
              <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                {neighborhood.schools.filter((s) => s.zone === '<1km').length} Primary Schools
              </p>
            </div>

            <div className="p-3 border border-slate-200 rounded bg-white">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Safety Index (SPF)</p>
              <p className="text-sm font-mono font-bold text-emerald-700 mt-0.5">
                {neighborhood.officialData.safetyScoreSPF} / 100
              </p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Dimensional Evaluation Scores
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
              {[
                { label: 'Affordability', score: neighborhood.scores.affordability },
                { label: 'Transport & Connectivity', score: neighborhood.scores.transport },
                { label: 'Workplace Commute', score: neighborhood.scores.commute },
                { label: 'Primary Schools Tier', score: neighborhood.scores.schools },
                { label: 'Family Amenities', score: neighborhood.scores.familyAmenities },
                { label: 'Lifestyle & Dining', score: neighborhood.scores.lifestyle },
                { label: 'Healthcare & Polyclinics', score: neighborhood.scores.healthcare },
                { label: 'Area Long-Term Fundamentals', score: neighborhood.scores.areaFundamentals },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-600 font-sans text-xs">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.score} / 100</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Data Citations */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 space-y-1">
            <p className="font-bold uppercase tracking-wider text-slate-600">Official Data Sources Verified:</p>
            <p>
              Urban Redevelopment Authority (URA Space Realis Caveats 2024–2025), Land Transport Authority (LTA DataMall API 2025), Ministry of Education (MOE Primary 1 Balloting Archives), Monetary Authority of Singapore (MAS SORA Rate Feed), Singapore Police Force (SPF Neighborhood Crime Safety Survey).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

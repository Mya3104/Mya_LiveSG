import React from 'react';
import { X, Database, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';

interface DataSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourcesModal: React.FC<DataSourcesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">Official Data Sources & Methodology</h2>
              <p className="text-xs text-slate-500">How WhereSG AI calculates ratings and recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-sm hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct Government & Statutory Board Integrations</span>
            </h3>
            <p className="text-xs text-slate-600">
              WhereSG AI models every Singapore planning area and subzone using authoritative datasets published by Singapore government agencies:
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-bold text-xs uppercase tracking-wider text-slate-900">1. URA (Urban Redevelopment Authority)</p>
                <p className="text-slate-600 text-xs mt-0.5">
                  Private non-landed and landed residential transaction caveats, master plan zoning, density guidelines, and uncompleted pipeline supply.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-bold text-xs uppercase tracking-wider text-slate-900">2. LTA DataMall (Land Transport Authority)</p>
                <p className="text-slate-600 text-xs mt-0.5">
                  Real-time transit network coordinates, train frequency matrices, peak-hour commute models, and Thomson-East Coast / Cross Island Line rollout schedules.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-bold text-xs uppercase tracking-wider text-slate-900">3. MOE (Ministry of Education) & OneMap</p>
                <p className="text-slate-600 text-xs mt-0.5">
                  Official Primary 1 registration home-school distance calculations (&lt;1km and 1-2km buffer zones) and historical Phase 2C balloting competition ratios.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-bold text-xs uppercase tracking-wider text-slate-900">4. MAS (Monetary Authority of Singapore)</p>
                <p className="text-slate-600 text-xs mt-0.5">
                  Daily benchmark compounded Singapore Overnight Rate Average (SORA) for accurate mortgage affordability simulations.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-bold text-xs uppercase tracking-wider text-slate-900">5. SingStat & SPF (Singapore Police Force)</p>
                <p className="text-slate-600 text-xs mt-0.5">
                  Subzone demographic breakdown, median household income distribution, and neighbourhood safety ratings.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900">AI Synthesis & Scoring Engine</h3>
            <p className="text-xs text-slate-600">
              The matching algorithm evaluates multi-objective constraints (workplace commute tolerance, budget boundaries, primary school tier preferences, and noise profile) to compute a 0–100 percentile match index for every Singapore planning district.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

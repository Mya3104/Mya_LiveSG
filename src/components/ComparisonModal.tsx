import React from 'react';
import { X, Scale, Check, Trash2, ArrowRight } from 'lucide-react';
import { Neighborhood, UserPreferences } from '../types';
import { WORKPLACE_HUBS } from '../data/singaporeData';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: Neighborhood[];
  onRemoveFromCompare: (id: string) => void;
  preferences: UserPreferences;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  compareList,
  onRemoveFromCompare,
  preferences,
}) => {
  if (!isOpen) return null;

  const workplaceName =
    WORKPLACE_HUBS.find((h) => h.id === preferences.primaryWorkplace)?.shortName || 'MBFC / CBD';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">Neighbourhood Comparison Matrix</h2>
              <p className="text-xs text-slate-500">
                Evaluating {compareList.length} shortlisted Singapore estates
              </p>
            </div>
          </div>
          <button
            id="close-compare-modal"
            onClick={onClose}
            className="w-7 h-7 rounded-sm hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {compareList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">No neighbourhoods added for comparison yet.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the &quot;Compare&quot; button on any estate card to add up to 4 estates side-by-side.
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-bold text-slate-400 uppercase tracking-widest w-1/4">Metric</th>
                  {compareList.map((n) => (
                    <th key={n.id} className="py-3 px-4 text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <p className="font-extrabold text-sm text-slate-900">{n.name}</p>
                          <button
                            onClick={() => onRemoveFromCompare(n.id)}
                            className="text-slate-400 hover:text-rose-600 p-0.5"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {n.matchScore}/100 Match
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {/* Region */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 font-sans uppercase tracking-wider text-[11px]">Region</td>
                  {compareList.map((n) => (
                    <td key={n.id} className="py-3 px-4 text-center font-medium font-sans">
                      {n.region}
                    </td>
                  ))}
                </tr>

                {/* Commute to primary workplace */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 font-sans uppercase tracking-wider text-[11px]">
                    Commute to {workplaceName}
                  </td>
                  {compareList.map((n) => {
                    const c = n.commutes[preferences.primaryWorkplace] || n.commutes['mbfc'];
                    return (
                      <td key={n.id} className="py-3 px-4 text-center">
                        <p className="font-bold text-slate-900">{c.mrtDurationMins} mins (MRT)</p>
                        <p className="text-[10px] text-slate-400">{c.driveDurationMins} mins (Drive)</p>
                      </td>
                    );
                  })}
                </tr>

                {/* Median 3BR Condo */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 font-sans uppercase tracking-wider text-[11px]">Median 3BR Condo</td>
                  {compareList.map((n) => (
                    <td key={n.id} className="py-3 px-4 text-center font-bold text-slate-900">
                      ${(n.propertySnapshot.condo.median3Bed / 1000000).toFixed(2)}M
                    </td>
                  ))}
                </tr>

                {/* Median 4-Room HDB */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 font-sans uppercase tracking-wider text-[11px]">Median 4-Room HDB</td>
                  {compareList.map((n) => (
                    <td key={n.id} className="py-3 px-4 text-center font-bold text-slate-900">
                      ${(n.propertySnapshot.hdb.median4Room / 1000).toFixed(0)}k
                    </td>
                  ))}
                </tr>

                {/* Condo Avg PSF */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 font-sans uppercase tracking-wider text-[11px]">Condo Avg PSF</td>
                  {compareList.map((n) => (
                    <td key={n.id} className="py-3 px-4 text-center font-medium">
                      ${n.propertySnapshot.condo.avgPsf} psf
                    </td>
                  ))}
                </tr>

                {/* Rental Rate */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 font-sans uppercase tracking-wider text-[11px]">Est. Rental Rate</td>
                  {compareList.map((n) => (
                    <td key={n.id} className="py-3 px-4 text-center font-medium">
                      ${n.propertySnapshot.condo.rentalRate.toLocaleString()}/mo
                    </td>
                  ))}
                </tr>

                {/* MOE Primary Schools <1km */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 font-sans uppercase tracking-wider text-[11px]">Primary Schools &lt;1km</td>
                  {compareList.map((n) => {
                    const count = n.schools.filter((s) => s.zone === '<1km').length;
                    return (
                      <td key={n.id} className="py-3 px-4 text-center font-bold">
                        {count} schools within 1km
                      </td>
                    );
                  })}
                </tr>

                {/* MRT Stations */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 font-sans uppercase tracking-wider text-[11px]">MRT Network</td>
                  {compareList.map((n) => (
                    <td key={n.id} className="py-3 px-4 text-center">
                      <p className="font-semibold text-slate-900">{n.mrtStations.length} MRT Stations</p>
                      <p className="text-[10px] text-slate-500">Walk: {n.mrtStations[0]?.walkMins}m</p>
                    </td>
                  ))}
                </tr>

                {/* Safety Index */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 font-sans uppercase tracking-wider text-[11px]">SPF Safety Index</td>
                  {compareList.map((n) => (
                    <td key={n.id} className="py-3 px-4 text-center font-bold text-emerald-700">
                      {n.officialData.safetyScoreSPF} / 100
                    </td>
                  ))}
                </tr>

                {/* Greenery / Parks */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 font-sans uppercase tracking-wider text-[11px]">Greenery & Park Coverage</td>
                  {compareList.map((n) => (
                    <td key={n.id} className="py-3 px-4 text-center font-medium">
                      {n.officialData.greeneryParkCoverage}%
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

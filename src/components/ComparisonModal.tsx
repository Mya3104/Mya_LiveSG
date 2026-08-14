import React from 'react';
import { X, Scale, Trash2, ChevronLeft, ChevronRight, Clock, DollarSign, Train, Trees, ShieldCheck, GraduationCap } from 'lucide-react';
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
  const [mobileActiveIndex, setMobileActiveIndex] = React.useState(0);

  if (!isOpen) return null;

  const workplaceName =
    WORKPLACE_HUBS.find((h) => h.id === preferences.primaryWorkplace)?.shortName || 'MBFC / CBD';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Compare Areas</h2>
              <p className="text-xs text-slate-500">
                Evaluating {compareList.length} shortlisted Singapore neighbourhoods
              </p>
            </div>
          </div>
          <button
            id="close-compare-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {compareList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-bold text-slate-700">No areas added for comparison yet.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the &quot;Compare&quot; button on any neighbourhood card to compare up to 4 areas side-by-side.
            </p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block p-6 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 font-bold text-slate-400 uppercase tracking-wider w-1/4">Feature</th>
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
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {n.matchScore}% Match
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                  {/* Region */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 text-xs">Region</td>
                    {compareList.map((n) => (
                      <td key={n.id} className="py-3 px-4 text-center font-medium">
                        {n.region} SG
                      </td>
                    ))}
                  </tr>

                  {/* Commute to workplace */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 text-xs">
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

                  {/* Rent / Buy median */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 text-xs">
                      {preferences.transactionType === 'rental' ? 'Est. Rental Rate' : 'Median 3BR Condo'}
                    </td>
                    {compareList.map((n) => (
                      <td key={n.id} className="py-3 px-4 text-center font-bold text-slate-900 font-mono">
                        {preferences.transactionType === 'rental'
                          ? `$${n.propertySnapshot.condo.rentalRate.toLocaleString()}/mo`
                          : `$${(n.propertySnapshot.condo.median3Bed / 1000000).toFixed(2)}M`}
                      </td>
                    ))}
                  </tr>

                  {/* Median 4-Room HDB */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 text-xs">
                      <div>Median 4-Room HDB</div>
                      <div className="text-[10px] text-emerald-600 font-mono font-normal">data.gov.sg</div>
                    </td>
                    {compareList.map((n) => (
                      <td key={n.id} className="py-3 px-4 text-center font-bold text-slate-900 font-mono">
                        <div>${(n.propertySnapshot.hdb.median4Room / 1000).toFixed(0)}k</div>
                        <div className="text-[10px] text-slate-400 font-normal">${n.propertySnapshot.hdb.avgPsf} psf</div>
                      </td>
                    ))}
                  </tr>

                  {/* MOE Primary Schools <1km */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 text-xs">Primary Schools &lt;1km</td>
                    {compareList.map((n) => {
                      const count = n.schools.filter((s) => s.zone === '<1km').length;
                      return (
                        <td key={n.id} className="py-3 px-4 text-center font-semibold">
                          {count} school{count !== 1 ? 's' : ''} in 1km
                        </td>
                      );
                    })}
                  </tr>

                  {/* MRT Stations */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 text-xs">MRT Connectivity</td>
                    {compareList.map((n) => (
                      <td key={n.id} className="py-3 px-4 text-center">
                        <p className="font-semibold text-slate-900">{n.mrtStations.length} MRT Stations</p>
                        <p className="text-[10px] text-slate-500">Walk: {n.mrtStations[0]?.walkMins}m</p>
                      </td>
                    ))}
                  </tr>

                  {/* Safety Index */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 text-xs">SPF Safety Index</td>
                    {compareList.map((n) => (
                      <td key={n.id} className="py-3 px-4 text-center font-bold text-emerald-700 font-mono">
                        {n.officialData.safetyCrimeIndex || 95}/100
                      </td>
                    ))}
                  </tr>

                  {/* Greenery / Parks */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50 text-xs">Greenery Coverage</td>
                    {compareList.map((n) => (
                      <td key={n.id} className="py-3 px-4 text-center font-medium font-mono">
                        {n.officialData.greeneryParkCoverage}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Swipeable Card View (Visible on mobile screens) */}
            <div className="md:hidden p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Area {mobileActiveIndex + 1} of {compareList.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={mobileActiveIndex === 0}
                    onClick={() => setMobileActiveIndex((prev) => Math.max(0, prev - 1))}
                    className="p-1 rounded bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={mobileActiveIndex === compareList.length - 1}
                    onClick={() => setMobileActiveIndex((prev) => Math.min(compareList.length - 1, prev + 1))}
                    className="p-1 rounded bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {(() => {
                const current = compareList[mobileActiveIndex] || compareList[0];
                const commute = current.commutes[preferences.primaryWorkplace] || current.commutes['mbfc'];
                return (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900">{current.name}</h3>
                        <p className="text-xs text-slate-500">{current.region} Region</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-600 text-white rounded-full">
                          {current.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Commute</span>
                        <span className="font-bold text-slate-900">{commute.mrtDurationMins}m MRT</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Median Condo</span>
                        <span className="font-bold text-slate-900">
                          ${(current.propertySnapshot.condo.median3Bed / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Median HDB</span>
                        <span className="font-bold text-slate-900">
                          ${(current.propertySnapshot.hdb.median4Room / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Schools &lt;1km</span>
                        <span className="font-bold text-slate-900">
                          {current.schools.filter((s) => s.zone === '<1km').length} Schools
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFromCompare(current.id)}
                      className="w-full py-2 text-xs font-bold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50"
                    >
                      Remove From Comparison
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

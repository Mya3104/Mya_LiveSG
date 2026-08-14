import React from 'react';
import { X, SlidersHorizontal, Check, Briefcase, GraduationCap, Train, DollarSign, Home, Users } from 'lucide-react';
import { UserPreferences, WorkplaceLocation } from '../types';
import { WORKPLACE_HUBS } from '../data/singaporeData';
import { WorkplaceInput } from './WorkplaceInput';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onApply: (updated: UserPreferences) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onApply,
}) => {
  const [form, setForm] = React.useState<UserPreferences>(preferences);

  React.useEffect(() => {
    setForm(preferences);
  }, [preferences, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">Customise Search Criteria</h2>
              <p className="text-xs text-slate-500">Fine-tune weights and constraints for Singapore estates</p>
            </div>
          </div>
          <button
            id="close-preferences-modal"
            onClick={onClose}
            className="w-7 h-7 rounded-sm hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Family Structure */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">
              Family & Household
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'single', label: 'Single', desc: '1 Adult' },
                { id: 'couple', label: 'Couple', desc: '2 Adults' },
                { id: 'family_with_kids', label: 'Family w/ Kids', desc: 'School priority' },
                { id: 'multi_gen', label: 'Multi-Gen', desc: 'Parents + Kids' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setForm({ ...form, familySize: item.id as any })}
                  className={`p-3 rounded border text-left transition-all ${
                    form.familySize === item.id
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="font-bold text-xs uppercase tracking-wider text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Property Category & Transaction Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Property Type
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded border border-slate-200">
                {[
                  { id: 'condo', label: 'Condo' },
                  { id: 'hdb', label: 'HDB' },
                  { id: 'landed', label: 'Landed' },
                ].map((type) => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setForm({ ...form, propertyCategory: type.id as any })}
                    className={`py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                      form.propertyCategory === type.id
                        ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Transaction Mode
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded border border-slate-200">
                {[
                  { id: 'resale', label: 'Resale Buy' },
                  { id: 'rental', label: 'Rent' },
                  { id: 'new_launch', label: 'New Launch' },
                ].map((mode) => (
                  <button
                    type="button"
                    key={mode.id}
                    onClick={() => setForm({ ...form, transactionType: mode.id as any })}
                    className={`py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                      form.transactionType === mode.id
                        ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget & Minimum Bedrooms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Maximum Budget (SGD)
                </label>
                <span className="text-sm font-mono font-bold text-slate-900">
                  {form.transactionType === 'rental'
                    ? `$${(form.budgetMax > 20000 ? 4500 : form.budgetMax).toLocaleString()} /mo`
                    : `$${(form.budgetMax / 1000000).toFixed(2)}M`}
                </span>
              </div>
              <input
                type="range"
                min={form.transactionType === 'rental' ? 2000 : 500000}
                max={form.transactionType === 'rental' ? 12000 : 4000000}
                step={form.transactionType === 'rental' ? 200 : 50000}
                value={form.budgetMax}
                onChange={(e) => setForm({ ...form, budgetMax: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                <span>{form.transactionType === 'rental' ? '$2k/mo' : '$500k'}</span>
                <span>{form.transactionType === 'rental' ? '$6k/mo' : '$2.0M'}</span>
                <span>{form.transactionType === 'rental' ? '$12k+/mo' : '$4.0M+'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Minimum Bedrooms / Size
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((bed) => (
                  <button
                    type="button"
                    key={bed}
                    onClick={() => setForm({ ...form, bedroomsMin: bed })}
                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded border transition-all ${
                      form.bedroomsMin === bed
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {bed === 4 ? '4+ Beds' : `${bed} Bed${bed > 1 ? 's' : ''}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Workplaces / Commute Routing */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
              Primary Workplace / Commute Destination
            </label>
            <WorkplaceInput
              value={form.workplaceLocation}
              onChange={(loc) => {
                setForm({
                  ...form,
                  workplaceLocation: loc,
                  primaryWorkplace: loc?.hubId || form.primaryWorkplace,
                });
              }}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Max Commute Tolerance
              </label>
              <span className="text-sm font-mono font-bold text-slate-900">≤ {form.maxCommuteMins} mins</span>
            </div>
            <input
              type="range"
              min={20}
              max={60}
              step={5}
              value={form.maxCommuteMins}
              onChange={(e) => setForm({ ...form, maxCommuteMins: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Primary School & Transit Priorities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Primary School Proximity
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'within_1km', label: 'Within 1km (<1km balloting priority)' },
                  { id: 'within_2km', label: 'Within 2km' },
                  { id: 'any', label: 'Not a critical factor' },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setForm({ ...form, primarySchoolDistance: opt.id as any })}
                    className={`w-full px-3 py-2 text-left text-xs font-medium rounded border transition-all flex items-center justify-between ${
                      form.primarySchoolDistance === opt.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-slate-900'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {form.primarySchoolDistance === opt.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                MRT Walkability Priority
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'critical', label: 'Critical (<5 min walk)' },
                  { id: 'high', label: 'High (<8 min walk)' },
                  { id: 'moderate', label: 'Moderate (<12 min walk / feeder bus)' },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setForm({ ...form, mrtPriority: opt.id as any })}
                    className={`w-full px-3 py-2 text-left text-xs font-medium rounded border transition-all flex items-center justify-between ${
                      form.mrtPriority === opt.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-slate-900'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {form.mrtPriority === opt.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              id="apply-preferences-btn"
              type="submit"
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 rounded transition-all shadow-sm"
            >
              Apply Criteria & Re-Rank
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

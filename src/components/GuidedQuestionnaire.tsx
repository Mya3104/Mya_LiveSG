import React from 'react';
import {
  UserPreferences,
  WorkplaceHub,
} from '../types';
import { WORKPLACE_HUBS } from '../data/singaporeData';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Train,
  DollarSign,
  TreePine,
  Utensils,
  Users,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  Briefcase,
  Home,
  Shield,
  Coffee,
  Moon,
  Building,
  Heart,
  SlidersHorizontal,
  ChevronRight,
  Info,
} from 'lucide-react';

interface GuidedQuestionnaireProps {
  initialPreferences: UserPreferences;
  onComplete: (preferences: UserPreferences) => void;
  onCancel: () => void;
}

const PRIORITY_OPTIONS = [
  {
    id: 'commute',
    label: 'Easy Commute',
    desc: 'Fast transit to workplace',
    icon: Train,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    id: 'affordability',
    label: 'Lower Cost / Value',
    desc: 'Maximum home for your budget',
    icon: DollarSign,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'quiet',
    label: 'Green & Quiet',
    desc: 'Parks, nature & peaceful living',
    icon: TreePine,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'food',
    label: 'Great Food & Hawkers',
    desc: 'Famous food centres & eateries',
    icon: Utensils,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    id: 'family',
    label: 'Family-Friendly',
    desc: 'Playgrounds, clinics & community',
    icon: Users,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  {
    id: 'schools',
    label: 'Top Primary Schools',
    desc: '<1km MOE P1 balloting advantage',
    icon: GraduationCap,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    id: 'shopping',
    label: 'Shopping & Malls',
    desc: 'Retail, groceries & conveniences',
    icon: ShoppingBag,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  {
    id: 'transport',
    label: 'Public Transport & MRT',
    desc: 'Walk to train station within minutes',
    icon: Compass,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  },
  {
    id: 'nightlife',
    label: 'Cafes & Nightlife',
    desc: 'Vibrant dining, bars & weekend spots',
    icon: Coffee,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
  },
  {
    id: 'central',
    label: 'Central Location',
    desc: 'Close to Singapore city centre',
    icon: MapPin,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  {
    id: 'healthcare',
    label: 'Healthcare & Polyclinic',
    desc: 'Close to hospitals & eldercare',
    icon: Heart,
    color: 'text-pink-600 bg-pink-50 border-pink-200',
  },
];

const RENTAL_BUDGET_PRESETS = [
  { label: 'Under $3,000', value: 2800 },
  { label: '$3,000 – $4,500', value: 4000 },
  { label: '$4,500 – $6,500', value: 5500 },
  { label: '$6,500 – $9,000', value: 7500 },
  { label: '$9,000+', value: 12000 },
];

const PURCHASE_BUDGET_PRESETS = [
  { label: 'Under $800k', value: 750000, desc: 'Entry HDB' },
  { label: '$800k – $1.3M', value: 1200000, desc: 'Prime HDB / Compact Condo' },
  { label: '$1.3M – $1.8M', value: 1600000, desc: '2–3 Bed Condo' },
  { label: '$1.8M – $2.5M', value: 2200000, desc: '3–4 Bed Condo' },
  { label: '$2.5M+', value: 3200000, desc: 'Luxury / Landed' },
];

export const GuidedQuestionnaire: React.FC<GuidedQuestionnaireProps> = ({
  initialPreferences,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = React.useState<number>(1);
  const totalSteps = 5;

  const [form, setForm] = React.useState<UserPreferences>(() => ({
    ...initialPreferences,
  }));

  // Track active priorities selected
  const [selectedPriorities, setSelectedPriorities] = React.useState<string[]>(() => {
    const p: string[] = ['commute', 'affordability'];
    if (form.familySize === 'family_with_kids') p.push('family', 'schools');
    if (form.mrtPriority === 'high' || form.mrtPriority === 'critical') p.push('transport');
    if (form.quietVibePreference === 'very_quiet') p.push('quiet');
    if (form.lifestyleTags?.includes('hawker_food')) p.push('food');
    if (form.lifestyleTags?.includes('shopping_malls')) p.push('shopping');
    return Array.from(new Set(p));
  });

  const togglePriority = (id: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Build updated preferences
      const updated: UserPreferences = {
        ...form,
        mrtPriority: selectedPriorities.includes('transport') ? 'high' : form.mrtPriority,
        primarySchoolDistance: selectedPriorities.includes('schools') ? 'within_1km' : form.primarySchoolDistance,
        quietVibePreference: selectedPriorities.includes('quiet') ? 'very_quiet' : form.quietVibePreference,
        lifestyleTags: selectedPriorities,
      };
      onComplete(updated);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const stepTitles = [
    { num: 1, name: 'Situation', short: 'Your Situation' },
    { num: 2, name: 'Budget', short: 'Your Budget' },
    { num: 3, name: 'Priorities', short: 'What Matters Most' },
    { num: 4, name: 'Commute', short: 'Transport & Commute' },
    { num: 5, name: 'Lifestyle', short: 'Lifestyle & Atmosphere' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header & Progress */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Step {step} of {totalSteps}
                </span>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {stepTitles[step - 1].short}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-2.5 py-1 rounded hover:bg-slate-50 transition-colors"
            >
              Exit to overview
            </button>
          </div>

          {/* Step Progress Bar (Desktop & Tablet) */}
          <div className="hidden sm:grid grid-cols-5 gap-2 pt-2 border-t border-slate-100">
            {stepTitles.map((s) => {
              const isCompleted = s.num < step;
              const isCurrent = s.num === step;
              return (
                <button
                  type="button"
                  key={s.num}
                  onClick={() => s.num < step && setStep(s.num)}
                  disabled={s.num > step}
                  className={`text-left group transition-all ${
                    s.num <= step ? 'cursor-pointer' : 'cursor-default opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3" /> : s.num}
                    </div>
                    <span
                      className={`text-xs font-semibold truncate ${
                        isCurrent
                          ? 'text-indigo-600 font-bold'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {s.name}
                    </span>
                  </div>
                  <div
                    className={`h-1 rounded-full transition-all ${
                      isCompleted
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-indigo-600'
                        : 'bg-slate-200'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Mobile Progress Bar */}
          <div className="sm:hidden w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Step Card Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* STEP 1: SITUATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">What is your housing situation?</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  We use this to tailor property categories, bedroom requirements, and community amenities.
                </p>
              </div>

              {/* Renting vs Buying */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  1. Are you planning to rent or buy?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'resale',
                      title: 'Buy Resale',
                      desc: 'Ready-to-move existing home',
                      icon: Home,
                    },
                    {
                      id: 'rental',
                      title: 'Rent',
                      desc: 'Monthly lease (1–2+ years)',
                      icon: Clock,
                    },
                    {
                      id: 'new_launch',
                      title: 'New Launch / BTO',
                      desc: 'Under construction / future key collection',
                      icon: Building,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = form.transactionType === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => {
                          const newType = item.id as any;
                          // Adjust default budget if switching from buy to rent
                          let newBudget = form.budgetMax;
                          if (newType === 'rental' && form.budgetMax > 20000) {
                            newBudget = 4500;
                          } else if (newType !== 'rental' && form.budgetMax < 50000) {
                            newBudget = 1800000;
                          }
                          setForm({ ...form, transactionType: newType, budgetMax: newBudget });
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Household structure */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  2. Who will be living here?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'single', title: 'Solo Living', desc: 'Single professional' },
                    { id: 'couple', title: 'Couple', desc: 'Two working adults' },
                    { id: 'family_with_kids', title: 'Family with Kids', desc: 'Parents + children' },
                    { id: 'multi_gen', title: 'Multi-Gen', desc: 'Extended family / seniors' },
                  ].map((item) => {
                    const isSelected = form.familySize === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => {
                          const fam = item.id as any;
                          const kids = fam === 'family_with_kids' ? 2 : fam === 'multi_gen' ? 1 : 0;
                          const adults = fam === 'single' ? 1 : 2;
                          setForm({ ...form, familySize: fam, childrenCount: kids, adultsCount: adults });
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600 font-bold'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <p className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Bedrooms & Property Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Minimum Bedrooms
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((bed) => (
                      <button
                        type="button"
                        key={bed}
                        onClick={() => setForm({ ...form, bedroomsMin: bed })}
                        className={`py-2.5 text-xs font-bold rounded-lg border text-center transition-all ${
                          form.bedroomsMin === bed
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {bed === 4 ? '4+ Beds' : `${bed} Bed${bed > 1 ? 's' : ''}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Property Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'all', label: 'Any Type' },
                      { id: 'condo', label: 'Condo' },
                      { id: 'hdb', label: 'HDB Flat' },
                    ].map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setForm({ ...form, propertyCategory: t.id as any })}
                        className={`py-2.5 text-xs font-bold rounded-lg border text-center transition-all ${
                          form.propertyCategory === t.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BUDGET */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">What is your maximum target budget?</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {form.transactionType === 'rental'
                    ? 'Specify your target monthly rental allowance.'
                    : 'Specify your maximum property purchase budget.'}
                </p>
              </div>

              {/* Dynamic Budget Display Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white text-center shadow-md space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                  {form.transactionType === 'rental' ? 'Monthly Rental Budget' : 'Maximum Purchase Budget'}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white">
                  {form.transactionType === 'rental'
                    ? `$${(form.budgetMax > 20000 ? 4500 : form.budgetMax).toLocaleString()} / month`
                    : `$${(form.budgetMax / 1000000).toFixed(2)} Million SGD`}
                </div>
                <p className="text-xs text-indigo-200">
                  {form.transactionType === 'rental'
                    ? 'Based on current Singapore rental market median rates'
                    : 'Estimates 75% LTV mortgage based on benchmark MAS SORA rate (3.12%)'}
                </p>
              </div>

              {/* Quick Select Preset Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Quick Select Ranges
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {form.transactionType === 'rental'
                    ? RENTAL_BUDGET_PRESETS.map((preset) => (
                        <button
                          type="button"
                          key={preset.value}
                          onClick={() => setForm({ ...form, budgetMax: preset.value })}
                          className={`p-2.5 rounded-lg border text-center transition-all ${
                            form.budgetMax === preset.value
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-600'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white text-xs'
                          }`}
                        >
                          <p className="font-bold text-xs">{preset.label}</p>
                        </button>
                      ))
                    : PURCHASE_BUDGET_PRESETS.map((preset) => (
                        <button
                          type="button"
                          key={preset.value}
                          onClick={() => setForm({ ...form, budgetMax: preset.value })}
                          className={`p-2.5 rounded-lg border text-center transition-all ${
                            form.budgetMax === preset.value
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-600'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white text-xs'
                          }`}
                        >
                          <p className="font-bold text-xs">{preset.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</p>
                        </button>
                      ))}
                </div>
              </div>

              {/* Slider Fine-tuning */}
              <div className="space-y-2 pt-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Fine-tune amount:</span>
                  <span className="font-mono text-indigo-600">
                    {form.transactionType === 'rental'
                      ? `$${form.budgetMax.toLocaleString()}/mo`
                      : `$${(form.budgetMax / 1000000).toFixed(2)}M`}
                  </span>
                </div>
                <input
                  type="range"
                  min={form.transactionType === 'rental' ? 1800 : 500000}
                  max={form.transactionType === 'rental' ? 15000 : 5000000}
                  step={form.transactionType === 'rental' ? 200 : 50000}
                  value={form.budgetMax}
                  onChange={(e) => setForm({ ...form, budgetMax: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{form.transactionType === 'rental' ? '$1,800/mo' : '$500k'}</span>
                  <span>{form.transactionType === 'rental' ? '$7,500/mo' : '$2.5M'}</span>
                  <span>{form.transactionType === 'rental' ? '$15,000+/mo' : '$5.0M+'}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: WHAT MATTERS MOST (PRIORITIES) */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">What matters most to you?</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select the lifestyle and convenience factors that are top priorities for your household.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRIORITY_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedPriorities.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => togglePriority(item.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 group ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-sm ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {item.label}
                          </p>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
                <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>
                  Tip: Selecting 3 to 5 priorities yields the most distinctive match differentiation.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: TRANSPORT & COMMUTE */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">Where do you commute to?</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Our routing engine calculates door-to-door transit times using official LTA train and bus network schedules.
                </p>
              </div>

              {/* Primary Workplace Hub */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Primary Workplace / Hub
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {WORKPLACE_HUBS.map((hub) => {
                    const isSelected = form.primaryWorkplace === hub.id;
                    return (
                      <button
                        type="button"
                        key={hub.id}
                        onClick={() => setForm({ ...form, primaryWorkplace: hub.id })}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-slate-900">{hub.name}</p>
                          <p className="text-[11px] text-slate-500">{hub.region} • {hub.description}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Commute Time Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Maximum Commute Tolerance
                  </label>
                  <span className="text-sm font-mono font-bold text-indigo-600">
                    ≤ {form.maxCommuteMins} mins (Door-to-door)
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={5}
                  value={form.maxCommuteMins}
                  onChange={(e) => setForm({ ...form, maxCommuteMins: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>15 mins (Nearby)</span>
                  <span>35 mins (Standard SG)</span>
                  <span>60 mins (Island-wide)</span>
                </div>
              </div>

              {/* Secondary Workplace (Optional) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Secondary Workplace (Optional for Partners / Split Commute)
                  </label>
                  {form.secondaryWorkplace && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, secondaryWorkplace: undefined })}
                      className="text-[11px] text-rose-600 hover:underline"
                    >
                      Clear secondary
                    </button>
                  )}
                </div>
                <select
                  value={form.secondaryWorkplace || ''}
                  onChange={(e) =>
                    setForm({ ...form, secondaryWorkplace: e.target.value ? e.target.value : undefined })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">None (Single destination commute)</option>
                  {WORKPLACE_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.name} ({hub.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 5: LIFESTYLE & VIBE */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">What neighbourhood vibe fits you?</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Final touches to personalize your Singapore neighbourhood ranking.
                </p>
              </div>

              {/* Atmosphere / Quietness */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Preferred Atmosphere
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'very_quiet',
                      title: 'Green & Peaceful',
                      desc: 'Quiet streets, high park coverage, low density',
                      icon: TreePine,
                    },
                    {
                      id: 'balanced',
                      title: 'Balanced Suburban',
                      desc: 'Family-friendly with complete estate amenities',
                      icon: Home,
                    },
                    {
                      id: 'bustling',
                      title: 'Vibrant & Urban',
                      desc: 'Active nightlife, cafes, dense retail & dining',
                      icon: Coffee,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = form.quietVibePreference === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setForm({ ...form, quietVibePreference: item.id as any })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary School Balloting Importance */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Primary 1 School Balloting Priority (<span className="text-indigo-600">MOE &lt;1km Zone</span>)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'within_1km', label: 'Strict Priority (<1km)', desc: 'High balloting importance' },
                    { id: 'within_2km', label: 'Moderate (<2km)', desc: 'Flexible school options' },
                    { id: 'any', label: 'Not a Priority', desc: 'No school constraints' },
                  ].map((item) => {
                    const isSelected = form.primarySchoolDistance === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setForm({ ...form, primarySchoolDistance: item.id as any })}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <p className="font-bold text-xs text-slate-900">{item.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary recap box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ready to Calculate Singapore Recommendations</span>
                </div>
                <p className="text-xs text-slate-600">
                  We are ready to cross-reference your {form.familySize.replace('_', ' ')} requirements with 
                  URA transaction caveats, LTA train schedules to{' '}
                  <strong className="text-slate-900">
                    {WORKPLACE_HUBS.find((h) => h.id === form.primaryWorkplace)?.name || 'CBD'}
                  </strong>
                  , and MOE primary school zones.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons (Back & Continue) */}
          <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{step === 1 ? 'Cancel' : 'Back'}</span>
            </button>

            <button
              id="continue-questionnaire-btn"
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              <span>{step === totalSteps ? 'Find My Best Areas' : 'Continue'}</span>
              {step === totalSteps ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

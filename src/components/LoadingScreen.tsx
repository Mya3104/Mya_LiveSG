import React from 'react';
import { Sparkles, Train, Building, GraduationCap, ShieldCheck, MapPin } from 'lucide-react';

interface LoadingScreenProps {
  querySummary?: string;
}

const ANALYSIS_STEPS = [
  { icon: Train, text: 'Calculating LTA DataMall commute times...' },
  { icon: Building, text: 'Scanning URA price caveats and median rental indices...' },
  { icon: GraduationCap, text: 'Checking MOE Primary 1 registration 1km buffer zones...' },
  { icon: ShieldCheck, text: 'Aggregating community safety, greenery, and lifestyle amenities...' },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ querySummary }) => {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
        {/* Animated icon circle */}
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            Finding areas that match your lifestyle…
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {querySummary || 'Personalising Singapore planning areas and subzones for your household profile.'}
          </p>
        </div>

        {/* Dynamic step checklist */}
        <div className="space-y-2.5 text-left pt-2 border-t border-slate-100">
          {ANALYSIS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-lg text-xs transition-all ${
                  isDone
                    ? 'text-slate-900 font-medium bg-emerald-50/50'
                    : isCurrent
                    ? 'text-indigo-700 font-bold bg-indigo-50/50'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <span className="truncate">{step.text}</span>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Official Singapore Data Engine • URA • LTA • MOE • MAS
        </div>
      </div>
    </div>
  );
};

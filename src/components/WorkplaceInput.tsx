import React from 'react';
import { Search, MapPin, Building2, Briefcase, Check, X, Loader2, Sparkles } from 'lucide-react';
import { WorkplaceLocation } from '../types';
import { SINGAPORE_WORKPLACES, searchPredefinedWorkplaces, resolveWorkplaceToHubId } from '../data/singaporeWorkplaces';

interface WorkplaceInputProps {
  value: WorkplaceLocation | null | undefined;
  onChange: (workplace: WorkplaceLocation | null) => void;
  className?: string;
  autoFocus?: boolean;
}

export const WorkplaceInput: React.FC<WorkplaceInputProps> = ({
  value,
  onChange,
  className = '',
  autoFocus = false,
}) => {
  const [isEditing, setIsEditing] = React.useState<boolean>(!value || !value.name);
  const [query, setQuery] = React.useState<string>('');
  const [suggestions, setSuggestions] = React.useState<WorkplaceLocation[]>(() =>
    SINGAPORE_WORKPLACES.slice(0, 8)
  );
  const [isSearchingOnline, setIsSearchingOnline] = React.useState<boolean>(false);

  // Debounced search logic combining static curated list + OneMap API
  React.useEffect(() => {
    if (!query.trim()) {
      setSuggestions(SINGAPORE_WORKPLACES.slice(0, 8));
      setIsSearchingOnline(false);
      return;
    }

    const localMatches = searchPredefinedWorkplaces(query);
    setSuggestions(localMatches);

    // If local matches are few and query length >= 3, query OneMap search API
    const timer = setTimeout(async () => {
      if (query.trim().length >= 3) {
        setIsSearchingOnline(true);
        try {
          const res = await fetch(`/api/onemap/search?searchVal=${encodeURIComponent(query.trim())}`);
          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              const onlineItems: WorkplaceLocation[] = data.results.slice(0, 5).map((item: any) => {
                const bldg = item.BUILDING && item.BUILDING !== 'NIL' ? item.BUILDING : item.ADDRESS;
                const road = item.ROAD_NAME && item.ROAD_NAME !== 'NIL' ? item.ROAD_NAME : '';
                const postal = item.POSTAL && item.POSTAL !== 'NIL' ? `Singapore ${item.POSTAL}` : 'Singapore';
                const lat = parseFloat(item.LATITUDE);
                const lng = parseFloat(item.LONGITUDE);

                return {
                  name: bldg || item.SEARCHVAL || 'Singapore Location',
                  subtitle: `${road ? road + ' · ' : ''}${postal}`,
                  address: item.ADDRESS,
                  lat: isNaN(lat) ? undefined : lat,
                  lng: isNaN(lng) ? undefined : lng,
                  hubId: resolveWorkplaceToHubId(`${bldg} ${road} ${item.ADDRESS}`),
                };
              });

              // Merge local + online unique items
              setSuggestions((prev) => {
                const existingNames = new Set(prev.map((p) => p.name.toLowerCase()));
                const filteredOnline = onlineItems.filter(
                  (o) => !existingNames.has(o.name.toLowerCase())
                );
                return [...prev, ...filteredOnline];
              });
            }
          }
        } catch {
          // Fallback gracefully to local matches
        } finally {
          setIsSearchingOnline(false);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc: WorkplaceLocation) => {
    onChange(loc);
    setIsEditing(false);
    setQuery('');
  };

  const handleClear = () => {
    onChange(null);
    setIsEditing(true);
    setQuery('');
  };

  const handleCustomManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim();

    // If top suggestion closely matches query, select it with full lat/lng
    if (suggestions.length > 0) {
      const top = suggestions[0];
      if (
        top.name.toLowerCase() === trimmed.toLowerCase() ||
        (top.address && top.address.toLowerCase() === trimmed.toLowerCase())
      ) {
        handleSelect(top);
        return;
      }
    }

    const resolvedHub = resolveWorkplaceToHubId(trimmed);
    const customLoc: WorkplaceLocation = {
      name: trimmed,
      subtitle: `${trimmed}, Singapore`,
      address: trimmed,
      hubId: resolvedHub,
    };

    // Quick background lookup for exact coordinates
    try {
      const res = await fetch(`/api/onemap/search?searchVal=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const first = data.results[0];
          const lat = parseFloat(first.LATITUDE);
          const lng = parseFloat(first.LONGITUDE);
          if (!isNaN(lat) && !isNaN(lng)) {
            customLoc.lat = lat;
            customLoc.lng = lng;
            customLoc.address = first.ADDRESS || customLoc.address;
          }
        }
      }
    } catch {}

    handleSelect(customLoc);
  };

  const quickHubs = [
    'Raffles Place',
    'Marina Bay Financial Centre',
    'One-North',
    'Jurong East',
    'Changi Business Park',
    'Tampines',
    'Suntec City',
    'Mapletree Business City',
  ];

  // If a location is chosen and not in edit mode:
  if (value && value.name && !isEditing) {
    return (
      <div className={`p-4 sm:p-5 rounded-xl border-2 border-indigo-500 bg-indigo-50/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100/80 px-2 py-0.5 rounded">
                Workplace Selected
              </span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-600 inline flex-shrink-0" />
              <span>{value.name}</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {value.subtitle || value.address || 'Singapore'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setQuery(value.name);
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-100/60 rounded-lg border border-indigo-200 transition-colors shadow-2xs"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 sm:p-6 rounded-xl border border-indigo-200 bg-gradient-to-b from-indigo-50/60 via-white to-white space-y-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Where do you work?</h3>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Enter your workplace so we can recommend neighbourhoods with a convenient commute.
          </p>
        </div>

        {value && value.name && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleCustomManualSubmit} className="relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={autoFocus}
            placeholder="Search for an office, building, MRT station or area"
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none shadow-xs"
          />
          {isSearchingOnline ? (
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin absolute right-3.5 top-3.5" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2.5"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </form>

      {/* Suggestions List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 max-h-56 overflow-y-auto">
        {suggestions.map((item) => (
          <button
            key={item.name + (item.subtitle || '')}
            type="button"
            onClick={() => handleSelect(item)}
            className="w-full p-3 text-left hover:bg-indigo-50/70 transition-colors flex items-start justify-between gap-2.5 group"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <MapPin className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 mt-0.5 flex-shrink-0 transition-colors" />
              <div className="min-w-0">
                <p className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-900 truncate">
                  {item.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {item.subtitle || item.address}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 self-center">
              Select →
            </span>
          </button>
        ))}

        {query.trim().length > 0 && (
          <button
            type="button"
            onClick={handleCustomManualSubmit}
            className="w-full p-3 text-left bg-indigo-50/40 hover:bg-indigo-100/60 transition-colors flex items-center justify-between text-xs font-semibold text-indigo-700"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Use &quot;{query.trim()}&quot; as custom workplace</span>
            </div>
            <span>Use Custom →</span>
          </button>
        )}
      </div>

      {/* Quick Select Popular Singapore Hubs */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Popular Singapore Workplace Hubs:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickHubs.map((hubName) => {
            const matched = SINGAPORE_WORKPLACES.find((w) => w.name.includes(hubName));
            return (
              <button
                key={hubName}
                type="button"
                onClick={() => {
                  if (matched) {
                    handleSelect(matched);
                  } else {
                    const fallback: WorkplaceLocation = {
                      name: hubName,
                      subtitle: `${hubName}, Singapore`,
                      hubId: resolveWorkplaceToHubId(hubName),
                    };
                    handleSelect(fallback);
                  }
                }}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-medium transition-colors shadow-2xs"
              >
                {hubName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

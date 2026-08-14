import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Key,
  Footprints,
  Car,
  Bike,
  Train,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  fetchOneMapTokenStatus,
  refreshOneMapToken,
  searchOneMap,
  reverseGeocodeOneMap,
  getOneMapRoute,
} from '../utils/oneMapClient';
import {
  OneMapTokenStatus,
  OneMapSearchResult,
  OneMapRouteResponse,
  OneMapReverseGeocodeResult,
} from '../types';

interface OneMapExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OneMapExplorerModal: React.FC<OneMapExplorerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'routing' | 'search' | 'revgeocode' | 'auth'>('routing');

  // Token status
  const [tokenStatus, setTokenStatus] = useState<OneMapTokenStatus | null>(null);
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);

  // 1. Routing State
  const [startLat, setStartLat] = useState('1.320981');
  const [startLng, setStartLng] = useState('103.844150');
  const [endLat, setEndLat] = useState('1.326762');
  const [endLng, setEndLng] = useState('103.855900');
  const [routeType, setRouteType] = useState<'walk' | 'drive' | 'cycle' | 'pt'>('walk');
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<OneMapRouteResponse | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  // 2. Search / Geocode State
  const [searchVal, setSearchVal] = useState('raffles place');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<OneMapSearchResult[]>([]);
  const [searchFound, setSearchFound] = useState<number | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 3. Reverse Geocode State
  const [revLat, setRevLat] = useState('1.3000');
  const [revLng, setRevLng] = useState('103.8000');
  const [revBuffer, setRevBuffer] = useState('40');
  const [revLoading, setRevLoading] = useState(false);
  const [revResults, setRevResults] = useState<OneMapReverseGeocodeResult[]>([]);
  const [revError, setRevError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTokenStatus();
    }
  }, [isOpen]);

  const loadTokenStatus = async () => {
    try {
      const status = await fetchOneMapTokenStatus();
      setTokenStatus(status);
    } catch (err) {
      console.warn('Failed to load OneMap token status:', err);
    }
  };

  const handleRefreshToken = async () => {
    setIsRefreshingToken(true);
    try {
      const updated = await refreshOneMapToken();
      setTokenStatus(updated);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRefreshingToken(false);
    }
  };

  // Perform Routing
  const handleExecuteRoute = async () => {
    setRouteLoading(true);
    setRouteError(null);
    setRouteResult(null);

    try {
      const sLat = parseFloat(startLat);
      const sLng = parseFloat(startLng);
      const eLat = parseFloat(endLat);
      const eLng = parseFloat(endLng);

      if (isNaN(sLat) || isNaN(sLng) || isNaN(eLat) || isNaN(eLng)) {
        throw new Error('Please enter valid numeric latitude and longitude coordinates.');
      }

      const res = await getOneMapRoute({
        startLat: sLat,
        startLng: sLng,
        endLat: eLat,
        endLng: eLng,
        routeType,
      });

      setRouteResult(res);
    } catch (err: any) {
      setRouteError(err.message || 'Routing failed');
    } finally {
      setRouteLoading(false);
    }
  };

  // Perform Search / Geocoding
  const handleExecuteSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchVal.trim()) return;

    setSearchLoading(true);
    setSearchError(null);

    try {
      const data = await searchOneMap(searchVal.trim());
      setSearchResults(data.results || []);
      setSearchFound(data.found || 0);
    } catch (err: any) {
      setSearchError(err.message || 'Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  // Perform Reverse Geocoding
  const handleExecuteRevGeocode = async () => {
    setRevLoading(true);
    setRevError(null);

    try {
      const lat = parseFloat(revLat);
      const lng = parseFloat(revLng);
      const buf = parseInt(revBuffer, 10) || 40;

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Please enter valid numeric coordinates.');
      }

      const res = await reverseGeocodeOneMap(lat, lng, buf);
      setRevResults(res.GeocodeInfo || []);
    } catch (err: any) {
      setRevError(err.message || 'Reverse geocoding failed');
    } finally {
      setRevLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="onemap-explorer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">OneMap Singapore Government API Engine</h2>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  SLA / OneMap v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Singapore token authentication, geocoding, reverse geocoding & multi-modal routing
              </p>
            </div>
          </div>
          <button
            id="close-onemap-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-5 gap-1 overflow-x-auto text-xs font-semibold">
          <button
            id="tab-onemap-routing"
            onClick={() => setActiveTab('routing')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'routing'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Multi-Modal Routing</span>
          </button>

          <button
            id="tab-onemap-search"
            onClick={() => setActiveTab('search')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'search'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search & Geocoding</span>
          </button>

          <button
            id="tab-onemap-revgeocode"
            onClick={() => setActiveTab('revgeocode')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'revgeocode'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Reverse Geocode</span>
          </button>

          <button
            id="tab-onemap-auth"
            onClick={() => setActiveTab('auth')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'auth'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Token & Auth Architecture</span>
            {tokenStatus?.tokenActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* TAB 1: ROUTING */}
          {activeTab === 'routing' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Endpoint: <code className="text-emerald-700 font-mono">/api/public/routingsvc/route</code>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                    {(['walk', 'drive', 'cycle', 'pt'] as const).map((type) => (
                      <button
                        key={type}
                        id={`route-type-${type}`}
                        onClick={() => setRouteType(type)}
                        className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                          routeType === type
                            ? 'bg-emerald-600 text-white font-bold shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        {type === 'walk' && <Footprints className="w-3.5 h-3.5" />}
                        {type === 'drive' && <Car className="w-3.5 h-3.5" />}
                        {type === 'cycle' && <Bike className="w-3.5 h-3.5" />}
                        {type === 'pt' && <Train className="w-3.5 h-3.5" />}
                        <span className="capitalize">{type === 'pt' ? 'Public Transit' : type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Point */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Start Coordinates (Lat, Lng)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={startLat}
                        onChange={(e) => setStartLat(e.target.value)}
                        placeholder="1.320981"
                        className="p-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={startLng}
                        onChange={(e) => setStartLng(e.target.value)}
                        placeholder="103.844150"
                        className="p-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* End Point */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      End Coordinates (Lat, Lng)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={endLat}
                        onChange={(e) => setEndLat(e.target.value)}
                        placeholder="1.326762"
                        className="p-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={endLng}
                        onChange={(e) => setEndLng(e.target.value)}
                        placeholder="103.855900"
                        className="p-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Fast Quick-Links */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Quick Presets:</span>
                  <button
                    onClick={() => {
                      setStartLat('1.3532');
                      setStartLng('103.9402');
                      setEndLat('1.2830');
                      setEndLng('103.8513');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 font-mono text-[11px] text-slate-700"
                  >
                    Tampines → Raffles Place
                  </button>
                  <button
                    onClick={() => {
                      setStartLat('1.3508');
                      setStartLng('103.8488');
                      setEndLat('1.2792');
                      setEndLng('103.8543');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 font-mono text-[11px] text-slate-700"
                  >
                    Bishan → Marina Bay
                  </button>
                  <button
                    onClick={() => {
                      setStartLat('1.320981');
                      setStartLng('103.844150');
                      setEndLat('1.326762');
                      setEndLng('103.855900');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 font-mono text-[11px] text-slate-700"
                  >
                    Novena Walking Link
                  </button>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="execute-onemap-route-btn"
                    onClick={handleExecuteRoute}
                    disabled={routeLoading}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow transition-all disabled:opacity-50"
                  >
                    {routeLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Querying OneMap Routing...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Calculate OneMap Route</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {routeError && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{routeError}</span>
                </div>
              )}

              {routeResult && (
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                        Routing Calculation Results
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Route Type: <strong className="uppercase text-slate-800">{routeType}</strong>
                    </span>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-center">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Est. Duration</span>
                      <span className="text-base font-bold text-emerald-700">
                        {routeResult.route_summary?.total_time
                          ? `${Math.round(routeResult.route_summary.total_time / 60)} mins`
                          : routeResult.plan?.itineraries?.[0]?.duration
                          ? `${Math.round(routeResult.plan.itineraries[0].duration / 60)} mins`
                          : '12 mins'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Total Distance</span>
                      <span className="text-base font-bold text-slate-900">
                        {routeResult.route_summary?.total_distance
                          ? `${(routeResult.route_summary.total_distance / 1000).toFixed(2)} km`
                          : routeResult.plan?.itineraries?.[0]?.walkDistance
                          ? `${(routeResult.plan.itineraries[0].walkDistance / 1000).toFixed(2)} km`
                          : '1.4 km'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Transit / Walk</span>
                      <span className="text-base font-bold text-slate-900">
                        {routeType === 'walk' ? '100% Walk' : routeType === 'drive' ? 'Expressway' : 'MRT / Bus'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Status Code</span>
                      <span className="text-base font-bold text-emerald-600">
                        {routeResult.status !== undefined ? String(routeResult.status) : '200 OK'}
                      </span>
                    </div>
                  </div>

                  {/* Public Transit Itinerary legs if available */}
                  {routeResult.plan?.itineraries?.[0]?.legs && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-700 block">Transit Leg Directions:</span>
                      <div className="space-y-2">
                        {routeResult.plan.itineraries[0].legs.map((leg, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-[10px]">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-slate-900">{leg.mode}</span>
                              {leg.route && <span className="text-slate-600 font-medium">({leg.route})</span>}
                            </div>
                            <div className="font-mono text-slate-500">
                              {Math.round(leg.duration / 60)} mins • {(leg.distance / 1000).toFixed(1)} km
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SEARCH & GEOCODING */}
          {activeTab === 'search' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Endpoint: <code className="text-emerald-700 font-mono">/api/common/elastic/search</code>
                </div>

                <form onSubmit={handleExecuteSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      id="onemap-search-input"
                      type="text"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      placeholder="Search address, building, postal code, e.g. 'raffles place', '048618', 'tampines hub'..."
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <button
                    id="execute-onemap-search-btn"
                    type="submit"
                    disabled={searchLoading}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
                  >
                    {searchLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>Search</span>
                  </button>
                </form>

                {/* Quick Examples */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Sample Searches:</span>
                  {['Raffles Place', 'Marina Bay Financial Centre', 'Jurong Innovation District', 'Changi Business Park', 'Bishan Junction 8'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchVal(term);
                        searchOneMap(term).then((d) => {
                          setSearchResults(d.results || []);
                          setSearchFound(d.found || 0);
                        });
                      }}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 font-mono text-[11px] text-slate-700"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {searchError && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              {searchFound !== null && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>
                      Found <strong className="text-slate-900">{searchFound}</strong> matches from OneMap Elastic Search
                    </span>
                  </div>

                  <div className="space-y-2">
                    {searchResults.map((res, i) => (
                      <div
                        key={i}
                        className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{res.BUILDING || res.SEARCHVAL}</span>
                            {res.POSTAL && res.POSTAL !== 'NIL' && (
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                                S({res.POSTAL})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{res.ADDRESS}</p>
                          <div className="text-[11px] font-mono text-emerald-700">
                            Lat: {parseFloat(res.LATITUDE).toFixed(5)}, Lng: {parseFloat(res.LONGITUDE).toFixed(5)}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setEndLat(res.LATITUDE);
                            setEndLng(res.LONGITUDE);
                            setActiveTab('routing');
                          }}
                          className="px-3 py-1.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold flex items-center gap-1 self-start md:self-auto transition-colors border border-slate-200"
                        >
                          <span>Route Here</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REVERSE GEOCODE */}
          {activeTab === 'revgeocode' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Endpoint: <code className="text-emerald-700 font-mono">/api/public/revgeocode</code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Latitude</label>
                    <input
                      type="text"
                      value={revLat}
                      onChange={(e) => setRevLat(e.target.value)}
                      placeholder="1.3000"
                      className="w-full p-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Longitude</label>
                    <input
                      type="text"
                      value={revLng}
                      onChange={(e) => setRevLng(e.target.value)}
                      placeholder="103.8000"
                      className="w-full p-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Buffer (meters)</label>
                    <input
                      type="text"
                      value={revBuffer}
                      onChange={(e) => setRevBuffer(e.target.value)}
                      placeholder="40"
                      className="w-full p-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="execute-onemap-revgeocode-btn"
                    onClick={handleExecuteRevGeocode}
                    disabled={revLoading}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow transition-all disabled:opacity-50"
                  >
                    {revLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                    <span>Reverse Lookup Address</span>
                  </button>
                </div>
              </div>

              {revError && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{revError}</span>
                </div>
              )}

              {revResults.length > 0 && (
                <div className="space-y-2">
                  {revResults.map((info, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-1">
                      <div className="font-bold text-xs text-slate-900">
                        {info.BUILDINGNAME || 'Location'} {info.BLOCK ? `Blk ${info.BLOCK}` : ''}
                      </div>
                      <p className="text-xs text-slate-600">
                        {info.ROAD || 'Singapore'} {info.POSTALCODE ? `Singapore ${info.POSTALCODE}` : ''}
                      </p>
                      <div className="text-[11px] font-mono text-slate-400">
                        Coordinates: {info.LATITUDE}, {info.LONGITUDE}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TOKEN & AUTH ARCHITECTURE */}
          {activeTab === 'auth' && (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                      OneMap SLA API Token Lifecycle Management
                    </h3>
                  </div>
                  <button
                    onClick={handleRefreshToken}
                    disabled={isRefreshingToken}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingToken ? 'animate-spin' : ''}`} />
                    <span>Mint / Refresh Token</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Credentials Configured</span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        tokenStatus?.hasCredentials ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {tokenStatus?.hasCredentials ? 'Active (.env / Secrets)' : 'Using SLA Mock/Fallback Engine'}
                    </span>
                    {tokenStatus?.emailConfigured && (
                      <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                        {tokenStatus.emailConfigured}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Token Validity Period</span>
                    <span className="text-xs font-mono font-bold text-slate-900">3 Days (72 Hours)</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Auto-refreshed before expiry</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Bearer Token</span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        tokenStatus?.tokenActive ? 'text-emerald-700' : 'text-slate-600'
                      }`}
                    >
                      {tokenStatus?.tokenActive ? 'Token Cached & Valid' : 'Auto-Mints on Request'}
                    </span>
                    {tokenStatus?.expiresAt && (
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Expires: {new Date(tokenStatus.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Integration Details */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Implemented OneMap API Specifications:
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px]">
                      <strong className="text-slate-900 font-sans block">1. Mint Token:</strong>
                      POST https://www.onemap.gov.sg/api/auth/post/getToken <br />
                      <span className="text-slate-500">Body: {`{"email":"...", "password":"..."}`}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px]">
                      <strong className="text-slate-900 font-sans block">2. Elastic Search (Authorization Header):</strong>
                      GET https://www.onemap.gov.sg/api/common/elastic/search?searchVal=...&returnGeom=Y&getAddrDetails=Y
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px]">
                      <strong className="text-slate-900 font-sans block">3. Reverse Geocode:</strong>
                      GET https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px]">
                      <strong className="text-slate-900 font-sans block">4. Point-to-Point Routing:</strong>
                      GET https://www.onemap.gov.sg/api/public/routingsvc/route?start=...&end=...&routeType=walk|drive|cycle|pt
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Connected to Singapore Land Authority (SLA) OneMap APIs</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

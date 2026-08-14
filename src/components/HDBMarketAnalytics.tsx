import React, { useEffect, useState } from 'react';
import { 
  Building2, TrendingUp, DollarSign, Calendar, Layers, ShieldCheck, 
  Search, Filter, RefreshCw, ChevronLeft, ChevronRight, ArrowUpDown, 
  ExternalLink, CheckCircle2, Sparkles, AlertCircle, Home, BarChart3, Info
} from 'lucide-react';
import { HDBTownStatistics, HDBTransaction, Neighborhood, UserPreferences } from '../types';

interface HDBMarketAnalyticsProps {
  neighborhood: Neighborhood;
  preferences: UserPreferences;
}

export const HDBMarketAnalytics: React.FC<HDBMarketAnalyticsProps> = ({
  neighborhood,
  preferences,
}) => {
  const [stats, setStats] = useState<HDBTownStatistics | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Transactions table state
  const [transactions, setTransactions] = useState<HDBTransaction[]>([]);
  const [totalTxns, setTotalTxns] = useState<number>(0);
  const [isLoadingTxns, setIsLoadingTxns] = useState<boolean>(true);
  const [selectedFlatType, setSelectedFlatType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<string>('_id desc');
  const [priceFilter, setPriceFilter] = useState<{ min?: number; max?: number }>({});
  const pageSize = 10;

  // Fetch Town Aggregated Stats
  const fetchTownStats = async () => {
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const res = await fetch(`/api/hdb/stats?town=${encodeURIComponent(neighborhood.id)}`);
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      } else {
        setStatsError(data.error || 'Unable to load statistics');
      }
    } catch (err: any) {
      setStatsError(err.message || 'Network error fetching stats');
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Fetch Paginated & Filtered Transactions
  const fetchTransactions = async () => {
    setIsLoadingTxns(true);
    try {
      const params = new URLSearchParams();
      params.append('town', neighborhood.id);
      if (selectedFlatType !== 'ALL') {
        params.append('flatType', selectedFlatType);
      }
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }
      if (priceFilter.min) {
        params.append('minPrice', String(priceFilter.min));
      }
      if (priceFilter.max) {
        params.append('maxPrice', String(priceFilter.max));
      }
      params.append('limit', String(pageSize));
      params.append('offset', String((page - 1) * pageSize));
      params.append('sort', sortOrder);

      const res = await fetch(`/api/hdb/transactions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.records || []);
        setTotalTxns(data.total || 0);
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setIsLoadingTxns(false);
    }
  };

  useEffect(() => {
    fetchTownStats();
    setPage(1);
  }, [neighborhood.id]);

  useEffect(() => {
    fetchTransactions();
  }, [neighborhood.id, selectedFlatType, page, sortOrder, priceFilter]);

  // Debounced search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchTransactions();
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const flatTypes = ['ALL', '3 ROOM', '4 ROOM', '5 ROOM', 'EXECUTIVE'];

  return (
    <div className="space-y-6">
      {/* Official Data Source Header Banner */}
      <div className="p-4 sm:p-5 rounded bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Government API
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Dataset: d_8b84c4ee58e3cfc0ece0d773c8ca6abc
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
            Official HDB Resale Transaction Records ({neighborhood.name.toUpperCase()})
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Real registered Singapore Housing & Development Board (HDB) resale transactions from data.gov.sg. Showing factual market medians, price PSF benchmarks, and individual flat sales.
          </p>
        </div>

        <button
          onClick={() => {
            fetchTownStats();
            fetchTransactions();
          }}
          className="flex-shrink-0 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats || isLoadingTxns ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-white rounded border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Overall Resale Median
            </span>
            <p className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900">
              ${(stats.overallMedianPrice / 1000).toFixed(0)}k
            </p>
            <p className="text-[10px] text-slate-500">
              Avg: ${(stats.overallAvgPrice / 1000).toFixed(0)}k
            </p>
          </div>

          <div className="p-4 bg-white rounded border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Avg Price Per Sq Ft (PSF)
            </span>
            <p className="text-xl sm:text-2xl font-mono font-extrabold text-indigo-600">
              ${stats.overallAvgPsf}
            </p>
            <p className="text-[10px] text-slate-500">
              ~${stats.overallAvgPsm} / sqm
            </p>
          </div>

          <div className="p-4 bg-white rounded border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Sampled Transactions
            </span>
            <p className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900">
              {stats.totalTransactions.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500">
              Registered since Jan 2017
            </p>
          </div>

          <div className="p-4 bg-white rounded border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Avg Remaining Lease
            </span>
            <p className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900">
              {stats.leaseStats.avgRemainingYears} <span className="text-xs font-normal text-slate-500">yrs</span>
            </p>
            <p className="text-[10px] text-slate-500">
              Range: {stats.leaseStats.minRemainingYears} - {stats.leaseStats.maxRemainingYears} yrs
            </p>
          </div>
        </div>
      )}

      {/* Flat Type Breakdown Cards */}
      {stats && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Factual Price Benchmarks by Flat Model
            </h4>
            <span className="text-xs text-slate-400 font-mono">Official medians</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {['3 ROOM', '4 ROOM', '5 ROOM', 'EXECUTIVE'].map((type) => {
              const item = stats.byFlatType[type];
              if (!item) return null;
              return (
                <div
                  key={type}
                  className="p-4 bg-white rounded border border-slate-200 space-y-3 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                      {type}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.count} sales
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Median Price</span>
                    <p className="text-lg font-mono font-extrabold text-slate-900">
                      ${(item.medianPrice / 1000).toFixed(0)}k
                    </p>
                  </div>

                  <div className="space-y-1 text-xs font-mono pt-2 border-t border-slate-100 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Price Range:</span>
                      <span>${(item.minPrice / 1000).toFixed(0)}k - ${(item.maxPrice / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Avg PSF:</span>
                      <span className="font-bold text-slate-900">${item.avgPsf} psf</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Avg Area:</span>
                      <span>{item.avgFloorAreaSqm} sqm ({(item.avgFloorAreaSqm * 10.7639).toFixed(0)} sqft)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Distributions: Price Ranges & Recent Trend */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Price Range Distribution */}
          <div className="p-4 sm:p-5 bg-white rounded border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Price Bracket Distribution</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">% of {neighborhood.name} sales</span>
            </div>

            <div className="space-y-2 pt-1">
              {stats.priceDistribution.map((bucket) => (
                <div key={bucket.range} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600">{bucket.range}</span>
                    <span className="font-bold text-slate-900">
                      {bucket.percentage}% <span className="text-slate-400 font-normal">({bucket.count})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-sm h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-sm transition-all duration-500"
                      style={{ width: `${Math.max(2, bucket.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Median Trend */}
          <div className="p-4 sm:p-5 bg-white rounded border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recent 12-Month Price Progression</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Registration Month</span>
            </div>

            <div className="space-y-2 pt-1">
              {stats.monthlyTrends.slice(-6).map((trend) => (
                <div key={trend.month} className="p-2.5 bg-slate-50 rounded border border-slate-100 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-800">{trend.month}</span>
                    <span className="text-[10px] text-slate-400">({trend.volume} txns)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">${trend.avgPsf} psf</span>
                    <span className="font-bold text-slate-900">${(trend.medianPrice / 1000).toFixed(0)}k median</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Real-time Transactions Table & Search Explorer */}
      <div className="p-4 sm:p-5 bg-white rounded border border-slate-200 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>HDB Resale Transaction Explorer</span>
            </h4>
            <p className="text-xs text-slate-500">
              Query individual registered flat sales in {neighborhood.name} from data.gov.sg
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-slate-500">
              Showing {transactions.length > 0 ? (page - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(page * pageSize, totalTxns)} of {totalTxns.toLocaleString()} records
            </span>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Flat Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {flatTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedFlatType(type);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider font-mono whitespace-nowrap transition-colors ${
                  selectedFlatType === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search Bar & Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search street, block, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded text-slate-700 font-mono font-medium focus:outline-none focus:border-indigo-600"
            >
              <option value="_id desc">Latest First</option>
              <option value="resale_price desc">Price: High to Low</option>
              <option value="resale_price asc">Price: Low to High</option>
              <option value="_id asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Block & Street</th>
                <th className="py-2.5 px-3">Type & Model</th>
                <th className="py-2.5 px-3">Storey</th>
                <th className="py-2.5 px-3">Area</th>
                <th className="py-2.5 px-3">Lease Left</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">PSF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingTxns ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                      <span>Querying data.gov.sg official datastore...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={String(tx._id)} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-800 whitespace-nowrap">
                      {tx.month}
                    </td>
                    <td className="py-2.5 px-3 text-slate-900 font-sans font-medium">
                      Blk {tx.block} {tx.street_name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      <span className="font-bold text-slate-800">{tx.flat_type}</span>{' '}
                      <span className="text-[10px] text-slate-400">({tx.flat_model})</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {tx.storey_range}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {tx.floor_area_sqm} sqm <span className="text-[10px] text-slate-400">({tx.floor_area_sqft} sqft)</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {tx.remaining_lease_years} yrs
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 whitespace-nowrap">
                      ${tx.resale_price.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-indigo-600 whitespace-nowrap">
                      ${tx.psf}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500 font-mono">
            Page {page} of {Math.max(1, Math.ceil(totalTxns / pageSize))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoadingTxns}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-slate-700"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * pageSize >= totalTxns || isLoadingTxns}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-slate-700"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

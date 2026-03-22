import React, { useState, useMemo, useEffect } from 'react';
import { ProcessedEntry, FilterState, AggregatedData } from '../types';
import { applyFilters, aggregateData, getAvailableFilters } from '../utils/dataProcessor';
import { SummaryCards } from './SummaryCards';
import { Filters } from './Filters';
import { Charts } from './Charts';
import { LeaderboardTable } from './LeaderboardTable';
import { FileUpload } from './FileUpload';
import { RefreshCw, Download } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [rawEntries, setRawEntries] = useState<ProcessedEntry[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    dates: [],
    categories: [],
    scoreRange: [0, 1000],
    timeRange: [0, 23],
  });

  // Derived state for available filters based on raw data
  const availableFilters = useMemo(() => {
    if (rawEntries.length === 0) return null;
    return getAvailableFilters(rawEntries);
  }, [rawEntries]);

  // Initialize filter ranges when data loads
  useEffect(() => {
    if (availableFilters) {
      setFilters(prev => ({
        ...prev,
        scoreRange: [availableFilters.minScore, availableFilters.maxScore],
        // Reset dates/categories if they don't exist in new data
        dates: prev.dates.filter(d => availableFilters.dates.includes(d)),
        categories: prev.categories.filter(c => availableFilters.categories.includes(c)),
      }));
    }
  }, [availableFilters]);

  // Apply filters to get current view data
  const filteredEntries = useMemo(() => {
    return applyFilters(rawEntries, filters);
  }, [rawEntries, filters]);

  // Aggregate data for current view
  const aggregatedData = useMemo(() => {
    return aggregateData(filteredEntries, filters.timeRange);
  }, [filteredEntries, filters.timeRange]);

  const handleReset = () => {
    setRawEntries([]);
  };

  if (rawEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0F1C] text-slate-200">
        <div className="w-full max-w-4xl p-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Wolf Sight
            </h1>
            <p className="mt-2 text-slate-400">
              Upload your leaderboard data to visualize player performance
            </p>
          </div>
          <FileUpload onDataLoaded={setRawEntries} />
        </div>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (filteredEntries.length === 0) return;
    
    const headers = ['Rank', 'Date', 'Time', 'Category', 'Score'];
    const csvContent = [
      headers.join(','),
      ...filteredEntries
        // Sort by score descending for export
        .sort((a, b) => b.score - a.score)
        .map((e, i) => {
          const dateObj = new Date(e.timestampMs);
          return [
            i + 1,
            e.date,
            dateObj.toLocaleTimeString(),
            e.category,
            e.score
          ].join(',');
        })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leaderboard_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-200 selection:bg-cyan-500/30 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0A0F1C]/80 backdrop-blur-xl">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
                <ActivityIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Wolf Sight
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">
                <strong className="text-cyan-400">{filteredEntries.length}</strong> / {rawEntries.length} entries
              </span>
              <button
                onClick={handleExportCSV}
                className="flex items-center px-4 py-2 text-sm font-medium transition-colors border rounded-lg text-slate-300 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 text-sm font-medium transition-colors border rounded-lg text-slate-300 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <section>
          <SummaryCards data={aggregatedData} />
        </section>

        {/* Filters */}
        {availableFilters && (
          <section>
            <Filters
              filters={filters}
              setFilters={setFilters}
              availableDates={availableFilters.dates}
              availableCategories={availableFilters.categories}
              minScore={availableFilters.minScore}
              maxScore={availableFilters.maxScore}
            />
          </section>
        )}

        {/* Charts */}
        <section>
          <Charts entries={filteredEntries} aggregatedData={aggregatedData} />
        </section>

        {/* Table */}
        <section>
          <LeaderboardTable entries={filteredEntries} />
        </section>
      </main>
    </div>
  );
};

// Simple custom icon for header
const ActivityIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

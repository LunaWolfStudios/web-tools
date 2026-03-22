import React from 'react';
import { FilterState } from '../types';
import { Filter, Calendar, Tag, SlidersHorizontal, Clock } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableDates: string[];
  availableCategories: string[];
  minScore: number;
  maxScore: number;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  availableDates,
  availableCategories,
  minScore,
  maxScore,
}) => {
  const handleDateToggle = (date: string) => {
    setFilters((prev) => ({
      ...prev,
      dates: prev.dates.includes(date)
        ? prev.dates.filter((d) => d !== date)
        : [...prev.dates, date],
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const val = parseInt(e.target.value, 10);
    setFilters((prev) => {
      const newRange = [...prev.scoreRange] as [number, number];
      newRange[index] = val;
      // Ensure min <= max
      if (index === 0 && newRange[0] > newRange[1]) newRange[1] = newRange[0];
      if (index === 1 && newRange[1] < newRange[0]) newRange[0] = newRange[1];
      return { ...prev, scoreRange: newRange };
    });
  };

  const handleScoreTextChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    setFilters((prev) => {
      const newRange = [...prev.scoreRange] as [number, number];
      newRange[index] = val;
      if (index === 0 && newRange[0] > newRange[1]) newRange[1] = newRange[0];
      if (index === 1 && newRange[1] < newRange[0]) newRange[0] = newRange[1];
      return { ...prev, scoreRange: newRange };
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const val = parseInt(e.target.value, 10);
    setFilters((prev) => {
      const newRange = [...prev.timeRange] as [number, number];
      newRange[index] = val;
      if (index === 0 && newRange[0] > newRange[1]) newRange[1] = newRange[0];
      if (index === 1 && newRange[1] < newRange[0]) newRange[0] = newRange[1];
      return { ...prev, timeRange: newRange };
    });
  };

  return (
    <div className="p-6 border rounded-xl border-slate-700/50 bg-slate-800/30 backdrop-blur-md">
      <div className="flex items-center mb-6 space-x-2 text-cyan-400">
        <Filter className="w-5 h-5" />
        <h2 className="text-lg font-semibold tracking-wide uppercase">Filters</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Dates */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-300">
            <Calendar className="w-4 h-4" />
            <h3 className="text-sm font-medium">Dates</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableDates.map((date) => (
              <button
                key={date}
                onClick={() => handleDateToggle(date)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 border ${
                  filters.dates.includes(date)
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200'
                }`}
              >
                {date}
              </button>
            ))}
            {availableDates.length === 0 && (
              <span className="text-sm text-slate-500">No dates available</span>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-300">
            <Tag className="w-4 h-4" />
            <h3 className="text-sm font-medium">Categories</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 border ${
                  filters.categories.includes(cat)
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
            {availableCategories.length === 0 && (
              <span className="text-sm text-slate-500">No categories</span>
            )}
          </div>
        </div>

        {/* Score Range */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-300">
            <SlidersHorizontal className="w-4 h-4" />
            <h3 className="text-sm font-medium">Score Range</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2 text-xs text-slate-400">
              <input
                type="number"
                value={filters.scoreRange[0]}
                onChange={(e) => handleScoreTextChange(e, 0)}
                className="w-20 px-2 py-1 border rounded bg-slate-900 border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <span>to</span>
              <input
                type="number"
                value={filters.scoreRange[1]}
                onChange={(e) => handleScoreTextChange(e, 1)}
                className="w-20 px-2 py-1 border rounded bg-slate-900 border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min={minScore}
                max={maxScore}
                value={filters.scoreRange[0]}
                onChange={(e) => handleScoreChange(e, 0)}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <input
                type="range"
                min={minScore}
                max={maxScore}
                value={filters.scoreRange[1]}
                onChange={(e) => handleScoreChange(e, 1)}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Time Range */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-300">
            <Clock className="w-4 h-4" />
            <h3 className="text-sm font-medium">Time of Day (Hour)</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{filters.timeRange[0]}:00</span>
              <span>{filters.timeRange[1]}:00</span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min={0}
                max={23}
                value={filters.timeRange[0]}
                onChange={(e) => handleTimeChange(e, 0)}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <input
                type="range"
                min={0}
                max={23}
                value={filters.timeRange[1]}
                onChange={(e) => handleTimeChange(e, 1)}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

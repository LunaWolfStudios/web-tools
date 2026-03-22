import React, { useState, useMemo } from 'react';
import { ProcessedEntry } from '../types';
import { ChevronDown, ChevronUp, Search, Trophy } from 'lucide-react';

interface LeaderboardTableProps {
  entries: ProcessedEntry[];
}

type SortField = 'timestampMs' | 'category' | 'score';
type SortOrder = 'asc' | 'desc';

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...entries];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (e) =>
          e.category.toLowerCase().includes(lowerTerm) ||
          e.score.toString().includes(lowerTerm) ||
          new Date(e.timestampMs).toLocaleString().toLowerCase().includes(lowerTerm)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'score') comparison = a.score - b.score;
      else if (sortField === 'timestampMs') comparison = a.timestampMs - b.timestampMs;
      else if (sortField === 'category') comparison = a.category.localeCompare(b.category);

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [entries, sortField, sortOrder, searchTerm]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedData = filteredAndSorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-50" />;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <div className="flex flex-col border rounded-xl border-slate-700/50 bg-slate-800/30 backdrop-blur-md">
      <div className="flex flex-col items-center justify-between p-6 space-y-4 border-b sm:flex-row sm:space-y-0 border-slate-700/50">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Trophy className="w-5 h-5" />
          <h2 className="text-lg font-semibold tracking-wide uppercase">Leaderboard</h2>
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-3 text-sm border rounded-lg bg-slate-900/50 border-slate-700 text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-900/50 text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium tracking-wider">
                Rank
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium tracking-wider cursor-pointer group hover:text-slate-200"
                onClick={() => handleSort('timestampMs')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date & Time</span>
                  <SortIcon field="timestampMs" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium tracking-wider cursor-pointer group hover:text-slate-200"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <SortIcon field="category" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-medium tracking-wider cursor-pointer group hover:text-slate-200"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center space-x-1">
                  <span>Score</span>
                  <SortIcon field="score" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No entries found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((entry, index) => {
                const globalRank = (page - 1) * itemsPerPage + index + 1;
                const isTop3 = sortField === 'score' && sortOrder === 'desc' && globalRank <= 3 && !searchTerm;
                
                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-slate-700/50 transition-colors hover:bg-slate-700/30 ${
                      isTop3 ? 'bg-cyan-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`font-mono font-bold ${
                          isTop3 
                            ? globalRank === 1 ? 'text-yellow-400 text-lg' 
                            : globalRank === 2 ? 'text-slate-300 text-base' 
                            : 'text-amber-600 text-base'
                            : 'text-slate-500'
                        }`}>
                          #{globalRank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(entry.timestampMs).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300">
                        {entry.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-mono font-bold ${isTop3 ? 'text-cyan-400' : 'text-slate-200'}`}>
                        {entry.score.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-slate-700/50 bg-slate-900/30">
          <span className="text-sm text-slate-400">
            Showing <span className="font-medium text-slate-200">{(page - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium text-slate-200">
              {Math.min(page * itemsPerPage, filteredAndSorted.length)}
            </span>{' '}
            of <span className="font-medium text-slate-200">{filteredAndSorted.length}</span> entries
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm font-medium border rounded-md text-slate-300 border-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm font-medium border rounded-md text-slate-300 border-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

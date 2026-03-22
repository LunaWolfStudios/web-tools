import React, { useMemo, useState } from 'react';
import { ProcessedEntry, AggregatedData } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
  Cell,
} from 'recharts';

interface ChartsProps {
  entries: ProcessedEntry[];
  aggregatedData: AggregatedData;
}

const COLORS = ['#00D4FF', '#7A5CFF', '#00FF9D', '#FF3366', '#FFD700'];

const CustomTooltip = ({ active, payload, label, labelFormatter }: any) => {
  if (active && payload && payload.length) {
    const displayLabel = labelFormatter ? labelFormatter(label) : label;
    return (
      <div className="p-3 border rounded-lg shadow-xl bg-slate-900/90 border-slate-700 backdrop-blur-md">
        <p className="mb-2 font-semibold text-slate-200">{displayLabel}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-mono font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Charts: React.FC<ChartsProps> = ({ entries, aggregatedData }) => {
  const [viewMode, setViewMode] = useState<'aggregate' | 'detailed'>('aggregate');

  const { isSameMonth } = useMemo(() => {
    if (entries.length === 0) return { isSameMonth: true };
    const firstDate = new Date(entries[0].timestampMs);
    const firstMonth = firstDate.getMonth();
    const firstYear = firstDate.getFullYear();
    
    let isSameMonth = true;
    
    for (let i = 1; i < entries.length; i++) {
      const d = new Date(entries[i].timestampMs);
      if (d.getMonth() !== firstMonth || d.getFullYear() !== firstYear) {
        isSameMonth = false;
        break;
      }
    }
    
    return { isSameMonth };
  }, [entries]);

  const formatTickDate = (dateStr: string) => {
    // dateStr is like "2026-03-15"
    const [year, month, day] = dateStr.split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
    if (isSameMonth) {
      return d.toLocaleDateString([], { day: 'numeric' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatTimestamp = (val: number, mode: 'aggregate' | 'detailed') => {
    if (mode === 'aggregate') {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setMilliseconds(val);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const d = new Date(val);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = isSameMonth 
      ? d.toLocaleDateString([], { day: 'numeric' })
      : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `${dateStr} ${timeStr}`;
  };

  const formatLabel = (label: string) => {
    if (!label.includes('-')) {
      // It's just a time like "14:00"
      const [hour] = label.split(':');
      const d = new Date();
      d.setHours(parseInt(hour), 0, 0);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // It's "YYYY-MM-DD HH:00"
    const [datePart, timePart] = label.split(' ');
    const dateStr = formatTickDate(datePart);
    if (!timePart) return dateStr;
    const [hour] = timePart.split(':');
    const d = new Date();
    d.setHours(parseInt(hour), 0, 0);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateStr} ${timeStr}`;
  };

  // --- Data Preparation ---

  // 1. Plays Over Time
  const playsOverTimeData = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => {
      const key = viewMode === 'aggregate' 
        ? e.date 
        : `${e.date} ${e.hour.toString().padStart(2, '0')}:00`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [entries, viewMode]);

  // 2. Scores Over Time (Scatter)
  const scoresOverTimeData = useMemo(() => {
    return [...entries]
      .sort((a, b) => a.timestampMs - b.timestampMs)
      .map((e) => {
        const d = new Date(e.timestampMs);
        const timeOfDayMs = d.getHours() * 3600000 + d.getMinutes() * 60000 + d.getSeconds() * 1000;
        return {
          timestampMs: viewMode === 'aggregate' ? timeOfDayMs : e.timestampMs,
          score: e.score,
          category: e.category,
        };
      });
  }, [entries, viewMode]);

  // 3. Plays by Hour
  const playsByHourData = useMemo(() => {
    if (viewMode === 'aggregate') {
      return Object.entries(aggregatedData.playsPerHour).map(([hour, count]) => ({
        label: `${hour}:00`,
        count,
      }));
    } else {
      const counts: Record<string, number> = {};
      entries.forEach(e => {
        const key = `${e.date} ${e.hour.toString().padStart(2, '0')}:00`;
        counts[key] = (counts[key] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }, [aggregatedData.playsPerHour, entries, viewMode]);

  // 4. Category Comparison
  const categoryComparisonData = useMemo(() => {
    return Object.keys(aggregatedData.playsPerCategory).map((cat) => {
      const catEntries = entries.filter((e) => e.category === cat);
      const totalScore = catEntries.reduce((sum, e) => sum + e.score, 0);
      const avgScore = catEntries.length > 0 ? totalScore / catEntries.length : 0;
      return {
        category: cat,
        plays: aggregatedData.playsPerCategory[cat],
        highestScore: aggregatedData.highestScorePerCategory[cat],
        avgScore: Math.round(avgScore),
      };
    });
  }, [entries, aggregatedData]);

  // 5. Score Distribution (Histogram approximation)
  const scoreDistributionData = useMemo(() => {
    if (entries.length === 0) return [];
    
    const scores = entries.map(e => e.score);
    let min = Math.min(...scores);
    let max = Math.max(...scores);
    
    // Ensure even numbers
    min = Math.floor(min / 2) * 2;
    max = Math.ceil(max / 2) * 2;
    if (max === min) max += 2;

    const bucketCount = 10;
    let bucketSize = Math.max(2, Math.ceil((max - min) / bucketCount));
    if (bucketSize % 2 !== 0) bucketSize += 1;
    
    const buckets = Array.from({ length: bucketCount }, (_, i) => {
      const bMin = min + i * bucketSize;
      const bMax = min + (i + 1) * bucketSize - 1;
      return {
        range: `${bMin}-${bMax}`,
        minVal: bMin,
        count: 0
      };
    });

    scores.forEach(score => {
      const bucketIndex = Math.min(
        Math.floor((score - min) / bucketSize),
        bucketCount - 1
      );
      if (buckets[bucketIndex]) {
        buckets[bucketIndex].count++;
      }
    });

    return buckets.filter(b => b.count > 0);
  }, [entries]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex p-1 border rounded-lg bg-slate-900 border-slate-700">
          <button
            onClick={() => setViewMode('aggregate')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'aggregate' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aggregate All Days
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'detailed' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            By Day + Hour
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Plays Over Time */}
        <div className="p-6 border rounded-xl border-slate-700/50 bg-slate-800/30 backdrop-blur-md">
          <h3 className="mb-6 text-lg font-semibold text-slate-200">Plays Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={playsOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8' }} 
                  tickFormatter={(val, i) => {
                    const formatted = viewMode === 'aggregate' ? formatTickDate(val) : formatLabel(val);
                    if (viewMode === 'aggregate') return formatted;
                    // For detailed view, show fewer ticks to avoid clutter
                    return i % Math.ceil(playsOverTimeData.length / 6) === 0 ? formatted : '';
                  }}
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  content={<CustomTooltip />} 
                  labelFormatter={(label) => viewMode === 'aggregate' ? formatTickDate(label as string) : formatLabel(label as string)}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Plays"
                  stroke="#00D4FF"
                  strokeWidth={3}
                  dot={{ fill: '#00D4FF', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* Scores Over Time */}
      <div className="p-6 border rounded-xl border-slate-700/50 bg-slate-800/30 backdrop-blur-md">
        <h3 className="mb-6 text-lg font-semibold text-slate-200">Scores Progression</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="timestampMs" 
                type="number"
                domain={['dataMin', 'dataMax']}
                name="Time" 
                stroke="#94a3b8" 
                tick={{ fill: '#94a3b8' }} 
                tickFormatter={(val) => formatTimestamp(val, viewMode)}
              />
              <YAxis dataKey="score" name="Score" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <ZAxis range={[30, 30]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={<CustomTooltip />} 
                labelFormatter={(label) => formatTimestamp(label as number, viewMode)}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              {/* Group by category for different colors */}
              {Array.from<string>(new Set(scoresOverTimeData.map(d => d.category))).map((cat, index) => (
                <Scatter 
                  key={cat} 
                  name={cat} 
                  data={scoresOverTimeData.filter(d => d.category === cat)} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plays by Hour */}
      <div className="p-6 border rounded-xl border-slate-700/50 bg-slate-800/30 backdrop-blur-md">
        <h3 className="mb-6 text-lg font-semibold text-slate-200">Activity by Hour</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={playsByHourData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="label" 
                stroke="#94a3b8" 
                tick={{ fill: '#94a3b8' }} 
                tickFormatter={(val, i) => {
                  const formatted = formatLabel(val);
                  if (viewMode === 'aggregate') return formatted;
                  return i % Math.ceil(playsByHourData.length / 6) === 0 ? formatted : '';
                }}
              />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: '#334155', opacity: 0.4 }} 
                labelFormatter={(label) => formatLabel(label as string)}
              />
              <Bar dataKey="count" name="Plays" radius={[4, 4, 0, 0]}>
                {playsByHourData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[1]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Comparison */}
      <div className="p-6 border rounded-xl border-slate-700/50 bg-slate-800/30 backdrop-blur-md">
        <h3 className="mb-6 text-lg font-semibold text-slate-200">Category Comparison</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="category" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="avgScore" name="Avg Score" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="highestScore" name="Max Score" fill={COLORS[4]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Score Distribution */}
      <div className="p-6 border lg:col-span-2 rounded-xl border-slate-700/50 bg-slate-800/30 backdrop-blur-md">
        <h3 className="mb-6 text-lg font-semibold text-slate-200">Score Distribution</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="range" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
              <Bar dataKey="count" name="Frequency" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
    </div>
  );
};

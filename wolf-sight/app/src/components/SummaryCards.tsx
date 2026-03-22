import React from 'react';
import { AggregatedData } from '../types';
import { Activity, Clock, Trophy, Target, Hash, BarChart2 } from 'lucide-react';

interface SummaryCardsProps {
  data: AggregatedData;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const cards = [
    {
      title: 'Total Plays',
      value: data.totalPlays.toLocaleString(),
      icon: <Activity className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-600/20',
      border: 'border-cyan-500/30',
    },
    {
      title: 'Highest Score',
      value: data.highestScoreOverall.toLocaleString(),
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      color: 'from-yellow-500/20 to-orange-600/20',
      border: 'border-yellow-500/30',
    },
    {
      title: 'Average Score',
      value: Math.round(data.averageScore).toLocaleString(),
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500/20 to-green-600/20',
      border: 'border-emerald-500/30',
    },
    {
      title: 'Busiest Hour',
      value: formatHour(data.busiestHour),
      icon: <Clock className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-500/20 to-fuchsia-600/20',
      border: 'border-purple-500/30',
    },
    {
      title: 'Slowest Hour',
      value: formatHour(data.slowestHour),
      icon: <Hash className="w-6 h-6 text-slate-400" />,
      color: 'from-slate-500/20 to-gray-600/20',
      border: 'border-slate-500/30',
    },
    {
      title: 'Categories Played',
      value: Object.keys(data.playsPerCategory).length,
      icon: <BarChart2 className="w-6 h-6 text-pink-400" />,
      color: 'from-pink-500/20 to-rose-600/20',
      border: 'border-pink-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-xl border ${card.border} bg-gradient-to-br ${card.color} p-6 shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-xl`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-300">{card.title}</h3>
            <div className="p-2 rounded-lg bg-slate-900/50">{card.icon}</div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold tracking-tight text-white">
              {card.value}
            </span>
          </div>
          <div className="absolute inset-0 border-2 border-transparent rounded-xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Search, TrendingUp, Calendar, Dumbbell, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useWeight } from '../hooks/useWeight';
import { cn } from '../lib/utils';

export function ExercisesPage() {
  const { exercises, workouts } = useStore();
  const { formatWeight, toDisplay, unit } = useWeight();
  const [search, setSearch] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showHistoryOnly, setShowHistoryOnly] = useState(false);

  // Get list of exercises that have history
  const exercisesWithHistory = new Set<string>();
  workouts.forEach(w => {
    w.exercises.forEach(e => exercisesWithHistory.add(e.exerciseId));
  });

  const filteredExercises = exercises.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(search.toLowerCase()) || 
      e.muscleGroups.some(mg => mg.toLowerCase().includes(search.toLowerCase())) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesHistory = !showHistoryOnly || exercisesWithHistory.has(e.id);

    return matchesSearch && matchesCategory && matchesHistory;
  });

  const getExerciseHistory = (exerciseId: string) => {
    const history: { date: string; volume: number; maxWeight: number; displayMaxWeight: number }[] = [];
    
    // Sort workouts by date ascending
    const sortedWorkouts = [...workouts].sort((a, b) => a.startTime - b.startTime);

    sortedWorkouts.forEach(w => {
      const ex = w.exercises.find(e => e.exerciseId === exerciseId);
      if (ex) {
        const maxWeight = Math.max(...ex.sets.map(s => s.weight || 0));
        const volume = ex.sets.reduce((acc, s) => acc + (s.weight || 0) * (s.reps || 0), 0);
        history.push({
          date: format(new Date(w.startTime), 'MMM d'),
          volume,
          maxWeight,
          displayMaxWeight: Math.round(toDisplay(maxWeight) || 0)
        });
      }
    });
    return history;
  };

  const getRecentStats = (exerciseId: string) => {
    const history = getExerciseHistory(exerciseId);
    if (history.length === 0) return null;
    return history[history.length - 1];
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'upper_body', label: 'Upper' },
    { id: 'lower_body', label: 'Lower' },
    { id: 'core', label: 'Core' },
    { id: 'cardio', label: 'Cardio' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-2xl font-bold font-display mb-4">Exercises</h1>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search exercises..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                  selectedCategory === cat.id
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistoryOnly(!showHistoryOnly)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                showHistoryOnly
                  ? "bg-purple-500/20 text-purple-400 border-purple-500/50"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
              )}
            >
              <Filter className="w-3 h-3" />
              Performed Only
            </button>
          </div>
        </div>
      </header>

      {selectedExerciseId ? (
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedExerciseId(null)}
            className="text-sm text-cyan-400 hover:underline mb-2"
          >
            ← Back to list
          </button>
          
          {(() => {
            const exercise = exercises.find(e => e.id === selectedExerciseId);
            const recentStats = getRecentStats(selectedExerciseId);
            const history = getExerciseHistory(selectedExerciseId);

            return (
              <>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold font-display">{exercise?.name}</h2>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full uppercase">
                    {exercise?.category.replace('_', ' ')}
                  </span>
                </div>

                {recentStats ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-cyan-900/20 border-cyan-500/30">
                      <div className="flex items-center gap-2 text-cyan-400 mb-1">
                        <Dumbbell className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Recent Max</span>
                      </div>
                      <div className="text-3xl font-display font-bold text-white">
                        {recentStats.displayMaxWeight}<span className="text-sm text-slate-400 ml-1">{unit}</span>
                      </div>
                    </Card>
                    <Card className="bg-slate-800/50">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Last Session</span>
                      </div>
                      <div className="text-lg font-medium text-white">
                        {recentStats.date}
                      </div>
                    </Card>
                  </div>
                ) : (
                  <Card className="p-4 text-center text-slate-500">
                    No history recorded yet.
                  </Card>
                )}

                {history.length > 0 && (
                  <Card className="p-4">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase">Progress Over Time</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history}>
                          <XAxis dataKey="date" stroke="#475569" fontSize={12} />
                          <YAxis stroke="#475569" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                            itemStyle={{ color: '#06b6d4' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="displayMaxWeight" 
                            stroke="#06b6d4" 
                            strokeWidth={3}
                            dot={{ fill: '#06b6d4', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-2">Max Weight ({unit}) over time</p>
                  </Card>
                )}
              </>
            );
          })()}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              hoverEffect 
              className="flex justify-between items-center"
              onClick={() => setSelectedExerciseId(exercise.id)}
            >
              <div>
                <h3 className="font-medium">{exercise.name}</h3>
                <div className="flex gap-2 mt-1">
                  {exercise.muscleGroups.slice(0, 2).map(mg => (
                    <span key={mg} className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded capitalize">
                      {mg.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <TrendingUp className={cn(
                "w-4 h-4",
                exercisesWithHistory.has(exercise.id) ? "text-cyan-400" : "text-slate-700"
              )} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

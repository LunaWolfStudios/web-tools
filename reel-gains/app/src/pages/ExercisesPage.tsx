import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, TrendingUp, Calendar, Dumbbell, Filter, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useWeight } from '../hooks/useWeight';

export function ExercisesPage() {
  const { exercises, workouts, settings, toggleUnits } = useStore();
  const [search, setSearch] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showHistoryOnly, setShowHistoryOnly] = useState(false);

  const filteredExercises = exercises.filter(e => {
    const nameMatch = e.name?.toLowerCase().includes(search.toLowerCase()) ?? false;
    const muscleMatch = e.muscleGroups?.some(mg => mg?.toLowerCase().includes(search.toLowerCase())) ?? false;
    const categoryMatch = e.category?.toLowerCase().includes(search.toLowerCase()) ?? false;
    
    const matchesSearch = nameMatch || muscleMatch || categoryMatch;
    
    const matchesCategory = filterCategory ? e.category === filterCategory : true;
    
    const matchesHistory = showHistoryOnly ? workouts.some(w => w.exercises.some(ex => ex.exerciseId === e.id)) : true;

    return matchesSearch && matchesCategory && matchesHistory;
  });

  const getExerciseHistory = (exerciseId: string) => {
    const history: { date: string; volume: number; maxWeight: number }[] = [];
    
    // Sort workouts by date ascending
    const sortedWorkouts = [...workouts].sort((a, b) => a.startTime - b.startTime);

    sortedWorkouts.forEach(w => {
      const ex = w.exercises.find(e => e.exerciseId === exerciseId);
      if (ex && ex.sets.length > 0) {
        const maxWeight = Math.max(...ex.sets.map(s => s.weight || 0));
        const volume = ex.sets.reduce((acc, s) => acc + (s.weight || 0) * (s.reps || 0), 0);
        history.push({
          date: format(new Date(w.startTime), 'MMM d'),
          volume,
          maxWeight: maxWeight === -Infinity ? 0 : maxWeight
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

  const categories = ['upper_body', 'lower_body', 'core', 'cardio'];

  return (
    <div className="space-y-6 pb-20">
      <header>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold font-display">Exercises</h1>
          <Button variant="ghost" size="sm" onClick={toggleUnits} className="text-xs text-slate-400 uppercase">
            <Scale className="w-3 h-3 mr-1" />
            {settings.units}
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search exercises..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowHistoryOnly(!showHistoryOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              showHistoryOnly 
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
            }`}
          >
            Recent
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
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
            
            // Convert history data for chart if needed
            const chartData = history.map(h => {
              // We can't call useWeight inside a callback/loop if it's a hook.
              // Assuming useWeight is a hook that accesses store/context.
              // Instead, we should use a helper function or calculate it directly based on settings.
              // Since we have settings from useStore at the top level:
              let displayWeight = h.maxWeight;
              if (settings.units === 'lb') {
                displayWeight = Math.round(h.maxWeight * 2.20462);
              }
              
              return {
                ...h,
                displayWeight
              };
            });
            
            let recentMaxDisplay = 0;
            let recentMaxUnit = settings.units;
            
            if (recentStats?.maxWeight) {
               if (settings.units === 'lb') {
                 recentMaxDisplay = Math.round(recentStats.maxWeight * 2.20462);
               } else {
                 recentMaxDisplay = recentStats.maxWeight;
               }
            }

            return (
              <>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold font-display">{exercise?.name || 'Unknown Exercise'}</h2>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full uppercase">
                    {exercise?.category?.replace('_', ' ') || 'Uncategorized'}
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
                        {recentMaxDisplay}<span className="text-sm text-slate-400 ml-1">{recentMaxUnit}</span>
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
                        <LineChart data={chartData}>
                          <XAxis dataKey="date" stroke="#475569" fontSize={12} />
                          <YAxis stroke="#475569" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                            itemStyle={{ color: '#06b6d4' }}
                            formatter={(value: number) => [`${value} ${settings.units}`, 'Max Weight']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="displayWeight" 
                            stroke="#06b6d4" 
                            strokeWidth={3}
                            dot={{ fill: '#06b6d4', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
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
              <TrendingUp className="w-4 h-4 text-slate-600" />
            </Card>
          ))}
          {filteredExercises.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              <p>No exercises found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

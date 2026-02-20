import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Plus, Trash2, Check, X, Clock, Save, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function ActiveWorkoutPage() {
  const { 
    activeWorkout, 
    finishWorkout, 
    cancelWorkout, 
    addExerciseToActiveWorkout,
    removeExerciseFromActiveWorkout,
    addSetToActiveExercise,
    removeSetFromActiveExercise,
    updateSetInActiveExercise,
    updateActiveWorkout,
    exercises: allExercises,
    settings
  } = useStore();
  
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Timer
  useEffect(() => {
    if (!activeWorkout) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - activeWorkout.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  if (!activeWorkout) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h2 className="text-xl font-bold mb-4">No Active Workout</h2>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    finishWorkout();
    navigate('/');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this workout? Progress will be lost.')) {
      cancelWorkout();
      navigate('/');
    }
  };

  // Filter exercises for the add modal
  const filteredExercises = allExercises.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-32 min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight">{activeWorkout.name}</h1>
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-mono">
              <Clock className="w-3 h-3" />
              {formatTime(elapsedTime)}
            </div>
          </div>
        </div>
      </header>

      {/* Exercise List */}
      <div className="p-4 space-y-6">
        <Card className="p-3 bg-slate-900/50 border-slate-800 space-y-3">
           <div>
             <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Notes</label>
             <textarea
               placeholder="Workout notes..."
               className="w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none resize-none"
               rows={2}
               value={activeWorkout.notes || ''}
               onChange={(e) => updateActiveWorkout({ notes: e.target.value })}
             />
           </div>
           <div>
             <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Body Weight ({settings.units})</label>
             <input
               type="number"
               placeholder={`0 ${settings.units}`}
               className="w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none"
               value={activeWorkout.bodyWeight || ''}
               onChange={(e) => updateActiveWorkout({ bodyWeight: parseFloat(e.target.value) })}
             />
           </div>
        </Card>

        <AnimatePresence>
          {activeWorkout.exercises.map((workoutExercise, index) => {
            const exerciseDef = allExercises.find(e => e.id === workoutExercise.exerciseId);
            return (
              <motion.div
                key={workoutExercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-cyan-500 overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{exerciseDef?.name || 'Unknown Exercise'}</h3>
                    <button 
                      onClick={() => removeExerciseFromActiveWorkout(workoutExercise.id)}
                      className="text-slate-600 hover:text-red-400 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sets Header */}
                  <div className="grid grid-cols-10 gap-2 mb-2 text-xs text-slate-500 uppercase font-bold text-center">
                    <div className="col-span-1">Set</div>
                    <div className="col-span-3">{settings.units}</div>
                    <div className="col-span-3">Reps</div>
                    <div className="col-span-3">Done</div>
                  </div>

                  {/* Sets Rows */}
                  <div className="space-y-2">
                    {workoutExercise.sets.map((set, setIndex) => (
                      <div key={set.id} className={cn(
                        "grid grid-cols-10 gap-2 items-center",
                        set.completed && "opacity-50"
                      )}>
                        <div className="col-span-1 flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-400">
                            {setIndex + 1}
                          </div>
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-sm focus:border-cyan-500 outline-none"
                            placeholder="0"
                            value={settings.units === 'lb' && set.weight ? Math.round(set.weight * 2.20462) : (set.weight || '')}
                            onChange={(e) => {
                              let val = Number(e.target.value);
                              if (settings.units === 'lb') {
                                val = val / 2.20462;
                              }
                              updateSetInActiveExercise(workoutExercise.id, set.id, { weight: val });
                            }}
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-sm focus:border-cyan-500 outline-none"
                            placeholder="0"
                            value={set.reps || ''}
                            onChange={(e) => updateSetInActiveExercise(workoutExercise.id, set.id, { reps: Number(e.target.value) })}
                          />
                        </div>
                        <div className="col-span-3 flex justify-center gap-1">
                          <button
                            onClick={() => updateSetInActiveExercise(workoutExercise.id, set.id, { completed: !set.completed })}
                            className={cn(
                              "flex-1 h-9 rounded-lg flex items-center justify-center transition-colors",
                              set.completed ? "bg-green-500/20 text-green-500 border border-green-500/50" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            )}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeSetFromActiveExercise(workoutExercise.id, set.id)}
                            className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-4 border-t border-white/5 rounded-t-none"
                    onClick={() => addSetToActiveExercise(workoutExercise.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Set
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <Button 
          variant="outline" 
          className="w-full py-4 border-dashed border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50"
          onClick={() => setIsAddingExercise(true)}
        >
          <Plus className="w-5 h-5 mr-2" /> Add Exercise
        </Button>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-lg border-t border-white/10 flex flex-col gap-3 max-w-md mx-auto">
        <Button className="w-full shadow-[0_0_20px_rgba(6,182,212,0.4)]" size="lg" onClick={handleFinish}>
          <Save className="w-5 h-5 mr-2" /> Finish Workout
        </Button>
        <button 
          onClick={handleCancel}
          className="w-full py-2 text-xs text-red-500 hover:text-red-400 transition-colors"
        >
          Cancel Workout
        </button>
      </div>

      {/* Add Exercise Modal */}
      {isAddingExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col">
          <div className="p-4 border-b border-white/10 flex gap-3 items-center">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
            <button onClick={() => setIsAddingExercise(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredExercises.map(exercise => (
              <button
                key={exercise.id}
                className="w-full text-left p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-colors flex justify-between items-center group"
                onClick={() => {
                  addExerciseToActiveWorkout(exercise.id);
                  setIsAddingExercise(false);
                  setSearchQuery('');
                }}
              >
                <span className="font-medium group-hover:text-cyan-400">{exercise.name}</span>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">{exercise.muscleGroup}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchInput({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <div className="relative flex-1">
      <input
        autoFocus
        type="text"
        placeholder="Search exercises..."
        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-4 py-3 text-white focus:border-cyan-500 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

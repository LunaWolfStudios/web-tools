import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Plus, Trash2, Check, X, ArrowLeft, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { Workout, WorkoutExercise } from '../types';

export function EditWorkoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workouts, updateWorkout, exercises: allExercises, settings } = useStore();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const found = workouts.find(w => w.id === id);
    if (found) {
      setWorkout(JSON.parse(JSON.stringify(found))); // Deep copy to edit locally
    } else {
      navigate('/');
    }
  }, [id, workouts, navigate]);

  if (!workout) return null;

  const handleSave = () => {
    if (workout) {
      updateWorkout(workout.id, workout);
      navigate('/');
    }
  };

  const updateSet = (exerciseId: string, setId: string, updates: any) => {
    setWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(e => {
          if (e.id === exerciseId) {
            return {
              ...e,
              sets: e.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
            };
          }
          return e;
        })
      };
    });
  };

  const addSet = (exerciseId: string) => {
    setWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(e => {
          if (e.id === exerciseId) {
            const lastSet = e.sets[e.sets.length - 1];
            return {
              ...e,
              sets: [...e.sets, {
                id: uuidv4(),
                reps: lastSet?.reps || 0,
                weight: lastSet?.weight || 0,
                completed: true
              }]
            };
          }
          return e;
        })
      };
    });
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(e => {
          if (e.id === exerciseId) {
            return {
              ...e,
              sets: e.sets.filter(s => s.id !== setId)
            };
          }
          return e;
        })
      };
    });
  };

  const removeExercise = (exerciseId: string) => {
    setWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.filter(e => e.id !== exerciseId)
      };
    });
  };

  const addExercise = (exerciseDefId: string) => {
    const newExercise: WorkoutExercise = {
      id: uuidv4(),
      exerciseId: exerciseDefId,
      sets: [{ id: uuidv4(), reps: 0, weight: 0, completed: true }]
    };
    
    setWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: [...prev.exercises, newExercise]
      };
    });
    setIsAddingExercise(false);
    setSearchQuery('');
  };

  const filteredExercises = allExercises.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setWorkout(prev => prev ? { ...prev, startTime: date.getTime() } : null);
    }
  };

  // ... (rest of the functions)

  return (
    <div className="pb-32 min-h-screen relative">
      {/* ... (header) ... */}
      <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg leading-tight">Edit Workout</h1>
        </div>
        <Button size="sm" onClick={handleSave}>Save</Button>
      </header>

      <div className="p-4 space-y-6">
        <Card className="p-3 bg-slate-900/50 border-slate-800 space-y-3">
           <div>
             <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Workout Name</label>
             <input
               type="text"
               className="w-full bg-transparent text-lg font-bold text-white focus:outline-none"
               value={workout.name}
               onChange={(e) => setWorkout({...workout, name: e.target.value})}
             />
           </div>
           <div>
             <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Start Time</label>
             <input
               type="datetime-local"
               className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
               value={new Date(workout.startTime).toISOString().slice(0, 16)}
               onChange={handleDateChange}
             />
           </div>
           <div>
             <label className="text-xs text-slate-500 uppercase font-bold block mb-1">End Time</label>
             <input
               type="datetime-local"
               className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
               value={workout.endTime ? new Date(workout.endTime).toISOString().slice(0, 16) : ''}
               onChange={(e) => {
                 const date = new Date(e.target.value);
                 if (!isNaN(date.getTime())) {
                   setWorkout(prev => prev ? { ...prev, endTime: date.getTime() } : null);
                 }
               }}
             />
           </div>
        </Card>

        <Card className="p-3 bg-slate-900/50 border-slate-800 space-y-3">
           <div>
             <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Notes</label>
             <textarea
               placeholder="Workout notes..."
               className="w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none resize-none"
               rows={2}
               value={workout.notes || ''}
               onChange={(e) => setWorkout({...workout, notes: e.target.value})}
             />
           </div>
           <div>
             <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Body Weight ({settings.units})</label>
             <input
               type="number"
               placeholder={`0 ${settings.units}`}
               className="w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none"
               value={workout.bodyWeight || ''}
               onChange={(e) => setWorkout({...workout, bodyWeight: parseFloat(e.target.value) })}
             />
           </div>
        </Card>

        <AnimatePresence>
          {workout.exercises.map((workoutExercise, index) => {
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
                  {/* ... (exercise header) ... */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{exerciseDef?.name || 'Unknown Exercise'}</h3>
                    <button 
                      onClick={() => removeExercise(workoutExercise.id)}
                      className="text-slate-600 hover:text-red-400 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-10 gap-2 mb-2 text-xs text-slate-500 uppercase font-bold text-center">
                    <div className="col-span-1">Set</div>
                    <div className="col-span-3">{settings.units}</div>
                    <div className="col-span-3">Reps</div>
                    <div className="col-span-3">Action</div>
                  </div>

                  <div className="space-y-2">
                    {workoutExercise.sets.map((set, setIndex) => (
                      <div key={set.id} className="grid grid-cols-10 gap-2 items-center">
                        <div className="col-span-1 flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-400">
                            {setIndex + 1}
                          </div>
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-sm focus:border-cyan-500 outline-none"
                            value={settings.units === 'lb' && set.weight ? Math.round(set.weight * 2.20462) : (set.weight || '')}
                            onChange={(e) => {
                              let val = Number(e.target.value);
                              if (settings.units === 'lb') {
                                val = val / 2.20462;
                              }
                              updateSet(workoutExercise.id, set.id, { weight: val });
                            }}
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-sm focus:border-cyan-500 outline-none"
                            value={set.reps || ''}
                            onChange={(e) => updateSet(workoutExercise.id, set.id, { reps: Number(e.target.value) })}
                          />
                        </div>
                        <div className="col-span-3 flex justify-center gap-1">
                          <button
                            onClick={() => removeSet(workoutExercise.id, set.id)}
                            className="p-2 text-slate-600 hover:text-red-400"
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
                    onClick={() => addSet(workoutExercise.id)}
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

      {isAddingExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col">
          <div className="p-4 border-b border-white/10 flex gap-3 items-center">
            <input
              autoFocus
              type="text"
              placeholder="Search exercises..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-4 py-3 text-white focus:border-cyan-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setIsAddingExercise(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredExercises.map(exercise => (
              <button
                key={exercise.id}
                className="w-full text-left p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-colors flex justify-between items-center group"
                onClick={() => addExercise(exercise.id)}
              >
                <span className="font-medium group-hover:text-cyan-400">{exercise.name}</span>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">{exercise.muscleGroups[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

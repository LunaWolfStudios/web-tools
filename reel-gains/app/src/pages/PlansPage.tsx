import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Play, Edit2, X, Search, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Plan } from '../types';

export function PlansPage() {
  const { plans, addPlan, updatePlan, deletePlan, startWorkout, exercises } = useStore();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingPlanId(null);
    setPlanName('');
    setSelectedExercises([]);
  };

  const handleStartEdit = (plan: Plan) => {
    setIsCreating(true);
    setEditingPlanId(plan.id);
    setPlanName(plan.name);
    setSelectedExercises(plan.exercises.map(e => e.exerciseId));
  };

  const handleSavePlan = () => {
    if (!planName.trim()) return;

    const planExercises = selectedExercises.map(exId => ({
      exerciseId: exId,
      defaultSets: 3, // Default values
      defaultReps: 10
    }));

    if (editingPlanId) {
      updatePlan(editingPlanId, {
        name: planName,
        exercises: planExercises
      });
    } else {
      addPlan({
        id: uuidv4(),
        name: planName,
        exercises: planExercises,
      });
    }

    setIsCreating(false);
    setEditingPlanId(null);
    setPlanName('');
    setSelectedExercises([]);
  };

  const handleStartPlan = (planId: string) => {
    startWorkout(planId);
    navigate('/workout/active');
  };

  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const filteredExercises = exercises.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCreating) {
    return (
      <div className="space-y-6 pb-20">
        <header className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)}>
            <X className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold font-display">
            {editingPlanId ? 'Edit Plan' : 'Create Plan'}
          </h1>
        </header>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Plan Name</label>
            <input
              type="text"
              placeholder="e.g., Upper Body Power"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">Select Exercises ({selectedExercises.length})</label>
            
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search exercises..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="h-96 overflow-y-auto space-y-2 pr-1">
              {filteredExercises.map(exercise => {
                const isSelected = selectedExercises.includes(exercise.id);
                return (
                  <div 
                    key={exercise.id}
                    onClick={() => toggleExerciseSelection(exercise.id)}
                    className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-colors ${
                      isSelected 
                        ? 'bg-cyan-900/20 border-cyan-500/50' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className={`font-medium ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                        {exercise.name}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">{exercise.muscleGroups[0]}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="fixed bottom-20 md:bottom-24 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-lg border-t border-white/10 flex gap-4 max-w-md mx-auto z-10">
          <Button className="w-full" size="lg" onClick={handleSavePlan}>
            Save Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display">Workout Plans</h1>
        <Button size="sm" variant="outline" onClick={handleStartCreate}>
          <Plus className="w-4 h-4 mr-1" /> New
        </Button>
      </header>

      <div className="grid gap-4">
        {plans.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <p>No plans created yet.</p>
            <Button variant="ghost" className="mt-2 text-cyan-400" onClick={handleStartCreate}>
              Create your first plan
            </Button>
          </div>
        ) : (
          plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-cyan-400">{plan.name}</h3>
                  <p className="text-xs text-slate-500">{plan.exercises.length} Exercises</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {plan.exercises.slice(0, 3).map(pe => {
                      const ex = exercises.find(e => e.id === pe.exerciseId);
                      return ex ? (
                        <span key={pe.exerciseId} className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                          {ex.name}
                        </span>
                      ) : null;
                    })}
                    {plan.exercises.length > 3 && (
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                        +{plan.exercises.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleStartEdit(plan)}
                    className="p-2 text-slate-600 hover:text-cyan-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Delete this plan?')) deletePlan(plan.id);
                    }}
                    className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                variant="secondary"
                onClick={() => handleStartPlan(plan.id)}
              >
                <Play className="w-4 h-4 mr-2" /> Start this Plan
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

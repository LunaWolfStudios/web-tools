import React, { useState } from 'react';
import { Heatmap } from '../components/workouts/Heatmap';
import { WorkoutList } from '../components/workouts/WorkoutList';
import { BodyWeightChart } from '../components/workouts/BodyWeightChart';
import { Button } from '../components/ui/Button';
import { Plus, X, Play, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';

export function WorkoutsPage() {
  const navigate = useNavigate();
  const { startWorkout, activeWorkout, plans, settings, toggleUnits } = useStore();
  const [showStartModal, setShowStartModal] = useState(false);

  const handleStartEmpty = () => {
    startWorkout();
    navigate('/workout/active');
  };

  const handleStartPlan = (planId: string) => {
    startWorkout(planId);
    navigate('/workout/active');
  };

  return (
    <div className="space-y-8 pb-20 relative">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Reel Gains
          </h1>
          <p className="text-slate-400 text-sm">Track your progress</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleUnits} className="text-xs text-slate-400 uppercase">
            <Scale className="w-3 h-3 mr-1" />
            {settings.units}
          </Button>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="font-display font-bold text-cyan-400">RG</span>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Consistency</h2>
        <div className="flex justify-center">
          <Heatmap />
        </div>
      </section>

      <BodyWeightChart />

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Workouts</h2>
        </div>
        <WorkoutList />
      </section>

      {!activeWorkout && (
        <div className="fixed bottom-20 right-4 left-4 flex justify-center pointer-events-none z-20">
          <Button 
            size="lg" 
            className="pointer-events-auto shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-bounce-slow"
            onClick={() => setShowStartModal(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Start Workout
          </Button>
        </div>
      )}

      {showStartModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Start Workout</h2>
              <button onClick={() => setShowStartModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <Button 
              className="w-full h-14 text-lg" 
              onClick={handleStartEmpty}
            >
              <Plus className="w-5 h-5 mr-2" />
              Start Empty Workout
            </Button>

            {plans.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-slate-500 uppercase font-bold mt-4 mb-2">Or start from a plan</div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {plans.map(plan => (
                    <Card 
                      key={plan.id} 
                      className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-800 border-slate-800"
                      onClick={() => handleStartPlan(plan.id)}
                    >
                      <span className="font-medium">{plan.name}</span>
                      <Play className="w-4 h-4 text-cyan-400" />
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

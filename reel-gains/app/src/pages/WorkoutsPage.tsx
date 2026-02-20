import React from 'react';
import { Heatmap } from '../components/workouts/Heatmap';
import { WorkoutList } from '../components/workouts/WorkoutList';
import { Button } from '../components/ui/Button';
import { Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function WorkoutsPage() {
  const navigate = useNavigate();
  const { startWorkout, activeWorkout, settings, toggleUnit } = useStore();

  const handleStartEmpty = () => {
    startWorkout();
    navigate('/workout/active');
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Reel Gains
          </h1>
          <p className="text-slate-400 text-sm">Track your progress</p>
        </div>
        <button 
          onClick={toggleUnit}
          className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400 hover:bg-slate-700 transition-colors"
        >
          {settings.unit.toUpperCase()}
        </button>
      </header>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Consistency</h2>
        <div className="flex justify-center">
          <Heatmap />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Workouts</h2>
        </div>
        <WorkoutList />
      </section>

      {!activeWorkout && (
        <div className="fixed bottom-20 right-4 left-4 flex justify-center pointer-events-none">
          <Button 
            size="lg" 
            className="pointer-events-auto shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-bounce-slow"
            onClick={handleStartEmpty}
          >
            <Plus className="w-5 h-5 mr-2" />
            Start Workout
          </Button>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { Heatmap } from '../components/workouts/Heatmap';
import { WorkoutList } from '../components/workouts/WorkoutList';
import { BodyWeightChart } from '../components/workouts/BodyWeightChart';
import { Button } from '../components/ui/Button';
import { Plus, X, Play, Scale, User, Download, Upload, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';

export function WorkoutsPage() {
  const navigate = useNavigate();
  const { startWorkout, activeWorkout, plans, settings, toggleUnits, setUserName, importData } = useStore();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartEmpty = () => {
    startWorkout();
    navigate('/workout/active');
  };

  const handleStartPlan = (planId: string) => {
    startWorkout(planId);
    navigate('/workout/active');
  };

  const handleExport = () => {
    const state = useStore.getState();
    const dataStr = JSON.stringify({
      workouts: state.workouts,
      plans: state.plans,
      exercises: state.exercises,
      settings: state.settings
    }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reel-gains-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (window.confirm('This will replace all your current data. Are you sure?')) {
          importData(data);
          alert('Data imported successfully!');
          setShowProfileModal(false);
        }
      } catch (error) {
        alert('Failed to import data. Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-20 relative">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Reel Gains
          </h1>
          <p className="text-slate-400 text-sm">Track every rep. Catch every gain.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleUnits} className="text-xs text-slate-400 uppercase">
            <Scale className="w-3 h-3 mr-1" />
            {settings.units}
          </Button>
          <button 
            onClick={() => setShowProfileModal(true)}
            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-cyan-500 transition-colors overflow-hidden"
          >
            {settings.userName ? (
              <span className="font-display font-bold text-cyan-400 text-sm">
                {settings.userName.slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <User className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {/* ... (rest of the component) ... */}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Settings
              </h2>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold block mb-2">Display Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                  value={settings.userName || ''}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <label className="text-xs text-slate-500 uppercase font-bold block mb-2">Data Management</label>
                
                <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data (Backup)
                </Button>

                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    className="hidden"
                  />
                  <Button variant="outline" className="w-full justify-start" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data (Restore)
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Importing will replace all current workouts and settings.
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button className="w-full" onClick={() => setShowProfileModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

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
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <h2 className="text-xl font-bold">Start Workout</h2>
              <button onClick={() => setShowStartModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <Button 
              className="w-full h-14 text-lg shrink-0" 
              onClick={handleStartEmpty}
            >
              <Plus className="w-5 h-5 mr-2" />
              Start Empty Workout
            </Button>

            {plans.length > 0 && (
              <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
                <div className="text-xs text-slate-500 uppercase font-bold mt-4 mb-2 shrink-0">Or start from a plan</div>
                <div className="overflow-y-auto space-y-2 pr-1">
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

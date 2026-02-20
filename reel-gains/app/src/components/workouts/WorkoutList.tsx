import React from 'react';
import { format } from 'date-fns';
import { Dumbbell, Calendar, Clock, Trash2, Edit2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useWeight } from '../../hooks/useWeight';

export function WorkoutList() {
  const { workouts, deleteWorkout, settings } = useStore();
  const navigate = useNavigate();

  if (workouts.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>No workouts yet. Start one today!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => {
        const totalVolume = workout.exercises.reduce((acc, ex) => {
          return acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight || 0) * (s.reps || 0), 0);
        }, 0);

        const duration = workout.endTime 
          ? Math.round((workout.endTime - workout.startTime) / 60000) 
          : 0;

        const bodyWeight = useWeight(workout.bodyWeight);

        return (
          <Card key={workout.id} hoverEffect className="flex justify-between items-center group relative pr-20">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">
                {workout.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(workout.startTime), 'MMM d, h:mm a')}
                </span>
                {duration > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {duration} min
                  </span>
                )}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {workout.exercises.length} Exercises • {totalVolume.toLocaleString()}kg Vol
                {workout.bodyWeight && (
                  <span> • {bodyWeight.value} {bodyWeight.unit} BW</span>
                )}
              </div>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/workout/edit/${workout.id}`);
                }}
                className="p-2 text-slate-600 hover:text-cyan-400 transition-colors"
                title="Edit Workout"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if(window.confirm('Delete this workout?')) deleteWorkout(workout.id);
                }}
                className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                title="Delete Workout"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

import { NavLink, useLocation } from 'react-router-dom';
import { Dumbbell, Calendar, List, Play } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';

export function Navbar() {
  const { activeWorkout } = useStore();
  const location = useLocation();

  // Hide navbar if in active workout mode, unless we want to allow navigation away
  // Usually active workout takes over the screen.
  const isActiveWorkoutPage = location.pathname === '/workout/active';
  if (isActiveWorkoutPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-t border-white/5 pb-safe">
      {activeWorkout && (
        <div className="absolute -top-14 left-4 right-4">
          <NavLink to="/workout/active">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-cyan-500/10 border border-cyan-500/50 backdrop-blur-md rounded-xl p-3 flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-medium text-sm">Workout in Progress</span>
              </div>
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            </motion.div>
          </NavLink>
        </div>
      )}
      
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isActive ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
            )
          }
        >
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-medium">Workouts</span>
        </NavLink>

        <NavLink
          to="/plans"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isActive ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
            )
          }
        >
          <List className="w-6 h-6" />
          <span className="text-[10px] font-medium">Plans</span>
        </NavLink>

        <NavLink
          to="/exercises"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isActive ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
            )
          }
        >
          <Dumbbell className="w-6 h-6" />
          <span className="text-[10px] font-medium">Exercises</span>
        </NavLink>
      </div>
    </nav>
  );
}

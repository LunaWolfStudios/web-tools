import React from 'react';
import { eachDayOfInterval, subDays, format, isSameDay, startOfWeek, endOfWeek, eachWeekOfInterval, getDay, startOfMonth } from 'date-fns';
import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';

export function Heatmap() {
  const { workouts } = useStore();
  const today = new Date();
  
  // Calculate total workouts
  const totalWorkouts = workouts.length;

  // Generate last ~4 months (16 weeks) to ensure it fits nicely
  // We want to end on the current week
  const endDate = endOfWeek(today);
  const startDate = startOfWeek(subDays(today, 16 * 7)); // 16 weeks back

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weeks = eachWeekOfInterval({
    start: startDate,
    end: endDate,
  });

  const getIntensity = (date: Date) => {
    const dayWorkouts = workouts.filter(w => isSameDay(new Date(w.startTime), date));
    if (dayWorkouts.length === 0) return 'bg-slate-800/50';
    if (dayWorkouts.length === 1) return 'bg-cyan-900';
    return 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]';
  };

  // Group days by week for column-based rendering
  const weeksData = weeks.map(weekStart => {
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(weekStart)
    });
    return {
      start: weekStart,
      days: weekDays
    };
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2 px-1">
        <div className="text-xs text-slate-500">
          <span className="text-cyan-400 font-bold text-lg mr-1">{totalWorkouts}</span>
          workouts total
        </div>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-1 min-w-max mx-auto justify-center">
          {weeksData.map((week, i) => {
            const isNewMonth = i === 0 || format(week.start, 'MMM') !== format(weeksData[i-1].start, 'MMM');
            
            return (
              <div key={week.start.toISOString()} className="flex flex-col gap-1 relative pt-4">
                {isNewMonth && (
                  <span className="absolute top-0 left-0 text-[9px] text-slate-500 font-medium uppercase">
                    {format(week.start, 'MMM')}
                  </span>
                )}
                {week.days.map((day) => (
                  <motion.div
                    key={day.toISOString()}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-3 h-3 rounded-sm ${getIntensity(day)}`}
                    title={format(day, 'MMM d, yyyy')}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

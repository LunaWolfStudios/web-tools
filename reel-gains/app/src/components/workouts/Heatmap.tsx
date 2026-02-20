import React from 'react';
import { eachDayOfInterval, subDays, format, isSameDay, startOfWeek, endOfWeek, eachWeekOfInterval, getDay } from 'date-fns';
import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';

export function Heatmap() {
  const { workouts } = useStore();
  const today = new Date();
  
  // Calculate the start date to show exactly 16 weeks (approx 4 months) ending today
  // We want to start on a Sunday (or Monday depending on locale, but let's assume Sunday for visual consistency)
  const endDate = today;
  const startDate = subDays(today, 119); // 17 weeks * 7 days = 119 days roughly

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getIntensity = (date: Date) => {
    const dayWorkouts = workouts.filter(w => isSameDay(new Date(w.startTime), date));
    if (dayWorkouts.length === 0) return 'bg-slate-800/50';
    if (dayWorkouts.length === 1) return 'bg-cyan-900';
    return 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]';
  };

  // Group days by weeks for better column alignment
  const weeks = [];
  let currentWeek = [];
  
  // Pad the beginning if startDate is not Sunday
  const startDay = getDay(startDate);
  for (let i = 0; i < startDay; i++) {
    currentWeek.push(null);
  }

  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Generate month labels
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, index) => {
    const firstDayOfWeek = week.find(d => d !== null);
    if (firstDayOfWeek) {
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ index, label: format(firstDayOfWeek, 'MMM') });
        lastMonth = month;
      }
    }
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full overflow-x-auto pb-2 flex justify-center">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 h-4 relative mb-1">
            {monthLabels.map((m, i) => (
              <span 
                key={i} 
                className="absolute text-[10px] text-slate-500 font-medium"
                style={{ left: `${m.index * 14}px` }} // 12px width + 2px gap approx
              >
                {m.label}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  day ? (
                    <motion.div
                      key={day.toISOString()}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-2.5 h-2.5 rounded-[2px] ${getIntensity(day)}`}
                      title={`${format(day, 'MMM d, yyyy')}: ${workouts.filter(w => isSameDay(new Date(w.startTime), day)).length} workouts`}
                    />
                  ) : (
                    <div key={`empty-${weekIndex}-${dayIndex}`} className="w-2.5 h-2.5" />
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full max-w-[300px] text-xs text-slate-500 mt-2 px-1">
        <span>Total Workouts: <span className="text-cyan-400 font-bold">{workouts.length}</span></span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="w-2 h-2 bg-slate-800/50 rounded-[1px]" />
          <div className="w-2 h-2 bg-cyan-900 rounded-[1px]" />
          <div className="w-2 h-2 bg-cyan-500 rounded-[1px]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

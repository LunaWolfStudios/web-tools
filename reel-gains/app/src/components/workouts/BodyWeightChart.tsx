import React from 'react';
import { useStore } from '../../store/useStore';
import { Card } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useWeight } from '../../hooks/useWeight';

export function BodyWeightChart() {
  const { workouts, settings } = useStore();

  const data = workouts
    .filter(w => w.bodyWeight && w.bodyWeight > 0)
    .sort((a, b) => a.startTime - b.startTime)
    .map(w => {
      const weight = useWeight(w.bodyWeight);
      return {
        date: format(new Date(w.startTime), 'MMM d'),
        weight: weight.value,
        fullDate: format(new Date(w.startTime), 'MMM d, yyyy')
      };
    });

  if (data.length < 2) return null;

  return (
    <Card className="p-4">
      <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Body Weight Trend</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="date" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              width={30}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#06b6d4', fontSize: '12px' }}
              labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
              formatter={(value: number) => [`${value} ${settings.units}`, 'Weight']}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#06b6d4" 
              strokeWidth={2}
              dot={{ fill: '#06b6d4', r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

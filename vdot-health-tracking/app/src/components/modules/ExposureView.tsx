import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { mockExposures } from '@/src/lib/mockData';
import { Flame, Ear, Droplets, Wind, Plus, Activity, Filter, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const exposureStats = [
  { district: 'Bristol', Low: 7, Medium: 3, High: 2 },
  { district: 'Salem', Low: 3, Medium: 2, High: 0 },
  { district: 'Richmond', Low: 10, Medium: 8, High: 6 },
  { district: 'Lynchburg', Low: 2, Medium: 1, High: 0 },
  { district: 'Hampton', Low: 8, Medium: 6, High: 4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-xl shrink-0">
        <p className="font-semibold text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-xs mb-1">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
             <span className="text-muted-foreground">{entry.name}:</span>
             <span className="font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs font-semibold">
           <span>Total:</span>
           <span>{payload.reduce((sum: number, entry: any) => sum + entry.value, 0)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function ExposureView() {
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exposure Management</h2>
          <p className="text-muted-foreground mt-1">Track and analyze chemical, physical, and environmental exposures.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-card border border-border rounded-md text-sm font-medium flex items-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm flex items-center shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Log Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Col: Timeline */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col bg-card border-border shadow-sm min-h-0">
          <CardHeader className="border-b border-border py-4 px-6 shrink-0 bg-muted/20">
            <CardTitle>Recent Exposure Events</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <div className="divide-y divide-border">
              {mockExposures.map(exp => (
                <div key={exp.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="mt-1 shrink-0 p-2.5 bg-muted rounded-xl">
                        {exp.type === 'Chemical' && <Flame className="w-5 h-5 text-orange-500" />}
                        {exp.type === 'Noise' && <Ear className="w-5 h-5 text-blue-500" />}
                        {exp.type === 'Biological' && <Droplets className="w-5 h-5 text-emerald-500" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold">{exp.id}</h4>
                          <Badge variant="outline" className="text-[10px] uppercase">{exp.type}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {exp.location}</span>
                          <span>•</span>
                          <span>{format(exp.date, 'MMM d, yyyy')}</span>
                          <span>•</span>
                          <span>{exp.employeesInvolved} Personnel Involved</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      exp.severity === 'High' ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none border-destructive/20' :
                      exp.severity === 'Medium' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 shadow-none border-orange-500/20' :
                      'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-emerald-500/20'
                    }>
                      {exp.severity} Severity
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Col: Analytics & Heatmap */}
        <div className="col-span-1 flex flex-col gap-6">
          <Card className="bg-card border-border shadow-sm flex-1 min-h-[300px] flex flex-col">
             <CardHeader className="border-b border-border py-4 px-6 shrink-0 bg-muted/20">
              <CardTitle>Severity Distribution (YTD)</CardTitle>
              <CardDescription>Exposure events by district and severity level</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 min-h-[250px] relative">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exposureStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="district" stroke="currentColor" className="opacity-50 text-[10px]" axisLine={false} tickLine={false} />
                  <YAxis stroke="currentColor" className="opacity-50 text-[10px]" axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Low" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Medium" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="High" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 shadow-sm shrink-0">
             <CardHeader className="py-4 px-6 pb-2">
              <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                <Activity className="w-4 h-4" />
                AI Risk Assessment
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2 text-sm text-muted-foreground leading-relaxed">
              Detected anomaly in <span className="text-foreground font-medium">Richmond District</span>. Chemical exposure events are up <span className="text-destructive font-medium">18%</span> compared to previous quarter. Recommending immediate review of Route 460 handling procedures.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

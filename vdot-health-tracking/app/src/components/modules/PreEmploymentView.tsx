import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Stethoscope, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function PreEmploymentView() {
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pre-Employment Exams</h2>
          <p className="text-muted-foreground mt-1">Track candidate medical evaluations prior to onboarding.</p>
        </div>
        <Button>Request Exam</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card className="col-span-1 lg:col-span-2 shadow-sm rounded-2xl bg-card border-border flex flex-col">
          <CardHeader className="border-b border-border bg-muted/20 pb-4">
            <CardTitle>Candidates Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-auto flex-1">
            <div className="divide-y divide-border">
              {[
                { name: 'John Miller', role: 'Heavy Equipment Operator', status: 'Cleared', date: 'Oct 24, 2023', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { name: 'Sarah Connor', role: 'Bridge Inspector', status: 'In Progress', date: 'Oct 26, 2023', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { name: 'Michael Chang', role: 'Maintenance Worker', status: 'Hold', date: 'Oct 20, 2023', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { name: 'Emily Davis', role: 'Electrical Engineer', status: 'Scheduled', date: 'Nov 02, 2023', icon: Stethoscope, color: 'text-primary', bg: 'bg-primary/10' },
              ].map((c, i) => (
                <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${c.bg} ${c.color}`}>
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{c.date}</p>
                    <Badge variant="outline" className={`w-24 justify-center ${c.color} border-${c.color.split('-')[1]}/30`}>{c.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm rounded-2xl bg-card border-border flex flex-col">
          <CardHeader className="border-b border-border bg-muted/20 pb-4">
            <CardTitle>Needs Review</CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-auto flex-1 space-y-4">
            <div className="p-4 bg-muted/30 rounded-xl border border-border">
              <p className="text-sm font-semibold mb-1">M. Chang - Medical Hold</p>
              <p className="text-xs text-muted-foreground mb-3">Additional documentation required from primary care physician regarding back injury history.</p>
              <Button size="sm" variant="outline" className="w-full text-xs">Review Case File</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

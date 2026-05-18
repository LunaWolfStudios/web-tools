import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { AlertCircle, CheckCircle2, Search, TrendingUp, Calendar, Info } from 'lucide-react';
import { mockAlerts, mockUpcomingExams } from '@/src/lib/mockData';
import { format } from 'date-fns';
import { InfoTooltip } from '@/src/components/InfoTooltip';

export default function DashboardView() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            Compliance Overview
            <InfoTooltip 
              title="Compliance Overview" 
              description="Aggregated view of health & safety compliance across all VDOT districts."
              oshaRef="29 CFR 1904.32 - Annual Summary"
              aiNote="Compliance is up 2.4% this quarter, driven by improved recertification rates in Salem."
            />
          </h2>
          <p className="text-muted-foreground mt-1">Real-time health & safety metrics across all districts.</p>
        </div>
        <div className="flex space-x-2">

          <Badge variant="outline" className="text-sm px-3 py-1 font-medium bg-background border-border">
            OSHA Reporting Ready
          </Badge>
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/50 text-sm px-3 py-1 font-medium">
            Generate Snapshot
          </Badge>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,281</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">88.4%</div>
            <div className="h-1.5 w-full bg-muted mt-2 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88.4%' }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Exams</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">142</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate action
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Exposures</CardTitle>
            <ActivityIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Reported past 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Left Column: Charts and Heatmap */}
        <div className="col-span-4 space-y-4">
          <Card className="bg-card/50 border-border shadow-sm h-[400px] flex flex-col rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>District Compliance Heatmap</CardTitle>
                <CardDescription>Percentage of compliant records across key categories</CardDescription>
              </div>
              <div className="flex gap-3 text-[10px] uppercase font-bold tracking-wider items-center bg-card p-2 rounded-lg border border-border/50">
                 <div className="flex items-center gap-1.5 opacity-90"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> &ge;95%</div>
                 <div className="flex items-center gap-1.5 opacity-90"><div className="w-3 h-3 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.5)]"></div> 90-94%</div>
                 <div className="flex items-center gap-1.5 opacity-90"><div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div> 80-89%</div>
                 <div className="flex items-center gap-1.5 opacity-90"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div> &lt;80%</div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-x-auto min-w-0">
              <div className="min-w-[500px] h-full flex flex-col p-6">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">District</div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Overall</div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Medical Exams</div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Fit Testing</div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Training</div>
                </div>
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 pb-2">
                  {[
                    { district: 'Bristol', overall: 82, exams: 85, fitTest: 81, training: 88 },
                    { district: 'Salem', overall: 96, exams: 98, fitTest: 95, training: 99 },
                    { district: 'Lynchburg', overall: 88, exams: 85, fitTest: 88, training: 91 },
                    { district: 'Richmond', overall: 91, exams: 94, fitTest: 90, training: 92 },
                    { district: 'Hampton', overall: 78, exams: 80, fitTest: 70, training: 82 },
                    { district: 'Fredericksburg', overall: 90, exams: 91, fitTest: 88, training: 94 },
                    { district: 'Culpeper', overall: 85, exams: 86, fitTest: 81, training: 88 },
                    { district: 'Staunton', overall: 93, exams: 95, fitTest: 89, training: 96 },
                    { district: 'NOVA', overall: 81, exams: 82, fitTest: 78, training: 85 },
                  ].map((row, i) => {
                    const getColor = (val: number) => {
                      if (val >= 95) return 'bg-emerald-500 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_1px_3px_rgba(16,185,129,0.3)] hover:brightness-110';
                      if (val >= 90) return 'bg-lime-400 text-lime-950 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_1px_3px_rgba(163,230,53,0.3)] hover:brightness-105';
                      if (val >= 80) return 'bg-orange-500 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_1px_3px_rgba(249,115,22,0.3)] hover:brightness-110';
                      return 'bg-rose-500 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_1px_3px_rgba(244,63,94,0.3)] hover:brightness-110';
                    };
                    
                    return (
                      <div key={i} className="grid grid-cols-5 gap-2 items-center group">
                        <div className="text-sm font-medium pl-1">{row.district}</div>
                        <div className={`rounded-xl py-2.5 px-2 text-center text-sm font-bold transition-all cursor-pointer ${getColor(row.overall)}`}>
                          {row.overall}%
                        </div>
                        <div className={`rounded-xl py-2.5 px-2 text-center text-sm font-bold transition-all cursor-pointer ${getColor(row.exams)}`}>
                          {row.exams}%
                        </div>
                        <div className={`rounded-xl py-2.5 px-2 text-center text-sm font-bold transition-all cursor-pointer ${getColor(row.fitTest)}`}>
                          {row.fitTest}%
                        </div>
                        <div className={`rounded-xl py-2.5 px-2 text-center text-sm font-bold transition-all cursor-pointer ${getColor(row.training)}`}>
                          {row.training}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Alerts & Schedules */}
        <div className="col-span-3 space-y-4">
          
          <Card className="bg-card border-border shadow-sm rounded-xl">
            <CardHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between">
              <CardTitle>High Priority Alerts</CardTitle>
              <Badge variant="destructive" className="ml-ml-auto">3 New</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {mockAlerts.map(alert => (
                  <div key={alert.id} className="p-4 flex gap-4 hover:bg-muted/50 transition-colors">
                    <div className="shrink-0 mt-0.5">
                      {alert.type === 'Critical' ? <AlertCircle className="h-5 w-5 text-destructive" /> : 
                       alert.type === 'Warning' ? <AlertTriangleIcon className="h-5 w-5 text-orange-500" /> : 
                       <Info className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(alert.date, 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm flex-1 rounded-2xl">
            <CardHeader className="px-6 py-4 border-b border-border">
              <CardTitle>Upcoming Scheduled Events</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {mockUpcomingExams.slice(0, 4).map(exam => (
                  <div key={exam.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{exam.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{exam.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{format(exam.date, 'MMM d')}</p>
                      <Badge variant="outline" className="mt-1 text-[10px] uppercase tracking-wider">{exam.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Icon helpers to avoid too many imports in one line above
function UsersIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}

function ShieldCheckIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 6.5 2a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
}

function ActivityIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
}

function AlertTriangleIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
}

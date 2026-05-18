import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Ear, CheckCircle2, AlertTriangle, Activity, Info } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';

const recentResults = [
  { id: 'AUD-001', name: 'John Miller', date: 'Oct 14, 2026', leftShift: 5, rightShift: 5, status: 'Pass', sts: false },
  { id: 'AUD-002', name: 'Sarah Connor', date: 'Oct 13, 2026', leftShift: 15, rightShift: 5, status: 'Retest', sts: true },
  { id: 'AUD-003', name: 'Michael Chang', date: 'Oct 12, 2026', leftShift: 0, rightShift: 0, status: 'Pass', sts: false },
  { id: 'AUD-004', name: 'Emily Davis', date: 'Oct 10, 2026', leftShift: 25, rightShift: 30, status: 'Fail', sts: true },
  { id: 'AUD-005', name: 'David Wilson', date: 'Oct 09, 2026', leftShift: 10, rightShift: 10, status: 'Pass', sts: false },
];

const mockShiftData = [
  { group: '0-5 dB', count: 120 },
  { group: '5-10 dB', count: 45 },
  { group: '10-15 dB', count: 12 },
  { group: '15+ dB', count: 4 },
];

export default function AudiogramView() {
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audiogram Tracking</h2>
          <p className="text-muted-foreground mt-1">Hearing conservation program compliance and threshold shifts.</p>
        </div>
        <Button className="bg-primary text-primary-foreground">Import Results CSV</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <Card className="shadow-sm rounded-2xl bg-card border-border">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Screened (YTD)</p>
              <h3 className="text-3xl font-bold text-foreground">842</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Activity className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm rounded-2xl bg-card border-border border-l-4 border-l-destructive">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">STS Detected</p>
              <h3 className="text-3xl font-bold text-destructive">16</h3>
            </div>
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-2xl bg-card border-border border-l-4 border-l-emerald-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Passed Standards</p>
              <h3 className="text-3xl font-bold text-emerald-500">826</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Results Data Table */}
        <Card className="col-span-1 lg:col-span-2 shadow-sm rounded-2xl bg-card border-border flex flex-col min-h-0">
          <CardHeader className="bg-muted/20 border-b border-border py-4 px-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent Test Results</CardTitle>
              <CardDescription>Records processed via automated import.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-background">OSHA 1910.95 Mode</Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto flex-1 w-full">
            <table className="w-full text-left text-sm whitespace-nowrap border-collapse min-w-[700px]">
              <thead className="bg-muted/50 text-muted-foreground sticky top-0 z-10 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Test Date</th>
                  <th className="px-6 py-4 font-medium">Left Shift</th>
                  <th className="px-6 py-4 font-medium">Right Shift</th>
                  <th className="px-6 py-4 font-medium">STS Alert</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentResults.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{r.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.date}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{r.leftShift} dB</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{r.rightShift} dB</td>
                    <td className="px-6 py-4">
                      {r.sts ? (
                        <span className="flex items-center text-destructive text-xs font-semibold">
                          <AlertTriangle className="w-4 h-4 mr-1" /> Shift Detected
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Normal</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge className={
                        r.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 shadow-none' :
                        r.status === 'Retest' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20 shadow-none' :
                        'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 shadow-none'
                      }>
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Dashboard Visualization */}
        <div className="col-span-1 flex flex-col gap-6 overflow-auto">
          <Card className="shadow-sm rounded-2xl bg-card border-border shrink-0 max-h-80 flex flex-col">
            <CardHeader className="bg-muted/20 border-b border-border py-4">
              <CardTitle className="text-base flex items-center">
                <Ear className="w-4 h-4 mr-2 text-primary" /> Shift Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col items-center justify-center">
               <ResponsiveContainer width="100%" height={150}>
                <BarChart data={mockShiftData}>
                  <XAxis dataKey="group" stroke="currentColor" className="text-xs opacity-50" axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: 'currentColor', opacity: 0.05 }} contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {mockShiftData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 ? 'var(--color-destructive)' : index === 2 ? 'var(--color-orange-500)' : 'var(--color-primary)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-[10px] text-muted-foreground flex justify-between w-full text-center px-4">
                <p>Standard Threshold Shift (STS): Average change of 10dB or more.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm rounded-2xl bg-primary/10 border-primary/20 shrink-0">
            <CardContent className="p-4 flex gap-4 items-start">
              <Info className="w-5 h-5 text-primary shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-primary mb-1">OSHA Required Action</h4>
                <p className="text-xs text-primary/80 leading-relaxed">
                  16 employees show potential STS. They must be re-tested within 30 days. If the shift persists, written notification must be distributed within 21 days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

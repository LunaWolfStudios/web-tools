import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { ShieldCheck, Calendar, Filter, Plus, MailWarning } from 'lucide-react';

const mockFitTests = [
  { id: 'FT-891', employee: 'Alice Johnson', testDate: '2026-03-12', nextDue: '2027-03-12', make: '3M', model: '6000 Half Face', size: 'Medium', protocol: 'Quantitative (Portacount)', pass: true },
  { id: 'FT-890', employee: 'Bob Smith', testDate: '2026-10-15', nextDue: '2027-10-15', make: 'Honeywell', model: 'North 7700', size: 'Large', protocol: 'Qualitative (Saccharin)', pass: true },
  { id: 'FT-889', employee: 'Charlie Davis', testDate: '2025-08-30', nextDue: '2026-08-30', make: '3M', model: '8210 N95', size: 'Standard', protocol: 'Qualitative (Bitrex)', pass: false },
  { id: 'FT-888', employee: 'Diana Evans', testDate: '2025-09-10', nextDue: '2026-09-10', make: '3M', model: '6000 Half Face', size: 'Small', protocol: 'Quantitative (Portacount)', pass: true },
  { id: 'FT-887', employee: 'Evan Harris', testDate: '2025-05-05', nextDue: '2026-05-05', make: 'MSA', model: 'Advantage 200', size: 'Medium', protocol: 'Quantitative (Portacount)', pass: true },
];

export default function FitTestingView() {
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fit Testing</h2>
          <p className="text-muted-foreground mt-1">Manage respirator equipment assignments and compliance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-card text-muted-foreground border-border hover:text-foreground">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Record Fit Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <Card className="bg-card shadow-sm border-border rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Clearances (Current Year)</p>
            <h3 className="text-3xl font-bold text-foreground">1,245</h3>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border rounded-xl border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Expiring within 30 Days</p>
            <h3 className="text-3xl font-bold text-orange-500">42</h3>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border rounded-xl border-l-4 border-l-destructive">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Expired / Overdue</p>
            <h3 className="text-3xl font-bold text-destructive">18</h3>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 shadow-sm border-primary/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
          <CardContent className="p-6 text-center text-primary font-medium flex flex-col items-center">
             <MailWarning className="w-6 h-6 mb-2" />
             Notify Overdue Personnel
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 shadow-sm rounded-2xl bg-card border-border flex flex-col min-h-0">
        <CardHeader className="border-b border-border bg-muted/20 pb-4">
          <CardTitle>Recent Fit Testing Reports</CardTitle>
          <CardDescription>Records track respirator assignment and OSHA compliant annual re-testing.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground sticky top-0 z-10 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Test Date</th>
                <th className="px-6 py-4 font-medium">Equip. Make/Model</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium">Protocol</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
                <th className="px-6 py-4 font-medium text-center">Next Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockFitTests.map(ft => (
                <tr key={ft.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{ft.employee}</td>
                  <td className="px-6 py-4 text-muted-foreground">{ft.testDate}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="font-semibold text-foreground">{ft.make}</span> {ft.model}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-muted">{ft.size}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs truncate max-w-[200px]">{ft.protocol}</td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant="outline" className={ft.pass ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-destructive text-destructive bg-destructive/10'}>
                      {ft.pass ? 'PASS' : 'FAIL'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Simplified overdue check based on hardcoded dates */}
                    {new Date(ft.nextDue) < new Date('2026-10-01') ? (
                      <span className="text-destructive font-mono font-bold">{ft.nextDue}</span>
                    ) : (
                      <span className="text-emerald-500 font-mono font-medium">{ft.nextDue}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

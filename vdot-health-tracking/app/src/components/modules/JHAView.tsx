import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { FileWarning, ShieldAlert, ArrowRight } from 'lucide-react';

export default function JHAView() {
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Hazard Analysis (JHA)</h2>
          <p className="text-muted-foreground mt-1">Connect job roles with specific occupational risk profiles.</p>
        </div>
        <Button>Create New JHA</Button>
      </div>

      <Card className="shadow-sm rounded-2xl bg-card border-border flex-1 flex flex-col min-h-0">
         <CardHeader className="border-b border-border bg-muted/20 pb-4">
          <CardTitle>Role-to-Hazard Matrix (Mock)</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 sticky top-0 z-10 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground w-1/4">Job Code / Role</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Primary Hazards</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Required PPE</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right w-24">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { role: 'Bridge Inspector', hazards: ['Fall from height', 'Traffic', 'Lead paint exposure'], ppe: ['Harness', 'Hi-Vis', 'Respirator'], risk: 'High' },
                { role: 'Heavy Equipment Op', hazards: ['Noise', 'Vibration', 'Dust'], ppe: ['Hearing Protection', 'Safety Glasses'], risk: 'Medium' },
                { role: 'Traffic Controller', hazards: ['High-speed traffic', 'Heat stress'], ppe: ['Hi-Vis Class 3', 'Cooling Vest'], risk: 'High' },
                { role: 'Maintenance Admin', hazards: ['Ergonomics', 'Slips/Trips'], ppe: ['Standard'], risk: 'Low' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{r.role}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {r.hazards.map((h, j) => <Badge key={j} variant="outline" className="bg-muted/50">{h}</Badge>)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{r.ppe.join(', ')}</td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant="outline" className={
                      r.risk === 'High' ? 'border-destructive text-destructive' :
                      r.risk === 'Medium' ? 'border-orange-500 text-orange-500' :
                      'border-emerald-500 text-emerald-500'
                    }>{r.risk}</Badge>
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

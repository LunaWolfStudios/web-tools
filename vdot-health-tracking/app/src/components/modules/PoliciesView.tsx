import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { FileSignature, Filter, Send, Download } from 'lucide-react';

const mockPolicies = [
  { 
    id: 1, 
    date: 'Oct 15, 2026', 
    title: 'Lead Exposure Limits Update in Construction', 
    ref: 'OSHA 29 CFR 1926.62 Revision', 
    summary: 'Adjusted permissible exposure limit (PEL) for lead. Requires immediate acknowledgment from all district workers.',
    signaturesCompleted: 4200,
    signaturesTotal: 5000,
    status: 'active'
  },
  { 
    id: 2, 
    date: 'Sep 22, 2026', 
    title: 'Heat Illness Prevention Protocol v4', 
    ref: 'VDOT internal directive #442', 
    summary: 'Mandatory water/rest/shade cycles enforced during heat waves. Added new hazard matrix for summer months.',
    signaturesCompleted: 4950,
    signaturesTotal: 5000,
    status: 'completed'
  },
  { 
    id: 3, 
    date: 'Aug 05, 2026', 
    title: 'Silica Dust Control Operations Standard', 
    ref: 'OSHA 1926.1153', 
    summary: 'Updates respiratory protection requirements and fit testing standards for silica dust exposure in field stations.',
    signaturesCompleted: 5000,
    signaturesTotal: 5000,
    status: 'completed'
  }
];

export default function PoliciesView() {
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Policy Updates</h2>
          <p className="text-muted-foreground mt-1">Manage safety protocols and digital acknowledgments in real-time.</p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <FileSignature className="w-4 h-4 mr-2" /> Publish New Policy
        </Button>
      </div>

      <div className="flex-1 overflow-auto space-y-6 pb-6">
        {mockPolicies.map(policy => {
          const percent = Math.round((policy.signaturesCompleted / policy.signaturesTotal) * 100);
          const isComplete = percent === 100;

          return (
            <Card key={policy.id} className="bg-card shadow-sm border-border rounded-xl overflow-hidden flex flex-col md:flex-row relative">
              {/* Status Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${isComplete ? 'bg-emerald-500' : 'bg-primary'}`}></div>
              
              <div className="p-6 md:w-3/5 flex flex-col border-b md:border-b-0 md:border-r border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground bg-muted/50 border-border">
                    {policy.date}
                  </Badge>
                  {isComplete ? (
                     <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-transparent font-medium">Archived</Badge>
                  ) : (
                     <Badge className="bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-transparent font-medium">Signatures Required</Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{policy.title}</h3>
                <p className="text-xs font-mono text-chart-4 mb-3">{policy.ref}</p>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {policy.summary}
                </p>
                
                <div className="mt-4 flex gap-3">
                  <Button variant="outline" size="sm" className="text-xs bg-background">View Document</Button>
                  {!isComplete && (
                    <Button variant="outline" size="sm" className="text-xs border-primary text-primary hover:bg-primary/10">Remind Unsigned</Button>
                  )}
                </div>
              </div>

              <div className="p-6 md:w-2/5 flex flex-col justify-center bg-muted/5">
                <div className="mb-2 flex justify-between items-end">
                  <span className="text-sm font-semibold text-foreground">Digital Signatures</span>
                  <span className={`text-2xl font-bold ${isComplete ? 'text-emerald-500' : 'text-primary'}`}>{percent}%</span>
                </div>
                
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-emerald-500' : 'bg-primary'}`} 
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{policy.signaturesCompleted.toLocaleString()} signed</span>
                  <span>{policy.signaturesTotal.toLocaleString()} total</span>
                </div>

                {!isComplete && (
                  <div className="mt-6 p-3 bg-card border border-border rounded-lg shadow-sm text-sm">
                    <p className="font-semibold mb-1 text-foreground">Your Action Required</p>
                    <p className="text-xs text-muted-foreground mb-3">You have not yet acknowledged this policy.</p>
                    <Button className="w-full text-xs">Review & Sign</Button>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  );
}

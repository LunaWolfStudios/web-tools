import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { FileWarning, ShieldAlert, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

export default function JHAView() {
  const [jhas, setJhas] = useState([
    { role: 'Bridge Inspector', hazards: ['Fall from height', 'Traffic', 'Lead paint exposure'], ppe: ['Harness', 'Hi-Vis', 'Respirator'], risk: 'High' },
    { role: 'Heavy Equipment Op', hazards: ['Noise', 'Vibration', 'Dust'], ppe: ['Hearing Protection', 'Safety Glasses'], risk: 'Medium' },
    { role: 'Traffic Controller', hazards: ['High-speed traffic', 'Heat stress'], ppe: ['Hi-Vis Class 3', 'Cooling Vest'], risk: 'High' },
    { role: 'Maintenance Admin', hazards: ['Ergonomics', 'Slips/Trips'], ppe: ['Standard'], risk: 'Low' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newJha, setNewJha] = useState({ role: '', hazards: '', ppe: '', risk: 'Low' });

  const handleCreate = () => {
    if (!newJha.role) return;
    setJhas([
      ...jhas,
      {
        role: newJha.role,
        hazards: newJha.hazards.split(',').map(s => s.trim()).filter(Boolean),
        ppe: newJha.ppe.split(',').map(s => s.trim()).filter(Boolean),
        risk: newJha.risk
      }
    ]);
    setIsDialogOpen(false);
    setNewJha({ role: '', hazards: '', ppe: '', risk: 'Low' });
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Hazard Analysis (JHA)</h2>
          <p className="text-muted-foreground mt-1">Connect job roles with specific occupational risk profiles.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New JHA</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New JHA</DialogTitle>
              <DialogDescription>Add a new job hazard analysis record.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Job Code / Role</Label>
                <Input value={newJha.role} onChange={e => setNewJha({...newJha, role: e.target.value})} placeholder="e.g. Tunnel Inspector" />
              </div>
              <div className="space-y-2">
                <Label>Primary Hazards (comma-separated)</Label>
                <Input value={newJha.hazards} onChange={e => setNewJha({...newJha, hazards: e.target.value})} placeholder="e.g. Poor ventilation, Low light" />
              </div>
              <div className="space-y-2">
                <Label>Required PPE (comma-separated)</Label>
                <Input value={newJha.ppe} onChange={e => setNewJha({...newJha, ppe: e.target.value})} placeholder="e.g. Headlamp, Gas monitor" />
              </div>
              <div className="space-y-2">
                <Label>Risk Level</Label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newJha.risk} 
                  onChange={e => setNewJha({...newJha, risk: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Save JHA</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm rounded-2xl bg-card border-border flex-1 flex flex-col min-h-0">
         <CardHeader className="border-b border-border bg-muted/20 pb-4">
          <CardTitle>Role-to-Hazard Matrix (Mock)</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto flex-1 w-full">
          <table className="w-full text-left text-sm table-auto min-w-[800px]">
            <thead className="bg-muted/50 sticky top-0 z-10 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground w-1/4">Job Code / Role</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Primary Hazards</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Required PPE</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right w-24">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jhas.map((r, i) => (
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

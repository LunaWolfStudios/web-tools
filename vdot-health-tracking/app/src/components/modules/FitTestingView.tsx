import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { ShieldCheck, Calendar, Filter, Plus, MailWarning, Download, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

const initialFitTests = [
  { id: 'FT-891', employee: 'Alice Johnson', testDate: '2026-03-12', nextDue: '2027-03-12', make: '3M', model: '6000 Half Face', size: 'Medium', protocol: 'Quantitative (Portacount)', pass: true },
  { id: 'FT-890', employee: 'Bob Smith', testDate: '2026-10-15', nextDue: '2027-10-15', make: 'Honeywell', model: 'North 7700', size: 'Large', protocol: 'Qualitative (Saccharin)', pass: true },
  { id: 'FT-889', employee: 'Charlie Davis', testDate: '2025-08-30', nextDue: '2026-08-30', make: '3M', model: '8210 N95', size: 'Standard', protocol: 'Qualitative (Bitrex)', pass: false },
  { id: 'FT-888', employee: 'Diana Evans', testDate: '2025-09-10', nextDue: '2026-09-10', make: '3M', model: '6000 Half Face', size: 'Small', protocol: 'Quantitative (Portacount)', pass: true },
  { id: 'FT-887', employee: 'Evan Harris', testDate: '2025-05-05', nextDue: '2026-05-05', make: 'MSA', model: 'Advantage 200', size: 'Medium', protocol: 'Quantitative (Portacount)', pass: true },
];

export default function FitTestingView() {
  const [fitTests, setFitTests] = useState(initialFitTests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFT, setNewFT] = useState({ employee: '', make: '3M', model: '6000 Half Face', size: 'Medium', pass: true });

  const handleRecord = () => {
    if (!newFT.employee) return;
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    setFitTests([
      {
        id: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
        employee: newFT.employee,
        make: newFT.make,
        model: newFT.model,
        size: newFT.size,
        pass: newFT.pass,
        testDate: today,
        nextDue: nextYear.toISOString().split('T')[0],
        protocol: 'Quantitative (Portacount)'
      },
      ...fitTests
    ]);
    setIsDialogOpen(false);
    setNewFT({ employee: '', make: '3M', model: '6000 Half Face', size: 'Medium', pass: true });
  };

  const handleExportCSV = () => {
    const headers = "ID,Employee,Test Date,Next Due,Make,Model,Size,Protocol,Pass\n";
    const csvContent = fitTests.map(f => `${f.id},${f.employee},${f.testDate},${f.nextDue},${f.make},${f.model},${f.size},${f.protocol},${f.pass}`).join("\n");
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fittests_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = () => {
    // Mock import
    const imported = {
      id: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
      employee: 'Imported User',
      testDate: '2026-10-16',
      nextDue: '2027-10-16',
      make: 'MSA',
      model: 'Advantage 200',
      size: 'Large',
      protocol: 'Qualitative (Saccharin)',
      pass: true
    };
    setFitTests([imported, ...fitTests]);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fit Testing</h2>
          <p className="text-muted-foreground mt-1">Manage respirator equipment assignments and compliance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="bg-card text-muted-foreground border-border hover:text-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleImportCSV} className="bg-card text-muted-foreground border-border hover:text-foreground">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> Record Fit Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Fit Test</DialogTitle>
                <DialogDescription>Add a new respirator fit test result.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Employee Name</Label>
                  <Input value={newFT.employee} onChange={e => setNewFT({...newFT, employee: e.target.value})} placeholder="e.g. Dana Scully" />
                </div>
                <div className="space-y-2">
                  <Label>Respirator Make</Label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newFT.make} 
                    onChange={e => setNewFT({...newFT, make: e.target.value})}
                  >
                    <option value="3M">3M</option>
                    <option value="Honeywell">Honeywell</option>
                    <option value="MSA">MSA</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input value={newFT.model} onChange={e => setNewFT({...newFT, model: e.target.value})} placeholder="e.g. 6000 Half Face" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newFT.size} 
                      onChange={e => setNewFT({...newFT, size: e.target.value})}
                    >
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Result</Label>
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newFT.pass ? 'pass' : 'fail'} 
                      onChange={e => setNewFT({...newFT, pass: e.target.value === 'pass'})}
                    >
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleRecord}>Save Record</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <Card className="bg-card shadow-sm border-border rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Clearances (Current Year)</p>
            <h3 className="text-3xl font-bold text-foreground">{1240 + fitTests.length}</h3>
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
            <h3 className="text-3xl font-bold text-destructive">{fitTests.filter(f => new Date(f.nextDue) < new Date('2026-10-01')).length + 16}</h3>
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
        <CardContent className="p-0 overflow-x-auto w-full flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[900px]">
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
              {fitTests.map(ft => (
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

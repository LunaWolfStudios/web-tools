import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { FileBadge, Bell, Filter, MoreHorizontal, MailWarning } from 'lucide-react';

const mockCertifications = [
  { id: 1, name: 'Alice Johnson', type: 'CDL Medical Card', expires: '2027-10-15', status: 'valid' },
  { id: 2, name: 'Bob Smith', type: 'Asbestos Abatement', expires: '2026-12-01', status: 'valid' },
  { id: 3, name: 'Charlie Davis', type: 'Crane Operator Cert', expires: '2026-11-05', status: 'expiring' },
  { id: 4, name: 'Diana Evans', type: 'CDL Medical Card', expires: '2026-10-28', status: 'expiring' },
  { id: 5, name: 'Evan Harris', type: 'First Aid / CPR', expires: '2026-09-15', status: 'overdue' },
];

export default function RecertificationView() {
  const renderCard = (cert: any) => {
    const isOverdue = cert.status === 'overdue';
    const isExpiring = cert.status === 'expiring';

    return (
      <div key={cert.id} className={`p-4 rounded-xl border shadow-sm mb-4 transition-all ${
        isOverdue ? 'bg-destructive/5 border-destructive/30 hover:border-destructive/50' :
        isExpiring ? 'bg-orange-500/5 border-orange-500/30 hover:border-orange-500/50' :
        'bg-card border-border hover:border-primary/50'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className={`text-[10px] uppercase font-bold border-transparent ${
            isOverdue ? 'bg-destructive/20 text-destructive' :
            isExpiring ? 'bg-orange-500/20 text-orange-500' :
            'bg-muted text-muted-foreground'
          }`}>
            {cert.type}
          </Badge>
          <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
        <h4 className="font-semibold text-sm text-foreground mb-1">{cert.name}</h4>
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs">
            <span className="text-muted-foreground">Expires: </span>
            <span className={`font-mono ${isOverdue ? 'text-destructive font-bold' : isExpiring ? 'text-orange-500 font-bold' : 'text-foreground'}`}>
              {cert.expires}
            </span>
          </div>
          {(isOverdue || isExpiring) && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/20">
              <MailWarning className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Medical Recertification</h2>
          <p className="text-muted-foreground mt-1">Kanban board for tracking recurring medical and regulatory certs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-muted-foreground bg-card border-border">
            <Filter className="w-4 h-4 mr-2" /> View All
          </Button>
          <Button className="bg-primary text-primary-foreground">
            <Bell className="w-4 h-4 mr-2" /> Notify Expiring
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-6 overflow-x-auto pb-4">
        
        {/* Valid Column */}
        <div className="w-80 shrink-0 flex flex-col bg-muted/20 border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border bg-card shrink-0 flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
              Active (30+ Days)
            </h3>
            <Badge variant="outline" className="bg-muted border-border font-mono">2</Badge>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {mockCertifications.filter(c => c.status === 'valid').map(renderCard)}
          </div>
        </div>

        {/* Expiring Column */}
        <div className="w-80 shrink-0 flex flex-col bg-orange-500/5 border border-orange-500/20 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-orange-500/20 bg-card shrink-0 flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center">
              <div className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></div>
              Expiring Soon
            </h3>
            <Badge variant="outline" className="bg-orange-500/20 text-orange-500 border-none font-mono">2</Badge>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {mockCertifications.filter(c => c.status === 'expiring').map(renderCard)}
          </div>
        </div>

        {/* Overdue Column */}
        <div className="w-80 shrink-0 flex flex-col bg-destructive/10 border border-destructive/20 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-destructive/20 bg-card shrink-0 flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center">
              <div className="w-2 h-2 rounded-full bg-destructive mr-2"></div>
              Overdue / Action Req.
            </h3>
            <Badge variant="outline" className="bg-destructive/20 text-destructive border-none font-mono">1</Badge>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {mockCertifications.filter(c => c.status === 'overdue').map(renderCard)}
          </div>
        </div>

      </div>
    </div>
  );
}

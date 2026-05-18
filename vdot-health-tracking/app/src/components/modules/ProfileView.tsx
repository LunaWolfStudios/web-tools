import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Mail, Phone, MapPin, Building, ShieldCheck, FileCheck } from 'lucide-react';

export default function ProfileView() {
  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
        </div>
        <Button>Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm rounded-2xl bg-card border-border">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4 border-4 border-background shadow-xl">
              <AvatarImage src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Jenkins" />
              <AvatarFallback className="text-4xl">SJ</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-bold">Sarah Jenkins</h3>
            <p className="text-primary font-medium mb-4">Compliance Officer</p>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-6">
              Tier 2 (Governance)
            </Badge>

            <div className="w-full space-y-3 text-sm text-left">
              <div className="flex items-center text-muted-foreground">
                <Mail className="w-4 h-4 mr-3" />
                <span className="text-foreground">sarah.jenkins@vdot.example.gov</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="w-4 h-4 mr-3" />
                <span className="text-foreground">(555) 123-4567</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Building className="w-4 h-4 mr-3" />
                <span className="text-foreground">Human Resources / OH Division</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-3" />
                <span className="text-foreground">Central Office, Richmond</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm rounded-2xl bg-card border-border">
            <CardHeader>
              <CardTitle>System Privileges</CardTitle>
              <CardDescription>Your current access levels and permissions within the VDOT Health system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/40 rounded-xl border border-border flex gap-4 items-start">
                <div className="p-2 bg-primary/20 rounded-lg text-primary shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Administrative Access</h4>
                  <p className="text-xs text-muted-foreground mt-1">Full read and write access to all employee health records across all districts. Cannot modify core system configurations.</p>
                </div>
              </div>
              <div className="p-4 bg-muted/40 rounded-xl border border-border flex gap-4 items-start">
                <div className="p-2 bg-chart-4/20 rounded-lg text-chart-4 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Audit Compliance Ready</h4>
                  <p className="text-xs text-muted-foreground mt-1">Authorized to generate and export OSHA 300 logs, 300A summaries, and sign off on annual risk assessments.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

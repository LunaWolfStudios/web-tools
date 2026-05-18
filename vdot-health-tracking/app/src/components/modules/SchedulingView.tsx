import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users, Send, UserPlus, Filter } from 'lucide-react';

const mockAppointments = [
  { id: 1, type: 'Audiogram', name: 'John Miller', time: '09:00 AM', day: 14, district: 'Richmond' },
  { id: 2, type: 'Fit Test', name: 'Sarah Connor', time: '10:30 AM', day: 14, district: 'Richmond' },
  { id: 3, type: 'Physical', name: 'Michael Chang', time: '01:00 PM', day: 15, district: 'Salem' },
  { id: 4, type: 'Audiogram', name: 'Emily Davis', time: '08:30 AM', day: 16, district: 'Bristol' },
  { id: 5, type: 'Physical', name: 'David Wilson', time: '11:00 AM', day: 16, district: 'Richmond' },
];

export default function SchedulingView() {
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scheduling & Results</h2>
          <p className="text-muted-foreground mt-1">Manage exams, tests, and automated patient reminders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-muted-foreground bg-card border-border">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button className="bg-primary text-primary-foreground">
            <UserPlus className="w-4 h-4 mr-2" /> New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Calendar Grid */}
        <Card className="col-span-1 lg:col-span-3 shadow-sm rounded-2xl bg-card border-border flex flex-col min-h-0">
          <CardHeader className="border-b border-border bg-muted/20 py-4 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-lg">October 2026</h3>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-background border-border text-foreground"><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-background border-border text-foreground"><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-background p-1 rounded-lg border border-border">
              <button className="px-3 py-1 text-xs font-semibold rounded-md bg-muted text-foreground">Month</button>
              <button className="px-3 py-1 text-xs font-semibold rounded-md text-muted-foreground hover:text-foreground">Week</button>
              <button className="px-3 py-1 text-xs font-semibold rounded-md text-muted-foreground hover:text-foreground">Day</button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto bg-muted/10">
            <div className="grid grid-cols-7 border-b border-border text-center text-xs font-semibold text-muted-foreground bg-background sticky top-0 z-10">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                <div key={d} className="py-2 border-r border-border last:border-0">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 h-[800px] sm:h-full auto-rows-fr">
              {/* Padding offset */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`offset-${i}`} className="border-r border-b border-border bg-muted/5 p-2"></div>
              ))}
              
              {daysInMonth.map(day => {
                const dayAppointments = mockAppointments.filter(a => a.day === day);
                return (
                  <div key={day} className="border-r border-b border-border p-2 min-h-[100px] bg-card hover:bg-muted/10 transition-colors">
                    <span className="text-xs font-medium text-muted-foreground mb-1 block">{day}</span>
                    <div className="space-y-1">
                      {dayAppointments.map(app => (
                        <div 
                          key={app.id} 
                          className="px-2 py-1.5 text-[10px] rounded border shadow-sm cursor-move flex flex-col gap-1 bg-background"
                          style={{ borderColor: app.type === 'Audiogram' ? 'var(--color-primary)' : app.type === 'Fit Test' ? 'var(--color-chart-2)' : 'var(--color-chart-3)' }}
                        >
                          <div className="font-semibold text-foreground truncate">{app.name}</div>
                          <div className="flex items-center justify-between text-muted-foreground opacity-80">
                            <span>{app.time}</span>
                            <span className="truncate max-w-[50px]">{app.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Operations */}
        <div className="col-span-1 flex flex-col gap-6 overflow-auto">
          <Card className="shadow-sm rounded-2xl bg-card border-border shrink-0">
            <CardHeader className="bg-muted/20 border-b border-border py-4">
              <CardTitle className="text-base flex items-center">
                <Users className="w-4 h-4 mr-2 text-primary" />
                Bulk Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="p-3 bg-muted/40 border border-border rounded-xl">
                <h4 className="text-sm font-semibold mb-2 text-foreground">Mobile unit in Richmond</h4>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  14 employees from Richmond district need Audiograms. Bulk assign them to the mobile unit on Oct 20.
                </p>
                <Button className="w-full text-xs" variant="secondary">Bulk Schedule Select</Button>
              </div>

              <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
                <h4 className="text-sm font-semibold mb-2 flex items-center text-primary">
                  <Send className="w-4 h-4 mr-2" /> Automated Reminders
                </h4>
                <p className="text-xs text-primary/80 mb-3 leading-relaxed">
                  Send SMS and Email reminders to 8 employees for tomorrow's appointments.
                </p>
                <Button className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90">Send Reminders</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm rounded-2xl bg-card border-border shrink-0 flex-1 min-h-0 flex flex-col">
            <CardHeader className="bg-muted/20 border-b border-border py-4">
              <CardTitle className="text-base flex items-center">
                <Clock className="w-4 h-4 mr-2 text-chart-4" />
                Pending Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 overflow-auto">
              <div className="p-3 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                 <div className="flex justify-between items-start mb-1">
                   <p className="text-sm font-medium text-foreground">Dr. Smith Clinic</p>
                   <Badge variant="outline" className="text-[10px]">3 Exams</Badge>
                 </div>
                 <p className="text-xs text-muted-foreground mb-2">Awaiting fit test reviews from yesterday.</p>
                 <Button variant="link" className="p-0 h-auto text-xs text-primary">Import Results</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

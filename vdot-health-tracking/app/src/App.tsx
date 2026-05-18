import React, { useState } from 'react';
import { 
  ShieldCheck, Users, Activity, FileWarning, 
  CalendarClock, Ear, FileBadge, BellElectric, 
  Stethoscope, LayoutDashboard, Search, Bell, Bot,
  Menu, X, Sparkles, ChevronRight, AlertTriangle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MODULES = [
  { id: 'dashboard', name: 'Unified Dashboard', icon: LayoutDashboard },
  { id: 'pre-employment', name: 'Pre-Employment exams', icon: Stethoscope },
  { id: 'enrollment', name: 'Employee Registry', icon: Users },
  { id: 'exposure', name: 'Exposure Management', icon: Activity },
  { id: 'jha', name: 'Job Hazard Analysis', icon: FileWarning },
  { id: 'scheduling', name: 'Scheduling & Results', icon: CalendarClock },
  { id: 'audiograms', name: 'Audiogram Tracking', icon: Ear },
  { id: 'recertification', name: 'Medical Recert', icon: FileBadge },
  { id: 'fit-testing', name: 'Fit Testing', icon: ShieldCheck },
  { id: 'policies', name: 'Policy updates', icon: BellElectric },
];

import DashboardView from './components/modules/DashboardView';
import EnrollmentView from './components/modules/EnrollmentView';
import ExposureView from './components/modules/ExposureView';
import PreEmploymentView from './components/modules/PreEmploymentView';
import JHAView from './components/modules/JHAView';
import SchedulingView from './components/modules/SchedulingView';
import AudiogramView from './components/modules/AudiogramView';
import RecertificationView from './components/modules/RecertificationView';
import FitTestingView from './components/modules/FitTestingView';
import PoliciesView from './components/modules/PoliciesView';
import ProfileView from './components/modules/ProfileView';
import ModulePlaceholder from './components/modules/ModulePlaceholder';
import AIAssistantPanel from './components/AIAssistantPanel';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';



export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <aside className={cn(
        "flex flex-col w-64 border-r border-border bg-background transition-all duration-300 z-10 shrink-0 relative",
        !isSidebarOpen && "-ml-64 lg:-ml-0 lg:w-20"
      )}>
        <div className="flex h-16 items-center flex-shrink-0 px-6 border-b border-border bg-card">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-primary-foreground">V</div>
          <span className={cn("ml-3 font-semibold text-lg tracking-tight truncate text-foreground", !isSidebarOpen && "lg:hidden")}>
            VDOT <span className="text-primary font-light">Health</span>
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors border",
                  isActive 
                    ? "bg-primary/10 text-primary border-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("ml-3 truncate", !isSidebarOpen && "lg:hidden")}>{mod.name}</span>
                {isActive && <ChevronRight className={cn("ml-auto w-4 h-4", !isSidebarOpen && "lg:hidden")} />}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setActiveModule('profile')}>
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 rounded-full border border-border">
              <AvatarImage src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Jenkins" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className={cn("text-left", !isSidebarOpen && "lg:hidden")}>
              <p className="font-medium text-xs text-foreground">Sarah Jenkins</p>
              <p className="text-[10px] text-muted-foreground">Compliance Officer</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-[6.5rem] bg-card border border-border rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none hidden lg:block z-50 shadow-sm"
        >
          {isSidebarOpen ? <ChevronRight className="w-4 h-4 rotate-180" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 border-b border-border bg-card px-6 flex items-center justify-between z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 mr-2 text-muted-foreground hover:text-foreground rounded-md focus:outline-none lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold hidden sm:block">
              {MODULES.find(m => m.id === activeModule)?.name}
            </h1>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search employees, records or hazards..." 
                className="pl-9 pr-4 py-1.5 bg-background/50 border border-border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-80 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button 
              onClick={() => setActiveModule('profile')}
              className="relative p-0 text-muted-foreground hover:text-foreground rounded-full transition-colors ml-2">
              <Avatar className="w-8 h-8 rounded-full border border-border">
                <AvatarImage src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Jenkins" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
            </button>
            <button 
              onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all shadow-sm",
                isAIPanelOpen 
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.3)]" 
                  : "bg-background text-foreground border-border hover:bg-muted"
              )}
            >
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:block">AI Assistant</span>
              <Sparkles className="w-3 h-3 text-current opacity-70" />
            </button>
          </div>
        </header>

        {/* Dashboard/Module Content */}
        <div className="flex-1 overflow-auto">
          {activeModule === 'dashboard' ? <DashboardView /> : 
           activeModule === 'enrollment' ? <EnrollmentView /> : 
           activeModule === 'exposure' ? <ExposureView /> : 
           activeModule === 'pre-employment' ? <PreEmploymentView /> :
           activeModule === 'jha' ? <JHAView /> :
           activeModule === 'scheduling' ? <SchedulingView /> :
           activeModule === 'audiograms' ? <AudiogramView /> :
           activeModule === 'recertification' ? <RecertificationView /> :
           activeModule === 'fit-testing' ? <FitTestingView /> :
           activeModule === 'policies' ? <PoliciesView /> :
           activeModule === 'profile' ? <ProfileView /> :
           <ModulePlaceholder moduleName={MODULES.find(m => m.id === activeModule)?.name || ''} moduleId={activeModule} />}
        </div>

        {/* Sub-footer / Tooltip Explanation Bar */}
        <footer className="h-8 bg-primary/10 border-t border-primary/20 px-6 flex items-center justify-between shrink-0">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 border border-primary rounded-full flex items-center justify-center text-[8px] text-primary font-bold">i</div>
              <span className="text-[10px] text-primary/80">System Secured. Live sync enabled.</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">
            Role-Based Access Control: Tier 2 (Governance)
          </div>
        </footer>
      </main>

      {/* AI Assistant Side Panel */}
      <AIAssistantPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
    </div>
  );
}


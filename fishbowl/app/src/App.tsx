import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from './lib/store';
import { DashboardView } from './components/dashboard/DashboardView';
import { CatalogueView } from './components/catalogue/CatalogueView';
import { MenusView } from './components/menus/MenusView';
import { ShoppingListView } from './components/shopping/ShoppingListView';
import { SettingsView } from './components/settings/SettingsView';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { Home, Wine, Menu as MenuIcon, ShoppingCart, Settings } from 'lucide-react';

export default function App() {
  const { loadData, isLoading } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-primary font-heading tracking-widest uppercase">Loading FishBowl</p>
        </div>
      </div>
    );
  }

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card/60 backdrop-blur-xl flex flex-col pt-8 z-10 hidden md:flex">
        <div className="px-6 mb-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center mb-4">
             <Wine className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground tracking-widest uppercase">FishBowl</h1>
          <p className="text-[10px] uppercase tracking-widest text-primary mt-1 opacity-80">Cocktail Intelligence</p>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1">
            <NavItem icon={<Home className="w-4 h-4 mr-3" />} label="Dashboard" active={currentPath.startsWith('/fishbowl/dashboard')} onClick={() => navigate('/fishbowl/dashboard')} />
            <NavItem icon={<Wine className="w-4 h-4 mr-3" />} label="Catalogue" active={currentPath.startsWith('/fishbowl/catalogue')} onClick={() => navigate('/fishbowl/catalogue')} />
            <NavItem icon={<MenuIcon className="w-4 h-4 mr-3" />} label="Menus & Forecasts" active={currentPath.startsWith('/fishbowl/menus')} onClick={() => navigate('/fishbowl/menus')} />
            <NavItem icon={<ShoppingCart className="w-4 h-4 mr-3" />} label="Shopping List" active={currentPath.startsWith('/fishbowl/shopping')} onClick={() => navigate('/fishbowl/shopping')} />
          </div>
        </ScrollArea>
        
        <div className="p-4 mt-auto">
          <Separator className="bg-border mb-4" />
          <NavItem icon={<Settings className="w-4 h-4 mr-3" />} label="Settings" active={currentPath.startsWith('/fishbowl/settings')} onClick={() => navigate('/fishbowl/settings')} variant="ghost" />
        </div>
      </div>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col relative overflow-hidden z-0">
        <div className="md:hidden flex items-center p-4 border-b border-border bg-card/80 backdrop-blur-md z-10">
          <Wine className="text-primary w-5 h-5 mr-2" />
          <h1 className="text-xl font-heading font-bold tracking-widest uppercase">FishBowl</h1>
        </div>

        <ScrollArea className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto pb-20">
            <Routes>
              <Route path="/fishbowl/dashboard" element={<DashboardView />} />
              <Route path="/fishbowl/catalogue" element={<CatalogueView />} />
              <Route path="/fishbowl/menus" element={<MenusView />} />
              <Route path="/fishbowl/shopping" element={<ShoppingListView />} />
              <Route path="/fishbowl/settings" element={<SettingsView />} />
              <Route path="*" element={<Navigate to="/fishbowl/dashboard" replace />} />
            </Routes>
          </div>
        </ScrollArea>
      </main>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border flex justify-around p-2 z-20">
         <MobileNavItem icon={<Home />} active={currentPath.startsWith('/fishbowl/dashboard')} onClick={() => navigate('/fishbowl/dashboard')} />
         <MobileNavItem icon={<Wine />} active={currentPath.startsWith('/fishbowl/catalogue')} onClick={() => navigate('/fishbowl/catalogue')} />
         <MobileNavItem icon={<MenuIcon />} active={currentPath.startsWith('/fishbowl/menus')} onClick={() => navigate('/fishbowl/menus')} />
         <MobileNavItem icon={<ShoppingCart />} active={currentPath.startsWith('/fishbowl/shopping')} onClick={() => navigate('/fishbowl/shopping')} />
         <MobileNavItem icon={<Settings />} active={currentPath.startsWith('/fishbowl/settings')} onClick={() => navigate('/fishbowl/settings')} />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, variant = 'default' }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, variant?: 'default' | 'ghost' }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-md transition-all text-sm font-medium ${
        active 
          ? 'bg-primary/10 text-primary border-l-2 border-primary' 
          : 'text-muted-foreground hover:bg-card hover:text-foreground border-l-2 border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MobileNavItem({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-md flex justify-center items-center ${active ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
    >
      {icon}
    </button>
  );
}

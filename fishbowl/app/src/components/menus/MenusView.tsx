import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { calculateMenuStats } from '../../lib/calculations';
import { MenuEditor } from './MenuEditor';

export function MenusView() {
  const { menus, cocktails, setActiveMenu } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const navigate = useNavigate();

  if (isEditing) {
    return <MenuEditor menuId={editId} onBack={() => setIsEditing(false)} />;
  }

  return (
    <div className="flex flex-col h-full gap-6 max-h-[calc(100vh-2rem)] overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-heading text-secondary">Menus</h2>
          <p className="text-muted-foreground">Build and analyze menu performance</p>
        </div>
        <Button onClick={() => { setEditId(null); setIsEditing(true); }} className="bg-secondary text-white hover:bg-secondary/80">
          Create Menu
        </Button>
      </div>

      {menus.length === 0 ? (
        <div className="flex items-center justify-center p-12 border border-dashed border-border rounded-lg bg-card/20">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-1">No menus yet</h3>
            <p className="text-muted-foreground mb-4">Create your first menu to see forecasts and calculate shopping lists.</p>
            <Button onClick={() => {
              useAppStore.getState().addMenu({
                id: crypto.randomUUID(),
                name: "Summer Nightclub Special",
                cocktailIds: ["espresso_martini", "paloma"],
                expectedPatrons: 500,
                inventoryBudget: 2000,
                targetProfitMargin: 70,
                createdAt: new Date().toISOString(),
                venueType: "Club"
              });
            }} className="bg-secondary text-white hover:bg-secondary/80">
              Generate Example Menu
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map(menu => {
              const stats = calculateMenuStats(menu, cocktails);
              return (
                <Card key={menu.id} className="bg-card/40 backdrop-blur-sm border-secondary/20 hover:border-secondary transition-colors">
                  <CardHeader>
                    <CardTitle>{menu.name}</CardTitle>
                    <CardDescription>{menu.venueType} • {menu.cocktailIds.length} Cocktails</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Est. Revenue</p>
                          <p className="text-xl font-mono text-emerald-400">${stats.grossRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Margin</p>
                          <p className="text-xl font-mono">{stats.profitMargin.toFixed(1)}%</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => { setEditId(menu.id); setIsEditing(true); }}>
                          Edit Menu
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            const newMenu = { ...menu, id: crypto.randomUUID(), name: `${menu.name} (Copy)` };
                            useAppStore.getState().addMenu(newMenu);
                          }}>
                            Copy
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => {
                            setActiveMenu(menu.id);
                            navigate('/fishbowl/shopping');
                          }}>
                            Shopping List
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => {
                             if(window.confirm('Delete menu?')) { useAppStore.getState().deleteMenu(menu.id); }
                          }}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

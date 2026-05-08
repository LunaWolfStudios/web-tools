import { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Cocktail } from '../../types';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { calculateMenuStats } from '../../lib/calculations';

export function MenuEditor({ menuId, onBack }: { menuId: string | null; onBack: () => void }) {
  const { menus, cocktails, addMenu, updateMenu } = useAppStore();
  
  const existingMenu = menus.find(m => m.id === menuId);
  const isEditing = !!existingMenu;

  const [name, setName] = useState(existingMenu?.name || "New Menu");
  const [venueType, setVenueType] = useState(existingMenu?.venueType || "Club");
  const [expectedPatrons, setExpectedPatrons] = useState(existingMenu?.expectedPatrons.toString() || "300");
  const [targetMargin, setTargetMargin] = useState(existingMenu?.targetProfitMargin.toString() || "75");
  const [selectedCocktails, setSelectedCocktails] = useState<string[]>(existingMenu?.cocktailIds || []);
  
  const [searchTerm, setSearchTerm] = useState('');

  const currentMenu = {
    id: menuId || crypto.randomUUID(),
    name,
    venueType,
    expectedPatrons: parseInt(expectedPatrons) || 0,
    targetProfitMargin: parseFloat(targetMargin) || 0,
    inventoryBudget: existingMenu?.inventoryBudget || 0,
    cocktailIds: selectedCocktails,
    createdAt: existingMenu?.createdAt || new Date().toISOString()
  };

  const handleSave = async () => {
    if (isEditing) {
      await updateMenu(currentMenu);
    } else {
      await addMenu(currentMenu);
    }
    onBack();
  };

  const validSelectedCocktails = selectedCocktails.filter(id => cocktails.some(c => c.id === id));
  const availableCocktails = cocktails.filter(c => !validSelectedCocktails.includes(c.id));
  const filteredAvailable = availableCocktails.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const menuCocktailDetails = cocktails.filter(c => validSelectedCocktails.includes(c.id));

  const stats = calculateMenuStats(currentMenu, cocktails);

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-heading text-secondary">{isEditing ? "Edit Menu" : "Create Menu"}</h2>
          <p className="text-muted-foreground">{name}</p>
        </div>
        <div className="ml-auto">
          <Button onClick={handleSave} className="bg-secondary text-white hover:bg-secondary/80">Save Menu</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <Card className="bg-card/40 backdrop-blur-md border-border col-span-1 lg:col-span-1 border-t-4 border-t-secondary">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Menu Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Venue Type</Label>
               <Select value={venueType} onValueChange={setVenueType}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Club">Nightclub</SelectItem>
                  <SelectItem value="Bar">Cocktail Bar</SelectItem>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Event">Event / Pop-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expected Patrons</Label>
              <Input type="number" value={expectedPatrons} onChange={e => setExpectedPatrons(e.target.value)} className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Target Margin (%)</Label>
              <Input type="number" value={targetMargin} onChange={e => setTargetMargin(e.target.value)} className="bg-background/50" />
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="font-heading text-lg mb-4 text-emerald-400">Forecast</h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Sales (Drinks)</span>
                  <span>{stats.expectedSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Revenue</span>
                  <span className="text-emerald-400">${stats.grossRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ingredient Cost</span>
                  <span className="text-destructive">${stats.ingredientCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border/50">
                  <span>Net Margin</span>
                  <span className={stats.profitMargin >= parseFloat(targetMargin) ? 'text-emerald-400' : 'text-accent'}>
                    {stats.profitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Builder Panel */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <Card className="bg-card/40 backdrop-blur-md border-border flex-1 border-t-4 border-t-primary">
            <CardContent className="pt-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading text-xl">Selected Cocktails ({menuCocktailDetails.length})</h3>
              </div>
              <ScrollArea className="flex-1 h-[250px] pr-4">
                <div className="space-y-3">
                  {menuCocktailDetails.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.family} • {c.profitMarginPercent.toFixed(1)}% margin</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => setSelectedCocktails(prev => prev.filter(id => id !== c.id))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {menuCocktailDetails.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No cocktails added to this menu yet.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur-md border-border flex-1">
            <CardContent className="pt-6 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                <h3 className="font-heading text-xl whitespace-nowrap">Add Cocktails</h3>
                <Input 
                  placeholder="Search library..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-background/50 flex-1 w-full"
                />
              </div>
              <ScrollArea className="flex-1 h-[250px] pr-4">
                <div className="space-y-3">
                  {filteredAvailable.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-background/50 transition-colors">
                      <div className="mr-4">
                        <p className="font-medium text-foreground">{c.name}</p>
                        <div className="flex gap-2 items-center mt-1 flex-wrap">
                           <Badge variant="outline" className="text-[10px] uppercase text-muted-foreground">{c.family}</Badge>
                           <span className="text-xs text-emerald-400">{c.profitMarginPercent.toFixed(1)}% Mgn</span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => setSelectedCocktails(prev => [...prev, c.id])} className="shrink-0 bg-primary text-black hover:bg-primary/80">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  ))}
                  {filteredAvailable.length === 0 && (
                     <p className="text-center text-muted-foreground py-8">No cocktails found</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

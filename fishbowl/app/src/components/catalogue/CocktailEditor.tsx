import { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Cocktail } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function CocktailEditor({ editId, onBack }: { editId: string | null; onBack: () => void }) {
  const { cocktails, addCocktail, updateCocktail } = useAppStore();
  const existing = cocktails.find(c => c.id === editId);
  const isEditing = !!existing;

  const [name, setName] = useState(existing?.name || "");
  const [family, setFamily] = useState(existing?.family || "Martini");
  const [type, setType] = useState(existing?.type || "Classic");
  
  const [baseSpirit, setBaseSpirit] = useState(existing?.baseSpirits.join(', ') || "");
  const [mixers, setMixers] = useState(existing?.mixers.join(', ') || "");
  const [garnishes, setGarnishes] = useState(existing?.garnishes.join(', ') || "");
  
  const [cost, setCost] = useState(existing?.estimatedCost.toString() || "3.50");
  const [price, setPrice] = useState(existing?.estimatedPrice.toString() || "15.00");
  const [abv, setAbv] = useState(existing?.abv.toString() || "15");

  const [difficulty, setDifficulty] = useState<Cocktail["difficulty"]>(existing?.difficulty || "Medium");

  const parseCSV = (str: string) => str.split(',').map(s => s.trim()).filter(Boolean);

  const handleSave = async () => {
    if (!name) return;
    
    // Quick validation / coercion
    const c = parseFloat(cost) || 0;
    const p = parseFloat(price) || 0;
    const margin = p > 0 ? ((p - c) / p) * 100 : 0;

    const cocktail: Cocktail = {
      id: isEditing ? editId : crypto.randomUUID(),
      name,
      family,
      type,
      venueTags: existing?.venueTags || ["custom"],
      keywords: existing?.keywords || [],
      baseSpirits: parseCSV(baseSpirit),
      mixers: parseCSV(mixers),
      liqueursAndModifiers: existing?.liqueursAndModifiers || [],
      garnishes: parseCSV(garnishes),
      glassware: existing?.glassware || "Standard",
      ice: existing?.ice || "Standard",
      prepStyle: existing?.prepStyle || "Standard",
      difficulty,
      estimatedCost: c,
      estimatedPrice: p,
      profitMarginPercent: margin,
      abv: parseFloat(abv) || 0,
      prepTimeSeconds: existing?.prepTimeSeconds || 60,
      batchFriendly: existing?.batchFriendly || false,
      seasonality: existing?.seasonality || ["year_round"],
      tags: existing?.tags || ["custom"],
      custom: true
    };

    if (isEditing) {
      await updateCocktail(cocktail);
    } else {
      await addCocktail(cocktail);
    }
    onBack();
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-heading text-primary">{isEditing ? "Edit Cocktail" : "Add Cocktail"}</h2>
          <p className="text-muted-foreground">Add to your venue's catalogue</p>
        </div>
      </div>

      <Card className="bg-card/40 backdrop-blur-md border-border max-w-3xl">
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cocktail Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Neon Mojito" className="bg-background/50" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Family</Label>
                 <Input value={family} onChange={e => setFamily(e.target.value)} placeholder="e.g. Highball" className="bg-background/50" />
               </div>
               <div className="space-y-2">
                 <Label>Type</Label>
                 <Input value={type} onChange={e => setType(e.target.value)} placeholder="e.g. Refreshing" className="bg-background/50" />
               </div>
            </div>

            <div className="space-y-2">
              <Label>Base Spirits (comma separated)</Label>
              <Input value={baseSpirit} onChange={e => setBaseSpirit(e.target.value)} placeholder="Vodka, Tequila" className="bg-background/50" />
            </div>
            
            <div className="space-y-2">
              <Label>Mixers (comma separated)</Label>
              <Input value={mixers} onChange={e => setMixers(e.target.value)} placeholder="Lime Juice, Soda" className="bg-background/50" />
            </div>

             <div className="space-y-2">
              <Label>Garnishes (comma separated)</Label>
              <Input value={garnishes} onChange={e => setGarnishes(e.target.value)} placeholder="Mint Leaf" className="bg-background/50" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Est. Cost ($)</Label>
                <Input type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label>Menu Price ($)</Label>
                <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="bg-background/50" />
              </div>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-md flex justify-between items-center">
               <span className="text-sm font-medium">Projected Margin</span>
               <span className="text-xl font-mono text-emerald-400">
                 {price && parseFloat(price) > 0 ? (((parseFloat(price) - (parseFloat(cost)||0)) / parseFloat(price)) * 100).toFixed(1) : "0.0"}%
               </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Est. ABV (%)</Label>
                 <Input type="number" value={abv} onChange={e => setAbv(e.target.value)} className="bg-background/50" />
               </div>
               <div className="space-y-2">
                 <Label>Difficulty</Label>
                 <Select value={difficulty} onValueChange={(val: any) => setDifficulty(val)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
               </div>
            </div>
            
            <div className="pt-6">
              <Button onClick={handleSave} className="w-full bg-primary text-black hover:bg-primary/80">
                {isEditing ? "Save Changes" : "Save to Catalogue"}
              </Button>
               {isEditing && (
                 <Button variant="ghost" className="w-full mt-2 text-destructive" onClick={() => {
                   if (window.confirm('Delete this cocktail?')) {
                     useAppStore.getState().deleteCocktail(editId);
                     onBack();
                   }
                 }}>
                   Delete Cocktail
                 </Button>
               )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { CocktailCard } from './CocktailCard';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { CocktailEditor } from './CocktailEditor';

export function CatalogueView() {
  const { cocktails } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const filters = ['All', 'Vodka', 'Gin', 'Rum', 'Tequila', 'Whiskey', 'Mezcal', 'Wine'];

  const filtered = cocktails.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.family.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.baseSpirits.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && c.baseSpirits.some(s => s === activeFilter);
  });

  if (isEditing) {
     return <CocktailEditor editId={editId} onBack={() => setIsEditing(false)} />;
  }

  return (
    <div className="flex flex-col h-full gap-6 max-h-[calc(100vh-2rem)] overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-heading text-primary">Cocktail Catalogue</h2>
          <p className="text-muted-foreground">Manage your venue's cocktail database</p>
        </div>
        <Button onClick={() => { setEditId(null); setIsEditing(true); }} className="bg-primary text-black hover:bg-primary/80">
          Add Cocktail
        </Button>
      </div>

      <div className="shrink-0 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, family, or base spirit..." 
            className="pl-10 bg-card/30 border-primary/20 focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <Button 
              key={f} 
              variant={activeFilter === f ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter(f)}
              className={activeFilter === f ? "bg-primary text-black" : ""}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(cocktail => (
            <CocktailCard key={cocktail.id} cocktail={cocktail} onClick={() => { setEditId(cocktail.id); setIsEditing(true); }} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No cocktails found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

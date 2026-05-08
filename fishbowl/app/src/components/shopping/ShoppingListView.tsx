import { useAppStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { generateShoppingList } from '../../lib/calculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

export function ShoppingListView() {
  const { menus, cocktails, activeMenuId } = useAppStore();
  const activeMenu = menus.find(m => m.id === activeMenuId);

  if (!activeMenu) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <p>Please select a menu from the Menus tab to view its shopping list.</p>
      </div>
    );
  }

  const shoppingList = generateShoppingList(activeMenu, cocktails);
  const totalCost = shoppingList.reduce((acc, item) => acc + item.estimatedCost, 0);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading text-accent">Shopping Intelligence</h2>
          <p className="text-muted-foreground">Inventory requirements for {activeMenu.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Estimated Total Cost</p>
          <p className="text-2xl font-mono text-emerald-400">${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
      </div>

      <Card className="bg-card/40 backdrop-blur-md border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">Required Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Ingredient</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Est. Bottles</TableHead>
                <TableHead className="text-right">Est. Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shoppingList.map((item) => (
                <TableRow key={item.ingredient} className="border-border/50">
                  <TableCell className="font-medium text-foreground">{item.ingredient}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="opacity-80">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{item.requiredOz.toFixed(1)} oz</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {item.estimatedBottles ? item.estimatedBottles : '-'}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-emerald-400">
                    ${item.estimatedCost.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {shoppingList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No ingredients found. Add cocktails to this menu first.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

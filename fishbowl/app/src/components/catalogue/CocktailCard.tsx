import React from 'react';
import { Cocktail } from '../../types';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function CocktailCard({ cocktail, onClick }: { cocktail: Cocktail; onClick?: () => void; key?: React.Key }) {
  return (
    <Card className="cursor-pointer hover:border-primary transition-colors bg-card/50 backdrop-blur-sm" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{cocktail.name}</CardTitle>
          <Badge variant="outline" className="border-secondary/50 text-secondary">{cocktail.family}</Badge>
        </div>
        <CardDescription>{cocktail.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Est. Cost</span>
            <span className="font-mono text-primary">${cocktail.estimatedCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Est. Price</span>
            <span className="font-mono">${cocktail.estimatedPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Margin</span>
            <span className="font-mono text-emerald-400">{cocktail.profitMarginPercent.toFixed(1)}%</span>
          </div>
          <div className="flex gap-1 flex-wrap mt-2">
            {cocktail.baseSpirits.map(s => (
              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

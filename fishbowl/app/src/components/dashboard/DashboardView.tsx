import { useAppStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { calculateMenuStats } from '../../lib/calculations';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export function DashboardView() {
  const { cocktails, menus } = useAppStore();

  const totalMenus = menus.length;
  const totalCocktails = cocktails.length;
  
  let topMenuRevenue = 0;
  let topMenuMargin = 0;
  let topMenuName = "N/A";

  const chartData = menus.map(m => {
    const stats = calculateMenuStats(m, cocktails);
    return {
      name: m.name,
      Revenue: stats.grossRevenue,
      Cost: stats.ingredientCost,
      Profit: stats.netProfit,
      Margin: parseFloat(stats.profitMargin.toFixed(1))
    };
  });

  if (menus.length > 0) {
    let topMenu = menus[0];
    let topStats = calculateMenuStats(topMenu, cocktails);
    
    menus.forEach(m => {
      const stats = calculateMenuStats(m, cocktails);
      if (stats.grossRevenue > topStats.grossRevenue) {
        topStats = stats;
        topMenu = m;
      }
    });

    topMenuRevenue = topStats.grossRevenue;
    topMenuMargin = topStats.profitMargin;
    topMenuName = topMenu.name;
  }

  const averageCocktailMargin = cocktails.length > 0 
    ? cocktails.reduce((acc, c) => acc + c.profitMarginPercent, 0) / cocktails.length 
    : 0;

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h2 className="text-3xl font-heading text-primary">Overview</h2>
        <p className="text-muted-foreground">High-level operational metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/40 backdrop-blur-md border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Catalogue Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">{totalCocktails}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique Cocktails</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Cocktail Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-emerald-400">{averageCocktailMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Gross Profit</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top Menu Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono">${topMenuRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            <p className="text-xs text-primary mt-1">{topMenuName}</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top Menu Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono text-emerald-400">{topMenuMargin.toFixed(1)}%</div>
            <p className="text-xs text-primary mt-1">{topMenuName}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/40 backdrop-blur-md border-border flex-1">
        <CardHeader>
          <CardTitle>Menu Comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {menus.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937' }}
                  itemStyle={{ fontFamily: 'monospace' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="Revenue" fill="#00f3ff" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="Cost" fill="#E11D48" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="Profit" fill="#00ff9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center border border-dashed border-border rounded-lg bg-card/10">
              <div className="text-center w-full max-w-md">
                 <h3 className="text-xl font-heading mb-2">Welcome to FishBowl</h3>
                 <p className="text-muted-foreground text-sm mb-6">Your data is stored locally in your browser. Navigate through the sidebar to build your cocktail library and optimize your menus.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Utility functions for calculations
 */
import { Menu, Cocktail, InventoryRequirement } from '../types';

export function calculateMenuStats(menu: Menu, cocktails: Cocktail[]) {
  const menuCocktails = cocktails.filter(c => menu.cocktailIds.includes(c.id));
  
  if (menuCocktails.length === 0) return {
    expectedSales: 0,
    grossRevenue: 0,
    ingredientCost: 0,
    netProfit: 0,
    profitMargin: 0,
    avgPrice: 0,
    avgCost: 0
  };

  const avgPrice = menuCocktails.reduce((acc, c) => acc + c.estimatedPrice, 0) / menuCocktails.length;
  const avgCost = menuCocktails.reduce((acc, c) => acc + c.estimatedCost, 0) / menuCocktails.length;
  
  // Assume each patron buys 2.5 drinks on average
  const drinksPerPatron = 2.5;
  const expectedSales = menu.expectedPatrons * drinksPerPatron;
  
  const grossRevenue = expectedSales * avgPrice;
  const ingredientCost = expectedSales * avgCost;
  const netProfit = grossRevenue - ingredientCost;
  
  const profitMargin = (netProfit / grossRevenue) * 100;
  
  return {
    expectedSales,
    grossRevenue,
    ingredientCost,
    netProfit,
    profitMargin,
    avgPrice,
    avgCost
  };
}

export function generateShoppingList(menu: Menu, cocktails: Cocktail[]): InventoryRequirement[] {
  const menuCocktails = cocktails.filter(c => menu.cocktailIds.includes(c.id));
  const drinksPerPatron = 2.5;
  const expectedTotalDrinks = menu.expectedPatrons * drinksPerPatron;
  const expectedDrinksPerCocktail = expectedTotalDrinks / Math.max(1, menuCocktails.length);

  const requirements: Record<string, InventoryRequirement> = {};

  const addReq = (ingredient: string, category: InventoryRequirement['category'], amountOz: number, costEstimate: number) => {
    if (!requirements[ingredient]) {
      requirements[ingredient] = {
        ingredient,
        category,
        requiredOz: 0,
        estimatedCost: 0
      };
    }
    requirements[ingredient].requiredOz += amountOz;
    requirements[ingredient].estimatedCost += costEstimate;
  };

  menuCocktails.forEach(c => {
    // Highly simplified algorithm: assume standard pours (2oz base, 1oz mixer, etc.)
    c.baseSpirits.forEach(spirit => {
      addReq(spirit, "Base Spirit", expectedDrinksPerCocktail * 2.0, expectedDrinksPerCocktail * 1.50);
    });
    c.mixers.forEach(mixer => {
      addReq(mixer, "Mixer", expectedDrinksPerCocktail * 1.0, expectedDrinksPerCocktail * 0.25);
    });
    c.liqueursAndModifiers.forEach(liq => {
      addReq(liq, "Liqueur", expectedDrinksPerCocktail * 0.5, expectedDrinksPerCocktail * 0.75);
    });
    c.garnishes.forEach(garnish => {
      addReq(garnish, "Garnish", expectedDrinksPerCocktail * 0.1, expectedDrinksPerCocktail * 0.10);
    });
  });

  // Calculate estimated bottles (assuming 25.4oz per 750ml bottle for liquids)
  return Object.values(requirements).map(req => {
    if (req.category !== 'Garnish') {
      req.estimatedBottles = Math.ceil(req.requiredOz / 25.4);
    }
    return req;
  }).sort((a,b) => b.estimatedCost - a.estimatedCost);
}

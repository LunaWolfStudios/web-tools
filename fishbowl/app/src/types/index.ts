export interface Cocktail {
  id: string;
  name: string;
  family: string;
  type: string;
  venueTags: string[];
  keywords: string[];
  baseSpirits: string[];
  mixers: string[];
  liqueursAndModifiers: string[];
  garnishes: string[];
  glassware: string;
  ice: string;
  prepStyle: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  estimatedCost: number;
  estimatedPrice: number;
  profitMarginPercent: number;
  abv: number;
  prepTimeSeconds: number;
  batchFriendly: boolean;
  seasonality: string[];
  tags: string[];
  // Extensibility
  imageUrl?: string;
  custom?: boolean;
}

export interface Menu {
  id: string;
  name: string;
  cocktailIds: string[];
  expectedPatrons: number;
  inventoryBudget: number;
  targetProfitMargin: number;
  createdAt: string;
  venueType: string;
}

export interface InventoryRequirement {
  ingredient: string;
  category: "Base Spirit" | "Mixer" | "Garnish" | "Liqueur";
  requiredOz: number;
  estimatedCost: number;
  estimatedBottles?: number;
}

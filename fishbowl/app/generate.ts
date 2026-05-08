import fs from 'fs';
import path from 'path';

const rawText = fs.readFileSync(path.join(process.cwd(), 'raw_cocktails.txt'), 'utf-8');
const lines = rawText.split('\n');

const out: any[] = [];
let idCounter = 1000;

for (const line of lines) {
  const t = line.trim();
  if (t.startsWith('- ')) {
    const name = t.replace('- ', '');
    
    // Auto-generate some properties based on keywords
    let baseSpirit = 'Various';
    const ln = name.toLowerCase();
    if (ln.includes('vodka') || ln.includes('martini') || ln.includes('cosmo') || ln.includes('bloody mary') || ln.includes('mule')) baseSpirit = 'Vodka';
    if (ln.includes('gin') || ln.includes('negroni') || ln.includes('aviation') || ln.includes('collins') || ln.includes('fizz')) baseSpirit = 'Gin';
    if (ln.includes('rum') || ln.includes('daiquiri') || ln.includes('mojito') || ln.includes('mai tai') || ln.includes('colada') || ln.includes('zombie')) baseSpirit = 'Rum';
    if (ln.includes('tequila') || ln.includes('margarita') || ln.includes('paloma') || ln.includes('ranch water')) baseSpirit = 'Tequila';
    if (ln.includes('whiskey') || ln.includes('bourbon') || ln.includes('old fashioned') || ln.includes('manhattan') || ln.includes('sazerac')) baseSpirit = 'Whiskey';
    if (ln.includes('mezcal')) baseSpirit = 'Mezcal';
    if (ln.includes('spritz') || ln.includes('sangria') || ln.includes('bellini')) baseSpirit = 'Wine';
    
    let family = 'Other';
    if (ln.includes('martini')) family = 'Martini';
    else if (ln.includes('margarita') || ln.includes('daisy')) family = 'Daisy';
    else if (ln.includes('old fashioned')) family = 'Old Fashioned';
    else if (ln.includes('sour') || ln.includes('collins') || ln.includes('gimlet')) family = 'Sour';
    else if (ln.includes('highball') || ln.includes('soda') || ln.includes('tonic')) family = 'Highball';
    else if (ln.includes('spritz')) family = 'Spritz';

    out.push({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + idCounter++,
      name: name,
      family: family,
      type: "Classic",
      venueTags: ["bar"],
      keywords: [],
      baseSpirits: [baseSpirit],
      mixers: [],
      liqueursAndModifiers: [],
      garnishes: [],
      glassware: "Standard",
      ice: "Standard",
      prepStyle: "Standard",
      difficulty: "Medium",
      estimatedCost: 3.50,
      estimatedPrice: 12.00,
      profitMarginPercent: 70.8,
      abv: 15,
      prepTimeSeconds: 60,
      batchFriendly: false,
      seasonality: ["year_round"],
      tags: ["imported"]
    });
  }
}

fs.writeFileSync(path.join(process.cwd(), 'src/lib/generatedCocktails.ts'), `import { Cocktail } from '../types';

export const generatedCocktails: Cocktail[] = ${JSON.stringify(out, null, 2)};
`);

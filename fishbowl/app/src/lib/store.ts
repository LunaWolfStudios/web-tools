import { create } from 'zustand';
import { db } from './db';
import { Cocktail, Menu } from '../types';
import { sampleCocktails } from './sampleData';

interface AppState {
  cocktails: Cocktail[];
  menus: Menu[];
  isLoading: boolean;
  activeMenuId: string | null;
  currentView: 'dashboard' | 'catalogue' | 'menus' | 'shopping' | 'settings';
  loadData: () => Promise<void>;
  addCocktail: (cocktail: Cocktail) => Promise<void>;
  updateCocktail: (cocktail: Cocktail) => Promise<void>;
  deleteCocktail: (id: string) => Promise<void>;
  addMenu: (menu: Menu) => Promise<void>;
  updateMenu: (menu: Menu) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;
  setActiveMenu: (id: string | null) => void;
  setCurrentView: (view: 'dashboard' | 'catalogue' | 'menus' | 'shopping' | 'settings') => void;
  resetApp: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<boolean>;
}

export const useAppStore = create<AppState>((set, get) => ({
  cocktails: [],
  menus: [],
  isLoading: true,
  activeMenuId: null,
  currentView: 'dashboard',

  loadData: async () => {
    set({ isLoading: true });
    
    // Seed data if empty
    const count = await db.cocktails.count();
    const menusCount = await db.menus.count();

    if (count === 0) {
      const { sampleCocktails, sampleMenus } = await import('./sampleData');
      const { generatedCocktails } = await import('./generatedCocktails');
      await db.cocktails.bulkAdd([...sampleCocktails, ...generatedCocktails]);
      if (menusCount === 0) {
        await db.menus.bulkAdd(sampleMenus);
      }
    } else {
      // If user had older generated cocktails, overwrite them to fix classification errors
      const existingGenerated = await db.cocktails.filter(c => !!c.id && c.id.includes('_100') && !c.custom).toArray();
      if (existingGenerated.length > 0 && existingGenerated.some(c => c.baseSpirits.includes('Unknown') || c.baseSpirits.includes('Bourbon'))) {
        await db.cocktails.bulkDelete(existingGenerated.map(c => c.id));
        const { generatedCocktails } = await import('./generatedCocktails');
        await db.cocktails.bulkAdd(generatedCocktails).catch((e) => console.log(e));
      } else {
        const checkIdx = await db.cocktails.get('old_fashioned_1000').catch(() => null);
        if (!checkIdx) {
          const { generatedCocktails } = await import('./generatedCocktails');
          await db.cocktails.bulkAdd(generatedCocktails).catch((e) => console.log(e));
        }
      }
      
      // Upgrade script: ensure new sample menus exist
      const hasTikiMenu = await db.menus.get('tiki_luau').catch(() => null);
      if (!hasTikiMenu) {
        const { sampleMenus } = await import('./sampleData');
        const existingMenuIds = (await db.menus.toArray()).map(m => m.id);
        const menusToAdd = sampleMenus.filter(m => !existingMenuIds.includes(m.id));
        if (menusToAdd.length > 0) {
           await db.menus.bulkAdd(menusToAdd).catch((e) => console.log(e));
        }
      }
    }
    
    const cocktails = await db.cocktails.toArray();
    const menus = await db.menus.toArray();
    set({ cocktails, menus, isLoading: false });
  },

  addCocktail: async (cocktail) => {
    await db.cocktails.add(cocktail);
    set({ cocktails: [...get().cocktails, cocktail] });
  },

  updateCocktail: async (cocktail) => {
    await db.cocktails.put(cocktail);
    set({
      cocktails: get().cocktails.map(c => c.id === cocktail.id ? cocktail : c)
    });
  },

  deleteCocktail: async (id) => {
    await db.cocktails.delete(id);
    set({ cocktails: get().cocktails.filter(c => c.id !== id) });
  },

  addMenu: async (menu) => {
    await db.menus.add(menu);
    set({ menus: [...get().menus, menu] });
  },

  updateMenu: async (menu) => {
    await db.menus.put(menu);
    set({ menus: get().menus.map(m => m.id === menu.id ? menu : m) });
  },

  deleteMenu: async (id) => {
    await db.menus.delete(id);
    set({ menus: get().menus.filter(m => m.id !== id), activeMenuId: get().activeMenuId === id ? null : get().activeMenuId });
  },

  setActiveMenu: (id) => set({ activeMenuId: id }),
  
  setCurrentView: (view) => set({ currentView: view }),

  resetApp: async () => {
    await db.delete();
    await db.open();
    await get().loadData();
    set({ activeMenuId: null, currentView: 'dashboard' });
  },

  exportData: async () => {
    const cocktails = await db.cocktails.toArray();
    const menus = await db.menus.toArray();
    return JSON.stringify({ cocktails, menus }, null, 2);
  },

  importData: async (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.cocktails && Array.isArray(data.cocktails) && data.menus && Array.isArray(data.menus)) {
        await db.transaction('rw', db.cocktails, db.menus, async () => {
          await db.cocktails.clear();
          await db.menus.clear();
          await db.cocktails.bulkAdd(data.cocktails);
          await db.menus.bulkAdd(data.menus);
        });
        await get().loadData();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Import failed:", e);
      return false;
    }
  }
}));

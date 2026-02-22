import { useState, useEffect, useCallback } from 'react';
import { AppData, Item, Category, ItemStatus } from '../types';

const STORAGE_KEY = 'neonListData';

const DEFAULT_DATA: AppData = {
  categories: [
    {
      id: 'cat-1',
      name: 'Grocery',
      color: '#00ff9d', // Neon Green
      items: [
        { id: 'item-1', name: 'Bread', status: 'need', lastUsed: Date.now() },
        { id: 'item-2', name: 'Milk', status: 'need', lastUsed: Date.now() },
        { id: 'item-3', name: 'Eggs', status: 'need', lastUsed: Date.now() },
        { id: 'item-4', name: 'Bacon', status: 'need', lastUsed: Date.now() },
      ]
    }
  ],
  recentItems: ['Bread', 'Milk', 'Eggs', 'Bacon'],
  settings: {
    sound: true,
    darkMode: true
  }
};

export function useStore() {
  const [data, setData] = useState<AppData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_DATA;
    } catch (e) {
      console.error('Failed to load data', e);
      return DEFAULT_DATA;
    }
  });

  const [history, setHistory] = useState<AppData[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const pushHistory = useCallback(() => {
    setHistory(prev => [...prev.slice(-9), JSON.parse(JSON.stringify(data))]); // Keep last 10
  }, [data]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setData(previous);
    setToast({ message: 'Undone', visible: true });
    setTimeout(() => setToast(null), 2000);
  }, [history]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    // Auto hide handled by component or separate timeout, but simple here:
    setTimeout(() => setToast(null), 3000);
  };

  const addItem = (name: string, categoryId: string) => {
    pushHistory();
    const newItem: Item = {
      id: crypto.randomUUID(),
      name,
      status: 'need',
      lastUsed: Date.now()
    };

    setData(prev => {
      const newCategories = prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, items: [...cat.items, newItem] };
        }
        return cat;
      });
      
      // Update recent items
      const newRecents = [name, ...prev.recentItems.filter(i => i !== name)];

      return { ...prev, categories: newCategories, recentItems: newRecents };
    });
    showToast(`Added ${name}`);
  };

  const removeRecentItem = (name: string) => {
    setData(prev => ({
      ...prev,
      recentItems: prev.recentItems.filter(item => item !== name)
    }));
  };

  const moveItem = (categoryId: string, itemId: string, toStatus: ItemStatus) => {
    pushHistory();
    setData(prev => {
      const newCategories = prev.categories.map(cat => {
        if (cat.id === categoryId) {
          const newItems = cat.items.map(item => 
            item.id === itemId ? { ...item, status: toStatus } : item
          );
          return { ...cat, items: newItems };
        }
        return cat;
      });
      return { ...prev, categories: newCategories };
    });
    // showToast(toStatus === 'purchased' ? 'Marked as purchased' : 'Moved to need');
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    pushHistory();
    setData(prev => {
      const newCategories = prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, items: cat.items.filter(i => i.id !== itemId) };
        }
        return cat;
      });
      return { ...prev, categories: newCategories };
    });
    showToast('Item deleted');
  };

  const addCategory = (name: string, color: string) => {
    pushHistory();
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color,
      items: []
    };
    setData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
    showToast(`Category ${name} created`);
  };

  const deleteCategory = (id: string) => {
    console.log('Deleting category:', id);
    pushHistory();
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
    showToast('Category deleted');
  };
  
  const updateCategory = (id: string, name: string, color: string) => {
      pushHistory();
      setData(prev => ({
          ...prev,
          categories: prev.categories.map(c => c.id === id ? { ...c, name, color } : c)
      }));
  };

  const importData = (newData: AppData) => {
    console.log('Importing data');
    pushHistory();
    setData(newData);
    showToast('List imported successfully');
  };
  
  const clearPurchased = () => {
      console.log('Clearing purchased');
      pushHistory();
      setData(prev => {
          const newCategories = prev.categories.map(cat => ({
              ...cat,
              items: cat.items.filter(i => i.status === 'need')
          }));
          return { ...prev, categories: newCategories };
      });
      showToast('Cleared purchased items');
  };

  const markCategoryPurchased = (categoryId: string) => {
    pushHistory();
    setData(prev => {
      const newCategories = prev.categories.map(cat => {
        if (cat.id === categoryId) {
          const newItems = cat.items.map(item => 
            item.status === 'need' ? { ...item, status: 'purchased' as ItemStatus } : item
          );
          return { ...cat, items: newItems };
        }
        return cat;
      });
      return { ...prev, categories: newCategories };
    });
    showToast('Category marked purchased');
  };

  const markAllPurchased = () => {
    pushHistory();
    setData(prev => {
      const newCategories = prev.categories.map(cat => ({
        ...cat,
        items: cat.items.map(item => 
          item.status === 'need' ? { ...item, status: 'purchased' as ItemStatus } : item
        )
      }));
      return { ...prev, categories: newCategories };
    });
    showToast('All items marked purchased');
  };

  const pasteList = (text: string) => {
    pushHistory();
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    setData(prev => {
      // Deep clone categories to avoid mutation issues
      const nextCategories = prev.categories.map(c => ({
        ...c,
        items: [...c.items]
      }));
      let nextRecents = [...prev.recentItems];
      let currentCatId: string | null = null;

      const colors = ['#00ccff', '#ff00ff', '#00ff9d', '#bd00ff', '#faff00', '#ff5500', '#ffffff'];

      lines.forEach(line => {
        if (line.endsWith(':')) {
           const catName = line.slice(0, -1).trim();
           // Find existing category (case-insensitive)
           let cat = nextCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());
           
           if (!cat) {
               // Create new category
               cat = {
                   id: crypto.randomUUID(),
                   name: catName,
                   color: colors[Math.floor(Math.random() * colors.length)],
                   items: []
               };
               nextCategories.push(cat);
           }
           currentCatId = cat.id;
        } else {
            // It's an item
            const itemName = line.replace(/^-\s*/, '').trim();
            if (!itemName) return;

            // If no category selected yet, use the first one or create default
            if (!currentCatId) {
                if (nextCategories.length === 0) {
                     const cat = {
                        id: crypto.randomUUID(),
                        name: 'Grocery',
                        color: '#00ff9d',
                        items: []
                     };
                     nextCategories.push(cat);
                     currentCatId = cat.id;
                } else {
                    currentCatId = nextCategories[0].id;
                }
            }

            const catIndex = nextCategories.findIndex(c => c.id === currentCatId);
            if (catIndex > -1) {
                nextCategories[catIndex].items.push({
                    id: crypto.randomUUID(),
                    name: itemName,
                    status: 'need',
                    lastUsed: Date.now()
                });
                
                // Add to recents if not exists
                if (!nextRecents.includes(itemName)) {
                    nextRecents.unshift(itemName);
                }
            }
        }
      });

      return { ...prev, categories: nextCategories, recentItems: nextRecents };
    });
    showToast('List pasted successfully');
  };

  return {
    data,
    addItem,
    moveItem,
    deleteItem,
    addCategory,
    deleteCategory,
    updateCategory,
    importData,
    pasteList,
    clearPurchased,
    markCategoryPurchased,
    markAllPurchased,
    removeRecentItem,
    undo,
    canUndo: history.length > 0,
    toast,
    showToast
  };
}

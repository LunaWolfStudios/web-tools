import { useState, useEffect, useCallback } from 'react';
import { AppData, Item, Category, ItemStatus } from '../types';

const STORAGE_KEY = 'neonListData';

const DEFAULT_DATA: AppData = {
  categories: [
    {
      id: 'cat-1',
      name: 'Grocery',
      color: '#00ff9d', // Neon Green
      items: []
    },
    {
      id: 'cat-2',
      name: 'Home',
      color: '#00ccff', // Neon Blue
      items: []
    }
  ],
  recentItems: [],
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

  return {
    data,
    addItem,
    moveItem,
    deleteItem,
    addCategory,
    deleteCategory,
    updateCategory,
    importData,
    clearPurchased,
    markCategoryPurchased,
    markAllPurchased,
    undo,
    canUndo: history.length > 0,
    toast
  };
}

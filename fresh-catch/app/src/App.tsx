import React, { useState } from 'react';
import { useStore } from './hooks/useStore';
import { Header } from './components/Header';
import { AddItemInput, QuickAddBar } from './components/InputArea';
import { CategoryGroup } from './components/Lists';
import { motion, AnimatePresence } from 'motion/react';
import { Undo2, CheckCheck, Trash2 } from 'lucide-react';

export default function App() {
  const {
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
    removeRecentItem,
    undo,
    canUndo,
    toast,
    showToast
  } = useStore();

  const [selectedCatId, setSelectedCatId] = useState<string>('');

  // Initialize selectedCatId if empty and categories exist
  React.useEffect(() => {
    if (!selectedCatId && data.categories.length > 0) {
      setSelectedCatId(data.categories[0].id);
    } else if (selectedCatId && !data.categories.find(c => c.id === selectedCatId) && data.categories.length > 0) {
       // If selected category was deleted, select the first one
       setSelectedCatId(data.categories[0].id);
    }
  }, [data.categories, selectedCatId]);

  const handleCopyList = () => {
    const lines: string[] = [];
    data.categories.forEach(cat => {
      const needItems = cat.items.filter(i => i.status === 'need');
      if (needItems.length > 0) {
        lines.push(`${cat.name}:`);
        needItems.forEach(item => {
          lines.push(`- ${item.name}`);
        });
        lines.push('');
      }
    });
    
    const text = lines.join('\n').trim();
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('List copied to clipboard');
      });
    } else {
        showToast('Nothing to copy!');
    }
  };

  const handleExport = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'fresh-catch-list.json';
    link.click();
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Basic validation could go here
        importData(json);
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    importData({
      categories: [],
      recentItems: [],
      settings: { sound: true, darkMode: true }
    });
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 pb-20">
      <Header
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
        onClearPurchased={clearPurchased}
        onCopyList={handleCopyList}
      />

      <QuickAddBar
        recentItems={data.recentItems}
        onAdd={(name) => {
          if (selectedCatId) {
            addItem(name, selectedCatId);
          } else if (data.categories.length > 0) {
            addItem(name, data.categories[0].id);
          }
        }}
        onRemove={removeRecentItem}
      />

      <AddItemInput
        categories={data.categories}
        selectedCatId={selectedCatId}
        onSelectCategory={setSelectedCatId}
        onAdd={addItem}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* NEED COLUMN */}
        <section>
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest">
              Need
            </h2>
            <button 
              onClick={markAllPurchased}
              className="text-[10px] font-bold uppercase tracking-wider text-neon-blue hover:text-white transition-colors flex items-center gap-1"
            >
              <CheckCheck size={14} /> All Done
            </button>
          </div>
          
          <div className="min-h-[100px]">
            {data.categories.map(cat => (
              <CategoryGroup
                key={cat.id}
                category={cat}
                status="need"
                items={cat.items.filter(i => i.status === 'need')}
                onMove={moveItem}
                onDelete={deleteItem}
                onMarkAllPurchased={markCategoryPurchased}
              />
            ))}
            {data.categories.every(c => c.items.filter(i => i.status === 'need').length === 0) && (
              <div className="text-center py-10 text-gray-600 italic">
                All caught up!
              </div>
            )}
          </div>
        </section>

        {/* PURCHASED COLUMN */}
        <section>
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest">
              Purchased
            </h2>
            <button 
              onClick={() => {
                if (confirm('Clear all purchased items?')) {
                  clearPurchased();
                }
              }}
              className="text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>

          <div className="min-h-[100px]">
            {data.categories.map(cat => (
              <CategoryGroup
                key={cat.id}
                category={cat}
                status="purchased"
                items={cat.items.filter(i => i.status === 'purchased')}
                onMove={moveItem}
                onDelete={deleteItem}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Toast & Undo */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a24] border border-white/10 shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 z-50"
          >
            <span className="text-sm font-medium text-white">{toast.message}</span>
            {canUndo && (
              <button
                onClick={undo}
                className="text-neon-blue hover:text-white transition-colors flex items-center gap-1 text-sm font-bold uppercase tracking-wider"
              >
                <Undo2 size={16} /> Undo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

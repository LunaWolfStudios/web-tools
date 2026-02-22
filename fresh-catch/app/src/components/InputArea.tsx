import React, { useState } from 'react';
import { Category } from '../types';
import { Plus, X, Settings2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickAddBarProps {
  recentItems: string[];
  onAdd: (name: string) => void;
}

export function QuickAddBar({ recentItems, onAdd }: QuickAddBarProps) {
  if (recentItems.length === 0) return null;

  return (
    <div className="w-full max-h-48 overflow-y-auto mb-4 no-scrollbar">
      <div className="flex flex-wrap gap-2 px-1">
        {recentItems.map((item, index) => (
          <button
            key={`${item}-${index}`}
            onClick={() => onAdd(item)}
            className="flex-shrink-0 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-neon-blue hover:text-neon-blue transition-colors whitespace-nowrap"
          >
            + {item}
          </button>
        ))}
      </div>
    </div>
  );
}

interface AddItemInputProps {
  categories: Category[];
  selectedCatId: string;
  onSelectCategory: (id: string) => void;
  onAdd: (name: string, categoryId: string) => void;
  onAddCategory: (name: string, color: string) => void;
  onUpdateCategory: (id: string, name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
}

export function AddItemInput({ 
  categories, 
  selectedCatId, 
  onSelectCategory, 
  onAdd, 
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}: AddItemInputProps) {
  const [text, setText] = useState('');
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  
  // Edit Category State
  const [isEditingCat, setIsEditingCat] = useState(false);
  const [editCatName, setEditCatName] = useState('');
  const [editCatColor, setEditCatColor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    if (selectedCatId) {
        onAdd(text.trim(), selectedCatId);
    } else if (categories.length > 0) {
        onAdd(text.trim(), categories[0].id);
    }
    setText('');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    // Random neon color
    const colors = ['#00ccff', '#ff00ff', '#00ff9d', '#bd00ff', '#faff00'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    onAddCategory(newCatName.trim(), randomColor);
    setNewCatName('');
    setIsCreatingCat(false);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCatName.trim() || !selectedCatId) return;
    
    onUpdateCategory(selectedCatId, editCatName.trim(), editCatColor);
    setIsEditingCat(false);
  };

  const openEditModal = () => {
    const cat = categories.find(c => c.id === selectedCatId);
    if (cat) {
      setEditCatName(cat.name);
      setEditCatColor(cat.color);
      setIsEditingCat(true);
    }
  };

  const neonColors = ['#00ccff', '#ff00ff', '#00ff9d', '#bd00ff', '#faff00', '#ff5500', '#ffffff'];

  return (
    <div className="space-y-3 mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add item..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-neon-blue/20 text-neon-blue border border-neon-blue/50 px-4 rounded-xl hover:bg-neon-blue/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-x-auto pb-2 no-scrollbar flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                selectedCatId === cat.id
                  ? 'shadow-lg scale-105'
                  : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
              }`}
              style={{
                backgroundColor: selectedCatId === cat.id ? cat.color : undefined,
                borderColor: selectedCatId === cat.id ? cat.color : undefined,
                color: selectedCatId === cat.id ? '#000000' : undefined,
                textShadow: selectedCatId === cat.id ? 'none' : undefined
              }}
            >
              {cat.name}
            </button>
          ))}
          
          <button
            onClick={() => setIsCreatingCat(true)}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
          >
            + New
          </button>
        </div>

        {selectedCatId && (
          <button
            onClick={openEditModal}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            title="Category Settings"
          >
            <Settings2 size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isCreatingCat && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateCategory} className="flex gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category Name"
                className="flex-1 bg-transparent border-b border-white/20 px-2 py-1 text-sm text-white focus:outline-none focus:border-neon-purple"
                autoFocus
              />
              <button
                type="submit"
                className="text-neon-green text-xs font-bold uppercase tracking-wider px-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingCat(false)}
                className="text-gray-500 hover:text-white px-2"
              >
                <X size={16} />
              </button>
            </form>
          </motion.div>
        )}

        {isEditingCat && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-300">Edit Category</h3>
                <button onClick={() => setIsEditingCat(false)} className="text-gray-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateCategory} className="space-y-4">
                <input
                  type="text"
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-blue"
                />
                
                <div className="flex gap-2 flex-wrap">
                  {neonColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditCatColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        editCatColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this category and all its items?')) {
                        onDeleteCategory(selectedCatId);
                        setIsEditingCat(false);
                      }
                    }}
                    className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-neon-blue/20 text-neon-blue border border-neon-blue/50 px-4 py-1 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neon-blue/30"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { Item, Category, ItemStatus } from '../types';
import { motion, PanInfo, AnimatePresence } from 'motion/react';
import { Check, Trash2, CheckCheck, ChevronDown, ChevronRight } from 'lucide-react';

interface ItemRowProps {
  item: Item;
  categoryColor: string;
  onMove: (itemId: string, toStatus: ItemStatus) => void;
  onDelete: (itemId: string) => void;
}

export const ItemRow: React.FC<ItemRowProps> = ({ item, categoryColor, onMove, onDelete }) => {
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      // Swipe Right -> Purchased
      if (item.status === 'need') {
        onMove(item.id, 'purchased');
      }
    } else if (info.offset.x < -100) {
      // Swipe Left -> Need (if in purchased) or Delete?
      // Spec says: Swipe Left -> Need.
      if (item.status === 'purchased') {
        onMove(item.id, 'need');
      }
    }
  };

  const isPurchased = item.status === 'purchased';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02, zIndex: 10 }}
      className={`relative group flex items-center gap-3 p-3 mb-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer overflow-hidden ${
        isPurchased ? 'opacity-60' : ''
      }`}
      style={{
        borderColor: isPurchased ? 'transparent' : `${categoryColor}30`,
        boxShadow: isPurchased ? 'none' : `0 0 10px -5px ${categoryColor}20`
      }}
      onClick={() => onMove(item.id, isPurchased ? 'need' : 'purchased')}
    >
      {/* Selection Indicator */}
      <div 
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
          isPurchased 
            ? 'bg-white/10 border-transparent text-gray-400' 
            : 'bg-transparent border-white/30'
        }`}
        style={{
            borderColor: !isPurchased ? categoryColor : undefined
        }}
      >
        {isPurchased && <Check size={12} />}
      </div>

      <span className={`flex-1 font-medium ${isPurchased ? 'line-through text-gray-500' : 'text-gray-100'}`}>
        {item.name}
      </span>

      {/* Delete Action (visible on hover/focus on desktop, or maybe specific gesture) */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-opacity"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
};

interface CategoryGroupProps {
  category: Category;
  status: ItemStatus;
  items: Item[];
  onMove: (catId: string, itemId: string, toStatus: ItemStatus) => void;
  onDelete: (catId: string, itemId: string) => void;
  onMarkAllPurchased?: (catId: string) => void;
}

export const CategoryGroup: React.FC<CategoryGroupProps> = ({ category, status, items, onMove, onDelete, onMarkAllPurchased }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (items.length === 0) return null;

  const total = category.items.length;
  const purchased = category.items.filter(i => i.status === 'purchased').length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400" style={{ color: category.color }}>
            {category.name} <span className="opacity-50 ml-1 text-[10px] normal-case tracking-normal text-gray-500">({purchased}/{total} done)</span>
          </h3>
        </div>
        
        {status === 'need' && onMarkAllPurchased && isExpanded && (
          <button 
            onClick={() => onMarkAllPurchased(category.id)}
            className="text-[10px] uppercase tracking-wider font-bold text-gray-600 hover:text-neon-blue transition-colors flex items-center gap-1"
          >
            <CheckCheck size={12} /> Done
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-1 overflow-hidden"
          >
            {items.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                categoryColor={category.color}
                onMove={(itemId, toStatus) => onMove(category.id, itemId, toStatus)}
                onDelete={(itemId) => onDelete(category.id, itemId)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

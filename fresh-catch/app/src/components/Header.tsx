import React, { useState, useRef } from 'react';
import { Download, Upload, RotateCcw, Trash2, Menu, X } from 'lucide-react';
import { AppData } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
  onClearPurchased: () => void;
}

export function Header({ onExport, onImport, onReset, onClearPurchased }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="flex items-center justify-between py-6">
      <div>
        <h1 className="text-3xl font-black tracking-tighter italic">
          <span className="text-neon-blue drop-shadow-[0_0_10px_rgba(0,204,255,0.5)]">FRESH</span>
          <span className="text-white ml-2">CATCH</span>
        </h1>
        <p className="text-xs text-gray-500 font-mono tracking-widest mt-1">Fresh List. Fresh Catch.</p>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-xl hover:bg-white/10 text-gray-300 transition-colors"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-1">
                <button
                  onClick={() => {
                    onExport();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                >
                  <Download size={16} /> Export JSON
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                >
                  <Upload size={16} /> Import JSON
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />

                <div className="h-px bg-white/10 my-1" />

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset everything? This cannot be undone.')) {
                      onReset();
                      setIsMenuOpen(false);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                >
                  <RotateCcw size={16} /> Reset All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

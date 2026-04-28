import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DATA } from '../data/config';
import { HumanBodyImage } from './HumanBodyImage';
import { cn } from '../lib/utils';
import { ProjectModal } from './ProjectModal';
import { ResourcesModal } from './ResourcesModal';
import { HelpCircle, X } from 'lucide-react';

type BodyPartId = 'eyes' | 'arms' | 'knees' | 'brain' | 'ears' | 'hands' | 'legs';

const NODE_POSITIONS: Record<BodyPartId, { top: string; left: string }> = {
  brain: { top: '3.5%', left: '50%' },
  eyes: { top: '7%', left: '46%' },
  ears: { top: '9%', left: '41%' },
  arms: { top: '29.5%', left: '26%' },
  hands: { top: '51.5%', left: '14.5%' },
  legs: { top: '53.5%', left: '65%' },
  knees: { top: '69%', left: '37%' },
};

export const CATEGORY_COLORS: Record<string, string> = {
  Health: 'var(--color-neon-cyan)',
  Fitness: 'var(--color-neon-green)',
  Education: 'var(--color-neon-purple)'
};

export const BodyHub = () => {
  const [hoveredNode, setHoveredNode] = useState<BodyPartId | null>(null);
  const [selectedPart, setSelectedPart] = useState<BodyPartId | null>(null);
  const [showResources, setShowResources] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[var(--color-bg)] text-white flex items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[50%] w-[800px] h-[800px] bg-blue-900/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-[0%] left-[50%] w-[600px] h-[600px] bg-purple-900/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/3" />
      </div>

      {/* Header slightly offset */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-10 max-w-[50%]">
        <motion.h1 
          className="font-display text-base md:text-2xl sm:text-xl tracking-widest uppercase opacity-90 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Anatomy of Play
        </motion.h1>
        <p className="font-sans text-[9px] sm:text-xs uppercase tracking-widest text-neutral-400 mt-1 sm:mt-2">
          Serious Games<span className="hidden sm:inline"> for Health and Fitness</span>
        </p>
      </div>

      <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-10 flex flex-col items-end gap-2 sm:gap-3">
        <button
          onClick={() => setShowResources(true)}
          className="px-3 sm:px-6 py-1.5 sm:py-2 border border-white/20 rounded-full text-[9px] sm:text-xs uppercase tracking-widest hover:bg-white/10 transition-colors bg-[#0A0A0F]/50 backdrop-blur-sm"
        >
          <span className="hidden sm:inline">Additional Resources</span>
          <span className="sm:hidden">Resources</span>
        </button>
        <button
          onClick={() => setShowLegend(true)}
          className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/80 hover:text-white bg-[#0A0A0F]/50 backdrop-blur-sm"
          title="Legend"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Body Container */}
      <div className="relative h-[70vh] sm:h-[85vh] max-h-[1000px] aspect-[1/2] mt-16 sm:mt-0">
        <HumanBodyImage className="w-full h-full" />
        
        {DATA.bodyParts.map((part) => {
          const pos = NODE_POSITIONS[part.id as BodyPartId];
          if (!pos) return null;
          
          const isHovered = hoveredNode === part.id;
          const category = part.games[0]?.category || 'Health';
          const posColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.Health;
          
          return (
            <div
              key={part.id}
              className="absolute group"
              style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredNode(part.id as BodyPartId)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedPart(part.id as BodyPartId)}
            >
              {/* Interaction Target */}
              <div className="relative flex items-center justify-center w-12 h-12 cursor-pointer z-10">
                <div 
                  className="absolute w-3 h-3 rounded-full transition-all duration-300 pointer-events-none"
                  style={{ 
                    backgroundColor: posColor,
                    boxShadow: isHovered ? `0 0 20px ${posColor}, 0 0 40px ${posColor}` : `0 0 10px ${posColor}`,
                    transform: isHovered ? 'scale(1.5)' : 'scale(1)'
                  }}
                />
                {/* Pulse ring */}
                <div 
                  className={cn(
                    "absolute w-full h-full border rounded-full opacity-0 pointer-events-none transition-opacity duration-300",
                    isHovered ? "opacity-100 animate-ping" : ""
                  )}
                  style={{ borderColor: posColor }}
                />
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute left-1/2 -translate-x-1/2 top-14 whitespace-nowrap bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded pointer-events-none z-20"
                  >
                    <div className="font-display text-sm tracking-wider uppercase text-white" style={{ color: posColor }}>
                      {part.label}
                    </div>
                    <div className="font-sans text-xs tracking-wide text-neutral-400 mt-1 uppercase">
                      {part.games.length} Project{part.games.length !== 1 ? 's' : ''}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedPart && (
          <ProjectModal 
            partId={selectedPart} 
            onClose={() => setSelectedPart(null)} 
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showResources && (
          <ResourcesModal onClose={() => setShowResources(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLegend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowLegend(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-2xl p-8"
            >
              <button 
                onClick={() => setShowLegend(false)}
                className="absolute top-4 right-4 z-20 p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="font-display text-2xl mb-6 tracking-wide uppercase text-white">Legend</h2>
              <div className="space-y-6">
                {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                  <div key={category} className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full relative"
                      style={{ 
                        backgroundColor: color,
                        boxShadow: `0 0 15px ${color}`
                      }}
                    >
                      <div 
                        className="absolute inset-0 border rounded-full opacity-50 animate-ping"
                        style={{ borderColor: color }}
                      />
                    </div>
                    <span className="font-sans text-sm tracking-widest uppercase text-neutral-300">
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

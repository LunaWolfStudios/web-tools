import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DATA } from '../data/config';
import { HumanBodyImage } from './HumanBodyImage';
import { cn } from '../lib/utils';
import { ProjectModal } from './ProjectModal';
import { ResourcesModal } from './ResourcesModal';
import { HelpCircle, X, Eye, EyeOff } from 'lucide-react';

type BodyPartId = 'eyes' | 'arms' | 'knees' | 'brain' | 'ears' | 'hands' | 'legs' | 'face' | 'pancreas';

const NODE_POSITIONS: Record<BodyPartId, { node: { x: number, y: number }, label: { x: number, y: number }, mid: { x: number, y: number }, align: 'left' | 'right' }> = {
  brain: { node: { x: 50, y: 3.5 }, label: { x: 70, y: 1 }, mid: { x: 60, y: 1 }, align: 'left' },
  eyes: { node: { x: 46.5, y: 7 }, label: { x: 25, y: 3 }, mid: { x: 35, y: 3 }, align: 'right' },
  face: { node: { x: 54, y: 10 }, label: { x: 75, y: 16 }, mid: { x: 65, y: 16 }, align: 'left' },
  ears: { node: { x: 40.5, y: 9 }, label: { x: 20, y: 17 }, mid: { x: 30, y: 17 }, align: 'right' },
  arms: { node: { x: 26, y: 29.5 }, label: { x: 15, y: 34 }, mid: { x: 20, y: 34 }, align: 'right' },
  pancreas: { node: { x: 63, y: 35 }, label: { x: 85, y: 32 }, mid: { x: 65, y: 32 }, align: 'left' },
  hands: { node: { x: 14.5, y: 51.5 }, label: { x: 10, y: 48 }, mid: { x: 11, y: 48 }, align: 'right' },
  legs: { node: { x: 65, y: 53.5 }, label: { x: 80, y: 62 }, mid: { x: 72, y: 62 }, align: 'left' },
  knees: { node: { x: 37, y: 69 }, label: { x: 20, y: 76 }, mid: { x: 28, y: 76 }, align: 'right' },
};

export const CATEGORY_COLORS: Record<string, string> = {
  Clinical: 'var(--color-neon-cyan)',
  Education: 'var(--color-neon-purple)',
  Fitness: 'var(--color-neon-green)'
};

export const BodyHub = () => {
  const [hoveredNode, setHoveredNode] = useState<BodyPartId | null>(null);
  const [selectedPart, setSelectedPart] = useState<{ partId: BodyPartId, gameIndex?: number } | null>(null);
  const [showResources, setShowResources] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);

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
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/80 hover:text-white bg-[#0A0A0F]/50 backdrop-blur-sm"
            title="Toggle Annotations"
          >
            {showAnnotations ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          <button
            onClick={() => setShowLegend(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/80 hover:text-white bg-[#0A0A0F]/50 backdrop-blur-sm"
            title="Legend"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Body Container */}
      <div className="relative h-[70vh] sm:h-[85vh] max-h-[1000px] aspect-[1/2] mt-16 sm:mt-0">
        <HumanBodyImage className="w-full h-full" />
        
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {DATA.bodyParts.map(part => {
             const pos = NODE_POSITIONS[part.id as BodyPartId];
             if (!pos) return null;
             const isHovered = hoveredNode === part.id;
             if (!showAnnotations && !isHovered) return null;
             const posColor = CATEGORY_COLORS[part.games[0]?.category || 'Clinical'] || CATEGORY_COLORS.Clinical;
             return (
               <g key={`line-${part.id}`}>
                 <polyline
                   points={`${pos.node.x},${pos.node.y} ${pos.mid.x},${pos.mid.y} ${pos.label.x},${pos.label.y}`}
                   fill="none"
                   stroke={posColor}
                   strokeWidth="1"
                   vectorEffect="non-scaling-stroke"
                   opacity={0.3}
                   strokeDasharray="1 2"
                 />
                 <AnimatePresence>
                   {isHovered && (
                     <motion.polyline
                       initial={{ strokeDasharray: "2 4", strokeDashoffset: 6, opacity: 0 }}
                       animate={{ strokeDashoffset: 0, opacity: 1 }}
                       transition={{ 
                         strokeDashoffset: { repeat: Infinity, duration: 1, ease: "linear" },
                         opacity: { duration: 0.3 }
                       }}
                       exit={{ opacity: 0 }}
                       points={`${pos.node.x},${pos.node.y} ${pos.mid.x},${pos.mid.y} ${pos.label.x},${pos.label.y}`}
                       fill="none"
                       stroke={posColor}
                       strokeWidth="2"
                       vectorEffect="non-scaling-stroke"
                       style={{ filter: `drop-shadow(0 0 5px ${posColor})` }}
                     />
                   )}
                 </AnimatePresence>
               </g>
             );
          })}
        </svg>

        {DATA.bodyParts.map((part) => {
          const pos = NODE_POSITIONS[part.id as BodyPartId];
          if (!pos) return null;
          
          const isHovered = hoveredNode === part.id;
          const category = part.games[0]?.category || 'Clinical';
          const posColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.Clinical;
          
          return (
            <React.Fragment key={part.id}>
              {/* Interaction Target */}
              <div
                className="absolute flex items-center justify-center w-12 h-12 cursor-pointer z-10 group"
                style={{ top: `${pos.node.y}%`, left: `${pos.node.x}%`, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setHoveredNode(part.id as BodyPartId)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedPart({ partId: part.id as BodyPartId, gameIndex: 0 })}
              >
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

              {/* Callout Annotation Label */}
              {(showAnnotations || isHovered) && (
                <div 
                  className="absolute pointer-events-auto z-20 group text-left w-max max-w-[28vw] sm:max-w-none sm:w-auto"
                  style={{ 
                    left: `${pos.label.x}%`, 
                    top: `${pos.label.y}%`,
                    transform: pos.align === 'left' ? 'translate(0%, -100%)' : 'translate(-100%, -100%)',
                  }}
                  onMouseEnter={() => setHoveredNode(part.id as BodyPartId)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedPart({ partId: part.id as BodyPartId, gameIndex: 0 })}
                >
                  <motion.div 
                     layout
                     className="border backdrop-blur-md flex flex-col overflow-hidden w-auto origin-bottom cursor-pointer hover:bg-white/5 transition-colors"
                     style={{ 
                       backgroundColor: `color-mix(in srgb, ${posColor} ${isHovered ? '25%' : '10%'}, transparent)`,
                       borderColor: posColor,
                       color: posColor,
                       boxShadow: isHovered ? `0 0 15px color-mix(in srgb, ${posColor} 40%, transparent)` : `0 0 5px color-mix(in srgb, ${posColor} 20%, transparent)`
                     }}
                  >
                    <div className="px-2 sm:px-3 py-1.5 font-display text-[10px] sm:text-[11px] tracking-wider uppercase whitespace-normal sm:whitespace-nowrap break-words sm:break-normal leading-tight">
                      {part.label}
                    </div>
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="px-2 sm:px-3 text-[8px] sm:text-[9px] font-sans text-neutral-300 whitespace-normal sm:whitespace-nowrap break-words sm:break-normal flex flex-col"
                        >
                          <div className="w-full h-px bg-white/20 mb-2" />
                          <div className="pb-2 flex flex-col gap-1.5 min-w-0">
                            {part.games.map((g, idx) => (
                               <div 
                                 key={idx} 
                                 className="hover:text-white transition-colors leading-tight"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setSelectedPart({ partId: part.id as BodyPartId, gameIndex: idx });
                                 }}
                               >
                                 {g.title}
                               </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedPart && (
          <ProjectModal 
            partId={selectedPart.partId} 
            initialGameIndex={selectedPart.gameIndex}
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
                {Object.entries(CATEGORY_COLORS).map(([category, color]) => {
                  const descriptions: Record<string, string> = {
                    Clinical: "Interactive games designed to support health through assessment, rehabilitation, and therapy",
                    Education: "Immersive games that teach concepts through gameplay and exploration",
                    Fitness: "High-energy games that promote physical activity, performance, and training"
                  };
                  return (
                    <div key={category} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
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
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-sm tracking-widest uppercase text-white mb-1">
                          {category}
                        </span>
                        <span className="font-sans text-xs text-neutral-400 leading-relaxed">
                          {descriptions[category]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

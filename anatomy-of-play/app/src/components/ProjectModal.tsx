import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DATA } from '../data/config';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { CATEGORY_COLORS } from './BodyHub';

export const ProjectModal = ({ partId, onClose }: { partId: string, onClose: () => void }) => {
  const partData = DATA.bodyParts.find(p => p.id === partId);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [enlargedMedia, setEnlargedMedia] = useState<string | null>(null);

  const game = partData?.games[currentProjectIndex];

  useEffect(() => {
    setCurrentMediaIndex(0);
  }, [currentProjectIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enlargedMedia || !game?.media) return;
      
      if (e.key === 'ArrowRight') {
        if (game.media.length) {
          setCurrentMediaIndex((prev) => {
            const nextIdx = (prev + 1) % game.media.length;
            setEnlargedMedia(game.media[nextIdx]);
            return nextIdx;
          });
        }
      } else if (e.key === 'ArrowLeft') {
        if (game.media.length) {
          setCurrentMediaIndex((prev) => {
            const prevIdx = (prev - 1 + game.media.length) % game.media.length;
            setEnlargedMedia(game.media[prevIdx]);
            return prevIdx;
          });
        }
      } else if (e.key === 'Escape') {
        setEnlargedMedia(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedMedia, game?.media]);

  if (!partData || !game) return null;

  const handleNextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % partData.games.length);
  };

  const handlePrevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + partData.games.length) % partData.games.length);
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (game.media.length) {
      setCurrentMediaIndex((prev) => (prev + 1) % game.media.length);
    }
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (game.media.length) {
      setCurrentMediaIndex((prev) => (prev - 1 + game.media.length) % game.media.length);
    }
  };

  const renderMedia = (src: string, isEnlarged: boolean = false) => {
    const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.mov');
    
    if (isVideo) {
      return (
        <video 
          src={src} 
          autoPlay 
          loop 
          muted 
          playsInline
          className={cn("object-contain", isEnlarged ? "max-w-full max-h-full rounded-lg drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]" : "w-full h-full p-4 cursor-pointer hover:scale-[1.02] transition-transform duration-500")}
          onClick={() => !isEnlarged && setEnlargedMedia(src)}
        />
      );
    }
    
    return (
      <img 
        src={src} 
        alt={`${game.title} media`}
        className={cn("object-contain", isEnlarged ? "max-w-full max-h-full rounded-lg drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]" : "w-full h-full p-4 cursor-pointer hover:scale-[1.02] transition-transform duration-500")}
        onClick={() => !isEnlarged && setEnlargedMedia(src)}
      />
    );
  };
  
  const categoryColor = CATEGORY_COLORS[game.category] || CATEGORY_COLORS.Health;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Enlarged Media Overlay */}
      <AnimatePresence>
        {enlargedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setEnlargedMedia(null)}
          >
            <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10">
              <X className="w-6 h-6" />
            </button>
            {renderMedia(enlargedMedia, true)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-5xl bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] min-h-[60vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Section: Left side on desktop, top on mobile */}
        <div className="w-full md:w-1/2 bg-black/80 relative border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center min-h-[300px] overflow-hidden group">
          {game.media && game.media.length > 0 ? (
            <>
              {renderMedia(game.media[currentMediaIndex])}
              <div className="absolute top-6 left-6 p-2 bg-black/60 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-white/70">
                <Maximize2 className="w-4 h-4" />
              </div>
              
              {game.media.length > 1 && (
                <>
                  <button onClick={handlePrevMedia} className="absolute left-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors shadow-lg">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={handleNextMedia} className="absolute right-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors shadow-lg">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {game.media.map((_, idx) => (
                      <div key={idx} className={cn("h-1.5 rounded-full transition-all duration-300", idx === currentMediaIndex ? "w-6" : "w-2 bg-white/30")} style={idx === currentMediaIndex ? { backgroundColor: categoryColor } : {}} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="relative text-center p-8 w-full h-full flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-black to-neutral-900 opacity-80" />
              <div className="w-32 h-32 mx-auto rounded-full border border-white/20 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border-t animate-spin" style={{ animationDuration: '3s', borderColor: categoryColor }} />
                <div className="w-16 h-16 rounded-full blur-xl" style={{ backgroundColor: categoryColor, opacity: 0.2 }} />
                <div className="font-display tracking-widest text-xs uppercase opacity-80 z-10" style={{ color: categoryColor }}>Simulation</div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
          <div className="p-8 md:p-12 overflow-y-auto flex-grow custom-scrollbar">
            <div className="flex items-center gap-3 mb-4">
              <span 
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] uppercase tracking-widest"
                style={{ color: categoryColor, borderColor: categoryColor }}
              >
                {game.category}
              </span>
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl mb-2 tracking-wide uppercase text-white leading-tight">{game.title}</h2>
            <p className="font-sans text-sm tracking-widest uppercase text-neutral-500 mb-8">By {game.company}</p>

            {/* Scrollable Summary */}
            <div 
              className="font-sans text-base md:text-lg leading-relaxed text-neutral-300 mb-8 border-l-2 pl-5 py-1 whitespace-pre-wrap"
              style={{ borderLeftColor: categoryColor }}
            >
              {game.summary}
            </div>

            <div>
              <h3 className="font-display text-sm tracking-widest uppercase text-neutral-500 mb-6 flex items-center gap-4">
                Key Highlights
                <div className="h-[1px] flex-grow bg-white/10" />
              </h3>
              
              <ul className="space-y-4">
                {game.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex gap-4 items-start bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                    <div 
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" 
                      style={{ backgroundColor: categoryColor, boxShadow: `0 0 8px ${categoryColor}` }}
                    />
                    <span className="font-sans text-sm text-neutral-200 tracking-wide leading-relaxed">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Project Navigation (if multiple projects in this body part) */}
          {partData.games.length > 1 && (
            <div className="border-t border-white/10 bg-black/40 p-4 shrink-0 flex items-center justify-between">
              <button 
                onClick={handlePrevProject} 
                className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                disabled={currentProjectIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" /> Prev Game
              </button>
              
              <div className="flex gap-1.5">
                {partData.games.map((_, idx) => (
                  <div key={idx} className={cn("w-1.5 h-1.5 rounded-full transition-colors", idx === currentProjectIndex ? "" : "bg-white/20")} style={idx === currentProjectIndex ? { backgroundColor: categoryColor } : {}} />
                ))}
              </div>

              <button 
                onClick={handleNextProject} 
                className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                disabled={currentProjectIndex === partData.games.length - 1}
              >
                Next Game <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const LandingScreen = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#0A0A0F] text-white overflow-hidden">
      
      {/* Background Particles/Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] bg-[var(--color-neon-cyan)]/5 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute w-[600px] h-[600px] bg-[var(--color-neon-purple)]/5 blur-[100px] rounded-full mix-blend-screen translate-x-20 translate-y-20" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 inline-flex overflow-hidden rounded-full p-[1px]"
        >
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--color-neon-cyan)_50%,transparent_100%)] opacity-30" />
          <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black/95 px-4 py-1.5 text-xs font-sans tracking-widest uppercase text-neutral-200 backdrop-blur-3xl">
            Portfolio Exhibition By Jeff
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight leading-none mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          Anatomy <br className="md:hidden" />of Play
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans text-base md:text-lg text-neutral-200 tracking-wide max-w-2xl mb-12 uppercase leading-relaxed font-medium"
        >
          Serious Games for Health and Fitness
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={onEnter}
          className="group relative px-8 py-4 bg-transparent overflow-hidden"
        >
          {/* Borders */}
          <div className="absolute inset-0 border border-white/20 transition-colors duration-300 group-hover:border-[var(--color-neon-cyan)]/50" />
          
          {/* Top/Bottom Lines */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-neon-cyan)] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-neon-purple)] to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-1000 ease-in-out" />

          {/* Glow */}
          <div className="absolute inset-0 bg-[var(--color-neon-cyan)]/0 group-hover:bg-[var(--color-neon-cyan)]/5 transition-colors duration-300 blur-md z-0" />
          
          <span className="relative z-10 font-display text-sm tracking-[0.2em] uppercase text-white group-hover:text-[var(--color-neon-cyan)] transition-colors duration-300 flex items-center gap-4">
            Enter Experience
            <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </motion.button>
      </div>
    </div>
  );
};

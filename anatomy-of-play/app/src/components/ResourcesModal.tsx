import React from 'react';
import { motion } from 'motion/react';
import { DATA } from '../data/config';
import { X, ExternalLink, Mail, Globe } from 'lucide-react';

export const ResourcesModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative w-full max-w-2xl bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div>
            <h2 className="font-display text-2xl tracking-widest uppercase mb-1">Additional Resources</h2>
            <p className="text-neutral-500 font-sans text-xs tracking-wide uppercase">Explore behind the scenes</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-8">
          
          <section>
            <h3 className="font-display text-xs tracking-widest uppercase text-neutral-500 mb-4 flex items-center gap-4">
              Studio & Contact
              <div className="h-[1px] flex-grow bg-white/10" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DATA.resources.studio.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="p-2 rounded bg-black/50 text-neutral-400 group-hover:text-[var(--color-neon-cyan)] transition-colors">
                    {item.type === 'email' ? <Mail className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-sans text-sm font-medium tracking-wide text-neutral-200 group-hover:text-white">{item.label}</div>
                    <div className="font-sans text-xs text-neutral-500 truncate max-w-[150px] sm:max-w-[200px]">
                      {item.value || item.url.replace(/^https?:\/\//, '')}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-display text-xs tracking-widest uppercase text-neutral-500 mb-4 flex items-center gap-4">
              Project Pages
              <div className="h-[1px] flex-grow bg-white/10" />
            </h3>
            <div className="space-y-2">
              {DATA.resources.projects.map((project, idx) => (
                <a
                  key={idx}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all group"
                >
                  <span className="font-sans text-sm tracking-wide text-neutral-300 group-hover:text-white">
                    {project.label}
                  </span>
                  <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-[var(--color-neon-purple)]" />
                </a>
              ))}
            </div>
          </section>

        </div>
      </motion.div>
    </div>
  );
};

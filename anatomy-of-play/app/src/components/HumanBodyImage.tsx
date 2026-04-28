import React from 'react';
import { cn } from '../lib/utils';

export const HumanBodyImage = ({ className }: { className?: string }) => (
  <div className={cn("relative flex items-center justify-center", className)}>
    {/* 
      USER INSTRUCTION: 
      To use your uploaded dark neon silhouette image:
      1. Upload it to the project files (e.g. 'body.png')
      2. Change the src below to your uploaded file (e.g. src="/body.png")
      3. Tweak the NODE_POSITIONS in BodyHub.tsx to align with your image's anatomy.
    */}
    <img 
      src="/anatomy-of-play-silhouette.png" 
      alt="Human Body Silhouette" 
      className="w-full h-full object-contain"
    />
  </div>
);

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
  description: string;
  oshaRef?: string;
  aiNote?: string;
}

export function InfoTooltip({ title, description, oshaRef, aiNote }: InfoTooltipProps) {
  return (
    <TooltipProvider delay={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="text-muted-foreground hover:text-foreground transition-colors outline-none ml-1">
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4 bg-popover border border-border shadow-xl">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
            
            {oshaRef && (
              <div className="pt-2 border-t border-border/50">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">OSHA Reference</span>
                <p className="text-xs text-foreground bg-muted/50 p-2 rounded-md font-mono">{oshaRef}</p>
              </div>
            )}
            
            {aiNote && (
              <div className="pt-2 border-t border-border/50">
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary block mb-1">AI Insights</span>
                <p className="text-xs text-primary/90">{aiNote}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

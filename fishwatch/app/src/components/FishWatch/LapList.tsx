import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lap } from "@/hooks/useStopwatch";
import { formatTime } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Undo2 } from "lucide-react";

interface LapListProps {
  laps: Lap[];
  onUndoLap: () => void;
}

export const LapList: React.FC<LapListProps> = ({ laps, onUndoLap }) => {
  if (laps.length === 0) return null;

  return (
    <Card className="w-full max-w-md mx-auto mt-8 overflow-hidden bg-ocean-blue/20 border-white/5 flex flex-col">
      <div className="p-4 border-b border-white/5 flex justify-between items-center text-xs font-mono text-slate-400 uppercase tracking-wider bg-ocean-blue/40">
        <div className="flex gap-8">
            <span>Lap #</span>
            <span>Split</span>
            <span>Total</span>
        </div>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={onUndoLap}
            className="h-6 px-2 text-xs hover:text-alert-red hover:bg-alert-red/10"
            title="Undo last lap"
        >
            <Undo2 className="w-3 h-3 mr-1" /> Undo
        </Button>
      </div>
      <div className="p-2 space-y-1">
        <AnimatePresence initial={false}>
          {laps.map((lap, index) => (
            <motion.div
              key={lap.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex justify-between items-center p-3 rounded-lg font-mono text-sm ${
                index === 0
                  ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="w-12 opacity-70">#{laps.length - index}</span>
              <span className="font-bold">{formatTime(lap.split)}</span>
              <span className="opacity-70">{formatTime(lap.elapsed)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};

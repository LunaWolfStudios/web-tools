import React from "react";
import { Button } from "@/components/ui/Button";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onLap: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onStart,
  onStop,
  onReset,
  onLap,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 my-8">
      <Button
        variant="secondary"
        size="icon"
        onClick={onReset}
        className="w-14 h-14 rounded-full"
        title="Reset"
      >
        <RotateCcw className="w-6 h-6" />
      </Button>

      {isRunning ? (
        <Button
          variant="danger"
          size="lg"
          onClick={onStop}
          className="w-24 h-24 rounded-full shadow-[0_0_30px_rgba(255,42,109,0.4)] hover:shadow-[0_0_50px_rgba(255,42,109,0.6)]"
        >
          <Pause className="w-10 h-10 fill-current" />
        </Button>
      ) : (
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          className="w-24 h-24 rounded-full shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:shadow-[0_0_50px_rgba(0,243,255,0.6)]"
        >
          <Play className="w-10 h-10 fill-current ml-1" />
        </Button>
      )}

      <Button
        variant="secondary"
        size="icon"
        onClick={onLap}
        disabled={!isRunning}
        className="w-14 h-14 rounded-full"
        title="Lap"
      >
        <Flag className="w-6 h-6" />
      </Button>
    </div>
  );
};

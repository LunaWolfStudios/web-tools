import React from "react";
import { motion } from "motion/react";
import { formatTime } from "@/lib/utils";

interface TimerDisplayProps {
  elapsedTime: number;
  isRunning: boolean;
  mode: "normal" | "green" | "red";
  progress: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  elapsedTime,
  isRunning,
  mode,
  progress,
}) => {
  const timeString = formatTime(elapsedTime);
  const [minutes, seconds, ms] = timeString.split(/[:.]/);

  // Determine colors based on mode
  const ringColor =
    mode === "green"
      ? "stroke-teal-glow"
      : mode === "red"
      ? "stroke-alert-red"
      : "stroke-neon-cyan";

  const glowColor =
    mode === "green"
      ? "shadow-[0_0_50px_rgba(0,255,157,0.3)]"
      : mode === "red"
      ? "shadow-[0_0_50px_rgba(255,42,109,0.3)]"
      : "shadow-[0_0_50px_rgba(0,243,255,0.3)]";

  return (
    <div className="relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96 mx-auto my-12 p-12">
      {/* Outer Glow Ring */}
      <motion.div
        className={`absolute inset-0 rounded-full border-4 border-white/5 ${glowColor}`}
        animate={{
          scale: isRunning ? [1, 1.02, 1] : 1,
          opacity: isRunning ? [0.8, 1, 0.8] : 0.5,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* SVG Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="48%"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-800"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="48%"
          fill="transparent"
          strokeWidth="4"
          strokeLinecap="round"
          className={`${ringColor} drop-shadow-[0_0_10px_currentColor]`}
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: progress,
          }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </svg>

      {/* Digital Time Display */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline font-mono font-bold tracking-tighter tabular-nums text-white drop-shadow-lg">
          <span className="text-6xl md:text-8xl">{minutes}</span>
          <span className="text-4xl md:text-6xl opacity-50 mx-1">:</span>
          <span className="text-6xl md:text-8xl">{seconds}</span>
        </div>
        <div className="text-2xl md:text-3xl font-mono text-slate-400 mt-2">
          .{ms}
        </div>
      </div>
    </div>
  );
};

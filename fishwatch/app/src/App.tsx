import React, { useState } from "react";
import { useStopwatch } from "@/hooks/useStopwatch";
import { useGameLogic } from "@/hooks/useGameLogic";
import { TimerDisplay } from "@/components/FishWatch/TimerDisplay";
import { Controls } from "@/components/FishWatch/Controls";
import { LapList } from "@/components/FishWatch/LapList";
import { SettingsPanel } from "@/components/FishWatch/SettingsPanel";
import { BackgroundFX } from "@/components/FishWatch/BackgroundFX";
import { motion, AnimatePresence } from "motion/react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    elapsedTime,
    isRunning,
    laps,
    start,
    stop,
    reset,
    lap,
    undoLap,
  } = useStopwatch();

  const {
    mode,
    intervalEnabled,
    setIntervalEnabled,
    intervalSeconds,
    setIntervalSeconds,
    greenRedEnabled,
    setGreenRedEnabled,
    greenDuration,
    setGreenDuration,
    redDuration,
    setRedDuration,
    greenRedSoundEnabled,
    setGreenRedSoundEnabled,
    greenSound,
    setGreenSound,
    redSound,
    setRedSound,

    selectedSound,
    setSelectedSound,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    availableSounds,
    previewSound,
    stopAllSounds,
    resetSettings,
    rippleTrigger,
    rippleColor,
    progress,
    isPlaying,
  } = useGameLogic({ elapsedTime, isRunning });

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-neon-cyan/30 overflow-hidden relative flex flex-col">
      <BackgroundFX isRunning={isRunning} mode={mode} rippleTrigger={rippleTrigger} rippleColor={rippleColor} />

      <main className="flex-1 flex flex-col items-center h-full overflow-y-auto custom-scrollbar">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center min-h-full">
            <header className="w-full flex justify-between items-center mb-4 md:mb-8 relative z-10 shrink-0">
                <div className="w-10"></div> {/* Spacer for centering */}
                <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
                >
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-teal-glow drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                    FishWatch
                </h1>
                <p className="text-slate-400 mt-1 font-mono text-[10px] md:text-sm tracking-widest uppercase block">
                    Every second makes a ripple
                </p>
                </motion.div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSettingsOpen(true)}
                    className="hover:bg-white/10"
                >
                    <Settings className="w-6 h-6 text-neon-cyan" />
                </Button>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md md:max-w-2xl gap-4 md:gap-8 pb-8">
                <TimerDisplay 
                elapsedTime={elapsedTime} 
                isRunning={isRunning} 
                mode={mode} 
                progress={progress}
                />

                <Controls
                isRunning={isRunning}
                onStart={start}
                onStop={stop}
                onReset={reset}
                onLap={lap}
                />

                <LapList laps={laps} onUndoLap={undoLap} />
            </div>
        </div>

        <AnimatePresence>
            {isSettingsOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50"
                >
                    <SettingsPanel
                        intervalEnabled={intervalEnabled}
                        setIntervalEnabled={setIntervalEnabled}
                        intervalSeconds={intervalSeconds}
                        setIntervalSeconds={setIntervalSeconds}
                        greenRedEnabled={greenRedEnabled}
                        setGreenRedEnabled={setGreenRedEnabled}
                        greenDuration={greenDuration}
                        setGreenDuration={setGreenDuration}
                        redDuration={redDuration}
                        setRedDuration={setRedDuration}
                        
                        greenRedSoundEnabled={greenRedSoundEnabled}
                        setGreenRedSoundEnabled={setGreenRedSoundEnabled}
                        greenSound={greenSound}
                        setGreenSound={setGreenSound}
                        redSound={redSound}
                        setRedSound={setRedSound}

                        selectedSound={selectedSound}
                        setSelectedSound={setSelectedSound}
                        volume={volume}
                        setVolume={setVolume}
                        isMuted={isMuted}
                        setIsMuted={setIsMuted}
                        availableSounds={availableSounds}
                        previewSound={previewSound}
                        stopAllSounds={stopAllSounds}
                        isPlaying={isPlaying}
                        resetSettings={resetSettings}
                        onClose={() => setIsSettingsOpen(false)}
                    />
                </motion.div>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
}

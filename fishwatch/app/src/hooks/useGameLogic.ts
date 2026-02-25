import { useState, useEffect, useRef } from "react";
import { useAudio, SoundType } from "./useAudio";
import { useLocalStorage } from "./useLocalStorage";

interface GameLogicProps {
  elapsedTime: number;
  isRunning: boolean;
}

export function useGameLogic({ elapsedTime, isRunning }: GameLogicProps) {
  // Settings
  const [intervalEnabled, setIntervalEnabled] = useLocalStorage("fishwatch-interval-enabled", true);
  const [intervalSeconds, setIntervalSeconds] = useLocalStorage("fishwatch-interval-seconds", 15);
  
  const [greenRedEnabled, setGreenRedEnabled] = useLocalStorage("fishwatch-greenred-enabled", false);
  const [greenDuration, setGreenDuration] = useLocalStorage("fishwatch-green-duration", 60);
  const [redDuration, setRedDuration] = useLocalStorage("fishwatch-red-duration", 30);
  
  const [greenRedSoundEnabled, setGreenRedSoundEnabled] = useLocalStorage("fishwatch-greenred-sound-enabled", false);
  const [greenSound, setGreenSound] = useLocalStorage<SoundType>("fishwatch-green-sound", "beep");
  const [redSound, setRedSound] = useLocalStorage<SoundType>("fishwatch-red-sound", "beep");

  const { play, playSound, stopAllSounds, ...audioProps } = useAudio();

  // State
  const [mode, setMode] = useState<"normal" | "green" | "red">("normal");
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const [rippleColor, setRippleColor] = useState<string>("#00f3ff");
  const [progress, setProgress] = useState(0);

  const lastIntervalRef = useRef<number>(0);
  const lastModeRef = useRef<"normal" | "green" | "red">("normal");

  // Logic Loop
  useEffect(() => {
    const currentSeconds = Math.floor(elapsedTime / 1000);
    let newMode: "normal" | "green" | "red" = "normal";
    let newProgress = 0;

    // --- Mode & Progress Calculation ---
    if (greenRedEnabled) {
      const totalCycle = greenDuration + redDuration;
      const cyclePosition = (elapsedTime / 1000) % totalCycle;

      if (cyclePosition < greenDuration) {
        newMode = "green";
        newProgress = cyclePosition / greenDuration;
      } else {
        newMode = "red";
        newProgress = (cyclePosition - greenDuration) / redDuration;
      }
    } else {
      newMode = "normal";
      if (intervalEnabled) {
        // Ensure linear progress
        newProgress = ((elapsedTime % (intervalSeconds * 1000)) / (intervalSeconds * 1000));
      } else {
        newProgress = ((elapsedTime % 60000) / 60000);
      }
    }
    
    setMode(newMode);
    setProgress(newProgress);

    // --- Event Triggers (Sound & Ripple) ---
    if (!isRunning) {
        lastIntervalRef.current = currentSeconds;
        lastModeRef.current = newMode;
        return;
    }

    // 1. Green/Red Transitions
    if (greenRedEnabled) {
        if (newMode !== lastModeRef.current) {
            // Mode changed!
            if (newMode === "red") {
                // Green just finished -> Red started
                setRippleColor("#ff2a6d"); // Red ripple for entering Red
                setRippleTrigger(prev => prev + 1);
                if (greenRedSoundEnabled) playSound(redSound); // Play "Red Started" sound
            } else if (newMode === "green") {
                // Red just finished -> Green started
                setRippleColor("#00ff9d"); // Green ripple for entering Green
                setRippleTrigger(prev => prev + 1);
                if (greenRedSoundEnabled) playSound(greenSound); // Play "Green Started" sound
            }
        }
    } 
    // 2. Normal Interval
    else if (intervalEnabled) {
        // Check if we crossed an interval boundary
        // We use integer seconds for the interval check to avoid multiple triggers
        if (currentSeconds > 0 && currentSeconds % intervalSeconds === 0 && currentSeconds !== lastIntervalRef.current) {
            play(); // Play standard interval sound
            setRippleColor("#00f3ff"); // Cyan ripple
            setRippleTrigger(prev => prev + 1);
        }
    }

    lastIntervalRef.current = currentSeconds;
    lastModeRef.current = newMode;

  }, [
    elapsedTime, 
    isRunning, 
    intervalEnabled, 
    intervalSeconds, 
    greenRedEnabled, 
    greenDuration, 
    redDuration,
    greenRedSoundEnabled,
    greenSound,
    redSound,
    play,
    playSound
  ]);

  const resetSettings = () => {
    setIntervalEnabled(true);
    setIntervalSeconds(15);
    setGreenRedEnabled(false);
    setGreenDuration(60);
    setRedDuration(30);
    setGreenRedSoundEnabled(false);
    setGreenSound("beep");
    setRedSound("beep");
    audioProps.setSelectedSound("beep");
    audioProps.setVolume(0.5);
    audioProps.setIsMuted(false);
  };

  return {
    mode,
    progress,
    rippleTrigger,
    rippleColor,
    
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

    ...audioProps,
    play,
    playSound,
    stopAllSounds,
    resetSettings,
    isPlaying: audioProps.isPlaying
  };
}

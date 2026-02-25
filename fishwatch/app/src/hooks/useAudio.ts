import { useCallback, useState, useEffect, useRef } from "react";
import useSound from "use-sound";

// We'll use online URLs for sounds for now, or we can use generated base64 if needed.
// For this demo, I'll use some placeholder URLs or standard beep sounds.
// Ideally, we would have these assets in the public folder.

const SOUNDS = {
  beep: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", // Digital beep
  bubble: "https://assets.mixkit.co/active_storage/sfx/2044/2044-preview.mp3", // Bubble pop
  chime: "https://assets.mixkit.co/active_storage/sfx/221/221-preview.mp3", // Soft chime
  alarm: "https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3", // Alarm tone
  woosh: "https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3", // Short air woosh
};

export type SoundType = keyof typeof SOUNDS;

export function useAudio() {
  const [selectedSound, setSelectedSound] = useState<SoundType>("bubble");
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load settings
  useEffect(() => {
    const storedSound = localStorage.getItem("fishwatch-sound") as SoundType;
    const storedVolume = localStorage.getItem("fishwatch-volume");
    const storedMute = localStorage.getItem("fishwatch-mute");

    if (storedSound && SOUNDS[storedSound]) setSelectedSound(storedSound);
    if (storedVolume) setVolume(parseFloat(storedVolume));
    if (storedMute) setIsMuted(storedMute === "true");
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem("fishwatch-sound", selectedSound);
    localStorage.setItem("fishwatch-volume", volume.toString());
    localStorage.setItem("fishwatch-mute", isMuted.toString());
  }, [selectedSound, volume, isMuted]);

  // We need to initialize hooks for all sounds because useSound is a hook
  // This is a bit heavy but ensures we can switch sounds easily.
  // Alternatively, we could just create an Audio object dynamically.
  // Given the requirement for volume control, use-sound is nice but static.
  // Let's use standard Audio API for dynamic flexibility.

  const playSound = useCallback((sound: SoundType) => {
    if (isMuted) return;
    const audio = new Audio(SOUNDS[sound]);
    audio.volume = volume;
    audio.play().catch(e => console.error("Audio play failed", e));
    // Keep track of playing audio if we want to stop them later?
    // For now, let's just add a simple stop mechanism if requested.
    // But Audio objects are fire-and-forget here.
    // To support "Stop All", we need to track them.
  }, [volume, isMuted]);

  // We need to refactor slightly to track active audio instances if we want to stop them.
  const activeAudioRef = useRef<HTMLAudioElement[]>([]);

  const playSoundTracked = useCallback((sound: SoundType) => {
    if (isMuted) return;
    const audio = new Audio(SOUNDS[sound]);
    audio.volume = volume;
    activeAudioRef.current.push(audio);
    setIsPlaying(true);
    
    audio.onended = () => {
        activeAudioRef.current = activeAudioRef.current.filter(a => a !== audio);
        if (activeAudioRef.current.length === 0) {
            setIsPlaying(false);
        }
    };

    audio.play().catch(e => {
        console.error("Audio play failed", e);
        activeAudioRef.current = activeAudioRef.current.filter(a => a !== audio);
        if (activeAudioRef.current.length === 0) {
            setIsPlaying(false);
        }
    });
  }, [volume, isMuted]);

  const stopAllSounds = useCallback(() => {
    activeAudioRef.current.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    activeAudioRef.current = [];
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    playSoundTracked(selectedSound);
  }, [playSoundTracked, selectedSound]);

  return {
    selectedSound,
    setSelectedSound,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    play, 
    playSound: playSoundTracked, 
    previewSound: playSoundTracked,
    stopAllSounds,
    isPlaying,
    availableSounds: Object.keys(SOUNDS) as SoundType[],
  };
}

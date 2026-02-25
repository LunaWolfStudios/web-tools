import { useState, useEffect, useRef, useCallback } from "react";

export interface Lap {
  id: number;
  timestamp: number;
  elapsed: number;
  split: number;
}

const STORAGE_KEYS = {
  START_TIME: "fishwatch-start-time",
  ACCUMULATED: "fishwatch-accumulated",
  LAPS: "fishwatch-laps",
  IS_RUNNING: "fishwatch-is-running",
};

export function useStopwatch() {
  // State for UI updates
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const requestRef = useRef<number | null>(null);

  // Load initial state
  useEffect(() => {
    const storedStartTime = localStorage.getItem(STORAGE_KEYS.START_TIME);
    const storedAccumulated = localStorage.getItem(STORAGE_KEYS.ACCUMULATED);
    const storedLaps = localStorage.getItem(STORAGE_KEYS.LAPS);
    const storedIsRunning = localStorage.getItem(STORAGE_KEYS.IS_RUNNING) === "true";

    const accumulated = storedAccumulated ? parseInt(storedAccumulated, 10) : 0;
    const startTime = storedStartTime ? parseInt(storedStartTime, 10) : null;

    if (storedLaps) {
      setLaps(JSON.parse(storedLaps));
    }

    if (storedIsRunning && startTime) {
      setIsRunning(true);
      // Calculate current elapsed time immediately
      const now = Date.now();
      setElapsedTime(now - startTime + accumulated);
    } else {
      setElapsedTime(accumulated);
    }
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const storedStartTime = localStorage.getItem(STORAGE_KEYS.START_TIME);
    const storedAccumulated = localStorage.getItem(STORAGE_KEYS.ACCUMULATED);
    
    if (storedStartTime) {
      const startTime = parseInt(storedStartTime, 10);
      const accumulated = storedAccumulated ? parseInt(storedAccumulated, 10) : 0;
      const now = Date.now();
      setElapsedTime(now - startTime + accumulated);
      requestRef.current = requestAnimationFrame(animate);
    }
  }, []);

  // Start/Resume
  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate]);

  const start = useCallback(() => {
    if (isRunning) return;

    const now = Date.now();
    localStorage.setItem(STORAGE_KEYS.START_TIME, now.toString());
    localStorage.setItem(STORAGE_KEYS.IS_RUNNING, "true");
    setIsRunning(true);
  }, [isRunning]);

  const stop = useCallback(() => {
    if (!isRunning) return;

    const storedStartTime = localStorage.getItem(STORAGE_KEYS.START_TIME);
    const storedAccumulated = localStorage.getItem(STORAGE_KEYS.ACCUMULATED);
    const startTime = storedStartTime ? parseInt(storedStartTime, 10) : Date.now();
    const accumulated = storedAccumulated ? parseInt(storedAccumulated, 10) : 0;

    const now = Date.now();
    const totalElapsed = now - startTime + accumulated;

    localStorage.setItem(STORAGE_KEYS.ACCUMULATED, totalElapsed.toString());
    localStorage.removeItem(STORAGE_KEYS.START_TIME);
    localStorage.setItem(STORAGE_KEYS.IS_RUNNING, "false");
    
    setElapsedTime(totalElapsed);
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    
    localStorage.removeItem(STORAGE_KEYS.START_TIME);
    localStorage.setItem(STORAGE_KEYS.ACCUMULATED, "0");
    localStorage.setItem(STORAGE_KEYS.IS_RUNNING, "false");
    localStorage.setItem(STORAGE_KEYS.LAPS, JSON.stringify([]));
  }, []);

  const lap = useCallback(() => {
    const now = Date.now();
    const currentElapsed = elapsedTime;
    const lastLapElapsed = laps.length > 0 ? laps[0].elapsed : 0;
    const split = currentElapsed - lastLapElapsed;

    const newLap: Lap = {
      id: laps.length + 1,
      timestamp: now,
      elapsed: currentElapsed,
      split: split,
    };

    const newLaps = [newLap, ...laps];
    setLaps(newLaps);
    localStorage.setItem(STORAGE_KEYS.LAPS, JSON.stringify(newLaps));
  }, [elapsedTime, laps]);

  const undoLap = useCallback(() => {
    if (laps.length === 0) return;
    const newLaps = laps.slice(1); // Remove the first item (most recent lap)
    setLaps(newLaps);
    localStorage.setItem(STORAGE_KEYS.LAPS, JSON.stringify(newLaps));
  }, [laps]);

  return {
    elapsedTime,
    isRunning,
    laps,
    start,
    stop,
    reset,
    lap,
    undoLap,
  };
}

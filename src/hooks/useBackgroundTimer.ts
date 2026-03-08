import { useEffect, useCallback, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_TIME_KEY = '@study_streak_background_time';
const MAX_BACKGROUND_TIME = 4 * 60 * 60 * 1000; // 4 hours

interface BackgroundTimerState {
  isActive: boolean;
  backgroundTime: number;
  totalElapsed: number;
}

interface UseBackgroundTimerReturn {
  backgroundTime: number;
  isInBackground: boolean;
  handleAppStateChange: (nextAppState: AppStateStatus, isSessionRunning: boolean) => void;
  getBackgroundElapsedTime: () => Promise<number>;
}

export function useBackgroundTimer(): UseBackgroundTimerReturn {
  const [isInBackground, setIsInBackground] = useState(false);
  const [backgroundTime, setBackgroundTime] = useState(0);
  const backgroundStartTimeRef = useRef<number | null>(null);

  // Save the time when app goes to background
  const saveBackgroundTime = useCallback(async () => {
    const now = Date.now();
    backgroundStartTimeRef.current = now;
    
    try {
      await AsyncStorage.setItem(BACKGROUND_TIME_KEY, JSON.stringify({
        backgroundStartTime: now,
        savedAt: now,
      }));
    } catch (e) {
      console.error('Failed to save background time:', e);
    }
  }, []);

  // Get the elapsed time while in background
  const getBackgroundElapsedTime = useCallback(async (): Promise<number> => {
    try {
      const saved = await AsyncStorage.getItem(BACKGROUND_TIME_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const backgroundStartTime = parsed.backgroundStartTime;
        const now = Date.now();
        const elapsed = now - backgroundStartTime;
        
        // Cap at max background time
        return Math.min(elapsed, MAX_BACKGROUND_TIME);
      }
    } catch (e) {
      console.error('Failed to get background time:', e);
    }
    return 0;
  }, []);

  // Clear background time tracking
  const clearBackgroundTime = useCallback(async () => {
    backgroundStartTimeRef.current = null;
    
    try {
      await AsyncStorage.removeItem(BACKGROUND_TIME_KEY);
    } catch (e) {
      console.error('Failed to clear background time:', e);
    }
  }, []);

  // Handle app state changes
  const handleAppStateChange = useCallback(async (
    nextAppState: AppStateStatus,
    isSessionRunning: boolean
  ) => {
    if (nextAppState === 'background' && isSessionRunning) {
      // App is going to background during an active session
      setIsInBackground(true);
      await saveBackgroundTime();
    } else if (nextAppState === 'active' && isInBackground) {
      // App is returning to foreground
      setIsInBackground(false);
      const elapsed = await getBackgroundElapsedTime();
      setBackgroundTime(elapsed);
      await clearBackgroundTime();
    }
  }, [isInBackground, saveBackgroundTime, getBackgroundElapsedTime, clearBackgroundTime]);

  // Listen to app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // This will be called by the component using this hook
      // The actual handling is done via handleAppStateChange
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    backgroundTime,
    isInBackground,
    handleAppStateChange,
    getBackgroundElapsedTime,
  };
}

// Hook that combines timer and background tracking
export function useTimerWithBackground() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const elapsedBeforeBackgroundRef = useRef(0);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (!isRunning) return;

      if (nextAppState === 'background') {
        // Save current elapsed time before going to background
        elapsedBeforeBackgroundRef.current = elapsedTime;
        await AsyncStorage.setItem(BACKGROUND_TIME_KEY, JSON.stringify({
          backgroundStartTime: Date.now(),
          elapsedBeforeBackground: elapsedTime,
        }));
      } else if (nextAppState === 'active') {
        // Calculate time spent in background
        const saved = await AsyncStorage.getItem(BACKGROUND_TIME_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const backgroundDuration = Date.now() - parsed.backgroundStartTime;
          
          // Update elapsed time with background duration
          const newElapsed = parsed.elapsedBeforeBackground + backgroundDuration;
          setElapsedTime(newElapsed);
          
          // Update start time reference to account for background time
          if (startTimeRef.current) {
            startTimeRef.current = Date.now() - newElapsed;
          }
          
          await AsyncStorage.removeItem(BACKGROUND_TIME_KEY);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isRunning, elapsedTime]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Date.now() - startTimeRef.current);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const start = useCallback(() => {
    startTimeRef.current = Date.now() - elapsedTime;
    setIsRunning(true);
  }, [elapsedTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
    const finalElapsed = elapsedTime;
    return finalElapsed;
  }, [elapsedTime]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    elapsedBeforeBackgroundRef.current = 0;
  }, []);

  const formattedTime = useCallback(() => {
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [elapsedTime]);

  return {
    elapsedTime,
    isRunning,
    start,
    stop,
    reset,
    formattedTime: formattedTime(),
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_STORAGE_KEY = '@study_streak_active_session';
const MAX_SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
const MIN_SESSION_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
  sessionId: string | null;
}

interface UseTimerReturn {
  isRunning: boolean;
  elapsedTime: number; // in milliseconds
  formattedTime: string; // MM:SS format
  startSession: () => Promise<string>;
  endSession: () => Promise<{ duration: number; isValid: boolean }>;
  pauseSession: () => void;
  resumeSession: () => void;
  hasActiveSession: boolean;
  recoverSession: () => Promise<boolean>;
  clearSession: () => Promise<void>;
}

export function useTimer(): UseTimerReturn {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
    sessionId: null,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format elapsed time as MM:SS
  const formattedTime = useCallback((): string => {
    const totalSeconds = Math.floor(state.elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [state.elapsedTime]);

  // Save session state to AsyncStorage
  const saveSessionState = useCallback(async (timerState: TimerState) => {
    try {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        ...timerState,
        savedAt: Date.now(),
      }));
    } catch (e) {
      console.error('Failed to save session state:', e);
    }
  }, []);

  // Load session state from AsyncStorage
  const loadSessionState = useCallback(async (): Promise<TimerState | null> => {
    try {
      const saved = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          isRunning: parsed.isRunning,
          startTime: parsed.startTime,
          elapsedTime: parsed.elapsedTime,
          sessionId: parsed.sessionId,
        };
      }
    } catch (e) {
      console.error('Failed to load session state:', e);
    }
    return null;
  }, []);

  // Clear session state from AsyncStorage
  const clearSessionState = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear session state:', e);
    }
  }, []);

  // Start a new session
  const startSession = useCallback(async (): Promise<string> => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    const newState: TimerState = {
      isRunning: true,
      startTime,
      elapsedTime: 0,
      sessionId,
    };
    
    setState(newState);
    await saveSessionState(newState);
    
    return sessionId;
  }, [saveSessionState]);

  // End the current session
  const endSession = useCallback(async (): Promise<{ duration: number; isValid: boolean }> => {
    const endTime = Date.now();
    const duration = state.startTime ? endTime - state.startTime : 0;
    const isValid = duration >= MIN_SESSION_DURATION;
    
    setState({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      sessionId: null,
    });
    
    await clearSessionState();
    
    return { duration, isValid };
  }, [state.startTime, clearSessionState]);

  // Pause the session
  const pauseSession = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, isRunning: false };
      saveSessionState(newState);
      return newState;
    });
  }, [saveSessionState]);

  // Resume the session
  const resumeSession = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, isRunning: true };
      saveSessionState(newState);
      return newState;
    });
  }, [saveSessionState]);

  // Clear session without saving
  const clearSession = useCallback(async () => {
    setState({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      sessionId: null,
    });
    await clearSessionState();
  }, [clearSessionState]);

  // Recover a session after app restart
  const recoverSession = useCallback(async (): Promise<boolean> => {
    const savedState = await loadSessionState();
    
    if (savedState && savedState.isRunning && savedState.startTime) {
      const now = Date.now();
      const elapsedSinceStart = now - savedState.startTime;
      
      // Check if session exceeded max duration
      if (elapsedSinceStart > MAX_SESSION_DURATION) {
        await clearSessionState();
        return false;
      }
      
      // Calculate current elapsed time
      const newElapsedTime = elapsedSinceStart;
      
      setState({
        isRunning: true,
        startTime: savedState.startTime,
        elapsedTime: newElapsedTime,
        sessionId: savedState.sessionId,
      });
      
      return true;
    }
    
    return false;
  }, [loadSessionState, clearSessionState]);

  // Timer interval effect
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const newElapsed = prev.startTime ? Date.now() - prev.startTime : 0;
          
          // Auto-end at max duration
          if (newElapsed >= MAX_SESSION_DURATION) {
            clearSessionState();
            return {
              isRunning: false,
              startTime: null,
              elapsedTime: MAX_SESSION_DURATION,
              sessionId: null,
            };
          }
          
          return { ...prev, elapsedTime: newElapsed };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.startTime, clearSessionState]);

  // Save state periodically while running
  useEffect(() => {
    if (state.isRunning) {
      const saveInterval = setInterval(() => {
        saveSessionState(state);
      }, 5000); // Save every 5 seconds
      
      return () => clearInterval(saveInterval);
    }
  }, [state.isRunning, state, saveSessionState]);

  return {
    isRunning: state.isRunning,
    elapsedTime: state.elapsedTime,
    formattedTime: formattedTime(),
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    hasActiveSession: state.sessionId !== null,
    recoverSession,
    clearSession,
  };
}

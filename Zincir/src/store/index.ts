/**
 * Zustand store for Zincir Study Tracker
 * Centralized state management with persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Session,
  Streak,
  UserPreferences,
  Statistics,
} from '../models';
import {
  getStreak,
  saveStreak,
  getUserPreferences,
  saveUserPreferences,
  getStatistics,
  calculateAndSaveStatistics,
  getAllSessions,
} from '../storage';

// ============================================================================
// Store State Interface
// ============================================================================

interface AppState {
  // Current active session (if any)
  activeSession: Session | null;
  
  // Current streak state
  streak: Streak | null;
  
  // User preferences
  preferences: UserPreferences | null;
  
  // Statistics
  statistics: Statistics | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeApp: () => Promise<void>;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: (note?: string) => Promise<void>;
  updateStreak: (streak: Streak) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  refreshStatistics: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeSession: null,
      streak: null,
      preferences: null,
      statistics: null,
      isLoading: false,
      error: null,

      // Initialize app - load all data from storage
      initializeApp: async () => {
        set({ isLoading: true, error: null });
        try {
          const [streakResult, prefsResult, statsResult] = await Promise.all([
            getStreak(),
            getUserPreferences(),
            getStatistics(),
          ]);

          if (streakResult.success && streakResult.data) {
            set({ streak: streakResult.data });
          }
          if (prefsResult.success && prefsResult.data) {
            set({ preferences: prefsResult.data });
          }
          if (statsResult.success && statsResult.data) {
            set({ statistics: statsResult.data });
          }
        } catch (error) {
          set({ error: 'Uygulama başlatılırken bir hata oluştu.' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Start a new study session
      startSession: () => {
        const now = Date.now();
        const today = new Date().toISOString().split('T')[0];
        
        const newSession: Session = {
          id: `${now}-${Math.random().toString(36).substr(2, 9)}`,
          startTime: now,
          endTime: 0,
          duration: 0,
          completed: false,
          date: today,
        };
        
        set({ activeSession: newSession, error: null });
      },

      // Pause the active session
      pauseSession: () => {
        const { activeSession } = get();
        if (!activeSession) return;
        
        const now = Date.now();
        const elapsed = now - activeSession.startTime;
        
        set({
          activeSession: {
            ...activeSession,
            duration: activeSession.duration + elapsed,
            startTime: now, // Reset start time for resume calculation
          },
        });
      },

      // Resume a paused session
      resumeSession: () => {
        const { activeSession } = get();
        if (!activeSession) return;
        
        set({
          activeSession: {
            ...activeSession,
            startTime: Date.now(),
          },
        });
      },

      // Complete the active session
      completeSession: async (note?: string) => {
        const { activeSession, streak, preferences } = get();
        if (!activeSession) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const now = Date.now();
          const finalDuration = activeSession.duration + (now - activeSession.startTime);
          
          const completedSession: Session = {
            ...activeSession,
            endTime: now,
            duration: finalDuration,
            completed: true,
            note,
          };
          
          // Save session to storage
          const { saveSession } = await import('../storage');
          const saveResult = await saveSession(completedSession);
          
          if (!saveResult.success) {
            set({ error: saveResult.error || 'Oturum kaydedilemedi.' });
            return;
          }
          
          // Update streak if daily goal is met
          if (streak && preferences) {
            const dailyGoalMs = preferences.dailyGoalMinutes * 60 * 1000;
            const newTodayStudyTime = streak.todayStudyTime + finalDuration;
            const todayCompleted = newTodayStudyTime >= dailyGoalMs;
            
            const updatedStreak: Streak = {
              ...streak,
              todayStudyTime: newTodayStudyTime,
              todayCompleted,
            };
            
            // If daily goal just completed, update streak count
            if (todayCompleted && !streak.todayCompleted) {
              updatedStreak.currentStreak += 1;
              if (updatedStreak.currentStreak > updatedStreak.longestStreak) {
                updatedStreak.longestStreak = updatedStreak.currentStreak;
              }
              updatedStreak.lastCompletedDate = new Date().toISOString().split('T')[0];
            }
            
            await saveStreak(updatedStreak);
            set({ streak: updatedStreak });
          }
          
          // Refresh statistics
          const statsResult = await calculateAndSaveStatistics();
          if (statsResult.success && statsResult.data) {
            set({ statistics: statsResult.data });
          }
          
          set({ activeSession: null });
        } catch (error) {
          set({ error: 'Oturum tamamlanırken bir hata oluştu.' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Update streak state
      updateStreak: async (streak: Streak) => {
        const result = await saveStreak(streak);
        if (result.success) {
          set({ streak });
        } else {
          set({ error: result.error || 'Zincir güncellenemedi.' });
        }
      },

      // Update user preferences
      updatePreferences: async (prefs: Partial<UserPreferences>) => {
        const { preferences } = get();
        if (!preferences) return;
        
        const { updateUserPreferences } = await import('../storage');
        const result = await updateUserPreferences(prefs);
        
        if (result.success && result.data) {
          set({ preferences: result.data });
        } else {
          set({ error: result.error || 'Tercihler güncellenemedi.' });
        }
      },

      // Refresh statistics from storage
      refreshStatistics: async () => {
        const result = await calculateAndSaveStatistics();
        if (result.success && result.data) {
          set({ statistics: result.data });
        }
      },

      // Clear error state
      clearError: () => set({ error: null }),
    }),
    {
      name: 'zincir-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist UI state, not the full data (that's in separate storage)
      partialize: (state) => ({
        activeSession: state.activeSession,
      }),
    }
  )
);

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
  WeeklyProgress,
} from '../models';
import {
  getStreak,
  saveStreak,
  getUserPreferences,
  saveUserPreferences,
  getStatistics,
  calculateAndSaveStatistics,
  getAllSessions,
  getWeeklyCalendarData,
  CalendarDayData,
  getWeeklyProgress,
  saveWeeklyProgress,
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

  // Weekly calendar data
  weeklyCalendar: CalendarDayData[] | null;

  // Weekly progress for flexible mode
  weeklyProgress: WeeklyProgress | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Toast notification
  toast: { message: string; visible: boolean } | null;

  // Actions
  initializeApp: () => Promise<void>;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: (note?: string) => Promise<void>;
  updateStreak: (streak: Streak) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  refreshStatistics: () => Promise<void>;
  refreshWeeklyCalendar: () => Promise<void>;
  refreshWeeklyProgress: () => Promise<void>;
  checkStreakStatus: () => Promise<void>;
  checkWeeklyGoalStatus: () => Promise<void>;
  acknowledgeStreakBreak: () => Promise<void>;
  useSecondChance: () => Promise<void>;
  showToast: (message: string) => void;
  hideToast: () => void;
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
      weeklyCalendar: null,
      weeklyProgress: null,
      isLoading: false,
      error: null,
      toast: null,

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

          // Check streak status on app init (for day changes)
          const { checkStreakStatus, checkWeeklyGoalStatus, refreshWeeklyCalendar, refreshWeeklyProgress } = get();
          await checkStreakStatus();
          await checkWeeklyGoalStatus();
          
          // Load weekly calendar data
          await refreshWeeklyCalendar();
          await refreshWeeklyProgress();
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
            const today = new Date().toISOString().split('T')[0];

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
              updatedStreak.lastCompletedDate = today;

              // For flexible mode, update weekly progress
              if (preferences.streakMode === 'flexible') {
                const weekId = getCurrentWeekId();
                const progressResult = await getWeeklyProgress(weekId);
                let weeklyProgress = progressResult.success && progressResult.data 
                  ? progressResult.data 
                  : {
                      weekId,
                      daysCompleted: 0,
                      daysTarget: preferences.flexibleDaysTarget,
                      goalAchieved: false,
                      completedDates: [],
                    };

                // Add today to completed dates if not already there
                if (!weeklyProgress.completedDates.includes(today)) {
                  weeklyProgress.completedDates.push(today);
                  weeklyProgress.daysCompleted = weeklyProgress.completedDates.length;
                  weeklyProgress.goalAchieved = weeklyProgress.daysCompleted >= preferences.flexibleDaysTarget;
                  await saveWeeklyProgress(weeklyProgress);
                  set({ weeklyProgress });
                }
              }
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

      // Check and update streak based on day changes (streak break detection)
      checkStreakStatus: async () => {
        const { streak, preferences } = get();
        if (!streak || !preferences) return;

        const today = new Date().toISOString().split('T')[0];
        const lastCompleted = streak.lastCompletedDate;

        // If no previous completion, nothing to check
        if (!lastCompleted) return;

        // If already completed today, nothing to check
        if (lastCompleted === today) return;

        // Calculate days difference
        const lastDate = new Date(lastCompleted);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // If more than 1 day has passed without completion, reset streak
        if (diffDays > 1) {
          // Check if second chance was used but user didn't complete the goal
          // In this case, we need to reset the streak
          const resetStreak: Streak = {
            ...streak,
            currentStreak: 0,
            todayCompleted: false,
            todayStudyTime: 0,
            streakBrokenAcknowledged: false,
            streakBrokenDate: today,
          };

          await saveStreak(resetStreak);
          set({ streak: resetStreak });
        } else if (diffDays === 1) {
          // New day, reset today's progress but keep streak
          const newDayStreak: Streak = {
            ...streak,
            todayCompleted: false,
            todayStudyTime: 0,
          };

          await saveStreak(newDayStreak);
          set({ streak: newDayStreak });
        }
      },

      // Acknowledge streak break (user has seen the notification)
      acknowledgeStreakBreak: async () => {
        const { streak } = get();
        if (!streak) return;

        const updatedStreak: Streak = {
          ...streak,
          streakBrokenAcknowledged: true,
        };

        await saveStreak(updatedStreak);
        set({ streak: updatedStreak });
      },

      // Use second chance to recover broken streak
      useSecondChance: async () => {
        const { streak, preferences } = get();
        if (!streak || !preferences) return;

        set({ isLoading: true, error: null });

        try {
          // Mark second chance as used
          const updatedPrefs = { ...preferences, secondChanceUsed: true };
          const { updateUserPreferences } = await import('../storage');
          await updateUserPreferences({ secondChanceUsed: true });
          set({ preferences: updatedPrefs });

          // Keep the streak intact - user needs to complete today's goal
          // The streak will be preserved if they complete 30 min today
          const updatedStreak: Streak = {
            ...streak,
            streakBrokenAcknowledged: true,
            streakBrokenDate: null, // Clear the break date as they're recovering
          };

          await saveStreak(updatedStreak);
          set({ streak: updatedStreak });

          // Show toast to encourage the user
          set({ 
            toast: { 
              message: 'İkinci şansınızı kullandınız! Bugün 30 dk çalışarak zincirinizi kurtarın.', 
              visible: true 
            } 
          });
          setTimeout(() => set({ toast: null }), 4000);
        } catch (error) {
          set({ error: 'İkinci şans kullanılırken bir hata oluştu.' });
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

      // Refresh weekly calendar data
      refreshWeeklyCalendar: async () => {
        const result = await getWeeklyCalendarData();
        if (result.success && result.data) {
          set({ weeklyCalendar: result.data });
        }
      },

      // Refresh weekly progress for flexible mode
      refreshWeeklyProgress: async () => {
        const { preferences } = get();
        if (!preferences) return;

        const weekId = getCurrentWeekId();
        const result = await getWeeklyProgress(weekId);
        
        if (result.success && result.data) {
          // Update days target from preferences
          const progress = result.data;
          if (progress.daysTarget !== preferences.flexibleDaysTarget) {
            progress.daysTarget = preferences.flexibleDaysTarget;
            await saveWeeklyProgress(progress);
          }
          set({ weeklyProgress: progress });
        }
      },

      // Check weekly goal status for flexible mode
      checkWeeklyGoalStatus: async () => {
        const { preferences, streak, weeklyProgress } = get();
        if (!preferences || !streak) return;

        // Only applies to flexible mode
        if (preferences.streakMode !== 'flexible') return;

        const weekId = getCurrentWeekId();
        const today = new Date().toISOString().split('T')[0];
        
        // Get current weekly progress
        let progress = weeklyProgress;
        if (!progress || progress.weekId !== weekId) {
          const result = await getWeeklyProgress(weekId);
          if (result.success && result.data) {
            progress = result.data;
          } else {
            progress = {
              weekId,
              daysCompleted: 0,
              daysTarget: preferences.flexibleDaysTarget,
              goalAchieved: false,
              completedDates: [],
            };
          }
        }

        // Check if today is already counted
        if (streak.todayCompleted && !progress.completedDates.includes(today)) {
          progress.completedDates.push(today);
          progress.daysCompleted = progress.completedDates.length;
          progress.goalAchieved = progress.daysCompleted >= progress.daysTarget;
          
          await saveWeeklyProgress(progress);
          set({ weeklyProgress: progress });
        }

        // Check if week ended without meeting goal
        const todayDay = new Date().getDay(); // 0 = Sunday
        if (todayDay === 0 && !progress.goalAchieved && progress.daysCompleted > 0) {
          // Week ended (Sunday) and goal not achieved - break streak
          if (streak.currentStreak > 0) {
            const resetStreak: Streak = {
              ...streak,
              currentStreak: 0,
              todayCompleted: false,
              todayStudyTime: 0,
              streakBrokenAcknowledged: false,
              streakBrokenDate: today,
            };
            await saveStreak(resetStreak);
            set({ streak: resetStreak });
          }
        }
      },

      // Show toast notification
      showToast: (message: string) => {
        set({ toast: { message, visible: true } });
        // Auto-hide after 3 seconds
        setTimeout(() => {
          set({ toast: null });
        }, 3000);
      },

      // Hide toast notification
      hideToast: () => set({ toast: null }),

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

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the current week ID in YYYY-Www format (e.g., 2024-W12)
 */
function getCurrentWeekId(): string {
  const now = new Date();
  const year = now.getFullYear();
  
  // Get the week number
  const startOfYear = new Date(year, 0, 1);
  const diff = now.getTime() - startOfYear.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.floor(diff / oneWeek) + 1;
  
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

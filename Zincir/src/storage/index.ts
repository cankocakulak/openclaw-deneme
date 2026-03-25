/**
 * Storage layer for Zincir Study Tracker
 * Provides offline-first data persistence using AsyncStorage
 * All operations include error handling and user-friendly error messages
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Session,
  Streak,
  UserPreferences,
  WeeklyProgress,
  Statistics,
  StorageKeys,
  StorageResult,
} from '../models';

// ============================================================================
// Session Storage Operations
// ============================================================================

/**
 * Save a session to storage
 */
export async function saveSession(session: Session): Promise<StorageResult<void>> {
  try {
    const existingData = await AsyncStorage.getItem(StorageKeys.SESSIONS);
    const sessions: Session[] = existingData ? JSON.parse(existingData) : [];
    
    // Check if session already exists (update case)
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    await AsyncStorage.setItem(StorageKeys.SESSIONS, JSON.stringify(sessions));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Bir hata oluştu. Verileriniz güvende, lütfen tekrar deneyin.',
    };
  }
}

/**
 * Get all sessions from storage
 */
export async function getAllSessions(): Promise<StorageResult<Session[]>> {
  try {
    const data = await AsyncStorage.getItem(StorageKeys.SESSIONS);
    const sessions: Session[] = data ? JSON.parse(data) : [];
    return { success: true, data: sessions };
  } catch (error) {
    return {
      success: false,
      error: 'Oturum verileri okunurken bir hata oluştu.',
    };
  }
}

/**
 * Get sessions for a specific date
 */
export async function getSessionsByDate(date: string): Promise<StorageResult<Session[]>> {
  try {
    const result = await getAllSessions();
    if (!result.success || !result.data) {
      return result as StorageResult<Session[]>;
    }
    
    const sessions = result.data.filter(s => s.date === date);
    return { success: true, data: sessions };
  } catch (error) {
    return {
      success: false,
      error: 'Tarihe göre oturumlar alınırken bir hata oluştu.',
    };
  }
}

/**
 * Get sessions for a date range
 */
export async function getSessionsByDateRange(
  startDate: string,
  endDate: string
): Promise<StorageResult<Session[]>> {
  try {
    const result = await getAllSessions();
    if (!result.success || !result.data) {
      return result as StorageResult<Session[]>;
    }
    
    const sessions = result.data.filter(s => s.date >= startDate && s.date <= endDate);
    return { success: true, data: sessions };
  } catch (error) {
    return {
      success: false,
      error: 'Tarih aralığındaki oturumlar alınırken bir hata oluştu.',
    };
  }
}

/**
 * Delete a session by ID
 */
export async function deleteSession(sessionId: string): Promise<StorageResult<void>> {
  try {
    const result = await getAllSessions();
    if (!result.success || !result.data) {
      return result as StorageResult<void>;
    }
    
    const sessions = result.data.filter(s => s.id !== sessionId);
    await AsyncStorage.setItem(StorageKeys.SESSIONS, JSON.stringify(sessions));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Oturum silinirken bir hata oluştu.',
    };
  }
}

/**
 * Delete all sessions (use with caution)
 */
export async function clearAllSessions(): Promise<StorageResult<void>> {
  try {
    await AsyncStorage.removeItem(StorageKeys.SESSIONS);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Oturumlar temizlenirken bir hata oluştu.',
    };
  }
}

// ============================================================================
// Streak Storage Operations
// ============================================================================

const DEFAULT_STREAK: Streak = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  todayCompleted: false,
  todayStudyTime: 0,
  dailyGoalMs: 30 * 60 * 1000, // 30 minutes in milliseconds
};

/**
 * Get current streak state
 */
export async function getStreak(): Promise<StorageResult<Streak>> {
  try {
    const data = await AsyncStorage.getItem(StorageKeys.STREAK);
    const streak: Streak = data ? JSON.parse(data) : DEFAULT_STREAK;
    return { success: true, data: streak };
  } catch (error) {
    return {
      success: false,
      error: 'Zincir durumu okunurken bir hata oluştu.',
    };
  }
}

/**
 * Save streak state
 */
export async function saveStreak(streak: Streak): Promise<StorageResult<void>> {
  try {
    await AsyncStorage.setItem(StorageKeys.STREAK, JSON.stringify(streak));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Zincir durumu kaydedilirken bir hata oluştu.',
    };
  }
}

/**
 * Reset streak to initial state
 */
export async function resetStreak(): Promise<StorageResult<void>> {
  try {
    await AsyncStorage.setItem(StorageKeys.STREAK, JSON.stringify(DEFAULT_STREAK));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Zincir sıfırlanırken bir hata oluştu.',
    };
  }
}

// ============================================================================
// User Preferences Storage Operations
// ============================================================================

const DEFAULT_PREFERENCES: UserPreferences = {
  dailyGoalMinutes: 30,
  streakMode: 'daily',
  flexibleDaysTarget: 5,
  notificationTime: '20:00',
  notificationsEnabled: true,
  secondChanceUsed: false,
  theme: 'system',
  firstLaunchDate: null,
};

/**
 * Get user preferences
 */
export async function getUserPreferences(): Promise<StorageResult<UserPreferences>> {
  try {
    const data = await AsyncStorage.getItem(StorageKeys.USER_PREFERENCES);
    const prefs: UserPreferences = data ? JSON.parse(data) : DEFAULT_PREFERENCES;
    return { success: true, data: prefs };
  } catch (error) {
    return {
      success: false,
      error: 'Kullanıcı tercihleri okunurken bir hata oluştu.',
    };
  }
}

/**
 * Save user preferences
 */
export async function saveUserPreferences(prefs: UserPreferences): Promise<StorageResult<void>> {
  try {
    await AsyncStorage.setItem(StorageKeys.USER_PREFERENCES, JSON.stringify(prefs));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Tercihler kaydedilirken bir hata oluştu.',
    };
  }
}

/**
 * Update partial user preferences
 */
export async function updateUserPreferences(
  partialPrefs: Partial<UserPreferences>
): Promise<StorageResult<UserPreferences>> {
  try {
    const result = await getUserPreferences();
    if (!result.success || !result.data) {
      return result as StorageResult<UserPreferences>;
    }
    
    const updatedPrefs = { ...result.data, ...partialPrefs };
    await AsyncStorage.setItem(StorageKeys.USER_PREFERENCES, JSON.stringify(updatedPrefs));
    return { success: true, data: updatedPrefs };
  } catch (error) {
    return {
      success: false,
      error: 'Tercihler güncellenirken bir hata oluştu.',
    };
  }
}

// ============================================================================
// Weekly Progress Storage Operations
// ============================================================================

/**
 * Get weekly progress for a specific week
 */
export async function getWeeklyProgress(weekId: string): Promise<StorageResult<WeeklyProgress>> {
  try {
    const data = await AsyncStorage.getItem(StorageKeys.WEEKLY_PROGRESS);
    const allProgress: Record<string, WeeklyProgress> = data ? JSON.parse(data) : {};
    const progress = allProgress[weekId] || {
      weekId,
      daysCompleted: 0,
      daysTarget: 5,
      goalAchieved: false,
      completedDates: [],
    };
    return { success: true, data: progress };
  } catch (error) {
    return {
      success: false,
      error: 'Haftalık ilerleme okunurken bir hata oluştu.',
    };
  }
}

/**
 * Save weekly progress
 */
export async function saveWeeklyProgress(progress: WeeklyProgress): Promise<StorageResult<void>> {
  try {
    const data = await AsyncStorage.getItem(StorageKeys.WEEKLY_PROGRESS);
    const allProgress: Record<string, WeeklyProgress> = data ? JSON.parse(data) : {};
    allProgress[progress.weekId] = progress;
    await AsyncStorage.setItem(StorageKeys.WEEKLY_PROGRESS, JSON.stringify(allProgress));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Haftalık ilerleme kaydedilirken bir hata oluştu.',
    };
  }
}

// ============================================================================
// Statistics Storage Operations
// ============================================================================

/**
 * Calculate and save statistics based on all sessions
 */
export async function calculateAndSaveStatistics(): Promise<StorageResult<Statistics>> {
  try {
    const sessionsResult = await getAllSessions();
    const streakResult = await getStreak();
    
    if (!sessionsResult.success || !sessionsResult.data) {
      return { success: false, error: sessionsResult.error || 'Oturum verileri alınamadı.' };
    }
    if (!streakResult.success || !streakResult.data) {
      return { success: false, error: streakResult.error || 'Zincir verileri alınamadı.' };
    }
    
    const sessions = sessionsResult.data;
    const streak = streakResult.data;
    
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.date === today);
    const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    
    // Calculate week total (last 7 days)
    const weekDates = getLast7Days();
    const weekSessions = sessions.filter(s => weekDates.includes(s.date));
    const weekTotal = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    
    // Calculate month total (current month)
    const currentMonth = today.substring(0, 7); // YYYY-MM
    const monthSessions = sessions.filter(s => s.date.startsWith(currentMonth));
    const monthTotal = monthSessions.reduce((sum, s) => sum + s.duration, 0);
    
    // Calculate last 7 days breakdown
    const last7Days = weekDates.map(date => {
      const daySessions = sessions.filter(s => s.date === date);
      return daySessions.reduce((sum, s) => sum + s.duration, 0);
    });
    
    const stats: Statistics = {
      todayTotal,
      weekTotal,
      monthTotal,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      last7Days,
      totalSessions: sessions.filter(s => s.completed).length,
    };
    
    await AsyncStorage.setItem(StorageKeys.STATISTICS, JSON.stringify(stats));
    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error: 'İstatistikler hesaplanırken bir hata oluştu.',
    };
  }
}

/**
 * Get cached statistics
 */
export async function getStatistics(): Promise<StorageResult<Statistics>> {
  try {
    const data = await AsyncStorage.getItem(StorageKeys.STATISTICS);
    if (!data) {
      // Calculate if not cached
      return calculateAndSaveStatistics();
    }
    const stats: Statistics = JSON.parse(data);
    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error: 'İstatistikler okunurken bir hata oluştu.',
    };
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the last 7 days as YYYY-MM-DD strings
 */
function getLast7Days(): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

/**
 * Clear all app data (use with caution - mainly for testing)
 */
export async function clearAllData(): Promise<StorageResult<void>> {
  try {
    await AsyncStorage.removeItem(StorageKeys.SESSIONS);
    await AsyncStorage.removeItem(StorageKeys.STREAK);
    await AsyncStorage.removeItem(StorageKeys.USER_PREFERENCES);
    await AsyncStorage.removeItem(StorageKeys.WEEKLY_PROGRESS);
    await AsyncStorage.removeItem(StorageKeys.STATISTICS);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Veriler temizlenirken bir hata oluştu.',
    };
  }
}

/**
 * Check if storage is working properly
 */
export async function checkStorageHealth(): Promise<StorageResult<boolean>> {
  try {
    const testKey = '@zincir:health_check';
    const testValue = 'ok';
    await AsyncStorage.setItem(testKey, testValue);
    const retrieved = await AsyncStorage.getItem(testKey);
    await AsyncStorage.removeItem(testKey);
    return { success: true, data: retrieved === testValue };
  } catch (error) {
    return {
      success: false,
      error: 'Depolama sistemi çalışmıyor. Lütfen uygulamayı yeniden başlatın.',
    };
  }
}

/**
 * Data models for Zincir Study Tracker
 * Defines the core data structures used throughout the app
 */

/**
 * Represents a single study session
 */
export interface Session {
  /** Unique identifier for the session */
  id: string;
  /** Start time of the session */
  startTime: number;
  /** End time of the session (0 if still active) */
  endTime: number;
  /** Duration in milliseconds */
  duration: number;
  /** Whether the session was completed (not abandoned) */
  completed: boolean;
  /** Optional note attached to the session (max 140 chars) */
  note?: string;
  /** Date string in YYYY-MM-DD format for easy querying */
  date: string;
}

/**
 * Represents the current streak state
 */
export interface Streak {
  /** Current streak count in days */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** Date of the last completed day (YYYY-MM-DD) */
  lastCompletedDate: string | null;
  /** Whether the daily goal was completed today */
  todayCompleted: boolean;
  /** Total study time today in milliseconds */
  todayStudyTime: number;
  /** Daily goal in milliseconds (default: 30 minutes = 1800000ms) */
  dailyGoalMs: number;
  /** Whether streak was broken and not yet acknowledged by user */
  streakBrokenAcknowledged: boolean;
  /** Date when streak was broken (YYYY-MM-DD), null if not broken */
  streakBrokenDate: string | null;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  /** Daily goal in minutes (default: 30) */
  dailyGoalMinutes: number;
  /** Streak mode: 'daily' or 'flexible' */
  streakMode: 'daily' | 'flexible';
  /** For flexible mode: days per week target (5 or 6) */
  flexibleDaysTarget: number;
  /** Notification time in HH:mm format (default: '20:00') */
  notificationTime: string;
  /** Whether notifications are enabled */
  notificationsEnabled: boolean;
  /** Whether second chance has been used (one-time) */
  secondChanceUsed: boolean;
  /** App theme preference */
  theme: 'light' | 'dark' | 'system';
  /** First app launch date */
  firstLaunchDate: string | null;
}

/**
 * Weekly progress tracking for flexible mode
 */
export interface WeeklyProgress {
  /** Week identifier in YYYY-Www format (e.g., 2024-W12) */
  weekId: string;
  /** Days completed this week */
  daysCompleted: number;
  /** Target days for this week */
  daysTarget: number;
  /** Whether weekly goal was achieved */
  goalAchieved: boolean;
  /** Completed dates in YYYY-MM-DD format */
  completedDates: string[];
}

/**
 * Statistics summary for display
 */
export interface Statistics {
  /** Total study time today in milliseconds */
  todayTotal: number;
  /** Total study time this week in milliseconds */
  weekTotal: number;
  /** Total study time this month in milliseconds */
  monthTotal: number;
  /** Current streak count */
  currentStreak: number;
  /** Longest streak ever */
  longestStreak: number;
  /** Last 7 days study times in milliseconds (index 0 = 7 days ago) */
  last7Days: number[];
  /** Total sessions completed */
  totalSessions: number;
}

/**
 * Storage keys used in the app
 */
export enum StorageKeys {
  SESSIONS = '@zincir:sessions',
  STREAK = '@zincir:streak',
  USER_PREFERENCES = '@zincir:preferences',
  WEEKLY_PROGRESS = '@zincir:weekly_progress',
  STATISTICS = '@zincir:statistics',
}

/**
 * Helper type for storage operations result
 */
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

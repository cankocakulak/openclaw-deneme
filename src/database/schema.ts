// Database schema definitions for Study Streak
// Colors from UX spec:
// Primary: Sage green #7C9A6B
// Accent: Warm amber #F4A261
// Success: Soft moss green #8FB573
// Error: Muted terracotta #E07A5F
// Warning: Gentle gold #E9C46A
// Info: Sky blue #87CEEB
// Background: Warm off-white #FDFCF8
// Surface: Soft cream #F5F3EE
// Text Primary: Deep charcoal #2D3436
// Text Secondary: Warm gray #636E72

export interface Session {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  isCompleted: boolean;
  note: string | null;
  tags: string;
  createdAt: number;
}

export interface Streak {
  id: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  streakStartDate: string;
}

export interface GardenState {
  id: string;
  plantCount: number;
  growthStage: number;
  healthLevel: number;
  lastWateredDate: string;
  theme: string;
  isFrozen: boolean;
}

export interface UserSettings {
  id: string;
  reminderEnabled: boolean;
  reminderTime: string;
  weeklyGoalHours: number | null;
  currentTheme: string;
  hasCompletedOnboarding: boolean;
}

export interface StreakFreeze {
  id: string;
  weekStartDate: string;
  isUsed: boolean;
  usedDate: string | null;
}

// SQL Schema
export const SCHEMA = {
  sessions: `
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      start_time INTEGER NOT NULL,
      end_time INTEGER,
      duration INTEGER DEFAULT 0,
      is_completed INTEGER DEFAULT 0,
      note TEXT,
      tags TEXT DEFAULT '[]',
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
    CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
  `,
  
  streaks: `
    CREATE TABLE IF NOT EXISTS streaks (
      id TEXT PRIMARY KEY DEFAULT 'current',
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_study_date TEXT,
      streak_start_date TEXT
    );
  `,
  
  garden_state: `
    CREATE TABLE IF NOT EXISTS garden_state (
      id TEXT PRIMARY KEY DEFAULT 'current',
      plant_count INTEGER DEFAULT 1,
      growth_stage INTEGER DEFAULT 0,
      health_level INTEGER DEFAULT 100,
      last_watered_date TEXT,
      theme TEXT DEFAULT 'default',
      is_frozen INTEGER DEFAULT 0
    );
  `,
  
  user_settings: `
    CREATE TABLE IF NOT EXISTS user_settings (
      id TEXT PRIMARY KEY DEFAULT 'current',
      reminder_enabled INTEGER DEFAULT 1,
      reminder_time TEXT DEFAULT '19:00',
      weekly_goal_hours INTEGER,
      current_theme TEXT DEFAULT 'default',
      has_completed_onboarding INTEGER DEFAULT 0
    );
  `,
  
  streak_freezes: `
    CREATE TABLE IF NOT EXISTS streak_freezes (
      id TEXT PRIMARY KEY,
      week_start_date TEXT NOT NULL,
      is_used INTEGER DEFAULT 0,
      used_date TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_freezes_week ON streak_freezes(week_start_date);
  `
};

// Default values
export const DEFAULT_SETTINGS: Omit<UserSettings, 'id'> = {
  reminderEnabled: true,
  reminderTime: '19:00',
  weeklyGoalHours: null,
  currentTheme: 'default',
  hasCompletedOnboarding: false,
};

export const DEFAULT_STREAK: Omit<Streak, 'id'> = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: '',
  streakStartDate: '',
};

export const DEFAULT_GARDEN: Omit<GardenState, 'id'> = {
  plantCount: 1,
  growthStage: 0,
  healthLevel: 100,
  lastWateredDate: '',
  theme: 'default',
  isFrozen: false,
};

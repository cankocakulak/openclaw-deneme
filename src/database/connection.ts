import * as SQLite from 'expo-sqlite';
import { SCHEMA } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('study_streak.db');
    await initializeDatabase();
  }
  return db;
}

export async function initializeDatabase(): Promise<void> {
  const database = await SQLite.openDatabaseAsync('study_streak.db');
  
  // Enable foreign keys
  await database.execAsync('PRAGMA foreign_keys = ON;');
  
  // Create tables
  await database.execAsync(SCHEMA.sessions);
  await database.execAsync(SCHEMA.streaks);
  await database.execAsync(SCHEMA.garden_state);
  await database.execAsync(SCHEMA.user_settings);
  await database.execAsync(SCHEMA.streak_freezes);
  
  // Insert default values if not exists
  await database.runAsync(`
    INSERT OR IGNORE INTO streaks (id, current_streak, longest_streak, last_study_date, streak_start_date)
    VALUES ('current', 0, 0, '', '')
  `);
  
  await database.runAsync(`
    INSERT OR IGNORE INTO garden_state (id, plant_count, growth_stage, health_level, last_watered_date, theme, is_frozen)
    VALUES ('current', 1, 0, 100, '', 'default', 0)
  `);
  
  await database.runAsync(`
    INSERT OR IGNORE INTO user_settings (id, reminder_enabled, reminder_time, weekly_goal_hours, current_theme, has_completed_onboarding)
    VALUES ('current', 1, '19:00', NULL, 'default', 0)
  `);
  
  console.log('Database initialized successfully');
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

export async function resetDatabase(): Promise<void> {
  const database = await getDatabase();
  
  await database.execAsync(`
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS streaks;
    DROP TABLE IF EXISTS garden_state;
    DROP TABLE IF EXISTS user_settings;
    DROP TABLE IF EXISTS streak_freezes;
  `);
  
  await initializeDatabase();
}

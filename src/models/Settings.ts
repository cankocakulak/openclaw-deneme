import { getDatabase } from '../database/connection';
import { UserSettings, DEFAULT_SETTINGS } from '../database/schema';

export class SettingsModel {
  static async get(): Promise<UserSettings> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{
      id: string;
      reminder_enabled: number;
      reminder_time: string;
      weekly_goal_hours: number | null;
      current_theme: string;
      has_completed_onboarding: number;
    }>('SELECT * FROM user_settings WHERE id = ?', ['current']);
    
    if (!result) {
      return { id: 'current', ...DEFAULT_SETTINGS };
    }
    
    return {
      id: result.id,
      reminderEnabled: result.reminder_enabled === 1,
      reminderTime: result.reminder_time,
      weeklyGoalHours: result.weekly_goal_hours,
      currentTheme: result.current_theme,
      hasCompletedOnboarding: result.has_completed_onboarding === 1,
    };
  }

  static async update(updates: Partial<Omit<UserSettings, 'id'>>): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const values: (string | number | null)[] = [];
    
    if (updates.reminderEnabled !== undefined) {
      sets.push('reminder_enabled = ?');
      values.push(updates.reminderEnabled ? 1 : 0);
    }
    if (updates.reminderTime !== undefined) {
      sets.push('reminder_time = ?');
      values.push(updates.reminderTime);
    }
    if (updates.weeklyGoalHours !== undefined) {
      sets.push('weekly_goal_hours = ?');
      values.push(updates.weeklyGoalHours);
    }
    if (updates.currentTheme !== undefined) {
      sets.push('current_theme = ?');
      values.push(updates.currentTheme);
    }
    if (updates.hasCompletedOnboarding !== undefined) {
      sets.push('has_completed_onboarding = ?');
      values.push(updates.hasCompletedOnboarding ? 1 : 0);
    }
    
    if (sets.length === 0) return;
    
    values.push('current');
    await db.runAsync(`UPDATE user_settings SET ${sets.join(', ')} WHERE id = ?`, values);
  }

  static async completeOnboarding(): Promise<void> {
    await this.update({ hasCompletedOnboarding: true });
  }

  static async setReminderTime(time: string): Promise<void> {
    await this.update({ reminderTime: time });
  }

  static async toggleReminders(enabled: boolean): Promise<void> {
    await this.update({ reminderEnabled: enabled });
  }

  static async setWeeklyGoal(hours: number | null): Promise<void> {
    await this.update({ weeklyGoalHours: hours });
  }

  static async setTheme(theme: string): Promise<void> {
    await this.update({ currentTheme: theme });
  }
}

import { getDatabase } from '../database/connection';
import { Streak, DEFAULT_STREAK } from '../database/schema';

export class StreakModel {
  static async get(): Promise<Streak> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{
      id: string;
      current_streak: number;
      longest_streak: number;
      last_study_date: string;
      streak_start_date: string;
    }>('SELECT * FROM streaks WHERE id = ?', ['current']);
    
    if (!result) {
      return { id: 'current', ...DEFAULT_STREAK };
    }
    
    return {
      id: result.id,
      currentStreak: result.current_streak,
      longestStreak: result.longest_streak,
      lastStudyDate: result.last_study_date,
      streakStartDate: result.streak_start_date,
    };
  }

  static async update(updates: Partial<Omit<Streak, 'id'>>): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const values: (string | number)[] = [];
    
    if (updates.currentStreak !== undefined) {
      sets.push('current_streak = ?');
      values.push(updates.currentStreak);
    }
    if (updates.longestStreak !== undefined) {
      sets.push('longest_streak = ?');
      values.push(updates.longestStreak);
    }
    if (updates.lastStudyDate !== undefined) {
      sets.push('last_study_date = ?');
      values.push(updates.lastStudyDate);
    }
    if (updates.streakStartDate !== undefined) {
      sets.push('streak_start_date = ?');
      values.push(updates.streakStartDate);
    }
    
    if (sets.length === 0) return;
    
    values.push('current');
    await db.runAsync(`UPDATE streaks SET ${sets.join(', ')} WHERE id = ?`, values);
  }

  static async increment(): Promise<void> {
    const streak = await this.get();
    const newCurrent = streak.currentStreak + 1;
    const newLongest = Math.max(newCurrent, streak.longestStreak);
    const today = new Date().toISOString().split('T')[0];
    
    await this.update({
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastStudyDate: today,
    });
  }

  static async reset(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await this.update({
      currentStreak: 0,
      lastStudyDate: today,
    });
  }

  static async hasStudiedToday(): Promise<boolean> {
    const streak = await this.get();
    if (!streak.lastStudyDate) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return streak.lastStudyDate === today;
  }

  static async hasStudiedYesterday(): Promise<boolean> {
    const streak = await this.get();
    if (!streak.lastStudyDate) return false;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    return streak.lastStudyDate === yesterdayStr;
  }
}

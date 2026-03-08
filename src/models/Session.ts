import { getDatabase } from '../database/connection';
import { Session } from '../database/schema';
import * as SQLite from 'expo-sqlite';

export class SessionModel {
  static async create(session: Omit<Session, 'id' | 'createdAt'>): Promise<Session> {
    const db = await getDatabase();
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = Date.now();
    
    await db.runAsync(
      `INSERT INTO sessions (id, start_time, end_time, duration, is_completed, note, tags, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        session.startTime,
        session.endTime,
        session.duration,
        session.isCompleted ? 1 : 0,
        session.note,
        typeof session.tags === 'string' ? session.tags : JSON.stringify(session.tags || []),
        createdAt,
      ]
    );
    
    return {
      ...session,
      id,
      createdAt,
    };
  }

  static async getById(id: string): Promise<Session | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{
      id: string;
      start_time: number;
      end_time: number | null;
      duration: number;
      is_completed: number;
      note: string | null;
      tags: string;
      created_at: number;
    }>('SELECT * FROM sessions WHERE id = ?', [id]);
    
    if (!result) return null;
    
    return this.mapFromDb(result);
  }

  static async getAll(): Promise<Session[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<{
      id: string;
      start_time: number;
      end_time: number | null;
      duration: number;
      is_completed: number;
      note: string | null;
      tags: string;
      created_at: number;
    }>('SELECT * FROM sessions ORDER BY start_time DESC');
    
    return results.map(this.mapFromDb);
  }

  static async getByDateRange(startDate: number, endDate: number): Promise<Session[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<{
      id: string;
      start_time: number;
      end_time: number | null;
      duration: number;
      is_completed: number;
      note: string | null;
      tags: string;
      created_at: number;
    }>(
      'SELECT * FROM sessions WHERE start_time >= ? AND start_time <= ? ORDER BY start_time DESC',
      [startDate, endDate]
    );
    
    return results.map(this.mapFromDb);
  }

  static async getTodaySessions(): Promise<Session[]> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
    
    return this.getByDateRange(startOfDay, endOfDay);
  }

  static async update(id: string, updates: Partial<Omit<Session, 'id' | 'createdAt'>>): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const values: (string | number | null)[] = [];
    
    if (updates.startTime !== undefined) {
      sets.push('start_time = ?');
      values.push(updates.startTime);
    }
    if (updates.endTime !== undefined) {
      sets.push('end_time = ?');
      values.push(updates.endTime);
    }
    if (updates.duration !== undefined) {
      sets.push('duration = ?');
      values.push(updates.duration);
    }
    if (updates.isCompleted !== undefined) {
      sets.push('is_completed = ?');
      values.push(updates.isCompleted ? 1 : 0);
    }
    if (updates.note !== undefined) {
      sets.push('note = ?');
      values.push(updates.note);
    }
    if (updates.tags !== undefined) {
      sets.push('tags = ?');
      values.push(typeof updates.tags === 'string' ? updates.tags : JSON.stringify(updates.tags));
    }
    
    if (sets.length === 0) return;
    
    values.push(id);
    await db.runAsync(`UPDATE sessions SET ${sets.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM sessions WHERE id = ?', [id]);
  }

  static async getTotalDuration(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT SUM(duration) as total FROM sessions WHERE is_completed = 1'
    );
    return result?.total || 0;
  }

  static async getAverageDuration(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ avg: number; count: number }>(
      'SELECT AVG(duration) as avg, COUNT(*) as count FROM sessions WHERE is_completed = 1'
    );
    return result?.count ? result.avg || 0 : 0;
  }

  private static mapFromDb(row: {
    id: string;
    start_time: number;
    end_time: number | null;
    duration: number;
    is_completed: number;
    note: string | null;
    tags: string;
    created_at: number;
  }): Session {
    return {
      id: row.id,
      startTime: row.start_time,
      endTime: row.end_time,
      duration: row.duration,
      isCompleted: row.is_completed === 1,
      note: row.note,
      tags: row.tags,
      createdAt: row.created_at,
    };
  }
}

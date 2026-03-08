import { getDatabase } from '../database/connection';
import { GardenState, DEFAULT_GARDEN } from '../database/schema';

export class GardenModel {
  static async get(): Promise<GardenState> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{
      id: string;
      plant_count: number;
      growth_stage: number;
      health_level: number;
      last_watered_date: string;
      theme: string;
      is_frozen: number;
    }>('SELECT * FROM garden_state WHERE id = ?', ['current']);
    
    if (!result) {
      return { id: 'current', ...DEFAULT_GARDEN };
    }
    
    return {
      id: result.id,
      plantCount: result.plant_count,
      growthStage: result.growth_stage,
      healthLevel: result.health_level,
      lastWateredDate: result.last_watered_date,
      theme: result.theme,
      isFrozen: result.is_frozen === 1,
    };
  }

  static async update(updates: Partial<Omit<GardenState, 'id'>>): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const values: (string | number)[] = [];
    
    if (updates.plantCount !== undefined) {
      sets.push('plant_count = ?');
      values.push(updates.plantCount);
    }
    if (updates.growthStage !== undefined) {
      sets.push('growth_stage = ?');
      values.push(updates.growthStage);
    }
    if (updates.healthLevel !== undefined) {
      sets.push('health_level = ?');
      values.push(Math.max(0, Math.min(100, updates.healthLevel)));
    }
    if (updates.lastWateredDate !== undefined) {
      sets.push('last_watered_date = ?');
      values.push(updates.lastWateredDate);
    }
    if (updates.theme !== undefined) {
      sets.push('theme = ?');
      values.push(updates.theme);
    }
    if (updates.isFrozen !== undefined) {
      sets.push('is_frozen = ?');
      values.push(updates.isFrozen ? 1 : 0);
    }
    
    if (sets.length === 0) return;
    
    values.push('current');
    await db.runAsync(`UPDATE garden_state SET ${sets.join(', ')} WHERE id = ?`, values);
  }

  static async waterGarden(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const garden = await this.get();
    
    // Increase health and potentially growth stage
    let newHealth = Math.min(100, garden.healthLevel + 20);
    let newGrowthStage = garden.growthStage;
    
    // Advance growth stage every 3 sessions (approx)
    if (newHealth >= 100 && garden.growthStage < 3) {
      newGrowthStage = Math.min(3, garden.growthStage + 1);
      newHealth = 80; // Reset health after growth
    }
    
    await this.update({
      healthLevel: newHealth,
      growthStage: newGrowthStage,
      lastWateredDate: today,
    });
  }

  static async applyWilt(): Promise<void> {
    const garden = await this.get();
    const newHealth = Math.max(0, garden.healthLevel - 30);
    await this.update({ healthLevel: newHealth });
  }

  static async freeze(): Promise<void> {
    await this.update({ isFrozen: true });
  }

  static async unfreeze(): Promise<void> {
    await this.update({ isFrozen: false });
  }

  static async reset(): Promise<void> {
    await this.update({
      plantCount: 1,
      growthStage: 0,
      healthLevel: 100,
      lastWateredDate: '',
      theme: 'default',
      isFrozen: false,
    });
  }
}

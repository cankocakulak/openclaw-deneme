// Garden themes and constants
// UX Color Scheme:
// Primary: Sage green #7C9A6B
// Accent: Warm amber #F4A261
// Success: Soft moss green #8FB573
// Error: Muted terracotta #E07A5F
// Warning: Gentle gold #E9C46A
// Info: Sky blue #87CEEB
// Background: Warm off-white #FDFCF8
// Surface: Soft cream #F5F3EE

export interface GardenTheme {
  id: string;
  name: string;
  description: string;
  unlockDays: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  plants: {
    sprout: string;
    growing: string;
    mature: string;
    blooming: string;
    wilting: string;
  };
}

export const GARDEN_THEMES: Record<string, GardenTheme> = {
  default: {
    id: 'default',
    name: 'Starter Garden',
    description: 'A simple garden to begin your journey',
    unlockDays: 0,
    colors: {
      primary: '#7C9A6B',
      secondary: '#8FB573',
      accent: '#F4A261',
      background: '#FDFCF8',
    },
    plants: {
      sprout: '🌱',
      growing: '🌿',
      mature: '🪴',
      blooming: '🌸',
      wilting: '🥀',
    },
  },
  succulent: {
    id: 'succulent',
    name: 'Succulent Garden',
    description: 'Desert plants that thrive on consistency',
    unlockDays: 7,
    colors: {
      primary: '#7C9A6B',
      secondary: '#A8C686',
      accent: '#E9C46A',
      background: '#F5F3EE',
    },
    plants: {
      sprout: '🌵',
      growing: '🌵',
      mature: '🪴',
      blooming: '🌺',
      wilting: '🥀',
    },
  },
  flowerBed: {
    id: 'flowerBed',
    name: 'Flower Bed',
    description: 'A colorful array of blooming flowers',
    unlockDays: 30,
    colors: {
      primary: '#F4A261',
      secondary: '#E9C46A',
      accent: '#E07A5F',
      background: '#FFF8F0',
    },
    plants: {
      sprout: '🌱',
      growing: '🌷',
      mature: '🌹',
      blooming: '🌻',
      wilting: '🥀',
    },
  },
  bonsai: {
    id: 'bonsai',
    name: 'Bonsai Collection',
    description: 'Ancient art of miniature trees',
    unlockDays: 100,
    colors: {
      primary: '#2D3436',
      secondary: '#636E72',
      accent: '#7C9A6B',
      background: '#F0F0F0',
    },
    plants: {
      sprout: '🌱',
      growing: '🌳',
      mature: '🎋',
      blooming: '🏯',
      wilting: '🍂',
    },
  },
};

export const GROWTH_STAGES = {
  SPROUT: 0,
  GROWING: 1,
  MATURE: 2,
  BLOOMING: 3,
};

export const HEALTH_LEVELS = {
  EXCELLENT: 80,
  GOOD: 50,
  FAIR: 20,
  POOR: 0,
};

export function getThemeById(id: string): GardenTheme {
  return GARDEN_THEMES[id] || GARDEN_THEMES.default;
}

export function getUnlockedThemes(currentStreak: number): GardenTheme[] {
  return Object.values(GARDEN_THEMES).filter(theme => theme.unlockDays <= currentStreak);
}

export function getLockedThemes(currentStreak: number): GardenTheme[] {
  return Object.values(GARDEN_THEMES).filter(theme => theme.unlockDays > currentStreak);
}

export function isThemeUnlocked(themeId: string, currentStreak: number): boolean {
  const theme = GARDEN_THEMES[themeId];
  return theme ? theme.unlockDays <= currentStreak : false;
}

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GardenState } from '../database/schema';
import { GardenTheme, getThemeById, getUnlockedThemes } from '../constants/gardenThemes';
import { Plant } from './Plant';

interface GardenProps {
  garden: GardenState;
  streak: number;
  showAllPlants?: boolean;
  compact?: boolean;
}

export function Garden({ garden, streak, showAllPlants = true, compact = false }: GardenProps) {
  const theme = getThemeById(garden.theme);
  const unlockedThemes = getUnlockedThemes(streak);
  
  // Calculate how many plants to show based on streak and growth
  const getPlantCount = (): number => {
    if (!showAllPlants) return 1;
    return Math.min(5, Math.max(1, Math.floor(streak / 7) + 1));
  };

  // Get status text based on garden state
  const getStatusText = (): string => {
    if (garden.isFrozen) return 'Streak Frozen';
    if (garden.healthLevel >= 80) return 'Your garden is thriving!';
    if (garden.healthLevel >= 50) return 'Your garden is healthy';
    if (garden.healthLevel >= 20) return 'Your garden needs water';
    return 'Your garden is wilting';
  };

  // Get status color
  const getStatusColor = (): string => {
    if (garden.isFrozen) return '#87CEEB';
    if (garden.healthLevel >= 80) return '#8FB573';
    if (garden.healthLevel >= 50) return '#E9C46A';
    if (garden.healthLevel >= 20) return '#F4A261';
    return '#E07A5F';
  };

  const plantCount = getPlantCount();
  const statusColor = getStatusColor();

  // Generate array of plants with slight variations
  const generatePlants = () => {
    const plants = [];
    for (let i = 0; i < plantCount; i++) {
      // Vary growth stage slightly for visual interest
      const stageVariation = Math.max(0, Math.min(3, garden.growthStage + (i % 2 === 0 ? 0 : -1)));
      plants.push({
        id: `plant-${i}`,
        growthStage: stageVariation,
        offset: i * 20,
      });
    }
    return plants;
  };

  const plants = generatePlants();

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Plant
          growthStage={garden.growthStage}
          healthLevel={garden.healthLevel}
          isFrozen={garden.isFrozen}
          theme={theme}
          size="medium"
        />
        <Text style={[styles.compactStatus, { color: statusColor }]}>
          {getStatusText()}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Garden Background */}
      <View style={[styles.gardenBackground, { backgroundColor: theme.colors.background }]}>
        {/* Plants Container */}
        <View style={styles.plantsContainer}>
          {plants.map((plant, index) => (
            <View 
              key={plant.id}
              style={[
                styles.plantWrapper,
                { 
                  marginLeft: index > 0 ? -20 : 0,
                  zIndex: plants.length - index,
                }
              ]}
            >
              <Plant
                growthStage={plant.growthStage}
                healthLevel={garden.healthLevel}
                isFrozen={garden.isFrozen}
                theme={theme}
                size="large"
              />
            </View>
          ))}
        </View>
        
        {/* Ground/Soil */}
        <View style={styles.ground}>
          <View style={[styles.soil, { backgroundColor: theme.colors.primary + '30' }]} />
        </View>
      </View>
      
      {/* Status Text */}
      <Text style={[styles.statusText, { color: statusColor }]}>
        {getStatusText()}
      </Text>
      
      {/* Theme Badge */}
      <View style={styles.themeBadge}>
        <Text style={styles.themeText}>{theme.name}</Text>
        {unlockedThemes.length > 1 && (
          <Text style={styles.themesCount}>
            {unlockedThemes.length} themes unlocked
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  compactContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gardenBackground: {
    width: '100%',
    minHeight: 200,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  plantsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    minHeight: 120,
    paddingBottom: 20,
  },
  plantWrapper: {
    justifyContent: 'flex-end',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  soil: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  compactStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  themeBadge: {
    marginTop: 8,
    alignItems: 'center',
  },
  themeText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  themesCount: {
    fontSize: 12,
    color: '#7C9A6B',
    marginTop: 4,
  },
});

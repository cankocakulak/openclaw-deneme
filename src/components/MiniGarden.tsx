import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GardenModel } from '../models/Garden';
import { GardenState } from '../database/schema';

interface MiniGardenProps {
  garden: GardenState;
  animated?: boolean;
}

export function MiniGarden({ garden, animated = true }: MiniGardenProps) {
  // Determine plant emoji based on growth stage
  const getPlantEmoji = (): string => {
    switch (garden.growthStage) {
      case 0:
        return '🌱'; // Sprout
      case 1:
        return '🌿'; // Growing
      case 2:
        return '🪴'; // Mature
      case 3:
        return garden.healthLevel > 80 ? '🌸' : '🌺'; // Blooming
      default:
        return '🌱';
    }
  };

  // Determine health indicator color
  const getHealthColor = (): string => {
    if (garden.healthLevel >= 80) return '#8FB573'; // Success - moss green
    if (garden.healthLevel >= 50) return '#E9C46A'; // Warning - gold
    if (garden.healthLevel >= 20) return '#F4A261'; // Amber
    return '#E07A5F'; // Error - terracotta
  };

  // Get status text
  const getStatusText = (): string => {
    if (garden.isFrozen) return 'Streak Frozen ❄️';
    if (garden.healthLevel >= 80) return 'Thriving ✨';
    if (garden.healthLevel >= 50) return 'Healthy 🌱';
    if (garden.healthLevel >= 20) return 'Needs Water 💧';
    return 'Wilting 🥀';
  };

  return (
    <View style={styles.container}>
      <View style={styles.gardenContainer}>
        <View style={[styles.plantContainer, { borderColor: getHealthColor() }]}>
          <Text style={styles.plantEmoji}>{getPlantEmoji()}</Text>
          {garden.isFrozen && (
            <View style={styles.freezeOverlay}>
              <Text style={styles.freezeEmoji}>❄️</Text>
            </View>
          )}
        </View>
        
        {/* Health bar */}
        <View style={styles.healthBarContainer}>
          <View 
            style={[
              styles.healthBar, 
              { 
                width: `${garden.healthLevel}%`,
                backgroundColor: getHealthColor(),
              }
            ]} 
          />
        </View>
        
        <Text style={[styles.statusText, { color: getHealthColor() }]}>
          {getStatusText()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gardenContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F3EE',
    borderRadius: 16,
    minWidth: 140,
  },
  plantContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 12,
  },
  plantEmoji: {
    fontSize: 40,
  },
  freezeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(135, 206, 235, 0.3)',
    borderRadius: 40,
  },
  freezeEmoji: {
    fontSize: 28,
  },
  healthBarContainer: {
    width: 100,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  healthBar: {
    height: '100%',
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

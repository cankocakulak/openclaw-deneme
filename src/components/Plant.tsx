import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GardenTheme, getThemeById, GROWTH_STAGES } from '../constants/gardenThemes';
import { GardenState } from '../database/schema';

interface PlantProps {
  growthStage: number;
  healthLevel: number;
  isFrozen: boolean;
  theme: GardenTheme;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export function Plant({ 
  growthStage, 
  healthLevel, 
  isFrozen, 
  theme, 
  size = 'medium',
  animated = true 
}: PlantProps) {
  const getPlantEmoji = (): string => {
    if (isFrozen) return '❄️';
    if (healthLevel < 20) return theme.plants.wilting;
    
    switch (growthStage) {
      case GROWTH_STAGES.SPROUT:
        return theme.plants.sprout;
      case GROWTH_STAGES.GROWING:
        return theme.plants.growing;
      case GROWTH_STAGES.MATURE:
        return theme.plants.mature;
      case GROWTH_STAGES.BLOOMING:
        return theme.plants.blooming;
      default:
        return theme.plants.sprout;
    }
  };

  const getSize = (): number => {
    switch (size) {
      case 'small':
        return 40;
      case 'medium':
        return 60;
      case 'large':
        return 80;
      default:
        return 60;
    }
  };

  const getHealthColor = (): string => {
    if (isFrozen) return '#87CEEB';
    if (healthLevel >= 80) return theme.colors.secondary;
    if (healthLevel >= 50) return '#E9C46A';
    if (healthLevel >= 20) return '#F4A261';
    return '#E07A5F';
  };

  const plantSize = getSize();
  const healthColor = getHealthColor();
  const plantEmoji = getPlantEmoji();

  return (
    <View style={[styles.container, { width: plantSize + 20, height: plantSize + 20 }]}>
      {/* Plant pot/base */}
      <View 
        style={[
          styles.pot, 
          { 
            width: plantSize * 0.8, 
            height: plantSize * 0.4,
            backgroundColor: isFrozen ? '#E0E0E0' : '#D4A574',
          }
        ]} 
      />
      
      {/* Plant */}
      <View 
        style={[
          styles.plant,
          { 
            width: plantSize, 
            height: plantSize,
            borderColor: healthColor,
          }
        ]}
      >
        <Text style={[styles.plantEmoji, { fontSize: plantSize * 0.7 }]}>
          {plantEmoji}
        </Text>
        
        {/* Freeze overlay */}
        {isFrozen && (
          <View style={styles.freezeOverlay}>
            <Text style={styles.freezeEmoji}>❄️</Text>
          </View>
        )}
        
        {/* Wilting indicator */}
        {healthLevel < 20 && !isFrozen && (
          <View style={styles.wiltIndicator}>
            <Text style={styles.wiltEmoji}>💧</Text>
          </View>
        )}
      </View>
      
      {/* Health ring */}
      <View 
        style={[
          styles.healthRing,
          { 
            width: plantSize + 16, 
            height: plantSize + 16,
            borderColor: healthColor + '40',
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pot: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  plant: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  plantEmoji: {
    lineHeight: undefined,
  },
  freezeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(135, 206, 235, 0.4)',
    borderRadius: 50,
  },
  freezeEmoji: {
    fontSize: 24,
  },
  wiltIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wiltEmoji: {
    fontSize: 12,
  },
  healthRing: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
  },
});

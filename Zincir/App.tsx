/**
 * Zincir Study Tracker - Main App Entry Point
 */

import React, { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const { initializeApp, isLoading, error, streak, preferences } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.title}>Zincir</Text>
            <Text style={styles.streakText}>
              {streak ? `${streak.currentStreak} günlük zincir` : '0 günlük zincir'}
            </Text>
            <Text style={styles.subtitle}>
              {preferences?.dailyGoalMinutes
                ? `Günlük hedef: ${preferences.dailyGoalMinutes} dk`
                : 'Günlük hedef: 30 dk'}
            </Text>
            <Text style={styles.hint}>Çalışmaya başlamak için hazır!</Text>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 16,
  },
  streakText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  hint: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
});

export default App;

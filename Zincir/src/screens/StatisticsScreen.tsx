/**
 * Statistics Screen for Zincir Study Tracker
 * Displays summary cards, weekly bar chart, and longest streak record
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useAppStore } from '../store';
import { formatDurationHuman } from '../utils/date';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Format milliseconds for chart labels (short format)
 * Shows hours if >= 60 min, otherwise just minutes
 */
function formatChartValue(ms: number): string {
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}s`;
  }
  return `${minutes}dk`;
}

export function StatisticsScreen(): React.JSX.Element {
  const { statistics, streak } = useAppStore();

  // Check if there's any data
  const hasData = statistics && (
    statistics.todayTotal > 0 ||
    statistics.weekTotal > 0 ||
    statistics.monthTotal > 0 ||
    statistics.totalSessions > 0
  );

  // Day names for the chart (Monday to Sunday)
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // Calculate max value for chart scaling
  const maxValue = statistics?.last7Days && statistics.last7Days.length > 0
    ? Math.max(...statistics.last7Days, 1) // Ensure at least 1 to avoid division by zero
    : 1;

  // Format duration for display
  const formatDuration = (ms: number): string => {
    if (ms === 0) return '0 dk';
    return formatDurationHuman(ms);
  };

  // Empty state
  if (!hasData) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>İstatistikler</Text>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateEmoji}>📊</Text>
          <Text style={styles.emptyStateTitle}>Henüz çalışma kaydınız yok</Text>
          <Text style={styles.emptyStateMessage}>
            İlk kaydınızı oluşturduğunuzda burada görünecek.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>İstatistikler</Text>

      {/* Summary Cards */}
      <View style={styles.cardsContainer}>
        {/* Today Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Bugün</Text>
          <Text style={styles.cardValue}>{formatDuration(statistics?.todayTotal || 0)}</Text>
        </View>

        {/* This Week Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Bu Hafta</Text>
          <Text style={styles.cardValue}>{formatDuration(statistics?.weekTotal || 0)}</Text>
        </View>

        {/* This Month Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Bu Ay</Text>
          <Text style={styles.cardValue}>{formatDuration(statistics?.monthTotal || 0)}</Text>
        </View>
      </View>

      {/* Weekly Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Son 7 Gün</Text>
        <View style={styles.chart}>
          {statistics?.last7Days.map((value, index) => {
            const barHeight = maxValue > 0 ? (value / maxValue) * 120 : 0;
            const isToday = index === 6; // Last day is today

            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height: Math.max(barHeight, 4) },
                      isToday && styles.barToday,
                      value === 0 && styles.barEmpty,
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, isToday && styles.barLabelToday]}>
                  {dayNames[index]}
                </Text>
                {value > 0 && (
                  <Text style={styles.barValue}>
                    {formatChartValue(value)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Longest Streak Record */}
      <View style={styles.streakRecordContainer}>
        <View style={styles.streakRecordCard}>
          <Text style={styles.streakRecordEmoji}>🏆</Text>
          <View style={styles.streakRecordContent}>
            <Text style={styles.streakRecordLabel}>En Uzun Zincir</Text>
            <Text style={styles.streakRecordValue}>
              {streak?.longestStreak || statistics?.longestStreak || 0} gün
            </Text>
          </View>
        </View>
      </View>

      {/* Total Sessions */}
      <View style={styles.sessionsContainer}>
        <Text style={styles.sessionsLabel}>Toplam Oturum</Text>
        <Text style={styles.sessionsValue}>{statistics?.totalSessions || 0}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  // Summary Cards
  cardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  // Weekly Chart
  chartContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 24,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  barToday: {
    backgroundColor: '#10B981',
  },
  barEmpty: {
    backgroundColor: '#E5E7EB',
    height: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontWeight: '500',
  },
  barLabelToday: {
    color: '#10B981',
    fontWeight: '700',
  },
  barValue: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  // Streak Record
  streakRecordContainer: {
    marginBottom: 24,
  },
  streakRecordCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakRecordEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  streakRecordContent: {
    flex: 1,
  },
  streakRecordLabel: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
  streakRecordValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#92400E',
  },
  // Total Sessions
  sessionsContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionsLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  sessionsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

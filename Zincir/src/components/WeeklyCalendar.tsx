/**
 * Weekly Calendar Component for Zincir Study Tracker
 * Displays 7-day progress with completed/missed/today states
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

export type DayStatus = 'completed' | 'missed' | 'today' | 'pending';

export interface DayData {
  dayName: string;
  date: number;
  status: DayStatus;
  isWeekend: boolean;
}

interface WeeklyCalendarProps {
  days: DayData[];
}

const DAY_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export function WeeklyCalendar({ days }: WeeklyCalendarProps): React.JSX.Element {
  // Ensure we have exactly 7 days
  const displayDays = days.length === 7 ? days : generateDefaultWeek();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bu Hafta</Text>
      <View style={styles.calendarRow}>
        {displayDays.map((day, index) => (
          <DayIndicator key={index} day={day} />
        ))}
      </View>
    </View>
  );
}

interface DayIndicatorProps {
  day: DayData;
}

function DayIndicator({ day }: DayIndicatorProps): React.JSX.Element {
  const getStatusStyle = () => {
    switch (day.status) {
      case 'completed':
        return styles.completedDay;
      case 'missed':
        return styles.missedDay;
      case 'today':
        return styles.todayDay;
      case 'pending':
      default:
        return styles.pendingDay;
    }
  };

  const getStatusTextStyle = () => {
    switch (day.status) {
      case 'completed':
        return styles.completedText;
      case 'missed':
        return styles.missedText;
      case 'today':
        return styles.todayText;
      case 'pending':
      default:
        return styles.pendingText;
    }
  };

  return (
    <View style={styles.dayContainer}>
      <Text style={styles.dayName}>{day.dayName}</Text>
      <View style={[styles.dayCircle, getStatusStyle()]}>
        <Text style={[styles.dayNumber, getStatusTextStyle()]}>
          {day.date}
        </Text>
      </View>
    </View>
  );
}

function generateDefaultWeek(): DayData[] {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday
  
  // Adjust so Monday is the first day of the week
  const mondayOffset = currentDay === 0 ? -6 : 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

  return DAY_NAMES.map((dayName, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    
    const isToday = date.toDateString() === today.toDateString();
    const isWeekend = index >= 5; // Saturday or Sunday
    
    return {
      dayName,
      date: date.getDate(),
      status: isToday ? 'today' : 'pending',
      isWeekend,
    };
  });
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Status styles
  completedDay: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  completedText: {
    color: '#FFFFFF',
  },
  missedDay: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  missedText: {
    color: '#EF4444',
  },
  todayDay: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 3,
  },
  todayText: {
    color: '#92400E',
  },
  pendingDay: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  pendingText: {
    color: '#9CA3AF',
  },
});

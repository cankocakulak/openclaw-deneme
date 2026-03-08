import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';

interface TimerDisplayProps {
  time: string; // MM:SS format
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export function TimerDisplay({ time, size = 'large', color = '#2D3436' }: TimerDisplayProps) {
  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return 48;
      case 'medium':
        return 72;
      case 'large':
      default:
        return 96;
    }
  };

  const getTimeParts = () => {
    const parts = time.split(':');
    return {
      minutes: parts[0] || '00',
      seconds: parts[1] || '00',
    };
  };

  const { minutes, seconds } = getTimeParts();
  const fontSize = getFontSize();

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { fontSize, color, lineHeight: fontSize * 1.1 }]}>
          {minutes}
        </Text>
        <Text style={[styles.colon, { fontSize: fontSize * 0.6, color }]}>:</Text>
        <Text style={[styles.timeText, { fontSize, color, lineHeight: fontSize * 1.1 }]}>
          {seconds}
        </Text>
      </View>
      <Text style={[styles.label, { color: color + '99' }]}>MIN : SEC</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  colon: {
    fontWeight: '200',
    marginHorizontal: 8,
    marginTop: -8,
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 4,
    fontWeight: '500',
  },
});

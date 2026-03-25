/**
 * Timer Screen for Zincir Study Tracker
 * Full-screen timer with start/pause/resume/complete controls
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AppState,
  AppStateStatus,
  Vibration,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAppStore } from '../store';
import { formatDuration, formatDurationShort } from '../utils/date';

interface TimerScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

type TimerState = 'idle' | 'running' | 'paused';

const MAX_NOTE_LENGTH = 140;

export function TimerScreen({ onComplete, onCancel }: TimerScreenProps): React.JSX.Element {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [displayTime, setDisplayTime] = useState(0);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [backgroundStartTime, setBackgroundStartTime] = useState<number | null>(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [sessionNote, setSessionNote] = useState('');
  
  const { 
    activeSession, 
    startSession, 
    pauseSession, 
    resumeSession, 
    completeSession,
    streak,
    preferences,
  } = useAppStore();

  // Track app state changes for background timer
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        // App going to background
        setBackgroundStartTime(Date.now());
      } else if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App coming to foreground
        if (backgroundStartTime && timerState === 'running') {
          const elapsed = Date.now() - backgroundStartTime;
          // Timer continues running in background, no adjustment needed
          // The store handles the actual timing
        }
        setBackgroundStartTime(null);
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, timerState, backgroundStartTime]);

  // Update display time every second
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (timerState === 'running' && activeSession) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = activeSession.duration + (now - activeSession.startTime);
        setDisplayTime(elapsed);
      }, 1000);
    } else if (timerState === 'paused' && activeSession) {
      setDisplayTime(activeSession.duration);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, activeSession]);

  // Start the timer
  const handleStart = useCallback(() => {
    startSession();
    setTimerState('running');
  }, [startSession]);

  // Pause the timer
  const handlePause = useCallback(() => {
    pauseSession();
    setTimerState('paused');
  }, [pauseSession]);

  // Resume the timer
  const handleResume = useCallback(() => {
    resumeSession();
    setTimerState('running');
  }, [resumeSession]);

  // Complete the session
  const handleComplete = useCallback(async () => {
    // Stronger haptic feedback for completion
    Vibration.vibrate([0, 100, 50, 100]);
    await completeSession(sessionNote.trim() || undefined);
    onComplete();
  }, [completeSession, onComplete, sessionNote]);

  // Open note modal
  const handleOpenNoteModal = useCallback(() => {
    setNoteModalVisible(true);
  }, []);

  // Close note modal
  const handleCloseNoteModal = useCallback(() => {
    setNoteModalVisible(false);
  }, []);

  // Save note and close modal
  const handleSaveNote = useCallback(() => {
    setNoteModalVisible(false);
  }, []);

  // Format time for display (mm:ss or h:mm:ss)
  const formattedTime = formatDurationShort(displayTime);
  
  // Calculate daily progress
  const dailyGoalMs = (preferences?.dailyGoalMinutes || 30) * 60 * 1000;
  const todayTotal = (streak?.todayStudyTime || 0) + displayTime;
  const progressPercent = Math.min(100, (todayTotal / dailyGoalMs) * 100);
  const remainingMinutes = Math.max(0, Math.ceil((dailyGoalMs - todayTotal) / 60000));

  // Determine button states
  const showStart = timerState === 'idle';
  const showPause = timerState === 'running';
  const showResume = timerState === 'paused';
  const showComplete = timerState !== 'idle';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>İptal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Çalışma Oturumu</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formattedTime}</Text>
        
        {/* Daily Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercent}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {streak?.todayCompleted 
              ? 'Günlük hedef tamamlandı! 🎉' 
              : `Hedefe kalan: ${remainingMinutes} dk`}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {showStart && (
          <TouchableOpacity 
            style={[styles.button, styles.startButton]} 
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Başlat</Text>
          </TouchableOpacity>
        )}

        {showPause && (
          <TouchableOpacity 
            style={[styles.button, styles.pauseButton]} 
            onPress={handlePause}
            activeOpacity={0.8}
          >
            <Text style={styles.pauseButtonText}>Duraklat</Text>
          </TouchableOpacity>
        )}

        {showResume && (
          <TouchableOpacity 
            style={[styles.button, styles.resumeButton]} 
            onPress={handleResume}
            activeOpacity={0.8}
          >
            <Text style={styles.resumeButtonText}>Devam Et</Text>
          </TouchableOpacity>
        )}

        {showComplete && (
          <TouchableOpacity 
            style={[styles.button, styles.completeButton]} 
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>Bitir</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status Indicator */}
      <View style={styles.statusContainer}>
        {timerState === 'running' && (
          <View style={styles.statusIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>Çalışıyor...</Text>
          </View>
        )}
        {timerState === 'paused' && (
          <Text style={styles.pausedText}>Duraklatıldı</Text>
        )}
      </View>

      {/* Add Note Link */}
      {timerState !== 'idle' && (
        <TouchableOpacity 
          style={styles.addNoteLink} 
          onPress={handleOpenNoteModal}
          activeOpacity={0.8}
        >
          <Text style={styles.addNoteText}>
            {sessionNote ? `Not: ${sessionNote.slice(0, 30)}${sessionNote.length > 30 ? '...' : ''}` : '+ Not'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Note Input Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={noteModalVisible}
        onRequestClose={handleCloseNoteModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Çalışma Notu</Text>
              <Text style={styles.modalSubtitle}>
                Bu oturum hakkında kısa bir not ekleyin (opsiyonel)
              </Text>
              
              <TextInput
                style={styles.noteInput}
                multiline
                numberOfLines={4}
                maxLength={MAX_NOTE_LENGTH}
                placeholder="Bugün ne çalıştınız?"
                placeholderTextColor="#9CA3AF"
                value={sessionNote}
                onChangeText={setSessionNote}
                textAlignVertical="top"
                autoFocus
              />
              
              <Text style={styles.charCount}>
                {sessionNote.length}/{MAX_NOTE_LENGTH}
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={handleCloseNoteModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonSecondaryText}>İptal</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleSaveNote}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonPrimaryText}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 60,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  timerText: {
    fontSize: 80,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    color: '#1F2937',
    letterSpacing: 2,
  },
  progressContainer: {
    width: '100%',
    marginTop: 40,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  controlsContainer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#F59E0B',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pauseButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pauseButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  resumeButton: {
    backgroundColor: '#F59E0B',
  },
  resumeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    height: 40,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  pausedText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
  },
  addNoteLink: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  addNoteText: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalContent: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: '#F3F4F6',
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalButtonPrimary: {
    backgroundColor: '#F59E0B',
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

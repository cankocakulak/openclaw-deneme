import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  AppState,
  AppStateStatus,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTimer } from '../hooks/useTimer';
import { useBackgroundTimer } from '../hooks/useBackgroundTimer';
import { TimerDisplay } from '../components/TimerDisplay';
import { MiniGarden } from '../components/MiniGarden';
import { GardenModel } from '../models/Garden';
import { GardenState } from '../database/schema';
import { SessionModel } from '../models/Session';
import * as Haptics from 'expo-haptics';
import { useKeepAwake, activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

const MIN_SESSION_MS = 5 * 60 * 1000; // 5 minutes

export default function TimerScreen() {
  const router = useRouter();
  const [garden, setGarden] = useState<GardenState | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [sessionNote, setSessionNote] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isRunning,
    elapsedTime,
    formattedTime,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    hasActiveSession,
    recoverSession,
    clearSession,
  } = useTimer();

  const { handleAppStateChange, getBackgroundElapsedTime } = useBackgroundTimer();

  // Keep screen awake when timer is running
  useEffect(() => {
    if (isRunning) {
      activateKeepAwake('timer-screen');
    } else {
      deactivateKeepAwake('timer-screen');
    }
    
    return () => {
      deactivateKeepAwake('timer-screen');
    };
  }, [isRunning]);

  // Load garden state
  useEffect(() => {
    loadGarden();
    checkForRecovery();
  }, []);

  // Listen for app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      handleAppStateChange(nextAppState, isRunning);
    });

    return () => {
      subscription.remove();
    };
  }, [isRunning, handleAppStateChange]);

  const loadGarden = async () => {
    try {
      const gardenState = await GardenModel.get();
      setGarden(gardenState);
    } catch (e) {
      console.error('Failed to load garden:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForRecovery = async () => {
    const recovered = await recoverSession();
    if (recovered) {
      Alert.alert(
        'Session Recovered',
        'You had a session in progress. Would you like to continue or discard it?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: async () => {
              await clearSession();
            },
          },
          {
            text: 'Continue',
            onPress: () => {
              // Session is already recovered and running
            },
          },
        ]
      );
    }
  };

  const handleStartSession = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await startSession();
    } catch (e) {
      console.error('Failed to start session:', e);
    }
  };

  const handleEndSession = async () => {
    if (elapsedTime < MIN_SESSION_MS) {
      setShowWarning(true);
      return;
    }

    await completeSession();
  };

  const completeSession = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const { duration, isValid } = await endSession();

      if (isValid) {
        // Save session to database
        const sessionId = await SessionModel.create({
          startTime: Date.now() - duration,
          endTime: Date.now(),
          duration,
          isCompleted: true,
          note: sessionNote || null,
          tags: '[]',
        });

        // Water the garden
        await GardenModel.waterGarden();
        await loadGarden();

        // Navigate to completion or home
        router.push('/home');
      }
    } catch (e) {
      console.error('Failed to end session:', e);
    }
  };

  const handleEndAnyway = async () => {
    setShowWarning(false);
    await clearSession();
    router.push('/home');
  };

  const handleContinueSession = () => {
    setShowWarning(false);
  };

  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, focusMode && styles.focusModeContainer]}>
      {/* Focus Mode Toggle */}
      {!focusMode && (
        <View style={styles.header}>
          <View style={styles.focusToggle}>
            <Text style={styles.focusLabel}>Focus Mode</Text>
            <Switch
              value={focusMode}
              onValueChange={toggleFocusMode}
              trackColor={{ false: '#E0E0E0', true: '#7C9A6B' }}
              thumbColor={focusMode ? '#FFFFFF' : '#F5F3EE'}
            />
          </View>
        </View>
      )}

      {/* Timer Display */}
      <View style={styles.timerSection}>
        <TimerDisplay 
          time={formattedTime} 
          size={focusMode ? 'large' : 'large'}
          color={focusMode ? '#FDFCF8' : '#2D3436'}
        />
      </View>

      {/* Mini Garden */}
      {garden && (
        <View style={styles.gardenSection}>
          <MiniGarden garden={garden} />
        </View>
      )}

      {/* Session Note Input */}
      {showNoteInput && (
        <View style={styles.noteSection}>
          <TextInput
            style={styles.noteInput}
            placeholder="What did you study? (Optional)"
            placeholderTextColor="#636E72"
            value={sessionNote}
            onChangeText={setSessionNote}
            multiline
            maxLength={200}
          />
          <Text style={styles.charCount}>{sessionNote.length}/200</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controlsSection}>
        {!isRunning && !hasActiveSession ? (
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartSession}
          >
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>
        ) : (
          <>
            {isRunning ? (
              <TouchableOpacity 
                style={[styles.endButton, styles.secondaryButton]}
                onPress={handleEndSession}
              >
                <Text style={styles.endButtonText}>End Session</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={resumeSession}
              >
                <Text style={styles.startButtonText}>Resume</Text>
              </TouchableOpacity>
            )}
            
            {!showNoteInput && (
              <TouchableOpacity 
                style={styles.noteButton}
                onPress={() => setShowNoteInput(true)}
              >
                <Text style={styles.noteButtonText}>+ Add Note</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Under 5 Min Warning Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showWarning}
        onRequestClose={handleContinueSession}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Session Too Short</Text>
            <Text style={styles.modalText}>
              Sessions under 5 minutes don't count toward your streak. Study a bit longer?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleEndAnyway}
              >
                <Text style={styles.modalButtonTextSecondary}>End Anyway</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleContinueSession}
              >
                <Text style={styles.modalButtonTextPrimary}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF8',
    padding: 20,
  },
  focusModeContainer: {
    backgroundColor: '#2D3436',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    marginBottom: 20,
  },
  focusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3EE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  focusLabel: {
    fontSize: 14,
    color: '#2D3436',
    marginRight: 8,
    fontWeight: '500',
  },
  timerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gardenSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  noteSection: {
    backgroundColor: '#F5F3EE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  noteInput: {
    fontSize: 16,
    color: '#2D3436',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'right',
    marginTop: 4,
  },
  controlsSection: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#7C9A6B',
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  endButton: {
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    borderWidth: 2,
  },
  secondaryButton: {
    borderColor: '#E07A5F',
    backgroundColor: 'transparent',
  },
  endButtonText: {
    color: '#E07A5F',
    fontSize: 18,
    fontWeight: '600',
  },
  noteButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  noteButtonText: {
    color: '#7C9A6B',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
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
  modalButtonPrimary: {
    backgroundColor: '#7C9A6B',
  },
  modalButtonSecondary: {
    backgroundColor: '#F5F3EE',
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#636E72',
    fontSize: 16,
    fontWeight: '600',
  },
});

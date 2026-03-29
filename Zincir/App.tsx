/**
 * Zincir Study Tracker - Main App Entry Point
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Animated,
  Vibration,
  Alert,
  AppState,
  AppStateStatus,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store';
import { TimerScreen } from './src/screens/TimerScreen';
import { StatisticsScreen } from './src/screens/StatisticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WeeklyCalendar } from './src/components/WeeklyCalendar';
import { formatDurationShort, formatDurationHuman } from './src/utils/date';
import {
  initializeNotifications,
  checkAndScheduleStreakWarning,
} from './src/services/notifications';

type TabType = 'home' | 'stats' | 'settings';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showTimer, setShowTimer] = useState(false);
  const [displayedStreak, setDisplayedStreak] = useState(0);
  const [showGoalToast, setShowGoalToast] = useState(false);
  const [showStreakBrokenModal, setShowStreakBrokenModal] = useState(false);
  const { initializeApp, isLoading, error, streak, preferences, statistics, weeklyCalendar, weeklyProgress, clearError, refreshStatistics, acknowledgeStreakBreak, useSecondChance } = useAppStore();

  // Animated value for streak counter
  const streakAnimation = useRef(new Animated.Value(0)).current;
  const toastAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeApp();

    // Initialize notifications
    initializeNotifications();
  }, [initializeApp]);

  // Check for streak warnings when app becomes active
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Check and schedule streak warning when app comes to foreground
        if (streak) {
          checkAndScheduleStreakWarning(streak.currentStreak, streak.todayCompleted);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [streak?.currentStreak, streak?.todayCompleted]);

  // Animate streak counter when streak changes
  useEffect(() => {
    if (streak && streak.currentStreak !== displayedStreak) {
      // Haptic feedback when streak increases
      if (streak.currentStreak > displayedStreak && displayedStreak > 0) {
        Vibration.vibrate([0, 50, 50, 50]);
      }

      // Animate the counter
      Animated.timing(streakAnimation, {
        toValue: streak.currentStreak,
        duration: 800,
        useNativeDriver: false,
      }).start();

      // Update displayed value during animation
      const listener = streakAnimation.addListener(({ value }) => {
        setDisplayedStreak(Math.round(value));
      });

      return () => {
        streakAnimation.removeListener(listener);
      };
    }
  }, [streak?.currentStreak]);

  // Show toast when daily goal is completed
  useEffect(() => {
    if (streak?.todayCompleted && !showGoalToast) {
      setShowGoalToast(true);
      // Show success toast
      Animated.sequence([
        Animated.timing(toastAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(toastAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowGoalToast(false);
      });
    }
  }, [streak?.todayCompleted]);

  // Show streak broken modal when streak is broken and not acknowledged
  useEffect(() => {
    if (streak && !streak.streakBrokenAcknowledged && streak.streakBrokenDate) {
      // Check if second chance is available
      if (preferences && !preferences.secondChanceUsed && streak.currentStreak > 0) {
        // Show second chance modal instead of regular broken modal
        setSecondChanceStreakCount(streak.currentStreak);
        setShowSecondChanceModal(true);
      } else {
        setShowStreakBrokenModal(true);
      }
    }
  }, [streak?.streakBrokenAcknowledged, streak?.streakBrokenDate, preferences?.secondChanceUsed]);

  const handleStartPress = () => {
    setShowTimer(true);
  };

  const handleTimerComplete = async () => {
    setShowTimer(false);
    // Refresh weekly calendar and statistics after session completion
    const { refreshWeeklyCalendar, refreshStatistics } = useAppStore.getState();
    await refreshWeeklyCalendar();
    await refreshStatistics();
  };

  const handleTimerCancel = () => {
    setShowTimer(false);
  };

  const [showSecondChanceModal, setShowSecondChanceModal] = useState(false);
  const [secondChanceStreakCount, setSecondChanceStreakCount] = useState(0);

  const handleStreakBrokenAcknowledge = async () => {
    await acknowledgeStreakBreak();
    setShowStreakBrokenModal(false);
  };

  const handleSecondChanceStartNew = async () => {
    await acknowledgeStreakBreak();
    setShowSecondChanceModal(false);
  };

  const handleSecondChanceContinue = async () => {
    // Mark second chance as used but keep streak intact for recovery
    await useSecondChance();
    setShowSecondChanceModal(false);
  };

  // Calculate today's progress
  const dailyGoalMs = (preferences?.dailyGoalMinutes || 30) * 60 * 1000;
  const todayTotal = streak?.todayStudyTime || 0;
  const progressPercent = Math.min(100, (todayTotal / dailyGoalMs) * 100);
  const isGoalComplete = todayTotal >= dailyGoalMs;

  // Format today's study time
  const todayFormatted = formatDurationHuman(todayTotal);

  // Check if streak break risk exists (after 18:00 and goal not completed)
  const currentHour = new Date().getHours();
  const showStreakWarning = !isGoalComplete && currentHour >= 18 && (streak?.currentStreak || 0) > 0;
  const hoursRemaining = 24 - currentHour;

  // Schedule streak warning notification when warning banner shows
  useEffect(() => {
    if (showStreakWarning && streak) {
      checkAndScheduleStreakWarning(streak.currentStreak, streak.todayCompleted);
    }
  }, [showStreakWarning, streak?.currentStreak, streak?.todayCompleted]);

  // Flexible mode: Calculate weekly progress
  const isFlexibleMode = preferences?.streakMode === 'flexible';
  const flexibleTarget = preferences?.flexibleDaysTarget || 5;
  const weeklyDaysCompleted = weeklyProgress?.daysCompleted || 0;
  const weeklyProgressPercent = Math.min(100, (weeklyDaysCompleted / flexibleTarget) * 100);

  // Toast animation style
  const toastStyle = {
    transform: [{
      translateY: toastAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 0],
      }),
    }],
    opacity: toastAnimation,
  };

  // Render Home Screen
  const renderHomeScreen = () => (
    <View style={styles.mainContent}>
      {/* Goal Completion Toast */}
      {showGoalToast && (
        <Animated.View style={[styles.toastContainer, toastStyle]}>
          <Text style={styles.toastText}>
            🎉 Tebrikler! Zinciriniz devam ediyor.
          </Text>
        </Animated.View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={true}
      >
        {/* Streak Break Warning Banner */}
        {showStreakWarning && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              ⚠️ Zincirinizi korumak için {hoursRemaining} saatiniz var!
            </Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Zincir</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNumber}>
            {displayedStreak}
          </Text>
          <Text style={styles.streakLabel}>
            {isFlexibleMode ? 'haftalık zincir' : 'günlük zincir'}
          </Text>
          {streak && streak.longestStreak > 0 && (
            <Text style={styles.bestStreak}>
              En iyi: {streak.longestStreak} gün
            </Text>
          )}
        </View>

        {/* Flexible Mode Weekly Progress */}
        {isFlexibleMode && (
          <View style={styles.flexibleProgressSection}>
            <View style={styles.flexibleProgressHeader}>
              <Text style={styles.flexibleProgressTitle}>Bu Hafta</Text>
              <Text style={styles.flexibleProgressCount}>
                {weeklyDaysCompleted}/{flexibleTarget} gün
              </Text>
            </View>
            <View style={styles.flexibleProgressBarBackground}>
              <View 
                style={[
                  styles.flexibleProgressBarFill, 
                  { width: `${weeklyProgressPercent}%` },
                  weeklyDaysCompleted >= flexibleTarget && styles.flexibleProgressBarComplete
                ]} 
              />
            </View>
            {weeklyDaysCompleted >= flexibleTarget ? (
              <Text style={styles.flexibleGoalComplete}>🎉 Haftalık hedef tamamlandı!</Text>
            ) : (
              <Text style={styles.flexibleGoalRemaining}>
                {flexibleTarget - weeklyDaysCompleted} gün daha tamamla
              </Text>
            )}
          </View>
        )}

        {/* Weekly Calendar */}
        {weeklyCalendar && (
          <WeeklyCalendar days={weeklyCalendar} />
        )}

        {/* Today's Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Bugün</Text>
          <Text style={styles.progressTime}>{todayFormatted}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progressPercent}%` },
                  isGoalComplete && styles.progressBarComplete
                ]} 
              />
            </View>
            <Text style={styles.progressPercent}>
              {Math.round(progressPercent)}%
            </Text>
          </View>

          {isGoalComplete ? (
            <Text style={styles.goalCompleteText}>🎉 Hedef tamamlandı!</Text>
          ) : (
            <Text style={styles.goalRemainingText}>
              Hedef: {preferences?.dailyGoalMinutes || 30} dk
            </Text>
          )}
        </View>

        {/* Weekly Summary */}
        {statistics && statistics.weekTotal > 0 && (
          <View style={styles.weeklySection}>
            <Text style={styles.weeklyLabel}>Bu Hafta</Text>
            <Text style={styles.weeklyTime}>
              {formatDurationHuman(statistics.weekTotal)}
            </Text>
          </View>
        )}

        {/* Start Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartPress}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>
              {todayTotal > 0 ? 'Devam Et' : 'Başla'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  // Render Tab Bar
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'home' && styles.tabButtonActive]}
        onPress={() => setActiveTab('home')}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabIconActive]}>🏠</Text>
        <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>Ana Ekran</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'stats' && styles.tabButtonActive]}
        onPress={() => {
          setActiveTab('stats');
          // Refresh statistics when switching to stats tab
          refreshStatistics();
        }}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabIcon, activeTab === 'stats' && styles.tabIconActive]}>📊</Text>
        <Text style={[styles.tabLabel, activeTab === 'stats' && styles.tabLabelActive]}>İstatistikler</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'settings' && styles.tabButtonActive]}
        onPress={() => setActiveTab('settings')}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabIcon, activeTab === 'settings' && styles.tabIconActive]}>⚙️</Text>
        <Text style={[styles.tabLabel, activeTab === 'settings' && styles.tabLabelActive]}>Ayarlar</Text>
      </TouchableOpacity>
    </View>
  );

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
            <TouchableOpacity onPress={clearError} style={styles.retryButton}>
              <Text style={styles.retryText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {activeTab === 'home' && renderHomeScreen()}
            {activeTab === 'stats' && <StatisticsScreen />}
            {activeTab === 'settings' && <SettingsScreen />}
            {renderTabBar()}
          </>
        )}

        {/* Timer Modal */}
        <Modal
          visible={showTimer}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleTimerCancel}
        >
          <TimerScreen 
            onComplete={handleTimerComplete}
            onCancel={handleTimerCancel}
          />
        </Modal>

        {/* Streak Broken Modal */}
        <Modal
          visible={showStreakBrokenModal}
          animationType="fade"
          transparent={true}
          onRequestClose={handleStreakBrokenAcknowledge}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.streakBrokenModal}>
              <Text style={styles.streakBrokenEmoji}>💔</Text>
              <Text style={styles.streakBrokenTitle}>Zinciriniz Kırıldı</Text>
              <Text style={styles.streakBrokenMessage}>
                Maalesef bir gün çalışmayı kaçırdınız ve zinciriniz sıfırlandı.
              </Text>
              <Text style={styles.streakBrokenSubtext}>
                Üzülmeyin! Bugünden itibaren yeni bir zincir başlatabilirsiniz.
              </Text>
              <TouchableOpacity 
                style={styles.streakBrokenButton}
                onPress={handleStreakBrokenAcknowledge}
                activeOpacity={0.8}
              >
                <Text style={styles.streakBrokenButtonText}>Yeni Başlangıç Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Second Chance Modal */}
        <Modal
          visible={showSecondChanceModal}
          animationType="fade"
          transparent={true}
          onRequestClose={handleSecondChanceStartNew}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.secondChanceModal}>
              <Text style={styles.secondChanceEmoji}>⚡</Text>
              <Text style={styles.secondChanceTitle}>Zinciriniz Kırıldı</Text>
              <Text style={styles.secondChanceMessage}>
                {secondChanceStreakCount} günlük zincirinizi kaçırdınız!
              </Text>
              <Text style={styles.secondChanceSubtext}>
                İkinci bir şansınız var. Bugün çalışarak zincirinizi kurtarabilirsiniz.
              </Text>
              
              <View style={styles.secondChanceButtons}>
                <TouchableOpacity 
                  style={styles.secondChanceButtonSecondary}
                  onPress={handleSecondChanceStartNew}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondChanceButtonSecondaryText}>Yeni Başlangıç Yap</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.secondChanceButtonPrimary}
                  onPress={handleSecondChanceContinue}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondChanceButtonPrimaryText}>Bugün Çalışıp Devam Et</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.secondChanceHint}>
                💡 İkinci şans sadece bir kez kullanılabilir
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  warningBanner: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  warningText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainContent: {
    flex: 1,
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F59E0B',
  },
  streakCard: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  streakEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 72,
  },
  streakLabel: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 4,
  },
  bestStreak: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  progressSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  progressTime: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
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
  progressBarComplete: {
    backgroundColor: '#10B981',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    minWidth: 36,
  },
  goalCompleteText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    marginTop: 12,
  },
  goalRemainingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  weeklySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  weeklyLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  weeklyTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  // Flexible Mode Progress Styles
  flexibleProgressSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  flexibleProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  flexibleProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  flexibleProgressCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#15803D',
  },
  flexibleProgressBarBackground: {
    height: 10,
    backgroundColor: '#DCFCE7',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  flexibleProgressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 5,
  },
  flexibleProgressBarComplete: {
    backgroundColor: '#10B981',
  },
  flexibleGoalComplete: {
    fontSize: 14,
    color: '#15803D',
    fontWeight: '500',
  },
  flexibleGoalRemaining: {
    fontSize: 14,
    color: '#166534',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Tab Bar Styles
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#FEF3C7',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  // Streak Broken Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  streakBrokenModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  streakBrokenEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  streakBrokenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  streakBrokenMessage: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  streakBrokenSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  streakBrokenButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  streakBrokenButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Second Chance Modal Styles
  secondChanceModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  secondChanceEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  secondChanceTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  secondChanceMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  secondChanceSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  secondChanceButtons: {
    width: '100%',
    gap: 12,
  },
  secondChanceButtonPrimary: {
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondChanceButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondChanceButtonSecondary: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondChanceButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  secondChanceHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default App;

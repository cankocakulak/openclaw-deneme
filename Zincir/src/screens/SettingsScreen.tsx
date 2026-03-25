/**
 * Settings Screen for Zincir Study Tracker
 * Allows users to configure app preferences including streak mode
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store';
import { UserPreferences } from '../models';
import {
  checkNotificationPermissions,
  getNotificationPermissionStatus,
  updateNotificationSchedule,
  sendTestNotification,
} from '../services/notifications';

type StreakMode = 'daily' | 'flexible';

export function SettingsScreen(): React.JSX.Element {
  const { preferences, updatePreferences } = useAppStore();
  const [localPrefs, setLocalPrefs] = useState<UserPreferences | null>(preferences);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'unknown'>('unknown');

  // Check notification permission on mount
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    const status = await getNotificationPermissionStatus();
    setPermissionStatus(status);
  };

  if (!localPrefs) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleStreakModeChange = async (mode: StreakMode) => {
    const newPrefs = { ...localPrefs, streakMode: mode };
    setLocalPrefs(newPrefs);
    await updatePreferences({ streakMode: mode });
  };

  const handleFlexibleDaysChange = async (days: number) => {
    const newPrefs = { ...localPrefs, flexibleDaysTarget: days };
    setLocalPrefs(newPrefs);
    await updatePreferences({ flexibleDaysTarget: days });
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      // Request permission when enabling
      const hasPermission = await checkNotificationPermissions();
      
      if (!hasPermission) {
        // Permission denied
        Alert.alert(
          'Bildirim İzni Gerekli',
          'Bildirimleri etkinleştirmek için ayarlardan izin vermeniz gerekiyor.',
          [
            { text: 'İptal', style: 'cancel' },
            { 
              text: 'Ayarları Aç', 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }
            },
          ]
        );
        return;
      }
      
      setPermissionStatus('granted');
    }
    
    const newPrefs = { ...localPrefs, notificationsEnabled: enabled };
    setLocalPrefs(newPrefs);
    await updatePreferences({ notificationsEnabled: enabled });
    
    // Update notification schedule
    await updateNotificationSchedule({ ...localPrefs, notificationsEnabled: enabled });
  };

  const handleNotificationTimeChange = async (time: string) => {
    const newPrefs = { ...localPrefs, notificationTime: time };
    setLocalPrefs(newPrefs);
    await updatePreferences({ notificationTime: time });
    
    // Update notification schedule with new time
    if (localPrefs.notificationsEnabled) {
      await updateNotificationSchedule({ ...localPrefs, notificationTime: time });
    }
  };

  const handleDailyGoalChange = async (minutes: number) => {
    const newPrefs = { ...localPrefs, dailyGoalMinutes: minutes };
    setLocalPrefs(newPrefs);
    await updatePreferences({ dailyGoalMinutes: minutes });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const timeOptions = ['08:00', '12:00', '16:00', '18:00', '20:00', '21:00', '22:00'];
  const goalOptions = [15, 30, 45, 60, 90, 120];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ayarlar</Text>
          <Text style={styles.headerSubtitle}>Uygulama tercihlerinizi özelleştirin</Text>
        </View>

        {/* Streak Mode Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zincir Modu</Text>
          <Text style={styles.sectionDescription}>
            Günlük mü yoksa haftalık hedef mi takip etmek istediğinizi seçin
          </Text>

          {/* Daily Streak Option */}
          <TouchableOpacity
            style={[
              styles.modeOption,
              localPrefs.streakMode === 'daily' && styles.modeOptionActive,
            ]}
            onPress={() => handleStreakModeChange('daily')}
            activeOpacity={0.8}
          >
            <View style={styles.modeOptionContent}>
              <View style={styles.modeIconContainer}>
                <Text style={styles.modeIcon}>📅</Text>
              </View>
              <View style={styles.modeTextContainer}>
                <Text style={styles.modeTitle}>Günlük Zincir</Text>
                <Text style={styles.modeDescription}>
                  Her gün çalışma hedefini tamamla, zincirini koru
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                localPrefs.streakMode === 'daily' && styles.radioButtonActive,
              ]}>
                {localPrefs.streakMode === 'daily' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {/* Flexible Streak Option */}
          <TouchableOpacity
            style={[
              styles.modeOption,
              localPrefs.streakMode === 'flexible' && styles.modeOptionActive,
            ]}
            onPress={() => handleStreakModeChange('flexible')}
            activeOpacity={0.8}
          >
            <View style={styles.modeOptionContent}>
              <View style={styles.modeIconContainer}>
                <Text style={styles.modeIcon}>📆</Text>
              </View>
              <View style={styles.modeTextContainer}>
                <Text style={styles.modeTitle}>Esnek Zincir</Text>
                <Text style={styles.modeDescription}>
                  Haftada belirli gün sayısı hedefi ile daha esnek takip
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                localPrefs.streakMode === 'flexible' && styles.radioButtonActive,
              ]}>
                {localPrefs.streakMode === 'flexible' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {/* Flexible Days Target (only shown in flexible mode) */}
          {localPrefs.streakMode === 'flexible' && (
            <View style={styles.flexibleDaysContainer}>
              <Text style={styles.flexibleDaysLabel}>Haftalık Hedef:</Text>
              <View style={styles.flexibleDaysOptions}>
                <TouchableOpacity
                  style={[
                    styles.flexibleDayOption,
                    localPrefs.flexibleDaysTarget === 5 && styles.flexibleDayOptionActive,
                  ]}
                  onPress={() => handleFlexibleDaysChange(5)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.flexibleDayOptionText,
                    localPrefs.flexibleDaysTarget === 5 && styles.flexibleDayOptionTextActive,
                  ]}>
                    5 Gün
                  </Text>
                  <Text style={[
                    styles.flexibleDayOptionSubtext,
                    localPrefs.flexibleDaysTarget === 5 && styles.flexibleDayOptionSubtextActive,
                  ]}>
                    Hafta içi
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.flexibleDayOption,
                    localPrefs.flexibleDaysTarget === 6 && styles.flexibleDayOptionActive,
                  ]}
                  onPress={() => handleFlexibleDaysChange(6)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.flexibleDayOptionText,
                    localPrefs.flexibleDaysTarget === 6 && styles.flexibleDayOptionTextActive,
                  ]}>
                    6 Gün
                  </Text>
                  <Text style={[
                    styles.flexibleDayOptionSubtext,
                    localPrefs.flexibleDaysTarget === 6 && styles.flexibleDayOptionSubtextActive,
                  ]}>
                    Sadece 1 gün izin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Daily Goal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük Çalışma Hedefi</Text>
          <Text style={styles.sectionDescription}>
            Her gün ne kadar çalışmak istediğinizi seçin
          </Text>
          <View style={styles.goalOptions}>
            {goalOptions.map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.goalOption,
                  localPrefs.dailyGoalMinutes === minutes && styles.goalOptionActive,
                ]}
                onPress={() => handleDailyGoalChange(minutes)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.goalOptionText,
                  localPrefs.dailyGoalMinutes === minutes && styles.goalOptionTextActive,
                ]}>
                  {minutes} dk
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>
          
          {/* Permission Warning */}
          {permissionStatus === 'denied' && (
            <View style={styles.permissionWarning}>
              <Text style={styles.permissionWarningText}>
                ⚠️ Bildirim izni reddedildi. Bildirimleri etkinleştirmek için ayarlardan izin vermeniz gerekiyor.
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.permissionButtonText}>Ayarları Aç</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.notificationToggle}>
            <View style={styles.notificationToggleText}>
              <Text style={styles.notificationToggleTitle}>Günlük Hatırlatma</Text>
              <Text style={styles.notificationToggleDescription}>
                Çalışma zamanı geldiğinde bildirim al
              </Text>
            </View>
            <Switch
              value={localPrefs.notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#E5E7EB', true: '#FCD34D' }}
              thumbColor={localPrefs.notificationsEnabled ? '#F59E0B' : '#9CA3AF'}
              disabled={permissionStatus === 'denied'}
            />
          </View>

          {localPrefs.notificationsEnabled && (
            <>
              <View style={styles.timePicker}>
                <Text style={styles.timePickerLabel}>Bildirim Saati:</Text>
                <View style={styles.timeOptions}>
                  {timeOptions.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOption,
                        localPrefs.notificationTime === time && styles.timeOptionActive,
                      ]}
                      onPress={() => handleNotificationTimeChange(time)}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.timeOptionText,
                        localPrefs.notificationTime === time && styles.timeOptionTextActive,
                      ]}>
                        {formatTime(time)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Test Notification Button */}
              <TouchableOpacity
                style={styles.testButton}
                onPress={async () => {
                  await sendTestNotification();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.testButtonText}>🧪 Test Bildirimi Gönder</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            💡 Esnek modda haftalık hedef tamamlanmadan hafta bittiğinde zinciriniz kırılır.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  modeOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeOptionActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  modeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modeIcon: {
    fontSize: 24,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: '#F59E0B',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
  },
  flexibleDaysContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  flexibleDaysLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  flexibleDaysOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  flexibleDayOption: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  flexibleDayOptionActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  flexibleDayOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  flexibleDayOptionTextActive: {
    color: '#F59E0B',
  },
  flexibleDayOptionSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  flexibleDayOptionSubtextActive: {
    color: '#92400E',
  },
  goalOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  goalOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalOptionActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  goalOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  goalOptionTextActive: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  notificationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  notificationToggleText: {
    flex: 1,
  },
  notificationToggleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationToggleDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  timePicker: {
    marginTop: 16,
  },
  timePickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeOptionActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  timeOptionTextActive: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  // Permission Warning Styles
  permissionWarning: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  permissionWarningText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 12,
  },
  permissionButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Test Button Styles
  testButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});

/**
 * Notification service for Zincir Study Tracker
 * Handles push notifications, scheduling, and permission management
 */

import notifee, {
  AndroidImportance,
  AndroidCategory,
  AuthorizationStatus,
  TriggerType,
  TimestampTrigger,
  RepeatFrequency,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import { UserPreferences } from '../models';
import { getUserPreferences, updateUserPreferences } from '../storage';

// ============================================================================
// Notification Channel IDs
// ============================================================================

const CHANNEL_IDS = {
  DAILY_REMINDER: 'daily-reminder',
  STREAK_WARNING: 'streak-warning',
} as const;

// ============================================================================
// Permission Management
// ============================================================================

/**
 * Check and request notification permissions
 * Returns true if permissions are granted
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  try {
    const settings = await notifee.getNotificationSettings();
    
    if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      return true;
    }
    
    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      return false;
    }
    
    // Request permission
    const result = await notifee.requestPermission();
    return result.authorizationStatus === AuthorizationStatus.AUTHORIZED;
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
}

/**
 * Get current notification permission status
 */
export async function getNotificationPermissionStatus(): Promise<'granted' | 'denied' | 'unknown'> {
  try {
    const settings = await notifee.getNotificationSettings();
    
    if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      return 'granted';
    } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      return 'denied';
    }
    return 'unknown';
  } catch (error) {
    console.error('Error getting notification permission status:', error);
    return 'unknown';
  }
}

// ============================================================================
// Channel Setup
// ============================================================================

/**
 * Create notification channels (required for Android)
 */
export async function createNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    // Daily reminder channel
    await notifee.createChannel({
      id: CHANNEL_IDS.DAILY_REMINDER,
      name: 'Günlük Hatırlatma',
      description: 'Günlük çalışma hatırlatmaları',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
      vibrationPattern: [300, 500],
    });

    // Streak warning channel
    await notifee.createChannel({
      id: CHANNEL_IDS.STREAK_WARNING,
      name: 'Zincir Kırılma Uyarısı',
      description: 'Zincirinizi korumak için kritik uyarılar',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
      vibrationPattern: [300, 500, 300, 500],
    });
  } catch (error) {
    console.error('Error creating notification channels:', error);
  }
}

// ============================================================================
// Notification Scheduling
// ============================================================================

/**
 * Schedule daily reminder notification
 */
export async function scheduleDailyReminder(time: string): Promise<void> {
  try {
    // Cancel existing daily reminders
    await cancelDailyReminders();

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    // If time has passed today, schedule for tomorrow
    if (scheduledTime.getTime() <= now.getTime()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: scheduledTime.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.createTriggerNotification(
      {
        id: 'daily-reminder',
        title: '🔥 Zincir Zamanı!',
        body: 'Bugünkü çalışmanızı yapmayı unutmayın! Zincirinizi korumak için hemen başlayın.',
        android: {
          channelId: CHANNEL_IDS.DAILY_REMINDER,
          importance: AndroidImportance.HIGH,
          category: AndroidCategory.REMINDER,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          categoryId: 'daily-reminder',
          sound: 'default',
        },
      },
      trigger
    );
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
  }
}

/**
 * Cancel daily reminder notifications
 */
export async function cancelDailyReminders(): Promise<void> {
  try {
    await notifee.cancelNotification('daily-reminder');
  } catch (error) {
    console.error('Error canceling daily reminders:', error);
  }
}

/**
 * Schedule streak warning notification
 * Shows when user is at risk of breaking their streak
 */
export async function scheduleStreakWarning(hoursRemaining: number): Promise<void> {
  try {
    // Cancel existing warning
    await cancelStreakWarning();

    // Only schedule if there are still hours remaining
    if (hoursRemaining <= 0) return;

    const now = new Date();
    const triggerTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerTime.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        id: 'streak-warning',
        title: '⚠️ Zinciriniz Tehlikede!',
        body: `Zincirinizi korumak için ${hoursRemaining} saatiniz var! Bugünkü çalışmanızı tamamlayın.`,
        android: {
          channelId: CHANNEL_IDS.STREAK_WARNING,
          importance: AndroidImportance.HIGH,
          category: AndroidCategory.REMINDER,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          categoryId: 'streak-warning',
          sound: 'default',
        },
      },
      trigger
    );
  } catch (error) {
    console.error('Error scheduling streak warning:', error);
  }
}

/**
 * Cancel streak warning notification
 */
export async function cancelStreakWarning(): Promise<void> {
  try {
    await notifee.cancelNotification('streak-warning');
  } catch (error) {
    console.error('Error canceling streak warning:', error);
  }
}

// ============================================================================
// Immediate Notifications
// ============================================================================

/**
 * Show immediate notification (for testing or urgent messages)
 */
export async function showImmediateNotification(
  title: string,
  body: string
): Promise<void> {
  try {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNEL_IDS.DAILY_REMINDER,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
    });
  } catch (error) {
    console.error('Error showing immediate notification:', error);
  }
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize notification system
 * Should be called on app startup
 */
export async function initializeNotifications(): Promise<void> {
  try {
    // Create notification channels (Android)
    await createNotificationChannels();

    // Check if notifications are enabled in preferences
    const prefsResult = await getUserPreferences();
    if (!prefsResult.success || !prefsResult.data) return;

    const prefs = prefsResult.data;

    // If notifications are enabled, schedule them
    if (prefs.notificationsEnabled) {
      const hasPermission = await checkNotificationPermissions();
      
      if (hasPermission) {
        await scheduleDailyReminder(prefs.notificationTime);
      } else {
        // Update preferences to reflect permission denial
        await updateUserPreferences({ notificationsEnabled: false });
      }
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
}

/**
 * Update notification schedule based on preferences
 */
export async function updateNotificationSchedule(
  preferences: UserPreferences
): Promise<void> {
  try {
    if (!preferences.notificationsEnabled) {
      // Cancel all notifications if disabled
      await cancelDailyReminders();
      await cancelStreakWarning();
      return;
    }

    const hasPermission = await checkNotificationPermissions();
    
    if (!hasPermission) {
      // Permission denied, update preferences
      await updateUserPreferences({ notificationsEnabled: false });
      return;
    }

    // Schedule daily reminder
    await scheduleDailyReminder(preferences.notificationTime);
  } catch (error) {
    console.error('Error updating notification schedule:', error);
  }
}

/**
 * Check and schedule streak warning if needed
 * Call this when app state changes or periodically
 */
export async function checkAndScheduleStreakWarning(
  currentStreak: number,
  todayCompleted: boolean
): Promise<void> {
  try {
    const prefsResult = await getUserPreferences();
    if (!prefsResult.success || !prefsResult.data) return;

    const prefs = prefsResult.data;

    // Only schedule if notifications are enabled and user has a streak
    if (!prefs.notificationsEnabled || currentStreak === 0 || todayCompleted) {
      await cancelStreakWarning();
      return;
    }

    // Check if it's late in the day (after 18:00)
    const currentHour = new Date().getHours();
    if (currentHour < 18) {
      await cancelStreakWarning();
      return;
    }

    const hoursRemaining = 24 - currentHour;
    await scheduleStreakWarning(hoursRemaining);
  } catch (error) {
    console.error('Error checking and scheduling streak warning:', error);
  }
}

// ============================================================================
// Test Function
// ============================================================================

/**
 * Send a test notification (for debugging)
 */
export async function sendTestNotification(): Promise<void> {
  await showImmediateNotification(
    '🔔 Test Bildirimi',
    'Bildirim sistemi çalışıyor!'
  );
}

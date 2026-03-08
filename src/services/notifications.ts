import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { SettingsModel } from '../models/Settings';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  } as Notifications.NotificationBehavior),
});

export interface NotificationPermissionResult {
  granted: boolean;
  status: Notifications.PermissionStatus;
}

export async function requestNotificationPermissions(): Promise<NotificationPermissionResult> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    return { granted: status === 'granted', status };
  }
  
  return { granted: true, status: existingStatus };
}

export async function checkNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(time: string = '19:00'): Promise<string | null> {
  try {
    // Cancel existing reminders
    await cancelAllReminders();
    
    // Parse time string (HH:MM)
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create trigger for daily at specified time
    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    };
    
    // Schedule the notification
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to Study! 📚',
        body: "Keep your streak alive 🌱",
        sound: true,
        badge: 1,
      },
      trigger,
    });
    
    console.log('Daily reminder scheduled for', time, 'with ID:', identifier);
    return identifier;
  } catch (error) {
    console.error('Failed to schedule reminder:', error);
    return null;
  }
}

export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All reminders cancelled');
  } catch (error) {
    console.error('Failed to cancel reminders:', error);
  }
}

export async function cancelReminder(identifier: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    console.log('Reminder cancelled:', identifier);
  } catch (error) {
    console.error('Failed to cancel reminder:', error);
  }
}

export async function getScheduledReminders(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to get scheduled reminders:', error);
    return [];
  }
}

export async function sendImmediateNotification(
  title: string,
  body: string
): Promise<string | null> {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // Immediate
    });
    return identifier;
  } catch (error) {
    console.error('Failed to send immediate notification:', error);
    return null;
  }
}

export async function scheduleSessionInProgressNotification(
  elapsedMinutes: number
): Promise<string | null> {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Study Session in Progress ⏱️',
        body: `You've been studying for ${elapsedMinutes} minutes. Keep it up!`,
        sound: false,
      },
      trigger: null,
    });
    return identifier;
  } catch (error) {
    console.error('Failed to schedule session notification:', error);
    return null;
  }
}

// Initialize notifications on app start
export async function initializeNotifications(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7C9A6B',
    });
  }
  
  // Check if reminders should be scheduled based on settings
  const settings = await SettingsModel.get();
  if (settings.reminderEnabled) {
    const hasPermission = await checkNotificationPermissions();
    if (hasPermission) {
      await scheduleDailyReminder(settings.reminderTime);
    }
  }
}

// Update reminder time
export async function updateReminderTime(time: string): Promise<boolean> {
  try {
    const settings = await SettingsModel.get();
    await SettingsModel.setReminderTime(time);
    
    if (settings.reminderEnabled) {
      await scheduleDailyReminder(time);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update reminder time:', error);
    return false;
  }
}

// Toggle reminders on/off
export async function toggleReminders(enabled: boolean): Promise<boolean> {
  try {
    await SettingsModel.toggleReminders(enabled);
    
    if (enabled) {
      const hasPermission = await checkNotificationPermissions();
      if (!hasPermission) {
        const { granted } = await requestNotificationPermissions();
        if (!granted) {
          await SettingsModel.toggleReminders(false);
          return false;
        }
      }
      
      const settings = await SettingsModel.get();
      await scheduleDailyReminder(settings.reminderTime);
    } else {
      await cancelAllReminders();
    }
    
    return true;
  } catch (error) {
    console.error('Failed to toggle reminders:', error);
    return false;
  }
}

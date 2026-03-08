import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermissions,
  checkNotificationPermissions,
  scheduleDailyReminder,
  cancelAllReminders,
  updateReminderTime,
  toggleReminders as toggleRemindersService,
  initializeNotifications,
} from '../services/notifications';
import { SettingsModel } from '../models/Settings';

interface UseNotificationsReturn {
  hasPermission: boolean | null;
  isEnabled: boolean;
  reminderTime: string;
  requestPermission: () => Promise<boolean>;
  toggleNotifications: (enabled: boolean) => Promise<boolean>;
  setReminderTime: (time: string) => Promise<boolean>;
  isLoading: boolean;
}

export function useNotifications(): UseNotificationsReturn {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [reminderTime, setReminderTimeState] = useState('19:00');
  const [isLoading, setIsLoading] = useState(true);

  // Load initial state
  useEffect(() => {
    loadNotificationState();
  }, []);

  const loadNotificationState = async () => {
    try {
      setIsLoading(true);
      
      // Check permission
      const permission = await checkNotificationPermissions();
      setHasPermission(permission);
      
      // Load settings
      const settings = await SettingsModel.get();
      setIsEnabled(settings.reminderEnabled);
      setReminderTimeState(settings.reminderTime);
      
      // Initialize notifications
      await initializeNotifications();
    } catch (e) {
      console.error('Failed to load notification state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { granted } = await requestNotificationPermissions();
      setHasPermission(granted);
      return granted;
    } catch (e) {
      console.error('Failed to request permission:', e);
      return false;
    }
  }, []);

  const toggleNotifications = useCallback(async (enabled: boolean): Promise<boolean> => {
    try {
      const success = await toggleRemindersService(enabled);
      if (success) {
        setIsEnabled(enabled);
      }
      return success;
    } catch (e) {
      console.error('Failed to toggle notifications:', e);
      return false;
    }
  }, []);

  const setReminderTime = useCallback(async (time: string): Promise<boolean> => {
    try {
      const success = await updateReminderTime(time);
      if (success) {
        setReminderTimeState(time);
      }
      return success;
    } catch (e) {
      console.error('Failed to set reminder time:', e);
      return false;
    }
  }, []);

  return {
    hasPermission,
    isEnabled,
    reminderTime,
    requestPermission,
    toggleNotifications,
    setReminderTime,
    isLoading,
  };
}

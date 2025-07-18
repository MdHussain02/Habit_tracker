import * as Notifications from 'expo-notifications';

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

import { Platform } from 'react-native';

// Schedules a notification every 10 seconds for testing purposes
export async function scheduleTestNotification(): Promise<string | null> {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification every 10 seconds.',
        data: { test: true },
      },
      trigger: { seconds: 10, repeats: true } as any,
    });
    return notificationId as string;
  } catch (error) {
    console.error('Failed to schedule test notification:', error);
    return null;
  }
}

export async function scheduleHabitReminder(habitId: string, habitName: string, time: string): Promise<string | null> {
    // Parse time string (HH:MM)
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    let triggerDate = new Date(now);
    triggerDate.setHours(hours);
    triggerDate.setMinutes(minutes);
    triggerDate.setSeconds(0);
    // If the time has already passed today, schedule for tomorrow
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }
    let trigger: any;
    if (Platform.OS === 'android') {
      // Calculate seconds until next occurrence
      const seconds = Math.floor((triggerDate.getTime() - now.getTime()) / 1000);
      trigger = { seconds, repeats: true } as any;
    } else {
      // iOS supports calendar-based triggers
      trigger = { hour: hours, minute: minutes, repeats: true } as any;
    }
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Habit Reminder: ${habitName}`,
        body: `It's time for your habit!`,
        data: { habitId },
      },
      trigger,
    });
    return notificationId as string;
}
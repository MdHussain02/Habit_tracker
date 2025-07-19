import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications'; // or use native notifications

export async function checkAndNotifyHabits() {
  const habitsJson = await AsyncStorage.getItem('@habit_hero_habits');
  const habits = habitsJson ? JSON.parse(habitsJson) : [];
  const now = new Date();

  for (const habit of habits) {
    if (!habit.reminder?.time) continue;
    const [hours, minutes] = habit.reminder.time.split(':').map(Number);
    const habitTime = new Date();
    habitTime.setHours(hours, minutes, 0, 0);

    // If habit time is within the next 10 seconds
    const diff = habitTime.getTime() - now.getTime();
    if (diff > 0 && diff <= 10000) {
      // Send notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Habit Reminder: ${habit.name}`,
          body: `It's almost time for your habit!`,
          data: { habitId: habit.id },
        },
        trigger: null, // Send immediately
      });
    }
  }
}
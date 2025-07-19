import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useCallback } from 'react';
import { Habit, HabitFormData } from '../types/habit';

const HABITS_STORAGE_KEY = '@habit_hero_habits';

export function useHabitNotifications(habits: Habit[], setHabits: (h: Habit[]) => void) {
  // Add a habit and schedule notification
  const addHabitWithNotification = useCallback(async (habitData: HabitFormData) => {
    const reminder = habitData.reminder ?? { enabled: true, time: '09:00' };
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Habit Reminder: ${habitData.name}`,
        body: `It's time for your habit!`,
        data: {},
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      } as any,
    });
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitData.name,
      icon: habitData.icon,
      createdAt: Date.now(),
      streak: 0,
      completedDates: [],
      reminder: { ...reminder, enabled: !!reminder.enabled, notificationId },
    };
    const updatedHabits = [...habits, newHabit];
    await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(updatedHabits));
    setHabits(updatedHabits);
  }, [habits, setHabits]);

  // Edit a habit and reschedule notification
  const editHabitWithNotification = useCallback(async (editHabitId: string, editTime: string) => {
    const updatedHabits = await Promise.all(habits.map(async (habit) => {
      if (habit.id === editHabitId) {
        if (habit.reminder?.notificationId) {
          try {
            await Notifications.cancelScheduledNotificationAsync(habit.reminder.notificationId);
          } catch {}
        }
        const [hours, minutes] = editTime.split(':').map(Number);
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `Habit Reminder: ${habit.name}`,
            body: `It's time for your habit!`,
            data: {},
          },
          trigger: {
            hour: hours,
            minute: minutes,
            repeats: true,
          } as any,
        });
        return {
          ...habit,
          reminder: { ...habit.reminder, time: editTime, enabled: true, notificationId },
        };
      }
      return habit;
    }));
    await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(updatedHabits));
    setHabits(updatedHabits);
  }, [habits, setHabits]);

  // Delete a habit and cancel notification
  const deleteHabitWithNotification = useCallback(async (habitId: string) => {
    const habitToDelete = habits.find((h) => h.id === habitId);
    if (habitToDelete?.reminder?.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(habitToDelete.reminder.notificationId);
      } catch {}
    }
    const updatedHabits = habits.filter((habit) => habit.id !== habitId);
    await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(updatedHabits));
    setHabits(updatedHabits);
  }, [habits, setHabits]);

  return {
    addHabitWithNotification,
    editHabitWithNotification,
    deleteHabitWithNotification,
  };
} 
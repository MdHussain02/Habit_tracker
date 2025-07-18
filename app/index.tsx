// screens/HabitHeroScreen.tsx
import { PookieColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AddHabitModal from '../components/AddHabitModal';
import HabitCard from '../components/HabitCard';
import {
  requestPermissions,
  scheduleHabitReminder,
  scheduleTestNotification,
} from '../services/NotificationService';
import { Habit, HabitFormData } from '../types/habit';

const HABITS_STORAGE_KEY = '@habit_hero_habits';

export default function HabitHeroScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
    const subscription = setupNotificationHandler();
    return () => subscription.remove();
  }, []);

  const initializeApp = async () => {
    await requestPermissions();
    await loadHabits();
  };

  const setupNotificationHandler = () => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { habitId } = response.notification.request.content.data;
      if (habitId) {
        console.log('Notification tapped for habit:', habitId);
      }
    });
    return subscription;
  };

  const loadHabits = async () => {
    try {
      const habitsJson = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      const loadedHabits = habitsJson ? JSON.parse(habitsJson) : [];
      setHabits(loadedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(newHabits));
      setHabits(newHabits);
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const addHabit = async (habitData: HabitFormData) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitData.name,
      icon: habitData.icon,
      createdAt: Date.now(),
      streak: 0,
      completedDates: [],
      reminder: habitData.reminder,
    };

    if (habitData.reminder?.enabled) {
      const notificationId = await scheduleHabitReminder(
        newHabit.id,
        newHabit.name,
        habitData.reminder.time
      );

      if (notificationId) {
        newHabit.reminder = {
          ...habitData.reminder,
          notificationId,
        };
      } else {
        Alert.alert(
          'Reminder Not Set',
          'Could not set up reminder for this habit. Please check your notification settings.'
        );
      }
    }

    const updatedHabits = [...habits, newHabit];
    await saveHabits(updatedHabits);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleHabitCompletion = async (habitId: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toISOString().split('T')[0];
        const isCompletedToday = habit.completedDates.includes(today);

        if (isCompletedToday) {
          const newCompletedDates = habit.completedDates.filter(date => date !== today);
          const newLastCompletedDate = newCompletedDates[newCompletedDates.length - 1];

          return {
            ...habit,
            completedDates: newCompletedDates,
            lastCompletedDate: newLastCompletedDate,
            streak: calculateStreak(newCompletedDates),
          };
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          const newCompletedDates = [...habit.completedDates, today];

          return {
            ...habit,
            completedDates: newCompletedDates,
            lastCompletedDate: today,
            streak: calculateStreak(newCompletedDates),
          };
        }
      }
      return habit;
    });

    await saveHabits(updatedHabits);
  };

  const deleteHabit = (habitId: string) => {
    const habitToDelete = habits.find(h => h.id === habitId);

    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

            if (habitToDelete?.reminder?.notificationId) {
              await Notifications.cancelScheduledNotificationAsync(habitToDelete.reminder.notificationId);
            }

            const updatedHabits = habits.filter(habit => habit.id !== habitId);
            await saveHabits(updatedHabits);
          },
        },
      ]
    );
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;

    const sortedDates = completedDates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = today;

    const mostRecentDate = sortedDates[0];
    mostRecentDate.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(currentDate.getTime() - mostRecentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      streak++;
      for (let i = 1; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        date.setHours(0, 0, 0, 0);
        const prevDate = sortedDates[i - 1];
        prevDate.setHours(0, 0, 0, 0);

        const diff = Math.abs(prevDate.getTime() - date.getTime());
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  const isHabitCompletedToday = (habit: Habit): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  const getCompletedCount = (): number => {
    return habits.filter(habit => isHabitCompletedToday(habit)).length;
  };

  const getTotalStreak = (): number => {
    return habits.reduce((total, habit) => total + (habit.streak || 0), 0);
  };

  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    return getCompletedCount() / habits.length;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your habits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8, margin: 10 }}
        onPress={async () => {
          const id = await scheduleTestNotification();
          if (id) {
            Alert.alert('Test notification scheduled!', 'You should receive a notification every 10 seconds.');
          } else {
            Alert.alert('Error', 'Failed to schedule test notification.');
          }
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Test Notification</Text>
      </TouchableOpacity>

      <LinearGradient
        colors={[PookieColors.veryLightPink, PookieColors.lightOrchid]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Habit Hero</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowAddModal(true);
            }}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getCompletedCount()}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{habits.length}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getTotalStreak()}</Text>
            <Text style={styles.statLabel}>Total Streak</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Today's Progress</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${getCompletionRate() * 100}%` }]} />
          </View>
        </View>

        {/* Habits List */}
        {habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={64} color={PookieColors.mediumOrchid} />
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to add your first habit and become a hero!
            </Text>
          </View>
        ) : (
          <FlatList
            data={habits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HabitCard
                habit={item}
                isCompletedToday={isHabitCompletedToday(item)}
                onToggleCompletion={toggleHabitCompletion}
                onDelete={deleteHabit}
              />
            )}
            style={styles.habitsList}
            showsVerticalScrollIndicator={false}
          />
        )}

        <AddHabitModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddHabit={addHabit}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: PookieColors.deepMagenta,
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PookieColors.deepMagenta,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    backgroundColor: PookieColors.deepMagenta,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: PookieColors.pastelPink,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 3,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: PookieColors.deepMagenta,
  },
  statLabel: {
    fontSize: 13,
    color: PookieColors.deepMagenta,
    marginTop: 4,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: PookieColors.deepMagenta,
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PookieColors.deepMagenta,
    borderRadius: 5,
  },
  habitsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: PookieColors.deepMagenta,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: PookieColors.mediumOrchid,
    textAlign: 'center',
    lineHeight: 24,
  },
});

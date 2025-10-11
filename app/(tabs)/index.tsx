import colors from '@/constants/Colors';
import useSwrApi from '@/hooks/useSwrApi';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HabitCard from '../../components/HabitCard';
import HabitCardShimmer from '../../components/HabitCardShimmer';
import { PageTransition } from '../../components/PageTransition';
import { useHabitNotifications } from '../../hooks/useHabitNotifications';
import { useToast } from '../../hooks/useToast';
import { Habit } from '../../types/habit';

const HABITS_STORAGE_KEY = '@habit_hero_habits';
const HABITS_CACHE_TIMESTAMP_KEY = '@habit_hero_habits_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();
  const { addHabitWithNotification, editHabitWithNotification, deleteHabitWithNotification } =
    useHabitNotifications(habits, setHabits);

  const todayUTC = new Date().toISOString().split('T')[0];
  const { data, error, isLoading, mutate } = useSwrApi(`/habits?date=${todayUTC}`);

  /** ---------------- Cache Helpers ---------------- */
  const loadCachedHabits = async (): Promise<Habit[] | null> => {
    try {
      const cachedHabits = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      return cachedHabits ? JSON.parse(cachedHabits) : null;
    } catch (error) {
      console.error('Error loading cached habits:', error);
      return null;
    }
  };

  const saveHabitsToCache = async (data: Habit[]) => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(data));
      await AsyncStorage.setItem(HABITS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving habits to cache:', error);
    }
  };

  const isCacheValid = async (): Promise<boolean> => {
    try {
      const timestamp = await AsyncStorage.getItem(HABITS_CACHE_TIMESTAMP_KEY);
      if (!timestamp) return false;
      return Date.now() - parseInt(timestamp, 10) < CACHE_DURATION;
    } catch (error) {
      console.error('Error checking cache validity:', error);
      return false;
    }
  };

  /** ---------------- Data Handling ---------------- */
  useEffect(() => {
    const loadHabits = async () => {
      try {
        if (isLoading) return;
        setLoading(true);

        if (data?.success && Array.isArray(data.data)) {
          const todayDate = new Date(`${todayUTC}T00:00:00.000Z`);
          const uiDay = todayDate.getUTCDay(); // Sun=0..Sat=6
          const backendDay = (uiDay + 6) % 7; // Mon=0..Sun=6

          const filtered = data.data.filter((item: any) => {
            if (typeof item.day === 'number') return item.day === backendDay;
            if (Array.isArray(item.repeats)) return item.repeats.includes(backendDay);
            return false;
          });

          const mappedHabits: Habit[] = filtered.map((item: any) => ({
            _id: item._id,
            id: item._id,
            name: item.name,
            icon_id: item.icon_id || 1,
            icon: { set: 'Ionicons', name: 'star' },
            createdAt: new Date(item.created_time).getTime(),
            streak: typeof item.streak === 'number' ? item.streak : 0,
            completedDates: [],
            repeats: Array.isArray(item.repeats) ? item.repeats : undefined,
            reminder: {
              enabled: true,
              time: item.target_time
                ? `${new Date(item.target_time).getHours().toString().padStart(2, '0')}:${new Date(
                    item.target_time
                  ).getMinutes().toString().padStart(2, '0')}`
                : '09:00',
            },
          }));

          setHabits(mappedHabits);
          await saveHabitsToCache(mappedHabits);
        } else {
          // fallback to cached
          const cachedHabits = await loadCachedHabits();
          if (cachedHabits?.length) {
            setHabits(cachedHabits);
            showToast('Using cached data', 'info');
          } else {
            showToast('Failed to load habits', 'error');
          }
        }
      } catch (error) {
        console.error('Error loading habits:', error);
        const cachedHabits = await loadCachedHabits();
        if (cachedHabits?.length) {
          setHabits(cachedHabits);
          showToast('Using cached data', 'info');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadHabits();
  }, [data, isLoading]);

  /** ---------------- Refresh Logic ---------------- */
  const onRefresh = async () => {
    setRefreshing(true);
    await mutate(); // re-fetch data
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (needsRefresh) {
        mutate();
        setNeedsRefresh(false);
      }
    }, [needsRefresh])
  );

  /** ---------------- Helpers ---------------- */
  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    await addHabitWithNotification(habit);
    await mutate(); // reload SWR data
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  /** ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{getGreeting()}!</Text>
            <Text style={styles.headerSubtitle}>
              {habits.length > 0
                ? `${habits.length} habit${habits.length === 1 ? '' : 's'} for today`
                : "Let's start building healthy habits!"}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <PageTransition type="slide" direction="right" duration={10} delay={0}>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/add-habit')}
          >
            <Ionicons name="add" size={24} color={colors['text-light']} />
            <Text style={styles.actionText}>Add Habit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={() => router.push('/coach')}
          >
            <Ionicons name="bulb" size={24} color={colors['text-light']} />
            <Text style={styles.actionText}>Get Ideas</Text>
          </TouchableOpacity>
        </View>
      </PageTransition>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Habits</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push('/analytics')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <PageTransition type="scale" duration={400} delay={300}>
          <View style={styles.habitsSection}>
            {loading ? (
              <View style={styles.habitsList}>
                {[1, 2, 3, 4].map((i) => (
                  <HabitCardShimmer key={i} />
                ))}
              </View>
            ) : habits.length > 0 ? (
              <View style={styles.habitsList}>
                {habits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="leaf-outline" size={64} color={colors.primary} />
                <Text style={styles.emptyStateTitle}>No habits yet</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Start your journey to a healthier lifestyle by creating your first habit
                </Text>
                <TouchableOpacity
                  style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/add-habit')}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color={colors['text-light']}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.emptyStateButtonText}>Create Your First Habit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </PageTransition>
      </ScrollView>
    </View>
  );
}

/** ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['bg-light'],
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 35,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors['text-light'],
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors['text-light'],
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
    margin: 20,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 19,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors['text-light'],
    fontWeight: '600',
    marginTop: 8,
  },
  habitsSection: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors['text-dark'],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  habitsList: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors['text-primary'],
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: colors['text-secondary'],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: 20,
  },
  emptyStateButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateButtonText: {
    color: colors['text-light'],
    fontSize: 16,
    fontWeight: '600',
  },
});

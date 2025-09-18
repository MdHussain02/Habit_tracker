import colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HabitCard from '../../components/HabitCard';
import HabitCardShimmer from '../../components/HabitCardShimmer';
import { PageTransition } from '../../components/PageTransition';
import { useApi } from '../../hooks/useApi';
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

  const router = useRouter();
  const { fetchGet } = useApi();
  const { showToast } = useToast();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const { addHabitWithNotification, editHabitWithNotification, deleteHabitWithNotification } =
    useHabitNotifications(habits, setHabits);

  // Load data on initial mount
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const cachedHabits = await loadCachedHabits();
        if (cachedHabits && isMounted) {
          setHabits(cachedHabits);
        }

        const shouldRefresh = await shouldRefreshHabits();
        if (shouldRefresh) {
          await loadHabits();
        }
      } catch (error) {
        console.error('Error in loadInitialData:', error);
        if (isMounted) {
          showToast('Failed to load habits', 'error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const [needsRefresh, setNeedsRefresh] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (needsRefresh) {
        loadHabits();
        setNeedsRefresh(false);
      }
    }, [needsRefresh])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits(true);
    setRefreshing(false);
  };

  const loadCachedHabits = async (): Promise<Habit[] | null> => {
    try {
      const cachedHabits = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      if (cachedHabits) {
        return JSON.parse(cachedHabits);
      }
    } catch (error) {
      console.error('Error loading cached habits:', error);
    }
    return null;
  };

  const saveHabitsToCache = async (habits: Habit[]) => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      await AsyncStorage.setItem(HABITS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving habits to cache:', error);
    }
  };

  const isCacheValid = async (): Promise<boolean> => {
    try {
      const timestamp = await AsyncStorage.getItem(HABITS_CACHE_TIMESTAMP_KEY);
      if (timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp, 10);
        return cacheAge < CACHE_DURATION;
      }
    } catch (error) {
      console.error('Error checking cache validity:', error);
    }
    return false;
  };

  const loadHabits = async (forceRefresh = false) => {
    try {
      if (!refreshing) {
        setLoading(true);
      }

      if (!forceRefresh && (await isCacheValid())) {
        const cachedHabits = await loadCachedHabits();
        if (cachedHabits && cachedHabits.length > 0) {
          setHabits(cachedHabits);
          if (!forceRefresh) {
            setLoading(false);
          }
        }
      }

      const response = await fetchGet(`${API_BASE_URL}/habits`);

      if (response?.success && response.data) {
        const mappedHabits: Habit[] = response.data.map((item: any) => ({
          id: item._id,
          name: item.name,
          icon_id: item.icon_id || 1,
          icon: { set: 'Ionicons', name: 'star' },
          createdAt: new Date(item.created_time).getTime(),
          streak: 0,
          completedDates: [],
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
      } else if (!response?.success) {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      if (habits.length === 0) {
        const cachedHabits = await loadCachedHabits();
        if (cachedHabits && cachedHabits.length > 0) {
          setHabits(cachedHabits);
          showToast('Using cached data', 'info');
        } else {
          showToast('Failed to load habits', 'error');
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const shouldRefreshHabits = async (): Promise<boolean> => {
    try {
      const timestamp = await AsyncStorage.getItem(HABITS_CACHE_TIMESTAMP_KEY);
      if (!timestamp) return true;
      const cacheAge = Date.now() - parseInt(timestamp, 10);
      return cacheAge > CACHE_DURATION;
    } catch (error) {
      console.error('Error checking cache age:', error);
      return true;
    }
  };

  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    await addHabitWithNotification(habit);
    await loadHabits(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{getGreeting()}! 👋</Text>
            <Text style={styles.headerSubtitle}>
              {habits.length > 0
                ? `${habits.length} habit${habits.length === 1 ? '' : 's'} for today`
                : "Let's start building healthy habits!"}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <PageTransition type="slide" direction="right" duration={400} delay={200}>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/add-habit')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add" size={24} color={colors['text-light']} />
            </View>
            <Text style={styles.actionText}>Add Habit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={() => router.push('/coach')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="bulb" size={24} color={colors['text-light']} />
            </View>
            <Text style={styles.actionText}>Get Ideas</Text>
          </TouchableOpacity>
        </View>
      </PageTransition>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PageTransition type="scale" duration={400} delay={300}>
          <View style={styles.habitsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Habits</Text>
              <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push('/analytics')}>
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

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
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="leaf-outline" size={64} color={colors.primary} />
                </View>
                <Text style={styles.emptyStateTitle}>No habits yet</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Start your journey to a healthier lifestyle by creating your first habit
                </Text>
                <TouchableOpacity
                  style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/add-habit')}
                >
                  <Ionicons name="add" size={20} color={colors['text-light']} style={{ marginRight: 8 }} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['bg-light'],
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors['text-light'],
    marginBottom: 4,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    marginTop: 10,
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
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 12,
    color: colors['text-light'],
    fontWeight: '600',
  },
  habitsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors['text-dark'],
    marginBottom: 12,
  },
  habitsList: {
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyIconContainer: {
    backgroundColor: colors['bg-light'],
    borderRadius: 32,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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

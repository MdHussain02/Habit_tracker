import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HabitCard from '../../components/HabitCard';
import HabitCardShimmer from '../../components/HabitCardShimmer';
import { PageTransition } from '../../components/PageTransition';
import { PaletteColors, PookieColors } from '../../constants/Colors';
import { useApi } from '../../hooks/useApi';
import { useHabitNotifications } from '../../hooks/useHabitNotifications';
import { useToast } from '../../hooks/useToast';
import { Habit } from '../../types/habit';

const { width: screenWidth } = Dimensions.get('window');

const HABITS_STORAGE_KEY = '@habit_hero_habits';
const HABITS_CACHE_TIMESTAMP_KEY = '@habit_hero_habits_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const { fetchGet } = useApi();
  const { showToast } = useToast();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const { addHabitWithNotification, editHabitWithNotification, deleteHabitWithNotification } = useHabitNotifications(habits, setHabits);

  // Load data on initial mount only
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      try {
        // First try to show cached data immediately
        const cachedHabits = await loadCachedHabits();
        if (cachedHabits && isMounted) {
          setHabits(cachedHabits);
        }
        
        // Then refresh from API in the background if needed
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
  
  // Only refresh on focus if explicitly requested (e.g., after adding a habit)
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
    await loadHabits(true); // Force refresh from API
    setRefreshing(false);
  };

  // Load habits from cache
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

  // Save habits to cache
  const saveHabitsToCache = async (habits: Habit[]) => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      await AsyncStorage.setItem(HABITS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving habits to cache:', error);
    }
  };

  // Check if cache is still valid
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

      // Try to load from cache first if not forcing refresh
      if (!forceRefresh && await isCacheValid()) {
        const cachedHabits = await loadCachedHabits();
        if (cachedHabits && cachedHabits.length > 0) {
          setHabits(cachedHabits);
          if (!forceRefresh) {
            setLoading(false);
          }
          // Continue to API for fresh data
        }
      }

      // Fetch from API if cache is invalid or empty
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
              ? `${new Date(item.target_time).getHours().toString().padStart(2, '0')}:${new Date(item.target_time).getMinutes().toString().padStart(2, '0')}`
              : '09:00'
          }
        }));
        
        // Update state and cache
        setHabits(mappedHabits);
        await saveHabitsToCache(mappedHabits);
      } else if (!response?.success) {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      // If we don't have habits yet, show empty state
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

  // Check if we need to refresh the habits data
  const shouldRefreshHabits = async (): Promise<boolean> => {
    try {
      const timestamp = await AsyncStorage.getItem(HABITS_CACHE_TIMESTAMP_KEY);
      if (!timestamp) return true; // No cache exists
      
      const cacheAge = Date.now() - parseInt(timestamp, 10);
      return cacheAge > CACHE_DURATION; // Only refresh if cache is stale
    } catch (error) {
      console.error('Error checking cache age:', error);
      return true; // Refresh on error to be safe
    }
  };

  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    await addHabitWithNotification(habit);
    // Immediately refresh the habits list to show the new habit
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
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{getGreeting()}! 👋</Text>
            <Text style={styles.headerSubtitle}>
              {habits.length > 0 
                ? `${habits.length} habit${habits.length === 1 ? '' : 's'} for today`
                : "Let's start building healthy habits!"
              }
            </Text>
          </View>
        </View>
      </View>
        {/* Quick Actions */}
        <PageTransition type="slide" direction="right" duration={400} delay={200}>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: PookieColors.hotPink }]}
              onPress={() => router.push('/add-habit')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="add" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Add Habit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: 'rgb(139, 92, 246)' }]}
              onPress={() => router.push('/coach')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="bulb" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Get Ideas</Text>
            </TouchableOpacity>
          </View>
        </PageTransition>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Habits Section */}
        <PageTransition type="scale" duration={400} delay={300}>
          <View style={styles.habitsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Habits</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => router.push('/analytics')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="arrow-forward" size={16} color={PaletteColors.orange} />
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
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="leaf-outline" size={64} color={PaletteColors.orange} />
                </View>
                <Text style={styles.emptyStateTitle}>No habits yet</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Start your journey to a healthier lifestyle by creating your first habit
                </Text>
                <TouchableOpacity
                  style={[styles.emptyStateButton, { backgroundColor: PookieColors.hotPink }]}
                  onPress={() => router.push('/add-habit')}
                >
                  <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.emptyStateButtonText}>Create Your First Habit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </PageTransition>
      </ScrollView>

      {/* Floating Add Button
      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={() => router.push('/add-habit')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },

  header: {
    backgroundColor: 'rgb(236, 73, 153)',
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
  profileButton: {
    padding: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#F7F7F7',
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
    shadowColor: '#000',
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
    color: '#fff',
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
    color: '#111827',
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
    backgroundColor: '#fff',
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
    color: '#374151',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: 20,
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  floatingAddButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
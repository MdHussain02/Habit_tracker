import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Animated, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HabitCard from '../../components/HabitCard';
import HabitCardShimmer from '../../components/HabitCardShimmer';
import { useApi } from '../../hooks/useApi';
import { useHabitNotifications } from '../../hooks/useHabitNotifications';
import { useToast } from '../../hooks/useToast';
import { Habit } from '../../types/habit';

const HABITS_STORAGE_KEY = '@habit_hero_habits';
const HABITS_CACHE_TIMESTAMP_KEY = '@habit_hero_habits_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editHabitId, setEditHabitId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState<string>('09:00');
  const [showEditModal, setShowEditModal] = useState(false);

  const router = useRouter();
  const { fetchGet } = useApi();
  const { showToast } = useToast();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const { addHabitWithNotification, editHabitWithNotification, deleteHabitWithNotification } = useHabitNotifications(habits, setHabits);

  // Load data on initial mount only
  useEffect(() => {
    const loadInitialData = async () => {
      // First try to show cached data immediately
      const cachedHabits = await loadCachedHabits();
      if (cachedHabits) {
        setHabits(cachedHabits);
      }
      
      // Then refresh from API in the background if needed
      const shouldRefresh = await shouldRefreshHabits();
      if (shouldRefresh) {
        loadHabits();
      }
    };
    
    loadInitialData();
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
          setLoading(false);
          return; // Exit if we have valid cached data
        }
      }

      // Fetch from API if cache is invalid or empty
      const response = await fetchGet(`${API_BASE_URL}/habits`);
      
      if (response.success && response.data) {
        const mappedHabits: Habit[] = response.data.map((item: any) => {
          const targetTime = new Date(item.target_time);
          const hours = targetTime.getHours().toString().padStart(2, '0');
          const minutes = targetTime.getMinutes().toString().padStart(2, '0');
          const reminderTime = `${hours}:${minutes}`;
          
          const completedDates: string[] = [];
          
          return {
            id: item._id,
            name: item.name,
            icon_id: item.icon_id || 1,
            icon: { set: 'Ionicons', name: 'star' },
            createdAt: new Date(item.created_time).getTime(),
            streak: 0,
            completedDates,
            reminder: {
              enabled: true,
              time: reminderTime
            }
          };
        });
        
        // Update state and cache
        setHabits(mappedHabits);
        await saveHabitsToCache(mappedHabits);
      } else if (!response.success) {
        // If API fails, try to load from cache as fallback
        const cachedHabits = await loadCachedHabits();
        if (cachedHabits) {
          setHabits(cachedHabits);
          showToast('Using cached data', 'info');
        } else {
          showToast('Failed to load habits', 'error');
        }
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      // Try to load from cache on error
      const cachedHabits = await loadCachedHabits();
      if (cachedHabits) {
        setHabits(cachedHabits);
        showToast('Using cached data', 'info');
      } else {
        showToast('Failed to load habits', 'error');
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

  const handleSaveEditTime = async () => {
    if (!editHabitId) return;
    await editHabitWithNotification(editHabitId, editTime);
    setShowEditModal(false);
    setEditHabitId(null);
  };

  const handleDeleteHabit = (habitId: string) => {
    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteHabitWithNotification(habitId);
        },
      },
    ]);
  };

  if (loading) {
    return (
      <Animated.View style={[styles.container, { opacity: loading ? 1 : 0 }]}>
        <View style={styles.topHeaderRow}>
          <Text style={styles.headerTitleMain}>Today's Habits</Text>
        </View>
        <View style={{ flex: 1, marginTop: 10 }}>
          {[1, 2, 3].map((i) => (
            <HabitCardShimmer key={i} />
          ))}
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topHeaderRow}>
        <Text style={styles.headerTitleMain}>Today's Habits</Text>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add-habit')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
        {/* Habits List */}
        <View style={{ flex: 1, marginTop: 10 }}>
          {habits.length === 0 ? (
            <View style={styles.emptyContainerModern}>
              <MaterialCommunityIcons
                name="emoticon-sad-outline"
                size={72}
                color="#666"
              />
              <Text style={styles.emptyTitleModern}>No habits yet</Text>
              <Text style={styles.emptySubtitleModern}>
                Tap the + button to add your first habit and become a hero!
              </Text>
            </View>
          ) : (
            <FlatList
              data={habits}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#FF1972']}
                  tintColor="#FF1972"
                />
              }
              renderItem={({ item }) => (
   
                  <HabitCard habit={item} />
                
              )}
              style={styles.habitsListModern}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}

        </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: '600',
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitleMain: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  gradientBackground: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#ffffff',
  },
  emptyContainerModern: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
  },
  emptyTitleModern: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitleModern: {
    fontSize: 16,
    color: '#4a4a4a',
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  habitCardModern: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eaeaea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  habitsListModern: {
    flex: 1,
    paddingHorizontal: 16,
    // backgroundColor: '#f8f8f8',
    paddingTop: 8,
  },
});

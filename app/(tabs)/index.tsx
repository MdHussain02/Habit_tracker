import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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



  return (
    <View style={styles.container}>
      {/* Header with Add Button - Always Visible */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Habits</Text>
      </View>
      
      {/* Main Content Area */}
      <View style={styles.content}>
        {loading ? (
          // Loading State
          <View style={styles.loadingContent} testID="loading-state">
            {[1, 2, 3 ,4 , 5].map((i) => (
              <HabitCardShimmer key={`shimmer-${i}`} />
            ))}
          </View>
        ) : habits.length === 0 ? (
          // Empty State
          <View style={styles.emptyState} testID="empty-state">
            <MaterialCommunityIcons
              name="emoticon-sad-outline"
              size={80}
              color="#9CA3AF"
              accessibilityLabel="No habits"
            />
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to add your first habit and start your journey to becoming a hero!
            </Text>
          </View>
        ) : (
          // Habits List
          <FlatList
            data={habits}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#ff6b35']}
                tintColor="#ff6b35"
              />
            }
            renderItem={({ item }) => (
              <HabitCard habit={item} />
            )}
            keyExtractor={(item, index) => item.id || `habit-${index}`}
            style={styles.habitsList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.habitsListContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptySubtitle}>No habits found</Text>
              </View>
            }
          />
        )}
          <TouchableOpacity
               
          style={styles.addButton}
          onPress={() => router.push('/add-habit')}
          activeOpacity={0.8}
          testID="add-habit-button"
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  // Modal Styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#ff6b35',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    position: 'absolute',
    right: 40,
    bottom: 100,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  loadingContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  habitsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  habitsListContent: {
    paddingBottom: 32,
  },
  separator: {
    height: 16,
  },    
});
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HabitCard from '../../components/HabitCard';
import HabitCardShimmer from '../../components/HabitCardShimmer';
import TimePicker from '../../components/TimePicker';
import { useApi } from '../../hooks/useApi';
import { useHabitNotifications } from '../../hooks/useHabitNotifications';
import { useToast } from '../../hooks/useToast';
import { Habit } from '../../types/habit';

const HABITS_STORAGE_KEY = '@habit_hero_habits';

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

  useFocusEffect(
    React.useCallback(() => {
      loadHabits();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const loadHabits = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      // Fetch habits from API
      const response = await fetchGet(`${API_BASE_URL}/habits`);
      
      if (response.success && response.data) {
        // Map API response to app's Habit structure
        const mappedHabits: Habit[] = response.data.map((item: any) => {
          // Extract hours and minutes from target_time for reminder
          const targetTime = new Date(item.target_time);
          const hours = targetTime.getHours().toString().padStart(2, '0');
          const minutes = targetTime.getMinutes().toString().padStart(2, '0');
          const reminderTime = `${hours}:${minutes}`;
          
          // Map repeats array to completedDates (placeholder implementation)
          // In a real app, you would need to track actual completion dates
          const completedDates: string[] = [];
          
          return {
            id: item._id,
            name: item.name,
            icon_id: item.icon_id || 1, // Default to 1 (water icon) if not provided
            icon: { set: 'Ionicons', name: 'star' }, // Keeping for backward compatibility
            createdAt: new Date(item.created_time).getTime(),
            streak: 0, // You'll need to calculate this based on completion history
            completedDates: completedDates,
            reminder: {
              enabled: true,
              time: reminderTime
            }
          };
        });
        
        setHabits(mappedHabits);
      } else {
        showToast('Failed to load habits', 'error');
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      showToast('Failed to load habits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    await addHabitWithNotification(habit);
    await loadHabits(); // Refresh the list after adding a new habit
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

  const handleEditTime = (habit: Habit) => {
    setEditHabitId(habit.id);
    setEditTime(habit.reminder?.time || '09:00');
    setShowEditModal(true);
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
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#FF1972']}
                  tintColor="#FF1972"
                />
              }
              renderItem={({ item }) => (
                <View style={styles.habitCardModern}>
                  <HabitCard habit={item} />
                </View>
              )}
              style={styles.habitsListModern}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </View>
        {/* Edit Time Modal */}
        {showEditModal && (
          <View style={{
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center', alignItems: 'center',
            zIndex: 100,
          }}>
            <View style={{ backgroundColor: '#23232b', borderRadius: 20, padding: 24, width: 320 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Edit Habit Time</Text>
              <TimePicker
                value={editTime}
                onTimeChange={setEditTime}
                enabled={true}
                onToggle={() => {}}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <TouchableOpacity onPress={() => setShowEditModal(false)} style={{ marginRight: 16 }}>
                  <Text style={{ color: '#ccc', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveEditTime}>
                  <Text style={{ color: '#FF1972', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add-habit')}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
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
    position: 'absolute',
    right: 24,
    bottom: 36,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
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
    backgroundColor: '#f8f8f8',
    paddingTop: 8,
  },
});

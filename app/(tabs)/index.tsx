import { PookieColors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddHabitModal from "../../components/AddHabitModal";
import HabitCard from "../../components/HabitCard";
import TimePicker from "../../components/TimePicker";
// import {
//   requestPermissions,
//   scheduleHabitReminder,
// } from "../../services/NotificationService";
import { Habit, HabitFormData } from "../../types/habit";

// Show notifications as popups even when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const HABITS_STORAGE_KEY = "@habit_hero_habits";

export default function HabitHeroScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDayIdx, setSelectedDayIdx] = useState(() => {
    // Default to today
    return (new Date().getDay() + 6) % 7; // Monday=0, Sunday=6
  });
  // Edit time modal state
  const [editHabitId, setEditHabitId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState<string>("09:00");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  // const initializeApp = async () => {
  //   await requestPermissions();
  //   await loadHabits();
  // };

  const setupNotificationHandler = () => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const { habitId } = response.notification.request.content.data;
        const actionId = response.actionIdentifier;
        if (habitId && typeof habitId === 'string') {
          if (actionId === 'mark_done') {
            await toggleHabitCompletion(habitId);
          } else if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) {
            // User tapped the notification itself
            await toggleHabitCompletion(habitId);
          }
        }
      }
    );
    return subscription;
  };

  const loadHabits = async () => {
    try {
      const habitsJson = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      const loadedHabits = habitsJson ? JSON.parse(habitsJson) : [];
      setHabits(loadedHabits);
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(newHabits));
      setHabits(newHabits);
    } catch (error) {
      console.error("Error saving habits:", error);
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

    // Remove notification scheduling logic from here
    const updatedHabits = [...habits, newHabit];
    await saveHabits(updatedHabits);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleHabitCompletion = async (habitId: string) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const today = new Date().toISOString().split("T")[0];
        const isCompletedToday = habit.completedDates.includes(today);

        if (isCompletedToday) {
          const newCompletedDates = habit.completedDates.filter(
            (date) => date !== today
          );
          const newLastCompletedDate =
            newCompletedDates[newCompletedDates.length - 1];

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
    const habitToDelete = habits.find((h) => h.id === habitId);

    Alert.alert("Delete Habit", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

          if (habitToDelete?.reminder?.notificationId) {
            await Notifications.cancelScheduledNotificationAsync(
              habitToDelete.reminder.notificationId
            );
          }

          const updatedHabits = habits.filter((habit) => habit.id !== habitId);
          await saveHabits(updatedHabits);
        },
      },
    ]);
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;

    const sortedDates = completedDates
      .map((d) => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());
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
    const today = new Date().toISOString().split("T")[0];
    return habit.completedDates.includes(today);
  };

  const getCompletedCount = (): number => {
    return habits.filter((habit) => isHabitCompletedToday(habit)).length;
  };

  const getTotalStreak = (): number => {
    return habits.reduce((total, habit) => total + (habit.streak || 0), 0);
  };

  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    return getCompletedCount() / habits.length;
  };

  // Handler to open edit modal
  const handleEditTime = (habit: Habit) => {
    setEditHabitId(habit.id);
    setEditTime(habit.reminder?.time || "09:00");
    setShowEditModal(true);
  };

  // Handler to save edited time
  const handleSaveEditTime = async () => {
    if (!editHabitId) return;
    const updatedHabits = habits.map((habit) => {
      if (habit.id === editHabitId) {
        const updatedHabit = {
          ...habit,
          reminder: { ...habit.reminder, time: editTime, enabled: true },
        };
        return updatedHabit;
      }
      return habit;
    });
    await saveHabits(updatedHabits);
    setShowEditModal(false);
    setEditHabitId(null);
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
      <LinearGradient
        colors={["#1a1a1a", "#2a2a2a"]}
        style={styles.gradientBackground}
      >
        {/* Custom Header Row */}
        <View style={styles.topHeaderRow}>
          <Text style={styles.headerTitleMain}>Today's Habits</Text>
        </View>

        {/* Day Selector */}
        <ScrollView
          style={styles.daySelectorContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, idx) => {
            const isSelected = idx === selectedDayIdx;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayPill, isSelected && styles.dayPillSelected]}
                onPress={() => setSelectedDayIdx(idx)}
              >
                <Text style={[styles.dayPillText, isSelected && styles.dayPillTextSelected]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {/* Quote Card */}
        <LinearGradient
          colors={[PookieColors.hotPink, PookieColors.deepRed]}
          style={styles.quoteCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.quoteText}>
            "The secret of your future is hidden in your daily routine."
          </Text>
          <View style={styles.quoteIconWrap}>
            <MaterialCommunityIcons
              name="star-four-points-outline"
              size={24}
              color="#fff"
            />
          </View>
          <Text style={styles.quoteAuthor}>Mike Murdock</Text>
        </LinearGradient>

        {/* Progress */}
        <View style={styles.progressContainerModern}>
          <Text style={styles.progressLabelModern}>Today's Progress</Text>
          <View style={styles.progressBarBackgroundModern}>
            <LinearGradient
              colors={[PookieColors.deepRed, PookieColors.hotPink]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBarFillModern,
                { width: `${getCompletionRate() * 100}%` },
              ]}
            />
          </View>
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
              renderItem={({ item }) => (
                <View style={styles.habitCardModern}>
                  <HabitCard
                    habit={item}
                    isCompletedToday={isHabitCompletedToday(item)}
                    onToggleCompletion={toggleHabitCompletion}
                    onDelete={deleteHabit}
                    onEditTime={handleEditTime}
                  />
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
                  <Text style={{ color: PookieColors.hotPink, fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>

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
    backgroundColor: "#1a1a1a"
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop : 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: PookieColors.deepRed,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    backgroundColor: PookieColors.deepRed,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  statsContainer: {
    flexDirection: "row",
    // paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    // backgroundColor: PookieColors.palePink,
    // borderRadius: 60,
    // padding: 16,
    // marginHorizontal: 4,
    // alignItems: 'center',
    // elevation: 3,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: "bold",
    color: PookieColors.black,
  },
  statLabel: {
    fontSize: 13,
    color: PookieColors.black,
    marginTop: 4,
    fontWeight: "600",
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: PookieColors.deepRed,
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: PookieColors.deepRed,
    borderRadius: 5,
  },
  habitsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: PookieColors.deepRed,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: PookieColors.hotPink,
    textAlign: "center",
    lineHeight: 24,
  },
  gradientBackground: {
    flex: 1,
    paddingTop: 0,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: PookieColors.deepRed,
    letterSpacing: 1,
    textShadowColor: "rgba(123,47,242,0.08)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  appSubtitle: {
    fontSize: 10,
    color: PookieColors.hotPink,
    marginTop: 4,
    marginBottom: 12,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerTitleMain: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  topHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayPill: {
    marginHorizontal: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    minWidth: 50,
    maxHeight :50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayPillSelected: {
    backgroundColor: PookieColors.hotPink,
    borderColor: PookieColors.hotPink,
    shadowColor: PookieColors.hotPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 20,
  },
  dayPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#aaa",
  },
  dayPillTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  
  // Also update the daySelectorContainer style:
  daySelectorContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    maxHeight :60
  },
  quoteCard: {
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 24,
    borderRadius: 20,
    position: "relative",
    overflow: "hidden",
  },
  quoteText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#fff",
    marginBottom: 12,
    lineHeight: 26,
  },
  quoteIconWrap: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "right",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PookieColors.hotPink,
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 18,
  },
  statCardModern: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    backgroundColor: "#2a2a2a",
  },
  statNumberModern: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 6,
  },
  statLabelModern: {
    fontSize: 13,
    color: "#ccc",
    marginTop: 2,
    fontWeight: "600",
  },
  progressContainerModern: {
    paddingHorizontal: 24,
    marginBottom: 18,
  },
  progressLabelModern: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  progressBarBackgroundModern: {
    height: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 7,
    overflow: "hidden",
  },
  progressBarFillModern: {
    height: "100%",
    borderRadius: 7,
  },
  habitsListModern: {
    flex: 1,
    paddingHorizontal: 12,
  },
  habitCardModern: {
    marginBottom: 16,
    borderRadius: 18,
    overflow: "hidden",
  },
  emptyContainerModern: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitleModern: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 18,
    marginBottom: 8,
  },
  emptySubtitleModern: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 24,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 36,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PookieColors.hotPink,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

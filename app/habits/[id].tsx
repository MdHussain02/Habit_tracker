import colors from "@/constants/Colors";
import useSwrApi from "@/hooks/useSwrApi";
import { useSwrMutationApi } from "@/hooks/useSwrMutation";
import { useToast } from "@/hooks/useToast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { mutate as globalMutate } from "swr"; // ✅ Import global SWR mutate

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ICON_MAP: Record<number, string> = {
  1: "water",
  2: "book",
  3: "fitness",
  4: "cafe",
  5: "moon",
  6: "walk",
  7: "barbell",
  8: "star",
};

export default function HabitDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const { data, error: fetchError, isLoading, mutate } = useSwrApi(`/habits/${id}`);
  const habit = data?.data;

  const { trigger: markHabit, isMutating: marking } = useSwrMutationApi(`/habits/${id}/mark`);

  const formatTime = (dateString: string | number | Date) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const toUILabelIndex = (backendIndex: number) => (backendIndex + 1) % 7;

  const formatRepeats = (backendDays: number[]) => {
    if (!backendDays || backendDays.length === 0) return "No specific schedule";
    const days = [...new Set(backendDays)].sort((a, b) => a - b);
    if (days.length === 7) return "Every day";
    const isWeekdays = days.length === 5 && days.every((d, i) => d === i && d <= 4);
    if (isWeekdays) return "Weekdays";
    const isWeekends = days.length === 2 && days.includes(5) && days.includes(6);
    if (isWeekends) return "Weekends";
    return days.map((d) => DAY_NAMES[toUILabelIndex(d)]).join(", ");
  };

  const getScheduleLabel = (habitData: any) => {
    if (!habitData) return "No specific schedule";
    if (Array.isArray(habitData.repeats) && habitData.repeats.length) {
      return formatRepeats(habitData.repeats);
    }
    if (typeof habitData.day === "number") {
      return formatRepeats([habitData.day]);
    }
    return "No specific schedule";
  };

  const handleMarkComplete = async () => {
    if (!id || marking || habit?.completed) return;

    try {
      const timestamp = new Date().toISOString();
      const response = await markHabit({ timestamp });

      if (response?.success) {
        // ✅ Update local habit data
        mutate(
          (currentData: any) => ({
            ...currentData,
            data: {
              ...currentData.data,
              completed: true,
              last_completion: response?.data?.completion?.timestamp ?? timestamp,
              streak: response?.data?.streak ?? currentData.data.streak ?? 0,
            },
          }),
          false
        );

        // ✅ Also update today's habit list optimistically
        const todayUTC = new Date().toISOString().split("T")[0];
        globalMutate(
          `/habits?date=${todayUTC}`,
          (current: any) => {
            if (!current?.data) return current;
            return {
              ...current,
              data: current.data.map((h: any) =>
                h.id === habit.id
                  ? {
                      ...h,
                      completed: true,
                      last_completion: response?.data?.completion?.timestamp ?? timestamp,
                      streak: response?.data?.streak ?? h.streak ?? 0,
                    }
                  : h
              ),
            };
          },
          false
        );

        // ✅ Navigate back to home or tab page
        router.replace("/(tabs)");

        showToast(
          `Marked habit as complete. Streak: ${response?.data?.streak ?? 0} days`,
          "success"
        );
      } else {
        showToast("Failed to mark habit as complete", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to mark habit as complete", "error");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading habit...</Text>
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={styles.centered}>
        <Text>Habit not found or failed to load.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const iconName = ICON_MAP[habit?.icon_id] || "help-circle";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.greeting}>Habit Details</Text>
      </View>

      {/* Habit Info */}
      <View style={styles.contentContainer}>
        <View style={styles.habitHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
            <Ionicons name={iconName as any} size={48} color={colors.primary} />
          </View>
          <Text style={styles.habitName}>{habit.name}</Text>
          {habit.description && <Text style={styles.habitDescription}>{habit.description}</Text>}
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color="#888" style={{ marginRight: 12 }} />
            <Text>{getScheduleLabel(habit)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#888" style={{ marginRight: 12 }} />
            <Text>{habit.target_time ? formatTime(habit.target_time) : "Not set"}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="flame" size={20} color="#e11d48" style={{ marginRight: 12 }} />
            <Text>
              {habit.streak || 0} day{(habit.streak || 0) === 1 ? "" : "s"}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.primary, opacity: marking || habit.completed ? 0.7 : 1 },
            ]}
            onPress={handleMarkComplete}
            disabled={marking || habit.completed}
          >
            <Ionicons
              name={habit.completed ? "checkmark-done-circle-outline" : "checkmark-circle-outline"}
              size={20}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>
              {habit.completed ? "Completed" : marking ? "Marking..." : "Mark as Complete"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors["bg-light"],
  },
  contentContainer: {
    flex: 1,
    marginTop: 50,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: colors["bg-primary"],
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  habitHeader: {
    alignItems: "center",
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  habitName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  habitDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
  },
  detailsContainer: {
    padding: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionsContainer: {
    padding: 16,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

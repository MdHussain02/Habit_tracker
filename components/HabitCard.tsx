import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Habit } from '../types/habit';

// Map icon_id to icon names
const ICON_MAP: Record<number, string> = {
  1: 'water',
  2: 'book',
  3: 'fitness',
  4: 'cafe',
  5: 'moon',
  6: 'walk',
  7: 'barbell',
  8: 'star',
};

function renderIcon(iconId: number, size: number, color: string) {
  const iconName = ICON_MAP[iconId] || 'help-circle';
  return <Ionicons name={iconName as any} size={size} color={color} />;
}

interface HabitCardProps {
  habit: Habit;
} 

export default function HabitCard({ 
  habit
}: HabitCardProps) {
  const router = useRouter();
  const habitId = habit._id || habit.id;
  
  if (!habitId) {
    console.error('No habit ID found');
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/habits/${habitId}`)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {renderIcon(habit.icon_id || 1, 24, "#4B5563")}
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{habit.name}</Text>
        </View>
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={16} color="#FF6B6B" />
          <Text style={styles.streakText}>
            {habit.streak || 0} day{habit.streak !== 1 ? 's' : ''}
          </Text>
        </View>
        {habit.reminder?.time && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="time-outline" size={16} color="#FF6B6B" style={{ marginRight: 4 }} />
            <Text style={{ color: '#ccc', fontSize: 13 }}>Scheduled: {habit.reminder.time}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    paddingVertical: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  streakText: {
    fontSize: 14,
    color: '#687076', // Darker text for contrast
    marginLeft: 6,
    fontWeight: '600',
  },
});
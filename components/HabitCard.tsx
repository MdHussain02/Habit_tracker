import colors from '@/constants/Colors';
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

export default function HabitCard({ habit }: HabitCardProps) {
  const router = useRouter();
  const habitId = habit._id || habit.id;

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Backend Mon=0..Sun=6 -> UI index Sun..Sat
  const toUILabelIndex = (backendIndex: number) => (backendIndex + 1) % 7;
  const formatRepeats = (backendDays: number[]) => {
    if (!backendDays || backendDays.length === 0) return '';
    const days = [...new Set(backendDays)].sort((a, b) => a - b);
    if (days.length === 7) return 'Every day';
    const isWeekdays = days.length === 5 && days.every((d, i) => d === i && d <= 4);
    if (isWeekdays) return 'Weekdays';
    const isWeekends = days.length === 2 && days.includes(5) && days.includes(6);
    if (isWeekends) return 'Weekends';
    return days.map((d) => DAY_NAMES[toUILabelIndex(d)]).join(', ');
  };
  const getRepeatLabel = () => {
    if (Array.isArray(habit.repeats) && habit.repeats.length) return formatRepeats(habit.repeats);
    // @ts-ignore: allow backend single-day field if present
    if (typeof (habit as any).day === 'number') return formatRepeats([(habit as any).day]);
    return '';
  };
  
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
        {renderIcon(habit.icon_id || 1, 24, colors['text-secondary'])}
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{habit.name}</Text>
        </View>
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={16} color={colors['text-danger']} />
          <Text style={styles.streakText}>
            {habit.streak || 0} day{habit.streak !== 1 ? 's' : ''}
          </Text>
        </View>
        {habit.reminder?.time && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons 
              name="time-outline" 
              size={16} 
              color={colors['text-danger']} 
              style={{ marginRight: 4 }} 
            />
            <Text style={{ color: colors['text-secondary'], fontSize: 13 }}>
              Scheduled: {habit.reminder.time}
            </Text>
          </View>
        )}
        {getRepeatLabel() !== '' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons 
              name="calendar-outline" 
              size={16} 
              color={colors['text-secondary']} 
              style={{ marginRight: 4 }} 
            />
            <Text style={{ color: colors['text-secondary'], fontSize: 13 }}>
              Repeats: {getRepeatLabel()}
            </Text>
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
    backgroundColor: colors['bg-accent'],
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    minHeight: 100,
    shadowColor: colors['shadow'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors['border-light'],
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors['bg-light'],
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
    color: colors['text-dark'],
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
    color: colors['text-secondary'],
    marginLeft: 6,
    fontWeight: '600',
  },
});

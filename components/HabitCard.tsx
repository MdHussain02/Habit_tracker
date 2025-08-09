import { Ionicons } from '@expo/vector-icons';
import { default as React } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {habit.name}
          </Text>
          {habit.icon_id && (
            <View style={styles.icon}>{renderIcon(habit.icon_id, 22, '#ccc')}</View>
          )}
        </View>
        
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={16} color="#FF6B6B" />
          <Text style={styles.streakText}>
            {habit.streak} Days
          </Text>
        </View>
        {habit.reminder?.time && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="time-outline" size={16} color="#FF6B6B" style={{ marginRight: 4 }} />
            <Text style={{ color: '#ccc', fontSize: 13 }}>Scheduled: {habit.reminder.time}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#22222b",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 12
  },
  content: {
    flex: 1,
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    letterSpacing: 0.5,
  },
  icon: {
    marginLeft: 10,
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 6,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  streakText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 6,
    fontWeight: '600',
  },
});
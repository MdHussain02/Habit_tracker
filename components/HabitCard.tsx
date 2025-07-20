import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { default as React } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Habit } from '../types/habit';

function renderIcon(icon: Habit['icon'], size: number, color: string) {
  if (!icon) return null;
  switch (icon.set) {
    case 'Ionicons':
      return <Ionicons name={icon.name as any} size={size} color={color} />;
    case 'MaterialIcons':
      return <MaterialIcons name={icon.name as any} size={size} color={color} />;
    case 'FontAwesome':
      return <FontAwesome name={icon.name as any} size={size} color={color} />;
    default:
      return null;
  }
}

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  onToggleCompletion: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
  onEditTime?: (habit: Habit) => void;
} 

export default function HabitCard({ 
  habit, 
  isCompletedToday, 
  onToggleCompletion,
  onDelete,
  onEditTime
}: HabitCardProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={() => onToggleCompletion(habit.id)}
      >
        <Ionicons 
          name={isCompletedToday ? 'checkmark-circle' : 'ellipse-outline'} 
          size={28} 
          color={isCompletedToday ? '#4CAF50' : '#ccc'} 
        />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, isCompletedToday && styles.completedName]}>
            {habit.name}
          </Text>
          {habit.icon && (
            <View style={styles.icon}>{renderIcon(habit.icon, 22, '#ccc')}</View>
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {onEditTime && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => onEditTime(habit)}
          >
            <Ionicons name="pencil-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => onDelete(habit.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ccc" />
          </TouchableOpacity>
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
    marginBottom: 10
  },
  checkbox: {
    marginRight: 16,
    backgroundColor: '#3a3a3a',
    borderRadius: 16,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
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
  completedName: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  icon: {
    marginLeft: 10,
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 4,
    marginTop: 26
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
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#3a3a3a',
    borderRadius: 16,
  },
  editButton: {
    padding: 8,
    marginLeft: 0,
    backgroundColor: '#3a3a3a',
    borderRadius: 16,
  },
}); 
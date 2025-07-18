import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { default as React } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PookieColors } from '../constants/Colors';
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
} 

export default function HabitCard({ 
  habit, 
  isCompletedToday, 
  onToggleCompletion,
  onDelete 
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
          color={isCompletedToday ? PookieColors.deepRed : PookieColors.hotPink} 
        />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, isCompletedToday && styles.completedName]}>
            {habit.name}
          </Text>
          {habit.icon && (
            <View style={styles.icon}>{renderIcon(habit.icon, 22, PookieColors.deepRed)}</View>
          )}
        </View>
        
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={16} color={PookieColors.hotPink} />
          <Text style={styles.streakText}>
            {habit.streak} day{habit.streak !== 1 ? 's' : ''} streak
          </Text>
        </View>
      </View>
      
      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(habit.id)}
        >
          <Ionicons name="trash-outline" size={20} color={PookieColors.deepRed} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PookieColors.palePink,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: PookieColors.deepRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 3,
  },
  checkbox: {
    marginRight: 16,
    backgroundColor: PookieColors.palePink,
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
    color: PookieColors.deepRed,
    flex: 1,
    letterSpacing: 0.5,
  },
  completedName: {
    textDecorationLine: 'line-through',
    color: PookieColors.deepRed,
  },
  icon: {
    marginLeft: 10,
    backgroundColor: PookieColors.palePink,
    borderRadius: 12,
    padding: 4,
    marginTop:26
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  streakText: {
    fontSize: 14,
    color: PookieColors.hotPink,
    marginLeft: 6,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: PookieColors.palePink,
    borderRadius: 16,
  },
}); 
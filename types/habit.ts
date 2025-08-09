// types/habit.ts
export interface HabitIcon {
  set: 'Ionicons' | 'MaterialIcons' | 'FontAwesome';
  name: string;
}

export interface HabitReminder {
  enabled: boolean;
  time: string; // HH:MM format
  notificationId?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon_id: number;  // Numeric ID for the icon
  icon?: HabitIcon; // Keep for backward compatibility
  createdAt: number;
  streak: number;
  completedDates: string[];
  lastCompletedDate?: string;
  reminder?: HabitReminder;
}

export interface HabitFormData {
  name: string;
  icon?: HabitIcon;
  reminder?: HabitReminder;
}
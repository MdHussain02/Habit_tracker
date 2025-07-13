export interface HabitIcon {
  set: 'Ionicons' | 'MaterialIcons' | 'FontAwesome';
  name: string;
}

export interface Habit {
  id: string;
  name: string;
  icon?: HabitIcon;
  createdAt: number;
  streak: number;
  lastCompletedDate?: string; // YYYY-MM-DD format
  completedDates: string[]; // Array of YYYY-MM-DD dates
}

export interface HabitFormData {
  name: string;
  icon?: HabitIcon;
} 
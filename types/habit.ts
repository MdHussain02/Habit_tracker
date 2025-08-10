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
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  icon_id: number;  // Numeric ID for the icon
  icon?: HabitIcon; // Keep for backward compatibility
  createdAt: number | string;
  streak: number;
  completedDates: string[];
  lastCompletedDate?: string;
  reminder?: HabitReminder;
  target_time?: string;
  repeats?: number[];
}

export interface HabitFormData {
  name: string;
  icon?: HabitIcon;
  reminder?: HabitReminder;
}

export interface AISuggestion {
  name: string;
  description: string;
  target_time: string;
  repeats: number[];
  icon_id: number;
  difficulty: string;
  category: string;
  estimated_duration: number;
  success_tips: string[];
}

export interface AISuggestionsResponse {
  success: boolean;
  data: {
    suggestions: AISuggestion[];
    userProfile: {
      age: number;
      fitnessLevel: string;
      primaryGoal: string;
      motivationLevel: string;
    };
    existingHabitsCount: number;
    options: {
      maxSuggestions: number;
      focusArea: string;
    };
  };
}
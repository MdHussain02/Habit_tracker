import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import TimePicker from '../components/TimePicker';
import { HabitIcon, HabitReminder } from '../types/habit';
import { useApi } from '../hooks/useApi';

const SUGGESTED_HABITS = [
  'Drink Water',
  'Read',
  'Exercise',
  'Meditate',
  'Sleep Early',
  'Eat Healthy',
  'Walk',
  'Custom',
];
const SUGGESTED_ICONS: HabitIcon[] = [
  { set: 'Ionicons', name: 'water' },
  { set: 'Ionicons', name: 'book' },
  { set: 'MaterialIcons', name: 'directions-run' },
  { set: 'MaterialIcons', name: 'self-improvement' },
  { set: 'MaterialIcons', name: 'restaurant' },
  { set: 'Ionicons', name: 'bed' },
  { set: 'MaterialIcons', name: 'fitness-center' },
  { set: 'Ionicons', name: 'star' },
];

// Map icon to icon_id (simplified mapping for example)
const ICON_ID_MAP: Record<string, number> = {
  'water': 1,
  'book': 2,
  'directions-run': 3,
  'self-improvement': 4,
  'restaurant': 5,
  'bed': 6,
  'fitness-center': 7,
  'star': 8,
};

// Days of the week for repeats field (0 = Sunday, 1 = Monday, etc.)
const DAYS_OF_WEEK = [
  { id: 0, name: 'Sun' },
  { id: 1, name: 'Mon' },
  { id: 2, name: 'Tue' },
  { id: 3, name: 'Wed' },
  { id: 4, name: 'Thu' },
  { id: 5, name: 'Fri' },
  { id: 6, name: 'Sat' },
];

function renderIcon(icon: HabitIcon, size: number, color: string) {
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

export default function AddHabitPage() {
  const router = useRouter();
  const [selectedHabit, setSelectedHabit] = useState(SUGGESTED_HABITS[0]);
  const [customHabit, setCustomHabit] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<HabitIcon | undefined>(undefined);
  const [reminder, setReminder] = useState<HabitReminder>({ enabled: true, time: '09:00' });
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Default to weekdays
  const [saving, setSaving] = useState(false);
  
  const { showToast } = useToast();
  const { fetchPost } = useApi();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleSave = async () => {
    const name = selectedHabit === 'Custom' ? customHabit.trim() : selectedHabit;
    if (!name) {
      showToast('Please enter a habit name', "warning", 'top');
      return;
    }
    setSaving(true);
    try {
      // Create the payload according to the API requirements
      const now = new Date();
      
      // Set target time based on the selected reminder time
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const targetTime = new Date(now);
      targetTime.setHours(hours, minutes, 0, 0);
      
      // Get icon_id from the selected icon or use default
      const iconId = selectedIcon ? ICON_ID_MAP[selectedIcon.name] || 1 : 1;
      
      const payload = {
        name,
        created_time: now.toISOString(),
        target_time: targetTime.toISOString(),
        icon_id: iconId,
        repeats: selectedDays,
      };
      
      // Call the API to create the habit
      const response = await fetchPost(`${API_BASE_URL}/habits`, payload);
      
      if (response.success) {
        showToast('Habit created successfully', "success", 'top');
        router.back();
      } else {
        showToast('Failed to create habit', "error", 'top');
      }
    } catch (e) {
      console.error('Error creating habit:', e);
      showToast('Failed to create habit', "error", 'top');
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => {
      if (prev.includes(dayId)) {
        return prev.filter(id => id !== dayId);
      } else {
        return [...prev, dayId].sort((a, b) => a - b);
      }
    });
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Habit</Text>
        </View>
        <Text style={styles.label}>Select a Habit</Text>
        <View style={styles.dropdownContainer}>
          {SUGGESTED_HABITS.map(habit => (
            <TouchableOpacity
              key={habit}
              style={[styles.dropdownItem, selectedHabit === habit && styles.selectedDropdownItem]}
              onPress={() => setSelectedHabit(habit)}
            >
              <Text style={{ color: selectedHabit === habit ? '#fff' : '#ccc' }}>{habit}</Text>
            </TouchableOpacity>
          ))}
        </View>
      {selectedHabit === 'Custom' && (
        <TextInput
          style={styles.input}
          placeholder="Enter custom habit name"
          placeholderTextColor="#666"
          value={customHabit}
          onChangeText={setCustomHabit}
        />
      )}
      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your habit"
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Choose an Icon (optional)</Text>
      <View style={styles.iconGrid}>
        {SUGGESTED_ICONS.map((icon) => {
          const isSelected = selectedIcon && selectedIcon.set === icon.set && selectedIcon.name === icon.name;
          return (
            <TouchableOpacity
              key={icon.set + icon.name}
              style={[styles.iconButton, isSelected && styles.selectedIconButton]}
              onPress={() => setSelectedIcon(isSelected ? undefined : icon)}
            >
              {renderIcon(icon, 32, isSelected ? '#fff' : '#ccc')}
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.label}>Habit Time</Text>
      <TimePicker
        value={reminder.time}
        onTimeChange={time => setReminder(prev => ({ ...prev, time }))}
        enabled={true}
        onToggle={() => {}}
      />
      
      <Text style={styles.label}>Repeat on Days</Text>
      <View style={styles.daysContainer}>
        {DAYS_OF_WEEK.map((day) => (
          <TouchableOpacity
            key={day.id}
            style={[styles.dayButton, selectedDays.includes(day.id) && styles.selectedDayButton]}
            onPress={() => toggleDay(day.id)}
          >
            <Text style={[styles.dayText, selectedDays.includes(day.id) && styles.selectedDayText]}>
              {day.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Button
        onPress={handleSave}
        loading={saving}
        disabled={saving}
        style={{ marginTop: 24, marginBottom: 8 }}
      >
        {saving ? 'Saving...' : 'Save Habit'}
      </Button>
    </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#14141c',
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 48 : 64,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  dropdownContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dropdownItem: {
    backgroundColor: '#23232b',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  selectedDropdownItem: {
    backgroundColor: '#14141c',
    borderWidth: 2,
    borderColor: '#636ae8', // subtle highlight
  },
  input: {
    backgroundColor: '#23232b',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    marginBottom: 4,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  iconButton: {
    margin: 8,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#23232b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedIconButton: {
    borderColor: '#636ae8',
    backgroundColor: '#14141c',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#23232b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDayButton: {
    borderColor: '#636ae8',
    backgroundColor: '#14141c',
  },
  dayText: {
    color: '#ccc',
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#FF1972',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
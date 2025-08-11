import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ProtectedRoute } from '../components/ProtectedRoute';
import TimePicker from '../components/TimePicker';
import { HabitReminder } from '../types/habit';
import { useApi } from '../hooks/useApi';

// Icon options with their corresponding icon_id
const ICON_OPTIONS = [
  { id: 1, name: 'water', set: 'Ionicons' as const },
  { id: 2, name: 'book', set: 'Ionicons' as const },
  { id: 3, name: 'fitness', set: 'Ionicons' as const },
  { id: 4, name: 'cafe', set: 'Ionicons' as const },
  { id: 5, name: 'moon', set: 'Ionicons' as const },
  { id: 6, name: 'walk', set: 'Ionicons' as const },
  { id: 7, name: 'barbell', set: 'Ionicons' as const },
  { id: 8, name: 'star', set: 'Ionicons' as const },
];

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

export default function AddHabitPage() {
  const router = useRouter();
  const [habitName, setHabitName] = useState('');
  const [selectedIconId, setSelectedIconId] = useState<number>(1);
  const [targetTime, setTargetTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Default to weekdays
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();
  const { fetchPost } = useApi();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleSave = async () => {
    if (!habitName.trim()) {
      showToast('Please enter a habit name', "warning", 'top');
      return;
    }

    setSaving(true);
    try {
      const now = new Date();

      // Set target time based on the selected time
      const [hours, minutes] = targetTime.split(':').map(Number);
      const targetDateTime = new Date(now);
      targetDateTime.setHours(hours, minutes, 0, 0);

      const payload = {
        name: habitName.trim(),
        created_time: now.toISOString(),
        target_time: targetDateTime.toISOString(),
        icon_id: selectedIconId,
        repeats: selectedDays,
      };

      // Call the API to create the habit
      const response = await fetchPost(`${API_BASE_URL}/habits`, payload);

      if (response.success) {
        showToast('Habit created successfully', 'success', 'top');
        router.back();
      } else {
        showToast(response.error || 'Failed to create habit', 'error', 'top');
      }
    } catch (e) {
      console.error('Error creating habit:', e);
      showToast('Failed to create habit', 'error', 'top');
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

        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter habit name"
          placeholderTextColor="#666"
          value={habitName}
          onChangeText={setHabitName}
        />

        <Text style={styles.label}>Select an Icon</Text>
        <View style={styles.iconGrid}>
          {ICON_OPTIONS.map((icon) => (
            <TouchableOpacity
              key={icon.id}
              style={[
                styles.iconButton,
                selectedIconId === icon.id && styles.selectedIconButton
              ]}
              onPress={() => setSelectedIconId(icon.id)}
            >
              <Ionicons name={icon.name as any} size={32} color={selectedIconId === icon.id ? '#fff' : '#ccc'} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Habit Time</Text>
        <TimePicker
          value={targetTime}
          onTimeChange={setTargetTime}
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
          style={styles.saveButton}
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
    padding: 16,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#23232b',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#23232b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedIconButton: {
    backgroundColor: '#3a3a3a',
    borderColor: '#666',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#23232b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedDayButton: {
    backgroundColor: '#3a3a3a',
    borderColor: '#666',
  },
  dayText: {
    color: '#ccc',
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 32,
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
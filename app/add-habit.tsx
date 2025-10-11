import Button from '@/components/ui/Button';
import colors from '@/constants/Colors';
import { useToast } from '@/hooks/useToast';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { mutate } from 'swr';
import { ProtectedRoute } from '../components/ProtectedRoute';
import CustomDateTimePicker from '../components/TimePicker';
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

      // Map UI indices (Sun=0..Sat=6) to backend indices (Mon=0..Sun=6)
      const toBackendIndex = (uiIndex: number) => (uiIndex + 6) % 7;
      const mappedDays = selectedDays.map(toBackendIndex);

      // Construct payload: if one day selected -> use `day`, else `repeats`
      const basePayload = {
        name: habitName.trim(),
        created_time: now.toISOString(),
        target_time: targetDateTime.toISOString(),
        icon_id: selectedIconId,
      } as any;

      const payload =
        mappedDays.length === 1
          ? { ...basePayload, day: mappedDays[0] }
          : { ...basePayload, repeats: mappedDays };

      // Call the API to create the habit
      const response = await fetchPost(`${API_BASE_URL}/habits`, payload);

      if (response.success) {
        showToast('Habit created successfully', 'success', 'top');
        const todayUTC = new Date().toISOString().split('T')[0]; 
        await mutate(`/habits?date=${todayUTC}`);
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Add New Habit</Text>
              <Text style={styles.headerDate}>Create a new habit to track</Text>
            </View>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter habit name"
            placeholderTextColor="#9ca3af"
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
                <Ionicons name={icon.name as any} size={32} color={selectedIconId === icon.id ? colors.primary : colors.accent} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Habit Time</Text>
          <CustomDateTimePicker
            value={targetTime}
            onValueChange={setTargetTime}
            mode="time"
            title="Select Habit Time"
            enabled={true}
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
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  header: {
    backgroundColor: colors['bg-primary'],
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: '#bdc3c7',
    fontWeight: '500',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    color: '#1a1a1a',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedIconButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDayButton: {
    backgroundColor: colors['bg-secondary'],
    borderColor: '#d1d5db',
  },
  dayText: {
    color: colors['text-dark'],
    fontWeight: '500',
  },
  selectedDayText: {
    color: colors['text-light'],
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
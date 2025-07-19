// components/TimePicker.tsx
import { PookieColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TimePickerProps {
  value: string; // HH:MM format
  onTimeChange: (time: string) => void;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function TimePicker({ value, onTimeChange, enabled, onToggle }: TimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const parseTime = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDisplayTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      const timeString = formatTime(selectedDate);
      onTimeChange(timeString);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Daily Reminder</Text>
        <TouchableOpacity
          style={[styles.toggle, enabled && styles.toggleActive]}
          onPress={() => onToggle(!enabled)}
        >
          <View style={[styles.toggleCircle, enabled && styles.toggleCircleActive]} />
        </TouchableOpacity>
      </View>

      {enabled && (
        <View style={styles.timeSection}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="time-outline" size={20} color={PookieColors.hotPink} />
            <Text style={styles.timeText}>{formatDisplayTime(value)}</Text>
            <Ionicons name="chevron-down" size={20} color={PookieColors.hotPink} />
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={parseTime(value)}
              mode="time"
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
              style={styles.picker}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#23232b',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.2,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#39394a',
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#444',
  },
  toggleActive: {
    backgroundColor: PookieColors.hotPink,
    borderColor: PookieColors.hotPink,
  },
  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: 'flex-start',
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  timeSection: {
    marginTop: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181824',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: PookieColors.hotPink,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  timeText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 17,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  picker: {
    marginTop: 10,
  },
});
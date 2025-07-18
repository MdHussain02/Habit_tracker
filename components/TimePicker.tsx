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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Reminder</Text>
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
            <Ionicons name="time-outline" size={20} color={PookieColors.deepMagenta} />
            <Text style={styles.timeText}>{formatDisplayTime(value)}</Text>
            <Ionicons name="chevron-down" size={20} color={PookieColors.mediumOrchid} />
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
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: PookieColors.mediumOrchid,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: PookieColors.lightOrchid,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: PookieColors.deepMagenta,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
    backgroundColor: PookieColors.pastelPink,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: PookieColors.deepMagenta,
  },
  timeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: PookieColors.deepMagenta,
    fontWeight: '500',
  },
  picker: {
    marginTop: 10,
  },
});
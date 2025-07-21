// components/TimePicker.tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TimePickerProps {
  value: string; // HH:MM format
  onTimeChange: (time: string) => void;
  title?: string;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  showToggle?: boolean;
}

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

export default function TimePicker({ 
  value, 
  onTimeChange,
  title,
  enabled = true,
}: TimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

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
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      <View style={styles.timeSection}>
        <TouchableOpacity
          style={[styles.timeButton, !enabled && { opacity: 0.5 }]}
          onPress={() => enabled && setShowPicker(true)}
          disabled={!enabled}
        >
          <Ionicons name="time-outline" size={20} color={"#5c62d2"} />
          <Text style={styles.timeText}>
            {value ? formatDisplayTime(value) : "Select Time"}
          </Text>
          <Ionicons name="chevron-down" size={20} color={"#5c62d2"} />
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={value ? parseTime(value) : new Date()}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
            style={styles.picker}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.2,
  },
  timeSection: {
    marginTop: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22222b',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "#363638",
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
// components/AddHabitModal.tsx
import { PookieColors } from '@/constants/Colors';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { default as React, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { HabitFormData, HabitIcon, HabitReminder } from '../types/habit';
import TimePicker from './TimePicker';

const SUGGESTED_ICONS: HabitIcon[] = [
  { set: 'Ionicons', name: 'water' },
  { set: 'Ionicons', name: 'book' },
  { set: 'MaterialIcons', name: 'directions-run' },
  { set: 'MaterialIcons', name: 'self-improvement' },
  { set: 'MaterialIcons', name: 'restaurant' },
  { set: 'Ionicons', name: 'bed' },
  { set: 'FontAwesome', name: 'brain' },
  { set: 'MaterialIcons', name: 'fitness-center' },
  { set: 'Ionicons', name: 'target' },
  { set: 'Ionicons', name: 'star' },
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

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAddHabit: (habitData: HabitFormData) => void;
}

export default function AddHabitModal({ visible, onClose, onAddHabit }: AddHabitModalProps) {
  const [habitName, setHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<HabitIcon | undefined>(undefined);
  const [reminder, setReminder] = useState<HabitReminder>({
    enabled: false,
    time: '09:00', // Default to 9:00 AM
  });

  const handleAddHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    onAddHabit({
      name: habitName.trim(),
      icon: selectedIcon,
      reminder: reminder.enabled ? reminder : undefined,
    });

    // Reset form
    setHabitName('');
    setSelectedIcon(undefined);
    setReminder({ enabled: false, time: '09:00' });
    onClose();
  };

  const handleClose = () => {
    setHabitName('');
    setSelectedIcon(undefined);
    setReminder({ enabled: false, time: '09:00' });
    onClose();
  };

  const handleReminderToggle = (enabled: boolean) => {
    setReminder(prev => ({ ...prev, enabled }));
  };

  const handleTimeChange = (time: string) => {
    setReminder(prev => ({ ...prev, time }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={PookieColors.deepMagenta} />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Habit</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habit Name</Text>
            <TextInput
              style={styles.input}
              value={habitName}
              onChangeText={setHabitName}
              placeholder="e.g., Drink Water, Read Book"
              placeholderTextColor={PookieColors.lightOrchid}
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose an Icon (Optional)</Text>
            <View style={styles.iconGrid}>
              {SUGGESTED_ICONS.map((icon) => {
                const isSelected =
                  selectedIcon &&
                  selectedIcon.set === icon.set &&
                  selectedIcon.name === icon.name;
                return (
                  <TouchableOpacity
                    key={icon.set + icon.name}
                    style={[
                      styles.iconButton,
                      isSelected && styles.selectedIconButton,
                    ]}
                    onPress={() =>
                      setSelectedIcon(isSelected ? undefined : icon)
                    }
                  >
                    {renderIcon(icon, 28, isSelected ? PookieColors.deepMagenta : '#fff')}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <TimePicker
              value={reminder.time}
              onTimeChange={handleTimeChange}
              enabled={reminder.enabled}
              onToggle={handleReminderToggle}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
            <Text style={styles.addButtonText}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PookieColors.veryLightPink,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: PookieColors.deepMagenta,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: PookieColors.deepMagenta,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PookieColors.mediumOrchid,
    marginBottom: 12,
  },
  input: {
    backgroundColor: PookieColors.pastelPink,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: PookieColors.deepMagenta,
    borderWidth: 1,
    borderColor: PookieColors.deepMagenta,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 10,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PookieColors.lightOrchid,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIconButton: {
    borderColor: PookieColors.deepMagenta,
    backgroundColor: PookieColors.pastelPink,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  addButton: {
    backgroundColor: PookieColors.mediumOrchid,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
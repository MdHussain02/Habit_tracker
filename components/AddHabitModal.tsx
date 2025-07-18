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
  { set: 'MaterialIcons', name: 'fitness-center' },
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
      presentationStyle="overFullScreen"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View  style={styles.bottomSheet}>
          <View style={styles.dragIndicator} />
          <View style={styles.headerModern}>
            <Text style={styles.titleModern}>Add New Habit</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButtonModern}>
              <Ionicons name="close" size={28} color={PookieColors.palePink} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.contentModern} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionModern}>
              <Text style={styles.sectionTitleModern}>Habit Name</Text>
              <TextInput
                style={styles.inputModern}
                value={habitName}
                onChangeText={setHabitName}
                placeholder="e.g., Drink Water, Read Book"
                placeholderTextColor={PookieColors.deepRed}
                autoFocus
              />
            </View>
            <View style={styles.sectionModern}>
              <Text style={styles.sectionTitleModern}>Choose an Icon (Optional)</Text>
              <View style={styles.iconGridModern}>
                {SUGGESTED_ICONS.map((icon) => {
                  const isSelected =
                    selectedIcon &&
                    selectedIcon.set === icon.set &&
                    selectedIcon.name === icon.name;
                  return (
                    <TouchableOpacity
                      key={icon.set + icon.name}
                      style={[
                        styles.iconButtonModern,
                        isSelected && styles.selectedIconButtonModern,
                      ]}
                      onPress={() =>
                        setSelectedIcon(isSelected ? undefined : icon)
                      }
                    >
                      {renderIcon(icon, 32, isSelected ? PookieColors.palePink : PookieColors.deepRed)}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.sectionModern}>
              <TimePicker
                value={reminder.time}
                onTimeChange={handleTimeChange}
                enabled={reminder.enabled}
                onToggle={handleReminderToggle}
              />
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.addButtonModern} onPress={handleAddHabit}>
            <Text style={styles.addButtonTextModern}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    borderTopLeftRadius: 52,
    borderTopRightRadius: 32,
    paddingBottom: 32,
    paddingTop: 12,
    paddingHorizontal: 24,
    minHeight: 600,
    shadowColor: PookieColors.deepRed,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    backgroundColor : "#fff",
    // backgroundColor: PookieColors.palePink,
  },
  dragIndicator: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: PookieColors.hotPink,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  titleModern: {
    fontSize: 22,
    fontWeight: '700',
    color: PookieColors.deepRed,
    flex: 1,
    textAlign: 'center',
  },
  closeButtonModern: {
    padding: 8,
    position: 'absolute',
    right: 0,
    top: -4,
  },
  contentModern: {
    flex: 1,
    paddingHorizontal: 0,
  },
  sectionModern: {
    marginBottom: 24,
  },
  sectionTitleModern: {
    fontSize: 15,
    fontWeight: '600',
    color: PookieColors.hotPink,
    marginBottom: 10,
  },
  inputModern: {
    backgroundColor: PookieColors.palePink,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: PookieColors.deepRed,
    borderWidth: 1,
    borderColor: PookieColors.deepRed,
    marginBottom: 4,
  },
  iconGridModern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 20,
  },
  iconButtonModern: {
    margin:10,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: PookieColors.palePink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: PookieColors.deepRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedIconButtonModern: {
    borderColor: PookieColors.deepRed,
    backgroundColor: PookieColors.deepRed,
  },
  addButtonModern: {
    backgroundColor: PookieColors.deepRed,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    shadowColor: PookieColors.deepRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonTextModern: {
    color: PookieColors.palePink,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
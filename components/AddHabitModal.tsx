// components/AddHabitModal.tsx
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { default as React, useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  Platform,
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
    enabled: true, // Always enabled
    time: '09:00', // Default to 9:00 AM
  });
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  React.useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleAddHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }
    if (!reminder.time) {
      Alert.alert('Error', 'Please select a time for your habit');
      return;
    }
    onAddHabit({
      name: habitName.trim(),
      icon: selectedIcon,
      reminder: { enabled: true, time: reminder.time }, // Always include time
    });
    // Reset form
    setHabitName('');
    setSelectedIcon(undefined);
    setReminder({ enabled: true, time: '09:00' });
    onClose();
  };

  const handleClose = () => {
    setHabitName('');
    setSelectedIcon(undefined);
    setReminder({ enabled: true, time: '09:00' });
    onClose();
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
        <View
          style={[
            styles.bottomSheet,
            Platform.OS === 'android' && keyboardOpen ? { maxHeight: 400 } : {},
          ]}
        >
          <View style={styles.dragIndicator} />
          <View style={styles.headerModern}>
            <TouchableOpacity onPress={handleClose} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.titleModern}>Add New Habit</Text>
          </View>
          <ScrollView style={styles.contentModern} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionModern}>
              <Text style={styles.sectionTitleModern}>Habit Name</Text>
              <TextInput
                style={styles.inputModern}
                value={habitName}
                onChangeText={setHabitName}
                placeholder="e.g., Meditate daily"
                placeholderTextColor="#666"
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
                      {renderIcon(icon, 32, isSelected ? '#fff' : '#ccc')}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.sectionModern}>
              <Text style={styles.sectionTitleModern}>Habit Time</Text>
              <TimePicker
                value={reminder.time}
                onTimeChange={handleTimeChange}
                enabled={true}
                onToggle={() => {}}
              />
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.addButtonModern} onPress={handleAddHabit}>
            <Text style={styles.addButtonTextModern}>Save Habit</Text>
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
    // marginTop:20,

  },
  bottomSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    // paddingBottom: 32,
    paddingTop: 12,
    paddingHorizontal: 24,
    minHeight: 600,
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: -4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 16,
    elevation: 2,
    backgroundColor: '#f0f0f0', // Light background
  },
  dragIndicator: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ff9b00", // Use orange from palette
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backButton: {
    padding: 8,
  },
  titleModern: {
    fontSize: 22,
    fontWeight: '700',
    color: '#11181C', // Dark text
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
    color: '#11181C', // Dark text
    marginBottom: 10,
  },
  inputModern: {
    backgroundColor: '#fff', // White background
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#11181C', // Dark text
    borderWidth: 1,
    borderColor: '#ccc', // Light border
    marginBottom: 4,
  },
  iconGridModern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 20,
  },
  iconButtonModern: {
    margin: 10,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e0e0e0', // Light gray background
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedIconButtonModern: {
    borderColor: '#ff9b00', // Use orange from palette
    backgroundColor: '#ff9b00', // Use orange from palette
  },
  addButtonModern: {
    backgroundColor: '#ff9b00', // Use orange from palette
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonTextModern: {
    color: '#11181C', // Dark text
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
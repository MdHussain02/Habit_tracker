import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TimePicker from '../../components/TimePicker';
import { getUserData, saveUserData } from '../../utils/storage';

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const fitnessLevelOptions = ['Beginner', 'Intermediate', 'Advanced'];
const primaryGoalOptions = ['Weight Loss', 'Muscle Gain', 'General Fitness', 'Endurance', 'Flexibility'];
const workoutTimeOptions = ['Early Morning (5-7 AM)', 'Morning (7-9 AM)', 'Late Morning (9-11 AM)', 'Afternoon (12-3 PM)', 'Late Afternoon (3-5 PM)', 'Evening (5-7 PM)', 'Night (7-9 PM)'];
const motivationLevelOptions = ['1 - Very Low', '2', '3', '4', '5 - Moderate', '6', '7', '8', '9', '10 - Very High'];

export default function PersonalDetailsScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    fitnessLevel: '',
    primaryGoal: '',
    wakeUpTime: '',
    sleepTime: '',
    preferredWorkoutTime: '',
    notifications: true,
    weeklyGoal: '',
    motivationLevel: '',
  });
  const [originalForm, setOriginalForm] = useState(form);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showFitnessDropdown, setShowFitnessDropdown] = useState(false);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);
  const [showWorkoutTimeDropdown, setShowWorkoutTimeDropdown] = useState(false);
  const [showMotivationDropdown, setShowMotivationDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await getUserData();
      if (user) {
        setForm({ ...form, ...user, confirmPassword: user.password || '' });
        setOriginalForm({ ...form, ...user, confirmPassword: user.password || '' });
      }
      setLoading(false);
    })();
  }, []);

  const handleChange = (key: string, value: string | boolean) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async (section: string) => {
    try {
      await saveUserData(form);
      setOriginalForm(form);
      setEditingSection(null);
      Alert.alert('Success', 'Personal details updated!');
    } catch (e) {
      Alert.alert('Error', 'Could not save details');
    }
  };

  const handleCancel = (section: string) => {
    setForm(originalForm);
    setEditingSection(null);
  };

  const DropdownButton = ({ 
    value, 
    placeholder, 
    onPress, 
    style, 
    editable = true
  }: { 
    value: string; 
    placeholder: string; 
    onPress: () => void; 
    style?: any;
    editable?: boolean;
  }) => (
    <TouchableOpacity style={[styles.dropdownButton, style, !editable && styles.disabledField]} onPress={editable ? onPress : undefined} disabled={!editable}>
      <Text style={[styles.dropdownButtonText, !value && styles.placeholderText]}>
        {value || placeholder}
      </Text>
      <Text style={styles.dropdownArrow}>▼</Text>
    </TouchableOpacity>
  );

  const DropdownModal = ({ 
    visible, 
    onClose, 
    options, 
    onSelect, 
    title 
  }: { 
    visible: boolean; 
    onClose: () => void; 
    options: string[]; 
    onSelect: (value: string) => void; 
    title: string;
  }) => (
    <View>
      {visible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <ScrollView style={styles.dropdownList}>
              {options.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  if (loading) return null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Personal Details</Text>
            <Text style={styles.headerDate}>Manage your profile information</Text>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Personal Details</Text>

        {/* Personal Info Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <TextInput
            style={[styles.input, editingSection !== 'personal' && styles.disabledField]}
            placeholder="Full Name"
            placeholderTextColor="#9ca3af"
            value={form.name}
            onChangeText={v => handleChange('name', v)}
            editable={editingSection === 'personal'}
          />
          <TextInput
            style={[styles.input, editingSection !== 'personal' && styles.disabledField]}
            placeholder="Email Address"
            placeholderTextColor="#9ca3af"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={editingSection === 'personal'}
          />
          <TextInput
            style={[styles.input, editingSection !== 'personal' && styles.disabledField]}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={form.password}
            onChangeText={v => handleChange('password', v)}
            secureTextEntry
            editable={editingSection === 'personal'}
          />
          <TextInput
            style={[styles.input, editingSection !== 'personal' && styles.disabledField]}
            placeholder="Confirm Password"
            placeholderTextColor="#9ca3af"
            value={form.confirmPassword}
            onChangeText={v => handleChange('confirmPassword', v)}
            secureTextEntry
            editable={editingSection === 'personal'}
          />
          {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
            <Text style={styles.errorText}>Passwords don't match</Text>
          )}
          {editingSection === 'personal' ? (
            <View style={styles.sectionButtonRow}>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => handleSave('personal')}>
                <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => handleCancel('personal')}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setEditingSection('personal')}>
              <Text style={[styles.buttonText, styles.editButtonText]}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Health & Goals Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Health & Goals</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput, editingSection !== 'health' && styles.disabledField]}
              placeholder="Height (cm)"
              placeholderTextColor="#9ca3af"
              value={form.height}
              onChangeText={v => handleChange('height', v)}
              keyboardType="numeric"
              editable={editingSection === 'health'}
            />
            <TextInput
              style={[styles.input, styles.halfInput, editingSection !== 'health' && styles.disabledField]}
              placeholder="Weight (kg)"
              placeholderTextColor="#9ca3af"
              value={form.weight}
              onChangeText={v => handleChange('weight', v)}
              keyboardType="numeric"
              editable={editingSection === 'health'}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput, editingSection !== 'health' && styles.disabledField]}
              placeholder="Age"
              placeholderTextColor="#9ca3af"
              value={form.age}
              onChangeText={v => handleChange('age', v)}
              keyboardType="numeric"
              editable={editingSection === 'health'}
            />
            <DropdownButton
              value={form.gender}
              placeholder="Select Gender"
              onPress={() => setShowGenderDropdown(true)}
              style={styles.halfInput}
              editable={editingSection === 'health'}
            />
          </View>
          <DropdownButton
            value={form.fitnessLevel}
            placeholder="Select Fitness Level"
            onPress={() => setShowFitnessDropdown(true)}
            editable={editingSection === 'health'}
          />
          <DropdownButton
            value={form.primaryGoal}
            placeholder="Select Primary Goal"
            onPress={() => setShowGoalDropdown(true)}
            editable={editingSection === 'health'}
          />
          <TextInput
            style={[styles.input, editingSection !== 'health' && styles.disabledField]}
            placeholder="Weekly Goal (e.g., 3 workouts per week)"
            placeholderTextColor="#9ca3af"
            value={form.weeklyGoal}
            onChangeText={v => handleChange('weeklyGoal', v)}
            editable={editingSection === 'health'}
          />
          {editingSection === 'health' ? (
            <View style={styles.sectionButtonRow}>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => handleSave('health')}>
                <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => handleCancel('health')}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setEditingSection('health')}>
              <Text style={[styles.buttonText, styles.editButtonText]}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TimePicker
            title="Wake Up Time"
            value={form.wakeUpTime}
            onTimeChange={time => editingSection === 'prefs' && handleChange('wakeUpTime', time)}
            enabled={editingSection === 'prefs'}
          />
          <TimePicker
            title="Sleep Time"
            value={form.sleepTime}
            onTimeChange={time => editingSection === 'prefs' && handleChange('sleepTime', time)}
            enabled={editingSection === 'prefs'}
          />
          <DropdownButton
            value={form.preferredWorkoutTime}
            placeholder="Select Preferred Workout Time"
            onPress={() => setShowWorkoutTimeDropdown(true)}
            editable={editingSection === 'prefs'}
          />
          <DropdownButton
            value={form.motivationLevel}
            placeholder="Select Motivation Level"
            onPress={() => setShowMotivationDropdown(true)}
            editable={editingSection === 'prefs'}
          />
          {editingSection === 'prefs' ? (
            <View style={styles.sectionButtonRow}>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => handleSave('prefs')}>
                <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => handleCancel('prefs')}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setEditingSection('prefs')}>
              <Text style={[styles.buttonText, styles.editButtonText]}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dropdown Modals */}
        <DropdownModal
          visible={showGenderDropdown}
          onClose={() => setShowGenderDropdown(false)}
          options={genderOptions}
          onSelect={value => handleChange('gender', value)}
          title="Select Gender"
        />
        <DropdownModal
          visible={showFitnessDropdown}
          onClose={() => setShowFitnessDropdown(false)}
          options={fitnessLevelOptions}
          onSelect={value => handleChange('fitnessLevel', value)}
          title="Select Fitness Level"
        />
        <DropdownModal
          visible={showGoalDropdown}
          onClose={() => setShowGoalDropdown(false)}
          options={primaryGoalOptions}
          onSelect={value => handleChange('primaryGoal', value)}
          title="Select Primary Goal"
        />
        <DropdownModal
          visible={showWorkoutTimeDropdown}
          onClose={() => setShowWorkoutTimeDropdown(false)}
          options={workoutTimeOptions}
          onSelect={value => handleChange('preferredWorkoutTime', value)}
          title="Select Preferred Workout Time"
        />
        <DropdownModal
          visible={showMotivationDropdown}
          onClose={() => setShowMotivationDropdown(false)}
          options={motivationLevelOptions}
          onSelect={value => handleChange('motivationLevel', value)}
          title="Select Motivation Level"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  halfInput: {
    flex: 1,
    marginRight: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    minWidth: 100,
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  editButton: {
    backgroundColor: '#f3f4f6',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
  },
  cancelButtonText: {
    color: '#4b5563',
  },
  editButtonText: {
    color: '#4CAF50',
  },
  sectionButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 10,
  },
  // Dropdown styles
  dropdownButton: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#1a1a1a',
    fontSize: 15,
    flex: 1,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  dropdownArrow: {
    color: '#9ca3af',
    fontSize: 14,
  },
  disabledField: {
    backgroundColor: '#f9fafb',
    opacity: 0.7,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownList: {
    maxHeight: 300,
    width: '100%',
    marginBottom: 12,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    color: '#1a1a1a',
    fontSize: 15,
  },
  modalCloseButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
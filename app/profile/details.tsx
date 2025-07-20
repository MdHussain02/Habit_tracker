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
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Personal Details</Text>

        {/* Personal Info Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <TextInput
            style={[styles.input, editingSection !== 'personal' && styles.disabledField]}
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={form.name}
            onChangeText={v => handleChange('name', v)}
            editable={editingSection === 'personal'}
          />
          <TextInput
            style={[styles.input, editingSection !== 'personal' && styles.disabledField]}
            placeholder="Email Address"
            placeholderTextColor="#aaa"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={editingSection === 'personal'}
          />
          <TextInput
            style={[styles.input, editingSection !== 'personal' && styles.disabledField]}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={form.password}
            onChangeText={v => handleChange('password', v)}
            secureTextEntry
            editable={editingSection === 'personal'}
          />
          <TextInput
            style={[styles.input, editingSection !== 'personal' && styles.disabledField]}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
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
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => handleCancel('personal')}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setEditingSection('personal')}>
              <Text style={styles.buttonText}>Edit</Text>
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
              placeholderTextColor="#aaa"
              value={form.height}
              onChangeText={v => handleChange('height', v)}
              keyboardType="numeric"
              editable={editingSection === 'health'}
            />
            <TextInput
              style={[styles.input, styles.halfInput, editingSection !== 'health' && styles.disabledField]}
              placeholder="Weight (kg)"
              placeholderTextColor="#aaa"
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
              placeholderTextColor="#aaa"
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
            placeholderTextColor="#aaa"
            value={form.weeklyGoal}
            onChangeText={v => handleChange('weeklyGoal', v)}
            editable={editingSection === 'health'}
          />
          {editingSection === 'health' ? (
            <View style={styles.sectionButtonRow}>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => handleSave('health')}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => handleCancel('health')}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setEditingSection('health')}>
              <Text style={styles.buttonText}>Edit</Text>
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
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => handleCancel('prefs')}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setEditingSection('prefs')}>
              <Text style={styles.buttonText}>Edit</Text>
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
    backgroundColor: '#18181b',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#23232b',
    borderRadius: 18,
    padding: 22,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7066F6',
    marginBottom: 18,
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  input: {
    width: '100%',
    backgroundColor: '#23232b',
    color: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7066F6',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: 'center',
    minWidth: 100,
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#7066F6',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  editButton: {
    backgroundColor: '#39394a',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
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
    backgroundColor: '#23232b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: '#aaa',
  },
  dropdownArrow: {
    color: '#666',
    fontSize: 12,
  },
  disabledField: {
    opacity: 0.5,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: '#23232b',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownList: {
    maxHeight: 300,
    width: '100%',
    marginBottom: 12,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: '#7066F6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 
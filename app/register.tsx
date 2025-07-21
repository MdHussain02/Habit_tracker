import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TimePicker from '../components/TimePicker';
import { saveUserData } from '../utils/storage';

const { width } = Dimensions.get('window');

const steps = [
  'Personal Info',
  'Health & Goals',
  'Preferences',
];

// Dropdown options
const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const fitnessLevelOptions = ['Beginner', 'Intermediate', 'Advanced'];
const primaryGoalOptions = ['Weight Loss', 'Muscle Gain', 'General Fitness', 'Endurance', 'Flexibility'];
const workoutTimeOptions = ['Early Morning (5-7 AM)', 'Morning (7-9 AM)', 'Late Morning (9-11 AM)', 'Afternoon (12-3 PM)', 'Late Afternoon (3-5 PM)', 'Evening (5-7 PM)', 'Night (7-9 PM)'];
const motivationLevelOptions = ['1 - Very Low', '2', '3', '4', '5 - Moderate', '6', '7', '8', '9', '10 - Very High'];

export default function RegistrationScreen({ onRegister }: { onRegister: (user: any) => void }) {
  const [step, setStep] = useState(0);
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
    motivationLevel: '',
  });

  
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Dropdown states
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showFitnessDropdown, setShowFitnessDropdown] = useState(false);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);
  const [showWorkoutTimeDropdown, setShowWorkoutTimeDropdown] = useState(false);
  const [showMotivationDropdown, setShowMotivationDropdown] = useState(false);

  const handleChange = (key: string, value: string | boolean) => {
    setForm({ ...form, [key]: value });
  };

  const canNext = () => {
    if (step === 0) return form.name && form.email && form.password && form.password === form.confirmPassword;
    if (step === 1) return form.height && form.weight && form.age && form.gender && form.fitnessLevel && form.primaryGoal;
    if (step === 2) return form.wakeUpTime && form.sleepTime && form.preferredWorkoutTime;
    return true;
  };

  const dummyRegisterApi = async (form: any) => {
    // Format the payload as required by the backend
    const payload = {
      // username: form.username,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      profile: {
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        weight: Number(form.weight),
        height: Number(form.height),
        fitness_level: form.fitnessLevel,
        motivation_level: form.motivationLevel,
        notifications: form.notifications,
        preferred_workout_time: form.preferredWorkoutTime,
        primary_goal: form.primaryGoal,
        sleep_time: form.sleepTime,
        wake_up_time: form.wakeUpTime,
        weekly_goal: Number(form.weeklyGoal),
      },
    };
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
     return { success: false, error };
    }
  };

  const dummyGetApi = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`); // Example GET endpoinPPPPt
      const data = await response.json();
      console.log('GET API Response:', data);
      return data;
    } catch (error) {
      console.error('GET API Error:', error);
      return { success: false, error };
    }
  };

  // Optionally, call dummyGetApi on mount for demonstration
  useEffect(() => {
    dummyGetApi();
  }, []);


  const nextStep = async () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      // Log registration data and post to dummy API
      console.log('Registration Data:', form);
      const apiResult = await dummyRegisterApi(form);
      console.log('API Response:', apiResult);
      await saveUserData(form);
      onRegister(form);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const progress = ((step + 1) / steps.length) * 100;

  const DropdownButton = ({ 
    value, 
    placeholder, 
    onPress, 
    style 
  }: { 
    value: string; 
    placeholder: string; 
    onPress: () => void; 
    style?: any;
  }) => (
    <TouchableOpacity style={[styles.dropdownButton, style]} onPress={onPress}>
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
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdownList}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const router = useRouter();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backNavBtn} onPress={() => router.back()}>
          <Text style={styles.backNavBtnText}>{'< Back'}</Text>
        </TouchableOpacity>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepContainer}>
          {steps.map((label, idx) => (
            <View key={label} style={styles.stepItem}>
              <View style={[styles.stepCircle, step >= idx && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, step >= idx && styles.stepNumberActive]}>
                  {idx + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, step >= idx && styles.stepLabelActive]}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.title}>{steps[step]}</Text>

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Tell us about yourself</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              value={form.name}
              onChangeText={v => handleChange('name', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#aaa"
              value={form.email}
              onChangeText={v => handleChange('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={form.password}
              onChangeText={v => handleChange('password', v)}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              value={form.confirmPassword}
              onChangeText={v => handleChange('confirmPassword', v)}
              secureTextEntry
            />
            {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
              <Text style={styles.errorText}>Passwords don't match</Text>
            )}
          </View>
        )}

        {/* Step 1: Health & Goals */}
        {step === 1 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Health & Fitness Goals</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Height (cm)"
                placeholderTextColor="#aaa"
                value={form.height}
                onChangeText={v => handleChange('height', v)}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Weight (kg)"
                placeholderTextColor="#aaa"
                value={form.weight}
                onChangeText={v => handleChange('weight', v)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Age"
                placeholderTextColor="#aaa"
                value={form.age}
                onChangeText={v => handleChange('age', v)}
                keyboardType="numeric"
              />
              <DropdownButton
                value={form.gender}
                placeholder="Select Gender"
                onPress={() => setShowGenderDropdown(true)}
                style={styles.halfInput}
              />
            </View>
            <DropdownButton
              value={form.fitnessLevel}
              placeholder="Select Fitness Level"
              onPress={() => setShowFitnessDropdown(true)}
            />
            <DropdownButton
              value={form.primaryGoal}
              placeholder="Select Primary Goal"
              onPress={() => setShowGoalDropdown(true)}
            />
          </View>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Daily Schedule & Preferences</Text>
            <TimePicker
              title="Wake Up Time"
              value={form.wakeUpTime}
              onTimeChange={(time) => handleChange('wakeUpTime', time)}
            />
            <TimePicker
              title="Sleep Time"
              value={form.sleepTime}
              onTimeChange={(time) => handleChange('sleepTime', time)}
            />
            <DropdownButton
              value={form.preferredWorkoutTime}
              placeholder="Select Preferred Workout Time"
              onPress={() => setShowWorkoutTimeDropdown(true)}
            />
            <DropdownButton
              value={form.motivationLevel}
              placeholder="Select Motivation Level"
              onPress={() => setShowMotivationDropdown(true)}
            />
          </View>
        )}
        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          {step > 0 && (
            <TouchableOpacity style={[styles.button, styles.backButton]} onPress={prevStep}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, !canNext() && styles.buttonDisabled]}
            onPress={nextStep}
            disabled={!canNext()}
          >
            <Text style={styles.buttonText}>{step === steps.length - 1 ? 'Create Account' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Dropdown Modals */}
      <DropdownModal
        visible={showGenderDropdown}
        onClose={() => setShowGenderDropdown(false)}
        options={genderOptions}
        onSelect={(value) => handleChange('gender', value)}
        title="Select Gender"
      />
      <DropdownModal
        visible={showFitnessDropdown}
        onClose={() => setShowFitnessDropdown(false)}
        options={fitnessLevelOptions}
        onSelect={(value) => handleChange('fitnessLevel', value)}
        title="Select Fitness Level"
      />
      <DropdownModal
        visible={showGoalDropdown}
        onClose={() => setShowGoalDropdown(false)}
        options={primaryGoalOptions}
        onSelect={(value) => handleChange('primaryGoal', value)}
        title="Select Primary Goal"
      />
      <DropdownModal
        visible={showWorkoutTimeDropdown}
        onClose={() => setShowWorkoutTimeDropdown(false)}
        options={workoutTimeOptions}
        onSelect={(value) => handleChange('preferredWorkoutTime', value)}
        title="Select Preferred Workout Time"
      />
      <DropdownModal
        visible={showMotivationDropdown}
        onClose={() => setShowMotivationDropdown(false)}
        options={motivationLevelOptions}
        onSelect={(value) => handleChange('motivationLevel', value)}
        title="Select Motivation Level"
      />
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
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7066F6',
    borderRadius: 4,
  },
  progressText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#7066F6',
  },
  stepNumber: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  formSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#23232b',
    color: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 16,
  },
  button: {
    backgroundColor: '#7066F6',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    minWidth: 140,
    shadowColor: '#7066F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    backgroundColor: '#333',
    shadowColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  // Dropdown styles
  dropdownButton: {
    width: '100%',
    backgroundColor: '#23232b',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    minHeight: 50,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#23232b',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#333',
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
  backNavBtn: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#23232b',
  },
  backNavBtnText: {
    color: '#7066F6',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 
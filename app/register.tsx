import { DropdownButton } from '@/components/DropDownButton';
import { DropdownModal } from '@/components/DropdownSelect';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ProtectedRoute } from '../components/ProtectedRoute';
import TimePicker from '../components/TimePicker';
import { useRegistrationForm } from '../hooks/useRegistrationForm';

const steps = [
  'Personal Info',
  'Health & Goals',
  'Preferences',
];

export default function RegistrationScreen({ onRegister }: { onRegister: (user: any) => void }) {
  const {
    // State
    step,
    form,
    choicesLoading,
    progress,
    
    // Dropdown states
    showGenderDropdown,
    showFitnessDropdown,
    showGoalDropdown,
    showWorkoutTimeDropdown,
    showMotivationDropdown,
    
    // Handlers
    handleChange,
    canNext,
    nextStep,
    prevStep,
    getOptions,
    
    // Dropdown handlers
    setShowGenderDropdown,
    setShowFitnessDropdown,
    setShowGoalDropdown,
    setShowWorkoutTimeDropdown,
    setShowMotivationDropdown,
    
    // Router
    router,
  } = useRegistrationForm(onRegister);

  return (
    <ProtectedRoute requireAuth={false}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#7066F6" />
        </TouchableOpacity>

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={100}
        >
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
                  options={getOptions('gender')}
                  placeholder="Select Gender"
                  onPress={() => setShowGenderDropdown(true)}
                  style={[styles.halfInput]}
                  disabled={choicesLoading || getOptions('gender').length === 0}
                />
              </View>
              <DropdownButton
                value={form.fitnessLevel}
                options={getOptions('fitness_level')}
                placeholder="Select Fitness Level"
                onPress={() => setShowFitnessDropdown(true)}
                disabled={choicesLoading || getOptions('fitness_level').length === 0}
              />
              <DropdownButton
                value={form.primaryGoal}
                options={getOptions('primary_goal')}
                placeholder="Select Primary Goal"
                onPress={() => setShowGoalDropdown(true)}
                disabled={choicesLoading || getOptions('primary_goal').length === 0}
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
                options={getOptions('preferred_workout_time')}
                placeholder="Select Preferred Workout Time"
                onPress={() => setShowWorkoutTimeDropdown(true)}
                disabled={choicesLoading || getOptions('preferred_workout_time').length === 0}
              />
              <DropdownButton
                value={form.motivationLevel}
                options={getOptions('motivation_level')}
                placeholder="Select Motivation Level"
                onPress={() => setShowMotivationDropdown(true)}
                disabled={choicesLoading}
              />
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.buttonRow}>
            {step > 0 && (
              <TouchableOpacity style={[styles.button, styles.formBackButton]} onPress={prevStep}>
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

          {/* Dropdown Modals */}
          <DropdownModal
            visible={showGenderDropdown}
            onClose={() => setShowGenderDropdown(false)}
            options={getOptions('gender')}
            onSelect={(option) => handleChange('gender', option)}
            title="Select Gender"
          />
          <DropdownModal
            visible={showFitnessDropdown}
            onClose={() => setShowFitnessDropdown(false)}
            options={getOptions('fitness_level')}
            onSelect={(option) => handleChange('fitnessLevel', option)}
            title="Select Fitness Level"
          />
          <DropdownModal
            visible={showGoalDropdown}
            onClose={() => setShowGoalDropdown(false)}
            options={getOptions('primary_goal')}
            onSelect={(option) => handleChange('primaryGoal', option)}
            title="Select Primary Goal"
          />
          <DropdownModal
            visible={showWorkoutTimeDropdown}
            onClose={() => setShowWorkoutTimeDropdown(false)}
            options={getOptions('preferred_workout_time')}
            onSelect={(option) => handleChange('preferredWorkoutTime', option)}
            title="Select Preferred Workout Time"
          />
          <DropdownModal
            visible={showMotivationDropdown}
            onClose={() => setShowMotivationDropdown(false)}
            options={getOptions('motivation_level')}
            onSelect={(option) => handleChange('motivationLevel', option)}
            title="Select Motivation Level"
          />
        </KeyboardAwareScrollView>
      </View>
    </ProtectedRoute> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#23232b',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 100,
    backgroundColor: '#18181b',
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
    padding: 16,
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
  formBackButton: {
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
});
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveUserData } from '../utils/storage';

const steps = [
  'Personal Info',
  'Health Info',
  'Confirm',
];

export default function RegistrationScreen({ onRegister }: { onRegister: (user: any) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const canNext = () => {
    if (step === 0) return form.name && form.email && form.password;
    if (step === 1) return form.height && form.weight && form.age && form.gender;
    return true;
  };

  const nextStep = async () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      await saveUserData(form);
      onRegister(form);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.stepper}>
        {steps.map((label, idx) => (
          <View key={label} style={[styles.stepDot, step === idx && styles.activeDot]} />
        ))}
      </View>
      <Text style={styles.title}>{steps[step]}</Text>
      {step === 0 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#aaa"
            value={form.name}
            onChangeText={v => handleChange('name', v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
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
        </>
      )}
      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            placeholderTextColor="#aaa"
            value={form.height}
            onChangeText={v => handleChange('height', v)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            placeholderTextColor="#aaa"
            value={form.weight}
            onChangeText={v => handleChange('weight', v)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#aaa"
            value={form.age}
            onChangeText={v => handleChange('age', v)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Gender (e.g. Male, Female)"
            placeholderTextColor="#aaa"
            value={form.gender}
            onChangeText={v => handleChange('gender', v)}
          />
        </>
      )}
      {step === 2 && (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>Name: <Text style={styles.confirmValue}>{form.name}</Text></Text>
          <Text style={styles.confirmText}>Email: <Text style={styles.confirmValue}>{form.email}</Text></Text>
          <Text style={styles.confirmText}>Height: <Text style={styles.confirmValue}>{form.height} cm</Text></Text>
          <Text style={styles.confirmText}>Weight: <Text style={styles.confirmValue}>{form.weight} kg</Text></Text>
          <Text style={styles.confirmText}>Age: <Text style={styles.confirmValue}>{form.age}</Text></Text>
          <Text style={styles.confirmText}>Gender: <Text style={styles.confirmValue}>{form.gender}</Text></Text>
        </View>
      )}
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
          <Text style={styles.buttonText}>{step === steps.length - 1 ? 'Finish' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
    padding: 24,
  },
  stepper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#7066F6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#23232b',
    color: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  button: {
    backgroundColor: '#7066F6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 120,
    marginHorizontal: 4,
  },
  backButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  confirmBox: {
    backgroundColor: '#23232b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    maxWidth: 320,
  },
  confirmText: {
    color: '#bbb',
    fontSize: 16,
    marginBottom: 8,
  },
  confirmValue: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 
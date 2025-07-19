import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUserData, saveUserData } from '../../utils/storage';

export default function PersonalDetailsScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await getUserData();
      if (user) setForm(user);
      setLoading(false);
    })();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    try {
      await saveUserData(form);
      Alert.alert('Success', 'Personal details updated!');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Could not save details');
    }
  };

  if (loading) return null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Edit Personal Details</Text>
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
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.inputHalf]}
          placeholder="Height (cm)"
          placeholderTextColor="#aaa"
          value={form.height}
          onChangeText={v => handleChange('height', v)}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.inputHalf]}
          placeholder="Weight (kg)"
          placeholderTextColor="#aaa"
          value={form.weight}
          onChangeText={v => handleChange('weight', v)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.inputHalf]}
          placeholder="Age"
          placeholderTextColor="#aaa"
          value={form.age}
          onChangeText={v => handleChange('age', v)}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.inputHalf]}
          placeholder="Gender"
          placeholderTextColor="#aaa"
          value={form.gender}
          onChangeText={v => handleChange('gender', v)}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
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
    borderWidth: 1,
    borderColor: '#333',
  },
  inputHalf: {
    width: '48%',
    marginRight: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
  },
  saveButton: {
    backgroundColor: '#7066F6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 120,
    marginTop: 16,
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#333',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 120,
    marginBottom: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 